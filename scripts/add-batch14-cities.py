#!/usr/bin/env python3
"""Add Worcester MA, Springfield IL, Columbia MD to cities.ts"""

import re

CITIES_FILE = 'src/data/cities.ts'

# Read the file
with open(CITIES_FILE, 'r') as f:
    content = f.read()

# New city entries (inserted before the closing };
worcester_entry = '''
  "worcester-ma": {
    city: "Worcester",
    state: "MA",
    slug: "worcester-ma",
    costLow: 1000,
    costHigh: 2800,
    shelbiServesHere: false,
    culture: "Worcester\u2019s birth community is anchored by UMass Memorial, the largest hospital system in Central Massachusetts, and a growing network of community doulas who serve families across the region. The city\u2019s diversity \u2014 with large Vietnamese, Dominican, and Brazilian populations \u2014 means doulas here are accustomed to navigating language and cultural needs. MassHealth doula coverage since 2024 has been a game-changer for Worcester families who previously had to travel to Boston for affordable doula support.",
    heroLocalDetail: "At 38 weeks, you\u2019re probably familiar with the drive down Belmont Street to UMass Memorial \u2014 or mapping out the quickest route from your place in Vernon Hill or Greendale to the hospital. Elm Park and the East Side Bike Path give you flat, shaded walking for those last-weeks strolls when you just need to move.",
    hospitalDetails: [
      { name: "UMass Memorial Medical Center", paragraph: "UMass Memorial is Central Massachusetts\u2019s largest hospital and the only Level III NICU in Worcester, with maternal-fetal medicine specialists, midwifery services, and 24/7 obstetric anesthesiology. <a href=\\"/birth-plan-template/\\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Saint Vincent Hospital", paragraph: "Saint Vincent Hospital offers labor and delivery services on the west side of Worcester, with a NICU for babies who need extra support. If we\u2019re being real, UMass Memorial gets more of the high-risk referrals in the region, but Saint Vincent is a solid option for families living in the western neighborhoods." },
    ],
    // Birth center search: NPI 261QB0400X returned no results for Worcester MA. Google Maps and web search found no verified freestanding birth centers in Worcester. The nearest birth center options are in the greater Boston area (Birth Sanctuary Cambridge, approximately 45 minutes east). Verified 2026-06.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes \u2014 Massachusetts MassHealth covers doula services as of January 2024, with reimbursement of approximately $1,200 for a full package covering 2 prenatal visits, labor and delivery support, and 2 postpartum visits. Your doula must be enrolled as a MassHealth provider.",
    insuranceNote: "Massachusetts requires most private insurance plans through the state exchange (MA Health Connector) to cover maternity services. Doula coverage by private insurers is expanding \u2014 some Blue Cross Blue Shield of MA and Tufts Health Plan policies now include doula benefits. Check your plan documents or call member services and ask about \u2018certified doula services.\u2019",
    faqs: [
      { q: "How much does a doula cost in Worcester?", a: "Expect to pay $1,000 to $2,800 for a doula in Worcester. Costs tend to run a bit lower than Boston rates, but the community is smaller so start your search early. Some Worcester doulas also serve families in the surrounding towns like Shrewsbury, Auburn, and Holden. The investment typically covers prenatal visits, labor support, and postpartum check-ins. <a href=\\"/birth-plan-template/\\">Download the free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Worcester?", a: "Yes \u2014 Massachusetts MassHealth covers doula services as of January 2024, with approximately $1,200 for the full package (2 prenatal visits, labor support, and 2 postpartum visits). Your doula must be a MassHealth-enrolled provider, so ask upfront whether they accept MassHealth. This coverage is a real benefit for Worcester families \u2014 grab the <a href=\\"/birth-plan-template/\\">free birth plan template</a> and make sure your doula team knows your preferences." },
      { q: "Which hospitals in Worcester accommodate birth plans?", a: "UMass Memorial Medical Center (verified Level III NICU) and Saint Vincent Hospital both offer labor and delivery and generally accommodate birth plans. UMass Memorial is Central Massachusetts\u2019s regional referral center for high-risk pregnancies and has midwifery services available. Doulas are welcomed at both \u2014 confirm current visitor policies during your hospital tour. <a href=\\"/birth-plan-template/\\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Worcester?", a: "No \u2014 there are no freestanding birth centers in Worcester as of 2026. The nearest birth center is Birth Sanctuary Cambridge, approximately 45 minutes east. UMass Memorial offers midwifery-model care within the hospital setting for families seeking a lower-intervention approach. <a href=\\"/birth-plan-template/\\">Grab the free birth plan template</a> to think through your options." },
      { q: "Does True Joy Birthing work with Worcester families?", a: "True Joy Birthing provides free birth-prep tools for Worcester families. The free birth plan, checklist, and guided walkthrough in the app work for any Worcester birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What about postpartum support in Worcester?", a: "Worcester has a growing postpartum support network, including community health centers that offer lactation consulting and support groups. UMass Memorial\u2019s postpartum unit provides initial lactation support, and local doulas often include postpartum visits in their packages. If you\u2019re looking for ongoing postpartum doula support, start your search during pregnancy \u2014 the community is smaller than Boston\u2019s and providers book up. <a href=\\"/postpartum-doula/\\">Learn more about postpartum doula support</a>." },
    ],
    nearbyCities: ["boston-ma", "providence-ri", "hartford-ct"],
    publishedDate: "2026-06-08",
    lat: 42.2626,
    lng: -71.8019,
  },'''

