#!/usr/bin/env python3
"""Update Norfolk, Fremont, and Vancouver city entries."""
from __future__ import annotations
import re

with open("src/data/cities.ts", "r") as f:
    content = f.read()

# ---- 1. NORFOLK ----
old = (
    '    publishedDate: "2026-06-08",\n'
    '    lat: 36.8945,\n'
    '    lng: -76.259,\n'
    '  },\n'
    '  "fremont-ca": {'
)
new = (
    '    publishedDate: "2026-06-08",\n'
    '    heroImage: "/images/norfolk-va-birth-doula-skyline.webp",\n'
    '    enableBlogResources: true,\n'
    '    supportSceneAlt: "A doula walking alongside an expectant mom on the Elizabeth River Trail in Norfolk, Virginia",\n'
    '    midwifeInfo: {\n'
    '      paragraph: "Virginia licenses Certified Nurse-Midwives (CNMs) and Certified Professional Midwives (CPMs), with CNMs practicing in hospitals and CPMs attending out-of-hospital births. Virginia was among the first states to cover doula services through Medicaid (effective January 2024), making Norfolk a strong market for doula-supported births. Sentara Norfolk General employs hospital-based CNMs, and the Hampton Roads midwifery community includes both hospital and home-birth practitioners serving Norfolk families.",\n'
    '      credentialTypes: " (CNMs and CPMs)",\n'
    '      credentialDetail: "Virginia recognizes both CNMs (hospital practice) and CPMs (out-of-hospital), giving Norfolk families more provider options than states that only license CNMs,",\n'
    '    },\n'
    '    lat: 36.8945,\n'
    '    lng: -76.259,\n'
    '  },\n'
    '  "fremont-ca": {'
)
assert content.count(old) == 1, "Norfolk publishedDate not unique!"
content = content.replace(old, new, 1)

# Norfolk hospital thumbnails
old = (
    '      { name: "Sentara Norfolk General Hospital", paragraph: "Sentara Norfolk General Hospital is a 563-bed academic teaching hospital for Eastern Virginia Medical School and the Hampton Roads region\\u2019s only Level I trauma center. It has a full obstetrics program with a NICU for babies who need extra support and direct access to CHKD\\u2019s pediatric specialists for higher-risk cases. Doulas are generally welcome \\u2014 confirm current visitor policies during your hospital tour. If you\\u2019re delivering here, having your birth plan ready makes the whole check-in process smoother. <a href=\\\\\\"/birth-plan-template/\\\\\\\">Use our free hospital birth plan template</a> to get started." },\n'
    '      { name: "Children\\u2019s Hospital of The King\\u2019s Daughters", paragraph: "Children\\u2019s Hospital of The King\\u2019s Daughters (CHKD) is a 206-bed freestanding children\\u2019s hospital adjacent to Sentara Norfolk General in Ghent. While CHKD itself does not handle deliveries, its pediatric and neonatal specialists work closely with Sentara\\u2019s L&D team for any infant needing advanced care after birth." },'
)
new = (
    '      { name: "Sentara Norfolk General Hospital", thumbnail: "/images/sentara-norfolk-hospital.webp", paragraph: "Sentara Norfolk General Hospital is a 563-bed academic teaching hospital for Eastern Virginia Medical School and the Hampton Roads region\\u2019s only Level I trauma center. It has a full obstetrics program with a NICU for babies who need extra support and direct access to CHKD\\u2019s pediatric specialists for higher-risk cases. Doulas are generally welcome \\u2014 confirm current visitor policies during your hospital tour. If you\\u2019re delivering here, having your birth plan ready makes the whole check-in process smoother. <a href=\\\\\\"/birth-plan-template/\\\\\\\">Use our free hospital birth plan template</a> to get started." },\n'
    '      { name: "Children\\u2019s Hospital of The King\\u2019s Daughters", thumbnail: "/images/chkd-hospital.webp", paragraph: "Children\\u2019s Hospital of The King\\u2019s Daughters (CHKD) is a 206-bed freestanding children\\u2019s hospital adjacent to Sentara Norfolk General in Ghent. While CHKD itself does not handle deliveries, its pediatric and neonatal specialists work closely with Sentara\\u2019s L&D team for any infant needing advanced care after birth." },'
)
assert content.count(old) == 1, "Norfolk hospitals not unique!"
content = content.replace(old, new, 1)

