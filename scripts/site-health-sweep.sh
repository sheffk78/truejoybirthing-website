#!/bin/bash
# =============================================================================
# TJB Site Health Sweep — Check all live city pages for broken resources
#
# P0: Runs as a daily cron. Checks every city with a video embed for:
#   - Hero/OG images returning HTTP 200
#   - YouTube embeds accessible (not deleted/unlisted)
#   - "Photo coming soon" placeholders on live pages
#   - Broken internal links
#   - Dead external provider photo URLs
#
# Usage:
#   bash scripts/site-health-sweep.sh              — check ALL cities with embeds
#   bash scripts/site-health-sweep.sh {slug}       — check specific city
#
# Exit code: 0 = all healthy, 1 = issues found
# =============================================================================
set -euo pipefail

PROJECT_DIR="/Users/socializerender/Projects/truejoybirthing-website"
cd "$PROJECT_DIR"

SLUG="${1:-}"
FAILED=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "═══════════════════════════════════════════"
echo "  TJB SITE HEALTH SWEEP"
echo "  Target: ${SLUG:-ALL CITIES WITH EMBEDS}"
echo "  Time:   $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "═══════════════════════════════════════════"

health_pass() { echo -e "  ${GREEN}✅${NC} $1"; }
health_fail() { echo -e "  ${RED}❌${NC} $1"; FAILED=1; }
health_warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
health_header() { echo ""; echo "─── $1 ───"; }

# ── Get list of cities to check ────────────────────────────────────
health_header "Target Selection"
if [ -n "$SLUG" ]; then
  CITIES=("$SLUG")
  health_pass "Checking specific city: $SLUG"
else
  # Get all cities with video embeds from video-embeds.ts
  CITIES=($(grep -oP '(?<=")[a-z]+-[a-z]{2}(?=":)' src/data/video-embeds.ts 2>/dev/null || echo ""))
  health_pass "Found ${#CITIES[@]} cities with video embeds to check"
fi

