with open("src/data/cities.ts") as f:
    content = f.read()

# Fix: the lat/lng/midwifeInfo were placed outside the carrollton-tx entry
# Remove the misplaced lines
old_wrong = '''    nearbyCities: ["mckinney-tx", "carrollton-tx", "arlington-tx", "allen-tx"]},
    lat: 32.9746,
    lng: -96.8899,
    midwifeInfo: {
      paragraph: "Texas licenses Certified Nurse-Midwives (CNMs) and Certified Professional Midwives (CPMs), giving Carrollton families regulated midwife options for home birth, birth center birth, and hospital-based midwifery. In the DFW area, midwives practice at several hospitals and birth centers, with home birth options available through CPMs serving the Dallas/Denton/Collin County region.",
      credentialTypes: " and CPMs",
      credentialDetail: "In Texas, Certified Nurse-Midwives (CNMs) are licensed by the Texas Board of Nursing and practice in hospital and birth center settings. Certified Professional Midwives (CPMs) are licensed by the Texas Department of Licensing and Regulation to attend out-of-hospital births, giving Carrollton families regulated midwife options for home and birth center births."
    },
  "celina-tx": {'''

new_fixed = '''    nearbyCities: ["mckinney-tx", "carrollton-tx", "arlington-tx", "allen-tx"]},
    lat: 32.9746,
    lng: -96.8899,
    midwifeInfo: {
      paragraph: "Texas licenses Certified Nurse-Midwives (CNMs) and Certified Professional Midwives (CPMs), giving Carrollton families regulated midwife options for home birth, birth center birth, and hospital-based midwifery. In the DFW area, midwives practice at several hospitals and birth centers, with home birth options available through CPMs serving the Dallas/Denton/Collin County region.",
      credentialTypes: " and CPMs",
      credentialDetail: "In Texas, Certified Nurse-Midwives (CNMs) are licensed by the Texas Board of Nursing and practice in hospital and birth center settings. Certified Professional Midwives (CPMs) are licensed by the Texas Department of Licensing and Regulation to attend out-of-hospital births, giving Carrollton families regulated midwife options for home and birth center births."
    }},
  "celina-tx": {'''

if old_wrong in content:
    content = content.replace(old_wrong, new_fixed)
    with open("src/data/cities.ts", "w") as f:
        f.write(content)
    print("Fixed carrollton-tx structure")
else:
    print("Pattern not found - checking current state")
    # Show what's around carrollton-tx nearbyCities
    idx = content.find('nearbyCities: ["mckinney-tx", "carrollton-tx", "arlington-tx", "allen-tx"]}')
    if idx >= 0:
        print(repr(content[idx:idx+300]))