# Norfolk doulas
old = (
    '    birthCenterDetails: [\n'
    '    ],\n'
    '    medicaidNote: "Yes \\u2014 Virginia Medicaid covers doula services effective January 1, 2024.'
)
new = (
    '    birthCenterDetails: [\n'
    '    ],\n'
    '    localDoulas: [\n'
    '      { name: "Dynamic Family Doulas", credential: "Birth Doula", practice: "Dynamic Family Doulas", description: "Norfolk-based doula practice serving families across Hampton Roads. Offers birth doula support, childbirth education, and postpartum care." },\n'
    '      { name: "Enduring Love Doula", credential: "Birth Doula", practice: "Enduring Love Doula, LLC", description: "Birth and postpartum doula serving Norfolk and Hampton Roads families. Focuses on continuous labor support, evidence-based comfort techniques, and advocacy." },\n'
    '      { name: "Tina the Postpartum Doula", credential: "Postpartum Doula", practice: "Tina the Postpartum Doula | Chesapeake", description: "Dedicated postpartum doula serving Chesapeake and Hampton Roads. Specializes in overnight newborn care, feeding support, and postpartum recovery." },\n'
    '      { name: "Beach Babies Doula Services", credential: "Birth Doula", practice: "Beach Babies Doula Services", description: "Virginia Beach-based doula serving the Hampton Roads area including Norfolk. Offers birth doula packages, lactation support, and postpartum care." },\n'
    '      { name: "APL Doula Services", credential: "Birth Doula", practice: "APL Doula Services", description: "Experienced doula providing labor support, prenatal education, and postpartum care to Norfolk families." },\n'
    '      { name: "Hampton Roads Midwifery", credential: "LM, CPM", practice: "Hampton Roads Midwifery", isMidwife: true, description: "Licensed midwife serving Norfolk and the Hampton Roads area with home birth and birth center options." },\n'
    '      { name: "Sunflower Babies Midwifery", credential: "CPM, LM", practice: "Sunflower Babies Midwifery", isMidwife: true, description: "Norfolk-area midwife offering home birth services with personalized prenatal care and continuous labor support." },\n'
    '    ],\n'
    '    medicaidNote: "Yes \\u2014 Virginia Medicaid covers doula services effective January 1, 2024.'
)
assert content.count(old) == 1, "Norfolk birthCenter not unique!"
content = content.replace(old, new, 1)

# ---- 2. FREMONT ----
old = (
    '    publishedDate: "2026-06-08",\n'
    '    lat: 37.5256,\n'
    '    lng: -121.987,\n'
    '  },\n'
    '  "vancouver-wa": {'
)
new = (
    '    publishedDate: "2026-06-08",\n'
    '    heroImage: "/images/fremont-ca-birth-doula-skyline.webp",\n'
    '    enableBlogResources: true,\n'
    '    supportSceneAlt: "A doula walking alongside an expectant mom near Lake Elizabeth in Fremont, California",\n'
    '    midwifeInfo: {\n'
    '      paragraph: "California licenses Licensed Midwives (LMs) and Certified Nurse-Midwives (CNMs), with LMs attending home births and CNMs practicing in hospitals. California\\u2019s Medi-Cal program covers doula services through the PAVE program, reimbursing around $1,587 per pregnancy. Fremont\\u2019s East Bay location gives families access to both hospital-based midwifery at Washington Hospital and home birth midwives serving the wider Bay Area.",\n'
    '      credentialTypes: " (LMs and CNMs)",\n'
    '      credentialDetail: "California\\u2019s Licensed Midwife (LM) credential is one of the most established in the country, with clear regulations for out-of-hospital birth, meaning",\n'
    '    },\n'
    '    lat: 37.5256,\n'
    '    lng: -121.987,\n'
    '  },\n'
    '  "vancouver-wa": {'
)
assert content.count(old) == 1, "Fremont publishedDate not unique!"
content = content.replace(old, new, 1)

# Fremont El Camino thumbnail
old = (
    '      { name: "El Camino Health \\u2014 Mountain View", paragraph: "El Camino Health in Mountain View, about 15 minutes south of Fremont, is a popular choice for East Bay families wanting a dedicated birth center with a Level III NICU and one of the region\\u2019s highest-rated maternity programs. If you want the reassurance of a higher NICU level and don\\u2019t mind the short drive, El Camino is worth registering at." },'
)
new = (
    '      { name: "El Camino Health \\u2014 Mountain View", thumbnail: "/images/el-camino-hospital.webp", paragraph: "El Camino Health in Mountain View, about 15 minutes south of Fremont, is a popular choice for East Bay families wanting a dedicated birth center with a Level III NICU and one of the region\\u2019s highest-rated maternity programs. If you want the reassurance of a higher NICU level and don\\u2019t mind the short drive, El Camino is worth registering at." },'
)
assert content.count(old) == 1, "Fremont El Camino not unique!"
content = content.replace(old, new, 1)

