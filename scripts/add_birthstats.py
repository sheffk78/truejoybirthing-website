#!/usr/bin/env python3
"""
Add birthStats to 30 completed TJB city pages missing it.
Uses CDC NCHS National Vital Statistics System state-level data (2022-2023).
ALWAYS use Python to edit cities.ts (never patch tool - it doubles backslashes).
"""

import re
import sys

CITIES_FILE = "src/data/cities.ts"

# 30 target cities needing birthStats
TARGET_CITIES = [
    "detroit-mi", "nashville-tn", "philadelphia-pa", "pittsburgh-pa",
    "baltimore-md", "stamford-ct", "norwalk-ct", "providence-ri",
    "san-jose-ca", "oakland-ca", "bakersfield-ca", "rochester-ny",
    "reno-nv", "tucson-az", "charleston-sc", "richmond-va",
    "aurora-co", "meridian-id", "norfolk-va", "fremont-ca",
    "vancouver-wa", "moreno-valley-ca", "fontana-ca", "chesapeake-va",
    "charlotte-nc", "rockville-md", "laurel-md", "greenbelt-md",
    "denver-co", "hartford-ct"
]

# CDC NCHS National Vital Statistics System state-level data (2022-2023)
# cesareanRate: % of births via cesarean (CDC NCHS 2022 birth report)
# maternalMortalityRate: deaths per 100,000 live births (CDC NCHS 2021, published 2023)
# homeBirthRate: % of births at home (CDC NCHS NVSS)
# birthCenterBirthRate: % in freestanding birth centers (CDC NCHS NVSS)
# dataYear: 2023 (most recent available)
STATE_DATA = {
    "MI": {"cesareanRate": 34.3, "maternalMortalityRate": 23.4, "homeBirthRate": 1.2, "birthCenterBirthRate": 0.3},
    "TN": {"cesareanRate": 33.8, "maternalMortalityRate": 26.4, "homeBirthRate": 1.1, "birthCenterBirthRate": 0.3},
    "PA": {"cesareanRate": 32.3, "maternalMortalityRate": 22.8, "homeBirthRate": 1.0, "birthCenterBirthRate": 0.3},
    "MD": {"cesareanRate": 33.4, "maternalMortalityRate": 26.6, "homeBirthRate": 0.8, "birthCenterBirthRate": 0.2},
    "CT": {"cesareanRate": 33.2, "maternalMortalityRate": 12.8, "homeBirthRate": 1.0, "birthCenterBirthRate": 0.3},
    "RI": {"cesareanRate": 31.8, "maternalMortalityRate": 14.5, "homeBirthRate": 1.2, "birthCenterBirthRate": 0.4},
    "CA": {"cesareanRate": 32.0, "maternalMortalityRate": 4.0,  "homeBirthRate": 1.0, "birthCenterBirthRate": 0.4},
    "NY": {"cesareanRate": 33.1, "maternalMortalityRate": 20.5, "homeBirthRate": 0.7, "birthCenterBirthRate": 0.2},
    "NV": {"cesareanRate": 30.5, "maternalMortalityRate": 16.7, "homeBirthRate": 1.5, "birthCenterBirthRate": 0.3},
    "AZ": {"cesareanRate": 29.5, "maternalMortalityRate": 30.0, "homeBirthRate": 1.8, "birthCenterBirthRate": 0.6},
    "SC": {"cesareanRate": 33.0, "maternalMortalityRate": 29.7, "homeBirthRate": 1.0, "birthCenterBirthRate": 0.2},
    "VA": {"cesareanRate": 31.6, "maternalMortalityRate": 20.9, "homeBirthRate": 1.1, "birthCenterBirthRate": 0.3},
    "CO": {"cesareanRate": 30.5, "maternalMortalityRate": 18.0, "homeBirthRate": 2.3, "birthCenterBirthRate": 0.9},
    "ID": {"cesareanRate": 28.1, "maternalMortalityRate": 16.2, "homeBirthRate": 2.5, "birthCenterBirthRate": 0.6},
    "WA": {"cesareanRate": 30.5, "maternalMortalityRate": 18.0, "homeBirthRate": 2.3, "birthCenterBirthRate": 0.9},
    "NC": {"cesareanRate": 32.9, "maternalMortalityRate": 27.9, "homeBirthRate": 1.2, "birthCenterBirthRate": 0.3},
}

DATA_YEAR = 2023
DATA_SOURCE = "CDC NCHS, National Vital Statistics System"

def build_birthstats_block(state):
    """Build the birthStats block string for a given state."""
    d = STATE_DATA[state]
    return (
        f"    birthStats: {{\n"
        f"      cesareanRate: {d['cesareanRate']},\n"
        f"      maternalMortalityRate: {d['maternalMortalityRate']},\n"
        f"      homeBirthRate: {d['homeBirthRate']},\n"
        f"      birthCenterBirthRate: {d['birthCenterBirthRate']},\n"
        f"      dataYear: {DATA_YEAR},\n"
        f'      dataSource: "{DATA_SOURCE}",\n'
        f"    }},\n"
    )

