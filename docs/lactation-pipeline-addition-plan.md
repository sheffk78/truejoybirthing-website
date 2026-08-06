# Plan: Add Lactation Specialists as a Third Provider Type

**Goal:** Add lactation specialists (IBCLC, CLC, CLS) as a third provider type
alongside doulas and midwives — across search, enrichment, outreach, data model,
and rendering — as a non-breaking add to the existing pipeline.

**Scope:** Forward-only. Past city pages are NOT rebuilt. The change is additive:
new flags, new queries, new classification, new outreach tier. Existing pages
keep rendering identically; new pages get lactation providers in the same
`localDoulas` grid.

**Design principle:** Mirror the existing `isMidwife` pattern exactly. A new
`isLactation?: boolean` flag on `LocalDoula` is the smallest, safest add that
flows through every downstream stage without touching the storage shape.

---

## 1. Data Model Changes

### 1A. `src/data/cities.ts` — `LocalDoula` interface

Add `isLactation` adjacent to `isMidwife`. No other field changes.

```ts
export interface LocalDoula {
  name: string;
  credential?: string;
  // ... existing fields ...
  isAmbassador?: boolean;
  isMidwife?: boolean;
  isLactation?: boolean;        // NEW — lactation specialist (IBCLC/CLC/CLS)
  isVerified?: boolean;
  // ... rest unchanged ...
}
```

### Why a new `isLactation` flag (not services[] only)

The `services?: string[]` array already supports 'Lactation' and 'Breastfeeding
Support'. Reusing only `services` seems cheaper, but it breaks three downstream
behaviors that rely on a discrete provider type:

- **Filter bar** — the template gates the "Midwife" filter on `filterHasMidwife`,
  which is set by scanning `d.isMidwife`. A lactation filter needs the same
  discrete signal, not a substring match on `services`.
- **Preflight G61** — counts doulas vs midwives by `isMidwife: true`. A lactation
  tier needs the same deterministic count to enforce its own ratio guard.
- **Outreach tiering** — lactation specialists get a different email template
  (different expertise, different ask). The outreach skill needs a flag to
  route to the right template, not a services-substring heuristic.

A flag mirrors `isMidwife`, is one field, and keeps every consumer a one-line
check. The `services[]` array stays as the granular service list (a lactation
provider's services might be `["Lactation", "Breastfeeding Support",
"Postpartum"]`). The flag says *what kind of provider this is*; services says
*what they offer*. They are orthogonal, exactly like `isMidwife` + services
already are.

### 1B. Credential conventions for lactation specialists

When `isLactation: true`, `credential` should reflect the actual credential:

| Credential string | When to use |
|---|---|
| `"IBCLC"` | International Board Certified Lactation Consultant (NPI-eligible) |
| `"CLC"` | Certified Lactation Consultant |
| `"CLS"` | Certified Lactation Specialist |
| `"Lactation Consultant"` | When the exact credential is unknown |
| `"Birth Doula, IBCLC"` | When the provider is both a doula and an IBCLC |

The `services[]` array for a lactation specialist should include at least one
of: `"Lactation"`, `"Breastfeeding Support"`.

### 1C. Dual-type providers (doula + lactation, or midwife + lactation)

A provider can be both a doula and an IBCLC. Rules:

- If the provider's *primary* practice is lactation, set `isLactation: true`
  and leave `isMidwife` unset. `credential` shows the lactation credential.
- If the provider's *primary* practice is doula work but they offer lactation
  services, leave `isLactation` unset and add `"Lactation"` to `services[]`.
- If genuinely dual (equal doula + IBCLC practice), set `isLactation: true` and
  include `"Birth Doula"` in `services[]`. The card renders both the "Lactation"
  badge (from the flag) and the service tags.
- Never set both `isMidwife: true` and `isLactation: true`. A provider cannot be
  primarily both. If a midwife offers lactation, use `services[]` only.

The classification function (§2C) decides primary type at research time using
the signal strength order: midwife > lactation > doula. A "midwife lactation"
listing classifies as midwife; a "doula lactation" listing classifies as
lactation only if lactation is the dominant signal.

### 1D. Backward compatibility

- Existing cities have no `isLactation` field → the flag is `undefined` →
  falsy → no behavior change. Past pages render exactly as before.
- The `localDoulas` array name stays. Renaming to `localProviders` would be a
  massive find/replace across the template, probe, enrichment, and tests for
  no functional gain. The array holds providers; the name is historical.
- No TypeScript build break: `isLactation?: boolean` is optional.

---

## 2. Search / Research Phase Changes

**File:** `scripts/research-providers.py`

### 2A. Add lactation search queries (Apify Google Maps)

In `research_city()`, add a fifth query to the `queries` list:

```python
queries = [
    f"doula {city} {state}",
    f"midwife {city} {state}",
    f"birth center {city} {state}",
    f"hospital labor delivery {city} {state}",
    f"lactation consultant {city} {state}",      # NEW
]
```

Optional second query for broader recall in sparse areas:

```python
    f"breastfeeding support {city} {state}",     # NEW (optional, broader)
