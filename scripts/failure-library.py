#!/usr/bin/env python3
"""TJB Failure Library — saved failure cases with replay (Agency OS Layer 5).

Phase 2 of the TJB Pipeline Harness Plan. Aviation model: every real failure
becomes a permanent, replayable test. Before ANY model switch or eval/eval-
prompt change, run the replay suite — every saved case must still be caught.

Case file layout: scripts/failure-library/cases/*.json
  {
    "id": "slop-cutting-edge-garden-grove",
    "date": "2026-09-06",
    "stage": "build",
    "city": "garden-grove-ca",
    "failure": "<human description>",
    "detector": "eval-slop-gate",           # eval/gate that should catch it
    "replay": {                              # detector-specific instructions
      "type": "slop",                        # slop | contract | dup_keys | voice_eval | accuracy_eval
      "expect": "fail",
      "fixture": { ... payload to replay ... }
    },
    "source_commit": "c051be77",
    "status": "active"
  }

CLI:
  python3 scripts/failure-library.py add <case.json>   # validate + save
  python3 scripts/failure-library.py replay            # run ALL cases
  python3 scripts/failure-library.py replay --eval eval-slop-gate
  python3 scripts/failure-library.py list

Replay exit codes: 0 = all cases still caught; 1 = at least one survivor
(a saved failure is NO LONGER caught — the change under test must not ship).
"""

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
LIB_DIR = Path(__file__).resolve().parent / "failure-library"
CASES_DIR = LIB_DIR / "cases"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tjb_contracts import CITIES_TS, _balanced  # noqa: E402


# ---------------------------------------------------------------- case IO

def load_cases():
    if not CASES_DIR.exists():
        return []
    out = []
    for f in sorted(CASES_DIR.glob("*.json")):
        try:
            out.append(json.loads(f.read_text()))
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"bad case file {f.name}: {e}"}))
    return out


def save_case(case: dict) -> Path:
    CASES_DIR.mkdir(parents=True, exist_ok=True)
    path = CASES_DIR / f"{case['id']}.json"
    if path.exists():
        raise SystemExit(f"case id already exists: {case['id']} (ids are permanent)")
    path.write_text(json.dumps(case, indent=2))
    return path


# ---------------------------------------------------------------- replays

