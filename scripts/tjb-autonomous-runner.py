#!/usr/bin/env python3
"""
TJB Autonomous City Pipeline Runner
=====================================
Reads the canonical ledger, claims the next queued city, runs pipeline
stages with gates, deploys, verifies, and moves to the next city.

This is a CLI tool, NOT a daemon. Kit triggers it:
    python3 scripts/tjb-autonomous-runner.py status
    python3 scripts/tjb-autonomous-runner.py add-city <slug> --city "Ontario" --state CA --pop 173212
    python3 scripts/tjb-autonomous-runner.py run <slug>
    python3 scripts/tjb-autonomous-runner.py run-next
    python3 scripts/tjb-autonomous-runner.py gate <slug> <stage>
    python3 scripts/tjb-autonomous-runner.py complete <slug>
    python3 scripts/tjb-autonomous-runner.py queue

The runner is designed to be called by Kit (the agent), who spawns
subagents for BUILD and ENRICH stages. The runner handles:
  - Ledger state management (claim, advance, complete, block)
  - Gate execution (calls preflight-stage-gate.py)
  - Deploy (calls deploy.sh)
  - Live verification (curl HTTP 200 + image check)

Stages: queued → build → enrich → verify_deploy → video_outreach → complete
"""

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────────
PROJECT_DIR = Path(os.environ.get(
    "TJB_PROJECT_DIR",
    "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website"
))
LEDGER_PATH = Path(os.environ.get(
    "TJB_LEDGER_PATH",
    os.path.expanduser("~/.hermes/state/tjb-city-ledger.json")
))
GATE_SCRIPT = PROJECT_DIR / "scripts" / "preflight-stage-gate.py"
DEPLOY_SCRIPT = PROJECT_DIR / "scripts" / "deploy.sh"
GATES_DIR = PROJECT_DIR / "artifacts" / "gates"
SITE_URL = "https://truejoybirthing.com"

STAGES = ["queued", "build", "enrich", "verify_deploy", "video_outreach", "complete"]

# ── Ledger operations ────────────────────────────────────────────────────────

def load_ledger():
    with open(LEDGER_PATH) as f:
        return json.load(f)

