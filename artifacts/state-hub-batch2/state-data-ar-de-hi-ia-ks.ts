// StateData enrichment entries for the 15 new state hubs (batch 2).
// This file is a staging file — entries get merged into src/data/states.ts.
// Sources: Prenatal-to-3 Policy Impact Center State Policy Roadmap 2025 (doula Medicaid),
// CDC NCHS VSRR-035 Table 4 (cesarean/preterm 2023), March of Dimes, state Medicaid sites.
// Written 2026-09-28.

export const newStateData: Record<string, any> = {
  AR: {
    state: "AR",
    stateName: "Arkansas",
    medicaidNarrative:
      "Yes, as of 2026. Arkansas Act 140 of 2025 directed Arkansas Medicaid to begin reimbursing doula services under the ARHOME program, making Arkansas one of the states that moved from legislation to actual payment. Doulas enroll as Arkansas Medicaid providers and bill for prenatal, labor, and postpartum visits, with a bundled birth support rate set by the program. Medicaid pays for roughly half of all Arkansas births, so the benefit reaches deep into the Delta and the rural Ozarks where maternal outcomes are worst. Enrollment opened in phases during 2025, and the Arkansas Department of Human Services maintains the enrolled-doula list, so call before you book to confirm your doula is Medicaid-enrolled. Community-based doula programs in Little Rock and Pine Bluff were the first to enroll. Medicaid also covers certified nurse-midwife care at participating hospitals and freestanding birth centers.",
    doulaRegulations:
      "Arkansas does not require doulas to hold a state-issued license. Doulas are not regulated as medical professionals under Arkansas law; voluntary certification from DONA International, CAPPA, or a comparable organization is the norm and is what Medicaid enrollment expects for training documentation. Act 140 of 2025 set the Medicaid doula provider criteria, including approved training and a core-competencies attestation, but stopped short of a licensure board. Arkansas licenses Certified Nurse Midwives through the Arkansas State Board of Nursing, and CNMs have prescriptive authority. Certified Professional Midwives are licensed through the Arkansas Health Department under the Direct-Entry Midwife rules adopted in 2015, one of the earlier CPM licensure laws in the South, which keeps legal home birth and licensed birth centers on the table statewide.",
    birthStats: {
      cesareanRate: 34.4,
      maternalMortalityRate: 41.6,
      homeBirthRate: 1.6,
      birthCenterBirthRate: 0.3,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; Prenatal-to-3 Policy Impact Center",
    },
    faq: [
      {
        question: "Does Arkansas Medicaid cover doula services?",
        answer:
          "Yes. Act 140 of 2025 put doula coverage into Arkansas Medicaid under the ARHOME program, and doulas began enrolling as providers during 2025. Medicaid pays for about half of Arkansas births, so the benefit matters most in the Delta and rural Ozarks. Confirm your doula is on the Arkansas Medicaid enrolled-provider list before your birth window opens.",
      },
      {
        question: "Do I need a license to practice as a doula in Arkansas?",
        answer:
          "No. Arkansas does not license doulas. Working doulas typically carry voluntary certification from DONA International, CAPPA, or similar programs, and Medicaid-enrolled doulas document training under Act 140's enrollment criteria. There is no state doula board.",
      },
      {
        question: "What is the cesarean rate in Arkansas?",
        answer:
          "Arkansas' cesarean rate was 34.4 percent in 2023 (CDC NCHS), meaning roughly one in three hospital births is surgical. That is above the 32.3 percent national average and well above the World Health Organization's recommended range. The low-risk cesarean rate has been climbing too. Ask any hospital you tour for its current rate.",
      },
      {
        question: "Can I have a home birth in Arkansas?",
        answer:
          "Yes. Arkansas licenses Certified Professional Midwives as Direct-Entry Midwives through the Department of Health, and several licensed birth centers operate in the state. Home birth packages typically run $3,500 to $6,500, and licensed CPMs can carry emergency medication and follow transfer protocols with area hospitals.",
      },
      {
        question: "What is the maternal mortality rate in Arkansas?",
        answer:
          "Arkansas' maternal mortality rate was 41.6 deaths per 100,000 live births in KFF's most recent five-year estimate, among the highest in the nation and nearly triple the Healthy People 2030 target. The state's Maternal Mortality Review Committee attributes most deaths to preventable causes, which is a large part of why doula legislation moved in 2025.",
      },
      {
        question: "Does Arkansas Medicaid extend postpartum coverage?",
        answer:
          "Yes. Arkansas extended Medicaid postpartum coverage to 12 months, and the ARHOME expansion overall brought coverage to more low-income Arkansans. If you deliver on Medicaid, your coverage now continues for a full year, which pairs well with doula postpartum visits.",
      },
    ],
  },
  DE: {
    state: "DE",
    stateName: "Delaware",
    medicaidNarrative:
      "Yes. Delaware Medicaid covers doula services as a covered benefit after the Division of Medicaid and Medical Assistance added community-based doulas during the 2023-2024 rollout, following the recommendation of the Delaware Maternal Mortality Review Committee and work led by the Delaware Healthy Mothers and Infants Consortium. Enrolled doulas bill Delaware Medicaid directly for prenatal, labor, and postpartum visits. With roughly 11,000 births a year concentrated in New Castle County, the benefit reaches Wilmington families first, and the state has been working to grow the downstate network. Delaware Medicaid also covers certified nurse-midwife care at ChristianaCare and Bayhealth hospitals, and 12-month postpartum coverage is in place.",
    doulaRegulations:
      "Delaware does not license doulas. The state treats doula work as non-clinical support, and Medicaid enrollment instead relies on training verification and a background check through the Division of Medicaid and Medical Assistance. Most Delaware doulas certify through DONA International,CAPPA, or ProDoula. Delaware licenses Certified Nurse Midwives through the Board of Nursing with full independent practice authority, and the Board of Examiners of Certified Nurse Midwives manages discipline. Delaware also licenses Certified Professional Midwives through its Board of Midwifery, which regulates both CNMs and CPMs, giving the state one of the cleaner two-track midwifery systems in the Mid-Atlantic. The Birth Center in Wilmington operates under Delaware's free-standing birth center regulations.",
    birthStats: {
      cesareanRate: 33.6,
      maternalMortalityRate: null,
      homeBirthRate: 1.1,
      birthCenterBirthRate: 0.4,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; Prenatal-to-3 Policy Impact Center",
    },
    faq: [
      {
        question: "Does Delaware Medicaid cover doula services?",
        answer:
          "Yes. Delaware Medicaid added doula services as a covered benefit, with enrolled doulas billing for prenatal, labor, and postpartum support after the 2023-2024 rollout. Call the Medicaidassistance line or ask your doula to confirm they are enrolled before signing a contract.",
      },
      {
        question: "Are there freestanding birth centers in Delaware?",
        answer:
          "Yes. The Birth Center in Wilmington is Delaware's main freestanding option, run by certified nurse-midwives under the state's free-standing birth center regulations. Most out-of-hospital births in Delaware happen there or at home with a Delaware-licensed midwife.",
      },
      {
        question: "Can midwives practice independently in Delaware?",
        answer:
          "Yes. Delaware gives certified nurse-midwives independent practice authority, one of the few states to do so, and licenses Certified Professional Midwives through the Board of Midwifery. You can plan a home birth or birth center birth with a legally licensed Delaware midwife without an OB sign-off requirement.",
      },
      {
        question: "What is the cesarean rate in Delaware?",
        answer:
          "Delaware's 2023 cesarean rate was 33.6 percent (CDC NCHS), close to the 32.3 percent national average. Rates vary sharply between ChristianaCare facilities in New Castle County and downstate hospitals like Beebe and Nanticoke, so ask for current numbers during a prenatal tour.",
      },
      {
        question: "Do Delaware doulas need certification?",
        answer:
          "Delaware does not require a state doula license. To enroll with Delaware Medicaid, doulas complete an approved training and background check; private-practice doulas usually certify through DONA, CAPPA, or ProDoula. Ask any doula you interview about their training and client experience.",
      },
    ],
  },
  HI: {
    state: "HI",
    stateName: "Hawaii",
    medicaidNarrative:
      "Yes. Hawaii Medicaid (Quest Integration) covers doula services as a preventive maternity benefit, one of the earlier statewide rollouts in the country, with enrolled doulas billing Med-QUEST plans for prenatal, birth, and postpartum support. Because Hawaii pays for more than half of all births through Medicaid and has the highest share of any state born outside the hospital system, the doula benefit is a natural fit: midwives and doulas already form the backbone of care on the Neighbor Islands, where hospital distance shapes birth plans. Kaiser Permanente, 'Ohana Health Plan, and the other QUEST managed care plans each maintain their own doula networks, so confirm coverage with your plan. Hawai'i also extended Medicaid postpartum coverage to 12 months.",
    doulaRegulations:
      "Hawaii does not license doulas. Doulas practice as trained, non-clinical support providers; Medicaid enrollment runs through the Med-QUEST plans, each of which sets its own training and documentation requirements. Midwifery regulation changed sharply in recent decades: after a 2019 repeal, Act 192 of 2023 restored a legal pathway for out-of-hospital midwifery by creating a licensed midwife designation under the Department of Commerce and Consumer Affairs, and Hawaii licenses both certified nurse-midwives (through the Board of Nursing, as APRNs) and direct-entry midwives. Traditional Hawaiian midwifery and ko'ko' (cultural birth practices) remain an important part of the community birth scene, and birth centers are licensed through the Department of Health under the adult residential care/home birth facility rules.",
    birthStats: {
      cesareanRate: 29.2,
      maternalMortalityRate: null,
      homeBirthRate: 2.7,
      birthCenterBirthRate: 0.6,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System",
    },
    faq: [
      {
        question: "Does Hawaii Medicaid cover doula services?",
        answer:
          "Yes. Hawaii's Med-QUEST program covers doulas as part of maternity support services, and managed care plans enroll doulas to provide prenatal, labor, and postpartum care. Contact your QUEST plan for its in-network doula list.",
      },
      {
        question: "Why does Hawaii have such a high home birth rate?",
        answer:
          "Hawaii's home birth rate runs near 2.7 percent, roughly double the national figure. Island geography, long hospital distances on the Neighbor Islands, strong midwifery and traditional Hawaiian birth traditions, and a large licensed-midwife community all push births outside hospitals, especially on the Big Island and Kaua'i.",
      },
      {
        question: "Is home birth legal and regulated in Hawaii?",
        answer:
          "Yes. After a complicated stretch of legal back-and-forth, Act 192 of 2023 restored a licensing pathway for direct-entry midwives, so families can choose a licensed midwife for home birth or a birth center birth, in addition to certified nurse-midwives who practice as APRNs. Ask any midwife you interview about her current license.",
      },
      {
        question: "What is the cesarean rate in Hawaii?",
        answer:
          "Hawaii's cesarean rate was 29.2 percent in 2023 (CDC NCHS), below the 32.3 percent national average. Kapi'olani Medical Center for Women & Children in Honolulu handles the state's highest-risk births, while Neighbor Island hospitals refer out complicated cases, which also keeps the surgical rate comparatively moderate.",
      },
      {
        question: "Which Hawaii hospitals deliver babies?",
        answer:
          "Kapi'olani Medical Center for Women & Children in Honolulu is the state's tertiary maternity hospital, delivering more than 6,000 babies a year, and is joined by Castle Medical Center, Kaiser Moanalua (all O'ahu); Maui Memorial on Maui; Hilo Benioff and Kona Community on the Big Island; Wilcox on Kaua'i; and Moloka'i General, plus Tripler Army Medical Center. The Neighbor Islands have no freestanding birth centers, so out-of-hospital birth is mostly home birth with licensed midwives.",
      },
    ],
  },
  IA: {
    state: "IA",
    stateName: "Iowa",
    medicaidNarrative:
      "Yes. Iowa Medicaid covers doula services under the coverage authorized by Senate File 132 (2024) and implemented by Iowa Health and Human Services during 2025, making Iowa the first Midwest state in this batch to move from passage to payment. Enrolled doulas bill Iowa Medicaid Totals for prenatal, labor, and postpartum services. That matters in a state where Medicaid covers more than 40 percent of births, where 74 of 99 counties are maternity care deserts, and where rural hospital labor-and-delivery units keep closing. Community organizations in Des Moines, Waterloo, and Davenport were first to build Medicaid doula rosters. Iowa Medicaid also covers certified nurse-midwife services, and postpartum coverage runs the full 12 months.",
    doulaRegulations:
      "Iowa does not license doulas. Doulas practice as trained non-clinical providers; for Medicaid billing, Iowa HHS requires an approved training certificate and enrollment, a lighter touch than neighboring Illinois' full certification regime. Midwifery regulation is newer: House File 265 (2023) created Iowa Code chapter 148I, licensing certified professional midwives through the Iowa Board of Nursing for the first time, and the Board adopted the implementing rules in 2024. Certified nurse-midwives, on the other hand, have practiced in Iowa hospitals for decades under the Board of Nursing as APRNs. Iowa's birthing centers operate under state licensure rules, though the state has few: after decades of closures, only a handful of freestanding centers remain, so most out-of-hospital births are planned home births with licensed midwives.",
    birthStats: {
      cesareanRate: 30.8,
      maternalMortalityRate: 24.3,
      homeBirthRate: 2.2,
      birthCenterBirthRate: 0.3,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; Prenatal-to-3 Policy Impact Center",
    },
    faq: [
      {
        question: "Does Iowa Medicaid cover doula services?",
        answer:
          "Yes. Senate File 132 authorized doula coverage and Iowa HHS implemented Medicaid doula reimbursement during 2025, with enrolled doulas billing for prenatal, birth, and postpartum visits. Ask your Iowa Medicaid managed care organization for in-network doulas.",
      },
      {
        question: "Are Certified Professional Midwives legal in Iowa?",
        answer:
          "Yes, now clearly so. House File 265 (2023) created Iowa Code chapter 148I and made Iowa license CPMs through the Board of Nursing, replacing an earlier voluntary-registry era. The licensing rules took effect in 2024, so you can hire a state-licensed midwife for home birth anywhere in Iowa.",
      },
      {
        question: "What is the cesarean rate in Iowa?",
        answer:
          "Iowa's cesarean rate was about 30.8 percent in 2023 (CDC NCHS), under the national average of 32.3 percent. Rural Iowa hospitals with smaller OB services often have lower surgical rates than metro referral centers, so it is worth asking each facility you consider.",
      },
      {
        question: "How common are maternity care deserts in Iowa?",
        answer:
          "March of Dimes counts roughly three-quarters of Iowa's 99 counties as maternity care deserts with no birthing facility and no OB clinician. Rural L&D units have closed steadily, which is why Iowa Medicaid added the doula benefit and why hospital birth often means a longer drive than it did a decade ago.",
      },
      {
        question: "Are there freestanding birth centers in Iowa?",
        answer:
          "A few, and shrinking. Willow Center in Iowa City is the newest entry; historically Iowa had centers in Des Moines and the Corridor, but several closed over the past decade. Most out-of-hospital birth in Iowa happens at home with an Iowa-licensed CPM. Ask centers about CABC accreditation and Medicaid enrollment.",
      },
    ],
  },
  KS: {
    state: "KS",
    stateName: "Kansas",
    medicaidNarrative:
      "Yes. Kansas Medicaid (KanCare) began reimbursing doulas on July 1, 2024, after the 2023 legislature directed coverage, and the three KanCare managed care organizations (Sunflower, UnitedHealthcare Community Plan, and Kansas Complete Health) each maintain enrolled doula networks. That first-in-the-region date pairs well with Kansas' strong birth-center sector: the state licenses freestanding birth centers and Medicaid covers CNM care there and in hospitals. Medicaid pays for roughly a third of Kansas births, with the benefit mattering most in Wichita, Kansas City, and the rural counties that have lost OB units. Kansas extended postpartum Medicaid to 12 months in 2025.",
    doulaRegulations:
      "Kansas does not license doulas. For KanCare billing, doulas complete an approved training and enroll with the state and their managed care plan; the requirements are set administratively by the Department of Health and Environment rather than by statute. Midwifery is two-track: certified nurse-midwives are regulated by the Kansas Board of Nursing with a formal collaborative-practice structure, and direct-entry midwives (typically CPMs) are licensed through the Kansas Board of Healing Arts under the 2012 licensure law, which requires specific educational credentials and an exam. Kansas has licensed freestanding birth centers since the 1990s and has an unusually strong birth-center culture for a Plains state, with centers in Wichita, Kansas City, Topeka, and Lawrence serving low-risk families across eastern Kansas.",
    birthStats: {
      cesareanRate: 32.2,
      maternalMortalityRate: 27.6,
      homeBirthRate: 2.0,
      birthCenterBirthRate: 0.7,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; Prenatal-to-3 Policy Impact Center",
    },
    faq: [
      {
        question: "Does Kansas Medicaid cover doula services?",
        answer:
          "Yes. KanCare began paying for doulas on July 1, 2024, after legislative direction in 2023. Sunflower Health Plan, UnitedHealthcare Community Plan, and Kansas Complete Health each enroll doulas, so ask your plan for its network list or check whether a specific doula is enrolled.",
      },
      {
        question: "Are birth centers licensed in Kansas?",
        answer:
          "Yes. Kansas has licensed freestanding birth centers for decades, and the state's birth-center sector is one of the strongest in the Plains, with midwife-led centers in Wichita, Kansas City, Topeka, and Lawrence. Many accept Medicaid now that doula and birth-center coverage are both in place.",
      },
      {
        question: "Can a Certified Professional Midwife attend my home birth in Kansas?",
        answer:
          "Yes. Kansas licenses direct-entry midwives through the Board of Healing Arts under a 2012 law, so home birth with a state-licensed midwife is legal statewide. Certified nurse-midwives, licensed by the Board of Nursing, work in hospitals and birth centers under a collaborative-practice arrangement.",
      },
      {
        question: "What is the cesarean rate in Kansas?",
        answer:
          "Kansas' cesarean rate was about 32.2 percent in 2023 (CDC NCHS), right at the national average. Birth-center and home-birth families tend to have much lower surgical rates, which is worth discussing with your provider if a vaginal birth after cesarean or a low-intervention birth is your goal.",
      },
      {
        question: "Where are Kansas' biggest birthing hospitals?",
        answer:
          "Wesley Medical Center and Ascension Via Christi in Wichita, Overland Park Regional and AdventHealth Shawnee Mission in the Kansas City metro, Stormont Vail in Topeka, and University of Kansas Hospital in Kansas City deliver most of the state's babies. Most have private L&D suites, and several have CNM hospital practices.",
      },
    ],
  },
};