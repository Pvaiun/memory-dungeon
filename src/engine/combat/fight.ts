/**
 * The fight: the core set's combat system (docs/core-set/rules-and-vocabulary.md),
 * on step 4's machinery (steps/04-combat-concepts/design.md), run on sub-ticks.
 * Section numbers in comments refer to step 4's design, whose finer rules
 * still stand where the core set is silent.
 *
 * A fight is plain data, so a run can be saved mid-fight. Each `step` plays one
 * moment, the next sub-tick on which anything happens, in this order:
 *   1. units that are ready start their first available action;
 *   2. everything due resolves one item at a time: the party batch, then the
 *      enemy batch; within a batch, pulses, then reactions, then actions, each
 *      in slot order, then in order of creation (section 2);
 *   3. statuses whose last sub-tick this is end (section 7.8).
 * A unit that becomes ready, or whose action becomes available, because of
 * something resolved in steps 2 or 3 starts on the next sub-tick.
 */
import * as S from "../../schema.js";
import type { Entry } from "../log.js";
import { next, rngFor, type Rng } from "../rng.js";
import type { Content, Fight, Unit } from "../run.js";
import {
  baseOf, basicSpeed, compile, finalValue, rescale, role, sameSpeed, scaled, scalesOf, slotOf, speedOf, statDefault, sub,
} from "./stats.js";

// ─── State ──────────────────────────────────────────────────────────────────

/** A status on a unit. `stacks` is the Intensity total in thousandths; `nums` the numbers fixed at application. */
export type SInst = { uid: number; id: string; src: string | null; at: number; end: number; stacks: number; nums: number[] };
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
  /** Where the basic attack comes from: a gear id, "enemy:<id>", or "unarmed". */
  weapon: string;
  acts: Act[];
  /** The action started and not yet resolved, and when it resolves. */
  cast: { act: number; end: number } | null;
  /** When recovery ends. */
  busy: number;
  statuses: SInst[];
};

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
      amount: number;
      /** The actor is KO'd and reacting to its own KO. */
      dead: boolean;
    });

export type CFight = Omit<Fight, "units"> & {
  units: CUnit[]; now: number; seq: number; queue: Item[]; moments: number; begun: boolean; seed: number;
  /** The dungeon's change to every foe (a campaign trial's): applied to each enemy as it's made, summons included. */
  foes?: S.FoesT;
};

/** Not design rules: safety stops in case content makes a fight that can't end. Either counts as a loss. */
export const LIMITS = { ticks: 5000, moments: 200_000 };
const NEVER = Number.MAX_SAFE_INTEGER;
const SUBTICKS = S.SUBTICKS;

type W = { f: CFight; c: Content; log?: (e: Entry) => void; depth: number };
export const world = (c: Content, f: CFight, log?: (e: Entry) => void): W => ({ f, c, log, depth: 0 });

const def = (w: W, id: string) => w.c.statuses.get(id)!;
const unit = (w: W, id: string | null) => (id ? (w.f.units.find((u) => u.id === id) ?? null) : null);
const living = (w: W, side?: CUnit["side"]) => w.f.units.filter((u) => !u.ko && (!side || u.side === side));
const foeSide = (u: CUnit) => (u.side === "party" ? "enemy" : "party");
const batch = (side: CUnit["side"]) => (side === "party" ? 0 : 1);
export const stat = (w: W, u: CUnit, key: string) => u.stats[key] ?? statDefault(w.c, key);
const total = (u: CUnit, status: string) => u.statuses.reduce((s, x) => (x.id === status ? s + x.stacks : s), 0);
const isIntensity = (d: S.StatusT) => d.stacking === "intensity";
const perOf = (d: S.StatusT, s: SInst) => (isIntensity(d) ? s.stacks / SUBTICKS : 1);
const hidden = (w: W, x: CUnit) => stat(w, x, "forbidden") > 0;
const taunting = (w: W, x: CUnit) => stat(w, x, "forced") > 0;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const letter = (n: number) => (n < LETTERS.length ? LETTERS[n] : String(n + 1));

