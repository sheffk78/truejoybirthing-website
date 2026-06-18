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

  // ── G4: OG image exists, ≥10KB ──
  // -v2 (and -v3, -v4, etc.) variants are INTENTIONAL CDN cache-busting suffixes.
  // Cloudflare Pages sets 1-year immutable cache on static assets, so renaming
  // the file is the only way to force a fresh serve. The preflight accepts any
  // variant that exists and is ≥10KB.
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

    // Use the highest-variant file (most recent)
    files.sort();
    const bestFile = files[files.length - 1];
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
      // Scope to the target city's block only
      const slugMatch = citiesContent.match(new RegExp(`"${targetSlug}":\\s*\\{`));
      if (slugMatch) {
        const blockStart = slugMatch.index!;
        // Find the closing of this city block (next top-level `},` or end of file)
        let depth = 0;
        let blockEnd = citiesContent.length;
        for (let i = blockStart; i < citiesContent.length; i++) {
          const c = citiesContent[i];
          if (c === '{') depth++;
          else if (c === '}') {
            depth--;
            if (depth === 0) {
              // Check if next non-whitespace is a comma (end of city block)
              const rest = citiesContent.slice(i + 1).trimStart();
              if (rest.startsWith(',')) {
                // Block ends just past the closing brace + comma
                blockEnd = i + 1;
                break;
              }
            }
          }
        }
        searchBlock = citiesContent.slice(blockStart, blockEnd);
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
      results.push({ gate: 'V1', status: 'FAIL', detail: `${badVerifications.length} provider(s) in ${targetSlug || 'all cities'} have isVerified: true. Only set after positive outreach response.` });
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
        `awk '/slug: "${targetSlug}"/{p=1} p; /^  },/{if(p) exit}' src/data/cities.ts`,
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
        `awk '/slug: "${targetSlug}"/{p=1} p; /^  },/{if(p) exit}' src/data/cities.ts`,
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
        results.push({ gate: 'G20', status: 'SKIP', detail: 'No hospital/birth center thumbnails found' });
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
      const heroPattern = new RegExp(`^${targetSlug}-birth-doula`);
      const ogPattern = new RegExp(`^og-city-${targetSlug}(-v\\d+)?\\.webp$`);

      const heroFiles = fs.readdirSync(dir).filter(f => heroPattern.test(f));
      const ogFiles = fs.readdirSync(dir).filter(f => ogPattern.test(f));

      if (heroFiles.length > 0 && ogFiles.length > 0) {
        // Sort to get the latest variant
        heroFiles.sort();
        ogFiles.sort();
        const heroPath = path.join(dir, heroFiles[heroFiles.length - 1]);
        const ogPath = path.join(dir, ogFiles[ogFiles.length - 1]);

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
          const ytThumbPattern = new RegExp(`^yt-thumbnail-${targetSlug}(-v\\d+)?\\.(webp|jpg|png)$`);
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
              // Auto-generated thumbnails follow the pattern hqdefault.jpg
              // Custom thumbnails have a different URL pattern
              if (thumbUrl.includes('hqdefault')) {
                results.push({ gate: 'G22', status: 'FAIL', detail: `YouTube thumbnail is auto-generated (hqdefault pattern) for video ${videoId}. Upload a branded thumbnail.` });
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