# BUILD CHECKPOINT — escondido-ca (stage: build)
written_at: (first 10 tool calls, before extended research)
worker: TJB pipeline build subagent

## Goal (from state machine)
- Checkpoint-first: this file is that checkpoint.
- Research providers (doulas), hospitals, birth centers for Escondido CA (~150K pop → mid-size tier: 2+ doulas, 1+ hospitals minimum).
- Write data into cities.ts via Python heredoc (terminal only — never write_file/patch on cities.ts).
- Generate hero image (pregnant silhouette + city landscape, photographic, ONE image reused hero/YT/OG), support scene photo (pregnant mom + professional), OG derived from hero.
- Validate: npx tsx scripts/validate-city-data.ts escondido-ca; npm run build.
- Handoff: python3 scripts/contract-validate.py escondido-ca build --compare until contract_valid:true.

## Research plan
- Providers: search Google/Doula Match/IRON/doula directories for "doula Escondido CA", birth centers in North County San Diego, hospitals serving Escondido (Palomar Medical Center Escondido).
- Evidence: one sources[] entry per provider (claim + url + exact supporting quote).
- Images: hero via image_generate (photographic silhouette, golden hour, no illustration/watercolor), support scene, OG derived; hospital thumbnails 400x300.

## Data collected
(to be appended below as research completes)

- providers: PENDING
- hospitals: PENDING
- birth_centers: PENDING
- images: PENDING