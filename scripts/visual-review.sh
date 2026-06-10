#!/bin/bash
# TJB Morning Visual Review — runs at 8 AM MT
# Checks overnight build pages that were flagged "needs visual review"
# and reports pass/fail to Discord.
#
# The queue file at ~/.hermes/cron/tjb-visual-review-queue.json stores
# entries appended by overnight build crons.

QUEUE_FILE="$HOME/.hermes/cron/tjb-visual-review-queue.json"
LOG_FILE="$HOME/.hermes/cron/tjb-visual-review-log.json"

# Ensure queue file exists
if [ ! -f "$QUEUE_FILE" ]; then
  echo "[]" > "$QUEUE_FILE"
fi

QUEUE=$(cat "$QUEUE_FILE")
ENTRY_COUNT=$(echo "$QUEUE" | python3 -c "import json,sys; q=json.load(sys.stdin); print(len(q))" 2>/dev/null || echo "0")

if [ "$ENTRY_COUNT" -eq "0" ]; then
  echo "No pages flagged for visual review. Nothing to check."
  exit 0
fi

echo "Checking $ENTRY_COUNT page(s) from overnight builds..."
echo ""

RESULTS="[]"
ALL_PASS=true

for row in $(echo "$QUEUE" | python3 -c "
import json, sys
q = json.load(sys.stdin)
for i, entry in enumerate(q):
    print(f'{i}|{entry[\"slug\"]}')
" 2>/dev/null); do
  IFS='|' read -r idx slug <<< "$row"

  PAGE_URL="https://truejoybirthing.com/birth-support/$slug/"
  OG_URL="https://truejoybirthing.com/images/og-city-$slug.webp"

  PAGE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PAGE_URL" --max-time 10)
  OG_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$OG_URL" --max-time 10)

  PASS=true
  NOTES=""
  
  if [ "$PAGE_CODE" != "200" ]; then
    PASS=false
    NOTES="$NOTES page=$PAGE_CODE"
    ALL_PASS=false
  fi
  
  if [ "$OG_CODE" != "200" ]; then
    PASS=false
    NOTES="$NOTES OG=$OG_CODE"
    ALL_PASS=false
  fi

  if [ "$PASS" = true ]; then
    echo "  ✅ $slug — page=200 OG=200"
  else
    echo "  ❌ $slug —$NOTES"
  fi
done

# Clear the queue after processing
echo "[]" > "$QUEUE_FILE"

if [ "$ALL_PASS" = true ]; then
  echo ""
  echo "✅ All $ENTRY_COUNT overnight pages pass basic checks"
else
  echo ""
  echo "⚠️ Some pages have issues (see above)"
fi

echo ""
echo "--- Review complete ---"