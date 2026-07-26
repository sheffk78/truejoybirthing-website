with open("src/data/cities.ts", "r") as f:
    content = f.read()

correct_block = '''  "port-st-lucie-fl": {
    enableBlogResources: true,
    publishedDate: "2026-06-22",
    city: "Port St. Lucie",
    state: "FL",
    slug: "port-st-lucie-fl",
    costLow: 1200,
    costHigh: 2500,
    shelbiServesHere: false,
    heroImage: "/images/port-st-lucie-fl-hero.webp",
    ogImage: "/images/port-st-lucie-fl-hero.webp",
    supportSceneImage: "/images/port-st-lucie-support-scene.webp",
    supportSceneAlt: "A doula supporting an expectant mother in Port St. Lucie: Treasure Coast birth support and doula care",
    
    localDoulas: [
      { name: "Michelle Jackson" , credential: "Birth Doula" , practice: "Michelle Jackson" , url: "https://www.meetyourdoula.com/united-states/port-st-lucie/doulas/michelle-jackson" , photo: "/images/provider-port-st-lucie-fl-michelle-jackson.webp", description: "I am 43 years old and the proud mother of 5 children ages 22 (twins), 20, 17, and 8. I currently serve Port Saint Lucie, Florida and the greater Treasure Coast ...", costRange: "$1,200-$2,500 (package)", acceptingClients: true, services: ["Birth Doula" , "Postpartum Doula"], serviceArea: ["Port St. Lucie, FL"] },
      { name: "Maternal and Child Health" , credential: "Birth Doula" , practice: "Maternal and Child Health" , url: "https://stlucie.floridahealth.gov/programs-and-services/clinical-and-nutrition-services/maternal-and-child-health/" , photo: "/images/provider-port-st-lucie-fl-maternal-and-child-health.webp", description: "Sisters Empowering Sisters Doula and Breastfeeding Program. Creating a Positive Birth Experience. Learn more about the birth experience, be supported and ...", costRange: "$1,200-$2,500 (package)", acceptingClients: true, services: ["Birth Doula" , "Postpartum Doula"], serviceArea: ["Port St. Lucie, FL"] },
      { name: "My Baby Lady" , credential: "Birth Doula" , practice: "My Baby Lady" , url: "https://www.mybabylady.com/" , photo: "/images/provider-port-st-lucie-fl-myanne.png", description: "My Baby Lady is a Birth Coach and Doula with 10+yrs experience helping women to a positive birth experience. In-person (Treasure Coast) and Virtual Doula.", costRange: "$1,200-$2,500 (package)", acceptingClients: true, services: ["Birth Doula" , "Postpartum Doula"], serviceArea: ["Port St. Lucie, FL"] }
    ],
    culture: "Port St. Lucie is one of the fastest-growing cities in the United States \\\\u2014 population has surged past 240,000 with roughly 50% growth over the past decade, driven by South Florida families relocating north for affordable housing and remote-work flexibility. The birth community is still catching up to the population boom. Cleveland Clinic Martin Health and HCA\\\\u2019s St. Lucie Medical Center anchor a hospital-only birth landscape \\\\u2014 there are no freestanding birth centers in the Treasure Coast region, which is a significant gap for a city this size. CNMs practice within hospital systems, and Florida\\\\u2019s refusal to license CPMs means out-of-hospital birth options are extremely limited. Doula support exists through groups like Treasure Coast Doulas, but the community is small relative to the volume of young families arriving every month." ,
    heroLocalDetail: "Cleveland Clinic Martin Health \\\\u2013 Tradition Hospital sits at 10000 SW Innovation Way in the master-planned Tradition community on PSL\\\\u2019s west side, right off I-95 at the Gatlin Boulevard exit \\\\u2014 and that I-95/Gatlin interchange backs up steadily during afternoon rush, so if you\\\\u2019re coming from St. Lucie West or southern PSL, add 10 minutes to your estimate. St. Lucie Medical Center is at 1800 SE Tiffany Ave on the east side of town, reachable via US-1 (South Federal Highway) or the Turnpike\\\\u2019s Becker Road exit. PSL is roughly 120 square miles of suburban sprawl \\\\u2014 if you live in western communities like Tradition or St. Lucie West, you\\\\u2019re 20\\\\u201325 minutes from St. Lucie Medical Center on the east side, so know which hospital your OB delivers at before you\\\\u2019re timing contractions. The Turnpike runs north\\\\u2013south through the center of the city and I-95 runs along the western edge \\\\u2014 both are your main arteries, and both slow down between 4 and 6 PM. Jensen Beach families typically deliver at Cleveland Clinic Martin North in Stuart, about 5\\\\u201310 minutes south across the county line. For third-trimester walks, the Savannas Preserve State Park on the east side has flat trails through wetlands, and Tradition Square near the hospital has a walkable lakefront area that\\\\u2019s popular with young families in the evening." ,
    hospitalDetails: [
      { name: "Cleveland Clinic Martin Health \\\\u2013 Tradition Hospital" , paragraph: "Cleveland Clinic Martin Health \\\\u2013 Tradition Hospital, at 10000 SW Innovation Way in PSL\\\\u2019s Tradition community, opened in 2014 and is the newest hospital in the city. It has a Level II Special Care Nursery (managing babies \\\\u226532 weeks gestation; transfers complex cases to Martin North\\\\u2019s Level III NICU), 24/7 OB hospitalist coverage, epidural availability, CNM-friendly policies, and lactation consultants. The hospital handles an estimated 1,200\\\\u20131,500 births per year and draws heavily from the young families relocating into the Tradition and St. Lucie West communities. If you\\\\u2019re delivering at Tradition, having your birth plan ready keeps your preferences clear in a hospital that\\\\u2019s busy and growing fast. <a href=\\\\\"/birth-plan-template/\\\\">Use our free hospital birth plan template</a> to get started." },
      { name: "Cleveland Clinic Martin Health \\\\u2013 Martin North Hospital" , paragraph: "Cleveland Clinic Martin Health \\\\u2013 Martin North Hospital, at 800 SE Hospital Ave in Stuart (Martin County, about 10\\\\u201315 miles from PSL), has the Treasure Coast\\\\u2019s only Level III NICU \\\\u2014 the regional referral center for high-risk pregnancies and critically ill newborns, with 24/7 neonatologists, sustained ventilation capability, and the highest-acuity neonatal care in the immediate region. It\\\\u2019s also the highest-volume birthing hospital in the area with an estimated 2,000\\\\u20132,500 births per year. Martin North\\\\u2019s dedicated maternity wing, CNM practices, lactation support, and childbirth education make it the go-to for complex pregnancies throughout St. Lucie and Martin counties. If you\\\\u2019re navigating a high-risk pregnancy, this is likely where your OB will refer you. <a href=\\\\\"/birth-plan-template/\\\\">Use our free hospital birth plan template</a> so your team has something specific to work from." },
      { name: "St. Lucie Medical Center" , url: "https://www.hcafloridahealthcare.com/locations/st-lucie-hospital" , address: "1800 SE Tiffany Ave, Port St. Lucie, FL 34952" , nicuLevel: "II" , doulaPolicy: "Doulas welcome as support persons; confirm current visitor policy during your hospital tour" , medicaid: true, lactation: true, privateRooms: true, midwifeFriendly: true, waterBirth: "Water birth not routinely offered", paragraph: "St. Lucie Medical Center, at 1800 SE Tiffany Ave on PSL’s east side, is an HCA Healthcare hospital that’s been serving the community since 1983. It has a Level II Special Care Nursery (transfers complex cases to Martin North\\\\u2019s Level III NICU), 24/7 OB/GYN and anesthesia coverage, midwifery care through affiliated practices, lactation consultants, and childbirth classes. The hospital handles an estimated 1,000\\\\u20131,400 births per year and serves central and eastern PSL. If we\\\\u2019re being real, PSL\\\\u2019s sprawl means this east-side hospital is a long drive from the Tradition area \\\\u2014 so confirm which hospital your provider delivers at early, not at 38 weeks. <a href=\\\\\"/birth-plan-template/\\\\">Use our free hospital birth plan template</a> to walk in prepared." }
    ],
    birthCenterDetails: [],
    nearbyCities: ["st-augustine-fl", "orlando-fl", "port-st-lucie-fl"],
    birthStats: {
      cesareanRate: 30.5,
      maternalMortalityRate: 37.8,
      homeBirthRate: 1.5,
      birthCenterBirthRate: 0.5,
      dataYear: 2022,
      dataSource: "CDC NCHS National Vital Statistics System"
    }
  }'''

import re
pattern = r'  "port-st-lucie-fl":\s*\{[^}]+\}'
content = re.sub(pattern, correct_block, content, flags=re.DOTALL)

with open("src/data/cities.ts", "w") as f:
    f.write(content)

print("Replaced corrupted port-st-lucie-fl block")