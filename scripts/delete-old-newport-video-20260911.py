#!/usr/bin/env python3
"""Delete the superseded restricted newport-news-va video (l5hSIyiiqHo) using
the Remotion upload script's OAuth token. Reuses its get_access_token()."""
import importlib.util
import json
import urllib.request

spec = importlib.util.spec_from_file_location(
    'upload_youtube',
    '/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/video/remotion/scripts/upload-youtube.py')
try:
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    at = m.get_access_token()
except Exception as e:
    print('token load failed:', e)
    raise SystemExit(1)

# First check current status
req = urllib.request.Request(
    'https://www.googleapis.com/youtube/v3/videos?part=status&id=l5hSIyiiqHo',
    headers={'Authorization': 'Bearer ' + at})
try:
    r = urllib.request.urlopen(req, timeout=30)
    d = json.load(r)
    items = d.get('items', [])
    if items:
        print('old video:', items[0]['status'])
    else:
        print('old video not visible to this channel (already removed or other-owner)')
except Exception as e:
    print('status check failed:', e)

# Attempt delete
req = urllib.request.Request(
    'https://www.googleapis.com/youtube/v3/videos?id=l5hSIyiiqHo',
    method='DELETE',
    headers={'Authorization': 'Bearer ' + at})
try:
    r = urllib.request.urlopen(req, timeout=30)
    print('delete status:', r.status)
except Exception as e:
    print('delete failed:', e)