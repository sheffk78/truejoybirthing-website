import json, base64, subprocess
from PIL import Image
import io

KEY = subprocess.check_output("grep -v '^#' ~/.hermes/secrets/openrouter-keys.txt | head -1 | tr -d ' \\n'", shell=True).decode().strip()
prompt = "Photorealistic photograph of the exterior of a modern community hospital in Texas Hill Country, a clean contemporary medical building with warm brick and glass facade, landscaped entrance with live oak trees, clear blue sky, golden afternoon light. No people, no text, no letters, no signs, no words, no logos."
out = "/tmp/sanmarcos_hospital.json"
cmd = ["curl", "-s", "-m", "120", "https://openrouter.ai/api/v1/images/generations",
       "-H", f"Authorization: Bearer {KEY}", "-H", "Content-Type: application/json",
       "-d", json.dumps({"model": "google/gemini-3.1-flash-image", "prompt": prompt, "n": 1, "size": "1024x1024"})]
subprocess.run(cmd, stdout=open(out, "w"))
d = json.load(open(out))
b64 = d["data"][0]["b64_json"]
img = Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")
# 4:3 landscape crop to 400x300
w, h = img.size
target = 4/3
if w/h > target:
    nw = int(h*target); x=(w-nw)//2; img2 = img.crop((x,0,x+nw,h))
else:
    nh = int(w/target); y=(h-nh)//2; img2 = img.crop((0,y,w,y+nh))
img2 = img2.resize((400,300), Image.LANCZOS)
img2.save("public/images/san-marcos-tx-hospital-christus-santa-rosa.webp", "WEBP", quality=85)
print("hospital thumb saved", img2.size)
