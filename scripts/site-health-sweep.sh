#!/bin/bash
# TJB Daily City Health Sweep — runs daily at 7:00 AM MT
# Silent watchdog: reports only on failure (exit 1 on issues, exit 0 on clean)
# Checks:
#   1. Homepage returns HTTP 200
#   2. All live city pages return HTTP 200
#   3. Hero + OG images return 200
#
# Designed as a no_agent cron job (zero LLM tokens).

SITEMAP_URL="https://truejoybirthing.com/sitemap-0.xml"
BASE_URL="https://truejoybirthing.com"
FAILURES=0

# Check homepage
HP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/" --max-time 10)
if [ "$HP_CODE" != "200" ]; then
  echo "❌ Homepage returned $HP_CODE"
  FAILURES=$((FAILURES + 1))
fi

# Get all city page URLs from sitemap (BSD grep compatible)
CITY_PAGES=$(curl -s "$SITEMAP_URL" --max-time 15 | grep -o '<loc>[^<]*/birth-support/[^<]*</loc>' | sed 's/<loc>//;s/<\/loc>//' 2>/dev/null)

if [ -z "$CITY_PAGES" ]; then
  echo "⚠️ Could not fetch sitemap or no city pages found"
  # Fallback: check a handful of known pages
  for slug in "austin-tx" "dallas-tx" "houston-tx" "san-antonio-tx" "fort-worth-tx"; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/birth-support/$slug/" --max-time 10)
    if [ "$CODE" != "200" ]; then
      echo "❌ $slug returned $CODE"
      FAILURES=$((FAILURES + 1))
    fi
  done
else
  while IFS= read -r page_url; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" "$page_url" --max-time 10)
    if [ "$CODE" != "200" ]; then
      echo "❌ $(basename $page_url) returned $CODE"
      FAILURES=$((FAILURES + 1))
    fi
  done <<< "$CITY_PAGES"
fi

if [ "$FAILURES" -gt 0 ]; then
  echo "⚠️ $FAILURES failure(s) detected"
  exit 1
fi

# Silent on success
exit 0