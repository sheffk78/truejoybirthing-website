# Birth Center Verification Guide

## Why This Exists

Tyler, TX had a business (Azalea Birth Center) with NPI taxonomy 261QB0400X ("Clinic/Center, Birthing"), Instagram bios describing it as a birth center offering water birth, and Facebook posts advertising open houses — but its website was down and Google categorized it as "Pregnancy care center." Killeen, TX had a business (Dulce Birth & Wellness Center) that was a legitimate birthing center NPI but had transitioned to home-birth-only and closed its physical location.

**The lesson:** Single-source verification is insufficient for birth centers. Always check multiple sources.

## Mandatory Verification Sequence

For EVERY city, run ALL five checks:

### 1. NPPES/NPI Registry Search

```
https://npiregistry.cms.hhs.gov/api/?version=2.1&taxonomy=261QB0400X&city={city}&state={state}
```

Taxonomy 261QB0400X = "Clinic/Center, Birthing" = freestanding birth center.

Also search by organization name:
```
https://npiregistry.cms.hhs.gov/api/?version=2.1&organization_name={name}&city={city}&state={state}
```

**What to look for:**
- Organization name, NPI, address, taxonomy description
- Enumeration date (when NPI was assigned)
- Status (active vs. deactivated)
- The taxonomy code MUST be 261QB0400X (not just "Clinic/Center" generic)

### 2. Google Maps / Yelp Category Check

Search: `"birth center {city} TX"` or `"{business name} {city}"`

**What to look for:**
- Google category: "Birth center" ✅ vs "Pregnancy care center" ⚠️ vs "Counseling & Mental Health" ❌
- Yelp category: "Childbirth Services" or "Alternative Birth Choices" ✅
- Number of reviews (more = more likely active)
- "Permanently closed" flag ❌

### 3. Social Media Check

- **Instagram**: Search @{username} or business name. Look for:
  - Bio language about births, water birth, midwife services
  - Recent posts (within last 12 months)
  - Birth announcements or client testimonials
- **Facebook**: Search business name. Look for:
  - Posts offering tours, consultations
  - Midwife names and credentials
  - Operating hours and contact info
- **If social media is inaccessible** (login wall), note this in your research output

### 4. Website Check

- **If website is live**: Confirm out-of-hospital birth services are currently offered
- **If website is unreachable/down**: Flag as ⚠️ and escalate for human review
- **Key things to confirm**: "birth center" language, midwife-attended birth, water birth options

### 5. Operating Status Check

- Is the business currently accepting clients?
- Has it transitioned to home-birth-only? (Like Dulce Birth Center in Killeen)
- Has it "permanently closed" its physical location?
- Check for recent blog posts, social media updates, or announcements about transitions

## Decision Framework

| Evidence | Decision |
|----------|----------|
| NPI birthing taxonomy + live website confirming births + active social media | ✅ Add to `birthCenterDetails` |
| NPI birthing taxonomy + social media confirms births + website down | ⚠️ Escalate for review (like Azalea) |
| NPI birthing taxonomy + Google says "Pregnancy care center" + no birth language | ⚠️ Escalate for review — may not be a freestanding birth center |
| NPI birthing taxonomy + confirmed closed or home-birth-only | ❌ Do NOT add (like Dulce) |
| No NPI record + Google Maps "Birth center" + no website | ⚠️ Escalate for review |
| No NPI record + no social media + no website | ❌ Do NOT add |

## Documentation Requirement

Every city's birth center research must include a search comment in the data file:

**For cities WITH birth centers:**
```typescript
// Birth center: {name} — NPI {number}, taxonomy 261QB0400X, Instagram/@{handle} confirms birth services, verified {DATE}
```

**For cities WITHOUT birth centers:**
```typescript
// Birth center search: NPI 261QB0400X={city} returned 0 results, Google Maps "birth center"={city} returned no freestanding centers. Verified {DATE}.
```