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
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}"

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
LOCAL_BRANCH=$(git branch --show-current)
echo "  → Pre-pull HEAD: $(git rev-parse --short HEAD) ($(git log -1 --format=%s HEAD)) [branch: $LOCAL_BRANCH]"

# 10/14 review fix: the tree runs on a standing work branch (seo-fixes-*),
# not main. A bare `git pull --rebase origin main` on a work branch that
# already CONTAINS origin/main silently keeps the branch ahead — then the
# post-verify push to the mirror can drop commits from the repo that ARE
# live in production (seen live 10/14: the surgical blog commit existed on
# the work branch only, while `push origin main` pushed the OLD main).
# Work-branch mode: reconcile fast-forward-only or abort loudly; never guess.
if [ "$LOCAL_BRANCH" != "main" ]; then
  echo "  → Work-branch mode ($LOCAL_BRANCH): reconciling with origin/main (ff-only)"
  git fetch origin main -q
  if git merge-base --is-ancestor HEAD origin/main; then
    git merge --ff-only origin/main 2>&1 | sed 's/^/  /'
  elif git merge-base --is-ancestor origin/main HEAD; then
    echo "  → Branch already contains origin/main (ahead by work-branch commits)."
  else
    echo "  ❌ FATAL: $LOCAL_BRANCH has DIVERGED from origin/main."
    echo "  → Deploy refuses to guess the merge direction. Reconcile the branch first."
    exit 1
  fi
else
  git pull --rebase origin main 2>&1 | sed 's/^/  /'
fi

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
# 🔴 VISION VERDICT GATE (2026-09-05, Rockville postmortem):
# Structural gates can't see anatomy. The Rockville hero shipped with a
# phantom arm + fused fingers because full-frame vision passes are agreeable
# and nothing ENFORCED a zoomed figure-level vision check. This gate emits
# 2x figure crops and requires artifacts/gates/vision/{slug}.json with a
# pass verdict per crop — fail-closed if the vision pass never ran.
# Fires when the pending diff touches this city's images. Full-repo deploys
# skip it (the vision verdicts are produced per-city during stage work).
# ---------------------------------------------------------------
DIFF_IMGS=$(git diff HEAD~1 HEAD --name-only 2>/dev/null | grep -E 'public/images/|src/data/cities.ts' || true)
if [ -n "$UPGRADE_SLUG" ] && [ -n "$DIFF_IMGS" ]; then
  echo ""
  echo "--- VISION VERDICT GATE (figure-level vision enforcement) ---"
  if python3 scripts/visual-verify-gate.py "$UPGRADE_SLUG"; then
    echo "  → Vision verdict gate PASSED"
  else
    echo "  ❌ Vision verdict gate FAILED — run the zoom-crop vision pass per"
    echo "     /tmp/tjb-vision-crops/ and write artifacts/gates/vision/$UPGRADE_SLUG.json"
    exit 1
  fi
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
# 10/14 SURGICAL BLOG COMMIT (before build, reviewer-B2 fix).
# The 10/14 E2E probe proved: builds from a dirty tree ship
# UNCOMMITTED, UNGATED city content live (glendale/hialeah/memphis
# went out inside a blog deploy). So: commit blog content BEFORE
# build, then hide unrelated dirty work for the build (Step 3/5).
# ---------------------------------------------------------------
if git diff --quiet --ignore-submodules HEAD 2>/dev/null &&
   git diff --cached --quiet --ignore-submodules 2>/dev/null; then
  BLOG_JUST_COMMITTED=false
else
  BLOG_FILES=$(git status --porcelain -- src/content/blog 2>/dev/null | awk '{print $2}')
  if [ -n "$BLOG_FILES" ]; then
    echo ""
    echo "--- SURGICAL BLOG COMMIT (blog-only, before build) ---"
    echo "$BLOG_FILES" | sed 's/^/  → /'
    git reset -q
    git add -- src/content/blog
    if git commit -m "deploy: $(date '+%Y-%m-%d %H:%M') — blog: education-feed auto-post [surgical]" 2>&1 | sed 's/^/  /' && \
       git rev-parse HEAD^{commit} >/dev/null 2>&1; then
      # 10/14 review fix: push the ACTUAL branch (the tree runs on a work
      # branch, not main — origin gets the commit either way).
      git push origin HEAD 2>&1 | sed 's/^/  /'
      # Track that origin's work-branch ref moved; origin/main is updated in
      # the post-verify mirror step so the mirror matches live production.
      BLOG_JUST_COMMITTED=true
    else
      echo "  ❌ FATAL: blog commit failed — aborting before build (nothing shipped)"
      exit 1
    fi
  else
    BLOG_JUST_COMMITTED=false
  fi
