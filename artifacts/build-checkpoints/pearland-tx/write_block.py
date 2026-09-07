import re

f = open('src/data/cities.ts').read()
start = f.find('"pearland-tx": {')
assert start > 0, "pearland-tx block not found"
i = start + len('"pearland-tx": {')
depth = 1; j = i
while depth > 0 and j < len(f):
    c = f[j]
    if c == '{': depth += 1
    elif c == '}': depth -= 1
    j += 1
end = j
old_block = f[start:end]
print("old block length:", len(old_block))

new_block = '''"pearland-tx": {
    enableBlogResources: true,
    publishedDate: "2026-09-07",
    city: "Pearland",
    state: "TX",
    stateFull: "Texas",
    slug: "pearland-tx",
    titleTag: "Pearland, Texas Doula Costs, Hospitals & Medicaid",
    metaDescription: "Pearland doula costs, hospital NICU levels, Medicaid coverage, and local birth providers for Brazoria County families.",
    population: 131000,
    costLow: 800,
    costHigh: 2500,
    heroImage: "/images/pearland-tx-birth-doula-skyline-v2.webp",
    supportSceneImage: "/images/pearland-tx-birth-doula-support-v2.webp",
    supportSceneAlt: "A doula supporting an expectant mom in Pearland: Brazoria County birth support and doula care",
    ogImage: "https://truejoybirthing.com/images/og-city-pearland-tx-v2.webp",
    shelbiServesHere: false,
    localDoulas: [
      { name: "Samentha Alarcon" , credential: "Certified Birth & Postpartum Doula, Owner" , practice: "True Bloom Doula Care LLC" , url: "https://www.bornbir.com/samentha-alarcon" , photo: "/images/provider-pearland-tx-samentha-alarcon.webp" , description: "Samentha Alarcon owns True Bloom Doula Care LLC, a Houston-area doula agency serving Pearland and the greater Houston metro. She offers birth doula, postpartum doula, and student doula support with many package and price points to honor your vision and budget. True Bloom accepts FSA/HSA credits, afterpay, affirm, and klarna, and offers payment plans. Its Student Doula Program connects families with emerging doulas working toward certification, offering a more affordable option for quality care. Clients praise Samentha for helping them navigate transferring care, answering questions, and providing peace of mind throughout pregnancy and birth." , costRange: "$800-$2,500" , acceptingClients: true , services: ["Birth Doula", "Postpartum Doula", "Student Doula Program", "Childbirth Education"] , serviceArea: ["Pearland, TX", "Houston, TX", "Sugar Land, TX", "League City, TX", "Pasadena, TX", "Baytown, TX"] , isVerified: true , costRange_source: "market-estimate" },
      { name: "Elissa Hinson" , credential: "CD(DONA)" , practice: "Birth with Faith LLC" , url: "https://doulamatch.net/profile/33863/elissa-hinson-cd-dona" , photo: "/images/provider-pearland-tx-elissa-hinson.webp" , description: "DONA-certified birth doula based in Alvin, TX, serving Pearland and the greater Houston area. Elissa has 4 years of experience and has attended 45 births, supporting families at all hospitals, birth centers, and home births with a midwife present. Her packages include 3 prenatal and postpartum meetings, hands-on labor prep at 36 weeks, continuous labor support, and a postpartum visit within 10-12 days. She offers aromatherapy, childbirth education, photography, placenta encapsulation, and NICU support. Clients praise her calm presence, advocacy, and ability to create a peaceful hospital room environment." , costRange: "$800-$1,400" , acceptingClients: true , services: ["Birth Doula", "Childbirth Education", "Birth Photography", "Placenta Encapsulation"] , serviceArea: ["Pearland, TX", "Alvin, TX", "League City, TX", "Houston, TX"] , isVerified: true , costRange_source: "market-estimate" },
      { name: "In Bloom Midwifery" , credential: "Licensed Midwife (LM)" , practice: "In Bloom Midwifery" , url: "https://inbloommidwifery.com/" , photo: "/images/provider-pearland-tx-in-bloom-midwifery.webp" , description: "In Bloom Midwifery is a licensed midwifery practice serving families in Pearland and the surrounding Houston area with gentle, personalized home birth care. The experienced team is dedicated to providing holistic, evidence-based care throughout pregnancy, labor, and postpartum. In Bloom offers home birth services, water birth, prenatal care, and postpartum support, giving Pearland families a low-intervention alternative to hospital birth. The practice is a trusted local option for families seeking a midwife-led, out-of-hospital birth experience in Brazoria County." , costRange: "$2,500-$5,000" , acceptingClients: true , services: ["Midwife", "Home Birth", "Water Birth", "Prenatal Care", "Postpartum Care", "Breastfeeding Support"] , serviceArea: ["Pearland, TX", "Houston, TX", "Brazoria County, TX", "Friendswood, TX"] , isVerified: true , costRange_source: "market-estimate" },
    ],
    culture: "Pearland is a fast-growing suburb of Houston in Brazoria County, about 15 miles south of downtown Houston. One of the fastest-growing communities in the country, Pearland blends family-friendly neighborhoods with easy access to the Texas Medical Center and the Bay Area medical corridor. Most families deliver at HCA Houston Healthcare Pearland, Memorial Hermann Pearland, or nearby hospitals in Webster and Houston, with a growing birth community of doulas and midwives serving the area.",
    heroLocalDetail: "HCA Houston Healthcare Pearland at 11100 Shadow Creek Pkwy offers labor and delivery with a Level IV trauma center. Memorial Hermann Pearland at 16100 South Fwy provides women's health and gynecology, with higher-level care available at Memorial Hermann Southeast and the Texas Medical Center. In Bloom Midwifery offers home birth care to Pearland families. Most Pearland doulas cover hospital, birth center, and home births across Brazoria County.",
    hospitalDetails: [
      {
        name: "HCA Houston Healthcare Pearland",
        thumbnail: "/images/pearland-tx-hca-pearland.webp",
        address: "11100 Shadow Creek Pkwy, Pearland, TX 77584",
        url: "https://www.hcahoustonhealthcare.com/locations/pearland/specialties/womens-care",
        nicuLevel: "II",
        doulaPolicy: "Doulas welcome as support persons; confirm current visitor policy during your hospital tour",
        midwifeFriendly: true,
        waterBirth: "Water birth not routinely offered; labor tubs may be available",
        medicaid: true,
        lactation: true,
        privateRooms: true,
        vbacPolicy: "Allows TOLAC/VBAC; discuss with your provider",
        paragraph: "HCA Houston Healthcare Pearland, at 11100 Shadow Creek Pkwy, is a 49-bed acute care hospital in the heart of Pearland offering labor and delivery services with a Level IV Trauma Center, an accredited Chest Pain Center, and a certified Primary Stroke Center. The hospital's Women's Care program provides childbirth education, breastfeeding, and newborn care classes, with board-certified OB/GYNs and specially trained nurses supporting families through labor and delivery. Private labor and delivery suites are available with operating rooms nearby for cesarean deliveries. The hospital offers breastfeeding support through certified lactation consultants and comprehensive prenatal care. For higher-risk pregnancies, maternal-fetal medicine specialists are available, with transport to a higher-level NICU in the HCA Houston network if needed. If you're delivering at HCA Pearland, bringing your birth plan makes the intake conversation smoother. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to prepare.",
      },
      {
        name: "Memorial Hermann Pearland Hospital",
        thumbnail: "/images/pearland-tx-memorial-hermann-pearland.webp",
        address: "16100 South Fwy, Pearland, TX 77584",
        url: "https://memorialhermann.org/locations/pearland",
        nicuLevel: "II",
        doulaPolicy: "Doulas welcome as support persons; confirm current visitor policy during your hospital tour",
        midwifeFriendly: true,
        waterBirth: "Water birth not routinely offered",
        medicaid: true,
        lactation: true,
        privateRooms: true,
        vbacPolicy: "Allows TOLAC/VBAC; discuss with your provider",
        paragraph: "Memorial Hermann Pearland Hospital, at 16100 South Fwy, opened in March 2016 and brings the expertise of the Memorial Hermann Health System close to home for Pearland and Brazoria County families. The hospital offers 97 inpatient beds across medical/surgical, intensive, and cardiac care, with women's health and gynecology services, operating rooms, and advanced imaging. For labor and delivery, families can access Memorial Hermann's comprehensive women's services, with higher-level care available within minutes via Memorial Hermann Life Flight to Memorial Hermann Southeast Hospital, Memorial Hermann-Texas Medical Center, or Children's Memorial Hermann Hospital. The hospital provides childbirth education, breastfeeding, and newborn care classes. If a higher level of care is needed, patients can be transported quickly to the Texas Medical Center. If you're delivering at Memorial Hermann Pearland, having your birth plan ready helps your care team understand your preferences. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to get started.",
      },
    ],
    birthCenterDetails: [
      {
        name: "In Bloom Midwifery & Home Birth Services",
        thumbnail: "/images/pearland-tx-in-bloom-birth-center.webp",
        address: "Pearland, TX 77584",
        url: "https://inbloommidwifery.com/",
        services: ["Midwife-Led Care", "Home Birth", "Water Birth", "Prenatal Care", "Postpartum Care", "Breastfeeding Support"],
        costRange: "$2,500-$5,000",
        medicaid: false,
        distance: "Located in Pearland",
        paragraph: "In Bloom Midwifery is a licensed midwifery practice offering gentle, personalized home birth care to families in Pearland and the surrounding Houston area. The experienced team provides holistic, evidence-based care throughout pregnancy, labor, and postpartum, with home birth and water birth options for low-risk families seeking a low-intervention alternative to hospital birth. In Bloom serves families across Brazoria County and the greater Houston metro, offering comprehensive prenatal care, continuous labor support, and postpartum visits. For Pearland families seeking an out-of-hospital birth experience, In Bloom is a trusted local option. Having a doula who knows the In Bloom midwives and their approach makes the experience feel more connected and supported. Call ahead to schedule a consultation and confirm availability, as spots fill.",
      },
    ],
    midwifeInfo: {
      paragraph: "Texas licenses Certified Nurse-Midwives (CNMs) and Certified Professional Midwives (CPMs), giving Pearland families regulated midwife options for home birth, birth center birth, and hospital delivery. CNMs practice in hospitals like HCA Houston Healthcare Pearland and Memorial Hermann Pearland, while CPMs typically attend home and birth center births. In Bloom Midwifery in Pearland offers home birth services to area families. Texas Medicaid covers CNM services, and SB 750 (2024) extended Medicaid reimbursement to doulas working alongside midwives.",
      credentialTypes: "CNM, LM, CPM",
    },
    birthStats: {
      cesareanRate: 34.2,
      maternalMortalityRate: 18.5,
      homeBirthRate: 1.2,
      birthCenterBirthRate: 0.8,
      dataYear: 2023,
      dataSource: "CDC NCHS National Vital Statistics System; Texas DSHS 2023",
    },
    medicaidNote: "Yes — as of September 2024, Texas Medicaid covers doula services under SB 750 for eligible enrollees, including Brazoria County's STAR managed care plans. Call Texas Medicaid at 1-877-543-7669 or visit YourTexasBenefits.com to confirm your plan's doula coverage before hiring.",
    insuranceNote: "Whether doula services are partially covered varies by plan in the Pearland area. Many Houston-area employers in the Bay Area industrial corridor offer maternity wellness benefits that may include doula support. Check with your HR department about doula coverage, and whether HSA or FSA funds can help cover out-of-pocket costs. Contact your insurance provider directly to confirm.",
    faqs: [
      { q: "How much does a doula cost in Pearland?" , a: "Expect to pay $800 to $2,500 for a doula in Pearland. Prices reflect the greater Houston metro and Brazoria County market, where experienced doulas with hospital experience at HCA Pearland and Memorial Hermann Pearland command premium rates. The investment typically covers prenatal visits, labor support, and postpartum check-ins. Grab the <a href='/birth-plan-template/'>free birth plan template</a> and start thinking about what matters most to you." },
      { q: "Does Medicaid cover doulas in Pearland?" , a: "Yes! Great news. Medicaid covers doula services in Pearland. This is thanks to SB 750. That includes Brazoria County's STAR managed care plans. Here's your next step: call your Medicaid plan and ask 'Do you cover doula services?' they'll walk you through it, or call 1-877-543-7669 directly. You can also check online at YourTexasBenefits.com. You deserve support, and now your insurance helps pay for it." },
      { q: "Which hospitals near Pearland have labor and delivery?" , a: "HCA Houston Healthcare Pearland at 11100 Shadow Creek Pkwy offers labor and delivery services with a Level IV trauma center. Memorial Hermann Pearland at 16100 South Fwy provides women's health and gynecology, with higher-level care available at Memorial Hermann Southeast and the Texas Medical Center. Both accept Medicaid and welcome doulas as support persons. <a href='/birth-plan-template/'>Grab the free birth plan template</a> so you walk in knowing exactly what you want." },
      { q: "Are there birth centers near Pearland?" , a: "In Bloom Midwifery in Pearland offers home birth and midwife-led care for families seeking a low-intervention birth experience. For a freestanding birth center, BioBirth Birth Center in nearby Webster offers midwife-led births, water birth, prenatal care, and postpartum services. Schedule a tour to see if a birth center setting is right for your family. <a href='/birth-plan-template/'>Grab the free birth plan template</a> to think through whether a birth center or hospital is right for you." },
      { q: "Does True Joy Birthing work with Pearland families?" , a: "Yes. and it's free. True Joy Birthing's birth plan app, checklist, and guided walkthrough work for any Pearland birth setting, whether you're delivering at HCA Pearland, Memorial Hermann Pearland, at In Bloom Midwifery, or at home. The app also helps you find and connect with local doulas and midwives. <a href='/birth-plan-template/'>Download Your Birth Plan template</a> and start preparing your way. no signup required." },
    ],
    lat: 29.5636,
    lng: -95.2860,
    nearbyCities: ["houston-tx", "alvin-tx", "league-city-tx", "friendswood-tx"],
  }'''

f = f[:start] + new_block + f[end:]
open('src/data/cities.ts', 'w').write(f)
print("block written. new file length:", len(f))
