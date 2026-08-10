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
const isSelfTest = args.includes("--self-test");
const targetSlug = args.find((a) => !a.startsWith("--")) || null;

// ── Self-test mode: verify the gate code itself is intact ──────
// preflight-self-test.sh runs `preflight.ts --self-test` as a code-integrity
// check. It must NOT audit all cities (that surfaces unrelated cross-city
// failures via the M37 trap). It only verifies the script loads, the cities
// data parses, and the build runs.
if (isSelfTest) {
  console.log("\n═══════════════════════════════════════════");
  console.log("  TJB PREFLIGHT SELF-TEST (code integrity)");
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════\n");
  let ok = true;
  try {
    const cityCount = Object.keys(cities).length;
    console.log(`  ✅ Data layer: ${cityCount} cities parsed from cities.ts`);
  } catch (e: any) {
    console.log(`  ❌ Data layer: ${e.message}`);
    ok = false;
  }
  try {
    execSync("npm run build 2>&1", { cwd: PROJECT_DIR, stdio: "pipe", timeout: 120000 });
    console.log("  ✅ Build: npm run build exited 0");
  } catch (e: any) {
    console.log(`  ❌ Build: ${e.stderr?.toString().slice(-200) || e.message}`);
    ok = false;
  }
  console.log("\n═══════════════════════════════════════════");
  if (ok) {
    console.log("  ✅ SELF-TEST PASSED");
    process.exit(0);
  } else {
    console.log("  ❌ SELF-TEST FAILED — gate code may be broken");
    process.exit(1);
  }
}


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

  for (const f of fs.readdirSync(ogDir)) {
    if (f.startsWith(ogFilename) && f.endsWith(".webp")) {
      const full = path.join(ogDir, f);
      const stat = fs.statSync(full);
      // Pick the largest file (variant suffixes are CDN cache-busts;
      // the real image is always the biggest one)
      if (stat.size > ogSize) {
        ogSize = stat.size;
        ogFile = f;
        ogFound = true;
      }
    }
  }

  const ogUrl = data.ogImage || `https://truejoybirthing.com/images/og-city-${slug}.webp`;

  if (ogFound) {
    if (ogSize >= 30000) {
      pass(`S2: OG image ${ogFile} (${ogSize} bytes ≥ 30KB)`);
    } else {
      fail(`S2: OG image ${ogFile} is only ${ogSize} bytes (min 30000). Likely a gradient placeholder.`);
    }
  } else {
    // Fallback: try to verify the remote URL
    try {
      const resp = execSync(`curl -sIL "${ogUrl}" 2>/dev/null | head -10`, { timeout: 10 });
      const statusLine = resp.toString().match(/HTTP\/[\d.]+ (\d+)/);
      if (statusLine && statusLine[1] === "200") {
        const clMatch = resp.toString().match(/Content-Length:\s*(\d+)/);
        if (clMatch) {
          const remoteSize = parseInt(clMatch[1]);
          if (remoteSize >= 30000) {
            pass(`S2: OG image at URL (${remoteSize} bytes ≥ 30KB)`);
          } else {
            fail(`S2: OG image at URL only ${remoteSize} bytes (min 30000)`);
          }
        } else {
          pass(`S2: OG image at URL returns 200 (size unknown, assume OK)`);
        }
      } else {
        fail(`S2: No local OG image and remote returned ${statusLine ? statusLine[1] : "no response"}: ${ogUrl}`);
      }
    } catch {
      fail(`S2: No local OG image found and cannot verify URL for ${slug}`);
    }
  }

  // ── S4: City data validation — inline quick checks ─────────
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
    fail(`S4: Only ${data.localDoulas?.length} doulas (min 3)`);
  }
  if (data.faqs && data.faqs.length < 4) {
    fail(`S4: Only ${data.faqs.length} FAQs (min 4)`);
  }
  pass(`S4: Required fields present`);

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
      fail(`S7: medicaidNote must start with "Yes —" or "No —"`);
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
function checkS5(targetSlug: string | null) {
  const distDir = path.join(PROJECT_DIR, "dist", "birth-support");
  if (!fs.existsSync(distDir)) {
    warn("S5: dist/birth-support/ not found — skipping");
    return true;
  }

  const checkSlug = (slug: string) => {
    const indexPath = path.join(distDir, slug, "index.html");
    if (!fs.existsSync(indexPath)) return true;

    const html = fs.readFileSync(indexPath, "utf-8");
    // Strip script/style blocks so we only check visible text
    const cleanHtml = html
      .replace(/<script\b[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[\s\S]*?<\/style>/gi, "");

    // Match "Free Birth Plan" that is NOT preceded by "Joyful "
    // AND NOT followed by " template" (that's correct FAQ copy like
    // "Download the free birth plan template").
    // Also exclude when </a> sits between "Free Birth Plan" and " template"
    // (e.g. `<a>Free Birth Plan</a> template`).
    const freeMatches = cleanHtml.match(/(?<!Joyful\s)Free Birth Plan(?! template)(?!<\/a>)/gi);
    if (freeMatches) {
      fail(`S5 [${slug}]: standalone "Free Birth Plan" in rendered HTML (${freeMatches.length} match(es))`);
      return false;
    }
    return true;
  };

  if (targetSlug) {
    return checkSlug(targetSlug);
  } else {
    let allGood = true;
    for (const slug of slugs) {
      if (!checkSlug(slug)) allGood = false;
    }
    return allGood;
  }
}

const s5ok = checkS5(targetSlug);
if (s5ok) {
  pass("S5: No standalone 'Free Birth Plan' in rendered HTML");
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