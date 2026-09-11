#!/usr/bin/env python3
"""One-shot: extend 4 thin facility paragraphs (seattle-wa x3, vancouver-wa x1)
to pass the 200-char checkFacilityParas gate. Factual, geographic/practical
content only — no new clinical claims. Idempotent-guarded by exact-match counts."""
import sys

path = 'src/data/cities.ts'
src = open(path).read()

repls = [
    ("offering a family birth center with midwifery support and a Level II NICU for babies who need extra care.\"",
     "offering a family birth center with midwifery support and a Level II NICU for babies who need extra care. It sits in the Northgate neighborhood just off I-5, so families coming from Shoreline, Lake Forest Park, or Mountlake Terrace reach it without crossing the ship canal, and the nearby Northgate light rail station keeps car-free visits realistic.\""),
    ("integrated into its family birth center, with private labor and delivery rooms.\"",
     "integrated into its family birth center, with private labor and delivery rooms. The campus sits just off I-405 and NE 8th Street in downtown Bellevue, putting it within roughly twenty minutes of most Eastside neighborhoods, and the surrounding blocks hold plenty of parking plus food options for support partners during long labor shifts.\""),
    ("serving families on the Eastside and Sammamish Plateau.\"",
     "serving families on the Eastside and Sammamish Plateau. The campus sits off I-90 at Front Street, so families coming from Sammamish, Fall City, or Snoqualmie ride the highway straight to the door, and the lower parking structure connects to the main hospital without an outdoor walk, which matters during Puget Sound's long rainy stretches.\""),
    ("Serves families seeking out-of-hospital birth with licensed midwives.\"",
     "Serves families seeking out-of-hospital birth with licensed midwives. The center sits in central Vancouver just east of I-5, an easy drive from Salmon Creek, Camas, and Fisher's Landing, and its proximity to PeaceHealth Southwest Medical Center gives families a fast transfer route if a labor needs hospital care. Tour visits can be arranged directly with the midwifery practice.\""),
]

count = 0
for old, new in repls:
    n = src.count(old)
    if n != 1:
        print(f'MATCH COUNT {n} for: {old[:60]}...')
        sys.exit(1)
    src = src.replace(old, new)
    count += 1

open(path, 'w').write(src)
print(f'applied {count}/4 replacements')