import re, sys
src = open('src/data/cities.ts').read()
i = src.index('"concord-nc": {')
depth = 0; j = i
while j < len(src):
    if src[j] == '{': depth += 1
    elif src[j] == '}':
        depth -= 1
        if depth == 0:
            j += 1; break
    j += 1
block = src[i:j]
m = re.search(r'birthCenterDetails:\s*\[(.*?)\n\s*\],', block, re.S)
print("BIRTHCENTER_RAW:")
print(m.group(1)[:1200] if m else "none")
print("=====")
paras = re.findall(r'paragraph": "(.*?)"', block, re.S)
for k, para in enumerate(paras):
    print(f"HOSP/BC para #{k} len={len(para)}: {para[:80]}")
print("=====")
print("DOULA names:", re.findall(r'name: "([^"]+)"', block))
photos = re.findall(r'photo: "([^"]*)"', block)
print("PHOTOS:", photos)
thumbs = re.findall(r'thumbnail: "([^"]*)"', block)
print("THUMBS:", thumbs)
