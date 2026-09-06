#!/usr/bin/env python3
"""TJB schema contracts — shared library for per-stage handoff contracts.

Phase 1 of the TJB Pipeline Harness Plan (Agency OS model, Layer 2).
Single source of truth for contract location, schema definitions, and
cities.ts parsing helpers used by contract-validate.py and scaffold mode.

Contract file layout: artifacts/handoffs/{slug}/{stage}.json
Exit-code contract (matches preflight-stage-gate.py): 0 pass, 1 retryable, 3 fatal.
"""

import json
import re
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
CITIES_TS = PROJECT_DIR / "src" / "data" / "cities.ts"
HANDOFF_DIR = PROJECT_DIR / "artifacts" / "handoffs"
STAGES = ["build", "enrich", "verify_deploy", "video_outreach"]

COST_RANGE_RE = r"^\$\s?[\d,]+(\.\d+)?\s*[-–—]\s*\$?\s?[\d,]+(\.\d+)?$"
URL_RE = r"^https?://[^\s\"'<>]+$"
YT_ID_RE = r"^[A-Za-z0-9_-]{11}$"
ISO_TS_RE = r"^\d{4}-\d{2}-\d{2}(T[\d:.]+Z?|\s[\d:]+)?$"

GENERIC_PROVIDER_NAMES = {"doulas", "doula", "resources", "local doulas", "doulas & midwives",
                          "birth doulas", "midwives", "providers", "pending", "tbd", "n/a"}


# ---------------------------------------------------------------- parsing

def _balanced(text: str, start: int, open_ch: str = "{", close_ch: str = "}") -> str:
    """Single-pass comment-aware balanced-delimiter scan. O(n), no rescan.

    Corpus convention (cities.ts): all string literals are double-quoted;
    single-quote chars only appear inside comments ("County's") or as
    escaped apostrophes within double-quoted strings. So:
      - strings are delimited by `"` only (with backslash escapes)
      - `// ...` line comments and `/* ... */` block comments are skipped
    This was a real bug: leesburg-fl's `// Lake County's ONLY ...` comment
    made the apostrophe open a phantom string, breaking block extraction.
    """
    depth = 0
    i = start
    quote = None
    n = len(text)
    while i < n:
        ch = text[i]
        if quote:
            if ch == "\\":
                i += 2
                continue
            if ch == quote:
                quote = None
        elif ch == chr(34):
            quote = ch
        elif ch == "/" and i + 1 < n and text[i + 1] == "/":
            nl = text.find("\n", i)
            i = nl if nl != -1 else n
            continue
        elif ch == "/" and i + 1 < n and text[i + 1] == "*":
            end = text.find("*/", i + 2)
            i = end + 2 if end != -1 else n
            continue
        elif ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return text[start:i + 1]
        i += 1
    return ""


def city_block(slug: str) -> str:
    """Extract a city's object text from cities.ts (brace-matched, single pass)."""
    text = CITIES_TS.read_text(errors="replace") if CITIES_TS.exists() else ""
    marker = f'"{slug}": {{'
    start = text.find(marker)
    if start < 0:
        return ""
    brace = text.find("{", start)
    if brace < 0:
        return ""
    return _balanced(text, brace)


def field(block: str, name: str):
    """Top-level scalar field from a TS object block: string/number/bool/None."""
    m = re.search(rf"\b{name}:\s*(\"[^\"]*\"|'[^']*'|[^,\n}}]+)", block)
    if not m:
        return None
    raw = m.group(1).strip().rstrip(",")
    if raw.startswith(('"', "'")):
        return raw[1:-1]
    if raw in ("true", "false"):
        return raw == "true"
    try:
        return float(raw) if "." in raw else int(raw)
    except ValueError:
        return raw or None


def array_blocks(block: str, name: str) -> list:
    """Extract the object texts inside `name: [ ... ]` (objects may nest)."""
    m = re.search(rf"\b{name}:\s*\[", block)
    if not m:
        return []
    arrtxt = _balanced(block, m.end() - 1, "[", "]")
    if arrtxt:
        arrtxt = arrtxt[1:-1]  # strip outer brackets
    objs, depth, obj_start = [], 0, None
    for i, ch in enumerate(arrtxt):
        if ch == "{":
            if depth == 0:
                obj_start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and obj_start is not None:
                objs.append(arrtxt[obj_start:i + 1])
                obj_start = None
    return objs


