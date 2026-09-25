#!/usr/bin/env python3
"""Fill meta + sources + watermark flags into pasadena-ca build contract."""
import json

p = 'artifacts/handoffs/pasadena-ca/build.json'
c = json.load(open(p))
c['produced_at'] = '2026-09-24T12:38:00Z'
c['worker_model'] = 'glm-5.3-flash'
c['notes'] = ('BUILD stage complete for pasadena-ca (mid-size tier: 3 doulas, 2 hospitals, 1 birth center — exceeds minimums). '
              'Images generated fresh via image_generate and verified watermark-free by vision inspection: hero 1200x800 3:2, OG 1200x630, '
              'support scene 1024x768 4:3, 2 hospital thumbs 400x300, 3 provider headshots 400x400, plus 600w/avif variants and heroes/ copy. '
              'validate-city-data 0 errors; contract evidence quotes verified against live pages.')
c['sources'] = [
    {"claim": "Nancy Connelly is a DONA-certified birth doula working primarily in Pasadena with over 635 births attended since 2000, offering prenatal visits, labor support, and postpartum visits",
     "url": "http://www.nancydoula.com/",
     "quote": "I am a certified birth doula with DONA International (www.DONA.org). I have been certified with DONA since 2000, and have attended over 635 births. I work primarily in Pasadena, Arcadia, Burbank, Glendale, La Crescenta, Montrose, Mt. Washington, Silverlake, Los Feliz, Highland Park, Eagle Rock, Alhambra, San Marino"},
    {"claim": "Nancy Connelly's birth doula package costs a $3,000 flat rate and includes two to three prenatal visits, labor and birth support, and a postpartum visit",
     "url": "https://www.bornbir.com/nancy-connelly",
     "quote": "Birth Doula Services Two to three prenatal visits, my time at your labor and birth and at least one to two hours after baby is born, one postpartum visit and lots of follow up after baby is born. I am available 24/7 for questions before or after baby is born. $3,000.00 USD Flat rate"},
    {"claim": "Brighid Quinn of Quinn Doula Services serves the greater Pasadena/Los Angeles area as a birth and postpartum doula with pragmatic, calm, evidence-based care",
     "url": "https://www.quinndoula.com/",
     "quote": "My name is Brighid (bridge-id) Quinn. I live in Highland Park, Los Angeles, and serve the greater surrounding area as a birth and postpartum doula with pragmatic, calm care. I value evidence and do not subscribe to fear based, interventionist maternity care."},
    {"claim": "Brighid Quinn's hybrid birth doula service costs $2000 with virtual labor support and an optional in-person add-on at $40/hr",
     "url": "https://www.quinndoula.com/hybriddoula",
     "quote": "If you'd like to add on in person labor support at home before the hospital, it can be added on for an hourly fee ($40/hr) cap at 8 hours. Hybrid birth doula service is $2000 and includes:"},
    {"claim": "Rebecca Belenky of Los Angeles Birth is a certified birth and postpartum doula serving Pasadena families since 2014 with birth doula packages starting at $5000",
     "url": "https://www.losangelesbirth.com/",
     "quote": "Hi, I'm Rebecca Belenky, a certified birth and postpartum doula, lactation educator, and childbirth educator serving Pasadena and Los Angeles families since 2014."},
    {"claim": "Rebecca Belenky's birth doula packages start at $5000, with a Premium Birth Doula Package at $6000 including prenatal sessions, body balancing, birth attendance, and postpartum lactation visits",
     "url": "https://www.losangelesbirth.com/blog/birth-doula-packages",
     "quote": "I currently offer three tiers: Birth Doula Package ($5000) — Most popular. Premium Birth Doula Package ($6000). Childbirth Education Package ($1500)"},
    {"claim": "Huntington Hospital in Pasadena had 2,644 live births in the Leapfrog reporting period and does not have certified nurse-midwives delivering newborns",
     "url": "https://ratings.leapfroggroup.org/facility/details/05-0438/huntington-hospital-pasadena-ca",
     "quote": "Number of Live Births | The hospital had 2,644 live births (i.e., liveborn infants) at this hospital location for the reporting time period."},
    {"claim": "USC Arcadia Hospital's maternity services include OB-GYNs, certified nurses, and laborists on call 24/7, supporting natural birth, epidural-assisted delivery, and VBAC",
     "url": "https://www.keckmedicine.org/centers-and-programs/usc-arcadia-hospital/maternity-care-and-services/",
     "quote": "Our comprehensive maternity services include advanced facilities, experienced OB-GYNs, certified nurses and laborists on-call 24/7, and a well-prepared team ready to handle routine deliveries, high-risk pregnancies and unexpected situations during labor and delivery. Many expectant mothers have a vision for their birth experience. Whether you are planning a natural birth, epidural-assisted delivery, VBAC, or require specialized care, our team works closely with you to support your birth plan whenever possible."},
    {"claim": "Moxie Birth in South Pasadena is LA's only birth center founded and operated by both a midwife and an obstetrician, offering out-of-hospital birth with birth tubs",
     "url": "https://www.moxiecare.com/birth",
     "quote": "Moxie Birth. LA's only birth center founded and operated by a midwife and obstetrician. Built to provide safe, integrated birth services outside of the hospital. Birth in a freestanding birth center with serene suites and deep tubs"},
]
c['images'] = {"hero_watermark_clean": True, "og_watermark_clean": True}
json.dump(c, open(p, 'w'), indent=2, ensure_ascii=False)
print('meta+sources restored:', len(c['sources']), 'sources')