#!/usr/bin/env python3
"""Generates public/downloads/birth-plan-template.pdf — a one-page printable birth plan.

Brand: True Joy Birthing. Warm cream background, serif (Georgia) headings,
lavender + rose accents from the site palette. No blue tones.

Run from the project root:
    python3 scripts/gen_birth_plan_template_pdf.py

Output: public/downloads/birth-plan-template.pdf (US Letter, single page)
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas

# ── Palette (matches src/styles/global.css) ──────────────────────────────
CREAM      = HexColor("#FAF8F5")
CHARCOAL   = HexColor("#2A2A2A")
GRAY       = HexColor("#6A6B6C")
GRAY_LIGHT = HexColor("#9A9B9C")
LAV_TEXT   = HexColor("#504E7A")   # lavender-700, readable in print
LAV_LINE   = HexColor("#B9B7D4")   # lavender-400
ROSE_TEXT  = HexColor("#9A5E84")   # rose-600
ROSE_BOX   = HexColor("#F7EDF3")   # warm rose-50 blend
ROSE_LINE  = HexColor("#D8A0C4")   # rose-400
SAGE_TEXT  = HexColor("#6F7D66")   # print-legible sage
SAGE_LINE  = HexColor("#A8B5A0")   # tjb-sage

W, H = letter  # 612 x 792 pt

# ── Fonts ─────────────────────────────────────────────────────────────────
FDIR = "/System/Library/Fonts/Supplemental"
GA, GAB, GAI = "Times-Roman", "Times-Bold", "Times-Italic"  # fallbacks
try:
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    pdfmetrics.registerFont(TTFont("TJB-Serif", os.path.join(FDIR, "Georgia.ttf")))
    pdfmetrics.registerFont(TTFont("TJB-Serif-Bold", os.path.join(FDIR, "Georgia Bold.ttf")))
    pdfmetrics.registerFont(TTFont("TJB-Serif-Italic", os.path.join(FDIR, "Georgia Italic.ttf")))
    GA, GAB, GAI = "TJB-Serif", "TJB-Serif-Bold", "TJB-Serif-Italic"
except Exception:
    pass  # fall back to Times family, still serif

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "downloads", "birth-plan-template.pdf")
c = canvas.Canvas(OUT, pagesize=letter)
c.setTitle("Birth Plan Template — True Joy Birthing")
c.setAuthor("True Joy Birthing")

M = 54  # left/right margin

# ── Background ────────────────────────────────────────────────────────────
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)


def rule(y, x1=M, x2=W - M, color=CHARCOAL, w=0.8):
    c.setStrokeColor(color)
    c.setLineWidth(w)
    c.line(x1, y, x2, y)


def checkbox(x, y, color, size=8.5):
    c.setStrokeColor(color)
    c.setLineWidth(0.9)
    c.roundRect(x, y, size, size, 1.6, fill=0, stroke=1)


def fill_line(x1, x2, y, color=GRAY_LIGHT):
    c.setStrokeColor(color)
    c.setLineWidth(0.7)
    c.setDash(1, 2)
    c.line(x1, y, x2, y)
    c.setDash()


# ── Header ────────────────────────────────────────────────────────────────
LEFT_X = 72          # content column (label gutter at M)
c.setFont("Helvetica", 7.2)
c.setFillColor(LAV_TEXT)
c.drawString(M, 756, "T R U E   J O Y   B I R T H I N G")
c.setFillColor(GRAY_LIGHT)
c.drawRightString(W - M, 756, "truejoybirthing.com")

c.setFont(GAB, 22)
c.setFillColor(CHARCOAL)
c.drawString(M, 734, "Birth Plan Template")

c.setFont(GAI, 10)
c.setFillColor(GRAY)
c.drawString(M, 720, "One page for your care team. Fill it out, print it, bring it with you.")
rule(711, color=LAV_LINE, w=1.1)

c.setFont(GA, 9)
c.setFillColor(CHARCOAL)
c.drawString(M, 696, "Fill in what matters. Cross out what doesn't. Your nurses can read")
c.drawString(M, 685, "this in about thirty seconds, which is the whole point.")

# ── Flexibility statement box ─────────────────────────────────────────────
BOX_T, BOX_H = 672, 34
c.setFillColor(ROSE_BOX)
c.setStrokeColor(ROSE_LINE)
c.setLineWidth(1)
c.roundRect(M, BOX_T - BOX_H, W - 2 * M, BOX_H, 5, fill=1, stroke=1)
c.setFont(GAB, 8)
c.setFillColor(ROSE_TEXT)
c.drawString(LEFT_X, BOX_T - 12, "MY FLEXIBILITY STATEMENT")
c.setFont(GAI, 8.6)
c.setFillColor(CHARCOAL)
c.drawString(LEFT_X, BOX_T - 24,
             "If something unexpected comes up, I'd like the conversation before the decision.")
c.drawString(LEFT_X, BOX_T - 32.5,
             "Please explain what's needed, and include my partner or doula.")

# ── About me ──────────────────────────────────────────────────────────────
y = BOX_T - BOX_H - 16
c.setFont(GAB, 8)
c.setFillColor(LAV_TEXT)
c.drawString(M, y, "ABOUT YOU")
c.setFont(GA, 9)
c.setFillColor(CHARCOAL)


def label_row(y, items):
    """items: list of (label, line_width). Renders 'Label ____' runs across the row."""
    x = M
    for label, lw in items:
        c.setFont(GA, 9)
        w_lab = c.stringWidth(label, GA, 9)
        c.drawString(x, y, label)
        fill_line(x + w_lab + 4, x + w_lab + lw, y - 1.5)
        x += w_lab + lw + 22


label_row(y - 12,  [("Name ", 150), ("Due date ", 62), ("G __ P ____", 0)])
label_row(y - 26,  [("Partner / support ", 130), ("Doula ", 70), ("Where ", 110)])
label_row(y - 40,  [("Allergies ", 130), ("Anything we should know ", 190)])

# ── The five sections ─────────────────────────────────────────────────────
SECTIONS = [
    ("01", "LABOR PREFERENCES", LAV_TEXT, LAV_LINE, [
        ("I'd like to move and change positions freely during labor", False),
        ("Intermittent monitoring unless there's a medical reason", False),
        ("People I want in the room with me", True),
    ]),
    ("02", "PAIN MANAGEMENT", ROSE_TEXT, ROSE_LINE, [
        ("Start with comfort measures first: tub, shower, breathing, movement", False),
        ("Please offer an epidural when I ask, not before", False),
        ("If labor is long, talk with me before changing the plan", False),
    ]),
    ("03", "DELIVERY PREFERENCES", LAV_TEXT, LAV_LINE, [
        ("Push in whatever position feels right to me", False),
        ("Delayed cord clamping, at least 60 seconds", False),
        ("Partner cuts the cord and announces the baby's sex", False),
    ]),
    ("04", "POSTPARTUM CARE", ROSE_TEXT, ROSE_LINE, [
        ("Baby stays with me in recovery; partner stays overnight", False),
        ("A lactation consultant visit before we go home", False),
        ("Feeding plans for baby", True),
    ]),
    ("05", "NEWBORN CARE", SAGE_TEXT, SAGE_LINE, [
        ("Baby rooms in with me at all times", False),
        ("Vitamin K, Hep B, eye ointment. My choices", True),
        ("No formula or bottles without talking to us first", False),
    ]),
]

y = 560
for num, title, tcolor, lcolor, items in SECTIONS:
    # section heading
    c.setFont(GAB, 7.4)
    c.setFillColor(lcolor)
    c.drawString(M, y, num)
    c.setFont(GAB, 9.6)
    c.setFillColor(tcolor)
    c.drawString(M + 22, y, title)
    rule(y - 4.5, color=lcolor, w=0.9)
    iy = y - 18
    for text, has_fill in items:
        checkbox(M + 1, iy - 1.5, lcolor)
        c.setFont(GA, 9.3)
        c.setFillColor(CHARCOAL)
        c.drawString(LEFT_X, iy, text)
        if has_fill:
            tw = c.stringWidth(text, GA, 9.3)
            fill_line(LEFT_X + tw + 8, W - M, iy - 1.5)
        iy -= 15.5
    y = iy - 7.5

# ── Bring-copies note + footer ────────────────────────────────────────────
rule(y + 2, color=LAV_LINE, w=0.7, x2=W / 2 + 90)
c.setFont(GAB, 8)
c.setFillColor(LAV_TEXT)
c.drawString(M, y - 14, "COPIES TO BRING:  one for your chart, one for your nurse, one for your bag.")
c.setFont(GAI, 8.4)
c.setFillColor(GRAY)
c.drawString(M, y - 26, "A plan is a letter to your care team, not a contract. Flex language is welcome here.")

rule(66, color=ROSE_LINE, w=0.7)
c.setFont(GAI, 7.6)
c.setFillColor(GRAY)
c.drawCentredString(W / 2, 54,
    "Free printable birth plan template from True Joy Birthing  ·  truejoybirthing.com/birth-plan-template")
c.setFont(GA, 7.2)
c.setFillColor(GRAY_LIGHT)
c.drawCentredString(W / 2, 42, "Print at 100% on letter paper. You have our permission to share it with anyone who needs one.")

c.showPage()
c.save()

size = os.path.getsize(OUT)
resolved = os.path.realpath(OUT)
print(f"OK wrote {resolved} ({size:,} bytes)")