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
};