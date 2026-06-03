# Product Visual Strategy — TJB

**Status:** Interim placeholders live. Awaiting Jeff review before production push.

---

## Inventory: Product Visuals on 3 Target Pages

### Homepage (`/`)

| Image | File | Size | Used At | Verdict | Action Taken |
|---|---|---|---|---|---|
| Birth Plan hero preview | `birth-plan-preview.webp` | 576×320, 35KB | Hero right column | **AI mockup** — fake text, "pages" don't align, illegible content. Broken trust for a PDF product. | → Replaced with `birth-plan-preview-placeholder.webp` |
| Birth Plan booklet | `birth-plan-booklet-1.webp` | 800×814, 216KB | Item 01 ("Joyful Birth Plan") | **AI mockup** — stacked pages with gibberish text, 2025 copyright. Broken hands visible on close inspection. | → Replaced with `birth-plan-booklet-placeholder.webp` |
| Skin-to-skin birth | `skin-to-skin.webp` | 1400×933, 30KB | Hero full-width strip | **AI** — baby's hand is anatomically impossible (fingers fused). Mother's skin is waxy/plastic. Low trust for birth content. | → Replaced with `birth-moment-placeholder.webp` |
| Doula holding hands | `doula-holding-hands.webp` | 1024×1536, 54KB | Item 03 ("Confidence Session") | **AI** — hands fused together at center (impossible grip). Candle glow is fake. | → Replaced with `doula-support-placeholder.webp` |
| Doula teaching | `doula-teaching.webp` | 1024×1536, 104KB | "Built for Doulas" section | **AI** — presenter's hand distorted, audience feet merge into pillows. Passable at small size but still AI. | **Kept for now** — best of the AI photos, used in a secondary context |
| Shelbi headshot | `shelbi-thumb.webp` | 64×64, 1KB | Attribution line | Tiny avatar, not product visual. | **Kept** |
| App Store badge | `app-store-badge.svg` | N/A | Download link | Official badge. | **Kept** |

### Confidence Session (`/birth-plan-confidence-session/`)

| Image | File | Size | Used At | Verdict | Action Taken |
|---|---|---|---|---|---|
| Shelbi portrait | `shelbi-real.webp` | 1200×673, 35KB | Hero right column | **AI portrait** — necklace melts into skin, hair blends with background, wooden slats inconsistent. Misrepresents a real person. | → Replaced with `shelbi-portrait-placeholder.webp` |
| Shelbi portrait (small) | `shelbi-real.webp` | 1200×673, 35KB | "Who you'll work with" 1/3 column | Same AI portrait. | → Replaced with `shelbi-portrait-small-placeholder.webp` |

### Denver City Page (`/birth-support/denver-co/`)

| Image | File | Size | Used At | Verdict | Action Taken |
|---|---|---|---|---|---|
| Denver skyline | `denver-co-birth-doula-skyline.webp` | 1200×800, 108KB | Hero photo | AI city skyline — passable at distance. Not a product visual. | **Kept** — not a product image |
| Doula support | `denver-co-birth-doula-support.webp` | 800×500, 50KB | Mid-content support image | **AI** — anatomically broken hands/hands. | → Already replaced with `doula-teaching.webp` (previous commit) |

---

## What We Replaced (Interim Strategy)

All replacements are **branded text-on-cream placeholders** with lavender accents. They use brand colors (`tjb-cream`, `tjb-lavender-600`, `tjb-charcoal`) and Helvetica typography. They communicate the product name and value proposition clearly without claiming to show the actual product.

| Placeholder | Size | Replaces | Used On |
|---|---|---|---|
| `birth-plan-preview-placeholder.webp` | 576×320 | Hero PDF mockup | Homepage hero |
| `birth-plan-booklet-placeholder.webp` | 800×814 | Booklet stacked pages | Homepage Item 01 |
| `birth-moment-placeholder.webp` | 1400×933 | Skin-to-skin AI photo | Homepage hero strip |
| `doula-support-placeholder.webp` | 1024×1536 | Fused-hands AI photo | Homepage Item 03 |
| `shelbi-portrait-placeholder.webp` | 1200×673 | AI Shelbi portrait | Confidence Session hero |
| `shelbi-portrait-small-placeholder.webp` | 400×400 | AI Shelbi portrait (small) | Confidence Session "Who" section |

