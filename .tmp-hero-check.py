
import sys
from PIL import Image
img = Image.open(r"/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website/public/images/hendersonville-tn-birth-doula-hero.webp").convert("RGB")
w, h = img.size
top = img.crop((0, 0, w, h // 4))
top_unique = len(set(top.getdata()))
full_unique = len(set(img.getdata()))
# R10 hard rule: gradient graphics have low colors in BOTH regions.
# Real photos with smooth skies may have low top but high full (25K+).
# A gradient = top < 2000 AND full < 20000.
if top_unique < 2000 and full_unique < 20000:
    sys.exit(2)  # gradient
elif full_unique < 12000:
    sys.exit(1)  # borderline / low-detail illustration
sys.exit(0)      # real photo
