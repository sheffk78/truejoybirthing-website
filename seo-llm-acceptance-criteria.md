# SEO + LLM Acceptance Criteria

Mandatory checks for every city page before deploy. If any check fails, fix before shipping.

---

## F-Group: SEO + LLM Readability

### F2: Service Schema Image ✅ ENFORCED (Sprint 1)
**Status:** Hard failure. All 21 cities pass.
**What:** Service schema must include `image` property pointing to hero image.
**Why:** Google rich results require Service image. LLMs use images for context.

### F4: Author Attribution ✅ ENFORCED (Sprint 1)
**Status:** Hard failure (reviewer byline only). All 21 cities pass.
**What:** "Reviewed by Shelbi Kohler, CD(DONA)" after hospital disclaimer. Links to /about/.
**Why:** E-E-A-T signal. YMYL content needs reviewer attribution.
**Note:** "Last updated" date deferred to Sprint 2 (requires per-city datePublished/dateModified data). No false freshness signals.

### F5: FAQ Anchors ✅ ENFORCED (Sprint 1)
**Status:** Hard failure. All 21 cities pass.
**What:** Each FAQ `<h3>` has `id="faq-{type}"` anchor. FAQ Question schema includes `url` with `#faq-{type}` anchor.
**Why:** Enables deep-linking (#faq-cost, #faq-medicaid, etc.) and LLM citation with specific answers.

### F7: Hospital H2 Heading ✅ ENFORCED (Sprint 1)
**Status:** Hard failure. All 21 cities pass.
**What:** "Hospital & Birth Center Info for {city}" H2 before hospital paragraphs.
**Why:** Heading hierarchy. Screen readers and LLMs use H2 structure to understand page sections.

### F8: SpeakableSpecification ✅ ENFORCED (Sprint 1)
**Status:** Hard failure. All 21 cities pass.
**What:** SpeakableSpecification schema in JSON-LD targeting `.prose h2`, `.prose h3`, `.faq-answer`.
**Why:** Tells voice assistants and LLMs which content is citable/speakable.

---

### F1: WebPage Schema + Dates ⏳ WARNING (Sprint 2)
### F3: Visible Breadcrumb Nav ⏳ WARNING (Sprint 2)
### F9a: og:locale = en_US ⏳ WARNING (Sprint 2)
### F9b: og:type = article ⏳ WARNING (Sprint 2)
### F9e: twitter:site ⏳ WARNING (Sprint 2)
Every city page must include `WebPage` schema in JSON-LD with `datePublished` and `dateModified`.
- `datePublished`: date the city page was first created
- `dateModified`: date of the most recent material content change
- Both must be ISO 8601 formatted (`YYYY-MM-DD`)
- This exists in the `@graph` alongside `FAQPage` and `Service`

### F2: Service Schema Image Property
The `Service` schema must include an `image` property referencing the hero image URL.
- Must be a fully qualified URL: `https://truejoybirthing.com/images/{slug}-texas-birth-doula-skyline.webp`
- Enables Google image carousel and rich results

### F3: Visible Breadcrumb Navigation
Every city page must render a visible `<nav aria-label="Breadcrumb">` element matching the breadcrumb schema.
- Pattern: Home > Birth Support > {City}, {state}
- Each breadcrumb must be a clickable link except the current page
- Must match the `BreadcrumbList` JSON-LD exactly

### F4: Author Attribution Line
Every city page must show a factual review/attribution line below the hospital section:
- Pattern: `Reviewed by Shelbi Kohler, CD(DONA) · Last updated {month year}`
- Uses `<small>` or equivalent semantic element
- The author name links to `/about/` (not anofollow — this is E-E-A-T)

### F5: FAQ Answer Anchors
Each FAQ `<h3>` must have an `id` attribute for deep-linking:
- Pattern: `id="faq-{type}"` where type is `cost`, `medicaid`, `hospital`, or `brand`
- Enables direct URL linking: `/birth-support/waco-tx/#faq-cost`
- The `FAQPage` schema `Question` entries must include `url` pointing to these anchors

### F6: Authoritative Outbound Links
Every city page must link to at least 2 authoritative external sources:
- Hospital official URLs (from `verifiedUrl` in research output)
- Texas HHSC Medicaid policy page
- These go in a small "Sources" line after the Medicaid/insurance section, not in running text
- All outbound links use `rel="noopener noreferrer"` (no `nofollow` — we want Google to see these citations)

### F7: Heading Hierarchy
- H1: `Birth Plan Resources for {city}, {state} Families` (existing — correct)
- H2: `What Birth Support Looks Like in {city}` (existing — correct)
- H2: `Hospital & Birth Center Info for {city}` (NEW — hospitals need their own H2)
- H2: `Doula Costs in {city}` (existing — correct)
- H2: `Medicaid & Insurance Coverage` (existing — correct)
- H2: `Next Steps: Plan Your Birth in {city}, {state}` (existing — correct)
- H2: `Nearby Cities` (existing — correct)
- H2: `Frequently Asked Questions — {city}` (existing — correct)
- H2: `Download Your Free Birth Plan` (existing — correct)

### F8: SpeakableSpecification Schema
Target FAQ answers for voice/LLM extraction:
```json
{
  "@type": "SpeakableSpecification",
  "cssSelector": ["h3", ".faq-answer"]
}
```
Added to the `@graph` in JSON-LD. Enables Google Assistant results and signals to LLMs which content is authoritative enough to cite.

### F9: OG Metadata Completeness
- `og:locale` must be `en_US`
- `og:type` must be `article` on city pages (not `website`)
- `twitter:site` must be `@truejoybirthing` (or correct handle)
- City pages must have a city-specific `og:image` (even if generated from a template)

### F10: Hospital Section Sources
Each hospital paragraph must have its `verifiedUrl` available as a small link after the hospital section:
- Pattern: `<small>Sources: <a href="{url}" rel="noopener noreferrer">{hospital name} maternity services</a></small>`
- Not inline in the paragraph — a small sources line at the end of the hospital/birth center section
- This is for E-E-A-T citation, not for user click-through

---

## S-Group: Structural SEO (Warnings — Should Fix)

These produce warnings, not hard failures. Fix when convenient.

### S1: App Store Link Attribution
External App Store links should include `rel="sponsored noopener noreferrer"`.
Prevents link equity drain to commercial external pages.

### S2: robots.txt
A `robots.txt` file should exist at the site root with:
- Sitemap reference
- Crawl-delay if needed
- No disallow rules that would block city pages

### S3: FAQ Accordion Pattern (Future Enhancement)
Consider `<details>/<summary>` for FAQ items with `open` default.
This is a future enhancement — not mandatory now. Current all-expanded format is fine for LLM readability.

### S4: City-Specific OG Images (Future Enhancement)
Generate OG images with city name overlay for social sharing.
Currently uses generic fallback — acceptable but suboptimal for click-through.

---

## Validate Integration

New F-group checks are added to `city-pages.test.ts` as **hard failures** (exit 1 on failure).
New S-group checks are added as **warnings** (exit 0 with warning message).

Run order stays the same:
```bash
npx tsx scripts/validate-cities.ts   # Pre-build data validation
npm run build                         # Build the site
npx tsx scripts/city-pages.test.ts   # Post-build HTML validation (includes F-group)
npx wrangler pages deploy dist --project-name truejoybirthing-website
```