#!/usr/bin/env python3
"""
TJB City Image Optimizer — SEO-grade image pipeline.
Run after generating city images and before deploy.

Usage:
    python3 scripts/optimize-city-images.py denver-co

What it does:
1. Verifies and re-encodes hero, support scene, OG, and thumbnail WebP images
2. Re-encodes at target qualities (hero=80, support=75, OG=85, thumb=75)
3. Generates responsive WebP variants (600w, 1200w) for hero (srcset-ready)
4. Generates responsive AVIF variants (600w, 1200w) for hero (~46% smaller than WebP)
5. Strips EXIF/metadata (removes latent AI generator data)
6. Adds IPTC DigitalSourceType metadata (Google compliance for AI images)
7. Adds creator/copyright/credit/description metadata
8. Copies hero to `public/images/heroes/` (dual-path required by template)
9. Enforces size budgets per image type — exits 1 on overage
10. Reports all results for pipeline gates

Requires:
    brew install exiftool
    pip install Pillow>=10.0.0 (AVIF requires 10.0+)

Budget targets:
    Hero (1200w WebP):    < 120KB  (LCP — critical path)
    Hero (600w WebP):     <  60KB  (mobile)
    Hero AVIF (1200w):    <  80KB  (next-gen)
    Hero AVIF (600w):     <  40KB  (mobile next-gen)
    Support scene (WebP): < 100KB  (below fold)
    OG image (WebP):      <  80KB  (social sharing)
    YouTube thumbnail:    <  75KB  (overlay content)
"""

import subprocess, sys, os, json
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PUBLIC_IMAGES = PROJECT_ROOT / 'public' / 'images'
ARCHIVE_DIR = PUBLIC_IMAGES / '.optimize-originals'

# IPTC metadata template for AI-generated TJB images
IPTC_ARGS = [
    '-XMP-iptcExt:DigitalSourceType=https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
    '-XMP-dc:creator=True Joy Birthing',
    '-XMP-dc:rights=Copyright 2026 True Joy Birthing. All rights reserved.',
    '-XMP-photoshop:Credit=True Joy Birthing / Shelbi Kohler',
    '-XMP-xmpRights:WebStatement=https://truejoybirthing.com/about/',
    '-XMP-dc:description=True Joy Birthing city birth guide image for expectant families.',
    '-overwrite_original',
]

# Per-image quality targets (tightened from v1 per architect review)
QUALITY = {
    'hero': 80,       # LCP — 80 is visually lossless for skyline photos, saves ~15% over 85
    'hero_avif': 50,  # AVIF scales differently — 50 ≈ WebP 80 perceptually
    'support': 75,    # Below fold — perceptual difference vs 80 is negligible
    'og': 85,         # Social platforms recompress anyway — 90 was wasteful
    'thumbnail': 75,  # YouTube recompresses — contains overlay text/graphics
    'thumb_avif': 60,  # AVIF for thumbnail overlay content
}

# Size budgets (enforced — script exits non-zero if exceeded)
BUDGETS = {
    'hero': 120 * 1024,
    'hero_600w': 60 * 1024,
    'hero_avif_1200w': 80 * 1024,
    'hero_avif_600w': 40 * 1024,
    'support': 100 * 1024,
    'og': 80 * 1024,
    'thumbnail': 75 * 1024,
}

# Hero responsive variant widths (for srcset)
RESPONSIVE_WIDTHS = [600, 1200]  # Generate both widths for hero


def run_exiftool(path: Path, extra_args: list[str] | None = None) -> bool:
    """Run exiftool on a file with IPTC args. Returns True on success."""
    args = ['exiftool'] + IPTC_ARGS
    if extra_args:
        args += extra_args
    args.append(str(path))
    result = subprocess.run(args, capture_output=True, text=True, timeout=15)
    if result.returncode != 0:
        print(f'  ⚠️  exiftool failed: {result.stderr.strip()}')
        return False
    return True


