#!/bin/bash
# =============================================================================
# TJB Unified Asset Generator — Single Entry Point for All Visual Assets
#
# Usage: bash scripts/tjb-generate-asset.sh <asset-type> <slug> [city-name state]
#
# Asset types:
#   og          — OG/social preview image (1200×630, canonical Pattern B)
#   hero        — Hero image (image_generate only; this script refuses rendering)
#   support     — Support scene (image_generate only; this script refuses rendering)
#   thumbnail   — YouTube thumbnail (template renderer)
#
# Every OG must have a city-specific composition derived from
# render-city-og-template.html. Falling back to the placeholder template is a
# hard failure: render-og.cjs is intentionally dumb and does not fill variables.
# =============================================================================
set -euo pipefail

ASSET_TYPE="${1:?Usage: bash scripts/tjb-generate-asset.sh <asset-type> <slug>}"
SLUG="${2:?Usage: bash scripts/tjb-generate-asset.sh <asset-type> <slug>}"
CITY_NAME="${3:-}"
STATE_ABBR="${4:-}"
PROJECT_DIR="/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website"
SCRIPT_DIR="$PROJECT_DIR/scripts"
OUTPUT_DIR="$PROJECT_DIR/public/images"

cd "$PROJECT_DIR"

verify_image() {
  local file="$1"; local exp_w="$2"; local exp_h="$3"; local label="$4"
  [ -f "$file" ] || { echo "❌ [$label] File not found: $file"; return 1; }
  python3 - "$file" "$exp_w" "$exp_h" "$label" <<'PY'
import sys
from PIL import Image
path, ew, eh, label = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
im = Image.open(path)
if im.size != (ew, eh): raise SystemExit(f'❌ [{label}] Dimensions {im.size}, expected {(ew,eh)}')
colors = im.convert('RGB').getcolors(1_000_000)
unique = len(colors) if colors else 1_000_001
if label == 'OG' and unique < 5000: raise SystemExit(f'❌ [OG] Only {unique} colors; likely placeholder/gradient')
print(f'✅ [{label}] {im.size[0]}×{im.size[1]}, {unique} unique colors, {path}')
PY
}

case "$ASSET_TYPE" in
  og)
    TEMPLATE="$SCRIPT_DIR/render-city-og-template.html"
    COMP_FILE="$SCRIPT_DIR/og-city-$SLUG-composition.html"
    if [ ! -f "$COMP_FILE" ]; then
      echo "❌ Missing required city-specific OG composition: $COMP_FILE"
      echo "   Copy $TEMPLATE, fill every placeholder, and rerun."
      exit 1
    fi
    if grep -qE '\{\{[A-Z_]+\}\}' "$COMP_FILE"; then
      echo "❌ Unfilled OG placeholder in $COMP_FILE"; exit 1
    fi
    for required in '.left-column::before' '.left-column::after' '.right-column::before' '.right-column::after' '.eyebrow' '.headline' '.summary' '.subhead' '.logo-area' '.right-column img'; do
      grep -q "$required" "$COMP_FILE" || { echo "❌ OG composition missing required template element: $required"; exit 1; }
    done
    node "$SCRIPT_DIR/render-og.cjs" "$(basename "$COMP_FILE")" "og-city-$SLUG"
    verify_image "$OUTPUT_DIR/og-city-$SLUG.webp" 1200 630 OG
    ;;
  hero)
    echo "❌ Hero images require image_generate; HTML rendering is forbidden."; exit 1 ;;
  support)
    echo "❌ Support scenes require image_generate; HTML rendering is forbidden."; exit 1 ;;
  thumbnail)
    [ -n "$CITY_NAME" ] && [ -n "$STATE_ABBR" ] || { echo "❌ Thumbnail requires city and state"; exit 1; }
    node "$SCRIPT_DIR/render-yt-thumbnail.cjs" "$SLUG" "$CITY_NAME" "$STATE_ABBR"
    if [ -f "$OUTPUT_DIR/yt-thumb-$SLUG.png" ]; then verify_image "$OUTPUT_DIR/yt-thumb-$SLUG.png" 1280 720 'YT Thumb'; else verify_image "$OUTPUT_DIR/yt-thumb-$SLUG.webp" 1280 720 'YT Thumb'; fi
    ;;
  *) echo "❌ Unknown asset type: $ASSET_TYPE"; exit 1 ;;
esac
