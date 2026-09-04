#!/usr/bin/env python3
"""Re-apply the 2026-09-04 OG/hero image swaps to cities.ts (idempotent).

Restores nothing — run AFTER a git checkout of cities.ts. Safe to run twice.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
TS_PATH = os.path.join(ROOT, 'src/data/cities.ts')

SWAPS = [
    # 4 hero fixes (barred sources -> fixed files)
    ('/images/baltimore-md-birth-doula-hero-v3.webp', '/images/baltimore-md-birth-doula-hero-v4.webp'),
    ('/images/glendale-ca-birth-doula-skyline.webp', '/images/glendale-ca-birth-doula-skyline-v2.webp'),
    ('/images/frisco-tx-birth-doula-skyline.webp', '/images/frisco-tx-birth-doula-skyline-v2.webp'),
    ('/images/long-beach-ca-birth-doula-hero-v3.webp', '/images/long-beach-ca-birth-doula-hero-v4.webp'),
    # 17 ogImage swaps
    ('https://truejoybirthing.com/images/og-city-baltimore-md-v2.webp', 'https://truejoybirthing.com/images/og-city-baltimore-md-v3.webp'),
    ('https://truejoybirthing.com/images/og-city-chicago-il-v5.webp', 'https://truejoybirthing.com/images/og-city-chicago-il-v6.webp'),
    ('ogImage: "/images/og-city-detroit-mi-v2.webp"', 'ogImage: "https://truejoybirthing.com/images/og-city-detroit-mi-v3.webp"'),
    ('https://truejoybirthing.com/images/og-city-gainesville-fl.webp', 'https://truejoybirthing.com/images/og-city-gainesville-fl-v2.webp'),
    ('https://truejoybirthing.com/images/og-city-gaithersburg-md.webp', 'https://truejoybirthing.com/images/og-city-gaithersburg-md-v2.webp'),
    ('https://truejoybirthing.com/images/og-city-glendale-ca-v2.webp', 'https://truejoybirthing.com/images/og-city-glendale-ca-v3.webp'),
    ('https://truejoybirthing.com/images/og-city-huntington-beach-ca-v2.webp', 'https://truejoybirthing.com/images/og-city-huntington-beach-ca-v3.webp'),
    ('ogImage: "/images/og-city-long-beach-ca-v2.webp"', 'ogImage: "https://truejoybirthing.com/images/og-city-long-beach-ca-v4.webp"'),
    ('https://truejoybirthing.com/images/og-city-melissa-tx.webp', 'https://truejoybirthing.com/images/og-city-melissa-tx-v2.webp'),
    ('ogImage: "/images/og-city-naperville-il-v2.webp"', 'ogImage: "https://truejoybirthing.com/images/og-city-naperville-il-v2.webp"'),
    ('ogImage: "/images/og-city-newark-nj.webp"', 'ogImage: "https://truejoybirthing.com/images/og-city-newark-nj-v2.webp"'),
    ('https://truejoybirthing.com/images/og-city-philadelphia-pa-v4.webp', 'https://truejoybirthing.com/images/og-city-philadelphia-pa-v5.webp'),
    ('https://truejoybirthing.com/images/og-city-rancho-cucamonga-ca-v2.webp', 'https://truejoybirthing.com/images/og-city-rancho-cucamonga-ca-v3.webp'),
    ('https://truejoybirthing.com/images/og-city-st-augustine-fl.webp', 'https://truejoybirthing.com/images/og-city-st-augustine-fl-v2.webp'),
    ('https://truejoybirthing.com/images/og-city-stockton-ca.webp', 'https://truejoybirthing.com/images/og-city-stockton-ca-v2.webp'),
    ('https://truejoybirthing.com/images/og-city-yonkers-ny-v2.webp', 'https://truejoybirthing.com/images/og-city-yonkers-ny-v3.webp'),
    ('https://truejoybirthing.com/images/og-city-fate-tx.webp', 'https://truejoybirthing.com/images/og-city-fate-tx-v2.webp'),
]

src = open(TS_PATH).read()
total = 0
for old, new in SWAPS:
    n = src.count(old)
    src = src.replace(old, new)
    total += n
    if n == 0:
        print(f"WARN 0 matches: {old[:60]}")
open(TS_PATH, 'w').write(src)
print(f"applied {total} swaps")