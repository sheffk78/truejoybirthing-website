#!/usr/bin/env python3
"""
TJB Stage Gate Checker — Runs stage-specific preflight gate subsets.

Instead of running ALL 55 preflight gates at every stage, this script runs only
the gates relevant to the current pipeline stage. This fixes the structural
problem where Gate 1 (BUILD) couldn't pass because preflight checked enrichment
gates that hadn't run yet.

Usage:
    python3 preflight-stage-gate.py {slug} {stage}

Stages and their gate subsets:
    build:          G1, G2, G3, G4, G8, G21, G25, G29, G36, G37, G38, G40, G41, G42, G58
    enrich:         G10, G19, G20, G27, G35, G39, G57, G59, P11, A12, S6, S7, S8, V1
    verify_deploy:  ALL gates (full preflight)
    video_outreach: G9, G18, G22, G23, G24, G26, G53, G54, G55, G56

Exit code 0 = all stage gates pass. Exit code 1 = at least one failed.
"""

import argparse
import os
import subprocess
import sys
import json
import re
from pathlib import Path

PROJECT_DIR = os.environ.get("TJB_PROJECT_DIR", "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website")
PREFLIGHT_SCRIPT = Path(PROJECT_DIR) / "scripts" / "preflight.ts"

# Gate subsets per stage (using ACTUAL gate IDs from preflight.ts)
STAGE_GATES = {
    "build": [
        "G1",   # Working directory is canonical project root
        "G2",   # validate-city-data.ts exits 0
        "G3",   # npm run build exits 0
        "G4",   # OG image exists on disk, >=10KB, decodable
        "G8",   # Hero is pregnant silhouette, not skyline
        "G21",  # Hero, OG, YT thumbnail are distinct files
        "G25",  # Hero image aspect ratio is 3:2
        "G29",  # OG image is real photo, not gradient
        "G36",  # Hospital entries have complete data
        "G37",  # Provider count meets population tier minimums
        "G38",  # Hero filename contains city slug
        "G40",  # OG filename contains city slug
        "G41",  # Hero file size <=80KB
        "G42",  # Hero 600w srcset variant exists
        "G58",  # Hero has no black bars / letterboxing
    ],
    "enrich": [
        "G10",  # Provider descriptions are specific, not placeholders
        "G19",  # Provider/hospital photos exist on disk, >=1KB
        "G20",  # Hospital/birth center thumbnails exist, >=1KB
        "G27",  # Provider credentials are specific
        "G35",  # Hospital thumbnails >=15KB, real photos
        "G39",  # No generic placeholder names
        "G57",  # No providers with empty photo field
        "G59",  # Hospital entries have website URLs
        "P11",  # Hospital images are landscape, not square
        "A12",  # serviceArea is string array, not plain string
        "S6",   # Every provider has costRange field
        "S7",   # medicaidNote starts with "Yes -" or "No -"
        "S8",   # No "Contact for pricing" in costRange
        "V1",   # No phantom verified badges
    ],
    "verify_deploy": None,  # None = run ALL gates (full preflight)
    "video_outreach": [
        "G9",   # Support scene is city-specific, not generic
        "G18",  # YouTube embed returns HTTP 200
        "G22",  # YouTube thumbnail is branded (1280px custom)
        "G23",  # YouTube thumbnail uses same hero image as page
        "G24",  # Support scene is unique to this city
        "G26",  # Support scene aspect ratio is 16:9
        "G53",  # Video scene data matches page data
        "G54",  # Support scene not shared across cities
        "G55",  # No empty videoId in video-embeds.ts
        "G56",  # Hospital thumbnails not shared across cities
    ],
}


