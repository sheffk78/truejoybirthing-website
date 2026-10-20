#!/usr/bin/env python3
"""
TJB fact-drift refresh — added 2026-10-20 (continuous-audit layer).

WHY: 185+ live city pages carry stateful facts (Medicaid rules, hospital
accreditation, "provider still operates"). The 10/20 audit found a WRONG
Medicaid note shipped in a chunk: claim verified at build time can drift
any time. States change rules; providers fold; URLs die.

WHAT: reads every artifacts/handoffs/*/build.json sources[] (claim, url,
quote triples), samples live pages' newest handoffs first, re-verifies:
  - URL still reachable (with browser UA)
  - quote still present in fetched content (normalized whitespace)
Flags drift as findings; never edits pages itself (producer != checker).

Usage:
  python3 scripts/fact-drift-refresh.py            # newest 6 handoffs
  python3 scripts/fact-drift-refresh.py peoria-az  # one city
Output: artifacts/live-probe/fact-drift-<date>.md + stdout summary.
Exit 0 = no drift; 1 = drift found (items listed, human decides); 2 = nothing verified.
"""
import json, os, re, ssl, subprocess, sys, time, urllib.request
from pathlib import Path
from urllib.error import HTTPError, URLError

BASE = Path("/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website")
OUTDIR = BASE / "artifacts/live-probe"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
CTX = ssl.create_default_context()


def fetch_text(url, timeout=25):
    if not url.lower().startswith("http"):
        return None, "non-http url"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
            ctype = r.headers.get("content-type", "")
            data = r.read(400_000)
            if "html" in ctype or "json" in ctype or "text" in ctype or "xml" in ctype:
                return data.decode("utf-8", "ignore"), None
            return f"[BINARY {ctype}]", None
    except HTTPError as e:
        return None, f"HTTP {e.code}"
    except (URLError, TimeoutError, OSError) as e:
        return None, str(e)[:80]


def norm(s):
    # Denoise BOTH sides identically: strip tags + entities, collapse ws.
    # A quote recorded from denoised text must compare against denoised page text.
    s = re.sub(r"<script[\s\S]*?</script>", " ", s or "", flags=re.I)
    s = re.sub(r"<style[\s\S]*?</style>", " ", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    import html as _h
    s = _h.unescape(s)
    return re.sub(r"\s+", " ", s).strip().lower()


def load_triples(limit_slugs=None):
    out = []
    hdir = BASE / "artifacts/handoffs"
    if not hdir.exists():
        return out
    slugs = sorted(hdir.iterdir())
    if limit_slugs:
        slugs = [d for d in slugs if d.name in limit_slugs]
    for d in slugs:
        bj = d / "build.json"
        if not bj.exists():
            continue
        try:
            h = json.load(open(bj))
        except Exception:
            continue
        for s in (h.get("sources") or []):
            if s.get("url") and s.get("quote"):
                out.append({"slug": d.name, "claim": s.get("claim", "")[:90],
                            "url": s["url"], "quote": s["quote"]})
    return out


def main():
    args = sys.argv[1:]
    triples = load_triples(set(args) if args else None)
    if not triples:
        print("no machine-readable sources found — nothing to verify")
        sys.exit(2)
    # Cap total fetches per run (politeness + runtime)
    triples = triples[:18]
    findings, verified = [], 0
    print(f"Verifying {len(triples)} sourced claims against their live sources...\n")
    for t in triples:
        text, err = fetch_text(t["url"])
        if err:
            tag = "SCRIPT-BLOCKED" if "403" in err or "bot" in err.lower() else "UNREACHABLE"
            note = (" (site blocks scripted reads — verify via browser before treating as drift)"
                    if tag == "SCRIPT-BLOCKED" else "")
            findings.append(f"[{tag}] {t['slug']}: {t['url']} -> {err}{note}\n    claim: {t['claim']}")
            continue
        verified += 1
        if norm(t["quote"]) not in norm(text):
            findings.append(
                f"[QUOTE-GONE] {t['slug']}: {t['url']}\n"
                f"    claim: {t['claim']}\n"
                f"    expected quote no longer on page — fact may have drifted")
        time.sleep(0.4)
    OUTDIR.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y-%m-%d")
    report = OUTDIR / f"fact-drift-{stamp}.md"
    lines = [f"# Fact-drift refresh — {time.strftime('%Y-%m-%d %H:%M %Z')}", "",
             f"- Claims verified: {verified}/{len(triples)}", ""]
    if findings:
        lines += ["## Drift findings (human decision needed)", ""]
        lines += [f"- {f}" for f in findings]
    else:
        lines += ["No drift detected in sampled claims."]
    report.write_text("\n".join(lines))
    print(f"\n→ {verified} ok | {len(findings)} findings | report: {report}")
    sys.exit(1 if findings else 0)


if __name__ == "__main__":
    main()
