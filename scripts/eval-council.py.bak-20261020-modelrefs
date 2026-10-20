#!/usr/bin/env python3
"""TJB Phase 4 harness — eval-council.py: the dispute tier (Layer 6).

Formalizes the 2026-08-26 council pattern (3 models, 2/3 majority) as the
checker-of-the-checker: when the producer and checker disagree — an eval
rejection the producer contests by resubmitting, or flip-flopping verdicts on
identical inputs — the council judges.

Models: atlas (local, producer-side perspective) + glm-5.3-flash:cloud
(checker-side) + bedrock (local tiebreak). 2/3 majority proceeds or rejects;
verdict + reasoning are logged to artifacts/evals/council-{slug}-{stage}.json
(council disagreements are themselves failure-replay fodder per the plan).

Modes:
  --auto (called from eval-loop on 2nd DIFFERENT-finding rejection):
      reads loop state; only acts when attempts == 2. OVERRULE resets the
      strike counter (the stage proceeds); UPHOLD turns the 2nd strike into
      the 3rd (block). Exit 0 = proceed, 1 = rejected, 2 = infra, 3 = fatal,
      99 = no dispute (normal gating continues).
  manual: python3 scripts/eval-council.py <slug> <stage> --question "..."
      Forces a council run on a specific question.

Kill switch: TJB_DISABLE_EVAL_LOOP=1 also disables the council.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = PROJECT_DIR / "artifacts" / "evals"
STATES_DIR = Path.home() / ".hermes" / "skills" / "productivity" / "tjb-city-orchestrator" / "states"

OLLAMA_LOCAL_URL = "http://127.0.0.1:11434/api/chat"
_hermes_config = Path.home() / ".hermes" / "config.yaml"
OLLAMA_CLOUD_URL = "http://127.0.0.1:11500/v1/chat/completions"
OLLAMA_CLOUD_KEY = ""
if _hermes_config.exists():
    try:
        import yaml
        cfg = yaml.safe_load(_hermes_config.read_text())
        oc = cfg.get("providers", {}).get("ollama-cloud", {})
        OLLAMA_CLOUD_KEY = oc.get("api_key", "")
        base_url = oc.get("base_url", "http://127.0.0.1:11500/v1")
        OLLAMA_CLOUD_URL = base_url.rstrip("/") + "/chat/completions"
    except Exception:
        pass

TIMEOUT_S = 180

COUNCIL_SYSTEM = """You are one member of a 3-model dispute council for the True Joy Birthing
city pipeline. A producer (worker) and an automated checker (eval) disagree
about a stage's work. Judge ONLY the evidence in front of you.

Rules:
- The stage contract is the definition of done — check the concrete claims.
- If the checker's quoted findings are real violations, UPHELD.
- If the findings are wrong, pedantic, or the copy is acceptable under the
  standards quoted, OVERRULED.
- Do not split the difference. Vote UPHELD (rejection stands) or OVERRULED
  (work passes) based on the strongest single argument.
Return ONLY valid JSON: {"vote": "UPHELD"|"OVERRULED", "reason": "one sentence"}


