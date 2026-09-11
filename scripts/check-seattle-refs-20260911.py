#!/usr/bin/env python3
"""Check seattle-wa's two flagged asset refs: file existence + cross-city usage."""
import re

src = open('src/data/cities.ts').read()

for ref in ['/images/seattle-support-scene.webp', '/images/doulas/sharon-muza.webp']:
    import os
    p = 'public' + ref
    print(f'--- {ref}: file exists = {__import__("os").path.exists(p)}')
    # count references across all city blocks
    n = src.count(ref)
    print(f'    total references in cities.ts: {n}')
    # which slugs reference it
    hits = []
    for m in re.finditer(r'"([a-z0-9-]+)": \{', src):
        slug = m.group(1)
        window = src[m.end():m.end() + 30000]
        nxt = re.search(r'"[a-z0-9-]+": \{', window[100:])
        block = window[:100 + nxt.start()] if nxt else window
        if ref in block:
            hits.append(slug)
    print(f'    referencing slugs: {hits}')