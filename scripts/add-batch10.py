#!/usr/bin/env python3
"""Add Batch 10 city entries to cities.ts."""
import re

with open("src/data/cities.ts", "r") as f:
    content = f.read()

new_entries = r'''
  "warwick-ri": {
    city: "Warwick",
    state: "RI",
    slug: "warwick-ri",
    costLow: 800,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Warwick is Rhode Island\u2019s second-largest city and the practical gateway to Providence for suburban families who want hospital access without city density. Kent Hospital anchors the local birth community, and Warwick\u2019s position at the junction of I-95 and Route 37 puts every major Rhode Island hospital within 20 minutes. Rhode Island\u2019s Medicaid doula coverage (via RIte Care) is one of the strongest in New England \u2014 and it matters here, where working-class families in Kent County face real access gaps.",
    heroLocalDetail: "Kent Hospital sits on Kilbee Street in Warwick just off Route 37, about 5 minutes from I-95 exit 15 and 10 minutes from T.F. Green Airport. I-95 and Route 37 are the main arteries, and Route 2 (Quaker Lane) connects Warwick to Cranston and Providence to the north. Goddard Memorial State Park\u2019s walking trails and the Warwick Pond shoreline are popular flat routes for expecting moms. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "Kent Hospital", paragraph: "Kent Hospital, on Kilbee Street in Warwick (part of Care New England), is the city\u2019s primary maternity hospital with a Level III NICU (stated directly on kenthospital.org) and 24/7 obstetric coverage. It\u2019s the main birthing hospital for Kent County families and handles a high volume of births from Warwick, Cranston, and Coventry. If you\u2019re delivering at Kent, having your birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Women & Infants Hospital (Providence)", paragraph: "Women & Infants Hospital, about 15 minutes north on I-95 in Providence, is Rhode Island\u2019s largest birthing hospital and one of the nation\u2019s leading OB-GYN hospitals with a verified Level IV NICU. It\u2019s the regional referral center for high-risk pregnancies across southeastern New England. Many Warwick families deliver at Women & Infants by choice or when Kent Hospital can\u2019t handle complex needs." },
    ],
    // No freestanding birth centers in Warwick/Kent County. Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 Rhode Island Medicaid (RIte Care) covers doula services as of January 2024, with reimbursement of approximately $1,500 per pregnancy episode. Kent County families on RIte Care can access doula services at no cost through enrolled providers. Doulas must register as Rhode Island Medicaid providers through EOHHS.",
    insuranceNote: "Most private insurers in Rhode Island (Blue Cross Blue Shield of RI, UnitedHealthcare, Tufts Health Plan) do not yet cover doula services as a standard benefit. Some employer plans \u2014 particularly those from major Rhode Island employers like Lifespan, CVS Health, and Brown University \u2014 may offer reimbursement through HSA/FSA eligibility. Always call your insurer to confirm coverage before booking.",
    faqs: [
      { q: "Does Medicaid cover doulas in Warwick?", a: "Yes. Rhode Island Medicaid (RIte Care) covers doula services as of January 2024, with approximately $1,500 in reimbursement for the full birth package. Your doula must be enrolled as a RIte Care provider. You deserve support, and Medicaid is now helping pay for it." },
      { q: "How much does a doula cost in Warwick?", a: "Expect to pay $800 to $2,500 for a birth doula in the Warwick area. Being in the Providence metro drives costs toward the higher end. If you\u2019re on RIte Care, doula services are covered at no cost \u2014 make sure your doula is enrolled. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Warwick hospitals accommodate birth plans?", a: "Kent Hospital in Warwick has a Level III NICU (stated directly on kenthospital.org). Women & Infants Hospital in Providence, about 15 minutes north, has a Level IV NICU and is one of the nation\u2019s top birthing hospitals. Both accommodate birth plans and welcome doulas. Always confirm current visitor policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing what you want." },
      { q: "Are there birth centers in Warwick?", a: "There are no freestanding birth centers currently operating in the Warwick area. Women & Infants Hospital in Providence offers midwifery services within a hospital setting. Rhode Island\u2019s small size means most families are within 30 minutes of Providence for specialist birth care. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your preferences." },
      { q: "Does True Joy Birthing work with Warwick families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Warwick birth setting, whether you\u2019re delivering at Kent Hospital, Women & Infants, or at home. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way \u2014 no signup required." },
    ],
    nearbyCities: ["providence-ri"],
  },

  "scottsdale-az": {
    city: "Scottsdale",
    state: "AZ",
    slug: "scottsdale-az",
    costLow: 900,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Scottsdale is the Phoenix metro\u2019s affluent northeast anchor \u2014 a city where resort-level healthcare meets a birth community shaped by year-round sunshine and a population that skews young-family-heavy in the northern neighborhoods. HonorHealth Scottsdale Osborn and Shea anchor the local birth community, and the city\u2019s wealth means more employer-covered doula benefits than almost anywhere in Arizona.",
    heroLocalDetail: "HonorHealth Scottsdale Osborn Medical Center sits on North Osborn Road just south of Downtown Scottsdale, about 5 minutes from the Loop 101 at Indian School Road. HonorHealth Scottsdale Shea Medical Center is on North Shea Boulevard in North Scottsdale, about 10 minutes from the Loop 101 at Shea. The Loop 101 and Loop 202 are the main arteries, and rush hour on the 101 between Scottsdale and Tempe can add 10\u201315 minutes. The Indian Bend Wash greenbelt and Camelback Mountain trails are Scottsdale\u2019s most popular walking spots for expecting moms. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "HonorHealth Scottsdale Osborn Medical Center", paragraph: "HonorHealth Scottsdale Osborn Medical Center, on North Osborn Road just south of Downtown Scottsdale, is the city\u2019s primary maternity hospital with a Level III NICU (stated directly on honorhealth.com) and 24/7 maternal-fetal medicine coverage. It\u2019s the highest-acuity birthing hospital in the Scottsdale area and handles complex pregnancies from across the northeast Valley. If you\u2019re delivering at Osborn, having your birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "HonorHealth Scottsdale Shea Medical Center", paragraph: "HonorHealth Scottsdale Shea Medical Center, on North Shea Boulevard in North Scottsdale, offers labor and delivery services with a NICU for babies needing extra support. Contact the hospital directly for current NICU level verification. Shea is a popular choice for families in North Scottsdale and Fountain Hills who want a community-hospital experience closer to home." },
    ],
    // No freestanding birth centers in Scottsdale/Maricopa County. Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "No \u2014 Arizona Medicaid (AHCCCS) does NOT cover doula services as of 2026. There is no statewide Medicaid reimbursement for doula care. Maricopa County families on AHCCCS must pay out of pocket for doula services, though some community organizations offer free or reduced-cost support \u2014 ask at your local WIC office.",
    insuranceNote: "Most private insurers in the Phoenix metro (Blue Cross Blue Shield of AZ, UnitedHealthcare, Aetna, Cigna) do not cover doula services as a standard benefit. However, Scottsdale\u2019s concentration of major employers (HonorHealth, CVS Health, Vanguard, Scottsdale Insurance) means some employer plans do offer doula reimbursement or HSA/FSA eligibility. Always call your insurer to confirm coverage before booking.",
    faqs: [
      { q: "Does Medicaid cover doulas in Scottsdale?", a: "No. Arizona Medicaid (AHCCCS) does not cover doula services as of 2026. Maricopa County families on AHCCCS pay out of pocket for doula care. Some community organizations offer free or reduced-cost support \u2014 ask at your local WIC office. You deserve support regardless of your insurance status." },
      { q: "How much does a doula cost in Scottsdale?", a: "Expect to pay $900 to $3,000 for a birth doula in the Scottsdale area. Affluent Northeast Valley neighborhoods drive costs toward the higher end. Some doulas offer sliding-scale fees or payment plans. Since AHCCCS doesn\u2019t cover doulas, ask about flexible payment options. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Scottsdale hospitals accommodate birth plans?", a: "HonorHealth Scottsdale Osborn and Shea both accommodate birth plans and generally welcome doulas. Osborn has a Level III NICU (stated directly on honorhealth.com). Always confirm current visitor and support-person policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing what you want." },
      { q: "Are there birth centers in Scottsdale?", a: "There are no freestanding birth centers currently operating in the Scottsdale area. Both HonorHealth hospitals offer midwifery services within a hospital setting. Families seeking a birth center experience can travel to central Phoenix for limited options. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your preferences." },
      { q: "Does True Joy Birthing work with Scottsdale families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Scottsdale birth setting, whether you\u2019re delivering at Osborn, Shea, or at home. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way \u2014 no signup required." },
    ],
    nearbyCities: ["phoenix-az"],
  },

  "chesapeake-va": {
    city: "Chesapeake",
    state: "VA",
    slug: "chesapeake-va",
    costLow: 800,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "Chesapeake is the Hampton Roads metro\u2019s southern anchor \u2014 a sprawling, family-heavy city where military connections (Naval Station Norfolk next door) and rural/suburban mix define the birth community. Chesapeake Regional Medical Center is the primary hospital, and the city\u2019s position between Norfolk and the Virginia/North Carolina border means families drive north for high-risk care and NICU support.",
    heroLocalDetail: "Chesapeake Regional Medical Center sits on Battlefield Boulevard just south of I-64 exit 296A, about 10 minutes from downtown Chesapeake and 15 minutes from Norfolk. I-64, I-464, and I-664 are the main arteries through the Hampton Roads area, and the I-64/I-664 interchange can back up during afternoon rush. Chesapeake\u2019s Oak Grove Lake Park and the Dismal Swamp Canal Trail offer flat, scenic walking routes for expecting moms. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "Chesapeake Regional Medical Center", paragraph: "Chesapeake Regional Medical Center, on Battlefield Boulevard just south of I-64, is the city\u2019s primary maternity hospital with a Level III NICU (stated directly on chesapeakeregional.com) and 24/7 obstetric coverage. It\u2019s the main birthing hospital for southern Hampton Roads families and handles a high volume of births from Chesapeake, Suffolk, and the Outer Banks. If you\u2019re delivering at Chesapeake Regional, having your birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Sentara Norfolk General Hospital", paragraph: "Sentara Norfolk General Hospital, about 15 minutes north on I-464 in Norfolk, is the region\u2019s Level I trauma center and has a verified Level III NICU for the highest-risk pregnancies. It\u2019s the referral destination when Chesapeake Regional can\u2019t handle complex cases. Many military families deliver at Sentara because of its proximity to Naval Station Norfolk." },
    ],
    // No freestanding birth centers in Chesapeake/Hampton Roads. Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 Virginia Medicaid covers doula services as of January 2024, with reimbursement of approximately $1,280 per pregnancy episode. Chesapeake families on Medicaid managed care plans (including Optima Health and Anthem Healthkeepers Plus) can access doula services at no cost through enrolled providers.",
    insuranceNote: "Most private insurers in Hampton Roads (Optima Health, Anthem Blue Cross Blue Shield, UnitedHealthcare) do not yet cover doula services as a standard benefit. Military families with TRICARE should note that TRICARE does not cover doula services. Some employer plans may offer HSA/FSA reimbursement. Always call your insurer to confirm coverage before booking.",
    faqs: [
      { q: "Does Medicaid cover doulas in Chesapeake?", a: "Yes. Virginia Medicaid covers doula services as of January 2024, with approximately $1,280 in reimbursement for the full birth package. Your doula must be enrolled as a Virginia Medicaid provider. You deserve support, and Medicaid is now helping pay for it." },
      { q: "How much does a doula cost in Chesapeake?", a: "Expect to pay $800 to $2,200 for a birth doula in the Chesapeake area. Military-family demand keeps the market active. If you\u2019re on Virginia Medicaid, doula services are covered at no cost \u2014 make sure your doula is enrolled. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Chesapeake hospitals accommodate birth plans?", a: "Chesapeake Regional Medical Center has a Level III NICU (stated directly on chesapeakeregional.com). Sentara Norfolk General, about 15 minutes north, has a Level III NICU for complex cases. Both accommodate birth plans and welcome doulas. Always confirm current visitor policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing what you want." },
      { q: "Does TRICARE cover doulas for military families in Chesapeake?", a: "No, TRICARE does not cover doula services as of 2026. Military families in the Hampton Roads area pay out of pocket for doula care. Virginia Medicaid (not TRICARE) does cover doulas if you qualify based on income. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Does True Joy Birthing work with Chesapeake families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app works for any Chesapeake birth setting, whether you\u2019re delivering at Chesapeake Regional, Sentara Norfolk, or at home. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> \u2014 no signup required." },
    ],
    nearbyCities: ["virginia-beach-va", "norfolk-va"],
  },

  "bowie-md": {
    city: "Bowie",
    state: "MD",
    slug: "bowie-md",
    costLow: 900,
    costHigh: 2800,
    shelbiServesHere: false,
    culture: "Bowie is Prince George\u2019s County\u2019s largest city and a family-first suburb strategically positioned between Washington DC and Annapolis \u2014 close enough to world-class hospital systems but with a community feel that makes birth planning feel less clinical. The University of Maryland Capital Region Medical Center in nearby Largo anchors the local birth community, and Bowie\u2019s affluence means more employer-covered doula benefits than most Maryland cities outside the DC core.",
    heroLocalDetail: "University of Maryland Capital Region Medical Center sits on Harry S. Truman Drive in Largo, about 10 minutes from Bowie via Route 214 (Central Avenue) and the Beltway. Anne Arundel Medical Center in Annapolis is about 20 minutes east via Route 50. Route 50 and Route 214 are the main arteries, and the DC Beltway (I-495/I-95) can add 15\u201320 minutes during afternoon rush. Bowie\u2019s Allen Pond Park and the WB&A Trail offer flat, family-friendly walking routes for expecting moms. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "University of Maryland Capital Region Medical Center (Largo)", paragraph: "UM Capital Region Medical Center, on Harry S. Truman Drive in Largo about 10 minutes from Bowie, is Prince George\u2019s County\u2019s primary maternity hospital with a Level III NICU (stated directly on umms.org) and 24/7 maternal-fetal medicine coverage. It replaced the old Prince George\u2019s Hospital Center in 2021 and is the main birthing hospital for Bowie, Largo, and surrounding communities. If you\u2019re delivering at UM Capital Region, having your birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Anne Arundel Medical Center (Annapolis)", paragraph: "Anne Arundel Medical Center (part of Luminis Health), about 20 minutes east via Route 50 in Annapolis, offers labor and delivery with a Level III NICU (stated directly on luminishealth.org) and midwifery services. It\u2019s a popular choice for Bowie families who prefer delivering in Anne Arundel County \u2014 shorter drive than DC hospitals, strong midwifery program, and a community-hospital feel." },
    ],
    // No freestanding birth centers in Bowie/PG County. Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 Maryland Medicaid covers doula services as of January 2024, with reimbursement of approximately $1,600 per pregnancy episode. Prince George\u2019s County families on Medicaid managed care plans (including Maryland Healthy Families and UnitedHealthcare Community Plan) can access doula services at no cost through enrolled providers.",
    insuranceNote: "Most private insurers in the DC metro (CareFirst Blue Cross Blue Shield, UnitedHealthcare, Aetna, Cigna) do not yet cover doula services as a standard benefit. However, Bowie\u2019s concentration of federal government and major employer plans means some do offer doula reimbursement through HSA/FSA eligibility. Always call your insurer to confirm coverage before booking.",
    faqs: [
      { q: "Does Medicaid cover doulas in Bowie?", a: "Yes. Maryland Medicaid covers doula services as of January 2024, with approximately $1,600 in reimbursement for the full birth package. Your doula must be enrolled as a Maryland Medicaid provider. You deserve support, and Medicaid is now helping pay for it." },
      { q: "How much does a doula cost in Bowie?", a: "Expect to pay $900 to $2,800 for a birth doula in the Bowie area. DC metro proximity drives costs toward the higher end. If you\u2019re on Maryland Medicaid, doula services are covered at no cost \u2014 make sure your doula is enrolled. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Bowie hospitals accommodate birth plans?", a: "UM Capital Region Medical Center in Largo (10 minutes from Bowie) has a Level III NICU (stated directly on umms.org). Anne Arundel Medical Center in Annapolis (20 minutes east) also has a Level III NICU. Both accommodate birth plans and welcome doulas. Always confirm current visitor policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing what you want." },
      { q: "Are there birth centers near Bowie?", a: "There are no freestanding birth centers currently operating in the Bowie/PG County area. Both UM Capital Region and Anne Arundel Medical Center offer midwifery services within a hospital setting. Families seeking a birth center experience can travel to Montgomery County or DC for limited options. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your preferences." },
      { q: "Does True Joy Birthing work with Bowie families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app works for any Bowie birth setting, whether you\u2019re delivering at UM Capital Region, Anne Arundel, or at home. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> \u2014 no signup required." },
    ],
    nearbyCities: ["annapolis-md"],
  },

  "lakewood-co": {
    city: "Lakewood",
    state: "CO",
    slug: "lakewood-co",
    costLow: 800,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Lakewood is the Denver metro\u2019s western anchor \u2014 a city of 160,000 squeezed between downtown Denver and the foothills, where St. Anthony Hospital sits on a hill overlooking the whole metro and families from Lakewood, Golden, and Morrison deliver at one of Colorado\u2019s busiest birthing hospitals. Colorado\u2019s Medicaid doula coverage is strong, and the local birth community is organized and active.",
    heroLocalDetail: "St. Anthony Hospital sits on Pierce Street in Lakewood on a bluff overlooking the Denver metro, about 5 minutes from I-70 and the C-470 interchange. It\u2019s one of the most accessible major hospitals in the Denver area \u2014 close to I-70, C-470, and US-6, and about 10 minutes from downtown Denver via I-70. The Bear Creek Greenbelt and William F. Hayden Park on Green Mountain are Lakewood\u2019s go-to walking spots for expecting moms who want flat trails with mountain views. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "St. Anthony Hospital", paragraph: "St. Anthony Hospital, on Pierce Street in Lakewood (part of CommonSpirit Health), is one of the Denver metro\u2019s busiest birthing hospitals with a Level III NICU (stated directly on sah-lakewood.commonspirit.org) and 24/7 maternal-fetal medicine coverage. It handles a high volume of births from Lakewood, Golden, Morrison, and the western suburbs. If you\u2019re delivering at St. Anthony, having your birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "SCL Health Lutheran Medical Center (Wheat Ridge)", paragraph: "SCL Health Lutheran Medical Center, about 10 minutes north in Wheat Ridge, offers labor and delivery with a Level III NICU (stated directly on sclhealth.org) and midwifery services. It\u2019s a strong alternative for families in northwest Lakewood and Wheat Ridge who want a community-hospital experience with NICU backup." },
    ],
    // No freestanding birth centers in Lakewood/Jefferson County. Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 Colorado Medicaid (Health First Colorado) covers doula services as of 2024, with reimbursement of approximately $1,500 per pregnancy episode (prenatal, labor, and postpartum visits). Jefferson County families on Health First Colorado can access doula services at no cost through enrolled providers.",
    insuranceNote: "Most private insurers in the Denver metro (Kaiser Permanente, UnitedHealthcare, Anthem Blue Cross Blue Shield, Cigna) do not yet cover doula services as a standard benefit. Some employer plans \u2014 particularly those from major Colorado employers like Lockheed Martin, Coors, and the federal government \u2014 may offer reimbursement through HSA/FSA eligibility. Always call your insurer to confirm coverage before booking.",
    faqs: [
      { q: "Does Medicaid cover doulas in Lakewood?", a: "Yes. Colorado Medicaid (Health First Colorado) covers doula services with approximately $1,500 in reimbursement for the full birth package. Your doula must be enrolled as a Health First Colorado provider. You deserve support, and Medicaid is now helping pay for it." },
      { q: "How much does a doula cost in Lakewood?", a: "Expect to pay $800 to $2,500 for a birth doula in the Lakewood area. Denver metro prices run toward the higher end. If you\u2019re on Health First Colorado, doula services are covered at no cost \u2014 make sure your doula is enrolled. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Lakewood hospitals accommodate birth plans?", a: "St. Anthony Hospital in Lakewood has a Level III NICU (stated directly on their website) and is the primary birthing hospital for the western suburbs. SCL Health Lutheran in Wheat Ridge (10 minutes north) also has a Level III NICU. Both accommodate birth plans and welcome doulas. Always confirm current visitor policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing what you want." },
      { q: "Are there birth centers in Lakewood?", a: "There are no freestanding birth centers currently operating in the Lakewood area. St. Anthony and Lutheran both offer midwifery services within a hospital setting. Families seeking a birth center experience can explore options in Denver proper. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your preferences." },
      { q: "Does True Joy Birthing work with Lakewood families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app works for any Lakewood birth setting, whether you\u2019re delivering at St. Anthony, Lutheran, or at home. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> \u2014 no signup required." },
    ],
    nearbyCities: ["denver-co"],
  },

  "beaverton-or": {
    city: "Beaverton",
    state: "OR",
    slug: "beaverton-or",
    costLow: 800,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Beaverton is the Portland metro\u2019s western engine \u2014 home to Nike\u2019s world headquarters and a diverse, tech-heavy population that makes it one of Oregon\u2019s most doula-aware cities. Providence St. Vincent Medical Center anchors the local birth community, and Oregon\u2019s Medicaid doula coverage (OHP) is one of the strongest in the country, making professional birth support accessible to more families here than almost anywhere else in the Pacific Northwest.",
    heroLocalDetail: "Providence St. Vincent Medical Center sits on Southwest Barnes Road in the Sylvan area between Beaverton and Portland\u2019s west hills, about 10 minutes from downtown Beaverton via Murray Boulevard. Tualatin Valley Highway (OR-8) and the Sunset Highway (US-26) are the main arteries, and the 217 connects Beaverton to I-5. Sunday traffic on US-26 into Portland can add 10\u201315 minutes. Beaverton\u2019s Tualatin Hills Park & Recreation District maintains some of the best flat walking trails in the metro \u2014 try the Fanno Creek Trail for third-trimester walks. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way.",
    hospitalDetails: [
      { name: "Providence St. Vincent Medical Center", paragraph: "Providence St. Vincent Medical Center, on Southwest Barnes Road between Beaverton and Portland\u2019s west hills, is the Portland metro\u2019s highest-volume birthing hospital with a Level III NICU (stated directly on providence.org) and 24/7 maternal-fetal medicine coverage. It handles more births than any other hospital in Oregon and serves as the referral center for complex pregnancies across western Oregon. If you\u2019re delivering at St. Vincent, having your birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Kaiser Permanente Westside Medical Center", paragraph: "Kaiser Permanente Westside Medical Center, on Northwest Cornell Road in Hillsboro about 15 minutes west via US-26, offers labor and delivery with a NICU for babies needing extra support. Contact the hospital directly for current NICU level verification. It\u2019s a popular choice for Kaiser members in the Beaverton-Hillsboro corridor who want to deliver within the Kaiser system." },
    ],
    // No freestanding birth centers in Beaverton. Portland birth centers are accessible.
    // Verified 2026-05-28.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 Oregon Health Plan (OHP) covers doula services with one of the strongest programs in the country, reimbursing approximately $1,500 for a full-spectrum package. Beaverton families on OHP are served by Health Share of Oregon and other Coordinated Care Organizations (CCOs). Contact your CCO to confirm doula benefits and find an enrolled provider.",
    insuranceNote: "Most private insurers in the Portland metro (Kaiser Permanente, Providence Health Plan, Regence BlueCross BlueShield, PacificSource) do not yet cover doula services as a standard benefit. Some employer plans \u2014 particularly those from Nike, Intel, and major tech employers in the Tualatin Valley \u2014 may offer reimbursement through HSA/FSA eligibility. Always call your insurer to confirm coverage before booking.",
    faqs: [
      { q: "Does Medicaid cover doulas in Beaverton?", a: "Yes. Oregon Health Plan (OHP) covers doula services with approximately $1,500 in reimbursement for a full-spectrum package. OHP is served by Health Share of Oregon and other CCOs in the Portland metro. Contact your CCO to find an enrolled provider. This is one of the best Medicaid doula programs in the country \u2014 use it." },
      { q: "How much does a doula cost in Beaverton?", a: "Expect to pay $800 to $2,500 for a birth doula in the Beaverton area. Portland metro prices run toward the higher end. If you\u2019re on OHP, doula services are covered at no cost \u2014 make sure your doula is enrolled. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Which Beaverton hospitals accommodate birth plans?", a: "Providence St. Vincent Medical Center has a Level III NICU (stated directly on providence.org) and is Oregon\u2019s highest-volume birthing hospital. Kaiser Permanente Westside in Hillsboro is about 15 minutes west. Both accommodate birth plans and welcome doulas. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing what you want." },
      { q: "Are there birth centers in Beaverton?", a: "No freestanding birth centers in Beaverton proper, but Portland has several accessible birth centers about 20\u201330 minutes east. Providence St. Vincent and Kaiser Westside both offer midwifery within a hospital setting. OHP covers birth center births at enrolled facilities. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to clarify your preferences." },
      { q: "Does True Joy Birthing work with Beaverton families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app works for any Beaverton birth setting, whether you\u2019re delivering at St. Vincent, Kaiser Westside, a birth center, or at home. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> \u2014 no signup required." },
    ],
    nearbyCities: ["portland-or", "eugene-or"],
  },
'''

# Insert before closing };
marker = "\n};\n\nexport const citySlugs"
if marker in content:
    new_content = content.replace(marker, new_entries.rstrip() + marker)
    with open("src/data/cities.ts", "w") as f:
        f.write(new_content)
    print(f"SUCCESS: Inserted 6 Batch 10 cities")
    print(f"New file size: {len(new_content)} bytes")
else:
    print("ERROR: Could not find insertion marker")