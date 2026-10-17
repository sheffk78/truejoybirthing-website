## SESSION NOTE — 2026-10-17 ~21:10Z — saint-petersburg-fl stage 4 in progress
- Video rendered + QA'd (4 provider portrait scenes vision-passed, 205s, 15.2MB, thumb generated)
- Remotion deps pinned 4.0.475 (fixed version-mismatch render blocker); python3.9→3.13 fix for TTS (urllib3 PEP604 crash)
- YouTube upload blocked on OAuth re-auth: token.json wiped Oct 11 (placeholder {test:true}); Jeff re-auth link sent 3x on #truejoybirthing-web; permanent catcher armed on localhost:8765 (/tmp/sp-yt-catcher.py, logs /tmp/sp-catcher.log)
- After token: run upload-youtube.py saint-petersburg-fl → fills out/saint-petersburg-fl-youtube-id.txt → patch video-embeds.ts videoId PENDING + real duration PT3M25S → rebuild+deploy → probe page for embed → video_outreach contract → advance → complete
- Outreach emails: only Healthy Start has address (Connect@HealthyStartPinellas.org); other 3 providers contact-form-only → mark blocked entries like memphis precedent; emails are Jeff-approval anyway
