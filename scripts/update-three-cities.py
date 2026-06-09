"""Update Norfolk, Fremont, and Vancouver city entries with providers, heroes, hospital photos, and blog resources."""
import re

with open("src/data/cities.ts", "r") as f:
    content = f.read()

# ============================================================
# 1. NORFOLK - add localDoulas after birthCenterDetails
# ============================================================
norfolk_doulas_block = """
    localDoulas: [
      { name: "Dynamic Family Doulas", credential: "Birth Doula", practice: "Dynamic Family Doulas", description: "Norfolk-based doula practice serving families across Hampton Roads. Offers birth doula support, childbirth education, and postpartum care with a focus on evidence-based, compassionate care. Serving Norfolk, Virginia Beach, and surrounding areas." },
      { name: "Enduring Love Doula", credential: "Birth Doula", practice: "Enduring Love Doula, LLC", description: "Birth and postpartum doula serving Norfolk and Hampton Roads families. Focuses on continuous labor support, evidence-based comfort techniques, and advocacy throughout the birth journey." },
      { name: "Tina the Postpartum Doula", credential: "Postpartum Doula", practice: "Tina the Postpartum Doula", description: "Dedicated postpartum doula serving Chesapeake and Hampton Roads. Specializes in overnight newborn care, feeding support, and postpartum recovery to help families transition smoothly after birth." },
      { name: "APL Doula Services", credential: "Birth Doula", practice: "APL Doula Services", description: "Experienced doula providing labor support, prenatal education, and postpartum care to Norfolk families. Committed to helping you feel informed, supported, and confident throughout your birth experience." },
      { name: "Beach Babies Doula Services", credential: "Birth Doula", practice: "Beach Babies Doula Services", description: "Virginia Beach-based doula serving the Hampton Roads area including Norfolk. Offers birth doula packages, lactation support, and postpartum care with a warm, client-centered approach." },
      { name: "Hampton Roads Midwifery", credential: "LM, CPM", practice: "Hampton Roads Midwifery", isMidwife: true, description: "Licensed midwife serving Norfolk and the Hampton Roads area with home birth and birth center options. Provides comprehensive prenatal, birth, and postpartum care in a family-centered setting." },
      { name: "Sunflower Babies Midwifery", credential: "CPM, LM", practice: "Sunflower Babies Midwifery", isMidwife: true, description: "Norfolk-area midwife offering home birth services with personalized prenatal care, continuous labor support, and postpartum follow-up. Committed to empowering families through informed choice." },
    ],
"""

# Insert localDoulas after birthCenterDetails: [],
old = '    birthCenterDetails: [\n    ],\n    medicaidNote: "Yes'
new = '    birthCenterDetails: [\n    ],' + norfolk_doulas_block + '    medicaidNote: "Yes'
content = content.replace(old, new, 1)

# ============================================================
# 2. FREMONT - add heroImage, enableBlogResources, supportSceneAlt, midwifeInfo, hospital thumbs, localDoulas, fix nearbyCities
# ============================================================

# Add hero image, blog resources etc after publishedDate
fremont_published_line = '    publishedDate: "2026-06-08",\n    lat: 37.5256,\n    lng: -121.987,\n  },\n  "vancouver-wa": {'
fremont_new_fields = '    publishedDate: "2026-06-08",\n    heroImage: "/images/fremont-ca-birth-doula-skyline.webp",\n    enableBlogResources: true,\n    supportSceneAlt: "A doula walking alongside an expectant mom near Lake Elizabeth in Fremont, California",\n    midwifeInfo: {\n      paragraph: "California licenses Licensed Midwives (LMs) and Certified Nurse-Midwives (CNMs), with LMs attending home births and CNMs practicing in hospitals. California\u2019s Medi-Cal program covers doula services through the PAVE (Providing Access and doula Viability through Equity) program, reimbursing around $1,587 per pregnancy. Fremont\u2019s East Bay location gives families access to both hospital-based midwifery at Washington Hospital and home birth midwives serving the wider Bay Area.",\n      credentialTypes: " (LMs and CNMs)",\n      credentialDetail: "California\u2019s Licensed Midwife (LM) credential is one of the most established in the country, with clear regulations for out-of-hospital birth, meaning",\n    },\n    lat: 37.5256,\n    lng: -121.987,\n  },\n  "vancouver-wa": {'
content = content.replace(fremont_published_line, fremont_new_fields, 1)

