const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Render a YouTube channel banner — simple gradient, no text/branding.
 * Usage: node render-yt-banner.cjs
 * Output: public/images/yt-banner.png (2048x1152 PNG)
 *         public/images/yt-banner.webp (2048x1152 WebP)
 */

const COMP_W = 2048;
const COMP_H = 1152;
const WEBP_QUALITY = 90;

const templatePath = path.resolve(__dirname, 'yt-banner-composition.html');
const outputDir = path.resolve(__dirname, '..', 'public', 'images');
const pngPath = path.resolve(outputDir, 'yt-banner.png');
const webpPath = path.resolve(outputDir, 'yt-banner.webp');

(async () => {
  console.log(`Rendering YouTube channel banner (${COMP_W}x${COMP_H})...`);

  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: COMP_W, height: COMP_H });

  await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const screenshot = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: COMP_W, height: COMP_H },
  });

  await browser.close();

  fs.writeFileSync(pngPath, screenshot);
  console.log(`  ✓ PNG  ${pngPath} (${(screenshot.length / 1024 / 1024).toFixed(1)} MB)`);

  await sharp(screenshot)
    .resize(COMP_W, COMP_H, { kernel: 'lanczos3' })
    .webp({ quality: WEBP_QUALITY })
    .toFile(webpPath);
  console.log(`  ✓ WebP ${webpPath}`);

  const stats = fs.statSync(webpPath);
  console.log(`  WebP: ${(stats.size / 1024).toFixed(1)} KB`);
})();