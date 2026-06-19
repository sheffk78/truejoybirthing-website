// ════════════════════════════════════════════════════════════════════════════
// Video Embeds — Maps city slugs to YouTube video IDs
// Populated by city-video-automation.py when a video is uploaded
// ════════════════════════════════════════════════════════════════════════════

export interface CityVideoEmbed {
  videoId: string;
  title: string;
  description: string;
  /** ISO 8601 duration, e.g. "PT3M17S" */
  duration?: string;
  /** ISO 8601 upload date */
  uploadDate?: string;
  /** YouTube chapter timestamps: [startSeconds, title][] */
  chapters?: [number, string][];
}

export const cityVideoEmbeds: Record<string, CityVideoEmbed> = {
  "denver-co": {
    videoId: "qmpu7-f_Aio",
    title: "Denver Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Colorado Medicaid, all in under 5 minutes.",
    duration: "PT3M18S",
    uploadDate: "2026-06-04T00:00:00-06:00",
  },
  "tacoma-wa": {
    videoId: "CSf-KlvPXWg",
    title: "Tacoma Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Washington Apple Health, all in under 4 minutes.",
    duration: "PT3M14S",
    uploadDate: "2026-06-15T00:00:00-06:00",
  },
  "norfolk-va": {
    videoId: "pcnqCCmxZlo",
    title: "Norfolk Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Virginia Medicaid, all in under 4 minutes.",
    duration: "PT3M17S",
    uploadDate: "2026-06-16T00:00:00-06:00",
  },
  "fremont-ca": {
    videoId: "SfZueZ_UDpo",
    title: "Fremont Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and California Medi-Cal, all in under 3 minutes.",
    duration: "PT2M57S",
    uploadDate: "2026-06-16T00:00:00-06:00",
  },
  "vancouver-wa": {
    videoId: "z4YlQEkJzRo",
    title: "Vancouver WA Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Washington Apple Health, all in under 4 minutes.",
    duration: "PT3M31S",
    uploadDate: "2026-06-16T00:00:00-06:00",
  },
  "cary-nc": {
    videoId: "1C1Zq6lfb9Y",
    title: "Cary Doula & Birth Plan Guide: Costs, Hospitals & Medicaid (First-Time Mom)",
    description: "Watch the full city guide — doulas, hospitals, costs, and NC Medicaid, all in under 3 minutes.",
    duration: "PT3M14S",
    uploadDate: "2026-06-16T00:00:00-06:00",
  },
  "dallas-tx": {
    videoId: "gInUgjaym5Q",
    title: "Dallas Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Texas Medicaid (SB 750 covers doula care), all in under 4 minutes.",
    duration: "PT3M47S",
    uploadDate: "2026-06-15T00:00:00-06:00",
  },
  "chesapeake-va": {
    videoId: "RAvfrkNKmOQ",
    title: "Chesapeake Doula & Birth Plan Guide: Costs, Hospitals & Medicaid (First-Time Mom)",
    description: "Watch the full city guide — doulas, hospitals, costs, and Virginia Medicaid, all in under 3 minutes.",
    duration: "PT2M55S",
    uploadDate: "2026-06-16T00:00:00-06:00",
  },
  "moreno-valley-ca": {
    videoId: "uYxhNupSsME",
    title: "Moreno Valley Doula & Birth Plan Guide: Costs, Hospitals & Medicaid (First-Time Mom)",
    description: "Watch the full city guide — doulas, hospitals, costs, and California Medi-Cal, all in under 3 minutes.",
    duration: "PT2M59S",
    uploadDate: "2026-06-18T00:00:00-06:00",
  },
  "carrollton-tx": {
    videoId: "oYtBdiECrgo",
    title: "Carrollton TX Doula & Birth Plan Guide: Costs, Hospitals & Medicaid (First-Time Mom)",
    description: "Watch the full city guide — doulas, hospitals, costs, and Texas Medicaid (SB 750 covers doula care), all in under 3 minutes.",
    duration: "PT2M42S",
    uploadDate: "2026-06-19T00:00:00-06:00",
  },
  "san-bernardino-ca": {
    videoId: "sTii3z6iJh4",
    title: "San Bernardino CA Doula & Birth Plan Guide: Costs, Hospitals & Medicaid (First-Time Mom)",
    description: "Watch the full city guide — doulas, hospitals, costs, and California Medi-Cal doula coverage, all in under 3 minutes.",
    duration: "PT2M27S",
    uploadDate: "2026-06-17T00:00:00-06:00",
  },
  "beaumont-tx": {
    videoId: "8Rqz37nFy6w",
    title: "Beaumont TX Doula & Birth Plan Guide: Costs, Hospitals & Medicaid (First-Time Mom)",
    description: "Watch the full city guide — doulas, hospitals, costs, and Texas Medicaid (SB 750 covers doula care), all in under 4 minutes.",
    duration: "PT3M09S",
    uploadDate: "2026-06-17T00:00:00-06:00",
  },
  "waco-tx": {
    videoId: "HokaLZ_mHxw",
    title: "Waco TX Doula & Birth Plan Guide: Costs, Hospitals & Medicaid (First-Time Mom)",
    description: "Watch the full city guide — doulas, hospitals, costs, and Texas Medicaid (SB 750 covers doula care), all in under 4 minutes.",
    duration: "PT2M12S",
    uploadDate: "2026-06-17T00:00:00-06:00",
  },
  "killeen-tx": {
    videoId: "MZ73jDb49jY",
    title: "Killeen TX Doula & Birth Plan Guide: Costs, Hospitals & Medicaid (First-Time Mom)",
    description: "Watch the full city guide — doulas, hospitals, costs, and Texas Medicaid (SB 750 covers doula care), all in under 4 minutes.",
    duration: "PT3M47S",
    uploadDate: "2026-06-18T00:00:00-06:00",
  },
  "tyler-tx": {
    videoId: "BMptedwJJvw",
    title: "Tyler TX Doula & Birth Plan Guide: Costs, Hospitals & Medicaid (First-Time Mom)",
    description: "Watch the full city guide — doulas, hospitals, costs, and Texas Medicaid (SB 750 covers doula care), all in under 4 minutes.",
    duration: "PT3M54S",
    uploadDate: "2026-06-18T00:00:00-06:00",
  },
};
