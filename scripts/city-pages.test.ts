#!/usr/bin/env node
/**
 * city-pages.test.ts — Validate built city pages for schema, accessibility, and content.
 *
 * Groups A–D = hard failures (exit 1). Group E = warnings (exit 0).
 * Run: npm run test:city-pages
 * Pipeline: npm run build && npm run test:city-pages && npx wrangler pages deploy dist ...
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse } from "node-html-parser";

// ─── Config ──────────────────────────────────────────────────────────
const DIST = join(import.meta.dirname ?? ".", "..", "dist");
const CITY_DIR = join(DIST, "birth-support");

// Banned phrases — case-insensitive regex patterns checked against visible text.
// These must be service-claim phrasing, NOT conditional/disclaimer usage.
// "Find a Doula in" as an H1 or prominent heading implies we offer that service.
// "If you do find a doula in [city]" is a conditional disclaimer — NOT banned.
const BANNED_PHRASES = [
  "Your Doula in",
  "we're local",
  "our local team",
  "proudly serving",
];

// Banned H1 text patterns (checked against H1 element only)
const BANNED_H1_PHRASES = [
  /^Find a Doula in/i,
];

// ─── Types ───────────────────────────────────────────────────────────
interface AssertionResult {
  id: string;
  city: string;
  passed: boolean;
  message: string;
}

interface WarningResult {
  id: string;
  city: string;
  message: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────
function getCitySlugs(): string[] {
  if (!existsSync(CITY_DIR)) return [];
  return readdirSync(CITY_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function loadPage(slug: string): { html: string; doc: ReturnType<typeof parse> } | null {
  const filePath = join(CITY_DIR, slug, "index.html");
  if (!existsSync(filePath)) return null;
  const html = readFileSync(filePath, "utf-8");
  const doc = parse(html);
  return { html, doc };
}

function extractJsonLd(doc: ReturnType<typeof parse>): Record<string, unknown>[] {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  const results: Record<string, unknown>[] = [];
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent || "{}");
      // Handle both single objects and objects with @graph arrays
      if (data["@graph"]) {
        results.push(...(data["@graph"] as Record<string, unknown>[]));
      } else {
        results.push(data);
      }
    } catch {
      // Skip malformed JSON-LD
    }
  }
  return results;
}

function stripTags(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Group A: Schema Assertions ──────────────────────────────────────
function assertSchema(slug: string, doc: ReturnType<typeof parse>, html: string): AssertionResult[] {
  const results: AssertionResult[] = [];
  const jsonLd = extractJsonLd(doc);
  const serviceEntry = jsonLd.find((e) => e["@type"] === "Service");
  const localBusinessEntry = jsonLd.find((e) => e["@type"] === "LocalBusiness");
  const postalAddressEntry = jsonLd.find((e) => e["@type"] === "PostalAddress");

  // A1: No LocalBusiness schema
  results.push({
    id: "A1",
    city: slug,
    passed: !localBusinessEntry,
    message: localBusinessEntry
      ? `Found @type: "LocalBusiness" in JSON-LD — must be "Service" instead`
      : "No LocalBusiness schema (correct)",
  });

  // A2: No PostalAddress
  results.push({
    id: "A2",
    city: slug,
    passed: !postalAddressEntry,
    message: postalAddressEntry
      ? `Found @type: "PostalAddress" in JSON-LD — city pages must not claim a physical address`
      : "No PostalAddress (correct)",
  });

  // A3: Service entry with areaServed exists
  results.push({
    id: "A3",
    city: slug,
    passed: !!(serviceEntry && serviceEntry["areaServed"]),
    message: !serviceEntry
      ? `Missing @type: "Service" in JSON-LD`
      : !serviceEntry["areaServed"]
        ? `Service entry exists but missing "areaServed"`
        : `Service entry with areaServed present (correct)`,
  });

  // A4: Provider references correct org
  const providerOrParent = serviceEntry?.["provider"] ?? serviceEntry?.["parentOrganization"];
  const orgId = providerOrParent && typeof providerOrParent === "object"
    ? (providerOrParent as Record<string, string>)["@id"]
    : typeof providerOrParent === "string"
      ? providerOrParent
      : undefined;
  results.push({
    id: "A4",
    city: slug,
    passed: orgId === "https://truejoybirthing.com/#organization",
    message: orgId !== "https://truejoybirthing.com/#organization"
      ? `Service provider @id is "${orgId}" — expected "https://truejoybirthing.com/#organization"`
      : "Service provider references correct org (correct)",
  });

  return results;
}

// ─── Group B: No Fake-Local Language ─────────────────────────────────
function assertNoFakeLocal(slug: string, html: string, doc: ReturnType<typeof parse>): AssertionResult[] {
  const results: AssertionResult[] = [];
  const visibleText = stripTags(html);

  // B-general: Check each banned phrase against full visible text
  for (const phrase of BANNED_PHRASES) {
    const regex = new RegExp(phrase, "i");
    const match = visibleText.match(regex);
    results.push({
      id: `B-${phrase.replace(/\s+/g, "-")}`,
      city: slug,
      passed: !match,
      message: match
        ? `Found banned phrase "${phrase}" in visible text`
        : `No banned phrase "${phrase}" (correct)`,
    });
  }

  // B-H1: Check H1 element for banned heading patterns
  const h1 = doc.querySelector("h1");
  const h1Text = h1?.textContent?.trim() ?? "";
  for (const pattern of BANNED_H1_PHRASES) {
    const match = pattern.test(h1Text);
    results.push({
      id: `B-H1-${pattern.source.replace(/[^a-z]/gi, "-")}`,
      city: slug,
      passed: !match,
      message: match
        ? `H1 contains banned pattern "${pattern.source}": "${h1Text}"`
        : `H1 is clean of pattern "${pattern.source}" (correct)`,
    });
  }

  // B-extra: Check raw JSON-LD string for LocalBusiness
  const localBizInRaw = html.includes('"LocalBusiness"');
  results.push({
    id: "B-LocalBusiness-raw",
    city: slug,
    passed: !localBizInRaw,
    message: localBizInRaw
      ? `Found literal "LocalBusiness" in raw HTML JSON-LD block`
      : 'No "LocalBusiness" in raw HTML (correct)',
  });

  return results;
}

// ─── Group C: Accessibility — Button Contrast ────────────────────────
function assertButtonContrast(slug: string, doc: ReturnType<typeof parse>): AssertionResult[] {
  const results: AssertionResult[] = [];

  // All links and buttons
  const interactiveEls = [...doc.querySelectorAll("a"), ...doc.querySelectorAll("button")];

  // C1: No hover:bg-tjb-rose-600 on any link/button
  const rose600HoverEls = interactiveEls.filter((el) => {
    const cls = el.getAttribute("class") ?? "";
    return cls.includes("hover:bg-tjb-rose-600");
  });
  results.push({
    id: "C1",
    city: slug,
    passed: rose600HoverEls.length === 0,
    message: rose600HoverEls.length > 0
      ? `Found ${rose600HoverEls.length} element(s) with hover:bg-tjb-rose-600 (fails WCAG AA). Examples: ${rose600HoverEls.slice(0, 3).map((el) => `<${el.tagName} class="${el.getAttribute("class")?.slice(0, 80)}">`).join(", ")}`
      : "No hover:bg-tjb-rose-600 on interactive elements (correct)",
  });

  // C2: No bg-tjb-rose-600 without a hover override (static bg = contrast fail)
  const rose600StaticEls = interactiveEls.filter((el) => {
    const cls = el.getAttribute("class") ?? "";
    const hasBgRose600 = cls.includes("bg-tjb-rose-600");
    const hasHoverOverride = cls.includes("hover:bg-");
    return hasBgRose600 && !hasHoverOverride;
  });
  results.push({
    id: "C2",
    city: slug,
    passed: rose600StaticEls.length === 0,
    message: rose600StaticEls.length > 0
      ? `Found ${rose600StaticEls.length} element(s) with bg-tjb-rose-600 and no hover override (static contrast fail). Examples: ${rose600StaticEls.slice(0, 3).map((el) => `<${el.tagName} class="${el.getAttribute("class")?.slice(0, 80)}">`).join(", ")}`
      : "No static bg-tjb-rose-600 without hover override (correct)",
  });

  return results;
}

// ─── Group D: Completeness ───────────────────────────────────────────
// ─── Group F: SEO + LLM Readability ─────────────────────────────────
function assertCompleteness(slug: string, doc: ReturnType<typeof parse>, html: string): AssertionResult[] {
  const results: AssertionResult[] = [];
  const cityDisplayName = slug.replace(/-tx$/, "").replace(/-/g, " ");

  // D1: At least 1 hospital detail (look for hospital paragraph content)
  const hospitalH2 = doc.querySelector('h2');
  const allH2s = doc.querySelectorAll("h2");
  const hasHospitalSection = [...allH2s].some((h) =>
    h.textContent?.includes("What Birth Support Looks Like")
  );
  // Check there's actual hospital paragraph content after the heading
  const hospitalParagraphs = [...allH2s].find((h) =>
    h.textContent?.includes("What Birth Support Looks Like")
  )?.nextElementSibling;
  // More robust: check for hospital name links or paragraphs mentioning hospitals
  const hasHospitalContent = html.includes("/birth-plan-template/") && hasHospitalSection;

  results.push({
    id: "D1",
    city: slug,
    passed: hasHospitalContent,
    message: !hasHospitalContent
      ? `Missing hospital detail section or content`
      : "Hospital detail section present (correct)",
  });

  // D2: At least 2 FAQ items
  const faqSection = doc.querySelectorAll('section[class*="bg-tjb-cream-50"] h3, section .space-y-6 h3');
  const faqH3s = doc.querySelectorAll("h3");
  const faqCount = [...faqH3s].filter((h) => {
    const parent = h.closest(".border");
    return parent?.classList.contains("border-tjb-lavender-200") ||
           parent?.getAttribute("class")?.includes("border");
  }).length;
  // Fallback: count h3 elements inside faq-adjacent containers
  const directFaqs = html.match(/<h3[^>]*class="text-lg font-semibold mb-2"[^>]*>/g)?.length ?? 0;

  results.push({
    id: "D2",
    city: slug,
    passed: directFaqs >= 2,
    message: directFaqs < 2
      ? `Only ${directFaqs} FAQ item(s) — need at least 2`
      : `${directFaqs} FAQ items present (correct)`,
  });

  // D3: H1 is non-empty and contains city name
  const h1 = doc.querySelector("h1");
  const h1Text = h1?.textContent?.trim() ?? "";
  const cityInH1 = h1Text.toLowerCase().includes(cityDisplayName.toLowerCase());

  results.push({
    id: "D3",
    city: slug,
    passed: h1Text.length > 0 && cityInH1,
    message: !h1Text
      ? `Missing H1 entirely`
      : !cityInH1
        ? `H1 "${h1Text}" does not contain city name "${cityDisplayName}"`
        : `H1 contains city name (correct)`,
  });

  // D4: Meta description contains "birth-plan resources" or "Birth Plan Resources"
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
  const hasCorrectMeta = /birth.plan resources/i.test(metaDesc);

  results.push({
    id: "D4",
    city: slug,
    passed: hasCorrectMeta,
    message: !metaDesc
      ? `Missing meta description`
      : !hasCorrectMeta
        ? `Meta description does not contain availability language: "${metaDesc.slice(0, 100)}"`
        : `Meta description uses availability language (correct)`,
  });

  return results;
}

// ─── Group E: Known Debt Warnings ────────────────────────────────────
function checkWarnings(slug: string, doc: ReturnType<typeof parse>): WarningResult[] {
  const warnings: WarningResult[] = [];

  // E1: heroLocalDetail — check if the hero paragraph after H1 has only the standard
  // intro text with no extra local detail paragraph
  const h1 = doc.querySelector("h1");
  const heroParagraphs: string[] = [];
  if (h1) {
    let sibling = h1.nextElementSibling;
    while (sibling) {
      if (sibling.tagName === "DIV") break; // hit the button row
      if (sibling.tagName === "P") heroParagraphs.push(sibling.textContent?.trim() ?? "");
      sibling = sibling.nextElementSibling;
    }
  }
  // If only 1 paragraph after H1 (the standard intro), there's no heroLocalDetail
  const hasLocalDetail = heroParagraphs.length >= 2;
  if (!hasLocalDetail) {
    warnings.push({
      id: "E1",
      city: slug,
      message: `Missing heroLocalDetail — hero section has ${heroParagraphs.length} paragraph(s), expected 2 (intro + local texture)`,
    });
  }

  // E2: "Next Steps" H2 present
  const allH2s = [...doc.querySelectorAll("h2")];
  const hasNextSteps = allH2s.some((h) =>
    h.textContent?.includes("Next Steps") ?? false
  );
  if (!hasNextSteps) {
    warnings.push({
      id: "E2",
      city: slug,
      message: `Missing "Next Steps" H2 section`,
    });
  }

  return warnings;
}

// ─── Group F: SEO + LLM Readability ─────────────────────────────────
// F2, F4, F5, F7, F8 are HARD FAILURES (template implements them as of Sprint 1).
// F1, F3, F9a, F9b, F9e are WARNINGS (template doesn't implement them yet — Sprint 2).

function assertSeoLlm(slug: string, doc: ReturnType<typeof parse>, html: string, jsonLd: Record<string, unknown>[]): { assertions: AssertionResult[]; warnings: WarningResult[] } {
  const results: AssertionResult[] = [];
  const warnings: WarningResult[] = [];
  const cityDisplayName = slug.replace(/-tx$/, "").replace(/-/g, " ");

  // F1: WebPage schema with datePublished or dateModified (WARNING — Sprint 2)
  const webPageEntry = jsonLd.find((e) => {
    const type = e["@type"];
    return type === "WebPage" || (Array.isArray(type) && type.includes("WebPage"));
  });
  const hasDatePublished = webPageEntry && typeof (webPageEntry as Record<string, unknown>)["datePublished"] === "string";
  const hasDateModified = webPageEntry && typeof (webPageEntry as Record<string, unknown>)["dateModified"] === "string";
  if (!(hasDatePublished || hasDateModified)) {
    warnings.push({ id: "F1", city: slug, message: `SEO: No WebPage schema with datePublished/dateModified — freshness signal missing` });
  } else {
    results.push({ id: "F1", city: slug, passed: true, message: `WebPage schema with date(s) present (correct)` });
  }

  // F2: Service schema has image property (HARD FAILURE — Sprint 1)
  const serviceEntry = jsonLd.find((e) => e["@type"] === "Service");
  const serviceImage = serviceEntry && (serviceEntry as Record<string, unknown>)["image"];
  results.push({
    id: "F2",
    city: slug,
    passed: !!serviceImage,
    message: !serviceImage
      ? `Service schema missing "image" property — required for rich results`
      : `Service schema has "image" property (correct)`,
  });

  // F3: Visible breadcrumb <nav> element (WARNING — Sprint 2)
  const breadcrumbNav = doc.querySelector('nav[aria-label="Breadcrumb"], nav[aria-label="breadcrumb"], nav.breadcrumb, [data-breadcrumb]');
  if (!breadcrumbNav) {
    warnings.push({ id: "F3", city: slug, message: `SEO: No visible breadcrumb <nav> — schema-only breadcrumb is not enough` });
  } else {
    results.push({ id: "F3", city: slug, passed: true, message: `Visible breadcrumb nav present (correct)` });
  }

  // F4: Author attribution line (HARD FAILURE — Sprint 1, reviewer byline only, no date)
  const visibleText = stripTags(html);
  const hasAuthorAttribution = /reviewed by/i.test(visibleText);
  results.push({
    id: "F4",
    city: slug,
    passed: hasAuthorAttribution,
    message: !hasAuthorAttribution
      ? `No "Reviewed by" attribution line found — E-E-A-T signal missing`
      : `"Reviewed by" attribution line found (correct)`,
  });

  // F5: FAQ items have id attributes for deep-linking (HARD FAILURE — Sprint 1)
  const faqH3s = doc.querySelectorAll("h3");
  const faqIds = [...faqH3s].filter((h) => {
    const id = h.getAttribute("id") ?? "";
    return id.startsWith("faq-");
  });
  results.push({
    id: "F5",
    city: slug,
    passed: faqIds.length >= 2,
    message: faqIds.length < 2
      ? `Only ${faqIds.length} FAQ items with id="faq-*" anchors — need at least 2 for deep-linking`
      : `${faqIds.length} FAQ items with id="faq-*" anchors (correct)`,
  });

  // F7: Hospital section H2 heading (HARD FAILURE — Sprint 1)
  const allH2s = [...doc.querySelectorAll("h2")];
  const hospitalH2 = allH2s.find((h) =>
    /hospital|birth (center|support)/i.test(h.textContent ?? "")
  );
  results.push({
    id: "F7",
    city: slug,
    passed: !!hospitalH2,
    message: !hospitalH2
      ? `No H2 heading for hospital/birth center section — heading hierarchy gap`
      : `Hospital/birth center H2 heading: "${hospitalH2.textContent?.trim().slice(0, 60)}" (correct)`,
  });

  // F8: SpeakableSpecification in JSON-LD (HARD FAILURE — Sprint 1)
  const hasSpeakable = jsonLd.some((e) => e["@type"] === "SpeakableSpecification");
  results.push({
    id: "F8",
    city: slug,
    passed: hasSpeakable,
    message: !hasSpeakable
      ? `No SpeakableSpecification schema — voice/LLM extraction signal missing`
      : `SpeakableSpecification schema present (correct)`,
  });

  // F9a: og:locale (WARNING — Sprint 2)
  const ogLocale = doc.querySelector('meta[property="og:locale"]');
  if (!ogLocale || ogLocale.getAttribute("content") !== "en_US") {
    warnings.push({ id: "F9a", city: slug, message: !ogLocale ? `SEO: Missing og:locale meta tag` : `SEO: og:locale is "${ogLocale.getAttribute("content")}" — expected "en_US"` });
  } else {
    results.push({ id: "F9a", city: slug, passed: true, message: `og:locale = en_US (correct)` });
  }

  // F9b: og:type = article (WARNING — Sprint 2)
  const ogType = doc.querySelector('meta[property="og:type"]');
  const ogTypeContent = ogType?.getAttribute("content") ?? "";
  if (ogTypeContent !== "article") {
    warnings.push({ id: "F9b", city: slug, message: `SEO: og:type is "${ogTypeContent}" — expected "article" for city pages` });
  } else {
    results.push({ id: "F9b", city: slug, passed: true, message: `og:type = article (correct)` });
  }

  // F9e: twitter:site (WARNING — Sprint 2)
  const twitterSite = doc.querySelector('meta[name="twitter:site"]');
  if (!twitterSite) {
    warnings.push({ id: "F9e", city: slug, message: `SEO: Missing twitter:site meta tag` });
  } else {
    results.push({ id: "F9e", city: slug, passed: true, message: `twitter:site present (correct)` });
  }

  return { assertions: results, warnings };
}

// ─── Main ────────────────────────────────────────────────────────────
function main(): never {
  const slugs = getCitySlugs();

  if (slugs.length === 0) {
    console.error("❌ No city pages found in dist/birth-support/");
    console.error("   Run `npm run build` first.");
    process.exit(1);
  }

  console.log(`\n🔍 City Page Validation — ${slugs.length} pages\n`);
  console.log("━".repeat(60));

  const allResults: AssertionResult[] = [];
  const allWarnings: WarningResult[] = [];
  let failCount = 0;
  let passCount = 0;

  for (const slug of slugs) {
    const page = loadPage(slug);
    if (!page) {
      console.error(`  ⚠️  Could not load dist/birth-support/${slug}/index.html — skipping`);
      continue;
    }

    const { html, doc } = page;

    // Run all assertion groups
    const schemaResults = assertSchema(slug, doc, html);
    const fakeLocalResults = assertNoFakeLocal(slug, html, doc);
    const contrastResults = assertButtonContrast(slug, doc);
    const completenessResults = assertCompleteness(slug, doc, html);
    const seoLlmResults = assertSeoLlm(slug, doc, html, extractJsonLd(doc));
    const warnings = checkWarnings(slug, doc);

    const cityResults = [
      ...schemaResults,
      ...fakeLocalResults,
      ...contrastResults,
      ...completenessResults,
      ...seoLlmResults.assertions,
    ];
    allWarnings.push(...seoLlmResults.warnings);

    const cityFails = cityResults.filter((r) => !r.passed);
    const cityPasses = cityResults.filter((r) => r.passed);

    failCount += cityFails.length;
    passCount += cityPasses.length;
    allResults.push(...cityResults);
    allWarnings.push(...warnings);

    // Print per-city summary
    if (cityFails.length > 0) {
      console.log(`\n  ❌ ${slug}`);
      for (const f of cityFails) {
        console.log(`     ${f.id}: ${f.message}`);
      }
    } else {
      console.log(`  ✅ ${slug}`);
    }

    if (warnings.length > 0) {
      for (const w of warnings) {
        console.log(`     ⚠️  ${w.id}: ${w.message}`);
      }
    }
  }

  // ─── Summary ─────────────────────────────────────────────────────
  console.log("\n" + "━".repeat(60));
  console.log(`\n  Results: ${passCount} passed, ${failCount} failed`);

  if (allWarnings.length > 0) {
    console.log(`  Warnings: ${allWarnings.length}`);
    // Group warnings by ID for summary
    const warningGroups = new Map<string, { count: number; cities: string[] }>();
    for (const w of allWarnings) {
      if (!warningGroups.has(w.id)) warningGroups.set(w.id, { count: 0, cities: [] });
      const group = warningGroups.get(w.id)!;
      group.count++;
      group.cities.push(w.city);
    }
    console.log();
    for (const [id, data] of warningGroups) {
      console.log(`    ${id}: ${data.count} cities missing`);
      if (data.cities.length <= 10) {
        console.log(`         ${data.cities.join(", ")}`);
      } else {
        console.log(`         ${data.cities.slice(0, 8).join(", ")}, ... +${data.cities.length - 8} more`);
      }
    }
  }

  if (failCount > 0) {
    console.log("\n  ❌ FAIL — fix the issues above before deploying.\n");
    process.exit(1);
  }

  console.log("\n  ✅ PASS — all city pages validate. Safe to deploy.\n");
  process.exit(0);
}

main();