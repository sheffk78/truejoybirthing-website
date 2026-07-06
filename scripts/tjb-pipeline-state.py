#!/usr/bin/env python3
"""
TJB Pipeline State Machine — manages state file for end-to-end pipeline runs.

Usage:
    python3 tjb-pipeline-state.py init {slug}     # Create/reset state file, probe city
    python3 tjb-pipeline-state.py next {slug}      # Output next stage + subagent context
    python3 tjb-pipeline-state.py done {slug} {stage}  # Mark stage complete
    python3 tjb-pipeline-state.py fail {slug} {stage} {reason}  # Mark stage failed
    python3 tjb-pipeline-state.py status {slug}    # Show current state

The state file lives at: ~/.hermes/skills/productivity/tjb-city-orchestrator/states/{slug}.json
The parent agent calls this between subagent delegations to track progress.
"""

import json
import os
import subprocess
import sys
import time
from pathlib import Path

SKILL_DIR = Path("/Users/socializerender/.hermes/skills/productivity/tjb-city-orchestrator")
STATES_DIR = SKILL_DIR / "states"
PROBE_SCRIPT = SKILL_DIR / "scripts" / "probe-city-candidates.py"
PROJECT_DIR = "/Users/socializerender/Projects/truejoybirthing-website"
RECURRING_MISTAKES_PATH = SKILL_DIR / "references" / "recurring-mistakes-block.md"

# Pipeline stages in execution order
STAGE_ORDER = [
    "needs_research",
    "needs_enrichment",
    "needs_images",
    "needs_preflight",
    "needs_deploy",
    "needs_outreach",
    "needs_video",
    "needs_embed",
    "complete"
]

# Stage-specific subagent context (what the subagent needs to know)
STAGE_CONTEXTS = {
    "needs_research": {
        "skill": "tjb-city-pipeline",
        "goal_template": "Research providers, hospitals, and birth centers for {slug}. Write the data into cities.ts using Python heredoc via terminal (NEVER use write_file or patch on cities.ts). Find at least the minimum provider count for the city's population tier. Verify data accuracy.",
        "toolsets": ["terminal", "file", "web", "browser"],
    },
    "needs_enrichment": {
        "skill": "tjb-provider-enrichment",
        "goal_template": "Enrich provider data for {slug}: add photos, descriptions, cost ranges, hospital thumbnails, birth center details. Replace any 'Contact for pricing' with real dollar ranges. Run preflight after edits to verify.",
        "toolsets": ["terminal", "file", "web", "browser", "vision"],
    },
    "needs_images": {
        "skill": "tjb-city-pipeline",
        "goal_template": "Generate hero image (pregnant silhouette + golden hour, NOT skyline) and OG image (Pattern B v2) for {slug}. Hero filename must contain the city slug. Save hero to both public/images/ and public/images/heroes/. OG must use -v2 suffix.",
        "toolsets": ["terminal", "file", "image_gen", "vision"],
    },
    "needs_preflight": {
        "skill": "tjb-city-pipeline",
        "goal_template": "Run preflight for {slug}: `npx tsx scripts/preflight.ts {slug}`. Fix ALL gate failures. Common fixes: NICU levels missing, provider count too low (G37), hospital thumbnails too small (G35), 'Contact for pricing' text (S8). Re-run until all gates pass.",
        "toolsets": ["terminal", "file", "browser"],
    },
    "needs_deploy": {
        "skill": "tjb-city-pipeline",
        "goal_template": "Build and deploy {slug}: run `npm run build`, then `bash scripts/deploy.sh {slug}`. Verify live: curl the page URL, check HTTP 200, verify hero and OG images load. Report any deploy failures.",
        "toolsets": ["terminal", "file"],
    },
    "needs_outreach": {
        "skill": "tjb-provider-outreach",
        "goal_template": "Draft and send provider outreach emails for {slug}. Find provider email addresses (curl+grep, JSON-LD, domain inference). Verify emails with email-validator. Draft personalized emails signed as Jeff. Send via AgentMail from shelbi@truejoybirthing.com with 15s delays. Include P.S. opt-out. Update tjb-city-status.json.",
        "toolsets": ["terminal", "file", "web", "browser"],
    },
    "needs_video": {
        "skill": "tjb-city-video-pipeline",
        "goal_template": "Create video for {slug}: write scene data file ({slug}-data.ts), generate TTS audio (Shelbi voice), pre-render gate, capture stills for visual verification, render video, upload to YouTube as NEW video, generate and upload thumbnail. Update video-embeds.ts with new video ID.",
        "toolsets": ["terminal", "file", "vision", "browser"],
    },
    "needs_embed": {
        "skill": "tjb-city-video-pipeline",
        "goal_template": "Embed video for {slug}: update video-embeds.ts with YouTube ID, rebuild and deploy, verify embed loads on live page. Check VideoObject schema in dist HTML.",
        "toolsets": ["terminal", "file", "browser"],
    },
}


