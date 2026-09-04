/**
 * Validate city data entries for required fields.
 * Run BEFORE committing any new city — catches missing fields
 * that cause template rendering regressions (emoji fallback,
 * broken images, missing sections).
 *
 * Usage: npx tsx scripts/validate-city-data.ts [slug] [--fix]
 *   - Without slug: validates ALL cities (full audit)
 *   - With slug: validates only that city (targeted check)
 */

import { cities, type CityData } from '../src/data/cities';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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

async function validate(): Promise<{ results: ValidationResult[]; totalErrors: number }> {
  const results: ValidationResult[] = [];
  let totalErrors = 0;

  const args = process.argv.slice(2);
  const targetSlug = args[0] && !args[0].startsWith('--') ? args[0] : null;

  for (const [slug, data] of Object.entries(cities)) {
    // If a target slug was provided, skip all others
    if (targetSlug && slug !== targetSlug) continue;
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

    // FACILITY PARAGRAPH GATE (Sept 4, 2026): the [city].astro template renders
    // h.paragraph / bc.paragraph. Data written to `description:` renders as EMPTY text
    // on the live page (Huntsville failure). Every facility must have a real paragraph
    // >= 200 chars. A wrong-field description or thin text is a hard error.
    const MIN_PARAGRAPH_CHARS = 200;
    const checkFacilityParas = (list: any, label: string) => {
      if (!Array.isArray(list)) return;
      for (const f of list) {
        if (!f || !f.name) continue;
        const name = String(f.name);
        if (/^no freestanding birth centers/i.test(name)) continue; // "no birth centers" info-note entries are exempt
        const p = f.paragraph;
        if (typeof p !== 'string' || p.replace(/<[^>]+>/g, '').trim().length < MIN_PARAGRAPH_CHARS) {
          const len = typeof p === 'string' ? p.replace(/<[^>]+>/g, '').trim().length : 0;
          result.errors.push(
            `${label} "${name}" missing/thin paragraph (rendered text ${len} chars, min ${MIN_PARAGRAPH_CHARS}). ` +
            `Note: the template renders the 'paragraph' field, NOT 'description'.`
          );
        }
      }
    };
    checkFacilityParas(data.hospitalDetails, 'Hospital');
    checkFacilityParas(data.birthCenterDetails, 'Birth center');
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

    // Check OG image exists — use the ACTUAL referenced ogImage path (which may be
    // versioned, e.g. og-city-X-v2.webp), not a hardcoded unversioned name.
    const ogRef = (data as any).ogImage;
    if (ogRef && typeof ogRef === 'string') {
      const ogFname = ogRef.split('/').pop()?.split('?')[0] ?? '';
      const ogPath = `public/images/${ogFname}`;
      if (fs.existsSync(ogPath)) {
        const size = fs.statSync(ogPath).size;
        if (size < 20000) {
          result.warnings.push(`OG image (${ogPath}) is only ${size} bytes — likely a gradient placeholder, not a real photo OG card`);
        }
      } else {
        result.warnings.push(`OG image missing: ${ogPath}`);
      }
    } else {
      result.warnings.push(`OG image missing: no ogImage reference for ${slug}`);
    }

    // 🔴 HARD RULE GATE (R12/R41/M48): Support scene must be 4:3 — never distorted.
    // LIMITATION (be honest): this gate catches images whose final dimensions are NOT
    // true 4:3 (e.g. 1024x900). It CANNOT detect the "stretched TO 4:3" case — if a
    // square source was resized non-uniformly to exactly 1024x768, the pixels ARE 4:3
    // and this gate passes even though content is squashed. The primary defense for
    // that case is the WORKFLOW (generate at target ratio, then CROP, never stretch)
    // + vision_analyze for anatomical distortion. See M48.
    if (data.supportSceneImage) {
      const supPath = `public${data.supportSceneImage}`;
      if (fs.existsSync(supPath)) {
        try {
          const meta = await sharp(supPath).metadata();
          const w = meta.width ?? 0;
          const h = meta.height ?? 0;
          if (w > 0 && h > 0) {
            const ratio = w / h;
            const expected = 4 / 3; // 1.3333...
            if (Math.abs(ratio - expected) > 0.01) {
              result.errors.push(`🔴 DISTORTION: support scene ${data.supportSceneImage} is ${w}x${h} (ratio ${ratio.toFixed(3)}), not 4:3 (1.333). This image was resized with independent width/height and is distorted. Re-generate or CROP to 4:3 — never stretch. (R12/R41/M48)`);
            }
          }
        } catch (e) {
          result.warnings.push(`Could not read support scene ${data.supportSceneImage}: ${e}`);
        }
      } else {
        result.warnings.push(`Support scene image not found: ${data.supportSceneImage}`);
      }
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
async function main() {
  const { results, totalErrors } = await validate();
  printResults(results);

  const totalWarnings = results.reduce((s, r) => s + r.warnings.length, 0);
  const totalImageErrors = results.reduce((s, r) => s + r.imageErrors.length, 0);

  console.log(`\n---\nSummary: ${totalErrors} errors, ${totalImageErrors} image issues, ${totalWarnings} warnings across ${results.length} cities`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}
main();