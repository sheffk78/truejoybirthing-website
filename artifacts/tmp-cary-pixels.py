from PIL import Image
import os

files = [
    ("hero", "public/images/cary-nc-birth-doula-skyline-v2.webp"),
    ("support", "public/images/cary-nc-birth-doula-support-v2.webp"),
    ("provider-amanda-petry", "public/images/provider-cary-nc-amanda-petry.webp"),
    ("provider-mariam-lam", "public/images/provider-cary-nc-mariam-lam.webp"),
    ("provider-sacred-haven", "public/images/provider-cary-nc-sacred-haven.webp"),
    ("provider-triangle-doula", "public/images/provider-cary-nc-triangle-doula.webp"),
    ("hospital-unc-rex", "public/images/cary-nc-hospital-unc-rex.webp"),
    ("hospital-wakemed-cary", "public/images/cary-nc-hospital-wakemed-cary.webp"),
    ("birth-center-haven", "public/images/cary-nc-birth-center-haven.webp"),
]
for label, path in files:
    im = Image.open(path).convert("RGB")
    im_small = im.resize((200, 200))
    colors = im_small.getcolors(maxcolors=100000)
    n_colors = len(colors) if colors else 100000
    # sample spread: stddev of pixel values per channel
    import statistics
    px = list(im_small.getdata())
    rs = [p[0] for p in px]; gs = [p[1] for p in px]; bs = [p[2] for p in px]
    spread = (round(statistics.pstdev(rs)), round(statistics.pstdev(gs)), round(statistics.pstdev(bs)))
    # detect flat placeholder: single dominant color > 60%
    dominant = max(c for c, _ in colors) / (200*200)
    print(f"{label:26s} {im.size} unique_colors={n_colors:6d} dominant={dominant:.2f} spread={spread}")