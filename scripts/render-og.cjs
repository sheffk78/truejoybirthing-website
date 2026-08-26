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
  const fs = require('fs');

  // Pre-render check: fail on unfilled template placeholders
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  const placeholderMatch = htmlContent.match(/\{\{[A-Z_]+\}\}/);
  if (placeholderMatch) {
    console.error(`❌ FATAL: Unfilled template placeholder found: ${placeholderMatch[0]}`);
    console.error(`   The composition HTML still contains template variables.`);
    console.error(`   Create a city-specific composition with placeholders filled before rendering.`);
    console.error(`   See scripts/render-city-og-template.html for the canonical template.`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });

  // Wait for fonts and all images (including SVG logo) to fully load.
  // The old fixed 4s timeout was a race condition: if the SVG logo hadn't
  // finished decoding by the time the screenshot was taken, the logo-area
  // rendered empty (Lexington KY bug, Aug 2026). Now we explicitly wait for
  // every img element to fire its load/error event before screenshotting.
  await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const promises = imgs.map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });
    return Promise.all(promises);
  });

  // Extra safety margin for SVG decode + web font rendering
  await page.waitForTimeout(2000);

  // Pre-screenshot validation: verify the logo-area image actually rendered.
  // If the logo img has naturalWidth 0, it failed to load — abort rather
  // than shipping an OG without branding.
  const logoStatus = await page.evaluate(() => {
    const logoImg = document.querySelector('.logo-area img');
    if (!logoImg) return { present: false };
    return {
      present: true,
      naturalWidth: logoImg.naturalWidth,
      naturalHeight: logoImg.naturalHeight,
      src: logoImg.src,
      complete: logoImg.complete,
    };
  });
  if (logoStatus.present && logoStatus.naturalWidth === 0) {
    console.error('❌ FATAL: Logo image in .logo-area failed to render (naturalWidth=0).');
    console.error('   src:', logoStatus.src);
    console.error('   This produces an OG image without the True Joy Birthing logo.');
    console.error('   Check that the file path exists and the SVG is valid.');
    process.exit(1);
  }

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
  const stats = fs.statSync(outputPath);
  console.log('WebP file size:', (stats.size / 1024).toFixed(1), 'KB');
})();