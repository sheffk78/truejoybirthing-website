#!/usr/bin/env python3
"""Insert Albuquerque city entry into cities.ts before the closing };"""

with open('src/data/cities.ts', 'r') as f:
    content = f.read()

lines = content.split('\n')

# Find the last '};' that closes the cities object
for i in range(len(lines) - 1, -1, -1):
    if lines[i].strip() == '};' and i <= len(lines) - 3:
        insert_pos = i
        break

print(f"Inserting at line {insert_pos + 1}")

new_entry = """  "albuquerque-nm": {
    enableBlogResources: true,
    publishedDate: "2026-07-29",
    city: "Albuquerque",
    state: "NM",
    slug: "albuquerque-nm",
    costLow: 725,
    costHigh: 1650,
    shelbiServesHere: false,
    lat: 35.0844,
    lng: -106.6504,
    heroImage: "/images/albuquerque-nm-birth-doula-hero-v2.webp",
    ogImage: "https://truejoybirthing.com/images/og-city-albuquerque-nm-v2.webp",
    supportSceneImage: "/images/albuquerque-nm-birth-doula-support.webp",
    supportSceneAlt: "A doula supporting an expectant mom in Albuquerque: New Mexico birth support and doula care",
    culture: "Albuquerque's birth culture is shaped by New Mexico's strong tradition of community-based midwifery and a growing doula workforce supported by the New Mexico Doula Association. The state has one of the most clearly structured licensing systems for midwives in the country, allowing both CPMs and CNMs to attend home births. New Mexico's Medicaid program (Centennial Care) covers doula services, making birth support accessible to more families across the Duke City.",
    heroLocalDetail: "Albuquerque's hospital birth corridor runs along the I-25 and I-40 junction, with UNM Hospital on Lomas Boulevard NE anchoring the academic medical center, Presbyterian Hospital downtown on Central Avenue, and Lovelace Women's Hospital up on Montgomery Boulevard NE. The Sandia Mountains rise to the east and the Rio Grande runs through the valley, giving the city a distinct geography that shapes everything from commute times to emergency transport routes. The North Valley and Los Ranchos de Albuquerque areas, where Dar a Luz Birth Center is located, offer a quieter out-of-hospital birth option just minutes from the medical district.",
    hospitalDetails: [
      { name: "University of New Mexico Hospital (UNMH)", thumbnail: "/images/unm-hospital-albuquerque.webp", url: "https://unmhealth.org/services/womens-health/maternity/", address: "2211 Lomas Blvd NE, Albuquerque, NM 87106", nicuLevel: "IV", vbacPolicy: "Allows TOLAC/VBAC, consult with provider", doulaPolicy: "Doulas welcome as support persons. UNMH has a Birth Companion program that offers volunteer doula support.", midwifeFriendly: true, waterBirth: "Water birth not routinely offered; hydrotherapy options available", medicaid: true, lactation: true, privateRooms: true, paragraph: "UNM Hospital at 2211 Lomas Blvd NE is the only Level IV maternity hospital in New Mexico and the state's only academic medical center, with a Level IV NICU that serves as the regional referral center for the most critically ill newborns across the entire state. The Family Birth Center at UNMH offers board-certified obstetricians and a large certified nurse-midwifery practice (CNMs) with 20+ midwives on staff providing midwife-attended births, as well as gentle C-sections with clear drapes and delayed cord clamping, nitrous oxide for pain relief, and Baby-Friendly designated maternity care. UNM also runs a Birth Companion doula program that trains volunteer doulas to support families during labor. Over 2,500 babies are born here each year. Lactation consultants are on staff, the hospital accepts New Mexico Medicaid (Centennial Care), and postpartum rooms are private with space for partners. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to prepare for your delivery here." },
      { name: "Presbyterian Hospital", thumbnail: "/images/presbyterian-hospital-albuquerque.webp", url: "https://www.phs.org/doctors-services/womens-health/obstetrics/labor-and-delivery", address: "1100 Central Ave SE, Albuquerque, NM 87106", nicuLevel: "III", vbacPolicy: "Allows TOLAC/VBAC, consult with provider", doulaPolicy: "Doulas welcome. Under New Mexico law, you may choose any doula to support you, and your doula may accompany you to any Presbyterian facility. Explicit doula policy available.", midwifeFriendly: true, waterBirth: "Hydrotherapy available; water birth varies by provider", medicaid: true, lactation: true, privateRooms: true, paragraph: "Presbyterian Hospital at 1100 Central Ave SE in downtown Albuquerque is the largest acute care hospital in New Mexico with a Level III NICU featuring 60 beds and a specialized team of neonatologists available around the clock. The Family Birthing Center offers private birthing suites, comprehensive prenatal education classes, breastfeeding support, and a clearly stated policy that doulas are welcome by New Mexico law at any Presbyterian facility. Presbyterian also operates Rust Medical Center in Rio Rancho with maternity services, and their PRESious Beginnings program provides postpartum support. The hospital accepts New Mexico Medicaid and offers childbirth education classes including Prep For Birthing, Breastfeeding Basics, and Baby Basics. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to coordinate your care team here." },
      { name: "Lovelace Women's Hospital", thumbnail: "/images/lovelace-womens-hospital-albuquerque.webp", url: "https://lovelace.com/services/labor-and-delivery/", address: "4701 Montgomery Blvd NE, Albuquerque, NM 87109", nicuLevel: "III", vbacPolicy: "VBAC program available", doulaPolicy: "Doulas welcome as support persons", midwifeFriendly: true, waterBirth: "Hydrotherapy with jacuzzi/jetted tubs available during labor", medicaid: true, lactation: true, privateRooms: true, paragraph: "Lovelace Women's Hospital at 4701 Montgomery Blvd NE is Albuquerque's only dedicated women's hospital, featuring a Level III NICU with 53 beds and 24/7 neonatologist coverage, maternal-fetal medicine specialists, and a full VBAC program. The Family Birthing Center offers private birthing suites where you stay in one room for labor, delivery, and recovery, and hydrotherapy with jetted tubs is available during labor. Lovelace offers obstetrics and midwifery services, a GRACE program supporting moms with substance use disorders, and the Labor of Love program providing free pregnancy perks to any expecting mom regardless of insurance. Lactation consultants are on staff and the hospital accepts New Mexico Medicaid. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to prepare for your delivery here." }
    ],
    birthCenterDetails: [
      { name: "Dar a Luz Birth & Health Center", thumbnail: "/images/dar-a-luz-birth-center-albuquerque.webp", url: "https://daraluzhealthcenter.org/", address: "7708 4th St NW, Los Ranchos de Albuquerque, NM 87107", services: ["Midwife-Led Births", "Water Birth", "Prenatal Care", "Postpartum Care", "Newborn Care", "Lactation Support", "Gynecology", "Teen Care", "Menopause Care", "Mental Health Services"], medicaid: true, costRange: "$3,500-$7,000", paragraph: "Dar a Luz Birth & Health Center at 7708 4th St NW in Los Ranchos de Albuquerque is the only freestanding birth center in Albuquerque and the only CABC-accredited facility in New Mexico that offers water birth. Operating since 2008 as a nonprofit, Dar a Luz provides midwife-led, low-intervention births in a home-like setting with a team of licensed midwives and CNMs. The center offers comprehensive prenatal care, water birth in large tubs, postpartum and newborn couplet care (where mother and baby stay together), board-certified lactation consultants available 7 days a week, and gynecology services. Dar a Luz accepts New Mexico Medicaid (Centennial Care) and serves families from across northern New Mexico. Emergency transfer protocols to UNM Hospital and Presbyterian Hospital, both within 15 minutes, are in place for safety.", credential: "CABC Accredited, New Mexico Licensed Birth Center" }
    ],
    medicaidNote: "Yes — New Mexico Medicaid (Centennial Care) covers doula services as a preventive service for eligible enrollees. This is one of the most progressive doula coverage programs in the country. Call your Centennial Care plan and ask \"Do you cover doula services?\" to confirm your specific plan's benefits. You can also contact the New Mexico Health Care Authority for assistance.",
    insuranceNote: "New Mexico law requires Medicaid managed care plans to cover doula services. For private insurance, coverage varies by plan. New Mexico also covers licensed midwife and birth center births through Centennial Care. Contact your insurer directly to ask about doula benefits and request a superbill for potential out-of-network reimbursement.",
    faqs: [
      { q: "Does Medicaid cover doulas in Albuquerque?", a: "Yes! Great news. New Mexico Medicaid (Centennial Care) covers doula services in Albuquerque. Here's your next step: call your Medicaid plan and ask \"Do you cover doula services?\" — they'll walk you through it. You can also call the New Mexico Health Care Authority for help. You deserve support, and your insurance helps pay for it." },
      { q: "How much does a doula cost in Albuquerque?", a: "Expect to pay $725 to $1,650 for a doula in Albuquerque. The median package price is around $1,150. Many doulas offer sliding-scale or payment plan options. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href='/birth-plan-template/'>free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does True Joy Birthing work with Albuquerque families?", a: "Yes — and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Albuquerque birth setting, whether you're delivering at a hospital, at Dar a Luz birth center, or at home. The app also helps you find and connect with local doulas and midwives. <a href='/birth-plan-template/'>Download the free birth plan template</a> and start preparing your way." },
      { q: "Are there birth centers in Albuquerque?", a: "Yes. Dar a Luz Birth & Health Center in Los Ranchos de Albuquerque is the city's only freestanding birth center, offering midwife-led water births in a home-like setting. They accept Medicaid and have been serving Albuquerque families since 2008. <a href='/birth-plan-template/'>Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "What hospital in Albuquerque has the highest level NICU?", a: "UNM Hospital has New Mexico's only Level IV NICU, the highest designation, capable of treating the most complex neonatal conditions. Presbyterian Hospital and Lovelace Women's Hospital both have Level III NICUs. <a href='/birth-plan-template/'>Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Can I have a water birth in Albuquerque?", a: "Yes — Dar a Luz Birth & Health Center is the only accredited facility in New Mexico that offers water birth. Most Albuquerque hospitals offer hydrotherapy (jet tubs) for pain relief during labor but do not routinely offer water birth itself. Ask your provider about your options." }
    ],
    nearbyCities: ["phoenix-az", "las-vegas-nv", "tucson-az"],
    birthStats: {
      cesareanRate: 26.5,
      maternalMortalityRate: 26.0,
      homeBirthRate: 2.1,
      birthCenterBirthRate: 0.8,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System"
    }
  },
"""

# Insert before the closing '};'
lines.insert(insert_pos, new_entry.rstrip('\n'))

with open('src/data/cities.ts', 'w') as f:
    f.write('\n'.join(lines))

print("Successfully inserted Albuquerque entry!")