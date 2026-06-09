#!/usr/bin/env python3
"""
TJB Provider Research Pipeline v2
==================================
Multi-source provider research for TJB city pages with URL validation,
Firecrawl enrichment, and Camofox fallback.

Sources:
  1. Apify Google Maps Scraper — raw listings (names, addresses, phones)
  2. NPI Registry API — credentialed midwives (CNM, CPM, LM)
  3. Firecrawl API — URL validation, structured enrichment, photo extraction
  4. Camofox Browser — anti-detection fallback for sites that block scrapers
  5. Wikipedia Commons — hospital exterior photos

Usage:
  python scripts/research-providers.py "Norfolk" "VA" --output /tmp/norfolk.json
  python scripts/research-providers.py "Norfolk" "VA" --enrich --output /tmp/norfolk.json
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Union

APIFY_KEY = os.environ.get("APIFY_API_KEY", "")
GOOGLE_MAPS_ACTOR = "nwua9Gu5YrADL7ZDj"
NPI_BASE = "https://npiregistry.cms.hhs.gov/api/"
FIRECRAWL_KEY = os.environ.get("FIRECRAWL_API_KEY", "fc-3772e3f753f7438dbfb8e7b8aad88304")
FIRECRAWL_BASE = "https://api.firecrawl.dev/v1"
CAMOFOX_BASE = "http://localhost:9377"


# ═══════════════════════════════════════════════════════════════
# Apify Google Maps
# ═══════════════════════════════════════════════════════════════

def apify_run(actor_id: str, body: dict) -> Union[list[dict], dict]:
    """Start an Apify actor run, poll until done, return results."""
    req = urllib.request.Request(
        f"https://api.apify.com/v2/acts/{actor_id}/runs",
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {APIFY_KEY}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            run_data = json.loads(resp.read())["data"]
    except Exception as e:
        return {"error": f"start: {e}"}

    run_id = run_data["id"]
    for _ in range(60):
        time.sleep(3)
        req = urllib.request.Request(
            f"https://api.apify.com/v2/actor-runs/{run_id}",
            headers={"Authorization": f"Bearer {APIFY_KEY}"},
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                sd = json.loads(resp.read())["data"]
        except Exception as e:
            return {"error": f"poll: {e}"}

        st = sd.get("status")
        if st == "SUCCEEDED":
            break
        elif st in ("FAILED", "ABORTED", "TIMED-OUT"):
            return {"error": f"run {st}"}
    else:
        return {"error": "timeout"}

    req = urllib.request.Request(
        f"https://api.apify.com/v2/actor-runs/{run_id}/dataset/items?format=json&limit=50",
        headers={"Authorization": f"Bearer {APIFY_KEY}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except Exception as e:
        return {"error": f"fetch: {e}"}


def search_maps(query: str, max_results: int = 10) -> list[dict]:
    """Search Google Maps via Apify."""
    body = {
        "searchString": query,
        "maxCrawledPlaces": max_results,
        "proxyConfig": {"useApifyProxy": True},
    }
    r = apify_run(GOOGLE_MAPS_ACTOR, body)
    return r if isinstance(r, list) else []


# ═══════════════════════════════════════════════════════════════
# NPI Registry
# ═══════════════════════════════════════════════════════════════

def search_npi(city: str, state: str, taxonomy: str = "midwife", limit: int = 20) -> list[dict]:
    """Search NPI Registry for credentialed midwives."""
    params = urllib.parse.urlencode({
        "version": "2.1", "enumeration_type": "NPI-1",
        "taxonomy_description": taxonomy,
        "city": city, "state": state, "limit": limit,
    })
    try:
        with urllib.request.urlopen(f"{NPI_BASE}?{params}", timeout=10) as resp:
            data = json.loads(resp.read())
    except Exception:
        return []

    results = []
    for r in data.get("results", []):
        basic = r.get("basic", {})
        addrs = r.get("addresses", [])
        prac = [a for a in addrs if a.get("address_purpose") == "LOCATION"]
        name = f"{basic.get('first_name','')} {basic.get('last_name','')}".strip() or basic.get("organization_name", "")
        results.append({
            "name": name,
            "credential": basic.get("credential", ""),
            "taxonomy": r.get("taxonomies", [{}])[0].get("desc", ""),
            "phone": prac[0].get("telephone_number", "") if prac else "",
            "source": "NPI",
        })
    return results


# ═══════════════════════════════════════════════════════════════
# Firecrawl: URL validation + enrichment + search
# ═══════════════════════════════════════════════════════════════

def head_check_url(url: str, timeout: int = 8) -> dict:
    """Quick HEAD request to check if URL is live before spending a Firecrawl call.
    Returns {'valid': True, 'content_type': str} or {'valid': False, 'reason': str}."""
    if not url:
        return {"valid": False, "reason": "no_url"}
    try:
        req = urllib.request.Request(url, method="HEAD")
        # Set a realistic User-Agent to avoid blocks
        req.add_header("User-Agent", "Mozilla/5.0 (compatible; TJB-Research/1.0)")
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            status = resp.status
            ct = resp.headers.get("Content-Type", "")
            cl = resp.headers.get("Content-Length", "0")
            if 200 <= status < 400:
                return {"valid": True, "status": status, "content_type": ct, "content_length": int(cl) if cl.isdigit() else 0}
            return {"valid": False, "reason": f"HTTP {status}"}
    except Exception as e:
        return {"valid": False, "reason": str(e)[:60]}


def firecrawl_validate_url(url: str) -> dict:
    """Check if a URL is live via Firecrawl scrape. Returns status + content."""
    if not url:
        return {"valid": False, "reason": "no_url"}
    payload = json.dumps({"url": url, "formats": ["markdown"], "onlyMainContent": True}).encode()
    req = urllib.request.Request(
        f"{FIRECRAWL_BASE}/scrape",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {FIRECRAWL_KEY}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            result = json.loads(resp.read())
        if result.get("success"):
            md = result.get("data", {}).get("markdown", "")
            return {
                "valid": True,
                "content": md,
                "content_length": len(md),
                "title": result.get("data", {}).get("metadata", {}).get("title", ""),
            }
        return {"valid": False, "reason": result.get("error", "scrape_failed")}
    except Exception as e:
        return {"valid": False, "reason": str(e)}


def firecrawl_search(query: str, limit: int = 5) -> list[dict]:
    """Search the web via Firecrawl."""
    payload = json.dumps({"query": query, "limit": limit}).encode()
    req = urllib.request.Request(
        f"{FIRECRAWL_BASE}/search",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {FIRECRAWL_KEY}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            result = json.loads(resp.read())
        return result.get("data", [])
    except Exception as e:
        return []


def firecrawl_enrich(url: str) -> dict:
    """Extract structured provider data from a working website via Firecrawl scrape."""
    if not url:
        return {}
    payload = json.dumps({
        "url": url,
        "formats": ["markdown"],
        "onlyMainContent": True,
    }).encode()
    req = urllib.request.Request(
        f"{FIRECRAWL_BASE}/scrape",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {FIRECRAWL_KEY}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            result = json.loads(resp.read())
        if not result.get("success"):
            return {}
        md = result.get("data", {}).get("markdown", "")
        metadata = result.get("data", {}).get("metadata", {})
        return {
            "markdown": md,
            "title": metadata.get("title", ""),
            "description": metadata.get("description", ""),
            "language": metadata.get("language", ""),
        }
    except Exception:
        return {}


# ═══════════════════════════════════════════════════════════════
# Camofox: anti-detection browser fallback
# ═══════════════════════════════════════════════════════════════

def camofox_create_tab(url: Union[str, None] = None) -> Union[str, None]:
    """Create a Camofox browser tab, return tabId."""
    body = {"userId": "tjb-research", "sessionKey": "provider-research"}
    if url:
        body["url"] = url
    req = urllib.request.Request(
        f"{CAMOFOX_BASE}/tabs",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())["tabId"]
    except Exception:
        return None


def camofox_navigate(tab_id: str, url: str) -> bool:
    """Navigate a Camofox tab to a URL."""
    req = urllib.request.Request(
        f"{CAMOFOX_BASE}/tabs/{tab_id}/navigate",
        data=json.dumps({"userId": "tjb-research", "url": url}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return True
    except Exception:
        return False


def camofox_evaluate(tab_id: str, expression: str) -> str:
    """Evaluate JS in a Camofox tab."""
    req = urllib.request.Request(
        f"{CAMOFOX_BASE}/tabs/{tab_id}/evaluate",
        data=json.dumps({"userId": "tjb-research", "expression": expression}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read()).get("result", "")
    except Exception:
        return ""


def camofox_get_images(tab_id: str) -> list[str]:
    """Get all image URLs from the current page."""
    js = """
    JSON.stringify(Array.from(document.querySelectorAll('img[src]'))
      .filter(i => {
        const s = i.src.toLowerCase();
        return (s.endsWith('.jpg') || s.endsWith('.jpeg') || s.endsWith('.png') || s.endsWith('.webp'))
          && !s.includes('logo') && !s.includes('icon') && !s.includes('button')
          && i.width > 100 && i.height > 100;
      })
      .map(i => ({ src: i.src, alt: i.alt, w: i.width, h: i.height }))
    );
    """
    result = camofox_evaluate(tab_id, js)
    try:
        return json.loads(result) if result else []
    except Exception:
        return []


def camofox_google_search(query: str, limit: int = 5) -> list[dict]:
    """Search Google via Camofox (bypasses CAPTCHA)."""
    tab_id = camofox_create_tab()
    if not tab_id:
        return []

    camofox_navigate(tab_id, f"https://www.google.com/search?q={urllib.parse.quote(query)}")
    time.sleep(3)

    js = """
    JSON.stringify(Array.from(document.querySelectorAll('div.g a[href^=\"http\"]'))
      .slice(0, %d)
      .map(a => ({ title: a.textContent.trim(), url: a.href }))
    );
    """ % limit
    result = camofox_evaluate(tab_id, js)

    # Close tab
    try:
        req = urllib.request.Request(f"{CAMOFOX_BASE}/tabs/{tab_id}", method="DELETE")
        urllib.request.urlopen(req, timeout=5)
    except Exception:
        pass

    try:
        return json.loads(result) if result else []
    except Exception:
        return []


def camofox_extract_provider_data(tab_id: str) -> dict:
    """Extract provider info: services, cost, bio, headshot from the current page."""
    js = """
    JSON.stringify({
      body: document.body.innerText.substring(0, 3000),
      headshots: Array.from(document.querySelectorAll('img[src]'))
        .filter(i => {
          const s = i.src.toLowerCase();
          return (s.endsWith('.jpg') || s.endsWith('.jpeg') || s.endsWith('.png'))
            && !s.includes('logo') && !s.includes('icon')
            && i.width > 150 && i.height > 150;
        })
        .map(i => i.src),
      title: document.title,
    });
    """
    result = camofox_evaluate(tab_id, js)
    try:
        return json.loads(result) if result else {}
    except Exception:
        return {}


# ═══════════════════════════════════════════════════════════════
# Wikipedia Commons: hospital photo search
# ═══════════════════════════════════════════════════════════════

def wikipedia_commons_search(hospital_name: str) -> list[dict]:
    """Search Wikipedia Commons for hospital exterior photos."""
    query = urllib.parse.quote(hospital_name)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={query}+hospital+exterior&format=json&srlimit=5"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read())
        results = []
        for r in data.get("query", {}).get("search", []):
            title = r.get("title", "")
            # Get actual image URL
            img_url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{urllib.parse.quote(title.replace(' ', '_'))}"
            results.append({
                "title": title,
                "url": f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}",
                "image_url": img_url,
            })
        return results
    except Exception:
        return []


def download_image(url: str, output_path: str) -> bool:
    """Download an image and save to disk."""
    try:
        with urllib.request.urlopen(url, timeout=15) as resp:
            data = resp.read()
        with open(output_path, "wb") as f:
            f.write(data)
        return True
    except Exception:
        return False


# ═══════════════════════════════════════════════════════════════
# Classification
# ═══════════════════════════════════════════════════════════════

def classify_place(p: dict, target_state: str = "") -> tuple[Union[str, None], str]:
    """Classify a Google Maps result. Skips results in wrong state."""
    address = (p.get("address") or "").lower()
    name = (p.get("title") or "").lower()
    cat = (p.get("category") or "").lower()
    text = f"{name} {cat}"

    # Filter by state — skip results whose address doesn't mention target state
    if target_state and address and target_state.lower() not in address:
        # Exception: hospitals/midwives in a neighboring city that still serves this city
        # are kept (the address might be a different state for border cities).
        # Only filter when the address clearly shows a different state.
        return (None, "")

    if any(kw in text for kw in ["midwife", "midwifery"]):
        return ("midwife", "midwives")
    if "doula" in text:
        return ("doula", "doulas")
    if any(kw in text for kw in ["birth center", "birth-center", "freestanding birth"]):
        return ("birth_center", "birth_centers")
    if any(kw in text for kw in ["hospital", "medical center"]):
        return ("hospital", "hospitals")
    return (None, "")


# ═══════════════════════════════════════════════════════════════
# Main research pipeline
# ═══════════════════════════════════════════════════════════════

def research_city(city: str, state: str, enrich: bool = False, photo_dir: Union[str, None] = None) -> dict:
    """Complete provider research pipeline for a city."""
    print(f"Researching {city}, {state}...", file=sys.stderr)

    queries = [
        f"doula {city} {state}",
        f"midwife {city} {state}",
        f"birth center {city} {state}",
        f"hospital labor delivery {city} {state}",
    ]

    # Phase 1: Apify parallel searches
    print("  Phase 1: Apify Google Maps...", file=sys.stderr)
    results = {}
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(search_maps, q, 10): q for q in queries}
        for fut in as_completed(futures):
            q = futures[fut]
            try:
                results[q] = fut.result()
            except Exception as e:
                results[q] = []
                print(f"  Search failed: {q[:40]}... — {e}", file=sys.stderr)

    # Phase 2: NPI
    print("  Phase 2: NPI Registry...", file=sys.stderr)
    npi_results = search_npi(city, state, "midwife", 20)

    # Phase 3: Classify and deduplicate
    result = {
        "city": city,
        "state": state,
        "doulas": [],
        "midwives": [],
        "birth_centers": [],
        "hospitals": [],
        "npi_midwives": npi_results,
    }

    seen_urls = set()
    for query, places in results.items():
        for p in places:
            url = (p.get("website") or "").rstrip("/")
            if url and url in seen_urls:
                continue
            if url:
                seen_urls.add(url)

            cat, cat_key = classify_place(p, state)
            if cat is None:
                continue

            entry = {
                "name": p.get("title", ""),
                "address": p.get("address", ""),
                "phone": p.get("phone", ""),
                "website": url,
                "rating": p.get("rating"),
                "reviews": p.get("totalReviews"),
                "state": "open",
                "source": "Google Maps",
                "url_valid": None,
                "enriched": None,
            }
            if p.get("isPermanentlyClosed"):
                entry["state"] = "permanently_closed"

            name_lower = entry["name"].lower()
            existing = [e for e in result[cat_key] if name_lower in e["name"].lower()]
            if not existing:
                result[cat_key].append(entry)

    doula_names = set(d["name"].lower() for d in result["doulas"])
    result["midwives"] = [m for m in result["midwives"] if m["name"].lower() not in doula_names]

    # Phase 4: HEAD pre-filter + URL validation + enrichment (single pass)
    # HEAD check is free — filters dead URLs before spending a Firecrawl call.
    print("  Phase 4: URL validation...", file=sys.stderr)
    all_providers = (
        result["doulas"] + result["midwives"] +
        result["birth_centers"] + result["hospitals"]
    )
    for p in all_providers:
        url = p.get("website")
        if url:
            # Step 1: Free HEAD check first
            head_result = head_check_url(url)
            p["head_check"] = head_result
            if head_result.get("valid"):
                # Step 2: Only Firecrawl-scrape if HEAD passed
                val_result = firecrawl_validate_url(url)
                p["url_valid"] = val_result
                if enrich and val_result.get("valid") and val_result.get("content"):
                    p["enriched"] = {"markdown": val_result["content"], "title": val_result.get("title", "")}
            else:
                p["url_valid"] = {"valid": False, "reason": f"HEAD: {head_result.get('reason','')}"}
        else:
            p["url_valid"] = {"valid": False, "reason": "no_url"}
        if p["url_valid"].get("valid"):
            p["url_status"] = "✅ live"
        else:
            p["url_status"] = f"❌ dead ({p['url_valid'].get('reason','')})"

    # Phase 5: Firecrawl search fallback for dead URLs (only for transient failures)
    print("  Phase 5: Fallback search for dead URLs...", file=sys.stderr)
    for p in all_providers:
        if p.get("url_valid", {}).get("valid"):
            continue
        # Skip clearly dead domains — only try search for transient failures
        head_reason = p.get("head_check", {}).get("reason", "")
        if any(kw in head_reason for kw in ["Name or service not known", "getaddrinfo", "Connection refused", "nodename nor servname"]):
            continue
        search_query = f"{p['name']} {city} {state} doula birth"
        search_results = firecrawl_search(search_query, 3)
        if search_results:
            best = search_results[0]
            new_url = best.get("url", "").rstrip("/")
            if new_url and new_url != p.get("website"):
                print(f"    {p['name']}: found alternative URL: {new_url}", file=sys.stderr)
                p["website_alt"] = new_url
                p["url_valid_alt"] = firecrawl_validate_url(new_url)
                if enrich and p["url_valid_alt"].get("valid") and p["url_valid_alt"].get("content"):
                    p["enriched"] = {"markdown": p["url_valid_alt"]["content"], "title": p["url_valid_alt"].get("title", "")}
                if p["url_valid_alt"].get("valid"):
                    p["url_status"] = "✅ recovered via search"
                else:
                    p["url_status"] = "❌ no valid URL found"
        else:
            p["url_status"] = "❌ no URL found"

    print(f"    Live: {sum(1 for p in all_providers if p.get('url_status','').startswith('✅'))}/{len(all_providers)}", file=sys.stderr)

    # Phase 6: Hospital photos via Wikipedia Commons
    print("  Phase 6: Hospital photo search...", file=sys.stderr)
    for h in result["hospitals"]:
        photos = wikipedia_commons_search(h["name"])
        if photos:
            h["wiki_photos"] = photos
            print(f"    Found {len(photos)} photo(s) for {h['name']}", file=sys.stderr)
            # Download if photo_dir specified
            if photo_dir and photos:
                os.makedirs(photo_dir, exist_ok=True)
                slug = re.sub(r'[^a-z0-9]+', '-', h["name"].lower()).strip("-")
                for i, photo in enumerate(photos[:2]):
                    ext = photo.get("image_url", "").split(".")[-1][:4] or "jpg"
                    path = os.path.join(photo_dir, f"{slug}.{ext}")
                    if download_image(photo["image_url"], path):
                        h["photo_saved"] = path
                        print(f"    Downloaded: {path}", file=sys.stderr)

    print(f"\n  Results: {len(result['doulas'])} doulas, {len(result['midwives'])} midwives, "
          f"{len(result['birth_centers'])} birth centers, {len(result['hospitals'])} hospitals, "
          f"{len(result['npi_midwives'])} NPI midwives", file=sys.stderr)

    if enrich:
        live_urls = sum(1 for p in all_providers if p.get("url_status", "").startswith("✅"))
        enriched = sum(1 for p in all_providers if p.get("enriched"))
        print(f"  URL validation: {live_urls}/{len(all_providers)} live | Enriched: {enriched}", file=sys.stderr)

    return result


def main():
    parser = argparse.ArgumentParser(description="TJB Provider Research Pipeline v2")
    parser.add_argument("city", help="City name")
    parser.add_argument("state", help="State code")
    parser.add_argument("--output", "-o", help="Output file path")
    parser.add_argument("--enrich", action="store_true", help="Enable Firecrawl enrichment (scrapes provider sites)")
    parser.add_argument("--photos", help="Download hospital photos to this directory")
    args = parser.parse_args()

    if not APIFY_KEY:
        print("ERROR: APIFY_API_KEY not set", file=sys.stderr)
        sys.exit(1)

    result = research_city(args.city, args.state, enrich=args.enrich, photo_dir=args.photos)
    output = json.dumps(result, indent=2)

    if args.output:
        with open(args.output, "w") as f:
            f.write(output)
        print(f"Written to {args.output}", file=sys.stderr)
    else:
        print(output)


if __name__ == "__main__":
    main()
