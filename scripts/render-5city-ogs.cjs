const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// 5 non-TX cities needing Pattern B OG cards
const cities = [
  {
    slug: 'baltimore-md',
    city: 'Baltimore',
    state: 'MD',
    eyebrow: 'BALTIMORE BIRTH SUPPORT',
    headline: 'Doulas &amp; Birth Plans<br>in Baltimore, MD',
    summary: 'From the Inner Harbor to Federal Hill, Baltimore families deserve birth support that gets it.',
    heroImage: 'baltimore-md-birth-doula-skyline.webp',
    cityName: 'Baltimore',
  },
  {
    slug: 'philadelphia-pa',
    city: 'Philadelphia',
    state: 'PA',
    eyebrow: 'PHILADELPHIA BIRTH SUPPORT',
    headline: 'Doulas &amp; Birth Plans<br>in Philadelphia, PA',
    summary: 'From the Delaware to the Schuylkill, Philadelphia families deserve birth support that gets it.',
    heroImage: 'philadelphia-pa-birth-doula-skyline.webp',
    cityName: 'Philadelphia',
  },
  {
    slug: 'seattle-wa',
    city: 'Seattle',
    state: 'WA',
    eyebrow: 'SEATTLE BIRTH SUPPORT',
    headline: 'Doulas &amp; Birth Plans<br>in Seattle, WA',
    summary: 'From Puget Sound to the Cascades, Seattle families deserve birth support that gets it.',
    heroImage: 'seattle-wa-birth-doula-skyline-1200.webp',
    cityName: 'Seattle',
  },
  {
    slug: 'phoenix-az',
    city: 'Phoenix',
    state: 'AZ',
    eyebrow: 'PHOENIX BIRTH SUPPORT',
    headline: 'Doulas &amp; Birth Plans<br>in Phoenix, AZ',
    summary: 'From Camelback Mountain to South Mountain, Phoenix families deserve birth support that gets it.',
    heroImage: 'phoenix-az-birth-doula-skyline.webp',
    cityName: 'Phoenix',
  },
  {
    slug: 'nashville-tn',
    city: 'Nashville',
    state: 'TN',
    eyebrow: 'NASHVILLE BIRTH SUPPORT',
    headline: 'Doulas &amp; Birth Plans<br>in Nashville, TN',
    summary: 'From the Cumberland to Music Row, Nashville families deserve birth support that gets it.',
    heroImage: 'nashville-tn-birth-doula-skyline.webp',
    cityName: 'Nashville',
  },
];

const COMP_DIM = 1200;
const COMP_HEIGHT = 630;
const QUALITY = 95;

const templatePath = path.resolve(__dirname, 'render-city-og-template.html');
const templateSrc = fs.readFileSync(templatePath, 'utf-8');
const outputDir = path.resolve(__dirname, '..', 'public', 'images');
const htmlDir = __dirname;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: COMP_DIM, height: COMP_HEIGHT });

  for (const c of cities) {
    const subhead = 'Free birth plan template · Hospital info · Real costs · Medicaid coverage';

    // Build the HTML with placeholders replaced
    let html = templateSrc;
    html = html.replace(/\{\{EYEBROW\}\}/g, c.eyebrow);
    html = html.replace(/\{\{HEADLINE\}\}/g, c.headline);
    html = html.replace(/\{\{SUMMARY\}\}/g, c.summary);
    html = html.replace(/\{\{SUBHEAD\}\}/g, subhead);
    // Use absolute file:// path for local hero image
    const heroAbsPath = path.resolve(outputDir, c.heroImage);
    html = html.replace(/\{\{HERO_IMAGE\}\}/g, `file://${heroAbsPath}`);
    html = html.replace(/\{\{CITY_NAME\}\}/g, c.cityName);
    // Logo: use file:// path for local logo
    const logoAbsPath = path.resolve(outputDir, 'logo-mono.svg');
    html = html.replace(/https:\/\/truejoybirthing\.com\/images\/logo-mono\.svg/g, `file://${logoAbsPath}`);

    // Write the per-city HTML file
    const htmlPath = path.resolve(htmlDir, `render-${c.slug}-og.html`);
    fs.writeFileSync(htmlPath, html);

    const outputPath = path.resolve(outputDir, `og-city-${c.slug}.webp`);
    console.log(`Rendering og-city-${c.slug}.webp (${c.city}, ${c.state})...`);

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    // Wait for fonts and images to load
    await page.waitForTimeout(4000);

    // Screenshot at 1200x630
    const screenshot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: COMP_DIM, height: COMP_HEIGHT },
    });

    // Convert to WebP
    await sharp(screenshot)
      .resize(COMP_DIM, COMP_HEIGHT, { withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const stat = fs.statSync(outputPath);
    const kb = (stat.size / 1024).toFixed(1);
    console.log(`  ✓ ${outputPath} (${kb} KB)`);
  }

  await browser.close();
  console.log(`\nDone — ${cities.length} city OG images rendered.`);
})();