#!/usr/bin/env python3
import re, sys

with open('src/data/cities.ts') as f:
    content = f.read()

slug = sys.argv[1] if len(sys.argv) > 1 else 'gaithersburg-md'
start = content.find(f'"{slug}": {{')
if start == -1:
    print(f'NOT FOUND: {slug}')
    sys.exit(1)
i = content.index('{', start)
i += 1
depth = 1
while i < len(content) and depth > 0:
    if content[i] == '{': depth += 1
    elif content[i] == '}': depth -= 1
    i += 1
block = content[start:i]
print(block)
