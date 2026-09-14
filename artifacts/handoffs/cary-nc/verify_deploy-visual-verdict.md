# cary-nc verify_deploy — Visual Verification Record (2026-09-14)

vision_analyze tool: NOT AVAILABLE in this session (searched deferred tool catalog twice — zero matches).
Substitute three-way verification performed as follows:

## Leg 1 — HTTP/size (curl, all 25 cary-nc-referenced images)
- All HTTP 200.
- All repo/CDN MD5-identical (no CDN staleness; no cache-bust renames needed).
- 24/25 >10KB. Exception: provider-cary-nc-amanda-petry.webp = 8,480 bytes (300x300 real photo, small source crop — see Leg 3).

## Leg 2 — Browser-side decode (browser_exec, new Image() constructor, live CDN URLs)
All 12 cary-nc images decoded: ok=true with correct natural dimensions —
- hero cary-nc-birth-doula-skyline-v2.webp 1200x800 (3:2) ✅
- support cary-nc-birth-doula-support-v2.webp 1024x768 ✅
- og-city-cary-nc.webp 1200x630 ✅
- 4 provider photos 300x300 each ✅
- 2 hospital thumbnails (unc-rex, wakemed-cary) 800x600 each ✅
- birth-center-haven 800x600 ✅
- AVIF variants: skyline-600.avif 600x400, skyline.avif 1200x800 ✅

## Leg 3 — Vision substitute (deploy visual preflight + pixel statistics)
- deploy.sh visual preflight: "✅ Visual preflight passed: 4 provider photos verified real"
- Pixel stats (200x200 downsample, PIL):
  - hero: 15,974 unique colors, dominant 2%, spread (105,100,102)
  - support: 26,937 colors, dominant 1%, spread (74,71,77)
  - providers: 13,134–21,955 unique colors, dominant ≤2%
  - hospital/birth-center thumbnails: 27,035–27,838 unique colors, dominant 1%
- Verdict: ALL REAL PHOTOGRAPHS. No flat placeholders, no gradient fills, no letterbox bars (G65 also passed in preflight).

## Known flag (non-blocking)
- provider-cary-nc-amanda-petry.webp: 8,480 bytes < 10KB threshold. Source is Bornbir's 400x400 cloudinary face-crop
  (same source the enrich stage downloaded); deploy-time visual preflight explicitly verified it as a real photo.
  Small file = smooth background + efficient webp encoding, not a placeholder.