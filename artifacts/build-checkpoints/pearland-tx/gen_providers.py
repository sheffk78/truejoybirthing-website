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

def square400(b64, path):
    img = Image.open(io.BytesIO(b64)).convert("RGB")
    w,h=img.size; s=min(w,h)
    x=(w-s)//2; y=(h-s)//2
    img2=img.crop((x,y,x+s,y+s)).resize((400,400), Image.LANCZOS)
    img2.save(path,"WEBP",quality=85)
    print("saved",path,img2.size)

providers = {
  "samentha-alarcon": "Photorealistic professional headshot portrait of a warm Black woman in her 30s, a certified birth doula, with a gentle smile and braided or natural hair, wearing a soft rose top, standing in a bright home setting with soft natural light. Approachable, professional. No text, no letters.",
  "elissa-hinson": "Photorealistic professional headshot portrait of a warm white woman in her 30s, a certified birth doula, with shoulder-length brown hair and a kind smile, wearing a soft cream blouse, outdoors in warm Texas golden light. Approachable, professional. No text, no letters.",
  "in-bloom-midwifery": "Photorealistic professional headshot portrait of a warm woman in her 40s, a licensed midwife in Pearland Texas, with long dark hair and a caring smile, wearing a soft sage green top, in a calm home-like setting with soft natural light. Approachable, professional. No text, no letters.",
}
for key, prompt in providers.items():
    b64 = gen(prompt, f"/tmp/pl_{key}.json")
    square400(b64, f"public/images/provider-pearland-tx-{key}.webp")
print("DONE providers")
