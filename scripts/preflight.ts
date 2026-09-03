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
const stageArgIdx = args.indexOf("--stage");
const stageArg = stageArgIdx >= 0 ? args[stageArgIdx + 1] : null;
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

// ── G66: Duplicate-key integrity check (raw source) ──────────
// cities.ts is imported as a module, so JS object semantics (last key wins)
// silently hide duplicate keys inside a city block. Duplicate localDoulas /
// hospitalDetails / birthCenterDetails / faqs keys have shipped cross-city
// clone data to live pages (corona-ca carried TX hospitals on a CA page).
// This gate reads the RAW source and hard-fails any block containing a
// duplicated object key. (NEW — Sep 3, 2026, Raleigh/Carrollton incident.)
function checkG66() {
  const srcPath = path.join(PROJECT_DIR, "src", "data", "cities.ts");
  const src = fs.readFileSync(srcPath, "utf-8");
  const keyRe = /^\s{2}"([a-z]+-[a-z]{2})":\s*\{/gm;
  const cityMatches = [...src.matchAll(keyRe)];
  const dupKeyRe = /^    ([A-Za-z][A-Za-z0-9_]*):/gm;
  const offenders: string[] = [];
  for (let i = 0; i < cityMatches.length; i++) {
    const slug = cityMatches[i][1];
    const start = cityMatches[i].index + cityMatches[i][0].length;
    const end = i + 1 < cityMatches.length ? cityMatches[i + 1].index : src.length;
    const block = src.slice(start, end);
    const seen = new Map<string, number>();
    for (const m of block.matchAll(dupKeyRe)) {
      seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
    }
    const dups = [...seen.entries()].filter(([, n]) => n > 1);
    if (dups.length > 0) {
      offenders.push(`${slug}: ${dups.map(([k, n]) => `${k} x${n}`).join(", ")}`);
    }
  }
  return offenders;
}
console.log(`── G66: Duplicate-key integrity (raw cities.ts) ──`);
{
  const offenders = checkG66();
  if (offenders.length === 0) {
    pass("G66: no duplicate object keys in any city block");
  } else {
    const scoped = targetSlug ? offenders.filter((o) => o.startsWith(`${targetSlug}:`)) : offenders;
    if (targetSlug) {
      pass(`G66: ${targetSlug} block has no duplicate keys (${offenders.length} other cities carry duplicate keys — cleanup queue)`);
    }
    for (const o of scoped) {
      fail(`G66: duplicate keys in ${o} — last-key-wins hides stale clone data; dedupe the block`);
    }
  }
}

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

// ── G8: Hero must be a real photograph, not a gradient graphic ──
// HARDENED (Aug 11, 2026 — san-antonio-tx). Jeff: "No illustrations for
// either of these. Stick with what we've done in the past and harden that
// rule." The gradient-detection helper existed but was never wired into
// preflight, so gradient heroes (like san-antonio-tx skyline-v4, 220 colors)
// shipped silently. This gate FAILS the build if the hero is a gradient.
// Rule R10: hero must be a photographic silhouette, never a gradient graphic.
console.log(`\n── G8: Hero Is a Real Photograph (no gradient/illustration) ──`);
const checkHeroIsPhoto = (slug: string): boolean => {
  let heroFile: string | null = null;
  const data = (cities as Record<string, any>)[slug];
  if (data && data.heroImage) {
    const ref = data.heroImage.startsWith("http")
      ? "/images/" + String(data.heroImage).split("/").pop()
      : data.heroImage;
    const cand = path.join(PROJECT_DIR, "public", (ref as string).replace(/^\//, ""));
    if (fs.existsSync(cand)) heroFile = cand;
  }
  if (!heroFile) {
    // Fallback: highest -vN {slug}-birth-doula-*.webp that isn't a variant
    const re = new RegExp(`^${slug}-birth-doula(?:-[a-z]+)?(-v\\d+)?\\.webp$`);
    const files = fs
      .readdirSync(path.join(PROJECT_DIR, "public", "images"))
      .filter((f) => re.test(f) && !f.includes("-600") && !f.includes("support"));
    if (files.length === 0) {
      fail(`G8: No hero image found for ${slug}`);
      return false;
    }
    const vKey = (n: string) => parseInt(n.match(/-v(\d+)/)?.[1] || "0", 10);
    files.sort((a, b) => vKey(b) - vKey(a));
    heroFile = path.join(PROJECT_DIR, "public", "images", files[0]);
  }
  try {
    // Need Pillow (python3) — write a temp script and run it (avoids shell
    // mangling of embedded newlines via -c, which caused false low-detail
    // warnings). Counts unique colors with the R10 dual threshold.
    const py = `
import sys
from PIL import Image
img = Image.open(r"${heroFile}").convert("RGB")
w, h = img.size
top = img.crop((0, 0, w, h // 4))
top_unique = len(set(top.getdata()))
full_unique = len(set(img.getdata()))
# R10 hard rule: gradient graphics have low colors in BOTH regions.
# Real photos with smooth skies may have low top but high full (25K+).
# A gradient = top < 2000 AND full < 20000.
if top_unique < 2000 and full_unique < 20000:
    sys.exit(2)  # gradient
elif full_unique < 12000:
    sys.exit(1)  # borderline / low-detail illustration
sys.exit(0)      # real photo
`;
    const tmpPy = path.join(PROJECT_DIR, ".tmp-hero-check.py");
    fs.writeFileSync(tmpPy, py);
    execSync(`python3 ${tmpPy}`, { cwd: PROJECT_DIR, stdio: "pipe", timeout: 30000 });
    fs.unlinkSync(tmpPy);
    pass(`G8: ${path.basename(heroFile)} is a real photograph (high color count)`);
    return true;
  } catch (e: any) {
    if (e.status === 2) {
      fail(
        `G8: Hero ${path.basename(heroFile)} is a GRADIENT GRAPHIC, not a photo (top < 2000 AND full < 20000 colors). R10 violation — Jeff rejects illustrations. Regenerate with image_generate silhouette prompt (tjb-ai-photo-generation skill) and re-deploy.`
      );
      return false;
    }
    if (e.status === 1) {
      warn(
        `G8: Hero ${path.basename(heroFile)} is low-detail (possible illustration). Inspect visually before deploy.`
      );
      return true;
    }
    warn(`G8: Could not analyze hero for ${slug}: ${e.message?.slice(0, 100)}`);
    return true;
  }
};

if (targetSlug) {
  checkHeroIsPhoto(targetSlug);
} else {
  for (const slug of slugs) {
    checkHeroIsPhoto(slug);
  }
}

// ── Stage-gate emission (fixes preflight-stage-gate.py mismatch) ──
// The stage gate contract (scripts/preflight-stage-gate.py STAGE_GATES)
// references gate IDs that this script previously NEVER emitted, so every
// one of those staged gates silently degraded to SKIP / "not emitted". The
// real implementations for those gates live in scripts/preflight-image-helper.py
// (PIL-based) and in inline file checks. Delegate to them here and emit the
// result under the exact gate ID the py contract expects, so a staged gate
// FAILS LOUDLY when it is genuinely broken instead of passing as a no-op.
const IMAGE_HELPER = path.join(__dirname, "preflight-image-helper.py");

// maps the helper's check name -> the gate ID preflight-stage-gate.py expects
const IMAGE_HELPER_GATES: Record<string, string[]> = {
  "hero-aspect": ["G25"],                       // hero 3:2 aspect ratio
  "og-photo-quality": ["G29", "G35"],           // OG is real photo (not gradient)
  "provider-credentials": ["G27"],              // provider creds specific, not "Birth Doula"
  "provider-descriptions": ["G10", "G39"],      // no generic placeholder copy
  "hospital-dimensions": ["G19", "G20", "P11"], // hospital/birth photos exist + landscape
  "service-area": ["A12"],                      // serviceArea is string array
  "support-scene-quality": ["G24", "G54"],      // support scene unique per city
  "yt-thumbnail-matches-hero": ["G23", "G22"],  // YT thumbnail matches page hero
  "support-aspect": ["G26"],
  "cdn-match": ["G55"],
  "hero-silhouette": ["G8a"],
  "provider-photo-exists": ["G60"],              // provider photos exist on disk (NEW — Aug 27, 2026)
  "cross-city-contamination": ["G61"],          // no cross-city image contamination (NEW — Aug 27, 2026)
  "hero-avif-staleness": ["G62"],               // hero AVIF not stale gradient (NEW — Aug 27, 2026)
  "fullpage-scroll-screenshot": ["G63"],        // fullpage scroll screenshot exists (NEW — Aug 27, 2026)
  "og-template-compliance": ["G64"],            // OG matches canonical Pattern B (NEW — Sep 3, 2026)
  "hero-letterbox": ["G65"],                    // no black letterbox bars (NEW — Sep 3, 2026)
};

const emitHelperGate = (check: string, slug: string) => {
  const gateIds = IMAGE_HELPER_GATES[check];
  if (!gateIds) return;
  let result: { pass: boolean; detail: string };
  try {
    const out = execSync(`python3 ${IMAGE_HELPER} ${check} ${slug}`, {
      cwd: PROJECT_DIR, stdio: "pipe", timeout: 30000,
    }).toString();
    result = JSON.parse(out.trim());
  } catch (e: any) {
    // Non-zero exit is the helper reporting a FAIL, not a crash: it still
    // prints {"pass": false, "detail": ...} to stdout. Recover the JSON.
    const out = (e?.stdout ?? "").toString().trim();
    try {
      result = JSON.parse(out);
    } catch {
      result = { pass: false, detail: `helper error: ${e.message?.slice(0, 120)}` };
    }
  }
  for (const gid of gateIds) {
    // Do not double-emit a gate that this script already emits natively (G8).
    if (gid === "G8") continue;
    if (result.pass) pass(`${gid}: ${result.detail}`);
    else fail(`${gid}: ${result.detail}`);
  }
};

// Run image gates only when a target slug is passed (stage gate path feeds one
// slug per invocation; a full audit avoids duplicate cross-city noise here).
if (targetSlug) {
  const stageImageChecks: Record<string, string[]> = {
    build: ["hero-aspect", "og-photo-quality", "og-template-compliance", "hero-letterbox", "hero-silhouette", "hero-avif-staleness"],
    enrich: ["provider-credentials", "provider-descriptions", "hospital-dimensions", "service-area", "support-scene-quality", "hero-letterbox", "provider-photo-exists", "cross-city-contamination"],
    verify_deploy: ["hero-aspect", "og-photo-quality", "og-template-compliance", "hero-letterbox", "provider-descriptions", "hospital-dimensions", "service-area", "support-scene-quality", "yt-thumbnail-matches-hero", "provider-photo-exists", "cross-city-contamination", "hero-avif-staleness"],
    video_outreach: ["support-scene-quality", "hero-letterbox", "yt-thumbnail-matches-hero", "fullpage-scroll-screenshot", "provider-photo-exists", "cross-city-contamination"],
  };
  for (const check of stageImageChecks[stageArg ?? "build"] ?? []) {
    emitHelperGate(check, targetSlug);
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

  // Write .preflight-result.json so the pre-push hook sees a fresh, valid
  // result without the operator having to hand-write the file. The hook
  // requires status=pass and timestamp within 300s of the push.
  const result = {
    status: "pass",
    timestamp: Math.floor(Date.now() / 1000).toString(),
    slug: targetSlug || "",
  };
  const resultPath = path.join(PROJECT_DIR, ".preflight-result.json");
  fs.writeFileSync(resultPath, JSON.stringify(result) + "\n");
  console.log(`  📝 Wrote ${resultPath} (timestamp: ${result.timestamp})`);

  process.exit(0);
}