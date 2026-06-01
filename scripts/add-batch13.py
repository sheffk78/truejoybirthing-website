#!/usr/bin/env python3
"""Add henderson-nv, surprise-az, west-jordan-ut to cities.ts"""

import re

filepath = "src/data/cities.ts"
with open(filepath, "r") as f:
    content = f.read()

# New city entries (alphabetical by slug)
new_entries = '''
  "henderson-nv": {
    city: "Henderson",
    state: "NV",
    slug: "henderson-nv",
    costLow: 1000,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Henderson sits at the southeast edge of the Las Vegas valley, where suburban quiet meets desert expanse. Families here are close enough to the Strip\\u2019s world-class medical infrastructure but far enough from the neon that neighborhoods feel like their own small city \\u2014 greenway trails along the Pittman Wash, master-planned communities in Green Valley Ranch and Anthem, and a cluster of parks that make the suburban stretch feel livable and real.",
    heroLocalDetail: "Henderson families delivering at St. Rose Dominican\\u2019s Siena Campus can expect about a 10\\u201315 minute drive from most neighborhoods \\u2014 longer during afternoon rush on St. Rose Parkway. Henderson Hospital on Galleria Drive is closer to the Green Valley Ranch area, usually under 10 minutes from homes south of the 215. I-515 and the 215 Beltway form the spine of your hospital routes; during afternoon rush (3\\u20136 PM), the St. Rose Parkway interchange backs up steadily. The Pittman Wash Trail and Cornerstone Park loop are popular third-trimester walks close to both hospitals.",
    hospitalDetails: [
      { name: "St. Rose Dominican Hospital \\u2013 Siena Campus", paragraph: "St. Rose Dominican\\u2019s Siena Campus, at 3001 St. Rose Parkway in Henderson, is the city\\u2019s primary maternity hospital with a verified Level III NICU (stated directly on strosehospitals.org) and a full labor and delivery program. Doulas are generally welcome, though visitor policies shift, so confirm during your hospital tour. If you\\u2019re delivering at Siena, having your birth plan in hand makes the intake conversation smoother \\u2014 they see a high volume of families and move fast. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> to get started." },
      { name: "Henderson Hospital", paragraph: "Henderson Hospital, at 1050 W. Galleria Drive, is part of The Valley Health System and offers Women\\u2019s and Children\\u2019s Services including labor and delivery. If we\\u2019re being real, the Siena Campus carries the heavier load for complex births and NICU cases in the area, but Henderson Hospital is the closer option for families in Green Valley Ranch and the southwest neighborhoods. Contact the hospital directly for current NICU level and maternity service details." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Henderson, NV. Google Maps "birth center henderson nv" found no freestanding
    // birth centers in Henderson proper. Las Vegas has Better Birth Center but
    // no birth centers operate within Henderson city limits. Verified 2026-06-01.
    birthCenterDetails: [],
    medicaidNote: "No \\u2014 Nevada Medicaid does not cover doula services as of 2026. That\\u2019s a real gap for Henderson families counting on insurance. HSA and FSA funds can cover doula fees, and some Las Vegas-area doulas offer sliding-scale pricing or community-based support. Ask individual doulas what\\u2019s available \\u2014 payment flexibility is common in the valley.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Las Vegas metro. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "How much does a doula cost in Henderson?", a: "Doulas in Henderson typically charge $1,000 to $3,000 depending on experience and services included. The Las Vegas metro range skews toward the higher end for experienced doulas. HSA and FSA accounts can often be used for doula fees. <a href=\\\"/birth-plan-template/\\\">Start with the free birth plan template</a> to figure out your priorities before interviewing." },
      { q: "Does Medicaid cover doulas in Henderson?", a: "No \\u2014 Nevada Medicaid does not currently cover doula services. But you still have options: HSA and FSA funds can cover doula fees, and some Las Vegas-area doulas offer sliding-scale rates. It\\u2019s worth asking any doula you interview about payment flexibility." },
      { q: "Which hospitals in Henderson accommodate birth plans?", a: "St. Rose Dominican\\u2019s Siena Campus (3001 St. Rose Parkway) is the primary maternity hospital for Henderson families, with a verified Level III NICU and a full L&D program. Henderson Hospital (1050 W. Galleria Drive) also offers Women\\u2019s and Children\\u2019s Services. Having a birth plan ready helps your care team support your preferences from the start \\u2014 especially when you\\u2019re already in labor." },
      { q: "Are there birth centers in Henderson?", a: "No freestanding birth centers operate in Henderson. Las Vegas has Better Birth Center about 20 minutes north, which is the closest option for families seeking an out-of-hospital birth. Some Las Vegas-area midwives attend home births in Henderson as well. <a href=\\\"/birth-plan-template/\\\">Start with the free birth plan template</a> to figure out what setting works best for you." },
      { q: "Does True Joy Birthing work with Henderson families?", a: "True Joy Birthing provides free birth-prep tools for Henderson families. The free birth plan, checklist, and guided walkthrough in the app work for any Henderson birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "Can my doula come to the hospital with me in Henderson?", a: "Yes \\u2014 both St. Rose Dominican Siena and Henderson Hospital allow doulas in labor and delivery. Visitor policies can shift, especially during flu season, so confirm with your hospital during your tour. Having your birth plan ready helps your care team know your preferences from the moment you walk in." },
    ],
    nearbyCities: ["las-vegas-nv", "reno-nv"],
  },
  "surprise-az": {
    city: "Surprise",
    state: "AZ",
    slug: "surprise-az",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Surprise grew from a retirement community into one of the fastest-growing family cities in the Phoenix West Valley. The city\\u2019s name still catches newcomers off guard, but the park system and spring-training ballparks make it feel like a real place to put down roots \\u2014 not just a sprawl extension with a clever name. Families here are served by the Banner Health system, and the doula community is small but growing as young families move in.",
    heroLocalDetail: "Surprise families have two Banner hospitals within a short drive: Banner Del E. Webb Medical Center in Sun City West (about 10 minutes from central Surprise off the 303) and Banner Boswell Medical Center in Sun City (another 5 minutes south). During spring training season, traffic around the Surprise Recreation Campus can add a few minutes to the drive. The 303 loop connects both hospitals to most Surprise neighborhoods in under 15 minutes.",
    hospitalDetails: [
      { name: "Banner Del E. Webb Medical Center", paragraph: "Banner Del E. Webb Medical Center, at 14502 W. Meeker Blvd in Sun City West, is the primary maternity hospital for Surprise families with a verified Level III NICU (stated directly on bannerhealth.com) and a full Women\\u2019s and Infant Services program. It\\u2019s about a 10-minute drive from central Surprise. Doulas are generally welcome, though visitor policies can change, so confirm during your hospital tour. If you\\u2019re delivering here, having your birth plan ready makes the intake conversation smoother \\u2014 especially when you\\u2019re already in labor. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> to get started." },
      { name: "Banner Boswell Medical Center", paragraph: "Banner Boswell Medical Center, at 13020 N 103rd Ave in Sun City, also offers maternity services and is another option for Surprise families about 5 minutes past Del E. Webb. If we\\u2019re being real, most Surprise families delivering with Banner head to Del E. Webb for the Level III NICU, but Boswell\\u2019s Women\\u2019s Center is a closer option for routine deliveries if you live on the Surprise west side." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Surprise, AZ. Google Maps "birth center surprise az" found no freestanding
    // birth centers. Phoenix has birth centers (AZ Natural Health Center) about
    // 25-30 minutes east. No birth centers operate within Surprise city limits.
    // Verified 2026-06-01.
    birthCenterDetails: [],
    medicaidNote: "No \\u2014 Arizona\\u2019s AHCCCS (Medicaid) does not cover doula services as of 2026. State legislation for doula coverage has been proposed but not yet enacted. HSA and FSA funds can cover doula fees, and some West Valley doulas offer sliding-scale pricing. Ask any doula you interview about payment options.",
    insuranceNote: "Since AHCCCS doesn\\u2019t cover doulas in Arizona, check whether your private insurance covers out-of-network doula. Banner Health System plans and major Arizona insurers generally don\\u2019t include doula benefits. HSA and FSA funds are the most reliable payment route for Surprise families.",
    faqs: [
      { q: "How much does a doula cost in Surprise?", a: "Expect to pay $900 to $2,500 for a birth doula in the Surprise area. The West Valley range tends to be slightly lower than central Phoenix. HSA and FSA accounts can often be used for doula fees. <a href=\\\"/birth-plan-template/\\\">Start with the free birth plan template</a> to figure out what matters most to you." },
      { q: "Does Medicaid cover doulas in Surprise?", a: "No \\u2014 Arizona\\u2019s AHCCCS does not currently cover doula services. But you still have options: HSA and FSA funds can cover doula fees, and some West Valley doulas offer sliding-scale pricing. It\\u2019s worth asking any doula you interview about payment flexibility." },
      { q: "Which hospitals in Surprise accommodate birth plans?", a: "Banner Del E. Webb Medical Center in Sun City West has a verified Level III NICU (stated directly on bannerhealth.com) and is the primary maternity hospital for Surprise families, about 10 minutes from central Surprise. Banner Boswell Medical Center in Sun City also offers maternity services. Both hospitals accommodate birth plans and welcome doulas." },
      { q: "Are there birth centers in Surprise?", a: "No freestanding birth centers operate in Surprise. Phoenix has AZ Natural Health Center and other birth center options about 25\\u201330 minutes east. Some midwives attend home births in the West Valley. <a href=\\\"/birth-plan-template/\\\">Start with the free birth plan template</a> to figure out what birth setting works best for you." },
      { q: "Does True Joy Birthing work with Surprise families?", a: "True Joy Birthing provides free birth-prep tools for Surprise families. The free birth plan, checklist, and guided walkthrough in the app work for any Surprise birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "Can my doula come to the hospital with me in Surprise?", a: "Yes \\u2014 both Banner Del E. Webb and Banner Boswell allow doulas in labor and delivery. Banner\\u2019s visitor policies can shift seasonally, so confirm during your hospital tour. Having your birth plan ready helps your care team support your preferences from the start." },
    ],
    nearbyCities: ["phoenix-az", "scottsdale-az"],
  },
  "west-jordan-ut": {
    city: "West Jordan",
    state: "UT",
    slug: "west-jordan-ut",
    costLow: 800,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "West Jordan sits in the heart of the Salt Lake Valley\\u2019s west side, where big-box retail around the Jordan Landing shopping district meets quiet residential streets that roll up against the Oquirrh Mountains. It\\u2019s one of the fastest-growing cities in Utah, and the family density shows \\u2014 parks, splash pads, and well-attended community events make it feel like a place geared toward raising kids. The birth community draws from the broader Salt Lake network of midwives and doulas who serve the whole valley.",
    heroLocalDetail: "West Jordan families delivering at Holy Cross Hospital \\u2013 Jordan Valley (formerly Mountain Star Jordan Valley Medical Center) on 9000 South are usually about 5\\u201310 minutes from most neighborhoods. Intermountain Riverton Hospital is another 10 minutes south for families in the southwest part of West Jordan. The Mountain View Corridor and Bangerter Highway connect both hospitals to residential areas, but afternoon rush on Bangerter can add 10+ minutes if you\\u2019re heading south toward Riverton.",
    hospitalDetails: [
      { name: "Holy Cross Hospital \\u2013 Jordan Valley", paragraph: "Holy Cross Hospital \\u2013 Jordan Valley, at 3580 W 9000 S in West Jordan, is the city\\u2019s primary hospital with labor and delivery services and a NICU for babies needing extra support. Formerly Mountain Star Jordan Valley Medical Center, the hospital was rebranded under CommonSpirit Health in 2024. Contact the hospital directly for current NICU level information. Doulas are generally welcome, though visitor policies can shift, so confirm during your tour. If you\\u2019re delivering here, having your birth plan ready makes the intake conversation smoother \\u2014 especially when you\\u2019re already in labor. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> to get started." },
      { name: "Intermountain Health Riverton Hospital", paragraph: "Intermountain Health Riverton Hospital, at 3741 W 12600 S in Riverton, is about 10 minutes south of central West Jordan and offers labor and delivery with a NICU. Higher-level NICU cases are typically transferred to Intermountain Medical Center in Murray, which has a verified Level III NICU. If we\\u2019re being real, Riverton is the closer option for families in West Jordan\\u2019s southwest neighborhoods and has a more intimate feel than the larger academic centers in Salt Lake." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // West Jordan, UT. Google Maps "birth center west jordan" found no freestanding
    // birth centers. Better Birth LLC operates in the broader Salt Lake area but
    // no birth centers operate within West Jordan city limits. Verified 2026-06-01.
    birthCenterDetails: [],
    medicaidNote: "Yes \\u2014 Utah Medicaid covers doula services under HB 222, effective October 2024. Coverage includes prenatal visits, labor support, and postpartum visits, up to approximately $1,500 per pregnancy. If you\\u2019re on Utah Medicaid, this is a real benefit you can use. Ask your doula if they\\u2019re enrolled as a Medicaid doula provider, or contact your local health department for a list of enrolled providers.",
    insuranceNote: "Utah Medicaid covers doula services under HB 222, which is the strongest payment option for eligible families. For private insurance, coverage varies by plan \\u2014 SelectHealth and University of Utah Health Plans sometimes offer partial reimbursement. HSA and FSA funds can also be used for doula fees. Contact your insurance provider directly to confirm what\\u2019s covered.",
    faqs: [
      { q: "How much does a doula cost in West Jordan?", a: "Doulas in West Jordan typically charge $800 to $2,200 depending on experience and what\\u2019s included. Utah\\u2019s doula community is active and growing, and some doulas offer sliding-scale pricing for families on Medicaid. <a href=\\\"/birth-plan-template/\\\">Start with the free birth plan template</a> to figure out your priorities before you interview." },
      { q: "Does Medicaid cover doulas in West Jordan?", a: "Yes \\u2014 Utah Medicaid covers doula services under HB 222, effective October 2024. Coverage includes prenatal visits, labor support, and postpartum visits, up to approximately $1,500 per pregnancy. If you\\u2019re on Medicaid, this is a real benefit you can use. Ask your doula if they\\u2019re enrolled as a Utah Medicaid doula provider." },
      { q: "Which hospitals in West Jordan accommodate birth plans?", a: "Holy Cross Hospital \\u2013 Jordan Valley (3580 W 9000 S) is the primary maternity hospital right in West Jordan, with L&D services and a NICU. Intermountain Riverton Hospital (3741 W 12600 S) is about 10 minutes south and also offers maternity services. Both welcome doulas and birth plans. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> to prepare for your delivery." },
      { q: "Are there birth centers in West Jordan?", a: "No freestanding birth centers operate in West Jordan. The Salt Lake Valley has midwifery practices and home-birth options, and some birth centers in other parts of the Salt Lake metro are accessible within 20\\u201330 minutes. <a href=\\\"/birth-plan-template/\\\">Start with the free birth plan template</a> to clarify what setting works best for you." },
      { q: "Does True Joy Birthing work with West Jordan families?", a: "True Joy Birthing provides free birth-prep tools for West Jordan families. The free birth plan, checklist, and guided walkthrough in the app work for any West Jordan birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "Can my doula come to the hospital with me in West Jordan?", a: "Yes \\u2014 both Holy Cross Jordan Valley and Intermountain Riverton allow doulas in labor and delivery. Utah hospitals generally support doula presence. Confirm visitor policies during your hospital tour, especially during flu season. Having your birth plan ready helps your care team know your preferences from the start." },
    ],
    nearbyCities: ["lehi-ut", "sandy-ut"],
  },
'''

# Find the insertion point - insert all three entries after beaverton-or

closing_bracket = content.rfind('\n};')
if closing_bracket == -1:
    print("ERROR: Could not find closing '};' in cities.ts")
    exit(1)

# Find the last comma before the closing bracket
# The last entry ends with ",\n  }," before "};"
# We need to insert after the last city entry

# Actually, let me find the beaverton-or entry (the last one) and insert after it
beaverton_end = content.find('nearbyCities: ["portland-or", "eugene-or"],\n  },')
if beaverton_end == -1:
    print("ERROR: Could not find beaverton-or entry")
    exit(1)

# Find the end of the beaverton-or entry
insert_pos = content.find('\n  },\n', beaverton_end) + len('\n  },\n')

# Insert the new entries right after beaverton-or
new_content = content[:insert_pos] + new_entries + content[insert_pos:]

with open(filepath, "w") as f:
    f.write(new_content)

print(f"Successfully inserted 3 cities at position {insert_pos}")

# Also add the new slugs to citySlugs - they're auto-generated from Object.keys
# so we don't need to manually add them