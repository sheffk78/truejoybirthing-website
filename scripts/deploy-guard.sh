#!/bin/bash
# =============================================================================
# TJB Deploy Guard — Prevents direct wrangler deploys without preflight
#
# This script wraps `npx wrangler pages deploy` to enforce that:
# 1. The pre-deploy gate (preflight.ts) has been run and passed
# 2. TJB_DEPLOY_AUTHORIZED is set (only deploy.sh sets this)
#
# Install by adding to package.json:
#   "scripts": {
#     "deploy": "bash scripts/deploy-guard.sh"
#   }
#
# Or symlink into PATH so `wrangler` calls go through it:
#   ln -s scripts/deploy-guard.sh /usr/local/bin/wrangler
#
# Exit codes:
#   0 — Authorized, proceeding with deploy
#   1 — Unauthorized deploy attempt blocked
# =============================================================================

if [ -z "${TJB_DEPLOY_AUTHORIZED:-}" ]; then
  echo "❌ BLOCKED: Direct wrangler deploy without preflight gate."
  echo ""
  echo "  TJB_DEPLOY_AUTHORIZED is not set. This means the pre-deploy"
  echo "  gate (preflight.ts) was NOT run before this deploy attempt."
  echo ""
  echo "  To deploy properly:"
  echo "    bash scripts/deploy.sh            # full deploy with all gates"
  echo "    bash scripts/deploy.sh {slug}     # targeted deploy with upgrade check"
  echo ""
  echo "  Do NOT run 'npx wrangler pages deploy' directly."
  echo "  If you need to bypass this guard for an emergency,"
  echo "  set TJB_DEPLOY_AUTHORIZED=1 explicitly AND log the reason."
  exit 1
fi

# Authorized — pass through to wrangler
exec npx wrangler "$@"