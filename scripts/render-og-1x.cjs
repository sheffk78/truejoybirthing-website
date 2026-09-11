const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const compositionFile = process.argv[2];
const outputName = process.argv[3];
if (!compositionFile || !outputName) {
  console.error('Usage: node render-og-1x.cjs <composition.html> <output-name>');
  process.exit(1);
}
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

  // ── Render-side self-check (2026-09-11, Hayward OG aftermath P4) ──
  // The renderer itself refuses to accept a quarter-content / wrong-dims /
  // low-density output, so a defective render can never silently ship.
  // Single source of truth for thresholds: scripts/check-og-content.py.
  try {
    execFileSync('python3',
      [path.resolve(__dirname, 'check-og-content.py'), '--file', outputPath],
      { stdio: ['ignore', 'pipe', 'pipe'] });
    console.log('S11 self-check: PASS (content fills canvas)');
  } catch (e) {
    console.error('S11 SELF-CHECK FAILED — output does not fill the 1200x630 canvas:');
    console.error((e.stdout || '').toString().trim());
    process.exit(1);
  }
})();