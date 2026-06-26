"""Generate TJB-branded OG image (1200x630) for a blog post or page.
Matching the TJB lavender gradient pattern used across the site.

Usage:
    python scripts/generate-og.py {slug} ["Custom Title Line 1" "Custom Title Line 2"]

If no title lines provided, the slug is split on hyphens and used as fallback.
Output: public/images/og-{slug}.webp

Requires PIL (Pillow). Available in the project venv.
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys

W, H = 1200, 630
FONT_PATH = "/System/Library/Fonts/Helvetica.ttc"
PROJECT_DIR = "/Users/socializerender/Projects/truejoybirthing-website"

def generate_og(slug: str, title_lines=None):
    img = Image.new('RGB', (W, H), (107, 91, 149))
    draw = ImageDraw.Draw(img)

    for y in range(H):
        ratio = y / H
        r = int(107 + (155 - 107) * ratio)
        g = int(91 + (143 - 91) * ratio)
        b = int(149 + (196 - 149) * ratio)
        for x in range(W):
            img.putpixel((x, y), (r, g, b))

    draw.ellipse([(-100, -100), (500, 500)], fill=(130, 115, 170), outline=None)
    draw.ellipse([(700, 200), (1300, 600)], fill=(90, 75, 135), outline=None)

    title_font = ImageFont.truetype(FONT_PATH, 52)
    if not title_lines:
        words = slug.replace("-", " ").title()
        mid = len(words) // 2
        split_at = words.rfind(" ", 0, mid)
        if split_at == -1:
            split_at = words.find(" ", mid)
        title_lines = [words[:split_at], words[split_at+1:]] if split_at > 0 else [words]

    y_start = 180
    for line in title_lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        tw = bbox[2] - bbox[0]
        x = (W - tw) // 2
        draw.text((x, y_start), line, fill=(255, 255, 255), font=title_font)
        y_start += 68

    brand_font = ImageFont.truetype(FONT_PATH, 18)
    brand = "True Joy Birthing"
    bbox = draw.textbbox((0, 0), brand, font=brand_font)
    tw = bbox[2] - bbox[0]
    x = (W - tw) // 2
    draw.text((x, H - 50), brand, fill=(200, 190, 220), font=brand_font)

    output_dir = os.path.join(PROJECT_DIR, "public/images")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"og-{slug}.webp")
    img.save(output_path, "WEBP", quality=90)
    print(f"OG image: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate-og.py {slug} [title_line1 title_line2]")
        sys.exit(1)
    slug = sys.argv[1]
    title_lines = sys.argv[2:4] if len(sys.argv) > 2 else None
    generate_og(slug, title_lines)