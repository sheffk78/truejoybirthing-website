#!/usr/bin/env python3
"""Fix all 9 Batch 1 cities with missing image fields in cities.ts"""

import re

CITIES_TS = '/Users/socializerender/Projects/truejoybirthing-website/src/data/cities.ts'

with open(CITIES_TS) as f:
    content = f.read()

# Define all fixes per city
fixes = {
    'seattle-wa': {
        'heroImage': '/images/seattle-wa-birth-doula-skyline.webp',
        'ogImage': 'https://truejoybirthing.com/images/og-city-seattle-wa.webp',
        'supportSceneImage': '/images/seattle-wa-birth-doula-support.webp',
        'supportSceneAlt': 'A doula supporting an expectant mom in Seattle: Washington birth support and doula care',
    },
    'philadelphia-pa': {
        'heroImage': '/images/philadelphia-pa-birth-doula-skyline.webp',
        'ogImage': 'https://truejoybirthing.com/images/og-city-philadelphia-pa.webp',
        'supportSceneImage': '/images/philadelphia-pa-birth-doula-support.webp',
        'supportSceneAlt': 'A doula supporting an expectant mom in Philadelphia: Pennsylvania birth support and doula care',
    },
    'baltimore-md': {
        'heroImage': '/images/baltimore-md-birth-doula-skyline.webp',
        'ogImage': 'https://truejoybirthing.com/images/og-city-baltimore-md.webp',
        'supportSceneImage': '/images/baltimore-md-birth-doula-support.webp',
        'supportSceneAlt': 'A doula supporting an expectant mom in Baltimore: Maryland birth support and doula care',
    },
    'los-angeles-ca': {
        'heroImage': '/images/los-angeles-ca-birth-doula-skyline.webp',
        'ogImage': 'https://truejoybirthing.com/images/og-city-los-angeles-ca.webp',
        'supportSceneImage': '/images/los-angeles-ca-birth-doula-support.webp',
        'supportSceneAlt': 'A doula supporting an expectant mom in Los Angeles: California birth support and doula care',
    },
    'san-antonio-tx': {
        'heroImage': '/images/san-antonio-tx-birth-doula-skyline.webp',
        'ogImage': 'https://truejoybirthing.com/images/og-city-san-antonio-tx.webp',
        'supportSceneImage': '/images/san-antonio-tx-birth-doula-support.webp',
        'supportSceneAlt': 'A doula supporting an expectant mom in San Antonio: Texas birth support and doula care',
    },
    'chicago-il': {
        'heroImage': '/images/chicago-il-birth-doula-skyline.webp',
        'ogImage': 'https://truejoybirthing.com/images/og-city-chicago-il.webp',
        'supportSceneImage': '/images/chicago-il-birth-doula-support.webp',
        'supportSceneAlt': 'A doula supporting an expectant mom in Chicago: Illinois birth support and doula care',
    },
    'phoenix-az': {
        'heroImage': '/images/phoenix-az-birth-doula-skyline.webp',
        'ogImage': 'https://truejoybirthing.com/images/og-city-phoenix-az.webp',
        'supportSceneImage': '/images/phoenix-az-birth-doula-support.webp',
        'supportSceneAlt': 'A doula supporting an expectant mom in Phoenix: Arizona birth support and doula care',
    },
    'miami-fl': {
        'heroImage': '/images/miami-fl-birth-doula-skyline.webp',
        'ogImage': 'https://truejoybirthing.com/images/og-city-miami-fl.webp',
        'supportSceneImage': '/images/miami-fl-birth-doula-support.webp',
        'supportSceneAlt': 'A doula supporting an expectant mom in Miami: Florida birth support and doula care',
    },
    'nashville-tn': {
        'heroImage': '/images/nashville-tn-birth-doula-skyline.webp',
        'ogImage': 'https://truejoybirthing.com/images/og-city-nashville-tn.webp',
        'supportSceneImage': '/images/nashville-tn-birth-doula-support.webp',
        'supportSceneAlt': 'A doula supporting an expectant mom in Nashville: Tennessee birth support and doula care',
    },
}

