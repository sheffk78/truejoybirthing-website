#!/usr/bin/env python3
"""Generate a professional 2-page HEMS Decision Framework + Quick Reference Card PDF."""

from fpdf import FPDF
import os

# ── Color palette ──────────────────────────────────────────────
NAVY       = (22, 33, 62)
CHARCOAL   = (44, 54, 63)
LIGHT_GRAY = (240, 242, 245)
WHITE      = (255, 255, 255)
MEDIUM_GRAY= (160, 165, 170)

H_COLOR = (41, 128, 185)
E_COLOR = (39, 174, 96)
M_COLOR = (230, 126, 34)
S_COLOR = (142, 68, 173)

DISCLAIMER_COLOR = (120, 120, 120)

# ── Font paths ─────────────────────────────────────────────────
FONT_DIR = "/System/Library/Fonts/Supplemental"
ARIAL_UNI  = os.path.join(FONT_DIR, "Arial Unicode.ttf")

CHECK = "\u2713"   # ✓
CROSS = "\u2717"   # ✗
BULLET = "\u2022"  # •
EM_DASH = "\u2014" # —


class HEMSPDF(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="Letter")
        # Single Unicode font for all text (Arial Unicode supports checkmarks etc.)
        self.add_font("AU", "", ARIAL_UNI)
        # No bold variant available — we'll use size + color for hierarchy
        self.set_auto_page_break(auto=False)

    def header_bar(self, lesson_text):
        self.set_fill_color(*NAVY)
        self.rect(0, 0, self.w, 18, "F")
        self.set_font("AU", "", 10)
        self.set_text_color(*WHITE)
        self.set_xy(12, 4)
        self.cell(0, 10, lesson_text, align="L")

    def disclaimer_footer(self):
        self.set_font("AU", "", 6.5)
        self.set_text_color(*DISCLAIMER_COLOR)
        self.set_xy(15, self.h - 14)
        self.multi_cell(self.w - 30, 3.5,
            "This content is provided for educational purposes only and does not constitute legal advice. "
            "Always consult a qualified attorney for your specific situation.",
            align="C")

    def numbered_item(self, num, title, desc, accent=NAVY):
        x_start = self.l_margin + 3
        # Number
        self.set_font("AU", "", 11)
        self.set_text_color(*accent)
        self.set_x(x_start)
        self.cell(8, 6, f"{num}.", new_x="END")
        # Title (simulated bold via slightly larger size)
        self.set_font("AU", "", 10)
        self.set_text_color(*NAVY)
        self.cell(0, 6, title, new_x="LMARGIN", new_y="NEXT")
        # Description
        self.set_font("AU", "", 8.5)
        self.set_text_color(*CHARCOAL)
        self.set_x(x_start + 8)
        self.multi_cell(self.w - (x_start + 8) - self.r_margin, 4.8, desc)
        self.ln(2)

    def memo_line(self, label):
        self.set_font("AU", "", 9)
        self.set_text_color(*NAVY)
        self.set_x(self.l_margin + 5)
        w_label = self.get_string_width(label + ": ") + 2
        self.cell(w_label, 5, label + ":")
        self.set_draw_color(*MEDIUM_GRAY)
        x_line = self.get_x()
        self.line(x_line, self.get_y() + 5, self.w - self.r_margin - 5, self.get_y() + 5)
        self.ln(6.5)

    def category_block(self, letter, title, accent_color, included, excluded):
        x = self.l_margin + 2
        w = self.w - self.l_margin - self.r_margin - 4

        # Category header bar
        self.set_fill_color(*accent_color)
        y_header = self.get_y()
        self.rect(x, y_header, w, 6.5, "F")
        self.set_font("AU", "", 9)
        self.set_text_color(*WHITE)
        self.set_xy(x + 3, y_header + 0.8)
        self.cell(w - 6, 5.5, f"{letter} {EM_DASH} {title}")
        self.set_y(y_header + 8)

        col_width = (w - 8) / 2
        x_left = x + 3
        x_right = x + 3 + col_width + 2

        # Column headers
        y_start = self.get_y()
        self.set_font("AU", "", 7.5)
        self.set_text_color(*accent_color)

        self.set_xy(x_left, y_start)
        self.cell(col_width, 4, f"INCLUDED  {CHECK}")
        self.set_xy(x_right, y_start)
        self.cell(col_width, 4, f"EXCLUDED  {CROSS}")
        self.ln(1)

        y_cur = self.get_y() + 0.5
        max_items = max(len(included), len(excluded))

        for i in range(max_items):
            y_before = y_cur

            # Render left column item
            y_after_left = y_cur
            if i < len(included):
                self.set_xy(x_left + 2, y_cur)
                self.set_font("AU", "", 7.5)
                self.set_text_color(60, 60, 60)
                self.multi_cell(col_width - 4, 3.8, f"{CHECK}  {included[i]}")
                y_after_left = self.get_y()

            # Render right column item
            y_after_right = y_cur
            if i < len(excluded):
                self.set_xy(x_right + 2, y_cur)
                self.set_font("AU", "", 7.5)
                self.set_text_color(60, 60, 60)
                self.multi_cell(col_width - 4, 3.8, f"{CROSS}  {excluded[i]}")
                y_after_right = self.get_y()

            y_cur = max(y_after_left, y_after_right) + 0.8

        self.set_y(y_cur + 3)


