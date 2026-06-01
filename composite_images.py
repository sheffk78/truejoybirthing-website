#!/usr/bin/env python3
"""Composite branded city images using real photo backgrounds."""

import hashlib
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# ── Config ──────────────────────────────────────────────────────────────────

IMG_DIR = Path("/Users/socializerender/Projects/truejoybirthing-website/public/images")
PHOTO_DIR = Path("/Users/socializerender/Projects/truejoybirthing-website/tmp_photos")

HERO_SIZE = (1200, 800)
OG_SIZE = (1200, 630)

# Brand colors
CHARCOAL = (45, 45, 45)
CREAM = (249, 248, 246)
MAUVE = (181, 131, 141)
LAVENDER = (200, 184, 219)
LAVENDER_DARK = (140, 110, 160)

# ── City data ────────────────────────────────────────────────────────────────

# All slugs that need BOTH hero and OG regenerated (gradient-only, <20KB)
NEED_BOTH = [
    "abilene-tx", "albany-ny", "allen-tx", "allentown-pa", "atlanta-ga",
    "augusta-ga", "bakersfield-ca", "baltimore-md", "beaverton-or", "billings-mt",
    "boise-id", "bowie-md", "bridgeport-ct", "cary-nc", "cedar-park-tx",
    "charleston-wv", "chicago-il", "cleveland-oh", "colorado-springs-co",
    "columbus-ga", "columbus-oh", "cumming-ga", "denton-tx", "detroit-mi",
    "eugene-or", "fort-collins-co", "frisco-tx", "galveston-tx", "garland-tx",
    "georgetown-tx", "gresham-or", "henderson-nv", "huntsville-al", "irving-tx",
    "jackson-ms", "jersey-city-nj", "joliet-il", "killeen-tx", "lakewood-co",
    "leander-tx", "lewisville-tx", "lincoln-ne", "longview-tx", "lubbock-tx",
    "mckinney-tx", "mesquite-tx", "midland-tx", "mobile-al", "nampa-id",
    "naperville-il", "new-haven-ct", "odessa-tx", "omaha-ne", "overland-park-ks",
    "pasadena-tx", "pearland-tx", "pflugerville-tx", "pharr-tx", "plano-tx",
    "port-st-lucie-fl", "reno-nv", "richardson-tx", "rochester-mn", "rochester-ny",
    "round-rock-tx", "sacramento-ca", "san-francisco-ca", "san-marcos-tx",
    "savannah-ga", "sioux-falls-sd", "spokane-wa", "spring-tx", "silver-spring-md",
    "st-augustine-fl", "stamford-ct", "stockton-ca", "sugar-land-tx", "surprise-az",
    "tacoma-wa", "temple-tx", "tulsa-ok", "tyler-tx", "victoria-tx", "virginia-beach-va",
    "waco-tx", "warwick-ri", "wichita-ks", "wichita-falls-tx", "wilmington-de",
    "wilmington-nc", "worcester-ma", "yonkers-ny",
]

# Slugs that only need hero regenerated
NEED_HERO_ONLY = []

# Slugs that only need OG regenerated
NEED_OG_ONLY = [
    "amarillo-tx", "arlington-tx", "austin-tx", "carrollton-tx", "dallas-tx",
    "el-paso-tx", "fort-worth-tx", "grand-prairie-tx", "houston-tx",
    "new-braunfels-tx", "richmond-va", "san-antonio-tx",
]