# Fremont doulas
old = (
    '    birthCenterDetails: [\n'
    '    ],\n'
    '    medicaidNote: "Yes \\u2014 California\\u2019s Medi-Cal program covers doula services as a state benefit'
)
new = (
    '    birthCenterDetails: [\n'
    '    ],\n'
    '    localDoulas: [\n'
    '      { name: "Redwood Doulas", credential: "Birth Doula", practice: "Redwood Doulas", description: "East Bay doula collective serving Fremont and the wider Bay Area. Offers birth doula support, postpartum care, and childbirth education." },\n'
    '      { name: "Quetzal Doula", credential: "Birth Doula", practice: "Quetzal Doula", description: "Bay Area doula serving Fremont and the South Bay. Provides continuous labor support, prenatal education, and postpartum visits." },\n'
    '      { name: "Bay City Doulas", credential: "Birth Doula", practice: "Bay City Doulas", description: "Doula agency serving the Bay Area including Fremont. Matches families with experienced doulas for birth and postpartum support." },\n'
    '      { name: "East Bay Postpartum Doula Circle", credential: "Postpartum Doula", practice: "East Bay Postpartum Doula Circle", description: "Postpartum doula collective serving Fremont and East Bay families. Specializes in overnight newborn care, feeding support, and postpartum emotional wellness." },\n'
    '      { name: "Bay Area Night Doulas Collective", credential: "Night Doula", practice: "Bay Area Night Doulas Collective", description: "Night doula collective providing overnight newborn care, feeding support, and sleep guidance for Fremont and East Bay families." },\n'
    '      { name: "Sharon Craig", credential: "LM, MMid", practice: "Sharon Craig Midwifery", isMidwife: true, description: "Licensed Midwife serving Fremont and the East Bay. Provides comprehensive home birth midwifery care." },\n'
    '    ],\n'
    '    medicaidNote: "Yes \\u2014 California\\u2019s Medi-Cal program covers doula services as a state benefit'
)
assert content.count(old) == 1, "Fremont birthCenter not unique!"
content = content.replace(old, new, 1)

# Fremont nearby cities (fix)
old = 'nearbyCities: ["san-jose-ca", "oakland-ca", "fresno-ca", "bakersfield-ca"]'
new = 'nearbyCities: ["san-jose-ca", "oakland-ca", "hayward-ca", "pleasanton-ca"]'
fremont_start = content.find('"fremont-ca"')
assert old in content[fremont_start:content.find('"vancouver-wa"', fremont_start)], "Fremont nearbyCities not found!"
content = content.replace(old, new, 1)

# ---- 3. VANCOUVER WA ----
old = (
    '    publishedDate: "2026-06-08",\n'
    '    lat: 45.6352,\n'
    '    lng: -122.5972,\n'
    '  },\n'
    '};'
)
new = (
    '    publishedDate: "2026-06-08",\n'
    '    heroImage: "/images/vancouver-wa-birth-doula-skyline.webp",\n'
    '    enableBlogResources: true,\n'
    '    supportSceneAlt: "A doula walking alongside an expectant mom on the Vancouver Waterfront with Mount Hood in the distance",\n'
    '    midwifeInfo: {\n'
    '      paragraph: "Washington licenses both Licensed Midwives (LMs / LDM) and Certified Nurse-Midwives (CNMs), with a well-established regulatory framework for out-of-hospital birth. Washington\\u2019s Apple Health (Medicaid) program was an early adopter of doula coverage and has one of the most mature reimbursement programs in the country. Vancouver families benefit from this infrastructure, with many local doulas enrolled as Apple Health providers.",\n'
    '      credentialTypes: " (LMs and CNMs)",\n'
    '      credentialDetail: "Washington\\u2019s Licensed Midwife (LM) credential is one of the oldest and most respected in the U.S., with clear regulations for home birth and birth center practice, giving",\n'
    '    },\n'
    '    lat: 45.6352,\n'
    '    lng: -122.5972,\n'
    '  },\n'
    '};'
)
assert content.count(old) == 1, "Vancouver publishedDate not unique!"
content = content.replace(old, new, 1)

