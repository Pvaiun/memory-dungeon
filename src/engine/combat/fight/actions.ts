/**
 * What a unit can do: its abilities and basic attack as resolved actions, the changes its statuses make to them, what
 * they cost (MP, HP prices), when one is available, starting and resolving one, recasts and extra strikes.
 */
import * as S from "../../../schema.js";
import type { Content } from "../../run.js";
import { basicSpeed, scaled, speedOf, sub } from "../stats.js";
import { next } from "../../rng.js";
import { batch, type CUnit, def, feats, isIntensity, push, stat, type W } from "./state.js";
import { byRule, choose, holds, passes } from "./targeting.js";
import { ev, fire } from "./events.js";
import { type Ctx, pay, run } from "./effects.js";
import { hit } from "./damage.js";

// ─── Actions ────────────────────────────────────────────────────────────────

export type HitKind = "basic" | "ability" | "extra";
export type ActDef = {
  id: string;
  kind: "basic" | "ability";
  name: string;
  mp: number;
  cast: number;
  cooldown: number;
  recovery: number;
  if: S.ConditionT[] | null;
  /** `if` holds when any one of its conditions does, not every one. */
  any: boolean;
  target: Target;
  seek: boolean;
  effects: S.EffectT[];
  tags: string[];
  /** What its effects do, for ability changes by `does`: damage, heal, revive, and each status it applies. */
  does: ReadonlySet<string>;
};
const NOTHING: ReadonlySet<string> = new Set();
export type Target = "foe" | "ally" | "self" | S.TargetRuleT;

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

