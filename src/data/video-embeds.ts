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
    uploadDate: "2026-06-04",
  },
  "tacoma-wa": {
    videoId: "6MdqbnLsX3M",
    title: "Tacoma Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Washington Apple Health, all in under 4 minutes.",
    duration: "PT3M14S",
    uploadDate: "2026-06-08",
  },
  "norfolk-va": {
    videoId: "6-24wEnRnXA",
    title: "Norfolk Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Virginia Medicaid, all in under 4 minutes.",
    duration: "PT3M17S",
    uploadDate: "2026-06-13",
  },
  "fremont-ca": {
    videoId: "nSAXPxef8O8",
    title: "Fremont Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and California Medi-Cal, all in under 4 minutes.",
    duration: "PT3M1S",
    uploadDate: "2026-06-13",
  },
  "vancouver-wa": {
    videoId: "iRVJ8H3OCgg",
    title: "Vancouver WA Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Washington Apple Health, all in under 4 minutes.",
    duration: "PT3M35S",
    uploadDate: "2026-06-13",
  },
  "cary-nc": {
    videoId: "lefiI0I0jmg",
    title: "Cary Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and NC Medicaid, all in under 3 minutes.",
    duration: "PT2M3S",
    uploadDate: "2026-06-12",
  },
  "dallas-tx": {
    videoId: "fZ5UVWc3OAQ",
    title: "Dallas Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Texas Medicaid (SB 750 covers doula care), all in under 4 minutes.",
    duration: "PT3M47S",
    uploadDate: "2026-06-12",
  },
};