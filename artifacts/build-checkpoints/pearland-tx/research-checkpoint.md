# Pearland, TX — BUILD Stage Research Checkpoint
Date: 2026-09-07
Population tier: 100K-500K (~131K) → minimum: 2+ doulas, 2+ hospitals, 1+ birth center. Target ceil.

## Current state (from cities.ts)
- SKELETON entry. localDoulas: [], hospitalDetails: [], birthCenterDetails: [], faqs: [], nearbyCities: [].
- costLow: 800, costHigh: 2500 (stale, must reconcile with actual provider data per R35).
- No heroImage, no support scene, no OG.

## Research targets
- Doulas/midwives serving Pearland, TX (DoulaMatch, Bornbir, Google Maps, provider directories). Check houston-tx, alvin-tx for providers with serviceArea including Pearland.
- Hospitals: Memorial Hermann Pearland (primary), HCA Houston Healthcare Pearland, any others
- Birth centers in/near Pearland
- Real provider headshots (at least 1)
- Hospital descriptions 300+ chars (NICU, doula policy, rooms, baby-friendly, lactation, VBAC, midwife availability)

## To generate
- Hero: pregnant silhouette + Pearland landscape (3:2, 1200x800), ONE image reused hero/OG/YT
- Support scene: ONE pregnant woman + professional (4:3, 1024x768, CROP never distort)
- OG: derived from hero via tjb-generate-asset.sh og pearland-tx

## Gates to pass: G3, G5, G13, G4, G37, hospital_count, visual_check
