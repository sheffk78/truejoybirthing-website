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
import { fileURLToPath } from 'url';

const PROJECT_DIR = '/Users/socializerender/Projects/truejoybirthing-website';
const CANONICAL_DIR = '/Users/socializerender/Projects/truejoybirthing-website';
const __filename = fileURLToPath(import.meta.url);

interface GateResult {
  gate: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  detail: string;
}

function run(): void {
  const args = process.argv.slice(2);
  const targetSlug = args[0] || null;
  const results: GateResult[] = [];

  // ── Self-test mode: verify gate code integrity ──
  if (args.includes('--self-test')) {
    console.log('  Running self-test...');
    let selfTestPass = true;
    const source = fs.readFileSync(__filename, 'utf-8');
    // Check 1: No WARN status values (all gates must be PASS/FAIL/SKIP)
    // Only check the actual gate code (lines after the self-test block)
    const lines = source.split('\n');
    // Find the end of the self-test block via marker comment
    // Search from line 50 onward to avoid finding our own includes() call
    let gateStart = 0;
    for (let i = 50; i < lines.length; i++) {
      if (lines[i].includes('// --- END SELF-TEST ---')) {
        gateStart = i + 1;
        break;
      }
    }
    const gateLines = lines.slice(gateStart).join('\n');
    if (gateLines.includes("'WARN'")) {
      console.log('  ❌ Self-test FAILED: preflight.ts contains WARN status values');
      selfTestPass = false;
    } else {
      console.log('  ✅ No WARN downgrades');
    }

    // Check 2: All AWK patterns use the correct terminator (not ^  },)
    const awkLines = source.match(/awk\s+.*slug.*/g) || [];
    for (const line of awkLines) {
      if (line.includes('^  },')) {
        console.log(`  ❌ Self-test FAILED: AWK pattern uses wrong terminator: ${line.trim()}`);
        selfTestPass = false;
      }
    }
    if (selfTestPass) {
      console.log('  ✅ All AWK patterns use correct terminator');
    }

    // Check 3: G4/G21 use numeric variant sort (not ASCII sort)
    if (gateLines.includes('files.sort();')) {
      console.log('  ❌ Self-test FAILED: files.sort() without custom comparator found');
      selfTestPass = false;
    } else {
      console.log('  ✅ All file sorts use numeric variant comparator');
    }

    if (selfTestPass) {
      console.log('  ✅ Self-test passed');
    } else {
      console.log('  ❌ Self-test FAILED — fix gate code before deploying');
      process.exit(1);
    }
    return;
  }
// --- END SELF-TEST ---

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
        `awk '/"${targetSlug}": \\{/{p=1; start=NR} p; /^  "[a-z].*": \\{/{if(p && NR>start) exit}' src/data/cities.ts`,
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

  // ── G4: OG image exists, ≥10KB ──
  // -v2 (and -v3, -v4, etc.) variants are INTENTIONAL CDN cache-busting suffixes.
  // Cloudflare Pages sets 1-year immutable cache on static assets, so renaming
  // the file is the only way to force a fresh serve. The preflight accepts any
  // variant that exists and is ≥10KB.
  // ⚠️ Sorting fix (June 2026): ASCII sort puts -v2 BEFORE the base name
  // because '-' (0x2D) < '.' (0x2E), so files[length-1] picks corrupted v1
  // instead of valid v2. Fix: sort by variant number descending.
  const checkOgs = targetSlug ? [targetSlug] : getCitySlugs();
  let ogPass = true;
  for (const slug of checkOgs) {
    // Check all variants: canonical, -v2, -v3, etc.
    const dir = path.join(PROJECT_DIR, 'public/images');
    const pattern = new RegExp(`^og-city-${slug}(-v\\d+)?\\.webp$`);
    const files = fs.readdirSync(dir).filter(f => pattern.test(f));

    if (files.length === 0) {
      results.push({ gate: 'G4', status: 'FAIL', detail: `OG missing for ${slug} (no variant found)` });
      ogPass = false;
      continue;
    }

    // Sort by variant number descending so files[0] = most recent version
    // Fixes ASCII sort bug: '-' (0x2D) < '.' (0x2E) was picking v1 over v2
    files.sort((a, b) => {
      const va = parseInt(a.match(/-v(\d+)/)?.[1] ?? '0');
      const vb = parseInt(b.match(/-v(\d+)/)?.[1] ?? '0');
      // Highest variant first (most recent)
      if (va !== vb) return vb - va;
      // Same variant (or none) — put file with non-zero variant first
      return (va === 0 ? 1 : 0) - (vb === 0 ? 1 : 0);
    });
    const bestFile = files[0];
    const fullPath = path.join(dir, bestFile);
    const size = fs.statSync(fullPath).size;

    if (size < 10000) {
      results.push({ gate: 'G4', status: 'FAIL', detail: `OG too small (${size} bytes): ${bestFile}` });
      ogPass = false;
    } else {
      // Verify the file decodes correctly (not corrupted)
      try {
        execSync(`python3 -c "from PIL import Image; Image.open('${fullPath}').verify()"`, { timeout: 5000 });
      } catch {
        results.push({ gate: 'G4', status: 'FAIL', detail: `OG corrupted (decode error): ${bestFile}` });
        ogPass = false;
      }
    }
  }
  if (ogPass) {
    results.push({ gate: 'G4', status: 'PASS', detail: `${checkOgs.length} OG(s) exist, ≥10KB, decodable` });
  }

  // ── V1: No phantom verified badges (isVerified must be explicitly boolean) ──
  // Scoped to the target city block when a slug is provided, to avoid false
  // positives from legitimate verified providers in other cities.
  try {
    const citiesContent = fs.readFileSync(path.join(PROJECT_DIR, 'src/data/cities.ts'), 'utf-8');
    let searchBlock = citiesContent;

    if (targetSlug) {
      // Scope to the target city's block only — use AWK for reliable block extraction
      // (avoids brace-in-string false positives from manual depth counter)
      try {
        const blockContent = execSync(
          `awk '/"${targetSlug}": \\{/{p=1; start=NR} p; /^  "[a-z].*": \\{/{if(p && NR>start) exit}' src/data/cities.ts`,
          { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 10000 }
        );
        searchBlock = blockContent;
      } catch {
        // Fallback: use the whole file if AWK fails
        searchBlock = citiesContent;
      }
    }

    const verifiedMatches = searchBlock.match(/isVerified:\s*[^,\n}]+/g) || [];
    const badVerifications: string[] = [];
    for (const match of verifiedMatches) {
      const val = match.replace('isVerified:', '').trim();
      if (val === 'true') {
        badVerifications.push(match.trim());
      }
    }
    if (badVerifications.length > 0) {
      results.push({ gate: 'V1', status: 'FAIL', detail: `${badVerifications.length} provider(s) in ${targetSlug || 'all cities'} have isVerified: true. Verify these are legitimate outreach responses, not batch-sets.` });
      badVerifications.forEach(v => results.push({ gate: 'V1', status: 'FAIL', detail: `  ${v}` }));
    } else {
      results.push({ gate: 'V1', status: 'PASS', detail: `No phantom verified badges in ${targetSlug || 'all cities'}` });
    }
  } catch {
    results.push({ gate: 'V1', status: 'SKIP', detail: 'Could not read cities.ts for verification audit' });
  }

  // ── S6: Provider costRange validation ──
    if (targetSlug) {
      try {
        const pyResult = execSync(
          `python3 scripts/s6-costrange-check.py ${targetSlug}`,
          { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 10000 }
        );
        const output = pyResult.trim();
        if (output.startsWith('PASS:')) {
          const count = output.split(':')[1];
          results.push({ gate: 'S6', status: 'PASS', detail: `All ${count} providers have costRange` });
        } else if (output.startsWith('FAIL:')) {
          const missingNames = output.substring(5).split(',');
          results.push({ gate: 'S6', status: 'FAIL', detail: `${missingNames.length} provider(s) missing costRange: ${missingNames.join(', ')}` });
        } else if (output === 'NO_CITY') {
          results.push({ gate: 'S6', status: 'SKIP', detail: `City slug ${targetSlug} not found` });
        } else if (output === 'NO_DOULAS') {
          results.push({ gate: 'S6', status: 'SKIP', detail: 'No localDoulas section found' });
        } else {
          results.push({ gate: 'S6', status: 'SKIP', detail: `Unexpected output: ${output}` });
        }
      } catch (e: any) {
        results.push({ gate: 'S6', status: 'SKIP', detail: `Could not check provider costRange` });
      }
    } else {
      results.push({ gate: 'S6', status: 'SKIP', detail: 'Skipping costRange check in audit mode (run with slug)' });
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

  // ── A3: No broken internal links ──
  try {
    const grepResult = execSync(`grep -rn 'href.*birth-plan-app' dist/ --include='*.html' 2>/dev/null || true`, {
      cwd: PROJECT_DIR,
      encoding: 'utf-8',
      timeout: 10000,
    });
    if (grepResult.trim()) {
      const lines = grepResult.trim().split('\n').filter(l => l.trim());
      results.push({ gate: 'A3', status: 'FAIL', detail: `${lines.length} broken link(s) to /birth-plan-app/ in dist — fix before deploy` });
    } else {
      results.push({ gate: 'A3', status: 'PASS', detail: 'No broken internal links to /birth-plan-app/' });
    }
  } catch {
    results.push({ gate: 'A3', status: 'SKIP', detail: 'Could not check broken links (dist may not exist)' });
  }

  // ── A4: Title lengths ≤70 chars ──
  try {
    const shellResult = execSync(
      `pass=true; for f in dist/birth-support/*/index.html; do ` +
      `slug=$(basename $(dirname "$f")); ` +
      `title=$(grep -o '<title>[^<]*</title>' "$f" | sed 's/<[^>]*>//g' | sed 's/&amp;/\\&/g'); ` +
      `len=$(echo -n "$title" | wc -c | tr -d ' '); ` +
      `if [ "$len" -gt 70 ]; then ` +
      `echo "LONG: $slug ($len chars: $title)"; pass=false; ` +
      `fi; done; $pass`,
      { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 30000 }
    );
    results.push({ gate: 'A4', status: 'PASS', detail: 'All city + state page titles ≤70 chars' });
  } catch (e: any) {
    const output = e.stdout?.toString() || '';
    const longPages = output.split('\n').filter(l => l.includes('LONG:'));
    if (longPages.length > 0) {
      results.push({ gate: 'A4', status: 'FAIL', detail: `${longPages.length} page(s) with title >70 chars` });
      longPages.forEach(l => results.push({ gate: 'A4', status: 'FAIL', detail: `  ${l.trim()}` }));
    } else {
      results.push({ gate: 'A4', status: 'FAIL', detail: 'Title check command failed' });
    }
  }

  // ── G18: YouTube embed returns 200 (not deleted/unlisted) ──
  if (targetSlug) {
    try {
      const cityBlock = execSync(
        `awk '/"${targetSlug}": \\{/{p=1; start=NR} p; /^  "[a-z].*": \\{/{if(p && NR>start) exit}' src/data/cities.ts`,
        { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 10000 }
      );
      // Look for YouTube embed URL in the dist HTML
      const distFile = `dist/birth-support/${targetSlug}/index.html`;
      if (fs.existsSync(path.join(PROJECT_DIR, distFile))) {
        const html = fs.readFileSync(path.join(PROJECT_DIR, distFile), 'utf-8');
        const ytMatch = html.match(/youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)/);
        if (ytMatch) {
          const videoId = ytMatch[1];
          try {
            const ytResult = execSync(
              `curl -sI "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json" | head -1`,
              { timeout: 10000, encoding: 'utf-8' }
            );
            if (ytResult.includes('200')) {
              results.push({ gate: 'G18', status: 'PASS', detail: `YouTube embed ${videoId} is accessible` });
            } else {
              results.push({ gate: 'G18', status: 'FAIL', detail: `YouTube video ${videoId} returned non-200 — may be deleted or unlisted` });
            }
          } catch {
            results.push({ gate: 'G18', status: 'SKIP', detail: 'Could not verify YouTube embed (network issue)' });
          }
        } else {
          results.push({ gate: 'G18', status: 'SKIP', detail: 'No YouTube embed found in dist HTML' });
        }
      } else {
        results.push({ gate: 'G18', status: 'SKIP', detail: 'Dist HTML not found (run build first)' });
      }
    } catch {
      results.push({ gate: 'G18', status: 'SKIP', detail: 'Could not check YouTube embed' });
    }
  } else {
    results.push({ gate: 'G18', status: 'SKIP', detail: 'Skipping YouTube embed check in audit mode (run with slug)' });
  }

  // ── G19: All provider photos return 200 on live URL ──
  if (targetSlug) {
    try {
      const distFile = `dist/birth-support/${targetSlug}/index.html`;
      if (fs.existsSync(path.join(PROJECT_DIR, distFile))) {
        const html = fs.readFileSync(path.join(PROJECT_DIR, distFile), 'utf-8');
        // Find all image src attributes
        const imgMatches = html.matchAll(/src="([^"]+\.webp)"/g);
        const providerPhotos = [...imgMatches]
          .map(m => m[1])
          .filter(src => src.includes('/images/') && !src.includes('og-city-') && !src.includes('logo'));

        let brokenCount = 0;
        for (const src of providerPhotos) {
          const localPath = path.join(PROJECT_DIR, 'public', src.replace(/^\//, ''));
          if (!fs.existsSync(localPath)) {
            brokenCount++;
            results.push({ gate: 'G19', status: 'FAIL', detail: `Missing on disk: ${src}` });
          } else {
            const size = fs.statSync(localPath).size;
            if (size < 1000) {
              brokenCount++;
              results.push({ gate: 'G19', status: 'FAIL', detail: `Too small (${size}B): ${src}` });
            }
          }
        }

        if (brokenCount === 0) {
          results.push({ gate: 'G19', status: 'PASS', detail: `All ${providerPhotos.length} provider/hospital photos exist on disk, ≥1KB` });
        }
      } else {
        results.push({ gate: 'G19', status: 'SKIP', detail: 'Dist HTML not found (run build first)' });
      }
    } catch {
      results.push({ gate: 'G19', status: 'SKIP', detail: 'Could not check provider photos' });
    }
  } else {
    results.push({ gate: 'G19', status: 'SKIP', detail: 'Skipping provider photo check in audit mode (run with slug)' });
  }

  // ── G20: All hospital/birth center thumbnails exist on disk ──
  if (targetSlug) {
    try {
      const cityBlock = execSync(
        `awk '/"${targetSlug}": \\{/{p=1; start=NR} p; /^  "[a-z].*": \\{/{if(p && NR>start) exit}' src/data/cities.ts`,
        { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 10000 }
      );

      // Find all thumbnail references
      const thumbMatches = cityBlock.matchAll(/thumbnail:\s*"([^"]+)"/g);
      const thumbnails = [...thumbMatches].map(m => m[1]);
      let missingThumbs = 0;

      for (const thumb of thumbnails) {
        const localPath = path.join(PROJECT_DIR, 'public', thumb.replace(/^\//, ''));
        if (!fs.existsSync(localPath)) {
          missingThumbs++;
          results.push({ gate: 'G20', status: 'FAIL', detail: `Thumbnail missing on disk: ${thumb}` });
        } else {
          const size = fs.statSync(localPath).size;
          if (size < 1000) {
            missingThumbs++;
            results.push({ gate: 'G20', status: 'FAIL', detail: `Thumbnail too small (${size}B): ${thumb}` });
          }
        }
      }

      if (thumbnails.length === 0) {
        // Check if hospitals or birth centers exist in this city block
        // If they do, missing thumbnail fields is a FAIL (silent miss)
        const hasHospitals = /hospitalDetails|birthCenterDetails/.test(cityBlock);
        if (hasHospitals) {
          results.push({ gate: 'G20', status: 'FAIL', detail: `Hospital/birth center entries exist but ZERO thumbnail fields found — add thumbnail: fields to each facility` });
        } else {
          results.push({ gate: 'G20', status: 'SKIP', detail: 'No hospital/birth center thumbnails found (no facilities in this city)' });
        }
      } else if (missingThumbs === 0) {
        results.push({ gate: 'G20', status: 'PASS', detail: `All ${thumbnails.length} thumbnails exist on disk, ≥1KB` });
      }
    } catch {
      results.push({ gate: 'G20', status: 'SKIP', detail: 'Could not check thumbnails' });
    }
  } else {
    results.push({ gate: 'G20', status: 'SKIP', detail: 'Skipping thumbnail check in audit mode (run with slug)' });
  }

  // ── G21: Hero, OG, and YT thumbnail are distinct files ──
  if (targetSlug) {
    try {
      const dir = path.join(PROJECT_DIR, 'public/images');
      // Narrow hero pattern to specifically match -hero variants (not -skyline, -support)
      const heroPattern = new RegExp(`^${targetSlug}-birth-doula-hero(-v\\d+)?\\.webp$`);
      const ogPattern = new RegExp(`^og-city-${targetSlug}(-v\\d+)?\\.webp$`);

      const heroFiles = fs.readdirSync(dir).filter(f => heroPattern.test(f));
      const ogFiles = fs.readdirSync(dir).filter(f => ogPattern.test(f));

      if (heroFiles.length > 0 && ogFiles.length > 0) {
        // Sort by variant number descending to get the most recent version
        // (same fix as G4 — ASCII sort puts -v2 before base name)
        const sortByVariant = (a: string, b: string) => {
          const va = parseInt(a.match(/-v(\d+)/)?.[1] ?? '0');
          const vb = parseInt(b.match(/-v(\d+)/)?.[1] ?? '0');
          if (va !== vb) return vb - va;
          return (va === 0 ? 1 : 0) - (vb === 0 ? 1 : 0);
        };
        heroFiles.sort(sortByVariant);
        ogFiles.sort(sortByVariant);
        const heroPath = path.join(dir, heroFiles[0]);
        const ogPath = path.join(dir, ogFiles[0]);

        const heroSize = fs.statSync(heroPath).size;
        const ogSize = fs.statSync(ogPath).size;

        // If they're the same file size, they might be the same image
        // This is a heuristic — not perfect, but catches the obvious case
        if (heroSize === ogSize) {
          // Do a byte-level comparison
          const heroBuf = fs.readFileSync(heroPath);
          const ogBuf = fs.readFileSync(ogPath);
          if (heroBuf.equals(ogBuf)) {
            results.push({ gate: 'G21', status: 'FAIL', detail: `Hero and OG images are identical files (${heroFiles[heroFiles.length - 1]} == ${ogFiles[ogFiles.length - 1]})` });
          } else {
            results.push({ gate: 'G21', status: 'PASS', detail: 'Hero and OG images are distinct files' });
          }
        } else {
          results.push({ gate: 'G21', status: 'PASS', detail: 'Hero and OG images are distinct files (different sizes)' });
        }
      } else {
        results.push({ gate: 'G21', status: 'SKIP', detail: 'Could not find hero or OG image files for comparison' });
      }
    } catch {
      results.push({ gate: 'G21', status: 'SKIP', detail: 'Could not compare hero/OG images' });
    }
  } else {
    results.push({ gate: 'G21', status: 'SKIP', detail: 'Skipping image distinctness check in audit mode (run with slug)' });
  }

  // ── G22: YouTube thumbnail is branded (not auto-generated) ──
  if (targetSlug) {
    try {
      const distFile = `dist/birth-support/${targetSlug}/index.html`;
      if (fs.existsSync(path.join(PROJECT_DIR, distFile))) {
        const html = fs.readFileSync(path.join(PROJECT_DIR, distFile), 'utf-8');
        const ytMatch = html.match(/youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)/);
        if (ytMatch) {
          const videoId = ytMatch[1];
          // Check if a branded thumbnail file exists locally
          const ytThumbPattern = new RegExp(`^yt-(?:thumbnail|thumb)-${targetSlug}(-v\\d+)?\\.(webp|jpg|png)$`);
          const ytThumbFiles = fs.readdirSync(path.join(PROJECT_DIR, 'public/images')).filter(f => ytThumbPattern.test(f));

          if (ytThumbFiles.length > 0) {
            results.push({ gate: 'G22', status: 'PASS', detail: `Branded YouTube thumbnail found: ${ytThumbFiles.join(', ')}` });
          } else {
            // Check if the YouTube API returns a custom thumbnail (not auto-generated)
            try {
              const ytResult = execSync(
                `curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json"`,
                { timeout: 10000, encoding: 'utf-8' }
              );
              const ytData = JSON.parse(ytResult);
              const thumbUrl = ytData.thumbnail_url || '';
              const thumbWidth = ytData.thumbnail_width || 0;
              // Auto-generated thumbnails are 480×360 (hqdefault).
              // Custom/branded thumbnails uploaded via API are 1280×720 (maxresdefault).
              // Check width: 1280 = branded, 480 = auto-generated.
              if (thumbWidth < 1000 || thumbUrl.includes('hqdefault')) {
                results.push({ gate: 'G22', status: 'FAIL', detail: `YouTube thumbnail appears auto-generated (${thumbWidth}px wide, hqdefault pattern) for video ${videoId}. Upload a branded thumbnail.` });
              } else {
                results.push({ gate: 'G22', status: 'PASS', detail: `YouTube thumbnail appears custom for video ${videoId}` });
              }
            } catch {
              results.push({ gate: 'G22', status: 'SKIP', detail: 'Could not verify YouTube thumbnail type' });
            }
          }
        } else {
          results.push({ gate: 'G22', status: 'SKIP', detail: 'No YouTube embed found' });
        }
      } else {
        results.push({ gate: 'G22', status: 'SKIP', detail: 'Dist HTML not found (run build first)' });
      }
    } catch {
      results.push({ gate: 'G22', status: 'SKIP', detail: 'Could not check YouTube thumbnail' });
    }
  } else {
    results.push({ gate: 'G22', status: 'SKIP', detail: 'Skipping YT thumbnail check in audit mode (run with slug)' });
  }

  // -- G23: YouTube branded thumbnail uses the same hero image as the page --
  if (targetSlug) {
    try {
      const g23Result = execSync(
        `python3 scripts/preflight-image-helper.py yt-thumbnail-matches-hero ${targetSlug}`,
        { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 15000 }
      );
      const g23Data = JSON.parse(g23Result.trim());
      if (g23Data.pass) {
        results.push({ gate: 'G23', status: 'PASS', detail: g23Data.detail });
      } else {
        results.push({ gate: 'G23', status: 'FAIL', detail: g23Data.detail });
      }
    } catch (e: any) {
      const output = typeof e.stdout === 'string' ? e.stdout : '';
      try {
        const g23Data = JSON.parse(output.trim());
        if (g23Data.pass) {
          results.push({ gate: 'G23', status: 'PASS', detail: g23Data.detail });
        } else {
          results.push({ gate: 'G23', status: 'FAIL', detail: g23Data.detail });
        }
      } catch {
        results.push({ gate: 'G23', status: 'SKIP', detail: 'Could not check YT thumbnail vs hero match' });
      }
    }
  } else {
    results.push({ gate: 'G23', status: 'SKIP', detail: 'Skipping YT thumbnail comparison in audit mode (run with slug)' });
  }

  // -- G24: Support scene is unique to this city (not a duplicate of another city's) --
  if (targetSlug) {
    try {
      const g24Result = execSync(
        `python3 scripts/preflight-image-helper.py support-scene-quality ${targetSlug}`,
        { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 15000 }
      );
      const g24Data = JSON.parse(g24Result.trim());
      if (g24Data.pass) {
        results.push({ gate: 'G24', status: 'PASS', detail: g24Data.detail });
      } else {
        results.push({ gate: 'G24', status: 'FAIL', detail: g24Data.detail });
      }
    } catch (e: any) {
      const output = typeof e.stdout === 'string' ? e.stdout : '';
      try {
        const g24Data = JSON.parse(output.trim());
        if (g24Data.pass) {
          results.push({ gate: 'G24', status: 'PASS', detail: g24Data.detail });
        } else {
          results.push({ gate: 'G24', status: 'FAIL', detail: g24Data.detail });
        }
      } catch {
        results.push({ gate: 'G24', status: 'SKIP', detail: 'Could not check support scene quality' });
      }
    }
  } else {
    results.push({ gate: 'G24', status: 'SKIP', detail: 'Skipping support scene quality check in audit mode (run with slug)' });
  }

  // ── G8: Hero image is a pregnant silhouette, not a city skyline (PIL) ──
  if (targetSlug) {
    try {
      const g8Result = execSync(
        `python3 scripts/preflight-image-helper.py hero-silhouette ${targetSlug}`,
        { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 15000 }
      );
      const g8Data = JSON.parse(g8Result.trim());
      if (g8Data.pass) {
        results.push({ gate: 'G8', status: 'PASS', detail: g8Data.detail });
      } else {
        results.push({ gate: 'G8', status: 'FAIL', detail: g8Data.detail });
      }
    } catch (e: any) {
      // Try parsing JSON from stderr or partial output
      const output = typeof e.stdout === 'string' ? e.stdout : typeof e === 'object' && e.message ? e.message : '';
      try {
        const g8Data = JSON.parse(output.trim());
        if (g8Data.pass) {
          results.push({ gate: 'G8', status: 'PASS', detail: g8Data.detail });
        } else {
          results.push({ gate: 'G8', status: 'FAIL', detail: g8Data.detail });
        }
      } catch {
        results.push({ gate: 'G8', status: 'SKIP', detail: 'Could not check hero silhouette' });
      }
    }
  } else {
    results.push({ gate: 'G8', status: 'SKIP', detail: 'Skipping hero silhouette check in audit mode (run with slug)' });
  }

  // ── G9: Support scene is city-specific, not generic ──
  if (targetSlug) {
    try {
      const g9Cmd = `awk '/"${targetSlug}": \\{/{p=1; start=NR} p; /^  "[a-z].*": \\{/{if(p && NR>start) exit}' src/data/cities.ts | grep -oE 'supportSceneImage:\\s*"[^"]+"' | head -1 | sed 's/supportSceneImage: *"//' | sed 's/"$//'`;
      const g9Result = execSync(g9Cmd, { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 10000 });
      const supportScene = g9Result.trim();
      if (!supportScene) {
        results.push({ gate: 'G9', status: 'SKIP', detail: 'No supportSceneImage field found' });
      } else if (supportScene.includes('doula-walking') || supportScene.includes('generic')) {
        results.push({ gate: 'G9', status: 'FAIL', detail: `Support scene is generic: ${supportScene}. Generate a city-specific scene.` });
      } else {
        // Check file exists
        const scenePath = path.join(PROJECT_DIR, 'public', supportScene.replace(/^\//, ''));
        if (fs.existsSync(scenePath)) {
          results.push({ gate: 'G9', status: 'PASS', detail: `City-specific support scene: ${supportScene}` });
        } else {
          results.push({ gate: 'G9', status: 'FAIL', detail: `Support scene file not found on disk: ${supportScene}` });
        }
      }
    } catch {
      results.push({ gate: 'G9', status: 'SKIP', detail: 'Could not check support scene (city block not found)' });
    }
  } else {
    results.push({ gate: 'G9', status: 'SKIP', detail: 'Skipping support scene check in audit mode (run with slug)' });
  }

  // ── G10: Provider descriptions are specific, not generic placeholders (Python) ──
  if (targetSlug) {
    try {
      const g10Result = execSync(
        `python3 scripts/preflight-image-helper.py provider-descriptions ${targetSlug}`,
        { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 15000 }
      );
      const g10Data = JSON.parse(g10Result.trim());
      if (g10Data.pass) {
        results.push({ gate: 'G10', status: 'PASS', detail: g10Data.detail });
      } else {
        results.push({ gate: 'G10', status: 'FAIL', detail: g10Data.detail });
      }
    } catch (e: any) {
      const output = typeof e.stdout === 'string' ? e.stdout : '';
      try {
        const g10Data = JSON.parse(output.trim());
        if (g10Data.pass) {
          results.push({ gate: 'G10', status: 'PASS', detail: g10Data.detail });
        } else {
          results.push({ gate: 'G10', status: 'FAIL', detail: g10Data.detail });
        }
      } catch {
        results.push({ gate: 'G10', status: 'SKIP', detail: 'Could not check provider descriptions' });
      }
    }
  } else {
    results.push({ gate: 'G10', status: 'SKIP', detail: 'Skipping provider description check in audit mode (run with slug)' });
  }

  // ── P11: Hospital/birth center images are landscape, not square (PIL) ──
  if (targetSlug) {
    try {
      const p11Result = execSync(
        `python3 scripts/preflight-image-helper.py hospital-dimensions ${targetSlug}`,
        { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 15000 }
      );
      const p11Data = JSON.parse(p11Result.trim());
      if (p11Data.pass) {
        results.push({ gate: 'P11', status: 'PASS', detail: p11Data.detail });
      } else {
        results.push({ gate: 'P11', status: 'FAIL', detail: p11Data.detail });
      }
    } catch (e: any) {
      const output = typeof e.stdout === 'string' ? e.stdout : '';
      try {
        const p11Data = JSON.parse(output.trim());
        if (p11Data.pass) {
          results.push({ gate: 'P11', status: 'PASS', detail: p11Data.detail });
        } else {
          results.push({ gate: 'P11', status: 'FAIL', detail: p11Data.detail });
        }
      } catch {
        results.push({ gate: 'P11', status: 'SKIP', detail: 'Could not check hospital dimensions' });
      }
    }
  } else {
    results.push({ gate: 'P11', status: 'SKIP', detail: 'Skipping hospital dimension check in audit mode (run with slug)' });
  }

  // ── A12: serviceArea is a string array, not a plain string (Python) ──
  if (targetSlug) {
    try {
      const a12Result = execSync(
        `python3 scripts/preflight-image-helper.py service-area ${targetSlug}`,
        { cwd: PROJECT_DIR, encoding: 'utf-8', timeout: 15000 }
      );
      const a12Data = JSON.parse(a12Result.trim());
      if (a12Data.pass) {
        results.push({ gate: 'A12', status: 'PASS', detail: a12Data.detail });
      } else {
        results.push({ gate: 'A12', status: 'FAIL', detail: a12Data.detail });
      }
    } catch (e: any) {
      const output = typeof e.stdout === 'string' ? e.stdout : '';
      try {
        const a12Data = JSON.parse(output.trim());
        if (a12Data.pass) {
          results.push({ gate: 'A12', status: 'PASS', detail: a12Data.detail });
        } else {
          results.push({ gate: 'A12', status: 'FAIL', detail: a12Data.detail });
        }
      } catch {
        results.push({ gate: 'A12', status: 'SKIP', detail: 'Could not check serviceArea format' });
      }
    }
  } else {
    results.push({ gate: 'A12', status: 'SKIP', detail: 'Skipping serviceArea check in audit mode (run with slug)' });
  }

  // ── G25: Hero image aspect ratio is 3:2 (not 16:9) ──
  if (targetSlug) {
    try {
      const result = execSync(`python3 scripts/preflight-image-helper.py hero-aspect ${targetSlug}`, { cwd: PROJECT_DIR, timeout: 10000 }).toString().trim();
      const data = JSON.parse(result);
      if (data.pass) {
        results.push({ gate: 'G25', status: 'PASS', detail: data.detail });
      } else {
        results.push({ gate: 'G25', status: 'FAIL', detail: data.detail });
      }
    } catch {
      results.push({ gate: 'G25', status: 'SKIP', detail: 'Could not check hero aspect ratio' });
    }
  } else {
    results.push({ gate: 'G25', status: 'SKIP', detail: 'Skipping hero aspect check in audit mode (run with slug)' });
  }

  // ── G26: Support scene image aspect ratio is 16:9 ──
  if (targetSlug) {
    try {
      const result = execSync(`python3 scripts/preflight-image-helper.py support-aspect ${targetSlug}`, { cwd: PROJECT_DIR, timeout: 10000 }).toString().trim();
      const data = JSON.parse(result);
      if (data.pass) {
        results.push({ gate: 'G26', status: 'PASS', detail: data.detail });
      } else {
        results.push({ gate: 'G26', status: 'FAIL', detail: data.detail });
      }
    } catch {
      results.push({ gate: 'G26', status: 'SKIP', detail: 'Could not check support scene aspect ratio' });
    }
  } else {
    results.push({ gate: 'G26', status: 'SKIP', detail: 'Skipping support scene aspect check in audit mode (run with slug)' });
  }

  // ── G27: Provider credentials are specific (not generic "Birth Doula") ──
  if (targetSlug) {
    try {
      const result = execSync(`python3 scripts/preflight-image-helper.py provider-credentials ${targetSlug}`, { cwd: PROJECT_DIR, timeout: 10000 }).toString().trim();
      const data = JSON.parse(result);
      if (data.pass) {
        results.push({ gate: 'G27', status: 'PASS', detail: data.detail });
      } else {
        results.push({ gate: 'G27', status: 'FAIL', detail: data.detail });
      }
    } catch {
      results.push({ gate: 'G27', status: 'SKIP', detail: 'Could not check provider credentials' });
    }
  } else {
    results.push({ gate: 'G27', status: 'SKIP', detail: 'Skipping provider credential check in audit mode (run with slug)' });
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