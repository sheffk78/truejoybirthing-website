import re

src = open('src/data/cities.ts').read()
idx = src.find("'bellevue-wa'")
if idx == -1:
    idx = src.find('"bellevue-wa"')
print("slug idx:", idx)
block = src[idx: idx + 200000]
nxt = re.search(r"\n  \{\n    slug:", block[100:])
if nxt:
    block = block[: nxt.start() + 100]
med = re.search(r"medicaidNote:\s*[`'\"]([\s\S]*?)[`'\"]", block)
if med:
    val = med.group(1)
    print("medicaidNote first 240 chars repr:")
    print(repr(val[:240]))
    print("startswith 'Yes —':", val.startswith("Yes \u2014"))
    print("startswith 'No —':", val.startswith("No \u2014"))
    print("first char codepoint:", hex(ord(val[0])), "second:", hex(ord(val[1])) if len(val) > 1 else None)
else:
    print("medicaidNote NOT FOUND in bellevue block; block len:", len(block))
    print(block[:2000])