springfield_entry = '''
  "springfield-il": {
    city: "Springfield",
    state: "IL",
    slug: "springfield-il",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Springfield is Illinois\u2019s capital city with a tight-knit birth community that punches above its size. As a smaller metro (about 115,000 people), families here benefit from having two major hospitals within city limits and a network of doulas who personally know the OB-GYN practices. Illinois Medicaid doula coverage since 2024 has been significant for Springfield families, where median household income trails the Chicago suburbs. The local doula scene is small but dedicated \u2014 you\u2019re more likely to get personal attention and flexible pricing here than in a saturated urban market.",
    heroLocalDetail: "At 38 weeks in Springfield, you\u2019re probably figuring out the drive to Memorial Medical Center on the south side or HSHS St. John\u2019s on the north \u2014 both easy to reach from most neighborhoods in under 15 minutes. Washington Park\u2019s paved paths are a local favorite for those last-months walks when you need to keep moving.",
    hospitalDetails: [
      { name: "Memorial Medical Center", paragraph: "Memorial Medical Center is Springfield\u2019s largest hospital with a Level III NICU (verified on memorial.health), maternal-fetal medicine specialists, and a midwifery practice. <a href=\\"/birth-plan-template/\\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "HSHS St. John\u2019s Hospital", paragraph: "HSHS St. John\u2019s Hospital on Springfield\u2019s north side offers labor and delivery with a NICU for babies who need extra support. If we\u2019re being real, Memorial gets most of the high-risk referrals in the region, but St. John\u2019s is a solid option, especially for families on the north and west sides of town." },
    ],
    // Birth center search: NPI 261QB0400X returned no results for Springfield IL. Google Maps and web search found no verified freestanding birth centers in Springfield. The nearest birth center options are in the greater Chicago area (approximately 200 miles north). Verified 2026-06.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes \u2014 Illinois Medicaid (Illinois Health Connect, Meridian, Molina, and other managed care plans) covers doula services under HB 4430, reimbursing up to approximately $1,500 per pregnancy for prenatal, labor, and postpartum support. Your doula must be enrolled as an Illinois Medicaid provider.",
    insuranceNote: "Whether doula services are covered by private insurance in the Springfield area varies by plan. Some Blue Cross Blue Shield of Illinois and Health Alliance policies include doula benefits. HSA and FSA funds can help cover out-of-pocket doula costs. Ask any doula you interview about payment plans and sliding-scale options \u2014 Springfield doulas are often more flexible on pricing than Chicago-area providers.",
    faqs: [
      { q: "How much does a doula cost in Springfield?", a: "Expect to pay $800 to $2,000 for a doula in Springfield. The local market is more affordable than Chicago rates, though the community of available doulas is smaller. Some Springfield doulas also serve families in nearby Decatur and Jacksonville. The investment typically covers prenatal visits, labor support, and postpartum check-ins. <a href=\\"/birth-plan-template/\\">Download the free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Springfield?", a: "Yes \u2014 Illinois Medicaid covers doula services under HB 4430, reimbursing up to approximately $1,500 per pregnancy for a full package of prenatal, labor, and postpartum support. Your doula must be an Illinois Medicaid-enrolled provider. This is real coverage, not a pilot program \u2014 ask your doula upfront whether they accept Medicaid. <a href=\\"/birth-plan-template/\\">Grab the free birth plan template</a> and make sure your doula team knows your preferences." },
      { q: "Which hospitals in Springfield accommodate birth plans?", a: "Memorial Medical Center (verified Level III NICU) and HSHS St. John\u2019s Hospital both offer labor and delivery and generally accommodate birth plans. Memorial is Springfield\u2019s regional referral center for high-risk pregnancies and has a midwifery practice. Doulas are welcomed at both \u2014 confirm current visitor policies during your hospital tour. <a href=\\"/birth-plan-template/\\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Springfield?", a: "No \u2014 there are no freestanding birth centers in Springfield as of 2026. Both Memorial Medical Center and HSHS St. John\u2019s offer midwifery-model care within the hospital setting. For families seeking a birth center experience, the nearest options are in the Chicago area, approximately 200 miles north. <a href=\\"/birth-plan-template/\\">Grab the free birth plan template</a> to think through your options." },
      { q: "Does True Joy Birthing work with Springfield families?", a: "True Joy Birthing provides free birth-prep tools for Springfield families. The free birth plan, checklist, and guided walkthrough in the app work for any Springfield birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What about postpartum support in Springfield?", a: "Springfield has community health centers and hospital-based lactation support, but the postpartum doula community is small. If you\u2019re looking for ongoing postpartum support, start your search during pregnancy. Some local doulas include postpartum visits in their birth packages, and a few offer postpartum-only packages. <a href=\\"/postpartum-doula/\\">Learn more about postpartum doula support</a>." },
    ],
    nearbyCities: ["chicago-il", "indianapolis-in"],
    publishedDate: "2026-06-08",
    lat: 39.7990,
    lng: -89.6440,
  },'''

