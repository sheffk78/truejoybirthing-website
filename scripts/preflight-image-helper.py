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


def _read_city_block(slug: str) -> str | None:
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

    # Find next top-level entry (pattern: line starting with 2 spaces, quoted string, colon, brace)
    remainder = text[match.end():]
    next_entry = re.search(r'\n  "[a-z][^"]*":\s*\{', remainder)
    if next_entry:
        block_end = match.end() + next_entry.start()
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

    # Match hero files specifically
    pattern = re.compile(rf'^{re.escape(slug)}-birth-doula-hero(-v\d+)?\.webp$')
    files = [f for f in os.listdir(PUBLIC_IMAGES) if pattern.match(f)]
    if not files:
        # Fallback: broader pattern excluding support scenes
        broad_pattern = re.compile(rf'^{re.escape(slug)}-birth-doula(-v\d+)?\.webp$')
        files = [f for f in os.listdir(PUBLIC_IMAGES) if broad_pattern.match(f) and 'support' not in f.lower()]

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

        if center < top and (top - center) > 0.5:
            return {"pass": True, "detail": f"Silhouette confirmed (center={center:.1f} < top={top:.1f})"}
        else:
            return {"pass": False, "detail": f"No silhouette detected (center={center:.1f}, top={top:.1f}) — may be skyline"}
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

    # Find hero image
    hero_pattern = re.compile(rf'^{re.escape(slug)}-birth-doula-hero(-v\d+)?\.webp$')
    hero_files = [f for f in os.listdir(PUBLIC_IMAGES) if hero_pattern.match(f)]
    if not hero_files:
        return {"pass": True, "detail": "No hero image found — skipping YT thumbnail comparison"}

    def variant_key(name: str) -> int:
        m = re.search(r'-v(\d+)', name)
        return int(m.group(1)) if m else 0

    hero_files.sort(key=variant_key, reverse=True)
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

        hw, hh = hero_img.size
        yw, yh = yt_img.size

        # Resize YT thumbnail to match hero dimensions
        yt_resized = yt_img.resize((hw, hh), Image.LANCZOS)

        # Compare the top-right quadrant — this area has minimal overlay
        # (the gradient is on the left, text box is top-left, play button is bottom-right)
        # Top-right: from center to 90% width, top 10% to 40% height
        hero_region = hero_img.crop((hw // 2, hh // 10, int(hw * 0.9), int(hh * 0.4)))
        yt_region = yt_resized.crop((hw // 2, hh // 10, int(hw * 0.9), int(hh * 0.4)))

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
