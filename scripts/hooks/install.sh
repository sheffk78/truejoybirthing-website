#!/bin/bash
# Install TJB git hooks (pre-commit + pre-push) into .git/hooks/
# Run once after cloning or fresh checkout: bash scripts/hooks/install.sh

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
GIT_HOOKS_DIR="$(git rev-parse --git-dir)/hooks"

echo "Installing TJB git hooks..."

# Create hooks dir if it doesn't exist
mkdir -p "$GIT_HOOKS_DIR"

# ── Pre-commit hook (city gate enforcement) ────────────────────────────────────
# Merge the city gate logic into the existing pre-commit hook.
# The existing .git/hooks/pre-commit has wrangler + merge-conflict checks.
# We append the city gate block to it (idempotent — checks for marker first).

CITY_GATE_MARKER="# TJB CITY GATE — pre-commit-city-gate.sh"
PRE_COMMIT="$GIT_HOOKS_DIR/pre-commit"

if [[ ! -f "$PRE_COMMIT" ]]; then
    echo '#!/bin/bash' > "$PRE_COMMIT"
    echo '' >> "$PRE_COMMIT"
fi

if ! grep -q "$CITY_GATE_MARKER" "$PRE_COMMIT" 2>/dev/null; then
    cat "$HOOK_DIR/pre-commit" >> "$PRE_COMMIT"
    echo "✅ Pre-commit city gate appended to $PRE_COMMIT"
else
    echo "✅ Pre-commit city gate already installed"
fi
chmod +x "$PRE_COMMIT"

# ── Pre-push hook ──────────────────────────────────────────────────────────────
cp "$HOOK_DIR/pre-push" "$GIT_HOOKS_DIR/pre-push"
chmod +x "$GIT_HOOKS_DIR/pre-push"
echo "✅ Pre-push hook installed to $GIT_HOOKS_DIR/pre-push"

echo ""
echo "Active hooks:"
echo "  pre-commit: blocks commits with ungated city changes + wrangler direct-deploy"
echo "  pre-push:   blocks direct push to main without fresh preflight pass"