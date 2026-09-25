# pasadena-ca BUILD stage — research checkpoint
written: 2026-09-24 (worker glm-5.3-flash)

## Population tier
Pasadena CA ~135-140K = MID-SIZE: minimums 2+ doulas, 1+ hospital. Plan: 3 doulas, 2 hospitals (exceeds minimums), birth center (Moxie, South Pasadena ~2mi).

## Verified providers (research done via web_search, evidence quotes captured below)
1. Nancy Connelly — Nancy's Doula Services — CD(DONA) since 2000, 635+ births, Pasadena-based, Certified Lactation Educator.
   URL: http://www.nancydoula.com/
   Pkg: "Birth Doula Services Two to three prenatal visits, my time at your labor and birth and at least one to two hours after baby is born, one postpartum visit and lots of follow up after baby is born... $3,000.00 USD Flat rate" (bornbir.com/nancy-connelly)
   costRange: $3,000-$3,000 flat -> use $2,800-$3,500 band per site flat rate? NO — use $3,000 flat (COST_RANGE_RE needs range) => "$3,000-$3,000" INVALID; template uses real ranges. Use band "$2,500-$3,500" derived from flat rate? Must be defensible: quote says $3,000 flat. costRange format RE: e.g. '$1,800-$2,500'. A flat rate can be expressed $3,000-$3,000 — regex may allow. Safer: "$3,000-$3,000"? check COST_RANGE_RE in tjb_contracts.py. Alternative: band from DoulaMatch area norms.
2. Brighid Quinn — Quinn Doula Services — Highland Park (serves Pasadena directly), CD-L, birth+postpartum.
   quinndoula.com — Hybrid birth doula $2000; full birth fee $4000 (doulamatch profile 22783: "Birth Fee: $4000, Postpartum Rate: $45 to $55").
   costRange: "$2,000-$4,000" (hybrid $2000, full in-person $4000) — both quoted on her own site + DoulaMatch.
3. Rebecca Belenky — Los Angeles Birth — CD, CPD, CBE, CLEC, South Pasadena based, serving Pasadena since 2014, 10+ yrs, attends Huntington Hospital births.
   losangelesbirth.com — "My birth doula packages start at $5000." Packages $5000/$6000, childbirth ed $1500.
   costRange: "$5,000-$6,000" (both tiers quoted on site).
4. Catherine (Cat) Roche — Pasadena birth doula (bornbir profile), 5.0 rating, Kaiser/Health Net accepted.
   "Birth Package Two prenatal visits (one virtual, one in person), in person birth support, on call support, and one postpartum visit. $1,500.00 USD Flat rate"
   costRange: "$1,500" flat.

## Hospitals (evidence)
- Huntington Hospital (Huntington Health), 100 W California Blvd, Pasadena — Level IIIB NICU (highest in San Gabriel Valley), Small Baby Unit, ~2,644 live births (Leapfrog reporting period; other Leapfrog page 3,463), doulas allowed, IBCLC lactation, no CNMs on staff.
- USC Arcadia Hospital (Keck Medicine), 445 E Huntington Dr, Arcadia (~4 mi from Pasadena) — 17-bed Level II NICU, 24/7 laborists, 24-bed couplet unit Berger Tower, high-risk capable, VBAC, doulas allowed (visitor policy: check with staff).

## Birth center
Moxie Birth — 1416 El Centro St Ste 100, South Pasadena CA 91030 — LA's only birth center founded/operated by midwife (Sara Howard) + OB (Bente Kaiser). NPI 1073223483. (626) 399-0649. Already in cities.ts as glendale birth center + alhambra thumbnail exists.
Del Mar Birth Center — South Pasadena — nationally accredited, CNM team (second option).

## Images needed (build stage)
- hero: pasadena-ca-birth-doula-skyline.webp (real photo: pregnant silhouette + San Gabriel Mountains/Pasadena landscape, golden hour) — ONE image reused hero/OG/YouTube
- og: og-city-pasadena-ca.webp (derived from hero)
- support scene: pasadena-ca-support-scene.webp
- 3 provider headshot placeholders? Providers need photo on disk: /images/provider-pasadena-ca-*.webp
- hospital thumbnails 400x300: huntington-hospital pasadena thumbnail + usc-arcadia thumbnail

## Cost band for city
LA-area rates: $1,200 low (Roche flat $1,500 → low end near $1,500; Glendale band $1,200-$3,500). Pasadena median higher. costLow 1500, costHigh 6000.

## Medicaid note (CA statewide, reuse verified facts)
California Medi-Cal doula benefit via PAVE, ~$1,587 per pregnancy (matches existing glendale-ca block + corona uses $1,841 SB-509 figure). Use the $1,587 PAVE figure consistent with glendale-ca midwifeInfo.
