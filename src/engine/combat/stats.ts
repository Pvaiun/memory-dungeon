/**
 * Stats and timing maths for the fight: final values, speeds and the numbers
 * statuses fix at application. Whole sub-ticks and basic arithmetic only.
 */
import { SUBTICKS, type NumT, type ScaleT, type StatusT } from "../../schema.js";
import type { Content } from "../run.js";

/** Content ticks to sub-ticks. Rounding absorbs float noise such as 0.3 × 1000. */
export const sub = (ticks: number) => Math.round(ticks * SUBTICKS);

/** A timing stat's speed, as a fraction [num, den]: (1 + s/100) at 0 or above, 1 ÷ (1 + |s|/100) below. */
export type Speed = [number, number];
export const speedOf = (s: number): Speed => (s >= 0 ? [100 + s, 100] : [100, 100 - s]);
export const sameSpeed = (a: Speed, b: Speed) => a[0] * b[1] === b[0] * a[1];
/** timing ÷ speed, dropping any fraction of a sub-tick. */
export const scaled = (t: number, s: Speed) => Math.floor((t * s[1]) / s[0]);
/** A running timer after its speed changes: remaining × old ÷ new. */
export const rescale = (remaining: number, from: Speed, to: Speed) => Math.floor((remaining * from[0] * to[1]) / (from[1] * to[0]));
/** The basic attack's speed after the Attack Speed ceiling: cooldown can't drop below recovery. */
export function basicSpeed(attackSpeed: number, cooldown: number, recovery: number): Speed {
  const s = speedOf(attackSpeed);
  return recovery > 0 && s[0] * recovery > s[1] * cooldown ? [cooldown, recovery] : s;
}

/** Final value = (base + all flat changes) × (1 + sum of percent changes/100), dropping fractions, then floor and cap. */
export function finalValue(c: Content, key: string, base: number, flat: number, pct: number): number {
  const v = Math.trunc((base + flat) * (1 + pct / 100));
  const def = c.stats.get(key);
  if (!def) return v;
  return Math.min(def.cap ?? v, Math.max(def.floor ?? v, v));
}

export const statDefault = (c: Content, key: string) => c.stats.get(key)?.default ?? 0;

// ─── Numbers inside statuses ────────────────────────────────────────────────

/**
 * Every number in a status, in a fixed order, so an instance can store the part
 * fixed at application (its source's side) as a plain array, and a Refresh can
 * keep the stronger of each.
 */
export type Compiled = {
  nums: { n: NumT; stat: boolean }[];
  cap: number;
  /** What the status contains, for immunity and conditions: [kind, tag]. */
  kinds: [string, string | null][];
  /** Its pulses damage the holder. */
  harms: boolean;
  /** Tags its pulses carry: its id, its tags, its element and subtype. */
  tags: string[];
};

const compiled = new WeakMap<StatusT, Compiled>();
/** Slot of a number's owner (an effect, stat change, boost, modifier or rider) within its status. */
const slots = new WeakMap<object, number>();

export function compile(s: StatusT): Compiled {
  let out = compiled.get(s);
  if (out) return out;
  const nums: Compiled["nums"] = [];
  const add = (owner: object, ...ns: (NumT | undefined)[]) => {
    slots.set(owner, nums.length);
    for (const n of ns) nums.push({ n: n ?? 0, stat: false });
  };
  for (const ch of s.stats ?? []) {
    slots.set(ch, nums.length);
    nums.push({ n: ch.flat ?? 0, stat: true }, { n: ch.pct ?? 0, stat: true });
  }
  for (const b of s.boosts ?? []) add(b, b.pct);
  for (const t of s.taken ?? []) add(t, t.pct);
  for (const r of s.riders ?? []) add(r, r.add.amount);
  const effects = [...(s.pulse?.do ?? []), ...(s.trigger?.do ?? []), ...(s.reactions ?? []).flatMap((r) => r.do)];
  for (const e of effects) add(e, e.op === "remove" ? 0 : e.op === "apply" ? (e.stacks ?? 1) : e.amount);
  let cap = -1;
  if (s.cap !== undefined) {
    cap = nums.length;
    slots.set(s, cap);
    nums.push({ n: s.cap, stat: false });
  }
  const kinds: Compiled["kinds"] = [];
  for (const ch of s.stats ?? []) kinds.push(["stat", ch.stat]);
  for (const b of s.boosts ?? []) kinds.push(["boost", b.tag]);
  for (const t of s.taken ?? []) kinds.push(["taken", t.tag ?? null]);
  if (s.absorb) kinds.push(["absorb", null]);
  if (s.lockout) kinds.push(["lockout", s.lockout.covers]);
  if (s.riders?.length || s.convert) kinds.push(["action_change", null]);
  if (s.pulse) kinds.push(["pulse", null]);
  if (s.reactions?.length || s.trigger) kinds.push(["reaction", null]);
  const harms = (s.pulse?.do ?? []).some((e) => e.op === "damage" && (e.to ?? "holder") === "holder");
  const tags = [s.id, ...(s.tags ?? []), ...(s.element ? [s.element] : []), ...(s.subtype ? [s.subtype] : [])];
  out = { nums, cap, kinds, harms, tags };
  compiled.set(s, out);
  return out;
}

/** The slot of the number(s) `owner` holds in its status. */
export function slotOf(s: StatusT, owner: object): number {
  compile(s);
  const i = slots.get(owner);
  if (i === undefined) throw new Error(`no number slot for a part of status '${s.id}'`);
  return i;
}

/** Whose value a scale reads, in an action or in a status. */
export function role(s: ScaleT, inStatus: boolean): "self" | "target" | "holder" | "source" | "amount" {
  if (s.amount) return "amount";
  if (s.of) return s.of;
  if (s.stat) return inStatus ? "source" : "self";
  return inStatus ? "holder" : "target";
}

export const baseOf = (n: NumT) => (typeof n === "number" ? n : (n.base ?? 0));
export const scalesOf = (n: NumT) => (typeof n === "number" ? [] : n.scale);
