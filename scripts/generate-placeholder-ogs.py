#!/usr/bin/env python3
"""
Generate real 1200x630 OG cards for the 13 placeholder cities.
Uses PIL to composite: left panel (text + TJB wordmark on cream gradient),
right panel (city hero photo), rose accent bars top/bottom.
"""
import os, subprocess, sys, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PROJECT = "/Users/socializerender/Projects/truejoybirthing-website"
OUT_DIR = os.path.join(PROJECT, "public/images")
LOGO_SVG = os.path.join(PROJECT, "public/images/logo-mono.svg")
LOGO_PNG = "/tmp/tjb-logo-mono.png"

# Fonts — Georgia for serif headline, Lato for sans body
SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SERIF_REG = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SANS_BOLD = "/Library/Fonts/Lato-Bold.ttf"
SANS_REG = "/Library/Fonts/Lato-Regular.ttf"
SANS_BLACK = "/Library/Fonts/Lato-Black.ttf"

# Brand colors
ROSE = (216, 160, 196)      # #D8A0C4
ROSE_DARK = (184, 122, 160)  # #B87AA0
CREAM = (250, 248, 245)     # #FAF8F5
LAVENDER = (237, 229, 245)  # #EDE5F5
DARK_TEXT = (42, 42, 42)    # #2A2A2A
BODY_TEXT = (85, 85, 85)    # #555555
SUBHEAD_TEXT = (106, 107, 108)  # #6A6B6C

