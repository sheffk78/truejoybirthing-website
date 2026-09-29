#!/usr/bin/env python3
"""dallas-tx enrichment: provider photos, hospital paragraph gaps, enrichedAt bump.
Per tjb-provider-enrichment skill: headshot > logo > initials fallback; hospital
paragraphs >=300 chars covering NICU level, beds, doula/visitor policy, baby-friendly,
lactation, language services, birthing rooms. All facts verified via hospital sources.
"""
import re, sys

PATH = 'src/data/cities.ts'
src = open(PATH, encoding='utf-8').read()

start = src.find('"dallas-tx": {')
end = src.find('"houston-tx": {')
assert start != -1 and end != -1 and start < end, 'city markers not found'
blk = src[start:end]

orig_len = len(blk)
changes = []

# --- 1. Provider photos (Delilah Ray headshot from cherishbirth.com/about;
#        Becky Hines headshot from dallasbirth.com team profile) ---
fixes = [
    ('{ name: "Delilah Ray", credential: "Certified Birth Doula", practice: "Cherish Birth", url: "https://doulamatch.net/profile/4145/delilah-ray", photo: ""',
     '{ name: "Delilah Ray", credential: "Certified Birth Doula", practice: "Cherish Birth", url: "https://doulamatch.net/profile/4145/delilah-ray", photo: "/images/provider-dallas-tx-delilah-ray.webp"'),
    ('{ name: "Becky Hines", credential: "LM, CPM, RYT", practice: "Dallas Birth", url: "https://dallasbirth.com/team/profiles/midwives/becky", photo: ""',
     '{ name: "Becky Hines", credential: "LM, CPM, RYT", practice: "Dallas Birth", url: "https://dallasbirth.com/team/profiles/midwives/becky", photo: "/images/provider-dallas-tx-becky-hines.webp"'),
]
for old, new in fixes:
    if old in blk:
        blk = blk.replace(old, new, 1)
        name = re.search(r'name: "([A-Za-z ]+)"', new)
        changes.append(f'photo set: {name.group(1) if name else "?"}')
    else:
        print(f'!! anchor not found: {old[:80]}')
        sys.exit(1)

