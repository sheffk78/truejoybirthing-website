# True Joy Birthing — City Location Page Spec

**System:** `[city].astro` + `cities.ts` — single template, data-driven  
**Scope:** All `/birth-support/{slug}/` pages  
**Last updated:** May 2026

---

## 1. Data Model

Each city is a single object in `src/data/cities.ts`. No static `.astro` files — all 20+ cities render from one template via `getStaticPaths()`.

```typescript
interface CityData {
  city: string;              // "Dallas" — display name, no state abbrev
  state: string;             // "TX" — always two-letter
  slug: string;              // "dallas-tx" — kebab-case, state suffix required
  costLow: number;           // minimum doula cost (e.g., 900)
  costHigh: number;          // maximum doula cost (e.g., 2800)
  shelbiServesHere: boolean; // true for DFW-metro cities Shelbi covers in person
  culture: string;           // 1–3 sentences: birth community character, local context
  heroLocalDetail: string;   // 1–2 sentences: hyperlocal color (traffic tip, walking trail, etc.)
                              // empty string "" for non-DFW cities is OK
  hospitalDetails: HospitalDetail[];     // 1–3 hospitals, each with name + paragraph
  birthCenterDetails: BirthCenterDetail[]; // 0–2 birth centers, same shape
  medicaidNote: string;      // 1 sentence: current Medicaid doula coverage status
  insuranceNote: string;     // 1 sentence: private insurance doula coverage status
  faqs: FaqItem[];           // exactly 4 FAQ items, q + a
  nearbyCities: string[];    // slugs of 2–4 nearby cities (never include self)
}
```

**Required fields:** All of them. No optional fields — `birthCenterDetails` can be an empty array `[]`, but the key must exist.

---

## 2. Section Order

Every city page renders sections in this exact order. The template handles conditional logic — do not reorder.

| # | Section | Source | Notes |
|---|---|---|---|
| 1 | **Hero** | `city`, `state`, `heroLocalDetail`, hero image | H1: "Find a Doula in {city}, {state}" |
| 2 | **What Birth Support Looks Like** | `culture`, `hospitalDetails`, `birthCenterDetails` | Pillar link to `/benefits-of-a-doula/` is automatic |
| 3 | **Doula Costs in {city}** | `costLow`, `costHigh` | Pillar link to `/doula-cost/` and `/postpartum-doula/` are automatic |
| 4 | **Medicaid & Insurance Coverage** | `medicaidNote`, `insuranceNote` | HSA/FSA paragraph is template-generated. Pillar link to `/how-to-choose-a-doula/` is automatic |
| 5 | **Next Steps** | `shelbiServesHere` | Two variants: Shelbi badge + booking link vs. standard CTA. Pillar links to `/birth-plan-template/` and `/birth-plan-checklist/` are automatic |
| 6 | **TJBD Card** | Template-generated | "What True Joy Birthing Actually Does for You" — static, no data |
| 7 | **Nearby Cities** | `nearbyCities` | Pill links. Link to `/birth-support/` index is automatic |
| 8 | **FAQ** | `faqs` | H2: "Frequently Asked Questions — {city}" |
| 9 | **CTA Band** | Template-generated | Email capture form. Pillar link to `/doula-cost/` is automatic |

---

## 3. Target Length

| Section | Word Count | Notes |
|---|---|---|
| Hero (intro paragraph) | 30–50 | Including anchor link to `/what-is-a-doula/` |
| `heroLocalDetail` | 40–80 | Only for DFW-metro cities. Empty string for others |
| `culture` | 30–60 | 1–2 sentences max |
| Each `hospitalDetails` paragraph | 60–120 | Must include the hospital name in the sentence, local context, and a CTA link to `/birth-plan-template/` in at least one hospital per city |
| Each `birthCenterDetails` paragraph | 50–90 | Same standard as hospital paragraphs |
| Medicaid + Insurance | 40–60 total | Two short sentences |
| Each FAQ answer | 20–50 | Concise, factual, city-specific |
| **Total visible content** | **800–1,200 words** | Excluding nav, footer, CTA band |

---

## 4. CTA Rules

1. **Every hospital paragraph** must include at least one natural link to `/birth-plan-template/` (anchor text: "free birth plan template" or "free hospital birth plan template").
2. **Section links are template-generated** and must not be removed:
   - Hero intro → `/what-is-a-doula/`
   - Cost section → `/doula-cost/` and `/postpartum-doula/`
   - Insurance section → `/how-to-choose-a-doula/`
   - Next Steps → `/birth-plan-template/` and `/birth-plan-checklist/`
   - CTA band → `/doula-cost/`
3. **No duplicate CTAs.** The template already provides: hero CTA (Download + App), Next Steps CTA (Download + Course), and CTA band (email capture). Do not add additional conversion elements in the data.
4. **Shelbi cities** get an extra badge block inside Next Steps with a booking link to `/birth-plan-session`. This is template-controlled — do not add Shelbi references in the data for non-Shelbi cities.

