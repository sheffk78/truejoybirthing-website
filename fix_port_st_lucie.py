#!/usr/bin/env python3
# Read cities.ts
with open('src/data/cities.ts', 'r') as f:
    lines = f.readlines()

# Locate port-st-lucie-fl's birthCenterDetails and nearbyCities
insert_bc_idx = None
insert_hosp_idx = None
for i, line in enumerate(lines):
    if 'birthCenterDetails: []' in line:
        insert_bc_idx = i
    if 'nearbyCities' in line and 'port-st-lucie-fl' in line:
        insert_hosp_idx = i
        break

# Insert hospital entries before nearbyCities
hospital1 = """      {
        name: "Cleveland Clinic Martin Health – Tradition Hospital" ,
        thumbnail: "/images/provider-port-st-lucie-fl-cleveland-clinic-tradition-hospital.webp",
        url: "https://my.clevelandclinic.org/florida/locations/tradition-hospital",
        address: "10000 SW Innovation Way, Port St. Lucie, FL 34987",
        paragraph: "Cleveland Clinic Martin Health – Tradition Hospital, opened in 2014 and is the newest hospital in Port St. Lucie. It has a Level II Special Care Nursery (managing babies ≥32 weeks gestation; transfers complex cases to Martin North’s Level III NICU), 24/7 OB hospitalist coverage, epidural availability, CNM-friendly policies, and lactation consultants. The hospital handles an estimated 1,200–1,500 births per year and draws heavily from young families relocating into the Tradition and St. Lucie West communities. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to get started.",
        nicuLevel: "II",
        doulaPolicy: "Doulas welcome as support persons; confirm current visitor policy during your hospital tour",
        lactation: true,
        privateRooms: true,
        medicaid: true
      },
"""
hospital2 = """      {
        name: "St. Lucie Medical Center" ,
        url: "https://www.hcafloridahealthcare.com/locations/st-lucie-hospital",
        address: "1800 SE Tiffany Ave, Port St. Lucie, FL 34952",
        thumbnail: "/images/provider-port-st-lucie-fl-st-lucie-medical-center.webp",
        paragraph: "St. Lucie Medical Center, at 1800 SE Tiffany Ave on PSL’s east side, is an HCA Healthcare hospital serving the community since 1983. It has a Level II Special Care Nursery (transfers complex cases to Martin North’s Level III NICU), 24/7 OB/GYN and anesthesia coverage, midwifery care through affiliated practices, lactation consultants, and childbirth classes. The hospital handles an estimated 1,000–1,400 births per year and serves central and eastern PSL. <a href=\"/birth-plan-template/\">Use our free hospital birth plan template</a> to walk in prepared.",
        nicuLevel: "II",
        doulaPolicy: "Doulas welcome as support persons; confirm current visitor policy during your hospital tour",
        midwifeFriendly: true,
        lactation: true,
        privateRooms: true,
        medicaid: true
      }
    ],

"""

if insert_hosp_idx:
    lines.insert(insert_hosp_idx, hospital2)
    lines.insert(insert_hosp_idx, hospital1)
    print(f"Inserted hospitals before nearbyCities at line {insert_hosp_idx}")
else:
    print("nearbyCities not found")

# Insert birth center before birthCenterDetails
if insert_bc_idx:
    birth_center = """    birthCenterDetails: [
      {
        name: "Abundant Life Birth Center" ,
        url: "https://www.thealbc.com/",
        address: "Port St. Lucie, Florida",
        thumbnail: "/images/provider-port-st-lucie-fl-abundant-life-birth-center.webp",
        paragraph: "Abundant Life Birth Center provides comprehensive, family-centered prenatal, birth, and postpartum care with births that take place at the birth center or at home. The midwife team at Abundant Life Birth Center educates each family about preventative health measures and practices evidence-based midwifery care. They welcome expecting families for complimentary consultations to learn about their unique needs and discuss birth center or home birth options. <a href=\"https://www.thealbc.com/\">Visit their website</a> for more information.",
        services: ["Midwifery Care", "Birth Center Delivery", "Home Birth", "Prenatal Care", "Postpartum Care", "Childbirth Education"],
        phone: "772-200-4277"
      }
    ],
"""
    lines.insert(insert_bc_idx, birth_center)
    print(f"Inserted birth center at line {insert_bc_idx}")
else:
    print("birthCenterDetails not found")

# Write back
with open('src/data/cities.ts', 'w') as f:
    f.writelines(lines)

print("cities.ts updated with hospitals and birth center")