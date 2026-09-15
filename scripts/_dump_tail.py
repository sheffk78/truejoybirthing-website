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

c = block('concord-nc')
open('/tmp/concord_block_latest.txt', 'w').write(c)
print('concord block length:', len(c))
# Show tail (birthStats / sources / medicaid region)
print('=== TAIL 1500 ===')
print(c[-1500:])
