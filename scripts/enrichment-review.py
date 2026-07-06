#!/usr/bin/env python3
"""
TJB Enrichment Reviewer Gate
=============================
Post-enrichment quality review using a stronger model as judge.

This is the "voice reviewer" pattern from AI harness engineering:
- The producer model (GLM-5.2) does the enrichment work
- A reviewer model (Fable 5 / Sonnet 4) in FRESH context reviews the output
- If the reviewer finds issues, the orchestrator loops back to fix them
- Max 3 review loops before escalating to human

The reviewer reads ONLY:
  1. The quality standard (enrichment-review-standard.md)
  2. The city's block from cities.ts
  3. The city slug and basic context

It does NOT see the research context, the research brief, or any prior
conversation. This is a fresh-eyes review against a standard.

Usage:
    python3 scripts/enrichment-review.py <slug> [--model <model>] [--loop <n>]

Output: JSON to stdout
{
  "pass": bool,
  "score": int,
  "failures": [...],
  "notes": "...",
  "model_used": "...",
  "loop": int
}

Exit codes:
  0 = pass
  1 = fail (with failures in stdout)
  2 = error (API call failed, model unavailable, etc.)
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
SKILL_DIR = Path(os.path.expanduser("~/.hermes/skills/productivity/tjb-city-orchestrator"))
STANDARD_PATH = PROJECT_DIR / "scripts" / "enrichment-review-standard.md"

# Reviewer uses GLM-5.2 via ollama-cloud proxy (same flat-rate model, no metered spending)
# The "voice reviewer" pattern still works: the reviewer is in FRESH context (no memory
# of the enrichment work), reading only the standard + city data. The fresh-context
# review is what catches quality issues, not a different model.
REVIEWER_MODEL = "glm-5.2"

# API config — ollama-cloud proxy (OpenAI-compatible, local)
OLLAMA_CLOUD_URL = "http://127.0.0.1:11500/v1/chat/completions"
OLLAMA_CLOUD_KEY = "f31be38f651a4b14a68b4612ddd792c8.l4_WlHHgVPKeNXHd817VdaqP"


def extract_city_block(slug: str) -> str | None:
    """Extract the city block from cities.ts using the extract-city-block.py helper."""
    try:
        result = subprocess.run(
            ["python3", str(PROJECT_DIR / "scripts" / "extract-city-block.py"), slug],
            capture_output=True, text=True, timeout=10
        )
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout.strip()
    except Exception:
        pass

    # Fallback: simple regex extraction
    cities_path = PROJECT_DIR / "src" / "data" / "cities.ts"
    if not cities_path.exists():
        return None
    text = cities_path.read_text()
    slug_pattern = re.compile(rf'"{re.escape(slug)}":\s*\{{')
    match = slug_pattern.search(text)
    if not match:
        return None
    # Find block end by brace depth
    remainder = text[match.end():]
    depth = 1
    for i, ch in enumerate(remainder):
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                block_start = text.rfind('\n', 0, match.start())
                block_start = block_start + 1 if block_start >= 0 else 0
                return text[block_start:match.end() + i + 1]
    return None


def call_reviewer_model(city_block: str, standard: str, slug: str, model: str) -> dict | None:
    """Call the reviewer model via ollama-cloud proxy. Returns parsed JSON or None."""
    import urllib.request

    system_prompt = """You are a quality reviewer for True Joy Birthing city pages.
Your job is to review a city's enriched data against a quality standard and return a pass/fail verdict.

You must be STRICT but FAIR:
- Flag real quality issues that would be visible to a local mom looking at the page
- Don't flag stylistic preferences or minor wording choices
- Do flag missing data, scraped artifacts, generic text, wrong-city data, formatting errors
- Return ONLY valid JSON, no other text

Read the quality standard and the city data carefully, then return your verdict."""

    user_prompt = f"""## Quality Standard

{standard}

## City Data to Review

City slug: {slug}

```typescript
{city_block}
```

## Instructions

Review this city's enriched data against the quality standard above.
Check every section of the standard: hospital descriptions, provider data quality,
provider count proportionality, birth center data, cultural context, and data formatting.

Return your verdict as JSON:
{{
  "pass": true/false,
  "score": <0-100>,
  "failures": ["specific failure 1", "specific failure 2", ...],
  "notes": "optional context"
}}

Pass threshold: score >= 80
Remember: return ONLY the JSON, no other text."""

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.3,  # Low temperature for consistency
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
        with urllib.request.urlopen(req, timeout=90) as response:
            result = json.loads(response.read().decode())
            content = result["choices"][0]["message"]["content"].strip()
            # Extract JSON from response (model may wrap in markdown code block)
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            return json.loads(content)
    except Exception as e:
        print(f"  API error with {model}: {e}", file=sys.stderr)
        return None


def review_city(slug: str, model_override: str | None = None, loop: int = 1) -> dict:
    """Review a city's enrichment quality. Returns the review result dict."""
    # Load quality standard
    if not STANDARD_PATH.exists():
        return {
            "pass": False,
            "score": 0,
            "failures": ["Quality standard file not found"],
            "error": f"Missing {STANDARD_PATH}"
        }
    standard = STANDARD_PATH.read_text()

    # Extract city block
    city_block = extract_city_block(slug)
    if not city_block:
        return {
            "pass": False,
            "score": 0,
            "failures": [f"Could not extract city block for {slug} from cities.ts"],
            "error": "City block extraction failed"
        }

    # Call the reviewer model
    model = model_override or REVIEWER_MODEL
    print(f"  Reviewing {slug} with {model} (loop {loop})...", file=sys.stderr)
    result = call_reviewer_model(city_block, standard, slug, model)
    if result is not None:
        result["model_used"] = model
        result["loop"] = loop
        return result

    # API call failed
    return {
        "pass": False,
        "score": 0,
        "failures": ["Reviewer model unavailable — API call failed"],
        "error": "Reviewer API could not be reached",
        "loop": loop
    }


def main():
    args = sys.argv[1:]
    if not args:
        print("Usage: python3 scripts/enrichment-review.py <slug> [--model <model>] [--loop <n>]", file=sys.stderr)
        sys.exit(2)

    slug = args[0]
    model_override = None
    loop = 1

    for i, arg in enumerate(args[1:], 1):
        if arg == "--model" and i + 1 < len(args):
            model_override = args[i + 1]
        elif arg == "--loop" and i + 1 < len(args):
            try:
                loop = int(args[i + 1])
            except ValueError:
                pass

    result = review_city(slug, model_override, loop)
    print(json.dumps(result, indent=2))

    if "error" in result:
        sys.exit(2)
    elif result.get("pass", False):
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()