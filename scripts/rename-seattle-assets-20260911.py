#!/usr/bin/env python3
"""Rename seattle-wa's two non-slug-named assets to full-slug names, update refs.
Old files stay in place (archive rule: never delete)."""
import shutil

pairs = [
    ('public/images/seattle-support-scene.webp', 'public/images/seattle-wa-support-scene.webp'),
    ('public/images/doulas/sharon-muza.webp', 'public/images/doulas/sharon-muza-seattle-wa.webp'),
]
for old, new in pairs:
    shutil.copyfile(old, new)
    print(f'copied {old} -> {new}')

path = 'src/data/cities.ts'
src = open(path).read()
# Replace refs only within the seattle-wa block
start = src.find('"seattle-wa": {')
end = src.find('\n  "', start + 10)
block = src[start:end]
assert '/images/seattle-support-scene.webp' in block and '/images/doulas/sharon-muza.webp' in block
block2 = block.replace('/images/seattle-support-scene.webp', '/images/seattle-wa-support-scene.webp')
block2 = block2.replace('/images/doulas/sharon-muza.webp', '/images/doulas/sharon-muza-seattle-wa.webp')
src = src[:start] + block2 + src[end:]
open(path, 'w').write(src)
print('refs updated in seattle-wa block')