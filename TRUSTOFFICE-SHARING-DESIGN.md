# TrustOffice Sharing & Referral System — Design Document

**Date:** June 22, 2026  
**Author:** Design Analysis  
**Status:** Draft for review  
**Ecosystem:** TrustOffice (app.trustoffice.app) + TrustMinutes (trustminutes.app) + WingPoint integration

---

## 1. Executive Summary

TrustOffice is a single-user trust governance platform: one trustee manages their trust's minutes, distributions, expenses, compliance, and beneficiary records. But trusts are inherently multi-party — they involve co-trustees, beneficiaries, advisors, and attorneys. This is both an unmet need and the largest organic growth vector available.

**Recommendation:** Start with **read-only beneficiary views** as the MVP sharing model. Beneficiary emails already exist on trust unit certificates. Sending a beneficiary a link to see their allocations creates a natural, non-spammy touchpoint that introduces them to the TrustOffice ecosystem. Co-trustee collaboration is the second phase.

---

## 2. Current System Architecture (As-Built)

### 2.1 What Exists Today

**Authentication:** Email/password + Google OAuth. JWT-based. Single-user sessions. No multi-user trust access.

**Trust ownership:** Every `TrustResponse` has a `user_id` field. All API queries (`GET /api/trusts`, `GET /api/minutes`, `GET /api/distributions`, etc.) are implicitly scoped to the authenticated user's `user_id`. There is no concept of shared trust access.

**Beneficiary data already present:**
- `TrustUnitCertificateCreate/Response` includes `email` and `phone` fields for certificate holders
- `BeneficiaryDashboardResponse` aggregates unit allocations per holder with certificates, percentages, and class beneficiary designations
- `ClassBeneficiaryCreate` allows designating beneficiary classes (descendants, charities, etc.)
- `BeneficiaryAllocation` includes `holder_name`, `email`, `phone`, `total_units`, `percentage`, `certificates`

**Existing referral system:**
- `GET /api/referrals/my-code` — generates a referral code for the current user
- `GET /api/referrals/stats` — referral statistics
- `GET /api/referrals/validate/{code}` — public endpoint, validates a code at signup
- `POST /api/referrals/track` — called internally after registration with `referee_user_id` + `referral_code`
- `UserCreate` schema accepts `referral_code` at registration
- `CheckoutRequest` accepts `referral_id` for Stripe checkout discounts
- Admin panel has referral management (`/api/admin/referrals`, fix endpoint)

**External provisioning (WingPoint):**
- `POST /api/external/provision-trustoffice` — creates user + trust from WingPoint data, idempotent by `wingpoint_ref`
- `POST /api/external/trust-documents` — delivers trust PDFs to the user's vault
- This is a B2B2C funnel: WingPoint sells trust formation packages and provisions TrustOffice accounts

**TrustMinutes.app (sister product):**
- Free trust meeting minutes generator (freemium)
- Next.js marketing site with wizard, templates, pricing
- "Trust Minutes 101" free email course (6 emails over 14 days)
- Same company: AgenticTrust LLC
- Currently a top-of-funnel lead gen tool, not directly integrated with TrustOffice accounts

