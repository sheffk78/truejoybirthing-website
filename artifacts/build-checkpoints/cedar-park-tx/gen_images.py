import json, base64, subprocess, os, io
from PIL import Image

def get_key():
    return subprocess.check_output("grep -v '^#' ~/.hermes/secrets/openrouter-keys.txt | head -1 | tr -d ' \\n'", shell=True).decode().strip()

KEY=None
def gen(prompt, size="1024x1024", out="/tmp/cp_img.json"):
    global KEY
    if KEY is None:
        KEY = get_key()
    cmd = ["curl","-s","-m","240","https://openrouter.ai/api/v1/images/generations",
           "-H", f"Authorization: Bearer {KEY}", "-H","Content-Type: application/json",
           "-d", json.dumps({"model":"google/gemini-3.1-flash-image","prompt":prompt,"n":1,"size":size})]
    subprocess.run(cmd, stdout=open(out,"w"))
    d=json.load(open(out))
    if "data" not in d or "b64_json" not in d["data"][0]:
        raise SystemExit(f"API error: {json.dumps(d)[:500]}")
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

# HERO: pregnant silhouette + Cedar Park Hill Country landscape (3:2 1200x800)
hero_prompt = (
 "Real photograph, shot on 35mm film. Silhouette of a pregnant woman in profile, standing on a gentle "
 "rise at sunset, hands on her belly, against a warm golden-hour Texas Hill Country landscape representing "
 "Cedar Park, Texas. In the softly blurred background, live oaks and cedar trees, rolling limestone hills, "
 "the low rooftops of a growing Austin suburb, and a warm amber sky with soft clouds. Golden hour glow, "
 "peaceful and hopeful, cinematic. Photorealistic, no text, no letters, no words, no captions, no signage.")
hero_b64 = gen(hero_prompt)
save_img(hero_b64, "public/images/cedar-park-tx-birth-doula-hero-v2.webp", 1200, 800, 3, 2)
# save to heroes dir too (R11)
os.makedirs("public/images/heroes", exist_ok=True)
save_img(hero_b64, "public/images/heroes/cedar-park-tx-birth-doula-hero-v2.webp", 1200, 800, 3, 2)
# OG derived from hero 1200x630
save_img(hero_b64, "public/images/og-city-cedar-park-tx-v2.webp", 1200, 630, 1200, 630)
print("DONE hero (main+heroes) and OG")

# SUPPORT scene: ONE pregnant mom + ONE professional, 4:3 1024x768
support_prompt = (
 "Real photograph, shot on 35mm film. A single pregnant woman at home in Cedar Park, Texas, seated on a "
 "couch, warmly supported by one professional doula crouched beside her, the doula gently guiding her "
 "through breathing exercises. Soft natural window light, warm and reassuring mood, cozy modern Texas "
 "home. The pregnant woman has a visible baby bump. Exactly ONE pregnant woman and ONE support professional. "
 "Photorealistic, no text, no letters, no words, no captions.")
support_b64 = gen(support_prompt)
save_img(support_b64, "public/images/cedar-park-tx-birth-doula-support-v2.webp", 1024, 768, 4, 3)
print("DONE support")