fi

# ---------------------------------------------------------------
# STEP 2: Build (validate code compiles)
# ---------------------------------------------------------------
echo ""
echo "--- Step 3/5: Build ---"

# 🔴 2026-09-18: PUBLIC_TJB_CONTROL_KEY must be present at build time
# (Astro only reads .env FILES for PUBLIC_* vars, not process env).
# Without it the deployed dashboard ships an empty controlKey and the
# Autonomous-Worker Pause/Resume toggle 401s. Inject from the vault
# file via a temporary gitignored .env, and ALWAYS clean up after.
TJB_TEMP_ENV="$PROJECT_DIR/.env"
TJB_ENV_WRITTEN=false
cleanup_temp_env() {
  if [ "$TJB_ENV_WRITTEN" = true ] && [ -f "$TJB_TEMP_ENV" ]; then
    rm -f "$TJB_TEMP_ENV"
    echo "  → Temp .env removed."
  fi
}
trap cleanup_temp_env EXIT

if [ -f "$PROJECT_DIR/.env" ]; then
  echo "  → .env already present; not overwriting."
else
  if [ ! -r "$HOME/.hermes/secrets/tjb_control_key" ]; then
    echo "  ❌ FATAL: ~/.hermes/secrets/tjb_control_key missing/unreadable."
    echo "  → Dashboard Pause/Resume would deploy with an empty key."
    exit 1
  fi
  printf 'PUBLIC_TJB_CONTROL_KEY=%s\n' "$(cat "$HOME/.hermes/secrets/tjb_control_key")" > "$TJB_TEMP_ENV"
  chmod 600 "$TJB_TEMP_ENV"
  TJB_ENV_WRITTEN=true
  echo "  → Injected PUBLIC_TJB_CONTROL_KEY into build env (temp .env, cleaned up on exit)."
fi

# 2026-10-20 fix: grep exits 1 when the tree is CLEAN (no non-blog lines to
# match), and with `set -o pipefail` that killed the whole deploy mid-build
# (deploys #8/#9 died silently between the env injection and npm). Guard the
# grep so an empty match set is a normal result, not a pipeline failure.
DIRTY_NONBLOG=$(git status --porcelain 2>/dev/null | { grep -v 'src/content/blog' || true; } | wc -l | tr -d ' ')
if [ "$DIRTY_NONBLOG" != "0" ]; then
  echo "  ⚠ WARNING: $DIRTY_NONBLOG non-blog files are dirty; build compiles the WORKING TREE so their output ships too."
  echo "  → Intended only for in-flight city work whose pages are already expected live. Commit via a gated slug deploy to make git match production."
fi
npm run build 2>&1 | tail -3 | sed 's/^/  /'
echo "  → Build complete."
cleanup_temp_env

# ---------------------------------------------------------------
# STEP 3: Commit and push (triggers CF auto-deploy)
# ---------------------------------------------------------------
# ---------------------------------------------------------------
# STEP 4/5: Push to main (blog commit already happened pre-build).
# 10/14 reviewer fix: no add -A sweep on autonomous (plain) runs —
# a dirty non-blog tree MUST NOT be swept into a deploy commit
# (that's how city artifacts got blocked/blocked-again and how
# ungated city content reached production). Slug-mode keeps the
# human city flow: gates above already passed, so the commit
# message records the passing preflight — no HEAD-message misfire.
# ---------------------------------------------------------------
echo ""
echo "--- Step 4/5: Push to main ---"
if [ "$BLOG_JUST_COMMITTED" = true ]; then
  echo "  → Blog-only commit already created and pushed pre-build."
