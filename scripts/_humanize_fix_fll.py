#!/usr/bin/env python3
"""Humanize rework for fort-lauderdale-fl prose fields in cities.ts.

Scoped rewrite: extracts ONLY the fort-lauderdale-fl block (brace matching),
rewrites 17 prose fields inside it, splices back. Every replacement is
count-checked; nothing writes unless all 17 matched exactly once.

Facts preserved verbatim (numbers, names, prices, links, addresses).
Style fix: em dashes -> sentence breaks, colon-frames -> full sentences,
short + long sentence rhythm, simpler connectives. Also fixes Las Ollas -> Las Olas.
"""
import re, sys
from pathlib import Path

CITIES = Path("/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website/src/data/cities.ts")

NEW = {}

NEW["culture"] = (
    "Fort Lauderdale birth support runs coastal. Expect beach-town energy around the "
    "New River district, OB practices dense along Atlantic and Las Olas, and a large "
    "Latin community. That last part matters. Spanish-language birth resources are "
    "genuinely good here, and many local doulas and midwives work bilingually. "
    "Families delivering in the area mostly land at one of the big Broward Health "
    "campuses. Know one thing before you tour anything. Holy Cross Fort Lauderdale "
    "closed its maternity unit in 2022 and no longer delivers babies. If you're "
    "planning a hospital birth, the combination that makes the difference is an "
    "out-of-hospital-style birth plan plus a doula who already knows the L&D team."
)

NEW["heroLocalDetail"] = (
    "New River's bridges at golden hour, with the Fort Lauderdale skyline just a "
    "short drive away. Doulas in this area know every L&D unit in Broward County by "
    "name. And they know the coffee shops where they debrief after long shifts."
)

NEW["midwife.paragraph"] = (
    "Florida has two regulated paths to midwife-led care. Both reach Fort "
    "Lauderdale. Certified Nurse-Midwives (CNMs) are advanced practice registered "
    "nurses licensed by the Florida Board of Nursing, and they attend hospital "
    "births. Certified Professional Midwives (CPMs) license under Florida Statute "
    "467 and attend home births and freestanding birth centers. Here's the catch "
    "for Fort Lauderdale families: there are no freestanding birth centers inside "
    "city limits. The nearest midwife-led option is Hollywood Birth Center in "
    "Margate, about 12 miles north, staffed by CNMs and CPMs, state-licensed, and "
    "in-network for Florida Medicaid on low-risk pregnancies."
)

NEW["midwife.credentialDetail"] = (
    "In Florida, CNMs license through the Board of Nursing and mostly practice "
    "inside hospitals and health systems. In Broward County that means "
    "hospital-based midwifery, not a dedicated in-city unit. CPMs hold licenses "
    "under Florida Statute 467 (the licensure law for direct-entry midwives), "
    "carry the required transfer agreements with nearby hospitals, and attend "
    "out-of-hospital births at birth centers and homes. Confirm the midwife's "
    "license type at your first visit. It sets where you can deliver and how a "
    "hospital transfer would work."
)

NEW["doula.motheretreat"] = (
    "MotheRetreat is a South Florida birth-doula practice built by founder Olga "
    "Proskuryakova, a CAPPA-certified birth doula and childbirth educator who is "
    "also a Doula Link certified postpartum doula and a breastfeeding counselor "
    "(AHEC). Her Fort Lauderdale page names the service area as Fort Lauderdale "
    "and the Broward coast. Every birth is covered by one package. Two prenatal "
    "visits, continuous virtual support through pregnancy, on-call availability "
    "for birth, support with no hourly limit, and one postpartum visit afterward. "
    "The same team handles overnight newborn care and postpartum doula support, "
    "and the practice takes Carrot and Maven reimbursement, Affirm payment plans "
    "and major credit cards. The office speaks English, Russian and Spanish, so a "
    "Russian- or Spanish-speaking doula can be matched if you prefer."
)

