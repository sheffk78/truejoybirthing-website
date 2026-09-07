#!/usr/bin/env python3
"""TJB Phase 3 harness — eval-accuracy.py: claim-evidence accuracy eval.

Checker model (cloud, fast): glm-5.3-flash via the ollama-cloud proxy.
(Note: the harness plan named glm-5.2-flash; that model is retired from the
proxy — glm-5.3-flash is the current $0 fast checker. Config-driven below.)

What it checks (Gate 2, after BUILD/enrich): every source-evidence item in the
stage handoff contract — {claim, url, quote} — is judged by a fresh-context
checker: is the quote the kind of text that would appear at that URL, and does
it actually support the claim? Fabricated sources and quote-wrong-passage are
the failure class this eval kills (Layer 1 of the video's harness: evals check
claims AFTER contract validation confirms the evidence exists).

Verdicts per source: SUPPORTED | UNSUPPORTED | NOT_ENOUGH_INFO.
Exit codes (gate contract): 0 pass | 1 retryable (unsupported claims →
re-spawn worker with findings) | 2 infra (model unreachable) | 3 fatal (bad
input — missing handoff/sources is ALSO a contract failure, but this eval
reports it as fatal-input rather than duplicating contract-validate).

Usage:
  python3 scripts/eval-accuracy.py <slug> [stage]   # stage default: build
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
HANDOFFS_DIR = PROJECT_DIR / "artifacts" / "handoffs"
ARTIFACTS_DIR = PROJECT_DIR / "artifacts" / "evals"

CHECKER_MODEL = os.environ.get("TJB_ACCURACY_CHECKER_MODEL", "glm-5.3-flash:cloud")

# Proxy credentials from Hermes config (never hardcoded — same pattern as
# verify-providers.py).
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

TIMEOUT_S = 120
NOT_ENOUGH_INFO_WARN_PCT = 30

SYSTEM_PROMPT = """You are a factual-accuracy checker for True Joy Birthing city pages.
You receive one claim, the URL of the page it supposedly came from, and a quoted
passage. You have NO memory of who wrote it — judge only the evidence provided.

