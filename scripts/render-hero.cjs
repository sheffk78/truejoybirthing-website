const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');

// Usage: node render-hero.cjs [composition-file] [output-name]
// Renders 1200x800 hero images
const compositionFile = process.argv[2] || 'hero-city-austin-tx-composition.html';
const outputName = process.argv[3] || 'hero-city-austin-tx';

const htmlPath = path.resolve(__dirname, compositionFile);
const outputPath = path.resolve(__dirname, '..', 'public', 'images', `${outputName}.webp`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  const screenshot = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 800 }
  });

  await browser.close();

  await sharp(screenshot)
    .resize(1200, 800, { kernel: 'lanczos3' })
    .webp({ quality: 90 })
    .toFile(outputPath);

  console.log('Done! Output:', outputPath);
  const fs = require('fs');
  const stats = fs.statSync(outputPath);
  console.log('WebP file size:', (stats.size / 1024).toFixed(1), 'KB');
})();
