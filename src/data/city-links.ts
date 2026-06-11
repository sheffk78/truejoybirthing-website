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
    { slug: "denver-co", state: "co", label: "Denver" },
    { slug: "colorado-springs-co", state: "co", label: "Colorado Springs" },
    // Massachusetts
    { slug: "boston-ma", state: "ma", label: "Boston" },
    // North Carolina — affordable
    { slug: "charlotte-nc", state: "nc", label: "Charlotte" },
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    // New York
    { slug: "new-york-ny", state: "ny", label: "New York" },
    // Texas — affordable metros
    { slug: "houston-tx", state: "tx", label: "Houston" },
    { slug: "dallas-tx", state: "tx", label: "Dallas" },
    { slug: "san-antonio-tx", state: "tx", label: "San Antonio" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  medicaid: [
    // California — Medicaid doula coverage
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-francisco-ca", state: "ca", label: "San Francisco" },
    { slug: "sacramento-ca", state: "ca", label: "Sacramento" },
    // Colorado
    { slug: "denver-co", state: "co", label: "Denver" },
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
    { slug: "denver-co", state: "co", label: "Denver" },
    // Florida
    { slug: "miami-fl", state: "fl", label: "Miami" },
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
    { slug: "houston-tx", state: "tx", label: "Houston" },
    { slug: "dallas-tx", state: "tx", label: "Dallas" },
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
    { slug: "denver-co", state: "co", label: "Denver" },
    // Florida
    { slug: "jacksonville-fl", state: "fl", label: "Jacksonville" },
    { slug: "miami-fl", state: "fl", label: "Miami" },
    // Georgia
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    // Nevada
    { slug: "las-vegas-nv", state: "nv", label: "Las Vegas" },
    // Tennessee
    { slug: "nashville-tn", state: "tn", label: "Nashville" },
    // Texas
    { slug: "dallas-tx", state: "tx", label: "Dallas" },
    { slug: "houston-tx", state: "tx", label: "Houston" },
    { slug: "san-antonio-tx", state: "tx", label: "San Antonio" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  "doula-basics": [
    // West
    { slug: "san-francisco-ca", state: "ca", label: "San Francisco" },
    { slug: "portland-or", state: "or", label: "Portland" },
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
    // Mountain
    { slug: "denver-co", state: "co", label: "Denver" },
    { slug: "phoenix-az", state: "az", label: "Phoenix" },
    // Midwest
    { slug: "chicago-il", state: "il", label: "Chicago" },
    { slug: "minneapolis-mn", state: "mn", label: "Minneapolis" },
    { slug: "columbus-oh", state: "oh", label: "Columbus" },
    // South
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    { slug: "nashville-tn", state: "tn", label: "Nashville" },
    { slug: "houston-tx", state: "tx", label: "Houston" },
    // East
    { slug: "boston-ma", state: "ma", label: "Boston" },
    { slug: "new-york-ny", state: "ny", label: "New York" },
    { slug: "philadelphia-pa", state: "pa", label: "Philadelphia" },
    // Florida
    { slug: "miami-fl", state: "fl", label: "Miami" },
  ],

  postpartum: [
    // California
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-diego-ca", state: "ca", label: "San Diego" },
    // Colorado
    { slug: "denver-co", state: "co", label: "Denver" },
    // Florida
    { slug: "miami-fl", state: "fl", label: "Miami" },
    { slug: "tampa-fl", state: "fl", label: "Tampa" },
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
    { slug: "houston-tx", state: "tx", label: "Houston" },
    { slug: "dallas-tx", state: "tx", label: "Dallas" },
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
    { slug: "denver-co", state: "co", label: "Denver" },
    // Florida
    { slug: "jacksonville-fl", state: "fl", label: "Jacksonville" },
    { slug: "miami-fl", state: "fl", label: "Miami" },
    { slug: "tampa-fl", state: "fl", label: "Tampa" },
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
    { slug: "dallas-tx", state: "tx", label: "Dallas" },
    { slug: "houston-tx", state: "tx", label: "Houston" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  "home-birth": [
    // Colorado
    { slug: "denver-co", state: "co", label: "Denver" },
    { slug: "fort-collins-co", state: "co", label: "Fort Collins" },
    // North Carolina
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    { slug: "greensboro-nc", state: "nc", label: "Greensboro" },
    // Oregon
    { slug: "portland-or", state: "or", label: "Portland" },
    { slug: "eugene-or", state: "or", label: "Eugene" },
    // Texas
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "houston-tx", state: "tx", label: "Houston" },
    { slug: "dallas-tx", state: "tx", label: "Dallas" },
    { slug: "san-antonio-tx", state: "tx", label: "San Antonio" },
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
    { slug: "denver-co", state: "co", label: "Denver" },
    // Florida
    { slug: "miami-fl", state: "fl", label: "Miami" },
    { slug: "jacksonville-fl", state: "fl", label: "Jacksonville" },
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
    { slug: "dallas-tx", state: "tx", label: "Dallas" },
    { slug: "houston-tx", state: "tx", label: "Houston" },
    { slug: "san-antonio-tx", state: "tx", label: "San Antonio" },
    // Washington
    { slug: "seattle-wa", state: "wa", label: "Seattle" },
  ],

  vbac: [
    // California
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    { slug: "san-francisco-ca", state: "ca", label: "San Francisco" },
    { slug: "sacramento-ca", state: "ca", label: "Sacramento" },
    // Colorado
    { slug: "denver-co", state: "co", label: "Denver" },
    // Connecticut
    { slug: "new-haven-ct", state: "ct", label: "New Haven" },
    // Florida
    { slug: "tampa-fl", state: "fl", label: "Tampa" },
    // Minnesota
    { slug: "minneapolis-mn", state: "mn", label: "Minneapolis" },
    // North Carolina
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    { slug: "charlotte-nc", state: "nc", label: "Charlotte" },
    // Oregon
    { slug: "portland-or", state: "or", label: "Portland" },
    // Texas
    { slug: "austin-tx", state: "tx", label: "Austin" },
    { slug: "houston-tx", state: "tx", label: "Houston" },
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
    { slug: "denver-co", state: "co", label: "Denver" },
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
    // California
    { slug: "fresno-ca", state: "ca", label: "Fresno" },
    { slug: "los-angeles-ca", state: "ca", label: "Los Angeles" },
    // Colorado
    { slug: "denver-co", state: "co", label: "Denver" },
    // Florida
    { slug: "jacksonville-fl", state: "fl", label: "Jacksonville" },
    { slug: "tampa-fl", state: "fl", label: "Tampa" },
    // Georgia
    { slug: "atlanta-ga", state: "ga", label: "Atlanta" },
    // Illinois
    { slug: "chicago-il", state: "il", label: "Chicago" },
    // Maryland
    { slug: "baltimore-md", state: "md", label: "Baltimore" },
    // North Carolina
    { slug: "charlotte-nc", state: "nc", label: "Charlotte" },
    { slug: "raleigh-nc", state: "nc", label: "Raleigh" },
    // Tennessee
    { slug: "nashville-tn", state: "tn", label: "Nashville" },
    // Texas
    { slug: "dallas-tx", state: "tx", label: "Dallas" },
    { slug: "houston-tx", state: "tx", label: "Houston" },
    { slug: "el-paso-tx", state: "tx", label: "El Paso" },
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