#!/usr/bin/env python3
"""S11 — OG image content gate: verify every city OG image fills its canvas.

Born 2026-09-10: hayward-ca + corona-ca shipped OG images where content occupied
only the top-left 50%x50% of the 1200x630 canvas (render-og-2x.cjs viewport
mismatch). S2 (existence + size) passed; nothing measured content coverage.
san-diego-ca shipped 1344x768 — wrong dims, never checked.

Checks per ogImage referenced in src/data/cities.ts (live URL or local file):
  1. File exists and is readable (S2 already checks size; we check content).
  2. Dimensions == 1200x630 exactly.
  3. Content bbox covers >=92% of width AND height (background = corner median).
  4. Content density >= 30% of pixels differ from background.

Usage:
  python3 scripts/check-og-content.py [slug ...]   # default: all cities
Exit 0 = all pass. Exit 1 = failures listed. --write-report dumps JSON.
"""
import json, os, re, sys, glob
import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TS = os.path.join(REPO, 'src', 'data', 'cities.ts')
IMG = os.path.join(REPO, 'public', 'images')

def load_og_map():
    src = open(TS).read()
    cities = {}
    for m in re.finditer(r'"([a-z0-9-]+)": \{', src):
        slug = m.group(1)
        window = src[m.end():m.end()+30000]
        nxt = re.search(r'"[a-z0-9-]+": \{', window[100:])
        block = window[:100+nxt.start()] if nxt else window
        og = re.search(r'ogImage: "([^"]+?)(?:\?[^"]*)?"', block)
        if og:
            url = og.group(1)
            fn = url.rsplit('/', 1)[-1]
            cities[slug] = os.path.join(IMG, fn)
    return cities

def measure(path):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    a = np.asarray(im).astype(int)
    corners = [a[0, 0], a[0, -1], a[-1, 0], a[-1, -1]]
    bg = np.median(np.array(corners), axis=0)
    mask = np.abs(a - bg).sum(axis=2) > 40
    cols = mask.any(axis=0); rows = mask.any(axis=1)
    if not cols.any() or not rows.any():
        return w, h, 0.0, 0.0, 0.0
    x0, x1 = int(np.argmax(cols)), w - 1 - int(np.argmax(cols[::-1]))
    y0, y1 = int(np.argmax(rows)), h - 1 - int(np.argmax(rows[::-1]))
    return w, h, (x1 - x0 + 1) / w, (y1 - y0 + 1) / h, float(mask.mean())

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    targets = args if args else None
    cities = load_og_map()
    if targets:
        cities = {s: p for s, p in cities.items() if s in targets}
    fails, report = [], {}
    for slug, path in sorted(cities.items()):
        entry = {'file': os.path.basename(path)}
        if not os.path.exists(path):
            fails.append((slug, 'missing-file', path)); entry['verdict'] = 'FAIL'
            report[slug] = entry; continue
        w, h, cov_x, cov_y, density = measure(path)
        entry.update(dims=f'{w}x{h}', cov_x=round(cov_x, 2), cov_y=round(cov_y, 2), density=round(density, 2))
        reasons = []
        if (w, h) != (1200, 630): reasons.append(f'dims {w}x{h} != 1200x630')
        if cov_x < 0.92: reasons.append(f'content covers {cov_x:.0%} of width')
        if cov_y < 0.92: reasons.append(f'content covers {cov_y:.0%} of height')
        if density < 0.30: reasons.append(f'density {density:.0%} < 30%')
        if reasons:
            fails.append((slug, 'content-fail', '; '.join(reasons))); entry['verdict'] = 'FAIL'
        else:
            entry['verdict'] = 'PASS'
        report[slug] = entry
    for slug, kind, detail in fails:
        print(f'FAIL {slug}: {detail}')
    print(f'---\nS11 og-content: {len(cities) - len(fails)}/{len(cities)} pass')
    if '--write-report' in sys.argv:
        out = os.path.join(REPO, 'artifacts', 'gates', 'og-content-report.json')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        json.dump(report, open(out, 'w'), indent=1)
        print(f'report: {out}')
    sys.exit(1 if fails else 0)

if __name__ == '__main__':
    main()