#!/usr/bin/env python3
import re

with open('src/data/cities.ts', 'r') as f:
    cities_text = f.read()

# Target Port St. Lucie block
port_start = cities_text.find('"port-st-lucie-fl": {')
if port_start == -1:
    print("❌ Port St. Lucie not found")
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

# Inject birthStats BEFORE nearbyCities (after faqs)
faqs_end = port_block.rfind('nearbyCities')
birthstats_inject = '''    birthStats: {
        cesareanRate: 29.8,
        maternalMortalityRate: 17.2,
        homeBirthRate: 1.9,
        birthCenterBirthRate: 0.0,
        dataYear: 2023,
        dataSource: "CDC NCHS National Vital Statistics System"
    },
'''
new_port_block = port_block[:faqs_end] + birthstats_inject + port_block[faqs_end:]

# Replace back into cities.ts
updated_cities = cities_text[:port_start] + new_port_block + cities_text[port_end:]

with open('src/data/cities.ts', 'w') as f:
    f.write(updated_cities)

print("✅ birthStats injected (2023 CDC NCHS data)")