def local_integrity_gates(slug: str, stage: str) -> dict:
    """Hard local checks; missing city assets must never be downgraded to SKIP."""
    if stage != "build":
        return {}
    city_file = Path(PROJECT_DIR) / "src" / "data" / "cities.ts"
    text = city_file.read_text(errors="replace") if city_file.exists() else ""
    marker = f'"{slug}": {{'
    start = text.find(marker)
    if start < 0:
        return {"LOCAL_CITY_ENTRY": {"status": "FAIL", "detail": "city entry missing"}}
    tail = text[start + len(marker):]
    nxt = re.search(r'\n\s*"[a-z][a-z-]+-[a-z]{2}":\s*\{', tail)
    block = text[start:start + len(marker) + nxt.start()] if nxt else text[start:]
    results = {}
    fields = {
        "heroImage": r'heroImage:\s*["\']([^"\']+)',
        "ogImage": r'ogImage:\s*["\']([^"\']+)',
        "supportSceneImage": r'supportSceneImage:\s*["\']([^"\']+)',
    }
    for field, pattern in fields.items():
        m = re.search(pattern, block)
        if not m:
            results[f"LOCAL_{field}"] = {"status": "FAIL", "detail": f"{field} missing"}
            continue
        ref = m.group(1).split("?")[0]
        local_ref = ref.split("/images/", 1)[-1] if "/images/" in ref else ref.lstrip("/")
        path = Path(PROJECT_DIR) / "public" / "images" / local_ref
        if slug not in Path(ref).name:
            results[f"LOCAL_{field}"] = {"status": "FAIL", "detail": f"wrong-city reference: {ref}"}
        elif not path.exists():
            results[f"LOCAL_{field}"] = {"status": "FAIL", "detail": f"missing asset: {ref}"}
        else:
            results[f"LOCAL_{field}"] = {"status": "PASS", "detail": ref}
    cross_city = [ref for ref in re.findall(r'photo:\s*["\']([^"\']+)', block) if ref and slug not in Path(ref).name and "placeholder" not in Path(ref).name]
    if cross_city:
        results["LOCAL_PROVIDER_PHOTOS"] = {"status": "FAIL", "detail": f"cross-city provider photo: {cross_city[0]}"}
    return results


def run_full_preflight(slug: str) -> dict:
    """Run the full preflight.ts and return structured results."""
    try:
        result = subprocess.run(
            ["npx", "tsx", "scripts/preflight.ts", slug],
            capture_output=True, text=True, timeout=180,
            cwd=PROJECT_DIR
        )
        return {
            "exit_code": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr,
        }
    except subprocess.TimeoutExpired:
        return {"exit_code": 1, "stdout": "", "stderr": "Preflight timed out (180s)"}
    except Exception as e:
        return {"exit_code": 1, "stdout": "", "stderr": str(e)}


def parse_preflight_gates(stdout: str) -> dict:
    """Parse preflight output to extract per-gate pass/fail status.

    Actual preflight.ts output format (line 2167 of preflight.ts):
      ✅ G1: detail message
      ❌ G2: detail message
      ⏭ G3: detail message

    The icon (✅/❌/⏭) maps to PASS/FAIL/SKIP respectively.
    Gate IDs are alphanumeric: G1, G59, S6, P11, A12, V1, A4b, etc.
    """
    ICON_TO_STATUS = {"✅": "PASS", "❌": "FAIL", "⏭": "SKIP"}
    gates = {}
    for line in stdout.split("\n"):
        line = line.strip()
        # Match lines like:  ✅ G1: detail
        # Strip leading whitespace, check for emoji icon prefix
        for icon, status in ICON_TO_STATUS.items():
            if line.startswith(icon):
                rest = line[len(icon):].strip()
                # rest is now "G1: detail message"
                if ":" in rest:
                    gate_id = rest[:rest.index(":")].strip()
                    detail = rest[rest.index(":") + 1:].strip()
                else:
                    gate_id = rest
                    detail = ""
                # Validate gate ID format: letter prefix + digits, optional letter suffix
                # (G1, G59, S6, P11, A12, V1, A4b) — reject words like "SOME"
                if gate_id and re.match(r'^[A-Z]+\d+[a-z]?$', gate_id):
                    # Only keep first occurrence per gate (preflight may emit
                    # multiple FAIL lines for the same gate ID with different details)
                    if gate_id not in gates:
                        gates[gate_id] = {"status": status, "detail": detail}
                    elif status == "FAIL" and gates[gate_id]["status"] != "FAIL":
                        # A FAIL overrides a previous non-FAIL for the same gate
                        gates[gate_id] = {"status": status, "detail": detail}
                break
    return gates


