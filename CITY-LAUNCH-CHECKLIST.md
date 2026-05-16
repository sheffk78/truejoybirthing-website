# City Launch Checklist — True Joy Birthing

No city page deploys without every section below checked.

---

## A. Trust & Local Accuracy

- [ ] No fake-local-presence language (service area only)
- [ ] Hospitals, birth centers, roads, and local details verified from primary/reputable sources
- [ ] Any uncertain claim is flagged as needing human verification, not stated as fact
- [ ] NICU levels, Medicaid/insurance notes, and pricing reviewed by a human

## B. Page Quality & Structure

- [ ] `npm run validate` passes
- [ ] `npm run test:city-pages` passes
- [ ] All current F-group SEO/LLM checks pass (no failures)
- [ ] FAQ questions follow the brand pattern
- [ ] FAQ anchors present: `faq-cost`, `faq-medicaid`, `faq-hospital`, `faq-brand`
- [ ] Hospital section includes an H2: "Hospital & Birth Center Info for {city}"

## C. Internal Links & Navigation

- [ ] All 7 pillar links present with correct anchors and locations
- [ ] Nearby cities use only valid existing slugs
- [ ] Breadcrumb schema present; visible breadcrumb nav (once implemented) matches it

## D. Voice & Usefulness

- [ ] Hero, culture, and hospital paragraphs sound like TJB (mom-to-mom tone, "if we're being real" candor)
- [ ] Birth-plan CTA present in the first hospital paragraph
- [ ] Page clearly answers:
  - What birth options look like in this city
  - Typical doula costs here
  - Medicaid/insurance situation here
  - How to start with a birth plan + app
- [ ] Content is locally specific, not city-swapped boilerplate

## E. Deploy Gate

- [ ] Review packet read
- [ ] Human reviewer has voice-edited as needed and confirmed NICU/Medicaid/insurance/pricing
- [ ] Explicit "deploy {city}" given in this channel
- [ ] Live URL spot-checked after deploy