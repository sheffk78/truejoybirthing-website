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

Safety: only edits WITHIN the target city's block; refuses if slug block
not found or a hospital name can't be located. Run validate-cities.ts after.
"""
import json, re, sys

CITIES = "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website/src/data/cities.ts"

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
    # single-line field:  field: "..." ,
    pat = re.compile(rf'(\n\s*{field}: )"((?:[^"\\]|\\.)*)"(,?)')
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

def add_structured(block, hospital, field, value):
    hkey = f'name: "{hospital}"'
    hidx = block.find(hkey)
    if hidx == -1:
        raise SystemExit(f"hospital not found: {hospital}")
    # Walk back to this object's opening brace, then brace-walk (string-aware)
    # to its matching close. Robust against '},', '} ],', '} ,' style variance.
    opener = block.rfind("{", 0, hidx)
    if opener == -1:
        raise SystemExit(f"hospital object opener not found: {hospital}")
    depth, j, in_str = 0, opener, False
    obj_end = None
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
                    obj_end = j
                    break
        j += 1
    if obj_end is None:
        raise SystemExit(f"hospital object end not found: {hospital}")
    if re.search(rf'\b{field}\s*:', block[opener:obj_end]):
        print(f"  skip {field} for {hospital}: already present")
        return block
    v = value.replace("\\", "\\\\").replace('"', '\\"')
    return block[:obj_end] + f', {field}: "{v}" ' + block[obj_end:]

def main():
    payload = json.load(open(sys.argv[1]))
    slug = payload["slug"]
    src = open(CITIES).read()
    start, end = find_block(src, slug)
    block = src[start:end]
    orig_block = block

    for r in payload.get("rewrites", []):
        block = replace_field(block, r["field"], r["text"])
        print(f"  rewrote {r['field']} ({len(r['text'])} chars)")
    if payload.get("newFAQs"):
        block = append_faqs(block, payload["newFAQs"])
        print(f"  appended {len(payload['newFAQs'])} FAQs")
    for sf in payload.get("structured_fields", []):
        block = add_structured(block, sf["hospital"], sf["field"], sf["value"])
        print(f"  {sf['hospital']} <- {sf['field']}")

    if block == orig_block:
        print("NO CHANGES — payload produced no edits")
        return
    src = src[:start] + block + src[end:]
    open(CITIES, "w").write(src)
    print(f"OK: {slug} applied")

if __name__ == "__main__":
    main()