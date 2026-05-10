#!/usr/bin/env python3
"""Generate True Joy Birthing city pages from a data dictionary."""

import os, json

BASE = os.path.expanduser("~/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/web-strategy/truejoybirthing-website/src/pages/birth-support")

CITIES = {
    # New TX cities
    "el-paso-tx": {
        "city": "El Paso", "state": "TX",
        "hospitals": ["University Medical Center El Paso", "Las Palmas Medical Center", "The Hospitals of Providence Memorial Campus"],
        "birthCenters": ["El Paso Birth Center"],
        "costLow": 800, "costHigh": 2200,
        "medicaidNote": "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the El Paso area. Confirm with your Medicaid plan.",
        "insuranceNote": "Some private insurers in the El Paso region now cover doula support as part of maternal wellness benefits. Contact your plan.",
        "culture": "El Paso has a vibrant, family-centered birth community with strong cultural traditions around pregnancy and delivery. Families deliver at major hospitals and a growing number of birth centers.",
        "shelbiServesHere": False,
        "faqs": [
            {"q": "Does Medicaid cover doulas in El Paso?", "a": "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits."},
            {"q": "How much does a doula cost in El Paso?", "a": "$800 to $2,200 depending on experience and package. Doulas in border communities may offer sliding-scale fees."},
            {"q": "Does True Joy Birthing work with El Paso families?", "a": "The free app and birth plan work for any El Paso birth setting. Virtual confidence sessions are available. Shelbi does not provide in-person doula services in El Paso."},
            {"q": "Which El Paso hospitals are birth-plan friendly?", "a": "Many El Paso hospitals accommodate birth plans, but policies vary. University Medical Center and Las Palmas Medical Center both see informed patients with clear preferences. Always confirm during your hospital tour."}
        ]
    },
    "lubbock-tx": {
        "city": "Lubbock", "state": "TX",
        "hospitals": ["Covenant Medical Center", "University Medical Center Lubbock", "Methodist Hospital Lubbock"],
        "birthCenters": [],
        "costLow": 700, "costHigh": 2000,
        "medicaidNote": "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Lubbock area. Confirm with your Medicaid plan.",
        "insuranceNote": "Some private insurers in the Lubbock region now cover doula support as part of maternal wellness benefits. Contact your plan.",
        "culture": "Lubbock is a West Texas hub with a tight-knit birth community. Families typically deliver at one of the major hospital systems in the city.",
        "shelbiServesHere": False,
        "faqs": [
            {"q": "Does Medicaid cover doulas in Lubbock?", "a": "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits."},
            {"q": "How much does a doula cost in Lubbock?", "a": "$700 to $2,000 depending on experience and package. Costs in West Texas tend to be lower than in major metros."},
            {"q": "Does True Joy Birthing work with Lubbock families?", "a": "The free app and birth plan work for any Lubbock birth setting. Virtual confidence sessions are available. Shelbi does not provide in-person doula services in Lubbock."},
            {"q": "Are there birth centers in Lubbock?", "a": "Lubbock currently has limited standalone birth center options. Most families deliver at one of the major hospital systems. Ask your care provider about birth center alternatives."}
        ]
    },
    "amarillo-tx": {
        "city": "Amarillo", "state": "TX",
        "hospitals": ["Baptist St. Anthony's Hospital", "Northwest Texas Healthcare System"],
        "birthCenters": [],
        "costLow": 650, "costHigh": 1800,
        "medicaidNote": "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Amarillo area. Confirm with your Medicaid plan.",
        "insuranceNote": "Some private insurers in the Amarillo region now cover doula support as part of maternal wellness benefits. Contact your plan.",
        "culture": "Amarillo is a Panhandle city where families often travel from surrounding rural areas to deliver. The birth community is small but dedicated.",
        "shelbiServesHere": False,
        "faqs": [
            {"q": "Does Medicaid cover doulas in Amarillo?", "a": "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits."},
            {"q": "How much does a doula cost in Amarillo?", "a": "$650 to $1,800 depending on experience and package. Costs in the Panhandle tend to be lower than in major Texas metros."},
            {"q": "Does True Joy Birthing work with Amarillo families?", "a": "The free app and birth plan work for any Amarillo birth setting. Virtual confidence sessions are available. Shelbi does not provide in-person doula services in Amarillo."},
            {"q": "Are there doulas in Amarillo?", "a": "Amarillo has a small but growing doula community. If local availability is limited, virtual support and the free birth plan app can help you prepare."}
        ]
    },
    "corpus-christi-tx": {
        "city": "Corpus Christi", "state": "TX",
        "hospitals": ["Corpus Christi Medical Center", "HCA Texas Healthcare", "Driscoll Children's Hospital"],
        "birthCenters": [],
        "costLow": 750, "costHigh": 2100,
        "medicaidNote": "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Corpus Christi area. Confirm with your Medicaid plan.",
        "insuranceNote": "Some private insurers in the Coastal Bend region now cover doula support as part of maternal wellness benefits. Contact your plan.",
        "culture": "Corpus Christi is a coastal city with a growing birth community. Families deliver at the major hospital systems, and the area's diversity means a wide range of birth traditions and preferences.",
        "shelbiServesHere": False,
        "faqs": [
            {"q": "Does Medicaid cover doulas in Corpus Christi?", "a": "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits."},
            {"q": "How much does a doula cost in Corpus Christi?", "a": "$750 to $2,100 depending on experience and package."},
            {"q": "Does True Joy Birthing work with Corpus Christi families?", "a": "The free app and birth plan work for any Corpus Christi birth setting. Virtual confidence sessions are available. Shelbi does not provide in-person doula services in Corpus Christi."},
            {"q": "Which Corpus Christi hospitals accommodate birth plans?", "a": "Most major hospitals accommodate birth plans, but policies vary. Discuss your preferences during your hospital tour and bring your written birth plan."}
        ]
    },
    "laredo-tx": {
        "city": "Laredo", "state": "TX",
        "hospitals": ["Laredo Medical Center", "Doctors Hospital of Laredo", "Laredo Specialty Hospital"],
        "birthCenters": [],
        "costLow": 700, "costHigh": 1900,
        "medicaidNote": "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Laredo area. Confirm with your Medicaid plan.",
        "insuranceNote": "Some private insurers in the Laredo region now cover doula support as part of maternal wellness benefits. Contact your plan.",
        "culture": "Laredo is a border city with deep cultural traditions around birth and family. The birth community is growing, and many families value bilingual support.",
        "shelbiServesHere": False,
        "faqs": [
            {"q": "Does Medicaid cover doulas in Laredo?", "a": "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits."},
            {"q": "How much does a doula cost in Laredo?", "a": "$700 to $1,900 depending on experience and package. Doulas in border communities may offer sliding-scale fees."},
            {"q": "Does True Joy Birthing work with Laredo families?", "a": "The free app and birth plan work for any Laredo birth setting. Virtual confidence sessions are available. Shelbi does not provide in-person doula services in Laredo."},
            {"q": "Are there bilingual doulas in Laredo?", "a": "Yes, Laredo has bilingual doulas who serve both English- and Spanish-speaking families. Ask local doula networks for referrals."}
        ]
    },
}

