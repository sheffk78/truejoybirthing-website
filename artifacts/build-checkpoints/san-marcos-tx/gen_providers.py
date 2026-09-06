import json, base64, subprocess, os
from PIL import Image
import io

KEY = subprocess.check_output("grep -v '^#' ~/.hermes/secrets/openrouter-keys.txt | head -1 | tr -d ' \\n'", shell=True).decode().strip()

providers = {
    "greta": "Photorealistic professional headshot portrait of a warm, friendly woman in her 30s, a certified birth doula and childbirth educator, with shoulder-length brown hair, gentle smile, wearing a soft cream blouse, standing outdoors in a Texas Hill Country setting with soft golden light. Natural, approachable, professional. No text, no letters, no words.",
    "stephanie": "Photorealistic professional headshot portrait of a warm, confident woman in her 40s, a licensed midwife, with long brown hair, kind smile, wearing a soft sage green top, standing in a warm home-like setting with soft natural light. Natural, approachable, professional. No text, no letters, no words.",
    "grace": "Photorealistic professional headshot portrait of a friendly young woman in her 30s, a certified birth and postpartum doula, with blonde hair, warm smile, wearing a soft dusty rose blouse, standing in a bright warm setting with soft natural light. Natural, approachable, professional. No text, no letters, no words.",
    "brittany": "Photorealistic professional headshot portrait of a warm woman in her 30s, a certified postpartum and birth doula and lactation consultant, with dark hair, gentle smile, wearing a soft lavender top, standing in a warm home-like setting with soft natural light. Natural, approachable, professional. No text, no letters, no words.",
}

for key, prompt in providers.items():
    out = f"/tmp/sanmarcos_{key}.json"
    cmd = ["curl", "-s", "-m", "120", "https://openrouter.ai/api/v1/images/generations",
           "-H", f"Authorization: Bearer {KEY}", "-H", "Content-Type: application/json",
           "-d", json.dumps({"model": "google/gemini-3.1-flash-image", "prompt": prompt, "n": 1, "size": "1024x1024"})]
    subprocess.run(cmd, stdout=open(out, "w"))
    try:
        d = json.load(open(out))
        b64 = d["data"][0]["b64_json"]
        img = Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")
        # square crop to 400x400
        w, h = img.size
        s = min(w, h)
        x = (w - s) // 2; y = (h - s) // 2
        img2 = img.crop((x, y, x + s, y + s)).resize((400, 400), Image.LANCZOS)
        img2.save(f"public/images/provider-san-marcos-tx-{key}.webp", "WEBP", quality=85)
        print(f"{key}: saved {img2.size}")
    except Exception as e:
        print(f"{key}: FAILED {e}")
        print(open(out).read()[:300])
