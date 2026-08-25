#!/usr/bin/env python3
"""
TJB Pipeline State Machine v2 — Forward-only 4-stage advancement.

4-Stage Model:
  Stage 1: BUILD → Gate 1 → Stage 2: ENRICH → Gate 2 → Stage 3: VERIFY+DEPLOY → Gate 3 → Stage 4: VIDEO+OUTREACH → Gate 4

Key change from v1: determine_stage() runs ONLY at init time. After that,
advancement is strictly forward: next_stage = STAGE_ORDER[current_index + 1].
No re-probing, no bounce-back.

Usage:
    python3 tjb-pipeline-state.py init {slug}          # Create/reset state, probe city for initial stage
    python3 tjb-pipeline-state.py next {slug}          # Output next stage + subagent context
    python3 tjb-pipeline-state.py done {slug} {stage}  # Mark stage complete, advance forward (no gate check)
    python3 tjb-pipeline-state.py advance {slug} {stage}  # Run per-stage gate, advance only if passes (preferred)
    python3 tjb-pipeline-state.py fail {slug} {stage} {reason}  # Mark stage failed
    python3 tjb-pipeline-state.py status {slug}        # Show current state
    python3 tjb-pipeline-state.py unblock {slug}       # Clear blocked status, allow retry
    python3 tjb-pipeline-state.py gates {slug} {stage} {gate_results_json}  # Record gate results for a stage

State file: ~/.hermes/skills/productivity/tjb-city-orchestrator/states/{slug}.json
"""

import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

STATES_DIR = Path(os.environ.get("TJB_STATES_DIR", "/Users/socializerender/.hermes/skills/productivity/tjb-city-orchestrator/states"))
PROBE_SCRIPT = Path(os.environ.get("TJB_PROBE_SCRIPT", "/Users/socializerender/.hermes/skills/productivity/tjb-city-orchestrator/scripts/probe-city-candidates.py"))
# One canonical project root; both legacy locations currently resolve to the same tree.
PROJECT_DIR = os.environ.get("TJB_PROJECT_DIR", "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website")
RECURRING_MISTAKES_PATH = Path(os.environ.get("TJB_RECURRING_MISTAKES", "/Users/socializerender/.hermes/skills/productivity/tjb-city-orchestrator/references/recurring-mistakes-block.md"))
BUILD_CHECKPOINT_DIR = Path(os.environ.get("TJB_BUILD_CHECKPOINT_DIR", str(Path(PROJECT_DIR) / "artifacts" / "build-checkpoints")))

# ─── 4-Stage Model ───
STAGE_ORDER = [
    "build",
    "enrich",
    "verify_deploy",
    "video_outreach",
    "complete"
]

# Map old 9-stage names to new 4-stage names for backward compat
# Includes all granular probe sub-stages from probe-city-candidates.py
OLD_TO_NEW_STAGE = {
    "needs_research": "build",
    "needs_enrichment": "enrich",
    "needs_images": "build",        # images are part of build stage now
    "needs_preflight": "verify_deploy",
    "needs_deploy": "verify_deploy",
    "needs_outreach": "video_outreach",
    "needs_video": "video_outreach",
    "needs_embed": "video_outreach",
    # Granular probe sub-stages (all map to enrich)
    "needs_verification": "enrich",
    "needs_services": "enrich",
    "needs_cost_data": "enrich",
    "needs_photos": "enrich",
    "needs_service_areas": "enrich",
    "needs_deal_breakers": "enrich",
}

# Per-stage attempt limits (before blocking)
STAGE_ATTEMPT_LIMITS = {
    "build": 3,
    "enrich": 5,      # enrichment is complex, allow more attempts
    "verify_deploy": 3,
    "video_outreach": 3,
}

