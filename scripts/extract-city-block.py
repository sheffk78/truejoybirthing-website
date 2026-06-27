#!/usr/bin/env python3
"""Extract a city block from cities.ts by slug."""
import sys, re

def extract_city_block(slug):
    with open('src/data/cities.ts') as f:
        content = f.read()
    
    # Find the city block: "slug": { ... }
    pattern = f'"{slug}": {{'
    start = content.find(pattern)
    if start == -1:
        return ''
    
    brace = content.find('{', start)
    depth = 0
    end = brace
    for i, ch in enumerate(content[brace:], brace):
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
        if depth == 0:
            end = i + 1
            break
    
    return content[brace:end]

if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(1)
    block = extract_city_block(sys.argv[1])
    print(block)