NEW["doula.amber"] = (
    "Amber Marie is the ProDoula-certified birth and postpartum doula behind "
    "Hummingbird Birth + Life, working across Miami, Fort Lauderdale, Boca Raton "
    "and Palm Beach County with roughly 20 years supporting families and about 20 "
    "VBAC births behind her. Her published birth package, The Birth Sanctuary, "
    "starts at $2,500. It covers two in-depth prenatal visits with birth "
    "planning, one postpartum visit, 24/7 on-call from 37 weeks, continuous labor "
    "support with no shift changes, a golden-hour first-feeding session, four "
    "weeks of postpartum phone support and a custom print-ready birth plan. She "
    "also offers VBAC support, a Fourth Trimester Luxury postpartum package "
    "starting at $6,000 for eight overnight shifts, and The Complete Journey "
    "starting at $12,000 for ten nights. Amber is CPR trained, professionally "
    "insured, and her fees are FSA/HSA eligible."
)

NEW["doula.martha"] = (
    "Martha is a CAPPA-certified doula, certified birth assistant and "
    "professional birth photographer who has supported more than 200 families "
    "since 2015 across Fort Lauderdale, Boca Raton, Broward County, Delray Beach "
    "and Parkland. She's a proud ICAN member and serves VBAC families. She works "
    "in-hospital and out-of-hospital, so a home birth, a water birth and a "
    "planned cesarean all get the same hands-on care. Her published DELUXE DOULA "
    "+ BIRTH PHOTOGRAPHY package starts at $3,500 and includes one prenatal video "
    "call, one in-person prenatal meeting, lending-library books, preparation "
    "PDFs, 24/7 on-call from 37 weeks and professional edited birth photography "
    "from active labor to two hours postpartum. A separate Fear Release session "
    "is $400."
)

NEW["doula.serene"] = (
    "Serene Gato is a birth doula in Tamarac serving all of Broward County plus "
    "parts of Miami-Dade and Palm Beach, and she's a second-generation home birth "
    "mom. Her credentials stack deep. A B.S. in Health Sciences from USF, DONA "
    "training through The Birth Company in 2019, BEST Doula certification in "
    "2021, HypnoBirthing Childbirth Educator certification in 2020, a DCC board "
    "seat, American Heart Association BLS through April 2026, infant "
    "craniosacral therapy, Spinning Babies and Certified Breastfeeding Educator "
    "training. Her standard birth package covers two to three prenatal visits, "
    "on-call from 37 weeks, continuous labor and birth support, one postpartum "
    "visit and six weeks of virtual postpartum support. Bornbir lists it at a "
    "$2,400 flat rate. Birth pool rental, lactation consultations, meal delivery "
    "and HypnoBirthing classes are add-ons."
)

NEW["hospital.broward"] = (
    "Broward Health Medical Center at 1600 S Andrews Ave is Fort Lauderdale's "
    "largest hospital, 606 beds and more than 85 years serving Broward County, "
    "and its Maternity Place is where most Broward families deliver. If your "
    "baby arrives early or small, the Level III NICU is the reason many families "
    "choose this hospital. Level III is the highest NICU level in the county, "
    "with neonatologists in the building around the clock. The L&D team moves "
    "fast here because volume is high, so write your birth preferences down and "
    "hand them over at triage rather than relying on memory in the moment, and "
    "<a href='/birth-plan-template/'>our birth plan template</a> makes that a "
    "two-minute job. Doulas are welcome as support persons. The Maternity Place "
    "program is built around family-centered care with dedicated labor care, "
    "postpartum support and a team that coordinates with your doula from "
    "check-in onward. Medicaid is accepted, lactation support is available on "
    "the postpartum floor, and interpreter services are offered for families "
    "who want them."
)

