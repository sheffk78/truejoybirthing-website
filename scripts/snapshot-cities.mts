/**
 * snapshot-cities.mts — dump a stable runtime snapshot of cities.ts.
 *
 * Imports the module (exact same path validate-cities.ts uses) and prints a
 * deterministic text snapshot: per city, every top-level key's JSON value.
 * Diffing before/after an edit proves runtime equivalence.
 */
import { cities } from "../src/data/cities";

const keysOf = (o: Record<string, unknown>) => Object.keys(o).sort();
const stable = (v: unknown): string => {
  if (Array.isArray(v)) return "[" + v.map((x) => (typeof x === "object" && x !== null ? stable(x as Record<string, unknown>) : JSON.stringify(x))).sort().join(",") + "]";
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return "{" + keysOf(o).map((k) => `${k}:${typeof o[k] === "object" && o[k] !== null ? stable(o[k] as Record<string, unknown>) : JSON.stringify(o[k])}`).join(",") + "}";
  }
  return JSON.stringify(v);
};

const out: string[] = [];
for (const slug of Object.keys(cities).sort()) {
  const c = (cities as Record<string, Record<string, unknown>>)[slug];
  out.push(`CITY ${slug}`);
  for (const k of keysOf(c)) {
    out.push(`  ${k}=${stable(c[k])}`);
  }
}
console.log(out.join("\n"));