import base64
from PIL import Image
import io
from playwright.sync_api import sync_playwright
import os

# Convert hero PNG to base64
img = Image.open('/tmp/mckinney-tx-hero.png').convert('RGB')
buf = io.BytesIO()
img.save(buf, 'JPEG', quality=85)
b64 = base64.b64encode(buf.getvalue()).decode()

W, H = 1200, 630

html = f'''<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1200px;height:630px;background:#FAF8F5;overflow:hidden}}
.og-card{{display:flex;flex-direction:row;width:1200px;height:630px}}
.left-column{{width:660px;display:flex;flex-direction:column;justify-content:center;padding:52px 64px;background:linear-gradient(180deg,#FAF8F5 0%,#EDE5F5 100%);position:relative}}
.left-column::before{{content:"";position:absolute;top:0;left:0;right:0;height:6px;background:#D8A0C4}}
.left-column::after{{content:"";position:absolute;bottom:0;left:0;right:0;height:6px;background:#D8A0C4}}
.right-column{{width:540px;position:relative;overflow:hidden}}
.right-column img{{width:100%;height:100%;object-fit:cover;object-position:center}}
.right-column::before{{content:"";position:absolute;top:0;left:0;right:0;height:6px;background:#D8A0C4;z-index:2}}
.right-column::after{{content:"";position:absolute;bottom:0;left:0;right:0;height:6px;background:#D8A0C4;z-index:2}}
.accent-line{{width:40px;height:3px;background:#D8A0C4;border-radius:2px;margin-bottom:20px}}
.eyebrow{{font-family:"Source Sans 3",system-ui,sans-serif;font-weight:600;font-size:15px;color:#B87AA0;text-transform:uppercase;letter-spacing:.12em;margin-bottom:10px}}
.headline{{font-family:"Cormorant Garamond",Georgia,serif;font-weight:700;font-size:52px;color:#2A2A2A;letter-spacing:-.01em;line-height:1.1;margin-bottom:16px}}
.summary{{font-family:"Source Sans 3",system-ui,sans-serif;font-weight:400;font-size:18px;color:#555;letter-spacing:.005em;line-height:1.5;margin-bottom:18px;max-width:520px}}
.subhead{{font-family:"Source Sans 3",system-ui,sans-serif;font-weight:600;font-size:15px;color:#6A6B6C;letter-spacing:.02em}}
.subhead span{{margin:0 8px;color:#D8A0C4}}
.logo-area{{margin-top:auto;padding-top:20px;display:flex;align-items:center}}
.logo-area img{{height:56px;width:auto}}
</style></head><body>
<div class="og-card">
<div class="left-column">
<div class="accent-line"></div>
<div class="eyebrow">MCKINNEY BIRTH SUPPORT</div>
<div class="headline">Doulas & Birth Plans<br>in McKinney, TX</div>
<div class="summary">From historic downtown to Towne Lake, McKinney families deserve birth support that gets it. Local doulas, two area hospitals, and a free birth plan template built for Collin County moms.</div>
<div class="subhead">Free birth plan template <span>·</span> Hospital info <span>·</span> Real costs <span>·</span> Medicaid coverage</div>
<div class="logo-area"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NyIgaGVpZ2h0PSI3NyIgZmlsbD0ibm9uZSI+CiAgPHBhdGggZD0iTTUzIDBhMjUgMjUgMCAwIDAtMTUgNCAyMyAyMyAwIDAgMC0zIDMzbC01IDdhMjUgMjUgMCAwIDAgMTUgN2wyIDFhMjUgMjUgMCAwIDAgMTgtNDQgMjMgMjMgMCAwIDAtMTItN3oiIGZpbGw9IiMxNDE0MTQiLz4KICA8cGF0aCBkPSJNNzcgMjdhMjUgMjUgMCAwIDAtMTUtMTAgMjUgMjUgMCAwIDAtMjEgM2wyIDFhMjMgMjMgMCAwIDEgMTIgMiAyMCAyMCAwIDAgMSA1IDMgMjIgMjIgMCAwIDEgMyAxIDIzIDIzIDAgMCAxIDkgOSAyMCAyMCAwIDAgMSAyIDVjMiAxMCAwIDIxLTggMjhhMjUgMjUgMCAwIDEtMTUgN2wyIDFhMjUgMjUgMCAwIDAgMTgtNDQgMjMgMjMgMCAwIDAtNi01eiIgZmlsbD0iIzE0MTQxNCIvPgogIDxwYXRoIGQ9Ik00NSAyN2ExMiAxMiAwIDAgMC04LTEwYzMtMiA3LTMgMTAtM2wzLTFjMyAwIDUgMCA4IDFhMTIgMTIgMCAwIDEgMyAyIDggOCAwIDAgMSAyIDMgMTIgMTIgMCAwIDEgMSA2djBhMTIgMTIgMCAwIDEtNiAxMCAxMCAxMCAwIDAgMS0xMCAwIDEyIDEyIDAgMCAxLTMsLTl6IiBmaWxsPSIjMTQxNDE0Ii8+Cjwvc3ZnPg==" alt="True Joy Birthing" /></div>
</div>
<div class="right-column">
<img src="data:image/jpeg;base64,{b64}" alt="McKinney" />
</div>
</div>
</body></html>'''

with open('/Users/socializerender/Projects/truejoybirthing-website/scripts/og-render-mckinney.html', 'w') as f:
    f.write(html)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': W, 'height': H}, device_scale_factor=1)
    page.goto('file:///Users/socializerender/Projects/truejoybirthing-website/scripts/og-render-mckinney.html', wait_until='networkidle')
    page.wait_for_timeout(5000)
    nw = page.evaluate('() => document.querySelector(".right-column img").naturalWidth')
    print(f'naturalWidth={nw}')
    page.screenshot(path='/Users/socializerender/Projects/truejoybirthing-website/public/images/og-city-mckinney-tx-v2.png', clip={'x': 0, 'y': 0, 'width': W, 'height': H})
    browser.close()

img = Image.open('/Users/socializerender/Projects/truejoybirthing-website/public/images/og-city-mckinney-tx-v2.png')
img.save('/Users/socializerender/Projects/truejoybirthing-website/public/images/og-city-mckinney-tx-v2.webp', 'WEBP', quality=95)
size = os.path.getsize('/Users/socializerender/Projects/truejoybirthing-website/public/images/og-city-mckinney-tx-v2.webp')
print(f'OG render complete. Size: {size} bytes')