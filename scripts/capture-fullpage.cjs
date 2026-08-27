const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/capture-fullpage.cjs <slug>');
  process.exit(1);
}

const PROJECT_DIR = '/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website';
const distDir = path.resolve(`${PROJECT_DIR}/dist`);
const outputPath = path.resolve(`${PROJECT_DIR}/public/images/${slug}-fullpage-scroll.png`);

(async () => {
  const htmlPath = path.resolve(`${distDir}/birth-support/${slug}/index.html`);
  if (!fs.existsSync(htmlPath)) {
    console.error(`Build output not found: ${htmlPath}`);
    console.error('Run `npm run build` first.');
    process.exit(1);
  }

  // ── Start a local HTTP server so relative image paths resolve correctly ──
  // file:// protocol doesn't serve relative assets (images, CSS, JS) properly,
  // so provider photos and other lazy-loaded images never load.
  const http = require('http');
  const server = http.createServer((req, res) => {
    let filePath = path.join(distDir, req.url === '/' ? '/index.html' : req.url);
    // Handle directory requests
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found: ' + req.url);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.svg': 'image/svg+xml',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ico': 'image/x-icon',
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise((resolve) => server.listen(8765, resolve));
  console.log(`Local server on http://localhost:8765`);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const url = `http://localhost:8765/birth-support/${slug}/`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // ── FORCE-LOAD ALL LAZY IMAGES ──────────────────────────────────────
  // The city pages use loading="lazy" on provider/hospital images. In a
  // headless browser with no scrolling, these never trigger loading, so the
  // video pipeline's provider scroll scene shows blank/missing profile photos.
  // Fix: remove lazy loading attributes and force all images to load eagerly.
  await page.evaluate(() => {
    // 1. Remove loading="lazy" from all images
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.loading = 'eager';
      img.removeAttribute('loading');
    });

    // 2. Remove loading="lazy" from source elements inside picture tags
    document.querySelectorAll('source[loading="lazy"]').forEach(source => {
      source.removeAttribute('loading');
    });

    // 3. Re-trigger image loading by reassigning src/srcset
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      const srcset = img.getAttribute('srcset');
      if (src) {
        img.removeAttribute('src');
        img.setAttribute('src', src);
      }
      if (srcset) {
        img.removeAttribute('srcset');
        img.setAttribute('srcset', srcset);
      }
    });

    // 4. Also re-trigger picture > source elements
    document.querySelectorAll('picture source').forEach(source => {
      const srcset = source.getAttribute('srcset');
      if (srcset) {
        source.removeAttribute('srcset');
        source.setAttribute('srcset', srcset);
      }
    });
  });

  // Wait for all images to actually load (network idle after force-loading)
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

  // Scroll through the entire page to trigger any remaining lazy observers
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const scrollSteps = Math.ceil(scrollHeight / 500);
  for (let i = 0; i < scrollSteps; i++) {
    await page.evaluate((step) => window.scrollBy(0, step * 500), i);
    await page.waitForTimeout(50);
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Verify all images loaded
  const imgStatus = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const loaded = imgs.filter(img => img.naturalWidth > 0);
    return {
      total: imgs.length,
      loaded: loaded.length,
      unloaded: imgs.filter(img => img.naturalWidth === 0).map(img => img.src?.split('/').pop()).slice(0, 5),
    };
  });
  console.log(`Image load status: ${imgStatus.loaded}/${imgStatus.total} loaded`);
  if (imgStatus.unloaded.length > 0) {
    console.log(`  Unloaded examples: ${imgStatus.unloaded.join(', ')}`);
  }

  // Take full-page screenshot
  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'png',
  });

  await browser.close();
  server.close();

  // Verify output
  const stats = fs.statSync(outputPath);
  console.log(`Done! Output: ${outputPath}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(1)} KB`);

  if (stats.size < 50000) {
    console.error('WARNING: Screenshot is suspiciously small (<50KB) — may be blank or partial');
  }

  // Print dimensions
  try {
    const sharp = require('sharp');
    const meta = await sharp(outputPath).metadata();
    console.log(`Dimensions: ${meta.width}x${meta.height}`);
  } catch (e) {
    console.log('(sharp not available for dimension check)');
  }
})();