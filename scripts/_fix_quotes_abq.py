#!/usr/bin/env python3
"""Fix unescaped double quotes in the albuquerque-nm entry."""
import pathlib

path = pathlib.Path('src/data/cities.ts')
content = path.read_text()

# Replace the specific problematic strings using raw strings for safety
old_mn = 'Call your Centennial Care plan and ask "Do you cover doula services?" to confirm'
new_mn = 'Call your Centennial Care plan and ask \\"Do you cover doula services?\\" to confirm'
content = content.replace(old_mn, new_mn)

old_faq = 'call your Medicaid plan and ask "Do you cover doula services?" \u2014'
new_faq = 'call your Medicaid plan and ask \\"Do you cover doula services?\\" \u2014'
content = content.replace(old_faq, new_faq)

path.write_text(content)
print("Fixed unescaped double quotes!")