# Stage-specific subagent context
STAGE_CONTEXTS = {
    "build": {
        "skill": "tjb-city-pipeline",
        "goal_template": (
            "BUILD stage for {slug}: checkpoint-first execution. Write a concrete research/data checkpoint under artifacts/build-checkpoints/{slug}/ within the first 10 tool calls before extended research. Research providers, hospitals, and birth centers. "
            "Write data into cities.ts using Python heredoc via terminal (NEVER use write_file or patch on cities.ts). "
            "Generate hero image (pregnant silhouette + city landscape, ONE image reused across hero/YT/OG). "
            "Generate support scene photo (pregnant mom + professional, ONE pregnant woman, never distorted). "
            "Generate OG image (derived from same hero image). "
            "Find at least the minimum provider count for the city's population tier. "
            "Verify data accuracy. Run: npx tsx scripts/validate-city-data.ts {slug} and npm run build to verify."
        ),
        "toolsets": ["terminal", "file", "web", "browser", "image_gen", "vision"],
        "gates": ["G3", "G5", "G13", "G4", "G37", "hospital_count", "visual_check"],
    },
    "enrich": {
        "skill": "tjb-provider-enrichment",
        "goal_template": (
            "ENRICH stage for {slug}: Bulk pre-warm provider photos from DoulaMatch and Bornbir city-level pages. "
            "Per-provider photo sourcing: headshot from website, then logo, then initials. "
            "Replace all 'Contact for pricing' with real dollar ranges from costLow/costHigh. "
            "Mark as market-estimate if not from provider's website. "
            "Generate 300+ char hospital descriptions answering mom's questions (NICU level, bed count, doula/visitor policy, baby-friendly, lactation, language services, birthing rooms). "
            "Source hospital/birth center exterior photos (real buildings, not logos, not silhouettes, not AI). "
            "Verify birth centers exist and operate in target city. "
            "Run merge script with self-verification (confirm changes applied via git diff). "
            "At least 1 real provider headshot required (all initials = didn't try)."
        ),
        "toolsets": ["terminal", "file", "web", "browser", "vision"],
        "gates": ["G14", "G15", "G15b", "G35", "S8", "G9", "G57", "hospital_desc_length", "cost_format", "birth_center_fields", "S7", "min_1_headshot"],
    },
    "verify_deploy": {
        "skill": "tjb-city-pipeline",
        "goal_template": (
            "VERIFY + DEPLOY stage for {slug}: Run FULL preflight (all G gates, V1, A3-A12, S5-S7, P8-P15). "
            "Fix any remaining gate failures. Build via npm run build. "
            "Deploy via bash scripts/deploy.sh {slug} (never raw wrangler). "
            "CDN cache bust: verify CDN-served files match repo files. "
            "Three-way visual verification: (1) curl -sI for HTTP 200 + content-length > 10KB, "
            "(2) browser_console new Image() constructor confirms browser-side decode, "
            "(3) vision_analyze for hero, support scene, provider photos, hospital thumbnails, no placeholders."
        ),
        "toolsets": ["terminal", "file", "browser", "vision"],
        "gates": ["full_preflight"],
    },
    "video_outreach": {
        "skill": "tjb-city-video-pipeline",
        "goal_template": (
            "VIDEO + OUTREACH stage for {slug}: Create video scene data (full state names, not abbreviations). "
            "Generate TTS audio (Shelbi/Voxtral voice, consistent across scenes). "
            "Pre-render gate: bash scripts/pre-render-gate.sh {slug}. "
            "Capture stills for visual verification. Render video. "
            "Upload to YouTube as NEW video (public, embeddable=True). "
            "Generate and upload YouTube thumbnail (derived from hero image). "
            "Update video-embeds.ts with new video ID. Rebuild and redeploy with embed. "
            "Set old video to unlisted if replacing. "
            "Draft and send provider outreach emails (personalized, from shelbi@truejoybirthing.com, 15s delays). "
            "Re-outreach: re-engage non-responders, name what changed on the page."
        ),
        "toolsets": ["terminal", "file", "vision", "browser", "web"],
        "gates": ["pre_render_gate", "video_file_exists", "youtube_upload", "youtube_thumbnail", "video_embedded", "videoobject_schema", "outreach_sent_or_blocked"],
    },
}


def ensure_states_dir():
    STATES_DIR.mkdir(parents=True, exist_ok=True)


def validate_slug(slug: str) -> bool:
    """Reject non-standard slugs like 'city1-tx', 'city2-co' etc."""
    # Standard slug: lowercase words separated by hyphens, ending with 2-letter state code
    # e.g., dallas-tx, san-jose-ca, salt-lake-city-ut
    # Reject: city1-tx, city2-co (test data with numeric prefix)
    if re.match(r'^city\d+-', slug):
        return False
    # Must be lowercase letters with hyphens, ending in 2-letter state
    if not re.match(r'^[a-z]+(?:-[a-z]+)*-[a-z]{2}$', slug):
        return False
    return True


def load_state(slug: str) -> dict:
    state_file = STATES_DIR / f"{slug}.json"
    if state_file.exists():
        return json.loads(state_file.read_text())
    return {}


