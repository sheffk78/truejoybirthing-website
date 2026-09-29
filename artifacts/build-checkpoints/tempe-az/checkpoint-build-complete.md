# Tempe-AZ BUILD Stage — Completion Checkpoint

**Date:** 2026-09-29 | **Stage:** build → advances to visual/verify
**Preflight:** 20/20 gates PASS (0 failures, 0 warnings) — `.preflight-result.json`
**Validator:** 0 errors / 0 image issues / 0 warnings across 179 cities (was 178)

## Research-first evidence (gate satisfied — 6 doulas, well above 2+ minimum)
All providers verified via free discovery (DuckDuckGo/web search → Bornbir.com, TRUE-MEDINFO NPI registry); no fabricated data:
1. **Joeley Harper** — birth doula + birth photographer, CBI-trained, based in Tempe (bornbir.com/joeley-harper; NPI 1386463024)
2. **Shannon Bentley** — birth & postpartum doula, Tempe-based, all birth locations (bornbir.com/shannon-bentley)
3. **Amber Thomas** — full-spectrum birth + postpartum doula, Tempe-based (bornbir.com/amber-thomas)
4. **Breanne Moriarty, CD(DONA)** — NPI 1477056588, Tempe practice location (true-medinfo.com)
5. **Gervonne Jefferson** — NPI 1669276101, Tempe practice location (true-medinfo.com)
6. **Jennifer Saucier** — NPI 1922566322, Tempe practice location (true-medinfo.com)

Supporting infrastructure:
- **Tempe Birth Center (Hummingbird Midwives)** — 918 S Mill Ave, NPI 1821877762 (birthing clinic/center, CNM Katherine Elaine Paxton listed as clinical midwifery director) — in-city birth center satisfies 1+ requirement
- **Hospitals:** Banner Desert Medical Center (Mesa, ~10 min, Level III Perinatal + Level III NICU) + Chandler Regional Medical Center (~15 min, Level II E NICU). Correction discovered during research: Tempe St. Luke's L&D closed 2018 — not listed as a maternity option.
- **Costs:** Bornbir Tempe page — median package $1,000, typical range $444–$1,500 (222 packages / 77 providers near Tempe); entry uses $900–$2,200 East Valley range, consistent with chandler/gilbert/mesa entries.

## Files created/modified
- `src/data/cities.ts` — APPEND-ONLY insertion of `"tempe-az": { … }` block (16,479 chars, 6 doulas / 2 hospitals / 1 birth center / 4 FAQs / 10 sources). Preserved parallel Gilbert-lane uncommitted changes (git diff 148+/17− includes their hunks).
- `public/images/tempe-az-birth-doula-skyline.webp` + `-600.webp` + `.avif` ×2 (hero, 1200×800 3:2, FAL Flux Schnell, synthid-cleaned)
- `public/images/heroes/tempe-az-birth-doula-skyline.webp` (validator-path copy)
- `public/images/tempe-az-support-scene.webp` / `-v2.webp` (1200×900 exact 4:3)
- `public/images/og-city-tempe-az.webp` (1200×630 Pattern B rendered via render-og-max.cjs)
- `public/images/yt-thumb-tempe-az.webp` (1280×720)
- `public/images/providers/tempe-az-{joeley-harper,shannon-bentley,amber-thomas}.webp` (real Bornbir CDN photos, 400×400)
- `public/images/birth-centers/tempe-az-tempe-birth-center.webp` (REAL photo from tempebirthcenter.com — house number 918 visible, matches address)
- `scripts/og-city-tempe-az-canonical.html` + `scripts/og-city-tempe-az-composition.html` (Pattern B, G29/G35/G64)

## Gate results
G1 G2 G3 G4 G8 G8a G21 G25 G29 G35 G36 G37 G38 G40 G41 G42 G58 G62 G64 G65 G66 G70–G72 S1–S8 → ALL PASS. npm run build exit 0.

## Vision QA (GLM-5.2-class via Gemini 2.5 Flash)
- Hero: PASS — silhouette normal, no text
- Support scene: PASS — anatomy correct, no text
- OG: PASS v1 composition checker (logo top-right matches pomona/mesa/sunnyvale pattern; gilbert's lane OG actually fails G64 — flagged to parent)
- Birth center photo: PASS — real photo, house number 918 matches address

## Notes for visual stage
- related-cities.json has no tempe-az key (generator tool output absent for AZ cities — gilbert/mesa/chandler also absent); page still builds and renders nearbyCities from cities.ts.