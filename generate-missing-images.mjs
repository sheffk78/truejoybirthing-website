import sharp from 'sharp';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load city data to get city names and states for each slug
const citiesModule = readFileSync(join(__dirname, 'src/data/cities.ts'), 'utf8');

// Parse city data - cities.ts exports an object keyed by slug-like identifiers
// We need { slug: { city: "Name", state: "ST" } } mapping
// The format in cities.ts uses city-state keys like "abilene-tx": { city: "Abilene", state: "TX", ... }
const cityDataMatch = citiesModule;
const cityEntries = [];

// Extract all city entries from the cities object
// Pattern: "city-slug": { city: "City Name", state: "ST", ... }
const entryRegex = /"([^"]+)":\s*\{[^}]*city:\s*"([^"]+)"[^}]*state:\s*"([^"]+)"[^}]*\}/g;
let match;
while ((match = entryRegex.exec(cityDataMatch)) !== null) {
  cityEntries.push({ slug: match[1], city: match[2], state: match[3] });
}

// Slugs that need both OG and hero images
const missingBoth = [
  'albuquerque-nm', 'anaheim-ca', 'anchorage-ak', 'ann-arbor-mi', 'aurora-il',
  'baton-rouge-la', 'beaverton-or', 'billings-mt', 'birmingham-al', 'boise-id',
  'bowie-md', 'bridgeport-ct', 'cedar-rapids-ia', 'chesapeake-va', 'cheyenne-wy',
  'colorado-springs-co', 'columbia-md', 'columbia-mo', 'columbus-ga', 'des-moines-ia',
  'erie-pa', 'evansville-in', 'fargo-nd', 'fort-wayne-in', 'gulfport-ms',
  'honolulu-hi', 'huntsville-al', 'jackson-ms', 'jersey-city-nj', 'kansas-city-mo',
  'lakewood-co', 'lexington-ky', 'lincoln-ne', 'little-rock-ar', 'louisville-ky',
  'manchester-nh', 'miami-fl', 'milwaukee-wi', 'mobile-al', 'nampa-id',
  'naperville-il', 'new-orleans-la', 'omaha-ne', 'paterson-nj', 'riverside-ca',
  'rochester-mn', 'salt-lake-city-ut', 'santa-ana-ca', 'scottsdale-az', 'silver-spring-md',
  'sioux-falls-sd', 'springfield-ma', 'springfield-mo', 'st-petersburg-fl', 'warwick-ri',
  'wichita-ks', 'wilmington-de', 'worcester-ma', 'yonkers-ny'
];

// Slugs that need only hero images (they already have OG)
const heroOnly = ['cleveland-oh', 'columbus-oh', 'indianapolis-in', 'oklahoma-city-ok', 'tulsa-ok'];

// Build lookup
const cityLookup = {};
for (const entry of cityEntries) {
  cityLookup[entry.slug] = { city: entry.city, state: entry.state };
}

// Brand colors
const COLORS = {
  cream: '#F9F8F6',
  charcoal: '#2D2D2D',
  mauve: '#B5838D',
  grey: '#666666',
  lavender: '#C8B8DB',
  lavenderLight: '#E6E3F0',
};

function buildCitySlug(city, state) {
  return city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + state.toLowerCase();
}

