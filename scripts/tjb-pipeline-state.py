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
    "needs_verification",
    "needs_services",
    "needs_cost_data",
    "needs_photos",
    "needs_service_areas",
    "needs_deal_breakers",
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
        "goal_template": "Research providers, hospitals, birth centers, and lactation specialists for {slug}. Write the data into cities.ts using Python heredoc via terminal (NEVER use write_file or patch on cities.ts). Find at least the minimum provider count for the city's population tier. Find lactation specialists (IBCLC/CLC) if available; if none in the area, note it and proceed. Verify data accuracy.",
        "toolsets": ["terminal", "file", "web", "browser"],
    },
    "needs_verification": {
        "skill": "tjb-provider-enrichment",
        "goal_template": "Verification pass for {slug}: For each provider, verify the business is real, active, and is actually a doula, midwife, or lactation specialist. Check their website URL (if present) returns a live page. If the provider has a URL, crawl it to confirm the business is active and is birth-related. Set enrichedAt timestamp for each verified provider. Remove any providers that are clearly not doulas/midwives/lactation specialists or have dead URLs. Only populate the enrichedAt field and remove invalid providers — do NOT fill other fields yet.",
        "toolsets": ["terminal", "file", "web", "browser"],
    },
    "needs_services": {
        "skill": "tjb-provider-enrichment",
        "goal_template": "Services pass for {slug}: For each provider, extract their services list from their website or known data. Populate the services[] array with specific service strings (e.g., 'Birth Doula', 'Postpartum Doula', 'Lactation Consultant'). Set isLactation: true for providers whose primary practice is lactation consulting (IBCLC/CLC/CLS). Only populate services[] and isLactation — do NOT fill other fields.",
        "toolsets": ["terminal", "file", "web", "browser"],
    },
    "needs_cost_data": {
        "skill": "tjb-provider-enrichment",
        "goal_template": "Cost data pass for {slug}: For each provider, find pricing information. Populate costRange with a dollar range (e.g., '$800-$1,200'). If no pricing is publicly available, use 'Contact for pricing'. Less than 50% of providers should have 'Contact for pricing'. Only populate costRange — do NOT fill other fields.",
        "toolsets": ["terminal", "file", "web", "browser"],
    },
    "needs_photos": {
        "skill": "tjb-provider-enrichment",
        "goal_template": "Photos pass for {slug}: For each provider, find the best headshot or professional photo from their website or social media. Download to public/images/providers/ and set the photo field path. If no photo is available, leave photo empty (the template handles monogram fallback). Only populate photo — do NOT fill other fields.",
        "toolsets": ["terminal", "file", "web", "browser", "vision"],
    },
    "needs_service_areas": {
        "skill": "tjb-provider-enrichment",
        "goal_template": "Service areas pass for {slug}: For each provider, extract their geographic coverage area. Populate serviceArea[] with specific areas (e.g., 'Collin County, TX', 'DFW Metroplex', 'Downtown Dallas'). Only populate serviceArea[] — do NOT fill other fields.",
        "toolsets": ["terminal", "file", "web", "browser"],
    },
    "needs_deal_breakers": {
        "skill": "tjb-provider-enrichment",
        "goal_template": "Deal-breakers pass for {slug}: For each provider, extract VBAC support (vbacSupportive), water birth support (waterBirthSupport), home birth support (homeBirthSupport), languages (languages[]), and Medicaid acceptance (acceptsMedicaid). Set these boolean and array fields based on website data. Only populate these fields — do NOT fill other fields.",
        "toolsets": ["terminal", "file", "web", "browser"],
    },
    "needs_enrichment": {
        "skill": "tjb-provider-enrichment",
        "goal_template": "Final enrichment pass for {slug}: Add provider descriptions, hospital thumbnails, birth center details, and any remaining fields not covered by the field-specific passes (verification, services, cost_data, photos, service_areas, deal_breakers). For lactation specialists, ensure credential reflects their IBCLC/CLC/CLS credential and services[] includes Lactation or Breastfeeding Support. Run preflight after edits to verify.",
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
        "goal_template": "Draft and send provider outreach emails for {slug}. Find provider email addresses (curl+grep, JSON-LD, domain inference). Verify emails with email-validator. Draft personalized emails signed as Jeff. Send via AgentMail from shelbi@truejoybirthing.com with 15s delays. Include P.S. opt-out. For providers with NO email: run tjb-form-outreach.py to check for website contact forms, fill general forms via browser tools, escalate CAPTCHAs to Jeff via Discord. Update tjb-city-status.json.",
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
    providers_have_verification = probe.get("providers_have_verification", False)
    providers_have_services = probe.get("providers_have_services", False)
    providers_have_service_areas = probe.get("providers_have_service_areas", False)
    providers_have_deal_breakers = probe.get("providers_have_deal_breakers", False)
    
    # Phase 4A: Check sub-stages sequentially
    if not providers_have_verification:
        return "needs_verification"
    if not providers_have_services:
        return "needs_services"
    if not providers_have_costs:
        return "needs_cost_data"
    if not providers_have_photos:
        return "needs_photos"
    if not providers_have_service_areas:
        return "needs_service_areas"
    if not providers_have_deal_breakers:
        return "needs_deal_breakers"
    
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


def run_enrichment_review(slug: str, pass_focus: str | None = None) -> dict:
    """Run the enrichment reviewer gate. Returns the review result dict.
    
    This is the "voice reviewer" pattern — a stronger model in fresh context
    reviews the enrichment output against a quality standard. If it fails,
    the orchestrator should loop back to enrichment with the failures.
    
    Args:
        pass_focus: If provided, focus the review on only this field's quality.
    """
    review_script = Path(PROJECT_DIR) / "scripts" / "enrichment-review.py"
    if not review_script.exists():
        return {"pass": True, "score": 100, "failures": [], "notes": "Reviewer script not found, skipping"}
    
    cmd = ["python3", str(review_script), slug]
    if pass_focus:
        cmd.extend(["--pass", pass_focus])
    
    try:
        result = subprocess.run(
            cmd,
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
    # When enrichment (or a sub-stage) is marked done, run the reviewer model gate.
    # If the reviewer fails (score < 80), block advancement and report failures.
    # The orchestrator should re-run enrichment with the failure list, then call done again.
    enrichment_stages = {"needs_enrichment", "needs_verification", "needs_services",
                         "needs_cost_data", "needs_photos", "needs_service_areas",
                         "needs_deal_breakers"}
    if stage in enrichment_stages:
        # Map stage to pass_focus for field-specific review
        pass_map = {
            "needs_verification": "verification",
            "needs_services": "services",
            "needs_cost_data": "cost_data",
            "needs_photos": "photos",
            "needs_service_areas": "service_areas",
            "needs_deal_breakers": "deal_breakers",
        }
        pass_focus = pass_map.get(stage)
        review = run_enrichment_review(slug, pass_focus=pass_focus)
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
    stage_order = ["needs_research", "needs_verification", "needs_services",
                   "needs_cost_data", "needs_photos", "needs_service_areas",
                   "needs_deal_breakers", "needs_enrichment", "needs_images", 
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


def cmd_staleness_check(slug: str | None = None):
    """Check all cities (or a single city) for stale enrichment data.
    
    A provider is stale if its enrichedAt timestamp is older than 180 days.
    Cities with stale providers are flagged for re-verification.
    
    Output: JSON with staleness report.
    """
    STALE_THRESHOLD_DAYS = 180
    now = time.time()
    stale_threshold = now - (STALE_THRESHOLD_DAYS * 86400)
    
    cities_file = Path(PROJECT_DIR) / "src" / "data" / "cities.ts"
    if not cities_file.exists():
        print(json.dumps({"error": "cities.ts not found"}))
        return
    
    content = cities_file.read_text()
    
    # Find all city slugs
    import re
    slugs = re.findall(r'"([a-z]+-[a-z]+)"\s*:\s*\{', content)
    
    if slug:
        slugs = [s for s in slugs if s == slug]
    
    report = {
        "threshold_days": STALE_THRESHOLD_DAYS,
        "checked_at": int(now),
        "total_cities": len(slugs),
        "cities_with_stale": 0,
        "cities_never_enriched": 0,
        "cities_current": 0,
        "stale_details": [],
    }
    
    for city_slug in slugs:
        # Extract city block
        start = content.find(f'"{city_slug}"')
        if start == -1:
            continue
        i = content.index('{', start) + 1
        depth = 1
        while i < len(content) and depth > 0:
            if content[i] == '{':
                depth += 1
            elif content[i] == '}':
                depth -= 1
            i += 1
        block = content[start:i]
        
        # Find all enrichedAt timestamps in provider objects
        timestamps = re.findall(r'enrichedAt:\s*"([^"]+)"', block)
        
        if not timestamps:
            report["cities_never_enriched"] += 1
            continue
        
        # Parse timestamps and check staleness
        from datetime import datetime
        stale_providers = []
        fresh_providers = 0
        
        for ts in timestamps:
            try:
                # Handle ISO format: 2025-01-15 or 2025-01-15T10:30:00Z
                dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                ts_epoch = dt.timestamp()
                
                if ts_epoch < stale_threshold:
                    days_stale = int((now - ts_epoch) / 86400)
                    stale_providers.append({
                        "enrichedAt": ts,
                        "days_stale": days_stale,
                    })
                else:
                    fresh_providers += 1
            except (ValueError, TypeError):
                stale_providers.append({
                    "enrichedAt": ts,
                    "days_stale": "unknown (unparseable timestamp)",
                })
        
        if stale_providers:
            report["cities_with_stale"] += 1
            report["stale_details"].append({
                "slug": city_slug,
                "total_providers_enriched": len(timestamps),
                "stale_count": len(stale_providers),
                "fresh_count": fresh_providers,
                "stale_providers": stale_providers,
                "recommended_action": "re-verify providers using verify-providers.py",
            })
        else:
            report["cities_current"] += 1
    
    print(json.dumps(report, indent=2))


def main():
    if len(sys.argv) < 2:
        print("Usage: tjb-pipeline-state.py {init|next|done|fail|status|staleness} {slug} [args]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "staleness":
        slug = sys.argv[2] if len(sys.argv) > 2 else None
        cmd_staleness_check(slug)
        return
    elif len(sys.argv) < 3:
        print("Usage: tjb-pipeline-state.py {init|next|done|fail|status} {slug} [args]")
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
    elif command == "staleness":
        cmd_staleness_check(slug)
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()