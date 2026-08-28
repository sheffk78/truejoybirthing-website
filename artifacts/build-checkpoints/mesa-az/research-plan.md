# Research Plan for Mesa, AZ

## Research Priorities

1. **Doulas + Midwives** (Target: 4-5)
   - Key Sources: DoulaMatch.net, Bornbir.com, Google Maps (Mesa AZ doula), Arizona Doula Collective
2. **Hospitals** (Target: 5)
   - Local: Banner Desert Medical Center, HonorHealth John C. Lincoln Hospital
   - Nearby: Banner Estrella, Phoenix Children's Hospital
   - Research: NICU Level, Doula Policy, Baby-Friendly Support, Private Room Availability
3. **Birth Centers** (Target: 1-2)
   - Local: Birthright of Arizona
   - Verify: Address, Services, Independent Sources (Google Maps, Yelp)

## Data Requirements

- **Doulas/Midwives**: 
  - Name, **Specific Credentials** (DONA, CAPPA, HCHI), Cost Range, 300+ char description
- **Hospitals**: 
  - NICU Level (I-III), Doula Policy, Baby-Friendly, Support Services, Address
- **Birth Centers**: 
  - Address, URL, Services, Verifiable Source

## Process Checklist
☑️ **Step 1**: Extract current city block from `cities.ts` for reference.
☑️ **Step 2**: Initiate research on DoulaMatch/Bornbir (target 3+ doulas).
☑️ **Step 3**: Research Mesa/AZ hospitals (prioritize Banner Estrella, HonrHealth).
☑️ **Step 4**: Confirm service area array format.
☑️ **Step 5**: Verify birth centers (address, URL, services).

## Timeline

- **First 10 Call Block**: Checkpoint Plan + Initial Research (DoulaMatch.net, Hospital Info).
- **Next Block**: Image Generation (Hero + OG), Finalize City Entry, Validate.

## Validation Steps

1. Verify all providers, hospitals, and centers meet requirements.
2. Images must align with spec (silhouette, doula scene, no distortion).
3. `cities.ts` edit method: Python script (append/extract block).
4. Run: `grep -c 'mesa-az' src/data/cities.ts` (exactly 1).
5. Run: `npx tsx validate-city-data.ts` + `npm run build`; check both exit-codes=0

---