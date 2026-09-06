# San Marcos, TX — BUILD Stage Research Checkpoint
Date: 2026-09-06
Population tier: <100K (~70K) → minimum: 1+ doula, 1+ hospital, 0+ birth centers. Target ceil.

## Current state (from cities.ts)
- SKELETON entry. localDoulas: [], hospitalDetails: [], birthCenterDetails: [], faqs: [], nearbyCities: [].
- costLow: 800, costHigh: 2500 (stale, must reconcile with actual provider data per R35).
- No heroImage, no support scene, no OG.

## Research targets
- Doulas/midwives serving San Marcos, TX (DoulaMatch, Bornbir, Google Maps, provider directories)
- Hospitals: Ascension Seton Medical Center Hays (primary), any others
- Birth centers in/near San Marcos
- Real provider headshots (at least 1)
- Hospital descriptions 300+ chars (NICU, doula policy, rooms, baby-friendly, lactation, VBAC, midwife availability)

## To generate
- Hero: pregnant silhouette + San Marcos landscape (3:2, 1200x800), ONE image reused hero/OG/YT
- Support scene: ONE pregnant woman + professional (4:3, 1024x768, CROP never distort)
- OG: derived from hero via tjb-generate-asset.sh og san-marcos-tx

## Gates to pass: G3, G5, G13, G4, G37, hospital_count, visual_check
