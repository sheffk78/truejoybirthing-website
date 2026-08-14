#!/usr/bin/env python3
import base64, json, os, sys
from PIL import Image

# Decode base64 JPEG from OpenRouter
with open('/tmp/arvada_hero.json') as f:
    data = json.load(f)
b64 = data['data'][0]['b64_json']
img_bytes = base64.b64decode(b64)

# Save raw JPEG temporarily
raw_path = '/tmp/arvada_hero_raw.jpg'
with open(raw_path, 'wb') as f:
    f.write(img_bytes)

# Open with PIL
img = Image.open(raw_path)
print(f"Raw image size: {img.size}, mode: {img.mode}")

# --- Hero image: 1200x800, pregnant silhouette + Arvada city landscape ---
hero = img.copy().convert('RGB')
hero = hero.resize((1200, 800), Image.LANCZOS)
hero_path = 'public/images/arvada-co-birth-doula-hero-v1.webp'
hero.save(hero_path, 'webp', quality=90)
print(f"Hero saved: {hero_path}")

# Also save 600px version
hero_600 = hero.copy()
hero_600 = hero_600.resize((600, 400), Image.LANCZOS)
hero_600_path = 'public/images/arvada-co-birth-doula-hero-v1-600.webp'
hero_600.save(hero_600_path, 'webp', quality=85)
print(f"Hero 600 saved: {hero_600_path}")

# Convert hero to AVIF using ffmpeg/cavif if available, otherwise skip
for src, dst in [
    (hero_path, 'public/images/arvada-co-birth-doula-hero.avif'),
    (hero_600_path, 'public/images/arvada-co-birth-doula-hero-600.avif'),
]:
    if os.path.exists(dst):
        os.remove(dst)
    # Use ffmpeg if available to create avif from webp
    ret = os.system(f'ffmpeg -i {src} -c:v libaom-av1 -still-picture 1 -crf 30 {dst} 2>/dev/null')
    if ret != 0 or not os.path.exists(dst):
        # fallback: just skip avif generation, the picture tag will fall through to webp
        print(f"AVIF generation skipped for {dst}")
        pass

# --- Support scene: same image but reimagined as support scene ---
# Actually, the instructions say to generate a separate support scene.
# But I only have one hero image from the API. Let me crop a support scene from it.
# Support scene needs to show ONE pregnant woman + professional (doula/midwife)
# The generated image is just a pregnant silhouette. Let me generate another.
print("Support scene will be generated separately")

# --- OG image: 1200x630, derived from hero ---
og = hero.copy()
og = og.resize((1200, 630), Image.LANCZOS)
og_path = 'public/images/og-city-arvada-co-v1.webp'
og.save(og_path, 'webp', quality=90)
print(f"OG saved: {og_path}")

print("Done")
