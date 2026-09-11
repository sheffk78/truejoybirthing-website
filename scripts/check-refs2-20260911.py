#!/usr/bin/env python3
"""Check jen-laird + vancouver-support-scene refs and existence."""
import os
import re

src = open('src/data/cities.ts').read()

for ref in ['/images/doulas/jen-laird.webp', '/images/vancouver-support-scene.webp']:
    p = 'public' + ref
    print(f'--- {ref}: exists = {os.path.exists(p)}')
    hits = []
    for m in re.finditer(r'"([a-z0-9-]+)": \{', src):
        slug = m.group(1)
        window = src[m.end():m.end() + 30000]
        nxt = re.search(r'"[a-z0-9-]+": \{', window[100:])
        block = window[:100 + nxt.start()] if nxt else window
        if ref in block:
            hits.append(slug)
    print(f'    referencing slugs: {hits}')