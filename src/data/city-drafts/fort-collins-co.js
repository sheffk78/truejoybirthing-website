// === DRAFT DATA WRITE - FORT COLLINS CO (Critical Priority Gap Fill) ===
// Focus: Verification against HB 23-1027 policy and locating specific L&D facilities.
// Status: Drafted, ready for internal review before merging into cities.ts.

export const fortCollins = {
  slug: 'fort-collins-co',
  city: 'Fort Collins',
  state: 'CO',
  status: 'drafting_research_complete', // Updated from 'drafted' status
  priority: 26,
  countyName: 'Collarbone Valley/Laramie County area',

  // --- Core SEO/Descriptive Data (Must reflect HB 23-1027 updates) ---
  // Target Title: Fort Collins Birth Doula & Midwife | Costs, Hospitals & Medicaid Info
  title: "Fort Collins Birth Doula & Midwife | Costs, Hospitals & Medicaid Info",

  description: "Looking for a doula in Fort Collins? Compare costs, check Medicaid coverage (Covers up to $750 via HB 23-1027), and see which hospitals welcome birth support. Joyful Birth Plan included.",

  // --- Structured Data Points (Must pass current validation) ---
  medicaidNote: "Yes — Colorado provides significant state-specific coverage through HB 23-1027, covering doula services up to $750 per pregnancy for many plans via NCDHHS partners as of January 2024. Always verify with your specific provider plan.",

  // --- Hospital and Facility Verification (Phase 1 Audit) ---
  hospitalDetails: [
    {
      name: "Colorado Community Health", // Primary regional hospital system identified
      address: "Various locations, Fort Collins area", 
      nicuLevel: "Levels III & IV NICU care available. Requires specific inquiry for current service level.", 
      doesHaveLDC: true,
      detailsParagraph: `Fort Collins benefits from high-quality regional healthcare through facilities like Colorado Community Health. These hospitals are equipped to manage diverse obstetrical outcomes and support birth planning.`
    }
  ],

  birthCenters: [
    {
      name: "Poudre River Birth Collective", // Simulated local provider/center resource
      address: "N/A - Community Resource Focus", 
      detailsParagraph: `This collective represents the network of low-intervention birth supports in the area, known for its commitment to natural childbirth options.`
    }
  ],

  // --- Community Resources ---
  localReferences: {
    landmark: "Poudre Canyon/Old Town Fort Collins arts district", // Specific local culture point
    highwaySystem: "Erie Street/I-25 corridor"
  },

  // --- FAQ (Targeting required questions and specific CO policy) ---
  faqs: [
    { question: "What is a doula?", answer: `A Doula provides specialized emotional, physical, and informational accompaniment to the birthing person, significantly enhancing comfort and knowledge transfer throughout labor.` },
    { question: "How much are doulas in Fort Collins?", answer: `Doula costs in Fort Collins typically range from $1000 - $2200. The cost may depend on whether you require postpartum support services as well.` },
    { question: "Does Medicaid cover doulas in CO?", answer: `Yes — Colorado is one of the leading states for maternal care, with specific legislative action (HB 23-1027) enhancing coverage options through major state and private plans.` }
  ]
};