**Subscription model:**
- Trial → paid (monthly/annual) via Stripe
- Feature gates: `MULTIPLE_TRUSTS` (trial limited to 1 trust), `TRUST_UNITS` (trial can't manage units)
- `GrantAccessRequest` allows admin to grant access with plan_type + days

### 2.2 Key Data Relationships

```
User (1) ──< Trust (1) ──< Entity (n)
                      ──< Minutes (n)
                      ──< Distributions (n) → linked to Minutes
                      ──< CompensationPlans (n) → CompensationPayments (n)
                      ──< GovernanceTasks (n)
                      ──< ScheduleAItems (n)
                      ──< Expenses (n)
                      ──< Transactions (n)
                      ──< TrustUnitCertificates (n) → has email/phone
                      ──< ClassBeneficiaries (n)
                      ──< Vault Documents (n)
                      ──< Communications (n)
                      ──< Investments (n)
                      ──< Tax Calendar Entries (n)
```

All scoped to a single `user_id`. No junction table between Users and Trusts.

### 2.3 API Architecture

- FastAPI backend (OpenAPI 3.1.0, version 0.1.0)
- All endpoints under `/api/` prefix
- JWT auth, `GET /api/auth/me` for current user
- Tag groups: auth, trusts, entities, tasks, trust-units, minutes, schedule-a, distributions, benevolence, compensation, governance, subscriptions, exports, expenses, calendar, preferences, email, background-jobs, categories, beneficiaries, demo, ai, guided-minutes, referrals, admin, contact, admin-api, stats, transactions, alerts, audit-defense, tax_calendar, state_compliance, investments, communications, vault, risk_dashboard, binder, external, courses, leads, chat

---

## 3. Recommended Sharing Model

### 3.1 Three Sharing Tiers (Build in This Order)

| Tier | Role | Access Level | Growth Value | Build Effort |
|------|------|-------------|--------------|--------------|
| **1 (MVP)** | Beneficiary | Read-only: their allocations, distributions received, certificates | Each invite = potential new user. Beneficiaries become curious about their own trusts. | Medium |
| **2** | Co-Trustee | Read-write: minutes, distributions, expenses, tasks | Each co-trustee invite = direct paid user acquisition. Multi-trustee families need this. | High |
| **3** | Advisor/Attorney | Read-only: compliance docs, minutes, tax calendar | Professional referrals. Advisors recommend TrustOffice to other clients. | Medium |

### 3.2 Why Beneficiary Read-Only First

1. **Data already exists:** Certificate holders already have email addresses. The `BeneficiaryDashboardResponse` already aggregates the right data. Zero schema migration for the read model.
2. **Lowest risk:** Read-only can't corrupt trust records. No permission complexity.
3. **Highest volume:** Every trust has beneficiaries. Most trusts have 2-10. One trustee invites N beneficiaries.
4. **Natural touchpoint:** "Here's a link to see your trust unit allocations" is helpful, not spammy. It's information the beneficiary is entitled to.
5. **Funnel entry:** Beneficiaries who click through see TrustOffice branding. Some will think "I'm a trustee on another trust — I should use this too."

### 3.3 Permission Model

```
TrustAccessLevel:
  - OWNER: Full CRUD, can invite others, can revoke access. (existing user_id on Trust)
  - BENEFICIARY_VIEW: Read-only. Scoped to their own allocations + distributions.
    Cannot see other beneficiaries' data. Cannot see expenses, compensation,
    or internal governance tasks.
  - CO_TRUSTEE: Read-write on minutes, distributions, expenses, tasks, vault.
    Cannot delete the trust or change subscription. Cannot see compensation
    records for other trustees.
  - ADVISOR: Read-only on compliance docs, minutes, tax calendar, state compliance.
    Cannot see financial details (distributions amounts, compensation, expenses).
```

**MVP scope:** Only `OWNER` (existing) + `BENEFICIARY_VIEW` (new).

---

## 4. User Flows

### 4.1 Flow 1: Trustee Invites Beneficiary (MVP)

**Pre-condition:** Trustee has created trust, issued unit certificates with beneficiary email addresses.

```
Step 1: Trustee navigates to Trust → Beneficiaries tab
        ┌────────────────────────────────────────────────┐
        │  Beneficiaries                                  │
        │  ┌──────────────────────────────────────────┐   │
        │  │ Sarah Johnson     500 units   25%        │   │
        │  │ sarah@email.com   [Invite to View]       │   │
        │  │                                          │   │
        │  │ Michael Johnson    750 units   37.5%     │   │
        │  │ michael@email.com  [Invite to View]      │   │
        │  │                                          │   │
        │  │ Charity Fund       250 units   12.5%     │   │
        │  │ (no email)         [Add Email]            │   │
        │  └──────────────────────────────────────────┘   │
        │                                                │
        │  [Invite All Beneficiaries with Emails]         │
        └────────────────────────────────────────────────┘
```

```
Step 2: Trustee clicks "Invite to View" on a beneficiary
        ┌────────────────────────────────────────────────┐
        │  Invite Sarah Johnson                           │
        │                                                 │
        │  Sarah will receive an email with a secure link  │
        │  to view their trust unit allocations and        │
        │  distribution history.                          │
        │                                                 │
        │  Email: sarah@email.com                         │
        │  Access: Read-only beneficiary view             │
        │  Expires: 30 days                               │
        │                                                 │
        │  Custom message (optional):                     │
        │  ┌───────────────────────────────────────────┐  │
        │  │ Hi Sarah, I've set up a digital record... │  │
        │  └───────────────────────────────────────────┘  │
        │                                                 │
        │  [Send Invite]  [Cancel]                        │
        └────────────────────────────────────────────────┘
```

```
Step 3: System sends email to beneficiary
        Subject: "[Trustee Name] has shared your trust beneficiary records"
        
        Body:
        Hi Sarah,
        
        [Trustee Name] has invited you to view your trust unit
        allocations and distribution history for the [Trust Name].
        
        [Trustee's custom message if provided]
        
        Click the link below to view your records:
        → https://app.trustoffice.app/invite/{token}
        
        This link expires in 30 days. You'll need to create a
        free account to access your records securely.
        
        — TrustOffice Team
```

```
Step 4: Beneficiary clicks link → lands on invite acceptance page
        ┌────────────────────────────────────────────────┐
        │  [TrustOffice Logo]                             │
        │                                                 │
        │  You've been invited to view your trust records │
        │                                                 │
        │  [Trustee Name] has shared beneficiary records   │
        │  for [Trust Name] with you.                      │
        │                                                 │
        │  What you'll see:                               │
        │  ✓ Your unit allocations and certificates       │
        │  ✓ Distribution history (amounts you've received)│
        │  ✓ Trust beneficiary class designations         │
        │                                                 │
        │  What you won't see:                            │
        ✗ Trust expenses or internal governance          │
        ✗ Other beneficiaries' allocations                │
        ✗ Trustee compensation                            │
        │                                                 │
        │  [Create Free Account to View]                  │
        │  [Already have an account? Log In]              │
        └────────────────────────────────────────────────┘
```

```
Step 5: Beneficiary creates account (or logs in)
        - If new: Standard registration flow. Account created with
          pre-attached beneficiary access to the trust.
        - If existing: Login, then trust access is attached to
          their existing account.
        - The invite token is consumed, binding the access grant
          to the user account.

Step 6: Beneficiary sees their dashboard
        ┌────────────────────────────────────────────────┐
        │  [TrustOffice Logo]  Sarah Johnson  [Settings]  │
        │                                                 │
        │  My Trust Beneficiary Dashboard                  │
        │  [Trust Name]                                    │
        │                                                 │
        │  ┌─────────────┐  ┌──────────────┐              │
        │  │ 500 units   │  │ 25.0%       │              │
        │  │ allocated   │  │ of trust    │              │
        │  └─────────────┘  └──────────────┘              │
        │                                                 │
        │  Certificates                                    │
        │  ┌──────────────────────────────────────────┐   │
        │  │ Cert #001  250 units  Issued 2024-01-15 │   │
        │  │ [View PDF]                               │   │
        │  │ Cert #002  250 units  Issued 2024-06-30 │   │
        │  │ [View PDF]                               │   │
        │  └──────────────────────────────────────────┘   │
        │                                                 │
        │  Recent Distributions                           │
        │  ┌──────────────────────────────────────────┐   │
        │  │ 2025-03-15  $5,000  Education distribution │   │
        │  │ 2024-12-20  $2,500  Holiday distribution   │   │
        │  └──────────────────────────────────────────┘   │
        │                                                 │
        │  Beneficiary Class Designations                 │
        │  • Descendants (50% of remainder)               │
        │                                                 │
        │  ────────────────────────────────────────────  │
        │  Are you also a trustee? [Explore TrustOffice]  │
        └────────────────────────────────────────────────┘
```

### 4.2 Flow 2: Co-Trustee Collaboration (Phase 2)

```
Step 1: Trustee navigates to Trust → Settings → Team
        ┌────────────────────────────────────────────────┐
        │  Trust Team                                      │
        │                                                 │
        │  Trustees with access:                           │
        │  • John Smith (Owner) — full access              │
        │                                                 │
        │  [Invite Co-Trustee]                             │
        └────────────────────────────────────────────────┘

Step 2: Trustee enters co-trustee email
        - Same email invite pattern as beneficiary
        - Co-trustee creates account (or logs in if existing)
        - Gets read-write access to: minutes, distributions, expenses,
          tasks, vault, schedule-a
        - Cannot: delete trust, modify subscription, revoke owner access

Step 3: Both trustees see shared workspace
        - Minutes show "Created by [Name]" on each record
        - Distributions show approval chain
        - Tasks assignable to either trustee
        - Activity feed shows both users' actions
```

### 4.3 Flow 3: TrustMinutes.app → TrustOffice Funnel

```
Step 1: User discovers TrustMinutes.app via search/ads
Step 2: Generates free meeting minutes (no account needed initially)
Step 3: To save/export minutes, creates free TrustMinutes account
Step 4: TrustMinutes shows upsell:
        "You've generated 3 sets of minutes. TrustOffice gives you
         a complete governance workspace — distributions, compliance,
         beneficiary tracking, and your minutes are all connected.
         [Start TrustOffice Free Trial]"
Step 5: Click → TrustOffice registration with ref=trustminutes
        - TrustOffice trial starts
        - Minutes from TrustMinutes can be imported (future)
        - The referral code system already supports tracking this
```

---

## 5. Technical Requirements

### 5.1 Database Schema Changes

#### New Table: `trust_access_grants`

```sql
CREATE TABLE trust_access_grants (
    grant_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trust_id          UUID NOT NULL REFERENCES trusts(trust_id),
    grantor_user_id   UUID NOT NULL REFERENCES users(user_id),
    grantee_user_id   UUID REFERENCES users(user_id),  -- NULL until invite accepted
    grantee_email     VARCHAR(255) NOT NULL,
    role              VARCHAR(50) NOT NULL DEFAULT 'beneficiary_view',
        -- 'beneficiary_view', 'co_trustee', 'advisor'
    
    -- For beneficiary_view: scope to specific holder_identifier
    scoped_holder_identifier VARCHAR(255),
    
    invite_token      UUID NOT NULL DEFAULT gen_random_uuid(),
    invite_status     VARCHAR(20) NOT NULL DEFAULT 'pending',
        -- 'pending', 'accepted', 'expired', 'revoked'
    invite_expires_at TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '30 days',
    
    custom_message    TEXT,
    invited_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    accepted_at       TIMESTAMP,
    revoked_at        TIMESTAMP,
    
    UNIQUE(trust_id, grantee_email, role)
);

CREATE INDEX idx_trust_access_grants_trust ON trust_access_grants(trust_id);
CREATE INDEX idx_trust_access_grants_email ON trust_access_grants(grantee_email);
CREATE INDEX idx_trust_access_grants_token ON trust_access_grants(invite_token);
CREATE INDEX idx_trust_access_grants_user  ON trust_access_grants(grantee_user_id);
```

#### Modify Existing: `trusts` table

No changes needed. The `user_id` on `trusts` remains the owner. Access grants are a separate join table.

#### New Table: `beneficiary_access_scopes` (optional refinement)

```sql
CREATE TABLE beneficiary_access_scopes (
    scope_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_id          UUID NOT NULL REFERENCES trust_access_grants(grant_id),
    trust_id          UUID NOT NULL REFERENCES trusts(trust_id),
    holder_identifier VARCHAR(255) NOT NULL,  -- matches certificate holder_identifier
    -- What this scope allows viewing:
    can_view_certificates   BOOLEAN DEFAULT TRUE,
    can_view_distributions   BOOLEAN DEFAULT TRUE,
    can_view_class_designations BOOLEAN DEFAULT TRUE
);
```

*Note: For MVP, skip this table and use `scoped_holder_identifier` on the grant itself. Only add the scopes table when multiple holders need access per grant.*

### 5.2 New API Endpoints

#### Invite Management (Owner)

```
POST   /api/trusts/{trust_id}/invites
       Create an invite for a beneficiary or co-trustee
       Body: { email, role, custom_message?, scoped_holder_identifier?, expires_days? }
       Returns: { invite_id, invite_token, status: "pending" }
       Auth: trust owner only
       Rate limit: 10 invites/hour/trust

GET    /api/trusts/{trust_id}/invites
       List all invites for a trust (pending, accepted, revoked)
       Auth: trust owner only

DELETE /api/trusts/{trust_id}/invites/{invite_id}
       Revoke an invite or existing access
       Auth: trust owner only

POST   /api/trusts/{trust_id}/invites/{invite_id}/resend
       Resend invite email with fresh token + expiry
       Auth: trust owner only
```

#### Invite Acceptance (Public → Authenticated)

```
GET    /api/invites/{token}
       Public endpoint: get invite details without accepting
       Returns: { trust_name, grantor_name, role, scope_description,
                  expires_at, is_expired, custom_message? }
       No auth required (so user can see what they're accepting)

POST   /api/invites/{token}/accept
       Accept an invite. Requires authenticated user.
       Body: {} (empty, uses current user's JWT)
       Returns: { access_grant_id, trust_id, role, redirect_url }
       Behavior:
         - If user already has access: return existing grant
         - If invite expired: 410 Gone
         - If invite revoked: 410 Gone
         - Binds grantee_user_id to current user
         - Sets invite_status = 'accepted', accepted_at = NOW()
```

#### Beneficiary View (Grantee)

```
GET    /api/beneficiary/dashboard/{trust_id}
       Get beneficiary-scoped dashboard for a trust
       Auth: user must have accepted invite for this trust
       Returns: filtered BeneficiaryDashboardResponse
         - Only shows certificates matching scoped_holder_identifier
         - Only shows distributions to that beneficiary
         - Class beneficiary designations (read-only)
         - Does NOT include: other beneficiaries, expenses, compensation,
           governance tasks, minutes, vault docs
       
       This is DIFFERENT from existing GET /api/beneficiaries/dashboard
       which returns ALL beneficiaries (owner-only view).

GET    /api/beneficiary/certificates/{trust_id}
       List certificates scoped to the beneficiary's holder_identifier
       Auth: beneficiary access grant required

GET    /api/beneficiary/distributions/{trust_id}
       List distributions to this beneficiary only
       Auth: beneficiary access grant required

GET    /api/beneficiary/invites
       List all accepted invites for current user (trusts they have access to)
       Auth: current user

DELETE /api/beneficiary/access/{grant_id}
       Beneficiary revokes their own access (opt-out)
       Auth: grantee_user_id = current user
```

#### Admin Endpoints

```
GET    /api/admin/invites
       List all invites across system with filters (status, trust, date)
       Auth: admin

GET    /api/admin/invites/stats
       Invite funnel metrics: sent, accepted, expired, conversion rate
       Auth: admin
```

### 5.3 Existing Endpoint Modifications

#### Auth Registration (`POST /api/auth/register`)

Add optional `invite_token` field to `UserCreate`:

```python
class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    referral_code: Optional[str] = None  # existing
    wp_ref: Optional[str] = None          # existing
    wp_trust_name: Optional[str] = None  # existing
    invite_token: Optional[str] = None   # NEW — accept trust access on registration
```

When `invite_token` is provided:
1. Validate the token exists and is not expired/revoked
2. After user creation, bind the grant's `grantee_user_id` to the new user
3. Set `invite_status = 'accepted'`
4. Return a `redirect_url` in the response pointing to the beneficiary dashboard

#### Auth Login (`POST /api/auth/login`)

No changes needed. After login, the frontend checks `/api/beneficiary/invites` to show accessible trusts.

#### Trust Queries (all existing trust-scoped endpoints)

Add a middleware/dependency that checks:
1. Does the current user own this trust? → Full access (existing behavior)
2. Does the current user have an accepted access grant for this trust? → Filtered access based on role
3. Neither? → 403 Forbidden

For beneficiary_view role, the filtering logic:
- `GET /api/trust-units/certificates?trust_id=X` → filter to only certificates where `holder_identifier` matches the grant's scope
- `GET /api/distributions?trust_id=X` → filter to only distributions where `beneficiary_name` matches the scoped holder
- All other endpoints → 403 for beneficiary_view role

### 5.4 Email Templates

Three new email templates (using existing email infrastructure from `/api/email/`):

1. **`invite_beneficiary`** — sent when trustee invites a beneficiary
   - Subject: "[Trustee Name] shared your trust beneficiary records"
   - Body: Trustee's custom message, trust name, invite link, expiry notice
   - CTA: `https://app.trustoffice.app/invite/{token}`

2. **`invite_accepted_notifier`** — sent to the trustee when their invite is accepted
   - Subject: "[Beneficiary Name] accepted your invitation"
   - Body: Who accepted, when, link to their beneficiary dashboard
   - CTA: `https://app.trustoffice.app/trusts/{trust_id}/beneficiaries`

3. **`invite_expired_notifier`** — sent to the trustee when an invite expires without acceptance
   - Subject: "Invitation to [Email] has expired"
   - Body: Offer to resend
   - CTA: `https://app.trustoffice.app/trusts/{trust_id}/team`

### 5.5 Frontend Components (app.trustoffice.app)

New pages/routes:

```
/invite/[token]              — Public invite landing page (no auth required)
                              Shows: trust name, inviter name, what they'll see,
                              [Create Account] / [Log In] buttons
                              On accept: redirect to /beneficiary/dashboard/[trust_id]

/beneficiary/dashboard/[trustId]  — Beneficiary read-only dashboard
                                    Uses filtered API endpoints
                                    Branded differently from trustee view
                                    "Powered by TrustOffice" watermark
                                    Upsell CTA: "Are you a trustee?"

/beneficiary/certificates    — Certificate list (filtered)
/beneficiary/distributions    — Distribution history (filtered)

/settings/trusts              — Show trusts you own + trusts you've been invited to
```

New components:

```
<InviteBeneficiaryModal />     — Modal for trustee to send invite
<BeneficiaryInviteList />      — Table of pending/accepted invites on trust settings
<BeneficiaryDashboard />       — Read-only dashboard for beneficiaries
<InviteLandingPage />          — Public landing page for invite acceptance
<TrustSwitcher />              — Dropdown to switch between owned and shared trusts
<UpsellBanner />               — "Are you a trustee?" CTA on beneficiary view
```

### 5.6 Security Requirements

1. **Invite tokens are UUIDs** — not guessable, not sequential
2. **Token expiry** — 30 days default, configurable per invite (max 90 days)
3. **Rate limiting** — max 10 invites per hour per trust, max 50 pending invites per trust
4. **Email verification** — invite email must match the grantee_email on the grant. If user registers with a different email, the system prompts them to use the invited email or request re-invite
5. **Scope enforcement** — beneficiary_view role can only access the 3 beneficiary-specific endpoints. All other endpoints return 403
6. **Audit log** — every invite sent, accepted, revoked is logged (extend existing activity log)
7. **Data isolation** — beneficiary cannot see other beneficiaries' allocations, amounts, or contact info. The API must filter at the query level, not just hide in the UI
8. **Revocation** — trustee can revoke access at any time. The grantee's token is invalidated immediately

---

## 6. Implementation Effort Estimate

### MVP: Beneficiary Read-Only View

| Component | Effort | Notes |
|-----------|--------|-------|
| DB schema: `trust_access_grants` table | 0.5 day | Single table, indexes |
| API: Invite creation endpoints (4) | 1.5 days | CRUD + email sending |
| API: Invite acceptance flow (2) | 1 day | Public GET + authenticated POST |
| API: Beneficiary-scoped endpoints (4) | 2 days | Filtered queries + auth middleware |
| API: Auth registration modification | 0.5 day | Add invite_token field, auto-accept |
| API: Trust access middleware | 1 day | Dependency injection for access checking |
| Email templates (3) | 1 day | Using existing email infrastructure |
| Frontend: Invite landing page | 1 day | Public page, responsive |
| Frontend: Beneficiary dashboard | 2 days | New dashboard view, filtered data |
| Frontend: Invite UI in trustee view | 1.5 days | Modal + invite list table |
| Frontend: Trust switcher | 0.5 day | Settings page update |
| Testing | 2 days | Unit + integration + E2E |
| **Total** | **~14 days** | ~3 weeks with buffer |

### Phase 2: Co-Trustee Collaboration

| Component | Effort |
|-----------|--------|
| DB: Add co_trustee role support | 0.5 day |
| API: Permission middleware for read-write roles | 2 days |
| API: Author attribution on records | 1 day |
| API: Co-trustee invite flow | 1 day (reuses MVP infrastructure) |
| Frontend: Team management UI | 2 days |
| Frontend: Author attribution display | 1 day |
| Frontend: Shared task assignment | 1 day |
| Testing | 2 days |
| **Total** | **~10 days** | ~2 weeks |

### Phase 3: Advisor Access

| Component | Effort |
|-----------|--------|
| API: Advisor role + filtered endpoints | 1.5 days |
| Frontend: Advisor view | 1.5 days |
| Testing | 1 day |
| **Total** | **~4 days** | ~1 week |

**Grand total all three phases: ~28 dev-days (~6 weeks)**

---

## 7. Growth Mechanics

### 7.1 How Sharing Drives Adoption

#### Mechanism 1: Beneficiary-to-Trustee Conversion

```
Trustee (paid user)
  → invites 4 beneficiaries (avg family trust)
    → 4 beneficiaries create free accounts
      → 2-3 view their dashboard regularly
        → 1 discovers they're a trustee on another family trust
          → converts to paid TrustOffice user
```

**Conversion hypothesis:** 5-10% of invited beneficiaries who are also trustees will convert to paid users within 90 days. This is a warm lead — they've already experienced the product's value proposition through their own beneficiary dashboard.

**Tracking:** The referral_code system already exists. When a beneficiary views their dashboard and clicks "Explore TrustOffice for Your Trust", this click carries a UTM/referral source. Registration from this flow can be tracked via the existing `/api/referrals/track` endpoint.

#### Mechanism 2: Co-Trustee Pull-Through

```
Trustee A (paid user)
  → invites Co-Trustee B
    → B sees the governance workspace
      → B realizes they need this for their own trusts
        → B creates their own TrustOffice account
          → B's trial starts
            → B converts to paid
```

This is the strongest growth vector because co-trustees have direct, hands-on experience with the product's value. They're not being sold to — they're using it for work.

#### Mechanism 3: Advisor Network Effects

```
Trustee invites their CPA/attorney as advisor
  → Advisor sees compliance docs, tax calendar
    → Advisor recommends TrustOffice to their OTHER trustee clients
      → 5-10 new trustees from one advisor relationship
```

Advisors are force multipliers. One advisor with 20 trustee clients can drive significant adoption. The advisor view should include a "Recommend TrustOffice" share function with the advisor's referral code.

#### Mechanism 4: TrustMinutes → TrustOffice Pipeline

```
TrustMinutes.app visitor (free)
  → Generates minutes (free, no account)
    → To save, creates free TrustMinutes account
      → Sees "Your minutes are great. But where's the rest of your governance?"
        → Clicks "Start TrustOffice Free Trial"
          → TrustOffice trial starts with ref=trustminutes
            → Converts to paid
```

**Integration point:** The existing `UserCreate.wp_ref` field and referral_code system can track TrustMinutes-originated signups. TrustMinutes already uses the same Google OAuth infrastructure. A shared auth session or SSO between the two apps would reduce friction.

**Recommended:** Add a `source` field to UserCreate: `trustminutes`, `wingpoint`, `referral`, `direct`, `invite_beneficiary`, `invite_co_trustee`. This enables funnel analytics.

### 7.2 Viral Coefficient Estimate

Assumptions:
- Average trust has 3.5 beneficiaries with email addresses
- Trustee invites ~60% of emailable beneficiaries = ~2.1 invites per trust
- ~40% of invites are accepted = ~0.85 new free accounts per paid trust
- ~7% of beneficiaries convert to paid trustees within 90 days = ~0.06 paid conversions per existing paid trust
- Plus co-trustee invites: ~0.3 co-trustees invited per trust, ~50% accept, ~70% convert to paid = ~0.1 paid conversions

**Estimated viral coefficient (K):** ~0.16 paid conversions per existing paid user per trust.

This means every 100 paid users generate ~16 new paid users through sharing alone, before any other growth channels. With a 90-day cycle, this is meaningful organic growth.

### 7.3 TrustMinutes.app Funnel Connection

TrustMinutes.app should be enhanced as an educational funnel:

1. **Current state:** TrustMinutes generates free minutes, has an email course. No direct integration with TrustOffice.

2. **Recommended integration:**
   - TrustMinutes generates minutes → offers "Import to TrustOffice" CTA
   - TrustMinutes account = TrustOffice account (shared auth, same company)
   - When a TrustMinutes user creates their 2nd set of minutes, show: "You've generated multiple minutes. TrustOffice connects your minutes to distributions, compliance, beneficiary tracking, and more. [Start Free Trial]"
   - TrustMinutes footer/email course includes TrustOffice referral link with `ref=trustminutes` tracking

3. **Email course integration:** The "Trust Minutes 101" course (6 emails over 14 days) should include a TrustOffice CTA in emails 4-6 when the user has learned enough to want the full workspace.

4. **Cross-product analytics:** PostHog is already deployed on TrustMinutes. Add the same to TrustOffice. Track cross-domain conversion: TrustMinutes visitor → TrustOffice trial → TrustOffice paid.

### 7.4 Retention Enhancement

Sharing also improves retention of the inviting trustee:
- A trustee who has invited beneficiaries has a switching cost — their beneficiaries are already on the platform
- The beneficiary dashboard creates a reason for the trustee to keep their TrustOffice subscription active (beneficiaries expect access)
- Co-trustee collaboration creates lock-in: both trustees are invested in the platform

---

## 8. Implementation Priority & Sequencing

### Phase 0: Pre-work (1 day)
- Add `source` field to user registration for funnel tracking
- Set up PostHog on TrustOffice (already on TrustMinutes)
- Document the existing referral_code flow for reuse

### Phase 1: Beneficiary MVP (14 days, ~3 weeks)
- Database schema
- API endpoints
- Email templates
- Frontend (invite landing, beneficiary dashboard, trustee invite UI)
- Testing

### Phase 2: TrustMinutes Integration (3-5 days)
- Shared auth between TrustMinutes and TrustOffice
- "Import minutes to TrustOffice" CTA on TrustMinutes
- Cross-product referral tracking
- Email course TrustOffice CTAs

### Phase 3: Co-Trustee Collaboration (10 days, ~2 weeks)
- Read-write permission system
- Author attribution
- Team management UI
- Shared task workflows

### Phase 4: Advisor Access (4 days, ~1 week)
- Advisor role endpoints
- Advisor view UI
- "Recommend TrustOffice" share function for advisors

**Total estimated timeline: ~6-7 weeks for all phases.**

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Beneficiaries feel spammed by invites | Lowers acceptance rate, brand damage | Require trustee to add custom message. Default message is informational, not promotional. One invite per email, no re-spam. |
| Privacy concern: trustee sharing trust data | Legal/compliance risk | Beneficiary view is intentionally limited. No financial details exposed beyond their own distributions. Terms of service should cover shared access. |
| Beneficiary creates account but never returns | Low conversion | Track engagement. Send a "Your trust records were updated" notification when new distributions or certificates are issued to them. |
| Co-trustee permission conflicts | Data integrity risk | Implement optimistic locking on edits. Show "editing now" indicators. Require approval workflow for distributions (already exists). |
| Email deliverability of invites | Invites don't reach inbox | Use existing email infrastructure. Consider dedicated sending domain. Monitor bounce rates. |
| Token enumeration attacks | Security risk | UUIDv4 tokens (122 bits entropy). Rate limit token validation endpoint. |

---

## 10. Success Metrics

### Leading Indicators (Week 1-4 post-launch)
- Number of invites sent per trust (target: >1.5)
- Invite acceptance rate (target: >30%)
- Beneficiary dashboard views per week (target: growing)

### Lagging Indicators (Month 1-3)
- Beneficiary → paid trustee conversion rate (target: 5-10%)
- Co-trustee → paid conversion rate (target: 50-70%)
- TrustMinutes → TrustOffice trial conversion (target: 10-15%)
- Net new paid users from sharing (target: 15-20% of total growth)
- Viral coefficient K (target: >0.10)

### Dashboard (admin)
- Invite funnel: sent → opened → clicked → accepted → active → converted
- By-trust invite penetration: % of active trusts with at least 1 accepted invite
- Beneficiary DAU/MAU (engagement with read-only view)
- Cross-product conversion: TrustMinutes users who also have TrustOffice accounts

---

## Appendix A: Existing API Endpoints Relevant to Sharing

| Endpoint | Relevance |
|----------|-----------|
| `GET /api/beneficiaries/dashboard` | Owner's full beneficiary view. The beneficiary-scoped version filters this. |
| `GET /api/trust-units/certificates` | Certificate list with holder emails. Source of invite targets. |
| `GET /api/distributions` | Distribution history. Filter by beneficiary_name for beneficiary view. |
| `GET /api/referrals/my-code` | Existing referral code system. Reuse for tracking. |
| `POST /api/referrals/track` | Track referral conversions. Extend for invite-source tracking. |
| `GET /api/subscription/features` | Feature gate system. Add sharing as a feature gate if desired. |
| `POST /api/auth/register` | Registration flow. Add invite_token field. |
| `GET /api/auth/me` | Current user. Frontend uses this + `/api/beneficiary/invites` to show accessible trusts. |
| `POST /api/email/send-task-reminders` | Email infrastructure. Extend for invite emails. |
| `GET /api/notifications/preferences` | Notification system. Add invite-related notifications. |
| `GET /api/admin/customers/{user_id}` | Admin view. Add accepted invites to CustomerDetail. |
| `GET /api/admin/referrals` | Admin referral management. Add invite analytics. |

## Appendix B: Schema Reference — Existing Key Models

### TrustResponse (owner view)
```json
{
  "trust_id": "uuid",
  "user_id": "uuid",          // ← owner
  "name": "Smith Family Trust",
  "trust_type": "irrevocable",
  "jurisdiction": "TX",
  "trustees": "John Smith, Jane Smith",
  "role": "Trustee",
  "ein": "12-3456789",
  "governance_score": 75
}
```

### BeneficiaryDashboardResponse (owner full view)
```json
{
  "trust_id": "uuid",
  "trust_name": "Smith Family Trust",
  "total_authorized_units": 2000,
  "total_issued_units": 1500,
  "remaining_units": 500,
  "unit_label": "units",
  "active_certificate_count": 4,
  "beneficiaries": [
    {
      "holder_name": "Sarah Johnson",
      "email": "sarah@email.com",      // ← invite target
      "phone": "+1234567890",
      "total_units": 500,
      "percentage": 25.0,
      "certificate_count": 2,
      "certificates": [...]
    }
  ],
  "class_beneficiaries": [...],
  "recent_transfers": [...]
}
```

### TrustUnitCertificateResponse (has email for invites)
```json
{
  "certificate_id": "uuid",
  "trust_id": "uuid",
  "holder_name": "Sarah Johnson",
  "holder_identifier": "sarah_johnson_1990",
  "email": "sarah@email.com",          // ← already collected
  "phone": "+1234567890",              // ← already collected
  "units": 250,
  "percentage": 12.5,
  "issue_date": "2024-01-15",
  "certificate_number": "CERT-001",
  "status": "active"
}
```

---

*End of design document.*