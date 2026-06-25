#!/usr/bin/env python3
"""Preflight image analysis helper — PIL-based checks that preflight.ts (TypeScript)
calls via subprocess. Keeps image processing in Python where PIL lives natively.

Usage:
    python3 scripts/preflight-image-helper.py hero-silhouette <slug>
    python3 scripts/preflight-image-helper.py hospital-dimensions <slug>
    python3 scripts/preflight-image-helper.py provider-descriptions <slug>
    python3 scripts/preflight-image-helper.py service-area <slug>
    python3 scripts/preflight-image-helper.py yt-thumbnail-matches-hero <slug>
    python3 scripts/preflight-image-helper.py support-scene-quality <slug>

Returns JSON: {"pass": bool, "detail": str}
Exit code: 0 = pass, 1 = fail
"""
import json, os, re, sys, hashlib
from pathlib import Path

PROJECT_DIR = os.path.expanduser('~/Projects/truejoybirthing-website')
PUBLIC_IMAGES = os.path.join(PROJECT_DIR, 'public/images')


def _read_city_block(slug: str):
    """Extract the city block from cities.ts using slug matching."""
    cities_path = os.path.join(PROJECT_DIR, 'src/data/cities.ts')
    if not os.path.exists(cities_path):
        return None
    text = open(cities_path).read()

    # Match "slug": { pattern
    slug_pattern = re.compile(rf'"{re.escape(slug)}":\s*{{')
    match = slug_pattern.search(text)
    if not match:
        return None

    # Find block boundaries: from start of line with slug to next top-level entry
    block_start = text.rfind('\n', 0, match.start())
    if block_start < 0:
        block_start = 0
    else:
        block_start += 1  # skip the newline

    # Find next top-level entry by tracking brace depth (skips entries inside arrays)
    remainder = text[match.end():]
    depth = 1  # We're inside the city's opening {
    next_entry = None
    for i, ch in enumerate(remainder):
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                # Found the closing } of this city's block
                # Now look for the next top-level entry after this
                after_close = remainder[i+1:]
                next_match = re.search(r'\n  "[a-z][^"]*":\s*\{', after_close)
                if next_match:
                    block_end = match.end() + i + 1 + next_match.start()
                else:
                    block_end = match.end() + i + 1
                break
    else:
        block_end = len(text)

    return text[block_start:block_end]


def _extract_entries(arr_text: str) -> list[str]:
    """Extract individual provider/hospital entries from an array text block.
    Handles nested braces inside strings (e.g. serviceArea: ["Abilene", "Taylor County"])."""
    entries = []
    depth = 0
    in_str = False
    entry_start = -1

    i = 0
    while i < len(arr_text):
        ch = arr_text[i]
        if ch == '"' and (i == 0 or arr_text[i - 1] != '\\'):
            in_str = not in_str
        if not in_str:
            if ch == '{':
                if depth == 0:
                    entry_start = i
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0 and entry_start >= 0:
                    entry = arr_text[entry_start:i + 1]
                    entries.append(entry)
                    entry_start = -1
        i += 1
    return entries


