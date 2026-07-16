// ═══════════════════════════════════════════════════════════════
// State-level enrichment data for birth-support/[state].astro pages.
// Augments; does NOT replace; city aggregate data from cities.ts.
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
  TX: {
    heroImage: '/images/state-tx-river-walk.webp',
    heroImageAlt: 'San Antonio River Walk at golden hour, a pregnant woman silhouetted along the stone pathway',
    ogImage: '/images/og/og-state-tx.png',
  },
  CT: {
    heroImage: '/images/state-ct-lighthouse.webp',
    heroImageAlt: 'Connecticut coastline on the Long Island Sound at golden hour, a pregnant woman silhouetted on the rocky shore with sailboats in the distance',
    ogImage: '/images/og/og-state-ct.png',
  },
  TN: {
    heroImage: '/images/state-tn-smoky-mountains.webp',
    heroImageAlt: 'Great Smoky Mountains at golden hour, a pregnant woman silhouetted on a mountain overlook',
    ogImage: '/images/og/og-state-tn.png',
  },
  MD: {
    heroImage: '/images/state-md-inner-harbor.webp',
    heroImageAlt: 'Baltimore Inner Harbor at golden hour, a pregnant woman silhouetted along the harbor promenade',
    ogImage: '/images/og/og-state-md.png',
  },
  NV: {
    heroImage: '/images/state-nv-red-rock.webp',
    heroImageAlt: 'Red Rock Canyon at golden hour in Nevada, a pregnant woman silhouetted against the red sandstone formations',
    ogImage: '/images/og/og-state-nv.png',
  },
  FL: {
    heroImage: '/images/state-fl-coast.webp',
    heroImageAlt: 'Florida coast at golden hour, a pregnant woman silhouetted on the beach with palm trees and a lighthouse',
    ogImage: '/images/og/og-state-fl.png',
  },
  CA: {
    heroImage: '/images/state-ca-golden-gate.webp',
    heroImageAlt: 'Golden Gate Bridge at golden hour, a pregnant woman silhouetted on a hillside looking toward the bridge',
    ogImage: '/images/og/og-state-ca.png',
  },
  NY: {
    heroImage: '/images/state-ny-skyline.webp',
    heroImageAlt: 'New York City skyline at golden hour from the Brooklyn Heights promenade, a pregnant woman silhouetted looking across at Manhattan',
    ogImage: '/images/og/og-state-ny.png',
  },
  VA: {
    heroImage: '/images/state-va-shenandoah.webp',
    heroImageAlt: 'Shenandoah Valley at golden hour, a pregnant woman silhouetted in a grassy field looking toward the Blue Ridge Mountains',
    ogImage: '/images/og/og-state-va.png',
  },
  WA: {
    heroImage: '/images/state-wa-mount-rainier.webp',
    heroImageAlt: 'Mount Rainier at golden hour, a pregnant woman silhouetted on a mountain trail looking up at the snow-capped peak',
    ogImage: '/images/og/og-state-wa.png',
  },
  GA: {
    heroImage: '/images/state-ga-savannah.webp',
    heroImageAlt: 'Savannah live oak trees draped with Spanish moss at golden hour, a pregnant woman silhouetted on a cobblestone path',
    ogImage: '/images/og/og-state-ga.png',
  },
  MN: {
    heroImage: '/images/state-mn-stone-arch.webp',
    heroImageAlt: 'Minneapolis Stone Arch Bridge at golden hour, a pregnant woman silhouetted on the historic bridge spanning the Mississippi River',
    ogImage: '/images/og/og-state-mn.png',
  },
  OR: {
    heroImage: '/images/state-or-crater-lake.webp',
    heroImageAlt: 'Crater Lake at golden hour, a pregnant woman silhouetted on the crater rim looking across the deep blue caldera',
    ogImage: '/images/og/og-state-or.png',
  },
  MA: {
    heroImage: '/images/state-ma-boston-common.webp',
    heroImageAlt: 'Boston Common at golden hour with the Massachusetts State House dome in the background, a pregnant woman silhouetted on a walking path',
    ogImage: '/images/og/og-state-ma.png',
  },
  OH: {
    heroImage: '/images/state-oh-lake-erie.webp',
    heroImageAlt: 'Cleveland Lake Erie shoreline at golden hour, a pregnant woman silhouetted on the lakefront with the Cleveland skyline and Terminal Tower in the background',
    ogImage: '/images/og/og-state-oh.png',
  },
  NJ: {
    heroImage: '/images/state-nj-shore.webp',
    heroImageAlt: 'New Jersey shore at golden hour, a pregnant woman silhouetted on a classic Jersey Shore boardwalk looking out at the Atlantic',
    ogImage: '/images/og/og-state-nj.png',
  },
  AZ: {
    heroImage: '/images/state-az-grand-canyon.webp',
    heroImageAlt: 'Grand Canyon at golden hour, a pregnant woman silhouetted on the canyon rim looking across the vast layered rock formations',
    ogImage: '/images/og/og-state-az.png',
  },
  MI: {
    heroImage: '/images/state-mi-riverwalk.webp',
    heroImageAlt: 'Detroit Riverwalk at golden hour, a pregnant woman silhouetted along the waterfront with the Detroit skyline and Renaissance Center reflecting in the Detroit River',
    ogImage: '/images/og/og-state-mi.png',
  },
  IN: {
    heroImage: '/images/state-in-dunes.webp',
    heroImageAlt: 'Indiana Dunes at golden hour along Lake Michigan, a pregnant woman silhouetted on a dune looking across the water toward the Chicago skyline',
    ogImage: '/images/og/og-state-in.png',
  },
  PA: {
    heroImage: '/images/state-pa-skyline.webp',
    heroImageAlt: 'Philadelphia skyline at golden hour, a pregnant woman silhouetted in a park looking toward City Hall and the downtown skyline',
    ogImage: '/images/og/og-state-pa.png',
  },
  OK: {
    heroImage: '/images/state-ok-wichita-mountains.webp',
    heroImageAlt: 'Wichita Mountains at golden hour in Oklahoma, a pregnant woman silhouetted on a prairie trail looking up at the rugged peaks',
    ogImage: '/images/og/og-state-ok.png',
  },
  NC: {
    heroImage: '/images/state-nc-blue-ridge.webp',
    heroImageAlt: 'Blue Ridge Mountains at golden hour, a pregnant woman silhouetted on an overlook looking across the rolling ridges',
    ogImage: '/images/og/og-state-nc.png',
  },
  UT: {
    heroImage: '/images/state-ut-zion.webp',
    heroImageAlt: 'Zion National Park at golden hour, a pregnant woman silhouetted on a riverside trail looking up at the red sandstone cliffs',
    ogImage: '/images/og/og-state-ut.png',
  },
  ID: {
    heroImage: '/images/state-id-sawtooth.webp',
    heroImageAlt: 'Sawtooth Mountains at golden hour in Idaho, a pregnant woman silhouetted on a mountain trail looking up at the jagged peaks',
    ogImage: '/images/og/og-state-id.png',
  },
  IL: {
    heroImage: '/images/state-il-skyline.webp',
    heroImageAlt: 'Chicago skyline at golden hour on Lake Michigan, a pregnant woman silhouetted on the lakefront trail looking across at the city',
    ogImage: '/images/og/og-state-il.png',
  },
  RI: {
    heroImage: '/images/state-ri-cliff-walk.webp',
    heroImageAlt: 'Newport Cliff Walk at golden hour on the Rhode Island coastline, a pregnant woman silhouetted on the cliff path looking out at the Atlantic Ocean',
    ogImage: '/images/og/og-state-ri.png',
  },
  SC: {
    heroImage: '/images/state-sc-charleston.webp',
    heroImageAlt: 'Charleston harbor at golden hour, a pregnant woman silhouetted on the waterfront promenade looking across toward the historic skyline and Arthur Ravenel Jr. Bridge',
    ogImage: '/images/og/og-state-sc.png',
  },
};

