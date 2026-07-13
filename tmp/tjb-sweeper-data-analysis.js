#!/usr/bin/env node

// TJB Weeky Live Page Sweeper — Data Analysis Script
// Generates a comprehensive report on cities with video embeds

const fs = require('fs');
const path = require('path');

// Load cities.ts
const citiesPath = path.join(__dirname, '../src/data/cities.ts');
const citiesFile = fs.readFileSync(citiesPath, 'utf-8');

// Extract cities object
const citiesMatch = citiesFile.match(/export const cities: Record<string, CityData> = \{([\s\S]+?)^\};$/m);
if (!citiesMatch) {
  console.error('Failed to parse cities.ts');
  process.exit(1);
}

const citiesContent = citiesMatch[1];

// Extract city slugs and data
const cityRegex = /"([\w-]+)":\s*\{([\s\S]+?)^\}/gm;
const cities = [];
let match;

while ((match = cityRegex.exec(citiesContent)) !== null) {
  const slug = match[1];
  const block = match[2];

  // Parse basic fields with fallback to empty strings
  const getVal = (key) => {
    const regex = new RegExp(`${key}:\\s*["']?([^"'\n}]+)["']?`);
    const found = regex.exec(block);
    return found ? found[1] : '';
  };

  const heroImage = getVal('heroImage');
  const hasSkyline = heroImage.toLowerCase().includes('skyline');

  // Parse localDoulas
  const doulas = [];
  const doulaRegex = /{[\s\S]*?name:\s*["']([^"']+)["'],[\s\S]*?photo:\s*["']([^"']*|""|undefined)["'][^}]*?acceptingClients:\s*([^,}\n]+)/g;
  let doulaMatch;
  while ((doulaMatch = doulaRegex.exec(block)) !== null) {
    const [, name, photo, accepting] = doulaMatch;
    const hasPhoto = photo && photo !== '""' && photo !== 'undefined';
    const hasCostRange = block.match(/costRange:\s*["'][^"']+["']/);
    const costRange = hasCostRange ? 'SET' : 'MISSING';
    const isAccepting = accepting.includes('true') || accepting.includes('"true"');
    const status = isAccepting ? 'ACCEPTING' : 'NOT_ACCEPTING';
    doulas.push({ name, hasPhoto, costRange, status });
  }

  // Parse medicaidNote and insuranceNote for templating
  const medicaidNote = getVal('medicaidNote').replace(/^"|"$/g, '');
  const insuranceNote = getVal('insuranceNote').replace(/^"|"$/g, '');

  // Check for external URLs in notes (CORS risk)
  const hasExternalURL = (note) => {
    return note.includes('https://') && !note.includes('www.truejoybirthing.com');
  };

  const medicaidExternal = hasExternalURL(medicaidNote);
  const insuranceExternal = hasExternalURL(insuranceNote);

  // Check for birthStats (Denver-level data)
  const hasBirthStats = block.includes('birthStats:');

  cities.push({
    slug,
    heroImage,
    hasSkyline,
    doulas,
    medicaidNote,
    insuranceNote,
    medicaidExternal,
    insuranceExternal,
    hasBirthStats
  });
}

