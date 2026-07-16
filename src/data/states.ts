// ═══════════════════════════════════════════════════════════════
// State-level enrichment data for birth-support/[state].astro pages.
// Augments — does NOT replace — city aggregate data from cities.ts.
// Sources: state Medicaid program sites, state doula/health licensing boards,
// CDC NCHS National Vital Statistics System, March of Dimes Maternal Health
// Data Portal (accessed 2025–2026).
// ═══════════════════════════════════════════════════════════════

export interface StateFaqItem {
  question: string;
  answer: string;
}

export interface StateBirthStats {
  cesareanRate?: number;            // Percentage of births via cesarean
  maternalMortalityRate?: number;    // Deaths per 100,000 live births
  homeBirthRate?: number;            // Percentage of births at home
  birthCenterBirthRate?: number;     // Percentage of births in freestanding birth centers
  dataYear?: number;                  // Year the data was collected
  dataSource?: string;                // Source attribution
}

export interface StateData {
  state: string;            // 2-letter code, e.g. "CA"
  stateName: string;        // Full display name, e.g. "California"
  medicaidNarrative: string;  // State-specific Medicaid doula coverage narrative
  doulaRegulations: string;   // State doula licensing/regulation info
  birthStats?: StateBirthStats;  // State-level birth statistics
  faq?: StateFaqItem[];        // State-level FAQ items
  heroImage?: string;          // Path to state-specific hero image (e.g. "/images/state-co-rocky-mountains.webp")
  heroImageAlt?: string;       // Alt text for the hero image
  ogImage?: string;           // Path to state-specific OG image (e.g. "/images/og/og-state-co.png")
}

// State hero/OG image registry. Maps state code to image paths.
// Images are AI-generated photos of iconic state landmarks at golden hour,
// matching the city page hero style. OG images use the split-panel template.
export const stateImages: Record<string, { heroImage: string; heroImageAlt: string; ogImage: string }> = {
  CO: {
    heroImage: '/images/state-co-rocky-mountains.webp',
    heroImageAlt: 'Colorado Rocky Mountains at golden hour, a pregnant woman silhouetted against the peaks',
    ogImage: '/images/og/og-state-co.png',
  },
};

