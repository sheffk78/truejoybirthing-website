#!/usr/bin/env python3
"""Replace localDoulas entries in cities.ts with enriched data from JSON files.

Reads enriched JSON from Firecrawl + Apify pipeline, extracts structured data
(photos, services, cost ranges, Medicaid status), and writes clean TypeScript.
"""
import json
import re
import os
import html

# ── text extraction ──

def extract_services(md: str) -> list:
    md_lower = md.lower()
    service_map = [
        ("birth doula", "Birth Doula"),
        ("postpartum", "Postpartum"),
        ("lactation", "Lactation"),
        ("breastfeeding", "Breastfeeding Support"),
        ("placenta", "Placenta Encapsulation"),
        ("childbirth education", "Childbirth Education"),
        ("overnight", "Overnight Care"),
        ("prenatal", "Prenatal Care"),
        ("vbac", "VBAC Support"),
        ("water birth", "Water Birth"),
        ("home birth", "Home Birth"),
        ("sibling", "Sibling Support"),
        ("evidence-based", "Evidence-Based Care"),
        ("doula training", "Doula Training"),
    ]
    seen = set()
    result = []
    for kw, label in service_map:
        if kw in md_lower and label not in seen:
            result.append(label)
            seen.add(label)
    return result[:5]


def extract_cost(md: str) -> str | None:
    patterns = [
        r'\$(\d{3,4})\s*[-–to]+\s*\$(\d{3,4})',
        r'pric(?:e|ing).*?\$(\d{3,4})',
        r'\$(\d{3,4})\s*(?:per|/)\s*(?:birth|pregnancy|package)',
    ]
    for pat in patterns:
        m = re.search(pat, md, re.IGNORECASE)
        if m:
            g = m.groups()
            return f"${g[0]}–${g[1]}" if len(g) >= 2 else f"${g[0]}"
    return None


def extract_photo(md: str) -> str | None:
    """Find a likely profile/headshot image URL from enriched markdown."""
    urls = re.findall(
        r'(https?://[^\s"\'()]*(?:squarespace|wixstatic|wsimg|cloudinary|storage\.googleapis|pocketsuite|wordpress\.com|showit|homebirthhamptonroads|sacredstoriesdoula|soulful-beginnings|jasthedoula|allnationsdoula|thevillagemidwife|womancarecenters|doulasofnorthernva|hrmidwife|sunflowerbabiesmidwifery|genesisforbirth|sevencitiesmidwifery|rniesen|wixmp|wombroom|amothersjourney|restoringwellnessdoula|enroutedoulas|daisydoulaservices|naturalharmonydoula|calming-touch|whisperinglullabies|akilahwhite|debbiesdoulaservices|doula|midwife|postpartum|birth|placenta|nurturing|loving|lullabies|queendom)[^\s"\'()]*\.(?:jpg|jpeg|png|webp))',
        md, re.IGNORECASE
    )
    if not urls:
        urls = re.findall(
            r'(https?://[^\s"\'()]*\.(?:jpg|jpeg|png|webp)(?:\?[^\s"\'()]*)?)',
            md
        )
    if urls:
        for u in urls:
            u_lower = u.lower()
            if any(t in u_lower for t in ['logo', 'icon', 'banner', 'favicon', 'sprite', 'cart', 'thumbnail']):
                continue
            # Prefer larger images or profile-like filenames
            if any(t in u_lower for t in ['headshot', 'profile', 'portrait', 'team', 'doula', 'dsc', 'img_']):
                return u
        # Fallback: first non-small image
        for u in urls:
            if 'width=' in u.lower() or 'fill/w_' in u.lower():
                continue
            return u
        return urls[0]
    return None


