# TJB Website Image Asset Catalog

Generated from `public/images/` and `public/` (favicons), cross-referenced against `src/` for production usage.

---

## 1. Hero / Portrait Photos

| Filename | Format | Dimensions | File Size | Used? | Source References |
|---|---|---|---|---|---|
| shelbi-hero-portrait.webp | WebP | 789×1052 | 46.4 KB | ✅ USED | index.astro, birth-plan-template.astro |
| shelbi-real.webp | WebP | 1200×673 | 35.2 KB | ✅ USED | about.astro |
| shelbi-real-hero.webp | WebP | 600×337 | 11.7 KB | ❌ UNUSED | — |
| shelbi-portrait.webp | WebP | 1920×2560 | 192.4 KB | ❌ UNUSED | — |
| shelbi-portrait-1.webp | WebP | 1400×1931 | 82.7 KB | ❌ UNUSED | — |
| shelbi-portrait-2.webp | WebP | 1400×1867 | 163.1 KB | ❌ UNUSED | — |
| shelbi-portrait-3.webp | WebP | 1400×1391 | 77.3 KB | ❌ UNUSED | — |
| shelbi-portrait-4.webp | WebP | 1400×1899 | 115.6 KB | ❌ UNUSED | — |
| shelbi-portrait-5.webp | WebP | 1400×1867 | 143.6 KB | ❌ UNUSED | — |
| shelbi-portrait-6.webp | WebP | 1400×1616 | 481.5 KB | ❌ UNUSED | — |

---

## 2. Icon Marks

| Filename | Format | Dimensions / viewBox | File Size | Used? | Source References |
|---|---|---|---|---|---|
| logo.svg | SVG | viewBox="0 0 480 128" | 8.7 KB | ✅ USED | Layout.astro (header + JSON-LD), PostLayout.astro (header + JSON-LD) |
| logo-white.svg | SVG | viewBox="0 0 480 128" | 8.8 KB | ✅ USED | Layout.astro (footer), PostLayout.astro (footer) |

---

## 3. Favicons

| Filename | Format | Dimensions / viewBox | File Size | Used? | Source References |
|---|---|---|---|---|---|
| favicon.svg | SVG | viewBox="0 0 128 128" | 1.1 KB | ✅ USED | Layout.astro, PostLayout.astro (`<link rel="icon" type="image/svg+xml" href="/favicon.svg">`) |
| favicon.ico | ICO | 16×16, 32×32 | 1.8 KB | ✅ USED | Layout.astro, PostLayout.astro (`<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">`) |
| apple-touch-icon.png | PNG | 180×180 | 4.5 KB | ✅ USED | Layout.astro, PostLayout.astro (`<link rel="apple-touch-icon" ...>`) |

*(Note: These live in `public/` root, not `public/images/`)*

---

## 4. OG Images

| Filename | Format | Dimensions | File Size | Used? | Source References |
|---|---|---|---|---|---|
| og-homepage.webp | WebP | 1200×630 | 37.9 KB | ✅ USED | index.astro |
| og-default.webp | WebP | 1200×630 | 10.5 KB | ✅ USED | Layout.astro (default ogImage prop) |
| og-birth-plan-template.webp | WebP | 1200×630 | 44.4 KB | ✅ USED | birth-plan-template.astro |
| social-card.webp | WebP | 1200×630 | 217.5 KB | ❌ UNUSED | — |

---

## 5. City Skyline Photos — WebP (production)

Each city's `*-texas-birth-doula-skyline.webp` is used dynamically by `src/pages/birth-support/[city].astro` line 25:
```js
const heroImage = `/images/${slug.replace('-tx', '')}-texas-birth-doula-skyline.webp`;
```

