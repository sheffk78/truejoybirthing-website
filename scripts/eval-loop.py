#!/usr/bin/env python3
"""TJB Phase 3 harness — eval-loop.py: producer/checker eval loop with
auto-revise (the video's "100+ machine-to-machine revisions" principle).

Called by the parent instead of raw `advance` when evals exist for a stage:
runs the stage's eval pack → on rejection, the rejection reasons + quoted
findings are the re-spawn context for the stage worker (the human never
relays nitpicks) → after a successful worker re-run, evals run again —
up to 3 attempts, then the city is BLOCKED and reported (2-strike state
machine discipline preserved; eval-loop's 3 strikes are its own counter).

Eval pack per stage:
  build   → eval-voice.py   (atlas, copy voice) + eval-accuracy.py (cloud, claim evidence)
  enrich  → eval-accuracy.py (provider/hospital/stat evidence)

Exit codes (gate contract): 0 all evals pass | 1 retryable (rejected — parent
re-spawns worker with loop context, then re-runs eval-loop) | 2 infra (model
unreachable — wait + retry) | 3 fatal (pipeline block, reported).

State: artifacts/evals/loop-{slug}-{stage}.json (attempts + history).
Reset: python3 scripts/eval-loop.py <slug> <stage> --reset

Usage:
  python3 scripts/eval-loop.py <slug> [stage]
  python3 scripts/eval-loop.py <slug> [stage] --reset
"""
from __future__ import annotations
import hashlib
import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = PROJECT_DIR / "artifacts" / "evals"
HANDOFFS_DIR = PROJECT_DIR / "artifacts" / "handoffs"
MAX_ATTEMPTS = 3

# Stage → ordered eval pack. Cheap/local first, cloud last.
EVAL_PACKS = {
    "build": ["eval-voice.py", "eval-accuracy.py"],
    "enrich": ["eval-accuracy.py"],
}

STAGE_ALIASES = {"verify": "verify_deploy", "video": "video_outreach"}


def fail(code: int, payload: dict) -> int:
    print(json.dumps(payload, indent=2))
    return code


def loop_state_path(slug: str, stage: str) -> Path:
    return ARTIFACTS_DIR / f"loop-{slug}-{stage}.json"


def load_loop_state(slug: str, stage: str) -> dict:
    p = loop_state_path(slug, stage)
    if p.exists():
        try:
            return json.loads(p.read_text())
        except json.JSONDecodeError:
            pass
    return {"slug": slug, "stage": stage, "attempts": 0, "history": []}


def save_loop_state(state: dict) -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    loop_state_path(state["slug"], state["stage"]).write_text(json.dumps(state, indent=2))


def input_fingerprint(slug: str, stage: str) -> str:
    """Hash the eval inputs (handoff contract + city block). A worker fix
    changes the fingerprint; an unchanged fingerprint + flip-flopping verdict
    = judge flapping, not a real fix."""
    h = hashlib.sha256()
    hp = HANDOFFS_DIR / slug / (stage + ".json")
    if hp.exists():
        h.update(hp.read_bytes())
    try:
        r = subprocess.run(["python3", str(PROJECT_DIR / "scripts" / "extract-city-block.py"), slug],
                           capture_output=True, text=True, timeout=30, cwd=str(PROJECT_DIR))
        h.update(r.stdout.encode())
    except Exception:
        pass
    return h.hexdigest()[:16]


def run_eval(script: str, slug: str, stage: str) -> tuple[int, dict | None, str]:
    r = subprocess.run(
        ["python3", str(PROJECT_DIR / "scripts" / script), slug, stage],
        capture_output=True, text=True, timeout=900, cwd=str(PROJECT_DIR),
    )
    out = (r.stdout or "").strip()
    try:
        return r.returncode, json.loads(out), out
    except json.JSONDecodeError:
        return r.returncode, None, out


