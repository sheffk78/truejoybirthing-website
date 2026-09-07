#!/usr/bin/env python3
"""TJB Phase 4 harness — city-write.py: the ONLY sanctioned write path to cities.ts.

Layer 3 (purpose-built tools): "The system prompt isn't our security boundary.
The capability simply isn't available." Workers calling this tool CANNOT corrupt
the file — the recurring quote/backslash/duplicate-key corruption class dies here.

What every write enforces (fail-closed, atomic):
  1. The payload must be valid JSON (workers express data, not TS syntax).
  2. Rendered TS block is parsed back via node before touching the file
     (unquoted-key TS object literal — JSON escaping handles quotes/backslashes).
  3. Duplicate-key scan on the rendered block (scanner from failure-library.py).
  4. Slug discipline: create refuses an existing slug; update/replace requires it.
  5. Whole-file post-parse: the edited cities.ts block re-extracts + parses.
  6. Atomic write: temp file in the same dir + os.replace (no partial files).
  7. A .bak snapshot of the previous file is left next to the tool's artifacts.

Commands:
  python3 scripts/city-write.py check <slug>
      Validate the current block (parse + dup keys). Exit 0 clean.
  python3 scripts/city-write.py set-field <slug> <field> --value '<json>'
      Set one scalar/nested field on an existing block (value parsed as JSON).
  python3 scripts/city-write.py write-block <slug> --from <block.json>
      Create or fully replace a city block from a JSON file (flat object).

Exit codes: 0 ok | 1 refused (validation — do NOT retry identical input) |
2 infra (node missing etc.) | 3 fatal (file-level problem, pipeline block).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
CITIES_TS = PROJECT_DIR / "src" / "data" / "cities.ts"
BACKUP_DIR = PROJECT_DIR / "artifacts" / "city-write-backups"
EXTRACT_SCRIPT = PROJECT_DIR / "scripts" / "extract-city-block.py"

NODE_PARSE_SCRIPT = r"""const o = eval('(' + require('fs').readFileSync(0,'utf8') + ')');
process.stdout.write(JSON.stringify(o))"""

NODE_RENDER_SCRIPT = r"""const o = JSON.parse(require('fs').readFileSync(0,'utf8'));
const render = (v, ind) => {
  if (v === null) return 'null';
  if (Array.isArray(v)) { if (!v.length) return '[]';
    return '[\n' + v.map(x => ind + '\t' + render(x, ind + '\t')).join(',\n') + '\n' + ind + ']'; }
  if (typeof v === 'object') { const ks = Object.keys(v); if (!ks.length) return '{}';
    return '{\n' + ks.map(k => ind + '\t' + k + ': ' + render(v[k], ind + '\t')).join(',\n') + '\n' + ind + '}'; }
  return JSON.stringify(v);
};
process.stdout.write(render(o, ''))"""


NODE_WHOLEFILE_SCRIPT = r"""const fs = require('fs');
const src = fs.readFileSync(0, 'utf8');
const m = src.match(/export const cities[^=]*=\s*\{/);
if (!m) { console.error('cities object not found'); process.exit(1); }
const start = m.index + m[0].length - 1;
let depth = 0, i = start, inStr = null;
while (i < src.length) {
  const ch = src[i];
  if (inStr) { if (ch === '\\') { i += 2; continue; } if (ch === inStr) inStr = null; i++; continue; }
  if (ch === '"' || ch === "'") { inStr = ch; i++; continue; }
  if (ch === '/' && src[i+1] === '/') { const nl = src.indexOf('\n', i); i = nl === -1 ? src.length : nl; continue; }
  if (ch === '/' && src[i+1] === '*') { const e = src.indexOf('*/', i+2); i = e === -1 ? src.length : e+2; continue; }
  if (ch === '{') depth++;
  else if (ch === '}') { depth--; if (depth === 0) break; }
  i++;
}
if (depth !== 0) { console.error('unbalanced braces'); process.exit(1); }
const o = eval('(' + src.slice(start, i+1) + ')');
process.stdout.write(JSON.stringify({ slugs: Object.keys(o).length }))"""


def whole_file_slug_count(ts_text: str) -> int | None:
    """Parse the whole `export const cities = { ... }` object from file text.
    Validates every entry junction, not just one block. None = broken."""
    try:
        r = subprocess.run(["node", "-e", NODE_WHOLEFILE_SCRIPT],
                           input=ts_text, capture_output=True,
                           text=True, timeout=60, cwd=str(PROJECT_DIR))
        if r.returncode == 0 and r.stdout.strip():
            return json.loads(r.stdout).get("slugs")
    except Exception:
        pass
    return None


def fail(code: int, payload: dict) -> int:
    print(json.dumps(payload, indent=2))
    return code


def node_parse(ts_object_text: str) -> dict | None:
    """Parse a TS object literal (unquoted keys OK) via node eval -> JSON."""
    try:
        r = subprocess.run(["node", "-e", NODE_PARSE_SCRIPT],
                           input=ts_object_text, capture_output=True,
                           text=True, timeout=30, cwd=str(PROJECT_DIR))
        if r.returncode == 0 and r.stdout.strip():
            return json.loads(r.stdout)
    except Exception:
        pass
    return None


def render_ts(data: dict) -> str | None:
    """Render a dict as a TS object literal (unquoted keys, tab-indented)."""
    r = subprocess.run(["node", "-e", NODE_RENDER_SCRIPT],
                       input=json.dumps(data), capture_output=True,
                       text=True, timeout=30, cwd=str(PROJECT_DIR))
    if r.returncode != 0:
        return None
    return r.stdout


def load_block_text(slug: str) -> str | None:
    r = subprocess.run(["python3", str(EXTRACT_SCRIPT), slug],
                       capture_output=True, text=True, timeout=30, cwd=str(PROJECT_DIR))
    if r.returncode == 0 and r.stdout.strip():
        return r.stdout.strip()
    return None


def dup_keys_in(text: str) -> dict:
    """Duplicate-key scan via the Phase 2 scanner (failure-library.py)."""
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "failure_library", str(Path(__file__).resolve().parent / "failure-library.py"))
    assert spec is not None and spec.loader is not None
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.scan_dup_keys_text("{" + text + "}")


def locate_block_span(content: str, slug: str):
    """Return (start, end) char span of the slug's block, including the
    leading '  "slug": ' and trailing close brace. None if absent."""
    import re
    m = re.search(r'(?m)^\s*"' + re.escape(slug) + r'"\s*:\s*\{', content)
    if not m:
        return None
    start = m.start()
    brace_open = content.index("{", m.end() - 1)
    depth, i, n = 0, brace_open, len(content)
    in_str = None
    while i < n:
        ch = content[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == in_str:
                in_str = None
            i += 1
            continue
        if ch in ('"', "'"):
            in_str = ch
            i += 1
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                # include the entry's trailing comma (and surrounding
                # whitespace — the corpus puts it on the next line) so the
                # splice emits exactly one comma — no `,\n,` junctions
                j = i + 1
                while j < n and content[j] in " \t\r\n":
                    j += 1
                if j < n and content[j] == ",":
                    j += 1
                return (start, j)
        i += 1
    return None


def write_cities_atomic(new_content: str, slug: str, op: str) -> str:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup = BACKUP_DIR / f"cities-ts-{stamp}-{op}-{slug}.bak"
    shutil.copy2(CITIES_TS, backup)
    tmp = CITIES_TS.with_suffix(".ts.citywrite-tmp")
    tmp.write_text(new_content)
    os.replace(tmp, CITIES_TS)
    return str(backup)


def sha256_of(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


# ------------------------------------------------------------------ commands

def cmd_check(slug: str) -> int:
    if not CITIES_TS.exists():
        return fail(3, {"error": "cities.ts missing (fatal)"})
    block = load_block_text(slug)
    if not block:
        return fail(1, {"action": "check_failed", "slug": slug,
                        "error": f"no block for '{slug}' (does the city exist?)"})
    parsed = node_parse(block)
    if parsed is None:
        return fail(1, {"action": "check_failed", "slug": slug,
                        "error": "block does not parse (corruption?)"})
    dups = dup_keys_in(block)
    if dups:
        return fail(1, {"action": "check_failed", "slug": slug,
                        "error": f"duplicate keys: {sorted(dups)}"})
    return fail(0, {"action": "check_ok", "slug": slug,
                    "keys": len(parsed),
                    "block_sha": hashlib.sha256(block.encode()).hexdigest()[:16]})


def splice_block(content: str, slug: str, new_block_ts: str, exists: bool) -> str:
    """Replace existing block span or insert before the closing '};' of cities."""
    if exists:
        span = locate_block_span(content, slug)
        if not span:
            raise RuntimeError("block vanished mid-edit")
        return content[:span[0]] + '  "' + slug + '": ' + new_block_ts + "," + content[span[1]:]
    # insert as the last entry before the closing of the cities object
    anchor = content.rindex("};")
    insertion = '  "' + slug + '": ' + new_block_ts + ',\n\n'
    return content[:anchor] + insertion + content[anchor:]


def cmd_write_block(slug: str, from_file: str, create: bool) -> int:
    if not CITIES_TS.exists():
        return fail(3, {"error": "cities.ts missing (fatal)"})
    try:
        payload = json.loads(Path(from_file).read_text())
    except json.JSONDecodeError as e:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": f"payload is not valid JSON: {e}"})
    except OSError as e:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": f"cannot read payload file: {e}"})
    if not isinstance(payload, dict) or not payload:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": "payload must be a non-empty JSON object"})

    content = CITIES_TS.read_text()
    existing = locate_block_span(content, slug) is not None
    if create and existing:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": "slug already exists — use write-block without --create to replace"})
    if not create and not existing:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": "slug does not exist — use --create for a new city"})

    rendered = render_ts(payload)
    if not rendered:
        return fail(2, {"action": "write_infra", "slug": slug,
                        "error": "node failed to render TS literal (infra)"})

    # Post-condition 1: rendered block round-trips through node
    back = node_parse(rendered)
    if back is None or back != payload:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": "rendered block failed round-trip parse (refusing to write)"})

    # Post-condition 2: no duplicate keys in the rendered block
    dups = dup_keys_in(rendered)
    if dups:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": f"payload contains duplicate keys: {sorted(dups)}"})

    # Post-condition 3: whole-file structure survives the splice
    candidate = splice_block(content, slug, rendered, existing)
    span = locate_block_span(candidate, slug)
    if not span:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": "splice failed to place block (refusing)"})
    new_block_text = candidate[span[0]:span[1]]
    _, _, block_body = new_block_text.partition(":")
    if node_parse(block_body.strip().rstrip(",")) is None:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": "spliced block does not parse (refusing)"})

    # Post-condition 3b: the WHOLE file's cities object must parse — catches
    # entry-junction corruption (`,\n,`) that block-level checks cannot see.
    slugs_before = whole_file_slug_count(content)
    slugs_after = whole_file_slug_count(candidate)
    expected_after = (slugs_before + 1) if create else slugs_before
    if slugs_before is None or slugs_after is None or slugs_after != expected_after:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": f"whole-file validation failed (slugs before={slugs_before}, after={slugs_after}, expected={expected_after}) — refusing"})

    backup = write_cities_atomic(candidate, slug, "create" if create else "replace")

    # Post-condition 4: re-read from disk and verify
    final_block = load_block_text(slug)
    if not final_block or node_parse(final_block) is None or dup_keys_in(final_block):
        return fail(3, {"action": "write_fatal", "slug": slug,
                        "error": f"post-write verification failed — restore from {backup}",
                        "backup": backup})

    return fail(0, {
        "action": "write_ok",
        "slug": slug,
        "op": "create" if create else "replace",
        "block_sha": hashlib.sha256(final_block.encode()).hexdigest()[:16],
        "cities_sha": sha256_of(CITIES_TS),
        "backup": backup,
        "next": f"run: npx tsx scripts/preflight.ts {slug}  (gate still applies)",
    })


def cmd_set_field(slug: str, field: str, value_json: str) -> int:
    try:
        value = json.loads(value_json)
    except json.JSONDecodeError as e:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": f"--value is not valid JSON: {e}"})
    block = load_block_text(slug)
    if not block:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": f"no block for '{slug}'"})
    parsed = node_parse(block)
    if parsed is None:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": "existing block does not parse — fix before writing"})
    # dot-path support: costLow | hospitalDetails.0.paragraph
    keys = field.split(".")
    target: object = parsed
    for k in keys[:-1]:
        if isinstance(target, list):
            target = target[int(k)]
        elif isinstance(target, dict):
            target = target[k]
        else:
            return fail(1, {"action": "write_refused", "slug": slug,
                            "error": f"cannot descend into '{field}' (non-container at path)"})
    if isinstance(target, list):
        target[int(keys[-1])] = value
    elif isinstance(target, dict):
        target[keys[-1]] = value
    else:
        return fail(1, {"action": "write_refused", "slug": slug,
                        "error": f"cannot set '{field}' (parent is not a container)"})
    payload_file = PROJECT_DIR / "artifacts" / f"city-write-{slug}-setfield.json"
    payload_file.parent.mkdir(parents=True, exist_ok=True)
    payload_file.write_text(json.dumps(parsed))
    return cmd_write_block(slug, str(payload_file), create=False)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["check", "write-block", "set-field"])
    ap.add_argument("slug")
    ap.add_argument("extra", nargs="?")
    ap.add_argument("--from", dest="from_file")
    ap.add_argument("--value", dest="value")
    ap.add_argument("--create", action="store_true")
    args = ap.parse_args()

    if args.cmd == "check":
        return cmd_check(args.slug)
    if args.cmd == "write-block":
        if not args.from_file:
            return fail(3, {"error": "write-block requires --from <block.json>"})
        return cmd_write_block(args.slug, args.from_file, create=args.create)
    if args.cmd == "set-field":
        if not args.extra or args.value is None:
            return fail(3, {"error": "set-field requires <field> and --value '<json>'"})
        return cmd_set_field(args.slug, args.extra, args.value)
    return fail(3, {"error": "unknown command"})


if __name__ == "__main__":
    sys.exit(main())