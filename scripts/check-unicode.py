#!/usr/bin/env python3
"""Check for raw unicode characters in cities.ts that should be JS-escaped."""
with open("src/data/cities.ts", "r") as f:
    content = f.read()

chars = {
    '\u2019': 'curly apostrophe',
    '\u2014': 'em dash',
    '\u201c': 'left smart quote',
    '\u201d': 'right smart quote',
    '\u2013': 'en dash',
    '\u2018': 'left single quote',
}

found_any = False
for char, name in chars.items():
    count = content.count(char)
    if count > 0:
        print(f"Found {count} raw {name} characters")
        found_any = True
        # Show first occurrence
        idx = content.find(char)
        line_num = content[:idx].count('\n') + 1
        print(f"  First at line {line_num}: ...{content[max(0,idx-30):idx+30]}...")

if not found_any:
    print("No raw unicode found - all properly escaped")