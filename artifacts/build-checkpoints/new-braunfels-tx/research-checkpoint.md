# New Braunfels, TX — BUILD Stage Research Checkpoint
Date: 2026-09-06
Population tier: <100K (~90K) → minimum: 1+ doula, 1+ hospital, 0+ birth centers. Target ceil.

## Current state (from cities.ts)
- SKELETON entry. localDoulas: [], hospitalDetails: [], birthCenterDetails: [], faqs: [], nearbyCities: [].
- costLow: 800, costHigh: 2500 (stale, must reconcile with actual provider data per R35).
- No heroImage, no support scene, no OG.

## Research targets
- Doulas/midwives serving New Braunfels, TX (DoulaMatch, Bornbir, Google Maps, provider directories)
- Hospitals: Christus Santa Rosa Hospital - New Braunfels (primary), any others
- Birth centers in/near New Braunfels
- Real provider headshots (at least 1)
- Hospital descriptions 300+ chars (NICU, doula policy, rooms, baby-friendly, lactation, VBAC, midwife availability)

## To generate
- Hero: pregnant silhouette + New Braunfels landscape (3:2, 1200x800), ONE image reused hero/OG/YT
- Support scene: ONE pregnant woman + professional (4:3, 1024x768, CROP never distort)
- OG: derived from hero via tjb-generate-asset.sh og new-braunfels-tx

## Gates to pass: G3, G5, G13, G4, G37, hospital_count, visual_check
