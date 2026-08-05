#!/usr/bin/env python3
"""
TJB Image Cropping Utility — CROP ONLY, NEVER RESIZE WITH INDEPENDENT DIMENSIONS.

R41/M46 enforcement: When converting an image from one aspect ratio to another,
ALWAYS crop (remove pixels) and then uniformly scale. NEVER set width and height
independently — that stretches/squishes the content.

Usage:
  python3 scripts/crop-image.py <input> <output> <target_w> <target_h> [--quality 85]

This tool:
1. Opens the source image
2. Crops from center to the target aspect ratio (removing excess pixels)
3. Uniformly scales to the exact target dimensions (maintaining proportions)
4. Saves as the output format (detected from extension)
"""
import sys
import os
from PIL import Image

def crop_to_aspect(img, target_w, target_h):
    """Crop from center to target aspect ratio, then uniformly scale."""
    target_aspect = target_w / target_h
    w, h = img.size
    current_aspect = w / h

    if current_aspect > target_aspect:
        # Image is wider than target — crop width from center
        new_w = int(h * target_aspect)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    elif current_aspect < target_aspect:
        # Image is taller than target — crop height from center
        new_h = int(w / target_aspect)
        top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))
    # else: already correct aspect ratio

    # Uniform scale to exact target dimensions
    img = img.resize((target_w, target_h), Image.LANCZOS)
    return img

def main():
    if len(sys.argv) < 5:
        print("Usage: crop-image.py <input> <output> <target_w> <target_h> [--quality N]")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]
    target_w = int(sys.argv[3])
    target_h = int(sys.argv[4])
    quality = 85

    if '--quality' in sys.argv:
        idx = sys.argv.index('--quality')
        quality = int(sys.argv[idx + 1])

    if not os.path.exists(input_path):
        print(f"ERROR: Input file not found: {input_path}")
        sys.exit(1)

    img = Image.open(input_path)
    original_size = img.size
    original_aspect = original_size[0] / original_size[1]

    # Check if we're about to distort
    target_aspect = target_w / target_h
    if abs(original_aspect - target_aspect) > 0.01:
        print(f"  Source: {original_size} (aspect {original_aspect:.3f})")
        print(f"  Target: {target_w}x{target_h} (aspect {target_aspect:.3f})")
        print(f"  Action: CROP from center (not resize) to prevent distortion")

    img = crop_to_aspect(img, target_w, target_h)

    # Determine format from extension
    ext = os.path.splitext(output_path)[1].lower()
    fmt = {
        '.webp': 'WEBP',
        '.png': 'PNG',
        '.jpg': 'JPEG',
        '.jpeg': 'JPEG',
    }.get(ext, 'WEBP')

    img.save(output_path, format=fmt, quality=quality)
    file_size = os.path.getsize(output_path)

    print(f"  Output: {img.size} (aspect {img.size[0]/img.size[1]:.3f})")
    print(f"  File: {output_path} ({file_size} bytes)")
    print(f"  ✅ Cropped, not distorted — R41/M46 compliant")

if __name__ == '__main__':
    main()