Decide exactly one verdict:
- "SUPPORTED" — the quote is plausible text for that URL/page (domain subject
  matter matches the claim's topic) AND the quote itself supports the claim.
- "UNSUPPORTED" — the quote does NOT support the claim, or the quote could not
  plausibly appear on that page/domain (wrong subject, wrong location, clearly
  fabricated). This includes quotes that are generic filler with no relation
  to the specific claim.
- "NOT_ENOUGH_INFO" — the quote is too short/generic to judge, or you cannot
  determine whether the page would contain it.

Be strict on fabrication signals: hospital specialties that don't match the
hospital, statistics with no source feel, quotes about a different city than
the claim's city, URLs whose domain is unrelated to the claim topic.

Return ONLY valid JSON:
{"verdict": "SUPPORTED"|"UNSUPPORTED"|"NOT_ENOUGH_INFO", "reason": "one sentence"}


"""


def fail(code: int, payload: dict) -> int:
    print(json.dumps(payload, indent=2))
    return code


def check_source(claim: str, url: str, quote: str) -> dict | None:
    body = json.dumps({
        "model": CHECKER_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps({
                "claim": claim, "url": url, "quote": quote,
            })},
        ],
        "temperature": 0,
    }).encode()
    req = urllib.request.Request(
        OLLAMA_CLOUD_URL, data=body,
        headers={"Content-Type": "application/json",
                 "Authorization": "Bearer " + OLLAMA_CLOUD_KEY})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
            data = json.loads(resp.read().decode())
        content = data["choices"][0]["message"]["content"].strip()
        # Tolerate code-fenced JSON
        if content.startswith("```"):
            content = content.strip("`")
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except Exception:
        return None


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) < 1:
        return fail(3, {"error": "usage: eval-accuracy.py <slug> [stage]"})
    slug = args[0]
    stage = args[1] if len(args) > 1 else "build"

    handoff_path = HANDOFFS_DIR / slug / (stage + ".json")
    if not handoff_path.exists():
        return fail(3, {
            "error": f"handoff contract missing: {handoff_path}",
            "message": "Contract validation runs before evals — run/fix the contract first (fatal input for accuracy eval).",
        })
    try:
        handoff = json.loads(handoff_path.read_text())
    except json.JSONDecodeError as e:
        return fail(3, {"error": f"handoff contract unparseable: {e}"})

    sources = handoff.get("sources", [])
    if not sources:
        return fail(3, {
            "error": f"handoff has no sources[] evidence items: {handoff_path}",
            "message": "The contract requires >=1 {claim,url,quote} per provider — accuracy eval has nothing to check (fatal input).",
        })

    results = []
    model_errs = 0
    for i, s in enumerate(sources):
        claim = str(s.get("claim", ""))[:500]
        url = str(s.get("url", ""))[:300]
        quote = str(s.get("quote", ""))[:600]
        if not claim or not url or not quote:
            results.append({"index": i, "verdict": "UNSUPPORTED",
                            "reason": "missing claim/url/quote in evidence item",
                            "claim": claim, "url": url})
            continue
        verdict = check_source(claim, url, quote)
        if verdict is None or verdict.get("verdict") not in ("SUPPORTED", "UNSUPPORTED", "NOT_ENOUGH_INFO"):
            model_errs += 1
            results.append({"index": i, "verdict": "MODEL_ERROR",
                            "reason": str((verdict or {}).get("reason", "model call failed"))[:200],
                            "claim": claim, "url": url})
            continue
        results.append({
            "index": i,
            "verdict": verdict["verdict"],
            "reason": str(verdict.get("reason", ""))[:300],
            "claim": claim, "url": url, "quote": quote[:200],
        })

    if model_errs == len(sources) and len(sources) > 0:
        return fail(2, {
            "action": "eval_infra",
            "eval": "eval-accuracy",
            "slug": slug, "stage": stage,
            "model": CHECKER_MODEL,
            "message": "Checker model unreachable for all calls — treat as retryable infra, retry advance.",
        })

    unsupported = [r for r in results if r["verdict"] == "UNSUPPORTED"]
    model_errors = [r for r in results if r["verdict"] == "MODEL_ERROR"]
    judged = [r for r in results if r["verdict"] != "MODEL_ERROR"]
    nei = [r for r in judged if r["verdict"] == "NOT_ENOUGH_INFO"]
    nei_pct = round(100 * len(nei) / len(judged)) if judged else 0

    rejected = len(unsupported) > 0
    artifact = {
        "eval": "eval-accuracy",
        "slug": slug, "stage": stage,
        "model": CHECKER_MODEL,
        "sources_checked": len(sources),
        "model_errors": len(model_errors),
        "unsupported": len(unsupported),
        "not_enough_info_pct": nei_pct,
        "verdict": "rejected" if rejected else "approved",
        "results": results,
        "checked_at": datetime.now().astimezone().isoformat(timespec="seconds"),
    }
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    (ARTIFACTS_DIR / f"accuracy-{slug}-{stage}.json").write_text(json.dumps(artifact, indent=2))

    out = {
        "action": "eval_pass" if not rejected else "eval_rejected",
        "eval": "eval-accuracy",
        "slug": slug, "stage": stage,
        "model": CHECKER_MODEL,
        "sources_checked": len(sources),
        "unsupported": len(unsupported),
        "not_enough_info_pct": nei_pct,
        "model_errors": len(model_errors),
        "findings": unsupported,
        "artifact": str(ARTIFACTS_DIR / f"accuracy-{slug}-{stage}.json"),
        "message": (
            f"Accuracy eval REJECTED — {len(unsupported)} unsupported claim(s). Re-spawn the "
            f"{slug} {stage} worker with findings[] appended to its context: worker must "
            "re-verify each claim at its URL, fix the quote (or the claim), update the "
            "handoff sources[], then re-advance."
            if rejected else
            f"Accuracy eval approved ({len(sources)} sources judged, {nei_pct}% not-enough-info, "
            f"{len(model_errors)} model error(s) — errors are not verdicts; do not count as failures)."
        ),
    }
    return fail(1 if rejected else 0, out)


if __name__ == "__main__":
    sys.exit(main())