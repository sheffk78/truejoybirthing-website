#!/bin/bash
# =============================================================================
# TJB Pre-Commit Gate — Hard enforcement, runs on EVERY git commit
#
# Validates ALL cities.ts data integrity before allowing a commit.
# Exits non-zero if ANY gate fails — commit is blocked.
#
# This is the P0 self-checking gate. It catches the most common error
# patterns before they ever reach a build or deploy:
#   - Providers missing photo fields
#   - Hospitals missing thumbnail fields
#   - Referenced image files that don't exist on disk
#   - Skyline hero images (should be pregnant silhouette)
#   - Scraped description artifacts
#   - Over-escaped href values
#
# Install as a git pre-commit hook:
#   ln -sf ../../scripts/pre-commit-gate.sh .git/hooks/pre-commit
#
# Usage:
#   bash scripts/pre-commit-gate.sh              — check all cities
#   bash scripts/pre-commit-gate.sh {slug}       — check specific city only
#   PRE_COMMIT_SKIP=1 git commit -m "..."         — bypass gate in emergency
# =============================================================================
set -euo pipefail

PROJECT_DIR="/Users/socializerender/Projects/truejoybirthing-website"
SLUG="${1:-}"
FAILED=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Allow bypass in emergency
if [ "${PRE_COMMIT_SKIP:-0}" = "1" ]; then
  echo -e "  ${YELLOW}⚠ PRE_COMMIT_SKIP=1 — bypassing gate${NC}"
  exit 0
fi

echo "═══════════════════════════════════════════"
echo "  TJB PRE-COMMIT GATE"
echo "  Target: ${SLUG:-ALL CITIES}"
echo "  Time:   $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "═══════════════════════════════════════════"

gate_pass()   { echo -e "  ${GREEN}✅${NC} $1"; }
gate_fail()   { echo -e "  ${RED}❌${NC} $1"; FAILED=1; }
gate_header() { echo ""; echo "─── $1 ───"; }

CITIES_FILE="$PROJECT_DIR/src/data/cities.ts"

if [ ! -f "$CITIES_FILE" ]; then
  gate_fail "cities.ts not found at $CITIES_FILE"
  exit 1
fi

