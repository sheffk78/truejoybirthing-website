# TJB City Enrichment Quality Standard

This document defines the quality bar for city page data after the enrichment stage.
The reviewer model reads this document + the city's cities.ts entry and returns a
pass/fail verdict with specific failures.

## What the reviewer checks

### 1. Hospital Descriptions (4-6 sentences each)
Each hospital entry MUST include:
- NICU level explicitly stated (e.g., "Level III NICU")
- Doula policy mentioned (welcomed, restricted, or "confirm during tour")
- Midwifery support mentioned if applicable
- Insurance/Medicaid acceptance noted
- No scraped artifacts (HTML tags, nav text, "Hours. Tuesday, Wednesday...", phone numbers in descriptions)
- No generic placeholder text ("Contact the hospital for more information")

### 2. Provider Data Quality
- costRange must be a dollar range (e.g., "$800-$1,200") or "Contact for pricing" ONLY if no pricing data exists
- "Contact for pricing" should be < 50% of providers (if all say this, enrichment failed)
- Provider names must be real business names, not generic terms ("Doulas", "Resources", "Our Board", "Home")
- Descriptions must be specific to the provider, not generic ("I'm a doula serving the area" is too generic)
- No scraped website artifacts in descriptions (nav text, "Map.", "Directions.", "Call Now.", "Hours.")
- Service areas must match the city (not a different state)

### 3. Provider Count Proportionality
- Major metros (pop > 500K): 6-10 doulas expected
- Mid-size cities (pop 100K-500K): 4-8 doulas expected
- Small cities (pop < 100K): 3-6 doulas expected
- Fewer than 3 is always a fail
- More than 12 is suspicious (possible duplicates or wrong-city data)

### 4. Birth Center Data
- If birth centers exist in the metro area, they should be listed
- If none exist, a comment explaining the search was performed (NPI registry, Google Maps)
- Birth center descriptions should not be duplicates of hospital descriptions

### 5. Cultural Context
- `culture` field must reference the specific city, not generic text
- `heroLocalDetail` must mention real landmarks, highways, or neighborhoods in the city
- No copy-paste from another city (the reviewer should flag any text that seems city-agnostic)

### 6. Data Formatting
- No HTML entities in descriptions (except intentional links like `<a href="/birth-plan-template/">`)
- No raw HTML tags that aren't intentional links
- No "u2014" or other unicode escape artifacts in the text
- No double-escaped backslashes (`\\n`, `\\u2014`)
- No empty fields where data is expected (paragraph, costRange, acceptingClients)

## Reviewer output format

The reviewer returns JSON:
```json
{
  "pass": true/false,
  "score": <number 0-100>,
  "failures": [
    "Hospital 'BSA Hospital' description is only 2 sentences, missing NICU level and doula policy",
    "Provider 'Doulas' has a generic name, likely a scraping artifact",
    "4 of 6 providers have 'Contact for pricing' — enrichment did not find real cost data"
  ],
  "notes": "Optional context about borderline cases"
}
```

## Passing threshold
- Score >= 80: PASS
- Score 60-79: FAIL with specific issues to fix
- Score < 60: FAIL, enrichment should be redone entirely