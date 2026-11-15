/**
 * What a unit can do: its abilities and basic attack as resolved actions, the changes its statuses make to them, what
 * they cost (MP, HP prices), when one is available, starting and resolving one, recasts and extra strikes.
 */
import * as S from "../../../schema.js";
import type { Content } from "../../run.js";
import { basicSpeed, scaled, speedOf, sub } from "../stats.js";
import { next } from "../../rng.js";
import { aval, batch, type CUnit, def, feats, isIntensity, push, stat, SUBTICKS, total, unit, type W } from "./state.js";
import { byRule, choose, holds, passes } from "./targeting.js";
import { ev, fire } from "./events.js";
import { type Ctx, pay, run } from "./effects.js";
import { hit } from "./damage.js";
import { applyStatus } from "./statuses.js";

// ─── Actions ────────────────────────────────────────────────────────────────

/** A hit's kind: a basic attack's, an ability's, an extra strike's (Double strike), or a bonus hit a card names. */
export type HitKind = "basic" | "ability" | "extra" | "bonus";
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
  /** It aims at one foe: default targeting, or a rule that picks one foe first. */
  single: boolean;
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
      if: null, any: false, target: "foe", seek: false, effects: [hit], tags: actTags("basic", [hit]), does: NOTHING, single: true,
    };
  } else {
    const a = src as S.AbilityT;
    const cond = allOf(a.if);
    const target = a.target ?? "foe";
    d = {
      id, kind: "ability", name: a.name, mp: a.mp ?? 0, cast: sub(a.cast ?? w.c.pack.ruleset.abilityCast), cooldown: sub(a.cooldown),
      recovery: sub(a.recovery ?? w.c.pack.ruleset.abilityRecovery), if: cond.list, any: cond.any, target, seek: a.seek ?? false, effects: a.do,
      tags: actTags("ability", a.do), does: doesOf(a.do), single: target === "foe" || (typeof target === "object" && target.side === "foes" && target.pick !== "all"),
    };
  }
  acts.set(src, d);
  return d;
}
/** The unit's basic attack. */
export const basicOf = (w: W, u: CUnit) => actDef(w, u, u.acts.findIndex((a) => a.id === "basic"));

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

type HpMod = NonNullable<S.AbilityModT["hp"]>;
/** An HP price as one change states it: who pays, and the other changes' MP percent it's sized after. */
type Price = { h: HpMod; payer: CUnit; mpOthers: number };
/** An ability's changes from its unit's statuses, gathered for one use. Costs, stacks, heals and damage add; the newest status's cast or target wins. */
export type Mods = {
  mp: number;
  hp: Price[];
  /** HP prices of their own size. */
  pay: number;
  cast: number | null;
  wind: number;
  cooldown: number;
  damage: number;
  stacks: NonNullable<S.AbilityModT["stacks"]>[];
  heal: number;
  target: S.TargetRuleT | null;
  seek: boolean;
  wait: S.ConditionT[];
  apply: S.ApplyT[];
  /** Aimed at one foe, it lands on every foe, each hit an even share. */
  spread: boolean;
  /** The unit's equipped abilities cast as one with this one (their slots), or null. */
  together: number[] | null;
  /** A count of casts kept for it, and the status that shows it. */
  casts: { cap: number; show?: string } | null;
};

/** Which abilities a change reaches: absent, all; by id (each with its trained forms); by what they do; one-foe abilities; the first-slotted. Every field given must hold. */
const reaches = (of: S.AbilityFilterT | undefined, u: CUnit, d: ActDef) =>
  d.kind === "basic"
    ? !!of?.basic
    : !of || (!of.basic && (!of.ability || of.ability.includes(d.id) || of.ability.includes(S.formBase(d.id))) && (!of.does || of.does.some((x) => d.does.has(x)))
      && (!of.single || d.single) && (!of.first || u.acts[0]?.id === d.id));

/** A share of the payer's max HP for a cost that is a share of the caster's max MP, or point for point. */
const hpFor = (h: HpMod, cost: number, caster: CUnit, payer: CUnit) =>
  Math.floor(h.share && caster.stats.max_mp > 0 ? (cost * h.pct * payer.stats.max_hp) / (100 * caster.stats.max_mp) : (cost * h.pct) / 100);

/**
 * The changes reaching this action now, read each time it's checked, started, paid for or resolved (actDef stays cached).
 * A change whose `if` the unit fails doesn't apply, and neither does a price another unit pays while that unit can't.
 * Statuses are in the order they were applied, so a later one is newer. An Intensity status's changes don't grow with its
 * stacks, unless the change counts something (`times`). Null when nothing reaches it.
 */
