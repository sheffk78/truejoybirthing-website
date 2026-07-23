export interface CityLinkEntry {
  slug: string;
  state: string;
  label: string;
}

export const topicCities: Record<string, CityLinkEntry[]> = {
  cost: [
    // California — high-cost metros
    { slug: "san-francisco-ca", state: "ca", label: "San Francisco" },
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-jose-ca", state: "ca", label: "San Jose" },
    { slug: "long-beach-ca", state: "ca", label: "Long Beach" },
    { slug: "sacramento-ca", state: "ca", label: "Sacramento" },
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    { slug: "aurora-co", state: "co", label: "Aurora" },
    // Massachusetts
    { slug: "boston-ma", state: "ma", label: "Boston" },
    // North Carolina — affordable
    { slug: "charlotte-nc", state: "nc", label: "Charlotte" },
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    // New York
    { slug: "new-york-ny", state: "ny", label: "New York" },
    // Texas — affordable metros
    { slug: "beaumont-tx", state: "tx", label: "Beaumont" },
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "abilene-tx", state: "tx", label: "Abilene" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  medicaid: [
    // California — Medicaid doula coverage
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-francisco-ca", state: "ca", label: "San Francisco" },
    { slug: "sacramento-ca", state: "ca", label: "Sacramento" },
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    // Connecticut
    { slug: "hartford-ct", state: "ct", label: "Hartford" },
    // Illinois
    { slug: "chicago-il", state: "il", label: "Chicago" },
    // Massachusetts
    { slug: "boston-ma", state: "ma", label: "Boston" },
    // Maryland
    { slug: "baltimore-md", state: "md", label: "Baltimore" },
    // Minnesota
    { slug: "minneapolis-mn", state: "mn", label: "Minneapolis" },
    // North Carolina
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    { slug: "charlotte-nc", state: "nc", label: "Charlotte" },
    // New York
    { slug: "new-york-ny", state: "ny", label: "New York" },
    // Oregon
    { slug: "portland-or", state: "or", label: "Portland" },
    // Pennsylvania
    { slug: "philadelphia-pa", state: "pa", label: "Philadelphia" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  benefits: [
    // California
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-diego-ca", state: "ca", label: "San Diego" },
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    // Florida
    { slug: "gainesville-fl", state: "fl", label: "Gainesville" },
    { slug: "orlando-fl", state: "fl", label: "Orlando" },
    // Georgia
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    // Minnesota
    { slug: "minneapolis-mn", state: "mn", label: "Minneapolis" },
    // North Carolina
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    // Oregon
    { slug: "portland-or", state: "or", label: "Portland" },
    // Tennessee
    { slug: "nashville-tn", state: "tn", label: "Nashville" },
    // Texas
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "beaumont-tx", state: "tx", label: "Beaumont" },
    { slug: "austin-tx", state: "tx", label: "Austin" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  "birth-plan": [
    // Arizona
    { slug: "phoenix-az", state: "az", label: "Phoenix" },
    // California
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-diego-ca", state: "ca", label: "San Diego" },
    { slug: "san-francisco-ca", state: "ca", label: "San Francisco" },
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    // Florida
    { slug: "gainesville-fl", state: "fl", label: "Gainesville" },
    { slug: "gainesville-fl", state: "fl", label: "Gainesville" },
    // Georgia
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    // Nevada
    { slug: "las-vegas-nv", state: "nv", label: "Las Vegas" },
    // Tennessee
    { slug: "nashville-tn", state: "tn", label: "Nashville" },
    // Texas
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "beaumont-tx", state: "tx", label: "Beaumont" },
    { slug: "abilene-tx", state: "tx", label: "Abilene" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  "doula-basics": [
    // West
    { slug: "san-francisco-ca", state: "ca", label: "San Francisco" },
    { slug: "portland-or", state: "or", label: "Portland" },
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
    // Mountain
    { slug: "aurora-co", state: "co", label: "Aurora" },
    { slug: "phoenix-az", state: "az", label: "Phoenix" },
    // Midwest
    { slug: "chicago-il", state: "il", label: "Chicago" },
    { slug: "minneapolis-mn", state: "mn", label: "Minneapolis" },
    { slug: "columbus-oh", state: "oh", label: "Columbus" },
    // South
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    { slug: "nashville-tn", state: "tn", label: "Nashville" },
    { slug: "beaumont-tx", state: "tx", label: "Beaumont" },
    // East
    { slug: "boston-ma", state: "ma", label: "Boston" },
    { slug: "new-york-ny", state: "ny", label: "New York" },
    { slug: "philadelphia-pa", state: "pa", label: "Philadelphia" },
    // Florida
    { slug: "gainesville-fl", state: "fl", label: "Gainesville" },
  ],

  postpartum: [
    // California
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-diego-ca", state: "ca", label: "San Diego" },
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    // Florida
    { slug: "gainesville-fl", state: "fl", label: "Gainesville" },
    { slug: "port-st-lucie-fl", state: "fl", label: "Port St. Lucie" },
    // Georgia
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    // Illinois
    { slug: "chicago-il", state: "il", label: "Chicago" },
    // Massachusetts
    { slug: "boston-ma", state: "ma", label: "Boston" },
    // North Carolina
    { slug: "charlotte-nc", state: "nc", label: "Charlotte" },
    // New York
    { slug: "new-york-ny", state: "ny", label: "New York" },
    // Ohio
    { slug: "columbus-oh", state: "oh", label: "Columbus" },
    // Texas
    { slug: "beaumont-tx", state: "tx", label: "Beaumont" },
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "austin-tx", state: "tx", label: "Austin" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  hospital: [
    // California
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-francisco-ca", state: "ca", label: "San Francisco" },
    { slug: "sacramento-ca", state: "ca", label: "Sacramento" },
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    // Florida
    { slug: "gainesville-fl", state: "fl", label: "Gainesville" },
    { slug: "gainesville-fl", state: "fl", label: "Gainesville" },
    { slug: "port-st-lucie-fl", state: "fl", label: "Port St. Lucie" },
    // Georgia
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    // New York
    { slug: "new-york-ny", state: "ny", label: "New York" },
    // Ohio
    { slug: "cleveland-oh", state: "oh", label: "Cleveland" },
    { slug: "columbus-oh", state: "oh", label: "Columbus" },
    // Pennsylvania
    { slug: "philadelphia-pa", state: "pa", label: "Philadelphia" },
    // Texas
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "beaumont-tx", state: "tx", label: "Beaumont" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  "home-birth": [
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    { slug: "fort-collins-co", state: "co", label: "Fort Collins" },
    // North Carolina
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    { slug: "charlotte-nc", state: "nc", label: "Charlotte" },
    // Oregon
    { slug: "portland-or", state: "or", label: "Portland" },
    { slug: "eugene-or", state: "or", label: "Eugene" },
    // Texas
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "beaumont-tx", state: "tx", label: "Beaumont" },
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "abilene-tx", state: "tx", label: "Abilene" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
    { slug: "tacoma-wa", state: "wa", label: "Tacoma" },
    { slug: "vancouver-wa", state: "wa", label: "Vancouver" },
  ],

  "c-section": [
    // California
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-francisco-ca", state: "ca", label: "San Francisco" },
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    // Florida
    { slug: "gainesville-fl", state: "fl", label: "Gainesville" },
    { slug: "gainesville-fl", state: "fl", label: "Gainesville" },
    // Georgia
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    // Minnesota
    { slug: "minneapolis-mn", state: "mn", label: "Minneapolis" },
    // New York
    { slug: "new-york-ny", state: "ny", label: "New York" },
    // Ohio
    { slug: "columbus-oh", state: "oh", label: "Columbus" },
    // Pennsylvania
    { slug: "philadelphia-pa", state: "pa", label: "Philadelphia" },
    // Texas
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "beaumont-tx", state: "tx", label: "Beaumont" },
    { slug: "abilene-tx", state: "tx", label: "Abilene" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  vbac: [
    // California
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-francisco-ca", state: "ca", label: "San Francisco" },
    { slug: "sacramento-ca", state: "ca", label: "Sacramento" },
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    // Connecticut
    { slug: "new-haven-ct", state: "ct", label: "New Haven" },
    // Florida
    { slug: "port-st-lucie-fl", state: "fl", label: "Port St. Lucie" },
    // Minnesota
    { slug: "minneapolis-mn", state: "mn", label: "Minneapolis" },
    // North Carolina
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    { slug: "charlotte-nc", state: "nc", label: "Charlotte" },
    // Oregon
    { slug: "portland-or", state: "or", label: "Portland" },
    // Texas
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "beaumont-tx", state: "tx", label: "Beaumont" },
    // Utah
    { slug: "lehi-ut", state: "ut", label: "Lehi" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  interview: [
    // Arizona
    { slug: "phoenix-az", state: "az", label: "Phoenix" },
    // California
    { slug: "san-diego-ca", state: "ca", label: "San Diego" },
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    // Florida
    { slug: "orlando-fl", state: "fl", label: "Orlando" },
    // Georgia
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    // Illinois
    { slug: "chicago-il", state: "il", label: "Chicago" },
    // Massachusetts
    { slug: "boston-ma", state: "ma", label: "Boston" },
    // Michigan
    { slug: "detroit-mi", state: "mi", label: "Detroit" },
    // North Carolina
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    // Nevada
    { slug: "las-vegas-nv", state: "nv", label: "Las Vegas" },
    // New York
    { slug: "new-york-ny", state: "ny", label: "New York" },
    // Oregon
    { slug: "portland-or", state: "or", label: "Portland" },
    // Texas
    { slug: "austin-tx", state: "tx", label: "Austin" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  general: [
    // Arizona
    { slug: "phoenix-az", state: "az", label: "Phoenix" },
    { slug: "tucson-az", state: "az", label: "Tucson" },
    // California
    { slug: "fresno-ca", state: "ca", label: "Fresno" },
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    // Colorado
    { slug: "aurora-co", state: "co", label: "Aurora" },
    // Florida
    { slug: "gainesville-fl", state: "fl", label: "Gainesville" },
    { slug: "port-st-lucie-fl", state: "fl", label: "Port St. Lucie" },
    // Georgia
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    { slug: "augusta-ga", state: "ga", label: "Augusta" },
    // Idaho
    { slug: "meridian-id", state: "id", label: "Meridian" },
    // Illinois
    { slug: "chicago-il", state: "il", label: "Chicago" },
    { slug: "aurora-il", state: "il", label: "Aurora" },
    { slug: "springfield-il", state: "il", label: "Springfield" },
    // Indiana
    { slug: "indianapolis-in", state: "in", label: "Indianapolis" },
    // Maryland
    { slug: "baltimore-md", state: "md", label: "Baltimore" },
    // Massachusetts
    { slug: "worcester-ma", state: "ma", label: "Worcester" },
    // Michigan
    { slug: "grand-rapids-mi", state: "mi", label: "Grand Rapids" },
    // Minnesota
    { slug: "st-paul-mn", state: "mn", label: "St. Paul" },
    // Nevada
    { slug: "henderson-nv", state: "nv", label: "Henderson" },
    { slug: "reno-nv", state: "nv", label: "Reno" },
    // New Jersey
    { slug: "newark-nj", state: "nj", label: "Newark" },
    // North Carolina
    { slug: "charlotte-nc", state: "nc", label: "Charlotte" },
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    // Oklahoma
    { slug: "oklahoma-city-ok", state: "ok", label: "Oklahoma City" },
    { slug: "tulsa-ok", state: "ok", label: "Tulsa" },
    // Tennessee
    { slug: "nashville-tn", state: "tn", label: "Nashville" },
    { slug: "hendersonville-tn", state: "tn", label: "Hendersonville" },
    { slug: "memphis-tn", state: "tn", label: "Memphis" },
    // Texas
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "beaumont-tx", state: "tx", label: "Beaumont" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],
};

export const stateNames: Record<string, string> = {
  az: "Arizona",
  ca: "California",
  co: "Colorado",
  ct: "Connecticut",
  fl: "Florida",
  ga: "Georgia",
  id: "Idaho",
  il: "Illinois",
  in: "Indiana",
  ma: "Massachusetts",
  md: "Maryland",
  mi: "Michigan",
  mn: "Minnesota",
  nc: "North Carolina",
  nj: "New Jersey",
  nv: "Nevada",
  ny: "New York",
  oh: "Ohio",
  ok: "Oklahoma",
  or: "Oregon",
  pa: "Pennsylvania",
  ri: "Rhode Island",
  sc: "South Carolina",
  tn: "Tennessee",
  tx: "Texas",
  ut: "Utah",
  va: "Virginia",
  wa: "Washington",
};

export const stateHubs: Array<{ slug: string; label: string }> = [
  { slug: "/birth-support/az/", label: "Arizona" },
  { slug: "/birth-support/ca/", label: "California" },
  { slug: "/birth-support/co/", label: "Colorado" },
  { slug: "/birth-support/ct/", label: "Connecticut" },
  { slug: "/birth-support/fl/", label: "Florida" },
  { slug: "/birth-support/ga/", label: "Georgia" },
  { slug: "/birth-support/id/", label: "Idaho" },
  { slug: "/birth-support/il/", label: "Illinois" },
  { slug: "/birth-support/in/", label: "Indiana" },
  { slug: "/birth-support/ma/", label: "Massachusetts" },
  { slug: "/birth-support/md/", label: "Maryland" },
  { slug: "/birth-support/mi/", label: "Michigan" },
  { slug: "/birth-support/mn/", label: "Minnesota" },
  { slug: "/birth-support/nc/", label: "North Carolina" },
  { slug: "/birth-support/nj/", label: "New Jersey" },
  { slug: "/birth-support/nv/", label: "Nevada" },
  { slug: "/birth-support/ny/", label: "New York" },
  { slug: "/birth-support/oh/", label: "Ohio" },
  { slug: "/birth-support/ok/", label: "Oklahoma" },
  { slug: "/birth-support/or/", label: "Oregon" },
  { slug: "/birth-support/pa/", label: "Pennsylvania" },
  { slug: "/birth-support/ri/", label: "Rhode Island" },
  { slug: "/birth-support/sc/", label: "South Carolina" },
  { slug: "/birth-support/tn/", label: "Tennessee" },
  { slug: "/birth-support/tx/", label: "Texas" },
  { slug: "/birth-support/ut/", label: "Utah" },
  { slug: "/birth-support/va/", label: "Virginia" },
  { slug: "/birth-support/wa/", label: "Washington" },
];