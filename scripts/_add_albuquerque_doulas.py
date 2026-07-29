#!/usr/bin/env python3
"""Add local doulas to the albuquerque-nm entry."""

with open('src/data/cities.ts', 'r') as f:
    content = f.read()

target = 'supportSceneAlt: "A doula supporting an expectant mom in Albuquerque: New Mexico birth support and doula care",'

doulas_block = """supportSceneAlt: "A doula supporting an expectant mom in Albuquerque: New Mexico birth support and doula care",
    localDoulas: [
      { name: "Katie Schmierer" , credential: "RN, Birth & Postpartum Doula" , practice: "41 Wellness" , url: "https://www.bornbir.com/katie-schmierer" , photo: "" , description: "Founder of 41 Wellness, a birth services team in Albuquerque with 15 years of experience offering birth doula, postpartum doula, night nanny, placenta encapsulation, and childbirth education. 5.0 stars on Bornbir with 7 reviews." , costRange: "$725-$1,650" , acceptingClients: true, services: ["Birth Doula" , "Postpartum Doula" , "Childbirth Education" , "Placenta Encapsulation"], serviceArea: ["Albuquerque, NM" , "Rio Rancho, NM"] },
      { name: "Laura Dehne" , credential: "Certified Labor & Birth Doula" , practice: "Laura Dehne Doula Services" , url: "https://www.bornbir.com/laura-dehne" , photo: "" , description: "Certified labor and birth doula in Albuquerque with 7 years of experience. Laura started her birth work as a volunteer with the UNMH Birth Companion program, supporting a variety of births including both medicated and unmedicated. Offers judgment-free support through education, relaxation techniques, and comfort measures." , costRange: "$725-$1,650" , acceptingClients: true, services: ["Birth Doula" , "Childbirth Education"], serviceArea: ["Albuquerque, NM"] },
      { name: "Gabriella Sarate" , credential: "Birth Doula" , practice: "Gabriella Sarate Doula" , url: "https://www.bornbir.com/gabriella-sarate" , photo: "" , description: "Experienced birth doula with 12 years of experience supporting birthing women in Albuquerque. Passionate about educating women on the power of their body and helping them step into their given power during birth. 5.0 stars on Bornbir." , costRange: "$725-$1,650" , acceptingClients: true, services: ["Birth Doula" , "Postpartum Support"], serviceArea: ["Albuquerque, NM"] },
      { name: "Tintawi Kaigziabiher" , credential: "Certified Birth Doula" , practice: "Tintawi Kaigziabiher" , url: "https://www.bornbir.com/tintawi-kaigziabiher" , photo: "" , description: "Experienced birth doula in Albuquerque with over 15 years in maternal and infant health. Has assisted midwives, trained with birth attendants in traditional and evidence-based care, and supported families in home and hospital births. Collaborates with statewide organizations to improve birth outcomes." , costRange: "$800-$1,500" , acceptingClients: true, services: ["Birth Doula" , "Full-Spectrum Doula" , "Postpartum Doula"], serviceArea: ["Albuquerque, NM" , "Santa Fe, NM"] },
      { name: "New Life Birth Services" , credential: "Birth Doula" , practice: "New Life Birth Services" , url: "https://www.newlifebirthservices.org/" , photo: "" , description: "Albuquerque's premiere birth doula services offering birth doula support, postpartum doula care, placenta encapsulation, and lactation services. Serves the Albuquerque metro area with a team of experienced birth professionals." , costRange: "$800-$1,500" , acceptingClients: true, services: ["Birth Doula" , "Postpartum Doula" , "Lactation Support" , "Placenta Encapsulation"], serviceArea: ["Albuquerque, NM"] }
    ],"""

if target in content:
    content = content.replace(target, doulas_block)
    with open('src/data/cities.ts', 'w') as f:
        f.write(content)
    print("Successfully added doulas!")
else:
    print(f"ERROR: Could not find target string!")
    # Debug: show what's around line 5876
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'supportSceneAlt' in line and 'Albuquerque' in line:
            print(f"Found at line {i+1}: {repr(line)}")