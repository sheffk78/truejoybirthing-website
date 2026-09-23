#!/usr/bin/env python3
"""TJB New-City Seeder — feeds the autonomous city worker.

Root cause fixed (2026-09-23, Phase 0 of the path-to-500 plan):
The Autonomous City Worker cron only UPGRADES existing cities
(probe-city-candidates.py scans cities.ts). Nothing ever seeded NEW
cities from city-priority-list.csv, so "5 city pages/day" never ran —
actual output was ~0.4/day. This script deterministically seeds the
next N not-built cities into the pipeline state machine so the existing
worker cron picks them up automatically.

Usage:
  python3 scripts/tjb-seed-new-cities.py [--count N] [--dry-run]

Selection logic:
  - city-priority-list.csv rows with build_status=not-built
  - skip slugs already in cities.ts or already having a pipeline state
  - skip tiers other than sweet-spot/mid (Jeff's original criteria:
    50k-250k population, winnable SERPs)
  - prefer higher population within tier; max 2 cities per state per batch
  - init each via tjb-pipeline-state.py init (which probes initial stage)
"""
import argparse
import csv
import json
import os
import re
import subprocess
import sys
from collections import Counter
from datetime import datetime, timezone

REPO = os.path.dirname(os.path.abspath(__file__)) + "/.."
CITIES_TS = os.path.join(REPO, "src/data/cities.ts")
PRIORITY_CSV = os.path.expanduser(
    "~/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/work/city-priority-list.csv"
)
STATES_DIR = os.path.expanduser(
    "~/.hermes/skills/productivity/tjb-city-orchestrator/states"
)
STATE_SCRIPT = os.path.join(REPO, "scripts/tjb-pipeline-state.py")
SEED_LOG = os.path.expanduser(
    "~/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/work/seed-log.jsonl"
)
ALLOWED_TIERS = {"sweet-spot", "mid"}


def existing_slugs():
    src = open(CITIES_TS).read()
    return set(re.findall(r"slug:\s*['\"]([a-z0-9-]+)['\"]", src))


def state_slugs():
    if not os.path.isdir(STATES_DIR):
        return set()
    return {f[:-5] for f in os.listdir(STATES_DIR) if f.endswith(".json")}


def pick_candidates(count):
    rows = list(csv.DictReader(open(PRIORITY_CSV)))
    notbuilt = [r for r in rows if r.get("build_status") == "not-built"]
    notbuilt.sort(key=lambda r: -float(r.get("population") or 0))
    taken = existing_slugs() | state_slugs()
    picked, per_state = [], Counter()
    for r in notbuilt:
        if len(picked) >= count:
            break
        tier = (r.get("tier") or "").strip()
        if tier not in ALLOWED_TIERS:
            continue
        slug = (r.get("slug") or "").strip()
        st = (r.get("state_abbr") or "").strip()
        if not slug or slug in taken or per_state[st] >= 2:
            continue
        picked.append(
            {
                "slug": slug,
                "city": r.get("city"),
                "state": st,
                "population": r.get("population"),
                "tier": tier,
            }
        )
        taken.add(slug)
        per_state[st] += 1
    return picked


def init_city(slug):
    r = subprocess.run(
        ["python3", STATE_SCRIPT, "init", slug],
        capture_output=True,
        text=True,
        timeout=120,
        cwd=REPO,
    )
    return r.returncode == 0, (r.stdout + r.stderr).strip()[-300:]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--count", type=int, default=5)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    picked = pick_candidates(args.count)
    stamp = datetime.now(timezone.utc).isoformat()

    if args.dry_run:
        print(json.dumps({"would_seed": picked}, indent=1))
        return

    results = []
    for c in picked:
        ok, msg = init_city(c["slug"])
        c["init_ok"] = ok
        c["init_msg"] = msg
        results.append(c)
        print(f"{'OK ' if ok else 'FAIL'} {c['slug']}  {msg[:120]}")

    log_entry = {"seeded_at": stamp, "count": len(results), "cities": results}
    os.makedirs(os.path.dirname(SEED_LOG), exist_ok=True)
    with open(SEED_LOG, "a") as f:
        f.write(json.dumps(log_entry) + "\n")
    ok_n = sum(1 for r in results if r["init_ok"])
    print(f"Seeded {ok_n}/{len(results)} new cities at {stamp}")


if __name__ == "__main__":
    main()