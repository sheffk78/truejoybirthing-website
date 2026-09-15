#!/usr/bin/env python3.13
"""Final nearbyCities reconciliation:
1. Restore abilene-tx / arlington-tx / denver-co nearbyCities lines BYTE-EXACT from HEAD
   (their blocks are gate-frozen; hook only compares whole blocks).
2. Remove self-references from every OTHER city's nearbyCities via token removal,
   preserving original spacing/formatting of remaining tokens.
"""
import re, subprocess

PATH = "src/data/cities.ts"
head = subprocess.run(["git", "show", "HEAD:src/data/cities.ts"],
                      capture_output=True, text=True).stdout

FROZEN = ["abilene-tx", "arlington-tx", "denver-co"]

def nb_line(text, slug):
    """Return the exact nearbyCities line for slug's block."""
    m = re.search(r'\n  "%s": \{' % re.escape(slug), text)
    if not m:
        return None
    end_m = re.search(r'\n  "[a-z][a-z0-9-]+": \{', text[m.end():])
    end = m.end() + end_m.start() if end_m else len(text)
    block = text[m.start():end]
    lm = re.search(r'\n(\s*nearbyCities:\s*\[[^\]]*\][\} ,]*[^\n]*)', block)
    return lm.group(1) if lm else None

work = open(PATH).read()
lines = work.split("\n")

# Pass 1: frozen slugs -> replace their nearbyCities line with HEAD's exact line
for slug in FROZEN:
    head_line = nb_line(head, slug)
    assert head_line, f"no HEAD nearbyCities line for {slug}"
    fixed = False
    for i, ln in enumerate(lines):
        if re.match(r'^\s*nearbyCities:\s*\[', ln):
            # confirm this line belongs to slug's block: search backwards for slug key
            for j in range(i, max(i - 400, -1), -1):
                sm = re.match(r'^  "([a-z][a-z0-9-]+)": \{', lines[j])
                if sm:
                    owner = sm.group(1)
                    break
            else:
                owner = None
            if owner == slug and ln != head_line:
                lines[i] = head_line
                fixed = True
                break
    print(f"{slug}: frozen line restored={fixed}")

# Pass 2: token-level self-ref removal for every other city
slug_re = re.compile(r'^  "([a-z][a-z0-9-]+)": \{')
nb_re = re.compile(r'^(\s*nearbyCities:\s*\[)([^\]]*)(\].*)$')
removed = []
cur = None
for i, ln in enumerate(lines):
    sm = slug_re.match(ln)
    if sm:
        cur = sm.group(1)
    if cur in FROZEN:
        continue
    nm = nb_re.match(ln)
    if not nm or not cur:
        continue
    refs = [r.strip() for r in nm.group(2).split(",") if r.strip()]
    toks = [r.strip('"\'') for r in refs]
    if cur in toks:
        keep = [r for r, t in zip(refs, toks) if t != cur]
        sep = ", " if ", " in nm.group(2) else ","
        lines[i] = nm.group(1) + sep.join(keep) + nm.group(3)
        removed.append(cur)

open(PATH, "w").write("\n".join(lines))

# Verify
work2 = open(PATH).read()
ok = True
for slug in FROZEN:
    same = nb_line(head, slug) == nb_line(work2, slug)
    print(slug, "nb-line==HEAD:", same)
    ok = ok and same
print("self-refs removed (non-frozen):", removed or "none")
raise SystemExit(0 if ok else 1)