#!/usr/bin/env python3
"""Create test fixture OG images for preflight self-test."""
import os
from PIL import Image

fixture_dir = os.path.expanduser("~/Projects/truejoybirthing-website/test-fixtures/g4-sort")
os.makedirs(fixture_dir, exist_ok=True)

# v1 = 5KB (corrupted — below 10KB threshold)
img = Image.new('RGB', (100, 100), (255, 0, 0))
img.save(os.path.join(fixture_dir, 'og-city-test-g4-v1.webp'), 'WEBP', quality=10)

# v2 = 30KB (valid)
img2 = Image.new('RGB', (1200, 630), (200, 100, 150))
img2.save(os.path.join(fixture_dir, 'og-city-test-g4-v2.webp'), 'WEBP', quality=85)

# v3 = 40KB (even better)
img3 = Image.new('RGB', (1200, 630), (100, 200, 150))
img3.save(os.path.join(fixture_dir, 'og-city-test-g4-v3.webp'), 'WEBP', quality=90)

# Base name (v1 equivalent, corrupted)
img4 = Image.new('RGB', (100, 100), (0, 0, 255))
img4.save(os.path.join(fixture_dir, 'og-city-test-g4.webp'), 'WEBP', quality=10)

print("Fixtures created")
