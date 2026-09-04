# Rancho Cucamonga CA — ENRICH Stage Report (2026-09-04)

## Outcome
- Stage gate: ALL PASS — `python3 scripts/preflight-stage-gate.py rancho-cucamonga-ca enrich`
  → 22 PASS, 0 FAIL, exit 0 (artifact: `artifacts/gates/rancho-cucamonga-ca-enrich.json`).
- `npx tsx scripts/validate-city-data.ts rancho-cucamonga-ca` → 0 errors.
- Deployed: enrich commit `68b1269a` on origin/main; Cloudflare Pages auto-deployed.
  Live verification at truejoybirthing.com/birth-support/rancho-cucamonga-ca/:
  200, new paragraphs present, clone data GONE, all 4 provider photos + 3 facility
  images return 200 with the new file sizes (hero 68,832B live).

## What was fixed
1. **G66 duplicate keys — FIXED.** The block carried TWO `localDoulas` arrays; the
   first was a stale Minneapolis clone (Everyday Miracles, Blooma — `photo: ""`),
   the sole source of the G60 "2 empty photo paths" failures. Removed via Python
   bracket-depth edit (no write_file/patch on cities.ts).
2. **G60/G15b/min_1_headshot — FIXED.** Lauren Pancucci's photo was a 528-byte
   initials-class placeholder (247 unique colors). Re-sourced ALL FOUR provider
   headshots from Bornbir face-crop Cloudinary assets (bornbir.com lists all four
   on rancho-cucamonga/ca/doula): selina-pasillas 11.8KB/29,241c, annie-griffith
   21.5KB/37,133c, nicole-jones 15.1KB/39,883c, lauren-pancucci 13.6KB/25,309c.
   All local webp 400x400. 4/4 real headshots, 0 initials.
3. **G65 hero black bars — FIXED.** Both hero copies had 62px top + 63px bottom
   pure-black bars. Cropped from git-HEAD content, LANCZOS back to 1200x800 3:2
   (0.16% vertical stretch, imperceptible), re-encoded q75 → 67KB (also satisfies
   build-stage G41 ≤80KB), 68,184 colors. Regenerated -600 srcset variant.
   Post-fix G65 PASS + G25 (3:2) + G62 (AVIF not stale) all pass.
4. **Hospital + birth center paragraphs — UPGRADED to 300+ chars with mom-question
   facts scraped from the facilities' own pages:**
   - San Antonio Regional Hospital (527 → full: 363-bed nonprofit, Baby-Friendly,
     U.S. News 2025, private birthing suites, Level II NICU + follow-up clinic,
     TWO support persons during L&D (doula can attend), lactation consultants,
     3 live virtual maternity classes, maternity tours, 7th-month pre-registration
     via maternity liaison, interpretation services). Sources: sarh.org
     maternity-services + centers-of-excellence + US News press release.
   - Arrowhead Regional Medical Center (956 chars: Baby-Friendly, Level III NICU,
     Maternal-Child Health pregnancy→age 14, NST clinic, "every family, however
     that family is defined" philosophy, doula-welcome, Medi-Cal county hospital,
     interpretation). Source: arrowheadregional.org maternal-child-health page.
   - The Natural Birth Place (851 chars: CNM practice, renovated home-like rooms,
     bathtubs for laboring AND birthing, birth center/hospital/home birth,
     lactation + tongue-tie frenotomy, monitrice care, VBAC/breech consult,
     classes, virtual tour, phone). Source: naturalbirthplace.com.
5. **Birth center verified REAL and operating:** naturalbirthplace.com → HTTP 200,
   NPI registry lists "Birthing Clinic/Center" + Advanced Practice Midwife,
   renovated center announced July 2026. Address discrepancy found and DOCUMENTED
   in the entry: Google/Yelp/NPI list "San Bernardino, CA 92408" but 1881 Business
   Center Dr S sits inside the Rancho Cucamonga 91730 zip boundary (OSM confirms
   91730 = Rancho Cucamonga). cities.ts now notes "(postal: San Bernardino, CA
   92408)". birthCenterDetails has address, url (https), services array, thumbnail
   (60KB real photo, 86,952 colors). Pitfall 7 satisfied.
6. **S8/cost_format — VERIFIED.** Zero "Contact for pricing". All 4 providers carry
   real dollar ranges ($1,000-$2,500 ×3, $1,200-$2,500) within city baseline
   $1,000-$2,500, all tagged `costRange_source: "market-estimate"` + `enrichedAt:
   "2026-09-04"`.
7. **Hospital photos = real buildings (vision proxy + programmatic):** SARH 600x400
   31,530c/edge 0.058; ARMC 600x310 46,040c/edge 0.223; NBP 600x400 86,952c/edge
   0.223 — all landscape ≥400x300, ≥15KB, high color/edge density (real
   photographic building content, not logos/silhouettes/AI-flat). File md5s differ;
   no cross-city sharing within this city's block (SARH file is shared with
   fontana-ca/ontario-ca for the same Upland hospital — same facility, expected).
8. **G14/G15/G9/G57/S7 — verified:** 4/4 descriptions specific, 4/4 photo fields
   filled, no sentry/scrape artifacts, medicaidNote starts "Yes —".

## Photo sourcing summary (tier documentation)
- Tier 0 (in cities.ts): all 4 providers had photo paths — but pancucci was a
  528-byte placeholder (would fail G60 <2KB + provider_photo_quality <5KB).
- Tier 5 (Bornbir profile pages): fetched /rancho-cucamonga/ca/doula listing,
  matched name→Cloudinary public-id per card, downloaded all 4 face-crop 400x400
  assets, verified >5KB and >1000 unique colors. This is the real-headshot source
  for 4/4 providers. DoulaMatch city page not needed (Bornbir covered all).
- Facilities: thumbnails already on disk from build stage; verified real photos
  (not logos/AI) via color/edge/structure proxy. No re-sourcing needed.

## Concurrent-work note
Other pipeline workers (seo/beaumont, images/og, verify stages) were editing
cities.ts and compositions concurrently; two of my early writes were absorbed
into a `pre-seo-fixes temp WIP` stash by another session. Root-caused via
reflog, recovered from the stash commit (426626cb), re-applied idempotently
(enrich3 script verifies-and-skips), committed once as 68b1269a. My RC block
survived all subsequent interleaved pulls verbatim.

## Files changed
- src/data/cities.ts (dedupe, provider tags, 3 paragraph upgrades, BC address note)
- public/images/provider-rancho-cucamonga-ca-{selina-pasillas,annie-griffith,
  nicole-jones,lauren-pancucci}.webp (re-sourced Bornbir headshots)
- public/images/rancho-cucamonga-ca-birth-doula-skyline.webp + heroes/ copy +
  -600 variant (bars cropped, q75, ≤80KB)
- artifacts/gates/rancho-cucamonga-ca-enrich.json (22/22 PASS)
- reports/enrich-rancho-cucamonga-ca-2026-09-04.md (this report)

## Left for later stages
- og-city-rancho-cucamonga-ca-v3.webp (150KB) exists on disk from the images
  worker but the cities.ts ogImage ref still points to v2 (84KB, passes S2/G4).
  The images-stage worker owns that ref bump; not this stage's scope.
- G65 fix pattern applies to hero assets in other cities — out of scope here.