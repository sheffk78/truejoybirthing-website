// IG Sentence Card renderer — Hospital Sentence Bank (M3)
// Per plan §2.1: 1080×1350 (4:5 feed) + 1080×1920 (9:16 story), cream bg,
// rose eyebrow, spot illo, Cormorant Garamond sentence, wordmark footer.
// Text composited in HTML overlay (never baked into AI image).
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public/images/sentence-bank/ig');
fs.mkdirSync(OUT, { recursive: true });

const cards = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/sentence-bank-cards.json'), 'utf8'));

const ILLO = {
  'Induction Pressure': 'illo-01-clock-anchor',
  'Epidural & Pain Relief Discussion': 'illo-06-stethoscope-loop',
  'Unexpected Intervention Recommendation': 'illo-03-door-light',
  'Consent & Paperwork': 'illo-02-pen-form',
  'Communication Breakdowns': 'illo-08-speech-bubble',
  'Scheduling & Pace Pressure': 'illo-07-calendar-circled',
  'Being Alone or Unsupported in the Room': 'illo-05-hands-clasped',
};
const DIVIDER_ILLO = { 9: 'illo-09-heart-outline', 10: 'illo-10-moon-rest' };

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function cardHtml({ eyebrow, illo, sentence, size }) {
  const [w, h] = size === 'story' ? [1080, 1920] : [1080, 1350];
  const sentencePx = size === 'story' ? 56 : 50;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family:'Cormorant Garamond'; src:url('file://${ROOT}/public/fonts/cormorant-garamond-normal-latin.woff2') format('woff2'); font-weight:600 700; }
  @font-face { font-family:'Source Sans 3'; src:url('file://${ROOT}/public/fonts/source-sans-3-latin.woff2') format('woff2'); font-weight:400 600; }
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:${w}px; height:${h}px; background:#FAF8F5; overflow:hidden; }
  .card { width:${w}px; height:${h}px; display:flex; flex-direction:column; align-items:center; padding:${Math.round(h*0.085)}px 90px 60px; }
  .eyebrow { font-family:'Source Sans 3'; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; font-size:26px; color:#B85C7D; }
  .rule { width:56px; height:3px; background:#B85C7D; margin:22px 0 30px; border-radius:2px; }
  .illo { width:${size==='story'?420:360}px; margin-bottom:${size==='story'?60:44}px; }
  .sentence { font-family:'Cormorant Garamond', Georgia, serif; font-weight:700; color:#2A2A2A; font-size:${sentencePx}px; line-height:1.28; text-align:center; max-width:940px; }
  .spacer { flex:1; }
  .footer { font-family:'Source Sans 3'; font-weight:400; font-size:24px; color:#6A6B6C; letter-spacing:0.04em; }
  .footer b { font-weight:600; color:#2A2A2A; }
  </style></head><body><div class="card">
  <div class="eyebrow">${esc(eyebrow)}</div>
  <div class="rule"></div>
  <img class="illo" src="file://${ROOT}/public/images/sentence-bank/${illo}.jpg" />
  <div class="sentence">“${esc(sentence)}”</div>
  <div class="spacer"></div>
  <div class="footer"><b>True Joy Birthing</b> · The Hospital Sentence Bank · truejoybirthing.com</div>
  </div></body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1400 }, deviceScaleFactor: 1 });

const jobs = [];
for (const cat of cards.categories) {
  const illo = ILLO[cat.name];
  if (!illo) { console.error('NO ILLO for', cat.name); continue; }
  for (const card of cat.cards) {
    jobs.push({ name: `ig-${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${card.id}`, eyebrow: cat.name, illo, sentence: card.sentence, size: 'feed' });
    jobs.push({ name: `ig-story-${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${card.id}`, eyebrow: cat.name, illo, sentence: card.sentence, size: 'story' });
  }
}
// Hook + CTA slides for category 1 carousel (built first, Jeff gate)
const cat1 = cards.categories[0];
jobs.push({ name: 'ig-cat1-hook', eyebrow: cat1.name, illo: 'illo-01-clock-anchor', sentence: '3 sentences for when they push an induction.', size: 'feed', hook: true });
jobs.push({ name: 'ig-cat1-cta', eyebrow: cat1.name, illo: 'illo-09-heart-outline', sentence: 'Save this. Grab all 30 free — link in bio.', size: 'feed', cta: true });

let n = 0;
for (const j of jobs) {
  if (j.hook || j.cta) {
    // hook/CTA reuse card layout with larger sentence
    j.sentencePx = 58;
  }
  const html = cardHtml(j);
  const tmp = `/tmp/sb-ig-${j.name}.html`;
  fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp);
  await page.waitForTimeout(120);
  const [w, h] = j.size === 'story' ? [1080, 1920] : [1080, 1350];
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: w, height: h }, type: 'png' });
  await sharp(png).jpeg({ quality: 86 }).toFile(path.join(OUT, `${j.name}.jpg`));
  n++;
  fs.unlinkSync(tmp);
}
await browser.close();
console.log(`rendered ${n} IG slides → ${OUT}`);