def build_pdf():
    pdf = HEMSPDF()
    pdf.set_margin(15)

    # ════════════════════════════════════════════════════════════
    #  PAGE 1 — HEMS Decision Framework
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.header_bar(f"Trustee 101 {EM_DASH} Lesson 4")

    # Title
    pdf.set_y(24)
    pdf.set_font("AU", "", 22)
    pdf.set_text_color(*NAVY)
    pdf.cell(0, 12, "HEMS Decision Framework", align="C", new_x="LMARGIN", new_y="NEXT")

    # Subtitle
    pdf.set_font("AU", "", 9)
    pdf.set_text_color(*MEDIUM_GRAY)
    pdf.cell(0, 5, f"The 4-Question Test {EM_DASH} Ask Before Every Distribution", align="C", new_x="LMARGIN", new_y="NEXT")

    # Accent line
    pdf.set_draw_color(*NAVY)
    pdf.set_line_width(0.5)
    pdf.line(pdf.l_margin + 40, pdf.get_y() + 3, pdf.w - pdf.r_margin - 40, pdf.get_y() + 3)
    pdf.ln(7)

    # ── The 4 Questions ──────────────────────────────────────
    pdf.set_font("AU", "", 12)
    pdf.set_text_color(*NAVY)
    pdf.cell(0, 7, "The 4-Question Test", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    pdf.numbered_item(
        1,
        "Which HEMS category fits?",
        f"Health (medical diagnosis/treatment) {BULLET} Education (tuition/books/fees/certifications) "
        f"{BULLET} Maintenance (accustomed standard of living) {BULLET} Support (maintenance + circumstances-based needs)"
    )
    pdf.numbered_item(
        2,
        "Does the trust document modify the standard?",
        "Some trusts narrow to HE only, some expand. The document controls."
    )
    pdf.numbered_item(
        3,
        f"Can the trust afford it {EM_DASH} for ALL beneficiaries?",
        f"Consider current AND future beneficiaries. Don\u2019t drain the trust for one."
    )
    pdf.numbered_item(
        4,
        "Is this consistent with past distributions?",
        "If you approved X for one beneficiary, what justifies more/different for another?"
    )

    pdf.ln(3)

    # ── Memo Template ─────────────────────────────────────────
    box_y = pdf.get_y() - 2
    pdf.set_fill_color(*LIGHT_GRAY)
    pdf.rect(pdf.l_margin, box_y, pdf.w - pdf.l_margin - pdf.r_margin, 48, "F")

    # Top accent bar
    pdf.set_fill_color(*NAVY)
    pdf.rect(pdf.l_margin, box_y, pdf.w - pdf.l_margin - pdf.r_margin, 6.5, "F")
    pdf.set_font("AU", "", 9.5)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(pdf.l_margin + 5, box_y + 0.8)
    pdf.cell(0, 5, f"The Memo Template {EM_DASH} Complete for Every Distribution")
    pdf.ln(7)

    pdf.memo_line("Category")
    pdf.memo_line("Amount")
    pdf.memo_line("Purpose")
    pdf.memo_line("Impact on Trust")
    pdf.memo_line("Consistency with past")

    # Disclaimer
    pdf.disclaimer_footer()

    # ════════════════════════════════════════════════════════════
    #  PAGE 2 — HEMS Quick Reference Card
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.header_bar(f"Trustee 101 {EM_DASH} Lesson 4")

    # Title
    pdf.set_y(24)
    pdf.set_font("AU", "", 22)
    pdf.set_text_color(*NAVY)
    pdf.cell(0, 12, "HEMS Quick Reference Card", align="C", new_x="LMARGIN", new_y="NEXT")

    # Accent line
    pdf.set_draw_color(*NAVY)
    pdf.set_line_width(0.5)
    pdf.line(pdf.l_margin + 40, pdf.get_y() + 2, pdf.w - pdf.r_margin - 40, pdf.get_y() + 2)
    pdf.ln(6)

    # ── H — Health ────────────────────────────────────────────
    h_included = [
        "Medical, dental, mental health",
        "Prescribed treatments",
        "Physical therapy",
        "Alternative treatments (if prescribed by licensed practitioner)",
    ]
    h_excluded = [
        "Cosmetic surgery (non-reconstructive)",
        "Elective procedures",
        "Gym memberships (unless prescribed)",
        "Vitamins/supplements (unless prescribed)",
        "\u201cStress vacations\u201d",
    ]
    pdf.category_block("H", "Health", H_COLOR, h_included, h_excluded)

    # ── E — Education ─────────────────────────────────────────
    e_included = [
        "Tuition, books, room & board while enrolled",
        "Fees, certifications",
        "Vocational training",
    ]
    e_excluded = [
        "Gap-year trips",
        "Cars for commuting",
        "Student loan repayment",
        "Children\u2019s tuition (unless trust says \u201cdescendants\u201d)",
    ]
    pdf.category_block("E", "Education", E_COLOR, e_included, e_excluded)

    # ── M — Maintenance ──────────────────────────────────────
    m_included = [
        "Accustomed standard of living (what beneficiary had before trust)",
    ]
    m_excluded = [
        "Upgrading lifestyle (luxury SUV, bigger home, designer wardrobe)",
    ]
    pdf.category_block("M", "Maintenance", M_COLOR, m_included, m_excluded)

    # ── S — Support ──────────────────────────────────────────
    s_included = [
        "Maintenance + additional needs from circumstances",
        "Disability, divorce, dependent children",
    ]
    s_excluded = [
        "Startup capital / entrepreneurial investments",
        "Gifts to non-beneficiaries",
    ]
    pdf.category_block("S", "Support", S_COLOR, s_included, s_excluded)

    # ── Critical Reminder ────────────────────────────────────
    y_reminder = pdf.get_y() + 2
    pdf.set_fill_color(*NAVY)
    pdf.rect(pdf.l_margin, y_reminder, pdf.w - pdf.l_margin - pdf.r_margin, 22, "F")
    pdf.set_font("AU", "", 9.5)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(pdf.l_margin + 5, y_reminder + 2)
    pdf.cell(0, 5, "Critical Reminder")
    pdf.set_font("AU", "", 7.5)
    pdf.set_xy(pdf.l_margin + 5, y_reminder + 8)
    pdf.multi_cell(pdf.w - pdf.l_margin - pdf.r_margin - 10, 4,
        f"{BULLET}  Every distribution must fit at least one HEMS category.\n"
        f"{BULLET}  Write a 2-minute memo for every distribution.\n"
        f"{BULLET}  The document controls {EM_DASH} HEMS is the default, not the rule.")

    # Disclaimer
    pdf.disclaimer_footer()

    # ── Save ──────────────────────────────────────────────────
    output_path = "/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrustOffice/video/remotion/out/HEMS-Decision-Framework-L4.pdf"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    pdf.output(output_path)
    print(f"PDF saved to: {output_path}")
    return output_path


if __name__ == "__main__":
    build_pdf()