```

The thread pool already uses `max_workers=4`; bump to `max_workers=5` (or 6 with
the optional query) so the added query runs in parallel without serializing.

### 2B. Add NPI Registry search for lactation consultants

The NPI Registry has two relevant taxonomy codes for lactation:

| Code | Description |
|---|---|
| `163WL0100X` | Registered Nurse - Lactation Consultant (RN IBCLC) |
| `174N00000X` | Lactation Consultant, Non-RN (CLC/CLS/non-RN IBCLC) |

Add a second NPI search call alongside the existing midwife search. The
`search_npi` function already takes a `taxonomy` parameter, but it uses
`taxonomy_description` (a text match). Use the taxonomy *code* for precision.

Add a new function (or extend `search_npi` to accept a code):

```python
def search_npi_lactation(city: str, state: str, limit: int = 20) -> list[dict]:
    """Search NPI Registry for lactation consultants (IBCLC/CLC)."""
    results = []
    for taxonomy_code in ["163WL0100X", "174N00000X"]:
        params = urllib.parse.urlencode({
            "version": "2.1", "enumeration_type": "NPI-1",
            "taxonomy_code": taxonomy_code,   # code, not description
            "city": city, "state": state, "limit": limit,
        })
        try:
            with urllib.request.urlopen(f"{NPI_BASE}?{params}", timeout=10) as resp:
                data = json.loads(resp.read())
        except Exception:
            continue
        for r in data.get("results", []):
            basic = r.get("basic", {})
            addrs = r.get("addresses", [])
            prac = [a for a in addrs if a.get("address_purpose") == "LOCATION"]
            name = f"{basic.get('first_name','')} {basic.get('last_name','')}".strip() \
                or basic.get("organization_name", "")
            results.append({
                "name": name,
                "credential": basic.get("credential", ""),
                "taxonomy": r.get("taxonomies", [{}])[0].get("desc", ""),
                "phone": prac[0].get("telephone_number", "") if prac else "",
                "source": "NPI-lactation",
            })
    return results
