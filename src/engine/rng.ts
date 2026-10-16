/**
 * Seeded dice. Whole-number arithmetic only (|, ^, >>>, Math.imul), so every
 * browser produces the same numbers from the same seed.
 *
 * A run has one seed. Each fight, perk offer and loot roll gets its own slice
 * of it, named by a label, so an earlier decision never shifts a later slice.
 */

/** Generator state: four 32-bit words. Plain data, so it saves with the run. */
export type Rng = number[];

/** FNV-1a over a string, with a final avalanche. Returns an unsigned 32-bit integer. */
export function hash32(s: string, salt = 0): number {
  let h = (0x811c9dc5 ^ salt) >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** A 64-bit fingerprint of a string, as 16 hex digits. */
export function fingerprint(s: string): string {
  const hex = (n: number) => n.toString(16).padStart(8, "0");
  return hex(hash32(s, 1)) + hex(hash32(s, 2));
}

/** The slice of a run's dice named by `label`, e.g. "fight:den_mouth". */
export function rngFor(seed: number, label: string): Rng {
  const key = `${seed}:${label}`;
  const s = [hash32(key, 11), hash32(key, 12), hash32(key, 13), hash32(key, 14)];
  for (let i = 0; i < 12; i++) u32(s);
  return s;
}

/** sfc32: the next unsigned 32-bit integer. Advances the state in place. */
export function u32(s: Rng): number {
  const a = s[0], b = s[1], c = s[2], d = s[3];
  const t = (((a + b) | 0) + d) | 0;
  s[3] = (d + 1) | 0;
  s[0] = b ^ (b >>> 9);
  s[1] = (c + (c << 3)) | 0;
  s[2] = (((c << 21) | (c >>> 11)) + t) | 0;
  return t >>> 0;
}

/** A number in [0, 1). Dividing by 2^32 is exact. */
export const next = (s: Rng): number => u32(s) / 4294967296;

/** A whole number in [0, n). */
export const int = (s: Rng, n: number): number => Math.floor(next(s) * n);

export const pick = <T>(s: Rng, xs: readonly T[]): T => xs[int(s, xs.length)];

/** A shuffled copy. */
export function shuffle<T>(s: Rng, xs: readonly T[]): T[] {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = int(s, i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
