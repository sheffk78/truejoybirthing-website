#!/usr/bin/env python3
"""sync-city-pipeline.py — publish the live city-pipeline state to the website.

The automated city pipeline writes progress into the TJB city ledger
(~/.hermes/state/tjb-city-ledger.json). This script projects the "currently
being worked on" part of that ledger into src/data/city-pipeline.json, a tiny
map the Astro city pages read to render a slim "we're working on this page
right now" strip.

Design rules (all of them are about never breaking the build):
  * Python 3 standard library only.
  * A missing / unreadable / malformed ledger writes an empty map and exits 0.
  * Output is deterministic: sorted keys, stable 2-space JSON, trailing newline.
  * Atomic write (temp file + os.replace) so a concurrent build never reads a
    half-written file.

Env overrides:
  TJB_PIPELINE_LEDGER  ledger path      (default ~/.hermes/state/tjb-city-ledger.json)
  TJB_PIPELINE_OUTPUT  output JSON path (default <project>/src/data/city-pipeline.json)
  TJB_PIPELINE_CITIES  cities.ts path   (default <project>/src/data/cities.ts)

Run:  python3 scripts/sync-city-pipeline.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import tempfile
from pathlib import Path

# ─── Config ───────────────────────────────────────────────────────────────

DEFAULT_LEDGER = Path.home() / ".hermes" / "state" / "tjb-city-ledger.json"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT = PROJECT_ROOT / "src" / "data" / "city-pipeline.json"
DEFAULT_CITIES = PROJECT_ROOT / "src" / "data" / "cities.ts"

# The ledger's stage vocabulary -> the plain-English phrase shown on the page.
# "complete" is intentionally absent: a finished page shows no strip.
STAGE_MILESTONES = {
    "build": "Research and images are being added",
    "enrich": "Provider, hospital and cost details are being enriched",
    "verify_deploy": "Final checks and publishing are in progress",
    "video_outreach": "A city video is being produced",
    "queued": "This page is queued for updates",
    "blocked": "Updates to this page are on hold",
}
DEFAULT_MILESTONE = "This page is being updated"

# Slug shape used by the site (kebab-case city-state).
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


# ─── Helpers ──────────────────────────────────────────────────────────────

def truthy(value) -> bool:
    """Ledger booleans are sometimes written as 1 / "true" / "yes"."""
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        return value.strip().lower() in ("true", "1", "yes")
    return False


def parse_city_slugs(cities_path: Path):
    """Return the set of city slugs defined in src/data/cities.ts.

    Parsed by brace depth rather than indentation: cities.ts contains nested
    objects (birthStats, midwifeInfo, ...) that are written at the same
    indentation as their parent city, so an indentation-based scan would
    report them as cities.

    Returns None when the file cannot be read or parsed — the caller then
    skips slug filtering rather than dropping every row.
    """
    try:
        src = cities_path.read_text(encoding="utf-8")
    except OSError:
        return None

    marker = src.find("export const cities")
    if marker == -1:
        return None
    start = src.find("{", marker)
    if start == -1:
        return None

    slugs = set()
    depth = 0
    i = start
    n = len(src)
    while i < n:
        ch = src[i]
        if ch == "{":
            depth += 1
            i += 1
            continue
        if ch == "}":
            depth -= 1
            i += 1
            if depth == 0:
                break
            continue
        if depth == 1 and ch in ('"', "'"):
            quote = ch
            j = i + 1
            buf = []
            while j < n:
                c = src[j]
                if c == "\\":
                    buf.append(src[j:j + 2])
                    j += 2
                    continue
                if c == quote:
                    break
                buf.append(c)
                j += 1
            key = "".join(buf)
            k = j + 1
            while k < n and src[k] in " \t\r\n":
                k += 1
            if k < n and src[k] == ":" and key and SLUG_RE.match(key):
                slugs.add(key)
            i = j + 1
            continue
        i += 1
    return slugs


def load_ledger(ledger_path: Path):
    """Return the ledger's cities map, or None if the ledger is unusable."""
    try:
        raw = ledger_path.read_text(encoding="utf-8")
    except OSError:
        return None
    try:
        data = json.loads(raw)
    except (ValueError, TypeError):
        return None
    if not isinstance(data, dict):
        return None
    cities = data.get("cities")
    if not isinstance(cities, dict):
        return None
    return cities


def build_payload(cities: dict, valid_slugs) -> dict:
    """Project the ledger down to the rows the site actually renders.

    Keeps a row only when it is flagged in_progress, is not at the 'complete'
    stage, and (when cities.ts could be read) names a city the site publishes.
    """
    payload = {}
    for slug, row in cities.items():
        if not isinstance(row, dict):
            continue
        if not truthy(row.get("in_progress")):
            continue
        stage = str(row.get("stage") or "").strip().lower()
        if not stage or stage == "complete":
            continue
        if valid_slugs is not None and slug not in valid_slugs:
            continue
        started_at = row.get("started_at") or row.get("updated_at") or ""
        payload[slug] = {
            "inProgress": True,
            "stage": stage,
            "startedAt": str(started_at),
            "nextMilestone": STAGE_MILESTONES.get(stage, DEFAULT_MILESTONE),
        }
    return payload


def write_output(output_path: Path, payload: dict) -> None:
    """Atomically write the JSON map (temp file + replace)."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(payload, indent=2, sort_keys=True, ensure_ascii=False) + "\n"
    fd, tmp_name = tempfile.mkstemp(
        dir=str(output_path.parent), prefix=".city-pipeline-", suffix=".tmp"
    )
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(text)
        os.replace(tmp_name, output_path)
    except BaseException:
        try:
            os.unlink(tmp_name)
        except OSError:
            pass
        raise


# ─── Main ─────────────────────────────────────────────────────────────────

def main() -> int:
    ledger_path = Path(os.environ.get("TJB_PIPELINE_LEDGER", str(DEFAULT_LEDGER))).expanduser()
    output_path = Path(os.environ.get("TJB_PIPELINE_OUTPUT", str(DEFAULT_OUTPUT))).expanduser()
    cities_path = Path(os.environ.get("TJB_PIPELINE_CITIES", str(DEFAULT_CITIES))).expanduser()

    valid_slugs = parse_city_slugs(cities_path)
    if valid_slugs is None:
        print(
            "sync-city-pipeline: WARNING could not read %s — slug filter disabled"
            % cities_path,
            file=sys.stderr,
        )

    cities = load_ledger(ledger_path)
    if cities is None:
        # Missing or malformed ledger is not an error: the site must still build.
        payload = {}
    else:
        payload = build_payload(cities, valid_slugs)

    try:
        write_output(output_path, payload)
    except OSError as exc:
        # A write failure would break the build; report it but keep going.
        print("sync-city-pipeline: ERROR could not write %s (%s)" % (output_path, exc),
              file=sys.stderr)
        return 0

    print("city-pipeline: %d city page(s) in progress -> %s" % (len(payload), output_path))
    return 0


if __name__ == "__main__":
    sys.exit(main())
