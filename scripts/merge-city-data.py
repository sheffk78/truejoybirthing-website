#!/usr/bin/env python3
"""
merge-city-data.py <slug> [--check]

Applies a lane child's research chunks to cities.ts deterministically.

BUILD lane children (bedrock local model) write SMALL JSON files under
  artifacts/city-chunks/<slug>/
    overview.json   { city, state, slug, costLow, costHigh, lat, lng,
                      publishedDate, enableBlogResources, nearbyCities[],
                      birthStats{...}, titleTag?, metaDescription? }
    prose.json      { culture, heroLocalDetail, medicaidNote, insuranceNote }
    doulas.json     { "localDoulas": [ ...LocalDoula... ] }
    places.json     { "hospitalDetails": [...], "birthCenterDetails": [...] }
    faqs.json       { "faqs": [ {q, a}, ... ] }
    images.json     { heroImage, supportSceneImage, supportSceneAlt, ogImage }
    sources.json    { "sources": [ {title, url, quote}, ... ] }
then runs THIS script. It locates the city entry by brace-matching, replaces
ONLY the targeted arrays/scalars, or scaffolds a COMPLETE new entry when the
city does not exist yet. The model never hand-writes cities.ts, which removes
the multi-thousand-token inline turns that produced 12-minute generation gaps
(2026-10-14 diagnosis). Every JSON chunk is parsed with json.loads first, so
syntax errors die here with a 1-line message instead of a TS compiler loop.

Chunk requirements for a full build merge: overview, prose, doulas, places,
faqs must ALL exist (images/sources optional but recommended).

Exit codes: 0 = applied (or --check passed), 1 = failure, 2 = usage error.
Then run: npx tsx scripts/validate-city-data.ts <slug> && npm run build
"""
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CITIES = REPO / "src" / "data" / "cities.ts"
CHUNK_DIR = REPO / "artifacts" / "city-chunks"

# Required chunks for a full (new-city) scaffold
REQUIRED = ("overview", "prose", "doulas", "places", "faqs")

OVERVIEW_SCALARS = {
    "city", "state", "slug", "costLow", "costHigh", "shelbiServesHere",
    "lat", "lng", "publishedDate", "enableBlogResources",
    "titleTag", "metaDescription", "heroIntentAnswer",
}
OVERVIEW_ALLOW = OVERVIEW_SCALARS | {"birthStats", "nearbyCities"}
PROSE_FIELDS = {"culture", "heroLocalDetail", "medicaidNote", "insuranceNote"}
IMAGE_FIELDS = {"heroImage", "supportSceneImage", "supportSceneAlt", "ogImage"}

ARRAY_LABELS = {  # chunk key -> cities.ts field label (file uses unquoted labels)
    "localDoulas": "localDoulas",
    "hospitalDetails": "hospitalDetails",
    "birthCenterDetails": "birthCenterDetails",
    "faqs": "faqs",
    "sources": "sources",
}


def find_block(src: str, anchor: str):
    """(start, end) span covering `anchor` plus its brace- or bracket-matched value."""
    i = src.find(anchor)
    if i == -1:
        return None
    b = src.find("{", i + len(anchor))
    bk = src.find("[", i + len(anchor))
    if b == -1 or (bk != -1 and bk < b):
        b = bk
    if b == -1:
        return None
    ob, cb = ("{", "}") if src[b] == "{" else ("[", "]")
    depth, j, in_str, esc = 0, b, False, False
    while j < len(src):
        c = src[j]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == ob:
                depth += 1
            elif c == cb:
                depth -= 1
                if depth == 0:
                    return b, j + 1
        j += 1
    return None


def ts_pretty(obj, indent=1):
    """JSON-compatible data as TS object literal matching cities.ts style
    (unquoted keys at entry level is achieved by callers; inner keys quoted)."""
    pad, pad2 = "  " * indent, "  " * (indent + 1)
    if isinstance(obj, dict):
        if not obj:
            return "{}"
        items = ",\n".join(f'{pad2}{k}: {ts_pretty(v, indent + 1)}' for k, v in obj.items())
        return "{\n" + items + "\n" + pad + "}"
    if isinstance(obj, list):
        if not obj:
            return "[]"
        items = ",\n".join(f"{pad2}{ts_pretty(v, indent + 1)}" for v in obj)
        return "[\n" + items + "\n" + pad + "]"
    if isinstance(obj, bool):
        return "true" if obj else "false"
    if obj is None:
        return '""'
    if isinstance(obj, (int, float)):
        return json.dumps(obj)
    return json.dumps(obj)  # string


