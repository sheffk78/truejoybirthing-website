// ═══════════════════════════════════════════════════════════════
// City data — single source of truth for all birth-support pages
// ═══════════════════════════════════════════════════════════════

export interface HospitalDetail {
  name: string;
  address?: string;
  paragraph: string;
  thumbnail?: string;
  nicuLevel?: string;
  birthVolume?: string;           // e.g. "~4,500 births/year"
  vbacPolicy?: string;            // e.g. "Allows TOLAC/VBAC"
  doulaPolicy?: string;            // e.g. "Doulas welcome as support persons"
  midwifeFriendly?: boolean;       // CNM-attended births available
  waterBirth?: string;            // e.g. "Labor tubs available; water birth not routinely offered"
  medicaid?: boolean;              // Accepts Health First Colorado
  lactation?: boolean;             // IBCLCs on staff
  privateRooms?: boolean;          // Private L&D rooms
  url?: string;                    // Hospital maternity page URL
}

export interface BirthCenterDetail {
  name: string;
  address?: string;
  paragraph: string;
  thumbnail?: string;
  distance?: string;              // e.g. "45 miles from Denver" for centers outside the city
  credential?: string;            // e.g. "CABC Accredited", "State Licensed"
  services?: string[];            // e.g. ["Water Birth", "VBAC", "Home Transfer"]
  costRange?: string;             // e.g. "$4,000–$6,000"
  medicaid?: boolean;             // Accepts Medicaid/Medicaid birth coverage
  url?: string;                   // Birth center website URL
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Testimonial {
  quote: string;
  attribution: string;
  source: 'client' | 'doula' | 'midwife';
}

export interface LocalDoula {
  name: string;
  credential?: string;
  practice?: string;
  url?: string;
  description?: string;
  photo?: string;              // Path to headshot in /images/doulas/ (e.g. '/images/doulas/sonja-spitzer.webp')
  isAmbassador?: boolean;
  isMidwife?: boolean;
  costRange?: string;          // e.g. "$800–$1,200"
  serviceArea?: string[];      // e.g. ["Denver", "Aurora", "Lakewood"]
  acceptsMedicaid?: boolean;   // If true, show green "Accepts Medicaid" badge
  services?: string[];         // e.g. ["Birth Doula", "Postpartum", "Lactation"]
  acceptingClients?: boolean | string; // true = "Accepting clients", false = hide, string = custom label
}

export interface CityData {
  city: string;
  state: string;
  slug: string;
  costLow: number;
  costHigh: number;
  shelbiServesHere: boolean;
  lat?: number;                // Required for GeoCoordinates schema
  lng?: number;                // Required for GeoCoordinates schema
  publishedDate?: string;      // YYYY-MM-DD for sitemap lastmod
  culture: string;
  heroLocalDetail: string;
  hospitalDetails: HospitalDetail[];
  birthCenterDetails: BirthCenterDetail[];
  localDoulas?: LocalDoula[];
  medicaidNote: string;
  insuranceNote: string;
  faqs: FaqItem[];
  nearbyCities: string[];
  testimonials?: Testimonial[];  // Real client quotes; if absent, show 'What local moms ask' Q&A
  enableBlogResources?: boolean;  // Show hero-image blog cards vs icon cards in Related Resources
  heroImage?: string;             // City-specific hero skyline image (e.g. '/images/denver-co-birth-doula-skyline.webp')
  supportSceneImage?: string;     // City-specific support scene image (e.g. '/images/denver-support-scene.webp')
  supportSceneAlt?: string;       // City-specific support scene alt text
  ogImage?: string;               // City-specific OG image URL (e.g. 'https://truejoybirthing.com/images/og-city-denver-co.webp')
  midwifeInfo?: {                 // City-specific midwife section text (if absent, generic text is used)
    paragraph: string;            // Full midwife landscape paragraph
    credentialTypes: string;      // e.g. " and RMs" for CO, " and LMs" for WA, "" for generic
    credentialDetail: string;     // e.g. "In Colorado, Registered Midwives (RMs) are specifically licensed..."
  };
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
      { q: "Does Medicaid cover doulas in Amarillo?", a: "Yes! Great news — Medicaid covers doula services in Amarillo. This is thanks to SB 750. That includes Potter/Randall Counties' STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "How much does a doula cost in Amarillo?", a: "Expect to pay $650 to $1,800 for a doula in Amarillo. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Amarillo families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Amarillo birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
      { q: "Are there doulas in Amarillo?", a: "Amarillo has a small but growing doula community. If local availability is limited, virtual support and the free birth plan app can help you prepare. You can also use the True Joy Birthing app to find local doulas — start there and interview a few until one clicks." },
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
    localDoulas: [
      { name: "Abilene Birth & Wellness", credential: "Midwifery Practice", practice: "Abilene Birth & Wellness" },
    ],
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
      { q: "How much does a doula cost in Abilene?", a: "Expect to pay $650 to $1,600 for a doula in Abilene. The local doula community here is smaller than in big metros, so start your search early. Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Abilene?", a: "Yes! Great news — Medicaid covers doula services in Abilene. This is thanks to SB 750. That includes Taylor County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Abilene accommodate birth plans?", a: "Hendrick Medical Center at 1900 Pine Street is Abilene\u2019s only hospital providing labor and delivery as of June 2026, with a verified Level III NICU and dedicated OB Emergency Department stated directly on hendrickhealth.org. Hendrick Medical Center South\u2019s L&D unit closed May 31, 2026, with all maternity services centralized to the north campus. Abilene also has Crowned Birth Place on North 20th Street for you and your family seeking an out-of-hospital birth." },
      { q: "Does True Joy Birthing work with Abilene families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Abilene birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Arlington?", a: "Yes! Great news — Medicaid covers doula services in Arlington. This is thanks to SB 750. That includes Tarrant County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Arlington accommodate birth plans?", a: "Medical City Arlington and Texas Health Arlington Memorial both accommodate birth plans. Medical City has a Level III NICU (stated directly on their website) and maternal-fetal medicine specialists; Texas Health Arlington Memorial holds dual DSHS certifications — Level III Neonatal Intensive Care and Level III Maternal care. Always confirm your hospital's policy during your tour." },
      { q: "Are there birth centers in Arlington?", a: "Yes — Birth & Wellness Center of Arlington (1001 W Randol Mill Rd) offers out-of-hospital birth with midwives, directly across from Texas Health Arlington Memorial. Additional birth centers in Tarrant County include Beautiful Beginnings Birth & Women\u2019s Center and Fort Worth Birthing & Wellness Center in Fort Worth, The Nest Birth Center in Mansfield, and Origins Birth Services in south Fort Worth. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "How much does a doula cost in Arlington?", a: "Expect to pay $850 to $2,500 for a doula in Arlington. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Arlington families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Arlington birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Is Austin a good city for natural birth?", a: "Austin is known for its birth-friendly culture. The city has multiple birth centers and a community of providers who support varied birth preferences. Hospitals like St. David's South Austin accommodate diverse birth plans. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> and start thinking about what kind of birth experience you want — wherever you deliver." },
      { q: "How much does a doula cost in Austin?", a: "Expect to pay $1,000 to $3,000 for a doula in Austin. Prices here reflect the local cost of living, but the level of experienced support available is worth it. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing serve Austin families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Austin birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
      { q: "What are Austin's birth center options?", a: "Austin Area Birthing Center and Natural Beginnings are two well-established options. Both have strong community ties. Always verify their transfer agreements with nearby hospitals. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
    ],
    nearbyCities: ["san-antonio-tx", "san-marcos-tx", "new-braunfels-tx", "houston-tx"],
  },
  "beaumont-tx": {
    city: "Beaumont",
    state: "TX",
    slug: "beaumont-tx",
    heroImage: "/images/beaumont-tx-birth-doula-skyline.webp",
    supportSceneImage: "/images/beaumont-support-scene.webp",
    supportSceneAlt: "Two women walking side by side in Beaumont with East Texas pine trees in the distance",
    costLow: 700,
    costHigh: 1600,
    shelbiServesHere: false,
    heroImage: "/images/beaumont-tx-birth-doula-skyline.webp",
    supportSceneImage: "/images/beaumont-support-scene.webp",
    supportSceneAlt: "Two women walking side by side in Beaumont with East Texas pine trees in the distance",
    publishedDate: "2026-06-10",
    enableBlogResources: true,
    localDoulas: [
      { name: "Birth Center of Beaumont", credential: "Birth Center", practice: "Birth Center of Beaumont" },
    ],
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
      { q: "Does Medicaid cover doulas in Beaumont?", a: "Yes! Great news — Medicaid covers doula services in Beaumont. This is thanks to SB 750. That includes Jefferson County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "How much does a doula cost in Beaumont?", a: "Expect to pay $700 to $1,600 for a doula in Beaumont. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Which Beaumont hospitals are birth-plan friendly?", a: "Baptist Hospitals of Southeast Texas and CHRISTUS Southeast Texas \u2013 St. Elizabeth both offer L&D with verified Level III NICUs. Doulas are generally welcome at both. Always confirm current visitor and support-person policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Beaumont families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Beaumont birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
    ],
    nearbyCities: ["houston-tx"],
  },
  "carrollton-tx": {
    city: "Carrollton",
    state: "TX",
    slug: "carrollton-tx",
    heroImage: "/images/carrollton-tx-birth-doula-skyline.webp",
    supportSceneImage: "/images/carrollton-support-scene.webp",
    supportSceneAlt: "Two women walking together on a neighborhood path in Carrollton, Texas: doula support for DFW families",
    enableBlogResources: true,
    costLow: 900,
    costHigh: 2500,
    shelbiServesHere: true,
    culture: "Carrollton sits at the junction of Dallas, Denton, and Collin counties \u2014 a central location that draws families from multiple directions. The city itself doesn't have a major hospital, so residents typically deliver at nearby facilities in Lewisville, Flower Mound, or Plano. This makes advance planning especially important.",
    heroLocalDetail: "Carrollton families typically deliver at Medical City Lewisville or Texas Health Flower Mound \u2014 both about a 15\u201320 minute drive depending on where you are in the city. The I-35E/President George Bush Turnpike interchange and Belt Line Road are your main arteries, and afternoon traffic around that interchange can easily add 10 minutes you don\u2019t want to be figuring out in labor; the Sam Rayburn Tollway covers the far north end of town if you\u2019re coming from that direction. DART\u2019s Green Line terminates at North Carrollton/Frankford Station, and the A-train connects from Trinity Mills to Lewisville \u2014 helpful if your partner doesn\u2019t drive, but not how you want to get to the hospital in active labor. Sandy Lake Park and McInnish Park on the west side have flat, paved trails that work well for third-trimester walks, and the Greenbelt Trail along the creek running through Carrollton into Plano is another popular go-to. Historic Downtown Carrollton around the DART station is where many young families cluster, and the Koreatown district near Old Denton Road and the Bush Turnpike gives the city a distinct cultural identity.",
    hospitalDetails: [
      { name: "Medical City Lewisville", thumbnail: "/images/carrollton-medical-city-lewisville.webp", paragraph: "Medical City Lewisville, just north of Carrollton in Lewisville, has a Level III NICU (contact the hospital directly for current level verification) and handles a high volume of births for the northern DFW suburbs. Doulas are generally welcome as part of your support team, though visitor policies can shift seasonally. Medical City Lewisville sees a lot of Carrollton families — it's close and well-equipped, but it moves fast, so come with your birth plan ready. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started.", url: "https://medicalcitylewisville.com", address: "500 W Main St, Lewisville, TX 75057" },
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
    localDoulas: [
      { name: "Great Expectations Doulas", credential: "Award-Winning Doula Agency Since 2007", practice: "Great Expectations Doulas", url: "https://www.bestdallasdoulas.com", description: "Dallas's premier doula agency since 2007, serving Carrollton and the entire DFW metroplex. Offering birth doula, postpartum doula, and lactation support with over 200 five-star reviews.", services: ["Birth Doula", "Postpartum", "Lactation Support"], costRange: "$1,500–$2,800", serviceArea: ["Carrollton", "Dallas", "Addison", "Plano", "Frisco"], acceptingClients: true },
      { name: "North Dallas Doula Associates", credential: "Guiding Families Since 1999", practice: "North Dallas Doula Associates", photo: "/images/north-dallas-doula-associates.webp", url: "https://www.northdallasdoulas.com", description: "Over 5,000 births attended since 1999. Birth doula, postpartum doula, lactation support, and placenta encapsulation services serving Carrollton and the DFW area.", services: ["Birth Doula", "Postpartum", "Lactation", "Placenta Encapsulation"], costRange: "$800–$2,500", serviceArea: ["Carrollton", "Dallas", "Lewisville", "Plano"], acceptingClients: true },
      { name: "Cheryl Walker", credential: "Birth Doula & Educator", practice: "Cheryl Walker Birth Doula", photo: "/images/cheryl-walker.webp", url: "https://www.cherylwalkerbirthdoula.com", description: "Professional birth doula and educator serving Carrollton and the Dallas-Fort Worth area. Passionate about supporting families through pregnancy, labor, and postpartum.", services: ["Birth Doula", "Childbirth Education"], costRange: "$900–$1,800", serviceArea: ["Carrollton", "Dallas", "Lewisville", "Flower Mound"], acceptingClients: true },
      { name: "Misty Gigler", credential: "Certified Birth Doula (DONA)", practice: "Misty Gigler, Certified Birth Doula", photo: "/images/misty-gigler.webp", url: "https://mistygiglerbirthdoula.com", description: "DONA-certified birth doula providing evidence-based support for families in Carrollton and the DFW metroplex.", services: ["Birth Doula", "Postpartum"], costRange: "$1,000–$2,000", serviceArea: ["Carrollton", "Dallas", "Plano"], acceptingClients: true },
      { name: "Doulas of Dallas", credential: "Professional Doula Agency", practice: "Doulas of Dallas", photo: "/images/doulas-of-dallas-group.webp", url: "https://www.doulasofdallas.com", description: "Compassionate doula support for families across the DFW area including Carrollton.", services: ["Birth Doula", "Postpartum"], serviceArea: ["Carrollton", "Dallas", "Irving", "Plano"] },
      { name: "Magdala Doula Services", credential: "Birth & Postpartum Doula", practice: "Magdala Doula Services", photo: "/images/magdala-doula-services.webp", url: "https://www.magdaladoulaservices.com", description: "Providing doula support for families in Carrollton and the DFW area.", services: ["Birth Doula", "Postpartum", "Loss Support"], serviceArea: ["Carrollton", "Dallas"] },
      { name: "Barefoot Midwifery", credential: "Cori Lively, LM, CPM", practice: "Barefoot Midwifery", photo: "/images/barefoot-midwifery.webp", url: "https://www.barefootmidwifery.com", description: "Homebirth midwife serving the DFW area since 2003. Licensed midwife and Certified Professional Midwife providing personalized, evidence-based midwifery care for Carrollton families.", isMidwife: true, services: ["Home Birth", "Prenatal Care", "Postpartum Care", "Water Birth"], serviceArea: ["Carrollton", "Dallas", "Fort Worth", "Arlington"] },
      { name: "Serenity Midwifery, PLLC", credential: "Licensed Midwife", practice: "Serenity Midwifery", photo: "/images/serenity-midwifery.webp", url: "https://www.serenitymidwifery.net", description: "Dallas homebirth midwifery practice serving the DFW area with holistic, family-centered care.", isMidwife: true, services: ["Home Birth", "Prenatal Care", "Postpartum Care"], serviceArea: ["Carrollton", "Dallas", "Irving"] },
      { name: "Wise Womb Midwifery", credential: "Midwife", practice: "Wise Womb Midwifery", photo: "/images/wise-womb-midwifery.webp", url: "https://www.wisewombmidwifery.com", description: "Empowering birth journeys with love and wisdom. Serving Carrollton and the DFW area with comprehensive midwifery care.", isMidwife: true, services: ["Home Birth", "Prenatal Care", "Postpartum Care"], serviceArea: ["Carrollton", "Dallas", "Lewisville"] },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Dallas/Denton/Collin Counties' STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Carrollton area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Carrollton?", a: "Yes! Great news — Medicaid covers doula services in Carrollton. This is thanks to SB 750. That includes Dallas/Denton/Collin Counties' STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Carrollton accommodate birth plans?", a: "Medical City Lewisville and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Carrollton?", a: "Expect to pay $900 to $2,500 for a doula in Carrollton. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Carrollton families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Carrollton birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Corpus Christi?", a: "Expect to pay $750 to $2,100 for a doula in Corpus Christi. If you're looking for bilingual support, reach out early — those spots fill fast. The local doula community here is smaller than in big metros, so start your search early. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Corpus Christi?", a: "Yes! Great news — Medicaid covers doula services in Corpus Christi. This is thanks to SB 750. That includes Nueces County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Corpus Christi accommodate birth plans?", a: "Corpus Christi Medical Center – Bay Area has a verified Level III NICU, birthing suites, and maternal-fetal medicine — it's where most you and your family deliver. Driscoll Children's Hospital, adjacent to the medical district, has a verified Level IV NICU and handles the region's most complex neonatal cases. Corpus does not have a freestanding birth center." },
      { q: "Does True Joy Birthing work with Corpus Christi families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Corpus Christi birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
    publishedDate: "2026-06-10",
    lat: 32.7767,
    lng: -96.7970,
    ogImage: "https://truejoybirthing.com/images/og-city-dallas-tx.webp",
    heroImage: "/images/dallas-tx-birth-doula-skyline.webp",
    supportSceneImage: "/images/dallas-support-scene.webp",
    supportSceneAlt: "Two women walking side by side in a Dallas neighborhood with Texas Hill Country in the distance",
    enableBlogResources: true,
    localDoulas: [
      { name: "Urban Family Co-op", credential: "Birth Center", practice: "Dallas Birth Center", url: "https://www.dallasbirthcenter.com", photo: "/images/urban-family-coop.webp", services: ["Birth Center", "Midwifery", "Chiropractic", "Massage"] },
    ],
    culture: "Dallas is the largest city in the DFW metroplex and Dallas County, with a huge and diverse birth community. Families deliver at everything from high-volume academic hospitals to community facilities and a midwife-led birth center in Deep Ellum. SB 750 is making doula support more accessible through Medicaid coverage, and the city\u2019s sheer size means there\u2019s a doula for nearly every birth preference and budget \u2014 but that also means navigating a lot of options.",
    heroLocalDetail: "If you\u2019re delivering at Texas Health Dallas, know that the LBJ Freeway (I-635) stretch near Forest Lane can turn a 15-minute drive into 40 during afternoon rush \u2014 plan your route to the hospital before contractions start. Baylor University Medical Center sits at Gaston and Hall in Deep Ellum, where Greenville Avenue weekend traffic and Deep Ellum event nights can gum up your approach; the easiest route from East Dallas is Gaston Ave straight in. Parkland Memorial Hospital is on Harry Hines near I-35E, and that whole Stemmons Corridor corridor backs up hard during 7\u20139 AM and 4\u20136 PM commutes. Medical City Dallas is off Forest Lane at the intersection of I-635 and Central Expressway \u2014 two of the busiest highways in DFW converging right there. If you\u2019re heading to any of these hospitals during rush, know your back-route before you need it. And when those third-trimester evening walks become non-negotiable, White Rock Lake\u2019s 9-mile loop trail is the go-to \u2014 shaded, flat, plenty of parking at White Rock Lake Park and Winfrey Point, with enough bathrooms along the way that you\u2019re never too far from one. The Katy Trail, running from Highland Park through Oak Lawn up to SMU, is another solid option if you\u2019re closer to the center of town.",
    hospitalDetails: [
      { name: "Texas Health Presbyterian Hospital Dallas", thumbnail: "/images/texas-health-dallas.webp", paragraph: "Texas Health Presbyterian Hospital Dallas (8200 Walnut Hill Lane), the flagship of the Texas Health system in Dallas, is a verified Level I Trauma Center with a high-volume L&amp;D unit and an NICU \u2014 the hospital lists women\u2019s health and infant care as a core specialty on texashealth.org, though the specific NICU level is not stated on their website, so contact the hospital directly for current NICU level verification. Doulas are generally welcome, though visitor policies can shift seasonally, so confirm during your hospital tour. If we\u2019re being real, walking into a big hospital system without your preferences written down makes everything harder \u2014 so bring your birth plan and your doula, and you\u2019ll feel the difference. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Baylor University Medical Center", paragraph: "Baylor University Medical Center (3500 Gaston Ave), part of Baylor Scott &amp; White Health, draws families from across Dallas for its high-risk and maternal-fetal medicine programs. Their structured data lists a Neonatal Intensive Care Unit (NICU) and labor and delivery among their specialties, though the specific NICU level is not stated on their website \u2014 contact the hospital directly for current NICU level verification. If you\u2019re planning a VBAC or managing a high-risk pregnancy here, a doula can be the steady presence who helps you ask the right questions and hold steady in the room." },
      { name: "Parkland Memorial Hospital", thumbnail: "/images/parkland-memorial.webp", paragraph: "Parkland Memorial Hospital (5200 Harry Hines Blvd), Dallas County\u2019s public hospital and a verified Level I Trauma Center, handles one of the largest volumes of births in the entire state and cares for many Medicaid-covered families. Parkland\u2019s neonatology is staffed by UT Southwestern faculty, and they have an NICU on site, though the specific NICU level is not stated on their website \u2014 contact the hospital directly for current NICU level verification. The team there is increasingly familiar with doulas and birth plans, but policies can shift, so it helps to come in with your preferences written down. Honestly, it\u2019s a lot to walk into a place that busy without a plan in your hands \u2014 so write one before you go." },
      { name: "Medical City Dallas", paragraph: "Medical City Dallas (7777 Forest Ln), an 899-bed HCA Healthcare hospital, lists NICU, maternal-fetal care, high-risk pregnancy, and labor and delivery among its specialties in their structured data, though the specific NICU level is not stated on their website \u2014 contact the hospital directly for current NICU level verification. Medical City Dallas is one of the largest hospitals in the DFW metroplex and handles a high volume of births. If you\u2019re delivering here, come with your birth plan ready \u2014 the team is experienced but busy, and having your preferences in writing keeps your voice in the room." },
      { name: "Methodist Dallas Medical Center", thumbnail: "/images/methodist-dallas.webp", paragraph: "Methodist Dallas Medical Center (1416 N Beckley Ave), part of the Methodist Health System, provides L&amp;D services and maternity care for southern and central Dallas families. The hospital offers maternal care, though the specific NICU level is not stated on their website \u2014 contact the hospital directly for current NICU level verification. Methodist Dallas serves a diverse community, and their maternity team sees a wide range of birth plans. Bring yours with you to keep your preferences clear." },
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
      { q: "Does Medicaid cover doulas in Dallas?", a: "Yes! Great news — Medicaid covers doula services in Dallas. This is thanks to SB 750. That includes Dallas County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which Dallas hospitals are birth-plan friendly?", a: "Texas Health Presbyterian Hospital Dallas, Baylor University Medical Center, Parkland Memorial Hospital, Medical City Dallas, and Methodist Dallas Medical Center all provide L&D services and generally accommodate birth plans, though policies vary by facility. Texas Health Dallas and Baylor see well-informed moms with clear preferences regularly. Call the hospital or take a tour and bring your birth plan — it makes the whole intake process smoother when you know what you want. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "How much does a doula cost in Dallas?", a: "Expect to pay $900 to $2,800 for a doula in Dallas. If you're looking for bilingual support, reach out early — those spots fill fast. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Dallas families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Dallas birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Denton?", a: "Yes! Great news — Medicaid covers doula services in Denton. This is thanks to SB 750. That includes Denton County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Denton accommodate birth plans?", a: "Texas Health Denton is the only hospital in Denton with labor and delivery services — it has the only Level III NICU in the city (verified on texashealth.org) and generally accommodates birth plans. Medical City Denton does not offer L&D; their website directs you and your family to Medical City Lewisville or Frisco for maternity care. Always confirm your hospital's current policy during your tour." },
      { q: "How much does a doula cost in Denton?", a: "Expect to pay $850 to $2,300 for a doula in Denton. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Denton families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Denton birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in El Paso?", a: "Yes! Great news — Medicaid covers doula services in El Paso. This is thanks to SB 750. That includes El Paso County\u2019s STAR and CHIP plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "How much does a doula cost in El Paso?", a: "Expect to pay $800 to $2,200 for a doula in El Paso. If you're looking for bilingual support, reach out early — those spots fill fast. Military? Ask about military discounts — several local doulas offer them. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Which El Paso hospitals accommodate birth plans?", a: "University Medical Center (Level IV Maternal Care, Baby-Friendly), Las Palmas Medical Center, Del Sol Medical Center, and The Hospitals of Providence all offer labor and delivery. UMC is the region\u2019s only Level IV Maternal Care facility. Always confirm visitor and support-person policies during your hospital tour \u2014 they can change. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with El Paso families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any El Paso birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Fort Worth?", a: "Yes! Great news — Medicaid covers doula services in Fort Worth. This is thanks to SB 750. That includes Tarrant County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which Fort Worth hospitals are birth-plan friendly?", a: "Many Fort Worth-area hospitals accommodate birth plans, but policies vary by facility. Texas Health Harris Methodist and Cook Children's Medical Center both see well-informed moms with clear preferences. Call the hospital or take a tour and bring your birth plan — it makes the whole intake process smoother when you know what you want. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "How much does a doula cost in Fort Worth?", a: "Expect to pay $850 to $2,600 for a doula in Fort Worth. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Fort Worth families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Fort Worth birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Frisco?", a: "Yes! Great news — Medicaid covers doula services in Frisco. This is thanks to SB 750. That includes Collin/Denton Counties' STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Frisco accommodate birth plans?", a: "Baylor Scott & White Frisco and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Frisco?", a: "Expect to pay $950 to $2,700 for a doula in Frisco. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Frisco families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Frisco birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Garland?", a: "Yes! Great news — Medicaid covers doula services in Garland. This is thanks to SB 750. That includes Dallas County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Garland accommodate birth plans?", a: "Baylor Scott & White Garland and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Garland?", a: "Expect to pay $800 to $2,400 for a doula in Garland. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Garland families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Garland birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Grand Prairie?", a: "Yes! Great news — Medicaid covers doula services in Grand Prairie. This is thanks to SB 750. That includes Dallas/Tarrant Counties' STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Grand Prairie accommodate birth plans?", a: "Baylor Scott & White Grand Prairie and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Grand Prairie?", a: "Expect to pay $850 to $2,500 for a doula in Grand Prairie. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Grand Prairie families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Grand Prairie birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Houston?", a: "Expect to pay $800 to $2,600 for a doula in Houston. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Texas Medicaid cover doulas in Houston?", a: "Yes! Great news — Medicaid covers doula services in Houston. This is thanks to SB 750. That includes Harris County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "What are good birth centers in Houston?", a: "Houston has several birth center options, including Nativity Birth Center and Birth Center at St. Luke's. Always tour your chosen facility and understand their transfer protocols. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does True Joy Birthing provide in-person doula services in Houston?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Houston birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Irving?", a: "Yes! Great news — Medicaid covers doula services in Irving. This is thanks to SB 750. That includes Dallas County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Irving accommodate birth plans?", a: "Baylor Scott & White Irving (Level III NICU, contact the hospital directly for current level verification) and Medical City Las Colinas (Level II NICU, stated directly on medicalcityhealthcare.com) both accommodate birth plans. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Irving?", a: "Expect to pay $900 to $2,600 for a doula in Irving. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Irving families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Irving birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Laredo?", a: "Expect to pay $700 to $1,900 for a doula in Laredo. If you're looking for bilingual support, reach out early — those spots fill fast. The local doula community here is smaller than in big metros, so start your search early. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Laredo?", a: "Yes! Great news — Medicaid covers doula services in Laredo. This is thanks to SB 750. That includes Webb County\u2019s STAR and STAR+PLUS managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Laredo accommodate birth plans?", a: "Laredo has two hospitals with L&D services: Doctors Hospital of Laredo, with a verified Level III NICU and 24-hour maternal-fetal medicine specialists, and Laredo Medical Center, which offers maternity care with an NICU (contact directly for current level verification). Laredo does not have a freestanding birth center. Both hospitals offer bilingual staff and Spanish-language materials." },
      { q: "Are there bilingual doulas in Laredo?", a: "Yes! Laredo has bilingual doulas — and if you're more comfortable in another language, that support is out there. Ask when you interview: \"Do you offer support in my language?\" is a great question to start with." },
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
      { q: "How much does a doula cost in Lubbock?", a: "Expect to pay $700 to $2,000 for a doula in Lubbock. Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Lubbock?", a: "Yes! Great news — Medicaid covers doula services in Lubbock. This is thanks to SB 750. That includes Lubbock County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Lubbock accommodate birth plans?", a: "Covenant Medical Center is the region's largest hospital with a NICU and high-volume L&D unit — contact Covenant directly for current NICU level verification. UMC Lubbock is the region's only Level I Trauma Center and children's hospital, with maternity care and an in-house doula program for Medicaid moms. Lubbock does not currently have a freestanding birth center." },
      { q: "Are there birth centers in Lubbock?", a: "Not yet — but that doesn't mean you're stuck. There aren't any freestanding birth centers in Lubbock right now, but you can still have a doula by your side in the hospital — that support makes a huge difference no matter where you deliver. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> and think through what matters most to you — you have more choices than you might think." },
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
      { q: "How much does a doula cost in Longview?", a: "Expect to pay $700 to $1,600 for a doula in Longview. The local doula community here is smaller than in big metros, so start your search early. Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Longview?", a: "Yes! Great news — Medicaid covers doula services in Longview. This is thanks to SB 750. That includes Gregg County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Longview accommodate birth plans?", a: "CHRISTUS Good Shepherd Medical Center on East Marshall Avenue is Longview\u2019s primary hospital for labor and delivery, with a NICU and 24/7 obstetric care. Contact the hospital directly for current NICU level and maternity service details. Longview does not have a freestanding birth center. For you and your family who need a higher level of neonatal or maternal specialty care, Tyler \u2014 about 35 miles east \u2014 has two hospitals with verified Level III NICUs and a freestanding birth center." },
      { q: "Does True Joy Birthing work with Longview families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Longview birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
    heroImage: "/images/mckinney-tx-birth-doula-skyline.webp",
    supportSceneImage: "/images/mckinney-support-scene.webp",
    supportSceneAlt: "Two women walking side by side in a McKinney neighborhood with Texas Hill Country in the distance",
    enableBlogResources: true,
    localDoulas: [
      { name: "North Texas Birth Collective", credential: "Birth Collective", practice: "North Texas Birth Collective" },
    ],
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
      { q: "Does Medicaid cover doulas in McKinney?", a: "Yes! Great news — Medicaid covers doula services in McKinney. This is thanks to SB 750. That includes Collin County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in McKinney accommodate birth plans?", a: "Baylor Scott & White McKinney and other area facilities generally accommodate birth plans, but policies vary. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in McKinney?", a: "Expect to pay $950 to $2,700 for a doula in McKinney. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with McKinney families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any McKinney birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Odessa?", a: "Yes! Great news — Medicaid covers doula services in Odessa. This is thanks to SB 750. That includes Ector County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "How much does a doula cost in Odessa?", a: "Expect to pay $700 to $1,600 for a doula in Odessa. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Which Odessa hospitals are birth-plan friendly?", a: "Odessa Regional Medical Center is the only hospital in Odessa with labor and delivery services and the only Level III NICU (contact the hospital directly for current level verification) in the Permian Basin. Doulas are generally welcome at ORMC. Always confirm current visitor and support-person policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Odessa families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Odessa birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Mesquite?", a: "Yes! Great news — Medicaid covers doula services in Mesquite. This is thanks to SB 750. That includes Dallas County's STAR managed care plans (Community First Health Plans and AmeriGroup serve most eastern Dallas County families). Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Mesquite accommodate birth plans?", a: "Baylor Scott & White Sunnyvale (Level III NICU, contact the hospital directly for current level verification) and Texas Health Rockwall (Level I NICU — basic neonatal care) both serve Mesquite-area you and your family. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Mesquite?", a: "Expect to pay $800 to $2,300 for a doula in Mesquite. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Mesquite families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Mesquite birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Plano?", a: "Yes! Great news — Medicaid covers doula services in Plano. This is thanks to SB 750. That includes Collin County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Plano accommodate birth plans?", a: "Texas Health Plano (Level IV NICU, stated directly on texashealth.org) and Medical City Plano (Level IV NICU, stated directly on medicalcityhealthcare.com) both accommodate birth plans. Always confirm your hospital's policy during your hospital tour." },
      { q: "How much does a doula cost in Plano?", a: "Expect to pay $1,000 to $2,800 for a doula in Plano. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Plano families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Plano birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in San Antonio?", a: "Expect to pay $700 to $2,200 for a doula in San Antonio. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in San Antonio?", a: "Yes! Great news — Medicaid covers doula services in San Antonio. This is thanks to SB 750. That includes Bexar County's STAR managed care plans (Superior HealthPlan, Community First Health Plans, and others). Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Are there birth centers in San Antonio?", a: "Yes \u2014 San Antonio has several freestanding birth centers including Birth Center Stone Oak (Stone Oak area), Community Birth Group (East Side), and Central Texas Birth Center (central SA). Bexar County also has nearby options in Fort Worth and Mansfield. Most you deliver at one of the major hospitals (Methodist, University, Baptist, Children\u2019s Hospital of SA), but out-of-hospital birth is growing here. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does True Joy Birthing work with San Antonio families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any San Antonio birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Waco?", a: "Expect to pay $800 to $1,500 for a doula in Waco. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Waco?", a: "Yes! Great news — Medicaid covers doula services in Waco. This is thanks to SB 750. That includes McLennan County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Waco accommodate birth plans?", a: "Waco has two hospitals with L&D: Baylor Scott & White \u2013 Hillcrest (30-bed Level III NICU; contact the hospital directly for current level verification, dedicated Women\u2019s & Children\u2019s Center) and Ascension Providence (Level II NICU, smaller unit with more one-on-one nursing time). Waco also has a freestanding birth center \u2014 Waco Birth Center and Clinic on Austin Avenue \u2014 for you and your family planning an out-of-hospital birth." },
      { q: "Does True Joy Birthing work with Waco families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Waco birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
    ],
    nearbyCities: ["temple-tx", "austin-tx", "dallas-tx", "fort-worth-tx"],
  },
  "midland-tx": {
    city: "Midland",
    state: "TX",
    slug: "midland-tx",
    heroImage: "/images/midland-tx-birth-doula-skyline.webp",
    supportSceneImage: "/images/midland-support-scene.webp",
    supportSceneAlt: "Two women walking side by side in Midland with West Texas plains in the distance",
    publishedDate: "2026-06-10",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: false,
    enableBlogResources: true,
    localDoulas: [
      { name: "The Birth Center of Midland", credential: "Birth Center", practice: "The Birth Center of Midland" },
    ],
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
      { q: "How much does a doula cost in Midland?", a: "Expect to pay $800 to $2,000 for a doula in Midland. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Midland?", a: "Yes! Great news — Medicaid covers doula services in Midland. This is thanks to SB 750. That includes Midland County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Midland accommodate birth plans?", a: "Midland Memorial Hospital has a full L&D program with a Level II NICU, and Odessa Regional Medical Center (about 20 minutes away) offers a Level III NICU (contact the hospital directly for current level verification) and the region\u2019s most established maternity program. Midland also has The Birth Center of Midland for you and your family planning an out-of-hospital birth." },
      { q: "Does True Joy Birthing work with Midland families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Midland birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in McAllen?", a: "Expect to pay $600 to $1,400 for a doula in McAllen. The local doula community here is smaller than in big metros, so start your search early. Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in McAllen?", a: "Yes! Great news — Medicaid covers doula services in McAllen. This is thanks to SB 750. That includes Hidalgo County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in McAllen accommodate birth plans?", a: "South Texas Health System McAllen has a verified Level III NICU \u2014 the first in the Rio Grande Valley \u2014 and a dedicated Maternity Center with neonatologist-led care and 35+ years of delivering babies. STHS Edinburg, about 8 miles east in the same system, also has a Maternity Center with a midwifery program, but transfers neonatal cases to STHS McAllen. DHR Health Women\u2019s Hospital in Edinburg, about 10 miles east, is a designated Level IV Maternal Facility that handles the most complex pregnancies in the RGV \u2014 contact DHR directly for current NICU level details. The RGV does not currently have a freestanding birth center, so hospital birth is the primary option for McAllen you and your family." },
      { q: "Does True Joy Birthing work with McAllen families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any McAllen birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in College Station?", a: "Expect to pay $800 to $1,500 for a doula in College Station. The local doula community here is smaller than in big metros, so start your search early. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in College Station?", a: "Yes! Great news — Medicaid covers doula services in College Station. This is thanks to SB 750. That includes Brazos County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in College Station accommodate birth plans?", a: "Baylor Scott & White Medical Center \u2013 College Station has a verified Level III NICU and dedicated L&D unit \u2014 stated directly on their website. College Station does not have a freestanding birth center. For higher-acuity maternal or neonatal needs, Baylor Scott & White in Temple (about 35 minutes north) is the system\u2019s flagship with the most comprehensive specialty care in the region." },
      { q: "Does True Joy Birthing work with College Station families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any College Station birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
    ],
    nearbyCities: ["waco-tx", "austin-tx", "houston-tx"],
  },
  "tyler-tx": {
    city: "Tyler",
    state: "TX",
    slug: "tyler-tx",
    heroImage: "/images/tyler-tx-birth-doula-skyline.webp",
    supportSceneImage: "/images/tyler-support-scene.webp",
    supportSceneAlt: "Two women walking side by side in a Tyler neighborhood with East Texas pine trees in the distance",
    publishedDate: "2026-06-10",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: false,
    enableBlogResources: true,
    localDoulas: [
      { name: "Azalea Birth Center", credential: "Birth Center", practice: "Azalea Birth Center" },
    ],
    culture: "Tyler is the largest city in Northeast Texas and the seat of Smith County, known as the Rose Capital of America for its rose industry and the annual Texas Rose Festival. The regional healthcare hub for East Texas, Tyler draws families from across the region for hospital births \u2014 and the birth community, while smaller than in the big metros, is steady and growing.",
    heroLocalDetail: "CHRISTUS Mother Frances sits off South Broadway in central Tyler, and UT Health Tyler is on the south side near Beckham Avenue. South Broadway between the hospitals can back up during afternoon rush and on Texas Rose Festival weekends in October \u2014 if you\u2019re due in the fall, know your fastest route before contractions start.",
    hospitalDetails: [
      { name: "CHRISTUS Mother Frances Hospital \u2013 Tyler", thumbnail: "/images/christus-mother-frances-tyler.webp", paragraph: "CHRISTUS Mother Frances Hospital \u2013 Tyler, on South Broadway in central Tyler, is the region\u2019s most established maternity hospital with a verified Level III NICU (the Lucy & John Carr NICU) and Level III Maternal designation. If you\u2019re delivering here, having a birth plan ready makes the intake conversation smoother \u2014 especially when you\u2019re already in labor and don\u2019t want to be explaining everything from scratch. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something simple and specific to work from." },
            { name: "UT Health Tyler", thumbnail: "/images/ut-health-tyler.webp", paragraph: "UT Health Tyler, on the south side of town, is the flagship hospital of the UT Health East Texas system with a Level III NICU designation (earned 2024; contact the hospital directly for current level verification) and labor and delivery services. If we\u2019re being real, Tyler families have two solid hospital options with Level III NICUs \u2014 which is more than most East Texas towns can say \u2014 but both can be busy, so having your preferences written down and a support advocate at your side makes the whole experience feel more manageable." },
    ],
    birthCenterDetails: [
      { name: "Azalea Birth Center", paragraph: "Azalea Birth Center, on South Broadway in central Tyler, is a freestanding birth center run by midwife Vicky Wells, offering water birth and midwife-attended out-of-hospital birth in a home-like setting. If you\u2019re considering birth center care, call ahead to confirm current availability and schedule a tour \u2014 the birth community in Tyler is growing but small, so spots can fill." },
    ],
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Smith County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Tyler area. Some private insurers offer maternal wellness benefits that include doula support \u2014 contact your provider directly, and check whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Tyler?", a: "Expect to pay $800 to $2,000 for a doula in Tyler. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Tyler?", a: "Yes! Great news — Medicaid covers doula services in Tyler. This is thanks to SB 750. That includes Smith County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Tyler accommodate birth plans?", a: "CHRISTUS Mother Frances Hospital \u2013 Tyler has a verified Level III NICU (the Lucy & John Carr NICU) and Level III Maternal designation, and UT Health Tyler earned its own Level III NICU designation in 2024 (contact the hospital directly for current level verification). Tyler also has a freestanding birth center \u2014 Azalea Birth Center on South Broadway, run by midwife Vicky Wells \u2014 for you and your family seeking out-of-hospital birth. That\u2019s two Level III hospitals and a birth center, which is more than most East Texas towns can offer." },
      { q: "Does True Joy Birthing work with Tyler families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Tyler birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
    localDoulas: [
      { name: "Dulce Birth & Wellness Center", credential: "Birth Center", practice: "Dulce Birth & Wellness Center" },
    ],
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
      { q: "How much does a doula cost in Killeen?", a: "Expect to pay $700 to $1,800 for a doula in Killeen. Military? Ask about military discounts — several local doulas offer them. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Killeen?", a: "Yes! Great news — Medicaid covers doula services in Killeen. This is thanks to SB 750. That includes Bell County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Killeen accommodate birth plans?", a: "AdventHealth Central Texas is Killeen\u2019s only hospital with L&D. Baylor Scott & White Medical Center in Temple, about 20 minutes north, also serves Killeen-area you and your family \u2014 contact the hospital directly to ask about their current maternity services and NICU availability." },
      { q: "Does True Joy Birthing work with Killeen families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Killeen birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Brownsville?", a: "Expect to pay $600 to $1,400 for a doula in Brownsville. If you're looking for bilingual support, reach out early — those spots fill fast. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. Many doulas offer payment plans, so don't let the sticker price scare you off. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Brownsville?", a: "Yes! Great news — Medicaid covers doula services in Brownsville. This is thanks to SB 750. That includes Cameron County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which Brownsville hospitals have labor and delivery?", a: "Brownsville has two hospitals with labor and delivery: Valley Regional Medical Center on Alton Gloor Blvd (verified Level III NICU) and Valley Baptist Medical Center \u2013 Brownsville (Labor and Delivery Excellence Award from Healthgrades). Some Brownsville moms and families also travel to Harlingen or McAllen for additional hospital options. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work for Brownsville families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Brownsville birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Edinburg?", a: "Expect to pay $600 to $1,400 for a doula in Edinburg. The local doula community here is smaller than in big metros, so start your search early. Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. Many doulas offer payment plans, so don't let the sticker price scare you off. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Edinburg?", a: "Yes! Great news — Medicaid covers doula services in Edinburg. This is thanks to SB 750. That includes Hidalgo County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Edinburg offer labor and delivery?", a: "DHR Health Women\u2019s Hospital, on McColl Road in Edinburg, is the primary L&D hospital and the only Level IV Maternal Facility in the Rio Grande Valley. South Texas Health System\u2019s maternity services operate out of STHS McAllen, just a few miles south on Expressway 83, with a verified Level III NICU. Both systems serve Edinburg you and your family." },
      { q: "Does True Joy Birthing work for Edinburg families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Edinburg birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Harlingen?", a: "Expect to pay $600 to $1,400 for a doula in Harlingen. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Harlingen?", a: "Yes! Great news — Medicaid covers doula services in Harlingen. This is thanks to SB 750. That includes Cameron County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Harlingen have labor and delivery?", a: "Valley Baptist Medical Center \u2013 Harlingen is the city\u2019s primary hospital for labor and delivery, with a NICU, private LDR suites, and the only Level II Trauma Center in the Rio Grande Valley. Harlingen Medical Center discontinued its labor and delivery services in January 2025. Some Harlingen moms and families also travel to McAllen or Brownsville for additional hospital options. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work for Harlingen families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Harlingen birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
    heroImage: "/images/round-rock-tx-birth-doula-skyline.webp",
    supportSceneImage: "/images/round-rock-support-scene.webp",
    supportSceneAlt: "Two women walking side by side in a Round Rock neighborhood with Texas Hill Country in the distance",
    enableBlogResources: true,
    culture: "Round Rock sits in fast-growing Williamson County",
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
      { q: "How much does a doula cost in Round Rock?", a: "Expect to pay $900 to $2,200 for a doula in Round Rock. Military? Ask about military discounts — several local doulas offer them. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Round Rock?", a: "Yes! Great news — Medicaid covers doula services in Round Rock. This is thanks to SB 750. That includes Williamson County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Round Rock have labor and delivery?", a: "St. David\u2019s Round Rock Medical Center at 2400 Round Rock Ave is the primary hospital for labor and delivery in Round Rock, with a verified Level II NICU and a full women\u2019s health program. Some Round Rock moms and families also deliver at St. David\u2019s South Austin or St. David\u2019s North Austin Medical Center for additional options. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Round Rock families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Round Rock birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
    ],
    localDoulas: [
      { name: "Circle Birth", credential: "Birth Doula", practice: "Circle Birth" },
      { name: "Doula Empowered Birth", credential: "Birth Doula", practice: "Doula Empowered Birth" },
      { name: "Lacey Dowlearn", credential: "Birth Doula", practice: "Supporting Arms" },
      { name: "Matriarch Doula Care", credential: "Birth Doula", practice: "Matriarch Doula Care" },
      { name: "The Natural Birthing Center", credential: "Birth Center", practice: "The Natural Birthing Center" },
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
      { q: "How much does a doula cost in Richardson?", a: "Expect to pay $900 to $2,400 for a doula in Richardson. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Richardson?", a: "Yes! Great news — Medicaid covers doula services in Richardson. This is thanks to SB 750. That includes Dallas County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Richardson have labor and delivery?", a: "Methodist Richardson Medical Center at 2831 E. President George Bush Turnpike is Richardson\u2019s primary hospital for labor and delivery, with a verified Level III NICU and dedicated Women\u2019s Pavilion. Some Richardson moms and families also deliver at Medical City Dallas or Baylor Scott & White in Plano for additional options. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Richardson families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Richardson birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
    localDoulas: [
      { name: "Shelbie Cunningham", credential: "Birth Doula", practice: "Shelbie Cunningham Doula Services" },
    ],
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
      { q: "How much does a doula cost in Conroe?", a: "Expect to pay $800 to $2,000 for a doula in Conroe. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Conroe?", a: "Yes! Great news — Medicaid covers doula services in Conroe. This is thanks to SB 750. That includes Montgomery County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Conroe have labor and delivery?", a: "HCA Houston Healthcare Conroe, at 504 Medical Drive, is the only hospital with labor and delivery in Montgomery County. Contact the hospital directly for current NICU level verification. Journey Birth Center at 1202 N San Jacinto St offers midwife-led out-of-hospital birth for low-risk pregnancies. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work for Conroe families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Conroe birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Sugar Land?", a: "Expect to pay $900 to $2,500 for a doula in Sugar Land. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Sugar Land?", a: "Yes! Great news — Medicaid covers doula services in Sugar Land. This is thanks to SB 750. That includes Fort Bend County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Sugar Land have labor and delivery?", a: "Sugar Land has two hospitals with labor and delivery: Memorial Hermann Sugar Land (verified Level II NICU on memorialhermann.org, expanding to Level III by 2027) and Houston Methodist Sugar Land (verified Level III NICU on houstonmethodist.org, operated with Texas Children\u2019s Hospital). For VBAC or high-risk pregnancies, Houston Methodist is the stronger option. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work for Sugar Land families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Sugar Land birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Pharr?", a: "Expect to pay $600 to $1,400 for a doula in Pharr. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Pharr?", a: "Yes! Great news — Medicaid covers doula services in Pharr. This is thanks to SB 750. That includes Hidalgo County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals near Pharr have labor and delivery?", a: "Pharr doesn\u2019t have a hospital with labor and delivery within city limits. The nearest options are STHS McAllen (5 minutes west on Expressway 83, verified Level III NICU) and DHR Health Women\u2019s Hospital in Edinburg (10 minutes east, Level IV Maternal Facility). Both are a short drive from anywhere in Pharr. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work for Pharr families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Pharr birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Mission?", a: "Expect to pay $600 to $1,400 for a doula in Mission. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Mission?", a: "Yes! Great news — Medicaid covers doula services in Mission. This is thanks to SB 750. That includes Hidalgo County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals near Mission have labor and delivery?", a: "Mission doesn\u2019t have a hospital with labor and delivery within city limits. The nearest options are STHS McAllen (10 minutes west on Expressway 83, verified Level III NICU) and DHR Health Women\u2019s Hospital in Edinburg (8 minutes northeast, Level IV Maternal Facility). Both are a short drive from anywhere in Mission. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work for Mission families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Mission birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Temple?", a: "Expect to pay $800 to $2,200 for a doula in Temple. The local doula community here is smaller than in big metros, so start your search early. Military? Ask about military discounts — several local doulas offer them. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Temple?", a: "Yes! Great news — Medicaid covers doula services in Temple. This is thanks to SB 750. That includes Bell County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which Temple hospitals accommodate birth plans?", a: "Baylor Scott & White Medical Center – Temple is the region's largest hospital with an advanced NICU and high-volume L&D unit. AdventHealth Central Texas in Belton offers maternity care in a smaller setting. Temple does not have a freestanding birth center. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Temple families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Temple birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in New Braunfels?", a: "Expect to pay $850 to $2,300 for a doula in New Braunfels. Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in New Braunfels?", a: "Yes! Great news — Medicaid covers doula services in New Braunfels. This is thanks to SB 750. That includes Comal County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Does New Braunfels have a birth center?", a: "Not yet — but that doesn't mean you're stuck. There aren't any freestanding birth centers in New Braunfels right now, but you can still have a doula by your side in the hospital — that support makes a huge difference no matter where you deliver. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> and think through what matters most to you — you have more choices than you might think." },
      { q: "Does True Joy Birthing work with New Braunfels families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any New Braunfels birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in San Marcos?", a: "Expect to pay $800 to $2,100 for a doula in San Marcos. The local doula community here is smaller than in big metros, so start your search early. Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in San Marcos?", a: "Yes! Great news — Medicaid covers doula services in San Marcos. This is thanks to SB 750. That includes Hays County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Where do San Marcos families deliver?", a: "Most San Marcos moms and families deliver at Ascension Seton Hays in Kyle (about 15 minutes north on I-35) or Resolute Health in New Braunfels (about 25 minutes south). CHRISTUS Santa Rosa – San Marcos offers maternity care with basic newborn support, but moms and families with higher-risk pregnancies often choose Seton Hays or Austin hospitals for their NICU capabilities. San Marcos does not have a freestanding birth center. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with San Marcos families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any San Marcos birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Pearland?", a: "Expect to pay $900 to $2,500 for a doula in Pearland. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Pearland?", a: "Yes! Great news — Medicaid covers doula services in Pearland. This is thanks to SB 750. That includes Brazoria County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Pearland have labor and delivery?", a: "HCA Houston Healthcare Pearland at 11100 Shadow Creek Pkwy is the only hospital in Pearland with labor and delivery services. Contact the hospital directly for current NICU level verification. Pearland does not have a freestanding birth center; the nearest is Bay Area Community Birth Center in Houston, about 15 minutes north. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Pearland families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Pearland birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Cedar Park?", a: "Expect to pay $900 to $2,500 for a doula in Cedar Park. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Cedar Park?", a: "Yes! Great news — Medicaid covers doula services in Cedar Park. This is thanks to SB 750. That includes Williamson County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Where do Cedar Park families deliver?", a: "Cedar Park does not have a hospital with labor and delivery. The nearest options are St. David\u2019s Round Rock Medical Center (~10 miles, verified Level II NICU) and St. David\u2019s Medical Center Austin (~12 miles, Level III NICU \u2014 contact the hospital directly for current level verification). The nearest birth center is Austin Area Birthing Center, about 8 miles south. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Cedar Park families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Cedar Park birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Victoria?", a: "Expect to pay $700 to $1,500 for a doula in Victoria. The local doula community here is smaller than in big metros, so start your search early. Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Victoria?", a: "Yes! Great news — Medicaid covers doula services in Victoria. This is thanks to SB 750. That includes Victoria County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Victoria have labor and delivery?", a: "Citizens Medical Center has a verified Level II NICU and a maternity unit branded as the \u201CCitizens Birth Center.\u201D DeTar Healthcare System also provides delivery services across two campuses (Navarro and North), though contact them directly for current NICU level verification. Victoria does not have a freestanding birth center. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Victoria families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Victoria birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Georgetown?", a: "Expect to pay $900 to $2,500 for a doula in Georgetown. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Georgetown?", a: "Yes! Great news — Medicaid covers doula services in Georgetown. This is thanks to SB 750. That includes Williamson County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Georgetown have labor and delivery?", a: "St. David\u2019s Georgetown Hospital at 2000 Scenic Dr offers maternity and newborn services. For NICU care, moms and families are typically referred to St. David\u2019s Round Rock (10 minutes south, Level II NICU) or St. David\u2019s Medical Center in Austin (20 minutes, Level III NICU \u2014 contact the hospital directly for current level verification). Genesis Birth Centers at 101 W Cooperative Way offers midwife-led out-of-hospital birth. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Georgetown?", a: "Yes \u2014 Genesis Birth Centers at 101 W Cooperative Way is an NPI-verified freestanding birth center in downtown Georgetown. Their CNM-led team serves low-risk you who want an out-of-hospital birth option. Additional birth centers in the Austin metro are 25\u201340 minutes south. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does True Joy Birthing work for Georgetown families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Georgetown birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Spring/The Woodlands?", a: "Expect to pay $1,000 to $2,800 for a doula in Spring. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Spring/The Woodlands?", a: "Yes! Great news — Medicaid covers doula services in Spring. This is thanks to SB 750. That includes Montgomery County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Spring/The Woodlands have labor and delivery?", a: "Houston Methodist The Woodlands Hospital at 17183 I-45 South has a Childbirth Center with 24/7 obstetric hospitalists (NICU level should be verified directly with the hospital). CHI St. Luke\u2019s Health \u2014 The Woodlands at 17200 St. Luke\u2019s Way has historically offered maternity services \u2014 verify current L&D status directly. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers near Spring/The Woodlands?", a: "Nativiti Family Birth Center at 26614 Oak Ridge Dr in The Woodlands (NPI 1245638287) is a CNM-staffed freestanding birth center. Journey Birth Center at 903 E Main St in Humble, about 15 minutes away, offers VBAC and waterbirth options. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does True Joy Birthing work with Spring/The Woodlands families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Spring birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Galveston?", a: "Expect to pay $700 to $1,800 for a doula in Galveston. The local doula community here is smaller than in big metros, so start your search early. Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Galveston?", a: "Yes! Great news — Medicaid covers doula services in Galveston. This is thanks to SB 750. That includes Galveston County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Galveston have labor and delivery?", a: "UTMB Health \u2014 Jennie Sealy Hospital at 301 University Blvd is Galveston\u2019s primary maternity hospital, with a verified Level III NICU (Texas DSHS designated) and 24/7 obstetric and neonatal coverage. It\u2019s the only hospital on the island providing labor and delivery services. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Galveston?", a: "Not yet — but that doesn't mean you're stuck. The nearest birth center options are Bay Area Birth Center in the Webster/Clear Lake area, about 30 minutes north on I-45. UTMB Health does offer midwifery services within the hospital setting. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> and think through what matters most to you — you have more choices than you might think." },
      { q: "What should Galveston families know about hurricane-season birth planning?", a: "Galveston\u2019s hurricane season (June\u2013November) overlaps with much of the birthing year. If you\u2019re due during storm season, have an evacuation birth plan ready, know your route off the island, and discuss early delivery contingency with your OB. UTMB has storm protocols, but bridge closures can change your options fast. Pack your hospital bag by 35 weeks and have a backup route to the hospital — storm season is not the time to wing it." },
      { q: "Does True Joy Birthing work with Galveston families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Galveston birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Lewisville?", a: "Expect to pay $900 to $2,200 for a doula in Lewisville. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Lewisville?", a: "Yes! Great news — Medicaid covers doula services in Lewisville. This is thanks to SB 750. That includes Denton County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Lewisville have labor and delivery?", a: "Medical City Lewisville at 500 W Main St has a verified Level III NICU, Level II Maternal Care, and 24/7 obstetric hospitalists \u2014 confirmed on medicalcityhealthcare.com. It\u2019s the primary maternity hospital for the Lewisville area. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers near Lewisville?", a: "Flourish Birth & Wellness Center in Flower Mound (NPI 1447895271) is about 5 miles from Lewisville \u2014 an NPI-verified freestanding birth center with midwife-led births. All About Babies Argyle Birth Center in Argyle (NPI 1093349821) is about 8 miles away and also NPI-verified. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does True Joy Birthing work with Lewisville families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Lewisville birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Pasadena?", a: "Expect to pay $750 to $1,800 for a doula in Pasadena. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Pasadena?", a: "Yes! Great news — Medicaid covers doula services in Pasadena. This is thanks to SB 750. That includes Harris County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Pasadena have labor and delivery?", a: "HCA Houston Healthcare Southeast at 4000 Spencer Hwy has labor and delivery with a Level II NICU (special care nursery) \u2014 contact the hospital directly for current NICU level verification. Memorial Hermann Southeast at 11800 Astoria Blvd has labor and delivery with a well-baby nursery but no standalone NICU. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Pasadena?", a: "Not yet — but that doesn't mean you're stuck. The nearest birth centers are Bay Area Birth Center and other Houston-area centers, approximately 15\u201320 minutes away. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> and think through what matters most to you — you have more choices than you might think." },
      { q: "Does True Joy Birthing work with Pasadena families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Pasadena birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Allen?", a: "Expect to pay $900 to $2,500 for a doula in Allen. Prices here reflect the local cost of living, but the level of experienced support available is worth it. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Allen?", a: "Yes! Great news — Medicaid covers doula services in Allen. This is thanks to SB 750. That includes Collin County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Allen have labor and delivery?", a: "Texas Health Presbyterian Hospital Allen at 1105 N Central Expressway is Allen\u2019s primary maternity hospital, with a verified Level II NICU and Baby-Friendly designation \u2014 the first hospital in Texas to receive that designation. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Allen?", a: "Allen Birthing Center on W Main St (NPI 1629192562, est. 2007) is an NPI-verified freestanding birth center offering midwife-led births. Verify with the center directly for current services and insurance coverage. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does True Joy Birthing work with Allen families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Allen birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Wichita Falls?", a: "Expect to pay $700 to $1,500 for a doula in Wichita Falls. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Wichita Falls?", a: "Yes! Great news — Medicaid covers doula services in Wichita Falls. This is thanks to SB 750. That includes Wichita County\u2019s STAR managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Wichita Falls have labor and delivery?", a: "United Regional Hospital at 1600 11th St is the regional hub for labor and delivery, currently operating a Level II NICU (Special Care Nursery) with a Level III upgrade in progress \u2014 contact the hospital directly for current NICU level as this may change. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Wichita Falls?", a: "Wichita Falls Birth & Wellness Center at 2001 Brook Ave (NPI 1730628918) is an NPI-verified freestanding birth center. Verify with the center directly for current services and insurance coverage. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does True Joy Birthing work with Wichita Falls families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Wichita Falls birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
      { q: "Does TRICARE cover doula services for Sheppard AFB families?", a: "TRICARE covers doula services for military military families at Sheppard AFB. Verify current coverage details with your TRICARE plan, as policies can change. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> — military families deal with enough uncertainty; your birth preferences shouldn't be one of them." },
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
      { q: "Does Medicaid cover doulas in Concord?", a: "Yes! Great news — Medicaid covers doula services in Concord. That includes Cabarrus County\u2019s managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-800-662-7030 directly. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Concord accommodate birth plans?", a: "Atrium Health Cabarrus at 920 Church Street North is Concord\u2019s primary hospital for labor and delivery with a NICU and maternal-fetal medicine specialists \u2014 contact the hospital directly for current NICU level verification. Always confirm visitor and support-person policies during your hospital tour." },
      { q: "How much does a doula cost in Concord?", a: "Expect to pay $800 to $2,000 for a doula in Concord. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Concord families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Concord birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Cumming?", a: "As of 2026, Georgia Medicaid does not yet cover doula services. HB 290, which would add Medicaid doula coverage, has been introduced in the Georgia legislature but not yet enacted. Check with Georgia Medicaid at 1-877-423-4746 for the most current status. Don't hesitate to call and ask directly — \"Do you cover doula services?\" gets you a clear answer." },
      { q: "Which hospitals in Cumming accommodate birth plans?", a: "Northside Hospital Forsyth (Level III NICU, stated directly on northside.com) is Cumming\u2019s primary maternity hospital and generally accommodates birth plans. Emory Johns Creek Hospital, about 15 minutes south, also offers L&D with a NICU \u2014 contact the hospital directly for current NICU level verification. Always confirm your hospital\u2019s current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Cumming?", a: "Expect to pay $900 to $2,500 for a doula in Cumming. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Cumming families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Cumming birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Greenville?", a: "Yes! Great news — Medicaid covers doula services in Greenville. That includes Greenville County\u2019s managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-888-549-0820 directly. You can also check online at scdhhs.gov. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Greenville accommodate birth plans?", a: "Prisma Health Greenville Memorial Hospital (Level III NICU, stated directly on prismahealth.org) and Bon Secours St. Francis Hospital both offer labor and delivery and generally accommodate birth plans. Always confirm your hospital\u2019s current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Greenville?", a: "Expect to pay $800 to $2,200 for a doula in Greenville. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Greenville families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Greenville birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Charlotte?", a: "Yes! Great news — Medicaid covers doula services in Charlotte. That includes Mecklenburg County's managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-800-662-7030 directly. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Charlotte accommodate birth plans?", a: "Atrium Health Carolinas Medical Center (Level IV NICU, verified on atriumhealth.org) and Novant Health Presbyterian Medical Center (Level III NICU, verified on novanthealth.org) both accommodate birth plans and handle high volumes of births. Always confirm your hospital's current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Charlotte?", a: "Expect to pay $900 to $2,500 for a doula in Charlotte. If you're looking for bilingual support, reach out early — those spots fill fast. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Charlotte families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Charlotte birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "Does Medicaid cover doulas in Raleigh?", a: "Yes! Great news — Medicaid covers doula services in Raleigh. That includes Wake County's managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-800-662-7030 directly. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Raleigh accommodate birth plans?", a: "WakeMed Raleigh Campus (Level IV NICU, verified on wakemed.org), UNC REX Healthcare (Level III NICU, verified on unchealth.org), and Duke Regional Hospital in Durham (Level III NICU, verified on dukehealth.org) all accommodate birth plans. WakeMed handles the highest volume in Wake County. Always confirm your hospital's current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Raleigh?", a: "Expect to pay $850 to $2,300 for a doula in Raleigh. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Raleigh families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Raleigh birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
    ],
    nearbyCities: ["cary-nc", "concord-nc", "greenville-sc"],
  },
  "cary-nc": {
    city: "Cary",
    state: "NC",
    slug: "cary-nc",
    costLow: 1000,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Cary is an affluent Research Triangle suburb in Wake County, home to around 180,000 people drawn by RTP tech employers, top-rated schools, and a family-first culture. The birth community here benefits from having WakeMed Cary Hospital \u2014 the WakeMed system\u2019s flagship for women\u2019s and children\u2019s services \u2014 right in town, plus easy access to UNC REX Healthcare and the broader Triangle\u2019s doula and midwifery networks. Cary families tend to be well-resourced and well-insured, but the gap between that baseline and Medicaid-covered families is real \u2014 and both groups deserve strong birth support.",
    heroLocalDetail: "WakeMed Cary Hospital sits at 1900 Kildaire Farm Road in south Cary, about 10 minutes from downtown Cary via Kildaire Farm Road \u2014 but the intersection at Tryon Road and Kildaire Farm can slow during afternoon school pickup and rush, so know your back route through Waldo Rood Boulevard before you need it. UNC REX Healthcare is at 4418 Lake Boone Trail in west Raleigh, about 15 minutes from central Cary via I-440 to the Lake Boone Trail exit \u2014 the I-440 beltline between Cary and the Lake Boone exit backs up hard during weekday rush, so add 10 minutes if you\u2019re traveling between 4 and 6 PM. The American Tobacco Trail and Hemlock Bluffs Nature Preserve are where Cary moms walk in the third trimester \u2014 flat, shaded, and close enough to both hospitals that you\u2019re not far if things move fast.",
    hospitalDetails: [
      { name: "WakeMed Cary Hospital", paragraph: "WakeMed Cary Hospital, at 1900 Kildaire Farm Road in Cary, is the WakeMed system\u2019s flagship for women\u2019s and children\u2019s services with a Level III NICU (verified on wakemed.org) and the region\u2019s premier Special Care Nursery for babies born as early as 26 weeks. WakeMed Cary offers private LDRP suites, 24/7 obstetrician and anesthesiologist coverage, certified nurse-midwives, VBAC support, lactation consultants, and maternal-fetal medicine consults \u2014 all right in Cary, so you\u2019re not driving to Raleigh in active labor. If you\u2019re delivering at WakeMed Cary, having your birth plan ready keeps your preferences clear in a high-volume hospital where things move fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "UNC REX Healthcare", paragraph: "UNC REX Healthcare, at 4418 Lake Boone Trail in west Raleigh, is part of the UNC Health system with a Level III NICU (verified on unchealth.org) and a strong maternal-fetal medicine program. UNC REX delivers 6,000+ babies a year \u2014 one of the highest volumes in North Carolina \u2014 and offers certified nurse-midwives, VBAC support, and 24/7 neonatologist coverage. It\u2019s a 15-minute drive from central Cary, and for families who want UNC\u2019s academic medical backing without driving to Chapel Hill, REX is the answer. Having your birth plan in hand means your preferences travel with you in a busy hospital. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something specific to work from." },
      { name: "Duke University Hospital", paragraph: "Duke University Hospital, at 2301 Erwin Road in Durham, is a Level IV NICU center (verified on dukehealth.org) and one of the top neonatal programs in the Southeast \u2014 but it\u2019s a 35-minute drive from Cary via I-40 West. Most Cary families don\u2019t deliver here unless they\u2019re already in the Duke health system or have a high-risk pregnancy requiring Duke\u2019s maternal-fetal medicine specialists. Note: Duke Raleigh Hospital on Wake Forest Road does not have an active labor and delivery unit \u2014 Duke\u2019s birthing services operate from the Durham campus. If you\u2019re heading to Duke from Cary, know the I-40-to-15-501 route before contractions start." },
    ],
    // Birth center search: Google Maps search "birth center Cary NC" found
    // Raleigh Birth Center (4700 Homewood Court, Suite 120, Raleigh, NC 27612,
    // categorized as "Birth center", 5.0★/34 reviews, website raleighbirthcenter.com)
    // approximately 15 minutes from central Cary. Baby+Co. (200 Salt Lake City Ct,
    // Cary, NC 27513) may have operated previously at this address; current status
    // unverified — check babyandco.com before referring. No NPI taxonomy 261QB0400X
    // results found specifically for Cary. Verified 2026-05-27.
    birthCenterDetails: [
      { name: "Raleigh Birth Center", paragraph: "Raleigh Birth Center, at 4700 Homewood Court Suite 120 in Raleigh, is the closest freestanding birth center to Cary \u2014 about a 15-minute drive via I-440. It\u2019s a midwife-led, lower-intervention birth setting that has been serving Triangle families for years. If you\u2019re in Cary and planning an out-of-hospital birth, this is your nearest dedicated birth center \u2014 and having a doula who knows the transfer protocols to WakeMed Cary or UNC REX makes your safety net feel solid. Call ahead to confirm current availability and schedule a tour." },
    ],
    medicaidNote: "Yes \u2014 as of October 1, 2024, North Carolina Medicaid covers doula services for eligible enrollees, including Wake County\u2019s managed care plans (WellCare, UnitedHealthcare, Carolina Complete Health, Healthy Blue). Contact NC Medicaid at 1-800-662-7030 or visit.ncdhhs.gov to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Cary area. Cary\u2019s employer base \u2014 RTP tech companies like SAS, Cisco, IBM, and Red Hat \u2014 increasingly includes maternal wellness benefits that may cover doula support. Check with your provider about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "Does Medicaid cover doulas in Cary?", a: "Yes! Great news \u2014 Medicaid covers doula services in Cary. That includes Wake County\u2019s managed care plans. Here\u2019s your next step: call your Medicaid plan and ask \"Do you cover doula services?\" \u2014 they\u2019ll walk you through it, or call 1-800-662-7030 directly. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals in Cary accommodate birth plans?", a: "WakeMed Cary Hospital (Level III NICU, verified on wakemed.org) is Cary\u2019s in-town birthing hospital with CNM midwives and VBAC support. UNC REX Healthcare in west Raleigh (Level III NICU, verified on unchealth.org) is a 15-minute drive and one of the busiest birth hospitals in the state. For the highest-level NICU, Duke University Hospital in Durham (Level IV, verified on dukehealth.org) is 35 minutes away. Always confirm your hospital\u2019s current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Cary?", a: "Expect to pay $1,000 to $3,000 for a doula in Cary. The Triangle\u2019s affluent market means rates run higher than the statewide average, but student doulas and sliding-scale options exist \u2014 ask when you interview. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Are there birth centers in Cary?", a: "Cary does not currently have a freestanding birth center within town limits. Raleigh Birth Center at 4700 Homewood Court Suite 120 is about 15 minutes away and is the closest option for a midwife-led, out-of-hospital birth. WakeMed Cary Hospital offers CNM midwifery care in a hospital setting if you want midwife-led care with a NICU on-site." },
      { q: "Does True Joy Birthing work with Cary families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Cary birth setting, whether you\u2019re delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way \u2014 no signup required." },
    ],
    nearbyCities: ["raleigh-nc", "charlotte-nc", "greensboro-nc"],
  },
  "wake-forest-nc": {
    city: "Wake Forest",
    state: "NC",
    slug: "wake-forest-nc",
    costLow: 1000,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Wake Forest is a fast-growing, affluent suburb of Raleigh in northern Wake County, home to around 55,000 people who\u2019ve seen their town grow by roughly 60% since 2010. Families here are drawn by top-rated Wake County schools, master-planned communities like Heritage and Holding Village, and a historic downtown that\u2019s been reinvented with breweries and local shops. The birth community in Wake Forest is small but present \u2014 most doulas and birth professionals are based in Raleigh and travel north, so planning ahead matters. Wake Forest families typically deliver at WakeMed North Hospital, the closest full-service birthing facility, with UNC REX and WakeMed Raleigh as backup options for higher-level NICU care.",
    heroLocalDetail: "WakeMed North Hospital sits at 10000 Falls of Neuse Road in north Raleigh, about a 15-minute drive from downtown Wake Forest via Falls of Neuse Road south \u2014 and that\u2019s your fastest, most reliable route to the hospital at any time of day. Capital Boulevard (US-1) runs straight south from Wake Forest into Raleigh and is the other main artery, but it\u2019s one of the most congested corridors in Wake County during rush hour, with the stretch between I-540 and I-440 turning into a parking lot on weekday mornings and afternoons; if you\u2019re heading to UNC REX or WakeMed Raleigh via Capital, add 15\u201320 minutes during peak times. I-540 (the Triangle Expressway loop) crosses the east side of Wake Forest and connects to I-40 and the Research Triangle Park area, but the toll road won\u2019t get you to any birthing hospital faster than Falls of Neuse or Capital. For third-trimester walks, the Wake Forest Reservoir Park trail and the greenway along E. Carroll Joyner Park are flat, paved, and popular \u2014 Joyner Park\u2019s 117 acres include a walking loop around the amphitheater meadow that\u2019s become the go-to for expectant moms in Heritage and the surrounding neighborhoods. Heritage, Holding Village, Traditions, and the historic downtown area around South Main Street are where most young families are clustered.",
    hospitalDetails: [
      { name: "WakeMed North Hospital", paragraph: "WakeMed North Hospital, at 10000 Falls of Neuse Road in north Raleigh, is the closest full-service birthing hospital to Wake Forest \u2014 about 15 minutes south on Falls of Neuse Road. WakeMed North provides labor and delivery with private LDRP suites, certified nurse-midwives, 24/7 obstetrician and anesthesiologist coverage, and lactation support. The WakeMed system\u2019s Level IV NICU is located at the main Raleigh Campus on New Bern Avenue (about 25 minutes from Wake Forest), and WakeMed North can stabilize and transfer newborns needing the highest level of neonatal care there quickly. If you\u2019re delivering at WakeMed North, having your birth plan ready keeps your preferences clear when the team is moving fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "UNC REX Healthcare", paragraph: "UNC REX Healthcare, at 4418 Lake Boone Trail in west Raleigh, is about a 25\u201330-minute drive from Wake Forest via Capital Boulevard south to I-440 West, exiting at Lake Boone Trail. UNC REX has a Level III NICU (verified on unchealth.org), delivers 6,000+ babies a year, and offers certified nurse-midwives, VBAC support, and 24/7 neonatologist coverage. If you\u2019re already in the UNC Health system or want an academic-backed maternity program without driving to Chapel Hill, REX is the closest option \u2014 but plan your route before contractions start, because the I-440 beltline between the Capital Boulevard interchange and the Lake Boone Trail exit backs up hard during afternoon rush. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something specific to work from." },
      { name: "WakeMed Raleigh Campus", paragraph: "WakeMed Raleigh Campus, at 3000 New Bern Avenue in east Raleigh, is about 25\u201330 minutes from Wake Forest via Capital Boulevard south to New Bern Avenue. It houses the WakeMed Women\u2019s Pavilion and the system\u2019s Level IV NICU (verified on wakemed.org), making it the regional referral center for the most complex neonatal cases in the Triangle. If you\u2019re navigating a high-risk pregnancy and need the highest-level NICU, WakeMed Raleigh is your closest Level IV option from Wake Forest. The New Bern Avenue corridor between downtown and the hospital backs up during weekday rush, so add 10\u201315 minutes if you\u2019re traveling during peak times. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to walk in prepared." },
    ],
    // Birth center search: No freestanding birth centers currently operate in the
    // Wake Forest / northern Wake County area as of 2026. Baby+Co. previously
    // operated in Cary (closed; was NOT reopened as Vanderbilt). The nearest
    // freestanding birth center is Raleigh Birth Center at 4700 Homewood Court
    // Suite 120 in Raleigh (~20 min from Wake Forest). NPI taxonomy 261QB0400X
    // returned no results for Wake Forest ZIPs 27587, 27588. Verified 2026-05-27.
    birthCenterDetails: [
      { name: "Raleigh Birth Center", paragraph: "Raleigh Birth Center, at 4700 Homewood Court Suite 120 in Raleigh, is the closest freestanding birth center to Wake Forest \u2014 about a 20-minute drive via Falls of Neuse Road south to I-440. It\u2019s a midwife-led, lower-intervention birth setting that has been serving Triangle families for years with CPM and CNM midwives. If you\u2019re in Wake Forest and planning an out-of-hospital birth, this is your nearest dedicated birth center \u2014 and having a doula who knows the transfer protocols to WakeMed North or WakeMed Raleigh makes your safety net feel solid. Call ahead to confirm current availability and schedule a tour." },
    ],
    medicaidNote: "Yes \u2014 as of October 1, 2024, North Carolina Medicaid covers doula services for eligible enrollees, including Wake County\u2019s managed care plans (WellCare, UnitedHealthcare, Carolina Complete Health, Healthy Blue). Contact NC Medicaid at 1-800-662-7030 or visit.ncdhhs.gov to confirm your plan\u2019s doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Wake Forest area. Wake Forest\u2019s affluent employer base and the broader RTP market increasingly include maternal wellness benefits \u2014 check with your provider about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "Does Medicaid cover doulas in Wake Forest?", a: "Yes! Great news \u2014 Medicaid covers doula services in Wake Forest. That includes Wake County\u2019s managed care plans. Here\u2019s your next step: call your Medicaid plan and ask \"Do you cover doula services?\" \u2014 they\u2019ll walk you through it, or call 1-800-662-7030 directly. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals near Wake Forest accommodate birth plans?", a: "WakeMed North Hospital (about 15 min from Wake Forest via Falls of Neuse Road) is the closest full-service birthing hospital and generally accommodates birth plans. UNC REX Healthcare in west Raleigh (Level III NICU, verified on unchealth.org, ~25 min) and WakeMed Raleigh Campus (Level IV NICU, verified on wakemed.org, ~25 min) both handle high-volume births with strong maternity programs. Note: Duke Raleigh Hospital on Wake Forest Road does not offer labor and delivery \u2014 Duke\u2019s birthing services operate from Duke University Hospital in Durham. Always confirm your hospital\u2019s current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Wake Forest?", a: "Expect to pay $1,000 to $2,000 for a doula in Wake Forest. Most doulas serving Wake Forest are based in Raleigh and travel north, so start your search early and ask about travel fees upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Are there birth centers near Wake Forest?", a: "There are no freestanding birth centers in Wake Forest itself. Raleigh Birth Center at 4700 Homewood Court Suite 120 in Raleigh is the closest option \u2014 about a 20-minute drive. If you want midwife-led care in a hospital setting, WakeMed North Hospital offers certified nurse-midwives on staff. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does True Joy Birthing work with Wake Forest families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Wake Forest birth setting, whether you\u2019re delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way \u2014 no signup required." },
    ],
    nearbyCities: ["raleigh-nc", "cary-nc"],
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
      { q: "Does Medicaid cover doulas in Atlanta?", a: "As of 2026, Georgia Medicaid does not yet cover doula services. HB 290, which would add Medicaid doula coverage, has been introduced in the Georgia legislature but not yet enacted. Check with Georgia Medicaid at 1-877-423-4746 for the most current status. Don't hesitate to call and ask directly — \"Do you cover doula services?\" gets you a clear answer." },
      { q: "Which hospitals in Atlanta accommodate birth plans?", a: "Northside Hospital Atlanta (Level III NICU and Level IV Maternal Care, verified on northside.com), Emory University Hospital Midtown (Level III NICU, verified on emoryhealthcare.org), and Piedmont Atlanta Hospital (Level III NICU, verified on piedmont.org) all accommodate birth plans. Northside handles the highest birth volume in the country. Always confirm your hospital's current visitor and support-person policies during your tour." },
      { q: "How much does a doula cost in Atlanta?", a: "Expect to pay $1,000 to $3,000 for a doula in Atlanta. If you're looking for bilingual support, reach out early — those spots fill fast. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Atlanta families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Atlanta birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Savannah?", a: "Expect to pay $800 to $2,000 for a doula in Savannah. The local doula community here is smaller than in big metros, so start your search early. Some doulas may charge a travel fee if they're commuting from a nearby metro, so ask upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Savannah?", a: "As of 2026, Georgia Medicaid does not yet cover doula services. HB 290, which would add Medicaid doula coverage, has been introduced in the Georgia legislature but not yet enacted. Check with Georgia Medicaid at 1-877-423-4746 for the most current status. Don't hesitate to call and ask directly — \"Do you cover doula services?\" gets you a clear answer." },
      { q: "Which Savannah hospitals accommodate birth plans?", a: "Memorial Health University Medical Center (Level III NICU, stated directly on memorialhealth.com) and St. Joseph\u2019s/Candler Candler Hospital both offer labor and delivery and generally accommodate birth plans. Always confirm your hospital\u2019s current visitor and support-person policies during your tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Savannah families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Savannah birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Jacksonville?", a: "Expect to pay $900 to $2,500 for a doula in Jacksonville. Military? Ask about military discounts — several local doulas offer them. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Jacksonville?", a: "Not yet — your state's Medicaid doesn't cover doulas right now. But that doesn't mean you're alone. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — no matter who's in the room with you, knowing what you want is your superpower." },
      { q: "Which Jacksonville hospitals accommodate birth plans?", a: "Baptist Medical Center Jacksonville (Level IV NICU via Wolfson Children\u2019s Hospital, verified on wolfsonchildrens.com) and Ascension St. Vincent\u2019s Riverside both offer labor and delivery and generally accommodate birth plans. Always confirm your hospital\u2019s current visitor and support-person policies during your tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Jacksonville families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Jacksonville birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
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
      { q: "How much does a doula cost in Greensboro?", a: "Expect to pay $850 to $2,200 for a doula in Greensboro. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Greensboro?", a: "Yes! Great news — Medicaid covers doula services in Greensboro. That includes Guilford County\u2019s managed care plans. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it, or call 1-800-662-7030 directly. You can also check online at ncdhhs.gov. You deserve support, and now your insurance helps pay for it." },
      { q: "Which Greensboro hospitals accommodate birth plans?", a: "Cone Health Women\u2019s Hospital (Level III NICU, stated directly on conehealth.com) is Greensboro\u2019s primary maternity hospital and generally accommodates birth plans. Moses Cone Hospital provides the system\u2019s medical backup for complex cases. Always confirm your hospital\u2019s current visitor and support-person policies during your tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Greensboro families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Greensboro birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
    ],
    nearbyCities: ["charlotte-nc", "raleigh-nc"],
  },
  "tampa-fl": {
    city: "Tampa",
    state: "FL",
    slug: "tampa-fl",
    costLow: 900,
    costHigh: 2800,
    shelbiServesHere: false,
    culture: "Tampa is the largest birth market on Florida's Gulf Coast, with Tampa General Hospital and BayCare's St. Joseph's Women's Hospital anchoring a competitive hospital landscape. The MacDill Air Force Base population brings a steady flow of TRICARE families navigating military insurance, and the city's suburban sprawl — from South Tampa to Brandon to Wesley Chapel — means doulas who know which hospital system serves which ZIP code have a real edge. The birth community here is larger and more organized than in most Florida cities.",
    heroLocalDetail: "Tampa General Hospital sits on Davis Islands, accessible via the Selmon Expressway (FL-618) and the Platt Street Bridge — and during morning rush, that bridge and the parallel Cass Street bridge both back up. If you're delivering at TGH, the Selmon Expressway is almost always faster than surface streets from South Tampa or Brandon. AdventHealth Tampa is on McLaren Circle just west of downtown, reachable via I-275 Exit 45. BayCare St. Joseph's Women's Hospital is in central Tampa on MLK Boulevard, about 10 minutes from I-275. Bayshore Boulevard's 4.5-mile sidewalk — the longest continuous sidewalk in the US — is where Tampa moms walk in the third trimester, and Al Lopez Park near Raymond James Stadium has flat, shaded paths that are popular when Bayshore feels too exposed.",
    hospitalDetails: [
      { name: "Tampa General Hospital", paragraph: "Tampa General Hospital, on Davis Islands just south of downtown, is the region's only Level I trauma center and home to one of the busiest neonatal intensive care units in the state — with a Level IV NICU through its partnership with USF Health (verified on tgh.org). TGH handles high-risk pregnancies from across west-central Florida and has maternal-fetal medicine specialists on staff. If you're delivering at Tampa General, having your birth plan ready helps you navigate a large regional referral center that sees families from a huge geographic area. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "BayCare St. Joseph's Women's Hospital", paragraph: "St. Joseph's Women's Hospital, on MLK Boulevard in central Tampa, is BayCare's dedicated women's and children's hospital — one of the few standalone women's hospitals in Florida, with a Level III NICU (contact the hospital directly for current level verification) and a high-volume L&D unit that serves families from South Tampa, Town 'n' Country, and the western suburbs. St. Joseph's is the hospital where a lot of Tampa OBs deliver, and its dedicated women's campus means the entire floor is built around birth and newborn care." },
      { name: "AdventHealth Tampa", paragraph: "AdventHealth Tampa, on McLaren Circle just west of downtown off I-275, offers maternity care with a NICU for babies who need extra support — contact AdventHealth directly for current NICU level verification. AdventHealth is smaller than TGH or St. Joseph's for births, which some families prefer, but it's also the closest option for families in the Westshore and Airport West corridors. If we're being real, your OB usually determines your hospital in Tampa — so know which system they deliver at before you commit to a birth plan." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Tampa (ZIPs 33602-33647). Google Maps search "birth center Tampa FL" found no
    // freestanding birth centers within the Tampa city limits. The nearest CABC-accredited
    // birth centers are in St. Petersburg (About Women Birth Center) and Lakeland (Lakeland Birth Center).
    // Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "As of 2026, Florida Medicaid does not cover doula services. Florida has not enacted legislation to add Medicaid doula coverage. Tampa-area families on Medicaid should check with their managed care plan (Staywell, Sunshine Health, Simply Healthcare, Molina Healthcare) about any maternal wellness benefits that might include doula support. Contact Florida Medicaid at 1-877-254-1055 or visit flmedicaidmanagedcare.com for current plan information.",
    insuranceNote: "TRICARE covers maternity care for military families at MacDill AFB — check TRICARE's current doula and support-person policy at tricare.mil, as doula coverage is limited. Tampa's employer market (BayCare, Raymond James, Jabil, Citigroup) increasingly includes maternal wellness benefits — check your specific plan for doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Tampa?", a: "Expect to pay $900 to $2,800 for a doula in Tampa. The local doula community here is smaller than in big metros, so start your search early. Military? Ask about military discounts — several local doulas offer them. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Tampa?", a: "Not yet — your state's Medicaid doesn't cover doulas right now. But that doesn't mean you're alone. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — no matter who's in the room with you, knowing what you want is your superpower." },
      { q: "Which Tampa hospitals accommodate birth plans?", a: "Tampa General Hospital (Level IV NICU, verified on tgh.org), BayCare St. Joseph's Women's Hospital (dedicated women's campus, contact for current NICU level), and AdventHealth Tampa all offer labor and delivery and generally accommodate birth plans. Always confirm your hospital's current visitor and support-person policies during your tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Tampa families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Tampa birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
    ],
    nearbyCities: ["jacksonville-fl", "savannah-ga"],
  },
  "orlando-fl": {
    city: "Orlando",
    state: "FL",
    slug: "orlando-fl",
    costLow: 850,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Orlando is one of the highest-volume birth markets in the Southeast — Winnie Palmer Hospital delivers more babies than almost any other hospital in the country, and the city's transient, transplant-heavy population means a constant flow of families who don't have a local support network yet. The birth community here is active but spread across a metro that includes Seminole County, Osceola County, and Lake Mary, so knowing which hospital system serves your ZIP code matters.",
    heroLocalDetail: "Winnie Palmer Hospital is on South Orange Avenue just south of downtown Orlando, connected to the Orlando Health campus — and SR-408 (the East-West Expressway) is the fastest way in from the east side, while I-4 is the main north-south corridor that backs up badly during rush, especially near the Universal Studios exit. AdventHealth Orlando is on Rollins Avenue in the Loch Haven neighborhood, about 8 minutes north of downtown via Orange Avenue. If you're delivering at Winnie Palmer from the suburbs (Lake Mary, Sanford, Kissimmee), I-4 and the 417 toll road are your main routes — know which one is faster from your neighborhood. Lake Eola Park's walking loop in downtown Orlando and Blanchard Park's shaded trails along the Little Econlockhatchee River on the east side are where Orlando moms walk in the third trimester.",
    hospitalDetails: [
      { name: "Winnie Palmer Hospital for Women & Babies", paragraph: "Winnie Palmer Hospital, on South Orange Avenue in downtown Orlando, is one of the busiest birthing hospitals in the United States — delivering over 14,000 babies a year — with a Level III NICU (stated directly on winniepalmerhospital.com). It's part of the Orlando Health system and is the primary referral center for high-risk pregnancies across central Florida. If you're delivering at Winnie Palmer, having your birth plan ready is especially important — it's a high-volume hospital where clear preferences help your care team support you in a busy environment. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "AdventHealth Orlando", paragraph: "AdventHealth Orlando, on Rollins Avenue in the Loch Haven neighborhood just north of downtown, is the flagship of the AdventHealth system in central Florida — and its maternity services include a NICU with neonatologists on staff (contact AdventHealth directly for current NICU level verification). AdventHealth Orlando handles a large volume of births and is the go-to hospital for families in the north Orlando, Winter Park, and Maitland corridors. If we're being real, Orlando's two biggest hospital systems — Orlando Health and AdventHealth — both have strong maternity programs, and most Orlando OBs deliver at one or the other based on their practice affiliation." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Orlando (ZIPs 32801-32837). Google Maps search "birth center Orlando FL" found no
    // freestanding birth centers within the Orlando city limits. The nearest CABC-accredited
    // birth center is About Women Birth Center in St. Petersburg (~90 min west).
    // Verified 2026-05-26.
    birthCenterDetails: [
    ],
    medicaidNote: "As of 2026, Florida Medicaid does not cover doula services. Florida has not enacted legislation to add Medicaid doula coverage. Orlando-area families on Medicaid should check with their managed care plan (Staywell, Sunshine Health, Simply Healthcare, UnitedHealthcare Community Plan) about any maternal wellness benefits. Contact Florida Medicaid at 1-877-254-1055 or visit flmedicaidmanagedcare.com for current plan information.",
    insuranceNote: "Orlando's employer market is one of the largest in Florida — Disney, Universal, AdventHealth, Lockheed Martin, and Darden all offer health plans that may include maternal wellness benefits. Check your specific plan for doula coverage, and whether HSA or FSA funds can help. Theme-park and hospitality employers sometimes have flexible benefits that cover doula services under wellness programs.",
    faqs: [
      { q: "How much does a doula cost in Orlando?", a: "Expect to pay $850 to $2,500 for a doula in Orlando. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Orlando?", a: "Not yet — your state's Medicaid doesn't cover doulas right now. But that doesn't mean you're alone. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — no matter who's in the room with you, knowing what you want is your superpower." },
      { q: "Which Orlando hospitals accommodate birth plans?", a: "Winnie Palmer Hospital for Women & Babies (Level III NICU, verified on winniepalmerhospital.com) and AdventHealth Orlando both offer labor and delivery and generally accommodate birth plans. Always confirm your hospital's current visitor and support-person policies during your tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Orlando families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Orlando birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way — no signup required." },
    ],
    nearbyCities: ["jacksonville-fl", "tampa-fl"],
  },
  "denver-co": {
    city: "Denver",
    state: "CO",
    slug: "denver-co",
    costLow: 1000,
    costHigh: 3000,
    shelbiServesHere: false,
    lat: 39.7392,
    lng: -104.9903,
    publishedDate: "2026-06-04",
    enableBlogResources: true,
    heroImage: "/images/denver-co-birth-doula-skyline.webp",
    supportSceneImage: "/images/denver-support-scene.webp",
    supportSceneAlt: "A doula walking alongside an expectant mom on a tree-lined path with the Colorado Front Range in the distance: Denver birth support",
    ogImage: "https://truejoybirthing.com/images/og-city-denver-co-v2.webp",
    midwifeInfo: {
      paragraph: "Colorado licenses Certified Professional Midwives (CPMs) and Registered Midwives (RMs), making home birth midwifery legally regulated in the state. That means if you're planning a home birth or birth center birth in {city}, your midwife operates under a state-issued license, not in a legal gray area. On the hospital side, Certified Nurse-Midwives (CNMs) practice in all major Denver hospitals, including UCHealth, Saint Joe's, and P/SL, so hospital-based midwifery care is widely available for {city} families.",
      credentialTypes: " and RMs",
      credentialDetail: "In Colorado, Registered Midwives (RMs) are specifically licensed by the state to attend out-of-hospital births, giving",
    },
    culture: "Denver is Colorado's largest birth market and one of the most doula-friendly cities in the Mountain West, the state's Medicaid doula coverage (since January 2024 via HB 23-1027) has accelerated adoption, and the local birth community is organized around a strong network of doulas and birth centers. UCHealth and HealthOne (HCA Healthcare) split the hospital market, and families who know which system their OB delivers at have a real advantage in navigating Denver's sprawl.",
    heroLocalDetail: "UCHealth University of Colorado Hospital is on the Anschutz Medical Campus in Aurora, about 20 minutes east of downtown via I-70 or Colfax Avenue, and during afternoon rush, I-70 between downtown and the medical campus backs up hard, so Hampden Avenue or MLK Boulevard can be faster. Saint Joseph Hospital is on Lafayette Street just east of downtown, about 5 minutes from City Park. Presbyterian/St. Luke's is at 20th and High Street in the City Park South neighborhood, adjacent to Saint Joe's within the CarePoint Health system. Washington Park's 2.5-mile outer loop and Cheesman Park's paved paths are where Denver moms walk in the third trimester, both are flat, shaded, and close to the major hospitals.",
    hospitalDetails: [
      { name: "UCHealth University of Colorado Hospital", address: "12605 E 16th Ave, Aurora, CO 80045", thumbnail: "/images/denver-uchealth-hospital.webp", nicuLevel: "III", vbacPolicy: "Allows TOLAC/VBAC, dedicated VBAC program with midwives", doulaPolicy: "Doulas welcome as support persons, integrated into care team", midwifeFriendly: true, waterBirth: "Labor tubs available for hydrotherapy; water birth not routinely offered per hospital protocol", medicaid: true, lactation: true, privateRooms: true, url: "https://www.uchealth.org/services/maternity/", paragraph: "UCHealth University of Colorado Hospital, on the Anschutz Medical Campus in Aurora, is the region's academic medical center and the highest-level NICU provider in the state, with a Level III NICU (verified on uchealth.org). It's where high-risk pregnancies from across Colorado are referred, with maternal-fetal medicine specialists and the full range of neonatal subspecialties. CNM-attended births are available through the University of Colorado Nurse-Midwives practice, and the hospital accepts Health First Colorado (Medicaid). If you're delivering at UCHealth, having your birth plan ready helps you navigate a busy academic hospital that serves families from a huge catchment area. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Saint Joseph Hospital", address: "1375 E 19th Ave, Denver, CO 80218", thumbnail: "/images/denver-saint-joseph-hospital.webp", nicuLevel: "III", vbacPolicy: "Allows TOLAC/VBAC", doulaPolicy: "Doulas welcome as support persons", midwifeFriendly: true, waterBirth: "Hydrotherapy tubs available for labor; water birth varies by provider", medicaid: true, lactation: true, privateRooms: true, url: "https://www.saintjosephdenver.org/services/maternity", paragraph: "Saint Joseph Hospital, on Lafayette Street just east of downtown Denver, is one of the city's oldest hospitals and a high-volume birthing center with a Level III NICU. Saint Joe's is known for its strong midwifery program and has long been a favorite among Denver doulas for its relatively supportive approach to birth plans and continuous labor support. CNM-attended births are available, and the hospital accepts Health First Colorado (Medicaid) with IBCLCs on staff. If we're being real, Saint Joe's location in central Denver makes it the most accessible hospital for families in Capitol Hill, City Park, and the central neighborhoods." },
      { name: "Presbyterian/St. Luke's Medical Center", address: "2001 N High St, Denver, CO 80205", thumbnail: "/images/denver-presbyterian-st-lukes.webp", vbacPolicy: "Allows TOLAC/VBAC with physician approval", doulaPolicy: "Doulas welcome as support persons", medicaid: true, lactation: true, privateRooms: true, url: "https://www.healthonecares.com/locations/presbyterian-st-lukes-medical-center/maternity-care", paragraph: "Presbyterian/St. Luke's Medical Center (P/SL), at 20th and High Street in the City Park South neighborhood, is one of Denver's highest-volume birth centers with a Level III NICU and private L&D suites. IBCLCs are on staff, and the hospital accepts Health First Colorado (Medicaid). P/SL and Saint Joe's share a campus area near City Park, which means some OB practices deliver at both, so confirm which hospital your provider uses. Having your birth plan in hand makes check-in smoother. <a href=\"/birth-plan-template/\">use our free template</a>." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned one result for Denver,
    // Mountain Midwifery Birth Center (Englewood) is PERMANENTLY CLOSED as of 2025.
    // No active freestanding birth centers in the Denver metro area as of June 2026.
    birthCenterDetails: [],
    localDoulas: [
      { name: "Sonja Spitzer", credential: "CAPPA Certified Postpartum Doula, CPD", practice: "Embrace Birth Services", url: "https://embracebirthservices.com", photo: "/images/doulas/sonja-spitzer.webp", description: "Birth and postpartum doula serving the Denver Metro area. Former family law attorney turned doula — CAPPA certified postpartum doula and Allo Doula Academy certified professional doula.", costRange: "$1,200–$1,900", serviceArea: ["Denver", "Golden", "Lakewood", "Sunnyside"], services: ["Birth Doula", "Postpartum Doula", "Childbirth Education", "Loss Support"], acceptingClients: true },
      { name: "Krystal", credential: "Birth Doula, RN", practice: "Doulas of Denver", url: "https://www.doulasofdenver.com", description: "Denver doula agency pairing families with pre-screened, certified, insured doulas. Founded by an RN — matches you with the right doula for your birth.", costRange: "~$1,000", serviceArea: ["Denver", "Aurora", "Arvada", "Centennial", "Highlands Ranch", "Lakewood", "Littleton", "Thornton", "Westminster"], services: ["Birth Doula", "Postpartum Care", "Overnight Newborn Care", "Sleep Coaching", "Placenta Encapsulation"], acceptingClients: true },
      { name: "Melissa Sexton & Samantha Venn", credential: "Certified and Registered Midwives (RM, CPM)", practice: "Meadowsweet Midwifery", url: "https://www.meadowsweetmidwifery.com", photo: "/images/doulas/meadowsweet-midwifery.webp", description: "Home birth midwifery practice serving Denver since 2010. Melissa has attended births since 2003; Samantha is a CPM and child passenger safety technician. Offering prenatal, birth, and postpartum care with a focus on empowering, enriching birth experiences.", isMidwife: true, costRange: "$6,500 (global fee)", serviceArea: ["Denver", "Lakewood", "Arvada", "Englewood"], services: ["Home Birth", "Prenatal Care", "Postpartum Care", "Lactation Support", "Water Birth"], acceptingClients: true },
      { name: "Sena Johnson", credential: "Registered Midwife (RM)", practice: "Birth Choice Association", url: "https://www.denvermidwife.com", photo: "/images/doulas/sena-johnson.webp", description: "Denver's senior homebirth midwife with 38 years of experience and 1,100+ births attended. Offers holistic midwifery care including Craniosacral Therapy, Reiki, and herbal support. Inclusive and affirming care for all families.", isMidwife: true, costRange: "Contact for consultation", serviceArea: ["Denver", "Lakewood", "Arvada"], services: ["Home Birth", "Prenatal Care", "Postpartum Care", "Craniosacral Therapy", "Herbal Support", "Newborn Care"], acceptingClients: true },
    ],
    medicaidNote: "Yes — Colorado Medicaid now covers doula services as of January 2024 under HB 23-1027, including Health First Colorado (the state's Medicaid program) managed care plans in Denver County. The reimbursement rate is $750 per birth for a full-spectrum doula package (prenatal, labor, and postpartum visits). Contact Health First Colorado at 1-800-221-3943 or visit healthfirstcolorado.com to confirm your plan's doula coverage and find participating doulas.",
    insuranceNote: "Colorado's Medicaid doula coverage (HB 23-1027, effective January 2024) is among the most progressive in the country, with $750 per birth for full-spectrum doula services under Health First Colorado. For families with private insurance, Denver's employer market (DaVita, Liberty Global, Arrow Electronics, Quest Communications) increasingly includes maternal wellness benefits. Check your plan for doula coverage, and HSA/FSA funds can supplement out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Denver?", a: "Expect $1,000 to $3,000 for a doula in Denver. Unlike Colorado Springs where military discounts are common, Denver's doula market is shaped by the city's size — you'll find more specialized doulas (postpartum-only, overnight care, lactation-focused) than in smaller CO cities. Can't swing the full price? Ask about sliding-scale options. Most doulas cover prenatal visits, labor support, and postpartum check-ins. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Denver?", a: "Yes! Great news, Medicaid covers doula services in Denver. This is thanks to HB 23-1027. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\", they'll walk you through it, or call 1-800-221-3943 directly. You can also check online at healthfirstcolorado.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which Denver hospitals accommodate birth plans?", a: "UCHealth University of Colorado Hospital (Level III NICU, verified), Saint Joseph Hospital (Level III NICU, contact for verification), and Presbyterian/St. Luke's Medical Center all offer labor and delivery. While there are currently no freestanding birth centers in the Denver metro area, doula support and midwifery care are widely available. Always confirm your hospital's current visitor and support-person policies during your tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Denver families?", a: "Yes, and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Denver birth setting, whether you're delivering at a hospital, a birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way, no signup required." },
    ],
    nearbyCities: ["colorado-springs-co", "fort-collins-co", "aurora-co"],
  },
  "miami-fl": {
    city: "Miami",
    state: "FL",
    slug: "miami-fl",
    costLow: 1200,
    costHigh: 3500,
    shelbiServesHere: false,
    culture: "Miami is one of the most diverse birth markets in the country — bilingual doulas (English/Spanish/Creole) are common and often command a premium. The hospital landscape is large and competitive, with Jackson Memorial anchoring the county system and multiple private systems (Baptist Health, Mount Sinai) offering alternatives. Hurricane season (June–November) adds a planning layer that most cities don't have.",
    heroLocalDetail: "From the I-95 corridor through downtown to the palmetto neighborhoods off US-1, Miami families navigate one of Florida's busiest birth corridors. Jackson Memorial anchors the county system, while Baptist Health and Mount Sinai serve South Dade and the Beaches. Hurricane season (June–November) adds planning considerations — pack a go-bag early and identify a backup hospital.",
    hospitalDetails: [
      { name: "Jackson Memorial Hospital", paragraph: "Jackson Memorial Hospital is Miami-Dade's public safety-net hospital and home to the Ryder Trauma Center and a Level IV NICU — the highest level available, providing care for the most critically ill newborns. As a teaching hospital affiliated with UM, Jackson handles high-risk pregnancies from across South Florida. If you're delivering here, a birth plan is essential — the volume is high and staff rotates, so your preferences need to be clear and easy to read. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Mercy Hospital", paragraph: "Mercy Hospital, part of HCA Florida Healthcare, offers a Level III NICU and a more intimate birth experience than Jackson. Located in Coconut Grove, it's popular with families on the south side of Miami. Doulas are generally welcome, and the smaller unit means staff may have more time for your preferences." },
      { name: "Mount Sinai Medical Center", paragraph: "Mount Sinai Medical Center on Miami Beach provides a Level III NICU and serves families from Miami Beach, Surfside, and the northeastern corridor. The location means beachside traffic can affect your drive time — plan your route during rush hour before you need it." },
      { name: "Baptist Health South Florida", paragraph: "Baptist Health South Florida (South Miami campus) offers a Level III NICU and one of the busiest maternity programs in the state. Their multiple campuses across South Florida mean you likely have a Baptist facility within 20 minutes, but confirm which campus handles deliveries before your third trimester." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Miami", paragraph: "NPI taxonomy 261QB0400X search on NPPES returned 0 results for Miami FL. No freestanding birth centers operate within Miami proper. The closest option is Delray Birth Center (~55 min north in Delray Beach). Families seeking out-of-hospital birth should plan for a significant drive or explore home birth with a licensed midwife." }
    ],
    medicaidNote: "Florida Medicaid does not currently cover doula services. Doulas are not recognized as Medicaid providers in FL. Families using Medicaid in Miami should explore community-based doula programs that offer sliding-scale or volunteer support.",
    insuranceNote: "Most commercial insurance in FL does not cover doula fees. Some Florida Blue plans may partially reimburse under wellness benefits if the doula is a certified health educator.",
    faqs: [
      { q: "How much does a doula cost in Miami?", a: "Expect to pay $1200 to $3500 for a doula in Miami. If you're looking for bilingual support, reach out early — those spots fill fast. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Florida Medicaid cover doula services?", a: "Not yet — your state's Medicaid doesn't cover doulas right now. But that doesn't mean you're alone. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — no matter who's in the room with you, knowing what you want is your superpower." },
      { q: "What hospitals in Miami have Level III or IV NICUs?", a: "Jackson Memorial (Level IV) and Baptist Health South Florida, Mount Sinai, and Mercy Hospital (all Level III) have the highest-level NICUs in Miami-Dade County. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Miami?", a: "No freestanding birth centers operate within Miami proper. The closest is Delray Birth Center, approximately 55 minutes north. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "What should Miami families know about hurricane season and birth planning?", a: "Hurricane season runs June through November. Have a backup hospital identified, pack a go-bag early (by week 34), and include an emergency plan in your birth plan. Pack your hospital bag by 35 weeks and have a backup route to the hospital — storm season is not the time to wing it." },
      { q: "Do I need a birth plan if I'm delivering at Jackson Memorial?", a: "Jackson Memorial is a large teaching hospital with a Level IV NICU — a birth plan helps communicate your preferences clearly to rotating staff. The Joyful Birth Plan is designed to be read by nurses in under two minutes. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> — it walks you through every question to think about before the big day." }
    ],
    nearbyCities: ["tampa-fl", "jacksonville-fl"],
  },
  "st-petersburg-fl": {
    city: "St. Petersburg",
    state: "FL",
    slug: "st-petersburg-fl",
    costLow: 900,
    costHigh: 2800,
    shelbiServesHere: false,
    culture: "St. Petersburg has a growing birth community that benefits from proximity to Tampa's larger network while offering a more walkable, neighborhood-oriented maternity landscape. Many Tampa Bay doulas serve both sides of the bridge, so families have access to a broader provider network than the city's size would suggest.",
    heroLocalDetail: "Along Central Avenue from downtown to the beaches, St. Petersburg families find a walkable maternity landscape. Bayfront Health (Orlando Health) anchors downtown birth services, while Johns Hopkins All Children's provides the region's only Level IV NICU. The Howard Frankland Bridge connects you to Tampa's full hospital network in 20 minutes.",
    hospitalDetails: [
      { name: "Johns Hopkins All Children's Hospital", paragraph: "Johns Hopkins All Children's Hospital is the regional neonatal referral center for Tampa Bay, with a Level IV NICU and specialized maternal-fetal medicine. While primarily pediatric, the NICU accepts transfers from across the region for the most complex cases. If your pregnancy is high-risk, this is where your baby may be transferred." },
      { name: "Bayfront Health St. Petersburg (Orlando Health)", paragraph: "Bayfront Health St. Petersburg, now part of Orlando Health, is the busiest birth hospital in Pinellas County with a Level III NICU. Located downtown near the waterfront, it's the go-to for St. Pete families. As with any high-volume hospital, a written birth plan helps ensure your preferences are communicated clearly." },
      { name: "HCA Florida Palms of Pasadena Hospital", paragraph: "HCA Florida Palms of Pasadena Hospital in South Pasadena offers a Level II NICU and community-oriented birth services. It's a good option for low-risk pregnancies on the south side of St. Pete, with shorter wait times and a more personal feel than the larger downtown hospitals." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in St. Petersburg", paragraph: "NPI taxonomy 261QB0400X returned 0 results for St. Petersburg FL. No freestanding birth centers in Pinellas County. The closest is Tampa Bay Birth Center (~30 min across the Howard Frankland Bridge). Families wanting an out-of-hospital birth should factor in bridge traffic during rush hour." }
    ],
    medicaidNote: "Florida Medicaid does not cover doula services. Pinellas County has several community doula programs that offer sliding-scale fees for Medicaid-eligible families.",
    insuranceNote: "Commercial insurance in FL generally does not cover doula fees. Some employers offer doula benefits through Carrot, Maven, or similar platforms.",
    faqs: [
      { q: "How much does a doula cost in St. Petersburg?", a: "Expect to pay $900 to $2800 for a doula in St. Petersburg. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "What's the closest birth center to St. Petersburg?", a: "Tampa Bay Birth Center is approximately 30 minutes away across the Howard Frankland Bridge. No birth centers operate in Pinellas County. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does Florida Medicaid cover doula services in St. Petersburg?", a: "Not yet — your state's Medicaid doesn't cover doulas right now. But that doesn't mean you're alone. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — no matter who's in the room with you, knowing what you want is your superpower." },
      { q: "Which St. Petersburg hospitals have the highest-level NICUs?", a: "Johns Hopkins All Children's Hospital provides Level IV NICU care, and Bayfront Health St. Petersburg (Orlando Health) has a Level III NICU. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Do St. Petersburg doulas also cover Tampa?", a: "Yes, many Tampa Bay doulas serve both sides of the bridge. Expect moderate travel fees ($50–$100) if your doula is based on the opposite side of the bay. You can also use the True Joy Birthing app to find local doulas — start there and interview a few until one clicks." },
      { q: "Is St. Petersburg a good place to give birth?", a: "St. Petersburg offers strong hospital options within city limits, plus close access to Tampa's broader birth network via the Howard Frankland Bridge. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> and start thinking about what kind of birth experience you want — wherever you deliver." }
    ],
    nearbyCities: ["tampa-fl", "orlando-fl"],
  },
  "colorado-springs-co": {
    city: "Colorado Springs",
    state: "CO",
    slug: "colorado-springs-co",
    costLow: 800,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Colorado Springs combines a strong military birth community (Fort Carson) with a growing natural-birth scene anchored by Mountain Midwifery Birth Center. The altitude (6,035 ft) and the city's military population shape local birth culture — TRICARE-aware providers and altitude-educated midwives are both easy to find. Colorado's Medicaid doula coverage (HB 23-1027) makes this one of the most affordable cities in the country for doula-supported birth.",
    heroLocalDetail: "Nestled at the foot of Pikes Peak along the I-25 corridor, Colorado Springs families navigate a birth landscape shaped by altitude (6,035 ft) and military presence. UCHealth Memorial Central and Penrose Hospital anchor civilian birth services, while Evans Army Community Hospital serves Fort Carson. Mountain Midwifery Birth Center offers an out-of-hospital option — one of the few freestanding birth centers in the state.",
    hospitalDetails: [
      { name: "UCHealth Memorial Hospital Central", paragraph: "UCHealth Memorial Hospital Central is the largest hospital in southern Colorado with a verified Level III NICU and a high-volume maternity program. Located in central Colorado Springs, it's the primary referral center for complicated pregnancies across the Pikes Peak region. A birth plan is valuable here — the volume is high and staff coverage rotates, so written preferences help ensure your voice is heard. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Centura Health Penrose Hospital", paragraph: "Centura Health Penrose Hospital is a major birth hospital in Colorado Springs with a Level III NICU and a strong maternal-fetal medicine program. Penrose has a long-standing reputation for both routine and high-risk deliveries, and it's the alternative to UCHealth Memorial for families on the north side of town." },
      { name: "Evans Army Community Hospital", paragraph: "Evans Army Community Hospital at Fort Carson serves TRICARE families with a Level II NICU and obstetric services. If you're a military spouse, Evans is your primary option — many local doulas are experienced with TRICARE protocols and military hospital procedures." }
    ],
    birthCenterDetails: [
      { name: "Mountain Midwifery Birth Center", paragraph: "Mountain Midwifery Birth Center at 425 S Howcroft St, Colorado Springs, CO 80913 (NPI: 1558839423) is one of the few freestanding birth centers in Colorado. They offer out-of-hospital birth with certified midwives in a home-like setting. This is the go-to option for families seeking a non-hospital birth experience in the Pikes Peak region." }
    ],
    medicaidNote: "Colorado Health First (Medicaid) covers doula services under HB 23-1027, effective January 2024. Colorado Medicaid reimburses doulas up to $750 per pregnancy ($150 prenatal, $150 labor/delivery, $150 postpartum, plus $300 in extended postpartum visits). Doulas must register with the state as Medicaid providers.",
    insuranceNote: "Colorado is one of the few states where both Medicaid and some commercial insurers cover doula services. Check with your specific plan — Cigna and United Healthcare have pilot programs in CO.",
    faqs: [
      { q: "How much does a doula cost in Colorado Springs?", a: "Expect to pay $800 to $2500 for a doula in Colorado Springs. Military? Ask about military discounts — several local doulas offer them. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Colorado Medicaid cover doula services?", a: "Yes! Great news — Medicaid covers doula services in Colorado Springs. This is thanks to HB 23-1027. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "Is there a birth center in Colorado Springs?", a: "Yes, Mountain Midwifery Birth Center at 425 S Howcroft St offers out-of-hospital birth services. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does altitude affect pregnancy in Colorado Springs?", a: "At 6,035 feet, altitude can affect pregnancy. Stay hydrated, discuss altitude concerns with your provider, and mention it in your birth plan. Most local providers are experienced with high-altitude prenatal care. Talk to your provider about what altitude means for your pregnancy — hydration and listening to your body matter even more here." },
      { q: "Are there military-specific birth resources in Colorado Springs?", a: "Yes. Evans Army Community Hospital at Fort Carson serves TRICARE military families like yours. Many local doulas are experienced with military pregnancies and TRICARE referral processes. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> — military life means plans change, but knowing what you want for your birth doesn't have to." },
      { q: "What should Colorado Springs families know about birth planning?", a: "Colorado Springs offers one of the most complete birth networks in the state — Level III NICU hospitals, a freestanding birth center, and Medicaid doula coverage. Specify your setting preference, altitude considerations, and TRICARE status in your birth plan. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> — local knowledge + a clear plan = confidence on birth day." }
    ],
    nearbyCities: ["denver-co"],
  },
  "augusta-ga": {
    city: "Augusta",
    state: "GA",
    slug: "augusta-ga",
    costLow: 1200,
    costHigh: 3500,
    shelbiServesHere: false,
    culture: "Augusta's birth community blends small-city Southern hospitality with the resources of a regional medical hub anchored by Augusta University. Doulas and midwives are active but the community is smaller than Atlanta's, making word-of-mouth referrals especially important.",
    heroLocalDetail: "Most Augusta births happen at hospitals along the 15th Street medical corridor near Augusta University, with Piedmont Augusta on Harper Street serving as the other major option. Families in Evans and Martinez drive 15–20 minutes across the Savannah River to reach these facilities, while South Augusta families have quicker access via Gordon Highway (US 78).",
    hospitalDetails: [
      { name: "Piedmont Augusta Hospital", paragraph: "Piedmont Augusta (formerly University Hospital) is a Level III NICU facility and the most popular birth hospital in the Augusta area, delivering over 3,000 babies annually. It offers private labor suites and a dedicated maternity wing with 24/7 neonatology coverage. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Augusta University Medical Center", paragraph: "Augusta University Medical Center features a Level IV NICU — the highest level in the region — and serves as the referral center for high-risk pregnancies across the CSRA. Its academic setting means MFM specialists and maternal-fetal medicine research are on-site, making it the go-to for complex births." },
      { name: "Doctors Hospital of Augusta", paragraph: "Doctors Hospital of Augusta provides labor and delivery services with a Level II NICU, serving families in western Augusta and Columbia County. It's known for a more intimate birth experience than the larger academic hospitals while still having neonatal support." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Augusta", paragraph: "NPI taxonomy 261QB0400X returned no active results for Augusta, GA. The closest freestanding birth centers are approximately 150 miles away in the Atlanta metro area (Intown Midwifery & Birth Center). Families seeking out-of-hospital birth should connect with local home birth midwives." }
    ],
    medicaidNote: "Georgia does not currently cover doula services through Medicaid. A doula coverage bill has been proposed in the Georgia legislature but has not been enacted as of 2025. Families using Medicaid in Augusta should explore community doula programs that offer sliding-scale fees or volunteer support.",
    insuranceNote: "Georgia does not have a state mandate requiring commercial insurance to cover doula services. Some plans may include birth center or doula benefits — check with your specific provider. The closest pathway to covered doula care is through community programs.",
    faqs: [
      { q: "Does Augusta have any freestanding birth centers?", a: "No. Augusta currently has no freestanding birth centers. Families seeking out-of-hospital birth work with home birth midwives or travel approximately 150 miles to Atlanta-area birth centers. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Which hospital in Augusta has the highest-level NICU?", a: "Augusta University Medical Center has a Level IV NICU, the highest in the region, making it the primary referral center for premature and high-risk infants. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does Georgia Medicaid pay for doula services in Augusta?", a: "Not yet — your state's Medicaid doesn't cover doulas right now. But that doesn't mean you're alone. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — no matter who's in the room with you, knowing what you want is your superpower." },
      { q: "Are there midwife-led birth options in Augusta?", a: "Yes. Certified nurse-midwives practice at both Piedmont Augusta and Augusta University Medical Center, and home birth midwives serve the greater Augusta area. Ask your provider directly about midwife-attended birth options — you might have more choices than you think." },
      { q: "How far is the nearest birth center from Augusta?", a: "The nearest freestanding birth centers are approximately 150 miles away in the Atlanta metro area — roughly a 2.5-hour drive. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "What's the average cost of a doula in Augusta?", a: "Doulas in Augusta typically charge $1,200–$3,500, depending on experience and package. Since Georgia Medicaid doesn't cover doulas, community programs are the main pathway for low-cost support." }
    ],
    nearbyCities: ["atlanta-ga", "savannah-ga", "greenville-sc"],
  },
  "fort-collins-co": {
    city: "Fort Collins",
    state: "CO",
    slug: "fort-collins-co",
    costLow: 1400,
    costHigh: 4000,
    shelbiServesHere: false,
    culture: "Fort Collins has a vibrant, progressive birth community shaped by its outdoorsy, wellness-oriented culture and proximity to Colorado State University. The city supports a strong network of doulas, lactation consultants, and midwives, with many families choosing birth center or home birth options alongside hospital delivery. Colorado's Medicaid doula coverage makes this one of the more affordable cities for supported birth.",
    heroLocalDetail: "Most Fort Collins births happen at UCHealth Poudre Valley Hospital on Lemay Avenue or Banner Health's North Colorado Medical Center in Greeley about 15 minutes south via US-287. Families in Old Town and the west side have quick access to PVH, while those in the southeastern Harmony Road corridor may find the drive to Greeley equally convenient.",
    hospitalDetails: [
      { name: "UCHealth Poudre Valley Hospital", paragraph: "UCHealth Poudre Valley Hospital is Fort Collins' primary birth hospital, featuring a Level III NICU and delivering over 2,500 babies annually. It offers spacious labor and delivery suites, midwifery integration, and a family-centered approach with 24/7 neonatology coverage. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to organize your preferences for PVH." },
      { name: "Banner North Colorado Medical Center (Greeley)", paragraph: "Located about 15 miles southeast in Greeley, Banner NCMC has a Level III NICU and serves as a secondary option for Fort Collins-area families, particularly those in the southeast part of the city. It provides full OB services and maternal-fetal medicine referrals." }
    ],
    birthCenterDetails: [
      { name: "Avalon Birth & Wellness Center", paragraph: "Avalon Birth & Wellness Center in Fort Collins operates as a freestanding birth center offering out-of-hospital birth in a home-like setting with certified nurse-midwives. It is one of the few birth centers in northern Colorado and serves families from Fort Collins, Loveland, and the surrounding region." }
    ],
    medicaidNote: "Colorado Health First (Medicaid) covers doula services under HB 23-1027, effective January 2024. Colorado Medicaid reimburses doulas up to $750 per pregnancy ($150 prenatal, $150 labor/delivery, $150 postpartum, plus $300 in extended postpartum visits). Doulas must register with the state as Medicaid providers.",
    insuranceNote: "Colorado is one of the few states where both Medicaid and some commercial insurers cover doula services. Colorado law also requires coverage for licensed midwife services at birth centers. Check your specific plan for doula and birth center benefits.",
    faqs: [
      { q: "Does Fort Collins have a freestanding birth center?", a: "Yes. Avalon Birth & Wellness Center operates as a freestanding birth center in Fort Collins, offering midwife-led births outside the hospital setting. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Which hospital in Fort Collins has a NICU?", a: "UCHealth Poudre Valley Hospital has a Level III NICU, providing care for premature and critically ill newborns in the Fort Collins area. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does Colorado Medicaid cover doula services in Fort Collins?", a: "Yes! Great news — Medicaid covers doula services in Fort Collins. This is thanks to HB 23-1027. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "How does altitude affect pregnancy in Fort Collins?", a: "At 4,976 feet, Fort Collins' altitude is moderate. Stay hydrated, discuss altitude concerns with your provider, and mention it in your birth plan. Most local providers are experienced with high-altitude prenatal care. Talk to your provider about what altitude means for your pregnancy — hydration and listening to your body matter even more here." },
      { q: "Are there home birth midwives in Fort Collins?", a: "Yes. Several certified professional midwives (CPMs) and certified nurse-midwives (CNMs) offer home birth services, supported by Colorado's licensure for out-of-hospital birth providers. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether home birth is right for you." },
      { q: "What's the average cost of a doula in Fort Collins?", a: "Doulas in Fort Collins typically charge $1,400–$4,000, with most around $2,200. Medicaid-covered doulas are available at no out-of-pocket cost to qualifying you and your family." }
    ],
    nearbyCities: ["denver-co", "colorado-springs-co"],
  },
  "spokane-wa": {
    city: "Spokane",
    state: "WA",
    slug: "spokane-wa",
    costLow: 1300,
    costHigh: 3800,
    shelbiServesHere: false,
    culture: "Spokane is the Inland Northwest's regional birth hub, with a tight-knit doula and midwife community that's smaller but deeply connected compared to Seattle. The city has a growing interest in evidence-based birth options and midwifery care, supported by organizations like the Inland Northwest Doula collective.",
    heroLocalDetail: "Spokane's major birth hospitals cluster along the Maple Street and Division Street corridors — Providence Sacred Heart on West 8th Avenue and MultiCare Deaconess on West 5th Avenue are just minutes apart on the South Hill. Families in Spokane Valley and Liberty Lake drive about 15–20 minutes west via I-90 to reach these facilities.",
    hospitalDetails: [
      { name: "Providence Sacred Heart Medical Center", paragraph: "Providence Sacred Heart is Spokane's largest birth hospital and features a Level IV NICU — the highest in the Inland Northwest — making it the regional referral center for high-risk pregnancies and premature infants. It delivers over 4,000 babies annually and offers MFM specialists, midwifery options, and a dedicated birth center unit. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your Sacred Heart delivery." },
      { name: "MultiCare Deaconess Hospital", paragraph: "MultiCare Deaconess Hospital provides labor and delivery services with a Level II NICU, serving families on Spokane's South Hill and surrounding areas. It offers comfortable private suites and a family-centered approach, with neonatology support for moderately complex births." },
      { name: "Kootenai Health (Coeur d'Alene, ID)", paragraph: "Just across the Idaho border about 35 miles east via I-90, Kootenai Health in Coeur d'Alene has a Level III NICU and serves many Spokane-area families, especially those in the Spokane Valley and Liberty Lake corridor. Verify insurance coverage for out-of-state care before choosing this option." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Spokane", paragraph: "NPI taxonomy 261QB0400X returned no active results for Spokane, WA. There are no freestanding birth centers in Spokane. Families seeking birth center care typically work with home birth midwives, as the nearest birth centers are approximately 280 miles west in the Seattle metro area." }
    ],
    medicaidNote: "Washington Apple Health (Medicaid) covers doula services. Under state rules effective 2024, Washington Medicaid reimburses enrolled doulas for prenatal, labor, and postpartum support. Washington also extended postpartum Medicaid coverage to 12 months, and has some of the most robust doula Medicaid coverage in the nation.",
    insuranceNote: "Washington State is among the most progressive for birth access — Medicaid covers doula care, and the state requires most insurance plans to cover midwifery and birth center services. Check your specific plan for doula benefits.",
    faqs: [
      { q: "Does Spokane have any freestanding birth centers?", a: "No. Spokane currently has no freestanding birth centers. Families interested in out-of-hospital birth typically hire home birth midwives, as the nearest birth centers are in the Seattle metro area, roughly 280 miles away. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Which Spokane hospital has the highest-level NICU?", a: "Providence Sacred Heart Medical Center has a Level IV NICU, the highest level available, serving as the regional referral center for the Inland Northwest's most critically ill newborns. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does Washington Medicaid cover doula services in Spokane?", a: "Yes! Great news — Medicaid covers doula services in Spokane. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "Can I give birth at Kootenai Health if I live in Spokane?", a: "Yes, many Spokane-area you and your family choose Kootenai Health in Coeur d'Alene, Idaho, about 35 miles east. It has a Level III NICU. Some Washington Medicaid plans may cover out-of-state care there, but verify coverage with your insurance first." },
      { q: "Are there home birth midwives in Spokane?", a: "Yes. Spokane has several licensed midwives (LMs and CPMs) offering home birth services, supported by Washington State's licensure framework for out-of-hospital birth providers. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether home birth is right for you." },
      { q: "What's the average cost of a doula in Spokane?", a: "Doulas in Spokane typically charge $1,300–$3,800, with most packages averaging around $2,000. Medicaid-covered doulas are available at no cost to qualifying you and your family through Apple Health." }
    ],
    nearbyCities: [],
  },
  "seattle-wa": {
    city: "Seattle",
    state: "WA",
    slug: "seattle-wa",
    costLow: 1500,
    costHigh: 4500,
    shelbiServesHere: false,
    publishedDate: "2026-06-04",
    enableBlogResources: true,
    lat: 47.6062,
    lng: -122.3321,
    heroImage: "/images/seattle-wa-birth-doula-skyline.webp",
    supportSceneImage: "/images/seattle-support-scene.webp",
    supportSceneAlt: "A doula walking alongside an expectant mom on a forested path with the Cascade Mountains in the distance: Seattle birth support",
    ogImage: "https://truejoybirthing.com/images/og-city-seattle-wa-v3.webp",
    midwifeInfo: {
      paragraph: "Washington licenses Certified Professional Midwives (CPMs) and Licensed Midwives (LMs), making home birth and birth center midwifery legally regulated and accessible statewide. That means if you're planning a home birth or birth center birth in {city}, your midwife operates under a state-issued license. On the hospital side, Certified Nurse-Midwives (CNMs) practice in all major Seattle hospitals, including Swedish First Hill and UW Medical Center, so hospital-based midwifery care is widely available for {city} families.",
      credentialTypes: " and LMs",
      credentialDetail: "In Washington, Licensed Midwives (LMs) are specifically licensed by the state to attend out-of-hospital births, giving",
    },
    culture: "Seattle is a powerhouse of progressive birth culture, with one of the highest rates of midwifery and out-of-hospital birth in the nation. The city's doulas, birth photographers, and community groups form a tight-knit ecosystem, and organizations like Perinatal Support Washington push relentlessly for equity and access. From Capitol Hill to Ballard, expecting families have no shortage of holistic and collaborative care options.",
    heroLocalDetail: "If you're giving birth in Seattle, your hospital experience likely centers on Pill Hill near Broadway and Jefferson, where UW Medical Center and Swedish First Hill sit blocks apart, or you might head to Eastlake for a birth-center vibe. Interstate 5 can be brutal during rush hour, so factor commute time from neighborhoods like West Seattle or Beacon Hill carefully when choosing your birth location.",
    hospitalDetails: [
      {
        name: "Swedish Medical Center First Hill",
        address: "747 Broadway, Seattle, WA 98122",
        thumbnail: "/images/seattle-swedish-first-hill.webp",
        paragraph: "The largest birthing hospital in Western Washington, delivering more babies annually than any other facility in the region. Swedish offers comprehensive OB/GYN and midwifery services with a Level III NICU, perinatologists for high-risk pregnancies, and their TeamBirth collaborative care model. If you're delivering at Swedish, having your birth plan ready helps you navigate a busy hospital that serves families from across the region. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started.",
        nicuLevel: "III",
        vbacPolicy: "Allows TOLAC/VBAC with physician approval",
        doulaPolicy: "Doulas welcome as support persons",
        midwifeFriendly: true,
        waterBirth: "Labor tubs available for hydrotherapy; water birth varies by provider",
        medicaid: true,
        lactation: true,
        privateRooms: true,
        url: "https://www.swedish.org/services/pregnancy-and-childbirth",
      },
      {
        name: "UW Medical Center – Montlake",
        address: "1959 NE Pacific Street, Seattle, WA 98195",
        thumbnail: "/images/seattle-uw-montlake.webp",
        paragraph: "The flagship academic medical center of UW Medicine, offering high-risk obstetrics, certified nurse midwifery services, and a Level III NICU with close partnership to Seattle Children's Hospital for the most complex neonatal cases. UW Medicine's midwifery program is one of the strongest in the region. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here.",
        nicuLevel: "III",
        vbacPolicy: "Allows TOLAC/VBAC, dedicated VBAC program with midwives",
        doulaPolicy: "Doulas welcome as support persons, integrated into care team",
        midwifeFriendly: true,
        waterBirth: "Labor tubs available for hydrotherapy; water birth not routinely offered per hospital protocol",
        medicaid: true,
        lactation: true,
        privateRooms: true,
        url: "https://www.uwmedicine.org/locations/uw-medical-center-montlake/birth-unit",
      },
      {
        name: "UW Medical Center – Northwest",
        address: "1550 N 115th Street, Seattle, WA 98133",
        thumbnail: "/images/seattle-uw-northwest.webp",
        paragraph: "A community-oriented hospital in north Seattle, part of UW Medicine since 2010, offering a family birth center with midwifery support and a Level II NICU for babies who need extra care.",
        nicuLevel: "II",
        vbacPolicy: "VBAC available with physician approval; discuss with your provider",
        doulaPolicy: "Doulas welcome as support persons",
        midwifeFriendly: true,
        medicaid: true,
        lactation: true,
        privateRooms: true,
        url: "https://www.uwmedicine.org/locations/uw-medical-center-northwest",
      },
      {
        name: "Overlake Medical Center & Clinics",
        address: "1035 116th Ave NE, Bellevue, WA 98004",
        thumbnail: "/images/seattle-overlake.webp",
        paragraph: "Serving Bellevue and the Eastside, Overlake features a Level III NICU and a well-regarded midwifery practice integrated into its family birth center, with private labor and delivery rooms.",
        nicuLevel: "III",
        vbacPolicy: "Allows TOLAC/VBAC with physician approval",
        doulaPolicy: "Doulas welcome as support persons",
        midwifeFriendly: true,
        medicaid: true,
        lactation: true,
        privateRooms: true,
        url: "https://www.overlakehospital.org",
      },
      {
        name: "Swedish Medical Center – Issaquah",
        address: "751 NE Blakely Drive, Issaquah, WA 98029",
        paragraph: "A growing suburban campus of Swedish offering a full birth center with labor and delivery services, midwifery care, and a Level II NICU, serving families on the Eastside and Sammamish Plateau.",
        nicuLevel: "II",
        vbacPolicy: "VBAC available with physician approval; consult your provider",
        doulaPolicy: "Doulas welcome as support persons",
        midwifeFriendly: true,
        medicaid: true,
        lactation: true,
        privateRooms: true,
        url: "https://www.swedish.org/services/pregnancy-and-childbirth",
      },
    ],
    birthCenterDetails: [
      {
        name: "Center for Birth",
        address: "1500 Eastlake Ave E, Seattle, WA 98102",
        paragraph: "Seattle's only nationally accredited (CABC) freestanding birth center, located in the Eastlake neighborhood. Founded in 2010, it offers spacious rooms with extra-deep soaking tubs for water birth, staffed by independent certified nurse-midwife practices, just minutes from Swedish First Hill's emergency backup.",
        credential: "CABC Accredited",
        services: ["Water Birth", "Prenatal Care", "Postpartum Care", "VBAC"],
        medicaid: true,
        url: "https://www.centerforbirth.com",
      },
      {
        name: "Puget Sound Birth Center",
        address: "13128 Totem Lake Blvd NE, Suite 101, Kirkland, WA 98034",
        paragraph: "A CABC-accredited freestanding birth center in Kirkland, serving Eastside and greater Puget Sound families for over 30 years. Licensed midwives attend both home and birth-center births, with over 6,000 babies welcomed since founding.",
        credential: "CABC Accredited",
        services: ["Water Birth", "Home Birth", "Prenatal Care", "Postpartum Care"],
        distance: "10 miles from Seattle",
        url: "https://www.birthcenter.com",
      },
    ],
    localDoulas: [
      {
        name: "Sharon Muza",
        credential: "CD/BDT(DONA), LCCE, FACCE",
        practice: "Sharon Muza",
        url: "https://sharonmuza.com",
        photo: "/images/doulas/sharon-muza.webp",
        description: "Lamaze-certified childbirth educator and DONA-certified birth doula trainer with over 20 years of experience and more than 670 births attended. Sharon serves Seattle families and trains birth professionals worldwide through DONA-approved doula training and Lamaze-accredited educator workshops.",
        costRange: "$3,800-$4,500",
        serviceArea: ["Seattle", "King County", "Ballard", "Wallingford", "Shoreline", "Edmonds", "Queen Anne", "West Seattle", "Mercer Island", "Lynnwood", "Everett"],
        services: ["Birth Doula", "Childbirth Education", "DONA Training", "Birth Tub Rental", "Lamaze CBE Training"],
        acceptsMedicaid: false,
        acceptingClients: true,
      },
      {
        name: "Jen Laird",
        credential: "Certified Birth & Postpartum Doula",
        practice: "Seattle Birth Doulas",
        url: "https://www.seattlebirthdoulas.com/jen-laird",
        photo: "/images/doulas/jen-laird.webp",
        description: "Certified birth and postpartum doula with 18+ years of experience and over 500 families supported. Jen founded Seattle Birth Doulas and provides ongoing mentorship and oversight to the collective, offering individualized, trauma-informed care with training from Seattle Midwifery School and midwifery study in New Zealand.",
        costRange: "$3,400",
        serviceArea: ["Seattle", "Greater Seattle area"],
        services: ["Birth Doula", "Postpartum Doula", "Childbirth Education"],
        acceptingClients: true,
      },
      {
        name: "Giulia",
        practice: "Seattle Gentle Beginnings",
        url: "https://www.seattlegentlebeginnings.com",
        description: "Postpartum doula and pediatric sleep consultant serving West Seattle and greater Seattle, with NAPS doula training and Sleep Counseling Institute certification. Giulia supports families throughout the Fourth Trimester with calm, evidence-based care including newborn feeding support, sleep education, and guidance in understanding newborn cues.",
        costRange: "$50/hr daytime, $65/hr nighttime",
        serviceArea: ["Seattle", "West Seattle"],
        services: ["Postpartum Doula", "Pediatric Sleep Consulting", "Newborn Feeding Support"],
        acceptingClients: true,
      },
      {
        name: "Hannah",
        credential: "DONA-Trained, WA State Certified",
        practice: "Seattle Doula Services",
        url: "https://www.seattledoulaservices.com",
        photo: "/images/doulas/hannah-sds.webp",
        description: "DONA-trained and Washington State Certified Doula serving families in the Greater Seattle area. Hannah brings over a decade of experience supporting children and families, and is trained in comfort measures including breathing techniques, positioning, and relaxation methods. She offers sliding-scale and pro bono doula support to ensure finances are never an obstacle.",
        costRange: "$2,100-$2,500",
        serviceArea: ["Seattle", "Greater Seattle area"],
        services: ["Birth Doula", "Postpartum Doula"],
        acceptingClients: true,
      },
      {
        name: "Kelly Reimer",
        credential: "NAPS Certified Postpartum Doula",
        practice: "Day by Day Doula Care",
        url: "https://www.daybydaydoula.com",
        photo: "/images/doulas/kelly-reimer.webp",
        description: "NAPS-certified postpartum doula providing in-home postpartum support in Seattle. Kelly offers empathetic, non-judgmental care drawing from her own experiences with traumatic birth and postpartum challenges, and holds certifications from Bastyr University, Perinatal Support Washington, and Red Cross First Aid/CPR.",
        costRange: "$65/hr (4-hr min), $4,680 for 6-week package",
        serviceArea: ["Seattle", "South Seattle", "West Seattle", "Mercer Island", "East Bellevue"],
        services: ["Postpartum Doula", "Newborn Care", "Lactation Support", "Sibling Care"],
        acceptsMedicaid: false,
        acceptingClients: true,
      },
      {
        name: "Brooke Prudhomme",
        credential: "CPM, LM",
        practice: "Sanctum by Brooke Prudhomme",
        url: "https://brookeprudhomme.com",
        photo: "/images/doulas/brooke-prudhomme.webp",
        isMidwife: true,
        description: "Certified Professional Midwife and Licensed Midwife offering home birth, VBAC, and holistic women's health care in Seattle. Brooke provides comprehensive midwifery care including home birth, integrative prenatal and postpartum care, fertility support, and water birth — with pricing plans for both comprehensive home birth and collaborative care with OB/GYNs.",
        serviceArea: ["Seattle", "Greater Seattle area"],
        services: ["Home Birth", "VBAC Support", "Water Birth", "Prenatal Care", "Postpartum Care", "Fertility Support"],
        acceptingClients: true,
      },
      {
        name: "Ceci C\u00f3rdova",
        credential: "CNM, ARNP",
        practice: "Full Moon Midwifery",
        url: "https://www.fullmoonmidwiferyseattle.com",
        isMidwife: true,
        description: "Certified Nurse Midwife with over 20 years of experience in hospitals, homes, and birth centers. Ceci offers full-spectrum midwifery care combining modern western medicine with traditional and spiritual healing, including Arvigo Maya Abdominal Massage, CranioSacral Therapy, home birth, and birth center birth in the greater Seattle area.",
        serviceArea: ["Seattle", "University District", "Greater Seattle area"],
        services: ["Home Birth", "Birth Center Birth", "Prenatal Care", "Postpartum Care", "CranioSacral Therapy", "Lactation Support", "Water Birth"],
        acceptingClients: true,
      },
    ],
    medicaidNote: "Yes — Washington Apple Health (Medicaid) covers doula services statewide. Doulas register with the Washington State Department of Health and bill through ProviderOne, with reimbursement of approximately $1,500 per birth package covering prenatal visits, labor support, and postpartum follow-up. Washington also extended postpartum Medicaid coverage to 12 months.",
    insuranceNote: "Washington State law requires commercial plans to cover midwifery and birth center services. Most Blue Cross, Regence, Aetna, and Molina plans in Washington include birth-center and home-birth benefits, though out-of-network doula reimbursement varies by carrier and plan tier.",
    faqs: [
      { q: "Does Medicaid cover doulas in Seattle?", a: "Yes. Washington Apple Health (Medicaid) covers doula services statewide, reimbursing approximately $1,500 per birth package that includes prenatal visits, labor support, and postpartum follow-up. Contact your Apple Health plan to confirm doula coverage details and find in-network providers." },
      { q: "Which Seattle hospital has the highest-level NICU?", a: "Swedish Medical Center First Hill and UW Medical Center Montlake both operate Level III NICUs. For the most complex cases, UW Medical Center partners with Seattle Children's Hospital for Level IV neonatal care. Swedish First Hill delivers more babies annually than any other hospital in the region." },
      { q: "Can I have a water birth in Seattle?", a: "Yes. The Center for Birth in Eastlake offers water birth in their freestanding birth center with extra-deep soaking tubs. Puget Sound Birth Center in Kirkland also offers water birth. Swedish First Hill supports water immersion during labor, though hospital water-birth policies vary, so ask your provider about specific options." },
      { q: "What does a doula cost in Seattle?", a: "Seattle birth doula fees typically range from $1,500 to $4,500, with most experienced doulas in the $2,000 to $3,000 range. Postpartum doulas run $35 to $65 per hour. If you have Apple Health (Medicaid), doula services are covered at approximately $1,500 per birth package." },
      { q: "Are birth centers in Seattle covered by insurance?", a: "Yes. Most Washington commercial plans and Apple Health (Medicaid) cover licensed birth center births. The Center for Birth in Eastlake is in-network with most major insurers and accepts Apple Health. Verify your specific plan's in-network status before booking." },
      { q: "How far are Seattle birth centers from hospital backup?", a: "The Center for Birth in Eastlake is approximately 5 minutes from Swedish First Hill by car. Puget Sound Birth Center in Kirkland is about 15 minutes from Overlake Medical Center in Bellevue. Factor in I-5 traffic during rush hour when planning your route." },
    ],
  nearbyCities: ["tacoma-wa", "spokane-wa", "portland-or"],
  },
  "tacoma-wa": {
    city: "Tacoma",
    state: "WA",
    slug: "tacoma-wa",
    lat: 47.2431,
    lng: -122.4531,
    costLow: 1200,
    costHigh: 3500,
    publishedDate: "2026-06-10",
    shelbiServesHere: false,
    heroImage: "/images/tacoma-wa-birth-doula-skyline.webp",
    enableBlogResources: true,
    supportSceneAlt: "A doula walking alongside an expectant mom: Tacoma birth support",
    ogImage: "https://truejoybirthing.com/images/og-city-tacoma-wa.webp",
    midwifeInfo: {
      paragraph: "Washington licenses Certified Professional Midwives (CPMs) and Licensed Midwives (LMs), making home birth and birth center midwifery legally regulated and accessible statewide. That means if you're planning a home birth or birth center birth in Tacoma, your midwife operates under a state-issued license, not in a legal gray area. On the hospital side, Certified Nurse-Midwives (CNMs) practice in Tacoma's major hospitals, including Tacoma General and St. Joseph's, so hospital-based midwifery care is widely available.",
      credentialTypes: " (CPMs and LMs)",
      credentialDetail: "In Washington, Licensed Midwives (LMs) are specifically licensed by the state to attend out-of-hospital births, giving",
    },
    culture: "Tacoma's birth community is growing and increasingly vocal, supported by grassroots networks of doulas and midwives committed to closing Pierce County's maternal health disparities. The city blends military families from Joint Base Lewis-McChord with a thriving arts-and-activism scene that centers reproductive justice. Local organizations like the Tacoma-Pierce County Health Department's perinatal programs work to connect families with equitable, culturally appropriate care.",
    heroLocalDetail: "Most Tacoma families deliver at Tacoma General near Wright Park and 6th Avenue, or at St. Joseph's just up the hill on South J Street near Stadium District. If you're commuting from Puyallup or Lakewood, factor in SR-16 and I-5 interchange congestion — it can add 20+ minutes during afternoon rush, which matters when you're in active labor.",
    hospitalDetails: [
      { name: "Tacoma General Hospital – MultiCare", paragraph: "Pierce County's largest birth hospital with a Level III NICU and a full midwifery practice, serving roughly 4,000 deliveries per year. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "St. Joseph Medical Center – Virginia Mason Franciscan", paragraph: "A Level III NICU hospital on Tacoma's Hilltop offering maternal-fetal medicine, a collaborative midwifery program, and a redesigned family birth unit." },
      { name: "Good Samaritan Hospital – MultiCare (Puyallup)", paragraph: "Located just east of Tacoma in Puyallup, Good Sam features a Level II NICU and a well-regarded midwifery-integrated birth unit." }
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned no active results for Tacoma, WA (verified 2026-06-10)
    birthCenterDetails: [
    ],
    localDoulas: [
      { name: "Katie Pumphrey", credential: "Birth Doula", practice: "MamaEarth Doula", url: "https://www.mamaearthdoula.com", acceptsMedicaid: true, services: ["Postpartum", "Breastfeeding Support", "Childbirth Education"] },
      { name: "Deb Crawford", credential: "Birth Doula, Postpartum Doula, Sleep Doula", practice: "Doula Deb LLC", url: "http://www.douladeb.com", services: ["Sleep Coaching", "Overnight Care"] },
      { name: "Adrianne Buyer", credential: "Birth Doula", practice: "Adrianne Buyer Birth Doula", url: "https://adriannebuyer.com", acceptsMedicaid: true, services: ["Postpartum", "Lactation"] },
      { name: "Kristin Lanning", credential: "Birth Doula, Postpartum Doula", practice: "Called To Birth Doulas & Birth Services", url: "https://www.calledtobirth.com", acceptsMedicaid: true, services: ["Childbirth Education", "Lactation"] },
      { name: "Allie Wright", credential: "Birth Doula", practice: "Alma Birth Doula", url: "http://almabirthdoula.com", services: ["Postpartum", "Prenatal Care"] },
      { name: "Compass Doula & Lactation PLLC", credential: "Birth Doula, Lactation Consultant", practice: "Compass Doula & Lactation", url: "https://www.compassdoulas.com", acceptsMedicaid: true, services: ["Postpartum", "Breastfeeding Support"] },
      { name: "Jennifer Ruggles", credential: "Birth Doula", practice: "Jennifer Ruggles Doula Services", url: "http://www.jennrugglesdoula.com", acceptsMedicaid: true, services: ["Postpartum"] },
      { name: "Little Mitzvah Doula Care", credential: "Birth Doula, Postpartum Doula", practice: "Little Mitzvah Doula Care", url: "https://www.littlemitzvahdoulacare.com", services: ["Overnight Care"] },
    ],
    medicaidNote: "Yes \u2014 Washington Apple Health (Medicaid) covers doula services statewide, including Pierce County. Doulas must register with the Washington State Department of Health and bill through ProviderOne, with reimbursement of approximately $1,500 per birth package covering prenatal visits, labor support, and postpartum follow-up.",
    insuranceNote: "Washington requires commercial insurance to cover midwifery and birth center care. Regence, Premera, Molina, and Aetna plans sold in Pierce County generally include these benefits, but doula reimbursement varies by plan tier and network status.",
    faqs: [
      { q: "Does Medicaid cover doulas in Tacoma?", a: "Yes! Great news \u2014 Medicaid covers doula services in Tacoma. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" \u2014 they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "What NICU level does Tacoma General have?", a: "Tacoma General has a Level III NICU capable of caring for babies born as early as 28 weeks, with 24/7 neonatal nurse practitioners and transfer protocols to UW's Level IV NICU in Seattle. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there any freestanding birth centers in Tacoma?", a: "No. Tacoma does not have a licensed freestanding birth center. Families seeking a birth-center experience typically travel to Seattle's Center for Birth or arrange a home birth with a licensed midwife. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "What's the average cost of a doula in Tacoma?", a: "Tacoma doula fees generally range from $1,200 to $3,500, slightly lower than Seattle rates. Postpartum doulas typically charge $30\u2013$50 per hour." },
      { q: "Can I give birth at JBLM (Joint Base Lewis-McChord)?", a: "Madigan Army Medical Center at JBLM serves active-duty and TRICARE-eligible military families like yours with a Level III NICU and full obstetric services, including a midwifery program for eligible beneficiaries. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> \u2014 military life means plans change, but knowing what you want for your birth doesn't have to." },
      { q: "How far is the drive to Seattle for a Level IV NICU?", a: "UW Medical Center's Level IV NICU is approximately 35 miles from downtown Tacoma, typically a 45\u201360 minute drive via I-5 \u2014 longer during peak commute times. Knowing your drive time before you're in labor takes one more worry off your plate." }
    ],
    nearbyCities: ["seattle-wa", "spokane-wa"],
  },
  "sacramento-ca": {
    city: "Sacramento",
    state: "CA",
    slug: "sacramento-ca",
    costLow: 1500,
    costHigh: 4000,
    shelbiServesHere: false,
    culture: "Sacramento's birth culture is shaped by the city's diversity and its role as California's policy hub, where Medi-Cal expansions and doula legislation are debated blocks from where families give birth. The region has a strong community of Latina and Black doulas addressing perinatal inequities, and midwifery is steadily gaining visibility despite California's historically tight birth-center licensing. From Oak Park to Natomas, Sacramento families are building more options than ever before.",
    heroLocalDetail: "Sacramento's main birth hospitals cluster along Stockton Boulevard and J Street — UC Davis Health sits at the top of Stockton near Elmhurst, while Sutter Medical Center anchors midtown near 28th and Capitol Avenue. Families in Natomas or Elk Grove should map their route down I-5 or Highway 99 well in advance, as the Business 80/US-50 interchange near Cal Expo can back up severely during commute hours.",
    hospitalDetails: [
      { name: "UC Davis Medical Center", paragraph: "Sacramento's only Level IV NICU hospital, also home to the region's top maternal-fetal medicine program and a collaborative midwifery service that handles high-risk and low-risk deliveries alike. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Sutter Medical Center, Sacramento", paragraph: "Located in midtown with a Level III NICU, Sutter offers a well-established midwifery program, private birth suites, and a strong reputation for family-centered obstetric care." },
      { name: "Mercy General Hospital – Dignity Health", paragraph: "A midtown Sacramento staple near Folsom Boulevard with a Level II NICU, known for its compassionate nursing staff and a smaller, more intimate labor-and-delivery floor." },
      { name: "Kaiser Permanente Sacramento Medical Center", paragraph: "Situated on Morse Avenue south of Cal Expo, Kaiser Sacramento features a Level III NICU and full OB services, primarily serving Kaiser HMO members." }
    ],
    birthCenterDetails: [
      { name: "No licensed birth centers in Sacramento", paragraph: "NPI taxonomy 261QB0400X returned no active results for Sacramento, CA. Sacramento does not currently have a licensed freestanding birth center. Families seeking birth-center care typically travel to the San Francisco Bay Area or arrange home births with California Licensed Midwives (CLMs)." }
    ],
    medicaidNote: "California's Medi-Cal covers doula services statewide as of January 2023 under SB-509. Reimbursement is approximately $1,587 per birth package, including prenatal visits, labor support, and postpartum visits. Doulas must enroll as Medi-Cal providers through the Department of Health Care Services (DHCS) and bill via the PAVE portal.",
    insuranceNote: "California law (SB 332) requires most commercial plans to cover licensed midwife and birth center care. Covered California marketplace plans and large-group plans must include these benefits, though out-of-network doula reimbursement still varies widely by carrier and plan type.",
    faqs: [
      { q: "Does Medi-Cal cover doulas in Sacramento?", a: "Yes! Great news — Medicaid covers doula services in Sacramento. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "Which Sacramento hospital has the highest-level NICU?", a: "UC Davis Medical Center on Stockton Boulevard operates the region's only Level IV NICU, providing the highest level of neonatal care and 24/7 neonatologist coverage. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there any birth centers in Sacramento?", a: "No. Sacramento does not currently have a licensed freestanding birth center. Families can pursue home birth with a California Licensed Midwife (CLM) or travel to the Bay Area for birth-center options. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "What's the average cost of a doula in Sacramento?", a: "Sacramento doula fees typically range from $1,500 to $4,000 for a birth package, with most experienced doulas in the $2,000–$3,000 range. Medi-Cal covers doulas at no cost to eligible you and your family." },
      { q: "Does Kaiser Sacramento allow doulas?", a: "Yes. Kaiser Permanente Sacramento permits doulas in the labor and delivery room, though they are not employed by Kaiser. Families hire independent doulas; some Kaiser plans may offer partial reimbursement for out-of-network doula services. Call your insurance and ask directly: \"Do you cover doula services?\" That one phone call gets you a clear answer." },
      { q: "How long is the drive from Elk Grove to Sacramento hospitals?", a: "Elk Grove to UC Davis Medical Center is roughly 20 miles via Highway 99, typically 25–35 minutes outside rush hour but potentially 45–60 minutes during peak commute times on the 99 corridor. Knowing your drive time before you're in labor takes one more worry off your plate." }
    ],
    nearbyCities: [],
  },
  "san-diego-ca": {
    city: "San Diego",
    state: "CA",
    slug: "san-diego-ca",
    costLow: 1500,
    costHigh: 4500,
    shelbiServesHere: false,
    culture: "San Diego's birth community thrives with a strong network of doulas, midwives, and lactation consultants who embrace the region's outdoor, wellness-oriented lifestyle. Home birth and birth center options are well-established, supported by active organizations like the San Diego Birth Network. The city's diverse population means culturally centered care is available, with Spanish-speaking doulas and providers particularly prominent.",
    heroLocalDetail: "San Diego families navigating birth often coordinate between Hillcrest-area hospitals like UCSD Jacobs Medical Center and the birth centers clustered in Normal Heights and North Park. Traffic along the I-805 and SR-163 corridors can add 20+ minutes to hospital runs from inland communities like Rancho Penasquitos or Chula Vista, so proximity planning along the Friars Road and Mission Valley routes matters for labor-day logistics.",
    hospitalDetails: [
      { name: "UCSD Jacobs Medical Center", paragraph: "UCSD Jacobs Medical Center in La Jolla features a Level IV NICU — the highest level of neonatal care — and is San Diego's premier academic medical center for high-risk pregnancies. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Sharp Mary Birch Hospital for Women & Newborns", paragraph: "Sharp Mary Birch in Santee is one of the largest freestanding women's hospitals in the nation, with a Level III NICU and over 17,000 births annually, offering specialized maternal-fetal medicine." },
      { name: "Scripps Mercy Hospital San Diego", paragraph: "Scripps Mercy Hospital in Hillcrest provides a Level III NICU and serves as a major teaching hospital with comprehensive obstetric and neonatal services in central San Diego." },
      { name: "Palomar Medical Center Escondido", paragraph: "Palomar Medical Center in Escondido offers a Level II NICU with family-centered maternity care serving North County Inland families." }
    ],
    birthCenterDetails: [
      { name: "San Diego Birth Center", paragraph: "The San Diego Birth Center in Normal Heights is a CABC-accredited freestanding birth center staffed by certified nurse-midwives offering water birth, VBAC, and holistic prenatal care in a home-like setting." },
      { name: "Best Start Birth Center", paragraph: "Best Start Birth Center in Kearny Mesa provides midwife-led birth services including water birth with transfer agreements to nearby hospitals." }
    ],
    medicaidNote: "California Medi-Cal covers doula services under SB-509, with a birth package reimbursement of approximately $1,587. Doulas must enroll through the PAVE portal to bill Medi-Cal directly. Contact your managed care plan (Community Health Group, Health Net, or Blue Shield Promise) for referral details.",
    insuranceNote: "Under California SB 332, commercial health plans are required to cover doula services and midwifery care. Check with your insurer for in-network doula providers and prior authorization requirements.",
    faqs: [
      { q: "Can I get a free doula through Medi-Cal in San Diego?", a: "Yes. Medi-Cal covers doula services under SB-509 at approximately $1,587 for the full birth package. Enrolled doulas bill through the PAVE portal — ask your Medi-Cal managed care plan for a referral list. Call your plan and ask specifically about doula coverage — you might be surprised at what's covered." },
      { q: "Which San Diego hospitals have the highest-level NICU?", a: "UCSD Jacobs Medical Center in La Jolla has a Level IV NICU, the highest designation in California, capable of caring for the most complex and premature newborns. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there freestanding birth centers in San Diego?", a: "Yes. San Diego Birth Center in Normal Heights and Best Start Birth Center in Kearny Mesa both offer out-of-hospital birth with certified nurse-midwives, water birth options, and hospital transfer agreements. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "How much does a doula cost in San Diego without insurance?", a: "Expect to pay $1,500 to $4,500, for a doula in San Diego. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Sharp Mary Birch support VBAC deliveries?", a: "Yes. Sharp Mary Birch Hospital for Women & Newborns supports VBAC (Vaginal Birth After Cesarean) with their maternal-fetal medicine team, though eligibility depends on your specific clinical situation. If you're hoping for a VBAC, talk to your provider early and bring your birth plan — knowing your options is your right." },
      { q: "What if I live in North County — which hospital is closest?", a: "Palomar Medical Center in Escondido (Level II NICU) and Tri-City Medical Center in Oceanside serve North County you and your family. For a Level III or IV NICU, the drive to Scripps Mercy or UCSD is typically 30–45 minutes depending on traffic." }
    ],
    nearbyCities: ["los-angeles-ca"],
  },
  "fresno-ca": {
    city: "Fresno",
    state: "CA",
    slug: "fresno-ca",
    costLow: 1000,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Fresno's birth community blends Central Valley pragmatism with a growing network of doulas and midwives who are expanding access to culturally responsive care. The diverse Hmong, Latino, and Black communities in Fresno have driven grassroots doula training programs and community-based birth support. Resource gaps exist compared to coastal cities, but organizations like the Fresno Birth Network are working to bridge them.",
    heroLocalDetail: "Fresno families typically deliver at one of the hospitals along the Cedar Avenue medical corridor, with Community Regional Medical Center downtown and Clovis Community Medical Center in northeast Fresno as the main options. Commutes from west Fresno or Kerman along Highway 180 can stretch to 30+ minutes during peak hours, so families in outlying areas like Sanger or Selma should plan alternate routes to avoid Hwy 99 congestion.",
    hospitalDetails: [
      { name: "Community Regional Medical Center", paragraph: "Community Regional Medical Center in downtown Fresno is the region's largest hospital, with a Level III NICU and the only high-risk obstetric program between Sacramento and Bakersfield. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Clovis Community Medical Center", paragraph: "Clovis Community Medical Center in northeast Fresno features a Level II NICU, private labor suites, and a family-centered birth experience popular with families in the Clovis and north Fresno area." },
      { name: "Saint Agnes Medical Center", paragraph: "Saint Agnes Medical Center in northeast Fresno offers a Level II NICU with a dedicated maternity unit and lactation services, serving families across the greater Fresno metro area." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Fresno", paragraph: "NPI taxonomy 261QB0400X returned no active results for Fresno, CA. There are currently no freestanding birth centers operating in Fresno. Families seeking out-of-hospital birth work with home birth midwives; the closest birth center options are in the Sacramento or Bay Area." }
    ],
    medicaidNote: "California Medi-Cal covers doula services under SB-509, with approximately $1,587 reimbursement for the birth package. Doulas must enroll through the PAVE portal. In Fresno, Medi-Cal managed care plans include CalViva Health and Health Net — contact them for doula referral lists.",
    insuranceNote: "Under California SB 332, commercial health plans must cover doula services. Given the limited supply of doulas in Fresno, ask your insurer about out-of-network coverage or telehealth doula options if in-network providers are unavailable.",
    faqs: [
      { q: "Can I get a free doula through Medi-Cal in Fresno?", a: "Yes. Medi-Cal covers doula services under SB-509 at approximately $1,587 for the birth package. Contact CalViva Health or Health Net (Fresno's Medi-Cal managed care plans) for an enrolled doula referral list." },
      { q: "Does Fresno have any freestanding birth centers?", a: "No. There are currently no freestanding birth centers in Fresno. Families interested in out-of-hospital birth typically work with home birth midwives, though options are limited in the Central Valley. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Which Fresno hospital has the highest-level NICU?", a: "Community Regional Medical Center downtown has a Level III NICU — the highest in the Fresno area — and provides the region's most comprehensive neonatal and high-risk obstetric care. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "How much does a doula cost in Fresno?", a: "Expect to pay $1,000 to $3,000, for a doula in Fresno. The local doula community here is smaller than in big metros, so start your search early. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Are there Spanish-speaking doulas in Fresno?", a: "Yes! Fresno has bilingual doulas — and if you're more comfortable in another language, that support is out there. Ask when you interview: \"Do you offer support in my language?\" is a great question to start with." },
      { q: "What if I live in a rural area outside Fresno?", a: "Families in rural communities like Sanger, Selma, Kerman, or Reedley should plan hospital routes carefully — Community Regional is the only Level III NICU option, and travel times along Hwy 99 or Hwy 180 can vary significantly during peak hours. If you're outside the city, virtual doula support and the <a href=\"/birth-plan-template/\">free birth plan app</a> can help you prepare no matter your distance." }
    ],
    nearbyCities: ["sacramento-ca"],
  },
  "los-angeles-ca": {
    city: "Los Angeles",
    state: "CA",
    slug: "los-angeles-ca",
    costLow: 1800,
    costHigh: 5500,
    shelbiServesHere: false,
    culture: "Los Angeles has one of the largest and most diverse birth communities in the country, spanning from celebrity-endorsed boutique doulas to grassroots organizations providing free culturally centered care in South LA and the Eastside. The city's sheer size creates distinct birth microcultures — Silver Lake and Pasadena families often choose birth centers, while Westside families gravitate toward Cedars-Sinai and UCLA. Organizations like the Los Angeles Doula Project and SQUATS are expanding access for underserved communities.",
    heroLocalDetail: "Navigating birth logistics in LA means factoring in notorious traffic on the 405, 10, and 101 freeways — a 10-mile hospital trip from Venice to Cedars-Sinai can take 20 minutes or over an hour depending on the time of day. Families in the San Fernando Valley typically deliver at Providence Tarzana or Northridge Hospital, while Eastside families use White Memorial or USC Verdugo Hills, and South LA families rely on Centinela or Martin Luther King Jr. Community Hospital.",
    hospitalDetails: [
      { name: "Cedars-Sinai Medical Center", paragraph: "Cedars-Sinai in Mid-City Los Angeles features a Level IV NICU and is one of the top-ranked hospitals in the nation for obstetric care, with a dedicated maternal-fetal medicine program. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "UCLA Ronald Reagan Medical Center", paragraph: "UCLA Medical Center in Westwood offers a Level III NICU with world-class maternal-fetal medicine specialists and is a top choice for high-risk pregnancies on LA's Westside." },
      { name: "Kaiser Permanente West LA Medical Center", paragraph: "Kaiser West LA in Mid-City provides a Level III NICU with integrated OB-midwifery care and is popular with Kaiser members across central and west Los Angeles." },
      { name: "Providence Cedars-Sinai Tarzana Medical Center", paragraph: "Providence Tarzana in the San Fernando Valley offers a Level III NICU and is the primary destination for Valley families needing high-level neonatal care close to home." },
      { name: "Martin Luther King Jr. Community Hospital", paragraph: "MLK Community Hospital in Willowbrook serves South LA with a Level III NICU and is a critical access point for families in communities that historically lacked quality maternity care." }
    ],
    birthCenterDetails: [
      { name: "The Birth Sanctuary", paragraph: "The Birth Sanctuary in Pasadena is a freestanding birth center offering midwife-led births, water birth, and holistic prenatal care with transfer agreements to nearby hospitals." },
      { name: "Gracefull Birth Center", paragraph: "Gracefull Birth Center in Silver Lake provides a warm, community-rooted out-of-hospital birth experience with certified midwives, water birth tubs, and a strong commitment to equitable care." }
    ],
    medicaidNote: "California Medi-Cal covers doula services under SB-509, with approximately $1,587 reimbursement for the birth package. Doulas must enroll through the PAVE portal. LA County Medi-Cal managed care plans include L.A. Care, Health Net, and Molina Healthcare — contact your plan for doula referral lists.",
    insuranceNote: "Under California SB 332, commercial health plans must cover doula services. In LA, many doulas are familiar with billing Blue Shield of CA, Anthem, and Cigna, but always confirm your plan's specific authorization requirements.",
    faqs: [
      { q: "Can I get a free doula through Medi-Cal in Los Angeles?", a: "Yes. Medi-Cal covers doula services under SB-509 at approximately $1,587 for the birth package. Enrolled doulas bill through the PAVE portal. Contact your Medi-Cal managed care plan (L.A. Care, Health Net, or Molina) for their doula provider directory." },
      { q: "Which LA hospitals have a Level IV NICU?", a: "Cedars-Sinai Medical Center in Mid-City Los Angeles has a Level IV NICU — the highest designation. UCLA Ronald Reagan (Level III) and Children's Hospital Los Angeles also provide top-tier neonatal care. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Los Angeles?", a: "Yes. LA has several freestanding birth centers including Gracefull Birth Center in Silver Lake and The Birth Sanctuary in Pasadena, both staffed by certified midwives with water birth options and hospital transfer agreements. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "How do I handle LA traffic on labor day?", a: "Plan at least two hospital routes and drive them in advance. Avoid the 405 and 101 freeways during rush hours (7–10 AM and 4–7 PM). If you're delivering at Cedars-Sinai from the Westside, San Vicente Blvd access can save time. Always call your doula early so they can help navigate real-time traffic. Drive your route to the hospital before 38 weeks — in traffic, the last thing you need is a navigation surprise." },
      { q: "How much does a doula cost in LA without insurance?", a: "Expect to pay $1,800 to $5,500, for a doula in Los Angeles. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Are there doulas who specifically serve South LA communities?", a: "Yes. Organizations like the LA Doula Project, Cherished Futures for Black Moms & Babies, and SQUATS provide or connect you with culturally centered, often free or low-cost doula care in South LA and surrounding communities. You can also use the True Joy Birthing app to find local doulas — start there and interview a few until one clicks." }
    ],
    nearbyCities: ["san-diego-ca"],
  },
  "portland-or": {
    city: "Portland",
    state: "OR",
    slug: "portland-or",
    costLow: 1500,
    costHigh: 4500,
    shelbiServesHere: false,
    culture: "Portland is a birth-culture stronghold — home to one of the highest rates of out-of-hospital birth in the U.S. and a deep community of home-birth midwives, doulas, and birth photographers. The city's progressive, wellness-forward ethos means families routinely choose birth centers and home births, and hospitals here are accustomed to collaborative care models with community midwives.",
    heroLocalDetail: "From the leafy streets of Sellwood-Moreland to the bustling corridors along SE Hawthorne Blvd and NE Alberta Street, Portland families have their pick of midwifery practices, birth centers, and hospital options — all within a quick drive across the Willamette River via the bridges that connect the east and west sides.",
    hospitalDetails: [
      { name: "OHSU Hospital", paragraph: "Oregon Health & Science University on Marquam Hill is the state's only Level IV NICU and the premier referral center for high-risk pregnancies and neonatal emergencies. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your OHSU delivery." },
      { name: "Providence St. Vincent Medical Center", paragraph: "Providence St. Vincent in Beaverton offers a Level III NICU and a well-regarded maternity program with private labor suites and 24/7 OB and anesthesiology coverage." },
      { name: "Legacy Emanuel Medical Center", paragraph: "Legacy Emanuel in Northeast Portland provides a Level III NICU alongside a family birth center known for supporting physiologic birth and midwifery-friendly protocols." }
    ],
    birthCenterDetails: [
      { name: "Andaluz Birth Center", paragraph: "Andaluz Birth Center in the Tualatin area just south of Portland offers waterbirth, midwifery-led care, and a home-like freestanding birth center setting with transfer agreements to nearby hospitals." }
    ],
    medicaidNote: "Oregon Health Plan (OHP) covers doula services for Medicaid members. OHP reimburses doulas through Coordinated Care Organizations (CCOs) for prenatal visits, labor and delivery support, and postpartum care. Reimbursement rates vary by CCO — check with your CCO or the Oregon Health Authority for current fee schedules and enrollment requirements.",
    insuranceNote: "Oregon requires coverage of midwifery services, and most major plans in Portland cover birth center and home-birth deliveries under licensed midwives. Verify out-of-network doula coverage with your specific plan.",
    faqs: [
      { q: "How much does a doula cost in Portland?", a: "Expect to pay $1,500 to $4,500, for a doula in Portland. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does OHP cover birth center deliveries in Portland?", a: "Yes! Great news — Medicaid covers doula services in Portland. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "Which Portland hospital has the highest-level NICU?", a: "OHSU Hospital operates the only Level IV NICU in Oregon, making it the top referral destination for extremely premature or medically complex newborns. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Can I have a waterbirth in Portland?", a: "Waterbirth is available at Andaluz Birth Center and through home birth midwives. OHSU and most Portland hospitals do not permit waterbirth in their labor tubs, though hydrotherapy for labor is widely supported. Ask your provider about water birth options — and if they say no, it's okay to ask for a second opinion." },
      { q: "How do I find an OHP-covered doula in Portland?", a: "Search the Oregon Health Authority's provider directory or ask your CCO care coordinator for a list of enrolled doulas. Many Portland doulas are registering as OHP providers as the program expands." },
      { q: "Is home birth legal in Oregon?", a: "Yes. Oregon licenses direct-entry midwives (LDMs) and certified nurse-midwives (CNMs) who attend home births. Home birth is a legally recognized, covered option under many insurance plans. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether home birth is right for you." }
    ],
    nearbyCities: ["seattle-wa", "eugene-or"],
  },
  "eugene-or": {
    city: "Eugene",
    state: "OR",
    slug: "eugene-or",
    costLow: 1000,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Eugene's birth culture mirrors the city's laid-back, nature-oriented ethos — many families seek midwifery care, home births, and birth center options, and the local midwifery community is tight-knit and well-established. The University of Oregon influence brings younger families and progressive attitudes toward informed-choice, low-intervention birth.",
    heroLocalDetail: "Nestled in the Willamette Valley along the banks of the Willamette River near Alton Baker Park, Eugene families often choose birth practices centered around the Friendly Street neighborhood and the South Willamette corridor, with easy access to both Sacred Heart and McKenzie-Willamette hospitals in neighboring Springfield.",
    hospitalDetails: [
      { name: "PeaceHealth Sacred Heart Medical Center at RiverBend", paragraph: "PeaceHealth Sacred Heart RiverBend in Springfield is the region's largest hospital and operates a Level III NICU, serving as the primary high-risk referral center for Lane County and southern Oregon. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to organize your preferences for a Sacred Heart delivery." },
      { name: "McKenzie-Willamette Medical Center", paragraph: "McKenzie-Willamette in Springfield offers a Level II NICU, private labor and delivery suites, and a midwifery-friendly environment that supports low-intervention birth when clinically appropriate." }
    ],
    birthCenterDetails: [
      { name: "Eugene Birth Center", paragraph: "Eugene Birth Center provides midwifery-led, out-of-hospital birth services in a freestanding setting, offering waterbirth and holistic prenatal and postpartum care to Eugene-area families." }
    ],
    medicaidNote: "Oregon Health Plan (OHP) covers doula services for Medicaid members in Eugene just as it does statewide. Doulas bill through Coordinated Care Organizations (CCOs) — Lane County's CCO is Trillium Community Health Plan. Contact Trillium or the Oregon Health Authority for enrollment and reimbursement details.",
    insuranceNote: "Oregon law requires insurance coverage for licensed midwifery services, including birth center and home births. Most major carriers in the Eugene market cover CNM-attended hospital and birth center deliveries; verify your plan's coverage for out-of-hospital birth and doula services.",
    faqs: [
      { q: "How much does a doula cost in Eugene?", a: "Expect to pay $1,000 to $3,000 for a doula in Eugene. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Eugene have a birth center?", a: "Yes. The Eugene Birth Center offers freestanding, midwifery-led birth services including waterbirth. It is one of the few freestanding birth centers in the southern Willamette Valley. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Which hospital in Eugene has a NICU?", a: "PeaceHealth Sacred Heart Medical Center at RiverBend has a Level III NICU, the highest level in the region. McKenzie-Willamette Medical Center operates a Level II NICU. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Is waterbirth available in Eugene?", a: "Yes. Waterbirth is available at the Eugene Birth Center and through some home-birth midwives. The local hospitals generally offer hydrotherapy for labor but do not permit underwater delivery. Ask your provider about water birth options — and if they say no, it's okay to ask for a second opinion." },
      { q: "Can I use OHP for a birth center delivery in Eugene?", a: "Yes. OHP covers births at licensed birth centers with enrolled providers. Confirm with Trillium Community Health Plan that the Eugene Birth Center is in-network. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "How far is Eugene from Portland for specialized care?", a: "Eugene is roughly 110 miles south of Portland — about a two-hour drive. Families with high-risk pregnancies requiring a Level IV NICU would be referred to OHSU in Portland. Knowing your drive time before you're in labor takes one more worry off your plate." }
    ],
    nearbyCities: ["portland-or", "seattle-wa"],
  },
  "las-vegas-nv": {
    city: "Las Vegas",
    state: "NV",
    slug: "las-vegas-nv",
    costLow: 1200,
    costHigh: 3500,
    shelbiServesHere: false,
    culture: "Las Vegas has a growing but still relatively small community of doulas and midwives compared to its population. The city's transient, fast-paced character means many families default to hospital birth, but a dedicated network of birth workers is steadily expanding out-of-hospital options and advocating for more choices in the valley.",
    heroLocalDetail: "From the master-planned streets of Summerlin near Red Rock Canyon to the family-friendly neighborhoods of Henderson along Eastern Avenue, Las Vegas families navigate birth options across a sprawling desert metro with hospitals clustered along the US-95 and I-15 corridors. Traffic on the I-215 beltway can add significant time, so map your hospital route before week 36.",
    hospitalDetails: [
      { name: "Sunrise Hospital & Medical Center", paragraph: "Sunrise Hospital on Maryland Parkway operates a Level III NICU and is southern Nevada's largest and most established maternity center, handling the highest volume of deliveries in the Las Vegas Valley. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your Sunrise delivery." },
      { name: "University Medical Center (UMC)", paragraph: "UMC near the medical district on Shadow Lane provides a Level III NICU and serves as the valley's safety-net hospital with a strong high-risk obstetrics program and 24/7 neonatal specialist coverage." },
      { name: "Summerlin Hospital Medical Center", paragraph: "Summerlin Hospital in the Town Center Drive area offers a Level III NICU and modern maternity suites, serving the fast-growing Summerlin and west Las Vegas communities." },
      { name: "Centennial Hills Hospital", paragraph: "Centennial Hills Hospital in the northwest valley has a Level II NICU and family-centered maternity care, a convenient option for families in the far-northwest suburbs." }
    ],
    birthCenterDetails: [
      { name: "No freestanding birth centers in Las Vegas", paragraph: "NPI taxonomy 261QB0400X returned no active results for Las Vegas, NV. There are no freestanding birth centers in the Las Vegas Valley. Families seeking out-of-hospital birth work with home-birth midwives; the nearest birth center options are in Southern California." }
    ],
    medicaidNote: "Nevada Medicaid does not currently cover doula services as of 2025. Nevada has not enacted legislation to include doula reimbursement. Families on Nevada Medicaid must pay out of pocket for doula support, though some nonprofit programs offer no-cost or sliding-scale doula services in the Las Vegas area.",
    insuranceNote: "Nevada's insurance market includes large employer and union plans (especially the Culinary Health Fund). Many of these plans cover midwifery and some doula-related services, but coverage varies — check with your specific plan. Nevada does not have a state mandate for doula insurance coverage.",
    faqs: [
      { q: "How much does a doula cost in Las Vegas?", a: "Expect to pay $1,200 to $3,500 for a doula in Las Vegas. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Are there any birth centers in Las Vegas?", a: "No. There are currently no freestanding birth centers in the Las Vegas Valley. Families wanting a birth center experience would need to travel to Southern California or arrange a home birth with a licensed midwife. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does Nevada Medicaid cover doulas?", a: "Not yet — your state's Medicaid doesn't cover doulas right now. But that doesn't mean you're alone. Advocacy groups are working on changing this, and things are moving in the right direction. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — no matter who's in the room with you, knowing what you want is your superpower." },
      { q: "Which Las Vegas hospital has the best NICU?", a: "Sunrise Hospital, UMC, and Summerlin Hospital all operate Level III NICUs — the highest level available in the Las Vegas Valley. For Level IV NICU care, moms and families would be transferred out of state. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Is home birth legal in Nevada?", a: "Yes. Home birth with a licensed midwife is legal in Nevada. Certified professional midwives (CPMs) and certified nurse-midwives (CNMs) may attend home births, though the pool of attending midwives in Las Vegas is small. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether home birth is right for you." },
      { q: "Does the Culinary Health Fund cover doula services?", a: "The Culinary Health Fund covers midwifery and hospital maternity care for its members, but doula coverage is not a standard benefit. Contact the fund directly to verify whether doula services can be reimbursed under your specific plan. Call your insurance and ask directly: \"Do you cover doula services?\" That one phone call gets you a clear answer." }
    ],
    nearbyCities: ["henderson-nv", "sacramento-ca", "los-angeles-ca"],
  },
  "minneapolis-mn": {
    city: "Minneapolis",
    state: "MN",
    slug: "minneapolis-mn",
    costLow: 1500,
    costHigh: 4000,
    shelbiServesHere: false,
    culture: "Minneapolis has one of the most progressive birth-work communities in the country, with strong collaborative networks among doulas, midwives, and obstetricians. The city's legacy of maternal-health advocacy — rooted in both its Scandinavian welfare traditions and its powerful BIPOC birth-justice organizations — makes it a place where families can find genuinely informed, supportive care across the spectrum from hospital to home birth.",
    heroLocalDetail: "Minneapolis families travel easy I-35W or Hiawatha Avenue corridors to reach the city's cluster of major hospital campuses near Downtown East and the Philips neighborhood, while families in Uptown and Southwest Minneapolis access birth centers and midwifery practices along the Greenway trail and Hennepin Avenue corridors.",
    hospitalDetails: [
      { name: "Abbott Northwestern Hospital", paragraph: "Abbott Northwestern is Minneapolis's largest birth hospital, delivering over 5,000 babies annually with a Level III NICU and a dedicated midwifery program through the Minnesota Birth Center partnership. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "HCMC (Hennepin Healthcare)", paragraph: "Hennepin Healthcare in downtown Minneapolis operates a Level III NICU and serves as the region's safety-net hospital, offering robust OB services with a focus on high-risk pregnancies and community-centered care." },
      { name: "M Health Fairview University of Minnesota Medical Center", paragraph: "M Health Fairview offers a Level IV NICU — the highest level in the state — alongside its maternal-fetal medicine specialists, making it the referral center for the most complex neonatal cases." },
      { name: "North Memorial Health Hospital", paragraph: "North Memorial Health in Robbinsdale just northwest of Minneapolis features a Level III NICU and a family birth center known for its private suites and 24/7 in-house OB and anesthesia coverage." }
    ],
    birthCenterDetails: [
      { name: "Minnesota Birth Center", paragraph: "Minnesota Birth Center is a CABC-accredited freestanding birth center with its Minneapolis location in the Phillips neighborhood, offering water birth, midwifery-led care, and seamless hospital transfer partnerships." }
    ],
    medicaidNote: "Minnesota Medicaid (Medical Assistance) covers doula services. Effective January 2024, MN DHS reimburses certified doulas up to $1,700 per pregnancy ($425 prenatal, $425 labor/delivery, $425 postpartum, $425 additional visits). Doulas must be listed on the Minnesota Doula Registry to bill Medical Assistance or MinnesotaCare.",
    insuranceNote: "Minnesota law requires most private insurers to cover midwifery services, and many major carriers (Blue Cross, HealthPartners, UCare) include doula benefits or offer flex-spending reimbursement. Always verify your specific plan's out-of-network doula coverage.",
    faqs: [
      { q: "How much does a doula cost in Minneapolis?", a: "Expect to pay $1,500 to $4,000 for a doula in Minneapolis. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Minnesota Medicaid pay for doulas?", a: "Yes! Great news — Medicaid covers doula services in Minneapolis. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "What is the best hospital for giving birth in Minneapolis?", a: "Abbott Northwestern delivers the most babies and has a Level III NICU with an in-house midwifery option, while M Health Fairview has a Level IV NICU for high-risk pregnancies. Your best fit depends on your risk level and preferences. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there freestanding birth centers in Minneapolis?", a: "Yes. Minnesota Birth Center in the Phillips neighborhood is CABC-accredited and offers water birth and midwifery-led care. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Can I have a water birth in Minneapolis?", a: "Yes. Minnesota Birth Center offers water birth in freestanding tubs, and Abbott Northwestern's midwifery program supports water immersion during labor. Some you also hire home-birth midwives who bring portable birth tubs. Ask your provider about water birth options — and if they say no, it's okay to ask for a second opinion." },
      { q: "Do Minneapolis hospitals allow doulas in the delivery room?", a: "Yes. All major Minneapolis hospitals welcome doulas. Post-COVID restrictions have fully lifted so doulas are allowed without visitor limits. Call ahead or bring your birth plan to your hospital tour — most units welcome doulas, but knowing their policy upfront saves you stress." }
    ],
    nearbyCities: ["st-paul-mn"],
  },
  "st-paul-mn": {
    city: "St. Paul",
    state: "MN",
    slug: "st-paul-mn",
    costLow: 1200,
    costHigh: 3500,
    shelbiServesHere: false,
    culture: "St. Paul's birth community blends the same Minnesota progressive values as its twin across the river but with a quieter, more intimate feel — smaller hospital campuses, tight-knit midwifery practices, and a strong Hmong and East African maternal health network that has shaped culturally responsive care models. Families here often describe a 'small-town within a big-city' experience when navigating birth options.",
    heroLocalDetail: "St. Paul families navigate birth from Grand Avenue's canopy of oaks to the compact medical campus near Regions Hospital and the State Capitol grounds. The birth-friendly community stretches from Cathedral Hill out to the suburban edges along I-94 and Highway 61, with Minneapolis options just 10 minutes west across the river.",
    hospitalDetails: [
      { name: "Regions Hospital", paragraph: "Regions Hospital in downtown St. Paul is the city's primary birth hospital, featuring a Level III NICU, private labor-delivery-recovery suites, and a midwifery practice. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to organize your preferences before arrival." },
      { name: "M Health Fairview St. John's Hospital", paragraph: "St. John's Hospital in Maplewood just east of St. Paul offers a Level III NICU with a family birth center known for supportive nursing staff and comfortable private rooms." },
      { name: "United Hospital (Allina Health)", paragraph: "United Hospital on the bluff overlooking the Mississippi in downtown St. Paul operates a birth center with a Level II NICU and strong midwifery collaboration through Allina Health's integrated OB network." }
    ],
    birthCenterDetails: [
      { name: "Minnesota Birth Center – St. Paul", paragraph: "Minnesota Birth Center opened a St. Paul location offering the same CABC-accredited midwifery-led care, with water birth options and a warm, home-like setting." }
    ],
    medicaidNote: "Minnesota Medicaid (Medical Assistance) covers doula services statewide. Effective January 2024, MN DHS reimburses certified doulas up to $1,700 per pregnancy. St. Paul families access the same MN Doula Registry and reimbursement schedule as the rest of the state.",
    insuranceNote: "St. Paul families insured through HealthPartners, Blue Cross Blue Shield of Minnesota, or Medica generally find strong midwifery coverage. Minnesota law mandates private-plan coverage of licensed midwifery, though doula coverage varies by plan — check your specific benefits.",
    faqs: [
      { q: "How much does a doula cost in St. Paul?", a: "Expect to pay $1,200 to $3,500 for a doula in St. Paul. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Is St. Paul a good city for a birth center delivery?", a: "Yes. Minnesota Birth Center's St. Paul location offers CABC-accredited, midwifery-led birth center care with water birth tubs. Minneapolis birth center options are also just 10 minutes away. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "What NICU level does Regions Hospital have?", a: "Regions Hospital has a Level III NICU, the highest level available in St. Paul, capable of caring for babies born as early as 28 weeks. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there Hmong-speaking doulas in St. Paul?", a: "Yes! St. Paul has bilingual doulas — and if you're more comfortable in another language, that support is out there. Ask when you interview: \"Do you offer support in my language?\" is a great question to start with." },
      { q: "Can I use Medicaid for a birth center in St. Paul?", a: "Yes. Minnesota Medical Assistance covers birth center births at licensed facilities like Minnesota Birth Center. Your midwife and facility must be enrolled Minnesota Health Care Program providers. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "How far is Minneapolis from St. Paul for birth services?", a: "Downtown St. Paul to downtown Minneapolis is about 10 miles via I-94 — roughly a 15-minute drive. Many you use both cities' birth options since they share one connected metro birth community. Knowing your drive time before you're in labor takes one more worry off your plate." }
    ],
    nearbyCities: ["minneapolis-mn"],
  },
  "phoenix-az": {
    city: "Phoenix",
    state: "AZ",
    slug: "phoenix-az",
    costLow: 1200,
    costHigh: 3500,
    shelbiServesHere: false,
    culture: "Phoenix's birth culture is shaped by its sprawling valley geography and a growing community of Latinx, Indigenous, and Black birth workers advocating for culturally congruent care in a state where out-of-hospital birth options are expanding but remain fewer per capita than in progressive northern states. The Valley's warm-weather lifestyle and large transplanted population create a diverse client base seeking everything from traditional hospital births to home births guided by partera traditions.",
    heroLocalDetail: "Phoenix families navigate a vast metro spread along the Loop 101 and I-10, with birth resources concentrated in the Central Phoenix and Scottsdale medical districts near Camelback Road and Indian School Road. The Camelback Mountain silhouette marks the geographic center of the Valley's birth corridor, with hospitals clustering along Central Avenue north of downtown.",
    hospitalDetails: [
      { name: "Banner University Medical Center Phoenix", paragraph: "Banner University Medical Center Phoenix is the Valley's academic medical center with a Level IV NICU — the highest available — as well as maternal-fetal medicine specialists and a high-risk pregnancy program. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to coordinate your care team here." },
      { name: "St. Joseph's Hospital and Medical Center (Dignity Health)", paragraph: "St. Joseph's in central Phoenix features a Level III NICU and one of the busiest OB departments in Arizona, with a long-standing midwifery collaboration and a reputation for high-volume, high-quality birth care." },
      { name: "Phoenix Children's Hospital", paragraph: "Phoenix Children's Hospital operates the state's largest Level IV NICU and serves as the regional referral center for the most critically ill newborns, working in partnership with nearby maternal-fetal medicine programs." },
      { name: "HonorHealth Scottsdale Shea Medical Center", paragraph: "HonorHealth Shea in Scottsdale offers a Level III NICU with a family birth center known for private suites, comfortable amenities, and strong lactation support in the northeast Valley." }
    ],
    birthCenterDetails: [
      { name: "Natural Birth Center & Women's Wellness", paragraph: "The Natural Birth Center & Women's Wellness in Mesa is one of the few freestanding birth centers in the Phoenix metro area, offering midwifery-led birth, water birth, and holistic prenatal care." }
    ],
    medicaidNote: "Arizona does not currently cover doula services through its Medicaid program (AHCCCS) as of 2025. While advocacy efforts have pushed for doula reimbursement, AHCCCS has not yet implemented a doula benefit. Arizona families on Medicaid must pay out of pocket for doula support or seek volunteer/sliding-scale doulas.",
    insuranceNote: "Arizona private insurers are not required to cover doula services, though some plans offer partial reimbursement or flex-spending eligibility. Arizona does mandate coverage for licensed midwives and birth center births under certain plans, but coverage varies widely — verify with your insurer directly.",
    faqs: [
      { q: "How much does a doula cost in Phoenix?", a: "Expect to pay $1,200 to $3,500 for a doula in Phoenix. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Arizona Medicaid cover doula services?", a: "Not yet — your state's Medicaid doesn't cover doulas right now. But that doesn't mean you're alone. Advocacy groups are working on changing this, and things are moving in the right direction. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — no matter who's in the room with you, knowing what you want is your superpower." },
      { q: "Are there birth centers in Phoenix?", a: "Yes, but options are limited. Natural Birth Center & Women's Wellness in Mesa is one of the few freestanding birth centers in the Phoenix metro area. Many you seeking out-of-hospital birth work with home-birth midwives instead. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "What is the best hospital for giving birth in Phoenix?", a: "Banner University Medical Center Phoenix offers a Level IV NICU, making it ideal for high-risk pregnancies. St. Joseph's Hospital in central Phoenix also has an excellent Level III NICU and a strong midwifery collaboration. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Can I have a water birth in Phoenix?", a: "Water birth is available at freestanding birth centers like Natural Birth Center & Women's Wellness. Most Phoenix hospitals allow water immersion during labor but not water birth itself — check your hospital's current policy. Ask your provider about water birth options — and if they say no, it's okay to ask for a second opinion." },
      { q: "Are there Spanish-speaking doulas in Phoenix?", a: "You deserve a doula who gets your experience. Phoenix has doulas of color who serve families with cultural understanding and real care. Don't settle — keep asking until you find someone who feels right." }
    ],
    nearbyCities: ["las-vegas-nv"],
  },
  "chicago-il": {
    city: "Chicago",
    state: "IL",
    slug: "chicago-il",
    costLow: 1500,
    costHigh: 5000,
    shelbiServesHere: false,
    culture: "Chicago's birth culture is shaped by a strong network of Black and Latina doulas working across the South and West Sides, with a growing push for birth equity amid well-documented maternal health disparities. The city blends world-class academic medical centers with a vibrant community birth worker scene, and advocacy groups were instrumental in pushing for Illinois Medicaid doula coverage.",
    heroLocalDetail: "From the sweeping views along Lake Shore Drive to the historic brownstones of Hyde Park, Chicago families navigate birth across a sprawling mosaic of neighborhoods. The Illinois Medical District near Polk Street houses some of the city's largest labor and delivery units, while community birth workers build connections from Bronzeville to Logan Square.",
    hospitalDetails: [
      { name: "Northwestern Memorial Hospital — Prentice Women's Hospital", paragraph: "Prentice Women's Hospital on East Huron Street in Streeterville is one of the busiest birthing hospitals in the Midwest with a Level III NICU and over 12,000 births annually. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Rush University Medical Center", paragraph: "Rush University Medical Center near Harrison Street in the Illinois Medical District features a Level III NICU and a midwifery practice, offering a blend of medical and supportive birth options." },
      { name: "University of Chicago Medical Center", paragraph: "Located in Hyde Park, the University of Chicago Medical Center operates a Level III NICU and serves as a critical resource for South Side families with a strong maternal-fetal medicine program." },
      { name: "Advocate Illinois Masonic Medical Center", paragraph: "Advocate Illinois Masonic in Lakeview on Wellington Avenue has a Level III NICU and is known for its midwifery-friendly approach within a hospital setting." }
    ],
    birthCenterDetails: [
      { name: "The Birth Center of Chicago", paragraph: "The Birth Center of Chicago is a freestanding birth center offering midwifery-led, low-intervention births in a home-like setting for families seeking an alternative to hospital delivery." }
    ],
    medicaidNote: "Illinois Medicaid covers doula services starting January 2025 under SB334 (signed January 2024), reimbursing up to $1,500 per pregnancy for prenatal, labor, and postpartum support visits.",
    insuranceNote: "Illinois law requires Medicaid managed care plans to cover doula services. Private insurers vary — ask your plan if they reimburse doula care, and request a superbill from your doula for out-of-network submission.",
    faqs: [
      { q: "How much does a doula cost in Chicago?", a: "Expect to pay $1,500 to $5,000, for a doula in Chicago. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Illinois Medicaid really cover doula services?", a: "Yes. As of January 2025, Illinois Medicaid reimburses up to $1,500 per pregnancy for doula services under SB334. You can find Medicaid-enrolled doulas through the Illinois Department of Healthcare and Family Services directory." },
      { q: "What hospitals in Chicago have Level III NICUs?", a: "Northwestern Prentice, Rush University Medical Center, University of Chicago Medical Center, and Advocate Illinois Masonic all have Level III NICUs. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there freestanding birth centers in Chicago?", a: "Yes. The Birth Center of Chicago offers midwifery-led births outside the hospital. Availability can be limited, so inquire early in your pregnancy. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Can I have a midwife-attended birth at a Chicago hospital?", a: "Several Chicago hospitals, including Rush University Medical Center and Advocate Illinois Masonic, have midwifery practices that support low-intervention births within a hospital setting. Ask your provider directly about midwife-attended birth options — you might have more choices than you think." },
      { q: "How do I find a Black doula in Chicago?", a: "You deserve a doula who gets your experience. Chicago has doulas of color who serve families with cultural understanding and real care. Don't settle — keep asking until you find someone who feels right." }
    ],
    nearbyCities: ["minneapolis-mn", "st-paul-mn"],
  },
  "detroit-mi": {
    city: "Detroit",
    state: "MI",
    slug: "detroit-mi",
    costLow: 800,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Detroit's birth culture is deeply rooted in community-based care, with a powerful legacy of Black midwifery and doula work shaped by the city's history of maternal health inequity. Grassroots organizations have led the charge for better birth outcomes, and Michigan's 2024 Medicaid doula coverage expansion is a direct result of decades of local advocacy.",
    heroLocalDetail: "From the historic neighborhoods around Woodward Avenue to the revitalizing communities near the Detroit RiverWalk, Detroit families navigate a birth landscape marked by both resilience and gaps in access. The Detroit Medical Center campus near Canfield Street anchors the city's hospital-based birth options, while community birth workers build vital support networks across the east and west sides.",
    hospitalDetails: [
      { name: "DMC Hutzel Women's Hospital", paragraph: "Part of the Detroit Medical Center near Canfield Street, Hutzel Women's Hospital is one of Michigan's oldest obstetric hospitals with a Level III NICU and a long history of serving Detroit families. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Henry Ford Hospital", paragraph: "Henry Ford Hospital on West Grand Boulevard features a Level III NICU and is a major teaching hospital offering comprehensive maternal-fetal medicine services." },
      { name: "Corewell Health William Beaumont University Hospital", paragraph: "Located in nearby Royal Oak, Corewell Health Beaumont has a Level IV NICU — the highest designation — and handles the region's most complex neonatal cases." },
      { name: "Sinai-Grace Hospital", paragraph: "Sinai-Grace Hospital on the west side of Detroit provides obstetric services with a Level III NICU and serves as a critical birth access point for northwest Detroit communities." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Detroit", paragraph: "Detroit currently lacks licensed freestanding birth centers. Families seeking out-of-hospital birth may work with home birth midwives, though options in the city proper remain limited." }
    ],
    medicaidNote: "Michigan Medicaid covers doula services as of 2024, reimbursing up to approximately $1,500 per pregnancy for prenatal, labor and delivery, and postpartum support visits through enrolled doulas.",
    insuranceNote: "Michigan Medicaid managed care plans are required to cover doula services. For private insurance, coverage varies by plan — request a superbill from your doula and submit for potential out-of-network reimbursement.",
    faqs: [
      { q: "How much does a doula cost in Detroit?", a: "Expect to pay $800 to $3,000, for a doula in Detroit. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Michigan Medicaid cover doula services?", a: "Yes! Great news — Medicaid covers doula services in Detroit. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "Are there freestanding birth centers in Detroit?", a: "Detroit currently does not have any licensed freestanding birth centers. Families interested in out-of-hospital birth can explore certified home birth midwives practicing in the area. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "What is the highest-level NICU near Detroit?", a: "Corewell Health William Beaumont University Hospital in Royal Oak has a Level IV NICU, the highest designation, capable of treating the most complex neonatal conditions." },
      { q: "How do I find a community doula in Detroit?", a: "You deserve a doula who gets your experience. Detroit has doulas of color who serve families with cultural understanding and real care. Don't settle — keep asking until you find someone who feels right." },
      { q: "Is Hutzel Women's Hospital still open for deliveries?", a: "Yes. DMC Hutzel Women's Hospital continues to operate as a dedicated women's hospital with a Level III NICU and remains a cornerstone of obstetric care in Detroit." }
    ],
    nearbyCities: ["chicago-il", "minneapolis-mn"],
  },
  "new-york-ny": {
    city: "New York",
    state: "NY",
    slug: "new-york-ny",
    costLow: 1500,
    costHigh: 5000,
    shelbiServesHere: false,
    culture: "New York City's birth culture is as diverse as its boroughs — from the hospital-intensive landscape of Manhattan to the community midwifery traditions of Brooklyn and the Bronx. The city has a robust doula community and has been a national leader in Medicaid doula coverage, though persistent maternal health disparities in Black and Brown communities drive ongoing birth justice activism.",
    heroLocalDetail: "From the brownstone-lined blocks of Park Slope to the bustling corridors along the Grand Concourse in the Bronx, New York families plan births across an enormous spectrum of settings. Manhattan's East Side hospital corridor near York Avenue houses some of the nation's top neonatal units, while birth justice organizers build grassroots support networks from Harlem to Bedford-Stuyvesant.",
    hospitalDetails: [
      { name: "NewYork-Presbyterian/Columbia University Irving Medical Center", paragraph: "Located in Washington Heights, Columbia's medical center features a Level IV NICU — the highest designation — and is one of the premier maternal-fetal medicine programs in the country. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "NYU Langone Health — Tisch Hospital", paragraph: "NYU Langone on First Avenue in Midtown East operates a Level IV NICU and is known for its midwifery practice alongside top-tier obstetric care." },
      { name: "Mount Sinai Hospital", paragraph: "Mount Sinai on the Upper East Side near Madison Avenue has a Level IV NICU and handles some of the city's most complex pregnancies and neonatal cases." },
      { name: "NYC Health + Hospitals/Elmhurst", paragraph: "Elmhurst Hospital in Queens provides a Level III NICU and serves as a vital safety-net hospital for immigrant and low-income families across the borough." }
    ],
    birthCenterDetails: [
      { name: "No freestanding birth centers in New York City", paragraph: "Licensed freestanding birth centers are virtually nonexistent in New York City due to the state's stringent regulatory environment. Families seeking low-intervention birth typically work with midwives within hospital-based midwifery practices or explore home birth with certified midwives." }
    ],
    medicaidNote: "New York State Medicaid covers doula services at approximately $1,710 per pregnancy, with reimbursement split across prenatal, labor/delivery, and postpartum visits. Doulas must enroll as Medicaid providers through the state's eMedNY system.",
    insuranceNote: "New York State law requires commercial insurers to cover lactation support and certain maternal services, but doula coverage varies by plan. Request a superbill from your doula and submit it for out-of-network reimbursement — many plans will partially reimburse.",
    faqs: [
      { q: "How much does a doula cost in New York City?", a: "Expect to pay $1,500 to $5,000, for a doula in New York. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does New York Medicaid cover doula services?", a: "Yes! Great news — Medicaid covers doula services in New York. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "Are there freestanding birth centers in NYC?", a: "Practically no — New York's regulatory environment makes opening freestanding birth centers extremely difficult. Your best options for low-intervention birth are hospital-based midwifery practices or certified home birth midwives. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Which NYC hospitals have Level IV NICUs?", a: "NewYork-Presbyterian/Columbia, NYU Langone, and Mount Sinai all have Level IV NICUs — the highest designation — capable of caring for the most critically ill newborns. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "How do I find a doula who speaks my language in NYC?", a: "You deserve a doula who gets your experience. Start with Doula Project — they connect you with doulas who share your lived experience. Don't settle — keep asking until you find someone who feels right." },
      { q: "Can I have a midwife-attended birth at a NYC hospital?", a: "Yes. Several NYC hospitals including NYU Langone and NewYork-Presbyterian have midwifery practices that support low-intervention, midwife-attended births within the hospital setting. Ask your provider directly about midwife-attended birth options — you might have more choices than you think." }
    ],
    nearbyCities: ["chicago-il"],
  },
  "newark-nj": {
    city: "Newark",
    state: "NJ",
    slug: "newark-nj",
    costLow: 1200,
    costHigh: 4000,
    shelbiServesHere: false,
    culture: "Newark's birth culture is deeply rooted in its Black and Latinx communities, where maternal health advocacy has grown significantly in recent years. Grassroots organizations and community doulas work to address stark racial disparities in maternal outcomes across Essex County, while the city's proximity to NYC academic medical centers gives families additional options.",
    heroLocalDetail: "From the brownstones along Clinton Avenue to the revitalized streets around Broad Street and Military Park, Newark families navigate a city where historic neighborhoods meet a growing healthcare corridor. University Heights and the area surrounding Rutgers-Newark anchor the city's medical and academic community.",
    hospitalDetails: [
      { name: "Newark Beth Israel Medical Center", paragraph: "Newark Beth Israel Medical Center is a major teaching hospital with a Level III NICU, providing high-risk neonatal care and a full range of maternal-fetal medicine services. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "University Hospital (Rutgers NJMS)", paragraph: "University Hospital, affiliated with Rutgers New Jersey Medical School, features a Level III NICU and serves as a regional perinatal center with specialized maternal-fetal medicine and high-risk obstetric care." },
      { name: "Saint Michael's Medical Center", paragraph: "Saint Michael's Medical Center offers maternity services with a Level II NICU and serves the Newark community with a focus on family-centered obstetric care." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Newark", paragraph: "There are currently no licensed freestanding birth centers operating within Newark city limits. Families seeking out-of-hospital birth center care typically travel to nearby communities in northern New Jersey or New York City." }
    ],
    medicaidNote: "New Jersey Medicaid covers doula services as of 2024 through the NJ DMAS (Doula Medicaid Access Study), reimbursing approximately $1,540 per pregnancy for doula support including prenatal, labor, and postpartum visits.",
    insuranceNote: "Under New Jersey's insurance regulations, most private insurers are required to cover maternity care including lactation support. Check with your specific plan for doula coverage, as NJ has been expanding access through state-level maternal health legislation.",
    faqs: [
      { q: "How much does a doula cost in Newark, NJ?", a: "Expect to pay $1,200 to $4,000, for a doula in Newark. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does New Jersey Medicaid cover doula services?", a: "Yes! Great news — Medicaid covers doula services in Newark. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "What hospitals in Newark have the highest level NICU?", a: "Newark Beth Israel Medical Center and University Hospital both have Level III NICUs, providing the highest level of specialized neonatal care available in the city. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Newark?", a: "There are currently no licensed freestanding birth centers in Newark. Families interested in birth center deliveries may need to travel to facilities in other parts of northern New Jersey or New York City. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "How do I find a Black doula in Newark?", a: "You deserve a doula who gets your experience. Start with Workers Collective — they connect you with doulas who share your lived experience. Don't settle — keep asking until you find someone who feels right." },
      { q: "What postpartum resources are available in Newark?", a: "You're not supposed to do this alone. In Newark, you've got community health centers, plus lactation consultants and WIC offices and local parenting groups. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — knowing what's normal (and what's not) after birth is everything." }
    ],
    nearbyCities: ["new-york-ny"],
  },
  "virginia-beach-va": {
    city: "Virginia Beach",
    state: "VA",
    slug: "virginia-beach-va",
    costLow: 1000,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Virginia Beach's birth culture blends military-family practicality with a growing natural birth community shaped by the city's coastal lifestyle. With a large active-duty military population, many families navigate TRICARE benefits alongside local birth support options. The broader Hampton Roads area has seen a rise in community doulas addressing maternal health disparities.",
    heroLocalDetail: "From the bustling corridor along Virginia Beach Boulevard to the oceanfront neighborhoods near the Boardwalk and Atlantic Avenue, families in Virginia Beach live where suburban sprawl meets coastal charm. The Hilltop area near Laskin Road and the growing Town Center district provide healthcare access and community gathering spots for new parents.",
    hospitalDetails: [
      { name: "Sentara Virginia Beach General Hospital", paragraph: "Sentara Virginia Beach General Hospital is the city's primary maternity hospital with a Level III NICU and comprehensive maternal-fetal medicine services for high-risk pregnancies. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Sentara Princess Anne Hospital", paragraph: "Sentara Princess Anne Hospital offers labor and delivery services with a Level II NICU and serves families in the southern Virginia Beach area near the Pungo and Sandbridge communities." },
      { name: "Naval Medical Center Portsmouth", paragraph: "Naval Medical Center Portsmouth, located just across the water, serves active-duty military families with a Level III NICU and serves as the primary military treatment facility for the Hampton Roads region." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Virginia Beach", paragraph: "There are currently no licensed freestanding birth centers operating within Virginia Beach. Families seeking birth center care may explore home birth options with certified professional midwives." }
    ],
    medicaidNote: "Virginia Medicaid covers doula services as of 2023, reimbursing approximately $1,500 per pregnancy through managed care organizations. Doulas must enroll as Virginia Medicaid providers to receive reimbursement for prenatal, intrapartum, and postpartum support.",
    insuranceNote: "Virginia's Medicaid expansion and state insurance regulations have improved maternity coverage access. TRICARE covers hospital births and some home birth scenarios for military families. Private insurance doula coverage varies by plan — contact your insurer directly.",
    faqs: [
      { q: "How much does a doula cost in Virginia Beach?", a: "Expect to pay $1,000 to $3,000, for a doula in Virginia Beach. Military? Ask about military discounts — several local doulas offer them. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Virginia Medicaid cover doula services?", a: "Yes! Great news — Medicaid covers doula services in Virginia Beach. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You deserve support, and now your insurance helps pay for it." },
      { q: "Does TRICARE cover doulas in Virginia Beach?", a: "TRICARE does not directly cover doula services, but doulas can support military military families during TRICARE-covered hospital births. Many Virginia Beach doulas offer military discounts or payment plans. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> — military families deal with enough uncertainty; your birth preferences shouldn't be one of them." },
      { q: "What hospitals in Virginia Beach have the highest level NICU?", a: "Sentara Virginia Beach General Hospital has a Level III NICU, the highest neonatal care level available in the city. Naval Medical Center Portsmouth also has a Level III NICU serving military moms and families. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Virginia Beach?", a: "There are currently no licensed freestanding birth centers in Virginia Beach. Families interested in out-of-hospital birth may explore home birth with certified professional midwives. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "What postpartum support is available for military families in Virginia Beach?", a: "You're not supposed to do this alone. Virginia Beach has lactation consultants, local parenting groups to lean on. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — knowing what's normal (and what's not) after birth is everything." }
    ],
    nearbyCities: ["new-york-ny", "chicago-il"],
  },
  "nashville-tn": {
    city: "Nashville",
    state: "TN",
    slug: "nashville-tn",
    costLow: 1200,
    costHigh: 3500,
    shelbiServesHere: false,
    culture: "Nashville's birth culture is evolving alongside its booming population, with a growing community of doulas, midwives, and birth advocates working to address significant racial disparities in maternal health outcomes across Middle Tennessee. While the city is home to world-class medical institutions, grassroots organizations are pushing for more culturally centered, community-based birth support.",
    heroLocalDetail: "From the historic streets of North Nashville near Jefferson Street to the bustling Medical District along 21st Avenue South and the 12 South neighborhood popular with young families, Nashville blends Southern heritage with rapid growth. Vanderbilt University Medical Center anchors the West End healthcare corridor, while community health centers serve neighborhoods across Davidson County.",
    hospitalDetails: [
      { name: "Vanderbilt University Medical Center", paragraph: "Vanderbilt University Medical Center is a nationally ranked academic hospital with a Level IV NICU — the highest level of neonatal care — providing comprehensive maternal-fetal medicine and specialized high-risk obstetric services. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Ascension Saint Thomas Midtown Hospital", paragraph: "Ascension Saint Thomas Midtown Hospital is one of Nashville's busiest maternity hospitals with a Level III NICU, delivering thousands of babies annually and serving as a key provider in the Middle Tennessee region." },
      { name: "TriStar Centennial Medical Center", paragraph: "TriStar Centennial Medical Center offers labor and delivery services with a Level III NICU and serves families across the Nashville metro area with a full range of obstetric and neonatal care." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Nashville", paragraph: "There are currently no licensed freestanding birth centers operating within Nashville. Tennessee's regulatory landscape for birth centers has been a barrier. Families seeking out-of-hospital birth typically work with home birth midwives serving the Middle Tennessee area." }
    ],
    medicaidNote: "Tennessee does NOT cover doula services through Medicaid (TennCare) as of 2025. While neighboring states have implemented Medicaid doula coverage, Tennessee has not yet enacted similar legislation, leaving low-income families to seek sliding-scale or volunteer doula options.",
    insuranceNote: "Private insurance doula coverage in Tennessee varies significantly by plan and insurer. Tennessee has not mandated doula coverage for private plans. Contact your insurance provider directly to ask about reimbursement for doula services or out-of-network benefits.",
    faqs: [
      { q: "How much does a doula cost in Nashville?", a: "Expect to pay $1,200 to $3,500, for a doula in Nashville. Can't swing the full price? Ask about sliding-scale options — most doulas would rather work with your budget than see you go without. Many doulas offer payment plans, so don't let the sticker price scare you off. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Tennessee Medicaid cover doula services?", a: "Not yet — your state's Medicaid doesn't cover doulas right now. But that doesn't mean you're alone. Community doulas and sliding-scale options exist — many doulas would rather work with your budget than see you go without. Some doulas even reserve pro bono spots. Advocacy groups are working on changing this, and things are moving in the right direction. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — no matter who's in the room with you, knowing what you want is your superpower." },
      { q: "What hospitals in Nashville have the highest level NICU?", a: "Vanderbilt University Medical Center has a Level IV NICU, the highest level available. Ascension Saint Thomas Midtown and TriStar Centennial both have Level III NICUs. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Nashville?", a: "There are currently no licensed freestanding birth centers in Nashville. Tennessee's regulatory environment has made it difficult for birth centers to operate. Families seeking out-of-hospital birth typically hire certified professional midwives for home birth. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "How do I find a doula of color in Nashville?", a: "You deserve a doula who gets your experience. Start with Nashville Birth Collective — they connect you with doulas who share your lived experience. Don't settle — keep asking until you find someone who feels right." },
      { q: "What postpartum resources are available in Nashville?", a: "You're not supposed to do this alone. Nashville has lactation consultants, WIC offices, local parenting groups to lean on. Note: postpartum Medicaid coverage is available, though doula services aren't included under current policy. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> — knowing what's normal (and what's not) after birth is everything." }
    ],
    nearbyCities: ["atlanta-ga", "chicago-il"],
  },
  "philadelphia-pa": {
    city: "Philadelphia",
    state: "PA",
    slug: "philadelphia-pa",
    costLow: 800,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Philadelphia has a rich, community-rooted doula culture shaped by powerful Black birthworkers and organizations like the Philadelphia Doula Network who have been championing birth justice for decades. You'll find doulas here who truly understand the city's racial disparities in maternal health and fight alongside you for better care. Whether you're delivering at a major medical center or exploring home birth, Philly doulas bring both fierce advocacy and deep, sister-level support.",
    heroLocalDetail: "At 38 weeks pregnant, you're probably mapping the quickest route from your rowhome in West Philly or Fishtown to your delivery hospital — dodging construction on Broad Street and praying the Vine Street Expressway isn't a parking lot. Spruce Street Harbor Park is a peaceful spot for those final walking-the-baby-out strolls along the Delaware River waterfront, and the Schuylkill River Trail behind the Philadelphia Museum of Art gives you a breezier path when summer humidity hits hard.",
    hospitalDetails: [
      { name: "Hospital of the University of Pennsylvania", paragraph: "HUP is a Level IV NICU hospital and Philadelphia's top-tier academic medical center, offering 24/7 maternal-fetal medicine specialists and a state-of-the-art labor and delivery unit. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Thomas Jefferson University Hospital", paragraph: "Jefferson holds a Level III NICU designation with a dedicated high-risk pregnancy program and private labor suites on their Center City campus. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Temple University Hospital", paragraph: "Temple is a Level III NICU facility known for its strong community presence in North Philadelphia and comprehensive obstetric care including midwifery services. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Einstein Medical Center Philadelphia", paragraph: "Einstein carries a Level III NICU and serves as a cornerstone maternity hospital in North Philly with a long-standing midwifery program and robust lactation support. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Pennsylvania Hospital", paragraph: "Pennsylvania Hospital — the nation's first hospital — features a Level III NICU and is beloved for its historic maternity unit with private rooms on 8th and Spruce Streets. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "Philadelphia Birth Center", paragraph: "The Philadelphia Birth Center in the Germantown section offers a warm, home-like setting with certified nurse-midwives for low-risk pregnancies seeking an out-of-hospital birth experience. It's one of Philly's few freestanding birth centers, and they welcome doula support throughout your labor." }
    ],
    medicaidNote: "Pennsylvania Medicaid covers doula services as of 2024, with reimbursement of up to $1,250 per pregnancy through the PA Doula Program — covering prenatal visits, labor support, and postpartum visits combined.",
    insuranceNote: "Pennsylvania private insurers vary widely on doula coverage — Aetna and UHC may partially reimburse with a superbill, while Cigna and Blue Cross of Pennsylvania often require pre-authorization. Always request a superbill from your doula and submit it with CPT code S9443 for the best chance of reimbursement.",
    faqs: [
      { q: "How much does a doula cost in Philadelphia?", a: "In Philly, doula packages typically run $800–$2,500 depending on experience and what's included — most cover 2 prenatal visits, labor support, and 1–2 postpartum visits. Some doulas offer sliding scale, and if you have PA Medicaid, you may qualify for full coverage up to $1,250." },
      { q: "Does Pennsylvania Medicaid cover doula services?", a: "Yes! As of 2024, Pennsylvania Medicaid covers doula services up to $1,250 per pregnancy through the PA Doula Program. You'll need to use a Medicaid-enrolled doula — contact your managed care plan for a list of enrolled doulas in Philadelphia." },
      { q: "What hospitals in Philadelphia have the highest level NICU?", a: "Hospital of the University of Pennsylvania (HUP) has the only Level IV NICU in the city — the highest level available. CHOP (Children's Hospital of Philadelphia) also operates a Level IV NICU for newborns who need transfer after birth." },
      { q: "Are there birth centers in Philadelphia?", a: "Yes — the Philadelphia Birth Center in Germantown offers out-of-hospital birth with certified nurse-midwives. For more options, you can also look into birth centers in the surrounding suburbs or home birth with a licensed midwife." },
      { q: "Can I bring my doula to hospitals in Philadelphia?", a: "Most Philly hospitals allow doulas in the delivery room alongside your medical team, but policies can vary — especially during flu season or if visitor restrictions are in place. Call your hospital's labor and delivery unit a few weeks before your due date to confirm their current policy." },
      { q: "What postpartum resources are available in Philadelphia?", a: "Philly has strong postpartum support: Maternity Care Coalition offers home visiting and breastfeeding help across the city, the Philadelphia Department of Public Health runs free parenting groups, CHOP's Lactation Center provides expert breastfeeding support, and the Postpartum Support International PA helpline (1-800-773-6667) is available for perinatal mood concerns." }
    ],
    nearbyCities: ["new-york-ny", "baltimore-md"],
  },
  "pittsburgh-pa": {
    city: "Pittsburgh",
    state: "PA",
    slug: "pittsburgh-pa",
    costLow: 700,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Pittsburgh's doula community is growing strong, with a tight-knit network of birthworkers who bring that signature Steel City loyalty to your birth experience. Organizations like Birth Sisters Pittsburgh and local BIPOC birth collectives are expanding access and pushing for more equitable maternal care across the city's neighborhoods. You'll find doulas here who treat you like family and who deeply understand the unique experience of birthing in Western Pennsylvania's hospital landscape.",
    heroLocalDetail: "At 38 weeks, you're probably mentally calculating drive times from your Squirrel Hill apartment or Lawrenceville rowhouse to your delivery hospital, wondering whether the Fort Pitt Tunnel will cooperate or if Route 28 is the safer bet. Frick Park's wooded trails give you shaded walking paths when you need to coax baby along, and the Strip District on a quiet Saturday morning is a surprisingly peaceful place for those final waddle-walks past the vendor stands on Smallman Street.",
    hospitalDetails: [
      { name: "Magee-Womens Hospital of UPMC", paragraph: "Magee-Womens Hospital is a Level III NICU facility and Pittsburgh's premier maternity hospital, delivering over 10,000 babies a year with 24/7 obstetric anesthesiology, midwifery services, and a renowned maternal-fetal medicine program. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "UPMC Children's Hospital of Pittsburgh", paragraph: "While not a delivery hospital, UPMC Children's operates a Level IV NICU — the region's highest — for newborns who need the most specialized neonatal care after transfer from any surrounding hospital." },
      { name: "Allegheny General Hospital", paragraph: "Allegheny General on the North Side holds a Level III NICU with a well-established obstetric program and private labor rooms, serving families from the North Hills and beyond. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "West Penn Hospital", paragraph: "West Penn Hospital in Bloomfield features a Level II NICU with a highly regarded midwifery practice and a more intimate, community-hospital feel. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Pittsburgh", paragraph: "Pittsburgh doesn't currently have a freestanding birth center, which we know is disappointing if that's the experience you're hoping for. The good news is that Magee-Womens Hospital and West Penn Hospital both offer midwifery-led care with more supportive, low-intervention options, and some doulas in the area can connect you with home birth midwives serving the greater Pittsburgh region." }
    ],
    medicaidNote: "Pennsylvania Medicaid covers doula services as of 2024, with reimbursement of up to $1,250 per pregnancy through the PA Doula Program — covering prenatal visits, labor support, and postpartum visits combined.",
    insuranceNote: "Pennsylvania private insurers vary widely on doula coverage — Aetna and UHC may partially reimburse with a superbill, while Cigna and Blue Cross of Pennsylvania often require pre-authorization. Always request a superbill from your doula and submit it with CPT code S9443 for the best chance of reimbursement.",
    faqs: [
      { q: "How much does a doula cost in Pittsburgh?", a: "In Pittsburgh, doula packages generally range from $700–$2,000, with most covering prenatal visits, labor support, and postpartum follow-up. If cost is a concern, ask about sliding scale options — and remember, PA Medicaid now covers doula services up to $1,250." },
      { q: "Does Pennsylvania Medicaid cover doula services?", a: "Yes! As of 2024, Pennsylvania Medicaid covers doula services up to $1,250 per pregnancy through the PA Doula Program. You'll need to work with a Medicaid-enrolled doula — contact your managed care plan for options in Pittsburgh." },
      { q: "What hospitals in Pittsburgh have the highest level NICU?", a: "UPMC Children's Hospital of Pittsburgh has a Level IV NICU — the highest level possible — for newborns needing the most advanced care. Magee-Womens Hospital and Allegheny General both have Level III NICUs for in-house delivery support." },
      { q: "Are there birth centers in Pittsburgh?", a: "Not currently — Pittsburgh doesn't have a freestanding birth center. But you can still get midwifery-led, low-intervention care at Magee-Womens Hospital or West Penn Hospital, or explore home birth options with licensed midwives in the greater Pittsburgh area." },
      { q: "Can I bring my doula to hospitals in Pittsburgh?", a: "Yes, most Pittsburgh hospitals welcome doulas as part of your support team during labor and delivery. Magee-Womens and West Penn are especially doula-friendly — but it's always smart to call your hospital's labor and delivery unit a few weeks before your due date to confirm their current visitor and support person policies." },
      { q: "What postpartum resources are available in Pittsburgh?", a: "Pittsburgh offers several great postpartum resources: Healthy Start Pittsburgh supports moms through pregnancy and postpartum with wraparound services, the Allegheny County Health Department has a free home visiting program, Western Psychiatric Institute provides perinatal mood support, and La Leche League Pittsburgh runs free breastfeeding support groups across the city." }
    ],
    nearbyCities: ["philadelphia-pa"],
  },
  "baltimore-md": {
    city: "Baltimore",
    state: "MD",
    slug: "baltimore-md",
    costLow: 800,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "Baltimore's birth worker community is powered by a fierce network of Black doulas and birth justice organizations that have been fighting for equitable maternal care in a city with stark disparities. Groups like the Baltimore Doula Project and community-based collectives bring culturally grounded support that centers your voice and your choices. Whether you're delivering at a downtown academic center or a community hospital, Baltimore doulas show up with both strategy and soul.",
    heroLocalDetail: "At 38 weeks pregnant, you're probably figuring out the fastest route from your Canton rowhouse or Reservoir Hill apartment to your hospital — banking on Greenmount Avenue being clear or bracing for Charles Street traffic. The promenade along the Inner Harbor waterfront gives you flat, easy walking when contractions start feeling like they might mean business, and Druid Hill Park's shaded loop is a neighborhood favorite for those last-weeks waddles under the old-growth canopy.",
    hospitalDetails: [
      { name: "The Johns Hopkins Hospital", paragraph: "Johns Hopkins holds a Level IV NICU — Maryland's highest — with world-class maternal-fetal medicine specialists, 24/7 neonatologists, and a recently renovated labor and delivery unit on their East Baltimore campus. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "University of Maryland Medical Center", paragraph: "UMMC operates a Level III NICU with a strong midwifery program, high-risk obstetric care, and serves as the primary teaching hospital for West Baltimore. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Sinai Hospital of Baltimore", paragraph: "Sinai Hospital carries a Level III NICU on its Greenspring campus in Northwest Baltimore, with a supportive maternity unit, lactation consultants, and midwifery options. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "MedStar Franklin Square Medical Center", paragraph: "MedStar Franklin Square has a Level III NICU and is a key community hospital serving Baltimore's eastern neighborhoods with full obstetric services. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "Johns Hopkins Bayview Birth Center", paragraph: "The Johns Hopkins Bayview Birth Center offers a midwifery-led, low-intervention birth experience within a hospital campus — giving you the homey feel of a birth center with the safety net of hospital-level care steps away. It's one of the few birth center options in Baltimore and welcomes doula support throughout your labor." }
    ],
    medicaidNote: "Maryland Medicaid covers doula services as of 2024, with reimbursement rates including $450 for labor and delivery support, $75 per prenatal or postpartum visit (up to 4 visits), totaling up to $900 per pregnancy for Medicaid-enrolled doulas.",
    insuranceNote: "Maryland's state insurance regulations support broader maternity coverage, but doula-specific reimbursement through private insurance varies. CareFirst BlueCross BlueShield of Maryland and UHC may offer partial reimbursement with a superbill using CPT code S9443. Always ask your doula for a superbill and submit it promptly.",
    faqs: [
      { q: "How much does a doula cost in Baltimore?", a: "In Baltimore, doula packages typically range from $800–$2,200 depending on experience level and services included. If you have Maryland Medicaid, you may qualify for coverage up to $900 through the state's Medicaid doula program." },
      { q: "Does Maryland Medicaid cover doula services?", a: "Yes! Maryland Medicaid covers doula services as of 2024, with up to $450 for labor and delivery and $75 per visit for up to 4 prenatal or postpartum visits — totaling up to $900 per pregnancy. You'll need a Medicaid-enrolled doula, and we can help connect you with one in Baltimore." },
      { q: "What hospitals in Baltimore have the highest level NICU?", a: "Johns Hopkins Hospital has a Level IV NICU — the highest level available in the city and state. University of Maryland Medical Center, Sinai Hospital, and MedStar Franklin Square all have Level III NICUs for advanced care." },
      { q: "Are there birth centers in Baltimore?", a: "Yes! The Johns Hopkins Bayview Birth Center offers midwifery-led, low-intervention birth on a hospital campus. It's a great option if you want a birth center vibe with the backup of hospital care right down the hall." },
      { q: "Can I bring my doula to hospitals in Baltimore?", a: "Most Baltimore hospitals welcome doulas as part of your birth team — Johns Hopkins, UMMC, and Sinai are generally doula-friendly. It's still a good idea to call your hospital's labor and delivery unit a couple of weeks before delivery to confirm their current support person policies." },
      { q: "What postpartum resources are available in Baltimore?", a: "Baltimore has strong postpartum support: Baltimore Healthy Start provides wraparound services from pregnancy through the first year, the Baltimore City Health Department offers free home visiting programs, Sinai Hospital's Center for Pregnancy and New Parents provides lactation and newborn support, and the Maryland PSI warmline (1-800-773-6667) is available for perinatal mood and anxiety support." }
    ],
    nearbyCities: ["philadelphia-pa", "virginia-beach-va"],
  },
  "hartford-ct": {
    city: "Hartford",
    state: "CT",
    slug: "hartford-ct",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Hartford's birth community is growing fast, with doulas and midwives building real connection across the city — especially in neighborhoods like North End and Frog Hollow. You'll find a strong network of Black and Latina doulas who understand that your culture matters in the birth room. Connecticut's HUSKY Health doula coverage (live since 2024) is opening doors for more moms to get the support they deserve.",
    heroLocalDetail: "At 38 weeks, you're probably mapping the quickest route from your apartment in Asylum Hill or your place on the South Side to your hospital — knowing Albany Avenue traffic can be unpredictable at rush hour. Bushnell Park gives you flat, shaded walking paths for those final pregnancy strolls right in downtown, and the Connecticut River trail behind the science center is a quiet spot when you need to move and think.",
    hospitalDetails: [
      { name: "Connecticut Children's Medical Center", paragraph: "Connecticut Children's operates a Level IV NICU — the highest level available — meaning they can handle the most complex neonatal needs right in Hartford. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Hartford Hospital", paragraph: "Hartford Hospital offers a Level III NICU and a well-established maternity program serving families throughout the Greater Hartford area. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Saint Francis Hospital", paragraph: "Saint Francis Hospital provides a Level III NICU and a family-centered birth experience on the north side of Hartford. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Hartford", paragraph: "There are currently no freestanding birth centers operating in Hartford, but midwifery practices at Hartford Hospital and Saint Francis offer low-intervention birth options. Connecticut law allows birth centers, so this landscape may evolve — talk to your provider about what's available." }
    ],
    medicaidNote: "Connecticut's HUSKY Health (Medicaid) covers doula services as of January 2024, with reimbursement of approximately $900 for a full package including prenatal visits, labor support, and postpartum visits. Your doula must be enrolled as a HUSKY Health provider.",
    insuranceNote: "Connecticut private insurers vary on doula coverage — some Aetna and Cigna plans in CT now include doula benefits. Call your insurance company and ask specifically about 'doula services' or 'labor support' to find out what's covered. If your plan doesn't cover doulas, ask about out-of-network reimbursement with a superbill.",
    faqs: [
      { q: "How much does a doula cost in Hartford?", a: "In Hartford, a birth doula typically charges between $800 and $2,000 for a full package — prenatal visits, labor support, and postpartum care. Some doulas offer sliding scale fees, and if you have HUSKY Health (CT Medicaid), your doula services may be covered at no cost to you." },
      { q: "Does Connecticut Medicaid cover doula services?", a: "Yes! As of January 2024, Connecticut's HUSKY Health program covers doula services — including prenatal visits, labor support, and postpartum visits. Make sure your doula is enrolled as a HUSKY Health provider, and ask your care coordinator to help you find one." },
      { q: "What hospitals in Hartford have the highest level NICU?", a: "Connecticut Children's Medical Center has a Level IV NICU — the highest level — offering the most advanced neonatal care in the region. Hartford Hospital and Saint Francis Hospital both have Level III NICUs." },
      { q: "Are there birth centers in Hartford?", a: "There are no freestanding birth centers currently operating in Hartford. However, hospital-based midwifery practices at Hartford Hospital and Saint Francis offer midwifery-centered birth experiences." },
      { q: "Can I bring my doula to hospitals in Hartford?", a: "Yes — all major Hartford hospitals allow doulas as part of your birth team. Call the hospital's maternity floor ahead of time to confirm their current visitor and support person policies so there are no surprises on your big day." },
      { q: "What postpartum resources are available in Hartford?", a: "Hartford has solid postpartum support: Connecticut's HUSKY Health offers postpartum coverage up to 12 months, the Hartford WIC program provides nutrition and breastfeeding support, the Family Life Center at Saint Francis offers parenting programs, and community-based groups through the Hispanic Health Council and Hartford's home visiting programs are available." }
    ],
    nearbyCities: ["boston-ma", "providence-ri", "new-york-ny"],
  },
  "boston-ma": {
    city: "Boston",
    state: "MA",
    slug: "boston-ma",
    costLow: 1000,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Boston is a powerhouse for birth justice — home to some of the country's most storied teaching hospitals and a growing community of doulas who are making sure your voice gets heard no matter where you deliver. From the Black maternal health advocates in Roxbury and Dorchester to the midwifery champions in Cambridge, Boston moms have options and a community that fights for them. Massachusetts MassHealth doula coverage launched in 2024, making support more accessible than ever.",
    heroLocalDetail: "At 38 weeks, you're probably mapping the fastest route from your place in Jamaica Plain or Southie to your hospital — hoping the Longwood area isn't a parking lot and that Centre Street construction is done. The Arnold Arboretum gives you gorgeous, shaded walking paths for those final coax-baby-out strolls, and the Charles River Esplanade is flat and breezy when you need easy movement.",
    hospitalDetails: [
      { name: "Brigham and Women's Hospital", paragraph: "Brigham and Women's operates a Level III NICU and is one of the busiest maternity hospitals in New England, with midwifery and physician options. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Boston Medical Center", paragraph: "BMC offers a Level III NICU and is known for its commitment to serving diverse families and its strong midwifery practice. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Massachusetts General Hospital", paragraph: "Mass General provides a Level III NICU and a full-spectrum maternity program integrated with one of the top research hospitals in the world. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Beth Israel Deaconess Medical Center", paragraph: "BIDMC offers a Level III NICU and a well-established midwifery practice in the Longwood area. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Boston Children's Hospital", paragraph: "While primarily a pediatric hospital, Boston Children's operates a Level IV NICU — the highest level — for the most complex neonatal conditions, working closely with Brigham and Women's." }
    ],
    birthCenterDetails: [
      { name: "Birth Sanctuary Cambridge", paragraph: "Birth Sanctuary Cambridge is a freestanding birth center near Alewife offering midwife-led births in a home-like setting. It's one of the few independent birth centers in the greater Boston area — a beautiful option if you're seeking a low-intervention birth outside the hospital." }
    ],
    medicaidNote: "Massachusetts MassHealth covers doula services as of January 2024, with reimbursement of approximately $1,200 for a full package — covering 2 prenatal visits, labor and delivery support, and 2 postpartum visits. Your doula must be enrolled as a MassHealth provider.",
    insuranceNote: "Massachusetts requires most private insurance plans through the state exchange (MA Health Connector) to cover maternity services. Doula coverage by private insurers is expanding — some Blue Cross Blue Shield of MA and Tufts Health Plan policies now include doula benefits. Check your plan documents or call member services and ask about 'certified doula services.'",
    faqs: [
      { q: "How much does a doula cost in Boston?", a: "In Boston, a birth doula typically charges between $1,000 and $3,000 for a full package — Boston's higher cost of living and concentration of experienced doulas drives the upper range. If you have MassHealth, your doula services may be fully covered — and some doulas offer sliding scale or payment plans." },
      { q: "Does Massachusetts Medicaid cover doula services?", a: "Yes — MassHealth started covering doula services in January 2024, reimbursing approximately $1,200 for a full package. Your doula needs to be enrolled as a MassHealth provider. Call your MassHealth health plan to get a list of enrolled doulas near you." },
      { q: "What hospitals in Boston have the highest level NICU?", a: "Boston Children's Hospital operates a Level IV NICU — the highest level possible. Brigham and Women's, Boston Medical Center, Massachusetts General Hospital, and Beth Israel Deaconess all have Level III NICUs." },
      { q: "Are there birth centers in Boston?", a: "Birth Sanctuary Cambridge near Alewife is a freestanding birth center offering midwife-led births in a home-like setting. Most other birth options in Boston are hospital-based midwifery practices. If you want a birth center experience, Birth Sanctuary is worth exploring." },
      { q: "Can I bring my doula to hospitals in Boston?", a: "Yes — Boston's major hospitals generally welcome doulas as part of your support team. Policies can shift, so call your hospital's maternity floor before your due date to confirm their current support person policy." },
      { q: "What postpartum resources are available in Boston?", a: "Boston has strong postpartum support: MassHealth covers postpartum care up to 12 months, the Boston Public Health Commission's MOMCARE program provides wraparound services, Birth Sisters at Boston Medical Center offers culturally centered doula support, postpartum groups run through Brigham and Women's Center for Women's Health, and WIC offices serve Dorchester, Roxbury, and Jamaica Plain." }
    ],
    nearbyCities: ["hartford-ct", "providence-ri", "new-york-ny"],
  },
  "providence-ri": {
    city: "Providence",
    state: "RI",
    slug: "providence-ri",
    costLow: 800,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Providence has a quietly powerful birth community shaped by its size — doulas, midwives, and lactation consultants here tend to know each other and often know your OB too. The city's Dominican, Cape Verdean, and Portuguese communities have built strong networks of culturally centered birth workers. Rhode Island was ahead of the curve on Medicaid doula coverage, and you'll feel the difference: more moms can actually afford the support they want.",
    heroLocalDetail: "At 38 weeks, you're probably figuring out the fastest route from your place on the South Side or Federal Hill to Women & Infants on Dudley Street — thankfully everything in Providence is close. India Point Park along the Providence River gives you flat, waterfront walking when you need to move, and Rogers Williams Park's rose garden is a surprisingly peaceful place for those last-weeks waddles.",
    hospitalDetails: [
      { name: "Women & Infants Hospital of Rhode Island", paragraph: "Women & Infants operates a Level III NICU and is the largest obstetrical care facility in Rhode Island, delivering more babies than any other hospital in the state. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Roger Williams Medical Center", paragraph: "Roger Williams provides a Level II NICU and serves families in the Providence area with a smaller, more intimate maternity program. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Hasbro Children's Hospital", paragraph: "Hasbro Children's, part of Rhode Island Hospital, provides Level IV NICU services — the highest level — for the most complex neonatal cases, working in close collaboration with Women & Infants." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Providence", paragraph: "There are currently no freestanding birth centers in Providence, though Women & Infants Hospital offers midwifery services within the hospital setting. Community advocates are working to expand birth center options in Rhode Island." }
    ],
    medicaidNote: "Rhode Island Medicaid began covering doula services in July 2023 — one of the earliest New England states to do so. The state reimburses approximately $1,500 for a full doula package covering up to 8 visits. Your doula must be enrolled as a RI Medicaid provider.",
    insuranceNote: "Rhode Island private insurers are increasingly offering doula coverage — Blue Cross Blue Shield of Rhode Island and UnitedHealthcare have pilot programs. Ask your insurer directly about 'doula services' coverage. If your doula accepts RI Medicaid, you should have no out-of-pocket cost.",
    faqs: [
      { q: "How much does a doula cost in Providence?", a: "In Providence, a birth doula typically charges between $800 and $1,800 for a full package including prenatal visits, labor support, and postpartum care. If you have RI Medicaid, your doula services may be fully covered at no cost to you — Rhode Island was one of the first New England states to offer this." },
      { q: "Does Rhode Island Medicaid cover doula services?", a: "Yes! Rhode Island Medicaid has covered doula services since July 2023 — the full package is reimbursed at approximately $1,500. Your doula must be enrolled as a RI Medicaid provider. Contact your health plan or care coordinator to find enrolled doulas." },
      { q: "What hospitals in Providence have the highest level NICU?", a: "Hasbro Children's Hospital (part of Rhode Island Hospital) operates a Level IV NICU — the highest level. Women & Infants Hospital has a Level III NICU, and Roger Williams Medical Center has a Level II NICU." },
      { q: "Are there birth centers in Providence?", a: "There are no freestanding birth centers in Providence right now. Women & Infants Hospital does have midwives and a more home-like birth suite option within the hospital. Community advocates are pushing for birth center options, so this could change." },
      { q: "Can I bring my doula to hospitals in Providence?", a: "Yes — Providence hospitals, including Women & Infants, generally welcome doulas as part of your birth team. Call the hospital's maternity unit before your due date to confirm their current visitor and support person policies." },
      { q: "What postpartum resources are available in Providence?", a: "Providence has solid postpartum support: RI Medicaid covers postpartum care up to 12 months, the Rhode Island Department of Health's Home Visiting Program provides in-home support, WIC offices on Broad Street and in Olneyville offer nutrition and breastfeeding help, and community-based groups through organizations like the SISTA Project and Progreso Latino are available." }
    ],
    nearbyCities: ["boston-ma", "hartford-ct", "new-york-ny"],
  },
  "san-francisco-ca": {
    city: "San Francisco",
    state: "CA",
    slug: "san-francisco-ca",
    costLow: 1800,
    costHigh: 3500,
    shelbiServesHere: false,
    culture: "San Francisco's birth community is vibrant and progressive — from the long-standing home-birth midwifery tradition to a thriving network of doulas of color who center equity and ancestral wisdom. You'll find everything from BIPOC-centered doula collectives to integrative birth prep classes that honor the whole you, not just the clinical side of things.",
    heroLocalDetail: "At 38 weeks, you're probably mapping the quickest route from your apartment in the Mission or Noe Valley to your hospital — praying for no fog delays on the way to the medical campus. The Embarcadero waterfront gives you flat walking for those final pregnancy strolls, and Crissy Field offers ocean breezes when you need to move and think.",
    hospitalDetails: [
      { name: "UCSF Medical Center", paragraph: "UCSF's Level IV NICU is one of the top neonatal programs on the West Coast, making it a go-to for high-risk pregnancies. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "California Pacific Medical Center", paragraph: "CPMC's Van Ness campus features a Level III NICU and beautifully designed private birthing suites. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Zuckerberg San Francisco General Hospital", paragraph: "SF General offers a Level III NICU and serves as the city's safety-net hospital with a dedicated team experienced in diverse patient populations. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "San Francisco Birth Center", paragraph: "The San Francisco Birth Center offers out-of-hospital midwifery care in a warm, home-like setting — one of the few freestanding birth centers in the city, welcoming families seeking a low-intervention birth experience." }
    ],
    medicaidNote: "California covers doula services through Medi-Cal — since January 2023, you can receive up to ~$1,587 in doula coverage including prenatal, birth, and postpartum visits. Ask your Medi-Cal managed care plan how to get started.",
    insuranceNote: "Under CA law, private insurance plans must cover maternity services, and many now include doula benefits. Medi-Cal doula coverage has removed prior-authorization requirements to make access easier.",
    faqs: [
      { q: "How much does a doula cost in San Francisco?", a: "In San Francisco, doula services typically range from $1,800 to $3,500 depending on experience and package inclusions. Some doulas offer sliding-scale spots — always ask! And if you have Medi-Cal, coverage up to ~$1,587 can significantly reduce your costs." },
      { q: "Does California Medicaid cover doula services?", a: "Yes! Since 2023, Medi-Cal covers doula services up to ~$1,587. Contact your Medi-Cal managed care plan to find an enrolled doula near you, or ask a doula you love if they accept Medi-Cal — many now do." },
      { q: "What hospitals in San Francisco have the highest level NICU?", a: "UCSF Medical Center has a Level IV NICU — the highest level. CPMC and SF General both offer Level III NICUs. You're in excellent hands for any level of care you and your baby may need." },
      { q: "Are there birth centers in San Francisco?", a: "Yes — the San Francisco Birth Center is a freestanding birth center offering midwifery-led, low-intervention births. It's one of the few in the city proper, so spots can fill quickly." },
      { q: "Can I bring my doula to hospitals in San Francisco?", a: "Yes — UCSF, CPMC, and SF General all allow doulas as part of your support team. Call your hospital's maternity unit ahead of time to confirm their current visitor and support-person policies." },
      { q: "What postpartum resources are available in San Francisco?", a: "San Francisco has strong postpartum support: UCSF's Lactation Center provides expert breastfeeding help, Day One Centers in SoMa offer postpartum groups, Black Mama's Village provides culturally centered care, and the SF Department of Public Health's Black Infant Health Program serves local families." }
    ],
    nearbyCities: ["oakland-ca", "san-jose-ca", "sacramento-ca"],
  },
  "san-jose-ca": {
    city: "San Jose",
    state: "CA",
    slug: "san-jose-ca",
    costLow: 1500,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "San Jose's birth community blends Silicon Valley innovation with deep-rooted Vietnamese and Latino cultural traditions around pregnancy and postpartum care. You'll find doulas here who honor nằm cữ (Vietnamese postpartum recovery) and cuarentena (Latino 40-day rest) alongside modern evidence-based birth prep — your cultural traditions are respected in the birth room.",
    heroLocalDetail: "At 38 weeks, you're probably figuring out the fastest route from your place in Willow Glen or Berryessa to your delivery hospital — timing the 101 vs 280 commute. The Guadalupe River Park trail gives you flat, paved walking near downtown, and Alum Rock Park's shaded canyon is a quiet spot for those last peaceful walks before baby arrives.",
    hospitalDetails: [
      { name: "Good Samaritan Hospital", paragraph: "Good Samaritan features a Level III NICU and is known for its family-centered maternity care in the Los Gatos/San Jose area. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Regional Medical Center of San Jose", paragraph: "Regional Medical Center offers a Level III NICU and a dedicated women's health program serving the East San Jose community. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Kaiser Permanente San Jose Medical Center", paragraph: "Kaiser San Jose provides a Level III NICU with seamless integrated prenatal-to-postpartum care for Kaiser members. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in San Jose", paragraph: "There are currently no freestanding birth centers operating within San Jose city limits. The Bay Area Birth Center in nearby Santa Clara or South Bay Midwifery may be options — or talk to your midwife about home birth if that's your preference." }
    ],
    medicaidNote: "California covers doula services through Medi-Cal — since January 2023, you can receive up to ~$1,587 in doula coverage including prenatal, birth, and postpartum visits. Ask your Medi-Cal managed care plan how to get started.",
    insuranceNote: "If you have insurance through a Silicon Valley employer, check whether your plan includes doula benefits — many large tech-company plans now do. Medi-Cal doula coverage requires no prior authorization.",
    faqs: [
      { q: "How much does a doula cost in San Jose?", a: "San Jose doula services typically run $1,500–$3,000. Costs vary based on experience and package scope — many doulas in this area offer payment plans or sliding-scale options, so don't hesitate to ask." },
      { q: "Does California Medicaid cover doula services?", a: "Yes — Medi-Cal has covered doula services since 2023, up to ~$1,587. Many San Jose doulas have started accepting Medi-Cal since the policy change." },
      { q: "What hospitals in San Jose have the highest level NICU?", a: "Good Samaritan Hospital, Regional Medical Center, and Kaiser San Jose all offer Level III NICUs. For Level IV care, UCSF Benioff in San Francisco is the closest option." },
      { q: "Are there birth centers in San Jose?", a: "There are no freestanding birth centers in San Jose proper right now. The Bay Area Birth Center in nearby Santa Clara or South Bay Midwifery are alternatives, or you can explore home birth with a licensed midwife." },
      { q: "Can I bring my doula to hospitals in San Jose?", a: "Absolutely — Good Samaritan, Regional Medical Center, and Kaiser San Jose all allow doulas as support persons. Call ahead to your hospital's maternity triage to confirm current policies." },
      { q: "What postpartum resources are available in San Jose?", a: "San Jose has solid postpartum support: lactation consultants at Santa Clara Valley Medical Center, postpartum groups through the YWCA Golden Gate Silicon Valley, Vietnamese postpartum meal services in East San Jose, and Santa Clara County's Perinatal Equity Initiative for Black moms." }
    ],
    nearbyCities: ["san-francisco-ca", "oakland-ca", "sacramento-ca"],
  },
  "long-beach-ca": {
    city: "Long Beach",
    state: "CA",
    slug: "long-beach-ca",
    costLow: 1200,
    costHigh: 2800,
    shelbiServesHere: false,
    culture: "Long Beach has a grounded, community-oriented birth culture shaped by its huge Cambodian and Latino populations — you'll find doulas who understand traditional postpartum practices like 'lying-in' and who show up for mamas in languages beyond English. The birth community here is scrappy, real, and deeply connected to grassroots mutual aid.",
    heroLocalDetail: "At 38 weeks, you're probably figuring out the fastest route from your place near Retro Row or Cambodia Town to your hospital on Atlantic Avenue — thankful that Long Beach is flatter than most of LA. Shoreline Drive and the beach path give you flat, breezy walking when you need to move, and El Dorado Park's shaded trails are a quiet escape near the end of pregnancy.",
    hospitalDetails: [
      { name: "MemorialCare Long Beach Medical Center", paragraph: "MemorialCare Long Beach features a Level III NICU and is one of the area's most established maternity hospitals with a robust women's health program. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Dignity Health St. Mary Medical Center", paragraph: "St. Mary Medical Center offers a Level III NICU and serves as a vital community hospital with deep roots in the Long Beach community. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Long Beach", paragraph: "There are no freestanding birth centers currently operating in Long Beach. Nearby options include the South Bay Birth Center in Redondo Beach or exploring home birth with a licensed midwife." }
    ],
    medicaidNote: "California covers doula services through Medi-Cal — since January 2023, you can receive up to ~$1,587 in doula coverage including prenatal, birth, and postpartum visits. Long Beach has a large Medi-Cal population, making this coverage especially impactful.",
    insuranceNote: "Medi-Cal is the primary insurer for many Long Beach families, and doula coverage is now available without prior authorization. For private insurance, check with your carrier — many Blue Shield and Health Net plans in the area now include doula benefits.",
    faqs: [
      { q: "How much does a doula cost in Long Beach?", a: "In Long Beach, expect to pay $1,200–$2,800 for a birth doula package. The community has some wonderful grassroots doulas who offer sliding-scale rates, and Medi-Cal coverage has made doula support more accessible than ever." },
      { q: "Does California Medicaid cover doula services?", a: "Yes! Medi-Cal covers doula services up to ~$1,587 since 2023. Many Long Beach doulas now accept Medi-Cal — contact your plan or ask any doula you're considering." },
      { q: "What hospitals in Long Beach have the highest level NICU?", a: "Both MemorialCare Long Beach Medical Center and St. Mary Medical Center have Level III NICUs. For Level IV NICU care, you'd be referred to nearby facilities like UCLA or Children's Hospital LA." },
      { q: "Are there birth centers in Long Beach?", a: "There are no freestanding birth centers in Long Beach currently. The South Bay Birth Center in Redondo Beach (about 20 minutes away) or a home birth with a licensed midwife are your closest out-of-hospital options." },
      { q: "Can I bring my doula to hospitals in Long Beach?", a: "Yes — both MemorialCare Long Beach and St. Mary allow doulas as support persons. Call your hospital's maternity department before your due date to confirm their current visitor policy." },
      { q: "What postpartum resources are available in Long Beach?", a: "Long Beach offers the Comprehensive Perinatal Services Program through community clinics, lactation support at MemorialCare, the Cambodian Advocacy Collaborative for culturally rooted postpartum care, and the Black Infant Health Program through the City of Long Beach Health Department." }
    ],
    nearbyCities: ["los-angeles-ca", "san-diego-ca", "bakersfield-ca"],
  },
  "oakland-ca": {
    city: "Oakland",
    state: "CA",
    slug: "oakland-ca",
    costLow: 1500,
    costHigh: 3200,
    shelbiServesHere: false,
    culture: "Oakland's birth culture is powerful and unapologetic — this is a city where Black midwifery is being reclaimed, where doulas organize for birth justice, and where community birth workers show up for each other like family. If you want a birth team that sees your whole self — your culture, your story, your strength — Oakland is where you'll find it.",
    heroLocalDetail: "At 38 weeks, you're probably mapping the quickest route from your place in West Oakland or the Dimond District to your hospital — calculating whether 880 or 580 is the better bet. Lake Merritt gives you a flat, beautiful walking loop for those final pregnancy strolls, and Jack London Waterfront is peaceful when you need easy movement.",
    hospitalDetails: [
      { name: "Highland Hospital", paragraph: "Highland Hospital (Alameda Health System) provides a Level III NICU and serves as Oakland's public safety-net hospital with a deeply committed maternity team experienced in diverse communities. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Kaiser Permanente Oakland Medical Center", paragraph: "Kaiser Oakland offers a Level III NICU with the integrated prenatal-to-postpartum care model that Kaiser members know. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "Bay Area Birth Center", paragraph: "The Bay Area Birth Center in nearby Santa Clara offers a freestanding midwifery-led birth option — a home-like environment for families seeking gentle, low-intervention birth outside the hospital setting. Oakland also has a strong home-birth midwifery community." }
    ],
    medicaidNote: "California covers doula services through Medi-Cal — since January 2023, you can receive up to ~$1,587 in doula coverage including prenatal, birth, and postpartum visits. Oakland's community health centers have been early adopters of Medi-Cal doula billing.",
    insuranceNote: "If you have private insurance, many Alameda County employers include doula benefits — especially tech, university, and public-sector plans. Alameda County also has a Perinatal Equity Initiative funding additional support for Black families.",
    faqs: [
      { q: "How much does a doula cost in Oakland?", a: "Oakland doula packages typically range from $1,500 to $3,200. Oakland has a deeply connected birth-justice community, and many doulas offer sliding-scale, community-rate, or Medi-Cal spots — don't let sticker shock stop you from reaching out." },
      { q: "Does California Medicaid cover doula services?", a: "Yes — Medi-Cal covers doula services up to ~$1,587 since 2023, and Oakland's community birth workers have been quick to enroll. Many Oakland doulas now accept Medi-Cal." },
      { q: "What hospitals in Oakland have the highest level NICU?", a: "Highland Hospital and Kaiser Oakland both have Level III NICUs. For Level IV neonatal care, UCSF Benioff in San Francisco is your closest option, about 20 minutes away." },
      { q: "Are there birth centers in Oakland?", a: "The Bay Area Birth Center in Santa Clara serves Oakland families with freestanding midwifery-led care. Oakland also has a strong home-birth midwifery community if you're leaning toward birthing at home." },
      { q: "Can I bring my doula to hospitals in Oakland?", a: "Yes — Highland and Kaiser Oakland both allow doulas. Oakland hospitals have been especially supportive of doula accompaniment given the city's birth-justice culture. Still, call ahead to confirm current policies." },
      { q: "What postpartum resources are available in Oakland?", a: "Oakland is rich in postpartum support: the Black Infant Health Program through Alameda County Public Health, Roots Community Birth Center's postpartum circles, lactation support at Highland Hospital, and Alameda County WIC offices for breastfeeding help and nutrition support." }
    ],
    nearbyCities: ["san-francisco-ca", "san-jose-ca", "sacramento-ca", "stockton-ca"],
  },
  "bakersfield-ca": {
    city: "Bakersfield",
    state: "CA",
    slug: "bakersfield-ca",
    costLow: 900,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "Bakersfield's birth community is small but mighty — you'll find doulas and midwives who serve this sprawling Central Valley city with heart, often bridging English and Spanish for Latino families who make up over half the population. The birth culture here is down-to-earth and community-first, where your doula becomes like family.",
    heroLocalDetail: "At 38 weeks, you're probably figuring out the fastest route from your place in the southwest or Rosedale area to your hospital near Chester Avenue — grateful that Bakersfield traffic is nothing like LA. The River Walk near the Kern River gives you flat, shaded walking paths, and Hart Park is a quiet spot for those last peaceful stretches before baby.",
    hospitalDetails: [
      { name: "Kern Medical", paragraph: "Kern Medical features a Level III NICU and provides essential maternity services as Kern County's safety-net hospital. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Bakersfield Memorial Hospital", paragraph: "Bakersfield Memorial offers a Level III NICU and a comfortable family-centered maternity unit serving southwest Bakersfield families. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Bakersfield", paragraph: "There are currently no freestanding birth centers operating in Bakersfield. Some families choose home birth with a licensed midwife — the closest birth center options are a significant drive away in the LA or Bay areas." }
    ],
    medicaidNote: "California covers doula services through Medi-Cal — since January 2023, you can receive up to ~$1,587 in doula coverage. Bakersfield has a large Medi-Cal population, making this coverage especially impactful for local families.",
    insuranceNote: "Medi-Cal is the primary insurer for many Bakersfield families, and doula coverage is now available without prior authorization. For privately insured families, check your plan — Kern County employer plans through Kaiser, Blue Shield, and Health Net may include doula benefits.",
    faqs: [
      { q: "How much does a doula cost in Bakersfield?", a: "In Bakersfield, a birth doula typically costs $900–$2,200 — lower than coastal cities but still an investment. Many local doulas offer payment plans, and Medi-Cal coverage at ~$1,587 can cover the full cost of care." },
      { q: "Does California Medicaid cover doula services?", a: "Yes! Medi-Cal covers doula services up to ~$1,587 since 2023. This is a game-changer in Bakersfield, where Medi-Cal serves a huge portion of families." },
      { q: "What hospitals in Bakersfield have the highest level NICU?", a: "Both Kern Medical and Bakersfield Memorial have Level III NICUs. For Level IV neonatal care, you'd typically be referred to Valley Children's Hospital in Madera (about 2 hours north)." },
      { q: "Are there birth centers in Bakersfield?", a: "Not currently — there are no freestanding birth centers in Bakersfield. Home birth with a licensed midwife is an option, and the closest birth centers require driving to the Bay Area or LA." },
      { q: "Can I bring my doula to hospitals in Bakersfield?", a: "Yes — Kern Medical and Bakersfield Memorial both allow doulas as part of your birth team. Call the maternity unit ahead of time to confirm their current policy." },
      { q: "What postpartum resources are available in Bakersfield?", a: "Bakersfield offers the Kern County Black Infant Health Program, lactation support through Kern Medical's WIC office, postpartum support groups at Adventist Health Bakersfield, and the Comprehensive Perinatal Services Program (CPSP) at local community health centers." }
    ],
    nearbyCities: ["fresno-ca", "los-angeles-ca", "san-diego-ca"],
  },
  "stockton-ca": {
    city: "Stockton",
    state: "CA",
    slug: "stockton-ca",
    costLow: 900,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Stockton's birth community reflects the heart of the Central Valley — hardworking, diverse, and deeply connected to family traditions. With a large Filipino and Latino population, you'll find birth workers who honor cultural practices like cuarentena and who serve families in Spanish, Tagalog, and more. The doula scene is growing here, and the women who do this work show up with real love.",
    heroLocalDetail: "At 38 weeks, you're probably figuring out the fastest route from your place in Lincoln Village or the Boggs Tract to your hospital near Hammer Lane — grateful that Stockton keeps things close. The Downtown Stockton waterfront near Banner Island gives you flat, easy walking, and Victory Park's rose garden is a surprisingly peaceful place for those last-weeks waddles.",
    hospitalDetails: [
      { name: "St. Joseph's Medical Center", paragraph: "St. Joseph's features a Level III NICU and has been a trusted maternity provider in Stockton for decades, serving families across San Joaquin County. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Dameron Hospital", paragraph: "Dameron Hospital offers a Level III NICU and serves as a vital community hospital, particularly for families in central and south Stockton. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Stockton", paragraph: "There are no freestanding birth centers in Stockton currently. Families seeking out-of-hospital birth typically work with a licensed midwife for a home birth, or travel to the Bay Area for birth center options." }
    ],
    medicaidNote: "California covers doula services through Medi-Cal — since January 2023, you can receive up to ~$1,587 in doula coverage. Stockton has a high Medi-Cal enrollment, so this coverage makes a real difference for local families.",
    insuranceNote: "Medi-Cal covers a significant portion of Stockton families, and doula coverage is now accessible without prior authorization. For those with private insurance, check your plan — some San Joaquin County and healthcare employer plans include doula benefits.",
    faqs: [
      { q: "How much does a doula cost in Stockton?", a: "In Stockton, a birth doula typically costs $900–$2,000, more affordable than Bay Area rates. Many Stockton doulas offer flexible payment arrangements, and if you have Medi-Cal, your doula could be fully covered at up to ~$1,587." },
      { q: "Does California Medicaid cover doula services?", a: "Yes — Medi-Cal covers doula services up to ~$1,587 since 2023. Stockton's community health workers can help connect you with Medi-Cal enrolled doulas, or ask a doula directly if they accept Medi-Cal." },
      { q: "What hospitals in Stockton have the highest level NICU?", a: "Both St. Joseph's Medical Center and Dameron Hospital have Level III NICUs. For the highest Level IV NICU care, families are typically referred to UC Davis in Sacramento." },
      { q: "Are there birth centers in Stockton?", a: "There are no freestanding birth centers in Stockton. Home birth with a licensed midwife is available locally, or you can look at birth center options in the Bay Area if you're willing to travel." },
      { q: "Can I bring my doula to hospitals in Stockton?", a: "Yes — St. Joseph's and Dameron both allow doulas to accompany you during labor. It's always smart to call the maternity unit ahead of your delivery to confirm their current support-person policies." },
      { q: "What postpartum resources are available in Stockton?", a: "Stockton offers postpartum support through the San Joaquin County Black Infant Health Program, WIC lactation consultants at community clinics, the Comprehensive Perinatal Services Program (CPSP) at local health centers, and parenting groups through the Family Resource and Referral Center." }
    ],
    nearbyCities: ["sacramento-ca", "fresno-ca", "oakland-ca", "san-francisco-ca"],
  },
  "buffalo-ny": {
    city: "Buffalo",
    state: "NY",
    slug: "buffalo-ny",
    costLow: 1000,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Buffalo's birth community is tight-knit and resilient — just like the city itself. You'll find doulas here who serve across communities from the West Side to the East Side, many connected through grassroots birth-justice organizing that centers Black and Brown mamas. There's a growing movement here to reclaim birth as a community experience, not just a medical one.",
    heroLocalDetail: "At 38 weeks, you're probably mapping the fastest route from your place in the Elmwood Village or Allentown to your hospital near the medical campus on High Street — hoping the 33 isn't a mess. Delaware Park and Hoyt Lake give you a flat, gorgeous walking loop for those final pregnancy strolls, and Canalside along the water is refreshing when you need easy movement.",
    hospitalDetails: [
      { name: "John R. Oishei Children's Hospital", paragraph: "Oishei Children's Hospital is Western New York's premier pediatric facility with a Level IV NICU — the highest level — and a dedicated high-risk maternity program. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Mercy Hospital of Buffalo", paragraph: "Mercy Hospital offers a Level III NICU and a well-established maternity program serving families in South Buffalo and the broader region. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Buffalo", paragraph: "There are currently no freestanding birth centers in Buffalo. Some families pursue home birth with a licensed midwife, but the out-of-hospital birth infrastructure is still growing in Western New York." }
    ],
    medicaidNote: "New York Medicaid covers doula services — since January 2024, you can receive up to ~$1,710 in doula coverage for prenatal, labor, and postpartum support. Contact your Medicaid managed care plan to find an enrolled doula near you.",
    insuranceNote: "NY Medicaid doula coverage launched in January 2024, and Buffalo's community doulas have been enrolling. New York also now requires commercial insurance plans to cover doula services — check with your employer plan for benefits.",
    faqs: [
      { q: "How much does a doula cost in Buffalo?", a: "In Buffalo, a birth doula typically costs $1,000–$2,500. With NY Medicaid now covering doulas up to ~$1,710, many families can access doula support at little to no out-of-pocket cost." },
      { q: "Does New York Medicaid cover doula services?", a: "Yes — since January 2024, NY Medicaid covers doula services up to ~$1,710. Call your Medicaid managed care plan to get a list of enrolled doulas, or ask a doula you're interested in if they accept Medicaid." },
      { q: "What hospitals in Buffalo have the highest level NICU?", a: "Oishei Children's Hospital has a Level IV NICU — the highest level available — making it the go-to for the most complex neonatal needs in Western New York. Mercy Hospital offers a Level III NICU." },
      { q: "Are there birth centers in Buffalo?", a: "There are no freestanding birth centers currently operating in Buffalo. Home birth with a licensed midwife is an option, though the community birth center movement is still building in this area." },
      { q: "Can I bring my doula to hospitals in Buffalo?", a: "Yes — Oishei Children's Hospital and Mercy Hospital both allow doulas as part of your support team. Call the maternity unit ahead of time to confirm their current visitor and support-person policies." },
      { q: "What postpartum resources are available in Buffalo?", a: "Buffalo offers the Erie County WIC program's lactation consultants, the Buffalo Prenatal Perinatal Network's home visiting program, Jericho Road Community Health Center for culturally responsive care, and postpartum depression support groups through the Mental Health Advocates of WNY." }
    ],
    nearbyCities: ["rochester-ny", "albany-ny", "new-york-ny"],
  },
  "rochester-ny": {
    city: "Rochester",
    state: "NY",
    slug: "rochester-ny",
    costLow: 1000,
    costHigh: 2400,
    shelbiServesHere: false,
    culture: "Rochester's birth community is fueled by a powerful legacy — this is the home of Susan B. Anthony and a long tradition of women's advocacy, and that energy carries into today's birth-justice movement. You'll find a growing network of doulas here, especially organizers who center Black maternal health and who are pushing hard for equitable birth outcomes across the city's diverse neighborhoods.",
    heroLocalDetail: "At 38 weeks, you're probably mapping the fastest route from your place in the South Wedge or Park Avenue area to your hospital near the University of Rochester medical campus on Elmwood Avenue. The Genesee Riverway Trail near High Falls gives you flat, scenic walking for those final pregnancy strolls, and Cobb's Hill Park offers a short loop with a view when you need a change of scene.",
    hospitalDetails: [
      { name: "Strong Memorial Hospital (Golisano Children's)", paragraph: "Strong Memorial's Golisano Children's Hospital features a Level IV NICU — the highest level — and is the region's top referral center for high-risk pregnancies and complex neonatal needs. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Rochester General Hospital", paragraph: "Rochester General offers a Level III NICU and a well-established family maternity center serving the greater Rochester community. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Rochester", paragraph: "There are currently no freestanding birth centers in Rochester. Home birth with a licensed midwife is available, and some families travel to birth centers in the Syracuse area for out-of-hospital options." }
    ],
    medicaidNote: "New York Medicaid covers doula services — since January 2024, you can receive up to ~$1,710 in doula coverage for prenatal, labor, and postpartum support. Contact your Medicaid managed care plan to find an enrolled doula near you.",
    insuranceNote: "NY Medicaid doula coverage took effect in January 2024, and Rochester doulas are actively enrolling. New York now also requires commercial insurance plans to cover doula services — contact your insurer to learn about your benefits.",
    faqs: [
      { q: "How much does a doula cost in Rochester?", a: "In Rochester, a birth doula usually costs $1,000–$2,400. With NY Medicaid covering up to ~$1,710, many families can get doula support fully covered — and many Rochester doulas also offer payment plans or sliding-scale spots." },
      { q: "Does New York Medicaid cover doula services?", a: "Yes! Since January 2024, NY Medicaid covers doula services up to ~$1,710. Reach out to your Medicaid managed care plan for a list of enrolled doulas, or ask a doula you love if they accept Medicaid." },
      { q: "What hospitals in Rochester have the highest level NICU?", a: "Strong Memorial Hospital's Golisano Children's Hospital has a Level IV NICU — the highest level — and is the regional referral center for the most complex cases. Rochester General offers a Level III NICU." },
      { q: "Are there birth centers in Rochester?", a: "There are no freestanding birth centers in Rochester right now. Home birth with a licensed midwife is an option, or you'd need to travel to Syracuse for the nearest birth center." },
      { q: "Can I bring my doula to hospitals in Rochester?", a: "Yes — Strong Memorial and Rochester General both welcome doulas as part of your labor support team. Call your hospital's maternity unit before your due date to confirm their current policies." },
      { q: "What postpartum resources are available in Rochester?", a: "Rochester has solid postpartum resources: the Monroe County WIC program's lactation services, Highland Hospital midwifery practice's postpartum care, the Baby Love Program at Anthony L. Jordan Health Center for Black moms, and the Perinatal Network of Monroe County for peer support and referrals." }
    ],
    nearbyCities: ["buffalo-ny", "albany-ny", "new-york-ny"],
  },
  "albany-ny": {
    city: "Albany",
    state: "NY",
    slug: "albany-ny",
    costLow: 1000,
    costHigh: 2300,
    shelbiServesHere: false,
    culture: "Albany's birth community is small but mighty, bolstered by the state capital's connection to health policy and a growing grassroots birth-justice movement. You'll find doulas here who serve the Capital Region with heart — from community-based doulas serving Black and Brown families to midwives who've been attending births in this area for decades. It's a place where your birth team knows you by name.",
    heroLocalDetail: "At 38 weeks, you're probably mapping the fastest route from your place in Center Square or Pine Hills to your hospital on New Scotland Avenue — calculating whether Madison or Western is the quicker drive. Washington Park gives you a flat, beautiful walking loop for those final pregnancy strolls, and the Corning Preserve along the Hudson River is peaceful when you need easy movement near the water.",
    hospitalDetails: [
      { name: "Albany Medical Center", paragraph: "Albany Medical Center features a Level IV NICU — the highest level — and serves as the Capital Region's major referral center for high-risk pregnancies and complex neonatal care. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "St. Peter's Hospital", paragraph: "St. Peter's Hospital offers a Level III NICU and a well-respected family maternity center serving Albany and the broader Capital Region. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "No birth centers in Albany", paragraph: "There are currently no freestanding birth centers in Albany. Home birth with a licensed midwife is an option, and some Capital Region midwives offer home-birth services as an alternative to hospital delivery." }
    ],
    medicaidNote: "New York Medicaid covers doula services — since January 2024, you can receive up to ~$1,710 in doula coverage for prenatal, labor, and postpartum support. Contact your Medicaid managed care plan to find an enrolled doula near you.",
    insuranceNote: "NY Medicaid doula coverage launched in January 2024 and is rolling out across the Capital Region. New York also now requires commercial insurance plans to cover doula services — check with your employer plan or individual insurance for benefit details.",
    faqs: [
      { q: "How much does a doula cost in Albany?", a: "In Albany, a birth doula typically costs $1,000–$2,300. With NY Medicaid covering up to ~$1,710 since 2024, many families can access doula care with little to no out-of-pocket cost." },
      { q: "Does New York Medicaid cover doula services?", a: "Yes — since January 2024, NY Medicaid covers doula services up to ~$1,710. Contact your Medicaid managed care plan for enrolled doula lists, or ask doulas directly if they accept Medicaid." },
      { q: "What hospitals in Albany have the highest level NICU?", a: "Albany Medical Center has a Level IV NICU — the highest level — and is the Capital Region's top referral center for the most complex neonatal cases. St. Peter's Hospital offers a Level III NICU." },
      { q: "Are there birth centers in Albany?", a: "Not currently — there are no freestanding birth centers in Albany. Home birth with a licensed midwife is your closest out-of-hospital option." },
      { q: "Can I bring my doula to hospitals in Albany?", a: "Yes — Albany Medical Center and St. Peter's both allow doulas during labor and delivery. Call ahead to your hospital's maternity unit to confirm their current support-person policies." },
      { q: "What postpartum resources are available in Albany?", a: "Albany offers the Albany County WIC program for lactation support and nutrition, the REACH Program at Albany Med for high-risk moms, postpartum support groups through St. Peter's maternity services, and the Capital District Perinatal Network for peer support and home visiting programs." }
    ],
    nearbyCities: ["rochester-ny", "buffalo-ny", "new-york-ny", "hartford-ct"],
  },

  "oklahoma-city-ok": {
    city: "Oklahoma City",
    state: "OK",
    slug: "oklahoma-city-ok",
    costLow: 800,
    costHigh: 1500,
    shelbiServesHere: false,
    culture: "OKC sprawls hard — expect long drives between your OB office and the hospital district near NE 10th. The metro keeps growing, but maternity resources still cluster around the Health Center campus downtown, so plan your commute around rush hour on I-235 and I-40 if you\u2019re delivering anywhere near OU.",
    heroLocalDetail: "The main hospital district sits just northeast of downtown off NE 10th St; traffic on I-235 can back up badly during evening rush, so factor in an extra 15-20 minutes if you\u2019re driving from the south or west suburbs.",
    hospitalDetails: [
      { name: "OU Health University of Oklahoma Medical Center", paragraph: "OU Health is the big academic medical center on the Oklahoma Health Center campus — if you\u2019re high-risk or want a team that handles complex deliveries, this is where you go. They have a NICU for babies who need extra support (contact the hospital directly for current NICU level information). <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so you\u2019re ready to discuss your preferences at your first visit." },
      { name: "Mercy Hospital Oklahoma City", paragraph: "Mercy\u2019s maternity floor on Memorial Road is a popular pick for northwest OKC and Edmond families — solid L&D unit with private postpartum rooms and a well-baby nursery. They have a NICU for babies who need extra support; contact the hospital directly for current NICU level information." },
      { name: "Integris Baptist Medical Center", paragraph: "Integris Baptist sits in the heart of the OKC Health Center district near downtown and has a strong labor and delivery program with 24/7 anesthesiology coverage. They have a NICU for babies who need extra support; contact the hospital directly for current NICU level information." }
    ],
    birthCenterDetails: [],
    // Birth center search: NPI taxonomy 261QB0400X, Google Maps, and social media checked for Oklahoma City OK. No verified freestanding birth center found.
    medicaidNote: "Oklahoma SoonerCare started covering doula services in 2024 — the program reimburses certified doulas for prenatal, labor, and postpartum visits, so if you\u2019re on SoonerCare ask your provider about connecting with a Medicaid-enrolled doula.",
    insuranceNote: "Even without Medicaid, many OKC doulas offer sliding-scale payment, and you can typically use HSA or FSA funds for doula services — just ask for a superbill to submit for reimbursement.",
    faqs: [
      { q: "How much does a doula cost in Oklahoma City?", a: "In Oklahoma City, doula services typically range from $800 to $1,500 for a full birth package including prenatal visits, labor support, and postpartum follow-up. Some doulas offer sliding-scale pricing or payment plans." },
      { q: "Does Medicaid cover doulas in Oklahoma City?", a: "Yes — Oklahoma SoonerCare began covering doula services in 2024. Certified doulas enrolled with SoonerCare can be reimbursed for prenatal, labor and delivery, and postpartum support visits." },
      { q: "Which hospitals in Oklahoma City accommodate birth plans?", a: "OU Health University of Oklahoma Medical Center, Mercy Hospital Oklahoma City, and Integris Baptist Medical Center all have labor and delivery departments. There are currently no freestanding birth centers in the OKC metro." },
      { q: "Does True Joy Birthing work with Oklahoma City families?", a: "True Joy Birthing provides free birth-prep tools for Oklahoma City families. The free birth plan, checklist, and guided walkthrough in the app work for any Oklahoma City birth setting. The app also helps you connect with local doulas and midwives in your area." }
    ],
    nearbyCities: [],
  },
  "tulsa-ok": {
    city: "Tulsa",
    state: "OK",
    slug: "tulsa-ok",
    costLow: 750,
    costHigh: 1400,
    shelbiServesHere: false,
    culture: "Tulsa\u2019s hospital corridor runs right along the Utica/South Lewis strip near Saint Francis and Hillcrest — and if you live in Broken Arrow or Owasso, that drive down US-169 or Riverside can feel like forever in morning traffic. The local birth community here is smaller than OKC but mighty, with midwives and doulas who really know each other.",
    heroLocalDetail: "The Hillcrest and Saint Francis campuses are both located along S. Utica and E. 61st St respectively — parking at Hillcrest can be tight during shift changes, so arrive early or use the valet if it\u2019s available.",
    hospitalDetails: [
      { name: "Hillcrest Medical Center", paragraph: "Hillcrest is right off Utica and has been Tulsa\u2019s go-to for generations — their labor and delivery unit handles a high volume of births and they\u2019ve got a NICU for babies who need extra support. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> before your first OB visit. Contact Hillcrest directly for current NICU level information." },
      { name: "Saint Francis Hospital", paragraph: "Saint Francis on 61st and Yale is the biggest hospital in Tulsa and has a strong maternity program with 24/7 anesthesiology on deck. They have a NICU for babies who need extra care; contact the hospital directly for current NICU level information." },
      { name: "OU Health Tulsa", paragraph: "OU Health Tulsa brings the academic medicine of OU to the northeast part of the state — their OB/GYN team handles routine and high-risk pregnancies, and they coordinate closely with the Oklahoma City campus for complex cases." }
    ],
    birthCenterDetails: [],
    // Birth center search: NPI taxonomy 261QB0400X, Google Maps, and social media checked for Tulsa OK. No verified freestanding birth center found.
    medicaidNote: "Oklahoma SoonerCare covers doula care for enrolled members — Tulsa County doulas who are SoonerCare-certified can bill for prenatal, birth-day, and postpartum visits, so ask your clinic if they can refer you to one.",
    insuranceNote: "Several Tulsa doulas offer tiered pricing or package discounts, and many accept HSA/FSA payments — it\u2019s worth asking about payment plans upfront since out-of-pocket rates in Tulsa run a bit lower than the national average.",
    faqs: [
      { q: "How much does a doula cost in Tulsa?", a: "In Tulsa, you can expect doula services to range from about $750 to $1,400 for a complete birth support package. Some doulas offer postpartum-only packages starting around $25/hour." },
      { q: "Does Medicaid cover doulas in Tulsa?", a: "Yes — SoonerCare Oklahoma began reimbursing certified doulas in 2024, including those practicing in Tulsa. Talk to your SoonerCare provider or search for SoonerCare-enrolled doulas in the Tulsa area." },
      { q: "Which hospitals in Tulsa accommodate birth plans?", a: "Hillcrest Medical Center, Saint Francis Hospital, and OU Health Tulsa all have labor and delivery units. There are no freestanding birth centers currently operating in the Tulsa metro area." },
      { q: "Does True Joy Birthing work with Tulsa families?", a: "True Joy Birthing provides free birth-prep tools for Tulsa families. The free birth plan, checklist, and guided walkthrough in the app work for any Tulsa birth setting. The app also helps you connect with local doulas and midwives in your area." }
    ],
    nearbyCities: ["oklahoma-city-ok"],
  },
  "columbus-oh": {
    city: "Columbus",
    state: "OH",
    slug: "columbus-oh",
    costLow: 900,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Columbus is a sprawl of cool neighborhoods — from Clintonville to the Short North — but when you\u2019re pregnant, what matters is that most L&D action clusters around Riverside Methodist up on Olentangy River Rd and OSU\u2019s Wexner campus off 315. If you live out in Hilliard or Dublin, that midday drive up 315 is a breeze, but factor in rush-hour parking time at Riverside because that lot fills fast.",
    heroLocalDetail: "Riverside Methodist\u2019s maternity entrance faces Olentangy River Road — the parking garage directly attached to the Women\u2019s Pavilion can have a line on weekday mornings, so plan to arrive at least 20 minutes before any scheduled appointment.",
    hospitalDetails: [
      { name: "OhioHealth Riverside Methodist Hospital", paragraph: "Riverside Methodist is Columbus\u2019s busiest maternity hospital, delivering over 8,000 babies a year — they\u2019ve got a verified Level III NICU on-site and a dedicated Women\u2019s Pavilion that makes the whole check-in process smoother. <a href=\"/birth-plan-template/\">Download your free birth plan template</a> to bring to your first Riverside appointment." },
      { name: "The Ohio State University Wexner Medical Center", paragraph: "Wexner\u2019s Maternity Center at OSU handles both routine and high-risk pregnancies with an academic OB team, and they\u2019ve got a verified Level III NICU on-site for babies who need specialized care right after delivery." },
      { name: "Mount Carmel East Hospital", paragraph: "Mount Carmel East on the east side of Columbus has a solid maternity program with labor, delivery, and recovery suites — great option if you live in Reynoldsburg, Pataskala, or further east and don\u2019t want to drive across town when contractions start." }
    ],
    birthCenterDetails: [],
    // Birth center search: NPI taxonomy 261QB0400X, Google Maps, and social media checked for Columbus OH. No verified freestanding birth center found.
    medicaidNote: "Ohio Medicaid began covering doula services in 2024 — the state added doulas as an eligible provider type, so if you\u2019re on Ohio Medicaid you can find a certified doula who accepts your plan and get prenatal, labor, and postpartum visits covered.",
    insuranceNote: "In Columbus, you\u2019ll find doulas who take HSA/FSA cards directly, and several collectives like Central Ohio Doulas offer sliding-scale packages — always ask about payment plan options since costs vary widely between individual doulas and groups.",
    faqs: [
      { q: "How much does a doula cost in Columbus?", a: "Columbus doula services range from about $900 to $2,000 for a full birth package, with some experienced doulas charging above that. Postpartum-only support typically runs $30\u2013$50 per hour." },
      { q: "Does Medicaid cover doulas in Columbus?", a: "Yes — Ohio Medicaid began covering doula services in 2024. You can find certified doulas who accept Medicaid through the Ohio Department of Medicaid provider directory or by asking your OB clinic." },
      { q: "Which hospitals in Columbus accommodate birth plans?", a: "OhioHealth Riverside Methodist Hospital, The Ohio State University Wexner Medical Center, and Mount Carmel East Hospital all have active L&D departments. There are no freestanding birth centers currently operating in the Columbus metro area." },
      { q: "Does True Joy Birthing work with Columbus families?", a: "True Joy Birthing provides free birth-prep tools for Columbus families. The free birth plan, checklist, and guided walkthrough in the app work for any Columbus birth setting. The app also helps you connect with local doulas and midwives in your area." }
    ],
    nearbyCities: ["detroit-mi", "pittsburgh-pa"],
  },
  "cleveland-oh": {
    city: "Cleveland",
    state: "OH",
    slug: "cleveland-oh",
    costLow: 900,
    costHigh: 2200,
    shelbiServesHere: false,
    culture: "Cleveland moms will tell you — everything healthcare-wise funnels toward the Clinic or University Hospitals, both clustered near University Circle on the east side. If you live in Westlake or Avon, that commute down I-90 and into the Health Campus can turn ugly in winter lake-effect snow, so have a backup route and a packed hospital bag by 35 weeks.",
    heroLocalDetail: "Cleveland Clinic\u2019s main campus sits at 9500 Euclid Avenue — if you\u2019re coming from the western suburbs, take I-90 to E. 72nd or use the MLK exit off I-90 rather than battling downtown traffic, and give yourself extra time in winter weather.",
    hospitalDetails: [
      { name: "Cleveland Clinic", paragraph: "Cleveland Clinic\u2019s main campus on Euclid Avenue handles high-volume, high-complexity maternity care — they\u2019ve got a verified Level III NICU and the full weight of a world-class academic medical team behind them. <a href=\"/birth-plan-template/\">Start your birth plan free</a> so you\u2019re ready to discuss your preferences at your first visit." },
      { name: "University Hospitals MacDonald Women\u2019s Hospital", paragraph: "MacDonald Women\u2019s Hospital (part of UH) specializes exclusively in women\u2019s and neonatal health — one of the only stand-alone women\u2019s hospitals in the country, with a verified Level III NICU right next door at UH Rainbow Babies & Children\u2019s." },
      { name: "MetroHealth Medical Center", paragraph: "MetroHealth is Cleveland\u2019s public hospital on the near west side and has a strong maternity program serving a diverse community — they offer comprehensive prenatal care and have a NICU for babies who need extra support. Contact MetroHealth directly for current NICU level information." }
    ],
    birthCenterDetails: [],
    // Birth center search: NPI taxonomy 261QB0400X, Google Maps, and social media checked for Cleveland OH. No verified freestanding birth center found.
    medicaidNote: "Ohio Medicaid includes doula services as a covered benefit starting in 2024 — Cleveland-area doulas who complete state certification can bill Medicaid directly for your prenatal, birth, and postpartum appointments.",
    insuranceNote: "Many Cleveland doulas accept HSA and FSA payments, and a few local organizations like Birthing Beautiful Communities offer low-cost or free doula support to qualifying families — check both options before assuming you can\u2019t afford one.",
    faqs: [
      { q: "How much does a doula cost in Cleveland?", a: "Cleveland doula packages typically run $900 to $2,200, with experienced doulas and those affiliated with hospitals like the Clinic or UH sometimes at the higher end. Postpartum doula rates average $30\u2013$50/hour." },
      { q: "Does Medicaid cover doulas in Cleveland?", a: "Yes — Ohio Medicaid added doula coverage in 2024. Certified doulas in the Cleveland area can enroll as Medicaid providers, covering your prenatal visits, labor support, and postpartum care at no out-of-pocket cost to you." },
      { q: "Which hospitals in Cleveland accommodate birth plans?", a: "Cleveland Clinic, University Hospitals MacDonald Women\u2019s Hospital, and MetroHealth Medical Center all have L&D departments. There are no freestanding birth centers currently operating in the Cleveland area." },
      { q: "Does True Joy Birthing work with Cleveland families?", a: "True Joy Birthing provides free birth-prep tools for Cleveland families. The free birth plan, checklist, and guided walkthrough in the app work for any Cleveland birth setting. The app also helps you connect with local doulas and midwives in your area." }
    ],
    nearbyCities: ["pittsburgh-pa", "detroit-mi"],
  },
  "indianapolis-in": {
    city: "Indianapolis",
    state: "IN",
    slug: "indianapolis-in",
    costLow: 800,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Indy\u2019s maternity care revolves around the IU Health campus just west of downtown and the Community/Ascension hospitals ringing the suburbs. If you\u2019re delivering at IU Health Methodist, you\u2019re right next to the IUPUI campus where parking garages and construction detours change constantly — leave yourself extra time, especially if you\u2019re coming from Carmel or Fishers down I-465 and 65.",
    heroLocalDetail: "IU Health Methodist Hospital sits at 1514 N. Senate Blvd just northwest of downtown — the Senate Blvd entrance by the Women\u2019s Tower is the one you want for L&D check-in, not the main emergency entrance on the south side of the building.",
    hospitalDetails: [
      { name: "IU Health Methodist Hospital", paragraph: "Methodist is the flagship of IU Health\u2019s maternity network in Indy — they handle the highest volume of births in the state and staff a verified Level III NICU through the adjacent Riley Hospital for Children. <a href=\"/birth-plan-template/\">Start with your free birth plan</a> so your preferences are documented before you walk in." },
      { name: "Ascension St. Vincent Hospital Indianapolis", paragraph: "St. Vincent on 86th St is the go-to for north side families — they\u2019ve got a well-established maternity program with private LDRP suites and 24/7 in-house OB coverage. They have a NICU for babies who need extra support; contact the hospital directly for current NICU level information." },
      { name: "Community Hospital East", paragraph: "Community East on the east side serves families from Lawrence, Greenfield, and Cumberland — solid L&D unit with a community feel and lower volume than the downtown hospitals, which some moms appreciate for more personalized attention." }
    ],
    birthCenterDetails: [],
    // Birth center search: NPI taxonomy 261QB0400X, Google Maps, and social media checked for Indianapolis IN. No verified freestanding birth center found.
    medicaidNote: "Indiana Medicaid began covering doula services under HB 1008 effective January 1, 2025 — if you have Hoosier Healthwise or traditional Medicaid, you can work with a state-certified doula at no cost for prenatal, delivery, and postpartum visits.",
    insuranceNote: "Several Indy doulas accept HSA/FSA and some offer need-based sliding scales — the Indiana Doula Association maintains a directory of doulas organized by fee range, which makes it easier to find someone who fits your budget.",
    faqs: [
      { q: "How much does a doula cost in Indianapolis?", a: "Indianapolis doula packages generally range from $800 to $1,800 for full birth support including prenatal visits, labor attendance, and postpartum follow-up. Postpartum-only packages start around $25\u2013$40/hour." },
      { q: "Does Medicaid cover doulas in Indianapolis?", a: "Yes — Indiana\u2019s HB 1008 extended Medicaid doula coverage starting January 2025. If you\u2019re on Hoosier Healthwise or traditional Medicaid, you can receive doula services at no cost from a state-certified provider." },
      { q: "Which hospitals in Indianapolis accommodate birth plans?", a: "IU Health Methodist Hospital, Ascension St. Vincent Hospital Indianapolis, and Community Hospital East all have L&D departments. There are no freestanding birth centers currently operating in the Indianapolis metro area." },
      { q: "Does True Joy Birthing work with Indianapolis families?", a: "True Joy Birthing provides free birth-prep tools for Indianapolis families. The free birth plan, checklist, and guided walkthrough in the app work for any Indianapolis birth setting. The app also helps you connect with local doulas and midwives in your area." }
    ],
    nearbyCities: [],
  },
  "reno-nv": {
    city: "Reno",
    state: "NV",
    slug: "reno-nv",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "Reno is northern Nevada\u2019s healthcare hub, drawing families from across the Truckee Meadows and Sierra foothills. The birth community is small but tight-knit \u2014 a mix of hospital-based and home-birth midwives, doulas who serve both Reno and Sparks, and military families from the region\u2019s installations. Expect a pragmatic, Western-independence vibe where asking for help isn\u2019t weakness \u2014 it\u2019s how you show up prepared.",
    heroLocalDetail: "Reno\u2019s two birthing hospitals \u2014 Renown Regional Medical Center near downtown at 1155 Mill Street and Sierra Medical Center in south Reno at 6500 Longley Lane \u2014 are roughly 20 minutes apart via I-580. Both hospitals have verified Level III NICUs (verified on renown.org and northernnevadahealth.com), so high-acuity newborns don\u2019t need to transfer to Las Vegas or Sacramento. I-580 and I-80 form the Spaghetti Bowl interchange downtown, which backs up during morning and evening rush; if you\u2019re coming from Spanish Springs or Cold Springs, South Virginia Street to Renown is usually faster than battling I-80. Summers break 95\u00B0F regularly and winter Sierra snowstorms can slow the hospital drive \u2014 know your route before 38 weeks. The Truckee River Walk and Idlewild Park loop are popular third-trimester strolls close to Renown.",
    hospitalDetails: [
      { name: "Renown Regional Medical Center", paragraph: "Renown Regional Medical Center, in central Reno at 1155 Mill Street, is the largest hospital in northern Nevada and home to Renown Children\u2019s Hospital with a verified Level III NICU \u2014 the region\u2019s first and only Level III NICU. High-volume L&D with 24/7 neonatology, maternal-fetal medicine, and obstetric anesthesiology. Doulas are generally welcome, though visitor policies shift, so confirm during your hospital tour. If you\u2019re delivering at Renown, having your birth plan in hand makes check-in smoother \u2014 they see a lot of families and move fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Sierra Medical Center", paragraph: "Sierra Medical Center, in south Reno at 6500 Longley Lane, is the newer addition to the Northern Nevada Health System. It has a Level III NICU (verified on northernnevadahealth.com) and a dedicated Family Birth Center with LDRP suites. Sierra consolidated the maternity services that were previously at the Sparks campus, so all L&D now happens here. The south Reno location is convenient for families in the Damonte Ranch, Galena, and south Truckee Meadows areas \u2014 about 10 minutes from I-580 and the South Meadows Parkway interchange. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> before your tour." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Reno, Sparks, and Washoe County. Google Maps search "birth center Reno NV" found
    // no freestanding birth centers. Verified 2026-05-27. Families seeking out-of-hospital
    // birth work with licensed home-birth midwives; closest freestanding birth centers
    // are in the Sacramento, CA area (~130 miles west).
    birthCenterDetails: [],
    medicaidNote: "Nevada Medicaid does NOT cover doula services as of 2026. HSA and FSA funds can be used for doula fees, and some doulas in the Reno area offer sliding-scale pricing. Community-based programs through the Washoe County Health District\u2019s Maternal & Child Health division and local birth equity collectives may offer reduced-cost or volunteer doula support \u2014 ask individual doulas what\u2019s available.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Reno area. Check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Reno?", a: "Not yet \u2014 Nevada Medicaid does not currently cover doula services. But you still have options: HSA and FSA funds can cover doula fees, some local doulas offer sliding-scale rates, and community collectives may provide reduced-cost support. It\u2019s worth asking any doula you interview about payment flexibility." },
      { q: "How much does a doula cost in Reno?", a: "Expect to pay $800 to $2,000 for a birth doula in Reno. That typically covers prenatal visits, labor support, and a postpartum check-in. The range depends on experience level and what\u2019s included. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to figure out what matters most to you before you interview doulas." },
      { q: "Does True Joy Birthing work with Reno families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Reno birth setting, whether you\u2019re delivering at Renown, Sierra, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way." },
      { q: "Are there doulas in Reno?", a: "Reno has a small but growing doula community. If local availability is tight, virtual support and the free birth plan app can help you prepare. You can also use the True Joy Birthing app to find local doulas \u2014 start there and interview a few until one clicks." },
      { q: "Can my doula come to the hospital with me in Reno?", a: "Yes \u2014 both Renown Regional Medical Center and Sierra Medical Center allow doulas in L&D. Policies can change, especially during flu season or COVID surges, so confirm with your hospital during your tour. Having your birth plan ready helps your care team know your preferences from the moment you walk in." },
    ],
    nearbyCities: ["las-vegas-nv"],
  },
  "tucson-az": {
    city: "Tucson",
    state: "AZ",
    slug: "tucson-az",
    costLow: 800,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Tucson\u2019s birth community is a blend of university-town progressiveness and Desert Southwest independence. The University of Arizona\u2019s medical center anchors high-risk perinatal care for all of southern Arizona, drawing families from towns 100+ miles away. The local doula network is small but active \u2014 organizations like Doula Train Pima County and the Arizona Birth Network connect families with sliding-scale and community-based support.",
    heroLocalDetail: "Tucson\u2019s two largest delivery hospitals \u2014 Tucson Medical Center and Banner University Medical Center \u2014 sit roughly six miles apart on the city\u2019s midtown east side, reachable within 15\u201325 minutes from most neighborhoods. But expect I-10 and Speedway Boulevard congestion during morning and evening rush, especially near the UA campus. The Santa Catalina Mountains frame the northern skyline, and summer monsoon storms from July through September can dump rain fast and flood low-lying roads near the Rillito River wash \u2014 plan alternate routes if you live near a wash. Northwest Medical Center in Marana serves the growing northwest suburbs about 20 minutes beyond the city center. Winters are mild and dry, with daytime highs in the mid-60s, making the hospital drive far less weather-dependent than in colder climates.",
    hospitalDetails: [
      { name: "Tucson Medical Center", paragraph: "Tucson Medical Center, at 5301 E Grant Road in midtown, is the city\u2019s largest hospital and a Mayo Clinic Care Network member with a Special Care Nursery (estimated Level II equivalent) for babies who need extra support. TMC handles a high volume of births \u2014 roughly 3,500 per year \u2014 and has 24/7 obstetric anesthesiology and maternal-fetal medicine on-site. Higher-level NICU cases are typically transferred to Banner\u2019s Diamond Children\u2019s across town. <a href=\"/birth-plan-template/\">Use our free birth plan template</a> to get your preferences in order before your tour." },
      { name: "Banner University Medical Center Tucson", paragraph: "Banner University Medical Center Tucson, at 1501 N Campbell Avenue, is the University of Arizona\u2019s academic medical center and home to Banner Children\u2019s at Diamond Children\u2019s Medical Center with a verified Level III NICU (stated directly on bannerhealth.com). This is southern Arizona\u2019s highest-level NICU and the regional referral center for complex pregnancies and critically ill newborns. The academic setting means OB-GYN residents and maternal-fetal medicine specialists are always on-site. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> to have your preferences ready." },
      { name: "Northwest Medical Center", paragraph: "Northwest Medical Center, at 6200 N La Cholla Boulevard in northwest Tucson/Marana, serves the growing northwest suburbs. It has a NICU for babies who need extra support \u2014 contact the hospital directly for current NICU level designation. Northwest is a community-hospital alternative to the two big academic centers, with a more intimate Women\u2019s Center and private labor rooms. If you\u2019re delivering on the northwest side, it\u2019s the closest option \u2014 about 10 minutes from the I-10/La Cholla interchange." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Tucson and Pima County. Google Maps search "birth center Tucson AZ" found no
    // freestanding birth centers currently operating. El Rio Health provides midwifery
    // services in conjunction with TMC but is not a freestanding birth center.
    // Verified 2026-05-27.
    birthCenterDetails: [],
    medicaidNote: "Arizona\u2019s AHCCCS (Medicaid) does NOT cover doula services as of 2026. State legislation for doula coverage has been proposed but not yet enacted. HSA and FSA funds can cover doula fees, and community organizations like Doula Train Pima County offer sliding-scale or reduced-cost support. Check with individual doulas about payment options.",
    insuranceNote: "Since AHCCCS doesn\u2019t cover doulas in Arizona, check whether your private insurance covers out-of-network doula services. HSA and FSA funds can be used for doula fees \u2014 ask your doula for a superbill for reimbursement. Contact your provider directly to confirm what\u2019s covered.",
    faqs: [
      { q: "Does Medicaid cover doulas in Tucson?", a: "Not yet \u2014 Arizona\u2019s AHCCCS does not currently reimburse doula services. But you still have options: HSA and FSA funds can cover doula fees, and organizations like Doula Train Pima County and the Arizona Birth Network connect families with sliding-scale support. Ask any doula you interview about payment flexibility." },
      { q: "How much does a doula cost in Tucson?", a: "Expect to pay $800 to $1,800 for a birth doula in Tucson. The range depends on experience level and what\u2019s included (prenatal visits, labor support, postpartum check-ins). College-town doulas and student programs sometimes offer lower rates. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to figure out your priorities." },
      { q: "Does True Joy Birthing work with Tucson families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Tucson birth setting, whether you\u2019re delivering at TMC, Banner, Northwest, or at home. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way." },
      { q: "Are there doulas in Tucson?", a: "Tucson has an active doula community, from independent birth doulas to organizations like Doula Train Pima County that offer sliding-scale support. The Arizona Birth Network maintains a local provider directory. Start with the True Joy Birthing app to find local doulas, and interview a few until one feels right." },
      { q: "Can my doula come to the hospital with me in Tucson?", a: "Yes \u2014 TMC, Banner UMC, and Northwest Medical Center all allow doulas in labor and delivery. Visitor policies can shift, especially during flu season, so confirm with your hospital during your tour. Having a birth plan ready helps your care team support your preferences from the start." },
    ],
    nearbyCities: ["phoenix-az"],
  },
  "memphis-tn": {
    city: "Memphis",
    state: "TN",
    slug: "memphis-tn",
    costLow: 700,
    costHigh: 1700,
    shelbiServesHere: false,
    culture: "Memphis sits in Shelby County, which has one of the highest Black infant mortality rates in Tennessee \u2014 and a powerful, growing community fighting to change that. Organizations like CHOICES and A Better Balanced Birth center reproductive justice and Black maternal health equity. The birth community here is rooted, resilient, and deeply connected to the rhythms of a city where family and faith run everything.",
    heroLocalDetail: "Memphis\u2019s three major hospital systems \u2014 Methodist Le Bonheur, Baptist Memorial, and Regional One Health \u2014 are clustered within the Memphis Medical District off Poplar Avenue and Union Avenue, roughly 10\u201320 minutes from most neighborhoods. I-240 forms a loop around the center of the city and can back up badly during rush hour, especially near the Poplar and Union exits. If you\u2019re coming from Germantown or Collierville on the east side, plan an extra 15\u201320 minutes for appointments. Le Bonheur Children\u2019s Hospital provides the region\u2019s highest-level NICU right on the Methodist campus. Summers are brutally hot and humid \u2014 regularly above 95\u00B0F from June through September \u2014 and winter ice storms can briefly shut down overpasses. Overton Park and the Greenline are popular third-trimester walking spots near the hospitals.",
    hospitalDetails: [
      { name: "Methodist University Hospital (Methodist Le Bonheur)", paragraph: "Methodist University Hospital, at 1265 Union Avenue in the Memphis Medical District, is the largest hospital in the Methodist Le Bonheur system and is affiliated with the University of Tennessee Health Science Center. Le Bonheur Children\u2019s Hospital \u2014 on the same campus \u2014 has a verified Level IV NICU (stated directly on lebonheur.org), the highest-level NICU in the region, making this the referral destination for complex pregnancies and critically ill newborns across the Mid-South. The OB-GYN residency program means 24/7 coverage. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get your preferences documented." },
      { name: "Baptist Memorial Hospital-Memphis", paragraph: "Baptist Memorial Hospital-Memphis, at 6019 Walnut Grove Road in East Memphis, is the flagship of the Baptist Memorial Health Care system with 706 beds and a Level III NICU (contact the hospital directly for current NICU level verification). Walnut Grove is a major east\u2013west corridor, so getting here from Germantown and Collierville is straightforward during off-peak hours. Baptist is known for a more private, community-hospital feel compared to the academic centers, and its Women\u2019s Center offers LDRP suites. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> before your hospital tour." },
      { name: "Regional One Health", paragraph: "Regional One Health, at 877 Jefferson Avenue, is Shelby County\u2019s safety-net hospital and home to the Elvis Presley Trauma Center. It has a Level III NICU (contact the hospital directly for current NICU level verification) and provides high-volume OB services to TennCare and uninsured families. If you\u2019re delivering here, the staff is deeply experienced with a wide range of birth situations \u2014 and having a birth plan helps them support your preferences in a busy environment. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a>." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Memphis, Shelby County. Google Maps search found no freestanding birth centers
    // currently operating. CHOICES – Memphis Center for Reproductive Health provides
    // midwifery consultations but does not operate a freestanding birth center.
    // Verified 2026-05-27.
    birthCenterDetails: [],
    medicaidNote: "Tennessee\u2019s Medicaid program, TennCare, does NOT cover doula services as of 2026. HSA and FSA funds can be used for doula fees, and some Memphis doulas offer sliding-scale pricing. Organizations like A Better Balanced Birth and the Shelby County Health Department\u2019s community doula program may offer reduced-cost or pro-bono support \u2014 ask when you interview.",
    insuranceNote: "Since TennCare doesn\u2019t cover doulas, check whether your private insurance covers out-of-network doula services. HSA and FSA reimbursement is available nationwide for doula fees. Contact your provider directly to confirm coverage details.",
    faqs: [
      { q: "Does Medicaid cover doulas in Memphis?", a: "Not yet \u2014 TennCare does not currently reimburse doula services in Tennessee. But you still have options: HSA and FSA funds can cover doula fees, and organizations like A Better Balanced Birth and CHOICES offer sliding-scale or community-based support. Don\u2019t let insurance be the reason you go without a doula \u2014 ask about payment plans when you interview." },
      { q: "How much does a doula cost in Memphis?", a: "Expect to pay $700 to $1,700 for a birth doula in Memphis. Some community-based doulas offer reduced rates or payment plans, especially through organizations focused on Black maternal health equity. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you before you start interviewing." },
      { q: "Does True Joy Birthing work with Memphis families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Memphis birth setting \u2014 whether you\u2019re delivering at Methodist, Baptist, Regional One, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing." },
      { q: "Are there doulas in Memphis?", a: "Memphis has a growing doula community, including organizations like A Better Balanced Birth that focus on Black maternal health equity, and CHOICES for reproductive justice. The True Joy Birthing app can help you find local doulas \u2014 start there and interview a few until you find the right fit." },
      { q: "Can my doula come to the hospital with me in Memphis?", a: "Yes \u2014 Methodist Le Bonheur, Baptist Memorial, and Regional One Health all allow doulas in labor and delivery. Policies can shift during flu season or surges, so confirm during your hospital tour. Having your birth plan ready helps your care team understand and support your preferences." },
    ],
    nearbyCities: ["nashville-tn"],
  },
  "st-augustine-fl": {
    city: "St. Augustine",
    state: "FL",
    slug: "st-augustine-fl",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: false,
    culture: "St. Augustine blends historic coastal charm with a growing young-family demographic in communities like Nocatee and World Golf Village. The birth community is small \u2014 most families deliver at Flagler Hospital, the only L&D facility in St. Johns County \u2014 but doulas from Jacksonville make regular trips south. Coastal living means hot, humid summers and hurricane season awareness, but the pace of life here is gentler than Jacksonville\u2019s.",
    heroLocalDetail: "UF Health Flagler Hospital sits just off US 1 South and SR 207 in St. Augustine, about 10 minutes from historic downtown via US 1. From the beaches and A1A, expect slower traffic during tourist season (spring and summer) \u2014 especially on the Bridge of Lions and Anastasia Boulevard. Ponte Vedra families to the north can reach Flagler in about 15\u201320 minutes via A1A. Hurricane season (June through November) can affect hospital access when storms approach the coast; know your evacuation route and hospital alternatives in Jacksonville. The sidewalks along the bayfront and the St. Augustine Beach pier area flat, third-trimester-friendly walking spots.",
    hospitalDetails: [
      { name: "UF Health Flagler Hospital", paragraph: "UF Health Flagler Hospital, at 400 Health Park Boulevard in St. Augustine, is the only hospital providing labor and delivery services in all of St. Johns County. It has a Special Care Nursery for babies born at 32+ weeks gestation \u2014 contact the hospital directly for current NICU level designation. Higher-level NICU cases transfer to UF Health Jacksonville or Nemours Children\u2019s in Jacksonville. About 1,300 deliveries per year give it a community-hospital feel where the staff knows families by name. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get your preferences documented before your tour." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // St. Augustine and St. Johns County. Google Maps search found no freestanding
    // birth centers currently operating. Verified 2026-05-27. Families seeking
    // out-of-hospital birth would need to travel to Jacksonville or Gainesville.
    birthCenterDetails: [],
    medicaidNote: "Florida Medicaid covers doula services as of July 1, 2024, under SB 264. Coverage includes prenatal, labor and delivery, and postpartum doula visits. Doulas must be certified by approved organizations (such as DONA International or CAPPA) and enrolled as Florida Medicaid providers. If you\u2019re on Medicaid in St. Johns County, call your managed care plan to confirm doula coverage and find enrolled doulas \u2014 or check with UF Health Flagler\u2019s patient navigation team.",
    insuranceNote: "Florida Medicaid now covers doula services under SB 264. If you\u2019re not on Medicaid, check whether your private insurance covers out-of-network doula services. HSA and FSA funds can also be used for doula fees. Contact your provider directly to confirm what\u2019s covered under your plan.",
    faqs: [
      { q: "Does Medicaid cover doulas in St. Augustine?", a: "Yes! Florida Medicaid covers doula services as of July 2024 under SB 264. That includes prenatal visits, labor support, and postpartum care. If you\u2019re on Medicaid in St. Johns County, call your managed care plan and ask about doula coverage \u2014 they\u2019ll walk you through how to find an enrolled doula. You deserve support, and now your insurance helps pay for it." },
      { q: "How much does a doula cost in St. Augustine?", a: "Expect to pay $800 to $2,000 for a birth doula in St. Augustine. Some doulas serve both St. Augustine and Jacksonville, which can push the upper end higher. If you\u2019re on Medicaid, SB 264 may cover your doula at no cost. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to figure out your priorities." },
      { q: "Does True Joy Birthing work with St. Augustine families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any St. Augustine birth setting. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way." },
      { q: "Are there doulas in St. Augustine?", a: "St. Augustine has a small local doula community, and Jacksonville-based doulas regularly serve St. Augustine families. The True Joy Birthing app can help you find local doulas \u2014 start there and interview a few until one feels right." },
      { q: "Can my doula come to the hospital with me in St. Augustine?", a: "Yes \u2014 UF Health Flagler Hospital allows doulas in labor and delivery. Since Flagler is the only L&D hospital in St. Johns County, confirming your birth plan and doula arrangements during your hospital tour is especially important. Your doula will be familiar with Flagler\u2019s layout and policies." },
    ],
    nearbyCities: ["jacksonville-fl", "orlando-fl"],
  },
  "gainesville-fl": {
    city: "Gainesville",
    state: "FL",
    slug: "gainesville-fl",
    costLow: 700,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Gainesville is a classic college town powered by the University of Florida, and the birth community reflects that mix \u2014 academic medicine at Shands alongside community midwives and student-doula programs. The local doula network punches above its size, with organizations offering sliding-scale support and midwifery training through UF\u2019s nursing and public health programs. It\u2019s a place where evidence-based care meets Southern warmth.",
    heroLocalDetail: "UF Health Shands Hospital sits on Archer Road (SW 16th Avenue area), one of Gainesville\u2019s busiest corridors \u2014 expect heavy traffic during UF class times (8am\u20135pm, September through May). North Florida Regional Medical Center is on NW 6th Street near I-75, more accessible from west Gainesville and Alachua. Typical drive times within Gainesville are 10\u201320 minutes, but families coming from rural surrounds (High Springs, Micanopy, Alachua) may drive 30+ miles for care. Hot, humid summers consistently top 90\u00B0F with afternoon thunderstorms; mild winters mean weather rarely disrupts the hospital trip. The walking path around Sweetwater Branch Preserve and the Gainesville-Hawthorne State Trail are popular third-trimester spots.",
    hospitalDetails: [
      { name: "UF Health Shands Hospital", paragraph: "UF Health Shands Hospital, at 1600 SW Archer Road, is the University of Florida\u2019s academic medical center and one of only seven Baby-Friendly designated hospitals in Florida. Shands Children\u2019s Hospital houses a verified Level IV NICU (stated directly on ufhealth.org) \u2014 the highest-level NICU in the region and the referral center for critically ill newborns across north-central Florida. With maternal-fetal medicine specialists, 24/7 neonatology, and a high-risk pregnancy program, this is where families with complex pregnancies come from 100+ miles away. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get your preferences ready." },
      { name: "North Florida Regional Medical Center", paragraph: "North Florida Regional Medical Center, at 6500 NW 6th Street near I-75, serves northwest Gainesville and Alachua County\u2019s growing suburbs. It has a NICU for babies who need extra support \u2014 contact the hospital directly for current NICU level designation. North Florida Regional offers a more community-hospital feel than Shands, with private LDRP suites and a Women\u2019s Center that\u2019s popular with families on the west side. If you\u2019re delivering here, having your birth plan in hand helps the care team support your preferences from day one. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> before your tour." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Gainesville and Alachua County. Google Maps search found no freestanding birth
    // centers currently operating. Verified 2026-05-27. Families seeking out-of-hospital
    // birth connect with local home-birth midwives or travel to Ocala or Jacksonville.
    birthCenterDetails: [],
    medicaidNote: "Florida Medicaid covers doula services as of July 1, 2024, under SB 264. Coverage includes prenatal, labor and delivery, and postpartum doula visits. Doulas must be certified by approved organizations and enrolled as Florida Medicaid providers. UF Health Shands\u2019 patient navigation team can help connect Medicaid patients with enrolled doulas, and student-doula programs through UF may offer reduced-cost support.",
    insuranceNote: "Florida Medicaid now covers doula services under SB 264. If you\u2019re not on Medicaid, check whether your private insurance covers out-of-network doula services. HSA and FSA funds can also be used for doula fees. Contact your provider directly to confirm what\u2019s covered under your plan.",
    faqs: [
      { q: "Does Medicaid cover doulas in Gainesville?", a: "Yes! Florida Medicaid covers doula services as of July 2024 under SB 264. That includes prenatal visits, labor support, and postpartum care. If you\u2019re on Medicaid in Alachua County, call your managed care plan or ask UF Health\u2019s patient navigation team about finding an enrolled doula. You deserve support, and now your insurance helps pay for it." },
      { q: "How much does a doula cost in Gainesville?", a: "Expect to pay $700 to $1,800 for a birth doula in Gainesville. College-town pricing can be slightly lower than coastal Florida, and student-doula programs through UF may offer reduced rates. If you\u2019re on Medicaid, SB 264 may cover your doula at no cost. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to figure out what matters most to you." },
      { q: "Does True Joy Birthing work with Gainesville families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Gainesville birth setting \u2014 whether you\u2019re delivering at Shands, North Florida Regional, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way." },
      { q: "Are there doulas in Gainesville?", a: "Gainesville has an active doula community, including student-doula programs through UF\u2019s nursing and public health programs. Sliding-scale support is available through community organizations. Start with the True Joy Birthing app to find local doulas, and interview a few until one feels right." },
      { q: "Can my doula come to the hospital with me in Gainesville?", a: "Yes \u2014 both UF Health Shands and North Florida Regional allow doulas in labor and delivery. UF Health Shands\u2019 academic setting means they\u2019re used to working with doulas and birth plans. Confirm during your hospital tour, and bring your birth plan to help your care team support your preferences." },
    ],
    nearbyCities: ["jacksonville-fl", "orlando-fl"],
  },
  "charleston-sc": {
    city: "Charleston",
    state: "SC",
    slug: "charleston-sc",
    costLow: 900,
    costHigh: 2200,
    shelbiServesHere: true,
    culture: "Charleston blends deep Lowcountry heritage with a thriving food and arts scene — think Spanish moss, Rainbow Row, and shrimp-and-grits hospitality. Birth workers here often emphasize cultural warmth and community-rooted care, reflecting the city\u2019s strong Black birthing traditions and Gullah influence. The pace is famously unhurried, but hospital traffic on the peninsula can test that patience.",
    heroLocalDetail: "MUSC Health University Medical Center sits on the downtown Charleston peninsula near the Ravenel Bridge, making it reachable but prone to tourist-season gridlock — plan extra travel time, especially during spring and summer. Roper St. Francis Healthcare operates multiple campuses across the metro, with its main maternity hospital in West Ashley, a short drive from downtown via US-17. Charleston\u2019s humid subtropical climate means hot, muggy summers and a June-through-November hurricane season worth factoring into your birth plan. The city\u2019s oldest landmarks, like the Arthur Ravenel Jr. Bridge and the historic downtown medical district, are helpful navigation anchors when you\u2019re heading to a facility in labor.",
    hospitalDetails: [
      { name: "MUSC Health University Medical Center", paragraph: "MUSC Health is South Carolina\u2019s only academic medical center and the flagship of the state\u2019s health system. Its Shawn Jenkins Children\u2019s Hospital, opened in 2020 on the downtown peninsula, houses a neonatology program that MUSC describes as offering the highest level of neonatal care in the state; published sources generally refer to this as a verified Level IV NICU (confirmed on musc.edu and childrenshealthdefense.org), making it the referral center for the most critically ill newborns across the Lowcountry and beyond. MUSC\u2019s maternity services include maternal-fetal medicine specialists and 24/7 obstetric emergency coverage. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get your preferences ready." },
      { name: "Roper St. Francis Healthcare", paragraph: "Roper St. Francis is the Lowcountry\u2019s largest private healthcare system, with maternity services centered at Roper Hospital in West Ashley. The system provides a full range of obstetric care including labor and delivery, maternal-fetal medicine consultations, and a Special Care Nursery for babies needing extra support after birth. Roper St. Francis is known for a more community-hospital feel while still offering 24/7 anesthesiology and neonatal support. If you\u2019re delivering here, having your birth plan in hand helps the care team support your preferences from day one. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> before your tour." },
    ],
    birthCenterDetails: [
      { name: "Charleston Birth Place", paragraph: "Charleston Birth Place is the Lowcountry\u2019s only freestanding birth center, operating since 2008 with over 3,000 babies delivered. Located at 1300 Hospital Drive, Suite 270 in Mount Pleasant — just across the Ravenel Bridge from downtown — the center is closely integrated with its partner hospital for seamless transfer if needed. Certified midwives provide prenatal care, water birth, well-baby care, and women\u2019s health services in a home-like setting designed for comfort, privacy, and freedom of movement during labor." },
    ],
    medicaidNote: "South Carolina Medicaid (Healthy Connections) began covering doula services in 2024 under an SCDHHS expansion. Medicaid-enrolled doulas can be reimbursed for prenatal, labor, and postpartum visits — verify your doula\u2019s enrollment status through the SCDHHS provider directory.",
    insuranceNote: "Most private insurers in South Carolina (BlueCross BlueShield of SC, UnitedHealthcare, Aetna, Cigna) do not yet cover doula services as a standard benefit, though some employer plans may offer reimbursement through HSA/FSA eligibility. Always call your insurer to confirm coverage and ask about out-of-network doula reimbursement before booking.",
    faqs: [
      { q: "Does South Carolina Medicaid really cover doula services?", a: "Yes! As of 2024, SCDHHS expanded Healthy Connections Medicaid to include doula services. Covered visits include prenatal, labor and delivery, and postpartum support. Your doula must be enrolled as a Medicaid provider — ask them directly or search the SCDHHS provider portal. You deserve support, and now your insurance helps pay for it." },
      { q: "What\u2019s the difference between MUSC and Roper St. Francis for maternity care?", a: "MUSC Health is an academic medical center with a verified Level IV NICU, maternal-fetal medicine specialists, and a high-volume labor unit — ideal for high-risk pregnancies. Roper St. Francis (Roper Hospital in West Ashley) has a smaller, quieter labor unit with a Special Care Nursery and 24/7 anesthesiology; many families choose it for a more community-oriented birth experience." },
      { q: "Is there a birth center in Charleston?", a: "Yes — Charleston Birth Place in Mount Pleasant is the area\u2019s only freestanding birth center. It\u2019s run by certified midwives, offers water birth, and has a close transfer partnership with a nearby hospital. It\u2019s been serving Lowcountry families since 2008." },
      { q: "How much does a doula cost in Charleston, SC?", a: "Expect to pay $900 to $2,200 for a doula in Charleston, depending on experience level and package inclusions. If you\u2019re on Medicaid, SCDHHS covers doula services — ask your doula if they\u2019re enrolled. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to figure out what matters most to you." },
      { q: "Should I worry about hurricane season when planning a Charleston birth?", a: "Charleston\u2019s hurricane season runs June 1 through November 30, which overlaps with many due dates. It\u2019s wise to have an evacuation plan, a hospital bag packed early, and a communication plan with your doula in case of severe weather. MUSC and Roper both have robust emergency protocols; your care team can guide you." },
    ],
    nearbyCities: ["greenville-sc"],
  },
  "richmond-va": {
    city: "Richmond",
    state: "VA",
    slug: "richmond-va",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: true,
    culture: "Richmond is Virginia\u2019s capital city with a growing birth community anchored by VCU\u2019s academic medical center and Bon Secours\u2019 community hospitals. The city mixes historic neighborhoods with modern development, and families here value both evidence-based care options and community-rooted doula support. Richmond\u2019s birth workers are connected and collaborative, particularly through organizations like Birth Matters RVA.",
    heroLocalDetail: "VCU Medical Center sits in downtown Richmond at 1250 East Marshall Street, right off I-95 and I-64 — accessible from most neighborhoods within 15 minutes but subject to rush-hour bottlenecks on the Downtown Expressway. Bon Secours St. Mary\u2019s Hospital is at 5801 Bremo Road in the Near West End, about 10 minutes from the Museum District and Fan neighborhoods. Richmond\u2019s hot, humid summers and occasional winter ice storms can slow your hospital drive — know your route before you need it. The James River Park System\u2019s trails and the Fan\u2019s tree-lined streets are popular for third-trimester walks.",
    hospitalDetails: [
      { name: "VCU Medical Center", paragraph: "VCU Medical Center is central Virginia\u2019s academic powerhouse — a Level I trauma center with a verified Level IV NICU (stated directly on vcuhealth.org) at the Children\u2019s Hospital of Richmond at VCU. It\u2019s the referral destination for high-risk pregnancies from across the region, with maternal-fetal medicine specialists, 24/7 neonatology, and a high-volume labor unit that sees births from every corner of the Commonwealth. Doulas are welcome, and the academic setting means the care team is used to working with birth plans. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get your preferences ready." },
      { name: "Bon Secours St. Mary\u2019s Hospital", paragraph: "Bon Secours St. Mary\u2019s Hospital at 5801 Bremo Road is Richmond\u2019s most popular community maternity hospital, with a Level III NICU (stated directly on bonsecours.com) and a reputation for a warmer, more intimate birth experience than the academic setting at VCU. The Women\u2019s Center at St. Mary\u2019s offers private labor suites, midwifery options, and lactation support. If you\u2019re delivering here, having your birth plan in hand helps the care team support your preferences from day one. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> before your tour." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // Richmond, Henrico County, and Chesterfield County. Google Maps search found no
    // freestanding birth centers currently operating in the Richmond metro area.
    // Verified 2026-05-27. Families seeking out-of-hospital birth connect with
    // home-birth midwives practicing in the greater Richmond area.
    birthCenterDetails: [],
    medicaidNote: "Virginia Medicaid does NOT cover doula services as of 2026. There is no statewide Medicaid reimbursement for doula care. Richmond families on Medicaid must pay out of pocket, though some doulas offer sliding-scale fees. Ask your doula about payment plans or reduced-rate options.",
    insuranceNote: "Most private insurers in Virginia (Anthem Blue Cross, UnitedHealthcare, Aetna, Cigna) do not cover doula services as a standard benefit. Check your plan for out-of-network reimbursement or HSA/FSA eligibility. Contact your provider directly to confirm what\u2019s covered.",
    faqs: [
      { q: "Does Virginia Medicaid cover doula services?", a: "No. As of 2026, Virginia Medicaid does not cover doula services. If you\u2019re on Medicaid in the Richmond area, you\u2019ll need to pay for a doula out of pocket — but many Richmond doulas offer sliding-scale fees or payment plans. You deserve support regardless of insurance status. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> while you figure out your options." },
      { q: "How much does a doula cost in Richmond?", a: "Expect to pay $800 to $2,000 for a birth doula in Richmond. Some doulas offer sliding-scale pricing or payment plans. If you have an HSA or FSA, ask whether doula services qualify. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Richmond families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Richmond birth setting, whether you\u2019re delivering at VCU, St. Mary\u2019s, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way." },
      { q: "Are there doulas in Richmond?", a: "Richmond has an active, connected doula community. Organizations like Birth Matters RVA and individual practices offer birth and postpartum support across the metro. Start with the True Joy Birthing app to find local doulas, and interview a few until one feels right." },
      { q: "Can my doula come to the hospital with me in Richmond?", a: "Yes \u2014 both VCU Medical Center and Bon Secours St. Mary\u2019s allow doulas in labor and delivery. VCU\u2019s academic setting means they\u2019re especially accustomed to working with birth plans and doula support. Confirm during your hospital tour, and bring your birth plan to help your care team support your preferences." },
    ],
    nearbyCities: ["virginia-beach-va"],
  },
  "grand-rapids-mi": {
    city: "Grand Rapids",
    state: "MI",
    slug: "grand-rapids-mi",
    costLow: 700,
    costHigh: 1800,
    shelbiServesHere: true,
    culture: "Grand Rapids is West Michigan\u2019s largest city and a growing healthcare hub, anchored by the Medical Mile downtown. The birth community is smaller than Detroit\u2019s but tight-knit, with organizations like Great Lakes Doulas offering sliding-scale support and West Michigan Midwifery providing the region\u2019s only freestanding birth center. Families here tend to be pragmatic and community-oriented.",
    heroLocalDetail: "Corewell Health Butterworth Hospital (formerly Spectrum Health) sits at 100 Michigan Street NE on the downtown Medical Mile, adjacent to Helen DeVos Children\u2019s Hospital. Trinity Health Grand Rapids (formerly Mercy Health Saint Mary\u2019s) is at 200 Jefferson Avenue SE, about 1.5 miles away in the Heritage Hill area. Both are reachable within 10\u201315 minutes from most Grand Rapids neighborhoods, but US-131 construction zones and winter lake-effect snow can slow your drive. The Fred Meijer White Pine Trail and Millennium Park trails are popular third-trimester walking spots.",
    hospitalDetails: [
      { name: "Corewell Health Butterworth Hospital", paragraph: "Corewell Health Butterworth Hospital (formerly Spectrum Health Butterworth) is Grand Rapids\u2019 flagship academic medical center on the Medical Mile downtown. Helen DeVos Children\u2019s Hospital, physically connected on the same campus, houses West Michigan\u2019s only verified Level IV NICU (stated directly on corewellhealth.org) \u2014 the highest level of neonatal care, capable of treating the most critically ill newborns including surgical cases. Corewell\u2019s maternity services include maternal-fetal medicine specialists, 24/7 neonatology, and a high-volume labor unit. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get your preferences ready." },
      { name: "Trinity Health Grand Rapids Hospital", paragraph: "Trinity Health Grand Rapids (formerly Mercy Health Saint Mary\u2019s) is at 200 Jefferson Avenue SE in central Grand Rapids. It offers a Level II NICU (stated directly on trinityhealthmichigan.org) for moderately ill newborns and a quieter, more community-oriented labor unit than the academic bustle of Corewell. For Level III or IV neonatal care, families are typically transferred to Helen DeVos Children\u2019s Hospital about 1.5 miles away. Having your birth plan in hand helps the care team support your preferences from day one. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> before your tour." },
    ],
    birthCenterDetails: [
      { name: "West Michigan Midwifery Birth Center", paragraph: "West Michigan Midwifery is the only freestanding birth center in the Grand Rapids area, offering both home birth and birth center options. Staffed by Michigan Board of Licensed Midwives, they provide water birth, prenatal care, postpartum care, and lactation support. Free consultations are available for families exploring out-of-hospital birth options." },
    ],
    medicaidNote: "Michigan Medicaid does NOT cover doula services as of 2026. There is no statewide Medicaid reimbursement for doula care. Grand Rapids families on Medicaid must pay out of pocket, though some doulas like Great Lakes Doulas offer sliding-scale fees or payment plans.",
    insuranceNote: "Most private insurers in Michigan (Blue Cross Blue Shield of Michigan, Priority Health, UnitedHealthcare, McLaren) do not cover doula services as a standard benefit. Check your plan for out-of-network reimbursement or HSA/FSA eligibility. Contact your provider directly to confirm what\u2019s covered.",
    faqs: [
      { q: "Does Michigan Medicaid cover doula services?", a: "No. As of 2026, Michigan Medicaid does not cover doula services. If you\u2019re on Medicaid in the Grand Rapids area, you\u2019ll need to pay for a doula out of pocket \u2014 but some doulas like Great Lakes Doulas offer sliding-scale fees or payment plans. You deserve support regardless of insurance status. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> while you figure out your options." },
      { q: "How much does a doula cost in Grand Rapids?", a: "Expect to pay $700 to $1,800 for a birth doula in Grand Rapids. Great Lakes Doulas and some independent practices offer sliding-scale pricing. If you have an HSA or FSA, ask whether doula services qualify. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Does True Joy Birthing work with Grand Rapids families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Grand Rapids birth setting \u2014 whether you\u2019re delivering at Corewell, Trinity Health, West Michigan Midwifery, or at home. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way." },
      { q: "Are there birth centers in Grand Rapids?", a: "West Michigan Midwifery operates Grand Rapids\u2019 only freestanding birth center, offering water birth and midwifery care. For families seeking an out-of-hospital option, it\u2019s the dedicated choice. Start with a free consultation to see if it\u2019s the right fit." },
      { q: "Can my doula come to the hospital with me in Grand Rapids?", a: "Yes \u2014 both Corewell Health Butterworth and Trinity Health Grand Rapids allow doulas in labor and delivery. Confirm during your hospital tour, and bring your birth plan to help your care team support your preferences." },
    ],
    nearbyCities: ["detroit-mi"],
  },
  "aurora-co": {
    city: "Aurora",
    state: "CO",
    slug: "aurora-co",
    costLow: 900,
    costHigh: 2000,
    shelbiServesHere: true,
    culture: "Aurora is Colorado\u2019s third-largest city and one of its most diverse \u2014 over 160 languages are spoken in local schools. The birth community reflects that mix, with culturally concordant doula support and multilingual resources available. The Anschutz Medical Campus anchors the region\u2019s academic medicine, and the city\u2019s large military community (former Fitzsimons Army Medical Center site) means many families are familiar with navigating healthcare systems.",
    heroLocalDetail: "UCHealth University of Colorado Hospital sits on the Anschutz Medical Campus at 12605 East 16th Avenue in north-central Aurora, with direct access off I-225 and Colfax Avenue. Sky Ridge Medical Center in Lone Tree is about 15 miles south via I-25, serving families in south Aurora and the Tech Center corridor. Aurora\u2019s dry winters and intense summer heat can make the drive to the hospital uncomfortable at 38 weeks \u2014 plan your route ahead of time. Cherry Creek State Park and the High Line Canal Trail are popular third-trimester walking spots with flat, well-maintained paths.",
    hospitalDetails: [
      { name: "UCHealth University of Colorado Hospital", paragraph: "UCHealth University of Colorado Hospital (UCH) on the Anschutz Medical Campus is the region\u2019s only Level I trauma center and academic medical center. Children\u2019s Hospital Colorado, physically connected on the same campus, operates a verified Level IV NICU (stated directly on childrenscolorado.org) \u2014 the highest neonatal care level available. UCH\u2019s maternity services include maternal-fetal medicine specialists, 24/7 obstetric coverage, and a high-volume labor unit. Doulas are welcome in this academic setting. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get your preferences ready." },
      { name: "Sky Ridge Medical Center", paragraph: "Sky Ridge Medical Center at 1010 Ridgegate Parkway in Lone Tree is about 15 miles south of Aurora via I-25, serving families across the south metro. It has a verified Level III NICU (stated directly on skyridgemedcenter.com) and a Women\u2019s Center with private suites, midwifery options, and lactation support. Sky Ridge offers a more community-oriented experience than the academic bustle of the Anschutz campus. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> before your tour." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results within
    // Aurora city limits. Google Maps search found Mountain Midwifery & Birth Center in
    // Denver (1722 Syracuse St, Denver, CO 80220, ~10 miles west of Aurora) as the
    // nearest freestanding birth center. No birth centers currently operate within
    // Aurora. Verified 2026-05-27.
    birthCenterDetails: [],
    medicaidNote: "Health First Colorado (Colorado Medicaid) covers doula services as of July 1, 2024. Medicaid-enrolled doulas can be reimbursed for prenatal, labor, and postpartum visits. Verify your doula\u2019s enrollment status through the Health First Colorado provider directory, and ask whether they accept Medicaid during your initial consultation.",
    insuranceNote: "If you\u2019re on Health First Colorado (Medicaid), doula services are now covered. For private insurance (UnitedHealthcare, Anthem Blue Cross, Kaiser, Cigna), doula coverage varies by plan. Many Aurora families use HSA or FSA funds for out-of-pocket doula costs. Always call your insurer to confirm coverage before booking.",
    faqs: [
      { q: "Does Colorado Medicaid cover doula services?", a: "Yes! As of July 2024, Health First Colorado (Colorado Medicaid) covers doula services including prenatal visits, labor support, and postpartum care. Your doula must be enrolled as a Health First Colorado provider. Ask them directly or search the provider directory. You deserve support, and now your insurance helps pay for it." },
      { q: "How much does a doula cost in Aurora?", a: "Expect to pay $900 to $2,000 for a birth doula in the Aurora/Denver metro. If you\u2019re on Health First Colorado (Medicaid), your doula services may be covered at no cost. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> to figure out what matters most to you." },
      { q: "Does True Joy Birthing work with Aurora families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Aurora birth setting \u2014 whether you\u2019re delivering at UCHealth, Sky Ridge, or at home. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way." },
      { q: "Are there birth centers near Aurora?", a: "There are no freestanding birth centers within Aurora city limits. Mountain Midwifery & Birth Center in Denver (about 10 miles west) is the nearest option, offering water birth and midwifery care. For families in south Aurora, Sky Ridge Medical Center provides midwifery options within a hospital setting." },
      { q: "Can my doula come to the hospital with me in Aurora?", a: "Yes \u2014 both UCHealth and Sky Ridge allow doulas in labor and delivery. The Anschutz campus\u2019s academic setting means they\u2019re especially accustomed to birth plans and doula support. Confirm during your hospital tour, and bring your birth plan to help your care team support your preferences." },
    ],
    nearbyCities: ["denver-co"],
  },
  "new-haven-ct": {
    city: "New Haven",
    state: "CT",
    slug: "new-haven-ct",
    costLow: 800,
    costHigh: 2000,
    shelbiServesHere: true,
    culture: "New Haven is a compact, walkable city anchored by Yale University and Yale New Haven Hospital \u2014 one of the most well-resourced academic medical centers in New England. The birth community is small but connected, with doulas serving families from the Hill neighborhood to the suburbs of East Rock and Westville. Being a college town means access to evidence-based resources and student-doula programs that can help keep costs down.",
    heroLocalDetail: "Yale New Haven Hospital sits at 20 York Street in downtown New Haven, right off I-95 and I-91 \u2014 accessible from most neighborhoods within 10\u201315 minutes. The medical district is walkable from East Rock, Dwight, and the Hill, but parking can be tight during Yale\u2019s academic year. New Haven\u2019s dense urban layout means shorter drives than most cities this size, but winter nor\u2019easters can make the hospital trip icy and slow. East Rock Park\u2019s walking trails and the Farmington Canal Greenway are popular third-trimester spots.",
    hospitalDetails: [
      { name: "Yale New Haven Hospital", paragraph: "Yale New Haven Hospital is the primary maternity hospital in the region, with over 4,500 births annually. It\u2019s a 1,541-bed Level I trauma center affiliated with Yale School of Medicine, with maternal-fetal medicine specialists and 24/7 neonatology. The adjacent Yale New Haven Children\u2019s Hospital operates a verified Level IV NICU (rated Level IV by the American Academy of Pediatrics in 2018 per Yale New Haven Health institutional sources) \u2014 the highest neonatal care designation and one of only two Level I Pediatric Trauma Centers in Connecticut. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get your preferences ready." },
      { name: "Yale New Haven Children\u2019s Hospital", paragraph: "Yale New Haven Children\u2019s Hospital, at 1 Park Street on the same downtown medical campus, is a 202-bed pediatric hospital with a verified Level IV NICU (rated Level IV by the AAP in 2018 per Yale New Haven Health institutional sources). The NICU was renovated in 2018 and includes couplet rooms for mother and baby. For families with high-risk pregnancies or anticipated NICU needs, this is the referral center for all of southern Connecticut. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> before your tour." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned zero results for
    // New Haven and New Haven County. Connecticut passed legislation in 2023 (Public Act
    // 23-97) allowing freestanding birth centers to be licensed, but as of 2026 no birth
    // centers have opened in the Greater New Haven area. Google Maps search confirmed no
    // freestanding birth centers currently operating. Verified 2026-05-27.
    birthCenterDetails: [],
    medicaidNote: "Connecticut Medicaid (HUSKY Health) does NOT cover doula services as of 2026. There is no statewide Medicaid reimbursement for doula care. New Haven families on Medicaid must pay out of pocket, though some doulas offer sliding-scale fees. Ask your doula about payment plans or reduced-rate options.",
    insuranceNote: "Most private insurers in Connecticut (Anthem Blue Cross, ConnectiCare, UnitedHealthcare, Cigna) do not cover doula services as a standard benefit. Check your plan for out-of-network reimbursement or HSA/FSA eligibility. Contact your provider directly to confirm what\u2019s covered.",
    faqs: [
      { q: "Does Connecticut Medicaid cover doula services?", a: "No. As of 2026, Connecticut Medicaid (HUSKY Health) does not cover doula services. If you\u2019re on Medicaid in the New Haven area, you\u2019ll need to pay for a doula out of pocket \u2014 but some New Haven doulas offer sliding-scale fees, and student-doula programs through Yale may offer reduced-cost support. You deserve support regardless of insurance status. <a href=\"/birth-plan-template/\">Start with the free birth plan template</a> while you figure out your options." },
      { q: "How much does a doula cost in New Haven?", a: "Expect to pay $800 to $2,000 for a birth doula in New Haven, with most doulas charging around $1,200 for a full package. Student-doula programs through Yale\u2019s nursing school may offer reduced rates. If you have an HSA or FSA, ask whether doula services qualify. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to figure out what matters most to you." },
      { q: "Does True Joy Birthing work with New Haven families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any New Haven birth setting \u2014 whether you\u2019re delivering at Yale New Haven or at home. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way." },
      { q: "What NICU level does Yale New Haven have?", a: "Yale New Haven Children\u2019s Hospital operates a Level IV NICU \u2014 the highest designation from the American Academy of Pediatrics. This rating, received in 2018, means it can provide the most intensive neonatal care available, including surgical repair of complex conditions. If you\u2019re delivering at Yale, this level of care is on the same campus, not miles away." },
      { q: "Can my doula come to the hospital with me in New Haven?", a: "Yes \u2014 Yale New Haven Hospital allows doulas in labor and delivery. As a major academic medical center, they\u2019re accustomed to working with birth plans and doula support. Confirm during your hospital tour, and bring your birth plan to help your care team support your preferences." },
    ],
    nearbyCities: ["hartford-ct"],
  },
  "henderson-nv": {
    city: "Henderson",
    state: "NV",
    slug: "henderson-nv",
    costLow: 1000,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Henderson is the second-largest city in Nevada and a fast-growing suburb of Las Vegas, with young families drawn to master-planned communities like Green Valley, Anthem, and Inspirada. Birth options here are hospital-dominant \u2014 there are no freestanding birth centers in the Henderson area, and the doula community, while growing, is smaller than in comparably sized metros. Nevada\u2019s 2023 passage of SB 392 adding Medicaid doula coverage is a recent win that\u2019s still rolling out, and it\u2019s changing the access landscape for families who need it most.",
    heroLocalDetail: "Henderson Hospital sits at 1050 W. Galleria Drive near the I-515/US-95 and Galleria interchange in Green Valley, and St. Rose Dominican\u2019s Siena campus is at 3001 St. Rose Parkway in the southeastern part of the city near Anthem. The I-515/US-95 corridor connects Henderson to Las Vegas in about 15\u201320 minutes, but afternoon rush on I-515 between Russell Road and the I-15/US-95 Split can easily double that \u2014 and the I-215 beltway around the south side bogs down near Green Valley Parkway during school pickup. If you\u2019re coming from Inspirada or the far south side, St. Rose Parkway and Eastern Avenue are your reliable alternates when the freeways jam up. The Henderson Multimodal Center on Water Street anchors the old downtown, and the River Mountain Loop Trail and Pittman Wash Trail are where Henderson moms go for flat, paved third-trimester walks \u2014 especially the section near Cornerstone Park with shade and water fountains. Green Valley Ranch, Anthem, MacDonald Highlands, and Inspirada are the neighborhoods where you\u2019ll find most young families.",
    hospitalDetails: [
      { name: "Henderson Hospital", paragraph: "Henderson Hospital (Valley Health System), at 1050 W. Galleria Drive, opened in 2016 and operates a Level III NICU with 24/7 obstetric hospitalist coverage, private LDRP rooms, lactation consultants, and couplet care (rooming-in). It\u2019s the newer of Henderson\u2019s two main birth hospitals and a direct competitor to St. Rose Siena for the local maternity market. If you\u2019re delivering at Henderson Hospital, having your birth plan in hand makes the check-in conversation smoother \u2014 they see a lot of families and move fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "St. Rose Dominican \u2013 Siena Campus", paragraph: "St. Rose Dominican \u2013 Siena Campus (Dignity Health/CommonSpirit Health), at 3001 St. Rose Parkway in southeast Henderson, is one of the busiest maternity hospitals in the Las Vegas Valley with a Level III NICU, a dedicated women\u2019s and children\u2019s tower, 24/7 OB hospitalist coverage, lactation services, and childbirth education classes. The Siena campus has the more established NICU and maternity program of the two St. Rose campuses. Doulas are generally welcome \u2014 confirm visitor policy during your hospital tour. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something specific to work from." },
      { name: "St. Rose Dominican \u2013 San Martin Campus", paragraph: "St. Rose Dominican \u2013 San Martin Campus (Dignity Health/CommonSpirit Health), at 8290 W. Warm Springs Road in Las Vegas near the Henderson border, has a Level II NICU (Special Care Nursery) for moderately ill or premature infants. More complex neonatal cases transfer to Siena or another Level III facility. It offers LDRP suites, 24/7 OB coverage, and lactation support. If you\u2019re in southwest Henderson or the Mountains Edge area, San Martin may be your closest option \u2014 but know that the Level II NICU means the most fragile newborns get transferred elsewhere. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to have your preferences ready." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for
    // Henderson, NV (ZIPs 89002, 89011–89016, 89044–89077). Google Maps and
    // web searches for "birth center Henderson NV" also found no operational
    // freestanding birth centers. Better Birth Center (previously in Las Vegas)
    // has closed. The Las Vegas Valley has no freestanding birth centers as of
    // 2026; families seeking out-of-hospital birth work with home-birth midwives.
    // Verified 2026-05-27.
    birthCenterDetails: [],
    medicaidNote: "Yes \u2014 Nevada Medicaid covers doula services as of 2024, following the passage of SB 392 in 2023. Nevada Medicaid and Nevada Check Up (CHIP) enrollees are eligible for prenatal, labor/delivery, and postpartum doula visits. Doulas must enroll as Nevada Medicaid providers to receive reimbursement. The Medicaid reimbursement rate for the full doula birth support package is approximately $600\u2013$900. A physician or licensed provider referral is typically required. Contact Nevada Medicaid at 1-800-525-9529 or visit dhcfp.nv.gov to confirm your coverage and find enrolled doulas.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Henderson area. The Culinary Health Fund \u2014 covering many hospitality workers in the Las Vegas Valley \u2014 covers midwifery and hospital maternity care but doula coverage is not a standard benefit; contact the fund directly to verify. For other private insurers, check whether your plan covers out-of-network doula services or whether HSA/FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Nevada Medicaid cover doulas in Henderson?", a: "Yes! Great news \u2014 as of 2024, Nevada Medicaid covers doula services thanks to SB 392. That includes prenatal, labor/delivery, and postpartum doula visits. Your doula must be enrolled as a Nevada Medicaid provider. Here\u2019s your next step: call Nevada Medicaid at 1-800-525-9529 and ask about doula coverage, or visit dhcfp.nv.gov. You deserve support, and now your insurance helps pay for it." },
      { q: "How much does a doula cost in Henderson?", a: "Expect to pay $1,000 to $3,000 for a doula in Henderson. If you\u2019re on Nevada Medicaid, your doula services may be covered at no out-of-pocket cost \u2014 ask your doula if they\u2019re a Medicaid-enrolled provider. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Are there birth centers in Henderson?", a: "No \u2014 there are currently no freestanding birth centers in Henderson or anywhere in the Las Vegas Valley. Families wanting a birth center experience would need to travel to Southern California or arrange a home birth with a licensed midwife. CPMs became licensable in Nevada starting around 2017, expanding home birth options slightly. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a hospital or home birth is right for you." },
      { q: "Which Henderson hospital has the best NICU?", a: "Henderson Hospital and St. Rose Dominican \u2013 Siena Campus both operate Level III NICUs, the highest level available in the Henderson area. St. Rose San Martin has a Level II NICU (Special Care Nursery). For Level IV NICU care, families are transferred to Sunrise Hospital in Las Vegas. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Henderson families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Henderson birth setting, whether you\u2019re delivering at a hospital or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way \u2014 no signup required." },
    ],
    nearbyCities: ["las-vegas-nv"],
  },
  "hendersonville-tn": {
    city: "Hendersonville",
    state: "TN",
    slug: "hendersonville-tn",
    costLow: 800,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Hendersonville is one of Nashville\u2019s fastest-growing suburbs in Sumner County, where families from across the county come to deliver at TriStar Hendersonville Medical Center. The birth community is small but dedicated \u2014 most doulas serving Hendersonville are based in Nashville and travel north, so planning ahead matters more here than in the city.",
    heroLocalDetail: "TriStar Hendersonville Medical Center sits at 355 New Shackle Island Rd just off Vietnam Veterans Boulevard, which means most Hendersonville families can get there in under 10 minutes from Indian Lake, Drakes Creek, or the Saundersville Road corridors. If you\u2019re coming from Gallatin or the east side of the county, Highway 31E (Gallatin Pike) and Vietnam Veterans Blvd are your fastest routes \u2014 but afternoon traffic on Vietnam Veterans near New Shackle Island can back up, so know your neighborhood cut-through before contractions start. The greenway along Drakes Creek Park and the walking paths at Memorial Park on Main Street are popular third-trimester go-tos \u2014 flat, shaded, and close enough to the hospital that you\u2019re not stranded if something picks up.",
    hospitalDetails: [
      { name: "TriStar Hendersonville Medical Center", paragraph: "TriStar Hendersonville Medical Center, at 355 New Shackle Island Rd, is the primary birth hospital for Sumner County with a Level II NICU, full-service maternity unit, private labor and delivery suites, lactation consultants, and an obstetrics emergency department. The hospital handles approximately 1,500+ deliveries a year \u2014 a high volume for a community hospital \u2014 so walking in with your birth plan already written keeps your preferences clear when things move fast. If you\u2019re delivering here and complications arise, they can transfer to TriStar Centennial (Level III NICU, same HCA system, about 25 minutes south) or Vanderbilt (Level IV NICU, about 30 minutes south). <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Sumner Regional Medical Center", paragraph: "Sumner Regional Medical Center, at 555 Hartsville Pike in Gallatin about 8 miles east of Hendersonville, has a well-baby nursery (Level I) and provides labor and delivery services with private birthing suites and lactation support. It\u2019s part of Highpoint Health System. Because there\u2019s no NICU on-site, any newborn needing more than routine care is stabilized and transferred to a higher-level facility. If you\u2019re delivering at Sumner Regional, having your birth plan ready is even more important \u2014 you want your team to know your preferences before a transfer scenario comes into play. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something specific to work from." },
    ],
    // Birth center search: No freestanding birth centers operate in Sumner County (Hendersonville,
    // Gallatin, surrounding ZIPs) as of 2026. The Nashville entry confirms no licensed freestanding
    // birth centers in the greater Nashville area. Families seeking out-of-hospital birth typically
    // work with home-birth midwives serving the Middle Tennessee area. Verified 2026-05-27.
    birthCenterDetails: [],
    medicaidNote: "Tennessee does NOT cover doula services through Medicaid (TennCare) as of 2026. While neighboring states have implemented Medicaid doula coverage, Tennessee has not yet enacted similar legislation, leaving low-income families to seek sliding-scale or volunteer doula options.",
    insuranceNote: "Private insurance doula coverage in Tennessee varies significantly by plan and insurer. Tennessee has not mandated doula coverage for private plans. Contact your insurance provider directly to ask about reimbursement for doula services or out-of-network benefits, and check whether HSA or FSA funds can help cover out-of-pocket costs.",
    faqs: [
      { q: "How much does a doula cost in Hendersonville?", a: "Expect to pay $800 to $2,500 for a doula in Hendersonville. Most doulas serving Hendersonville are based in Nashville and travel north, so start your search early and ask about travel fees upfront. Can\u2019t swing the full price? Ask about sliding-scale options \u2014 most doulas would rather work with your budget than see you go without. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Tennessee Medicaid cover doulas in Hendersonville?", a: "Not yet \u2014 Tennessee\u2019s Medicaid (TennCare) doesn\u2019t cover doulas right now. But that doesn\u2019t mean you\u2019re alone. Community doulas and sliding-scale options exist \u2014 many doulas would rather work with your budget than see you go without. Some doulas even reserve pro bono spots. Advocacy groups are working on changing this. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> \u2014 no matter who\u2019s in the room with you, knowing what you want is your superpower." },
      { q: "Which hospitals near Hendersonville accommodate birth plans?", a: "TriStar Hendersonville Medical Center (Level II NICU) is the primary in-city option and generally accommodates birth plans. Sumner Regional in Gallatin (Level I nursery) also serves Hendersonville families. For higher-level NICU care, Nashville\u2019s Vanderbilt (Level IV) and TriStar Centennial (Level III) are 25\u201330 minutes away. Always confirm your hospital\u2019s current visitor and support-person policy during your tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Does True Joy Birthing work with Hendersonville families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Hendersonville birth setting, whether you\u2019re delivering at a hospital or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way \u2014 no signup required." },
    ],
    nearbyCities: ["nashville-tn"],
  },
  "meridian-id": {
    city: "Meridian",
    state: "ID",
    slug: "meridian-id",
    costLow: 900,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Meridian is Idaho\\u2019s fastest-growing city and a Boise suburb where young families are the defining demographic \\u2014 the population has surged past 125,000 with over 35% growth, and the birth community is catching up. St. Luke\\u2019s Health System anchors hospital birth, while a small but dedicated network of CPMs, CNMs, and doulas serves families seeking lower-intervention options. The LDS community\\u2019s emphasis on family and postpartum support (Relief Society meals, congregational networks) shapes the local culture, and holistic-minded families have a growing voice in a city that\\u2019s changing fast.",
    heroLocalDetail: "St. Luke\\u2019s Meridian sits right on Eagle Road (SH-55) at 520 S. Eagle Road \\u2014 one of the most congested arterials in the entire state \\u2014 and if you\\u2019re coming from south Meridian neighborhoods like Tuscany Village or Paramount, that drive can double during afternoon rush when Eagle Road traffic light cycles stack up. I-84 runs east\\u2013west along the south edge of Meridian and connects to Boise (15\\u201320 minutes east) and Nampa (15\\u201320 minutes west); the I-84/Eagle Road interchange is the main hospital access point and it backs up hard during 7\\u20139 AM and 4\\u20136 PM commutes. St. Luke\\u2019s Boise, home to Idaho\\u2019s only Level IV NICU, is about 10\\u201312 miles east via I-84 \\u2014 know that route before 38 weeks, because if you\\u2019re transferring for high-risk care, you don\\u2019t want to be figuring out the Spaghetti Bowl interchange (I-84/US-26/SH-55) in the dark. Julius M. Kleiner Memorial Park off S. Eagle Road is the crown jewel of Meridian parks \\u2014 62 acres with paved walking paths, a splash pad, and a pond \\u2014 and it\\u2019s where you\\u2019ll see half the pregnant women in the city on a given evening. Settlers Park near Tuscany Village and the Boise River Greenbelt (a few miles east) are other popular third-trimester go-tos.",
    hospitalDetails: [
      { name: "St. Luke\\u2019s Meridian", paragraph: "St. Luke\\u2019s Meridian, at 520 S. Eagle Road, is the primary birth hospital for Meridian families and one of the busiest L&D units in the Treasure Valley. It has a Level II Special Care Nursery (contact the hospital directly for current NICU level verification) \\u2014 babies requiring higher-level NICU care are transferred to St. Luke\\u2019s Boise. The hospital is Baby-Friendly designated (the St. Luke\\u2019s system was the first in Idaho to achieve this) and offers VBAC support with 24/7 in-house OB anesthesia coverage. Doulas are generally welcome, though visitor policies can shift, so confirm during your hospital tour. If you\\u2019re delivering at St. Luke\\u2019s Meridian, having your birth plan in hand makes check-in smoother \\u2014 they see a lot of families and move fast. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> to get started." },
      { name: "St. Luke\\u2019s Nampa", paragraph: "St. Luke\\u2019s Nampa, at 9850 W. Interstate 84 in Nampa about 15\\u201320 minutes west of Meridian via I-84, provides full labor and delivery services for Canyon County families. It has a well-baby nursery (Level I) \\u2014 contact the hospital directly for current NICU level verification \\u2014 and newborns requiring NICU care are stabilized and transferred to St. Luke\\u2019s Boise. Part of the Baby-Friendly\\u2013designated St. Luke\\u2019s system, with lactation support and midwifery services. If you\\u2019re on the west side of Meridian or in the Nampa/Caldwell area, it may be your closest option. <a href=\\\"/birth-plan-template/\\\">Download the free birth plan template</a> before your hospital tour." },
      { name: "St. Luke\\u2019s Boise", paragraph: "St. Luke\\u2019s Boise, at 190 E. Bannock Street about 10\\u201312 miles east of Meridian, is home to Idaho\\u2019s only Level IV NICU and the state\\u2019s only full maternal-fetal medicine department \\u2014 the regional referral center for high-risk pregnancies and critically ill newborns across Idaho and eastern Oregon. Many Meridian families have prenatal MFM consults at Boise even if they deliver at St. Luke\\u2019s Meridian. If you\\u2019re navigating a high-risk pregnancy, this is where your OB will likely refer you for delivery. The drive from Meridian via I-84 East is 15\\u201320 minutes in normal traffic but can stretch to 30+ during rush hour. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> so your team has something specific to work from." },
    ],
    // Birth center search: No freestanding birth centers currently operate within
    // Meridian city limits as of 2026. Boise Birth Center (6020 N. Eclipse Way,
    // Boise, ~8-10 miles from central Meridian) is the nearest freestanding birth
    // center in the Treasure Valley, offering water birth and midwife-led care with
    // CPMs/CNMs. Several CPMs and CNMs also attend home births in the Meridian/Boise
    // metro. The Idaho Midwifery Council (idahomidwiferycouncil.org) maintains a
    // current provider directory. Verified 2026-05-27.
    birthCenterDetails: [
      { name: "Boise Birth Center", paragraph: "Boise Birth Center, in Boise about 8\\u201310 miles from central Meridian, is the Treasure Valley\\u2019s best-known freestanding birth center \\u2014 offering midwife-led birth, water birth, prenatal and postpartum care with CPMs and CNMs. Idaho has licensed CPMs since 2010, which means the out-of-hospital birth infrastructure here is more established than in many states. The center has transfer agreements with St. Luke\\u2019s hospitals. Having a doula who knows the Boise Birth Center\\u2019s rhythm and transfer protocols makes the whole experience feel a lot less unknown. Call ahead to confirm current availability and schedule a tour, since the birth community here is small and spots can fill." },
    ],
    medicaidNote: "Idaho Medicaid does NOT currently cover doula services as of 2026. Idaho operates Medicaid on a fee-for-service model (no managed care organizations), meaning adding doula coverage requires legislative action \\u2014 and no doula coverage bill has passed to date. Advocacy groups including the Idaho Perinatal Project and Idaho Association of Doulas continue pushing for coverage. HSA and FSA funds can be used for doula fees, and some Meridian-area doulas offer sliding-scale pricing or payment plans.",
    insuranceNote: "Since Idaho Medicaid doesn\\u2019t cover doulas, check whether your private insurer covers out-of-network doula services. Blue Cross of Idaho, Regence BlueShield of Idaho, SelectHealth, and PacificSource are major carriers in the Treasure Valley \\u2014 some plans offer maternal wellness benefits that partially reimburse doula fees. HSA and FSA funds can cover out-of-pocket costs. Ask your doula for a superbill for insurance reimbursement.",
    faqs: [
      { q: "Does Idaho Medicaid cover doulas in Meridian?", a: "Not yet \\u2014 Idaho Medicaid does not currently reimburse doula services. But you still have options: HSA and FSA funds can cover doula fees, some Treasure Valley doulas offer sliding-scale rates or payment plans, and community groups are actively working to change this. Don\\u2019t let insurance be the reason you go without a doula \\u2014 ask about payment flexibility when you interview." },
      { q: "How much does a doula cost in Meridian?", a: "Expect to pay $900 to $1,800 for a birth doula in the Meridian/Boise area. The range depends on experience level and what\\u2019s included (prenatal visits, labor support, postpartum check-ins). Without Medicaid coverage, most costs are out-of-pocket, so ask about payment plans upfront. <a href=\\\"/birth-plan-template/\\\">Start with the free birth plan template</a> to figure out what matters most to you." },
      { q: "Does True Joy Birthing work with Meridian families?", a: "Yes \\u2014 and it\\u2019s free. True Joy Birthing\\u2019s birth plan app, checklist, and guided walkthrough work for any Meridian birth setting, whether you\\u2019re delivering at St. Luke\\u2019s Meridian, Boise Birth Center, or at home. The app also helps you find and connect with local doulas and midwives. <a href=\\\"/birth-plan-template/\\\">Download the free birth plan template</a> and start preparing your way." },
      { q: "Which hospitals in Meridian accommodate birth plans?", a: "St. Luke\\u2019s Meridian is the primary in-city hospital with a Level II Special Care Nursery and Baby-Friendly designation. St. Luke\\u2019s Nampa (15\\u201320 min west) serves Canyon County families. For high-risk pregnancies, St. Luke\\u2019s Boise has Idaho\\u2019s only Level IV NICU and full maternal-fetal medicine \\u2014 about 15\\u201320 minutes east. Doulas are generally welcome at all three. Always confirm current visitor and support-person policies during your hospital tour. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers near Meridian?", a: "No freestanding birth centers currently operate within Meridian city limits. Boise Birth Center, about 8\\u201310 miles away, is the Treasure Valley\\u2019s established freestanding birth center \\u2014 offering water birth and midwife-led care. Several licensed CPMs and CNMs also attend home births throughout the Meridian/Boise metro. Idaho has licensed CPMs since 2010, giving the state a more robust out-of-hospital birth infrastructure than many places. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> to think through whether a birth center, hospital, or home birth is right for you." },
    ],
    nearbyCities: ["boise-id"],
  },
  "lehi-ut": {
    city: "Lehi",
    state: "UT",
    slug: "lehi-ut",
    costLow: 800,
    costHigh: 1800,
    shelbiServesHere: false,
    culture: "Lehi sits in the heart of Utah County \u2014 the highest-birth-rate county in the highest-birth-rate state in the nation. The LDS (Church of Jesus Christ of Latter-day Saints) culture deeply shapes birth here: large families are the norm, young marriage ages mean many first-time moms in their early twenties, and the doula community is unusually large and affordable because many LDS doulas view birth support as ministry and service rather than purely commerce. The Silicon Slopes tech corridor has brought an influx of young, high-income families to Lehi, creating an interesting mix of traditional LDS birth culture and evidence-based, tech-savvy parenting. Utah County\u2019s birth volume means the hospital L&D units run busy \u2014 and having your preferences in writing matters even more.",
    heroLocalDetail: "Lehi sits at the northern edge of Utah County where I-15 crosses Point of the Mountain \u2014 the bottleneck between Utah and Salt Lake counties. American Fork Hospital is about 6 miles north up I-15 (exit 279, 1100 East), and Utah Valley Hospital in Provo is about 15 miles south (exit 273, 500 West). During morning and evening rush, that I-15 stretch between Lehi and Provo can slow to a crawl, and the Point of the Mountain construction zone near the Traverse Mountain/Lehi tech corridor exit adds unpredictable delays \u2014 know your back route via State Street (US-89) through Pleasant Grove before you need it. Timpanogos Regional Hospital in Orem is about 10 miles south, also off I-15. Lehi itself doesn\u2019t have a hospital with L&D, so you\u2019re driving no matter what. Winters bring lake-effect snow off Utah Lake and periodic inversion advisories; summers break 100\u00B0F regularly. Murdock Canal Trail and the trails around Thanksgiving Point are popular third-trimester walks \u2014 flat, paved, and close enough to I-15 that you\u2019re not stranded if something picks up. The Traverse Mountain and Thanksgiving Point neighborhoods are where most of the young Silicon Slopes families cluster.",
    hospitalDetails: [
      { name: "American Fork Hospital (Intermountain Health)", paragraph: "American Fork Hospital, at 170 N 1100 E in American Fork just 6 miles north of Lehi, is the closest hospital with labor and delivery for Lehi families. It has a Level II NICU (special care nursery) \u2014 verified on intermountainhealthcare.org \u2014 and is known for a more intimate, boutique-style maternity experience compared to the larger regional hospitals. The unit sees a steady volume but maintains a community-hospital feel: private LDR rooms, lactation consultants, midwifery services, and a stabilization-and-transfer protocol for infants needing Level III NICU care at Utah Valley Hospital. Doulas are welcome under Intermountain Health\u2019s general policy. If you\u2019re delivering at American Fork, having your birth plan ready keeps your preferences clear in a busy unit that sees a lot of Utah County families. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Utah Valley Hospital (Intermountain Health)", paragraph: "Utah Valley Hospital, at 1034 N 500 W in Provo about 15 miles south of Lehi, has the highest-level NICU in Utah County \u2014 a Level III NICU verified on intermountainhealthcare.org \u2014 with 24/7 neonatologists, maternal-fetal medicine specialists, neonatal transport capability, and the capacity to handle births as early as 23\u201324 weeks gestation. It\u2019s the regional referral center for high-risk pregnancies across Utah County, which means the L&D unit runs busy. Doulas are generally welcome as part of your support team. If you\u2019re navigating a high-risk pregnancy, this is where your OB will likely send you \u2014 and a doula who knows the rhythm of this hospital makes a real difference when you\u2019re already processing a lot. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something specific to work from." },
      { name: "Timpanogos Regional Hospital (Intermountain Health)", paragraph: "Timpanogos Regional Hospital, at 750 W 800 N in Orem about 10 miles south of Lehi, is another Intermountain Health option with a Level II NICU (contact the hospital directly for current NICU level verification). It offers full L&D services, private birthing suites, and midwifery care \u2014 another community-hospital alternative for Lehi families who want to avoid the drive to Provo. Same Intermountain doula-welcome policy. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> before your hospital tour." },
    ],
    // Birth center search: NPI registry taxonomy 261QB0400X returned no confirmed results
    // for Lehi, American Fork, Pleasant Grove, Orem, or Provo in Utah County.
    // Google Maps search "birth center Lehi UT" and "birth center Utah County" found
    // no freestanding birth centers currently operating in Utah County.
    // Nearest known freestanding birth centers are in Salt Lake City (Salt Lake County),
    // approximately 30-45 minutes north. Utah families seeking out-of-hospital birth
    // typically work with licensed home-birth midwives (CPMs licensable in Utah since ~2017).
    // Verified 2026-05-27.
    birthCenterDetails: [],
    medicaidNote: "Utah Medicaid does NOT cover doula services as of 2026. HB 222 (2024) proposed adding postpartum doula coverage but did not pass. Advocacy groups including the Utah Doula Association and Birth Matters Utah continue pushing for legislation. HSA and FSA funds can cover doula fees, and Utah\u2019s large community of LDS doulas often offer sliding-scale or donation-based pricing \u2014 ask individual doulas what\u2019s available.",
    insuranceNote: "Utah has no state mandate requiring private insurers to cover doula services. Some tech employers in the Silicon Slopes corridor (Lehi area) offer doula benefits through platforms like Maven Clinic or Carrot Fertility as part of maternal wellness packages \u2014 check with your HR department. Otherwise, check whether your plan covers out-of-network doula services, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your provider directly to confirm.",
    faqs: [
      { q: "Does Medicaid cover doulas in Lehi?", a: "Not yet \u2014 Utah Medicaid does not currently cover doula services. HB 222 tried to change that in 2024 but didn\u2019t pass. But you still have options: Utah has one of the largest per-capita doula communities in the country, many offering sliding-scale or donation-based pricing. HSA and FSA funds can cover doula fees. And some tech employers in the Silicon Slopes area offer doula benefits \u2014 check with HR. Ask any doula you interview about payment flexibility; most would rather work with your budget than see you go without." },
      { q: "How much does a doula cost in Lehi?", a: "Expect to pay $800 to $1,800 for a birth doula in Lehi \u2014 notably lower than the national average of $1,500\u2013$2,500+. Utah\u2019s large LDS doula community, where many doulas view birth support as ministry and charge accordingly, keeps prices accessible. The investment typically covers prenatal visits, labor support, and postpartum check-ins. For even lower rates, look for student doulas through the Utah Doula Association or community doula programs. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Which hospitals near Lehi accommodate birth plans?", a: "American Fork Hospital (Level II NICU, ~6 miles), Utah Valley Hospital (Level III NICU, ~15 miles), and Timpanogos Regional Hospital in Orem (Level II NICU, ~10 miles) all offer L&D services and generally accommodate birth plans under Intermountain Health\u2019s policy. Utah Valley Hospital is the go-to for high-risk pregnancies \u2014 it\u2019s the only Level III NICU in Utah County. Always confirm your hospital\u2019s current visitor and support-person policy during your tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Lehi?", a: "No \u2014 there are currently no freestanding birth centers in Lehi or anywhere in Utah County. The nearest birth centers are in Salt Lake City, about 30\u201345 minutes north. Utah families seeking an out-of-hospital birth typically work with licensed home-birth midwives. CPMs became licensable in Utah starting around 2017, which has expanded home birth options. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a hospital or home birth is right for you." },
      { q: "Does True Joy Birthing work with Lehi families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Lehi birth setting, whether you\u2019re delivering at a hospital or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way \u2014 no signup required." },
    ],
    nearbyCities: ["sandy-ut", "salt-lake-city-ut"],
  },
  "port-st-lucie-fl": {
    city: "Port St. Lucie",
    state: "FL",
    slug: "port-st-lucie-fl",
    costLow: 1200,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Port St. Lucie is one of the fastest-growing cities in the United States \u2014 population has surged past 240,000 with roughly 50% growth over the past decade, driven by South Florida families relocating north for affordable housing and remote-work flexibility. The birth community is still catching up to the population boom. Cleveland Clinic Martin Health and HCA\u2019s St. Lucie Medical Center anchor a hospital-only birth landscape \u2014 there are no freestanding birth centers in the Treasure Coast region, which is a significant gap for a city this size. CNMs practice within hospital systems, and Florida\u2019s refusal to license CPMs means out-of-hospital birth options are extremely limited. Doula support exists through groups like Treasure Coast Doulas, but the community is small relative to the volume of young families arriving every month.",
    heroLocalDetail: "Cleveland Clinic Martin Health \u2013 Tradition Hospital sits at 10000 SW Innovation Way in the master-planned Tradition community on PSL\u2019s west side, right off I-95 at the Gatlin Boulevard exit \u2014 and that I-95/Gatlin interchange backs up steadily during afternoon rush, so if you\u2019re coming from St. Lucie West or southern PSL, add 10 minutes to your estimate. St. Lucie Medical Center is at 1800 SE Tiffany Ave on the east side of town, reachable via US-1 (South Federal Highway) or the Turnpike\u2019s Becker Road exit. PSL is roughly 120 square miles of suburban sprawl \u2014 if you live in western communities like Tradition or St. Lucie West, you\u2019re 20\u201325 minutes from St. Lucie Medical Center on the east side, so know which hospital your OB delivers at before you\u2019re timing contractions. The Turnpike runs north\u2013south through the center of the city and I-95 runs along the western edge \u2014 both are your main arteries, and both slow down between 4 and 6 PM. Jensen Beach families typically deliver at Cleveland Clinic Martin North in Stuart, about 5\u201310 minutes south across the county line. For third-trimester walks, the Savannas Preserve State Park on the east side has flat trails through wetlands, and Tradition Square near the hospital has a walkable lakefront area that\u2019s popular with young families in the evening.",
    hospitalDetails: [
      { name: "Cleveland Clinic Martin Health \u2013 Tradition Hospital", paragraph: "Cleveland Clinic Martin Health \u2013 Tradition Hospital, at 10000 SW Innovation Way in PSL\u2019s Tradition community, opened in 2014 and is the newest hospital in the city. It has a Level II Special Care Nursery (managing babies \u226532 weeks gestation; transfers complex cases to Martin North\u2019s Level III NICU), 24/7 OB hospitalist coverage, epidural availability, CNM-friendly policies, and lactation consultants. The hospital handles an estimated 1,200\u20131,500 births per year and draws heavily from the young families relocating into the Tradition and St. Lucie West communities. If you\u2019re delivering at Tradition, having your birth plan ready keeps your preferences clear in a hospital that\u2019s busy and growing fast. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started." },
      { name: "Cleveland Clinic Martin Health \u2013 Martin North Hospital", paragraph: "Cleveland Clinic Martin Health \u2013 Martin North Hospital, at 800 SE Hospital Ave in Stuart (Martin County, about 10\u201315 miles from PSL), has the Treasure Coast\u2019s only Level III NICU \u2014 the regional referral center for high-risk pregnancies and critically ill newborns, with 24/7 neonatologists, sustained ventilation capability, and the highest-acuity neonatal care in the immediate region. It\u2019s also the highest-volume birthing hospital in the area with an estimated 2,000\u20132,500 births per year. Martin North\u2019s dedicated maternity wing, CNM practices, lactation support, and childbirth education make it the go-to for complex pregnancies throughout St. Lucie and Martin counties. If you\u2019re navigating a high-risk pregnancy, this is likely where your OB will refer you. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> so your team has something specific to work from." },
      { name: "St. Lucie Medical Center", paragraph: "St. Lucie Medical Center, at 1800 SE Tiffany Ave on PSL\u2019s east side, is an HCA Healthcare hospital that\u2019s been serving the community since 1983. It has a Level II Special Care Nursery (transfers complex cases to Martin North\u2019s Level III NICU), 24/7 OB/GYN and anesthesia coverage, midwifery care through affiliated practices, lactation consultants, and childbirth classes. The hospital handles an estimated 1,000\u20131,400 births per year and serves central and eastern PSL. If we\u2019re being real, PSL\u2019s sprawl means this east-side hospital is a long drive from the Tradition area \u2014 so confirm which hospital your provider delivers at early, not at 38 weeks. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to walk in prepared." },
    ],
    // Birth center search: No freestanding birth centers operate in Port St. Lucie,
    // Jensen Beach, or the broader Treasure Coast region (St. Lucie County, Martin County)
    // as of 2026. Florida's restrictive birth center licensing (ACHC), high malpractice
    // costs, and prohibition on CPM licensure severely constrain out-of-hospital birth
    // infrastructure. The nearest known birth centers are approximately 45-60 minutes
    // south in Palm Beach County. Hospital birth is the only organized option in PSL.
    // Cleveland Clinic Martin Health offers midwifery-model care within the hospital
    // setting (low-intervention philosophy, hydrotherapy options) but no separate
    // freestanding facility. Verified 2026-05-27.
    birthCenterDetails: [
    ],
    medicaidNote: "As of 2026, Florida Medicaid does not cover doula services. Florida has not enacted legislation to add Medicaid doula coverage. St. Lucie County families on Medicaid should check with their managed care plan (Staywell, Sunshine Health, Simply Healthcare, UnitedHealthcare Community Plan) about any maternal wellness benefits that might include doula support. Roughly 35\u201340% of births in St. Lucie County are Medicaid-covered, making this a significant equity gap. Contact Florida Medicaid at 1-877-254-1055 or visit flmedicaidmanagedcare.com for current plan information.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Port St. Lucie area. Cleveland Clinic Martin Health accepts most major insurers. HSA and FSA funds can help cover out-of-pocket doula costs. South Florida\u2019s employer market increasingly includes maternal wellness benefits \u2014 check with your provider about doula coverage or reimbursement. Ask your doula for a superbill for insurance reimbursement.",
    faqs: [
      { q: "How much does a doula cost in Port St. Lucie?", a: "Expect to pay $1,200 to $2,500 for a doula in Port St. Lucie. The Treasure Coast doula community is smaller than in South Florida metros, so start your search early. Some doulas may charge a travel fee if they\u2019re commuting from Stuart or Jupiter, so ask upfront. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Port St. Lucie?", a: "Not yet \u2014 Florida\u2019s Medicaid doesn\u2019t cover doulas right now. But that doesn\u2019t mean you\u2019re alone. Community doulas and sliding-scale options exist \u2014 many doulas would rather work with your budget than see you go without. Some doulas even reserve pro bono spots. Advocacy groups are working on changing this. Ask any doula you interview about payment plans and reduced-fee spots. And grab the <a href=\"/birth-plan-template/\">free birth plan template</a> \u2014 no matter who\u2019s in the room with you, knowing what you want is your superpower." },
      { q: "Which hospitals in Port St. Lucie accommodate birth plans?", a: "Cleveland Clinic Martin Health \u2013 Tradition Hospital (Level II NICU), Cleveland Clinic Martin Health \u2013 Martin North Hospital in Stuart (Level III NICU, highest-level in the Treasure Coast), and St. Lucie Medical Center (Level II NICU) all offer labor and delivery and generally accommodate birth plans. Doulas are welcomed at all three \u2014 confirm current visitor and support-person policies during your hospital tour. For the most complex neonatal cases, Martin North\u2019s Level III NICU is the regional referral center. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers in Port St. Lucie?", a: "No \u2014 there are no freestanding birth centers in Port St. Lucie, Jensen Beach, or the broader Treasure Coast region as of 2026. Florida\u2019s birth center regulations and lack of CPM licensure make out-of-hospital birth options very limited. Cleveland Clinic Martin Health offers midwifery-model care within the hospital setting for families seeking a lower-intervention approach. The nearest freestanding birth centers are approximately 45\u201360 minutes south in Palm Beach County. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through whether a hospital birth center-style program or a longer drive to a freestanding birth center is right for you." },
      { q: "Does True Joy Birthing work with Port St. Lucie families?", a: "Yes \u2014 and it\u2019s free. True Joy Birthing\u2019s birth plan app, checklist, and guided walkthrough work for any Port St. Lucie birth setting, whether you\u2019re delivering at a hospital or at home. The app also helps you find and connect with local doulas and midwives. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start preparing your way \u2014 no signup required." },
    ],
    nearbyCities: ["jacksonville-fl", "orlando-fl", "miami-fl"],
  },
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
      { name: "UMass Memorial Medical Center", paragraph: "UMass Memorial is Central Massachusetts\u2019s largest hospital and the only verified Level III NICU in Worcester (stated directly on ummhealth.org), with maternal-fetal medicine specialists, midwifery services, and 24/7 obstetric anesthesiology. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Saint Vincent Hospital", paragraph: "Saint Vincent Hospital offers labor and delivery services on the west side of Worcester, with a NICU for babies who need extra support. If we\u2019re being real, UMass Memorial gets more of the high-risk referrals in the region, but Saint Vincent is a solid option for families living in the western neighborhoods." },
    ],
    // Birth center search: NPI 261QB0400X returned no results for Worcester MA. Google Maps and web search found no verified freestanding birth centers in Worcester. The nearest birth center options are in the greater Boston area (Birth Sanctuary Cambridge, approximately 45 minutes east). Verified 2026-06.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes \u2014 Massachusetts MassHealth covers doula services as of January 2024, with reimbursement of approximately $1,200 for a full package covering 2 prenatal visits, labor and delivery support, and 2 postpartum visits. Your doula must be enrolled as a MassHealth provider.",
    insuranceNote: "Massachusetts requires most private insurance plans through the state exchange (MA Health Connector) to cover maternity services. Doula coverage by private insurers is expanding \u2014 some Blue Cross Blue Shield of MA and Tufts Health Plan policies now include doula benefits. Check your plan documents or call member services and ask about \u2018certified doula services.\u2019",
    faqs: [
      { q: "How much does a doula cost in Worcester?", a: "Expect to pay $1,000 to $2,800 for a doula in Worcester. Costs tend to run a bit lower than Boston rates, but the community is smaller so start your search early. Some Worcester doulas also serve families in the surrounding towns like Shrewsbury, Auburn, and Holden. The investment typically covers prenatal visits, labor support, and postpartum check-ins. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Worcester?", a: "Yes \u2014 Massachusetts MassHealth covers doula services as of January 2024, with approximately $1,200 for the full package (2 prenatal visits, labor support, and 2 postpartum visits). Your doula must be a MassHealth-enrolled provider, so ask upfront whether they accept MassHealth. This coverage is a real benefit for Worcester families \u2014 grab the <a href=\"/birth-plan-template/\">free birth plan template</a> and make sure your doula team knows your preferences." },
      { q: "Which hospitals in Worcester accommodate birth plans?", a: "UMass Memorial Medical Center (verified Level III NICU) and Saint Vincent Hospital both offer labor and delivery and generally accommodate birth plans. UMass Memorial is Central Massachusetts\u2019s regional referral center for high-risk pregnancies and has midwifery services available. Doulas are welcomed at both \u2014 confirm current visitor policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Worcester?", a: "No \u2014 there are no freestanding birth centers in Worcester as of 2026. The nearest birth center is Birth Sanctuary Cambridge, approximately 45 minutes east. UMass Memorial offers midwifery-model care within the hospital setting for families seeking a lower-intervention approach. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through your options." },
      { q: "Does True Joy Birthing work with Worcester families?", a: "True Joy Birthing provides free birth-prep tools for Worcester families. The free birth plan, checklist, and guided walkthrough in the app work for any Worcester birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What about postpartum support in Worcester?", a: "Worcester has a growing postpartum support network, including community health centers that offer lactation consulting and support groups. UMass Memorial\u2019s postpartum unit provides initial lactation support, and local doulas often include postpartum visits in their packages. If you\u2019re looking for ongoing postpartum doula support, start your search during pregnancy \u2014 the community is smaller than Boston\u2019s and providers book up. <a href=\"/postpartum-doula/\">Learn more about postpartum doula support</a>." },
    ],
    nearbyCities: ["boston-ma", "providence-ri", "hartford-ct"],
    publishedDate: "2026-06-08",
    lat: 42.2626,
    lng: -71.8019,
  },
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
      { name: "Memorial Medical Center", paragraph: "Memorial Medical Center is Springfield\u2019s largest hospital with a Level III NICU (verified on memorial.health), maternal-fetal medicine specialists, and a midwifery practice. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "HSHS St. John\u2019s Hospital", paragraph: "HSHS St. John\u2019s Hospital on Springfield\u2019s north side offers labor and delivery with a NICU for babies who need extra support. If we\u2019re being real, Memorial gets most of the high-risk referrals in the region, but St. John\u2019s is a solid option, especially for families on the north and west sides of town." },
    ],
    // Birth center search: NPI 261QB0400X returned no results for Springfield IL. Google Maps and web search found no verified freestanding birth centers in Springfield. The nearest birth center options are in the greater Chicago area (approximately 200 miles north). Verified 2026-06.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes \u2014 Illinois Medicaid (Illinois Health Connect, Meridian, Molina, and other managed care plans) covers doula services under HB 4430, reimbursing up to approximately $1,500 per pregnancy for prenatal, labor, and postpartum support. Your doula must be enrolled as an Illinois Medicaid provider.",
    insuranceNote: "Whether doula services are covered by private insurance in the Springfield area varies by plan. Some Blue Cross Blue Shield of Illinois and Health Alliance policies include doula benefits. HSA and FSA funds can help cover out-of-pocket doula costs. Ask any doula you interview about payment plans and sliding-scale options \u2014 Springfield doulas are often more flexible on pricing than Chicago-area providers.",
    faqs: [
      { q: "How much does a doula cost in Springfield?", a: "Expect to pay $800 to $2,000 for a doula in Springfield. The local market is more affordable than Chicago rates, though the community of available doulas is smaller. Some Springfield doulas also serve families in nearby Decatur and Jacksonville. The investment typically covers prenatal visits, labor support, and postpartum check-ins. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Springfield?", a: "Yes \u2014 Illinois Medicaid covers doula services under HB 4430, reimbursing up to approximately $1,500 per pregnancy for a full package of prenatal, labor, and postpartum support. Your doula must be an Illinois Medicaid-enrolled provider. This is real coverage, not a pilot program \u2014 ask your doula upfront whether they accept Medicaid. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> and make sure your doula team knows your preferences." },
      { q: "Which hospitals in Springfield accommodate birth plans?", a: "Memorial Medical Center (verified Level III NICU) and HSHS St. John\u2019s Hospital both offer labor and delivery and generally accommodate birth plans. Memorial is Springfield\u2019s regional referral center for high-risk pregnancies and has a midwifery practice. Doulas are welcomed at both \u2014 confirm current visitor policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Springfield?", a: "No \u2014 there are no freestanding birth centers in Springfield as of 2026. Both Memorial Medical Center and HSHS St. John\u2019s offer midwifery-model care within the hospital setting. For families seeking a birth center experience, the nearest options are in the Chicago area, approximately 200 miles north. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through your options." },
      { q: "Does True Joy Birthing work with Springfield families?", a: "True Joy Birthing provides free birth-prep tools for Springfield families. The free birth plan, checklist, and guided walkthrough in the app work for any Springfield birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What about postpartum support in Springfield?", a: "Springfield has community health centers and hospital-based lactation support, but the postpartum doula community is small. If you\u2019re looking for ongoing postpartum support, start your search during pregnancy. Some local doulas include postpartum visits in their birth packages, and a few offer postpartum-only packages. <a href=\"/postpartum-doula/\">Learn more about postpartum doula support</a>." },
    ],
    nearbyCities: ["chicago-il", "indianapolis-in"],
    publishedDate: "2026-06-08",
    lat: 39.7990,
    lng: -89.6440,
  },
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
      { name: "Howard County General Hospital", paragraph: "Howard County General Hospital is a Johns Hopkins affiliate right in Columbia\u2019s Town Center, offering labor and delivery with a NICU for babies who need extra support and direct access to Hopkins specialists for higher-risk cases. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Holy Cross Hospital", paragraph: "Holy Cross Hospital in nearby Silver Spring (about 20 minutes south) is a high-volume maternity hospital with a verified Level III NICU (stated directly on holycrosshealth.org) and one of the busiest L&D units in the DC suburbs. If we\u2019re being real, some Columbia families choose Holy Cross specifically for its NICU level and Turkish-born OB population \u2014 it\u2019s worth the drive if you want that extra layer of neonatal coverage." },
    ],
    // Birth center search: NPI 261QB0400X returned no results for Columbia MD. Google Maps and web search found no verified freestanding birth centers in Columbia or Howard County. The nearest birth center option is in the Baltimore area. Verified 2026-06.
    birthCenterDetails: [
    ],
    medicaidNote: "Yes \u2014 Maryland Medicaid covers doula services as of 2024, with reimbursement rates including $450 for labor and delivery support, $75 per prenatal or postpartum visit (up to 4 visits), totaling up to $900 per pregnancy for Medicaid-enrolled doulas.",
    insuranceNote: "In the Columbia and Howard County area, many families have employer-sponsored insurance through Johns Hopkins Health System, CareFirst BlueCross BlueShield, or UnitedHealthcare. Doula coverage by private insurers is expanding \u2014 some policies now include doula benefits. Check your specific plan documents and ask about \u2018certified doula services.\u2019 HSA and FSA funds can also help cover out-of-pocket doula costs.",
    faqs: [
      { q: "How much does a doula cost in Columbia?", a: "Expect to pay $900 to $2,500 for a doula in the Columbia area. Howard County rates trend slightly higher than Baltimore prices but lower than DC rates, and many doulas serve the entire Baltimore\u2013DC corridor. The investment typically covers prenatal visits, labor support, and postpartum check-ins. <a href=\"/birth-plan-template/\">Download the free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Columbia?", a: "Yes \u2014 Maryland Medicaid covers doula services as of 2024, with up to $900 per pregnancy ($450 for labor support plus $75 per visit for up to 4 prenatal/postpartum visits). Your doula must be a Maryland Medicaid-enrolled provider. This is real coverage, not a pilot \u2014 ask upfront whether your doula accepts Medicaid. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> and make sure your doula team knows your preferences." },
      { q: "Which hospitals in Columbia accommodate birth plans?", a: "Howard County General Hospital (a Johns Hopkins affiliate, right in Columbia) and Holy Cross Hospital in Silver Spring both accommodate birth plans. Howard County General has direct access to Hopkins specialists for higher-risk cases, while Holy Cross has a verified Level III NICU (stated directly on holycrosshealth.org). Doulas are welcomed at both — confirm current visitor policies during your hospital tour. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Columbia?", a: "No \u2014 there are no freestanding birth centers in Columbia or Howard County as of 2026. Howard County General Hospital offers midwifery-model care within the hospital setting. The nearest freestanding birth center options are in the Baltimore area. <a href=\"/birth-plan-template/\">Grab the free birth plan template</a> to think through what\u2019s right for your birth." },
      { q: "Does True Joy Birthing work with Columbia families?", a: "True Joy Birthing provides free birth-prep tools for Columbia families. The free birth plan, checklist, and guided walkthrough in the app work for any Columbia birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What about postpartum support in Columbia?", a: "Columbia has strong lactation support through Howard County General Hospital and local pediatric practices. The postpartum doula community draws from both Baltimore and DC networks, so you\u2019ll find more options than in most suburbs. Start your search during pregnancy if you want ongoing postpartum support. <a href=\"/postpartum-doula/\">Learn more about postpartum doula support</a>." },
    ],
    nearbyCities: ["baltimore-md", "richmond-va", "virginia-beach-va"],
    publishedDate: "2026-06-08",
    lat: 39.2139,
    lng: -76.8558,
  },
  "norfolk-va": {
    city: "Norfolk",
    state: "VA",
    slug: "norfolk-va",
    heroImage: "/images/norfolk-va-birth-doula-skyline.webp",
    enableBlogResources: true,
    supportSceneAlt: "A doula walking alongside an expectant mom on the Elizabeth River Trail in Norfolk, Virginia",
    supportSceneImage: "/images/norfolk-support-scene.webp",
    midwifeInfo: {
      paragraph: "Virginia licenses Certified Nurse-Midwives (CNMs) and Certified Professional Midwives (CPMs), with CNMs practicing in hospitals and CPMs attending out-of-hospital births. Virginia was among the first states to cover doula services through Medicaid (effective January 2024), making Norfolk a strong market for doula-supported births. Sentara Norfolk General employs hospital-based CNMs, and the Hampton Roads midwifery community includes both hospital and home-birth practitioners serving Norfolk families.",
      credentialTypes: " (CNMs and CPMs)",
      credentialDetail: "Virginia recognizes both CNMs (hospital practice) and CPMs (out-of-hospital), giving Norfolk families more provider options than states that only license CNMs,",
    },
    costLow: 1200,
    costHigh: 2500,
    shelbiServesHere: false,
    culture: "Norfolk is a Navy town with a strong military medical presence thanks to EVMS and Sentara. The birth community reflects the city\u2019s diversity \u2014 families of active-duty service members, young professionals, and longtime residents all navigating Hampton Roads hospitals together. CHKD and Sentara Norfolk General sit side by side in the Ghent neighborhood, making this one of the most resource-rich birth cities in Virginia.",
    heroLocalDetail: "At 38 weeks in Norfolk, you\u2019re likely thinking about the Ghent-to-downtown route on I-264 or Hampton Boulevard. Sentara Norfolk General and CHKD sit right off Brambleton Avenue in the Ghent neighborhood, so if you\u2019re delivering during Navy change-of-command season \u2014 May through August \u2014 expect heavier traffic on I-564 and around the base exits. The Elizabeth River Trail along the waterfront gives you flat, shaded walking for those final-weeks strolls.",
    hospitalDetails: [
      { name: "Sentara Norfolk General Hospital", thumbnail: "/images/sentara-norfolk-hospital.webp", paragraph: "Sentara Norfolk General Hospital is a 563-bed academic teaching hospital for Eastern Virginia Medical School and the Hampton Roads region\u2019s only Level I trauma center. It has a full obstetrics program with a NICU for babies who need extra support and direct access to CHKD\u2019s pediatric specialists for higher-risk cases. Doulas are generally welcome \u2014 confirm current visitor policies during your hospital tour. If you\u2019re delivering here, having your birth plan ready makes the whole check-in process smoother. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> to get started." },
      { name: "Children\u2019s Hospital of The King\u2019s Daughters", thumbnail: "/images/chkd-hospital.webp", paragraph: "Children\u2019s Hospital of The King\u2019s Daughters (CHKD) is a 206-bed freestanding children\u2019s hospital adjacent to Sentara Norfolk General in Ghent. While CHKD itself does not handle deliveries, its pediatric and neonatal specialists work closely with Sentara\u2019s L&D team for any infant needing advanced care after birth." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for Norfolk VA.
    // Google Maps search "birth center Norfolk VA" found no verified freestanding birth centers in Norfolk or Hampton Roads.
    // Verified 2026-06-08.
    birthCenterDetails: [
    ],
    localDoulas: [
      { name: "Dynamic Family Doulas", credential: "Birth Doula, Lactation Support", practice: "Dynamic Family Doulas", url: "https://www.bornbir.com/norfolk/va/doula", description: "Find a Doula Near Me in Norfolk, VA Answer a few questions, and match directly with top-rated and certified doulas near you in Norfolk, VA - all in 30 seconds, and it's entirely free Get matched now.", photo: "https://res.cloudinary.com/bornbir/image/upload/f_auto,q_auto/production/static/sipqsp5rstgzzq7sgfhr.png", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Placenta Encapsulation"], costRange: "$800–$2000", acceptsMedicaid: true },
      { name: "Your Doula In Love LLC", credential: "Postpartum Doula", practice: "Your Doula In Love LLC", url: "http://yourdoulainlove.com", description: "black doula near me doula near me Virginia Beach doula.", photo: "https://img1.wsimg.com/isteam/ip/7f765464-9252-46ba-bb17-abe305c21173/blob-0004.png", services: ["Postpartum", "Evidence-Based Care"], acceptsMedicaid: true },
      { name: "Tina the Postpartum Doula", credential: "Postpartum Doula", practice: "Tina the Postpartum Doula", url: "http://www.tinathedoula.com", description: "0 You’ve done everything to prepare for the birth….", photo: "https://images.squarespace-cdn.com/content/v1/6028005e705ea36f1bfec7a8/e1847608-0bc0-479c-bbfa-906a72618dd3/TINA+THE+POSTPARTUM+DOULA+%2811%29.png", services: ["Postpartum", "Breastfeeding Support"] },
      { name: "Amara's Childbirth Education and Doula Services", credential: "Birth Doula", practice: "Amara's Childbirth Education and Doula Services", url: "http://www.amaradoula.com", description: "jpg emiliana-hall-WdXz5hso68U-unsplash.", photo: "https://images.squarespace-cdn.com/content/v1/5f108a76b8aa1848c073179d/1594934945623-0FOJXO00ENMHDWI0D20C/Logo_Amara.jpg", services: ["Birth Doula", "Postpartum", "Childbirth Education"] },
      { name: "Wholesome Hearts Doula Services", credential: "Birth Doula", practice: "Wholesome Hearts Doula Services", url: "https://www.facebook.com/WholesomeHeartsDoula", description: "Professional doula serving families in the area." },
      { name: "Leslie C. Cuffee ~ Doula and Placenta Encapsulation", credential: "Birth Doula", practice: "Leslie C. Cuffee ~ Doula and Placenta Encapsulation", url: "http://lesliecuffee.com", description: "Hi, I’m Leslie A doula, passionate about birth and empowering mothers through their pregnancy, labor and delivery.", services: ["Birth Doula", "Postpartum", "Placenta Encapsulation"] },
      { name: "APL Doula Services", credential: "Birth Doula", practice: "APL Doula Services", url: "http://apldoula.com", description: "Labor and Delivery Support I will meet with you several times during your pregnancy to provide educational resources and answer any questions you have about the birthing process.", photo: "https://static.wixstatic.com/media/510cda_5bb43146194e401fadacce5550d1748c~mv2.png/v1/fill/w_400,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/APL%20Doula.png", services: ["Birth Doula", "Postpartum", "Placenta Encapsulation", "Prenatal Care"] },
      { name: "Yorktown Doula", credential: "Birth Doula", practice: "Yorktown Doula", url: "http://www.yorktowndoula.com", description: "Advocating for your plan and supporting you through the unplanned Whether you’re a seasoned mom expecting your third child or a first-time mom anxiously awaiting your bundle of joy, my doula services help ensure your labor and delivery is g", photo: "https://static.showit.co/1600/kO2_oxXBTGGpmFgeHil-4Q/192629/yorktown_doula_5.jpg", services: ["Birth Doula", "Postpartum", "Breastfeeding Support", "Prenatal Care"] },
      { name: "Enduring Love Doula, LLC", credential: "Birth Doula", practice: "Enduring Love Doula, LLC", url: "https://enduringlovedoula.com", description: "Enduring Love Doula Enduringlovedoula@gmail.", photo: "https://homebirthhamptonroads.org/static/profile_pics/e514948cf65dd2cb72653eae71b7f155.jpg", services: ["Birth Doula"] },
      { name: "Laurie Ann's Postpartum Doula Services", credential: "Postpartum Doula", practice: "Laurie Ann's Postpartum Doula Services", url: "http://www.lafdoula.com", description: "Mothering the Mother in the Fourth Trimester x ``` ``` Live What LAF Doula can do for you.", photo: "https://static.wixstatic.com/media/6c283f_32bc3440fc024f5393b0c5dc0111e0a5~mv2.jpg/v1/fill/w_434,h_323,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7277_edited.jpg", services: ["Postpartum", "Lactation", "Breastfeeding Support"], acceptsMedicaid: true },
      { name: "Blossom Doula Care, LLC", credential: "Birth Doula, Lactation Support", practice: "Blossom Doula Care, LLC", url: "https://rniesen.wordpress.com", description: "com :: Serving Virginia Beach, Norfolk, Chesapeake, VA and more.", photo: "https://rniesen.wordpress.com/wp-content/uploads/2022/11/dhpqobaprscnf1zpuv78ra_thumb_e.jpg", services: ["Birth Doula", "Lactation"] },
      { name: "Calming Touch Doula & Massage Services", credential: "Birth Doula", practice: "Calming Touch Doula & Massage Services", url: "https://pocketsuite.io/book/calming-touch-doula-and-massage?fbclid=Iwb21leAPSXcVjbGNrA9Jdv2V4dG4DYWVtAjExAHNydGMGYXBwX2lkDDM1MDY4NTUzMTcyOAABHqmetSe_WdyxTC7dy_SmpLrJpyUN3kuqA8Ui7cG3Aw4_dT5tRgwnh1QBoFnT_aem_EmZB787IN8RlGqsGinPR1A", description: "Background image Calming Touch Doula & Massage Anne is a Licensed Massage Therapist, now offering massage services at The Blissful Mama in Virginia Beach.", photo: "https://s3-us-west-1.amazonaws.com/cdn.pocketsuite.io/09ef96f5-875a-11f0-8b50-4a4a2ee44d28/32d7c794-8efd-4aae-87a9-cd606e632b9e.jpg", services: ["Birth Doula", "Postpartum", "Prenatal Care"] },
      { name: "Daisy Doula Services", credential: "Birth Doula", practice: "Daisy Doula Services", url: "https://daisydoulaservices.com", description: "Birth & Postpartum Doula in Knoxville & Maryville,TN You've thought about the birth.", photo: "https://static.wixstatic.com/media/259064_30fab0f0610948cda20b22e21d201a1d~mv2.jpg/v1/crop/x_0,y_241,w_2000,h_1290/fill/w_310,h_200,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Jerika%2C%20Daisy%20Doula%20Services%2C%20teaching%20a.jpg", services: ["Birth Doula", "Postpartum", "Placenta Encapsulation", "Prenatal Care", "VBAC Support"] },
      { name: "Natural Harmony Doula Services", credential: "Postpartum Doula", practice: "Natural Harmony Doula Services", url: "https://naturalharmonydoula.com", description: "Can I help you learn about childbirth.", photo: "https://images.squarespace-cdn.com/content/v1/63c58d4355344f23d5ff060b/ae242280-4252-4163-9158-1a55437847c2/unsplash-image-RM9yEZLoJSc.jpg", services: ["Postpartum", "Prenatal Care"] },
      { name: "Beach Babies Doula Services", credential: "Birth Doula, Lactation Support", practice: "Beach Babies Doula Services", url: "https://www.beachbabiesdoulavb.com", description: "Location & Hours Suggest an edit Map Mon - Open 24 hours Tue - Open 24 hours Open now Wed - Open 24 hours Thu - Open 24 hours Fri - Open 24 hours Sat - Open 24 hours Sun - Open 24 hours.", services: ["Lactation", "Prenatal Care"] },
      { name: "Akilah White Doula Services", credential: "Birth Doula", practice: "Akilah White Doula Services", url: "http://akilahwhite.com", description: "Empowering, Supporting & Nurturing one family at a time What is a doula.", photo: "https://images.squarespace-cdn.com/content/v1/5ffe642e043f90379f5095b3/1ca19699-86fb-4380-89af-477ee76ae043/Home.png", acceptsMedicaid: true },
      { name: "Debbie’s Doula Services", credential: "Birth Doula", practice: "Debbie’s Doula Services", url: "http://debbiesdoulaservices.com", description: "com - - Bookings - My Account - Sign out Signed in as: filler@godaddy.", photo: "https://img1.wsimg.com/isteam/ip/9ac24cca-e0d3-4dd4-bf59-17d0a3e29bf4/E5EA9F63-3387-4D2A-A4CC-29A65522E57C.jpeg", services: ["Birth Doula", "Postpartum", "Breastfeeding Support", "Prenatal Care"] },
      { name: "Whispering Lullabies LLC Doula and Overnight Newborn Care Services", credential: "Postpartum Doula", practice: "Whispering Lullabies LLC Doula and Overnight Newborn Care Services", url: "http://www.whisperinglullabies.com", description: "Helping exhausted parents get real rest through calm, nervous-system-centered newborn support.", photo: "https://static.wixstatic.com/media/9019fc_a4f9cece00ed455b90ab09399a89b074~mv2.png/v1/fill/w_984,h_1024,al_c,q_90,enc_avif,quality_auto/9019fc_a4f9cece00ed455b90ab09399a89b074~mv2.png", services: ["Postpartum", "Overnight Care"] },
      { name: "Soulful Beginnings Doula LLC", credential: "Birth Doula", practice: "Soulful Beginnings Doula LLC", url: "https://soulful-beginnings.com", description: "Empowering Women Throughout Motherhood Book a Call.", photo: "https://soulful-beginnings.com/wp-content/uploads/2025/07/DM0A2577-scaled-e1754326281681-844x1024.jpg", services: ["Birth Doula", "Postpartum", "Prenatal Care"] },
      { name: "Sacred Stories Doula LLC", credential: "Birth Doula", practice: "Sacred Stories Doula LLC", url: "https://sacredstoriesdoula.com", description: "a white sunburst illustration blob: HI let me introduce myself I’m Lyleanne — a DONA birth doula, certified bereavement doula, and birth photographer with a passion for holding space through every kind of birth story.", photo: "https://sacredstoriesdoula.com/_assets/media/11fe0550c47f4e9d5a9820c51126a2b0.jpg", services: ["Birth Doula", "Postpartum", "Home Birth", "Evidence-Based Care"] },
      { name: "Jas the Doula From the Start Holistic Service", credential: "Postpartum Doula", practice: "Jas the Doula From the Start Holistic Service", url: "https://jasthedoula.com", description: "JAS THE DOULA Jasmine has case managed pregnant and postpartum women for seven years, providing ongoing education, resources, encouragement and support.", photo: "https://jasthedoula.com/wp-content/uploads/sb-instagram-feed-images/323582280_753258909559203_3271580222371811148_nfull.jpg", services: ["Postpartum", "Lactation", "Breastfeeding Support", "Prenatal Care"], acceptsMedicaid: true },
      { name: "Nurturing Essence Doula Services", credential: "Birth Doula", practice: "Nurturing Essence Doula Services", url: "https://nurturingessenceds.org", description: "Nurturing Essence — Family Support & Care Nurturing Essence — Family Support & Care Nurturing Essence hero family-centered care.", photo: "https://storage.googleapis.com/msgsndr/GxEtHbS3nFXXIU1tvNrH/media/68f909a302a7ea9f8e01ba5d.jpeg", services: ["Overnight Care", "Sibling Support"] },
      { name: "La Doula Yani LLC", credential: "Postpartum Doula", practice: "La Doula Yani LLC", url: "http://ladoulayani.com", description: "A doula is a professional labor assistant who provides physical and emotional support to you and your partner during pregnancy, childbirth and the postpartum period.", photo: "https://images.squarespace-cdn.com/content/v1/63dfcc1008a4c45e5ccba155/88e8b204-10a2-47f4-ae35-b0d87ee4206a/AdobeStock_53167966.jpeg", services: ["Postpartum"] },
      { name: "Beautiful Bump Doula Services", credential: "Postpartum Doula", practice: "Beautiful Bump Doula Services", url: "https://theupcenter.org/programs/doula-services", description: "Extra support for expectant parents enrolled in Parents as Teachers Our Doula Services provide physical, emotional, and educational support during pregnancy, labor, and postpartum.", services: ["Postpartum", "Prenatal Care", "Evidence-Based Care"], acceptsMedicaid: true },
      { name: "Loving Births Doula by Devan", credential: "Birth Doula", practice: "Loving Births Doula by Devan", url: "https://www.lovingbirthsdoulabydevan.com/?utm_source=google&utm_medium=wix_google_business_profile&utm_campaign=11956095999040874463", description: "Connect it to your Wix website in just a few easy steps: 1." },
      { name: "All Nations Doula", credential: "Birth Doula", practice: "All Nations Doula", url: "http://allnationsdoula.com", description: "Serving Norfolk, Virginia Beach, Chesapeake, Portsmouth, Suffolk.", photo: "http://allnationsdoula.com/wordpress/wp-content/uploads/2018/02/Casey-Medrano-Doula.jpg" },
      { name: "En Route Doulas", credential: "Postpartum Doula", practice: "En Route Doulas", url: "http://www.enroutedoulas.com", description: "EN ROUTE DOULAS Welcome to En Route Doulas where the evolving needs of parents and their children are our area of expertise.", photo: "https://images.squarespace-cdn.com/content/v1/6502f3d9a892f85e9cf17f4a/3da4fcbf-4dd0-4f8c-a08a-71c50ad638f9/Stocksy_txpea251265m2l300_Medium_873898.jpg", services: ["Postpartum"] },
      { name: "Restoring Wellness Doula", credential: "Postpartum Doula", practice: "Restoring Wellness Doula", url: "https://www.restoringwellnessdoula.com", description: "Maternity Leave In Effect In Person Birth Support Resumes.", photo: "https://static.wixstatic.com/media/630453_3a4153de438f4fde89659c1ab7bec975~mv2.jpg/v1/fill/w_1905,h_521,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/630453_3a4153de438f4fde89659c1ab7bec975~mv2.jpg", services: ["Postpartum", "Prenatal Care", "Home Birth", "Evidence-Based Care"], acceptsMedicaid: true },
      { name: "Queendomdoulacare", credential: "Birth Doula", practice: "Queendomdoulacare", url: "https://www.honeybook.com/widget/a_sacred_spacefor_queens_196077/cf_id/61488f6647bc4f00343a2c0e", description: "Select an option How did you hear about us." },
      { name: "Womb & Moon Doula Care", credential: "Birth Doula, Lactation Support", practice: "Womb & Moon Doula Care", url: "https://www.wombroom.mom/packages", description: "Virtual Birth Doula $1,1951,195$ Receive Support from your Doula through email, video, text.", photo: "https://static.wixstatic.com/media/942a90_e30789f27b5e4c5a9bae387a3534e6cd~mv2.jpg/v1/fit/w_NaN,h_NaN,lg_1,q_80,usm_0.66_1.00_0.01,blur_3,enc_auto/942a90_e30789f27b5e4c5a9bae387a3534e6cd~mv2.jpg", services: ["Birth Doula", "Postpartum", "Lactation", "Placenta Encapsulation", "Childbirth Education"] },
      { name: "Christina Rutledge IBCLC, Doula - A Mother's Journey, LLC", credential: "Birth Doula, Lactation Support", practice: "Christina Rutledge IBCLC, Doula - A Mother's Journey, LLC", url: "http://www.amothersjourneyllc.com", description: "The Help You Deserve providing love and support from pregnancy to postpartum and everything in between Client Portal Request appointment Offers Telehealth Appointments Accepts Online Payments Accepts Insurance Accepting New Clients.", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Childbirth Education"] },
      { name: "Doulas of Northern Virginia", credential: "Postpartum Doula", practice: "Doulas of Northern Virginia", url: "http://www.doulasofnorthernva.com", description: "com mailto:info@doulasofnorthernva.", photo: "https://www.doulasofnorthernva.com/wp-content/uploads/2022/02/LizMaternity135-1.jpg", services: ["Postpartum", "Prenatal Care"] },
      { name: "Hampton Roads Midwifery", credential: "LM", practice: "Hampton Roads Midwifery", url: "http://www.hrmidwife.com", description: "Happy Customers Feature image You can use this feature section to showcase your happy customers those use your business services.", photo: "http://hrmidwife.com/wp-content/uploads/2017/03/DSC_9755.jpg", services: ["Postpartum", "Placenta Encapsulation", "VBAC Support"], isMidwife: true },
      { name: "Sunflower Babies Midwifery", credential: "CPM", practice: "Sunflower Babies Midwifery", url: "https://sunflowerbabiesmidwifery.com", description: "blob: blob: I always knew that I had choices in my pregnancy.", photo: "https://sunflowerbabiesmidwifery.com/_assets/media/aa3ae68c326244d012502cedbb49ef10.jpg", services: ["Postpartum"], isMidwife: true },
      { name: "Seven Cities Midwifery Care, LLC", credential: "CPM", practice: "Seven Cities Midwifery Care, LLC", url: "http://www.sevencitiesmidwifery.com", description: "Logo with abstract design and SCMC est.", photo: "https://images.squarespace-cdn.com/content/v1/6377b78aa3d5bf1f3fd5f460/7e3ca4df-44ae-4280-80e3-c48378f5630c/Veronica-2934+%281%29.jpg", services: ["Postpartum", "Breastfeeding Support", "Prenatal Care", "Home Birth"], acceptsMedicaid: true, isMidwife: true },
      { name: "The Village Midwife Birth Center", credential: "CPM", practice: "The Village Midwife Birth Center", url: "https://www.thevillagemidwife.com", description: "You shouldn’t have to conform to someone else’s expectations to be taken seriously in pregnancy.", photo: "https://images.squarespace-cdn.com/content/v1/6914d73b6bb72f3b99693f92/5f600f66-c79f-499f-89df-9b78fa89a2d1/TVM+Baby+Scale+2+Lights+On+Small.jpeg", services: ["Postpartum", "VBAC Support", "Home Birth", "Evidence-Based Care"], isMidwife: true },
      { name: "Sentara Midwifery Specialists", credential: "LM, CPM", practice: "Sentara Midwifery Specialists", url: "https://www.sentara.com/hospitalslocations/sentara-midwifery-specialists/locations/sentara-midwifery-specialists-hampton", description: "Professional doula serving families in the area.", isMidwife: true },
      { name: "Midwifery Center At De Paul", credential: "CNM", practice: "Midwifery Center At De Paul", url: "https://womancarecenters.com/womancare-midwifery", description: "Professional doula serving families in the area.", photo: "https://womancarecenters.com/wp-content/uploads/2019/02/womanscare_CNMs_flowers-1000x1000.jpg", isMidwife: true },
      { name: "Genesis Midwifery Services", credential: "CNM", practice: "Genesis Midwifery Services", url: "http://www.genesisforbirth.com", description: "The same midwife every visit, every question, every push.", photo: "https://images.squarespace-cdn.com/content/v1/62d2f709c95a125ca4b75147/10a58b31-4586-4073-b835-059a7c25d3fb/DSC00254-2.jpg", services: ["Postpartum", "Breastfeeding Support", "Home Birth"], acceptsMedicaid: true, isMidwife: true },
],
    medicaidNote: "Yes \u2014 Virginia Medicaid covers doula services effective January 1, 2024. Families enrolled in VA Medicaid can access doula support through their managed care plan. Reimbursement rates and doula enrollment requirements are managed through the Virginia Department of Medical Assistance Services. Ask your doula upfront whether they accept Virginia Medicaid.",
    insuranceNote: "In Norfolk, many families have Tricare (military coverage through the nearby naval base) or employer-sponsored insurance through Sentara. Doula coverage by private insurers is expanding \u2014 some policies now include doula benefits. Check your specific plan documents. HSA and FSA funds can also help cover out-of-pocket doula costs.",
    faqs: [
      { q: "How much does a doula cost in Norfolk?", a: "Expect to pay $1,200 to $2,500 for a doula in Norfolk. Hampton Roads rates are generally lower than Northern Virginia or Richmond. The investment typically covers prenatal visits, labor support, and postpartum check-ins. <a href=\\\"/birth-plan-template/\\\">Download the free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Norfolk?", a: "Yes \u2014 Virginia Medicaid covers doula services effective January 1, 2024. Families enrolled in VA Medicaid can access doula support through their managed care plan. This is real coverage, not a pilot \u2014 ask your doula upfront whether they accept Virginia Medicaid. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> and make sure your doula team knows your preferences." },
      { q: "Which hospitals in Norfolk accommodate birth plans?", a: "Sentara Norfolk General Hospital, connected to the EVMS teaching program, accommodates birth plans and works closely with CHKD for any neonatal needs. Doulas are generally welcome \u2014 confirm current visitor policies during your hospital tour. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Norfolk?", a: "No \u2014 there are no verified freestanding birth centers in Norfolk as of 2026. Families seeking a birth center experience can explore options in the Richmond area or consider midwifery-model care at Sentara Norfolk General. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> to think through your options." },
      { q: "Does True Joy Birthing work with Norfolk families?", a: "True Joy Birthing provides free birth-prep tools for Norfolk families. The free birth plan, checklist, and guided walkthrough in the app work for any Norfolk birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What about postpartum support in Norfolk?", a: "Norfolk has hospital-based lactation support at Sentara and CHKD. The postpartum doula community in Hampton Roads is growing. Start your search during pregnancy if you want ongoing postpartum support. <a href=\\\"/postpartum-doula/\\\">Learn more about postpartum doula support</a>." },
    ],
    nearbyCities: ["chesapeake-va", "virginia-beach-va", "newport-news-va", "hampton-va"],
    publishedDate: "2026-06-08",
    lat: 36.8945,
    lng: -76.259,
  },
  "fremont-ca": {
    city: "Fremont",
    state: "CA",
    slug: "fremont-ca",
    heroImage: "/images/fremont-ca-birth-doula-skyline.webp",
    enableBlogResources: true,
    supportSceneAlt: "A doula walking alongside an expectant mom near Lake Elizabeth in Fremont, California",
    supportSceneImage: "/images/fremont-support-scene.webp",
    midwifeInfo: {
      paragraph: "California licenses Licensed Midwives (LMs) and Certified Nurse-Midwives (CNMs), with LMs attending home births and CNMs practicing in hospitals. California\u2019s Medi-Cal program covers doula services through the PAVE program, reimbursing around $1,587 per pregnancy. Fremont\u2019s East Bay location gives families access to both hospital-based midwifery at Washington Hospital and home birth midwives serving the wider Bay Area.",
      credentialTypes: " (LMs and CNMs)",
      credentialDetail: "California\u2019s Licensed Midwife (LM) credential is one of the most established in the country, with clear regulations for out-of-hospital birth, meaning",
    },
    costLow: 1500,
    costHigh: 3000,
    shelbiServesHere: false,
    culture: "Fremont is a diverse, family-oriented city in the East Bay where the birth community reflects the area\u2019s tech-driven population and strong immigrant communities. Washington Hospital provides the only hospital-based maternity care in town, and many families also look into birth options in nearby Palo Alto, San Jose, and Oakland. The doula community here pulls from both the South Bay and East Bay networks, giving Fremont families more options than the city size suggests.",
    heroLocalDetail: "At 38 weeks in Fremont, you\u2019re probably planning the drive to Washington Hospital on Mowry Avenue near I-880 \u2014 that interchange can back up significantly during commute hours. If you\u2019re heading to Stanford or El Camino for a higher-level NICU, the drive down 237 or over the Dumbarton Bridge adds 30\u201345 minutes depending on traffic. Central Park and Lake Elizabeth offer flat walking paths for those final-weeks strolls.",
    hospitalDetails: [
      { name: "Washington Hospital", paragraph: "Washington Hospital in Fremont is a community hospital with a full maternity unit featuring a Special Care Nursery for babies who need extra support. Labor and delivery has 24/7 OB hospitalist coverage \u2014 meaning a doctor is in-house at all times. Doulas are welcome, and the unit\u2019s midsize feel (around 2,000 births per year) means more personalized attention than the huge Stanford or UCSF units. If you\u2019re delivering here, having your birth plan ready makes everything smoother. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> to get started." },
      { name: "El Camino Health \u2014 Mountain View", thumbnail: "/images/el-camino-hospital.webp", paragraph: "El Camino Health in Mountain View, about 15 minutes south of Fremont, is a popular choice for East Bay families wanting a dedicated birth center with a Level III NICU and one of the region\u2019s highest-rated maternity programs. If you want the reassurance of a higher NICU level and don\u2019t mind the short drive, El Camino is worth registering at." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for Fremont CA.
    // Google Maps search "birth center Fremont CA" found no verified freestanding birth centers in Fremont.
    // Nearest birth centers are in Palo Alto and Oakland. Verified 2026-06-08.
    birthCenterDetails: [
    ],
    localDoulas: [
      { name: "Soul Sisters Doula Training", credential: "Birth Doula", practice: "Soul Sisters Doula Training", url: "https://www.doulapaolareis.com", description: "I'm the Doula I have walked alongside 80+ families, offering guidance, care, and heart-centered support.", services: ["Birth Doula", "Postpartum", "Breastfeeding Support", "Placenta Encapsulation", "Evidence-Based Care"] },
      { name: "BORN Doulas", credential: "Birth Doula, Lactation Support", practice: "BORN Doulas", url: "https://borndoulas.com", description: "Once in keyboard drag state, use the arrow keys to move the marker.", photo: "https://s3-media0.fl.yelpcdn.com/bphoto/Btt5cT5Ykq3RMMbDX1XOTw/ls.jpg", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Placenta Encapsulation"], acceptsMedicaid: true },
      { name: "Hollyn Doula Services", credential: "Postpartum Doula", practice: "Hollyn Doula Services", url: "http://hollyndoulaservices.com", description: "Birth&PostpartumJourney Comprehensive Guidance for Your With a dedication to nurturing families with expert birth and postpartum doula care, the mission here is simple: to create a supportive and informed experience for every family.", photo: "https://hollyndoulaservices.com/_assets/media/1cd215e026688bcc00045d52ef93217a.jpg", services: ["Postpartum"] },
      { name: "Birth&Postpartum Doula service by Bay Golden Doula", credential: "Birth Doula, Lactation Support", practice: "Birth&Postpartum Doula service by Bay Golden Doula", url: "https://www.baygoldendoula.com", description: "About Bay Golden Doula Bay Golden Doula is dedicated to providing a safe and supportive space for individuals and families as they navigate the transformative journey of childbirth and early parenthood.", photo: "https://static.wixstatic.com/media/a9bcc2_630e15b620044e25ae0366618fe9f997~mv2.png/v1/fill/w_207,h_207,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/dccdabe89b7e49979634cecdf4d56877.png", services: ["Birth Doula", "Postpartum", "Lactation", "Evidence-Based Care"] },
      { name: "Postpartum Night Doula, Lactation, Infant Sleep", credential: "Postpartum Doula", practice: "Postpartum Night Doula, Lactation, Infant Sleep", url: "https://www.doulababyservices.com/?utm_source=google&utm_medium=wix_google_business_profile&utm_campaign=10469208935520663533", description: "Doula Baby Services: Supporting Your Parenting Journey Postpartum Doula Karina Plotek of DoulaBabyServices brings her warmth and expertise to the field of Postpartum Support, Newborn Care, Lactation Education & Pediatric Sleep Consulting.", photo: "https://static.wixstatic.com/media/b8ad51_902128a025114677a2f20611335d371d~mv2.jpg/v1/fill/w_668,h_439,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Mother%2520with%2520her%2520Child_edited.jpg", services: ["Postpartum", "Lactation"] },
      { name: "Harmony Doula Group", credential: "Birth Doula, Lactation Support", practice: "Harmony Doula Group", url: "https://harmonydoula.com", description: "Childbirth and Lactation Education Calm.", photo: "https://harmonydoula.com/JQuery/imageJQR-1.jpg", services: ["Birth Doula", "Postpartum", "Lactation", "Placenta Encapsulation", "Childbirth Education"] },
      { name: "Postpartum Doula Services by Tamra", credential: "Birth Doula, Lactation Support", practice: "Postpartum Doula Services by Tamra", url: "http://doulatamra.com", description: "jpg 9A8E282C-DCE1-4747-B5AD-7F74EB90A158.", photo: "https://images.squarespace-cdn.com/content/v1/5c6a0507d86cc95a5ae670e4/1550552173281-A9TIN9IW6NQE1Q4MGALK/IMG_1662.jpg", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Overnight Care"], acceptsMedicaid: true },
      { name: "Redwood Doulas", credential: "Birth Doula", practice: "Redwood Doulas", url: "https://redwooddoulas.com", description: "Congratulations on this exciting time in your life.", photo: "https://redwooddoulas.com/wp-content/uploads/2021/12/birth-postpartum-doulas.jpg", services: ["Birth Doula", "Postpartum", "Breastfeeding Support", "Placenta Encapsulation", "Evidence-Based Care"] },
      { name: "DOULAS by the BAY LLC", credential: "Birth Doula, Lactation Support", practice: "DOULAS by the BAY LLC", url: "https://www.doulasbythebay.com/discovery", description: "Evidence-Based Birth & Postpartum Doula Care in California Trusted since 2009 • 70+ employed doulas • 3,000+ families supported.", photo: "https://www.doulasbythebay.com/wp-content/uploads/2026/05/Kaiser-2.png", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Overnight Care"], acceptsMedicaid: true },
      { name: "Quetzal Doula", credential: "Birth Doula", practice: "Quetzal Doula", url: "https://www.quetzaldoula.com", description: "cropped-quetzal-logo-e1496453396220.", photo: "https://quetzaldoula.com/wp-content/uploads/2017/02/rio-guacimal.jpg", services: ["Birth Doula", "Postpartum"] },
      { name: "Stephanie Mollinier | Birth Doula", credential: "Birth Doula", practice: "Stephanie Mollinier | Birth Doula", url: "http://www.stephaniedoula.com", description: "jpg Birth Doula + Pregnancy Coaching for GROWING families in San Jose, CA Find the right doula support for you.", photo: "https://images.squarespace-cdn.com/content/v1/5b3eee9d2714e53cdf0ddea8/0bab41b0-f533-4e41-9e94-bf41deeece66/StephanieHeadshotSession5557-Edit.jpg", services: ["Birth Doula"] },
      { name: "Bay City Doulas", credential: "Postpartum Doula", practice: "Bay City Doulas", url: "https://baycitydoulas.com", description: "Bay Area Postpartum Doulas BOOK A DISCOVERY CALL.", photo: "https://baycitydoulas.com/wp-content/uploads/2021/10/Welcome-Bay-city.png", services: ["Postpartum", "Breastfeeding Support", "Overnight Care"] },
      { name: "Lauren Noble, Doula", credential: "Birth Doula", practice: "Lauren Noble, Doula", url: "http://nobledoula.com", description: "Thanks so much for coming I’m no longer taking doula clients.", photo: "https://images.squarespace-cdn.com/content/v1/55d5524ee4b03efa6b0a7cb8/2e25a290-ee20-4b9e-9793-737b8faca318/Violet+%26+Charlotte.JPEG", services: ["Birth Doula", "Postpartum", "Placenta Encapsulation", "Childbirth Education", "Prenatal Care"] },
      // Removed 2026-06-09: Doula Studios is a hardware product development company, not a doula practice.
      { name: "Bay Area Night Doulas Collective", credential: "Postpartum Doula", practice: "Bay Area Night Doulas Collective", url: "https://bayareanightdoulas.com", description: "San Francisco Bay Area Postpartum Doulas Rest & Recover Say goodbye to sleepless nights Rest, recover, and bond with your new baby while our doulas take care of the rest.", photo: "https://bayareanightdoulas.com/wp-content/uploads/2023/03/yelp-logo.png", services: ["Postpartum", "Lactation", "Breastfeeding Support", "Overnight Care"] },
      { name: "Plumeria Doula Care", credential: "Birth Doula", practice: "Plumeria Doula Care", url: "https://plumeriadoula.com", description: "Serving the San Francisco Bay Area ABOUT.", photo: "https://plumeriadoula.com/wp-content/uploads/2023/11/Leticia-Plumeria-Newborn-Care-min.png", services: ["Birth Doula", "Postpartum", "Breastfeeding Support"] },
      { name: "Baby Bliss Doula", credential: "Birth Doula", practice: "Baby Bliss Doula", url: "https://www.babybliss-doula.com", description: "Empowering New Families, Nurturing Newborns Mother lovingly holding her newborn, with postpartum support services to help new parents with early childhood care and nurturing.", photo: "https://images.squarespace-cdn.com/content/v1/65e96dd299ef13182a34bd37/fbf2edd7-ca61-4c00-9d2d-a711753f2532/PostpartumDoula.jpg", services: ["Birth Doula", "Postpartum", "Breastfeeding Support", "Evidence-Based Care"] },
      { name: "Do Well Doula", credential: "Birth Doula", practice: "Do Well Doula", url: "http://www.dowelldoula.com", description: "CHILDBIRTH EDUCATION PREPARE As a former teacher, I'm big on empowering you with education.", photo: "https://static.wixstatic.com/media/13a2c5_8fa6f3822adc4684a08b0c3ff33180c2~mv2.jpg/v1/fill/w_374,h_374,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_3296_edited.jpg", services: ["Birth Doula", "Postpartum", "Breastfeeding Support", "Childbirth Education", "Overnight Care"] },
      { name: "East Bay Postpartum Doula Circle", credential: "Birth Doula, Lactation Support", practice: "East Bay Postpartum Doula Circle", url: "https://www.eastbaypostpartum.com", description: "Your Fourth Trimester, Covered A guild of 30+ certified doulas providing daytime, nighttime, and live-in postpartum care to Bay Area families.", photo: "https://eastbaypostpartum.com/images/doulas/denise-macko.jpg", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Overnight Care"], acceptsMedicaid: true },
      { name: "Golden Gate Doula Associates", credential: "Birth Doula, Lactation Support", practice: "Golden Gate Doula Associates", url: "http://www.goldengatedoula.com", description: "meet Jennifer VIEW OUR doula SERVICES The Golden Gate Doula Associates was founded in 2016 by Jennifer Darwin and has quickly become a trusted resource for all your maternity and postpartum needs.", photo: "https://static.showit.co/400/oHWMuB6lQLuiM5O9wnczhg/shared/best_doula_2022.png", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Prenatal Care"] },
      { name: "Mama Bear Birth Services: Pre/Postnatal Pilates, Doula Support & Childbirth Education", credential: "Postpartum Doula", practice: "Mama Bear Birth Services: Pre/Postnatal Pilates, Doula Support & Childbirth Education", url: "https://sites.google.com/view/sfbirthservices/home", description: "Copy heading link Mama Bear Birth Services.", services: ["Postpartum", "Childbirth Education", "Prenatal Care"] },
      { name: "The Dream Doula", credential: "Birth Doula", practice: "The Dream Doula", url: "http://thedreamdoula.me", description: "The support you and your family need to feel confident and reassured.", photo: "https://static.wixstatic.com/media/3024e3_4a8837886f3e4692963fe8dc7d0a57b5~mv2.jpg/v1/fill/w_615,h_737,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3024e3_4a8837886f3e4692963fe8dc7d0a57b5~mv2.jpg", services: ["Birth Doula", "Postpartum", "Breastfeeding Support"] },
      { name: "Sacred Lotus Doula Services", credential: "Birth Doula, Lactation Support", practice: "Sacred Lotus Doula Services", url: "https://www.yelp.com/biz/sacred-lotus-doula-services-dublin", description: "Photos & videos See all 20 photos Sacred Lotus Doula Services - I am certified through Stillbirthday as a birth and bereavement doula.", photo: "https://s3-media0.fl.yelpcdn.com/bphoto/YDWG6jhA9ZN-EW2sL4spBw/l.jpg", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Placenta Encapsulation"], acceptsMedicaid: true },
      { name: "Modesto Birth & Beyond Doula Team - Made for Birth & Beyond Education", credential: "Birth Doula, Lactation Support", practice: "Modesto Birth & Beyond Doula Team - Made for Birth & Beyond Education", url: "https://www.modestobirthandbeyond.com", description: "MBB partners with Kaiser & HealthNet, offering 100% coverage for Education & Birth Plan Counseling, with or without birth doula or lactation support.", photo: "https://images.squarespace-cdn.com/content/v1/5d912c67bcf2f2691dc523de/1578258023513-HWHHZHD6OS4T1441W0Q6/IMG_8398.jpeg", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Placenta Encapsulation"], acceptsMedicaid: true },
      { name: "San Mateo Doula", credential: "Postpartum Doula", practice: "San Mateo Doula", url: "https://sanmateodoula.com", description: "At San Mateo Doula With over 20 years of experience serving families in San Mateo County and the greater Bay Area, we provide expert, nurturing support at every stage of your birth and postpartum journey.", photo: "https://sanmateodoula.com/wp-content/uploads/2025/01/464293214_8493287680791970_1990419347808526617_n.jpg", services: ["Postpartum", "Breastfeeding Support", "Overnight Care"] },
      { name: "Postpartum Doula & Parent Coach", credential: "Postpartum Doula", practice: "Postpartum Doula & Parent Coach", url: "https://www.doulababyservices.com", description: "Doula Baby Services: Supporting Your Parenting Journey Postpartum Doula Karina Plotek of DoulaBabyServices brings her warmth and expertise to the field of Postpartum Support, Newborn Care, Lactation Education & Pediatric Sleep Consulting.", photo: "https://static.wixstatic.com/media/b8ad51_902128a025114677a2f20611335d371d~mv2.jpg/v1/fill/w_668,h_439,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Mother%2520with%2520her%2520Child_edited.jpg", services: ["Postpartum", "Lactation"] },
      { name: "Andrea Berkey; Three Phases Doula", credential: "Postpartum Doula", practice: "Andrea Berkey; Three Phases Doula", url: "http://www.threephasesdoula.com", description: "The whisperer of babies, your extra set of hands, and your resource center.", photo: "https://static.wixstatic.com/media/bf3444_d10d21d930b042c18bf5d7fa353c8b98.jpg/v1/crop/x_0,y_318,w_5760,h_3411/fill/w_979,h_805,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bf3444_d10d21d930b042c18bf5d7fa353c8b98.jpg", services: ["Postpartum", "Lactation", "Breastfeeding Support"] },
      { name: "Haven Baby Doula", credential: "Birth Doula, Lactation Support", practice: "Haven Baby Doula", url: "https://www.havenbabydoula.com", description: "Welcome, I'm Ruth Nuñez a birth and postpartum Doula from Palo Alto, CA.", photo: "https://cdn.prod.website-files.com/63ee95d877371e4e98b743f6/6409224a5b28263290578089_websittehold.jpg", services: ["Birth Doula", "Postpartum", "Lactation", "Home Birth", "Evidence-Based Care"] },
      { name: "Nebula Doulas", credential: "Postpartum Doula", practice: "Nebula Doulas", url: "https://www.nebuladoulaservices.com", description: "Who We Are At Nebula, we specialize in Postpartum and Newborn Care.", photo: "https://static.wixstatic.com/media/01c3aff52f2a4dffa526d7a9843d46ea.png/v1/fill/w_25,h_25,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/01c3aff52f2a4dffa526d7a9843d46ea.png", services: ["Postpartum"] },
      { name: "Trinity Night Doulas", credential: "Birth Doula", practice: "Trinity Night Doulas", url: "http://trinitynightdoulas.com", description: "Professional doula serving families in the area." },
      { name: "Bay Area Doula Training", credential: "Birth Doula, Lactation Support", practice: "Bay Area Doula Training", url: "https://bayareadoula.com/bay-area-doula-training", description: "Bay Area Doula Training Community-driven, evidence-based, trauma-informed, and coaching-oriented—delivering intentional, strategic birth support.", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Childbirth Education"], acceptsMedicaid: true },
      { name: "Marcy Hogan Postpartum Doula", credential: "Postpartum Doula", practice: "Marcy Hogan Postpartum Doula", url: "https://www.marcythedoula.com", description: "Postpartum Doula Soothing babies & empowering parents in the SF Bay Area Book a Free Consult Services & Rates A sleeping baby lying on a person's chest, gripping the person's finger, in a hospital setting, in black and white.", photo: "https://images.squarespace-cdn.com/content/v1/69d2c8eaa4854e48eb6c210e/3d19354e-34f6-4226-8b32-09cd760f66d5/2011+01+16-63.jpg", services: ["Postpartum"] },
      { name: "Pamela Lopes Doula", credential: "Birth Doula", practice: "Pamela Lopes Doula", url: "http://www.pamelalopesdoula.com", description: "Connect it to your Wix website in just a few easy steps: 1." },
      { name: "Amelia Protiva, Birth Doula & Photographer", credential: "Postpartum Doula", practice: "Amelia Protiva, Birth Doula & Photographer", url: "http://ameliaprotiva.com", description: "Doula care rooted in rural Missouri.", photo: "https://images.squarespace-cdn.com/content/v1/691217c649987466a21cc93a/9d3811ec-de57-4091-b3e6-79a27adbb41a/Birth+Becomes+Her%E2%80%93Lukas_0011.jpg", services: ["Postpartum"] },
],
    medicaidNote: "Yes \u2014 California\u2019s Medi-Cal program covers doula services as a state benefit, with reimbursement rates around $1,587 per pregnancy. Families on Medi-Cal can access doula support through the PAVE (Providing Access and doula Viability through Equity) program. Ask your doula whether they are a PAVE-enrolled Medi-Cal provider.",
    insuranceNote: "In Fremont, many families have employer-sponsored insurance through Bay Area tech companies. Doula coverage by private insurers is expanding \u2014 check your specific plan for \u2018doula services\u2019 or \u2018certified doula\u2019 benefits. HSA and FSA funds can help cover out-of-pocket doula costs. Some East Bay doulas offer sliding-scale pricing for families without doula benefits.",
    faqs: [
      { q: "How much does a doula cost in Fremont?", a: "Expect to pay $1,500 to $3,000 for a doula in Fremont. East Bay rates are typically lower than San Francisco but higher than the Central Valley. The investment typically covers prenatal visits, labor support, and postpartum check-ins. <a href=\\\"/birth-plan-template/\\\">Download the free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medi-Cal cover doulas in Fremont?", a: "Yes \u2014 California\u2019s Medi-Cal program covers doula services, reimbursing around $1,587 per pregnancy. Doulas enroll through the PAVE program. This is a well-established benefit, not a pilot \u2014 ask your doula upfront whether they accept Medi-Cal. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> and make sure your doula team knows your preferences." },
      { q: "Which hospitals in Fremont accommodate birth plans?", a: "Washington Hospital in Fremont accommodates birth plans and has 24/7 OB hospitalist coverage. For higher NICU level support, El Camino Health in Mountain View (about 15 minutes south) has a Level III NICU and is a popular choice for Fremont families. Doulas are welcomed at both. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Fremont?", a: "No \u2014 there are no verified freestanding birth centers in Fremont as of 2026. The nearest birth center options are in Palo Alto and Oakland. For hospital-based care, many Fremont families choose between Washington Hospital and El Camino Health in Mountain View. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> to think through your options." },
      { q: "Does True Joy Birthing work with Fremont families?", a: "True Joy Birthing provides free birth-prep tools for Fremont families. The free birth plan, checklist, and guided walkthrough in the app work for any Fremont birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What about postpartum support in Fremont?", a: "Fremont has hospital-based lactation support at Washington Hospital and several local pediatric practices. The East Bay postpartum doula community is strong. Start your search during pregnancy if you want ongoing postpartum support. <a href=\\\"/postpartum-doula/\\\">Learn more about postpartum doula support</a>." },
    ],
    nearbyCities: ["san-jose-ca", "oakland-ca", "hayward-ca", "pleasanton-ca"],
    publishedDate: "2026-06-08",
    lat: 37.5256,
    lng: -121.987,
  },
  "vancouver-wa": {
    city: "Vancouver",
    state: "WA",
    slug: "vancouver-wa",
    heroImage: "/images/vancouver-wa-birth-doula-skyline.webp",
    enableBlogResources: true,
    supportSceneAlt: "A doula walking alongside an expectant mom on the Vancouver Waterfront with Mount Hood in the distance",
    supportSceneImage: "/images/vancouver-support-scene.webp",
    midwifeInfo: {
      paragraph: "Washington licenses both Licensed Midwives (LMs / LDM) and Certified Nurse-Midwives (CNMs), with a well-established regulatory framework for out-of-hospital birth. Washington\u2019s Apple Health (Medicaid) program was an early adopter of doula coverage and has one of the most mature reimbursement programs in the country. Vancouver families benefit from this infrastructure, with many local doulas enrolled as Apple Health providers.",
      credentialTypes: " (LMs and CNMs)",
      credentialDetail: "Washington\u2019s Licensed Midwife (LM) credential is one of the oldest and most respected in the U.S., with clear regulations for home birth and birth center practice, giving",
    },
    costLow: 1200,
    costHigh: 2800,
    shelbiServesHere: false,
    culture: "Vancouver is a border city with a unique birth landscape \u2014 families on the Washington side of the Columbia River have Apple Health (Medicaid) doula coverage, while their Oregon neighbors across the river do not. PeaceHealth Southwest is the busiest OB unit north of San Francisco on the West Coast, and Legacy Salmon Creek adds another option for Vancouver families. The birth community here is growing fast as more Portland-area families move north for lower housing costs.",
    heroLocalDetail: "At 38 weeks in Vancouver, you\u2019re probably thinking about which hospital to aim for \u2014 PeaceHealth Southwest off 87th Avenue near Highway 500, or Legacy Salmon Creek off I-205 near 134th Street. The I-5 and I-205 bridge traffic into Portland is notorious, but the good news is both Vancouver hospitals are north of the river, so you don\u2019t need to cross into Oregon during labor. Salmon Creek and Felida areas are the most common family neighborhoods.",
    hospitalDetails: [
      { name: "PeaceHealth Southwest Medical Center", thumbnail: "/images/peacehealth-southwest.webp", paragraph: "PeaceHealth Southwest Medical Center is a 450-bed community hospital with the Holtzman Twins Neonatal Intensive Care Unit and the second-busiest obstetrics unit in the Portland metropolitan area. With around 3,000 births per year, the Family Birth Center handles a high volume and is used to working with doulas. Doulas are generally welcome \u2014 confirm current policies during your hospital tour. If you\u2019re delivering at PeaceHealth, having your birth plan ready makes everything smoother. <a href=\\\"/birth-plan-template/\\\">Use our free hospital birth plan template</a> to get started." },
      { name: "Legacy Salmon Creek Medical Center", paragraph: "Legacy Salmon Creek Medical Center, also in Vancouver, opened in 2005 and offers a birthing center with a neonatal intensive care unit and a dedicated children\u2019s-only emergency room. Families on the north side of Vancouver often find Legacy Salmon Creek more convenient, especially those living near I-205. Doulas are welcome, and the facility has a more modern feel than PeaceHealth\u2019s older campus." },
    ],
    // Birth center search: NPI taxonomy 261QB0400X returned zero results for Vancouver WA.
    // Google Maps search "birth center Vancouver WA" found no verified freestanding birth centers in Vancouver.
    // Nearest freestanding birth centers are in the Portland metro (Oregon side). Verified 2026-06-08.
    birthCenterDetails: [
      { name: "The Bridge Birth Center", credential: "Freestanding Birth Center", address: "3300 NE 54th St, Vancouver, WA 98663", url: "http://www.bridgebirth.com", paragraph: "A freestanding birth center in Vancouver offering personalized midwifery care in a home-like setting. Serves families seeking out-of-hospital birth with licensed midwives." },
    ],
    localDoulas: [
      { name: "Suwannee Doula and Infant Care", credential: "Postpartum Doula", practice: "Suwannee Doula and Infant Care", url: "http://suwanneedoulacare.com", description: "Suwannee Doula Care Supporting families with expert care and", photo: "https://img1.wsimg.com/isteam/ip/850a11fe-671e-4c7f-8194-598ca4291beb/blob-3055cb9.png", services: ["Postpartum", "Breastfeeding Support", "Overnight Care"] },
      { name: "EnCourage Doula Care LLC", credential: "Birth Doula", practice: "EnCourage Doula Care LLC", url: "https://www.encouragedoulacare.com", description: "Bereavement Contact Jennifer mailto:Jennifer@encouragedoulacare.", photo: "https://static.wixstatic.com/media/692a5c_3a7fd8756b55414bbff5b3e0758243b0~mv2.jpg/v1/fill/w_189,h_216,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/headshot%202024.jpg", services: ["Birth Doula", "Postpartum", "Breastfeeding Support", "Childbirth Education", "Prenatal Care"], costRange: "$2400–$2700", acceptsMedicaid: true },
      { name: "BirthLore- Heather Ward Birth Doula", credential: "Birth Doula", practice: "BirthLore- Heather Ward Birth Doula", url: "http://www.birthlore.com", description: "Heather Ward BD, PD, CCE, CLE Heather@BirthLore.", photo: "https://birthlore.com/wp-content/uploads/2023/06/IMG_1121.jpg", services: ["Breastfeeding Support", "Prenatal Care"] },
      { name: "Birth First Doulas Portland", credential: "Birth Doula", practice: "Birth First Doulas Portland", url: "https://www.birthfirstdoulas.com/?utm_source=GMB&utm_medium=organic&utm_campaign=local", description: "The Birth First Doulas CommunityPortland Doulas & Vancouver Doulas MATCH WITH A DOULA OR EDUCATOR.", photo: "https://birthfirstdoulas.com/wp-content/uploads/2019/10/portland-doula-pregnant-woman.jpg", services: ["Birth Doula", "Postpartum", "Breastfeeding Support", "Placenta Encapsulation", "Overnight Care"], acceptsMedicaid: true },
      { name: "Doulas of Vancouver", credential: "Birth Doula, Lactation Support", practice: "Doulas of Vancouver", url: "http://www.doulasofvancouver.ca", description: "We’ve teamed up with other professionals who further assist our families, through support with additional classes and services, uniquely setting our practice apart for childbearing families in the Greater Vancouver area.", photo: "https://static.wixstatic.com/media/4523ef_fedeead1c1d347398e9a3c34ca150465~mv2.jpg/v1/fill/w_214,h_303,al_c,lg_1,q_80,enc_avif,quality_auto/4523ef_fedeead1c1d347398e9a3c34ca150465~mv2.jpg", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Prenatal Care"] },
      { name: "Rachel J Gathright Doula Birth - Postpartum - Placenta", credential: "Birth Doula", practice: "Rachel J Gathright Doula Birth - Postpartum - Placenta", url: "http://racheljgathright.com", description: "Welcome, I’m so glad you're here My name is Rachel.", photo: "https://images.squarespace-cdn.com/content/v1/61f2f2124d792a3258a2c20f/350a816b-636e-46b5-a39e-c59d4e135a47/RachelYellow.jpg" },
      { name: "Doula Love", credential: "Postpartum Doula", practice: "Doula Love", url: "http://www.portlanddoulalove.com", description: "Full Spectrum Doula Services Supporting Growing Families in the Pacific Northwest since 2013.", photo: "https://images.squarespace-cdn.com/content/v1/5e559cda0db322392272b7a2/2d2eb055-4677-4f77-83fb-fca04a16d5b9/2024+Doula+Love-35.jpg", services: ["Postpartum", "Evidence-Based Care"], acceptsMedicaid: true },
      { name: "Pro Doula Natalie", credential: "Birth Doula", practice: "Pro Doula Natalie", url: "https://doulamatch.net/profile/40654/natalie-budey", description: "Signed up for a childbirth class yet.", photo: "https://doulamatch.net/static/img/profile-doula.png", services: ["Birth Doula", "Postpartum", "Prenatal Care", "Home Birth", "Doula Training"], costRange: "$650–$1100" },
      { name: "Columbia Crossings Doula Services", credential: "Birth Doula", practice: "Columbia Crossings Doula Services", url: "https://www.facebook.com/columbiacrossingsdoulas", description: "Professional doula serving families in the area." },
      { name: "Inna Hudz | Birth Doula | Faith-Based | Russian-Speaking | Vancouver WA | WA State Certified | Medicaid Provider", credential: "Birth Doula", practice: "Inna Hudz | Birth Doula | Faith-Based | Russian-Speaking | Vancouver WA | WA State Certified | Medicaid Provider", url: "https://innahudz.com", description: "inquire TO BOOK YOUR WeddinG Now ih VI V IV III II I INNA HUDZ.", photo: "https://static.showit.co/1600/cyE0_7pCTn6YtYKR9xB1BQ/94074/innahudz_wedding_image.jpg" },
      { name: "DeLightFull Beginnings , DOULA DÈ, De’Junique Brown", credential: "Birth Doula, Lactation Support", practice: "DeLightFull Beginnings , DOULA DÈ, De’Junique Brown", url: "http://doulade.com", description: "0 A smiling Black woman with long braided hair, wearing a light blue button-up shirt, standing against a pink background.", photo: "https://images.squarespace-cdn.com/content/v1/614910a084d6241777888b47/a9a657d6-ef49-4757-95b0-4422410473fe/IMG_3639.jpeg", services: ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Placenta Encapsulation"] },
      { name: "Skye the Doula", credential: "Birth Doula", practice: "Skye the Doula", url: "https://www.linkedin.com/in/skye-stephenson-9a078020a", description: "Professional doula serving families in the area." },
      { name: "Monarch Midwifery", credential: "LM, CPM", practice: "Monarch Midwifery", url: "http://www.monarchmidwifery.com", description: "Serving SW Washington and NW Oregon Monarch-09.", photo: "https://images.squarespace-cdn.com/content/v1/61915587c99cd4398b97b2c7/ca0549de-fa2e-4ee1-8eb9-a7c5020fdb1a/Monarch-09.jpg", services: ["Home Birth"], isMidwife: true },
      { name: "Vancouver Clinic | OBGYN & Midwifery Department", credential: "CNM", practice: "Vancouver Clinic | OBGYN & Midwifery Department", url: "https://tvc.org/services/ob-gyn", description: "Midwifery Certified nurse midwives provide complete prenatal care and monitoring throughout pregnancy and are birth advocates during delivery.", photo: "https://www.tvc.org/wp-content/uploads/Midwifery-1-688x455.jpg", services: ["Postpartum", "Breastfeeding Support", "Prenatal Care", "Water Birth", "Sibling Support"], acceptsMedicaid: true, isMidwife: true },
      { name: "Nest Midwifery", credential: "LM", practice: "Nest Midwifery", url: "http://www.nest-midwifery.com", description: "Trusted Portland Doulas for a Confident and Supported Birth There is no room for fear in birth.", photo: "https://babynestbirth.com/wp-content/uploads/2017/05/babynestbaby_resize-e1520558528463.jpg", services: ["Birth Doula", "Postpartum", "Placenta Encapsulation", "Childbirth Education", "Overnight Care"], acceptsMedicaid: true, isMidwife: true },
      { name: "Hearth and Home Midwifery", credential: "CPM", practice: "Hearth and Home Midwifery", url: "https://hearthandhomemidwifery.com/?utm_source=googlebusinessprofile&utm_medium=organic&utm_campaign=gbpwebsitelink", description: "Both of the midwives are Certified Professional Midwives CPMs through the North American Registry of Midwives NARM , are licensed, and serve the Vancouver, Washington area.", photo: "https://images.squarespace-cdn.com/content/v1/58dc480344024326ef955f75/1564438774962-4F446EJNCAYWKAELTIAX/hh-logo-105.png", services: ["Postpartum", "Prenatal Care", "Home Birth"], isMidwife: true },
],
    medicaidNote: "Yes \u2014 Washington State\u2019s Apple Health (Medicaid) program covers doula services. Washington was an early adopter of Medicaid doula coverage and has one of the more established programs in the country. Families on Apple Health should confirm their doula is a Washington State Medicaid-enrolled provider.",
    insuranceNote: "In Vancouver, many families have employer-sponsored coverage through PeaceHealth, Legacy Health, or tech companies with Portland offices. Doula coverage by private insurers is expanding. Check your plan for doula benefits. HSA and FSA funds can help cover out-of-pocket costs. Some Vancouver doulas serve both sides of the river \u2014 confirm their state-specific credentialing.",
    faqs: [
      { q: "How much does a doula cost in Vancouver?", a: "Expect to pay $1,200 to $2,800 for a doula in Vancouver. Vancouver rates are comparable to Portland pricing. The investment typically covers prenatal visits, labor support, and postpartum check-ins. <a href=\\\"/birth-plan-template/\\\">Download the free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Apple Health cover doulas in Vancouver?", a: "Yes \u2014 Washington\u2019s Apple Health program covers doula services. Washington was an early adopter of Medicaid doula coverage and has one of the most established programs in the nation. Ask your doula upfront whether they are a Washington State Medicaid-enrolled provider. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> and make sure your doula team knows your preferences." },
      { q: "Which hospitals in Vancouver accommodate birth plans?", a: "PeaceHealth Southwest Medical Center and Legacy Salmon Creek Medical Center both accommodate birth plans and are used to working with doulas. PeaceHealth has the Holtzman Twins NICU and is the busiest OB unit north of San Francisco. Legacy Salmon Creek has a modern facility with its own NICU and children\u2019s ER. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers in Vancouver?", a: "No \u2014 there are no verified freestanding birth centers in Vancouver as of 2026. The nearest birth center options are on the Oregon side of the Columbia River in Portland. Both PeaceHealth Southwest and Legacy Salmon Creek offer midwifery-model care within the hospital setting. <a href=\\\"/birth-plan-template/\\\">Grab the free birth plan template</a> to think through your options." },
      { q: "Does True Joy Birthing work with Vancouver families?", a: "True Joy Birthing provides free birth-prep tools for Vancouver families. The free birth plan, checklist, and guided walkthrough in the app work for any Vancouver birth setting. The app also helps you connect with local doulas and midwives in your area." },
      { q: "What about postpartum support in Vancouver?", a: "Vancouver has hospital-based lactation support at both PeaceHealth and Legacy Salmon Creek. The postpartum doula community in the Portland-Vancouver metro is strong. Start your search during pregnancy if you want ongoing postpartum support. <a href=\\\"/postpartum-doula/\\\">Learn more about postpartum doula support</a>." },
    ],
    nearbyCities: ["portland-or", "beaverton-or", "hillsboro-or", "tacoma-wa"],
    publishedDate: "2026-06-08",
    lat: 45.6352,
    lng: -122.5972,
  },
};

export const citySlugs = Object.keys(cities).sort();