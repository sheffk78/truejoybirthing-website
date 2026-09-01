#!/usr/bin/env python3
"""Generate OG composition HTMLs for cities missing OG images (Aug 31, 2026).
Follows the canonical Pattern B template in og-city-alameda-ca-composition.html.
Cities without hero images use the branded gradient fallback per template docs."""
import os

TEMPLATE_META = {
    "newport-beach-ca": {
        "eyebrow": "NEWPORT BEACH BIRTH SUPPORT",
        "headline": 'Doulas &amp; Birth Plans<br>in Newport Beach, CA',
        "summary": "From the Balboa Peninsula to Hoag's nationally ranked labor &amp; delivery unit, Newport Beach families deserve birth support that gets it. Real hospital policies, local doulas, and a free birth plan template built for California moms.",
        "img": None,
    },
    "costa-mesa-ca": {
        "eyebrow": "COSTA MESA BIRTH SUPPORT",
        "headline": 'Doulas &amp; Birth Plans<br>in Costa Mesa, CA',
        "summary": "From the Segerstrom Center district to Hoag and Orange Coast Memorial, Costa Mesa families deserve birth support that gets it. Real hospital policies, local doulas, and a free birth plan template built for California moms.",
        "img": None,
    },
    "la-habra-ca": {
        "eyebrow": "LA HABRA BIRTH SUPPORT",
        "headline": 'Doulas &amp; Birth Plans<br>in La Habra, CA',
        "summary": "Tucked against the Coyote Hills at L.A. County's edge, La Habra families deserve birth support that gets it. Real hospital policies, local doulas, and a free birth plan template built for California moms.",
        "img": None,
    },
    "san-mateo-ca": {
        "eyebrow": "SAN MATEO BIRTH SUPPORT",
        "headline": 'Doulas &amp; Birth Plans<br>in San Mateo, CA',
        "summary": "From the Hayward shoreline to Mills-Peninsula Medical Center, San Mateo families deserve birth support that gets it. Real hospital policies, local doulas, and a free birth plan template built for California moms.",
        "img": None,
    },
    "palo-alto-ca": {
        "eyebrow": "PALO ALTO BIRTH SUPPORT",
        "headline": 'Doulas &amp; Birth Plans<br>in Palo Alto, CA',
        "summary": "From Stanford's world-class labor &amp; delivery to the foothills of the Peninsula, Palo Alto families deserve birth support that gets it. Real hospital policies, local doulas, and a free birth plan template built for California moms.",
        "img": None,
    },
    "redwood-city-ca": {
        "eyebrow": "REDWOOD CITY BIRTH SUPPORT",
        "headline": 'Doulas &amp; Birth Plans<br>in Redwood City, CA',
        "summary": "From the downtown courthouse square to Sequoia Hospital's family birth center, Redwood City families deserve birth support that gets it. Real hospital policies, local doulas, and a free birth plan template built for California moms.",
        "img": None,
    },
    "burlingame-ca": {
        "eyebrow": "BURLINGAME BIRTH SUPPORT",
        "headline": 'Doulas &amp; Birth Plans<br>in Burlingame, CA',
        "summary": "Along the Bayfront from Broadway to Mills Peninsula, Burlingame families deserve birth support that gets it. Real hospital policies, local doulas, and a free birth plan template built for California moms.",
        "img": None,
    },
    "bellevue-wa": {
        "eyebrow": "BELLEVUE BIRTH SUPPORT",
        "headline": 'Doulas &amp; Birth Plans<br>in Bellevue, WA',
        "summary": "From the shores of Lake Washington to Overlake Medical Center's birth center, Bellevue families deserve birth support that gets it. Real hospital policies, local doulas, and a free birth plan template built for Washington moms.",
        "img": "../public/images/bellevue-wa-birth-doula-skyline.webp",
    },
}

with open("scripts/og-city-alameda-ca-composition.html") as f:
    template = f.read()

GRADIENT = '<div class="right-column" style="background: linear-gradient(135deg, #E6BBD8 0%, #8E8CB5 50%, #A8B5A0 100%);"></div>'

for slug, meta in TEMPLATE_META.items():
    html = template
    html = html.replace("ALAMEDA BIRTH SUPPORT", meta["eyebrow"])
    html = html.replace('Doulas &amp; Birth Plans<br>in Alameda, CA', meta["headline"])
    html = html.replace(
        "From the Island City to the East Bay shoreline, Alameda families deserve birth support that gets it. Real hospital policies, local doulas, and a free birth plan template built for California moms.",
        meta["summary"],
    )
    if meta["img"]:
        html = html.replace(
            '<img src="../public/images/alameda-ca-birth-doula-skyline-v2.webp" alt="Alameda, CA" />',
            f'<img src="{meta["img"]}" alt="{slug}" />',
        )
    else:
        html = html.replace(
            '<div class="right-column">\n    <img src="../public/images/alameda-ca-birth-doula-skyline-v2.webp" alt="Alameda, CA" />\n  </div>',
            f'{GRADIENT.replace("right-column", "right-column")}',
        )
        # fallback: replace the whole right-column img div
        import re
        html = re.sub(
            r'<div class="right-column">\s*<img[^>]*/>\s*</div>',
            GRADIENT,
            html,
        )
    out = f"scripts/og-city-{slug}-composition.html"
    with open(out, "w") as f:
        f.write(html)
    print("wrote", out, "gradient" if not meta["img"] else "photo")
