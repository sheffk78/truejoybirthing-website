const { chromium } = require('/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/video/remotion/node_modules/playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:8765/scripts/og-ambassador-composition.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const out = path.resolve(__dirname, '../public/images/og-ambassador-v2.png');
  await page.screenshot({ path: out, type: 'png' });
  await browser.close();
  console.log(out);
})();
