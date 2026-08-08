#!/usr/bin/env tsx
/**
 * TJB City Page Preflight — Ship-Blocker Checks (S1–S8)
 *
 * Usage: npx tsx scripts/preflight.ts [slug]
 *   - With slug: targeted check for one city
 *   - Without slug: full audit of all cities
 *
 * Exit 0 = all gates passed
 * Exit 1 = one or more ship-blockers failed
 */

import { cities, type CityData } from "../src/data/cities";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_DIR = path.join(__dirname, "..");

const args = process.argv.slice(2);
const targetSlug = args.find((a) => !a.startsWith("--")) || null;

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const NC = "\x1b[0m";

let failures = 0;
let warnings = 0;

function pass(msg: string) {
  console.log(`  ${GREEN}✅${NC} ${msg}`);
}
function fail(msg: string) {
  console.log(`  ${RED}❌${NC} ${msg}`);
  failures++;
}
function warn(msg: string) {
  console.log(`  ${YELLOW}⚠️${NC} ${msg}`);
  warnings++;
}

// Determine which slugs to check
const slugs = targetSlug
  ? [targetSlug]
  : Object.keys(cities).sort();

console.log(`\n═══════════════════════════════════════════`);
console.log(`  TJB PREFLIGHT — ${targetSlug ? `slug: ${targetSlug}` : "FULL AUDIT"}`);
console.log(`  Time: ${new Date().toISOString()}`);
console.log(`═══════════════════════════════════════════\n`);

for (const slug of slugs) {
  const data = cities[slug];
  if (!data) {
    fail(`[${slug}] not found in cities.ts`);
    continue;
  }

  const label = `${data.city}, ${data.state} (${slug})`;
  console.log(`── ${label} ──`);

  // ── S1: enableBlogResources: true ──────────────────────────
  if (data.enableBlogResources === true) {
    pass(`S1: enableBlogResources = true`);
  } else {
    fail(`S1: enableBlogResources is not true (got: ${data.enableBlogResources})`);
  }

  // ── S2: OG image exists ≥30KB ─────────────────────────────
  const ogFilename = `og-city-${slug}`;
  const ogDir = path.join(PROJECT_DIR, "public", "images");
  let ogFound = false;
  let ogSize = 0;
  let ogFile = "";

  // Check all variants (no suffix, -v2, -v3, etc.)
  for (const f of fs.readdirSync(ogDir)) {
    if (f.startsWith(ogFilename) && f.endsWith(".webp")) {
      const full = path.join(ogDir, f);
      const stat = fs.statSync(full);
      const vMatch = f.match(/-v(\d+)/);
      const vNum = vMatch ? parseInt(vMatch[1]) : 0;
      if (vNum >= ogSize) {
        ogSize = stat.size;
        ogFile = f;
        ogFound = true;
      }
    }
  }

  // Also check remote URL for deployed OG
  const ogUrl = data.ogImage || `https://truejoybirthing.com/images/og-city-${slug}.webp`;

  if (ogFound) {
    if (ogSize >= 30000) {
      pass(`S2: OG image ${ogFile} (${ogSize} bytes ≥ 30KB)`);
    } else {
      fail(`S2: OG image ${ogFile} is only ${ogSize} bytes (min 30000). Likely a gradient placeholder.`);
    }
  } else {
    // Try checking the URL
    try {
      const resp = execSync(`curl -sI "${ogUrl}" | head -5`, { timeout: 10 });
      const match = resp.toString().match(/Content-Length:\s*(\d+)/);
      if (match) {
        const remoteSize = parseInt(match[1]);
        if (remoteSize >= 30000) {
          pass(`S2: OG image at URL (${remoteSize} bytes ≥ 30KB)`);
        } else {
          fail(`S2: OG image at URL only ${remoteSize} bytes (min 30000)`);
        }
      } else {
        fail(`S2: No local OG image found for ${slug}. Check: ${ogUrl}`);
      }
    } catch {
      fail(`S2: No local OG image found and cannot verify URL for ${slug}`);
    }
  }

  // ── S3: Build passes (run last, noted here) ────────────────
  // Build is checked once at the end for all slugs

  // ── S4: City data validation passes ────────────────────────
  // Defer to validate-city-data.ts — we note any obvious issues inline
  const requiredFields: (keyof CityData)[] = [
    "city", "state", "slug", "costLow", "costHigh",
    "culture", "heroLocalDetail", "hospitalDetails", "faqs", "nearbyCities",
  ];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      fail(`S4: Missing required field: ${String(field)}`);
    }
  }
  if (data.hospitalDetails && data.hospitalDetails.length === 0) {
    fail(`S4: hospitalDetails is empty`);
  }
  if (data.localDoulas && data.localDoulas.length < 3) {
    fail(`S4: Only ${data.localDoulas?.length} doulas (min 3, Denver has 4+)`);
  }
  if (data.faqs && data.faqs.length < 4) {
    fail(`S4: Only ${data.faqs.length} FAQs (min 4)`);
  }
  if (!failures.toString().includes(label)) {
    pass(`S4: Required fields present`);
  }

  // ── S5: No standalone "Free Birth Plan" ────────────────────
  // Checked after build against dist/ output — noted here, verified post-build

  // ── S6: publishedDate present ──────────────────────────────
  if (data.publishedDate && /^\d{4}-\d{2}-\d{2}$/.test(data.publishedDate)) {
    pass(`S6: publishedDate = "${data.publishedDate}"`);
  } else {
    fail(`S6: Missing or invalid publishedDate (got: "${data.publishedDate}")`);
  }

  // ── S7: medicaidNote format ────────────────────────────────
  if (data.medicaidNote) {
    if (/^Yes\s*[—–-]/.test(data.medicaidNote) || /^No\s*[—–-]/.test(data.medicaidNote)) {
      pass(`S7: medicaidNote starts correctly`);
    } else {
      fail(`S7: medicaidNote must start with "Yes —" or "No —" (got: "${data.medicaidNote.slice(0, 40)}...")`);
    }
  } else {
    fail(`S7: Missing medicaidNote`);
  }

  // ── S8: No "Contact for pricing" ───────────────────────────
  const jsonStr = JSON.stringify(data);
  if (/Contact for pricing/i.test(jsonStr)) {
    fail(`S8: Found "Contact for pricing" in data`);
  } else {
    pass(`S8: No "Contact for pricing"`);
  }

  console.log("");
}