export const stateData: Record<string, StateData> = {
  CA: {
    state: "CA",
    stateName: "California",
    medicaidNarrative:
      "Yes. California's Medi-Cal program covers doula services as a covered benefit. Under SB 361 (signed 2021) and implementation by the California Department of Health Care Services (DHCS), doula services became a covered Medi-Cal benefit starting January 1, 2023. Reimbursement is fee-for-service with an initial intake visit, up to 4 prenatal or postpartum visits, and 1 continuous labor support visit. Additional visits require prior authorization. The statewide reimbursement rate is set by DHCS and available to both fee-for-service and managed care Medi-Cal members. Doulas must register with Medi-Cal as providers to bill for services. Families should ask their doula whether they are enrolled as a Medi-Cal provider, as not all doulas have completed the registration process.",
    doulaRegulations:
      "California does not currently require doula-specific licensing or certification through a state board. Doulas are not licensed medical professionals in California; they operate as community and support professionals. The Medi-Cal doula benefit requires doulas to register as providers and attest to completing approved training, but this is a Medicaid enrollment requirement, not a state professional license. Organizations like DONA International, CIMS, and the National Black Doulas Association provide widely recognized doula certifications, and many California doulas hold these credentials voluntarily. Community-based doula programs, particularly those serving Black and Latinx families, often have additional training requirements specific to their funding sources.",
    birthStats: {
      cesareanRate: 31.3,
      maternalMortalityRate: 4.0,
      homeBirthRate: 0.8,
      birthCenterBirthRate: 0.4,
      dataYear: 2022,
      dataSource: "CDC NCHS, National Vital Statistics System",
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
          "The overall cesarean rate in California is approximately 31.3% (CDC NCHS, 2022 data). Rates vary by hospital and region; ask your hospital for their facility-specific rate during your prenatal visits.",
      },
      {
        question: "Are birth centers available and licensed in California?",
        answer:
          "Yes. California licenses freestanding birth centers through the California Department of Public Health. The state has a well-established birth center network, particularly in the Bay Area, Los Angeles, and Sacramento regions.",
      },
      {
        question: "How much does Medi-Cal pay doulas per visit in California?",
        answer:
          "As of January 2024, Medi-Cal reimbursement rates are $197.98 for the initial intake visit (90 minutes), $162.11 per prenatal or postpartum visit, and $486.36 for an extended postpartum support visit (3 hours). Labor and delivery support is reimbursed at a separate rate. These rates apply to both fee-for-service and managed care Medi-Cal. Doulas must be enrolled as Medi-Cal providers to receive payment.",
      },
      {
        question: "What is the preterm birth rate in California?",
        answer:
          "California's preterm birth rate was 9.1% in 2024, slightly lower than the national average and an improvement from 9.2% in 2023. March of Dimes gave California a B grade on its 2024 report card. Despite this relatively strong performance, significant racial disparities persist, with Black infants facing higher preterm birth rates than white and Asian infants.",
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
      dataSource: "CDC NCHS, National Vital Statistics System",
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
      {
        question: "How much does a doula cost in Texas?",
        answer:
          "Birth doula packages in Texas typically range from $1,200 to $2,500, with postpartum doulas charging $30 to $45 per hour. Costs vary by city, with Austin and Dallas tending toward the higher end. Many Texas doulas offer sliding-scale fees or payment plans, and community-based programs in Houston, Dallas, and Austin may provide subsidized care.",
      },
      {
        question: "Did Texas extend postpartum Medicaid coverage?",
        answer:
          "Yes. Under House Bill 12, Texas extended postpartum Medicaid and CHIP coverage from 2 months to 12 months, effective March 1, 2024. This means eligible new mothers can now maintain Medicaid coverage for a full year after giving birth, which supports postpartum recovery and follow-up care.",
      },
    ],
  },

  WA: {
    state: "WA",
    stateName: "Washington",
    medicaidNarrative:
      "Yes. Washington was one of the first states to implement Medicaid doula coverage. Under legislation passed in 2019, Apple Health (Washington Medicaid) began covering doula services starting January 1, 2021. The benefit covers prenatal visits, labor and delivery support, and postpartum visits. Doulas must enroll as Apple Health providers through the Washington Health Care Authority (HCA) and meet training requirements including completion of an approved doula training program. The HCA maintains a directory of enrolled doula providers, and families can search for Apple Health doulas through the agency's provider finder. Reimbursement is available for both fee-for-service and managed care Apple Health members.",
    doulaRegulations:
      "Washington does not require a specific state doula license for all doulas. However, to serve Apple Health (Medicaid) clients, doulas must complete a training program approved by the Washington Health Care Authority and enroll as an Apple Health provider. Washington recognizes Certified Professional Midwives (CPMs) and Licensed Midwives (LMs) through the Washington Department of Health's Midwifery Advisory Committee. Doulas themselves are not licensed through this board; it covers midwives who provide clinical care. DONA International, Childbirth and Postpartum Professional Association (CAPPA), and other national certifying organizations provide widely recognized doula certifications that many Washington doulas hold voluntarily.",
    birthStats: {
      cesareanRate: 30.4,
      maternalMortalityRate: 5.0,
      homeBirthRate: 1.8,
      birthCenterBirthRate: 1.2,
      dataYear: 2022,
      dataSource: "CDC NCHS, National Vital Statistics System",
    },
    faq: [
      {
        question: "Does Washington Apple Health (Medicaid) cover doula services?",
        answer:
          "Yes. Washington began covering doula services through Apple Health on January 1, 2021. The benefit covers prenatal visits, labor support, and postpartum visits. Doulas must enroll as Apple Health providers; ask your doula whether they are enrolled.",
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
          "Yes. Washington licenses Certified Professional Midwives (CPMs) and Licensed Midwives (LMs) through the Department of Health. This is separate from doula regulation; doulas provide non-clinical support, while midwives provide clinical care.",
      },
    ],
  },

  VA: {
    state: "VA",
    stateName: "Virginia",
    medicaidNarrative:
      "Yes. Virginia Medicaid began covering doula services effective January 1, 2024. The Virginia Department of Medical Assistance Services (DMAS) implemented doula services as a covered Medicaid benefit following legislation and budget language approved by the Virginia General Assembly. The benefit covers prenatal visits, labor and delivery support, and postpartum visits. Doulas must enroll as Virginia Medicaid providers and meet training and certification requirements defined by DMAS. Families enrolled in Virginia Medicaid managed care plans (such as those administered by Molina, Sentara Health Plans, and others) can access doula services through their plan. Families should ask their doula whether they are enrolled as a Virginia Medicaid provider.",
    doulaRegulations:
      "Virginia does not require a separate state doula license for all doulas. However, to serve Virginia Medicaid clients, doulas must enroll as Medicaid providers through DMAS and meet specific training and certification requirements. The Virginia Department of Health (VDH) has been involved in doula workforce development through the Virginia Doula Initiative. DONA International, the National Black Doula Association, and other national organizations provide widely recognized certifications. Virginia does not currently have a state doula licensing board for non-Medicaid doulas; they operate as community professionals. Midwives, including Certified Nurse Midwives (CNMs), are licensed through the Virginia Board of Medicine and the Virginia Board of Nursing.",
    birthStats: {
      cesareanRate: 32.6,
      maternalMortalityRate: 15.1,
      homeBirthRate: 0.6,
      birthCenterBirthRate: 0.3,
      dataYear: 2022,
      dataSource: "CDC NCHS, National Vital Statistics System",
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
          "The overall cesarean rate in Virginia is approximately 32.6% (CDC NCHS, 2022 data). Rates vary by hospital; ask about your facility's rate during prenatal visits.",
      },
      {
        question: "Are Certified Nurse Midwives (CNMs) licensed in Virginia?",
        answer:
          "Yes. Virginia licenses Certified Nurse Midwives through the Board of Medicine and the Board of Nursing. CNMs are advanced practice nurses who provide clinical care including prenatal, birth, and postpartum services. Doulas are separate; they provide non-clinical support.",
      },
    ],
  },

  CO: {
    state: "CO",
    stateName: "Colorado",
    medicaidNarrative:
      "Yes. Colorado's Medicaid program, Health First Colorado, began covering doula services as a fully covered benefit on July 1, 2024. The Colorado Department of Health Care Policy and Financing (HCPF) implemented the benefit under the Code of Colorado Regulations 10 C.C.R. 2505-10 8.734. The benefit covers three categories of services: prenatal support, continuous labor and delivery support, and postpartum support. Doulas must enroll as Health First Colorado providers under provider type 79 (PT 79) and meet qualifications through either a Certification Pathway or an Experience Pathway. A recommendation from a licensed healthcare provider (physician, nurse midwife, advanced practice nurse, or other eligible provider type) is required before doula services can begin. Reimbursement is available up to $1,500 per pregnancy, with prenatal and postpartum visits billed at $16.28 per 15 minutes (maximum two hours per visit). Families should ask their doula whether they are enrolled as a Health First Colorado provider, as not all doulas have completed the enrollment process.",
    doulaRegulations:
      "Colorado does not require a separate state doula license for all doulas. However, to serve Health First Colorado (Medicaid) members, doulas must enroll as providers under provider type 79 (PT 79) and qualify through either a Certification Pathway or an Experience Pathway as defined by HCPF. Doulas are not regulated as medical professionals under Colorado law; they provide non-clinical support. Voluntary certifications from organizations such as DONA International, CAPPA, and the International Doula Institute are widely recognized in the Colorado birth community. Colorado does regulate birth professionals through separate pathways: Direct-Entry Midwives (DEMs) must register with the Colorado Department of Regulatory Agencies (DORA) under the Direct-Entry Midwives Act, and Certified Professional Midwives (CPMs) are certified through the North American Registry of Midwives (NARM). Freestanding birth centers are licensed by the state and staffed by midwives. Certified Nurse Midwives (CNMs) are licensed through the Colorado Board of Nursing.",
    birthStats: {
      cesareanRate: 27.9,
      maternalMortalityRate: 17.0,
      homeBirthRate: 2.0,
      birthCenterBirthRate: 0.9,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Colorado Medicaid cover doula services?",
        answer:
          "Yes. As of July 1, 2024, Health First Colorado (Colorado's Medicaid program) covers doula services including prenatal support, continuous labor and delivery support, and postpartum support. A recommendation from a licensed healthcare provider is required. Ask your doula whether they are enrolled as a Health First Colorado provider.",
      },
      {
        question: "Do I need a license to practice as a doula in Colorado?",
        answer:
          "No state license is required for all doulas in Colorado. Doulas are not regulated as medical professionals. However, to serve Health First Colorado (Medicaid) members, doulas must enroll as providers under provider type 79 and meet qualification requirements through either a Certification Pathway or an Experience Pathway. For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "What is the cesarean rate in Colorado?",
        answer:
          "Colorado has an overall cesarean rate of approximately 27.9% (CDC NCHS, 2024 data), which is below the national average. The low-risk cesarean rate is approximately 22.6%, ranking Colorado 9th best among states. Rates vary by hospital, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "Are birth centers licensed in Colorado?",
        answer:
          "Yes. Colorado licenses freestanding birth centers through the state, and all licensed birth centers are staffed by midwives. Direct-Entry Midwives (DEMs) must register with the Colorado Department of Regulatory Agencies (DORA) under the Direct-Entry Midwives Act. Certified Professional Midwives (CPMs) are certified through the North American Registry of Midwives (NARM).",
      },
      {
        question: "What is the maternal mortality rate in Colorado?",
        answer:
          "Colorado's maternal mortality rate is approximately 17.0 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), ranking Colorado 8th best among states. This is below the national average and reflects Colorado's position as one of the top ten states for low maternal mortality.",
      },
      {
        question: "How much does Colorado Medicaid reimburse for doula services?",
        answer:
          "Health First Colorado reimburses doula services up to $1,500 per pregnancy. Prenatal and postpartum visits are billed at $16.28 per 15 minutes, with a maximum of two hours per visit. The benefit covers prenatal support, continuous labor and delivery support, and postpartum support. A licensed provider must recommend doula services before they begin.",
      },
    ],
  },

  NY: {
    state: "NY",
    stateName: "New York",
    medicaidNarrative:
      "Yes. New York implemented Medicaid coverage for doula services starting in 2019, making it one of the early adopters. The New York State Department of Health (DOH) administers the benefit through both fee-for-service and managed care Medicaid. The doula benefit covers up to 4 prenatal visits, 1 labor and delivery support visit, and 4 postpartum visits. Doulas must complete a state-approved doula training program and enroll as Medicaid providers. New York has been particularly active in expanding doula access as part of its broader maternal health strategy, motivated by persistent maternal mortality disparities. The New York State Doula Pilot Program, initially launched in Erie County and Brooklyn/Kings County in 2018, preceded the statewide benefit rollout. Families should ask their doula whether they are enrolled as a New York State Medicaid provider.",
    doulaRegulations:
      "New York does not require a state doula license for all doulas. However, to serve Medicaid clients, doulas must complete training from a state-approved doula training program and enroll as Medicaid providers through the NY State DOH. New York maintains a roster of approved doula training programs. There is no state doula licensing board for non-Medicaid doulas; they operate as community professionals. DONA International, Ancient Song Doula Services, and other organizations provide widely recognized doula certifications. New York licenses Certified Professional Midwives (CPMs) through the New York State Board of Midwifery (effective 2023 legislation), and Certified Nurse Midwives (CNMs) through the New York State Education Department's Office of the Professions.",
    birthStats: {
      cesareanRate: 33.0,
      maternalMortalityRate: 14.2,
      homeBirthRate: 0.5,
      birthCenterBirthRate: 0.2,
      dataYear: 2022,
      dataSource: "CDC NCHS, National Vital Statistics System",
    },
    faq: [
      {
        question: "Does New York Medicaid cover doula services?",
        answer:
          "Yes. New York has covered doula services through Medicaid since 2019. The benefit covers up to 4 prenatal visits, 1 labor support visit, and 4 postpartum visits. Doulas must be enrolled as Medicaid providers; ask your doula whether they are enrolled.",
      },
      {
        question: "Do I need a license to practice as a doula in New York?",
        answer:
          "No state license is required for all doulas, but to serve Medicaid clients, doulas must complete a state-approved training program and enroll as Medicaid providers. For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "Does New York license Certified Professional Midwives (CPMs)?",
        answer:
          "Yes. Following legislation enacted in 2023, New York licenses Certified Professional Midwives through the New York State Board of Midwifery. Certified Nurse Midwives (CNMs) are separately licensed through the Office of the Professions. Doulas are not licensed midwives; they provide non-clinical support.",
      },
      {
        question: "What is the maternal mortality rate in New York?",
        answer:
          "New York's maternal mortality rate is approximately 14.2 deaths per 100,000 live births (CDC NCHS, 2022 data). New York has been particularly active in expanding doula access as part of its maternal health strategy to address persistent disparities.",
      },
    ],
  },

  CT: {
    state: "CT",
    stateName: "Connecticut",
    medicaidNarrative:
      "Yes. Connecticut's Medicaid program, known as HUSKY Health, began covering certified doula services as a fee-for-service benefit effective January 1, 2025. The Department of Social Services (DSS) implemented the benefit through Provider Bulletin PB 2025-14, with coverage retroactive to the start of the year. The benefit covers up to four antepartum or postpartum visits at $100 per visit, plus one in-person labor and delivery support visit reimbursed at a flat $800 fee. Doulas must be certified by the Connecticut Department of Public Health (DPH) and enrolled with the Connecticut Medical Assistance Program (CMAP) before they can bill HUSKY Health. A licensed practitioner (physician, advanced practice registered nurse, physician assistant, or certified nurse-midwife) must recommend or refer doula services before care begins. Postpartum visits can occur up to twelve months after delivery, and HUSKY Health has extended postpartum coverage from two months to a full twelve months for eligible members as of April 1, 2022. Families should ask their doula whether they are DPH-certified and enrolled with HUSKY Health, as not all doulas have completed the enrollment process.",
    doulaRegulations:
      "Connecticut is one of the few states that requires formal state certification for doulas. Under Chapter 377a of the Connecticut General Statutes, the Department of Public Health (DPH) administers the doula certification program. To become certified, applicants must submit two reference letters from families or professionals with direct knowledge of their doula experience, and either complete an approved doula training program or submit a notarized attestation confirming they have provided doula services to at least three families and have training in not fewer than four core competencies identified by the Doula Training Program Review Committee. The application fee is $100 and applications are submitted online through the DPH e-license portal. A Doula Advisory Committee, established in July 2023, developed the certification recommendations including training standards, core competencies, and continuing education requirements. Doulas must be DPH-certified before enrolling as HUSKY Health providers. DONA International and other national certifying organizations are widely recognized, but state certification through DPH is the pathway to practicing within the Medicaid system.",
    birthStats: {
      cesareanRate: 32.3,
      maternalMortalityRate: 16.2,
      homeBirthRate: 0.6,
      birthCenterBirthRate: 0.2,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Connecticut Medicaid (HUSKY Health) cover doula services?",
        answer:
          "Yes. As of January 1, 2025, HUSKY Health covers certified doula services as a fee-for-service benefit. The benefit includes up to four prenatal or postpartum visits at $100 per visit and one labor and delivery support visit at a flat $800 fee. A licensed healthcare provider must recommend doula services before they begin. Ask your doula whether they are DPH-certified and enrolled with HUSKY Health.",
      },
      {
        question: "Do I need a license or certification to practice as a doula in Connecticut?",
        answer:
          "Connecticut requires formal state certification through the Department of Public Health (DPH) for doulas who want to serve HUSKY Health members. Applicants must submit two reference letters and either complete an approved training program or attest to having served at least three families with training in four core competencies. The application fee is $100. For private-pay clients, voluntary national certifications like DONA International are also widely recognized.",
      },
      {
        question: "How much does HUSKY Health reimburse doulas in Connecticut?",
        answer:
          "HUSKY Health reimburses $100 per perinatal visit (up to four visits total) and a flat $800 fee for in-person attendance during labor and delivery. Additional medically necessary visits beyond the four limit require prior authorization. Telemedicine is permitted for up to half of perinatal visits but not for labor and delivery support.",
      },
      {
        question: "What is the maternal mortality rate in Connecticut?",
        answer:
          "Connecticut's maternal mortality rate is approximately 16.2 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2020-2023 data). The infant mortality rate is 4.5 deaths per 1,000 live births, which ranks Connecticut 10th best among states. Despite these relatively strong numbers, racial disparities persist and the state has been actively expanding doula access to address them.",
      },
      {
        question: "Did Connecticut extend postpartum Medicaid coverage?",
        answer:
          "Yes. HUSKY Health extended postpartum coverage from two months to a full twelve months for eligible HUSKY A and B members, effective April 1, 2022. This means new mothers can maintain Medicaid coverage for an entire year after giving birth, which supports postpartum recovery, follow-up care, and access to doula services during the extended postpartum period.",
      },
      {
        question: "How many births occur in Connecticut each year?",
        answer:
          "There were approximately 34,599 live births in Connecticut in 2024, with a fertility rate of 48.9 per 1,000 women ages 15 to 44. The state's fertility rate ranks among the lower tier nationally, reflecting broader demographic trends in the Northeast. The cesarean rate is approximately 32.3%, close to the national average.",
      },
    ],
  },

  TN: {
    state: "TN",
    stateName: "Tennessee",
    medicaidNarrative:
      "As of 2026, Tennessee's Medicaid program (TennCare) does not yet cover doula services as a standard benefit. TennCare covers approximately 50 percent of all births in the state, making the lack of doula coverage a significant gap for Tennessee families. The Tennessee Department of Health launched the Root to Rise Community Doula Pilot Program in March 2024, which provides doula services to Black TennCare enrollees through June 2025, serving a projected 292 clients. Senator London Lamar introduced SB 44 in the 2025 legislative session to add doula services to TennCare coverage and establish a state doula certification process. The bill was advanced by the Senate Health and Welfare Committee but the TennCare coverage language was removed during the process, leaving only the certification framework. Families should check with their TennCare managed care organization about any pilot programs, and explore community doulas who offer sliding-scale fees.",
    doulaRegulations:
      "Tennessee does not currently require doulas to hold a state-issued license or certification. There is no state doula licensing board, and doulas are not regulated as medical professionals under Tennessee law. The Tennessee Department of Health's 2025 Doula Services Report confirmed that no state license requirement exists, meaning doulas may enter into collaborative partnerships with licensed professionals without barriers. SB 44, introduced in 2025, would direct the Department of Health to establish a voluntary certification verification process for doulas, but this had not been enacted into law as of early 2026. Voluntary certifications from organizations such as DONA International, ProDoula, and the International Doula Institute are widely recognized in the Tennessee birth community. Tennessee does license Certified Professional Midwives (CPMs) through the Council of Certified Professional Midwifery under the Tennessee Department of Health, and Certified Nurse Midwives (CNMs) through the Tennessee Board of Nursing. Freestanding birth centers are regulated under Tennessee state law.",
    birthStats: {
      cesareanRate: 31.8,
      maternalMortalityRate: 42.1,
      homeBirthRate: 1.0,
      birthCenterBirthRate: 0.4,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Tennessee Medicaid (TennCare) cover doula services?",
        answer:
          "Not yet. TennCare does not currently cover doula services as a standard benefit. However, the Root to Rise Community Doula Pilot Program launched in March 2024 provides doula services to eligible Black TennCare enrollees. Senator London Lamar's SB 44 sought to add doula coverage to TennCare, but the coverage language was removed during the 2025 legislative process. Check with your TennCare managed care organization for any available pilot programs.",
      },
      {
        question: "Do I need a license to practice as a doula in Tennessee?",
        answer:
          "No. Tennessee does not require doulas to hold a state license or certification. Doulas are not regulated as medical professionals. SB 44, introduced in 2025, would establish a voluntary certification verification process through the Department of Health, but it had not been enacted as of early 2026. Voluntary certifications from DONA International and similar organizations are widely recognized.",
      },
      {
        question: "What is the maternal mortality rate in Tennessee?",
        answer:
          "Tennessee's maternal mortality rate is approximately 42.1 deaths per 100,000 live births, which ranks among the worst in the nation. The March of Dimes 2025 Report Card identified Tennessee as having the worst maternal mortality score in the United States. TennCare maternal death rates are approximately three times those of private insurance, highlighting significant disparities in birth outcomes.",
      },
      {
        question: "What is the cesarean rate in Tennessee?",
        answer:
          "Tennessee has an overall cesarean rate of approximately 31.8 percent (CDC NCHS, 2024 data), which is slightly below the national average. The primary cesarean rate was 22.4 percent in 2024, and the low-risk cesarean rate was approximately 25.7 percent. Rates vary by hospital, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "Are birth centers licensed in Tennessee?",
        answer:
          "Yes. Tennessee regulates freestanding birth centers under state law, and Certified Professional Midwives (CPMs) are licensed through the Council of Certified Professional Midwifery under the Tennessee Department of Health. Certified Nurse Midwives (CNMs) are licensed through the Tennessee Board of Nursing. Home birth midwife packages in Tennessee typically range from $3,500 to $6,000.",
      },
      {
        question: "What is the infant mortality rate in Tennessee?",
        answer:
          "Tennessee's infant mortality rate is approximately 6.41 deaths per 1,000 live births (CDC NCHS, 2024 data), which is about 16 percent higher than the national rate of 5.6. The preterm birth rate was 10.9 percent in 2024, with 9,127 babies born premature. Tennessee ranks 34th out of 52 reporting areas for preterm birth.",
      },
    ],
  },

  MD: {
    state: "MD",
    stateName: "Maryland",
    medicaidNarrative:
      "Yes. Maryland Medicaid began covering doula services on February 21, 2022, through the Maryland Department of Health Medicaid Medical Assistance Program. The benefit is available to both HealthChoice managed care members and fee-for-service enrollees. Doula services are a self-referred benefit, meaning eligible pregnant or postpartum Medicaid members can access doula support directly without a physician referral. The benefit covers three categories of services: prenatal visits, attendance at labor and delivery, and postpartum visits. Doulas must be certified by a Maryland Department of Health approved certification organization and enroll as Medicaid providers through the ePREP system. Reimbursement ranges from $1,331.84 to $1,427.84 depending on the combination of visits, with doula attendance at labor and delivery (code T1033) reimbursed at $800. Families should contact their HealthChoice Managed Care Organization or ask their doula whether they are enrolled as a Maryland Medicaid provider.",
    doulaRegulations:
      "Maryland regulates doulas serving Medicaid members through COMAR 10.09.39, which defines a certified doula as a trained nonmedical professional who provides continuous physical, emotional, and informational support to the birthing parent. To serve Medicaid clients, doulas must be certified by one of the Maryland Department of Health approved certification organizations and enroll as providers through the ePREP system. There is no separate state doula licensing board for non-Medicaid doulas, but the Medicaid enrollment requirements establish a structured pathway. In 2025, Maryland passed HB 1251, the Doula and Birth Policy Transparency Act, which requires hospitals to adopt policies allowing certified doulas to be present during birth. Maryland licenses Certified Nurse Midwives (CNMs) through the Maryland Board of Nursing, and Certified Professional Midwives (CPMs) are recognized through the Licensed Direct-Entry Midwife (LDM) pathway regulated by the Maryland Office of Health Care Quality. LDMs can legally attend planned home births for low-risk pregnancies.",
    birthStats: {
      cesareanRate: 35.0,
      maternalMortalityRate: 21.4,
      homeBirthRate: 0.9,
      birthCenterBirthRate: 0.3,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Maryland Medicaid cover doula services?",
        answer:
          "Yes. Maryland Medicaid has covered doula services since February 21, 2022. The benefit covers prenatal visits, labor and delivery attendance, and postpartum visits. It is a self-referred benefit, meaning you do not need a doctor's referral. Contact your HealthChoice Managed Care Organization or ask your doula whether they are enrolled as a Maryland Medicaid provider.",
      },
      {
        question: "How much does Maryland Medicaid reimburse for doula services?",
        answer:
          "Maryland Medicaid reimburses doula services at rates ranging from $1,331.84 to $1,427.84 per pregnancy, depending on the combination of visits. Doula attendance at labor and delivery (billing code T1033) is reimbursed at $800. Prenatal and postpartum visits are billed in addition to the labor and delivery attendance.",
      },
      {
        question: "Do I need a license to practice as a doula in Maryland?",
        answer:
          "There is no separate state doula license for all doulas in Maryland. However, to serve Medicaid clients, doulas must be certified by a Maryland Department of Health approved certification organization and enroll as providers through the ePREP system. For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "What is the cesarean rate in Maryland?",
        answer:
          "Maryland has an overall cesarean rate of approximately 35.0 percent (CDC NCHS, 2023 data), which is above the national average of 32.3 percent. The low-risk cesarean rate is 30.7 percent. Rates vary significantly by hospital and region, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "Are birth centers and home birth midwives licensed in Maryland?",
        answer:
          "Yes. Maryland licenses Certified Nurse Midwives (CNMs) through the Maryland Board of Nursing. Certified Professional Midwives (CPMs) are recognized through the Licensed Direct-Entry Midwife (LDM) pathway, regulated by the Maryland Office of Health Care Quality. LDMs can legally attend planned home births for low-risk pregnancies.",
      },
      {
        question: "Does Maryland require hospitals to allow doulas during birth?",
        answer:
          "Yes. In 2025, Maryland passed HB 1251, the Doula and Birth Policy Transparency Act, which requires hospitals to adopt policies allowing certified doulas to be present during birth. This legislation ensures birthing parents have the right to doula support in hospital settings.",
      },
    ],
  },

  FL: {
    state: "FL",
    stateName: "Florida",
    medicaidNarrative:
      "Yes, but with a caveat. Florida Medicaid covers doula services as an optional expanded benefit through its managed care plans, rather than as a mandatory statewide benefit. The Florida Agency for Health Care Administration (AHCA) gave Medicaid Managed Care Organizations (MCOs) the option to offer doula services as an expanded benefit beginning in 2019. This means coverage depends on which managed care plan a family is enrolled in, and reimbursement rates vary by plan, typically ranging from $450 to $1,100 per pregnancy. Some plans, such as Sunshine Health, offer comprehensive doula coverage including unlimited prenatal and postpartum visits, in-person labor support, and 24/7 on-call availability. Families enrolled in Florida Medicaid should contact their managed care plan directly to confirm whether doula services are covered and at what reimbursement level. A 2024 bill (SB 372) that would have established a formal state-certified doula registry died in committee, and a 2025 pilot program bill (HB 515) for Broward, Miami-Dade, and Palm Beach Counties has been filed but not yet enacted. Advocacy groups including the Florida Doula Initiative and Healthy Start continue pushing for standardized statewide coverage.",
    doulaRegulations:
      "Florida does not currently require a state doula license or certification for all doulas. Doulas are not regulated as medical professionals under Florida law, and there is no state doula licensing board. SB 372, introduced in the 2024 legislative session, would have created a state-certified doula designation through the Florida Department of Health, requiring doulas to complete approved training and maintain a public registry, but the bill died in the Health Policy Committee on March 8, 2024. A similar bill (HB 1325) also died in the House. Without state certification, doulas in Florida operate as community professionals and hold voluntary certifications from organizations such as DONA International, CAPPA, and the International Doula Institute. The Healthy Start program in Florida trains and certifies doulas through local coalitions to serve Medicaid-eligible families. Florida does regulate midwives separately under Chapter 467, Florida Statutes, which requires a license from the Florida Department of Health to practice midwifery. Licensed midwives must graduate from an approved midwifery program, pass the NARM exam, and meet continuing education requirements. Certified Nurse Midwives (CNMs) are licensed through the Florida Board of Nursing. Freestanding birth centers are licensed by AHCA under Chapter 383, Florida Statutes, and Florida recently became the first state to establish Advanced Birth Centers through the Live Healthy Act of 2024 (SB 7016).",
    birthStats: {
      cesareanRate: 36.0,
      maternalMortalityRate: 24.5,
      homeBirthRate: 1.3,
      birthCenterBirthRate: 0.9,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card; KFF State Health Facts",
    },
    faq: [
      {
        question: "Does Florida Medicaid cover doula services?",
        answer:
          "It depends on your managed care plan. Florida Medicaid offers doula services as an optional expanded benefit through its managed care organizations, meaning coverage is not guaranteed statewide. Some plans, such as Sunshine Health, offer comprehensive doula coverage including prenatal visits, labor support, and postpartum visits. Contact your Medicaid managed care plan directly to ask whether doula services are covered and at what reimbursement rate.",
      },
      {
        question: "Do I need a license to practice as a doula in Florida?",
        answer:
          "No. Florida does not require doulas to hold a state license or certification. Doulas are not regulated as medical professionals under Florida law. SB 372, which would have created a state-certified doula designation, died in committee in 2024. Voluntary certifications from DONA International, CAPPA, and similar organizations are widely recognized and many Florida doulas hold these credentials.",
      },
      {
        question: "What is the cesarean rate in Florida?",
        answer:
          "Florida has an overall cesarean rate of approximately 36 percent (KFF, 2023 data), which is above the national average of approximately 32.4 percent. The low-risk cesarean rate is approximately 30 percent. Rates vary significantly by hospital and region, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in Florida?",
        answer:
          "Florida's maternal mortality rate is approximately 24.5 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), which is above the national average and ranks Florida 28th out of 48 reporting states. The Healthy People 2030 target is 15.7 deaths per 100,000 live births, meaning Florida has significant work to do in reducing maternal mortality.",
      },
      {
        question: "Are birth centers licensed in Florida?",
        answer:
          "Yes. Florida licenses freestanding birth centers through the Agency for Health Care Administration (AHCA) under Chapter 383, Florida Statutes. Florida recently became the first state to establish Advanced Birth Centers through the Live Healthy Act of 2024 (SB 7016), which expands birthing options for families. Licensed midwives practice in birth centers under Chapter 467, Florida Statutes.",
      },
      {
        question: "Are midwives licensed in Florida?",
        answer:
          "Yes. Florida requires a license from the Department of Health to practice midwifery under Chapter 467, Florida Statutes. Licensed midwives must graduate from an approved midwifery program, pass the NARM exam, and meet continuing education requirements. Certified Nurse Midwives (CNMs) are separately licensed through the Florida Board of Nursing. Doulas are not midwives and provide non-clinical support.",
      },
    ],
  },

  NV: {
    state: "NV",
    stateName: "Nevada",
    medicaidNarrative:
      "Yes. Nevada Medicaid covers doula services as a covered benefit. Nevada passed AB 256 in June 2021, which required Medicaid coverage for doula care, and the benefit went live on April 1, 2022. The Nevada Department of Health Care Financing and Policy (DHCFP) administers the benefit through Provider Type 90 (PT 90). The benefit covers up to 4 prenatal, antepartum, or postpartum visits (up to 90 days postpartum) plus 1 labor and delivery support visit. Prior authorization is available for additional medically necessary visits. Doulas providing services to members in rural areas receive an additional 10 percent reimbursement. Total reimbursement ranges from approximately $1,500 to $1,650 per pregnancy. Doulas must enroll as Nevada Medicaid providers under PT 90 and hold certification from the Nevada Certification Board (NCB). Families should ask their doula whether they are enrolled as a Nevada Medicaid provider.",
    doulaRegulations:
      "Nevada does not require a state doula license for all doulas, but it is one of the few states with a formal certification pathway through the Nevada Certification Board (NCB). To serve Nevada Medicaid clients, doulas must complete one of eight NCB-approved foundational doula training programs and obtain NCB certification, then enroll as providers under Provider Type 90 (PT 90) through DHCFP. The NCB application costs $100 with $50 renewal fees. Doulas are not regulated as medical professionals under Nevada law. They provide non-clinical support. National certifying organizations such as DONA International, CAPPA, and the International Doula Institute also provide widely recognized certifications that many Nevada doulas hold. Nevada licenses Certified Professional Midwives (CPMs) and regulates freestanding birth centers through the Nevada Division of Public and Behavioral Health. Certified Nurse Midwives (CNMs) are licensed through the Nevada State Board of Nursing.",
    birthStats: {
      cesareanRate: 34.0,
      maternalMortalityRate: 20.4,
      homeBirthRate: 0.8,
      birthCenterBirthRate: 0.3,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; KFF Maternal & Infant Health Profiles; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Nevada Medicaid cover doula services?",
        answer:
          "Yes. Nevada Medicaid has covered doula services since April 1, 2022, following the passage of AB 256 in 2021. The benefit covers up to 4 prenatal or postpartum visits plus 1 labor and delivery support visit. Prior authorization is available for additional medically necessary visits. Doulas serving rural areas receive an additional 10 percent reimbursement. Ask your doula whether they are enrolled as a Nevada Medicaid provider.",
      },
      {
        question: "Do I need a license to practice as a doula in Nevada?",
        answer:
          "No state license is required for all doulas in Nevada. However, to serve Medicaid clients, doulas must obtain certification from the Nevada Certification Board (NCB) by completing one of eight approved training programs, then enroll as providers under Provider Type 90 (PT 90) through DHCFP. For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "What is the cesarean rate in Nevada?",
        answer:
          "Nevada has an overall cesarean rate of approximately 34.0 percent (CDC NCHS, 2023 data), which is above the national average of 32.3 percent. The low-risk cesarean rate is approximately 28 percent. Rates vary by hospital and region, with significant disparities by race and ethnicity. Ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in Nevada?",
        answer:
          "Nevada's maternal mortality rate is approximately 20.4 deaths per 100,000 live births (CDC NCHS, 2018-2022 data). The March of Dimes 2025 Report Card ranks Nevada among the top twenty states with the lowest rates of maternal mortality. Access to doula care and birth support can help improve maternal outcomes and reduce disparities.",
      },
      {
        question: "Are birth centers licensed in Nevada?",
        answer:
          "Yes. Nevada regulates freestanding birth centers through the Nevada Division of Public and Behavioral Health. Under regulations updated in 2021, Certified Professional Midwives (CPMs) can own and direct birth centers, expanding access beyond physician-led or CNM-led models. Birth centers must meet state licensing requirements and are staffed by licensed midwives.",
      },
      {
        question: "How much does Nevada Medicaid reimburse for doula services?",
        answer:
          "Nevada Medicaid reimburses doula services with a total of approximately $1,500 to $1,650 per pregnancy. The benefit covers up to 4 prenatal or postpartum visits plus 1 labor and delivery support visit. Doulas providing services in rural areas receive an additional 10 percent reimbursement. Additional medically necessary visits may be approved through prior authorization.",
      },
    ],
  },

  GA: {
    state: "GA",
    stateName: "Georgia",
    medicaidNarrative:
      "Georgia is in the early stages of implementing Medicaid doula coverage. House Bill 263, introduced in February 2025, would establish a pilot program within Georgia's Medicaid system to provide coverage for doula care for pregnant recipients. Under the proposed program, eligible recipients could receive reimbursement for up to five doula visits, including prepartum, labor and delivery, and postpartum support. The state included $6.8 million in the Fiscal Year 2025 budget to support Medicaid reimbursement rates for doulas and fund perinatal support initiatives. Healthy Mothers, Healthy Babies Coalition of Georgia (HMHBGA) is launching a doula Medicaid reimbursement pilot aimed at improving maternal and child health outcomes. Georgia has also extended postpartum Medicaid coverage from 60 days to 12 months, giving new mothers sustained access to care during the critical postpartum period. Families should check with their Medicaid managed care organization about pilot availability and ask prospective doulas whether they participate in any Medicaid-funded programs.",
    doulaRegulations:
      "Georgia does not require doulas to hold a state-issued license or certification. Doulas are not regulated as medical professionals under Georgia law, and there is no state doula licensing board. For the emerging Medicaid pilot program, doulas may need to meet specific training and registration requirements to participate as providers. The Healthy Mothers, Healthy Babies Coalition of Georgia operates the Building Perinatal Support Professionals (BPSP) program, which provides training pathways for aspiring birth and postpartum doulas. Applicants must be 18 or older, have a high school diploma or GED, and reside in Georgia. Voluntary certifications from organizations such as DONA International, the Georgia Birth and Doula Network (GABDN), and ProDoula are widely recognized in the Georgia birth community. Certified Professional Midwives (CPMs) and midwives are regulated separately through the Georgia Composite Medical Board.",
    birthStats: {
      cesareanRate: 34.9,
      maternalMortalityRate: 66.3,
      homeBirthRate: 0.7,
      birthCenterBirthRate: 0.2,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card; Georgia Department of Public Health",
    },
    faq: [
      {
        question: "Does Georgia Medicaid cover doula services?",
        answer:
          "Georgia is piloting Medicaid doula coverage. House Bill 263, introduced in 2025, would create a pilot program allowing up to five doula visits per pregnancy through Medicaid, including prenatal, labor and delivery, and postpartum support. The state allocated $6.8 million in the FY 2025 budget for doula reimbursement and perinatal support. Contact your Medicaid managed care plan to ask about pilot availability and enrolled doula providers.",
      },
      {
        question: "Do I need a license to practice as a doula in Georgia?",
        answer:
          "No. Georgia does not require doulas to hold a state license. Doulas are not regulated as medical professionals under Georgia law. To participate in Medicaid pilot programs, doulas may need to meet specific training and registration requirements. Voluntary certification through DONA International, the Georgia Birth and Doula Network, or similar organizations is widely recognized and many Georgia doulas hold these credentials.",
      },
      {
        question: "What is the maternal mortality rate in Georgia?",
        answer:
          "Georgia has one of the highest maternal mortality rates in the nation. The rate has been reported as high as 66.3 deaths per 100,000 live births in recent CDC data, making Georgia among the worst states for maternal health outcomes. The Georgia Maternal Mortality Review Committee found that a significant majority of maternal deaths were deemed preventable. Access to doula care and continuous birth support can help improve maternal outcomes and reduce disparities.",
      },
      {
        question: "Did Georgia extend postpartum Medicaid coverage?",
        answer:
          "Yes. Georgia extended postpartum Medicaid coverage from 60 days to 12 months, giving eligible new mothers continuous access to comprehensive benefits for a full year after giving birth. This extension is especially important given Georgia's high maternal mortality rate, as many pregnancy-related complications occur in the postpartum period. Families should verify their enrollment status and coverage details with their Medicaid managed care organization.",
      },
      {
        question: "What is the preterm birth rate in Georgia?",
        answer:
          "Georgia's preterm birth rate was 11.8 percent in 2024, resulting in 14,907 babies born preterm. March of Dimes gave Georgia an F grade on its 2025 Report Card, ranking the state 45th out of 52 jurisdictions. Racial disparities are significant, with Black infants facing substantially higher preterm birth rates than white infants. Access to doula care and adequate prenatal support can help address these disparities.",
      },
      {
        question: "How much does a doula cost in Georgia?",
        answer:
          "Birth doula packages in Georgia typically range from $1,000 to $2,200, with postpartum doulas charging $25 to $45 per hour. Costs vary by region, with Atlanta and its suburbs tending toward the higher end while rural areas may have fewer available doulas. Many Georgia doulas offer sliding-scale fees or payment plans, and community-based programs in Atlanta, Savannah, and other cities may provide subsidized or free doula services for qualifying families.",
      },
    ],
  },

  MN: {
    state: "MN",
    stateName: "Minnesota",
    medicaidNarrative:
      "Yes. Minnesota was one of the first states in the nation to cover doula services through Medicaid. Minnesota Health Care Programs (MHCP), administered by the Department of Human Services (DHS), began covering doula services in July 2014 under Minnesota Statutes section 256B.0625, subdivision 28b. The benefit covers prenatal visits, continuous labor and delivery support, and postpartum visits for Medical Assistance enrollees. Doulas must be certified and registered with the Minnesota Doula Registry maintained by the Minnesota Department of Health (MDH), and enrolled as MHCP providers through MN-ITS. Billing uses procedure code T1033 for non-labor visits and T1033 with U4 modifier for labor and delivery. Effective January 1, 2024, reimbursement increased significantly under Minnesota Statutes 256B.758: certified doulas now receive $100 per prenatal or postpartum visit and $1,400 for attending and providing doula services at a birth, bringing total possible reimbursement to approximately $3,200 per pregnancy. Doulas providing services in rural counties receive an enhanced rate of $1,650 for birth attendance. Minnesota also allows telehealth for up to half of perinatal visits. Families should ask their doula whether they are registered with the state Doula Registry and enrolled as an MHCP provider.",
    doulaRegulations:
      "Minnesota does not require a state license to practice as a doula. Certification is voluntary for private practice. However, to serve Medical Assistance (Medicaid) clients and bill MHCP, doulas must be certified by an approved organization and registered with the Minnesota Doula Registry maintained by the Minnesota Department of Health (MDH). Applicants must show they have completed 20 hours of relevant education or training, 12 hours of which must be in birth doula training, along with hands-on requirements. The state does not set a specific list of standards or competencies for registry eligibility; instead, each certified doula must follow the standards and ethics agreed to by their certifying organization. Approved certifying organizations include DONA International, CAPPA, and other recognized programs. Minnesota licenses Certified Professional Midwives (CPMs) as Licensed Traditional Midwives (LTMs) through the Minnesota Department of Health, and Certified Nurse Midwives (CNMs) through the Minnesota Board of Nursing. Freestanding birth centers operate in Minnesota, including the Minnesota Birth Center with locations in Minneapolis and St. Paul.",
    birthStats: {
      cesareanRate: 30.0,
      maternalMortalityRate: 14.1,
      homeBirthRate: 1.5,
      birthCenterBirthRate: 1.0,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card; KFF State Health Facts",
    },
    faq: [
      {
        question: "Does Minnesota Medicaid cover doula services?",
        answer:
          "Yes. Minnesota was one of the first states to cover doula services through Medicaid, beginning in July 2014. Medical Assistance covers prenatal visits, continuous labor and delivery support, and postpartum visits. Doulas must be certified, registered with the Minnesota Doula Registry, and enrolled as MHCP providers. Ask your doula whether they are on the state registry.",
      },
      {
        question: "How much does Minnesota Medicaid reimburse doulas?",
        answer:
          "Effective January 1, 2024, Minnesota Medicaid reimburses certified doulas at $100 per prenatal or postpartum visit and $1,400 for attending a birth, for a total of approximately $3,200 per pregnancy. Doulas serving rural counties receive an enhanced birth attendance rate of $1,650. Telehealth is permitted for up to half of perinatal visits. These rates make Minnesota one of the highest reimbursing states for doula care in the nation.",
      },
      {
        question: "Do I need a license to practice as a doula in Minnesota?",
        answer:
          "No state license is required to practice as a doula in Minnesota. Certification is voluntary for private-pay clients. However, to serve Medical Assistance (Medicaid) members, doulas must be certified by an approved organization, registered with the Minnesota Doula Registry through the Minnesota Department of Health, and enrolled as MHCP providers. DONA International, CAPPA, and other national certifications are widely recognized.",
      },
      {
        question: "What is the cesarean rate in Minnesota?",
        answer:
          "Minnesota has an overall cesarean rate of approximately 30.0 percent (CDC NCHS, 2023 data), which is slightly below the national average of 32.3 percent. The low-risk cesarean rate is approximately 26.8 percent. Minnesota ranks 34th out of 52 reporting areas for low-risk cesarean birth. Rates vary by hospital, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in Minnesota?",
        answer:
          "Minnesota's maternal mortality rate is approximately 14.1 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), which ranks Minnesota 2nd best among the 48 reporting states. This is well below the national average and the Healthy People 2030 target of 15.7. Despite this strong ranking, racial disparities persist, with American Indian and Black mothers facing higher rates than white mothers.",
      },
      {
        question: "Are birth centers and home birth midwives licensed in Minnesota?",
        answer:
          "Yes. Minnesota licenses Certified Professional Midwives (CPMs) as Licensed Traditional Midwives (LTMs) through the Minnesota Department of Health. CPMs must earn certification through the North American Registry of Midwives (NARM) and apply for a state license. Certified Nurse Midwives (CNMs) are licensed through the Minnesota Board of Nursing. The Minnesota Birth Center, with locations in Minneapolis and St. Paul, is a well-established freestanding birth center staffed by midwives.",
      },
      {
        question: "Did Minnesota extend postpartum Medicaid coverage?",
        answer:
          "Yes. Minnesota has implemented a 12-month postpartum coverage extension, allowing eligible new mothers to maintain Medical Assistance coverage for a full year after giving birth. This supports postpartum recovery, follow-up care, and access to doula services during the extended postpartum period. Minnesota has also adopted Medicaid expansion, providing greater access to preventive care before, during, and after pregnancy.",
      },
    ],
  },

  OR: {
    state: "OR",
    stateName: "Oregon",
    medicaidNarrative:
      "Yes. Oregon was one of the first states in the nation to implement Medicaid doula coverage. The Oregon Health Authority (OHA) covers birth doula services through the Oregon Health Plan (OHP) as a covered benefit for members whose benefit package includes labor and delivery. Doula services are administered through OHA's Traditional Health Worker (THW) program, and doulas must be state-certified as Traditional Health Workers to serve OHP members and receive reimbursement. The benefit includes a global doula payment of approximately $1,505 per pregnancy, which covers two prenatal support visits, continuous labor and delivery support, and two postpartum support visits. Partial services can be billed individually when a doula provides some but not all components of the global benefit. Doulas enroll with OHA as providers under provider type 13, specialty code 600, and must complete form OHP 3113. Oregon's coordinated care organizations (CCOs), such as CareOregon, Trillium Community Health Plan, and Eastern Oregon Coordinated Care Organization, administer the benefit for their enrolled members. Oregon also provides 12 months of continuous postpartum OHP coverage, meaning eligible new mothers maintain full Medicaid benefits for an entire year after giving birth. Families should ask their doula whether they are state-certified as a Traditional Health Worker and enrolled as an OHP provider.",
    doulaRegulations:
      "Oregon has one of the most comprehensive state doula certification systems in the country. To become an Oregon state certified birth doula through the OHA Traditional Health Worker program, applicants must complete eleven requirements: a minimum of 28 contact hours of in-person education from an OHA-approved training program, six contact hours of cultural competency training, one hour of interprofessional collaboration training, one hour of HIPAA compliance training, four hours of trauma-informed care training, current CPR certification for children and infants and adults, a 1.5 hour OHA-approved oral health training, a community resource list for the geographical areas served, documented attendance at a minimum of three births, documented attendance at a minimum of three postpartum visits, and a background check. Midwifery education, nursing training, or online-only doula courses are not accepted as substitutes for the in-person training requirement. Oregon offers reciprocity for birth doulas certified in Alaska and Idaho. Doulas are not regulated as medical professionals; they provide non-clinical support. National certifying organizations such as DONA International and CAPPA are widely recognized, but state certification through the OHA THW program is the pathway to serving OHP members. Oregon licenses Licensed Direct-Entry Midwives (LDMs) through the Board of Direct Entry Midwifery under ORS 687.405. LDMs must hold a high school diploma or equivalent, maintain CPR and NRP certification, and complete an approved midwifery education program or meet experience-based requirements. Certified Professional Midwives (CPMs) are included in Oregon's licensure framework. Certified Nurse Midwives (CNMs) are licensed through the Oregon State Board of Nursing. Freestanding birth centers are licensed and regulated by the state.",
    birthStats: {
      cesareanRate: 29.0,
      maternalMortalityRate: 16.6,
      homeBirthRate: 2.7,
      birthCenterBirthRate: 1.5,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card; KFF State Health Facts",
    },
    faq: [
      {
        question: "Does Oregon Medicaid (OHP) cover doula services?",
        answer:
          "Yes. Oregon was one of the first states to cover doula services through the Oregon Health Plan. OHP covers birth doula services for members whose benefit package includes labor and delivery. The benefit includes approximately $1,505 per pregnancy covering two prenatal visits, labor and delivery support, and two postpartum visits. Doulas must be state-certified as Traditional Health Workers and enrolled as OHP providers. Ask your doula whether they are certified and enrolled.",
      },
      {
        question: "How do I become a certified birth doula in Oregon?",
        answer:
          "Oregon has a comprehensive state certification process through the OHA Traditional Health Worker program. Applicants must complete eleven requirements including 28 hours of in-person education from an OHA-approved training program, cultural competency training, HIPAA training, trauma-informed care training, CPR certification, oral health training, a community resource list, and documented attendance at three births and three postpartum visits. Online-only courses are not accepted as substitutes for in-person training.",
      },
      {
        question: "What is the cesarean rate in Oregon?",
        answer:
          "Oregon has an overall cesarean rate of approximately 29.0 percent (CDC NCHS, 2023 data), which is below the national average. The low-risk cesarean rate is approximately 24.0 percent, also lower than the national average. Oregon ranks among the better states for avoiding unnecessary cesarean sections. Rates vary by hospital, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "Are birth centers and home birth midwives licensed in Oregon?",
        answer:
          "Yes. Oregon licenses Licensed Direct-Entry Midwives (LDMs) through the Board of Direct Entry Midwifery under ORS 687.405. LDMs must meet education, CPR, and NRP requirements. Certified Professional Midwives (CPMs) are included in Oregon's licensure framework. Certified Nurse Midwives (CNMs) are licensed through the Oregon State Board of Nursing. Freestanding birth centers are licensed and regulated by the state. Oregon has one of the highest home birth rates in the country.",
      },
      {
        question: "Did Oregon extend postpartum Medicaid coverage?",
        answer:
          "Yes. Oregon provides 12 months of continuous postpartum OHP coverage, meaning eligible new mothers maintain full Medicaid benefits including physical, dental, vision, and mental health care for an entire year after giving birth. This extension supports postpartum recovery, follow-up care, and access to doula services during the extended postpartum period.",
      },
      {
        question: "What is the home birth rate in Oregon?",
        answer:
          "Oregon has one of the highest home birth rates in the United States at approximately 2.7 percent of births (CDC, 2023 data), ranking among the top states for out-of-hospital birth. The state also has a strong birth center network, with approximately 1.5 percent of births occurring in freestanding birth centers. Oregon's robust midwifery licensing framework supports these community birth options.",
      },
    ],
  },

  NJ: {
    state: "NJ",
    stateName: "New Jersey",
    medicaidNarrative:
      "Yes. New Jersey was one of the early adopters of Medicaid doula coverage. NJ FamilyCare (New Jersey Medicaid) began covering doula services on January 1, 2021, through the New Jersey Department of Health and the New Jersey Department of Human Services. The benefit covers prenatal visits, continuous labor and delivery support, and postpartum visits. Doulas must complete an approved community doula training program, pass a fingerprint-based criminal background check, maintain liability insurance with minimum coverage of $1,000,000 per incident and $3,000,000 aggregate, and enroll as fee-for-service providers with NJ FamilyCare. Doulas must also complete Supplemental Community Competency Training (SCCT) and contract with managed care organizations including Aetna, Fidelis Care, Horizon Blue Cross Blue Shield, United Healthcare Community Plan, and Wellpoint. Reimbursement is $1,065 for standard care and $1,331 for enhanced care per pregnancy. New Jersey also offers a $100 value-based incentive payment for doulas who complete at least one postpartum visit within six weeks of delivery. The NJ Doula Learning Collaborative (NJDLC), managed by the Department of Health, supports doula workforce development. Families should ask their doula whether they are enrolled as a NJ FamilyCare provider, as not all doulas have completed the enrollment process.",
    doulaRegulations:
      "New Jersey does not require a separate state doula license for all doulas, but it has one of the most structured Medicaid doula enrollment pathways in the country. To serve NJ FamilyCare members, doulas must complete an approved training program from a list maintained by the New Jersey Department of Health and Department of Human Services. Approved programs include the Children's Home Society of NJ AMAR Community-Based Doula Program, the Uzazi Village Perinatal Doula Training (offered through Children's Futures in Trenton, Community Doulas of South Jersey in Camden, and Sister to Sister Community Doulas of Essex County in Newark), the Partnership for Maternal and Child Health of Northern New Jersey, Ancient Song Labor Doula Certification, HealthConnect One Community Based Doula Training, CAPPA Labor Doula Certification, and DONA International Birth Doula Certification. After training, doulas must complete Supplemental Community Competency Training, pass a background check, secure liability insurance, and enroll as fee-for-service providers. There is no state doula licensing board for non-Medicaid doulas; they operate as community professionals. New Jersey licenses Certified Nurse Midwives (CNMs) through the New Jersey Board of Medical Examiners and the Board of Nursing, and Certified Professional Midwives (CPMs) through the New Jersey Board of Medical Examiners. Freestanding birth centers are licensed by the New Jersey Department of Health.",
    birthStats: {
      cesareanRate: 33.0,
      maternalMortalityRate: 26.0,
      homeBirthRate: 0.6,
      birthCenterBirthRate: 0.3,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; KFF State Health Facts; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does New Jersey Medicaid (NJ FamilyCare) cover doula services?",
        answer:
          "Yes. NJ FamilyCare has covered doula services since January 1, 2021. The benefit covers prenatal visits, labor and delivery support, and postpartum visits. Doulas must be enrolled as NJ FamilyCare providers. Ask your doula whether they are enrolled.",
      },
      {
        question: "Do I need a license to practice as a doula in New Jersey?",
        answer:
          "No state license is required for all doulas in New Jersey. However, to serve NJ FamilyCare members, doulas must complete an approved training program, pass a background check, maintain liability insurance, and enroll as fee-for-service providers. For private-pay clients, voluntary certification through DONA International, CAPPA, or similar organizations is widely recognized.",
      },
      {
        question: "How much does NJ FamilyCare reimburse for doula services?",
        answer:
          "NJ FamilyCare reimburses $1,065 for standard doula care and $1,331 for enhanced care per pregnancy. Doulas who complete at least one postpartum visit within six weeks of delivery receive an additional $100 value-based incentive payment. The benefit covers prenatal visits, labor and delivery support, and postpartum visits.",
      },
      {
        question: "What is the cesarean rate in New Jersey?",
        answer:
          "New Jersey has an overall cesarean rate of approximately 33 percent (CDC NCHS and KFF, 2023 data), which is slightly above the national average. The low-risk cesarean rate is approximately 26.7 percent. March of Dimes noted that New Jersey has made significant improvement in low-risk cesarean births. Rates vary by hospital and region, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in New Jersey?",
        answer:
          "New Jersey's maternal mortality rate is approximately 26.0 deaths per 100,000 live births (CDC NCHS, 2018 to 2022 data), which is above the national average. The March of Dimes 2025 Report Card ranks New Jersey 25th of 48 reporting states for maternal mortality. Significant racial disparities persist, with Black birthing individuals facing higher rates of maternal mortality. Access to doula care is part of New Jersey's strategy to address these disparities.",
      },
      {
        question: "Are birth centers and home birth midwives licensed in New Jersey?",
        answer:
          "Yes. New Jersey licenses freestanding birth centers through the Department of Health. Certified Nurse Midwives (CNMs) are licensed through the New Jersey Board of Medical Examiners and the Board of Nursing. Certified Professional Midwives (CPMs) are also licensed through the Board of Medical Examiners. Home birth is a recognized option for low-risk pregnancies with a licensed midwife.",
      },
      {
        question: "What is the preterm birth rate in New Jersey?",
        answer:
          "New Jersey's preterm birth rate was 9.4 percent in 2024, ranking the state 10th out of 52 jurisdictions. March of Dimes gave New Jersey a C+ grade on its 2025 Report Card. While this is better than the national average of 10.4 percent, significant racial disparities remain, with Black infants facing higher preterm birth rates than white infants.",
      },
      {
        question: "Did New Jersey extend postpartum Medicaid coverage?",
        answer:
          "Yes. New Jersey implemented a 12-month postpartum Medicaid coverage extension, allowing eligible new mothers to maintain NJ FamilyCare coverage for a full year after giving birth. This supports postpartum recovery, follow-up care, and access to doula services during the extended postpartum period.",
      },
    ],
  },

  MI: {
    state: "MI",
    stateName: "Michigan",
    medicaidNarrative:
      "Yes. Michigan Medicaid covers doula services through the MDHHS Doula Initiative. Coverage began in January 2023 under Medicaid policy bulletin MMP 22-47, and benefits were significantly expanded in October 2024 under MMP 24-40. The expanded benefit covers up to 12 doula visits per pregnancy, including prenatal and postpartum visits, plus in-person attendance during labor and delivery. The reimbursement rate for labor and delivery support increased to $1,500 per pregnancy. A statewide standing recommendation from Michigan's Chief Medical Executive means families do not need a separate physician referral to access doula services. Doulas must complete training from an MDHHS-approved doula training program and enroll as Medicaid providers through the CHAMPS system. Michigan also maintains the MDHHS Doula Registry, a searchable platform where families can find enrolled doulas in their area. Families should ask their doula whether they are enrolled as a Michigan Medicaid provider, as not all doulas have completed the registration process.",
    doulaRegulations:
      "Michigan does not require a separate state doula license for all doulas. Doulas are not regulated as medical professionals under Michigan law; they provide non-clinical emotional, physical, and informational support. However, to serve Michigan Medicaid clients, doulas must be at least 18 years of age, possess a high school diploma or equivalent, submit a training certificate from one of the MDHHS-approved doula training programs, and complete a multi-step enrollment process. This includes obtaining a Type 1 National Provider Identifier (NPI), registering for SIGMA Vendor Self-Service, creating a MILogin account, and completing an application in CHAMPS to select the doula specialty. Doulas must also credential or contract with Medicaid Health Plans (MHPs) to serve managed care members. National certifying organizations such as DONA International, CAPPA, and the International Doula Institute provide widely recognized certifications that many Michigan doulas hold voluntarily. The Michigan Doula Advisory Council, facilitated by MDHHS, informs the advancement of doula services statewide. Michigan does not currently license Certified Professional Midwives (CPMs), though Certified Nurse Midwives (CNMs) are licensed through the Michigan Board of Nursing.",
    birthStats: {
      cesareanRate: 32.7,
      maternalMortalityRate: 18.7,
      homeBirthRate: 1.1,
      birthCenterBirthRate: 0.3,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Michigan Medicaid cover doula services?",
        answer:
          "Yes. Michigan Medicaid has covered doula services since January 2023, with expanded benefits effective October 2024. The benefit covers up to 12 doula visits per pregnancy plus in-person attendance during labor and delivery. The labor and delivery reimbursement rate is $1,500 per pregnancy. A statewide standing recommendation from the Chief Medical Executive means no separate physician referral is needed. Ask your doula whether they are enrolled as a Michigan Medicaid provider.",
      },
      {
        question: "Do I need a license to practice as a doula in Michigan?",
        answer:
          "No state license is required for all doulas in Michigan. Doulas are not regulated as medical professionals. However, to serve Medicaid clients, doulas must be at least 18, have a high school diploma, complete training from an MDHHS-approved program, and enroll as providers through the CHAMPS system. For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "What is the maternal mortality rate in Michigan?",
        answer:
          "Michigan's maternal mortality rate is approximately 18.7 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), which ranks the state 12th of 48 reporting states. Black women are 2.8 times more likely to die from pregnancy-related causes than white women, and Detroit's maternal death rate is approximately three times the national average. Access to doula care is part of Michigan's strategy to address these disparities.",
      },
      {
        question: "What is the infant mortality rate in Michigan?",
        answer:
          "Michigan recorded its lowest infant mortality rate in history in 2023 at 6.1 deaths per 1,000 live births, with 607 infants dying before their first birthday. In 2024, the rate was 6.3 per 1,000 with 629 infant deaths. The infant mortality rate among babies born to Black mothers is 2.1 times the state rate. The March of Dimes gave Michigan a D+ grade on its 2025 Report Card, ranking the state 33rd out of 52 jurisdictions for infant mortality.",
      },
      {
        question: "Did Michigan extend postpartum Medicaid coverage?",
        answer:
          "Yes. Michigan extended postpartum Medicaid coverage from 60 days to 12 months, effective April 1, 2022. CMS approved the state plan amendment, allowing an estimated 16,000 additional new mothers to maintain coverage for a full year after giving birth. This extension supports postpartum recovery, follow-up care, and access to doula services during the extended postpartum period.",
      },
      {
        question: "How much does a doula cost in Michigan?",
        answer:
          "Birth doula packages in Michigan typically range from $800 to $2,000, with postpartum doulas charging $35 to $50 per hour. Costs vary by region, with Metro Detroit and Grand Rapids tending toward the higher end. Many Michigan doulas offer sliding-scale fees or payment plans. For Medicaid recipients, doula services are covered at no cost through the MDHHS Doula Initiative.",
      },
    ],
  },

  OH: {
    state: "OH",
    stateName: "Ohio",
    medicaidNarrative:
      "Yes. Ohio Medicaid began covering doula services on October 3, 2024, through the Ohio Department of Medicaid (ODM) Maternal and Infant Support Program (MISP). Any pregnant or postpartum person with Medicaid coverage is eligible to receive doula services from a doula certified by the Ohio Board of Nursing. The benefit covers up to four prenatal or postpartum visits and one labor and delivery support visit, with prior authorization available for additional medically necessary visits. Reimbursement is approximately $100 per prenatal or postpartum visit and $800 for labor and delivery support, totaling up to $1,200 per pregnancy. Doulas must be certified by the Ohio Board of Nursing and enrolled as Ohio Medicaid providers before they can bill for services. Managed care organizations including Buckeye Health Plan, CareSource, UnitedHealthcare Community Plan, and Amerihealth Caritas Ohio administer the benefit for their members. Families should ask their doula whether they are Board of Nursing certified and enrolled as an Ohio Medicaid provider, as not all doulas have completed the enrollment process. Ohio also extended postpartum Medicaid coverage from 60 days to 12 months effective April 1, 2022, which supports access to doula services during the full postpartum year.",
    doulaRegulations:
      "Ohio is one of the few states that requires formal state certification for doulas through the Ohio Board of Nursing. Under Ohio Administrative Code Chapter 4723-24, the Board of Nursing administers the doula certification program. To become a State of Ohio Certified Doula, applicants must complete at least 20 hours of relevant education or training, including a minimum of 12 hours in birth doula training from an approved program. Applicants must submit an application fee of $35, provide references, and meet continuing education requirements of 10 hours per renewal cycle. Certifications must be renewed annually. The Ohio Board of Nursing began accepting doula certification applications in 2024 ahead of the Medicaid benefit launch. Doulas who serve Medicaid members must hold this state certification and enroll as providers with ODM. For private-pay clients, voluntary national certifications from organizations such as DONA International, CAPPA, and the International Doula Institute are widely recognized, but state certification through the Board of Nursing is the pathway to serving Medicaid members. Ohio does not currently license Certified Professional Midwives (CPMs) at the state level. Certified Nurse Midwives (CNMs) are licensed through the Ohio Board of Nursing. Freestanding birth centers are licensed by the Ohio Department of Health, though Ohio has very few freestanding birth centers. The Ohio Birth Center in Columbus was the first freestanding birth center in central Ohio.",
    birthStats: {
      cesareanRate: 31.5,
      maternalMortalityRate: 25.4,
      homeBirthRate: 0.7,
      birthCenterBirthRate: 0.2,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card; KFF Maternal and Infant Health Profiles",
    },
    faq: [
      {
        question: "Does Ohio Medicaid cover doula services?",
        answer:
          "Yes. As of October 3, 2024, Ohio Medicaid covers doula services through the Maternal and Infant Support Program (MISP). Any pregnant or postpartum person with Medicaid coverage is eligible. The benefit covers up to four prenatal or postpartum visits and one labor and delivery support visit. Doulas must be certified by the Ohio Board of Nursing and enrolled as Medicaid providers. Ask your doula whether they are Board of Nursing certified and enrolled with Ohio Medicaid.",
      },
      {
        question: "How much does Ohio Medicaid reimburse for doula services?",
        answer:
          "Ohio Medicaid reimburses doulas approximately $100 per prenatal or postpartum visit (up to four visits) and $800 for labor and delivery support, for a total of up to $1,200 per pregnancy. Additional medically necessary visits may be approved through prior authorization. These rates apply to both fee-for-service and managed care Medicaid members.",
      },
      {
        question: "Do I need a license or certification to practice as a doula in Ohio?",
        answer:
          "Ohio requires state certification through the Ohio Board of Nursing for doulas who want to serve Medicaid members. Under Ohio Administrative Code Chapter 4723-24, applicants must complete at least 20 hours of training including 12 hours of birth doula training, submit a $35 application fee, and meet continuing education requirements. For private-pay clients, voluntary national certifications like DONA International are also widely recognized.",
      },
      {
        question: "What is the maternal mortality rate in Ohio?",
        answer:
          "Ohio's maternal mortality rate is approximately 25.4 deaths per 100,000 live births (America's Health Rankings, 5-year average through 2023), which is above the national average. The March of Dimes 2025 Report Card highlighted persistent racial disparities in maternal outcomes. Ohio has been actively expanding doula access through Medicaid coverage to help address these disparities and improve maternal health outcomes.",
      },
      {
        question: "What is the infant mortality rate in Ohio?",
        answer:
          "Ohio's infant mortality rate was 6.6 deaths per 1,000 live births in 2024, down from 7.1 in 2023. Despite this improvement, Ohio's rate remains above the national average of 5.6, ranking the state 43rd among all states. The preterm birth rate was 11.0 percent in 2024, with 13,914 babies born premature, ranking Ohio 37th out of 52 reporting areas. March of Dimes gave Ohio a D grade on its 2025 Report Card.",
      },
      {
        question: "Are birth centers licensed in Ohio?",
        answer:
          "Yes. Ohio licenses freestanding birth centers through the Ohio Department of Health. However, Ohio has very few freestanding birth centers. The Ohio Birth Center in Columbus was the first freestanding birth center in central Ohio. Ohio law requires freestanding birth centers to be licensed by the Department of Health, and birth centers must meet state staffing and safety requirements. Certified Nurse Midwives (CNMs) are licensed through the Ohio Board of Nursing.",
      },
      {
        question: "Did Ohio extend postpartum Medicaid coverage?",
        answer:
          "Yes. Ohio extended postpartum Medicaid coverage from 60 days to 12 months, effective April 1, 2022, following CMS approval. This means eligible new mothers can maintain Medicaid coverage for a full year after giving birth, which supports postpartum recovery, follow-up care, and access to doula services during the extended postpartum period.",
      },
      {
        question: "How much does a doula cost in Ohio?",
        answer:
          "Birth doula packages in Ohio typically range from $1,000 to $2,700, with postpartum doulas charging $35 to $45 per hour. Costs vary by region, with Cleveland, Columbus, and Cincinnati tending toward the higher end. Many Ohio doulas offer sliding-scale fees or payment plans. For Medicaid recipients, doula services are covered at no cost through Ohio Medicaid.",
      },
    ],
  },

  MA: {
    state: "MA",
    stateName: "Massachusetts",
    medicaidNarrative:
      "Yes. Massachusetts Medicaid, known as MassHealth, covers doula services for members during pregnancy, delivery, and up to 12 months after delivery, as well as for adoptive parents of infants under one year old. The benefit was announced on December 8, 2023 by the Healey-Driscoll administration and became available to members in spring 2024. MassHealth covers approximately 40 percent of all births in the Commonwealth, making this a significant expansion of access to birth support. The benefit covers labor and delivery support plus up to 8 total hours of perinatal visits during pregnancy and the 12 month postpartum period, with prior authorization available for additional visits. The MassHealth Chief Medical Officer issued a standing recommendation for doula services for all pregnant and postpartum MassHealth members, meaning no separate physician referral is required. Doulas must enroll as MassHealth providers under 130 CMR 463.000 and complete the free online MassHealth Doula Provider Training. Reimbursement rates are among the highest of any state Medicaid doula program, with perinatal visits up to 60 minutes reimbursed at $100, visits from 61 to 90 minutes at $150, and labor and delivery support at a flat $900 fee. Total perinatal visit reimbursement is capped at $800 per pregnancy without prior authorization. Families can search the MassHealth Provider Directory for enrolled doulas by selecting doula from the specialty drop down menu. Families should ask their doula whether they are enrolled as a MassHealth provider, as not all doulas have completed the enrollment process.",
    doulaRegulations:
      "Massachusetts does not require a separate state doula license for all doulas, but it has established a formal regulatory framework for doulas serving MassHealth members through 130 CMR 463.000. To enroll as a MassHealth doula provider, applicants must be at least 18 years old, complete the free online MassHealth Doula Provider Training, and demonstrate competency through either a Formal Training Pathway or an Experience Pathway. The Formal Training Pathway requires a certificate of completion or proof of doula certification from a recognized certifying organization. The Experience Pathway requires recommendations from at least three former clients and at least two licensed healthcare providers who observed the applicant providing doula services within the last five years. Doulas must also obtain a National Provider Identifier (NPI) and submit a complete application package including a signed MassHealth Provider Contract. Doulas are not regulated as medical professionals under Massachusetts law; they provide non-clinical support. National certifying organizations such as DONA International, CAPPA, and the International Doula Institute provide widely recognized certifications that many Massachusetts doulas hold voluntarily. Massachusetts licenses Certified Nurse Midwives (CNMs) through the Board of Registration in Nursing. Certified Professional Midwives (CPMs) are not currently licensed in Massachusetts, though advocacy organizations like the Bay State Birth Coalition continue to push for licensure. Freestanding birth centers operate under state regulations and are staffed by licensed midwives.",
    birthStats: {
      cesareanRate: 34.0,
      maternalMortalityRate: 14.4,
      homeBirthRate: 0.6,
      birthCenterBirthRate: 0.3,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Massachusetts Medicaid (MassHealth) cover doula services?",
        answer:
          "Yes. MassHealth covers doula services for pregnant, birthing, and postpartum members, including up to 12 months after delivery. The benefit includes labor and delivery support plus up to 8 hours of perinatal visits. The MassHealth Chief Medical Officer issued a standing recommendation, so no separate physician referral is required. Search the MassHealth Provider Directory and select doula from the specialty menu to find enrolled providers.",
      },
      {
        question: "How much does MassHealth reimburse for doula services?",
        answer:
          "MassHealth reimburses perinatal visits up to 60 minutes at $100 per visit, visits from 61 to 90 minutes at $150, and labor and delivery support at a flat $900 fee. Total perinatal visit reimbursement is capped at $800 per pregnancy without prior authorization. Additional visits can be approved through prior authorization if medically necessary. These rates are among the highest of any state Medicaid doula program.",
      },
      {
        question: "Do I need a license to practice as a doula in Massachusetts?",
        answer:
          "No state license is required for all doulas in Massachusetts. However, to serve MassHealth members, doulas must complete the free online MassHealth Doula Provider Training, obtain an NPI, and enroll as MassHealth providers under 130 CMR 463.000. Applicants can qualify through either a Formal Training Pathway (certification from a recognized organization) or an Experience Pathway (client and provider recommendations). For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "What is the cesarean rate in Massachusetts?",
        answer:
          "Massachusetts has an overall cesarean rate of approximately 34.0 percent (CDC NCHS, 2024 data), which is above the national average of 32.4 percent. The low-risk cesarean rate is 28.4 percent. The primary cesarean rate was 24.0 per 100 live births in 2024. Rates vary by hospital, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in Massachusetts?",
        answer:
          "Massachusetts has a maternal mortality rate of approximately 14.4 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), which ranks the state among the top ten best for maternal mortality. The infant mortality rate is 3.3 deaths per 1,000 live births, ranking Massachusetts 3rd best nationally. Despite these relatively strong outcomes, racial disparities persist, with Black infants facing approximately twice the infant mortality rate of white infants.",
      },
      {
        question: "Are birth centers licensed in Massachusetts?",
        answer:
          "Freestanding birth centers operate under Massachusetts state regulations and are staffed by licensed midwives, typically Certified Nurse Midwives (CNMs) licensed through the Board of Registration in Nursing. Certified Professional Midwives (CPMs) are not currently licensed in Massachusetts, though advocacy groups like the Bay State Birth Coalition continue to push for CPM licensure to expand out-of-hospital birth options.",
      },
      {
        question: "What is the preterm birth rate in Massachusetts?",
        answer:
          "Massachusetts has a preterm birth rate of 8.9 percent in 2024, ranking 3rd best among all reporting jurisdictions. March of Dimes gave Massachusetts a B grade on its 2025 Report Card. The state is implementing six of six supportive maternal and infant health initiatives identified in the Report Card. Despite this strong performance, racial disparities persist, with Black infants facing a preterm birth rate of 12.2 percent compared to 8.4 percent for white infants.",
      },
    ],
  },

  IN: {
    state: "IN",
    stateName: "Indiana",
    medicaidNarrative:
      "Yes. Indiana Medicaid began covering doula services effective July 2025, following the passage of Senate Bill 522 in January 2025. Indiana was one of the earliest states to authorize Medicaid doula reimbursement, having passed Act 416 in 2019, but that initial law was permissive rather than mandatory and no funds were appropriated, leaving it largely unenforceable. SB 522 changed the language from permissive to mandatory, requiring the Indiana Family and Social Services Administration (FSSA) to implement reimbursement. Prior to formal doula coverage, Indiana doulas could be reimbursed for some services through Medicaid if they were certified as community health workers. The March of Dimes 2025 Report Card confirms that Indiana Medicaid is actively reimbursing doula care as of September 2025. Indiana Medicaid, administered through Hoosier Healthwise and the Healthy Indiana Plan (HIP), covered approximately 32,379 births in 2024, representing 40.7 percent of all Indiana births. For the 2026 legislative session, Representative Vanessa Summers introduced HB 1049, which would expand doula coverage requirements to private insurance, HMO contracts, and state employee health plans effective July 1, 2026, though the bill died in committee in February 2026. Families should contact their Medicaid managed care organization and ask their doula whether they are enrolled as an Indiana Medicaid provider.",
    doulaRegulations:
      "Indiana does not require a separate state doula license for all doulas. Indiana Code section 12-7-2-69.7 defines a doula as an individual who is trained and certified by a nationally recognized institution in providing emotional and physical support, but not medical or midwife care, to pregnant women before, during, and after childbirth. Doulas are not regulated as medical professionals under Indiana law and there is no state doula licensing board. Voluntary certifications from organizations such as DONA International, CAPPA, and the International Doula Institute are widely recognized in the Indiana birth community. Indiana does regulate other birth professionals through formal pathways. Certified Direct Entry Midwives (CDEMs) are licensed through the Indiana Professional Licensing Agency (PLA) under the Medical Licensing Board, requiring a Certified Professional Midwife (CPM) credential from the North American Registry of Midwives (NARM), completion of a MEAC-approved midwifery program, a collaborative practice agreement with a licensed physician, and liability insurance of at least $100,000 per incident. Certified Nurse Midwives (CNMs) are licensed through the Indiana Board of Nursing. Freestanding birth centers are regulated under Indiana state law.",
    birthStats: {
      cesareanRate: 31.0,
      maternalMortalityRate: 31.4,
      homeBirthRate: 0.8,
      birthCenterBirthRate: 0.3,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Indiana Medicaid cover doula services?",
        answer:
          "Yes. Indiana Medicaid began covering doula services in July 2025 following the passage of Senate Bill 522. The 2019 Act 416 first authorized Medicaid doula reimbursement, but it was permissive and unfunded. SB 522 made coverage mandatory. The March of Dimes 2025 Report Card confirms Indiana is actively reimbursing doula care. Contact your Medicaid managed care organization and ask your doula whether they are enrolled as an Indiana Medicaid provider.",
      },
      {
        question: "Do I need a license to practice as a doula in Indiana?",
        answer:
          "No. Indiana does not require doulas to hold a state license. Indiana Code section 12-7-2-69.7 defines a doula as an individual trained and certified by a nationally recognized institution, but this is a definition, not a licensing requirement. Doulas are not regulated as medical professionals. Voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "What is the maternal mortality rate in Indiana?",
        answer:
          "Indiana's maternal mortality rate is approximately 31.4 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), ranking the state 38th of 48 reporting states. This is well above the national average and reflects significant racial disparities. The Indiana Maternal Mortality Review Committee found that Black women died at a rate of 170.9 per 100,000 live births. Access to doula care is part of Indiana's strategy to address these disparities.",
      },
      {
        question: "What is the cesarean rate in Indiana?",
        answer:
          "Indiana has an overall cesarean rate of approximately 31.0 percent (CDC NCHS, 2024 data), which is slightly below the national average of 32.4 percent. The low-risk cesarean rate is 24.9 percent, and Indiana ranks among the top twenty states with the lowest rates of low-risk cesarean births. The primary cesarean rate was 21.7 percent in 2024. Rates vary by hospital, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "Are birth centers and home birth midwives licensed in Indiana?",
        answer:
          "Yes. Indiana licenses Certified Direct Entry Midwives (CDEMs) through the Professional Licensing Agency (PLA). CDEM applicants must hold a Certified Professional Midwife (CPM) credential from the North American Registry of Midwives (NARM), complete a MEAC-approved midwifery program, maintain a collaborative practice agreement with a licensed physician, and carry liability insurance of at least $100,000 per incident. Certified Nurse Midwives (CNMs) are licensed through the Indiana Board of Nursing. Freestanding birth centers are regulated under Indiana state law.",
      },
      {
        question: "Did Indiana extend postpartum Medicaid coverage?",
        answer:
          "Yes. Indiana extended postpartum Medicaid coverage from 60 days to 12 months, effective under the American Rescue Plan option. This means eligible new mothers can maintain Medicaid coverage for a full year after giving birth, which supports postpartum recovery, follow-up care, and access to doula services during the extended postpartum period. Indiana is also implementing three of six supportive maternal and infant health initiatives identified in the March of Dimes 2025 Report Card.",
      },
    ],
  },

  NC: {
    state: "NC",
    stateName: "North Carolina",
    medicaidNarrative:
      "Not yet, but legislation is moving. North Carolina has not yet implemented Medicaid coverage for doula services, but Senate Bill 463, filed in March 2025 by Senator Burgin, would require NC Medicaid to cover doula services during pregnancy and the postpartum period. The bill directs the Department of Health and Human Services Division of Health Benefits (DHB) to seek CMS approval, develop service parameters, and determine credentialing requirements. The legislation appropriates $1,000,000 in recurring state funds per year of the 2025-2027 biennium, matched by $1,826,000 in federal funds, plus an additional $550,000 per year for doula workforce support. The bill passed its first Senate reading and was referred to the Committee on Rules and Operations of the Senate. Prior to statewide legislation, the NC Department of Health and Human Services provided funds to hire and train doulas in Edgecombe, Halifax, Nash, and Pitt counties through pilot programs. Carolina Complete Health, a Medicaid managed care plan, has offered doula education services to members who file a Notification of Pregnancy. Families should check with their Medicaid managed care plan for current doula-related benefits and monitor SB 463 progress.",
    doulaRegulations:
      "North Carolina does not require a state doula license and has no state doula licensing board. Doulas operate as community professionals providing non-clinical support. Voluntary certifications from organizations such as DONA International, CAPPA, and the International Doula Institute are widely recognized in the North Carolina birth community. North Carolina is notably restrictive on midwifery compared to most states. Certified Professional Midwives (CPMs) are not licensed in North Carolina, making it one of only a handful of states where CPM practice is effectively prohibited. Senate Bill 964, the Certified Professional Midwives Licensing Act, has been introduced to establish licensure for CPMs and birth centers, but had not passed as of early 2026. Certified Nurse Midwives (CNMs) are licensed through the North Carolina Board of Nursing and the Medical Board. North Carolina had six accredited birth centers as of September 2025. About 40 percent of NC counties have no hospital providing labor and delivery care, making community doula support especially important for rural families.",
    birthStats: {
      cesareanRate: 30.8,
      maternalMortalityRate: 18.6,
      homeBirthRate: 1.2,
      birthCenterBirthRate: 0.3,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does North Carolina Medicaid cover doula services?",
        answer:
          "Not yet as a statewide benefit, but Senate Bill 463, filed in March 2025, would require NC Medicaid to cover doula services during pregnancy and the postpartum period. The bill appropriates state and federal funds and directs the Division of Health Benefits to seek CMS approval. Prior to statewide coverage, NC DHHS funded doula training in select counties including Edgecombe, Halifax, Nash, and Pitt. Some Medicaid managed care plans may offer limited doula-related services. Check with your plan and monitor SB 463 progress.",
      },
      {
        question: "Do I need a license to practice as a doula in North Carolina?",
        answer:
          "No state license is required for doulas in North Carolina. There is no state doula licensing board. Doulas operate as community professionals providing non-clinical emotional and physical support. Voluntary certification through DONA International, CAPPA, or the International Doula Institute is widely recognized. Doulas are not regulated as medical professionals under North Carolina law.",
      },
      {
        question: "What is the cesarean rate in North Carolina?",
        answer:
          "North Carolina has an overall cesarean rate of approximately 30.8 percent (CDC NCHS, 2024 data), which is slightly below the national average of 32.4 percent. The low-risk cesarean rate is 24.9 percent, and North Carolina ranks among the top twenty states with the lowest rates of low-risk cesarean births. Rates vary by hospital, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in North Carolina?",
        answer:
          "North Carolina's maternal mortality rate is approximately 18.6 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), which is close to the national average. The state received a D+ grade from March of Dimes in 2025. Significant racial disparities persist, and about 20 of North Carolina's 100 counties are considered maternity care deserts. Access to doula care is seen as a key strategy to improve outcomes.",
      },
      {
        question: "Are birth centers and Certified Professional Midwives licensed in North Carolina?",
        answer:
          "Certified Nurse Midwives (CNMs) are licensed through the North Carolina Board of Nursing and the Medical Board. However, Certified Professional Midwives (CPMs) are not currently licensed in North Carolina, making it one of the most restrictive states for community midwifery. Senate Bill 964, the Certified Professional Midwives Licensing Act, has been introduced to change this. North Carolina had six accredited birth centers as of September 2025. Advocacy groups continue to push for CPM licensure to expand birth options, especially in rural maternity care deserts.",
      },
      {
        question: "What is the infant mortality rate in North Carolina?",
        answer:
          "North Carolina's infant mortality rate is approximately 6.9 deaths per 1,000 live births, ranking the state 41st nationally. In 2023, 834 babies died before their first birthday. Significant racial disparities exist, with Black babies dying at a rate of 12.1 per 1,000 live births compared to 5.2 for white babies. The preterm birth rate was 10.7 percent in 2024, and 18.6 percent of mothers received inadequate prenatal care.",
      },
    ],
  },

  IL: {
    state: "IL",
    stateName: "Illinois",
    medicaidNarrative:
      "Yes. Illinois Medicaid covers doula services as a covered benefit under Public Act 102-0004, with coverage effective February 1, 2024. The Illinois Department of Healthcare and Family Services (HFS) administers the benefit through both the fee-for-service program and HealthChoice Illinois managed care organizations. The benefit covers three categories of services: prenatal education and support (billed in 15-minute increments), labor and delivery support (one unit per pregnancy), and postpartum education and support (up to 12 months postpartum). The Illinois Department of Public Health (IDPH) issued a statewide standing recommendation for doula services, meaning no individual physician referral is required. Doulas must obtain certification through the Illinois Medicaid-Certified Doula Program administered by Southern Illinois University (SIU) School of Medicine before enrolling as Medicaid providers through the IMPACT system. Certification is valid for three years. Labor and delivery support is reimbursed at $720 per pregnancy, with prenatal and postpartum education at $15 per 15 minutes. Telehealth is permitted for education visits. Families should ask their doula whether they are certified through SIU and enrolled as an Illinois Medicaid provider.",
    doulaRegulations:
      "Illinois does not require a state doula license for all doulas, but it has established a formal certification pathway for doulas serving Medicaid members. Under Public Act 102-0004, doulas must obtain certification through the Illinois Medicaid-Certified Doula Program administered by Southern Illinois University (SIU) School of Medicine. SIU offers two pathways: the Training Program Pathway (for doulas who completed an approved training program) and the Legacy Pathway (for experienced doulas with documented birth support experience). Certification is free, valid for three years, and requires recertification. After certification, doulas must enroll as providers through the IMPACT system under provider type Health Support Professional with specialty Doula, obtain a National Provider Identifier (NPI), and use taxonomy code 374J00000X. Doulas are not regulated as medical professionals under Illinois law; they provide non-clinical support. National certifying organizations such as DONA International, CAPPA, and the International Doula Institute also provide widely recognized certifications. Illinois licenses Certified Professional Midwives (CPMs) through the Illinois Midwifery Board under the Licensed Certified Professional Midwife Practice Act (signed October 2022), and freestanding birth centers are licensed under the Birth Center Licensing Act (210 ILCS 170). Certified Nurse Midwives (CNMs) are licensed through the Illinois Department of Financial and Professional Regulation.",
    birthStats: {
      cesareanRate: 31.0,
      maternalMortalityRate: 20.0,
      homeBirthRate: 0.8,
      birthCenterBirthRate: 0.3,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Illinois Medicaid cover doula services?",
        answer:
          "Yes. As of February 1, 2024, Illinois Medicaid covers doula services under Public Act 102-0004. The benefit covers prenatal education, labor and delivery support, and postpartum education up to 12 months after birth. The Illinois Department of Public Health issued a standing recommendation, so no physician referral is required. Ask your doula whether they are certified through SIU and enrolled as an Illinois Medicaid provider.",
      },
      {
        question: "How much does Illinois Medicaid reimburse for doula services?",
        answer:
          "Illinois Medicaid reimburses labor and delivery support at $720 per pregnancy (one unit). Prenatal education (code S9445) and postpartum education (code S9444) are billed at $15 per 15-minute increment. Postpartum visit attendance with a practitioner (code 59430) is reimbursed at $50, with a maximum of two units per delivery. Initial newborn visit facilitation (code 99381) is $50. Group education sessions are reimbursed at $5 per 15 minutes. Telehealth is permitted for education and support codes.",
      },
      {
        question: "Do I need a license to practice as a doula in Illinois?",
        answer:
          "No state license is required for all doulas in Illinois. However, to serve Medicaid clients, doulas must obtain certification through the Illinois Medicaid-Certified Doula Program administered by SIU School of Medicine. SIU offers two pathways: a Training Program Pathway for newly trained doulas and a Legacy Pathway for experienced doulas. Certification is free and valid for three years. For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "What is the cesarean rate in Illinois?",
        answer:
          "Illinois has an overall cesarean rate of approximately 31.0 percent (CDC NCHS, 2024 data), which is slightly below the national average of 32.4 percent. The low-risk cesarean rate is 24.3 percent, ranking Illinois 16th best among states. The primary cesarean rate was 21.2 per 100 live births in 2024. Rates vary by hospital, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in Illinois?",
        answer:
          "Illinois has a maternal mortality rate of approximately 20.0 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), which ranks Illinois 17th best among 48 reporting states. The infant mortality rate is 5.9 deaths per 1,000 live births, ranking 30th nationally. Despite these mid-tier rankings, significant racial disparities persist, with Black infants facing an infant mortality rate 2.2 times the state rate.",
      },
      {
        question: "Are birth centers and Certified Professional Midwives licensed in Illinois?",
        answer:
          "Yes. Illinois licenses Certified Professional Midwives (CPMs) through the Illinois Midwifery Board under the Licensed Certified Professional Midwife Practice Act, signed into law in October 2022, making Illinois the 37th state to license CPMs. Freestanding birth centers are licensed under the Birth Center Licensing Act (210 ILCS 170). Certified Nurse Midwives (CNMs) are licensed through the Illinois Department of Financial and Professional Regulation. Doulas are separate from midwives and provide non-clinical support.",
      },
      {
        question: "Did Illinois extend postpartum Medicaid coverage?",
        answer:
          "Yes. Illinois extended postpartum Medicaid coverage from 60 days to 12 months, effective April 1, 2022, following CMS approval. This means eligible new mothers can maintain Medicaid coverage for a full year after giving birth, which supports postpartum recovery, follow-up care, and access to doula services during the extended postpartum period. The extension covers all pregnancies regardless of outcome.",
      },
    ],
  },

  PA: {
    state: "PA",
    stateName: "Pennsylvania",
    medicaidNarrative:
      "Yes. Pennsylvania Medicaid, known as Medical Assistance (MA), covers doula services as a covered benefit. Governor Josh Shapiro signed HB 1608 into law on October 29, 2024, making Pennsylvania the 13th state to provide Medicaid coverage for doula services. The Pennsylvania Department of Human Services (DHS) implemented the benefit through MA Bulletin 13-24-01, with certified doulas able to enroll as providers beginning January 1, 2025. Doulas must be certified as a Certified Perinatal Doula by the Pennsylvania Certification Board (PCB) and enroll as Provider Type 13 (Non-Traditional Provider) through the DHS PROMISe provider enrollment portal. Certified doulas contract with Medical Assistance Managed Care Organizations (MCOs) to serve their members. The benefit covers childbirth education and support services, including physical and emotional support during pregnancy, labor and delivery, and up to one year postpartum. The law also establishes a Doula Advisory Board to set standards and requirements for doulas practicing in Pennsylvania. It is important to note that doulas are not yet covered for people enrolled in Medical Assistance Fee-for-Service (also known as ACCESS), because they are not currently identified as a distinct provider type in the Pennsylvania Medicaid state plan. Coverage is available through MCOs only. Families should ask their doula whether they are enrolled as a Medical Assistance provider with their specific MCO, as not all doulas have completed the enrollment process.",
    doulaRegulations:
      "Pennsylvania does not require a separate state doula license for all doulas, but it has established a formal certification pathway through the Pennsylvania Certification Board (PCB) for doulas who want to serve Medical Assistance (Medicaid) members. To become a Certified Perinatal Doula through PCB, applicants must complete an approved doula training program, meet experience requirements, and pass the PCB certification process. Information on how to become a Certified Perinatal Doula is available on the PCB website at pacertboard.org/doula. Certified doulas then enroll as Provider Type 13 (Non-Traditional Provider) through the DHS PROMISe portal. The Doula Advisory Board, established by HB 1608, includes practicing doulas, representatives from state agencies, and other stakeholders who set standards and requirements for doulas practicing in Pennsylvania. Doulas are not regulated as medical professionals under Pennsylvania law; they provide non-clinical emotional, physical, and informational support. National certifying organizations such as DONA International, CAPPA, and the International Doula Institute also provide widely recognized certifications that many Pennsylvania doulas hold voluntarily. Pennsylvania licenses Certified Nurse Midwives (CNMs) through the Pennsylvania State Board of Medicine and the Board of Nursing. Certified Professional Midwives (CPMs) are not currently licensed in Pennsylvania, though advocacy organizations continue to push for licensure to expand out-of-hospital birth options. Freestanding birth centers operate under state regulations and are staffed by licensed midwives.",
    birthStats: {
      cesareanRate: 31.0,
      maternalMortalityRate: 17.7,
      homeBirthRate: 1.5,
      birthCenterBirthRate: 0.4,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; KFF Maternal and Infant Health Profiles; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Pennsylvania Medicaid cover doula services?",
        answer:
          "Yes. Pennsylvania Medical Assistance (Medicaid) covers doula services as a covered benefit. Governor Shapiro signed HB 1608 into law on October 29, 2024, and certified doulas could enroll as providers beginning January 1, 2025. The benefit covers childbirth education and support services during pregnancy, labor and delivery, and up to one year postpartum. Coverage is available through Medical Assistance Managed Care Organizations (MCOs). Ask your doula whether they are enrolled as a Medical Assistance provider with your MCO.",
      },
      {
        question: "Do I need a license to practice as a doula in Pennsylvania?",
        answer:
          "No state license is required for all doulas in Pennsylvania. However, to serve Medical Assistance (Medicaid) members, doulas must be certified as a Certified Perinatal Doula by the Pennsylvania Certification Board (PCB) and enroll as Provider Type 13 through the DHS PROMISe portal. The Doula Advisory Board, established by HB 1608, sets standards and requirements for doulas practicing in the state. For private-pay clients, voluntary certification through DONA International, CAPPA, or similar organizations is widely recognized.",
      },
      {
        question: "What is the cesarean rate in Pennsylvania?",
        answer:
          "Pennsylvania has an overall cesarean rate of approximately 31.0 percent (CDC NCHS and KFF, 2023 data), which is slightly below the national average of 32.4 percent. The low-risk cesarean rate is approximately 26.0 percent. Rates vary by hospital and region, with significant disparities by race and ethnicity. Ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in Pennsylvania?",
        answer:
          "Pennsylvania's maternal mortality rate is approximately 17.7 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), which ranks the state 10th best among 48 reporting states. Despite this relatively strong ranking, significant racial disparities persist. Access to doula care and birth support can help improve maternal outcomes and reduce disparities, which is why Pennsylvania expanded Medicaid coverage to include doula services.",
      },
      {
        question: "Are birth centers licensed in Pennsylvania?",
        answer:
          "Freestanding birth centers operate under Pennsylvania state regulations and are staffed by licensed midwives, typically Certified Nurse Midwives (CNMs) licensed through the State Board of Medicine and the Board of Nursing. Certified Professional Midwives (CPMs) are not currently licensed in Pennsylvania, though advocacy organizations continue to push for licensure to expand out-of-hospital birth options. Home birth is a recognized option for low-risk pregnancies with a licensed midwife.",
      },
      {
        question: "Did Pennsylvania extend postpartum Medicaid coverage?",
        answer:
          "Yes. Pennsylvania extended postpartum Medicaid coverage from 60 days to 12 months, following CMS approval of the state plan amendment. This allows eligible new mothers to maintain Medical Assistance coverage for a full year after giving birth, which supports postpartum recovery, follow-up care, and access to doula services during the extended postpartum period.",
      },
      {
        question: "What is the preterm birth rate in Pennsylvania?",
        answer:
          "Pennsylvania's preterm birth rate was 9.8 percent in 2024, ranking the state 17th out of 52 reporting jurisdictions. March of Dimes gave Pennsylvania a C grade on its 2025 Report Card. While this is better than the national average of 10.4 percent, significant racial disparities remain, with Black infants facing a preterm birth rate of 12.9 percent compared to 8.7 percent for white infants.",
      },
    ],
  },


  AZ: {
    state: "AZ",
    stateName: "Arizona",
    medicaidNarrative:
      "Yes. Arizona Medicaid (AHCCCS) began covering doula services as a covered benefit effective October 1, 2024. The Arizona Health Care Cost Containment System (AHCCCS) implemented the benefit after CMS approved a State Plan Amendment (SPA) submitted in July 2024. The legislation originated with Senate Bill 1181, passed by the Arizona Legislature in 2021, which established a voluntary doula licensing program through the Arizona Department of Health Services (ADHS). To bill AHCCCS, doulas must first be state-certified by ADHS, then register as AHCCCS providers through the AHCCCS Provider Enrollment Portal (APEP) and obtain a National Provider Identifier (NPI) number. Notably, certification through a national or international doula organization alone does NOT meet the AHCCCS requirement; doulas must be state-certified by ADHS specifically. The benefit covers doula services during pregnancy, labor and delivery, and up to one year postpartum. There is no minimum or maximum number of visits required, and no prior authorization is needed. A referral from an AHCCCS-registered provider (physician, certified nurse-midwife, or other eligible provider type) is required before doula services begin, but the member does not need to have a high-risk pregnancy to qualify. All pregnant or postpartum AHCCCS members are eligible. Families should ask their doula whether they are ADHS-certified and enrolled as an AHCCCS registered provider.",
    doulaRegulations:
      "Arizona established a voluntary doula licensing program through the Arizona Department of Health Services (ADHS) under Senate Bill 1181, enacted in 2021 as Laws 2021, Chapter 282. The program is voluntary, meaning doulas are not required to be state-certified to practice as a doula in Arizona. However, to serve AHCCCS (Medicaid) members and receive reimbursement, doulas must be state-certified by ADHS. Certification requirements include being at least 18 years old, having a high school diploma or equivalent, completing at least 30 hours of instruction in core competency topics (in-person or a combination of in-person and online), observing at least one birth after training, attending at least three births as the primary doula support person with acceptable evaluations from the laboring mother and medical provider, completing first aid and CPR training, and submitting a code of ethics agreement. Doulas who have been practicing for at least five years and hold current certification from a nationally recognized doula organization may apply through an alternative pathway with three letters of recommendation from healthcare professionals. State-certified doula licenses are valid for three years and require 15 hours of continuing education for renewal. National certifications from organizations such as DONA International, CAPPA, and the International Doula Institute are widely recognized but do not substitute for ADHS state certification when billing AHCCCS. Arizona also licenses Certified Professional Midwives (CPMs) as Licensed Midwives through the Arizona Department of Health Services, and Certified Nurse Midwives (CNMs) through the Arizona Board of Nursing. Freestanding birth centers are licensed by the state.",
    birthStats: {
      cesareanRate: 29.0,
      maternalMortalityRate: 30.4,
      homeBirthRate: 1.2,
      birthCenterBirthRate: 0.3,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card; KFF State Health Facts",
    },
    faq: [
      {
        question: "Does Arizona Medicaid (AHCCCS) cover doula services?",
        answer:
          "Yes. AHCCCS began covering doula services on October 1, 2024. The benefit covers doula support during pregnancy, labor and delivery, and up to one year postpartum. There is no minimum or maximum number of visits, and no prior authorization is required. A referral from an AHCCCS-registered provider is needed before services begin. Ask your doula whether they are ADHS-certified and enrolled as an AHCCCS provider.",
      },
      {
        question: "Do I need a license to practice as a doula in Arizona?",
        answer:
          "State certification is voluntary, meaning doulas are not required to be state-certified to practice in Arizona. However, to serve AHCCCS (Medicaid) members and receive reimbursement, doulas must be state-certified by the Arizona Department of Health Services (ADHS). Certification requires at least 30 hours of training, observing one birth, attending three births as primary support, CPR and first aid training, and a code of ethics agreement. National doula certifications alone do not meet the AHCCCS requirement.",
      },
      {
        question: "How much does AHCCCS reimburse for doula services?",
        answer:
          "AHCCCS reimburses doula services using two billing codes. T1032 covers per-15-minute services at $16.28 per unit (up to 8 units or 2 hours per day). T1033 is a per diem code for labor and delivery support, reimbursed at $781.32, billable once per 9-month period. There is no minimum or maximum visit limit. These rates went into effect October 1, 2024.",
      },
      {
        question: "What is the cesarean rate in Arizona?",
        answer:
          "Arizona has an overall cesarean rate of approximately 29 percent (KFF, 2023 data), which is below the national average of approximately 32 percent. The low-risk cesarean rate is approximately 23 percent, ranking Arizona among the top twenty states with the lowest rates of low-risk cesarean births. Rates vary by hospital and region, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in Arizona?",
        answer:
          "Arizona's maternal mortality rate is approximately 30.4 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019 to 2023 data), which ranks 36th of 48 reporting states. This is above the national average and above the Healthy People 2030 target of 15.7 deaths per 100,000 live births. The infant mortality rate is 5.5 deaths per 1,000 live births, ranking Arizona 21st of 52 jurisdictions. Expanding doula access through AHCCCS coverage is part of Arizona's strategy to address maternal health outcomes.",
      },
      {
        question: "Are birth centers and home birth midwives licensed in Arizona?",
        answer:
          "Yes. Arizona licenses Certified Professional Midwives (CPMs) as Licensed Midwives through the Arizona Department of Health Services. Licensed Midwives must meet standards set by the North American Registry of Midwives (NARM). Certified Nurse Midwives (CNMs) are licensed through the Arizona Board of Nursing. Freestanding birth centers are licensed by the state, and AHCCCS covers home birth with Licensed Midwives and CNMs, making Arizona one of 14 states with CPM or Licensed Midwife Medicaid coverage.",
      },
    ],
  },

  ID: {
    state: "ID",
    stateName: "Idaho",
    medicaidNarrative:
      "No. As of 2026, Idaho Medicaid does not cover doula services as a standard benefit. According to KFF and the National Health Law Program Doula Medicaid Project (updated October 2025), Idaho has not implemented a Medicaid doula coverage benefit and there is no active state plan amendment to do so. Idaho is one of the remaining states that has not yet acted on Medicaid doula coverage despite growing national momentum. The March of Dimes 2025 Report Card notes that Idaho is not currently reimbursing doula care through Medicaid. However, Idaho did extend postpartum Medicaid coverage to 12 months effective January 1, 2025, after CMS approved the state plan amendment on January 17, 2025, making Idaho the 48th state to adopt the extension. Families enrolled in Idaho Medicaid should contact their managed care plan to ask about any pilot programs or community-based doula services that may be available through grants or local health districts. Advocacy groups including the Doula Collective of Idaho and Empowered Birth Idaho continue working to expand doula access, and some community-based organizations offer sliding-scale doula care.",
    doulaRegulations:
      "Idaho does not require doulas to hold a state-issued license or certification. Doulas are not regulated as medical professionals under Idaho law, and there is no state doula licensing board. Certification through a private training organization such as DONA International, CAPPA, or the International Doula Institute is voluntary but recommended. Since Idaho Medicaid does not currently cover doula services, there is no Medicaid provider enrollment pathway for doulas as there is in states with covered benefits. Idaho does regulate midwives separately through the Idaho Division of Occupational and Professional Licenses (DOPL). Effective July 1, 2024, the Board of Midwifery was consolidated with the Board of Nursing. Idaho issues Licensed Direct-Entry Midwife (LDM) licenses to non-nurse midwives who hold the Certified Professional Midwife (CPM) credential from the North American Registry of Midwives (NARM). Certified Nurse Midwives (CNMs) are licensed through the Idaho Board of Nursing. The LDM pathway allows qualified midwives to legally attend planned home births and freestanding birth center births for low-risk pregnancies.",
    birthStats: {
      cesareanRate: 24.0,
      maternalMortalityRate: 19.9,
      homeBirthRate: 4.7,
      birthCenterBirthRate: 0.4,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; KFF Maternal and Infant Health Profiles; March of Dimes 2025 Report Card; Statista home birth data (2023)",
    },
    faq: [
      {
        question: "Does Idaho Medicaid cover doula services?",
        answer:
          "Not yet. As of 2026, Idaho Medicaid does not cover doula services as a standard benefit. Idaho has not implemented a Medicaid doula coverage program and there is no active state plan amendment. Families should check with their Medicaid managed care plan about any available pilot programs and explore community-based doulas who offer sliding-scale fees. The Doula Collective of Idaho and Empowered Birth Idaho are local organizations working to expand access.",
      },
      {
        question: "Do I need a license to practice as a doula in Idaho?",
        answer:
          "No. Idaho does not require doulas to hold a state license or certification. Doulas are not regulated as medical professionals under Idaho law, and there is no state doula licensing board. Voluntary certification through DONA International, CAPPA, or similar organizations is widely recognized and many Idaho doulas hold these credentials.",
      },
      {
        question: "What is the cesarean rate in Idaho?",
        answer:
          "Idaho has an overall cesarean rate of approximately 24 percent (CDC NCHS, 2023 data), which is among the lowest in the nation and well below the national average of approximately 32 percent. The low-risk cesarean rate is approximately 20 percent, ranking Idaho third best in the country according to the March of Dimes 2025 Report Card. Rates vary by hospital and region, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in Idaho?",
        answer:
          "Idaho's maternal mortality rate is approximately 19.9 deaths per 100,000 live births (CDC NCHS, 2019 to 2023 data), ranking 15th of 48 reporting states. This is slightly below the national average. The March of Dimes 2025 Report Card notes that Idaho's maternal mortality direction has improved. Access to doula care and birth support can help further improve maternal outcomes and reduce disparities.",
      },
      {
        question: "Are home births and birth centers legal in Idaho?",
        answer:
          "Yes. Idaho has one of the highest home birth rates in the country at approximately 4.7 percent of births (Statista, 2023 data). Idaho licenses Licensed Direct-Entry Midwives (LDMs) through the Division of Occupational and Professional Licenses (DOPL). LDM applicants must hold the Certified Professional Midwife (CPM) credential from NARM. Certified Nurse Midwives (CNMs) are licensed through the Idaho Board of Nursing. Freestanding birth centers operate under state regulation, though the birth center birth rate remains low at approximately 0.4 percent.",
      },
      {
        question: "Did Idaho extend postpartum Medicaid coverage?",
        answer:
          "Yes. Idaho extended postpartum Medicaid coverage from 60 days to 12 months, effective January 1, 2025. CMS approved the state plan amendment on January 17, 2025, making Idaho the 48th state to adopt the 12-month postpartum extension. This means eligible new mothers can maintain Medicaid coverage for a full year after giving birth, which supports postpartum recovery and follow-up care.",
      },
    ],
  },

  UT: {
    state: "UT",
    stateName: "Utah",
    medicaidNarrative:
      "Yes, newly authorized. Utah passed SB 284 in the 2025 legislative session, signed by Governor Cox on March 19, 2025, authorizing the Medicaid program to cover doula services. Under the law, the Utah Department of Health and Human Services must apply for a Medicaid state plan amendment to cover doula services by October 1, 2025. The department is required to develop the state plan amendment in consultation with stakeholders including patients, doulas, physicians, nurses, and health care facilities. If the amendment is approved by CMS, the Medicaid program will provide coverage of doula services, defined as non-medical advice, information, emotional support, and physical comfort provided during pregnancy, childbirth, and the postpartum period. The department will establish training and registration requirements for doulas serving Medicaid enrollees through administrative rule. University of Utah Health Plans (Healthy U Medicaid and Health Choice Utah) began implementing doula coverage ahead of the statewide rollout, with reimbursement for prenatal and postpartum support at $11.59 per 15 minutes (code T1032, up to 8 hours total) and labor support at $834.28 per diem (code T1033, one unit per rolling year). Doulas contracting with U of U Health Plans must hold Basic Life Support (BLS) certification and be certified through an approved agency such as DONA International, CAPPA, the National Doula Certification Board, ProDoula, Childbirth International, ICEA, Birth Boot Camp, or Health Connect One. Families should ask their doula whether they are enrolled as a Utah Medicaid provider and check with their managed care plan for current coverage status, as the benefit is still being phased in.",
    doulaRegulations:
      "Utah does not require a state doula license or certification for all doulas. Doulas are not regulated as medical professionals under Utah law, and there is no state doula licensing board. SB 284, enacted in 2025, authorizes the Department of Health and Human Services to establish training and registration requirements for doulas serving Medicaid enrollees, but this is a Medicaid enrollment requirement rather than a statewide professional license. For private practice, doulas in Utah operate as community professionals and hold voluntary certifications from organizations such as DONA International, CAPPA, the International Doula Institute, and others. Utah has a distinctive midwifery landscape. Certified Nurse Midwives (CNMs) are licensed through the Utah Division of Occupational and Professional Licensing under the Nurse Midwife Practice Act (Title 58, Chapter 44a). Utah is unique among states in that it is legal to practice as a direct-entry midwife with or without a license under the Direct-Entry Midwife Act (Title 58, Chapter 77). Licensed Direct-Entry Midwives (LDEMs) must hold the Certified Professional Midwife (CPM) credential from the North American Registry of Midwives (NARM), complete a MEAC-approved midwifery program, and meet neonatal resuscitation certification requirements. Unlicensed direct-entry midwives (UDEMs) may practice legally but are not subject to the same scope-of-practice restrictions, training requirements, or regulatory oversight. Approximately 70 LDEMs and more than 80 UDEMs practice in Utah. Birthing centers are licensed by the Department of Health and Human Services under Utah Code 26B-2-228, which permits all types of licensed maternity care practitioners to practice in birth centers and prohibits the state from requiring admitting privileges, transfer agreements, or physician supervision. Birth centers with only one birth room are exempt from licensure. Utah also recognizes alongside midwifery units, which must be accredited by the Commission on Accreditation of Birth Centers and connected to a hospital facility.",
    birthStats: {
      cesareanRate: 24.7,
      maternalMortalityRate: 20.3,
      homeBirthRate: 3.8,
      birthCenterBirthRate: 1.2,
      dataYear: 2023,
      dataSource: "CDC NCHS, National Vital Statistics System; Utah Department of Health and Human Services IBIS-PH (maternal mortality 2020-2022); March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Utah Medicaid cover doula services?",
        answer:
          "Yes, but coverage is being phased in. Utah passed SB 284 in 2025, authorizing Medicaid coverage for doula services. The state must apply for a Medicaid state plan amendment by October 1, 2025, and if approved by CMS, doula services will be covered statewide. University of Utah Health Plans (Healthy U Medicaid and Health Choice Utah) has already begun implementing doula coverage ahead of the full rollout. Contact your managed care plan to ask whether doula services are currently covered and at what reimbursement rate.",
      },
      {
        question: "How much does Utah Medicaid reimburse for doula services?",
        answer:
          "Through University of Utah Health Plans, prenatal and postpartum support is reimbursed at $11.59 per 15 minutes (up to 8 hours total, billed as code T1032), and labor support is reimbursed at $834.28 per diem (code T1033, one unit per rolling year). Total reimbursement per pregnancy can reach approximately $1,100 to $1,400 depending on the number of visits. Balance billing of Medicaid members is not allowed. Exact statewide rates will be established through the Medicaid state plan amendment process.",
      },
      {
        question: "Do I need a license to practice as a doula in Utah?",
        answer:
          "No. Utah does not require a state license or certification for doulas. Doulas are not regulated as medical professionals under Utah law. To serve Medicaid clients under SB 284, doulas will need to meet training and registration requirements established by the Department of Health and Human Services through administrative rule. For Medicaid contracting through University of Utah Health Plans, doulas must hold Basic Life Support (BLS) certification and be certified through an approved agency such as DONA International, CAPPA, the National Doula Certification Board, ProDoula, Childbirth International, ICEA, Birth Boot Camp, or Health Connect One.",
      },
      {
        question: "What is the cesarean rate in Utah?",
        answer:
          "Utah has an overall cesarean rate of approximately 24.7 percent (CDC NCHS, 2023 data), which is below the national average of approximately 32.3 percent and ranks Utah among the top ten states with the lowest cesarean rates. The low-risk cesarean rate is approximately 21 percent. Rates vary by hospital and region, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "What is the maternal mortality rate in Utah?",
        answer:
          "Utah's pregnancy-related mortality ratio is approximately 20.3 deaths per 100,000 live births (Utah Department of Health and Human Services, 2020-2022 data). The March of Dimes 2025 Report Card ranks Utah 12th out of 52 reporting jurisdictions and among the top ten best states for low rates of severe maternal morbidity and maternal mortality. The Healthy People 2030 target is 15.7 deaths per 100,000 live births.",
      },
      {
        question: "Are birth centers licensed in Utah?",
        answer:
          "Yes. Utah licenses birthing centers through the Department of Health and Human Services under Utah Code 26B-2-228. The law permits all types of licensed maternity care practitioners, including physicians, certified nurse midwives, and licensed direct-entry midwives, to practice in birth centers. The state may not require birth centers to maintain admitting privileges, transfer agreements, or physician supervision. Birth centers with only one birth room are exempt from licensure. Utah also recognizes alongside midwifery units, which must be accredited by the Commission on Accreditation of Birth Centers and connected to a hospital.",
      },
      {
        question: "Are midwives licensed in Utah?",
        answer:
          "Yes, but with a unique twist. Utah licenses Certified Nurse Midwives (CNMs) through the Nurse Midwife Practice Act and Licensed Direct-Entry Midwives (LDEMs) through the Direct-Entry Midwife Act. LDEMs must hold the Certified Professional Midwife (CPM) credential from NARM. However, Utah is one of the only states where it is legal to practice as a direct-entry midwife without a license. Unlicensed direct-entry midwives (UDEMs) may practice legally but are not subject to the same scope-of-practice restrictions, training requirements, or regulatory oversight as LDEMs. About 70 LDEMs and more than 80 UDEMs practice in Utah. Doulas are not midwives and provide non-clinical support.",
      },
    ],
  },

  OK: {
    state: "OK",
    stateName: "Oklahoma",
    medicaidNarrative:
      "Yes. Oklahoma's Medicaid program, SoonerCare, began covering doula services as a covered benefit on July 1, 2023, making Oklahoma the 11th state Medicaid program nationally to cover doula care. The Oklahoma Health Care Authority (OHCA) implemented the benefit under OAC 317:30-5-1215 following State Plan Amendment 23-0014. The benefit covers up to 8 prenatal and postpartum visits plus 1 labor and delivery support visit per pregnancy. Doula services are available for 12 months postpartum, depending on continued SoonerCare eligibility. A referral from a licensed healthcare provider (obstetrician, certified nurse midwife, physician, physician assistant, or certified nurse practitioner) is required before doula services can begin. SoonerCare covered more than 23,694 births in Oklahoma in 2024, approximately 49.7 percent of all births in the state. Doulas must enroll as SoonerCare providers, hold a National Provider Identifier (NPI), and be certified by one of the recognized certifying organizations approved by OHCA. Families should ask their doula whether they are enrolled as a SoonerCare provider, as not all doulas have completed the enrollment process.",
    doulaRegulations:
      "Oklahoma does not require a separate state doula license for all doulas. Doulas are not regulated as medical professionals under Oklahoma law; they provide non-clinical support. However, to serve SoonerCare (Medicaid) members, doulas must be at least 18 years of age, hold a National Provider Identifier (NPI), use the state-required taxonomy number, and be certified by one of approximately 30 recognized certifying organizations approved by the Oklahoma Health Care Authority (OHCA). These recognized organizations include DONA International, CAPPA, Birth Arts International, Birth Boot Camp, International Doula Institute, National Black Doulas Association, and several community-based training programs. Doulas are not regulated as medical professionals and their services should not replace the care provided by physicians, physician assistants, advanced practice registered nurses, or certified nurse midwives. Oklahoma licenses Certified Nurse Midwives (CNMs) through the Oklahoma Board of Nursing. The state does not currently license Certified Professional Midwives (CPMs), though advocacy efforts continue. Freestanding birth centers operate under state regulations.",
    birthStats: {
      cesareanRate: 33.0,
      maternalMortalityRate: 27.3,
      homeBirthRate: 0.9,
      birthCenterBirthRate: 0.3,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card",
    },
    faq: [
      {
        question: "Does Oklahoma Medicaid (SoonerCare) cover doula services?",
        answer:
          "Yes. As of July 1, 2023, SoonerCare covers doula services for pregnant and postpartum members. The benefit includes up to 8 prenatal and postpartum visits plus 1 labor and delivery support visit per pregnancy. A referral from a licensed healthcare provider is required. Ask your doula whether they are enrolled as a SoonerCare provider.",
      },
      {
        question: "How much does SoonerCare reimburse for doula services in Oklahoma?",
        answer:
          "Oklahoma Medicaid reimburses doula services at approximately $1,043.38 for vaginal delivery support and $1,062.10 for cesarean delivery support. Prenatal and postpartum visits are reimbursed at 40 percent of the physician fee schedule. The total benefit covers up to 8 prenatal or postpartum visits plus 1 labor and delivery visit per pregnancy.",
      },
      {
        question: "Do I need a license to practice as a doula in Oklahoma?",
        answer:
          "No state license is required for all doulas in Oklahoma. Doulas are not regulated as medical professionals. However, to serve SoonerCare (Medicaid) members, doulas must be at least 18 years old, hold a National Provider Identifier (NPI), and be certified by one of the OHCA-approved certifying organizations. For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "What is the maternal mortality rate in Oklahoma?",
        answer:
          "Oklahoma's maternal mortality rate is approximately 27.3 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), ranking Oklahoma 31st of 48 reporting states. The Healthy People 2030 target is 15.7 deaths per 100,000 live births, meaning Oklahoma has significant work to do in reducing maternal mortality. Access to doula care can help improve maternal outcomes.",
      },
      {
        question: "What is the infant mortality rate in Oklahoma?",
        answer:
          "Oklahoma's infant mortality rate is 7.1 deaths per 1,000 live births (CDC NCHS, 2023 data), ranking the state 46th out of 52 reporting jurisdictions. In 2023, 341 babies died before their first birthday. The infant mortality rate among babies born to Black mothers is 1.7 times the state rate, highlighting significant racial disparities.",
      },
      {
        question: "Did Oklahoma extend postpartum Medicaid coverage?",
        answer:
          "Yes. Oklahoma extended postpartum SoonerCare coverage from 60 days to 12 months. OHCA also raised the income threshold for full-scope pregnancy-related benefits to 205 percent of the federal poverty level. This means eligible new mothers can maintain Medicaid coverage for a full year after giving birth, which supports postpartum recovery and access to doula services during the extended postpartum period.",
      },
    ],
  },

  SC: {
    state: "SC",
    stateName: "South Carolina",
    medicaidNarrative:
      "Not yet, but legislation is advancing. As of 2026, South Carolina Medicaid (Healthy Connections) does not yet cover doula services as a standard benefit, though the state is actively progressing toward coverage. House Bill 3108, introduced in January 2025 by Rep. Kambrell Garvin (D-Richland) and Rep. Tommy Pope (R-York) with bipartisan support, would require both Medicaid and private insurance to cover doula services throughout South Carolina. The bill passed the House Labor, Commerce and Industry Committee and is advancing through the legislature. Companion Senate Bill 42 extends similar coverage requirements to lactation services. H 3108 establishes a doula certification organization, a statewide registry, and sets Medicaid enrollment criteria including an NPI number, provider enrollment, and training in core competencies. The March of Dimes 2025 Report Card notes that South Carolina is progressing legislation but not yet reimbursing doula care. Medicaid pays for approximately 43 percent of births in South Carolina, making this coverage gap significant for families. Community-based doula programs like BirthMatters, BEE Collective, and Family Solutions provide culturally responsive care in Columbia and Charleston, often with sliding-scale fees. The South Carolina Doula Steering Committee, established in 2022, has been advocating for equitable doula reimbursement and helped shape the legislative dialogue. Families should check with their Healthy Connections managed care organization about any pilot programs, and explore community doulas who offer sliding-scale fees.",
    doulaRegulations:
      "South Carolina does not currently require doulas to hold a state-issued license or certification. Doulas are not regulated as medical professionals under South Carolina law, and there is no state doula licensing board. House Bill 3108, introduced in 2025, would create a doula certification organization under Chapter 145 of Title 44 of the South Carolina Code and establish a statewide registry of certified doulas, but this legislation had not been enacted into law as of early 2026. The bill defines a scope of practice for doulas and prohibits them from practicing medicine. To qualify for Medicaid reimbursement under the proposed framework, doulas would need an NPI number, a training certificate from a recognized organization (including ICEA, DONA, toLabor, Birthworks, CAPPA, Childbirth International, the International Center for Traditional Childbearing, or Commonsense Childbirth), and attestation of training in core competencies including childbirth education, breastfeeding, cultural competency, HIPAA, CPR, and food safety. Voluntary certifications from organizations such as DONA International, CAPPA, and the International Doula Institute are widely recognized in the South Carolina birth community. South Carolina licenses birth centers through Regulation 60-102 (Standards for Licensing Birthing Centers) and regulates Certified Nurse Midwives (CNMs) through the South Carolina Board of Nursing. Direct-entry midwifery is not licensed separately in South Carolina, meaning CPMs do not have a state regulatory pathway.",
    birthStats: {
      cesareanRate: 33.0,
      maternalMortalityRate: 31.5,
      homeBirthRate: 0.6,
      birthCenterBirthRate: 0.2,
      dataYear: 2024,
      dataSource: "CDC NCHS, National Vital Statistics System; March of Dimes 2025 Report Card; KFF State Health Facts",
    },
    faq: [
      {
        question: "Does South Carolina Medicaid cover doula services?",
        answer:
          "Not yet, but legislation is advancing. South Carolina Medicaid (Healthy Connections) does not currently cover doula services as a standard benefit. House Bill 3108, introduced in 2025 with bipartisan support, would require both Medicaid and private insurance to cover doula services. The March of Dimes 2025 Report Card notes South Carolina is progressing legislation but not yet reimbursing doula care. Check with your Healthy Connections managed care organization about any available pilot programs and explore community doulas who offer sliding-scale fees.",
      },
      {
        question: "Do I need a license to practice as a doula in South Carolina?",
        answer:
          "No. South Carolina does not require doulas to hold a state license or certification. Doulas are not regulated as medical professionals under state law. House Bill 3108, introduced in 2025, would create a doula certification organization and statewide registry, but it had not been enacted as of early 2026. Voluntary certifications from DONA International, CAPPA, and similar organizations are widely recognized and many South Carolina doulas hold these credentials.",
      },
      {
        question: "What is the maternal mortality rate in South Carolina?",
        answer:
          "South Carolina's maternal mortality rate is approximately 31.5 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data), ranking the state 40th of 48 reporting states. This is well above the national average and the Healthy People 2030 target of 15.7 deaths per 100,000 live births. Black women face maternal mortality rates nearly twice that of white women, and rural mothers face a 62 percent higher mortality rate compared to urban counterparts. Almost 90 percent of these deaths are preventable.",
      },
      {
        question: "What is the cesarean rate in South Carolina?",
        answer:
          "South Carolina has an overall cesarean rate of approximately 33.0 percent (CDC NCHS and KFF, 2023 data), which is slightly above the national average of 32.3 percent. The low-risk cesarean rate is 25.6 percent, ranking South Carolina 24th among states. Rates vary by hospital and region, and significant racial disparities exist, with Black mothers facing a cesarean rate of 36 percent compared to 32 percent for white mothers. Ask about your facility's rate during prenatal visits.",
      },
      {
        question: "Are birth centers licensed in South Carolina?",
        answer:
          "Yes. South Carolina licenses birthing centers through Regulation 60-102 (Standards for Licensing Birthing Centers for Deliveries by Midwives) under the South Carolina Department of Health and Environmental Control. Certified Nurse Midwives (CNMs) are licensed through the South Carolina Board of Nursing. However, direct-entry midwifery is not separately licensed in South Carolina, meaning Certified Professional Midwives (CPMs) do not have a state regulatory pathway. Home birth packages in South Carolina typically range from $3,500 to $6,000.",
      },
      {
        question: "What is the preterm birth rate in South Carolina?",
        answer:
          "South Carolina's preterm birth rate is 11.6 percent (March of Dimes 2025 Report Card, 2024 data), earning the state an F grade and ranking 43rd of 52 reporting jurisdictions. This is unchanged from 2023. The rate is well above the national average of 10.4 percent and the Healthy People 2030 target of 9.4 percent. Significant racial disparities exist, with Black mothers facing a preterm birth rate of 16.0 percent compared to 9.6 percent for white mothers. In 2024, 6,844 babies were born preterm in South Carolina.",
      },
      {
        question: "Did South Carolina extend postpartum Medicaid coverage?",
        answer:
          "Yes. South Carolina extended postpartum Medicaid coverage from 60 days to 12 months for eligible mothers. This means new mothers can maintain Medicaid coverage for a full year after giving birth, which supports postpartum recovery, follow-up care, and access to maternal health services during the critical postpartum period. Medicaid pays for approximately 43 percent of all births in South Carolina, making this extension especially important for families across the state.",
      },
    ],
  },

  RI: {
    state: "RI",
    stateName: "Rhode Island",
    medicaidNarrative:
      "Yes. Rhode Island Medicaid has covered doula services since July 2021, with formal approval in May 2022. Doulas can receive up to $1,500 per pregnancy, which includes $100 per visit for up to 6 prenatal and postpartum visits plus $900 for labor and delivery support. Doulas must be certified by the Rhode Island Certification Board (RICB) and enrolled as Medicaid providers with a National Provider Identifier (NPI). Rhode Island was also the first state to pass a private insurance doula coverage mandate (HB 484/SB 484), requiring commercial insurers to cover doula services by December 31, 2025. Families should ask their doula whether they are certified and enrolled as a Medicaid provider, as not all doulas have completed the process.",
    doulaRegulations:
      "Rhode Island does not require a state doula license to practice. The Rhode Island Certification Board (RICB) offers a voluntary Certified Perinatal Doula (CPD) credential that requires 20 hours of training and a $50 application fee. Certification is required only for doulas who want to bill Medicaid or private insurance. There is no state doula licensing board for non-Medicaid doulas; they operate as community professionals. DONA International, CAPPA, and other national organizations provide widely recognized certifications. Certified Nurse Midwives (CNMs) are licensed through the Rhode Island Department of Health. Rhode Island does not currently license Certified Professional Midwives (CPMs), though a CPM training program launched in September 2024. As of September 2025, Rhode Island has no freestanding licensed birth centers.",
    birthStats: {
      cesareanRate: 33.0,
      maternalMortalityRate: 19.7,
      homeBirthRate: 1.0,
      birthCenterBirthRate: 0.0,
      dataYear: 2023,
      dataSource: "KFF (2023); March of Dimes 2025 Report Card; CDC NCHS",
    },
    faq: [
      {
        question: "Does Rhode Island Medicaid cover doula services?",
        answer:
          "Yes. Rhode Island Medicaid has covered doula services since July 2021. Doulas can receive up to $1,500 per pregnancy, including $100 per visit for up to 6 prenatal and postpartum visits plus $900 for labor and delivery support. Doulas must be certified by the Rhode Island Certification Board and enrolled as Medicaid providers. Ask your doula whether they are certified and enrolled.",
      },
      {
        question: "Do I need a license to practice as a doula in Rhode Island?",
        answer:
          "No state license is required to practice as a doula in Rhode Island. The Rhode Island Certification Board offers a voluntary Certified Perinatal Doula credential requiring 20 hours of training. Certification is required only for doulas who want to bill Medicaid or private insurance. For private-pay clients, voluntary certification through DONA International or similar organizations is widely recognized.",
      },
      {
        question: "What is the cesarean rate in Rhode Island?",
        answer:
          "Rhode Island has an overall cesarean rate of approximately 33.0% (KFF, 2023). The low-risk cesarean rate is approximately 28.5% according to the March of Dimes 2025 Report Card. Rates vary by hospital, so ask about your facility's rate during prenatal visits.",
      },
      {
        question: "Does Rhode Island require private insurance to cover doulas?",
        answer:
          "Yes. Rhode Island was the first state to pass a private insurance doula coverage mandate. HB 484 and SB 484 require commercial insurers to cover doula services by December 31, 2025. This means families with private insurance should be able to access doula services without out-of-pocket costs once the mandate takes effect.",
      },
      {
        question: "What is the maternal mortality rate in Rhode Island?",
        answer:
          "Rhode Island's maternal mortality rate is approximately 19.7 deaths per 100,000 live births (March of Dimes 2025 Report Card, 2019-2023 data). The infant mortality rate is 4.8 per 1,000 live births, which is below the national average. Medicaid covers approximately 41.9% of births in Rhode Island.",
      },
      {
        question: "Are there licensed birth centers in Rhode Island?",
        answer:
          "As of September 2025, Rhode Island has no freestanding licensed birth centers. Certified Nurse Midwives are licensed through the Rhode Island Department of Health and attend births in hospital settings. Rhode Island does not currently license Certified Professional Midwives, though a CPM training program launched in September 2024. Home birth midwives operate in community settings.",
      },
    ],
  },
};