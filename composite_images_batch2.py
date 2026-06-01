#!/usr/bin/env python3
"""Batch 2: Composite remaining city images using real photo backgrounds."""

import hashlib
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps

IMG_DIR = Path("/Users/socializerender/Projects/truejoybirthing-website/public/images")
PHOTO_DIR = Path("/Users/socializerender/Projects/truejoybirthing-website/tmp_photos")

HERO_SIZE = (1200, 800)
OG_SIZE = (1200, 630)

CHARCOAL = (45, 45, 45)
CREAM = (249, 248, 246)
MAUVE = (181, 131, 141)
LAVENDER = (200, 184, 219)

SERIF_BOLD = "/System/Library/Fonts/PTSerif-Bold.ttf"
SANS_BOLD = "/System/Library/Fonts/Helvetica.ttc"
SANS_REG = "/System/Library/Fonts/Helvetica.ttc"

photos = []
for i in range(1, 6):
    p = PHOTO_DIR / f"bg_{i}.png"
    if p.exists():
        photos.append(Image.open(p).convert("RGB"))
        print(f"Loaded bg_{i}.png: {photos[-1].size}")

CITY_NAMES = {
    "boston-ma": ("Boston", "MA"), "cedar-rapids-ia": ("Cedar Rapids", "IA"),
    "denver-co": ("Denver", "CO"), "evansville-in": ("Evansville", "IN"),
    "grand-rapids-mi": ("Grand Rapids", "MI"), "greenville-sc": ("Greenville", "SC"),
    "honolulu-hi": ("Honolulu", "HI"), "indianapolis-in": ("Indianapolis", "IN"),
    "kansas-city-mo": ("Kansas City", "MO"), "las-vegas-nv": ("Las Vegas", "NV"),
    "lexington-ky": ("Lexington", "KY"), "little-rock-ar": ("Little Rock", "AR"),
    "long-beach-ca": ("Long Beach", "CA"), "los-angeles-ca": ("Los Angeles", "CA"),
    "louisville-ky": ("Louisville", "KY"), "manchester-nh": ("Manchester", "NH"),
    "miami-fl": ("Miami", "FL"), "milwaukee-wi": ("Milwaukee", "WI"),
    "minneapolis-mn": ("Minneapolis", "MN"), "nashville-tn": ("Nashville", "TN"),
    "new-orleans-la": ("New Orleans", "LA"), "new-york-ny": ("New York", "NY"),
    "newark-nj": ("Newark", "NJ"), "oakland-ca": ("Oakland", "CA"),
    "oklahoma-city-ok": ("Oklahoma City", "OK"), "orlando-fl": ("Orlando", "FL"),
    "paterson-nj": ("Paterson", "NJ"), "philadelphia-pa": ("Philadelphia", "PA"),
    "phoenix-az": ("Phoenix", "AZ"), "pittsburgh-pa": ("Pittsburgh", "PA"),
    "portland-or": ("Portland", "OR"), "providence-ri": ("Providence", "RI"),
    "raleigh-nc": ("Raleigh", "NC"), "salt-lake-city-ut": ("Salt Lake City", "UT"),
    "san-diego-ca": ("San Diego", "CA"), "san-jose-ca": ("San Jose", "CA"),
    "santa-ana-ca": ("Santa Ana", "CA"), "scottsdale-az": ("Scottsdale", "AZ"),
    "seattle-wa": ("Seattle", "WA"), "st-paul-mn": ("St. Paul", "MN"),
    "st-petersburg-fl": ("St. Petersburg", "FL"), "tampa-fl": ("Tampa", "FL"),
    "tucson-az": ("Tucson", "AZ"),
}

def pick_photo(slug):
    idx = int(hashlib.md5(slug.encode()).hexdigest(), 16) % len(photos)
    return photos[idx].copy()

def add_dark_overlay(img, opacity=0.55):
    overlay = Image.new("RGB", img.size, CHARCOAL)
    return Image.blend(img, overlay, opacity)

def add_mauve_tint_bottom(img, height_ratio=0.3, opacity=0.25):
    w, h = img.size
    tint = Image.new("RGB", img.size, (255, 255, 255))
    draw = ImageDraw.Draw(tint)
    for y in range(h):
        ratio = y / h
        if ratio > (1 - height_ratio):
            alpha = ((ratio - (1 - height_ratio)) / height_ratio) * opacity
            r = int(255 - (255 - MAUVE[0]) * alpha)
            g = int(255 - (255 - MAUVE[1]) * alpha)
            b = int(255 - (255 - MAUVE[2]) * alpha)
            draw.line([(0, y), (w, y)], fill=(r, g, b))
    return Image.blend(img, tint, 0.3)

def crop_fill(img, target_size):
    target_ratio = target_size[0] / target_size[1]
    src_ratio = img.size[0] / img.size[1]
    if src_ratio > target_ratio:
        new_w = int(img.size[1] * target_ratio)
        left = (img.size[0] - new_w) // 2
        img = img.crop((left, 0, left + new_w, img.size[1]))
    else:
        new_h = int(img.size[0] / target_ratio)
        top = int(img.size[1] * 0.15)
        if top + new_h > img.size[1]:
            top = 0
        img = img.crop((0, top, img.size[0], min(top + new_h, img.size[1])))
    return img.resize(target_size, Image.Resampling.LANCZOS)

