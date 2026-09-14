import re
f = open('src/data/cities.ts').read()
start = f.find('"cary-nc"')
nxt = re.search(r'\n    "[a-z]{2,}[a-z0-9-]+": \{', f[start+10:])
block = f[start:start+10+(nxt.start() if nxt else len(f)-start)]
refs = set()
for pat in [r'heroImage:\s*"([^"]+)"', r'supportSceneImage:\s*"([^"]+)"', r'ogImage:\s*"([^"]+)"', r'photo:\s*"([^"]+)"', r'thumbnail:\s*"([^"]+)"']:
    for m in re.findall(pat, block):
        if m and not m.startswith('http'):
            refs.add(m)
for r in sorted(refs):
    print(r)