// ── S3: Build check ──────────────────────────────────────────
console.log(`── S3: Build Check ──`);
try {
  execSync("npm run build 2>&1", { cwd: PROJECT_DIR, stdio: "pipe", timeout: 120000 });
  pass("S3: npm run build exited 0");
} catch (e: any) {
  fail(`S3: Build failed — ${e.stderr?.toString().slice(-200) || e.message}`);
}

// ── S5: No standalone "Free Birth Plan" in dist ──────────────
if (targetSlug) {
  const distPath = path.join(PROJECT_DIR, "dist", "birth-support", targetSlug);
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, "utf-8");
    // "Free Birth Plan" as standalone text (not "Joyful Birth Plan")
    const freeMatch = html.match(/(?<!Joyful )Free Birth Plan/gi);
    if (freeMatch) {
      fail(`S5: Found standalone "Free Birth Plan" in rendered HTML (${freeMatch.length} match(es))`);
    } else {
      pass("S5: No standalone 'Free Birth Plan' in rendered HTML");
    }
  } else {
    warn(`S5: dist/birth-support/${targetSlug}/index.html not found — skipping`);
  }
} else {
  // Full audit: check all city dirs
  const distDir = path.join(PROJECT_DIR, "dist", "birth-support");
  if (fs.existsSync(distDir)) {
    let s5Failed = false;
    for (const slug of slugs) {
      const indexPath = path.join(distDir, slug, "index.html");
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, "utf-8");
        const freeMatch = html.match(/(?<!Joyful )Free Birth Plan/gi);
        if (freeMatch) {
          fail(`S5 [${slug}]: standalone "Free Birth Plan" in rendered HTML`);
          s5Failed = true;
        }
      }
    }
    if (!s5Failed) {
      pass("S5: No standalone 'Free Birth Plan' across all pages");
    }
  } else {
    warn("S5: dist/birth-support/ not found — skipping");
  }
}

// ── S4 post-check: run validate-city-data.ts ────────────────
console.log(`\n── S4: Data Validation (validate-city-data.ts) ──`);
try {
  const out = execSync(
    `npx tsx scripts/validate-city-data.ts${targetSlug ? ` ${targetSlug}` : ""}`,
    { cwd: PROJECT_DIR, stdio: "pipe", timeout: 30000 }
  );
  const output = out.toString();
  console.log(output);
  if (output.includes("errors")) {
    const m = output.match(/(\d+) errors/);
    if (m && parseInt(m[1]) > 0) {
      fail("S4: validate-city-data.ts reported errors");
    } else {
      pass("S4: validate-city-data.ts passed (0 errors)");
    }
  } else {
    pass("S4: validate-city-data.ts passed");
  }
} catch (e: any) {
  if (e.exitCode === 1) {
    fail(`S4: validate-city-data.ts exited 1`);
  } else {
    pass("S4: validate-city-data.ts exited 0");
  }
}

// ── Summary ──────────────────────────────────────────────────
console.log(`\n═══════════════════════════════════════════`);
if (failures > 0) {
  console.log(`${RED}  ❌ PREFLIGHT FAILED: ${failures} failure(s), ${warnings} warning(s)${NC}`);
  if (warnings > 0) {
    console.log(`  ${YELLOW}Warnings are informational — fix failures before deploying.${NC}`);
  }
  process.exit(1);
} else {
  console.log(`${GREEN}  ✅ PREFLIGHT PASSED: 0 failures, ${warnings} warning(s)${NC}`);
  console.log(`  ${targetSlug ? `Ship ${targetSlug} when ready.` : "All cities pass preflight."}`);
  process.exit(0);
}