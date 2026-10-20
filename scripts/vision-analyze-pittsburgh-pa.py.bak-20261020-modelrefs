#!/usr/bin/env python3
"""Real vision analysis of pittsburgh-pa figure crops via ollama (atlas vision).
Writes verdict file ONLY from actual model output. No fabricated verdicts."""
import base64, json, sys, urllib.request
from datetime import datetime, timezone

OLLAMA = "http://localhost:11434/api/chat"
MODEL = "atlas:latest"
CROP_DIR = "/tmp/tjb-vision-crops"
OUT = "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website/artifacts/gates/vision/pittsburgh-pa.json"

CROPS = [
    "pittsburgh-pa-hero-fig0.png",
    "pittsburgh-pa-hero-fig1.png",
    "pittsburgh-pa-hero-fig2.png",
    "pittsburgh-pa-support-fig0.png",
    "pittsburgh-pa-thumb-fig0.png",
    "pittsburgh-pa-og-fig0.png",
]

PROMPT = (
    "You are a strict image-defect inspector for AI-generated people figures. "
    "Examine this zoomed crop carefully and answer ONLY in JSON: "
    '{"figure_count": <int people visible>, "arms": <total arms visible>, '
    '"anomaly_notes": "<describe any fused/extra fingers, wrong arm count, melted joints, '
    'distorted faces, floating limbs, or impossible anatomy; empty string if none>", '
    '"verdict": "pass" or "fail"}. '
    "Rules: fail only if an anatomical DEFECT is visible in the artwork itself "
    "(extra/missing/fused fingers or limbs, melted joints, deformed face). A limb "
    "that runs past the CROP EDGE is truncation by the crop, not a missing limb — "
    "check whether the figure continues beyond the boundary before failing. Do not "
    "be agreeable; report what you actually see."
)


def analyze(crop: str) -> dict:
    with open(f"{CROP_DIR}/{crop}", "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": PROMPT, "images": [b64]}],
        "stream": False,
        "options": {"temperature": 0},
    }).encode()
    req = urllib.request.Request(OLLAMA, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        resp = json.load(r)
    text = resp.get("message", {}).get("content", "")
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        return {"raw": text, "parse_error": True}
    try:
        parsed = json.loads(text[start:end + 1])
    except json.JSONDecodeError:
        return {"raw": text, "parse_error": True}
    return parsed


def main():
    results = []
    for crop in CROPS:
        print(f"analyzing {crop} ...", flush=True)
        r = analyze(crop)
        r["crop"] = crop
        results.append(r)
        print(json.dumps(r)[:200], flush=True)
    verdicts = [{"crop": r["crop"],
                 "verdict": r.get("verdict", "fail"),
                 "defects": ([r["anomaly_notes"]] if r.get("anomaly_notes") else [])}
                for r in results]
    out = {"slug": "pittsburgh-pa", "verdicts": verdicts,
           "checked_at": datetime.now(timezone.utc).isoformat(),
           "model": MODEL, "raw": results}
    with open(OUT, "w") as f:
        json.dump(out, f, indent=2)
    fails = [v for v in verdicts if v["verdict"] != "pass"]
    print(f"\nwrote {OUT}")
    print(f"summary: {len(verdicts) - len(fails)} pass, {len(fails)} fail")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())