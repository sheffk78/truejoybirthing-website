#!/usr/bin/env python3
"""Re-render city OG images that shipped with black letterbox bars (R45 violation).

Root cause: OG compositions were rendered from source photos that were
letterboxed (pad-to-3:2 with black bars). Compositions never got re-rendered
after the underlying hero photos were fixed (cropped, not padded). G65 only
checks hero + supportScene files, never the ogImage, so this drifted silently.

Fix per city:
  1. Resolve the city's CURRENT hero from cities.ts (clean, G65-passing).
  2. Patch the composition's right-column <img> to that hero (file:// URL).
  3. Render at 1200x630 with render-og-max.cjs under a NEW cache-bust name
     (vN+1, or -v2 when unsuffixed).
  4. Pixel-verify: no pure-black horizontal bands in the photo column,
     rose accent bars + light left panel still present.
  5. Only keep output that passes; update ogImage in cities.ts.

Usage: python3 scripts/rerender-barred-ogs.py            # all known-bad cities
       python3 scripts/rerender-barred-ogs.py slug [slug]  # subset
"""
import os, re, sys, subprocess, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
from PIL import Image
import numpy as np

REPO = os.path.join(ROOT, 'public/images')
SCRIPTS = os.path.join(ROOT, 'scripts')
CITIES_TS = os.path.join(ROOT, 'src/data/cities.ts')

# slug -> currently-referenced OG file (live in cities.ts, letterboxed)
CITIES = {
    'baltimore-md': 'og-city-baltimore-md-v2.webp',
    'chicago-il': 'og-city-chicago-il-v5.webp',
    'detroit-mi': 'og-city-detroit-mi-v2.webp',
    'gainesville-fl': 'og-city-gainesville-fl.webp',
    'gaithersburg-md': 'og-city-gaithersburg-md.webp',
    'glendale-ca': 'og-city-glendale-ca-v2.webp',
    'huntington-beach-ca': 'og-city-huntington-beach-ca-v2.webp',
    'long-beach-ca': 'og-city-long-beach-ca-v2.webp',
    'melissa-tx': 'og-city-melissa-tx.webp',
    'naperville-il': 'og-city-naperville-il-v2.webp',
    'newark-nj': 'og-city-newark-nj.webp',
    'philadelphia-pa': 'og-city-philadelphia-pa-v4.webp',
    'rancho-cucamonga-ca': 'og-city-rancho-cucamonga-ca-v2.webp',
    'st-augustine-fl': 'og-city-st-augustine-fl.webp',
    'stockton-ca': 'og-city-stockton-ca.webp',
    'yonkers-ny': 'og-city-yonkers-ny-v2.webp',
    'fate-tx': 'og-city-fate-tx.webp',
}

def find_runs(dark, minlen=3):
    out, start = [], None
    n = len(dark)
    for i in range(n):
        if dark[i] and start is None:
            start = i
        elif not dark[i] and start is not None:
            if i - start >= minlen:
                out.append((start, i - 1))
            start = None
    if start is not None and n - start >= minlen:
        out.append((start, n - 1))
    return out

def og_bars(path):
    """Pure-black horizontal bands measured separately in left panel / right photo column.

    Only bands adjacent to the card edges count as pad bars: within 12px of
    the rose accent bars (top: start <= 12; bottom: end >= H-12). Interior
    dark bands are silhouette photo content (railings etc.) and pass.
    """
    im = Image.open(path).convert('RGB')
    a = np.asarray(im, dtype=np.int32)
    lum = np.asarray(im.convert('L'), dtype=np.int32)
    H, W = lum.shape
    x0 = int(W * 0.55)
    problems = []
    for label, sl in [('left', slice(0, x0 - 10)), ('right', slice(x0, W))]:
        band = a[:, sl]
        rowmax = band.max(axis=(1, 2))
        rowstd = lum[:, sl].std(axis=1)
        runs = find_runs((rowmax < 12) & (rowstd < 6))
        edge_runs = [r for r in runs if r[0] <= 12 or r[1] >= H - 12]
        if edge_runs:
            problems.append(f"{label} rows={edge_runs}")
    return problems

def og_template_ok(path):
    """Loose G64 sanity: rose accent bars top+bottom, light left panel."""
    im = Image.open(path).convert('RGB')
    a = np.asarray(im, dtype=np.int32)
    W, H = im.size
    rose = np.array([216, 160, 196])
    top = a[0:4, :]; bot = a[H-4:H, :]
    dtop = np.abs(top.astype(int) - rose).sum(axis=2).mean()
    dbot = np.abs(bot.astype(int) - rose).sum(axis=2).mean()
    left_lum = np.asarray(Image.open(path).convert('L'), dtype=np.int32)[:, :600]
    light_frac = float((left_lum.mean() > 150))
    return dtop < 150 and dbot < 150 and light_frac > 0.5, (dtop, dbot, left_lum.mean())

