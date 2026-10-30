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

/**
 * A status on a unit. `stacks` is the Intensity total in thousandths; `nums` the numbers fixed at application.
 * `peak` (step 5i, X1): an absorb's most stacks since it was applied, in thousandths, which its ending reports.
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
  /** Step 5g: ticks of cooldown each ability had left when the last fight ended (a party unit's; carried by the run or the rogue). */
  cooldowns?: Record<string, number>;
  /** Where the basic attack comes from: a gear id, "enemy:<id>", or "unarmed". */
  weapon: string;
  acts: Act[];
  /** The action started and not yet resolved, and when it resolves. */
  cast: { act: number; end: number } | null;
  /** When recovery ends. */
  busy: number;
  statuses: SInst[];
  /** Step 5i (X13): its seat, the id of its position in the party's formation. Enemies and summoned units sit in none. */
  seat?: string;
  /** Step 5i (X19): hidden control-resistance stacks, on an enemy of a rank ruleset.control lists. */
  ctrl?: number;
  /** Step 5i (X5): one of its actions has resolved this fight. */
  acted?: boolean;
};

/**
 * Step 5i (X29): what an event carries beyond its units, amount and tags, kept on the reaction that answers it
 * (X28's strike of a hit, X21's `which: event`, X39's recast) and read by X2's filters.
 */
