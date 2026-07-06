#!/usr/bin/env python3
"""
TJB Cross-City Failure Aggregation — reads all state files and detects patterns.

Usage:
  python3 scripts/tjb-failure-aggregate.py           # Print report
  python3 scripts/tjb-failure-aggregate.py --update   # Auto-append patterns to recurring-mistakes-block.md

Detects:
  - Stage failure frequency (which stages fail most)
  - Blocked cities needing manual intervention
  - Stuck cities (no update in 24h+)
  - Retry patterns per city
  - Recurring failures (same stage failing across 3+ cities = systemic)
"""
import sys, os, json, glob
from datetime import datetime, timedelta

STATE_DIR = os.path.expanduser(
    "~/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/states"
)
MISTAKES_FILE = os.path.expanduser(
    "~/.hermes/skills/productivity/tjb-city-orchestrator/references/recurring-mistakes-block.md"
)


def load_all_states():
    """Load all state files."""
    states = []
    if not os.path.isdir(STATE_DIR):
        return states
    for f in sorted(glob.glob(os.path.join(STATE_DIR, "*.json"))):
        try:
            with open(f) as fh:
                states.append(json.load(fh))
        except (json.JSONDecodeError, IOError):
            pass
    return states


def analyze(states):
    """Analyze states and return a report dict."""
    if not states:
        return {"total_cities": 0, "message": "No state files found."}

    report = {
        "total_cities": len(states),
        "complete": 0,
        "in_progress": 0,
        "blocked": 0,
        "stuck": 0,
        "stage_counts": {},
        "stage_failures": {},
        "blocked_cities": [],
        "stuck_cities": [],
        "recurring_failures": [],
    }

    now = datetime.now()
    cutoff = now - timedelta(hours=24)

    for s in states:
        stage = s.get("stage", "unknown")
        
        if stage == "complete":
            report["complete"] += 1
            continue
        
        report["in_progress"] += 1
        report["stage_counts"][stage] = report["stage_counts"].get(stage, 0) + 1
        
        # Check blocked
        if s.get("consecutive_same_stage", 0) >= 3:
            report["blocked"] += 1
            report["blocked_cities"].append({
                "slug": s["slug"],
                "stage": stage,
                "attempts": s["consecutive_same_stage"],
            })
        
        # Check stuck (no update in 24h)
        updated = s.get("updated_at", "")
        if updated:
            try:
                update_time = datetime.fromisoformat(updated)
                if update_time < cutoff:
                    report["stuck"] += 1
                    report["stuck_cities"].append({
                        "slug": s["slug"],
                        "stage": stage,
                        "last_update": updated,
                    })
            except ValueError:
                pass
        
        # Track stage failures (non-complete, non-blocked)
        if stage != "complete" and s.get("consecutive_same_stage", 0) < 3:
            report["stage_failures"][stage] = report["stage_failures"].get(stage, 0) + 1
    
    # Detect recurring failures (same stage failing across 3+ cities)
    for stage, count in report["stage_failures"].items():
        if count >= 3:
            report["recurring_failures"].append({
                "stage": stage,
                "city_count": count,
                "severity": "systemic",
            })
    
    return report


def print_report(report):
    """Print human-readable report."""
    if report.get("message"):
        print(report["message"])
        return

    print(f"\n{'='*60}")
    print(f"TJB Pipeline Aggregation Report")
    print(f"{'='*60}")
    print(f"\nTotal cities: {report['total_cities']}")
    print(f"  Complete: {report['complete']}")
    print(f"  In progress: {report['in_progress']}")
    print(f"  Blocked: {report['blocked']}")
    print(f"  Stuck (>24h): {report['stuck']}")

    if report["stage_counts"]:
        print(f"\n--- Stage Distribution ---")
        for stage, count in sorted(report["stage_counts"].items()):
            print(f"  {stage}: {count}")

    if report["blocked_cities"]:
        print(f"\n--- Blocked Cities (manual intervention) ---")
        for c in report["blocked_cities"]:
            print(f"  {c['slug']}: stuck at {c['stage']} ({c['attempts']} attempts)")

    if report["stuck_cities"]:
        print(f"\n--- Stuck Cities (>24h no update) ---")
        for c in report["stuck_cities"]:
            print(f"  {c['slug']}: at {c['stage']}, last update {c['last_update']}")

    if report["recurring_failures"]:
        print(f"\n--- Recurring Failures (systemic) ---")
        for f in report["recurring_failures"]:
            print(f"  {f['stage']}: failing across {f['city_count']} cities")
    else:
        print(f"\n--- Recurring Failures ---")
        print(f"  None detected.")


def update_mistakes(report):
    """Auto-append recurring failure patterns to the mistakes block."""
    if not report.get("recurring_failures"):
        print("\nNo recurring failures to add.")
        return

    if not os.path.exists(MISTAKES_FILE):
        print(f"Mistakes file not found: {MISTAKES_FILE}")
        return

    with open(MISTAKES_FILE) as f:
        content = f.read()

    today = datetime.now().strftime("%Y-%m-%d")
    new_lines = []
    
    for f in report["recurring_failures"]:
        line = f"- [AUTO-DETECTED {today}] {f['stage']} failing across {f['city_count']} cities."
        if line not in content:
            new_lines.append(line)
    
    if not new_lines:
        print("\nAll patterns already in mistakes block.")
        return

    # Replace the auto-detected section
    if "## Auto-Detected Patterns" in content:
        # Find the section and replace its body
        parts = content.split("## Auto-Detected Patterns")
        before = parts[0]
        after = parts[1] if len(parts) > 1 else ""
        # Remove old auto-detected lines
        new_section = "## Auto-Detected Patterns\n" + "\n".join(new_lines) + "\n"
        # Keep anything after the auto-detected section that isn't part of it
        new_content = before + new_section
        with open(MISTAKES_FILE, "w") as f:
            f.write(new_content)
    else:
        # Append the section
        with open(MISTAKES_FILE, "a") as f:
            f.write(f"\n\n## Auto-Detected Patterns\n{chr(10).join(new_lines)}\n")
    
    print(f"\nAdded {len(new_lines)} pattern(s) to recurring-mistakes-block.md")


def main():
    states = load_all_states()
    report = analyze(states)
    print_report(report)
    
    if "--update" in sys.argv or "--update-mistakes" in sys.argv:
        update_mistakes(report)


if __name__ == "__main__":
    main()