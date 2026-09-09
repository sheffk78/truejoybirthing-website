#!/usr/bin/env python3
"""Read birthStats from neighboring CA city blocks in cities.ts (read-only helper)."""
import json
import re
import sys

REPO = "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website"
ts = open(REPO + "/src/data/cities.ts").read()


def get_block(slug):
    m = re.search(r'"' + re.escape(slug) + r'":\s*\{', ts)
    if not m:
        return None
    start = m.end() - 1
    depth = 0
    in_str = None
    i = start
    while i < len(ts):
        ch = ts[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == in_str:
                in_str = None
            i += 1
            continue
        if ch in ('"', "'"):
            in_str = ch
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return ts[m.start():i + 1]
        i += 1
    return None


if __name__ == "__main__":
    for slug in sys.argv[1:]:
        b = get_block(slug)
        if not b:
            print(slug, "NOT FOUND")
            continue
        m = b.find("birthStats")
        print("===", slug, "birthStats:", (b[m:m + 320] if m >= 0 else "NONE"))