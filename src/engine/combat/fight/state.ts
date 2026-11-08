/**
 * The fight's state: its data types, the world every part reads (`W`), the small shared helpers, a unit's stats
 * after its statuses, and the numbers in actions and statuses (scales, counts, boosts).
 */
import type { Content, Fight, Unit } from "../../run.js";
import type { Rng } from "../../rng.js";
import * as S from "../../../schema.js";
import type { Entry } from "../../log.js";
import { baseOf, basicSpeed, finalValue, rescale, role, sameSpeed, scalesOf, slotOf, speedOf, statDefault } from "../stats.js";
import { applyStatus, endStatus, forbids } from "./statuses.js";
import { actDef } from "./actions.js";
import { inSeat, passes, sideOf } from "./targeting.js";

// ─── State ──────────────────────────────────────────────────────────────────

/**
 * A status on a unit. `stacks` is the Intensity total in thousandths; `nums` the numbers fixed at application.
 * `peak`: an absorb's most stacks since it was applied, in thousandths, which its ending reports.
 */
export type SInst = { uid: number; id: string; src: string | null; at: number; end: number; stacks: number; nums: number[]; peak?: number };
/** An action a unit can take: its equipped abilities in slot order, then "basic". `ready` is when its cooldown ends. */
export type Act = { id: string; ready: number };

export type CUnit = Unit & {
  slot: number;
  mp: number;
  ko: boolean;
  /** Replaced (Split) or otherwise out of the fight for good: KO'd, and nothing can revive it. */
  gone?: boolean;
  rng: Rng;
  base: Record<string, number>;
  flat: Record<string, number>;
  pct: Record<string, number>;
  /** Statuses applied at fight start and again on revival: passive, gear, formation, perks, or an enemy's own. */
  start: string[];
  /** Ticks of cooldown each ability had left when the last fight ended (a party unit's; carried by the run or the rogue). */
  cooldowns?: Record<string, number>;
  /** Where the basic attack comes from: a gear id, "enemy:<id>", or "unarmed". */
  weapon: string;
  acts: Act[];
  /** The action started and not yet resolved, and when it resolves. */
  cast: { act: number; end: number } | null;
  /** When recovery ends. */
  busy: number;
  statuses: SInst[];
  /** Its seat, the id of its position in the party's formation. Enemies and summoned units sit in none. */
  seat?: string;
  /** Hidden control-resistance stacks, on an enemy of a rank ruleset.control lists. */
  ctrl?: number;
  /** One of its actions has resolved this fight. */
  acted?: boolean;
};

/**
 * What an event carries beyond its units, amount and tags, kept on the reaction that answers it
 * (a reaction's strike of a hit, the cooldown effect's `which: event`, a recast) and read by event filters.
 */
export type Carried = {
  /** Hits: the raw amount, after boosts, damage taken and crit, before Defense. */
  raw: number;
  /** Hits: the damage type. */
  dtype: S.InstanceT["type"] | null;
  /** action_resolve: the units on the other side its hits landed on, each once. */
  count: number;
  /** Action events: the action's id (an ability's, or "basic"). */
  ability: string | null;
  /** Action events: a recast's repeat. */
  repeat: boolean;
};
export const CARRIED_NONE: Carried = { raw: 0, dtype: null, count: 0, ability: null, repeat: false };

type ItemBase = { at: number; b: number; g: number; slot: number; seq: number; unit: string };
export type Item =
  | (ItemBase & { k: "act"; act: number })
  | (ItemBase & { k: "pulse"; uid: number })
  | (ItemBase & {
      k: "react";
      holder: string;
      status: string;
      /** The reaction's index, or -1 for an Intensity trigger's effects. */
      which: number;
      nums: number[];
      src: string | null;
      per: number;
      other: string | null;
      owner: string | null;
      amount: number;
      /** The actor is KO'd and reacting to its own KO. */
      dead: boolean;
    } & Carried)
  /** One control-resistance stack drains from `unit`. */
  | (ItemBase & { k: "drain" })
  /** A revive on a timer: `unit` stands at `at`, if it's still down and the fight goes on. */
  | (ItemBase & { k: "revive"; by: string; hp: number; ready: boolean });

export type CFight = Omit<Fight, "units"> & {
  units: CUnit[]; now: number; seq: number; queue: Item[]; moments: number; begun: boolean; seed: number;
  /** The dungeon's change to every foe (a fight's knob): applied to each enemy as it's made, summons included. */
  foes?: S.FoesT;
  /** The enrage has been announced (ruleset.enrage). */
  enraged?: boolean;
};