TEMPLATE = """---
import Layout from '../../layouts/Layout.astro';

const city = "{city}";
const state = "{state}";
const pageTitle = `Birth Support in ${{city}}, ${{state}}`;
const pageDesc = `Find birth support resources in {city}, {state} — local hospital info, doula costs, Medicaid status, and a free birth plan built for local families.`;
const pageUrl = `https://truejoybirthing.com/birth-support/{slug}`;

const hospitals = {hospitals_json};
const birthCenters = {birth_centers_json};
const costLow = {cost_low};
const costHigh = {cost_high};
const medicaidNote = "{medicaid_note}";
const insuranceNote = "{insurance_note}";
const culture = "{culture}";
const shelbiServesHere = {shelbi_serves};

const faqs = {faqs_json};

const breadcrumbList = [{{"name": "Home", "url": "https://truejoybirthing.com/"}}, {{"name": "Birth Support", "url": "https://truejoybirthing.com/birth-support/"}}, {{"name": "{city}, {state}", "url": pageUrl}}];

const faqSchema = {{
  "@context": "https://schema.org",
  "@graph": [
    ...faqs.map((f, i) => ({{
      "@type": "Question",
      "@id": `https://truejoybirthing.com/birth-support/{slug}/#question-${{i+1}}`,
      "name": f.q,
      "acceptedAnswer": {{
        "@type": "Answer",
        "text": f.a
      }}
    }})),
    {{
      "@type": "FAQPage",
      "@id": `https://truejoybirthing.com/birth-support/{slug}/#faq`,
      "mainEntity": faqs.map((_, i) => ({{ "@id": `https://truejoybirthing.com/birth-support/{slug}/#question-${{i+1}}` }}))
    }},
    {{
      "@type": "LocalBusiness",
      "@id": `https://truejoybirthing.com/birth-support/{slug}/#local`,
      "name": "True Joy Birthing",
      "url": pageUrl,
      "address": {{
        "@type": "PostalAddress",
        "addressLocality": "{city}",
        "addressRegion": "{state}",
        "addressCountry": "US"
      }},
      "areaServed": {{
        "@type": "City",
        "name": "{city}"
      }},
      "parentOrganization": {{ "@id": "https://truejoybirthing.com/#organization" }}
    }}
  ]
}};

const schema = {{
  "@context": "https://schema.org",
  "@graph": [...faqSchema["@graph"]]
}};
---

<Layout
  title={{pageTitle}}
  description={{pageDesc}}
  canonical={{pageUrl}}
  breadcrumbList={{breadcrumbList}}
  schema={{schema}}
>

  <section class="bg-tjb-cream pt-16 pb-12">
    <div class="max-w-4xl mx-auto px-6">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">Birth Support in {city}, {state}</h1>
      <p class="text-lg text-tjb-gray mb-6">
        Local hospital options, doula costs, and Medicaid status — plus the free birth plan template families in {city} use to feel confident and prepared.
      </p>
      <div class="flex flex-col sm:flex-row gap-3">
        <a href="#download-pdf" class="bg-tjb-lavender-500 text-tjb-cream px-6 py-3 rounded-lg font-semibold hover:bg-tjb-rose-500 transition">
          Download Free Birth Plan</a>
        <a href="https://apps.apple.com/app/true-joy-birthing" class="bg-tjb-cream-50 text-tjb-lavender-500 border-2 border-tjb-lavender-500 px-6 py-3 rounded-lg font-semibold hover:bg-tjb-cream transition">
          Get the Free App</a>
      </div>
    </div>
  </section>

  <section class="py-16 bg-white">
    <div class="max-w-3xl mx-auto px-6 prose">

      <h2>What Birth Support Looks Like in {city}</h2>
      <p>{culture}</p>

      <p>Families in {city} often deliver at hospitals including:</p>
      <ul>
        {{hospitals.map(h => <li>{{h}}</li>)}}
      </ul>
      <p class="text-sm text-tjb-gray italic">Hospitals mentioned for context only. True Joy Birthing does not endorse any specific provider.</p>

      {{birthCenters.length > 0 && (
        <>
          <p>Birth center options in {city} may include:</p>
          <ul>
            {{birthCenters.map(bc => <li>{{bc}}</li>)}}
          </ul>
        </>
      )}}

      <h2>How Much Does a Doula Cost in {city}?</h2>
      <p>
        In {city}, birth doula services typically range from <strong>${{costLow.toLocaleString()}} to ${{costHigh.toLocaleString()}}</strong> depending on experience, package, and whether the doula offers add-on services like postpartum visits.
      </p>
      <p>{{insuranceNote}}</p>
      <p><strong>Medicaid Note:</strong> {{medicaidNote}}</p>

      <h2>Build Your Birth Plan for {city}</h2>
      <p>No matter where you deliver in {city}, a clear, organized birth plan helps you communicate your preferences to the team in your birth room.</p>
      <a href="#download-pdf" class="inline-block bg-tjb-lavender-500 text-tjb-cream px-6 py-3 rounded-lg font-semibold hover:bg-tjb-rose-500 transition mb-6">
        Download the Free Birth Plan</a>

      {{shelbiServesHere ? (
        <div class="bg-tjb-cream p-4 rounded-lg mb-6">
          <p class="font-semibold text-tjb-lavender-500 mb-1">Shelbi serves local families in the {city} area.</p>
          <p class="text-sm text-tjb-gray">Virtual confidence sessions are also available for families in {city}.</p>
          <a href="/birth-plan-session" class="text-tjb-lavender-500 font-semibold text-sm hover:underline">Book a session →</a>
        </div>
      ) : (
        <div class="bg-tjb-cream p-4 rounded-lg mb-6">
          <p class="font-semibold text-tjb-lavender-500 mb-1">Virtual support available for {city} families.</p>
          <p class="text-sm text-tjb-gray">The free app and birth plan work for any {city} birth setting. Virtual confidence sessions are available with Shelbi.</p>
          <a href="/birth-plan-session" class="text-tjb-lavender-500 font-semibold text-sm hover:underline">Book a virtual session →</a>
        </div>
      )}}

      <h2>Common Questions in {city}</h2>
      <div class="space-y-4">
        {{faqs.map(f => (
          <div>
            <h3 class="font-semibold mb-1">{{f.q}}</h3>
            <p class="text-tjb-gray">{{f.a}}</p>
          </div>
        ))}}
      </div>

      <h2>Nearby Resources</h2>
      <a href="/birth-support" class="text-tjb-lavender-500 font-semibold hover:underline">See all cities →</a>

    </div>
  </section>

  <section id="download-pdf" class="py-16 bg-tjb-cream">
    <div class="max-w-2xl mx-auto px-6 text-center">
      <h2 class="text-2xl md:text-3xl font-bold mb-4">Download Your Free Birth Plan</h2>
      <p class="text-tjb-gray mb-8">Built by a doula for hospital-planning moms everywhere.</p>
      <form id="lead-magnet-form" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input id="lead-email" name="email" type="email" placeholder="Your email" class="flex-1 px-4 py-3 rounded-lg border border-tjb-lavender-300 focus:outline-none focus:border-tjb-lavender-500" required />
        <button id="lead-submit" type="submit" class="bg-tjb-lavender-500 text-tjb-cream px-6 py-3 rounded-lg font-semibold hover:bg-tjb-rose-500 transition whitespace-nowrap">Get My Plan →</button>
      </form>
      <p id="lead-status" class="text-sm mt-2 hidden"></p>
      <p class="text-xs text-tjb-gray/70 mt-4">No spam. Just a free birth plan and occasional tips you can actually use.</p>
    </div>
  </section>

  <script>
    const form = document.getElementById('lead-magnet-form');
    const emailInput = document.getElementById('lead-email');
    const status = document.getElementById('lead-status');
    if (form) {{
      form.addEventListener('submit', async (e) => {{
        e.preventDefault();
        const email = emailInput?.value;
        if (!email) return;
        try {{
          const res = await fetch('/api/contact', {{
            method: 'POST',
            headers: {{ 'Content-Type': 'application/json' }},
            body: JSON.stringify({{ name: 'Lead Magnet', email, message: 'Lead magnet download request from city page' }})
          }});
          const data = await res.json();
          if (data.success) {{
            status.textContent = '✓ Check your email — your birth plan is on its way.';
            status.classList.remove('hidden', 'text-red-500');
            status.classList.add('text-green-600');
            emailInput.value = '';
          }} else {{
            status.textContent = 'Something went wrong. Please try again.';
            status.classList.remove('hidden', 'text-green-600');
            status.classList.add('text-red-500');
          }}
        }} catch {{
          status.textContent = 'Network error. Please try again.';
          status.classList.remove('hidden', 'text-green-600');
          status.classList.add('text-red-500');
        }}
      }});
    }}
  </script>

</Layout>
"""


def generate(slug, data):
    content = TEMPLATE.format(
        city=data["city"],
        state=data["state"],
        slug=slug,
        hospitals_json=json.dumps(data["hospitals"]),
        birth_centers_json=json.dumps(data["birthCenters"]),
        cost_low=data["costLow"],
        cost_high=data["costHigh"],
        medicaid_note=data["medicaidNote"].replace('"', '\\"'),
        insurance_note=data["insuranceNote"].replace('"', '\\"'),
        culture=data["culture"].replace('"', '\\"'),
        shelbi_serves="true" if data["shelbiServesHere"] else "false",
        faqs_json=json.dumps(data["faqs"], ensure_ascii=False),
    )
    path = os.path.join(BASE, f"{slug}.astro")
    with open(path, "w") as f:
        f.write(content)
    print(f"✅ {slug}.astro ({data['city']}, {data['state']})")


for slug, data in CITIES.items():
    generate(slug, data)

print(f"\nGenerated {len(CITIES)} city pages.")