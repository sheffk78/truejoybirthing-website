import re
src = open('src/data/cities.ts').read()
i = src.find('"concord-nc": {')
# find the whole concord object by brace depth
depth = 0
j = i
while j < len(src):
    c = src[j]
    if c == '{': depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0:
            break
    j += 1
block = src[i:j+1]
print('BLOCK LEN', len(block))
# print hospitals + doulas sections
for key in ['hospital', 'doulas', 'birthCenter', 'medicaidNote', 'insuranceNote']:
    idx = block.find(key)
    print('===', key, '@', idx)
# print whole block to a file for inspection
open('/tmp/concord_block.txt', 'w').write(block)
print('written to /tmp/concord_block.txt')
