const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Render a YouTube thumbnail for a TJB city video.
 * Usage: node render-yt-thumbnail.cjs [slug] [city] [state]
 *
 * Reads hero image + logo SVG, bakes them into the HTML as data URIs / inline SVG,
 * renders at 1280x720 via Playwright with Google Fonts.
 *
 * Output:
 *   public/images/yt-thumb-{slug}.png  (1280x720 PNG)
 *   public/images/yt-thumb-{slug}.webp (1280x720 WebP)
 */

const COMP_W = 1280;
const COMP_H = 720;
const WEBP_QUALITY = 90;
const FONT_WAIT_MS = 5000;

const slug = process.argv[2];
const city = process.argv[3];
const state = process.argv[4];

if (!slug || !city || !state) {
  console.error('Usage: node render-yt-thumbnail.cjs [slug] [city] [state]');
  console.error('Example: node render-yt-thumbnail.cjs denver-co Denver CO');
  process.exit(1);
}

const templatePath = path.resolve(__dirname, 'yt-thumbnail-composition.html');
const outputDir = path.resolve(__dirname, '..', 'public', 'images');
const pngPath = path.resolve(outputDir, `yt-thumb-${slug}.png`);
const webpPath = path.resolve(outputDir, `yt-thumb-${slug}.webp`);

/**
 * Convert a raster image file to a base64 data URI.
 */
function fileToDataUri(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.webp': 'image/webp', '.png': 'image/png',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  };
  const mimeType = mimeTypes[ext] || 'image/png';
  const buffer = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

/**
 * Read an SVG file and encode it for URL query param injection.
 * The template injects it as raw SVG (not <img>), so CSS class fills work.
 */
function encodeSvgForUrl(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const svgText = fs.readFileSync(filePath, 'utf-8');
  return encodeURIComponent(svgText);
}

(async () => {
  console.log(`Rendering YouTube thumbnail for ${city}, ${state} (${slug})...`);

  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`);
    process.exit(1);
  }

  // Hero image — use the actual city heroImage from cities.ts first.
  // Older completed cities can have legacy filenames like -skyline.webp even
  // when that file is the canonical hero. Do not silently render without it.
  let heroLocalPath = path.resolve(outputDir, `${slug}-birth-doula-hero.webp`);
  const citiesPath = path.resolve(__dirname, '..', 'src', 'data', 'cities.ts');
  if (fs.existsSync(citiesPath)) {
    const citiesText = fs.readFileSync(citiesPath, 'utf-8');
    const slugIdx = citiesText.indexOf(`"${slug}"`);
    if (slugIdx >= 0) {
      const nextIdx = citiesText.indexOf('\n  "', slugIdx + 1);
      const block = citiesText.slice(slugIdx, nextIdx > 0 ? nextIdx : undefined);
      const m = block.match(/heroImage:\s*["']([^"']+)["']/);
      if (m) {
        const fileName = m[1].split('/').pop();
        const candidate = path.resolve(outputDir, fileName);
        if (fs.existsSync(candidate)) heroLocalPath = candidate;
      }
    }
  }
  const heroDataUri = fileToDataUri(heroLocalPath);

  // Brand logo — use the heart icon-mark (not the full wordmark)
  const logoSvgPath = path.resolve(outputDir, 'icon-mark.svg');
  const logoSvgEncoded = encodeSvgForUrl(logoSvgPath);
  const hasLogo = !!logoSvgEncoded;

  // Headline + subtitle
  const headline = `Your Complete<br>${city} Birth Guide`;
  const subtitle = 'Doulas · Hospitals · Costs · Medicaid';

  // Read template, bake in hero image
  let html = fs.readFileSync(templatePath, 'utf-8');
  if (heroDataUri) {
    html = html.replace(
      '<img class="hero-bg" src="" id="heroImage" alt="">',
      `<img class="hero-bg" src="${heroDataUri}" id="heroImage" alt="">`
    );
  }

  // Write modified HTML to temp file
  const tmpHtmlPath = path.resolve(__dirname, `yt-thumb-${slug}.html`);
  fs.writeFileSync(tmpHtmlPath, html);

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: COMP_W, height: COMP_H });

    const params = new URLSearchParams({
      city,
      state,
      headline,
      subtitle,
    });
    if (hasLogo) params.set('logo', logoSvgEncoded);

    await page.goto(`file://${tmpHtmlPath}?${params.toString()}`, {
      waitUntil: 'networkidle',
    });

    // Wait for Google Fonts to render
    await page.waitForTimeout(FONT_WAIT_MS);

    // Verify hero loaded
    const heroLoaded = await page.evaluate(() => {
      const img = document.getElementById('heroImage');
      return img && img.complete && img.naturalWidth > 0;
    });
    if (!heroLoaded) {
      console.warn('  ⚠️ Hero image may not have loaded');
    }

    // Verify fonts rendered
    const fontStatus = await page.evaluate(() => {
      if (document.fonts && document.fonts.ready) {
        return Promise.race([
          document.fonts.ready.then(() => 'fonts ready'),
          new Promise(r => setTimeout(() => r('fonts timeout'), 3000)),
        ]);
      }
      return 'no fonts API';
    });
    console.log(`  Fonts: ${fontStatus}`);

    const screenshot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: COMP_W, height: COMP_H },
    });

    await browser.close();

    fs.writeFileSync(pngPath, screenshot);
    console.log(`  ✓ PNG  ${pngPath}`);

    await sharp(screenshot)
      .resize(COMP_W, COMP_H, { kernel: 'lanczos3' })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);
    console.log(`  ✓ WebP ${webpPath}`);

    const stats = fs.statSync(webpPath);
    console.log(`  WebP: ${(stats.size / 1024).toFixed(1)} KB`);
  } finally {
    try { fs.unlinkSync(tmpHtmlPath); } catch (_) {}
  }
})();