import re
src = open('src/data/cities.ts').read()
i = src.find('"concord-nc": {')
seg = src[i:i + 2000]
print('=== doula photos/creds in concord block ===')
for m in re.finditer(r'(photo|credential|credentials):\s*"([^"]*)"', seg):
    print(m.group(1) + ':', m.group(2))
print('=== BC empty thumb ===')
if 'thumbnail: ""' in src[i:i + 4500]:
    print('STILL PRESENT')
else:
    print('removed')
