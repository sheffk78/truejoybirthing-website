#!/usr/bin/env python3.13
"""Restore arlington-tx nearbyCities self-ref (line 763) to HEAD state."""
import re, subprocess

PATH = "src/data/cities.ts"
lines = open(PATH).read().split("\n")
# line 763 (1-indexed): arlington-tx block's nearbyCities (block ends before "austin-tx" at line 764)
idx = 762
assert 'nearbyCities: ["abilene-tx","allen-tx"]' in lines[idx], lines[idx]
lines[idx] = lines[idx].replace(
    'nearbyCities: ["abilene-tx","allen-tx"]',
    'nearbyCities: ["abilene-tx","arlington-tx","allen-tx"]')
open(PATH, "w").write("\n".join(lines))

def get_block(text, slug):
    m = re.search(r'\n  "%s": \{' % re.escape(slug), text)
    if not m:
        return None
    start = m.start() + 1
    nxt = re.search(r'\n  "[a-z][a-z0-9-]+": \{', text[m.end():])
    end = m.end() + nxt.start() + 1 if nxt else len(text)
    return text[start:end]

work = open(PATH).read()
head = subprocess.run(["git", "show", "HEAD:src/data/cities.ts"],
                      capture_output=True, text=True).stdout
ok = True
for slug in ["abilene-tx", "arlington-tx", "denver-co"]:
    same = get_block(head, slug) == get_block(work, slug)
    print(slug, "block==HEAD:", same)
    ok = ok and same

# ensure zero self-references remain anywhere EXCEPT the three HEAD-frozen blocks
slug_re = re.compile(r'^  "([a-z][a-z0-9-]+)": \{')
nb_re = re.compile(r'^\s*nearbyCities:\s*\[(.*?)\]')
cur = None
extra = []
for ln in work.split("\n"):
    sm = slug_re.match(ln)
    if sm:
        cur = sm.group(1)
    nm = nb_re.match(ln)
    if nm and cur:
        refs = [r.strip().strip('"\'') for r in nm.group(1).split(",") if r.strip()]
        if cur in refs and cur not in ("abilene-tx", "arlington-tx", "denver-co"):
            extra.append(cur)
print("self-refs outside frozen blocks:", extra or "none")
raise SystemExit(0 if ok and not extra else 1)