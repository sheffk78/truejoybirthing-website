#!/bin/bash
# =============================================================================
# TJB Pre-Deploy Gate — Hard enforcement, not suggestions
#
# Run BEFORE every deploy. Exits non-zero if ANY gate fails — deploy.sh
# calls this automatically before building.
#
# Usage:
#   bash scripts/pre-deploy-gate.sh              — full audit (all cities)
#   bash scripts/pre-deploy-gate.sh {slug}       — targeted check
#
# Exit codes:
#   0 — All gates passed
#   1 — One or more gates failed
# =============================================================================
set -euo pipefail

PROJECT_DIR="/Users/socializerender/Projects/truejoybirthing-website"
SLUG="${1:-}"
FAILED=0

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "═══════════════════════════════════════════"
echo "  TJB PRE-DEPLOY GATE"
echo "  Target: ${SLUG:-ALL CITIES (full audit)}"
echo "  Time:   $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "═══════════════════════════════════════════"

gate_pass()   { echo -e "  ${GREEN}✅${NC} $1"; }
gate_fail()   { echo -e "  ${RED}❌${NC} $1"; FAILED=1; }
gate_header() { echo ""; echo "─── $1 ───"; }

# ── G1: Working directory ──────────────────────────────────────
gate_header "G1: Working Directory"
if [[ "$PWD" == "$PROJECT_DIR" ]]; then
  gate_pass "Working directory: $PWD"
else
  gate_fail "Must be $PROJECT_DIR, got $PWD"
fi

# ── G2: Preflight script ───────────────────────────────────────
gate_header "G2: Preflight"
if [ -n "$SLUG" ]; then
  if npx tsx scripts/preflight.ts "$SLUG" 2>&1 | sed 's/^/  /'; then
    gate_pass "preflight.ts exit 0 for $SLUG"
  else
    gate_fail "preflight.ts failed for $SLUG — fix issues, re-run gate"
  fi
else
  if npx tsx scripts/preflight.ts 2>&1 | sed 's/^/  /'; then
    gate_pass "preflight.ts exit 0 (full audit)"
  else
    gate_fail "preflight.ts failed — fix issues, re-run gate"
  fi
fi

# ── G3: Validate city data ────────────────────────────────────
gate_header "G3: Data Validation"
if npx tsx scripts/validate-city-data.ts 2>&1 | tail -5 | sed 's/^/  /'; then
  gate_pass "validate-city-data.ts exit 0"
else
  gate_fail "Data validation failed"
fi

# ── G4: OG image check ───────────────────────────────────────
gate_header "G4: OG Images"

if [ -n "$SLUG" ]; then
  SLUGS=("$SLUG")
else
  # Extract all slugs from cities.ts
  SLUGS=($(grep -oP '(?<="slug": ")[^"]+' "$PROJECT_DIR/src/data/cities.ts"))
fi

for s in "${SLUGS[@]}"; do
  # Check all variants: canonical, -v2, -v3, etc.
  # -v2+ variants are INTENTIONAL CDN cache-busting suffixes
  found=false
  for variant in "" "-v2" "-v3" "-v4"; do
    file="public/images/og-city-${s}${variant}.webp"
    full="${PROJECT_DIR}/${file}"
    if [ -f "$full" ]; then
      found=true
      size=$(stat -f%z "$full" 2>/dev/null || stat -c%s "$full")
      if [ "$size" -lt 10000 ]; then
        gate_fail "OG image too small (${size}B): $file (min 10KB)"
      else
        # Verify decodable
        if python3 -c "from PIL import Image; Image.open('$full').verify()" 2>/dev/null; then
          gate_pass "OG image OK: $file (${size}B)"
        else
          gate_fail "OG image CORRUPTED (decode error): $file"
        fi
      fi
      break
    fi
  done
  if [ "$found" = false ]; then
    gate_fail "OG image MISSING for $s (no variant found)"
  fi
done

# ── G5: Commit message gate — hard block ────────────────────
gate_header "G5: Commit Message"
CURRENT_MSG=$(git log -1 --format=%s HEAD 2>/dev/null || echo "")

if echo "$CURRENT_MSG" | grep -qi "upgrade\|feat:.*city\|add.*city" && \
   ! echo "$CURRENT_MSG" | grep -qi "preflight"; then
  gate_fail "City deploy commit MUST include 'preflight: pass' in message."
  echo "  → Current commit: $CURRENT_MSG"
  echo "  → Fix: git commit --amend -m \"${CURRENT_MSG} [preflight: pass]\""
fi

# ── Summary ──────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
if [ "$FAILED" -eq 0 ]; then
  echo -e "  ${GREEN}ALL GATES PASSED${NC} — ready to deploy"
  echo "═══════════════════════════════════════════"
  exit 0
else
  echo -e "  ${RED}SOME GATES FAILED — fix before deploying${NC}"
  echo "═══════════════════════════════════════════"
  exit 1
fi