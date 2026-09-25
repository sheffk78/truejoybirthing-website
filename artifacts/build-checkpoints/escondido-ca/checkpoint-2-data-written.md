# BUILD CHECKPOINT 2 — escondido-ca (post cities.ts entry)
date: 2026-09-24

## Done
- cities.ts entry inserted (18,714 chars) before "palmdale-ca" via Python heredoc (write_file/patch NOT used on cities.ts)
- Backup: artifacts/build-checkpoints/escondido-ca/cities.ts.pre-build-backup
- validate-city-data.ts escondido-ca: 0 errors (only image warnings pending)
- Data: 6 doulas (DoulaMatch, Escondido-based, all with fees/credentials/service areas), 1 hospital
  (Palomar Medical Center Escondido, paragraph 800+ chars w/ paragraph_source), 1 birth-center note,
  midwifeInfo (CNM/LM/CPM), medicaidNote "Yes —" format, insuranceNote, 7 FAQs, birthStats (CA
  state values from san-diego-ca precedent), nearbyCities [san-diego-ca, oceanside-ca], 11 sources

## Remaining (in order)
1. Hero image: image_generate → pregnant silhouette + Escondido landscape → 1200x800 3:2 →
   webp + avif + 600w/1200w variants + heroes/ copy (optimize-city-images.py handles this)
2. Support scene: image_generate → 4:3 (1024x768) → unique per city
3. OG: copy render-city-og-template.html → scripts/og-city-escondido-ca-composition.html (fill all
   placeholders incl. left-column::before/after etc.) → node render-og.cjs → verify 1200x630
4. YT thumbnail: node render-yt-thumbnail.cjs escondido-ca Escondido CA (1280x720)
5. Provider photos: image_generate headshots for 6 doulas → public/images/providers/escondido-ca-*.webp
6. Hospital thumbnail: generate 900x600 → public/images/hospitals/escondido-ca-palomar-medical-center.webp
7. python3 scripts/optimize-city-images.py escondido-ca
8. npm run build → validate → preflight-stage-gate.py escondido-ca build
9. eval-voice + eval-accuracy + eval-slop-gate
10. contract-validate.py escondido-ca build --compare → fill produced_at/worker_model → validate until contract_valid:true