path = 'src/data/cities.ts'
src = open(path).read()
old = 'medicaidNote: "Yes - Washington\'s'
new = 'medicaidNote: "Yes \u2014 Washington\'s'
count = src.count(old)
print("occurrences of target:", count)
assert count == 1, "expected exactly 1 occurrence"
src = src.replace(old, new)
open(path, 'w').write(src)
# verify
src2 = open(path).read()
assert new in src2 and old not in src2
print("fixed; em-dash version present, hyphen version gone")