/** Not design rules: safety stops in case content makes a fight that can't end. Either counts as a loss. */
export const LIMITS = { ticks: 5000, moments: 200_000 };
export const NEVER = Number.MAX_SAFE_INTEGER;
export const SUBTICKS = S.SUBTICKS;

/** `after`: the fight_won reactions are resolving, so a knockout among them doesn't start them again. */
export type W = { f: CFight; c: Content; log?: (e: Entry) => void; depth: number; after?: boolean };
export const world = (c: Content, f: CFight, log?: (e: Entry) => void): W => ({ f, c, log, depth: 0 });

/** Which of these status fields any status in the content uses, so fights without them skip their checks. */
type Feats = { mods: boolean; crits: boolean; cover: boolean; floor: boolean; heals: boolean; revives: boolean };
const featCache = new WeakMap<Content, Feats>();
export function feats(c: Content): Feats {
  let x = featCache.get(c);
  if (!x) {
    const ss = [...c.statuses.values()];
    const any = (k: keyof S.StatusT) => ss.some((s) => s[k] !== undefined);
    x = { mods: any("mods"), crits: any("crits"), cover: any("cover"), floor: any("floor"), heals: any("heals"), revives: any("revives") };
    featCache.set(c, x);
  }
  return x;
}

export const def = (w: W, id: string) => w.c.statuses.get(id)!;
export const unit = (w: W, id: string | null) => (id ? (w.f.units.find((u) => u.id === id) ?? null) : null);
export const living = (w: W, side?: CUnit["side"]) => w.f.units.filter((u) => !u.ko && (!side || u.side === side));
export const foeSide = (u: CUnit) => (u.side === "party" ? "enemy" : "party");
export const batch = (side: CUnit["side"]) => (side === "party" ? 0 : 1);
export const stat = (w: W, u: CUnit, key: string) => u.stats[key] ?? statDefault(w.c, key);
export const total = (u: CUnit, status: string) => u.statuses.reduce((s, x) => (x.id === status ? s + x.stacks : s), 0);
export const isIntensity = (d: S.StatusT) => d.stacking === "intensity";
export const perOf = (d: S.StatusT, s: SInst) => (isIntensity(d) ? s.stacks / SUBTICKS : 1);
export const hidden = (w: W, x: CUnit) => stat(w, x, "forbidden") > 0;
export const taunting = (w: W, x: CUnit) => stat(w, x, "forced") > 0;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const letter = (n: number) => (n < LETTERS.length ? LETTERS[n] : String(n + 1));

export function push(w: W, it: Item) {
  const q = w.f.queue;
  let lo = 0, hi = q.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (before(q[mid], it)) lo = mid + 1;
    else hi = mid;
  }
  q.splice(lo, 0, it);
}
const before = (a: Item, b: Item) => (a.at - b.at || a.b - b.b || a.g - b.g || a.slot - b.slot || a.seq - b.seq) < 0;

// ─── Stats ──────────────────────────────────────────────────────────────────

/**
 * Every stat: base, plus static changes (gear, passive, formation, perks), plus statuses. A live stat change is
 * worked out in a second pass, from the holder's stats as they stand without it (given `w`, as a fight's refresh
 * gives it; without, only its fixed part counts); then a status that sets a stat has the last word.
 */
export function derive(c: Content, u: Pick<CUnit, "base" | "flat" | "pct">, statuses: readonly SInst[] = [], w?: W): Record<string, number> {
  let flat = u.flat, pct = u.pct;
  const live: { s: SInst; d: S.StatusT; ch: NonNullable<S.StatusT["stats"]>[number]; i: number }[] = [];
  for (const s of statuses) {
    const d = c.statuses.get(s.id)!;
    if (!d.stats) continue;
    if (flat === u.flat) (flat = { ...u.flat }), (pct = { ...u.pct });
    const per = perOf(d, s);
    for (const ch of d.stats) {
      const i = slotOf(d, ch);
      if (ch.live) {
        live.push({ s, d, ch, i });
        continue;
      }
      flat[ch.stat] = (flat[ch.stat] ?? 0) + s.nums[i] * per;
      pct[ch.stat] = (pct[ch.stat] ?? 0) + s.nums[i + 1] * per;
    }
  }
  let out = finals(c, u.base, flat, pct);
  if (live.length) {
    // The holder itself (a fight's unit, given `w`) is read with its stats as they stand without the live changes.
    const h = w ? (u as CUnit) : null;
    const saved = h?.stats;
    if (h) h.stats = out;
    const who: Who = (of) => (of === "holder" || of === "self" ? h : null);
    const read = (n: S.NumT | undefined) => (h && n !== undefined ? scalesOf(n).reduce((v, s) => (role(s, true) === "source" ? v : v + term(w!, s, h, 0, who)), 0) : 0);
    for (const { s, d, ch, i } of live) {
      const per = perOf(d, s);
      flat[ch.stat] = (flat[ch.stat] ?? 0) + (s.nums[i] + read(ch.flat)) * per;
      pct[ch.stat] = (pct[ch.stat] ?? 0) + (s.nums[i + 1] + read(ch.pct)) * per;
    }
    if (h) h.stats = saved!;
    out = finals(c, u.base, flat, pct);
  }
  for (const s of statuses) for (const x of c.statuses.get(s.id)!.set ?? []) out[x.stat] = x.value;
  return out;
}

