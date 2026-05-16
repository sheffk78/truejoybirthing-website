# City Launch Checklist — True Joy Birthing

Every city page must pass all four gates before deploy. If any hard gate fails, **do not deploy**.

---

## A. Trust + local accuracy

- [ ] No fake-local-presence language
- [ ] Hospitals, birth centers, roads, and local details verified from primary or high-confidence sources
- [ ] Any uncertain claim is flagged for human review, not stated as fact
- [ ] NICU, Medicaid, insurance, and pricing reviewed by a human before deploy

## B. Page quality

- [ ] City page passes `npm run validate && npm run test:city-pages`
- [ ] Required SEO + LLM checks pass (F2, F4, F5, F7, F8 — hard failures after Sprint 1)
- [ ] FAQ pattern matches brand standard (`faq-cost`, `faq-medicaid`, `faq-hospital`, `faq-brand`)
- [ ] Internal links to the 7 pillar pages are present with correct anchor text
- [ ] Nearby cities use valid existing slugs only (checked by A5 in validate-cities.ts)

### Pillar page internal links (required on every city page)

| Pillar | Anchor text | Expected location |
|---|---|---|
| `/birth-plan-template/` | "free birth plan template" | Hospital paragraph CTA + Next Steps |
| `/birth-plan-checklist/` | "birth plan checklist" | Next Steps |
| `/benefits-of-a-doula/` | "benefits of having a doula" | Culture section |
| `/doula-cost/` | "doula cost guide" | Doula cost section |
| `/how-to-choose-a-doula/` | "how to choose a doula" | Medicaid/insurance section |
| `/postpartum-doula/` | "postpartum support" | Doula cost section |
| `/about/` | "Shelbi Kohler" | Reviewer attribution line |

## C. Voice + usefulness

- [ ] Hero, culture, and hospital paragraphs sound like TJB, not encyclopedia copy
- [ ] Page answers: cost, hospitals/birth settings, Medicaid, local support, next steps
- [ ] Content is locally specific, not city-swapped boilerplate

## D. Publish gate

- [ ] Reviewer confirms 8–10 minute human pass is done
- [ ] Live URL spot-check completed after deploy
- [ ] If any hard gate fails, do not deploy