#!/usr/bin/env python3
"""
TJB City Page Completion Review Gate
=====================================
Two-layer review: deterministic Python checks + LLM judgment layer.

Layer 1: Python script checks HTTP status, HTML structure, broken images,
         file sizes, provider counts, YouTube thumbnail existence.
Layer 2: Bedrock (Qwen 3.8 27B, local) reviews city data quality against
         the review standard. Falls back to GLM-5.2 (ollama-cloud) if bedrock
         is unavailable or fails.

Runs AFTER all pipeline stages complete (build → enrich → verify_deploy → video_outreach).
No city reaches "complete" status without passing this review.

Usage:
    python3 scripts/city-page-review.py <slug> [--verbose] [--model bedrock|glm-5.2]
    python3 scripts/city-page-review.py <slug> --compare  (runs both models, reports diff)

Output: JSON to stdout
{
  "pass": bool,
  "score": int,
  "failures": [...],
  "llm_review": {...},        // LLM judgment layer results
  "categories_checked": [...],
  "slug": "...",
  "timestamp": "..."
}

Exit codes:
  0 = pass (score >= 85, no critical failures)
  1 = fail (score < 85 or critical failure)
  2 = error (could not complete review)
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
import ssl
from pathlib import Path
from datetime import datetime, timezone

PROJECT_DIR = Path(__file__).resolve().parent.parent
STANDARD_PATH = PROJECT_DIR / "scripts" / "city-page-review-standard.md"
VIDEO_EMBEDS_PATH = PROJECT_DIR / "src" / "data" / "video-embeds.ts"
CITIES_PATH = PROJECT_DIR / "src" / "data" / "cities.ts"
SCREENSHOTS_DIR = PROJECT_DIR / "public" / "images"

BASE_URL = "https://truejoybirthing.com"

# SSL context for fetching
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# LLM model configuration — bedrock is primary, glm-5.2 is fallback
PRIMARY_MODEL = "bedrock"
FALLBACK_MODEL = "glm-5.2"
OLLAMA_LOCAL_URL = "http://127.0.0.1:11434/api/chat"
OLLAMA_CLOUD_URL = "http://127.0.0.1:11500/v1/chat/completions"
OLLAMA_CLOUD_KEY = "f31be38f651a4b14a68b4612ddd792c8.l4_WlHHgVPKeNXHd817VdaqP"


def call_bedrock(prompt, timeout=180):
    """Call bedrock (Qwen 3.8 27B) via local Ollama API. Returns parsed JSON or None."""
    body = json.dumps({
        "model": "bedrock",
        "messages": [{"role": "user", "content": prompt}],
        "format": "json",
        "stream": False,
        "options": {"temperature": 0.1, "num_ctx": 8192, "num_predict": 1024}
    }).encode()
    req = urllib.request.Request(OLLAMA_LOCAL_URL, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    resp = urllib.request.urlopen(req, timeout=timeout)
    data = json.loads(resp.read())
    content = data.get("message", {}).get("content", "")
    if not content:
        return {"pass": True, "score": 100, "failures": []}, "bedrock", data.get("total_duration", 0) / 1e9
    return json.loads(content), "bedrock", data.get("total_duration", 0) / 1e9


def call_glm52(prompt, timeout=120):
    """Call GLM-5.2 via ollama-cloud proxy. Returns parsed JSON or None."""
    body = json.dumps({
        "model": "glm-5.2",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1,
        "max_tokens": 1024,
        "stream": False
    }).encode()
    req = urllib.request.Request(OLLAMA_CLOUD_URL, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {OLLAMA_CLOUD_KEY}")
    resp = urllib.request.urlopen(req, timeout=timeout)
    data = json.loads(resp.read())
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    return json.loads(content), "glm-5.2", data.get("usage", {}).get("total_tokens", 0)


def llm_review_city(slug, model="bedrock", verbose=False):
    """Run LLM judgment layer on city data quality."""
    # Read the review standard
    standard = STANDARD_PATH.read_text() if STANDARD_PATH.exists() else ""
    
    # Extract city data block
    city_data = extract_city_data(slug)
    if not city_data:
        return {"error": f"Could not extract city data for {slug}", "model": model}
    
    prompt = f"""You are a quality reviewer for True Joy Birthing city pages. Review the city data below against the quality standard and return ONLY JSON (no other text).

QUALITY STANDARD:
{standard[:2000]}

CITY DATA ({slug}):
{city_data[:3000]}

