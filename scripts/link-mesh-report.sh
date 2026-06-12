#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# A3 Measurement Baseline Report: Link Mesh Analysis
# Counts pillar→city, blog→city, and city→pillar links across
# the True Joy Birthing website's internal link graph.
# ═══════════════════════════════════════════════════════════════

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC_DIR="$PROJECT_DIR/src"
REPORTS_DIR="$PROJECT_DIR/scripts/reports"
DATE=$(date +%Y-%m-%d)
REPORT_FILE="$REPORTS_DIR/link-mesh-baseline-${DATE}.txt"

mkdir -p "$REPORTS_DIR"

# ═══════════════════════════════════════════════════════════════
# 0. BUILD THE SITE
# ═══════════════════════════════════════════════════════════════

echo "Building site..."
echo ""

cd "$PROJECT_DIR"
if npm run build > /dev/null 2>&1; then
  BUILD_STATUS="OK"
else
  BUILD_STATUS="FAILED"
fi
cd "$SCRIPT_DIR"

generate_report() {
  echo "========================================================================"
  echo "  A3 LINK MESH BASELINE REPORT"
  echo "  Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "  Build status: $BUILD_STATUS"
  echo "========================================================================"
  echo ""

  # ═══════════════════════════════════════════════════════════════
  # 1. PILLAR → CITY LINKS (ContextualCityLinks component)
  # ═══════════════════════════════════════════════════════════════

  echo "1. PILLAR → CITY LINKS (ContextualCityLinks)"
  echo "========================================================================"
  echo ""

  CITY_LINKS_FILE="$SRC_DIR/data/city-links.ts"
  if [ -f "$CITY_LINKS_FILE" ]; then
    echo "   Topic mapping (cities per topic):"
    echo ""

    awk '
    /^  [a-zA-Z0-9"_-]+: \[/ {
      if (topic != "") {
        printf "     %-20s %d cities\n", topic, count
        total += count
      }
      topic = $0
      sub(/^  */, "", topic)
      gsub(/"/, "", topic)
      sub(/:.*$/, "", topic)
      count = 0
      next
    }
    /slug:/ && !/string/ { count++ }
    /^};/ {
      if (topic != "") {
        printf "     %-20s %d cities\n", topic, count
        total += count
      }
      printf "\n   Total pillar->city link entries in data: %d\n", total
      topic = ""
      count = 0
      total = 0
      exit
    }
    ' "$CITY_LINKS_FILE"

    echo ""

    echo "   Pages using ContextualCityLinks:"
    echo ""

    total_pillar_pages=0
    while IFS= read -r page; do
      [ -z "$page" ] && continue
      relpath="${page#$PROJECT_DIR/}"
      topics=$(grep -o 'topic="[^"]*"' "$page" 2>/dev/null | sed 's/topic="//;s/"//' | sort -u)
      for topic in $topics; do
        count=$(awk -v t="$topic" '
          $0 ~ ("^[[:space:]]+\"?" t "\"?:") { found=1 }
          found && /slug:/ { c++ }
          found && /\]/ { print c; found=0; c=0 }
        ' "$CITY_LINKS_FILE" 2>/dev/null)
        [ -z "$count" ] && count="?"
        printf "     %-50s  topic=%-15s  cities=%s\n" "$relpath" "$topic" "$count"
      done
      total_pillar_pages=$((total_pillar_pages + 1))
    done < <(grep -rl "ContextualCityLinks" "$SRC_DIR/pages" --include="*.astro" 2>/dev/null | sort)

    echo ""
    echo "   Default topic fallback: 'general' (from ContextualCityLinks.astro)"
    echo "   Variants available: grid-2col, stacked, card-3col"
    echo ""
    echo "   Summary: $total_pillar_pages pillar pages use ContextualCityLinks"

    unique_topics=$(grep -roh 'topic="[^"]*"' "$SRC_DIR/pages" --include="*.astro" 2>/dev/null | sort -u | wc -l | tr -d ' ')
    echo "   Unique topic values used across pages: $unique_topics"
  else
    echo "   ERROR: city-links.ts not found"
  fi

  echo ""

  # ═══════════════════════════════════════════════════════════════
  # 2. BLOG → CITY LINKS
  # ═══════════════════════════════════════════════════════════════

  echo "2. BLOG → CITY LINKS"
  echo "========================================================================"
  echo ""

  blog_dir="$SRC_DIR/content/blog"
  if [ -d "$blog_dir" ]; then
    total_blog_city_links=0
    blog_pages_with_links=0
    total_blog_posts=0

    echo "   Blog posts linking to /birth-support/:"
    echo ""

    for blog_file in "$blog_dir"/*.md; do
      [ -f "$blog_file" ] || continue
      total_blog_posts=$((total_blog_posts + 1))
      link_count=$(grep -o 'href="/birth-support/[^"]*"' "$blog_file" 2>/dev/null | wc -l | tr -d ' ')
      if [ "$link_count" -gt 0 ]; then
        printf "     %-50s  %d link(s)\n" "$(basename "$blog_file")" "$link_count"
        total_blog_city_links=$((total_blog_city_links + link_count))
        blog_pages_with_links=$((blog_pages_with_links + 1))
      fi
    done

    echo ""
    echo "   Blog posts with city links: $blog_pages_with_links / $total_blog_posts total"
    echo "   Total blog→city links: $total_blog_city_links"

    echo ""
    echo "   Unique city/state slugs linked from blog posts:"
    grep -roh 'href="/birth-support/[^"]*"' "$blog_dir" 2>/dev/null \
      | sed 's|href="/birth-support/||;s|"$||;s|/"$||' \
      | sort -u \
      | while read -r slug; do
          printf "     %s\n" "$slug"
        done
  else
    echo "   No blog content directory found."
  fi

  echo ""

  # ═══════════════════════════════════════════════════════════════
  # 3. CITY → PILLAR LINK VARIATION
  # ═══════════════════════════════════════════════════════════════

  echo "3. CITY → PILLAR LINK VARIATION"
  echo "========================================================================"
  echo ""

  city_template="$SRC_DIR/pages/birth-support/[city].astro"
  if [ -f "$city_template" ]; then
    echo "   Template: src/pages/birth-support/[city].astro"
    echo ""

    echo "   Hardcoded pillar links in city template (excluding /birth-support/):"
    echo ""
    grep -o 'href="/[a-z0-9-]*/"' "$city_template" 2>/dev/null \
      | grep -v '/birth-support/' \
      | sort \
      | uniq -c \
      | sort -rn \
      | while read -r count href; do
          printf "     %-50s  x%s\n" "$href" "$count"
        done

    echo ""
    echo "   Unique pillar pages linked from city template:"
    grep -o 'href="/[a-z0-9-]*/"' "$city_template" 2>/dev/null \
      | sed 's/href="//;s/"$//' \
      | grep -v '/birth-support/' \
      | sort -u \
      | while read -r path; do
          printf "     %s\n" "$path"
        done

    echo ""
    echo "   Dynamic cross-links in city template:"
    echo "     - nearbyCities: rendered per-city from data (nearbyCities field)"
    echo "     - State hub link: /birth-support/{state}/ (dynamic per city)"
    echo "     - Related Resources section: 9 pillar page cards (conditional)"

    # State template
    state_template="$SRC_DIR/pages/birth-support/[state].astro"
    if [ -f "$state_template" ]; then
      echo ""
      echo "   ── State template: src/pages/birth-support/[state].astro ──"
      echo ""
      echo "   Hardcoded pillar links in state template:"
      echo ""
      grep -o 'href="/[a-z0-9-]*/"' "$state_template" 2>/dev/null \
        | grep -v '/birth-support/' \
        | sort \
        | uniq -c \
        | sort -rn \
        | while read -r count href; do
            printf "     %-50s  x%s\n" "$href" "$count"
          done

      echo ""
      echo "   Unique pillar pages linked from state template:"
      grep -o 'href="/[a-z0-9-]*/"' "$state_template" 2>/dev/null \
        | sed 's/href="//;s/"$//' \
        | grep -v '/birth-support/' \
        | sort -u \
        | while read -r path; do
            printf "     %s\n" "$path"
          done
    fi

    # Index page
    index_template="$SRC_DIR/pages/birth-support/index.astro"
    if [ -f "$index_template" ]; then
      echo ""
      echo "   ── Index template: src/pages/birth-support/index.astro ──"
      echo ""
      echo "   Hardcoded pillar links in index template:"
      echo ""
      grep -o 'href="/[a-z0-9-]*/"' "$index_template" 2>/dev/null \
        | grep -v '/birth-support/' \
        | sort \
        | uniq -c \
        | sort -rn \
        | while read -r count href; do
            printf "     %-50s  x%s\n" "$href" "$count"
          done

      echo ""
      echo "   Unique pillar pages linked from index template:"
      grep -o 'href="/[a-z0-9-]*/"' "$index_template" 2>/dev/null \
        | sed 's/href="//;s/"$//' \
        | grep -v '/birth-support/' \
        | sort -u \
        | while read -r path; do
            printf "     %s\n" "$path"
          done
    fi
  else
    echo "   City template not found."
  fi

  echo ""

  # ═══════════════════════════════════════════════════════════════
  # 4. LINK MESH SUMMARY
  # ═══════════════════════════════════════════════════════════════

  echo "4. LINK MESH SUMMARY"
  echo "========================================================================"
  echo ""

  total_cities=$(grep -c 'slug:' "$SRC_DIR/data/cities.ts" 2>/dev/null || echo "?")
  total_topics=$(grep -cE '^\s+"?[a-zA-Z0-9_-]+"?:\s*\[' "$CITY_LINKS_FILE" 2>/dev/null || echo "?")

  echo "   Total city pages (from cities.ts):         $total_cities"
  echo "   Total topics in city-links.ts:              $total_topics"
  echo "   Pillar pages using ContextualCityLinks:     $total_pillar_pages"
  echo "   Blog posts with city links:                 $blog_pages_with_links / $total_blog_posts"
  echo "   Total blog→city links:                      $total_blog_city_links"
  echo ""
  echo "   ── Link direction analysis ──"
  echo ""
  echo "   Pillar → City:  Each pillar page links to N cities via ContextualCityLinks"
  echo "   City → Pillar:  Each city page links to ~9 pillar pages (hardcoded)"
  echo "   City → City:    Each city page links to nearby cities (dynamic)"
  echo "   City → State:   Each city page links to state hub (dynamic)"
  echo "   Blog → City:    Blog posts link to specific city pages"
  echo "   Blog → Pillar:  Blog posts also link to pillar pages (not counted here)"
  echo ""
  echo "========================================================================"
  echo "  END OF REPORT"
  echo "========================================================================"
}

generate_report > "$REPORT_FILE" 2>&1

echo "Report saved to: $REPORT_FILE"
echo ""
echo "--- Preview ---"
cat "$REPORT_FILE"