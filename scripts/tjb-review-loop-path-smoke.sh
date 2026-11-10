#!/usr/bin/env bash
# tjb-review-loop-path-smoke.sh — 2026-11-10 review-loop PATH repair verification.
#
# Complements ~/.hermes/scripts/tjb-review-loop-smoke.sh (JOB-20261110-CITYFIX,
# wired into tjb-city-completion-monitor.py as review-preflight): that script
# proves release BEHAVIOR (sandboxed dry-run review). THIS script proves the
# PATH contract cheap + strictly read-only, for cron preflight use:
#   1. the real engine exists (project copy, source of truth),
#   2. the engine path the two callers exec exists (the delegation wrapper),
#   3. the wrapper executes a READ-ONLY engine command (status) — exit 0.
# Safe by construction: zero writes — `status` only reads a live state file.
#
# Usage: bash tjb-review-loop-path-smoke.sh     # exit 0 = pass
set -u

WRAPPER="$HOME/.hermes/skills/productivity/tjb-city-orchestrator/scripts/tjb-pipeline-state.py"
REAL="$HOME/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website/scripts/tjb-pipeline-state.py"
STATES_DIR="${TJB_STATES_DIR:-$HOME/.hermes/skills/productivity/tjb-city-orchestrator/states}"

fail() { echo "PATH-SMOKE: FAIL — $*"; exit 1; }

# 1. Real engine (source of truth) exists.
[ -f "$REAL" ] || fail "real engine missing: $REAL"

# 2. The exact engine path BOTH callers exec (wrapper) exists.
#    tjb-review-task-feed.py line 114 and tjb-city-completion-monitor.py
#    PIPELINE_STATE_SCRIPT both point here; when this file vanished 2026-11-05
#    the review loop died silently. Its presence is the repair contract.
[ -f "$WRAPPER" ] || fail "caller-invoked engine path missing: $WRAPPER (review releases would die silently)"

# 3. Executable + read-only execution through the wrapper path.
#    Pick the first live state slug for a real status probe; if the states dir
#    is empty, probe a sentinel slug (cmd_status exits 0 with an error JSON —
#    engine reachable, still zero writes).
FIRST_JSON="$(find "$STATES_DIR" -maxdepth 1 -name '*.json' 2>/dev/null | sort | head -1)"
if [ -n "$FIRST_JSON" ]; then
  SLUG="$(basename "$FIRST_JSON" .json)"
  MODE="live-state"
else
  SLUG="smoke-path-probe-nonexistent"
  MODE="no-state-fallback"
fi
OUT="$(python3 "$WRAPPER" status "$SLUG" 2>&1)"
RC=$?
[ "$RC" -eq 0 ] || fail "engine status via wrapper exited $RC: $OUT"
if [ "$MODE" = "live-state" ]; then
  echo "$OUT" | grep -q '"slug"' || fail "status output lacks slug JSON: $OUT"
else
  echo "$OUT" | grep -q 'error' || fail "fallback probe did not return engine JSON: $OUT"
fi

echo "PATH-SMOKE: PASS — engine path resolves ($MODE: $SLUG), read-only status exit 0 via $WRAPPER"
