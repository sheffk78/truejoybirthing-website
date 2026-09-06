import json, base64
from PIL import Image
import io
d=json.load(open('/tmp/sanmarcos_hero.json'))
b64=d['data'][0]['b64_json']
img=Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')
print('orig size', img.size)
img.save('/tmp/sanmarcos_hero_raw.png')
w,h=img.size
target=3/2
if w/h > target:
    nw=int(h*target); x=(w-nw)//2; img2=img.crop((x,0,x+nw,h))
else:
    nh=int(w/target); y=(h-nh)//2; img2=img.crop((0,y,w,y+nh))
img2=img2.resize((1200,800), Image.LANCZOS)
img2.save('public/images/san-marcos-tx-birth-doula-skyline-v2.webp', 'WEBP', quality=88)
print('hero saved', img2.size)
w,h=img.size
target=4/3
if w/h > target:
    nw=int(h*target); x=(w-nw)//2; img3=img.crop((x,0,x+nw,h))
else:
    nh=int(w/target); y=(h-nh)//2; img3=img.crop((0,y,w,y+nh))
img3=img3.resize((1024,768), Image.LANCZOS)
img3.save('public/images/san-marcos-tx-birth-doula-support-v2.webp', 'WEBP', quality=88)
print('support saved', img3.size)
