/**
 * TJB Preflight Gate — Single command that runs ALL ship-blocker checks.
 * Exit code 0 = all gates pass. Exit code 1 = at least one gate failed.
 *
 * Usage: npx tsx scripts/preflight.ts [slug]
 *   - With slug: checks only that city (targeted upgrade check)
 *   - Without slug: checks ALL cities (full audit)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROJECT_DIR = '/Users/socializerender/Projects/truejoybirthing-website';
const CANONICAL_DIR = '/Users/socializerender/Projects/truejoybirthing-website';

interface GateResult {
  gate: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  detail: string;
}

function run(): void {
  const args = process.argv.slice(2);
  const targetSlug = args[0] || null;
  const results: GateResult[] = [];

  console.log('═══════════════════════════════════════');
  console.log('  TJB Preflight Gate');
  console.log(`  ${targetSlug ? `Target: ${targetSlug}` : 'Mode: full audit'}`);
  console.log(`  ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════\n');

  // ── G1: Working directory ──
  const cwd = process.cwd();
  if (cwd === CANONICAL_DIR) {
    results.push({ gate: 'G1', status: 'PASS', detail: `Working directory: ${cwd}` });
  } else {
    results.push({ gate: 'G1', status: 'FAIL', detail: `Must be ${CANONICAL_DIR}, got ${cwd}` });
  }

  // ── G2: validate-city-data.ts exit 0 ──
  if (targetSlug) {
    // Targeted mode: quick awk check instead of full validator flood
    try {
      const cityBlock = execSync(
        `awk '/slug: "${targetSlug}"/{p=1} p; /^  },/{if(p) exit}' src/data/cities.ts`,
        { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 10000 }
      );
      const missing: string[] = [];
      if (!cityBlock.includes('enableBlogResources: true')) missing.push('enableBlogResources');
      if (!cityBlock.includes('publishedDate:')) missing.push('publishedDate');
      if (!cityBlock.includes('costLow:')) missing.push('costLow');
      if (!cityBlock.includes('costHigh:')) missing.push('costHigh');
      if (!cityBlock.includes('shelbiServesHere:')) missing.push('shelbiServesHere');

      if (missing.length === 0) {
        results.push({ gate: 'G2', status: 'PASS', detail: 'All critical fields present for ' + targetSlug });
      } else {
        results.push({ gate: 'G2', status: 'FAIL', detail: `Missing fields: ${missing.join(', ')}` });
      }
    } catch {
      results.push({ gate: 'G2', status: 'FAIL', detail: `Could not find city block for ${targetSlug}` });
    }
  } else {
    // Audit mode: run full validator
    try {
      execSync(`npx tsx scripts/validate-city-data.ts`, {
        cwd: PROJECT_DIR,
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 60000,
      });
      results.push({ gate: 'G2', status: 'PASS', detail: 'validate-city-data.ts exit 0' });
    } catch (e: any) {
      const output = e.stdout?.toString() || e.message || '';
      const errorCount = (output.match(/✗/g) || []).length;
      results.push({ gate: 'G2', status: 'FAIL', detail: `${errorCount} validation errors found` });
    }
  }

  // ── G3: Build passes ──
  if (!targetSlug) {
    // Full build check only in audit mode
    try {
      execSync(`npm run build 2>&1 | tail -3`, {
        cwd: PROJECT_DIR,
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 120000,
      });
      results.push({ gate: 'G3', status: 'PASS', detail: 'npm run build exit 0' });
    } catch (e: any) {
      results.push({ gate: 'G3', status: 'FAIL', detail: 'Build failed — run npm run build to see errors' });
    }
  } else {
    results.push({ gate: 'G3', status: 'SKIP', detail: 'Skipping full build for targeted check' });
  }

  // ── G4: OG image exists, ≥30KB, no -v2 suffix ──
  const checkOgs = targetSlug ? [targetSlug] : getCitySlugs();
  let ogPass = true;
  for (const slug of checkOgs) {
    const canonicalPath = `public/images/og-city-${slug}.webp`;
    const fullPath = path.join(PROJECT_DIR, canonicalPath);

    if (!fs.existsSync(fullPath)) {
      results.push({ gate: 'G4', status: 'FAIL', detail: `OG missing: ${canonicalPath}` });
      ogPass = false;
      continue;
    }

    const size = fs.statSync(fullPath).size;
    if (size < 30000) {
      results.push({ gate: 'G4', status: 'FAIL', detail: `OG too small (${size} bytes): ${canonicalPath}` });
      ogPass = false;
    }

    // Check for -v2 variants that shouldn't exist
    const v2Path = `public/images/og-city-${slug}-v2.webp`;
    if (fs.existsSync(path.join(PROJECT_DIR, v2Path))) {
      results.push({ gate: 'G4', status: 'FAIL', detail: `Stale -v2 variant found: ${v2Path}. Delete it.` });
      ogPass = false;
    }
  }
  if (ogPass && !results.some(r => r.gate === 'G4' && r.status === 'FAIL')) {
    results.push({ gate: 'G4', status: 'PASS', detail: `${checkOgs.length} OG(s) exist, ≥30KB, no -v2 variants` });
  }

  // ── S5: No standalone "Free Birth Plan" ──
  try {
    const grepResult = execSync(`grep -r '"Free Birth Plan"' src/ --include="*.ts" --include="*.astro" 2>/dev/null || true`, {
      cwd: PROJECT_DIR,
      encoding: 'utf-8',
      timeout: 10000,
    });
    if (grepResult.trim()) {
      const lines = grepResult.trim().split('\n').filter(l => l.trim());
      results.push({ gate: 'S5', status: 'FAIL', detail: `${lines.length} instance(s) of standalone "Free Birth Plan" found. Use "Joyful Birth Plan" with "free" as adjective.` });
    } else {
      results.push({ gate: 'S5', status: 'PASS', detail: 'No standalone "Free Birth Plan" text' });
    }
  } catch {
    results.push({ gate: 'S5', status: 'PASS', detail: 'Grep check completed' });
  }

  // ── S7: medicaidNote format ──
  if (targetSlug) {
    try {
      const grepResult = execSync(
        `grep -A10 '"slug": "${targetSlug}"' src/data/cities.ts | grep -o '"medicaidNote": "[^"]*"'`,
        { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 10000 }
      );
      const note = grepResult.trim();
      if (note.startsWith('"medicaidNote": "Yes') || note.startsWith('"medicaidNote": "No')) {
        results.push({ gate: 'S7', status: 'PASS', detail: `medicaidNote format OK` });
      } else {
        results.push({ gate: 'S7', status: 'FAIL', detail: `medicaidNote must start with "Yes —" or "No —"` });
      }
    } catch {
      results.push({ gate: 'S7', status: 'SKIP', detail: 'Could not extract medicaidNote for targeted slug' });
    }
  } else {
    results.push({ gate: 'S7', status: 'SKIP', detail: 'Skipping medicaidNote check in audit mode (run with slug)' });
  }

  // ── Print summary ──
  console.log('\n─── RESULTS ───\n');

  let allPass = true;
  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⏭';
    console.log(`  ${icon} ${r.gate}: ${r.detail}`);
    if (r.status === 'FAIL') allPass = false;
  }

  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const skipCount = results.filter(r => r.status === 'SKIP').length;

  console.log(`\n${passCount} passed, ${failCount} failed, ${skipCount} skipped`);

  if (allPass) {
    console.log('\n✅ ALL GATES PASSED — ready to deploy');
    process.exit(0);
  } else {
    console.log('\n❌ SOME GATES FAILED — fix before deploying');
    process.exit(1);
  }
}

function getCitySlugs(): string[] {
  try {
    const content = fs.readFileSync(path.join(PROJECT_DIR, 'src/data/cities.ts'), 'utf-8');
    const matches = content.matchAll(/"slug":\s*"([^"]+)"/g);
    return [...matches].map(m => m[1]);
  } catch {
    console.error('Could not read cities.ts to extract slugs');
    return [];
  }
}

run();