#!/bin/bash
# =============================================================================
# TJB Unified Asset Generator — Single Entry Point for All Visual Assets
#
# Usage: bash scripts/tjb-generate-asset.sh <asset-type> <slug> [city-name state]
#
# Asset types:
#   og          — OG/social preview image (1200×630, Playwright HTML→screenshot)
#   hero        — Hero image (1200×800, Playwright HTML→screenshot)
#   support     — Support scene image (Playwright HTML→screenshot)
#   thumbnail   — YouTube thumbnail (1280×720, render-yt-thumbnail.cjs)
#
# This script:
#   1. Routes to the correct generation pipeline
#   2. Verifies the output (file exists, correct dimensions, valid image)
#   3. Exits 0 on success, 1 on failure
#
# The agent NEVER calls image_generate, node render-og.cjs, or PIL directly.
# Every visual asset routes through this script.
#
# NOTE: The sentinel-based pre-work gate (tjb-visual-work-gate.sh) was
# deprecated June 2026. Quality is now enforced by artifact-based gates
# in preflight.ts (G8: hero silhouette, G9: support scene, P11: dimensions).
# Run `npx tsx scripts/preflight.ts <slug>` after generating assets.
# =============================================================================

set -euo pipefail

ASSET_TYPE="${1:?Usage: bash scripts/tjb-generate-asset.sh <asset-type> <slug>}"
SLUG="${2:?Usage: bash scripts/tjb-generate-asset.sh <asset-type> <slug>}"
CITY_NAME="${3:-}"
STATE_ABBR="${4:-}"
PROJECT_DIR="/Users/socializerender/Projects/truejoybirthing-website"
SCRIPT_DIR="$PROJECT_DIR/scripts"
OUTPUT_DIR="$PROJECT_DIR/public/images"

echo ""
echo "======================================"
echo "  TJB Generate Asset"
echo "  Type: $ASSET_TYPE"
echo "  Slug: $SLUG"
echo "======================================"
echo ""

cd "$PROJECT_DIR"

# Helper: verify image dimensions using Python + PIL
verify_image() {
  local file="$1"
  local exp_w="$2"
  local exp_h="$3"
  local label="$4"

  if [ ! -f "$file" ]; then
    echo "  ❌ [$label] File not found: $file"
    return 1
  fi

  local size
  size=$(stat -f%z "$file" 2>/dev/null || stat --format=%s "$file" 2>/dev/null)
  echo "  ✅ [$label] File size: ${size} bytes"

  # Only check dimensions if PIL is available
  if python3 -c "from PIL import Image" 2>/dev/null; then
    local dims
    dims=$(python3 -c "
import sys
from PIL import Image
try:
    img = Image.open('$file')
    print(f'{img.size[0]} {img.size[1]}')
except Exception as e:
    print(f'ERROR: {e}')
    sys.exit(1)
" 2>/dev/null) || dims=""

    if [ -n "$dims" ]; then
      local w="${dims%% *}"
      local h="${dims##* }"
      if [ "${w:-0}" = "$exp_w" ] && [ "${h:-0}" = "$exp_h" ]; then
        echo "  ✅ [$label] Dimensions: ${w}×${h} (matches expected ${exp_w}×${exp_h})"
      else
        echo "  ⚠️  [$label] Dimensions: ${w}×${h} (expected ${exp_w}×${exp_h})"
      fi
    fi
  fi
}

case "$ASSET_TYPE" in
  og)
    # OG image: use city-specific composition or canonical template
    COMP_FILE="$SCRIPT_DIR/og-city-$SLUG-composition.html"
    if [ ! -f "$COMP_FILE" ]; then
      echo "  ⚠️  No city-specific composition (og-city-$SLUG-composition.html)"
      echo "     Falling back to canonical template."
      if [ -f "$SCRIPT_DIR/render-city-og-template.html" ]; then
        COMP_FILE="$SCRIPT_DIR/render-city-og-template.html"
      else
        echo "  ❌ No OG template found at scripts/render-city-og-template.html"
        echo "     Create a composition file first from an existing pattern."
        exit 1
      fi
    fi

    COMP_RELATIVE="$(basename "$COMP_FILE")"
    node "$SCRIPT_DIR/render-og.cjs" "$COMP_RELATIVE" "og-city-$SLUG"
    echo "  ✅ OG image rendered"

    verify_image "$OUTPUT_DIR/og-city-$SLUG.webp" 1200 630 "OG"
    ;;

  hero)
    COMP_FILE="$SCRIPT_DIR/hero-city-$SLUG-composition.html"
    if [ ! -f "$COMP_FILE" ]; then
      echo "  ❌ No hero composition at: hero-city-$SLUG-composition.html"
      echo "     Create a composition HTML file first."
      exit 1
    fi

    COMP_RELATIVE="$(basename "$COMP_FILE")"
    node "$SCRIPT_DIR/render-hero.cjs" "$COMP_RELATIVE" "hero-city-$SLUG"
    echo "  ✅ Hero image rendered"

    verify_image "$OUTPUT_DIR/hero-city-$SLUG.webp" 1200 800 "Hero"
    ;;

  support)
    COMP_FILE="$SCRIPT_DIR/support-city-$SLUG-composition.html"
    if [ ! -f "$COMP_FILE" ]; then
      echo "  ❌ No support composition at: support-city-$SLUG-composition.html"
      echo "     The support scene must be city-specific, not the generic doula-walking.webp"
      echo "     Create a composition HTML file first."
      exit 1
    fi

    COMP_RELATIVE="$(basename "$COMP_FILE")"
    node "$SCRIPT_DIR/render-hero.cjs" "$COMP_RELATIVE" "support-city-$SLUG"
    echo "  ✅ Support scene rendered"

    verify_image "$OUTPUT_DIR/support-city-$SLUG.webp" 1200 800 "Support"
    ;;

  thumbnail)
    if [ -z "$CITY_NAME" ] || [ -z "$STATE_ABBR" ]; then
      echo "  ❌ Thumbnail generation requires city name and state abbreviation."
      echo "     Usage: bash scripts/tjb-generate-asset.sh thumbnail <slug> \"<City>\" <ST>"
      echo "     Example: bash scripts/tjb-generate-asset.sh thumbnail conroe-tx \"Conroe\" TX"
      exit 1
    fi

    node "$SCRIPT_DIR/render-yt-thumbnail.cjs" "$SLUG" "$CITY_NAME" "$STATE_ABBR"
    echo "  ✅ Thumbnail rendered"

    if [ -f "$OUTPUT_DIR/yt-thumb-$SLUG.png" ]; then
      verify_image "$OUTPUT_DIR/yt-thumb-$SLUG.png" 1280 720 "YT Thumb (PNG)"
    elif [ -f "$OUTPUT_DIR/yt-thumb-$SLUG.webp" ]; then
      verify_image "$OUTPUT_DIR/yt-thumb-$SLUG.webp" 1280 720 "YT Thumb (WebP)"
    else
      echo "  ❌ Thumbnail output file not found at yt-thumb-$SLUG.png or .webp"
      exit 1
    fi
    ;;

  *)
    echo "❌ Unknown asset type: $ASSET_TYPE"
    echo "   Valid types: og, hero, support, thumbnail"
    exit 1
    ;;
esac

echo ""
echo "✅ Done: $ASSET_TYPE for $SLUG"
echo "======================================"