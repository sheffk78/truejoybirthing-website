#!/usr/bin/env python3
"""Update/verify hospital description lengths for a city in cities.ts.

For the ENRICH stage, hospital paragraphs must be >= 300 chars and answer
mom-facing questions (NICU level, bed count, doula/visitor policy,
baby-friendly, lactation, birthing rooms). This script scans the given city
block, reports each hospital/birth-center paragraph length, and verifies the
>= 300 char threshold. It does NOT mutate cities.ts (the data already meets the
requirement); it is a verification + reporting helper used at the ENRICH gate.

Usage:
    python3 scripts/update-hospital-desc.py costa-mesa-ca
Exit code 0 = all paragraphs >= 300 chars; 1 = at least one too short.
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tjb_contracts import city_block, array_blocks, field  # noqa: E402

CITIES_TS = Path(__file__).resolve().parent.parent / "src" / "data" / "cities.ts"


def para_len(obj_text: str) -> int:
    m = re.search(r'paragraph:\s*"((?:[^"\\]|\\.)*)"', obj_text)
    return len(m.group(1)) if m else 0


def main():
    if len(sys.argv) < 2:
        print("usage: update-hospital-desc.py <slug>")
        sys.exit(2)
    slug = sys.argv[1]
    block = city_block(slug)
    if not block:
        print(f"ERROR: no city block for {slug}")
        sys.exit(3)

    problems = []
    print(f"Hospital/birth-center description check for {slug}:")
    for o in array_blocks(block, "hospitalDetails"):
        name = field(o, "name")
        n = para_len(o)
        status = "OK" if n >= 300 else "TOO SHORT"
        if n < 300:
            problems.append(name)
        print(f"  [hospital] {name}: {n} chars -> {status}")
    for o in array_blocks(block, "birthCenterDetails"):
        name = field(o, "name")
        n = para_len(o)
        status = "OK" if n >= 300 else "TOO SHORT"
        if n < 300:
            problems.append(name)
        print(f"  [birthCenter] {name}: {n} chars -> {status}")

    if problems:
        print(f"\nFAIL: {len(problems)} entries below 300 chars: {problems}")
        sys.exit(1)
    print("\nPASS: all hospital/birth-center descriptions >= 300 chars")
    sys.exit(0)


if __name__ == "__main__":
    main()
