#!/usr/bin/env python3
"""TJB Phase 3 harness — eval-voice.py: producer/checker copy-voice eval.

Producer/checker split: the stage worker (producer, atlas) writes copy; this
script runs a FRESH-CONTEXT checker (atlas via local Ollama) that judges the
copy against the TJB voice standard. The producer never judges its own work —
the checker has no memory of the producer's session, only the standard + data.

What it checks (Gate 1, after BUILD — copy-quality layer above the
deterministic slop gate):
  - city_block.culture / medicaidNote paragraphs
  - every provider `description` in localDoulas
  - FAQ question/answer copy

Verdict JSON per finding: {field, severity, quote, reason}.
Exit codes (gate contract): 0 pass | 1 retryable (eval findings / model infra
glare) | 2 infra (model unreachable) | 3 fatal (bad input).

Replay-safe: the slop gate (eval-slop-gate.py) runs first upstream; this eval
adds judgment the blacklist can't catch (tone, judgment language, flowery copy,
gender-reference rule).

Usage:
  python3 scripts/eval-voice.py <slug>            # eval, gate semantics
  python3 scripts/eval-voice.py <slug> --json     # machine verdict to stdout
"""
from __future__ import annotations
import json
import os
import re
import subprocess
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
VOICE_STANDARD = Path("/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/BRAND-VOICE.md")
EXTRACT_SCRIPT = PROJECT_DIR / "scripts" / "extract-city-block.py"
ARTIFACTS_DIR = PROJECT_DIR / "artifacts" / "evals"

# Producer (atlas, local $0) doubles as checker — fresh context per the
# enrichment-review.py precedent: "the fresh-context review is what catches
# quality issues". Config-driven so a model switch is a one-line change.
CHECKER_MODEL = os.environ.get("TJB_VOICE_CHECKER_MODEL", "atlas:latest")
OLLAMA_LOCAL_URL = os.environ.get("TJB_OLLAMA_LOCAL_URL", "http://127.0.0.1:11434/api/chat")
TIMEOUT_S = 180

MAX_FIELDS_PER_CALL = 8  # keep prompts small; batched fields per call

SYSTEM_PROMPT = """You are a copy-voice checker for True Joy Birthing city pages.
You review web copy against the brand voice standard in FRESH context — you have
no memory of who wrote it. Judge only what is in front of you.

TWO scopes, different rules:

1. TJB-authored fields (culture, medicaidNote, FAQ answers) — the full voice
   standard applies. Flag: clinical coldness, judgment language ("natural vs.
   real birth", "giving up"), fear-based framing, over-flowery mystical
   language ("magical journey", "goddess energy"), prescriptive pressure
   ("you have to"), gender-reference violations (must be mother/mom/mama/she/her
   when referring to the person giving birth — never "birthing person").
   Do NOT flag: warm supportive tone, honest statements that labor is hard,
   "you might consider" framing, factual information.

2. Provider bios (localDoulas[*].description) — these are REAL doulas'
   own practice descriptions, shown as directory listings. They are NOT
   rewritten to TJB voice (that would misrepresent their businesses).
   Flag ONLY: AI-slop buzzwords that slipped past the blacklist ("nestled in
   the heart of", "look no further", "vibrant community", "game-changer",
   "cutting-edge"), obviously generic template copy with no real details,
   or wrong-city content. Do NOT flag service facts: "unmedicated birth",
   "natural birth", "birth on her own terms", "reducing birth fear" are
   normal service descriptors in a doula's own bio — NEVER flag them.

Only flag text that appears in the provided copy. Quote it exactly.
If the copy is clean or only trivially imperfect, approve it — false
rejections cost a worker re-spawn, so reserve "rejected" for real violations.
Return ONLY valid JSON, no other text.

Response format:
{"verdict": "approved"|"rejected",
 "findings": [{"field": "...", "severity": "critical"|"major"|"minor",
               "quote": "exact text", "reason": "why it violates the standard"}]}
verdict is "rejected" only when at least one critical or major finding exists.
Return {"verdict":"approved","findings":[]} when copy is clean."""


def fail(code: int, payload: dict) -> int:
    print(json.dumps(payload, indent=2))
    return code


def extract_block(slug: str) -> str | None:
    r = subprocess.run(
        ["python3", str(EXTRACT_SCRIPT), slug],
        capture_output=True, text=True, timeout=30, cwd=str(PROJECT_DIR),
    )
    if r.returncode == 0 and r.stdout.strip():
        return r.stdout.strip()
    return None


