#!/usr/bin/env node
/**
 * validate-xrefs.ts — Cross-reference validation for all city slug references.
 *
 * Ensures every slug referenced in city-links.ts, video-embeds.ts,
 * cities.ts nearbyCities, and hardcoded href attributes in .astro/.md/.ts
 * files actually exists as a key in cities.ts.
 *
 * This catches the class of bug where a city slug is referenced but never
 * built (e.g., denver-co, dallas-tx, houston-tx, jacksonville-fl, tampa-fl).
 *
 * Run:   npx tsx scripts/validate-xrefs.ts
 * Pipe:  npm run validate:xrefs && npm run build && ...
 * Wire:  Called from validate-cities.ts main() so `npm run validate` covers it.
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_DIR = join(__dirname, "..");
const SRC_DIR = join(PROJECT_DIR, "src");

interface XrefViolation {
  source: string;
  slug: string;
  context: string;
}

async function loadCities(): Promise<Set<string>> {
  const citiesPath = join(SRC_DIR, "data", "cities.ts");
  const module = await import(citiesPath);
  return new Set(Object.keys(module.cities));
}

async function loadFile(relPath: string): Promise<string> {
  const fullPath = join(PROJECT_DIR, relPath);
  try {
    return await readFile(fullPath, "utf-8");
  } catch {
    return "";
  }
}

// Slug pattern: lowercase letters/digits with hyphens, ending in 2-letter state code
// Handles multi-hyphen slugs: el-paso-tx, fort-worth-tx, san-antonio-tx, new-york-ny, etc.
const SLUG_RE = /[a-z][a-z0-9]+(?:-[a-z0-9]+)*-[a-z]{2}/g;

// Extract all slug-like strings from city-links.ts
function extractSlugsFromCityLinks(content: string): string[] {
  const slugs: string[] = [];
  // Match quoted strings that look like city slugs
  const re = /"([a-z][a-z0-9]+(?:-[a-z0-9]+)*-[a-z]{2})"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    slugs.push(m[1]);
  }
  return slugs;
}

// Extract slug keys from video-embeds.ts
function extractSlugsFromVideoEmbeds(content: string): string[] {
  const slugs: string[] = [];
  // Match "slug": "city-st" patterns
  const re = /"slug":\s*"([a-z][a-z0-9]+(?:-[a-z0-9]+)*-[a-z]{2})"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    slugs.push(m[1]);
  }
  return slugs;
}

// Extract nearbyCities references from cities.ts
function extractNearbyCities(content: string): { source: string; refs: string[] }[] {
  const results: { source: string; refs: string[] }[] = [];
  // Match nearbyCities: ["slug-1", "slug-2", ...]
  const re = /"([a-z][a-z0-9-]+)":\s*\{[^}]*?nearbyCities:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const citySlug = m[1];
    const refsStr = m[2];
    const refs = [...refsStr.matchAll(/"([a-z][a-z0-9]+(?:-[a-z0-9]+)*-[a-z]{2})"/g)].map(r => r[1]);
    results.push({ source: citySlug, refs });
  }
  return results;
}

// Extract /birth-support/{slug}/ href references from source files
function extractHrefSlugs(content: string): string[] {
  const slugs: string[] = [];
  const re = /\/birth-support\/([a-z][a-z0-9]+(?:-[a-z0-9]+)*-[a-z]{2})\/?/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    slugs.push(m[1]);
  }
  return slugs;
}

// Recursively find all .astro, .md, .ts files under src/
async function findSourceFiles(dir: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await findSourceFiles(fullPath, files);
    } else {
      const ext = extname(entry.name);
      if (ext === ".astro" || ext === ".md" || ext === ".ts") {
        // Skip the data files themselves (handled separately)
        if (entry.name === "cities.ts" || entry.name === "city-links.ts" || entry.name === "video-embeds.ts") continue;
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function main(): Promise<void> {
  const knownSlugs = await loadCities();
  const violations: XrefViolation[] = [];

  // 1. Check city-links.ts
  const cityLinksContent = await loadFile("src/data/city-links.ts");
  if (cityLinksContent) {
    const slugs = extractSlugsFromCityLinks(cityLinksContent);
    for (const slug of [...new Set(slugs)]) {
      if (!knownSlugs.has(slug)) {
        violations.push({ source: "src/data/city-links.ts", slug, context: "slug reference" });
      }
    }
  }

  // 2. Check video-embeds.ts
  const videoEmbedsContent = await loadFile("src/data/video-embeds.ts");
  if (videoEmbedsContent) {
    const slugs = extractSlugsFromVideoEmbeds(videoEmbedsContent);
    for (const slug of [...new Set(slugs)]) {
      if (!knownSlugs.has(slug)) {
        violations.push({ source: "src/data/video-embeds.ts", slug, context: "slug reference" });
      }
    }
  }

  // 3. Check nearbyCities in cities.ts
  const citiesContent = await loadFile("src/data/cities.ts");
  if (citiesContent) {
    const nearbyRefs = extractNearbyCities(citiesContent);
    for (const { source, refs } of nearbyRefs) {
      for (const ref of refs) {
        if (!knownSlugs.has(ref)) {
          violations.push({ source: `src/data/cities.ts (${source}.nearbyCities)`, slug: ref, context: "nearbyCities reference" });
        }
      }
    }
  }

  // 4. Check hardcoded href attributes in source files
  const sourceFiles = await findSourceFiles(SRC_DIR);
  for (const filePath of sourceFiles) {
    const content = await readFile(filePath, "utf-8");
    const hrefSlugs = extractHrefSlugs(content);
    for (const slug of [...new Set(hrefSlugs)]) {
      if (!knownSlugs.has(slug)) {
        const relPath = filePath.replace(PROJECT_DIR + "/", "");
        violations.push({ source: relPath, slug, context: "href=/birth-support/{slug}/" });
      }
    }
  }

  // Report
  if (violations.length === 0) {
    console.log("  ✅ Cross-reference validation passed — all slug references resolve to existing cities.");
    process.exit(0);
  }

  console.error(`  ❌ Cross-reference validation FAILED — ${violations.length} dangling reference(s):\n`);
  const bySlug = new Map<string, XrefViolation[]>();
  for (const v of violations) {
    if (!bySlug.has(v.slug)) bySlug.set(v.slug, []);
    bySlug.get(v.slug)!.push(v);
  }
  for (const [slug, entries] of [...bySlug.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.error(`  /birth-support/${slug}/ — referenced in ${entries.length} place(s):`);
    for (const e of entries.slice(0, 5)) {
      console.error(`    ${e.source} (${e.context})`);
    }
    if (entries.length > 5) {
      console.error(`    ... +${entries.length - 5} more`);
    }
  }
  console.error("\n  Fix: Replace the dangling slug with an existing city from the same state,");
  console.error("  or add the city to cities.ts, or add a redirect in _redirects.\n");
  process.exit(1);
}

main();