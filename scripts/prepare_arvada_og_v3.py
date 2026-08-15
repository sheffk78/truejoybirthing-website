from PIL import Image
from pathlib import Path

src = Image.open('/tmp/arvada-hero-v3-source.png').convert('RGB')
root = Path('/Users/socializerender/Projects/truejoybirthing-website')
# Native 16:9 source -> exact 1200x630 OG crop, preserving geometry.
w, h = src.size
og_h = round(w * 630 / 1200)
top = max(0, (h - og_h) // 2)
og = src.crop((0, top, w, top + og_h)).resize((1200, 630), Image.Resampling.LANCZOS)
og.save(root / 'public/images/og-city-arvada-co-v3.webp', 'WEBP', quality=93, method=6)
print('source', src.size, 'og_crop', (w, og_h), 'og', og.size)
ց = None
