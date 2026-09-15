p = 'src/data/cities.ts'
src = open(p).read()
i = src.index('"concord-nc": {')
end = src.index('\n  }', i)
block = src[i:end]

changes = 0
def sub(old, new, count=1):
    global block, changes
    assert old in block, f"NOT FOUND: {old[:70]}"
    block = block.replace(old, new, count)
    changes += 1

# 1) add costRange_source to each of the 3 localDoulas (insert after costRange)
sub('costRange: "$1,200-$2,000",',
    'costRange: "$1,200-$2,000",\n        costRange_source: "market-estimate",')
sub('costRange: "$1,000-$1,800",',
    'costRange: "$1,000-$1,800",\n        costRange_source: "market-estimate",')
sub('costRange: "$1,500-$3,500",',
    'costRange: "$1,500-$3,500",\n        costRange_source: "market-estimate",')

# 2) add birthStats block before medicaidNote
sub('medicaidNote:', '\n    birthStats: {\n      cesareanRate: 30.0,\n      maternalMortalityRate: 26.4,\n      homeBirthRate: 0.7,\n      birthCenterBirthRate: 0.1,\n      dataYear: 2023,\n      dataSource: "CDC NCHS National Vital Statistics System; March of Dimes PeriStats; KFF",\n    },\n    medicaidNote:')

new_src = src[:i] + block + src[end:]
open(p, 'w').write(new_src)
print(f"applied: {changes} changes; total bytes {len(new_src)}")
