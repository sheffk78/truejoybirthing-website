#!/usr/bin/env tsx
/**
 * G7: Upgrade Completeness Check — Content Depth Gate
 *
 * Run BEFORE deploying an upgraded city page. Prevents the pattern
 * where all 6 structural gates pass but the page is half-baked.
 *
 * Usage: npx tsx scripts/check-upgrade-completeness.ts {slug}
 * 
 * Exit 0 = pass (deploy allowed), Exit 1 = fail (fix first)
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const slug = process.argv[2];
if (!slug) { console.error('Usage: npx tsx scripts/check-upgrade-completeness.ts {slug}'); process.exit(1); }

const src = readFileSync(resolve(__dirname, '..', 'src', 'data', 'cities.ts'), 'utf-8');

// Find city block by scanning for the slug key, then extracting until
// the next top-level key (matched by a line starting with 2 spaces + quote)
const slugMarker = `"${slug}": {`;
const idx = src.indexOf(slugMarker);
if (idx === -1) { console.error(`City ${slug} not found`); process.exit(1); }

// Start from the opening brace
const openBrace = idx + slugMarker.length - 1; // position of {
let depth = 0;
let endIdx = -1;
for (let i = openBrace; i < src.length; i++) {
  if (src[i] === '{') depth++;
  else if (src[i] === '}') {
    depth--;
    if (depth === 0) { endIdx = i + 1; break; }
  }
}
if (endIdx === -1) { console.error(`Could not parse block for ${slug}`); process.exit(1); }

const cityBlock = src.slice(openBrace, endIdx);

// Helper: count a regex in the block
function countInBlock(re: RegExp): number {
  return (cityBlock.match(re) || []).length;
}

// Helper: check if pattern exists in block
function inBlock(re: RegExp): boolean {
  return re.test(cityBlock);
}

const failures: string[] = [];
const warnings: string[] = [];
const passes: string[] = [];

function check(label: string, condition: boolean, failMsg: string) {
  if (condition) passes.push(`✅ ${label}`);
  else failures.push(`❌ ${failMsg}`);
}

function warn(label: string, condition: boolean, msg: string) {
  if (condition) passes.push(`✅ ${label}`);
  else warnings.push(`⚠️  ${msg}`);
}

// --- FIELD PRESENCE CHECKS ---
check('heroImage field', inBlock(/heroImage:/m), 'Missing heroImage — page uses shared/default hero');
check('enableBlogResources', inBlock(/enableBlogResources:\s*true/m), 'Missing enableBlogResources: true — emoji fallback');
check('ogImage field', inBlock(/ogImage:/m), 'Missing ogImage — social previews broken');
check('publishedDate', inBlock(/publishedDate:/m), 'Missing publishedDate — no sitemap lastmod');
check('midwifeInfo', inBlock(/midwifeInfo:/m), 'Missing midwifeInfo — no midwife licensing section');
check('medicaidNote', inBlock(/medicaidNote:\s*"(?:Yes|No)\s*\u2014/m), 'medicaidNote must start with "Yes —" or "No —"');
check('FAQs present', inBlock(/faqs:\s*\[/m), 'Missing faqs');
check('nearbyCities present', inBlock(/nearbyCities:/m), 'Missing nearbyCities');
check('lat/lng present', inBlock(/lat:\s*[\d.\-]+/m) && inBlock(/lng:\s*[\d.\-]+/m), 'Missing lat/lng');

// --- HOSPITAL DEPTH ---
const hospitalCount = countInBlock(/^\s+name:\s*"/m);
if (hospitalCount > 0) {
  const hasNICU = countInBlock(/nicuLevel:/);
  const hasAddr = countInBlock(/address:/);
  const hasUrl = countInBlock(/^(\s+)url:/m);
  const hasThumb = countInBlock(/thumbnail:/);

  warn(`Hospitals NICU fields: ${hasNICU}/${hospitalCount}`, hasNICU >= hospitalCount,
    `Only ${hasNICU}/${hospitalCount} hospitals have nicuLevel`);
  warn(`Hospitals addresses: ${hasAddr}/${hospitalCount}`, hasAddr >= hospitalCount,
    `Only ${hasAddr}/${hospitalCount} hospitals have addresses`);
  warn(`Hospitals URLs: ${hasUrl}/${hospitalCount}`, hasUrl >= hospitalCount,
    `Only ${hasUrl}/${hospitalCount} hospitals have URLs`);
  warn(`Hospitals thumbnails: ${hasThumb}/${hospitalCount}`, hasThumb >= hospitalCount,
    `Only ${hasThumb}/${hospitalCount} hospitals have thumbnails`);

  const totalEnrich = hasNICU + hasAddr + hasUrl;
  check(`Hospital depth: ${totalEnrich}/${hospitalCount * 3}`,
    totalEnrich >= hospitalCount * 2,
    `Hospitals are bare-minimum (${totalEnrich} enrichment fields across ${hospitalCount} hospitals). Need at least ${hospitalCount * 2}`);
} else {
  failures.push('❌ hospitalDetails is empty');
}

// --- DOULA DEPTH ---
const doulaCount = countInBlock(/^\s+name:\s*"/m); // from localDoulas section
// We need to count only doulas, not hospitals. Estimate by checking unique count
// of entries inside the localDoulas array
const doulasSection = cityBlock.match(/localDoulas:\s*\[([\s\S]*?)\]/m);
const actualDoulaCount = doulasSection ? (doulasSection[1].match(/^\s+\{/gm) || []).length : 0;

check(`Doula listings: ${actualDoulaCount}`, actualDoulaCount >= 3,
  `Only ${actualDoulaCount} doulas listed — Denver has 4+`);

if (actualDoulaCount > 0 && doulasSection) {
  const ds = doulasSection[1];
  const s = (ds.match(/services:/g) || []).length;
  const c = (ds.match(/costRange:/g) || []).length;
  const p = (ds.match(/photo:/g) || []).length;
  
  warn(`Doulas services: ${s}/${actualDoulaCount}`, s >= actualDoulaCount,
    `Only ${s}/${actualDoulaCount} doulas have services`);
  warn(`Doulas costRange: ${c}/${actualDoulaCount}`, c >= Math.ceil(actualDoulaCount / 2),
    `Only ${c}/${actualDoulaCount} doulas have costRange`);
  warn(`Doulas photos: ${p}/${actualDoulaCount}`, p >= Math.ceil(actualDoulaCount / 2),
    `Only ${p}/${actualDoulaCount} doulas have photos — monogram fallback`);
}

// --- REPORT ---
console.log(`\n═══════════════════════════════════════`);
console.log(`  G7: Upgrade Completeness Check`);
console.log(`  Target: ${slug}`);
console.log(`  ${new Date().toISOString()}`);
console.log(`═══════════════════════════════════════\n`);

if (passes.length > 0) {
  console.log(`── PASSES (${passes.length}) ──`);
  passes.forEach(p => console.log(`  ${p}`));
}

if (warnings.length > 0) {
  console.log(`\n── WARNINGS (${warnings.length}) ──`);
  warnings.forEach(w => console.log(`  ${w}`));
}

if (failures.length > 0) {
  console.log(`\n── FAILURES (${failures.length}) ──`);
  failures.forEach(f => console.log(`  ${f}`));
}

console.log(`\n── SUMMARY ──`);
console.log(`  ${passes.length} passed, ${warnings.length} warnings, ${failures.length} failures`);

if (failures.length > 0) {
  console.log(`\n❌ G7 FAILED — deploy blocked`);
  process.exit(1);
} else if (warnings.length > 0) {
  console.log(`\n⚠️  G7 PASSED with ${warnings.length} warnings (fix when convenient)`);
  process.exit(0);
} else {
  console.log(`\n✅ G7 PASSED — full depth verified`);
  process.exit(0);
}