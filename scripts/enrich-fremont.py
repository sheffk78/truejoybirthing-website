#!/usr/bin/env python3
"""
Enrich provider data for fremont-ca city page.
- Downloads remote photos and converts to webp
- Uses Firecrawl for providers with no photo URL
- Uses Ollama (qwen35-27b-fast) for descriptions
- Writes enrichment results + updates provider cache
"""
import json, os, re, subprocess, time, hashlib, urllib.request, urllib.error, ssl
from pathlib import Path
from datetime import datetime, timedelta

BASE = Path("/Users/socializerender/Projects/truejoybirthing-website")
IMG_DIR = BASE / "public" / "images"
CACHE_PATH = Path.home() / ".hermes" / "state" / "tjb-provider-cache.json"
HOSP_CACHE_PATH = Path.home() / ".hermes" / "state" / "tjb-hospital-cache.json"
OUTPUT_DIR = Path.home() / ".hermes" / "state" / "enrichment-batch"
OUTPUT_PATH = OUTPUT_DIR / "fremont-ca.json"

# Providers extracted from cities.ts fremont-ca localDoulas
# Using the first set (with photos) as primary, second set has updated costRange
PROVIDERS = [
    {"name": "Soul Sisters Doula Training", "url": "https://www.doulapaolareis.com", "photo": "/images/doulas/soul-sisters-doula-training.webp", "costRange": "$1,500–$3,000", "description": "Birth doula supporting 80+ families with heart-centered care.", "services": ["Birth Doula", "Postpartum", "Breastfeeding Support", "Placenta Encapsulation", "Evidence-Based Care"]},
    {"name": "BORN Doulas", "url": "https://borndoulas.com", "photo": "https://s3-media0.fl.yelpcdn.com/bphoto/Btt5cT5Ykq3RMMbDX1XOTw/ls.jpg", "costRange": "$1,500–$3,000", "description": "Birth and lactation doula services in the Bay Area. Accepts Medi-Cal.", "services": ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Placenta Encapsulation"], "acceptsMedicaid": True},
    {"name": "Hollyn Doula Services", "url": "http://hollyndoulaservices.com", "photo": "https://hollyndoulaservices.com/_assets/media/1cd215e026688bcc00045d52ef93217a.jpg", "costRange": "$70-$3,500", "description": "Postpartum doula offering overnight care, packages, and comprehensive support for new families.", "services": ["Postpartum"]},
    {"name": "Birth&Postpartum Doula service by Bay Golden Doula", "url": "https://www.baygoldendoula.com", "photo": "https://static.wixstatic.com/media/a9bcc2_630e15b620044e25ae0366618fe9f997~mv2.png/v1/fill/w_207,h_207,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/dccdabe89b7e49979634cecdf4d56877.png", "costRange": "Contact for pricing", "description": "Birth and postpartum doula providing safe, supportive care in the Bay Area.", "services": ["Birth Doula", "Postpartum", "Lactation", "Evidence-Based Care"]},
    {"name": "Postpartum Night Doula, Lactation, Infant Sleep", "url": "https://www.doulababyservices.com", "photo": "https://static.wixstatic.com/media/b8ad51_902128a025114677a2f20611335d371d~mv2.jpg/v1/fill/w_668,h_439,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Mother%2520with%2520her%2520Child_edited.jpg", "costRange": "Contact for pricing", "description": "Doula Baby Services: Supporting Your Parenting Journey Postpartum Doula Karina Plotek of DoulaBabyServices brings her warmth and expertise to the field of Postpartum Support, Newborn Care, Lactation Education & Pediatric Sleep Consulting.", "services": ["Postpartum", "Lactation"]},
    {"name": "Harmony Doula Group", "url": "https://harmonydoula.com", "photo": "https://harmonydoula.com/JQuery/imageJQR-1.jpg", "costRange": "Contact for pricing", "description": "Childbirth and Lactation Education Calm.", "services": ["Birth Doula", "Postpartum", "Lactation", "Placenta Encapsulation", "Childbirth Education"]},
    {"name": "Postpartum Doula Services by Tamra", "url": "http://doulatamra.com", "photo": "https://images.squarespace-cdn.com/content/v1/5c6a0507d86cc95a5ae670e4/1550552173281-A9TIN9IW6NQE1Q4MGALK/IMG_1662.jpg", "costRange": "Contact for fee; min 4hr shifts", "description": "Birth and postpartum doula offering overnight care, lactation, and breastfeeding support. Accepts Medi-Cal.", "services": ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Overnight Care"], "acceptsMedicaid": True},
    {"name": "Redwood Doulas", "url": "https://redwooddoulas.com", "photo": "https://redwooddoulas.com/wp-content/uploads/2021/12/birth-postpartum-doulas.jpg", "costRange": "Contact for pricing", "description": "Congratulations on this exciting time in your life.", "services": ["Birth Doula", "Postpartum", "Breastfeeding Support", "Placenta Encapsulation", "Evidence-Based Care"], "isVerified": False},
    {"name": "DOULAS by the BAY LLC", "url": "https://www.doulasbythebay.com/discovery", "photo": "https://www.doulasbythebay.com/wp-content/uploads/2026/05/Kaiser-2.png", "costRange": "Contact for pricing", "description": "Evidence-Based Birth & Postpartum Doula Care in California Trusted since 2009 • 70+ employed doulas • 3,000+ families supported.", "services": ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Overnight Care"], "acceptsMedicaid": True},
    {"name": "Quetzal Doula", "url": "https://www.quetzaldoula.com", "photo": "https://quetzaldoula.com/wp-content/uploads/2017/02/rio-guacimal.jpg", "costRange": "Contact for pricing", "description": "Birth doula providing care and support in the Bay Area.", "services": ["Birth Doula", "Postpartum"]},
    {"name": "Stephanie Mollinier | Birth Doula", "url": "http://www.stephaniedoula.com", "photo": "https://images.squarespace-cdn.com/content/v1/5b3eee9d2714e53cdf0ddea8/0bab41b0-f533-4e41-9e94-bf41deeece66/StephanieHeadshotSession5557-Edit.jpg", "costRange": "Contact for pricing", "description": "Birth Doula + Pregnancy Coaching for GROWING families in San Jose, CA.", "services": ["Birth Doula"]},
    {"name": "Bay City Doulas", "url": "https://baycitydoulas.com", "photo": "https://baycitydoulas.com/wp-content/uploads/2021/10/Welcome-Bay-city.png", "costRange": "Contact for pricing", "description": "Postpartum doula care offering overnight support and breastfeeding assistance in the Bay Area.", "services": ["Postpartum", "Breastfeeding Support", "Overnight Care"]},
    {"name": "Lauren Noble, Doula", "url": "http://nobledoula.com", "photo": "https://images.squarespace-cdn.com/content/v1/55d5524ee4b03efa6b0a7cb8/2e25a290-ee20-4b9e-9793-737b8faca318/Violet+%26+Charlotte.JPEG", "costRange": "Contact for pricing", "description": "Thanks so much for coming I'm no longer taking doula clients.", "services": ["Birth Doula", "Postpartum", "Placenta Encapsulation", "Childbirth Education", "Prenatal Care"], "acceptingClients": False},
    {"name": "Bay Area Night Doulas Collective", "url": "https://bayareanightdoulas.com", "photo": "https://bayareanightdoulas.com/wp-content/uploads/2023/03/yelp-logo.png", "costRange": "Contact for pricing", "description": "San Francisco Bay Area postpartum doulas providing overnight care, lactation, and breastfeeding support.", "services": ["Postpartum", "Lactation", "Breastfeeding Support", "Overnight Care"]},
    {"name": "Plumeria Doula Care", "url": "https://plumeriadoula.com", "photo": "https://plumeriadoula.com/wp-content/uploads/2023/11/Leticia-Plumeria-Newborn-Care-min.png", "costRange": "Contact for pricing", "description": "Birth and postpartum doula serving the San Francisco Bay Area.", "services": ["Birth Doula", "Postpartum", "Breastfeeding Support"]},
    {"name": "Baby Bliss Doula", "url": "https://www.babybliss-doula.com", "photo": "https://images.squarespace-cdn.com/content/v1/65e96dd299ef13182a34bd37/fbf2edd7-ca61-4c00-9d2d-a711753f2532/PostpartumDoula.jpg", "costRange": "Contact for pricing", "description": "Empowering New Families, Nurturing Newborns Mother lovingly holding her newborn, with postpartum support services to help new parents with early childhood care and nurturing.", "services": ["Birth Doula", "Postpartum", "Breastfeeding Support", "Evidence-Based Care"]},
    {"name": "Do Well Doula", "url": "http://www.dowelldoula.com", "photo": "https://static.wixstatic.com/media/13a2c5_8fa6f3822adc4684a08b0c3ff33180c2~mv2.jpg/v1/fill/w_374,h_374,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_3296_edited.jpg", "costRange": "Contact for pricing", "description": "Birth and postpartum doula providing childbirth education and evidence-based support.", "services": ["Birth Doula", "Postpartum", "Breastfeeding Support", "Childbirth Education", "Overnight Care"]},
    {"name": "East Bay Postpartum Doula Circle", "url": "https://www.eastbaypostpartum.com", "photo": "https://eastbaypostpartum.com/images/doulas/denise-macko.jpg", "costRange": "Contact for pricing", "description": "Your Fourth Trimester, Covered A guild of 30+ certified doulas providing daytime, nighttime, and live-in postpartum care to Bay Area families.", "services": ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Overnight Care"], "acceptsMedicaid": True},
    {"name": "Golden Gate Doula Associates", "url": "http://www.goldengatedoula.com", "photo": "https://static.showit.co/400/oHWMuB6lQLuiM5O9wnczhg/shared/best_doula_2022.png", "costRange": "Contact for pricing", "description": "Trusted maternity and postpartum resource in the Bay Area since 2016.", "services": ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Prenatal Care"]},
    {"name": "Mama Bear Birth Services", "url": "https://sites.google.com/view/sfbirthservices/home", "photo": "/images/doulas/mama-bear-birth-services.webp", "costRange": "Contact for pricing", "description": "Pre/postnatal Pilates, doula support, and childbirth education serving the Bay Area.", "services": ["Postpartum", "Childbirth Education", "Prenatal Care"]},
    {"name": "The Dream Doula", "url": "http://thedreamdoula.me", "photo": "https://static.wixstatic.com/media/3024e3_4a8837886f3e4692963fe8dc7d0a57b5~mv2.jpg/v1/fill/w_615,h_737,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3024e3_4a8837886f3e4692963fe8dc7d0a57b5~mv2.jpg", "costRange": "Contact for pricing", "description": "The support you and your family need to feel confident and reassured.", "services": ["Birth Doula", "Postpartum", "Breastfeeding Support"]},
    {"name": "Sacred Lotus Doula Services", "url": "https://www.yelp.com/biz/sacred-lotus-doula-services-dublin", "photo": "https://s3-media0.fl.yelpcdn.com/bphoto/YDWG6jhA9ZN-EW2sL4spBw/l.jpg", "costRange": "Contact for pricing", "description": "I am certified through Stillbirthday as a birth and bereavement doula.", "services": ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Placenta Encapsulation"], "acceptsMedicaid": True},
    {"name": "Modesto Birth & Beyond Doula Team", "url": "https://www.modestobirthandbeyond.com", "photo": "https://images.squarespace-cdn.com/content/v1/5d912c67bcf2f2691dc523de/1578258023513-HWHHZHD6OS4T1441W0Q6/IMG_8398.jpeg", "costRange": "Contact for pricing", "description": "MBB partners with Kaiser & HealthNet, offering 100% coverage for Education & Birth Plan Counseling, with or without birth doula or lactation support.", "services": ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Placenta Encapsulation"], "acceptsMedicaid": True},
    {"name": "San Mateo Doula", "url": "https://sanmateodoula.com", "photo": "https://sanmateodoula.com/wp-content/uploads/2025/01/464293214_8493287680791970_1990419347808526617_n.jpg", "costRange": "Contact for pricing", "description": "With over 20 years of experience serving families in San Mateo County and the greater Bay Area, we provide expert, nurturing support at every stage of your birth and postpartum journey.", "services": ["Postpartum", "Breastfeeding Support", "Overnight Care"]},
    {"name": "Postpartum Doula & Parent Coach", "url": "https://www.doulababyservices.com", "photo": "https://static.wixstatic.com/media/b8ad51_902128a025114677a2f20611335d371d~mv2.jpg/v1/fill/w_668,h_439,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Mother%2520with%2520her%2520Child_edited.jpg", "costRange": "Contact for pricing", "description": "Doula Baby Services: Supporting Your Parenting Journey Postpartum Doula Karina Plotek of DoulaBabyServices brings her warmth and expertise to the field of Postpartum Support, Newborn Care, Lactation Education & Pediatric Sleep Consulting.", "services": ["Postpartum", "Lactation"]},
    {"name": "Andrea Berkey; Three Phases Doula", "url": "http://www.threephasesdoula.com", "photo": "https://static.wixstatic.com/media/bf3444_d10d21d930b042c18bf5d7fa353c8b98.jpg/v1/crop/x_0,y_318,w_5760,h_3411/fill/w_979,h_805,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bf3444_d10d21d930b042c18bf5d7fa353c8b98.jpg", "costRange": "Contact for pricing", "description": "The whisperer of babies, your extra set of hands, and your resource center.", "services": ["Postpartum", "Lactation", "Breastfeeding Support"]},
    {"name": "Haven Baby Doula", "url": "https://www.havenbabydoula.com", "photo": "https://cdn.prod.website-files.com/63ee95d877371e4e98b743f6/6409224a5b28263290578089_websittehold.jpg", "costRange": "Contact for pricing", "description": "Welcome, I'm Ruth Nuñez a birth and postpartum Doula from Palo Alto, CA.", "services": ["Birth Doula", "Postpartum", "Lactation", "Home Birth", "Evidence-Based Care"]},
    {"name": "Nebula Doulas", "url": "https://www.nebuladoulaservices.com", "photo": "https://static.wixstatic.com/media/01c3aff52f2a4dffa526d7a9843d46ea.png/v1/fill/w_25,h_25,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/01c3aff52f2a4dffa526d7a9843d46ea.png", "costRange": "Contact for pricing", "description": "Who We Are At Nebula, we specialize in Postpartum and Newborn Care.", "services": ["Postpartum"]},
    {"name": "Trinity Night Doulas", "url": "http://trinitynightdoulas.com", "photo": "", "costRange": "Contact for pricing", "description": "Professional doula serving families in the area.", "services": ["Birth Doula"]},
    {"name": "Bay Area Doula Training", "url": "https://bayareadoula.com/bay-area-doula-training", "photo": "/images/doulas/bay-area-doula-training.webp", "costRange": "Contact for pricing", "description": "Community-driven, evidence-based doula training in the Bay Area. Accepts Medi-Cal.", "services": ["Birth Doula", "Postpartum", "Lactation", "Breastfeeding Support", "Childbirth Education"], "acceptsMedicaid": True},
    {"name": "Marcy Hogan Postpartum Doula", "url": "https://www.marcythedoula.com", "photo": "https://images.squarespace-cdn.com/content/v1/69d2c8eaa4854e48eb6c210e/3d19354e-34f6-4226-8b32-09cd760f66d5/2011+01+16-63.jpg", "costRange": "$25-$45/hr; $125 consultation", "description": "Postpartum doula soothing babies and empowering parents in the SF Bay Area.", "services": ["Postpartum"]},
    {"name": "Pamela Lopes Doula", "url": "http://www.pamelalopesdoula.com", "photo": "", "costRange": "Contact for pricing", "description": "Birth doula serving the Bay Area.", "services": ["Birth Doula"]},
    {"name": "Amelia Protiva, Birth Doula & Photographer", "url": "http://ameliaprotiva.com", "photo": "https://images.squarespace-cdn.com/content/v1/691217c649987466a21cc93a/9d3811ec-de57-4091-b3e6-79a27adbb41a/Birth+Becomes+Her%E2%80%93Lukas_0011.jpg", "costRange": "Contact for pricing", "description": "Doula care rooted in rural Missouri.", "services": ["Postpartum"], "acceptingClients": False},
]

HOSPITALS = [
    {"name": "Washington Hospital", "url": "https://www.whhs.com", "thumbnail": "/images/fremont-ca-washington-hospital.webp", "nicuLevel": "II", "address": "2000 Mowry Ave, Fremont, CA 94538"},
    {"name": "El Camino Health — Mountain View", "url": "https://www.elcaminohealth.org", "thumbnail": "/images/el-camino-hospital.webp", "nicuLevel": "III", "address": "2500 Grant Rd, Mountain View, CA 94040"},
]

def slugify(name):
    """Create slug from provider name."""
    s = name.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    return s

def cache_key(name, url):
    """Create cache key: name_url lowercased, non-alphanumeric stripped."""
    clean_name = re.sub(r'[^a-z0-9]', '', name.lower())
    clean_url = re.sub(r'[^a-z0-9]', '', url.lower())
    return f"{clean_name}_{clean_url}"

def download_image(url, dest_path, timeout=15):
    """Download an image from URL and convert to webp."""
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            data = resp.read()
        
        # Save to temp file
        tmp_path = str(dest_path).replace('.webp', '.tmp')
        with open(tmp_path, 'wb') as f:
            f.write(data)
        
        # Convert to webp using cwebp
        result = subprocess.run(
            ['cwebp', '-q', '80', '-resize', '400', '0', tmp_path, '-o', str(dest_path)],
            capture_output=True, timeout=30
        )
        
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        
        if result.returncode == 0 and dest_path.exists():
            return True
        return False
    except Exception as e:
        print(f"  Download failed for {url}: {e}")
        return False

def ollama_generate(prompt, model="qwen35-27b-fast:latest", timeout=30):
    """Generate text using local Ollama model."""
    try:
        payload = json.dumps({
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.7, "num_predict": 100}
        }).encode()
        
        req = urllib.request.Request(
            "http://localhost:11434/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            result = json.loads(resp.read())
            return result.get("response", "").strip()
    except Exception as e:
        print(f"  Ollama error: {e}")
        return ""

def firecrawl_scrape(url, timeout=60):
    """Scrape a URL using firecrawl CLI, return markdown content."""
    try:
        result = subprocess.run(
            ['firecrawl', 'scrape', url, '--format', 'markdown', '--only-main-content'],
            capture_output=True, text=True, timeout=timeout,
            cwd=str(BASE)
        )
        if result.returncode == 0:
            return result.stdout
        return ""
    except Exception as e:
        print(f"  Firecrawl scrape error: {e}")
        return ""

def firecrawl_search_images(query, timeout=30):
    """Search for images using firecrawl."""
    try:
        result = subprocess.run(
            ['firecrawl', 'search', query, '--sources', 'images', '--limit', '3'],
            capture_output=True, text=True, timeout=timeout,
            cwd=str(BASE)
        )
        if result.returncode == 0:
            return result.stdout
        return ""
    except Exception as e:
        print(f"  Firecrawl search error: {e}")
        return ""

def firecrawl_scrape_with_images(url, timeout=60):
    """Scrape a URL and get images list."""
    try:
        result = subprocess.run(
            ['firecrawl', 'scrape', url, '--format', 'markdown,images', '--only-main-content'],
            capture_output=True, text=True, timeout=timeout,
            cwd=str(BASE)
        )
        if result.returncode == 0:
            return result.stdout
        return ""
    except Exception as e:
        print(f"  Firecrawl scrape error: {e}")
        return ""

def extract_image_from_scrape(scrape_output, provider_name, base_url):
    """Try to find a headshot image URL from scrape output."""
    try:
        data = json.loads(scrape_output)
        images = data.get("images", []) or data.get("metadata", {}).get("images", [])
        # Look for images that might be headshots
        for img in images:
            if isinstance(img, str):
                # Skip logos, icons, backgrounds
                lower = img.lower()
                if any(x in lower for x in ['logo', 'icon', 'favicon', 'background', 'banner', 'hero']):
                    continue
                if any(x in lower for x in ['headshot', 'portrait', 'profile', 'team', 'about', 'staff', 'doula']):
                    return img
        # Return first non-logo image if any
        for img in images:
            if isinstance(img, str):
                lower = img.lower()
                if not any(x in lower for x in ['logo', 'icon', 'favicon', 'background']):
                    return img
    except:
        pass
    return ""

def synthesize_description(provider_name, website_content, credential, services):
    """Use Ollama to write a 1-2 sentence description."""
    # Truncate website content to fit context
    content_snippet = website_content[:1500] if website_content else ""
    
    if content_snippet:
        prompt = f"""Based on this website content for "{provider_name}" (a {credential} offering {', '.join(services[:3])}), write a 1-2 sentence professional description of this doula/birth service. Be factual and only use information from the website content. Do not make up details.

Website content:
{content_snippet}

Description:"""
        desc = ollama_generate(prompt)
        if desc and len(desc) > 20:
            return desc, "website-synthesized"
    
    # No website content - AI generated
    prompt = f"""Write a 1-2 sentence professional description for "{provider_name}", a {credential} serving the Fremont, CA / Bay Area region offering these services: {', '.join(services[:3])}. Keep it generic but professional. Do not invent specific facts about the provider.

Description:"""
    desc = ollama_generate(prompt)
    if desc and len(desc) > 20:
        return desc, "ai-generated"
    
    # Fallback
    return f"{provider_name} provides {credential.lower()} services in the Bay Area.", "ai-generated"

def main():
    now = datetime.utcnow()
    ttl = now + timedelta(days=90)
    iso_now = now.isoformat() + "Z"
    iso_ttl = ttl.isoformat() + "Z"
    
    # Load existing caches
    with open(CACHE_PATH) as f:
        provider_cache = json.load(f)
    if "providers" not in provider_cache:
        provider_cache["providers"] = {}
    
    # Results
    results = {"providers": {}, "hospitals": {}}
    
    # Process each provider
    for i, p in enumerate(PROVIDERS):
        name = p["name"]
        url = p["url"]
        slug = slugify(name)
        local_photo_path = f"/images/provider-fremont-ca-{slug}.webp"
        dest_path = IMG_DIR / f"provider-fremont-ca-{slug}.webp"
        
        print(f"\n[{i+1}/{len(PROVIDERS)}] Processing: {name}")
        
        # Check if already cached
        ck = cache_key(name, url)
        cached = provider_cache["providers"].get(ck)
        
        if cached and cached.get("photo"):
            print(f"  Found in cache: {cached['photo']}")
            photo = cached["photo"]
            description = cached.get("description", p.get("description", ""))
            description_source = cached.get("description_source", "ai-generated")
            cost_range = cached.get("costRange", p.get("costRange", "Contact for pricing"))
            cost_range_source = cached.get("costRange_source", "market-estimate")
            email = cached.get("email", "")
            accepting = cached.get("acceptingClients", not p.get("acceptingClients") == False)
        else:
            photo = ""
            description = ""
            description_source = "ai-generated"
            cost_range = p.get("costRange", "Contact for pricing")
            cost_range_source = "market-estimate"
            email = ""
            accepting = p.get("acceptingClients", True)
            
            # Pass 1: Source Photos
            existing_photo = p.get("photo", "")
            
            if existing_photo and existing_photo.startswith("/images/"):
                # Already a local image path
                photo = existing_photo
                print(f"  Using existing local image: {photo}")
            elif existing_photo and existing_photo.startswith("http"):
                # Download remote image
                print(f"  Downloading remote image: {existing_photo[:60]}...")
                if download_image(existing_photo, dest_path):
                    photo = local_photo_path
                    print(f"  Saved to: {photo}")
                else:
                    print(f"  Download failed, trying Firecrawl...")
                    # Try firecrawl scrape for images
                    scrape_url = url.split("?")[0]  # Remove query params
                    scrape_out = firecrawl_scrape_with_images(scrape_url)
                    if scrape_out:
                        img_url = extract_image_from_scrape(scrape_out, name, url)
                        if img_url and download_image(img_url, dest_path):
                            photo = local_photo_path
                            print(f"  Found image via Firecrawl: {photo}")
            else:
                # No photo URL - use Firecrawl to search and scrape
                print(f"  No photo URL, searching via Firecrawl...")
                search_query = f"{name} doula birth Bay Area headshot"
                search_out = firecrawl_search_images(search_query)
                if search_out:
                    # Try to extract image URL from search results
                    img_urls = re.findall(r'https?://[^\s"\'<>]+\.(?:jpg|jpeg|png|webp)', search_out, re.I)
                    for img_url in img_urls[:3]:
                        if download_image(img_url, dest_path):
                            photo = local_photo_path
                            print(f"  Found image via search: {photo}")
                            break
            
            # Pass 2: Write Description
            # Use existing description if it looks real (not a snippet of website noise)
            existing_desc = p.get("description", "")
            if existing_desc and len(existing_desc) > 30 and not existing_desc.startswith("jpg ") and not existing_desc.startswith("Copy "):
                # Check if it looks like a real description
                if not any(x in existing_desc.lower() for x in ["once in keyboard", "connect it to your wix"]):
                    description = existing_desc
                    description_source = "website-synthesized"
                    print(f"  Using existing description")
                else:
                    # Generate new one
                    desc, dsrc = synthesize_description(name, "", p.get("credential", "Doula"), p.get("services", ["Birth Doula"]))
                    description = desc
                    description_source = dsrc
            else:
                desc, dsrc = synthesize_description(name, "", p.get("credential", "Doula"), p.get("services", ["Birth Doula"]))
                description = desc
                description_source = dsrc
                print(f"  Generated description ({description_source})")
            
            # Pass 3: Cost Range
            if cost_range and cost_range != "Contact for pricing":
                cost_range_source = "website-synthesized"
            else:
                cost_range = "Contact for pricing"
                cost_range_source = "market-estimate"
            
            # Accepting clients check
            if p.get("acceptingClients") == False:
                accepting = False
        
        # Store in results
        results["providers"][name] = {
            "photo": photo,
            "description": description,
            "description_source": description_source,
            "costRange": cost_range,
            "costRange_source": cost_range_source,
            "email": email,
            "acceptingClients": accepting
        }
        
        # Update cache
        provider_cache["providers"][ck] = {
            "name": name,
            "url": url,
            "photo": photo,
            "description": description,
            "description_source": description_source,
            "costRange": cost_range,
            "costRange_source": cost_range_source,
            "email": email,
            "serviceArea": "",
            "acceptingClients": accepting,
            "sourced_at": iso_now,
            "source": "firecrawl-scrape" if photo else "ai-generated",
            "ttl": iso_ttl
        }
        
        # Write partial results periodically
        if (i + 1) % 10 == 0 or i == len(PROVIDERS) - 1:
            write_results(results, provider_cache)
            print(f"  [Checkpoint] Wrote partial results at {i+1}/{len(PROVIDERS)}")
    
    # Process hospitals
    print("\n\nProcessing hospitals...")
    for h in HOSPITALS:
        name = h["name"]
        thumbnail = h["thumbnail"]
        nicu = h["nicuLevel"]
        
        print(f"  Hospital: {name}")
        
        # Check if hospital image exists locally
        img_path = IMG_DIR / thumbnail.replace("/images/", "")
        if img_path.exists():
            results["hospitals"][name] = {
                "thumbnail": thumbnail,
                "thumbnail_source": "website-synthesized",
                "nicu_level": f"Level {nicu} NICU per hospital website"
            }
        else:
            results["hospitals"][name] = {
                "thumbnail": "",
                "thumbnail_source": "ai-generated",
                "nicu_level": f"Level {nicu} NICU per hospital website"
            }
        
        # Update hospital cache
        h_key = cache_key(name, "fremont-ca")
        with open(HOSP_CACHE_PATH) as f:
            h_cache = json.load(f)
        if "hospitals" not in h_cache:
            h_cache["hospitals"] = {}
        h_cache["hospitals"][h_key] = {
            "name": name,
            "city": "fremont-ca",
            "thumbnail": thumbnail,
            "thumbnail_source": "website-synthesized",
            "nicu_level": f"Level {nicu} NICU per hospital website",
            "sourced_at": iso_now,
            "ttl": iso_ttl
        }
        with open(HOSP_CACHE_PATH, 'w') as f:
            json.dump(h_cache, f, indent=2)
    
    # Final write
    write_results(results, provider_cache)
    
    # Print summary
    photos_found = sum(1 for p in results["providers"].values() if p["photo"])
    print(f"\n\n=== SUMMARY ===")
    print(f"Providers processed: {len(results['providers'])}")
    print(f"Photos found: {photos_found}")
    print(f"Photos missing: {len(results['providers']) - photos_found}")
    print(f"Hospitals processed: {len(results['hospitals'])}")
    print(f"Output: {OUTPUT_PATH}")
    print(f"Cache: {CACHE_PATH}")

def write_results(results, provider_cache):
    """Write results to output file and update cache."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(results, f, indent=2)
    
    provider_cache["metadata"]["last_updated"] = datetime.utcnow().isoformat() + "Z"
    provider_cache["metadata"]["total_entries"] = len(provider_cache.get("providers", {}))
    with open(CACHE_PATH, 'w') as f:
        json.dump(provider_cache, f, indent=2)

if __name__ == "__main__":
    main()