def main() -> int:
    argv = sys.argv[1:]
    do_reset = "--reset" in argv
    args = [a for a in argv if not a.startswith("--")]
    if len(args) < 1:
        return fail(3, {"error": "usage: eval-loop.py <slug> [stage] [--reset]"})
    slug = args[0]
    stage = args[1] if len(args) > 1 else "build"
    stage = STAGE_ALIASES.get(stage, stage)

    pack = EVAL_PACKS.get(stage, [])
    if not pack:
        # No evals for this stage — eval-loop is a no-op pass (contract +
        # stage gates still run in advance).
        return fail(0, {
            "action": "eval_loop_noop",
            "slug": slug, "stage": stage,
            "message": f"No eval pack for stage '{stage}' — advance without evals.",
        })

    state = load_loop_state(slug, stage)

    if do_reset:
        state = {"slug": slug, "stage": stage, "attempts": 0, "history": []}
        save_loop_state(state)
        return fail(0, {"action": "eval_loop_reset", "slug": slug, "stage": stage,
                        "message": "Eval loop counter reset."})

    if state.get("attempts", 0) >= MAX_ATTEMPTS:
        return fail(3, {
            "action": "eval_loop_blocked",
            "slug": slug, "stage": stage,
            "attempts": state.get("attempts"),
            "message": (f"Eval loop exhausted ({MAX_ATTEMPTS} attempts) for {slug}/{stage}. "
                        "City is BLOCKED — report to Kenneth. Reset only after a real fix: "
                        f"python3 scripts/eval-loop.py {slug} {stage} --reset"),
        })

    attempt_no = state.get("attempts", 0) + 1
    run_record = {"attempt": attempt_no, "at": datetime.now().astimezone().isoformat(timespec="seconds"),
                  "evals": {}}

    rejected = False
    infra = False
    rejection_ctx = []
    for script in pack:
        try:
            code, verdict, raw = run_eval(script, slug, stage)
        except subprocess.TimeoutExpired:
            code, verdict, raw = 2, None, f"{script} timed out"
        run_record["evals"][script] = {"exit": code}
        if code == 2:
            infra = True
            continue
        if code == 3:
            save_loop_state(state)
            return fail(3, {
                "action": "eval_fatal",
                "slug": slug, "stage": stage, "eval": script,
                "message": f"{script} exited 3 (fatal). Blocking pipeline — fix input, then: "
                           f"python3 scripts/eval-loop.py {slug} {stage} --reset",
            })
        if code == 1:
            rejected = True
            if verdict:
                rejection_ctx.append({
                    "eval": script,
                    "message": verdict.get("message", ""),
                    "findings": verdict.get("findings", []),
                })

    if infra and not rejected:
        # Infra is NOT a content strike — counter unchanged.
        state["history"].append(run_record)
        save_loop_state(state)
        return fail(2, {
            "action": "eval_loop_infra",
            "slug": slug, "stage": stage, "attempt": attempt_no,
            "message": "Eval infra failure (model unreachable) — wait 60s and retry eval-loop; NOT a content rejection.",
        })

    state["history"].append(run_record)
    if rejected:
        state["attempts"] = attempt_no  # a real strike
        state["last_verdict"] = "rejected"
        state["last_input_fingerprint"] = input_fingerprint(slug, stage)
    else:
        state["attempts"] = 0  # pack passed — counter resets, history retained
    save_loop_state(state)

    if rejected:
        # Phase 4: on the 2nd strike, producer/checker DISPUTE → model council
        # (Layer 6). The council can OVERRULE (strike waived, stage proceeds)
        # or UPHELD (counts as strike 3 → block). Infra at council time is
        # non-fatal: normal rejection continues.
        if attempt_no == 2 and os.environ.get("TJB_DISABLE_EVAL_LOOP", "") != "1":
            try:
                cn = subprocess.run(
                    ["python3", str(PROJECT_DIR / "scripts" / "eval-council.py"), slug, stage, "--auto"],
                    capture_output=True, text=True, timeout=900, cwd=str(PROJECT_DIR),
                )
                cn_out = (cn.stdout or "").strip()
                if cn.returncode == 0 and cn_out:
                    try:
                        print(json.loads(cn_out).get("message", cn_out))
                    except json.JSONDecodeError:
                        print(cn_out)
                    return 0  # council overruled the rejection — proceed
                if cn.returncode == 1 and cn_out:
                    # upheld → 3rd strike → block (record already written by council)
                    state["attempts"] = MAX_ATTEMPTS
                    save_loop_state(state)
                    print(json.dumps({
                        "action": "eval_loop_blocked",
                        "slug": slug, "stage": stage,
                        "attempts": MAX_ATTEMPTS,
                        "message": ("Council UPHELD the 2nd rejection (2/3 majority) — city BLOCKED. "
                                    "Verdict record: artifacts/evals/council-" + slug + "-" + stage + ".json"),
                    }, indent=2))
                    return 3
                # council noop/infra/other → fall through to normal rejection
            except Exception:
                pass  # council unavailable → normal rejection continues

        # The re-spawn context: findings travel to the worker automatically.
        return fail(1, {
            "action": "eval_loop_rejected",
            "slug": slug, "stage": stage,
            "attempt": attempt_no,
            "max_attempts": MAX_ATTEMPTS,
            "rejection_context": rejection_ctx,
            "message": (
                f"Eval pack rejected {slug}/{stage} (attempt {attempt_no}/{MAX_ATTEMPTS}). "
                "Re-spawn the stage worker with rejection_context[] appended verbatim to its "
                "context — worker fixes the quoted issues, re-runs its validation gates, then "
                "the parent re-runs eval-loop. After 3 rejections the city blocks."
            ),
        })

    # Flap guard: same inputs previously REJECTED and now pass? Hosted judges
    # can flip on borderline evidence even at temp 0. Re-run the pack once —
    # pass only on 2 consecutive passes of identical inputs; strict side wins.
    fp = input_fingerprint(slug, stage)
    if (state.get("last_verdict") == "rejected"
            and state.get("last_input_fingerprint") == fp):
        rerun_rejected = False
        for script in pack:
            try:
                code, verdict, raw = run_eval(script, slug, stage)
            except subprocess.TimeoutExpired:
                code, verdict, raw = 2, None, "timeout"
            if code == 1:
                rerun_rejected = True
            if code == 2:
                infra = True
        run_record["flap_rerun"] = True
        state["history"].append(dict(run_record))
        if rerun_rejected:
            state["attempts"] = attempt_no
            state["last_verdict"] = "rejected"
            state["last_input_fingerprint"] = fp
            save_loop_state(state)
            return fail(1, {
                "action": "eval_loop_rejected",
                "slug": slug, "stage": stage,
                "attempt": attempt_no,
                "max_attempts": MAX_ATTEMPTS,
                "rejection_context": [{"eval": "flap-guard-rerun",
                                       "message": "Re-run of identical inputs flipped back to rejection — strict side wins.",
                                       "findings": []}],
                "message": (f"Flap guard: identical inputs previously rejected; confirmation run also rejected. "
                            f"{slug}/{stage} attempt {attempt_no}/{MAX_ATTEMPTS} — re-spawn worker."),
            })
        # confirmed pass on identical inputs

    state["last_verdict"] = "approved"
    state["last_input_fingerprint"] = fp
    save_loop_state(state)
    return fail(0, {
        "action": "eval_loop_pass",
        "slug": slug, "stage": stage,
        "attempt": attempt_no,
        "message": f"Eval pack passed for {slug}/{stage} — proceed to advance.",
    })


if __name__ == "__main__":
    sys.exit(main())