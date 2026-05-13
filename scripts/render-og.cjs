const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  const htmlPath = path.resolve(__dirname, 'og-homepage-composition.html');
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
  const outputPath = path.resolve(__dirname, '..', 'public', 'images', 'og-homepage.webp');
  await sharp(screenshot)
    .resize(1200, 630, { kernel: 'lanczos3' })
    .webp({ quality: 90 })
    .toFile(outputPath);

  // Also save the 2x PNG for reference
  const pngPath = path.resolve(__dirname, 'og-homepage-2x.png');
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