// Build the Hospital Sentence Bank PDF (web-optimized + print-ready)
// Per plan §2.2: US Letter, cover + how-to + 7 dividers + 30 cards + CTA + disclaimer
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const ROOT = '/Users/socializerender/Projects/truejoybirthing-website';
const ASSETS = ROOT + '/public/images/sentence-bank/print';
const OUT = ROOT + '/public/downloads';
mkdirSync(OUT, { recursive: true });

const data = JSON.parse(readFileSync(ROOT + '/src/data/sentence-bank-cards.json', 'utf8'));
const { CARD_CSS, DISCLAIMER } = await import(resolve(ROOT, 'src/data/sentence-bank-styles.js'));

// Category page-summary lines (plain language, for divider pages)
const SUMMARIES = {
  1: 'Your provider recommends starting labor before it starts on its own.',
  2: 'The conversation about managing your pain — in every direction.',
  3: 'Something shifts from the plan you walked in with.',
  4: 'The clipboard moment — what you sign and what it means.',
  5: 'When the conversation itself gets tangled.',
  6: 'The clock, the hallway, the "it\u2019s time" that doesn\u2019t feel right.',
  7: 'Making sure the right people are beside you.',
};

let body = `
<section class="sb-cover">
  <img src="file://${ASSETS}/illo-04-newborn-arms.jpg" alt="" />
  <h1>The Hospital Sentence Bank</h1>
  <p class="cred">30 exact sentences for the hard moments · from Shelbi Kohler, certified birth doula · truejoybirthing.com</p>
  <p style="max-width:520px;margin:0 auto;font-size:9.5pt;line-height:1.5;color:#7A5A4A;font-style:italic;">${DISCLAIMER}</p>
</section>
<section class="sb-howto">
  <h2>How to use this</h2>
  <p><b>1 · Save it to your phone.</b> Screenshot the cards you might need — or keep this PDF in your camera roll. The cards are built to be readable at a glance, one sentence each.</p>
  <p style="margin-top:10px;"><b>2 · Find your moment.</b> When something unexpected comes up, flip to the category that matches what\u2019s happening. Each category opener tells you exactly when it applies.</p>
  <p style="margin-top:10px;"><b>3 · Say the sentence — out loud, or hand the card to your person.</b> You don\u2019t need to improvise. Every sentence is polite, firm, and collaborative. It opens the conversation; it never picks a fight.</p>
  <p style="margin-top:10px;"><b>4 · Then ask "what happens next?"</b> Every card includes it — the questions that keep you informed as things move.</p>
  <p style="margin-top:16px;font-style:italic;">You\u2019ve got this. — Shelbi</p>
</section>`;

for (const cat of data.categories) {
  body += `
<section class="sb-divider">
  <img src="file://${ASSETS}/${cat.illo_file}.png" alt="" />
  <h2>${cat.num} · ${cat.name}</h2>
  <p>${cat.cards.length} sentences for this moment.</p>
</section>`;
  for (const card of cat.cards) {
    body += `
<section class="sb-card">
  <p class="sb-card__cat">${cat.name}</p>
  <img class="sb-card__illo" src="file://${ASSETS}/${cat.illo_file}.png" alt="" />
  <p class="sb-card__sentence">\u201C${card.sentence}\u201D</p>
  <div class="sb-card__fields">
    <p class="sb-card__field"><b>When it comes up:</b> ${card.when}</p>
    <p class="sb-card__field"><b>Why it works:</b> ${card.why}</p>
    <p class="sb-card__field"><b>What happens next:</b> ${card.next}</p>
  </div>
  <p class="sb-card__disclaimer">${DISCLAIMER}</p>
  <p class="sb-card__id">CARD ${card.id} · truejoybirthing.com</p>
</section>`;
  }
}

body += `
<section class="sb-cta">
  <h2 style="font-size:19pt;color:#5C3A2E;font-weight:700;margin-bottom:12px;">These sentences work best inside a real plan.</h2>
  <p style="font-size:11.5pt;color:#7A5A4A;max-width:440px;margin:0 auto 22px;">The Joyful Birth Plan is our free, fillable birth plan — it shows you where each sentence fits, before you ever walk through the doors.</p>
  <span class="btn">Download free birth plan \u2192 truejoybirthing.com</span>
  <p style="margin-top:30px;font-size:10pt;color:#7A5A4A;">Go deeper: Birth Plan Confidence Session — practice these 1:1 with Shelbi \u2192 truejoybirthing.com</p>
</section>
<section style="text-align:center;padding:24px 30px;">
  <p style="font-size:7.8pt;color:#7A5A4A;font-style:italic;line-height:1.5;">${DISCLAIMER}</p>
</section>`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@page { size: letter; margin: 16mm 14mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Georgia, 'Times New Roman', serif; }
${CARD_CSS}
section.sb-card { break-before: page; margin-bottom: 4px; } section.sb-cover, section.sb-divider, section.sb-howto, section.sb-cta { break-inside: avoid; }
</style></head><body>${body}</body></html>`;

const tmpHtml = '/tmp/sentence-bank-pdf.html';
writeFileSync(tmpHtml, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + tmpHtml, { waitUntil: 'networkidle' });
await page.pdf({ path: OUT + '/hospital-sentence-bank.pdf', format: 'Letter', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
await browser.close();
console.log('PDF built:', OUT + '/hospital-sentence-bank.pdf');