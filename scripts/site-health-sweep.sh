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
#   bash scripts/site-health-sweep.sh --full       — weekly mode: also run the
#               full-corpus S11 check (every city ogImage in cities.ts)
#
# Exit code: 0 = all healthy, 1 = issues found
# =============================================================================
set -euo pipefail

PROJECT_DIR="/Users/socializerender/Projects/truejoybirthing-website"
cd "$PROJECT_DIR"

FULL_MODE=false
SLUG=""
for arg in "$@"; do
  if [ "$arg" = "--full" ]; then FULL_MODE=true; else SLUG="$arg"; fi
done
FAILED=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "═══════════════════════════════════════════"
echo "  TJB SITE HEALTH SWEEP"
echo "  Target: ${SLUG:-ALL CITIES WITH EMBEDS}${FULL_MODE:+  [FULL MODE]}"
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
  # (pattern must allow multi-word slugs like las-vegas-nv — [a-z]+-[a-z]{2}
  #  silently split them and skipped 36 of 156 cities until 2026-09-11)
  CITIES=($(grep -oE '"[a-z]+(-[a-z]+)*-[a-z]{2}":' src/data/video-embeds.ts 2>/dev/null | tr -d '":' || echo ""))
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
  CITY_BLOCK=$(awk "/\"${city_slug}\":/{p=1} p; /^  },/{if(p) exit}" src/data/cities.ts 2>/dev/null || echo "")
  # Get hero image URL from cities.ts (whole block — grep -A N misses fields
  # in larger blocks, which silently skipped the check for those cities)
  HERO_URL=$(echo "$CITY_BLOCK" | grep 'heroImage:' | head -1 | sed 's/.*heroImage: *"\([^"]*\)".*/\1/' || echo "")
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
  
  # Get OG image URL (whole block, same fix as hero)
  OG_URL=$(echo "$CITY_BLOCK" | grep 'ogImage:' | head -1 | sed 's/.*ogImage: *"\([^"]*\)".*/\1/' || echo "")
  if [ -n "$OG_URL" ]; then
    # Prefix relative paths with the domain (absolute URLs pass through)
    case "$OG_URL" in
      http*) OG_FULL="$OG_URL" ;;
      *) OG_FULL="https://truejoybirthing.com${OG_URL}" ;;
    esac
    OG_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$OG_FULL" 2>/dev/null || echo "000")
    if [ "$OG_CODE" = "200" ]; then
      OG_SIZE=$(curl -sI "$OG_FULL" 2>/dev/null | grep -i 'content-length' | awk '{print $2}' | tr -d '\r' || echo "0")
      if [ "${OG_SIZE:-0}" -gt 10000 ]; then
        health_pass "$city_slug OG image — 200, ${OG_SIZE}B"
        # H2b (2026-09-11, Hayward OG aftermath P1): S11 content check on the
        # LIVE og:image — dims 1200x630, content bbox >=92% w+h, density >=30%.
        # Existence+size alone let quarter-content hayward/corona ship.
        TMP_OG="$(mktemp -t oglive-${city_slug}.XXXXXX)"
        if curl -s --max-time 30 -o "$TMP_OG" "$OG_FULL" 2>/dev/null \
           && python3 "$PROJECT_DIR/scripts/check-og-content.py" --file "$TMP_OG" >/dev/null 2>&1; then
          health_pass "$city_slug OG content — fills 1200x630 canvas (S11-live)"
        else
          health_fail "$city_slug OG CONTENT FAILS S11 (quarter-content / wrong dims / fetch) — $OG_FULL"
        fi
        rm -f "$TMP_OG"
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
  VIDEO_ID=$(grep -A 2 "\"${city_slug}\":" src/data/video-embeds.ts 2>/dev/null | grep 'videoId' | head -1 | sed 's/.*videoId: *"\([^"]*\)".*/\1/' || echo "")
  if [ -n "$VIDEO_ID" ]; then
    YT_STATUS=$(curl -sI "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${VIDEO_ID}&format=json" 2>/dev/null | head -1 | grep -c "200" || true)
    if [ "${YT_STATUS:-0}" -eq 1 ]; then
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
  
  # Check for broken internal links (site-internal relative links that 404).
  # Valid relative paths (/about/, /doula-cost/) are EXPECTED — only flag
  # empty hrefs, bare hashes-in-href, and clearly malformed values.
  BROKEN_LINKS=$(echo "$LIVE_HTML" | grep -oE 'href="[^"]*"' | grep -vE '^href="(https?://|/|#|mailto:|\./|\.\./|\?|tel:)' | grep -v truejoybirthing | grep -v '^href=""' || echo "")
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
  PHOTO_URLS=$(echo "$CITY_BLOCK" | grep -oE 'photo:[[:space:]]*"https?://[^"]+' | sed 's/photo:[[:space:]]*"//' || echo "")
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

