# BUILD CHECKPOINT 3 — escondido-ca (COMPLETE)
date: 2026-09-24

## Verification results (all real tool output)
- validate-city-data.ts escondido-ca: 0 errors, 0 image issues, 0 warnings
- npm run build: 349→351 pages built, exit 0, sitemap-cities 203 URLs (Escondido included)
- preflight-stage-gate.py escondido-ca build: 20 PASS / 0 FAIL / 0 SKIP (exit 0)
  incl. G8/G8a hero silhouette-photograph, G25 3:2, G29/G64 OG Pattern B, G62 avif, G65 no letterbox,
  G66 no dup keys, G70/G71/G72 rendered-HTML checks, LOCAL_* integrity + LOCAL_EVAL_SLOP
- eval-slop-gate: PASS (0 hard, 0 warn)
- eval-voice: approved, 15 fields, 0 blocking findings
- eval-accuracy: approved, 11 sources checked, 0 unsupported, 0 model errors
- contract-validate.py escondido-ca build: contract_valid TRUE, exit_code 0 (11 sources, watermark flags set)

## Images generated
- hero escondido-ca-birth-doula-skyline.webp (1200x800 3:2) + avif + 600w/1200w + heroes/ copy
- support scene escondido-ca-support-scene.webp (1024x768 4:3), vision-verified (1 pregnant woman, no distortion)
- og-city-escondido-ca.webp (1200x630, Pattern B composition file at scripts/og-city-escondido-ca-composition.html)
- yt-thumb-escondido-ca.webp (1280x720)
- hospitals/escondido-ca-palomar-medical-center.webp (900x600)
- 6 provider headshots 320x320 (rochelle-tullius, rosie-peterson, katie-stoller,
  lindsay-rossio, katarina-lansing, rosemary-aquilino)
- python3 scripts/optimize-city-images.py escondido-ca: all budgets OK, IPTC applied

## Data
- 6 doulas (DoulaMatch Escondido roster; fee data from listings; costRange normalized to
  dollar-range format $X-$Y per contract validator)
- 1 hospital (Palomar Medical Center Escondido, 800+ char paragraph + paragraph_source),
  birthCenterDetails "no birth centers in city limits" note w/ Best Start BC context
- midwifeInfo, medicaidNote (Yes — format), insuranceNote, 7 FAQs (local), birthStats (CA
  state-level, CDC NCHS), nearbyCities [san-diego-ca, oceanside-ca], 11 sources
- cities.ts edited ONLY via Python heredoc (backup: cities.ts.pre-build-backup in this dir)

## NOT done (other stages' scope)
- No deploy, no video, no outreach, no state-machine advance (parent's job)