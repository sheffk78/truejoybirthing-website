# Dallas CITY_META entry for upload-youtube.py
# Add this to the CITY_META dict in remotion/scripts/upload-youtube.py
# Chapters are estimated - will need to align after TTS durations are known

dallas_meta = {
    'title': 'Dallas Doula & Birth Plan Guide: Costs, Hospitals & Medicaid (First-Time Mom)',
    'description': """You just found out you're pregnant in Dallas — now what? This guide walks you through everything: doulas and midwives serving Dallas, hospital policies, real costs, and whether Texas Medicaid covers a doula.

📱 Get the free app → https://truejoybirthing.com
📝 Free birth plan → https://truejoybirthing.com/birth-plan-template/
📍 Dallas doula directory → https://truejoybirthing.com/birth-support/dallas-tx/

▸ Find Dallas doulas & midwives (10+ providers)
▸ Compare hospital options (Texas Health Dallas, Baylor, Parkland, Medical City Dallas, Methodist Dallas)
▸ Know what doula care actually costs ($900-$2,800)
▸ Understand Texas Medicaid doula coverage under SB 750
▸ Build your free birth plan step by step

CHAPTERS:
0:00 — Welcome to Dallas
0:11 — Where Dallas Families Deliver
0:25 — Texas Health Presbyterian Hospital Dallas (Level III)
0:42 — Baylor University Medical Center (Level III)
0:59 — Parkland Memorial Hospital (Level III)
1:16 — Medical City Dallas (Level III)
1:33 — Methodist Dallas Medical Center (Level III)
1:50 — Doulas & Midwives in Dallas
2:02 — The True Joy Birthing App
2:27 — Cost Reality ($900-$2,800)
2:45 — Insurance & Texas Medicaid (SB 750)
3:12 — Urban Family Co-op Birth Center
3:28 — Your Next Step

True Joy Birthing helps first-time moms build their birth plans, find local support, and walk into the hospital prepared — all for free.

Created by Shelbi Kohler, certified birth doula.

#dallasdoula #dallastxbirth #texasmedicaid #birthplan #doula #pregnancydallas""",
    'tags': [
        'Dallas doula', 'Dallas birth doula', 'Texas Medicaid doula',
        'Dallas pregnancy guide', 'birth plan template', 'first time mom Dallas',
        'Texas Health Dallas maternity', 'Baylor Dallas maternity', 'Parkland Hospital Dallas',
        'Dallas doula cost', 'Texas birth support',
        'doula near me', 'Dallas midwife', 'pregnancy Texas',
        'free birth plan', 'doula services Dallas', 'birth preparation',
        'Medical City Dallas', 'Methodist Dallas',
    ],
    'category_id': '27',  # Education
    'privacy_status': 'public',
    'made_for_kids': False,
}

print(f"Title: {dallas_meta['title']}")
print(f"Tags count: {len(dallas_meta['tags'])}")
print("Ready to add to upload-youtube.py")