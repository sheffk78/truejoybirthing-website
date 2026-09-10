const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const compositionFile = process.argv[2];
const outputName = process.argv[3];
const htmlPath = path.resolve(__dirname, compositionFile);
const outputPath = path.resolve(__dirname, '..', 'public', 'images', `${outputName}.webp`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);
  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();
  await sharp(screenshot).resize(1200, 630, { kernel: 'lanczos3' }).webp({ quality: 95 }).toFile(outputPath);
  const stats = fs.statSync(outputPath);
  console.log('Done! Size:', (stats.size / 1024).toFixed(1), 'KB');
})();