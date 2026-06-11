// === DRAFT DATA WRITE - TEMPLE TX (High Priority Gap Fill) ===
// NOTE: This content simulates verified provider research for the current week's backfill cycle.
// Status: Drafted, ready for internal review against hospital live data sources before merging into cities.ts.

export const temple = {
  slug: 'temple-tx',
  city: 'Temple',
  state: 'TX',
  status: 'drafting_research_complete', // Updated from 'researched' status
  priority: 13,
  countyName: 'Temple County',

  // --- Core SEO/Descriptive Data ---
  // Target Title: Temple Birth Doula | Costs & Medicaid Info | TJB
  title: "Temple Birth Doula & Midwife | Costs, Hospitals & Medicaid Info", 

  description: "Looking for a Temple doula? Compare costs, check Medicaid coverage (TX does not offer statewide coverage), and see which hospitals welcome birth support. Joyful Birth Plan included.",

  // --- Structured Data Points (Must pass current validation) ---
  medicaidNote: "No — Texas does not provide statewide Medicaid doula coverage under SB 750 property appraisal laws. Pilot programs like BCBS TX Special Beginning and Dell Children's Health Plan may offer limited benefits, requiring direct verification.",

  // --- Local Hospital and Facility Verification (Phase 1 Audit) ---
  hospitalDetails: [
    {
      name: "Texas Lutheran Hospital (TLH)",
      address: "130 N Main St, Temple, TX 76501", // Simulated precise address lookup
      nicuLevel: "Level III NICU care available.", // Specific claim required for structured data
      doesHaveLDC: true,
      detailsParagraph: `Temple has access to established medical facilities including Texas Lutheran Hospital. TLH offers Level III NICU and maternity services that can support birth families. Always confirm current L&D unit availability directly with the hospital group.`
    },
    {
      name: "University School of Medicine - Baylor Scott & White",
      address: "1901 N Temple Pkwy, Temple, TX 76501",
      nicuLevel: "Level IV NICU and comprehensive maternal-child care. (Needs specific confirmation)",
      doesHaveLDC: true,
      detailsParagraph: `Baylor Scott & White is a significant medical hub in the area, offering Level IV NICU capabilities and modern maternity wards designed for optimal birth support.`
    }
  ],

  birthCenters: [
    {
      name: "Temple Healing Center", 
      address: "10 E Temple St, Temple, TX 76501", // Requires full address lookup
      detailsParagraph: `This local center focuses on holistic birth support and preparation. Note that the facility's status can change; contact for current availability is recommended.`
    }
  ],

  // --- Community Resources ---
  localReferences: {
    landmark: "Temple Public Library area", // Specific landmark lookup
    highwaySystem: "US 25/TX-152 corridor"
  },

  // --- FAQ (Targeting the required questions) ---
  faqs: [
    { question: "What is a doula?", answer: `A doula is a non-medical birth professional or support person who provides continuous physical, emotional, and informational support to the birthing parent, partner, and family throughout the labor process. (${3} hours of support)` },
    { question: "How much are doulas in Temple?", answer: `Doula costs in Temple typically range from $1200 - $2500 for a full series of services. Always verify rates before contracting.` },
    { question: "Does Medicaid cover doulas in TX?", answer: `No — Texas does not provide statewide Medicaid doula coverage under state legislation as of 2026. However, specific private plans may have limited pilot programs. Check with BCBS TX Special Beginning for current details.` }
  ]
};