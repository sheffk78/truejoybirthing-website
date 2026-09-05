#!/usr/bin/env python3
"""Visual Verification Enforcement Gate — TJB city images (2026-09-05).

POSTMORTEM (Rockville-md hero, Sept 2026):
A hero with a phantom arm segment + fused fingers shipped through 4 pipeline
stages. Root causes:
  1. Structural gates (G8 colors, G25 aspect, G65 letterbox) cannot see anatomy.
  2. The "mandatory visual verification" in the visual-system skill was
     ad-hoc: a full-frame vision_analyze scored the broken figure
     "anatomically correct, no defects". Pixel heuristics (interior variance,
     outline discontinuity, ridge analysis) were ALSO tested and produce
     IDENTICAL numbers for broken vs clean silhouettes — they are not viable.
  3. Nothing enforced that a zoomed vision pass ran at all before deploy.

WHAT ACTUALLY CATCHES THESE DEFECTS (verified on the Rockville pair):
  A zoomed (2x) vision_analyze pass on the ISOLATED figure, with
  defect-specific questions (limb count, finger state, belly position).
  Full-frame vision passes are agreeable and unreliable for anatomy.

THIS GATE, therefore, is enforcement — not detection:
  1. Isolate human figure(s) per image (luminance blob detection).
  2. Emit a 2x zoom crop of every figure to /tmp/tjb-vision-crops/.
  3. REQUIRE artifacts/gates/vision/{slug}.json with a pass verdict per
     crop, produced AFTER vision_analyze on each emitted crop.
  4. Fail closed: no verdict file, missing crops, or any fail verdict
     => exit 1. verify_deploy / deploy run this before shipping.

Full-frame + zoom vision passes that found the Rockville defects:
  full-frame: "anatomically correct" (FALSE NEGATIVE)
  2x figure crop: "three arm segments visible... fingers merged" (TRUE POSITIVE)

USAGE
  python3 scripts/visual-verify-gate.py <slug>            # hero+support+og+thumb
  python3 scripts/visual-verify-gate.py <slug> --hero-only

EXIT CODES
  0 = vision verdict file present, all crops verified pass
  1 = missing verdict file / crops, or fail verdicts
  2 = infra (images missing/unreadable)
"""
import json
import os
import sys
from datetime import datetime, timezone

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

IMAGES = "public/images"
CROP_DIR = "/tmp/tjb-vision-crops"
VERDICT_DIR = "artifacts/gates/vision"


def load_rgb(path):
    if not os.path.exists(path):
        return None
    try:
        return Image.open(path).convert("RGB")
    except Exception:
        return None


def cities_ts_block(slug):
    """Extract the city block source from cities.ts (block regex, not indexOf)."""
    ts_path = os.path.join(ROOT, "src", "data", "cities.ts")
    import re
    with open(ts_path) as f:
        src = f.read()
    m = re.search(r'"%s"\s*:\s*\{' % re.escape(slug), src)
    if not m:
        return None
    # naive brace match from the block start
    depth, i = 0, m.end() - 1
    while i < len(src):
        if src[i] == '{':
            depth += 1
        elif src[i] == '}':
            depth -= 1
            if depth == 0:
                return src[m.start():i + 1]
        i += 1
    return src[m.start():]


def referenced_images(slug):
    """The image files this city's page actually references (cities.ts truth)."""
    import re
    block = cities_ts_block(slug)
    out = []
    if not block:
        return out
    for field in ("heroImage", "supportSceneImage"):
        m = re.search(r'%s:\s*"([^"]+)"' % field, block)
        if m:
            label = "hero" if "hero" in field else "support"
            out.append((label, os.path.join(ROOT, "public",
                        m.group(1).lstrip("/"))))
    m = re.search(r'ogImage:\s*"https://[^"]+/(images/[^"]+)"', block)
    if m:
        out.append(("og", os.path.join(ROOT, "public", m.group(1))))
    thumb = f"{IMAGES}/yt-thumb-{slug}.webp"
    if load_rgb(os.path.join(ROOT, thumb)) is not None:
        out.append(("thumb", os.path.join(ROOT, thumb)))
    return out


def image_candidates(slug, hero_only=False):
    """Referenced images first, then on-disk fallbacks for uncommitted cities."""
    refs = referenced_images(slug)
    cands = list(refs)
    fallback = [
        ("hero", f"{IMAGES}/{slug}-birth-doula-skyline.webp"),
        ("support", f"{IMAGES}/{slug}-birth-doula-support.webp"),
        ("og", f"{IMAGES}/og-city-{slug}.webp"),
        ("thumb", f"{IMAGES}/yt-thumb-{slug}.webp"),
    ]
    if not hero_only:
        have = {p for _, p in cands}
        for label, path in fallback:
            if path not in have:
                cands.append((label, path))
    else:
        cands = [c for c in cands if c[0].startswith("hero")]
        if not cands:
            cands = [("hero", f"{IMAGES}/{slug}-birth-doula-skyline.webp")]
    seen, uniq = set(), []
    for label, path in cands:
        if path not in seen and load_rgb(path) is not None:
            seen.add(path)
            uniq.append((label, path))
    return uniq