# ── H6: Facility paragraphs present for checked cities (Hayward aftermath) ──
# Mirrors validate-city-data.ts checkFacilityParas: the [city].astro template
# renders h.paragraph / bc.paragraph — data in 'description' renders EMPTY on
# the live page (hayward-ca shipped without birth-center text, found 2026-09-10;
# the validator postdates that ship). Deterministic, no LLM.
health_header "H6: Facility Paragraphs (rendered-field check)"
FACILITY_FAILS=0
for city_slug in "${CITIES[@]}"; do
  CITY_BLOCK=$(awk "/\"${city_slug}\":/{p=1} p; /^  },/{if(p) exit}" src/data/cities.ts 2>/dev/null || echo "")
  if [ -z "$CITY_BLOCK" ]; then continue; fi
  # Collect every hospital/birth-center paragraph + name pairing in the block.
  # An entry whose paragraph field is missing or <200 rendered chars FAILS,
  # except the "no freestanding birth centers" info-note entries.
  BAD_PARAS=$(python3 - "$city_slug" <<'PYEOF'
import re, sys
src = open('src/data/cities.ts').read()
slug = sys.argv[1]
m = re.search(r'"%s": \{' % re.escape(slug), src)
if not m:
    sys.exit(0)
window = src[m.end():m.end() + 30000]
nxt = re.search(r'"[a-z0-9-]+": \{', window[100:])
block = window[:100 + nxt.start()] if nxt else window
def scan(kind):
    out = []
    for sm in re.finditer(kind + r'Details:\s*\[', block):
        arr = block[sm.end():sm.end() + 40000]
        depth, end = 1, 0
        for i, c in enumerate(arr):
            if c == '[': depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    end = i; break
        for em in re.finditer(r'name:\s*"([^"]+)"[^{}]*?paragraph:\s*"([^"]*)"', arr[:end], re.S):
            name, para = em.group(1), em.group(2)
            if re.match(r'^no freestanding birth centers', name, re.I):
                continue
            if len(re.sub(r'<[^>]+>', '', para).strip()) < 200:
                out.append(f'{kind} "{name}" ({len(re.sub(chr(60)+"[^"+chr(62)+"]+"+chr(62), "", para).strip())} chars)')
    return out
probs = scan('hospital') + scan('birthCenter')
if probs:
    print('; '.join(probs))
PYEOF
)
  if [ -n "$BAD_PARAS" ]; then
    health_fail "$city_slug — facility paragraph missing/thin (template renders 'paragraph' field): $BAD_PARAS"
    FACILITY_FAILS=$((FACILITY_FAILS + 1))
  fi
done
if [ "$FACILITY_FAILS" -eq 0 ]; then
  health_pass "All facility paragraphs present in rendered field (checked ${#CITIES[@]} cities)"
fi

# ── H7: Weekly full-corpus S11 + full data validation (--full mode) ──
if [ "$FULL_MODE" = true ]; then
  health_header "H7: Full-Corpus S11 (every city ogImage in cities.ts)"
  if python3 scripts/check-og-content.py --write-report > /tmp/s11-full.log 2>&1; then
    health_pass "Full-corpus S11: $(grep -oE '[0-9]+/[0-9]+ pass' /tmp/s11-full.log | tail -1)"
  else
    health_fail "Full-corpus S11 FAILURES — see /tmp/s11-full.log"
    grep '^FAIL' /tmp/s11-full.log | head -10
  fi
  health_header "H7b: Full-Corpus Data Validation (validate-city-data.ts, all cities)"
  if npx tsx scripts/validate-city-data.ts > /tmp/validate-full.log 2>&1; then
    health_pass "Full-corpus data validation: exit 0"
  else
    health_fail "Full-corpus data validation ERRORS — see /tmp/validate-full.log"
    grep '✗' /tmp/validate-full.log | head -10
  fi
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