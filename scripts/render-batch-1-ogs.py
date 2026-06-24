#!/usr/bin/env python3
"""Render Pattern B OG images for Batch 1 cities using Playwright."""
import os, sys, subprocess
from pathlib import Path

PROJECT_DIR = Path(os.path.expanduser('~/Projects/truejoybirthing-website'))
OUTPUT_DIR = PROJECT_DIR / 'public' / 'images'
TEMPLATE = PROJECT_DIR / 'scripts' / 'render-city-og-template.html'

CITIES = [
    {
        'slug': 'baltimore-md',
        'city': 'Baltimore',
        'state': 'MD',
        'eyebrow': 'BALTIMORE BIRTH SUPPORT',
        'headline': 'Doulas & Birth Plans<br>in Baltimore, MD',
        'summary': 'From the Inner Harbor to Federal Hill, Baltimore families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for Maryland moms.',
        'hero': '/images/baltimore-md-birth-doula-skyline.webp',
    },
    {
        'slug': 'philadelphia-pa',
        'city': 'Philadelphia',
        'state': 'PA',
        'eyebrow': 'PHILADELPHIA BIRTH SUPPORT',
        'headline': 'Doulas & Birth Plans<br>in Philadelphia, PA',
        'summary': 'From the Delaware to the Schuylkill, Philadelphia families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for Pennsylvania moms.',
        'hero': '/images/philadelphia-pa-birth-doula-skyline.webp',
    },
    {
        'slug': 'seattle-wa',
        'city': 'Seattle',
        'state': 'WA',
        'eyebrow': 'SEATTLE BIRTH SUPPORT',
        'headline': 'Doulas & Birth Plans<br>in Seattle, WA',
        'summary': 'From Puget Sound to the Cascades, Seattle families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for Washington moms.',
        'hero': '/images/seattle-wa-birth-doula-skyline-1200.webp',
    },
    {
        'slug': 'phoenix-az',
        'city': 'Phoenix',
        'state': 'AZ',
        'eyebrow': 'PHOENIX BIRTH SUPPORT',
        'headline': 'Doulas & Birth Plans<br>in Phoenix, AZ',
        'summary': 'From Camelback Mountain to South Mountain, Phoenix families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for Arizona moms.',
        'hero': '/images/phoenix-az-birth-doula-skyline.webp',
    },
    {
        'slug': 'nashville-tn',
        'city': 'Nashville',
        'state': 'TN',
        'eyebrow': 'NASHVILLE BIRTH SUPPORT',
        'headline': 'Doulas & Birth Plans<br>in Nashville, TN',
        'summary': 'From the Cumberland to Music Row, Nashville families deserve birth support that gets it. Local doulas, real hospital policies, and a free birth plan template built for Tennessee moms.',
        'hero': '/images/nashville-tn-birth-doula-skyline.webp',
    },
]

SUBHEAD = 'Free birth plan template \u00b7 Hospital info \u00b7 Real costs \u00b7 Medicaid coverage'

RENDER_SCRIPT = '''#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright
from PIL import Image
import io

HTML_PATH = "HTML_PLACEHOLDER"
OUTPUT_PATH = "OUTPUT_PLACEHOLDER"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1200, "height": 630})
        await page.goto("file://" + HTML_PATH, wait_until="networkidle")
        await page.wait_for_timeout(5000)
        screenshot = await page.screenshot(clip={"x": 0, "y": 0, "width": 1200, "height": 630})
        img = Image.open(io.BytesIO(screenshot))
        img.save(OUTPUT_PATH, "WEBP", quality=90)
        w, h = img.size
        print(f"Rendered: {w}x{h}")
        await browser.close()

asyncio.run(main())
'''

def render_og(city_info):
    """Create HTML, render with Playwright, save as WebP."""
    slug = city_info['slug']
    hero_path = str(PROJECT_DIR / 'public' / city_info['hero'].lstrip('/'))
    logo_path = str(PROJECT_DIR / 'public' / 'images' / 'logo-mono.svg')
    
    # Read template and replace placeholders
    html = TEMPLATE.read_text()
    html = html.replace('{{EYEBROW}}', city_info['eyebrow'])
    html = html.replace('{{HEADLINE}}', city_info['headline'])
    html = html.replace('{{SUMMARY}}', city_info['summary'])
    html = html.replace('{{SUBHEAD}}', SUBHEAD)
    html = html.replace('{{HERO_IMAGE}}', f'file://{hero_path}')
    html = html.replace('{{LOGO_SRC}}', f'file://{logo_path}')
    html = html.replace('{{CITY_NAME}}', f'{city_info["city"]}, {city_info["state"]}')
    
    # Write temp HTML
    temp_html = PROJECT_DIR / 'scripts' / f'render-{slug}-og.html'
    temp_html.write_text(html)
    
    output_webp = OUTPUT_DIR / f'og-city-{slug}.webp'
    
    # Write render script with paths substituted
    render_py = PROJECT_DIR / 'scripts' / f'render-{slug}-og.py'
    script = RENDER_SCRIPT.replace('HTML_PLACEHOLDER', str(temp_html))
    script = script.replace('OUTPUT_PLACEHOLDER', str(output_webp))
    render_py.write_text(script)
    
    result = subprocess.run(
        ['python3', str(render_py)],
        capture_output=True, text=True, timeout=60,
        cwd=str(PROJECT_DIR)
    )
    
    # Cleanup temp files
    temp_html.unlink(missing_ok=True)
    render_py.unlink(missing_ok=True)
    
    if result.returncode != 0:
        print(f"  ❌ {slug}: {result.stderr[:200]}")
        return False
    
    # Verify output
    if output_webp.exists():
        size = output_webp.stat().st_size
        status = '✅' if size > 30000 else '⚠️'
        print(f"  {status} {slug}: {size:,} bytes")
        return size > 30000
    else:
        print(f"  ❌ {slug}: output file not found")
        return False

def main():
    print("Rendering Pattern B OG images for Batch 1 cities...")
    print(f"Output: {OUTPUT_DIR}")
    print()
    
    results = {}
    for city in CITIES:
        print(f"  {city['city']}, {city['state']} ({city['slug']})...")
        results[city['slug']] = render_og(city)
    
    print()
    passed = sum(1 for v in results.values() if v)
    failed = sum(1 for v in results.values() if not v)
    print(f"Done: {passed} passed, {failed} failed")
    
    return 0 if failed == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