# Hospital thumbnail mappings
hospital_thumbnails = {
    'seattle-wa': {
        'Swedish Medical Center First Hill': 'swedish-first-hill',
        'UW Medical Center – Montlake': 'uw-montlake',
        'UW Medical Center – Northwest': 'uw-northwest',
        'Overlake Medical Center & Clinics': 'overlake',
        'Swedish Medical Center – Issaquah': 'swedish-issaquah',
    },
    'philadelphia-pa': {
        'Hospital of the University of Pennsylvania': 'hup',
        'Thomas Jefferson University Hospital': 'jefferson',
        'Temple University Hospital': 'temple',
        'Einstein Medical Center Philadelphia': 'einstein',
        'Pennsylvania Hospital': 'penn-hospital',
    },
    'baltimore-md': {
        'The Johns Hopkins Hospital': 'johns-hopkins',
        'University of Maryland Medical Center': 'umd-medical-center',
        'Sinai Hospital of Baltimore': 'sinai-baltimore',
        'MedStar Franklin Square Medical Center': 'medstar-franklin',
    },
    'los-angeles-ca': {
        'Cedars-Sinai Medical Center': 'cedars-sinai',
        'UCLA Ronald Reagan Medical Center': 'ucla-ronald-reagan',
        'Kaiser Permanente West LA Medical Center': 'kaiser-west-la',
        'Providence Cedars-Sinai Tarzana Medical Center': 'providence-tarzana',
        'Martin Luther King Jr. Community Hospital': 'mlk-community',
    },
    'san-antonio-tx': {
        'Methodist Hospital': 'methodist-san-antonio',
        'University Hospital / Women\u2019s & Children\u2019s Hospital': 'university-hospital-san-antonio',
        'Baptist Medical Center': 'baptist-medical-center-sa',
        'The Children\u2019s Hospital of San Antonio (formerly CHRISTUS Santa Rosa)': 'childrens-san-antonio',
    },
    'chicago-il': {
        'Northwestern Memorial Hospital \u2014 Prentice Women\u2019s Hospital': 'northwestern-prentice',
        'Rush University Medical Center': 'rush',
        'University of Chicago Medical Center': 'uchicago',
        'Advocate Illinois Masonic Medical Center': 'advocate-illinois-masonic',
    },
    'phoenix-az': {
        'Banner University Medical Center Phoenix': 'banner-phoenix',
        "St. Joseph's Hospital and Medical Center (Dignity Health)": 'st-josephs-phoenix',
        "Phoenix Children's Hospital": 'phoenix-childrens',
        'HonorHealth Scottsdale Shea Medical Center': 'honorhealth-scottsdale',
    },
    'miami-fl': {
        'Jackson Memorial Hospital': 'jackson-memorial',
        'Mercy Hospital': 'mercy-miami',
        'Mount Sinai Medical Center': 'mount-sinai-miami',
        'Baptist Health South Florida': 'baptist-health-sf',
    },
    'nashville-tn': {
        'Vanderbilt University Medical Center': 'vanderbilt',
        'Ascension Saint Thomas Midtown Hospital': 'ascension-st-thomas',
        'TriStar Centennial Medical Center': 'tristar-centennial',
    },
}

# Birth center thumbnails
birth_center_thumbnails = {
    'philadelphia-pa': {
        'Philadelphia Birth Center': 'philadelphia-birth-center',
    },
    'baltimore-md': {
        'Johns Hopkins Bayview Birth Center': 'hopkins-bayview-birth-center',
    },
    'los-angeles-ca': {
        'The Birth Sanctuary': 'birth-sanctuary-la',
        'Gracefull Birth Center': 'gracefull-birth-center',
    },
    'san-antonio-tx': {
        'Birth Center Stone Oak': 'birth-center-stone-oak',
        'Community Birth Group': 'community-birth-group',
        'Central Texas Birth Center': 'central-texas-birth-center',
    },
    'chicago-il': {
        'The Birth Center of Chicago': 'birth-center-chicago',
    },
    'phoenix-az': {
        'Natural Birth Center & Women\u2019s Wellness': 'natural-birth-center-phoenix',
    },
    'miami-fl': {
        'No birth centers in Miami': 'no-birth-center',
    },
    'nashville-tn': {
        'No birth centers in Nashville': 'no-birth-center',
    },
}