---

## What We Kept (Acceptable AI)

| Image | Why Kept | Risk Level |
|---|---|---|
| `doula-teaching.webp` | Best AI photo. Distortions only visible on close inspection. Used in a secondary context (Pro section), not as a trust-defining hero. | Low — acceptable interim |
| `*-birth-doula-skyline.webp` (180 files) | City skyline photos. AI-generated but passable at the sizes used. Not product visuals — they show cities, not people/hands. | Low — cities don't have anatomical errors |
| `shelbi-thumb.webp` (64×64) | Tiny avatar. Too small to see artifacts. | Negligible |
| `birth-plan-banner.webp` | Digital composite, not AI-generated. Acceptable. | None |

---

## Future Visuals Needed (Priority Order)

These are the 3 assets that would most improve trust and conversion:

### 1. Real Shelbi headshot (HIGHEST PRIORITY)
- **Where used:** Confidence Session hero + "Who you'll work with" + potentially homepage
- **Spec:** Professional headshot, lavender/cream top, neutral background. 1200×1600 portrait. Soft lighting, smile, warm expression.
- **Why it matters:** Shelbi is a real person selling a personal service. An AI portrait erodes the most important trust signal — "who will I be talking to on Zoom?"
- **Impact:** 2 pages, 3 image slots, highest-converting page on the site.

### 2. Real Birth Plan PDF screenshots (HIGH PRIORITY)
- **Where used:** Homepage hero, Item 01, potentially every birth-plan-related page
- **Spec:** 2–3 screenshots of the actual Joyful Birth Plan PDF. Show the first page (header + "About Me" section), a middle page (checkboxes for delivery preferences), and the final page. White background, lavender header, clean typography. 800px wide minimum.
- **Why it matters:** We're selling a PDF. Showing the actual product — even just the first page — builds more trust than any stock photo. The AI mockup currently shows gibberish text where the real PDF's text should be.
- **Impact:** Homepage (2 slots), potentially birth-plan-template page and OG images.

### 3. App screenshots (MEDIUM PRIORITY)
- **Where used:** Homepage "Start Pro" section, app store listings, download CTAs
- **Spec:** iPhone frame showing 1–2 screens from the TJB app. Birth plan builder view + completed plan view. 1200px wide minimum.
- **Why it matters:** The app is a key differentiator but has zero visual presence. Even a single screenshot would help.
- **Impact:** Homepage Pro section (currently showing AI doula-teaching), multiple CTA buttons.

---

## Other AI Images Still on Site (Not Changed Yet, Flagged for Review)

These are on other pages not in the current scope. Flagged for future cleanup:

- `doula-labor-support.webp` — AI, used on `/what-is-a-doula/` and similar pages
- `doula-birth-plan-couch.webp` — AI, people sitting on couch with fake "Birth Plan" paper
- `birth-plan-couch.webp` — same concept, AI, gibberish text on documents
- `birth-plan-template.webp` — AI, person holding pen with distorted hand and fake documents
- `birth-plan-checklist-hero.webp` — digital illustration, acceptable
- `birth-plan-checklist-portrait.webp` — digital illustration, acceptable
- `birth-plan-for-induction-hero.webp` — digital illustration, acceptable
- `birth-plan-for-induction-portrait.webp` — digital illustration, acceptable
- `c-section-birth-plan-portrait.webp` — digital illustration, acceptable
- `vbac-birth-plan-portrait.webp` — digital illustration, acceptable
- `online-education.webp` — AI, used on course pages
- `virtual-meeting.webp` — AI, used on confidence session page (not currently referenced)

**Rule of thumb:** Digital illustrations (watercolor/anime style) are acceptable and on-brand. AI photos of people with anatomical errors are not. Real photos and real product screenshots are the goal.