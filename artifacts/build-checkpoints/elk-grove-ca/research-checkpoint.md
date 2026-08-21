# elk-grove-ca BUILD stage — research/data checkpoint
Date: 2026-08-21 (MDT)

## Status: START
- Stage: build (stage 1 of 4). Do NOT advance past build/deploy.
- Population: 169,743 → tier 100K-500K → MIN 2 doulas, 2 hospitals.

## To research (in progress)
- Doulas/midwives serving Elk Grove CA
- Hospitals with L&D: main candidates: UC Davis Medical Center (Sacramento, ~10mi, Level I trauma, major L&D), Mercy General Hospital (Sacramento, ~12mi L&D), Dignity Health Mercy General, St. Mary's Medical Center (Sacramento). Elk Grove itself has no full hospital with active L&D — verify via research.
- Birth centers: candidates — UC Davis Medical Center birth center? Sutter? Midwife practices in Elk Grove / Sacramento serving Elk Grove.

## Pipeline steps
1. [x] checkpoint dir + this file
2. [ ] read garden-grove-ca block in src/data/cities.ts (template)
3. [ ] research providers (web_search)
4. [ ] write city block via Python heredoc (NEVER write_file/patch)
5. [ ] generate hero (pregnant silhouette + Elk Grove landscape), support scene (1 pregnant woman + 1 professional), OG (from hero) — city-specific filenames, vision-verify + md5
6. [ ] hospital building thumbs 400x300, vision-verified
7. [ ] npx tsx scripts/validate-city-data.ts elk-grove-ca (G3,G5,G13,G4,G37,hospital_count)
8. [ ] npm run build
9. [ ] npx tsx scripts/preflight.ts elk-grove-ca

## Rules
- HERO: real-photo style, pregnant SILHOUETTE + city landscape; no gradient/text.
- Check public/images/elk-grove*.avif — if <10KB stale gradient, overwrite .avif + -600.avif via PIL from new webp.
- OG cascades from hero.
- NO cross-city image reuse. City-specific filenames (contain 'elk-grove').
- NO 'Contact for pricing' — use market estimate ranges (S8).
- Hospital paragraphs 300+ chars; hospital thumbs 400x300 (not square).
- Image fallback: OpenRouter images API (google/gemini-3.1-flash-image) key at ~/.hermes/secrets/openrouter-keys.txt if FAL fails.
