# BUILD Checkpoint — saint-paul-mn (Saint Paul, MN)

- produced_at: 2026-09-23 (America/Denver, UTC-06:00)
- stage: build
- population_tier: mid-size (~311K) → minimum 4+ doulas, 2+ hospitals
- worker_model: glm-5.3-flash (Hermes subagent, delegated by parent state machine)
- status: RESEARCH IN PROGRESS (checkpoint-first discipline per dispatch)

## Research plan
1. Hospitals in Saint Paul, MN (need 2+): Regions Hospital (HealthPartners), United Hospital (Allina), Children's Minnesota (St. Paul campus), St. Joseph's Hospital — verify current maternity services + collect evidence URLs.
2. Birth centers serving St. Paul: Minnesota Birth Center (St. Paul location), Health Foundations Birth Center — verify.
3. Doulas serving Saint Paul (need 4+): search doula collectives/agencies serving St. Paul proper; capture name, website, services, headshot source (og:image from their page).

## Evidence ledger (fill as research proceeds — claim / url / exact quote)
(see handoff contract sources[] for final validated entries)

## Data targets for cities.ts (block-scoped edit, python heredoc ONLY)
- localDoulas: 4+ entries (name, title, credentials, services, bio, photo webp >=2KB real headshot or og:image)
- hospitals: 2+ entries (name, system, level of care, address, 400x300 thumbnail webp, real URL)
- costRange: dollar-range format
- hero: photographic pregnant silhouette + Saint Paul landscape (NO watercolor/illustration)
- og: derived from same hero; support scene: pregnant mom + professional, single pregnant woman
- AVIF trap: overwrite unversioned .avif + -600.avif via PIL from new webp

## Pitfall reminders active for this build
- NEVER write_file/patch on cities.ts (python heredoc via terminal only)
- Block-scoped edits only (find slug → brace depth), staten-island-ny is being built concurrently — do not touch
- hospital thumbs 400x300 (P11 square-logo rule)
- href= escaping: verify backslash count vs existing working entry, npm run build immediately after
- hero file name must contain city slug; one hero reused hero/YT/OG
- provider photos: real headshots from their own pages (og:image), webp >= 2KB
- no deploy, no state advance — parent does both

## Next actions (post-checkpoint)
web_search hospital maternity pages → web_extract for exact quotes → doula directory research → image generation → cities.ts insert → gates.