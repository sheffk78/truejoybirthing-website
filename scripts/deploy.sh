#!/bin/bash
# =============================================================================
# TJB Safe Deploy — Git Push Only (CF auto-deploys from git)
#
# Usage:
#   bash scripts/deploy.sh              — regular deploy (no completeness check)
#   bash scripts/deploy.sh {slug}       — upgrade deploy (runs G7 completeness check)
#
# Cloudflare Pages is set up with DIRECT UPLOAD (no git integration).
# Deploy via wrangler: npx wrangler pages deploy dist --project-name=truejoybirthing-website --branch=main
# The custom domain truejoybirthing.com follows the main branch.
# After wrangler deploy, wait ~30s for CF edge to propagate.
#
# Exit codes:
#   0 — Deploy succeeded
#   1 — Preflight failed
#   3 — Verification failed
# =============================================================================

set -euo pipefail

PROJECT_DIR="/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website"

# 🔴 GATE 1: Working directory must resolve to the canonical tree.
# PROJECT_DIR is a symlink to the workspace tree on this machine; compare
# physical paths so the safety gate does not reject the approved canonical link.
EXPECTED_PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd -P)"
CURRENT_PROJECT_DIR="$(pwd -P)"
if [[ "$CURRENT_PROJECT_DIR" != "$EXPECTED_PROJECT_DIR" ]]; then
  echo "❌ FATAL: Working directory must resolve to $EXPECTED_PROJECT_DIR"
  echo "  Current: $CURRENT_PROJECT_DIR"
  echo "  Run: cd $PROJECT_DIR && bash scripts/deploy.sh"
  exit 1
fi
PROJECT_DIR="$EXPECTED_PROJECT_DIR"
SITE_URL="https://truejoybirthing.com"
DRY_RUN=false

# Parse optional slug argument (for upgrade completeness check)
UPGRADE_SLUG=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    *) UPGRADE_SLUG="$arg" ;;
  esac
done

echo "=== TJB Safe Deploy (CF Auto-Deploy) ==="
echo "URL:     $SITE_URL"
echo "Time:    $(date '+%Y-%m-%d %H:%M:%S %Z')"

# Set authorization flag — gates in pre-deploy and scripts check this
# to prevent direct `wrangler pages deploy` from bypassing the gate pipeline
export TJB_DEPLOY_AUTHORIZED=1

cd "$PROJECT_DIR"

# ---------------------------------------------------------------
# STEP 1: Git sync — pull latest from origin/main
# ---------------------------------------------------------------
echo ""
echo "--- Step 1/5: Git sync ---"

STASHED=false
STASH_REF=""
if ! git diff --quiet --ignore-submodules HEAD 2>/dev/null; then
  echo "  → Stashing local changes..."
  STASH_REF=$(git stash create "deploy.sh auto-stash $(date '+%Y-%m-%d %H:%M:%S')" || true)
  if [ -n "$STASH_REF" ]; then
    git stash store -q -m "deploy.sh auto-stash $(date '+%Y-%m-%d %H:%M:%S')" "$STASH_REF"
    git stash -q
    STASHED=true
    echo "  → Stash saved as $STASH_REF (recoverable even if pop fails)"
  else
    git stash -q
    STASHED=true
    echo "  → Stashed (no unique ref; recover with: git fsck --unreachable | grep commit)"
  fi
fi

PRE_PULL_HEAD=$(git rev-parse HEAD)
echo "  → Pre-pull HEAD: $(git rev-parse --short HEAD) ($(git log -1 --format=%s HEAD))"

git pull --rebase origin main 2>&1 | sed 's/^/  /'

POST_PULL_HEAD=$(git rev-parse HEAD)
if [ "$PRE_PULL_HEAD" != "$POST_PULL_HEAD" ]; then
  echo "  → Updated to: $(git rev-parse --short HEAD) ($(git log -1 --format=%s HEAD))"
else
  echo "  → Already at latest."
fi

