#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# TJB CI/CD Validation — validate-links.sh
# ═══════════════════════════════════════════════════════════════
# Validates:
#   1. City coverage: every slug in cities.ts appears in city-links.ts
#   2. Hash anchor check: no href="#download" should exist in src/
#   3. Build the site, then count ContextualCityLinks usage + variant distribution
#
# Exit code: 0 if all checks pass, 1 if any check fails.
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

CITIES_FILE="$PROJECT_ROOT/src/data/cities.ts"
CITY_LINKS_FILE="$PROJECT_ROOT/src/data/city-links.ts"
SRC_DIR="$PROJECT_ROOT/src"

FAIL=0

# ── Colors ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ════════════════════════════════════════════════════════════════
# CHECK 1: City Coverage
# ════════════════════════════════════════════════════════════════
echo ""
echo -e "${BOLD}${CYAN}═══ CHECK 1: City Coverage ═══${NC}"
echo -e "Every slug in cities.ts must appear in at least one topic in city-links.ts"
echo ""

# Extract all city slugs from cities.ts
ALL_SLUGS=$(grep -oE 'slug:\s*"[^"]+"' "$CITIES_FILE" | sed 's/slug:[[:space:]]*"//;s/"$//' | sort -u)

# Extract all slugs referenced in city-links.ts
LINKED_SLUGS=$(grep -oE 'slug:\s*"[^"]+"' "$CITY_LINKS_FILE" | sed 's/slug:[[:space:]]*"//;s/"$//' | sort -u)

UNCOVERED=()
TOTAL_SLUGS=0
COVERED_SLUGS=0

while IFS= read -r slug; do
    TOTAL_SLUGS=$((TOTAL_SLUGS + 1))
    if echo "$LINKED_SLUGS" | grep -qx "$slug"; then
        COVERED_SLUGS=$((COVERED_SLUGS + 1))
    else
        UNCOVERED+=("$slug")
    fi
done <<< "$ALL_SLUGS"

COVERAGE_PCT=0
if [ "$TOTAL_SLUGS" -gt 0 ]; then
    COVERAGE_PCT=$((COVERED_SLUGS * 100 / TOTAL_SLUGS))
fi

echo "  Total city slugs:      $TOTAL_SLUGS"
echo "  Covered in city-links: $COVERED_SLUGS"
echo "  Coverage:              ${COVERAGE_PCT}%"
echo ""

if [ ${#UNCOVERED[@]} -gt 0 ]; then
    echo -e "  ${RED}${BOLD}FAIL${NC} — ${#UNCOVERED[@]} city slug(s) not found in any city-links topic:"
    for slug in "${UNCOVERED[@]}"; do
        echo -e "    ${RED}✗${NC} $slug"
    done
    FAIL=1
else
    echo -e "  ${GREEN}${BOLD}PASS${NC} — All city slugs are covered in city-links.ts"
fi

# ════════════════════════════════════════════════════════════════
# CHECK 2: Hash Anchor Check (href="#download")
# ════════════════════════════════════════════════════════════════
echo ""
echo -e "${BOLD}${CYAN}═══ CHECK 2: Hash Anchor Check ═══${NC}"
echo -e 'Searching for href="#download" in src/'
echo ""

HASH_MATCHES=$(grep -rn 'href="#download"' "$SRC_DIR" || true)
HASH_COUNT=0
if [ -n "$HASH_MATCHES" ]; then
    HASH_COUNT=$(echo "$HASH_MATCHES" | grep -c . || true)
fi

if [ "$HASH_COUNT" -gt 0 ]; then
    AFFECTED_FILES=$(echo "$HASH_MATCHES" | sed 's/:.*//' | sort -u)
    FILE_COUNT=$(echo "$AFFECTED_FILES" | wc -l | tr -d ' ')

    echo -e "  ${RED}${BOLD}FAIL${NC} — Found ${HASH_COUNT} occurrence(s) of href=\"#download\" across ${FILE_COUNT} file(s):"
    echo ""
    while IFS= read -r line; do
        FILE=$(echo "$line" | cut -d: -f1 | sed "s|$PROJECT_ROOT/||")
        LINENUM=$(echo "$line" | cut -d: -f2)
        echo -e "    ${RED}✗${NC} ${FILE}:${LINENUM}"
    done <<< "$HASH_MATCHES"
    FAIL=1
else
    echo -e "  ${GREEN}${BOLD}PASS${NC} — No href=\"#download\" anchors found in src/"
fi

# ════════════════════════════════════════════════════════════════
# CHECK 3: Build + ContextualCityLinks Usage & Variant Distribution
# ════════════════════════════════════════════════════════════════
echo ""
echo -e "${BOLD}${CYAN}═══ CHECK 3: Build + ContextualCityLinks Variant Distribution ═══${NC}"
echo "Building site first, then tallying ContextualCityLinks usage"
echo ""

# --- Step 3a: Build the site ---
echo -e "  ${YELLOW}Building site...${NC}"
if ! (cd "$PROJECT_ROOT" && npm run build > /dev/null 2>&1); then
    echo -e "  ${RED}${BOLD}FAIL${NC} — Site build failed. Run \`npm run build\` for details."
    FAIL=1
else
    echo -e "  ${GREEN}✓${NC} Build succeeded"
fi

# --- Step 3b: Count ContextualCityLinks usage and variant distribution ---
echo ""
echo -e "  ${BOLD}Scanning source files for ContextualCityLinks usage:${NC}"

VARIANT_GRID2=0
VARIANT_STACKED=0
VARIANT_CARD3=0
VARIANT_DEFAULT=0

# Find all .astro files that reference ContextualCityLinks (excluding imports)
ASTRO_FILES=$(grep -rl 'ContextualCityLinks' "$SRC_DIR" --include='*.astro' 2>/dev/null || true)

for file in $ASTRO_FILES; do
    # Find all usages of <ContextualCityLinks .../> — skip import lines
    USAGES=$(grep -n 'ContextualCityLinks' "$file" | grep -v 'import' || true)

    while IFS= read -r usage; do
        if [ -z "$usage" ]; then
            continue
        fi

        # Check if variant prop is explicitly set
        if echo "$usage" | grep -q 'variant="stacked"'; then
            VARIANT_STACKED=$((VARIANT_STACKED + 1))
        elif echo "$usage" | grep -q 'variant="grid-2col"'; then
            VARIANT_GRID2=$((VARIANT_GRID2 + 1))
        elif echo "$usage" | grep -q 'variant="card-3col"'; then
            VARIANT_CARD3=$((VARIANT_CARD3 + 1))
        else
            # No explicit variant — compute the default from topic name
            # Component logic: variants[topic.length % 3]
            # where variants = ['grid-2col', 'stacked', 'card-3col']
            TOPIC=$(echo "$usage" | grep -oE 'topic="[^"]+"' | sed 's/topic="//;s/"//')

            if [ -n "$TOPIC" ]; then
                TOPIC_LEN=${#TOPIC}
                MOD=$((TOPIC_LEN % 3))

                case $MOD in
                    0) VARIANT_GRID2=$((VARIANT_GRID2 + 1)) ;;
                    1) VARIANT_STACKED=$((VARIANT_STACKED + 1)) ;;
                    2) VARIANT_CARD3=$((VARIANT_CARD3 + 1)) ;;
                esac
            else
                VARIANT_DEFAULT=$((VARIANT_DEFAULT + 1))
            fi
        fi
    done <<< "$USAGES"
