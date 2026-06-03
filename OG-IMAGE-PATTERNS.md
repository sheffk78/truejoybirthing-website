# OG Image Patterns — Research & Proposals

**Status:** Ready for Jeff review. No implementation until patterns are approved.

---

## Research: Real-World OG Card Examples

### Category 1: Service/Product Pages (logo + key message + supporting image)

#### Example 1: Notion (notion.so)
**Pattern:** Dark background, centered headline, small logo at bottom center
- Layout: Bold white headline centered ("Your 24/7 AI team"), small logo at bottom center
- Background: Deep navy gradient with abstract 3D iconography
- Why it works: Maximum readability. The headline dominates at any size. The logo is present but doesn't compete. At thumbnail size, you still read the value prop instantly.
- **Takeaway for TJB:** Bold headline + small logo is the strongest pattern for conveying a clear message at OG card scale.

#### Example 2: Maven Clinic (mavenclinic.com)
**Pattern:** Photo on right, gradient scrim on left, text over scrim, logo top-left
- Layout: Full-bleed photo (mother + child on couch), heavy dark scrim on left half, white text over scrim, green CTA buttons, "MAVEN" logo in top-left
- Why it works: Emotion through photos, trust through text. The photo draws you in; the text tells you what it is. The scrim makes text readable over any photo.
- **Takeaway for TJB:** Photo + scrim + text is the right pattern for our Confidence Session and service pages — but only with real photos, not AI.

#### Example 3: Headspace (headspace.com)
**Pattern:** App mockup on colored background, floating decorative elements
- Layout: Two phone mockups showing the app UI, surrounded by floating emoji-style elements (sun, moon, flower)
- Why it works: Shows the actual product experience. The playful elements match the brand personality.
- **Takeaway for TJB:** Product mockups work when the product exists. Since our app is real and our PDF is real, showing actual screenshots is the right approach — but we need real screenshots, not AI mockups.

---

### Category 2: Local/Location Pages

#### Example 4: Thumbtack (thumbtack.com/co/denver/)
**Pattern:** 3D phone mockup with city-specific search results
- Layout: Two tilted phones showing app screens with "House cleaners in Atlanta, GA" visible
- Why it works: City name is explicit and readable. Shows search results, proving the service exists locally.
- **Takeaway for TJB:** The "city name on card" pattern is essential for location OG cards. Even if we use a simpler layout than a 3D mockup, the city must be in readable text on the card.

#### Example 5: Ovia Health (oviahealth.com)
**Pattern:** Full-bleed photo with logo overlay, no text beyond brand name
- Layout: Emotive baby photo, white "oviahealth" logo centered-left over blurred foreground
- Why it works at full size: Emotional, human, trustworthy.
- Why it FAILS at OG size: No value proposition text. At thumbnail size, you see a baby photo and a brand name but don't know what the service is.
- **Takeaway for TJB:** Photo-only cards without text are a missed opportunity. Every OG card should answer "what is this?" at thumbnail size.

---

## Proposed Patterns for True Joy Birthing

### Pattern A: Product/Service Pages
**For:** Homepage, Birth Plan Template, Confidence Session, About, Ambassador, etc.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  (cream-to-lavender gradient background)                     │
│                                                              │
│                                                              │
│                                                              │
│           Bold headline text                                  │
│           (2-3 lines max)                                     │
│                                                              │
│           Subhead or tagline                                  │
│           (1 line, smaller weight)                            │
│                                                              │
│                                                              │
│  ┌─────────────┐                                             │
│  │ TJB logo    │                                             │
│  │ (silhouette │                                             │
│  │  + wordmark)│                                             │
│  └─────────────┘                                             │
│                                                              │
│  ─── dusty rose accent bar ───                                │
└──────────────────────────────────────────────────────────────┘
```

**Specs:**
- Canvas: 1200×630
- Background: `#FAF8F5` cream → `#E8E6F0` lavender gradient (vertical, top to bottom)
- Logo: bottom-left, ~200px from left edge, ~40px from bottom accent bar
- Headline: centered, `#2D2B55` charcoal, 52–60px, max 2-3 lines
- Subhead: centered, `#6E6C99` lavender-600, 24–28px
- Accent bar: bottom 6px, `#D8A0C4` dusty rose
- Top accent bar: top 6px, `#D8A0C4` dusty rose

