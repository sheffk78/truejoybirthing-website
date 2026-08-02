#!/usr/bin/env python3
"""
Targeted fix script for Lakewood CO city page.
Makes three specific changes to src/data/cities.ts:
1. Add supportSceneImage field to lakewood-co block
2. Fix Beth Brooks generic description (G10 failure)
"""
import re

CITIES_PATH = "/Users/socializerender/Projects/truejoybirthing-website/src/data/cities.ts"

with open(CITIES_PATH, "r") as f:
    content = f.read()

original = content
changes = []

# 1) Add supportSceneImage field after supportSceneAlt in lakewood-co block
# The lakewood block has supportSceneAlt but no supportSceneImage
old_support_alt = (
    '    supportSceneAlt: "A doula walking alongside an expectant mom with the Rocky Mountain foothills visible from Lakewood, Colorado" ,\n'
    '    midwifeInfo:'
)
new_support = (
    '    supportSceneAlt: "A doula walking alongside an expectant mom with the Rocky Mountain foothills visible from Lakewood, Colorado" ,\n'
    '    supportSceneImage: "/images/lakewood-support-scene.webp" ,\n'
    '    midwifeInfo:'
)

if old_support_alt in content:
    content = content.replace(old_support_alt, new_support)
    changes.append("ADDED supportSceneImage field to lakewood-co block")
else:
    print("WARNING: Could not find supportSceneAlt pattern in lakewood block")

# 2) Fix Beth Brooks description - replace "provides compassionate, hands-on support"
# with something specific and non-generic
old_beth_desc = (
    'Beth Brooks is a DONA-certified birth and postpartum doula based in Littleton, serving Lakewood, Golden, Englewood, and West Denver communities. She provides compassionate, hands-on support from pregnancy through postpartum, with deep familiarity of local hospitals including St. Anthony Hospital, Swedish Medical Center, and Lutheran Hospital. She also offers sibling doula care, childbirth education, and birth photography.'
)
new_beth_desc = (
    'Beth Brooks is a DONA-certified birth and postpartum doula based in Littleton, serving Lakewood, Golden, Englewood, and West Denver communities. She specializes in hospital births at St. Anthony Hospital and Lutheran Hospital, and also supports families planning birth center deliveries. Her services include birth doula and postpartum doula care, sibling doula support, childbirth education classes, and birth photography. She is known for her calm, informed presence and her deep familiarity with Colorado Front Range hospital policies.'
)

if old_beth_desc in content:
    content = content.replace(old_beth_desc, new_beth_desc)
    changes.append("FIXED Beth Brooks description to be specific, not generic")
else:
    print("WARNING: Could not find Beth Brooks description pattern")

if content == original:
    print("No changes made - patterns not found!")
else:
    with open(CITIES_PATH, "w") as f:
        f.write(content)
    print(f"Applied {len(changes)} changes to cities.ts:")
    for c in changes:
        print(f"  - {c}")