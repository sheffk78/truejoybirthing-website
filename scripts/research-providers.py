#!/usr/bin/env python3
"""
TJB Provider Research Pipeline
===============================
Parallel multi-source provider research for TJB city pages.

Sources:
  1. Apify Google Maps Scraper — doulas, midwives, birth centers, hospitals
  2. NPI Registry API — credentialed midwives (CNM, CPM, LM)

Usage:
  python scripts/research-providers.py "Seattle" "WA"
  python scripts/research-providers.py "Denver" "CO" --output /tmp/denver.json
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

APIFY_KEY = os.environ.get("APIFY_API_KEY", "")
GOOGLE_MAPS_ACTOR = "nwua9Gu5YrADL7ZDj"
NPI_BASE = "https://npiregistry.cms.hhs.gov/api/"


def apify_run(actor_id: str, body: dict) -> list[dict] | dict:
    """Start an Apify actor run, poll until done, return results."""
    req = urllib.request.Request(
        f"https://api.apify.com/v2/acts/{actor_id}/runs",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {APIFY_KEY}",
            "Content-Type": "application/json",
        },
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


def search_npi(city: str, state: str, taxonomy: str = "midwife", limit: int = 20) -> list[dict]:
    """Search NPI Registry."""
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


def classify_place(p: dict) -> tuple[str | None, str]:
    """Classify a Google Maps result. Returns (category_key, readable_name) or (None, '')."""
    title = (p.get("title") or "").lower()
    cat = (p.get("category") or "").lower()
    text = f"{title} {cat}"

    if any(kw in text for kw in ["midwife", "midwifery"]):
        return ("midwife", "midwives")
    if "doula" in text:
        return ("doula", "doulas")
    if any(kw in text for kw in ["birth center", "birth-center", "freestanding birth"]):
        return ("birth_center", "birth_centers")
    if any(kw in text for kw in ["hospital", "medical center"]):
        return ("hospital", "hospitals")
    return (None, "")


def research_city(city: str, state: str) -> dict:
    """Complete provider research for a city — runs all Apify searches in parallel."""
    print(f"Researching {city}, {state}...", file=sys.stderr)

    queries = [
        f"doula {city} {state}",
        f"midwife {city} {state}",
        f"birth center {city} {state}",
        f"hospital labor delivery {city} {state}",
    ]

    # Run all Apify searches in parallel
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

    # Also get NPI data in parallel
    npi_future = None
    with ThreadPoolExecutor(max_workers=1) as pool:
        npi_future = pool.submit(search_npi, city, state, "midwife", 20)
        npi_results = npi_future.result()

    # Classify results by category
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

            cat, cat_key = classify_place(p)
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
            }
            if p.get("isPermanentlyClosed"):
                entry["state"] = "permanently_closed"

            # Deduplicate by name
            name_lower = entry["name"].lower()
            existing = [e for e in result[cat_key]
                        if name_lower in e["name"].lower()]
            if not existing:
                result[cat_key].append(entry)

    # Deduplicate: remove from midwives if already in doulas (or vice versa)
    # If a practice offers both, keep in whichever had more specific category match
    doula_names = set(d["name"].lower() for d in result["doulas"])
    result["midwives"] = [m for m in result["midwives"] if m["name"].lower() not in doula_names]

    print(f"  Found: {len(result['doulas'])} doulas, {len(result['midwives'])} midwives, "
          f"{len(result['birth_centers'])} birth centers, {len(result['hospitals'])} hospitals, "
          f"{len(result['npi_midwives'])} NPI midwives", file=sys.stderr)

    return result


def main():
    parser = argparse.ArgumentParser(description="Research providers for a TJB city page")
    parser.add_argument("city", help="City name")
    parser.add_argument("state", help="State code")
    parser.add_argument("--output", "-o", help="Output file path")
    args = parser.parse_args()

    if not APIFY_KEY:
        print("ERROR: APIFY_API_KEY not set", file=sys.stderr)
        sys.exit(1)

    result = research_city(args.city, args.state)
    output = json.dumps(result, indent=2)

    if args.output:
        with open(args.output, "w") as f:
            f.write(output)
        print(f"Written to {args.output}", file=sys.stderr)
    else:
        print(output)


if __name__ == "__main__":
    main()