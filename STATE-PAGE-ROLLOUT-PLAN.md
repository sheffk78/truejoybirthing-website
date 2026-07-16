# State Page Rollout Plan: Hero Images, OG Images, and Content Enrichment

## Current State (as of July 16, 2026)

### 28 state pages total
All 28 have pages rendered via `src/pages/birth-support/[state].astro`.

### Already complete (6 states)
These 6 states have `stateData` entries (medicaidNarrative, doulaRegulations, birthStats):
- **CO** — also has hero image + OG image (the template state)
- **CA** — has stateData, no images
- **TX** — has stateData, no images
- **NY** — has stateData, no images
- **WA** — has stateData, no images
- **VA** — has stateData, no images

### Needs everything (22 states)
No stateData enrichment, no images, no FAQ:
AZ, CT, FL, GA, ID, IL, IN, MA, MD, MI, MN, NC, NJ, NV, OH, OK, OR, PA, RI, SC, TN, UT

### Needs images only (5 states)
Have stateData but no hero/OG images:
CA, TX, NY, WA, VA

---

## Three Workstreams Per State

### 1. Hero + OG Image (all 27 remaining states)
**What:** AI-generated photo of iconic state landmark at golden hour with pregnant woman silhouette.

**Steps per state:**
1. Generate photo via `image_generate` (prompt template below)
2. Download raw image to `/tmp/state-{code}-hero-raw.png`
3. Crop to 3:2 from center (not 16:9 to 3:2 which causes black bars):
   - If raw is 16:9 (1024x576): crop width to 864px, keep full 576px height, then resize to 1200x800
   - If raw is another ratio: crop width to `height * 1.5` from center, resize to 1200x800
4. Convert to webp: `cwebp -q 85` for full (1200x800) and `cwebp -q 80 -resize 600 400` for responsive
5. Save to `public/images/state-{code}-{landmark}.webp` and `-600.webp`
6. Copy cropped PNG to `scripts/og-state-{code}-photo.png` for OG composition
7. Create OG composition HTML from the CO template (copy, swap text + photo path)
8. Render OG to `public/images/og/og-state-{code}.png` via Playwright + sharp
9. Add entry to `stateImages` registry in `states.ts`

**Image prompt template:**
```
A serene, warm photograph of [ICONIC LANDMARK] at golden hour. [BRIEF SCENE DESCRIPTION]. A pregnant woman in silhouette stands in the foreground, hand resting on her belly, looking toward [LANDMARK]. Cinematic lighting with deep oranges, golds, and soft yellows contrasting with dark silhouettes. Soft-focus natural landscape background. Mood: warmth, peace, anticipation, nurturing. Editorial quality. No text, no logos.
```

### 2. Content Enrichment (22 states needing stateData)
**What:** Research and write state-specific content for the stateData registry.

**Per state, add to `states.ts`:**
- `medicaidNarrative` — 3-5 sentences with specific details: program name, implementation date, coverage scope, reimbursement rates, provider enrollment requirements, citation
- `doulaRegulations` — 3-4 sentences: licensing status, voluntary certifications, related birth professional regulations (midwives, birth centers)
- `birthStats` — verified from CDC NCHS or March of Dimes: cesareanRate, maternalMortalityRate, homeBirthRate, birthCenterBirthRate, dataYear, dataSource
- `faq` — 4-6 Q&A pairs specific to that state

**Quality rules:**
- NO em dashes (use periods, commas, semicolons)
- 3-4 sentence paragraphs with specific details
- Natural keyword usage for SEO
- Verify all facts via web search

### 3. FAQ for Existing States (5 states)
CA, TX, NY, WA, VA have stateData but no FAQ entries. Add 4-6 FAQ per state.

---

## Execution Plan

### Phase 1: High-traffic states (10 states)
Priority by city count. These get the most organic traffic.

| State | Cities | Needs | Iconic Landmark |
|-------|--------|-------|-----------------|
| CA | 14 | Images + FAQ | Golden Gate Bridge or Yosemite Half Dome |
| TX | 10 | Images + FAQ | San Antonio River Walk or Big Bend |
| MD | 6 | Images + Content + FAQ | Baltimore Inner Harbor or Chesapeake Bay |
| WA | 4 | Images + FAQ | Mt. Rainier or Seattle Space Needle |
| NY | 4 | Images + FAQ | NYC skyline or Niagara Falls |
| VA | 4 | Images + FAQ | Shenandoah Mountains or Colonial Williamsburg |
| CT | 4 | Images + Content + FAQ | Mystic Seaport lighthouse or New England coast |
| FL | 4 | Images + Content + FAQ | Miami South Beach or Everglades |
| NV | 3 | Images + Content + FAQ | Red Rock Canyon or Las Vegas Strip |
| TN | 3 | Images + Content + FAQ | Great Smoky Mountains or Nashville skyline |

