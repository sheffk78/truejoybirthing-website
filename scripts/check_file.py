import sys
sys.path.insert(0, '/Users/socializerender/Projects/truejoybirthing-website')
with open("src/data/cities.ts", "r") as f:
    content = f.read()
print(f"File size: {len(content)} bytes")
print(f"Lines: {content.count(chr(10))}")