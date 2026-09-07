#!/usr/bin/env python3
"""TJB Phase 5 harness — audit-to-library.py: the continuous audit loop (Layer 7).

Live-page outcomes (completion-monitor QC holds, weekly SEO audits, SiteGuru
declines, GSC drops) flow INTO the failure library through triage. Every
confirmed finding is classified:

  checker-bug  — the page is right, the check was wrong → fix the checker,
                 seed a regression case that would have caught the bug
  page-defect  — the check is right, the page is wrong → the gate/eval that
                 should have caught it gets a replay case
  not-actionable — audit noise (e.g. structural similarity of template city
                 pages), recorded but not seeded

Commands:
  triage-qc                  # triage current completion-monitor holds
  weekly --file <audit.md>   # triage the weekly SEO audit report
  confirm <triage.json> <index> --id <case-id>
                             # seed a confirmed finding into the failure library
  cadence                    # print the standing cadence (who runs what, when)

Exit codes: 0 ok | 1 findings needing Kit decision | 3 fatal input.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
MONITOR_SCRIPT = Path.home() / ".hermes" / "scripts" / "tjb-city-completion-monitor.py"
HOLD_STATE = Path.home() / ".hermes" / "state" / "tjb-city-completion-hold.json"
TRIAGE_DIR = PROJECT_DIR / "artifacts" / "audit"
LIB_SCRIPT = PROJECT_DIR / "scripts" / "failure-library.py"


def fail(code: int, payload: dict) -> int:
    print(json.dumps(payload, indent=2))
    return code


def load_monitor():
    import importlib.util
    spec = importlib.util.spec_from_file_location("tjb_qc_monitor", str(MONITOR_SCRIPT))
    assert spec is not None and spec.loader is not None
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def triage_qc() -> int:
    """For each held city: decide checker-bug vs page-defect with hard evidence."""
    mon = load_monitor()
    holds = json.loads(HOLD_STATE.read_text()) if HOLD_STATE.exists() else {}
    if not holds:
        return fail(0, {"action": "triage_qc", "holds": 0,
                        "message": "no held cities — nothing to triage"})
    findings = []
    for slug, info in sorted(holds.items()):
        url = info.get("url") or f"https://truejoybirthing.com/birth-support/{slug}/"
        status, html = mon.fetch_live(url)
        page_ok, page_reason = mon.qc_live_page(slug, url)
        # Checker-bug signal: the raw rendered text contains the city name in
        # ANY punctuation/spacing form, but the strict check still failed.
        city_word = slug.rsplit("-", 1)[0].replace("-", " ").split(" ")[0]
        comma_form = re.search(re.escape(city_word) + r"\s*,\s*[A-Z]{2}", html or "")
        if (not page_ok) and comma_form and "city name not found" in page_reason:
            classification = "checker-bug"
            fix = ("monitor visible_text lacks entity/comma normalization — "
                   "fix monitor, seed qc_live regression case")
        elif not page_ok:
            classification = "page-defect"
            fix = "gate/eval that should own this class gets a replay case"
        else:
            classification = "transient"
            fix = "QC now passes — release the hold (re-run monitor)"
        findings.append({
            "slug": slug, "url": url,
            "held_reason": info.get("reason"),
            "qc_ok": page_ok, "qc_reason": page_reason,
            "http": status,
            "comma_form_present": bool(comma_form),
            "classification": classification,
            "suggested_action": fix,
        })
    TRIAGE_DIR.mkdir(parents=True, exist_ok=True)
    out = TRIAGE_DIR / f"qc-triage-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    out.write_text(json.dumps({"triaged_at": datetime.now().astimezone().isoformat(timespec="seconds"),
                               "findings": findings}, indent=2))
    needs_decision = any(f["classification"] == "page-defect" for f in findings)
    return fail(1 if needs_decision else 0, {
        "action": "triage_qc",
        "holds": len(holds),
        "findings": findings,
        "triage_file": str(out),
        "message": ("QC triage complete — findings in " + str(out) +
                    (" — PAGE-DEFECT present: confirm into library after fix" if needs_decision else
                     " — no page defects (checker bugs / transients resolved)")),
    })


def weekly(file: str) -> int:
    """Extract actionable findings from the weekly SEO audit markdown.
    Mechanical extraction + classification hints; judgment stays with Kit."""
    p = Path(file)
    if not p.exists():
        return fail(3, {"error": f"audit file missing: {file}"})
    text = p.read_text()
    sections = {
        "tier1_fixed": len(re.findall(r"^\d+\.\s", text, re.M)),
        "p_flags": re.findall(r"^### (P\d+: .+)$", text, re.MULTILINE),
        "opportunities": len(re.findall(r'^\d+\.\s+\*"', text, re.MULTILINE)),
    }
    harness_relevant = []
    # Classes the harness owns (per the plan): content defects the gates/evals
    # should have caught. Pure crawl/index timing is not harness work.
    if re.search(r"broken link", text, re.IGNORECASE) and not re.search(r"Broken links: \*\*0\*\*", text):
        harness_relevant.append("broken internal links — check nearbyCities/hospital URL gates")
    if re.search(r"skeleton|placeholder", text, re.IGNORECASE):
        harness_relevant.append("skeleton placeholder text visible — G72-class, seed if new")
    if re.search(r"noindex meta tag", text, re.IGNORECASE):
        harness_relevant.append("noindex pages indexed — by-design hub policy, NOT a harness case (flag to Kenneth)")
    TRIAGE_DIR.mkdir(parents=True, exist_ok=True)
    out = TRIAGE_DIR / f"weekly-triage-{datetime.now().strftime('%Y%m%d')}.json"
    out.write_text(json.dumps({
        "source": str(file),
        "triaged_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "sections": sections,
        "harness_relevant": harness_relevant,
        "note": "Tier-1 fixes are the audit cron's job. Only NEW failure classes become library cases here.",
    }, indent=2))
    return fail(0, {"action": "weekly_triage", "summary": sections,
                    "harness_relevant": harness_relevant,
                    "triage_file": str(out),
                    "message": "Weekly audit triaged — " + str(out)})


def confirm(triage_file: str, index: int, case_id: str) -> int:
    """Seed a confirmed triage finding as a failure-library case."""
    t = json.loads(Path(triage_file).read_text())
    finding = t["findings"][index]
    if finding["classification"] == "checker-bug":
        # snapshot the checker behavior: fixture = live html + expected verdict
        mon = load_monitor()
        status, html = mon.fetch_live(finding["url"])
        case = {
            "id": case_id,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "stage": "verify_deploy",
            "city": finding["slug"],
            "failure": "Audit-loop confirmed checker bug: " + finding["held_reason"] +
                       " — page verified correct (" + str(len(html)) + " bytes, HTTP " + str(status) + "). " +
                       finding["suggested_action"],
            "detector": "tjb-city-completion-monitor",
            "replay": {
                "type": "qc_live",
                "expect": "pass",
                "fixture": {"slug": finding["slug"], "html": html[:60000]},
            },
            "source_commit": "phase5",
            "status": "active",
        }
    elif finding["classification"] == "page-defect":
        return fail(3, {"error": "page-defect cases need the owning gate/eval named first — "
                        "draft the case JSON manually, then failure-library.py add"})
    else:
        return fail(3, {"error": "transient findings are not seeded"})
    case_file = TRIAGE_DIR / (case_id + ".case.json")
    case_file.write_text(json.dumps(case, indent=2))
    r = subprocess.run(["python3", str(LIB_SCRIPT), "add", str(case_file)],
                       capture_output=True, text=True)
    print(r.stdout)
    return r.returncode


def cadence() -> int:
    return fail(0, {
        "action": "cadence",
        "standing_loop": [
            "1. TJB City Page Completion Monitor (cron, script-only): live QC per completed city; holds land in ~/.hermes/state/tjb-city-completion-hold.json",
            "2. Kit: python3 scripts/audit-to-library.py triage-qc — every hold classified (checker-bug | page-defect | transient) — run same session as the hold appears",
            "3. Weekly SEO audit cron: Tier-1 fixes auto-deploy; Kit runs scripts/audit-to-library.py weekly --file <report> on the report",
            "4. Confirmed findings: scripts/audit-to-library.py confirm <triage> <index> --id <case-id> — the library grows, replay protects every future page",
            "5. Failure replay: BEFORE any model switch or eval change — python3 scripts/failure-library.py replay (must be all-caught)",
        ],
        "message": "Standing audit cadence — Layer 7 closed loop",
    })


def main() -> int:
    args = sys.argv[1:]
    if args[:1] == ["triage-qc"]:
        return triage_qc()
    if args[:1] == ["weekly"]:
        fi = args.index("--file") if "--file" in args else None
        if fi is None or fi + 1 >= len(args):
            return fail(3, {"error": "weekly requires --file <audit.md>"})
        return weekly(args[fi + 1])
    if args[:1] == ["confirm"]:
        ci = args.index("--id") if "--id" in args else None
        if len(args) < 3 or ci is None:
            return fail(3, {"error": "confirm requires <triage.json> <index> --id <case-id>"})
        return confirm(args[1], int(args[2]), args[ci + 1])
    if args[:1] == ["cadence"]:
        return cadence()
    return fail(3, {"error": "commands: triage-qc | weekly --file <f> | confirm <f> <i> --id <id> | cadence"})


if __name__ == "__main__":
    sys.exit(main())