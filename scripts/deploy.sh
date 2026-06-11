#!/bin/bash
# =============================================================================
# TJB Safe Deploy — Git Push Only (CF auto-deploys from git)
#
# Usage:
#   bash scripts/deploy.sh              — regular deploy (no completeness check)
#   bash scripts/deploy.sh {slug}       — upgrade deploy (runs G7 completeness check)
#
# Cloudflare Pages auto-deploys from git pushes to main. This script:
#   1. Syncs local repo with origin/main (git pull --rebase)
#   2. Verifies HEAD matches origin/main
#   3. Runs pre-deploy gate (G1-G5: working dir, preflight, data validation, OG, commit msg)
#   4. [Optional] Runs G7 upgrade completeness check if slug provided
#   5. Builds locally to validate
#   6. Pushes to main — CF auto-deploys
#   7. Verifies live site returns 200
#
# NO wrangler calls needed — CF auto-deploy handles the rest.
#
# Exit codes:
#   0 — Deploy succeeded
#   1 — Preflight failed
#   3 — Verification failed
# =============================================================================

set -euo pipefail

PROJECT_DIR="/Users/socializerender/Projects/truejoybirthing-website"

# 🔴 GATE 1: Working directory must be canonical tree
if [[ "$PWD" != "$PROJECT_DIR" ]]; then
  echo "❌ FATAL: Working directory must be $PROJECT_DIR"
  echo "  Current: $PWD"
  echo "  The alternate tree at ~/.openclaw/... was deleted and symlinked on June 10."
  echo "  Run: cd $PROJECT_DIR && bash scripts/deploy.sh"
  exit 1
fi
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

cd "$PROJECT_DIR"

# ---------------------------------------------------------------
# STEP 1: Git sync — pull latest from origin/main
# ---------------------------------------------------------------
echo ""
echo "--- Step 1/5: Git sync ---"

STASHED=false
if ! git diff --quiet --ignore-submodules HEAD 2>/dev/null; then
  echo "  → Stashing local changes..."
  git stash -q
  STASHED=true
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

# Pop stash if we stashed
if [ "$STASHED" = true ]; then
  git stash pop -q 2>/dev/null || true
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
if bash scripts/pre-deploy-gate.sh ${UPGRADE_SLUG:+"$UPGRADE_SLUG"}; then
  echo "  → Pre-deploy gate PASSED"
else
  echo "  ❌ Pre-deploy gate FAILED — fix before deploying"
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

# 🔴 HARD GATE: Commit message must include preflight: pass for city deploys
if echo "$CURRENT_MSG" | grep -qi "upgrade\|feat:.*city\|add.*city" && \
   ! echo "$CURRENT_MSG" | grep -qi "preflight"; then
  echo "  ❌ FATAL: City deploy commit MUST include 'preflight: pass' in message."
  echo "  → Current commit: $CURRENT_MSG"
  echo "  → Fix: git commit --amend -m \"${CURRENT_MSG} [preflight: pass]\""
  exit 1
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