from PIL import Image, ImageFilter, ImageOps
from pathlib import Path

src = Path('/tmp/arvada_hero_raw.jpg')
root = Path('/Users/socializerender/Projects/truejoybirthing-website')
img = Image.open(src).convert('RGB')

# Preserve the original square composition for the website hero.
img.save(root / 'public/images/arvada-co-birth-doula-hero-v2.webp', 'WEBP', quality=92, method=6)
img.resize((600, 600), Image.Resampling.LANCZOS).save(
    root / 'public/images/arvada-co-birth-doula-hero-v2-600.webp', 'WEBP', quality=88, method=6
)

# 16:9 YouTube thumbnail: blurred/darkened background plus contained source.
W, H = 1280, 720
scale = max(W / img.width, H / img.height)
bg = img.resize((round(img.width * scale), round(img.height * scale)), Image.Resampling.LANCZOS)
bg = ImageOps.fit(bg, (W, H), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
bg = bg.filter(ImageFilter.GaussianBlur(18))
overlay = Image.new('RGBA', (W, H), (25, 20, 18, 105))
bg = Image.alpha_composite(bg.convert('RGBA'), overlay)
fg = img.copy()
fg.thumbnail((H, H), Image.Resampling.LANCZOS)
bg.alpha_composite(fg.convert('RGBA'), ((W - fg.width) // 2, (H - fg.height) // 2))
bg.convert('RGB').save(root / 'public/images/arvada-co-youtube-thumbnail-v2.jpg', 'JPEG', quality=94, subsampling=0)
print('created', img.size, 'hero=(1024,1024)', 'thumbnail=(1280,720)')
غي = None
