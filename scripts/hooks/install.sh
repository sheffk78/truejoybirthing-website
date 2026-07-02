#!/bin/bash
# Install the TJB pre-push hook into .git/hooks/
# Run once after cloning or fresh checkout: bash scripts/hooks/install.sh

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
GIT_HOOKS_DIR="$(git rev-parse --git-dir)/hooks"

echo "Installing TJB pre-push hook..."

# Create hooks dir if it doesn't exist
mkdir -p "$GIT_HOOKS_DIR"

# Copy the hook
cp "$HOOK_DIR/pre-push" "$GIT_HOOKS_DIR/pre-push"
chmod +x "$GIT_HOOKS_DIR/pre-push"

echo "✅ Pre-push hook installed to $GIT_HOOKS_DIR/pre-push"
echo "   The hook blocks direct git push to main without a fresh preflight pass."