export function modsOf(w: W, u: CUnit, d: ActDef): Mods | null {
  if (!feats(w.c).mods) return null;
  let m: Mods | null = null;
  const prices: { h: HpMod; payer: CUnit; own: number }[] = [];
  for (const s of u.statuses) {
    for (const x of def(w, s.id).mods ?? []) {
      if (!reaches(x.of, u, d) || (x.if && !passes(w, u, x.if, u))) continue;
      m ??= { mp: 0, hp: [], pay: 0, cast: null, wind: 0, cooldown: 0, damage: 0, stacks: [], heal: 0, target: null, seek: false, wait: [], apply: [], spread: false, together: null, casts: null };
      // What the change counts: a status's stacks, or this ability's own casts this fight.
      let k = 1;
      if (x.times) {
        if ("stacks" in x.times) k = total(u, x.times.stacks) / SUBTICKS;
        else {
          k = Math.min(x.times.cap, u.acts.find((a) => a.id === d.id)?.casts ?? 0);
          m.casts = { cap: Math.max(m.casts?.cap ?? 0, x.times.cap), show: x.times.show ?? m.casts?.show };
        }
      }
      const mp = (x.mp ?? 0) * k;
      m.mp += mp;
      if (x.hp) prices.push({ h: x.hp, payer: (x.hp.payer ? unit(w, s.src) : u) ?? u, own: mp });
      if (x.pay !== undefined) m.pay += Math.max(0, Math.floor(aval(w, x.pay, u, null)));
      if (x.cast !== undefined) m.cast = x.cast;
      if (x.wind) m.wind += x.wind * k;
      if (x.cooldown) m.cooldown += x.cooldown * k;
      if (x.damage) m.damage += x.damage * k;
      if (x.stacks) m.stacks.push(k === 1 ? x.stacks : { ...x.stacks, pct: x.stacks.pct * k });
      if (x.heal) m.heal += x.heal * k;
      if (x.target) m.target = x.target;
      if (x.seek) m.seek = true;
      if (x.wait) m.wait.push(...[x.wait].flat());
      if (x.apply) m.apply.push(...x.apply);
      if (x.spread) m.spread = true;
      if (x.together) m.together = u.acts.map((_, j) => j).filter((j) => u.acts[j].id !== "basic" && u.acts[j].id !== d.id && reaches(x.of, u, actDef(w, u, j)));
    }
  }
  if (!m) return null;
  // A price is sized from the cost as every other change leaves it, so a free cast costs no HP either. One another unit
  // pays counts only while that unit stands and would be left above its floor.
  for (const p of prices) {
    const price: Price = { h: p.h, payer: p.payer, mpOthers: m.mp - p.own };
    if (p.h.payer) {
      const amount = hpFor(p.h, costAfter(d, price.mpOthers), u, p.payer);
      if (p.payer === u || p.payer.ko || (p.payer.hp - amount) * 100 <= (p.h.floor ?? 0) * p.payer.stats.max_hp) continue;
    }
    m.hp.push(price);
  }
  return m;
}

/** A cost after percent changes, which add up: −100 is free, and it never falls below 0. */
const costAfter = (d: ActDef, pct: number) => (pct ? Math.max(0, Math.floor((d.mp * (100 + pct)) / 100)) : d.mp);
/** The MP it costs: none where an HP price takes its place. */
const mpCost = (d: ActDef, m: Mods | null) => (m?.hp.some((p) => p.h.instead) ? 0 : costAfter(d, m?.mp ?? 0));

/** The HP prices to pay, payer by payer: each change's price, and the prices of their own size (the caster's). */
function hpPrices(u: CUnit, d: ActDef, m: Mods | null): { payer: CUnit; amount: number }[] {
  if (!m) return [];
  const out: { payer: CUnit; amount: number }[] = [];
  const add = (payer: CUnit, amount: number) => {
    const o = out.find((x) => x.payer === payer);
    if (o) o.amount += amount;
    else if (amount > 0) out.push({ payer, amount });
  };
  for (const p of m.hp) add(p.payer, hpFor(p.h, costAfter(d, p.mpOthers), u, p.payer));
  add(u, m.pay);
  return out;
}