if [ ${#CITIES[@]} -eq 0 ]; then
  health_fail "No cities found to check"
  exit 1
fi

# ── H1: Live page returns 200 ──────────────────────────────────────
health_header "H1: Live Page Health"
for city_slug in "${CITIES[@]}"; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://truejoybirthing.com/birth-support/${city_slug}/" 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    health_pass "$city_slug — 200 OK"
  else
    health_fail "$city_slug — HTTP $HTTP_CODE"
  fi
done

# ── H2: Hero and OG images return 200 ──────────────────────────────
health_header "H2: Hero & OG Image Health"
for city_slug in "${CITIES[@]}"; do
  # Get hero image URL from cities.ts
  HERO_URL=$(grep -A 10 "\"${city_slug}\":" src/data/cities.ts | grep 'heroImage:' | head -1 | sed 's/.*heroImage: *"\([^"]*\)".*/\1/' || echo "")
  if [ -n "$HERO_URL" ]; then
    HERO_FULL="https://truejoybirthing.com${HERO_URL}"
    HERO_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HERO_FULL" 2>/dev/null || echo "000")
    if [ "$HERO_CODE" = "200" ]; then
      HERO_SIZE=$(curl -sI "$HERO_FULL" 2>/dev/null | grep -i 'content-length' | awk '{print $2}' | tr -d '\r' || echo "0")
      if [ "${HERO_SIZE:-0}" -gt 10000 ]; then
        health_pass "$city_slug hero image — 200, ${HERO_SIZE}B"
      else
        health_warn "$city_slug hero image — 200 but only ${HERO_SIZE:-0}B (may be placeholder)"
      fi
    else
      health_fail "$city_slug hero image — HTTP $HERO_CODE"
    fi
  fi
  
  # Get OG image URL
  OG_URL=$(grep -A 10 "\"${city_slug}\":" src/data/cities.ts | grep 'ogImage:' | head -1 | sed 's/.*ogImage: *"\([^"]*\)".*/\1/' || echo "")
  if [ -n "$OG_URL" ]; then
    OG_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$OG_URL" 2>/dev/null || echo "000")
    if [ "$OG_CODE" = "200" ]; then
      OG_SIZE=$(curl -sI "$OG_URL" 2>/dev/null | grep -i 'content-length' | awk '{print $2}' | tr -d '\r' || echo "0")
      if [ "${OG_SIZE:-0}" -gt 10000 ]; then
        health_pass "$city_slug OG image — 200, ${OG_SIZE}B"
      else
        health_warn "$city_slug OG image — 200 but only ${OG_SIZE:-0}B"
      fi
    else
      health_fail "$city_slug OG image — HTTP $OG_CODE"
    fi
  fi
done

# ── H3: YouTube embed health ──────────────────────────────────────
health_header "H3: YouTube Embed Health"
for city_slug in "${CITIES[@]}"; do
  VIDEO_ID=$(grep -A 2 "\"${city_slug}\":" src/data/video-embeds.ts 2>/dev/null | grep 'videoId' | sed 's/.*videoId: *"\([^"]*\)".*/\1/' || echo "")
  if [ -n "$VIDEO_ID" ]; then
    YT_STATUS=$(curl -sI "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${VIDEO_ID}&format=json" 2>/dev/null | head -1 | grep -c "200" || echo 0)
    if [ "$YT_STATUS" -eq 1 ]; then
      health_pass "$city_slug YouTube embed $VIDEO_ID — accessible"
    else
      health_fail "$city_slug YouTube embed $VIDEO_ID — NOT ACCESSIBLE (deleted/unlisted)"
    fi
  else
    health_warn "$city_slug — no video embed found"
  fi
done

# ── H4: Live page content check ────────────────────────────────────
health_header "H4: Live Page Content"
for city_slug in "${CITIES[@]}"; do
  LIVE_HTML=$(curl -sL "https://truejoybirthing.com/birth-support/${city_slug}/" 2>/dev/null || echo "")
  if [ -z "$LIVE_HTML" ]; then
    health_fail "$city_slug — could not fetch page HTML"
    continue
  fi
  
  # Check for "Photo coming soon" placeholder text (broken images show this)
  if echo "$LIVE_HTML" | grep -qi "photo coming soon\|coming soon\|placeholder\|no photo"; then
    health_warn "$city_slug — contains 'Photo coming soon' placeholder text"
  fi
  
  # Check for broken internal links
  BROKEN_LINKS=$(echo "$LIVE_HTML" | grep -oP 'href="[^"]*"' | grep -v "^href=\"https\?://" | grep -v "^href=\"#" | grep -v "^href=\"mailto:" | grep -v "truejoybirthing" | grep -v "^href=\"\/$" | grep -v '^href=""' || echo "")
  if [ -n "$BROKEN_LINKS" ]; then
    BROKEN_COUNT=$(echo "$BROKEN_LINKS" | wc -l | tr -d ' ')
    if [ "$BROKEN_COUNT" -gt 5 ]; then
      health_warn "$city_slug — $BROKEN_COUNT internal links without full URLs (may be relative-path issues)"
    fi
  fi
done

# ── H5: External provider photo URLs still live ────────────────────
health_header "H5: External Provider Photo URLs"
TOTAL_EXTERNAL=0
BROKEN_EXTERNAL=0
for city_slug in "${CITIES[@]}"; do
  CITY_BLOCK=$(awk "/\"${city_slug}\":/{p=1} p; /^  },/{if(p) exit}" src/data/cities.ts 2>/dev/null || echo "")
  if [ -z "$CITY_BLOCK" ]; then continue; fi
  
  # Extract external photo URLs (non-local, non-empty)
  PHOTO_URLS=$(echo "$CITY_BLOCK" | grep -oP 'photo:\s*"https?://[^"]+' | sed 's/photo: *"//' || echo "")
  for url in $PHOTO_URLS; do
    TOTAL_EXTERNAL=$((TOTAL_EXTERNAL + 1))
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "301" ] && [ "$HTTP_CODE" != "302" ]; then
      health_fail "$city_slug — external photo URL HTTP $HTTP_CODE: ${url:0:80}"
      BROKEN_EXTERNAL=$((BROKEN_EXTERNAL + 1))
    fi
  done
done
if [ "$TOTAL_EXTERNAL" -gt 0 ]; then
  health_pass "$TOTAL_EXTERNAL external URLs checked, $BROKEN_EXTERNAL broken"
fi

# ── Summary ─────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
if [ "$FAILED" -eq 0 ]; then
  echo -e "  ${GREEN}ALL HEALTH CHECKS PASSED${NC}"
  echo "═══════════════════════════════════════════"
  exit 0
else
  echo -e "  ${RED}HEALTH ISSUES FOUND — review above${NC}"
  echo "═══════════════════════════════════════════"
  exit 1
fi