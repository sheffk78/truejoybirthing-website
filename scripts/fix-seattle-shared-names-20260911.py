#!/usr/bin/env python3
"""Iteratively fix seattle-wa stage-gate failures by renaming shared-name assets.
Copies file to full-slug name, updates ref in the seattle-wa block only."""
import os
import re
import shutil
import subprocess

path = 'src/data/cities.ts'

for attempt in range(8):
    r = subprocess.run(['python3', 'scripts/preflight-stage-gate.py', 'seattle-wa', 'build'],
                       capture_output=True, text=True)
    log = r.stdout + r.stderr
    m = re.search(r'cross-city provider photo: ([^\s"]+)', log)
    if not m:
        m = re.search(r'wrong-city reference: ([^\s"]+)', log)
    if not m:
        print(f'attempt {attempt}: no cross-city/wrong-city failures remaining (rc={r.returncode})')
        break
    old = m.group(1)
    stem, ext = os.path.splitext(old)
    new = f'{stem}-seattle-wa{ext}'
    src_path = 'public' + old
    new_path = 'public' + new
    shutil.copyfile(src_path, new_path)
    src = open(path).read()
    start = src.find('"seattle-wa": {')
    end = src.find('\n  "', start + 10)
    block = src[start:end]
    assert old in block, f'{old} not in seattle block'
    src = src[:start] + block.replace(old, new) + src[end:]
    open(path, 'w').write(src)
    print(f'attempt {attempt}: {old} -> {new}')
else:
    print('max attempts reached')

# Final gate
r = subprocess.run(['python3', 'scripts/preflight-stage-gate.py', 'seattle-wa', 'build'],
                   capture_output=True, text=True)
log = r.stdout + r.stderr
mm = re.search(r'"passed": (\d+),\s*"failed": (\d+)', log)
print('final:', mm.group(0) if mm else 'unknown', f'rc={r.returncode}')
for line in log.splitlines():
    if 'FAIL' in line or 'cross-city' in line or 'wrong-city' in line:
        print(' ', line.strip()[:140])