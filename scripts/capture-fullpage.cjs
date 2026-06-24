const { chromium } = require('playwright');
const path = require('path');

const slug = process.argv[2];
const htmlPath = path.resolve(`/Users/socializerender/Projects/truejoybirthing-website/dist/birth-support/${slug}/index.html`);
const outputPath = path.resolve(`/Users/socializerender/Projects/truejoybirthing-website/public/images/${slug}-fullpage-scroll.png`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'png',
  });
  
  await browser.close();
  
  const fs = require('fs');
  const stats = fs.statSync(outputPath);
  console.log(`Done! Output: ${outputPath}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(1)} KB`);
  
  const sharp = require('sharp');
  const meta = await sharp(outputPath).metadata();
  console.log(`Dimensions: ${meta.width}x${meta.height}`);
})();
