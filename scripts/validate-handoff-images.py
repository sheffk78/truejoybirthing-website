#!/usr/bin/env python3
"""
TJB handoff image contract — added 2026-10-20 (build-standard Layer 2).

ROOT CAUSE (Peoria, 2026-10-20): a city build was marked COMPLETE while
every required image was missing, because (a) the handoff notes said
images were "another lane's job", and (b) nothing machine-checked the
handoff. Prose handoffs are noise; evidence travels with the work.

CONTRACT: artifacts/handoffs/<slug>/build.json must contain:
  "image_manifest": [ {"path": "public/images/og-city-<slug>.webp",
                       "kind": "required"}, ... ]
Completion validation:
  - every required path EXISTS, decodes as a real image, >20KB
  - slug appears in the path (cross-city contamination guard)
Exit 0 = contract met; exit 1 = listing each missing/broken asset;
exit 2 = handoff missing manifest (old-format handoffs fail CLOSED).
"""
import json, sys, os
from pathlib import Path

BASE = Path("/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website")

def main(slug):
    hj = BASE / "artifacts/handoffs" / slug / "build.json"
    if not hj.exists():
        print(f"❌ {slug}: no build.json handoff at {hj}")
        sys.exit(1)
    h = json.load(open(hj))
    manifest = h.get("image_manifest")
    if manifest is None:
        print("❌ FAIL-CLOSED: build.json has no image_manifest. A city build")
        print("   cannot be marked complete without declaring its assets.")
        sys.exit(2)
    bad = []
    try:
        from PIL import Image
    except Exception as e:
        # The gate toolchain, not the caller's env, owns the imaging stack.
        # G0 lesson (2026-10-20): re-exec through the interpreter the deploy
        # gates use instead of failing open.
        import subprocess as sp, shutil
        if os.environ.get("TJB_IMG_REEXEC") == "1":
            print(f"❌ PIL unavailable on re-exec'd {sys.executable}: {e}")
            sys.exit(1)
        # Prefer the interpreter the deploy toolchain uses (G0-checked),
        # fall back to PATH python3. One re-exec max, flag-guarded.
        tool = sorted(__import__("glob").glob(
            "/Users/socializerender/.hermes/tools/python-3.1[4-9]*/bin/python3"))
        cands = (tool[-1:] if tool else []) + [shutil.which("python3")]
        for cand in cands:
            if not cand:
                continue
            r2 = sp.run([cand, __file__] + sys.argv[1:],
                        capture_output=True, text=True, timeout=120,
                        env={**os.environ, "TJB_IMG_REEXEC": "1"})
            sys.stdout.write(r2.stdout); sys.stderr.write(r2.stderr)
            sys.exit(r2.returncode)
        print(f"❌ no PIL-capable interpreter found: {e}")
        sys.exit(1)
    for item in manifest:
        p = BASE / item["path"]
        # Size floor scales by asset class: hero/OG are big canvases,
        # facility/provider thumbnails are legitimately small webps.
        floor = 20480 if item.get("kind") in ("required", "hero", "og") else 6144
        if not p.exists() or p.stat().st_size < floor:
            why = 'MISSING' if not p.exists() else f'TOO SMALL (<{floor//1024}KB)'
            bad.append(f"{item['path']} -> {why}")
            continue
        try:
            im = Image.open(p); im.load()
            if im.size[0] < 400:
                bad.append(f"{item['path']} -> decoded but only {im.size[0]}px wide")
            if slug.replace('-', '') not in item['path'].replace('-', ''):
                bad.append(f"{item['path']} -> path lacks slug {slug} (contamination guard)")
        except Exception as e:
            bad.append(f"{item['path']} -> NOT A REAL IMAGE: {e}")
    if bad:
        print(f"❌ {slug}: handoff image contract UNMET —")
        for b in bad: print(f"   - {b}")
        sys.exit(1)
    print(f"✅ {slug}: handoff image contract met ({len(manifest)} assets verified)")
    sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: validate-handoff-images.py <slug>"); sys.exit(2)
    main(sys.argv[1])
