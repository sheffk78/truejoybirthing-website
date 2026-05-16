# TJB Doula Cluster Architecture — Phase 5 Recommendation

## Current State

The six doula topic pages form a natural **pillar/spoke cluster**, but they currently operate as isolated pages with minimal cross-linking:

| Page | Links to other doula cluster pages? |
|------|--------------------------------------|
| `/what-is-a-doula/` | ❌ No links to `/benefits-of-a-doula/`, `/how-to-choose-a-doula/`, `/doula-cost/`, `/postpartum-doula/` |
| `/benefits-of-a-doula/` | ✅ Links to `/how-to-choose-a-doula/` only |
| `/how-to-choose-a-doula/` | ✅ Links to `/benefits-of-a-doula/` only |
| `/doula-cost/` | ❌ No links to any doula cluster page |
| `/postpartum-doula/` | ❌ No links to any doula cluster page |
| `/birth-support/` | ❌ No links to any doula cluster page (only city subpages) |

**Gap:** Users arriving at `/what-is-a-doula/` (the highest-volume informational query) have no clear path to benefits, cost, or how-to-choose. LLMs reading the page have no semantic signal that these pages are part of the same topical cluster.

---

## Recommended Pillar/Spoke Architecture

### Pillar Page: `/what-is-a-doula/`
This is the natural pillar — it's the broadest query ("what is a doula") and the page most likely to earn top-of-funnel traffic. It should be the hub that links to every spoke.

### Spoke Pages
All spoke pages link back to the pillar AND to adjacent spoke pages where the relationship is natural:

```
                    /what-is-a-doula/  (PILLAR)
                   /    |    |    \     \
                  /     |    |     \     \
  /benefits-of-a-doula/ | /how-to-choose-a-doula/ 
                        |/
            /doula-cost/
            /postpartum-doula/
```

### Cross-Linking Map (natural anchor text)

| From | To | Anchor Text | Placement |
|------|----|-------------|-----------|
| `/what-is-a-doula/` → | `/benefits-of-a-doula/` | "evidence-based benefits of hiring a doula" | After the "Proven Benefits" section |
| `/what-is-a-doula/` → | `/doula-cost/` | "how much a doula costs" | After the "Cost" section |
| `/what-is-a-doula/` → | `/how-to-choose-a-doula/` | "how to find and interview a doula" | After the "How to Find" section |
| `/what-is-a-doula/` → | `/postpartum-doula/` | "postpartum doula support" | In the "Types of Doulas" section, after "2. Postpartum Doula" |
| `/benefits-of-a-doula/` → | `/what-is-a-doula/` | "what a doula actually does" | Opening paragraph context link |
| `/benefits-of-a-doula/` → | `/doula-cost/` | "how much doula services cost" | After the cost/benefit section |
| `/how-to-choose-a-doula/` → | `/what-is-a-doula/` | "what a doula does" | After the opening definition |
| `/how-to-choose-a-doula/` → | `/doula-cost/` | "doula costs by city" | After the contract/price section |
| `/doula-cost/` → | `/what-is-a-doula/` | "what a doula does and why it matters" | Opening paragraph context link |
| `/doula-cost/` → | `/benefits-of-a-doula/` | "evidence-based benefits of doula support" | After the "Is a doula worth the cost?" section |
| `/postpartum-doula/` → | `/what-is-a-doula/` | "what a birth doula does" | In the "birth doula vs. postpartum doula" section |
| `/birth-support/` → | `/what-is-a-doula/` | "what a doula does" | Opening paragraph context link |

### Navigation Element: "Doula Guide" Sidebar Block

Add a contextual "Doula Guide" navigation block to all 5 spoke pages + the pillar. This creates a persistent topical cluster signal for both users and crawlers:

```html
<!-- Doula Guide sidebar/follow block -->
<div class="bg-tjb-lavender-50 rounded-xl p-6 mb-8">
  <p class="eyebrow mb-3">Doula Guide</p>
  <ul class="space-y-2 text-sm">
    <li><a href="/what-is-a-doula/" class="text-tjb-rose-500 hover:underline">What Is a Doula?</a></li>
    <li><a href="/benefits-of-a-doula/" class="text-tjb-rose-500 hover:underline">Benefits of a Doula</a></li>
    <li><a href="/how-to-choose-a-doula/" class="text-tjb-rose-500 hover:underline">How to Choose a Doula</a></li>
    <li><a href="/doula-cost/" class="text-tjb-rose-500 hover:underline">How Much Does a Doula Cost?</a></li>
    <li><a href="/postpartum-doula/" class="text-tjb-rose-500 hover:underline">Postpartum Doula Guide</a></li>
  </ul>
</div>
```

This block should appear:
- On the pillar page: after the main content, before the lead capture form
- On each spoke page: in the same position (after main content, before CTA)

---

## Implementation Priority

| Priority | Action | Impact |
|----------|--------|--------|
| P1 | Add cross-links from `/what-is-a-doula/` to all 4 spoke pages | Highest — pillar is the #1 entry point |
| P2 | Add "Doula Guide" navigation block to all 6 pages | High — establishes cluster topology for crawlers |
| P3 | Add back-links from each spoke to the pillar | Medium — reinforces pillar authority |
| P4 | Add adjacent spoke-to-spoke links (cost↔benefits, choose↔cost) | Lower — nice-to-have for deep discovery |

---

## What NOT to Do

- **Do NOT create a new `/doula-guide/` page** — `/what-is-a-doula/` already serves this function
- **Do NOT add links that feel forced** — contextual, in-content links only where the reader would naturally want more detail
- **Do NOT add footer links** — topical cluster signals need to be in-content, not sitewide navigation
- **Do NOT add FAQPage schema** to pages without visible Q&A format — `/what-is-a-doula/` is narrative content, not FAQ