# --- 2. Hospital paragraph enrichment (verified facts only) ---
P = {}
P['texas-health'] = (
    "Texas Health Presbyterian Hospital Dallas, at 8200 Walnut Hill Lane near NorthPark Center, is the flagship of the Texas Health system and one of Dallas's largest community teaching hospitals — an 888-bed, Level IV maternal care facility. It delivers thousands of babies each year at the Margot Perot Center for Women & Infants and features a Level III NICU staffed by neonatologists and neonatal nurses around the clock. The hospital has implemented the TeamBirth patient-centered care model, which puts the birthing person, their partner, nurses, and providers at the same table to make plans together. Certified nurse-midwives (CNMs) are on staff offering midwife-attended birth options, and doulas are welcome at mom's bedside as part of her care team — birth plans are actively encouraged. Labor and delivery has large private LDR rooms with twin fold-away beds for partners; during the Golden Hour only mom, baby, and one support person are in the room, and partners can stay overnight in the mother-baby unit's convertible-couch rooms. Certified lactation consultants are on hand seven days a week, and interpreters come at no cost in any language. Texas Health Dallas accepts Texas Medicaid for maternity care. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to get started."
)
P['baylor'] = (
    "Baylor University Medical Center, at 3500 Gaston Avenue in Dallas, is the flagship hospital of the Baylor Scott & White system and one of North Texas's premier centers for complex and high-risk maternity care — a 914-bed teaching hospital rated Best Hospitals for Maternity (highest rating) by U.S. News. The hospital offers a Level IV NICU with comprehensive neonatal services and a nationally recognized maternal-fetal medicine program for complicated pregnancies. Its New Family Center is all-private rooms with daybeds so a partner or support person can stay overnight, and the spacious delivery suites have room for partners, birth coaches, and doulas — labor coaches and doulas are explicitly welcome, with family-centered, baby-friendly birth practices and skin-to-skin/kangaroo care. Certified lactation consultants support breastfeeding during your stay, and the staffed Simply Mom's boutique offers private consultations after discharge. Interpreter services are free for patients whose preferred language isn't English. The hospital accepts Texas Medicaid. <a href='/birth-plan-template/'>Download Your Birth Plan template</a> to prepare."
)
P['parkland'] = (
    "Parkland Memorial Hospital, at 5200 Harry Hines Boulevard, handles one of the largest birth volumes in Texas — with delivery numbers in the tens of thousands each year — and is the safety-net hospital for all of Dallas County, licensed for 882 beds and expanding past 980 in 2026. Its Level III NICU is staffed by UT Southwestern neonatologists — the first Level III NICU in Dallas — providing some of the most advanced care for premature and critically ill newborns in the region. Parkland runs an active, established doula program that welcomes doulas as valued members of the birth team, and certified nurse-midwives and UT Southwestern physicians work side by side across low-risk and high-risk births in the WISH Tower's private labor/delivery/recovery suites, each with a spacious private bathroom and a fold-out couch for visitors. As a Baby-Friendly designated facility, it pushes skin-to-skin and breastfeeding support, and visiting hours run 5 a.m. to 9 p.m. Parkland offers 24/7 interpretation in more than 240 languages with on-staff Spanish translators, comprehensive lactation support, and accepts Texas Medicaid. <a href='/birth-plan-template/'>Use our free birth plan template</a> for your delivery."
)
P['medcity'] = (
    "Medical City Dallas, at 7777 Forest Lane near Central Expressway, is a full-service 934-bed north Dallas hospital and part of HCA Healthcare's Women's Hospital network, voted \"Best Hospital to Have a Baby\" by DFWChild readers five years running. It holds a Level IV NICU (the highest level, on the shared campus with Medical City Children's Hospital) plus a Level IV maternal designation from Texas DSHS and comprehensive maternal-fetal medicine at the Maternal Fetal Institute. The Women's Hospital labor and delivery unit provides spacious, hotel-like private birthing suites with Murphy beds for partners to stay overnight, quiet-time hours, 24/7 anesthesiology, and neonatologists on-site around the clock. Doulas are welcome on the labor floor and treated as part of the family's support team, with generous visiting hours after delivery. Lactation consultants help with breastfeeding in the hospital and after discharge through its Texas Ten Step Program recognition, and interpreter services are available for non-English-speaking families. Medical City is named a \"Birthing-Friendly\" hospital by U.S. News and accepts Texas Medicaid for qualifying families. <a href='/birth-plan-template/'>Grab the free birth plan template</a> before your tour."
)
P['methodist'] = (
    "Methodist Dallas Medical Center, at 1416 North Beckley Avenue, serves south and west Dallas families and is one of the region's most trusted community hospitals for maternity care — a 595-bed acute-care teaching hospital. It offers a Level III NICU and a full range of labor and delivery services, with a certified nurse-midwife (CNM) program that provides midwife-attended birth options for families who want a more personalized hospital experience. Methodist Dallas was the first hospital in Dallas designated Baby-Friendly by Baby-Friendly USA and holds Texas Ten Step recognition for breastfeeding care, backed by 24/7 lactation support and breastfeeding classes. The maternity unit includes private LDR suites, and doulas are welcome as part of the support team. Interpreter and sign-language services are available free of charge. For families in Oak Cliff, West Dallas, and south Dallas, Methodist provides a close, community-focused option with the safety net of a Level III NICU on site, and it accepts Texas Medicaid. <a href='/birth-plan-template/'>Use our free hospital birth plan template</a> to get ready."
)

paras = re.findall(r'(paragraph: ")([^"]*?)(?="[,}\n])', blk)
# map by preceding name
def replace_paras(block, mapping):
    out = block
    count = 0
    # Split at each hospital entry to identify which paragraph belongs to which
    for name, key in [
        ('Texas Health Presbyterian Hospital Dallas', 'texas-health'),
        ('Baylor University Medical Center', 'baylor'),
        ('Parkland Memorial Hospital', 'parkland'),
        ('Medical City Dallas', 'medcity'),
        ('Methodist Dallas Medical Center', 'methodist'),
    ]:
        pat = re.compile(
            r'(\{ name: "' + re.escape(name) + r'"[^}]*?paragraph: ")([^"]*?)(")',
            re.S)
        m = pat.search(out)
        if m:
            out = out[:m.start(2)] + mapping[key] + out[m.end(2):]
            count += 1
        else:
            print(f'!! paragraph anchor not found: {name}')
            sys.exit(1)
    return out, count

blk, npara = replace_paras(blk, P)
changes.append(f'hospital paragraphs enriched: {npara}')

# --- 3. enrichedAt bump ---
blk2 = re.sub(r'enrichedAt: "2026-08-08T07:30:00Z"', 'enrichedAt: "2026-09-28T17:45:00Z"', blk, count=1)
if blk2 != blk:
    changes.append('enrichedAt bumped to 2026-09-28')
    blk = blk2

new_src = src[:start] + blk + src[end:]
open(PATH, 'w', encoding='utf-8').write(new_src)

for c in changes:
    print('OK:', c)
print(f'block size {orig_len} -> {len(blk)}')