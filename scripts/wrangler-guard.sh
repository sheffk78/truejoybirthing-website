#!/bin/bash
# =============================================================================
# Wrangler Deploy Guard — prevents direct `wrangler pages deploy` outside deploy.sh
#
# This script intercepts `npx wrangler pages deploy` and redirects to deploy.sh
# unless the TJB_DEPLOY_AUTHORIZED env var is set (which only deploy.sh sets).
#
# Usage:
#   npx wrangler pages deploy ...  → blocked, redirected to deploy.sh
#   TJB_DEPLOY_AUTHORIZED=1 npx wrangler pages deploy ... → passes through
#
# Install:
#   Add to project: alias npx='bash scripts/wrangler-guard.sh'
#   Or source from .zshrc: alias npx='bash /path/to/wrangler-guard.sh'
# =============================================================================

# Check if this is a wrangler pages deploy call
if [[ "$*" == *"wrangler pages deploy"* ]]; then
  if [ -z "${TJB_DEPLOY_AUTHORIZED:-}" ]; then
    echo "❌ DIRECT DEPLOY BLOCKED: Use 'bash scripts/deploy.sh' instead of 'npx wrangler pages deploy'"
    echo "   The wrangler command bypasses all gates (preflight, self-test, commit message check)."
    echo ""
    echo "   Correct:  bash scripts/deploy.sh [slug]"
    echo "   Bypassed: npx wrangler pages deploy dist --project-name=..."
    echo ""
    echo "   To bypass this guard intentionally (not recommended), set:"
    echo "   export TJB_DEPLOY_AUTHORIZED=1"
    exit 1
  fi
fi

# Pass through to real npx
/opt/homebrew/bin/npx "$@"