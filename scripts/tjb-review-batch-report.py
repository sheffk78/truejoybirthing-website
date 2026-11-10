#!/usr/bin/env python3
"""tjb-review-batch-report.py — Jeff-paced batch report for the 179-city review cohort.

2026-11-10 review-batch bridge (city-pipeline-review-2026-11-10 fix #2): Jeff
works through the desk-review cohort 5-10 at a time (his 11-03 pacing). This
tool emits the Markdown for the NEXT <=LIMIT unreleased cohort cities:

  selection order (stated in the report header):
    1. minted-pending first  — desk tasks already minted on Jeff's board
       (tjb-review-loop-state.json `minted`) that have no release recorded yet
    2. then parked cities alphabetically (the 169-city holding pen)
  Within group 1: alphabetical by slug.

Per city a compact card: city/state, live URL, built flag, hero/OG status,
placeholder flag, hospital/doula/video counts, outreach status, score — all
read from public/city-audit.json (cohort truth), NEVER invented.

Running tally at the end: released X / 179, plus a per-verdict breakdown.

Released tally rule (honest reconciliation of the two stores):
  - `released` rows in tjb-review-loop-state.json (the callers record a
    check-off there AFTER `review <slug> approved` exits 0), plus
  - cohort slugs with an `approved` verdict in
    ~/.hermes/state/tjb-review-verdicts.json (the engine ledger) that the
    loop-state store does not yet show (crash-window safety).
A city is "unreleased" only if neither store shows it released/approved.

Non-reviewable cohort cities (city-audit gate: stage=complete AND
outreach=true fails, e.g. killeen-tx stage=video_outreach outreach=false)
are SKIPPED from batches and listed in an exceptions line so nothing fails
silently — the engine's review command rejects them loudly either way.

Cohort & data paths (env-overridable for sandbox runs):
  TJB_REVIEW_LOOP_STATE  default ~/.hermes/state/tjb-review-loop-state.json
  TJB_PROJECT_DIR        default /Users/socializerender/.openclaw/workspace/
                         Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website
                         (audit: {TJB_PROJECT_DIR}/public/city-audit.json)
  TJB_REVIEW_LEDGER      default ~/.hermes/state/tjb-review-verdicts.json

Usage:
  python3 tjb-review-batch-report.py                    # next 10 to stdout
  python3 tjb-review-batch-report.py --limit 10 --out /path/to/report.md
  python3 tjb-review-batch-report.py --limit 10 --json  # machine-readable
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

DEFAULT_PROJECT_DIR = (
    "/Users/socializerender/.openclaw/workspace/Kit/life/brands/"
    "TrueJoyBirthing/projects/truejoybirthing-website"
)


def _flag(b) -> str:
    return "yes" if b else "NO"


def _status(b) -> str:
    return "ok" if b else "MISSING"


def load_json(path: Path, fallback=None):
    try:
        return json.loads(path.read_text())
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return fallback


def main() -> int:
    state_path = Path(os.environ.get(
        "TJB_REVIEW_LOOP_STATE",
        str(Path.home() / ".hermes/state/tjb-review-loop-state.json")))
    ledger_path = Path(os.environ.get(
        "TJB_REVIEW_LEDGER",
        str(Path.home() / ".hermes/state/tjb-review-verdicts.json")))
    project_dir = Path(os.environ.get("TJB_PROJECT_DIR", DEFAULT_PROJECT_DIR))
    audit_path = project_dir / "public" / "city-audit.json"

    state = load_json(state_path, {})
    ledger = load_json(ledger_path, {})
    audit = load_json(audit_path, None)
    if audit is None:
        print(f"FAILED: cohort truth file missing/unreadable: {audit_path}", file=sys.stderr)
        return 1
    if not isinstance(audit, list):
        print(f"FAILED: {audit_path} unexpected shape (list expected)", file=sys.stderr)
        return 1
    if not isinstance(state, dict) or not isinstance(ledger, dict):
        print("FAILED: loop-state / review-verdict ledger has unexpected shape",
              file=sys.stderr)
        return 1
    audit_by_slug = {e.get("slug"): e for e in audit if isinstance(e, dict)}

    minted: dict = state.get("minted") or {}
    parked: dict = state.get("parked") or {}
    released_state: dict = state.get("released") or {}
    cohort = list(dict.fromkeys(list(minted) + list(parked)))

    cohort_missing = [s for s in cohort if s not in audit_by_slug]
    not_reviewable = {
        s: audit_by_slug[s]
        for s in cohort
        if s in audit_by_slug
        and not (audit_by_slug[s].get("stage") == "complete"
                 and audit_by_slug[s].get("outreach") is True)
    }

    # Released tally: loop-state `released` rows recorded by the callers.
    # Shape note: tjb-review-task-feed / tjb-city-completion-monitor key rows
    # by BOARD-TASK slug with the city slug in meta["slug"]; tolerate legacy
    # rows keyed directly by city slug (no meta.slug -> fall back to the key).
    released_from_state = set()
    for task_key, meta in released_state.items():
        if not isinstance(meta, dict) or meta.get("ok") is False:
            continue
        released_from_state.add(meta.get("slug") or task_key)
    # Crash-window: engine-ledger approved verdicts not yet in loop-state.
    verdicts = ledger.get("verdicts", []) if isinstance(ledger, dict) else []
    ledger_approved = {v.get("slug") for v in verdicts if isinstance(v, dict)
                       and v.get("verdict") == "approved" and v.get("slug")}
    ledger_rework = {v.get("slug") for v in verdicts if isinstance(v, dict)
                     and v.get("verdict") in ("changes", "sent-back") and v.get("slug")}
    released_total_slugs = released_from_state | ledger_approved
    released_in_cohort = [s for s in cohort if s in released_total_slugs]

    reviewable = [s for s in cohort
                  if s not in released_total_slugs and s not in not_reviewable]
    minted_pending = sorted(s for s in reviewable if s in minted)
    parked_alpha = sorted(s for s in reviewable if s in parked)

    try:
        limit = int(os.environ.get("LIMIT", "10"))
    except ValueError:
        limit = 10
    for i, a in enumerate(sys.argv):
        if a == "--limit" and i + 1 < len(sys.argv):
            try:
                limit = int(sys.argv[i + 1])
            except ValueError:
                print("FAILED: --limit expects an integer", file=sys.stderr)
                return 1
    as_json = "--json" in sys.argv
    out_path = None
    if "--out" in sys.argv:
        i = sys.argv.index("--out")
        if i + 1 < len(sys.argv):
            out_path = sys.argv[i + 1]
    batch = (minted_pending + parked_alpha)[:limit]

    def card(slug: str) -> str:
        e = audit_by_slug[slug]
        hero = _status(e.get("hero"))
        hero_line = hero + (f" ({e.get('hero_issue')})" if e.get("hero_issue") else "")
        lines = [
            f"### {e.get('city') or slug}, {e.get('state') or ''} — `{slug}`",
            f"- URL: {e.get('url') or '(missing)'}",
            f"- Built: {_flag(e.get('built'))} ({e.get('build_status') or '?'}) · Score: {e.get('score')}",
            f"- Hero: {hero_line} · OG: {_status(e.get('og'))} · Support: {_status(e.get('support'))}",
            f"- Placeholder: {e.get('placeholder')}",
            f"- Hospitals: {e.get('hospital_count')} ({_status(e.get('hospitals'))}) · "
            f"Doulas: {e.get('doula_count')} ({_status(e.get('doulas'))}) · Video: {_flag(e.get('video'))}",
            f"- Outreach: {_status(e.get('outreach'))} · Audit stage: {e.get('stage')}",
            f"- Desk task: {'minted (on board)' if slug in minted else 'parked (not yet on board)'}"
            + (f" · prior rework verdict recorded: {', '.join(sorted(v for v in ledger_rework if v == slug))}"
               if slug in ledger_rework else ""),
        ]
        return "\n".join(lines)

    rel = len(released_in_cohort)
    if as_json:
        payload = {
            "cohort_size": len(cohort),
            "batch": batch,
            "order": "minted-pending (alphabetical) first, then parked (alphabetical)",
            "tally": {
                "released": rel,
                "total": len(cohort),
                "released_from_loop_state": sorted(released_from_state & set(cohort)),
                "approved_via_engine_ledger_only": sorted(
                    (released_total_slugs - released_from_state) & set(cohort)),
                "rework_verdicts_recorded": sorted(ledger_rework & set(cohort)),
            },
            "minted_pending": minted_pending,
            "parked_alpha": parked_alpha,
            "not_reviewable": {s: {"stage": audit_by_slug[s].get("stage"),
                                   "outreach": audit_by_slug[s].get("outreach")}
                               for s in sorted(not_reviewable)},
            "cohort_missing_from_audit": cohort_missing,
        }
        text = json.dumps(payload, indent=2)
    else:
        parts = [
            "# TJB City Review — Desk Batch (next "
            f"{min(limit, len(minted_pending) + len(parked_alpha))} of {len(cohort)})",
            "",
            f"Generated by scripts/tjb-review-batch-report.py — cohort "
            f"{len(cohort)} cities (minted {len(minted)} + parked {len(parked)}), "
            f"desk pacing ≤{limit} per batch (Jeff 11-03: 5-10 at a time).",
            "",
            "**Selection order:** minted-pending first (alphabetical by slug), "
            "then parked cities (alphabetical by slug).",
            "",
        ]
        if batch:
            parts.append("## This batch")
            parts.append("")
            parts.append("\n\n".join(card(s) for s in batch))
            parts.append("")
        else:
            parts.append("No unreleased cohort cities left — all done.")
            parts.append("")
        parts.append("## Running tally")
        parts.append("")
        parts.append(f"- **Released {rel} / {len(cohort)}**"
                     f" (loop-state released: {len(released_from_state & set(cohort))};"
                     f" approved via engine ledger only:"
                     f" {len((released_total_slugs - released_from_state) & set(cohort))};"
                     f" rework verdicts held: {len(ledger_rework & set(cohort))})")
        parts.append(f"- Remaining reviewable after this batch: "
                     f"{len(minted_pending) + len(parked_alpha) - len(batch)}")
        if ledger_rework & set(cohort):
            parts.append(f"- Rework verdicts recorded (outreach NOT released): "
                         f"{', '.join(sorted(ledger_rework & set(cohort)))}")
        skipped_bits = []
        if cohort_missing:
            skipped_bits.append(f"{len(cohort_missing)} cohort slugs missing from "
                                f"city-audit.json")
        if not_reviewable:
            det = "; ".join(
                f"{s} (stage={audit_by_slug[s].get('stage')}, outreach={audit_by_slug[s].get('outreach')})"
                for s in sorted(not_reviewable)[:5])
            more = "" if len(not_reviewable) <= 5 else f" … +{len(not_reviewable) - 5} more"
            skipped_bits.append(f"not reviewable (skipped, check-off will fail): {det}{more}")
        parts.append(f"- Exceptions: {'; '.join(skipped_bits) if skipped_bits else 'none'}")
        text = "\n".join(parts).rstrip() + "\n"

    if out_path:
        out = Path(out_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(text)
        print(f"batch report written: {out} ({len(batch)} cities, "
              f"released {rel}/{len(cohort)})", file=sys.stderr)
    else:
        print(text, end="" if text.endswith("\n") else "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
