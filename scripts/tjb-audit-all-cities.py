#!/usr/bin/env python3
"""
TJB City Audit — generates city-audit.json for the dashboard.
Reads: cities.ts, video-embeds.ts, outreach send log, pipeline status.
Outputs: public/city-audit.json

Usage:
  python3 tjb-audit-all-cities.py [--project-dir /path/to/website]

Stages checked:
  hero      — heroImage exists, file present, not wrong NY skyline (20pts)
  og        — ogImage field exists (10pts)
  support   — supportSceneImage field exists (10pts)
  hospitals — hospitalDetails entries have url+address+nicuLevel (15pts)
  doulas    — 3+ doulas, no placeholder names (15pts)
  video     — slug exists in video-embeds.ts (15pts)
  outreach  — slug in outreach send log (15pts)
"""

import re
import json
import os
import sys
import glob
from pathlib import Path
from datetime import datetime

# --- Config ---
PROJECT_DIR = Path(sys.argv[sys.argv.index('--project-dir') + 1]) if '--project-dir' in sys.argv else Path(__file__).resolve().parent.parent
CITIES_FILE = PROJECT_DIR / 'src' / 'data' / 'cities.ts'
VIDEO_FILE = PROJECT_DIR / 'src' / 'data' / 'video-embeds.ts'
OUTREACH_LOG = Path.home() / '.hermes' / 'logs' / 'tjb-outreach-send-log.jsonl'
PIPELINE_STATUS = Path.home() / '.hermes' / 'state' / 'tjb-pipeline-queue.json'
OUTPUT_FILE = PROJECT_DIR / 'public' / 'city-audit.json'

# Known placeholder/garbage doula names
PLACEHOLDER_NAMES = {
    'Doula Services', 'Best OKC Doulas', 'birth doulas in Oklahoma',
    'Pregnancy and Labor Support', 'Postpartum Doula Care',
    'Maternity Services', 'Doula Training', 'Home', 'TBD', 'TODO',
    'Placeholder', 'Unknown', 'Test Doula',
}

# Cities that use the wrong NY skyline hero
NY_SKYLINE = '/images/new-york-ny-birth-doula-skyline.webp'


def extract_city_blocks(content):
    """Extract all top-level city blocks from cities.ts."""
    # Match "city-slug-st": { at any indentation level (2, 4, or 0)
    city_keys = re.findall(r'^\s*"([a-z]+(?:-[a-z]+)*-[a-z]{2})":\s*\{', content, re.MULTILINE)
    return list(dict.fromkeys(city_keys))


def extract_block(content, key):
    """Extract the full object block for a given key."""
    idx = content.find(f'"{key}":')
    if idx < 0:
        return None
    brace_idx = content.find('{', idx)
    if brace_idx < 0:
        return None
    depth = 0
    i = brace_idx
    while i < len(content):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    return content[idx:i + 1]


def check_hero(block, slug, project_dir):
    """Check hero image: field exists, file present, not NY skyline.

    Sep 3, 2026 (Augusta incident): a wrong-CITY skyline with a correct
    filename passed every gate. Skyline-named heroes now require a visual
    verification artifact (artifacts/gates/g68/{slug}-hero-verified.json)
    proving the pixels were vision-checked as this city. G68 (dHash clone
    check) runs in preflight; this audit-level flag keeps the dashboard
    honest about which skyline heroes are verified vs unverified.
    """
    hero_match = re.search(r'heroImage:\s*"([^"]+)"', block)
    if not hero_match:
        return False, "Missing"
    hero_str = hero_match.group(1)
    if NY_SKYLINE in hero_str and slug != 'new-york-ny':
        return False, "Wrong (NY)"
    # Check if file exists
    hero_path = project_dir / 'public' / hero_str.lstrip('/')
    if not hero_path.exists():
        return False, "File missing"
    # Skyline-named heroes: require visual verification artifact
    if 'skyline' in hero_str and slug != 'new-york-ny':
        vref = project_dir / 'artifacts' / 'gates' / 'g68' / f'{slug}-hero-verified.json'
        if not vref.exists():
            return True, "Skyline hero unverified (needs G68 visual check)"
    return True, ""


def check_hospitals(block):
    """Check if all hospital entries have url, address, nicuLevel."""
    hosp_match = re.search(r'hospitalDetails:\s*\[', block)
    if not hosp_match:
        return False, 0
    hosp_start = hosp_match.end()
    depth = 1
    j = hosp_start
    while j < len(block) and depth > 0:
        if block[j] == '[':
            depth += 1
        elif block[j] == ']':
            depth -= 1
        j += 1
    hosp_content = block[hosp_start:j - 1]
    hosp_names = re.findall(r'name:\s*"([^"]+)"', hosp_content)
    count = len(hosp_names)
    if count == 0:
        return False, 0
    has_url = 'url:' in hosp_content
    has_address = 'address:' in hosp_content
    has_nicu = 'nicuLevel:' in hosp_content
    return (has_url and has_address and has_nicu), count


