#!/usr/bin/env python3
"""Apply a Phase-3 differentiation payload to src/data/cities.ts.

Payload shape (from Phase-3 research subagents):
{
  "slug": "gaithersburg-md",
  "rewrites": [{"field": "culture", "text": "..."}, ...],        # full-field replacements
  "newFAQs": [{"q": "...", "a": "..."}],                          # appended to faqs array
  "structured_fields": [{"field": "vbacPolicy", "hospital": "<name>", "value": "..."}],
  "divergence_notes": "..."
}

Field routing for `rewrites`:
  - plain names        → top-level string fields (culture, heroLocalDetail, ...)
  - hospital<Name>     → paragraph of hospitalDetails[i] whose name contains <Name>
  - midwifeInfo.paragraph → midwifeInfo.paragraph (object form; plain string if so)

Structured fields: applied inside the matching hospitalDetails[i] object.
  - Known static keys (nicuLevel, vbacPolicy, doulaPolicy, babyFriendly, ...) →
    inserted as typed optional fields, skipped if already present.
  - dynamic strings (nicuAward, visitingPolicy, ...) → appended to the hospital
    paragraph with provenance so the detail stays honest and human-readable.
  - boolean-typed keys (medicaid, privateRooms, lactation, midwifeFriendly) →
    coerced ("All private..." → true, "No ..." → false).
  - meta fields (hospital, neighborhoods) → dropped (research scaffolding).

Safety: only edits WITHIN the target city's block; refuses if slug block
not found or a hospital name can't be located. Run validate-cities.ts after.
"""
import json, re, sys

CITIES = "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website/src/data/cities.ts"

# Keys defined on interface HospitalDetail (cities.ts) — typed optional fields.
HOSPITAL_TYPED_KEYS = {
    "nicuLevel", "birthVolume", "vbacPolicy", "doulaPolicy", "waterBirth",
    "lactationSupport", "languageAccess", "birthingFacilities", "url",
}
# Boolean-typed keys on HospitalDetail.
HOSPITAL_BOOL_KEYS = {"medicaid", "lactation", "privateRooms", "midwifeFriendly"}
# Free-text keys whose value reads like prose → append to paragraph instead.
HOSPITAL_PROSE_KEYS = {"babyFriendly"}
# Research-scaffolding fields that don't map to the data model.
HOSPITAL_META_KEYS = {"hospital", "neighborhoods", "address"}
# Everything else (nicuAward, visitingPolicy, ...) → append to paragraph.

def find_block(src, slug):
    key = f'"{slug}": {{'
    start = src.find(key)
    if start == -1:
        raise SystemExit(f"slug block not found: {slug}")
    # walk braces to find matching close
    i = src.find("{", start)
    depth, j = 0, i
    in_str = False
    while j < len(src):
        c = src[j]
        if in_str:
            if c == "\\":
                j += 2
                continue
            if c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return start, j + 1
        j += 1
    raise SystemExit(f"unbalanced braces in block {slug}")

def replace_field(block, field, text):
    # single-line field:  field: "...",
    pat = re.compile(rf'(\n\s*{re.escape(field)}: )"((?:[^"\\]|\\.)*)"(,?)')
    m = pat.search(block)
    if not m:
        raise SystemExit(f"field not found as single line: {field}")
    new_text = text.replace("\\", "\\\\").replace('"', '\\"')
    return pat.sub(lambda mm: f'{mm.group(1)}"{new_text}"{mm.group(3)}', block, count=1)

def find_array_close(src, open_idx):
    """String-aware scan from an opening [ to its matching ]."""
    depth, j, in_str = 0, open_idx, False
    while j < len(src):
        c = src[j]
        if in_str:
            if c == "\\":
                j += 2
                continue
            if c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    return j
        j += 1
    return -1

