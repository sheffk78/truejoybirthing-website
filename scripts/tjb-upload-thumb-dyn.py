#!/usr/bin/env python3
"""Dynamic-path YT thumbnail uploader.
Usage: python3 tjb-upload-thumb-dyn.py <slug> <video_id>
"""
import glob, json, os, sys, time, urllib.request, urllib.error

slug, video_id = sys.argv[1], sys.argv[2]
HOME = os.path.expanduser("~")
def find_many(*patterns):
    for p in patterns:
        m = glob.glob(os.path.expanduser(p))
        if m:
            return m[0]
    sys.exit("not found in: " + repr(patterns))
tp = find_many(
    "~/.openclaw/**/.youtube-oauth/token.json",
    "~/Projects/truejoybirthing-website/.youtube-oauth/token.json",
)
t = json.load(open(tp))
need = False
try:
    exp = t["expiry"]
    try:
        need = time.time() > int(float(exp))
    except Exception:
        from datetime import datetime, timezone
        need = datetime.now(timezone.utc) > datetime.fromisoformat(str(exp).replace("Z", "+00:00"))
except Exception:
    need = True
if need:
    body = json.dumps({"client_id": t["client_id"], "client_secret": t["client_secret"],
                       "refresh_token": t["refresh_token"], "grant_type": "refresh_token"}).encode()
    resp = urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=body, method="POST"), timeout=30)
    nt = json.loads(resp.read()); t["access_token"] = nt["access_token"]; t["expiry"] = time.time() + nt.get("expires_in", 3600)
    json.dump(t, open(tp, "w"), indent=2); print("token refreshed")
tok = t.get("access_token") or t.get("token")
thumb = find_many(
    "~/Projects/truejoybirthing-website/public/images/yt-thumb-" + slug + ".png",
    "~/.openclaw/**/public/images/yt-thumb-" + slug + ".png",
)
print("thumb:", thumb)
data = open(thumb, "rb").read()
req = urllib.request.Request(
    "https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=" + video_id,
    data=data, method="POST",
    headers={"Authorization": "Bearer " + tok, "Content-Type": "image/png"})
try:
    r = urllib.request.urlopen(req, timeout=120)
    print("STATUS", r.status, r.read()[:200])
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read()[:500]); sys.exit(1)
