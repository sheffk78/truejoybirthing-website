#!/usr/bin/env python3
"""Render ID state OG image using Playwright."""
import asyncio
from playwright.async_api import async_playwright
from PIL import Image
import io
from pathlib import Path

PROJECT_DIR = Path.home() / 'Projects' / 'truejoybirthing-website'
HTML_PATH = str(PROJECT_DIR / 'scripts' / 'og-state-id-composition.html')
OUTPUT_PATH = str(PROJECT_DIR / 'public' / 'images' / 'og' / 'og-state-id.png')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1200, "height": 630})
        await page.goto("file://" + HTML_PATH, wait_until="networkidle")
        await page.wait_for_timeout(5000)
        screenshot = await page.screenshot(clip={"x": 0, "y": 0, "width": 1200, "height": 630})
        img = Image.open(io.BytesIO(screenshot))
        img.save(OUTPUT_PATH, "PNG")
        w, h = img.size
        print(f"Rendered: {w}x{h}")
        await browser.close()

asyncio.run(main())