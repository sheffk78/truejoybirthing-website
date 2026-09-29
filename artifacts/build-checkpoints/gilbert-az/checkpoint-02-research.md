# BUILD Checkpoint 2 — gilbert-az research data

## Status: RESEARCH COMPLETE (pre-data-write)
- Date: 2026-09-28 (America/Denver)
- Population tier: 100K–500K (Gilbert pop ≈ 275,000)
- G37 minimums for tier: 2+ doulas/midwives, 2+ hospitals, 1+ birth center
- Planned counts: 6 doulas (4 in-city, 2 nearby-East-Valley), 3 hospitals, 1 birth center → clears minimums with margin

## Verified providers (doulas) — Gilbert, AZ
1. **Eliza Jessop** — Doula, NPI 1306794268 (active since 2026-03-17), 943 E Melody Dr, Gilbert, AZ 85234, (480) 589-5222. Listed on bornbir.com as Gilbert-based. Source: npiprofile.com + bornbir.com
2. **Sidney Olivia Garcia, CPD** — Doula, NPI 1942165832, 359 E Horseshoe Ave, Gilbert, AZ 85296, (720) 361-5078. Source: npino.com
3. **Kiersten Joy Benton, CD, PCD** — Doula, NPI 1255947115, Gilbert AZ; labor+postpartum doula experience (Holistic Creations 2018-2020), currently CNA at Banner Health. Source: true-medinfo.com + linkedin
4. **Janelle Moore** — DONA Advanced + ProDoula certified, Neshama Birth Services, serves East Valley incl. Gilbert. NPI 1558247882 (Gilbert doula, true-medinfo). Same person as Chandler entry's Janelle Moore — East Valley provider. Source: true-medinfo.com + neshamabirthservices.com
5. **Rose Elizabeth Day, CD(DONA)** — Doula, NPI 1679878797, Gilbert AZ (true-medinfo NPI registry)
6. **Shannon Anderson** — Certified Postpartum Doula, "Holding a Mother's Hand, LLC", Queen Creek AZ (adjacent, serves Gilbert). Source: bornbir.com

NPI registry cross-check (true-medinfo.com/arizona/gilbert/doula): **12 verified doulas** practicing in Gilbert — market comfortably exceeds tier minimum.

## Verified hospitals (maternity/L&D) — Gilbert, AZ
1. **Banner Gateway Medical Center** — 1400 S Higley Rd, Gilbert, AZ 85296. Full maternity program (bannerhealth.com): labor & delivery, mother-baby unit, lactation consultants, childbirth classes. Level II NICU (to confirm on page).
2. **Mercy Gilbert Medical Center** — 3555 S Val Vista Dr, Gilbert, AZ 85297. Lund Family Birth Center (dignityhealth.org/CommonSpirit): comfortable birthing suites, CNM services, childbirth classes. Level II NICU (to confirm).
3. **Banner Desert Medical Center** — Mesa (adjacent East Valley fallback, high-volume, Level III NICU).

## Verified birth center — Gilbert, AZ
1. **Desert Bloom Birth Center** (Home of As You Wish Midwifery) — 875 N Greenfield Rd suite 101, Gilbert, AZ 85234, (480) 664-7463, desertbloombirthcenter.com. Faith-centered freestanding birth center offering birth-center AND homebirth services. NPI 1982585469 (DESERT BLOOM BIRTH CENTER LLC, birthing center taxonomy 261QB0400X). NOTE: Gilbert Family Birth Center at same address (Yelp listed) is CLOSED — Desert Bloom is the active center there.

## Cost data (Gilbert market)
- DoulaMatch AZ statewide: birth fees $800–$1,500 typical; Gilbert median package price $1,000 (bornbir).
- Planned costLow/costHigh: 900–2,200.

## Facts to verify on-page before write (flagged)
- Banner Gateway NICU level (II expected)
- Mercy Gilbert NICU level (II expected)
- AZ AHCCCS doula coverage status (medicaidNote)

## Image plan
- ONE hero image (pregnant silhouette + Gilbert landscape) → hero + YT thumb + OG (derived)
- ONE support scene (pregnant mom + doula, ONE pregnant woman, no distortion) 4:3
- Reference sizes from chandler-az: hero 1200x800, support 1200x900 (4:3), og 1200x630, yt 1280x720, provider photos 400x400

## Next steps
1. Verify hospital NICU levels + AHCCCS doula note
2. Write cities.ts block via Python heredoc
3. Generate images, convert to webp at reference sizes
4. Validate: npx tsx scripts/validate-city-data.ts gilbert-az (0 errors required)
5. npm run build
6. Write handoff contract artifacts/handoffs/gilbert-az/build.json (ONLY after validation passes)