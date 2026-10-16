/**
 * How sure: ranges for rates and averages, and fair comparisons over seed blocks.
 *
 * Seeds are split into 20 blocks (by index, mod 20). A claim like "A beats B"
 * counts the blocks it holds in, and needs 16 of 20 to count as clear: about a
 * 1 in 80 chance by luck alone (a two-sided sign test). Anything less is
 * "no clear difference".
 */

export const BLOCKS = 20;
export const CLEAR = 16;

export type Range = { value: number; lo: number; hi: number };

/** A rate with its 95% range (Wilson score interval). */
export function rate(k: number, n: number): Range {
  if (!n) return { value: 0, lo: 0, hi: 1 };
  const z = 1.96, z2 = z * z, p = k / n;
  const centre = (p + z2 / (2 * n)) / (1 + z2 / n);
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / (1 + z2 / n);
  return { value: p, lo: Math.max(0, centre - half), hi: Math.min(1, centre + half) };
}

export const mean = (xs: readonly number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

export function sd(xs: readonly number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) * (x - m), 0) / (xs.length - 1));
}

/** The value at fraction `q` of the way through the sorted list (nearest rank). */
export function quantile(xs: readonly number[], q: number): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.round(q * (s.length - 1))))];
}

/** Per-block means of values given in seed order. */
export function blockMeans(xs: readonly number[]): number[] {
  const sum = new Array(BLOCKS).fill(0), n = new Array(BLOCKS).fill(0);
  xs.forEach((x, i) => {
    sum[i % BLOCKS] += x;
    n[i % BLOCKS]++;
  });
  return sum.map((s, b) => (n[b] ? s / n[b] : 0));
}

/** An average with its 95% range, from the spread of its 20 block means. */
export function average(xs: readonly number[]): Range {
  const m = mean(xs);
  const half = (2.093 * sd(blockMeans(xs))) / Math.sqrt(BLOCKS);
  return { value: m, lo: m - half, hi: m + half };
}

export type Verdict = "higher" | "lower" | "no clear difference" | "identical";
export type Comparison = { diff: Range; higher: number; lower: number; verdict: Verdict; holds: number };

/**
 * Compare two measures taken on the same seeds, in the same order: `a[i]` and
 * `b[i]` come from seed i. Paired, so luck mostly cancels out.
 */
export function compare(a: readonly number[], b: readonly number[]): Comparison {
  if (a.length !== b.length) throw new Error(`can't pair ${a.length} values with ${b.length}`);
  const d = a.map((x, i) => x - b[i]);
  const blocks = blockMeans(d);
  const higher = blocks.filter((x) => x > 1e-12).length;
  const lower = blocks.filter((x) => x < -1e-12).length;
  const identical = d.every((x) => x === 0);
  const verdict: Verdict = identical ? "identical" : higher >= CLEAR ? "higher" : lower >= CLEAR ? "lower" : "no clear difference";
  return { diff: average(d), higher, lower, verdict, holds: Math.max(higher, lower) };
}

/** Words for a comparison: "higher, holds in 19 of 20 blocks". */
export function said(c: Comparison): string {
  if (c.verdict === "identical") return "identical on every seed";
  if (c.verdict === "no clear difference") return `no clear difference (${c.holds} of ${BLOCKS} blocks agree)`;
  return `${c.verdict}, holds in ${c.holds} of ${BLOCKS} blocks`;
}

export const pct = (x: number) => `${Math.round(x * 100)}%`;
export const rangePct = (r: Range) => `${pct(r.value)} (${pct(r.lo)}–${pct(r.hi)})`;
export const num = (x: number, d = 1) => x.toFixed(d);
export const rangeNum = (r: Range, d = 1) => `${num(r.value, d)} (${num(r.lo, d)}–${num(r.hi, d)})`;
