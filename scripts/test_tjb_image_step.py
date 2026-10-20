#!/usr/bin/env python3
"""Regression tests for tjb-image-step.stamp_fields.

The 2026-10-19 incident: field stamping placed image fields AFTER the orange-ca
entry's closing brace (last-entry edge case) — fields must land INSIDE the entry
for every entry shape, and re-runs must be idempotent.
Run: python3 scripts/test_tjb_image_step.py   (or pytest)
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
import importlib.util  # noqa: E402
_spec = importlib.util.spec_from_file_location(
    "tjb_image_step", Path(__file__).resolve().parent / "tjb-image-step.py")
tjb_image_step = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(tjb_image_step)


MID_TEMPLATE = '''export const CITIES = {
  "anchor-aa": {
    city: "Anchor",
    slug: "anchor-aa",
    lat: 1.0,
    localDoulas: [
      {
        name: "D A",
        photo: "/images/doulas/anchor-aa-da.webp"
      }
    ]
  },
  {MID}
};

export default CITIES;
'''

LAST_TEMPLATE = '''export const CITIES = {
  {ENTRY}
};

export default CITIES;
'''

ENTRY = '''"target-zz": {
    city: "Target",
    slug: "target-zz",
    lat: 2.0,
    hospitals: [
      {
        name: "H",
        note: "emergency room"
      }
    ]
  }'''

FIELDS = {
    "heroImage": "/images/target-zz-birth-doula-hero-v1.webp",
    "supportSceneImage": "/images/target-zz-birth-doula-support-v1.webp",
    "ogImage": "https://truejoybirthing.com/images/og-city-target-zz.webp",
}


def _stamp_in(tmp: Path, template: str, entry: str) -> str:
    (tmp / "src/data").mkdir(parents=True)
    (tmp / "src/data/cities.ts").write_text(
        template.replace("{ENTRY}", entry).replace("{MID}", entry + ","))
    orig_repo = tjb_image_step.REPO
    tjb_image_step.REPO = tmp
    try:
        tjb_image_step.stamp_fields("target-zz", FIELDS)
    finally:
        tjb_image_step.REPO = orig_repo
    src = (tmp / "src/data/cities.ts").read_text()
    return src


def _check_placement(src: str, case: str):
    i = src.find('"target-zz"')
    assert i != -1, f"{case}: entry missing"
    nxt = re.search(r'\n  "[a-z0-9-]+": \{|\n};', src[i + 10:])
    end = (i + 10 + nxt.start()) if nxt else len(src)
    entry = src[i:end]
    for f in FIELDS:
        m = re.search(f + r': "' + re.escape(FIELDS[f]) + r'"', entry)
        assert m, f"{case}: {f} not INSIDE entry span"
    # inside: entry text between key and next key must NOT close with bare } before fields
    g = subprocess.run(["npx", "esbuild", str(tmp_entry := (src,)), "--loader:.ts=ts"],
                       capture_output=True)


def _parse(tmp: Path, case: str):
    g = subprocess.run(["npx", "esbuild", "src/data/cities.ts", "--loader:.ts=ts"],
                       capture_output=True, cwd=tmp)
    assert g.returncode == 0, f"{case}: cities.ts does not parse: {g.stderr.decode()[-200:]}"


def test_fields_land_inside_mid_file_entry():
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        # _stamp_in appends the separating comma itself ({MID} → entry + ",")
        src = _stamp_in(tmp, MID_TEMPLATE, ENTRY)
        _check_placement(src, "mid-file")
        _parse(tmp, "mid-file")


def test_fields_land_inside_last_entry():
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        src = _stamp_in(tmp, LAST_TEMPLATE, ENTRY)
        _check_placement(src, "last-entry")
        _parse(tmp, "last-entry")


def test_rerun_is_idempotent_and_no_dangling_fields():
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        src1 = _stamp_in(tmp, LAST_TEMPLATE, ENTRY)
        # second run with same fields must not duplicate or dangle
        orig_repo = tjb_image_step.REPO
        tjb_image_step.REPO = tmp
        try:
            tjb_image_step.stamp_fields("target-zz", FIELDS)
        finally:
            tjb_image_step.REPO = orig_repo
        src2 = (tmp / "src/data/cities.ts").read_text()
        src1n = re.sub(r"\s+", " ", src1)
        src2n = re.sub(r"\s+", " ", src2)
        assert src1n == src2n, "re-run changed the file (not idempotent)"
        assert not re.search(r'\}\s*,?\s*\n?\s*(heroImage)', src2), "dangling field after entry close"
        _parse(tmp, "rerun")


if __name__ == "__main__":
    test_fields_land_inside_mid_file_entry()
    print("PASS  mid-file placement")
    test_fields_land_inside_last_entry()
    print("PASS  last-entry placement")
    test_rerun_is_idempotent_and_no_dangling_fields()
    print("PASS  idempotent re-run")
    print("ALL PASS")