#!/usr/bin/env python3
"""S11-live — fetch each live city OG image and run S11 content checks on it.

Born 2026-09-11 (Hayward OG follow-up): corona-ca + san-diego-ca same-class
defects were found by a MANUAL sweep on 2026-09-10 — no cron measured live OG
content. This closes that gap: every run downloads the live og:image for each
target city and applies the same S11 thresholds (dims 1200x630, content bbox
>=92% of width AND height, density >=30%).

Target list: cities with a video embed (src/data/video-embeds.ts) — the same
list the daily site-health-sweep.sh checks. Weekly full-corpus coverage comes
from site-health-sweep.sh's Saturday mode running scripts/check-og-content.py
directly over all slugs.

Usage:
  python3 scripts/check-og-live-sweep.py [slug ...]   # default: embed-list cities
Exit 0 = all pass. Exit 1 = failures listed. --write-report dumps JSON.
"""
import importlib.util
import json
import os
import re
import sys
import tempfile
import urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITIES_TS = os.path.join(REPO, 'src', 'data', 'cities.ts')
EMBEDS_TS = os.path.join(REPO, 'src', 'data', 'video-embeds.ts')
SITE = 'https://truejoybirthing.com'
UA = {'User-Agent': 'Mozilla/5.0 (TJB-health-sweep; +https://truejoybirthing.com)'}


def load_spec():
    """Return {slug: live_og_url} for every city with an explicit ogImage."""
    src = open(CITIES_TS).read()
    out = {}
    for m in re.finditer(r'"([a-z0-9-]+)": \{', src):
        slug = m.group(1)
        window = src[m.end():m.end() + 30000]
        nxt = re.search(r'"[a-z0-9-]+": \{', window[100:])
        block = window[:100 + nxt.start()] if nxt else window
        og = re.search(r'ogImage: "([^"]+?)(?:\?[^"]*)?"', block)
        if og:
            url = og.group(1)
            if not url.startswith('http'):
                url = SITE + url
            out[slug] = url
    return out


def embed_slugs():
    if not os.path.exists(EMBEDS_TS):
        return []
    src = open(EMBEDS_TS).read()
    return re.findall(r'"([a-z]+(?:-[a-z]+)*-[a-z]{2})":\s*\{', src)


def fetch(url, dest, timeout=30):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    if len(data) < 1000:
        raise ValueError(f'suspiciously small ({len(data)}B)')
    open(dest, 'wb').write(data)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    spec = load_spec()
    if args:
        slugs = [s for s in args if s in spec]
        missing = [s for s in args if s not in spec]
        for s in missing:
            print(f'FAIL {s}: no ogImage in cities.ts')
    else:
        slugs = [s for s in embed_slugs() if s in spec]

    spec_mod = importlib.util.spec_from_file_location(
        'check_og_content', os.path.join(REPO, 'scripts', 'check-og-content.py'))
    og = importlib.util.module_from_spec(spec_mod)
    spec_mod.loader.exec_module(og)

    fails, report = [], {}
    with tempfile.TemporaryDirectory() as td:
        for slug in sorted(slugs):
            entry = {'url': spec[slug]}
            path = os.path.join(td, f'{slug}.img')
            try:
                fetch(spec[slug], path)
                w, h, cov_x, cov_y, density = og.measure(path)
                entry.update(dims=f'{w}x{h}', cov_x=round(cov_x, 2),
                             cov_y=round(cov_y, 2), density=round(density, 2))
                reasons = []
                if (w, h) != (1200, 630):
                    reasons.append(f'dims {w}x{h} != 1200x630')
                if cov_x < 0.92:
                    reasons.append(f'content covers {cov_x:.0%} of width')
                if cov_y < 0.92:
                    reasons.append(f'content covers {cov_y:.0%} of height')
                if density < 0.30:
                    reasons.append(f'density {density:.0%} < 30%')
                if reasons:
                    fails.append((slug, '; '.join(reasons)))
                    entry['verdict'] = 'FAIL'
                else:
                    entry['verdict'] = 'PASS'
            except Exception as e:
                fails.append((slug, f'fetch/decode error: {e}'))
                entry['verdict'] = 'FAIL'
                entry['error'] = str(e)[:200]
            report[slug] = entry

    for slug, detail in fails:
        print(f'FAIL {slug}: {detail}')
    print(f'---\nS11-live: {len(slugs) - len(fails)}/{len(slugs)} pass')
    if '--write-report' in sys.argv:
        out = os.path.join(REPO, 'artifacts', 'gates', 'og-live-report.json')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        json.dump(report, open(out, 'w'), indent=1)
        print(f'report: {out}')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()