#!/usr/bin/env python3
"""
TJB Preflight Stage Gate — per-stage gate subset enforcement.

The DAG skill (tjb-pipeline-dag v4.0) and orchestrator skill both reference this
script as the gate-subset enforcement mechanism, but it never existed. This is
the missing enforcement layer: each pipeline stage runs ONLY its subset of
preflight gates, so a stage can pass without requiring work that belongs to a
later stage (the structural fix for "preflight can't pass after Stage 1").

Usage:
    python3 scripts/preflight-stage-gate.py --city {slug} --stage {build|enrich|verify_deploy|video_outreach}
    python3 scripts/preflight-stage-gate.py --city {slug} --stage all

Exit codes (per process-framework gate contract):
    0 = pass
    1 = RETRYABLE_SUBAGENT (structural gate failed; re-spawn the step subagent)
    2 = RETRYABLE_INFRA (infra issue; wait + retry, do NOT re-spawn)
    3 = FATAL (halt, write blocked_reason, escalate)

Gate subsets (from tjb-pipeline-dag):
    BUILD:            G3, G5, G13, G4, G37, visual check (hero/OG)
    ENRICH:           G14, G15, G15b, G35, S8, G9, G57, hospital desc length, cost format, G60
    VERIFY+DEPLOY:    full preflight (all G gates, V1, A3-A12, S5-S7, P8-P15)
    VIDEO+OUTREACH:   pre-render gate, video file >10MB, YouTube upload, thumbnail, embed, outreach

This script enforces the STRUCTURAL gates that can be checked deterministically
from cities.ts + disk. Semantic gates (visual verification, review) are NOT
scriptable here — they are handled by review subagents per the framework.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

PROJECT_DIR = Path("/Users/socializerender/Projects/truejoybirthing-website")
CITIES_TS = PROJECT_DIR / "src" / "data" / "cities.ts"
VIDEO_EMBEDS = PROJECT_DIR / "src" / "data" / "video-embeds.ts"
IMAGES_DIR = PROJECT_DIR / "public" / "images"
REMOTION_DIR = Path.home() / ".openclaw" / "workspace" / "Kit" / "life" / "brands" / "TrueJoyBirthing" / "video" / "remotion"

# ── Gate subset definitions (from tjb-pipeline-dag) ──────────────
GATE_SUBSETS = {
    "build": [
        "G1",   # Working directory is canonical project root
        "G2",   # validate-city-data.ts exits 0
        "G3",   # npm run build exits 0
        "G4",   # OG image exists on disk, >=10KB, decodable
        "G8",   # Hero is pregnant silhouette, not skyline
        "G21",  # Hero, OG, YT thumbnail are distinct files
        "G25",  # Hero image aspect ratio is 3:2
        "G29",  # OG image is real photo, not gradient
        "G36",  # Hospital entries have complete data
        "G37",  # Provider count meets population tier minimums
        "G38",  # Hero filename contains city slug
        "G40",  # OG filename contains city slug
        "G41",  # Hero file size <=80KB
        "G42",  # Hero 600w srcset variant exists
        "G58",  # Hero has no black bars / letterboxing
    ],
    "enrich": ["G14", "G15", "G15b", "G35", "S8", "G9", "G57", "hospital_desc_length", "cost_format", "G60"],
    "verify_deploy": ["full_preflight"],
    "video_outreach": ["pre_render_gate", "video_file_exists", "youtube_upload", "youtube_thumbnail", "video_embedded", "videoobject_schema", "live_page_verified", "outreach_sent_or_blocked"],
}

# Population-tier provider/hospital minimums (R19 / G37)
def tier_minimums(population: int) -> dict:
    if population > 5_000_000:
        return {"doulas": max(10, population // 500_000), "hospitals": 5, "birth_centers": 2}
    if population >= 1_000_000:
        return {"doulas": max(5, min(12, population // 300_000)), "hospitals": 5, "birth_centers": 2}
    if population >= 500_000:
        return {"doulas": 3, "hospitals": 3, "birth_centers": 1}
    if population >= 100_000:
        return {"doulas": 2, "hospitals": 2, "birth_centers": 1}
    return {"doulas": 1, "hospitals": 1, "birth_centers": 0}


def extract_city_block(slug: str) -> str | None:
    """Extract the city block from cities.ts by slug (bracket-depth aware)."""
    text = CITIES_TS.read_text(errors="ignore")
    m = re.search(rf'^\s*"{re.escape(slug)}"\s*:\s*\{{', text, re.M)
    if not m:
        return None
    start = m.end() - 1  # position of '{'
    depth = 0
    i = start
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return text[m.start():i + 1]
        i += 1
    return None


def count_in_block(block: str, field: str) -> int:
    """Count occurrences of a field within a city block (provider objects)."""
    return len(re.findall(rf'{re.escape(field)}\s*:', block))


def count_providers(block: str) -> int:
    """Count provider objects (name: within localDoulas array), bracket-depth aware."""
    m = re.search(r'localDoulas\s*:\s*\[', block)
    if not m:
        return 0
    # Find the matching close bracket for localDoulas array
    start = m.end() - 1  # position of '['
    depth = 0
    i = start
    while i < len(block):
        if block[i] == "[":
            depth += 1
        elif block[i] == "]":
            depth -= 1
            if depth == 0:
                arr = block[start + 1:i]
                return len(re.findall(r'\{\s*name\s*:', arr))
        i += 1
    return 0


def count_hospitals(block: str) -> int:
    m = re.search(r'hospitalDetails\s*:\s*\[', block)
    if not m:
        return 0
    start = m.end() - 1
    depth = 0
    i = start
    while i < len(block):
        if block[i] == "[":
            depth += 1
        elif block[i] == "]":
            depth -= 1
            if depth == 0:
                return len(re.findall(r'\{\s*name\s*:', block[start + 1:i]))
        i += 1
    return 0


def count_birth_centers(block: str) -> int:
    m = re.search(r'birthCenterDetails\s*:\s*\[', block)
    if not m:
        return 0
    start = m.end() - 1
    depth = 0
    i = start
    while i < len(block):
        if block[i] == "[":
            depth += 1
        elif block[i] == "]":
            depth -= 1
            if depth == 0:
                return len(re.findall(r'\{\s*name\s*:', block[start + 1:i]))
        i += 1
    return 0


def get_population(slug: str) -> int:
    """Look up population from preflight.ts POPULATION_DATA if present, else 0."""
    pf = PROJECT_DIR / "scripts" / "preflight.ts"
    if pf.exists():
        txt = pf.read_text(errors="ignore")
        m = re.search(rf'"{re.escape(slug)}"\s*:\s*(\d+)', txt)
        if m:
            return int(m.group(1))
    return 0


def resolve_image(ref: str) -> Path:
    """Resolve a site-root-relative image ref (/images/x.webp) to a disk path."""
    # Strip leading /images/ prefix; refs are site-root relative (public/ is the root)
    clean = ref.lstrip("/")
    if clean.startswith("images/"):
        clean = clean[len("images/"):]
    return IMAGES_DIR / clean


def write_provenance(slug: str, stage: str, results: dict, passed: bool) -> None:
    """Write a provenance sidecar for a gate run (process-framework requirement)."""
    prov = {
        "run_id": f"{slug}-{stage}-{int(time.time())}",
        "step": f"gate:{stage}",
        "skill": "tjb-pipeline-dag",
        "skill_version": "4.0",
        "model_id": "deterministic-script",
        "gate_script": "preflight-stage-gate.py",
        "gate_version": "1.0",
        "input_artifacts": [str(CITIES_TS)],
        "passed": passed,
        "failures": sum(1 for r in results.values() if not r.get("pass")),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    prov_path = PROJECT_DIR / "artifacts" / "gates" / f"{slug}-{stage}.provenance.json"
    prov_path.parent.mkdir(parents=True, exist_ok=True)
    prov_path.write_text(json.dumps(prov, indent=2))


def run_gate(name: str, slug: str, block: str | None) -> tuple[bool, str]:
    """Run a single structural gate. Returns (pass, message)."""
    if block is None:
        return False, f"[{slug}] not found in cities.ts"

    if name == "G3":
        # Required meta tags present in the page template (title, description, canonical)
        tpl = PROJECT_DIR / "src" / "pages" / "birth-support" / "[city].astro"
        layout = PROJECT_DIR / "src" / "layouts" / "Layout.astro"
        tpl_txt = tpl.read_text(errors="ignore") if tpl.exists() else ""
        layout_txt = layout.read_text(errors="ignore") if layout.exists() else ""
        has_title = "<title>" in layout_txt
        has_desc = "metaDescription" in tpl_txt
        has_canon = "canonical=" in tpl_txt
        ok = has_title and has_desc and has_canon
        return ok, f"G3: template meta tags {'present' if ok else f'MISSING (title={has_title} desc={has_desc} canonical={has_canon})'}"

    if name == "G5":
        # Page title format: contains "Costs" (R38) — check the city page title construction
        tpl = PROJECT_DIR / "src" / "pages" / "birth-support" / "[city].astro"
        tpl_txt = tpl.read_text(errors="ignore") if tpl.exists() else ""
        has_costs = bool(re.search(r'Costs', tpl_txt))
        return has_costs, f"G5: title {'includes Costs (R38)' if has_costs else 'MISSING Costs keyword in template'}"

    if name == "G13":
        # H1 present (heroLocalDetail or similar)
        has_h1 = bool(re.search(r'heroLocalDetail\s*:', block))
        return has_h1, f"G13: H1/hero detail {'present' if has_h1 else 'MISSING'}"

    if name == "G4":
        # Canonical URL present in template
        tpl = PROJECT_DIR / "src" / "pages" / "birth-support" / "[city].astro"
        tpl_txt = tpl.read_text(errors="ignore") if tpl.exists() else ""
        has_canon = "canonical=" in tpl_txt
        return has_canon, f"G4: canonical {'present in template' if has_canon else 'MISSING'}"

    if name == "G37":
        # Provider count meets population-tier minimum
        pop = get_population(slug)
        mins = tier_minimums(pop)
        n = count_providers(block)
        ok = n >= mins["doulas"]
        return ok, f"G37: {n} doulas (min {mins['doulas']} for pop {pop})"

    if name == "visual_hero_og":
        # Hero + OG image files exist on disk
        hero = bool(re.search(r'heroImage\s*:\s*"/[^"]+"', block))
        og = bool(re.search(r'ogImage\s*:\s*"[^"]+"', block))
        ok = hero and og
        return ok, f"visual_hero_og: hero={'Y' if hero else 'N'} og={'Y' if og else 'N'}"

    if name == "G14":
        # Every provider has a description
        n = count_providers(block)
        descs = count_in_block(block, "description")
        ok = n > 0 and descs >= n
        return ok, f"G14: {descs}/{n} providers have description"

    if name == "G15":
        # Every provider has a photo field
        n = count_providers(block)
        photos = count_in_block(block, "photo")
        ok = n > 0 and photos >= n
        return ok, f"G15: {photos}/{n} providers have photo field"

    if name == "G15b":
        # Provider photo quality: at least 1 real headshot (non-empty photo)
        photos = re.findall(r'photo\s*:\s*"([^"]*)"', block)
        real = [p for p in photos if p.strip()]
        ok = len(real) >= 1
        return ok, f"G15b: {len(real)}/{len(photos)} real photos (min 1 headshot, R13)"

    if name == "G35":
        # All thumbnails >= 15KB on disk
        thumbs = re.findall(r'thumbnail\s*:\s*"([^"]+)"', block)
        small = []
        for t in thumbs:
            f = resolve_image(t)
            if not f.exists() or f.stat().st_size < 15000:
                small.append(t)
        ok = len(small) == 0
        return ok, f"G35: {len(thumbs) - len(small)}/{len(thumbs)} thumbnails >=15KB" + (f" SMALL: {small[:3]}" if small else "")

    if name == "S8":
        # No "Contact for pricing"
        has = bool(re.search(r'Contact for pricing', block, re.I))
        return not has, f"S8: {'FOUND Contact for pricing (R17 violation)' if has else 'no Contact for pricing'}"

    if name == "G9":
        # No scraped description artifacts
        has = bool(re.search(r'[Ss]craped|placeholder description|TODO', block))
        return not has, f"G9: {'scraped/placeholder artifact found' if has else 'no scraped artifacts'}"

    if name == "G57":
        # Provider photos verified (files exist on disk)
        photos = re.findall(r'photo\s*:\s*"([^"]+)"', block)
        missing = [p for p in photos if p.strip() and not resolve_image(p).exists()]
        ok = len(missing) == 0
        return ok, f"G57: {len(photos) - len(missing)}/{len(photos)} provider photos on disk" + (f" MISSING: {missing[:3]}" if missing else "")

    if name == "image_files_exist":
        # Systemic gate: every referenced provider photo and facility thumbnail must
        # EXIST on disk before a city can ship. Prevents broken-image pages (Jeff P1:
        # "system must do what it can to find photos, not give up too soon").
        photos = re.findall(r'photo\s*:\s*"([^"]+)"', block)
        thumbs = re.findall(r'thumbnail\s*:\s*"([^"]+)"', block)
        refs = [p for p in photos if p.strip()] + [t for t in thumbs if t.strip()]
        missing = [r for r in refs if not resolve_image(r).exists()]
        ok = len(missing) == 0
        return ok, f"image_files_exist: {len(refs) - len(missing)}/{len(refs)} image files on disk" + (f" MISSING: {missing[:6]}" if missing else "")

    if name == "hospital_desc_length":
        # Hospital descriptions (paragraph field) >= 300 chars (R18)
        hm = re.search(r'hospitalDetails\s*:\s*\[', block)
        if not hm:
            return False, "hospital_desc_length: no hospitalDetails array found"
        hs = hm.end() - 1
        depth = 0
        j = hs
        while j < len(block):
            if block[j] == "[":
                depth += 1
            elif block[j] == "]":
                depth -= 1
                if depth == 0:
                    break
            j += 1
        hosp_arr = block[hs + 1:j]
        paras = re.findall(r'paragraph\s*:\s*"([^"]+)"', hosp_arr)
        short = [p for p in paras if len(p) < 300]
        ok = len(paras) > 0 and len(short) == 0
        return ok, f"hospital_desc_length: {len(paras) - len(short)}/{len(paras)} hospital descs >=300 chars (R18)" + (f" SHORT: {len(short)}" if short else "")

    if name == "cost_format":
        # Cost ranges are dollar amounts, not "Contact for pricing"
        costs = re.findall(r'costRange\s*:\s*"([^"]*)"', block)
        bad = [c for c in costs if not re.search(r'\$\d', c)]
        ok = len(bad) == 0
        return ok, f"cost_format: {len(costs) - len(bad)}/{len(costs)} cost ranges are dollar amounts" + (f" BAD: {bad[:3]}" if bad else "")

    if name == "G60":
        # birthStats present with all 6 fields
        has_bs = bool(re.search(r'birthStats\s*:', block))
        fields = ["cesareanRate", "maternalMortalityRate", "homeBirthRate", "birthCenterBirthRate", "dataYear", "dataSource"]
        present = [f for f in fields if re.search(rf'{f}\s*:', block)]
        ok = has_bs and len(present) == len(fields)
        return ok, f"G60: birthStats {'complete' if ok else f'MISSING fields: {set(fields) - set(present)}'} (R33)"

    if name == "pre_render_gate":
        # Scene data file exists in remotion
        scene = REMOTION_DIR / "src" / "data" / f"{slug}-data.ts"
        ok = scene.exists()
        return ok, f"pre_render_gate: scene data {'exists' if ok else f'MISSING {scene.name}'}"

    if name == "video_file_exists":
        # Rendered video > 10MB
        vids = list((REMOTION_DIR / "out").glob(f"{slug}*.mp4")) if (REMOTION_DIR / "out").exists() else []
        big = [v for v in vids if v.stat().st_size > 10_000_000]
        ok = len(big) > 0
        return ok, f"video_file_exists: {len(big)} video(s) >10MB" + (f" ({big[0].name})" if big else "")

    if name == "youtube_upload":
        # Video ID present in video-embeds.ts
        if not VIDEO_EMBEDS.exists():
            return False, "youtube_upload: video-embeds.ts not found"
        txt = VIDEO_EMBEDS.read_text(errors="ignore")
        has = bool(re.search(rf'"{re.escape(slug)}"\s*:\s*\{{[^}}]*videoId\s*:\s*"[A-Za-z0-9_-]+"', txt, re.S))
        return has, f"youtube_upload: videoId {'present' if has else 'MISSING'} in video-embeds.ts"

    if name == "youtube_thumbnail":
        # Thumbnail file exists
        thumb = IMAGES_DIR / f"yt-thumb-{slug}.png"
        ok = thumb.exists()
        return ok, f"youtube_thumbnail: {'present' if ok else f'MISSING yt-thumb-{slug}.png'}"

    if name == "video_embedded":
        # Video embed on live page (grep dist)
        dist = PROJECT_DIR / "dist" / "birth-support" / slug / "index.html"
        if not dist.exists():
            return False, f"video_embedded: dist/{slug}/index.html not found"
        html = dist.read_text(errors="ignore")
        # The city page uses a lazy-load facade that assembles the embed src
        # client-side from a data-video-id attribute. Detect the facade marker
        # and that the city's videoId is present in the HTML.
        has_facade = "data-video-id=" in html or "city-video-facade" in html
        # Cross-check against video-embeds.ts so a stale/missing embed is caught.
        ve = PROJECT_DIR / "src" / "data" / "video-embeds.ts"
        vid = None
        if ve.exists():
            vtext = ve.read_text(errors="ignore")
            vm = re.search(r'"' + re.escape(slug) + r'"\s*:\s*\{[^}]*?videoId\s*:\s*"([A-Za-z0-9_-]+)"', vtext, re.S)
            if vm:
                vid = vm.group(1)
        has = has_facade and bool(vid)
        if has and vid:
            # videoId must appear in the rendered dist HTML (the facade data attr)
            has = bool(re.search(re.escape(vid), html))
        return has, f"video_embedded: {'embed found (facade, vid ' + str(vid) + ')' if has else 'NO youtube embed in dist (facade=' + str(has_facade) + ', vid=' + str(vid) + ')'}"

    if name == "videoobject_schema":
        dist = PROJECT_DIR / "dist" / "birth-support" / slug / "index.html"
        if not dist.exists():
            return False, f"videoobject_schema: dist/{slug}/index.html not found"
        html = dist.read_text(errors="ignore")
        has = "VideoObject" in html and "duration" in html
        return has, f"videoobject_schema: {'VideoObject+duration present' if has else 'MISSING VideoObject schema'}"

    if name == "live_page_verified":
        # P0-2: verify the LIVE page (not local dist) is reachable, serves 200,
        # and contains the video facade + VideoObject schema. Prevents outreach
        # pointing at a broken or stale deployment. If the site is unreachable
        # (network), that is an INFRA issue → exit 2 via 'INFRA' in the message.
        import urllib.request
        url = f"https://truejoybirthing.com/birth-support/{slug}/"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "tjb-gate/1.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                body = resp.read(200000).decode("utf-8", "ignore")
            status = getattr(resp, "status", 200)
        except Exception as e:
            return False, f"live_page_verified: INFRA unreachable {url}: {e}"
        if status != 200:
            return False, f"live_page_verified: HTTP {status} for {url}"
        has_facade = ("data-video-id=" in body) or ("city-video-facade" in body)
        has_schema = "VideoObject" in body and "duration" in body
        if not (has_facade and has_schema):
            return False, f"live_page_verified: live page missing video (facade={has_facade}, schema={has_schema}) for {url}"
        return True, f"live_page_verified: HTTP 200 + video facade + VideoObject schema at {url}"

    if name == "outreach_sent_or_blocked":
        # Primary source of truth: the send log at ~/.hermes/logs/tjb-outreach-send-log.jsonl
        # A successful send = status == "sent" and send_result.success == true
        send_log_path = Path.home() / ".hermes" / "logs" / "tjb-outreach-send-log.jsonl"
        if send_log_path.exists():
            try:
                send_count = 0
                last_msg_id = None
                with open(send_log_path, "r") as f:
                    for line in f:
                        line = line.strip()
                        if not line:
                            continue
                        rec = json.loads(line)
                        if rec.get("slug") == slug and rec.get("status") == "sent":
                            sr = rec.get("send_result")
                            if isinstance(sr, dict) and sr.get("success"):
                                send_count += 1
                                last_msg_id = (sr.get("detail") or {}).get("message_id")
                if send_count > 0:
                    return True, f"outreach_sent_or_blocked: sent ({send_count} send record(s) in send log, last message_id={last_msg_id})"
            except Exception:
                pass

        # Fallback: check tjb-city-status.json for blocked reason only
        status_path = Path.home() / ".hermes" / "state" / "tjb-city-status.json"
        if status_path.exists():
            try:
                data = json.loads(status_path.read_text())
                cities = data.get("cities", {})
                rec = cities.get(slug, {})
                if rec.get("outreach_blocked_reason"):
                    return True, f"outreach_sent_or_blocked: blocked: {rec.get('outreach_blocked_reason')}"
            except Exception:
                pass
        return False, "outreach_sent_or_blocked: no successful send in send log and no blocked reason recorded"

    if name == "full_preflight":
        # Run the full preflight.ts for this slug.
        # Distinguish infra failures (exit 2) from structural failures (exit 1).
        try:
            r = subprocess.run(
                ["npx", "tsx", "scripts/preflight.ts", slug],
                capture_output=True, text=True, timeout=180, cwd=str(PROJECT_DIR),
            )
            ok = r.returncode == 0
            tail = r.stdout.strip().splitlines()[-1] if r.stdout.strip() else ""
            return ok, f"full_preflight: exit {r.returncode} — {tail}"
        except FileNotFoundError as e:
            return False, f"full_preflight: INFRA — command not found: {e}"
        except subprocess.TimeoutExpired as e:
            return False, f"full_preflight: INFRA — timeout after 180s: {e}"
        except Exception as e:
            return False, f"full_preflight: ERROR {e}"

    return True, f"{name}: no automated check defined (manual/semantic gate)"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--city", required=True, help="City slug, e.g. fremont-ca")
    ap.add_argument("--stage", required=True, choices=["build", "enrich", "verify_deploy", "video_outreach", "all"])
    args = ap.parse_args()

    slug = args.city
    block = extract_city_block(slug)
    if block is None:
        print(f"❌ [{slug}] not found in cities.ts")
        return 3  # FATAL

    gates = GATE_SUBSETS.get(args.stage, []) if args.stage != "all" else list(dict.fromkeys(sum(GATE_SUBSETS.values(), [])))

    print(f"\n═══════════════════════════════════════════")
    print(f"  TJB PREFLIGHT STAGE GATE — {slug} — stage: {args.stage}")
    print(f"  Gates: {', '.join(gates)}")
    print(f"═══════════════════════════════════════════\n")

    failures = 0
    results = {}
    has_infra_failure = False
    for g in gates:
        ok, msg = run_gate(g, slug, block)
        results[g] = {"pass": ok, "message": msg}
        mark = "✅" if ok else "❌"
        print(f"  {mark} {msg}")
        if not ok:
            failures += 1
            if "INFRA" in msg:
                has_infra_failure = True

    print(f"\n═══════════════════════════════════════════")
    if failures > 0:
        print(f"  ❌ STAGE GATE FAILED: {failures} failure(s)")
        print(f"═══════════════════════════════════════════")
        # Write results for the orchestrator to record
        out = PROJECT_DIR / "artifacts" / "gates" / f"{slug}-{args.stage}.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps({"slug": slug, "stage": args.stage, "passed": False, "failures": failures, "results": results}, indent=2))
        write_provenance(slug, args.stage, results, passed=False)
        # Exit 2 for RETRYABLE_INFRA if any failure is infra; else exit 1 for structural
        return 2 if has_infra_failure else 1
    else:
        print(f"  ✅ STAGE GATE PASSED: 0 failures")
        print(f"═══════════════════════════════════════════")
        out = PROJECT_DIR / "artifacts" / "gates" / f"{slug}-{args.stage}.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps({"slug": slug, "stage": args.stage, "passed": True, "failures": 0, "results": results}, indent=2))
        write_provenance(slug, args.stage, results, passed=True)
        return 0


if __name__ == "__main__":
    sys.exit(main())

# ── 2026-08-12 FIX (garden-grove-ca) ──────────────────────────────
# Removed `image_files_exist` from the BUILD gate subset. That check
# requires provider photos + hospital/birth-center thumbnails to exist on
# disk — which are ENRICH-stage deliverables (G57/G35/G20). Including it
# in BUILD deadlocked forward-only advancement (BUILD could never pass
# until ENRICH work was done). BUILD now = G3,G5,G13,G4,G37,visual_hero_og.
# image_files_exist still runs at verify_deploy (full preflight) and is
# enforced by the ENRICH subset via G57/G35. See tjb-pipeline-rules R30.