# Map slug -> (city display name, state abbreviation)
CITY_NAMES = {
    "abilene-tx": ("Abilene", "TX"), "albany-ny": ("Albany", "NY"),
    "allen-tx": ("Allen", "TX"), "allentown-pa": ("Allentown", "PA"),
    "atlanta-ga": ("Atlanta", "GA"), "augusta-ga": ("Augusta", "GA"),
    "bakersfield-ca": ("Bakersfield", "CA"), "baltimore-md": ("Baltimore", "MD"),
    "beaverton-or": ("Beaverton", "OR"), "billings-mt": ("Billings", "MT"),
    "boise-id": ("Boise", "ID"), "bowie-md": ("Bowie", "MD"),
    "bridgeport-ct": ("Bridgeport", "CT"), "cary-nc": ("Cary", "NC"),
    "cedar-park-tx": ("Cedar Park", "TX"), "charleston-wv": ("Charleston", "WV"),
    "chicago-il": ("Chicago", "IL"), "cleveland-oh": ("Cleveland", "OH"),
    "colorado-springs-co": ("Colorado Springs", "CO"), "columbus-ga": ("Columbus", "GA"),
    "columbus-oh": ("Columbus", "OH"), "cumming-ga": ("Cumming", "GA"),
    "denton-tx": ("Denton", "TX"), "detroit-mi": ("Detroit", "MI"),
    "eugene-or": ("Eugene", "OR"), "fort-collins-co": ("Fort Collins", "CO"),
    "frisco-tx": ("Frisco", "TX"), "galveston-tx": ("Galveston", "TX"),
    "garland-tx": ("Garland", "TX"), "georgetown-tx": ("Georgetown", "TX"),
    "gresham-or": ("Gresham", "OR"), "henderson-nv": ("Henderson", "NV"),
    "huntsville-al": ("Huntsville", "AL"), "irving-tx": ("Irving", "TX"),
    "jackson-ms": ("Jackson", "MS"), "jersey-city-nj": ("Jersey City", "NJ"),
    "joliet-il": ("Joliet", "IL"), "killeen-tx": ("Killeen", "TX"),
    "lakewood-co": ("Lakewood", "CO"), "leander-tx": ("Leander", "TX"),
    "lewisville-tx": ("Lewisville", "TX"), "lincoln-ne": ("Lincoln", "NE"),
    "longview-tx": ("Longview", "TX"), "lubbock-tx": ("Lubbock", "TX"),
    "mckinney-tx": ("McKinney", "TX"), "mesquite-tx": ("Mesquite", "TX"),
    "midland-tx": ("Midland", "TX"), "mobile-al": ("Mobile", "AL"),
    "nampa-id": ("Nampa", "ID"), "naperville-il": ("Naperville", "IL"),
    "new-haven-ct": ("New Haven", "CT"), "odessa-tx": ("Odessa", "TX"),
    "omaha-ne": ("Omaha", "NE"), "overland-park-ks": ("Overland Park", "KS"),
    "pasadena-tx": ("Pasadena", "TX"), "pearland-tx": ("Pearland", "TX"),
    "pflugerville-tx": ("Pflugerville", "TX"), "pharr-tx": ("Pharr", "TX"),
    "plano-tx": ("Plano", "TX"), "port-st-lucie-fl": ("Port St. Lucie", "FL"),
    "reno-nv": ("Reno", "NV"), "richardson-tx": ("Richardson", "TX"),
    "rochester-mn": ("Rochester", "MN"), "rochester-ny": ("Rochester", "NY"),
    "round-rock-tx": ("Round Rock", "TX"), "sacramento-ca": ("Sacramento", "CA"),
    "san-francisco-ca": ("San Francisco", "CA"), "san-marcos-tx": ("San Marcos", "TX"),
    "savannah-ga": ("Savannah", "GA"), "sioux-falls-sd": ("Sioux Falls", "SD"),
    "spokane-wa": ("Spokane", "WA"), "spring-tx": ("Spring", "TX"),
    "silver-spring-md": ("Silver Spring", "MD"), "st-augustine-fl": ("St. Augustine", "FL"),
    "stamford-ct": ("Stamford", "CT"), "stockton-ca": ("Stockton", "CA"),
    "sugar-land-tx": ("Sugar Land", "TX"), "surprise-az": ("Surprise", "AZ"),
    "tacoma-wa": ("Tacoma", "WA"), "temple-tx": ("Temple", "TX"),
    "tulsa-ok": ("Tulsa", "OK"), "tyler-tx": ("Tyler", "TX"),
    "victoria-tx": ("Victoria", "TX"), "virginia-beach-va": ("Virginia Beach", "VA"),
    "waco-tx": ("Waco", "TX"), "warwick-ri": ("Warwick", "RI"),
    "wichita-ks": ("Wichita", "KS"), "wichita-falls-tx": ("Wichita Falls", "TX"),
    "wilmington-de": ("Wilmington", "DE"), "wilmington-nc": ("Wilmington", "NC"),
    "worcester-ma": ("Worcester", "MA"), "yonkers-ny": ("Yonkers", "NY"),
    # OG-only
    "amarillo-tx": ("Amarillo", "TX"), "arlington-tx": ("Arlington", "TX"),
    "austin-tx": ("Austin", "TX"), "carrollton-tx": ("Carrollton", "TX"),
    "dallas-tx": ("Dallas", "TX"), "el-paso-tx": ("El Paso", "TX"),
    "fort-worth-tx": ("Fort Worth", "TX"), "grand-prairie-tx": ("Grand Prairie", "TX"),
    "houston-tx": ("Houston", "TX"), "new-braunfels-tx": ("New Braunfels", "TX"),
    "richmond-va": ("Richmond", "VA"), "san-antonio-tx": ("San Antonio", "TX"),
}