def _ts_quote(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

def append_faqs(block, faqs):
    idx = block.find("faqs: [")
    if idx == -1:
        raise SystemExit("faqs array not found")
    arr_open = block.find("[", idx)
    close = find_array_close(block, arr_open)
    if close == -1:
        raise SystemExit("faqs array not closed")
    items = ",\n".join(
        f'      {{ q: "{_ts_quote(f["q"])}", a: "{_ts_quote(f["a"])}" }}'
        for f in faqs
    )
    interior = block[arr_open + 1:close]
    if not interior.strip():
        # empty array: no leading comma
        return block[:close] + items + block[close:]
    # non-empty: insert immediately before the closing bracket — the last
    # element already ends with `}` there, so prepend ",\n". NEVER search
    # for a comma: answers contain commas inside strings.
    return block[:close] + ",\n" + items + block[close:]

def find_hospital_obj(block, hospital):
    """Locate hospitalDetails[i] by name substring; return (opener, closer) indices."""
    hidx = block.find("hospitalDetails")
    if hidx == -1:
        raise SystemExit(f"hospitalDetails not found in block")
    # scan for each hospital object's name field within the array
    pos = block.find("[", hidx)
    arr_close = find_array_close(block, pos)
    search = 0
    while True:
        m = re.compile(r'name: "((?:[^"\\]|\\.)*)"').search(block, pos, arr_close)
        if not m:
            break
        if hospital.lower() in m.group(1).lower():
            opener = block.rfind("{", 0, m.start())
            depth, j, in_str = 0, opener, False
            while j < len(block):
                c = block[j]
                if in_str:
                    if c == "\\":
                        j += 2
                        continue
                    if c == '"':
                        in_str = False
                else:
                    if c == '"':
                        in_str = True
                    elif c == "{":
                        depth += 1
                    elif c == "}":
                        depth -= 1
                        if depth == 0:
                            return opener, j
                j += 1
            raise SystemExit(f"hospital object end not found: {hospital}")
        pos = m.end()
    raise SystemExit(f"hospital not found: {hospital}")

def replace_hospital_paragraph(block, hospital, text):
    opener, closer = find_hospital_obj(block, hospital)
    obj = block[opener:closer + 1]
    pat = re.compile(r'(paragraph: )"((?:[^"\\]|\\.)*)"')
    if not pat.search(obj):
        raise SystemExit(f"paragraph not found for {hospital}")
    new_text = text.replace("\\", "\\\\").replace('"', '\\"')
    obj_new = pat.sub(lambda mm: f'{mm.group(1)}"{new_text}"', obj, count=1)
    return block[:opener] + obj_new + block[closer + 1:]

def add_structured(block, hospital, field, value):
    # meta fields: research scaffolding, not part of the data model
    if field in HOSPITAL_META_KEYS:
        print(f"  drop {field} for {hospital} (meta field)")
        return block
    opener, closer = find_hospital_obj(block, hospital)
    obj = block[opener:closer + 1]
    if re.search(rf'\b{field}\s*:', obj):
        print(f"  skip {field} for {hospital}: already present")
        return block
    # boolean-typed keys: coerce natural language to true/false
    if field in HOSPITAL_BOOL_KEYS:
        v = "true" if not re.match(r'(?i)^\s*(no|not|none|false)\b', value) else "false"
        return block[:closer] + f', {field}: {v} ' + block[closer:]
    # known typed string keys → direct field insertion
    if field in HOSPITAL_TYPED_KEYS:
        v = _ts_quote(value)
        return block[:closer] + f', {field}: "{v}" ' + block[closer:]
    # everything else: append to the paragraph as provenance-carrying prose
    pat = re.compile(r'(paragraph: )"((?:[^"\\]|\\.)*)"')
    m = pat.search(obj)
    if not m:
        raise SystemExit(f"paragraph not found for {hospital}")
    extra = value.strip().rstrip(".")
    existing = m.group(2)
    merged = existing.rstrip() + f' {extra}.'
    obj_new = obj[:m.start()] + f'paragraph: "{_ts_quote(merged)}"' + obj[m.end():]
    return block[:opener] + obj_new + block[closer + 1:]

def main():
    payload = json.load(open(sys.argv[1]))
    slug = payload["slug"]
    src = open(CITIES).read()
    start, end = find_block(src, slug)
    block = src[start:end]
    orig_block = block

    for r in payload.get("rewrites", []):
        f = r["field"]
        if f.startswith("hospital") and f != "hospitalDetails":
            # hospital<Name> → paragraph rewrite of the matching hospital
            rest = f[len("hospital"):]
            # CamelCase name → match flexibly against hospital names
            block = replace_hospital_paragraph_fuzzy(block, rest, r["text"])
            print(f"  rewrote {f} -> hospital paragraph ({len(r['text'])} chars)")
        elif "." in f:
            # dotted path, e.g. midwifeInfo.paragraph
            parent, leaf = f.split(".", 1)
            block = replace_dotted(block, parent, leaf, r["text"])
            print(f"  rewrote {f} ({len(r['text'])} chars)")
        else:
            block = replace_field(block, f, r["text"])
            print(f"  rewrote {f} ({len(r['text'])} chars)")
    if payload.get("newFAQs"):
        block = append_faqs(block, payload["newFAQs"])
        print(f"  appended {len(payload['newFAQs'])} FAQs")
    for sf in payload.get("structured_fields", []):
        before = block
        block = add_structured(block, sf["hospital"], sf["field"], sf["value"])
        if block is not before and sf["field"] not in HOSPITAL_META_KEYS:
            print(f"  {sf['hospital']} <- {sf['field']}")

    if block == orig_block:
        print("NO CHANGES — payload produced no edits")
        return
    src = src[:start] + block + src[end:]
    open(CITIES, "w").write(src)
    print(f"OK: {slug} applied")

def replace_hospital_paragraph_fuzzy(block, nameish, text):
    """Map payload field hospitalShadyGrove → hospital whose name contains 'Shady Grove'."""
    # de-CamelCase: insert space before capitals+digit runs
    spaced = re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', nameish)
    # try whole phrase first, then each token
    tokens = [spaced.strip(), *spaced.split()]
    for token in tokens:
        if len(token) < 4:
            continue
        try:
            return replace_hospital_paragraph(block, token, text)
        except SystemExit:
            continue
    raise SystemExit(f"no hospital matches rewrite field: hospital{nameish}")

def replace_dotted(block, parent, leaf, text):
    """Replace parent.leaf string value; parent may be inline object or quoted scalar."""
    if leaf == "paragraph":
        # midwifeInfo is declared as `midwifeInfo: {...}` (object) or `midwifeInfo: "..."` (scalar)
        m = re.compile(rf'(\n\s*{parent}: ){{').search(block)
        if m:
            # inline object: replace leaf inside it
            i = m.end() - 1
            depth, j, in_str = 0, i, False
            while j < len(block):
                c = block[j]
                if in_str:
                    if c == "\\":
                        j += 2
                        continue
                    if c == '"':
                        in_str = False
                else:
                    if c == '"':
                        in_str = True
                    elif c == "{":
                        depth += 1
                    elif c == "}":
                        depth -= 1
                        if depth == 0:
                            break
                j += 1
            obj = block[i:j + 1]
            pat = re.compile(rf'({leaf}: )"((?:[^"\\]|\\.)*)"')
            if not pat.search(obj):
                raise SystemExit(f"{parent}.{leaf} not found")
            new_text = text.replace("\\", "\\\\").replace('"', '\\"')
            obj_new = pat.sub(lambda mm: f'{mm.group(1)}"{new_text}"', obj, count=1)
            return block[:i] + obj_new + block[j + 1:]
        m2 = re.compile(rf'(\n\s*{parent}: )"((?:[^"\\]|\\.)*)"').search(block)
        if m2:
            new_text = text.replace("\\", "\\\\").replace('"', '\\"')
            return block[:m2.start()] + f'{m2.group(1)}"{new_text}"' + block[m2.end():]
        raise SystemExit(f"parent not found: {parent}")
    raise SystemExit(f"unsupported dotted path: {parent}.{leaf}")

if __name__ == "__main__":
    main()