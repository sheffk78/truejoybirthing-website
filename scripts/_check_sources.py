import re
src = open('src/data/cities.ts').read()
# Does concord block have a sources array?
i = src.find('"concord-nc": {')
# walk to block end by depth
depth = 0; j = i
while j < len(src):
    if src[j] == '{': depth += 1
    elif src[j] == '}':
        depth -= 1
        if depth == 0: break
    j += 1
block = src[i:j+1]
print('has sources key:', 'sources' in block)
print('sources count:', block.count('sources'))
# Show costRange lines
for m in re.finditer(r'costRange:\s*"([^"]*)"', block):
    print('costRange:', m.group(1))
for m in re.finditer(r'costRange_source:\s*"([^"]*)"', block):
    print('costRange_source:', m.group(1))