def hero_for_slug(slug):
    src = open(CITIES_TS).read()
    m = re.search(r'"%s":\s*\{' % re.escape(slug), src)
    if not m:
        return None
    seg = src[m.end():m.end() + 3000]
    h = re.search(r'heroImage:\s*"([^"]+)"', seg)
    return h.group(1) if h else None

def bump_og_name(fname):
    base = fname[:-len('.webp')]
    m = re.search(r'-v(\d+)$', base)
    if m:
        n = int(m.group(1)) + 1
        return f"{base[:m.start()]}-v{n}.webp"
    return f"{base}-v2.webp"

def render(slug, og_name, hero_path, comp_src_path, tmp_comp):
    html = open(comp_src_path).read()
    # Replace ONLY the right-column image source (inside .right-column div)
    def repl(m):
        return f'{m.group(1)}file://{hero_path}{m.group(3)}'
    new_html, n = re.subn(
        r'(<div class="right-column">\s*<img src=")([^"]+)(")',
        repl, html, count=1)
    if n != 1:
        return None, f"composition right-column img not found ({n} matches)"
    open(tmp_comp, 'w').write(new_html)
    out_base = og_name[:-len('.webp')]
    r = subprocess.run(
        ['node', os.path.join(SCRIPTS, 'render-og-max.cjs'),
         os.path.basename(tmp_comp), out_base],
        capture_output=True, text=True, timeout=120)
    out = os.path.join(REPO, og_name)
    if r.returncode != 0 or not os.path.exists(out):
        return None, f"render failed: {r.stderr[-300:]}"
    return out, None

def main():
    slugs = sys.argv[1:] or list(CITIES)
    tmp_comp = os.path.join(SCRIPTS, '_tmp-rerender-composition.html')
    results = []
    for slug in slugs:
        old_og = CITIES.get(slug)
        if not old_og:
            results.append((slug, 'SKIP', f'not in defect list'))
            continue
        hero_rel = hero_for_slug(slug)
        if not hero_rel:
            results.append((slug, 'FAIL', 'no heroImage in cities.ts'))
            continue
        hero_abs = os.path.join(ROOT, 'public', hero_rel.lstrip('/'))
        if not os.path.exists(hero_abs):
            results.append((slug, 'FAIL', f'hero missing: {hero_rel}'))
            continue
        # hero itself must be bar-free
        hb = og_bars_hero(hero_abs)
        if hb:
            results.append((slug, 'FAIL', f'hero itself has bars: {hb}'))
            continue
        comp = os.path.join(SCRIPTS, f'og-city-{slug}-composition.html')
        if not os.path.exists(comp):
            results.append((slug, 'FAIL', 'composition missing'))
            continue
        new_og = bump_og_name(old_og)
        try:
            out, err = render(slug, new_og, hero_abs, comp, tmp_comp)
        except Exception as e:
            out, err = None, str(e)[:200]
        if not out:
            results.append((slug, 'FAIL', err))
            continue
        bars = og_bars(out)
        tmpl, tmpl_stats = og_template_ok(out)
        if bars or not tmpl:
            os.remove(out)
            results.append((slug, 'FAIL', f'bars={bars} template_ok={tmpl} stats={tmpl_stats}'))
            continue
        # update cities.ts ogImage URL (same basename swap)
        src = open(CITIES_TS).read()
        old_url = f'https://truejoybirthing.com/images/{old_og}'
        new_url = f'https://truejoybirthing.com/images/{new_og}'
        if old_url in src:
            src = src.replace(old_url, new_url)
            open(CITIES_TS, 'w').write(src)
            results.append((slug, 'OK', f'{old_og} -> {new_og} ({os.path.getsize(out)}B) cities.ts updated'))
        else:
            results.append((slug, 'PARTIAL', f'{new_og} rendered+verified but old ogImage URL not found in cities.ts'))
    for slug, status, detail in results:
        print(f"{status:8s} {slug}: {detail}")
    ok = sum(1 for _, s, _ in results if s == 'OK')
    print(f"\n{ok}/{len(results)} cities fixed")
    return 0 if ok == len(results) else 1

def og_bars_hero(path):
    """Inset-aware pure-black band check for a normal photo (full-frame).

    Only bands that REACH the top/bottom edge count as pad bars. Interior
    dark bands (railing rails in silhouette) are legitimate photo content
    and must not fail the hero.
    """
    im = Image.open(path).convert('RGB')
    a = np.asarray(im, dtype=np.int32)
    lum = np.asarray(im.convert('L'), dtype=np.int32)
    H, W = a.shape[:2]
    rowmax = a.max(axis=(1, 2)); rowstd = lum.std(axis=1)
    runs = find_runs((rowmax < 12) & (rowstd < 6))
    return [r for r in runs if r[0] <= 2 or r[1] >= H - 3]

if __name__ == '__main__':
    sys.exit(main())