# Victoria, TX — BUILD Stage Checkpoint 01 (Research Plan)

**Stage:** build (1 of 4) | **Slug:** victoria-tx | **Population tier:** ~67K (under 100K)
**Minimum provider counts (G37):** 1+ doula, 1+ hospital, 0+ birth centers

## Research targets
- Doulas serving Victoria TX (DoulaMatch, local practices, doula directories)
- Hospitals: DeTar Healthcare System (DeTar Hospital Navarro / DeTar Hospital North), Citizens Medical Center
- Birth centers: verify presence/absence in Victoria TX
- Cost ranges, Medicaid/insurance context

## Data entry method
- Python heredoc via terminal into src/data/cities.ts (NEVER write_file/patch)
- Extract victoria-tx block first, operate within block only

## Images to generate
- Hero: pregnant silhouette + Victoria city landscape (ONE image, reused hero/YT/OG)
- Support scene: pregnant mom + professional (ONE pregnant woman)
- OG: derived from same hero image

## Validation
- npx tsx scripts/validate-city-data.ts victoria-tx
- npm run build
- python3 scripts/contract-validate.py victoria-tx build --compare