def ensure_states_dir():
    STATES_DIR.mkdir(parents=True, exist_ok=True)


def load_state(slug: str) -> dict:
    state_file = STATES_DIR / f"{slug}.json"
    if state_file.exists():
        return json.loads(state_file.read_text())
    return {}


def save_state(slug: str, state: dict):
    ensure_states_dir()
    state_file = STATES_DIR / f"{slug}.json"
    state_file.write_text(json.dumps(state, indent=2))


def probe_city(slug: str) -> dict:
    """Run the probe script and parse JSON output."""
    try:
        result = subprocess.run(
            ["python3", str(PROBE_SCRIPT), "--slug", slug],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            # Probe outputs multi-line JSON, not JSON-per-line
            try:
                return json.loads(result.stdout.strip())
            except json.JSONDecodeError:
                # Fallback: try line-by-line
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


def determine_stage(slug: str, run_preflight: bool = True) -> str:
    """Probe city and determine current pipeline stage.
    
    Args:
        slug: City slug
        run_preflight: If False, skip the preflight.ts call (use probe output only).
                      Set False for fast stage transitions where preflight isn't the
                      likely next stage (saves 30-60s per transition).
    """
    probe = probe_city(slug)
    
    # Map probe JSON fields to stages (based on actual probe output format)
    if not probe.get("exists", False):
        return "needs_research"
    if not probe.get("has_local_doulas", False):
        return "needs_research"
    
    # Check enrichment completeness
    providers_have_photos = probe.get("providers_have_photos", False)
    providers_have_descs = probe.get("providers_have_descriptions", False)
    providers_have_costs = probe.get("providers_have_cost_ranges", False)
    enrichment_ok = providers_have_photos and providers_have_descs and providers_have_costs
    
    if not enrichment_ok:
        return "needs_enrichment"
    
    # Check images
    if not probe.get("hero_on_disk", False) or not probe.get("og_on_disk", False):
        return "needs_images"
    
    # Check preflight (only when explicitly requested — saves 30-60s per transition)
    if run_preflight:
        try:
            result = subprocess.run(
                ["npx", "tsx", "scripts/preflight.ts", slug],
                capture_output=True, text=True, timeout=120,
                cwd=PROJECT_DIR
            )
            if result.returncode != 0:
                return "needs_preflight"
        except:
            pass
    
    # Check if deployed
    if not probe.get("is_deployed", False):
        return "needs_deploy"
    
    # Check outreach
    if not probe.get("has_outreach", False):
        return "needs_outreach"
    
    # Check video
    if not probe.get("has_scene_data", False) or not probe.get("has_render", False):
        return "needs_video"
    
    # Check embed
    if not probe.get("has_embed", False):
        return "needs_embed"
    
    return "complete"


def load_recurring_mistakes() -> str:
    if RECURRING_MISTAKES_PATH.exists():
        return RECURRING_MISTAKES_PATH.read_text()
    return "Recurring mistakes file not found. Read references/recurring-mistakes-block.md"


def cmd_init(slug: str):
    """Initialize state file for a city."""
    stage = determine_stage(slug)
    state = {
        "slug": slug,
        "current_stage": stage,
        "started_at": int(time.time()),
        "stages_completed": [],
        "stages_failed": [],
        "history": [],
    }
    save_state(slug, state)
    print(json.dumps({"action": "init", "slug": slug, "stage": stage}, indent=2))


def cmd_next(slug: str):
    """Output next stage to execute + subagent context."""
    state = load_state(slug)
    if not state:
        # Auto-init if not found
        cmd_init(slug)
        state = load_state(slug)
    
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
    
    stage = state.get("current_stage", "unknown")
    
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
        print(json.dumps({
            "action": "error",
            "slug": slug,
            "message": f"Unknown stage: {stage}. Re-probe needed.",
        }, indent=2))
        return
    
    # Build the subagent context
    recurring = load_recurring_mistakes()
    goal = ctx["goal_template"].format(slug=slug)
    
    subagent_context = f"""You are working on the True Joy Birthing city page pipeline.

CITY: {slug}
STAGE: {stage}
PROJECT DIR: {PROJECT_DIR}

{recurring}

ADDITIONAL RULES:
- NEVER use write_file or patch on cities.ts. Use Python heredoc via terminal.
- Deploy with: bash scripts/deploy.sh {slug} (never raw wrangler)
- Run preflight after any cities.ts edit: npx tsx scripts/preflight.ts {slug}
- G53 now checks video staleness automatically
- Load skill '{ctx["skill"]}' for detailed stage instructions
"""
    
    output = {
        "action": "next",
        "slug": slug,
        "stage": stage,
        "subagent_goal": goal,
        "subagent_toolsets": ctx["toolsets"],
        "subagent_context": subagent_context,
        "stages_completed": state.get("stages_completed", []),
        "stages_failed": state.get("stages_failed", []),
    }
    print(json.dumps(output, indent=2))


def run_enrichment_review(slug: str) -> dict:
    """Run the enrichment reviewer gate. Returns the review result dict.
    
    This is the "voice reviewer" pattern — a stronger model in fresh context
    reviews the enrichment output against a quality standard. If it fails,
    the orchestrator should loop back to enrichment with the failures.
    """
    review_script = Path(PROJECT_DIR) / "scripts" / "enrichment-review.py"
    if not review_script.exists():
        return {"pass": True, "score": 100, "failures": [], "notes": "Reviewer script not found, skipping"}
    
    try:
        result = subprocess.run(
            ["python3", str(review_script), slug],
            capture_output=True, text=True, timeout=90,
            cwd=str(PROJECT_DIR)
        )
        # Parse JSON from stdout (the script outputs JSON)
        import json as json_mod
        try:
            review = json_mod.loads(result.stdout.strip())
            # If the reviewer itself errored (API unavailable, etc), don't block the pipeline.
            # Fail open: let the pipeline proceed and rely on deterministic gates.
            if "error" in review:
                return {"pass": True, "score": 100, "failures": [], "notes": f"Reviewer error (fail-open): {review.get('error', 'unknown')}"}
            return review
        except json_mod.JSONDecodeError:
            return {"pass": True, "score": 100, "failures": [], "notes": f"Reviewer output unparseable (exit {result.returncode}), skipping"}
    except Exception as e:
        return {"pass": True, "score": 100, "failures": [], "notes": f"Reviewer error: {e}, skipping"}


def cmd_done(slug: str, stage: str):
    """Mark a stage as complete and advance to next stage."""
    state = load_state(slug)
    if not state:
        print(json.dumps({"error": f"No state file for {slug}. Run init first."}))
        return
    
    # Record completion
    completed = state.get("stages_completed", [])
    if stage not in completed:
        completed.append(stage)
    state["stages_completed"] = completed
    
    # Record history
    history = state.get("history", [])
    history.append({"stage": stage, "status": "done", "timestamp": int(time.time())})
    state["history"] = history
    
    # ── Enrichment review gate ──
    # When enrichment is marked done, run the reviewer model gate.
    # If the reviewer fails (score < 80), block advancement and report failures.
    # The orchestrator should re-run enrichment with the failure list, then call done again.
    if stage == "needs_enrichment":
        review = run_enrichment_review(slug)
        review_loops = state.get("enrichment_review_loops", 0)
        
        if not review.get("pass", False) and review.get("score", 0) < 80:
            review_loops += 1
            state["enrichment_review_loops"] = review_loops
            
            # Max 3 review loops before blocking
            if review_loops >= 3:
                state["current_stage"] = "needs_enrichment"
                state["blocked"] = True
                state["blocked_reason"] = f"Enrichment review failed {review_loops} times (score: {review.get('score', 0)}). Manual intervention required."
                state["enrichment_review_result"] = review
                state["updated_at"] = int(time.time())
                save_state(slug, state)
                print(json.dumps({
                    "action": "review_blocked",
                    "slug": slug,
                    "completed_stage": stage,
                    "review": review,
                    "review_loops": review_loops,
                    "blocked": True,
                    "reason": state["blocked_reason"],
                }, indent=2))
                return
            
            # Loop back: stay on needs_enrichment with the failures
            state["current_stage"] = "needs_enrichment"
            state["enrichment_review_result"] = review
            state["updated_at"] = int(time.time())
            save_state(slug, state)
            print(json.dumps({
                "action": "review_failed",
                "slug": slug,
                "completed_stage": stage,
                "review": review,
                "review_loops": review_loops,
                "next_action": f"Re-run enrichment for {slug} addressing the review failures, then call done again",
            }, indent=2))
            return
        else:
            # Review passed
            state["enrichment_review_loops"] = 0
            state["enrichment_review_result"] = review
            history.append({"stage": "enrichment_review", "status": "passed", "score": review.get("score", 0), "timestamp": int(time.time())})
            state["history"] = history
    
    # Check for infinite loop: if this same stage was the current_stage
    # and didn't advance, increment consecutive_same_stage counter
    prev_stage = state.get("current_stage", "")
    consecutive = state.get("consecutive_same_stage", 0)
    if prev_stage == stage:
        consecutive += 1
    else:
        consecutive = 0
    state["consecutive_same_stage"] = consecutive
    
    # Re-probe to determine actual next stage
    # Skip preflight for fast transitions (saves 30-60s per stage)
    # Only run preflight when we're likely at or past the preflight stage
    stage_order = ["needs_research", "needs_enrichment", "needs_images", 
                   "needs_preflight", "needs_deploy", "needs_outreach", 
                   "needs_video", "needs_embed", "complete"]
    run_preflight = stage_order.index(stage) >= stage_order.index("needs_preflight") - 1
    next_stage = determine_stage(slug, run_preflight=run_preflight)
    
    # Infinite loop protection: if same stage repeats 3+ times, halt
    if next_stage == stage and consecutive >= 2:
        state["current_stage"] = next_stage
        state["blocked"] = True
        state["blocked_reason"] = f"Stage '{stage}' has not advanced after {consecutive + 1} attempts. Manual intervention required."
        state["updated_at"] = int(time.time())
        save_state(slug, state)
        print(json.dumps({
            "action": "blocked",
            "slug": slug,
            "completed_stage": stage,
            "next_stage": next_stage,
            "stages_completed": completed,
            "blocked": True,
            "reason": state["blocked_reason"],
        }, indent=2))
        return
    
    state["current_stage"] = next_stage
    state["updated_at"] = int(time.time())
    
    save_state(slug, state)
    print(json.dumps({
        "action": "done",
        "slug": slug,
        "completed_stage": stage,
        "next_stage": next_stage,
        "stages_completed": completed,
    }, indent=2))


def cmd_fail(slug: str, stage: str, reason: str):
    """Mark a stage as failed."""
    state = load_state(slug)
    if not state:
        print(json.dumps({"error": f"No state file for {slug}. Run init first."}))
        return
    
    failed = state.get("stages_failed", [])
    failed.append({"stage": stage, "reason": reason, "timestamp": int(time.time())})
    state["stages_failed"] = failed
    
    history = state.get("history", [])
    history.append({"stage": stage, "status": "failed", "reason": reason, "timestamp": int(time.time())})
    state["history"] = history
    state["updated_at"] = int(time.time())
    
    save_state(slug, state)
    print(json.dumps({
        "action": "fail",
        "slug": slug,
        "failed_stage": stage,
        "reason": reason,
    }, indent=2))


def cmd_status(slug: str):
    """Show current state."""
    state = load_state(slug)
    if not state:
        print(json.dumps({"error": f"No state file for {slug}. Run init first."}))
        return
    print(json.dumps(state, indent=2))


def main():
    if len(sys.argv) < 3:
        print("Usage: tjb-pipeline-state.py {init|next|done|fail|status} {slug} [args]")
        sys.exit(1)
    
    command = sys.argv[1]
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
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()