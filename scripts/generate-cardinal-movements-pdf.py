#!/usr/bin/env python3
"""
Generate the Cardinal Movements of Labor cheat sheet PDF using Playwright + HTML.

Uses v6 images for panels 6 (Restitution) and 7 (Expulsion),
and existing v2 images for panels 1-5.

IMPORTANT PDF design rules:
- NEVER use min-height:11in on page divs (causes overflow + no top margin)
- Use page-break-after:always + page-break-inside:avoid + @page margin
- Verify page breaks before shipping
"""

import base64
import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

# Resolve paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = PROJECT_ROOT / "public" / "images" / "cardinal-movements"
OUT_PDF = PROJECT_ROOT / "public" / "resources" / "cardinal-movements-cheat-sheet.pdf"

# Image mapping — v6 for panels 6 & 7, v2 for 1-5
PANEL_IMAGES = [
    ("cardinal-01-engagement-v2.png", "cardinal-01-engagement-v2"),
    ("cardinal-02-descent-v2.png", "cardinal-02-descent-v2"),
    ("cardinal-03-flexion-v2.png", "cardinal-03-flexion-v2"),
    ("cardinal-04-internal-rotation-v2.png", "cardinal-04-internal-rotation-v2"),
    ("cardinal-05-crowning-v2.png", "cardinal-05-crowning-v2"),
    ("cardinal-06-extension-v6.png", "cardinal-06-extension-v6"),
    ("cardinal-07-expulsion-v6.png", "cardinal-07-expulsion-v6"),
]


def img_data_uri(filename: str) -> str:
    """Encode an image as a base64 data URI, downscaled to panel display width (~680px)
    and JPEG-compressed to keep the PDF small (~300KB like the original)."""
    from io import BytesIO

    from PIL import Image

    path = IMG_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Missing image: {path}")
    im = Image.open(path).convert("RGB")
    # Downscale to ~680px wide (matches panel image display size at 150 DPI)
    target_w = 680
    if im.width > target_w:
        ratio = target_w / im.width
        im = im.resize((target_w, int(im.height * ratio)), Image.LANCZOS)
    buf = BytesIO()
    im.save(buf, format="JPEG", quality=82, optimize=True)
    data = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/jpeg;base64,{data}"


# ---------------------------------------------------------------------------
# Panel content (text pulled from the existing PDF + blog post)
# ---------------------------------------------------------------------------

PANELS = [
    {
        "num": 1,
        "title": "Engagement",
        "desc": "Your baby's head drops into the pelvis. First-time moms often feel this weeks before labor; experienced moms, once labor begins.",
        "positions": "Walking, birth ball, pelvic tilts",
        "img": "cardinal-01-engagement-v2.png",
    },
    {
        "num": 2,
        "title": "Descent",
        "desc": "Your baby moves deeper into the pelvis toward the narrowest point. Contractions and fluid pressure help push them down.",
        "positions": "Upright &amp; moving, slow dance, stairs",
        "img": "cardinal-02-descent-v2.png",
    },
    {
        "num": 3,
        "title": "Flexion",
        "desc": "Chin tucks firmly to chest, bringing the smallest part of your baby's head to the birth canal. A well-tucked chin means an easier delivery.",
        "positions": "Hands &amp; knees, forward leaning over ball",
        "img": "cardinal-03-flexion-v2.png",
    },
    {
        "num": 4,
        "title": "Internal Rotation",
        "desc": "Your baby's head rotates so the back of the head (occiput) turns under the pubic bone. No rotation? That's often back labor.",
        "positions": "Lunges, hip squeezes, hands &amp; knees",
        "img": "cardinal-04-internal-rotation-v2.png",
    },
    {
        "num": 5,
        "title": "Extension (Crowning)",
        "desc": "Your baby's head tilts back through the outlet. The face sweeps over the perineum — the \"ring of fire\" moment.",
        "positions": "Supported squat, side-lying with peanut ball",
        "img": "cardinal-05-crowning-v2.png",
    },
    {
        "num": 6,
        "title": "Restitution",
        "desc": "Your baby's head turns back about 45 degrees to line up with the shoulders. Shoulders rotate inside the pelvis, getting ready to deliver.",
        "positions": "Hands &amp; knees, side-lying",
        "img": "cardinal-06-extension-v6.png",
    },
    {
        "num": 7,
        "title": "Expulsion",
        "desc": "The first shoulder slips under the pubic bone, then the second sweeps the perineum. Your baby is here!",
        "positions": "Squatting, supported by partner or bar",
        "img": "cardinal-07-expulsion-v6.png",
    },
]


