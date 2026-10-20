#!/usr/bin/env python3
"""
TJB post-deploy live probe — added 2026-10-20.

ROOT CAUSE (Pomona/Peoria incident, 2026-10-20): the deploy pipeline
verified HTTP 200s but never the LIVE CONTENT of a page. Result: an
unlisted YouTube video sat embedded on a live, published city page
showing "Video unavailable" to real visitors for days — caught by
Jeff's eye, not by the system. Second miss: a "completed" city build
had zero images because the handoff notes said images were "another
lane's job" and nobody machine-checked the artifact set.

WHAT THIS DOES (continuous-audit layer, runs AFTER every deploy):
  1. Fetches the live HTML of pages changed in the pushed commits
     (cache-busted) plus the newest built city page as fallback.
  2. Verifies like a visitor would:
       - page returns 200 and contains real content
       - every <img> src resolves (200, non-zero, plausibly an image)
       - every YouTube embed's video is publicly playable (YT oEmbed)
  3. Writes evidence to artifacts/live-probe/history.jsonl and prints
     a plain-English verdict.

Exit: 0 = live content verified; 1 = LIVE DEFECT found (report it,
never claim success); 2 = nothing to probe (not a failure).
"""
import json
import re
import subprocess
import sys
import time
import urllib.request
from urllib.error import HTTPError, URLError

BASE_DIR = "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website"
SITE = "https://truejoybirthing.com"
HISTORY = f"{BASE_DIR}/artifacts/live-probe/history.jsonl"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36")
CACHEBUST = str(int(time.time()))


