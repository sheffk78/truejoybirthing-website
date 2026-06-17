#!/usr/bin/env python3
"""
TJB OG Image Generator — Parameterized Batch Renderer
=====================================================

Generates OG images for all TJB pages from a single JSON config file.
Supports two patterns:

  Pattern A (text-only gradient): Pillar pages, service pages, ambassador
  Pattern B (split layout with photo): City pages (Denver-style)

Usage:
  python3 scripts/generate-og-images.py                    # Render all configured OGs
  python3 scripts/generate-og-images.py --slug ambassador   # Render one page
  python3 scripts/generate-og-images.py --dry-run           # Show what would render

Config file: scripts/og-config.json
Output: public/images/og/og-{slug}.png (Pattern A) or public/images/og-city-{slug}.webp (Pattern B)

Requires: playwright (pip install playwright && playwright install chromium)
"""

import json
import os
import sys
import argparse
from pathlib import Path

# ── Paths ──
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent
CONFIG_PATH = SCRIPT_DIR / "og-config.json"
OUTPUT_DIR = PROJECT_DIR / "public" / "images" / "og"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ── HTML Templates ──

PATTERN_A_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: 'Source Sans 3', sans-serif; }
.og-card { width: 100%; height: 100%; background: linear-gradient(135deg, #FAF8F5 0%, #EDE5F5 100%); position: relative; display: flex; flex-direction: column; }
.accent-top { position: absolute; top: 0; left: 0; right: 0; height: 6px; background: #D8A0C4; }
.accent-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 6px; background: #D8A0C4; }
.content { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px 80px 80px; text-align: center; }
.eyebrow { font-family: 'Source Sans 3', sans-serif; font-weight: 600; font-size: 15px; letter-spacing: 0.12em; text-transform: uppercase; color: #B87AA0; margin-bottom: 16px; }
.accent-line { width: 40px; height: 3px; background: #D8A0C4; margin: 0 auto 20px; }
.headline { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 56px; line-height: 1.1; color: #2A2A2A; max-width: 800px; margin-bottom: 16px; }
.tagline { font-family: 'Source Sans 3', sans-serif; font-weight: 400; font-size: 20px; line-height: 1.4; color: #555555; max-width: 650px; margin-bottom: 24px; }
.bullets { font-family: 'Source Sans 3', sans-serif; font-weight: 600; font-size: 15px; color: #6A6B6C; }
.bullets span { color: #D8A0C4; margin: 0 8px; }
.logo { position: absolute; bottom: 24px; left: 40px; height: 56px; }
.logo img { height: 56px; }
</style>
</head>
<body>
<div class="og-card">
  <div class="accent-top"></div>
  <div class="content">
    <div class="eyebrow">{{EYEBROW}}</div>
    <div class="accent-line"></div>
    <div class="headline">{{HEADLINE}}</div>
    <div class="tagline">{{TAGLINE}}</div>
    <div class="bullets">{{BULLETS}}</div>
  </div>
  <div class="accent-bottom"></div>
  <div class="logo">
    <img src="https://truejoybirthing.com/images/logo-mono.svg" alt="True Joy Birthing">
  </div>
</div>
</body>
</html>
"""

PATTERN_B_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: 'Source Sans 3', sans-serif; }
.container { width: 100%; height: 100%; display: flex; }
.left { width: 660px; height: 100%; background: linear-gradient(180deg, #FAF8F5 0%, #EDE5F5 100%); position: relative; display: flex; flex-direction: column; padding: 40px; }
.right { width: 540px; height: 100%; position: relative; overflow: hidden; }
.right img { width: 100%; height: 100%; object-fit: cover; }
.right-fallback { width: 100%; height: 100%; background: linear-gradient(135deg, #E6BBD8 0%, #8E8CB5 50%, #A8B5A0 100%); }
.accent-bar { position: absolute; left: 0; right: 0; height: 6px; background: #D8A0C4; z-index: 2; }
.accent-top { top: 0; }
.accent-bottom { bottom: 0; }
.left-content { flex: 1; display: flex; flex-direction: column; justify-content: center; padding-top: 20px; }
.eyebrow { font-family: 'Source Sans 3', sans-serif; font-weight: 600; font-size: 15px; letter-spacing: 0.12em; text-transform: uppercase; color: #B87AA0; margin-bottom: 12px; }
.accent-line { width: 40px; height: 3px; background: #D8A0C4; margin-bottom: 16px; }
.headline { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 52px; line-height: 1.1; color: #2A2A2A; max-width: 520px; margin-bottom: 12px; }
.summary { font-family: 'Source Sans 3', sans-serif; font-weight: 400; font-size: 18px; line-height: 1.4; color: #555555; max-width: 520px; margin-bottom: 16px; }
.subhead { font-family: 'Source Sans 3', sans-serif; font-weight: 600; font-size: 15px; color: #6A6B6C; }
.subhead span { color: #D8A0C4; margin: 0 8px; }
.logo { margin-top: auto; height: 56px; }
.logo img { height: 56px; }
</style>
</head>
<body>
<div class="container">
  <div class="left">
    <div class="accent-bar accent-top"></div>
    <div class="left-content">
      <div class="eyebrow">{{EYEBROW}}</div>
      <div class="accent-line"></div>
      <div class="headline">{{HEADLINE}}</div>
      <div class="summary">{{SUMMARY}}</div>
      <div class="subhead">{{SUBHEAD}}</div>
    </div>
    <div class="logo">
      <img src="https://truejoybirthing.com/images/logo-mono.svg" alt="True Joy Birthing">
    </div>
    <div class="accent-bar accent-bottom"></div>
  </div>
  <div class="right">
    <div class="accent-bar accent-top"></div>
    {{HERO_HTML}}
    <div class="accent-bar accent-bottom"></div>
  </div>
</div>
</body>
</html>
"""


def load_config():
    """Load OG config from JSON file."""
    if not CONFIG_PATH.exists():
        print(f"❌ Config file not found: {CONFIG_PATH}")
        print("   Create scripts/og-config.json with the format shown in --help")
        sys.exit(1)
    with open(CONFIG_PATH) as f:
        return json.load(f)


def render_pattern_a(entry):
    """Render a Pattern A (text-only gradient) OG card."""
    html = PATTERN_A_TEMPLATE
    html = html.replace("{{EYEBROW}}", entry.get("eyebrow", ""))
    html = html.replace("{{HEADLINE}}", entry.get("headline", ""))
    html = html.replace("{{TAGLINE}}", entry.get("tagline", ""))
    html = html.replace("{{BULLETS}}", entry.get("bullets", ""))
    return html


def render_pattern_b(entry):
    """Render a Pattern B (split layout with photo) OG card."""
    html = PATTERN_B_TEMPLATE
    html = html.replace("{{EYEBROW}}", entry.get("eyebrow", ""))
    html = html.replace("{{HEADLINE}}", entry.get("headline", ""))
    html = html.replace("{{SUMMARY}}", entry.get("summary", ""))
    html = html.replace("{{SUBHEAD}}", entry.get("subhead", ""))

    hero_url = entry.get("heroImage", "")
    if hero_url:
        hero_html = f'<img src="{hero_url}" alt="{entry.get("cityName", "")}" style="width:100%;height:100%;object-fit:cover;" />'
    else:
        hero_html = '<div class="right-fallback"></div>'
    html = html.replace("{{HERO_HTML}}", hero_html)

    return html


def render_og(entry, dry_run=False):
    """Render a single OG card. Returns (slug, output_path, html) or None if skipped."""
    slug = entry["slug"]
    pattern = entry.get("pattern", "A")

    if pattern == "A":
        output_path = OUTPUT_DIR / f"og-{slug}.png"
        html = render_pattern_a(entry)
    elif pattern == "B":
        output_path = OUTPUT_DIR / f"og-city-{slug}.webp"
        html = render_pattern_b(entry)
    else:
        print(f"  ⚠  Unknown pattern '{pattern}' for {slug}, skipping")
        return None

    if dry_run:
        return (slug, output_path, None)

    # Write temp HTML
    temp_html = SCRIPT_DIR / f"_temp_og_{slug}.html"
    with open(temp_html, "w") as f:
        f.write(html)

    # Render with Playwright
    from playwright.sync_api import sync_playwright

    W, H = 1200, 630
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
            page.goto(f"file://{temp_html}", wait_until="networkidle")
            page.wait_for_timeout(5000)
            page.screenshot(path=str(output_path), clip={"x": 0, "y": 0, "width": W, "height": H})
            browser.close()
    except Exception as e:
        print(f"  ❌ Playwright error for {slug}: {e}")
        temp_html.unlink(missing_ok=True)
        return None
    finally:
        temp_html.unlink(missing_ok=True)

    size = output_path.stat().st_size
    return (slug, output_path, size)


def main():
    parser = argparse.ArgumentParser(description="Generate TJB OG images from config")
    parser.add_argument("--slug", help="Render only one page by slug")
    parser.add_argument("--dry-run", action="store_true", help="Show what would render without rendering")
    args = parser.parse_args()

    config = load_config()
    entries = config.get("pages", [])

    if args.slug:
        entries = [e for e in entries if e["slug"] == args.slug]
        if not entries:
            print(f"❌ No config entry found for slug '{args.slug}'")
            sys.exit(1)

    print(f"\n📸 TJB OG Image Generator")
    print(f"   Config: {CONFIG_PATH}")
    print(f"   Output: {OUTPUT_DIR}")
    print(f"   Pages:  {len(entries)}")
    if args.dry_run:
        print(f"   Mode:   DRY RUN (no files written)\n")
    else:
        print()

    results = {"ok": 0, "skipped": 0, "failed": 0}

    for entry in entries:
        slug = entry["slug"]
        pattern = entry.get("pattern", "A")
        label = entry.get("label", slug)

        if args.dry_run:
            pattern_name = "A (text gradient)" if pattern == "A" else "B (split + photo)"
            print(f"  · {label:40s} → og-{slug}.png  [{pattern_name}]")
            results["skipped"] += 1
            continue

        print(f"  Rendering {label}...", end=" ")
        result = render_og(entry)

        if result is None:
            print("❌ failed")
            results["failed"] += 1
        else:
            slug_out, path, size = result
            size_kb = size / 1024 if size else 0
            print(f"✅ {path.name} ({size_kb:.0f} KB)")
            results["ok"] += 1

    print(f"\n{'─' * 50}")
    if args.dry_run:
        print(f"  Would render: {results['skipped']} pages")
        print(f"  Run without --dry-run to generate files")
    else:
        print(f"  ✅ {results['ok']} rendered  |  ❌ {results['failed']} failed")
    print()


if __name__ == "__main__":
    main()