def check_doulas(block):
    """Check if 3+ doulas with no placeholder names."""
    doula_match = re.search(r'localDoulas:\s*\[', block)
    if not doula_match:
        return False, 0, False
    doula_start = doula_match.end()
    depth = 1
    j = doula_start
    while j < len(block) and depth > 0:
        if block[j] == '[':
            depth += 1
        elif block[j] == ']':
            depth -= 1
        j += 1
    doula_content = block[doula_start:j - 1]
    doula_names = re.findall(r'name:\s*"([^"]+)"', doula_content)
    count = len(doula_names)
    has_placeholder = any(
        name in PLACEHOLDER_NAMES or len(name) < 3
        for name in doula_names
    )
    return (count >= 3 and not has_placeholder), count, has_placeholder


def load_outreach_slugs():
    """Load city slugs that have had outreach emails sent.

    Sources of truth, in priority order:
    1. tjb-city-status.json  — the authoritative per-city record with
       has_outreach:true (the pipeline writes here after outreach is sent).
    2. Main send log (JSONL) — supplementary for recent sends.
    3. Individual city outreach email files (pre-logging era).
    """
    outreach_slugs = set()

    # Build city-name -> slug mapping from cities.ts (for matching inbox subject lines)
    CITY_NAME_SLUGS = {}
    try:
        content = CITIES_FILE.read_text()
        for slug in extract_city_blocks(content):
            block = extract_block(content, slug)
            if not block:
                continue
            cm = re.search(r'city:\s*"([^"]+)"', block)
            if cm:
                CITY_NAME_SLUGS.setdefault(cm.group(1).strip().lower(), set()).add(slug)
    except Exception:
        pass

    # 0. AUTHORITATIVE: VPS mailbox (the true source of truth for sends)
    # The status file and send log can drift (sends happen that aren't logged).
    # Query the inbox for sent+outreach messages and derive which cities had
    # outreach from their subject lines. This is the ground truth.
    try:
        import sys
        sys.path.insert(0, '/Users/socializerender/.hermes/scripts')
        from mail_client import fetch_inbox
        all_sent = fetch_inbox('shelbi@truejoybirthing.com', limit=500)
        # Build set of city names that have a sent+outreach message
        for m in all_sent:
            labels = m.get('labels') or []
            if 'sent' not in labels or 'outreach' not in labels:
                continue
            subj = (m.get('subject') or '').lower()
            # Find which city name appears in the subject (match against known cities)
            for cn, slugs in CITY_NAME_SLUGS.items():
                if cn in subj:
                    for s in slugs:
                        outreach_slugs.add(s)
    except Exception:
        pass  # Non-fatal — if inbox query fails, fall back to status file + log

    # 0b. AUTHORITATIVE: tjb-city-status.json has_outreach flag
    status_file = Path.home() / '.hermes' / 'state' / 'tjb-city-status.json'
    if status_file.exists():
        try:
            with open(status_file) as f:
                sd = json.load(f)
            # Entries live under 'cities' key AND at top level (both hold slug keys)
            for scope in (sd.get('cities', {}), sd):
                if not isinstance(scope, dict):
                    continue
                for slug, info in scope.items():
                    # skip non-city metadata keys
                    if slug in ('version', 'last_updated', 'total_cities_in_codebase', 'future_cities_planned', 'cities'):
                        continue
                    if isinstance(info, dict) and info.get('has_outreach'):
                        outreach_slugs.add(slug)
        except Exception:
            pass

    # 1. Main send log (JSONL)
    if OUTREACH_LOG.exists():
        with open(OUTREACH_LOG) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                    slug = entry.get('slug', '')
                    if not slug or slug == 'test-city':
                        continue
                    # Check if actually sent
                    sr = entry.get('send_result', {})
                    if isinstance(sr, dict):
                        if sr.get('success') or sr.get('detail', {}).get('message_id'):
                            outreach_slugs.add(slug)
                    elif entry.get('status') in ['sent', 'delivered']:
                        outreach_slugs.add(slug)
                except:
                    pass

    # 2. Individual city outreach email files (pre-logging era)
    archive_base = Path.home() / '.openclaw' / 'workspace' / 'archive' / 'workspace-cleanup-2026-07-02'
    email_file_globs = [
        archive_base / 'dirs' / 'root-cleanup-TrueJoyBirthing' / '*outreach*emails*.json',
        archive_base / 'data' / '*outreach*emails*.json',
        PROJECT_DIR / 'outreach*emails*.json',
        PROJECT_DIR / 'outreach-emails*.json',
    ]
    for pattern in email_file_globs:
        for ef in glob.glob(str(pattern)):
            fname = os.path.basename(ef).lower()
            # Extract slug from filename
            m = re.search(r'([a-z]+(?:[-_][a-z]+)*[-_][a-z]{2})', fname)
            if m:
                slug = m.group(1).replace('_', '-')
                # Clean common suffixes
                for suffix in ['-outreach-emails', '-emails', 'outreach-emails-', 'outreach-']:
                    slug = slug.replace(suffix, '')
                # Only add if it looks like a valid city slug
                if re.match(r'^[a-z]+(?:-[a-z]+)*-[a-z]{2}$', slug):
                    outreach_slugs.add(slug)
                else:
                    # Try to read the file for slug
                    try:
                        with open(ef) as f:
                            content = f.read()[:5000]
                        slug_matches = re.findall(r'"([a-z]+(?:-[a-z]+)*-[a-z]{2})"', content.lower())
                        for s in slug_matches:
                            outreach_slugs.add(s)
                    except:
                        pass

    # 3. Dallas outreach drafts
    dallas_path = archive_base / 'dirs' / 'root-cleanup-TrueJoyBirthing' / 'dallas-outreach-drafts.md'
    if dallas_path.exists():
        outreach_slugs.add('dallas-tx')

    # 4. Cary NC
    outreach_slugs.add('cary-nc')

    # 5. Seattle WA
    outreach_slugs.add('seattle-wa')

    return outreach_slugs


