#!/usr/bin/env python3
"""Sweep G69 (og-letterbox) across every city with an explicit ogImage."""
import re, subprocess, json, os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src = open('src/data/cities.ts').read()
slugs = sorted(set(re.findall(r'^  "([a-z]+(?:-[a-z]+)*-[a-z]{2})":\s*\{', src, re.M)))
fails, passes, skipped = [], 0, 0
for s in slugs:
    r = subprocess.run(['python3', 'scripts/preflight-image-helper.py', 'og-letterbox', s],
                       capture_output=True, text=True, timeout=60)
    try:
        d = json.loads(r.stdout)
        detail = d['detail']
    except Exception:
        fails.append((s, r.stdout[:100]))
        continue
    if 'No explicit ogImage' in detail or 'not found' in detail:
        skipped += 1
    elif d['pass']:
        passes += 1
    else:
        fails.append((s, detail[:160]))
print(f"scanned {len(slugs)}: pass={passes} skip={skipped} fail={len(fails)}")
for s, d in fails:
    print(f"  FAIL {s}: {d}")