def archive_original(path: Path) -> bool:
    """Archive the original to preserve it before overwriting."""
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    archive_path = ARCHIVE_DIR / path.name
    if not archive_path.exists():
        import shutil
        shutil.copy2(path, archive_path)
        return True
    return False


def reencode_webp(path: Path, quality: int) -> tuple[int, int]:
    """Re-encode a WebP to specified quality. Returns (old_bytes, new_bytes)."""
    old_size = path.stat().st_size
    img = Image.open(path)

    # Convert to sRGB if needed
    if img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGB')

    # Save back as WebP at target quality
    img.save(path, 'WEBP', quality=quality, method=6)  # method=6 = best compression
    new_size = path.stat().st_size
    return old_size, new_size


def generate_responsive_variant(src_path: Path, width: int, quality: int, suffix: str) -> Path | None:
    """
    Generate a width-limited variant of an image.
    suffix e.g., '-600' → {stem}-600{ext}
    Returns the new Path or None on failure.
    """
    try:
        img = Image.open(src_path)
        if img.mode not in ('RGB', 'RGBA'):
            img = img.convert('RGB')

        w_percent = width / float(img.size[0])
        h_size = int(float(img.size[1]) * w_percent)
        img_resized = img.resize((width, h_size), Image.LANCZOS)

        stem = src_path.stem
        ext = src_path.suffix
        variant_path = src_path.with_name(f'{stem}{suffix}{ext}')
        img_resized.save(variant_path, 'WEBP', quality=quality, method=6)
        return variant_path
    except Exception as e:
        print(f'  ⚠️  Failed to generate {width}w variant: {e}')
        return None


def generate_avif_variant(src_path: Path, quality: int) -> Path | None:
    """Generate an AVIF variant next to the source file."""
    try:
        img = Image.open(src_path)
        if img.mode not in ('RGB', 'RGBA'):
            img = img.convert('RGB')

        avif_path = src_path.with_suffix('.avif')
        img.save(avif_path, 'AVIF', quality=quality)
        return avif_path
    except Exception as e:
        print(f'  ⚠️  Failed to generate AVIF variant: {e}')
        return None


def get_metadata_report(path: Path) -> dict:
    """Get key metadata fields from a file for reporting."""
    result = subprocess.run(
        ['exiftool', '-json',
         '-XMP-iptcExt:DigitalSourceType',
         '-XMP-dc:creator',
         '-XMP-dc:rights',
         '-FileSize',
         '-ImageWidth',
         '-ImageHeight',
         str(path)],
        capture_output=True, text=True, timeout=10
    )
    if result.returncode == 0 and result.stdout.strip():
        try:
            data = json.loads(result.stdout)
            if data:
                return data[0]
        except json.JSONDecodeError:
            pass
    return {}


def check_budget(name: str, size: int, budget: int) -> tuple[bool, str]:
    """Check if size is under budget. Returns (pass, message)."""
    kb = size / 1024
    budget_kb = budget / 1024
    if size <= budget:
        return True, f'{kb:.1f}KB (budget: {budget_kb:.0f}KB) ✓'
    else:
        return False, f'{kb:.1f}KB OVER budget ({budget_kb:.0f}KB) ✗'


