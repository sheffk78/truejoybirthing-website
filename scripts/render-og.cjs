const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');

// Usage: node render-og.cjs [composition-file] [output-name]
// Defaults: og-homepage-composition.html → og-homepage.webp
const compositionFile = process.argv[2] || 'og-homepage-composition.html';
const outputName = process.argv[3] || 'og-homepage';

const htmlPath = path.resolve(__dirname, compositionFile);
const outputPath = path.resolve(__dirname, '..', 'public', 'images', `${outputName}.webp`);
const pngPath = path.resolve(__dirname, `${outputName}-2x.png`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });

  // Wait for fonts and image to load
  await page.waitForTimeout(4000);

  // Render at 2x DPR
  const screenshot = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 630 }
  });

  await browser.close();

  // Downsample with sharp
  await sharp(screenshot)
    .resize(1200, 630, { kernel: 'lanczos3' })
    .webp({ quality: 90 })
    .toFile(outputPath);

  // Also save the 2x PNG for reference
  await sharp(screenshot)
    .resize(1200, 630, { kernel: 'lanczos3' })
    .png()
    .toFile(pngPath);

  console.log('Done! Output:', outputPath);

  // Check file size
  const fs = require('fs');
  const stats = fs.statSync(outputPath);
  console.log('WebP file size:', (stats.size / 1024).toFixed(1), 'KB');
})();