def build_panel_html(p: dict, is_last_full_row: bool = False) -> str:
    img_uri = img_data_uri(p["img"])
    return f"""
    <div class="panel">
      <div class="panel-img-wrap">
        <img src="{img_uri}" alt="Cardinal movement {p['num']}: {p['title']}" />
      </div>
      <div class="panel-body">
        <div class="panel-num">{p['num']}</div>
        <div class="panel-content">
          <h3 class="panel-title">{p['title']}</h3>
          <p class="panel-desc">{p['desc']}</p>
          <p class="panel-positions"><span class="pos-label">POSITIONS TO TRY:</span> {p['positions']}</p>
        </div>
      </div>
    </div>"""


def build_html() -> str:
    panels_html = "\n".join(build_panel_html(p) for p in PANELS)

    # Station diagram as inline SVG (no external assets)
    station_svg = """
    <svg class="station-diagram" viewBox="0 0 320 70" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="35" x2="280" y2="35" stroke="#c4b5a0" stroke-width="3" stroke-linecap="round"/>
      <circle cx="40" cy="35" r="11" fill="#fff" stroke="#8a7a5c" stroke-width="2.5"/>
      <circle cx="160" cy="35" r="11" fill="#fff" stroke="#8a7a5c" stroke-width="2.5"/>
      <circle cx="280" cy="35" r="11" fill="#fff" stroke="#8a7a5c" stroke-width="2.5"/>
      <text x="40" y="62" text-anchor="middle" font-size="13" font-weight="700" fill="#6b5d44" font-family="Helvetica, Arial, sans-serif">−3</text>
      <text x="160" y="62" text-anchor="middle" font-size="13" font-weight="700" fill="#6b5d44" font-family="Helvetica, Arial, sans-serif">0</text>
      <text x="280" y="62" text-anchor="middle" font-size="13" font-weight="700" fill="#6b5d44" font-family="Helvetica, Arial, sans-serif">+3</text>
      <text x="40" y="16" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="1.5" fill="#9a8a6e" font-family="Helvetica, Arial, sans-serif">HIGH</text>
      <text x="160" y="16" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="1.5" fill="#9a8a6e" font-family="Helvetica, Arial, sans-serif">SPINES</text>
      <text x="280" y="16" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="1.5" fill="#9a8a6e" font-family="Helvetica, Arial, sans-serif">CROWN</text>
    </svg>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Cardinal Movements of Labor — Cheat Sheet</title>
<style>
  @page {{
    size: letter;
    margin: 0.45in 0.5in 0.4in 0.5in;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color-adjust: exact;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #3a3326;
  }}
  body {{ font-size: 10.5px; line-height: 1.4; }}

  /* ---------- Page 1 ---------- */
  .page-1 {{ page-break-after: always; }}

  .header {{
    text-align: center;
    margin-bottom: 6px;
  }}
  .header h1 {{
    font-size: 22px;
    color: #6b5d44;
    letter-spacing: 0.3px;
    font-weight: 800;
  }}
  .header .subtitle {{
    font-size: 10px;
    letter-spacing: 3px;
    color: #b09975;
    font-weight: 700;
    margin-top: 2px;
  }}
  .header .tagline {{
    font-size: 10px;
    color: #7a6e58;
    margin-top: 5px;
    font-style: italic;
  }}

  .panels-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px 12px;
    margin-top: 8px;
  }}

  .panel {{
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1px solid #e2d8c4;
    border-radius: 8px;
    overflow: hidden;
    background: #fffdf8;
    display: flex;
    flex-direction: column;
  }}
  .panel-img-wrap {{
    width: 100%;
    height: 88px;
    overflow: hidden;
    background: #f4eee2;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  .panel-img-wrap img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }}
  .panel-body {{
    display: flex;
    padding: 7px 9px 8px 9px;
    gap: 7px;
  }}
  .panel-num {{
    flex: 0 0 26px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #b09975;
    color: #fff;
    font-weight: 800;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }}
  .panel-content {{ flex: 1; }}
  .panel-title {{
    font-size: 12px;
    color: #6b5d44;
    font-weight: 800;
    margin-bottom: 2px;
  }}
  .panel-desc {{
    font-size: 9.2px;
    color: #5a5040;
    line-height: 1.34;
    margin-bottom: 4px;
  }}
  .panel-positions {{
    font-size: 8.8px;
    color: #3a3326;
    line-height: 1.3;
  }}
  .pos-label {{
    font-weight: 800;
    color: #9a7d52;
    letter-spacing: 0.5px;
  }}

  /* Panel 7 + station diagram row spans full width */
  .panel-7-row {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px 12px;
    margin-top: 9px;
    break-inside: avoid;
    page-break-inside: avoid;
  }}

  .station-card {{
    border: 1px solid #e2d8c4;
    border-radius: 8px;
    background: #fffdf8;
    padding: 10px 12px;
    break-inside: avoid;
    page-break-inside: avoid;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }}
  .station-card h3 {{
    font-size: 11px;
    color: #6b5d44;
    font-weight: 800;
    margin-bottom: 4px;
  }}
  .station-card .station-intro {{
    font-size: 9px;
    color: #5a5040;
    line-height: 1.32;
    margin-bottom: 6px;
  }}
  .station-card .station-ask {{
    font-size: 8.6px;
    color: #7a6e58;
    font-style: italic;
    margin-top: 5px;
  }}

  /* ---------- Page 2 ---------- */
  .page-2 {{ page-break-after: always; }}

  .info-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 11px;
    margin-top: 10px;
  }}
  .info-card {{
    border: 1px solid #e2d8c4;
    border-radius: 8px;
    background: #fffdf8;
    padding: 11px 13px;
    break-inside: avoid;
    page-break-inside: avoid;
  }}
  .info-card h3 {{
    font-size: 11px;
    color: #6b5d44;
    font-weight: 800;
    letter-spacing: 0.3px;
    margin-bottom: 7px;
    padding-bottom: 5px;
    border-bottom: 1.5px solid #e2d8c4;
  }}
  .info-card ul {{ list-style: none; }}
  .info-card li {{
    font-size: 9px;
    color: #4a4133;
    line-height: 1.4;
    margin-bottom: 6px;
    padding-left: 12px;
    position: relative;
  }}
  .info-card li::before {{
    content: "✦";
    position: absolute;
    left: 0;
    top: 0;
    color: #b09975;
    font-size: 8px;
  }}
  .info-card .term {{ font-weight: 800; color: #6b5d44; }}
  .info-card .stage {{ font-weight: 800; color: #9a7d52; }}

  .ask-provider {{
    margin-top: 12px;
    text-align: center;
    padding: 9px 14px;
    background: #f4eee2;
    border-radius: 8px;
    break-inside: avoid;
    page-break-inside: avoid;
  }}
  .ask-provider h3 {{
    font-size: 10px;
    letter-spacing: 2.5px;
    color: #9a7d52;
    font-weight: 800;
    margin-bottom: 5px;
  }}
  .ask-provider p {{
    font-size: 10px;
    color: #4a4133;
    font-weight: 600;
    line-height: 1.45;
  }}

  .footer {{
    position: absolute;
    bottom: 0.2in;
    left: 0.5in;
    right: 0.5in;
    text-align: center;
    font-size: 8px;
    color: #9a8a6e;
    border-top: 1px solid #e2d8c4;
    padding-top: 5px;
    letter-spacing: 0.3px;
  }}
</style>
</head>
<body>

<!-- ============ PAGE 1 ============ -->
<div class="page-1">
  <div class="header">
    <h1>Cardinal Movements of Labor</h1>
    <div class="subtitle">Q U I C K &nbsp; R E F E R E N C E &nbsp; C H E A T &nbsp; S H E E T</div>
    <div class="tagline">The 7 steps your baby takes through your pelvis during birth — and the positions that help at each stage.</div>
  </div>

  <div class="panels-grid">
    {build_panel_html(PANELS[0])}
    {build_panel_html(PANELS[1])}
    {build_panel_html(PANELS[2])}
    {build_panel_html(PANELS[3])}
    {build_panel_html(PANELS[4])}
    {build_panel_html(PANELS[5])}
  </div>

  <div class="panel-7-row">
    {build_panel_html(PANELS[6])}
    <div class="station-card">
      <h3>★ Station of Baby</h3>
      <div class="station-intro">Your provider tracks your baby's descent from −3 (high) to +3 (crowning).</div>
      {station_svg}
      <div class="station-ask">Ask your provider: "What station is the baby at?"</div>
    </div>
  </div>
</div>

<!-- ============ PAGE 2 ============ -->
<div class="page-2">
  <div class="header">
    <h1>Quick Reference</h1>
    <div class="subtitle">D O U L A &nbsp; T I P S &nbsp;·&nbsp; K E Y &nbsp; T E R M S &nbsp;·&nbsp; W H E N &nbsp; T O &nbsp; C A L L</div>
  </div>

  <div class="info-grid">
    <div class="info-card">
      <h3>DOULA TIPS — WHEN LABOR STALLS</h3>
      <ul>
        <li>Switch positions before assuming something is wrong — gravity &amp; asymmetry are your best tools</li>
        <li>Reclining → upright; symmetrical → asymmetrical; still → moving</li>
        <li>Back labor? Hands &amp; knees, hip squeezes, pelvic tilts to encourage rotation</li>
        <li>Ask: "What station?" and "What position is the head in?" — know where your baby is</li>
        <li>Many "failure to progress" labels are really failure to optimize position</li>
      </ul>
    </div>

    <div class="info-card">
      <h3>KEY TERMS TO KNOW</h3>
      <ul>
        <li><span class="term">Station</span> — where baby's head sits relative to the ischial spines (−3 to +3)</li>
        <li><span class="term">Occiput</span> — the back of baby's head; its position drives rotation</li>
        <li><span class="term">Posterior</span> — baby faces your belly; often causes back labor</li>
        <li><span class="term">Anterior</span> — baby faces your spine; the ideal delivery position</li>
        <li><span class="term">Flexion</span> — chin tucked to chest; smallest head diameter presents</li>
        <li><span class="term">Crowning</span> — head visible at the opening; the "ring of fire" moment</li>
      </ul>
    </div>

    <div class="info-card">
      <h3>WHEN TO CALL YOUR DOULA</h3>
      <ul>
        <li><span class="stage">Early</span> — contractions 5+ min apart, manageable, at home</li>
        <li><span class="stage">Active</span> — 3–4 min apart, stronger, needing focus</li>
        <li><span class="stage">Transition</span> — 1–2 min apart, intense, shaking or nausea</li>
        <li><span class="stage">Pushing</span> — urge to push or provider confirms complete dilation</li>
        <li><span class="stage">Always</span> — if your water breaks, bleeding, or decreased movement</li>
      </ul>
    </div>
  </div>

  <div class="ask-provider">
    <h3>ASK YOUR PROVIDER</h3>
    <p>"What station is the baby at?" &nbsp;·&nbsp; "What position is the head in?" &nbsp;·&nbsp; "Is baby well-flexed?" &nbsp;·&nbsp; "Can we try a position change first?"</p>
  </div>

  <div class="footer">
    True Joy Birthing &nbsp;·&nbsp; Free &nbsp;·&nbsp; No email required &nbsp;·&nbsp; Printable PDF &nbsp;·&nbsp; Learn more at truejoybirthing.com &nbsp;·&nbsp; Plan your birth at truejoybirthing.com/birth-plan-template
  </div>
</div>

</body>
</html>"""


