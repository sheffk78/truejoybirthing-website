#!/bin/bash
# =============================================================================
# TJB Pre-Commit Hook — Blocks wrangler direct-deploy commands
# =============================================================================

# Check for wrangler pages deploy in staged changes
if git diff --cached -G 'wrangler pages deploy' -- '*.sh' '*.md' '*.json' 2>/dev/null | grep -q 'wrangler pages deploy'; then
  echo "❌ BLOCKED: Commit contains 'wrangler pages deploy' reference."
  echo "   Use 'bash scripts/deploy.sh' instead — the wrangler command bypasses all gates."
  echo ""
  echo "   If this is a documentation reference, add a warning alongside it."
  exit 1
fi

# Check for merge conflict markers
if git diff --cached src/data/cities.ts src/data/video-embeds.ts 2>/dev/null | grep -q '<<<<<<<'; then
  echo "❌ BLOCKED: Merge conflict markers found in staged data files."
  echo "   Run: git checkout HEAD -- src/data/cities.ts src/data/video-embeds.ts"
  exit 1
fi
