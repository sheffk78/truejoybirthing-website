# Build Checkpoint — greenville-sc

**Stage:** build (1 of 4)
**Created:** 2026-09-18
**Status:** checkpoint-first execution; research in progress

## Population tier
Greenville, SC city proper ~70,720 (2020 census); metro ~928,000. Treating as mid-size city (tier requiring minimum 5 providers) — pending confirmation against the tier table used by validate-city-data.ts.

## Research plan
1. Hospitals with L&D: Prisma Health Greenville Memorial Hospital, St. Francis Eastside/Prisma Health St. Francis — verify NICU levels, addresses, doula policies.
2. Birth centers: search NPI registry taxonomy 261QB0400X for Greenville SC + Google Maps results.
3. Local doulas: target ≥ minimum for tier (aim 4-6 verified listings from Bornbir, birth networks, practitioner sites).
4. Medicaid: SC Healthy Connections doula benefit status.

## Data written so far
- NONE yet. First attempt at cities.ts write failed on shell quoting (no partial write landed — verified `grep '"greenville-sc"'` found nothing; cities.ts lives at src/data/cities.ts, 12,265 lines, 2.5MB).
- Will write via python3 heredoc (per rule) after research is gathered, inserting entry before the closing `};` of the cities record.

## Image plan
- hero: pregnant silhouette + Greenville skyline (Reedy River/Falls Park landmarks) — ONE image reused hero/YT/OG
- support scene: pregnant mom + doula professional, ONE pregnant woman
- OG: derived from same hero image

## Verification log
- 2026-09-18: cities.ts entry verified complete on disk (11018-11550): 5 hospitals, 5 local doulas (min 5 for metro ~928k tier), 3 birth centers, 9 services, 7 midweek, 5 FAQs, full copy.
- Images on disk: hero greenville-sc-birth-doula-skyline.webp (80KB, 3:2), -600 .webp/.avif, support greenville-sc-birth-doula-support.webp (34KB), OG og-city-greenville-sc.webp (34KB ≥30KB), provider photos x5 (annas-peace, care-for-mom, doulas, sunflower, entering-motherhood), hospital thumbnails x2. G8x gates passed (hero is real photo, silhouette confirmed, no letterbox, OG Pattern B, 8081 unique colors).
- KNOWN GAPS: patewood thumbnail + labors-of-love provider photo referenced in cities.ts but MISSING on disk (enrich-stage gates only; not in build gate set). Plan: generate or drop refs.
- Handoff contract artifacts/handoffs/greenville-sc/build.json was never written by prior attempt — writing + validating now via contract-validate.py --compare.