```

In `research_city()`, Phase 2:

```python
npi_results = search_npi(city, state, "midwife", 20)
npi_lactation = search_npi_lactation(city, state, 20)   # NEW
```

### 2C. Extend `classify_place()` to recognize lactation

Add lactation classification before the existing doula check (so a
"lactation consultant" listing doesn't fall through to doula):

```python
def classify_place(p: dict, target_state: str = "") -> tuple[Union[str, None], str]:
    address = (p.get("address") or "").lower()
    name = (p.get("title") or "").lower()
    cat = (p.get("category") or "").lower()
    text = f"{name} {cat}"

    if target_state and address and target_state.lower() not in address:
        return (None, "")

    if any(kw in text for kw in ["midwife", "midwifery"]):
        return ("midwife", "midwives")
    # NEW — lactation classification (before doula so "lactation doula" → lactation)
    if any(kw in text for kw in ["lactation", "breastfeeding", "ibclc", "clc "]):
        return ("lactation", "lactation_specialists")
    if "doula" in text:
        return ("doula", "doulas")
    if any(kw in text for kw in ["birth center", "birth-center", "freestanding birth"]):
        return ("birth_center", "birth_centers")
    if any(kw in text for kw in ["hospital", "medical center"]):
        return ("hospital", "hospitals")
    return (None, "")
```

Keyword rationale: "lactation" and "breastfeeding" are the dominant terms in
Google Maps business names/categories. "ibclc" and "clc" catch credential-led
listings. The trailing space in `"clc "` avoids matching "cycle" substrings.

### 2D. Add `lactation_specialists` to the result dict

In `research_city()`, the result dict:

```python
result = {
    "city": city,
    "state": state,
    "doulas": [],
    "midwives": [],
    "lactation_specialists": [],    # NEW
    "birth_centers": [],
    "hospitals": [],
    "npi_midwives": npi_results,
    "npi_lactation": npi_lactation,  # NEW
}
```

Dedup: a lactation specialist who also appears as a doula should be kept in
`lactation_specialists` and removed from `doulas` (lactation is the more
specific signal). Extend the existing dedup block:

```python
doula_names = set(d["name"].lower() for d in result["doulas"])
result["midwives"] = [m for m in result["midwives"] if m["name"].lower() not in doula_names]
# NEW — remove lactation specialists from doulas if they appear in both
lactation_names = set(l["name"].lower() for l in result["lactation_specialists"])
result["doulas"] = [d for d in result["doulas"] if d["name"].lower() not in lactation_names]
```

### 2E. Update the summary line

```python
print(f"\n  Results: {len(result['doulas'])} doulas, {len(result['midwives'])} midwives, "
      f"{len(result['lactation_specialists'])} lactation specialists, "   # NEW
      f"{len(result['birth_centers'])} birth centers, {len(result['hospitals'])} hospitals, "
      f"{len(result['npi_midwives'])} NPI midwives, {len(result['npi_lactation'])} NPI lactation",  # NEW
      file=sys.stderr)
