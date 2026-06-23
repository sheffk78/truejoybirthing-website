#!/usr/bin/env node
/**
 * Norfolk-VA Provider Enrichment Script
 * Pass 1: Firecrawl scrape provider websites for photos + content
 * Pass 2: Ollama descriptions
 * Pass 3: Cost ranges + details
 * Write: enrichment-batch/norfolk-va.json + provider cache
 */

const fs = require('fs');
const path = require('path');
const { execSync, execFileSync } = require('child_process');
const https = require('https');
const http = require('http');

const HOME = process.env.HOME;
const CACHE_PATH = path.join(HOME, '.hermes/state/tjb-provider-cache.json');
const HOSPITAL_CACHE_PATH = path.join(HOME, '.hermes/state/tjb-hospital-cache.json');
const OUTPUT_PATH = path.join(HOME, '.hermes/state/enrichment-batch/norfolk-va.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const FIRECRAWL_DIR = path.join(__dirname, '..', '.firecrawl');

// --- Provider data extracted from cities.ts (norfolk-va block, lines 4378-4412) ---
const PROVIDERS = [
  { name: "Dynamic Family Doulas", url: "https://www.bornbir.com/norfolk/va/doula", existingPhoto: "https://res.cloudinary.com/bornbir/image/upload/f_auto,q_auto/production/static/sipqsp5rstgzzq7sgfhr.png", services: ["Birth Doula","Postpartum","Lactation","Breastfeeding Support","Placenta Encapsulation"], costRange: "$800–$2000", acceptsMedicaid: true },
  { name: "Your Doula In Love LLC", url: "http://yourdoulainlove.com", existingPhoto: "https://img1.wsimg.com/isteam/ip/7f765464-9252-46ba-bb17-abe305c21173/blob-0004.png", services: ["Postpartum","Evidence-Based Care"], acceptsMedicaid: true },
  { name: "Tina the Postpartum Doula", url: "http://www.tinathedoula.com", existingPhoto: "https://images.squarespace-cdn.com/content/v1/6028005e705ea36f1bfec7a8/e1847608-0bc0-479c-bbfa-906a72618dd3/TINA+THE+POSTPARTUM+DOULA+%2811%29.png", services: ["Postpartum","Breastfeeding Support"] },
  { name: "Amara's Childbirth Education and Doula Services", url: "http://www.amaradoula.com", existingPhoto: "https://images.squarespace-cdn.com/content/v1/5f108a76b8aa1848c073179d/1594934945623-0FOJXO00ENMHDWI0D20C/Logo_Amara.jpg", services: ["Birth Doula","Postpartum","Childbirth Education"] },
  { name: "Wholesome Hearts Doula Services", url: "https://www.facebook.com/WholesomeHeartsDoula", existingPhoto: "", services: [] },
  { name: "Leslie C. Cuffee ~ Doula and Placenta Encapsulation", url: "http://lesliecuffee.com", existingPhoto: "", services: ["Birth Doula","Postpartum","Placenta Encapsulation"] },
  { name: "APL Doula Services", url: "http://apldoula.com", existingPhoto: "https://static.wixstatic.com/media/510cda_5bb43146194e401fadacce5550d1748c~mv2.png/v1/fill/w_400,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/APL%20Doula.png", services: ["Birth Doula","Postpartum","Placenta Encapsulation","Prenatal Care"] },
  { name: "Yorktown Doula", url: "http://www.yorktowndoula.com", existingPhoto: "https://static.showit.co/1600/kO2_oxXBTGGpmFgeHil-4Q/192629/yorktown_doula_5.jpg", services: ["Birth Doula","Postpartum","Breastfeeding Support","Prenatal Care"] },
  { name: "Enduring Love Doula, LLC", url: "https://enduringlovedoula.com", existingPhoto: "https://homebirthhamptonroads.org/static/profile_pics/e514948cf65dd2cb72653eae71b7f155.jpg", services: ["Birth Doula"] },
  { name: "Laurie Ann's Postpartum Doula Services", url: "http://www.lafdoula.com", existingPhoto: "https://static.wixstatic.com/media/6c283f_32bc3440fc024f5393b0c5dc0111e0a5~mv2.jpg/v1/fill/w_434,h_323,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7277_edited.jpg", services: ["Postpartum","Lactation","Breastfeeding Support"] },
  { name: "Compass Birth Partners, LLC", url: "https://rniesen.wordpress.com", existingPhoto: "https://rniesen.wordpress.com/wp-content/uploads/2022/11/dhpqobaprscnf1zpuv78ra_thumb_e.jpg", services: ["Birth Doula","Lactation"] },
  { name: "Calming Touch Doula & Massage Services", url: "https://pocketsuite.io/book/calming-touch-doula-and-massage", existingPhoto: "https://s3-us-west-1.amazonaws.com/cdn.pocketsuite.io/09ef96f5-875a-11f0-8b50-4a4a2ee44d28/32d7c794-8efd-4aae-87a9-cd606e632b9e.jpg", services: ["Birth Doula","Postpartum","Prenatal Care"] },
  { name: "Natural Harmony Doula Services", url: "https://naturalharmonydoula.com", existingPhoto: "https://images.squarespace-cdn.com/content/v1/63c58d4355344f23d5ff060b/ae242280-4252-4163-9158-1a55437847c2/unsplash-image-RM9yEZLoJSc.jpg", services: ["Postpartum","Prenatal Care"] },
  { name: "Beach Babies Doula Services", url: "https://www.beachbabiesdoulavb.com", existingPhoto: "", services: ["Lactation","Prenatal Care"] },
  { name: "Akilah White Doula Services", url: "http://akilahwhite.com", existingPhoto: "https://images.squarespace-cdn.com/content/v1/5ffe642e043f90379f5095b3/1ca19699-86fb-4380-89af-477ee76ae043/Home.png", services: [], acceptsMedicaid: true },
  { name: "Debbie's Doula Services", url: "http://debbiesdoulaservices.com", existingPhoto: "https://img1.wsimg.com/isteam/ip/9ac24cca-e0d3-4dd4-bf59-17d0a3e29bf4/E5EA9F63-3387-4D2A-A4CC-29A65522E57C.jpeg", services: ["Birth Doula","Postpartum","Breastfeeding Support","Prenatal Care"] },
  { name: "Whispering Lullabies LLC Doula and Overnight Newborn Care Services", url: "http://www.whisperinglullabies.com", existingPhoto: "https://static.wixstatic.com/media/9019fc_a4f9cece00ed455b90ab09399a89b074~mv2.png/v1/fill/w_984,h_1024,al_c,q_90,enc_avif,quality_auto/9019fc_a4f9cece00ed455b90ab09399a89b074~mv2.png", services: ["Postpartum","Overnight Care"] },
  { name: "Soulful Beginnings Doula LLC", url: "https://soulful-beginnings.com", existingPhoto: "https://soulful-beginnings.com/wp-content/uploads/2025/07/DM0A2577-scaled-e1754326281681-844x1024.jpg", services: ["Birth Doula","Postpartum","Prenatal Care"] },
  { name: "Sacred Stories Doula LLC", url: "https://sacredstoriesdoula.com", existingPhoto: "https://sacredstoriesdoula.com/_assets/media/11fe0550c47f4e9d5a9820c51126a2b0.jpg", services: ["Birth Doula","Postpartum","Home Birth","Evidence-Based Care"] },
  { name: "Jas the Doula From the Start Holistic Service", url: "https://jasthedoula.com", existingPhoto: "https://jasthedoula.com/wp-content/uploads/sb-instagram-feed-images/323582280_753258909559203_3271580222371811148_nfull.jpg", services: ["Postpartum","Lactation","Breastfeeding Support","Prenatal Care"], acceptsMedicaid: true },
  { name: "Nurturing Essence Doula Services", url: "https://nurturingessenceds.org", existingPhoto: "https://storage.googleapis.com/msgsndr/GxEtHbS3nFXXIU1tvNrH/media/68f909a302a7ea9f8e01ba5d.jpeg", services: ["Overnight Care","Sibling Support"] },
  { name: "Beautiful Bump Doula Services", url: "https://theupcenter.org/programs/doula-services", existingPhoto: "", services: ["Postpartum","Prenatal Care","Evidence-Based Care"], acceptsMedicaid: true },
  { name: "Loving Births Doula by Devan", url: "https://www.lovingbirthsdoulabydevan.com", existingPhoto: "", services: [] },
  { name: "All Nations Doula", url: "http://allnationsdoula.com", existingPhoto: "http://allnationsdoula.com/wordpress/wp-content/uploads/2018/02/Casey-Medrano-Doula.jpg", services: [] },
  { name: "En Route Doulas", url: "http://www.enroutedoulas.com", existingPhoto: "https://images.squarespace-cdn.com/content/v1/6502f3d9a892f85e9cf17f4a/3da4fcbf-4dd0-4f8c-a08a-71c50ad638f9/Stocksy_txpea251265m2l300_Medium_873898.jpg", services: ["Postpartum"] },
  { name: "Restoring Wellness Doula", url: "https://www.restoringwellnessdoula.com", existingPhoto: "https://static.wixstatic.com/media/630453_3a4153de438f4fde89659c1ab7bec975~mv2.jpg/v1/fill/w_1905,h_521,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/630453_3a4153de438f4fde89659c1ab7bec975~mv2.jpg", services: ["Postpartum","Prenatal Care","Home Birth","Evidence-Based Care"], acceptsMedicaid: true },
  { name: "Queendomdoulacare", url: "https://www.honeybook.com/widget/a_sacred_spacefor_queens_196077/cf_id/61488f6647bc4f00343a2c0e", existingPhoto: "", services: [] },
  { name: "Womb & Moon Doula Care", url: "https://www.wombroom.mom/packages", existingPhoto: "https://static.wixstatic.com/media/942a90_e30789f27b5e4c5a9bae387a3534e6cd~mv2.jpg/v1/fit/w_NaN,h_NaN,lg_1,q_80,usm_0.66_1.00_0.01,blur_3,enc_auto/942a90_e30789f27b5e4c5a9bae387a3534e6cd~mv2.jpg", services: ["Birth Doula","Postpartum","Lactation","Placenta Encapsulation","Childbirth Education"] },
  { name: "Christina Rutledge IBCLC, Doula - A Mother's Journey, LLC", url: "http://www.amothersjourneyllc.com", existingPhoto: "", services: ["Birth Doula","Postpartum","Lactation","Breastfeeding Support","Childbirth Education"] },
  { name: "Doulas of Northern Virginia", url: "http://www.doulasofnorthernva.com", existingPhoto: "https://www.doulasofnorthernva.com/wp-content/uploads/2022/02/LizMaternity135-1.jpg", services: ["Postpartum","Prenatal Care"] },
  { name: "Sunflower Babies Midwifery", url: "https://sunflowerbabiesmidwifery.com", existingPhoto: "https://sunflowerbabiesmidwifery.com/_assets/media/aa3ae68c326244d012502cedbb49ef10.jpg", services: ["Postpartum"], isMidwife: true },
  { name: "Seven Cities Midwifery Care, LLC", url: "http://www.sevencitiesmidwifery.com", existingPhoto: "https://images.squarespace-cdn.com/content/v1/6377b78aa3d5bf1f3fd5f460/7e3ca4df-44ae-4280-80e3-c48378f5630c/Veronica-2934+%281%29.jpg", services: ["Postpartum","Breastfeeding Support","Prenatal Care","Home Birth"], acceptsMedicaid: true, isMidwife: true },
  { name: "The Village Midwife Birth Center", url: "https://www.thevillagemidwife.com", existingPhoto: "https://images.squarespace-cdn.com/content/v1/6914d73b6bb72f3b99693f92/5f600f66-c79f-499f-89df-9b78fa89a2d1/TVM+Baby+Scale+2+Lights+On+Small.jpeg", services: ["Postpartum","VBAC Support","Home Birth","Evidence-Based Care"], acceptsMedicaid: true, isMidwife: true },
  { name: "Sentara Midwifery Specialists", url: "https://www.sentara.com/hospitalslocations/sentara-midwifery-specialists/locations/sentara-midwifery-specialists-hampton", existingPhoto: "", services: [], isMidwife: true },
  { name: "Genesis Midwifery Services", url: "http://www.genesisforbirth.com", existingPhoto: "https://images.squarespace-cdn.com/content/v1/62d2f709c95a125ca4b75147/10a58b31-4586-4073-b835-059a7c25d3fb/DSC00254-2.jpg", services: ["Postpartum","Breastfeeding Support","Home Birth"], acceptsMedicaid: true, isMidwife: true },
];

const HOSPITALS = [
  { name: "Sentara Norfolk General Hospital", url: "https://www.sentara.com/locations/sentara-norfolk-general-hospital/", nicuLevel: "III" },
  { name: "Children's Hospital of The King's Daughters", url: "https://www.chkd.org/", nicuLevel: "" },
];

// --- Helpers ---
function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cacheKey(name, url) {
  const n = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const u = (url || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${n}_${u}`;
}

function hospitalCacheKey(name, city) {
  const n = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const c = (city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${n}_${c}`;
}

function downloadImage(url, filepath) {
  try {
    const cmd = `curl -sL -o "${filepath}" --max-time 30 "${url.replace(/"/g, '\\"')}" 2>&1`;
    execSync(cmd, { stdio: 'pipe', timeout: 35000 });
    const stats = fs.statSync(filepath);
    if (stats.size > 500) {
      // Convert to webp if not already
      if (!filepath.endsWith('.webp')) {
        const webpPath = filepath.replace(/\.[^.]+$/, '.webp');
        try {
          execSync(`cwebp -q 85 -resize 400 0 "${filepath}" -o "${webpPath}" 2>/dev/null`, { stdio: 'pipe', timeout: 20000 });
          if (fs.existsSync(webpPath) && fs.statSync(webpPath).size > 500) {
            fs.unlinkSync(filepath);
            return true;
          }
        } catch(e) { /* cwebp may not be available */ }
      }
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

function firecrawlScrape(url) {
  try {
    const outFile = path.join(FIRECRAWL_DIR, 'norfolk-scrape.json');
    const cmd = `firecrawl scrape --format markdown,images --only-main-content -o "${outFile}" "${url}" 2>&1`;
    const result = execSync(cmd, { stdio: 'pipe', timeout: 90000, encoding: 'utf-8', cwd: path.join(__dirname, '..') });
    if (fs.existsSync(outFile)) {
      const content = fs.readFileSync(outFile, 'utf-8');
      try {
        const json = JSON.parse(content);
        return json;
      } catch(e) {
        // Might be markdown directly
        return { markdown: content, images: [] };
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

function ollamaGenerate(prompt, model = 'qwen35-27b-fast:latest') {
  try {
    const payload = JSON.stringify({
      model: model,
      prompt: prompt,
      stream: false,
      options: { temperature: 0.7, num_predict: 200 }
    });
    const cmd = `curl -s http://localhost:11434/api/generate -d '${payload.replace(/'/g, "'\\''")}' --max-time 60 2>/dev/null`;
    const result = execSync(cmd, { stdio: 'pipe', timeout: 65000, encoding: 'utf-8' });
    const json = JSON.parse(result);
    return json.response || '';
  } catch (e) {
    return '';
  }
}

function findBestPhoto(images, existingPhoto, providerName) {
  // Prefer images that look like headshots/profiles
  if (!images || images.length === 0) return existingPhoto || '';
  
  // Score images by URL keywords
  const scored = images.map(img => {
    const url = typeof img === 'string' ? img : (img.url || img.src || '');
    let score = 0;
    const lower = url.toLowerCase();
    if (lower.includes('headshot') || lower.includes('profile') || lower.includes('about') || lower.includes('team')) score += 10;
    if (lower.includes('logo')) score -= 5;
    if (lower.includes('hero') || lower.includes('banner')) score -= 3;
    if (lower.includes('doula')) score += 3;
    if (lower.includes(providerName.toLowerCase().split(' ')[0])) score += 5;
    if (lower.includes('.jpg') || lower.includes('.png') || lower.includes('.webp')) score += 1;
    return { url, score };
  });
  
  scored.sort((a, b) => b.score - a.score);
  // Return top candidate if score > 0, otherwise fall back to existing
  if (scored.length > 0 && scored[0].score > 0) return scored[0].url;
  if (scored.length > 0) return scored[0].url;
  return existingPhoto || '';
}

// --- Main processing ---
async function main() {
  console.log(`Processing ${PROVIDERS.length} providers for norfolk-va`);
  
  // Load caches
  let providerCache = { providers: {}, metadata: { version: 1, created_at: new Date().toISOString(), last_updated: new Date().toISOString(), total_entries: 0 } };
  try {
    providerCache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
  } catch(e) {}
  
  let hospitalCache = { hospitals: {}, metadata: { version: 1, created_at: new Date().toISOString(), last_updated: new Date().toISOString(), total_entries: 0 } };
  try {
    hospitalCache = JSON.parse(fs.readFileSync(HOSPITAL_CACHE_PATH, 'utf-8'));
  } catch(e) {}
  
  const results = { providers: {}, hospitals: {} };
  const now = new Date();
  const ttl = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const nowISO = now.toISOString();
  const ttlISO = ttl.toISOString();
  
  let processed = 0;
  let cached = 0;
  let scraped = 0;
  
  for (const provider of PROVIDERS) {
    const key = cacheKey(provider.name, provider.url);
    const slug = slugify(provider.name);
    const photoPath = `/images/provider-norfolk-va-${slug}.webp`;
    const localPhotoFile = path.join(IMAGES_DIR, `provider-norfolk-va-${slug}.webp`);
    
    console.log(`\n[${++processed}/${PROVIDERS.length}] ${provider.name}`);
    
    // Check cache
    if (providerCache.providers[key]) {
      const cached = providerCache.providers[key];
      console.log(`  → CACHED: ${cached.photo || 'no photo'}`);
      results.providers[provider.name] = {
        photo: cached.photo || '',
        description: cached.description || '',
        description_source: cached.description_source || 'ai-generated',
        costRange: cached.costRange || 'Contact for pricing',
        costRange_source: cached.costRange_source || 'market-estimate',
        email: cached.email || '',
        acceptingClients: cached.acceptingClients !== false
      };
      continue;
    }
    
    // Scrape website
    let websiteContent = '';
    let scrapedImages = [];
    let photoUrl = '';
    let source = 'ai-generated';
    
    if (provider.url && !provider.url.includes('facebook.com') && !provider.url.includes('honeybook.com') && !provider.url.includes('linkedin.com') && !provider.url.includes('pocketsuite.io')) {
      console.log(`  → Scraping: ${provider.url}`);
      const scrapeResult = firecrawlScrape(provider.url);
      if (scrapeResult) {
        websiteContent = (scrapeResult.markdown || '').substring(0, 3000);
        scrapedImages = scrapeResult.images || [];
        if (websiteContent.length > 100) source = 'website-synthesized';
        console.log(`  → Got ${websiteContent.length} chars, ${scrapedImages.length} images`);
      }
    }
    
    // Find best photo
    photoUrl = findBestPhoto(scrapedImages, provider.existingPhoto, provider.name);
    
    // Download photo
    let photoDownloaded = '';
    if (photoUrl) {
      const tmpFile = path.join(IMAGES_DIR, `provider-norfolk-va-${slug}.tmp`);
      if (downloadImage(photoUrl, tmpFile)) {
        // Check if it was converted to webp
        const webpFile = tmpFile.replace(/\.tmp$/, '.webp');
        if (fs.existsSync(webpFile)) {
          photoDownloaded = photoPath;
          console.log(`  → Photo downloaded: ${photoPath}`);
        } else if (fs.existsSync(tmpFile)) {
          // Try converting with sips (macOS)
          try {
            execSync(`sips -s format webp -Z 400 "${tmpFile}" --out "${localPhotoFile}" 2>/dev/null`, { stdio: 'pipe', timeout: 15000 });
            if (fs.existsSync(localPhotoFile) && fs.statSync(localPhotoFile).size > 500) {
              photoDownloaded = photoPath;
              console.log(`  → Photo converted via sips: ${photoPath}`);
            }
            fs.unlinkSync(tmpFile);
          } catch(e) {
            // Just copy with original extension
            try {
              fs.renameSync(tmpFile, localPhotoFile);
              photoDownloaded = photoPath;
            } catch(e2) {
              try { fs.unlinkSync(tmpFile); } catch(e3) {}
            }
          }
        }
      }
    }
    
    if (!photoDownloaded && provider.existingPhoto) {
      // Try downloading the existing photo as fallback
      const tmpFile = path.join(IMAGES_DIR, `provider-norfolk-va-${slug}.tmp`);
      if (downloadImage(provider.existingPhoto, tmpFile)) {
        const webpFile = tmpFile.replace(/\.tmp$/, '.webp');
        if (fs.existsSync(webpFile)) {
          photoDownloaded = photoPath;
          console.log(`  → Existing photo downloaded: ${photoPath}`);
        } else if (fs.existsSync(tmpFile)) {
          try {
            execSync(`sips -s format webp -Z 400 "${tmpFile}" --out "${localPhotoFile}" 2>/dev/null`, { stdio: 'pipe', timeout: 15000 });
            if (fs.existsSync(localPhotoFile) && fs.statSync(localPhotoFile).size > 500) {
              photoDownloaded = photoPath;
              console.log(`  → Existing photo converted: ${photoPath}`);
            }
            try { fs.unlinkSync(tmpFile); } catch(e) {}
          } catch(e) {
            try { fs.unlinkSync(tmpFile); } catch(e2) {}
          }
        }
      }
    }
    
    // Generate description using Ollama
    let description = '';
    if (websiteContent && websiteContent.length > 100) {
      const prompt = `Write a 1-2 sentence professional description for a birth doula/midwifery provider based on their website content. Provider name: ${provider.name}. Services: ${(provider.services || []).join(', ')}. Website content: ${websiteContent.substring(0, 1500)}. Write only the description, no preamble.`;
      description = ollamaGenerate(prompt).trim();
      if (description) {
        // Clean up - remove quotes, trim
        description = description.replace(/^["']|["']$/g, '').trim();
        if (description.length > 300) description = description.substring(0, 297) + '...';
      }
    }
    
    if (!description) {
      const prompt = `Write a 1-2 sentence professional description for a birth/postpartum doula provider named "${provider.name}" in Norfolk, Virginia. They offer these services: ${(provider.services || []).join(', ') || 'doula services'}. Write only the description, no preamble.`;
      description = ollamaGenerate(prompt).trim().replace(/^["']|["']$/g, '').trim();
      if (description.length > 300) description = description.substring(0, 297) + '...';
    }
    
    // Fallback if Ollama fails
    if (!description) {
      description = `${provider.name} provides ${(provider.services || ['doula services']).join(', ').toLowerCase()} to families in the Norfolk, Virginia area.`;
    }
    
    // Cost range
    let costRange = 'Contact for pricing';
    let costRangeSource = 'market-estimate';
    if (provider.costRange) {
      costRange = provider.costRange;
      costRangeSource = 'website-synthesized';
    } else if (websiteContent && websiteContent.toLowerCase().includes('$')) {
      // Try to extract pricing from website
      const priceMatch = websiteContent.match(/\$[\d,]+(?:\s*[-–]\s*\$?[\d,]+)?/);
      if (priceMatch) {
        costRange = priceMatch[0];
        costRangeSource = 'website-synthesized';
      }
    }
    
    // Check if not accepting clients
    let acceptingClients = true;
    if (websiteContent) {
      const lower = websiteContent.toLowerCase();
      if (lower.includes('not accepting') || lower.includes('closed') || lower.includes('on hiatus') || lower.includes('maternity leave')) {
        acceptingClients = false;
      }
    }
    
    const descSource = (websiteContent && websiteContent.length > 100) ? 'website-synthesized' : 'ai-generated';
    
    results.providers[provider.name] = {
      photo: photoDownloaded,
      description,
      description_source: descSource,
      costRange,
      costRange_source: costRangeSource,
      email: '',
      acceptingClients
    };
    
    // Update cache
    providerCache.providers[key] = {
      name: provider.name,
      url: provider.url || '',
      photo: photoDownloaded,
      description,
      description_source: descSource,
      costRange,
      costRange_source: costRangeSource,
      email: '',
      serviceArea: [],
      acceptingClients,
      sourced_at: nowISO,
      source: descSource === 'website-synthesized' ? 'firecrawl-scrape' : 'ai-generated',
      ttl: ttlISO
    };
    
    scraped++;
    console.log(`  → Done: photo=${photoDownloaded ? 'yes' : 'no'}, desc=${descSource}`);
  }
  
  // --- Process hospitals ---
  console.log(`\n\nProcessing ${HOSPITALS.length} hospitals`);
  for (const hospital of HOSPITALS) {
    const key = hospitalCacheKey(hospital.name, 'Norfolk');
    const slug = slugify(hospital.name);
    
    if (hospitalCache.hospitals[key]) {
      console.log(`  → CACHED: ${hospital.name}`);
      const c = hospitalCache.hospitals[key];
      results.hospitals[hospital.name] = {
        thumbnail: c.thumbnail || '',
        thumbnail_source: c.thumbnail_source || 'website-synthesized',
        nicu_level: c.nicu_level || ''
      };
      continue;
    }
    
    console.log(`  → Scraping: ${hospital.name}`);
    let nicuLevel = hospital.nicuLevel || '';
    let thumbnail = '';
    
    // Scrape hospital website
    if (hospital.url) {
      const scrapeResult = firecrawlScrape(hospital.url);
      if (scrapeResult) {
        const content = (scrapeResult.markdown || '').toLowerCase();
        // Find NICU level
        if (content.includes('level iii') || content.includes('level 3')) nicuLevel = 'III';
        else if (content.includes('level ii') || content.includes('level 2')) nicuLevel = 'II';
        else if (content.includes('level iv') || content.includes('level 4')) nicuLevel = 'IV';
        
        // Find exterior photo
        const images = scrapeResult.images || [];
        if (images.length > 0) {
          const buildingImg = images.find(img => {
            const u = (typeof img === 'string' ? img : (img.url || '')).toLowerCase();
            return u.includes('building') || u.includes('exterior') || u.includes('hospital') || u.includes('campus');
          });
          thumbnail = buildingImg ? (typeof buildingImg === 'string' ? buildingImg : buildingImg.url) : (typeof images[0] === 'string' ? images[0] : images[0].url);
        }
      }
    }
    
    const photoPath = `/images/hospital-norfolk-va-${slug}.webp`;
    const localFile = path.join(IMAGES_DIR, `hospital-norfolk-va-${slug}.webp`);
    if (thumbnail) {
      const tmpFile = localFile.replace('.webp', '.tmp');
      if (downloadImage(thumbnail, tmpFile)) {
        const webpFile = tmpFile.replace(/\.tmp$/, '.webp');
        if (fs.existsSync(webpFile)) {
          // already webp
        } else if (fs.existsSync(tmpFile)) {
          try {
            execSync(`sips -s format webp -Z 800 "${tmpFile}" --out "${localFile}" 2>/dev/null`, { stdio: 'pipe', timeout: 15000 });
            try { fs.unlinkSync(tmpFile); } catch(e) {}
          } catch(e) {
            try { fs.unlinkSync(tmpFile); } catch(e2) {}
          }
        }
      }
    }
    
    const nicuStr = nicuLevel ? `Level ${nicuLevel} NICU per hospital website` : '';
    results.hospitals[hospital.name] = {
      thumbnail: fs.existsSync(localFile) ? photoPath : '',
      thumbnail_source: 'website-synthesized',
      nicu_level: nicuStr
    };
    
    hospitalCache.hospitals[key] = {
      name: hospital.name,
      city: 'Norfolk',
      thumbnail: fs.existsSync(localFile) ? photoPath : '',
      thumbnail_source: 'website-synthesized',
      nicu_level: nicuStr,
      sourced_at: nowISO,
      ttl: ttlISO
    };
  }
  
  // --- Write results ---
  console.log('\n\nWriting results...');
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
  console.log(`Written: ${OUTPUT_PATH}`);
  
  // Update caches
  providerCache.metadata.last_updated = nowISO;
  providerCache.metadata.total_entries = Object.keys(providerCache.providers).length;
  fs.writeFileSync(CACHE_PATH, JSON.stringify(providerCache, null, 2));
  console.log(`Updated provider cache: ${CACHE_PATH} (${providerCache.metadata.total_entries} entries)`);
  
  hospitalCache.metadata.last_updated = nowISO;
  hospitalCache.metadata.total_entries = Object.keys(hospitalCache.hospitals).length;
  fs.writeFileSync(HOSPITAL_CACHE_PATH, JSON.stringify(hospitalCache, null, 2));
  console.log(`Updated hospital cache: ${HOSPITAL_CACHE_PATH} (${hospitalCache.metadata.total_entries} entries)`);
  
  // Summary
  const photoCount = Object.values(results.providers).filter(p => p.photo).length;
  const websiteCount = Object.values(results.providers).filter(p => p.description_source === 'website-synthesized').length;
  console.log(`\n=== SUMMARY ===`);
  console.log(`Providers: ${PROVIDERS.length} total, ${cached} cached, ${scraped} scraped`);
  console.log(`Photos: ${photoCount}/${PROVIDERS.length} downloaded`);
  console.log(`Descriptions: ${websiteCount} website-synthesized, ${PROVIDERS.length - websiteCount} ai-generated`);
  console.log(`Hospitals: ${HOSPITALS.length} processed`);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});