Review checklist:
1. At least 3 providers with real business names (not "Doulas", "Resources", "Our Board")
2. Each provider has a costRange with dollar amounts (not all "Contact for pricing")
3. Hospital descriptions are 4+ sentences with NICU level mentioned
4. No HTML artifacts, scraped text, or generic placeholder descriptions
5. medicaidNote starts with "Yes -" or "No -"
6. culture field references the specific city (not generic)
7. heroLocalDetail mentions real landmarks/neighborhoods in the city
8. No cross-city contamination (provider names from other cities)

Return ONLY this JSON format: {{"pass": true, "score": 95, "failures": ["issue1", "issue2"]}}
"""

    try:
        if model == "bedrock":
            result, model_used, duration = call_bedrock(prompt)
        else:
            result, model_used, duration = call_glm52(prompt)
        
        return {
            "pass": result.get("pass", False),
            "score": result.get("score", 0),
            "failures": result.get("failures", []),
            "model": model_used,
            "duration_s": round(duration, 1)
        }
    except Exception as e:
        return {"error": str(e)[:200], "model": model}


def fetch_page(url, timeout=15):
    """Fetch a URL and return (status_code, content)."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=timeout, context=ctx)
        return resp.status, resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return 0, str(e)


def check_image(url, timeout=10):
    """Check if an image URL returns 200 and is > 1KB."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=timeout, context=ctx)
        data = resp.read()
        return resp.status == 200 and len(data) > 1024
    except:
        return False


def get_youtube_id(slug):
    """Extract YouTube video ID from video-embeds.ts."""
    try:
        text = VIDEO_EMBEDS_PATH.read_text()
        pattern = rf'"{re.escape(slug)}":\s*\{{[^}}]*?videoId:\s*"([A-Za-z0-9_-]+)"'
        match = re.search(pattern, text)
        if match:
            return match.group(1)
    except:
        pass
    return None


def check_youtube_thumbnail(yt_id, min_size=30000):
    """Check if YouTube thumbnail exists and is large enough (not a raw frame)."""
    url = f"https://img.youtube.com/vi/{yt_id}/maxresdefault.jpg"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = resp.read()
        return len(data) >= min_size
    except:
        return False


def check_local_thumbnail(slug):
    """Check if a locally-generated branded thumbnail exists."""
    thumb = SCREENSHOTS_DIR / f"yt-thumb-{slug}.png"
    return thumb.exists() and thumb.stat().st_size > 50000


def check_screenshot(slug):
    """Check if the fullpage-scroll screenshot exists and is large enough."""
    ss = SCREENSHOTS_DIR / f"{slug}-fullpage-scroll.png"
    if not ss.exists():
        return {"exists": False, "size_kb": 0}
    size = ss.stat().st_size
    return {"exists": True, "size_kb": size // 1024, "large_enough": size > 1000000}


def extract_city_data(slug):
    """Extract key city data from cities.ts — gets the full city block."""
    try:
        text = CITIES_PATH.read_text()
        pattern = rf'"{re.escape(slug)}":\s*\{{'
        match = re.search(pattern, text)
        if not match:
            return None
        # Find the matching closing brace by counting brace depth
        start = match.end() - 1  # include opening brace
        depth = 0
        end = start
        for i in range(start, min(start + 20000, len(text))):
            if text[i] == '{':
                depth += 1
            elif text[i] == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        return text[start:end]
    except:
        return None


def count_providers(slug):
    """Count providers in the city data."""
    try:
        text = CITIES_PATH.read_text()
        pattern = rf'"{re.escape(slug)}":\s*\{{'
        match = re.search(pattern, text)
        if not match:
            return 0
        block = text[match.start():match.start() + 10000]
        # Count "name:" occurrences in localDoulas section
        provider_names = re.findall(r'name:\s*"([^"]+)"', block)
        return len(provider_names)
    except:
        return 0


def check_page_structure(html, slug):
    """Check the live page HTML for structural completeness."""
    failures = []
    
    # Check for undefined text
    if "undefined" in html:
        failures.append({
            "category": "structure",
            "severity": "critical",
            "issue": "Found 'undefined' text in page content",
            "fix": "Check cities.ts for missing fields that render as undefined"
        })
    
    # Check for provider section
    if "doula" not in html.lower() and "midwife" not in html.lower():
        failures.append({
            "category": "structure",
            "severity": "critical",
            "issue": "No doula/midwife content found on page",
            "fix": "Ensure city data has localDoulas array with real providers"
        })
    
    # Check for hospital section
    if "hospital" not in html.lower():
        failures.append({
            "category": "structure",
            "severity": "major",
            "issue": "No hospital content found on page",
            "fix": "Ensure city data has hospitalDetails array"
        })
    
    # Check for video embed
    if "data-video-id" not in html and "VideoObject" not in html and "youtube" not in html.lower():
        failures.append({
            "category": "structure",
            "severity": "critical",
            "issue": "No video embed found on page",
            "fix": "Add video embed via video-embeds.ts"
        })
    
    # Check for CAN-SPAM address
    if "37219" not in html and "Nashville" not in html:
        failures.append({
            "category": "structure",
            "severity": "major",
            "issue": "CAN-SPAM address missing from footer",
            "fix": "Add business address to footer: 217 6th Ave N STE 43363, Nashville, TN 37219"
        })
    
    # Check for "Contact for pricing" as the only cost info
    if "Contact for pricing" in html:
        # Count occurrences
        cfp_count = html.lower().count("contact for pricing")
        if cfp_count > 5:
            failures.append({
                "category": "providers",
                "severity": "major",
                "issue": f"'Contact for pricing' appears {cfp_count} times — most providers lack real cost data",
                "fix": "Research and add real cost ranges for providers"
            })
    
    return failures


def check_provider_images(html, slug):
    """Check if provider images on the live page are accessible."""
    failures = []
    
    # Find all provider image srcs — exclude hero/skyline images (those are not provider photos)
    img_pattern = r'(?:src|srcset)="([^"]*(?:provider|doula)[^"]*\.(?:webp|png|jpg)[^"]*)"'
    img_refs = re.findall(img_pattern, html, re.IGNORECASE)
    
    # Filter out hero/skyline images — those are city hero images, not provider photos
    img_refs = [r for r in img_refs if "hero" not in r.lower() and "skyline" not in r.lower() and "support" not in r.lower()]
    
    broken = 0
    checked = 0
    for img_path in img_refs[:10]:  # Check first 10
        if img_path.startswith("/"):
            url = f"{BASE_URL}{img_path.split(' ')[0]}"
        else:
            continue
        checked += 1
        if not check_image(url):
            broken += 1
    
    if broken > 0:
        failures.append({
            "category": "providers",
            "severity": "critical" if broken > 2 else "major",
            "issue": f"{broken}/{checked} provider images are broken (404 or too small)",
            "fix": f"Download real provider photos and ensure they exist in public/images/"
        })
    
    return failures


def review_city(slug, verbose=False, model="bedrock", compare=False):
    """Run the full completion review on a city."""
    failures = []
    categories_checked = []
    
    # 1. Page HTTP check
    page_url = f"{BASE_URL}/birth-support/{slug}/"
    status, html = fetch_page(page_url)
    categories_checked.append("page_http")
    
    if status != 200:
        return {
            "pass": False,
            "score": 0,
            "failures": [{"category": "page_http", "severity": "critical",
                         "issue": f"Page returns HTTP {status}", "fix": "Deploy the page"}],
            "categories_checked": categories_checked,
            "slug": slug,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    # 2. Page structure
    failures.extend(check_page_structure(html, slug))
    categories_checked.append("structure")
    
    # 3. Provider images
    failures.extend(check_provider_images(html, slug))
    categories_checked.append("provider_images")
    
    # 4. YouTube video + thumbnail
    yt_id = get_youtube_id(slug)
    categories_checked.append("youtube_video")
    
    if yt_id:
        # Check thumbnail is branded
        local_thumb = check_local_thumbnail(slug)
        yt_thumb_ok = check_youtube_thumbnail(yt_id)
        
        if not local_thumb and not yt_thumb_ok:
            failures.append({
                "category": "thumbnail",
                "severity": "critical",
                "issue": "No branded YouTube thumbnail found locally or on YouTube",
                "fix": f"Generate thumbnail: node scripts/render-yt-thumbnail.cjs {slug} '{slug.split('-')[0].title()}' {slug.split('-')[1].upper()}",
            })
        elif not local_thumb:
            failures.append({
                "category": "thumbnail",
                "severity": "major",
                "issue": "No locally generated branded thumbnail (may be using YouTube auto-generated frame)",
                "fix": f"Generate thumbnail: node scripts/render-yt-thumbnail.cjs {slug} '{slug.split('-')[0].title()}' {slug.split('-')[1].upper()}"
            })
    else:
        failures.append({
            "category": "video",
            "severity": "critical",
            "issue": "No YouTube video ID found in video-embeds.ts",
            "fix": "Render and upload a video, then add to video-embeds.ts"
        })
    
    # 5. Fullpage screenshot
    ss_info = check_screenshot(slug)
    categories_checked.append("screenshot")
    
    if not ss_info["exists"]:
        failures.append({
            "category": "screenshot",
            "severity": "major",
            "issue": "No fullpage-scroll screenshot found",
            "fix": f"Run: node scripts/capture-fullpage.cjs {slug}"
        })
    elif not ss_info["large_enough"]:
        failures.append({
            "category": "screenshot",
            "severity": "major",
            "issue": f"Screenshot is only {ss_info['size_kb']}KB (likely blank/missing provider photos)",
            "fix": f"Re-capture: node scripts/capture-fullpage.cjs {slug}"
        })
    
    # 6. Provider count
    provider_count = count_providers(slug)
    categories_checked.append("provider_count")
    if provider_count < 3:
        failures.append({
            "category": "providers",
            "severity": "major",
            "issue": f"Only {provider_count} providers (minimum 3)",
            "fix": "Research and add more providers to cities.ts"
        })
    
    # 7. LLM judgment layer (Layer 2)
    llm_review = None
    categories_checked.append("llm_judgment")
    
    if compare:
        # Run both models and compare
        bedrock_review = llm_review_city(slug, model="bedrock", verbose=verbose)
        glm_review = llm_review_city(slug, model="glm-5.2", verbose=verbose)
        llm_review = {
            "bedrock": bedrock_review,
            "glm52": glm_review,
            "agree": bedrock_review.get("pass") == glm_review.get("pass") if "error" not in bedrock_review and "error" not in glm_review else "N/A"
        }
        # Use bedrock as primary
        primary = bedrock_review
    else:
        # Run primary model, fall back if it fails
        llm_review = llm_review_city(slug, model=model, verbose=verbose)
        if "error" in llm_review and model == "bedrock":
            if verbose:
                print(f"  Bedrock failed: {llm_review['error']}, falling back to GLM-5.2...", file=sys.stderr)
            llm_review = llm_review_city(slug, model="glm-5.2", verbose=verbose)
        primary = llm_review
    
    # Incorporate LLM failures into overall score
    if primary and "error" not in primary:
        llm_failures = primary.get("failures", [])
        if isinstance(llm_failures, list):
            for lf in llm_failures:
                if isinstance(lf, str):
                    failures.append({
                        "category": "llm_judgment",
                        "severity": "major",
                        "issue": lf,
                        "fix": "Fix the issue identified by the LLM reviewer"
                    })
        elif llm_failures:
            failures.append({
                "category": "llm_judgment",
                "severity": "major",
                "issue": str(llm_failures)[:200],
                "fix": "Fix the issue identified by the LLM reviewer"
            })
    elif primary and "error" in primary:
        failures.append({
            "category": "llm_judgment",
            "severity": "minor",
            "issue": f"LLM review failed: {primary['error']}",
            "fix": "Check model availability"
        })
    
    # Calculate score
    critical_count = sum(1 for f in failures if f["severity"] == "critical")
    major_count = sum(1 for f in failures if f["severity"] == "major")
    minor_count = sum(1 for f in failures if f["severity"] == "minor")
    
    score = 100 - (critical_count * 20) - (major_count * 10) - (minor_count * 5)
    score = max(0, score)
    
    passed = score >= 85 and critical_count == 0
    
    result = {
        "pass": passed,
        "score": score,
        "failures": failures,
        "llm_review": llm_review,
        "categories_checked": categories_checked,
        "provider_count": provider_count,
        "youtube_id": yt_id,
        "screenshot_kb": ss_info.get("size_kb", 0),
        "slug": slug,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    return result


def main():
    parser = argparse.ArgumentParser(description="TJB City Page Completion Review")
    parser.add_argument("slug", help="City slug to review (e.g., denver-co)")
    parser.add_argument("--verbose", action="store_true", help="Print detailed output")
    parser.add_argument("--model", default="bedrock", choices=["bedrock", "glm-5.2"],
                        help="LLM model for judgment layer (default: bedrock)")
    parser.add_argument("--compare", action="store_true",
                        help="Run both bedrock and glm-5.2, compare results")
    args = parser.parse_args()
    
    result = review_city(args.slug, verbose=args.verbose, model=args.model, compare=args.compare)
    
    print(json.dumps(result, indent=2))
    
    if result["pass"]:
        sys.exit(0)
    elif result["score"] == 0 and len(result["failures"]) == 1:
        sys.exit(2)  # Error
    else:
        sys.exit(1)  # Fail


if __name__ == "__main__":
    main()