def clean_text(text: str) -> str:
    """Strip HTML entities, markdown syntax, URLs, and navigation cruft."""
    text = html.unescape(text)
    text = re.sub(r'https?://\S+', '', text)
    text = re.sub(r'[#*\[\]\(\)!>_|]', ' ', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'&[a-z]+;', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


SKIP_SENTENCES = [
    'skip to content', 'skip to main content', 'top of page', 'bottom of page',
    'home', 'menu', 'cart', 'login', 'sign up', 'follow us', 'all rights reserved',
    'powered by', 'facebook', 'instagram', 'twitter', 'cookie', 'privacy policy',
    'terms of service', 'contact us', 'get started', 'learn more', 'read more',
    'loading', 'navigation', 'footer', 'header', 'sidebar', 'search', 'back to',
    'close', 'cancel', 'submit', 'send', 'share', 'pin it', 'tweet',
    'looks like this domain', 'is this your domain', 'would you like to',
    'client management software', 'online store', 'base64-image-removed',
    'hamburger site navigation', 'site navigation icon',
]


def extract_summary(md: str) -> str:
    """Extract a clean, human-readable description."""
    # Try to find content sections first
    sections = re.split(r'#{1,3}\s+', md)
    for sec in sections:
        clean = clean_text(sec)
        if len(clean) < 40:
            continue
        sentences = [s.strip() for s in re.split(r'[.!?]+', clean) if len(s.strip()) > 25]
        for s in sentences:
            s_lower = s.lower().strip()
            if any(t in s_lower for t in SKIP_SENTENCES):
                continue
            if len(s) > 30 and len(s) < 300:
                return s.rstrip('.') + '.'
    
    # Fallback: scan all text
    clean = clean_text(md)
    sentences = [s.strip() for s in re.split(r'[.!?]+', clean) if len(s.strip()) > 25]
    for s in sentences:
        s_lower = s.lower().strip()
        if any(t in s_lower for t in SKIP_SENTENCES):
            continue
        if len(s) > 30 and len(s) < 300:
            return s.rstrip('.') + '.'
    
    return ""


def extract_medicaid(md: str, desc: str = "") -> bool:
    text = (md + " " + desc).lower()
    return bool(re.search(r'(medicaid|medi.?cal|apple.?health)', text))


def extract_phone(address: str, md: str) -> str | None:
    # Look for phone patterns in enriched data
    phones = re.findall(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', md)
    return phones[0] if phones else None


# ── entry builder ──

def build_entry(p: dict, is_midwife: bool = False) -> str:
    """Build one TypeScript LocalDoula entry line."""
    name = p["name"].replace('"', '\\"')
    website = p.get("website", "") or p.get("website_alt", "") or ""
    enriched = p.get("enriched", {})
    md = enriched.get("markdown", "")
    
    summary = extract_summary(md) or f"Professional doula serving families in the area."
    services = extract_services(md)
    cost = extract_cost(md)
    photo = extract_photo(md)
    medicaid = extract_medicaid(md, summary)
    
    parts = [f'name: "{name}"']
    
    # Determine credential
    if is_midwife:
        if 'cpn' in md.lower() or 'certified professional' in md.lower():
            parts.append(f'credential: "CPM"')
        elif 'cnm' in md.lower() or 'certified nurse' in md.lower():
            parts.append(f'credential: "CNM"')
        elif 'lm' in md.lower():
            parts.append(f'credential: "LM"')
        else:
            parts.append(f'credential: "LM, CPM"')
    elif 'postpartum' in md.lower() and 'birth doula' not in md.lower():
        parts.append(f'credential: "Postpartum Doula"')
    elif 'lactation' in md.lower():
        parts.append(f'credential: "Birth Doula, Lactation Support"')
    else:
        parts.append(f'credential: "Birth Doula"')
    
    parts.append(f'practice: "{name}"')
    
    if website:
        parts.append(f'url: "{website}"')
    
    parts.append(f'description: "{summary[:240]}"')
    
    if photo:
        photo_clean = photo.replace('"', '\\"')
        parts.append(f'photo: "{photo_clean}"')
    
    if services:
        parts.append(f'services: {json.dumps(services)}')
    
    if cost:
        parts.append(f'costRange: "{cost}"')
    
    if medicaid:
        parts.append(f'acceptsMedicaid: true')
    
    if is_midwife:
        parts.append(f'isMidwife: true')
    
    return '      { ' + ', '.join(parts) + ' },\n'


def build_all_entries(json_path: str) -> str:
    with open(json_path) as f:
        data = json.load(f)
    
    lines = []
    for p in data.get("doulas", []):
        lines.append(build_entry(p, is_midwife=False))
    for p in data.get("midwives", []):
        lines.append(build_entry(p, is_midwife=True))
    
    return ''.join(lines)


# ── cities.ts replacement ──

def replace_section(content: str, slug: str, new_entries: str) -> str:
    """Find and replace the localDoulas array for a city."""
    city_marker = f'  "{slug}": {{'
    start = content.find(city_marker)
    if start == -1:
        print(f"❌ {slug}: not found")
        return content
    
    arr_start = content.find('localDoulas: [', start)
    if arr_start == -1:
        print(f"❌ {slug}: no localDoulas")
        return content
    
    # Find the enclosing ] by tracking brackets
    i = arr_start + len('localDoulas: [')
    depth = 1
    while i < len(content) and depth > 0:
        if content[i] == '[': depth += 1
        elif content[i] == ']': depth -= 1
        i += 1
    
    before = content[:arr_start + len('localDoulas: [')]
    after = content[i - 1:]  # includes the ]
    
    return before + '\n' + new_entries + after


# ── main ──

CITIES_PATH = os.path.expanduser("~/Projects/truejoybirthing-website/src/data/cities.ts")
BACKUP = CITIES_PATH + ".bak"

slugs = {
    "norfolk-va": "/tmp/tjb-norfolk-enriched.json",
    "fremont-ca": "/tmp/tjb-fremont-enriched.json",
    "vancouver-wa": "/tmp/tjb-vancouver-v2.json",
}

with open(CITIES_PATH) as f:
    content = f.read()

opens_before = content.count('{')
closes_before = content.count('}')
print(f"Before: {opens_before} opens, {closes_before} closes {'✅' if opens_before == closes_before else '❌'}")

for slug, json_path in slugs.items():
    entries = build_all_entries(json_path)
    count = entries.count('{ name:')
    print(f"\n{slug}: {count} entries")
    content = replace_section(content, slug, entries)

opens_after = content.count('{')
closes_after = content.count('}')
delta = opens_after - opens_before
print(f"\nAfter:  {opens_after} opens, {closes_after} closes {'✅' if opens_after == closes_after else '❌'}")
print(f"Delta:  {delta} new braces ({delta} providers added)")

# Backup original
backup_dir = os.path.dirname(BACKUP)
if backup_dir:
    os.makedirs(backup_dir, exist_ok=True)

with open(CITIES_PATH) as f:
    orig = f.read()

with open(BACKUP, 'w') as f:
    f.write(orig)

with open(CITIES_PATH, 'w') as f:
    f.write(content)

print(f"Saved. Backup at {BACKUP}")