def save_state(slug: str, state: dict):
    ensure_states_dir()
    state_file = STATES_DIR / f"{slug}.json"
    tmp_file = STATES_DIR / f"{slug}.json.tmp"
    tmp_file.write_text(json.dumps(state, indent=2))
    os.replace(str(tmp_file), str(state_file))
    # Keep the visual dashboard automatic. Any state transition exports the
    # consolidated city ledger to public/city-audit.json; failures are silent
    # here so pipeline commands remain usable if the dashboard export breaks.
    try:
        subprocess.run(
            ["python3", str(Path(PROJECT_DIR) / "scripts" / "tjb-city-ledger.py"), "sync"],
            cwd=PROJECT_DIR,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=30,
        )
    except Exception:
        pass


def probe_city(slug: str) -> dict:
    """Run the probe script and parse JSON output."""
    try:
        result = subprocess.run(
            ["python3", str(PROBE_SCRIPT), "--slug", slug],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            try:
                return json.loads(result.stdout.strip())
            except json.JSONDecodeError:
                for line in result.stdout.strip().split("\n"):
                    line = line.strip()
                    if line.startswith("{"):
                        try:
                            return json.loads(line)
                        except json.JSONDecodeError:
                            continue
        return {"exists": False, "error": result.stderr[:200]}
    except Exception as e:
        return {"exists": False, "error": str(e)}


def determine_initial_stage(slug: str) -> str:
    """Probe city and determine starting stage. Used for init only."""
    probe = probe_city(slug)
    return determine_initial_stage_from_probe(probe)


def determine_initial_stage_from_probe(probe: dict) -> str:
    """Determine starting stage from a probe result dict.

    This is the ONLY time probing determines the stage. After init,
    advancement is strictly forward via STAGE_ORDER index.
    """
    if not probe.get("exists", False):
        return "build"
    if not probe.get("has_local_doulas", False):
        return "build"

    # Check if enrichment is complete
    providers_have_photos = probe.get("providers_have_photos", False)
    providers_have_descs = probe.get("providers_have_descriptions", False)
    providers_have_costs = probe.get("providers_have_cost_ranges", False)
    enrichment_ok = providers_have_photos and providers_have_descs and providers_have_costs

    if not enrichment_ok:
        return "enrich"

    # Check images (part of build stage in 4-stage model, but if enrichment
    # is done and images are missing, we need to go back to build)
    if not probe.get("hero_on_disk", False) or not probe.get("og_on_disk", False):
        return "build"

    # Check if deployed + preflight passes
    if not probe.get("is_deployed", False):
        return "verify_deploy"

    # Check video + outreach
    if not probe.get("has_render", False) or not probe.get("has_youtube_id", False):
        return "video_outreach"
    if not probe.get("has_embed", False):
        return "video_outreach"

    return "complete"


# Stage-filtered recurring mistakes — only include items relevant to the stage
# Full 33-item dump is noise; subagents need only what applies to their stage
STAGE_MISTAKE_FILTER = {
    "build": [1, 2, 3, 9, 10, 11, 12, 13, 14, 20, 21, 24],
    "enrich": [4, 6, 7, 8, 9, 13, 15, 17, 21, 23, 25],
    "verify_deploy": [5, 6, 11, 18, 31, 32],
    "video_outreach": [2, 5, 16, 22, 31],
}


def load_recurring_mistakes(stage: str = None) -> str:
    """Load recurring mistakes, optionally filtered to only items relevant to the given stage."""
    if not RECURRING_MISTAKES_PATH.exists():
        return "Recurring mistakes file not found. Read references/recurring-mistakes-block.md"
    full_text = RECURRING_MISTAKES_PATH.read_text()
    if stage is None or stage not in STAGE_MISTAKE_FILTER:
        return full_text
    # Parse numbered items from the mistakes file and extract only relevant ones.
    # Each item starts with "N. " at column 0 and continues until the next "N. " or a section header.
    relevant_nums = set(STAGE_MISTAKE_FILTER[stage])
    lines = full_text.split("\n")
    output_lines = []
    current_num = None
    for line in lines:
        m = re.match(r'^(\d+)\.\s', line)
        if m:
            current_num = int(m.group(1))
            if current_num in relevant_nums:
                output_lines.append(line)
            # else: skip this item (current_num tracks which item we're inside)
        elif current_num is not None and current_num in relevant_nums:
            # We're inside a relevant item — include continuation lines
            # Stop at section headers (lines starting with # or ##)
            if line.startswith("#") and not line.startswith("# Recurring"):
                current_num = None  # Section header ends the item
            else:
                output_lines.append(line)
    # Clean up trailing blank lines
    while output_lines and not output_lines[-1].strip():
        output_lines.pop()
    header = f"# Recurring Mistakes for {stage.upper()} stage (filtered — full list in recurring-mistakes-block.md)\n\n"
    return header + "\n".join(output_lines)


def get_stage_index(stage: str) -> int:
    """Get the index of a stage in STAGE_ORDER. Maps old names for backward compat."""
    if stage in STAGE_ORDER:
        return STAGE_ORDER.index(stage)
    # Try old-to-new mapping
    new_stage = OLD_TO_NEW_STAGE.get(stage)
    if new_stage and new_stage in STAGE_ORDER:
        return STAGE_ORDER.index(new_stage)
    return -1


def cmd_init(slug: str):
    """Initialize state file for a city. Probes once to determine starting stage."""
    if not validate_slug(slug):
        print(json.dumps({
            "action": "error",
            "slug": slug,
            "error": f"Invalid slug '{slug}'. Slugs must be lowercase-letters-2letter-state (e.g., 'dallas-tx'). Test data like 'city1-tx' is rejected."
        }, indent=2))
        return

    # Probe once to determine starting stage
    probe = probe_city(slug)
    stage = determine_initial_stage_from_probe(probe)
    stage_idx = get_stage_index(stage)

    # Skeleton detection: if 0 providers, mark as skeleton
    city_type = "enriched"
    if probe.get("provider_count", 0) == 0 and not probe.get("has_local_doulas", False):
        city_type = "skeleton"

    state = {
        "slug": slug,
        "current_stage": stage,
        "stage_index": stage_idx,
        "max_stage_reached": stage_idx,
        "started_at": int(time.time()),
        "updated_at": int(time.time()),
        "stages_completed": [],
        "stages_failed": [],
        "stage_attempts": {},      # per-stage attempt count
        "gate_results": {},          # per-stage gate results
        "history": [],
        "blocked": False,
        "blocked_reason": None,
        "version": 2,                # state machine v2
        "city_type": city_type,       # "skeleton" vs "enriched"
    }
    save_state(slug, state)
    print(json.dumps({
        "action": "init",
        "slug": slug,
        "stage": stage,
        "stage_index": stage_idx,
        "version": 2,
    }, indent=2))


def cmd_next(slug: str):
    """Output next stage to execute + subagent context."""
    state = load_state(slug)
    if not state:
        # Auto-init if not found
        cmd_init(slug)
        state = load_state(slug)

    if not state:
        print(json.dumps({"action": "error", "slug": slug, "message": "Failed to init state."}))
        return

    # Check if pipeline is blocked
    if state.get("blocked", False):
        print(json.dumps({
            "action": "blocked",
            "slug": slug,
            "message": state.get("blocked_reason", "Pipeline is blocked."),
            "stages_completed": state.get("stages_completed", []),
            "stages_failed": state.get("stages_failed", []),
        }, indent=2))
        return

    stage = state.get("current_stage", "build")

    if stage == "complete":
        print(json.dumps({
            "action": "complete",
            "slug": slug,
            "message": f"Pipeline complete for {slug}. All stages done.",
            "stages_completed": state.get("stages_completed", []),
        }, indent=2))
        return

    ctx = STAGE_CONTEXTS.get(stage)
    if not ctx:
        # Try old-to-new mapping
        new_stage = OLD_TO_NEW_STAGE.get(stage, stage)
        ctx = STAGE_CONTEXTS.get(new_stage)
        if not ctx:
            print(json.dumps({
                "action": "error",
                "slug": slug,
                "message": f"Unknown stage: {stage}. Run init to reset.",
            }, indent=2))
            return
        stage = new_stage

    recurring = load_recurring_mistakes(stage)
    goal = ctx["goal_template"].format(slug=slug)

    subagent_context = f"""You are a TJB pipeline stage worker — a subagent delegated by the parent state machine.
Your scope is ONE stage for ONE city. Do not attempt other stages or cities.

CITY: {slug}
STAGE: {stage} (stage {get_stage_index(stage) + 1} of 4)
PROJECT DIR: {PROJECT_DIR}

## What to do
Load skill '{ctx["skill"]}' and follow it for this stage.
Goal: {goal}

## Stage-specific pitfalls (read these before starting)
{recurring}

## Rules
- NEVER use write_file or patch on cities.ts. Use Python heredoc via terminal.
- Deploy with: bash scripts/deploy.sh {slug} (never raw wrangler)
- Run preflight after any cities.ts edit: npx tsx scripts/preflight.ts {slug}
- Forward-only: this stage will not repeat unless it fails. Make it count.
- You do NOT advance the state machine or pick the next stage. The parent does that.

## Worker discipline
1. WRITE FIRST. Make your primary write (cities.ts data, image files, etc.) within the first 3 tool calls. Reading is a liability — stop exploring after at most 3 reads.
2. VERIFY ON DISK before reporting done. Run `ls -la` on every file you produced. Empty or missing artifact = FAILURE.
3. RECOVER from errors. If a command fails on quoting/syntax, retry immediately with a different approach. Do not stop and say "falling back" — fix it and keep going.
4. If you hit the tool-call cap with work remaining, save partial artifacts to disk and report exactly which files landed and which remain. Never claim done when it isn't.
5. Run the validation gate after writing: `npx tsx scripts/validate-city-data.ts {slug}` for data stages. Report the real exit code + errors verbatim.

## Stage gates (must pass before this stage can advance)
{', '.join(ctx.get('gates', []))}
"""

    output = {
        "action": "next",
        "slug": slug,
        "stage": stage,
        "stage_index": get_stage_index(stage),
        "subagent_goal": goal,
        "subagent_toolsets": ctx["toolsets"],
        "subagent_context": subagent_context,
        "stage_gates": ctx.get("gates", []),
        "stages_completed": state.get("stages_completed", []),
        "stages_failed": state.get("stages_failed", []),
        "attempts": state.get("stage_attempts", {}).get(stage, 0),
    }
    print(json.dumps(output, indent=2))


def cmd_done(slug: str, stage: str):
    """Mark a stage as complete and advance FORWARD to next stage.

    No re-probing. Next stage is always STAGE_ORDER[current_index + 1].
    """
    state = load_state(slug)
    if not state:
        print(json.dumps({"error": f"No state file for {slug}. Run init first."}))
        return

    # Map old stage name to new if needed
    actual_stage = stage
    if stage not in STAGE_ORDER:
        actual_stage = OLD_TO_NEW_STAGE.get(stage, stage)

    current_idx = get_stage_index(state.get("current_stage", "build"))
    actual_idx = get_stage_index(actual_stage)

    # Guard: reject unknown/unmappable stages to prevent backward bounce
    if actual_idx < 0:
        print(json.dumps({
            "action": "error",
            "slug": slug,
            "error": f"Unknown stage '{stage}'. Valid stages: {STAGE_ORDER[:-1]} or old names: {list(OLD_TO_NEW_STAGE.keys())}"
        }, indent=2))
        return

    # Guard: the completed stage should match the current stage
    if actual_idx != current_idx:
        print(json.dumps({
            "action": "error",
            "slug": slug,
            "error": f"Stage '{actual_stage}' (idx {actual_idx}) does not match current stage '{state.get('current_stage')}' (idx {current_idx}). Use 'done' only for the current stage."
        }, indent=2))
        return

    # ARTIFACT GUARD (2026-08-24, Palmdale masked-failure fix):
    # A worker reporting "completed" (even via max_iterations exit) must have left
    # real evidence on disk. Missing artifact = hard fail, not silent advance.
    def _check_artifacts(slug: str, stage: str):
        import re as _re
        try:
            cities_ts = (Path(PROJECT_DIR) / "src" / "data" / "cities.ts").read_text()
        except OSError:
            return "cities.ts unreadable"
        m = _re.search(rf'\"{slug}\":', cities_ts) or _re.search(rf'"{slug}":', cities_ts)
        if stage == "build":
            if f'"{slug}"' not in cities_ts:
                return f"cities.ts has no '{slug}' data block — build artifacts missing"
            hero = list((Path(PROJECT_DIR) / "public" / "images").glob(f"{slug}-*hero*.webp"))
            if not hero:
                return f"no hero image for {slug} — build artifacts missing"
        if stage == "enrich":
            block = ""
            # Find the actual city block: "slug": { (not a nearbyCities reference)
            import re as _re2
            block_match = _re2.search(rf'"{_re2.escape(slug)}"\s*:\s*\{{', cities_ts)
            if block_match:
                mi = block_match.start()
                # Find end of block by tracking brace depth
                depth = 1
                i = block_match.end()
                while depth > 0 and i < len(cities_ts):
                    if cities_ts[i] == '{':
                        depth += 1
                    elif cities_ts[i] == '}':
                        depth -= 1
                    i += 1
                block = cities_ts[mi:i]
            if "Contact for pricing" in block:
                return "enrich incomplete: 'Contact for pricing' present"
            if "paragraph:" not in block:
                return "enrich incomplete: no hospital/birth-center descriptions"
        return None

    _artifact_error = _check_artifacts(slug, actual_stage)
    if _artifact_error:
        failed = state.get("stages_failed", [])
        if isinstance(failed, list):
            if actual_stage not in failed:
                failed.append(actual_stage)
        elif isinstance(failed, dict):
            failed[actual_stage] = failed.get(actual_stage, 0) + 1
        state["stages_failed"] = failed
        save_state(slug, state)
        print(json.dumps({
            "action": "artifact_fail",
            "slug": slug,
            "stage": actual_stage,
            "error": _artifact_error,
            "message": "Worker claimed completion but artifacts are missing. Stage NOT advanced. Re-run the stage worker.",
        }, indent=2))
        sys.exit(3)

    # Record completion
    completed = state.get("stages_completed", [])
    if actual_stage not in completed:
        completed.append(actual_stage)
    state["stages_completed"] = completed

    # Record history
    history = state.get("history", [])
    history.append({
        "stage": actual_stage,
        "status": "done",
        "timestamp": int(time.time()),
        "gate_results": state.get("gate_results", {}).get(actual_stage, {}),
    })
    state["history"] = history

    # Forward-only advancement: next = index + 1
    next_idx = actual_idx + 1
    if next_idx >= len(STAGE_ORDER):
        next_stage = "complete"
    else:
        next_stage = STAGE_ORDER[next_idx]

    state["current_stage"] = next_stage
    state["stage_index"] = next_idx
    state["max_stage_reached"] = max(state.get("max_stage_reached", 0), next_idx)
    state["updated_at"] = int(time.time())
    state["blocked"] = False
    state["blocked_reason"] = None

    # Reset attempt counter for the new stage
    stage_attempts = state.get("stage_attempts", {})
    stage_attempts[next_stage] = 0
    state["stage_attempts"] = stage_attempts

    save_state(slug, state)
    print(json.dumps({
        "action": "done",
        "slug": slug,
        "completed_stage": actual_stage,
        "next_stage": next_stage,
        "stage_index": next_idx,
        "stages_completed": completed,
        "max_stage_reached": state["max_stage_reached"],
    }, indent=2))


def cmd_fail(slug: str, stage: str, reason: str):
    """Mark a stage as failed. Increment attempt counter. Block if over limit."""
    state = load_state(slug)
    if not state:
        print(json.dumps({"error": f"No state file for {slug}. Run init first."}))
        return

    # If already blocked, don't increment further
    if state.get("blocked", False):
        print(json.dumps({
            "action": "already_blocked",
            "slug": slug,
            "message": state.get("blocked_reason", "Pipeline is blocked. Use 'unblock' command to retry."),
            "attempts": state.get("stage_attempts", {}).get(stage, "?"),
        }, indent=2))
        return

    # Map old stage name to new if needed
    actual_stage = stage
    if stage not in STAGE_ORDER:
        actual_stage = OLD_TO_NEW_STAGE.get(stage, stage)

    failed = state.get("stages_failed", [])
    failed.append({"stage": actual_stage, "reason": reason, "timestamp": int(time.time())})
    state["stages_failed"] = failed

    history = state.get("history", [])
    history.append({
        "stage": actual_stage,
        "status": "failed",
        "reason": reason,
        "timestamp": int(time.time()),
    })
    state["history"] = history

    # Increment per-stage attempt counter
    stage_attempts = state.get("stage_attempts", {})
    stage_attempts[actual_stage] = stage_attempts.get(actual_stage, 0) + 1
    state["stage_attempts"] = stage_attempts

    # Check if over attempt limit for this stage
    limit = STAGE_ATTEMPT_LIMITS.get(actual_stage, 3)
    attempts = stage_attempts[actual_stage]

    if attempts >= limit:
        state["blocked"] = True
        state["blocked_reason"] = (
            f"Stage '{actual_stage}' has failed {attempts} times (limit: {limit}). "
            f"Last reason: {reason}. Use 'unblock' command to retry."
        )

    state["updated_at"] = int(time.time())
    save_state(slug, state)

    response = {
        "action": "fail",
        "slug": slug,
        "failed_stage": actual_stage,
        "reason": reason,
        "attempts": attempts,
        "limit": limit,
    }
    if attempts >= limit:
        response["blocked"] = True
        response["blocked_reason"] = state["blocked_reason"]
    print(json.dumps(response, indent=2))


def cmd_status(slug: str):
    """Show current state."""
    state = load_state(slug)
    if not state:
        print(json.dumps({"error": f"No state file for {slug}. Run init first."}))
        return
    print(json.dumps(state, indent=2))


def cmd_unblock(slug: str):
    """Clear blocked status and allow retry."""
    state = load_state(slug)
    if not state:
        print(json.dumps({"error": f"No state file for {slug}. Run init first."}))
        return

    state["blocked"] = False
    state["blocked_reason"] = None
    state["updated_at"] = int(time.time())

    # Reset attempt counter for current stage
    current_stage = state.get("current_stage", "build")
    stage_attempts = state.get("stage_attempts", {})
    stage_attempts[current_stage] = 0
    state["stage_attempts"] = stage_attempts

    save_state(slug, state)
    print(json.dumps({
        "action": "unblock",
        "slug": slug,
        "stage": current_stage,
        "message": f"Unblocked. Stage '{current_stage}' attempt counter reset to 0."
    }, indent=2))


def cmd_gates(slug: str, stage: str, gate_results_json: str):
    """Record gate results for a stage. Stores what gates ran, passed, and failed."""
    state = load_state(slug)
    if not state:
        print(json.dumps({"error": f"No state file for {slug}. Run init first."}))
        return

    # Map old stage name to new if needed
    actual_stage = stage
    if stage not in STAGE_ORDER:
        actual_stage = OLD_TO_NEW_STAGE.get(stage, stage)

    try:
        gate_results = json.loads(gate_results_json)
    except json.JSONDecodeError:
        gate_results = {"raw": gate_results_json}

    gate_results_store = state.get("gate_results", {})
    gate_results_store[actual_stage] = {
        "results": gate_results,
        "timestamp": int(time.time()),
    }
    state["gate_results"] = gate_results_store
    state["updated_at"] = int(time.time())

    save_state(slug, state)
    print(json.dumps({
        "action": "gates",
        "slug": slug,
        "stage": actual_stage,
        "gate_results": gate_results,
    }, indent=2))


def cmd_advance(slug: str, stage: str):
    """Run the per-stage gate before advancing. Only calls cmd_done if gate exits 0.

    Exit codes (per process-framework gate contract):
        0 = pass → call cmd_done, advance to next stage
        1 = RETRYABLE_SUBAGENT → output status for cron to re-spawn subagent
        2 = RETRYABLE_INFRA → output status for cron to wait + retry
        3 = FATAL → call cmd_fail with blocked_reason, block pipeline
    """
    gate_script = str(Path(PROJECT_DIR) / "scripts" / "preflight-stage-gate.py")
    cmd = ["python3", gate_script, "--city", slug, "--stage", stage]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True, text=True, timeout=180,
            cwd=PROJECT_DIR,
        )
        exit_code = result.returncode
        gate_output = result.stdout.strip()
        gate_stderr = result.stderr.strip()

        if exit_code == 0:
            # Gate passed — advance
            print(json.dumps({
                "action": "gate_pass",
                "slug": slug,
                "stage": stage,
                "gate_exit": 0,
                "gate_output": gate_output[-500:] if len(gate_output) > 500 else gate_output,
                "message": f"Stage gate for {stage} passed. Advancing.",
            }, indent=2))
            cmd_done(slug, stage)

        elif exit_code == 1:
            # RETRYABLE_SUBAGENT — subagent should be re-spawned
            print(json.dumps({
                "action": "gate_retryable_subagent",
                "slug": slug,
                "stage": stage,
                "gate_exit": 1,
                "gate_output": gate_output[-500:] if len(gate_output) > 500 else gate_output,
                "message": (
                    f"Stage gate for {stage} FAILED (retryable). "
                    "Re-spawn the step subagent to fix structural issues."
                ),
            }, indent=2))
            sys.exit(1)

        elif exit_code == 2:
            # RETRYABLE_INFRA — wait and retry, don't re-spawn
            print(json.dumps({
                "action": "gate_retryable_infra",
                "slug": slug,
                "stage": stage,
                "gate_exit": 2,
                "gate_output": gate_output[-500:] if len(gate_output) > 500 else gate_output,
                "message": (
                    f"Stage gate for {stage} FAILED (infra issue). "
                    "Wait and retry the gate; do NOT re-spawn the subagent."
                ),
            }, indent=2))
            sys.exit(2)

        elif exit_code == 3:
            # FATAL — block and escalate
            reason = f"GATE_FATAL (stage={stage}): {gate_output[:300]}"
            print(json.dumps({
                "action": "gate_fatal",
                "slug": slug,
                "stage": stage,
                "gate_exit": 3,
                "gate_output": gate_output[-500:] if len(gate_output) > 500 else gate_output,
                "message": f"Stage gate for {stage} FATAL. Blocking pipeline.",
            }, indent=2))
            cmd_fail(slug, stage, reason)

        else:
            # Unknown exit code — treat as failure
            reason = (
                f"GATE_UNKNOWN_EXIT (stage={stage}, exit={exit_code}): "
                f"{gate_stderr[:200] or gate_output[:200]}"
            )
            print(json.dumps({
                "action": "gate_unknown_exit",
                "slug": slug,
                "stage": stage,
                "gate_exit": exit_code,
                "gate_output": gate_output[-500:] if len(gate_output) > 500 else gate_output,
                "message": (
                    f"Stage gate for {stage} exited with unexpected code {exit_code}. "
                    "Failing the stage."
                ),
            }, indent=2))
            cmd_fail(slug, stage, reason)

    except subprocess.TimeoutExpired:
        reason = f"GATE_TIMEOUT (stage={stage}): gate script timed out after 180s"
        print(json.dumps({
            "action": "gate_timeout",
            "slug": slug,
            "stage": stage,
            "error": "timeout",
            "message": reason,
        }, indent=2))
        cmd_fail(slug, stage, reason)
    except Exception as e:
        reason = f"GATE_SCRIPT_ERROR (stage={stage}): {e}"
        print(json.dumps({
            "action": "gate_error",
            "slug": slug,
            "stage": stage,
            "error": str(e),
            "message": reason,
        }, indent=2))
        cmd_fail(slug, stage, reason)


