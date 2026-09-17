#!/usr/bin/env python3
"""Generate 3 on-brand watercolor provider avatars for la-habra-ca practices.

Reuses the OpenRouter gemini image pattern from gen_ca_hero.py.
Outputs 300x300 webp into public/images/.
"""
import json, base64, subprocess, sys, os
from PIL import Image

REPO = '/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website'
KEY = subprocess.run(['sed','-n','6p','/Users/socializerender/.hermes/secrets/openrouter-keys.txt'],
                     capture_output=True, text=True).stdout.strip()

# (filename slug, practice name, scene description)
PROVIDERS = [
    ('aloha-lamaze',
     'Aloha Lamaze and Breastfeeding Services',
     'a warm serene lactation and breastfeeding support scene with tropical aloha flowers and a calm mother holding a newborn, soft Hawaii warmth'),
    ('temple-terrain',
     'Temple & Terrain Doula Services',
     'an earthy natural outdoor doula support scene with rolling terrain, stones, plants and a calm nurturing presence, grounded organic mood'),
    ('newborn-nurtury',
     'Newborn Nurtury Doula Services',
     'a cozy newborn nursery scene with a peacefully sleeping baby, soft blanket, gentle lamplight and tender care, warm nursery mood'),
]

TEMPLATE = (
    "Soft watercolor-style square illustration of {scene}, warm cream background (#FAF8F5), "
    "muted rose and lavender accents (#D8A0C4, #EDE5F5), gentle calm maternal healthcare warmth, "
    "centered subject with soft edges, no text in image, square composition, "
    "watercolor illustration style, no photo-realism, no blue palette"
)

def gen(slug, scene):
    payload = json.dumps({"model": "google/gemini-3.1-flash-image",
        "messages": [{"role": "user", "content": TEMPLATE.format(scene=scene)}],
        "modalities": ["image", "text"]}).encode()
    r = subprocess.run(['curl', '-s', '--max-time', '380',
        'https://openrouter.ai/api/v1/chat/completions',
        '-H', f'Authorization: Bearer {KEY}', '-H', 'Content-Type: application/json',
        '-d', payload], capture_output=True, text=True)
    try:
        d = json.loads(r.stdout)
    except Exception:
        return None, 'bad json: ' + r.stdout[:120]
    if 'error' in d:
        return None, str(d['error'])[:150]
    msg = (d.get('choices') or [{}])[0].get('message', {})
    images = msg.get('images') or []
    if not images:
        return None, 'no images in response'
    b64 = images[0]['image_url']['url'].split(',', 1)[-1]
    raw = base64.b64decode(b64)
    raw_path = f'/tmp/{slug}_prov_raw.png'
    open(raw_path, 'wb').write(raw)
    img = Image.open(raw_path).convert('RGB')
    # center-crop to square then resize to 300x300
    w, h = img.size
    s = min(w, h)
    img = img.crop(((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2))
    img = img.resize((300, 300), Image.LANCZOS)
    out = f'{REPO}/public/images/provider-la-habra-ca-{slug}.webp'
    img.save(out, 'WEBP', quality=90, method=6)
    return os.path.getsize(out), None

for slug, name, scene in PROVIDERS:
    try:
        size, err = gen(slug, scene)
        print(f'{name}: {"%d bytes" % size if size else "FAIL " + str(err)}')
    except Exception as e:
        print(f'{name}: EXC {type(e).__name__} {str(e)[:120]}')
