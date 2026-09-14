import re
f = open('src/data/cities.ts').read()
start = f.find('"cary-nc"')
tail = f[start+10:start+40000]
nxt = re.search(r'\n  "[a-z][a-z0-9-]+": \{', tail)
if not nxt:
    nxt = re.search(r'\n[a-zA-Z]', tail)
block = f[start:start+10+(nxt.start() if nxt else 40000)]
for m in re.finditer(r'\{ name: "([^"]+)"[^{}]*?url: "([^"]+)"[^{}]*?photo: "([^"]+)"', block):
    print(m.group(1), '|', m.group(2), '|', m.group(3))