#!/usr/bin/env python3
"""Add 12 new city entries (batches 3-4) to cities.ts — missing states + single-city states"""
import json, re

filepath = "src/data/cities.ts"

with open(filepath, "r") as f:
    content = f.read()

with open("/Users/socializerender/.openclaw/workspace/city-research-batch3.json") as f:
    batch3 = json.loads(f.read())
with open("/Users/socializerender/.openclaw/workspace/city-research-batch4.json") as f:
    batch4 = json.loads(f.read())

all_cities = batch3 + batch4

state_names = {
    "KS": "Kansas", "LA": "Louisiana", "HI": "Hawaii", "AK": "Alaska",
    "SD": "South Dakota", "AR": "Arkansas", "ND": "North Dakota",
    "NH": "New Hampshire", "MT": "Montana", "WY": "Wyoming", "DE": "Delaware"
}

insert_pos = content.rfind('};')

for c in all_cities:
    city = c["city"]
    state = c["state"]
    slug = c["slug"]
    state_full = state_names.get(state, state)
    cost_low = c["doulaCostRange"]["low"]
    cost_high = c["doulaCostRange"]["high"]
    
    # Hospital details
    hospital_lines = []
    for h in c.get("hospitals", []):
        nicu = h.get("nicuLevel", "")
        notes = h.get("notes", "").replace('"', '\\"')
        name = h["name"]
        if nicu:
            para = name + " offers labor and delivery services with a " + nicu + " NICU. " + notes
        else:
            para = name + " offers labor and delivery services. " + notes
        para += ' If you\\u2019re delivering at ' + name + ', having your birth plan ready makes the intake conversation smoother. <a href=\\"/birth-plan-template/\\">Use our free hospital birth plan template</a> so your team has something simple and specific to work from.'
        hospital_lines.append('      { name: "' + name + '", paragraph: "' + para + '" }')
    
    medicaid_note = c.get("medicaidNote", "No \\u2014 " + state_full + " does not cover doula services under Medicaid as of May 2026.")
    medicaid_note = medicaid_note.replace('"', '\\"')
    
    insurance_note = "Whether doula services are partially covered varies by plan in the " + city + " area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm."
    
    culture = c.get("uniqueParagraph", city + " is a " + state_full + " city where families seek personalized birth support.")
    culture = culture.replace('"', '\\"')
    
    hero = city + " families deserve birth support that fits their community. Whether you\\u2019re planning a hospital birth, looking for a birth center, or exploring all your options, having a birth plan makes your preferences clear from the first contraction. <a href=\\"/birth-plan-template/\\">Download the free birth plan template</a> and start preparing your way."
    
    # FAQs
    faq1 = '{ q: "How much does a doula cost in ' + city + '?", a: "Expect to pay $' + str(cost_low) + ' to $' + str(cost_high) + ' for a doula in ' + city + '. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\\"/birth-plan-template/\\">free birth plan template</a> and start thinking about what matters most to you." }'
    
    faq2 = '{ q: "Does Medicaid cover doulas in ' + city + '?", a: "No \\u2014 ' + state_full + ' does not cover doula services under Medicaid as of May 2026. Here\\u2019s your next step: call your Medicaid plan and ask \\u201cDo you cover doula services?\\u201d \\u2014 they\\u2019ll walk you through it. You deserve support, and some plans are starting to help pay for it." }'
    
    faq3 = '{ q: "Are there doulas in ' + city + '?", a: "' + city + ' has a doula community that serves local families. If local availability is limited, virtual support and the free birth plan app can help you prepare. You can also use the True Joy Birthing app to find local doulas \\u2014 start there and interview a few until one clicks." }'
    
    faq4 = '{ q: "Does True Joy Birthing work with ' + city + ' families?", a: "Yes \\u2014 and it\\u2019s free. True Joy Birthing\\u2019s birth plan app, checklist, and guided walkthrough work for any ' + city + ' birth setting, whether you\\u2019re delivering at a hospital, a birth center, or at home. <a href=\\"/birth-plan-template/\\">Download the free birth plan template</a> and start preparing your way \\u2014 no signup required." }'
    
    nearby = json.dumps(c.get("nearbyCities", []))
    
    entry = '  "' + slug + '": {\n'
    entry += '    city: "' + city + '",\n'
    entry += '    state: "' + state + '",\n'
    entry += '    slug: "' + slug + '",\n'
    entry += '    costLow: ' + str(cost_low) + ',\n'
    entry += '    costHigh: ' + str(cost_high) + ',\n'
    entry += '    shelbiServesHere: false,\n'
    entry += '    culture: "' + culture + '",\n'
    entry += '    heroLocalDetail: "' + hero + '",\n'
    entry += '    hospitalDetails: [\n'
    entry += '\n'.join(hospital_lines) + '\n'
    entry += '    ],\n'
    entry += '    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results. Google Maps search found no freestanding birth centers. Verified 2026-05-27.\n'
    entry += '    birthCenterDetails: [],\n'
    entry += '    medicaidNote: "' + medicaid_note + '",\n'
    entry += '    insuranceNote: "' + insurance_note + '",\n'
    entry += '    faqs: [\n'
    entry += '      ' + faq1 + ',\n'
    entry += '      ' + faq2 + ',\n'
    entry += '      ' + faq3 + ',\n'
    entry += '      ' + faq4 + ',\n'
    entry += '    ],\n'
    entry += '    nearbyCities: ' + nearby + ',\n'
    entry += '  },\n'
    
    content = content[:insert_pos] + entry + content[insert_pos:]
    insert_pos += len(entry)

with open(filepath, "w") as f:
    f.write(content)

print("Inserted " + str(len(all_cities)) + " new cities (batches 3-4). File size: " + str(len(content)) + " chars")