### Phase 2: Medium states (10 states)

| State | Cities | Needs | Iconic Landmark |
|-------|--------|-------|-----------------|
| GA | 2 | Images + Content + FAQ | Savannah oak trees or Atlanta skyline |
| OR | 2 | Images + Content + FAQ | Crater Lake or Portland bridges |
| MN | 2 | Images + Content + FAQ | Minneapolis Stone Arch Bridge or Boundary Waters |
| AZ | 2 | Images + Content + FAQ | Grand Canyon or Saguaro cactus desert |
| IL | 2 | Images + Content + FAQ | Chicago skyline or Lake Michigan |
| MI | 2 | Images + Content + FAQ | Detroit skyline or Great Lakes |
| PA | 2 | Images + Content + FAQ | Philadelphia skyline or Pittsburgh bridges |
| MA | 2 | Images + Content + FAQ | Boston Common or Cape Cod |
| OK | 2 | Images + Content + FAQ | Wichita Mountains or Oklahoma City skyline |
| OH | 2 | Images + Content + FAQ | Cleveland Lake Erie or Cincinnati skyline |

### Phase 3: Small states (7 states)

| State | Cities | Needs | Iconic Landmark |
|-------|--------|-------|-----------------|
| NC | 2 | Images + Content + FAQ | Blue Ridge Mountains or Outer Banks lighthouse |
| NJ | 1 | Images + Content + FAQ | Jersey Shore or Atlantic City |
| RI | 1 | Images + Content + FAQ | Newport Cliff Walk or Providence skyline |
| IN | 1 | Images + Content + FAQ | Indianapolis Monument Circle or Indiana Dunes |
| SC | 1 | Images + Content + FAQ | Charleston harbor or Hilton Head |
| ID | 1 | Images + Content + FAQ | Sawtooth Mountains or Boise River |
| UT | 1 | Images + Content + FAQ | Zion National Park or Salt Lake Temple |

---

## Batch Execution Strategy

### How to run it
Each phase can be executed in batches of 3-5 states using parallel subagents.

**Batch pattern per 5 states:**
1. Spawn 5 subagents in parallel:
   - 2 for image generation + optimization (image_generate, crop, webp, OG render)
   - 3 for content research (web_search for birth stats, Medicaid details, doula regs)
2. Collect results
3. Add all entries to `states.ts` (stateImages + stateData)
4. Build + deploy
5. Verify 5 pages live

**Estimated time:**
- Per state: ~5 min (image gen + content research, running in parallel)
- Per batch of 5: ~8 min
- Per phase: ~20 min (2-3 batches)
- Total: ~60 min across all 27 states

### Delegation template for content research
```
Research birth statistics and Medicaid doula coverage for [STATE].
Return:
1. Medicaid doula coverage narrative (3-5 sentences with specific details: program name, date, rates, enrollment, citation)
2. Doula regulations (3-4 sentences: licensing, certifications, related midwife/birth center regs)
3. Birth statistics (cesarean rate, maternal mortality, home birth rate, birth center rate, with source)
4. 4-6 FAQ entries (question + answer, state-specific)
Rules: NO em dashes. Use periods, commas, semicolons. Verify all facts via web search.
Format as TypeScript matching the StateData interface in src/data/states.ts.
```

### Delegation template for image generation
```
Generate a hero image for [STATE] state page.
1. Use image_generate with this prompt: [prompt]
2. Download to /tmp/state-{code}-hero-raw.png
3. Crop to 3:2 (if 16:9 source, crop width to 864px center, keep full height)
4. Convert to webp at q85 (1200x800) and q80 (600x400)
5. Save to public/images/state-{code}-{landmark}.webp and -600.webp
6. Copy cropped PNG to scripts/og-state-{code}-photo.png
7. Create OG composition HTML (copy scripts/og-state-co-composition.html, swap text + photo)
8. Render OG to public/images/og/og-state-{code}.png via Playwright
9. Return the stateImages entry for states.ts
```

---

## Files Modified

| File | Changes |
|------|---------|
| `src/data/states.ts` | Add 27 stateImages entries + 22 stateData entries + 5 FAQ additions |
| `public/images/state-*` | 27 hero images (webp) + 27 responsive variants |
| `public/images/og/og-state-*` | 27 OG images (PNG) |
| `scripts/og-state-*-composition.html` | 27 OG composition templates |
| `scripts/og-state-*-photo.png` | 27 OG source photos |

## Verification Per Batch
1. Build passes (`npm run build`)
2. Check 1-2 pages in built HTML for hero image + OG meta + new content sections
3. Deploy to Cloudflare Pages
4. Browser verify live page (hard refresh)
5. Check OG image loads via direct URL

## Cost
Zero incremental. GLM-5.2 via flat-rate proxy for all content research. Image generation via FAL (included in plan).