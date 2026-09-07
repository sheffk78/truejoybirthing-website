#!/usr/bin/env bash
# Final verification sweep for san-marcos-tx video stage
V=/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/video/remotion
P=/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website
echo "1. video_file: $(stat -f %z $V/out/san-marcos-tx-city-guide.mp4) bytes"
echo "2. yt-id file: $(cat $V/out/san-marcos-tx-youtube-id.txt)"
echo "3. embeds.ts: $(grep -A1 '"san-marcos-tx"' $P/src/data/video-embeds.ts | grep videoId)"
echo "4. thumbnail local: $(stat -f %z $P/public/images/yt-thumb-san-marcos-tx.png) bytes"
curl -s -o /dev/null -w "5. yt thumb live: HTTP %{http_code} %{size_download}B\n" "https://img.youtube.com/vi/WWWSiPLg2rM/maxresdefault.jpg"
curl -s -o /dev/null -w "6. live page: HTTP %{http_code}\n" "https://truejoybirthing.com/birth-support/san-marcos-tx/"
echo "7. old video oembed (403/401 = unlisted, OK):"
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=cZAGgttJhGY&format=json" -o /dev/null -w "  HTTP %{http_code}\n"
echo "8. audit: $(python3 -c "import json; d=json.load(open('$P/public/city-audit.json')); e=[x for x in d if x.get('slug')=='san-marcos-tx'][0]; print('video=%s score=%s' % (e['video'], e['score']))")"
echo "9. contract: $(python3 $P/scripts/contract-validate.py san-marcos-tx video_outreach 2>&1 | python3 -c "import json,sys; print('contract_valid=%s' % json.load(sys.stdin)['contract_valid'])")"