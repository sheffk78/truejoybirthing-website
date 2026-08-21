#!/usr/bin/env python3
"""Insert elk-grove-ca city block into cities.ts (sanctioned Python-heredoc method)."""
import re, sys

PATH = "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website/src/data/cities.ts"

block = '''
  "elk-grove-ca": {
    enableBlogResources: true,
    publishedDate: "2026-08-21",
    city: "Elk Grove",
    state: "CA",
    slug: "elk-grove-ca",
    costLow: 1200,
    costHigh: 2800,
    shelbiServesHere: false,
    lat: 38.4085,
    lng: -121.3716,
    heroImage: "/images/elk-grove-ca-birth-doula-hero.webp",
    ogImage: "https://truejoybirthing.com/images/og-city-elk-grove-ca.webp",
    supportSceneImage: "/images/elk-grove-ca-birth-doula-support.webp",
    supportSceneAlt: "A doula supporting an expectant mom in Elk Grove: Sacramento-area birth support and doula care",
    localDoulas: [
      { name: "Shay", credential: "Birth & Postpartum Doula", practice: "Seeds of Love Doula Services", url: "https://www.seedsoflovebaby.com/", photo: "", description: "Shay is a warm birth and postpartum doula serving Elk Grove and the surrounding Sacramento area. Families describe her as outstanding, calm, and a source of steady encouragement during labor and the early newborn weeks. She provides continuous birth support, helps create a stress-free birth environment, and offers backup and overnight postpartum care when a family needs an extra hand.", costRange: "$1,200-$2,500", acceptingClients: true, services: ["Birth Doula", "Postpartum Doula", "Overnight Support"], serviceArea: ["Elk Grove, CA", "Sacramento, CA"] },
      { name: "Faviola (Favy)", credential: "Certified Postpartum Doula", practice: "Blissful Baby Doula", url: "https://www.blissfulbabydoula.com/", photo: "", description: "Faviola is a certified postpartum doula and lactation-support provider in Elk Grove. Families call her dependable, capable, and calming, praising the way she helps them sleep and recover in the first weeks with a newborn. She offers postpartum care, newborn-care education, lactation-friendly meal support, and overnight help, drawing on years of hands-on mother-baby care.", costRange: "$30-$45/hr", acceptingClients: true, services: ["Postpartum Doula", "Lactation Support", "Newborn Care", "Overnight Support"], serviceArea: ["Elk Grove, CA", "Sacramento, CA"] },
      { name: "Elena", credential: "Overnight & Night Doula", practice: "The Doula Flow", url: "", photo: "", description: "Elena provides overnight newborn care and infant-sleep support for Elk Grove and Sacramento families. Parents describe her calm, experienced presence as a lifesaver in the newborn weeks, and several families credit her readings and guidance with getting their babies on a more predictable sleep schedule early. She is available on call and deeply experienced with both first-time and second-time parents.", costRange: "$35-$45/hr", acceptingClients: true, services: ["Postpartum Doula", "Overnight Support", "Infant Sleep Support"], serviceArea: ["Elk Grove, CA", "Sacramento, CA"] },
    ],
    culture: "Elk Grove is one of the fastest-growing and most diverse cities in the Sacramento region, home to large Asian American, Latino, and Filipino communities alongside families drawn to its new neighborhoods, ample parks, and strong schools. Its birth community centers on home-based doula and midwifery care, with most Elke Grove families delivering at the major hospital systems in neighboring Sacramento, including UC Davis Medical Center, Dignity Health Mercy General and Methodist Hospitals, and Kaiser Permanente South Sacramento. California Medi-Cal doula coverage under SB-509 has expanded access to birth support for lower-income Elk Grove families, and the city's proximity to Sacramento's Level III NICUs ensures high-risk newborns receive specialized care within a short drive.",
    heroLocalDetail: "Elk Grove does not have an in-city hospital with labor and delivery services, so most Elke Grove families deliver at one of the major Sacramento hospitals 10-20 minutes north. UC Davis Medical Center near midtown Sacramento offers a Level I trauma center and Level III NICU with a well-established midwifery program. Dignity Health Mercy General Hospital in Sacramento and Methodist Hospital's Family Birth Center both provide comprehensive maternity care with Level III NICU support. Kaiser Permanente South Sacramento Medical Center on Bruceville Road serves Kaiser members with full obstetric care and a neonatal unit. Because Elk Grove sits at the southern edge of the Sacramento metro, most families plan their hospital route, arrival timing, and doula coordination in advance.",
    hospitalDetails: [
      { name: "UC Davis Medical Center", thumbnail: "/images/elk-grove-ca-hospital-ucdavis.webp", address: "2315 Stockton Blvd, Sacramento, CA 95817", nicuLevel: "III", doulaPolicy: "Doulas welcome. UC Davis Health welcomes doulas as part of the birth support team in their labor and delivery unit.", medicaid: true, lactation: true, privateRooms: true, waterBirth: "Hydrotherapy available in select birthing suites", url: "https://health.ucdavis.edu/medical-center/womens-services/", paragraph: "UC Davis Medical Center in Sacramento is the region's academic referral center and offers the highest-level maternity and neonatal care in the Elk Grove area. The labor and delivery unit includes private birthing suites designed for family-centered care, a well-established midwifery program, and on-site lactation consultants. As a Level I trauma center with a Level III NICU, UC Davis is equipped to handle the most complex pregnancies and the smallest newborns, which is why higher-risk Elk Grove deliveries are often referred there. Doulas are welcome in the birthing suites, and the hospital's academic affiliation means families have access to the latest evidence-based care, clinical trials, and maternal-fetal specialists. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Dignity Health Mercy General Hospital", thumbnail: "/images/elk-grove-ca-hospital-mercy-general.webp", address: "4001 J St, Sacramento, CA 95819", nicuLevel: "III", doulaPolicy: "Doulas welcome. Mercy General supports doulas and continuous labor support in its maternity unit.", medicaid: true, lactation: true, privateRooms: true, waterBirth: "Hydrotherapy options available", url: "https://www.dignityhealth.org/sacramento/locations/mercy-general-hospital", paragraph: "Dignity Health Mercy General Hospital in East Sacramento provides comprehensive maternity care with a Level III NICU, making it one of the closest full-service birthing hospitals for Elk Grove families. The family birth center offers private labor and delivery suites, a team of OB hospitalists available around the clock, lactation support, and a strong midwifery presence. Doulas are welcome throughout labor and delivery, and the hospital is recognized for family-centered care and breastfeeding support. Its location on the eastern edge of Sacramento keeps the drive from Elk Grove convenient while still providing the higher-acuity neonatal coverage that babies needing a step up from routine newborn care may require. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Dignity Health Methodist Hospital of Sacramento", thumbnail: "/images/elk-grove-ca-hospital-methodist.webp", address: "7500 Hospital Dr, Sacramento, CA 95823", nicuLevel: "III", doulaPolicy: "Doulas welcome. Methodist Hospital's Family Birth Center welcomes doulas and continuous labor support.", medicaid: true, lactation: true, privateRooms: true, url: "https://www.commonspirit.org/find-a-location/family-birth-center-dignity-health-methodist-hospital-of-sacramento-3677", paragraph: "Dignity Health Methodist Hospital of Sacramento operates a dedicated Family Birth Center serving the southern Sacramento suburbs, making it one of the most convenient birthing hospitals for Elk Grove families. The birth center provides maternity care in a community-hospital setting with private labor and delivery suites, a breastfeeding support program, and 24/7 obstetric coverage. With a Level III NICU on site, Methodist can care for newborns who need a higher level of support while families stay close to home. Doulas are welcome in the birthing suites, and the hospital's south Sacramento location on Hospital Drive means Elk Grove families have a full-service option that keeps the commute short during labor. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Kaiser Permanente South Sacramento Medical Center", thumbnail: "/images/elk-grove-ca-hospital-kaiser-south-sac.webp", address: "6600 Bruceville Rd, Sacramento, CA 95823", nicuLevel: "II", doulaPolicy: "Doulas welcome as support persons; independent doulas are not employed by Kaiser but are welcome in labor and delivery.", midwifeFriendly: true, medicaid: true, lactation: true, privateRooms: true, url: "https://healthy.kaiserpermanente.org/northern-california/health-wellness/maternity/find-hospital/south-sacramento", paragraph: "Kaiser Permanente South Sacramento Medical Center on Bruceville Road delivers obstetric care primarily for Kaiser HMO members and offers full maternity services with a neonatal unit and lactation support. Because of its southern Sacramento location, it is among the closest birthing options for Elk Grove families who are Kaiser members. Independent doulas are welcome in labor and delivery as support persons, and the hospital provides private maternity suites and a team-based care model. While its NICU is a lower Level II designation (appropriate for most growing and moderate-acuity newborns, with higher-level neonatal care at other Sacramento facilities for the sickest infants), it remains a convenient and well-regarded choice for routine Elke Grove births. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to prepare for your delivery here." },
    ],
    birthCenterDetails: [
    ],
    midwifeInfo: {
      paragraph: "Elk Grove families have access to a full spectrum of midwifery care across the Sacramento region. Certified Nurse-Midwives (CNMs) practice at UC Davis Medical Center, Dignity Health Mercy General and Methodist Hospitals, and Kaiser Permanente South Sacramento, offering hospital-based midwifery care close to home. Licensed Midwives (LMs) and Certified Midwives (CMs) serve the community through home birth practices and out-of-hospital birth options in the surrounding area.",
      credentialTypes: "CNMs and LMs",
      credentialDetail: "In California, Certified Nurse-Midwives (CNMs) are licensed through the Board of Registered Nursing and practice in hospitals including UC Davis Medical Center, Mercy General, and Methodist. Licensed Midwives (LMs) are licensed through the Medical Board of California under the Licensed Midwifery Practice Act and primarily attend home births across the Sacramento region. Elk Grove families can choose from hospital-based CNMs or community-based home-birth midwives depending on their birth plan.",
      thumbnail: "/images/doulas/elk-grove-ca-midwifery.webp"
    },
    medicaidNote: "Yes — California Medi-Cal covers doula services under SB-509, with a birth package reimbursement of approximately $1,587. Doulas must enroll through the PAVE portal to bill Medi-Cal directly. In Sacramento County, Medi-Cal managed care plans administer doula benefits, and enrolled Elk Grove doulas can serve eligible families at no cost. Contact your Medi-Cal plan for referral details.",
    insuranceNote: "Under California SB 332, commercial health plans are required to cover doula services and midwifery care. Check with your insurer for in-network doula providers and prior-authorization requirements. Many Elk Grove-area doulas offer superbills for out-of-network reimbursement, and Kaiser Permanente members can access doula services through their maternity care coordination program.",
    faqs: [
      { q: "Can I get a free doula through Medi-Cal in Elk Grove?", a: "Yes. California Medi-Cal covers doula services under SB-509 at approximately $1,587 for the full birth package. In Sacramento County, Medi-Cal managed care plans administer the benefit. Enrolled doulas bill through the PAVE portal. Call your Medi-Cal plan and ask specifically about doula coverage. Several Elk Grove-area doulas accept Medi-Cal." },
      { q: "Which hospital near Elk Grove has the highest-level NICU?", a: "UC Davis Medical Center in Sacramento has a Level III NICU and serves as the region's academic referral center for the most complex pregnancies. Dignity Health Mercy General and Methodist Hospital also offer Level III NICU care, while Kaiser Permanente South Sacramento provides a Level II unit. For a higher-risk pregnancy, UC Davis is the region's specialized center. <a href='/birth-plan-template/'>Grab the free birth plan template</a> so you walk in prepared." },
      { q: "Are there birth centers near Elk Grove?", a: "Most Elk Grove families choose home birth with a licensed midwife rather than a freestanding birth center, as the closest birth centers are concentrated closer to the Sacramento city center and the coast. Ask your midwife about home birth options and hospital transfer plans. <a href='/birth-plan-template/'>Grab the free birth plan template</a> to think through your options." },
      { q: "How much does a doula cost in Elk Grove?", a: "Expect to pay $1,200 to $2,800 for a birth doula in Elk Grove, depending on experience and services included. Most experienced doulas in the Sacramento area charge $1,500-$2,500 for a full birth package. Postpartum doula rates range from $30-$45 per hour. Medi-Cal covers doulas at no cost to eligible families. Grab the <a href='/birth-plan-template/'>free birth plan template</a> and start planning." },
      { q: "Does Elk Grove have a hospital with labor and delivery?", a: "No. Elk Grove does not currently have an in-city hospital with inpatient labor and delivery services. Elk Grove families deliver at major Sacramento hospitals including UC Davis Medical Center, Dignity Health Mercy General and Methodist Hospital, and Kaiser Permanente South Sacramento, all about 10-20 minutes away." },
      { q: "Are doulas welcome at Sacramento-area hospitals?", a: "Yes. UC Davis Medical Center, Dignity Health Mercy General and Methodist, and Kaiser Permanente South Sacramento all welcome doulas as part of the birth support team. California law supports a patient's right to have a doula present. Doulas are independent support professionals you hire directly, not hospital employees." },
    ],
    birthStats: {
      cesareanRate: 29.5,
      maternalMortalityRate: 31.0,
      homeBirthRate: 1.4,
      birthCenterBirthRate: 0.6,
      dataYear: 2023,
      dataSource: "CDC NCHS National Vital Statistics System",
    },
    nearbyCities: ["sacramento-ca", "stockton-ca", "fremont-ca"]
  },
'''

with open(PATH) as f:
    txt = f.read()

if '"elk-grove-ca"' in txt:
    print("ALREADY PRESENT — aborting to avoid duplicate")
    sys.exit(1)

# Insert before the "};" that closes the cities object (the one immediately
# followed by "export const citySlugs"). The file has the cities export,
# then citySlugs. Find the LAST "};" preceding "export const citySlugs".
match = re.search(r"\n\};(\s*\n\s*export const citySlugs)", txt)
if not match:
    print("ERROR: could not locate closing '};' before export const citySlugs")
    sys.exit(1)

insert_at = match.start()
new_txt = txt[:insert_at] + "\n" + block + "\n};" + match.group(1)

with open(PATH, "w") as f:
    f.write(new_txt)

# Verify
chk = open(PATH).read()
print("elk-grove-ca occurrences:", chk.count('"elk-grove-ca"'))
print("file still ends with:", chk.rstrip()[-40:].replace("\n","\\n"))