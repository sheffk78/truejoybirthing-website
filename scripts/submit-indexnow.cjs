#!/usr/bin/env node
/**
 * IndexNow — Submit all sitemap URLs to Bing/Yandex IndexNow API.
 * Run after every deploy: node scripts/submit-indexnow.js
 * Requires the key file at public/6c5140d8ec9c41b581322973c45c8fc1.txt
 * Docs: https://www.indexnow.org/documentation
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE = 'https://truejoybirthing.com';
const KEY = '6c5140d8ec9c41b581322973c45c8fc1';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

// Parse sitemap-0.xml from dist
const sitemapPath = path.resolve(__dirname, '../dist/sitemap-0.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('sitemap-0.xml not found in dist/. Run npm run build first.');
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, 'utf-8');
const urls = [];
const locRegex = /<loc>([^<]+)<\/loc>/g;
let match;
while ((match = locRegex.exec(xml)) !== null) {
  urls.push(match[1].trim());
}

console.log(`Found ${urls.length} URLs in sitemap-0.xml`);

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