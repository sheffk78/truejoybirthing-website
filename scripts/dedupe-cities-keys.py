#!/usr/bin/env python3
"""Dedupe duplicated top-level keys in cities.ts city blocks (G66 cleanup).

Keeps the LAST occurrence of every TOP-LEVEL key inside each city block —
JS object semantics are last-key-wins, so this is runtime-equivalent by
construction. Key detection is depth-aware (char-level, string-aware): a
top-level key sits at brace depth 1 inside its city block; keys inside
nested objects (slug: {...} records) are at depth 2+ and never match.
Proven by diffing tsx runtime snapshots before/after.

Usage: python3 scripts/dedupe-cities-keys.py [--check]
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
TS_PATH = os.path.join(ROOT, 'src/data/cities.ts')

def skip_string(src, i, n):
    """i points at opening quote; return index past closing quote."""
    q = src[i]
    i += 1
    while i < n:
        c = src[i]
        if c == '\\':
            i += 2
            continue
        if c == q:
            return i + 1
        i += 1
    return n

def block_spans(src):
    keyRe = re.compile(r'^  "([a-z]+(?:-[a-z]+)*-[a-z]{2})":\s*\{', re.M)
    matches = list(keyRe.finditer(src))
    spans = []
    for i, m in enumerate(matches):
        end = matches[i+1].start() if i + 1 < len(matches) else len(src)
        spans.append((m.group(1), m.start(), end))
    return spans

def key_values(src, bs, be):
    """Depth-aware scan: yield (key, start_off, end_off) for top-level keys.

    src[bs] is the position of the opening '{' of the city block (depth 1).
    A top-level key line is a newline at depth 1 followed by 4-space indent,
    an identifier, and a colon. The value runs to the newline that returns
    depth to 1 (string-aware, so template literals / escaped quotes are safe).
    """
    keyRe = re.compile(r'\n    ([A-Za-z][A-Za-z0-9_]*):')
    out = []
    i = bs
    depth = 0
    while i < be:
        c = src[i]
        if c in '"\'`':
            i = skip_string(src, i, be)
            continue
        if c in '([{':
            depth += 1
            i += 1
            continue
        if c in ')]}':
            depth -= 1
            i += 1
            continue
        if c == '\n' and depth == 1:
            m = keyRe.match(src, i)
            if m:
                key = m.group(1)
                vstart = m.end()
                while vstart < be and src[vstart] in ' \t':
                    vstart += 1
                # value: walk to a newline seen when depth is back to 1
                j = vstart
                vdepth = 0
                while j < be:
                    cj = src[j]
                    if cj in '"\'`':
                        j = skip_string(src, j, be)
                        continue
                    if cj in '([{':
                        vdepth += 1
                    elif cj in ')]}':
                        vdepth -= 1
                    elif cj == '\n' and vdepth <= 0:
                        break
                    j += 1
                out.append((key, i + 1, j + 1))  # include trailing newline
                i = j + 1
                depth = 1  # value scanner ended back at depth 1
                continue
        i += 1
    return out

def dedupe(src, check_only=False):
    spans = block_spans(src)
    removals = []
    for slug, bs, be in spans:
        # bs points at the '"' of the slug; advance to its '{'
        brace = src.index('{', bs)
        kvs = key_values(src, brace, be)
        seen = {}
        for key, s, e in kvs:
            seen.setdefault(key, []).append((s, e))
        for key, occ in seen.items():
            if len(occ) > 1:
                for s, e in occ[:-1]:  # keep LAST occurrence
                    removals.append((s, e))
    if check_only:
        return removals
    out = src
    for s, e in sorted(removals, reverse=True):
        out = out[:s] + out[e:]
    return out, len(removals)

if __name__ == '__main__':
    src = open(TS_PATH).read()
    if '--check' in sys.argv:
        rems = dedupe(src, check_only=True)
        print(f"{len(rems)} duplicate-key value spans found")
        sys.exit(0)
    new, count = dedupe(src)
    open(TS_PATH, 'w').write(new)
    print(f"removed {count} duplicate-key values; file now {len(new.splitlines())} lines")