def fetch(url, timeout=20):
    """GET with browser UA, cache-busted; returns (status, body_bytes)."""
    sep = "&" if "?" in url else "?"
    req = urllib.request.Request(f"{url}{sep}v={CACHEBUST}", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read()
    except HTTPError as e:
        return e.code, b""
    except (URLError, TimeoutError, OSError) as e:
        return 0, b""


def pages_from_commits():
    """URLs of city/collection pages touched by the last pushed deploy."""
    try:
        head = subprocess.run(["git", "rev-parse", "HEAD"], cwd=BASE_DIR,
                              capture_output=True, text=True, timeout=15).stdout.strip()
        mirror = subprocess.run(["git", "rev-parse", "origin/main"], cwd=BASE_DIR,
                                capture_output=True, text=True, timeout=15).stdout.strip()
        if mirror and mirror != head:
            rng = f"{mirror}..{head}"
        else:
            # Mirror already caught up: diff from the LAST PROBED commit so the
            # probe always covers exactly the commits deployed since last time.
            since = ""
            try:
                since = open(f"{BASE_DIR}/artifacts/live-probe/last-head.txt").read().strip()
            except Exception:
                pass
            rng = f"{since}..{head}" if since and since != head else "HEAD~12..HEAD"
        files = subprocess.run(["git", "diff", "--name-only", rng], cwd=BASE_DIR,
                               capture_output=True, text=True, timeout=20).stdout.split()
    except Exception:
        files = []
    pages, seen = [], set()

    # Whitelist: only slugs that are REAL published pages. Artifact and
    # asset names ("accuracy-peoria-az", "og-city-peoria-az") must never
    # be probed as pages — that's how false alarms erode trust in a gate.
    try:
        valid = set(re.findall(
            r'"([a-z][a-z-]{1,24}-(?:az|al|ar|ca|co|fl|ga|tx|ma|md|nc|nj|nv|oh|or|pa|sc|tn|ut|va|wa))": \{',
            open(f"{BASE_DIR}/src/data/cities.ts").read()))
        on_disk = {p2.split("/")[-2] for p2 in
                   subprocess.run("ls -d dist/birth-support/*/ 2>/dev/null", shell=True,
                                  capture_output=True, text=True, timeout=20,
                                  cwd=BASE_DIR).stdout.split()}
        valid = (valid & on_disk) if valid else on_disk
    except Exception:
        valid = set()

    def add_slug(slug):
        if slug and slug in valid and slug not in seen:
            seen.add(slug)
            pages.append(f"birth-support/{slug}/")

    for f in files:
        m = re.match(r"src/pages/(birth-support|doula-city|city)/\[(city|slug)\].astro$", f)
        if m:
            continue  # template change = newest built page covers it
        # Slug named in the path (city-chunks/peoria-az/...) — most common case
        g = re.search(r"\b([a-z][a-z-]{1,18}-(?:az|al|ar|ca|co|fl|ga|tx|ma|md|nc|nj|nv|oh|or|pa|sc|tn|ut|va|wa))\b", f)
        if g:
            add_slug(g.group(1))
            continue
        # Shared data file (src/data/cities.ts): find which slugs the
        # diff ACTUALLY touched — read slug headers from changed hunks.
        if f.startswith("src/data/"):
            diff = subprocess.run(
                ["git", "diff", f'{rng}', "--", f, "-U0"],
                cwd=BASE_DIR, capture_output=True, text=True, timeout=30)
            for line in diff.stdout.splitlines():
                h = re.match(r"\+\s+\"([a-z][a-z-]{1,18}-(?:az|al|ar|ca|co|fl|ga|tx|ma|md|nc|nj|nv|oh|or|pa|sc|tn|ut|va|wa))\": \{", line)
                if h:
                    add_slug(h.group(1))
    return pages


def newest_built_city():
    try:
        out = subprocess.run(
            "ls -t dist/birth-support/*/index.html 2>/dev/null | head -1 | "
            "sed 's|dist/||; s|/index.html|/|'",
            shell=True, capture_output=True, text=True, timeout=20, cwd=BASE_DIR).stdout.strip()
        return out or None
    except Exception:
        return None


def yt_playable(video_id):
    """A video real visitors can watch: oEmbed 200 (oEmbed only serves public videos)."""
    url = (f"https://www.youtube.com/oembed?url="
           f"https://www.youtube.com/watch?v={video_id}&format=json")
    code, body = fetch(url, timeout=15)
    if code != 200:
        return False, f"oEmbed {code}"
    try:
        title = json.loads(body).get("title", "")[:60]
        return True, title
    except Exception:
        return True, "oEmbed 200"


def probe_page(path):
    """Probe one live page; returns dict verdict."""
    res = {"page": path, "http": 0, "imgs_checked": 0, "img_failures": [],
           "embeds_checked": 0, "embed_failures": [], "verdict": "FAIL"}
    code, body = fetch(f"{SITE}/{path}")
    res["http"] = code
    if code != 200 or not body:
        res["verdict"] = f"HTTP {code}"
        return res
    html = body.decode("utf-8", "ignore")
    if len(html) < 4000:
        res["verdict"] = "EMPTY PAGE (too little HTML)"
        return res

    # --- images a visitor's browser would load (skip lazy data-URI noise)
    srcs = set()
    for m in re.finditer(r'<img[^>]+src="([^"]+)"', html):
        src = m.group(1)
        if src.startswith("data:") or src.startswith("//"):
            continue
        srcs.add(src)
    for src in sorted(srcs)[:24]:  # cap: first 24 unique images
        if src.startswith("http"):
            img_url = src
        else:
            img_url = f"{SITE}{src}" if src.startswith("/") else f"{SITE}/{path.rstrip('/')}/{src}"
        ic, ib = fetch(img_url, timeout=15)
        res["imgs_checked"] += 1
        if ic != 200:
            res["img_failures"].append(f"{src} -> HTTP {ic}")
        elif len(ib) < 350:
            res["img_failures"].append(f"{src} -> HTTP 200 but only {len(ib)}B (placeholder?)")

    # --- YouTube embeds: the exact defect class caught live 10/20
    for m in re.finditer(r"(?:youtube(?:-nocookie)?\.com/embed/|youtu\.be/)"
                         r"([A-Za-z0-9_-]{11})", html):
        vid = m.group(1)
        res["embeds_checked"] += 1
        ok, note = yt_playable(vid)
        res["videos"] = res.get("videos", [])
        if not ok:
            res["embed_failures"].append(f"{vid}: UNPLAYABLE ({note}) — would show 'Video unavailable' to visitors")
        else:
            res["videos"].append(f"{vid}: {note}")

    res["verdict"] = ("PASS" if not res["img_failures"] and not res["embed_failures"]
                      else "FAIL")
    return res


def main():
    pages = pages_from_commits() or []
    newest = newest_built_city()
    if newest and newest not in pages:
        pages.append(newest)
    if not pages:
        print("→ post-deploy live probe: nothing to probe (no city pages changed)")
        sys.exit(2)

    results = [probe_page(p) for p in sorted(set(pages))]
    ok = all(r["verdict"] == "PASS" for r in results)

    # Evidence travels with the work (build-standard #5): append history line.
    try:
        import os
        os.makedirs(f"{BASE_DIR}/artifacts/live-probe", exist_ok=True)
        head = subprocess.run(["git", "rev-parse", "HEAD"], cwd=BASE_DIR,
                              capture_output=True, text=True, timeout=15).stdout.strip()
        with open(HISTORY, "a") as fh:
            fh.write(json.dumps({"ts": time.strftime("%Y-%m-%d %H:%M:%S %Z"),
                                 "head": head, "ok": ok, "results": results}) + "\n")
        with open(f"{BASE_DIR}/artifacts/live-probe/last-head.txt", "w") as fh2:
            fh2.write(head)
    except Exception as e:
        print(f"  ⚠ could not write probe history: {e}")

    # Plain-English verdict ( Jeff-lane rule: outcomes, not jargon)
    print("")
    print("--- Live content probe (post-deploy) ---")
    for r in results:
        print(f"  → /{r['page']}: HTTP {r['http']}, {r['imgs_checked']} images, "
              f"{r['embeds_checked']} video embed(s) — {r['verdict']}")
        for v in r.get("videos", []):
            print(f"      video: {v}")
        for f in r["img_failures"]:
            print(f"      ❌ image: {f}")
        for f in r["embed_failures"]:
            print(f"      ❌ video: {f}")
    if ok:
        print("  → LIVE CONTENT VERIFIED: pages load, images resolve, videos playable")
        sys.exit(0)
    print("  ❌ LIVE DEFECTS FOUND — do not report this deploy as clean.")
    print("     (This probe exists because the 10/20 Pomona page shipped a")
    print("      dead video embed that only a visitor's eye caught.)")
    sys.exit(1)


if __name__ == "__main__":
    main()