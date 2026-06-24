const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');

const outputName = process.argv[2] || 'og-faq-v6';
const outputPath = path.resolve(__dirname, '..', 'public', 'images', 'og', `${outputName}.png`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  // Serve via HTTP so SVG and images load properly
  await page.goto('http://localhost:4323/_render-faq.html', { waitUntil: 'networkidle', timeout: 15000 });

  // Wait for Google Fonts and images
  await page.waitForTimeout(5000);

  // Render at 2x
  const screenshot = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 630 }
  });

  await browser.close();

  // Downsample with sharp
  await sharp(screenshot)
    .resize(1200, 630, { kernel: 'lanczos3' })
    .png()
    .toFile(outputPath);

  console.log('Done! Output:', outputPath);

  const fs = require('fs');
  const stats = fs.statSync(outputPath);
  console.log('PNG file size:', (stats.size / 1024).toFixed(1), 'KB');
})();