def main() -> int:
    # Verify all images exist
    for p in PANELS:
        path = IMG_DIR / p["img"]
        if not path.exists():
            print(f"ERROR: missing image {path}", file=sys.stderr)
            return 1
    print("✓ All 7 panel images found (panels 6 & 7 use v6 images)")

    html = build_html()

    # Ensure output dir exists
    OUT_PDF.parent.mkdir(parents=True, exist_ok=True)

    # Prefer system Chrome (playwright's bundled Chromium may be incomplete/missing)
    chrome_paths = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Users/socializerender/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
    ]
    chrome_exe = None
    for cp in chrome_paths:
        if os.path.isfile(cp):
            chrome_exe = cp
            break

    with sync_playwright() as pw:
        launch_kwargs = {}
        if chrome_exe:
            launch_kwargs["executable_path"] = chrome_exe
            print(f"✓ Using Chromium at: {chrome_exe}")
        browser = pw.chromium.launch(**launch_kwargs)
        page = browser.new_page()
        page.set_content(html, wait_until="networkidle")
        page.emulate_media(media="print")
        page.pdf(
            path=str(OUT_PDF),
            format="letter",
            print_background=True,
            margin={"top": "0.45in", "bottom": "0.4in", "left": "0.5in", "right": "0.5in"},
        )
        browser.close()

    size = OUT_PDF.stat().st_size
    print(f"✓ PDF generated: {OUT_PDF}")
    print(f"  Size: {size:,} bytes ({size/1024:.1f} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())