function push(w: W, it: Item) {
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

// ─── Stats (section 4) ──────────────────────────────────────────────────────

/** Every stat: base, plus static changes (gear, passive, formation, perks), plus statuses. */
export function derive(c: Content, u: Pick<CUnit, "base" | "flat" | "pct">, statuses: readonly SInst[] = []): Record<string, number> {
  let flat = u.flat, pct = u.pct;
  for (const s of statuses) {
    const d = c.statuses.get(s.id)!;
    if (!d.stats) continue;
    if (flat === u.flat) (flat = { ...u.flat }), (pct = { ...u.pct });
    const per = perOf(d, s);
    for (const ch of d.stats) {
      const i = slotOf(d, ch);
      flat[ch.stat] = (flat[ch.stat] ?? 0) + s.nums[i] * per;
      pct[ch.stat] = (pct[ch.stat] ?? 0) + s.nums[i + 1] * per;
    }
  }
  const out: Record<string, number> = {};
  const one = (k: string) => {
    if (!(k in out)) out[k] = finalValue(c, k, u.base[k] ?? statDefault(c, k), flat[k] ?? 0, pct[k] ?? 0);
  };
  for (const d of c.pack.stats) one(d.id);
  for (const k in u.base) one(k);
  for (const k in flat) one(k);
  for (const k in pct) one(k);
  return out;
}

/** After any change to a unit's statuses: new stats, HP and MP follow their max, running timers rescale, and stats bring their statuses. */
function refresh(w: W, u: CUnit) {
  const old = u.stats;
  const now = derive(w.c, u, u.statuses);
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
}

/** When a timing stat changes, every running timer it affects is rescaled: remaining × old speed ÷ new speed (section 2). */
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

function resistTotal(w: W, u: CUnit, element: string) {
  const v = stat(w, u, "resist") + stat(w, u, `resist:${element}`);
  const d = w.c.stats.get("resist");
  return Math.min(d?.cap ?? v, Math.max(d?.floor ?? v, v));
}

// ─── Numbers ────────────────────────────────────────────────────────────────

type OfT = NonNullable<S.ScaleT["of"]>;
/** Resolves a role name to a unit, in whatever context a number is read. */
type Who = (of: OfT) => CUnit | null;

/** One term of a number: the source read from `u` (or the event amount), times a live stat if the scale says so, times the ratio. */
function term(w: W, s: S.ScaleT, u: CUnit | null, amount: number, who: Who): number {
  let v: number;
  if (s.amount) v = amount;
  else if (!u) return 0;
  else if (s.stat) v = stat(w, u, s.stat);
  else if (s.hp) v = s.hp === "current" ? u.hp : u.stats.max_hp - u.hp;
  else if (s.stacks) v = total(u, s.stacks) / SUBTICKS;
  else v = passes(w, u, s.when!) ? 1 : 0;
  if (s.times) {
    const t = s.times.of ? who(s.times.of) : u;
    if (!t) return 0;
    v *= stat(w, t, s.times.stat);
  }
  return v * s.ratio;
}

/** A number in an action: `self` is the acting unit, `target` the unit the effect lands on. */
function aval(w: W, n: S.NumT, self: CUnit, target: CUnit | null): number {
  const who: Who = (of) => (of === "target" ? target : of === "self" ? self : null);
  let v = baseOf(n);
  for (const s of scalesOf(n)) v += term(w, s, role(s, false) === "target" ? target : self, 0, who);
  return v;
}

/** At application: a status number's fixed part, from its source (and, for stat changes, its holder too). */
function fixed(w: W, n: S.NumT, source: CUnit, holder: CUnit, isStat: boolean): number {
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
function sval(w: W, x: StatusNums, owner: object, n: S.NumT, target: CUnit | null): number {
  const who: Who = (of) => (of === "holder" ? x.holder : of === "self" ? x.actor : of === "target" ? target : null);
  let v = x.nums[slotOf(x.d, owner)];
  for (const s of scalesOf(n)) {
    const r = role(s, true);
    if (r === "source") continue;
    v += term(w, s, r === "amount" ? null : who(r), x.amount, who);
  }
  return v;
}

/** The unit's boosts that match any of `tags`, added together (section 5). A boost can read the unit being hit. */
function boostOf(w: W, u: CUnit, tags: readonly string[], target: CUnit | null): number {
  let b = 0;
  for (const s of u.statuses) {
    const d = def(w, s.id);
    if (!d.boosts) continue;
    for (const x of d.boosts) if (tags.includes(x.tag)) b += sval(w, { d, nums: s.nums, holder: u, actor: u, amount: 0 }, x, x.pct, target) * perOf(d, s);
  }
  return b;
}

function takenOf(w: W, u: CUnit, tags: readonly string[]): number {
  let t = 0;
  for (const s of u.statuses) {
    const d = def(w, s.id);
    if (!d.taken) continue;
    for (const x of d.taken) if (!x.tag || tags.includes(x.tag)) t += sval(w, { d, nums: s.nums, holder: u, actor: u, amount: 0 }, x, x.pct, null) * perOf(d, s);
  }
  const { floor, cap } = w.c.pack.ruleset.taken;
  return Math.min(cap, Math.max(floor, t));
}

// ─── Actions (sections 2 and 3) ─────────────────────────────────────────────

type HitKind = "basic" | "ability" | "extra";
type ActDef = {
  id: string;
  kind: "basic" | "ability";
  name: string;
  mp: number;
  cast: number;
  cooldown: number;
  recovery: number;
  if: S.ConditionT | null;
  target: Target;
  seek: boolean;
  effects: S.EffectT[];
  tags: string[];
};
type Target = "foe" | "ally" | "self" | S.TargetRuleT;

const acts = new WeakMap<object, ActDef>();

export function weaponOf(c: Content, ref: string): S.WeaponT {
  if (ref === "unarmed") return c.pack.ruleset.unarmed;
  if (ref.startsWith("enemy:")) return c.enemies.get(ref.slice(6))!.weapon!;
  return c.gear.get(ref)!.weapon!;
}

/** A weapon with its kind's type, subtype or element and cooldown filled in, unless it states its own. */
export function resolveWeapon(c: Content, wp: S.WeaponT) {
  const k = wp.kind ? c.weaponKinds.get(wp.kind) : undefined;
  return {
    type: wp.type ?? k?.type ?? "physical",
    subtype: wp.subtype ?? k?.subtype,
    element: wp.element ?? k?.element,
    cooldown: wp.cooldown ?? k?.cooldown ?? 10,
  };
}

function actDef(w: W, u: CUnit, i: number): ActDef {
  const id = u.acts[i].id;
  const src: object = id === "basic" ? weaponOf(w.c, u.weapon) : w.c.abilities.get(id)!;
  let d = acts.get(src);
  if (d) return d;
  if (id === "basic") {
    const wp = src as S.WeaponT;
    const r = resolveWeapon(w.c, wp);
    const cooldown = sub(r.cooldown);
    const hit: S.EffectT = { op: "damage", type: r.type, subtype: r.subtype, element: r.element, amount: wp.amount, hits: wp.hits, riders: wp.riders, apply: wp.apply };
    d = {
      id, kind: "basic", name: "attack", mp: 0, cast: sub(wp.cast ?? 0), cooldown,
      recovery: wp.recovery !== undefined ? sub(wp.recovery) : Math.round(w.c.pack.ruleset.basicRecovery * cooldown),
      if: null, target: "foe", seek: false, effects: [hit], tags: actTags("basic", [hit]),
    };
  } else {
    const a = src as S.AbilityT;
    d = {
      id, kind: "ability", name: a.name, mp: a.mp ?? 0, cast: sub(a.cast ?? w.c.pack.ruleset.abilityCast), cooldown: sub(a.cooldown),
      recovery: sub(a.recovery ?? w.c.pack.ruleset.abilityRecovery), if: a.if ?? null, target: a.target ?? "foe", seek: a.seek ?? false, effects: a.do,
      tags: actTags("ability", a.do),
    };
  }
  acts.set(src, d);
  return d;
}

/** What a lockout or Seek can cover: the action's kind, and the type and subtype or element of each of its hits. */
function actTags(kind: string, effects: readonly S.EffectT[]): string[] {
  const out = [kind];
  for (const e of effects) if (e.op === "damage") out.push(e.type, (e.type === "physical" ? e.subtype : e.element) ?? e.type);
  return out;
}

const covers = (tag: string, d: ActDef) => tag === "all" || d.tags.includes(tag);
function lockedOut(w: W, u: CUnit, d: ActDef) {
  return u.statuses.some((s) => {
    const l = def(w, s.id).lockout;
    return l && covers(l.covers, d);
  });
}
/** Seek: the ability's own, or a status that gives it to the holder's actions of this kind (Hunter's eye). */
function seeks(w: W, u: CUnit, d: ActDef) {
  return d.seek || u.statuses.some((s) => {
    const k = def(w, s.id).seek;
    return k !== undefined && covers(k, d);
  });
}

/** Off cooldown, affordable, its condition holds, and no lockout covers it. */
function available(w: W, u: CUnit, i: number): boolean {
  if (u.acts[i].ready > w.f.now) return false;
  const d = actDef(w, u, i);
  return u.mp >= d.mp && (!d.if || holds(w, u, d.if)) && !lockedOut(w, u, d);
}

function start(w: W, u: CUnit, i: number) {
  const d = actDef(w, u, i);
  const t = scaled(d.cast, speedOf(stat(w, u, "cast_time_reduction")));
  u.cast = { act: i, end: w.f.now + t };
  push(w, { k: "act", at: u.cast.end, b: batch(u.side), g: 2, slot: u.slot, seq: w.f.seq++, unit: u.id, act: i });
  if (t > 0) w.log?.({ t: "cast", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, ends: u.cast.end });
  fire(w, ev("action_start", u, null, { kind: d.kind }));
}

function cooldownOf(w: W, u: CUnit, d: ActDef) {
  return d.kind === "basic"
    ? scaled(d.cooldown, basicSpeed(stat(w, u, "attack_speed"), d.cooldown, d.recovery))
    : scaled(d.cooldown, speedOf(stat(w, u, "cooldown_reduction")));
}

/** Targets are chosen, and MP is paid, when the action resolves (section 3). */
function resolve(w: W, u: CUnit, i: number) {
  const d = actDef(w, u, i);
  u.cast = null;
  const fail = (why: string) => w.log?.({ t: "fail", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, why });
  if (u.mp < d.mp) {
    // The core set's fizzle: nothing happens and no MP is spent, but the ability still goes on cooldown.
    fail("mp");
    u.acts[i].ready = w.f.now + cooldownOf(w, u, d);
    u.busy = w.f.now + d.recovery;
    return;
  }
  const targets = choose(w, u, d.target, seeks(w, u, d));
  // A stated rule that finds nobody when the action resolves: no MP spent and no cooldown (step 4's rule). Under
  // ruleset.lostCast "cooldown" the unit spends the action's recovery, so two Ghouls reaching for one corpse don't
  // loop, but a Purify whose Stun ended mid-cast isn't locked out for a whole cooldown.
  if (!targets.length) {
    fail("target");
    if (w.c.pack.ruleset.lostCast === "cooldown") u.busy = w.f.now + d.recovery;
    return;
  }
  if (d.mp) {
    u.mp -= d.mp;
    w.log?.({ t: "mp", vis: "hidden", at: w.f.now, target: u.id, amount: -d.mp, mp: u.mp });
  }
  w.log?.({ t: "act", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, kind: d.kind, targets: targets.map((x) => x.id) });
  u.acts[i].ready = w.f.now + cooldownOf(w, u, d);
  u.busy = w.f.now + d.recovery;
  const ctx: Ctx = { actor: u, kind: d.kind, targets, id: d.id, st: null, dead: false };
  for (const e of d.effects) {
    run(w, ctx, e);
    if (w.f.result || u.ko) return;
  }
  if (d.kind === "basic") strikes(w, u, d, targets);
  if (w.f.result || u.ko) return;
  fire(w, ev("action_resolve", u, null, { kind: d.kind }));
}

/** Extra strikes after a basic attack (Double strike, Arc): one more hit with the weapon's damage, of kind extra, which never chains. */
function strikes(w: W, u: CUnit, d: ActDef, targets: CUnit[]) {
  const e = d.effects[0] as S.DamageEffectT;
  for (const s of u.statuses.slice()) {
    const st = def(w, s.id);
    const k = st.strike;
    if (!k || !u.statuses.includes(s)) continue;
    if (w.f.result || u.ko) return;
    const chance = (k.chance ?? (k.scale ? 0 : 100)) + (k.scale ? stat(w, u, k.scale) : 0);
    if (chance < 100) {
      const roll = next(u.rng) * 100;
      w.log?.({ t: "roll", vis: "hidden", at: w.f.now, by: u.id, what: "strike", chance, roll });
      if (roll >= chance) continue;
    }
    const t = k.to === "target" ? targets[0] : byRule(w, u, k.to, { seek: true, main: false, targets })[0];
    if (!t || t.ko) continue;
    w.log?.({ t: "strike", vis: "player", at: w.f.now, by: u.id, status: st.id, name: st.name, target: t.id });
    hit(w, { actor: u, kind: "extra", targets: [t], id: d.id, st: null, dead: false }, t, e);
  }
}

// ─── Targeting (section 6, and the core set's Taunt and Hidden rules) and conditions (section 7.10) ──

function passes(w: W, x: CUnit, c: S.UnitCondT): boolean {
  if (c.ko !== undefined && x.ko !== c.ko) return false;
  if (c.hpBelow !== undefined && !(x.hp * 100 < c.hpBelow * x.stats.max_hp)) return false;
  if (c.hpAtLeast !== undefined && !(x.hp * 100 >= c.hpAtLeast * x.stats.max_hp)) return false;
  if (c.has !== undefined && !ids(c.has).every((id) => x.statuses.some((s) => s.id === id))) return false;
  if (c.lacks !== undefined && ids(c.lacks).some((id) => x.statuses.some((s) => s.id === id))) return false;
  if (c.buffs !== undefined && x.statuses.some((s) => def(w, s.id).label === "buff") !== c.buffs) return false;
  if (c.debuffs !== undefined && x.statuses.some((s) => def(w, s.id).label === "debuff") !== c.debuffs) return false;
  if (c.kind && !x.statuses.some((s) => hasKind(def(w, s.id), c.kind!.kind, c.kind!.tag))) return false;
  if (c.stacks && total(x, c.stacks.status) / SUBTICKS < c.stacks.atLeast) return false;
  if (c.atCap !== undefined && !atCap(w, x, c.atCap)) return false;
  if (c.belowCap !== undefined && atCap(w, x, c.belowCap)) return false;
  return true;
}

const ids = (x: string | string[]) => (Array.isArray(x) ? x : [x]);
const hasKind = (d: S.StatusT, kind: string, tag?: string) => compile(d).kinds.some(([k, t]) => k === kind && (tag === undefined || t === tag));

/** Holds this Intensity status at its cap (a Shield at its cap counts as already there for the Fizzle rule). */
function atCap(w: W, x: CUnit, id: string): boolean {
  const s = x.statuses.find((i) => i.id === id);
  if (!s) return false;
  const d = def(w, id);
  return isIntensity(d) && s.stacks >= capOf(w, d, s.nums, x);
}

/** The units a rule can see on a side: living ones, or, when the rule asks for `ko: true`, the knocked-out ones still in the fight. */
function sideOf(w: W, u: CUnit, side: S.TargetRuleT["side"], ko = false): CUnit[] {
  const present = (x: CUnit) => (ko ? x.ko && !x.gone : !x.ko);
  if (side === "self") return present(u) ? [u] : [];
  if (side === "foes") return w.f.units.filter((x) => x.side !== u.side && present(x));
  const own = w.f.units.filter((x) => x.side === u.side && present(x));
  return side === "others" ? own.filter((x) => x !== u) : own;
}

/** The foes a unit can pick: Hidden ones only when every foe is Hidden (the engine's fallback, so a fight never stalls). */
function visibleFoes(w: W, u: CUnit): CUnit[] {
  const all = sideOf(w, u, "foes");
  const seen = all.filter((x) => !hidden(w, x));
  return seen.length ? seen : all;
}

function holds(w: W, u: CUnit, c: S.ConditionT) {
  const ko = c.where.ko === true;
  const pool = c.side === "foes" && !ko ? visibleFoes(w, u) : sideOf(w, u, c.side, ko);
  return pool.filter((x) => passes(w, x, c.where)).length >= (c.atLeast ?? 1);
}

function value(w: W, x: CUnit, by: NonNullable<S.TargetRuleT["by"]>): number {
  if (by === "hp") return x.hp;
  if (by === "hp_share") return x.hp / x.stats.max_hp;
  if (by === "buffs" || by === "debuffs") return x.statuses.filter((s) => def(w, s.id).label === by.slice(0, -1)).length;
  if ("stat" in by) return stat(w, x, by.stat);
  if ("stats" in by) return Math.max(...by.stats.map((k) => stat(w, x, k)));
  return total(x, by.stacks) / SUBTICKS;
}

function weightedPick(w: W, u: CUnit, pool: CUnit[], what: string): CUnit {
  const weights = pool.map((x) => Math.max(0, stat(w, x, "aggro")));
  const sum = weights.reduce((a, b) => a + b, 0);
  const r = next(u.rng) * sum;
  w.log?.({ t: "roll", vis: "hidden", at: w.f.now, by: u.id, what, roll: r, of: sum });
  let acc = 0;
  for (let i = 0; i < pool.length; i++) if ((acc += weights[i]) > r) return pool[i];
  return pool[pool.length - 1];
}

function randomIndex(w: W, u: CUnit, n: number, what: string): number {
  const i = Math.floor(next(u.rng) * n);
  w.log?.({ t: "roll", vis: "hidden", at: w.f.now, by: u.id, what, roll: i, of: n });
  return i;
}
const randomPick = (w: W, u: CUnit, pool: CUnit[], what: string): CUnit => pool[randomIndex(w, u, pool.length, what)];

/** Default targeting: a foe weighted by Aggro, under the Hidden rule and, without Seek, the Taunt rule. */
function defaultFoe(w: W, u: CUnit, seek: boolean): CUnit[] {
  let pool = visibleFoes(w, u);
  if (!pool.length) return [];
  if (!seek) {
    const forced = pool.filter((x) => taunting(w, x));
    if (forced.length) pool = forced;
  }
  return [weightedPick(w, u, pool, "target")];
}

type PickOpts = {
  /** The action has Seek, or this isn't an action's first pick: the Taunt rule doesn't apply. */
  seek: boolean;
  /** An action's own target rule: the Taunt rule applies. */
  main: boolean;
  /** The action's chosen targets, for `exclude`. */
  targets: readonly CUnit[];
};

function byRule(w: W, u: CUnit, r: S.TargetRuleT, o: PickOpts): CUnit[] {
  const ko = r.where?.ko === true;
  // Hidden units can't be picked by any rule but `all`, unless every foe is Hidden.
  let pool = r.side === "foes" && !ko && r.pick !== "all" ? visibleFoes(w, u) : sideOf(w, u, r.side, ko);
  if (r.exclude === "targets") pool = pool.filter((x) => !o.targets.includes(x));
  if (r.where) {
    const kept = pool.filter((x) => passes(w, x, r.where!));
    pool = kept.length || r.ifNone !== "any" ? kept : pool;
  }
  let pick = r.pick ?? (r.side === "foes" ? "aggro" : "random");
  if (pick === "all") return pool;
  // The Taunt rule: an action's first pick, without Seek, can only go to a Taunting foe, whatever the phrase asks for.
  if (r.side === "foes" && o.main && !o.seek) {
    const forced = visibleFoes(w, u).filter((x) => taunting(w, x));
    if (forced.length) {
      pool = forced;
      if (pick === "random") pick = "aggro";
    }
  }
  const out: CUnit[] = [];
  for (let n = r.count ?? 1; n > 0 && pool.length; n--) {
    let x: CUnit;
    if (pick === "aggro") x = weightedPick(w, u, pool, "target");
    else if (pick === "random") x = randomPick(w, u, pool, "target");
    else {
      const vals = pool.map((p) => value(w, p, r.by!));
      const best = pick === "lowest" ? Math.min(...vals) : Math.max(...vals);
      const tied = pool.filter((_, i) => vals[i] === best);
      x = tied.length > 1 ? randomPick(w, u, tied, "tie") : tied[0];
    }
    out.push(x);
    pool = pool.filter((p) => p !== x);
  }
  return out;
}

function choose(w: W, u: CUnit, t: Target, seek: boolean): CUnit[] {
  if (t === "self") return u.ko ? [] : [u];
  if (t === "ally") {
    const own = living(w, u.side);
    return own.length ? [randomPick(w, u, own, "target")] : [];
  }
  if (t === "foe") return defaultFoe(w, u, seek);
  return byRule(w, u, t, { seek, main: true, targets: [] });
}

// ─── Effects ────────────────────────────────────────────────────────────────

/**
 * Who is acting and on whose behalf. An action: `kind` is set and its damage
 * effects are hits. A pulse, reaction or Intensity trigger: `st` is set, and
 * numbers come from the status instance's fixed part plus the holder's side.
 */
type Ctx = {
  actor: CUnit;
  kind: HitKind | null;
  targets: CUnit[];
  id: string;
  /** The actor is KO'd and reacting to its own KO (Volatile). */
  dead: boolean;
  st: null | {
    d: S.StatusT;
    nums: number[];
    holder: CUnit;
    src: string | null;
    per: number;
    other: CUnit | null;
    amount: number;
    /** A pulse or trigger: no unit's boosts reach it. A reaction reads its actor's boosts now. */
    fixedBoost: boolean;
  };
};

/** An effect's targets. Extra targets after an action's first ignore Taunt. Revive wants knocked-out units; everything else living ones. */
function targetsOf(w: W, ctx: Ctx, e: S.EffectT): CUnit[] {
  const st = ctx.st;
  const to = "to" in e ? e.to : undefined;
  const t = to ?? (st ? "holder" : "target");
  let out: (CUnit | null)[];
  if (t === "target") out = ctx.targets;
  else if (t === "self") out = [ctx.actor];
  else if (t === "holder") out = [st?.holder ?? null];
  else if (t === "source") out = [unit(w, st?.src ?? null)];
  else if (t === "other") out = [st?.other ?? null];
  else out = byRule(w, ctx.actor, t, { seek: true, main: false, targets: ctx.targets });
  const wantKo = e.op === "revive";
  return out.filter((x): x is CUnit => !!x && (wantKo ? x.ko && !x.gone : !x.ko));
}

/** An effect's number, in its context, for one target. Pulses and triggers scale with the Intensity total. */
function num(w: W, ctx: Ctx, owner: object, n: S.NumT, target: CUnit): number {
  const st = ctx.st;
  if (!st) return aval(w, n, ctx.actor, target);
  return sval(w, { d: st.d, nums: st.nums, holder: st.holder, actor: ctx.actor, amount: st.amount }, owner, n, target) * st.per;
}

function run(w: W, ctx: Ctx, e: S.EffectT) {
  if (e.op === "summon") {
    if (!w.f.result && (!ctx.actor.ko || ctx.dead)) summon(w, ctx.actor, ctx.actor.side, e.enemy, e.count ?? 1);
    return;
  }
  for (const t of targetsOf(w, ctx, e)) {
    if (w.f.result || (ctx.actor.ko && !ctx.dead)) return;
    if (t.ko !== (e.op === "revive")) continue;
    switch (e.op) {
      case "damage":
        if (ctx.kind) {
          for (let h = 0; h < (e.hits ?? 1) && !t.ko && !w.f.result; h++) hit(w, ctx, t, e);
        } else strike(w, ctx, t, e);
        break;
      case "heal":
        heal(w, ctx, t, num(w, ctx, e, e.amount, t));
        break;
      case "mp": {
        const v = Math.trunc(num(w, ctx, e, e.amount, t));
        t.mp = Math.min(t.stats.max_mp, Math.max(0, t.mp + v));
        w.log?.({ t: "mp", vis: "hidden", at: w.f.now, target: t.id, amount: v, mp: t.mp });
        break;
      }
      case "apply":
        applyStatus(w, ctx.actor, t, def(w, e.status), { stacks: num(w, ctx, e, e.stacks ?? 1, t), duration: e.duration, chance: e.chance, rng: ctx.actor });
        break;
      case "remove":
        remove(w, ctx.actor, t, e);
        break;
      case "revive":
        revive(w, ctx.actor, t, num(w, ctx, e, e.hp, t), e.ready ?? false);
        break;
      case "replace":
        replace(w, t, e.enemy, e.count ?? 1);
        break;
    }
  }
}

type Part = { type: S.InstanceT["type"]; subtype?: string; element?: string };
const partTags = (kind: string | null, p: Part, extra: readonly string[] = []) => {
  const out = kind ? [kind] : [];
  if (p.type !== "none") out.push(p.type);
  if (p.subtype) out.push(p.subtype);
  if (p.element) out.push(p.element);
  return [...out, ...extra];
};

/** The holder's statuses can change a magical instance's element or a physical instance's subtype (section 7.4). Newest wins. */
function convert(w: W, u: CUnit, p: Part): Part {
  let out = p;
  for (const s of u.statuses) {
    const cv = def(w, s.id).convert;
    if (!cv) continue;
    if (p.type === "magical" && cv.element) out = { ...out, element: cv.element };
    if (p.type === "physical" && cv.subtype) out = { ...out, subtype: cv.subtype };
  }
  return out;
}

/** Physical only: one roll per hit (or physical rider) on the attacker's dice. */
function evaded(w: W, a: CUnit, t: CUnit): boolean {
  const cap = w.c.stats.get("evasion")?.cap ?? 100;
  const chance = Math.min(cap, Math.max(0, stat(w, t, "evasion") - stat(w, a, "accuracy")));
  if (chance <= 0) return false;
  const roll = next(a.rng) * 100;
  w.log?.({ t: "roll", vis: "hidden", at: w.f.now, by: a.id, what: "evade", chance, roll });
  return roll < chance;
}

/** Returns the crit multiplier in percent, or 0. */
function critRoll(w: W, rng: CUnit, chance: number, multiplier: number): number {
  if (chance <= 0) return 0;
  if (chance < 100) {
    const roll = next(rng.rng) * 100;
    w.log?.({ t: "roll", vis: "hidden", at: w.f.now, by: rng.id, what: "crit", chance, roll });
    if (roll >= chance) return 0;
  }
  return multiplier;
}

type Calc = { amount: number; word: string | null; crit: boolean; heal: number };

/** Resolution order steps 2 to 6 (section 5): amount, boosts, damage-taken modifiers, crit, mitigation. Whole points, rounded down. */
function calc(w: W, t: CUnit, p: Part, raw: number, tags: readonly string[], boost: number, crit: number): Calc {
  let x = raw * (1 + boost / 100) * (1 + takenOf(w, t, tags) / 100);
  if (crit) x = (x * crit) / 100;
  let word: string | null = null;
  let heal = 0;
  if (p.type === "physical") {
    const y = Math.max(0, x - stat(w, t, "armor") * w.c.pack.ruleset.armorRatio);
    if (y <= 0 && x > 0) word = "BLOCKED";
    x = y;
  } else if (p.element) {
    const r = resistTotal(w, t, p.element);
    if (r > 100) {
      // Resistance past full is absorption: the damage heals instead.
      heal = Math.max(0, Math.floor((x * (r - 100)) / 100));
      x = 0;
      word = "ABSORB";
    } else if (r >= 100) (x = 0), (word = "IMMUNE");
    else {
      x = x * (1 - r / 100);
      word = r < 0 ? "WEAK" : r > 0 ? "RESIST" : null;
    }
  }
  x = Math.max(0, Math.floor(x));
  if (stat(w, t, "immune:damage") > 0) (x = 0), (heal = 0), (word = "IMMUNE");
  return { amount: x, word, crit: crit > 0, heal };
}

/** Steps 7 and 8: a block (Aegis) stops damage above its share outright; absorbs soak in the order they were first applied; the rest comes off HP. */
function take(w: W, t: CUnit, amount: number): { soaked: number; lost: number; blocked: boolean } {
  if (amount > 0) {
    for (const s of t.statuses) {
      const b = def(w, s.id).block;
      if (b && amount * 100 > b.share * t.stats.max_hp) {
        endStatus(w, t, s, "spent");
        return { soaked: 0, lost: 0, blocked: true };
      }
    }
  }
  let left = amount, soaked = 0;
  const broken: SInst[] = [];
  for (const s of t.statuses) {
    if (!left) break;
    if (!def(w, s.id).absorb) continue;
    const n = Math.min(left, Math.floor(s.stacks / SUBTICKS));
    s.stacks = Math.max(0, s.stacks - n * SUBTICKS);
    left -= n;
    soaked += n;
    if (s.stacks < SUBTICKS) broken.push(s);
  }
  const lost = Math.min(left, t.hp);
  t.hp -= lost;
  if (soaked && t.statuses.some((s) => def(w, s.id).absorb && def(w, s.id).stats)) refresh(w, t);
  for (const s of broken) endStatus(w, t, s, "stacks");
  return { soaked, lost, blocked: false };
}

const shield = (w: W, u: CUnit) => u.statuses.reduce((s, x) => (def(w, x.id).absorb ? s + Math.floor(x.stacks / SUBTICKS) : s), 0);

function logDamage(w: W, by: CUnit | null, t: CUnit, src: string, part: string, r: Calc, tk: { soaked: number; blocked: boolean }) {
  w.log?.({
    t: "dmg", vis: "player", at: w.f.now, by: by?.id ?? null, target: t.id, src, part,
    amount: tk.blocked ? 0 : r.amount, soaked: tk.soaked, word: tk.blocked ? "AEGIS" : r.word, crit: r.crit, hp: t.hp, shield: shield(w, t),
  });
}

/** An absorbed hit or pulse heals its target instead, unboosted, and applies nothing. */
function absorb(w: W, by: CUnit | null, t: CUnit, src: string, r: Calc) {
  const got = Math.min(r.heal, t.stats.max_hp - t.hp);
  t.hp += got;
  w.log?.({ t: "heal", vis: "player", at: w.f.now, by: by?.id ?? null, target: t.id, src, amount: got, crit: false, hp: t.hp, word: "ABSORB" });
  if (got > 0) fire(w, ev("healed", t, by, { amount: got }));
}

/** A hit from an action or an extra strike, with its riders and attached statuses (sections 5 and 7.2). */
function hit(w: W, ctx: Ctx, t: CUnit, e: S.DamageEffectT) {
  const a = ctx.actor, kind = ctx.kind!;
  const main = convert(w, a, e);
  const tags = partTags(kind, main);
  const parts: { p: Part; raw: number; rider: boolean }[] = [{ p: main, raw: aval(w, e.amount, a, t), rider: false }];
  for (const r of e.riders ?? []) parts.push({ p: convert(w, a, r), raw: aval(w, r.amount, a, t), rider: true });
  for (const s of a.statuses) {
    const d = def(w, s.id);
    for (const r of d.riders ?? []) {
      if (!tags.includes(r.on)) continue;
      const raw = sval(w, { d, nums: s.nums, holder: a, actor: a, amount: 0 }, r, r.add.amount, t) * perOf(d, s);
      parts.push({ p: convert(w, a, r.add), raw, rider: true });
    }
  }
  if (main.type === "physical" && evaded(w, a, t)) {
    w.log?.({ t: "dmg", vis: "player", at: w.f.now, by: a.id, target: t.id, src: ctx.id, part: "hit", amount: 0, soaked: 0, word: "MISS", crit: false, hp: t.hp, shield: shield(w, t) });
    fire(w, ev("hit_evaded", t, a, { kind, tags }));
    fire(w, ev("hit_missed", a, t, { kind, tags }));
    return;
  }
  // The hit and its riders read the same state, and share one crit roll.
  const crit = critRoll(w, a, stat(w, a, "crit_chance"), stat(w, a, "crit_multiplier"));
  const power = stat(w, a, "power");
  const results = parts.map(({ p, raw, rider }) =>
    rider && p.type === "physical" && evaded(w, a, t) ? null : calc(w, t, p, raw, partTags(kind, p), boostOf(w, a, partTags(kind, p), t) + power, crit),
  );
  let dealt = 0, lost = 0;
  for (let i = 0; i < parts.length && !t.ko; i++) {
    const r = results[i];
    const part = parts[i].rider ? "rider" : kind === "extra" ? "extra" : "hit";
    if (!r) {
      w.log?.({ t: "dmg", vis: "player", at: w.f.now, by: a.id, target: t.id, src: ctx.id, part, amount: 0, soaked: 0, word: "MISS", crit: false, hp: t.hp, shield: shield(w, t) });
      continue;
    }
    if (r.word === "ABSORB") {
      absorb(w, a, t, ctx.id, r);
      continue;
    }
    const tk = take(w, t, r.amount);
    logDamage(w, a, t, ctx.id, part, r, tk);
    if (!tk.blocked) dealt += r.amount;
    lost += tk.lost;
    if (t.hp <= 0) ko(w, t);
  }
  if (w.f.result) return;
  // An absorbed hit applies nothing and doesn't count as landing.
  if (results[0]?.word === "ABSORB") return;
  if (!t.ko) for (const ap of e.apply ?? []) applyStatus(w, a, t, def(w, ap.status), { stacks: aval(w, ap.stacks ?? 1, a, t), duration: ap.duration, chance: ap.chance, rng: a });
  fire(w, ev("hit_lands", a, t, { kind, tags, amount: dealt }));
  fire(w, ev("hit_taken", t, a, { kind, tags, amount: dealt }));
  damageEvents(w, a, t, dealt, lost, null);
}

function damageEvents(w: W, by: CUnit | null, t: CUnit, dealt: number, lost: number, status: string | null) {
  if (dealt > 0) {
    if (by) fire(w, ev("damage_dealt", by, t, { amount: dealt, status }));
    fire(w, ev("damage_taken", t, by, { amount: dealt, status }));
  }
  if (lost > 0) fire(w, ev("hp_lost", t, null, { amount: lost }));
}

/** Damage from a pulse, reaction or trigger: not a hit, so no hit events and no crit unless its status turns crits on (sections 7.5 and 8). */
function strike(w: W, ctx: Ctx, t: CUnit, e: S.DamageEffectT) {
  const st = ctx.st!;
  const d = st.d;
  const p: Part = { type: e.type, subtype: e.subtype ?? (e.type === "none" ? d.subtype : undefined), element: e.element ?? (e.type === "none" ? d.element : undefined) };
  const tags = partTags(null, p, compile(d).tags);
  const raw = num(w, ctx, e, e.amount, t);
  if (p.type === "physical" && evaded(w, ctx.actor, t)) {
    w.log?.({ t: "dmg", vis: "player", at: w.f.now, by: ctx.actor.id, target: t.id, src: d.id, part: "reaction", amount: 0, soaked: 0, word: "MISS", crit: false, hp: t.hp, shield: shield(w, t) });
    return;
  }
  let crit = 0;
  if (st.fixedBoost && d.crit) {
    const from = d.crit.fromSource ? unit(w, st.src) : null;
    crit = from
      ? critRoll(w, from, stat(w, from, "crit_chance"), stat(w, from, "crit_multiplier"))
      : critRoll(w, st.holder, d.crit.chance, d.crit.multiplier ?? stat(w, st.holder, "crit_multiplier"));
  }
  const r = calc(w, t, p, raw, tags, st.fixedBoost ? 0 : boostOf(w, ctx.actor, tags, t) + stat(w, ctx.actor, "power"), crit);
  const by = st.fixedBoost ? (d.perSource ? unit(w, st.src) : null) : ctx.actor;
  if (r.word === "ABSORB") return absorb(w, by, t, d.id, r);
  const tk = take(w, t, r.amount);
  logDamage(w, by, t, d.id, st.fixedBoost ? "pulse" : "reaction", r, tk);
  if (t.hp <= 0) ko(w, t);
  if (!w.f.result) damageEvents(w, by, t, tk.blocked ? 0 : r.amount, tk.lost, d.id);
}

/** Heals have no type and are never mitigated; they take healing boosts, Healing received, and crit from actions (section 5). */
function heal(w: W, ctx: Ctx, t: CUnit, raw: number) {
  const st = ctx.st;
  const boost = st ? (st.fixedBoost ? 0 : boostOf(w, ctx.actor, ["healing", ...compile(st.d).tags], t)) : boostOf(w, ctx.actor, ["healing"], t);
  let x = raw * (1 + boost / 100) * (1 + stat(w, t, "healing_received") / 100);
  let crit = 0;
  if (!st) crit = critRoll(w, ctx.actor, stat(w, ctx.actor, "crit_chance"), stat(w, ctx.actor, "crit_multiplier"));
  else if (st.fixedBoost && st.d.crit) crit = critRoll(w, st.holder, st.d.crit.chance, st.d.crit.multiplier ?? stat(w, st.holder, "crit_multiplier"));
  if (crit) x = (x * crit) / 100;
  const restored = Math.min(Math.max(0, Math.floor(x)), t.stats.max_hp - t.hp);
  t.hp += restored;
  w.log?.({ t: "heal", vis: "player", at: w.f.now, by: ctx.actor.id, target: t.id, src: ctx.id, amount: restored, crit: crit > 0, hp: t.hp });
  if (restored > 0) fire(w, ev("healed", t, ctx.actor, { amount: restored }));
}

// ─── Statuses (section 7) ───────────────────────────────────────────────────

function immune(w: W, u: CUnit, d: S.StatusT): boolean {
  const on = (k: string) => stat(w, u, k) > 0;
  const cp = compile(d);
  if (on(`immune:status:${d.id}`)) return true;
  if (d.label === "debuff" && on("immune:debuffs")) return true;
  if (cp.kinds.some(([k, tag]) => on(`immune:kind:${k}`) || (tag !== null && on(`immune:kind:${k}:${tag}`)))) return true;
  if (cp.harms && on("immune:damage")) return true;
  return !!d.element && resistTotal(w, u, d.element) >= 100;
}

type ApplyOpts = { stacks: number; duration?: number | "permanent"; chance?: number; rng: CUnit };

export function applyStatus(w: W, by: CUnit, to: CUnit, d: S.StatusT, o: ApplyOpts) {
  const f = w.f;
  if (to.ko || f.result) return;
  if (o.chance !== undefined && o.chance < 100) {
    const roll = next(o.rng.rng) * 100;
    w.log?.({ t: "roll", vis: "hidden", at: f.now, by: o.rng.id, what: "apply", status: d.id, chance: o.chance, roll });
    if (roll >= o.chance) return;
  }
  if (immune(w, to, d)) {
    w.log?.({ t: "immune", vis: "player", at: f.now, unit: to.id, status: d.id, name: d.name });
    return;
  }
  const dur = o.duration ?? d.duration ?? "permanent";
  if (dur === 0) {
    // An instant lockout only interrupts, and leaves no status (section 7.3).
    if (d.lockout?.interrupt) interrupt(w, to, d.lockout.covers);
    return;
  }
  const end = dur === "permanent" ? -1 : f.now + sub(dur);
  const cp = compile(d);
  const nums = cp.nums.map(({ n, stat: isStat }) => fixed(w, n, by, to, isStat));
  // Only the stacks an application adds can scale: from the applier's stated scaling, and its boosts that name
  // the status or one of its tags (section 7.5). The applier's boosts never reach the status's own numbers.
  const add = isIntensity(d) ? Math.floor(o.stacks * (1 + boostOf(w, by, [d.id, ...(d.tags ?? [])], null) / 100) * SUBTICKS) : 0;
  const cur = to.statuses.find((s) => s.id === d.id && (!d.perSource || s.src === by.id));
  if (cur) {
    if (d.stacking === "fizzle") return;
    if (d.stacking === "refresh") {
      // The new application replaces the old: its duration, its numbers and its source (section 7.6).
      cur.end = end;
      cur.nums = nums;
      cur.src = by.id;
    } else {
      cur.stacks = Math.min(capOf(w, d, cur.nums, to), cur.stacks + add);
      if (dur !== "permanent") cur.end = end;
    }
    gained(w, to, d, cur);
    return;
  }
  // An Intensity status exists only at 1 stack or more.
  if (isIntensity(d) && Math.min(add, capOf(w, d, nums, to)) < SUBTICKS) return;
  // A status with one applier at a time knows it; a shared Intensity total has no single source (section 7.6).
  const inst: SInst = { uid: f.seq++, id: d.id, src: d.perSource || !isIntensity(d) ? by.id : null, at: f.now, end, stacks: 0, nums };
  inst.stacks = isIntensity(d) ? Math.min(capOf(w, d, nums, to), add) : 0;
  to.statuses.push(inst);
  if (d.pulse) push(w, { k: "pulse", at: f.now + sub(d.pulse.every), b: pulseBatch(to, d), g: 0, slot: to.slot, seq: f.seq++, unit: to.id, uid: inst.uid });
  gained(w, to, d, inst);
}

function gained(w: W, to: CUnit, d: S.StatusT, s: SInst) {
  w.log?.({
    t: "status", vis: d.show === "icon" ? "player" : "hidden", at: w.f.now, unit: to.id, status: d.id, name: d.name,
    total: isIntensity(d) ? s.stacks / SUBTICKS : null, end: s.end,
  });
  if (d.stats) refresh(w, to);
  if (d.lockout?.interrupt) interrupt(w, to, d.lockout.covers);
  fire(w, ev("status_gained", to, null, { status: d.id }));
}

const capOf = (w: W, d: S.StatusT, nums: number[], holder: CUnit) =>
  compile(d).cap < 0 ? Number.MAX_SAFE_INTEGER : Math.floor(sval(w, { d, nums, holder, actor: holder, amount: 0 }, d, d.cap!, null) * SUBTICKS);

/** A debuff's pulse resolves in the batch of the holder's foes; a buff's in its own side's (section 7.5). */
const pulseBatch = (holder: CUnit, d: S.StatusT) => (d.label === "buff" ? batch(holder.side) : batch(foeSide(holder)));

function endStatus(w: W, u: CUnit, s: SInst, cause: S.CauseT) {
  const i = u.statuses.indexOf(s);
  if (i < 0) return;
  u.statuses.splice(i, 1);
  const d = def(w, s.id);
  w.log?.({ t: "status_end", vis: d.show === "icon" ? "player" : "hidden", at: w.f.now, unit: u.id, status: d.id, name: d.name, cause });
  // A stat that brings this status puts it straight back while the stat is above 0.
  if (d.stats || w.c.pack.stats.some((x) => x.brings === d.id)) refresh(w, u);
  fire(w, ev("status_ended", u, null, { status: d.id, cause, ending: s }));
}

/**
 * An interrupting lockout cancels a cast it covers, as if the unit were KO'd mid-cast: no MP spent, and by default
 * no cooldown (section 7.3); under ruleset.lostCast "cooldown" the action goes on cooldown.
 */
function interrupt(w: W, u: CUnit, lockout: string) {
  if (!u.cast) return;
  const d = actDef(w, u, u.cast.act);
  if (!covers(lockout, d)) return;
  w.f.queue = w.f.queue.filter((it) => !(it.k === "act" && it.unit === u.id));
  if (w.c.pack.ruleset.lostCast === "cooldown") u.acts[u.cast.act].ready = w.f.now + cooldownOf(w, u, d);
  u.cast = null;
  w.log?.({ t: "interrupt", vis: "player", at: w.f.now, unit: u.id, act: d.id, name: d.name });
  fire(w, ev("action_interrupted", u, null, { kind: d.kind }));
}

/** Removes buffs or debuffs, newest first or at random, skipping unremovable ones and a dispel-immune unit's buffs (section 7.9). */
function remove(w: W, by: CUnit, t: CUnit, e: Extract<S.EffectT, { op: "remove" }>) {
  if (e.label === "buff" && stat(w, t, "immune:dispel") > 0) {
    w.log?.({ t: "immune", vis: "player", at: w.f.now, unit: t.id, status: "dispel", name: "Dispel" });
    return;
  }
  let pool = t.statuses.filter((s) => {
    const d = def(w, s.id);
    return d.label === e.label && !d.unremovable && (!e.status || d.id === e.status) && (!e.kind || hasKind(d, e.kind, e.tag));
  });
  const hit: SInst[] = [];
  if ((e.order ?? "newest") === "newest") hit.push(...pool.sort((a, b) => b.uid - a.uid).slice(0, e.count ?? Number.MAX_SAFE_INTEGER));
  else {
    for (let n = e.count ?? pool.length; n > 0 && pool.length; n--) {
      const s = pool[randomIndex(w, by, pool.length, "remove")];
      hit.push(s);
      pool = pool.filter((x) => x !== s);
    }
  }
  for (const s of hit) endStatus(w, t, s, "removed");
}

/** On each trigger the total drops by a fraction (rounding down) or a count; the status ends below 1 stack (section 7.7, as decided Oct 20). */
function drop(w: W, u: CUnit, s: SInst, d: S.StatusT) {
  if (!d.drop) return;
  s.stacks = d.drop === "all" ? 0 : "fraction" in d.drop ? Math.floor(s.stacks * (1 - d.drop.fraction)) : Math.max(0, s.stacks - sub(d.drop.count));
  if (d.stats) refresh(w, u);
  if (s.stacks < SUBTICKS) endStatus(w, u, s, "stacks");
}

function pulse(w: W, it: Extract<Item, { k: "pulse" }>) {
  const h = unit(w, it.unit)!;
  const s = h.statuses.find((x) => x.uid === it.uid);
  if (!s) return;
  const d = def(w, s.id);
  const every = sub(d.pulse!.every);
  // Reapplying changes the end time, not the rhythm, so the next pulse is always queued; it's skipped if the status has gone.
  push(w, { ...it, at: it.at + every, seq: w.f.seq++ });
  const ctx: Ctx = {
    actor: h, kind: null, targets: [], id: d.id, dead: false,
    st: { d, nums: s.nums, holder: h, src: s.src, per: perOf(d, s), other: null, amount: 0, fixedBoost: true },
  };
  for (const e of d.pulse!.do ?? []) {
    run(w, ctx, e);
    if (w.f.result) return;
  }
  if (!h.statuses.includes(s)) return;
  fire(w, ev("status_triggered", h, null, { status: d.id }));
  if (isIntensity(d) && h.statuses.includes(s)) drop(w, h, s, d);
}

// ─── Events and reactions (sections 7.11 and 8) ─────────────────────────────

type Ev = {
  e: S.EventSpecT["event"];
  owner: CUnit;
  other: CUnit | null;
  kind: HitKind | null;
  /** Hit events: the hit's tags (kind, type, subtype or element). */
  tags: string[];
  /** Status events: the status. Damage events: the status whose pulse or reaction dealt it, if any. */
  status: string | null;
  cause: string | null;
  amount: number;
  /** The status that just ended, so its own reactions to its ending still run. */
  ending: SInst | null;
};

const ev = (e: Ev["e"], owner: CUnit, other: CUnit | null, x: Partial<Pick<Ev, "kind" | "tags" | "status" | "cause" | "amount" | "ending">> = {}): Ev => ({
  e, owner, other, kind: x.kind ?? null, tags: x.tags ?? [], status: x.status ?? null, cause: x.cause ?? null, amount: x.amount ?? 0, ending: x.ending ?? null,
});

function matches(spec: S.EventSpecT, e: Ev, holder: CUnit): boolean {
  if (spec.event !== e.e) return false;
  const whose = spec.whose ?? "holder";
  if (whose === "holder" && e.owner !== holder) return false;
  if (whose === "ally" && (e.owner === holder || e.owner.side !== holder.side)) return false;
  if (whose === "foe" && e.owner.side === holder.side) return false;
  if (spec.kind && spec.kind !== e.kind) return false;
  if (spec.tags && !spec.tags.some((t) => e.tags.includes(t))) return false;
  if (spec.status && spec.status !== e.status) return false;
  if (spec.cause && !spec.cause.includes(e.cause as never)) return false;
  return true;
}

/** The statuses that listen to each event, through their reactions or their Intensity trigger, by event. */
const listening = new WeakMap<Content, Map<string, Set<string>>>();
function listeners(w: W, event: string): Set<string> | undefined {
  let m = listening.get(w.c);
  if (!m) {
    m = new Map();
    for (const d of w.c.statuses.values()) {
      for (const on of [...(d.reactions ?? []).map((r) => r.on.event), ...(d.trigger ? [d.trigger.on.event] : [])]) {
        if (!m.has(on)) m.set(on, new Set());
        m.get(on)!.add(d.id);
      }
    }
    listening.set(w.c, m);
  }
  return m.get(event);
}

function fire(w: W, e: Ev) {
  if (w.f.result) return;
  if (w.depth > 64) {
    w.log?.({ t: "stop", vis: "hidden", at: w.f.now, why: `event chain too deep at ${e.e}` });
    return;
  }
  // Most events have no status anywhere in the content listening to them.
  const ids = listeners(w, e.e);
  if (!ids) return;
  w.depth++;
  for (const h of w.f.units.slice()) {
    const own = e.ending && h === e.owner;
    if (!own && !h.statuses.some((s) => ids.has(s.id))) continue;
    const list = own ? [...h.statuses, e.ending!] : h.statuses.slice();
    for (const s of list) {
      if (!ids.has(s.id)) continue;
      const d = def(w, s.id);
      if (d.trigger && s !== e.ending && h.statuses.includes(s) && matches(d.trigger.on, e, h)) trigger(w, h, s, d, e);
      d.reactions?.forEach((r, k) => {
        if (!matches(r.on, e, h)) return;
        const actor = unit(w, r.actor === "source" ? s.src : h.id);
        if (!actor) return;
        // A unit's own statuses that survive its KO can react to it (Volatile); otherwise KO'd units don't act.
        const dead = actor.ko && e.e === "ko" && actor === e.owner && actor === h;
        if (!actor.ko || dead) queueReaction(w, actor, h, s, d, k, 1, e, dead);
      });
      if (w.f.result) break;
    }
    if (w.f.result) break;
  }
  w.depth--;
}

/** An Intensity event trigger: its effects use the total from this moment and resolve next sub-tick; the drop is immediate (section 7.7). */
function trigger(w: W, h: CUnit, s: SInst, d: S.StatusT, e: Ev) {
  if (d.trigger!.do?.length && !h.ko) queueReaction(w, h, h, s, d, -1, s.stacks / SUBTICKS, e, false);
  fire(w, ev("status_triggered", h, null, { status: d.id }));
  if (h.statuses.includes(s)) drop(w, h, s, d);
}

/** A reaction resolves on the sub-tick after its event, in the acting unit's batch (section 8). */
function queueReaction(w: W, actor: CUnit, holder: CUnit, s: SInst, d: S.StatusT, which: number, per: number, e: Ev, dead: boolean) {
  push(w, {
    k: "react", at: w.f.now + 1, b: batch(actor.side), g: 1, slot: actor.slot, seq: w.f.seq++, unit: actor.id,
    holder: holder.id, status: d.id, which, nums: s.nums.slice(), src: s.src, per,
    other: e.other?.id ?? null, amount: e.amount, dead,
  });
}

function react(w: W, it: Extract<Item, { k: "react" }>) {
  const actor = unit(w, it.unit);
  if (!actor || (actor.ko && !it.dead)) return;
  const d = def(w, it.status);
  const effects = it.which < 0 ? d.trigger!.do! : d.reactions![it.which].do;
  const ctx: Ctx = {
    actor, kind: null, targets: [], id: d.id, dead: it.dead,
    st: { d, nums: it.nums, holder: unit(w, it.holder)!, src: it.src, per: it.per, other: unit(w, it.other), amount: it.amount, fixedBoost: it.which < 0 },
  };
  for (const e of effects) {
    run(w, ctx, e);
    if (w.f.result || (actor.ko && !it.dead)) return;
  }
}

// ─── KO, revival, leaving and joining (section 1, and the core set's revive and summoning) ──

/** Ends a unit's statuses as it leaves play, and the Per source statuses it gave that end with it. */
function strip(w: W, u: CUnit, all: boolean) {
  for (const s of u.statuses.slice()) if (all || !def(w, s.id).survivesKO) endStatus(w, u, s, "ko");
  for (const o of w.f.units) for (const s of o.statuses.slice()) if (s.src === u.id && def(w, s.id).perSource?.endsWithSource) endStatus(w, o, s, "ko");
}

function ko(w: W, u: CUnit) {
  if (u.ko) return;
  u.ko = true;
  u.hp = 0;
  u.cast = null;
  // It loses its action in progress, and anything it would resolve later.
  w.f.queue = w.f.queue.filter((it) => it.unit !== u.id);
  w.log?.({ t: "down", vis: "player", at: w.f.now, unit: u.id });
  if (!living(w, "enemy").length) w.f.result = "won";
  else if (!living(w, "party").length) w.f.result = "lost";
  if (w.f.result) return;
  strip(w, u, false);
  fire(w, ev("ko", u, null));
}

/** Raises a knocked-out unit: its fight-start statuses come back, and every action is on cooldown as at the start of a fight, unless `ready`. */
function revive(w: W, by: CUnit, t: CUnit, hp: number, ready: boolean) {
  if (!t.ko || t.gone) return;
  t.ko = false;
  t.cast = null;
  t.busy = w.f.now;
  t.hp = Math.min(t.stats.max_hp, Math.max(1, Math.floor(hp)));
  for (const id of t.start) applyStatus(w, t, t, def(w, id), { stacks: 1, rng: t });
  refresh(w, t);
  t.hp = Math.min(t.hp, t.stats.max_hp);
  t.acts.forEach((a, i) => (a.ready = ready ? w.f.now : w.f.now + cooldownOf(w, t, actDef(w, t, i))));
  w.log?.({ t: "revive", vis: "player", at: w.f.now, by: by.id, unit: t.id, hp: t.hp, ready });
  fire(w, ev("revived", t, by));
}

/** A unit for the enemy side, from an enemy definition: at fight start or when summoned. */
export function makeUnit(c: Content, f: Pick<CFight, "units" | "seed" | "stage" | "foes">, enemyId: string, side: CUnit["side"], lettered: boolean): CUnit {
  const e = c.enemies.get(enemyId)!;
  const n = f.units.filter((u) => u.side === side).length + 1;
  const same = f.units.filter((u) => u.ref === enemyId).length;
  const id = `${side === "enemy" ? "e" : "p"}${n}`;
  const foes = side === "enemy" ? f.foes : undefined;
  const m: Pick<CUnit, "base" | "flat" | "pct"> = { base: { ...e.stats }, flat: {}, pct: {} };
  if (foes?.power) m.flat.power = foes.power;
  if (foes?.hp) m.pct.max_hp = foes.hp;
  const stats = derive(c, m);
  return {
    id, ref: enemyId, name: lettered ? `${e.name} ${letter(same)}` : e.name, side, stats, hp: stats.max_hp, mp: stats.max_mp,
    slot: n - 1, ...m, start: [...(e.statuses ?? []), ...(foes?.statuses ?? [])], weapon: e.weapon ? `enemy:${enemyId}` : "unarmed",
    ko: false, rng: rngFor(f.seed, `fight:${f.stage}:${id}`),
    acts: [...(e.abilities ?? []).map((a) => ({ id: a, ready: 0 })), { id: "basic", ready: 0 }], cast: null, busy: 0, statuses: [],
  };
}

/** Brings new units into the fight on a side, up to the cap, with every action on cooldown. */
function summon(w: W, by: CUnit, side: CUnit["side"], enemyId: string, count: number) {
  const f = w.f;
  const lettered = f.units.filter((u) => u.ref === enemyId).length + count > 1;
  for (let n = 0; n < count; n++) {
    if (side === "enemy" && living(w, "enemy").length >= w.c.pack.ruleset.maxEnemies) {
      w.log?.({ t: "cap", vis: "hidden", at: f.now, by: by.id, enemy: enemyId });
      return;
    }
    const u = makeUnit(w.c, f, enemyId, side, lettered);
    f.units.push(u);
    for (const id of u.start) applyStatus(w, u, u, def(w, id), { stacks: 1, rng: u });
    refresh(w, u);
    u.acts.forEach((a, i) => (a.ready = f.now + cooldownOf(w, u, actDef(w, u, i))));
    w.log?.({ t: "join", vis: "player", at: f.now, by: by.id, unit: { id: u.id, ref: u.ref, name: u.name, side: u.side, hp: u.hp, max: u.stats.max_hp } });
  }
}

/** A unit leaves the fight without a knockout (Split) and `count` new units take its place. */
function replace(w: W, t: CUnit, enemyId: string, count: number) {
  if (t.ko) return;
  t.ko = true;
  t.gone = true;
  t.hp = 0;
  t.cast = null;
  w.f.queue = w.f.queue.filter((it) => it.unit !== t.id);
  w.log?.({ t: "leave", vis: "player", at: w.f.now, unit: t.id });
  strip(w, t, true);
  summon(w, t, t.side, enemyId, count);
  if (!living(w, "enemy").length) w.f.result = "won";
  else if (!living(w, "party").length) w.f.result = "lost";
}

// ─── The clock ──────────────────────────────────────────────────────────────

/** The next sub-tick on which anything can happen. */
export function nextTime(w: W): number {
  const f = w.f;
  let t = f.queue.length ? f.queue[0].at : NEVER;
  for (const u of f.units) {
    for (const s of u.statuses) if (s.end !== -1 && s.end < t) t = s.end;
    if (u.ko || u.cast) continue;
    if (u.busy > f.now) {
      t = Math.min(t, u.busy);
      continue;
    }
    if (u.acts.some((_, i) => available(w, u, i))) t = Math.min(t, f.now + 1);
    else for (const a of u.acts) if (a.ready > f.now) t = Math.min(t, a.ready);
  }
  return t;
}

/** Fight start: statuses from passives, gear, formations and perks; every action on cooldown as if it had just resolved. */
function begin(w: W) {
  const f = w.f;
  for (const u of f.units) {
    for (const id of u.start) applyStatus(w, u, u, def(w, id), { stacks: 1, rng: u });
    refresh(w, u);
  }
  for (const u of f.units) u.acts.forEach((a, i) => (a.ready = cooldownOf(w, u, actDef(w, u, i))));
  for (const u of f.units) if (!u.ko) fire(w, ev("fight_start", u, null));
  f.begun = true;
}

/** Play one moment. The first call sets the fight up. */
export function step(w: W) {
  const f = w.f;
  if (f.result) return;
  if (!f.begun) return begin(w);
  const t = nextTime(w);
  f.moments++;
  if (t === NEVER || t > LIMITS.ticks * SUBTICKS || f.moments > LIMITS.moments) {
    const why = t === NEVER ? "stalemate" : "timeout";
    w.log?.({ t: "stop", vis: "player", at: f.now, why });
    f.result = "lost";
    return;
  }
  f.now = t;
  for (const u of f.units) {
    if (u.ko || u.cast || u.busy > t) continue;
    const i = u.acts.findIndex((_, j) => available(w, u, j));
    if (i >= 0) start(w, u, i);
    if (f.result) return;
  }
  while (f.queue.length && f.queue[0].at === t && !f.result) {
    const it = f.queue.shift()!;
    if (it.k === "act") {
      const u = unit(w, it.unit)!;
      if (!u.ko) resolve(w, u, it.act);
    } else if (it.k === "pulse") pulse(w, it);
    else react(w, it);
  }
  if (!f.result) {
    for (const u of f.units) for (const s of u.statuses.slice()) if (s.end !== -1 && s.end <= t && !f.result) endStatus(w, u, s, "expired");
  }
  f.round = Math.ceil(t / SUBTICKS);
}
