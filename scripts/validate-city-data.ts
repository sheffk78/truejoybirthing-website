/**
 * Validate city data entries for required fields.
 * Run BEFORE committing any new city — catches missing fields
 * that cause template rendering regressions (emoji fallback,
 * broken images, missing sections).
 *
 * Usage: npx tsx scripts/validate-city-data.ts [--fix]
 */

import { cities, type CityData } from '../src/data/cities';
import fs from 'fs';
import path from 'path';

interface ValidationResult {
  city: string;
  slug: string;
  missingFields: string[];
  warnings: string[];
  imageErrors: string[];
  errors: string[];
}

const REQUIRED_FIELDS: (keyof CityData)[] = [
  'city',
  'state',
  'slug',
  'costLow',
  'costHigh',
  'culture',
  'heroLocalDetail',
  'hospitalDetails',
  'faqs',
  'nearbyCities',
];

const CRITICAL_OPTIONAL_FIELDS: { field: keyof CityData; label: string; note: string }[] = [
  { field: 'enableBlogResources', label: 'enableBlogResources', note: 'Without this, Related Resources shows emoji fallback instead of hero-image cards' },
  { field: 'publishedDate', label: 'publishedDate', note: 'Missing from sitemap lastmod without this' },
];

const CHECK_IMAGE_FIELDS: { field: keyof CityData; pattern: (slug: string) => string }[] = [
  { field: 'heroImage' as any, pattern: (slug) => `${slug}-birth-doula-skyline.webp` },
];

const HEROES_DIR = 'public/images/heroes';

function validate(): { results: ValidationResult[]; totalErrors: number } {
  const results: ValidationResult[] = [];
  let totalErrors = 0;

  for (const [slug, data] of Object.entries(cities)) {
    const result: ValidationResult = {
      city: data.city || slug,
      slug,
      missingFields: [],
      warnings: [],
      imageErrors: [],
      errors: [],
    };

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      const val = data[field as keyof typeof data];
      if (val === undefined || val === null) {
        result.missingFields.push(String(field));
        result.errors.push(`Missing required field: ${String(field)}`);
      }
    }

    // Check arrays aren't empty when they should have data
    if (data.hospitalDetails && data.hospitalDetails.length === 0) {
      result.warnings.push('hospitalDetails is empty — no hospitals listed');
    }
    if (data.faqs && data.faqs.length < 3) {
      result.warnings.push(`Only ${data.faqs?.length} FAQs — recommend at least 4`);
    }

    // Check critical optional fields
    for (const { field, label, note } of CRITICAL_OPTIONAL_FIELDS) {
      if (!(field in data) || data[field] === undefined) {
        result.missingFields.push(label);
        result.errors.push(`Missing ${label}: ${note}`);
      }
    }

    // Check heroImages copy exists in heroes/ dir
    const expectedHero = `${slug}-birth-doula-skyline.webp`;
    const heroPath = path.join(HEROES_DIR, expectedHero);
    if (!fs.existsSync(heroPath)) {
      result.imageErrors.push(`Missing hero copy at ${HEROES_DIR}/${expectedHero}`);
    }

    // Check OG image exists
    const ogPath = `public/images/og-city-${slug}.webp`;
    if (fs.existsSync(ogPath)) {
      const size = fs.statSync(ogPath).size;
      if (size < 30000) {
        result.warnings.push(`OG image (${ogPath}) is only ${size} bytes — likely a gradient placeholder, not a real photo OG card`);
      }
    } else {
      result.warnings.push(`OG image missing: ${ogPath}`);
    }

    totalErrors += result.errors.length;
    results.push(result);
  }

  return { results, totalErrors };
}

function printResults(results: ValidationResult[]) {
  let hasIssues = false;

  for (const r of results) {
    if (r.errors.length > 0 || r.warnings.length > 0 || r.imageErrors.length > 0) {
      hasIssues = true;
      console.log(`\n❌ ${r.city} (${r.slug}):`);
      
      for (const err of r.errors) {
        console.log(`   ✗ ${err}`);
      }
      for (const imgErr of r.imageErrors) {
        console.log(`   🖼 ${imgErr}`);
      }
      for (const warn of r.warnings) {
        console.log(`   ⚠ ${warn}`);
      }
    }
  }

  if (!hasIssues) {
    console.log('✅ All city entries pass validation');
  }
}

// Run
const { results, totalErrors } = validate();
printResults(results);

const totalWarnings = results.reduce((s, r) => s + r.warnings.length, 0);
const totalImageErrors = results.reduce((s, r) => s + r.imageErrors.length, 0);

console.log(`\n---\nSummary: ${totalErrors} errors, ${totalImageErrors} image issues, ${totalWarnings} warnings across ${results.length} cities`);

if (totalErrors > 0) {
  process.exit(1);
}