import json, base64, subprocess, os
from PIL import Image
import io

def get_key():
    return subprocess.check_output("grep -v '^#' ~/.hermes/secrets/openrouter-keys.txt | head -1 | tr -d ' \\n'", shell=True).decode().strip()

def gen(prompt, size="1024x1024", out="/tmp/pl_img.json"):
    cmd = ["curl","-s","-m","180","https://openrouter.ai/api/v1/images/generations",
           "-H", f"Authorization: Bearer {get_key()}", "-H","Content-Type: application/json",
           "-d", json.dumps({"model":"google/gemini-3.1-flash-image","prompt":prompt,"n":1,"size":size})]
    subprocess.run(cmd, stdout=open(out,"w"))
    d=json.load(open(out))
    return base64.b64decode(d["data"][0]["b64_json"])

def save_img(b64, path, out_w, out_h, aspect_w, aspect_h):
    img = Image.open(io.BytesIO(b64)).convert("RGB")
    w,h = img.size
    target = aspect_w/aspect_h
    if w/h > target:
        nw=int(h*target); x=(w-nw)//2; img2=img.crop((x,0,x+nw,h))
    else:
        nh=int(w/target); y=(h-nh)//2; img2=img.crop((0,y,w,y+nh))
    img2=img2.resize((out_w,out_h), Image.LANCZOS)
    img2.save(path,"WEBP",quality=88)
    print("saved", path, img2.size)

# HERO: pregnant silhouette + Pearland landscape (3:2 1200x800)
hero_prompt = ("Photorealistic silhouette of a pregnant woman in profile, standing on a gentle rise at "
 "sunset, hands resting on her belly, against a warm golden-hour landscape of suburban Pearland, Texas. "
 "In the background, soft palm trees and live oaks, the low roofline of a growing Houston suburb, and warm "
 "amber sky with soft clouds. Golden hour glow, peaceful and hopeful, cinematic. Photorealistic, no text, "
 "no letters, no words, no captions.")
hero_b64 = gen(hero_prompt)
# hero 3:2
save_img(hero_b64, "public/images/pearland-tx-birth-doula-skyline-v2.webp", 1200, 800, 3, 2)
# support 4:3 (crop, never distort) - ONE pregnant woman
save_img(hero_b64, "public/images/pearland-tx-birth-doula-support-v2.webp", 1024, 768, 4, 3)
# OG derived from hero 1200x630
save_img(hero_b64, "public/images/og-city-pearland-tx-v2.webp", 1200, 630, 1200, 630)
print("DONE hero/support/og")
