# TJB City Page Completion Review Standard

This document defines what a COMPLETE, CORRECT TJB city location page looks like.
The GLM-5.2 reviewer reads this document + the live page URL + the YouTube thumbnail
+ the provider-scroll screenshot and returns a pass/fail verdict with specific failures.

This is the FINAL gate before a city is marked "complete." No city reaches "complete"
status without passing this review.

## What the Reviewer Checks

### 1. Page Structure (checked against live HTML)
- [ ] Page returns HTTP 200
- [ ] Hero image is a real photograph of a pregnant woman silhouette (not a gradient, not a skyline-only shot)
- [ ] Hero image shows the correct city (city-specific background)
- [ ] OG image exists and is a real photo (not a placeholder)
- [ ] Page has a "Doulas & Midwives" section with real provider cards
- [ ] Page has a "Hospitals" section with real hospital data
- [ ] Page has FAQs section with at least 4 Q&As
- [ ] Page has cost information (dollar ranges, not "Contact for pricing" everywhere)
- [ ] Page has Medicaid/insurance information
- [ ] Page has a video embed (YouTube iframe or facade)
- [ ] Page has CAN-SPAM footer with real business address (217 6th Ave N STE 43363, Nashville, TN 37219)
- [ ] No "undefined" text anywhere in visible content
- [ ] No broken images (all <img> srcs return 200)

### 2. Provider Data Quality
- [ ] At least 3 providers listed (more for larger cities)
- [ ] Each provider has a name (real business name, not "Doulas" or "Resources")
- [ ] Each provider has a photo or logo (not just initials/placeholder)
- [ ] Each provider has a cost range (dollar amounts, not all "Contact for pricing")
- [ ] Each provider has a description (specific to the provider, not generic)
- [ ] Each provider has credentials (certification type, not blank)
- [ ] No cross-city contamination (provider photos from other cities)

### 3. YouTube Video & Thumbnail
- [ ] YouTube video exists and is embedded on the page
- [ ] YouTube thumbnail is a branded image (not a raw video frame)
- [ ] Thumbnail contains: city name, "Your Complete [City] Birth Guide" title, "True Joy Birthing" branding, pregnant woman silhouette
- [ ] Thumbnail is NOT the auto-generated YouTube frame (dark, no text, no branding)

### 4. Video Provider-Scroll Scene
- [ ] The fullpage-scroll screenshot exists and is > 1MB
- [ ] Provider photos are visible in the screenshot (not blank/missing due to lazy-loading)
- [ ] Screenshot shows the correct city's providers (not another city's data)

### 5. Visual Quality (checked via vision_analyze on live page)
- [ ] Page looks professional and complete
- [ ] No broken layouts or missing sections
- [ ] Provider cards have photos that look like real people/businesses
- [ ] Hero image is properly sized (not stretched, not letterboxed)
- [ ] Color scheme matches TJB brand (lavender, sage, warm tones)

## Reviewer Input

The reviewer receives:
1. This standard document
2. The live page URL: https://truejoybirthing.com/birth-support/{slug}/
3. The YouTube video ID (from video-embeds.ts)
4. The path to the fullpage-scroll.png screenshot
5. The city slug and basic context (city name, state, population tier)

## Reviewer Output

```json
{
  "pass": true/false,
  "score": 0-100,
  "category": "structure" | "providers" | "video" | "thumbnail" | "visual" | "overall",
  "failures": [
    {
      "category": "thumbnail",
      "severity": "critical" | "major" | "minor",
      "issue": "YouTube thumbnail is a raw video frame, not a branded image",
      "fix": "Generate branded thumbnail using render-yt-thumbnail.cjs and upload to YouTube"
    }
  ],
  "notes": "Optional context about borderline cases"
}
```

## Passing Threshold
- Score >= 85: PASS — city can be marked "complete"
- Score 70-84: FAIL — specific issues to fix, then re-review
- Score < 70: FAIL — city needs significant rework

## Critical Failures (auto-fail regardless of score)
- YouTube thumbnail is a raw video frame (not branded)
- Provider photos are missing/blank in the scroll screenshot
- Page returns non-200 HTTP status
- "undefined" text in visible content
- Cross-city data contamination
- No video embedded on the page