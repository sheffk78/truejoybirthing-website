// ═══════════════════════════════════════════════════════════════
// City data — single source of truth for all birth-support pages
// ═══════════════════════════════════════════════════════════════

export interface HospitalDetail {
  name: string;
  paragraph: string;
}

export interface BirthCenterDetail {
  name: string;
  paragraph: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CityData {
  city: string;
  state: string;
  slug: string;
  costLow: number;
  costHigh: number;
  shelbiServesHere: boolean;
  culture: string;
  heroLocalDetail: string;
  hospitalDetails: HospitalDetail[];
  birthCenterDetails: BirthCenterDetail[];
  medicaidNote: string;
  insuranceNote: string;
  faqs: FaqItem[];
  nearbyCities: string[];
}

export const cities: Record<string, CityData> = {
  "amarillo-tx": {
    city: "Amarillo",
    state: "TX",
    slug: "amarillo-tx",
    costLow: 650,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Amarillo is a Panhandle city where families often travel from surrounding rural areas to deliver. The birth community is small but dedicated.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "Baptist St. Anthony's Hospital", paragraph: "Baptist St. Anthony's Hospital, in northwest Amarillo, is the largest hospital in the Panhandle and handles a high volume of births with a Level III NICU and a strong maternal-fetal medicine program. Doulas are generally welcome, though visitor policies can shift, so confirm during your hospital tour. If you're delivering at BSA, having your birth plan in hand makes the whole check-in process smoother \u2014 they see a lot of families and move fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Northwest Texas Healthcare System", paragraph: "Northwest Texas Healthcare System, also in Amarillo, is a Level III trauma center with a Level III NICU and a broad obstetric program that serves many Medicaid-covered families. Honestly, both hospitals here serve a huge geographic area \u2014 families drive hours from surrounding towns, so the L&amp;D units are used to handling a lot. If we're being real, that means coming in with your preferences written down is even more important." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Amarillo area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Amarillo region now cover doula support as part of maternal wellness benefits. Contact your plan.",
    faqs: [
      { q: "Does Medicaid cover doulas in Amarillo?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits." },
      { q: "How much does a doula cost in Amarillo?", a: "$650 to $1,800 depending on experience and package. Costs in the Panhandle tend to be lower than in major Texas metros." },
      { q: "Does True Joy Birthing work with Amarillo families?", a: "True Joy Birthing provides free birth-prep tools for Amarillo families. The free birth plan, checklist, and guided walkthrough in the app work for any Amarillo birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "Are there doulas in Amarillo?", a: "Amarillo has a small but growing doula community. If local availability is limited, virtual support and the free birth plan app can help you prepare." },
    ],
    nearbyCities: ["lubbock-tx"],
  },
  "arlington-tx": {
    city: "Arlington",
    state: "TX",
    slug: "arlington-tx",
    costLow: 850,
    costHigh: 2500,
    shelbiServesHere: true,
    culture: "Arlington sits midway between Dallas and Fort Worth in Tarrant County, with a large, diverse population. The birth community is active and accessible, with doulas serving families across the mid-cities area. Costs tend to be slightly lower than Dallas proper, making doula support more attainable for more families.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "Texas Health Arlington Memorial", paragraph: "Texas Health Arlington Memorial, near downtown Arlington off Randol Mill, handles a high volume of births and has a strong maternal-fetal medicine program. Doulas are generally welcome as part of your support team, though visitor policies can change, so check before your tour. If you're delivering here, having a birth plan ready makes the intake conversation smoother \u2014 especially when you're already in labor and don't want to be explaining everything from scratch. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Baylor Scott & White Arlington", paragraph: "Baylor Scott &amp; White Arlington is just a few blocks away and also sees a large volume of births, with a Level III NICU and 24/7 surgical coverage. It's a solid choice if you're planning a VBAC or managing a higher-risk pregnancy. If we're being real, both of Arlington's hospitals are busy community hospitals \u2014 they know how to handle birth plans, but you'll feel more confident walking in with your preferences written out and a doula who can help you hold the line." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Arlington area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Arlington area now cover doula support as part of maternal wellness benefits. Contact your plan for details.",
    faqs: [
      { q: "Does Medicaid cover doulas in Arlington?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the Arlington area." },
      { q: "Which hospitals in Arlington accommodate birth plans?", a: "Texas Health Arlington Memorial and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Arlington?", a: "$850 to $2,500 depending on experience and package." },
      { q: "Does True Joy Birthing work with Arlington families?", a: "True Joy Birthing provides free birth-prep tools for Arlington families. The free birth plan, checklist, and guided walkthrough in the app work for any Arlington hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "fort-worth-tx", "grand-prairie-tx"],
  },
  "austin-tx": {
    city: "Austin",
    state: "TX",
    slug: "austin-tx",
    costLow: 1000,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Austin has a strong and vocal birth center community. Alongside major hospital systems, the city is known for its progressive approach to maternal wellness and integrative care. Austin families tend to be well-researched and engaged in their birth options.",
    heroLocalDetail: "Austin traffic is no joke when you're 38 weeks pregnant and trying to get to St. David's on South Lamar \u2014 I-35 and MoPac both turn into parking lots during rush, and South Congress backs up from downtown all the way past Ben White. Know your fastest route to the hospital before you need it. Lady Bird Lake's trail is the unofficial third-trimester walk spot in Austin \u2014 flat, shaded, and you'll see about 20 other pregnant people doing the exact same thing.",
    hospitalDetails: [
      { name: "St. David's South Austin", paragraph: "St. David's South Austin Medical Center, in South Austin off Ben White Boulevard, is one of the busiest L&amp;D units in the city with a Level III NICU and a strong maternal-fetal medicine program. Doulas are generally welcome as part of your support team. If you're delivering at St. David's, bring your birth plan \u2014 this is one of the highest-volume birth hospitals in the city and having your preferences written down makes the conversation easier. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Seton Medical Center Austin", paragraph: "Seton Medical Center Austin, in Central Austin near the UT campus, is part of the Ascension/Seton system and has a strong high-risk pregnancy program alongside its Level III NICU. Dell Children's Medical Center is right next door for any NICU needs. If we're being real, Austin's hospital systems are big and busy \u2014 having a doula who knows the rhythm of your specific hospital makes a real difference when you're already in labor." },
    ],
    birthCenterDetails: [
      { name: "Austin Area Birthing Center and Natural Beginnings Birth and Wellness Center", paragraph: "Austin Area Birthing Center and Natural Beginnings Birth and Wellness Center both offer freestanding, midwife-led birth center options for families seeking a lower-intervention setting. These are good options for low-risk pregnancies if you want the birth center experience \u2014 and having a doula there who knows the rhythm of that space makes the whole thing feel a lot less unknown." },
    ],
    medicaidNote: "Texas Medicaid doula expansion is underway. In the progressive Austin area, some Medicaid plans may already offer doula coverage. Check with your specific plan.",
    insuranceNote: "Austin's progressive health culture means more insurers offer alternative care benefits including doula support. Tech-sector employers in the area increasingly include maternity wellness in coverage.",
    faqs: [
      { q: "Is Austin a good city for natural birth?", a: "Austin is known for its birth-friendly culture. The city has multiple birth centers and a community of providers who support varied birth preferences. Hospitals like St. David's South Austin accommodate diverse birth plans." },
      { q: "How much does a doula cost in Austin?", a: "$1,000 to $3,000. Austin's higher cost of living and strong doula community mean prices range higher than some Texas markets, but so does the level of experienced support." },
      { q: "Does True Joy Birthing serve Austin families?", a: "True Joy Birthing provides free birth-prep tools for Austin families. The free birth plan, checklist, and guided walkthrough in the app work for any Austin birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What are Austin's birth center options?", a: "Austin Area Birthing Center and Natural Beginnings are two well-established options. Both have strong community ties. Always verify their transfer agreements with nearby hospitals." },
    ],
    nearbyCities: ["san-antonio-tx", "houston-tx"],
  },
  "carrollton-tx": {
    city: "Carrollton",
    state: "TX",
    slug: "carrollton-tx",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: true,
    culture: "Carrollton sits at the junction of Dallas, Denton, and Collin counties \u2014 a central location that draws families from multiple directions. The city itself doesn't have a major hospital, so residents typically deliver at nearby facilities in Lewisville, Flower Mound, or Plano. This makes advance planning especially important.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "Medical City Lewisville", paragraph: "Medical City Lewisville, just north of Carrollton in Lewisville, has a Level III NICU and handles a high volume of births for the northern DFW suburbs. Doulas are generally welcome as part of your support team, though visitor policies can shift seasonally. Medical City Lewisville sees a lot of Carrollton families \u2014 it's close and well-equipped, but it moves fast, so come with your birth plan ready. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Texas Health Flower Mound", paragraph: "Texas Health Flower Mound, just northwest of Carrollton, has a strong women's services program with a Level III NICU. If we're being real, Carrollton families are driving 15-20 minutes to either of these hospitals anyway \u2014 so having your preferences in writing before you head out the door is even more important." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Carrollton area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Carrollton area now cover doula support as part of maternal wellness benefits. Contact your plan for details.",
    faqs: [
      { q: "Does Medicaid cover doulas in Carrollton?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the Carrollton area." },
      { q: "Which hospitals in Carrollton accommodate birth plans?", a: "Medical City Lewisville and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Carrollton?", a: "$900 to $2,500 depending on experience and package." },
      { q: "Does True Joy Birthing work with Carrollton families?", a: "True Joy Birthing provides free birth-prep tools for Carrollton families. The free birth plan, checklist, and guided walkthrough in the app work for any Carrollton hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "plano-tx", "denton-tx", "irving-tx"],
  },
  "corpus-christi-tx": {
    city: "Corpus Christi",
    state: "TX",
    slug: "corpus-christi-tx",
    costLow: 750,
    costHigh: 2100,
    shelbiServesHere: false,
    culture: "Corpus Christi is a coastal city with a growing birth community. Families deliver at the major hospital systems, and the area's diversity means a wide range of birth traditions and preferences.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "Corpus Christi Medical Center", paragraph: "Corpus Christi Medical Center, across its Doctors Regional and Bay Area campuses, is the main system serving the Coastal Bend with a Level III NICU and a high-volume L&amp;D unit. Doulas are generally welcome, though visitor policies can shift. This is the main game in town for hospital births \u2014 they see a huge volume of families and handle a wide range of pregnancies, so having your birth plan written out before you arrive makes everything easier. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Driscoll Children's Hospital", paragraph: "Driscoll Children's Hospital, adjacent to the medical center complex, provides Level IV NICU care for the region's most complex cases. While births happen at the neighboring hospital campuses, Driscoll is the reason families with high-risk pregnancies can feel more confident delivering in Corpus. If we're being real, Corpus has fewer options than the big metros \u2014 so knowing what to expect and having a plan written down matters even more." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Corpus Christi area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Coastal Bend region now cover doula support as part of maternal wellness benefits. Contact your plan.",
    faqs: [
      { q: "Does Medicaid cover doulas in Corpus Christi?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits." },
      { q: "How much does a doula cost in Corpus Christi?", a: "$750 to $2,100 depending on experience and package." },
      { q: "Does True Joy Birthing work with Corpus Christi families?", a: "True Joy Birthing provides free birth-prep tools for Corpus Christi families. The free birth plan, checklist, and guided walkthrough in the app work for any Corpus Christi birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "Which Corpus Christi hospitals accommodate birth plans?", a: "Most major hospitals accommodate birth plans, but policies vary. Discuss your preferences during your hospital tour and bring your written birth plan." },
    ],
    nearbyCities: ["san-antonio-tx", "laredo-tx"],
  },
  "dallas-tx": {
    city: "Dallas",
    state: "TX",
    slug: "dallas-tx",
    costLow: 900,
    costHigh: 2800,
    shelbiServesHere: true,
    culture: "Dallas is a large, diverse metro with a growing birth community. Families deliver at everything from high-volume hospitals to smaller community facilities and standalone birth centers. Medicaid expansion is making doula support more accessible.",
    heroLocalDetail: "If you're delivering at Texas Health Dallas, know that the LBJ Freeway stretch near Forest Lane can turn a 15-minute drive into 40 during afternoon rush \u2014 plan your route to the hospital before contractions start. And when those third-trimester evening walks become non-negotiable, White Rock Lake's loop trail is shaded, flat, and has enough bathrooms along the way that you're never too far from one.",
    hospitalDetails: [
      { name: "Texas Health Dallas", paragraph: "Texas Health Dallas on Harry Hines is one of the busiest L&amp;D units in the DFW metro \u2014 which means your care team has seen every kind of birth plan. Doulas are generally welcome, though visitor policies can shift seasonally, so confirm during your hospital tour. If we're being real, walking into a big hospital system without your preferences written down makes everything harder \u2014 so bring your birth plan and your doula, and you'll feel the difference. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Baylor University Medical Center", paragraph: "Baylor University Medical Center in Deep Ellum draws families from across Dallas for its high-risk and maternal-fetal medicine programs. If you're planning a VBAC or managing a high-risk pregnancy here, a doula can be the steady presence who helps you ask the right questions and hold steady in the room." },
      { name: "Parkland Memorial Hospital", paragraph: "Parkland Memorial Hospital, Dallas County's public hospital, handles an enormous volume of births and cares for many Medicaid-covered families. The team there is increasingly familiar with doulas and birth plans, but policies can shift, so it helps to come in with your preferences written down. Honestly, it's a lot to walk into a place that busy without a plan in your hands \u2014 so write one before you go." },
    ],
    birthCenterDetails: [
      { name: "The Birth Place at Dallas Birth Center", paragraph: "For families seeking a lower-intervention setting, The Birth Place at Dallas Birth Center offers midwife-led care in a standalone birth center environment. It's a good option if you want a birth center experience without leaving the city \u2014 and honestly, having a doula there who knows the rhythm of that space makes the whole thing feel a lot less unknown." },
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Dallas-Fort Worth area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers through the DFW metro area now cover doula support as part of maternal wellness benefits. Contact your plan.",
    faqs: [
      { q: "Does Medicaid cover doulas in Dallas?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits." },
      { q: "Which Dallas hospitals are birth-plan friendly?", a: "Many Dallas-area hospitals accommodate birth plans, but policies vary by facility. Texas Health Dallas and Baylor University Medical Center both see well-informed patients with clear preferences. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Dallas?", a: "$900 to $2,800 depending on experience and package." },
      { q: "Does True Joy Birthing work with Dallas families?", a: "True Joy Birthing provides free birth-prep tools for Dallas families. The free birth plan, checklist, and guided walkthrough in the app work for any Dallas hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["fort-worth-tx", "arlington-tx", "plano-tx", "garland-tx", "irving-tx"],
  },
  "denton-tx": {
    city: "Denton",
    state: "TX",
    slug: "denton-tx",
    costLow: 850,
    costHigh: 2300,
    shelbiServesHere: true,
    culture: "Denton is a vibrant college town north of the DFW metroplex with a young, health-conscious population. The city has a strong natural birth community and a respected birth center. Many Denton families are drawn to evidence-based birth preparation and value informed decision-making.",
    heroLocalDetail: "Denton's two hospitals are both right off I-35, which is convenient \u2014 except when there's an accident or game-day traffic from UNT, and then that 10-minute drive doubles. If you're delivering at Texas Health Denton, know your back-route through neighborhoods before you need it. The trail around North Lakes Park is where a lot of Denton moms walk in the third trimester \u2014 flat, quiet, and you won't have to dodge campus pedestrians the way you would on the Square.",
    hospitalDetails: [
      { name: "Texas Health Denton", paragraph: "Texas Health Denton, in South Denton off I-35E, has a Level III NICU and a strong maternal-fetal medicine program \u2014 it's the go-to for many Denton families. Doulas are generally welcome, though visitor policies can change. Texas Health Denton is well-equipped and busy, so having your birth plan and a doula who knows the flow makes everything smoother. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Medical City Denton", paragraph: "Medical City Denton, in North Denton, also has a Level III NICU and a solid obstetric program. Denton is lucky to have two strong hospitals \u2014 but both can get busy, especially during peak delivery seasons. Write your plan before contractions start." },
    ],
    birthCenterDetails: [
      { name: "Denton Birth Center", paragraph: "Denton Birth Center is a freestanding, midwife-led birth center offering a lower-intervention setting for low-risk pregnancies. It's a good option if you want a birth center experience without leaving the city \u2014 and having a doula there who knows the rhythm of that space makes the whole thing feel a lot less unknown." },
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Denton area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Denton area now cover doula support as part of maternal wellness benefits. Contact your plan for details.",
    faqs: [
      { q: "Does Medicaid cover doulas in Denton?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the Denton area." },
      { q: "Which hospitals in Denton accommodate birth plans?", a: "Texas Health Denton and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Denton?", a: "$850 to $2,300 depending on experience and package." },
      { q: "Does True Joy Birthing work with Denton families?", a: "True Joy Birthing provides free birth-prep tools for Denton families. The free birth plan, checklist, and guided walkthrough in the app work for any Denton hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "carrollton-tx", "frisco-tx"],
  },
  "el-paso-tx": {
    city: "El Paso",
    state: "TX",
    slug: "el-paso-tx",
    costLow: 800,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "El Paso has a vibrant, family-centered birth community with strong cultural traditions around pregnancy and delivery. Families deliver at major hospitals and a growing number of birth centers.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "University Medical Center El Paso", paragraph: "University Medical Center El Paso, off Alameda in south-central El Paso, is the region's public safety-net hospital and the only one with a maternal-fetal medicine fellowship program. It handles a high volume of births and cares for many Medicaid-covered families \u2014 if you're delivering there, you'll want a birth plan in hand because it's a busy place with a lot happening at once. Honestly, walking into a big public hospital without your preferences written down means relying on the charge nurse to remember everything \u2014 come prepared. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Las Palmas Medical Center and The Hospitals of Providence Memorial Campus", paragraph: "Las Palmas Medical Center, near downtown El Paso on North Oregon, and The Hospitals of Providence Memorial Campus, just up the street, both have Level III NICUs and strong obstetric programs. Las Palmas is part of HCA Healthcare and handles a broad mix of births, while Providence serves families across central El Paso. If we're being real, El Paso has fewer dedicated birth-support resources than the big DFW or Houston metros \u2014 which makes having a doula and a clear plan even more important when you're navigating these busy facilities." },
    ],
    birthCenterDetails: [
      { name: "El Paso Birth Center", paragraph: "El Paso Birth Center is the area's freestanding midwife-led birth center, offering a lower-intervention setting for families who want an out-of-hospital birth experience. It's a good option for low-risk pregnancies \u2014 and having a doula there who knows the rhythm of that space makes the whole thing feel a lot less unknown." },
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the El Paso area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the El Paso region now cover doula support as part of maternal wellness benefits. Contact your plan.",
    faqs: [
      { q: "Does Medicaid cover doulas in El Paso?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits." },
      { q: "How much does a doula cost in El Paso?", a: "$800 to $2,200 depending on experience and package. Doulas in border communities may offer sliding-scale fees." },
      { q: "Does True Joy Birthing work with El Paso families?", a: "True Joy Birthing provides free birth-prep tools for El Paso families. The free birth plan, checklist, and guided walkthrough in the app work for any El Paso birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "Which El Paso hospitals are birth-plan friendly?", a: "Many El Paso hospitals accommodate birth plans, but policies vary. University Medical Center and Las Palmas Medical Center both see informed patients with clear preferences. Always confirm during your hospital tour." },
    ],
    nearbyCities: ["lubbock-tx"],
  },
  "fort-worth-tx": {
    city: "Fort Worth",
    state: "TX",
    slug: "fort-worth-tx",
    costLow: 850,
    costHigh: 2600,
    shelbiServesHere: true,
    culture: "Fort Worth blends a western heritage with a growing, modern healthcare scene. The city has strong hospital systems and an emerging birth center community. Fort Worth families often value both tradition and informed, empowered birth experiences.",
    heroLocalDetail: "Texas Health Harris Methodist is right off University Drive downtown, and during TCU game days that whole area around the hospital gridlocks \u2014 if you're due in the fall, have your backup route mapped out before you need it. Clear Creek's walking trails up in Heritage Park are a quiet, shaded go-to for third-trimester walks \u2014 flat enough to be comfortable and close enough to the hospital district that you're not stranded if something picks up.",
    hospitalDetails: [
      { name: "Texas Health Harris Methodist Hospital", paragraph: "Texas Health Harris Methodist Hospital, in downtown Fort Worth, is one of the busiest hospitals in Tarrant County with a Level III NICU and a high-volume L&amp;D unit. Doulas are generally welcome \u2014 they handle a huge volume of births and they've seen every kind of birth plan. Bring yours and they'll work with it. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Cook Children's Medical Center", paragraph: "Cook Children's Medical Center, just north of downtown, provides Level IV NICU care alongside the labor and delivery services at Cook Women's." },
      { name: "JPS Health Network", paragraph: "JPS Health Network, Tarrant County's public hospital, handles more Medicaid births than almost anyone in the region \u2014 the care teams there know how to work with informed, prepared families, so bring your plan. If we're being real, delivering at JPS means walking into a very busy public hospital, and your birth plan is your voice in that room." },
    ],
    birthCenterDetails: [
      { name: "Fort Worth Birth Center", paragraph: "Fort Worth Birth Center is a freestanding, midwife-led birth center for families seeking a lower-intervention setting. It's a good option for low-risk pregnancies \u2014 and having a doula who knows the birth center space makes the whole experience feel more supported." },
    ],
    medicaidNote: "Texas Medicaid doula benefits are expanding. In the Fort Worth area, check your Tarrant County or surrounding-area Medicaid plan for current doula coverage.",
    insuranceNote: "Some Fort Worth-area insurers offer maternal wellness benefits that include doula coverage. Contact your insurance representative to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Fort Worth?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits." },
      { q: "Which Fort Worth hospitals are birth-plan friendly?", a: "Many Fort Worth-area hospitals accommodate birth plans, but policies vary by facility. Texas Health Harris Methodist and Cook Children's Medical Center both see well-informed patients with clear preferences. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Fort Worth?", a: "$850 to $2,600 depending on experience and package." },
      { q: "Does True Joy Birthing work with Fort Worth families?", a: "True Joy Birthing provides free birth-prep tools for Fort Worth families. The free birth plan, checklist, and guided walkthrough in the app work for any Fort Worth hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "arlington-tx", "grand-prairie-tx"],
  },
  "frisco-tx": {
    city: "Frisco",
    state: "TX",
    slug: "frisco-tx",
    costLow: 950,
    costHigh: 2700,
    shelbiServesHere: true,
    culture: "Frisco is one of the newest and fastest-growing cities in the DFW metroplex, known for its planned communities and young families. Healthcare infrastructure is modern and expanding. The doula community here is growing alongside the population \u2014 many birth professionals are building practices to serve new residents.",
    heroLocalDetail: "Frisco families: if your OB delivers at Baylor Scott & White on Legacy Drive, know that the intersection at Legacy and Lebanon can back up badly during afternoon rush \u2014 and that's the last thing you want to be figuring out when contractions are five minutes apart. Frisco Commons Park is a popular evening walk spot for third-trimester moms \u2014 flat paths, shaded trails, and enough other walkers that you don't feel like the only pregnant person in town.",
    hospitalDetails: [
      { name: "Baylor Scott & White Frisco", paragraph: "Baylor Scott &amp; White Frisco, in the Legacy Drive area, is one of the newest hospitals in the DFW North corridor with a Level III NICU and a high-volume L&amp;D unit. It's modern and well-equipped \u2014 designed for the volume of families coming through this area, which means they're used to birth plans but also very busy. Having yours ready makes the intake conversation go smoother. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Medical City Frisco", paragraph: "Medical City Frisco, also on the north side, has a Level III NICU and a strong obstetric program. Frisco's population has exploded, and both hospitals have scaled up fast. If we're being real, that means they're busy \u2014 come with your preferences written down and a doula who can help you hold the line." },
    ],
    birthCenterDetails: [
      { name: "Birth Center of Frisco", paragraph: "Birth Center of Frisco is a freestanding, midwife-led birth center offering a lower-intervention setting for low-risk pregnancies. It's a good option if you want the birth center experience close to home \u2014 and having a doula there who knows the rhythm of that space makes it feel a lot less unknown." },
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Frisco area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Frisco area now cover doula support as part of maternal wellness benefits. Contact your plan for details.",
    faqs: [
      { q: "Does Medicaid cover doulas in Frisco?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the Frisco area." },
      { q: "Which hospitals in Frisco accommodate birth plans?", a: "Baylor Scott & White Frisco and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Frisco?", a: "$950 to $2,700 depending on experience and package." },
      { q: "Does True Joy Birthing work with Frisco families?", a: "True Joy Birthing provides free birth-prep tools for Frisco families. The free birth plan, checklist, and guided walkthrough in the app work for any Frisco hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["plano-tx", "mckinney-tx", "denton-tx"],
  },
  "garland-tx": {
    city: "Garland",
    state: "TX",
    slug: "garland-tx",
    costLow: 800,
    costHigh: 2400,
    shelbiServesHere: true,
    culture: "Garland is a large, established suburb northeast of Dallas with a working-class and family-oriented population. The city has one main hospital system but strong community birth support through independent doulas and midwives. Many Garland families seek out virtual birth planning support to supplement local resources.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "Baylor Scott & White Garland", paragraph: "Baylor Scott &amp; White Garland, in the Centerville/Marsh area, serves the entire Garland community with a Level III NICU and a strong obstetric program. It's well-established and handles a high volume of births \u2014 having your birth plan ready before you walk in makes everything easier. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Texas Health Dallas and Baylor University Medical Center (nearby Dallas hospitals)", paragraph: "Garland families also deliver at Texas Health Dallas or Baylor University Medical Center in Dallas, both about 15-20 minutes away. If we're being real, living in Garland means you probably know which Dallas hospital is closest to your house \u2014 so plan for that drive during rush hour, not just distance. Write your birth plan before you need it." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Garland area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Garland area now cover doula support as part of maternal wellness benefits. Contact your plan for details.",
    faqs: [
      { q: "Does Medicaid cover doulas in Garland?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the Garland area." },
      { q: "Which hospitals in Garland accommodate birth plans?", a: "Baylor Scott & White Garland and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Garland?", a: "$800 to $2,400 depending on experience and package." },
      { q: "Does True Joy Birthing work with Garland families?", a: "True Joy Birthing provides free birth-prep tools for Garland families. The free birth plan, checklist, and guided walkthrough in the app work for any Garland hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "mesquite-tx", "arlington-tx"],
  },
  "grand-prairie-tx": {
    city: "Grand Prairie",
    state: "TX",
    slug: "grand-prairie-tx",
    costLow: 850,
    costHigh: 2500,
    shelbiServesHere: true,
    culture: "Grand Prairie sits between Dallas and Arlington along the I-30 corridor, serving a diverse, working-class population. The city has solid hospital access and a growing young family demographic. Many Grand Prairie families are first-time parents looking for affordable, practical birth preparation support.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "Methodist Charlton Medical Center", paragraph: "Methodist Charlton Medical Center, in the southern Grand Prairie area, is part of the Methodist system with a Level III NICU and serves a diverse community including many Medicaid families. It handles a high volume of births and is well-equipped, but busy \u2014 come with your plan in hand. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Baylor Scott & White Grand Prairie", paragraph: "Baylor Scott &amp; White Grand Prairie also serves the area alongside Methodist Charlton. Grand Prairie families also deliver at Methodist Dallas or Texas Health Fort Worth, both accessible from different parts of the city. If we're being real, your hospital choice might come down to which is closest to your house \u2014 so write your birth plan before you need it." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Grand Prairie area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Grand Prairie area now cover doula support as part of maternal wellness benefits. Contact your plan for details.",
    faqs: [
      { q: "Does Medicaid cover doulas in Grand Prairie?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the Grand Prairie area." },
      { q: "Which hospitals in Grand Prairie accommodate birth plans?", a: "Baylor Scott & White Grand Prairie and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Grand Prairie?", a: "$850 to $2,500 depending on experience and package." },
      { q: "Does True Joy Birthing work with Grand Prairie families?", a: "True Joy Birthing provides free birth-prep tools for Grand Prairie families. The free birth plan, checklist, and guided walkthrough in the app work for any Grand Prairie hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["arlington-tx", "dallas-tx", "irving-tx"],
  },
  "houston-tx": {
    city: "Houston",
    state: "TX",
    slug: "houston-tx",
    costLow: 800,
    costHigh: 2600,
    shelbiServesHere: false,
    culture: "Houston has one of the highest birth rates in the country and a large, multicultural birth community. The Texas Medical Center is one of the largest medical complexes in the world, with options ranging from major hospital systems to independent birth centers.",
    heroLocalDetail: "If you're delivering at the Texas Medical Center, memorize this now: Hermann Park Drive and Fannin Street back up hard between 7\u20139 AM and 4\u20136 PM, and the parking garages fill fast. Give yourself an extra 20 minutes for any appointment \u2014 and if you're driving in for a scheduled induction, you do not want to be figuring out parking at 5 AM while having contractions. Buffalo Bayou Park's trails are where a lot of Houston moms walk in the third trimester \u2014 shaded, mostly flat, and close enough to the Medical Center that you're not far if you need to head in.",
    hospitalDetails: [
      { name: "Texas Children's Pavilion for Women", paragraph: "Texas Children's Pavilion for Women, in the Texas Medical Center, is where Houston families go when they need the most specialized care \u2014 it has a Level IV NICU and one of the strongest maternal-fetal medicine programs in the country. If you're navigating a high-risk pregnancy, this is the place your OB might refer you to. Doulas are welcome here, and honestly, having someone in the room who knows how this particular hospital works makes a real difference when you're already processing a lot. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare before you go." },
      { name: "Memorial Hermann\u2013Texas Medical Center", paragraph: "Memorial Hermann\u2013Texas Medical Center is one of the busiest L&amp;D units in the city. It's also a Level I trauma center, which means they handle everything \u2014 high-volume, high-complexity births alongside their regular caseload." },
      { name: "The Woman's Hospital of Texas", paragraph: "The Woman's Hospital of Texas, just south of the Medical Center on Fannin, focuses exclusively on women's services and sees thousands of births a year. If we're being real, delivering at any of these Houston hospitals means you're walking into a big, busy system \u2014 and having a birth plan in your hands is the best way to make sure your preferences don't get lost in the pace of it all." },
    ],
    birthCenterDetails: [
      { name: "Nativity Birth Center and Birth Center at St. Luke's", paragraph: "Families looking for a lower-intervention setting can explore Nativity Birth Center or the Birth Center at St. Luke's. Nativity is a freestanding, midwife-led birth center for low-risk, unmedicated births. The Birth Center at St. Luke's offers a birth-center experience with hospital backup right next door \u2014 a good fit if you want the midwifery model but still want that safety net close by." },
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding. In Harris County and surrounding areas, eligible individuals should verify doula coverage with their Medicaid plan.",
    insuranceNote: "Some Houston-area employers offer maternity benefits that include doula coverage. Ask your HR department or insurance representative.",
    faqs: [
      { q: "How much does a doula cost in Houston?", a: "$800 to $2,600. Prices vary based on certification level, experience, and whether postpartum visits are included." },
      { q: "Does Texas Medicaid cover doulas in Houston?", a: "Texas is expanding Medicaid doula benefits. Contact your Harris County or surrounding area Medicaid managed care plan for current coverage details." },
      { q: "What are good birth centers in Houston?", a: "Houston has several birth center options, including Nativity Birth Center and Birth Center at St. Luke's. Always tour your chosen facility and understand their transfer protocols." },
      { q: "Does True Joy Birthing provide in-person doula services in Houston?", a: "True Joy Birthing provides free birth-prep tools for Houston families. The free birth plan, checklist, and guided walkthrough in the app work for any Houston hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["austin-tx", "san-antonio-tx"],
  },
  "irving-tx": {
    city: "Irving",
    state: "TX",
    slug: "irving-tx",
    costLow: 900,
    costHigh: 2600,
    shelbiServesHere: true,
    culture: "Irving sits between Dallas and DFW International Airport, making it a diverse, centrally located community with families from many backgrounds. The city has solid hospital access but fewer standalone birth centers. Many Irving families travel to Dallas or Plano for additional birth support options.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "Baylor Scott & White Irving", paragraph: "Baylor Scott &amp; White Irving, in the Las Colinas area, serves Irving and the mid-cities with a Level III NICU and a strong obstetric program. It sees a lot of families from the DFW Airport-adjacent communities \u2014 well-equipped and efficient, so having your birth plan written out means less explaining when you arrive. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Medical City Las Colinas", paragraph: "Medical City Las Colinas, also in Irving, is a newer facility with a Level III NICU and a growing obstetric program. Irving is so central that you might end up at whichever hospital your OB delivers at \u2014 both are solid, and both are busy. Write your plan before contractions start." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Irving area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Irving area now cover doula support as part of maternal wellness benefits. Contact your plan for details.",
    faqs: [
      { q: "Does Medicaid cover doulas in Irving?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the Irving area." },
      { q: "Which hospitals in Irving accommodate birth plans?", a: "Baylor Scott & White Irving and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Irving?", a: "$900 to $2,600 depending on experience and package." },
      { q: "Does True Joy Birthing work with Irving families?", a: "True Joy Birthing provides free birth-prep tools for Irving families. The free birth plan, checklist, and guided walkthrough in the app work for any Irving hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "carrollton-tx", "grand-prairie-tx"],
  },
  "laredo-tx": {
    city: "Laredo",
    state: "TX",
    slug: "laredo-tx",
    costLow: 700,
    costHigh: 1900,
    shelbiServesHere: false,
    culture: "Laredo is a border city with deep cultural traditions around birth and family. The birth community is growing, and many families value bilingual support.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "Laredo Medical Center", paragraph: "Laredo Medical Center is the primary hospital for this border city, with a high-volume L&amp;D unit serving a large Medicaid population. Doulas are generally welcome, though visitor policies can shift \u2014 confirm before your tour. Laredo Medical Center handles the majority of births in this region, so having your preferences written down before you go makes a real difference. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Doctors Hospital of Laredo", paragraph: "Doctors Hospital of Laredo also provides obstetric services with a Level III NICU. If we're being real, Laredo has fewer hospital options than the big Texas metros, which makes having a birth plan and a doula even more important \u2014 you want to walk in prepared no matter which hospital you're at." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Laredo area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Laredo region now cover doula support as part of maternal wellness benefits. Contact your plan.",
    faqs: [
      { q: "Does Medicaid cover doulas in Laredo?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits." },
      { q: "How much does a doula cost in Laredo?", a: "$700 to $1,900 depending on experience and package. Doulas in border communities may offer sliding-scale fees." },
      { q: "Does True Joy Birthing work with Laredo families?", a: "True Joy Birthing provides free birth-prep tools for Laredo families. The free birth plan, checklist, and guided walkthrough in the app work for any Laredo birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "Are there bilingual doulas in Laredo?", a: "Yes, Laredo has bilingual doulas who serve both English- and Spanish-speaking families. Ask local doula networks for referrals." },
    ],
    nearbyCities: ["san-antonio-tx", "corpus-christi-tx"],
  },
  "lubbock-tx": {
    city: "Lubbock",
    state: "TX",
    slug: "lubbock-tx",
    costLow: 700,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Lubbock is a West Texas hub with a tight-knit birth community. Families typically deliver at one of the major hospital systems in the city.",
    heroLocalDetail: "Lubbock moms: Covenant and UMC are both on the west side of town off Slide Road and 4th Street, and during Texas Tech game days that whole area turns into a parking lot. If you're due in the fall, know your alternate routes before contractions start \u2014 the last thing you need is game-day traffic between you and the hospital. Clapp Park's walking trail is a go-to for third-trimester evening walks \u2014 flat, quiet, and close enough to both hospitals that you're not far if something picks up.",
    hospitalDetails: [
      { name: "Covenant Medical Center", paragraph: "Covenant Medical Center, in northwest Lubbock, is the largest hospital in the region with a Level III NICU and a high-volume L&amp;D unit that serves the entire South Plains. Covenant handles more births than anyone in the region \u2014 they're experienced and well-equipped, but that volume means having your birth plan ready makes the intake process smoother. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "University Medical Center Lubbock", paragraph: "University Medical Center Lubbock, the region's public teaching hospital affiliated with Texas Tech Health Sciences Center, handles many Medicaid births and complex cases. UMC serves a broad community \u2014 if you're delivering here, come with your plan in hand. Honestly, this hospital sees families from all over West Texas, so it moves fast." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Lubbock area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Lubbock region now cover doula support as part of maternal wellness benefits. Contact your plan.",
    faqs: [
      { q: "Does Medicaid cover doulas in Lubbock?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits." },
      { q: "How much does a doula cost in Lubbock?", a: "$700 to $2,000 depending on experience and package. Costs in West Texas tend to be lower than in major metros." },
      { q: "Does True Joy Birthing work with Lubbock families?", a: "True Joy Birthing provides free birth-prep tools for Lubbock families. The free birth plan, checklist, and guided walkthrough in the app work for any Lubbock birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "Are there birth centers in Lubbock?", a: "Lubbock currently has limited standalone birth center options. Most families deliver at one of the major hospital systems. Ask your care provider about birth center alternatives." },
    ],
    nearbyCities: ["amarillo-tx", "el-paso-tx"],
  },
  "mckinney-tx": {
    city: "McKinney",
    state: "TX",
    slug: "mckinney-tx",
    costLow: 950,
    costHigh: 2700,
    shelbiServesHere: true,
    culture: "McKinney is one of the fastest-growing suburbs in North Texas, with a mix of established neighborhoods and new development. Families here tend to plan ahead and value detailed preparation \u2014 which makes birth planning especially relevant. The Collin County birth community is active and welcoming.",
    heroLocalDetail: "McKinney families delivering at Baylor Scott & White on Lake Forest Drive \u2014 US-75 construction has been a constant, and if you're coming from the west side of town, the detour routes add real time when you're not in any mood for surprises. Towne Lake's walking loop is where a lot of McKinney moms head for third-trimester evenings \u2014 the path around the lake is flat, well-lit, and close enough to both hospitals that you're not far if things start picking up.",
    hospitalDetails: [
      { name: "Baylor Scott & White McKinney", paragraph: "Baylor Scott &amp; White McKinney, in the US-75/Lake Forest area, has scaled up fast alongside the city's growth with a Level III NICU and a strong obstetric program. It handles a high volume of births and they're used to working with informed families \u2014 bring your birth plan and they'll work with it. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Medical City McKinney", paragraph: "Medical City McKinney, also serving northern Collin County, has a Level III NICU and a solid obstetric program. McKinney families are well-served by both hospitals \u2014 but both are busy, especially during peak delivery times. If we're being real, knowing your preferences before you're in labor beats figuring them out on the spot." },
    ],
    birthCenterDetails: [
      { name: "Arise Birth Center", paragraph: "Arise Birth Center is a freestanding, midwife-led birth center in the McKinney area offering a lower-intervention setting for low-risk pregnancies. It's a good option if you want a birth center experience close to home \u2014 and having a doula who knows the rhythm of that space makes it feel a lot less unknown." },
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the McKinney area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the McKinney area now cover doula support as part of maternal wellness benefits. Contact your plan for details.",
    faqs: [
      { q: "Does Medicaid cover doulas in McKinney?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the McKinney area." },
      { q: "Which hospitals in McKinney accommodate birth plans?", a: "Baylor Scott & White McKinney and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in McKinney?", a: "$950 to $2,700 depending on experience and package." },
      { q: "Does True Joy Birthing work with McKinney families?", a: "True Joy Birthing provides free birth-prep tools for McKinney families. The free birth plan, checklist, and guided walkthrough in the app work for any McKinney hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["plano-tx", "frisco-tx", "denton-tx"],
  },
  "mesquite-tx": {
    city: "Mesquite",
    state: "TX",
    slug: "mesquite-tx",
    costLow: 800,
    costHigh: 2300,
    shelbiServesHere: true,
    culture: "Mesquite is a large, established suburb east of Dallas with a diverse, family-focused community. The city itself has limited hospital options, so many Mesquite families deliver at nearby facilities in Sunnyvale, Rockwall, or Dallas. The doula community here is tight-knit and supportive.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "Baylor Scott & White Sunnyvale", paragraph: "Baylor Scott &amp; White Sunnyvale, just east of Mesquite, serves the east Dallas/Mesquite corridor with a Level III NICU and a solid obstetric program. It's modern and well-equipped for its size \u2014 having your birth plan ready before you arrive makes the whole process smoother. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Texas Health Rockwall", paragraph: "Texas Health Rockwall, to the east, also serves Mesquite-area families with a Level III NICU. Mesquite families often split between Baylor Sunnyvale and Texas Health Rockwall depending on which side of town they're on \u2014 both are solid options. If we're being real, neither is right down the street from everywhere in Mesquite, so plan your route and your birth plan ahead of time." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Mesquite area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Mesquite area now cover doula support as part of maternal wellness benefits. Contact your plan for details.",
    faqs: [
      { q: "Does Medicaid cover doulas in Mesquite?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the Mesquite area." },
      { q: "Which hospitals in Mesquite accommodate birth plans?", a: "Baylor Scott & White Sunnyvale and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Mesquite?", a: "$800 to $2,300 depending on experience and package." },
      { q: "Does True Joy Birthing work with Mesquite families?", a: "True Joy Birthing provides free birth-prep tools for Mesquite families. The free birth plan, checklist, and guided walkthrough in the app work for any Mesquite hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "garland-tx", "arlington-tx"],
  },
  "plano-tx": {
    city: "Plano",
    state: "TX",
    slug: "plano-tx",
    costLow: 1000,
    costHigh: 2800,
    shelbiServesHere: true,
    culture: "Plano is a well-established, family-oriented city in Collin County with excellent healthcare access. The birth community is mature and diverse \u2014 you'll find everything from hospital-based midwifery to home birth support. Many Plano families invest in preparation and education for their births.",
    heroLocalDetail: "",
    hospitalDetails: [
      { name: "Texas Health Plano", paragraph: "Texas Health Plano, in West Plano on Legacy Drive, is one of the busiest L&amp;D units in Collin County with a Level III NICU and a strong maternal-fetal medicine program. It sees a huge volume of births \u2014 they're well-equipped and experienced, but that pace means having your preferences written down is the best way to make sure they don't get lost in the shuffle. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Medical City Plano", paragraph: "Medical City Plano, in Central Plano, also has a high-volume L&amp;D with a Level III NICU and a strong obstetric program." },
      { name: "Baylor Scott & White Plano", paragraph: "Baylor Scott &amp; White Plano serves the eastern side of the city as well. Plano families have access to three strong hospitals, which is more than most suburbs \u2014 but all three are busy. Your OB probably delivers at one of them, so ask which one and write your plan for that hospital." },
    ],
    birthCenterDetails: [
      { name: "The Birth Place", paragraph: "The Birth Place is a freestanding birth center in the Plano area offering a midwife-led, lower-intervention setting for low-risk pregnancies. It's a good option if you want a birth center experience without leaving the city \u2014 and having a doula who knows the space makes the whole thing feel more supported." },
    ],
    medicaidNote: "Texas Medicaid's doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Plano area. Confirm with your Medicaid plan.",
    insuranceNote: "Some private insurers in the Plano area now cover doula support as part of maternal wellness benefits. Contact your plan for details.",
    faqs: [
      { q: "Does Medicaid cover doulas in Plano?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the Plano area." },
      { q: "Which hospitals in Plano accommodate birth plans?", a: "Texas Health Plano and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Plano?", a: "$1,000 to $2,800 depending on experience and package." },
      { q: "Does True Joy Birthing work with Plano families?", a: "True Joy Birthing provides free birth-prep tools for Plano families. The free birth plan, checklist, and guided walkthrough in the app work for any Plano hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "frisco-tx", "mckinney-tx", "carrollton-tx"],
  },
  "san-antonio-tx": {
    city: "San Antonio",
    state: "TX",
    slug: "san-antonio-tx",
    costLow: 700,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "San Antonio has a rich, diverse birth community with strong cultural traditions around family-centered birth. The city has a mix of large hospital systems and a growing interest in midwife-attended and doula-supported births.",
    heroLocalDetail: "If you're heading to University Hospital from the North Side during rush hour, skip Loop 410 \u2014 take Babcock to Wurzbach to Medical Drive instead. It'll save you 15\u201320 minutes when you're already running late for an appointment. And if evening walks are helping with those Braxton Hicks contractions, the River Walk loop near the Pearl is shaded and flat \u2014 a lot of San Antonio moms swear by it in the third trimester.",
    hospitalDetails: [
      { name: "University Hospital", paragraph: "University Hospital, affiliated with UT Health San Antonio, is the region's public teaching hospital with a Level IV NICU \u2014 the highest level \u2014 and handles the most complex pregnancies in South Texas alongside a large Medicaid population. Doulas are generally welcome, and having someone who knows how to navigate this busy system makes a real difference. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Baptist Medical Center", paragraph: "Baptist Medical Center, in downtown San Antonio, is a high-volume L&amp;D hospital with a Level III NICU." },
      { name: "CHRISTUS Santa Rosa Hospital", paragraph: "CHRISTUS Santa Rosa Hospital, in the Alamo Heights area, provides strong children's and women's services alongside birth care. If we're being real, San Antonio's hospital systems are big and busy \u2014 having your preferences written down before you walk in is the single best thing you can do for yourself." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid doula coverage is expanding statewide. San Antonio-area families should check current coverage with their Medicaid managed care organization.",
    insuranceNote: "San Antonio's large military community (Joint Base San Antonio) means some families may have access to Tricare or VA maternity benefits. Coverage for doula support varies.",
    faqs: [
      { q: "How much does a doula cost in San Antonio?", a: "$700 to $2,200. San Antonio's doula market tends to be more affordable than Austin or Dallas, with many experienced doulas offering sliding scale options." },
      { q: "Does Medicaid cover doulas in San Antonio?", a: "Texas is expanding Medicaid doula benefits statewide. Contact your San Antonio-area Medicaid plan for current coverage and eligibility." },
      { q: "Are there birth centers in San Antonio?", a: "San Antonio's birth center scene is smaller than Austin's, but options are growing. Most families deliver at University Hospital, Baptist Medical Center, or CHRISTUS Santa Rosa." },
      { q: "Does True Joy Birthing work with San Antonio families?", a: "True Joy Birthing provides free birth-prep tools for San Antonio families. The free birth plan, checklist, and guided walkthrough in the app work for any San Antonio birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["austin-tx", "houston-tx", "corpus-christi-tx"],
  },

  "waco-tx": {
    city: "Waco",
    state: "TX",
    slug: "waco-tx",
    costLow: 800,
    costHigh: 1500,
    shelbiServesHere: false,
    culture: "Waco sits halfway between Dallas and Austin on I-35, anchored by Baylor University and the visitor draw of Magnolia Market at the Silos. The city blends a college-town feel with small-town affordability \u2014 lower cost of living means birth support budgets stretch a bit further here than in the big metros. For expectant families, Waco\u2019s advantage is accessibility: two solid hospitals with NICU access and a freestanding birth center, which most cities this size don\u2019t have.",
    heroLocalDetail: "Both of Waco\u2019s hospitals sit along the I-35 corridor \u2014 Hillcrest near the Baylor campus and Providence up on Medical Parkway by the VA. I-35 construction through downtown can slow you down, so build in an extra 10\u201315 minutes when you\u2019re heading in. The Bosque River trail near both hospitals is a go-to for third-trimester evening walks.",
    hospitalDetails: [
      { name: "Baylor Scott & White Medical Center \u2013 Hillcrest", paragraph: "Baylor Scott & White \u2013 Hillcrest, off I-35 and University Parks Drive, is McLennan County\u2019s only dedicated Women\u2019s & Children\u2019s Center, with 14 labor and delivery rooms, 26 mother-baby rooms, and a 30-bed Level III NICU. Doulas are generally welcome as part of your support team, though visitor policies can change, so check before your tour. If you\u2019re delivering here, having a birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor and don\u2019t want to be explaining everything from scratch. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Ascension Providence Hospital", paragraph: "Ascension Providence, up on Medical Parkway near the Waco VA, has a Women\u2019s and Newborn Center with a Dell Children\u2019s Level II NICU on site. If we\u2019re being real, Providence\u2019s smaller L&D unit means you might see more one-on-one time with nursing staff \u2014 and shorter walks from the parking garage to the delivery room, which matters more than you\u2019d think at 38 weeks." },
    ],
    birthCenterDetails: [
      { name: "Waco Birth Center and Clinic", paragraph: "Waco Birth Center and Clinic, on Austin Avenue near downtown, is a licensed freestanding birth center staffed by certified nurse-midwives. They accept insurance and Medicaid, making them one of the more accessible out-of-hospital birth options in Central Texas." },
    ],
    medicaidNote: "Texas is rolling out Medicaid doula coverage statewide, but full birth-doula reimbursement isn\u2019t active yet for Waco-area families. If you\u2019re on Medicaid in McLennan County, contact your managed care plan directly \u2014 some plans have started adding doula support as a benefit ahead of the state mandate. Doulas who want to accept Medicaid must register with Texas HHSC.",
    insuranceNote: "Most private insurance in the Waco area doesn\u2019t cover doulas directly, but some plans \u2014 including BCBS Texas\u2019s Special Beginnings program and UnitedHealthcare\u2019s Doula Support benefit \u2014 offer partial reimbursement or resource access. Check your specific plan details, and ask whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Waco?", a: "$800 to $1,500 depending on experience and package. Waco\u2019s cost of living keeps doula rates lower than Dallas or Austin \u2014 you\u2019ll typically see rates in the $800\u2013$1,200 range for standard birth packages, with premium packages running up to $1,500." },
      { q: "Does Medicaid cover doulas in Waco?", a: "Texas is expanding Medicaid doula coverage statewide, but full reimbursement isn\u2019t active yet for Waco-area families. If you\u2019re on Medicaid in McLennan County, contact your managed care plan directly \u2014 some have started adding doula benefits ahead of the state mandate." },
      { q: "Which hospitals in Waco accommodate birth plans?", a: "Waco has two hospitals with L&D: Baylor Scott & White \u2013 Hillcrest (Level III NICU, dedicated Women\u2019s & Children\u2019s Center) and Ascension Providence (Level II NICU, smaller unit with more one-on-one nursing time). Waco also has a freestanding birth center \u2014 Waco Birth Center and Clinic on Austin Avenue \u2014 for families planning an out-of-hospital birth." },
      { q: "Does True Joy Birthing work with Waco families?", a: "True Joy Birthing provides free birth-prep tools for Waco families. The free birth plan, checklist, and guided walkthrough in the app work for any Waco birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["austin-tx", "dallas-tx", "fort-worth-tx"],
  },
  "midland-tx": {
    city: "Midland",
    state: "TX",
    slug: "midland-tx",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Midland is the largest city in the Permian Basin and the administrative hub of West Texas oil and gas. The birth community here is small but growing \u2014 the Midland Doula Collective serves the Midland-Odessa area, and The Birth Center of Midland gives families an out-of-hospital option that most cities this size don\u2019t have. Housing costs and infrastructure boom and bust with oil prices, which means the local birth support network has learned to be resourceful.",
    heroLocalDetail: "Midland Memorial sits on Rosalind Redfern Grover Parkway off Loop 250 on the west side of town, and if you\u2019re heading to ORMC in Odessa you\u2019ll take I-20 east about 20 minutes \u2014 both hospitals are accessible, but I-20 between Midland and Odessa can back up during oil-field shift changes. Rock the Basin at Centennial Park is where a lot of Midland moms walk in the third trimester \u2014 flat, shaded, and close enough to both hospitals that you\u2019re not stranded if something picks up.",
    hospitalDetails: [
      { name: "Midland Memorial Hospital", paragraph: "Midland Memorial Hospital is the main labor and delivery hospital for Midland and much of the Permian Basin, with a verified Level II NICU and a full women\u2019s services program. If Midland Memorial is where you\u2019re planning to give birth, it helps to walk in already clear on your preferences, because a busy hospital admission is not the moment most moms want to explain everything from scratch. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something simple and specific to work from." },
      { name: "Odessa Regional Medical Center", paragraph: "Odessa Regional Medical Center, about 20 minutes east in Odessa, was founded as a women\u2019s and children\u2019s hospital and carries that legacy forward with a Level III NICU and the Permian Basin\u2019s most established maternity program. If we\u2019re being real, Midland families who want a higher-level NICU or a more specialized maternity experience often end up here \u2014 the drive is short, and the L&D unit handles a high volume of births for the region." },
    ],
    birthCenterDetails: [
      { name: "The Birth Center of Midland", paragraph: "The Birth Center of Midland is a freestanding, midwife-led birth center offering a lower-intervention setting for low-risk pregnancies. It\u2019s the only out-of-hospital birth center in the Permian Basin \u2014 and having a doula who knows the rhythm of that space makes the whole thing feel a lot less unknown." },
    ],
    medicaidNote: "Texas Medicaid\u2019s doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Midland area. Contact your Medicaid managed care plan to confirm coverage \u2014 some Permian Basin plans have started adding doula benefits ahead of the statewide mandate.",
    insuranceNote: "Some private insurers in the Midland-Odessa region cover doula support as part of maternal wellness benefits. The oil-industry employer landscape here means some families have access to more comprehensive plans \u2014 check with your HR department or insurance provider directly.",
    faqs: [
      { q: "How much does a doula cost in Midland?", a: "$800 to $2,000 depending on experience and package. The Midland Doula Collective offers birth doula packages starting at $950, and local rates tend to be lower than the big Texas metros." },
      { q: "Does Medicaid cover doulas in Midland?", a: "Texas is expanding Medicaid doula coverage statewide. Specific eligibility depends on your plan. Contact your Texas Medicaid managed care provider for current benefits in the Midland area." },
      { q: "Which hospitals in Midland accommodate birth plans?", a: "Midland Memorial Hospital has a full L&D program with a Level II NICU, and Odessa Regional Medical Center (about 20 minutes away) offers a Level III NICU and the region\u2019s most established maternity program. Midland also has The Birth Center of Midland for families planning an out-of-hospital birth." },
      { q: "Does True Joy Birthing work with Midland families?", a: "True Joy Birthing provides free birth-prep tools for Midland families. The free birth plan, checklist, and guided walkthrough in the app work for any Midland birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["lubbock-tx"],
  },
  "tyler-tx": {
    city: "Tyler",
    state: "TX",
    slug: "tyler-tx",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Tyler is the largest city in Northeast Texas and the seat of Smith County, known as the Rose Capital of America for its rose industry and the annual Texas Rose Festival. The regional healthcare hub for East Texas, Tyler draws families from across the region for hospital births \u2014 and the birth community, while smaller than in the big metros, is steady and growing.",
    heroLocalDetail: "CHRISTUS Mother Frances sits off South Broadway in central Tyler, and UT Health Tyler is on the south side near Beckham Avenue. South Broadway between the hospitals can back up during afternoon rush and on Texas Rose Festival weekends in October \u2014 if you\u2019re due in the fall, know your fastest route before contractions start.",
    hospitalDetails: [
      { name: "CHRISTUS Mother Frances Hospital \u2013 Tyler", paragraph: "CHRISTUS Mother Frances Hospital \u2013 Tyler, on South Broadway in central Tyler, is the region\u2019s most established maternity hospital with a verified Level III NICU (the Lucy & John Carr NICU) and Level III Maternal designation. If you\u2019re delivering here, having a birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor and don\u2019t want to be explaining everything from scratch. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something simple and specific to work from." },
      { name: "UT Health Tyler", paragraph: "UT Health Tyler, on the south side of town, is the flagship hospital of the UT Health East Texas system with a Level III NICU designation (earned 2024) and labor and delivery services. If we\u2019re being real, Tyler families have two solid hospital options with Level III NICUs \u2014 which is more than most East Texas towns can say \u2014 but both can be busy, so having your preferences written down and a support advocate at your side makes the whole experience feel more manageable." },
    ],
    birthCenterDetails: [
      { name: "Azalea Birth Center", paragraph: "Azalea Birth Center, on South Broadway in central Tyler, is a freestanding birth center run by midwife Vicky Wells, offering water birth and midwife-attended out-of-hospital birth in a home-like setting. If you\u2019re considering birth center care, call ahead to confirm current availability and schedule a tour \u2014 the birth community in Tyler is growing but small, so spots can fill." },
    ],
    medicaidNote: "Texas Medicaid\u2019s doula benefit is expanding statewide. As of 2026, doula services may be reimbursable in the Tyler area. Contact your Medicaid managed care plan to confirm coverage \u2014 some East Texas plans have started adding doula support ahead of the statewide mandate.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Tyler area. Some private insurers offer maternal wellness benefits that include doula support \u2014 contact your provider directly, and check whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Tyler?", a: "$800 to $2,000 depending on experience and package. Tyler\u2019s doula community is smaller than in Dallas or Houston, but rates tend to be more affordable \u2014 you\u2019ll typically find standard birth packages in the $800\u2013$1,400 range." },
      { q: "Does Medicaid cover doulas in Tyler?", a: "Texas is expanding Medicaid doula coverage statewide. Smith County families should contact their Medicaid managed care plan directly \u2014 some East Texas plans have started adding doula support as a covered benefit ahead of the statewide mandate." },
      { q: "Which hospitals in Tyler accommodate birth plans?", a: "CHRISTUS Mother Frances Hospital \u2013 Tyler has a verified Level III NICU (the Lucy & John Carr NICU) and Level III Maternal designation, and UT Health Tyler earned its own Level III NICU designation in 2024. Tyler also has a freestanding birth center \u2014 Azalea Birth Center on South Broadway, run by midwife Vicky Wells \u2014 for families seeking out-of-hospital birth. That\u2019s two Level III hospitals and a birth center, which is more than most East Texas towns can offer." },
      { q: "Does True Joy Birthing work with Tyler families?", a: "True Joy Birthing provides free birth-prep tools for Tyler families. The free birth plan, checklist, and guided walkthrough in the app work for any Tyler birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "waco-tx"],
  },
  "killeen-tx": {
    city: "Killeen",
    state: "TX",
    slug: "killeen-tx",
    costLow: 700,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Killeen is a military town anchored by Fort Cavazos (formerly Fort Hood) in Bell County, part of the Killeen-Temple-Fort Hood metro. The military population means a high proportion of young families and Tricare-covered births, and the community cycles with deployments and PCS moves. Birth support here runs practical and tight-knit \u2014 doulas who understand military life, Tricare maternity benefits, and the reality of giving birth while a partner is deployed fill a real gap.",
    heroLocalDetail: "AdventHealth Central Texas sits off Clear Creek Road on Killeen\u2019s south side, and Baylor Scott & White in Temple is about a 20-minute drive up US-190 / I-35. If you\u2019re heading to BSW Temple from Killeen during morning rush, expect I-35 between Belton and Temple to slow down \u2014 build in an extra 10\u201315 minutes. The Killeen-Fort Cavazos area is flat and spread out, so most hospital drives are straightforward unless you\u2019re coming from the far west side near Copperas Cove.",
    hospitalDetails: [
      { name: "AdventHealth Central Texas", paragraph: "AdventHealth Central Texas, on South Clear Creek Road in Killeen, is the city\u2019s only hospital with a labor and delivery unit \u2014 the J. Barry Siebenlist L&D Unit, staffed by board-certified OB/GYNs and neonatologists. Doulas are generally welcome as part of your support team, though visitor policies can change, so check before your tour. If you\u2019re delivering here, having a birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor and don\u2019t want to be explaining everything from scratch. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Baylor Scott & White Medical Center \u2013 Temple", paragraph: "Baylor Scott & White in Temple, about 20 minutes north on I-35, is a large teaching hospital that serves the broader Killeen-Temple metro. If we\u2019re being real, many Killeen families deliver here by choice or referral \u2014 it\u2019s the biggest hospital in the region and handles more complicated pregnancies. Contact the hospital directly for current NICU and maternity service details." },
    ],
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid\u2019s doula benefit is expanding statewide. Bell County families on Medicaid should contact their managed care plan directly \u2014 some plans in the Killeen-Temple area have started adding doula support as a covered benefit ahead of the statewide rollout. Military families with Tricare have separate maternity coverage and should check Tricare\u2019s current doula policy.",
    insuranceNote: "Killeen\u2019s large military population means many families have Tricare, which covers hospital birth but does not directly reimburse doulas. For private insurance, whether doula services are partially covered varies by plan \u2014 contact your provider directly, and check whether HSA or FSA funds can cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Killeen?", a: "$700 to $1,800 depending on experience and package. Killeen\u2019s doula rates tend to run lower than Austin or Dallas, and some local doulas offer military discounts or sliding-scale options for Fort Cavazos families." },
      { q: "Does Medicaid cover doulas in Killeen?", a: "Texas is expanding Medicaid doula coverage statewide. Bell County families should contact their Medicaid managed care plan to confirm current benefits \u2014 some Killeen-area plans have started adding doula support ahead of the statewide mandate." },
      { q: "Which hospitals in Killeen accommodate birth plans?", a: "AdventHealth Central Texas is Killeen\u2019s only hospital with L&D. Baylor Scott & White Medical Center in Temple, about 20 minutes north, also serves Killeen-area families \u2014 contact the hospital directly to ask about their current maternity services and NICU availability." },
      { q: "Does True Joy Birthing work with Killeen families?", a: "True Joy Birthing provides free birth-prep tools for Killeen families. The free birth plan, checklist, and guided walkthrough in the app work for any Killeen birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["waco-tx", "austin-tx"],
  },
};

export const citySlugs = Object.keys(cities).sort();