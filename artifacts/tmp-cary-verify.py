import re, subprocess, hashlib, json

REPO = 'public'
BASE = 'https://truejoybirthing.com'

f = open('src/data/cities.ts').read()
start = f.find('"cary-nc"')
nxt = re.search(r'\n    "bellevue-wa": \{', f[start+10:])
block = f[start:start+10+(nxt.start() if nxt else len(f)-start)]

refs = {}  # url_path -> kind
for pat, kind in [(r'heroImage:\s*"([^"]+)"', 'hero'), (r'supportSceneImage:\s*"([^"]+)"', 'support'),
                  (r'ogImage:\s*"([^"]+)"', 'og'), (r'photo:\s*"([^"]+)"', 'provider'),
                  (r'thumbnail:\s*"([^"]+)"', 'hospital/birthcenter')]:
    for m in re.findall(pat, block):
        if not m:
            continue
        if m.startswith('http'):
            path = '/' + m.split('truejoybirthing.com/')[-1]
        else:
            path = m
        if '/images/' not in path:
            continue
        refs[path] = kind

# also collect avif srcset variants from the built page html
try:
    html = open('dist/birth-support/cary-nc/index.html').read()
    for m in re.findall(r'(/images/[a-z0-9-]+\.avif)', html):
        if 'cary-nc' in m:
            refs[m] = 'avif-variant'
except FileNotFoundError:
    print('no dist html')

results = []
for path, kind in sorted(refs.items()):
    url = BASE + path
    r = subprocess.run(['curl', '-sI', url], capture_output=True, text=True)
    head = r.stdout
    code = re.search(r'HTTP/[\d.]+ (\d+)', head)
    clen = re.search(r'(?i)content-length:\s*(\d+)', head)
    status = int(code.group(1)) if code else 0
    size = int(clen.group(1)) if clen else 0
    # fetch body for md5 if small enough
    md5_cdn = md5_repo = match = None
    local = REPO + path
    import os
    if os.path.exists(local):
        rb = open(local, 'rb').read()
        md5_repo = hashlib.md5(rb).hexdigest()
        repo_size = len(rb)
        if status == 200 and size and size < 3_000_000:
            body = subprocess.run(['curl', '-s', url], capture_output=True).stdout
            md5_cdn = hashlib.md5(body).hexdigest()
            match = (md5_cdn == md5_repo)
        results.append({'path': path, 'kind': kind, 'status': status, 'cdn_len': size,
                        'repo_size': repo_size, 'md5_match': match, 'gt10k': size > 10240})
    else:
        results.append({'path': path, 'kind': kind, 'status': status, 'cdn_len': size,
                        'repo': 'MISSING', 'gt10k': size > 10240})

ok = True
for r in results:
    flag = 'OK ' if (r['status'] == 200 and r['gt10k'] and r.get('md5_match') in (True, None) and r.get('repo') != 'MISSING') else 'FAIL'
    if flag == 'FAIL':
        ok = False
    print(flag, json.dumps(r))
print('ALL_OK' if ok else 'HAS_FAILURES')