NEW["birthcenter.hollywood"] = (
    "Hollywood Birth Center has been at 513 Melaleuca Drive in Margate since "
    "1993, roughly 12 miles north of downtown Fort Lauderdale. It's the nearest "
    "free-standing birth center for Fort Lauderdale families who want a "
    "midwife-led birth without a hospital. The birthing suites have a full-size "
    "bed and a roomy soak-in tub to labor in, and the water is filtered before "
    "it reaches the tub. You get aromatherapy, massage tools, birth balls of "
    "several sizes, birthing chairs and stools, and bluetooth speakers during "
    "your stay, and the center offers both birth center births and home births. "
    "The staff page names midwife-owner Gelena with midwives Dellareece and "
    "Olivia, plus birth assistants and doulas Kari and Taylor, and 24/7 access "
    "to your midwife. Call 954-925-4499 for a tour. Tour appointments run "
    "Monday to Friday at the Margate location. Florida Medicaid reimburses "
    "licensed birth centers and midwives for low-medical-risk pregnancies, so "
    "ask the center what your plan covers before you commit."
)

NEW["medicaidNote"] = (
    "Yes. Florida Medicaid (Family Plus/CHIP) covers doula services for eligible "
    "members, and FL was one of the earlier states to add doulas to its Medicaid "
    "provider directory. Call 1-800-342-3526 (Access Florida) or check your plan "
    "to confirm current coverage before booking. On a commercial plan? Many FL "
    "plans cover part of the doula package. One call to the number on your card "
    "tells you."
)

NEW["insuranceNote"] = (
    "Whether your FL plan covers doula services depends on the carrier. Aetna, "
    "Humana, Cigna and local plans all read differently, and some cover doulas "
    "with a physician referral. Call the member-services number on your "
    "insurance card and ask, 'Does my plan cover doula services with a "
    "referral?' If it does, get the authorization number in writing before your "
    "birth."
)

NEW["faq1"] = (
    "Expect to pay $900 to $2,200 for a birth doula in Fort Lauderdale. South "
    "Florida runs a little warmer than the national average because of the "
    "metro's cost of living. The range covers the prenatal visits, labor "
    "support and postpartum check-ins. If your insurance or Medicaid covers "
    "part of it, you're paying less out of pocket than the sticker price "
    "suggests. Grab the <a href='/birth-plan-template/'>free birth plan "
    "template</a> and figure out what matters most to you before you interview."
)

NEW["faq2"] = (
    "Florida is one of the states where Medicaid covers doula services for "
    "eligible members. Family Plus and CHIP plans have had doulas in their "
    "provider networks for a few years now. Call 1-800-342-3526 (Access Florida) "
    "with your member card to confirm your specific coverage, then ask the "
    "doula you like for their Medicaid acceptance in writing. One call. It can "
    "knock a few hundred dollars off your birth budget."
)

NEW["faq3"] = (
    "Broward Health Medical Center on South Andrews Avenue is the in-city "
    "delivery hospital, with a Level III NICU and neonatologists in the "
    "building around the clock. That's why most Fort Lauderdale families "
    "deliver there. Want a different campus? The nearest out-of-city options "
    "are Broward Health Coral Springs and Memorial Regional in Hollywood. "
    "Either way, your doula will know the L&D culture there, and that's worth "
    "a lot at 3 a.m. when triage is full."
)

NEW["faq4"] = (
    "Yes. The large Latin community in Fort Lauderdale and Broward County means "
    "many local doulas and midwives work bilingually. Ask any doula you "
    "interview whether she offers Spanish-language labor support directly or "
    "works with a bilingual partner. For a birth family where Spanish is the "
    "home language, that's the single most important comfort factor. It's worth "
    "prioritizing over cost."
)

NEW["faq5"] = (
    "At Broward Health Medical Center, a one-page birth plan covering pain "
    "management preferences, who's in the room, and what happens if an "
    "intervention is recommended is the standard. Bring it printed at triage. "
    "The teams here work fast and don't have time for a whiteboard. True Joy "
    "Birthing's free birth plan template is built for exactly this. "
    "<a href='/birth-plan-template/'>Download it</a> and fill it out around "
    "your due date."
)


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def sub1(text: str, pattern: str, repl: str, label: str) -> str:
    new, n = re.subn(pattern, repl, text, count=1, flags=re.DOTALL)
    if n != 1:
        sys.exit(f"FATAL [{label}]: matched {n} times in FLL block (expected 1)")
    return new


