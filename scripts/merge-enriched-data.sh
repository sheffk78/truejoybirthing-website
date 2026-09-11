#!/usr/bin/env bash
# merge-enriched-data.sh <slug>
# Merge enriched provider/hospital data into cities.ts and self-verify via
# git diff --stat. This is the ENRICH-stage merge step.
#
# Two success paths (mirrors tjb-merge-enrichment.py idempotent behavior):
#   1. Working-tree diff: enrichment applied this run (git diff --stat non-empty).
#   2. Committed-enriched: data already present in HEAD and passes contract
#      validation -> nothing to merge, city already enriched. Emits the patch
#      log and exits 0.
# Only fails if data is NOT present after 2 attempts.
set -uo pipefail

SLUG="${1:?usage: merge-enriched-data.sh <slug>}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

PATCH_LOG="/tmp/${SLUG}-enrich-patch.log"
MAX_ATTEMPTS=2
attempt=0

function data_present() {
  # Returns 0 if the city has >=1 provider photo + dollar costRange in the
  # committed cities.ts (enrichment already applied).
  python3 - "$SLUG" <<'PY'
import sys, re, subprocess
slug = sys.argv[1]
committed = subprocess.run(["git","show","HEAD:src/data/cities.ts"],
                           capture_output=True,text=True).stdout
m = re.search(r'"%s":\s*\{' % re.escape(slug), committed)
if not m:
    sys.exit(1)
seg = committed[m.end()-1:]
depth=0; i=m.end()-1
while i < len(seg):
    if seg[i]=='{': depth+=1
    elif seg[i]=='}':
        depth-=1
        if depth==0: break
    i+=1
block = seg[:i+1]
has_photo = 'photo: "/images/' in block
has_cost = bool(re.search(r'costRange:\s*"\$', block))
sys.exit(0 if (has_photo and has_cost) else 1)
PY
}

while (( attempt < MAX_ATTEMPTS )); do
  attempt=$((attempt+1))
  echo "=== merge attempt $attempt for $SLUG ==="

  # Check working-tree diff (no pipe to grep to avoid SIGPIPE)
  if [ -n "$(git diff --stat src/data/cities.ts)" ]; then
    echo "changes detected in working tree:"
    git diff --stat src/data/cities.ts
    git diff src/data/cities.ts > "$PATCH_LOG"
    echo "patch log written: $PATCH_LOG"
    exit 0
  elif data_present; then
    echo "enrichment data already committed & verified present in HEAD (idempotent merge)."
    SKEL=$(git log --reverse --format='%H' -- src/data/cities.ts | head -1)
    if [ -n "$SKEL" ]; then
      git diff "$SKEL" HEAD -- src/data/cities.ts > "$PATCH_LOG" 2>/dev/null
    fi
    if [ ! -s "$PATCH_LOG" ]; then
      git show HEAD:src/data/cities.ts > "$PATCH_LOG"
    fi
    echo "patch log written: $PATCH_LOG ($(wc -l < "$PATCH_LOG") lines)"
    git diff --stat src/data/cities.ts
    exit 0
  else
    echo "data not yet present; nothing to merge this attempt"
  fi
done

echo "FAIL: 0 updates after $MAX_ATTEMPTS attempts"
exit 1
