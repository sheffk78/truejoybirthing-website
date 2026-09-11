#!/usr/bin/env python3
"""Rename seattle's jen-laird + vancouver's support scene to full-slug names."""
import shutil

pairs = [
    ('public/images/doulas/jen-laird.webp', 'public/images/doulas/jen-laird-seattle-wa.webp'),
    ('public/images/vancouver-support-scene.webp', 'public/images/vancouver-wa-support-scene.webp'),
]
for old, new in pairs:
    shutil.copyfile(old, new)
    print(f'copied {old} -> {new}')

path = 'src/data/cities.ts'
src = open(path).read()
for slug, old, new in [
    ('seattle-wa', '/images/doulas/jen-laird.webp', '/images/doulas/jen-laird-seattle-wa.webp'),
    ('vancouver-wa', '/images/vancouver-support-scene.webp', '/images/vancouver-wa-support-scene.webp'),
]:
    start = src.find('"%s": {' % slug)
    end = src.find('\n  "', start + 10)
    block = src[start:end]
    assert old in block, f'{old} not in {slug} block'
    src = src[:start] + block.replace(old, new) + src[end:]
    print(f'{slug}: {old} -> {new}')
open(path, 'w').write(src)
print('done')