def replay_slop(case: dict) -> dict:
    """Feed the saved sentence back into the slop-gate patterns (in-process,
    no model, no network — deterministic regression of the gate itself)."""
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "eval_slop_gate", str(Path(__file__).resolve().parent / "eval-slop-gate.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)

    text = case["replay"]["fixture"]["text"]
    result = mod.scan(text)
    caught = len(result["hard"]) > 0
    return {
        "caught": caught,
        "detail": "; ".join(sorted({h["rule"] for h in result["hard"]})) or "no hard hits",
    }


def replay_contract(case: dict) -> dict:
    """Run contract-validate against the saved slug/stage and compare to the
    expected verdict. Used for data-shape classes (e.g. duplicate keys)."""
    fx = case["replay"]["fixture"]
    slug, stage = fx["slug"], fx["stage"]
    r = subprocess.run(
        ["python3", str(Path(__file__).resolve().parent / "contract-validate.py"), slug, stage],
        capture_output=True, text=True, timeout=120, cwd=PROJECT_DIR,
    )
    try:
        out = json.loads((r.stdout or "{}").strip() or "{}")
    except json.JSONDecodeError:
        out = {}
    if case["replay"].get("expect") == "fail":
        caught = r.returncode != 0
        detail = "; ".join(out.get("violations", []))[:300] or f"exit {r.returncode}"
    else:
        caught = r.returncode == 0
        detail = f"exit {r.returncode}"
    return {"caught": caught, "detail": detail}


def replay_dup_keys(case: dict) -> dict:
    """Duplicate-key scanner regression: fixture is raw TS object text.
    Wrapped in braces so the scanner's object-stack has a root."""
    fx = case["replay"]["fixture"]
    text = "{" + fx["text"] + "}"
    dups = scan_dup_keys_text(text)
    expected = fx.get("expect_keys") or []
    caught = all(k in dups for k in expected) and (expected or bool(dups))
    return {"caught": caught, "detail": f"found: {sorted(dups)}" if dups else "no duplicates found"}


def scan_dup_keys_text(ts_text: str) -> dict:
    """Detect duplicate object keys in a TS object literal, string-aware.
    Returns {key: count} for keys appearing more than once at the same level."""
    from collections import Counter

    dups = {}
    # tokenize top-to-bottom, tracking a stack of (key -> count) per object level.
    # Comment-aware + double-quote-only strings (cities.ts corpus convention;
    # single-quote chars appear in comments and escaped apostrophes only).
    stack = [{}]
    quote = None
    i, n = 0, len(ts_text)
    while i < n:
        ch = ts_text[i]
        if quote:
            if ch == "\\":
                i += 2
                continue
            if ch == quote:
                quote = None
            i += 1
            continue
        if ch == chr(34):
            quote = ch
            i += 1
            continue
        if ch == "/" and i + 1 < n and ts_text[i + 1] == "/":
            nl = ts_text.find("\n", i)
            i = nl if nl != -1 else n
            continue
        if ch == "/" and i + 1 < n and ts_text[i + 1] == "*":
            end = ts_text.find("*/", i + 2)
            i = end + 2 if end != -1 else n
            continue
        if ch == "{":
            stack.append({})
            i += 1
            continue
        if ch == "}":
            if len(stack) > 1:
                level = stack.pop()
                for k, c in level.items():
                    if c > 1:
                        dups[k] = dups.get(k, 0) + 1
            i += 1
            continue
        if ch == ":":
            # scan back for the identifier that forms this key
            j = i - 1
            while j >= 0 and ts_text[j] in " \t\n\r":
                j -= 1
            # walk back over the identifier
            k_end = j + 1
            k_start = j
            while k_start > 0 and (ts_text[k_start - 1].isalnum() or ts_text[k_start - 1] in "_$"):
                k_start -= 1
            key = ts_text[k_start:k_end]
            if key and stack:
                stack[-1][key] = stack[-1].get(key, 0) + 1
            i += 1
            continue
        i += 1
    return dups


def _load_eval_module(name: str):
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        name, str(Path(__file__).resolve().parent / (name + ".py")))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def replay_voice_eval(case: dict) -> dict:
    """Model replay for eval-voice: feed the saved TJB-authored copy through
    the voice checker (atlas, local) and require a rejection verdict.
    Model unreachable = not caught (you cannot declare a switch safe if the
    eval cannot run)."""
    mod = _load_eval_module("eval-voice")
    fx = case["replay"]["fixture"]
    standard = mod.VOICE_STANDARD.read_text()
    if "## Email Drafting" in standard:
        standard = standard.split("## Email Drafting")[0]
    user_prompt = ("## Brand Voice Standard (excerpt)\n\n" + standard +
                   "\n\n## Copy to Review — city: replay-fixture\n\n### culture\n\"" +
                   fx["text"] + "\"\n\n## Instructions\nReview each field above against the standard. "
                   "Quote exact violating text.\nReturn ONLY the JSON verdict object.")
    result = mod.ollama_chat(mod.SYSTEM_PROMPT, user_prompt)
    if result is None:
        return {"caught": False, "detail": "voice checker model unreachable"}
    caught = result.get("verdict") == "rejected"
    quotes = [f.get("quote", "") for f in result.get("findings", [])][:3]
    return {"caught": caught, "detail": "verdict=" + str(result.get("verdict")) + "; quotes: " + " | ".join(quotes)}


