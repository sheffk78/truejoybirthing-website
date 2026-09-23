#!/usr/bin/env node
/**
 * IndexNow — Submit all sitemap URLs to Bing/Yandex IndexNow API.
 * Run after every deploy: node scripts/submit-indexnow.cjs
 * Requires the key file at public/truejoybirthing2026indexnow.txt
 * Docs: https://www.indexnow.org/documentation
 * NOTE: api.indexnow.org eventually bans keys that submit too aggressively
 * (403 on everything). If this script starts 403ing again, generate a NEW
 * alphanumeric key, add public/<newkey>.txt, and update KEY below.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE = 'https://truejoybirthing.com';
// 2026-09-23: original hex key 6c5140d8... was 403-blocked by api.indexnow.org
// (key banned ~2026-09-07, every POST/GET returns 403). The alphanumeric key
// below verifies 200 on both keyLocation and the API — verified live 2026-09-23.
const KEY = 'truejoybirthing2026indexnow';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

// Parse sitemap-cities.xml from dist (sitemap-0.xml was retired when
// split-sitemaps.mjs took over — it deletes sitemap-0.xml post-build).
// sitemap-cities.xml only contains CITY pages; the 336-URL full index lives
// in sitemap-index.xml if a full resubmission is ever needed.
const sitemapPath = path.resolve(__dirname, '../dist/sitemap-cities.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('sitemap-cities.xml not found in dist/. Run npm run build first.');
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, 'utf-8');
const urls = [];
const locRegex = /<loc>([^<]+)<\/loc>/g;
let match;
while ((match = locRegex.exec(xml)) !== null) {
  urls.push(match[1].trim());
}

console.log(`Found ${urls.length} URLs in sitemap-cities.xml`);

// IndexNow API accepts up to 10,000 URLs per request
const payload = JSON.stringify({
  host: 'truejoybirthing.com',
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  },
};

console.log('Submitting to IndexNow API...');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
  if (res.statusCode === 200) {
    console.log('All URLs submitted successfully.');
  } else if (res.statusCode === 202) {
    console.log('Accepted — URLs will be processed asynchronously.');
  } else if (res.statusCode === 422) {
    console.log('Unprocessable entity — check key file is accessible at ' + KEY_LOCATION);
  }
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    if (body) console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(payload);
req.end();