def hero_silhouette(slug: str) -> dict:
    """Check hero image is a pregnant silhouette, not a city skyline."""
    try:
        from PIL import Image
    except ImportError:
        return {"pass": True, "detail": "PIL not available — skipping silhouette check"}

    # Prefer the actual heroImage value from cities.ts. Older completed cities
    # may use legacy names like "-skyline.webp" even when that file is the
    # canonical hero. Filename-pattern-only checks create false failures.
    block = _read_city_block(slug)
    full_path = None
    best = None
    if block:
        m = re.search(r'heroImage:\s*["\']([^"\']+)["\']', block)
        if m:
            hero_ref = m.group(1)
            if hero_ref.startswith('http'):
                hero_ref = '/images/' + hero_ref.rstrip('/').split('/')[-1]
            # Fix: hero_ref starts with /images/ but files live in public/images/
            # Prepend public/ to avoid PROJECT_DIR/images/ (which doesn't exist)
            candidate = os.path.join(PROJECT_DIR, 'public', hero_ref.lstrip('/'))
            if os.path.exists(candidate):
                full_path = candidate
                best = os.path.basename(candidate)

    if full_path is None:
        # Match new hero files specifically
        pattern = re.compile(rf'^{re.escape(slug)}-birth-doula-hero(-v\d+)?\.webp$')
        files = [f for f in os.listdir(PUBLIC_IMAGES) if pattern.match(f)]
        if not files:
            # Fallback: broader legacy pattern excluding support scenes/variants
            broad_pattern = re.compile(rf'^{re.escape(slug)}-birth-doula(?:-[a-z]+)?(-v\d+)?\.webp$')
            files = [f for f in os.listdir(PUBLIC_IMAGES) if broad_pattern.match(f) and 'support' not in f.lower() and '-600' not in f]

        if not files:
            return {"pass": False, "detail": f"No hero image found for {slug}"}

        # Sort by variant number descending
        def variant_key(name: str) -> int:
            m = re.search(r'-v(\d+)', name)
            return int(m.group(1)) if m else 0

        files.sort(key=variant_key, reverse=True)
        best = files[0]
        full_path = os.path.join(PUBLIC_IMAGES, best)

    try:
        img = Image.open(full_path).convert('RGB')
        w, h = img.size

        center_region = img.crop((w // 4, h // 2, 3 * w // 4, 7 * h // 8))
        top_region = img.crop((0, 0, w, h // 4))

        def avg_brightness(region):
            # getdata() still works fine — just capturing tuples
            pixels = list(region.getdata())
            brightnesses = [0.299 * r + 0.587 * g + 0.114 * b for r, g, b in pixels]
            return sum(brightnesses) / len(brightnesses)

        center = avg_brightness(center_region)
        top = avg_brightness(top_region)

        # Photo-vs-graphic check: CSS gradient compositions have very few unique
        # colors in the sky region (top third). Real photos — even heavily
        # compressed WebP — have 500+ unique colors from natural texture.
        # HTML/Playwright renders of gradient compositions have <200.
        # Threshold: <350 unique colors in top third → likely graphic, not photo.
        top_pixels = list(top_region.getdata())
        top_unique = len(set(top_pixels))
        if top_unique < 350:
            return {"pass": False, "detail": f"Hero appears to be a CSS/HTML gradient graphic, not a photo (top_unique_colors={top_unique}, threshold=350). Use image_generate with silhouette prompt from tjb-ai-photo-generation skill, NOT render-hero.cjs."}

        if center < top and (top - center) > 0.5:
            return {"pass": True, "detail": f"Silhouette confirmed (center={center:.1f} < top={top:.1f}, top_colors={top_unique})"}
        else:
            return {"pass": False, "detail": f"No silhouette detected (center={center:.1f}, top={top:.1f}, top_colors={top_unique}) — may be skyline"}
    except Exception as e:
        return {"pass": True, "detail": f"Could not analyze hero image: {e}"}


def hospital_dimensions(slug: str) -> dict:
    """Check all hospital/birth center thumbnails are landscape (not square logos)."""
    try:
        from PIL import Image
    except ImportError:
        return {"pass": True, "detail": "PIL not available — skipping dimension check"}

    block = _read_city_block(slug)
    if block is None:
        return {"pass": True, "detail": f"City {slug} not found — skipping"}

    issues = []
    for section_key in ['hospitalDetails', 'birthCenterDetails']:
        idx = block.find(f'{section_key}:')
        if idx == -1:
            continue
        arr_start = block.find('[', idx)
        if arr_start == -1:
            continue

        arr_text = block[arr_start:]
        depth = 0
        in_str = False
        arr_end = None
        for i, ch in enumerate(arr_text):
            if ch == '"' and (i == 0 or arr_text[i - 1] != '\\'):
                in_str = not in_str
            if not in_str:
                if ch == '[':
                    depth += 1
                elif ch == ']':
                    depth -= 1
                    if depth == 0:
                        arr_end = i + 1
                        break
        if arr_end is None:
            continue
        arr_text = arr_text[:arr_end]

        entries = _extract_entries(arr_text)

        for entry in entries:
            name_m = re.search(r'name:\s*"([^"]+)"', entry)
            thumb_m = re.search(r'thumbnail:\s*"([^"]*)"', entry)
            name = name_m.group(1) if name_m else "Unknown facility"

            if not thumb_m or not thumb_m.group(1):
                if 'No birth centers' in name or 'No hospitals' in name:
                    continue  # Allow empty thumbnails for placeholder entries
                issues.append(f"{name}: no thumbnail field")
                continue

            thumb_path = thumb_m.group(1)
            full_path = os.path.join(PROJECT_DIR, 'public', thumb_path.lstrip('/'))

            if not os.path.exists(full_path):
                issues.append(f"{name}: file not found: {thumb_path}")
                continue

            try:
                img = Image.open(full_path)
                w, h = img.size
                if w == h:
                    issues.append(f"{name}: square image ({w}x{h}) — may be logo, not building photo")
                elif w < 400 or h < 300:
                    issues.append(f"{name}: too small ({w}x{h})")
            except Exception:
                issues.append(f"{name}: could not decode image")

    if issues:
        return {"pass": False, "detail": " | ".join(issues[:6])}
    return {"pass": True, "detail": "All facility images are landscape, >=400x300"}


def check_provider_descriptions(slug: str) -> dict:
    """Check that provider descriptions are specific, not generic boilerplate."""
    block = _read_city_block(slug)
    if block is None:
        return {"pass": True, "detail": f"City {slug} not found — skipping"}

    ld_idx = block.find('localDoulas:')
    if ld_idx == -1:
        return {"pass": True, "detail": "No localDoulas section found"}

    arr_start = block.find('[', ld_idx)
    if arr_start == -1:
        return {"pass": True, "detail": "localDoulas array not found"}

    # Extract array
    depth = 0
    in_str = False
    arr_end = None
    for i, ch in enumerate(block[arr_start:], arr_start):
        if ch == '"' and (i == 0 or block[i - 1] != '\\'):
            in_str = not in_str
        if not in_str:
            if ch == '[':
                depth += 1
            elif ch == ']':
                depth -= 1
                if depth == 0:
                    arr_end = i + 1
                    break
    if arr_end is None:
        return {"pass": True, "detail": "Could not extract array bounds"}
    arr_text = block[arr_start:arr_end]

    entries = _extract_entries(arr_text)

    generic_patterns = [
        r'serving families in the',
        r'Professional doula serving',
        r'provides compassionate',
        r'offering personalized care',
        r'Contact for availability',
    ]

    issues = []
    for entry in entries:
        name_m = re.search(r'name:\s*"([^"]+)"', entry)
        desc_m = re.search(r'description:\s*"([^"]*)"', entry)
        if not name_m or not desc_m:
            continue
        name = name_m.group(1)
        desc = desc_m.group(1)
        for pat in generic_patterns:
            if re.search(pat, desc, re.IGNORECASE):
                issues.append(f"{name}: generic description")
                break

    if issues:
        return {"pass": False, "detail": f"{len(issues)} generic description(s): {'; '.join(issues[:5])}"}
    return {"pass": True, "detail": f"All {len(entries)} providers have specific descriptions"}


def check_service_area(slug: str) -> dict:
    """Check that all serviceArea fields are string arrays, not plain strings."""
    block = _read_city_block(slug)
    if block is None:
        return {"pass": True, "detail": f"City {slug} not found — skipping"}

    ld_idx = block.find('localDoulas:')
    if ld_idx == -1:
        return {"pass": True, "detail": "No localDoulas section found"}

    arr_start = block.find('[', ld_idx)
    if arr_start == -1:
        return {"pass": True, "detail": "localDoulas array not found"}

    depth = 0
    in_str = False
    arr_end = None
    for i, ch in enumerate(block[arr_start:], arr_start):
        if ch == '"' and (i == 0 or block[i - 1] != '\\'):
            in_str = not in_str
        if not in_str:
            if ch == '[':
                depth += 1
            elif ch == ']':
                depth -= 1
                if depth == 0:
                    arr_end = i + 1
                    break
    if arr_end is None:
        return {"pass": True, "detail": "Could not extract array bounds"}
    arr_text = block[arr_start:arr_end]

    entries = _extract_entries(arr_text)

    issues = []
    for entry in entries:
        name_m = re.search(r'name:\s*"([^"]+)"', entry)
        sa_m = re.search(r'serviceArea:\s*(\S+)', entry)
        if not name_m or not sa_m:
            continue
        name = name_m.group(1)
        val = sa_m.group(1)
        # Valid array starts with [. A plain string starts with "
        if not val.startswith('[') and val.startswith('"'):
            issues.append(f"{name}: serviceArea is a string, not array")

    if issues:
        return {"pass": False, "detail": f"{len(issues)} provider(s) have string serviceArea: {'; '.join(issues[:5])}. Wrap in [...]"}
    return {"pass": True, "detail": "All serviceArea fields are string arrays"}


def yt_thumbnail_matches_hero(slug: str) -> dict:
    """Check that the YouTube branded thumbnail uses the same hero image as the page."""
    try:
        from PIL import Image
    except ImportError:
        return {"pass": True, "detail": "PIL not available — skipping YT thumbnail check"}

    # Find hero image from city data first, then fall back to filename patterns.
    block = _read_city_block(slug)
    hero_path = None
    hero_name = None
    if block:
        m = re.search(r'heroImage:\s*["\']([^"\']+)["\']', block)
        if m:
            hero_ref = m.group(1)
            if hero_ref.startswith('http'):
                hero_ref = '/images/' + hero_ref.rstrip('/').split('/')[-1]
            candidate = os.path.join(PROJECT_DIR, hero_ref.lstrip('/'))
            if os.path.exists(candidate):
                hero_path = candidate
                hero_name = os.path.basename(candidate)

    def variant_key(name: str) -> int:
        m = re.search(r'-v(\d+)', name)
        return int(m.group(1)) if m else 0

    if hero_path is None:
        hero_pattern = re.compile(rf'^{re.escape(slug)}-birth-doula-hero(-v\d+)?\.webp$')
        hero_files = [f for f in os.listdir(PUBLIC_IMAGES) if hero_pattern.match(f)]
        if not hero_files:
            broad_pattern = re.compile(rf'^{re.escape(slug)}-birth-doula(?:-[a-z]+)?(-v\d+)?\.webp$')
            hero_files = [f for f in os.listdir(PUBLIC_IMAGES) if broad_pattern.match(f) and 'support' not in f.lower() and '-600' not in f]
        if not hero_files:
            return {"pass": True, "detail": "No hero image found — skipping YT thumbnail comparison"}
        # Prefer -hero over -skyline when both exist (same variant level)
        def hero_sort_key(name: str) -> tuple:
            v = variant_key(name)
            # -hero files sort before -skyline files at the same variant level
            priority = 0 if '-hero' in name else 1
            return (v, priority)
        hero_files.sort(key=hero_sort_key, reverse=True)
        hero_path = os.path.join(PUBLIC_IMAGES, hero_files[0])

    # Find YT thumbnail
    yt_pattern = re.compile(rf'^yt-thumbnail-{re.escape(slug)}(-v\d+)?\.(webp|jpg|png)$')
    yt_files = [f for f in os.listdir(PUBLIC_IMAGES) if yt_pattern.match(f)]
    if not yt_files:
        # Also check yt-thumb- prefix (older naming convention)
        yt_pattern2 = re.compile(rf'^yt-thumb-{re.escape(slug)}(-v\d+)?\.(webp|jpg|png)$')
        yt_files = [f for f in os.listdir(PUBLIC_IMAGES) if yt_pattern2.match(f)]
    if not yt_files:
        return {"pass": True, "detail": "No branded YT thumbnail found — skipping comparison"}

    yt_files.sort(key=variant_key, reverse=True)
    yt_path = os.path.join(PUBLIC_IMAGES, yt_files[0])

    try:
        hero_img = Image.open(hero_path).convert('RGB')
        yt_img = Image.open(yt_path).convert('RGB')

        # The thumbnail renders the hero with CSS object-fit: cover into 16:9.
        # Recreate that crop before comparison; resizing the whole 3:2 hero to
        # 16:9 distorts/crops differently and creates false failures.
        hw, hh = hero_img.size
        target_ratio = 16 / 9
        current_ratio = hw / hh
        if current_ratio > target_ratio:
            new_w = int(hh * target_ratio)
            left = (hw - new_w) // 2
            hero_img = hero_img.crop((left, 0, left + new_w, hh))
        elif current_ratio < target_ratio:
            new_h = int(hw / target_ratio)
            top = (hh - new_h) // 2
            hero_img = hero_img.crop((0, top, hw, top + new_h))

        hero_resized = hero_img.resize(yt_img.size, Image.LANCZOS)
        yw, yh = yt_img.size

        # Compare a mostly unobstructed right-side window/background region.
        # Avoid left text overlays, bottom brand/play controls, and top badge.
        hero_region = hero_resized.crop((int(yw * 0.58), int(yh * 0.12), int(yw * 0.92), int(yh * 0.48)))
        yt_region = yt_img.crop((int(yw * 0.58), int(yh * 0.12), int(yw * 0.92), int(yh * 0.48)))

        hero_pixels = list(hero_region.getdata())
        yt_pixels = list(yt_region.getdata())

        diff_sum = sum(
            abs(r1 - r2) + abs(g1 - g2) + abs(b1 - b2)
            for (r1, g1, b1), (r2, g2, b2) in zip(hero_pixels, yt_pixels)
        )
        avg_diff = diff_sum / len(hero_pixels)

        # Threshold: avg_diff > 80 means significantly different images
        # Same image with text overlay typically has avg_diff < 60
        # Different image (different background) typically has avg_diff > 100
        if avg_diff > 80:
            return {"pass": False, "detail": f"YT thumbnail uses a DIFFERENT image than hero (avg pixel diff={avg_diff:.1f}). YT thumbnail must use the same hero silhouette."}

        return {"pass": True, "detail": f"YT thumbnail matches hero image (avg pixel diff={avg_diff:.1f})"}
    except Exception as e:
        return {"pass": True, "detail": f"Could not compare images: {e}"}


def support_scene_quality(slug: str) -> dict:
    """Check support scene image quality: no duplicate of another city's scene."""
    try:
        from PIL import Image
    except ImportError:
        return {"pass": True, "detail": "PIL not available — skipping support scene check"}

    block = _read_city_block(slug)
    if block is None:
        return {"pass": True, "detail": f"City {slug} not found — skipping"}

    # Find supportSceneImage
    ssi_m = re.search(r'supportSceneImage:\s*"([^"]+)"', block)
    if not ssi_m:
        return {"pass": True, "detail": "No supportSceneImage field found — skipping"}

    scene_path = ssi_m.group(1)
    full_path = os.path.join(PROJECT_DIR, 'public', scene_path.lstrip('/'))
    if not os.path.exists(full_path):
        return {"pass": True, "detail": f"Support scene file not found: {scene_path}"}

    # Check: Is this file a duplicate of another city's support scene?
    with open(full_path, 'rb') as f:
        file_hash = hashlib.md5(f.read()).hexdigest()

    other_scenes = []
    for fname in os.listdir(PUBLIC_IMAGES):
        if 'support-scene' in fname and fname != os.path.basename(scene_path):
            other_path = os.path.join(PUBLIC_IMAGES, fname)
            if os.path.isfile(other_path):
                with open(other_path, 'rb') as f:
                    if hashlib.md5(f.read()).hexdigest() == file_hash:
                        other_scenes.append(fname)

    if other_scenes:
        return {"pass": False, "detail": f"Support scene is IDENTICAL to another city's: {', '.join(other_scenes[:3])}. Each city must have a unique support scene."}

    return {"pass": True, "detail": "Support scene is unique to this city"}


def hero_aspect(slug: str):
    """G25: Check hero image is 3:2 aspect ratio (not 16:9)."""
    block = _read_city_block(slug)
    if block is None:
        return {"pass": False, "detail": f"Could not read city block for {slug}"}

    m = re.search(r'heroImage:\s*"([^"]+)"', block)
    if not m:
        return {"pass": False, "detail": "No heroImage field found"}

    hero_path = m.group(1).lstrip('/')
    full_path = os.path.join(PROJECT_DIR, 'public', hero_path)
    if not os.path.exists(full_path):
        return {"pass": False, "detail": f"Hero image not found: {hero_path}"}

    try:
        from PIL import Image
        img = Image.open(full_path)
        w, h = img.size
        ratio = w / h
        # 3:2 = 1.5, allow ±0.05 tolerance
        if 1.45 <= ratio <= 1.55:
            return {"pass": True, "detail": f"Hero image is 3:2 ({w}x{h}, ratio={ratio:.2f})"}
        else:
            return {"pass": False, "detail": f"Hero image is {ratio:.2f}:1 ({w}x{h}) — expected 3:2 (1.5). Regenerate at 1200x800."}
    except Exception as e:
        return {"pass": False, "detail": f"Could not analyze hero image: {e}"}


def support_aspect(slug: str):
    """G26: Check support scene image is 16:9 aspect ratio."""
    block = _read_city_block(slug)
    if block is None:
        return {"pass": False, "detail": f"Could not read city block for {slug}"}

    m = re.search(r'supportSceneImage:\s*"([^"]+)"', block)
    if not m:
        return {"pass": False, "detail": "No supportSceneImage field found"}

    img_path = m.group(1).lstrip('/')
    full_path = os.path.join(PROJECT_DIR, 'public', img_path)
    if not os.path.exists(full_path):
        return {"pass": False, "detail": f"Support scene image not found: {img_path}"}

    try:
        from PIL import Image
        img = Image.open(full_path)
        w, h = img.size
        ratio = w / h
        # 16:9 = 1.778, allow ±0.05 tolerance
        if 1.72 <= ratio <= 1.83:
            return {"pass": True, "detail": f"Support scene is 16:9 ({w}x{h}, ratio={ratio:.2f})"}
        else:
            return {"pass": False, "detail": f"Support scene is {ratio:.2f}:1 ({w}x{h}) — expected 16:9 (1.78). Regenerate at 1024x576."}
    except Exception as e:
        return {"pass": False, "detail": f"Could not analyze support scene: {e}"}


def check_provider_credentials(slug: str):
    """G27: Check provider credentials are specific (not generic 'Birth Doula')."""
    block = _read_city_block(slug)
    if block is None:
        return {"pass": False, "detail": f"Could not read city block for {slug}"}

    # Find localDoulas array using brace-depth tracking
    ld_start = block.find('localDoulas: [')
    if ld_start < 0:
        return {"pass": False, "detail": "No localDoulas section found"}

    depth = 0
    i = ld_start
    while i < len(block):
        if block[i] == '[':
            depth += 1
        elif block[i] == ']':
            depth -= 1
            if depth == 0:
                break
        i += 1

    ld_section = block[ld_start:i+1]
    credentials = re.findall(r'credential:\s*"([^"]+)"', ld_section)

    if not credentials:
        return {"pass": False, "detail": "No provider credentials found"}

    generic_creds = ['Birth Doula', 'Postpartum Doula', 'Doula']
    bad_creds = [c for c in credentials if c.strip() in generic_creds]

    if bad_creds:
        return {"pass": False, "detail": f"{len(bad_creds)} provider(s) have generic credentials: {', '.join(bad_creds)}. Replace with specific certifications (e.g. CD(DONA), CAPPA, etc.)."}

    return {"pass": True, "detail": f"All {len(credentials)} providers have specific credentials"}


def main():
    if len(sys.argv) < 3:
        print(json.dumps({"pass": False, "detail": "Usage: preflight-image-helper.py <check> <slug>"}))
        sys.exit(1)

    command = sys.argv[1]
    slug = sys.argv[2]

    checks = {
        'hero-silhouette': hero_silhouette,
        'hospital-dimensions': hospital_dimensions,
        'provider-descriptions': check_provider_descriptions,
        'service-area': check_service_area,
        'yt-thumbnail-matches-hero': yt_thumbnail_matches_hero,
        'support-scene-quality': support_scene_quality,
        'hero-aspect': hero_aspect,
        'support-aspect': support_aspect,
        'provider-credentials': check_provider_credentials,
    }

    fn = checks.get(command)
    if fn is None:
        result = {"pass": False, "detail": f"Unknown check: {command}"}
    else:
        result = fn(slug)

    print(json.dumps(result))
    sys.exit(0 if result["pass"] else 1)


if __name__ == '__main__':
    main()