def replay_accuracy_eval(case: dict) -> dict:
    """Model replay for eval-accuracy: feed the saved {claim,url,quote} through
    the cloud checker and require an UNSUPPORTED verdict."""
    mod = _load_eval_module("eval-accuracy")
    fx = case["replay"]["fixture"]
    result = mod.check_source(fx["claim"], fx["url"], fx["quote"])
    if result is None:
        return {"caught": False, "detail": "accuracy checker model unreachable"}
    verdict = result.get("verdict")
    if verdict == "UNSUPPORTED":
        caught = True
    elif verdict == "NOT_ENOUGH_INFO":
        # borderline evidence: strict side must win on the confirmation run
        result2 = mod.check_source(fx["claim"], fx["url"], fx["quote"])
        caught = (result2 or {}).get("verdict") in ("UNSUPPORTED", "NOT_ENOUGH_INFO")
        verdict = verdict + "->" + str((result2 or {}).get("verdict"))
    else:
        caught = False
    return {"caught": caught, "detail": "verdict=" + str(verdict) + "; " + str(result.get("reason", ""))[:200]}


REPLAYERS = {
    "slop": replay_slop,
    "contract": replay_contract,
    "dup_keys": replay_dup_keys,
    "voice_eval": replay_voice_eval,
    "accuracy_eval": replay_accuracy_eval,
}


# ---------------------------------------------------------------- commands

def cmd_replay(only_eval: str = None):
    cases = load_cases()
    if only_eval:
        cases = [c for c in cases if c.get("detector") == only_eval]
    if not cases:
        print(json.dumps({"ok": True, "ran": 0, "message": "no cases to replay"}))
        sys.exit(0)
    results, survivors = [], []
    for case in cases:
        if case.get("status") != "active":
            results.append({"id": case["id"], "skipped": case.get("status")})
            continue
        rtype = case.get("replay", {}).get("type")
        fn = REPLAYERS.get(rtype)
        if not fn:
            results.append({"id": case["id"], "caught": False, "detail": f"unknown replay type: {rtype}"})
            survivors.append(case["id"])
            continue
        try:
            r = fn(case)
            r.update({"id": case["id"], "detector": case.get("detector")})
            results.append(r)
            if not r.get("caught"):
                survivors.append(case["id"])
        except Exception as e:
            results.append({"id": case["id"], "caught": False, "detail": f"replay crashed: {e}"})
            survivors.append(case["id"])
    ok = not survivors
    print(json.dumps({
        "ok": ok,
        "ran": len(results),
        "survivors": survivors,
        "results": results,
        "message": (
            f"replay suite: {len(results)} cases, ALL CAUGHT — change is safe"
            if ok else
            f"replay suite FAILED: {len(survivors)} saved failure(s) no longer caught: {survivors} — fix before shipping"
        ),
    }, indent=2))
    sys.exit(0 if ok else 1)


def cmd_add(path: str):
    case = json.loads(Path(path).read_text())
    for req_field in ("id", "date", "stage", "failure", "detector", "replay"):
        if req_field not in case:
            raise SystemExit(f"case missing required field: {req_field}")
    if case["replay"].get("type") not in REPLAYERS:
        raise SystemExit(f"replay.type must be one of {list(REPLAYERS)}")
    p = save_case(case)
    print(json.dumps({"saved": str(p), "id": case["id"]}))
    sys.exit(0)


def cmd_list():
    cases = load_cases()
    print(json.dumps({"count": len(cases), "cases": [
        {"id": c["id"], "stage": c.get("stage"), "detector": c.get("detector"),
         "replay_type": c.get("replay", {}).get("type"), "date": c.get("date"),
         "status": c.get("status", "active")}
        for c in cases
    ]}, indent=2))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["add", "replay", "list"])
    ap.add_argument("path", nargs="?")
    ap.add_argument("--eval", dest="only_eval")
    args = ap.parse_args()
    if args.cmd == "add":
        cmd_add(args.path)
    elif args.cmd == "replay":
        cmd_replay(args.only_eval)
    else:
        cmd_list()


if __name__ == "__main__":
    main()