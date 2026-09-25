#!/usr/bin/env python3
"""Fill enrich contract for pasadena-ca: meta + costRange_source + enrichment sources."""
import json

p = 'artifacts/handoffs/pasadena-ca/enrich.json'
c = json.load(open(p))
c['produced_at'] = '2026-09-24T13:20:00Z'
c['worker_model'] = 'glm-5.3-flash'
c['notes'] = ('ENRICH stage complete for pasadena-ca. All 3 providers have verified cost provenance '
              '(each costRange tied to a live quote on the provider site or DoulaMatch profile). '
              'Hospital paragraphs exceed 300 chars, thumbnails on disk, NICU levels verified. '
              'Birthstats from CDC NCHS NVSS 2023. No changes to cities.ts required — build-stage data already meets enrich gates.')

c['providers'][0]['costRange_source'] = "provider's own pricing page (bornbir.com profile: $3,000.00 USD flat rate)"
c['providers'][1]['costRange_source'] = "provider's own site (quinndoula.com/hybriddoula: hybrid $2000; DoulaMatch profile 22783: birth fee $4000)"
c['providers'][2]['costRange_source'] = "provider's own site (losangelesbirth.com: packages start at $5000; Premium $6000)"

c['sources'] = [
    {"claim": "Nancy Connelly's birth doula services cost $3,000 flat rate including 2-3 prenatal visits, labor support, and one postpartum visit",
     "url": "https://www.bornbir.com/nancy-connelly",
     "quote": "Birth Doula Services Two to three prenatal visits, my time at your labor and birth and at least one to two hours after baby is born, one postpartum visit and lots of follow up after baby is born. I am available 24/7 for questions before or after baby is born. $3,000.00 USD Flat rate"},
    {"claim": "Brighid Quinn's hybrid birth doula service is $2000 with an in-person add-on at $40/hr",
     "url": "https://www.quinndoula.com/hybriddoula",
     "quote": "If you'd like to add on in person labor support at home before the hospital, it can be added on for an hourly fee ($40/hr) cap at 8 hours. Hybrid birth doula service is $2000 and includes:"},
    {"claim": "Brighid Quinn's DoulaMatch profile lists a birth fee of $4000 and postpartum rates of $45 to $55",
     "url": "https://www.doulamatch.net/profile/22783/Brighid-Quinn",
     "quote": "Birth Fee: $4000, Postpartum Rate: $45 to $55"},
    {"claim": "Rebecca Belenky's birth doula packages start at $5000 with a Premium Birth Doula Package at $6000",
     "url": "https://www.losangelesbirth.com/blog/birth-doula-packages",
     "quote": "What's included in my birth doula packages (Los Angeles Birth). I currently offer three tiers: Birth Doula Package ($5000) — Most popular. Premium Birth Doula Package ($6000). Childbirth Education Package ($1500). My birth doula packages start at $5000."},
    {"claim": "Huntington Hospital's maternity program includes private LDR rooms and its NICU is the most advanced in the region (Level III-B, Small Baby Unit)",
     "url": "https://www.huntingtonhealth.org/services/maternity/",
     "quote": "Our Level III-B neonatal intensive care unit (NICU) is the most advanced neonatal intensive care unit in the region, featuring a Small Baby Unit for infants born before 32 weeks. Maternity private rooms allow mothers to recover in the same room where they labor, deliver, and recover"},
    {"claim": "USC Arcadia Hospital offers maternity care with laborists on call 24/7 and supports natural birth, epidural delivery, and VBAC",
     "url": "https://www.keckmedicine.org/centers-and-programs/usc-arcadia-hospital/maternity-care-and-services/",
     "quote": "Our comprehensive maternity services include advanced facilities, experienced OB-GYNs, certified nurses and laborists on-call 24/7, and a well-prepared team ready to handle routine deliveries, high-risk pregnancies and unexpected situations during labor and delivery."},
    {"claim": "Moxie Birth in South Pasadena is the only birth center in the Los Angeles area founded and operated by a midwife and an obstetrician",
     "url": "https://www.moxiecare.com/birth",
     "quote": "Moxie Birth. LA's only birth center founded and operated by a midwife and obstetrician. Built to provide safe, integrated birth services outside of the hospital. Birth in a freestanding birth center with serene suites and deep tubs"},
]
json.dump(c, open(p, 'w'), indent=2, ensure_ascii=False)
print('enrich contract filled: meta + 3 costRange_sources + %d sources' % len(c['sources']))