def find_figures(arr, min_h_frac=0.25):
    """Isolate dark figure blobs against a bright background via column mass."""
    g = np.array(Image.fromarray(arr).convert("L"))
    dark = g < 80
    h, w = dark.shape
    colmass = dark.sum(axis=0)
    thresh = max(30, int(h * 0.15))
    sig = colmass > thresh
    if not sig.any():
        return []
    runs, start = [], None
    for x, v in enumerate(sig):
        if v and start is None:
            start = x
        elif not v and start is not None:
            if x - start > w * 0.04:
                runs.append((start, x))
            start = None
    if start is not None and w - start > w * 0.04:
        runs.append((start, w))
    figures = []
    for x0, x1 in runs:
        sub = dark[:, x0:x1]
        rows = np.where(sub.sum(axis=1) > max(10, (x1 - x0) * 0.1))[0]
        if len(rows) < h * min_h_frac:
            continue  # skyline strip / ground band, not a figure
        figures.append((x0, int(rows.min()), x1, int(rows.max())))
    return figures


def emit_crops(slug, hero_only=False):
    """Emit 2x figure crops for every candidate image. Returns (crops, warnings)."""
    cands = image_candidates(slug, hero_only)
    if not cands:
        return [], [f"no images found for {slug}"]
    os.makedirs(CROP_DIR, exist_ok=True)
    os.makedirs(VERDICT_DIR, exist_ok=True)
    crops, warnings = [], []

    for label, path in cands:
        im = load_rgb(path)
        if im is None:
            warnings.append(f"unreadable image: {path}")
            continue
        figures = find_figures(np.array(im))
        if label in ("og", "thumb"):
            # composite layouts: figure lives in the right half
            half = im.crop((im.width // 2, 0, im.width, im.height))
            figures = [(x0 + im.width // 2, y0, x1 + im.width // 2, y1)
                       for x0, y0, x1, y1 in find_figures(np.array(half))]
        if label.startswith("support"):
            # photographic scenes: blob detection is unreliable — one fixed
            # wide crop of the central subject area for the vision pass
            cw, ch = int(im.width * 0.85), int(im.height * 0.9)
            x_off, y_off = (im.width - cw) // 2, (im.height - ch) // 2
            figures = [(x_off, y_off, x_off + cw, y_off + ch)]
        if len(figures) > 1:
            warnings.append(
                f"[{label}] {len(figures)} figure blobs detected — possible "
                f"'two pregnant women' merge; vision pass must count figures")
        if not figures:
            warnings.append(f"[{label}] no figure detected — verify manually")
            continue
        for i, (x0, y0, x1, y1) in enumerate(figures):
            pad = 40
            crop = im.crop((max(0, x0 - pad), max(0, y0 - pad),
                            min(im.width, x1 + pad), min(im.height, y1 + pad)))
            crop2x = crop.resize((crop.width * 2, crop.height * 2),
                                 Image.Resampling.LANCZOS)
            crop_path = f"{CROP_DIR}/{slug}-{label}-fig{i}.png"
            crop2x.save(crop_path)
            crops.append({"label": f"{label}-fig{i}", "image": path,
                          "crop": crop_path, "bbox": [x0, y0, x1, y1]})
            status = "✅" if len(figures) == 1 else "🚩"
            print(f"  {status} [{label}-fig{i}] {os.path.basename(path)} "
                  f"bbox={figures[i]} -> {crop_path}")
    return crops, warnings


def main():
    args = sys.argv[1:]
    hero_only = "--hero-only" in args
    slug = next((a for a in args if not a.startswith("-")), None)
    if not slug:
        print("usage: visual-verify-gate.py <slug> [--hero-only]")
        return 2

    crops, warnings = emit_crops(slug, hero_only)
    for w in warnings:
        print(f"  ⚠️  {w}")

    verdict_path = f"{VERDICT_DIR}/{slug}.json"
    if not crops:
        print("❌ [visual-verify] no figure crops emitted — vision pass impossible")
        return 1

    if not os.path.exists(verdict_path):
        print(f"\n❌ [visual-verify] MISSING vision verdict: {verdict_path}")
        print(f"   {len(crops)} crops awaiting verification in {CROP_DIR}/")
        print("   REQUIRED procedure (defect-specific, per figure crop):")
        print("   1. vision_analyze each crop at the emitted 2x zoom")
        print("      Ask: how many arms? fused/extra fingers? belly position")
        print("      vs facing direction? melted joints? figure count?")
        print("   2. Write the verdict file:")
        print('      {"slug": "...", "verdicts": [{"crop": "<filename>",')
        print('        "verdict": "pass|fail", "defects": ["..."]}],')
        print('        "checked_at": "..."}')
        print("   3. Re-run this gate.")
        return 1

    with open(verdict_path) as f:
        verdict = json.load(f)
    verdicts = {v["crop"]: v["verdict"] for v in verdict.get("verdicts", [])}
    missing = [c["crop"] for c in crops if os.path.basename(c["crop"]) not in verdicts]
    failed = [(c["crop"], verdicts[os.path.basename(c["crop"])])
              for c in crops
              if os.path.basename(c["crop"]) in verdicts
              and verdicts[os.path.basename(c["crop"])] != "pass"]

    if missing:
        print(f"❌ [visual-verify] {len(missing)} crops not covered by verdict file:")
        for m in missing:
            print(f"   - {m}")
        return 1
    if failed:
        for path, v in failed:
            print(f"❌ [visual-verify] FAIL verdict on {path}")
        return 1

    checked = verdict.get("checked_at", "unknown")
    print(f"✅ [visual-verify] all {len(crops)} figure crops vision-verified pass "
          f"(checked_at: {checked})")
    return 0


if __name__ == "__main__":
    sys.exit(main())