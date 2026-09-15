#!/usr/bin/env python3.13
"""Fix nearbyCities self-references in cities.ts (TJB verify_deploy stage)."""
import re, subprocess

PATH = "src/data/cities.ts"

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

# 1) blocked cities must now match HEAD
for slug in ["abilene-tx", "arlington-tx", "denver-co"]:
    print(slug, "block==HEAD:", get_block(head, slug) == get_block(work, slug))

# 2) remove self-references from ALL nearbyCities lists
slug_re = re.compile(r'^  "([a-z][a-z0-9-]+)": \{')
nb_re = re.compile(r'^(\s*nearbyCities:\s*\[)(.*?)(\]\}?,?\s*)$')
lines = work.split("\n")
out = []
cur_slug = None
removed = []
for ln in lines:
    sm = slug_re.match(ln)
    if sm:
        cur_slug = sm.group(1)
    nm = nb_re.match(ln)
    if nm and cur_slug:
        refs = [r.strip().strip('"\'') for r in nm.group(2).split(",") if r.strip()]
        newrefs = [r for r in refs if r != cur_slug]
        if newrefs != refs:
            removed.append((cur_slug, [r for r in refs if r == cur_slug]))
        inner = ",".join('"%s"' % r for r in newrefs)
        ln = nm.group(1) + inner + nm.group(3)
    out.append(ln)
open(PATH, "w").write("\n".join(out))
print("self-refs removed:", removed)