/** The HP price's floor: the ability waits rather than leave its unit below the highest floor its own HP prices set. */
function priceFits(u: CUnit, d: ActDef, m: Mods): boolean {
  const floor = m.hp.reduce((f, p) => (p.payer === u ? Math.max(f, p.h.floor ?? 0) : f), 0);
  if (floor <= 0) return true;
  const own = hpPrices(u, d, m).find((x) => x.payer === u)?.amount ?? 0;
  return (u.hp - own) * 100 >= floor * u.stats.max_hp;
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

/** Its conditions hold (all, or any one), its changes' waits too, its HP price fits, and no lockout covers it. */
function allowed(w: W, u: CUnit, d: ActDef, m: Mods | null): boolean {
  // An ability may wait for several conditions at once (Blood gift: an ally hurt, and itself above the price), or for any one.
  if (d.if && !(d.any ? d.if.some((cnd) => holds(w, u, cnd)) : d.if.every((cnd) => holds(w, u, cnd)))) return false;
  if (m && !(m.wait.every((cnd) => holds(w, u, cnd)) && priceFits(u, d, m))) return false;
  return !lockedOut(w, u, d);
}

/** Off cooldown, affordable, its condition holds, and no lockout covers it; its changes' cost, waits and HP floor count too. */
export function available(w: W, u: CUnit, i: number): boolean {
  if (u.acts[i].ready > w.f.now) return false;
  const d = actDef(w, u, i);
  const m = modsOf(w, u, d);
  // Cast as one: it waits until every ability cast with it is ready too.
  if (m?.together?.some((j) => u.acts[j].ready > w.f.now)) return false;
  if (u.mp < mpCost(d, m)) return false;
  return allowed(w, u, d, m);
}

export function start(w: W, u: CUnit, i: number) {
  const d = actDef(w, u, i);
  // A change can set its wind-up, or stretch it, before cast-time reduction.
  const m = modsOf(w, u, d);
  const cast = m?.cast != null ? sub(m.cast) : d.cast;
  const t = scaled(m?.wind ? Math.max(0, Math.floor((cast * (100 + m.wind)) / 100)) : cast, speedOf(stat(w, u, "cast_time_reduction")));
  u.cast = { act: i, end: w.f.now + t };
  push(w, { k: "act", at: u.cast.end, b: batch(u.side), g: 2, slot: u.slot, seq: w.f.seq++, unit: u.id, act: i });
  if (t > 0) w.log?.({ t: "cast", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, ends: u.cast.end });
  fire(w, ev("action_start", u, null, { kind: d.kind, ability: d.id, does: d.does }));
}

/** An action's cooldown now: the basic attack's after Attack speed, an ability's after its changes and Cooldown. */
export function cooldownOf(w: W, u: CUnit, d: ActDef) {
  if (d.kind === "basic") return scaled(d.cooldown, basicSpeed(stat(w, u, "attack_speed"), d.cooldown, d.recovery));
  const pct = modsOf(w, u, d)?.cooldown ?? 0;
  return scaled(pct ? Math.max(0, Math.floor((d.cooldown * (100 + pct)) / 100)) : d.cooldown, speedOf(stat(w, u, "cooldown_reduction")));
}

/** Pays an action's MP and HP prices, and says what was paid. */
function payFor(w: W, u: CUnit, d: ActDef, m: Mods | null, mp: number): { mp: number; hp: number } {
  if (mp) {
    u.mp -= mp;
    w.log?.({ t: "mp", vis: "hidden", at: w.f.now, target: u.id, amount: -mp, mp: u.mp });
  }
  let hp = 0;
  for (const p of hpPrices(u, d, m)) hp += pay(w, p.payer, p.amount);
  return { mp, hp };
}

/** Targets are chosen, and MP is paid, when the action resolves. `swing`: a basic attack made through an ability's wind-up or recovery, which leaves the unit's own timing alone. */
export function resolve(w: W, u: CUnit, i: number, swing = false) {
  const d = actDef(w, u, i);
  if (!swing) u.cast = null;
  const fail = (why: string) => w.log?.({ t: "fail", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, why });
  // Its changes, read as it resolves: the cost it pays, its target rule, Seek, and what its hits and heals carry.
  const m = modsOf(w, u, d);
  const mp = mpCost(d, m);
  if (u.mp < mp) {
    // The core set's fizzle: nothing happens and no MP is spent, but the ability still goes on cooldown.
    fail("mp");
    u.acts[i].ready = w.f.now + cooldownOf(w, u, d);
    if (!swing) (u.busy = w.f.now + d.recovery), (u.rest = d.kind);
    return;
  }
  const targets = pick(w, u, d, m);
  // A stated rule that finds nobody when the action resolves: no MP spent and no cooldown. Under
  // ruleset.lostCast "cooldown" the unit spends the action's recovery, so two Ghouls reaching for one corpse don't
  // loop, but a Purify whose Stun ended mid-cast isn't locked out for a whole cooldown.
  if (!targets.length) {
    fail("target");
    if (w.c.pack.ruleset.lostCast === "cooldown" && !swing) (u.busy = w.f.now + d.recovery), (u.rest = d.kind);
    return;
  }
  // The MP, and any HP price, paid with it.
  const paid = payFor(w, u, d, m, mp);
  w.log?.({ t: "act", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, kind: d.kind, targets: targets.map((x) => x.id) });
  u.acted = true;
  u.acts[i].ready = w.f.now + cooldownOf(w, u, d);
  if (!swing) (u.busy = w.f.now + d.recovery), (u.rest = d.kind);
  perform(w, u, d, targets, m, paid, 0);
  // The abilities cast as one with it: each at once, free, its targets its own, and on its cooldown.
  for (const j of m?.together ?? []) {
    if (w.f.result || u.ko) return;
    const dj = actDef(w, u, j), mj = modsOf(w, u, dj);
    const tj = pick(w, u, dj, mj);
    u.acts[j].ready = w.f.now + cooldownOf(w, u, dj);
    if (!tj.length) continue;
    w.log?.({ t: "act", vis: "player", at: w.f.now, by: u.id, act: dj.id, name: dj.name, kind: dj.kind, targets: tj.map((x) => x.id), repeat: true });
    perform(w, u, dj, tj, mj, { mp: 0, hp: 0 }, 0);
  }
}

/** An action's targets: a change's rule in place of its own, which takes over again when the change's finds nobody. */
function pick(w: W, u: CUnit, d: ActDef, m: Mods | null): CUnit[] {
  const seek = !!m?.seek || seeks(w, u, d);
  // Spread: an ability aimed at one foe lands on every foe it could pick.
  if (m?.spread && d.kind === "ability" && d.single && choose(w, u, d.target, seek, d.kind).length) return choose(w, u, { side: "foes", pick: "all" }, true, d.kind);
  if (m?.target) {
    const out = choose(w, u, m.target, seek, d.kind);
    if (out.length) return out;
  }
  return choose(w, u, d.target, seek, d.kind);
}

/** An action's effects, its extra strikes and its action_resolve: as it resolves, or again for a recast's repeat (1 free, 2 paid). */
function perform(w: W, u: CUnit, d: ActDef, targets: CUnit[], m: Mods | null, paid: { mp: number; hp: number }, repeat: number) {
  const ctx: Ctx = { actor: u, kind: d.kind, targets, id: d.id, st: null, dead: false, landed: [], repeat: repeat > 0, mod: m, paid };
  for (const e of d.effects) {
    run(w, ctx, e);
    if (w.f.result || u.ko) return;
  }
  if (d.kind === "basic") strikes(w, u, d, targets, ctx);
  if (w.f.result || u.ko) return;
  // A cast that counts (not a free repeat) is counted for its ability, as it finishes.
  if (d.kind === "ability" && repeat !== 1) counted(w, u, d, m);
  // What it did: the MP it paid, the units on the other side its hits landed on, which action, and whether it's a repeat.
  fire(w, ev("action_resolve", u, targets[0] ?? null, { kind: d.kind, amount: paid.mp, price: paid.hp, count: ctx.landed!.length, ability: d.id, repeat, does: d.does }));
}

/** One more counted cast of an ability; a change that counts casts shows the unit's highest count as a status. */
function counted(w: W, u: CUnit, d: ActDef, m: Mods | null) {
  const a = u.acts.find((x) => x.id === d.id);
  if (!a) return;
  a.casts = (a.casts ?? 0) + 1;
  const show = m?.casts?.show;
  if (!show) return;
  const top = Math.min(m!.casts!.cap, Math.max(...u.acts.map((x) => x.casts ?? 0)));
  const held = total(u, show) / SUBTICKS;
  if (top > held) applyStatus(w, u, u, def(w, show), { stacks: top - held, rng: u });
}

/**
 * An ability resolves again at once: no wind-up, its cooldown and recovery untouched, its targets chosen afresh by its own
 * rule (its changes included). By default the action that set the reaction off, free; `which: first`, the unit's
 * first-slotted ability, whatever its cooldown, if its conditions hold; `paid`, at its cost in MP and HP, or not at all.
 * The repeat fires its own action_resolve, marked as a repeat.
 */
export function recast(w: W, ctx: Ctx, e: Extract<S.EffectT, { op: "recast" }>) {
  const u = ctx.actor;
  if (u.ko || w.f.result) return;
  const first = e.which === "first";
  const id = first ? u.acts[0]?.id : ctx.st?.ability;
  if (!id || id === "basic") return;
  const i = u.acts.findIndex((a) => a.id === id);
  if (i < 0) return;
  const d = actDef(w, u, i);
  const m = modsOf(w, u, d);
  if (first && !allowed(w, u, d, m)) return;
  const mp = e.paid ? mpCost(d, m) : 0;
  if (e.paid && (u.mp < mp || (m && !priceFits(u, d, m)))) return;
  const targets = pick(w, u, d, m);
  if (!targets.length) return void w.log?.({ t: "fail", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, why: "target" });
  const paid = e.paid ? payFor(w, u, d, m, mp) : { mp: 0, hp: 0 };
  w.log?.({ t: "act", vis: "player", at: w.f.now, by: u.id, act: d.id, name: d.name, kind: d.kind, targets: targets.map((x) => x.id), repeat: true });
  // A cast of its own (the first-slotted one, called by a count) is an ordinary cast; one that repeats a cast is a repeat.
  perform(w, u, d, targets, m, paid, first ? 0 : e.paid ? 2 : 1);
}

/** Whether a strike's chance comes up: at 100 or more it always does, without a roll. */
function strikeRoll(w: W, u: CUnit, chance: number): boolean {
  if (chance >= 100) return true;
  const roll = next(u.rng) * 100;
  w.log?.({ t: "roll", vis: "hidden", at: w.f.now, by: u.id, what: "strike", chance, roll });
  return roll < chance;
}

/**
 * Extra strikes after a basic attack (Double strike, Arc): one more hit with the weapon's damage, which never chains. An
 * extra strike is Double strike's; a strike of kind bonus is a hit with its own name (Arc's second hit, a leap, a volley's
 * arrow), `wide` on a unit other than the swing's target. Each strike deals `share` % of the weapon's damage, in the shape
 * the unit's basic attacks have; a rule that picks several units strikes each, in its order, and those strikes are `area`;
 * a `chain` rolls the chance again after each strike that lands, at most `times` more, each `share` % of the one before, in
 * place of a plain strike reading the same stat. An extra strike brings the weapon's attached statuses, and under `echo`
 * the riders too; a bonus strike brings both only with `carry`; either may apply statuses of its own. Their hits count
 * among the action's landed units.
 */
function strikes(w: W, u: CUnit, d: ActDef, targets: CUnit[], ctx: Ctx) {
  const e = d.effects[0] as S.DamageEffectT;
  // A chained strike takes the place of a plain one that reads the same stat on the unit (Flurry wraps over Double strike),
  // so the swing rolls that chance once and chains from there.
  let chained: Set<string> | null = null;
  for (const s of u.statuses) {
    const k = def(w, s.id).strike;
    if ((k?.chain || k?.replace) && k.scale) (chained ??= new Set()).add(k.scale);
  }
  const echo = u.statuses.some((s) => def(w, s.id).echo);
  for (const s of u.statuses.slice()) {
    const st = def(w, s.id);
    const k = st.strike;
    if (!k || !u.statuses.includes(s)) continue;
    if (chained && !k.chain && !k.replace && k.scale && chained.has(k.scale)) continue;
    if (k.when && !passes(w, u, k.when, u)) continue;
    if (w.f.result || u.ko) return;
    const chance = (k.chance ?? (k.scale ? 0 : 100)) + (k.scale ? stat(w, u, k.scale) : 0);
    if (!strikeRoll(w, u, chance)) continue;
    const to = k.to === "target" ? targets.slice(0, 1) : byRule(w, u, k.to, { seek: true, main: false, targets });
    const area = to.length >= 2;
    const kind: HitKind = k.kind ?? "extra";
    // An extra strike, and a bonus strike that carries, bring the weapon's attached statuses; any strike adds its own.
    const carry = kind === "extra" ? echo : !!k.carry;
    const eff: S.DamageEffectT = { ...e, apply: [...(kind === "extra" || k.carry ? (e.apply ?? []) : []), ...(k.apply ?? [])] };
    for (const t of to) {
      let share = k.share ?? 100;
      const tags = [...(kind === "bonus" && !targets.includes(t) ? ["wide"] : []), ...(k.tag ? [k.tag] : [])];
      for (let n = 0; !t.ko && !u.ko && !w.f.result; n++) {
        w.log?.({ t: "strike", vis: "player", at: w.f.now, by: u.id, status: st.id, name: st.name, target: t.id });
        const sctx: Ctx = { actor: u, kind, targets: [t], id: d.id, st: null, dead: false, landed: ctx.landed };
        const landed = hit(w, sctx, t, eff, { share, area, shape: true, tags, carry });
        if (!landed || !k.chain || n >= k.chain.times || !strikeRoll(w, u, chance)) break;
        share = (share * k.chain.share) / 100;
      }
    }
  }
}
