#!/usr/bin/env python3
"""Rank TJB city pages by cross-page similarity (Phase 3 worklist).

Two signals per pair:
  1. prose similarity: token trigram Jaccard on combined prose text
  2. shape similarity: section presence vector + paragraph-length rhythm

For each city: mean pairwise similarity vs all others (corpus-wide flatness),
plus its WORST single-pair twin (the page it most duplicates).
Output: ranked CSV + top-twins table.
"""
import json, os, re, csv
from collections import defaultdict

PROSE_DIR = "/tmp/tjb-prose"

def tokens(text):
    return re.sub(r"[^a-z0-9 ]", " ", text.lower()).split()

def trigrams(toks):
    return set(tuple(toks[i:i+3]) for i in range(len(toks)-2))

def norm(vec):
    import math
    return math.sqrt(sum(v*v for v in vec.values()))

def cos(a, b):
    keys = set(a) | set(b)
    dot = sum(a.get(k,0)*b.get(k,0) for k in keys)
    na, nb = norm(a), norm(b)
    return dot/(na*nb) if na and nb else 0.0

cities = {}
for fn in os.listdir(PROSE_DIR):
    if fn.endswith(".json"):
        d = json.load(open(os.path.join(PROSE_DIR, fn)))
        cities[d["slug"]] = d

# Precompute: combined prose trigrams + shape vector
grams, shapes, words = {}, {}, {}
for slug, d in cities.items():
    text = " ".join([d.get("culture",""), d.get("heroLocalDetail",""), d.get("midwifeInfo",""),
                     " ".join(d.get("hospitalParagraphs",[])), " ".join(d.get("faqAnswers",[]))])
    tk = tokens(text)
    words[slug] = len(tk)
    grams[slug] = trigrams(tk)
    # shape vector: lengths of each prose block (rounded) + counts
    v = defaultdict(float)
    for i, p in enumerate(d.get("hospitalParagraphs", [])):
        v[f"hp{i}~{len(tokens(p))//20}"] = 1.0
    for i, p in enumerate(d.get("faqAnswers", [])):
        v[f"faq{i}~{len(tokens(p))//20}"] = 1.0
    v[f"culture~{len(tokens(d.get('culture','')))//20}"] = 1.0
    v[f"hero~{len(tokens(d.get('heroLocalDetail','')))//20}"] = 1.0
    v[f"mid~{len(tokens(d.get('midwifeInfo','')))//20}"] = 1.0
    shapes[slug] = dict(v)

slugs = list(cities.keys())
n = len(slugs)

# Pairwise similarity — O(n^2), 169^2 = ~28k pairs, fine
pairs = []
mean_sim = defaultdict(list)
for i in range(n):
    for j in range(i+1, n):
        a, b = slugs[i], slugs[j]
        ga, gb = grams[a], grams[b]
        union = len(ga | gb)
        jac = len(ga & gb)/union if union else 0.0
        sh = cos(shapes[a], shapes[b])
        sim = 0.6*jac + 0.4*sh
        pairs.append((sim, a, b, jac, sh))
        mean_sim[a].append(sim)
        mean_sim[b].append(sim)

pairs.sort(reverse=True)
rows = []
for slug in slugs:
    sims = mean_sim[slug]
    rows.append({
        "slug": slug,
        "mean_similarity": round(sum(sims)/len(sims), 4),
        "max_similarity": round(max(sims), 4),
        "words": words[slug],
    })
rows.sort(key=lambda r: -r["mean_similarity"])

with open("/tmp/tjb-similarity-ranked.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["slug","mean_similarity","max_similarity","words"])
    w.writeheader()
    w.writerows(rows)

print("TOP 20 WORST (most template-flat, corpus-wide):")
for r in rows[:20]:
    print(f"  {r['slug']:22s} mean={r['mean_similarity']:.3f} max={r['max_similarity']:.3f} words={r['words']}")
print()
print("TOP 15 NEAR-DUPLICATE PAIRS:")
for sim, a, b, jac, sh in pairs[:15]:
    print(f"  {sim:.3f} (jac={jac:.2f} shape={sh:.2f})  {a}  <->  {b}")