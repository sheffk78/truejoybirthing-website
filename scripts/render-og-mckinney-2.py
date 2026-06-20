import base64
from PIL import Image
import io
from playwright.sync_api import sync_playwright
import os

# Get mono logo SVG as base64
with open('/Users/socializerender/Projects/truejoybirthing-website/public/images/logo-mono.svg', 'rb') as f:
    svg_b64 = base64.b64encode(f.read()).decode()

# Get hero as PNG base64
img = Image.open('/tmp/mckinney-tx-hero.png').convert('RGB')
buf = io.BytesIO()
img.save(buf, 'PNG')
hero_b64 = base64.b64encode(buf.getvalue()).decode()

W, H = 1200, 630

html = '<!DOCTYPE html>'
html += '<html><head><meta charset="utf-8">'
html += '<link rel="preconnect" href="https://fonts.googleapis.com">'
html += '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
html += '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">'
html += '<style>'
html += '*{margin:0;padding:0;box-sizing:border-box}'
html += 'html,body{width:1200px;height:630px;background:#FAF8F5;overflow:hidden}'
html += '.og-card{display:flex;flex-direction:row;width:1200px;height:630px}'
html += '.left-column{width:660px;display:flex;flex-direction:column;justify-content:center;padding:52px 64px;background:linear-gradient(180deg,#FAF8F5 0%,#EDE5F5 100%);position:relative}'
html += '.left-column::before{content:"";position:absolute;top:0;left:0;right:0;height:6px;background:#D8A0C4}'
html += '.left-column::after{content:"";position:absolute;bottom:0;left:0;right:0;height:6px;background:#D8A0C4}'
html += '.right-column{width:540px;position:relative;overflow:hidden}'
html += '.right-column img{width:100%;height:100%;object-fit:cover;object-position:center}'
html += '.right-column::before{content:"";position:absolute;top:0;left:0;right:0;height:6px;background:#D8A0C4;z-index:2}'
html += '.right-column::after{content:"";position:absolute;bottom:0;left:0;right:0;height:6px;background:#D8A0C4;z-index:2}'
html += '.accent-line{width:40px;height:3px;background:#D8A0C4;border-radius:2px;margin-bottom:20px}'
html += '.eyebrow{font-family:"Source Sans 3",system-ui,sans-serif;font-weight:600;font-size:15px;color:#B87AA0;text-transform:uppercase;letter-spacing:.12em;margin-bottom:10px}'
html += '.headline{font-family:"Cormorant Garamond",Georgia,serif;font-weight:700;font-size:52px;color:#2A2A2A;letter-spacing:-.01em;line-height:1.1;margin-bottom:16px}'
html += '.summary{font-family:"Source Sans 3",system-ui,sans-serif;font-weight:400;font-size:18px;color:#555;letter-spacing:.005em;line-height:1.5;margin-bottom:18px;max-width:520px}'
html += '.subhead{font-family:"Source Sans 3",system-ui,sans-serif;font-weight:600;font-size:15px;color:#6A6B6C;letter-spacing:.02em}'
html += '.subhead span{margin:0 8px;color:#D8A0C4}'
html += '.logo-area{margin-top:auto;padding-top:20px;display:flex;align-items:center}'
html += '.logo-area img{height:56px;width:auto}'
html += '</style></head><body>'
html += '<div class="og-card">'
html += '<div class="left-column">'
html += '<div class="accent-line"></div>'
html += '<div class="eyebrow">MCKINNEY BIRTH SUPPORT</div>'
html += '<div class="headline">Doulas &amp; Birth Plans<br>in McKinney, TX</div>'
html += '<div class="summary">From historic downtown to Towne Lake, McKinney families deserve birth support that gets it. Local doulas, two area hospitals, and a free birth plan template built for Collin County moms.</div>'
html += '<div class="subhead">Free birth plan template <span>&middot;</span> Hospital info <span>&middot;</span> Real costs <span>&middot;</span> Medicaid coverage</div>'
html += '<div class="logo-area"><img src="data:image/svg+xml;base64,' + svg_b64 + '" alt="True Joy Birthing" style="height:56px;width:auto" /></div>'
html += '</div>'
html += '<div class="right-column">'
html += '<img src="data:image/png;base64,' + hero_b64 + '" alt="McKinney" />'
html += '</div>'
html += '</div>'
html += '</body></html>'

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': W, 'height': H}, device_scale_factor=1)
    page.set_content(html, wait_until='networkidle')
    page.wait_for_timeout(8000)
    nw = page.evaluate('() => document.querySelector(".right-column img").naturalWidth')
    print(f'Image naturalWidth: {nw}')
    page.screenshot(path='/Users/socializerender/Projects/truejoybirthing-website/public/images/og-city-mckinney-tx-v2.png', clip={'x': 0, 'y': 0, 'width': W, 'height': H})
    browser.close()

img = Image.open('/Users/socializerender/Projects/truejoybirthing-website/public/images/og-city-mckinney-tx-v2.png')
print(f'Screenshot size: {img.size}')
img.save('/Users/socializerender/Projects/truejoybirthing-website/public/images/og-city-mckinney-tx-v2.webp', 'WEBP', quality=95)
size = os.path.getsize('/Users/socializerender/Projects/truejoybirthing-website/public/images/og-city-mckinney-tx-v2.webp')
print(f'OG WebP: {size} bytes')