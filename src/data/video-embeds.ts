// ════════════════════════════════════════════════════════════════════════════
// Video Embeds — Maps city slugs to YouTube video IDs
// Populated by city-video-automation.py when a video is uploaded
// ════════════════════════════════════════════════════════════════════════════

export const cityVideoEmbeds: Record<string, { videoId: string; title: string; description: string }> = {
  "denver-co": {
    videoId: "qmpu7-f_Aio",
    title: "Denver Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Colorado Medicaid, all in under 5 minutes.",
  },
  "tacoma-wa": {
    videoId: "6MdqbnLsX3M",
    title: "Tacoma Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Washington Apple Health, all in under 4 minutes.",
  },
  "norfolk-va": {
    videoId: "eknYgS3_Sao",
    title: "Norfolk Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Virginia Medicaid, all in under 4 minutes.",
  },
  "fremont-ca": {
    videoId: "LOnANIoKjag",
    title: "Fremont Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and California Medi-Cal, all in under 4 minutes.",
  },
  "vancouver-wa": {
    videoId: "rlk7_Xr-3dg",
    title: "Vancouver WA Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Washington Apple Health, all in under 4 minutes.",
  },
  "cary-nc": {
    videoId: "lefiI0I0jmg",
    title: "Cary Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and NC Medicaid, all in under 3 minutes.",
  },
  "dallas-tx": {
    videoId: "bU8RYQIimZM",
    title: "Dallas Doula & Birth Plan Guide",
    description: "Watch the full city guide — doulas, hospitals, costs, and Texas Medicaid (SB 750 covers doula care), all in under 4 minutes.",
  },
};