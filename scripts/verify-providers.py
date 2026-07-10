#!/usr/bin/env python3
"""
verify-providers.py — Crawl4AI-based provider verification for TJB city pages.

Takes a city slug, extracts provider URLs from cities.ts, crawls each with Crawl4AI,
and uses an LLM to verify:
1. Is this actually a doula/midwife business? (not a hospital, not a dead page)
2. Is the business still active?
3. What services are listed?
4. What's the confidence level?

Output: JSON with per-provider verification results.

Usage:
    python3 scripts/verify-providers.py <slug> [--dry-run] [--json]
    
    --dry-run: Show what would be crawled without calling the LLM
    --json: Output results as JSON (default: human-readable summary)
"""

import asyncio
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

# ── Config ──
PROJECT_DIR = Path(__file__).parent.parent
CITIES_FILE = PROJECT_DIR / "src" / "data" / "cities.ts"

# Read ollama-cloud credentials from Hermes config
_hermes_config = Path.home() / ".hermes" / "config.yaml"
OLLAMA_CLOUD_URL = "http://127.0.0.1:11500/v1/chat/completions"
OLLAMA_CLOUD_KEY = ""
if _hermes_config.exists():
    import yaml
    try:
        cfg = yaml.safe_load(_hermes_config.read_text())
        providers = cfg.get("providers", {})
        ollama_cloud = providers.get("ollama-cloud", {})
        OLLAMA_CLOUD_KEY = ollama_cloud.get("api_key", "")
        base_url = ollama_cloud.get("base_url", "http://127.0.0.1:11500/v1")
        OLLAMA_CLOUD_URL = base_url.rstrip("/") + "/chat/completions"
    except Exception:
        pass

VERIFIER_MODEL = "glm-5.2"  # Standard model via ollama-cloud proxy

# ── City block extraction ──

def extract_city_block(slug: str) -> str | None:
    """Extract the city block from cities.ts by slug."""
    if not CITIES_FILE.exists():
        return None
    content = CITIES_FILE.read_text()
    start = content.find(f'"{slug}"')
    if start == -1:
        return None
    i = content.index('{', start)
    i += 1
    depth = 1
    while i < len(content) and depth > 0:
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
        i += 1
    return content[start:i]


def extract_providers(city_block: str) -> list[dict]:
    """Extract provider name + url pairs from a city block.
    
    Handles nested arrays (services, serviceArea) inside provider objects.
    Walks the localDoulas array object-by-object with brace matching.
    """
    providers = []
    
    # Find localDoulas: [ ... ]
    doula_start = city_block.find("localDoulas")
    if doula_start == -1:
        return providers
    
    bracket_start = city_block.find("[", doula_start)
    if bracket_start == -1:
        return providers
    
    # Walk object-by-object with brace matching
    i = bracket_start + 1
    while i < len(city_block):
        # Skip whitespace and commas
        while i < len(city_block) and city_block[i] in " \t\n,":
            i += 1
        if i >= len(city_block) or city_block[i] == "]":
            break
        if city_block[i] != "{":
            i += 1
            continue
        
        # Find matching close brace
        start = i
        i += 1
        depth = 1
        while i < len(city_block) and depth > 0:
            if city_block[i] == "{":
                depth += 1
            elif city_block[i] == "}":
                depth -= 1
            i += 1
        
        obj = city_block[start:i]
        
        # Extract name and url from this object
        name_match = re.search(r'name:\s*"([^"]+)"', obj)
        url_match = re.search(r'url:\s*"([^"]*)"', obj)
        
        name = name_match.group(1) if name_match else ""
        url = url_match.group(1).strip() if url_match else ""
        
        if name:
            providers.append({"name": name, "url": url})
    
    return providers


# ── Crawl4AI ──

async def crawl_url(url: str, timeout: int = 30) -> dict:
    """Crawl a URL with Crawl4AI and return content + metadata."""
    try:
        from crawl4ai import AsyncWebCrawler
    except ImportError:
        return {"success": False, "error": "crawl4ai not installed"}
    
    try:
        async with AsyncWebCrawler(verbose=False) as crawler:
            result = await crawler.arun(url=url, word_count_threshold=200)
            return {
                "success": result.success,
                "content": result.markdown or "",
                "content_length": len(result.markdown) if result.markdown else 0,
            }
    except Exception as e:
        return {"success": False, "error": str(e)}


# ── LLM verification ──