export function actDef(w: W, u: CUnit, i: number): ActDef {
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

/** An ability's `if`: conditions that must all hold, or (`{ any }`) at least one. */
function allOf(c: S.AbilityT["if"]): { list: S.ConditionT[] | null; any: boolean } {
  if (!c) return { list: null, any: false };
  if ("any" in c) return { list: c.any, any: true };
  return { list: [c].flat(), any: false };
}

/** What an ability's effects do: "damage", "heal", "revive", and every status it applies (an apply, a hit's apply, a `one`). */
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

// ─── Ability changes ────────────────────────────────────────────────────────

/** An ability's changes from its unit's statuses, gathered for one use. Costs, stacks and heals add; the newest status's cast or target wins. */
export type Mods = {
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

/** The MP cost after its changes, which add up: −100 is free, and it never falls below 0. */
const mpCost = (d: ActDef, m: Mods | null) => (m?.mp ? Math.max(0, Math.floor((d.mp * (100 + m.mp)) / 100)) : d.mp);

/** An HP price on top of the MP: pct % of its own MP cost (before MP changes), point for point, or as the same share of max HP. */
function hpPrice(u: CUnit, d: ActDef, m: Mods | null): number {
  if (!m?.hp.length) return 0;
  let p = 0;
  for (const h of m.hp) {
    const base = (d.mp * h.pct) / 100;
    p += h.share && u.stats.max_mp > 0 ? (base * u.stats.max_hp) / u.stats.max_mp : base;
  }
  return Math.floor(p);
}

/** The HP price's floor: the ability waits rather than leave its unit below the highest floor its HP prices set. */
function priceFits(u: CUnit, d: ActDef, m: Mods): boolean {
  const floor = m.hp.reduce((f, h) => Math.max(f, h.floor ?? 0), 0);
  return floor <= 0 || (u.hp - hpPrice(u, d, m)) * 100 >= floor * u.stats.max_hp;
}

/** How many more stacks an application adds, from the ability's changes, on top of the applier's boosts. */
export function stackMult(w: W, m: Mods | null | undefined, status: string): number {
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

export const covers = (tag: string, d: ActDef) => tag === "all" || d.tags.includes(tag);
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

/** Off cooldown, affordable, its condition holds, and no lockout covers it; its changes' cost, waits and HP floor count too. */
export function available(w: W, u: CUnit, i: number): boolean {
  if (u.acts[i].ready > w.f.now) return false;
  const d = actDef(w, u, i);
  const m = modsOf(w, u, d);
  if (u.mp < mpCost(d, m)) return false;
  // An ability may wait for several conditions at once (Blood gift: an ally hurt, and itself above the price), or for any one.
  if (d.if && !(d.any ? d.if.some((cnd) => holds(w, u, cnd)) : d.if.every((cnd) => holds(w, u, cnd)))) return false;
  if (m && !(m.wait.every((cnd) => holds(w, u, cnd)) && priceFits(u, d, m))) return false;
  return !lockedOut(w, u, d);
}

export function start(w: W, u: CUnit, i: number) {
  const d = actDef(w, u, i);
  // A change can set its wind-up, before cast-time reduction.
  const cast = modsOf(w, u, d)?.cast;
  const t = scaled(cast != null ? sub(cast) : d.cast, speedOf(stat(w, u, "cast_time_reduction")));
  u.cast = { act: i, end: w.f.now + t };
  push(w, { k: "act", at: u.cast.end, b: batch(u.side), g: 2, slot: u.slot, seq: w.f.seq++, unit: u.id, act: i });
  if (t > 0) w.log?.({ t: "cast", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, ends: u.cast.end });
  fire(w, ev("action_start", u, null, { kind: d.kind, ability: d.id }));
}

export function cooldownOf(w: W, u: CUnit, d: ActDef) {
  return d.kind === "basic"
    ? scaled(d.cooldown, basicSpeed(stat(w, u, "attack_speed"), d.cooldown, d.recovery))
    : scaled(d.cooldown, speedOf(stat(w, u, "cooldown_reduction")));
}

/** Targets are chosen, and MP is paid, when the action resolves. */
export function resolve(w: W, u: CUnit, i: number) {
  const d = actDef(w, u, i);
  u.cast = null;
  const fail = (why: string) => w.log?.({ t: "fail", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, why });
  // Its changes, read as it resolves: the cost it pays, its target rule, Seek, and what its hits and heals carry.
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
  // A stated rule that finds nobody when the action resolves: no MP spent and no cooldown. Under
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
  // An HP price on top of the MP, paid with it.
  const price = hpPrice(u, d, m);
  if (price > 0) pay(w, u, price);
  w.log?.({ t: "act", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, kind: d.kind, targets: targets.map((x) => x.id) });
  u.acted = true;
  u.acts[i].ready = w.f.now + cooldownOf(w, u, d);
  u.busy = w.f.now + d.recovery;
  perform(w, u, d, targets, m, mp, false);
}

/** An action's effects, its extra strikes and its action_resolve: as it resolves, or again for a recast's repeat. */
function perform(w: W, u: CUnit, d: ActDef, targets: CUnit[], m: Mods | null, paid: number, repeat: boolean) {
  const ctx: Ctx = { actor: u, kind: d.kind, targets, id: d.id, st: null, dead: false, landed: [], repeat, mod: m };
  for (const e of d.effects) {
    run(w, ctx, e);
    if (w.f.result || u.ko) return;
  }
  if (d.kind === "basic") strikes(w, u, d, targets, ctx);
  if (w.f.result || u.ko) return;
  // What it did: the MP it paid, the units on the other side its hits landed on, which action, and whether it's a repeat.
  fire(w, ev("action_resolve", u, null, { kind: d.kind, amount: paid, count: ctx.landed!.length, ability: d.id, repeat }));
}

/**
 * In a reaction to its holder's own action_resolve, the action that set it off resolves again at once:
 * no wind-up, no MP or HP price, its cooldown and recovery untouched, its targets chosen afresh by its own rule (its
 * changes included). The repeat fires its own action_resolve, marked as a repeat.
 */
export function recast(w: W, ctx: Ctx) {
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
 * Each strike deals `share` % of the weapon's damage; a rule that picks several units strikes each, in its order, and
 * those strikes are `area`; a `chain` rolls the chance again after each strike that lands, at most `times` more, each `share` %
 * of the one before, in place of a plain strike reading the same stat. Their hits count among the action's landed units.
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
