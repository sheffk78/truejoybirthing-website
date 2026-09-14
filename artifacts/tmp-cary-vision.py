import base64, json, urllib.request, datetime

crops = [
    ("cary-nc-hero-fig0.png", "Hero figure crop at 2x zoom. How many human figures? Describe pose. Any anatomical defects: fused/extra fingers, extra/phantom arms, melted joints, wrong belly position vs facing direction?"),
    ("cary-nc-support-fig0.png", "Support scene crop at 2x zoom. How many human figures? Describe pose and interaction. Any anatomical defects: fused fingers, extra arms, melted joints, distorted hands?"),
    ("cary-nc-og-fig0.png", "OG image crop at 2x zoom. How many human figures? Any anatomical defects: fused fingers, extra arms, melted joints?"),
    ("cary-nc-thumb-fig0.png", "Video thumbnail crop at 2x zoom. How many human figures? Any anatomical defects: fused fingers, extra arms, melted joints? If two figures appear merged into one silhouette, say so."),
    ("cary-nc-thumb-fig1.png", "Video thumbnail crop at 2x zoom (narrow sliver). What does it show? Any anatomical defects or figure merges?"),
    ("cary-nc-thumb-fig2.png", "Video thumbnail crop at 2x zoom (narrow sliver). What does it show? Any anatomical defects or figure merges?"),
]

results = []
for fname, prompt in crops:
    with open(f"/tmp/tjb-vision-crops/{fname}", "rb") as f:
        img = base64.b64encode(f.read()).decode()
    body = json.dumps({"model": "atlas:latest", "prompt": prompt, "images": [img], "stream": False}).encode()
    req = urllib.request.Request('http://localhost:11434/api/generate', data=body, headers={'Content-Type': 'application/json'})
    r = urllib.request.urlopen(req, timeout=300)
    d = json.loads(r.read())
    resp = d.get('response', '').strip()
    print(f"=== {fname} ===")
    print(resp[:700])
    print()
    results.append((fname, resp))

with open('/tmp/tjb-vision-crops/cary-nc-vision-raw.txt', 'w') as f:
    for fname, resp in results:
        f.write(f"=== {fname} ===\n{resp}\n\n")