**Page-specific examples:**
| Page | Headline | Subhead |
|---|---|---|
| Homepage | "Walk Into Your Birth Feeling Prepared" | "Free birth plan · Guided walkthrough · 1:1 coaching" |
| Confidence Session | "Your Birth Plan, Reviewed Line by Line" | "60-75 min Zoom · $250 · Limited spots" |
| Birth Plan Template | "The Birth Plan Your Nurse Can Read in 2 Minutes" | "Free fillable PDF · No email required" |
| About | "Joyful Birth Plan" | "Birth education and planning tools" (logo-only card) |

---

### Pattern B: Location/City Pages
**For:** /birth-support/[state]/, /birth-support/[city]/

```
┌──────────────────────────────────────────────────────────────┐
│  ─── dusty rose accent bar ───                                │
│                                                              │
│                                                              │
│                          ┌───────────────┐                   │
│                          │               │                   │
│                          │  City photo   │                   │
│                          │  (skyline/    │                   │
│                          │   landmark)   │                   │
│                          │               │                   │
│                          │               │                   │
│  Birth Support            │               │                   │
│  in Denver, CO            │               │                   │
│                           └───────────────┘                   │
│                                                              │
│  ┌─────────────┐                                             │
│  │ TJB logo    │                                             │
│  │ (silhouette │                                             │
│  │  + wordmark)│                                             │
│  └─────────────┘                                             │
│                                                              │
│  ─── dusty rose accent bar ───                                │
└──────────────────────────────────────────────────────────────┘
```

**Specs:**
- Canvas: 1200×630
- Background: `#FAF8F5` cream (solid, no gradient — cleaner for text against photo)
- Photo: right 45% of card, full bleed top/bottom, rounded corners on left side (16px). Uses existing `*-birth-doula-skyline.webp` images (these are city photos, not AI people).
- Text: left 55% of card
  - City name: "Denver" in 52px `#2D2B55` charcoal, bold
  - State: ", CO" in 36px `#6E6C99` lavender-600
  - "Birth Support" above city name: 20px `#6E6C99` lavender-600, uppercase, letter-spacing 1px
- Logo: bottom-left, same placement as Pattern A
- Accent bars: top and bottom 6px, `#D8A0C4` dusty rose

**Why this works for location pages:**
1. "Birth Support in Denver, CO" is instantly readable at thumbnail size — the city name is the biggest text on the card
2. City skyline photo on the right provides visual specificity
3. Logo in bottom-left establishes brand without competing with the city name
4. The skyline photos are our best existing per-city assets (city photos, not AI people — they're 1200×800 and generally clean)
5. Pattern is template-friendly — one HTML template, just swap `city`, `state`, and `skyline-photo`

---

### Pattern C: Logo-Only (Fallback)
**For:** Pages that don't have a specific headline or photo (error pages, generic share)

This is what we already have: just the TJB logo centered on a cream gradient with "Joyful Birth Plan" tagline. Used as the site-wide default when no Pattern A or Pattern B applies.

---

## Summary Comparison

| Pattern | Used For | Key Elements | Text Size | Photo? |
|---|---|---|---|---|
| A: Product/Service | Homepage, Confidence Session, Template, About | Headline + subhead + logo bottom-left + accent bars | 52–60px headline | No (text-only gradient bg) |
| B: Location/City | /birth-support/[city]/, /birth-support/[state]/ | City name + "Birth Support" label + skyline photo right + logo bottom-left | 52px city name | Yes (existing skyline images) |
| C: Logo-Only | Default fallback | Logo centered + tagline | 26px tagline | No |

---

## Implementation Notes (Pending Approval)

- Pattern A and C can be rendered server-side via HTML → Playwright screenshot (same approach as current OG card)
- Pattern B requires per-city generation since each card has a unique city name + skyline photo
- All three use the same color palette: `#FAF8F5` cream, `#E8E6F0` lavender, `#2D2B55` charcoal, `#6E6C99` lavender-600, `#D8A0C4` dusty rose
- Font: Inter (already loaded on the site, consistent with product UI)
- Skyline images for Pattern B already exist: 180+ `*-birth-doula-skyline.webp` files at 1200×800

**Decision needed from Jeff:**
1. Does Pattern A (headline + logo bottom-left) work for product pages?
2. Does Pattern B (city name + skyline photo + logo bottom-left) work for location pages?
3. Should Pattern A include a small product image/screenshot where available, or stay text-only?
4. For Pattern A pages with real photos available (e.g., Confidence Session with a real Shelbi headshot), should we use Pattern A or a photo-scrim variant like Maven Clinic's approach?