def ollama_chat(system: str, user: str) -> dict | None:
    body = json.dumps({
        "model": CHECKER_MODEL,
        "messages": [{"role": "system", "content": system},
                     {"role": "user", "content": user}],
        "stream": False,
        "format": "json",
        "options": {"temperature": 0},
    }).encode()
    req = urllib.request.Request(
        OLLAMA_LOCAL_URL, data=body,
        headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
            data = json.loads(resp.read().decode())
        content = data.get("message", {}).get("content", "")
        return json.loads(content)
    except json.JSONDecodeError:
        return None
    except Exception:
        return None


def parse_block_to_dict(block: str) -> dict | None:
    """Parse the TS object literal. Primary: node (block is valid JS object
    syntax — unquoted keys, single quotes, comments all OK). Fallback: none —
    if node is unavailable the eval fails fatal (cannot judge unseen copy)."""
    js = ("const o = eval('(' + require('fs').readFileSync(0,'utf8') + ')'); "
          "process.stdout.write(JSON.stringify(o))")
    try:
        r = subprocess.run(["node", "-e", js], input=block,
                           capture_output=True, text=True, timeout=30,
                           cwd=str(PROJECT_DIR))
        if r.returncode == 0 and r.stdout.strip():
            return json.loads(r.stdout)
    except Exception:
        pass
    return None


def collect_copy_fields(block: str) -> list:
    """Voice-bearing fields from the parsed block: culture, medicaidNote,
    every provider description, every FAQ answer."""
    data = parse_block_to_dict(block)
    fields = []
    if data is None:
        return fields  # caller treats empty as fatal
    for fname in ("culture", "medicaidNote"):
        val = data.get(fname)
        if isinstance(val, str) and len(val) > 40:
            fields.append({"field": fname, "text": val})
    for key in data:
        if "doula" in key.lower() and isinstance(data[key], list):
            for prov in data[key]:
                if not isinstance(prov, dict):
                    continue
                name = str(prov.get("name", "unknown"))
                desc = prov.get("description")
                if isinstance(desc, str) and len(desc) > 40:
                    fields.append({"field": key + "[" + name + "].description", "text": desc})
    for key in data:
        if "faq" in key.lower() and isinstance(data[key], list):
            for i, item in enumerate(data[key]):
                if not isinstance(item, dict):
                    continue
                q = str(item.get("q") or item.get("question") or "")
                a = item.get("a") or item.get("answer")
                if isinstance(a, str) and len(a) > 40:
                    label = key + "[" + str(i) + "].answer" + (" (Q: " + q[:60] + ")" if q else "")
                    fields.append({"field": label, "text": a})
    return fields


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    json_mode = "--json" in sys.argv
    if len(args) < 1:
        return fail(3, {"error": "usage: eval-voice.py <slug> [--json]"})
    slug = args[0]

    if not VOICE_STANDARD.exists():
        return fail(3, {"error": f"voice standard missing: {VOICE_STANDARD}"})
    standard = VOICE_STANDARD.read_text()
    # Trim to the sections that matter for page copy (skip email drafting)
    if "## Email Drafting" in standard:
        standard = standard.split("## Email Drafting")[0]

    block = extract_block(slug)
    if not block:
        return fail(3, {"error": f"could not extract city block for {slug} (fatal: nothing to eval)"})

    fields = collect_copy_fields(block)
    if not fields:
        return fail(3, {"error": f"no voice-bearing copy fields found in {slug} block (fatal: eval cannot run on empty input)"})

    # Chunk fields to keep prompts small
    all_findings: list[dict] = []
    model_ok = 0
    model_err = 0
    for i in range(0, len(fields), MAX_FIELDS_PER_CALL):
        chunk = fields[i:i + MAX_FIELDS_PER_CALL]
        copy_dump = "\n\n".join(
            f"### {f['field']}\n\"{f['text']}\"" for f in chunk)
        user_prompt = f"""## Brand Voice Standard (excerpt)

{standard}

## Copy to Review — city: {slug}

{copy_dump}

## Instructions
Review each field above against the standard. Quote exact violating text.
Return ONLY the JSON verdict object."""
        result = ollama_chat(SYSTEM_PROMPT, user_prompt)
        if result is None:
            model_err += 1
            continue
        model_ok += 1
        for f in result.get("findings", []):
            f["field"] = f.get("field", "unknown")
            if f.get("severity") not in ("critical", "major", "minor"):
                f["severity"] = "minor"
            all_findings.append(f)

    if model_ok == 0:
        # Checker model unreachable — infra, not a content verdict
        return fail(2, {
            "action": "eval_infra",
            "eval": "eval-voice",
            "slug": slug,
            "model": CHECKER_MODEL,
            "message": "Checker model unreachable for all calls — treat as retryable infra, retry advance.",
        })

    blocking = [f for f in all_findings if f.get("severity") in ("critical", "major")]
    verdict = "rejected" if blocking else "approved"
    artifact = {
        "eval": "eval-voice",
        "slug": slug,
        "model": CHECKER_MODEL,
        "fields_checked": len(fields),
        "model_calls_ok": model_ok,
        "model_calls_err": model_err,
        "verdict": verdict,
        "findings": all_findings,
        "checked_at": datetime.now().astimezone().isoformat(timespec="seconds"),
    }
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    (ARTIFACTS_DIR / f"voice-{slug}.json").write_text(json.dumps(artifact, indent=2))

    out = {
        "action": "eval_pass" if verdict == "approved" else "eval_rejected",
        "eval": "eval-voice",
        "slug": slug,
        "model": CHECKER_MODEL,
        "fields_checked": len(fields),
        "verdict": verdict,
        "blocking_findings": len(blocking),
        "findings": all_findings if verdict == "rejected" else [],
        "artifact": str(ARTIFACTS_DIR / f"voice-{slug}.json"),
        "message": (
            f"Voice eval REJECTED ({len(blocking)} blocking findings) — re-spawn the "
            f"{slug} build worker with findings[] appended to its context; worker fixes "
            "the quoted copy in cities.ts (meaning preserved, voice standard applied), "
            "re-runs the slop gate, then re-advance."
            if verdict == "rejected" else
            f"Voice eval approved ({len(fields)} fields checked, {model_err} model call(s) failed non-fatally)."
        ),
    }
    if json_mode:
        out["artifact_data"] = artifact
    return fail(1 if verdict == "rejected" else 0, out)


if __name__ == "__main__":
    sys.exit(main())