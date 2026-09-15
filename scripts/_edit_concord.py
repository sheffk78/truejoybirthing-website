import re
p = 'src/data/cities.ts'
src = open(p).read()
i = src.index('"concord-nc": {')
end = src.index('\n  }', i)
block = src[i:end]

changes = [
    # 1) Heart of Grace photo -> real Lindsay headshot
    ('photo: "/images/provider-concord-nc-home.webp"',
     'photo: "/images/provider-concord-nc-heart-of-grace.webp"'),
    # 2) Tiffany photo -> real headshot
    ('photo: "/images/provider-concord-nc-pregnancy-and-labor-doula.webp"',
     'photo: "/images/provider-concord-nc-tiffany-st-louis.webp"'),
    # 3) What The Bump empty photo -> real team head; fix credentials->credential
    ('name: "What The Bump Doula Team",\n        type: "Birth Doula",\n        credentials: "Certified Birth Doulas, Registered Nurses on team",\n        photo: "",',
     'name: "What The Bump Doula Team",\n        type: "Birth Doula",\n        credential: "Certified Birth Doulas, Registered Nurses on team",\n        photo: "/images/concord-nc-what-the-bump.webp",'),
    # 4) credentials: -> credential: for the other two doulas
    ('credentials: "Birth Doula, Childbirth Educator"',
     'credential: "Birth Doula, Childbirth Educator"'),
    ('credentials: "Certified Labor Support Doula"',
     'credential: "Certified Labor Support Doula"'),
    # 5) Remove thumbnail: "" from the no-birth-center entry (pitfall 7)
    ('        name: "No freestanding birth center in Concord, NC",\n        thumbnail: "",\n        address: "",\n        url: "",',
     '        name: "No freestanding birth center in Concord, NC",\n        address: "",\n        url: "",'),
]

missing = []
applied = 0
for old, new in changes:
    if old not in block:
        # allow the whole-block check
        if old in src[i:i+end]:
            pass
        else:
            missing.append(old[:60])
            continue
    # apply only within block
    idx = src.index(old, i, i + (end - i) + 2)
    src = src[:idx] + new + src[idx+len(old):]
    applied += 1

open(p, 'w').write(src)
print('applied:', applied, 'missing:', missing)
print('total bytes:', len(src))