# Vancouver PeaceHealth thumbnail
old = (
    '      { name: "PeaceHealth Southwest Medical Center", paragraph: "PeaceHealth Southwest Medical Center is a 450-bed community hospital with the Holtzman Twins Neonatal Intensive Care Unit and the second-busiest obstetrics unit in the Portland metropolitan area. With around 3,000 births per year, the Family Birth Center handles a high volume and is used to working with doulas. Doulas are generally welcome \\u2014 confirm current policies during your hospital tour. If you\\u2019re delivering at PeaceHealth, having your birth plan ready makes everything smoother. <a href=\\"/birth-plan-template/\\">Use our free hospital birth plan template</a> to get started." },'
)
new = (
    '      { name: "PeaceHealth Southwest Medical Center", thumbnail: "/images/peacehealth-southwest.webp", paragraph: "PeaceHealth Southwest Medical Center is a 450-bed community hospital with the Holtzman Twins Neonatal Intensive Care Unit and the second-busiest obstetrics unit in the Portland metropolitan area. With around 3,000 births per year, the Family Birth Center handles a high volume and is used to working with doulas. Doulas are generally welcome \\u2014 confirm current policies during your hospital tour. If you\\u2019re delivering at PeaceHealth, having your birth plan ready makes everything smoother. <a href=\\"/birth-plan-template/\\">Use our free hospital birth plan template</a> to get started." },'
)
assert content.count(old) == 1, "Vancouver PeaceHealth not unique!"
content = content.replace(old, new, 1)

# Vancouver birth center + doulas
old = (
    '    // Nearest freestanding birth centers are in the Portland metro (Oregon side). Verified 2026-06-08.\n'
    '    birthCenterDetails: [\n'
    '    ],\n'
    '    medicaidNote: "Yes \\u2014 Washington State\\u2019s Apple Health (Medicaid) program covers doula services.'
)
new = (
    '    // Nearest freestanding birth centers are in the Portland metro (Oregon side). Verified 2026-06-08.\n'
    '    birthCenterDetails: [\n'
    '      { name: "The Bridge Birth Center", credential: "Freestanding Birth Center", address: "3300 NE 54th St, Vancouver, WA 98663", url: "http://www.bridgebirth.com", description: "A freestanding birth center in Vancouver offering personalized midwifery care in a home-like setting. Serves families seeking out-of-hospital birth with licensed midwives." },\n'
    '    ],\n'
    '    localDoulas: [\n'
    '      { name: "EnCourage Doula Care", credential: "Birth Doula", practice: "EnCourage Doula Care LLC", description: "Vancouver and Ridgefield doula offering birth doula support, postpartum care, and childbirth education." },\n'
    '      { name: "Inna Hudz", credential: "Birth Doula", practice: "Inna Hudz | WA Certified | Medicaid Provider", description: "Vancouver-based doula certified in Washington State and enrolled as an Apple Health (Medicaid) provider. Offers birth doula support in English and Russian." },\n'
    '      { name: "BirthLore - Heather Ward", credential: "Birth Doula", practice: "BirthLore", description: "Experienced birth doula serving the Vancouver-Portland metro area. Provides evidence-based labor support, prenatal planning, and postpartum guidance." },\n'
    '      { name: "Doula Mindy", credential: "Birth Doula", practice: "Doula Mindy", description: "Vancouver-area doula offering birth doula packages, postpartum support, and childbirth preparation." },\n'
    '      { name: "Suwannee Doula and Infant Care", credential: "Birth Doula", practice: "Suwannee Doula and Infant Care", description: "Vancouver doula providing birth doula support, postpartum care, and infant care services across Clark County." },\n'
    '      { name: "Monarch Midwifery", credential: "LM, CPM", practice: "Monarch Midwifery", isMidwife: true, description: "Vancouver midwifery practice offering home birth and birth center care. Licensed midwives providing comprehensive prenatal, birth, and postpartum care." },\n'
    '      { name: "Nest Midwifery", credential: "LM, CPM", practice: "Nest Midwifery | Battle Ground", isMidwife: true, description: "Battle Ground-area midwifery practice serving Vancouver and Clark County. Provides home birth services with personalized care." },\n'
    '    ],\n'
    '    medicaidNote: "Yes \\u2014 Washington State\\u2019s Apple Health (Medicaid) program covers doula services.'
)
assert content.count(old) == 1, "Vancouver birthCenter not unique!"
content = content.replace(old, new, 1)

# Vancouver nearby cities (fix seattle/eugene -> beaverton/hillsboro)
old = 'nearbyCities: ["portland-or", "tacoma-wa", "seattle-wa", "eugene-or"]'
new = 'nearbyCities: ["portland-or", "beaverton-or", "hillsboro-or", "tacoma-wa"]'
# Check this is in Vancouver section
vancouver_start = content.find('"vancouver-wa"')
vancouver_end = content.find("};", vancouver_start)
assert old in content[vancouver_start:vancouver_end], "Vancouver nearbyCities not found!"
content = content.replace(old, new, 1)

with open("src/data/cities.ts", "w") as f:
    f.write(content)

print("✅ All three city entries updated!")
print("  - Norfolk: hero, blog resources, hospital photos (2), 7 providers")
print("  - Fremont: hero, blog resources, El Camino photo, 6 providers, nearby cities fix")
print("  - Vancouver: hero, blog resources, PeaceHealth photo, Bridge Birth Center, 7 providers, nearby cities fix")
