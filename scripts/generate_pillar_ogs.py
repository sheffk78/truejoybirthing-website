#!/usr/bin/env python3
"""Generate 9 OG card images for TJB pillar pages using the Denver split-screen template."""

import os
from playwright.sync_api import sync_playwright

BASE_DIR = "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/web-strategy/truejoybirthing-website/public/images"

PAGES = [
    {
        "slug": "what-is-a-doula",
        "eyebrow": "DOULA BASICS",
        "headline": "What Is a Doula?",
        "body": "A doula provides continuous emotional, physical, and informational support during pregnancy, labor, and the postpartum period.",
        "tags": "Support • Education • Advocacy",
        "image": "hero-what-is-a-doula.webp",
    },
    {
        "slug": "benefits-of-a-doula",
        "eyebrow": "DOULA BENEFITS",
        "headline": "Benefits of a Doula",
        "body": "Studies show doulas reduce C-section rates by 28%, shorten labor, and improve maternal satisfaction.",
        "tags": "Evidence • Outcomes • Support",
        "image": "hero-benefits-of-a-doula.webp",
    },
    {
        "slug": "how-to-choose-a-doula",
        "eyebrow": "FINDING YOUR DOULA",
        "headline": "How to Choose a Doula",
        "body": "Questions to ask, certifications to look for, and how to find the right doula for your birth.",
        "tags": "Interview • Certifications • Fit",
        "image": "hero-how-to-choose-a-doula.webp",
    },
    {
        "slug": "doula-cost",
        "eyebrow": "DOULA COSTS",
        "headline": "How Much Does a Doula Cost?",
        "body": "Birth doulas typically cost $800 to $2,500. Some insurance and Medicaid cover doula services.",
        "tags": "Pricing • Insurance • Medicaid",
        "image": "hero-doula-cost.webp",
    },
    {
        "slug": "postpartum-doula",
        "eyebrow": "POSTPARTUM SUPPORT",
        "headline": "Postpartum Doula Support",
        "body": "Support for recovery, newborn care, breastfeeding, and the emotional transition after birth.",
        "tags": "Recovery • Newborn • Feeding",
        "image": "hero-postpartum-doula.webp",
    },
    {
        "slug": "birth-plan-template",
        "eyebrow": "BIRTH PLAN",
        "headline": "Free Birth Plan Template",
        "body": "A fillable birth plan template built by a certified doula. Five sections your nurse can read in 30 seconds.",
        "tags": "PDF • Fillable • Free",
        "image": "hero-birth-plan-template.webp",
    },
    {
        "slug": "faq",
        "eyebrow": "COMMON QUESTIONS",
        "headline": "Doula & Birth FAQ",
        "body": "Answers to the questions expectant parents ask most about doulas, birth plans, and hospital policies.",
        "tags": "Q&A • Cost • Hospital",
        "image": "hero-faq.webp",
    },
    {
        "slug": "doula-vs-midwife",
        "eyebrow": "DOULA VS MIDWIFE",
        "headline": "Doula vs. Midwife",
        "body": "A doula supports you emotionally. A midwife delivers your baby. You can have both.",
        "tags": "Roles • Medical • Support",
        "image": "hero-doula-vs-midwife.webp",
    },
    {
        "slug": "medicaid-doula-coverage",
        "eyebrow": "MEDICAID COVERAGE",
        "headline": "Medicaid & Doula Coverage",
        "body": "Which states cover doula services through Medicaid, what's included, and how to get coverage.",
        "tags": "States • Eligibility • Billing",
        "image": "hero-medicaid-doula-coverage.webp",
    },
]


def build_html(page: dict, hero_path: str) -> str:
    """Build the split-screen OG card HTML for one page."""
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * {{ margin: 0; padding: 0; box-sizing: border-box; }}

  body {{
    width: 1200px;
    height: 630px;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
  }}

  .card {{
    width: 1200px;
    height: 630px;
    display: flex;
    flex-direction: row;
  }}

  .left-panel {{
    width: 55%;
    height: 100%;
    background: #6B5B95;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 50px 50px 60px;
    position: relative;
    z-index: 2;
  }}

  .eyebrow {{
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.75);
    text-transform: uppercase;
    margin-bottom: 16px;
  }}

  .headline {{
    font-size: 46px;
    font-weight: 800;
    color: #FFFFFF;
    line-height: 1.15;
    margin-bottom: 20px;
    max-width: 520px;
  }}

  .body-text {{
    font-size: 17px;
    font-weight: 400;
    color: rgba(255,255,255,0.85);
    line-height: 1.55;
    max-width: 480px;
    margin-bottom: 30px;
  }}

  .tags {{
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.6);
    letter-spacing: 1px;
    margin-top: auto;
  }}

  .logo {{
    position: absolute;
    bottom: 40px;
    left: 60px;
    display: flex;
    align-items: center;
    gap: 8px;
  }}

  .logo-heart {{
    width: 22px;
    height: 22px;
  }}

  .logo-text {{
    font-size: 16px;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: 0.5px;
  }}

  .logo-joy {{
    color: #F8D3E3;
  }}

  .right-panel {{
    width: 45%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }}

  .right-panel img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }}

  .gradient-overlay {{
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 100%;
    background: linear-gradient(to right, #6B5B95 0%, rgba(107,91,149,0.7) 30%, rgba(107,91,149,0.2) 70%, transparent 100%);
    z-index: 1;
  }}
</style>
</head>
<body>
<div class="card">
  <div class="left-panel">
    <div class="eyebrow">{page['eyebrow']}</div>
    <div class="headline">{page['headline']}</div>
    <div class="body-text">{page['body']}</div>
    <div class="tags">{page['tags']}</div>
    <div class="logo">
      <svg class="logo-heart" viewBox="0 0 24 24" fill="none">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F8D3E3"/>
      </svg>
      <span class="logo-text">True <span class="logo-joy">Joy</span> Birthing</span>
    </div>
  </div>
  <div class="right-panel">
    <div class="gradient-overlay"></div>
    <img src="file://{hero_path}" alt="">
  </div>
</div>
</body>
</html>"""


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            viewport={"width": 1200, "height": 630},
            device_scale_factor=2,
        )
        page = context.new_page()

        for pg in PAGES:
            slug = pg["slug"]
            hero_filename = pg["image"]
            hero_path = os.path.join(BASE_DIR, hero_filename)
            output_path = os.path.join(BASE_DIR, f"og-{slug}.webp")

            if not os.path.exists(hero_path):
                print(f"⚠️  Missing hero image: {hero_path}")
                continue

            html = build_html(pg, hero_path)
            page.set_content(html, wait_until="networkidle")

            # Wait for the font + image to load
            page.wait_for_timeout(1500)

            png_path = output_path.replace(".webp", ".png")
            page.screenshot(
                path=png_path,
                type="png",
                clip={"x": 0, "y": 0, "width": 1200, "height": 630},
            )

            # Convert PNG → WebP via Pillow, resize from 2x to 1x for crisp text
            from PIL import Image as PILImage
            img = PILImage.open(png_path)
            # Resize from 2400x1260 to 1200x630 (2x → 1x) for crisp antialiased text
            img = img.resize((1200, 630), PILImage.Resampling.LANCZOS)
            img.save(output_path, "WEBP", quality=92)
            os.remove(png_path)

            size_kb = os.path.getsize(output_path) / 1024
            print(f"✅ {os.path.basename(output_path)} ({size_kb:.0f} KB)")

        browser.close()

    print("\n🎉 All 9 pillar OG cards generated!")


if __name__ == "__main__":
    main()