export const stateData: Record<string, StateData> = {
  CA: {
    state: "CA",
    stateName: "California",
    medicaidNarrative:
      "Yes — California's Medi-Cal program covers doula services as a covered benefit. Under SB 361 (signed 2021) and implementation by the California Department of Health Care Services (DHCS), doula services became a covered Medi-Cal benefit starting January 1, 2023. Reimbursement is fee-for-service with an initial intake visit, up to 4 prenatal or postpartum visits, and 1 continuous labor support visit. Additional visits require prior authorization. The statewide reimbursement rate is set by DHCS and available to both fee-for-service and managed care Medi-Cal members. Doulas must register with Medi-Cal as providers to bill for services. Families should ask their doula whether they are enrolled as a Medi-Cal provider, as not all doulas have completed the registration process.",
    doulaRegulations:
      "California does not currently require doula-specific licensing or certification through a state board. Doulas are not licensed medical professionals in California — they operate as community and support professionals. The Medi-Cal doula benefit requires doulas to register as providers and attest to completing approved training, but this is a Medicaid enrollment requirement, not a state professional license. Organizations like DONA International, CIMS, and the National Black Doulas Association provide widely recognized doula certifications, and many California doulas hold these credentials voluntarily. Community-based doula programs, particularly those serving Black and Latinx families, often have additional training requirements specific to their funding sources.",
    birthStats: {
      cesareanRate: 31.3,
      maternalMortalityRate: 4.0,
      homeBirthRate: 0.8,
      birthCenterBirthRate: 0.4,
      dataYear: 2022,
      dataSource: "CDC NCHS, National Vital Statistics System (2022 data)",
    },
    faq: [
      {
        question: "Does California Medicaid (Medi-Cal) cover doula services?",
        answer:
          "Yes. As of January 1, 2023, Medi-Cal covers doula services as a covered benefit. You can receive an intake visit, up to 4 prenatal or postpartum visits, and 1 labor support visit through Medi-Cal. Ask your doula whether they are enrolled as a Medi-Cal provider.",
      },
      {
        question: "Do I need a license to practice as a doula in California?",
        answer:
          "No. California does not require doulas to hold a state license. Doulas are not regulated as medical professionals. However, to bill Medi-Cal for doula services, a doula must register with the DHCS as a provider and meet training requirements.",
      },
      {
        question: "What is the cesarean rate in California?",
        answer:
          "The overall cesarean rate in California is approximately 31.3% (CDC NCHS, 2022 data). Rates vary by hospital and region — ask your hospital for their facility-specific rate during your prenatal visits.",
      },
      {
        question: "Are birth centers available and licensed in California?",
        answer:
          "Yes. California licenses freestanding birth centers through the California Department of Public Health. The state has a well-established birth center network, particularly in the Bay Area, Los Angeles, and Sacramento regions.",
      },
    ],
  },

  TX: {
    state: "TX",
    stateName: "Texas",
    medicaidNarrative:
      "As of 2026, Texas Medicaid does not yet cover doula services as a standard benefit. Texas has historically lagged other states in expanding Medicaid doula coverage. Advocacy efforts by organizations like the Texas Doula Association and the March of Dimes Texas chapter continue to push for state-level coverage. Some local pilot programs and community-based doula programs in Houston, Dallas, and Austin offer subsidized or sliding-scale doula services funded by grants or hospital systems. Families in Texas should check with their Medicaid managed care organization about any pilot programs, and explore community doulas who offer sliding-scale fees. The Texas Health and Human Services Commission (HHSC) has explored potential doula benefit models but has not implemented statewide coverage.",
    doulaRegulations:
      "Texas does not currently require doulas to hold a state-issued license or certification. Doulas are not regulated as medical professionals under Texas law. There is no state doula licensing board. Voluntary certifications from organizations such as DONA International, ProDoula, and the International Doula Institute (formerly toLabor) are widely recognized in the Texas birth community. The Texas Doula Association, a professional membership organization, advocates for the profession and provides continuing education, but membership is voluntary and not legally required. Birth centers are licensed through the Texas Health and Human Services Commission, and Certified Professional Midwives (CPMs) are regulated through the Texas Midwifery Board.",
    birthStats: {
      cesareanRate: 34.5,
      maternalMortalityRate: 18.5,
      homeBirthRate: 0.9,
      birthCenterBirthRate: 0.3,
      dataYear: 2022,
      dataSource: "CDC NCHS, National Vital Statistics System (2022 data)",
    },
    faq: [
      {
        question: "Does Texas Medicaid cover doula services?",
        answer:
          "Not yet. As of 2026, Texas Medicaid does not cover doula services as a standard benefit. Some local pilot programs and community-based organizations offer subsidized doula care. Contact your Medicaid managed care plan to ask about any available programs.",
      },
      {
        question: "Do I need a license to work as a doula in Texas?",
        answer:
          "No. Texas does not require doulas to hold a state license. Doulas are not regulated as medical professionals under Texas law. Voluntary certification through DONA International or similar organizations is widely recognized and many Texas doulas hold these credentials.",
      },
      {
        question: "What is the maternal mortality rate in Texas?",
        answer:
          "Texas has a maternal mortality rate of approximately 18.5 deaths per 100,000 live births (CDC NCHS, 2022 data), which is higher than the national average. Access to doula care and birth support can help improve maternal outcomes.",
      },
      {
        question: "Are birth centers licensed in Texas?",
        answer:
          "Yes. Texas licenses freestanding birth centers through the Texas Health and Human Services Commission (HHSC). Certified Professional Midwives (CPMs) are regulated through the Texas Midwifery Board, which oversees midwifery practice standards.",
      },
    ],
  },

  WA: {
    state: "WA",
    stateName: "Washington",
    medicaidNarrative:
      "Yes — Washington was one of the first states to implement Medicaid doula coverage. Under legislation passed in 2019, Apple Health (Washington Medicaid) began covering doula services starting January 1, 2021. The benefit covers prenatal visits, labor and delivery support, and postpartum visits. Doulas must enroll as Apple Health providers through the Washington Health Care Authority (HCA) and meet training requirements including completion of an approved doula training program. The HCA maintains a directory of enrolled doula providers, and families can search for Apple Health doulas through the agency's provider finder. Reimbursement is available for both fee-for-service and managed care Apple Health members.",
    doulaRegulations:
      "Washington does not require a specific state doula license for all doulas. However, to serve Apple Health (Medicaid) clients, doulas must complete a training program approved by the Washington Health Care Authority and enroll as an Apple Health provider. Washington recognizes Certified Professional Midwives (CPMs) and Licensed Midwives (LMs) through the Washington Department of Health's Midwifery Advisory Committee. Doulas themselves are not licensed through this board — it covers midwives who provide clinical care. DONA International, Childbirth and Postpartum Professional Association (CAPPA), and other national certifying organizations provide widely recognized doula certifications that many Washington doulas hold voluntarily.",
    birthStats: {
      cesareanRate: 30.4,
      maternalMortalityRate: 5.0,
      homeBirthRate: 1.8,
      birthCenterBirthRate: 1.2,
      dataYear: 2022,
      dataSource: "CDC NCHS, National Vital Statistics System (2022 data)",
    },
    faq: [
      {
        question: "Does Washington Apple Health (Medicaid) cover doula services?",
        answer:
          "Yes. Washington began covering doula services through Apple Health on January 1, 2021. The benefit covers prenatal visits, labor support, and postpartum visits. Doulas must enroll as Apple Health providers — ask your doula whether they are enrolled.",
      },
      {
        question: "Do doulas need a state license in Washington?",
        answer:
          "Not a state license, but to serve Apple Health (Medicaid) clients, doulas must complete an HCA-approved training program and enroll as an Apple Health provider. DONA International, CAPPA, and other national certifications are widely recognized and many Washington doulas hold them voluntarily.",
      },
      {
        question: "What is the home birth rate in Washington State?",
        answer:
          "Washington has one of the highest home birth rates in the country at approximately 1.8% of births (CDC NCHS, 2022 data). The state also has a strong birth center network, with approximately 1.2% of births occurring in freestanding birth centers.",
      },
      {
        question: "Are Certified Professional Midwives (CPMs) licensed in Washington?",
        answer:
          "Yes. Washington licenses Certified Professional Midwives (CPMs) and Licensed Midwives (LMs) through the Department of Health. This is separate from doula regulation — doulas provide non-clinical support, while midwives provide clinical care.",
      },
    ],
  },

  VA: {
    state: "VA",
    stateName: "Virginia",
    medicaidNarrative:
      "Yes — Virginia Medicaid began covering doula services effective January 1, 2024. The Virginia Department of Medical Assistance Services (DMAS) implemented doula services as a covered Medicaid benefit following legislation and budget language approved by the Virginia General Assembly. The benefit covers prenatal visits, labor and delivery support, and postpartum visits. Doulas must enroll as Virginia Medicaid providers and meet training and certification requirements defined by DMAS. Families enrolled in Virginia Medicaid managed care plans (such as those administered by Molina, Sentara Health Plans, and others) can access doula services through their plan. Families should ask their doula whether they are enrolled as a Virginia Medicaid provider.",
    doulaRegulations:
      "Virginia does not require a separate state doula license for all doulas. However, to serve Virginia Medicaid clients, doulas must enroll as Medicaid providers through DMAS and meet specific training and certification requirements. The Virginia Department of Health (VDH) has been involved in doula workforce development through the Virginia Doula Initiative. DONA International, the National Black Doula Association, and other national organizations provide widely recognized certifications. Virginia does not currently have a state doula licensing board for non-Medicaid doulas — they operate as community professionals. Midwives, including Certified Nurse Midwives (CNMs), are licensed through the Virginia Board of Medicine and the Virginia Board of Nursing.",
    birthStats: {
      cesareanRate: 32.6,
      maternalMortalityRate: 15.1,
      homeBirthRate: 0.6,
      birthCenterBirthRate: 0.3,
      dataYear: 2022,
      dataSource: "CDC NCHS, National Vital Statistics System (2022 data)",
    },
    faq: [
      {
        question: "Does Virginia Medicaid cover doula services?",
        answer:
          "Yes. Effective January 1, 2024, Virginia Medicaid covers doula services through DMAS. The benefit covers prenatal visits, labor support, and postpartum visits. Contact your managed care plan and ask your doula whether they are enrolled as a Virginia Medicaid provider.",
      },
      {
        question: "Do I need a license to practice as a doula in Virginia?",
        answer:
          "No state license is required for all doulas, but to serve Virginia Medicaid clients, doulas must enroll as Medicaid providers through DMAS and meet training requirements. For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "What is the cesarean rate in Virginia?",
        answer:
          "The overall cesarean rate in Virginia is approximately 32.6% (CDC NCHS, 2022 data). Rates vary by hospital — ask about your facility's rate during prenatal visits.",
      },
      {
        question: "Are Certified Nurse Midwives (CNMs) licensed in Virginia?",
        answer:
          "Yes. Virginia licenses Certified Nurse Midwives through the Board of Medicine and the Board of Nursing. CNMs are advanced practice nurses who provide clinical care including prenatal, birth, and postpartum services. Doulas are separate — they provide non-clinical support.",
      },
    ],
  },

  NY: {
    state: "NY",
    stateName: "New York",
    medicaidNarrative:
      "Yes — New York implemented Medicaid coverage for doula services starting in 2019, making it one of the early adopters. The New York State Department of Health (DOH) administers the benefit through both fee-for-service and managed care Medicaid. The doula benefit covers up to 4 prenatal visits, 1 labor and delivery support visit, and 4 postpartum visits. Doulas must complete a state-approved doula training program and enroll as Medicaid providers. New York has been particularly active in expanding doula access as part of its broader maternal health strategy, motivated by persistent maternal mortality disparities. The New York State Doula Pilot Program, initially launched in Erie County and Brooklyn/Kings County in 2018, preceded the statewide benefit rollout. Families should ask their doula whether they are enrolled as a New York State Medicaid provider.",
    doulaRegulations:
      "New York does not require a state doula license for all doulas. However, to serve Medicaid clients, doulas must complete training from a state-approved doula training program and enroll as Medicaid providers through the NY State DOH. New York maintains a roster of approved doula training programs. There is no state doula licensing board for non-Medicaid doulas — they operate as community professionals. DONA International, Ancient Song Doula Services, and other organizations provide widely recognized doula certifications. New York licenses Certified Professional Midwives (CPMs) through the New York State Board of Midwifery (effective 2023 legislation), and Certified Nurse Midwives (CNMs) through the New York State Education Department's Office of the Professions.",
    birthStats: {
      cesareanRate: 33.0,
      maternalMortalityRate: 14.2,
      homeBirthRate: 0.5,
      birthCenterBirthRate: 0.2,
      dataYear: 2022,
      dataSource: "CDC NCHS, National Vital Statistics System (2022 data)",
    },
    faq: [
      {
        question: "Does New York Medicaid cover doula services?",
        answer:
          "Yes. New York has covered doula services through Medicaid since 2019. The benefit covers up to 4 prenatal visits, 1 labor support visit, and 4 postpartum visits. Doulas must be enrolled as Medicaid providers — ask your doula whether they are enrolled.",
      },
      {
        question: "Do I need a license to practice as a doula in New York?",
        answer:
          "No state license is required for all doulas, but to serve Medicaid clients, doulas must complete a state-approved training program and enroll as Medicaid providers. For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "Does New York license Certified Professional Midwives (CPMs)?",
        answer:
          "Yes. Following legislation enacted in 2023, New York licenses Certified Professional Midwives through the New York State Board of Midwifery. Certified Nurse Midwives (CNMs) are separately licensed through the Office of the Professions. Doulas are not licensed midwives — they provide non-clinical support.",
      },
      {
        question: "What is the maternal mortality rate in New York?",
        answer:
          "New York's maternal mortality rate is approximately 14.2 deaths per 100,000 live births (CDC NCHS, 2022 data). New York has been particularly active in expanding doula access as part of its maternal health strategy to address persistent disparities.",
      },
    ],
  },
};