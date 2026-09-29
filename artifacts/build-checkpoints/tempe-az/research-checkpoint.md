# BUILD Checkpoint — Tempe-AZ (research-first)

Created: 2026-09-29 by build-stage subagent (task: execute BUILD for tempe-az).

## Population tier (G37 / R19)
Tempe, AZ population: ~185,000-190,000 (2024 est. ~186K).
Tier: **100K-500K** → minimum **2+ doulas/midwives, 2+ hospitals, 1+ birth center**.
Target the ceil of the tier (aim 3-4 doulas), accept floor 2 only after exhausting directories.

## Order of research (binding)
1. DuckDuckGo / web search (FREE discovery — no fabricated data)
2. Free provider directories: DoulaMatch.net, Bornbir.com
3. Only then write validated info to cities.ts

## Known context
- cities.ts currently has NO tempe-az entry (slug appears only in nearbyCities arrays of mesa-az/gilbert-az/chandler-az). Entry must be APPENDED only — never modify existing blocks.
- State file: build, attempts 0.
- Build gates: G1,G2,G3,G4,G8,G21,G25,G29,G36,G37,G38,G40,G41,G42,G58,G62 + local integrity (city entry, images on disk, no cross-city photos, slop scan) + G3/G5/G13/G4/G37/hospital_count/visual_check/H-HUMANIZE/H-SHAPE per orchestrator.

## Findings (to be filled during research)
### Doulas (need 2+)
- [pending]

### Hospitals (need 2+)
- [pending]

### Birth centers (need 1+)
- [pending]

## Fail condition
If <2 real doulas evidenced via free discovery → record evidence here, run
`tjb-pipeline-state.py fail tempe-az build "insufficient provider evidence (N found)"` and report FAIL lane with evidence.