// SVG template for OG image (1200x630)
function generateOGSvg(city, state) {
  const cityUpper = city.toUpperCase();
  const stateFull = getStateFull(state);
  
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0.55" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.lavender}"/>
      <stop offset="100%" stop-color="${COLORS.cream}"/>
    </linearGradient>
  </defs>
  
  <!-- Left cream background -->
  <rect x="0" y="0" width="680" height="630" fill="${COLORS.cream}"/>
  
  <!-- Right gradient -->
  <rect x="680" y="0" width="520" height="630" fill="url(#bgGrad)"/>
  
  <!-- Soft decorative circles on right -->
  <circle cx="900" cy="250" r="120" fill="${COLORS.lavenderLight}" opacity="0.3"/>
  <circle cx="1050" cy="400" r="80" fill="${COLORS.lavenderLight}" opacity="0.2"/>
  
  <!-- Left padding 80px -->
  <!-- Eyebrow label -->
  <text x="80" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" letter-spacing="3" fill="${COLORS.mauve}">${cityUpper} BIRTH SUPPORT</text>
  
  <!-- Accent line -->
  <rect x="80" y="195" width="32" height="2" fill="${COLORS.mauve}"/>
  
  <!-- Main heading -->
  <text x="80" y="280" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="700" fill="${COLORS.charcoal}">Doulas &amp; Birth Plans</text>
  <text x="80" y="340" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="700" fill="${COLORS.charcoal}">in ${city}, ${state}</text>
  
  <!-- Subtitle -->
  <text x="80" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="${COLORS.grey}">Free birth plan template · Hospital info · Real costs · Medicaid coverage</text>
  
  <!-- Bottom branding -->
  <text x="80" y="570" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="${COLORS.grey}" opacity="0.7">True Joy Birthing</text>
  
  <!-- Right side subtle branding -->
  <text x="900" y="590" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="${COLORS.grey}" opacity="0.4">truejoybirthing.com</text>
</svg>`;
}

// SVG template for Hero image (1200x800) - gradient-based city card
function generateHeroSvg(city, state) {
  const stateFull = getStateFull(state);
  
  return `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8E0F0"/>
      <stop offset="60%" stop-color="#F5F0F8"/>
      <stop offset="100%" stop-color="${COLORS.cream}"/>
    </linearGradient>
    <linearGradient id="cityGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLORS.charcoal}" opacity="0.15"/>
      <stop offset="100%" stop-color="${COLORS.charcoal}" opacity="0.05"/>
    </linearGradient>
  </defs>
  
  <!-- Background gradient -->
  <rect width="1200" height="800" fill="url(#skyGrad)"/>
  
  <!-- Abstract city silhouette shapes -->
  <g opacity="0.08" fill="${COLORS.charcoal}">
    <!-- Building shapes - abstract -->
    <rect x="100" y="350" width="60" height="250" rx="2"/>
    <rect x="170" y="280" width="50" height="320" rx="2"/>
    <rect x="230" y="380" width="70" height="220" rx="2"/>
    <rect x="310" y="250" width="40" height="350" rx="2"/>
    <rect x="360" y="300" width="80" height="300" rx="2"/>
    <rect x="450" y="320" width="55" height="280" rx="2"/>
    <rect x="520" y="270" width="45" height="330" rx="2"/>
    <rect x="575" y="340" width="65" height="260" rx="2"/>
    <rect x="650" y="290" width="50" height="310" rx="2"/>
    <rect x="710" y="360" width="75" height="240" rx="2"/>
    <rect x="795" y="310" width="40" height="290" rx="2"/>
    <rect x="845" y="380" width="60" height="220" rx="2"/>
    <rect x="915" y="340" width="55" height="260" rx="2"/>
    <rect x="980" y="300" width="70" height="300" rx="2"/>
    <rect x="1060" y="360" width="50" height="240" rx="2"/>
  </g>
  
  <!-- Larger decorative overlay shapes -->
  <circle cx="600" cy="400" r="300" fill="${COLORS.lavenderLight}" opacity="0.15"/>
  <circle cx="200" cy="300" r="150" fill="${COLORS.lavender}" opacity="0.08"/>
  <circle cx="1000" cy="500" r="200" fill="${COLORS.lavender}" opacity="0.06"/>
  
  <!-- Bottom bar with text -->
  <rect x="0" y="650" width="1200" height="150" fill="white" opacity="0.9"/>
  <rect x="0" y="650" width="1200" height="2" fill="${COLORS.mauve}" opacity="0.5"/>
  
  <!-- City name -->
  <text x="60" y="710" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="700" fill="${COLORS.charcoal}">${city}, ${state}</text>
  <text x="60" y="740" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="${COLORS.grey}">Birth Doula &amp; Midwife Support</text>
  
  <!-- Branding right-aligned -->
  <text x="1140" y="720" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="${COLORS.mauve}" text-anchor="end" font-weight="600" letter-spacing="1">TRUE JOY BIRTHING</text>
  <text x="1140" y="740" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="${COLORS.grey}" text-anchor="end">truejoybirthing.com/birth-support/${city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${state.toLowerCase()}/</text>
</svg>`;
}

function getStateFull(abbr) {
  const states = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NH': 'New Hampshire',
    'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina',
    'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon',
    'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota',
    'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin',
    'WY': 'Wyoming',
  };
  return states[abbr] || abbr;
}

async function generateImages() {
  const allSlugs = [...missingBoth, ...heroOnly];
  let ogCount = 0;
  let heroCount = 0;
  let errors = [];
  
  for (const slug of allSlugs) {
    const info = cityLookup[slug];
    if (!info) {
      // Try to parse from slug
      const parts = slug.split('-');
      const state = parts[parts.length - 1].toUpperCase();
      const city = parts.slice(0, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      console.log(`  [PARSE] ${slug} → ${city}, ${state}`);
      var city = city;
      var stateCode = state;
    } else {
      var city = info.city;
      var stateCode = info.state;
    }
    
    // Generate hero image (all 64 cities need this)
    const heroSvg = generateHeroSvg(city, stateCode);
    const heroPath = join(__dirname, 'public/images', `${slug}-birth-doula-skyline.webp`);
    try {
      await sharp(Buffer.from(heroSvg))
        .resize(1200, 800)
        .webp({ quality: 80 })
        .toFile(heroPath);
      heroCount++;
    } catch (e) {
      errors.push(`Hero ${slug}: ${e.message}`);
    }
    
    // Generate OG image (59 cities need this)
    if (missingBoth.includes(slug)) {
      const ogSvg = generateOGSvg(city, stateCode);
      const ogPath = join(__dirname, 'public/images', `og-city-${slug}.webp`);
      try {
        await sharp(Buffer.from(ogSvg))
          .resize(1200, 630)
          .webp({ quality: 80 })
          .toFile(ogPath);
        ogCount++;
      } catch (e) {
        errors.push(`OG ${slug}: ${e.message}`);
      }
    }
  }
  
  console.log(`\nGenerated ${ogCount} OG images and ${heroCount} hero images`);
  if (errors.length) {
    console.log('Errors:', errors);
  }
}

generateImages().catch(console.error);