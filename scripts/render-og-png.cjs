const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Usage: node render-og-png.cjs [composition-file] [output-name]
// Outputs PNG to public/images/og/[output-name].png
const compositionFile = process.argv[2] || 'og-homepage-composition.html';
const outputName = process.argv[3] || 'og-homepage';

const htmlPath = path.resolve(__dirname, compositionFile);
const outputPath = path.resolve(__dirname, '..', 'public', 'images', 'og', `${outputName}.png`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2400, height: 1260 }, deviceScaleFactor: 2 });

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();

  // Downsample from 2x to 1200x630 PNG
  await sharp(screenshot)
    .resize(1200, 630, { kernel: 'lanczos3' })
    .png()
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log('Done! Output:', outputPath);
  console.log('PNG file size:', (stats.size / 1024).toFixed(1), 'KB');
})();