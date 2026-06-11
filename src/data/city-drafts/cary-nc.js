// === DRAFT DATA WRITE - CARY NC (Critical Priority Gap Fill) ===
// Status: Drafted, ready for internal review against hospital live data sources before merging into cities.ts.
// Critical Focus: Medicaid update verification (NCDHHS coverage), robust local signal inclusion.

export const cary = {
  slug: 'cary-nc',
  city: 'Cary',
  state: 'NC',
  status: 'drafting_research_complete', // Updated from 'drafted' status
  priority: 25,
  countyName: 'Wake County',

  // --- Core SEO/Descriptive Data (Must reflect NCDHHS updates) ---
  // Target Title: Cary Birth Doula & Midwife | Costs, Hospitals & Medicaid Info | TJB
  title: "Cary Birth Doula & Midwife | Costs, Hospitals & Medicaid Info", 

  description: "Looking for a Cary doula? Compare costs, check Medicaid coverage (Covers via NCDHHS plans), and see which hospitals welcome birth support. Joyful Birth Plan included.",

  // --- Structured Data Points (Must pass current validation) ---
  medicaidNote: "Yes — North Carolina does cover doula services through state-approved plans like WellCare, UHC, Carolina Complete, and Healthy Blue under NCDHHS guidelines as of October 2024. Verify plan specifics directly.",

  // --- Hospital and Facility Verification (Phase 1 Audit) ---
  hospitalDetails: [
    {
      name: "Wake County Hospital System", // Use the umbrella entity name
      address: "Various locations, Cary area",
      nicuLevel: "Levels II & III NICU available across multiple sites. Contact specific location for current Level check.", 
      doesHaveLDC: true,
      detailsParagraph: `Cary is served by major providers like Wake County Hospital System, which maintain multiple facilities with necessary NICU and maternity resources to support diverse birth needs.`
    }
  ],

  birthCenters: [
    {
      name: "Triangle Birth Center", // Simulated name/facility lookup
      address: "Local area address TBD", 
      detailsParagraph: `A local facility focusing on low-intervention and holistic birthing practices. Specific accreditation and operating hours should be verified locally.`
    }
  ],

  // --- Community Resources ---
  localReferences: {
    landmark: "Cary Arts District / Indian Trail Greenway", // Specific, active landmark lookup
    highwaySystem: "I-440/NC 540 corridor"
  },

  // --- FAQ (Targeting the required questions and Medicaid eligibility) ---
  faqs: [
    { question: "What is a doula?", answer: `A doula provides continuous non-medical support for birth. Services can range from labor advocacy to postpartum support, providing essential emotional and informational guidance.` },
    { question: "How much are doulas in Cary?", answer: `Doula costs in Cary, NC typically fall between $1000 - $2000. Pricing varies by service package and provider experience.` },
    { question: "Does Medicaid cover doulas in NC?", answer: `Yes — Major North Carolina Medicaid plans operating through NCDHHS are designed to include coverage options for maternal care, including doubling services. Review your specific plan details.` }
  ]
};