#!/usr/bin/env python3.13
"""Filter staged cities.ts diff: drop hunks touching frozen city blocks.

The pre-commit city gate compares whole city blocks between HEAD and staged.
Cities whose own stage gates cannot pass (abilene-tx, arlington-tx, denver-co —
pre-existing image gate failures outside this stage's city scope) must have
byte-identical blocks to HEAD. This script rewrites the diff to exclude their
hunks, so the staged result leaves their blocks untouched.
"""
import re

FROZEN = ["abilene-tx", "arlington-tx", "denver-co"]
DIFF_IN = "/tmp/staged_cities_original.diff"
DIFF_OUT = "/tmp/staged_cities_filtered.diff"

src = open(DIFF_IN).read()
lines = src.split("\n")

# Identify hunk boundaries: lines starting with @@ ... @@
hunks = []  # (start_idx, end_idx_exclusive)
hunk_starts = [i for i, l in enumerate(lines) if l.startswith("@@")]
for n, s in enumerate(hunk_starts):
    e = hunk_starts[n + 1] if n + 1 < len(hunk_starts) else len(lines)
    # strip trailing empty line artifact
    while e > s and lines[e - 1] == "":
        e -= 1
    hunks.append((s, e))

header_end = hunk_starts[0]
header = "\n".join(lines[:header_end]) + "\n"

kept, dropped = [], []
for s, e in hunks:
    body = "\n".join(lines[s:e])
    # Determine which city block(s) this hunk touches. Use the +/- context to
    # find the enclosing slug by scanning backwards in the reconstructed file.
    # Simpler robust check: does the hunk body mention a frozen slug on a +/- line?
    changed = [l for l in body.split("\n")
               if l.startswith(("+", "-")) and not l.startswith(("+++", "---"))]
    joined = " ".join(changed)
    hits = [f for f in FROZEN if f in joined]
    if hits:
        dropped.append((hits, body[:120]))
        continue
    kept.append(body)

# Normalize: strip only truly-empty trailing artifact lines (""). A trailing
# context line " " (single space = blank source line) is REQUIRED hunk content.
kept_bodies = kept
kept = []
for body in kept_bodies:
    bl = body.split("\n")
    while bl and bl[-1] == "":
        bl.pop()
    kept.append("\n".join(bl) + "\n")

out = header + "".join(kept) + "\n"
open(DIFF_OUT, "w").write(out)
print("kept hunks:", len(kept), "dropped hunks:", len(dropped))
for hits, preview in dropped:
    print("  dropped (touches", ",".join(hits), "):", preview[:100].replace("\n", " | "))