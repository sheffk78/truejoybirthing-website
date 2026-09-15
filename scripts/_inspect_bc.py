import re
src = open('src/data/cities.ts').read()
i = src.find('"cleveland-oh"')
j = src.find('birthCenterDetails', i)
seg = src[j:j + 1200]
print(seg)
