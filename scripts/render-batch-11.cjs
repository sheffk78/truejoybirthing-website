const { chromium } = require('playwright');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const cities = [
  { slug: 'leander-tx', city: 'Leander', state: 'TX' },
  { slug: 'pflugerville-tx', city: 'Pflugerville', state: 'TX' },
  { slug: 'sandy-ut', city: 'Sandy', state: 'UT' },
  { slug: 'leesburg-va', city: 'Leesburg', state: 'VA' },
  { slug: 'joliet-il', city: 'Joliet', state: 'IL' },
  { slug: 'gresham-or', city: 'Gresham', state: 'OR' },
];

const scriptDir = path.resolve(__dirname);
const ogDir = path.resolve(__dirname, '..', 'public', 'images');
const heroDir = path.resolve(__dirname, '..', 'public', 'images', 'heroes');

// Ensure directories exist
if (!fs.existsSync(heroDir)) fs.mkdirSync(heroDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  
  for (const c of cities) {
    console.log(`\n=== Rendering ${c.city}, ${c.state} (${c.slug}) ===`);
    
    // Render OG image (1200x630)
    const ogComp = path.join(scriptDir, `og-city-${c.slug}-composition.html`);
    if (fs.existsSync(ogComp)) {
      const ogPage = await browser.newPage();
      await ogPage.setViewportSize({ width: 1200, height: 630 });
      await ogPage.goto('file://' + ogComp, { waitUntil: 'networkidle' });
      await ogPage.waitForTimeout(3000);
      const ogScreenshot = await ogPage.screenshot({
        type: 'png',
        clip: { x: 0, y: 0, width: 1200, height: 630 }
      });
      await sharp(ogScreenshot)
        .resize(1200, 630, { kernel: 'lanczos3' })
        .webp({ quality: 90 })
        .toFile(path.join(ogDir, `og-city-${c.slug}.webp`));
      console.log(`  OG image: og-city-${c.slug}.webp`);
      await ogPage.close();
    } else {
      console.log(`  OG composition not found: ${ogComp}`);
    }
    
    // Render hero image (1200x800) - branded text card placeholder
    const heroHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1200px;height:800px;background:#FAF8F5;overflow:hidden}.hero-card{display:flex;flex-direction:column;justify-content:center;align-items:center;width:1200px;height:800px;text-align:center;padding:80px}.accent-line{width:48px;height:2px;background:#D8A0C4;border-radius:1px;margin-bottom:32px}.headline{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700;font-size:64px;color:#2A2A2A;letter-spacing:-0.01em;line-height:1.1}.subhead{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:400;font-size:24px;color:#6A6B6C;letter-spacing:0.01em;line-height:1.4;margin-top:24px}.brand{font-family:'Source Sans 3',system-ui,sans-serif;font-weight:600;font-size:16px;color:#B87AA0;margin-top:48px}</style></head><body><div class="hero-card"><div class="accent-line"></div><div class="headline">${c.city}, ${c.state}</div><div class="subhead">Birth Support &amp; Doula Services</div><div class="brand">True Joy Birthing</div></div></body></html>`;
    
    const heroTempPath = path.join(scriptDir, `hero-city-${c.slug}-composition.html`);
    fs.writeFileSync(heroTempPath, heroHtml);
    
    const heroPage = await browser.newPage();
    await heroPage.setViewportSize({ width: 1200, height: 800 });
    await heroPage.goto('file://' + heroTempPath, { waitUntil: 'networkidle' });
    await heroPage.waitForTimeout(3000);
    const heroScreenshot = await heroPage.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
    
    // Save to heroes/ directory AND copy to root images/ directory (Pitfall #56)
    await sharp(heroScreenshot)
      .resize(1200, 800, { kernel: 'lanczos3' })
      .webp({ quality: 90 })
      .toFile(path.join(heroDir, `${c.slug}-birth-doula-skyline.webp`));
    
    // Copy to root images/ as well
    fs.copyFileSync(
      path.join(heroDir, `${c.slug}-birth-doula-skyline.webp`),
      path.join(ogDir, `${c.slug}-birth-doula-skyline.webp`)
    );
    
    console.log(`  Hero image: ${c.slug}-birth-doula-skyline.webp`);
    await heroPage.close();
    
    // Clean up temp hero HTML
    fs.unlinkSync(heroTempPath);
  }
  
  await browser.close();
  console.log('\nAll city images rendered!');
})();