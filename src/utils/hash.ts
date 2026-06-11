/**
 * FNV-1a 32-bit hash — pinned, deterministic, never change without staged rollout.
 * Used for deterministic internal link variation across city pages.
 */
export function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Deterministic selection: pick `count` items from `pool`, seeded by `seed` string.
 * Uses Fisher-Yates shuffle seeded by fnv1a of the seed + index.
 */
export function seededPick<T>(pool: T[], seed: string, count: number): T[] {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const hash = fnv1a(seed + i);
    const j = hash % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/**
 * Pick one item from an array, deterministically by seed.
 */
export function seededPickOne<T>(pool: T[], seed: string): T {
  return pool[fnv1a(seed) % pool.length];
}