# Load photo backgrounds
photos = []
for i in range(1, 6):
    p = PHOTO_DIR / f"bg_{i}.png"
    if p.exists():
        photos.append(Image.open(p).convert("RGB"))
        print(f"Loaded bg_{i}.png: {photos[-1].size}")

if not photos:
    print("ERROR: No background photos found!")
    exit(1)

# ── Font setup ───────────────────────────────────────────────────────────────

SERIF_BOLD = "/System/Library/Fonts/PTSerif-Bold.ttf"
SERIF_REG = "/System/Library/Fonts/PTSerif-Regular.ttf"
SANS_BOLD = "/System/Library/Fonts/Helvetica.ttc"
SANS_REG = "/System/Library/Fonts/Helvetica.ttc"

def pick_photo(slug: str) -> Image.Image:
    """Deterministically pick a photo for a city slug."""
    idx = int(hashlib.md5(slug.encode()).hexdigest(), 16) % len(photos)
    return photos[idx].copy()

def add_dark_overlay(img: Image.Image, opacity: float = 0.55) -> Image.Image:
    """Add a dark overlay for text readability."""
    overlay = Image.new("RGB", img.size, CHARCOAL)
    # Blend: result = image * (1-opacity) + overlay * opacity
    return Image.blend(img, overlay, opacity)

def add_mauve_tint_bottom(img: Image.Image, height_ratio: float = 0.3, opacity: float = 0.25) -> Image.Image:
    """Add a subtle mauve tint at the bottom for brand feel."""
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