function finals(c: Content, base: Record<string, number>, flat: Record<string, number>, pct: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  const one = (k: string) => {
    if (!(k in out)) out[k] = finalValue(c, k, base[k] ?? statDefault(c, k), flat[k] ?? 0, pct[k] ?? 0);
  };
  for (const d of c.pack.stats) one(d.id);
  for (const k in base) one(k);
  for (const k in flat) one(k);
  for (const k in pct) one(k);
  return out;
}

/** After any change to a unit's statuses: new stats, HP and MP follow their max, running timers rescale, and stats bring their statuses. */
export function refresh(w: W, u: CUnit) {
  const old = u.stats;
  const now = derive(w.c, u, u.statuses, w);
  u.stats = now;
  if (!u.ko) {
    const dh = now.max_hp - old.max_hp;
    u.hp = dh > 0 ? u.hp + dh : Math.min(u.hp, Math.max(1, now.max_hp));
    const dm = now.max_mp - old.max_mp;
    u.mp = dm > 0 ? u.mp + dm : Math.min(u.mp, now.max_mp);
    retime(w, u, old, now);
  }
  for (const sd of w.c.pack.stats) {
    if (!sd.brings) continue;
    const has = u.statuses.filter((s) => s.id === sd.brings);
    if ((now[sd.id] ?? 0) > 0 && !has.length && !u.ko) applyStatus(w, u, u, def(w, sd.brings), { stacks: 1, rng: u });
    else if ((now[sd.id] ?? 0) <= 0) for (const s of has) endStatus(w, u, s, "removed");
  }
  // Taunt ends Hidden. The moment a unit Taunts, every status that makes it unpickable ends, unremovable or not.
  if (!u.ko && taunting(w, u)) for (const s of u.statuses.slice()) if (forbids(def(w, s.id))) endStatus(w, u, s, "removed");
}

/** When a timing stat changes, every running timer it affects is rescaled: remaining × old speed ÷ new speed. */
function retime(w: W, u: CUnit, old: Record<string, number>, now: Record<string, number>) {
  const t = w.f.now;
  u.acts.forEach((a, i) => {
    if (a.ready <= t) return;
    const d = actDef(w, u, i);
    const [from, to] = d.kind === "basic"
      ? [basicSpeed(old.attack_speed, d.cooldown, d.recovery), basicSpeed(now.attack_speed, d.cooldown, d.recovery)]
      : [speedOf(old.cooldown_reduction), speedOf(now.cooldown_reduction)];
    if (!sameSpeed(from, to)) a.ready = t + rescale(a.ready - t, from, to);
  });
  const from = speedOf(old.cast_time_reduction), to = speedOf(now.cast_time_reduction);
  if (u.cast && u.cast.end > t && !sameSpeed(from, to)) {
    const i = w.f.queue.findIndex((it) => it.k === "act" && it.unit === u.id);
    const it = w.f.queue.splice(i, 1)[0];
    u.cast.end = it.at = t + rescale(u.cast.end - t, from, to);
    push(w, it);
  }
}

// ─── Numbers ────────────────────────────────────────────────────────────────

type OfT = NonNullable<S.ScaleT["of"]>;
/** Resolves a role name to a unit, in whatever context a number is read. */
type Who = (of: OfT) => CUnit | null;

/**
 * What an action's number can count beyond units' state: its targets, and the units on the other side
 * its hits have landed on so far (the action's Ctx keeps `landed`). Ctx fits this shape.
 */
type Reading = { targets: readonly CUnit[]; landed?: readonly CUnit[] };

