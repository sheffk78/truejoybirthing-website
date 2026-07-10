#!/usr/bin/env python3
"""
Test Crawl4AI on 5 known doula websites.
Evaluates whether Crawl4AI can:
1. Fetch the page content
2. Answer: Is this a doula/midwife business?
3. Answer: Is the business still active?
4. Answer: What services are listed?

Usage: python3 scripts/test-crawl4ai.py
"""

import asyncio
import json
import sys

# Test URLs — mix of direct doula sites, directories, and social media
TEST_URLS = [
    {"url": "https://www.beyondbirthmidwifery.com/", "expected": "doula/midwife", "label": "Beyond Birth Midwifery (direct site)"},
    {"url": "https://www.bornbir.com/abbie-whitfield", "expected": "doula (directory listing)", "label": "BornBir directory listing"},
    {"url": "https://www.bestdallasdoulas.com/allen-doula", "expected": "doula", "label": "Best Dallas Doulas"},
    {"url": "https://www.birthingb.com/", "expected": "birth center/doula", "label": "BirthingB"},
    {"url": "https://austinbirthcompany.com/bethany-allen/", "expected": "doula", "label": "Austin Birth Company"},
    # Negative test: hospital page (NOT a doula)
    {"url": "https://bsahs.org/services/labor-and-delivery/", "expected": "hospital (NOT doula)", "label": "BSA Hospital (negative test)"},
]


async def test_crawl4ai():
    try:
        from crawl4ai import AsyncWebCrawler
    except ImportError:
        print("crawl4ai not installed. Run: pip3 install crawl4ai", file=sys.stderr)
        sys.exit(1)

    results = []

    async with AsyncWebCrawler(verbose=False) as crawler:
        for test in TEST_URLS:
            url = test["url"]
            label = test["label"]
            expected = test["expected"]
            print(f"\n{'='*60}", file=sys.stderr)
            print(f"Testing: {label}", file=sys.stderr)
            print(f"URL: {url}", file=sys.stderr)
            print(f"Expected: {expected}", file=sys.stderr)

            try:
                result = await crawler.arun(url=url, word_count_threshold=200)
                content = result.markdown if result and result.markdown else ""
                success = result.success if result else False

                # Basic heuristics
                content_lower = content.lower() if content else ""
                is_doula = any(term in content_lower for term in ["doula", "midwife", "birth support", "postpartum", "labor support", "childbirth"])
                is_active = len(content) > 200 if content else False
                # Extract service keywords
                service_keywords = []
                for kw in ["birth doula", "postpartum", "lactation", "placenta", "hypnobirthing", "childbirth education", "vbac", "home birth", "water birth", "montrice"]:
                    if kw in content_lower:
                        service_keywords.append(kw)

                entry = {
                    "label": label,
                    "url": url,
                    "expected": expected,
                    "fetch_success": success,
                    "content_length": len(content),
                    "is_doula_content": is_doula,
                    "is_active_content": is_active,
                    "service_keywords_found": service_keywords,
                    "content_preview": content[:500] if content else "",
                }
                results.append(entry)

                print(f"  Fetch: {'OK' if success else 'FAILED'}", file=sys.stderr)
                print(f"  Content length: {len(content)}", file=sys.stderr)
                print(f"  Doula content: {is_doula}", file=sys.stderr)
                print(f"  Services found: {service_keywords}", file=sys.stderr)

            except Exception as e:
                print(f"  ERROR: {e}", file=sys.stderr)
                results.append({
                    "label": label,
                    "url": url,
                    "expected": expected,
                    "fetch_success": False,
                    "error": str(e),
                })

    print(f"\n{'='*60}", file=sys.stderr)
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    asyncio.run(test_crawl4ai())