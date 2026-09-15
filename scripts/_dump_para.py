import re
src = open('src/data/cities.ts').read()
def block(slug):
    i = src.find('"' + slug + '": {')
    depth = 0; j = i
    while j < len(src):
        if src[j] == '{': depth += 1
        elif src[j] == '}':
            depth -= 1
            if depth == 0: break
        j += 1
    return src[i:j+1]
b = block('concord-nc')
# find hospitalDetails region
hd = b.index('hospitalDetails:')
sub = b[hd:hd+1600]
m = re.search(r'paragraph:\s*"((?:[^"\\]|\\.)*)"', sub)
if m:
    p = m.group(1)
    print('PARA LEN:', len(p))
    print(p)
# Also show current hospitalDetails keys present
print('--- keys near paragraph ---')
print(sub[:800])
