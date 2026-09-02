with open("src/data/cities.ts") as f:
    content = f.read()

# Fix: carrollton-tx entry is missing closing }
old = '''      credentialDetail: "In Texas, Certified Nurse-Midwives (CNMs) are licensed by the Texas Board of Nursing and practice in hospital and birth center settings. Certified Professional Midwives (CPMs) are licensed by the Texas Department of Licensing and Regulation to attend out-of-hospital births, giving Carrollton families regulated midwife options for home and birth center births."
    },
  "celina-tx": {'''

new = '''      credentialDetail: "In Texas, Certified Nurse-Midwives (CNMs) are licensed by the Texas Board of Nursing and practice in hospital and birth center settings. Certified Professional Midwives (CPMs) are licensed by the Texas Department of Licensing and Regulation to attend out-of-hospital births, giving Carrollton families regulated midwife options for home and birth center births."
    }},
  },  "celina-tx": {'''

if old in content:
    content = content.replace(old, new)
    with open("src/data/cities.ts", "w") as f:
        f.write(content)
    print("Fixed: added closing } for carrollton-tx")
else:
    print("Pattern not found")
    idx = content.find('credentialDetail: "In Texas, Certified Nurse-Midwives (CNMs)')
    if idx >= 0:
        print(repr(content[idx+200:idx+400]))
