#!/bin/bash
# ===============================================================
# TJB pre-deploy toolchain health check (G0) — added 2026-10-20
# ===============================================================
# ROOT CAUSE (2026-10-20 Pomona/Peoria incident): the gates that
# protect the site (check-og-content.py, check-hero-content.py,
# visual-preflight) depend on Python toolchain pieces (numpy, PIL
# full decoder, the right interpreter). Those pieces broke SILENTLY
# — imports errored or half-worked, gates passed or crashed in ways
# that let defects through. A checker that cannot run is worse than
# no checker: it teaches everyone to ignore failures.
#
# FIX: before ANY deploy, prove the checker toolchain itself works —
# decode a known-good real image, import numpy, run tiny slices of
# the real gate scripts. If the checker is broken, the deploy is
# BLOCKED until it's repaired. Producer-of-checks ≠ checker health;
# software verifies software before work is judged.
#
# Run:  bash scripts/pre-deploy-health-check.sh
# Exit: 0 = toolchain healthy; 1 = BROKEN (deploy must stop)
# ---------------------------------------------------------------

set -u
cd "$(dirname "$0")/.."

FAIL=0
fail() { echo "  ❌ $1"; FAIL=1; }
pass() { echo "  ✅ $1"; }

echo ""
echo "--- Step 0/5: Toolchain health check (G0) ---"

# Pick the interpreter exactly like the gates do (same resolution
# order as check-og-content.py / check-hero-content.py shebangs).
PY="$(command -v python3 || true)"
[ -z "$PY" ] && fail "python3 not found on PATH" && exit 1

# --- H1: numpy importable (check-og/check-hero/validator dependency)
if "$PY" -c "import numpy" 2>/dev/null; then
  pass "numpy importable ($PY)"
else
  fail "numpy NOT importable by $PY — OG/hero gates will crash like the 10/20 incident (ModuleNotFoundError)"
fi

# --- H2: numpy actually computes (catches broken wheels/ABI)
if "$PY" -c "import numpy as np; a=np.array([1.0,2.0]); assert abs(a.mean()-1.5)<0.01; print('ok')" >/dev/null 2>&1; then
  pass "numpy computes"
else
  fail "numpy imports but cannot compute (broken wheel/ABI)"
fi

# --- H3: PIL decodes a REAL webp end-to-end (catches the half-installed
#     _imaging state seen live 10/20: `import PIL` passed, `im.load()` didn't)
REAL_IMG="$(ls public/images/og-city-peoria-az.webp \
             public/images/og-city-orange-ca.webp \
             public/images/og-city-tempe-az.webp 2>/dev/null | head -1)"
if [ -z "$REAL_IMG" ]; then
  fail "no known-good OG image found for decode test (public/images/og-city-*.webp missing)"
else
  if "$PY" -c "
from PIL import Image
im = Image.open('$REAL_IMG')
im.load()  # full decode — the op that failed silently on 10/20
assert im.size[0] >= 1000 and im.size[1] >= 600, f'unexpected size {im.size}'
" 2>/tmp/g0-pil.err; then
    pass "PIL fully decodes $REAL_IMG ($(stat -f%z "$REAL_IMG" 2>/dev/null || stat -c%s "$REAL_IMG") bytes)"
  else
    fail "PIL cannot fully decode $REAL_IMG — half-installed _imaging (the exact 10/20 silent-break class)
$(head -2 /tmp/g0-pil.err | sed 's/^/      /')"
  fi
fi

# --- H4: the OG gate script itself runs (slice of real work, real script)
if "$PY" scripts/check-og-content.py peoria-az >/dev/null 2>&1 \
   || "$PY" scripts/check-og-content.py orange-ca >/dev/null 2>&1; then
  pass "check-og-content.py executes on a canonical city"
else
  fail "check-og-content.py cannot run — the deploy's own OG gate is broken"
fi

# --- H5: the hero gate script itself runs
if "$PY" scripts/check-hero-content.py peoria-az >/dev/null 2>&1 \
   || "$PY" scripts/check-hero-content.py orange-ca >/dev/null 2>&1; then
  pass "check-hero-content.py executes on a canonical city"
else
  fail "check-hero-content.py cannot run — the deploy's own hero gate is broken"
fi

# --- H6: render tool exists (OG compose renderer used on every new city)
if [ -f scripts/render-og-1x.cjs ] && node -e "require('playwright')" >/dev/null 2>&1; then
  pass "OG renderer + playwright available"
else
  fail "OG renderer or playwright missing — new-city OG composition would fail mid-build"
fi

echo ""
if [ "$FAIL" -ne 0 ]; then
  echo "❌ G0 BLOCKED: the checking toolchain itself is broken."
  echo "   Deploy stopped BEFORE build — fix the environment first."
  echo "   This gate exists because of the 2026-10-20 incident: broken"
  echo "   checkers passed distorted/partial outputs for hours."
  exit 1
fi
echo "  → G0 PASS: toolchain healthy, gates are real"
exit 0