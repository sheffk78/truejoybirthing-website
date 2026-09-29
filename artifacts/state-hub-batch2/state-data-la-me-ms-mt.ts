// StateData enrichment entries for the 15 new state hubs (batch 2), part 2:
// LA, ME, MS, MT, ND. Same sources as part 1. Written 2026-09-28.

export const newStateDataPart2: Record<string, any> = {
  LA: {
    state: "LA",
    stateName: "Louisiana",
    medicaidNarrative:
      "Yes. Louisiana Medicaid began reimbursing certified doulas in 2023 under a benefit the Department of Health built out after the 2021 Maternal Mortality Review report, and the state now maintains a enrolled-doula roster through Healthy Louisiana managed care plans. Medicaid pays for well over half of Louisiana births, among the highest shares in the country, so the doula benefit reaches New Orleans, Baton Rouge, Shreveport, and the rural parishes in between. Enrollment requires an approved training plus a Louisiana-specific orientation on maternal health disparities. Bayou doula collectives in New Orleans and Monroe's community programs were early Medicaid enrollees. Louisiana also covers doula support postpartum and extended Medicaid coverage to a full 12 months, which pairs with the state's Sudden Infant Death and maternal-warning-signs campaigns.",
    doulaRegulations:
      "Louisiana does not license doulas. The Louisiana Department of Health's Bureau of Health Services Financing sets doula Medicaid enrollment rules administratively: approved training (DONA, CAPPA, or ICTC are common), CPR, and a background check, but no state board. Midwifery runs on two tracks. Certified nurse-midwives are licensed by the Louisiana State Board of Nursing and practice in hospital systems like Ochsner and Woman's Hospital. Direct-entry midwives are licensed by the Louisiana Law Institute-managed Midwife Advisory Board through the Department of Health, after a 2016 re-licensing law replaced the prior permit system. Louisiana licenses freestanding birth centers under Chapter 67 of Title 48's health standards, and the first CABC-accredited centers opened in Lafayette and New Orleans.",
    birthStats: {
      cesareanRate: 38.9,
      maternalMortalityRate: 44.8,
      homeBirthRate: 0.9,
      birthCenterBirthRate: 0.2,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; Prenatal-to-3 Policy Impact Center",
    },
    faq: [
      {
        question: "Does Louisiana Medicaid cover doula services?",
        answer:
          "Yes. Louisiana Medicaid began reimbursing doulas in 2023 after the state built the benefit on top of its Healthy Louisiana managed care structure. Enrolled doulas bill through the plans for prenatal, labor, and postpartum support. Confirm your doula appears on a plan's roster before signing.",
      },
      {
        question: "Why are cesarean rates so high in Louisiana?",
        answer:
          "Louisiana's 2023 cesarean rate was 38.9 percent (CDC NCHS), more than six points above the national average. High rates of pre-existing maternal conditions, hospital-level variation across systems, and low VBAC availability all contribute. Birth-center and home-birth families typically see much lower surgical rates.",
      },
      {
        question: "Can I have a home birth in Louisiana?",
        answer:
          "Yes. Louisiana licenses direct-entry midwives through the Department of Health, and home birth is legal statewide, though the out-of-hospital share of births is below 1 percent, one of the lowest rates in the nation. Licensed birthing centers in Lafayette, New Orleans, and Baton Rouge are the other non-hospital path.",
      },
      {
        question: "What is the maternal mortality rate in Louisiana?",
        answer:
          "Louisiana's maternal mortality rate runs around 44.8 deaths per 100,000 live births (recent five-year estimate), among the highest in the nation. The state's Maternal Mortality Review Committee estimates most deaths are preventable, which drove the 2023 doula benefit and the perinatal quality collaborative's push for safer hospital births.",
      },
      {
        question: "Which Louisiana hospitals are strongest for maternity care?",
        answer:
          "Ochsner Baptist — A Campus of Ochsner Medical Center and University Medical Center New Orleans handle the highest-risk births in the metro, Woman's Hospital in Baton Rouge is one of the largest dedicated maternity hospitals in the country, and Ochsner Lafayette General plus CHRISTUS Shreveport Bossier anchor the rest of the state. Many offer private L&D suites and CNM hospital practices.",
      },
    ],
  },
  ME: {
    state: "ME",
    stateName: "Maine",
    medicaidNarrative:
      "Yes. MaineCare reimburses doula services under a benefit Maine's Department of Health and Human Services adopted in 2024, the same year the Legislature created a Birth Support Fund to pay doulas for families who fall through coverage gaps. Maine Medicaid (MaineCare) covers about a third of births, and the benefit is designed for the state's rural reality: with most of the population outside Portland and Bangor, enrolled doulas can travel to small hospitals or attend planned home births that MaineCare covers alongside CNM and licensed midwife care. Maine's freestanding birth centers and home birth sector are unusually strong for New England, and the Maine Birth Center in Scarborough works with MaineCare families.",
    doulaRegulations:
      "Maine does not license doulas. The 2024 doula framework runs through MaineCare enrollment: approved training plus credentialing on the state side, with practice defined as non-clinical support. Midwifery is two-track and unusually explicit. Certified nurse-midwives are licensed by the Maine State Board of Nursing as APRNs with independent practice authority, and Maine has licensed direct-entry midwives since 1978 under the Board of Complementary Health Care Providers, making it one of the earliest CPM licensure states. Maine also licenses birth centers through the Department of Health and Human Services. Home birth rates in Maine are among the highest in the nation, and the state's Midwives Association tracks licensure and complaint processes.",
    birthStats: {
      cesareanRate: 30.4,
      maternalMortalityRate: null,
      homeBirthRate: 3.4,
      birthCenterBirthRate: 1.2,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System",
    },
    faq: [
      {
        question: "Does Maine Medicaid cover doula services?",
        answer:
          "Yes. MaineCare adopted a doula benefit in 2024, and the Legislature simultaneously created a Birth Support Fund to pay doulas for families who don't qualify for MaineCare coverage. Enrolled doulas bill MaineCare for prenatal, labor, and postpartum visits.",
      },
      {
        question: "Why is home birth so common in Maine?",
        answer:
          "Maine's home birth rate runs around 3.4 percent, among the top states in the country. Rural distances, a strong licensed-midwife tradition dating to the earliest CPM licensure laws, and the state's high birth-center rate all shape the choice. Maine's home birth share is roughly triple the national average.",
      },
      {
        question: "Which midwife credentials does Maine license?",
        answer:
          "Both tracks. Maine licenses certified nurse-midwives as APRNs through the Board of Nursing with independent practice, and licenses direct-entry midwives (typically CPMs) through the Board of Complementary Health Care Providers, one of the longest-running licensure systems in the country. Ask any midwife you interview to confirm her current Maine license.",
      },
      {
        question: "What is the cesarean rate in Maine?",
        answer:
          "Maine's 2023 cesarean rate was about 30.4 percent (CDC NCHS), below the national average of 32.3 percent and far below the Southern states. Northern Light Eastern Maine Medical Center in Bangor and Maine Medical Center in Portland carry the state's high-risk deliveries, while other hospitals skew toward lower-intervention births.",
      },
      {
        question: "Where are Maine's birthing hospitals?",
        answer:
          "Maine Medical Center in Portland, Northern Light Eastern Maine Medical Center in Bangor, Mid Coast in Brunswick, MaineGeneral in Augusta, Northern Light Mercy in South Portland, and St. Mary's in Lewiston carry most of the state's births, with critical access hospitals like Cary in Houlton and Calais Hospital filling the borders. The Maine Birth Center in Scarborough is the state's main freestanding option.",
      },
    ],
  },
  MS: {
    state: "MS",
    stateName: "Mississippi",
    medicaidNarrative:
      "Not yet. Mississippi Medicaid does not cover doula services as a defined reimbursable benefit as of the 2026 Prenatal-to-3 review, despite multiple legislative attempts, including a 2024-2025 doula bill that would have created a certification pathway and payment rate. Advocacy continues: with Mississippi covering over 60 percent of births through Medicaid, the highest share of any state, doula advocates argue the state stands to gain the most from a benefit it hasn't yet adopted. In the meantime, Mississippi families use grants (including community birth worker funds in Jackson) or sliding-scale practices, and some hospitals and clinics fund doulas directly through nonprofit grants. Mississippi does extend Medicaid postpartum coverage to 12 months and covers certified nurse-midwife services at participating facilities.",
    doulaRegulations:
      "Mississippi does not license doulas. Doulas work as non-clinical providers, typically certified through DONA, CAPPA, or community-based training programs, and the state's major hospital systems — University of Mississippi Medical Center, Mississippi Baptist, North Mississippi Medical Center — accept trained doulas as support persons rather than as credentialed staff. Midwifery is single-track: Mississippi licenses certified nurse-midwives through the Board of Nursing but does not license Certified Professional Midwives, which leaves Mississippi as one of the states where direct-entry legal attendants are effectively unavailable. Freestanding birth centers are licensed by the State Department of Health under Chapter 43's birthing center standards, and a nonprofit network is working to open Mississippi's first freestanding birth center after changing the rules in 2020 and 2024.",
    birthStats: {
      cesareanRate: 38.2,
      maternalMortalityRate: 66.2,
      homeBirthRate: 1.0,
      birthCenterBirthRate: 0.0,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; Prenatal-to-3 Policy Impact Center",
    },
    faq: [
      {
        question: "Does Mississippi Medicaid cover doula services?",
        answer:
          "No, not as of 2026. Mississippi Medicaid has not adopted a doula benefit despite multiple bills in the Legislature, most recent in the 2024-2025 session. Grant-funded and sliding-scale community doulas in Jackson and the Delta fill what they can. Watch the Mississippi State Department of Health for changes.",
      },
      {
        question: "Can I hire a Certified Professional Midwife in Mississippi?",
        answer:
          "Not with a state license. Mississippi licenses CNMs but has not created licensure for direct-entry or Certified Professional Midwives, so there is no legal CPM pathway in the state. Some families travel to Alabama, Tennessee, or Louisiana borders or work with lay midwives in gray areas. Confirm anyone's credentials carefully.",
      },
      {
        question: "What is the maternal mortality rate in Mississippi?",
        answer:
          "Mississippi's maternal mortality rate was 66.2 deaths per 100,000 live births in the recent five-year estimate, the highest in the nation and more than triple the national average. The state's Maternal Mortality Review Committee has found most deaths preventable, which is why the doula debate keeps returning to the Legislature.",
      },
      {
        question: "Are there birth centers in Mississippi?",
        answer:
          "Not yet. Mississippi has no operating freestanding birth center, though the state rewrote its birthing center regulations in 2020 and again in 2024 and a nonprofit has been raising funds to open the first. All Mississippi hospital births today happen inside hospital L&D units, dominated by UMMC in Jackson and Mississippi Baptist.",
      },
      {
        question: "What is the cesarean rate in Mississippi?",
        answer:
          "Mississippi's 2023 cesarean rate was 38.2 percent (CDC NCHS), nearly six points above the national average and among the highest state rates in the country. If you want to avoid a surgical birth, ask hospitals early for their current rates and VBAC policies, since availability varies widely by facility.",
      },
      {
        question: "Where do most Mississippi births happen?",
        answer:
          "University of Mississippi Medical Center in Jackson is the regional referral hospital and delivers the most babies, alongside Mississippi Baptist and Merit Health Woman's in the metro, North Mississippi Medical Center in Tupelo, and Forrest General in Hattiesburg. All are hospital settings, since no freestanding birth centers operate here.",
      },
    ],
  },
  MT: {
    state: "MT",
    stateName: "Montana",
    medicaidNarrative:
      "Yes. Montana Medicaid (Montana HELP/Mountain Health CO-OP plans aside, the Medicaid program itself) began reimbursing doulas in 2025 after the legislature directed coverage, making Montana one of the first Mountain West states to pay doulas through Medicaid. Enrolled doulas bill for prenatal, labor, and postpartum support across the state's managed-care-free fee-for-service Medicaid structure. With most Montana births happening in just a handful of hospitals (Billings, Missoula, Bozeman, Great Falls) and long distances everywhere else, the doula benefit pairs with Montana's strong licensed direct-entry midwife law to give rural families real choices. Montana Medicaid postpartum coverage runs the full 12 months.",
    doulaRegulations:
      "Montana does not license doulas. Doulas work as trained, non-clinical providers; Medicaid enrollment documentation runs through the Department of Public Health and Human Services administratively. Midwifery is two-track. Certified nurse-midwives are licensed by the Montana Board of Nursing as APRNs with a written practice agreement in hospital settings, and Montana has one of the nation's oldest direct-entry midwifery licensure laws: Licensed Direct-Entry Midwives (usually CPMs) are regulated by the Board of Alternative Health Care, with prescriptive authority extended in 2019 and a robust legal home birth and birth center sector. Bozeman Birth Center and other facilities accept Montana Medicaid, making midwife-led birth genuinely accessible across income levels.",
    birthStats: {
      cesareanRate: 29.9,
      maternalMortalityRate: 27.5,
      homeBirthRate: 2.6,
      birthCenterBirthRate: 0.8,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; Prenatal-to-3 Policy Impact Center",
    },
    faq: [
      {
        question: "Does Montana Medicaid cover doula services?",
        answer:
          "Yes. Montana Medicaid began reimbursing enrolled doulas in 2025 after legislative direction. The doula benefit covers prenatal, birth, and postpartum visits, and works in hospitals, birth centers, and home births. Check with your DPHHS office or ask a specific doula whether she is Medicaid-enrolled.",
      },
      {
        question: "Is home birth legal in Montana?",
        answer:
          "Yes, and it is well established. Montana licenses direct-entry midwives through the Board of Alternative Health Care under one of the country's older licensure laws, giving families a fully legal home birth path. Montana's home birth rate runs about 2.6 percent, well above the national average.",
      },
      {
        question: "Are there birth centers in Montana?",
        answer:
          "Yes. Bozeman Birth Center is the flagship and accepts Montana Medicaid, and additional licensed birth centers serve Missoula and the Flathead Valley. Montana's per-capita birth center access is among the strongest in the West, which pairs well with the state's licensed midwife sector.",
      },
      {
        question: "What is the cesarean rate in Montana?",
        answer:
          "Montana's cesarean rate was about 29.9 percent in 2023 (CDC NCHS), well below the national average of 32.3 percent — partly a reflection of the state's larger home birth and birth center share drawing low-risk births out of hospital stats.",
      },
      {
        question: "Where do most Montana births happen?",
        answer:
          "Billings Clinic, Bozeman Health Deaconess, Community Medical Center in Missoula, and Benefis in Great Falls handle the bulk of the state's hospital births, with regional hospitals like Kalispell Regional and St. Vincent Healthcare in Billings rounding it out. Most of Montana's 56 counties have no birthing facility at all, so distances matter.",
      },
    ],
  },
};