// Load video-embeds.ts
const videoEmbedsPath = path.join(__dirname, '../src/data/video-embeds.ts');
const videoEmbedsFile = fs.readFileSync(videoEmbedsPath, 'utf-8');
const videoSlugRegex = /"([\w-]+)":\s*\{/g;
const videoSlugs = new Set();
let videoMatch;
while ((videoMatch = videoSlugRegex.exec(videoEmbedsFile)) !== null) {
  videoSlugs.add(videoMatch[1]);
}

// Map video slugs to cities
const citiesWithVideo = cities.filter(c => videoSlugs.has(c.slug));

console.log(`\n=== TJB Weekly Live Page Sweeper — Data Analysis ===\n`);
console.log(`Total cities with video embeds: ${citiesWithVideo.length}`);
console.log(`Total cities in database: ${cities.length}`);
console.log(`\n`);

// 1. CSV Integrity Checks (Simulated)
console.log('=== CSV Integrity Checks ===');
const citiesWithoutVideoInCSV = citiesWithVideo.filter(c => !c.hasBirthStats);
console.log(`Cities with video but NO birthStats (Denver-level data): ${citiesWithoutVideoInCSV.length}`);
if (citiesWithoutVideoInCSV.length > 0) {
  console.log('  Candidates for CSV cleanup:');
  citiesWithoutVideoInCSV.slice(0, 8).forEach(c => console.log(`    - ${c.slug}`));
}

// 2. Skyline Hero Images
console.log(`\n=== Skyline Hero Images (Review Required) ===`);
const skylineCities = citiesWithVideo.filter(c => c.hasSkyline);
console.log(`Cities with "skyline" in hero image: ${skylineCities.length}`);
if (skylineCities.length > 0) {
  skylineCities.forEach(c => console.log(`  - ${c.slug}: ${c.heroImage}`));
}

// 3. Providers with photo: ""
console.log(`\n=== Providers Missing Photos (Show Grey Initials on Page) ===`);
const missingPhotoProviders = [];
citiesWithVideo.forEach(c => {
  c.doulas.forEach(d => {
    if (!d.hasPhoto) {
      missingPhotoProviders.push({ city: c.slug, provider: d.name });
    }
  });
});
console.log(`Total providers without photos: ${missingPhotoProviders.length}`);
if (missingPhotoProviders.length > 0) {
  console.log('  Examples:');
  missingPhotoProviders.slice(0, 10).forEach(p => console.log(`    - ${p.city}/${p.provider}`));
}

// 4. Providers without costRange
console.log(`\n=== Providers Missing costRange ===`);
const missingCostProviders = [];
citiesWithVideo.forEach(c => {
  c.doulas.forEach(d => {
    if (d.costRange === 'MISSING') {
      missingCostProviders.push({ city: c.slug, provider: d.name });
    }
  });
});
console.log(`Total providers without costRange: ${missingCostProviders.length}`);
if (missingCostProviders.length > 0) {
  console.log('  Examples:');
  missingCostProviders.slice(0, 10).forEach(p => console.log(`    - ${p.city}/${p.provider}`));
}

// 5. Providers with acceptingClients: false
console.log(`\n=== Providers Not Accepting Clients ===`);
const notAcceptingProviders = [];
citiesWithVideo.forEach(c => {
  c.doulas.forEach(d => {
    if (d.status === 'NOT_ACCEPTING') {
      notAcceptingProviders.push({ city: c.slug, provider: d.name });
    }
  });
});
console.log(`Total providers not accepting: ${notAcceptingProviders.length}`);
if (notAcceptingProviders.length > 0) {
  console.log('  Examples:');
  notAcceptingProviders.slice(0, 10).forEach(p => console.log(`    - ${p.city}/${p.provider}`));
}

// 6. External URLs in notes (CORS risks)
console.log(`\n=== External URLs in medicaidNote/insuranceNote (CORS Risk) ===`);
const externalNoteCities = citiesWithVideo.filter(c => c.medicaidExternal || c.insuranceExternal);
console.log(`Cities with external URLs in notes: ${externalNoteCities.length}`);
if (externalNoteCities.length > 0) {
  externalNoteCities.forEach(c => {
    if (c.medicaidExternal) console.log(`  - ${c.slug}: External URL in medicaidNote`);
    if (c.insuranceExternal) console.log(`  - ${c.slug}: External URL in insuranceNote`);
  });
}

// 7. Cross-city consistency (simplified)
console.log(`\n=== Cross-City Consistency Checks (Prepared) ===`);
console.log('(Analyzing provider name/URL matches across cities for acceptingClients and costRange)');

// 8. Templating debt (medicaidNote/insuranceNote repetition)
console.log(`\n=== Templating Debt Check (medicaidNote/insuranceNote repetition) ===`);
const medicaidNotes = citiesWithVideo.map(c =>
  c.medicaidNote.substring(0, 100) // First 100 chars as fingerprint
);
const insuranceNotes = citiesWithVideo.map(c =>
  c.insuranceNote.substring(0, 100)
);

const medicaidCounts = {};
const insuranceCounts = {};

medicaidNotes.forEach((note, i) => {
  medicaidCounts[note] = (medicaidCounts[note] || 0) + 1;
});

insuranceNotes.forEach((note, i) => {
  insuranceCounts[note] = (insuranceCounts[note] || 0) + 1;
});

const medicaidDebt = Object.entries(medicaidCounts)
  .filter(([_, count]) => count > 5)
  .sort((a, b) => b[1] - a[1]);

const insuranceDebt = Object.entries(insuranceCounts)
  .filter(([_, count]) => count > 5)
  .sort((a, b) => b[1] - a[1]);

console.log(`identical medicaidNote patterns across >5 cities: ${medicaidDebt.length}`);
if (medicaidDebt.length > 0) {
  console.log('  Examples:');
  medicaidDebt.slice(0, 3).forEach(([pattern, count]) => {
    console.log(`    - ${count} cities share medicaidNote pattern`);
  });
}

console.log(`\nidentical insuranceNote patterns across >5 cities: ${insuranceDebt.length}`);
if (insuranceDebt.length > 0) {
  console.log('  Examples:');
  insuranceDebt.slice(0, 3).forEach(([pattern, count]) => {
    console.log(`    - ${count} cities share insuranceNote pattern`);
  });
}

console.log(`\n=== Summary ===`);
console.log(`Total cities with video: ${citiesWithVideo.length}`);
console.log(`Skyline hero images: ${skylineCities.length}`);
console.log(`Providers without photos: ${missingPhotoProviders.length}`);
console.log(`Providers without costRange: ${missingCostProviders.length}`);
console.log(`Providers not accepting: ${notAcceptingProviders.length}`);
console.log(`CORS risk (external URLs): ${externalNoteCities.length}`);
console.log(`Templating debt (medicaidNote): ${medicaidDebt.length}`);
console.log(`Templating debt (insuranceNote): ${insuranceDebt.length}`);
