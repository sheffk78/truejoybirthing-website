import json, base64, subprocess
from PIL import Image
import io

KEY = subprocess.check_output("grep -v '^#' ~/.hermes/secrets/openrouter-keys.txt | head -1 | tr -d ' \n'", shell=True).decode().strip()

def gen(prompt, out):
    cmd = ["curl","-s","-m","180","https://openrouter.ai/api/v1/images/generations",
           "-H", f"Authorization: Bearer {KEY}", "-H","Content-Type: application/json",
           "-d", json.dumps({"model":"google/gemini-3.1-flash-image","prompt":prompt,"n":1,"size":"1024x1024"})]
    subprocess.run(cmd, stdout=open(out,"w"))
    d=json.load(open(out))
    return base64.b64decode(d["data"][0]["b64_json"])

def crop_4x3(b64, path):
    img = Image.open(io.BytesIO(b64)).convert("RGB")
    w,h=img.size
    target=4/3
    if w/h>target:
        nw=int(h*target); x=(w-nw)//2; img2=img.crop((x,0,x+nw,h))
    else:
        nh=int(w/target); y=(h-nh)//2; img2=img.crop((0,y,w,y+nh))
    img2=img2.resize((400,300), Image.LANCZOS)
    img2.save(path,"WEBP",quality=85)
    print("saved",path,img2.size)

hospitals = {
  "hca-pearland": "Photorealistic photograph of the exterior of HCA Houston Healthcare Pearland, a modern acute care hospital with a clean facade, glass entrance canopy, and landscaped driveway with palm trees, clear Texas sky, warm daylight. No people, no text, no signs, no logos.",
  "memorial-hermann-pearland": "Photorealistic photograph of the exterior of Memorial Hermann Pearland Hospital, a contemporary suburban hospital building with warm brick and glass facade, landscaped entrance, parking, live oaks, clear blue Texas sky, daylight. No people, no text, no signs, no logos.",
}
for key, prompt in hospitals.items():
    b64 = gen(prompt, f"/tmp/pl_{key}.json")
    crop_4x3(b64, f"public/images/pearland-tx-{key}.webp")

# birth center
bc_prompt = "Photorealistic photograph of the exterior of a small freestanding birth center in a Texas suburb, a cozy single-story craftsman-style building with a welcoming porch, potted plants, warm afternoon light. No people, no text, no signs, no logos."
crop_4x3(gen(bc_prompt, "/tmp/pl_bc.json"), "public/images/pearland-tx-in-bloom-birth-center.webp")
print("DONE hospitals + birth center")