def make_hero(slug: str, city: str, state: str, photo: Image.Image) -> Image.Image:
    """Create a 1200x800 hero image with photo background."""
    # Resize and crop photo to fill 1200x800
    img = photo.copy()
    img = ImageOps.autocontrast(img, cutoff=1)
    
    # Calculate crop to fill
    target_ratio = HERO_SIZE[0] / HERO_SIZE[1]
    src_ratio = img.size[0] / img.size[1]
    if src_ratio > target_ratio:
        # Photo is wider — crop sides
        new_w = int(img.size[1] * target_ratio)
        left = (img.size[0] - new_w) // 2
        img = img.crop((left, 0, left + new_w, img.size[1]))
    else:
        # Photo is taller — crop top/bottom (keep top portion for skyline)
        new_h = int(img.size[0] / target_ratio)
        top = int(img.size[1] * 0.15)  # Start slightly from top for skyline
        if top + new_h > img.size[1]:
            top = 0
        img = img.crop((0, top, img.size[0], min(top + new_h, img.size[1])))
    
    img = img.resize(HERO_SIZE, Image.Resampling.LANCZOS)
    
    # Add dark overlay for text readability
    img = add_dark_overlay(img, opacity=0.50)
    
    # Add mauve tint at bottom
    img = add_mauve_tint_bottom(img, height_ratio=0.35, opacity=0.20)
    
    # Draw text
    draw = ImageDraw.Draw(img)
    
    # City name — large serif, white/cream
    city_font_size = 72 if len(city) <= 12 else 56 if len(city) <= 18 else 44
    city_font = ImageFont.truetype(SERIF_BOLD, city_font_size)
    
    # Shadow
    draw.text((602, 302), city, font=city_font, fill=(30, 30, 30), anchor="mm")
    # Main text
    draw.text((600, 300), city, font=city_font, fill=CREAM, anchor="mm")
    
    # State abbreviation
    state_font = ImageFont.truetype(SANS_BOLD, 32)
    draw.text((602, 302 + city_font_size // 2 + 16), state, font=state_font, fill=(30, 30, 30), anchor="mm")
    draw.text((600, 300 + city_font_size // 2 + 14), state, font=state_font, fill=LAVENDER, anchor="mm")
    
    # Subtitle
    sub_font = ImageFont.truetype(SANS_REG, 24)
    draw.text((602, 502), "Birth Doula & Midwife", font=sub_font, fill=(30, 30, 30), anchor="mm")
    draw.text((600, 500), "Birth Doula & Midwife", font=sub_font, fill=(230, 220, 235), anchor="mm")
    
    # Mauve accent line
    line_y = 300 - city_font_size // 2 - 16
    draw.rectangle([(500, line_y), (700, line_y + 3)], fill=MAUVE)
    
    # Brand at bottom
    brand_font = ImageFont.truetype(SANS_REG, 16)
    draw.text((600, 770), "True Joy Birthing", font=brand_font, fill=(180, 170, 185), anchor="mm")
    
    return img

def make_og(slug: str, city: str, state: str, photo: Image.Image) -> Image.Image:
    """Create a 1200x630 OG card image with photo background."""
    # Resize and crop photo to fill 1200x630
    img = photo.copy()
    img = ImageOps.autocontrast(img, cutoff=1)
    
    target_ratio = OG_SIZE[0] / OG_SIZE[1]
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
    
    img = img.resize(OG_SIZE, Image.Resampling.LANCZOS)
    
    # Add dark overlay
    img = add_dark_overlay(img, opacity=0.55)
    
    # Add mauve tint at bottom
    img = add_mauve_tint_bottom(img, height_ratio=0.3, opacity=0.20)
    
    draw = ImageDraw.Draw(img)
    
    # Eyebrow: "MIAMI BIRTH SUPPORT"
    eyebrow_font = ImageFont.truetype(SANS_BOLD, 16)
    eyebrow_text = f"{city.upper()} BIRTH SUPPORT"
    draw.text((52, 148), eyebrow_text, font=eyebrow_font, fill=(30, 30, 30), anchor="lm")
    draw.text((50, 146), eyebrow_text, font=eyebrow_font, fill=CREAM, anchor="lm")
    
    # Mauve accent line under eyebrow
    draw.rectangle([(50, 162), (250, 165)], fill=MAUVE)
    
    # Main headline: "Doulas & Birth Plans in City, ST"
    headline_font_size = 52 if len(city) <= 12 else 40 if len(city) <= 18 else 34
    headline_font = ImageFont.truetype(SERIF_BOLD, headline_font_size)
    headline_text = f"Doulas & Birth Plans in {city}, {state}"
    draw.text((52, 238), headline_text, font=headline_font, fill=(30, 30, 30), anchor="lm")
    draw.text((50, 236), headline_text, font=headline_font, fill=CREAM, anchor="lm")
    
    # Subtitle
    sub_font = ImageFont.truetype(SANS_REG, 22)
    sub_text = "Free birth plan template · Hospital info · Real costs · Medicaid coverage"
    draw.text((52, 298), sub_text, font=sub_font, fill=(30, 30, 30), anchor="lm")
    draw.text((50, 296), sub_text, font=sub_font, fill=LAVENDER, anchor="lm")
    
    # Brand + URL at bottom
    brand_font = ImageFont.truetype(SANS_REG, 16)
    draw.text((50, 582), "True Joy Birthing", font=brand_font, fill=CREAM)
    draw.text((1150, 582), "truejoybirthing.com", font=brand_font, fill=CREAM, anchor="rm")
    
    return img


# ── Generate all images ──────────────────────────────────────────────────────

from PIL import ImageOps

generated = 0
errors = []

for slug in NEED_BOTH:
    if slug not in CITY_NAMES:
        errors.append(f"Missing city name for {slug}")
        continue
    city, state = CITY_NAMES[slug]
    photo = pick_photo(slug)
    
    try:
        hero = make_hero(slug, city, state, photo)
        hero_path = IMG_DIR / f"{slug}-birth-doula-skyline.webp"
        hero.save(hero_path, "WEBP", quality=85)
        
        og = make_og(slug, city, state, photo)
        og_path = IMG_DIR / f"og-city-{slug}.webp"
        og.save(og_path, "WEBP", quality=85)
        
        generated += 1
    except Exception as e:
        errors.append(f"{slug}: {e}")

for slug in NEED_HERO_ONLY:
    if slug not in CITY_NAMES:
        errors.append(f"Missing city name for {slug}")
        continue
    city, state = CITY_NAMES[slug]
    photo = pick_photo(slug)
    
    try:
        hero = make_hero(slug, city, state, photo)
        hero_path = IMG_DIR / f"{slug}-birth-doula-skyline.webp"
        hero.save(hero_path, "WEBP", quality=85)
        generated += 1
    except Exception as e:
        errors.append(f"{slug}: {e}")

for slug in NEED_OG_ONLY:
    if slug not in CITY_NAMES:
        errors.append(f"Missing city name for {slug}")
        continue
    city, state = CITY_NAMES[slug]
    photo = pick_photo(slug)
    
    try:
        og = make_og(slug, city, state, photo)
        og_path = IMG_DIR / f"og-city-{slug}.webp"
        og.save(og_path, "WEBP", quality=85)
        generated += 1
    except Exception as e:
        errors.append(f"{slug}: {e}")

print(f"\nGenerated {generated} images")
if errors:
    print(f"Errors: {len(errors)}")
    for e in errors[:10]:
        print(f"  {e}")