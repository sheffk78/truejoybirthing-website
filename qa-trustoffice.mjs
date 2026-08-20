import { chromium } from '/opt/homebrew/lib/node_modules/@playwright/test/node_modules/playwright/index.mjs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const events = [];
page.on('console', m => { if (m.type() === 'error') events.push({type:'console', text:m.text()}); });
page.on('response', r => { if (r.status() >= 400) events.push({type:'http', status:r.status(), url:r.url()}); });
await page.goto('https://app.trustoffice.app', { waitUntil: 'networkidle', timeout: 60000 });
console.log('URL', page.url());
console.log('TITLE', await page.title());
console.log('TEXT', (await page.locator('body').innerText()).slice(0,5000));
console.log('INPUTS', await page.locator('input').evaluateAll(xs => xs.map(x => ({type:x.type,name:x.name,placeholder:x.placeholder}))));
console.log('LINKS', await page.locator('a').evaluateAll(xs => xs.map(x => ({text:x.innerText.trim(),href:x.href})).filter(x=>x.text||x.href)));
console.log('EVENTS', events);
await page.screenshot({path:'/tmp/trustoffice-login.png', fullPage:true});
await browser.close();