| Filename | Format | Dimensions | File Size | Used? |
|---|---|---|---|---|
| amarillo-texas-birth-doula-skyline.webp | WebP | 1200×896 | 93.1 KB | ✅ USED (dynamic) |
| arlington-texas-birth-doula-skyline.webp | WebP | 1200×800 | 98.3 KB | ✅ USED (dynamic) |
| austin-texas-birth-doula-skyline.webp | WebP | 1200×660 | 133.3 KB | ✅ USED (dynamic) |
| carrollton-texas-birth-doula-skyline.webp | WebP | 1200×800 | 165.1 KB | ✅ USED (dynamic) |
| corpus-christi-texas-birth-doula-skyline.webp | WebP | 1200×719 | 156.8 KB | ✅ USED (dynamic) |
| dallas-texas-birth-doula-skyline.webp | WebP | 1200×800 | 159.8 KB | ✅ USED (dynamic) |
| denton-texas-birth-doula-skyline.webp | WebP | 1200×829 | 210.0 KB | ✅ USED (dynamic) |
| el-paso-texas-birth-doula-skyline.webp | WebP | 1200×665 | 210.0 KB | ✅ USED (dynamic) |
| fort-worth-texas-birth-doula-skyline.webp | WebP | 1200×799 | 119.4 KB | ✅ USED (dynamic) |
| frisco-texas-birth-doula-skyline.webp | WebP | 1200×800 | 155.6 KB | ✅ USED (dynamic) |
| garland-texas-birth-doula-skyline.webp | WebP | 1200×800 | 150.9 KB | ✅ USED (dynamic) |
| grand-prairie-texas-birth-doula-skyline.webp | WebP | 1200×1800 | 196.8 KB | ✅ USED (dynamic) |
| houston-texas-birth-doula-skyline.webp | WebP | 1200×799 | 88.1 KB | ✅ USED (dynamic) |
| irving-texas-birth-doula-skyline.webp | WebP | 1200×1680 | 107.7 KB | ✅ USED (dynamic) |
| laredo-texas-birth-doula-skyline.webp | WebP | 1200×900 | 109.3 KB | ✅ USED (dynamic) |
| lubbock-texas-birth-doula-skyline.webp | WebP | 1200×800 | 134.0 KB | ✅ USED (dynamic) |
| mckinney-texas-birth-doula-skyline.webp | WebP | 1200×800 | 165.1 KB | ✅ USED (dynamic) |
| mesquite-texas-birth-doula-skyline.webp | WebP | 1200×1620 | 123.6 KB | ✅ USED (dynamic) |
| plano-texas-birth-doula-skyline.webp | WebP | 1200×774 | 167.4 KB | ✅ USED (dynamic) |
| san-antonio-texas-birth-doula-skyline.webp | WebP | 1200×720 | 180.2 KB | ✅ USED (dynamic) |

---

## 6. City Skyline Photos — JPG (source originals, not referenced)

| Filename | Format | Dimensions | File Size | Used? |
|---|---|---|---|---|
| amarillo-skyline.jpg | JPEG | 1280×955 | 242.8 KB | ❌ UNUSED |
| arlington-skyline.jpg | JPEG | 1280×853 | 221.5 KB | ❌ UNUSED |
| austin-skyline.jpg | JPEG | 1280×704 | 262.9 KB | ❌ UNUSED |
| carrollton-skyline.jpg | JPEG | 1280×853 | 327.1 KB | ❌ UNUSED |
| corpus-christi-skyline.jpg | JPEG | 1280×766 | 314.3 KB | ❌ UNUSED |
| dallas-skyline.jpg | JPEG | 1280×853 | 314.4 KB | ❌ UNUSED |
| denton-skyline.jpg | JPEG | 2657×1835 | 1.8 MB | ❌ UNUSED |
| el-paso-skyline.jpg | JPEG | 1280×709 | 385.8 KB | ❌ UNUSED |
| fort-worth-skyline.jpg | JPEG | 1280×852 | 261.3 KB | ❌ UNUSED |
| frisco-skyline.jpg | JPEG | 1280×853 | 316.3 KB | ❌ UNUSED |
| garland-skyline.jpg | JPEG | 1280×853 | 302.0 KB | ❌ UNUSED |
| grand-prairie-skyline.jpg | JPEG | 1280×1920 | 460.7 KB | ❌ UNUSED |
| houston-skyline.jpg | JPEG | 1280×852 | 197.8 KB | ❌ UNUSED |
| irving-skyline.jpg | JPEG | 1500×2099 | 2.3 MB | ❌ UNUSED |
| laredo-skyline.jpg | JPEG | 1280×960 | 270.7 KB | ❌ UNUSED |
| lubbock-skyline.jpg | JPEG | 1280×853 | 303.9 KB | ❌ UNUSED |
| mckinney-skyline.jpg | JPEG | 1280×853 | 330.2 KB | ❌ UNUSED |
| mesquite-skyline.jpg | PNG | 540×729 | 708.4 KB | ❌ UNUSED *(misnamed .jpg, actually PNG)* |
| plano-skyline.jpg | JPEG | 1280×825 | 331.9 KB | ❌ UNUSED |
| san-antonio-skyline.jpg | JPEG | 1280×768 | 333.4 KB | ❌ UNUSED |

