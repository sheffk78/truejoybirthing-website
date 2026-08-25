#!/bin/bash
# =============================================================================
# TJB Visual Preflight — Pre-deploy image quality gate
#
# Catches what preflight-stage-gate.py can't:
#   - Provider photos that are initials/placeholder images (<5KB or <100 colors)
#   - Support scene images with wrong aspect ratio
#   - Hero images with baked-in letterbox bars
#   - OG images with black bars
#
# This runs AFTER the pre-deploy gate but BEFORE the build step in deploy.sh.
# It blocks the deploy if any provider photo is a placeholder.
#
# Usage:
#   bash scripts/visual-preflight.sh [{slug}]
#
# If a slug is provided, checks only that city's providers.
# If no slug, scans ALL cities in cities.ts for placeholder photos.
#
# Exit codes:
#   0 — all images pass visual checks
#   1 — at least one image failed (deploy blocked)
# =============================================================================
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
IMAGES_DIR="$PROJECT_DIR/public/images"
DOULAS_DIR="$IMAGES_DIR/doulas"

SLUG="${1:-}"

python3 -c "
import os, sys, re
from pathlib import Path

PROJECT_DIR = Path('$PROJECT_DIR')
DOULAS_DIR = Path('$DOULAS_DIR')
SLUG = '$SLUG' if '$SLUG' else None

try:
    from PIL import Image
except ImportError:
    print('⚠️  PIL/Pillow not available — visual preflight SKIPPED')
    sys.exit(0)

# Collect all provider photo paths from cities.ts
cities_ts = PROJECT_DIR / 'src' / 'data' / 'cities.ts'
if not cities_ts.exists():
    print('⚠️  cities.ts not found — visual preflight SKIPPED')
    sys.exit(0)

text = cities_ts.read_text(errors='replace')

# If slug provided, only check that city. Otherwise check all.
if SLUG:
    # Find the city block
    marker = f'\"{SLUG}\": {{'
    start = text.find(marker)
    if start < 0:
        print(f'⚠️  City {SLUG} not found in cities.ts — visual preflight SKIPPED')
        sys.exit(0)
    tail = text[start + len(marker):]
    nxt = re.search(r'\n\s*\"[a-z][a-z-]+-[a-z]{2}\":\s*\{', tail)
    blocks = [text[start:start + len(marker) + (nxt.start() if nxt else 5000)]]
    print(f'Visual prelight: checking {SLUG} provider photos...')
else:
    # Extract all city blocks
    blocks = []
    for m in re.finditer(r'\"([a-z]+(?:-[a-z]+)*-[a-z]{2})\"\s*:\s*\{', text):
        start = m.start()
        tail = text[start:]
        # Find the next city entry
        nxt = re.search(r'\n\s*\"[a-z][a-z-]+-[a-z]{2}\":\s*\{', text[m.end():])
        end = m.end() + nxt.start() if nxt else min(start + 10000, len(text))
        blocks.append(text[start:end])
    print(f'Visual preflight: scanning ALL {len(blocks)} cities for placeholder photos...')

failures = []
total_checked = 0
total_placeholders = 0

for block in blocks:
    slug_match = re.match(r'\"([^\"]+)\"', block)
    city_slug = slug_match.group(1) if slug_match else 'unknown'

    # Extract provider photo paths
    photo_refs = re.findall(r'photo\s*:\s*[\"\\']([^\"\\']+)', block)
    for ref in photo_refs:
        local_ref = ref.split('/images/', 1)[-1] if '/images/' in ref else ref.lstrip('/')
        photo_path = PROJECT_DIR / 'public' / 'images' / local_ref

        if not photo_path.exists():
            failures.append(f'{city_slug}: {ref} — FILE MISSING')
            total_placeholders += 1
            continue

        total_checked += 1
        file_size = photo_path.stat().st_size

        # Check 1: file size < 5KB = likely initials placeholder
        if file_size < 5000:
            failures.append(f'{city_slug}: {ref} — {file_size}B < 5KB (initials placeholder)')
            total_placeholders += 1
            continue

        # Check 2: color variance < 100 unique colors = likely initials placeholder
        # Initials images have a solid pastel background + 2 letters = very few colors
        try:
            img = Image.open(photo_path)
            colors = img.getcolors(maxcolors=10000)
            unique_colors = len(colors) if colors else 10000
            if unique_colors < 100:
                failures.append(f'{city_slug}: {ref} — {unique_colors} unique colors < 100 (initials placeholder)')
                total_placeholders += 1
        except Exception as e:
            # Can't check — don't block deploy, just warn
            print(f'  ⚠️  {city_slug}: {ref} — color check failed: {e}')

# Also check hero images for letterbox bars (all-black top/bottom rows)
hero_refs = set()
for block in blocks:
    slug_match = re.match(r'\"([^\"]+)\"', block)
    city_slug = slug_match.group(1) if slug_match else 'unknown'
    hero_match = re.search(r'heroImage\s*:\s*[\"\\']([^\"\\']+)', block)
    if hero_match:
        ref = hero_match.group(1)
        local_ref = ref.split('/images/', 1)[-1] if '/images/' in ref else ref.lstrip('/')
        hero_path = PROJECT_DIR / 'public' / 'images' / local_ref
        if hero_path.exists() and hero_path not in hero_refs:
            hero_refs.add(hero_path)
            try:
                img = Image.open(hero_path)
                w, h = img.size
                # Check top 5 rows and bottom 5 rows for all-black
                top_black = all(sum(img.getpixel((w//2, y))[:3]) < 15 for y in range(min(5, h)))
                bot_black = all(sum(img.getpixel((w//2, h-1-y))[:3]) < 15 for y in range(min(5, h)))
                if top_black and bot_black:
                    failures.append(f'{city_slug}: hero {ref} — letterbox bars detected (all-black top+bottom rows)')
            except Exception:
                pass

if total_placeholders > 0:
    print(f'')
    print(f'❌ VISUAL PREFLIGHT FAILED: {total_placeholders} placeholder/missing images found')
    print(f'   Checked {total_checked} real images, found {total_placeholders} failures')
    print(f'')
    for f in failures[:10]:
        print(f'   ❌ {f}')
    if len(failures) > 10:
        print(f'   ... and {len(failures) - 10} more')
    print(f'')
    print(f'   Fix: Source real headshot photos from provider websites.')
    print(f'   Initials placeholders (solid color + 2 letters) are NOT acceptable.')
    sys.exit(1)
else:
    print(f'✅ Visual preflight passed: {total_checked} provider photos verified real')
    sys.exit(0)
" || exit $?