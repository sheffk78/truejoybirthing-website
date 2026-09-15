import json
from datetime import datetime, timezone

p = 'artifacts/handoffs/concord-nc/enrich.json'
d = json.load(open(p))

d['produced_at'] = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
d['worker_model'] = 'glm-5.3-flash'
d['notes'] = ("ENRICH stage for concord-nc: sourced 3 real provider headshots (Lindsay Stowers "
              "from Heart of Grace, Tiffany St. Louis, What The Bump team) plus a real hospital "
              "building exterior photo of Atrium Health Cabarrus; hospital paragraph covers NICU "
              "level IV, bed count, doula policy, Baby-Friendly, lactation and language services; "
              "costRange_source tagged market-estimate on all providers; No-freestanding birth "
              "center entry carries no thumbnail field.")
d['sources'] = [
    {"claim": "Atrium Health Cabarrus maternity center is called Mariam Cannon Hayes Women's Center and has a Level IV NICU with Atrium Health Levine Children's neonatologists and Jeff Gordon Children's Center on-site",
     "url": "https://atriumhealth.org/locations/detail/atrium-health-cabarrus/medical-services/maternity-services",
     "quote": "the maternity center at Atrium Health Cabarrus – called Mariam Cannon Hayes Women's Center – provides exceptional care for growing families like yours ... you're receiving top-notch care, with Atrium Health Levine Children's neonatologists, a Level IV NICU and Jeff Gordon Children's Center all on-site"},
    {"claim": "Atrium Health Cabarrus is a 457-bed not-for-profit hospital in Concord, NC",
     "url": "https://www.simplyhired.com/job/CjMNRKvmJ3-ibmU83r3Zrh19A1sx6aoR1aXNlZSAVJM5WUsXwJgiIg",
     "quote": "Atrium Health Cabarrus is a regional 457-bed, not-for-profit hospital in Concord, NC. More than 4,200 hospital employees provide services through an extensive inpatient and outpatient network, including Jeff Gordon Children's Center, Hayes Family Center and Batte Cancer Center"},
    {"claim": "Atrium Health Cabarrus has an open visiting policy; the father of the baby or significant other is welcome any time at the Mariam Cannon Hayes Family Center, and NICU visitors are welcome anytime except 6:30-7:30am/pm",
     "url": "https://atriumhealth.org/locations/detail/atrium-health-cabarrus/visiting-hours",
     "quote": "The father of the baby or significant other is welcome at any time. Other visitors are allowed from 6 a.m. to 2 p.m and 4 p.m. to 10 p.m. In the NICU, visitors are welcome any time except 6:30-7:30 in the morning and evening."},
    {"claim": "Atrium Health provides lactation support by international board-certified lactation consultants and every Atrium Health hospital has providers trained in breastfeeding, with some holding Baby-Friendly designation",
     "url": "https://atriumhealth.org/medical-services/prevention-wellness/womens-health/maternity-services/lactation-services",
     "quote": "Our team of international board-certified lactation consultants provides specialized care to help you overcome obstacles, achieve your feeding goals ... Every Atrium Health hospital has providers trained in breastfeeding, and some have earned Baby-Friendly designation for meeting the highest standards of breastfeeding care."},
    {"claim": "Heart of Grace Birth Services founder Lindsay Stowers is a birth doula and childbirth educator serving Concord, Kannapolis, Charlotte, Mooresville, Harrisburg and surrounding NC communities",
     "url": "https://www.heartofgracebirth.com/",
     "quote": "As a birth doula and childbirth educator, I feel honored to be able to contribute my expertise to women and families in Concord, Kannapolis, Charlotte, Mooresville, Harrisburg, and other surrounding communities in North Carolina."},
    {"claim": "What The Bump is a team of certified birth and postpartum doulas serving Charlotte and surrounding communities including Concord, with Registered Nurses and former Labor & Delivery nurses on staff",
     "url": "https://whatthebumpclt.com/",
     "quote": "What The Bump is a team of certified birth and postpartum doulas serving Charlotte, NC and surrounding communities. Our experienced team includes Registered Nurses and former Labor & Delivery nurses who provide personalized, evidence-based support throughout pregnancy, birth, and the postpartum period."},
]

json.dump(d, open(p, 'w'), indent=2, ensure_ascii=False)
print('wrote contract, providers:', len(d['providers']), 'sources:', len(d['sources']))