```

### 2F. Edge case: zero lactation providers found

Lactation specialists are sparse in many areas. The pipeline must not fail when
zero are found. Rules:

- `result["lactation_specialists"]` can be `[]`. The downstream enrichment,
  outreach, and rendering all already handle an empty provider set gracefully
  (the grid just has fewer cards).
- The research subagent goal (§3B) should say "Find lactation specialists if
  available in the area; if none are found, note it and proceed."
- The preflight gate (§5) must NOT require a minimum lactation count. Lactation
  is a nice-to-have, not a G37-style population-proportional requirement.
- The probe script (§6) reports `lactation_count` for visibility but does not
  block on it.

---

## 3. Pipeline State Machine Changes

**File:** `scripts/tjb-pipeline-state.py`

### 3A. Update the research stage goal

```python
"needs_research": {
    "skill": "tjb-city-pipeline",
    "goal_template": "Research providers, hospitals, birth centers, and lactation specialists for {slug}. Write the data into cities.ts using Python heredoc via terminal (NEVER use write_file or patch on cities.ts). Find at least the minimum provider count for the city's population tier. Find lactation specialists (IBCLC/CLC) if available; if none in the area, note it and proceed. Verify data accuracy.",
    "toolsets": ["terminal", "file", "web", "browser"],
},
```

### 3B. Update enrichment stage goals to mention lactation

Each enrichment pass that scans providers should mention lactation so the
subagent knows to set `isLactation` and lactation-specific `services`. The key
ones:

**needs_verification:**
> "For each provider, verify the business is real, active, and is actually a
> doula, midwife, or lactation specialist."

**needs_services:**
> "Populate the services[] array with specific service strings (e.g., 'Birth
> Doula', 'Postpartum Doula', 'Lactation Consultant', 'Breastfeeding Support').
> Set `isLactation: true` for providers whose primary practice is lactation
> consulting (IBCLC/CLC/CLS)."

**needs_deal_breakers:**
No change needed — the deal-breaker fields (VBAC, water birth, home birth,
languages, Medicaid) apply to lactation specialists too.

**needs_enrichment (final pass):**
> "Add provider descriptions, hospital thumbnails, birth center details, and
> any remaining fields. For lactation specialists, ensure `credential` reflects
> their IBCLC/CLC/CLS credential and `services[]` includes 'Lactation' or
> 'Breastfeeding Support'."

### 3C. No new stage needed

Lactation specialists flow through the same 14 stages. There is no separate
"needs_lactation" stage. They enter in `needs_research`, get enriched in the
same field-specific passes, and get outreach in `needs_outreach`. Adding a stage
would complicate the state machine and the probe for no benefit.

---

## 4. Enrichment Phase Changes

### 4A. `scripts/update-cities-with-enriched.py`

Extend `build_all_entries()` to emit lactation specialist entries:

```python
def build_all_entries(json_path: str) -> str:
    with open(json_path) as f:
        data = json.load(f)

    lines = []
    for p in data.get("doulas", []):
        lines.append(build_entry(p, is_midwife=False))
    for p in data.get("midwives", []):
        lines.append(build_entry(p, is_midwife=True))
    for p in data.get("lactation_specialists", []):           # NEW
        lines.append(build_entry(p, is_midwife=False, is_lactation=True))

    return ''.join(lines)
```

Extend `build_entry()` to accept and emit `is_lactation`:

```python
def build_entry(p: dict, is_midwife: bool = False, is_lactation: bool = False) -> str:
    # ... existing logic ...
    if is_lactation:
        # Credential logic for lactation specialists
        md_lower = md.lower()
        if 'ibclc' in md_lower or 'international board' in md_lower:
            parts.append(f'credential: "IBCLC"')
        elif 'clc' in md_lower:
            parts.append(f'credential: "CLC"')
        else:
            parts.append(f'credential: "Lactation Consultant"')
        parts.append(f'isLactation: true')
    elif is_midwife:
        # ... existing midwife credential logic ...
    # ...
