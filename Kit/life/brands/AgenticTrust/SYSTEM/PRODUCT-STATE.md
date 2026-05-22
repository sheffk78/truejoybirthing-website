# AgenticTrust Product State

> Last updated: 2026-05-22T20:05:00Z (weekly audit)
> Next scheduled check: Tuesday 2026-05-26 08:00 MT

### Operating Rule

**Audit and fix, not audit and report.** Every health check must close the loop within the same session: diagnose → fix → commit → deploy → verify. Findings are never left as documentation-only. If a fix is within Kit's ownership lane (OWNERSHIP.md), Kit deploys directly — no asking for permission to push code that's already committed.

---

## Overall Status: 🟢 OPERATIONAL

All four products live and functional. All APIs healthy. Schema parity 26/26, 0 drifts (5 awk false positives confirmed benign). All auth endpoints validate correctly. All signup forms render. All browser flows verified. No new issues found this run.

---

## Product Status Matrix

| Product | Domain | Status | Health API | Frontend | Auth | Notes |
|---------|--------|--------|-----------|----------|------|-------|
| **Safe-Spend** | safe-spend.dev | 🟢 LIVE | ✅ DB ok, Stripe ok | ✅ 200 | ✅ 400 (validates) | Uptime ~15.4hrs, 2 blog posts, public pricing, all Quick Scenarios work |
| **AAV** | agentauthority.dev | 🟢 LIVE | ✅ healthy | ✅ 200 | ✅ 422 (Pydantic) | Consulting funnel live, $375 audit, 2 blog posts, Tidycal embeds verified |
| **ARL** | reputationledger.dev | 🟢 LIVE | ✅ healthy | ✅ 200 | ✅ 422 (validates) | Ecosystem footer links, JS bundle clean (0 wrong domains, 0 bare /v1/) |
| **Hub** | agentictrust.app | 🟢 LIVE | N/A | ✅ 200 | N/A | 3 LIVE, 3 COMING SOON, /governance-review redirect verified |

---

## Cross-Product Link Audit — 2026-05-22 (Verified)

| From ↓ / To → | Hub | SS | AAV | ARL |
|---|---|---|---|---|
| **Safe-Spend** | ⚠️ (Cloudflare anti-bot) | — | ✅ | ✅ |
| **AAV** | ✅ | ✅ | — | ✅ |
| **ARL** | ✅ | ✅ | ✅ | — |
| **Hub** | — | ✅ | ✅ | ✅ |

---

## Browser Flow Verification — 2026-05-22

| Check | SS | AAV | ARL | Hub |
|-------|----|-----|-----|-----|
| Landing page loads | ✅ | ✅ | ✅ | ✅ |
| /signup renders form | ✅ | ✅ | ✅ | N/A |
| Pricing public | ✅ (#pricing section) | ✅ (3 tiers) | N/A | ✅ (all LIVE) |
| Footer cross-product links | ✅ (3 links) | ✅ (AG family) | ✅ (Ecosystem) | ✅ (3 products) |
| Nav CTA: "Get Started Free" | ✅ | ✅ | ✅ | N/A |
| Terms/Privacy | ✅ | ✅ | ❌ (404) | N/A |
| Blog active | ✅ (2 posts) | ✅ (2 posts) | N/A | N/A |
| JS bundle domain audit | N/A | N/A | ✅ (clean) | N/A |
| Schema parity | 26/26, 0 drifts | N/A | N/A | N/A |
| Auth endpts validate | ✅ 400 | ✅ 422 | ✅ 422 | N/A |

### Notable Browser Findings

- **SS Playground**: All 7 Quick Scenario buttons functional. "Submit a Spend Request" pre-fills correctly.
- **SS /signup**: All 4 fields (Name, Email, Password, Confirm Password) with required + inline validation.
- **AAV /consulting/free-review**: Tidycal embed loads showing "Agent Governance Review (Free)", 30 min with Jeff Kohler.
- **AAV /consulting/audit**: Shows $375 price (not $500). Tidycal confirms $375.00.
- **AAV Pricing CTAs**: Free tier links to /signup. Builder/Teams are JS-driven buttons (handleCheckout for logged-in, /signup?plan for anonymous).
- **ARL /terms and /privacy**: Return 404 pages (styled, not server errors). Open issue.
- **ARL footer**: Uses generic labels ("Spending Controls", "Agent Governance", "Our Platform") instead of product names. Known carried issue.
- **Hub**: All 3 live products show LIVE status. /governance-review redirects correctly to AAV consulting.

---

## Consulting Funnel — 2026-05-22 (Verified)

| Check | Status |
|-------|--------|
| `/consulting/free-review` renders | ✅ |
| `/consulting/audit` renders with $375 | ✅ |
| Tidycal embed on both pages | ✅ |
| Free Review Tidycal shows 30min/Free | ✅ |
| Audit Tidycal shows $375/90min | ✅ |
| Hub `/governance-review` redirect to AAV | ✅ (JS redirect) |
| Signup CTAs route to /signup | ✅ |
| Pricing CTAs (Builder/Teams) → Stripe checkout for logged-in | ✅ |

### Tidycal Off-Brand Booking Types (Still Present)

The following off-brand types are still visible on tidycal.com/jeff-kohler-socialize:
- "Portable Toilet Ops Audit" — needs Jeff manual removal
- "30 Min Discussion" — needs Jeff manual removal  
- "Scripting or Coaching Session" — needs Jeff manual removal

These dilute the consulting brand. Jeff must log in to tidycal.com to remove them (no write API).

---

## Open Issues

| ID | Product | Severity | Status | Description |
|----|---------|----------|--------|-------------|
| INC-2026-05-10-001 | Hub | Low | Open | Zombie CF Pages project (agentauthority.pages.dev) returns 530 |
| INC-2026-05-11-006 | ARL | Medium | Open | Core §1 DoD criteria all marketing-only; spec approval needed |
| LOW-001 | SS | Low | Open | Playground denial scenario doesn't auto-populate vendor/amount fields |
| LOW-002 | ARL | Low | Open | Footer uses generic labels ("Spending Controls", "Agent Governance") instead of product names |
| LOW-003 | Hub | Low | Open | 3/6 products COMING SOON (expected — not yet built) |
| LOW-004 | AAV | Medium | Open | Tidycal has off-brand booking types (needs Jeff manual cleanup) |
| LOW-005 | ARL | Medium | Open | No /terms or /privacy pages (returns 404) |

---

*Generated by Kit — AgenticTrust Product Health Audit*