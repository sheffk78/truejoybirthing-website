#!/usr/bin/env bash
# Orphan Page Audit for TJB Website
# Builds the site, scans all HTML for /birth-support/[slug]/ links,
# counts inbound links per city slug, and flags orphans (< 2 inbound links).

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$PROJECT_DIR/dist"

echo "=== Orphan Page Audit ==="
echo ""

# Step 1: Build the site
echo "Building site..."
(cd "$PROJECT_DIR" && npm run build) >/dev/null 2>&1
echo "Build complete."
echo ""

# Step 2: Extract all href="/birth-support/[slug]/" patterns from dist HTML
LINK_DATA=$(grep -rohE 'href="/birth-support/[a-z-]+/' "$DIST_DIR" 2>/dev/null | sort | uniq -c | sort -n)

if [ -z "$LINK_DATA" ]; then
  echo "No /birth-support/ links found in the build output."
  exit 1
fi

# Step 3: Count inbound links per city slug and report orphans
ORPHAN_COUNT=0
OK_COUNT=0
TOTAL=0

printf "%-30s | %-14s | %s\n" "City Slug" "Inbound Links" "Status"
printf "%-30s-+-%-14s-+-%s\n" "$(printf '%0.s-' {1..30})" "$(printf '%0.s-' {1..14})" "------"

while IFS= read -r line; do
  count=$(echo "$line" | awk '{print $1}')
  slug=$(echo "$line" | sed 's|.*href="/birth-support/||;s|/*"||;s|/$||')
  [ -z "$slug" ] && continue

  TOTAL=$((TOTAL + 1))

  if [ "$count" -lt 2 ]; then
    status="ORPHAN"
    ORPHAN_COUNT=$((ORPHAN_COUNT + 1))
  else
    status="OK"
    OK_COUNT=$((OK_COUNT + 1))
  fi
  printf "%-30s | %-14s | %s\n" "$slug" "$count" "$status"
done <<< "$LINK_DATA"

echo ""
echo "=== Summary ==="
echo "Total slugs: $TOTAL"
echo "OK (≥2 inbound links):     $OK_COUNT"
echo "ORPHAN (<2 inbound links): $ORPHAN_COUNT"

if [ "$ORPHAN_COUNT" -gt 0 ]; then
  echo ""
  echo "⚠ Orphan pages detected — these slugs have fewer than 2 inbound internal links."
  exit 1
else
  echo ""
  echo "✓ No orphan pages detected."
  exit 0
fi