const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Targeted OG image renderer for new cities only.
// Usage: node scripts/render-batch-ogs.cjs
// Output: public/images/og-city-{slug}.webp

const COMP_DIM = 1200;
const COMP_HEIGHT = 630;
const QUALITY = 90;

// New cities to render (Batch 9)
const cities = [
  { slug: 'bridgeport-ct', city: 'Bridgeport', state: 'CT' },
  { slug: 'naperville-il', city: 'Naperville', state: 'IL' },
  { slug: 'ann-arbor-mi', city: 'Ann Arbor', state: 'MI' },
  { slug: 'rochester-mn', city: 'Rochester', state: 'MN' },
  { slug: 'paterson-nj', city: 'Paterson', state: 'NJ' },
  { slug: 'erie-pa', city: 'Erie', state: 'PA' },
];

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

    console.log(`Rendering og-city-${slug}.webp (${city}, ${state})...`);

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);

    const screenshot = await page.screenshot({ type: 'png', fullPage: false });
    
    await sharp(screenshot)
      .resize(COMP_DIM, COMP_HEIGHT, { withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    console.log(`  → Wrote ${outputPath}`);
  }

  await browser.close();
  console.log(`Done! Rendered ${cities.length} OG images.`);
})();