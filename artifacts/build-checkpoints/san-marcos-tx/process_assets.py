import os
from PIL import Image

# 1. heroes/ copy (validate expects public/images/heroes/{slug}-birth-doula-skyline.webp)
os.makedirs('public/images/heroes', exist_ok=True)
hero = Image.open('public/images/san-marcos-tx-birth-doula-skyline-v2.webp').convert('RGB')
hero.save('public/images/heroes/san-marcos-tx-birth-doula-skyline.webp', 'WEBP', quality=88)
print('heroes copy saved', hero.size)

# 2. avif files (pitfall #1: template serves .avif BEFORE .webp; strip -vN suffix)
# base = san-marcos-tx-birth-doula-skyline
hero.save('public/images/san-marcos-tx-birth-doula-skyline.avif', 'AVIF', quality=60)
print('avif saved')

# 600px variant
h600 = hero.resize((600, 400), Image.LANCZOS)
h600.save('public/images/san-marcos-tx-birth-doula-skyline-600.avif', 'AVIF', quality=60)
h600.save('public/images/san-marcos-tx-birth-doula-skyline-600.webp', 'WEBP', quality=80)
print('600 variants saved')

# 3. OG image derived from hero (1200x630) - center crop
w,h = hero.size
target = 1200/630
if w/h > target:
    nw = int(h*target); x=(w-nw)//2; og = hero.crop((x,0,x+nw,h))
else:
    nh = int(w/target); y=(h-nh)//2; og = hero.crop((0,y,w,y+nh))
og = og.resize((1200,630), Image.LANCZOS)
og.save('public/images/og-city-san-marcos-tx.webp', 'WEBP', quality=88)
print('og saved', og.size)