export type Carried = {
  /** Hits: the raw amount, after boosts, damage taken and crit, before Armor or Magic resist. */
  raw: number;
  /** Hits: the damage type. */
  dtype: S.InstanceT["type"] | null;
  /** action_resolve: the units on the other side its hits landed on, each once. */
  count: number;
  /** Action events: the action's id (an ability's, or "basic"). */
  ability: string | null;
  /** Action events: a recast's repeat (X39). */
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
  /** Step 5i (X19): one control-resistance stack drains from `unit`. */
  | (ItemBase & { k: "drain" })
  /** Step 5i (X34): a revive on a timer: `unit` stands at `at`, if it's still down and the fight goes on. */
  | (ItemBase & { k: "revive"; by: string; hp: number; ready: boolean });

export type CFight = Omit<Fight, "units"> & {
  units: CUnit[]; now: number; seq: number; queue: Item[]; moments: number; begun: boolean; seed: number;
  /** The dungeon's change to every foe (a campaign trial's): applied to each enemy as it's made, summons included. */
  foes?: S.FoesT;
  /** The enrage has been announced (ruleset.enrage). */
  enraged?: boolean;
};

/** Not design rules: safety stops in case content makes a fight that can't end. Either counts as a loss. */
export const LIMITS = { ticks: 5000, moments: 200_000 };
const NEVER = Number.MAX_SAFE_INTEGER;
const SUBTICKS = S.SUBTICKS;

/** `after`: step 5i (X36): the fight_won reactions are resolving, so a knockout among them doesn't start them again. */
type W = { f: CFight; c: Content; log?: (e: Entry) => void; depth: number; after?: boolean };
export const world = (c: Content, f: CFight, log?: (e: Entry) => void): W => ({ f, c, log, depth: 0 });

/** Step 5i (share H): which of the new status fields any status in the content uses, so fights without them skip their checks. */
type Feats = { mods: boolean; crits: boolean; cover: boolean; floor: boolean; heals: boolean; revives: boolean };
const featCache = new WeakMap<Content, Feats>();
function feats(c: Content): Feats {
  let x = featCache.get(c);
  if (!x) {
    const ss = [...c.statuses.values()];
    const any = (k: keyof S.StatusT) => ss.some((s) => s[k] !== undefined);
    x = { mods: any("mods"), crits: any("crits"), cover: any("cover"), floor: any("floor"), heals: any("heals"), revives: any("revives") };
    featCache.set(c, x);
  }
  return x;
}

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

/**
 * Every stat: base, plus static changes (gear, passive, formation, perks), plus statuses. Step 5i: a live stat change
 * (X18) is worked out in a second pass, from the holder's stats as they stand without it (given `w`, as a fight's
 * refresh gives it; without, only its fixed part counts); then a status that sets a stat (X17) has the last word.
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
function refresh(w: W, u: CUnit) {
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
  // Step 5i (X15): Taunt ends Hidden. The moment a unit Taunts, every status that makes it unpickable ends, unremovable or not.
  if (!u.ko && taunting(w, u)) for (const s of u.statuses.slice()) if (forbids(def(w, s.id))) endStatus(w, u, s, "removed");
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

// ─── Numbers ────────────────────────────────────────────────────────────────

type OfT = NonNullable<S.ScaleT["of"]>;
/** Resolves a role name to a unit, in whatever context a number is read. */
type Who = (of: OfT) => CUnit | null;

/**
 * Step 5i (X8): what an action's number can count beyond units' state: its targets, and the units on the other side
 * its hits have landed on so far (the action's Ctx keeps `landed`, X29). Ctx fits this shape.
 */
type Reading = { targets: readonly CUnit[]; landed?: readonly CUnit[] };

/**
 * One term of a number: the source read from `u` (or the event amount), times a live stat if the scale says so, times the ratio.
 * A condition (`when`) is read against the reading unit (X4's `lower`): the acting unit, or a status's holder.
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

/** X8: a unit's buffs or debuffs (markers never count), or the units on its side (or its foes') that pass a test. */
function countOf(w: W, u: CUnit, c: Exclude<NonNullable<S.ScaleT["count"]>, "targets" | "hit">): number {
  if (c === "buffs" || c === "debuffs") return u.statuses.filter((s) => def(w, s.id).label === c.slice(0, -1)).length;
  const seat = c.seat;
  return sideOf(w, u, c.side, c.where?.ko === true).filter((x) => (seat === undefined || inSeat(w, u, x, seat)) && (!c.where || passes(w, x, c.where, u))).length;
}

/** A number in an action: `self` is the acting unit, `target` the unit the effect lands on, `act` the action (X8's counts). */
function aval(w: W, n: S.NumT, self: CUnit, target: CUnit | null, act?: Reading): number {
  const who: Who = (of) => (of === "target" ? target : of === "self" ? self : null);
  let v = baseOf(n);
  for (const s of scalesOf(n)) v += term(w, s, role(s, false) === "target" ? target : self, 0, who, act);
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
  if: S.ConditionT[] | null;
  /** Step 5i (X41): `if` holds when any one of its conditions does, not every one. */
  any: boolean;
  target: Target;
  seek: boolean;
  effects: S.EffectT[];
  tags: string[];
  /** Step 5i (X24): what its effects do, for ability changes by `does`: damage, heal, revive, and each status it applies. */
  does: ReadonlySet<string>;
};
const NOTHING: ReadonlySet<string> = new Set();
type Target = "foe" | "ally" | "self" | S.TargetRuleT;

const acts = new WeakMap<object, ActDef>();

export function weaponOf(c: Content, ref: string): S.WeaponT {
  if (ref === "unarmed") return c.pack.ruleset.unarmed;
  if (ref.startsWith("enemy:")) return c.enemies.get(ref.slice(6))!.weapon!;
  return c.gear.get(ref)!.weapon!;
}

/** A weapon with its kind's type, cooldown and hands filled in, unless it states its own. */
export function resolveWeapon(c: Content, wp: S.WeaponT) {
  const k = wp.kind ? c.weaponKinds.get(wp.kind) : undefined;
  return {
    type: wp.type ?? k?.type ?? "physical",
    cooldown: wp.cooldown ?? k?.cooldown ?? 10,
    hands: wp.hands ?? k?.hands ?? 1,
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
    const hit: S.EffectT = { op: "damage", type: r.type, amount: wp.amount, hits: wp.hits, riders: wp.riders, apply: wp.apply };
    d = {
      id, kind: "basic", name: "attack", mp: 0, cast: sub(wp.cast ?? 0), cooldown,
      recovery: wp.recovery !== undefined ? sub(wp.recovery) : Math.round(w.c.pack.ruleset.basicRecovery * cooldown),
      if: null, any: false, target: "foe", seek: false, effects: [hit], tags: actTags("basic", [hit]), does: NOTHING,
    };
  } else {
    const a = src as S.AbilityT;
    const cond = allOf(a.if);
    d = {
      id, kind: "ability", name: a.name, mp: a.mp ?? 0, cast: sub(a.cast ?? w.c.pack.ruleset.abilityCast), cooldown: sub(a.cooldown),
      recovery: sub(a.recovery ?? w.c.pack.ruleset.abilityRecovery), if: cond.list, any: cond.any, target: a.target ?? "foe", seek: a.seek ?? false, effects: a.do,
      tags: actTags("ability", a.do), does: doesOf(a.do),
    };
  }
  acts.set(src, d);
  return d;
}

/** An ability's `if`: conditions that must all hold, or (step 5i, X41: `{ any }`) at least one. */
function allOf(c: S.AbilityT["if"]): { list: S.ConditionT[] | null; any: boolean } {
  if (!c) return { list: null, any: false };
  if ("any" in c) return { list: c.any, any: true };
  return { list: [c].flat(), any: false };
}

/** X24: what an ability's effects do: "damage", "heal", "revive", and every status it applies (an apply, a hit's apply, a `one`). */
function doesOf(effects: readonly S.EffectT[]): Set<string> {
  const out = new Set<string>();
  for (const e of effects) {
    if (e.op === "damage") {
      out.add("damage");
      for (const ap of e.apply ?? []) out.add(ap.status);
    } else if (e.op === "heal" || e.op === "revive") out.add(e.op);
    else if (e.op === "apply") out.add(e.status);
    else if (e.op === "one") for (const ap of e.of) out.add(ap.status);
  }
  return out;
}

// ─── Ability changes (step 5i: build/engine-spec.md X22 to X24) ─────────────

/** An ability's changes from its unit's statuses, gathered for one use. Costs, stacks and heals add; the newest status's cast or target wins. */
type Mods = {
  mp: number;
  hp: NonNullable<S.AbilityModT["hp"]>[];
  cast: number | null;
  stacks: NonNullable<S.AbilityModT["stacks"]>[];
  heal: number;
  target: S.TargetRuleT | null;
  seek: boolean;
  wait: S.ConditionT[];
  apply: S.ApplyT[];
};

/** Which abilities a change reaches: absent, all; by id (each with its trained forms); by what they do. Both given: both must hold. */
const reaches = (of: S.AbilityFilterT | undefined, d: ActDef) =>
  !of || ((!of.ability || of.ability.includes(d.id) || of.ability.includes(S.formBase(d.id))) && (!of.does || of.does.some((x) => d.does.has(x))));

/**
 * The changes reaching this ability now, read each time it's checked, started, paid for or resolved (actDef stays cached).
 * A change whose `if` the unit fails doesn't apply. Statuses are in the order they were applied, so a later one is newer.
 * An Intensity status's changes don't grow with its stacks. Null for a basic attack, and when nothing reaches it.
 */
function modsOf(w: W, u: CUnit, d: ActDef): Mods | null {
  if (d.kind !== "ability" || !feats(w.c).mods) return null;
  let m: Mods | null = null;
  for (const s of u.statuses) {
    for (const x of def(w, s.id).mods ?? []) {
      if (!reaches(x.of, d) || (x.if && !passes(w, u, x.if, u))) continue;
      m ??= { mp: 0, hp: [], cast: null, stacks: [], heal: 0, target: null, seek: false, wait: [], apply: [] };
      if (x.mp) m.mp += x.mp;
      if (x.hp) m.hp.push(x.hp);
      if (x.cast !== undefined) m.cast = x.cast;
      if (x.stacks) m.stacks.push(x.stacks);
      if (x.heal) m.heal += x.heal;
      if (x.target) m.target = x.target;
      if (x.seek) m.seek = true;
      if (x.wait) m.wait.push(...[x.wait].flat());
      if (x.apply) m.apply.push(...x.apply);
    }
  }
  return m;
}

/** X22: the MP cost after its changes, which add up: −100 is free, and it never falls below 0. */
const mpCost = (d: ActDef, m: Mods | null) => (m?.mp ? Math.max(0, Math.floor((d.mp * (100 + m.mp)) / 100)) : d.mp);

/** X23: an HP price on top of the MP: pct % of its own MP cost (before MP changes), point for point, or as the same share of max HP. */
function hpPrice(u: CUnit, d: ActDef, m: Mods | null): number {
  if (!m?.hp.length) return 0;
  let p = 0;
  for (const h of m.hp) {
    const base = (d.mp * h.pct) / 100;
    p += h.share && u.stats.max_mp > 0 ? (base * u.stats.max_hp) / u.stats.max_mp : base;
  }
  return Math.floor(p);
}

/** X23's floor: the ability waits rather than leave its unit below the highest floor its HP prices set. */
function priceFits(u: CUnit, d: ActDef, m: Mods): boolean {
  const floor = m.hp.reduce((f, h) => Math.max(f, h.floor ?? 0), 0);
  return floor <= 0 || (u.hp - hpPrice(u, d, m)) * 100 >= floor * u.stats.max_hp;
}

/** X24: how many more stacks an application adds, from the ability's changes, on top of the applier's boosts. */
function stackMult(w: W, m: Mods | null | undefined, status: string): number {
  if (!m?.stacks.length) return 1;
  let p = 0;
  for (const s of m.stacks) if (s.statuses ? s.statuses.includes(status) : isIntensity(def(w, status))) p += s.pct;
  return 1 + p / 100;
}

/** What a lockout or Seek can cover: the action's kind, and the type of each of its hits. */
function actTags(kind: string, effects: readonly S.EffectT[]): string[] {
  const out = [kind];
  for (const e of effects) if (e.op === "damage") out.push(e.type);
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

/** Off cooldown, affordable, its condition holds, and no lockout covers it. Step 5i: its changes' cost, waits and HP floor too. */
function available(w: W, u: CUnit, i: number): boolean {
  if (u.acts[i].ready > w.f.now) return false;
  const d = actDef(w, u, i);
  const m = modsOf(w, u, d);
  if (u.mp < mpCost(d, m)) return false;
  // Step 5g: an ability may wait for several conditions at once (Blood gift: an ally hurt, and itself above the price). Step 5i (X41): or for any one.
  if (d.if && !(d.any ? d.if.some((cnd) => holds(w, u, cnd)) : d.if.every((cnd) => holds(w, u, cnd)))) return false;
  if (m && !(m.wait.every((cnd) => holds(w, u, cnd)) && priceFits(u, d, m))) return false;
  return !lockedOut(w, u, d);
}

function start(w: W, u: CUnit, i: number) {
  const d = actDef(w, u, i);
  // Step 5i (X24): a change can set its wind-up, before cast-time reduction.
  const cast = modsOf(w, u, d)?.cast;
  const t = scaled(cast != null ? sub(cast) : d.cast, speedOf(stat(w, u, "cast_time_reduction")));
  u.cast = { act: i, end: w.f.now + t };
  push(w, { k: "act", at: u.cast.end, b: batch(u.side), g: 2, slot: u.slot, seq: w.f.seq++, unit: u.id, act: i });
  if (t > 0) w.log?.({ t: "cast", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, ends: u.cast.end });
  fire(w, ev("action_start", u, null, { kind: d.kind, ability: d.id }));
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
  // Step 5i (X22 to X24): its changes, read as it resolves: the cost it pays, its target rule, Seek, and what its hits and heals carry.
  const m = modsOf(w, u, d);
  const mp = mpCost(d, m);
  if (u.mp < mp) {
    // The core set's fizzle: nothing happens and no MP is spent, but the ability still goes on cooldown.
    fail("mp");
    u.acts[i].ready = w.f.now + cooldownOf(w, u, d);
    u.busy = w.f.now + d.recovery;
    return;
  }
  const targets = choose(w, u, m?.target ?? d.target, !!m?.seek || seeks(w, u, d), d.kind);
  // A stated rule that finds nobody when the action resolves: no MP spent and no cooldown (step 4's rule). Under
  // ruleset.lostCast "cooldown" the unit spends the action's recovery, so two Ghouls reaching for one corpse don't
  // loop, but a Purify whose Stun ended mid-cast isn't locked out for a whole cooldown.
  if (!targets.length) {
    fail("target");
    if (w.c.pack.ruleset.lostCast === "cooldown") u.busy = w.f.now + d.recovery;
    return;
  }
  if (mp) {
    u.mp -= mp;
    w.log?.({ t: "mp", vis: "hidden", at: w.f.now, target: u.id, amount: -mp, mp: u.mp });
  }
  // X23: an HP price on top of the MP, paid with it.
  const price = hpPrice(u, d, m);
  if (price > 0) pay(w, u, price);
  w.log?.({ t: "act", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, kind: d.kind, targets: targets.map((x) => x.id) });
  u.acted = true;
  u.acts[i].ready = w.f.now + cooldownOf(w, u, d);
  u.busy = w.f.now + d.recovery;
  perform(w, u, d, targets, m, mp, false);
}

/** An action's effects, its extra strikes and its action_resolve: as it resolves, or again for a recast's repeat (X39). */
function perform(w: W, u: CUnit, d: ActDef, targets: CUnit[], m: Mods | null, paid: number, repeat: boolean) {
  const ctx: Ctx = { actor: u, kind: d.kind, targets, id: d.id, st: null, dead: false, landed: [], repeat, mod: m };
  for (const e of d.effects) {
    run(w, ctx, e);
    if (w.f.result || u.ko) return;
  }
  if (d.kind === "basic") strikes(w, u, d, targets, ctx);
  if (w.f.result || u.ko) return;
  // Step 5i (X29): what it did: the MP it paid, the units on the other side its hits landed on, which action, and whether it's a repeat.
  fire(w, ev("action_resolve", u, null, { kind: d.kind, amount: paid, count: ctx.landed!.length, ability: d.id, repeat }));
}

/**
 * Step 5i (X39): in a reaction to its holder's own action_resolve, the action that set it off resolves again at once:
 * no wind-up, no MP or HP price, its cooldown and recovery untouched, its targets chosen afresh by its own rule (its
 * changes included). The repeat fires its own action_resolve, marked as a repeat.
 */
function recast(w: W, ctx: Ctx) {
  const u = ctx.actor, id = ctx.st?.ability;
  if (!id || u.ko || w.f.result) return;
  const i = u.acts.findIndex((a) => a.id === id);
  if (i < 0) return;
  const d = actDef(w, u, i);
  const m = modsOf(w, u, d);
  const targets = choose(w, u, m?.target ?? d.target, !!m?.seek || seeks(w, u, d), d.kind);
  if (!targets.length) return void w.log?.({ t: "fail", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, why: "target" });
  w.log?.({ t: "act", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, kind: d.kind, targets: targets.map((x) => x.id), repeat: true });
  perform(w, u, d, targets, m, 0, true);
}

/** Whether a strike's chance comes up: at 100 or more it always does, without a roll. */
function strikeRoll(w: W, u: CUnit, chance: number): boolean {
  if (chance >= 100) return true;
  const roll = next(u.rng) * 100;
  w.log?.({ t: "roll", vis: "hidden", at: w.f.now, by: u.id, what: "strike", chance, roll });
  return roll < chance;
}

/**
 * Extra strikes after a basic attack (Double strike, Arc): one more hit with the weapon's damage, of kind extra, which never chains.
 * Step 5i: each strike deals `share` % of the weapon's damage (X26); a rule that picks several units strikes each, in its order, and
 * those strikes are `area` (X26); a `chain` rolls the chance again after each strike that lands, at most `times` more, each `share` %
 * of the one before (X27), in place of a plain strike reading the same stat. Their hits count among the action's landed units.
 */
function strikes(w: W, u: CUnit, d: ActDef, targets: CUnit[], ctx: Ctx) {
  const e = d.effects[0] as S.DamageEffectT;
  // A chained strike takes the place of a plain one that reads the same stat on the unit (Flurry wraps over Double strike),
  // so the swing rolls that chance once and chains from there.
  let chained: Set<string> | null = null;
  for (const s of u.statuses) {
    const k = def(w, s.id).strike;
    if (k?.chain && k.scale) (chained ??= new Set()).add(k.scale);
  }
  for (const s of u.statuses.slice()) {
    const st = def(w, s.id);
    const k = st.strike;
    if (!k || !u.statuses.includes(s)) continue;
    if (chained && !k.chain && k.scale && chained.has(k.scale)) continue;
    if (w.f.result || u.ko) return;
    const chance = (k.chance ?? (k.scale ? 0 : 100)) + (k.scale ? stat(w, u, k.scale) : 0);
    if (!strikeRoll(w, u, chance)) continue;
    const to = k.to === "target" ? targets.slice(0, 1) : byRule(w, u, k.to, { seek: true, main: false, targets });
    const area = to.length >= 2;
    for (const t of to) {
      let share = k.share ?? 100;
      for (let n = 0; !t.ko && !u.ko && !w.f.result; n++) {
        w.log?.({ t: "strike", vis: "player", at: w.f.now, by: u.id, status: st.id, name: st.name, target: t.id });
        const landed = hit(w, { actor: u, kind: "extra", targets: [t], id: d.id, st: null, dead: false, landed: ctx.landed }, t, e, { share, area });
        if (!landed || !k.chain || n >= k.chain.times || !strikeRoll(w, u, chance)) break;
        share = (share * k.chain.share) / 100;
      }
    }
  }
}

// ─── Targeting (section 6, and the core set's Taunt and Hidden rules) and conditions (section 7.10) ──

/** Whether `x` passes a test. `ref` is the reading unit (step 5i, X4's `lower`): the acting unit, a reaction's actor, a pulse's holder. */
function passes(w: W, x: CUnit, c: S.UnitCondT, ref?: CUnit | null): boolean {
  if (c.ko !== undefined && x.ko !== c.ko) return false;
  // Step 5i: has any of (X4), a stat lower than the reader's (X4), acted (X5), the top of its side (X6), wields a kind (X7).
  if (c.hasAny !== undefined && !c.hasAny.some((id) => x.statuses.some((s) => s.id === id))) return false;
  if (c.lower !== undefined && !(ref && stat(w, x, c.lower.stat) < stat(w, ref, c.lower.stat))) return false;
  if (c.acted !== undefined && !!x.acted !== c.acted) return false;
  if (c.top !== undefined && !onTop(w, x, c.top.stats)) return false;
  if (c.weapon !== undefined && !c.weapon.includes(weaponOf(w.c, x.weapon).kind ?? "")) return false;
  if (c.hpBelow !== undefined && !(x.hp * 100 < c.hpBelow * x.stats.max_hp)) return false;
  if (c.hpAtLeast !== undefined && !(x.hp * 100 >= c.hpAtLeast * x.stats.max_hp)) return false;
  // Step 5g: MP as a share of max MP (Clarity waits for an ally who needs it). A unit with no MP pool is never "below".
  if (c.mpBelow !== undefined && !(x.stats.max_mp > 0 && x.mp * 100 < c.mpBelow * x.stats.max_mp)) return false;
  if (c.mpAtLeast !== undefined && !(x.stats.max_mp <= 0 || x.mp * 100 >= c.mpAtLeast * x.stats.max_mp)) return false;
  if (c.has !== undefined && !ids(c.has).every((id) => x.statuses.some((s) => s.id === id))) return false;
  if (c.lacks !== undefined && ids(c.lacks).some((id) => x.statuses.some((s) => s.id === id))) return false;
  if (c.buffs !== undefined && x.statuses.some((s) => def(w, s.id).label === "buff") !== c.buffs) return false;
  if (c.debuffs !== undefined && x.statuses.some((s) => def(w, s.id).label === "debuff") !== c.debuffs) return false;
  if (c.kind && !x.statuses.some((s) => hasKind(def(w, s.id), c.kind!.kind, c.kind!.tag))) return false;
  if (c.stacks && total(x, c.stacks.status) / SUBTICKS < c.stacks.atLeast) return false;
  if (c.atCap !== undefined && !atCap(w, x, c.atCap)) return false;
  if (c.belowCap !== undefined && atCap(w, x, c.belowCap)) return false;
  if (c.casting !== undefined && (x.cast !== null) !== c.casting) return false;
  return true;
}

/** X6: no living unit on its side has more of the highest of these stats; ties pass. */
function onTop(w: W, x: CUnit, stats: readonly string[]): boolean {
  const best = (u: CUnit) => Math.max(...stats.map((k) => stat(w, u, k)));
  const v = best(x);
  return !w.f.units.some((u) => u.side === x.side && !u.ko && best(u) > v);
}

/**
 * X13: the seat a seat field names, read from `reader`'s place: a position id as written, or `next` / `previous`, the
 * seat after or before the reader's by slot order, wrapping round and skipping empty seats. Null: nobody (the reader
 * sits in no seat, or nobody else does).
 */
function seatId(w: W, reader: CUnit, seat: string): string | null {
  if (seat !== "next" && seat !== "previous") return seat;
  if (reader.seat === undefined) return null;
  const seats = w.f.units.filter((x) => x.side === reader.side && x.seat !== undefined && !x.gone).sort((a, b) => a.slot - b.slot);
  const i = seats.indexOf(reader);
  if (i < 0 || seats.length < 2) return null;
  return seats[(i + (seat === "next" ? 1 : seats.length - 1)) % seats.length].seat!;
}
const inSeat = (w: W, reader: CUnit, x: CUnit, seat: string) => {
  const id = seatId(w, reader, seat);
  return id !== null && x.seat === id;
};

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

/** At least `atLeast` units on the side pass (default 1, or 0 when `atMost` is given), and (step 5i) no more than `atMost`, in its seat if it names one. */
function holds(w: W, u: CUnit, c: S.ConditionT) {
  const ko = c.where.ko === true;
  let pool = c.side === "foes" && !ko ? visibleFoes(w, u) : sideOf(w, u, c.side, ko);
  if (c.seat !== undefined) pool = pool.filter((x) => inSeat(w, u, x, c.seat!));
  const n = pool.filter((x) => passes(w, x, c.where, u)).length;
  return n >= (c.atLeast ?? (c.atMost !== undefined ? 0 : 1)) && (c.atMost === undefined || n <= c.atMost);
}

function value(w: W, x: CUnit, by: NonNullable<S.TargetRuleT["by"]>): number {
  if (by === "hp") return x.hp;
  if (by === "hp_share") return x.stats.max_hp > 0 ? x.hp / x.stats.max_hp : 0;
  if (by === "mp_share") return x.stats.max_mp > 0 ? x.mp / x.stats.max_mp : 1;
  if (by === "buffs" || by === "debuffs") return x.statuses.filter((s) => def(w, s.id).label === by.slice(0, -1)).length;
  // Step 5i (X9): the basic attack's interval now, its cooldown after Attack speed: highest is the slowest.
  if (by === "swing") {
    const i = x.acts.findIndex((a) => a.id === "basic");
    return i < 0 ? 0 : cooldownOf(w, x, actDef(w, x, i));
  }
  if ("stat" in by) return stat(w, x, by.stat);
  if ("stats" in by) return Math.max(...by.stats.map((k) => stat(w, x, k)));
  return total(x, by.stacks) / SUBTICKS;
}

/** A unit's draw: how strongly it pulls a foe's pick (ruleset.draw), from its Aggro. Without the curve, Aggro itself. */
export function drawOf(r: Pick<S.ContentPack["ruleset"], "draw">, aggro: number): number {
  const c = r.draw;
  if (!c) return Math.max(0, aggro);
  const d = Math.abs(aggro - c.centre);
  return aggro >= c.centre ? (c.centre * (c.k + c.max * d)) / (c.k + d) : (c.centre * (c.k + d)) / (c.k + c.max * d);
}

function weightedPick(w: W, u: CUnit, pool: CUnit[], what: string): CUnit {
  const weights = pool.map((x) => drawOf(w.c.pack.ruleset, stat(w, x, "aggro")));
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
  /** Step 5i (X10), reactions: the event's other unit and the unit it's about, for `exclude`. */
  other?: CUnit | null;
  owner?: CUnit | null;
};

function byRule(w: W, u: CUnit, r: S.TargetRuleT, o: PickOpts): CUnit[] {
  const ko = r.where?.ko === true;
  // Hidden units can't be picked by any rule but `all`, unless every foe is Hidden.
  let pool = r.side === "foes" && !ko && r.pick !== "all" ? visibleFoes(w, u) : sideOf(w, u, r.side, ko);
  if (r.exclude === "targets") pool = pool.filter((x) => !o.targets.includes(x));
  // Step 5i: skip the event's other unit or owner (X10); only the unit in a seat (X13).
  else if (r.exclude === "other") pool = pool.filter((x) => x !== o.other);
  else if (r.exclude === "owner") pool = pool.filter((x) => x !== o.owner);
  if (r.seat !== undefined) pool = pool.filter((x) => inSeat(w, u, x, r.seat!));
  if (r.where) {
    const kept = pool.filter((x) => passes(w, x, r.where!, u));
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

/** An action's targets as it resolves. `kind` (step 5i): a basic attack picks in the order `basicPick` gives. */
function choose(w: W, u: CUnit, t: Target, seek: boolean, kind?: ActDef["kind"]): CUnit[] {
  if (t === "self") return u.ko ? [] : [u];
  if (t === "ally") {
    const own = living(w, u.side);
    return own.length ? [randomPick(w, u, own, "target")] : [];
  }
  if (t === "foe") return kind === "basic" ? basicPick(w, u, seek) : defaultFoe(w, u, seek);
  return byRule(w, u, t, { seek, main: true, targets: [] });
}

/**
 * Step 5i (X11, X12): a basic attack picks, in order, by an aim the attacker holds that comes first; a foe holding a
 * focus (Marked); by its other aims; then the default. A step that finds nobody passes to the next. An aim's rule is an
 * action's own (the Taunt rule applies, unless the attack has Seek), and an all-pick hits every unit it finds.
 */
function basicPick(w: W, u: CUnit, seek: boolean): CUnit[] {
  const aims = u.statuses.flatMap((s) => def(w, s.id).aim ?? []);
  const aimed = (first: boolean) => {
    for (const a of aims) {
      const out = !!a.first === first ? byRule(w, u, a.rule, { seek, main: true, targets: [] }) : [];
      if (out.length) return out;
    }
    return null;
  };
  return aimed(true) ?? focused(w, u, seek) ?? aimed(false) ?? defaultFoe(w, u, seek);
}

/** X11: a foe holding a focus status that can be picked, by draw among several; a Taunting foe still takes the pick unless the attack has Seek. */
function focused(w: W, u: CUnit, seek: boolean): CUnit[] | null {
  const seen = visibleFoes(w, u);
  let pool = seen.filter((x) => x.statuses.some((s) => def(w, s.id).focus));
  if (!pool.length) return null;
  if (!seek) {
    const forced = seen.filter((x) => taunting(w, x));
    if (forced.length) {
      const both = forced.filter((x) => pool.includes(x));
      pool = both.length ? both : forced;
    }
  }
  return [weightedPick(w, u, pool, "target")];
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
  /** Step 5i (X29): an action's units on the other side its hits have landed on so far, each once (`count: hit` reads it). */
  landed?: CUnit[];
  /** Step 5i (X39): a recast's repeat. */
  repeat?: boolean;
  /** Step 5i (X22 to X24): an ability's changes, as read when it resolved. */
  mod?: Mods | null;
  st: null | {
    d: S.StatusT;
    nums: number[];
    holder: CUnit;
    src: string | null;
    per: number;
    other: CUnit | null;
    /** Reactions: the unit the event is about (step 5g: the holder of a status that just reached its cap). */
    owner: CUnit | null;
    amount: number;
    /** A pulse or trigger: no unit's boosts reach it. A reaction reads its actor's boosts now. */
    fixedBoost: boolean;
  } & Partial<Carried>;
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
  else if (t === "owner") out = [st?.owner ?? null];
  else out = byRule(w, ctx.actor, t, { seek: true, main: false, targets: ctx.targets, other: st?.other ?? null, owner: st?.owner ?? null });
  const wantKo = e.op === "revive";
  return out.filter((x): x is CUnit => !!x && (wantKo ? x.ko && !x.gone : !x.ko));
}

/** An effect's number, in its context, for one target. Pulses and triggers scale with the Intensity total. */
function num(w: W, ctx: Ctx, owner: object, n: S.NumT, target: CUnit): number {
  const st = ctx.st;
  if (!st) return aval(w, n, ctx.actor, target, ctx);
  return sval(w, { d: st.d, nums: st.nums, holder: st.holder, actor: ctx.actor, amount: st.amount }, owner, n, target) * st.per;
}

function run(w: W, ctx: Ctx, e: S.EffectT) {
  if (e.op === "summon") {
    if (!w.f.result && (!ctx.actor.ko || ctx.dead)) summon(w, ctx.actor, ctx.actor.side, e.enemy, e.count ?? 1);
    return;
  }
  if (e.op === "recast") return recast(w, ctx);
  const ts = targetsOf(w, ctx, e);
  // Step 5i (X29): a damage effect aimed at two or more units at once makes `area` hits.
  const area = ts.length >= 2;
  for (const t of ts) {
    if (w.f.result || (ctx.actor.ko && !ctx.dead)) return;
    if (t.ko !== (e.op === "revive")) continue;
    switch (e.op) {
      case "damage":
        if (ctx.kind) {
          for (let h = 0; h < (e.hits ?? 1) && !t.ko && !w.f.result; h++) hit(w, ctx, t, e, { area });
        } else strike(w, ctx, t, e);
        break;
      case "heal":
        heal(w, ctx, t, num(w, ctx, e, e.amount, t));
        break;
      case "mp": {
        const v = Math.trunc(num(w, ctx, e, e.amount, t));
        t.mp = Math.min(t.stats.max_mp, Math.max(0, t.mp + v));
        // Log only (step 5h round 6): who gave it, from what, and whether a status's pulse (regen, Clarity) or an action or reaction.
        w.log?.({ t: "mp", vis: "hidden", at: w.f.now, target: t.id, amount: v, mp: t.mp, by: ctx.actor.id, src: ctx.id, part: ctx.st ? (ctx.st.fixedBoost ? "pulse" : "reaction") : "action" });
        break;
      }
      case "apply":
        // Step 5i (X24): an ability's changes can add stacks to its applications.
        applyStatus(w, ctx.actor, t, def(w, e.status), { stacks: num(w, ctx, e, e.stacks ?? 1, t) * stackMult(w, ctx.mod, e.status), duration: e.duration, chance: e.chance, rng: ctx.actor });
        break;
      case "remove":
        remove(w, ctx.actor, t, e);
        break;
      case "revive": {
        // Step 5i (X35): the reviver's own rule wins over the effect's ready and HP; (X34) `after` stands the unit up later.
        const rule = reviverRule(w, ctx.actor, t);
        const hp = rule.hp ?? num(w, ctx, e, e.hp, t);
        const ready = rule.ready ?? e.ready ?? false;
        if (e.after) later(w, ctx.actor, t, hp, ready, e.after);
        else revive(w, ctx.actor, t, hp, ready);
        break;
      }
      case "replace":
        replace(w, t, e.enemy, e.count ?? 1);
        break;
      case "cooldown":
        cooldowns(w, ctx, t, e);
        break;
      case "pay":
        pay(w, t, num(w, ctx, e, e.hp, t));
        break;
      case "strike":
        reactionStrike(w, ctx, t, e, area);
        break;
      case "one": {
        // Step 5i (X38): one of these statuses, picked at random on the actor's dice, for each target.
        const ap = e.of[randomIndex(w, ctx.actor, e.of.length, "one")];
        applyStatus(w, ctx.actor, t, def(w, ap.status), { stacks: num(w, ctx, ap, ap.stacks ?? 1, t) * stackMult(w, ctx.mod, ap.status), duration: ap.duration, chance: ap.chance, rng: ctx.actor });
        break;
      }
    }
  }
}

/**
 * Step 5i (X21): changes the cooldown left on a unit's basic attack or abilities. `longest` and `soonest` pick among the
 * abilities still cooling down (ties: slot order); `event` is the action behind the reaction's event; by id, each with its
 * trained forms. A wind-up under way carries on, and ready still needs MP and conditions. The basic attack's full cooldown is its swing.
 */
function cooldowns(w: W, ctx: Ctx, t: CUnit, e: Extract<S.EffectT, { op: "cooldown" }>) {
  const now = w.f.now;
  const left = (i: number) => Math.max(0, t.acts[i].ready - now);
  const all = t.acts.map((_, i) => i);
  const abilities = all.filter((i) => t.acts[i].id !== "basic");
  const which = e.which;
  let pick: number[];
  if (which === "basic") pick = all.filter((i) => t.acts[i].id === "basic");
  else if (which === "abilities") pick = abilities;
  else if (which === "longest" || which === "soonest") {
    let best = -1;
    for (const i of abilities) if (left(i) > 0 && (best < 0 || (which === "longest" ? left(i) > left(best) : left(i) < left(best)))) best = i;
    pick = best < 0 ? [] : [best];
  } else if (which === "event") pick = all.filter((i) => !!ctx.st?.ability && t.acts[i].id === ctx.st.ability);
  else pick = abilities.filter((i) => which.ability.includes(t.acts[i].id) || which.ability.includes(S.formBase(t.acts[i].id)));
  const set = e.set;
  for (const i of pick) {
    const full = cooldownOf(w, t, actDef(w, t, i));
    const l = left(i);
    const rest = set === "ready" ? 0
      : set === "full" ? full
      : "less" in set ? Math.max(0, l - sub(set.less))
      : "times" in set ? Math.floor((l * set.times) / 100)
      : Math.min(l, Math.floor((full * set.atMost) / 100));
    t.acts[i].ready = now + rest;
    w.log?.({ t: "cooldown", vis: "hidden", at: now, by: ctx.actor.id, unit: t.id, act: t.acts[i].id, left: rest });
  }
}

/** Step 5i (X23, G12): HP as a price: lost at once, but not damage, so no Shield soaks it, no Armor cuts it and nothing reacts. Never below 1 HP. */
function pay(w: W, t: CUnit, amount: number) {
  const v = Math.min(Math.floor(amount), t.hp - 1);
  if (v <= 0 || t.ko) return;
  t.hp -= v;
  w.log?.({ t: "pay", vis: "player", at: w.f.now, unit: t.id, amount: v, hp: t.hp });
}

/**
 * Step 5i (X28), reactions only: a hit of kind extra by the actor, sized `share` % of its basic attack's damage against the
 * target (`of: weapon`, the weapon's riders and statuses with it, as an extra strike's), or of the raw amount of the hit that
 * set the reaction off, in that hit's damage type, with nothing of that hit's (`of: hit`). It can crit and be dodged, meets
 * Armor or Magic resist and fires hit events; it never brings extra strikes. A fallen actor strikes nothing.
 */
function reactionStrike(w: W, ctx: Ctx, t: CUnit, e: Extract<S.EffectT, { op: "strike" }>, area: boolean) {
  const st = ctx.st, a = ctx.actor;
  if (!st || a.ko) return;
  let eff: S.DamageEffectT | null = null;
  if ((e.of ?? "weapon") === "weapon") eff = actDef(w, a, a.acts.findIndex((x) => x.id === "basic")).effects[0] as S.DamageEffectT;
  else if (st.raw && st.dtype && st.dtype !== "none") eff = { op: "damage", type: st.dtype, amount: st.raw };
  if (eff) hit(w, { actor: a, kind: "extra", targets: [t], id: ctx.id, st: null, dead: false, landed: [] }, t, eff, { share: e.share, area });
}

/** Step 5i (X35): the reviver's rule over every revive it makes: `ready` false wins over true; the newest rule's HP. */
function reviverRule(w: W, by: CUnit, t: CUnit): { ready?: boolean; hp?: number } {
  if (!feats(w.c).revives) return {};
  let ready: boolean | undefined, hp: number | undefined;
  for (const s of by.statuses) {
    const d = def(w, s.id), r = d.revives;
    if (!r) continue;
    if (r.ready !== undefined) ready = ready === false ? false : r.ready;
    if (r.hp !== undefined) hp = sval(w, { d, nums: s.nums, holder: by, actor: by, amount: 0 }, r, r.hp, t);
  }
  return { ready, hp };
}

/** Step 5i (X34): a revive on a timer. The unit stands `after` ticks from now, if it's still down and the fight goes on; the reviver needn't stand. */
function later(w: W, by: CUnit, t: CUnit, hp: number, ready: boolean, after: number) {
  const at = w.f.now + sub(after);
  push(w, { k: "revive", at, b: batch(t.side), g: 1, slot: t.slot, seq: w.f.seq++, unit: t.id, by: by.id, hp: Math.floor(hp), ready });
  w.log?.({ t: "revive_later", vis: "hidden", at: w.f.now, by: by.id, unit: t.id, stands: at });
}

type Part = { type: S.InstanceT["type"] };
const partTags = (kind: string | null, p: Part, extra: readonly string[] = []) => {
  const out = kind ? [kind] : [];
  if (p.type !== "none") out.push(p.type);
  return [...out, ...extra];
};

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

type Calc = { amount: number; word: string | null; crit: boolean; raw: number };

/** Resolution order steps 2 to 6 (section 5): amount, boosts, damage-taken modifiers, crit, mitigation. Whole points, rounded down. */
function calc(w: W, t: CUnit, p: Part, raw: number, tags: readonly string[], boost: number, crit: number): Calc {
  let x = raw * (1 + boost / 100) * (1 + takenOf(w, t, tags) / 100);
  if (crit) x = (x * crit) / 100;
  // The amount before Armor or Magic resist, for the log only: what mitigation took off.
  const preMit = x;
  let word: string | null = null;
  if (p.type === "physical") {
    const k = w.c.pack.ruleset.armorK;
    const armor = stat(w, t, "armor");
    // ruleset.armorK: the Path of Exile formula, hit² ÷ (hit + k × Armor): nearly linear against big hits, and it never
    // blanks a small one. Otherwise a flat armorRatio × Armor, which ruleset.armorFloor keeps above a share of the hit.
    const y = k
      ? (x > 0 && armor > 0 ? (x * x) / (x + k * armor) : x)
      : Math.max((x * (w.c.pack.ruleset.armorFloor ?? 0)) / 100, x - armor * w.c.pack.ruleset.armorRatio);
    if (y <= 0 && x > 0) word = "BLOCKED";
    x = y;
  } else if (p.type === "magical") {
    // Step 5j: one Magic resist for every magical hit and pulse, a percentage (its stat's floor and cap hold it between 0 and full).
    const r = stat(w, t, "magic_resist");
    if (r >= 100) (x = 0), (word = "IMMUNE");
    else if (r > 0) (x = x * (1 - r / 100)), (word = "RESIST");
  }
  const raw0 = Math.max(0, Math.floor(preMit));
  x = Math.max(0, Math.floor(x));
  if (stat(w, t, "immune:damage") > 0) (x = 0), (word = "IMMUNE");
  return { amount: x, word, crit: crit > 0, raw: raw0 };
}

/**
 * Steps 7 and 8: a block (Aegis) stops damage above its share outright; absorbs soak in the order they were first applied; the rest comes off HP.
 * Step 5i: `by` is the unit whose damage this is, for the statuses it ends (X1); an HP floor holds a blow that would knock the unit out (X31).
 */
function take(w: W, t: CUnit, amount: number, by: CUnit | null = null): { soaked: number; lost: number; blocked: boolean } {
  if (amount > 0) {
    for (const s of t.statuses) {
      const b = def(w, s.id).block;
      if (b && amount * 100 > b.share * t.stats.max_hp) {
        endStatus(w, t, s, "spent", { other: by, amount });
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
  let lost = Math.min(left, t.hp);
  // X31: while it holds an HP floor, a blow that would knock it out leaves it at 1, and nothing falls. A floor that spends
  // ends (cause spent) with the blow it held; one that doesn't is used first.
  let held: SInst | null = null, stopped = 0;
  if (lost > 0 && lost >= t.hp && feats(w.c).floor) {
    const fl = floorOf(w, t);
    if (fl) {
      stopped = lost - (t.hp - 1);
      lost = t.hp - 1;
      if (def(w, fl.id).floor!.spend) held = fl;
    }
  }
  t.hp -= lost;
  if (soaked && t.statuses.some((s) => def(w, s.id).absorb && def(w, s.id).stats)) refresh(w, t);
  for (const s of broken) endStatus(w, t, s, "stacks", { other: by });
  if (held) endStatus(w, t, held, "spent", { other: by, amount: stopped });
  return { soaked, lost, blocked: false };
}

/** X31: the floor that holds a blow: one that never spends, else the oldest that does. */
function floorOf(w: W, t: CUnit): SInst | null {
  let spending: SInst | null = null;
  for (const s of t.statuses) {
    const fl = def(w, s.id).floor;
    if (!fl) continue;
    if (!fl.spend) return s;
    spending ??= s;
  }
  return spending;
}

const shield = (w: W, u: CUnit) => u.statuses.reduce((s, x) => (def(w, x.id).absorb ? s + Math.floor(x.stacks / SUBTICKS) : s), 0);

/** What a piece of damage was, for the log: "physical", "magical" or "untyped". */
const dmgKind = (p: Part) => (p.type === "none" ? "untyped" : p.type);
function logDamage(w: W, by: CUnit | null, t: CUnit, src: string, part: string, r: Calc, tk: { soaked: number; blocked: boolean }, from?: string | null, kind?: string) {
  w.log?.({
    t: "dmg", vis: "player", at: w.f.now, by: by?.id ?? null, target: t.id, src, part, ...(from ? { from } : {}), ...(kind ? { kind } : {}),
    amount: tk.blocked ? 0 : r.amount, raw: r.raw, soaked: tk.soaked, word: tk.blocked ? "AEGIS" : r.word, crit: r.crit, hp: t.hp, shield: shield(w, t),
  });
}

/** Step 5i: how a hit is sized and aimed. `share`: percent of its own damage (X26 to X28, default 100); `area`: its effect is aimed at two or more units (X29); `moved`: a cover already took it (X30). */
type HitOpts = { share?: number; area?: boolean; moved?: boolean };
const AREA = ["area"], NONE: string[] = [];

/**
 * A hit from an action or an extra strike, with its riders and attached statuses (sections 5 and 7.2). Returns whether it
 * landed (wasn't evaded). Step 5i: crits by condition (X25); a cover takes a big hit for an ally (X30); the hit's raw amount
 * and type ride on its events (X29); an ability's changes add statuses and stacks (X24).
 */
function hit(w: W, ctx: Ctx, t0: CUnit, e: S.DamageEffectT, o: HitOpts = {}): boolean {
  const a = ctx.actor, kind = ctx.kind!;
  const f = o.share === undefined || o.share === 100 ? 1 : o.share / 100;
  const extra = o.area ? AREA : NONE;
  const main: Part = { type: e.type };
  const tags = partTags(kind, main, extra);
  const partsOn = (x: CUnit) => {
    const ps: { p: Part; raw: number; rider: boolean }[] = [{ p: main, raw: aval(w, e.amount, a, x, ctx) * f, rider: false }];
    for (const r of e.riders ?? []) ps.push({ p: { type: r.type }, raw: aval(w, r.amount, a, x, ctx) * f, rider: true });
    for (const s of a.statuses) {
      const d = def(w, s.id);
      for (const r of d.riders ?? []) {
        if (!tags.includes(r.on)) continue;
        const raw = sval(w, { d, nums: s.nums, holder: a, actor: a, amount: 0 }, r, r.add.amount, x) * perOf(d, s);
        ps.push({ p: { type: r.add.type }, raw, rider: true });
      }
    }
    return ps;
  };
  let t = t0;
  let parts = partsOn(t);
  if (main.type === "physical" && evaded(w, a, t)) {
    w.log?.({ t: "dmg", vis: "player", at: w.f.now, by: a.id, target: t.id, src: ctx.id, part: "hit", amount: 0, soaked: 0, word: "MISS", crit: false, hp: t.hp, shield: shield(w, t) });
    fire(w, ev("hit_evaded", t, a, { kind, tags }));
    fire(w, ev("hit_missed", a, t, { kind, tags }));
    return false;
  }
  // The hit and its riders read the same state, and share one crit roll.
  const [chance, multiplier] = critOf(w, a, t, tags);
  const crit = critRoll(w, a, chance, multiplier);
  const power = stat(w, a, "power") + enrage(w);
  const resultsOn = (x: CUnit, ps: typeof parts, dodge: boolean) => ps.map(({ p, raw, rider }) =>
    rider && dodge && p.type === "physical" && evaded(w, a, x) ? null : calc(w, x, p, raw, partTags(kind, p, extra), boostOf(w, a, partTags(kind, p, extra), x) + power, crit),
  );
  let results = resultsOn(t, parts, true);
  // X30: a big hit on an ally moves, once, to a unit that covers it, and resolves again against that unit (its own mitigation, block,
  // absorbs and HP; the hit's riders and statuses with it), keeping its crit and without a second dodge.
  if (!o.moved && feats(w.c).cover) {
    const c = coverOf(w, t, results);
    if (c) {
      w.log?.({ t: "cover", vis: "player", at: w.f.now, by: c.id, unit: t.id });
      t = c;
      parts = partsOn(c);
      results = resultsOn(c, parts, false);
    }
  }
  if (ctx.landed && t.side !== a.side && !ctx.landed.includes(t)) ctx.landed.push(t);
  let dealt = 0, lost = 0;
  for (let i = 0; i < parts.length && !t.ko; i++) {
    const r = results[i];
    const part = parts[i].rider ? "rider" : kind === "extra" ? "extra" : "hit";
    if (!r) {
      w.log?.({ t: "dmg", vis: "player", at: w.f.now, by: a.id, target: t.id, src: ctx.id, part, amount: 0, soaked: 0, word: "MISS", crit: false, hp: t.hp, shield: shield(w, t) });
      continue;
    }
    const tk = take(w, t, r.amount, a);
    logDamage(w, a, t, ctx.id, part, r, tk, null, dmgKind(parts[i].p));
    if (!tk.blocked) dealt += r.amount;
    lost += tk.lost;
    if (t.hp <= 0) ko(w, t, a, kind);
  }
  if (w.f.result) return true;
  // The hit's events carry "crit" when it crits, for reactions to crits (the Assassin's). Step 5i: and its raw amount and type (X28).
  const evTags = crit ? [...tags, "crit"] : tags;
  const raw = results[0]?.raw ?? 0;
  fire(w, ev("hit_lands", a, t, { kind, tags: evTags, amount: dealt, raw, dtype: main.type }));
  fire(w, ev("hit_taken", t, a, { kind, tags: evTags, amount: dealt, raw, dtype: main.type }));
  damageEvents(w, a, t, dealt, lost, null);
  // The hit's statuses land after its events, so a status set off by being hit (Bleed) waits for the next hit.
  // Step 5i (X24): an ability's changes add statuses after its own, and stacks to each.
  if (!t.ko && !w.f.result) {
    for (const ap of [...(e.apply ?? []), ...(ctx.mod?.apply ?? [])]) {
      applyStatus(w, a, t, def(w, ap.status), { stacks: aval(w, ap.stacks ?? 1, a, t, ctx) * stackMult(w, ctx.mod, ap.status), duration: ap.duration, chance: ap.chance, rng: a });
    }
  }
  return true;
}

/**
 * Step 5i (X25): a hit's crit chance and multiplier. The attacker's crit rules that match the hit's tags and the unit hit
 * add their chance after every stat change (100 always crits), and make the crit bonus, the part above ×1, `bonus` % larger.
 */
function critOf(w: W, a: CUnit, t: CUnit, tags: readonly string[]): [number, number] {
  let chance = stat(w, a, "crit_chance");
  const mult = stat(w, a, "crit_multiplier");
  if (!feats(w.c).crits) return [chance, mult];
  let bonus = 0;
  for (const s of a.statuses) {
    for (const r of def(w, s.id).crits ?? []) {
      if ((r.tag && !tags.includes(r.tag)) || (r.when && !passes(w, t, r.when, a))) continue;
      chance += r.chance ?? 0;
      bonus += r.bonus ?? 0;
    }
  }
  return [chance, bonus ? 100 + ((mult - 100) * (100 + bonus)) / 100 : mult];
}

/**
 * Step 5i (X30): the first other living unit on the hit unit's side, in slot order, whose cover this hit exceeds: more than
 * its share of the hit unit's max HP, after mitigation and before block and absorbs.
 */
function coverOf(w: W, t: CUnit, results: readonly (Calc | null)[]): CUnit | null {
  const dealt = results.reduce((s, r) => s + (r?.amount ?? 0), 0);
  if (dealt <= 0) return null;
  for (const x of w.f.units) {
    if (x === t || x.ko || x.side !== t.side) continue;
    for (const s of x.statuses) {
      const c = def(w, s.id).cover;
      if (c && dealt * 100 > c.share * t.stats.max_hp) return x;
    }
  }
  return null;
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
  const p: Part = { type: e.type };
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
  const r = calc(w, t, p, raw, tags, st.fixedBoost ? 0 : boostOf(w, ctx.actor, tags, t) + stat(w, ctx.actor, "power") + enrage(w), crit);
  const by = st.fixedBoost ? (d.perSource ? unit(w, st.src) : null) : ctx.actor;
  // Step 5i (X1): a pulse empties or spends a status as nobody; a reaction as its actor. (X29): a knockout names `by`.
  const tk = take(w, t, r.amount, st.fixedBoost ? null : ctx.actor);
  // `from`: who applied the status, for reading a fight's damage by source (the log only).
  logDamage(w, by, t, d.id, st.fixedBoost ? "pulse" : "reaction", r, tk, st.src, dmgKind(p));
  if (t.hp <= 0) ko(w, t, by, null);
  if (!w.f.result) damageEvents(w, by, t, tk.blocked ? 0 : r.amount, tk.lost, d.id);
}

/**
 * Heals have no type and are never mitigated; they take healing boosts, Healing received, and crit from actions (section 5).
 * Step 5i: the healer is the actor, or for a pulse or trigger the unit that applied its status (a Regen another gave), when
 * known. A holder of `heals: own` takes only its own heals (X33). An ability's changes heal more (X24). The part past full
 * fires overhealed (X32). Both events carry an action's kind (X29).
 */
function heal(w: W, ctx: Ctx, t: CUnit, raw: number) {
  const st = ctx.st;
  const healer = st?.fixedBoost ? unit(w, st.src) : ctx.actor;
  if (feats(w.c).heals && healer !== t && t.statuses.some((s) => def(w, s.id).heals === "own")) return;
  const boost = st ? (st.fixedBoost ? 0 : boostOf(w, ctx.actor, ["healing", ...compile(st.d).tags], t)) : boostOf(w, ctx.actor, ["healing"], t);
  let x = raw * (1 + boost / 100) * (1 + stat(w, t, "healing_received") / 100);
  if (ctx.mod?.heal) x *= 1 + ctx.mod.heal / 100;
  let crit = 0;
  if (!st) crit = critRoll(w, ctx.actor, stat(w, ctx.actor, "crit_chance"), stat(w, ctx.actor, "crit_multiplier"));
  else if (st.fixedBoost && st.d.crit) crit = critRoll(w, st.holder, st.d.crit.chance, st.d.crit.multiplier ?? stat(w, st.holder, "crit_multiplier"));
  if (crit) x = (x * crit) / 100;
  const amount = Math.max(0, Math.floor(x));
  const restored = Math.min(amount, t.stats.max_hp - t.hp);
  t.hp += restored;
  const kind = st ? null : ctx.kind;
  if (restored > 0) w.log?.({ t: "heal", vis: "player", at: w.f.now, by: ctx.actor.id, target: t.id, src: ctx.id, amount: restored, crit: crit > 0, hp: t.hp });
  if (restored > 0) fire(w, ev("healed", t, healer, { amount: restored, kind }));
  if (amount > restored) fire(w, ev("overhealed", t, healer, { amount: amount - restored, kind }));
}

// ─── Statuses (section 7) ───────────────────────────────────────────────────

function immune(w: W, u: CUnit, d: S.StatusT): boolean {
  const on = (k: string) => stat(w, u, k) > 0;
  const cp = compile(d);
  if (on(`immune:status:${d.id}`)) return true;
  if (d.label === "debuff" && on("immune:debuffs")) return true;
  if (cp.kinds.some(([k, tag]) => on(`immune:kind:${k}`) || (tag !== null && on(`immune:kind:${k}:${tag}`)))) return true;
  return cp.harms && on("immune:damage");
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
  // Step 5i: an Intensity application of no stacks does nothing, not even an IMMUNE (see below).
  if (isIntensity(d) && o.stacks <= 0) return;
  if (immune(w, to, d)) {
    w.log?.({ t: "immune", vis: "player", at: f.now, unit: to.id, status: d.id, name: d.name });
    return;
  }
  // Step 5i (X15): a status that hides its holder doesn't land on a Taunting unit (no IMMUNE: it just doesn't land).
  if (forbids(d) && taunting(w, to)) return;
  // Step 5i (X19): a boss's control resistance, the one exception to universal statuses: at its cap the control doesn't
  // land at all, and from `resist.at` stacks it lands for a share of its own length.
  const ctl = controlOf(w, to, d);
  if (ctl && (to.ctrl ?? 0) >= ctl.cap) {
    w.log?.({ t: "immune", vis: "player", at: f.now, unit: to.id, status: d.id, name: d.name, why: "control" });
    return;
  }
  const dur = o.duration ?? d.duration ?? "permanent";
  if (dur === 0) {
    // An instant lockout only interrupts, and leaves no status (section 7.3).
    if (d.lockout?.interrupt) interrupt(w, to, d.lockout.covers);
    return;
  }
  const resisted = !!ctl && dur !== "permanent" && (to.ctrl ?? 0) >= ctl.resist.at;
  const end = dur === "permanent" ? -1 : f.now + (resisted ? Math.floor((sub(dur) * ctl!.resist.pct) / 100) : sub(dur));
  const cp = compile(d);
  const nums = cp.nums.map(({ n, stat: isStat }) => fixed(w, n, by, to, isStat));
  // Only the stacks an application adds can scale: from the applier's stated scaling, and its boosts that name
  // the status or one of its tags (section 7.5). The applier's boosts never reach the status's own numbers, but
  // (step 5i, X20) they can read the unit receiving the stacks.
  const add = isIntensity(d) ? Math.floor(o.stacks * (1 + boostOf(w, by, [d.id, ...(d.tags ?? [])], to) / 100) * SUBTICKS) : 0;
  const cur = to.statuses.find((s) => s.id === d.id && (!d.perSource || s.src === by.id));
  if (cur && d.stacking === "fizzle") return;
  // An Intensity status exists only at 1 stack or more, and (step 5i) an application that adds no stacks does nothing at
  // all: no log, no event, no fresh duration (Frostbite bow's Sunder, whose count is 0 below 8 Chill).
  if (isIntensity(d) && (add <= 0 || (!cur && Math.min(add, capOf(w, d, nums, to)) < SUBTICKS))) return;
  // Step 5i (X11): each applier keeps one copy of a `single` status: this one ends the copy it gave anywhere else.
  if (d.single) for (const o2 of f.units) if (o2 !== to) for (const s of o2.statuses.slice()) if (s.id === d.id && s.src === by.id) endStatus(w, o2, s, "removed", { other: by });
  if (to.ko || f.result) return;
  if (ctl) controlled(w, to, d, ctl, resisted, end);
  if (cur) {
    const before = cur.stacks;
    if (d.stacking === "refresh") {
      // The new application replaces the old: its duration, its numbers and its source (section 7.6).
      cur.end = end;
      cur.nums = nums;
      cur.src = by.id;
    } else {
      cur.stacks = Math.min(capOf(w, d, cur.nums, to), cur.stacks + add);
      if (dur !== "permanent") cur.end = end;
    }
    gained(w, to, d, cur, by, cur.stacks - before);
    return;
  }
  // A status with one applier at a time knows it; a shared Intensity total has no single source (section 7.6).
  const inst: SInst = { uid: f.seq++, id: d.id, src: d.perSource || !isIntensity(d) ? by.id : null, at: f.now, end, stacks: 0, nums };
  inst.stacks = isIntensity(d) ? Math.min(capOf(w, d, nums, to), add) : 0;
  to.statuses.push(inst);
  if (d.pulse) push(w, { k: "pulse", at: f.now + sub(d.pulse.every), b: pulseBatch(to, d), g: 0, slot: to.slot, seq: f.seq++, unit: to.id, uid: inst.uid });
  gained(w, to, d, inst, by, inst.stacks);
}

/** X15: the status makes its holder unpickable (Hidden). */
const forbids = (d: S.StatusT) => !!d.stats?.some((ch) => ch.stat === "forbidden");

/** X19: the control-resistance rule that covers `d` landing on `u`, or null: an enemy of a listed rank, and a listed status. */
function controlOf(w: W, u: CUnit, d: S.StatusT): S.ControlT | null {
  const c = w.c.pack.ruleset.control;
  if (!c || u.side !== "enemy" || !c.statuses.includes(d.id)) return null;
  const rank = w.c.enemies.get(u.ref)?.rank;
  return rank && c.ranks.includes(rank) ? c : null;
}

/** X19: a control landed on a resisting unit: RESISTED if it was shortened, then one more stack (to the cap). */
function controlled(w: W, u: CUnit, d: S.StatusT, c: S.ControlT, resisted: boolean, end: number) {
  if (resisted) w.log?.({ t: "resisted", vis: "player", at: w.f.now, unit: u.id, status: d.id, name: d.name, end });
  setControl(w, u, c, Math.min(c.cap, (u.ctrl ?? 0) + 1));
}

/** X19: control stacks change; a stack drains `drain` ticks after the last change, and every change restarts the wait. */
function setControl(w: W, u: CUnit, c: S.ControlT, n: number) {
  u.ctrl = n;
  w.log?.({ t: "control", vis: "hidden", at: w.f.now, unit: u.id, stacks: n });
  w.f.queue = w.f.queue.filter((it) => !(it.k === "drain" && it.unit === u.id));
  if (n > 0) push(w, { k: "drain", at: w.f.now + sub(c.drain), b: batch(u.side), g: 3, slot: u.slot, seq: w.f.seq++, unit: u.id });
}

function drain(w: W, it: Extract<Item, { k: "drain" }>) {
  const u = unit(w, it.unit), c = w.c.pack.ruleset.control;
  if (u && c && u.ctrl) setControl(w, u, c, u.ctrl - 1);
}

/** An application landed. `added`: the stacks it added, in thousandths (Intensity only), which the event reports (X1). */
function gained(w: W, to: CUnit, d: S.StatusT, s: SInst, by?: CUnit, added = 0) {
  if (d.absorb) s.peak = Math.max(s.peak ?? 0, s.stacks);
  w.log?.({
    t: "status", vis: d.show === "icon" ? "player" : "hidden", at: w.f.now, unit: to.id, status: d.id, name: d.name, ...(by ? { by: by.id } : {}),
    total: isIntensity(d) ? s.stacks / SUBTICKS : null, end: s.end,
  });
  if (d.stats) refresh(w, to);
  if (d.lockout?.interrupt) interrupt(w, to, d.lockout.covers);
  if (d.lockout?.pause && s.end !== -1) hold(w, to, d.lockout.covers, s.end - w.f.now);
  // Step 5i (X1): other is the applier, and an Intensity application says how many stacks it added.
  fire(w, ev("status_gained", to, by ?? null, { status: d.id, amount: added / SUBTICKS, src: by?.id ?? null }));
  // Step 5g: an Intensity status that stands at its cap after an application has capped (Chill shatters). Other: the applier.
  if (isIntensity(d) && compile(d).cap >= 0 && s.stacks >= capOf(w, d, s.nums, to) && to.statuses.includes(s)) fire(w, ev("status_capped", to, by ?? null, { status: d.id, src: by?.id ?? null }));
}

const capOf = (w: W, d: S.StatusT, nums: number[], holder: CUnit) =>
  compile(d).cap < 0 ? Number.MAX_SAFE_INTEGER : Math.floor(sval(w, { d, nums, holder, actor: holder, amount: 0 }, d, d.cap!, null) * SUBTICKS);

/** A debuff's pulse resolves in the batch of the holder's foes; a buff's, or (step 5i) a marker's, in its own side's (section 7.5). */
const pulseBatch = (holder: CUnit, d: S.StatusT) => (d.label === "debuff" ? batch(foeSide(holder)) : batch(holder.side));

/**
 * Who ended a status, and what its ending reports (step 5i, X1). `other`: the unit whose damage emptied or spent it
 * (`take` passes it), or whose effect removed it. `amount`: the damage a block stopped (`take` passes it
 * for cause spent); otherwise the engine works it out: an absorb emptied (cause stacks) reports its peak, and every
 * other ending the stacks it held.
 */
export type Ending = { other?: CUnit | null; amount?: number };

function endStatus(w: W, u: CUnit, s: SInst, cause: S.CauseT, by: Ending = {}) {
  const i = u.statuses.indexOf(s);
  if (i < 0) return;
  u.statuses.splice(i, 1);
  const d = def(w, s.id);
  w.log?.({ t: "status_end", vis: d.show === "icon" ? "player" : "hidden", at: w.f.now, unit: u.id, status: d.id, name: d.name, cause });
  // A stat that brings this status puts it straight back while the stat is above 0.
  if (d.stats || w.c.pack.stats.some((x) => x.brings === d.id)) refresh(w, u);
  const amount = by.amount ?? (cause === "stacks" && d.absorb ? (s.peak ?? s.stacks) : s.stacks) / SUBTICKS;
  fire(w, ev("status_ended", u, by.other ?? null, { status: d.id, cause, ending: s, amount, src: s.src }));
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
  fire(w, ev("action_interrupted", u, null, { kind: d.kind, ability: d.id }));
}

/** A pausing lockout (Stun): a cast in progress that it covers waits out the lockout, then carries on from where it was. */
function hold(w: W, u: CUnit, lockout: string, ticks: number) {
  if (!u.cast || ticks <= 0) return;
  const d = actDef(w, u, u.cast.act);
  if (!covers(lockout, d)) return;
  const i = w.f.queue.findIndex((it) => it.k === "act" && it.unit === u.id);
  if (i < 0) return;
  const [it] = w.f.queue.splice(i, 1);
  u.cast.end += ticks;
  push(w, { ...it, at: u.cast.end, seq: w.f.seq++ });
  w.log?.({ t: "hold", vis: "player", at: w.f.now, unit: u.id, act: d.id, name: d.name, ends: u.cast.end });
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
  for (const s of hit) {
    endStatus(w, t, s, "removed", { other: by });
    // Step 5i (X37): a moved status passes to the acting unit as it was.
    if (e.move) give(w, by, s);
  }
}

/**
 * Step 5i (X37): a status taken from another unit lands on `to` as it was: its stacks, numbers, source and time left. Not on
 * a unit immune to it. A copy `to` already holds takes it by its stacking mode, as an application would.
 */
function give(w: W, to: CUnit, s: SInst) {
  const f = w.f, d = def(w, s.id);
  if (to.ko || f.result) return;
  if (immune(w, to, d)) return void w.log?.({ t: "immune", vis: "player", at: f.now, unit: to.id, status: d.id, name: d.name });
  const cur = to.statuses.find((x) => x.id === d.id && (!d.perSource || x.src === s.src));
  if (cur) {
    if (d.stacking === "fizzle") return;
    if (d.stacking === "refresh") {
      cur.end = s.end;
      cur.nums = s.nums.slice();
      cur.src = s.src;
    } else {
      const before = cur.stacks;
      cur.stacks = Math.min(capOf(w, d, cur.nums, to), cur.stacks + s.stacks);
      if (s.end !== -1) cur.end = s.end;
      return gained(w, to, d, cur, to, cur.stacks - before);
    }
    return gained(w, to, d, cur, to);
  }
  const inst: SInst = { ...s, uid: f.seq++, at: f.now, nums: s.nums.slice() };
  if (isIntensity(d)) inst.stacks = Math.min(capOf(w, d, inst.nums, to), s.stacks);
  to.statuses.push(inst);
  if (d.pulse) push(w, { k: "pulse", at: f.now + sub(d.pulse.every), b: pulseBatch(to, d), g: 0, slot: to.slot, seq: f.seq++, unit: to.id, uid: inst.uid });
  gained(w, to, d, inst, to, isIntensity(d) ? inst.stacks : 0);
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
  // Step 5i (X3): a pulse whose conditions fail does nothing that beat, but an Intensity drop still happens.
  if (!d.pulse!.if || [d.pulse!.if].flat().every((c) => holds(w, h, c))) {
    const ctx: Ctx = {
      actor: h, kind: null, targets: [], id: d.id, dead: false,
      st: { d, nums: s.nums, holder: h, src: s.src, per: perOf(d, s), other: null, owner: null, amount: 0, fixedBoost: true, ...CARRIED_NONE },
    };
    for (const e of d.pulse!.do ?? []) {
      run(w, ctx, e);
      if (w.f.result) return;
    }
    if (!h.statuses.includes(s)) return;
    fire(w, ev("status_triggered", h, null, { status: d.id, src: s.src }));
  }
  if (isIntensity(d) && h.statuses.includes(s)) drop(w, h, s, d);
}

// ─── Events and reactions (sections 7.11 and 8) ─────────────────────────────

/**
 * An event. `other` names who did it where it's known: the attacker or target of a hit, the healer, the reviver,
 * the applier of a status (step 5i, X1), the unit whose damage emptied or spent a status or whose effect removed it,
 * and (share H, X29) the unit whose damage knocked a unit out.
 */
export type Ev = {
  e: S.EventSpecT["event"];
  owner: CUnit;
  other: CUnit | null;
  /** Action and hit events; (X29) ko, healed and overhealed: the kind of the hit or action behind it. */
  kind: HitKind | null;
  /** Hit events: the hit's tags (kind and type, crit, area). */
  tags: string[];
  /** Status events: the status. Damage events: the status whose pulse or reaction dealt it, if any. */
  status: string | null;
  cause: string | null;
  /**
   * Hits and damage: what was dealt. Heals: what was restored. status_gained (X1): the stacks it added, Intensity only.
   * status_ended (X1): the stacks it held as it ended, but an absorb emptied (cause stacks) its peak, and a block (spent)
   * the damage it stopped. action_resolve (X29): the MP it paid.
   */
  amount: number;
  /** The status that just ended, so its own reactions to its ending still run. */
  ending: SInst | null;
  /** Status events (X2's `source`): who applied it, this application's applier, or the instance's source. */
  src: string | null;
} & Carried;

type EvX = Partial<Omit<Ev, "e" | "owner" | "other">>;
const ev = (e: Ev["e"], owner: CUnit, other: CUnit | null, x: EvX = {}): Ev => ({
  e, owner, other, kind: x.kind ?? null, tags: x.tags ?? [], status: x.status ?? null, cause: x.cause ?? null, amount: x.amount ?? 0, ending: x.ending ?? null,
  src: x.src ?? null, raw: x.raw ?? 0, dtype: x.dtype ?? null, count: x.count ?? 0, ability: x.ability ?? null, repeat: x.repeat ?? false,
});

/** Who `x` is from the holder's side (X2's `other`): any (there is one), the holder itself, an ally, a foe. */
const related = (who: S.EventSpecT["whose"], x: CUnit | null, holder: CUnit) =>
  !!x && (who === "any" || (who === "holder" ? x === holder : who === "ally" ? x !== holder && x.side === holder.side : x.side !== holder.side));

/**
 * Whether a status hears an event. `d` is the listening status, for X16's echo: an extra strike the holder made is
 * heard as a basic attack by its own statuses, but not by one that names kind extra for the same event or gives strikes.
 */
function matches(w: W, spec: S.EventSpecT, e: Ev, holder: CUnit, d?: S.StatusT): boolean {
  if (spec.event !== e.e) return false;
  const whose = spec.whose ?? "holder";
  if (whose === "holder" && e.owner !== holder) return false;
  if (whose === "ally" && (e.owner === holder || e.owner.side !== holder.side)) return false;
  if (whose === "foe" && e.owner.side === holder.side) return false;
  if (spec.kind && spec.kind !== (spec.kind === "basic" && d ? echoed(w, e, holder, d) : e.kind)) return false;
  if (spec.tags && !spec.tags.some((t) => e.tags.includes(t))) return false;
  if (spec.notTags && spec.notTags.some((t) => e.tags.includes(t))) return false;
  if (spec.status && spec.status !== e.status) return false;
  if (spec.cause && !spec.cause.includes(e.cause as never)) return false;
  if (spec.other && !related(spec.other, e.other, holder)) return false;
  if (spec.source === "holder" && e.src !== holder.id) return false;
  if (spec.seat !== undefined && !inSeat(w, holder, e.owner, spec.seat)) return false;
  if (spec.amountAtLeast !== undefined && !(e.amount >= spec.amountAtLeast)) return false;
  if (spec.countAtLeast !== undefined && !(e.count >= spec.countAtLeast)) return false;
  if (spec.repeat !== undefined && e.repeat !== spec.repeat) return false;
  return true;
}

/**
 * X16: the kind a status hears an event as. An echoing holder's own extra strikes are basic attacks to it, with two
 * exceptions. A status gives strikes itself through `strike` or (X28) a reaction that strikes: one that strikes on a
 * basic attack would otherwise hear its own strike as one and loop.
 */
function echoed(w: W, e: Ev, holder: CUnit, d: S.StatusT): HitKind | null {
  if (e.kind !== "extra") return e.kind;
  if (d.strike || [...(d.reactions ?? []).flatMap((r) => r.do), ...(d.trigger?.do ?? [])].some((x) => x.op === "strike")) return e.kind;
  const hitter = e.e === "hit_lands" || e.e === "hit_missed" || e.e === "damage_dealt" ? e.owner : e.other;
  if (hitter !== holder || !holder.statuses.some((s) => def(w, s.id).echo)) return e.kind;
  const hearsExtra = [...(d.reactions ?? []).map((r) => r.on), ...(d.trigger ? [d.trigger.on] : [])].some((o) => o.event === e.e && o.kind === "extra");
  return hearsExtra ? e.kind : "basic";
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
      if (d.trigger && s !== e.ending && h.statuses.includes(s) && matches(w, d.trigger.on, e, h, d)) trigger(w, h, s, d, e);
      d.reactions?.forEach((r, k) => {
        if (!matches(w, r.on, e, h, d)) return;
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
  fire(w, ev("status_triggered", h, null, { status: d.id, src: s.src }));
  if (h.statuses.includes(s)) drop(w, h, s, d);
}

/** A reaction resolves on the sub-tick after its event, in the acting unit's batch (section 8). */
function queueReaction(w: W, actor: CUnit, holder: CUnit, s: SInst, d: S.StatusT, which: number, per: number, e: Ev, dead: boolean) {
  push(w, {
    k: "react", at: w.f.now + 1, b: batch(actor.side), g: 1, slot: actor.slot, seq: w.f.seq++, unit: actor.id,
    holder: holder.id, status: d.id, which, nums: s.nums.slice(), src: s.src, per,
    other: e.other?.id ?? null, owner: e.owner.id, amount: e.amount, dead,
    raw: e.raw, dtype: e.dtype, count: e.count, ability: e.ability, repeat: e.repeat,
  });
}

function react(w: W, it: Extract<Item, { k: "react" }>) {
  const actor = unit(w, it.unit);
  if (!actor || (actor.ko && !it.dead)) return;
  const d = def(w, it.status);
  const r = it.which < 0 ? null : d.reactions![it.which];
  const effects = r ? r.do : d.trigger!.do!;
  const st: NonNullable<Ctx["st"]> = {
    d, nums: it.nums, holder: unit(w, it.holder)!, src: it.src, per: it.per, other: unit(w, it.other), owner: unit(w, it.owner), amount: it.amount, fixedBoost: it.which < 0,
    raw: it.raw, dtype: it.dtype, count: it.count, ability: it.ability, repeat: it.repeat,
  };
  // Step 5i (X3): a reaction's tests are read as it resolves, not when its event fired; one that fails does nothing.
  if (r?.if && ![r.if].flat().every((t) => passesTest(w, actor, t, st))) return;
  const ctx: Ctx = { actor, kind: null, targets: [], id: d.id, dead: it.dead, st };
  for (const e of effects) {
    run(w, ctx, e);
    if (w.f.result || (actor.ko && !it.dead)) return;
  }
}

/** X3: one of a reaction's tests: a side's state read from the actor's side, or the event's other unit or owner passing a test. */
function passesTest(w: W, actor: CUnit, t: S.TestT, st: NonNullable<Ctx["st"]>): boolean {
  if ("unit" in t) {
    const x = t.unit === "other" ? st.other : st.owner;
    return !!x && passes(w, x, t.where, actor);
  }
  return holds(w, actor, t);
}

// ─── KO, revival, leaving and joining (section 1, and the core set's revive and summoning) ──

/** Ends a unit's statuses as it leaves play, and the Per source statuses it gave that end with it. */
function strip(w: W, u: CUnit, all: boolean) {
  for (const s of u.statuses.slice()) if (all || !def(w, s.id).survivesKO) endStatus(w, u, s, "ko");
  for (const o of w.f.units) for (const s of o.statuses.slice()) if (s.src === u.id && def(w, s.id).perSource?.endsWithSource) endStatus(w, o, s, "ko");
}

/** Step 5i (X29): `by` is the unit whose damage knocked it out, when known, and `kind` the hit's kind, both on the ko event. */
function ko(w: W, u: CUnit, by: CUnit | null = null, kind: HitKind | null = null) {
  if (u.ko) return;
  u.ko = true;
  u.hp = 0;
  u.cast = null;
  // It loses its action in progress, and anything it would resolve later.
  w.f.queue = w.f.queue.filter((it) => it.unit !== u.id);
  w.log?.({ t: "down", vis: "player", at: w.f.now, unit: u.id });
  if (!living(w, "enemy").length) w.f.result = "won";
  else if (!living(w, "party").length) w.f.result = "lost";
  if (w.f.result) return void (w.f.result === "won" && won(w));
  strip(w, u, false);
  fire(w, ev("ko", u, by, { kind }));
}

/**
 * Step 5i (X36): the moment the last foe falls, before statuses end, each party unit's fight_won, fallen ones included.
 * Its reactions resolve at once (the fight is over: no next sub-tick), in slot order, while the result waits; a fallen
 * unit's statuses (those that survived its knockout) act for it. Then the result stands, and endFight carries HP as ever.
 * Intensity triggers don't hear it.
 */
function won(w: W) {
  const f = w.f;
  const ids = listeners(w, "fight_won");
  if (!ids || w.after) return;
  const items: Extract<Item, { k: "react" }>[] = [];
  for (const owner of f.units.filter((x) => x.side === "party").sort((a, b) => a.slot - b.slot)) {
    const e = ev("fight_won", owner, null);
    for (const h of f.units) {
      for (const s of h.statuses) {
        if (!ids.has(s.id)) continue;
        def(w, s.id).reactions?.forEach((r, k) => {
          if (!matches(w, r.on, e, h, def(w, s.id))) return;
          const actor = unit(w, r.actor === "source" ? s.src : h.id);
          if (!actor || (actor.ko && actor !== h)) return;
          items.push({
            k: "react", at: f.now, b: batch(actor.side), g: 1, slot: actor.slot, seq: f.seq++, unit: actor.id, holder: h.id, status: s.id, which: k,
            nums: s.nums.slice(), src: s.src, per: 1, other: null, owner: owner.id, amount: 0, dead: actor.ko, ...CARRIED_NONE,
          });
        });
      }
    }
  }
  if (!items.length) return;
  items.sort((a, b) => a.b - b.b || a.slot - b.slot || a.seq - b.seq);
  w.after = true;
  for (const it of items) {
    f.result = null;
    react(w, it);
  }
  f.result = "won";
  w.after = false;
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
  if (!living(w, "enemy").length) (w.f.result = "won"), won(w);
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

/** ruleset.enrage: the extra damage, in percent, every unit deals once a fight has run long. */
function enrage(w: W): number {
  const r = w.c.pack.ruleset.enrage;
  if (!r || w.f.now <= r.after * SUBTICKS) return 0;
  return (Math.floor((w.f.now - r.after * SUBTICKS) / (r.every * SUBTICKS)) + 1) * r.pct;
}

/** Fight start: statuses from passives, gear, formations and perks; every action on cooldown as if it had just resolved. */
function begin(w: W) {
  const f = w.f;
  for (const u of f.units) {
    for (const id of u.start) applyStatus(w, u, u, def(w, id), { stacks: 1, rng: u });
    refresh(w, u);
  }
  // ruleset.opening: each action starts partly charged, by its own roll, so a party's actions don't all come up together.
  // With `slots`, a party unit's abilities start charged by the order they're slotted in instead: preparation, not dice.
  const open = w.c.pack.ruleset.opening;
  for (const u of f.units) u.acts.forEach((a, i) => {
    const d = actDef(w, u, i);
    const cd = cooldownOf(w, u, d);
    // Step 5g (the director's): a party ability's cooldown carries from the last fight (what was left when it ended, or its full cooldown
    // the first time), and the slot's head start comes off that: slots as flat ticks, or slotShares as a share of the cooldown.
    const carried = u.side === "party" && d.kind === "ability" && u.cooldowns?.[d.id] !== undefined ? Math.min(cd, sub(u.cooldowns[d.id])) : cd;
    if (open?.slotShares?.length && u.side === "party" && d.kind === "ability") a.ready = Math.max(0, carried - Math.round(cd * (open.slotShares[i] ?? 0)));
    else if (open?.slots?.length && u.side === "party" && d.kind === "ability") a.ready = Math.max(0, carried - sub(open.slots[i] ?? 0));
    else a.ready = open ? Math.round(cd * (open.min + (open.max - open.min) * next(u.rng))) : cd;
  });
  // ruleset.stagger: the n-th copy of an enemy starts n × stagger ticks behind the first, so three Ghosts ripple rather than volley.
  const stagger = Math.round((w.c.pack.ruleset.stagger ?? 0) * SUBTICKS);
  if (stagger) {
    const seen = new Map<string, number>();
    for (const u of f.units) {
      if (u.side !== "enemy") continue;
      const n = seen.get(u.ref) ?? 0;
      seen.set(u.ref, n + 1);
      if (n) for (const a of u.acts) a.ready += n * stagger;
    }
  }
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
  const rage = w.c.pack.ruleset.enrage;
  if (rage && !f.enraged && t > rage.after * SUBTICKS) {
    f.enraged = true;
    w.log?.({ t: "enrage", vis: "player", at: t });
  }
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
    else if (it.k === "react") react(w, it);
    else if (it.k === "drain") drain(w, it);
    else if (it.k === "revive") {
      // Step 5i (X34): a revive on a timer stands its unit up, if nothing has raised it meanwhile.
      const t = unit(w, it.unit)!;
      if (t.ko && !t.gone) revive(w, unit(w, it.by) ?? t, t, it.hp, it.ready);
    }
  }
  if (!f.result) {
    for (const u of f.units) for (const s of u.statuses.slice()) if (s.end !== -1 && s.end <= t && !f.result) endStatus(w, u, s, "expired");
  }
  f.round = Math.ceil(t / SUBTICKS);
}
