# About Page — "What You Get" Section Redesign Comparison

**Date:** June 16, 2026
**File:** `src/pages/about.astro`
**Scope:** Only the "What you get / One platform. Three ways in." section was changed. All other page sections (hero, "Why I built this", "Built for Doulas", CTA) are identical.

---

## 1. Layout Structure

| Aspect | Old (Three-Tier Model) | New (Three-Column Cards) |
|---|---|---|
| **Container width** | `max-w-5xl` (~1024px) | `max-w-6xl` (~1152px) |
| **Item arrangement** | Vertical stacked list (`space-y-0`) | Horizontal 3-column grid (`grid md:grid-cols-3 gap-6 md:gap-8`) |
| **Item orientation** | Horizontal row: number left, text right (`grid md:grid-cols-[3rem_1fr]`) | Vertical column: number top, visual middle, text bottom (`flex flex-col items-center text-center`) |
| **Item spacing** | `py-8` with `border-t` separators between items | `gap-6 md:gap-8` between cards, no borders |
| **Item container** | No container — just a grid row | Card: `p-8 bg-tjb-cream-50 rounded-2xl shadow-sm border border-tjb-lavender-200/30` |

## 2. Card / Container Styling

| Aspect | Old | New |
|---|---|---|
| **Background** | None (transparent, inherits section `bg-white`) | `bg-tjb-cream-50` (warm cream) |
| **Border radius** | None | `rounded-2xl` (16px) |
| **Shadow** | None | `shadow-sm` |
| **Border** | `border-t border-tjb-lavender-300/40` (top border only, between items) | `border border-tjb-lavender-200/30` (full card border) |

## 3. Number Badge (01 / 02 / 03)

| Aspect | Old | New |
|---|---|---|
| **Font size** | `text-3xl` (30px) | `text-5xl` (48px) |
| **Font weight** | `font-bold` | `font-bold` |
| **Font family** | `font-serif` | `font-serif` |
| **Opacity** | 100% (fully opaque) | `opacity-40` (40% opacity — much more subtle) |
| **Line height** | default | `leading-none` (tight, no extra space) |
| **Bottom margin** | none (inline in grid) | `mb-6` (24px gap below number) |
| **Color — 01** | `text-tjb-lavender-600` (darker lavender) | `text-tjb-lavender-400` (lighter lavender) |
| **Color — 02** | `text-tjb-rose-500` (medium rose) | `text-tjb-rose-300` (lighter rose) |
| **Color — 03** | `text-tjb-sage` (sage green) | `text-tjb-sage` (unchanged) |

## 4. Visual Elements

| Aspect | Old | New |
|---|---|---|
| **Images** | None — text only | Three distinct visuals: |
| **Card 1 visual** | — | PDF mockup: `birth-plan-mockup-square-pdf-3.webp`, 180px wide, rounded-lg, shadow-md |
| **Card 2 visual** | — | iPhone frame: custom HTML/CSS phone mockup (132×286px, black frame, notch, home bar) with `tjb-app-dashboard.png` inside |
| **Card 3 visual** | — | Video thumbnail: `tjb-video-thumb.webp` in a 220×124px container with play button overlay (white circle + lavender play triangle) |
| **Visual container** | — | `min-h-[180px]` to ensure consistent visual area height across all three cards |

## 5. Typography

| Aspect | Old | New |
|---|---|---|
| **Title size** | `text-2xl` (24px) | `text-2xl` (24px) — unchanged |
| **Title weight** | default (400) | `font-bold` (700) |
| **Title color** | default (inherits) | `text-tjb-charcoal` (explicit dark color) |
| **Title margin** | `mb-1` | `mb-1` — unchanged |
| **Subtitle size** | `text-sm` (14px) | `text-sm` (14px) — unchanged |
| **Subtitle weight** | `font-semibold` | `font-semibold` — unchanged |
| **Description size** | default (16px) | `text-sm` (14px) — smaller |
| **Description max-width** | none (full width) | `max-w-[260px]` (constrained width for better readability in card) |
| **Description color** | `text-tjb-gray` | `text-tjb-gray` — unchanged |

## 6. Call-to-Action Links

| Aspect | Old | New |
|---|---|---|
| **Placement** | Inline within the description paragraph | Separate link below description, pushed to card bottom |
| **Alignment** | Inline with text | `mt-auto` (flexbox auto margin to bottom of card) |
| **Font size** | Inherited from paragraph | `text-sm` (14px) |
| **Card 1 CTA** | `Download the free PDF` (inline link) | `Download the free PDF →` (separate link with arrow) |
| **Card 2 CTA** | `Download the free app` (inline link) | `Download the free app →` (separate link with arrow) |
| **Card 3 CTA** | `birth doula` (inline link to /what-is-a-doula/) | `Watch the walkthrough →` (separate link to /walkthrough/) |

## 7. Content Changes (Card 3)

| Aspect | Old | New |
|---|---|---|
| **Title** | "Doula Directory & Pro Mode" | "Video Walkthrough" |
| **Subtitle** | "For moms who want more support · For birth pros" | "5 guided videos · ~60 min total" |
| **Description** | "Find a certified birth doula in your area. And for doulas and midwives — client plans, visit tracking, notes, and invoicing built for birth work." | "Walk through every section of your birth plan with context — what each choice means, what the tradeoffs are, and what to say when a provider surprises you." |
| **CTA** | Link to `/what-is-a-doula/` | Link to `/walkthrough/` |

## 8. Summary of Design Changes

The old section was a **text-only vertical list** — clean and readable but visually flat. Each item was a horizontal row with a colored number and text content, separated by lavender top borders.

The new section is a **three-column card grid** with rich visuals pulled from the city guide video's CTA scene (CityCTASlide). Key design shifts:

1. **Text-only → visual-first**: Each card now has a prominent image/visual mockup that communicates the offering at a glance
2. **Vertical list → horizontal cards**: Better use of desktop space, more scannable
3. **Flat → dimensional**: Cards have cream backgrounds, rounded corners, shadows, and borders
4. **Subtler numbers**: Numbers are larger but at 40% opacity, acting as decorative accents rather than structural labels
5. **Constrained text**: Description text is smaller (14px) and max-width constrained for better card readability
6. **Separated CTAs**: Links moved from inline to dedicated positions at card bottoms with arrow indicators
7. **Card 3 re-themed**: Changed from "Doula Directory & Pro Mode" to "Video Walkthrough" to match the video scene's three-card structure (PDF → App → Video)
