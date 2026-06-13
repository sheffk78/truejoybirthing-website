#!/usr/bin/env python3
"""
Preflight: provider costRange validation gate (S6).

Scopes strictly to the localDoulas array of the target city only.
Returns:
  PASS:N   — all N providers have costRange
  FAIL:n1,n2 — comma-separated list of provider names missing costRange
  NO_CITY  — slug not found in cities.ts
  NO_DOULAS — city has no localDoulas section
"""
import re
import sys


def get_providers(data, slug):
    """Find localDoulas array for given slug and return (entries, missing)."""
    idx = data.find(f'"{slug}":')
    if idx == -1:
        idx = data.find(f"slug: '{slug}'")
    if idx == -1:
        return None, None

    block = data[idx:]
    d_start = block.find("localDoulas:")
    if d_start == -1:
        return None, None

    arr_start = block.find("[", d_start)
    if arr_start == -1:
        return None, None

    # Find the array closing bracket by counting depth
    depth = 0
    arr_end = -1
    for i, c in enumerate(block[arr_start:]):
        if c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                arr_end = arr_start + i
                break

    if arr_end == -1:
        return None, None

    arr_content = block[arr_start + 1 : arr_end]
    entries = list(re.finditer(r'\{ name: "([^"]+)"', arr_content))

    missing = []
    for e in entries:
        name = e.group(1)
        entry_start = e.start()
        # Find the matching closing brace by counting depth
        depth2 = 0
        entry_end = len(arr_content)
        for i in range(entry_start, len(arr_content)):
            c = arr_content[i]
            if c == "{":
                depth2 += 1
            elif c == "}":
                depth2 -= 1
                if depth2 == 0:
                    entry_end = i + 1
                    break

        entry_text = arr_content[entry_start:entry_end]
        if "costRange:" not in entry_text:
            missing.append(name)

    return entries, missing


def main():
    if len(sys.argv) < 2:
        print("USAGE: python3 scripts/s6-costrange-check.py <slug>")
        sys.exit(0)

    slug = sys.argv[1]

    with open("src/data/cities.ts") as f:
        data = f.read()

    entries, missing = get_providers(data, slug)

    if entries is None:
        print("NO_CITY")
        return
    if len(entries) == 0:
        print("NO_DOULAS")
        return

    if missing:
        print(f"FAIL:{','.join(missing)}")
    else:
        print(f"PASS:{len(entries)}")


if __name__ == "__main__":
    main()