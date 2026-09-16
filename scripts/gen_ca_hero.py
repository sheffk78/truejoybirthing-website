import json, base64, subprocess, sys, os
from PIL import Image

REPO = '/Users/socializerender/Projects/truejoybirthing-website'
KEY = subprocess.run(['sed','-n','6p','/Users/socializerender/.hermes/secrets/openrouter-keys.txt'],capture_output=True,text=True).stdout.strip()

CITIES = {
 'newport-beach-ca': 'Newport Beach California pier and harbor at golden hour, coastal cityscape with the Balboa Pier, palm trees and sailboats',
 'la-habra-ca': 'La Habra California quiet suburban downtown with hills in the background, small-town main street character',
 'san-mateo-ca': 'San Mateo California downtown with the historic San Mateo bridge and bay views, Bay Area character',
 'palo-alto-ca': 'Palo Alto California Stanford-adjacent downtown with leafy streets and Stanford Tower (Hoover Tower) silhouette in the distance',
 'redwood-city-ca': 'Redwood City California waterfront downtown with the marina and redwood trees, San Francisco Bay character',
 'burlingame-ca': 'Burlingame California downtown with its famous eucalyptus-lined avenue and charming boutiques, Bay Area peninsula character',
}
TEMPLATE = ("Soft watercolor-style illustration of {scene}, warm cream background (#FAF8F5), "
 "muted rose and lavender accents (#D8A0C4, #EDE5F5), gentle calm mood, maternal healthcare warmth, "
 "no text in image, 3:2 landscape composition, watercolor illustration style, no photo-realism, no blue palette")

def gen(slug, scene):
    payload = json.dumps({"model":"google/gemini-3.1-flash-image",
        "messages":[{"role":"user","content":TEMPLATE.format(scene=scene)}],
        "modalities":["image","text"]}).encode()
    r = subprocess.run(['curl','-s','--max-time','380','https://openrouter.ai/api/v1/chat/completions',
        '-H',f'Authorization: Bearer {KEY}','-H','Content-Type: application/json','-d',payload],
        capture_output=True, text=True)
    d = json.loads(r.stdout)
    if 'error' in d:
        return None, str(d['error'])[:150]
    msg = (d.get('choices') or [{}])[0].get('message', {})
    images = msg.get('images') or []
    if not images:
        return None, 'no images in response'
    b64 = images[0]['image_url']['url'].split(',',1)[-1]
    raw = base64.b64decode(b64)
    raw_path = f'/tmp/{slug}_hero_raw.jpg'
    open(raw_path,'wb').write(raw)
    img = Image.open(raw_path).convert('RGB')
    print(f'  raw size: {img.size}')
    # 3:2 crop 1200x800
    w, h = img.size
    target = 1.5
    if w/h > target:
        nw = int(h*target); x = (w-nw)//2; img = img.crop((x,0,x+nw,h))
    else:
        nh = int(w/target); y = (h-nh)//2; img = img.crop((0,y,w,y+nh))
    img = img.resize((1200,800), Image.LANCZOS)
    out = f'{REPO}/public/images/{slug}-birth-doula-skyline.webp'
    img.save(out,'WEBP',quality=90,method=6)
    size = os.path.getsize(out)
    return size, None

only = sys.argv[1:] or list(CITIES)
for slug in only:
    try:
        size, err = gen(slug, CITIES[slug])
        print(f'{slug}: {size} bytes' if size else f'{slug}: FAIL {err}')
    except Exception as e:
        print(f'{slug}: EXC {type(e).__name__} {str(e)[:120]}')
