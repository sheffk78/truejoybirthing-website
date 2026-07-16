# State Page Image Upgrade Plan

## What was done for Colorado (the template)

### Infrastructure added
1. **`src/data/states.ts`**: Added `stateImages` registry map + `heroImage`, `heroImageAlt`, `ogImage` fields to `StateData` interface
2. **`src/pages/birth-support/[state].astro`**: Split-layout hero with photo (55% text / 45% image), passes `ogImage` + `ogImageAlt` to Layout
3. **Graceful fallback**: States without images in the registry still render the old text-only hero

### Per-state work (repeat for each)
1. Generate AI photo of iconic state landmark (golden hour, pregnant woman silhouette, matching city hero style)
2. Crop to 1200x800 (3:2), convert to webp (q85) + 600w responsive version (q80)
3. Save to `public/images/state-{code}-{landmark}.webp` and `-600.webp`
4. Create OG composition HTML (`scripts/og-state-{code}-composition.html`) using the split-panel template
5. Render OG to `public/images/og/og-state-{code}.png` via Playwright
6. Add entry to `stateImages` in `states.ts`
7. Build + deploy

## 27 states remaining

### Priority order (by city count / traffic)
High priority (5+ cities):
- **TX** — Texas (52 cities): San Antonio River Walk or Big Bend National Park
- **CA** — California (11 cities): Golden Gate Bridge or Yosemite Half Dome
- **FL** — Florida (8 cities): Miami South Beach or Everglades
- **NC** — North Carolina (6 cities): Blue Ridge Mountains or Outer Banks lighthouse

Medium priority (3-5 cities):
- **NY** — New York: NYC skyline or Niagara Falls
- **GA** — Georgia: Atlanta skyline or Savannah oak trees
- **MI** — Michigan: Detroit skyline or Great Lakes
- **MD** — Maryland: Baltimore Inner Harbor or Chesapeake Bay
- **VA** — Virginia: Shenandoah Mountains or Colonial Williamsburg
- **IL** — Illinois: Chicago skyline or Lake Michigan
- **OH** — Ohio: Cleveland Lake Erie or Cincinnati skyline
- **MA** — Massachusetts: Boston Common or Cape Cod
- **MN** — Minnesota: Minneapolis lakes or Boundary Waters
- **WA** — Washington: Mt. Rainier or Seattle Space Needle
- **PA** — Pennsylvania: Philadelphia Liberty Bell or Pittsburgh bridges
- **NJ** — New Jersey: Jersey Shore or Atlantic City
- **AZ** — Arizona: Grand Canyon or Saguaro cactus desert
- **OR** — Oregon: Crater Lake or Portland bridges
- **TN** — Tennessee: Nashville skyline or Great Smoky Mountains

Lower priority (1-2 cities):
- **CT** — Connecticut: New England lighthouse or Mystic Seaport
- **UT** — Utah: Zion National Park or Salt Lake Temple
- **NV** — Nevada: Las Vegas Strip or Red Rock Canyon
- **ID** — Idaho: Sawtooth Mountains or Boise river
- **IN** — Indiana: Indianapolis Monument Circle or Indiana dunes
- **OK** — Oklahoma: Oklahoma City skyline or Wichita Mountains
- **SC** — South Carolina: Charleston harbor or Hilton Head
- **RI** — Rhode Island: Newport Cliff Walk or Providence skyline

## Image generation prompt template

```
A serene, warm photograph of [ICONIC LANDMARK] at golden hour. [DESCRIPTION of scene]. A pregnant woman in silhouette stands in the foreground, hand resting on her belly, looking toward [LANDMARK]. The lighting is stylized, cinematic, with deep oranges, golds, and soft yellows contrasting with dark silhouettes. The background is soft-focus natural landscape. The mood evokes warmth, peace, anticipation, and nurturing. This is an editorial-quality photo for a birth support website hero section. No text, no logos.
```

## OG image composition template
Copy `scripts/og-state-co-composition.html`, replace:
- Eyebrow text: `{STATE} BIRTH DOULA GUIDE`
- Headline: `Doulas, Hospitals & Medicaid\nin {State}`
- Summary: State-specific one-liner
- Right column photo: `og-state-{code}-photo.png` (copy the cropped hero PNG to scripts/)

Render with:
```javascript
node -e "
const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.resolve('scripts/og-state-{code}-composition.html'), { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000);
  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();
  await sharp(screenshot).resize(1200, 630, { kernel: 'lanczos3' }).png().toFile('public/images/og/og-state-{code}.png');
})();
"
```

## Estimated time per state
- Image generation: ~30s
- Download + optimize + crop: ~30s
- OG composition + render: ~30s
- Registry entry: ~10s
- Total: ~2 min per state, ~54 min for all 27

## Batch approach
States can be batched 3-5 at a time using delegate_task for parallel image generation, then processed sequentially for OG rendering and deployment.