# ── G-C1: Every provider has a photo field ─────────────────────────
gate_header "G-C1: Provider Photo Fields"
if [ -n "$SLUG" ]; then
  # Get the city block for this slug
  CITY_BLOCK=$(awk "/\"${SLUG}\":/{p=1} p; /^  },/{if(p) exit}" "$CITIES_FILE" 2>/dev/null || echo "")
  if [ -z "$CITY_BLOCK" ]; then
    gate_fail "Could not find city block for $SLUG in cities.ts"
  else
    MISSING_PHOTO=$(echo "$CITY_BLOCK" | grep -c '{ name:' | head -1 || echo 0)
    HAS_PHOTO=$(echo "$CITY_BLOCK" | grep -c 'photo:' || echo 0)
    # Count provider entries by counting opening braces after localDoulas
    echo "$CITY_BLOCK" > /tmp/city_block_$$.txt
    PROVIDER_COUNT=$(python3 -c "
import re
with open('/tmp/city_block_$$.txt') as f:
    content = f.read()
# Find localDoulas array
m = re.search(r'localDoulas:\s*\[(.*?)\]', content, re.DOTALL)
if m:
    arr = m.group(1)
    # Count objects by finding '{ name:' patterns
    count = len(re.findall(r'\{[^}]*name:', arr))
    # Count photo fields
    photo_count = len(re.findall(r'photo:\s*\"', arr))
    print(f'{count},{photo_count}')
else:
    print('0,0')
" 2>/dev/null || echo "0,0")
    rm -f /tmp/city_block_$$.txt
    P_COUNT=$(echo "$PROVIDER_COUNT" | cut -d, -f1)
    PH_COUNT=$(echo "$PROVIDER_COUNT" | cut -d, -f2)
    if [ "$P_COUNT" -gt 0 ] && [ "$PH_COUNT" -lt "$P_COUNT" ]; then
      gate_fail "Only $PH_COUNT/$P_COUNT providers have photo: field in $SLUG"
    else
      gate_pass "$PH_COUNT/$P_COUNT providers have photo: field"
    fi
  fi
else
  # Full audit: check all cities
  # Extract all city slugs from cities.ts
  ALL_SLUGS=$(grep -oP '(?<="slug": ")[^"]+' "$CITIES_FILE" || echo "")
  for city_slug in $ALL_SLUGS; do
    CITY_BLOCK=$(awk "/\"${city_slug}\":/{p=1} p; /^  },/{if(p) exit}" "$CITIES_FILE" 2>/dev/null || echo "")
    if [ -z "$CITY_BLOCK" ]; then continue; fi
    echo "$CITY_BLOCK" > /tmp/cb_$$.txt
    RESULT=$(python3 -c "
import re
with open('/tmp/cb_$$.txt') as f:
    content = f.read()
m = re.search(r'localDoulas:\s*\[(.*?)\]', content, re.DOTALL)
if m:
    arr = m.group(1)
    count = len(re.findall(r'\{[^}]*name:', arr))
    photo_count = len(re.findall(r'photo:\s*\"', arr))
    if count > 0 and photo_count < count:
        print(f'{city_slug}:{photo_count}/{count}')
" 2>/dev/null || true)
    rm -f /tmp/cb_$$.txt
    if [ -n "$RESULT" ]; then
      gate_fail "Provider photo field missing: $RESULT"
    fi
  done
  if [ "$FAILED" -eq 0 ]; then
    gate_pass "All providers in all cities have photo: field"
  fi
fi

# ── G-C2: Every hospital has a thumbnail field ──────────────────────
gate_header "G-C2: Hospital Thumbnail Fields"
if [ -n "$SLUG" ]; then
  CITY_BLOCK=$(awk "/\"${SLUG}\":/{p=1} p; /^  },/{if(p) exit}" "$CITIES_FILE" 2>/dev/null || echo "")
  if [ -n "$CITY_BLOCK" ]; then
    echo "$CITY_BLOCK" > /tmp/cb2_$$.txt
    HOSPITAL_RESULT=$(python3 -c "
import re
with open('/tmp/cb2_$$.txt') as f:
    content = f.read()
# Check hospitalDetails
hm = re.search(r'hospitalDetails:\s*\[(.*?)\]', content, re.DOTALL)
if hm:
    arr = hm.group(1)
    hosp_count = len(re.findall(r'\{[^}]*name:', arr))
    thumb_count = len(re.findall(r'thumbnail:\s*\"', arr))
    if hosp_count > 0 and thumb_count < hosp_count:
        print(f'hospital: {thumb_count}/{hosp_count}')
# Check birthCenterDetails too
bcm = re.search(r'birthCenterDetails:\s*\[(.*?)\]', content, re.DOTALL)
if bcm:
    arr = bcm.group(1)
    bc_count = len(re.findall(r'\{[^}]*name:', arr))
    bc_thumb = len(re.findall(r'thumbnail:\s*\"', arr))
    if bc_count > 0 and bc_thumb < bc_count:
        print(f'birthCenter: {bc_thumb}/{bc_count}')
" 2>/dev/null || true)
    rm -f /tmp/cb2_$$.txt
    if [ -n "$HOSPITAL_RESULT" ]; then
      gate_fail "Missing thumbnails: $HOSPITAL_RESULT in $SLUG"
    else
      gate_pass "All hospitals and birth centers have thumbnail: fields"
    fi
  fi
else
  for city_slug in $ALL_SLUGS; do
    CITY_BLOCK=$(awk "/\"${city_slug}\":/{p=1} p; /^  },/{if(p) exit}" "$CITIES_FILE" 2>/dev/null || echo "")
    if [ -z "$CITY_BLOCK" ]; then continue; fi
    echo "$CITY_BLOCK" > /tmp/cb2_$$.txt
    HOSPITAL_RESULT=$(python3 -c "
import re
with open('/tmp/cb2_$$.txt') as f:
    content = f.read()
hm = re.search(r'hospitalDetails:\s*\[(.*?)\]', content, re.DOTALL)
issues = []
if hm:
    arr = hm.group(1)
    hosp_count = len(re.findall(r'\{[^}]*name:', arr))
    thumb_count = len(re.findall(r'thumbnail:\s*\"', arr))
    if hosp_count > 0 and thumb_count < hosp_count:
        issues.append(f'{city_slug}:hospital {thumb_count}/{hosp_count}')
bcm = re.search(r'birthCenterDetails:\s*\[(.*?)\]', content, re.DOTALL)
if bcm:
    arr = bcm.group(1)
    bc_count = len(re.findall(r'\{[^}]*name:', arr))
    bc_thumb = len(re.findall(r'thumbnail:\s*\"', arr))
    if bc_count > 0 and bc_thumb < bc_count:
        issues.append(f'{city_slug}:birthCenter {bc_thumb}/{bc_count}')
if issues:
    print('|'.join(issues))
" 2>/dev/null || true)
    rm -f /tmp/cb2_$$.txt
    if [ -n "$HOSPITAL_RESULT" ]; then
      gate_fail "Missing thumbnails: $HOSPITAL_RESULT"
    fi
  done
  if [ "$FAILED" -eq 0 ]; then
    gate_pass "All hospitals and birth centers in all cities have thumbnail: fields"
  fi
fi

# ── G-C3: No scraped description artifacts ──────────────────────────
gate_header "G-C3: Scraped Description Artifacts"
# Search only in provider description fields and FAQ answers (not TypeScript code)
cd "$PROJECT_DIR"
ARTIFACT_FOUND=0
ARTIFACTS_CHECK=$(python3 -c "
import re
with open('src/data/cities.ts') as f:
    content = f.read()
# Only check description and a (FAQ answer) fields
desc_matches = re.findall(r'description:\s*\".*?\"', content)
faq_matches = re.findall(r'a:\s*\".*?\"', content)
all_text = desc_matches + faq_matches
artifacts = ['keyboard drag state', 'jpg HEXHEX', 'cropped-']
found = []
for artifact in artifacts:
    for text in all_text:
        if artifact.lower() in text.lower():
            found.append(artifact)
            break
if found:
    print('|'.join(found))
else:
    print('CLEAN')
" 2>/dev/null)
if [ "$ARTIFACTS_CHECK" != "CLEAN" ]; then
  ARTIFACT_FOUND=1
  IFS='|' read -ra ADDR <<< "$ARTIFACTS_CHECK"
  for artifact in "${ADDR[@]}"; do
    gate_fail "Scraped artifact found in provider descriptions: '$artifact'"
  done
fi
if [ "$ARTIFACT_FOUND" -eq 0 ]; then
  gate_pass "No scraped description artifacts detected"
fi

# ── G-C4: No skyline in hero image filenames (warning, not hard fail) ──
gate_header "G-C4: Hero Image Filename Convention"
if [ -n "$SLUG" ]; then
  # Targeted check: only check this city's hero image
  HERO_LINE=$(grep -A 5 "\"${SLUG}\":" "$CITIES_FILE" | grep 'heroImage:' || echo "")
  if echo "$HERO_LINE" | grep -q 'skyline'; then
    echo -e "  ${YELLOW}⚠${NC} $SLUG hero image filename contains 'skyline' — should be pregnant silhouette"
  else
    gate_pass "hero image filename OK for $SLUG"
  fi
else
  # Full audit
  SKYLINE_COUNT=$(grep -c 'skyline' "$CITIES_FILE" 2>/dev/null || echo 0)
  if [ "$SKYLINE_COUNT" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠${NC} $SKYLINE_COUNT city entries reference 'skyline' in hero image — should be pregnant silhouette"
    grep -n 'heroImage.*skyline' "$CITIES_FILE" | head -5 | while read -r line; do
      echo "    → $line"
    done
    echo "    (pre-commit cannot inspect image contents — verify manually)"
  else
    gate_pass "No skyline references in hero image filenames"
  fi
fi

# ── G-C5: Over-escaped href values ─────────────────────────────────
gate_header "G-C5: Over-Escaped href Values"
BROKEN_HREF=$(grep -c 'href=\\\\\\\\\"/' "$CITIES_FILE" 2>/dev/null || echo 0)
if [ "$BROKEN_HREF" -gt 0 ] 2>/dev/null; then
  gate_fail "$BROKEN_HREF over-escaped href values found (3+ backslashes) — will produce 404 URLs"
else
  gate_pass "No over-escaped href values"
fi

# ── G-C6: All locally-referenced images exist on disk ≥1KB ─────────
gate_header "G-C6: Referenced Image Files Exist on Disk"
cd "$PROJECT_DIR"

# Use Python for the full check (avoids subshell variable issue)
python3 -c "
import os, re, sys

missing = []
with open('src/data/cities.ts') as f:
    content = f.read()

target_slug = '${SLUG}'

# If targeting a specific city, extract only its block
if target_slug:
    m = re.search(r'\"' + target_slug + r'\":\s*\{', content)
    if not m:
        print(f'  City {target_slug} not found in cities.ts')
        sys.exit(1)
    # Find block boundaries
    start = m.start()
    depth = 0
    end = len(content)
    for i in range(start, len(content)):
        if content[i] == '{': depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    content = content[start:end]

refs = re.findall(r'(?:heroImage|ogImage|photo|thumbnail|supportSceneImage):\s*\"([^\"]+)\"', content)
local_refs = [r for r in refs if r.startswith('/') and not r.startswith('//')]

for ref in local_refs:
    local_path = 'public' + ref
    if not os.path.exists(local_path):
        missing.append(f'Missing: {ref}')
    else:
        size = os.path.getsize(local_path)
        if size < 1000:
            missing.append(f'Too small ({size}B): {ref}')

if missing:
    for m in missing:
        print(f'  ❌ {m}')
    sys.exit(1)
else:
    sys.exit(0)
" 2>&1 || MISSING_IMAGES=1

if [ "${MISSING_IMAGES:-0}" = "1" ]; then
  gate_fail "Some referenced image files are missing or too small"
else
  gate_pass "All referenced image files exist on disk >=1KB"
fi

# ── Summary ─────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
if [ "$FAILED" -eq 0 ]; then
  echo -e "  ${GREEN}ALL GATES PASSED${NC} — commit allowed"
  echo "═══════════════════════════════════════════"
  exit 0
else
  echo -e "  ${RED}SOME GATES FAILED — commit blocked${NC}"
  echo "  Fix the issues above, then commit again."
  echo "  To bypass in emergency: PRE_COMMIT_SKIP=1 git commit ..."
  echo "═══════════════════════════════════════════"
  exit 1
fi