def arr_field(obj_text: str, name: str) -> list:
    """String-array field inside an object text, e.g. services: ["A", "B"]."""
    m = re.search(rf"\b{name}:\s*\[(.*?)\]", obj_text, re.S)
    if not m:
        return []
    return re.findall(r'"([^"]*)"', m.group(1))


# ---------------------------------------------------------------- image checks

def image_on_disk(ref: str, slug: str) -> tuple:
    """(ok: bool, detail: str) — local /images/ path exists + belongs to this slug."""
    if not ref:
        return False, "missing reference"
    ref = ref.split("?")[0]
    if ref.startswith("http"):
        if slug in Path(ref).name:
            return True, f"remote: {ref}"
        return False, f"remote reference not slug-scoped: {ref}"
    local = ref.split("/images/", 1)[-1] if "/images/" in ref else ref.lstrip("/")
    path = PROJECT_DIR / "public" / "images" / local
    if slug not in Path(ref).name:
        return False, f"wrong-city reference: {ref}"
    if not path.exists():
        return False, f"missing asset on disk: {ref}"
    return True, ref


# ---------------------------------------------------------------- contract location

def contract_path(slug: str, stage: str) -> Path:
    return HANDOFF_DIR / slug / f"{stage}.json"


def load_contract(slug: str, stage: str):
    p = contract_path(slug, stage)
    if not p.exists():
        return None, f"contract missing: artifacts/handoffs/{slug}/{stage}.json"
    try:
        return json.loads(p.read_text()), None
    except json.JSONDecodeError as e:
        return None, f"contract is not valid JSON: {e}"


def contract_skeleton(slug: str, stage: str) -> dict:
    """The required shape for a stage's contract (meta + tight rules)."""
    base = {
        "slug": slug,
        "stage": stage,
        "produced_at": None,       # required, ISO timestamp
        "worker_model": None,      # required, non-empty
        "notes": "",
        "sources": [],             # evidence: {claim, url, quote, kind}
    }
    if stage == "build":
        base.update({
            "city_fields": {
                "city": None, "state": None, "lat": None, "lng": None,
                "costLow": None, "costHigh": None,
                "heroImage": None, "ogImage": None, "supportSceneImage": None,
                "supportSceneAlt": None, "culture": None, "medicaidNote": None,
            },
            "faqs_count": None,           # required >= 4
            "midwife_paragraph_chars": None,
            "doulas": [                   # >= 1; mirrors localDoulas
                {"name": None, "url": None, "photo": None,
                 "description_chars": None, "costRange": None},
            ],
            "images": {                   # watermark-clean flags (flux pipeline)
                "hero_watermark_clean": None,
                "og_watermark_clean": None,
            },
        })
    elif stage == "enrich":
        base.update({
            "providers": [                # mirrors localDoulas enrichment
                {"name": None, "photo": None, "description_chars": None,
                 "costRange": None, "costRange_source": None},
            ],
            "hospitals": [                # mirrors hospitalDetails
                {"name": None, "paragraph_chars": None, "thumbnail": None,
                 "nicuLevel": None, "url": None},
            ],
            "birth_centers": [            # mirrors birthCenterDetails
                {"name": None, "paragraph_chars": None, "thumbnail": None},
            ],
            "birthstats": {"dataYear": None, "dataSource": None},
        })
    elif stage == "verify_deploy":
        base.update({
            "preflight_exit": None,       # required == 0
            "deploy_status": None,        # required == "SUCCESS"
            "live_http": None,            # required == 200
            "vision_verdict_file": None,  # artifacts/gates/vision/{slug}.json, all crops pass
        })
    elif stage == "video_outreach":
        base.update({
            "video_file": None,           # path, must exist and be > 10MB
            "video_mb": None,
            "youtube_id": None,           # required, 11-char ID
            "thumbnail_path": None,       # must exist on disk
            "embed_verified": None,       # required True
            "outreach": [                 # >= 0; R41: proof of contact = message_id
                {"provider": None, "status": None, "message_id": None},
            ],
        })
    return base