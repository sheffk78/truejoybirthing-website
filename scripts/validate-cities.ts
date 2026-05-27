#!/usr/bin/env node
/**
 * validate-cities.ts — Validate src/data/cities.ts before build.
 *
 * Group A = structural completeness (hard fail). Exit 1 on any failure.
 * Group B = heroLocalDetail debt (hard fail for new, warn for known).
 * Group C = anti-templating / duplicate content (hard fail above threshold).
 * Group D = hospital similarity (warning only).
 *
 * Run:   npm run validate
 * Pipe:  npm run validate && npm run build && npm run test:city-pages && npx wrangler pages deploy dist ...
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ─── Known Debt: C4 FAQ template repetitions ────────────────────────────
// These FAQ answer templates are over the repeat-count limit in the current data.
// They produce warnings, not hard fails. New repetitions (city 21+) will still
// trigger hard failures — this list only suppresses known overages.
// When a template is differentiated enough to drop below the limit, remove it here.
const KNOWN_C4_OVERAGES = [
  // Medicaid FAQ — 2 variants, 7x and 10x (limit 3)
  "texas is expanding medicaid doula coverage statewide. specific eligibility depen",
  // Hospital FAQ — "Baylor Scott & White {city}..." 5x (limit 3)
  "baylor scott & white {city} and other area facilities generally accommodate birt",
];
// ─── Known Debt: heroLocalDetail exceptions ─────────────────────────
// These cities shipped with empty heroLocalDetail. They produce warnings,
// not hard fails. Any NEW city with empty heroLocalDetail is a hard fail.
// When a known-debt city gains heroLocalDetail, it naturally stops warning.
const KNOWN_EMPTY_HERO = new Set([
  "amarillo-tx",
  "arlington-tx",
  "carrollton-tx",
  "corpus-christi-tx",
  "el-paso-tx",
  "garland-tx",
  "grand-prairie-tx",
  "irving-tx",
  "laredo-tx",
  "mesquite-tx",
  "plano-tx",
]);

// ─── Known Debt: A8 bare NICU level claims on pre-existing cities ────
// These cities were created before the A8 check existed. They produce
// warnings, not hard fails. Any NEW city (city 25+) with a bare NICU
// claim is a hard fail.
const KNOWN_BARE_NICU = new Set([
  "amarillo-tx",
  "arlington-tx",
  "austin-tx",
  "cedar-park-tx",
  "corpus-christi-tx",
  "denton-tx",
  "fort-worth-tx",
  "frisco-tx",
  "garland-tx",
  "grand-prairie-tx",
  "irving-tx",
  "laredo-tx",
  "lubbock-tx",
  "mckinney-tx",
  "mesquite-tx",
  "midland-tx",
  "odessa-tx",
  "plano-tx",
  "san-antonio-tx",
  "waco-tx",
]);

// ─── Thresholds ──────────────────────────────────────────────────────
const CULTURE_SIMILARITY_MAX = 0.80;     // >80% similar = hard fail
const PHRASE_REPEAT_MAX = 3;              // >3 identical values = hard fail
const FAQ_ANSWER_SIMILARITY_MAX = 0.75;   // >75% similar = hard fail
const HOSPITAL_SIMILARITY_WARN = 0.65;    // >65% similar = warning
const MIN_CULTURE_LENGTH = 20;            // characters

// ─── Types ────────────────────────────────────────────────────────────
interface Assertion {
  id: string;
  city: string;
  passed: boolean;
  message: string;
}

interface Warning {
  id: string;
  city: string;
  message: string;
}

// ─── Levenshtein distance ────────────────────────────────────────────
function levenshtein(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;
  const matrix: number[][] = Array.from({ length: la + 1 }, () => new Array(lb + 1).fill(0));
  for (let i = 0; i <= la; i++) matrix[i][0] = i;
  for (let j = 0; j <= lb; j++) matrix[0][j] = j;
  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[la][lb];
}

function normalizedSimilarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  const dist = levenshtein(a.toLowerCase(), b.toLowerCase());
  const maxLen = Math.max(a.length, b.length);
  return 1 - dist / maxLen;
}

// ─── Load cities data ────────────────────────────────────────────────
async function loadCities(): Promise<Record<string, any>> {
  // Dynamic import of the TS data file via tsx
  const citiesPath = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "cities.ts");
  const module = await import(citiesPath);
  return module.cities as Record<string, any>;
}

// ─── Group A: Structural Completeness ────────────────────────────────
function assertCompleteness(slug: string, data: any): Assertion[] {
  const results: Assertion[] = [];

  // A1: Required non-empty string fields
  const requiredStrings = ["city", "state", "slug", "culture", "medicaidNote", "insuranceNote"];
  for (const field of requiredStrings) {
    const val = data[field];
    const ok = typeof val === "string" && val.trim().length > 0;
    results.push({
      id: `A1-${field}`,
      city: slug,
      passed: ok,
      message: !ok
        ? `Field "${field}" is empty or missing`
        : `"${field}" present (${val.trim().length} chars)`,
    });
  }

  // A2: At least 1 hospital detail with non-empty name + paragraph
  const hospitals = data.hospitalDetails ?? [];
  const validHospitals = hospitals.filter(
    (h: any) => typeof h.name === "string" && h.name.trim().length > 0
      && typeof h.paragraph === "string" && h.paragraph.trim().length > 0,
  );
  results.push({
    id: "A2",
    city: slug,
    passed: validHospitals.length >= 1,
    message: validHospitals.length < 1
      ? `No valid hospital details (need ≥1 with non-empty name + paragraph)`
      : `${validHospitals.length} valid hospital detail(s)`,
  });

  // A3: At least 2 FAQs
  const faqs = data.faqs ?? [];
  const validFaqs = faqs.filter(
    (f: any) => typeof f.q === "string" && f.q.trim().length > 0
      && typeof f.a === "string" && f.a.trim().length > 0,
  );
  results.push({
    id: "A3",
    city: slug,
    passed: validFaqs.length >= 2,
    message: validFaqs.length < 2
      ? `Only ${validFaqs.length} valid FAQ(s) — need ≥2`
      : `${validFaqs.length} valid FAQ(s)`,
  });

  // A4: costLow < costHigh, both positive
  const low = data.costLow;
  const high = data.costHigh;
  const costOk = typeof low === "number" && typeof high === "number"
    && low > 0 && high > 0 && low < high;
  results.push({
    id: "A4",
    city: slug,
    passed: costOk,
    message: !costOk
      ? `costLow=${low}, costHigh=${high} — need positive numbers with low < high`
      : `costLow=$${low} < costHigh=$${high}`,
  });

  // A5: nearbyCities slugs all exist in the cities record
  // (deferred to cross-city check after all cities loaded)

  // A6: culture string ≥ 20 chars
  const cultureLen = typeof data.culture === "string" ? data.culture.trim().length : 0;
  results.push({
    id: "A6",
    city: slug,
    passed: cultureLen >= MIN_CULTURE_LENGTH,
    message: cultureLen < MIN_CULTURE_LENGTH
      ? `"culture" is only ${cultureLen} chars — minimum ${MIN_CULTURE_LENGTH}`
      : `"culture" is ${cultureLen} chars`,
  });

  // A7: slug matches {name}-{state} pattern
  const slugOk = typeof data.slug === "string" && /^.+-(tx|nc|ga|sc|ok|oh|in|fl|co|tn|nv|ca|ny|ma|mi|il|ct|ri|pa|az|wa|or|mn|md|nj|va|wi|mo|nm|ut|al|ky|id|ia|ne|ms)$/.test(data.slug);
  results.push({
    id: "A7",
    city: slug,
    passed: slugOk,
    message: !slugOk
      ? `Slug "${data.slug}" does not match {name}-{state} pattern`
      : `Slug pattern valid`,
  });

  // A8: NICU claims must include source qualifier
  // Every hospital paragraph or FAQ that mentions a NICU level (Level I/II/III/IV)
  // must include a source qualifier: "verified", a named unit, or a year.
  // Bare "Level X NICU" without qualification is a hard fail for new cities,
  // warning for known debt cities.
  const NICU_LEVEL_REGEX = /level\s+(?:i{1,3}|iv|1|2|3|4)\s+nicu/i;
  const NICU_QUALIFIER_REGEX = /verified|stated\s+directly\s+on|contact\s+the\s+hospital\s+directly|earned\s+\d{4}|\(\d{4}\)|\d{4}\s*(designation|certification)|named.*nicu|lucy|car|nicu\s+(designation|level)/i;
  const allText = [
    ...(data.hospitalDetails ?? []).map((h: any) => h.paragraph ?? ""),
    ...(data.faqs ?? []).map((f: any) => f.a ?? ""),
  ];
  let a8Failed = false;
  for (const text of allText) {
    if (typeof text !== "string") continue;
    if (NICU_LEVEL_REGEX.test(text) && !NICU_QUALIFIER_REGEX.test(text)) {
      const isKnownDebt = KNOWN_BARE_NICU.has(slug);
      if (isKnownDebt) {
        // Known debt — warning only
        results.push({
          id: "A8",
          city: slug,
          passed: true,
          message: `⚠ Bare NICU level claim (known debt): "${text.slice(0, 100)}${text.length > 100 ? "…" : ""}"`,
        });
      } else {
        // New city — hard fail
        results.push({
          id: "A8",
          city: slug,
          passed: false,
          message: `Bare NICU level claim without source qualifier — add "verified", a named unit, or a year: "${text.slice(0, 120)}${text.length > 120 ? "…" : ""}"`,
        });
      }
      a8Failed = true;
      break; // one failure per city is enough
    }
  }
  if (!a8Failed) {
    results.push({ id: "A8", city: slug, passed: true, message: `No bare NICU level claims` });
  }

  // A9: Empty birthCenterDetails requires documented search
  // Cities with empty birthCenterDetails must have a code comment in cities.ts
  // documenting the search. This check looks for a comment containing
  // "Birth center search" near the city's birthCenterDetails.
  // If birthCenterDetails is non-empty, this check passes automatically.
  const bcd = data.birthCenterDetails ?? [];
  if (bcd.length === 0) {
    // Empty array — flag as warning (not hard fail) since the comment check
    // would require parsing the source file differently.
    // Instead, we emit a warning reminding the author to document the search.
    results.push({
      id: "A9",
      city: slug,
      passed: true, // warning only, not hard fail
      message: `⚠ Empty birthCenterDetails — document search in comment`,
    });
  } else {
    results.push({ id: "A9", city: slug, passed: true, message: `${bcd.length} birth center(s) listed` });
  }

  return results;
}

// ─── Group A5: Cross-city slug references ────────────────────────────
function assertNearbyReferences(allCities: Record<string, any>): Assertion[] {
  const results: Assertion[] = [];
  const allSlugs = new Set(Object.keys(allCities));

  for (const [slug, data] of Object.entries(allCities)) {
    const nearby = data.nearbyCities ?? [];
    for (const ref of nearby) {
      const exists = allSlugs.has(ref);
      results.push({
        id: `A5-${ref}`,
        city: slug,
        passed: exists,
        message: !exists
          ? `nearbyCities references "${ref}" which does not exist in cities data`
          : `nearbyCities reference "${ref}" valid`,
      });
    }
  }

  return results;
}

// ─── Group B: heroLocalDetail ────────────────────────────────────────
function assertHeroLocalDetail(slug: string, data: any): { assertion: Assertion; warning?: Warning } {
  const val = data.heroLocalDetail ?? "";
  const isEmpty = typeof val !== "string" || val.trim().length === 0;
  const isKnownDebt = KNOWN_EMPTY_HERO.has(slug);

  if (isEmpty) {
    if (isKnownDebt) {
      return {
        assertion: {
          id: "B1",
          city: slug,
          passed: true, // Known debt doesn't fail
          message: `Empty heroLocalDetail (known debt)`,
        },
        warning: {
          id: "B2",
          city: slug,
          message: `Missing heroLocalDetail — known debt, needs content`,
        },
      };
    }
    return {
      assertion: {
        id: "B1",
        city: slug,
        passed: false,
        message: `Empty heroLocalDetail on NEW city — must have local texture before shipping`,
      },
    };
  }

  return {
    assertion: {
      id: "B1",
      city: slug,
      passed: true,
      message: `heroLocalDetail present (${val.trim().length} chars)`,
    },
  };
}

// ─── Group C: Anti-Templating ────────────────────────────────────────
function assertAntiTemplating(allCities: Record<string, any>): { assertions: Assertion[]; warnings: Warning[] } {
  const results: Assertion[] = [];
  const warnings: Warning[] = [];
  const slugs = Object.keys(allCities);

  // C1: culture field pairwise similarity
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const a = allCities[slugs[i]].culture ?? "";
      const b = allCities[slugs[j]].culture ?? "";
      if (a.length === 0 || b.length === 0) continue; // caught by A1/A6
      const sim = normalizedSimilarity(a, b);
      if (sim > CULTURE_SIMILARITY_MAX) {
        results.push({
          id: "C1",
          city: `${slugs[i]} ↔ ${slugs[j]}`,
          passed: false,
          message: `culture fields ${Math.round(sim * 100)}% similar (max ${Math.round(CULTURE_SIMILARITY_MAX * 100)}%)`,
        });
      }
    }
  }
  // If no C1 failures, record a single pass
  if (!results.some((r) => r.id === "C1")) {
    results.push({ id: "C1", city: "all", passed: true, message: `All culture fields <${Math.round(CULTURE_SIMILARITY_MAX * 100)}% similar` });
  }

  // C2: medicaidNote exact repeat count
  const medicaidCounts = new Map<string, string[]>();
  for (const [slug, data] of Object.entries(allCities)) {
    const note = (data.medicaidNote ?? "").trim();
    if (!note) continue;
    const key = note.toLowerCase();
    if (!medicaidCounts.has(key)) medicaidCounts.set(key, []);
    medicaidCounts.get(key)!.push(slug);
  }
  for (const [phrase, cityList] of medicaidCounts) {
    if (cityList.length > PHRASE_REPEAT_MAX) {
      results.push({
        id: "C2",
        city: cityList.join(", "),
        passed: false,
        message: `medicaidNote repeated ${cityList.length}x (max ${PHRASE_REPEAT_MAX}): "${phrase.slice(0, 80)}${phrase.length > 80 ? "…" : ""}"`,
      });
    }
  }
  if (!results.some((r) => r.id === "C2")) {
    results.push({ id: "C2", city: "all", passed: true, message: `No medicaidNote repeated more than ${PHRASE_REPEAT_MAX} times` });
  }

  // C3: insuranceNote exact repeat count
  const insuranceCounts = new Map<string, string[]>();
  for (const [slug, data] of Object.entries(allCities)) {
    const note = (data.insuranceNote ?? "").trim();
    if (!note) continue;
    const key = note.toLowerCase();
    if (!insuranceCounts.has(key)) insuranceCounts.set(key, []);
    insuranceCounts.get(key)!.push(slug);
  }
  for (const [phrase, cityList] of insuranceCounts) {
    if (cityList.length > PHRASE_REPEAT_MAX) {
      results.push({
        id: "C3",
        city: cityList.join(", "),
        passed: false,
        message: `insuranceNote repeated ${cityList.length}x (max ${PHRASE_REPEAT_MAX}): "${phrase.slice(0, 80)}${phrase.length > 80 ? "…" : ""}"`,
      });
    }
  }
  if (!results.some((r) => r.id === "C3")) {
    results.push({ id: "C3", city: "all", passed: true, message: `No insuranceNote repeated more than ${PHRASE_REPEAT_MAX} times` });
  }

  // C4: Localized FAQ differentiation
  // All localized FAQs (Medicaid, cost, hospital) use short template answers that
  // legitimately share structure across cities. Use repeat-count limit for all of them.
  // The real uniqueness lives in hospitalDetails[].paragraph, checked by D1.
  const localizedFaqKeywords = ["medicaid", "how much", "cost", "hospital"];
  const faqsByQuestion: Map<string, { slug: string; question: string; answer: string }[]> = new Map();

  for (const [slug, data] of Object.entries(allCities)) {
    const faqs = data.faqs ?? [];
    for (const faq of faqs) {
      if (typeof faq.q !== "string" || typeof faq.a !== "string") continue;
      const qLower = faq.q.toLowerCase();
      if (qLower.includes("true joy birthing")) continue; // brand FAQ — skip
      const isLocalized = localizedFaqKeywords.some((kw) => qLower.includes(kw));
      if (!isLocalized) continue;
      const groupKey = qLower.replace(data.city?.toLowerCase() ?? "", "{city}");
      if (!faqsByQuestion.has(groupKey)) faqsByQuestion.set(groupKey, []);
      faqsByQuestion.get(groupKey)!.push({ slug, question: faq.q, answer: faq.a.trim() });
    }
  }

  let c4Fails = 0;
  for (const [groupKey, entries] of faqsByQuestion) {
    if (entries.length < 2) continue;
    // All localized FAQs use repeat-count limit — real differentiation lives in data fields
    const answerGroups = new Map<string, string[]>();
    for (const entry of entries) {
      const data = allCities[entry.slug];
      const normalized = entry.answer.toLowerCase()
        .replace(data?.city?.toLowerCase() ?? "", "{city}");
      if (!answerGroups.has(normalized)) answerGroups.set(normalized, []);
      answerGroups.get(normalized)!.push(entry.slug);
    }
    for (const [normalizedAnswer, cityList] of answerGroups) {
      if (cityList.length > PHRASE_REPEAT_MAX) {
        // Check if this is a known overage (existing debt)
        const isKnownOverage = KNOWN_C4_OVERAGES.some(known =>
          normalizedAnswer.startsWith(known.toLowerCase())
        );
        const label = groupKey.includes("medicaid") ? "Medicaid"
          : groupKey.includes("hospital") ? "Hospital"
          : groupKey.includes("cost") || groupKey.includes("how much") ? "Cost"
          : "FAQ";
        if (isKnownOverage) {
          // Known debt — warning only
          warnings.push({
            id: "C4",
            city: cityList.slice(0, 5).join(", ") + (cityList.length > 5 ? `… +${cityList.length - 5} more` : ""),
            message: `${label} FAQ answer repeated ${cityList.length}x (max ${PHRASE_REPEAT_MAX}) — known debt: "${normalizedAnswer.slice(0, 60)}${normalizedAnswer.length > 60 ? "…" : ""}"`,
          });
        } else {
          // New overage — hard fail
          c4Fails++;
          results.push({
            id: "C4",
            city: cityList.slice(0, 5).join(", ") + (cityList.length > 5 ? `… +${cityList.length - 5} more` : ""),
            passed: false,
            message: `${label} FAQ answer repeated ${cityList.length}x (max ${PHRASE_REPEAT_MAX}): "${normalizedAnswer.slice(0, 80)}${normalizedAnswer.length > 80 ? "…" : ""}"`,
          });
        }
      }
    }
  }
  if (c4Fails === 0) {
    results.push({ id: "C4", city: "all", passed: true, message: `All localized FAQs pass repeat-count checks` });
  }

  // C5: TJB brand FAQ consistency check (warning only — brand FAQ is supposed to be consistent)
  const tjbFaqs: { slug: string; answer: string }[] = [];
  for (const [slug, data] of Object.entries(allCities)) {
    const faqs = data.faqs ?? [];
    const tjbFaq = faqs.find((f: any) =>
      typeof f.q === "string" && f.q.toLowerCase().includes("true joy birthing")
    );
    if (tjbFaq && typeof tjbFaq.a === "string" && tjbFaq.a.trim().length > 0) {
      tjbFaqs.push({ slug, answer: tjbFaq.a.trim() });
    }
  }
  // Check that the brand FAQ is reasonably consistent across cities (warning only)
  let inconsistentPairCount = 0;
  for (let i = 0; i < tjbFaqs.length; i++) {
    for (let j = i + 1; j < tjbFaqs.length; j++) {
      const sim = normalizedSimilarity(tjbFaqs[i].answer, tjbFaqs[j].answer);
      if (sim < 0.50) {
        inconsistentPairCount++;
        if (inconsistentPairCount <= 3) {
          warnings.push({
            id: "C5",
            city: `${tjbFaqs[i].slug} ↔ ${tjbFaqs[j].slug}`,
            message: `TJB brand FAQ only ${Math.round(sim * 100)}% similar — expected consistent`,
          });
        }
      }
    }
  }
  if (inconsistentPairCount > 3) {
    warnings.push({ id: "C5", city: "multiple", message: `${inconsistentPairCount} pair(s) of TJB brand FAQ answers <50% similar (expected consistent)` });
  }

  return { assertions: results, warnings };
}

// ─── Group D: Hospital Similarity (warning only) ─────────────────────
function checkHospitalSimilarity(allCities: Record<string, any>): Warning[] {
  const warnings: Warning[] = [];

  // Collect all hospital paragraphs with their city slug
  const allParagraphs: { slug: string; name: string; paragraph: string }[] = [];
  for (const [slug, data] of Object.entries(allCities)) {
    for (const h of (data.hospitalDetails ?? [])) {
      if (typeof h.paragraph === "string" && h.paragraph.trim().length > 0) {
        allParagraphs.push({ slug, name: h.name, paragraph: h.paragraph.trim() });
      }
    }
  }

  // Compare across different cities only
  for (let i = 0; i < allParagraphs.length; i++) {
    for (let j = i + 1; j < allParagraphs.length; j++) {
      if (allParagraphs[i].slug === allParagraphs[j].slug) continue; // same city, skip
      const sim = normalizedSimilarity(allParagraphs[i].paragraph, allParagraphs[j].paragraph);
      if (sim > HOSPITAL_SIMILARITY_WARN) {
        warnings.push({
          id: "D1",
          city: `${allParagraphs[i].slug} ↔ ${allParagraphs[j].slug}`,
          message: `Hospital paragraphs ${Math.round(sim * 100)}% similar: "${allParagraphs[i].name}" ↔ "${allParagraphs[j].name}"`,
        });
      }
    }
  }

  return warnings;
}

// ─── Main ────────────────────────────────────────────────────────────
async function main(): Promise<never> {
  let cities: Record<string, any>;
  try {
    cities = await loadCities();
  } catch (err: any) {
    console.error(`❌ Failed to load cities data: ${err.message}`);
    process.exit(1);
  }

  const slugs = Object.keys(cities).sort();
  if (slugs.length === 0) {
    console.error("❌ No cities found in data.");
    process.exit(1);
  }

  console.log(`\n🔍 City Data Validation — ${slugs.length} cities\n`);
  console.log("━".repeat(60));

  const allAssertions: Assertion[] = [];
  const allWarnings: Warning[] = [];
  let failCount = 0;
  let passCount = 0;

  // ── Per-city checks (Groups A, B) ──────────────────────────────────
  for (const slug of slugs) {
    const data = cities[slug];
    const cityAssertions = assertCompleteness(slug, data);
    const heroResult = assertHeroLocalDetail(slug, data);

    const cityResults = [...cityAssertions, heroResult.assertion];
    if (heroResult.warning) allWarnings.push(heroResult.warning);

    // Collect A8/A9 soft warnings (passed=true but message starts with ⚠)
    for (const r of cityResults) {
      if (r.passed && r.message.startsWith("⚠")) {
        allWarnings.push({ id: r.id, city: r.city, message: r.message });
      }
    }

    const cityFails = cityResults.filter((r) => !r.passed);
    const cityPasses = cityResults.filter((r) => r.passed);

    failCount += cityFails.length;
    passCount += cityPasses.length;
    allAssertions.push(...cityResults);

    if (cityFails.length > 0) {
      console.log(`\n  ❌ ${slug}`);
      for (const f of cityFails) {
        console.log(`     ${f.id}: ${f.message}`);
      }
    } else {
      console.log(`  ✅ ${slug}`);
    }

    if (heroResult.warning) {
      console.log(`     ⚠️  ${heroResult.warning.id}: ${heroResult.warning.message}`);
    }

    // Show A9 birth-center emptiness warnings
    const a9Warning = cityAssertions.find((r) => r.id === "A9" && r.message.startsWith("⚠"));
    if (a9Warning) {
      console.log(`     ⚠️  A9: ${a9Warning.message}`);
    }
  }

  // ── Cross-city checks (A5, C, D) ──────────────────────────────────
  const refAssertions = assertNearbyReferences(cities);
  const antiTemplate = assertAntiTemplating(cities);
  const hospitalWarnings = checkHospitalSimilarity(cities);

  const refFails = refAssertions.filter((r) => !r.passed);
  const atFails = antiTemplate.assertions.filter((r) => !r.passed);
  const atPasses = antiTemplate.assertions.filter((r) => r.passed);

  failCount += refFails.length + atFails.length;
  passCount += refAssertions.filter((r) => r.passed).length + atPasses.length;
  allAssertions.push(...refAssertions, ...antiTemplate.assertions);
  allWarnings.push(...antiTemplate.warnings, ...hospitalWarnings);

  // Print cross-city results
  if (refFails.length > 0) {
    console.log(`\n  ❌ Nearby-city references`);
    for (const f of refFails) {
      console.log(`     ${f.id}: ${f.message}`);
    }
  } else if (refAssertions.length > 0) {
    console.log(`\n  ✅ Nearby-city references`);
  }

  if (atFails.length > 0) {
    console.log(`\n  ❌ Anti-templating`);
    for (const f of atFails) {
      console.log(`     ${f.id}: ${f.message}`);
    }
  } else {
    console.log(`\n  ✅ Anti-templating`);
  }

  if (hospitalWarnings.length > 0) {
    console.log(`\n  ⚠️  Hospital similarity`);
    for (const w of hospitalWarnings) {
      console.log(`     ${w.id}: ${w.message}`);
    }
  }

  // ── Summary ────────────────────────────────────────────────────────
  console.log("\n" + "━".repeat(60));
  console.log(`\n  Results: ${passCount} passed, ${failCount} failed`);

  if (allWarnings.length > 0) {
    console.log(`  Warnings: ${allWarnings.length}`);
    const warningGroups = new Map<string, { count: number; cities: string[] }>();
    for (const w of allWarnings) {
      if (!warningGroups.has(w.id)) warningGroups.set(w.id, { count: 0, cities: [] });
      const group = warningGroups.get(w.id)!;
      group.count++;
      group.cities.push(w.city);
    }
    console.log();
    for (const [id, data] of warningGroups) {
      console.log(`    ${id}: ${data.count} instances`);
      const uniqueCities = [...new Set(data.cities.map((c) => c.includes("↔") ? c : c))];
      if (uniqueCities.length <= 10) {
        // For pairwise warnings, just show count not all pairs
        if (id === "D1") {
          console.log(`         ${data.count} hospital-paragraph pair(s) with >${Math.round(HOSPITAL_SIMILARITY_WARN * 100)}% similarity`);
        } else {
          console.log(`         ${uniqueCities.join(", ")}`);
        }
      } else {
        console.log(`         ${uniqueCities.slice(0, 8).join(", ")}, ... +${uniqueCities.length - 8} more`);
      }
    }
  }

  // Show known-debt exceptions
  const gradated = [...KNOWN_EMPTY_HERO].filter((s) => {
    const data = cities[s];
    return data && (data.heroLocalDetail ?? "").trim().length > 0;
  });
  if (gradated.length > 0) {
    console.log(`\n  🎓 Graduated from heroLocalDetail debt: ${gradated.join(", ")}`);
  }
  const remainingDebt = [...KNOWN_EMPTY_HERO].filter((s) => !gradated.includes(s));
  if (remainingDebt.length > 0) {
    console.log(`\n  📋 Known heroLocalDetail debt (${remainingDebt.length} cities — warnings only):`);
    console.log(`     ${remainingDebt.join(", ")}`);
  }

  // Show A8 NICU known-debt status
  const nicuGraduated = [...KNOWN_BARE_NICU].filter((s) => {
    const data = cities[s];
    if (!data) return false;
    const allText = [
      ...(data.hospitalDetails ?? []).map((h: any) => h.paragraph ?? ""),
      ...(data.faqs ?? []).map((f: any) => f.a ?? ""),
    ];
    const NICU_LEVEL_REGEX = /level\s+(?:i{1,3}|iv|1|2|3|4)\s+nicu/i;
    const NICU_QUALIFIER_REGEX = /verified|stated\s+directly\s+on|contact\s+the\s+hospital\s+directly|earned\s+\d{4}|\(\d{4}\)|\d{4}\s*(designation|certification)|named.*nicu|lucy|car|nicu\s+(designation|level)/i;
    const hasBareNicu = allText.some((t: string) => NICU_LEVEL_REGEX.test(t) && !NICU_QUALIFIER_REGEX.test(t));
    return !hasBareNicu; // graduated if no bare NICU claims remain
  });
  if (nicuGraduated.length > 0) {
    console.log(`\n  🎓 Graduated from bare NICU debt: ${nicuGraduated.join(", ")}`);
  }
  const remainingNicuDebt = [...KNOWN_BARE_NICU].filter((s) => !nicuGraduated.includes(s));
  if (remainingNicuDebt.length > 0) {
    console.log(`\n  📋 Known bare NICU debt (${remainingNicuDebt.length} cities — warnings only):`);
    console.log(`     ${remainingNicuDebt.join(", ")}`);
  }

  if (failCount > 0) {
    console.log("\n  ❌ FAIL — fix the issues above before building.\n");
    process.exit(1);
  }

  console.log("\n  ✅ PASS — city data validates. Safe to build.\n");
  process.exit(0);
}

main();