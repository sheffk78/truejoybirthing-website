#!/usr/bin/env python3
"""Extract provider names + emails from cities.ts for concord-nc outreach."""
import re

with open('src/data/cities.ts') as f:
    content = f.read()

start = content.find('"concord-nc": {')
block = content[start:start+20000]

providers = []
for m in re.finditer(r'name:\s*"([^"]+)"[\s\S]{0,900}?email:\s*"([^"]*)"', block[:14000]):
    providers.append((m.group(1), m.group(2)))

for name, email in providers:
    print(f"{name}: {email or 'NO EMAIL'}")