# TJB UI Rules — Buttons & Forms

Site-wide design standards for True Joy Birthing. Anything that ships should follow these rules. If it breaks them, flag it before fixing.

---

## Buttons

### Primary: `btn-primary`
The **only** class for primary actions. Use it everywhere.

| Property | Value |
|---|---|
| Background | `--color-tjb-lavender-600` |
| Text color | `#FFFFFF` (white) |
| Radius | `9999px` (full pill) |
| Padding | `0.875rem 2rem` |
| Font weight | `600` |
| Font size | `0.9375rem` |
| Letter spacing | `0.025em` |
| Hover | `bg-tjb-rose-500`, `translateY(-1px)`, `box-shadow: 0 4px 14px rgba(155,94,132,0.25)` |
| Focus | `outline: 3px solid tjb-lavender-400`, `outline-offset: 2px` |
| Active | `translateY(0)` |

```html
<a href="#book" class="btn-primary">Request a Confidence Session</a>
```

**Reference implementations:** Homepage hero CTA, Confidence Session #book form submit button.

### Secondary: `btn-secondary`
Outline style for secondary actions (next to a primary CTA).

| Property | Value |
|---|---|
| Background | `transparent` |
| Text color | `--color-tjb-lavender-600` |
| Border | `2px solid --color-tjb-lavender-600` |
| Radius | `9999px` |
| Padding | `0.75rem 1.875rem` |
| Hover | Fills to `bg-tjb-lavender-600` with white text |

### Accent: `btn-accent`
Rose variant for dark backgrounds only. Rarely used.

| Property | Value |
|---|---|
| Background | `--color-tjb-rose-600` |
| Text color | `#FFFFFF` |
| Radius | `9999px` |
| Padding | `0.875rem 2rem` |

### Rules

1. **No `bg-tjb-charcoal` buttons.** Charcoal is for text, not buttons. Every primary action uses `btn-primary` (lavender pill). The only current offenders are the city/state birth support pages — they need migration.
2. **No inline button styles that duplicate `btn-primary`.** If you find yourself writing `bg-tjb-lavender-600 text-white px-8 py-3.5 rounded-full font-semibold`, just use `btn-primary`. The App Store badges on homepage and about are acceptable exceptions (they have extra properties like `border-transparent`).
3. **CTA text should be short and action-oriented.** "Request a Confidence Session" ✓. "Book a Birth Plan Confidence Session" ✗ (too long). Max 5 words.
4. **Only one primary CTA per section.** Secondary actions get `btn-secondary` or a text link.

---

## Forms

### Standard Form Pattern (Cream Card)

Forms live inside a **cream card on white background** — never directly on a tinted section.

```html
<section class="py-16 md:py-20 bg-white">
  <div class="max-w-xl mx-auto px-6">
    <div class="bg-tjb-cream rounded-2xl p-8 md:p-10">
      <!-- Form heading -->
      <!-- Form fields -->
      <!-- Submit button -->
    </div>
  </div>
</section>
```

### Input Fields

| Property | Value |
|---|---|
| Radius | `rounded-xl` (not `rounded-full` or `rounded-lg`) |
| Border | `border border-tjb-lavender-200` |
| Padding | `px-5 py-3.5` |
| Focus | `focus:outline-none focus:border-tjb-rose-400 focus:ring-1 focus:ring-tjb-rose-400` |
| Background | `bg-white` |
| Font size | `text-[0.9375rem]` |

```html
<div class="mb-5">
  <label for="field" class="block text-sm font-medium text-tjb-charcoal mb-1.5">
    Label <span class="text-tjb-rose-500">*</span>
  </label>
  <input id="field" type="text" required placeholder="Placeholder text"
    class="w-full px-5 py-3.5 rounded-xl border border-tjb-lavender-200 focus:outline-none focus:border-tjb-rose-400 focus:ring-1 focus:ring-tjb-rose-400 bg-white transition-colors text-[0.9375rem]" />
</div>
```

### Labels

- Required: `text-sm font-medium text-tjb-charcoal mb-1.5`
- Required marker: `<span class="text-tjb-rose-500">*</span>` (not "(required)" text)
- Optional: `<span class="text-tjb-gray-400 font-normal">(optional)</span>`
- Field spacing: `mb-5` between fields, `mb-8` before submit button

### Submit Button

Always `btn-primary`. Full width on mobile, auto width on desktop if form is narrow.

```html
<button type="submit" class="btn-primary w-full text-center">Submit</button>
```

### Success State

Replace the form with a confirmation card:

```html
<div class="bg-white rounded-xl p-8 shadow-sm border border-tjb-lavender-200">
  <p class="text-green-700 font-semibold text-lg mb-3">✓ Confirmation message</p>
  <p class="text-tjb-gray leading-relaxed">What happens next.</p>
</div>
```

### Rules

5. **No `rounded-full` inputs.** Pill-shaped inputs belong to the old pattern. New standard is `rounded-xl`.
6. **No `rounded-lg` inputs.** The contact and ambassador pages use `rounded-lg`. Migrate to `rounded-xl` when touched.
7. **No flat tinted backgrounds behind forms.** Forms go inside a `bg-tjb-cream rounded-2xl` card on a `bg-white` section. Never `bg-tjb-lavender-100` or `bg-tjb-lavender-50` as the form backdrop.

---

## Currently Out of Alignment

These pages break the rules above. Don't fix yet — flag and schedule.

| Page | Issue | Rule |
|---|---|---|
| `/contact/` | Form inputs use `rounded-lg` instead of `rounded-xl`; submit button uses inline style instead of `btn-primary` | Rules 5, 6 |
| `/ambassador/` | Form inputs use `rounded-lg` instead of `rounded-xl`; submit button uses inline style instead of `btn-primary` | Rules 5, 6 |
| Lead capture forms (`LeadCaptureForm.astro`, `city/LeadCaptureForm.astro`) | Inputs use `rounded-full border-tjb-lavender-300`; no focus ring; no cream card wrapper | Rules 5, 7 |

## Completed Migrations

| Change | Date | Scope |
|---|---|---|
| `bg-tjb-charcoal` buttons → `btn-primary` in city/state templates | June 2026 | `[city].astro`, `[state].astro` (all 180+ city pages, all 50 state pages) |
| Custom outline buttons → `btn-secondary` in city/state templates | June 2026 | `[city].astro`, `[state].astro` |
| AI-generated support images → `doula-teaching.webp` stock image | June 2026 | `[city].astro` (all 180+ city pages) |
| Confidence Session page: hero two-column + form cream card | June 2026 | `birth-plan-confidence-session.astro` |
| Confidence Session CTA: "Book" → "Request" | June 2026 | All pages site-wide |

### Image asset note

The per-city `*-birth-doula-support.webp` files (180 images, all 800×500 AI-generated with anatomical artifacts) are **deprecated**. They have been replaced in the template by `/images/doula-teaching.webp` (1024×1536, high-quality stock). The old files remain in `public/images/` but are no longer referenced. They can be safely deleted in a future cleanup.

### DoulaCardGrid component

`src/components/city/DoulaCardGrid.astro` — reusable card grid for local doula/midwife listings.
- Props: `doulas` (LocalDoula[]), `city` (string)
- Responsive: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`
- Card pattern: `bg-white rounded-xl p-6 shadow-sm border border-tjb-lavender-200/50 flex flex-col`
- CTA link: `btn-secondary` with "Visit website" text, no ↗ symbol
- Empty state: cream callout with Ambassador CTA and DONA directory link
- Heading `h2` is rendered by the parent page (conditionally hidden when zero doulas)