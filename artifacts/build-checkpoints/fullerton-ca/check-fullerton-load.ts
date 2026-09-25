import { cities } from '../src/data/cities';
const f = (cities as Record<string, any>)['fullerton-ca'];
if (!f) { console.log('MISSING fullerton-ca'); process.exit(1); }
console.log('LOADED OK');
console.log('doulas:', f.localDoulas.length, 'hospitals:', f.hospitalDetails.length, 'faqs:', f.faqs.length, 'birthCenters:', f.birthCenterDetails.length);
console.log('slug:', f.slug, 'cost:', f.costLow, '-', f.costHigh, 'lat/lng:', f.lat, f.lng);
const total = Object.keys(cities).length;
console.log('total cities:', total);
