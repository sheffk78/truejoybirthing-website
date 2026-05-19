const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Reads city slugs from cities.ts and renders an OG image for each.
// Usage: node render-city-ogs.cjs
// Output: public/images/og-city-{slug}.webp

const COMP_DIM = 1200;
const COMP_HEIGHT = 630;
const QUALITY = 90;

// Extract city slugs + names from cities.ts by simple regex (no TS parser needed)
const citiesPath = path.resolve(__dirname, '..', 'src', 'data', 'cities.ts');
const citiesSrc = fs.readFileSync(citiesPath, 'utf-8');

// Match pattern: "city-slug": { city: "CityName", state: "TX", ...
// Handles multi-word slugs like san-antonio-tx, college-station-tx
const cityRegex = /"([a-z]+(?:-[a-z]+)*-tx)":\s*\{\s*city:\s*"([^"]+)",\s*state:\s*"([^"]+)"/g;
const cities = [];
let match;
while ((match = cityRegex.exec(citiesSrc)) !== null) {
  cities.push({ slug: match[1], city: match[2], state: match[3] });
}

console.log(`Found ${cities.length} cities to render OG images for.`);

const compositionFile = path.resolve(__dirname, 'og-city-composition.html');
const outputDir = path.resolve(__dirname, '..', 'public', 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: COMP_DIM, height: COMP_HEIGHT });

  for (const { slug, city, state } of cities) {
    const url = `file://${compositionFile}?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`;
    const outputPath = path.resolve(outputDir, `og-city-${slug}.webp`);
    const pngPath = path.resolve(__dirname, `og-city-${slug}-2x.png`);

    console.log(`Rendering og-city-${slug}.webp (${city}, ${state})...`);

    await page.goto(url, { waitUntil: 'networkidle' });
    // Wait for fonts and JS to execute
    await page.waitForTimeout(4000);

    // Render at 2x DPR
    const screenshot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: COMP_DIM, height: COMP_HEIGHT }
    });

    // Downsample with sharp to 1200x630 WebP
    await sharp(screenshot)
      .resize(COMP_DIM, COMP_HEIGHT, { withoutEnlargment: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    // Optionally save the 2x PNG for reference (comment out for production)
    // fs.writeFileSync(pngPath, screenshot);

    console.log(`  ✓ ${outputPath}`);
  }

  await browser.close();
  console.log(`\nDone — ${cities.length} city OG images rendered.`);
})();