#!/usr/bin/env python3
"""Stamp the Joyful Birth Plan PDF with an app-download QR + caption.

Run whenever public/true-joy-birth-plan.pdf changes:
    python3 scripts/stamp-pdf-qr.py

Idempotent: skips if the last page already carries the stamp caption;
otherwise stamps the LAST page bottom-left (clear of footer text) and
replaces the file only after stamp + verify pass.
Requires: qrcode, reportlab, pypdf, opencv-python, poppler (pdftoppm).
"""
import subprocess
import sys
import tempfile
from functools import lru_cache
from pathlib import Path

import qrcode
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas

URL = 'https://truejoybirthing.com/app?src=pdf-qr'
SIZE = 88  # stamped size in pt incl. quiet zone
X0, Y0 = 40, 30  # bottom-left, clear of footer text (x 548+, y ~6-12)
CAPTION = 'Build your plan in the app'


@lru_cache(maxsize=1)
def _pdf_path() -> Path:
    return Path(__file__).resolve().parent.parent / 'public' / 'true-joy-birth-plan.pdf'


def already_stamped(reader: PdfReader) -> bool:
    """True if the last page already carries the caption (idempotency guard)."""
    try:
        from pdfminer.high_level import extract_pages
        from pdfminer.layout import LTTextContainer
        last = len(reader.pages) - 1
        for page in extract_pages(str(_pdf_path()), page_numbers=[last]):
            if any(isinstance(el, LTTextContainer) and CAPTION in el.get_text()
                   for el in page):
                return True
    except Exception:
        return False
    return False


def main() -> int:
    src = _pdf_path()
    if not src.exists():
        print(f'missing {src}'); return 1

    reader = PdfReader(str(src))
    if already_stamped(reader):
        print(f'already stamped, skipping: {src}')
        return 0

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        qr_png = td / 'qr.png'
        qrcode.make(URL, error_correction=qrcode.constants.ERROR_CORRECT_M,
                    border=2, box_size=10).save(qr_png)

        overlay = td / 'overlay.pdf'
        W, H = 612, 792
        c = canvas.Canvas(str(overlay), pagesize=(W, H))
        c.drawImage(str(qr_png), X0 + 8, Y0 + 12, SIZE - 16, SIZE - 16)
        c.setFont('Helvetica', 6.5)
        c.setFillColorRGB(0.35, 0.35, 0.35)
        c.drawCentredString(X0 + SIZE / 2, Y0 + 8, CAPTION)
        c.save()

        stamped = td / 'stamped.pdf'
        writer = PdfWriter()
        ov = PdfReader(str(overlay))
        for i, page in enumerate(reader.pages):
            if i == len(reader.pages) - 1:
                page.merge_page(ov.pages[0])
            writer.add_page(page)
        with open(stamped, 'wb') as f:
            writer.write(f)

        # verify: page count unchanged + QR still decodes from a render
        r2 = PdfReader(str(stamped))
        assert len(r2.pages) == len(reader.pages), 'page count changed'
        png = td / 'last'
        subprocess.run(['pdftoppm', '-f', str(len(r2.pages)), '-l', str(len(r2.pages)),
                        '-r', '150', '-png', str(stamped), str(td / 'pg')], check=True)
        last_png = sorted(td.glob('pg-*.png'))[-1]
        import cv2
        im = cv2.imread(str(last_png))
        sc = 150 / 72
        crop = im[int((792 - 140) * sc):int((792 - 15) * sc), int(25 * sc):int(150 * sc)]
        val, _, _ = cv2.QRCodeDetector().detectAndDecode(crop)
        assert val == URL, f'QR decode mismatch: {val!r}'

        dst = src  # replace only after verification passed
        dst.write_bytes(stamped.read_bytes())
        print(f'stamped + verified -> {dst} ({dst.stat().st_size} bytes)')
    return 0


if __name__ == '__main__':
    sys.exit(main())