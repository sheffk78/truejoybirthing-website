import re, json
f = open('src/data/cities.ts').read()
start = f.find('"cary-nc"')
tail = f[start+10:start+60000]
nxt = re.search(r'\n  "[a-z][a-z0-9-]+": \{', tail)
block = f[start:start+10+(nxt.start() if nxt else 60000)]
for m in re.finditer(r'\{ name: "([^"]+)"[^{}]*?credential: "([^"]*)"[^{}]*?description: "([^"]{0,300})', block):
    print('NAME:', m.group(1))
    print('CRED:', m.group(2))
    print('DESC:', m.group(3)[:280])
    print('---')