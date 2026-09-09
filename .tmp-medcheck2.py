import re

src = open('src/data/cities.ts').read()
idx = src.find("'bellevue-wa'")
if idx == -1:
    idx = src.find('"bellevue-wa"')
block = src[idx: idx + 200000]
nxt = re.search(r"\n  \{\n    slug:", block[100:])
if nxt:
    block = block[: nxt.start() + 100]
med = re.search(r"medicaidNote:\s*[`'\"]([\s\S]*?)[`'\"]\s*,?\s*\n", block)
if med:
    print("FULL medicaidNote:")
    print(med.group(1))
    print("---- length:", len(med.group(1)))
# also check other cities for the same pattern to know the house style
yes_em = len(re.findall(r"medicaidNote:\s*[`'\"]Yes \u2014", src))
no_em = len(re.findall(r"medicaidNote:\s*[`'\"]No \u2014", src))
hyphen = len(re.findall(r"medicaidNote:\s*[`'\"](Yes|No) - ", src))
print("cities with 'Yes —':", yes_em, "| 'No —':", no_em, "| hyphen style:", hyphen)