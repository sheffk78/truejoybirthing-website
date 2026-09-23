/**
 * Dump city page prose fields for shape/similarity analysis.
 * Usage: npx tsx scripts/dump-city-prose.ts [outdir]
 * Writes one JSON per city: {slug}.json with the prose fields from cities.ts.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cities } from '../src/data/cities';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outdir = process.argv[2] || '/tmp/tjb-prose';
fs.mkdirSync(outdir, { recursive: true });

const fields = ['culture', 'heroLocalDetail', 'midwifeInfo', 'medicaidNote', 'insuranceNote'];

let count = 0;
for (const [slug, data] of Object.entries(cities as Record<string, any>)) {
  const out: any = { slug };
  out.culture = data.culture || '';
  out.heroLocalDetail = data.heroLocalDetail || '';
  out.midwifeInfo = typeof data.midwifeInfo === 'string' ? data.midwifeInfo : JSON.stringify(data.midwifeInfo || '');
  out.medicaidNote = data.medicaidNote || '';
  out.insuranceNote = data.insuranceNote || '';
  out.hospitalParagraphs = (data.hospitalDetails || []).map((h: any) => h.paragraph || '');
  out.birthCenterParagraphs = (data.birthCenterDetails || []).map((b: any) => b.paragraph || (b.description || ''));
  out.faqAnswers = (data.faqs || []).map((f: any) => f.a || '');
  out.doulaDescriptions = (data.localDoulas || []).map((d: any) => d.description || '');
  // structured-field completeness (differentiation levers)
  const hosp = data.hospitalDetails || [];
  const allHosp = hosp.length || 1;
  out.structured = {
    hospitals: hosp.length,
    birthCenters: (data.birthCenterDetails || []).length,
    doulas: (data.localDoulas || []).length,
    faqs: (data.faqs || []).length,
    hasBirthStats: !!data.birthStats && Object.keys(data.birthStats).length > 0,
    hasLat: data.lat != null,
    hospitalFieldCoverage: {
      address: hosp.filter((h: any) => !!h.address).length / allHosp,
      nicuLevel: hosp.filter((h: any) => !!h.nicuLevel).length / allHosp,
      vbacPolicy: hosp.filter((h: any) => !!h.vbacPolicy).length / allHosp,
      doulaPolicy: hosp.filter((h: any) => !!h.doulaPolicy).length / allHosp,
      waterBirth: hosp.filter((h: any) => !!h.waterBirth).length / allHosp,
      medicaid: hosp.filter((h: any) => h.medicaid != null).length / allHosp,
      url: hosp.filter((h: any) => !!h.url).length / allHosp,
      privateRooms: hosp.filter((h: any) => !!h.privateRooms).length / allHosp,
      babyFriendly: hosp.filter((h: any) => !!h.babyFriendly).length / allHosp,
    },
  };
  fs.writeFileSync(path.join(outdir, `${slug}.json`), JSON.stringify(out, null, 1));
  count++;
}
console.log(`Dumped ${count} cities to ${outdir}`);