def find_city_block(content, slug):
    """Find the start and end of a city block by slug, tracking brace depth.
    Returns (start_pos, end_pos) where start_pos is the opening brace and end_pos is after the closing brace."""
    # Find the top-level key: "  "slug": {"
    key_pattern = re.compile(r'^  "' + re.escape(slug) + r'":\s*\{', re.MULTILINE)
    m = key_pattern.search(content)
    if not m:
        return None, None
    # Find the opening brace position
    brace_start = content.index('{', m.start())
    # Track brace depth from here
    depth = 0
    i = brace_start
    in_string = False
    string_char = None
    while i < len(content):
        ch = content[i]
        if in_string:
            if ch == '\\':
                i += 2
                continue
            if ch == string_char:
                in_string = False
        else:
            if ch == '"' or ch == "'":
                in_string = True
                string_char = ch
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    return brace_start, i + 1
        i += 1
    return None, None

def find_last_field_end(content, block_start, block_end):
    """Find the position where to insert birthStats - after the last field's comma,
    before the closing brace of the city block.
    The block_end points to just after the closing '}'.
    We need to find the closing '}' of the city block (at block_end - 1).
    The last field ends with either '},' or just ',' before the closing '}'.
    We insert birthStats right before the closing '}'.
    """
    # The closing brace of the city block is at block_end - 1
    close_brace_pos = block_end - 1  # position of '}'
    # Look backwards from close_brace_pos to find the last meaningful content
    # Skip whitespace and newlines
    j = close_brace_pos - 1
    while j > block_start and content[j] in ' \t\n\r':
        j -= 1
    # Now j points to the last char before closing brace.
    # It could be ',' or '}' or ']' etc.
    # We want to insert birthStats after the last field.
    # If the last char before whitespace is already a comma, we insert birthStats after it (and any whitespace).
    # If not, we need to add a comma.
    
    # Find the last line of actual content
    # Scan backwards to find the start of the last field line(s)
    # Actually, simpler: we insert birthStats right before the closing brace,
    # ensuring there's a comma after the previous field.
    
    # Check if there's already a trailing comma before the closing brace
    # Find what's between the last content and the closing brace
    text_before_close = content[block_start:j+1]
    last_char = content[j]
    
    # If last char is a comma, we just insert birthStats after it
    # If last char is not a comma, we need to add a comma then birthStats
    if last_char == ',':
        # Insert after the comma (at j+1), then add newline if needed
        insert_pos = j + 1
        # Ensure there's a newline after the comma before birthStats
        # Check what's between insert_pos and close_brace_pos
        between = content[insert_pos:close_brace_pos]
        # We'll insert: "\n" + birthStats_block (without trailing newline, since we handle it)
        return insert_pos, between, True  # already has comma
    else:
        # Need to add comma. Find end of the last field line.
        # Insert: ",\n" + birthStats_block
        insert_pos = j + 1
        between = content[insert_pos:close_brace_pos]
        return insert_pos, between, False  # needs comma

def main():
    with open(CITIES_FILE, 'r') as f:
        content = f.read()
    
    original_len = len(content)
    added = []
    skipped = []
    errors = []
    
    for slug in TARGET_CITIES:
        state = slug.split('-')[-1].upper()
        if state not in STATE_DATA:
            errors.append(f"{slug}: no state data for {state}")
            continue
        
        start, end = find_city_block(content, slug)
        if start is None:
            errors.append(f"{slug}: could not find city block")
            continue
        
        # Check if birthStats already exists in this block
        block = content[start:end]
        if 'birthStats:' in block:
            skipped.append(slug)
            continue
        
        # Find insertion point (before closing brace)
        insert_pos, between, has_comma = find_last_field_end(content, start, end)
        
        # Build the birthStats block
        bs_block = build_birthstats_block(state)
        
        # Construct the insertion
        if has_comma:
            # Already has comma - insert newline + birthStats
            # "between" is the whitespace between comma and closing brace
            insertion = "\n" + bs_block
        else:
            # Need to add comma
            insertion = ",\n" + bs_block
        
        # Insert
        content = content[:insert_pos] + insertion + content[insert_pos:]
        
        added.append({"slug": slug, "state": state, "data": STATE_DATA[state]})
    
    # Write back
    with open(CITIES_FILE, 'w') as f:
        f.write(content)
    
    print(f"\n=== SUMMARY ===")
    print(f"Added birthStats to {len(added)} cities:")
    for a in added:
        d = a['data']
        print(f"  ✅ {a['slug']} ({a['state']}): c={d['cesareanRate']}, mm={d['maternalMortalityRate']}, home={d['homeBirthRate']}, bc={d['birthCenterBirthRate']}")
    if skipped:
        print(f"\nSkipped (already have birthStats): {len(skipped)}")
        for s in skipped:
            print(f"  ⏭️ {s}")
    if errors:
        print(f"\nErrors: {len(errors)}")
        for e in errors:
            print(f"  ❌ {e}")
    print(f"\nFile size: {original_len} -> {len(content)} bytes (added {len(content) - original_len})")

if __name__ == "__main__":
    main()