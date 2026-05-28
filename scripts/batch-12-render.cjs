const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const cities = [
  { slug: 'wilmington-nc', city: 'Wilmington', state: 'NC', stateFull: 'North Carolina' },
  { slug: 'allentown-pa', city: 'Allentown', state: 'PA', stateFull: 'Pennsylvania' },
  { slug: 'clearwater-fl', city: 'Clearwater', state: 'FL', stateFull: 'Florida' },
  { slug: 'overland-park-ks', city: 'Overland Park', state: 'KS', stateFull: 'Kansas' },
  { slug: 'stamford-ct', city: 'Stamford', state: 'CT', stateFull: 'Connecticut' },
  { slug: 'cary-nc', city: 'Cary', state: 'NC', stateFull: 'North Carolina' },
];

function makeOgHtml(city) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1200px;height:630px;background:#FAF8F5;overflow:hidden}.og-card{display:flex;flex-direction:row;width:1200px;height:630px}.left-column{width:660px;display:flex;flex-direction:column;justify-content:center;padding:60px 72px}.right-column{width:540px;background:linear-gradient(135deg,#E6BBD8 0%,#8E8CB5 50%,#A8B5A0 100%)}.accent-line{width:36px;height:2px;background:#D8A0C4;border-radius:1px;margin-bottom:24px}.eyebrow{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:14px;color:#B87AA0;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px}.headline{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;font-size:52px;color:#2A2A2A;letter-spacing:-0.01em;line-height:1.1}.subhead{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:400;font-size:20px;color:#6A6B6C;letter-spacing:0.01em;line-height:1.4;margin-top:18px;max-width:520px}.brand{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:14px;color:#B87AA0;margin-top:auto;padding-top:24px}</style></head><body><div class="og-card"><div class="left-column"><div class="accent-line"></div><div class="eyebrow">${city.city.toUpperCase()} BIRTH SUPPORT</div><div class="headline">Doulas &amp; Birth Plans in ${city.city}, ${city.state}</div><div class="subhead">Free birth plan template · Hospital info · Real costs · Medicaid coverage</div><div class="brand">True Joy Birthing</div></div><div class="right-column"></div></div></body></html>`;
}

function makeHeroHtml(city) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1200px;height:800px;background:#FAF8F5;overflow:hidden}.hero-card{display:flex;flex-direction:column;align-items:center;justify-content:center;width:1200px;height:800px;text-align:center}.accent-line{width:36px;height:2px;background:#D8A0C4;border-radius:1px;margin-bottom:24px}.eyebrow{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:16px;color:#B87AA0;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px}.headline{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;font-size:64px;color:#2A2A2A;letter-spacing:-0.01em;line-height:1.1}.subhead{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:400;font-size:22px;color:#6A6B6C;letter-spacing:0.01em;line-height:1.4;margin-top:24px;max-width:800px}.brand{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:14px;color:#B87AA0;margin-top:auto;padding-top:24px}</style></head><body><div class="hero-card"><div class="accent-line"></div><div class="eyebrow">${city.city.toUpperCase()}, ${city.stateFull.toUpperCase()}</div><div class="headline">Birth Support in ${city.city}</div><div class="subhead">Free birth plan template · Hospital info · Real costs · Medicaid coverage</div><div class="brand">True Joy Birthing</div></div></body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  for (const city of cities) {
    console.log(`Rendering OG image for ${city.slug}...`);
    
    // OG image (1200x630)
    const ogHtml = makeOgHtml(city);
    const ogHtmlPath = path.resolve(__dirname, `og-city-${city.slug}-composition.html`);
    fs.writeFileSync(ogHtmlPath, ogHtml);
    
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.goto('file://' + ogHtmlPath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const ogScreenshot = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
    
    const ogOutputPath = path.resolve(__dirname, '..', 'public', 'images', `og-city-${city.slug}.webp`);
    await sharp(ogScreenshot)
      .resize(1200, 630, { kernel: 'lanczos3' })
      .webp({ quality: 90 })
      .toFile(ogOutputPath);
    console.log(`  OG: ${ogOutputPath}`);
    
    // Hero image (1200x800)
    console.log(`Rendering hero image for ${city.slug}...`);
    const heroHtml = makeHeroHtml(city);
    const heroHtmlPath = path.resolve(__dirname, `hero-city-${city.slug}-composition.html`);
    fs.writeFileSync(heroHtmlPath, heroHtml);
    
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('file://' + heroHtmlPath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const heroScreenshot = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 800 } });
    
    const heroOutputPath = path.resolve(__dirname, '..', 'public', 'images', 'heroes', `${city.slug}-birth-doula-skyline.webp`);
    await sharp(heroScreenshot)
      .resize(1200, 800, { kernel: 'lanczos3' })
      .webp({ quality: 90 })
      .toFile(heroOutputPath);
    console.log(`  Hero: ${heroOutputPath}`);
    
    // Copy to root images dir (dual-path requirement per pitfall #56)
    const heroRootPath = path.resolve(__dirname, '..', 'public', 'images', `${city.slug}-birth-doula-skyline.webp`);
    fs.copyFileSync(heroOutputPath, heroRootPath);
    console.log(`  Hero root: ${heroRootPath}`);
  }
  
  await browser.close();
  console.log('All 6 cities rendered successfully!');
})();