def make_hero(slug, city, state, photo):
    img = ImageOps.autocontrast(photo.copy(), cutoff=1)
    img = crop_fill(img, HERO_SIZE)
    img = add_dark_overlay(img, 0.50)
    img = add_mauve_tint_bottom(img, 0.35, 0.20)
    draw = ImageDraw.Draw(img)
    
    city_font_size = 72 if len(city) <= 12 else 56 if len(city) <= 18 else 44
    city_font = ImageFont.truetype(SERIF_BOLD, city_font_size)
    
    draw.text((602, 302), city, font=city_font, fill=(30, 30, 30), anchor="mm")
    draw.text((600, 300), city, font=city_font, fill=CREAM, anchor="mm")
    
    state_font = ImageFont.truetype(SANS_BOLD, 32)
    draw.text((602, 302 + city_font_size // 2 + 16), state, font=state_font, fill=(30, 30, 30), anchor="mm")
    draw.text((600, 300 + city_font_size // 2 + 14), state, font=state_font, fill=LAVENDER, anchor="mm")
    
    sub_font = ImageFont.truetype(SANS_REG, 24)
    draw.text((602, 502), "Birth Doula & Midwife", font=sub_font, fill=(30, 30, 30), anchor="mm")
    draw.text((600, 500), "Birth Doula & Midwife", font=sub_font, fill=(230, 220, 235), anchor="mm")
    
    line_y = 300 - city_font_size // 2 - 16
    draw.rectangle([(500, line_y), (700, line_y + 3)], fill=MAUVE)
    
    brand_font = ImageFont.truetype(SANS_REG, 16)
    draw.text((600, 770), "True Joy Birthing", font=brand_font, fill=(180, 170, 185), anchor="mm")
    
    return img

def make_og(slug, city, state, photo):
    img = ImageOps.autocontrast(photo.copy(), cutoff=1)
    img = crop_fill(img, OG_SIZE)
    img = add_dark_overlay(img, 0.55)
    img = add_mauve_tint_bottom(img, 0.3, 0.20)
    draw = ImageDraw.Draw(img)
    
    eyebrow_font = ImageFont.truetype(SANS_BOLD, 16)
    eyebrow_text = f"{city.upper()} BIRTH SUPPORT"
    draw.text((52, 148), eyebrow_text, font=eyebrow_font, fill=(30, 30, 30), anchor="lm")
    draw.text((50, 146), eyebrow_text, font=eyebrow_font, fill=CREAM, anchor="lm")
    draw.rectangle([(50, 162), (250, 165)], fill=MAUVE)
    
    headline_font_size = 52 if len(city) <= 12 else 40 if len(city) <= 18 else 34
    headline_font = ImageFont.truetype(SERIF_BOLD, headline_font_size)
    headline_text = f"Doulas & Birth Plans in {city}, {state}"
    draw.text((52, 238), headline_text, font=headline_font, fill=(30, 30, 30), anchor="lm")
    draw.text((50, 236), headline_text, font=headline_font, fill=CREAM, anchor="lm")
    
    sub_font = ImageFont.truetype(SANS_REG, 22)
    sub_text = "Free birth plan template · Hospital info · Real costs · Medicaid coverage"
    draw.text((52, 298), sub_text, font=sub_font, fill=(30, 30, 30), anchor="lm")
    draw.text((50, 296), sub_text, font=sub_font, fill=LAVENDER, anchor="lm")
    
    brand_font = ImageFont.truetype(SANS_REG, 16)
    draw.text((50, 582), "True Joy Birthing", font=brand_font, fill=CREAM)
    draw.text((1150, 582), "truejoybirthing.com", font=brand_font, fill=CREAM, anchor="rm")
    
    return img


# ── Generate ──────────────────────────────────────────────────────────────────

generated = 0
errors = []

for slug, (city, state) in CITY_NAMES.items():
    photo = pick_photo(slug)
    hero_path = IMG_DIR / f"{slug}-birth-doula-skyline.webp"
    og_path = IMG_DIR / f"og-city-{slug}.webp"
    
    # Only regenerate if still gradient-only
    try:
        hero_existing = hero_path.stat().st_size if hero_path.exists() else 0
        og_existing = og_path.stat().st_size if og_path.exists() else 0
        
        if hero_existing < 20000:
            hero = make_hero(slug, city, state, photo)
            hero.save(hero_path, "WEBP", quality=85)
        
        if og_existing < 20000:
            og = make_og(slug, city, state, photo)
            og.save(og_path, "WEBP", quality=85)
        
        generated += 1
    except Exception as e:
        errors.append(f"{slug}: {e}")

print(f"\nGenerated {generated} city image sets")
if errors:
    print(f"Errors: {len(errors)}")
    for e in errors[:10]:
        print(f"  {e}")