```

Note: the existing `extract_services()` already maps "lactation" → "Lactation"
and "breastfeeding" → "Breastfeeding Support". No change to the service
extraction map is needed; lactation providers will naturally get those service
tags from their website content.

### 4B. Enrichment review standard

**File:** `scripts/enrichment-review-standard.md`

Add a short section so the reviewer model knows lactation specialists are valid
providers and what to check:

```markdown
### 7. Lactation Specialist Data Quality (when isLactation: true)
- credential must be a lactation credential (IBCLC, CLC, CLS, or "Lactation Consultant")
- services[] must include "Lactation" or "Breastfeeding Support"
- costRange applies (lactation consults typically $150-$300; some accept insurance)
- Zero lactation specialists is acceptable (sparse in many areas)
- A provider with isLactation: true should NOT also have isMidwife: true
```

### 4C. Enrichment subagent context

The `tjb-provider-enrichment` skill (loaded by the enrichment stages) should add
a short lactation section. In compact 3-line form (Jeff's preference):

```
Lactation specialists (isLactation: true) are a third provider type.
Set credential to IBCLC/CLC/CLS; services must include Lactation or Breastfeeding Support.
Zero lactation providers is OK — do not fabricate or force-add doulas as lactation.
```

---

## 5. Preflight & Probe Changes

### 5A. `scripts/preflight.ts` — no lactation gate

Do NOT add a G37-style minimum lactation count. Lactation is sparse; a gate
would fail small cities. The existing G37 (provider count proportional to
population) already counts *all* providers in `localDoulas`, so lactation
specialists will be counted toward the total automatically.

### 5B. `scripts/preflight.ts` — G61 ratio (optional)

G61 currently checks doula:midwife ratio (max 6:1). Consider adding a
doula:lactation ratio warning (not a fail) if desired. This is optional and
deferred — do not add it in the initial rollout. If added later:

```ts
// G62 (optional, future): Doula-to-lactation ratio
// Count providers where isLactation: true
// Warn if ratio > 10:1 (lactation is sparse, so a high ratio is expected)
// Do NOT fail — informational only
```

### 5C. `probe-city-candidates.py` — add lactation count

In `probe_single()`, add a count of lactation providers for visibility:

```python
# Count lactation specialists
lactation_count = sum(1 for pe in prov_entries if re.search(r'isLactation:\s*true', pe))
states['lactation_count'] = lactation_count
```

This does not affect stage determination — it's reported in the probe JSON for
the orchestrator's visibility and for the multi-city probe table (add a column
if desired, but not required).

---

## 6. Outreach Phase Changes

### 6A. `tjb-provider-outreach` skill — add lactation to the provider scope

The skill's opening line currently says "verified doulas, midwives, and birth
centers." Update:

> "Send listing notification emails to verified doulas, midwives, lactation
> specialists, and birth centers after their city page is live."

### 6B. `tjb-provider-outreach-email` skill — lactation email template

Lactation specialists get a tailored first-touch template. The structure is the
same as the doula/midwife template, but the personalized paragraph references
lactation expertise (breastfeeding support, IBCLC credentials, consult
practice) rather than birth doula work.

**Subject:** `Can you review your info on True Joy Birthing, {City}?`

**Body template (lactation variant):**

```
Hi {First name},

I'm Shelbi, a doula based in Heber City, Utah. I've been building birth support
pages for different cities and just launched the {City} page.

[PERSONALIZED PARAGRAPH — reference something specific from their lactation
practice: their IBCLC credential, a breastfeeding class they offer, their
approach to tongue-tie or reflux support, their consult setting (home visit,
clinic, virtual). Do NOT use "I came across" (banned phrase).]

The main reason I'm reaching out: I want this page to be a genuinely useful
resource for women in {City}. If you have a few minutes, could you look it over
and tell me if anything seems off? Hospital info, cost ranges, Medicaid details,
the other providers listed, anything you'd change. You know this community
better than I do, and I want to get it right.

While you're there, could you also check that your own info is accurate?
Services, pricing, areas you serve. If anything needs fixing, just reply here
and I'll update it.

I'd really appreciate your help getting this right for {City} families.

You can see it here: {URL}

Thanks,
Shelbi
---
True Joy Birthing, 104 E 600 S, #519, Heber City, UT 84032

If you don't want me to email you again, just let me know.
```

### 6C. Outreach routing — how to pick the template

When drafting, check the provider's type:

```python
# Pseudocode for template selection
if provider.get("isMidwife"):
    template = midwife_template
elif provider.get("isLactation"):
    template = lactation_template   # NEW
else:
    template = doula_template
```

The personalization tier table (solo rich site / solo minimal / agency /
NPI-verified no-website) applies unchanged. NPI-verified lactation consultants
from the NPI Registry search (§2B) fall into the "NPI-verified, no website" tier
— honest, minimal, no fabricated details.

### 6D. Cross-city provider registry

The registry (`tjb-provider-registry.json`) tracks providers by name + city.
Lactation specialists are tracked identically. No schema change needed — the
registry stores provider name, email, website, practice, city, status. The
`isLactation` flag is not needed in the registry (it's a cities.ts concern).
The registry's `check-send` command works the same for lactation specialists.

### 6E. Email discovery for lactation specialists

No change. The existing email discovery methods (website scrape, social,
domain inference, contact form) apply identically. NPI Registry results
include a phone number, which can help find a website via Google if the NPI
record doesn't list one.

---

## 7. City Page Template Changes (Rendering)

**File:** `src/pages/birth-support/[city].astro`

### 7A. Section header

The current H2 is "Doulas & Midwives Serving {city}". Update to include
lactation:

```astro
<h2 class="text-2xl md:text-3xl font-bold text-tjb-charcoal mb-4"
    style="font-family: 'DM Sans', sans-serif;">
  Doulas, Midwives & Lactation Specialists Serving {city}
