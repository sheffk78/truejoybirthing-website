#!/usr/bin/env python3
"""Fill the san-marcos-tx video_outreach handoff contract with real values."""
import json, os, datetime

P = '/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website'
cp = f'{P}/artifacts/handoffs/san-marcos-tx/video_outreach.json'
mp4 = '/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/video/remotion/out/san-marcos-tx-city-guide.mp4'

mb = round(os.path.getsize(mp4) / (1024 * 1024), 1)
c = json.load(open(cp))
c['produced_at'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
c['worker_model'] = 'glm-5.3-flash'
c['notes'] = ('Video-only worker (no outreach per delegation): scene data, TTS, render, '
              'YouTube upload WWWSiPLg2rM, thumbnail, embed swap, CF deploy all verified 2026-09-07. '
              'Outreach handled by separate worker.')
c['video_file'] = mp4
c['video_mb'] = mb
c['youtube_id'] = 'WWWSiPLg2rM'
c['thumbnail_path'] = f'{P}/public/images/yt-thumb-san-marcos-tx.png'
c['embed_verified'] = True
c['outreach'] = []
c['sources'] = []
json.dump(c, open(cp, 'w'), indent=2)
print('written; video_mb =', mb)