def verify_with_llm(provider_name: str, url: str, content: str) -> dict:
    """Use an LLM to verify if a provider is a real doula/midwife business."""
    
    # Truncate content to avoid token explosion
    content_snippet = content[:3000] if content else ""
    
    system_prompt = """You are a provider verifier for True Joy Birthing, a birth support directory.
Your job is to verify if a listed provider is actually a doula or midwife business (not a hospital, not a dead page, not an unrelated business).

Return ONLY valid JSON, no other text."""

    user_prompt = f"""## Provider to Verify

Name: {provider_name}
URL: {url}

## Crawled Website Content

```
{content_snippet}
```

## Instructions

Analyze the crawled content and determine:

1. Is this a doula or midwife business? (not a hospital, not an OB/GYN practice, not an unrelated business)
   - Look for: "doula", "midwife", "birth support", "labor support", "postpartum doula"
   - Hospitals typically mention: "NICU", "OB/GYN", "anesthesiologist", "epidural", "surgical"
   - If it's a hospital or clinical practice, mark is_doula as false
   
2. Is the business still active? (page loads, content is current, no "closed" or "permanently closed")
   
3. What services are explicitly listed? (extract from content)
   
4. Confidence score (0-100): how confident are you this is a real, active doula/midwife?

Return your verdict as JSON:
{{
  "is_doula": true/false,
  "is_active": true/false,
  "confidence": <0-100>,
  "services_found": ["service1", "service2", ...],
  "reasoning": "brief explanation",
  "verification_status": "verified" | "not_doula" | "inactive" | "dead_url" | "low_confidence"
}}

verification_status values:
- "verified": is_doula=true, is_active=true, confidence>=70
- "not_doula": is_doula=false
- "inactive": is_active=false
- "dead_url": page didn't load or content is empty
- "low_confidence": confidence < 50

Return ONLY the JSON, no other text."""

    payload = {
        "model": VERIFIER_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 2000,
    }

    headers = {
        "Authorization": f"Bearer {OLLAMA_CLOUD_KEY}",
        "Content-Type": "application/json",
    }

    req = urllib.request.Request(
        OLLAMA_CLOUD_URL,
        data=json.dumps(payload).encode(),
        headers=headers,
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            result = json.loads(response.read().decode())
            content = result["choices"][0]["message"]["content"].strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            return json.loads(content)
    except Exception as e:
        return {
            "is_doula": False,
            "is_active": False,
            "confidence": 0,
            "services_found": [],
            "reasoning": f"LLM error: {e}",
            "verification_status": "dead_url"
        }


# ── Main ──

async def main():
    args = sys.argv[1:]
    if not args:
        print("Usage: python3 scripts/verify-providers.py <slug> [--dry-run] [--json]", file=sys.stderr)
        sys.exit(2)

    slug = args[0]
    dry_run = "--dry-run" in args
    json_output = "--json" in args

    # Extract city block
    city_block = extract_city_block(slug)
    if not city_block:
        print(json.dumps({"error": f"City '{slug}' not found in cities.ts"}))
        sys.exit(1)

    # Extract providers
    providers = extract_providers(city_block)
    if not providers:
        print(json.dumps({"error": f"No providers found for {slug}"}))
        sys.exit(1)

    print(f"Found {len(providers)} providers for {slug}", file=sys.stderr)

    if dry_run:
        print(f"\nDry run — would crawl {len(providers)} URLs:", file=sys.stderr)
        for p in providers:
            print(f"  {p['name']}: {p['url'] or '(no URL)'}", file=sys.stderr)
        # Print summary
        with_urls = [p for p in providers if p['url']]
        without_urls = [p for p in providers if not p['url']]
        print(f"\nWith URLs: {len(with_urls)}", file=sys.stderr)
        print(f"Without URLs: {len(without_urls)}", file=sys.stderr)
        return

    results = []
    for p in providers:
        name = p['name']
        url = p['url']
        
        print(f"\nVerifying: {name}", file=sys.stderr)
        
        if not url:
            results.append({
                "name": name,
                "url": "",
                "verification_status": "no_url",
                "is_doula": None,
                "is_active": None,
                "confidence": 0,
                "services_found": [],
                "reasoning": "No URL provided — cannot verify automatically"
            })
            print(f"  → No URL, skipping", file=sys.stderr)
            continue

        # Crawl the URL
        print(f"  Crawling {url}...", file=sys.stderr)
        crawl_result = await crawl_url(url)
        
        if not crawl_result.get("success"):
            results.append({
                "name": name,
                "url": url,
                "verification_status": "dead_url",
                "is_doula": False,
                "is_active": False,
                "confidence": 0,
                "services_found": [],
                "reasoning": f"Crawl failed: {crawl_result.get('error', 'unknown')}"
            })
            print(f"  → Crawl failed", file=sys.stderr)
            continue

        content = crawl_result["content"]
        print(f"  Content: {len(content)} chars, verifying with LLM...", file=sys.stderr)
        
        # LLM verification
        verification = verify_with_llm(name, url, content)
        verification["name"] = name
        verification["url"] = url
        results.append(verification)
        
        status = verification.get("verification_status", "unknown")
        conf = verification.get("confidence", 0)
        is_doula = verification.get("is_doula", False)
        print(f"  → {status} (confidence: {conf}, is_doula: {is_doula})", file=sys.stderr)

    # Summary
    summary = {
        "slug": slug,
        "total_providers": len(providers),
        "verified": sum(1 for r in results if r.get("verification_status") == "verified"),
        "not_doula": sum(1 for r in results if r.get("verification_status") == "not_doula"),
        "inactive": sum(1 for r in results if r.get("verification_status") == "inactive"),
        "dead_url": sum(1 for r in results if r.get("verification_status") == "dead_url"),
        "no_url": sum(1 for r in results if r.get("verification_status") == "no_url"),
        "low_confidence": sum(1 for r in results if r.get("verification_status") == "low_confidence"),
        "results": results,
    }

    if json_output:
        print(json.dumps(summary, indent=2))
    else:
        print(f"\n{'='*60}", file=sys.stderr)
        print(f"Verification Summary for {slug}", file=sys.stderr)
        print(f"{'='*60}", file=sys.stderr)
        print(f"Total providers: {summary['total_providers']}", file=sys.stderr)
        print(f"Verified:        {summary['verified']}", file=sys.stderr)
        print(f"Not doula:       {summary['not_doula']}", file=sys.stderr)
        print(f"Inactive:        {summary['inactive']}", file=sys.stderr)
        print(f"Dead URL:         {summary['dead_url']}", file=sys.stderr)
        print(f"No URL:           {summary['no_url']}", file=sys.stderr)
        print(f"Low confidence:   {summary['low_confidence']}", file=sys.stderr)
        print(f"\n{'='*60}", file=sys.stderr)
        print(json.dumps(results, indent=2))


if __name__ == "__main__":
    asyncio.run(main())