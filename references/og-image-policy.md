# TJB OG / Social Preview Image Policy

Last updated: June 2026

## ⚠️ CRITICAL: The Real Logo vs. Wrong Logo

The repo contains **two different logo marks** — they are NOT interchangeable:

| Mark | File | Description | Status |
|---|---|---|---|
| **Correct** | `public/images/logo.svg` | Flowing pregnant woman silhouette (lavender) + cursive "True Joy Birthing" (dusty rose) | ✅ Real logo — used in nav, footer, schema.org |
| **Correct (mono)** | `public/images/logo-mono.svg` | Same design in solid black (#141414/#131313) | ✅ Real logo — for OG cards and light backgrounds |
| **WRONG** | `public/images/og-default.webp` | Geometric `( • )` dot-and-parens mark + serif "True Joy" + sans-serif "Birthing" (lavender) | ❌ Invented placeholder — MUST NEVER appear on consumer pages |

**Rule:** The only correct TJB logo is in `logo.svg` (pregnant woman silhouette + cursive wordmark). For OG cards on light backgrounds, ALWAYS use `logo-mono.svg` — the color logo.svg uses pastel fills that are invisible against cream. The geometric `( • )` mark in `og-default.webp` was an early placeholder that was never the real brand mark. Do not use it on any page, OG image, or social preview.

**Logo sizing rule:** On OG cards, the logo MUST be ≥56px height. The old 14px wordmark was invisible at social media thumbnail scale (~200px wide). Always use `logo-mono.svg` at a minimum of 56px height on Pattern A and Pattern B cards.

## OG Image Patterns (APPROVED June 2026)

Three patterns, approved by Jeff, with two implemented:

### Pattern A: Product/Service Pages
- **For:** Homepage, Confidence Session, Birth Plan Template, About, Courses/App pages
- **Layout:** Cream-to-lavender gradient, centered bold headline + smaller tagline, TJB logo bottom-left, dusty rose accent bars top/bottom
- **Headline rule:** Must be a **concrete value proposition** — "Birth Plan Confidence Session (60–75 min Zoom)", "Free Doula-Crafted Birth Plan". No vague emotional taglines.
- **No photos.** Text-only until real product photos/screenshots exist.
- **Logo:** `logo-mono.svg` at ≥56px height, bottom-left. NOT the color logo.
- **Implemented:** `/images/og/og-confidence-session.png` (Confidence Session)

### Pattern B: Location/City Pages (v2 — June 2026)
- **For:** `/birth-support/[city]/` and `/birth-support/[state]/`
- **Layout:** Split layout — text left (660px), photo right (540px). Key elements:
  - **Left column:** Cream→lavender vertical gradient (`#FAF8F5` → `#EDE5F5`)
    - Rose accent bar at top (6px `#D8A0C4`) spanning full width
    - Small rose accent line (40px × 3px `#D8A0C4`) as eyebrow marker
    - Eyebrow: "{CITY} BIRTH SUPPORT" (15px Source Sans 3 600, `#B87AA0`, uppercase, `letter-spacing: 0.12em`)
    - Headline: "Doulas & Birth Plans / in {City}, {ST}" (52px Cormorant Garamond 700, `#2A2A2A`)
    - Summary: City-specific 1-2 sentence pitch referencing local geography/landmarks (18px Source Sans 3 400, `#555555`, max-width 520px)
    - Subtext bullet points: "Free birth plan template · Hospital info · Real costs · Medicaid coverage" (15px Source Sans 3 600, `#6A6B6C`, `·` separators in rose `#D8A0C4`)
    - Logo: `logo-mono.svg` at 56px height, bottom-left, `margin-top: auto`. NOT the color logo. NOT a text wordmark.
  - **Right column (540px):** Hero image fills full right half (`object-fit: cover`)
    - For Denver: composited B-2 silhouette with Front Range mountains (`denver-hero-front-range.webp`)
    - For other cities WITHOUT a hero image: branded gradient fallback `linear-gradient(135deg, #E6BBD8 0%, #8E8CB5 50%, #A8B5A0 100%)`
    - Rose accent bars at top and bottom (6px `#D8A0C4`, z-index 2)
  - Rose accent bars at top and bottom of both columns (6px `#D8A0C4`)
- **Design evolution (important context):**
  - v1: Gradient right panel, 14px text-only wordmark, no summary, no photo — Jeff: "logo is too small"
  - v2 (approved June 2026): Photo right column, 56px mono logo, city-specific summary text, eyebrow label
- **No skyline photos.** All 180 `*-birth-doula-skyline.webp` files are AI-generated composites with fake architecture — no real city landmarks. They're acceptable as page hero backgrounds but NOT for OG cards.
- **City name is the largest text on the card.** Must be readable at thumbnail size.
- **Summary text must be city-specific.** Reference local geography, landmarks, or community. NOT generic copy. Examples:
  - Denver: "From the Front Range to the Platte, Denver families deserve birth support that gets it."
  - Austin: "From Lady Bird Lake to the Hill Country, Austin families deserve birth support that gets it."
  - Portland: "From the Willamette to the West Hills, Portland families deserve birth support that gets it."
- **Implemented:** `/images/og/og-city-denver-co.webp` (Denver, CO)

### Pattern C: Logo-Only (Fallback)
- **For:** Error pages, generic shares, any page without A or B assignment
- **Layout:** Logo centered on cream gradient with "Joyful Birth Plan" tagline. Dusty rose accent bars top/bottom.
- **Current default:** `true-joy-birthing-main.png` — wired as Layout.astro fallback
- **Over time, migrate important pages to Pattern A or B**

## Current OG Image Status (June 2026)

| Image | File | Used On | Status |
|---|---|---|---|
| **Pattern A (Confidence Session)** | `og/og-confidence-session.png` | `/birth-plan-confidence-session/` | ✅ Live — approved Pattern A |
| **Pattern B (Denver)** | `og-city-denver-co.webp` | `/birth-support/denver-co/` | ✅ Live — approved Pattern B v2 (split layout with photo) |
| **Logo card (default)** | `og/true-joy-birthing-main.png` | `/`, about, contact, ambassador, Layout default | ✅ Live — Pattern C fallback |
| ~~Homepage OG~~ | ~~`og-homepage.webp`~~ | ~~Homepage, about, etc.~~ | ❌ Deprecated — AI portrait, no longer referenced |
| ~~Default fallback~~ | ~~`og-default.webp`~~ | ~~Layout fallback~~ | ❌ Deprecated — wrong geometric logo, no longer referenced |
| Per-city OGs | `og-city-{slug}.webp` | 180+ city pages (except denver-co) | ⚠️ Legacy — need migration to Pattern B v2 |

## Canonical Pattern B Template

**Template file:** `scripts/render-city-og-template.html`

This is the canonical HTML template for all city/location OG cards. It contains placeholders for:
- `{{EYEBROW}}` — e.g. "DENVER BIRTH SUPPORT"
- `{{HEADLINE}}` — e.g. "Doulas & Birth Plans<br>in Denver, CO"
- `{{SUMMARY}}` — City-specific 1-2 sentence pitch
- `{{SUBHEAD}}` — e.g. "Free birth plan template · Hospital info · Real costs · Medicaid coverage"
- `{{HERO_IMAGE}}` — Production URL of city hero image, or gradient fallback
- `{{CITY_NAME}}` — Alt text for hero image

**Denver already rendered:** `scripts/render-denver-og-v2.html` is the Denver instance.

## Rendering OG Cards — Playwright Pattern

Browser screenshots from Hermes's `browser_navigate` → `browser_vision` pipeline introduce device pixel ratio and browser chrome artifacts. Use **Playwright with exact viewport** for pixel-perfect OG cards:

1. **Copy** `scripts/render-city-og-template.html` to `scripts/render-{city-slug}-og.html`
2. **Replace placeholders** with city-specific content (see template comments for examples)
3. **For cities without a hero image:** Replace the right-column `<img>` with a gradient div: `<div class="right-column" style="background: linear-gradient(135deg, #E6BBD8 0%, #8E8CB5 50%, #A8B5A0 100%);"></div>`
4. **Render with Playwright:**
```python
from playwright.sync_api import sync_playwright

W, H = 1200, 630

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': W, 'height': H}, device_scale_factor=1)
    page.goto(f'file://{html_path}', wait_until='networkidle')
    page.wait_for_timeout(5000)  # Wait for Google Fonts + images
    page.screenshot(path=output_path, clip={'x': 0, 'y': 0, 'width': W, 'height': H})
    browser.close()
```
5. **PIL pixel verification.** After saving, check edge pixels to confirm no white-stripe artifacts.
6. **Save as PNG** for the rendering step (LinkedIn/X don't reliably render WebP), then convert to WebP for site delivery at `public/images/og-city-{slug}.webp`.
7. **Wire into Astro** via the `ogImage` prop in `[city].astro`: `ogImage=\`https://truejoybirthing.com/images/og-city-${slug}.webp\``

**CRITICAL: Use production URLs** (`https://truejoybirthing.com/images/...`) or dev server URLs in HTML templates. `file://` paths don't load images in Playwright.

## Design Rules for OG Cards

1. **All OG cards must use TJB semantic color tokens** — cream (#FAF8F5), lavender-600 (#7C3AED), charcoal (#2A2D2D or #2A2A2A), dusty rose (#D8A0C4), lavender-100 (#EDE5FF).
2. **Always use `logo-mono.svg` at ≥56px height** — the color `logo.svg` has pastel fills invisible on cream backgrounds. The 14px wordmark is too small for social feeds. Bottom-left position (Jeff's explicit preference, not centered).
3. **Headlines ≤ ~7-8 words** so the card reads at thumbnail size (~200px wide in social feeds).
4. **Concrete headlines only.** Jeff explicitly prefers "Birth Plan Confidence Session (60–75 min Zoom)" over vague emotional taglines. Product pages must answer "what is this?" at thumbnail size.
5. **Summary text must be city-specific** for Pattern B cards. Reference local geography, landmarks, or community — not generic birth support copy.
6. **No AI people, no fake UI, no fake photos.** This includes "skyline" images that are actually AI composites — they contain fake architecture with no real landmarks.
7. **PNG format for render output, WebP for site delivery.** LinkedIn and X don't reliably render WebP, so render as PNG first, then convert: `python3 -c "from PIL import Image; Image.open('og.png').save('og.webp', 'WEBP', quality=95)"`
8. **Font stack:** Source Sans 3 for labels/body, Cormorant Garamond for headlines/city names (both loaded via Google Fonts in the HTML renderer).
9. **Photo on the right for Pattern B.** Text stack left (660px), photo right (540px). Jeff explicitly requested this layout.

## Layout Component Defaults

The `Layout.astro` component sets `ogImage` defaults:

- **Default fallback (Pattern C):** `https://truejoybirthing.com/images/og/true-joy-birthing-main.png`
- **`og-homepage.webp` and `og-default.webp` are explicitly banned** — wrong/absent logos
- Each page passes its own `ogImage` prop to override (e.g., `/images/og/og-confidence-session.png`)
- City template uses: `ogImage=\`https://truejoybirthing.com/images/og-city-${slug}.webp\``

## Fallen Angels (Never Reuse)

- `og-homepage.webp` — AI portrait of a woman's face. Removed from all templates.
- `og-default.webp` — Invented geometric `( • )` icon. Never the real brand mark.
- `*-birth-doula-support.webp` — All 180 AI-generated doula images with anatomical artifacts. Template now uses `/images/doula-walking.webp` instead.
- `*-birth-doula-skyline.webp` — All 180 AI-generated city composites. Acceptable as page hero backgrounds only, NOT for OG cards or close-up use.