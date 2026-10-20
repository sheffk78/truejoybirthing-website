#!/usr/bin/env python3
"""TJB city image step — pipeline infrastructure (not lane content work).

Generates the standard per-city image set for a city slug and stamps the
image fields into the cities.ts data entry. Deterministic; safe to re-run.

Usage: python3 scripts/tjb-image-step.py <slug>

Outputs (standard fields, matching current 184-entry conventions):
  public/images/{slug}-birth-doula-hero-v1.webp      (watercolor hero, 1200x800)
  public/images/{slug}-birth-doula-support-v1.webp   (watercolor support scene)
  public/images/og-city-{slug}.webp                  (branded OG, 1200x630)
  artifacts/city-chunks/{slug}/images.json           (provenance manifest)
"""
import json
import base64
import subprocess
import sys
import os
import re
from pathlib import Path

REPO = Path("/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website")
KEY_FILE = Path("/Users/socializerender/.hermes/secrets/openrouter-keys.txt")
TS_REL = "src/data/cities.ts"

HERO_TEMPLATE = ("Soft watercolor-style illustration of {scene}, warm cream background (#FAF8F5), "
                 "muted rose and lavender accents (#D8A0C4, #EDE5F5), gentle calm mood, maternal "
                 "healthcare warmth, no text in image, 3:2 landscape composition, watercolor "
                 "illustration style, no photo-realism, no blue palette")

# Per-scene prompts keyed by city (extend as new cities enter the loop)
SCENES = {
    "orange-ca": {
        "hero": "Historic Old Towne Orange California plaza circle with a stone fountain, "
                "orange trees and brick storefronts in warm morning light, small-city main street character",
        "support": "A calm birth support scene — a doula gently supporting an expectant mother "
                   "seated by a bright window with soft morning light, cozy warm home interior",
    },
}

DEFAULT_HERO = ("charming downtown main street with mature trees and warm storefronts")
DEFAULT_SUPPORT = ("A calm birth support scene — a doula gently supporting an expectant mother "
                   "seated by a bright window with soft morning light")


def _key() -> str:
    line = subprocess.run(["sed", "-n", "6p", str(KEY_FILE)],
                          capture_output=True, text=True).stdout.strip()
    if not line:
        raise SystemExit("openrouter key missing at line 6 of " + str(KEY_FILE))
    return line


def gen_image(model_scene: str, out_path: Path, size: tuple, min_kb: int = 30) -> str:
    """Generate one watercolor image via OpenRouter; crop/resize to `size`. Returns error or ''."""
    payload = json.dumps({
        "model": "google/gemini-3.1-flash-image",
        "messages": [{"role": "user", "content": HERO_TEMPLATE.format(scene=model_scene)}],
        "modalities": ["image", "text"],
    }).encode()
    r = subprocess.run(["curl", "-s", "--max-time", "380",
                        "https://openrouter.ai/api/v1/chat/completions",
                        "-H", f"Authorization: Bearer {_key()}",
                        "-H", "Content-Type: application/json", "-d", payload],
                       capture_output=True, text=True)
    try:
        d = json.loads(r.stdout)
    except Exception:
        return f"bad response: {r.stdout[:120]}"
    if "error" in d:
        return str(d["error"])[:150]
    msg = (d.get("choices") or [{}])[0].get("message", {})
    images = msg.get("images") or []
    if not images:
        return "no images in response"
    b64 = images[0]["image_url"]["url"].split(",", 1)[-1]
    raw = base64.b64decode(b64)
    raw_path = Path("/tmp") / (out_path.stem + "_raw.jpg")
    raw_path.write_bytes(raw)
    from PIL import Image
    img = Image.open(raw_path).convert("RGB")
    tw, th = size
    target = tw / th
    w, h = img.size
    if w / h > target:
        nw = int(h * target); x = (w - nw) // 2; img = img.crop((x, 0, x + nw, h))
    else:
        nh = int(w / target); y = (h - nh) // 2; img = img.crop((0, y, w, y + nh))
    img = img.resize(size, Image.LANCZOS)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "WEBP", quality=90, method=6)
    kb = out_path.stat().st_size // 1024
    if kb < min_kb:
        return f"generated but too small ({kb}KB)"
    print(f"  generated {out_path.name} ({kb}KB)")
    return ""


