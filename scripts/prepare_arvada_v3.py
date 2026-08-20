from PIL import Image
from pathlib import Path

src = Image.open('/tmp/arvada-hero-v3-source.png').convert('RGB')
root = Path('/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website')
w, h = src.size
crop_w = round(h * 3 / 2)
left = (w - crop_w) // 2
hero = src.crop((left, 0, left + crop_w, h)).resize((1200, 800), Image.Resampling.LANCZOS)
hero.save(root / 'public/images/arvada-co-birth-doula-hero-v3.webp', 'WEBP', quality=93, method=6)
hero.resize((600, 400), Image.Resampling.LANCZOS).save(root / 'public/images/arvada-co-birth-doula-hero-v3-600.webp', 'WEBP', quality=88, method=6)
thumb = src.resize((1280, 720), Image.Resampling.LANCZOS)
thumb.save(root / 'public/images/arvada-co-youtube-thumbnail-v3.jpg', 'JPEG', quality=94, subsampling=0)
print('source', src.size, 'hero_crop', crop_w, h, 'hero', hero.size, 'thumb', thumb.size)