# City data: slug -> (city_name, state_abbr, hero_image_path, eyebrow, headline_l1, headline_l2, summary, subhead)
CITIES = {
    "abilene-tx": {
        "name": "Abilene", "state": "TX",
        "hero": f"{PROJECT}/public/images/abilene-tx-birth-doula-hero-v2.webp",
        "eyebrow": "ABILENE BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Abilene, TX",
        "summary": "From the West Texas plains to Hendrick Medical Center, Abilene families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for Texas moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "arlington-tx": {
        "name": "Arlington", "state": "TX",
        "hero": f"{PROJECT}/public/images/arlington-tx-birth-doula-hero-v2.webp",
        "eyebrow": "ARLINGTON BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Arlington, TX",
        "summary": "From AT&T Stadium to Medical City Arlington, Arlington families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for Texas moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "augusta-ga": {
        "name": "Augusta", "state": "GA",
        "hero": f"{PROJECT}/public/images/augusta-ga-birth-doula-skyline.webp",
        "eyebrow": "AUGUSTA BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Augusta, GA",
        "summary": "From the Savannah River to Augusta University Medical Center, Augusta families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for Georgia moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "atlanta-ga": {
        "name": "Atlanta", "state": "GA",
        "hero": f"{PROJECT}/public/images/atlanta-ga-birth-doula-skyline-v2.webp",
        "eyebrow": "ATLANTA BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Atlanta, GA",
        "summary": "From Piedmont Park to Northside Hospital, Atlanta families deserve birth support that gets it. Real hospital policies at Emory and Wellstar, local doulas, and a free birth plan template built for Georgia moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "spokane-wa": {
        "name": "Spokane", "state": "WA",
        "hero": f"{PROJECT}/public/images/spokane-wa-birth-doula-skyline.webp",
        "eyebrow": "SPOKANE BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Spokane, WA",
        "summary": "From Riverfront Park to Providence Sacred Heart, Spokane families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for Washington moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "los-angeles-ca": {
        "name": "Los Angeles", "state": "CA",
        "hero": f"{PROJECT}/public/images/heroes/los-angeles-ca-birth-doula-skyline-v2.webp",
        "eyebrow": "LOS ANGELES BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Los Angeles, CA",
        "summary": "From Santa Monica to Cedars-Sinai, LA families deserve birth support that gets it. Real hospital policies at UCLA and Kaiser, local doulas, and a free birth plan template built for California moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "st-paul-mn": {
        "name": "St. Paul", "state": "MN",
        "hero": f"{PROJECT}/public/images/st-paul-mn-birth-doula-skyline-v2.webp",
        "eyebrow": "ST. PAUL BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in St. Paul, MN",
        "summary": "From Summit Avenue to the Mississippi riverfront, St. Paul families deserve birth support that gets it. Real hospital policies, local doulas, and a free birth plan template built for Minnesota moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "boston-ma": {
        "name": "Boston", "state": "MA",
        "hero": f"{PROJECT}/public/images/boston-ma-birth-doula-skyline.webp",
        "eyebrow": "BOSTON BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Boston, MA",
        "summary": "From the Charles River to Brigham and Women's, Boston families deserve birth support that gets it. Real hospital policies at MGH and Beth Israel, local doulas, and a free birth plan template built for Massachusetts moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "providence-ri": {
        "name": "Providence", "state": "RI",
        "hero": f"{PROJECT}/public/images/heroes/providence-ri-birth-doula-skyline.webp",
        "eyebrow": "PROVIDENCE BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Providence, RI",
        "summary": "From WaterFire to Women & Infants Hospital, Providence families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for Rhode Island moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "san-francisco-ca": {
        "name": "San Francisco", "state": "CA",
        "hero": f"{PROJECT}/public/images/san-francisco-ca-birth-doula-hero-v2.webp",
        "eyebrow": "SAN FRANCISCO BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in San Francisco, CA",
        "summary": "From the Mission to the Marina, San Francisco families deserve birth support that gets it. Real hospital policies at UCSF and CPMC, local doulas, and a free birth plan template built for Bay Area moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "memphis-tn": {
        "name": "Memphis", "state": "TN",
        "hero": f"{PROJECT}/public/images/memphis-tn-birth-doula-skyline-v2.webp",
        "eyebrow": "MEMPHIS BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Memphis, TN",
        "summary": "From the Mississippi River to Midtown, Memphis families deserve birth support that gets it. Real hospital policies at Methodist and Baptist, local doulas, and a free birth plan template built for Tennessee moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "charlotte-nc": {
        "name": "Charlotte", "state": "NC",
        "hero": f"{PROJECT}/public/images/charlotte-nc-birth-doula-skyline.webp",
        "eyebrow": "CHARLOTTE BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Charlotte, NC",
        "summary": "From Uptown to Atrium Health Carolinas Medical Center, Charlotte families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for North Carolina moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
    "denver-co": {
        "name": "Denver", "state": "CO",
        "hero": f"{PROJECT}/public/images/denver-co-birth-doula-skyline.webp",
        "eyebrow": "DENVER BIRTH SUPPORT",
        "headline1": "Doulas & Birth Plans",
        "headline2": "in Denver, CO",
        "summary": "From the Front Range to the Platte, Denver families deserve birth support that gets it. Real hospital policies at UCHealth and Presbyterian St. Luke's, local doulas, and a free birth plan template built for Colorado moms.",
        "subhead": "Free birth plan template · Hospital info · Real costs · Medicaid coverage",
    },
}

def render_logo():
    """Convert logo-mono.svg to PNG using rsvg-convert."""
    subprocess.run(
        ['rsvg-convert', '-w', '280', '-h', '63', '-o', LOGO_PNG, LOGO_SVG],
        capture_output=True, check=True
    )
    return Image.open(LOGO_PNG).convert("RGBA")

def make_gradient(width, height, top_color, bottom_color):
    """Create a vertical linear gradient."""
    grad = Image.new('RGB', (width, height))
    for y in range(height):
        t = y / max(height - 1, 1)
        r = int(top_color[0] + (bottom_color[0] - top_color[0]) * t)
        g = int(top_color[1] + (bottom_color[1] - top_color[1]) * t)
        b = int(top_color[2] + (bottom_color[2] - top_color[2]) * t)
        for x in range(width):
            grad.putpixel((x, y), (r, g, b))
    return grad

def make_gradient_fast(width, height, top_color, bottom_color):
    """Create a vertical linear gradient (fast version using numpy)."""
    import numpy as np
    arr = np.zeros((height, width, 3), dtype=np.uint8)
    for y in range(height):
        t = y / max(height - 1, 1)
        arr[y, :, 0] = int(top_color[0] + (bottom_color[0] - top_color[0]) * t)
        arr[y, :, 1] = int(top_color[1] + (bottom_color[1] - top_color[1]) * t)
        arr[y, :, 2] = int(top_color[2] + (bottom_color[2] - top_color[2]) * t)
    return Image.fromarray(arr, 'RGB')

def draw_text_centered(draw, text, font, fill, y, left_bound, right_bound):
    """Draw text centered between left_bound and right_bound."""
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    x = left_bound + (right_bound - left_bound - text_w) // 2
    draw.text((x, y), text, font=font, fill=fill)
    return bbox[3] - bbox[1]  # return text height

def draw_text_left(draw, text, font, fill, x, y):
    """Draw left-aligned text."""
    draw.text((x, y), text, font=font, fill=fill)

def wrap_text(text, font, max_width, draw):
    """Word-wrap text to fit max_width."""
    words = text.split()
    lines = []
    current = words[0]
    for word in words[1:]:
        test = current + " " + word
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current = test
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines

def generate_og(slug, data, logo_img):
    """Generate a 1200x630 OG card for a city."""
    W, H = 1200, 630
    LEFT_W = 660
    RIGHT_W = W - LEFT_W  # 540

    # Create base image
    canvas = Image.new('RGB', (W, H), CREAM)

    # === LEFT PANEL (660px) ===
    left_panel = make_gradient_fast(LEFT_W, H, CREAM, LAVENDER)
    canvas.paste(left_panel, (0, 0))

    # Rose accent bars (top & bottom of left panel)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([0, 0, LEFT_W, 6], fill=ROSE)
    draw.rectangle([0, H - 6, LEFT_W, H], fill=ROSE)

    # === RIGHT PANEL (540px) ===
    # Load and crop hero photo
    hero_path = data["hero"]
    if not os.path.exists(hero_path):
        print(f"  ⚠️ Hero not found: {hero_path}, using fallback gradient")
        # Fallback: branded gradient
        right_panel = make_gradient_fast(RIGHT_W, H, (230, 187, 216), (168, 181, 160))
    else:
        hero = Image.open(hero_path).convert("RGB")
        # Crop/resize to fill 540x630 (cover mode)
        hero_ratio = hero.width / hero.height
        target_ratio = RIGHT_W / H
        if hero_ratio > target_ratio:
            # Too wide, crop width
            new_w = int(hero.height * target_ratio)
            left = (hero.width - new_w) // 2
            hero = hero.crop((left, 0, left + new_w, hero.height))
        else:
            # Too tall, crop height
            new_h = int(hero.width / target_ratio)
            top = (hero.height - new_h) // 2
            hero = hero.crop((0, top, hero.width, top + new_h))
        hero = hero.resize((RIGHT_W, H), Image.LANCZOS)
        right_panel = hero

    canvas.paste(right_panel, (LEFT_W, 0))

    # Rose accent bars on right panel
    draw = ImageDraw.Draw(canvas)
    draw.rectangle([LEFT_W, 0, W, 6], fill=ROSE)
    draw.rectangle([LEFT_W, H - 6, W, H], fill=ROSE)

    # === LEFT TEXT CONTENT ===
    # Padding: 52px top/bottom, 64px left/right
    pad_x = 64
    text_x = pad_x
    text_max_w = LEFT_W - pad_x * 2  # 660 - 128 = 532

    # Accent line
    accent_y = 80
    draw.rectangle([text_x, accent_y, text_x + 40, accent_y + 3], fill=ROSE)

    # Eyebrow (uppercase, letter-spaced)
    eyebrow_font = ImageFont.truetype(SANS_BOLD, 15)
    eyebrow_y = accent_y + 20
    eyebrow_text = data["eyebrow"]
    # Simulate letter-spacing by drawing each char with extra space
    letter_spacing = 2.5
    ex = text_x
    for ch in eyebrow_text:
        draw.text((ex, eyebrow_y), ch, font=eyebrow_font, fill=ROSE_DARK)
        bbox = draw.textbbox((0, 0), ch, font=eyebrow_font)
        ex += (bbox[2] - bbox[0]) + letter_spacing

    # Headline (serif, large)
    headline_font = ImageFont.truetype(SERIF_BOLD, 52)
    headline_y = eyebrow_y + 30
    draw.text((text_x, headline_y), data["headline1"], font=headline_font, fill=DARK_TEXT)
    headline_y += 62
    draw.text((text_x, headline_y), data["headline2"], font=headline_font, fill=DARK_TEXT)
    headline_y += 70

    # Summary (sans, body text, wrapped)
    summary_font = ImageFont.truetype(SANS_REG, 18)
    summary_lines = wrap_text(data["summary"], summary_font, text_max_w, draw)
    for line in summary_lines:
        draw.text((text_x, headline_y), line, font=summary_font, fill=BODY_TEXT)
        headline_y += 28

    # Subhead (sans, semibold, smaller)
    headline_y += 10
    subhead_font = ImageFont.truetype(SANS_BOLD, 15)
    # Draw subhead with · separators in rose
    subhead_text = data["subhead"]
    # Split by · and draw with rose dots
    parts = subhead_text.split(" · ")
    sx = text_x
    for i, part in enumerate(parts):
        draw.text((sx, headline_y), part, font=subhead_font, fill=SUBHEAD_TEXT)
        bbox = draw.textbbox((0, 0), part, font=subhead_font)
        sx += (bbox[2] - bbox[0])
        if i < len(parts) - 1:
            dot_text = " · "
            draw.text((sx, headline_y), "·", font=subhead_font, fill=ROSE)
            bbox_dot = draw.textbbox((0, 0), "·", font=subhead_font)
            sx += (bbox_dot[2] - bbox_dot[0]) + 12  # spacing

    # === LOGO (bottom of left panel) ===
    logo_w, logo_h = logo_img.size
    # Scale logo to ~56px height
    scale = 56 / logo_h
    logo_resized = logo_img.resize((int(logo_w * scale), 56), Image.LANCZOS)
    logo_x = text_x
    logo_y = H - 6 - 20 - 56  # 6px bottom bar, 20px padding, 56px logo
    # Paste with alpha
    canvas.paste(logo_resized, (logo_x, logo_y), logo_resized)

    return canvas

def main():
    logo_img = render_logo()

    results = []
    for slug, data in CITIES.items():
        print(f"Generating OG for {slug}...")
        canvas = generate_og(slug, data, logo_img)

        # Determine output filename — match what cities.ts references
        # We'll overwrite the existing og-city-{slug}.webp and also create the
        # versioned one that cities.ts references
        # The validator checks og-city-{slug}.webp (unversioned)
        out_path = os.path.join(OUT_DIR, f"og-city-{slug}.webp")
        canvas.save(out_path, "WEBP", quality=90, method=6)

        # Check size
        fsize = os.path.getsize(out_path)
        colors = canvas.convert("RGB").getcolors(1_000_000)
        n_colors = len(colors) if colors else 0

        print(f"  → {out_path}: {fsize} bytes, {n_colors} colors, {canvas.size}")
        results.append({"slug": slug, "path": out_path, "size": fsize, "colors": n_colors})

    print("\n=== SUMMARY ===")
    for r in results:
        status = "✅" if r["size"] >= 30000 and r["colors"] >= 5000 else "❌"
        print(f"{status} {r['slug']}: {r['size']}B, {r['colors']} colors")

    return results

if __name__ == "__main__":
    main()