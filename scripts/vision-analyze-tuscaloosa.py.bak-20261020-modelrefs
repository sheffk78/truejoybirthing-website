#!/usr/bin/env python3
"""Real vision analysis of tuscaloosa-al figure crops via ollama (atlas vision).
Writes verdict file ONLY from actual model output. No fabricated verdicts."""
import base64, json, sys, urllib.request
from datetime import datetime, timezone

OLLAMA = "http://localhost:11434/api/chat"
MODEL = "atlas:latest"
CROP_DIR = "/tmp/tjb-vision-crops"
OUT = "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website/artifacts/gates/vision/tuscaloosa-al.json"

CROPS = [
    "tuscaloosa-al-hero-fig0.png",
    "tuscaloosa-al-support-fig0.png",
    "tuscaloosa-al-og-fig0.png",
    "tuscaloosa-al-thumb-fig0.png",
]

PROMPT = (
    "You are a strict image-defect inspector for AI-generated people figures. "
    "Examine this zoomed crop carefully and answer ONLY in JSON: "
    '{"figure_count": <int people visible>, "arms": <total arms visible>, '
    '"anomaly_notes": "<describe any fused/extra fingers, wrong arm count, melted joints, '
    'distorted faces, floating limbs, or impossible anatomy; empty string if none>", '
    '"verdict": "pass" or "fail"}. '
    'Rules: fail if any anatomical defect is visible (extra/missing/fused fingers or limbs, '
    'melted joints, deformed face). Do not be agreeable; report what you actually see.'
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
    # extract JSON from model output
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        return {"raw": text, "parse_error": True}
    try:
        parsed = json.loads(text[start:end + 1])
        parsed["raw"] = text
        return parsed
    except json.JSONDecodeError:
        return {"raw": text, "parse_error": True}


def main():
    verdicts, all_ok = [], True
    for crop in CROPS:
        try:
            r = analyze(crop)
        except Exception as e:
            print(f"  ERROR {crop}: {e}", file=sys.stderr)
            all_ok = False
            verdicts.append({"crop": crop, "verdict": "error", "defects": [f"vision call failed: {e}"]})
            continue
        pe = r.get("parse_error")
        verdict = r.get("verdict", "").lower()
        notes = r.get("anomaly_notes", "")
        if pe or verdict not in ("pass", "fail"):
            # unparseable model output is NOT a pass — mark for human review
            all_ok = False
            verdicts.append({"crop": crop, "verdict": "unparseable",
                             "defects": [f"model output not JSON: {r.get('raw', '')[:200]}"]})
            print(f"  UNPARSEABLE {crop}: {r.get('raw', '')[:120]}")
            continue
        defects = [notes] if (verdict == "pass" and notes) or verdict == "fail" else ([notes] if notes else [])
        if verdict == "fail":
            all_ok = False
        verdicts.append({"crop": crop, "verdict": verdict, "defects": defects,
                         "figure_count": r.get("figure_count"), "arms_seen": r.get("arms")})
        print(f"  {verdict.upper():6} {crop}  figs={r.get('figure_count')} arms={r.get('arms')} notes={notes[:80]}")

    out = {"slug": "tuscaloosa-al", "verdicts": verdicts,
           "checked_at": datetime.now(timezone.utc).isoformat(),
           "method": "ollama atlas:latest vision, temp=0, per-crop figure anatomy inspection"}
    with open(OUT, "w") as f:
        json.dump(out, f, indent=1)
    print(f"wrote {OUT}")
    sys.exit(0 if all_ok else 2)


if __name__ == "__main__":
    main()