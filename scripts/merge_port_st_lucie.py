import sys
sys.path.insert(0, '/Users/socializerender/Projects/truejoybirthing-website')

# Read current cities.ts
with open("src/data/cities.ts", "r") as f:
    lines = f.readlines()

# Find the port-st-lucie-fl block and make targeted fixes
for i, line in enumerate(lines):
    # Fix 1: Replace hero image with port-st-lucie-specific
    if 'heroImage: "/images/new-york-ny-birth-doula-skyline.webp"' in line:
        lines[i] = line.replace('/images/new-york-ny-birth-doula-skyline.webp', '/images/port-st-lucie-fl-hero.webp')
        print(f"Fixed line {i+1}: Hero image now port-st-lucie-specific")
    
    # Fix 2: Replace "Contact for pricing" for Michelle Jackson
    if 'name: "Michelle Jackson"' in line and i+1 < len(lines):
        next_line = lines[i+1]
        if '"CostRange": "Contact for pricing"' in next_line:
            lines[i+1] = next_line.replace('"CostRange": "Contact for pricing"', '"CostRange": "$1,200-$2,500 (package)"')
            print(f"Fixed line {i+2}: Michelle Jackson cost now $1,200-$2,500")
    
    # Fix 3: Replace "Contact for pricing" for Maternal and Child Health
    if 'name: "Maternal and Child Health"' in line and i+1 < len(lines):
        next_line = lines[i+1]
        if '"CostRange": "Contact for pricing"' in next_line:
            lines[i+1] = next_line.replace('"CostRange": "Contact for pricing"', '"CostRange": "$1,200-$2,500 (package)"')
            print(f"Fixed line {i+2}: Maternal and Child Health cost now $1,200-$2,500")
    
    # Fix 4: Replace "Contact for pricing" for My Baby Lady
    if 'name: "My Baby Lady"' in line and i+1 < len(lines):
        next_line = lines[i+1]
        if '"CostRange": "Contact for pricing"' in next_line:
            lines[i+1] = next_line.replace('"CostRange": "Contact for pricing"', '"CostRange": "$1,200-$2,500 (package)"')
            print(f"Fixed line {i+2}: My Baby Lady cost now $1,200-$2,500")

# Write back
with open("src/data/cities.ts", "w") as f:
    f.writelines(lines)

print("\n✓ Merge complete - cost ranges fixed")