</h2>
```

The subtitle:
```astro
<p class="text-tjb-gray max-w-2xl mx-auto">
  Real people, real support: here are doulas, midwives, and lactation
  specialists who serve {city} families. Every listing is a practicing
  provider, not an ad.
</p>
```

### 7B. Filter bar — add lactation filter chip

Add a `filterHasLactation` flag (parallel to `filterHasMidwife`):

```astro
let filterHasLactation = false;
// ...in the provider scan loop:
if (d.isLactation) filterHasLactation = true;
```

Add to the `showFilterBar` condition:

```astro
const showFilterBar = (localDoulas?.length || 0) >= 2 && (
  filterServiceValues.size > 0 || filterHasMedicaid || filterHasAccepting ||
  filterHasMidwife || filterHasLactation || filterCostTiers.size > 0 || filterLanguageValues.size > 0
);
```

Add the filter chip:

```astro
{filterHasLactation && (
  <button class="filter-chip inline-flex items-center bg-white text-tjb-charcoal text-xs font-medium px-3 py-1.5 rounded-full border border-tjb-lavender-200 hover:border-tjb-rose-300 hover:bg-tjb-rose-50 transition"
          data-filter="lactation:yes">Lactation</button>
)}
```

### 7C. Provider card — data attribute and badge

Add `data-lactation` to the card (parallel to `data-midwife`):

```astro
data-lactation={doula.isLactation ? 'yes' : ''}
```

Add the "Lactation" badge next to the "Midwife" badge:

```astro
{doula.isMidwife && <span class="inline-flex items-center bg-tjb-lavender-100 text-tjb-lavender-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-tjb-lavender-200">Midwife</span>}
{doula.isLactation && <span class="inline-flex items-center bg-tjb-sage-100 text-tjb-sage text-xs font-medium px-2.5 py-0.5 rounded-full border border-tjb-sage">Lactation</span>}
```

The `tjb-sage` palette only defines `--color-tjb-sage` (#A8B5A0) and
`--color-tjb-sage-100` (#E8EDE5) in `src/styles/global.css` — there is no
`tjb-sage-200` or `-700`. The badge above uses the two existing tokens:
`bg-tjb-sage-100` (light sage background) + `text-tjb-sage` (medium sage text) +
`border-tjb-sage`. This visually distinguishes the lactation badge from the
lavender midwife badge using only defined tokens. If a sage border is too
subtle, swap `border-tjb-sage` for `border-tjb-lavender-200` (already
safelisted) as a safe fallback. Add the new classes to `src/styles/safelist.ts`
if using the JIT safelist.

### 7D. Filter JavaScript

The filter chip uses `data-filter="lactation:yes"`. The existing filter JS
matches `data-{attribute}` on cards. Add `lactation` to the data attributes
the filter logic reads. The current JS already reads `data-midwife`; add
`data-lactation` the same way. (One line in the filter match function.)

### 7E. Midwife section / "What About a Midwife" — optional lactation addition

The existing midwife section (line ~1403) explains midwife types. Consider
adding a short lactation paragraph either within this section or as a new
short section. This is optional and can be deferred. If added:

```astro
{/* Optional: lactation note in or near the midwife section */}
<p>If you're planning to breastfeed, {city} also has lactation consultants
   (IBCLCs and CLCs) who can help with latch, supply, and feeding challenges,
   often available for home visits or virtual consults. See the lactation
   specialists listed above.</p>