---

## 7. Other Content Images

| Filename | Format | Dimensions | File Size | Used? | Source References |
|---|---|---|---|---|---|
| baby-top-down.webp | WebP | 1050×1400 | 478.2 KB | ❌ UNUSED | — |
| birthing-center.webp | WebP | 1400×933 | 60.5 KB | ❌ UNUSED | — |
| birthing-room-2.webp | WebP | 1400×933 | 61.2 KB | ❌ UNUSED | — |
| birth-plan-banner.webp | WebP | 2048×640 | 223.2 KB | ❌ UNUSED | — |
| birth-plan-booklet-1.webp | WebP | 800×814 | 215.7 KB | ❌ UNUSED | — |
| birth-plan-booklet-2.webp | WebP | 856×865 | 200.3 KB | ❌ UNUSED | — |
| birth-plan-couch.webp | WebP | 1536×1024 | 101.8 KB | ✅ USED | birth-plan-course.astro |
| birth-plan-preview.webp | WebP | 576×320 | 34.7 KB | ❌ UNUSED | — |
| birth-plan-template.webp | WebP | 1400×800 | 144.4 KB | ❌ UNUSED | — |
| couple-meditating.webp | WebP | 1400×800 | 81.1 KB | ❌ UNUSED | — |
| doula-birth-plan-couch.webp | WebP | 1536×1024 | 107.9 KB | ✅ USED | about.astro, birth-plan-session.astro |
| doula-breastfeeding.webp | WebP | 1024×1536 | 77.1 KB | ❌ UNUSED | — |
| doula-counter-pressure.webp | WebP | 1024×1536 | 80.6 KB | ❌ UNUSED | — |
| doula-holding-hands.webp | WebP | 1024×1536 | 54.2 KB | ✅ USED | about.astro, new-doula-start-here.astro |
| doula-hospital-husband.webp | WebP | 1536×1024 | 63.0 KB | ❌ UNUSED | — |
| doula-labor-support.webp | WebP | 1536×1024 | 62.3 KB | ❌ UNUSED | — |
| doula-map-pin.webp | WebP | 1536×1024 | 51.8 KB | ❌ UNUSED | — |
| doula-map.webp | WebP | 1400×933 | 102.9 KB | ❌ UNUSED | — |
| doula-meditating.webp | WebP | 1536×1024 | 80.7 KB | ❌ UNUSED | — |
| doula-meeting.webp | WebP | 1024×683 | 42.2 KB | ❌ UNUSED | — |
| doula-newborn.webp | WebP | 1536×1024 | 63.9 KB | ✅ USED | about.astro |
| doula-teaching.webp | WebP | 1024×1536 | 103.8 KB | ✅ USED | new-doula-start-here.astro, birth-plan-course.astro |
| doula-vs-midwife-checking.webp | WebP | 1024×1536 | 96.3 KB | ❌ UNUSED | — |
| doula-vs-midwife-couch.webp | WebP | 1536×1024 | 103.2 KB | ❌ UNUSED | — |
| doula-vs-midwife-planning.webp | WebP | 1536×1024 | 88.8 KB | ❌ UNUSED | — |
| doula-vs-midwife-teaching.webp | WebP | 1536×1024 | 110.4 KB | ❌ UNUSED | — |
| doula-walking.webp | WebP | 1536×1024 | 126.6 KB | ❌ UNUSED | — |
| family-circle.webp | WebP | 1400×788 | 58.6 KB | ❌ UNUSED | — |
| family-feet.webp | WebP | 1400×933 | 38.7 KB | ❌ UNUSED | — |
| family-hands-baby.webp | WebP | 1400×794 | 423.0 KB | ❌ UNUSED | — |
| group-meditating.webp | WebP | 1024×1536 | 89.9 KB | ❌ UNUSED | — |
| group-support.webp | WebP | 1400×900 | 90.1 KB | ❌ UNUSED | — |
| hands-on-belly.jpg | JPEG | 1080×720 | 58.9 KB | ❌ UNUSED | — |
| hospital-newborn.webp | WebP | 1400×933 | 390.6 KB | ❌ UNUSED | — |
| hospital-room.webp | WebP | 1400×933 | 54.4 KB | ❌ UNUSED | — |
| midwife-heartbeat.webp | WebP | 1024×1536 | 90.8 KB | ❌ UNUSED | — |
| mom-baby-map.webp | WebP | 1400×781 | 29.3 KB | ❌ UNUSED | — |
| mom-baby-notes.webp | WebP | 1400×934 | 440.5 KB | ❌ UNUSED | — |
| mom-kisses-baby.webp | WebP | 1400×933 | 60.9 KB | ❌ UNUSED | — |
| online-education.webp | WebP | 1400×800 | 83.9 KB | ✅ USED | new-doula-start-here.astro, birth-plan-course.astro |
| online-support.webp | WebP | 1400×800 | 70.5 KB | ✅ USED | about.astro |
| postpartum-doula.webp | WebP | 1024×1536 | 85.0 KB | ❌ UNUSED | — |
| skin-to-skin.webp | WebP | 1400×933 | 30.4 KB | ❌ UNUSED | — |
| video-call-doula.webp | WebP | 1400×800 | 110.0 KB | ❌ UNUSED | — |
| virtual-meeting.webp | WebP | 1536×1024 | 97.0 KB | ✅ USED | new-doula-start-here.astro, birth-plan-session.astro |
| zoom-education.webp | WebP | 1400×800 | 65.4 KB | ❌ UNUSED | — |

