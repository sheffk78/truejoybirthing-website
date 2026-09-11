// ⚠️ DEPRECATED 2026-09-10 — viewport mismatch produces quarter-content OG images on 1200px compositions.
// Use render-og-1x.cjs (1200x630 viewport @2x DPR, downsized 1:1). See failure-library case og-quarter-content-render-2x.
const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const compositionFile = process.argv[2] || 'og-city-dallas-tx-composition.html';
const outputName = process.argv[3] || 'og-city-dallas-tx';

const htmlPath = path.resolve(__dirname, compositionFile);
const outputPath = path.resolve(__dirname, '..', 'public', 'images', `${outputName}.webp`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2400, height: 1260 }, deviceScaleFactor: 2 });

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();

  await sharp(screenshot)
    .resize(1200, 630, { kernel: 'lanczos3' })
    .webp({ quality: 95 })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log('Done! Size:', (stats.size / 1024).toFixed(1), 'KB');

  // ── Render-side self-check (2026-09-11, Hayward OG aftermath P4) ──
  // This script is DEPRECATED: its 2400x1260 viewport produces quarter-content
  // on 1200px compositions. The self-check guarantees that even if it is
  // invoked by mistake, a defective render exits non-zero instead of
  // silently writing a shippable-looking file. Thresholds live in
  // scripts/check-og-content.py (single source of truth).
  try {
    execFileSync('python3',
      [path.resolve(__dirname, 'check-og-content.py'), '--file', outputPath],
      { stdio: ['ignore', 'pipe', 'pipe'] });
    console.log('S11 self-check: PASS (content fills canvas)');
  } catch (e) {
    console.error('S11 SELF-CHECK FAILED — DEPRECATED render produced non-canvas-filling content. Use scripts/render-og-1x.cjs instead.');
    console.error((e.stdout || '').toString().trim());
    process.exit(1);
  }
})();