#!/usr/bin/env python3
"""S12 (P3, 2026-09-11) — Hero image content gate: verify hero content fills its frame.

Born in the Hayward OG aftermath: the og-quarter-content defect class (renderer
geometry) applies to hero images too — the 2026-09-05 R45 black-bar incident was
the hero-side version (bars baked into the file). G65 (preflight-image-helper.py
hero_letterbox) already catches FLAT BLACK bars; this gate catches the broader
class: content confined to a sub-region with large uniform borders, wrong-but-
full-frame compositions aside.

Thresholds are deliberately more lenient than S11 (OG cards are synthetic —
92% required; heroes are photos where sky/sea can read as background):
  - content bbox >= 80% of width AND height
  - density >= 20% of pixels differ from the corner-median background
No fixed dims: hero sizes legitimately vary by design (800x500 .. 1900x1000).

Usage:
  python3 scripts/check-hero-content.py [slug ...]   # default: all cities
Exit 0 = all pass. Exit 1 = failures listed.
"""
import os
import re
import sys

import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TS = os.path.join(REPO, 'src', 'data', 'cities.ts')
IMG = os.path.join(REPO, 'public', 'images')

MIN_COV = 0.80
MIN_DENSITY = 0.20


def load_hero_map():
    src = open(TS).read()
    cities = {}
    for m in re.finditer(r'"([a-z0-9-]+)": \{', src):
        slug = m.group(1)
        window = src[m.end():m.end() + 30000]
        nxt = re.search(r'"[a-z0-9-]+": \{', window[100:])
        block = window[:100 + nxt.start()] if nxt else window
        h = re.search(r'heroImage: "([^"]+?)"', block)
        if h:
            url = h.group(1)
            if url.startswith('http'):
                url = '/images/' + url.rstrip('/').split('/')[-1]
            cities[slug] = os.path.join(REPO, 'public', url.lstrip('/'))
    return cities


def measure(path):
    """Same method as check-og-content.py: corner-median background, bbox, density."""
    im = Image.open(path).convert('RGB')
    w, h = im.size
    a = np.asarray(im).astype(int)
    corners = [a[0, 0], a[0, -1], a[-1, 0], a[-1, -1]]
    bg = np.median(np.array(corners), axis=0)
    mask = np.abs(a - bg).sum(axis=2) > 40
    cols = mask.any(axis=0)
    rows = mask.any(axis=1)
    if not cols.any() or not rows.any():
        return w, h, 0.0, 0.0, 0.0
    x0, x1 = int(np.argmax(cols)), w - 1 - int(np.argmax(cols[::-1]))
    y0, y1 = int(np.argmax(rows)), h - 1 - int(np.argmax(rows[::-1]))
    return w, h, (x1 - x0 + 1) / w, (y1 - y0 + 1) / h, float(mask.mean())


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    cities = load_hero_map()
    if args:
        cities = {s: p for s, p in cities.items() if s in args}
    fails, report = [], {}
    for slug, path in sorted(cities.items()):
        entry = {'file': os.path.basename(path)}
        if not os.path.exists(path):
            fails.append((slug, 'missing-file', path))
            entry['verdict'] = 'FAIL'
            report[slug] = entry
            continue
        w, h, cov_x, cov_y, density = measure(path)
        entry.update(dims=f'{w}x{h}', cov_x=round(cov_x, 2), cov_y=round(cov_y, 2),
                     density=round(density, 2))
        reasons = []
        if cov_x < MIN_COV:
            reasons.append(f'content covers {cov_x:.0%} of width')
        if cov_y < MIN_COV:
            reasons.append(f'content covers {cov_y:.0%} of height')
        if density < MIN_DENSITY:
            reasons.append(f'density {density:.0%} < {MIN_DENSITY:.0%}')
        if reasons:
            fails.append((slug, 'content-fail', '; '.join(reasons)))
            entry['verdict'] = 'FAIL'
        else:
            entry['verdict'] = 'PASS'
        report[slug] = entry
    for slug, kind, detail in fails:
        print(f'FAIL {slug}: {detail}')
    print(f'---\nS12 hero-content: {len(cities) - len(fails)}/{len(cities)} pass')
    if '--write-report' in sys.argv:
        out = os.path.join(REPO, 'artifacts', 'gates', 'hero-content-report.json')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        import json
        json.dump(report, open(out, 'w'), indent=1)
        print(f'report: {out}')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()