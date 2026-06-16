const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const compositionFile = process.argv[2] || 'og-city-dallas-tx-composition.html';
const outputName = process.argv[3] || 'og-city-dallas-tx';

const htmlPath = path.resolve(__dirname, compositionFile);
const outputPath = path.resolve(__dirname, '..', 'public', 'images', `${outputName}.webp`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  const screenshot = await page.screenshot({ type: 'png', fullPage: false });
  await browser.close();

  // Write full-size PNG first so sharp gets good data
  const tmpPng = path.resolve(__dirname, `${outputName}-tmp.png`);
  await sharp(screenshot).png().toFile(tmpPng);

  // Re-encode with max quality
  await sharp(tmpPng)
    .resize(1200, 630, { kernel: 'lanczos3', fit: 'fill' })
    .webp({ quality: 100, effort: 6 })
    .toFile(outputPath);

  // Clean up temp
  // fs.unlinkSync(tmpPng);

  const stat = fs.statSync(outputPath);
  console.log(`Done! ${outputPath} (${(stat.size / 1024).toFixed(1)} KB)`);
})();