```

Only render this if at least one lactation specialist exists:

```astro
{localDoulas?.some(d => d.isLactation) && (
  <p>...lactation note...</p>
)}
```

### 7F. Cost section

The cost section mentions doula and midwife costs. Optionally add a lactation
consult cost line:

> "Lactation consultant visits typically cost $150-$300 per session, and
> many IBCLCs accept insurance."

This is optional and can be deferred. It should only render if lactation
providers exist on the page.

### 7G. FAQ

Add or update a FAQ item about lactation support:

```js
{ q: `Does ${state} cover lactation consulting?`, a: `Many insurance plans
  cover lactation consulting under the Affordable Care Act's preventive care
  provisions. IBCLC services at hospitals and clinics are often covered.
  Check with your insurance plan for specific coverage details in ${city}.` },
```

This is optional and can be deferred.

---

## 8. Implementation Order (Minimal-Risk Sequence)

1. **Data model** (§1) — add `isLactation?` to the interface. Zero-risk, no
   build break.
2. **Research script** (§2) — add query, NPI search, classification, result
   key. Test on one city: `python3 scripts/research-providers.py "Austin" "TX"
   --output /tmp/austin-lactation-test.json` and verify
   `lactation_specialists` is populated.
3. **Enrichment writer** (§4A) — extend `build_entry` + `build_all_entries`.
4. **Pipeline state machine** (§3) — update goal templates. No structural
   change.
5. **Probe** (§5C) — add lactation count. No stage change.
6. **City page template** (§7) — header, filter, badge, data attribute.
   Build and verify on a test city.
7. **Outreach skills** (§6) — add lactation template and routing.
8. **Enrichment review standard** (§4B) — add lactation section.

Each step is independently shippable. Steps 1-5 can land before the template
changes; lactation providers will be stored in cities.ts and invisible until
the template renders the badge and filter.

---

## 9. Edge Cases Summary

| Edge case | Handling |
|---|---|
| Zero lactation providers found | `lactation_specialists: []`. No preflight gate. Probe reports 0. Page renders without lactation badge/filter. Outreach sends 0 lactation emails. Not a failure. |
| Provider is both doula and lactation | Classify as lactation (more specific signal). `isLactation: true`, `services` includes "Birth Doula". Card shows both "Lactation" badge and service tags. |
| Provider is both midwife and lactation | Classify as midwife (midwife is the stronger clinical credential). `isMidwife: true`, add "Lactation" to `services`. Do NOT set `isLactation`. |
| NPI lactation match with no website | Enrichment tier "NPI-verified, no website." Outreach uses minimal honest template. `photo` stays empty (monogram fallback). |
| IBCLC vs CLC distinction unclear | Default `credential` to "Lactation Consultant" if the exact credential can't be determined. The reviewer standard allows this. |
| Lactation provider in a different city/state | Same state filter as existing: `classify_place` already filters by target state. A lactation consultant in a neighboring city that serves the target city is kept (the state filter has the same border-city exception). |
| Past city pages | No change. They have no `isLactation` field → flag is undefined → no badge, no filter, no behavior change. The new H2 text ("Doulas, Midwives & Lactation Specialists") will appear on all pages, but that's a one-time text change — it reads correctly even with zero lactation providers listed. |

---

## 10. Compact Rules (Jeff's 3-line format)

```
isLactation: true marks lactation specialists (IBCLC/CLC/CLS) in localDoulas.
Search adds "lactation consultant {city} {state}" + NPI taxonomy 163WL0100X/174N00000X.
Zero lactation providers is OK — no gate, no fail, page renders without lactation badge.
Outreach uses a lactation-specific first-touch template (references breastfeeding expertise).
Classify: midwife > lactation > doula; dual doula+lactation → lactation with Birth Doula in services.
```