def get_city_block(text, slug):
    """Extract the full city block from cities.ts"""
    start = text.find(f'"{slug}": {{')
    if start == -1:
        return None, None, None
    i = text.index('{', start)
    i += 1
    depth = 1
    while i < len(text) and depth > 0:
        if text[i] == '{': depth += 1
        elif text[i] == '}': depth -= 1
        i += 1
    return start, i, text[start:i]

# Step 1: Add image fields (heroImage, ogImage, supportSceneImage)
for slug, fields in fixes.items():
    start, end, block = get_city_block(content, slug)
    if block is None:
        print(f'{slug}: NOT FOUND')
        continue
    
    # Check what's already present
    has_hero = 'heroImage:' in block
    has_og = 'ogImage:' in block
    has_support = 'supportSceneImage:' in block
    
    if has_hero and has_og and has_support:
        print(f'{slug}: ✅ All image fields present')
        continue
    
    # Find insertion point: after costHigh line
    # Pattern: costHigh: NNNN,\n    shelbiServesHere
    m = re.search(r'(costHigh:\s*\d+\s*,)\s*\n(\s*shelbiServesHere)', block)
    if not m:
        print(f'{slug}: Could not find insertion point')
        continue
    
    # Build fields to insert
    insert_lines = []
    for key, val in fields.items():
        if key == 'heroImage' and not has_hero:
            insert_lines.append(f'    {key}: "{val}",')
        elif key == 'ogImage' and not has_og:
            insert_lines.append(f'    {key}: "{val}",')
        elif key in ('supportSceneImage', 'supportSceneAlt') and not has_support:
            insert_lines.append(f'    {key}: "{val}",')
    
    if not insert_lines:
        print(f'{slug}: Nothing to insert')
        continue
    
    insert_text = '\n' + '\n'.join(insert_lines) + '\n'
    old = m.group(0)
    new = m.group(1) + insert_text + m.group(2)
    content = content.replace(old, new, 1)
    print(f'{slug}: ✅ Added {len(insert_lines)} image fields')

# Step 2: Add hospital thumbnails
for slug, hospitals in hospital_thumbnails.items():
    for name, file_slug in hospitals.items():
        escaped = re.escape(name)
        # Find: { name: "Hospital Name" , paragraph: "..." }
        pattern = rf'(\{{\s*name:\s*"{escaped}"\s*,)(.*?)(\}})'
        
        def add_thumb(m, fs=file_slug):
            before = m.group(1)
            middle = m.group(2)
            after = m.group(3)
            if 'thumbnail:' in middle:
                return m.group(0)
            return f'{before} thumbnail: "/images/{fs}.webp",{middle}{after}'
        
        new_content, count = re.subn(pattern, lambda m, fs=file_slug: add_thumb(m, fs), content, count=1)
        if count > 0:
            content = new_content
            print(f'{slug}: ✅ Added thumbnail for {name}')
        else:
            print(f'{slug}: ❌ Could not find {name}')

# Step 3: Add birth center thumbnails
for slug, centers in birth_center_thumbnails.items():
    for name, file_slug in centers.items():
        escaped = re.escape(name)
        pattern = rf'(\{{\s*name:\s*"{escaped}"\s*,)(.*?)(\}})'
        
        def add_bc_thumb(m, fs=file_slug):
            before = m.group(1)
            middle = m.group(2)
            after = m.group(3)
            if 'thumbnail:' in middle:
                return m.group(0)
            return f'{before} thumbnail: "/images/{fs}.webp",{middle}{after}'
        
        new_content, count = re.subn(pattern, lambda m, fs=file_slug: add_bc_thumb(m, fs), content, count=1)
        if count > 0:
            content = new_content
            print(f'{slug}: ✅ Added thumbnail for {name}')
        else:
            print(f'{slug}: ❌ Could not find {name}')

# Step 4: Fix Miami support scene (was pointing to nashville)
if 'nashville-tn-birth-doula-support' in content[content.find('"miami-fl"'):content.find('"miami-fl"')+2000]:
    content = content.replace(
        'supportSceneImage: "/images/nashville-tn-birth-doula-support.webp"',
        'supportSceneImage: "/images/miami-fl-birth-doula-support.webp"',
        1
    )
    print('miami-fl: ✅ Fixed support scene path')

with open(CITIES_TS, 'w') as f:
    f.write(content)

print('\n✅ All fixes applied')