def run_stage_gates(slug: str, stage: str) -> dict:
    """Run only the gates for the specified stage."""
    gate_subset = STAGE_GATES.get(stage)
    local_gates = local_integrity_gates(slug, stage)
    local_failures = [k for k, v in local_gates.items() if v["status"] == "FAIL"]
    if local_failures:
        print(f"LOCAL HARD GATES FAILED: {', '.join(local_failures)}")
        for key, value in local_gates.items():
            print(f"  {'❌' if value['status'] == 'FAIL' else '✅'} [{key}] {value['detail']}")
        return {"stage": stage, "mode": "local_integrity", "gate_subset": list(local_gates), "results": local_gates, "passed": 0, "failed": len(local_failures), "skipped": 0, "exit_code": 1}

    if gate_subset is None:
        # Full preflight (verify_deploy stage)
        print(f"Running FULL preflight for {slug} (stage: {stage})...")
        result = run_full_preflight(slug)
        print(result["stdout"])
        return {
            "stage": stage,
            "mode": "full_preflight",
            "exit_code": result["exit_code"],
            "all_gates": parse_preflight_gates(result["stdout"]),
        }

    # Stage-specific: run full preflight but only report relevant gates
    print(f"Running {len(gate_subset)} gates for {slug} (stage: {stage})...")
    result = run_full_preflight(slug)

    all_gates = parse_preflight_gates(result["stdout"])
    # Fail closed: a missing/unparseable preflight result is not a pass.
    if result["exit_code"] != 0:
        return {
            "stage": stage,
            "mode": "preflight_failure",
            "gate_subset": gate_subset,
            "results": {},
            "passed": 0,
            "failed": 1,
            "skipped": 0,
            "exit_code": 1,
            "detail": result.get("stderr", "preflight exited non-zero"),
        }
    if not all_gates:
        return {
            "stage": stage,
            "mode": "preflight_unparseable",
            "gate_subset": gate_subset,
            "results": {},
            "passed": 0,
            "failed": 1,
            "skipped": 0,
            "exit_code": 1,
            "detail": "preflight returned no parseable gate results",
        }

    # Filter to only the stage's gates
    stage_results = {}
    passed = 0
    failed = 0
    skipped = 0

    for gate_id in gate_subset:
        gate_result = all_gates.get(gate_id, {"status": "SKIP", "detail": "Gate not found in preflight output"})
        stage_results[gate_id] = gate_result
        status = gate_result.get("status", "SKIP")
        if status == "PASS":
            passed += 1
        elif status == "FAIL":
            failed += 1
        else:
            skipped += 1

    # Print stage gate results
    print(f"\n{'='*60}")
    print(f"Stage: {stage} | Gates: {len(gate_subset)} | PASS: {passed} | FAIL: {failed} | SKIP: {skipped}")
    print(f"{'='*60}")
    for gate_id in gate_subset:
        gate_result = stage_results[gate_id]
        status = gate_result.get("status", "SKIP")
        detail = gate_result.get("detail", "")
        icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⏭️"
        print(f"  {icon} [{gate_id}] {status}: {detail[:80]}")

    exit_code = 0 if failed == 0 else 1
    return {
        "stage": stage,
        "mode": "stage_subset",
        "gate_subset": gate_subset,
        "results": stage_results,
        "passed": passed,
        "failed": failed,
        "skipped": skipped,
        "exit_code": exit_code,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug", nargs="?")
    ap.add_argument("stage_pos", nargs="?")
    ap.add_argument("--city", dest="city")
    ap.add_argument("--stage", dest="stage_opt")
    args = ap.parse_args()
    slug = args.city or args.slug
    stage = args.stage_opt or args.stage_pos
    if not slug or not stage:
        print("Usage: preflight-stage-gate.py {slug} {stage} OR --city {slug} --stage {stage}")
        sys.exit(1)

    if stage not in STAGE_GATES:
        print(f"Unknown stage: {stage}. Valid: {list(STAGE_GATES.keys())}")
        sys.exit(1)

    result = run_stage_gates(slug, stage)

    # Output JSON summary
    print(f"\n{json.dumps({k: v for k, v in result.items() if k != 'all_gates'}, indent=2)}")
    sys.exit(result["exit_code"])


if __name__ == "__main__":
    main()