def load_chunks(slug: str):
    d = CHUNK_DIR / slug
    if not d.is_dir():
        raise SystemExit(f"no chunk dir {d} — child must write chunks first")
    out = {}
    for name in REQUIRED + ("images", "sources"):
        p = d / f"{name}.json"
        if p.exists():
            try:
                data = json.loads(p.read_text())
            except Exception as e:
                raise SystemExit(f"{p.name} is not valid JSON: {e}")
            out[name] = data
    missing = [n for n in REQUIRED if n not in out]
    ov = out.get("overview") or {}
    bad = set(ov) - OVERVIEW_ALLOW
    if bad:
        raise SystemExit(f"overview.json: fields not allowed: {sorted(bad)}")
    bad = (set(out.get("prose") or {}) - PROSE_FIELDS)
    if bad:
        raise SystemExit(f"prose.json: fields not allowed: {sorted(bad)}")
    if "images" in out:
        bad = set(out["images"]) - IMAGE_FIELDS
        if bad:
            raise SystemExit(f"images.json: fields not allowed: {sorted(bad)}")
    for arr_key, label in ARRAY_LABELS.items():
        if arr_key == "sources":
            if "sources" in out and not isinstance(out["sources"].get("sources", []), list):
                raise SystemExit("sources.json: expected an array under 'sources'")
            continue
        if arr_key not in out:
            continue
        v = out[arr_key]
        if isinstance(v, list):
            continue
        if isinstance(v, dict) and label in v and isinstance(v[label], list):
            out[arr_key] = v[label]  # {"localDoulas": [...]} shape → unwrap
            continue
        raise SystemExit(f"{arr_key}.json: expected an array (or object with key '{label}')")
    return out, missing


def scaffold_entry(chunks: dict) -> str:
    ov, prose, img = chunks["overview"], chunks["prose"], chunks.get("images", {})
    # 2026-10-16 council RC2 (scaffold leg): doulas.json is dict-wrapped
    # {"localDoulas": [...]} — the old code wrote [] for every new city,
    # guaranteeing the S4 preflight fail downstream. Unwrap before use.
    doulas_raw = chunks["doulas"]
    if isinstance(doulas_raw, dict):
        doulas = doulas_raw.get("localDoulas") or []
    elif isinstance(doulas_raw, list):
        doulas = doulas_raw
    else:
        doulas = []
    places = chunks["places"] if isinstance(chunks["places"], dict) else {}
    faqs = chunks["faqs"] if isinstance(chunks["faqs"], list) else []
    sources = (chunks.get("sources") or {}).get("sources", [])
    entry_order = [
        ("enableBlogResources", ov.get("enableBlogResources", True)),
        ("publishedDate", ov.get("publishedDate")),
        ("city", ov["city"]), ("state", ov["state"]), ("slug", ov["slug"]),
        ("costLow", ov["costLow"]), ("costHigh", ov["costHigh"]),
        ("shelbiServesHere", ov.get("shelbiServesHere", False)),
        ("lat", ov.get("lat")), ("lng", ov.get("lng")),
        ("ogImage", img.get("ogImage")), ("heroImage", img.get("heroImage")),
        ("supportSceneImage", img.get("supportSceneImage")),
        ("supportSceneAlt", img.get("supportSceneAlt")),
        ("localDoulas", doulas),
        ("culture", prose["culture"]),
        ("heroLocalDetail", prose["heroLocalDetail"]),
        ("hospitalDetails", places.get("hospitalDetails", [])),
        ("birthCenterDetails", places.get("birthCenterDetails", [])),
        ("medicaidNote", prose["medicaidNote"]),
        ("insuranceNote", prose["insuranceNote"]),
        ("faqs", faqs),
    ]
    if ov.get("birthStats"):
        entry_order.append(("birthStats", ov["birthStats"]))
    if ov.get("nearbyCities"):
        entry_order.append(("nearbyCities", ov["nearbyCities"]))
    if ov.get("titleTag"):
        entry_order.append(("titleTag", ov["titleTag"]))
    if ov.get("metaDescription"):
        entry_order.append(("metaDescription", ov["metaDescription"]))
    if sources:
        entry_order.append(("sources", sources))
    body = ",\n".join(
        f"    {k}: {ts_pretty(v, 2)}" for k, v in entry_order if v is not None
    )
    return '  "' + ov["slug"] + '": {\n' + body + '\n  }'


