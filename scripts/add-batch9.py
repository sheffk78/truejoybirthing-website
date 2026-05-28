#!/usr/bin/env python3
"""Add Batch 9 city entries to cities.ts"""
import re

# Read current file
with open("src/data/cities.ts", "r") as f:
    content = f.read()

# Batch 9 cities
new_entries = '''
  "bridgeport-ct": {
    city: "Bridgeport",
    state: "CT",
    slug: "bridgeport-ct",
    costLow: 800,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Bridgeport is Connecticut\u2019s largest city and a historically industrial port town on Long Island Sound where a diverse, working-class community meets one of the steepest maternity care access gaps in the state. Bridgeport Hospital (part of Yale New Haven Health) anchors the local birth community, and the city\u2019s large Hispanic and Black populations face some of the worst maternal health disparities in New England \u2014 making doula support not just nice-to-have but genuinely life-saving.",
    heroLocalDetail: "Bridgeport Hospital sits on Grant Street just off I-95 exit 27A, about 5 minutes from downtown and 10 minutes from the Stratford town line. I-95 and Route 8/25 are the main arteries, and the Route 8 connector can back up during afternoon rush. The city\u2019s walkable Seaside Park along Long Island Sound and the Pequonnock River Trail offer flat, paved routes for expecting moms. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "Bridgeport Hospital", paragraph: "Bridgeport Hospital, part of Yale New Haven Health on Grant Street, is the city\u2019s primary maternity hospital with a Level III NICU (stated directly on ynhhs.org) and maternal-fetal medicine specialists for high-risk pregnancies. It\u2019s the only Level III NICU in the Bridgeport area and serves as the regional referral center for Fairfield County. If you\u2019re delivering at Bridgeport Hospital, having your birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "St. Vincent\u2019s Medical Center", paragraph: "St. Vincent\u2019s Medical Center, on Main Street in Bridgeport\u2019s West End, is part of Hartford HealthCare and offers labor and delivery services with a NICU for babies needing extra support. Contact the hospital directly for current NICU level verification. St. Vincent\u2019s provides a community-hospital birth experience with 24/7 obstetric coverage and midwifery services. If we\u2019re being real, most Bridgeport families choose between Bridgeport Hospital and St. Vincent\u2019s based on which OB practice they\u2019re already established with." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Bridgeport, CT (Fairfield County). No freestanding birth centers currently operating.
    // Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "No \u2014 Connecticut HUSKY Health (Medicaid) does NOT cover doula services as of 2026. There is no statewide Medicaid reimbursement for doula care. Bridgeport families on HUSKY must pay out of pocket, though some community organizations like Bridgeport Healthy Start offer free or reduced-cost support.",
    insuranceNote: "Most private insurers in Connecticut (Anthem Blue Cross Blue Shield of CT, ConnectiCare, UnitedHealthcare, Aetna) do not cover doula services as a standard benefit. Some employer plans may offer reimbursement through HSA/FSA eligibility. Always call your insurer to confirm coverage before booking.",
    faqs: [
      { q: "Does Medicaid cover doulas in Bridgeport?", a: "No. Connecticut HUSKY Health (Medicaid) does not cover doula services as of 2026. Bridgeport families on HUSKY pay out of pocket for doula care. Some community organizations like Bridgeport Healthy Start may offer free or reduced-cost support \u2014 ask at your local WIC office." },
      { q: "How much does a doula cost in Bridgeport?", a: "Expect to pay $800 to $2,500 for a birth doula in the Bridgeport area. NYC metro proximity drives costs toward the higher end. Some doulas offer sliding-scale fees. Since HUSKY doesn\u2019t cover doulas, ask about payment plans. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Bridgeport hospitals accommodate birth plans?", a: "Bridgeport Hospital and St. Vincent\u2019s Medical Center both accommodate birth plans and generally welcome doulas. Bridgeport Hospital has a Level III NICU (stated directly on ynhhs.org). Always confirm current visitor policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Bridgeport?", a: "There are no freestanding birth centers currently operating in the Bridgeport area. Both hospitals offer midwifery services within a hospital setting. Families seeking out-of-hospital birth connect with home-birth midwives or travel to New Haven or NYC. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your birth preferences." },
      { q: "Does True Joy Birthing work with Bridgeport families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Bridgeport birth setting. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way \u2014 no signup required." },
    ],
    nearbyCities: ["hartford-ct", "new-haven-ct"],
  },

  "naperville-il": {
    city: "Naperville",
    state: "IL",
    slug: "naperville-il",
    costLow: 800,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Naperville is one of Illinois\u2019 wealthiest suburbs, sitting 30 miles west of Chicago in DuPage and Will counties with top-rated schools and a family-first culture that makes birth planning a priority. Edward Hospital (part of NorthShore \u2013 Endeavor Health) anchors the local birth community, and the city\u2019s proximity to Chicago gives families easy access to every level of specialty care.",
    heroLocalDetail: "Edward Hospital sits on South Washington Street in south Naperville just off I-88 at the Naperville Road exit, about 10 minutes from downtown. Route 59 and I-355 are the other main arteries, and afternoon rush on I-88 can add 10\u201315 minutes. Naperville\u2019s Riverwalk along the DuPage River and the Prairie Path offer flat, shaded walking trails popular with expecting moms. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "Edward Hospital", paragraph: "Edward Hospital (part of NorthShore \u2013 Endeavor Health), on South Washington Street in Naperville, is the city\u2019s primary maternity hospital with a Level III NICU (stated directly on northshore.org) and 24/7 maternal-fetal medicine coverage. If you\u2019re delivering at Edward, having your birth plan ready makes the intake conversation smoother. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "AMITA Health Adventist Medical Center Bolingbrook", paragraph: "AMITA Health Adventist Medical Center in Bolingbrook, about 15 minutes south via I-355, offers labor and delivery with a NICU for babies needing extra support. Contact the hospital directly for current NICU level verification. Convenient for families in south Naperville and Will County." },
    ],
    // No freestanding birth centers in Naperville/DuPage County. Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 Illinois Medicaid covers doula services as of January 2024 under HB 4430, with reimbursement of approximately $1,587 per pregnancy episode. Naperville families on Medicaid managed care plans can access doula services at no cost. Doulas must enroll as Illinois Medicaid providers through HFS.",
    insuranceNote: "Most private insurers in the Naperville area (BCBS of IL, UnitedHealthcare, Aetna, Cigna) do not yet cover doula services as a standard benefit. Some employer plans may offer reimbursement through HSA/FSA eligibility. Always call your insurer to confirm coverage before booking.",
    faqs: [
      { q: "Does Medicaid cover doulas in Naperville?", a: "Yes. Illinois Medicaid covers doula services under HB 4430, with approximately $1,587 in reimbursement for the full birth package. Your doula must be enrolled as an Illinois Medicaid provider. You deserve support, and Medicaid is now helping pay for it." },
      { q: "How much does a doula cost in Naperville?", a: "Expect to pay $800 to $2,500 for a birth doula in the Naperville area. Affluent western suburbs skew toward the higher end. If you\u2019re on Illinois Medicaid, doula services are covered at no cost. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Naperville hospitals accommodate birth plans?", a: "Edward Hospital has a Level III NICU (stated directly on northshore.org). AMITA Adventist in Bolingbrook is about 15 minutes south. Both accommodate birth plans and welcome doulas. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing what you want." },
      { q: "Are there birth centers in Naperville?", a: "No freestanding birth centers in Naperville or the western suburbs. Edward Hospital offers midwifery within a hospital setting. Families can travel to Chicago\u2019s PCC Community Wellness Center Birth Center in Berwyn (~30 min east). <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your preferences." },
      { q: "Does True Joy Birthing work with Naperville families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Naperville birth setting. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way \u2014 no signup required." },
    ],
    nearbyCities: ["chicago-il", "aurora-il", "peoria-il"],
  },

  "ann-arbor-mi": {
    city: "Ann Arbor",
    state: "MI",
    slug: "ann-arbor-mi",
    costLow: 800,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Ann Arbor is a university town where Michigan Medicine (UM Health) doesn\u2019t just anchor the birth community \u2014 it defines it. Home to one of the nation\u2019s top OB-GYN residency programs and a Level IV NICU, Ann Arbor draws high-risk pregnancy referrals from across the state. The local doula community is one of the most active in Michigan.",
    heroLocalDetail: "Michigan Medicine\u2019s Von Voigtlander Women\u2019s Hospital sits on East Medical Center Drive on the UM campus, about 5 minutes from downtown via Fuller Road. St. Joseph Mercy Chelsea is about 15 minutes west via I-94. I-94 and US-23 are the main arteries, and game-day traffic can add 20\u201330 minutes. The Nichols Arboretum and Huron River towpath are go-to walking spots for expecting moms. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "Michigan Medicine Von Voigtlander Women\u2019s Hospital", paragraph: "Michigan Medicine\u2019s Von Voigtlander Women\u2019s Hospital, on the UM campus, is one of the top maternity hospitals in the Midwest with a verified Level IV NICU and 24/7 maternal-fetal medicine. It\u2019s the regional referral center for complex pregnancies across southeastern Michigan. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "St. Joseph Mercy Chelsea", paragraph: "St. Joseph Mercy Chelsea, about 15 minutes west via I-94, offers labor and delivery in a community-hospital setting with a NICU for babies needing extra support. Contact the hospital directly for current NICU level verification. Good option for low-risk pregnancies in western Washtenaw County." },
    ],
    // No freestanding birth centers in Ann Arbor/Washtenaw County. Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 Michigan Medicaid covers doula services as of January 2023, with reimbursement of approximately $1,500 per pregnancy episode. Washtenaw County families on Medicaid can access doula services at no cost. Doulas must register as Michigan Medicaid providers through MDHHS.",
    insuranceNote: "Most private insurers (BCBS of MI, Priority Health, UnitedHealthcare, Aetna) do not yet cover doula services as a standard benefit. Some employer plans \u2014 especially from UM and tech employers \u2014 may offer HSA/FSA reimbursement. Always call your insurer to confirm coverage before booking.",
    faqs: [
      { q: "Does Medicaid cover doulas in Ann Arbor?", a: "Yes. Michigan Medicaid covers doula services as of January 2023, with approximately $1,500 in reimbursement. Your doula must be enrolled as a Michigan Medicaid provider. You deserve support, and Medicaid is now helping pay for it." },
      { q: "How much does a doula cost in Ann Arbor?", a: "Expect to pay $800 to $2,500. The university town\u2019s progressive culture means a robust doula market. If you\u2019re on Michigan Medicaid, doula services are covered at no cost. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Ann Arbor hospitals accommodate birth plans?", a: "Michigan Medicine\u2019s Von Voigtlander Women\u2019s Hospital has a verified Level IV NICU. St. Joseph Mercy Chelsea is 15 minutes west. Both accommodate birth plans and welcome doulas. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing what you want." },
      { q: "Are there birth centers in Ann Arbor?", a: "No freestanding birth centers currently operating. Michigan Medicine offers midwifery within the hospital. Families can travel to Detroit or Lansing for limited birth center options. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your preferences." },
      { q: "Does True Joy Birthing work with Ann Arbor families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app works for any Ann Arbor birth setting. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> \u2014 no signup required." },
    ],
    nearbyCities: ["detroit-mi"],
  },

  "rochester-mn": {
    city: "Rochester",
    state: "MN",
    slug: "rochester-mn",
    costLow: 700,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Rochester is Mayo Clinic\u2019s home city \u2014 a world-renowned medical destination where the birth community is defined by one institution that handles more high-risk pregnancies than almost anywhere in the Upper Midwest. The local doula scene, while smaller than the Twin Cities, is deeply connected to Mayo\u2019s integrative medicine philosophy.",
    heroLocalDetail: "Mayo Clinic\u2019s Methodist Hospital and Saint Marys Campus are both in central Rochester \u2014 Methodist on 2nd Street Southwest and Saint Marys nearby, about 5 minutes from downtown via Broadway (US-63). US-52 and I-90 are the main arteries, and the skyway system makes winter hospital navigation manageable. Silver Lake Park and the Douglas State Trail offer flat walking routes for expecting moms. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "Mayo Clinic \u2013 Methodist Hospital", paragraph: "Mayo Clinic\u2019s Methodist Hospital, in downtown Rochester, is one of the nation\u2019s premier maternity hospitals with a verified Level IV NICU and 24/7 maternal-fetal medicine. Mayo handles complex referrals from across the Upper Midwest. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Mayo Clinic \u2013 Saint Marys Campus", paragraph: "Mayo Clinic\u2019s Saint Marys Campus, also on 2nd Street Southwest, offers labor and delivery alongside Methodist. Saint Marys has a Level IV NICU (verified) and handles high-risk and complex pregnancies. Many families deliver at Saint Marys when Methodist is at capacity." },
    ],
    // No freestanding birth centers in Rochester/Olmsted County. Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 Minnesota Medicaid (Medical Assistance) covers doula services with one of the strongest programs in the country. Reimbursement is approximately $3,200 per pregnancy episode, with higher rates for doulas serving communities with health disparities. Olmsted County families on Medical Assistance can access doula services at no cost.",
    insuranceNote: "Most private insurers (BCBS of MN, Medica, UnitedHealthcare, Mayo Clinic Health Solutions) do not yet cover doula services as a standard benefit. Some employer plans \u2014 especially from Mayo Clinic and IBM \u2014 may offer HSA/FSA reimbursement. Minnesota\u2019s strong Medicaid doula coverage makes it one of the best states for low-income families to access doula care.",
    faqs: [
      { q: "Does Medicaid cover doulas in Rochester?", a: "Yes. Minnesota has one of the strongest Medicaid doula programs in the country, covering doula services with approximately $3,200 in reimbursement per pregnancy episode. Your doula must be enrolled as a Minnesota Medical Assistance provider." },
      { q: "How much does a doula cost in Rochester?", a: "Expect to pay $700 to $2,000. Lower than the Twin Cities but can rise for experienced doulas. If you\u2019re on Minnesota Medical Assistance, doula services are covered at no cost. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Rochester hospitals accommodate birth plans?", a: "Mayo Clinic\u2019s Methodist Hospital and Saint Marys Campus both accommodate birth plans and welcome doulas. Both have Level IV NICUs (verified). <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing what you want." },
      { q: "Are there birth centers in Rochester?", a: "No freestanding birth centers currently operating. Mayo Clinic offers midwifery within the hospital. Families can travel to the Twin Cities for birth center options. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your preferences." },
      { q: "Does True Joy Birthing work with Rochester families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app works for any Rochester birth setting. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> \u2014 no signup required." },
    ],
    nearbyCities: ["minneapolis-mn"],
  },

  "paterson-nj": {
    city: "Paterson",
    state: "NJ",
    slug: "paterson-nj",
    costLow: 800,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Paterson is New Jersey\u2019s third-largest city and a historically working-class, majority-minority community in Passaic County where New Jersey\u2019s first-in-the-nation Medicaid doula program matters most. St. Joseph\u2019s University Medical Center anchors the local birth community, and the city\u2019s large Hispanic and Black populations face some of the worst maternal health disparities in the state.",
    heroLocalDetail: "St. Joseph\u2019s University Medical Center sits on Main Street in Paterson just off Route 20, about 5 minutes from downtown. Route 80 and the Garden State Parkway are the main arteries, and the Route 20 corridor can back up during afternoon rush. Great Falls National Historical Park and the Passaic River walkway are Paterson\u2019s signature outdoor spaces. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "St. Joseph\u2019s University Medical Center", paragraph: "St. Joseph\u2019s University Medical Center, on Main Street in Paterson, is the city\u2019s primary maternity hospital with a Level III NICU (stated directly on stjosephshealth.org) and 24/7 obstetric coverage. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Hackensack Meridian Mountainside Medical Center", paragraph: "Hackensack Meridian Mountainside Medical Center, in Montclair about 15 minutes southeast via Route 46, offers labor and delivery with a NICU for babies needing extra support. Contact the hospital directly for current NICU level verification. Community-hospital alternative for Passaic County families." },
    ],
    // No freestanding birth centers in Paterson/Passaic County. Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 New Jersey Medicaid (NJ FamilyCare) covers doula services under one of the first-in-the-nation programs, with reimbursement of approximately $1,800 per pregnancy episode. Passaic County families on NJ FamilyCare can access doula services at no cost through enrolled providers.",
    insuranceNote: "Most private insurers in New Jersey (Horizon BCBS of NJ, Aetna, UnitedHealthcare, Cigna) do not yet cover doula services as a standard benefit. Some employer plans may offer HSA/FSA reimbursement. NJ\u2019s Medicaid doula program makes doula care accessible regardless of income.",
    faqs: [
      { q: "Does Medicaid cover doulas in Paterson?", a: "Yes. New Jersey has one of the first-in-the-nation Medicaid doula programs, covering doula services with approximately $1,800 in reimbursement per pregnancy episode. Your doula must be enrolled as a NJ FamilyCare provider. You deserve support, and NJ Medicaid is now paying for it." },
      { q: "How much does a doula cost in Paterson?", a: "Expect to pay $800 to $2,500. NYC metro proximity drives costs toward the higher end. If you\u2019re on NJ FamilyCare, doula services are covered at no cost. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Paterson hospitals accommodate birth plans?", a: "St. Joseph\u2019s University Medical Center has a Level III NICU (stated directly on stjosephshealth.org). Hackensack Meridian Mountainside in Montclair is about 15 minutes away. Both accommodate birth plans. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Paterson?", a: "No freestanding birth centers in Paterson. St. Joseph\u2019s offers midwifery within the hospital. Families can travel to Hoboken or NYC for birth center options. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your preferences." },
      { q: "Does True Joy Birthing work with Paterson families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app works for any Paterson birth setting. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> \u2014 no signup required." },
    ],
    nearbyCities: ["newark-nj"],
  },

  "erie-pa": {
    city: "Erie",
    state: "PA",
    slug: "erie-pa",
    costLow: 600,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Erie is Pennsylvania\u2019s only Great Lakes city \u2014 a working-class port town on Lake Erie\u2019s Presque Isle Bay where affordable living makes doula support more accessible than in bigger metros. UPMC Hamot and Saint Vincent Hospital anchor the local birth community, and Erie\u2019s low cost of living means doula prices are among the most affordable in Pennsylvania.",
    heroLocalDetail: "UPMC Hamot sits on State Street on Erie\u2019s east side just off I-90 exit 27 (Bayfront Parkway), about 5 minutes from downtown. Saint Vincent Hospital is on West 38th Street on the west side, about 10 minutes from downtown. I-90 and the Bayfront Parkway are the main arteries \u2014 lake-effect snow can slow your hospital drive from November through March. Presque Isle State Park\u2019s flat, paved trails along the bay are Erie\u2019s signature third-trimester walking spots. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "UPMC Hamot", paragraph: "UPMC Hamot, on State Street on Erie\u2019s east side, is the region\u2019s primary maternity hospital with a Level III NICU (stated directly on upmc.com) and 24/7 obstetric coverage. As part of the UPMC system, it handles complex referrals from across northwestern Pennsylvania and western New York. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Saint Vincent Hospital", paragraph: "Saint Vincent Hospital, on West 38th Street on Erie\u2019s west side (part of Allegheny Health Network), offers labor and delivery with a NICU for babies needing extra support. Contact the hospital directly for current NICU level verification. Convenient for families on Erie\u2019s west side and Millcreek Township." },
    ],
    // No freestanding birth centers in Erie/Erie County. Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 Pennsylvania Medicaid covers doula services as of 2024, with reimbursement of approximately $1,350 per pregnancy episode. Erie County families on Medicaid managed care plans can access doula services at no cost. Doulas must enroll as PA Medicaid providers through DHS.",
    insuranceNote: "Most private insurers in the Erie area (UPMC Health Plan, Highmark BCBS, UnitedHealthcare) do not yet cover doula services as a standard benefit. Some employer plans may offer HSA/FSA reimbursement. Erie\u2019s low cost of living means private-pay doula services are more affordable than in Pittsburgh or Philadelphia.",
    faqs: [
      { q: "Does Medicaid cover doulas in Erie?", a: "Yes. Pennsylvania Medicaid covers doula services with approximately $1,350 in reimbursement for the full birth package. Your doula must be enrolled as a PA Medicaid provider. You deserve support, and Medicaid is now helping pay for it." },
      { q: "How much does a doula cost in Erie?", a: "Expect to pay $600 to $1,800 \u2014 one of the most affordable rates in Pennsylvania. If you\u2019re on PA Medicaid, doula services are covered at no cost. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Erie hospitals accommodate birth plans?", a: "UPMC Hamot has a Level III NICU (stated directly on upmc.com). Saint Vincent Hospital offers a community-hospital alternative. Both accommodate birth plans and welcome doulas. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Erie?", a: "No freestanding birth centers in the Erie area. Both UPMC Hamot and Saint Vincent offer midwifery within a hospital setting. Families seeking out-of-hospital birth connect with home-birth midwives. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your preferences." },
      { q: "Does True Joy Birthing work with Erie families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app works for any Erie birth setting. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> \u2014 no signup required." },
    ],
    nearbyCities: ["pittsburgh-pa"],
  },
'''

# Insert before closing };
marker = "\n};\n\nexport const citySlugs"
if marker in content:
    new_content = content.replace(marker, new_entries.rstrip() + marker)
    with open("src/data/cities.ts", "w") as f:
        f.write(new_content)
    print(f"SUCCESS: Inserted 6 Batch 9 cities")
    print(f"New file size: {len(new_content)} bytes")
else:
    print("ERROR: Could not find insertion marker")
    # Try alternate patterns
    for alt in ["};\n\nexport const citySlugs", "};\r\n\r\nexport const citySlugs"]:
        if alt in content:
            print(f"Found alternate marker: {repr(alt[:20])}")