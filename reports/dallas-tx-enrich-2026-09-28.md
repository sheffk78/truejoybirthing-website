# dallas-tx ENRICH Stage Report — 2026-09-28

**Status:** ✅ COMPLETE — all gates pass, merge self-verified via git diff.

## What was done

### 1. Bulk pre-warm provider photos (DoulaMatch + Bornbir city pages)
- Bornbir Dallas city page found at `bornbir.com/dallas/tx/doula` (not `/dallas-tx/`): extracted 6 named doula avatars (Cheryl Abrams, Kendal-Leigh Williams, Lala G, Chloe Qabilah Smith, Savannah Gomez, Kimberly Brown) → 200×200 JPEGs
- DoulaMatch city list at `doulamatch.net/list/city/us/tx/dallas`: 10 doula thumbs (Felicia Melton, Preston Postpartum Co, Laura Fortner, Scarlett Rosas, Holly Dalehite Haney, Tianna Proctor, Melissa Espey-Mueller, LaJoi Carter, Nyc Jones, Cortni Simon RN)
- Pool: `public/images/pre-warmed/dallas-tx/` — 16 photos total, naming convention `bornbir-<name>.jpg` / `doulamatch-<name>.jpg` (matches cary-nc precedent)

### 2. Per-provider photo sourcing (headshot → logo → initials)
- **Delilah Ray (Cherish Birth):** tier-1 headshot from cherishbirth.com/about (250×355) → `provider-dallas-tx-delilah-ray.webp`. DoulaMatch only had a 99px thumb (below quality bar) — practice site supplied the real headshot.
- **Becky Hines (Dallas Birth):** tier-1 headshot from dallasbirth.com team profile (400×267 webp→jpg) → `provider-dallas-tx-becky-hines.webp`
- All 5 dallas-tx providers now have photos; 0 empty.

### 3. Pricing
- 0 "Contact for pricing" placeholders existed (all 5 providers already carry real dollar costRanges: $1,375–$1,400 / $1,200–$2,800 / $800–$2,500 / $1,200–$2,400 / $4,000–$6,000). Verified, nothing to replace.

### 4. Hospital descriptions 300+ chars, all 8 mom-question topics
All 5 hospital paragraphs rewritten (804–1422 chars, all ≥300):
| Hospital | len | facts added (all source-verified) |
|---|---|---|
| Texas Health Presbyterian | 1422 | 888 beds, Level IV maternal, Margot Perot Center, Golden Hour 1-support-person policy, partner overnight couch rooms, 7-day lactation consultants, free interpreters, baby-friendly birth practices |
| Baylor University Medical Center | 1149 | 914 beds, New Family Center all-private rooms w/ daybeds, overnight partner stays, doulas+labor coaches explicitly welcome, baby-friendly birth practices, skin-to-skin, certified lactation consultants + Simply Mom's boutique, free interpreter services |
| Parkland Memorial | 1228 | 882 licensed beds (+2026 expansion >980), first Level III NICU in Dallas, WISH Tower private LDR suites w/ fold-out couch, Baby-Friendly designated (2019), visiting hours 5am–9pm, 240+ language interpretation w/ on-staff Spanish translators |
| Medical City Dallas | 1253 | 934 beds (2025 Fast Facts), Level IV NICU + Level IV maternal (Texas DSHS), hotel-like suites w/ Murphy beds, quiet-time hours, 'Best Hospital to Have a Baby' ×5, Texas Ten Step, interpreter services, U.S. News 'Birthing-Friendly' |
| Methodist Dallas | 1153 | 595 beds, FIRST Baby-Friendly hospital in Dallas (corrected understatement "Baby-Friendly-style"), Texas Ten Step ×5, private LDR suites w/ partner overnight, free interpreter + sign-language services |

Birth center paragraphs (Swiss Avenue 875, DFW Community 804) unchanged — already ≥300.

### 5. Hospital/birth-center photos
- 7 thumbnails verified on disk, dimensions 400×300 to 1200×800, color-entropy check all ≥937 unique colors (photo range, not logo/silhouette). No replacements needed.

### 6. Birth center verification (target city = Dallas)
- **Swiss Avenue Birth & Wellness:** operating — live site with 2026 class schedule, 214.774.9000 (403 to curl = Cloudflare bot block, verified via search captures)
- **DFW Community Birth & Wellness:** operating — live site, 4612 Gaston Avenue, Dallas TX 75246 ("closed" hits were SVG path data, not status)

## Verification chain
- `npx tsc --noEmit`: 0 errors in cities.ts (fixed one double-quote-in-string bug introduced during edit)
- `bash scripts/merge-enriched-data.sh dallas-tx`: exit 0, patch log `/tmp/dallas-tx-enrich-patch.log`
- git diff self-verification: 7 dallas-tx line replacements, enrichedAt 2026-08-08→2026-09-28, both provider photos, all 13 fact markers present in + lines
- Coverage matrix: 5/5 hospitals × 8/8 topics (NICU, beds, doula policy, visitor/overnight, baby-friendly, lactation, language services, birthing rooms)
- All 12 referenced images exist on disk

## Files produced/modified
- `src/data/cities.ts` — dallas-tx block enriched (63 ins / 8 del total in working tree; 7 dallas line replacements are ours, gilbert-az additions from a parallel session left untouched)
- `public/images/provider-dallas-tx-delilah-ray.webp` (new)
- `public/images/provider-dallas-tx-becky-hines.webp` (new)
- `public/images/pre-warmed/dallas-tx/` — 16 new pool photos
- `scripts/enrich-dallas-tx.py` — idempotent enrichment script (kept for audit/re-run)

## Notes for next stage
- Working tree also contains an unrelated uncommitted gilbert-az city block (another session's work) — do not attribute to dallas-tx; coordinate before commit.
- No commit was made (ENRICH stage contract: merge + verify only; commit/preflight belongs to the orchestrator's next stage).