def stamp_fields(slug: str, fields: dict) -> int:
    """Add/replace image fields on the slug's cities.ts entry. Returns count stamped.

    Strategy: find the entry's OPEN line and its CLOSE line (the first following
    line that starts with exactly 2 spaces + '}'), preserve the close line
    VERBATIM (it may carry the map terminator, e.g. '  },};'), and insert
    fields immediately before that line. No brace arithmetic — nothing can
    be duplicated or dangled.
    """
    ts_path = REPO / TS_REL
    src = ts_path.read_text()
    m = re.search(r'"' + re.escape(slug) + r'": \{', src)
    if not m:
        raise SystemExit(f"slug {slug} not found in {TS_REL}")
    start = m.start()
    open_line_end = src.find("\n", start) + 1
    # scan forward for the close line: starts with '  }' at exactly 2-space indent
    close_line_start = None
    i = open_line_end
    while i < len(src):
        line_end = src.find("\n", i)
        if line_end == -1:
            line_end = len(src)
        line = src[i:line_end]
        if line.startswith("  }"):
            close_line_start = i
            break
        if line.startswith("};") or line.startswith("export "):
            raise SystemExit(f"entry close line not found for {slug} (malformed file?)")
        i = line_end + 1
    if close_line_start is None:
        raise SystemExit(f"entry close line not found for {slug}")
    close_line = src[close_line_start:line_end]  # verbatim: '  },' or '  },};'
    after = src[line_end:]  # starts with '\n' (or EOF)
    body = src[start:close_line_start]  # entry WITHOUT its close line

    for field, value in fields.items():
        pat = re.compile(field + r': "[^"]*"')
        if pat.search(body):
            body = pat.sub(f'{field}: "{value}"', body, count=1)
    missing = [f for f in fields if not re.search(f + r': "', body)]
    if missing:
        add_body = body.rstrip()
        if not add_body.endswith("{"):
            add_body += ","
        addition = ",\n".join(f'    {f}: "{fields[f]}"' for f in missing)
        body = add_body + "\n" + addition

    new_src = src[:start] + body.rstrip() + "\n" + close_line.strip("\n") + after
    if not new_src.endswith("\n") and after == "":
        new_src += "\n"
    # syntax gate: only write if the composed file parses
    tmp_ts = REPO / "src/data/cities.stampcheck.ts"
    tmp_ts.write_text(new_src)
    chk = subprocess.run(["npx", "esbuild", "src/data/cities.stampcheck.ts",
                          "--loader:.ts=ts"], capture_output=True, cwd=REPO)
    tmp_ts.unlink()
    if chk.returncode != 0:
        Path("/tmp/stampfailed.ts").write_text(new_src)
        raise SystemExit("stamp_fields would break cities.ts parse: "
                         + chk.stderr.decode()[-250:])
    ts_path.write_text(new_src)
    return len(fields)


def main(slug: str) -> int:
    print(f"== TJB image step: {slug}")
    scenes = SCENES.get(slug, {})
    hero_scene = scenes.get("hero", DEFAULT_HERO)
    support_scene = scenes.get("support", DEFAULT_SUPPORT)

    city_name = slug.rsplit("-", 1)[0].replace("-", " ").title()
    og_path = REPO / f"public/images/og-city-{slug}.webp"
    if not og_path.exists():
        print("  OG: generating via scripts/generate-og.py")
        t1, t2 = f"{city_name} Birth Doulas", f"Doula support in {city_name}, CA"
        r = subprocess.run([sys.executable, str(REPO / "scripts/generate-og.py"),
                            slug, t1, t2],
                           capture_output=True, text=True)
        gen_out = REPO / f"public/images/og-{slug}.webp"
        if gen_out.exists():
            import shutil
            shutil.copyfile(gen_out, og_path)
            arch = REPO / "archive"
            arch.mkdir(exist_ok=True)
            os.replace(gen_out, arch / gen_out.name)  # keep original out of public/
        elif og_path.exists():
            pass
        else:
            print("  OG gen failed:", r.stdout[-300:], r.stderr[-200:])
            return 1
    else:
        print("  OG: exists")

    images = {}
    hero = REPO / f"public/images/{slug}-birth-doula-hero-v1.webp"
    if hero.exists():
        images["heroImage"] = f"/images/{hero.name}"
        print("  hero: exists")
    else:
        err = gen_image(hero_scene, hero, (1200, 800))
        if err:
            print("  HERO FAILED:", err)
            return 1
        images["heroImage"] = f"/images/{hero.name}"

    support = REPO / f"public/images/{slug}-birth-doula-support-v1.webp"
    if support.exists():
        images["supportSceneImage"] = f"/images/{support.name}"
        print("  support: exists")
    else:
        err = gen_image(support_scene, support, (1200, 800))
        if err:
            print("  SUPPORT FAILED:", err)
            return 1
        images["supportSceneImage"] = f"/images/{support.name}"

    images["ogImage"] = f"https://truejoybirthing.com/images/og-city-{slug}.webp"

    n = stamp_fields(slug, images)
    print(f"  stamped {n} fields into cities.ts entry")

    chunk_dir = REPO / f"artifacts/city-chunks/{slug}"
    chunk_dir.mkdir(parents=True, exist_ok=True)
    (chunk_dir / "images.json").write_text(json.dumps({
        "slug": slug, "generated_by": "tjb-image-step.py", "files": images, "scenes": scenes,
    }, indent=2))
    print("  manifest: artifacts/city-chunks/" + slug + "/images.json")

    # syntax gate: cities.ts must still parse after stamping
    g = subprocess.run(["npx", "esbuild", "src/data/cities.ts", "--loader:.ts=ts"],
                       capture_output=True, cwd=REPO)
    if g.returncode != 0:
        print("  CITIES.TS PARSE FAILED after stamp:", g.stderr.decode()[-300:])
        return 1
    print("  cities.ts parse: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "orange-ca"))