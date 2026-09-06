#!/usr/bin/env python3
"""TJB AI-slop gate — deterministic eval classifier (Agency OS Layer 1).

Zero-AI, zero-tolerance blacklist + regex scan of a city's copy in cities.ts.
Mirrors Simon Høiberg's "slop gate": normal code catches generic AI writing,
no model needed. Wired into preflight-stage-gate.py as LOCAL_EVAL_SLOP (build).

Usage:
  python3 scripts/eval-slop-gate.py {slug}            # gate mode: exit 0/1
  python3 scripts/eval-slop-gate.py {slug} --text "…"
  python3 scripts/eval-slop-gate.py --calibrate       # scan ALL cities, report

Two tiers:
  HARD (fail): unmistakable AI-slop constructions — auto-reject.
  WARN (report): borderline clichés — counted, surfaced, not blocking.

Exit codes match the pipeline contract: 0 pass, 1 fail (retryable).
"""

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tjb_contracts import city_block, field, array_blocks  # noqa: E402

# --- Tier 1: HARD slop (auto-fail) — regex, case-insensitive -----------------
HARD_PATTERNS = [
    (r"\bit'?s not (?:just |merely |only )?[\w\s]{2,30}[,;.!?-]+\s*(?:it'?s|but)\s+(?:about\s+)?[\w\s]{2,40}",
     "'it's not X, it's Y' AI construction"),
    (r"\blook no further\b", "'look no further' filler"),
    (r"\bthe part (?:everyone|most people|people) (?:is |are )?missing\b", "'the part everyone's missing' hook-slop"),
    (r"\bhere'?s (?:the|what).{0,30}(?:thing|kicker|deal)\b", "'here's the thing' filler"),
    (r"\b(?:game[- ]?chang(?:er|ing))\b", "buzzword: game-changer"),
    (r"\bunlock (?:the )?(?:secrets?|power|full potential)\b", "buzzword: unlock the secrets/power"),
    (r"\bin today'?s (?:fast[- ]paced|modern|digital|busy)\b", "boilerplate opener: in today's fast-paced world"),
    (r"\b(?:revolutioniz|transform)(?:e|ing) (?:the )?(?:way|landscape|world)\b", "buzzword: revolutionize/transform the way"),
    (r"\bseamlessly (?:blend|integrat|combin)\w*\b", "buzzword: seamlessly blend/integrate"),
    (r"\b(?:a )?testament to\b", "cliché: testament to"),
    (r"\bvibrant tapestry\b", "cliché: vibrant tapestry"),
    (r"\byour (?:one[- ]stop|go[- ]to) (?:shop|destination|resource) for\b", "cliché: one-stop shop/destination"),
    (r"\bdive (?:deep|in)(?:to)?\b.{0,20}\b(?:world|realm)\b", "cliché: dive into the world"),
    (r"\bwhen it comes to\b.{0,40}\byou can (?:trust|count|rely)\b", "cliché combo: when it comes to... you can rely"),
    (r"\bdon'?t (?:just )?take (?:our|my) word for it\b", "cliché: don't take our word for it"),
    (r"\bcutting[- ]edge\b", "buzzword: cutting-edge"),
    (r"\belevate your\b", "buzzword: elevate your"),
    (r"\bunparalleled\b", "buzzword: unparalleled"),
    (r"\bwe'?ve got you covered\b", "cliché: we've got you covered"),
    (r"\bembark on (?:a|the|your)\b.{0,25}\bjourney\b", "cliché: embark on a journey"),
]

# --- Tier 2: WARN (borderline cliché — report, don't block) ------------------
WARN_PATTERNS = [
    (r"\bnestled\b", "nestled"),
    (r"\bin the heart of\b", "in the heart of"),
    (r"\bvibrant\b", "vibrant"),
    (r"\bbustling\b", "bustling"),
    (r"\bhidden gem\w*\b", "hidden gem"),
    (r"\bboasts?\b", "boasts"),
    (r"\brich (?:history|tapestry|heritage)\b", "rich history/tapestry"),
    (r"\bbustles? with\b", "bustles with"),
]


def scan(text: str) -> dict:
    hard, warn = [], []
    for pat, label in HARD_PATTERNS:
        for m in re.finditer(pat, text, re.I):
            ctx = text[max(0, m.start() - 40):m.end() + 40].replace("\n", " ").strip()
            hard.append({"rule": label, "match": m.group(0), "context": f"...{ctx}..."})
    for pat, label in WARN_PATTERNS:
        hits = re.findall(pat, text, re.I)
        if hits:
            warn.append({"rule": label, "count": len(hits)})
    return {"hard": hard, "warn": warn}


def scan_city(slug: str) -> dict:
    """Scan a city's copy fields from cities.ts (block-level)."""
    b = city_block(slug)
    if not b:
        return {"error": f"no cities.ts entry for {slug}"}
    # copy-bearing fields: culture, medicaidNote, midwifeInfo paragraphs,
    # provider descriptions, hospital/birth-center paragraphs, FAQ answers
    chunks = []
    for f in ("culture", "medicaidNote", "supportSceneAlt", "costContext", "heroLocalDetail"):
        v = field(b, f)
        if isinstance(v, str):
            chunks.append(v)
    for arr in ("localDoulas", "hospitalDetails", "birthCenterDetails", "faqs"):
        for o in array_blocks(b, arr):
            for key in ("description", "paragraph", "answer", "question", "costContext"):
                m = re.search(rf'\b{key}:\s*"((?:[^"\\]|\\.)*)"', o)
                if m:
                    chunks.append(m.group(1))
    result = scan(" \n".join(chunks))
    result["slug"] = slug
    result["fields_scanned"] = len(chunks)
    result["chars_scanned"] = sum(len(c) for c in chunks)
    result["pass"] = len(result["hard"]) == 0
    return result


def main():
    args = sys.argv[1:]
    if args and args[0] == "--calibrate":
        import tjb_contracts
        txt = tjb_contracts.CITIES_TS.read_text(errors="replace")
        slugs = re.findall(r'"([a-z-]+-[a-z]{2})": \{', txt)
        bad, warn_ct = [], 0
        for s in sorted(set(slugs)):
            r = scan_city(s)
            if r.get("hard"):
                bad.append((s, [h["rule"] for h in r["hard"]]))
            warn_ct += 1 if r.get("warn") else 0
        print(json.dumps({
            "cities_scanned": len(set(slugs)),
            "hard_failures": bad,
            "hard_failure_count": len(bad),
            "cities_with_warn_hits": warn_ct,
        }, indent=2))
        sys.exit(0)

    if args and args[0] == "--text":
        r = scan(" ".join(args[1:]))
    else:
        if not args:
            print("Usage: eval-slop-gate.py {slug} | --text \"...\" | --calibrate")
            sys.exit(1)
        r = scan_city(args[0])

    out = {
        "gate": "LOCAL_EVAL_SLOP",
        "pass": bool(r.get("pass")),
        "hard_violations": r.get("hard", []),
        "warnings": r.get("warn", []),
        "message": (
            f"slop gate {'FAIL' if r.get('hard') else 'PASS'}: "
            f"{len(r.get('hard', []))} hard, {len(r.get('warn', []))} warn"
        ) + (f" | fields={r.get('fields_scanned')}" if "fields_scanned" in r else ""),
    }
    if "error" in r:
        out.update({"pass": False, "hard_violations": [r["error"]], "message": f"slop gate FAIL: {r['error']}"})
    print(json.dumps(out, indent=2))
    sys.exit(0 if out["pass"] else 1)


if __name__ == "__main__":
    main()