# Add thumbnail for El Camino in Fremont
fremont_el_camino_old = '{ name: "El Camino Health \u2014 Mountain View", paragraph: "El Camino Health in Mountain View, about 15 minutes south of Fremont, is a popular choice for East Bay families wanting a dedicated birth center with a Level III NICU and one of the region\u2019s highest-rated maternity programs. If you want the reassurance of a higher NICU level and don\u2019t mind the short drive, El Camino is worth registering at." }'
fremont_el_camino_new = '{ name: "El Camino Health \u2014 Mountain View", thumbnail: "/images/el-camino-hospital.webp", paragraph: "El Camino Health in Mountain View, about 15 minutes south of Fremont, is a popular choice for East Bay families wanting a dedicated birth center with a Level III NICU and one of the region\u2019s highest-rated maternity programs. If you want the reassurance of a higher NICU level and don\u2019t mind the short drive, El Camino is worth registering at." }'
content = content.replace(fremont_el_camino_old, fremont_el_camino_new, 1)

# Fremont - add localDoulas after birthCenterDetails: [],
fremont_bc_old = '    birthCenterDetails: [\n    ],\n    medicaidNote: "Yes'
fremont_doulas_block = """    localDoulas: [
      { name: "Redwood Doulas", credential: "Birth Doula", practice: "Redwood Doulas", description: "East Bay doula collective serving Fremont and the wider Bay Area. Offers birth doula support, postpartum care, and childbirth education with a focus on personalized, evidence-based care." },
      { name: "Quetzal Doula", credential: "Birth Doula", practice: "Quetzal Doula", description: "Bay Area doula serving Fremont and the South Bay. Provides continuous labor support, prenatal education, and postpartum visits. Bilingual support available." },
      { name: "Bay City Doulas", credential: "Birth Doula", practice: "Bay City Doulas", description: "Doula agency serving the Bay Area including Fremont. Matches families with experienced doulas for birth and postpartum support. Known for their personalized matching process." },
      { name: "East Bay Postpartum Doula Circle", credential: "Postpartum Doula", practice: "East Bay Postpartum Doula Circle", description: "Postpartum doula collective serving Fremont and East Bay families. Specializes in overnight newborn care, feeding support, sibling adjustment, and postpartum emotional wellness." },
      { name: "Bay Area Night Doulas Collective", credential: "Night Doula", practice: "Bay Area Night Doulas Collective", description: "Night doula collective providing overnight newborn care, feeding support, and sleep guidance for Fremont and East Bay families. Helps parents get the rest they need during the fourth trimester." },
      { name: "Sharon Craig", credential: "LM, MMid", practice: "Sharon Craig Midwifery", isMidwife: true, description: "Licensed Midwife serving Fremont and the East Bay. Provides comprehensive home birth midwifery care with personalized prenatal, birth, and postpartum support." },
    ],
    """
content = content.replace(fremont_bc_old, fremont_bc_old.replace('    birthCenterDetails: [\n    ],\n    medicaidNote: "Yes', '    birthCenterDetails: [\n    ],' + fremont_doulas_block + '    medicaidNote: "Yes'), 1)

# Fix nearbyCities for Fremont
content = content.replace(
    'nearbyCities: ["san-jose-ca", "oakland-ca", "fresno-ca", "bakersfield-ca"]',
    'nearbyCities: ["san-jose-ca", "oakland-ca", "hayward-ca", "pleasanton-ca"]',
    1
)

# ============================================================
# 3. VANCOUVER WA
# ============================================================

# Add hero image, blog resources etc after publishedDate
vancouver_published_line = '    publishedDate: "2026-06-08",\n    lat: 45.6352,\n    lng: -122.5972,\n  },\n};'
vancouver_new_fields = '    publishedDate: "2026-06-08",\n    heroImage: "/images/vancouver-wa-birth-doula-skyline.webp",\n    enableBlogResources: true,\n    supportSceneAlt: "A doula walking alongside an expectant mom on the Vancouver Waterfront with Mount Hood in the distance",\n    midwifeInfo: {\n      paragraph: "Washington licenses both Licensed Midwives (LMs / LDM) and Certified Nurse-Midwives (CNMs), with a well-established regulatory framework for out-of-hospital birth. Washington\u2019s Apple Health (Medicaid) program was an early adopter of doula coverage and has one of the most mature reimbursement programs in the country. Vancouver families benefit from this established infrastructure, with many local doulas enrolled as Apple Health providers.",\n      credentialTypes: " (LMs and CNMs)",\n      credentialDetail: "Washington\u2019s Licensed Midwife (LM) credential is one of the oldest and most respected in the U.S., with clear regulations for home birth and birth center practice, giving",\n    },\n    lat: 45.6352,\n    lng: -122.5972,\n  },\n};'
content = content.replace(vancouver_published_line, vancouver_new_fields, 1)