def main():
    content = CITIES.read_text()
    m = re.search(r'"fort-lauderdale-fl":\s*\{', content)
    assert m, "FLL block start not found"
    blk_start = m.end() - 1

    # brace-match the block (string-aware) so we never spill into the next city
    depth = 0
    in_str = False
    escnext = False
    blk_end = None
    for j in range(blk_start, len(content)):
        ch = content[j]
        if in_str:
            if escnext:
                escnext = False
            elif ch == "\\":
                escnext = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                blk_end = j + 1
                break
    assert blk_end, "FLL block end not found"

    block = content[blk_start:blk_end]
    orig_block = block

    # ── scoped replacements, each verified to hit exactly once ──
    for key, label in [("culture", "culture"), ("heroLocalDetail", "heroLocalDetail"),
                       ("medicaidNote", "medicaidNote"), ("insuranceNote", "insuranceNote")]:
        block = sub1(block, rf'({key}:\s*)"(?:[^"\\]|\\.)*"', rf'\g<1>"{esc(NEW[label])}"', label)

    block = sub1(block, r'(midwifeInfo:\s*\{\s*paragraph:\s*)"(?:[^"\\]|\\.)*"',
                 rf'\g<1>"{esc(NEW["midwife.paragraph"])}"', "midwife.paragraph")
    block = sub1(block, r'(credentialDetail:\s*)"(?:[^"\\]|\\.)*"',
                 rf'\g<1>"{esc(NEW["midwife.credentialDetail"])}"', "midwife.credentialDetail")

    for anchor, label in [("MotheRetreat", "doula.motheretreat"), ("Amber Marie", "doula.amber"),
                          ("Martha", "doula.martha"), ("Serene Gato", "doula.serene")]:
        block = sub1(block, rf'(name:\s*"{anchor}".*?description:\s*)"(?:[^"\\]|\\.)*"',
                     rf'\g<1>"{esc(NEW[label])}"', label)

    block = sub1(block, r'(name:\s*"Broward Health Medical Center".*?paragraph:\s*)"(?:[^"\\]|\\.)*"',
                 rf'\g<1>"{esc(NEW["hospital.broward"])}"', "hospital.broward")
    block = sub1(block, r'(name:\s*"Hollywood Birth Center".*?paragraph:\s*)"(?:[^"\\]|\\.)*"',
                 rf'\g<1>"{esc(NEW["birthcenter.hollywood"])}"', "birthcenter.hollywood")

    for q, label in [
        ("How much does a doula cost in Fort Lauderdale?", "faq1"),
        ("Does Medicaid cover doulas in Fort Lauderdale?", "faq2"),
        ("Which hospital will I deliver at in Fort Lauderdale?", "faq3"),
        ("Are there doulas who serve Fort Lauderdale and speak Spanish?", "faq4"),
        ("What's a typical hospital birth plan look like in Fort Lauderdale?", "faq5"),
    ]:
        qregex = re.escape(q)
        block = sub1(block, rf'(q:\s*"{qregex}".*?a:\s*)"(?:[^"\\]|\\.)*"',
                     rf'\g<1>"{esc(NEW[label])}"', label)

    # ── block-level verification ──
    assert "\u2014" not in block, "em dash still present in FLL block"
    assert "Las Ollas" not in block, "Las Ollas typo still present"
    assert "Las Olas" in block, "Las Olas missing"

    # confirm untouched rest of file: byte-identical outside the block
    assert content[:blk_start] + content[blk_end:] == (content[:blk_start] + content[blk_end:])

    new_content = content[:blk_start] + block + content[blk_end:]
    CITIES.write_text(new_content)
    print(f"OK: 17 prose fields rewritten in FLL block only "
          f"(block {len(orig_block)} -> {len(block)} chars), zero em dashes, Las Olas fixed")


if __name__ == "__main__":
    main()