def save_ledger(data):
    data["updated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with open(LEDGER_PATH, "w") as f:
        json.dump(data, f, indent=2)
    # Also update summary
    cities = data.get("cities", {})
    stage_counts = {}
    score_counts = {}
    for slug, info in cities.items():
        stage = info.get("stage", "unknown")
        stage_counts[stage] = stage_counts.get(stage, 0) + 1
        score = str(info.get("score", 0))
        score_counts[score] = score_counts.get(score, 0) + 1
    data["summary"] = {
        "total": len(cities),
        "complete": stage_counts.get("complete", 0),
        "in_progress": sum(1 for c in cities.values() if c.get("in_progress")),
        "blocked": stage_counts.get("blocked", 0),
        "scores": score_counts,
        "stages": stage_counts,
    }
    # Re-write with summary
    with open(LEDGER_PATH, "w") as f:
        json.dump(data, f, indent=2)

def get_city(ledger, slug):
    return ledger.get("cities", {}).get(slug)

def update_city(ledger, slug, updates):
    city = ledger.setdefault("cities", {}).setdefault(slug, {})
    city.update(updates)
    city["updated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return city

def add_event(ledger, event_type, slug, detail):
    events = ledger.setdefault("events", [])
    events.append({
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "type": event_type,
        "slug": slug,
        "detail": detail,
    })
    # Keep last 200 events
    if len(events) > 200:
        ledger["events"] = events[-200:]

# ── Gate operations ───────────────────────────────────────────────────────────

def run_gate(slug, stage):
    """Run preflight-stage-gate.py for a city/stage and return (passed, detail)."""
    print(f"\n{'='*60}")
    print(f"  GATE: {slug} / {stage}")
    print(f"{'='*60}")
    try:
        result = subprocess.run(
            ["python3", str(GATE_SCRIPT), slug, stage],
            capture_output=True, text=True, timeout=300,
            cwd=str(PROJECT_DIR)
        )
        print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        passed = result.returncode == 0
        return passed, result.stdout[-500:] if result.stdout else ""
    except subprocess.TimeoutExpired:
        print(f"  ❌ Gate timed out (300s)")
        return False, "Gate timed out"
    except Exception as e:
        print(f"  ❌ Gate error: {e}")
        return False, str(e)

def gate_file_passes(slug, stage):
    """Check if a gate file already exists and passed (without running)."""
    gate_file = GATES_DIR / f"{slug}-{stage}.json"
    if not gate_file.exists():
        return None  # No gate file
    try:
        with open(gate_file) as f:
            data = json.load(f)
        exit_code = data.get("exit_code")
        passed = data.get("passed")
        if exit_code is not None:
            return exit_code == 0
        if passed is not None:
            return passed
        return False
    except Exception:
        return False

# ── Deploy ───────────────────────────────────────────────────────────────────

def deploy(slug=None):
    """Run deploy.sh and return (success, output)."""
    print(f"\n{'='*60}")
    print(f"  DEPLOY{' — ' + slug if slug else ''}")
    print(f"{'='*60}")
    cmd = ["bash", str(DEPLOY_SCRIPT)]
    if slug:
        cmd.append(slug)
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True, timeout=600,
            cwd=str(PROJECT_DIR)
        )
        print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        return result.returncode == 0, result.stdout[-500:]
    except subprocess.TimeoutExpired:
        print("  ❌ Deploy timed out (600s)")
        return False, "Deploy timed out"
    except Exception as e:
        print(f"  ❌ Deploy error: {e}")
        return False, str(e)

# ── Live verification ─────────────────────────────────────────────────────────

def verify_live(slug):
    """Verify the city page is live and returns HTTP 200 with images."""
    url = f"{SITE_URL}/birth-support/{slug}/"
    print(f"\n  Verifying: {url}")
    try:
        result = subprocess.run(
            ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", url, "--max-time", "30"],
            capture_output=True, text=True, timeout=35
        )
        http_code = result.stdout.strip()
        if http_code == "200":
            print(f"  ✅ Live: HTTP {http_code}")
            return True
        else:
            print(f"  ❌ Live check failed: HTTP {http_code}")
            return False
    except Exception as e:
        print(f"  ❌ Live check error: {e}")
        return False

# ── Commands ─────────────────────────────────────────────────────────────────

def cmd_status(args):
    """Show pipeline status: ledger summary, non-complete cities, queue."""
    ledger = load_ledger()
    cities = ledger.get("cities", {})
    
    print(f"\n{'═'*60}")
    print(f"  TJB City Pipeline Status")
    print(f"{'═'*60}")
    print(f"  Ledger: {LEDGER_PATH}")
    print(f"  Updated: {ledger.get('updated_at', 'unknown')}")
    print(f"  Total cities: {len(cities)}")
    
    # Stage distribution
    stages = {}
    for info in cities.values():
        s = info.get("stage", "unknown")
        stages[s] = stages.get(s, 0) + 1
    print(f"\n  Stage distribution:")
    for stage in STAGES + ["blocked", "unknown"]:
        if stage in stages:
            print(f"    {stage}: {stages[stage]}")
    
    # Non-complete cities
    non_complete = [(s, i) for s, i in cities.items() if i.get("stage") != "complete"]
    if non_complete:
        non_complete.sort(key=lambda x: (STAGES.index(x[1].get("stage", "complete")) if x[1].get("stage") in STAGES else 99, -x[1].get("score", 0)))
        print(f"\n  Non-complete cities ({len(non_complete)}):")
        for slug, info in non_complete:
            stage = info.get("stage", "?")
            score = info.get("score", 0)
            in_prog = " 🔄" if info.get("in_progress") else ""
            blocked = f" [BLOCKED: {info.get('blocked_reason', '?')}]" if stage == "blocked" else ""
            print(f"    {slug}: stage={stage}, score={score}{in_prog}{blocked}")
    else:
        print(f"\n  ✅ All cities complete!")
    
    # Gate compliance for non-complete
    print(f"\n  Gate files in artifacts/gates/: {len(list(GATES_DIR.glob('*.json')))} files")
    print(f"{'═'*60}\n")

def cmd_queue(args):
    """Show cities that are queued (stage=queued) — the autonomous runner's targets."""
    ledger = load_ledger()
    cities = ledger.get("cities", {})
    queued = [(s, i) for s, i in cities.items() if i.get("stage") == "queued"]
    if not queued:
        print("\n  No queued cities. Add some with: add-city <slug> --city ... --state ... --pop ...")
        return
    queued.sort(key=lambda x: -x[1].get("score", 0))
    print(f"\n{'═'*60}")
    print(f"  Queued cities ({len(queued)}):")
    print(f"{'═'*60}")
    for slug, info in queued:
        print(f"  {slug}: {info.get('city', '?')}, {info.get('state', '?')} — score={info.get('score', 0)}, pop={info.get('population', '?')}")
    print()

def cmd_add_city(args):
    """Add a city to the ledger as queued."""
    ledger = load_ledger()
    cities = ledger.get("cities", {})
    if args.slug in cities:
        print(f"  ⚠️  City {args.slug} already in ledger (stage={cities[args.slug].get('stage')})")
        sys.exit(1)
    # Score based on population
    pop = args.pop or 0
    if pop >= 200000:
        score = 100
    elif pop >= 150000:
        score = 90
    elif pop >= 100000:
        score = 80
    else:
        score = 70
    
    city_data = {
        "slug": args.slug,
        "city": args.city,
        "state": args.state,
        "population": pop,
        "score": score,
        "stage": "queued",
        "hero": False,
        "og": False,
        "support": False,
        "hospitals": False,
        "hospital_count": 0,
        "doulas": False,
        "doula_count": 0,
        "video": False,
        "outreach": False,
        "placeholder": False,
        "in_progress": False,
        "started_at": "",
        "slot": "",
        "batch_id": "",
        "blocked_reason": None,
        "url": f"https://truejoybirthing.com/birth-support/{args.slug}/",
        "birth_center_count": 0,
        "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    cities[args.slug] = city_data
    add_event(ledger, "city_added", args.slug, f"Added {args.city}, {args.state} (pop {pop}) as queued")
    save_ledger(ledger)
    print(f"  ✅ Added {args.slug} ({args.city}, {args.state}) — score={score}, stage=queued")

def cmd_gate(args):
    """Run a stage gate for a city and update the ledger."""
    ledger = load_ledger()
    city = get_city(ledger, args.slug)
    if not city:
        print(f"  ❌ City {args.slug} not in ledger")
        sys.exit(1)
    
    passed, detail = run_gate(args.slug, args.stage)
    if passed:
        print(f"\n  ✅ Gate PASSED: {args.slug} / {args.stage}")
        # Advance stage if gate is for the current stage
        current_stage = city.get("stage", "queued")
        stage_idx = STAGES.index(args.stage) if args.stage in STAGES else -1
        current_idx = STAGES.index(current_stage) if current_stage in STAGES else -1
        if stage_idx > current_idx:
            update_city(ledger, args.slug, {"stage": args.stage})
            print(f"  → Advanced {args.slug} to stage: {args.stage}")
        add_event(ledger, "gate_passed", args.slug, f"{args.stage} gate passed")
    else:
        print(f"\n  ❌ Gate FAILED: {args.slug} / {args.stage}")
        add_event(ledger, "gate_failed", args.slug, f"{args.stage} gate failed: {detail[-200:]}")
    save_ledger(ledger)

def cmd_run_next(args):
    """Find the next queued city and claim it."""
    ledger = load_ledger()
    cities = ledger.get("cities", {})
    # Find next: stage=queued, highest score, not in_progress, not blocked
    candidates = [(s, i) for s, i in cities.items()
                   if i.get("stage") == "queued"
                   and not i.get("in_progress")
                   and not i.get("blocked_reason")]
    if not candidates:
        print("\n  No queued cities available. Add some with: add-city <slug> ...")
        cmd_status(args)
        return
    
    candidates.sort(key=lambda x: -x[1].get("score", 0))
    slug, info = candidates[0]
    print(f"\n  → Next city: {slug} ({info.get('city')}, {info.get('state')}) — score={info.get('score')}")
    
    # Claim it
    update_city(ledger, slug, {
        "in_progress": True,
        "started_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    })
    add_event(ledger, "city_claimed", slug, f"Claimed for pipeline run")
    save_ledger(ledger)
    print(f"  ✅ Claimed: {slug}")
    print(f"\n  Next steps for Kit:")
    print(f"    1. Spawn BUILD subagent for {slug}")
    print(f"    2. Run: python3 scripts/tjb-autonomous-runner.py gate {slug} build")
    print(f"    3. Spawn ENRICH subagent for {slug}")
    print(f"    4. Run: python3 scripts/tjb-autonomous-runner.py gate {slug} enrich")
    print(f"    5. Run: python3 scripts/tjb-autonomous-runner.py deploy {slug}")
    print(f"    6. Run: python3 scripts/tjb-autonomous-runner.py complete {slug}")

def cmd_deploy(args):
    """Deploy a city: run verify_deploy gate, then deploy.sh, then verify live."""
    ledger = load_ledger()
    city = get_city(ledger, args.slug)
    if not city:
        print(f"  ❌ City {args.slug} not in ledger")
        sys.exit(1)
    
    # Step 1: Run verify_deploy gate (full preflight)
    print(f"\n  Step 1: Verify+Deploy gate for {args.slug}")
    passed, detail = run_gate(args.slug, "verify_deploy")
    if not passed:
        print(f"  ❌ verify_deploy gate FAILED — not deploying")
        update_city(ledger, args.slug, {
            "stage": "stalled",
            "in_progress": False,
        })
        add_event(ledger, "deploy_gate_failed", args.slug, f"verify_deploy gate failed")
        save_ledger(ledger)
        sys.exit(1)
    
    # Step 2: Deploy
    print(f"\n  Step 2: Deploy {args.slug}")
    success, detail = deploy(args.slug)
    if not success:
        print(f"  ❌ Deploy FAILED")
        update_city(ledger, args.slug, {
            "stage": "stalled",
            "in_progress": False,
        })
        add_event(ledger, "deploy_failed", args.slug, f"deploy.sh failed: {detail[-200:]}")
        save_ledger(ledger)
        sys.exit(1)
    
    # Step 3: Verify live
    print(f"\n  Step 3: Verify live page")
    if verify_live(args.slug):
        update_city(ledger, args.slug, {
            "stage": "video_outreach",
            "in_progress": False,
        })
        add_event(ledger, "deployed", args.slug, f"Deployed and verified live")
        save_ledger(ledger)
        print(f"\n  ✅ {args.slug} deployed and verified — stage advanced to video_outreach")
    else:
        print(f"\n  ⚠️  {args.slug} deployed but live verification failed — check CDN cache")
        update_city(ledger, args.slug, {
            "stage": "verify_deploy",
            "in_progress": False,
        })
        add_event(ledger, "deployed_unverified", args.slug, f"Deployed but live check failed")
        save_ledger(ledger)

def cmd_complete(args):
    """Mark a city as complete in the ledger."""
    ledger = load_ledger()
    city = get_city(ledger, args.slug)
    if not city:
        print(f"  ❌ City {args.slug} not in ledger")
        sys.exit(1)
    
    # Verify gates
    vd_passes = gate_file_passes(args.slug, "verify_deploy")
    if vd_passes is not True:
        print(f"  ⚠️  {args.slug} has no passing verify_deploy gate. Complete anyway? (use --force to override)")
        if not args.force:
            sys.exit(1)
    
    update_city(ledger, args.slug, {
        "stage": "complete",
        "in_progress": False,
    })
    add_event(ledger, "city_completed", args.slug, f"Marked complete")
    save_ledger(ledger)
    print(f"  ✅ {args.slug} marked complete")

def cmd_block(args):
    """Block a city with a reason."""
    ledger = load_ledger()
    update_city(ledger, args.slug, {
        "stage": "blocked",
        "in_progress": False,
        "blocked_reason": args.reason,
    })
    add_event(ledger, "city_blocked", args.slug, args.reason)
    save_ledger(ledger)
    print(f"  🔒 {args.slug} blocked: {args.reason}")

def cmd_unblock(args):
    """Unblock a city, returning it to queued."""
    ledger = load_ledger()
    city = get_city(ledger, args.slug)
    if not city:
        print(f"  ❌ City {args.slug} not in ledger")
        sys.exit(1)
    update_city(ledger, args.slug, {
        "stage": "queued",
        "in_progress": False,
        "blocked_reason": None,
    })
    add_event(ledger, "city_unblocked", args.slug, f"Unblocked, returned to queued")
    save_ledger(ledger)
    print(f"  ✅ {args.slug} unblocked — stage=queued")

def cmd_reset(args):
    """Reset a city back to queued (undo stage progression)."""
    ledger = load_ledger()
    update_city(ledger, args.slug, {
        "stage": "queued",
        "in_progress": False,
        "started_at": "",
    })
    add_event(ledger, "city_reset", args.slug, f"Reset to queued")
    save_ledger(ledger)
    print(f"  ✅ {args.slug} reset to queued")

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(
        description="TJB Autonomous City Pipeline Runner",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Commands:
  status          Show pipeline status
  queue           Show queued cities
  add-city        Add a city to the ledger as queued
  run-next        Claim the next queued city
  gate            Run a stage gate for a city
  deploy          Deploy a city (gate + deploy.sh + verify live)
  complete        Mark a city as complete
  block           Block a city with a reason
  unblock         Unblock a city
  reset           Reset a city to queued

Stages: queued → build → enrich → verify_deploy → video_outreach → complete
        """
    )
    sub = ap.add_subparsers(dest="command", required=True)
    
    sub.add_parser("status", help="Show pipeline status")
    sub.add_parser("queue", help="Show queued cities")
    
    p_add = sub.add_parser("add-city", help="Add a city to the ledger")
    p_add.add_argument("slug", help="City slug (e.g., ontario-ca)")
    p_add.add_argument("--city", required=True, help="City name (e.g., Ontario)")
    p_add.add_argument("--state", required=True, help="State code (e.g., CA)")
    p_add.add_argument("--pop", type=int, help="Population (for scoring)")
    
    p_run_next = sub.add_parser("run-next", help="Claim the next queued city")
    
    p_gate = sub.add_parser("gate", help="Run a stage gate")
    p_gate.add_argument("slug")
    p_gate.add_argument("stage", choices=["build", "enrich", "verify_deploy", "video_outreach"])
    
    p_deploy = sub.add_parser("deploy", help="Deploy a city")
    p_deploy.add_argument("slug")
    
    p_complete = sub.add_parser("complete", help="Mark a city complete")
    p_complete.add_argument("slug")
    p_complete.add_argument("--force", action="store_true", help="Skip gate check")
    
    p_block = sub.add_parser("block", help="Block a city")
    p_block.add_argument("slug")
    p_block.add_argument("--reason", required=True, help="Block reason")
    
    p_unblock = sub.add_parser("unblock", help="Unblock a city")
    p_unblock.add_argument("slug")
    
    p_reset = sub.add_parser("reset", help="Reset a city to queued")
    p_reset.add_argument("slug")
    
    args = ap.parse_args()
    
    if args.command == "status":
        cmd_status(args)
    elif args.command == "queue":
        cmd_queue(args)
    elif args.command == "add-city":
        cmd_add_city(args)
    elif args.command == "run-next":
        cmd_run_next(args)
    elif args.command == "gate":
        cmd_gate(args)
    elif args.command == "deploy":
        cmd_deploy(args)
    elif args.command == "complete":
        cmd_complete(args)
    elif args.command == "block":
        cmd_block(args)
    elif args.command == "unblock":
        cmd_unblock(args)
    elif args.command == "reset":
        cmd_reset(args)

if __name__ == "__main__":
    main()