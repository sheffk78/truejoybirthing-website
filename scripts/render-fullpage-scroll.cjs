const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Usage: node render-fullpage-scroll.cjs <slug> [url]
// Renders a full-page scroll screenshot of the city page provider listing
const slug = process.argv[2] || 'plano-tx';
const url = process.argv[3] || `file://${path.resolve(__dirname, '..', 'dist', 'birth-support', slug, 'index.html')}`;

const outputPath = path.resolve(__dirname, '..', 'public', 'images', `${slug}-fullpage-scroll.png`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Take full page screenshot
  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'png',
  });

  await browser.close();

  const stats = fs.statSync(outputPath);
  console.log(`Done! Output: ${outputPath}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(1)} KB`);

  // Get dimensions
  const sharp = require('sharp');
  const meta = await sharp(outputPath).metadata();
  console.log(`Dimensions: ${meta.width}x${meta.height}`);
})();