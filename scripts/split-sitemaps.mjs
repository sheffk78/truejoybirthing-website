/**
 * Postbuild: Split the single sitemap-0.xml into named sitemaps
 * and rebuild sitemap-index.xml with <lastmod> on each entry.
 *
 * Groups:
 *   sitemap-pages.xml   — core landing pages, utility pages, etc.
 *   sitemap-blog.xml     — /blog/* posts
 *   sitemap-cities.xml   — /birth-support/* city and state pages
 *
 * Runs after `astro build`. Reads from dist/, writes to dist/.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('./dist');
const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

function readSitemap0() {
  const file = path.join(DIST, 'sitemap-0.xml');
  if (!fs.existsSync(file)) {
    console.warn('  ⚠ sitemap-0.xml not found, skipping split');
    return [];
  }
  const xml = fs.readFileSync(file, 'utf-8');
  const urls = [];
  const re = /<url>([\s\S]*?)<\/url>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[1];
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || '';
    const changefreq = block.match(/<changefreq>([^<]+)<\/changefreq>/)?.[1] || '';
    const priority = block.match(/<priority>([^<]+)<\/priority>/)?.[1] || '';
    if (loc) urls.push({ loc, lastmod, changefreq, priority });
  }
  return urls;
}

function categorize(url) {
  const parsed = new URL(url);
  const p = parsed.pathname;
  if (p.startsWith('/blog/')) return 'blog';
  if (p.startsWith('/birth-support/')) return 'cities';
  return 'pages';
}

function buildSitemapXml(urls) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${SITEMAP_NS}">`,
  ];
  for (const u of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${u.loc}</loc>`);
    if (u.lastmod) lines.push(`    <lastmod>${u.lastmod}</lastmod>`);
    if (u.changefreq) lines.push(`    <changefreq>${u.changefreq}</changefreq>`);
    if (u.priority) lines.push(`    <priority>${u.priority}</priority>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  return lines.join('\n');
}

function buildIndexEntry(loc, lastmod) {
  return [
    '  <sitemap>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '  </sitemap>',
  ].join('\n');
}

// ── Main ──
const allUrls = readSitemap0();
if (allUrls.length === 0) {
  process.exit(0);
}

const groups = { pages: [], blog: [], cities: [] };
// Skeleton pages carry visible "Skeleton entry ... Awaiting provider research"
// placeholder copy (cities.ts culture/heroLocalDetail). Submitting thin
// placeholder pages invites Google quality suppression (Kenneth directive
// Sep 6, 2026). They stay live but are excluded from the sitemap until real
// content lands.
// 2026-09-16: 6 CA cities graduated — Phase 4 wired real content + images
// (commit 6457af55, validator 0/0/0, pages verified live by audit). Per the
// Sep 6 directive these enter the sitemap only when real content lands.
// greenville-sc + cumming-ga graduated 2026-09-16 after missing provider
// photos were sourced and verified (visual-preflight pass, commit [preflight: pass]).
const SKELETON_SLUGS = new Set(['bellevue-wa','cary-nc','cedar-park-tx','concord-nc','costa-mesa-ca','new-braunfels-tx','pearland-tx','san-marcos-tx','victoria-tx']);
let skeletonExcluded = 0;
for (const u of allUrls) {
  const cat = categorize(u.loc);
  const slugMatch = cat === 'cities' ? u.loc.match(/\/birth-support\/([^/]+)\//) : null;
  if (slugMatch && SKELETON_SLUGS.has(slugMatch[1])) {
    skeletonExcluded++;
    continue;
  }
  groups[cat].push(u);
}
if (skeletonExcluded > 0) console.log(`  ⚑ excluded ${skeletonExcluded} skeleton pages from sitemap-cities.xml`);

const now = new Date().toISOString();
const base = 'https://truejoybirthing.com';
const files = [
  { name: 'sitemap-pages.xml', urls: groups.pages },
  { name: 'sitemap-blog.xml', urls: groups.blog },
  { name: 'sitemap-cities.xml', urls: groups.cities },
];

// Write named sitemaps
for (const f of files) {
  if (f.urls.length === 0) continue;
  const xml = buildSitemapXml(f.urls);
  fs.writeFileSync(path.join(DIST, f.name), xml + '\n');
  console.log(`  ✓ ${f.name}: ${f.urls.length} URLs`);
}

// Build and write sitemap-index.xml with lastmod
const indexLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  `<sitemapindex xmlns="${SITEMAP_NS}">`,
];
for (const f of files) {
  if (f.urls.length === 0) continue;
  // Use the most recent lastmod in the group, fallback to now
  const lastmods = f.urls.map(u => u.lastmod).filter(Boolean).sort().reverse();
  const lastmod = lastmods[0] || now;
  indexLines.push(buildIndexEntry(`${base}/${f.name}`, lastmod));
}
indexLines.push('</sitemapindex>');
fs.writeFileSync(path.join(DIST, 'sitemap-index.xml'), indexLines.join('\n') + '\n');
console.log(`  ✓ sitemap-index.xml: ${files.filter(f => f.urls.length > 0).length} entries`);

// Remove old single sitemap
const oldFile = path.join(DIST, 'sitemap-0.xml');
if (fs.existsSync(oldFile)) {
  fs.unlinkSync(oldFile);
  console.log('  ✓ Removed sitemap-0.xml');
}

console.log(`  Total: ${allUrls.length} URLs across ${files.filter(f => f.urls.length > 0).length} sitemaps`);