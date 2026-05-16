# City Launch Checklist — True Joy Birthing

No city page deploys without every section below checked.

---

## A. Trust & Local Accuracy

- [ ] No fake-local-presence language
- [ ] Hospitals, birth centers, roads, and local details verified from primary/reputable sources
- [ ] Any uncertain claim is clearly flagged for human review (not stated as fact)
- [ ] NICU levels, Medicaid/insurance notes, and pricing reviewed by a human

## B. Page Quality & Structure

- [ ] `npm run validate` passes (data)
- [ ] `npm run test:city-pages` passes (HTML + schema)
- [ ] All current F-group SEO/LLM checks pass (no failures)
- [ ] FAQ questions follow the brand FAQ pattern
- [ ] FAQ anchors present (`faq-cost`, `faq-medicaid`, `faq-hospital`, `faq-brand`)
- [ ] Hospital section includes an H2 heading: "Hospital & Birth Center Info for {city}"

## C. Internal Links & Navigation

- [ ] All 7 pillar links present with correct anchor text and placement:
  - `/birth-plan-template/` — "free birth plan template"
  - `/birth-plan-checklist/` — "birth plan checklist"
  - `/benefits-of-a-doula/` — "benefits of having a doula"
  - `/doula-cost/` — "doula cost guide"
  - `/how-to-choose-a-doula/` — "how to choose a doula"
  - `/postpartum-doula/` — "postpartum support"
  - `/about/` — "Shelbi Kohler"
- [ ] Nearby cities use only valid existing slugs
- [ ] BreadcrumbList schema present; visible breadcrumb nav (once implemented) matches it

## D. Voice & Usefulness

- [ ] Hero, culture, and hospital paragraphs sound like True Joy Birthing:
  - Mom-to-mom tone
  - "If we're being real" candor in the hospital section
  - Birth-plan CTA present in the first hospital paragraph
- [ ] Page clearly answers:
  - What birth options look like in this city
  - Typical doula costs here
  - Medicaid/insurance reality here
  - How to get started with a birth plan and the app
- [ ] Content is locally specific (no city-swap boilerplate)

## E. Deploy Gate

- [ ] Review packet delivered and read
- [ ] Human reviewer has:
  - Voice-edited as needed
  - Confirmed NICU/Medicaid/insurance/pricing
- [ ] Explicit "deploy {city}" approval given in this channel
- [ ] Live URL spot-checked after deploy (H1, hero, hospitals, FAQ, schema present)