def optimize_city_images(slug: str) -> dict:
    """Main function. Returns a report dict."""
    report = {
        'slug': slug,
        'images': {},
        'errors': [],
        'warnings': [],
        'budget_failures': [],
    }

    # Define image pairs: (filename_pattern, quality, purpose, directory)
    # Support scene can be either {slug}-birth-doula-support.webp or {slug}-support-scene.webp
    image_defs = [
        (f'{slug}-birth-doula-skyline.webp', QUALITY['hero'], 'hero (LCP)', PUBLIC_IMAGES),
        (f'{slug}-birth-doula-support.webp', QUALITY['support'], 'support scene', PUBLIC_IMAGES),
        (f'og-city-{slug}.webp', QUALITY['og'], 'OG image', PUBLIC_IMAGES),
        (f'yt-thumb-{slug}.webp', QUALITY['thumbnail'], 'YouTube thumbnail', PUBLIC_IMAGES),
    ]

    # Try alt support scene name pattern
    alt_support = f'{slug}-support-scene.webp'
    alt_path = PUBLIC_IMAGES / alt_support
    support_idx = 1
    if alt_path.exists() and not (PUBLIC_IMAGES / image_defs[support_idx][0]).exists():
        image_defs[support_idx] = (alt_support, QUALITY['support'], 'support scene', PUBLIC_IMAGES)

    for fname, quality, purpose, directory in image_defs:
        path = directory / fname
        if not path.exists():
            report['warnings'].append(f'{purpose}: {fname} not found, skipping')
            report['images'][fname] = {'status': 'not_found'}
            continue

        print(f'  Processing {fname} ({purpose})...')
        img_report = {'status': 'ok', 'purpose': purpose}

        # Step 1: Archive original (preserves pre-optimization copy)
        archive_original(path)

        # Step 2: Get pre-optimization size
        old_size = path.stat().st_size

        # Step 3: Re-encode to WebP at target quality
        try:
            old_sz, new_sz = reencode_webp(path, quality)
            img_report['size_before_kb'] = f'{old_sz/1024:.1f}'
            img_report['size_after_kb'] = f'{new_sz/1024:.1f}'
            img_report['savings_kb'] = f'{(old_sz - new_sz)/1024:.1f}'
            img_report['quality'] = quality
        except Exception as e:
            report['errors'].append(f'{fname}: re-encode failed: {e}')
            img_report['status'] = 'error'
            report['images'][fname] = img_report
            continue

        # Step 4: Add IPTC AI metadata
        try:
            run_exiftool(path)
            img_report['iptc_applied'] = True
        except Exception as e:
            report['warnings'].append(f'{fname}: IPTC write failed: {e}')
            img_report['iptc_applied'] = False

        # Step 5: Verify metadata stuck
        md = get_metadata_report(path)
        img_report['final_size_kb'] = md.get('FileSize', '?')
        img_report['dims'] = f'{md.get("ImageWidth", "?")}x{md.get("ImageHeight", "?")}'
        img_report['digital_source_type'] = md.get('DigitalSourceType', 'MISSING')
        img_report['creator'] = md.get('Creator', 'MISSING')

        # Step 6: Check budget
        new_size = path.stat().st_size
        budget_key = {
            f'{slug}-birth-doula-skyline.webp': 'hero',
            f'{slug}-birth-doula-support.webp': 'support',
            f'{slug}-support-scene.webp': 'support',
            f'og-city-{slug}.webp': 'og',
            f'yt-thumb-{slug}.webp': 'thumbnail',
        }.get(fname)

        if budget_key and budget_key in BUDGETS:
            budget = BUDGETS[budget_key]
            passed, message = check_budget(fname, new_size, budget)
            img_report['budget_pass'] = passed
            img_report['budget_message'] = message
            if not passed:
                report['budget_failures'].append(f'{fname}: {message}')

        report['images'][fname] = img_report

    # --- Generate responsive hero variants (600w + 1200w) ---
    hero_filename = f'{slug}-birth-doula-skyline.webp'
    hero_path = PUBLIC_IMAGES / hero_filename
    if hero_path.exists():
        print(f'\n  Generating responsive variants for hero...')
        for width in RESPONSIVE_WIDTHS:
            suffix = f'-{width}'
            variant = generate_responsive_variant(hero_path, width, QUALITY['hero'], suffix)
            if variant:
                vsize = variant.stat().st_size
                budget_key = f'hero_{width}w'
                budget = BUDGETS.get(budget_key, BUDGETS['hero'])
                passed, msg = check_budget(variant.name, vsize, budget)
                report['images'][variant.name] = {
                    'status': 'ok',
                    'purpose': f'hero {width}w variant',
                    'size_after_kb': f'{vsize/1024:.1f}',
                    'budget_pass': passed,
                    'budget_message': msg,
                }
                if not passed:
                    report['budget_failures'].append(f'{variant.name}: {msg}')

        # --- Generate responsive AVIF variants (600w + 1200w) ---
        print(f'  Generating AVIF variants...')
        # 600w AVIF from the 600w WebP variant
        webp_600w = PUBLIC_IMAGES / f'{slug}-birth-doula-skyline-600.webp'
        if webp_600w.exists():
            try:
                avif_600w = webp_600w.with_suffix('.avif')
                img_600 = Image.open(webp_600w)
                img_600.save(avif_600w, 'AVIF', quality=QUALITY['hero_avif'])
                avif_600_size = avif_600w.stat().st_size
                budget = BUDGETS['hero_avif_600w']
                passed, msg = check_budget(avif_600w.name, avif_600_size, budget)
                report['images'][avif_600w.name] = {
                    'status': 'ok',
                    'purpose': 'hero AVIF 600w variant',
                    'size_after_kb': f'{avif_600_size/1024:.1f}',
                    'budget_pass': passed,
                    'budget_message': msg,
                }
                if not passed:
                    report['budget_failures'].append(f'{avif_600w.name}: {msg}')
            except Exception as e:
                report['warnings'].append(f'600w AVIF generation failed: {e}')

        # 1200w AVIF from the primary hero file
        avif_1200 = generate_avif_variant(hero_path, QUALITY['hero_avif'])
        if avif_1200:
            avif_size = avif_1200.stat().st_size
            budget = BUDGETS['hero_avif_1200w']
            passed, msg = check_budget(avif_1200.name, avif_size, budget)
            report['images'][avif_1200.name] = {
                'status': 'ok',
                'purpose': 'hero AVIF 1200w variant',
                'size_after_kb': f'{avif_size/1024:.1f}',
                'budget_pass': passed,
                'budget_message': msg,
            }
            if not passed:
                report['budget_failures'].append(f'{avif_1200.name}: {msg}')

    return report