# Add thumbnail for PeaceHealth in Vancouver
vancouver_peacehealth_old = '{ name: "PeaceHealth Southwest Medical Center", paragraph: "PeaceHealth Southwest Medical Center is a 450-bed community hospital with the Holtzman Twins Neonatal Intensive Care Unit and the second-busiest obstetrics unit in the Portland metropolitan area. With around 3,000 births per year, the Family Birth Center handles a high volume and is used to working with doulas. Doulas are generally welcome \u2014 confirm current policies during your hospital tour. If you\u2019re delivering at PeaceHealth, having your birth plan ready makes everything smoother. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> to get started." }'
vancouver_peacehealth_new = '{ name: "PeaceHealth Southwest Medical Center", thumbnail: "/images/peacehealth-southwest.webp", paragraph: "PeaceHealth Southwest Medical Center is a 450-bed community hospital with the Holtzman Twins Neonatal Intensive Care Unit and the second-busiest obstetrics unit in the Portland metropolitan area. With around 3,000 births per year, the Family Birth Center handles a high volume and is used to working with doulas. Doulas are generally welcome \u2014 confirm current policies during your hospital tour. If you\u2019re delivering at PeaceHealth, having your birth plan ready makes everything smoother. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> to get started." }'
content = content.replace(vancouver_peacehealth_old, vancouver_peacehealth_new, 1)

# Vancouver - add birthCenterDetails for The Bridge Birth Center
vancouver_bc_old = '    birthCenterDetails: [\n    ],\n    medicaidNote: "Yes'
vancouver_bc_new_block = """    birthCenterDetails: [
      { name: "The Bridge Birth Center", credential: "Freestanding Birth Center", address: "3300 NE 54th St, Vancouver, WA 98663", url: "http://www.bridgebirth.com", description: "A freestanding birth center in Vancouver offering personalized midwifery care in a home-like setting. Serves families seeking out-of-hospital birth with licensed midwives. The Bridge Birth Center provides prenatal care, labor and delivery, and postpartum support in a calm, family-centered environment." },
    ],
    localDoulas: [
      { name: "EnCourage Doula Care", credential: "Birth Doula", practice: "EnCourage Doula Care LLC", description: "Vancouver and Ridgefield doula offering birth doula support, postpartum care, and childbirth education. Focuses on helping families feel informed, empowered, and supported throughout their birth journey." },
      { name: "Inna Hudz", credential: "Birth Doula", practice: "Inna Hudz | WA State Certified | Medicaid Provider", description: "Vancouver-based doula certified in Washington State and enrolled as an Apple Health (Medicaid) provider. Offers birth doula support in English and Russian. Serves Vancouver and Clark County families." },
      { name: "BirthLore - Heather Ward", credential: "Birth Doula", practice: "BirthLore", description: "Experienced birth doula serving the Vancouver-Portland metro area. Provides evidence-based labor support, prenatal planning, and postpartum guidance. Committed to helping you have the birth experience you want." },
      { name: "Doula Mindy", credential: "Birth Doula", practice: "Doula Mindy", description: "Vancouver-area doula offering birth doula packages, postpartum support, and childbirth preparation. Known for calm, compassionate care and helping families feel confident walking into labor." },
      { name: "Suwannee Doula and Infant Care", credential: "Birth Doula", practice: "Suwannee Doula and Infant Care", description: "Vancouver doula providing birth doula support, postpartum care, and infant care services. Serves families across Clark County with personalized, attentive support." },
      { name: "Monarch Midwifery", credential: "LM, CPM", practice: "Monarch Midwifery", isMidwife: true, description: "Vancouver midwifery practice offering home birth and birth center care. Licensed midwives providing comprehensive prenatal, birth, and postpartum care in a family-centered model." },
      { name: "Nest Midwifery", credential: "LM, CPM", practice: "Nest Midwifery", isMidwife: true, description: "Battle Ground-area midwifery practice serving Vancouver and Clark County. Provides home birth services with personalized care, including prenatal visits, continuous labor support, and postpartum follow-up." },
    ],
    """
content = content.replace(vancouver_bc_old, '    birthCenterDetails: [\n    ],\n    medicaidNote: "Yes', 1)

# Replace the empty birthCenterDetails with our real data
# Actually the above would have left it as empty - let me fix this differently
# Find Vancouver's birthCenterDetails section in the modified content
vancouver_section_start = content.find('"vancouver-wa": {')
if vancouver_section_start > 0:
    # Find the birthCenterDetails block in Vancouver's section
    bc_start = content.find('    birthCenterDetails: [\n    ],', vancouver_section_start)
    if bc_start > 0:
        # Find the medicaidNote that follows
        med_start = content.find('    medicaidNote: "Yes', bc_start)
        if med_start > 0:
            before = content[:bc_start]
            after = content[med_start:]
            after = after.replace('    medicaidNote: "Yes', '    medicaidNote: "Yes', 1)  # keep the original
            content = before + vancouver_bc_new_block + after

# Fix nearbyCities for Vancouver
content = content.replace(
    'nearbyCities: ["portland-or", "tacoma-wa", "seattle-wa", "eugene-or"]',
    'nearbyCities: ["portland-or", "beaverton-or", "hillsboro-or", "tacoma-wa"]',
    1
)

with open("src/data/cities.ts", "w") as f:
    f.write(content)

print("All three city entries updated successfully!")
