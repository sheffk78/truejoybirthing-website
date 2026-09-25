#!/usr/bin/env python3
"""Fix voice-eval findings in pasadena-ca culture copy (cities.ts)."""
c = open('src/data/cities.ts').read()
old1 = "and a strong natural-birth community that predates most of Los Angeles County"
new1 = "and a long-established birth support community that predates most of Los Angeles County"
old2 = "The city's walkable older neighborhoods, tree-lined streets, and proximity to the San Gabriel foothills give expectant families genuine third-trimester walking and nesting options, and the Colorado Street Bridge area remains the classic stroll for families waiting on labor."
new2 = "The city's walkable older neighborhoods, tree-lined streets, and proximity to the San Gabriel foothills give expectant families practical walking options close to home, and the Colorado Street Bridge area is a familiar stroll for families in the final weeks."
assert old1 in c and old2 in c, 'patterns missing'
c = c.replace(old1, new1).replace(old2, new2)
open('src/data/cities.ts', 'w').write(c)
print('culture copy fixed')