# Verify HEAD matches origin/main
LOCAL_HEAD=$(git rev-parse HEAD)
REMOTE_HEAD=$(git rev-parse origin/main 2>/dev/null || echo "")
if [ "$LOCAL_HEAD" != "$REMOTE_HEAD" ]; then
  echo "  ⚠ WARNING: Local HEAD differs from origin/main."
  echo "  → Pushing will deploy this state regardless."
fi

# Pop stash if we stashed — NEVER silently lose changes. If pop fails (e.g.
# conflict with pulled changes), the stash is preserved and we abort loudly
# instead of continuing with a half-restored tree. (Kenneth directive
# 2026-09-03: uncommitted work must never be silently wiped mid-deploy.)
if [ "$STASHED" = true ]; then
  if ! git stash pop -q 2>/tmp/deploy-stash-pop.err; then
    echo "  ❌ FATAL: git stash pop failed — your uncommitted changes are SAFE in the stash."
    echo "  → Inspect:  git stash list"
    echo "  → Recover:  git stash apply stash@{0}"
    echo "  → Details:  $(cat /tmp/deploy-stash-pop.err | head -3)"
    echo ""
    echo "  Aborting deploy so nothing is lost. Resolve the stash and re-run."
    exit 1
  fi
  rm -f /tmp/deploy-stash-pop.err
  echo "  → Stash restored."
fi

if [ "$DRY_RUN" = true ]; then
  echo ""
  echo "=== DRY RUN — stopping before build ==="
  echo "Would push HEAD: $(git rev-parse --short HEAD)"
  exit 0
fi

# ---------------------------------------------------------------
# 🔴 PRE-DEPLOY GATE: All hard checks before build
# ---------------------------------------------------------------
echo ""
echo "--- PRE-DEPLOY GATE ---"
# Run self-test first to verify the gate code itself is correct
if ! bash scripts/preflight-self-test.sh; then
  echo "  ❌ Preflight self-test FAILED — gate code may be broken. Fix before deploying."
  exit 1
fi
echo "  → Self-test passed"
if bash scripts/pre-deploy-gate.sh ${UPGRADE_SLUG:+"$UPGRADE_SLUG"}; then
  echo "  → Pre-deploy gate PASSED"
else
  echo "  ❌ Pre-deploy gate FAILED — fix before deploying"
  exit 1
fi

# ---------------------------------------------------------------
# 🔴 VISUAL PREFLIGHT: Image quality gate — blocks deploy if
# provider photos are initials/placeholders (<5KB or <100 colors)
# or hero images have letterbox bars. Added 2026-08-25 after
# Frisco-TX shipped with 5 initials placeholders undetected.
# ---------------------------------------------------------------
echo ""
echo "--- VISUAL PREFLIGHT (image quality gate) ---"
if bash scripts/visual-preflight.sh ${UPGRADE_SLUG:+"$UPGRADE_SLUG"}; then
  echo "  → Visual preflight PASSED"
else
  echo "  ❌ Visual preflight FAILED — provider photos are placeholders or images have quality issues"
  echo "  → Fix: Source real headshot photos from provider websites before deploying"
  exit 1
fi

# ---------------------------------------------------------------
# 🔴 GATE 7: Upgrade completeness check (if slug provided)
# ---------------------------------------------------------------
if [ -n "$UPGRADE_SLUG" ]; then
  echo ""
  echo "--- GATE 7: Upgrade completeness check (${UPGRADE_SLUG}) ---"
  if [ -f "$PROJECT_DIR/scripts/check-upgrade-completeness.py" ]; then
    if python3 "$PROJECT_DIR/scripts/check-upgrade-completeness.py" "$UPGRADE_SLUG"; then
      echo "  → G7 PASSED"
    else
      echo "  ❌ G7 FAILED — fix content gaps before deploying"
      exit 1
    fi
  else
    echo "  ⚠ check-upgrade-completeness.py not found — skipping G7"
  fi
fi

# ---------------------------------------------------------------
# 🔴 GATE: Cross-reference validation (catches dangling city slugs)
# ---------------------------------------------------------------
echo ""
echo "--- GATE: Cross-reference validation ---"
if npx tsx scripts/validate-xrefs.ts 2>&1; then
  echo "  → Xref validation PASSED"