done

TOTAL_VARIANTS=$((VARIANT_GRID2 + VARIANT_STACKED + VARIANT_CARD3 + VARIANT_DEFAULT))

echo "  ContextualCityLinks usages found: $TOTAL_VARIANTS"
echo ""
echo -e "  ${BOLD}Variant Distribution:${NC}"

if [ "$TOTAL_VARIANTS" -gt 0 ]; then
    GRID2_PCT=$((VARIANT_GRID2 * 100 / TOTAL_VARIANTS))
    STACKED_PCT=$((VARIANT_STACKED * 100 / TOTAL_VARIANTS))
    CARD3_PCT=$((VARIANT_CARD3 * 100 / TOTAL_VARIANTS))

    printf "    %-12s %3d  (%3d%%)\n" "grid-2col" "$VARIANT_GRID2" "$GRID2_PCT"
    printf "    %-12s %3d  (%3d%%)\n" "stacked" "$VARIANT_STACKED" "$STACKED_PCT"
    printf "    %-12s %3d  (%3d%%)\n" "card-3col" "$VARIANT_CARD3" "$CARD3_PCT"

    if [ "$VARIANT_DEFAULT" -gt 0 ]; then
        printf "    %-12s %3d  (  — )\n" "no-topic" "$VARIANT_DEFAULT"
    fi

    # Check balance: target ~33% each, warn if any variant is > 50% or < 15%
    IMBALANCE=0
    for PCT in "$GRID2_PCT" "$STACKED_PCT" "$CARD3_PCT"; do
        if [ "$PCT" -gt 50 ] || [ "$PCT" -lt 15 ]; then
            IMBALANCE=1
        fi
    done

    echo ""
    if [ "$IMBALANCE" -eq 1 ]; then
        echo -e "  ${YELLOW}${BOLD}WARN${NC} — Variant distribution is imbalanced (target ~33% each)."
        echo -e "  ${YELLOW}Consider adjusting explicit variant props to spread usage more evenly.${NC}"
    else
        echo -e "  ${GREEN}${BOLD}PASS${NC} — Variant distribution is reasonably balanced (~33% each)."
    fi
else
    echo -e "  ${YELLOW}WARN${NC} — No ContextualCityLinks usages found."
fi

# ════════════════════════════════════════════════════════════════
# Summary
# ════════════════════════════════════════════════════════════════
echo ""
echo -e "${BOLD}${CYAN}═══ Summary ═══${NC}"
if [ "$FAIL" -eq 0 ]; then
    echo -e "${GREEN}${BOLD}All checks PASSED${NC}"
    exit 0
else
    echo -e "${RED}${BOLD}Some checks FAILED${NC}"
    exit 1
fi