columbia_entry = '''
  "columbia-md": {
    city: "Columbia",
    state: "MD",
    slug: "columbia-md",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Columbia is a planned community designed for families, and it shows in the birth support options. As a diverse, affluent suburb between Baltimore and DC, Columbia families have access to doulas who serve the entire Baltimore\u2013Washington corridor. Maryland Medicaid doula coverage since 2024 has been a meaningful win here, especially for the Howard County families who may not have considered doula support before. The local doula community draws from both Baltimore and DC networks \u2014 you\u2019ll find more options here than in a typical suburb of 100,000 people.",
    heroLocalDetail: "At 38 weeks in Columbia, you\u2019re probably mapping the drive to Howard County General in Town Center or calculating the 25-minute trip to a Baltimore hospital if your OB practices there. Lake Kittamaqundi and the paths around Wilde Lake give you flat, shaded walking for those final-weeks strolls \u2014 one of the advantages of a city built around green space.",
    hospitalDetails: [
      { name: "Howard County General Hospital", paragraph: "Howard County General Hospital is a Johns Hopkins affiliate right in Columbia\u2019s Town Center, offering labor and delivery with a NICU for babies who need extra support and direct access to Hopkins specialists for higher-risk cases. <a href=\\"/birth-plan-template/\\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Holy Cross Hospital", paragraph: "Holy Cross Hospital in nearby Silver Spring (about 20 minutes south) is a high-volume maternity hospital with a Level III NICU and one of the busiest L&D units in the DC suburbs. If we\u2019re being real, some Columbia families choose Holy Cross specifically for its NICU level and Turkish-born OB population \u2014 it\u2019s worth the drive if you want that extra layer of neonatal coverage." },
    ],
    // Birth center search: NPI 261QB0400X returned no results for Columbia MD. Google Maps and web search found no verified freestanding birth centers in Columbia or Howard County. The nearest birth center option is in the Baltimore area. Verified 2026-06.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes \u2014 Maryland Medicaid covers doula services as of 2024, with reimbursement rates including $450 for labor and delivery support, $75 per prenatal or postpartum visit (up to 4 visits), totaling up to $900 per pregnancy for Medicaid-enrolled doulas.",
    insuranceNote: "In the Columbia and Howard County area, many families have employer-sponsored insurance through Johns Hopkins Health System, CareFirst BlueCross BlueShield, or UnitedHealthcare. Doula coverage by private insurers is expanding \u2014 some policies now include doula benefits. Check your specific plan documents and ask about \u2018certified doula services.\u2019 HSA and FSA funds can also help cover out-of-pocket doula costs.",
    faqs: [
      { q: "How much does a doula cost in Columbia?", a: "Expect to pay $900 to $2,500 for a doula in the Columbia area. Howard County rates trend slightly higher than Baltimore prices but lower than DC rates, and many doulas serve the entire Baltimore\u2013DC corridor. The investment typically covers prenatal visits, labor support, and postpartum check-ins. <a href=\\"/birth-plan-template/\\">Download the free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Columbia?", a: "Yes \u2014 Maryland Medicaid covers doula services as of 2024, with up to $900 per pregnancy ($450 for labor support plus $75 per visit for up to 4 prenatal/postpartum visits). Your doula must be a Maryland Medicaid-enrolled provider. This is real coverage, not a pilot \u2014 ask upfront whether your doula accepts Medicaid. <a href=\\"/birth-plan-template/\\">Grab the free birth plan template</a> and make sure your doula team knows your preferences." },
      { q: "Which hospitals in Columbia accommodate birth plans?", a: "Howard County General Hospital (a Johns Hopkins affiliate, right in Columbia) and Holy Cross Hospital in Silver Spring both accommodate birth plans. Howard County General has direct access to Hopkins specialists for higher-risk cases, while Holy Cross has a Level III NICU. Doulas are welcomed at both \u2014 confirm current visitor policies during your hospital tour. <a href=\\"/birth-plan-template/\\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Columbia?", a: "No \u2014 there are no freestanding birth centers in Columbia or Howard County as of 2026. Howard County General Hospital offers midwifery-model care within the hospital setting. The nearest freestanding birth center options are in the Baltimore area. <a href=\\"/birth-plan-template/\\">Grab the free birth plan template</a> to think through what\u2019s right for your birth." },
      { q: "Does True Joy Birthing work with Columbia families?", a: "True Joy Birthing provides free birth-prep tools for Columbia families. The free birth plan, checklist, and guided walkthrough in the app work for any Columbia birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What about postpartum support in Columbia?", a: "Columbia has strong lactation support through Howard County General Hospital and local pediatric practices. The postpartum doula community draws from both Baltimore and DC networks, so you\u2019ll find more options than in most suburbs. Start your search during pregnancy if you want ongoing postpartum support. <a href=\\"/postpartum-doula/\\">Learn more about postpartum doula support</a>." },
    ],
    nearbyCities: ["baltimore-md", "richmond-va", "virginia-beach-va"],
    publishedDate: "2026-06-08",
    lat: 39.2139,
    lng: -76.8558,
  },'''

# Find the insertion point - just before the closing };
# Insert after the last city entry
last_closing_brace = content.rfind('\n  },')
if last_closing_brace == -1:
    print("ERROR: Could not find last city entry closing brace")
    exit(1)

# Find the position after the last city closing brace
insert_pos = last_closing_brace + 5  # After '\n  },'

# Build the insertion text
insertion = worcester_entry + springfield_entry + columbia_entry

# Insert
new_content = content[:insert_pos] + ',' + worcester_entry + springfield_entry + columbia_entry + content[insert_pos:]

# Write back
with open(CITIES_FILE, 'w') as f:
    f.write(new_content)

print("Successfully added Worcester MA, Springfield IL, Columbia MD")