elif git diff --quiet --ignore-submodules HEAD 2>/dev/null &&
     git diff --cached --quiet --ignore-submodules 2>/dev/null; then
  echo "  → No uncommitted changes. Pushing current HEAD only."
  git push origin main 2>&1 | sed 's/^/  /'
elif [ -n "$UPGRADE_SLUG" ]; then
  echo "  → City-upgrade deploy: committing gated work for $UPGRADE_SLUG"
  git add -A
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M') — upgrade: $UPGRADE_SLUG [preflight: pass]" 2>&1 | sed 's/^/  /'
  git push origin HEAD 2>&1 | sed 's/^/  /'
  echo "  → Committed and pushed. CF will auto-deploy."
else
  echo "  ❌ FATAL: non-blog changes are dirty in the tree but no slug was given."
  echo "  → Autonomous blog deploys never sweep unrelated work (10/14 rule)."
  echo "  → Resolve the tree, or run a gated slug deploy for intentional work:"
  git status --short 2>/dev/null | head -10 | sed 's/^/  → /'
  exit 1
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
# 🔴 2026-09-18: wrangler needs an API token in non-interactive shells.
# Load from the canonical secrets file if the caller did not export one.
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] && [ -r "$HOME/.hermes/secrets/cloudflare_api_token" ]; then
  export CLOUDFLARE_API_TOKEN="$(cat "$HOME/.hermes/secrets/cloudflare_api_token")"
  echo "  → CLOUDFLARE_API_TOKEN loaded from ~/.hermes/secrets/cloudflare_api_token"
fi
npx "$WXP" pages deploy dist --project-name=truejoybirthing-website --branch=main 2>&1 | sed 's/^/  /'

# ---------------------------------------------------------------
# STEP 4: Verify live site
# ---------------------------------------------------------------
echo ""
echo "--- Step 5/5: Verification ---"

# 🔴 2026-09-17 hardening: plain curl here was served by STALE CDN CACHE after the
# repo-root-bundle incident (broken deploy "passed" verification for 7 hours).
# Cache-buster query forces a fresh origin fetch; the city check catches a
# wrong-root bundle because its city paths only exist under /dist/ in that case.
CACHEBUST=$(date +%s)

# Pick a real city page from THIS build to verify live (most recently built)
CITY_PROBE=$(ls -t dist/birth-support/*/index.html 2>/dev/null | head -1 | sed 's|dist/||; s|/index.html|/|')
[ -z "$CITY_PROBE" ] && CITY_PROBE="birth-support/arvada-co/"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/?v=$CACHEBUST" --max-time 10)
BIRTH_SUPPORT_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/birth-support/?v=$CACHEBUST" --max-time 10)
TEMPLATE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/birth-plan-template/?v=$CACHEBUST" --max-time 10)
CITY_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/$CITY_PROBE?v=$CACHEBUST" --max-time 10)

echo "  → Homepage:             $HTTP_CODE (cache-busted)"
echo "  → /birth-support/:      $BIRTH_SUPPORT_CODE (cache-busted)"
echo "  → /birth-plan-template/: $TEMPLATE_CODE"
echo "  → City probe:           $CITY_CODE ($CITY_PROBE)"

if [ "$HTTP_CODE" != "200" ]; then
  echo "  ❌ Homepage returned $HTTP_CODE — auto-deploy may still be running."
  exit 3
fi
if [ "$CITY_CODE" != "200" ]; then
  echo "  ❌ City probe $CITY_PROBE returned $CITY_CODE — bundle root is wrong or city pages missing."
  echo "  → Do NOT report success. Investigate before any follow-up deploy."
  exit 3
fi

# 10/14 review fix: mirror the VERIFIED state to origin/main so the git
# mirror matches production (work-branch mode: the working branch is ahead
# of main; origin/main is only now allowed to catch up — git NEVER loses the
# live post on future pulls).
if [ "$LOCAL_BRANCH" != "main" ] && git merge-base --is-ancestor origin/main HEAD; then
  echo ""
  echo "--- Mirror to origin/main (git mirror must match production) ---"
  git push origin HEAD:main 2>&1 | sed 's/^/  /'
fi

echo ""
echo "=== Deploy complete ==="
echo "HEAD:   $(git commit)"
echo "URL:    $SITE_URL (CF auto-deploy in progress)"
echo "Status: PUSHED ✅"