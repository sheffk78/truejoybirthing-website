#!/usr/bin/env python3
import re

with open('src/data/cities.ts', 'r') as f:
    cities_text = f.read()

# Target city block
port_start = cities_text.find('"port-st-lucie-fl": {')
if port_start == -1:
    print("❌ City block not found")
    exit(1)

brace_count = 0
port_end = port_start
for i in range(port_start, len(cities_text)):
    if cities_text[i] == '{':
        brace_count += 1
    elif cities_text[i] == '}':
        brace_count -= 1
        if brace_count == 0:
            port_end = i + 1
            break

port_block = cities_text[port_start:port_end]

# Hospitals array
hospitals_start = port_block.find('hospitalDetails: [')
hospitals_end = port_block.rfind(']')
hospitals_section = port_block[hospitals_start:hospitals_end]

# Fix Tradition Hospital
tradition_pattern = r'\{ name: "Cleveland Clinic Martin Health — Tradition Hospital" , paragraph:'
tradition_repl = r'{ name: "Cleveland Clinic Martin Health — Tradition Hospital" , paragraph: "Cleveland Clinic Martin Health — Tradition Hospital, at 10000 SW Innovation Way in the Tradition community, opened in 2014 and is the newest hospital in the city. It has a Level II Special Care Nursery (managing babies ≥32 weeks gestation; transfers complex cases to Martin North'"'"'s Level III NICU), 24/7 OB hospitalist coverage, epidural availability, CNM-friendly policies, and lactation consultants. The hospital handles an estimated 1,200–1,500 births per year and draws heavily from the young families relocating into the Tradition and St. Lucie West communities. If you'"'"'re delivering at Tradition, having your birth plan ready keeps your preferences clear in a hospital that'"'"'s busy and growing fast. Use our free hospital birth plan template to get started." , address: "10000 SW Innovation Way, Port St. Lucie, FL", nicuLevel: "Level II", doulaPolicy: "Welcomed" ,'

# Fix Martin North Hospital
martin_pattern = r'\{ name: "Cleveland Clinic Martin Health — Martin North Hospital" , paragraph:'
martin_repl = r'{ name: "Cleveland Clinic Martin Health — Martin North Hospital" , paragraph: "Cleveland Clinic Martin Health — Martin North Hospital, at 800 SE Hospital Ave in Stuart (Martin County, about 10–15 miles from PSL), has the Treasure Coast'"'"'s only Level III NICU — the regional referral center for high-risk pregnancies and critically ill newborns, with 24/7 neonatologists, sustained ventilation capability, and the highest-acuity neonatal care in the immediate region. It'"'"'s also the highest-volume birthing hospital in the area with an estimated 2,000–2,500 births per year. Martin North'"'"'s dedicated maternity wing, CNM practices, lactation support, and childbirth education make it the go-to for complex pregnancies throughout St. Lucie and Martin counties. If you'"'"'re navigating a high-risk pregnancy, this is likely where your OB will refer you. Use our free hospital birth plan template so your team has something specific to work from." , address: "800 SE Hospital Ave, Stuart, FL", nicuLevel: "Level III", doulaPolicy: "Welcomed" ,'

# Fix St. Lucie Medical Center
stlucie_pattern = r'\{ name: "St. Lucie Medical Center" , paragraph:'
stlucie_repl = r'{ name: "St. Lucie Medical Center" , paragraph: "St. Lucie Medical Center, at 1800 SE Tiffany Ave on PSL'"'"'s east side, is an HCA Healthcare hospital that'"'"'s been serving the community since 1983. It has a Level II Special Care Nursery (transfers complex cases to Martin North'"'"'s Level III NICU), 24/7 OB/GYN and anesthesia coverage, midwifery care through affiliated practices, lactation consultants, and childbirth classes. The hospital handles an estimated 1,000–1,400 births per year and serves central and eastern PSL. If we'"'"'re being real, PSL'"'"'s sprawl means this east-side hospital is a long drive from the Tradition area — so confirm which hospital your provider delivers at early, not at 38 weeks. Use our free hospital birth plan template to walk in prepared." , address: "1800 SE Tiffany Ave, Port St. Lucie, FL", nicuLevel: "Level II", doulaPolicy: "Welcomed" ,'

if re.search(tradition_pattern, hospitals_section):
    hospitals_section = re.sub(tradition_pattern, tradition_repl, hospitals_section, flags=re.DOTALL)
    print("✓ Tradition Hospital: added address, nicuLevel, doulaPolicy")
else:
    print("❌ Tradition Hospital pattern not found")

if re.search(martin_pattern, hospitals_section):
    hospitals_section = re.sub(martin_pattern, martin_repl, hospitals_section, flags=re.DOTALL)
    print("✓ Martin North Hospital: added address, nicuLevel, doulaPolicy")
else:
    print("❌ Martin North Hospital pattern not found")

if re.search(stlucie_pattern, hospitals_section):
    hospitals_section = re.sub(stlucie_pattern, stlucie_repl, hospitals_section, flags=re.DOTALL)
    print("✓ St. Lucie Medical Center: added address, nicuLevel, doulaPolicy")
else:
    print("❌ St. Lucie Medical Center pattern not found")

# Replace back into port block
new_port_block = port_block[:hospitals_start] + hospitals_section + port_block[hospitals_end:]

# Replace back into cities.ts
updated_cities = cities_text[:port_start] + new_port_block + cities_text[port_end:]

with open('src/data/cities.ts', 'w') as f:
    f.write(updated_cities)

print("✓ cities.ts updated")