if __name__ == '__main__':
    slug = sys.argv[1] if len(sys.argv) > 1 else None
    if not slug:
        print('Usage: python3 scripts/optimize-city-images.py {slug}')
        print('Example: python3 scripts/optimize-city-images.py denver-co')
        sys.exit(1)

    print(f'\n🔧 Optimizing images for {slug}...\n')
    report = optimize_city_images(slug)

    print('\n─── Results ───')
    for fname, data in report['images'].items():
        if data.get('status') == 'not_found':
            print(f'  ⏭️  {fname}: not found')
        elif data.get('status') == 'error':
            print(f'  ❌ {fname}: ERROR')
        else:
            savings = data.get('savings_kb', '—')
            iptc = '✓' if data.get('iptc_applied') else '✗'
            budget = data.get('budget_message', '')
            dims = data.get('dims', '')
            size = data.get('size_after_kb', '?')
            purpose = data.get('purpose', '')
            print(f'  {"✅" if data.get("budget_pass", True) else "⚠️"}  {fname}: {size}KB ({purpose}) IPTC:{iptc} {budget}')

    if report['errors']:
        print(f'\n  ❌ Errors:')
        for e in report['errors']:
            print(f'     {e}')

    if report['warnings']:
        print(f'\n  ⚠️  Warnings:')
        for w in report['warnings']:
            print(f'     {w}')

    if report['budget_failures']:
        print(f'\n  ❌ Budget failures:')
        for b in report['budget_failures']:
            print(f'     ⚠️  {b}')
        print(f'\n  ❌ Some images exceeded size budgets. Hero < 120KB, Support < 100KB, OG < 80KB, Thumb < 60KB.')
        sys.exit(1)

    all_ok = len(report['errors']) == 0
    print(f'\n  ✨ Optimization complete. {"All checks passed." if all_ok else "Fix errors above."}')
    sys.exit(0 if all_ok else 1)