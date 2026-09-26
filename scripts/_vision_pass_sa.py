#!/usr/bin/env python3
"""Vision pass for san-antonio-tx hero/support/og/thumb crops via Gemini 2.5 Flash.
Produces artifacts/gates/vision/san-antonio-tx.json verdict file.
FAIL-CLOSED: any API error or defect keyword => verdict 'fail'.
"""
import os, json, sys
from google import genai
from google.genai import types

HOME = os.path.expanduser("~")
api_key = None
with open(os.path.join(HOME, ".hermes/.env")) as f:
    for line in f:
        line = line.strip()
        if line.startswith("GEMINI_API_KEY="):
            api_key = line.split("=", 1)[1].strip()
            break
if not api_key:
    print("ERROR: no GEMINI_API_KEY"); sys.exit(1)

client = genai.Client(api_key=api_key)

CROP_DIR = "/tmp/tjb-vision-crops"
OUT = "artifacts/gates/vision/san-antonio-tx.json"

crops = [
    "san-antonio-tx-hero-fig0.png",
    "san-antonio-tx-hero-fig1.png",
    "san-antonio-tx-hero-fig2.png",
    "san-antonio-tx-hero-fig3.png",
    "san-antonio-tx-support-fig0.png",
    "san-antonio-tx-og-fig0.png",
    "san-antonio-tx-thumb-fig0.png",
]

PROMPT = """You are a meticulous human-figure anatomy QA inspector for pregnancy/birth brand imagery.
This is a zoom crop of a pregnant-woman silhouette or supportive-figure scene (may be a dark silhouette).
Output ONLY a JSON object, nothing else, with this exact shape:
{"verdict":"pass"|"fail","reason":"one short sentence"}
Rules:
- A side-profile or fully-silhouetted figure with one arm hidden behind the body is NORMAL -> pass.
- Only emit verdict "fail" if there is a concrete anatomical defect: a phantom/extra/missing arm (beyond one arm hidden in silhouette), fused/melted/extra fingers, two separate bodies improperly merged into one, a second head, or a belly in a wrong position.
- Do NOT fail just because the figure is a silhouette or only an edge is visible.
Be literal and strict about real defects only."""

verdicts = []
for c in crops:
    p = os.path.join(CROP_DIR, c)
    if not os.path.exists(p):
        print("MISSING", c); verdicts.append({"crop": c, "verdict": "fail", "analysis": "file missing"}); continue
    try:
        img = open(p, "rb").read()
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=PROMPT),
                        types.Part.from_bytes(data=img, mime_type="image/png"),
                    ],
                )
            ],
        )
        text = resp.text or ""
        # Extract JSON verdict
        import re as _re
        m = _re.search(r'\{[^{}]*"verdict"\s*:\s*"(pass|fail)"[^{}]*\}', text)
        if m:
            obj = json.loads(m.group(0))
            verdict = obj["verdict"]
            reason = obj.get("reason", "")
        else:
            verdict = "fail"
            reason = f"no json verdict parsed; raw: {text[:200]}"
    except Exception as e:
        verdict = "fail"
        reason = f"ERROR: {e}"
    verdicts.append({"crop": c, "verdict": verdict, "analysis": (reason or text).strip()[:600]})
    print(f"\n=== {c} -> {verdict} ===")
    print((reason or text).strip()[:300])

overall = "pass" if all(v["verdict"] == "pass" for v in verdicts) else "fail"
result = {"slug": "san-antonio-tx", "verdicts": verdicts, "overall": overall, "checked_at": "2026-09-26"}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w") as f:
    json.dump(result, f, indent=2)
print(f"\nWROTE {OUT} overall={overall}")