def apply_to_entry(entry: str, chunk_key: str, label: str, value) -> str:
    ab = find_block(entry, f"{label}:") or find_block(entry, f'"{label}":')
    if not ab:
        raise SystemExit(f"entry lacks a `{label}:` block; scaffold first")
    s, e = ab
    return entry[:s] + f"{label}: " + ts_pretty(value, 2) + entry[e:]


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        raise SystemExit(2)
    slug, check = sys.argv[1], "--check" in sys.argv
    if not re.fullmatch(r"[a-z0-9-]+", slug):
        raise SystemExit(f"bad slug: {slug}")
    chunks, missing = load_chunks(slug)
    entry, b0, b1, block, orig_entry = None, None, None, None, None

    src = CITIES.read_text()
    anchor = f'"{slug}":'
    block = find_block(src, anchor)
    if not block and missing:
        # scaffold (new city) demands the complete chunk set; updates don't
        raise SystemExit(f"missing required chunks for new city {slug}: {', '.join(missing)}")
    if block:
        b0, b1 = block
        orig_entry = src[b0:b1]
        entry = src[b0:b1]
        ch: list = []
        for label, holder_key, val_key in (
            ("localDoulas", "doulas", "doulas"),
            ("hospitalDetails", "places", "hospitalDetails"),
            ("birthCenterDetails", "places", "birthCenterDetails"),
            ("faqs", "faqs", "faqs"),
        ):
            if holder_key not in chunks:
                continue  # partial update: this chunk was not provided
            holder = chunks[holder_key]
            if isinstance(holder, dict):
                val = holder.get(val_key)
                if val is None and isinstance(holder.get(label), list):
                    val = holder[label]  # wrapped chunk keyed by TS label (e.g. {"localDoulas":[...]}) — council fix 10/16, sandbox-proven
            elif isinstance(holder, list):
                val = holder  # bare-list shape (after unwrap)
            else:
                val = None
            if val is None:
                continue
            entry = apply_to_entry(entry, holder_key, label, val)
            ch.append(label)
        # scalar overrides from overview.json + images.json (existing entry only)
        for field, val in {**{k: v for k, v in (chunks.get("overview") or {}).items()
                             if k in OVERVIEW_SCALARS},
                           **(chunks.get("images") or {}),
                           **{k: v for k, v in (chunks.get("prose") or {}).items()
                              if isinstance(v, str)}}.items():
            m = re.search(rf'({field}\s*:\s*)("[^"\n]*"|-?\d+\.?\d*|true|false)', entry)
            if m:
                entry = entry[:m.start()] + m.group(1) + ts_pretty(val) + entry[m.end():]
                ch.append(field)
        new_entry = entry
        mode = "updated existing entry"
    else:
        new_entry = scaffold_entry(chunks)
        mode = "scaffolded NEW entry"
        ch = ["full entry"]

    if block and new_entry == orig_entry:
        print("no changes needed")
        return
    if block:
        out = src[:b0] + new_entry + src[b1:]
    else:
        # insert before the cities object's closing `};` (its last occurrence
        # before `export const citySlugs`)
        i = src.find("export const citySlugs")
        close = src.rfind("};", 0, i)
        if close == -1:
            raise SystemExit("could not locate cities object close brace")
        ins = new_entry.rstrip() + "\n" if src[close - 1] == "\n" else "\n" + new_entry.rstrip() + "\n"
        out = src[:close] + ins.rstrip() + "\n" + src[close:]

    # Sanity: braces/brackets stay internally balanced (a scaffold legitimately
    # ADDs pairs for the new entry, so compare open vs close inside each file,
    # not old-file counts vs new-file counts).
    if out.count("{") != out.count("}") or out.count("[") != out.count("]"):
        raise SystemExit("brace/bracket imbalance — refusing to write")

    if check:
        print("CHECK OK —", mode + ":", ", ".join(ch))
        return
    CITIES.write_text(out)
    print(f"applied to cities.ts: {slug} -> {mode}: " + ", ".join(ch))
    print("next: npx tsx scripts/validate-city-data.ts " + slug + " && npm run build")


if __name__ == "__main__":
    main()