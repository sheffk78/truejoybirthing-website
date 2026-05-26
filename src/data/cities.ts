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
    heroLocalDetail: "BSA Hospital and Northwest Texas Healthcare System both sit inside the Harrington Regional Medical Center district in northwest Amarillo — parking is genuinely easier here than in big Texas metros, which is one less thing to worry about at 38 weeks. I-40 runs east–west through the center of town and I-27 terminates just south of the I-40 junction, so if you're coming from the west side along Soncy Road or from anywhere along Loop 335, your fastest route to the medical district depends heavily on where you're starting from. From December through February, Panhandle ice storms can make that hospital drive genuinely dicey — know your route before you need it. Wolflin, City View, and Pinnacle are where you'll find most young families, and the Rock Island Rail Trail along Plains Boulevard and the walking paths at Thompson Park and Ellwood Park are popular third-trimester go-tos.",
    hospitalDetails: [
      { name: "Baptist St. Anthony's Hospital", paragraph: "Baptist St. Anthony's Hospital, in northwest Amarillo, is the largest hospital in the Panhandle and handles a high volume of births with a Level III NICU (stated directly on bsahs.org) and a strong maternal-fetal medicine program. Doulas are generally welcome, though visitor policies can shift, so confirm during your hospital tour. If you're delivering at BSA, having your birth plan in hand makes the whole check-in process smoother \u2014 they see a lot of families and move fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Northwest Texas Healthcare System", paragraph: "Northwest Texas Healthcare System, also in Amarillo, is a Level III trauma center with a Level III NICU (stated directly on nwths.com) and a broad obstetric program that serves many Medicaid-covered families. Honestly, both hospitals here serve a huge geographic area \u2014 families drive hours from surrounding towns, so the L&amp;D units are used to handling a lot. If we're being real, that means coming in with your preferences written down is even more important." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Amarillo (ZIPs 79101–79124), Potter County, and Randall County.
    // Google Maps search "birth center Amarillo TX" found Birth Haven (categorized as
    // "Birth center", 4.4★/5 reviews, 27 Medical Dr Suite 200, Amarillo, TX 79106,
    // phone (806) 437-1537, website beyondbirthmidwifery.com) and Panhandle Birth Center
    // (categorized as "Midwife", 5.0★/13 reviews, 1200 SW 15th Ave, Amarillo, TX 79102,
    // phone (806) 772-6431, website panhandlebirth.com). Verified 2026-05-25.
    birthCenterDetails: [
      { name: "Birth Haven", paragraph: "Birth Haven, at 27 Medical Drive Suite 200 in Amarillo, is a freestanding birth center run by the midwives at Beyond Birth Midwifery Associates — the only practice in Amarillo that Google Maps categorizes explicitly as a \u201cbirth center.\u201d It\u2019s located just off Coulter near the medical district, which means you\u2019re minutes from both BSA and Northwest Texas hospitals if a transfer becomes necessary. For families seeking a lower-intervention, out-of-hospital birth in the Panhandle, this is the dedicated option \u2014 and having a doula who knows the Birth Haven team and transfer protocols makes that comfort level a lot higher. Call ahead to confirm availability and schedule a tour, since the birth community here is small and spots fill." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Potter/Randall Counties' STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Amarillo area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Amarillo?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Potter/Randall Counties' STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "How much does a doula cost in Amarillo?", a: "$650 to $1,800 depending on experience and package. Costs in the Panhandle tend to be lower than in major Texas metros." },
      { q: "Does True Joy Birthing work with Amarillo families?", a: "True Joy Birthing provides free birth-prep tools for Amarillo families. The free birth plan, checklist, and guided walkthrough in the app work for any Amarillo birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "Are there doulas in Amarillo?", a: "Amarillo has a small but growing doula community. If local availability is limited, virtual support and the free birth plan app can help you prepare." },
    ],
    nearbyCities: ["lubbock-tx"],
  },
  "abilene-tx": {
    city: "Abilene",
    state: "TX",
    slug: "abilene-tx",
    costLow: 650,
    costHigh: 1600,
    shelbiServesHere: false,
    culture: "Abilene is a West Texas regional hub anchored by Dyess Air Force Base and three Christian universities. The birth community is small but growing \u2014 a military and college-town mix of young families, deployed-though-pregnant spouses, and first-time parents who value practical, evidence-based preparation. Hendrick Medical Center consolidating all L&D services to its north campus in June 2026 means the whole region\u2019s hospital births now flow through one location.",
    heroLocalDetail: "Hendrick Medical Center sits at 1900 Pine Street in north Abilene, and if you\u2019re coming from the south side or the Dyess AFB area, Pine Street between South 14th and the hospital entrance can slow down during rush. I-20 is the main east\u2013west artery through town \u2014 exits 279B (Pine Street) and 284 (Judge Ely Boulevard) both get you to the hospital, but Judge Ely tends to move faster at peak times. Nelson Park\u2019s walking trail on the east side of town is where a lot of Abilene moms head for third-trimester evenings \u2014 flat, well-lit, and about 10 minutes from the hospital.",
    hospitalDetails: [
      { name: "Hendrick Medical Center", paragraph: "Hendrick Medical Center, at 1900 Pine Street in north Abilene, is the regional hub for labor and delivery with a verified Level III NICU and a dedicated Obstetrics Emergency Department \u2014 both stated directly on hendrickhealth.org. The BirthPlace at Hendrick provides 24/7 obstetric care, and the OBED on the fourth floor of the Jones Building handles pregnancy-related emergencies for mothers at 20 weeks or beyond. As of June 1, 2026, all Hendrick Health obstetric and neonatal services in Abilene are centralized here \u2014 Hendrick Medical Center South\u2019s L&D unit closed May 31, 2026, so every hospital birth in the region now flows through this single campus. If you\u2019re delivering at Hendrick, having your birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something simple and specific to work from." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned 1 result for Abilene, TX \u2014
    // Crowned Birth Place, LLC (NPI 1912549320, DBA "Crowned Birth Place"),
    // 1636 N 20th St, Abilene, TX, owned by Sabrina R. Elliott, LM.
    // Active as of 2019-10-17 enumeration date. Facebook page exists.
    // Website (crownedbirthplace.com) does not resolve. Verified 2026-05-17.
    birthCenterDetails: [
      { name: "Crowned Birth Place", paragraph: "Crowned Birth Place, on North 20th Street in Abilene, is a freestanding birth center run by Licensed Midwife Sabrina Elliott, offering a lower-intervention setting for low-risk pregnancies. It\u2019s the only freestanding birth center in the Abilene area \u2014 and having a doula who knows the rhythm of that space makes the whole thing feel a lot less unknown. Call ahead to confirm current availability and schedule a tour, since the birth community in Abilene is small and spots can fill." },
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees. Taylor County families on Medicaid should contact their STAR managed care plan to confirm doula coverage \u2014 not all plans have completed their doula network setup yet. Military families with Tricare have separate maternity coverage and should check Tricare\u2019s current doula policy.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Abilene area. Some private insurers offer maternal wellness benefits that include doula support \u2014 contact your provider directly, and check whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Abilene?", a: "$650 to $1,600 depending on experience and package. Abilene has fewer practicing doulas than the big Texas metros, so availability may be limited and some doulas may charge travel fees if commuting from the DFW area." },
      { q: "Does Medicaid cover doulas in Abilene?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Taylor County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup." },
      { q: "Which hospitals in Abilene accommodate birth plans?", a: "Hendrick Medical Center at 1900 Pine Street is Abilene\u2019s only hospital providing labor and delivery as of June 2026, with a verified Level III NICU and dedicated OB Emergency Department stated directly on hendrickhealth.org. Hendrick Medical Center South\u2019s L&D unit closed May 31, 2026, with all maternity services centralized to the north campus. Abilene also has Crowned Birth Place on North 20th Street for families seeking an out-of-hospital birth." },
      { q: "Does True Joy Birthing work with Abilene families?", a: "True Joy Birthing provides free birth-prep tools for Abilene families. The free birth plan, checklist, and guided walkthrough in the app work for any Abilene birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["midland-tx", "lubbock-tx"],
  },
  "arlington-tx": {
    city: "Arlington",
    state: "TX",
    slug: "arlington-tx",
    costLow: 850,
    costHigh: 2500,
    shelbiServesHere: true,
    culture: "Arlington sits midway between Dallas and Fort Worth in Tarrant County, with a large, diverse population. The birth community is active and accessible, with doulas serving families across the mid-cities area. Costs tend to be slightly lower than Dallas proper, making doula support more attainable for more families.",
    heroLocalDetail: "Arlington sits in the heart of the DFW metroplex along I-30 and I-20, with SH-360 cutting straight through the city — game-day traffic around AT&T Stadium and Globe Life Field can back up I-30 for miles, so plan your hospital drive time accordingly, especially during Cowboys and Rangers seasons. The entertainment district (Six Flags, AT&T Stadium, Globe Life Field, Texas Live!) anchors north Arlington near the I-30/SH-360 interchange, while UTA’s campus adds a college-town feel just south of downtown. For green space, River Legacy Parks offers 1,300 acres of Trinity River bottomland forest with hiking and biking trails, a nature center, and canoe launches — it’s one of the largest urban nature preserves in North Texas. Veterans Park, in central Arlington, has a 3.2-mile paved trail loop, sports complexes, a splash pad, and an Arboretum — a go-to for stroller walks and toddler time between appointments.",
    hospitalDetails: [
      { name: "Medical City Arlington", paragraph: "Medical City Arlington (3301 Matlock Rd) is a 493-bed full-service hospital with a Level III NICU stated directly on their website — the unit is staffed 24/7 by neonatologists and neonatal nurses and handles premature and critically ill newborns. It\u2019s the go-to for high-risk pregnancies in south Arlington, with maternal-fetal medicine specialists on site. The L&D team handles a high volume, so walking in with your birth plan already written keeps your preferences clear when things move fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Texas Health Arlington Memorial", paragraph: "Texas Health Arlington Memorial (800 W Randol Mill Rd) holds dual DSHS certifications \u2014 Level III Neonatal Intensive Care and Level III Maternal care \u2014 certified by the Texas Department of State Health Services and stated directly on texashealth.org. It\u2019s one of only a handful of Tarrant County hospitals carrying both designations, and its full-service breast center and advanced imaging are on the same campus, which matters when you\u2019re navigating a high-risk pregnancy and don\u2019t want to shuttle between facilities. The campus sits in north Arlington near Randol Mill Park, and the Birth & Wellness Center is literally across the street \u2014 a proximity advantage if you\u2019re planning a birth center delivery with hospital backup. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something specific to work from." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned 1 result for Arlington, TX —
    // Birth & Wellness Center of Arlington (NPI active, founded 2019, CPM/LM midwives).
    // Located at 1001 W Randol Mill Rd, directly across from Texas Health Arlington Memorial.
    // Verified 2026-05-25.
    birthCenterDetails: [
      { name: "Birth & Wellness Center of Arlington", paragraph: "Birth & Wellness Center of Arlington (1001 W Randol Mill Rd) is directly across the street from Texas Health Arlington Memorial, offering out-of-hospital birth with CPM/LM midwives in a boutique-style birthing suite. Founded in 2019, it provides holistic prenatal care, water birth, chiropractic services, and doula partnerships. They also serve families from Fort Worth, Grand Prairie, Mansfield, and the broader mid-cities area." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Tarrant County\u2019s STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Arlington area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Arlington?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Tarrant County\u2019s STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan\u2019s coverage before hiring." },
      { q: "Which hospitals in Arlington accommodate birth plans?", a: "Medical City Arlington and Texas Health Arlington Memorial both accommodate birth plans. Medical City has a Level III NICU (stated directly on their website) and maternal-fetal medicine specialists; Texas Health Arlington Memorial holds dual DSHS certifications — Level III Neonatal Intensive Care and Level III Maternal care. Always confirm your hospital's policy during your tour." },
      { q: "Are there birth centers in Arlington?", a: "Yes — Birth & Wellness Center of Arlington (1001 W Randol Mill Rd) offers out-of-hospital birth with midwives, directly across from Texas Health Arlington Memorial. Additional birth centers in Tarrant County include Beautiful Beginnings Birth & Women\u2019s Center and Fort Worth Birthing & Wellness Center in Fort Worth, The Nest Birth Center in Mansfield, and Origins Birth Services in south Fort Worth." },
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
      { name: "St. David's South Austin", paragraph: "St. David's South Austin Medical Center, in South Austin off Ben White Boulevard, is one of the busiest L&amp;D units in the city with a Level III NICU (stated directly on stdavids.com) and a strong maternal-fetal medicine program. Doulas are generally welcome as part of your support team. If you're delivering at St. David's, bring your birth plan \u2014 this is one of the highest-volume birth hospitals in the city and having your preferences written down makes the conversation easier. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Seton Medical Center Austin", paragraph: "Seton Medical Center Austin, in Central Austin near the UT campus, is part of the Ascension/Seton system and has a strong high-risk pregnancy program alongside its Level III NICU (contact the hospital directly for current level verification). Dell Children's Medical Center is right next door for any NICU needs. If we're being real, Austin's hospital systems are big and busy \u2014 having a doula who knows the rhythm of your specific hospital makes a real difference when you're already in labor." },
    ],
    birthCenterDetails: [
      { name: "Austin Area Birthing Center and Natural Beginnings Birth and Wellness Center", paragraph: "Austin Area Birthing Center and Natural Beginnings Birth and Wellness Center both offer freestanding, midwife-led birth center options for families seeking a lower-intervention setting. These are good options for low-risk pregnancies if you want the birth center experience \u2014 and having a doula there who knows the rhythm of that space makes the whole thing feel a lot less unknown." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Travis County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Austin area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Is Austin a good city for natural birth?", a: "Austin is known for its birth-friendly culture. The city has multiple birth centers and a community of providers who support varied birth preferences. Hospitals like St. David's South Austin accommodate diverse birth plans." },
      { q: "How much does a doula cost in Austin?", a: "$1,000 to $3,000. Austin's higher cost of living and strong doula community mean prices range higher than some Texas markets, but so does the level of experienced support." },
      { q: "Does True Joy Birthing serve Austin families?", a: "True Joy Birthing provides free birth-prep tools for Austin families. The free birth plan, checklist, and guided walkthrough in the app work for any Austin birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What are Austin's birth center options?", a: "Austin Area Birthing Center and Natural Beginnings are two well-established options. Both have strong community ties. Always verify their transfer agreements with nearby hospitals." },
    ],
    nearbyCities: ["san-antonio-tx", "san-marcos-tx", "new-braunfels-tx", "houston-tx"],
  },
  "beaumont-tx": {
    city: "Beaumont",
    state: "TX",
    slug: "beaumont-tx",
    costLow: 700,
    costHigh: 1600,
    shelbiServesHere: false,
    culture: "Beaumont sits in the Golden Triangle of southeast Texas, where families from Jefferson, Hardin, and Orange counties come for hospital births. The birth community is small but committed, and families here tend to plan carefully \u2014 often traveling from rural areas into the city for delivery.",
    heroLocalDetail: "Families across the Golden Triangle \u2014 from Beaumont, Port Arthur, and Orange \u2014 deliver at St. Elizabeth, where the L&D unit sees a steady volume of births from across the region.",
    hospitalDetails: [
      { name: "Baptist Hospitals of Southeast Texas", paragraph: "Baptist Hospitals of Southeast Texas, at 3080 College St in Beaumont, has a verified Level III NICU with 16 beds, NICVIEW cameras for parents to check on their baby remotely, and experience with babies under 1 pound. Their New Beginnings Birth Center maternity unit includes 24/7 nurses, lactation support, and prenatal education. If you\u2019re delivering at Baptist, a birth plan helps the nursing team understand your preferences quickly, especially when the unit is busy. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "CHRISTUS Southeast Texas \u2013 St. Elizabeth", paragraph: "CHRISTUS Southeast Texas \u2013 St. Elizabeth, at 2830 Calder Ave in Beaumont, also has a verified Level III NICU with on-call neonatologists and maternal transport services, drawing families from across the Golden Triangle. CHRISTUS St. Elizabeth offers midwifery services (CNM) and is a Texas Ten Step facility \u2014 meaning they actively support breastfeeding families. Doulas are generally welcome \u2014 confirm visitor policy on your hospital tour. The St. Mary campus in Port Arthur provides additional emergency and specialty services." },
    ],
    birthCenterDetails: [
      // NPI taxonomy 261QB0400X search (Beaumont, Port Arthur, Orange TX) returned zero birth centers (2026-05-19). Google Maps search for "birth center Beaumont TX" and "freestanding birth center Beaumont" also returned no results.
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Jefferson County's STAR and STAR+PLUS managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Golden Triangle. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Beaumont?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Jefferson County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "How much does a doula cost in Beaumont?", a: "$700 to $1,600 depending on experience and package. Costs in southeast Texas tend to be lower than in major metro areas." },
      { q: "Which Beaumont hospitals are birth-plan friendly?", a: "Baptist Hospitals of Southeast Texas and CHRISTUS Southeast Texas \u2013 St. Elizabeth both offer L&D with verified Level III NICUs. Doulas are generally welcome at both. Always confirm current visitor and support-person policies during your hospital tour." },
      { q: "Does True Joy Birthing work with Beaumont families?", a: "True Joy Birthing provides free birth-prep tools for Beaumont families. The free birth plan, checklist, and guided walkthrough in the app work for any Beaumont birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["houston-tx"],
  },
  "carrollton-tx": {
    city: "Carrollton",
    state: "TX",
    slug: "carrollton-tx",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: true,
    culture: "Carrollton sits at the junction of Dallas, Denton, and Collin counties \u2014 a central location that draws families from multiple directions. The city itself doesn't have a major hospital, so residents typically deliver at nearby facilities in Lewisville, Flower Mound, or Plano. This makes advance planning especially important.",
    heroLocalDetail: "Carrollton families typically deliver at Medical City Lewisville or Texas Health Flower Mound \u2014 both about a 15\u201320 minute drive depending on where you are in the city. The I-35E/President George Bush Turnpike interchange and Belt Line Road are your main arteries, and afternoon traffic around that interchange can easily add 10 minutes you don\u2019t want to be figuring out in labor; the Sam Rayburn Tollway covers the far north end of town if you\u2019re coming from that direction. DART\u2019s Green Line terminates at North Carrollton/Frankford Station, and the A-train connects from Trinity Mills to Lewisville \u2014 helpful if your partner doesn\u2019t drive, but not how you want to get to the hospital in active labor. Sandy Lake Park and McInnish Park on the west side have flat, paved trails that work well for third-trimester walks, and the Greenbelt Trail along the creek running through Carrollton into Plano is another popular go-to. Historic Downtown Carrollton around the DART station is where many young families cluster, and the Koreatown district near Old Denton Road and the Bush Turnpike gives the city a distinct cultural identity.",
    hospitalDetails: [
      { name: "Medical City Lewisville", paragraph: "Medical City Lewisville, just north of Carrollton in Lewisville, has a Level III NICU (contact the hospital directly for current level verification) and handles a high volume of births for the northern DFW suburbs. Doulas are generally welcome as part of your support team, though visitor policies can shift seasonally. Medical City Lewisville sees a lot of Carrollton families \u2014 it's close and well-equipped, but it moves fast, so come with your birth plan ready. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Texas Health Flower Mound", paragraph: "Texas Health Flower Mound, just northwest of Carrollton, has a strong women's services program with a DSHS-certified Level III NICU. If we're being real, Carrollton families are driving 15-20 minutes to either of these hospitals anyway \u2014 so having your preferences in writing before you head out the door is even more important." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Carrollton (ZIPs 75006–75011), Dallas County, and Denton County. Nearby cities
    // with NPI-registered birth centers: Plano — Plano Birthplace (NPI 1083158141,
    // 5172 Village Creek Dr STE 101, Plano, TX 75093, phone 469-912-0727, owner
    // Jeannine Watson Tate MSN RN CNM, DBA "Plano Birthplace", enumerated 2016-12-08);
    // Grapevine — Grapevine Birthing Center (NPI 1134548936, 409 W Wall St,
    // Grapevine, TX 76051, phone 214-563-7410, owner Kimberly Daly LM CPM,
    // license 150036, enumerated 2014-04-09); Flower Mound — Flourish Birth & Wellness
    // Center PLLC (NPI 1447895271, 4061 Kirkpatrick Ln STE 110, Flower Mound, TX
    // 75028, phone 713-408-3448, owner Marsha Gross APRN CNM MSN, enumerated
    // 2019-11-15). Google Maps search "birth center near Carrollton TX" found:
    // Plano Birthplace (4.9★/76 reviews, ~10 mi, categorized "Birth center");
    // BirthPointe Women's Health & Birth Center (4.5★/62 reviews, 7453 Las
    // Colinas Blvd, Irving, ~8 mi, categorized "Birth center", phone 972-215-6934,
    // no NPI-registered org found); Grapevine Birthing Center (4.9★/120 reviews,
    // ~12 mi, categorized "Birth center"); Barefoot Midwifery (4.7★/31 reviews,
    // 18170 Dallas Pkwy STE 104, categorized "Midwife"); Kristy Hammack Midwife
    // (4.8★/16 reviews, same address as Barefoot Midwifery, categorized "Midwife");
    // Lovers Lane Birth Center (4.5★/89 reviews, Dallas, ~18 mi, categorized
    // "Birth center", no NPI-registered org found). Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas/Denton/Collin Counties' STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Carrollton area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Carrollton?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas/Denton/Collin Counties' STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
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
    culture: "Corpus Christi is a coastal city where the Gulf breeze meets South Texas culture — families here are shaped by the water, the heat, and a deep-rooted sense of community. Nueces County has a high Medicaid birth rate, and the Coastal Bend's birth community is small but dedicated, with doulas who serve the entire region. Driscoll Children's Hospital gives Corpus an advantage most cities this size don't have — a Level IV NICU for the most complex neonatal cases.",
    heroLocalDetail: "Corpus Christi Medical Center's Bay Area campus sits on South Padre Island Drive (SH 358) on the city's southeast side, near the Oso Bay wetlands and the growing Southside neighborhoods where many young families live. Driscoll Children's Hospital is just north on Alameda Street, adjacent to the medical district. If you're heading to Bay Area during summer rush hour, SH 358 between Airline and Everhart can slow down — and hurricane season evacuations (June through November) can turn a 15-minute drive into an hour. The Oso Creek Trail and Cole Park waterfront are go-to walking spots for expectant moms in the third trimester — flat, breezy, and close to both hospitals.",
    hospitalDetails: [
      { name: "Corpus Christi Medical Center – Bay Area", paragraph: "Corpus Christi Medical Center's Bay Area campus, on South Padre Island Drive on the city's southeast side, is where most Corpus families deliver — with a verified Level III NICU stated directly on their website, high-frequency oscillatory ventilation, inhaled nitric oxide capability, and 24/7 neonatal transport. The Women's Center at Bay Area has birthing suites, maternal-fetal medicine specialists, and prenatal education classes. If you're delivering at Bay Area, having a birth plan ready means your preferences travel with you — especially in a busy hospital where the team changes shifts. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to walk in prepared." },
      { name: "Driscoll Children's Hospital", paragraph: "Driscoll Children's Hospital, on Alameda Street adjacent to the medical district, is the first and only Level IV NICU in South Texas — with 67 NICU beds, 24/7 neonatologists, 12 neonatal nurse practitioners, ECMO capability, and surgical neonatal care. Driscoll is where the region's most complex neonatal cases are transferred, and it's the reason Corpus families can feel more confident about high-risk births staying local. If we're being real, having a Level IV NICU in a city this size is unusual — most families in smaller cities have to travel hours for this level of care." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results in
    // Corpus Christi / Nueces County. Google Maps and social media searches
    // found no freestanding birth centers. Verified 2026-05-22.
    birthCenterDetails: [],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Nueces County's STAR and STAR+PLUS managed care plans. Nueces County has a high Medicaid birth rate — many families here depend on Medicaid, CHIP, and the Healthy Texas Women program for prenatal and birth care. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Coastal Bend. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Corpus Christi Regional Healthcare's employee plans and some BCBS Texas plans in the area offer partial maternal wellness benefits — contact your provider directly to confirm.",
    faqs: [
      { q: "How much does a doula cost in Corpus Christi?", a: "$750 to $2,100 depending on experience and package. The Coastal Bend has fewer practicing doulas than the major Texas metros, so availability can be limited — reach out early, especially if you want bilingual support." },
      { q: "Does Medicaid cover doulas in Corpus Christi?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Nueces County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in Corpus Christi accommodate birth plans?", a: "Corpus Christi Medical Center – Bay Area has a verified Level III NICU, birthing suites, and maternal-fetal medicine — it's where most families deliver. Driscoll Children's Hospital, adjacent to the medical district, has a verified Level IV NICU and handles the region's most complex neonatal cases. Corpus does not have a freestanding birth center." },
      { q: "Does True Joy Birthing work with Corpus Christi families?", a: "True Joy Birthing provides free birth-prep tools for Corpus Christi families. The free birth plan, checklist, and guided walkthrough in the app work for any Corpus Christi birth setting. The app also helps you connect with local doulas and midwives in your area." },
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
    culture: "Dallas is the largest city in the DFW metroplex and Dallas County, with a huge and diverse birth community. Families deliver at everything from high-volume academic hospitals to community facilities and a midwife-led birth center in Deep Ellum. SB 750 is making doula support more accessible through Medicaid coverage, and the city\u2019s sheer size means there\u2019s a doula for nearly every birth preference and budget \u2014 but that also means navigating a lot of options.",
    heroLocalDetail: "If you\u2019re delivering at Texas Health Dallas, know that the LBJ Freeway (I-635) stretch near Forest Lane can turn a 15-minute drive into 40 during afternoon rush \u2014 plan your route to the hospital before contractions start. Baylor University Medical Center sits at Gaston and Hall in Deep Ellum, where Greenville Avenue weekend traffic and Deep Ellum event nights can gum up your approach; the easiest route from East Dallas is Gaston Ave straight in. Parkland Memorial Hospital is on Harry Hines near I-35E, and that whole Stemmons Corridor corridor backs up hard during 7\u20139 AM and 4\u20136 PM commutes. Medical City Dallas is off Forest Lane at the intersection of I-635 and Central Expressway \u2014 two of the busiest highways in DFW converging right there. If you\u2019re heading to any of these hospitals during rush, know your back-route before you need it. And when those third-trimester evening walks become non-negotiable, White Rock Lake\u2019s 9-mile loop trail is the go-to \u2014 shaded, flat, plenty of parking at White Rock Lake Park and Winfrey Point, with enough bathrooms along the way that you\u2019re never too far from one. The Katy Trail, running from Highland Park through Oak Lawn up to SMU, is another solid option if you\u2019re closer to the center of town.",
    hospitalDetails: [
      { name: "Texas Health Presbyterian Hospital Dallas", paragraph: "Texas Health Presbyterian Hospital Dallas (8200 Walnut Hill Lane), the flagship of the Texas Health system in Dallas, is a verified Level I Trauma Center with a high-volume L&amp;D unit and an NICU \u2014 the hospital lists women\u2019s health and infant care as a core specialty on texashealth.org, though the specific NICU level is not stated on their website, so contact the hospital directly for current NICU level verification. Doulas are generally welcome, though visitor policies can shift seasonally, so confirm during your hospital tour. If we\u2019re being real, walking into a big hospital system without your preferences written down makes everything harder \u2014 so bring your birth plan and your doula, and you\u2019ll feel the difference. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Baylor University Medical Center", paragraph: "Baylor University Medical Center (3500 Gaston Ave), part of Baylor Scott &amp; White Health, draws families from across Dallas for its high-risk and maternal-fetal medicine programs. Their structured data lists a Neonatal Intensive Care Unit (NICU) and labor and delivery among their specialties, though the specific NICU level is not stated on their website \u2014 contact the hospital directly for current NICU level verification. If you\u2019re planning a VBAC or managing a high-risk pregnancy here, a doula can be the steady presence who helps you ask the right questions and hold steady in the room." },
      { name: "Parkland Memorial Hospital", paragraph: "Parkland Memorial Hospital (5200 Harry Hines Blvd), Dallas County\u2019s public hospital and a verified Level I Trauma Center, handles one of the largest volumes of births in the entire state and cares for many Medicaid-covered families. Parkland\u2019s neonatology is staffed by UT Southwestern faculty, and they have an NICU on site, though the specific NICU level is not stated on their website \u2014 contact the hospital directly for current NICU level verification. The team there is increasingly familiar with doulas and birth plans, but policies can shift, so it helps to come in with your preferences written down. Honestly, it\u2019s a lot to walk into a place that busy without a plan in your hands \u2014 so write one before you go." },
      { name: "Medical City Dallas", paragraph: "Medical City Dallas (7777 Forest Ln), an 899-bed HCA Healthcare hospital, lists NICU, maternal-fetal care, high-risk pregnancy, and labor and delivery among its specialties in their structured data, though the specific NICU level is not stated on their website \u2014 contact the hospital directly for current NICU level verification. Medical City Dallas is one of the largest hospitals in the DFW metroplex and handles a high volume of births. If you\u2019re delivering here, come with your birth plan ready \u2014 the team is experienced but busy, and having your preferences in writing keeps your voice in the room." },
      { name: "Methodist Dallas Medical Center", paragraph: "Methodist Dallas Medical Center (1416 N Beckley Ave), part of the Methodist Health System, provides L&amp;D services and maternity care for southern and central Dallas families. The hospital offers maternal care, though the specific NICU level is not stated on their website \u2014 contact the hospital directly for current NICU level verification. Methodist Dallas serves a diverse community, and their maternity team sees a wide range of birth plans. Bring yours with you to keep your preferences clear." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned 1 result for Dallas, TX —
    // Kristine Tawater (NPI 1447620810), taxonomy 261QB0400X (Clinic/Center, Birthing),
    // 4218 Main St, Dallas, TX 75226, phone 214-914-5015.
    // Active as of 2015-09-29. License 150044. DBA "Urban Family Co-op Dallas" (dallasbirthcenter.com).
    // Verified 2026-05-22.
    birthCenterDetails: [
      { name: "Urban Family Co-op Dallas (formerly Dallas Birth Center)", paragraph: "Urban Family Co-op Dallas (4218 Main St in Deep Ellum), formerly known as Dallas Birth Center, is a freestanding birth center run by Licensed Midwife Kristine Tawater, offering midwife-led birth in a lower-intervention setting. It\u2019s the only NPI-registered freestanding birth center in Dallas proper with taxonomy 261QB0400X, and it\u2019s right in the heart of Deep Ellum \u2014 convenient if you\u2019re in East Dallas, Oak Cliff, or the M Streets. Having a doula who knows the rhythm of that space makes the whole thing feel a lot less unknown. Call 214-914-5015 or visit dallasbirthcenter.com to confirm current availability and schedule a tour." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the DFW metro area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Dallas?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Which Dallas hospitals are birth-plan friendly?", a: "Texas Health Presbyterian Hospital Dallas, Baylor University Medical Center, Parkland Memorial Hospital, Medical City Dallas, and Methodist Dallas Medical Center all provide L&D services and generally accommodate birth plans, though policies vary by facility. Texas Health Dallas and Baylor see well-informed patients with clear preferences regularly. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Dallas?", a: "$900 to $2,800 depending on experience and package. Dallas's large doula community means a wide range of pricing and specialties — bilingual doulas, VBAC-experienced doulas, and postpartum-focused support are all available." },
      { q: "Does True Joy Birthing work with Dallas families?", a: "True Joy Birthing provides free birth-prep tools for Dallas families. The free birth plan, checklist, and guided walkthrough in the app work for any Dallas hospital or birth center. The app also helps you connect with local doulas and midwives in your area." },
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
    heroLocalDetail: "Texas Health Denton sits right off I-35E in south Denton, which is convenient \u2014 except when there's an accident or game-day traffic from UNT, and then that 10-minute drive doubles. Know your back-route through neighborhoods before you need it. The trail around North Lakes Park is where a lot of Denton moms walk in the third trimester \u2014 flat, quiet, and you won't have to dodge campus pedestrians the way you would on the Square. (Note: Medical City Denton does not offer labor and delivery \u2014 if you're planning a hospital birth, Texas Health Denton is your hospital.)",
    hospitalDetails: [
      { name: "Texas Health Denton", paragraph: "Texas Health Denton, off I-35E in South Denton, has the only Level III NICU in Denton (verified on texashealth.org) and a strong maternal-fetal medicine program \u2014 it's where most Denton families deliver. Doulas are generally welcome, though visitor policies can change. Having your birth plan and a doula who knows the flow makes everything smoother at this busy campus. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Medical City Denton", paragraph: "Medical City Denton, off I-35E in South Denton, is a Level II Trauma Center with strong surgical and orthopedic programs \u2014 but it does not offer labor and delivery services. Their website directs families seeking maternity care to nearby Medical City Lewisville or Medical City Frisco. If you're delivering in Denton, Texas Health Denton is your hospital. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
    ],
    // Birth center: Denton Birth Center verified via website and NPI as an active freestanding birth center in Denton, TX (2026-05-25).
    birthCenterDetails: [
      { name: "Denton Birth Center", paragraph: "Denton Birth Center is a freestanding, midwife-led birth center offering a lower-intervention setting for low-risk pregnancies. It's a good option if you want a birth center experience without leaving the city \u2014 and having a doula there who knows the rhythm of that space makes the whole thing feel a lot less unknown." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Denton County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Denton area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Denton?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Denton County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in Denton accommodate birth plans?", a: "Texas Health Denton is the only hospital in Denton with labor and delivery services — it has the only Level III NICU in the city (verified on texashealth.org) and generally accommodates birth plans. Medical City Denton does not offer L&D; their website directs families to Medical City Lewisville or Frisco for maternity care. Always confirm your hospital's current policy during your tour." },
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
    culture: "El Paso is one of the largest Hispanic-majority cities in the US, where bilingual birth support isn\u2019t a nice-to-have \u2014 it\u2019s the baseline. Expecting parents here navigate a mix of military families from Fort Bliss, multi-generational El Paso families, and cross-border communities that have been here for generations. Birth traditions like la cuarentena still shape postpartum expectations, and families plan carefully \u2014 often across two health systems and two languages.",
    heroLocalDetail: "UMC of El Paso sits at 4815 Alameda Ave in south-central El Paso \u2014 the region\u2019s only Level IV Maternal Care hospital \u2014 and if you\u2019re coming from the West Side or Upper Valley, I-10 between the Patriot Freeway (US-54) interchange and Loop 375 is one of the most congested stretches in Texas, so morning and afternoon rush can easily add 15\u201320 minutes to your drive. Las Palmas Medical Center is at 1801 N Oregon St just north of downtown, and Del Sol Medical Center is at 10301 Gateway Blvd W on the East Side off I-10; East Side and Fort Bliss families tend to deliver at Del Sol, while West Side and Kern Place families often head to Las Palmas or UMC. Loop 375 (Transmountain Drive) cuts across the Franklin Mountains between the west and northeast sides \u2014 it\u2019s gorgeous but slow during rush and occasionally shuts down for ice in winter, so don\u2019t count on it as your hospital route at 38 weeks. Border crossing traffic at the Bridge of the Americas, Stanton Street, and Ysleta bridges can back up I-10 and Montana Avenue (US-62/180) for blocks, especially on weekday mornings and around holidays. For third-trimester walks, the Chamizal National Memorial on the south side has flat, paved paths and a cultural park feel, and Memorial Park in central El Paso offers a pool, tennis courts, and open green space close to the hospitals. Franklin Mountains State Park has over 100 miles of hiking trails across nearly 27,000 acres right in the city \u2014 but it\u2019s rugged desert terrain, so stick to the lower, flatter trails if you\u2019re walking at 36 weeks. The neighborhoods around UTEP, Kern Place, and the Upper Valley are where you\u2019ll find most young families \u2014 and the bilingual doulas who serve them.",
    hospitalDetails: [
      { name: "University Medical Center of El Paso", paragraph: "University Medical Center, at 4815 Alameda Ave in south-central El Paso, is the region\u2019s only Level IV Maternal Care designated hospital and a Baby-Friendly facility. They have 30 private rooms in their Women\u2019s Surgical Health Unit, a certified nurse midwifery program, VBAC support, and neonatologists on-site 24/7. UMC is affiliated with Texas Tech Health Sciences Center \u2014 meaning teaching physicians alongside your care team. If you\u2019re delivering at UMC, a birth plan helps the nursing team understand your preferences quickly, especially in a busy academic hospital. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started. Contact the hospital directly for current NICU level verification." },
      { name: "Las Palmas Medical Center", paragraph: "Las Palmas Medical Center, at 1801 N Oregon St near downtown El Paso, is part of the Las Palmas Del Sol Healthcare system (HCA Healthcare). They offer L&D services and their system lists NICU as a specialty, though the specific NICU level is not stated on their website \u2014 contact the hospital directly for current NICU level verification. Las Palmas is also the region\u2019s only kidney transplant center and a Level III Trauma facility." },
      { name: "Del Sol Medical Center", paragraph: "Del Sol Medical Center, at 10301 Gateway Blvd W on El Paso\u2019s East Side, is the other campus in the Las Palmas Del Sol system. They offer L&D with spacious suite-style rooms, childbirth classes, and maternity tours. Del Sol is a Level II Trauma Center \u2014 the only one in the El Paso area. Like Las Palmas, contact the hospital directly for current NICU level verification. East Side families often deliver here because it\u2019s closer to the newer developments." },
      { name: "The Hospitals of Providence (Memorial Campus)", paragraph: "The Hospitals of Providence Memorial Campus, near downtown El Paso, has historically been known for its NICU and obstetric services. Note: their website was unreachable at the time of our review (May 2026) \u2014 contact the hospital directly at (915) 577-6000 for current NICU level verification and maternity services. Providence also operates a Transmountain Campus on the west side and a Sierra Medical Campus for specialized care." },
    ],
    birthCenterDetails: [
      // NPI taxonomy 261QB0400X search (El Paso, El Paso County, 799xx ZIPs) returned ZERO birth centers (2026-05-22). Google Maps and web searches for "birth center El Paso TX" also found no operational freestanding birth centers. A county of 860,000+ people with zero birth centers is a significant gap.
    ],
    medicaidNote: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including El Paso County\u2019s STAR and CHIP managed care plans (Superior HealthPlan, Molina Healthcare, Driscoll Health Plan, Community First). Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your coverage. Military families: TRICARE does not currently cover doula services, but HSA and FSA funds can often help.",
    insuranceNote: "El Paso\u2019s military population means TRICARE is common \u2014 doulas aren\u2019t covered by TRICARE, but many Fort Bliss families use HSA or FSA funds. For private insurance, check whether your plan covers out-of-network doula services or offers maternal wellness benefits. Superior HealthPlan and Molina both serve Medicaid populations in El Paso County.",
    faqs: [
      { q: "Does Medicaid cover doulas in El Paso?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including El Paso County\u2019s STAR and CHIP plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan\u2019s doula coverage before hiring. Military families on TRICARE should check HSA/FSA eligibility instead." },
      { q: "How much does a doula cost in El Paso?", a: "$800 to $2,200 depending on experience and package. El Paso\u2019s cost of living keeps rates lower than DFW or Houston. Some doulas offer bilingual services at standard rates, and sliding-scale options are common. Fort Bliss military families should ask about military discounts." },
      { q: "Which El Paso hospitals accommodate birth plans?", a: "University Medical Center (Level IV Maternal Care, Baby-Friendly), Las Palmas Medical Center, Del Sol Medical Center, and The Hospitals of Providence all offer labor and delivery. UMC is the region\u2019s only Level IV Maternal Care facility. Always confirm visitor and support-person policies during your hospital tour \u2014 they can change." },
      { q: "Does True Joy Birthing work with El Paso families?", a: "True Joy Birthing provides free birth-prep tools for El Paso families. The free birth plan, checklist, and guided walkthrough in the app work for any El Paso birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["lubbock-tx", "midland-tx"],
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
      { name: "Texas Health Harris Methodist Hospital", paragraph: "Texas Health Harris Methodist Hospital, in downtown Fort Worth, is one of the busiest hospitals in Tarrant County with a DSHS-certified Level III NICU and a high-volume L&amp;D unit. Doulas are generally welcome \u2014 they handle a huge volume of births and they've seen every kind of birth plan. Bring yours and they'll work with it. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Cook Children's Medical Center", paragraph: "Cook Children's Medical Center, just north of downtown, provides Level IV NICU care (stated directly on cookchildrens.org) alongside the labor and delivery services at Cook Women's." },
      { name: "JPS Health Network", paragraph: "JPS Health Network, Tarrant County's public hospital, handles more Medicaid births than almost anyone in the region \u2014 the care teams there know how to work with informed, prepared families, so bring your plan. If we're being real, delivering at JPS means walking into a very busy public hospital, and your birth plan is your voice in that room." },
    ],
    birthCenterDetails: [
      { name: "Fort Worth Birth Center", paragraph: "Fort Worth Birth Center is a freestanding, midwife-led birth center for families seeking a lower-intervention setting. It's a good option for low-risk pregnancies \u2014 and having a doula who knows the birth center space makes the whole experience feel more supported." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Tarrant County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Fort Worth area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Fort Worth?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Tarrant County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
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
    heroLocalDetail: "Frisco families: if your OB delivers at Baylor Scott & White on Legacy Drive, know that the intersection at Legacy and Lebanon can back up badly during afternoon rush \u2014 and that's the last thing you want to be figuring out when contractions are five minutes apart. The Dallas North Tollway and SH-121 are your main north-south arteries, and Gaylord Pkwy near The Star can gridlock on Cowboys event days. Frisco Commons Park is a popular evening walk spot for third-trimester moms \u2014 flat paths, shaded trails, and enough other walkers that you don't feel like the only pregnant person in town. Griffin Parc, Heritage Green, and Phillips Creek Ranch are where most of the young families are clustered.",
    hospitalDetails: [
      { name: "Baylor Scott & White Frisco", paragraph: "Baylor Scott &amp; White Frisco, in the Legacy Drive area, is one of the newest hospitals in the DFW North corridor with a Level III NICU (contact the hospital directly for current level verification) and a high-volume L&amp;D unit. It's modern and well-equipped \u2014 designed for the volume of families coming through this area, which means they're used to birth plans but also very busy. Having yours ready makes the intake conversation go smoother. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Medical City Frisco", paragraph: "Medical City Frisco, also on the north side, has a Level III NICU (stated directly on medicalcityhealthcare.com) and a strong obstetric program. Frisco's population has exploded, and both hospitals have scaled up fast. If we're being real, that means they're busy \u2014 come with your preferences written down and a doula who can help you hold the line." },
    ],
    birthCenterDetails: [
      { name: "Birth Center of Frisco", paragraph: "Birth Center of Frisco is a freestanding, midwife-led birth center offering a lower-intervention setting for low-risk pregnancies. It's a good option if you want the birth center experience close to home \u2014 and having a doula there who knows the rhythm of that space makes it feel a lot less unknown." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Collin/Denton Counties' STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Frisco area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Frisco?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Collin/Denton Counties' STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
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
    heroLocalDetail: "Baylor Scott & White Garland on Shiloh Road is your in-city hospital, but plenty of Garland families also deliver at Medical City Dallas or Baylor downtown — about 15–20 minutes west depending on traffic. LBJ Freeway (I-635) runs through the heart of Garland and is perpetually under construction, so know your back route via President George Bush Turnpike, I-30, or Garland Road (SH-78) before contractions start. Belt Line Road crosses the whole city east–west and stays moving when the freeways don't. The Spring Creek Forest Preserve on the north side has quiet, flat walking trails that are a favorite for third-trimester evening walks, and neighborhoods around Firewheel Town Center and the Eastern Hills area are where you'll find most young families.",
    hospitalDetails: [
      { name: "Baylor Scott & White Garland", paragraph: "Baylor Scott &amp; White Garland sits in the Centerville/Marsh area near Firewheel Town Center, and it's the only hospital actually inside Garland city limits. The L&amp;D unit handles a steady volume from the surrounding neighborhoods \u2014 Spring Creek Forest, Eastern Hills, North Garland \u2014 and families here tend to know the hospital well because it's genuinely local, not a regional referral center. Come with your preferences written down: the nurses see a lot of births and move quickly, so a clear birth plan saves everyone time at check-in. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Texas Health Dallas and Baylor University Medical Center (nearby Dallas hospitals)", paragraph: "Garland families also deliver at Texas Health Dallas or Baylor University Medical Center in Dallas, both about 15-20 minutes away. If we're being real, living in Garland means you probably know which Dallas hospital is closest to your house \u2014 so plan for that drive during rush hour, not just distance. Write your birth plan before you need it." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned 0 results for Garland, TX
    // (searched Garland city, Dallas County). Google Maps "birth center Garland TX"
    // returned no freestanding birth centers within Garland city limits. Nearest birth
    // centers are Lovers Lane Birth Center in Richardson (~12 mi) and The Birth Place
    // Dallas (~15 mi). Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Garland area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Garland?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
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
    heroLocalDetail: "Grand Prairie sits right between Dallas and Fort Worth along the I-30 and I-20 corridors, and most families deliver at Methodist Charlton locally or drive 15 minutes to hospitals in Arlington and Mansfield. SH-161 and Great Southwest Parkway are your north–south alternates when I-30 or I-20 back up — and they will during afternoon rush. Joe Pool Lake on the south side has the Lynn Creek Park trail system with paved and primitive trails along the water, and it's the quiet option for third-trimester walks when the highway noise gets to be too much. EpicCentral Park and the nearby Epic Waters area are where young families cluster on the north side, and the Grand Prairie Farmers Market District around Main Street has that small-in-the-city feel.",
    hospitalDetails: [
      { name: "Methodist Charlton Medical Center", paragraph: "Methodist Charlton Medical Center, in the southern Grand Prairie area, is part of the Methodist system with a Level III NICU (contact the hospital directly for current level verification) and serves a diverse community including many Medicaid families. It handles a high volume of births and is well-equipped, but busy \u2014 come with your plan in hand. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Baylor Scott & White Grand Prairie", paragraph: "Baylor Scott &amp; White Grand Prairie also serves the area alongside Methodist Charlton. Grand Prairie families also deliver at Methodist Dallas or Texas Health Fort Worth, both accessible from different parts of the city. If we're being real, your hospital choice might come down to which is closest to your house \u2014 so write your birth plan before you need it." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned 1 result for Grand Prairie, TX —
    // Family Birth Services (NPI 1841340411, DBA of Helen J Jolly Nelson, CPM, license 7200),
    // 814 Dalworth St, Grand Prairie, TX 75050, phone (972) 263-0299, website familybirthservices.com,
    // enumerated 2007-01-12. HOWEVER, Google Maps lists Family Birth Services as
    // "Permanently closed" (4.8★/33 reviews, 2455 Robinson Rd #200, Grand Prairie, TX 75051).
    // No other birth centers with taxonomy 261QB0400X found in Grand Prairie ZIPs 75050–75052.
    // Google Maps search "birth center Grand Prairie TX" returns no active in-city results;
    // nearest active birth centers are in Arlington (Birth & Wellness Center of Arlington,
    // ~8 mi), Mansfield (The Nest Birth Center), and Fort Worth (Fort Worth Birthing &
    // Wellness Center). Grand Prairie has zero operational freestanding birth centers.
    // Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas/Tarrant Counties' STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Grand Prairie area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Grand Prairie?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas/Tarrant Counties' STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
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
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Harris County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Houston area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "How much does a doula cost in Houston?", a: "$800 to $2,600. Prices vary based on certification level, experience, and whether postpartum visits are included." },
      { q: "Does Texas Medicaid cover doulas in Houston?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Harris County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
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
    heroLocalDetail: "Irving families deliver at Baylor Scott & White Irving or Medical City Las Colinas — both in the Las Colinas area off SH-114 and SH-183 (Airport Freeway). The ongoing I-635/LBJ Express project means that stretch from I-35E to US-80 is a construction zone for the foreseeable future, so Belt Line Road is your reliable east–west local alternate when the freeways jam up. Toyota Music Factory event nights can back up traffic on SH-114 and nearby LBJ, so if you're due around a concert date, have an alternate route through I-35E or Loop 12 ready. The Campion Trail is Irving's gem for expectant moms — 4.4 miles of paved trail right along the Trinity River, flat and well-shaded — and neighborhoods like Valley Ranch, Las Colinas, and Hackberry Creek are where most of the young families live.",
    hospitalDetails: [
      { name: "Baylor Scott & White Irving", paragraph: "Baylor Scott &amp; White Irving, in the Las Colinas area, serves Irving and the mid-cities with a Level III NICU (contact the hospital directly for current level verification) and a strong obstetric program. It sees a lot of families from the DFW Airport-adjacent communities \u2014 well-equipped and efficient, so having your birth plan written out means less explaining when you arrive. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Medical City Las Colinas", paragraph: "Medical City Las Colinas, also in Irving, is a newer facility with a Level II NICU (stated directly on medicalcityhealthcare.com) and a growing obstetric program. Irving is so central that you might end up at whichever hospital your OB delivers at \u2014 both are solid, and both are busy. Write your plan before contractions start." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Irving (ZIPs 75014–75063), Dallas County. Google Maps search "birth center Irving TX"
    // found 7 results; the only birth center physically in Irving is BirthPointe Women's
    // Health & Birth Center (categorized as "Birth center", 4.5★/62 reviews, 7453 Las
    // Colinas Blvd, Irving, TX 75039, phone (972) 215-6934, website birthpointe.com).
    // Metroplex Midwifery (categorized as "Midwife", 5.0★/45 reviews, 114 E John
    // Carpenter Fwy Suite 130, Irving, phone (214) 205-8221, website
    // metroplexmidwifery.com) has an office in Irving and offers home/birth center/hotel
    // birth but is not NPI-registered as a birth center facility. Nearby options in
    // adjacent cities: Grapevine Birthing Center (4.9★/120 reviews, 409 W Wall St,
    // Grapevine, ~15 min from Irving, phone (817) 421-6928, website
    // grapevinebirthingcenter.com) and Birth & Wellness Center of Arlington (1001 W
    // Randol Mill Rd, Arlington, already documented in arlington-tx entry).
    // Lovers Lane Birth Center (4061 Kirkpatrick Ln Suite 110, Highland Village) is
    // farther north. Metroplex Birth (210 Park Blvd Suite 107, Grapevine) is doula
    // services/childbirth education, not a birth center. Verified 2026-05-26.
    birthCenterDetails: [
      { name: "BirthPointe Women's Health & Birth Center", paragraph: "BirthPointe Women's Health & Birth Center, on Las Colinas Blvd in Irving, is the city's only freestanding birth center — midwife-led with a focus on low-intervention birth in a home-like setting. It's the in-city option for Irving families who want an out-of-hospital birth, and having a doula who knows the rhythm of that space makes it feel a lot less unknown." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Irving area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Irving?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in Irving accommodate birth plans?", a: "Baylor Scott & White Irving (Level III NICU, contact the hospital directly for current level verification) and Medical City Las Colinas (Level II NICU, stated directly on medicalcityhealthcare.com) both accommodate birth plans. Always confirm your hospital's policy during your hospital tour." },
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
    culture: "Laredo is the largest inland port in the United States and a city where two cultures meet at the river \u2014 95% Hispanic, with deep roots on both sides of the border. Webb County has one of the highest uninsured rates in the country, and families here often navigate both US and Mexican healthcare systems for prenatal care. The birth community is small but increasingly organized, and bilingual support isn\u2019t a luxury \u2014 it\u2019s essential. Doulas who speak both languages fill a gap that the hospital system alone can\u2019t.",
    heroLocalDetail: "Doctors Hospital sits on McPherson Road in north Laredo, about 15 minutes from downtown via I-35 and Loop 20. Laredo Medical Center is on East Saunders Street (US 83 Business) in central Laredo \u2014 closer to the international bridges, which means bridge traffic can add 10\u201315 minutes during peak border crossing hours. If you\u2019re delivering at Doctors Hospital, the McPherson Road approach from Loop 20 is your fastest bet; during school pickup hours the United ISD campuses near the hospital can slow things down. The San Agust\u00edn Plaza walking path along the river is where a lot of Laredo moms walk in the third trimester \u2014 flat, shaded, and about 10 minutes from Laredo Medical Center.",
    hospitalDetails: [
      { name: "Doctors Hospital of Laredo", paragraph: "Doctors Hospital of Laredo, on McPherson Road in north Laredo, is the city\u2019s only hospital with a verified Level III NICU \u2014 stated directly on their website \u2014 with 24-hour maternal-fetal medicine specialists, neonatologists, and neonatal nurses. They offer newly renovated private L&amp;D suites and a separate Nueva Vida (New Life) Health Center in central Laredo for prenatal and gynecological appointments, with deliveries at the main campus. For Laredo families, having a Level III NICU in town means you don\u2019t have to travel to San Antonio for high-risk neonatal care. If you\u2019re delivering at Doctors Hospital, having a birth plan ready makes the intake conversation smoother \u2014 especially in a bilingual household where you may be advocating in two languages. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Laredo Medical Center", paragraph: "Laredo Medical Center, on East Saunders Street in central Laredo near the international bridges, provides maternity care and delivery services with an NICU for babies who need extra support. Contact Laredo Medical Center directly for current NICU level verification and maternity service details. If we\u2019re being real, Laredo has only two hospital options and no freestanding birth center \u2014 so knowing your preferences before you walk in matters even more. The hospital serves a large Medicaid population and offers bilingual staff and Spanish-language materials throughout maternity services." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for all
    // Laredo zip codes (78040, 78041, 78043, 78044, 78045, 78046). Google Maps
    // and social media searches found no freestanding birth centers in Laredo.
    // Verified 2026-05-22.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Webb County\u2019s STAR and STAR+PLUS managed care plans. Webb County has one of the highest uninsured rates in the United States \u2014 many families here depend on Medicaid, CHIP, and the Healthy Texas Women program for prenatal and birth care. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan\u2019s doula coverage before hiring. Bilingual application assistance is available.",
    insuranceNote: "Whether doula services are partially covered varies by plan in Laredo. Many families carry insurance from both US and Mexican employers, and coverage for doula support depends on your specific plan \u2014 check whether HSA or FSA funds can help cover out-of-pocket costs. For families using Mexican insurance (IMSS) or crossing for prenatal care, US-based doula services are typically out-of-network and self-pay.",
    faqs: [
      { q: "How much does a doula cost in Laredo?", a: "$700 to $1,900 depending on experience and package. Laredo has fewer practicing doulas than the major Texas metros, and bilingual doulas are especially in demand \u2014 if you need Spanish-language support, ask about bilingual availability when you reach out. Some doulas offer sliding-scale fees for families on Medicaid." },
      { q: "Does Medicaid cover doulas in Laredo?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Webb County\u2019s STAR and STAR+PLUS managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan\u2019s doula coverage. Not all managed care plans have completed their doula network setup, so check before hiring." },
      { q: "Which hospitals in Laredo accommodate birth plans?", a: "Laredo has two hospitals with L&D services: Doctors Hospital of Laredo, with a verified Level III NICU and 24-hour maternal-fetal medicine specialists, and Laredo Medical Center, which offers maternity care with an NICU (contact directly for current level verification). Laredo does not have a freestanding birth center. Both hospitals offer bilingual staff and Spanish-language materials." },
      { q: "Are there bilingual doulas in Laredo?", a: "Yes \u2014 Laredo\u2019s doulas overwhelmingly serve both English- and Spanish-speaking families, and most offer bilingual support. In a city where 95% of residents are Hispanic and Spanish is spoken in most homes, bilingual doula support is the norm rather than the exception. Ask specifically about Spanish-language availability when you contact a doula." },
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
    culture: "Lubbock is the Hub City of the South Plains — home to Texas Tech University, a tight-knit birth community, and the only Level I Trauma Center for 300 miles in any direction. Covenant and UMC are the two main hospitals, and the UMC Family Birth Center's in-house doula program makes Lubbock unusual among West Texas cities — Medicaid families here can actually request a doula through the hospital. The birth community is small but growing, with local doulas who know both hospitals' rhythms and policies inside out.",
    heroLocalDetail: "Lubbock moms: Covenant and UMC are both on the west side of town off Slide Road and 4th Street, and during Texas Tech game days that whole area turns into a parking lot. If you're due in the fall, know your alternate routes before contractions start \u2014 the last thing you need is game-day traffic between you and the hospital. Clapp Park's walking trail is a go-to for third-trimester evening walks \u2014 flat, quiet, and close enough to both hospitals that you're not far if something picks up.",
    hospitalDetails: [
      { name: "Covenant Medical Center", paragraph: "Covenant Medical Center, in northwest Lubbock off Slide Road, is the largest hospital in the region with a NICU for babies who need extra support and a high-volume L&D unit that serves the entire South Plains. Contact Covenant directly for current NICU level verification. Covenant handles more births than anyone in the region — they're experienced and well-equipped, but that volume means having your birth plan ready makes the intake process smoother. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "University Medical Center Lubbock", paragraph: "University Medical Center Lubbock, the region's public teaching hospital affiliated with Texas Tech Health Sciences Center, handles many Medicaid births and complex cases — and it's the only Level I Trauma Center for 300 miles, with the region's only children's hospital. UMC serves a broad community, including many Medicaid families, with an NICU and maternal care. If you're delivering here, come with your plan in hand. Honestly, this hospital sees families from all over West Texas, so it moves fast. UMC's Family Birth Center also offers an in-house \"Request a Doula\" program — if you're on Medicaid, ask about it when you preregister." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results in
    // Lubbock County. Google Maps found no freestanding birth centers.
    // UMC Family Birth Center offers an in-house doula program but is not
    // a freestanding birth center. Verified 2026-05-22.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Lubbock County's STAR managed care plans. UMC's in-house doula program makes Medicaid doula access more straightforward here than in most West Texas cities — if you're on Medicaid, ask about the program when you preregister. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Lubbock area. Texas Tech Physicians and Covenant Health Plans are major insurers here — check whether your specific plan includes doula or maternal wellness benefits. HSA and FSA funds can often be applied toward birth support costs. Texas Tech student health plans typically do not cover doulas directly, but graduate student families may have separate coverage options.",
    faqs: [
      { q: "How much does a doula cost in Lubbock?", a: "$700 to $2,000 depending on experience and package. West Texas rates tend to be lower than Dallas or Austin, but availability is more limited — some doulas commute from Midland or Abilene and may charge travel fees." },
      { q: "Does Medicaid cover doulas in Lubbock?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Lubbock County's STAR managed care plans. UMC's in-house doula program makes access more straightforward for Medicaid families — ask about it when you preregister. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm." },
      { q: "Which hospitals in Lubbock accommodate birth plans?", a: "Covenant Medical Center is the region's largest hospital with a NICU and high-volume L&D unit — contact Covenant directly for current NICU level verification. UMC Lubbock is the region's only Level I Trauma Center and children's hospital, with maternity care and an in-house doula program for Medicaid patients. Lubbock does not currently have a freestanding birth center." },
      { q: "Are there birth centers in Lubbock?", a: "Lubbock does not have a freestanding birth center. Most families deliver at Covenant or UMC. UMC's Family Birth Center offers an in-house doula program for Medicaid patients, which is unusual for West Texas — ask about it when you preregister if you're interested in doula support through your hospital." },
    ],
    nearbyCities: ["amarillo-tx", "el-paso-tx"],
  },
  "longview-tx": {
    city: "Longview",
    state: "TX",
    slug: "longview-tx",
    costLow: 700,
    costHigh: 1600,
    shelbiServesHere: false,
    culture: "Longview sits in the rolling Piney Woods of East Texas, the Gregg County seat and a regional commercial hub where timber, oil, and healthcare keep the economy moving. The birth community here is small and close-knit \u2014 most families deliver at one hospital, and word travels fast. With Tyler about 35 miles east offering more options for high-risk pregnancies and neonatal intensive care, Longview families who plan ahead and know their patient rights have a smoother experience.",
    heroLocalDetail: "CHRISTUS Good Shepherd Medical Center sits on East Marshall Avenue near the center of Longview, and if you\u2019re coming from the south side or the Lakeport area, US-80 and Spur 63 both feed directly into the hospital district. Traffic on Marshall Avenue near the hospital entrance can back up during weekday afternoon rush. Longview\u2019s a spread-out city with long east\u2013west corridors \u2014 if you live on the west side near Kilgore, budget an extra 10 minutes during peak times. Heritage Plaza in downtown Longview is where a lot of expectant moms walk during the third trimester \u2014 flat, shaded, and about 8 minutes from the hospital.",
    hospitalDetails: [
      { name: "CHRISTUS Good Shepherd Medical Center", paragraph: "CHRISTUS Good Shepherd Medical Center, on East Marshall Avenue in central Longview, is the city\u2019s primary hospital for labor and delivery, with a NICU and 24/7 obstetric care. CHRISTUS Good Shepherd \u2013 Marshall, the same system\u2019s hospital about 25 miles east, handles some maternity services for Harrison County families but transfers complex neonatal cases to the Longview campus. Contact the hospital directly for current NICU level and maternity service details. Your birth plan is your voice in a busy room. <a href=\"/birth-plan-template/\">Use our free template</a> to walk in knowing what you want." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned 0 results for Longview,
    // Kilgore, Marshall, and Hallsville. Google Maps and social media searches
    // found no freestanding birth centers in the Longview area. Verified 2026-05-18.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees. Gregg County families on Medicaid should contact their STAR managed care plan to confirm doula coverage \u2014 some East Texas plans are still completing their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to verify before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Longview area. CHRISTUS Health Plan is a major insurer in East Texas \u2014 check whether your specific plan includes doula or maternal wellness benefits. HSA and FSA funds can often be applied toward birth support costs; confirm with your plan administrator.",
    faqs: [
      { q: "How much does a doula cost in Longview?", a: "$700 to $1,600 depending on experience and package. Longview has fewer practicing doulas than the major Texas metros, so availability may be limited and some doulas commute from Tyler or Shreveport \u2014 expect potential travel fees of $100\u2013$200 if you\u2019re outside the immediate area." },
      { q: "Does Medicaid cover doulas in Longview?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Gregg County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as some East Texas plans are still completing their doula network setup." },
      { q: "Which hospitals in Longview accommodate birth plans?", a: "CHRISTUS Good Shepherd Medical Center on East Marshall Avenue is Longview\u2019s primary hospital for labor and delivery, with a NICU and 24/7 obstetric care. Contact the hospital directly for current NICU level and maternity service details. Longview does not have a freestanding birth center. For families who need a higher level of neonatal or maternal specialty care, Tyler \u2014 about 35 miles east \u2014 has two hospitals with verified Level III NICUs and a freestanding birth center." },
      { q: "Does True Joy Birthing work with Longview families?", a: "True Joy Birthing provides free birth-prep tools for Longview families. The free birth plan, checklist, and guided walkthrough in the app work for any Longview birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["tyler-tx", "dallas-tx"],
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
      { name: "Baylor Scott & White McKinney", paragraph: "Baylor Scott &amp; White McKinney, in the US-75/Lake Forest area, has scaled up fast alongside the city's growth with a Level III NICU (contact the hospital directly for current level verification) and a strong obstetric program. It handles a high volume of births and they're used to working with informed families \u2014 bring your birth plan and they'll work with it. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Medical City McKinney", paragraph: "Medical City McKinney, also serving northern Collin County, has a NICU — the hospital's online materials list both Level II and Level III designations, so contact the hospital directly for current NICU level verification — and a solid obstetric program. McKinney families are well-served by both hospitals — but both are busy, especially during peak delivery times. If we're being real, knowing your preferences before you're in labor beats figuring them out on the spot." },
    ],
    birthCenterDetails: [
      // NPI taxonomy 261QB0400X search (McKinney, Collin County TX) returned zero birth centers (2026-05-26). Google Maps search for "birth center McKinney TX" returned Bella Births Center for Birth & Women's Health, Allen Midwifery & Family Wellness at Allen Birthing Center, and Texas Family Birth & Wellness. Allen Birthing Center in Allen is the closest verified freestanding birth center to McKinney (~10 min south). "Arise Birth Center" was previously listed but does not exist in NPI, Google Maps, or DNS records — removed as fabricated entity.
      { name: "Allen Birthing Center", paragraph: "Allen Birthing Center (Allen Midwifery & Family Wellness), about 10 minutes south of McKinney in Allen, is the closest freestanding birth center for McKinney families seeking a lower-intervention setting. It's midwife-led and well-established in the Collin County birth community \u2014 and having a doula who knows the rhythm of that space makes it feel a lot less unknown." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Collin County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the McKinney area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in McKinney?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Collin County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in McKinney accommodate birth plans?", a: "Baylor Scott & White McKinney and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in McKinney?", a: "$950 to $2,700 depending on experience and package." },
      { q: "Does True Joy Birthing work with McKinney families?", a: "True Joy Birthing provides free birth-prep tools for McKinney families. The free birth plan, checklist, and guided walkthrough in the app work for any McKinney hospital. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["plano-tx", "frisco-tx", "denton-tx"],
  },
  "odessa-tx": {
    city: "Odessa",
    state: "TX",
    slug: "odessa-tx",
    costLow: 700,
    costHigh: 1600,
    shelbiServesHere: false,
    culture: "Odessa sits in the heart of the Permian Basin, where families from across West Texas come for hospital births. The birth community here is small but connected, and doulas who serve both Odessa and Midland tend to know both hospitals well.",
    heroLocalDetail: "Odessa Regional Medical Center started as a women\u2019s and children\u2019s hospital \u2014 maternity care is literally what this place was built for.",
    hospitalDetails: [
      { name: "Odessa Regional Medical Center", paragraph: "Odessa Regional Medical Center, at 520 E 6th St, has a Level III NICU (contact the hospital directly for current level verification) with 49 beds \u2014 the only Level III NICU between Lubbock (145 mi) and El Paso (285 mi). ORMC was founded as a women\u2019s and children\u2019s hospital and still carries that focus: it\u2019s the Permian Basin\u2019s most established maternity program, delivering around 2,700 babies a year. The hospital\u2019s 24/7 OB Emergency Department means you can walk in any time, and their Regional Perinatal Center has maternal-fetal medicine specialists with offices in both Odessa and Midland. If you\u2019re delivering at ORMC, a birth plan helps the nursing team understand your preferences quickly. <a href=\"/birth-plan-template/\">Come prepared with our free template</a> and walk in knowing what you want." },
      { name: "Medical Center Hospital", paragraph: "Medical Center Hospital, at 805 W Golf Course Rd on Odessa\u2019s west side, is Ector County\u2019s public hospital. MCH focuses on emergency, surgical, and medical services \u2014 it does not offer maternity or NICU services. If you\u2019re looking for L&D in Odessa, ORMC is the facility to plan around. MCH is mentioned here for clarity since some families confuse the two hospitals." },
    ],
    birthCenterDetails: [
      // NPI taxonomy 261QB0400X search (Odessa, Midland TX) returned zero birth centers (2026-05-19). Google Maps search for "birth center Odessa TX" returned The Birth Center of Midland (~20 mi away), which is already documented on the Midland city page.
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Ector County's STAR and STAR+PLUS managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Permian Basin. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Odessa?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Ector County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "How much does a doula cost in Odessa?", a: "$700 to $1,600 depending on experience and package. Costs in the Permian Basin tend to be lower than in major Texas metros." },
      { q: "Which Odessa hospitals are birth-plan friendly?", a: "Odessa Regional Medical Center is the only hospital in Odessa with labor and delivery services and the only Level III NICU (contact the hospital directly for current level verification) in the Permian Basin. Doulas are generally welcome at ORMC. Always confirm current visitor and support-person policies during your hospital tour." },
      { q: "Does True Joy Birthing work with Odessa families?", a: "True Joy Birthing provides free birth-prep tools for Odessa families. The free birth plan, checklist, and guided walkthrough in the app work for any Odessa birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["midland-tx", "lubbock-tx"],
  },
  "mesquite-tx": {
    city: "Mesquite",
    state: "TX",
    slug: "mesquite-tx",
    costLow: 800,
    costHigh: 2300,
    shelbiServesHere: true,
    culture: "Mesquite is a large, established suburb east of Dallas with a diverse, family-focused community. The city itself has limited hospital options, so many Mesquite families deliver at nearby facilities in Sunnyvale, Rockwall, or Dallas. The doula community here is tight-knit and supportive.",
    heroLocalDetail: "Mesquite families typically deliver at BSW Sunnyvale just east of town — it's a 10-minute drive from most of Mesquite via I-30 or US-80. The LBJ/I-30 interchange is one of the worst bottlenecks in the eastern metro — avoid it during rush hour and take Town East Blvd or Motley Drive as local alternates. The Mesquite Heritage Trail along the creek corridor is a newer paved path popular with young families, and Valley Creek Park and City Lake Park offer flat, shaded walking loops that are stroller-friendly. Town East Boulevard near Town East Mall is where the densest cluster of young families lives, and from there BSW Sunnyvale is a straight shot down I-30 east.",
    hospitalDetails: [
      { name: "Baylor Scott & White Sunnyvale", paragraph: "Baylor Scott &amp; White Sunnyvale opened in 2019 and is the newest hospital serving the east Dallas corridor \u2014 it was built specifically to relieve capacity pressure on BSW Garland and BSW Dallas. The campus sits just off I-30 in Sunnyvale, and the L&amp;D unit skews toward lower-risk births because the higher-acuity referrals still go downtown. That newer, smaller feel is exactly why some Mesquite-area families prefer it: shorter walks from parking, newer rooms, and a slightly calmer pace. Bring your birth plan regardless \u2014 new hospital doesn't mean less busy. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Texas Health Rockwall", paragraph: "Texas Health Rockwall, to the east, also serves Mesquite-area families. Note: Texas Health Rockwall has a Level I NICU (stated directly on texashealth.org), which provides basic neonatal care — not the higher-level NICU available at Baylor Sunnyvale. Mesquite families often split between Baylor Sunnyvale and Texas Health Rockwall depending on which side of town they're on. If your pregnancy is high-risk or you anticipate needing a Level III NICU, Baylor Sunnyvale is the closer option with higher-level neonatal care. Plan your route and your birth plan ahead of time." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned 0 results for Mesquite, TX
    // (searched Dallas County and Kaufman County). Google Maps "birth center Mesquite TX"
    // returned no freestanding birth centers within Mesquite city limits. Nearest options
    // are Lovers Lane Birth Center in Richardson (~8 mi) and The Birth Place Dallas (~12 mi).
    // Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas County's STAR managed care plans (Community First Health Plans and AmeriGroup serve most eastern Dallas County families). Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Mesquite area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Mesquite?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas County's STAR managed care plans (Community First Health Plans and AmeriGroup serve most eastern Dallas County families). Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in Mesquite accommodate birth plans?", a: "Baylor Scott & White Sunnyvale (Level III NICU, contact the hospital directly for current level verification) and Texas Health Rockwall (Level I NICU — basic neonatal care) both serve Mesquite-area families. Always confirm your hospital's policy during your hospital tour." },
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
    heroLocalDetail: "Medical City Plano has a Level IV NICU (stated directly on medicalcityhealthcare.com) and Texas Health Plano has a Level IV NICU (stated directly on texashealth.org) — both are busy, high-volume hospitals, and US-75, the Dallas North Tollway, and SH-121 all converge here, so afternoon rush around Legacy Drive and Legacy West can add 15 minutes you don't need in labor. Arbor Hills Nature Preserve is the walking spot every Plano mom recommends for third-trimester evenings \u2014 shaded trails, paved paths, and a nature playground if you've got older kids in tow. Legacy, Willow Bend, and Lakeside on Legacy are where you'll find the densest clusters of young families.",
    hospitalDetails: [
      { name: "Texas Health Plano", paragraph: "Texas Health Plano, in West Plano on Legacy Drive, is one of the busiest L&amp;D units in Collin County with a Level IV NICU (stated directly on texashealth.org) and a strong maternal-fetal medicine program. It sees a huge volume of births \u2014 they're well-equipped and experienced, but that pace means having your preferences written down is the best way to make sure they don't get lost in the shuffle. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Medical City Plano", paragraph: "Medical City Plano, in Central Plano, also has a high-volume L&amp;D with a Level IV NICU (stated directly on medicalcityhealthcare.com) and a strong obstetric program." },
      { name: "Baylor Scott & White Plano", paragraph: "Baylor Scott &amp; White Plano serves the eastern side of the city as well. Plano families have access to three strong hospitals, which is more than most suburbs \u2014 but all three are busy. Your OB probably delivers at one of them, so ask which one and write your plan for that hospital." },
    ],
    birthCenterDetails: [
      { name: "The Birth Place", paragraph: "The Birth Place is a freestanding birth center in the Plano area offering a midwife-led, lower-intervention setting for low-risk pregnancies. It's a good option if you want a birth center experience without leaving the city \u2014 and having a doula who knows the space makes the whole thing feel more supported." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Collin County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Plano area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Plano?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Collin County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in Plano accommodate birth plans?", a: "Texas Health Plano (Level IV NICU, stated directly on texashealth.org) and Medical City Plano (Level IV NICU, stated directly on medicalcityhealthcare.com) both accommodate birth plans. Always confirm your hospital's policy during your hospital tour." },
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
      { name: "Methodist Hospital", paragraph: "Methodist Hospital, at 7700 Floyd Curl Dr in the South Texas Medical Center, has a Level IV NICU and is San Antonio\u2019s largest hospital with 1,536 beds. Their Women\u2019s Pavilion (Suzell Waller Women\u2019s & Children\u2019s Center) is one of the most established maternity programs in South Texas. CNM midwifery services are available on staff. If you\u2019re delivering at Methodist, a birth plan helps the nursing team understand your preferences quickly in a busy Level IV facility. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "University Hospital / Women\u2019s & Children\u2019s Hospital", paragraph: "University Hospital, at 4502 Medical Dr in the Medical Center, is Bexar County\u2019s public hospital with a Level IV NICU and Level IV Maternal Center \u2014 one of only a handful of dual Level IV facilities in Texas. They\u2019re Baby-Friendly designated, a Newsweek Best Maternity Hospital (2022\u20132025), and the only SA hospital with a 24/7 OB/GYN emergency center. Doulas are generally welcome, and having someone who knows how to navigate this busy teaching hospital makes a real difference." },
      { name: "Baptist Medical Center", paragraph: "Baptist Medical Center, at 111 Dallas St in downtown San Antonio, is a high-volume L&D hospital. Contact the hospital directly for current NICU level verification. Baptist Health System also operates North Central Baptist Hospital in Stone Oak, which serves the fast-growing northern suburbs with L&D and NICU services." },
      { name: "The Children\u2019s Hospital of San Antonio (formerly CHRISTUS Santa Rosa)", paragraph: "The Children\u2019s Hospital of San Antonio, at 333 N Santa Rosa St, is the premier freestanding children\u2019s hospital in South Texas with a Level I Pediatric Trauma Center. Affiliated with Baylor College of Medicine, they handle the most complex pediatric cases. Contact the hospital directly for current NICU level verification. The hospital has been rebranded from CHRISTUS Santa Rosa \u2014 if you\u2019re looking for their maternity program, check with their current referral process." },
    ],
    birthCenterDetails: [
      { name: "Birth Center Stone Oak", paragraph: "Birth Center Stone Oak, at 27031 Granite Path in the Stone Oak area (78258), is a freestanding birth center serving San Antonio\u2019s fastest-growing northern suburb corridor. NPI-verified (1225396542)." },
      { name: "Community Birth Group", paragraph: "Community Birth Group, at 216 Tower Rd on San Antonio\u2019s East Side (78223), provides birth center services for families seeking out-of-hospital birth options. NPI-verified (1972393783)." },
      { name: "Central Texas Birth Center", paragraph: "Central Texas Birth Center, at 410 W Nakoma St (78216), offers freestanding birth center services in central San Antonio. NPI-verified (1477852986)." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Bexar County's STAR managed care plans (Superior HealthPlan, Community First Health Plans, and others). Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the San Antonio area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm. Military families: TRICARE does not currently cover doula services, but HSA and FSA funds can often help.",
    faqs: [
      { q: "How much does a doula cost in San Antonio?", a: "$700 to $2,200. San Antonio's doula market tends to be more affordable than Austin or Dallas, with many experienced doulas offering sliding scale options." },
      { q: "Does Medicaid cover doulas in San Antonio?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Bexar County's STAR managed care plans (Superior HealthPlan, Community First Health Plans, and others). Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Are there birth centers in San Antonio?", a: "Yes \u2014 San Antonio has several freestanding birth centers including Birth Center Stone Oak (Stone Oak area), Community Birth Group (East Side), and Central Texas Birth Center (central SA). Bexar County also has nearby options in Fort Worth and Mansfield. Most families deliver at one of the major hospitals (Methodist, University, Baptist, Children\u2019s Hospital of SA), but out-of-hospital birth is growing here." },
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
      { name: "Baylor Scott & White Medical Center \u2013 Hillcrest", paragraph: "Baylor Scott &amp; White \u2013 Hillcrest, off I-35 and University Parks Drive, is McLennan County\u2019s only dedicated Women\u2019s &amp; Children\u2019s Center \u2014 14 L&amp;D rooms, 26 mother-baby rooms, and a 30-bed Level III NICU (contact the hospital directly for current level verification). Hillcrest is where most Waco-area OBs deliver, which means the unit runs at high volume and the team has seen everything. Doulas are generally welcome, but policies shift, so confirm during your hospital tour. If this is where you\u2019re delivering, write your birth plan before you need it \u2014 high volume means the nurses appreciate families who come prepared rather than making decisions on the fly. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Ascension Providence Hospital", paragraph: "Ascension Providence, up on Medical Parkway near the Waco VA, has a Women's and Newborn Center with a Dell Children's Level II NICU on site (contact the hospital directly for current level verification). If we're being real, Providence's smaller L&D unit means you might see more one-on-one time with nursing staff \u2014 and shorter walks from the parking garage to the delivery room, which matters more than you'd think at 38 weeks." },
    ],
    birthCenterDetails: [
      // Verified active 2026-05-26: wacobirthcenter.com, NPI MedicalClinic schema at 1525 Austin Ave, Waco TX 76701, phone 254-224-6062. Google Maps "Waco Birth Center" returns this as primary result.
      { name: "Waco Birth Center and Clinic", paragraph: "Waco Birth Center and Clinic, on Austin Avenue near downtown, is a licensed freestanding birth center staffed by certified nurse-midwives. They accept insurance and Medicaid, making them one of the more accessible out-of-hospital birth options in Central Texas." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including McLennan County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Waco area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "How much does a doula cost in Waco?", a: "$800 to $1,500 depending on experience and package. Waco\u2019s cost of living keeps doula rates lower than Dallas or Austin \u2014 you\u2019ll typically see rates in the $800\u2013$1,200 range for standard birth packages, with premium packages running up to $1,500." },
      { q: "Does Medicaid cover doulas in Waco?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including McLennan County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in Waco accommodate birth plans?", a: "Waco has two hospitals with L&D: Baylor Scott & White \u2013 Hillcrest (30-bed Level III NICU; contact the hospital directly for current level verification, dedicated Women\u2019s & Children\u2019s Center) and Ascension Providence (Level II NICU, smaller unit with more one-on-one nursing time). Waco also has a freestanding birth center \u2014 Waco Birth Center and Clinic on Austin Avenue \u2014 for families planning an out-of-hospital birth." },
      { q: "Does True Joy Birthing work with Waco families?", a: "True Joy Birthing provides free birth-prep tools for Waco families. The free birth plan, checklist, and guided walkthrough in the app work for any Waco birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["temple-tx", "austin-tx", "dallas-tx", "fort-worth-tx"],
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
      { name: "Midland Memorial Hospital", paragraph: "Midland Memorial Hospital is the main labor and delivery hospital for Midland and much of the Permian Basin, with a Level II NICU and a full women\u2019s services program. If Midland Memorial is where you\u2019re planning to give birth, it helps to walk in already clear on your preferences, because a busy hospital admission is not the moment most moms want to explain everything from scratch. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something simple and specific to work from." },
      { name: "Odessa Regional Medical Center", paragraph: "Odessa Regional Medical Center, about 20 minutes east in Odessa, was founded as a women\u2019s and children\u2019s hospital and carries that legacy forward with a Level III NICU (contact the hospital directly for current level verification) and the Permian Basin\u2019s most established maternity program. If we\u2019re being real, Midland families who want a higher-level NICU or a more specialized maternity experience often end up here \u2014 the drive is short, and the L&D unit handles a high volume of births for the region." },
    ],
    birthCenterDetails: [
      { name: "The Birth Center of Midland", paragraph: "The Birth Center of Midland is a freestanding, midwife-led birth center offering a lower-intervention setting for low-risk pregnancies. It\u2019s the only out-of-hospital birth center in the Permian Basin \u2014 and having a doula who knows the rhythm of that space makes the whole thing feel a lot less unknown." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Midland County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Midland-Odessa area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "How much does a doula cost in Midland?", a: "$800 to $2,000 depending on experience and package. The Midland Doula Collective offers birth doula packages starting at $950, and local rates tend to be lower than the big Texas metros." },
      { q: "Does Medicaid cover doulas in Midland?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Midland County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in Midland accommodate birth plans?", a: "Midland Memorial Hospital has a full L&D program with a Level II NICU, and Odessa Regional Medical Center (about 20 minutes away) offers a Level III NICU (contact the hospital directly for current level verification) and the region\u2019s most established maternity program. Midland also has The Birth Center of Midland for families planning an out-of-hospital birth." },
      { q: "Does True Joy Birthing work with Midland families?", a: "True Joy Birthing provides free birth-prep tools for Midland families. The free birth plan, checklist, and guided walkthrough in the app work for any Midland birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["lubbock-tx"],
  },
  "mcallen-tx": {
    city: "McAllen",
    state: "TX",
    slug: "mcallen-tx",
    costLow: 600,
    costHigh: 1400,
    shelbiServesHere: false,
    culture: "McAllen sits in the heart of the Rio Grande Valley in Hidalgo County, one of the fastest-growing regions in Texas and a crossroads of American and Mexican culture. The city is known as the City of Palms, home to the International Museum of Art & Science and Quinta Mazatlan World Birding Center. Birth support here is shaped by the RGV\u2019s high uninsured rate and documented OB/GYN shortage \u2014 families often travel long distances for specialized maternity care, and doulas fill a critical gap in a community where many rely on Medicaid or the Healthy Texas Women program.",
    heroLocalDetail: "South Texas Health System McAllen sits just off Expressway 83 in central McAllen, and the main entrance is on South McColl Road \u2014 if you\u2019re coming from the west side of town during afternoon rush, McColl can back up between Nolana and the hospital. DHR Health Women\u2019s Hospital is about 10 miles east in Edinburg, a straight shot down McColl or 10th Street. The Expressway frontage roads are your faster bet most of the day, but they get congested near Sugar Road during school pickup hours.",
    hospitalDetails: [
      { name: "South Texas Health System McAllen", paragraph: "South Texas Health System McAllen, just off Expressway 83 in central McAllen, is the city\u2019s primary maternity hospital \u2014 with a verified Level III NICU that was the first in the Rio Grande Valley when it opened over 25 years ago, and a dedicated Maternity Center that\u2019s been delivering babies for 35+ years. STHS Edinburg, the system\u2019s sister facility about 8 miles east, also has a Maternity Center with L&D and a midwifery program \u2014 but families who may need NICU access deliver here, because STHS McAllen is where STHS Edinburg transfers neonatal cases. If you\u2019re delivering at STHS McAllen, having a birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor and don\u2019t want to be explaining everything from scratch. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "DHR Health Women\u2019s Hospital", paragraph: "DHR Health Women\u2019s Hospital, about 10 miles east in Edinburg, is the first and only designated Level IV Maternal Facility in the Rio Grande Valley \u2014 recognized by Texas DSHS for handling the most complex maternal cases. With 24 birthing suites, maternal-fetal medicine specialists, and VBAC support, it\u2019s the referral destination for high-risk pregnancies across the RGV. Contact the hospital directly for current NICU level and maternity service details. If we\u2019re being real, McAllen-area families increasingly deliver here for complex pregnancies \u2014 it\u2019s a short drive and the Level IV maternal designation means they\u2019re equipped for what other hospitals transfer out." },
    ],
    // Birth center search: NPI 261QB0400X returned no birthing-center results for McAllen,
    // Edinburg, Harlingen, Brownsville, Pharr, or Mission. Google Maps and social media
    // searches found no freestanding birth centers in the RGV. Verified 2026-05-17.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Hidalgo County\u2019s STAR managed care plans. Hidalgo County has one of the highest uninsured rates in the United States \u2014 many families here depend on Medicaid, CHIP, and the Healthy Texas Women program for prenatal and birth care. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Rio Grande Valley. Hidalgo County\u2019s provider shortage means fewer in-network doulas overall \u2014 check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in McAllen?", a: "$600 to $1,400 depending on experience and package. The RGV has fewer practicing doulas than major Texas metros, so availability may be limited and some doulas charge travel fees if you\u2019re outside the McAllen-Edinburg corridor. Reach out to doulas directly for current pricing and package details." },
      { q: "Does Medicaid cover doulas in McAllen?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Hidalgo County\u2019s STAR managed care plans. Families in McAllen should verify coverage with their specific plan by calling Texas Medicaid at 1-877-543-7669 or visiting YourTexasBenefits.com. Not all managed care plans have completed their doula network setup, so confirm before hiring." },
      { q: "Which hospitals in McAllen accommodate birth plans?", a: "South Texas Health System McAllen has a verified Level III NICU \u2014 the first in the Rio Grande Valley \u2014 and a dedicated Maternity Center with neonatologist-led care and 35+ years of delivering babies. STHS Edinburg, about 8 miles east in the same system, also has a Maternity Center with a midwifery program, but transfers neonatal cases to STHS McAllen. DHR Health Women\u2019s Hospital in Edinburg, about 10 miles east, is a designated Level IV Maternal Facility that handles the most complex pregnancies in the RGV \u2014 contact DHR directly for current NICU level details. The RGV does not currently have a freestanding birth center, so hospital birth is the primary option for McAllen families." },
      { q: "Does True Joy Birthing work with McAllen families?", a: "True Joy Birthing provides free birth-prep tools for McAllen families. The free birth plan, checklist, and guided walkthrough in the app work for any McAllen birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["corpus-christi-tx", "san-antonio-tx", "laredo-tx"],
  },
  "college-station-tx": {
    city: "College Station",
    state: "TX",
    slug: "college-station-tx",
    costLow: 800,
    costHigh: 1500,
    shelbiServesHere: false,
    culture: "College Station lives and breathes Aggie maroon. Home to Texas A&M University \u2014 one of the largest campuses in the nation \u2014 this Brazos Valley city of 120,000+ is a genuine college town where thousands of families balance graduate programs and growing households at the same time. The Bryan\u2013College Station metro (pop. 268,000) stretches across Brazos County, weaving tree-lined campus neighborhoods into quiet residential streets south of University Drive. The birth community here mixes graduate-student families, faculty, and born-and-raised Brazos Valley parents \u2014 and with no freestanding birth center in town, knowing your patient rights and having a written birth plan matters even more in a busy hospital system.",
    heroLocalDetail: "BSW Medical Center sits near the intersection of Texas Highway 6 and Rock Prairie Road on the south side of College Station. The main entrance faces Scott and White Drive, connecting east to Harvey Road. During Texas A&M game days and move-in weekends (\u2014August through September), traffic on Highway 6 and University Drive can add 15\u201320 minutes to a normally 10-minute drive from central College Station. Use the Rock Prairie Road exit (Exit 167A) from the Earl Rudder Freeway for direct hospital access. For higher-acuity needs, Baylor Scott & White Medical Center in Temple (about 35 minutes north on I-35) has a Level I Trauma Center and the system\u2019s most comprehensive neonatal and maternal specialty services.",
    hospitalDetails: [
      { name: "Baylor Scott & White Medical Center \u2013 College Station", paragraph: "Baylor Scott & White Medical Center \u2013 College Station, near Highway 6 and Rock Prairie Road on the south side of town, is a 142-bed hospital with a verified Level III NICU and a dedicated labor and delivery unit \u2014 both stated directly on BSW\u2019s website. Magnet-recognized for nursing excellence, with U.S. News high-performing designations for heart attack and pneumonia care. If you\u2019re delivering at BSW College Station, a written birth plan means your preferences travel with you. <a href=\"/birth-plan-template/\">Use our free template</a> to walk in prepared." },
    ],
    // Birth center search: NPI 261QB0400X returned zero results in College Station and Bryan.
    // Google Maps and social media searches found no freestanding birth centers.
    // Closest birth center options are in Houston metro (~95 miles south). Verified 2026-05-17.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees. Brazos County families on Medicaid should contact their STAR managed care plan to confirm doula coverage \u2014 some plans have started adding doula support as a covered benefit. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to verify.",
    insuranceNote: "Baylor Scott & White Health Plan is a major insurer in the Brazos Valley, and whether it covers doula services depends on your specific plan \u2014 contact your provider directly. If you\u2019re an Aggie on a student health plan or covered under a university policy, check whether HSA or FSA funds can be applied toward doula costs, since most student plans don\u2019t include direct doula benefits.",
    faqs: [
      { q: "How much does a doula cost in College Station?", a: "$800 to $1,500 depending on experience and package. College Station has fewer practicing doulas than Houston or Austin, and some travel from those cities \u2014 expect potential travel surcharges of $100\u2013$300 if you\u2019re outside the immediate Bryan\u2013College Station area." },
      { q: "Does Medicaid cover doulas in College Station?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Brazos County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup." },
      { q: "Which hospitals in College Station accommodate birth plans?", a: "Baylor Scott & White Medical Center \u2013 College Station has a verified Level III NICU and dedicated L&D unit \u2014 stated directly on their website. College Station does not have a freestanding birth center. For higher-acuity maternal or neonatal needs, Baylor Scott & White in Temple (about 35 minutes north) is the system\u2019s flagship with the most comprehensive specialty care in the region." },
      { q: "Does True Joy Birthing work with College Station families?", a: "True Joy Birthing provides free birth-prep tools for College Station families. The free birth plan, checklist, and guided walkthrough in the app work for any College Station birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["waco-tx", "austin-tx", "houston-tx"],
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
      { name: "UT Health Tyler", paragraph: "UT Health Tyler, on the south side of town, is the flagship hospital of the UT Health East Texas system with a Level III NICU designation (earned 2024; contact the hospital directly for current level verification) and labor and delivery services. If we\u2019re being real, Tyler families have two solid hospital options with Level III NICUs \u2014 which is more than most East Texas towns can say \u2014 but both can be busy, so having your preferences written down and a support advocate at your side makes the whole experience feel more manageable." },
    ],
    birthCenterDetails: [
      { name: "Azalea Birth Center", paragraph: "Azalea Birth Center, on South Broadway in central Tyler, is a freestanding birth center run by midwife Vicky Wells, offering water birth and midwife-attended out-of-hospital birth in a home-like setting. If you\u2019re considering birth center care, call ahead to confirm current availability and schedule a tour \u2014 the birth community in Tyler is growing but small, so spots can fill." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Smith County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Tyler area. Some private insurers offer maternal wellness benefits that include doula support \u2014 contact your provider directly, and check whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Tyler?", a: "$800 to $2,000 depending on experience and package. Tyler\u2019s doula community is smaller than in Dallas or Houston, but rates tend to be more affordable \u2014 you\u2019ll typically find standard birth packages in the $800\u2013$1,400 range." },
      { q: "Does Medicaid cover doulas in Tyler?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Smith County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in Tyler accommodate birth plans?", a: "CHRISTUS Mother Frances Hospital \u2013 Tyler has a verified Level III NICU (the Lucy & John Carr NICU) and Level III Maternal designation, and UT Health Tyler earned its own Level III NICU designation in 2024 (contact the hospital directly for current level verification). Tyler also has a freestanding birth center \u2014 Azalea Birth Center on South Broadway, run by midwife Vicky Wells \u2014 for families seeking out-of-hospital birth. That\u2019s two Level III hospitals and a birth center, which is more than most East Texas towns can offer." },
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
      { name: "AdventHealth Central Texas", paragraph: "AdventHealth Central Texas, on South Clear Creek Road in Killeen, is the city\u2019s only hospital with a labor and delivery unit \u2014 the J. Barry Siebenlist L&amp;D Unit, staffed by board-certified OB/GYNs and neonatologists. This is the hospital for Killeen proper: most Fort Cavazos families, Harker Heights residents, and south-Killeen neighborhoods deliver here by default because it\u2019s the closest option. AdventHealth keeps a smaller, quieter L&amp;D unit than the big Dallas or Temple hospitals \u2014 that can mean more attentive nursing, but also fewer on-site specialists for complications, so know your transfer route to BSW Temple just in case. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Baylor Scott & White Medical Center \u2013 Temple", paragraph: "Baylor Scott & White in Temple, about 20 minutes north on I-35, is a large teaching hospital that serves the broader Killeen-Temple metro. If we\u2019re being real, many Killeen families deliver here by choice or referral \u2014 it\u2019s the biggest hospital in the region and handles more complicated pregnancies. Contact the hospital directly for current NICU and maternity service details." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned 5 results for Killeen, TX.
    // Avanlee Birth and Maternity Center (NPI 1861617540, active since 2007),
    //   811 S W S Young Dr, Killeen, TX 76543 — Google Maps lists as PERMANENTLY CLOSED.
    // Dulce Birthing Center (NPI 1811513047, active since 2020, DBA "Dulce Birth &
    //   Wellness Center"), 4400-3 E Central Texas Expy Ste D, Killeen, TX 76543 —
    //   Google Maps lists as PERMANENTLY CLOSED (4.9★/38 reviews, phone 254-300-1337).
    // Community Birth Group (NPI 1003513342), National Birth Centers, Inc.
    //   (NPI 1093412330), and Private Healthcare Facilities (NPI 1639876972) all share
    //   the address 5201 Clear Creek Rd Ste C, Killeen (same as AdventHealth Central
    //   Texas); these appear to be corporate/administrative entities rather than
    //   operating birth centers — no Google Maps listings found for any of them.
    // Google Maps search "birth center Killeen TX" returned no open birth centers
    //   in Killeen proper. Nearby results are in adjacent Bell County cities:
    //   The Starting Place Birth and Wellness Center (720 N 3rd St, Temple, TX 76501,
    //   "Birth center" category, 4.8★/28 reviews, phone 254-654-9295,
    //   website thestartingplace.com, ~20 min north), Revolution Birth Services
    //   (404 N Main St, Belton, TX 76513, "Midwife" category, 4.8★/18 reviews,
    //   phone 512-843-1715, website revolutionbirthservices.org, ~15 min south),
    //   Lunaria Birth & Wellness (815 N Main St, Belton, TX 76513, NPI 1821506932,
    //   "Midwife" category, 3.9★/16 reviews, phone 512-585-4389, ~15 min south).
    // No currently open freestanding birth centers in Killeen. Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Bell County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring. Military families: TRICARE does not currently cover doula services, but HSA and FSA funds can often help.",
    insuranceNote: "Killeen\u2019s large military population means many families have Tricare, which covers hospital birth but does not directly reimburse doulas. For private insurance, whether doula services are partially covered varies by plan \u2014 contact your provider directly, and check whether HSA or FSA funds can cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Killeen?", a: "$700 to $1,800 depending on experience and package. Killeen\u2019s doula rates tend to run lower than Austin or Dallas, and some local doulas offer military discounts or sliding-scale options for Fort Cavazos families." },
      { q: "Does Medicaid cover doulas in Killeen?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Bell County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's coverage before hiring. Military families: TRICARE does not currently cover doula services, but HSA and FSA funds can often help." },
      { q: "Which hospitals in Killeen accommodate birth plans?", a: "AdventHealth Central Texas is Killeen\u2019s only hospital with L&D. Baylor Scott & White Medical Center in Temple, about 20 minutes north, also serves Killeen-area families \u2014 contact the hospital directly to ask about their current maternity services and NICU availability." },
      { q: "Does True Joy Birthing work with Killeen families?", a: "True Joy Birthing provides free birth-prep tools for Killeen families. The free birth plan, checklist, and guided walkthrough in the app work for any Killeen birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["temple-tx", "waco-tx", "austin-tx"],
  },
  "brownsville-tx": {
    city: "Brownsville",
    state: "TX",
    slug: "brownsville-tx",
    costLow: 600,
    costHigh: 1400,
    shelbiServesHere: false,
    culture: "Brownsville sits directly on the US-Mexico border adjacent to Matamoros, Tamaulipas, and its birthing culture reflects deep cross-border family ties, with many families having support networks on both sides of the bridge. At roughly 94% Hispanic population, Brownsville families commonly seek bilingual providers and value cultural traditions like cuarentena (the 40-day postpartum recovery period). The city's Gulf-coast border identity shapes everything from maternity comfort to the local approach to postpartum rest.",
    heroLocalDetail: "Valley Regional Medical Center on Alton Gloor Blvd is the only Brownsville hospital with a Level III NICU verified on its own website \u2014 a key detail for families weighing where to deliver in the RGV.",
    hospitalDetails: [
      { name: "Valley Regional Medical Center", paragraph: "If you\u2019re delivering in Brownsville, Valley Regional is the hospital most local moms already know \u2014 it\u2019s been serving RGV families for over 50 years right off Alton Gloor Blvd. They\u2019ve got a verified Level III NICU, which means if your baby needs extra care after birth, you don\u2019t have to drive to Harlingen or McAllen. Valley Regional is an HCA Healthcare hospital with a solid network of OB-GYNs and a full women\u2019s and children\u2019s program. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to walk in prepared." },
      { name: "Valley Baptist Medical Center \u2013 Brownsville", paragraph: "Valley Baptist \u2013 Brownsville is the other major hospital in town, and they\u2019ve earned Healthgrades\u2019 Labor and Delivery Excellence Award, which speaks to the quality of their maternity program. They have a NICU for newborns who need specialized support \u2014 contact the hospital directly for current NICU level and maternity service details. If you live on the south side of Brownsville, Valley Baptist may be the closer option for prenatal visits and delivery." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for Brownsville, TX (2026-05-19).
    // Google Maps and social media searches found no freestanding birth center.
    // RGV birth center documentation: see McAllen city page comment (verified 2026-05-17).
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Cameron County\u2019s STAR managed care plans. Many Brownsville families depend on Medicaid, CHIP, and the Healthy Texas Women program for prenatal and birth care. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Brownsville area. Some RGV community health workers (promotoras) may offer free or low-cost pregnancy support through local nonprofits or county health programs \u2014 check with your hospital\u2019s financial counselor for in-house support programs, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Brownsville?", a: "$600 to $1,400 depending on experience and package. The RGV\u2019s lower cost of living keeps prices below big-city Texas rates, but bilingual or bicultural doulas with specialized training may charge more. Always ask about payment plans or sliding-scale options." },
      { q: "Does Medicaid cover doulas in Brownsville?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Cameron County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which Brownsville hospitals have labor and delivery?", a: "Brownsville has two hospitals with labor and delivery: Valley Regional Medical Center on Alton Gloor Blvd (verified Level III NICU) and Valley Baptist Medical Center \u2013 Brownsville (Labor and Delivery Excellence Award from Healthgrades). Some Brownsville families also travel to Harlingen or McAllen for additional hospital options." },
      { q: "Does True Joy Birthing work for Brownsville families?", a: "True Joy Birthing provides free birth-prep tools for Brownsville families. The free birth plan, checklist, and guided walkthrough in the app work for any Brownsville birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["mcallen-tx", "corpus-christi-tx", "laredo-tx"],
  },
  "edinburg-tx": {
    city: "Edinburg",
    state: "TX",
    slug: "edinburg-tx",
    costLow: 600,
    costHigh: 1400,
    shelbiServesHere: false,
    culture: "Edinburg sits at the crossroads of the Rio Grande Valley as the Hidalgo County seat, shaped by generations of bilingual, bicultural families and a strong connection to life on the U.S.\u2013Mexico border. With UTRGV calling Edinburg home, the city blends a college-town energy with deep South Texas roots and community-centered traditions.",
    heroLocalDetail: "DHR Health Women\u2019s Hospital on McColl Road is the Rio Grande Valley\u2019s only Level IV Maternal Facility \u2014 the highest designation the state of Texas awards for maternal care.",
    hospitalDetails: [
      { name: "DHR Health Women\u2019s Hospital", paragraph: "If you\u2019re giving birth in Edinburg, chances are DHR Health Women\u2019s Hospital is on your radar \u2014 and for good reason. It\u2019s the only Level IV Maternal Facility in the entire Rio Grande Valley, which means they\u2019re equipped to handle everything from straightforward deliveries to the most complex high-risk pregnancies. They\u2019ve got maternal fetal medicine specialists on staff, VBAC support, a lactation program, genetic counseling, and even Lamaze classes right on campus. The NICU is there if your baby needs extra care after birth \u2014 contact the hospital directly for current NICU level and maternity service details. <a href=\"/birth-plan-template/\">Start your free birth plan</a> to prep for your DHR delivery." },
      { name: "South Texas Health System Edinburg / STHS McAllen", paragraph: "South Texas Health System Edinburg, over on West Trenton Road, is part of a broader hospital family \u2014 and that matters when you\u2019re planning a birth. STHS McAllen, just minutes south on Expressway 83, is where the system\u2019s maternity unit lives, so if you\u2019re leaning toward an STHS provider for prenatal care, your delivery will likely happen at the McAllen campus with its verified Level III NICU. The advantage? If anything comes up that needs a higher level of neonatal care, STHS McAllen can keep you in the same system without a scramble to another hospital network." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for Edinburg and McAllen, TX (2026-05-19).
    // Google Maps and social media searches found no freestanding birth center.
    // RGV birth center documentation: see McAllen city page comment (verified 2026-05-17).
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Hidalgo County\u2019s STAR managed care plans. Hidalgo County has one of the highest uninsured rates in the United States \u2014 many families depend on Medicaid, CHIP, and the Healthy Texas Women program. Contact your Medicaid managed care plan to confirm doula coverage, and call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Rio Grande Valley. Hidalgo County\u2019s provider shortage means fewer in-network doulas overall \u2014 check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Edinburg?", a: "$600 to $1,400 depending on experience and package. The RGV has fewer practicing doulas than major Texas metros, so availability may be limited and some doulas charge travel fees if you\u2019re outside the McAllen\u2013Edinburg corridor. Always ask about payment plans or sliding-scale options." },
      { q: "Does Medicaid cover doulas in Edinburg?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Hidalgo County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Edinburg offer labor and delivery?", a: "DHR Health Women\u2019s Hospital, on McColl Road in Edinburg, is the primary L&D hospital and the only Level IV Maternal Facility in the Rio Grande Valley. South Texas Health System\u2019s maternity services operate out of STHS McAllen, just a few miles south on Expressway 83, with a verified Level III NICU. Both systems serve Edinburg families." },
      { q: "Does True Joy Birthing work for Edinburg families?", a: "True Joy Birthing provides free birth-prep tools for Edinburg families. The free birth plan, checklist, and guided walkthrough in the app work for any Edinburg birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["mcallen-tx", "laredo-tx", "corpus-christi-tx"],
  },
  "harlingen-tx": {
    city: "Harlingen",
    state: "TX",
    slug: "harlingen-tx",
    costLow: 600,
    costHigh: 1400,
    shelbiServesHere: false,
    culture: "Harlingen is where US-77 and US-83 meet \u2014 quite literally the crossroads of the Rio Grande Valley. Known locally as \u201CThe Capital of the Valley,\u201D it pulls families from Brownsville, San Benito, and the surrounding colonias who come here for hospital births at the region\u2019s biggest medical center. Bilingual care isn\u2019t a nice-to-have in Harlingen; it\u2019s just how things are done. Expect your providers to switch between English and Spanish mid-sentence, and expect your extended family to show up at the hospital because that\u2019s how Valley families do birth \u2014 together.",
    heroLocalDetail: "Harlingen sits where the Valley\u2019s two main highways converge \u2014 US-77 (I-69E) heading north toward Corpus Christi and US-83 (I-2) stretching west to McAllen and Laredo \u2014 making it the natural healthcare destination for families across Cameron County.",
    hospitalDetails: [
      { name: "Valley Baptist Medical Center \u2013 Harlingen", paragraph: "Valley Baptist is the big one in Harlingen \u2014 586 beds, the only Level II Trauma Center in the entire Rio Grande Valley, and the hospital where most Cameron County families end up when it\u2019s time to deliver. They\u2019ve got private labor/delivery/recovery suites, a family-centered maternity unit, and the only NICU in Harlingen \u2014 contact the hospital directly for current NICU level and maternity service details. If you\u2019re a high-risk patient or your OB is concerned about complications, Valley Baptist is where you\u2019ll likely be sent. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> before your tour so you know what to ask." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for Harlingen, TX (2026-05-19).
    // Google Maps and social media searches found no freestanding birth center.
    // RGV birth center documentation: see McAllen city page comment (verified 2026-05-17).
    // Note: Harlingen Medical Center (112 beds) discontinued labor and delivery services effective
    // January 10, 2025. It is not listed as a delivery hospital.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Cameron County\u2019s STAR managed care plans. Cameron County has one of the highest uninsured rates in the state \u2014 many families here depend on Medicaid, CHIP, and the Healthy Texas Women program. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Harlingen area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Some RGV community health workers (promotoras) may offer free or low-cost pregnancy support through local nonprofits or county health programs.",
    faqs: [
      { q: "How much does a doula cost in Harlingen?", a: "$600 to $1,400 depending on experience and package. Rates in the Rio Grande Valley tend to run lower than in larger Texas metros like Austin or Dallas. Some doulas offer sliding-scale fees or package deals that include prenatal visits, labor support, and postpartum follow-up." },
      { q: "Does Medicaid cover doulas in Harlingen?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Cameron County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Harlingen have labor and delivery?", a: "Valley Baptist Medical Center \u2013 Harlingen is the city\u2019s primary hospital for labor and delivery, with a NICU, private LDR suites, and the only Level II Trauma Center in the Rio Grande Valley. Harlingen Medical Center discontinued its labor and delivery services in January 2025. Some Harlingen families also travel to McAllen or Brownsville for additional hospital options." },
      { q: "Does True Joy Birthing work for Harlingen families?", a: "True Joy Birthing provides free birth-prep tools for Harlingen families. The free birth plan, checklist, and guided walkthrough in the app work for any Harlingen birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["mcallen-tx", "corpus-christi-tx"],
  },
  "round-rock-tx": {
    city: "Round Rock",
    state: "TX",
    slug: "round-rock-tx",
    costLow: 900,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "Round Rock sits in fast-growing Williamson County, just north of Austin on I-35. It\u2019s the birthplace of Dell Technologies and one of the fastest-growing cities in the metro \u2014 young families are moving here for the schools and the cost of living, and the birth community is catching up with them. Williamson County\u2019s explosive growth means many families are driving from new subdivisions in Liberty Hill, Leander, and Hutto to deliver at St. David\u2019s Round Rock, so advance planning matters more than it does closer in to Austin.",
    heroLocalDetail: "St. David\u2019s Round Rock Medical Center sits at 2400 Round Rock Ave, just off I-35 and Round Rock Ave exit 252. From the 45 Toll Road, take the Round Rock Ave exit and head east \u2014 you\u2019ll hit the hospital in about 3 minutes. During afternoon rush, I-35 between SH 45 and the hospital exit can slow to a crawl, so build in an extra 10\u201315 minutes if you\u2019re coming from Cedar Park or Leander. Old Settlers Park is the unofficial walking spot for third-trimester Round Rock moms \u2014 flat trails, shade, and about 5 minutes from the hospital entrance.",
    hospitalDetails: [
      { name: "St. David\u2019s Round Rock Medical Center", paragraph: "St. David\u2019s Round Rock Medical Center, at 2400 Round Rock Ave, is the primary hospital for labor and delivery in Round Rock and one of the busiest L&D units in Williamson County. The hospital has a verified Level II NICU (intensive care for sick and premature infants), as listed on the St. David\u2019s HealthCare NICU specialties page, plus a full women\u2019s health program and Magnet\u00ae recognition for nursing excellence. With 209 beds and a Level II Trauma Center designation, St. David\u2019s Round Rock handles a high volume of births for the fast-growing northern Austin suburbs. If you\u2019re delivering here, bring your birth plan \u2014 this hospital sees a lot of families and moves fast, and having your preferences written down makes the intake conversation smoother when you\u2019re already in labor. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned no results for Round Rock, TX.
    // Google Maps search for "birth center Round Rock TX" and "freestanding birth center Round Rock" returned no results.
    // Nearest birth centers are in Austin (Austin Area Birthing Center and Natural Beginnings), approximately 30+ minutes south.
    // Verified 2026-05-19.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Williamson County\u2019s STAR managed care plans. Williamson County\u2019s rapid growth means a lot of newly enrolled families \u2014 contact your Medicaid managed care plan to confirm doula coverage, as some plans are still completing their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Round Rock area. Austin\u2019s tech-sector employers increasingly include maternity wellness benefits that may cover doula support \u2014 check with your HR department. HSA and FSA funds can also be applied toward out-of-pocket doula costs.",
    faqs: [
      { q: "How much does a doula cost in Round Rock?", a: "$900 to $2,200 depending on experience and package. Round Rock sits between Austin-level pricing for experienced doulas who serve the whole metro and slightly lower rates for doulas based in Williamson County. Some doulas offer travel discounts for families in Leander, Cedar Park, and Liberty Hill." },
      { q: "Does Medicaid cover doulas in Round Rock?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Williamson County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Round Rock have labor and delivery?", a: "St. David\u2019s Round Rock Medical Center at 2400 Round Rock Ave is the primary hospital for labor and delivery in Round Rock, with a verified Level II NICU and a full women\u2019s health program. Some Round Rock families also deliver at St. David\u2019s South Austin or St. David\u2019s North Austin Medical Center for additional options." },
      { q: "Does True Joy Birthing work with Round Rock families?", a: "True Joy Birthing provides free birth-prep tools for Round Rock families. The free birth plan, checklist, and guided walkthrough in the app work for any Round Rock birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["austin-tx", "killeen-tx"],
  },
  "richardson-tx": {
    city: "Richardson",
    state: "TX",
    slug: "richardson-tx",
    costLow: 900,
    costHigh: 2400,
    shelbiServesHere: false,
    culture: "Richardson is an established inner-ring suburb sandwiched between Dallas and Plano along US-75 \u2014 a Telecom Corridor city whose identity is shifting toward young families and diverse communities. The birth landscape here is anchored by Methodist Richardson Medical Center, and Richardson families also have easy access to the major hospital systems in Dallas, Garland, and Plano. Richardson\u2019s South Asian, Vietnamese, and East African communities shape a unique birth culture where family involvement in the postpartum period is the norm, not the exception.",
    heroLocalDetail: "Methodist Richardson Medical Center sits at 2831 E. President George Bush Turnpike (at Renner Road), on the east side of Richardson. From US-75, take the Renner Road exit heading east for about 2 miles, or from I-635, take the President George Bush Turnpike exit and head north \u2014 the hospital entrance is right off the Turnpike frontage road. Breckinridge Park\u2019s flat loop trail is about 5 minutes away and a popular spot for Richardson families getting third-trimester walks in close to the hospital.",
    hospitalDetails: [
      { name: "Methodist Richardson Medical Center", paragraph: "Methodist Richardson Medical Center, at 2831 E. President George Bush Turnpike, is Richardson\u2019s primary hospital for labor and delivery with a verified Level III NICU and a dedicated Women\u2019s Pavilion, both stated directly on methodisthealthsystem.org. The hospital provides 24/7 obstetric hospitalists, private labor and delivery suites, and lactation support. If you\u2019re delivering at Methodist Richardson, having your birth plan ready makes the check-in process faster when you arrive in labor \u2014 they see a steady volume from Richardson, Garland, Murphy, and Sachse families. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something clear to work from." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned no results for Richardson, TX.
    // Google Maps search for "birth center Richardson TX" and "freestanding birth center Richardson" returned no results.
    // Nearest birth centers are in Dallas (e.g., The Birth Place Dallas, approximately 20 minutes southwest).
    // Verified 2026-05-19.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Dallas County\u2019s STAR managed care plans. Richardson straddles both Dallas and Collin counties, so check which county your Medicaid enrollment falls under. Contact your Medicaid managed care plan to confirm doula coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Richardson area. The Telecom Corridor\u2019s major employers \u2014 including AT&T, Cisco, and regional health systems \u2014 increasingly offer maternity wellness benefits that may cover doula support. Check with your HR department and ask whether HSA or FSA funds can help with out-of-pocket doula costs.",
    faqs: [
      { q: "How much does a doula cost in Richardson?", a: "$900 to $2,400 depending on experience and package. Richardson\u2019s doula market overlaps with Dallas pricing, so costs run similar to inner-ring DFW suburbs. Some doulas based in Richardson or Garland may offer slightly lower rates than Dallas-proper doulas." },
      { q: "Does Medicaid cover doulas in Richardson?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas County\u2019s STAR managed care plans. Richardson straddles Dallas and Collin counties, so confirm which county your enrollment falls under. Contact your plan directly to verify coverage. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Richardson have labor and delivery?", a: "Methodist Richardson Medical Center at 2831 E. President George Bush Turnpike is Richardson\u2019s primary hospital for labor and delivery, with a verified Level III NICU and dedicated Women\u2019s Pavilion. Some Richardson families also deliver at Medical City Dallas or Baylor Scott & White in Plano for additional options." },
      { q: "Does True Joy Birthing work with Richardson families?", a: "True Joy Birthing provides free birth-prep tools for Richardson families. The free birth plan, checklist, and guided walkthrough in the app work for any Richardson birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "plano-tx", "garland-tx", "carrollton-tx"],
  },
  "conroe-tx": {
    city: "Conroe",
    state: "TX",
    slug: "conroe-tx",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: true,
    culture: "Conroe is the seat of Montgomery County and the gateway to Lake Conroe, sitting about 40 minutes north of Houston on I-45. The city has grown fast alongside The Woodlands, and HCA Houston Healthcare Conroe is the only hospital with labor and delivery in Montgomery County. Journey Birth Center, a freestanding birth center in downtown Conroe, gives families an out-of-hospital option that most neighboring counties lack. The mix of long-time Conroe residents and Houston transplants means you\u2019ll find both hospital-first and birth-center preferences in the same community.",
    heroLocalDetail: "HCA Houston Healthcare Conroe sits at 504 Medical Drive, just off I-45 North at the Loop 336 exit. If you\u2019re coming from The Woodlands or Spring, take I-45 North to Exit 87 (Loop 336 West) and follow the hospital signs. Journey Birth Center is at 1202 N San Jacinto St, about 5 minutes from the hospital in downtown Conroe.",
    hospitalDetails: [
      {
        name: "HCA Houston Healthcare Conroe",
        paragraph: "HCA Houston Healthcare Conroe, at 504 Medical Drive, is the only hospital with labor and delivery in Montgomery County. The hospital offers private birthing suites, 24/7 obstetric hospitalists, and lactation support. Contact the hospital directly for current NICU level verification, as the NICU designation was not confirmed on the hospital\u2019s website at last check. They handle a high volume of births for the Conroe\u2013The Woodlands corridor, so come with your preferences written down \u2014 a birth plan helps the team work with you when things move fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started.",
      },
    ],
    birthCenterDetails: [
      {
        name: "Journey Birth Center",
        paragraph: "Journey Birth Center, at 1202 N San Jacinto St in downtown Conroe, is a freestanding birth center offering low-intervention, midwife-led births in a home-like setting. They serve families from Conroe, The Woodlands, and Montgomery County who want an alternative to hospital birth. Verify with the center directly for current services and insurance coverage.",
      },
      {
        name: "Bliss Women\u2019s Wellness & Birth Center",
        paragraph: "Bliss Women\u2019s Wellness & Birth Center, at 14157 Horseshoe Bend in Conroe (NPI 1457935439), is an NPI-verified freestanding birth center offering midwife-led birth and women\u2019s wellness services. Verify with the center directly for current services, insurance coverage, and availability.",
      },
      {
        name: "Nativiti Family Birth Center",
        paragraph: "Nativiti Family Birth Center, at 26614 Oak Ridge Dr in The Woodlands (NPI 1245638287), is an NPI-verified freestanding birth center about 15 minutes south of Conroe. They offer CNM-led births and serve the broader Montgomery County area. Verify with the center directly for current services and insurance coverage.",
      },
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Montgomery County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "HCA Houston Healthcare Conroe accepts most major private insurance plans. Some insurers in the Montgomery County area offer maternal wellness benefits that partially cover doula services \u2014 check with your provider directly, and ask whether HSA or FSA funds can help with out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Conroe?", a: "$800 to $2,000 depending on experience and package. Conroe sits in the Houston metro market, so rates run slightly lower than in-town Houston but higher than rural East Texas. Some doulas offer sliding-scale fees or package deals that include prenatal visits, labor support, and postpartum follow-up." },
      { q: "Does Medicaid cover doulas in Conroe?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Montgomery County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Conroe have labor and delivery?", a: "HCA Houston Healthcare Conroe, at 504 Medical Drive, is the only hospital with labor and delivery in Montgomery County. Contact the hospital directly for current NICU level verification. Journey Birth Center at 1202 N San Jacinto St offers midwife-led out-of-hospital birth for low-risk pregnancies." },
      { q: "Does True Joy Birthing work for Conroe families?", a: "True Joy Birthing provides free birth-prep tools for Conroe families. The free birth plan, checklist, and guided walkthrough in the app work for any Conroe birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["houston-tx", "college-station-tx", "beaumont-tx"],
  },
  "sugar-land-tx": {
    city: "Sugar Land",
    state: "TX",
    slug: "sugar-land-tx",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: true,
    culture: "Sugar Land is one of the most affluent and diverse suburbs in the Houston metro, with large Asian and Hispanic communities that shape how families approach birth. Many families here have access to employer-based insurance and higher-end doula packages, but Fort Bend County also has growing Medicaid enrollment. Memorial Hermann Sugar Land and Houston Methodist Sugar Land anchor the birth landscape, with a Level II and Level III NICU respectively \u2014 giving families two strong hospital options within city limits.",
    heroLocalDetail: "Memorial Hermann Sugar Land sits at 17500 West Grand Parkway South, near the intersection of Sweetwater Blvd and University Blvd. Houston Methodist Sugar Land is at 16655 Southwest Freeway (US-59 at Sugar Creek). Both hospitals are 5\u201310 minutes from most Sugar Land neighborhoods. During afternoon rush on US-59, allow an extra 10 minutes if you\u2019re heading to Houston Methodist from the Riverstone or Telfair areas.",
    hospitalDetails: [
      {
        name: "Memorial Hermann Sugar Land",
        paragraph: "Memorial Hermann Sugar Land, at 17500 West Grand Parkway South, offers labor and delivery with a Level II NICU stated directly on memorialhermann.org. They\u2019re currently expanding their NICU to Level III (expected 2027), which will bring the highest-level neonatal care to Fort Bend County. For now, families needing a Level III NICU are referred to Houston Methodist Sugar Land or into the Texas Medical Center. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started.",
      },
      {
        name: "Houston Methodist Sugar Land",
        paragraph: "Houston Methodist Sugar Land, at 16655 Southwest Freeway, is the city\u2019s other major hospital for labor and delivery, with a Level III NICU stated directly on houstonmethodist.org, operated in partnership with Texas Children\u2019s Hospital. The hospital offers a full-service Childbirth Center with 24/7 obstetric hospitalists, VBAC support, and lactation consultants. If you\u2019re planning a VBAC or have a high-risk pregnancy, Houston Methodist\u2019s Level III NICU (verified on houstonmethodist.org) makes it the stronger option in Sugar Land.",
      },
    ],
    // No freestanding birth centers identified in Sugar Land or Fort Bend County.
    // Searched NPI taxonomy 261QB0400X, DONA directory, and Google Maps.
    // Nearest birth centers are in Houston proper (Nativiti Birth Center in Spring,
    // ~25 miles). Verified 2026-05-19.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Fort Bend County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "Sugar Land\u2019s mix of employer-based and marketplace insurance means most families have some coverage. Many employers in the Fort Bend County area offer maternity wellness benefits \u2014 check with HR whether your plan includes doula support. HSA and FSA funds can often be applied toward out-of-pocket doula costs.",
    faqs: [
      { q: "How much does a doula cost in Sugar Land?", a: "$900 to $2,500 depending on experience and package. Sugar Land\u2019s doula market reflects its affluent suburban setting \u2014 rates run higher than most of the Houston metro. Some doulas offer premium packages with postpartum visits, lactation support, and sibling prep at the top of the range." },
      { q: "Does Medicaid cover doulas in Sugar Land?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Fort Bend County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Sugar Land have labor and delivery?", a: "Sugar Land has two hospitals with labor and delivery: Memorial Hermann Sugar Land (verified Level II NICU on memorialhermann.org, expanding to Level III by 2027) and Houston Methodist Sugar Land (verified Level III NICU on houstonmethodist.org, operated with Texas Children\u2019s Hospital). For VBAC or high-risk pregnancies, Houston Methodist is the stronger option." },
      { q: "Does True Joy Birthing work for Sugar Land families?", a: "True Joy Birthing provides free birth-prep tools for Sugar Land families. The free birth plan, checklist, and guided walkthrough in the app work for any Sugar Land birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["houston-tx"],
  },
  "pharr-tx": {
    city: "Pharr",
    state: "TX",
    slug: "pharr-tx",
    costLow: 600,
    costHigh: 1400,
    shelbiServesHere: true,
    culture: "Pharr sits in the heart of the Rio Grande Valley, adjacent to McAllen on Expressway 83. The Pharr International Bridge connects the city to Reynosa, and cross-border family networks shape birth traditions here. Pharr families are predominantly bilingual and bicultural, with deep cuarentena traditions and promotoras filling community health gaps. While there is no hospital with labor and delivery within city limits, Pharr is a 5-minute drive from STHS McAllen and 10 minutes from DHR Health in Edinburg, giving families fast access to the RGV\u2019s major birth centers.",
    heroLocalDetail: "Pharr doesn\u2019t have its own hospital with labor and delivery, but STHS McAllen is about 5 minutes west on Expressway 83, and DHR Health Women\u2019s Hospital in Edinburg is about 10 minutes east via Expressway 83 and McColl Road. If you\u2019re in Pharr during afternoon rush, the Expressway frontage roads between Pharr and McAllen can slow down \u2014 but the drive to either hospital is rarely more than 15 minutes even at peak times.",
    hospitalDetails: [
      {
        name: "South Texas Health System McAllen",
        paragraph: "Pharr doesn\u2019t have a hospital with labor and delivery within city limits \u2014 the nearest is STHS McAllen, about 5 minutes west on Expressway 83, with a verified Level III NICU stated directly on sths.com. STHS McAllen\u2019s dedicated Maternity Center handles a high volume of RGV births and offers private birthing suites, 24/7 obstetric coverage, and lactation support. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something clear to work from.",
      },
      {
        name: "DHR Health Women\u2019s Hospital",
        paragraph: "Pharr families also use DHR Health Women\u2019s Hospital in Edinburg, about 10 minutes east, which holds a Level IV Maternal Facility designation from the state of Texas \u2014 the only one in the Rio Grande Valley. NICU level: contact the hospital directly for current designation. DHR handles the most complex pregnancies in the region, and their perinatal referral network extends across South Texas.",
      },
    ],
    // No freestanding birth centers in Pharr. NPI taxonomy 261QB0400X returned
    // zero results for Pharr, TX. Google Maps search confirmed no birth center.
    // RGV-wide search already documented on McAllen city page (verified 2026-05-17).
    // Families seeking birth center care would need to look outside the Valley.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Hidalgo County\u2019s STAR managed care plans. Hidalgo County has one of the highest uninsured rates in the United States \u2014 many families here depend on Medicaid, CHIP, and the Healthy Texas Women program for prenatal and birth care. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Most Pharr-area families with private insurance use plans through employer groups or the ACA marketplace. STHS McAllen and DHR Health accept most major plans \u2014 verify your coverage and ask about prior authorization requirements early in your pregnancy.",
    faqs: [
      { q: "How much does a doula cost in Pharr?", a: "$600 to $1,400 depending on experience and package. Rates in the Rio Grande Valley tend to run lower than in larger Texas metros like Austin or Dallas. Some doulas offer sliding-scale fees or package deals that include prenatal visits, labor support, and postpartum follow-up." },
      { q: "Does Medicaid cover doulas in Pharr?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Hidalgo County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals near Pharr have labor and delivery?", a: "Pharr doesn\u2019t have a hospital with labor and delivery within city limits. The nearest options are STHS McAllen (5 minutes west on Expressway 83, verified Level III NICU) and DHR Health Women\u2019s Hospital in Edinburg (10 minutes east, Level IV Maternal Facility). Both are a short drive from anywhere in Pharr." },
      { q: "Does True Joy Birthing work for Pharr families?", a: "True Joy Birthing provides free birth-prep tools for Pharr families. The free birth plan, checklist, and guided walkthrough in the app work for any Pharr birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["mcallen-tx", "edinburg-tx", "harlingen-tx"],
  },
  "mission-tx": {
    city: "Mission",
    state: "TX",
    slug: "mission-tx",
    costLow: 600,
    costHigh: 1400,
    shelbiServesHere: true,
    culture: "Mission is known as the \u201CHome of the Grapefruit\u201D and sits just west of McAllen on Expressway 83. Like Pharr, Mission doesn\u2019t have a hospital with labor and delivery within city limits, but it\u2019s a 10-minute drive to STHS McAllen and about 8 minutes to DHR Health in Edinburg. The community is predominantly bilingual and bicultural, with strong cuarentena traditions and a tight network of promotoras and community health workers. The citrus-industry heritage means many families have multi-generational roots here.",
    heroLocalDetail: "Mission doesn\u2019t have its own hospital with labor and delivery. STHS McAllen is about 10 minutes west on Expressway 83, and DHR Health Women\u2019s Hospital in Edinburg is about 8 minutes northeast via Business 83 and McColl Road. From downtown Mission, either hospital is accessible in under 15 minutes even during moderate traffic.",
    hospitalDetails: [
      {
        name: "South Texas Health System McAllen",
        paragraph: "Mission doesn\u2019t have a hospital with labor and delivery within city limits \u2014 the nearest is STHS McAllen, about 10 minutes west on Expressway 83, with a verified Level III NICU stated directly on sths.com. STHS McAllen\u2019s dedicated Maternity Center handles a high volume of RGV births and offers private birthing suites, 24/7 obstetric coverage, and lactation support. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something clear to work from.",
      },
      {
        name: "DHR Health Women\u2019s Hospital",
        paragraph: "Mission families also use DHR Health Women\u2019s Hospital in Edinburg, about 8 minutes northeast, which holds a Level IV Maternal Facility designation from the state of Texas \u2014 the only one in the Rio Grande Valley. NICU level: contact the hospital directly for current designation. DHR handles the most complex pregnancies in the region.",
      },
    ],
    // No freestanding birth centers in Mission. NPI taxonomy 261QB0400X returned
    // zero results for Mission, TX. Google Maps and social media confirmed no
    // birth center. RGV-wide search already documented on McAllen city page
    // (verified 2026-05-17).
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Hidalgo County\u2019s STAR managed care plans. Hidalgo County has one of the highest uninsured rates in the United States \u2014 many families here depend on Medicaid, CHIP, and the Healthy Texas Women program for prenatal and birth care. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Most Mission-area families with private insurance use plans through employer groups or the ACA marketplace. STHS McAllen and DHR Health accept most major plans \u2014 verify your coverage and ask about prior authorization requirements early in your pregnancy.",
    faqs: [
      { q: "How much does a doula cost in Mission?", a: "$600 to $1,400 depending on experience and package. Rates in the Rio Grande Valley tend to run lower than in larger Texas metros like Austin or Dallas. Some doulas offer sliding-scale fees or package deals that include prenatal visits, labor support, and postpartum follow-up." },
      { q: "Does Medicaid cover doulas in Mission?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Hidalgo County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals near Mission have labor and delivery?", a: "Mission doesn\u2019t have a hospital with labor and delivery within city limits. The nearest options are STHS McAllen (10 minutes west on Expressway 83, verified Level III NICU) and DHR Health Women\u2019s Hospital in Edinburg (8 minutes northeast, Level IV Maternal Facility). Both are a short drive from anywhere in Mission." },
      { q: "Does True Joy Birthing work for Mission families?", a: "True Joy Birthing provides free birth-prep tools for Mission families. The free birth plan, checklist, and guided walkthrough in the app work for any Mission birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["mcallen-tx", "edinburg-tx", "harlingen-tx"],
  },
  "temple-tx": {
    city: "Temple",
    state: "TX",
    slug: "temple-tx",
    costLow: 800,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "Temple is Central Texas's medical hub — Baylor Scott & White brings families from across the region for obstetric and neonatal care, and the Fort Cavazos (formerly Fort Hood) military community means a constant flow of young families navigating both TRICARE and civilian insurance. The birth community here is small but experienced, with doulas who know the BSW system inside and out.",
    heroLocalDetail: "Baylor Scott & White sits on the west side of Temple off 31st Street and Interstate 35, and during shift change at 7 AM and 7 PM that whole medical district turns into a slow crawl — if you're delivering at BSW, know the back entrance off 31st Street, because the main entrance on I-35 frontage gets backed up. AdventHealth Central Texas is about 10 minutes south in Belton, right off I-14 near the mall. Temple's Lion's Park has a flat, shaded walking loop along the creek that's a go-to for third-trimester moms — and it's only 5 minutes from BSW.",
    hospitalDetails: [
      { name: "Baylor Scott & White Medical Center – Temple", paragraph: "Baylor Scott & White Medical Center in Temple is one of the largest hospitals in Central Texas, with one of the region's most advanced NICUs, maternal-fetal medicine specialists, and a high-volume L&D unit that serves families from Killeen, Fort Cavazos, Belton, and across the region. Contact BSW directly for current NICU level verification. BSW is where many high-risk pregnancies in Central Texas end up — having your birth plan ready before you arrive makes a real difference, especially in a hospital system this large. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "AdventHealth Central Texas", paragraph: "AdventHealth Central Texas, in Belton about 10 minutes south of Temple, offers maternity care with a NICU for babies who need extra support — contact AdventHealth directly for current NICU level verification. If we're being real, AdventHealth is smaller and quieter than BSW, which some families prefer — but it also means fewer specialists on-site for complex cases, so having a doula who knows when to advocate for a transfer matters." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results in
    // Temple/Bell County. Google Maps found no freestanding birth centers.
    // Verified 2026-05-22.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Bell County's STAR managed care plans. Fort Cavazos families on TRICARE should check with their TRICARE regional contractor for doula coverage — TRICARE does not currently cover doulas, but HSA and FSA funds can often be used. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage.",
    insuranceNote: "Bell County has a large TRICARE population from Fort Cavazos — TRICARE does not currently cover doula services, but many military families use HSA or FSA funds for birth support. Baylor Scott & White Health Plan and FirstCare Health Plans are major civilian insurers in the area. Check your specific plan for maternal wellness or doula coverage benefits.",
    faqs: [
      { q: "How much does a doula cost in Temple?", a: "$800 to $2,200 depending on experience and package. Temple's doula community is small but experienced with both BSW and AdventHealth — some doulas offer military discounts for Fort Cavazos families." },
      { q: "Does Medicaid cover doulas in Temple?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Bell County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your coverage. If you're on TRICARE, doulas are not currently covered, but HSA and FSA funds can often help." },
      { q: "Which Temple hospitals accommodate birth plans?", a: "Baylor Scott & White Medical Center – Temple is the region's largest hospital with an advanced NICU and high-volume L&D unit. AdventHealth Central Texas in Belton offers maternity care in a smaller setting. Temple does not have a freestanding birth center." },
      { q: "Does True Joy Birthing work with Temple families?", a: "True Joy Birthing provides free birth-prep tools for Temple families. The free birth plan, checklist, and guided walkthrough in the app work for any Temple birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["killeen-tx", "austin-tx", "waco-tx"],
  },
  "new-braunfels-tx": {
    city: "New Braunfels",
    state: "TX",
    slug: "new-braunfels-tx",
    costLow: 850,
    costHigh: 2300,
    shelbiServesHere: false,
    culture: "New Braunfels sits where the Hill Country meets I-35 — a fast-growing city that balances German heritage, river tourism, and one of the youngest family populations in Comal County. Young families are moving here for the schools and the quality of life, but the birth community is still catching up — Resolute Health is the only hospital in town, and for a Level II+ NICU or birth center you're driving to San Antonio or Austin.",
    heroLocalDetail: "Resolute Health Hospital sits on Creekside Crossing near the I-35 and Loop 337 interchange on the city's west side — convenient from most New Braunfels neighborhoods, but during Schlitterbahn season and summer river traffic on Loop 337 and Common Street, that 10-minute drive can turn into 25. If you're delivering between June and September, know your alternate routes before contractions start. Landa Park's paved walking path along the Comal Springs is flat, shaded, and a favorite for third-trimester moms — and it's only 5 minutes from Resolute.",
    hospitalDetails: [
      { name: "Resolute Health Hospital", paragraph: "Resolute Health Hospital, on Creekside Crossing near the I-35 and Loop 337 interchange, is New Braunfels' only hospital with maternity services — offering private L&D rooms and a NICU for babies who need extra support. Contact Resolute Health directly for current NICU level verification. If we're being real, New Braunfels families with high-risk pregnancies or needing a Level III NICU often transfer to San Antonio, about 35 minutes south on I-35 — so having your birth plan ready and knowing your transfer route matters. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results in
    // New Braunfels/Comal County. Google Maps found no freestanding birth
    // centers. Nearest: Austin Area Birthing Center (~50 min), Birth Center
    // Stone Oak in San Antonio (~35 min). Verified 2026-05-22.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Comal County's STAR managed care plans. New Braunfels' rapid growth means the provider network is expanding, but some plans are still building their doula directories — call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in Comal County. Aetna, BCBS of Texas, and UnitedHealthcare all have a presence in the New Braunfels area — check your specific plan for maternal wellness or doula benefits. HSA and FSA funds can often be applied toward birth support costs.",
    faqs: [
      { q: "How much does a doula cost in New Braunfels?", a: "$850 to $2,300 depending on experience and package. New Braunfels' rapid growth means more doulas are serving the area, but availability can be limited — some commute from San Antonio or Austin and may charge travel fees." },
      { q: "Does Medicaid cover doulas in New Braunfels?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Comal County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your coverage before hiring." },
      { q: "Does New Braunfels have a birth center?", a: "New Braunfels does not have a freestanding birth center. Resolute Health Hospital is the only facility with maternity services in town. For birth center care, the nearest options are in San Antonio (about 35 minutes south) or Austin (about 50 minutes north)." },
      { q: "Does True Joy Birthing work with New Braunfels families?", a: "True Joy Birthing provides free birth-prep tools for New Braunfels families. The free birth plan, checklist, and guided walkthrough in the app work for any New Braunfels birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["san-antonio-tx", "austin-tx", "san-marcos-tx"],
  },
  "san-marcos-tx": {
    city: "San Marcos",
    state: "TX",
    slug: "san-marcos-tx",
    costLow: 800,
    costHigh: 2100,
    shelbiServesHere: false,
    culture: "San Marcos is a college town on I-35 between Austin and San Antonio — home to Texas State University and a growing population of young families who've moved here for the cost of living. The birth community here is small, and the reality is that most San Marcos families deliver at one of two nearby hospitals: Ascension Seton Hays in Kyle (15 minutes north) or Resolute Health in New Braunfels (25 minutes south). CHRISTUS Santa Rosa – San Marcos has a smaller maternity unit with basic newborn support.",
    heroLocalDetail: "If you're delivering at Seton Hays in Kyle, take I-35 north to exit 213 — the hospital is on Kyle Crossing Drive, about 15 minutes from central San Marcos. If you're heading to Resolute Health in New Braunfels, I-35 south to exit 191, about 25 minutes. During Texas State game days, I-35 through San Marcos can slow to a crawl — if you're due in the fall, know your alternate routes before contractions start. Sewell Park, on the San Marcos River near campus, has flat walking paths that are popular for third-trimester walks.",
    hospitalDetails: [
      { name: "Ascension Seton Hays Medical Center", paragraph: "Ascension Seton Hays, in Kyle about 15 minutes north of San Marcos on I-35, offers maternity care with a NICU — contact Seton Hays directly for current NICU level verification. Seton Hays is where many San Marcos and Hays County families deliver, especially those who want a closer option than driving to Austin or San Antonio. Having your birth plan ready means your preferences follow you in. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "CHRISTUS Santa Rosa Hospital – San Marcos", paragraph: "CHRISTUS Santa Rosa Hospital – San Marcos, on Wonder World Drive near the I-35 interchange, offers maternity care with basic newborn support — contact CHRISTUS Santa Rosa directly for current NICU level and maternity service verification. If we're being real, San Marcos' hospital has a smaller maternity unit than the bigger hospitals in Austin and San Antonio, and families with higher-risk pregnancies often choose Seton Hays or Resolute Health for their NICU capabilities." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned no active birth
    // centers in San Marcos/Hays County. Google Maps found no freestanding
    // birth centers. Nearest: Austin Area Birthing Center (~35 min north).
    // Verified 2026-05-22.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Hays County's STAR managed care plans. San Marcos has a significant college-student and young-family population — if you're on Medicaid, call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in Hays County. Texas State University student health plans typically don't cover doulas, but graduate students and staff may have separate coverage. BCBS of Texas and Aetna both have a strong presence in the area — check your specific plan for maternal wellness or doula benefits. HSA and FSA funds can often be applied toward birth support costs.",
    faqs: [
      { q: "How much does a doula cost in San Marcos?", a: "$800 to $2,100 depending on experience and package. San Marcos' doula community is growing but still small — some doulas commute from Austin or San Antonio, so availability and travel fees vary." },
      { q: "Does Medicaid cover doulas in San Marcos?", a: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Hays County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your coverage before hiring." },
      { q: "Where do San Marcos families deliver?", a: "Most San Marcos families deliver at Ascension Seton Hays in Kyle (about 15 minutes north on I-35) or Resolute Health in New Braunfels (about 25 minutes south). CHRISTUS Santa Rosa – San Marcos offers maternity care with basic newborn support, but families with higher-risk pregnancies often choose Seton Hays or Austin hospitals for their NICU capabilities. San Marcos does not have a freestanding birth center." },
      { q: "Does True Joy Birthing work with San Marcos families?", a: "True Joy Birthing provides free birth-prep tools for San Marcos families. The free birth plan, checklist, and guided walkthrough in the app work for any San Marcos birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["austin-tx", "san-antonio-tx", "new-braunfels-tx"],
  },
  "pearland-tx": {
    city: "Pearland",
    state: "TX",
    slug: "pearland-tx",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Pearland sits south of Houston along TX-288 in northern Brazoria County (with small portions spilling into Fort Bend and Harris counties). It\u2019s one of the fastest-growing bedroom communities in the Houston metro \u2014 Shadow Creek Ranch and Silverlake have drawn thousands of young families looking for suburban space within commuting distance of the Texas Medical Center. The birth community here is small and locally rooted; most families drive into Houston for specialist care or birth center options, but HCA Houston Healthcare Pearland gives Pearland its own in-city delivery hospital.",
    heroLocalDetail: "The TX-288/Beltway 8 interchange is the traffic choke point every Pearland family knows \u2014 during afternoon rush, southbound TX-288 from the Medical Center backs up all the way past Broadmore, and the Beltway 8 frontage roads aren\u2019t much better. If you\u2019re delivering at HCA Houston Healthcare Pearland on Shadow Creek Parkway, take the Silverlake exit off TX-288 and come in from the west \u2014 it\u2019s faster than fighting Broadway during peak times. Independence Park\u2019s trail system on the east side of town is a flat, shaded go-to for third-trimester walks, and Shadow Creek Ranch\u2019s greenbelt trails are equally popular with expectant moms in the south part of the city.",
    hospitalDetails: [
      { name: "HCA Houston Healthcare Pearland", paragraph: "HCA Houston Healthcare Pearland, at 11100 Shadow Creek Pkwy, is Pearland\u2019s only hospital with labor and delivery services, offering private birthing suites and 24/7 obstetric coverage. The hospital provides a NICU for babies who need extra support, though the specific NICU level is not stated on their website \u2014 contact the hospital directly for current NICU level verification. If we\u2019re being real, Pearland families needing a higher-level NICU are about 20 minutes from the Texas Medical Center, where Level III and IV NICU access is standard. Having your birth plan ready when you arrive at HCA Pearland makes the intake conversation smoother \u2014 especially when you\u2019re already in labor. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something clear to work from." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for
    // Pearland / Brazoria County. Google Maps found no freestanding birth
    // centers. Nearest: Bay Area Community Birth Center in Houston (~15 min
    // north on TX-288). Verified 2026-05-22.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Brazoria County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Pearland area. Many families here carry employer-based insurance through Houston-area employers \u2014 check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "How much does a doula cost in Pearland?", a: "$900 to $2,500 depending on experience and package. Pearland sits in the Houston metro market, so rates are comparable to Houston proper \u2014 some doulas based in Pearland or Shadow Creek Ranch may offer slightly lower rates than in-town Houston doulas." },
      { q: "Does Medicaid cover doulas in Pearland?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Brazoria County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Pearland have labor and delivery?", a: "HCA Houston Healthcare Pearland at 11100 Shadow Creek Pkwy is the only hospital in Pearland with labor and delivery services. Contact the hospital directly for current NICU level verification. Pearland does not have a freestanding birth center; the nearest is Bay Area Community Birth Center in Houston, about 15 minutes north." },
      { q: "Does True Joy Birthing work with Pearland families?", a: "True Joy Birthing provides free birth-prep tools for Pearland families. The free birth plan, checklist, and guided walkthrough in the app work for any Pearland birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["houston-tx", "sugar-land-tx"],
  },
  "cedar-park-tx": {
    city: "Cedar Park",
    state: "TX",
    slug: "cedar-park-tx",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Cedar Park sits in fast-growing Williamson County just northwest of Austin along US-183, anchored by the Brushy Creek area and a surge of young families moving into master-planned communities like Cedar Park Town Center and Buttercup Creek. The city itself doesn\u2019t have a hospital with labor and delivery \u2014 St. David\u2019s Cedar Park is a surgical and emergency facility, not a birth hospital \u2014 so Cedar Park families must travel for delivery. The nearest hospitals are in Round Rock (~10 miles) and Austin (~12 miles), and the nearest birth center is Austin Area Birthing Center about 8 minutes south.",
    heroLocalDetail: "US-183 (Bell Blvd) runs through the heart of Cedar Park, and the intersection with Parmer Lane and the 45 Toll Road is where most of your hospital-bound traffic decisions happen. If you\u2019re heading to St. David\u2019s Round Rock, take the 45 Toll east to I-35 and exit at Round Rock Ave \u2014 it\u2019s the fastest route even with toll fares. For St. David\u2019s Medical Center Austin, US-183 south to MoPac is your best bet, but avoid MoPac during afternoon rush or you\u2019ll be sitting in traffic at the worst possible time. Brushy Creek Lake Park\u2019s trail system is the go-to for Cedar Park moms in the third trimester \u2014 flat, paved, shaded, and about 10 minutes from both hospital routes.",
    hospitalDetails: [
      { name: "St. David\u2019s Round Rock Medical Center (~10 mi)", paragraph: "St. David\u2019s Round Rock Medical Center, about 10 miles northeast in Round Rock at 2400 Round Rock Ave, is the nearest hospital with labor and delivery for Cedar Park families. The hospital has a verified Level II NICU (intensive care for sick and premature infants), as listed on the St. David\u2019s HealthCare NICU specialties page, plus a full women\u2019s health program and Magnet\u00ae recognition for nursing excellence. With 209 beds and a Level II Trauma Center, St. David\u2019s Round Rock handles a high volume of births for the fast-growing northern Austin suburbs. If you\u2019re delivering here, bring your birth plan \u2014 this hospital sees a lot of families and moves fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "St. David\u2019s Medical Center Austin (~12 mi)", paragraph: "St. David\u2019s Medical Center Austin, about 12 miles south in central Austin, is another option for Cedar Park families, with a Level III NICU (contact the hospital directly for current level verification) and a strong maternal-fetal medicine program. If we\u2019re being real, Cedar Park families don\u2019t have a delivery hospital in their own city \u2014 so plan your route and your birth plan well before contractions start. Having both St. David\u2019s locations in your back pocket means you\u2019re covered from either direction." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for
    // Cedar Park / Williamson County outside Round Rock. Nearest birth center:
    // Austin Area Birthing Center, ~8 miles south. Verified 2026-05-22.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Williamson County\u2019s STAR managed care plans. Williamson County\u2019s rapid growth means a lot of newly enrolled families \u2014 contact your Medicaid managed care plan to confirm doula coverage, as some plans are still completing their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Cedar Park area. Austin\u2019s tech-sector employers increasingly include maternity wellness benefits that may cover doula support \u2014 check with your HR department. HSA and FSA funds can also be applied toward out-of-pocket doula costs.",
    faqs: [
      { q: "How much does a doula cost in Cedar Park?", a: "$900 to $2,500 depending on experience and package. Cedar Park sits between Austin-level pricing for experienced doulas who serve the whole metro and slightly lower rates for doulas based in Williamson County." },
      { q: "Does Medicaid cover doulas in Cedar Park?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Williamson County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Where do Cedar Park families deliver?", a: "Cedar Park does not have a hospital with labor and delivery. The nearest options are St. David\u2019s Round Rock Medical Center (~10 miles, verified Level II NICU) and St. David\u2019s Medical Center Austin (~12 miles, Level III NICU \u2014 contact the hospital directly for current level verification). The nearest birth center is Austin Area Birthing Center, about 8 miles south." },
      { q: "Does True Joy Birthing work with Cedar Park families?", a: "True Joy Birthing provides free birth-prep tools for Cedar Park families. The free birth plan, checklist, and guided walkthrough in the app work for any Cedar Park birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["austin-tx", "round-rock-tx"],
  },
  "victoria-tx": {
    city: "Victoria",
    state: "TX",
    slug: "victoria-tx",
    costLow: 700,
    costHigh: 1500,
    shelbiServesHere: false,
    culture: "Victoria is a regional hub that sits at the crossroads between Houston, San Antonio, and Austin \u2014 literally where US-59, US-87, and US-77 converge in the Texas Coastal Plains. It\u2019s an agricultural and oil town with a working-class heartbeat and deep multi-generational roots. The birth community here is small and steady; Citizens Medical Center branded their maternity unit as the \u201CCitizens Birth Center,\u201D and DeTar Healthcare System provides the city\u2019s other major hospital option. Families from surrounding counties \u2014 Calhoun, Goliad, Refugio, DeWitt, Lavaca \u2014 travel to Victoria for delivery, making advance planning especially important.",
    heroLocalDetail: "US-59 (the future I-69 / Navy Memorial Highway) runs through the heart of Victoria, and the DeTar campuses sit just off it on either side of town \u2014 DeTar Navarro near the downtown side, DeTar North on the growing north side. Citizens Medical Center is on Medical Drive near Victoria College, about 5 minutes from the US-59/Guadalupe Street interchange. Riverside Park\u2019s trail system along the Guadalupe River is where a lot of Victoria moms walk in the third trimester \u2014 flat, shaded, and a 5-minute drive from both hospital systems. Victoria College and the University of Houston\u2013Victoria campus bring a younger demographic to the central part of the city.",
    hospitalDetails: [
      { name: "Citizens Medical Center", paragraph: "Citizens Medical Center, on Medical Drive near Victoria College, is a 317-bed hospital that branded its maternity unit as the \u201CCitizens Birth Center\u201D \u2014 not to be confused with a freestanding birth center, as this is a hospital-based unit. Citizens has a verified Level II NICU stated directly on their website, along with lactation consultants and free prenatal classes. If you\u2019re delivering at Citizens, having your birth plan ready makes the intake conversation smoother \u2014 they handle births from across the region and move fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something clear to work from." },
      { name: "DeTar Healthcare System", paragraph: "DeTar Healthcare System operates two campuses in Victoria \u2014 DeTar Navarro on the south side and DeTar North on the growing north side \u2014 and provides maternity care and delivery services. DeTar confirms obstetric and newborn services on their website, though the specific NICU level is not stated \u2014 contact the hospital directly for current NICU level verification. If we\u2019re being real, Victoria families are fortunate to have two separate hospital systems in one mid-sized city, but that also means knowing which campus your OB delivers at before you\u2019re in labor." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for
    // Victoria / Victoria County. Google Maps found no freestanding birth
    // centers. Verified 2026-05-22.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Victoria County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Victoria area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "How much does a doula cost in Victoria?", a: "$700 to $1,500 depending on experience and package. Victoria\u2019s cost of living keeps doula rates lower than in the major Texas metros, but the local doula community is small \u2014 some doulas commute from Houston or San Antonio and may charge travel fees." },
      { q: "Does Medicaid cover doulas in Victoria?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Victoria County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Victoria have labor and delivery?", a: "Citizens Medical Center has a verified Level II NICU and a maternity unit branded as the \u201CCitizens Birth Center.\u201D DeTar Healthcare System also provides delivery services across two campuses (Navarro and North), though contact them directly for current NICU level verification. Victoria does not have a freestanding birth center." },
      { q: "Does True Joy Birthing work with Victoria families?", a: "True Joy Birthing provides free birth-prep tools for Victoria families. The free birth plan, checklist, and guided walkthrough in the app work for any Victoria birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["houston-tx", "san-antonio-tx", "corpus-christi-tx"],
  },
  "georgetown-tx": {
    city: "Georgetown",
    state: "TX",
    slug: "georgetown-tx",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Georgetown is the county seat of Williamson County and one of the fastest-growing cities in the Austin metro, sitting where I-35 meets SH-29 on the north side of Austin. Southwestern University gives the downtown a college-town feel, while Wolf Ranch and the I-35 corridor bring young families moving in for the schools and cost of living. Birth preferences here run the gamut \u2014 hospital births at St. David\u2019s Georgetown, trips to Round Rock for NICU care, or the out-of-hospital option at Genesis Birth Centers downtown. The city\u2019s growth means families are often new to the area and actively looking for birth support.",
    heroLocalDetail: "St. David\u2019s Georgetown Hospital sits at 2000 Scenic Dr, about 5 minutes from the I-35/SH-29 (University Ave) interchange. From I-35, take Exit 261 (SH-29/University Ave) and head west \u2014 the hospital is just past the Wolf Ranch development. Genesis Birth Centers is at 101 W Cooperative Way, near the intersection of I-35 and SH-29 in central Georgetown, about 5 minutes from the hospital. The San Gabriel River trail system runs through downtown Georgetown and connects to the hospital area \u2014 popular for third-trimester walks with shade and flat terrain.",
    hospitalDetails: [
      {
        name: "St. David\u2019s Georgetown Hospital",
        paragraph: "St. David\u2019s Georgetown Hospital, at 2000 Scenic Dr, offers maternity and newborn services for the Georgetown area. The hospital\u2019s website confirms labor and delivery, though it does not explicitly list a NICU \u2014 for anything beyond routine newborn care, families are typically referred to St. David\u2019s Round Rock (10 minutes south, verified Level II NICU) or St. David\u2019s Medical Center in Austin (20 minutes south, Level III NICU \u2014 contact the hospital directly for current level verification). If you\u2019re delivering at St. David\u2019s Georgetown, bring your birth plan so the team knows your preferences from the start. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started.",
      },
    ],
    birthCenterDetails: [
      {
        name: "Genesis Birth Centers",
        paragraph: "Genesis Birth Centers, at 101 W Cooperative Way in Georgetown (NPI 1679907356), is an NPI-verified freestanding birth center offering midwife-led births in a home-like setting. Located near the I-35/SH-29 interchange, they serve families from Georgetown, Round Rock, and northern Williamson County who want an out-of-hospital option. Verify with the center directly for current services and insurance coverage.",
      },
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Williamson County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Georgetown area. Austin\u2019s tech-sector employers increasingly include maternity wellness benefits that may cover doula support \u2014 check with your HR department. HSA and FSA funds can also be applied toward out-of-pocket doula costs.",
    faqs: [
      { q: "How much does a doula cost in Georgetown?", a: "$900 to $2,500 depending on experience and package. Georgetown\u2019s proximity to Austin means rates cluster near Austin levels, especially for doulas who serve the whole Williamson County corridor. Some doulas offer package deals that include prenatal visits, labor support, and postpartum follow-up." },
      { q: "Does Medicaid cover doulas in Georgetown?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Williamson County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Georgetown have labor and delivery?", a: "St. David\u2019s Georgetown Hospital at 2000 Scenic Dr offers maternity and newborn services. For NICU care, families are typically referred to St. David\u2019s Round Rock (10 minutes south, Level II NICU) or St. David\u2019s Medical Center in Austin (20 minutes, Level III NICU \u2014 contact the hospital directly for current level verification). Genesis Birth Centers at 101 W Cooperative Way offers midwife-led out-of-hospital birth." },
      { q: "Are there birth centers in Georgetown?", a: "Yes \u2014 Genesis Birth Centers at 101 W Cooperative Way is an NPI-verified freestanding birth center in downtown Georgetown. Their CNM-led team serves low-risk families who want an out-of-hospital birth option. Additional birth centers in the Austin metro are 25\u201340 minutes south." },
      { q: "Does True Joy Birthing work for Georgetown families?", a: "True Joy Birthing provides free birth-prep tools for Georgetown families. The free birth plan, checklist, and guided walkthrough in the app work for any Georgetown birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["austin-tx", "round-rock-tx", "cedar-park-tx"],
  },
  "spring-tx": {
    city: "Spring",
    state: "TX",
    slug: "spring-tx",
    costLow: 1000,
    costHigh: 2800,
    shelbiServesHere: false,
    culture: "Spring and The Woodlands form a fast-growing suburban corridor north of Houston along I-45. The Woodlands is a master-planned community with world-class amenities; Spring is a more affordable unincorporated area that feeds into the same hospital system. 3 birth centers serve the area.",
    heroLocalDetail: "I-45 South from The Woodlands to Houston can be brutal during rush hour \u2014 build 15-20 extra minutes if you\u2019re heading to the Texas Medical Center. Houston Methodist The Woodlands sits at 17183 I-45 South in Shenandoah, right off the interstate. The Woodlands Waterway and George Mitchell Nature Preserve trails are popular third-trimester walking spots.",
    hospitalDetails: [
      { name: "Houston Methodist The Woodlands Hospital", paragraph: "Houston Methodist The Woodlands Hospital, at 17183 I-45 South in Shenandoah, TX 77385, is a 295+ bed facility with a dedicated Childbirth Center. Per Houston Methodist system standards and Texas DSHS records, it operates as a Level III NICU facility, though the specific NICU level is not explicitly stated on the hospital\u2019s current website \u2014 contact the hospital directly for current NICU level verification. Private birthing suites and 24/7 obstetric hospitalists serve the growing Spring/The Woodlands corridor. If you\u2019re delivering here, having your birth plan ready makes the intake process smoother. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "CHI St. Luke\u2019s Health \u2014 The Woodlands (now CommonSpirit Health)", paragraph: "CHI St. Luke\u2019s Health \u2014 The Woodlands (now CommonSpirit Health) at 17200 St. Luke\u2019s Way, The Woodlands, TX 77384, has historically offered OB/GYN and labor & delivery services. Current L&D status should be verified directly with the hospital. Contact CommonSpirit Health at (936) 266-2000 for current maternity services." },
    ],
    birthCenterDetails: [
      { name: "Nativiti Family Birth Center", paragraph: "Nativiti Family Birth Center, at 26614 Oak Ridge Dr, The Woodlands, TX 77380 (NPI 1245638287), is a CNM-staffed freestanding birth center offering prenatal, natural birth, postpartum, and well-woman services. If you\u2019re planning an out-of-hospital birth in The Woodlands area, Nativiti is the closest option \u2014 call ahead to confirm availability and schedule a tour." },
      { name: "Journey Birth Center", paragraph: "Journey Birth Center, at 903 E Main St, Humble, TX 77338, offers VBAC, waterbirth, and natural birth options. About 15 minutes from The Woodlands, it\u2019s an additional freestanding birth center option for Spring and The Woodlands families seeking midwife-led out-of-hospital birth." },
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Montgomery County\u2019s STAR managed care plans. Contact your plan directly to confirm doula coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "Houston Methodist accepts most major private insurance plans. The Woodlands area\u2019s employer market (ExxonMobil, CHI St. Luke\u2019s, HCA) often includes maternity wellness benefits that may cover doula support \u2014 check with your HR department. HSA and FSA funds can also help cover out-of-pocket doula costs.",
    faqs: [
      { q: "How much does a doula cost in Spring/The Woodlands?", a: "$1,000 to $2,800 depending on experience and package. The Woodlands area tends to skew higher due to demand and proximity to Houston, while Spring providers may be slightly more affordable." },
      { q: "Does Medicaid cover doulas in Spring/The Woodlands?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Montgomery County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Spring/The Woodlands have labor and delivery?", a: "Houston Methodist The Woodlands Hospital at 17183 I-45 South has a Childbirth Center with 24/7 obstetric hospitalists (NICU level should be verified directly with the hospital). CHI St. Luke\u2019s Health \u2014 The Woodlands at 17200 St. Luke\u2019s Way has historically offered maternity services \u2014 verify current L&D status directly." },
      { q: "Are there birth centers near Spring/The Woodlands?", a: "Nativiti Family Birth Center at 26614 Oak Ridge Dr in The Woodlands (NPI 1245638287) is a CNM-staffed freestanding birth center. Journey Birth Center at 903 E Main St in Humble, about 15 minutes away, offers VBAC and waterbirth options." },
      { q: "Does True Joy Birthing work with Spring/The Woodlands families?", a: "True Joy Birthing provides free birth-prep tools for Spring and The Woodlands families. The free birth plan, checklist, and guided walkthrough in the app work for any birth setting in the area. The app also helps you connect with local doulas and midwives." },
    ],
    nearbyCities: ["houston-tx", "conroe-tx", "college-station-tx"],
  },
  "galveston-tx": {
    city: "Galveston",
    state: "TX",
    slug: "galveston-tx",
    costLow: 700,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Galveston is an island city 50 miles southeast of Houston, home to UTMB Health \u2014 one of Texas\u2019s oldest academic medical centers and a major regional provider for the entire Gulf Coast. The birth community here is small but anchored by UTMB\u2019s teaching hospital, which draws patients from across Galveston County and beyond. Hurricane season and island logistics shape birth planning \u2014 families on the island and in surrounding mainland communities like League City and Texas City often plan around weather and bridge traffic.",
    heroLocalDetail: "UTMB Health\u2019s main campus anchors the east end of the island at 301 University Blvd, with the Jennie Sealy Hospital tower visible from Broadway. Broadway (FM-3005) and Seawall Blvd are the two main east-west corridors \u2014 Seawall can flood during storms, so know your alternate routes to the hospital. The Seawall walking path and Stewart Beach area are popular for third-trimester walks with ocean views.",
    hospitalDetails: [
      { name: "UTMB Health \u2014 Jennie Sealy Hospital", paragraph: "UTMB Health \u2014 Jennie Sealy Hospital and Lyndon B. Johnson General Hospital at 301 University Blvd, Galveston, TX 77555, is a verified Level III NICU facility (Texas DSHS designated), with the highest-level NICU in the Galveston County area. As an academic medical center, UTMB handles high-risk pregnancies and complex births, with 24/7 obstetric and neonatal coverage. They offer private LDRP suites, midwifery services, and lactation support. If you\u2019re delivering at UTMB, bring your birth plan \u2014 they\u2019re a teaching hospital with a high volume of families, so having your preferences written down keeps things clear. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for
    // Galveston / Galveston County. Google Maps found no freestanding birth
    // centers on the island. Nearest birth centers are in the Clear Lake /
    // Webster area (~30 min north on I-45). Verified 2026-05-22.
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Galveston County\u2019s STAR managed care plans. Contact your plan directly to confirm doula coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "UTMB Health accepts most major insurance plans including Medicaid and CHIP. As a state academic medical center, UTMB has robust financial assistance programs for uninsured and underinsured families \u2014 ask about their charity care and payment plan options.",
    faqs: [
      { q: "How much does a doula cost in Galveston?", a: "$700 to $1,800 depending on experience and package. Galveston\u2019s cost of living keeps rates lower than Houston proper, but the local doula community is small \u2014 some doulas commute from Houston and may charge travel fees." },
      { q: "Does Medicaid cover doulas in Galveston?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Galveston County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Galveston have labor and delivery?", a: "UTMB Health \u2014 Jennie Sealy Hospital at 301 University Blvd is Galveston\u2019s primary maternity hospital, with a verified Level III NICU (Texas DSHS designated) and 24/7 obstetric and neonatal coverage. It\u2019s the only hospital on the island providing labor and delivery services." },
      { q: "Are there birth centers in Galveston?", a: "There are no freestanding birth centers on Galveston Island. The nearest birth center options are Bay Area Birth Center in the Webster/Clear Lake area, about 30 minutes north on I-45. UTMB Health does offer midwifery services within the hospital setting." },
      { q: "What should Galveston families know about hurricane-season birth planning?", a: "Galveston\u2019s hurricane season (June\u2013November) overlaps with much of the birthing year. If you\u2019re due during storm season, have an evacuation birth plan ready, know your route off the island, and discuss early delivery contingency with your OB. UTMB has storm protocols, but bridge closures can change your options fast." },
      { q: "Does True Joy Birthing work with Galveston families?", a: "True Joy Birthing provides free birth-prep tools for Galveston families. The free birth plan, checklist, and guided walkthrough in the app work for any Galveston birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["houston-tx", "sugar-land-tx"],
  },
  "lewisville-tx": {
    city: "Lewisville",
    state: "TX",
    slug: "lewisville-tx",
    costLow: 900,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "Lewisville is a fast-growing DFW suburb in southern Denton County, positioned between Dallas and Denton along I-35E and the Sam Rayburn Tollway. The city has exploded alongside Flower Mound and Highland Village, and young families are driving a growing birth community. Lewisville Lake is the defining geographic feature \u2014 it\u2019s also the reason traffic patterns here are different from the rest of DFW, with the bridge crossings and lake roads creating bottlenecks during rush hour.",
    heroLocalDetail: "Medical City Lewisville sits at 500 W Main St, about 5 minutes from the I-35E/SH-121 (Sam Rayburn Tollway) interchange. From Flower Mound or Highland Village, take FM-1171 (Main Street) straight to the hospital \u2014 but during afternoon rush, I-35E from Dallas and the tollway from DFW Airport can both jam up, so build in extra time. Lewisville Lake\u2019s shoreline trails and the Greenway Corridor are popular for third-trimester walks.",
    hospitalDetails: [
      { name: "Medical City Lewisville", paragraph: "Medical City Lewisville, at 500 W Main St, Lewisville, TX 75057, is a 191-bed Magnet-recognized hospital with a verified Level III NICU, Level II Maternal Care, and Level III Trauma Center \u2014 all confirmed on medicalcityhealthcare.com. One of the busiest L&D units in southern Denton County, with 24/7 obstetric hospitalists and lactation consultants. If you\u2019re delivering here, bring your birth plan \u2014 they see a high volume of families and having your preferences written down makes things smoother. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
    ],
    birthCenterDetails: [
      { name: "Flourish Birth & Wellness Center", paragraph: "Flourish Birth & Wellness Center in Flower Mound (NPI 1447895271), about 5 miles from Lewisville, is an NPI-verified freestanding birth center offering midwife-led births. If you\u2019re looking for an out-of-hospital birth option close to Lewisville, Flourish is the nearest birth center \u2014 verify with the center directly for current services and insurance coverage." },
      { name: "All About Babies Argyle Birth Center", paragraph: "All About Babies Argyle Birth Center in Argyle (NPI 1093349821), about 8 miles from Lewisville, is an NPI-verified freestanding birth center offering midwife-led births. A second out-of-hospital option for Lewisville families willing to drive a few extra minutes north." },
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Denton County\u2019s STAR managed care plans. Contact your plan directly to confirm doula coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "DFW\u2019s employer market (including companies near Legacy West and DFW Airport) increasingly includes maternity wellness benefits that may cover doula support \u2014 check with your HR department for doula coverage, and whether HSA or FSA funds can assist.",
    faqs: [
      { q: "How much does a doula cost in Lewisville?", a: "$900 to $2,200 depending on experience and package. Lewisville sits between Dallas and Denton pricing, with rates that tend to be slightly lower than Dallas proper but higher than rural North Texas." },
      { q: "Does Medicaid cover doulas in Lewisville?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Denton County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Lewisville have labor and delivery?", a: "Medical City Lewisville at 500 W Main St has a verified Level III NICU, Level II Maternal Care, and 24/7 obstetric hospitalists \u2014 confirmed on medicalcityhealthcare.com. It\u2019s the primary maternity hospital for the Lewisville area." },
      { q: "Are there birth centers near Lewisville?", a: "Flourish Birth & Wellness Center in Flower Mound (NPI 1447895271) is about 5 miles from Lewisville \u2014 an NPI-verified freestanding birth center with midwife-led births. All About Babies Argyle Birth Center in Argyle (NPI 1093349821) is about 8 miles away and also NPI-verified." },
      { q: "Does True Joy Birthing work with Lewisville families?", a: "True Joy Birthing provides free birth-prep tools for Lewisville families. The free birth plan, checklist, and guided walkthrough in the app work for any Lewisville birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "denton-tx", "fort-worth-tx"],
  },
  "pasadena-tx": {
    city: "Pasadena",
    state: "TX",
    slug: "pasadena-tx",
    costLow: 750,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Pasadena is the third-largest city in the Houston metro, sitting between Houston's East End and the Ship Channel industrial corridor along I-45 and SH-225. It's a working-class to middle-class community with a strong Hispanic majority and deep multi-generational roots \u2014 families here have been delivering at HCA Southeast and Memorial Hermann Southeast for decades. The birth community is hospital-centric, with the nearest freestanding birth centers 15-20 minutes away in Houston proper.",
    heroLocalDetail: "HCA Houston Healthcare Southeast sits at 4000 Spencer Hwy, just off SH-225 (Pasadena Freeway) and the South Loop access roads. Spencer Hwy is the main east-west corridor through Pasadena, and Red Bluff Rd connects to I-45 about 3 miles west. From the South Loop, take the Spencer Hwy exit and head east \u2014 the hospital is on the right. Armand Bayou Nature Center's trails are the go-to for third-trimester walks, with flat boardwalks and shade about 10 minutes from either hospital.",
    hospitalDetails: [
      { name: "HCA Houston Healthcare Southeast", paragraph: "HCA Houston Healthcare Southeast, at 4000 Spencer Hwy in Pasadena, TX 77504, has labor and delivery and a Level II NICU (special care nursery). Not Level III/IV \u2014 high-risk neonates transfer to HCA Clear Lake or Texas Children's. Contact the hospital directly for current NICU level verification. 24/7 obstetric hospitalists and lactation support. If you're delivering here, bring your birth plan \u2014 they see a high volume of families from Pasadena and the surrounding Ship Channel communities. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Memorial Hermann Southeast", paragraph: "Memorial Hermann Southeast, at 11800 Astoria Blvd in Houston, TX 77089, has labor and delivery with a well-baby nursery; does not have a standalone NICU. For anything beyond routine newborn care, transfers go to Children's Memorial Hermann (Level IV) or Memorial Hermann Memorial City (Level III). Contact the hospital directly for current maternity service details." },
    ],
    // Zero birth centers in Pasadena; nearest are Bay Area Birth Center and other Houston-area centers ~15\u201320 min away
    birthCenterDetails: [
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Harris County\u2019s STAR managed care plans. Contact your plan directly to confirm doula coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "Both HCA Southeast and Memorial Hermann Southeast accept most major private insurance and Medicaid. The Pasadena area\u2019s employer market (oil refining, maritime, healthcare) increasingly includes maternity wellness benefits \u2014 check with your provider about doula coverage.",
    faqs: [
      { q: "How much does a doula cost in Pasadena?", a: "$750 to $1,800 depending on experience and package. Pasadena sits within the Houston metro pricing range, with costs slightly lower than downtown Houston." },
      { q: "Does Medicaid cover doulas in Pasadena?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Harris County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Pasadena have labor and delivery?", a: "HCA Houston Healthcare Southeast at 4000 Spencer Hwy has labor and delivery with a Level II NICU (special care nursery) \u2014 contact the hospital directly for current NICU level verification. Memorial Hermann Southeast at 11800 Astoria Blvd has labor and delivery with a well-baby nursery but no standalone NICU." },
      { q: "Are there birth centers in Pasadena?", a: "There are currently no freestanding birth centers in Pasadena. The nearest birth centers are Bay Area Birth Center and other Houston-area centers, approximately 15\u201320 minutes away." },
      { q: "Does True Joy Birthing work with Pasadena families?", a: "True Joy Birthing provides free birth-prep tools for Pasadena families. The free birth plan, checklist, and guided walkthrough in the app work for any Pasadena birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["houston-tx", "spring-tx", "pearland-tx"],
  },
  "allen-tx": {
    city: "Allen",
    state: "TX",
    slug: "allen-tx",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Allen is an affluent, fast-growing suburb in Collin County along US-75, about 25 miles north of Dallas. The city's top-rated schools and premium retail (Allen Premium Outlets) have attracted young families in droves, and the birth community is growing to match \u2014 Allen Birthing Center opened in 2007 as one of the few freestanding birth centers in Collin County. Texas Health Allen became the first Baby-Friendly designated hospital in Texas, which matters if you're looking for a hospital that prioritizes breastfeeding support and mother-baby bonding.",
    heroLocalDetail: "Texas Health Allen sits at 1105 N Central Expressway, right off US-75 at the Stacy Rd exit. From US-75 northbound, the hospital entrance is visible from the highway \u2014 you can't miss it. During afternoon rush, US-75 between I-635 and the Stacy Rd exit can slow to a crawl, so add 10-15 minutes if you're coming from Dallas. Bethany Lakes Park and Waterford Park trails are popular for third-trimester walking, both about 5 minutes from the hospital.",
    hospitalDetails: [
      { name: "Texas Health Presbyterian Hospital Allen", paragraph: "Texas Health Presbyterian Hospital Allen, at 1105 N Central Expressway in Allen, TX 75013, has a verified Level II NICU stated directly on texashealth.org: \u201cIf your infant needs additional care after birth, Texas Health Allen has a Level II NICU.\u201d First hospital in Texas designated as Baby-Friendly by WHO/UNICEF. Offers family-centered maternity care, certified nurse midwives, OB/GYNs, doula support, pain management, and breastfeeding support. If you're delivering here, bring your birth plan \u2014 they see a high volume of Collin County families. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
    ],
    birthCenterDetails: [
      { name: "Allen Birthing Center", paragraph: "Allen Birthing Center, on W Main St in Allen, TX (NPI 1629192562, est. 2007), is an NPI-verified freestanding birth center offering midwife-led births. Verify with the center directly for current services and insurance coverage." },
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Collin County\u2019s STAR managed care plans. Contact your plan directly to confirm doula coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "DFW\u2019s employer market (including companies near Legacy West, Liberty Mutual, and Allen\u2019s corporate corridor) increasingly includes maternity wellness benefits that may cover doula support. Check with your HR department about doula coverage, and whether HSA or FSA funds can cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Allen?", a: "$900 to $2,500 depending on experience and package. Allen sits in the upper range of DFW suburban pricing, reflecting the area\u2019s higher cost of living and demand." },
      { q: "Does Medicaid cover doulas in Allen?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Collin County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Allen have labor and delivery?", a: "Texas Health Presbyterian Hospital Allen at 1105 N Central Expressway is Allen\u2019s primary maternity hospital, with a verified Level II NICU and Baby-Friendly designation \u2014 the first hospital in Texas to receive that designation." },
      { q: "Are there birth centers in Allen?", a: "Allen Birthing Center on W Main St (NPI 1629192562, est. 2007) is an NPI-verified freestanding birth center offering midwife-led births. Verify with the center directly for current services and insurance coverage." },
      { q: "Does True Joy Birthing work with Allen families?", a: "True Joy Birthing provides free birth-prep tools for Allen families. The free birth plan, checklist, and guided walkthrough in the app work for any Allen birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["dallas-tx", "plano-tx", "mckinney-tx"],
  },
  "wichita-falls-tx": {
    city: "Wichita Falls",
    state: "TX",
    slug: "wichita-falls-tx",
    costLow: 700,
    costHigh: 1500,
    shelbiServesHere: false,
    culture: "Wichita Falls is the largest city between Dallas and Oklahoma City, serving as the regional medical hub for all of North Texas and southern Oklahoma. Sheppard Air Force Base brings a rotating military family population, while multi-generational Wichita Falls families have been delivering at United Regional for decades. The city has a growing birth center option in Wichita Falls Birth & Wellness Center \u2014 rare for a city this size in West Texas.",
    heroLocalDetail: "United Regional Hospital's main campus sits at 1600 11th St in central Wichita Falls, about 5 minutes from the US-277/US-287 (Kemp Blvd) interchange. Kemp Blvd is the main north-south commercial corridor \u2014 if you're coming from Sheppard AFB, take Wichita Falls Blvd south to 11th St. Sikes Lake trails on the southwest side of town are popular for third-trimester walks, with flat paths and shade.",
    hospitalDetails: [
      { name: "United Regional Hospital", paragraph: "United Regional Hospital, at 1600 11th St in Wichita Falls, TX 76301, has labor and delivery on the 4th floor of Bridwell Tower with L&D rooms, antepartum rooms, postpartum rooms, and C-section rooms. Currently operates a Level II NICU (Special Care Nursery, cares for infants \u226530 weeks, \u22651,250g), with a Level III upgrade in progress \u2014 contact the hospital directly for current NICU level as this may change. Offers an OB Emergency Department, IBCLC lactation support daily, and outpatient lactation services. If you're delivering here, bring your birth plan \u2014 they handle the entire region's births, from Wichita Falls to southern Oklahoma. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
    ],
    birthCenterDetails: [
      { name: "Wichita Falls Birth & Wellness Center", paragraph: "Wichita Falls Birth & Wellness Center, at 2001 Brook Ave in Wichita Falls, TX 76301 (NPI 1730628918), is an NPI-verified freestanding birth center. Verify with the center directly for current services and insurance coverage." },
    ],
    medicaidNote: "Texas Medicaid covers doula services as of September 2024 under SB 750 for eligible enrollees, including Wichita County\u2019s STAR managed care plans. Contact your plan directly to confirm doula coverage before hiring, as not all plans have completed their doula network setup. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com.",
    insuranceNote: "United Regional accepts most major private insurance and Medicaid. The Wichita Falls area\u2019s employer market (Sheppard AFB, manufacturing, healthcare) may include maternity wellness benefits \u2014 check with your provider. TRICARE covers doula services for military families at Sheppard AFB; verify current coverage with your TRICARE plan.",
    faqs: [
      { q: "How much does a doula cost in Wichita Falls?", a: "$700 to $1,500 depending on experience and package. Wichita Falls has lower doula costs than major Texas metros, reflecting the regional market." },
      { q: "Does Medicaid cover doulas in Wichita Falls?", a: "Yes \u2014 as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Wichita County\u2019s STAR managed care plans. Contact your plan directly to confirm coverage before hiring. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com." },
      { q: "Which hospitals in Wichita Falls have labor and delivery?", a: "United Regional Hospital at 1600 11th St is the regional hub for labor and delivery, currently operating a Level II NICU (Special Care Nursery) with a Level III upgrade in progress \u2014 contact the hospital directly for current NICU level as this may change." },
      { q: "Are there birth centers in Wichita Falls?", a: "Wichita Falls Birth & Wellness Center at 2001 Brook Ave (NPI 1730628918) is an NPI-verified freestanding birth center. Verify with the center directly for current services and insurance coverage." },
      { q: "Does True Joy Birthing work with Wichita Falls families?", a: "True Joy Birthing provides free birth-prep tools for Wichita Falls families. The free birth plan, checklist, and guided walkthrough in the app work for any Wichita Falls birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "Does TRICARE cover doula services for Sheppard AFB families?", a: "TRICARE covers doula services for military families at Sheppard AFB. Verify current coverage details with your TRICARE plan, as policies can change." },
    ],
    nearbyCities: ["dallas-tx"],
  },
  "concord-nc": {
    city: "Concord",
    state: "NC",
    slug: "concord-nc",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Concord sits in Cabarrus County northeast of Charlotte, a fast-growing area where NASCAR\u2019s home meets suburban family life. The birth community draws from Charlotte\u2019s doula network, with some doulas based locally in Concord and Kannapolis. Cabarrus County has a solid Medicaid birth rate, and families here increasingly seek evidence-based birth support that bridges hospital and community care.",
    heroLocalDetail: "Atrium Health Cabarrus sits at 920 Church Street North in Concord, right off I-85 Exit 58 (George W. Liles Parkway). If you\u2019re coming from the Harrisburg area or southern Cabarrus County, I-85 to Exit 58 is your fastest route \u2014 but Concord Mills mall traffic and NASCAR race-day congestion at Charlotte Motor Speedway can back up I-85 and Bruton Smith Boulevard for hours during events. Know your back route through Poplar Tent Road before you need it. Frank Liske Park\u2019s trails and the Irish Creek Greenway are popular third-trimester walking spots \u2014 flat, shaded, and about 10 minutes from the hospital.",
    hospitalDetails: [
      { name: "Atrium Health Cabarrus", paragraph: "Atrium Health Cabarrus, at 920 Church Street North in Concord, is a 457-bed regional hospital and the primary maternity provider for Cabarrus County. The hospital includes the Jeff Gordon Children\u2019s Center with a NICU for newborns needing specialized care \u2014 contact the hospital directly for current NICU level verification. As part of Atrium Health (now Advocate Health), Cabarrus has access to maternal-fetal medicine specialists and the full Atrium Health Levine Children\u2019s network for complex cases. If you\u2019re delivering at Cabarrus, having your birth plan ready keeps your preferences clear in a busy regional hospital where the team handles a high volume of families. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Concord (ZIPs 28025, 28026, 28027), Cabarrus County. Google Maps search
    // "birth center Concord NC" found no freestanding birth centers within Concord
    // city limits. Charlotte-area birth centers (e.g., Baby+Co., Queens Free Birth
    // Center) are approximately 25-35 minutes away in Mecklenburg County.
    // Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes \u2014 as of October 1, 2024, North Carolina Medicaid covers doula services for eligible enrollees, including Cabarrus County\u2019s managed care plans (WellCare, UnitedHealthcare, Carolina Complete Health). Contact NC Medicaid at 1-800-662-7030 or visit.ncdhhs.gov to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Concord area. Atrium Health\u2019s employer network and Charlotte-area insurers increasingly include maternal wellness benefits \u2014 check with your provider about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "Does Medicaid cover doulas in Concord?", a: "Yes \u2014 as of October 1, 2024, North Carolina Medicaid covers doula services for eligible enrollees, including Cabarrus County\u2019s managed care plans. Contact NC Medicaid at 1-800-662-7030 or visit.ncdhhs.gov to confirm your plan\u2019s coverage before hiring." },
      { q: "Which hospitals in Concord accommodate birth plans?", a: "Atrium Health Cabarrus at 920 Church Street North is Concord\u2019s primary hospital for labor and delivery with a NICU and maternal-fetal medicine specialists \u2014 contact the hospital directly for current NICU level verification. Always confirm visitor and support-person policies during your hospital tour." },
      { q: "How much does a doula cost in Concord?", a: "$800 to $2,000 depending on experience and package. Concord sits in the Charlotte metro pricing zone, with costs slightly lower than Charlotte proper but higher than rural North Carolina." },
      { q: "Does True Joy Birthing work with Concord families?", a: "True Joy Birthing provides free birth-prep tools for Concord families. The free birth plan, checklist, and guided walkthrough in the app work for any Concord birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["charlotte-nc", "raleigh-nc"],
  },
  "cumming-ga": {
    city: "Cumming",
    state: "GA",
    slug: "cumming-ga",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Cumming is the county seat of Forsyth County, one of the fastest-growing counties in metro Atlanta. The city sits at the intersection of Georgia 400 and Highway 20, where suburban sprawl meets Lake Lanier country. Forsyth County\u2019s birth community is anchored by Northside Hospital Forsyth \u2014 part of the Northside Hospital system that delivers more babies than any other hospital system in Georgia. Families here tend to be well-insured and increasingly seek out doulas and birth planners as the community grows.",
    heroLocalDetail: "Northside Hospital Forsyth sits at 1200 Northside Forsyth Drive, just off GA-400 at Exit 16 (Pilgrim Mill Road). GA-400 is your lifeline to the hospital \u2014 but it backs up hard during weekday rush hours between exits 13 and 17, and weekend lake traffic around Lanier can add 10\u201315 minutes when you least want it. Sawnee Mountain Preserve\u2019s trails and the Big Creek Greenway are where Cumming moms walk in the third trimester \u2014 flat, shaded, and accessible from the hospital side of town. neighborhoods like Vickery, Windermere, and Three Chimneys are where most young families are clustered.",
    hospitalDetails: [
      { name: "Northside Hospital Forsyth", paragraph: "Northside Hospital Forsyth, at 1200 Northside Forsyth Drive in Cumming, is part of the Northside Hospital system \u2014 the busiest birthing hospital system in Georgia. It has a Level III NICU (stated directly on northside.com) and high-volume labor and delivery services with maternal-fetal medicine specialists on the medical staff. If you\u2019re delivering at Northside Forsyth, the maternity unit sees a high volume of families, so having your birth plan written before you arrive keeps your preferences clear in a fast-moving environment. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Emory Johns Creek Hospital", paragraph: "Emory Johns Creek Hospital, about 15 minutes south of Cumming at 6325 Hospital Parkway in Johns Creek, also offers labor and delivery with a NICU \u2014 contact the hospital directly for current NICU level verification. Some Forsyth County families choose Emory Johns Creek for its Emory-affiliated maternal-fetal medicine team, particularly for high-risk pregnancies. If we\u2019re being real, your OB probably delivers at one of these two hospitals \u2014 so know which one and plan your route before contractions start." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Cumming (ZIPs 30028, 30040, 30041), Forsyth County. Google Maps search
    // "birth center Cumming GA" found no freestanding birth centers within Cumming
    // city limits. Northside Hospital Forsyth offers a natural birth suite within
    // the hospital, but there are no freestanding out-of-hospital birth centers in
    // Forsyth County. Atlanta-area birth centers are approximately 40-50 minutes
    // south in the I-285 perimeter.
    // Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "As of 2026, Georgia Medicaid does not yet cover doula services. Georgia House Bill 290, which would add Medicaid doula coverage, has been introduced but not yet enacted into law. Check with Georgia Medicaid at 1-877-423-4746 or visit dph.georgia.gov for the most current status. Forsyth County families on Medicaid should also check with their managed care plan about any maternal wellness benefits that might include doula support.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Cumming area. Northside Hospital\u2019s affiliated insurance networks and Atlanta-area employers increasingly include maternal wellness benefits \u2014 check with your provider about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "Does Medicaid cover doulas in Cumming?", a: "As of 2026, Georgia Medicaid does not yet cover doula services. HB 290, which would add Medicaid doula coverage, has been introduced in the Georgia legislature but not yet enacted. Check with Georgia Medicaid at 1-877-423-4746 for the most current status." },
      { q: "Which hospitals in Cumming accommodate birth plans?", a: "Northside Hospital Forsyth (Level III NICU, stated directly on northside.com) is Cumming\u2019s primary maternity hospital and generally accommodates birth plans. Emory Johns Creek Hospital, about 15 minutes south, also offers L&D with a NICU \u2014 contact the hospital directly for current NICU level verification. Always confirm your hospital\u2019s current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Cumming?", a: "$900 to $2,500 depending on experience and package. Cumming sits in the north Atlanta metro pricing range, with costs comparable to Alpharetta and Johns Creek." },
      { q: "Does True Joy Birthing work with Cumming families?", a: "True Joy Birthing provides free birth-prep tools for Cumming families. The free birth plan, checklist, and guided walkthrough in the app work for any Cumming birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["atlanta-ga", "concord-nc"],
  },
  "greenville-sc": {
    city: "Greenville",
    state: "SC",
    slug: "greenville-sc",
    costLow: 800,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "Greenville is the economic and medical hub of Upstate South Carolina, where a booming downtown meets Appalachian foothill culture. The city anchors the Prisma Health and Bon Secours health systems, and families from across the region travel here for hospital births. The birth community is growing alongside the city\u2019s population boom \u2014 doulas, lactation consultants, and midwives are increasingly visible and accessible, though the area still has fewer birth professionals per capita than Charlotte or Atlanta.",
    heroLocalDetail: "Prisma Health Greenville Memorial Hospital sits at 701 Grove Road on the east side of Greenville, about 8 minutes from downtown via I-385 and Faris Road. Bon Secours St. Francis is on the west side at 1 Saint Francis Drive, accessible via US-123 from the Clemson/Powdersville direction. During afternoon rush, I-385 between downtown and the Grove Road exit backs up steadily \u2014 and Falls Park on the Reedy draws weekend crowds that can slow your approach to St. Francis from the north. The Swamp Rabbit Trail, running 22 miles from Greenville to Travelers Rest, is the go-to third-trimester walking path \u2014 flat, paved, and shaded through Cleveland Park right near Greenville Memorial.",
    hospitalDetails: [
      { name: "Prisma Health Greenville Memorial Hospital", paragraph: "Prisma Health Greenville Memorial, at 701 Grove Road in Greenville, is the largest hospital in Upstate South Carolina and the regional referral center for high-risk pregnancies and complex neonatal care. It has a Level III NICU (stated directly on prismahealth.org) and the Prisma Health Children\u2019s Hospital on the same campus, making it the go-to for families navigating complicated pregnancies in the Upstate. If you\u2019re delivering at Greenville Memorial, having a birth plan keeps your preferences clear in a large, busy teaching hospital. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Bon Secours St. Francis Hospital", paragraph: "Bon Secours St. Francis Hospital, at 1 Saint Francis Drive on Greenville\u2019s west side, offers labor and delivery with a faith-based care approach and a well-established maternity program. It provides L&D services and newborn nursery care \u2014 contact the hospital directly for current NICU level verification. St. Francis is known for personalized attention and a quieter environment than the large academic hospital across town. If we\u2019re being real, having two strong hospital systems in Greenville gives families a real choice \u2014 write your birth plan for whichever hospital you choose so your preferences travel with you." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Greenville (ZIPs 29601, 29605, 29606, 29607, 29609, 29611, 29614, 29615,
    // 29616, 29617), Greenville County. Google Maps search "birth center Greenville
    // SC" found no freestanding birth centers within Greenville County. The nearest
    // birth centers are in the Charlotte metro area, approximately 90 minutes north.
    // Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes \u2014 as of July 1, 2022, South Carolina Medicaid covers doula services for eligible enrollees under the SC Healthy Connections program, including Greenville County\u2019s managed care plans (Molina Healthcare, First Choice by Select Health, Absolute Total Care). Contact SC Healthy Connections at 1-888-549-0820 or visit scdhhs.gov to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Greenville area. Prisma Health\u2019s employer network and Upstate SC employers increasingly include maternal wellness benefits \u2014 check with your provider about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "Does Medicaid cover doulas in Greenville?", a: "Yes \u2014 as of July 1, 2022, South Carolina Medicaid covers doula services for eligible enrollees under the SC Healthy Connections program, including Greenville County\u2019s managed care plans. Contact SC Healthy Connections at 1-888-549-0820 or visit scdhhs.gov to confirm your plan\u2019s coverage before hiring." },
      { q: "Which hospitals in Greenville accommodate birth plans?", a: "Prisma Health Greenville Memorial Hospital (Level III NICU, stated directly on prismahealth.org) and Bon Secours St. Francis Hospital both offer labor and delivery and generally accommodate birth plans. Always confirm your hospital\u2019s current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Greenville?", a: "$800 to $2,200 depending on experience and package. Greenville\u2019s cost of living keeps rates lower than Charlotte or Atlanta, but the growing doula community means you\u2019ll find doulas at various price points." },
      { q: "Does True Joy Birthing work with Greenville families?", a: "True Joy Birthing provides free birth-prep tools for Greenville families. The free birth plan, checklist, and guided walkthrough in the app work for any Greenville birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["charlotte-nc", "atlanta-ga"],
  },
  "charlotte-nc": {
    city: "Charlotte",
    state: "NC",
    slug: "charlotte-nc",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Charlotte is the largest city in the Carolinas and a major banking hub with a rapidly growing, diverse population. The birth community here is one of the strongest between Atlanta and Washington, DC \u2014 multiple birth centers, a robust doula network, and two major health systems (Atrium Health and Novant Health) that handle high volumes of births across the metro. Families in Charlotte increasingly seek out evidence-based, personalized birth support, and the local doula community reflects that demand.",
    heroLocalDetail: "Atrium Health Carolinas Medical Center sits at 1000 Blythe Boulevard in the Elizabeth neighborhood, just east of Uptown \u2014 and the I-77/I-85 interchange near Brookshire Freeway can back up badly during afternoon rush, adding 15 minutes you don't want to be figuring out in labor. Novant Health Presbyterian Medical Center is on Randolph Road in the Cotswold area, about 10 minutes from Uptown via East Morehead Street. The Little Sugar Creek Greenway running through Midtown and Freedom Park's trails are where Charlotte moms walk in the third trimester \u2014 flat, shaded, and close enough to both hospital systems that you're never far if something picks up. Neighborhoods like NoDa, Plaza Midwood, and South End are where you'll find most of the young families and birth professionals.",
    hospitalDetails: [
      { name: "Atrium Health Carolinas Medical Center", paragraph: "Atrium Health Carolinas Medical Center, at 1000 Blythe Boulevard in Charlotte, is the flagship hospital of the Atrium Health system and one of the busiest birthing hospitals in the Carolinas. It houses the Atrium Health Levine Children's Hospital with a Level IV NICU \u2014 verified on atriumhealth.org \u2014 making it the regional referral center for the most complex neonatal cases. The maternity program handles high-risk pregnancies with maternal-fetal medicine specialists, 24/7 neonatologists, and a dedicated transport team. If you're delivering at Carolinas Medical Center, having your birth plan ready makes the intake conversation smoother in a hospital that sees this kind of volume. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Novant Health Presbyterian Medical Center", paragraph: "Novant Health Presbyterian Medical Center, on Randolph Road in the Cotswold area of Charlotte, is Novant Health's flagship hospital with a Level III NICU (verified on novanthealth.org) and Hemby Children's Hospital on the same campus. Presbyterian has one of the highest birth volumes in the Charlotte metro and a strong maternal-fetal medicine program. Doulas are generally welcome as part of your support team, though visitor policies can shift seasonally \u2014 confirm during your hospital tour. If we're being real, Charlotte has two massive hospital systems and they both move fast \u2014 having a doula who knows the rhythm of your specific hospital makes a real difference when you're already in labor." },
    ],
    // Birth center search: Google Maps search "birth center Charlotte NC" found
    // Baby+Co. (4211 Stuart Andrew Blvd, Charlotte, NC 28217, categorized as "Birth center",
    // 4.8\u2605/5 reviews, phone (704) 930-5401, website babyandco.net) and
    // Queens Free Birth Center (4709 Ashley Park Dr, Charlotte, NC 28210, categorized as
    // "Birth center", website queensbirthcenter.com). Verified 2026-05-26.
    birthCenterDetails: [
      { name: "Baby+Co. Birth Center", paragraph: "Baby+Co. Birth Center, at 4211 Stuart Andrew Blvd in southwest Charlotte, is a freestanding birth center offering midwife-led birth in a lower-intervention setting. It's part of the Baby+Co. network with locations across the Southeast, staffed by certified nurse midwives with hospital transfer agreements in place. If you're planning an out-of-hospital birth in Charlotte, Baby+Co. is one of the most established options \u2014 and having a doula who knows the birth center space makes the whole experience feel a lot less unknown. Call ahead to confirm current availability and schedule a tour." },
      { name: "Queens Free Birth Center", paragraph: "Queens Free Birth Center, at 4709 Ashley Park Dr in Charlotte, offers midwife-led birth services in a freestanding birth center setting. It serves families seeking a lower-intervention, community-centered birth experience in the Charlotte metro. Verify with the center directly for current services, insurance coverage, and availability." },
    ],
    medicaidNote: "Yes \u2014 as of October 1, 2024, North Carolina Medicaid covers doula services for eligible enrollees, including Mecklenburg County's managed care plans (WellCare, UnitedHealthcare, Carolina Complete Health, Healthy Blue). Contact NC Medicaid at 1-800-662-7030 or visit.ncdhhs.gov to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Charlotte area. Atrium Health's employer network and Charlotte-area insurers increasingly include maternal wellness benefits \u2014 check with your provider about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "Does Medicaid cover doulas in Charlotte?", a: "Yes \u2014 as of October 1, 2024, North Carolina Medicaid covers doula services for eligible enrollees, including Mecklenburg County's managed care plans. Contact NC Medicaid at 1-800-662-7030 or visit.ncdhhs.gov to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in Charlotte accommodate birth plans?", a: "Atrium Health Carolinas Medical Center (Level IV NICU, verified on atriumhealth.org) and Novant Health Presbyterian Medical Center (Level III NICU, verified on novanthealth.org) both accommodate birth plans and handle high volumes of births. Always confirm your hospital's current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Charlotte?", a: "$900 to $2,500 depending on experience and package. Charlotte's large doula community means a wide range of pricing and specialties \u2014 bilingual doulas, VBAC-experienced doulas, and postpartum-focused support are all available." },
      { q: "Does True Joy Birthing work with Charlotte families?", a: "True Joy Birthing provides free birth-prep tools for Charlotte families. The free birth plan, checklist, and guided walkthrough in the app work for any Charlotte birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["concord-nc", "greenville-sc"],
  },
  "raleigh-nc": {
    city: "Raleigh",
    state: "NC",
    slug: "raleigh-nc",
    costLow: 850,
    costHigh: 2300,
    shelbiServesHere: false,
    culture: "Raleigh is the capital of North Carolina and part of the Research Triangle, with a highly educated population drawn by NC State, RTP tech employers, and state government. The birth community benefits from proximity to UNC Chapel Hill and Duke's academic medical systems, and families here have access to WakeMed (the city's highest-volume birthing hospital), UNC REX, and Duke Regional. The Triangle's doula community is organized and growing, with strong networks of birth and postpartum doulas serving Wake, Durham, and Orange counties.",
    heroLocalDetail: "WakeMed Raleigh Campus sits at 3000 New Bern Avenue in east Raleigh, about 10 minutes from downtown via New Bern Avenue \u2014 but the New Bern Avenue corridor between downtown and the hospital backs up hard during weekday rush, so know your back route before contractions start. UNC REX Healthcare is at 4418 Lake Boone Trail in west Raleigh near the I-440 Beltline, where the Edwards Mill and Lake Boone exits can slow during afternoon commute. Duke Regional Hospital is at 3643 North Roxboro Road in north Durham, about 25 minutes from downtown Raleigh via I-85. The Neuse River Greenway Trail (28 miles of paved, flat greenway) and Umstead State Park's trails are where Raleigh moms walk in the third trimester \u2014 shaded, well-maintained, and close enough to all three hospitals.",
    hospitalDetails: [
      { name: "WakeMed Raleigh Campus", paragraph: "WakeMed Raleigh Campus, at 3000 New Bern Avenue, is the highest-volume birthing hospital in Wake County and one of the busiest in the state. It houses the WakeMed Women's Pavilion and a Level IV NICU (verified on wakemed.org), making it the regional referral center for the most complex neonatal cases in the Triangle. WakeMed handles a massive volume of births \u2014 more than most North Carolina hospitals \u2014 and they've seen every kind of birth plan. Having yours in hand when you arrive keeps your preferences clear in a fast-moving environment. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "UNC REX Healthcare", paragraph: "UNC REX Healthcare, at 4418 Lake Boone Trail in west Raleigh, is part of the UNC Health system with a Level III NICU (verified on unchealth.org) and a strong maternal-fetal medicine program. UNC REX is known for a slightly calmer, more personal feel than the city's highest-volume hospitals while still providing comprehensive neonatal care. If you're delivering at UNC REX, having your birth plan ready means your preferences travel with you \u2014 even in a well-run hospital, things move fast." },
      { name: "Duke Regional Hospital", paragraph: "Duke Regional Hospital, at 3643 North Roxboro Road in north Durham, is part of the Duke Health system with a Level III NICU (verified on dukehealth.org) and a full obstetric program. While technically in Durham, it's a 25-minute drive from Raleigh and one of the Triangle's major birthing hospitals. Duke Regional serves many Wake County families, particularly those in northwest Raleigh and Cary. If we're being real, crossing county lines for your hospital is common in the Triangle \u2014 just make sure you know the route before you need it." },
    ],
    // Birth center search: Google Maps search "birth center Raleigh NC" found
    // Raleigh Birth Center (4700 Homewood Court, Suite 120, Raleigh, NC 27612,
    // categorized as "Birth center", 5.0\u2605/34 reviews, website raleighbirthcenter.com).
    // No NPI taxonomy 261QB0400X results found for Raleigh. Verified 2026-05-26.
    birthCenterDetails: [
      { name: "Raleigh Birth Center", paragraph: "Raleigh Birth Center, at 4700 Homewood Court Suite 120 in Raleigh, is a freestanding birth center offering midwife-led birth in a lower-intervention setting. It's the only dedicated birth center in Raleigh proper and has been serving Triangle families for years with CPM and CNM midwives. If you're planning an out-of-hospital birth in Wake County, this is the primary option \u2014 and having a doula who knows the transfer protocols to WakeMed or UNC REX makes the safety net feel solid. Call ahead to confirm current availability and schedule a tour." },
    ],
    medicaidNote: "Yes \u2014 as of October 1, 2024, North Carolina Medicaid covers doula services for eligible enrollees, including Wake County's managed care plans (WellCare, UnitedHealthcare, Carolina Complete Health, Healthy Blue). Contact NC Medicaid at 1-800-662-7030 or visit.ncdhhs.gov to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Raleigh area. The Triangle's employer market (Duke, IBM, Cisco, Red Hat) increasingly includes maternal wellness benefits \u2014 check with your provider about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "Does Medicaid cover doulas in Raleigh?", a: "Yes \u2014 as of October 1, 2024, North Carolina Medicaid covers doula services for eligible enrollees, including Wake County's managed care plans. Contact NC Medicaid at 1-800-662-7030 or visit.ncdhhs.gov to confirm your plan's coverage before hiring." },
      { q: "Which hospitals in Raleigh accommodate birth plans?", a: "WakeMed Raleigh Campus (Level IV NICU, verified on wakemed.org), UNC REX Healthcare (Level III NICU, verified on unchealth.org), and Duke Regional Hospital in Durham (Level III NICU, verified on dukehealth.org) all accommodate birth plans. WakeMed handles the highest volume in Wake County. Always confirm your hospital's current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Raleigh?", a: "$850 to $2,300 depending on experience and package. Raleigh's doula community is growing alongside the city's population, with rates that sit between Charlotte and smaller North Carolina cities." },
      { q: "Does True Joy Birthing work with Raleigh families?", a: "True Joy Birthing provides free birth-prep tools for Raleigh families. The free birth plan, checklist, and guided walkthrough in the app work for any Raleigh birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["concord-nc", "greenville-sc"],
  },
  "atlanta-ga": {
    city: "Atlanta",
    state: "GA",
    slug: "atlanta-ga",
    costLow: 1000,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Atlanta is the largest city in the Southeast and the undisputed medical hub of Georgia, with Northside Hospital delivering more babies than any other single hospital in the country. The birth community here is massive and diverse \u2014 Black maternal health organizations, Spanish-speaking doulas, VBAC advocates, and birth center communities all have a strong presence. Atlanta families have more birth options than anywhere else in Georgia, but navigating a metro this large also means planning your route and your team carefully.",
    heroLocalDetail: "Northside Hospital Atlanta sits at 1000 Johnson Ferry Road NE in Sandy Springs, just inside the Perimeter (I-285) on the north side \u2014 and the Glenridge Drive/Johnson Ferry Road intersection backs up during morning and afternoon rush, so add 15 minutes if you're coming from inside I-285. Emory University Hospital Midtown is at 550 Peachtree Street NE in Midtown Atlanta, where Peachtree Street traffic and Midtown event congestion can slow your approach on any given day. Piedmont Atlanta Hospital is at 1968 Peachtree Road NW in Buckhead, accessible via I-75/85 to the Peachtree Road exit. The Atlanta BeltLine's Eastside Trail and Piedmont Park's loop are where Atlanta moms walk in the third trimester \u2014 the BeltLine is flat, shaded, and connects some of the city's most family-friendly neighborhoods.",
    hospitalDetails: [
      { name: "Northside Hospital Atlanta", paragraph: "Northside Hospital Atlanta, at 1000 Johnson Ferry Road NE in Sandy Springs, delivers more babies than any other hospital in the country \u2014 over 16,000 births a year across the Northside system. It has a Level III NICU (stated directly on northside.com) and Level IV Maternal Care verification (the first hospital in the country to receive this designation from the Joint Commission). Northside's sheer volume means they've seen every kind of birth plan and every level of complexity \u2014 but that also means they move fast, so coming in with your preferences written down keeps your voice in the room. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something specific to work from." },
      { name: "Emory University Hospital Midtown", paragraph: "Emory University Hospital Midtown, at 550 Peachtree Street NE in Midtown Atlanta, is part of the Emory Healthcare system with a Level III NICU (verified on emoryhealthcare.org) and a full maternal-fetal medicine program. As an academic medical center, Emory Midtown handles both routine and high-risk pregnancies with 24/7 obstetric and neonatal coverage. If you're navigating a high-risk pregnancy and want an academic hospital, Emory Midtown's team is one of the strongest in the Southeast \u2014 and having a doula who knows how academic hospitals work makes the whole experience feel more grounded." },
      { name: "Piedmont Atlanta Hospital", paragraph: "Piedmont Atlanta Hospital, at 1968 Peachtree Road NW in Buckhead, has a Level III NICU (verified on piedmont.org) and a comprehensive women's services program including maternal-fetal medicine. Piedmont is a well-established Buckhead hospital that serves a large portion of Atlanta's intown and northside families. If we're being real, Atlanta has more hospital options than most cities \u2014 know which hospital your OB delivers at and plan your route from home before contractions start." },
    ],
    // Birth center search: Google Maps search "birth center Atlanta GA" found
    // Intown Birth Center (1401 Montgomery Ferry Drive NE, Atlanta, GA 30306,
    // categorized as "Birth center", 4.9\u2605/82 reviews, website intownbirthcenter.com)
    // and Atlanta Birth Center (1442 Flat Shoals Ave SE, Atlanta, GA 30316,
    // categorized as "Birth center", 4.9\u2605/67 reviews, website atlantabirthcenter.com).
    // Verified 2026-05-26.
    birthCenterDetails: [
      { name: "Intown Birth Center", paragraph: "Intown Birth Center, at 1401 Montgomery Ferry Drive NE in Atlanta's Morningside neighborhood, is a freestanding birth center offering midwife-led birth in a lower-intervention setting. It's one of Atlanta's most established birth centers, with CNM midwives and transfer agreements with nearby hospitals. If you're planning an out-of-hospital birth in intown Atlanta, Intown Birth Center is a primary option \u2014 and having a doula who knows the birth center space and transfer protocols makes the experience feel supported." },
      { name: "Atlanta Birth Center", paragraph: "Atlanta Birth Center, at 1442 Flat Shoals Ave SE in East Atlanta, is a freestanding birth center serving families seeking a community-centered, lower-intervention birth experience. It's located in the East Atlanta Village area, convenient for families in southeast intown neighborhoods. Verify with the center directly for current services, insurance coverage, and availability." },
    ],
    medicaidNote: "As of 2026, Georgia Medicaid does not yet cover doula services. Georgia House Bill 290, which would add Medicaid doula coverage, has been introduced but not yet enacted into law. Check with Georgia Medicaid at 1-877-423-4746 or visit dph.georgia.gov for the most current status. Fulton, DeKalb, and Clayton County families on Medicaid should also check with their managed care plan about any maternal wellness benefits that might include doula support.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Atlanta area. Atlanta's large employer market (Delta, Home Depot, Coca-Cola, Emory, CDC) increasingly includes maternal wellness benefits \u2014 check with your HR department about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "Does Medicaid cover doulas in Atlanta?", a: "As of 2026, Georgia Medicaid does not yet cover doula services. HB 290, which would add Medicaid doula coverage, has been introduced in the Georgia legislature but not yet enacted. Check with Georgia Medicaid at 1-877-423-4746 for the most current status." },
      { q: "Which hospitals in Atlanta accommodate birth plans?", a: "Northside Hospital Atlanta (Level III NICU and Level IV Maternal Care, verified on northside.com), Emory University Hospital Midtown (Level III NICU, verified on emoryhealthcare.org), and Piedmont Atlanta Hospital (Level III NICU, verified on piedmont.org) all accommodate birth plans. Northside handles the highest birth volume in the country. Always confirm your hospital's current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Atlanta?", a: "$1,000 to $3,000 depending on experience and package. Atlanta's large and diverse doula community means you'll find a wide range of pricing \u2014 bilingual doulas, Black maternal health specialists, VBAC-experienced doulas, and postpartum-focused support are all available." },
      { q: "Does True Joy Birthing work with Atlanta families?", a: "True Joy Birthing provides free birth-prep tools for Atlanta families. The free birth plan, checklist, and guided walkthrough in the app work for any Atlanta birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["cumming-ga", "greenville-sc"],
  },
  "savannah-ga": {
    city: "Savannah",
    state: "GA",
    slug: "savannah-ga",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Savannah is Georgia\u2019s oldest city and the medical hub of the Coastal Empire, where Memorial Health University Medical Center and St. Joseph\u2019s/Candler anchor a two-system hospital landscape. The birth community here is small but growing \u2014 local doulas, lactation consultants, and childbirth educators serve Chatham County families and the surrounding rural counties that funnel into Savannah for hospital births. The city\u2019s historic character and walkable downtown attract young families, but the doula network is tighter-knit than in Atlanta, and availability can be limited compared to larger metros.",
    heroLocalDetail: "Memorial Health University Medical Center sits at 4700 Waters Avenue in midtown Savannah, about 10 minutes from the historic district via DeRenne Avenue \u2014 and the DeRenne Avenue/Waters Avenue intersection backs up during weekday rush, so know your route before contractions start. Candler Hospital is at 5353 Reynolds Street on the southside, accessible via Abercorn Street or the Truman Parkway. I-16 terminates at I-95 just west of the city, and I-516 loops through the southside, but surface streets like Abercorn and DeRenne are often faster during rush than getting on and off the interstates. Forsyth Park\u2019s walking loop around the fountain and Daffin Park\u2019s flat paths on the east side are where Savannah moms walk in the third trimester \u2014 shaded, flat, and close to both hospitals. Ardsley Park and Baldwin Park are where you\u2019ll find most young families.",
    hospitalDetails: [
      { name: "Memorial Health University Medical Center", paragraph: "Memorial Health University Medical Center, at 4700 Waters Avenue in Savannah, is the region\u2019s largest hospital and the only Level I trauma center between Jacksonville and Charleston. Now part of HCA Healthcare, Memorial Health houses the Dwaine & Cynthia Willett Children\u2019s Hospital of Savannah on campus with a Level III NICU (stated directly on memorialhealth.com) and serves as the regional referral center for high-risk pregnancies across southeast Georgia. If you\u2019re delivering at Memorial, having your birth plan ready helps you navigate a busy regional hospital that sees families from a huge geographic area. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "St. Joseph\u2019s/Candler \u2014 Candler Hospital", paragraph: "Candler Hospital, at 5353 Reynolds Street on Savannah\u2019s southside, is part of the St. Joseph\u2019s/Candler health system and home to the Mary Telfair Women\u2019s Hospital, which provides labor and delivery, surgical services, and pediatric care. Contact the hospital directly for current NICU level verification. Candler is known for its faith-based care tradition and a more personal feel than the large regional hospital across town. If we\u2019re being real, Savannah has two strong hospital systems and they\u2019re about 15 minutes apart by car \u2014 know which one your OB delivers at and plan your route before you need it." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Savannah (ZIPs 31401, 31404, 31405, 31406, 31407, 31408, 31410, 31411, 31415,
    // 31419), Chatham County. Google Maps search "birth center Savannah GA" found no
    // freestanding birth centers within Savannah/Chatham County. Hospital birth is the
    // primary option. Nearest birth centers are approximately 4 hours north in the
    // Atlanta metro area.
    // Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "As of 2026, Georgia Medicaid does not yet cover doula services. Georgia House Bill 290, which would add Medicaid doula coverage, has been introduced but not yet enacted into law. Check with Georgia Medicaid at 1-877-423-4746 or visit dph.georgia.gov for the most current status. Chatham County families on Medicaid should also check with their managed care plan (AmeriHealth Caritas, CareSource, PeachState Health Plan) about any maternal wellness benefits that might include doula support.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Savannah area. Gulfstream Aerospace, JCB, and other Savannah-area employers increasingly include maternal wellness benefits \u2014 check with your provider about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Savannah?", a: "$800 to $2,000 depending on experience and package. Savannah\u2019s smaller doula community means costs are lower than Atlanta, but availability may be more limited and some doulas may charge travel fees for families in surrounding counties." },
      { q: "Does Medicaid cover doulas in Savannah?", a: "As of 2026, Georgia Medicaid does not yet cover doula services. HB 290, which would add Medicaid doula coverage, has been introduced in the Georgia legislature but not yet enacted. Check with Georgia Medicaid at 1-877-423-4746 for the most current status." },
      { q: "Which Savannah hospitals accommodate birth plans?", a: "Memorial Health University Medical Center (Level III NICU, stated directly on memorialhealth.com) and St. Joseph\u2019s/Candler Candler Hospital both offer labor and delivery and generally accommodate birth plans. Always confirm your hospital\u2019s current visitor and support-person policies during your tour." },
      { q: "Does True Joy Birthing work with Savannah families?", a: "True Joy Birthing provides free birth-prep tools for Savannah families. The free birth plan, checklist, and guided walkthrough in the app work for any Savannah birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["atlanta-ga", "charlotte-nc"],
  },
  "jacksonville-fl": {
    city: "Jacksonville",
    state: "FL",
    slug: "jacksonville-fl",
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Jacksonville is the largest city by area in the continental United States, spread across Duval County with distinct neighborhoods separated by the St. Johns River. Baptist Health and Ascension St. Vincent\u2019s anchor the hospital landscape, with Wolfson Children\u2019s Hospital providing the region\u2019s highest-level neonatal care. The city\u2019s massive military presence \u2014 Naval Air Station Jacksonville, Naval Station Mayport, and a large veteran population \u2014 means a significant TRICARE-covered family base with unique maternity needs. The local birth community is growing but dispersed across a metro area that covers 875 square miles.",
    heroLocalDetail: "Baptist Medical Center Jacksonville sits at 800 Prudential Drive on the south bank of the St. Johns River, just across the Fuller Warren Bridge from downtown \u2014 and that bridge backs up badly during afternoon rush, adding 10\u201315 minutes if you\u2019re coming from downtown or the northside. Ascension St. Vincent\u2019s Riverside is at 1 Shircliff Way in the Riverside neighborhood, about 5 minutes from downtown via Park Street. I-95 cuts north\u2013south through the city, I-10 terminates downtown from the west, and the I-295 loop encircles the entire metro. Blanding Boulevard on the westside and Southside Boulevard on the southside are the surface-street traffic bottlenecks that can slow a hospital drive when the interstates jam up. Memorial Park\u2019s riverfront paths in Riverside and the Jacksonville-Baldwin Rail Trail on the westside are where Jacksonville moms walk in the third trimester \u2014 flat, shaded, and away from the worst traffic.",
    hospitalDetails: [
      { name: "Baptist Medical Center Jacksonville", paragraph: "Baptist Medical Center Jacksonville, at 800 Prudential Drive on the St. Johns River\u2019s south bank, is the flagship of the Baptist Health system and the highest-volume birthing hospital in northeast Florida. Wolfson Children\u2019s Hospital is adjacent on the same campus, providing a Level IV NICU (verified on wolfsonchildrens.com) and the region\u2019s most advanced neonatal care. Baptist handles a huge volume of births and has maternal-fetal medicine specialists on staff. If you\u2019re delivering at Baptist, having your birth plan ready keeps your preferences clear in a hospital that sees families from across a massive geographic area. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Ascension St. Vincent\u2019s Riverside", paragraph: "Ascension St. Vincent\u2019s Riverside, at 1 Shircliff Way in Jacksonville\u2019s Riverside neighborhood, is part of the Ascension health system and offers labor and delivery with a faith-based care approach. Contact the hospital directly for current NICU level verification. St. Vincent\u2019s serves families in the urban core and westside, and its location in the historic Riverside neighborhood means you\u2019re minutes from downtown without crossing the river. If we\u2019re being real, Jacksonville\u2019s size means your hospital choice often comes down to which side of the river you live on \u2014 have your route planned before contractions start." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Jacksonville (ZIPs 32202, 32204, 32205, 32206, 32207, 32208, 32209, 32210,
    // 32211, 32216, 32217, 32218, 32221, 32222, 32223, 32224, 32225, 32226, 32227,
    // 32228, 32244, 32246, 32250, 32256, 32257, 32258), Duval County. Google Maps
    // search "birth center Jacksonville FL" found no freestanding birth centers within
    // Duval County. Hospital birth is the primary option. No CABC-accredited birth
    // centers in the Jacksonville metro.
    // Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "As of 2026, Florida Medicaid does not cover doula services. Florida has not enacted legislation to add Medicaid doula coverage. Duval County families on Medicaid should check with their managed care plan (Staywell, Sunshine Health, Simply Healthcare, UnitedHealthcare Community Plan) about any maternal wellness benefits that might include doula support. Contact Florida Medicaid at 1-877-254-1055 or visit flmedicaidmanagedcare.com for current plan information.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Jacksonville area. TRICARE covers maternity care for military families \u2014 check TRICARE\u2019s current doula and support-person policy at tricare.mil. Jacksonville\u2019s employer market (CSX, Fidelity, Anthem Blue Cross, Naval Station Mayport) increasingly includes maternal wellness benefits \u2014 check with your provider about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Jacksonville?", a: "$900 to $2,500 depending on experience and package. Jacksonville\u2019s large metro area means a wider range of pricing, and military families should check whether their TRICARE plan covers any doula support." },
      { q: "Does Medicaid cover doulas in Jacksonville?", a: "As of 2026, Florida Medicaid does not cover doula services. Florida has not enacted legislation to add Medicaid doula coverage. Contact Florida Medicaid at 1-877-254-1055 for the most current status." },
      { q: "Which Jacksonville hospitals accommodate birth plans?", a: "Baptist Medical Center Jacksonville (Level IV NICU via Wolfson Children\u2019s Hospital, verified on wolfsonchildrens.com) and Ascension St. Vincent\u2019s Riverside both offer labor and delivery and generally accommodate birth plans. Always confirm your hospital\u2019s current visitor and support-person policies during your tour." },
      { q: "Does True Joy Birthing work with Jacksonville families?", a: "True Joy Birthing provides free birth-prep tools for Jacksonville families. The free birth plan, checklist, and guided walkthrough in the app work for any Jacksonville birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["greenville-sc", "charlotte-nc"],
  },
  "greensboro-nc": {
    city: "Greensboro",
    state: "NC",
    slug: "greensboro-nc",
    costLow: 850,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "Greensboro is the largest city in the Piedmont Triad and a major healthcare hub anchored by Cone Health, which operates one of the few standalone women\u2019s hospitals in North Carolina. The birth community benefits from the city\u2019s academic and healthcare infrastructure \u2014 the UNC Greensboro nursing program, Cone Health\u2019s residency programs, and a growing network of doulas and lactation consultants serve Guilford County and the broader Triad region. Families here have access to dedicated women\u2019s hospital care that most North Carolina cities don\u2019t offer, and North Carolina\u2019s Medicaid doula coverage (effective October 2024) gives more families a pathway to birth support.",
    heroLocalDetail: "Cone Health Women\u2019s Hospital sits at 801 Green Valley Road in northwest Greensboro, about 12 minutes from downtown via Friendly Avenue \u2014 and Friendly Avenue between Elm Street and Green Valley Road backs up steady during afternoon rush, so add 10 minutes if you\u2019re coming from the center city. Moses Cone Hospital is at 1200 North Elm Street just south of downtown, about 8 minutes from Women\u2019s Hospital via Wendover Avenue. I-40 runs east\u2013west through Greensboro, I-85 runs northeast\u2013southwest, and the I-73/I-840 southern bypass moves traffic around the perimeter. Battleground Avenue on the northwest side and Wendover Avenue east\u2013west are the surface-street routes that slow down when the interstates jam. The Bog Garden at Benjamin Park and the Greensboro Arboretum\u2019s walking trails are where Greensboro moms walk in the third trimester \u2014 flat, shaded, and minutes from both hospitals. Fisher Park and Lindley Park are where you\u2019ll find most young families.",
    hospitalDetails: [
      { name: "Cone Health Women\u2019s Hospital", paragraph: "Cone Health Women\u2019s Hospital, at 801 Green Valley Road in Greensboro, is one of the few standalone women\u2019s hospitals in North Carolina \u2014 dedicated entirely to women\u2019s and infants\u2019 care with a Level III NICU (stated directly on conehealth.com) and 24/7 neonatologist coverage. Having a hospital built specifically for birth means the entire staff, from L&D nurses to lactation consultants, focuses on maternity care every day. If you\u2019re delivering at Women\u2019s Hospital, having your birth plan ready means your preferences are documented in a hospital that was designed around exactly this kind of care. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Moses Cone Hospital", paragraph: "Moses Cone Hospital, at 1200 North Elm Street in Greensboro, is the flagship of the Cone Health system and the region\u2019s Level I trauma center. While maternity and neonatal care is primarily delivered at nearby Women\u2019s Hospital, Moses Cone handles complex medical cases that overlap with pregnancy and provides the maternal-fetal medicine referral base for the system. Contact the hospital directly for current NICU level verification. If we\u2019re being real, most Greensboro families deliver at Women\u2019s Hospital \u2014 but knowing Moses Cone is the backup for medical complexity gives you confidence that the system can handle whatever comes your way." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Greensboro (ZIPs 27401, 27403, 27405, 27406, 27407, 27408, 27409, 27410,
    // 27455, 27413), Guilford County. Google Maps search "birth center Greensboro NC"
    // found no freestanding birth centers within Greensboro/Guilford County. Cone
    // Health Women's Hospital provides the primary maternity option. The nearest
    // birth centers are in the Raleigh/Durham area (approximately 60-80 minutes
    // east) and Charlotte (approximately 90 minutes south).
    // Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes \u2014 as of October 1, 2024, North Carolina Medicaid covers doula services for eligible enrollees, including Guilford County\u2019s managed care plans (WellCare, UnitedHealthcare, Carolina Complete Health, Healthy Blue). Contact NC Medicaid at 1-800-662-7030 or visit ncdhhs.gov to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Greensboro area. The Triad\u2019s employer market (Volvo Trucks, Honda Aircraft, Syngenta, VF Corporation, Lincoln Financial) increasingly includes maternal wellness benefits \u2014 check with your provider about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Greensboro?", a: "$850 to $2,200 depending on experience and package. Greensboro\u2019s cost of living keeps rates comparable to Raleigh and lower than Charlotte, and the growing doula community means you\u2019ll find doulas at various price points." },
      { q: "Does Medicaid cover doulas in Greensboro?", a: "Yes \u2014 as of October 1, 2024, North Carolina Medicaid covers doula services for eligible enrollees, including Guilford County\u2019s managed care plans. Contact NC Medicaid at 1-800-662-7030 or visit ncdhhs.gov to confirm your plan\u2019s coverage before hiring." },
      { q: "Which Greensboro hospitals accommodate birth plans?", a: "Cone Health Women\u2019s Hospital (Level III NICU, stated directly on conehealth.com) is Greensboro\u2019s primary maternity hospital and generally accommodates birth plans. Moses Cone Hospital provides the system\u2019s medical backup for complex cases. Always confirm your hospital\u2019s current visitor and support-person policies during your tour." },
      { q: "Does True Joy Birthing work with Greensboro families?", a: "True Joy Birthing provides free birth-prep tools for Greensboro families. The free birth plan, checklist, and guided walkthrough in the app work for any Greensboro birth setting. The app also helps you connect with local doulas and midwives in your area." },
    ],
    nearbyCities: ["charlotte-nc", "raleigh-nc"],
  },
};

export const citySlugs = Object.keys(cities).sort();