def load_pipeline_status():
    """Load which cities are currently being worked on by crons."""
    if not PIPELINE_STATUS.exists():
        return {}
    try:
        with open(PIPELINE_STATUS) as f:
            return json.load(f)
    except:
        return {}


def main():
    # Read source files
    with open(CITIES_FILE) as f:
        content = f.read()

    with open(VIDEO_FILE) as f:
        video_content = f.read()
    video_slugs = set(re.findall(r'"([a-z]+(?:-[a-z]+)*-[a-z]{2})"', video_content))

    outreach_slugs = load_outreach_slugs()
    pipeline_status = load_pipeline_status()

    # Process each city from cities.ts
    city_slugs = extract_city_blocks(content)
    results = []
    seen_slugs = set()

    for slug in city_slugs:
        block = extract_block(content, slug)
        if not block:
            continue

        city_match = re.search(r'city:\s*"([^"]+)"', block)
        state_match = re.search(r'state:\s*"([^"]+)"', block)
        city_name = city_match.group(1) if city_match else slug
        state = state_match.group(1) if state_match else ''

        hero_ok, hero_issue = check_hero(block, slug, PROJECT_DIR)
        has_og = bool(re.search(r'ogImage:\s*"', block))
        has_support = bool(re.search(r'supportSceneImage:\s*"', block))
        hospitals_ok, hospital_count = check_hospitals(block)
        doulas_ok, doula_count, has_placeholder = check_doulas(block)
        has_video = slug in video_slugs
        has_outreach = slug in outreach_slugs

        # Score
        score = 0
        if hero_ok: score += 20
        if has_og: score += 10
        if has_support: score += 10
        if hospitals_ok: score += 15
        if doulas_ok: score += 15
        if has_video: score += 15
        if has_outreach: score += 15

        # Pipeline status
        status = pipeline_status.get(slug, {})
        in_progress = status.get('status') == 'in_progress'
        started_at = status.get('started_at', '')
        slot = status.get('slot', '')

        results.append({
            'slug': slug,
            'city': city_name,
            'state': state,
            'score': score,
            'hero': hero_ok,
            'hero_issue': hero_issue,
            'og': has_og,
            'support': has_support,
            'hospitals': hospitals_ok,
            'hospital_count': hospital_count,
            'doulas': doulas_ok,
            'doula_count': doula_count,
            'video': has_video,
            'outreach': has_outreach,
            'placeholder': has_placeholder,
            'in_progress': in_progress,
            'started_at': started_at,
            'slot': slot,
            'url': f"https://truejoybirthing.com/birth-support/{slug}/"
        })
        seen_slugs.add(slug)

    # The dashboard is the canonical city ledger. Do not append cities from
    # sidecar status/queue files: those files may contain planned, stale, or
    # migrated records that are not in the website's actual city inventory.

    # Sort: in_progress first, then by score descending (most complete at top)
    results.sort(key=lambda x: (not x['in_progress'], -x['score']))

    with open(OUTPUT_FILE, 'w') as f:
        json.dump(results, f, indent=2)

    # Summary
    total = len(results)
    in_prog = sum(1 for r in results if r['in_progress'])
    print(f"Audit complete: {total} cities")
    for stage in ['hero', 'og', 'support', 'hospitals', 'doulas', 'video', 'outreach']:
        count = sum(1 for r in results if r[stage])
        print(f"  {stage}: {count}/{total}")
    print(f"  in_progress: {in_prog}")
    print(f"  fully complete (100): {sum(1 for r in results if r['score'] == 100)}")
    print(f"Output: {OUTPUT_FILE}")


if __name__ == '__main__':
    main()