---

## Summary Statistics

- **Total image files in `public/images/`**: 92
- **Favicon/brand files in `public/` root**: 3 (favicon.svg, favicon.ico, apple-touch-icon.png)
- **Used in production**: 34 images (31 in public/images/ + 3 favicons)
- **Unused (not referenced in `src/`)**: 61 images in public/images/
- **Unused total file size**: ~11.5 MB of unused image assets

### Used images by category:
- **Hero/Portrait**: 2 used (shelbi-hero-portrait.webp, shelbi-real.webp)
- **Icon Marks**: 2 used (logo.svg, logo-white.svg)
- **Favicons**: 3 used (favicon.svg, favicon.ico, apple-touch-icon.png)
- **OG Images**: 3 used (og-homepage.webp, og-default.webp, og-birth-plan-template.webp)
- **City Skyline WebP**: 20 used (all via dynamic [city].astro route)
- **Other Content**: 6 used (doula-birth-plan-couch, doula-holding-hands, doula-newborn, doula-teaching, birth-plan-couch, online-education, online-support, virtual-meeting — note: some referenced from multiple pages)

### Notable unused assets by size:
- All 20 `*-skyline.jpg` source originals (~6.2 MB total)
- shelbi-portrait-6.webp (481.5 KB)
- baby-top-down.webp (478.2 KB)
- family-hands-baby.webp (423.0 KB)
- hospital-newborn.webp (390.6 KB)
- birth-plan-banner.webp (223.2 KB)
- social-card.webp (217.5 KB)
- birth-plan-booklet-1.webp (215.7 KB)
- doula-vs-midwife-teaching.webp (110.4 KB)

### Issues:
- **mesquite-skyline.jpg** is actually a PNG mislabeled as .jpg (file magic says "PNG image data")
- **irving-skyline.jpg** is unusually large at 2.3 MB (dimensions 1500×2099)
- **denton-skyline.jpg** is also oversized at 1.8 MB (dimensions 2657×1835)