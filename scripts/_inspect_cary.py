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

c = block('cary-nc')
print('=== cary-nc birthStats ===')
m = re.search(r'birthStats:\s*\{(.*?)\}', c, re.S)
print(m.group(0) if m else 'NONE')
print('=== cary-nc sources ===')
m = re.search(r'sources:\s*\[(.*?)\]', c, re.S)
print(m.group(1)[:2500] if m else 'NONE')
print('=== cary costRange_source sample ===')
for mm in re.finditer(r'costRange_source:\s*"([^"]*)"', c):
    print(' -', mm.group(1))