"""


def fail(code: int, payload: dict) -> int:
    print(json.dumps(payload, indent=2))
    return code


def call_atlas(system: str, user: str) -> dict | None:
    body = json.dumps({
        "model": "atlas:latest",
        "messages": [{"role": "system", "content": system},
                     {"role": "user", "content": user}],
        "stream": False, "format": "json", "options": {"temperature": 0},
    }).encode()
    try:
        req = urllib.request.Request(OLLAMA_LOCAL_URL, data=body,
                                     headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
            data = json.loads(resp.read().decode())
        return json.loads(data.get("message", {}).get("content", ""))
    except Exception:
        return None


def call_cloud(model: str, system: str, user: str) -> dict | None:
    body = json.dumps({
        "model": model,
        "messages": [{"role": "system", "content": system},
                     {"role": "user", "content": user}],
        "temperature": 0,
    }).encode()
    try:
        req = urllib.request.Request(
            OLLAMA_CLOUD_URL, data=body,
            headers={"Content-Type": "application/json",
                     "Authorization": "Bearer " + OLLAMA_CLOUD_KEY})
        with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
            data = json.loads(resp.read().decode())
        content = data["choices"][0]["message"]["content"].strip()
        if content.startswith("```"):
            content = content.strip("`")
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except Exception:
        return None


def gather_context(slug: str, stage: str) -> str | None:
    """City block + handoff + rejection history — everything the council sees."""
    parts = []
    try:
        r = subprocess.run(["python3", str(PROJECT_DIR / "scripts" / "extract-city-block.py"), slug],
                           capture_output=True, text=True, timeout=30, cwd=str(PROJECT_DIR))
        if r.returncode == 0 and r.stdout.strip():
            parts.append("## City block (cities.ts)\n```typescript\n" + r.stdout.strip()[:6000] + "\n```")
    except Exception:
        pass
    handoff = PROJECT_DIR / "artifacts" / "handoffs" / slug / (stage + ".json")
    if handoff.exists():
        parts.append("## Handoff contract\n```json\n" + handoff.read_text()[:5000] + "\n```")
    loop_state = ARTIFACTS_DIR / ("loop-" + slug + "-" + stage + ".json")
    if loop_state.exists():
        try:
            ls = json.loads(loop_state.read_text())
            rejections = [h for h in ls.get("history", []) if isinstance(h, dict)]
            parts.append("## Eval loop history\n```json\n" + json.dumps(rejections[-3:], indent=1)[:3000] + "\n```")
        except Exception:
            pass
    if not parts:
        return None
    return "\n\n".join(parts)


def run_council(slug: str, stage: str, question: str) -> dict:
    context = gather_context(slug, stage)
    if context is None:
        return {"error": "no council context (no city block / handoff / loop state)"}
    user_prompt = ("## Dispute\n" + question + "\n\n" + context +
                   "\n\nVote UPHELD or OVERRULED with a one-sentence reason.")
    votes = []
    votes.append(("atlas", call_atlas(COUNCIL_SYSTEM, user_prompt)))
    votes.append(("glm-5.3-flash", call_cloud("glm-5.3-flash:cloud", COUNCIL_SYSTEM, user_prompt)))
    votes.append(("bedrock", call_cloud("bedrock:latest", COUNCIL_SYSTEM, user_prompt)))

    valid = [(m, v) for m, v in votes if v and v.get("vote") in ("UPHELD", "OVERRULED")]
    if not valid:
        return {"error": "no council member reachable (infra)", "votes": []}
    uph = sum(1 for _, v in valid if v["vote"] == "UPHELD")
    ove = sum(1 for _, v in valid if v["vote"] == "OVERRULED")
    if uph == ove:  # tie → strictest verdict wins
        verdict = "UPHELD"
        tie = True
    else:
        verdict = "UPHELD" if uph > ove else "OVERRULED"
        tie = False
    return {
        "verdict": verdict,
        "tie": tie,
        "votes": [{"model": m, "vote": v.get("vote"), "reason": str(v.get("reason", ""))[:300]}
                  for m, v in valid],
        "unreachable": [m for m, v in votes if v is None],
    }


def main() -> int:
    argv = sys.argv[1:]
    args = [a for a in argv if not a.startswith("--")]
    if len(args) < 2:
        print(json.dumps({"error": "usage: eval-council.py <slug> <stage> [--auto] [--question ...]"}))
        return 3
    slug, stage = args[0], args[1]
    if os.environ.get("TJB_DISABLE_EVAL_LOOP", "") == "1":
        print(json.dumps({"action": "council_disabled", "slug": slug, "stage": stage}))
        return 99

    # --auto: only fires on the 2nd strike with a live dispute
    if "--auto" in argv:
        state_path = ARTIFACTS_DIR / ("loop-" + slug + "-" + stage + ".json")
        if not state_path.exists():
            print(json.dumps({"action": "council_noop", "message": "no eval-loop state — no dispute"}))
            return 99
        try:
            ls = json.loads(state_path.read_text())
        except json.JSONDecodeError:
            return 99
        attempts = ls.get("attempts", 0)
        if attempts != 2:
            print(json.dumps({"action": "council_noop", "attempts": attempts,
                              "message": "council fires only at attempts == 2"}))
            return 99
        # question: the two rejections' findings side by side
        rejections = [h for h in ls.get("history", []) if h.get("evals")]
        question = ("The eval checker rejected this stage's work twice (see history). "
                    "The worker contests the second rejection. Does the checker's finding "
                    "genuinely violate the stage contract / voice standard, or is it a "
                    "pedantic false rejection? Decide: UPHELD = rejection stands "
                    "(strike 3, city blocks); OVERRULED = work proceeds.")
        result = run_council(slug, stage, question)
        if "error" in result and not result.get("votes"):
            print(json.dumps({"action": "council_infra", "message": result["error"]}, indent=2))
            return 2
        record = {"slug": slug, "stage": stage, "mode": "auto",
                  "attempts": attempts, **result,
                  "at": datetime.now().astimezone().isoformat(timespec="seconds")}
        ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
        (ARTIFACTS_DIR / f"council-{slug}-{stage}.json").write_text(json.dumps(record, indent=2))
        if result["verdict"] == "OVERRULED":
            print(json.dumps({"action": "council_overruled", "slug": slug, "stage": stage,
                              "votes": result["votes"],
                              "message": "Council OVERRULED the 2nd rejection (2/3 majority) — strike waived, work proceeds. Record: artifacts/evals/council-" + slug + "-" + stage + ".json"}, indent=2))
            return 0
        print(json.dumps({"action": "council_upheld", "slug": slug, "stage": stage,
                          "votes": result["votes"],
                          "message": "Council UPHELD the rejection (2/3) — counts as strike 3, city blocks. Record: artifacts/evals/council-" + slug + "-" + stage + ".json"}, indent=2))
        return 1

    # manual mode
    qi = next((i for i, a in enumerate(argv) if a == "--question"), None)
    question = argv[qi + 1] if qi is not None and qi + 1 < len(argv) else (
        "Judge the current state of this stage's work: UPHELD (reject) or OVERRULED (accept)?")
    result = run_council(slug, stage, question)
    if "error" in result and not result.get("votes"):
        print(json.dumps({"action": "council_infra", "message": result["error"]}, indent=2))
        return 2
    record = {"slug": slug, "stage": stage, "mode": "manual", **result,
              "at": datetime.now().astimezone().isoformat(timespec="seconds")}
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    (ARTIFACTS_DIR / f"council-{slug}-{stage}.json").write_text(json.dumps(record, indent=2))
    print(json.dumps({"action": "council_" + result["verdict"].lower(),
                      "slug": slug, "stage": stage, **result}, indent=2))
    return 1 if result["verdict"] == "UPHELD" else 0


if __name__ == "__main__":
    sys.exit(main())