def cmd_clean_stale():
    """Remove stale/test state files."""
    test_slugs = ["city1-tx", "city2-co", "city3-ny", "city4-fl"]
    removed = []
    for slug in test_slugs:
        state_file = STATES_DIR / f"{slug}.json"
        if state_file.exists():
            state_file.unlink()
            removed.append(slug)

    # Also check for denver.json (wrong slug format, should be denver-co)
    denver_file = STATES_DIR / "denver.json"
    if denver_file.exists():
        denver_file.unlink()
        removed.append("denver")

    print(json.dumps({
        "action": "clean_stale",
        "removed": removed,
        "message": f"Removed {len(removed)} stale state files."
    }, indent=2))


def main():
    if len(sys.argv) < 2:
        print("Usage: tjb-pipeline-state.py {init|next|done|fail|status|unblock|gates|advance|clean-stale} {slug} [args]")
        print("  init {slug}          — Create/reset state, probe for initial stage")
        print("  next {slug}          — Output next stage + subagent context")
        print("  done {slug} {stage}  — Mark stage complete, advance forward")
        print("  fail {slug} {stage} {reason} — Mark stage failed")
        print("  status {slug}        — Show current state")
        print("  unblock {slug}       — Clear blocked status, reset attempt counter")
        print("  gates {slug} {stage} {json} — Record gate results for a stage")
        print("  advance {slug} {stage} — Run per-stage gate, advance only if gate passes (exit 0)")
        print("  clean-stale           — Remove test/stale state files")
        sys.exit(1)

    command = sys.argv[1]

    if command == "clean-stale":
        cmd_clean_stale()
        sys.exit(0)

    if len(sys.argv) < 3:
        print(f"Error: command '{command}' requires a slug argument")
        sys.exit(1)

    slug = sys.argv[2]

    if command == "init":
        cmd_init(slug)
    elif command == "next":
        cmd_next(slug)
    elif command == "done":
        stage = sys.argv[3] if len(sys.argv) > 3 else ""
        cmd_done(slug, stage)
    elif command == "fail":
        stage = sys.argv[3] if len(sys.argv) > 3 else ""
        reason = sys.argv[4] if len(sys.argv) > 4 else "unknown"
        cmd_fail(slug, stage, reason)
    elif command == "status":
        cmd_status(slug)
    elif command == "unblock":
        cmd_unblock(slug)
    elif command == "gates":
        stage = sys.argv[3] if len(sys.argv) > 3 else ""
        gate_json = sys.argv[4] if len(sys.argv) > 4 else "{}"
        cmd_gates(slug, stage, gate_json)
    elif command == "advance":
        stage = sys.argv[3] if len(sys.argv) > 3 else ""
        if not stage:
            print("Error: advance requires a stage argument")
            sys.exit(1)
        cmd_advance(slug, stage)
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