/**
 * One term of a number: the source read from `u` (or the event amount), times a live stat if the scale says so, times the ratio.
 * A condition (`when`) is read against the reading unit (for `lower`): the acting unit, or a status's holder.
 */
function term(w: W, s: S.ScaleT, u: CUnit | null, amount: number, who: Who, act?: Reading): number {
  let v: number;
  if (s.amount) v = amount;
  else if (s.count === "targets") v = act?.targets.length ?? 0;
  else if (s.count === "hit") v = act?.landed?.length ?? 0;
  else if (!u) return 0;
  else if (s.stat) v = stat(w, u, s.stat);
  else if (s.hp) v = s.hp === "current" ? u.hp : u.stats.max_hp - u.hp;
  else if (s.stacks) v = total(u, s.stacks) / SUBTICKS;
  else if (s.count !== undefined) v = countOf(w, u, s.count);
  else v = passes(w, u, s.when!, who("self") ?? who("holder") ?? u) ? 1 : 0;
  if (s.times) {
    const t = s.times.of ? who(s.times.of) : u;
    if (!t) return 0;
    v *= stat(w, t, s.times.stat);
  }
  return v * s.ratio;
}

/** A unit's buffs or debuffs (markers never count), or the units on its side (or its foes') that pass a test. */
function countOf(w: W, u: CUnit, c: Exclude<NonNullable<S.ScaleT["count"]>, "targets" | "hit">): number {
  if (c === "buffs" || c === "debuffs") return u.statuses.filter((s) => def(w, s.id).label === c.slice(0, -1)).length;
  const seat = c.seat;
  return sideOf(w, u, c.side, c.where?.ko === true).filter((x) => (seat === undefined || inSeat(w, u, x, seat)) && (!c.where || passes(w, x, c.where, u))).length;
}

/** A number in an action: `self` is the acting unit, `target` the unit the effect lands on, `act` the action (for counts). */
export function aval(w: W, n: S.NumT, self: CUnit, target: CUnit | null, act?: Reading): number {
  const who: Who = (of) => (of === "target" ? target : of === "self" ? self : null);
  let v = baseOf(n);
  for (const s of scalesOf(n)) v += term(w, s, role(s, false) === "target" ? target : self, 0, who, act);
  return v;
}

/** At application: a status number's fixed part, from its source (and, for stat changes, its holder too). */
export function fixed(w: W, n: S.NumT, source: CUnit, holder: CUnit, isStat: boolean): number {
  const who: Who = (of) => (of === "source" ? source : of === "holder" ? holder : null);
  let v = baseOf(n);
  for (const s of scalesOf(n)) {
    const r = role(s, true);
    if (r === "source") v += term(w, s, source, 0, who);
    else if (isStat && r !== "amount") v += term(w, s, holder, 0, who);
  }
  return v;
}

type StatusNums = { d: S.StatusT; nums: number[]; holder: CUnit | null; actor: CUnit | null; amount: number };
/** At use: the fixed part, plus the holder's side read now. */
export function sval(w: W, x: StatusNums, owner: object, n: S.NumT, target: CUnit | null): number {
  const who: Who = (of) => (of === "holder" ? x.holder : of === "self" ? x.actor : of === "target" ? target : null);
  let v = x.nums[slotOf(x.d, owner)];
  for (const s of scalesOf(n)) {
    const r = role(s, true);
    if (r === "source") continue;
    v += term(w, s, r === "amount" ? null : who(r), x.amount, who);
  }
  return v;
}

/** The unit's boosts that match any of `tags`, added together. A boost can read the unit being hit. */
export function boostOf(w: W, u: CUnit, tags: readonly string[], target: CUnit | null): number {
  let b = 0;
  for (const s of u.statuses) {
    const d = def(w, s.id);
    if (!d.boosts) continue;
    for (const x of d.boosts) if (tags.includes(x.tag)) b += sval(w, { d, nums: s.nums, holder: u, actor: u, amount: 0 }, x, x.pct, target) * perOf(d, s);
  }
  return b;
}

export function takenOf(w: W, u: CUnit, tags: readonly string[]): number {
  let t = 0;
  for (const s of u.statuses) {
    const d = def(w, s.id);
    if (!d.taken) continue;
    for (const x of d.taken) if (!x.tag || tags.includes(x.tag)) t += sval(w, { d, nums: s.nums, holder: u, actor: u, amount: 0 }, x, x.pct, null) * perOf(d, s);
  }
  const { floor, cap } = w.c.pack.ruleset.taken;
  return Math.min(cap, Math.max(floor, t));
}