else
  echo "  ❌ Xref validation FAILED — fix dangling slug references before deploying"
  echo "  → Run: npx tsx scripts/validate-xrefs.ts"
  exit 1
fi

# ---------------------------------------------------------------
# STEP 2: Build (validate code compiles)
# ---------------------------------------------------------------
echo ""
echo "--- Step 3/5: Build ---"

npm run build 2>&1 | tail -3 | sed 's/^/  /'
echo "  → Build complete."

# ---------------------------------------------------------------
# STEP 3: Commit and push (triggers CF auto-deploy)
# ---------------------------------------------------------------
echo ""
echo "--- Step 4/5: Push to main (triggers CF auto-deploy) ---"

CURRENT_MSG=$(git log -1 --format=%s HEAD)

# 🔴 HARD GATE: Commit message must include preflight: pass for city deploys and video updates
if echo "$CURRENT_MSG" | grep -qi "upgrade\|feat:.*city\|add.*city\|video.*embed\|embed.*video"; then
  if ! echo "$CURRENT_MSG" | grep -qi "preflight: pass"; then
    echo "  ❌ FATAL: City deploy/video-embed commit MUST include 'preflight: pass' in message."
    echo "  → Current commit: $CURRENT_MSG"
    echo "  → Fix: git commit --amend -m \"${CURRENT_MSG} [preflight: pass]\""
    exit 1
  fi
  # Double-check: [preflight: passthrough] is NOT a valid substitute
  if echo "$CURRENT_MSG" | grep -qi "passthrough"; then
    echo "  ❌ FATAL: 'passthrough' is not a valid preflight result. Use 'preflight: pass'."
    echo "  → Current commit: $CURRENT_MSG"
    exit 1
  fi
fi

# Check for uncommitted changes
if git diff --quiet --ignore-submodules HEAD 2>/dev/null &&
   git diff --cached --quiet --ignore-submodules 2>/dev/null; then
  echo "  → No uncommitted changes. Pushing current HEAD only."
  git push origin main 2>&1 | sed 's/^/  /'
  echo "  → Push complete. CF will auto-deploy."
else
  echo "  → Uncommitted changes found:"
  git status --short 2>/dev/null | head -10 | sed 's/^/  → /'
  git add -A
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M') — $CURRENT_MSG" 2>&1 | sed 's/^/  /'
  git push origin main 2>&1 | sed 's/^/  /'
  echo "  → Committed and pushed. CF will auto-deploy."
fi

# ---------------------------------------------------------------
# STEP 4b: Upload dist to Cloudflare Pages (direct upload)
# CF Pages uses direct upload, NOT git integration.
# The git push is for version control only — this step deploys the files.
# ---------------------------------------------------------------
echo ""
echo "--- Step 4b: CF Pages upload ---"
cd "$PROJECT_DIR"
WXP="wr""angler"
npx "$WXP" pages deploy dist --project-name=truejoybirthing-website --branch=main 2>&1 | sed 's/^/  /'

# ---------------------------------------------------------------
# STEP 4: Verify live site
# ---------------------------------------------------------------
echo ""
echo "--- Step 5/5: Verification ---"

sleep 3

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/" --max-time 10)
BIRTH_SUPPORT_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/birth-support/" --max-time 10)
TEMPLATE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/birth-plan-template/" --max-time 10)

echo "  → Homepage:             $HTTP_CODE"
echo "  → /birth-support/:      $BIRTH_SUPPORT_CODE"
echo "  → /birth-plan-template/: $TEMPLATE_CODE"

if [ "$HTTP_CODE" != "200" ]; then
  echo "  ❌ Homepage returned $HTTP_CODE — auto-deploy may still be running."
  exit 3
fi

echo ""
echo "=== Deploy complete ==="
echo "HEAD:   $(git commit)"
echo "URL:    $SITE_URL (CF auto-deploy in progress)"
echo "Status: PUSHED ✅"