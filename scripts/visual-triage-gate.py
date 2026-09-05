#!/usr/bin/env python3
"""Visual Triage Gate — TJB city images (2026-09-05, Rockville defect postmortem).

WHY THIS EXISTS
The Rockville hero shipped with a phantom arm segment and fused fingers because:
  1. Structural gates (G8 colors, G25 aspect, G65 bars) cannot see anatomy.
  2. The visual-system skill's "mandatory visual verification" was an
     agreeable full-frame vision pass — full-frame it scored the broken
     figure "anatomically correct, no defects". Only a 2x zoom exposed it.
  3. Nothing enforced that the vision pass ran at all.

WHAT THIS GATE DOES (triage, not verdict):
  A. Isolates the human figure(s) by luminance against the bright background.
  B. Flags multi-figure merges (blob analysis) — catches "two pregnant women".
  C. Runs artifact heuristics on the figure silhouette:
     - interior variance (melted/fused regions create high variance pockets)
     - outline smoothness (phantom limbs create sharp outline discontinuities)
     - hand-region finger-detail spike (visible fingers at silhouette scale)
  D. Emits a 2x zoomed crop of every detected figure to /tmp/tjb-vision-crops/
     for the MANDATORY vision_analyze pass. The vision pass is the verdict;
     this gate makes skipping it impossible (crops must exist + report file).

USAGE
  python3 scripts/visual-triage-gate.py <slug> [--hero-only]

EXIT CODES (same contract as preflight-stage-gate.py)
  0 = triage clean AND vision crops emitted
  1 = triage flagged defects OR crops missing -> run vision pass, fix, retry
  2 = infra (missing files, unreadable images)

VISION REPORT CONTRACT
  After vision_analyze on each emitted crop, write
  artifacts/gates/vision/{slug}.json:
    {"slug": "...", "figures": [{"crop": "...", "verdict": "pass|fail",
      "defects": ["..."]}], "checked_by": "...", "checked_at": "..."}
  preflight verify_deploy requires this file with verdicts all "pass".
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


def load_rgb(path):
    if not os.path.exists(path):
        return None
    try:
        return Image.open(path).convert("RGB")
    except Exception:
        return None


def image_candidates(slug, hero_only=False):
    cands = [
        ("hero", f"{IMAGES}/{slug}-birth-doula-skyline.webp"),
        ("hero-v2", f"{IMAGES}/{slug}-birth-doula-skyline-v2.webp"),
        ("hero-v3", f"{IMAGES}/{slug}-birth-doula-hero-v3.webp"),
        ("hero", f"{IMAGES}/{slug}-birth-doula-hero.webp"),
        ("support", f"{IMAGES}/{slug}-birth-doula-support.webp"),
        ("support-v2", f"{IMAGES}/{slug}-birth-doula-support-v2.webp"),
        ("og", f"{IMAGES}/og-city-{slug}.webp"),
        ("thumb", f"{IMAGES}/yt-thumb-{slug}.webp"),
    ]
    if hero_only:
        cands = [c for c in cands if c[0].startswith("hero")]
    out = []
    for label, path in cands:
        if load_rgb(path) is not None:
            out.append((label, path))
    # de-dup by path
    seen, uniq = set(), []
    for label, path in out:
        if path not in seen:
            seen.add(path)
            uniq.append((label, path))
    return uniq


def find_figures(arr):
    """Isolate dark figure blobs against a bright sky via column profile."""
    g = np.array(Image.fromarray(arr).convert("L"))
    dark = g < 80
    h, w = dark.shape
    colmass = dark.sum(axis=0)
    # figure columns = significant dark mass (sky bands are thin)
    thresh = max(30, int(h * 0.15))
    sig = colmass > thresh
    if not sig.any():
        return []
    # contiguous runs of significant columns
    runs, start = [], None
    for x, v in enumerate(sig):
        if v and start is None:
            start = x
        elif not v and start is not None:
            if x - start > w * 0.04:  # min width
                runs.append((start, x))
            start = None
    if start is not None and w - start > w * 0.04:
        runs.append((start, w))
    figures = []
    for x0, x1 in runs:
        sub = dark[:, x0:x1]
        rows = np.where(sub.sum(axis=1) > max(10, (x1 - x0) * 0.1))[0]
        if len(rows) < h * 0.2:
            continue  # skyline strip, not a figure
        figures.append((x0, int(rows.min()), x1, int(rows.max())))
    return figures


def triage_figure(im, box, label, slug):
    """Heuristic checks on one figure crop. Returns (flags, crop_path)."""
    x0, y0, x1, y1 = box
    pad = 40
    crop = im.crop((max(0, x0 - pad), max(0, y0 - pad),
                    min(im.width, x1 + pad), min(im.height, y1 + pad)))
    crop2x = crop.resize((crop.width * 2, crop.height * 2), Image.Resampling.LANCZOS)
    os.makedirs(CROP_DIR, exist_ok=True)
    crop_path = f"{CROP_DIR}/{slug}-{label}.png"
    crop2x.save(crop_path)

    flags = []
    g = np.array(crop.convert("L"))
    dark = g < 90
    area = dark.sum()
    if area == 0:
        return ["no-figure-pixels-found"], crop_path

    # 1. Interior variance: uniform silhouette should have LOW variance
    #    inside the figure body (away from edges). Melted/fused anatomy and
    #    rendered fingers create bright pockets inside the dark mass.
    erode = dark.copy()
    for _ in range(6):  # cheap erosion to get interior
        erode = erode & np.roll(erode, 1, 0) & np.roll(erode, -1, 0) \
                        & np.roll(erode, 1, 1) & np.roll(erode, -1, 1)
    interior = erode.sum()
    if interior > 200:
        interior_vals = g[erode]
        # bright pockets INSIDE the dark figure = detail/artifact risk
        bright_pocket_frac = float((interior_vals > 130).mean())
        if bright_pocket_frac > 0.06:
            flags.append(f"interior-bright-pockets({bright_pocket_frac:.2f})")

    # 2. Outline discontinuity: count sharp jumps in the per-row edge position
    #    (phantom limbs / fused blobs produce abrupt edge jumps)
    edges = []
    for y in range(g.shape[0]):
        row = np.where(dark[y])[0]
        if len(row) > 3:
            edges.append((row.min(), row.max()))
    jumps = 0
    for i in range(1, len(edges)):
        dl = abs(edges[i][0] - edges[i - 1][0])
        dr = abs(edges[i][1] - edges[i - 1][1])
        if dl > g.shape[1] * 0.18 or dr > g.shape[1] * 0.18:
            jumps += 1
    if jumps > 12:
        flags.append(f"outline-discontinuities({jumps})")

    # 3. Hand-region finger detail: fine bright ridges in the lower-middle
    #    of the figure where hands cradle the belly
    hh, hw = g.shape
    hand = g[int(hh * 0.45):int(hh * 0.8), int(hw * 0.25):int(hw * 0.85)]
    grad = np.abs(np.diff(hand.astype(int), axis=1))
    ridge_frac = float((grad > 60).mean())
    if ridge_frac > 0.10:
        flags.append(f"hand-detail-spike({ridge_frac:.2f})")

    return flags, crop_path


def main():
    args = sys.argv[1:]
    hero_only = "--hero-only" in args
    slug = next((a for a in args if not a.startswith("-")), None)
    if not slug:
        print("usage: visual-triage-gate.py <slug> [--hero-only]")
        return 2

    cands = image_candidates(slug, hero_only)
    if not cands:
        print(f"❌ [triage] no images found for {slug}")
        return 2

    os.makedirs("artifacts/gates/vision", exist_ok=True)
    report = {"slug": slug, "checked_at": datetime.now(timezone.utc).isoformat(),
              "images": [], "crops": [], "triage_flags": []}
    total_flags = 0

    for label, path in cands:
        im = load_rgb(path)
        if im is None:
            print(f"  ❌ [{label}] unreadable image: {path}")
            return 2
        figures = find_figures(np.array(im))
        entry = {"image": path, "label": label, "figures": len(figures), "flags": []}
        if label in ("og", "thumb"):
            # right-column / background figure only: search right half
            half = im.crop((im.width // 2, 0, im.width, im.height))
            figs = find_figures(np.array(half))
            figures = [(x0 + im.width // 2, y0, x1, y1) for x0, y0, x1, y1 in figs]
        if len(figures) > 1:
            entry["flags"].append(f"multiple-figures({len(figures)})")
        for i, box in enumerate(figures):
            flags, crop_path = triage_figure(im, box, f"{label}-fig{i}", slug)
            entry["flags"].extend(flags)
            report["crops"].append(crop_path)
        total_flags += len(entry["flags"])
        report["images"].append(entry)
        status = "✅" if not entry["flags"] else "🚩"
        print(f"  {status} [{label}] {os.path.basename(path)} figures={len(figures)}"
              + (f" flags={entry['flags']}" if entry["flags"] else " clean"))

    with open(f"artifacts/gates/vision/{slug}.triage.json", "w") as f:
        json.dump(report, f, indent=2)

    if not report["crops"]:
        print(f"❌ [triage] no figure crops emitted — vision pass impossible")
        return 1

    print(f"\n  📸 {len(report['crops'])} zoom crops -> {CROP_DIR}/")
    print("  MANDATORY: run vision_analyze on each crop, then write "
          f"artifacts/gates/vision/{slug}.json (verdict per figure).")
    if total_flags:
        print(f"  🚩 {total_flags} triage flags — treat as FAIL until vision pass clears them")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())