---

## 5. Local-Detail Requirements

### `culture` (required)
- Must mention something specific about the birth community or hospital landscape in that city.
- **Do not** copy-paste across cities with just a name swap. Each city's culture paragraph should contain at least one specific, verifiable local detail.
- Bad: "Austin is a large, diverse city with many birth options."  
- Good: "Austin has a strong natural birth community centered around two freestanding birth centers and a growing midwifery network, alongside high-volume hospital systems."

### `heroLocalDetail` (DFW-metro cities only)
- Hyperlocal, practical detail: a traffic tip, a walking trail, a neighborhood reference.
- Must feel like it was written by someone who has driven to the hospital or walked the neighborhood.
- Empty string `""` for non-DFW cities.

### `hospitalDetails` (1–3 per city)
- **Name:** Official hospital name (verify against the hospital's website).
- **Paragraph structure:**
  1. Location/neighborhood reference (gives local credibility).
  2. What the hospital is known for (NICU level, volume, specialty).
  3. Doula/birth plan policy note (general — "doulas are generally welcome, though policies can shift").
  4. One practical tip or honest observation — something a local would say.
  5. CTA link to `/birth-plan-template/` in at least one hospital per city.
- First paragraph in the list should always contain the `/birth-plan-template/` link.
- Use HTML entities: `&amp;` for ampersands, `&#8212;` for em dashes.
- **Never** endorse a specific provider. Always include the disclaimer: "Hospitals mentioned for context only."

### `birthCenterDetails` (0–2 per city)
- Same paragraph structure as hospitals, minus NICU mention.
- If no birth centers exist, use an empty array `[]`.

### `faqs` (exactly 4)
- Required questions (use city name in each):
  1. "Does Medicaid cover doulas in {city}?"
  2. "Which {city} hospitals accommodate birth plans?" (or "Are there doulas in {city}?" for small cities)
  3. "How much does a doula cost in {city}?"
  4. "Does True Joy Birthing work with {city} families?"
- Answers must be city-specific — reference the city name, local cost range, and Shelbi availability.
- **Shelbi cities:** Q4 answer mentions Shelbi by name, confirms DFW-metro virtual support.
- **Non-Shelbi cities:** Q4 answer mentions the free app and virtual sessions, explicitly states Shelbi does not provide in-person services there.

### `nearbyCities` (2–4 slugs, never include self)
- DFW-metro cities: 2–4 nearby DFW cities.
- Major metros: 2–3 nearby cities (e.g., Austin → Houston, San Antonio).
- Peripheral cities: at least 1 nearby city, ideally 2.
- **Never** include the city's own slug.

---

## 6. Internal-Link Rules

### Links the template provides automatically
These are generated in `[city].astro` and must not be duplicated in the data:

- Hero → `/what-is-a-doula/`
- Cost section → `/doula-cost/`, `/postpartum-doula/`
- Insurance section → `/how-to-choose-a-doula/`
- Next Steps → `/birth-plan-template/`, `/birth-plan-checklist/`, `/birth-plan-course/`
- CTA band → `/doula-cost/`
- Nearby section → each nearby city page + `/birth-support/` index

### Links that must be authored in data
Only one link type is authored inside `cities.ts`:

- **Hospital/birth center paragraphs** → at least one `/birth-plan-template/` link per city (inside the first hospital paragraph)

### Cross-linking from pillar pages
Pillar pages link to the top 6 city pages (Dallas, Houston, Austin, San Antonio, Fort Worth, El Paso) plus the `/birth-support/` index. When adding a new city page:

1. If the city is a top-6 metro, add it to the city link section on all 6 pillar pages.
2. If not top-6, no pillar page changes needed — the city is discoverable via the `/birth-support/` index and nearby-city links.

### Anchor text rules
- **Each pillar page must use unique anchor text** targeting the same city. Never duplicate "Find a doula in [City]" across multiple pages.
  - `/doula-cost/`: cost-focused ("How much does a doula cost in Dallas?")
  - `/what-is-a-doula/`: directory-style ("Dallas doula directory")
  - `/benefits-of-a-doula/`: benefit-focused ("Doula support in Dallas")
  - `/how-to-choose-a-doula/`: action-oriented ("Find a doula in Dallas")
  - `/birth-plan-template/`: hospital-focused ("Dallas hospitals and doula costs")
  - `/postpartum-doula/`: postpartum-focused ("Postpartum doula support in Dallas")
- **City-to-pillar links** use natural anchor text generated by the template (no data authoring needed).

---

## 7. SEO & LLM Guidelines

### Page title
Template generates: `Doula {city} {state} — Birth Support, Costs & Free Joyful Birth Plan`

### Meta description
Template generates: `Find a doula in {city}, {state} — local hospital info, doula costs, Medicaid status, and the free Joyful Birth Plan for local families.`

### Canonical
Template generates: `https://truejoybirthing.com/birth-support/{slug}`

### H1
Template generates: `Find a Doula in {city}, {state}`

### JSON-LD (template-generated, no data authoring needed)
- **FAQPage**: 4 questions, one per `faqs` entry. Questions and answers must match visible `<h3>` + `<p>` text exactly.
- **LocalBusiness**: Minimal schema — `name`, `url`, `address` (city, state, country only), `areaServed` (City), `parentOrganization`. No `streetAddress`, `telephone`, `geo`, or `hasMap` required for this service-area business.
- **BreadcrumbList**: Home → Birth Support → {City}, {state}

### Sitemap
Auto-generated by `@astrojs/sitemap`. No manual action needed.

### LLM-crawlable content rules
- Every fact in the page must be verifiable: hospital names, NICU levels, cost ranges, Medicaid status.
- **Do not** fabricate hospital details, birth center names, or doula pricing.
- `culture` and `heroLocalDetail` should sound like a knowledgeable local wrote them — specific streets, neighborhoods, traffic patterns — not like an SEO template.
- FAQ answers must be factual and city-specific, not generic copy that could apply to any city.
- The `<h3>` FAQ headings must exactly match the `faqs[].q` field in `cities.ts`.

---

## 8. Hero Image

- **File path:** `/images/{city-name}-texas-birth-doula-skyline.webp`
- **Naming convention:** `{slug-without-tx-suffix}-texas-birth-doula-skyline.webp`  
  e.g., `slug: "dallas-tx"` → filename: `dallas-texas-birth-doula-skyline.webp`
- **Size:** 1200×800px minimum, WebP format
- **Content:** City skyline or recognizable landmark, warm/neutral tone
- **Alt text template** generates: `Skyline of {city}, Texas, where families search for birth doulas and plan their hospital births.`
- **Adding a new city:** Create the image file and place it at `/images/`. The template references it automatically.

---

## 9. Adding a New City — Author Checklist

Before a new city page goes live, verify every item:

- [ ] **`cities.ts` entry complete** — all required fields populated, no empty strings (except `heroLocalDetail` for non-DFW cities)
- [ ] **`slug` format correct** — `{city-name}-tx`, kebab-case
- [ ] **`nearbyCities`** — 2–4 slugs, no self-reference, no broken slugs
- [ ] **Cost range** — `costLow` and `costHigh` are realistic for the city ($100–$300 spread minimum, matching local market)
- [ ] **Hospital names verified** — official name matches the hospital's website
- [ ] **At least one hospital paragraph** contains `/birth-plan-template/` link in HTML
- [ ] **4 FAQs** — all 4 required questions present, city name in each, Shelbi availability accurate
- [ ] **`shelbiServesHere`** — `true` only for DFW-metro cities Shelbi actually covers in person
- [ ] **`culture` paragraph** — contains at least one specific, verifiable local detail (not generic)
- [ ] **Hero image created** — `{city-name}-texas-birth-doula-skyline.webp` at `/images/`
- [ ] **No duplicate slugs** — verify `slug` is unique within `cities.ts`
- [ ] **Build passes** — `npx astro build` completes with 0 errors
- [ ] **Visual spot-check** — load the built page, verify hero image loads, FAQ section renders, nearby cities display
- [ ] **SEO spot-check** — `<title>`, `<h1>`, canonical, FAQPage schema all contain the correct city name
- [ ] **`/birth-support/` index updated** — add the city to the `cities` array in `birth-support/index.astro` (lines 6–27)
- [ ] **Pillar pages updated** — only if top-6 metro; add to the city-link section of all 6 pillar pages with unique anchor text per page

---

## 10. File Locations

| File | Purpose |
|---|---|
| `src/data/cities.ts` | Single source of truth for all city data |
| `src/pages/birth-support/[city].astro` | Template — renders all city pages |
| `src/pages/birth-support/index.astro` | City index — lists all cities with links |
| `public/images/{name}-texas-birth-doula-skyline.webp` | Hero images |
| `src/pages/doula-cost.astro` | Pillar — links to top 6 cities |
| `src/pages/what-is-a-doula.astro` | Pillar — links to top 6 cities |
| `src/pages/benefits-of-a-doula.astro` | Pillar — links to top 6 cities |
| `src/pages/how-to-choose-a-doula.astro` | Pillar — links to top 6 cities |
| `src/pages/birth-plan-template.astro` | Pillar — links to top 6 cities |
| `src/pages/postpartum-doula.astro` | Pillar — links to top 6 cities |

**No static `.astro` files for individual cities.** If one exists, it's a leftover from V1 and must be deleted.