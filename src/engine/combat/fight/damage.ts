/**
 * Damage and healing: the resolution order (amount, boosts, damage-taken modifiers, crit, mitigation), evasion,
 * crits, Shield and Aegis, HP floors, taking a hit for an ally, and heals.
 */
import * as S from "../../../schema.js";
import { next } from "../../rng.js";
import { compile } from "../stats.js";
import { aval, boostOf, type CUnit, def, feats, perOf, refresh, type SInst, stat, SUBTICKS, sval, takenOf, unit, type W } from "./state.js";
import { applyStatus, endStatus } from "./statuses.js";
import { type Ctx, num } from "./effects.js";
import { ev, fire } from "./events.js";
import { enrage } from "./clock.js";
import { ko } from "./units.js";
import { stackMult } from "./actions.js";
import { passes } from "./targeting.js";

// ─── Damage and healing ─────────────────────────────────────────────────────

type Part = { type: S.InstanceT["type"] };
const partTags = (kind: string | null, p: Part, extra: readonly string[] = []) => {
  const out = kind ? [kind] : [];
  if (p.type !== "none") out.push(p.type);
  return [...out, ...extra];
};

/** Hits only: one roll per hit (or rider) on the attacker's dice. */
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

/** The resolution order: amount, boosts, damage-taken modifiers, crit, mitigation. Whole points, rounded down. */
function calc(w: W, t: CUnit, p: Part, raw: number, tags: readonly string[], boost: number, crit: number): Calc {
  let x = raw * (1 + boost / 100) * (1 + takenOf(w, t, tags) / 100);
  if (crit) x = (x * crit) / 100;
  // The amount before Defense, for the log only: what mitigation took off.
  const preMit = x;
  let word: string | null = null;
  if (p.type === "physical") {
    const k = w.c.pack.ruleset.armorK;
    const armor = stat(w, t, "defense");
    // ruleset.armorK: the Path of Exile formula, hit² ÷ (hit + k × Defense): nearly linear against big hits, and it never
    // blanks a small one. Otherwise a flat armorRatio × Defense, which ruleset.armorFloor keeps above a share of the hit.
    const y = k
      ? (x > 0 && armor > 0 ? (x * x) / (x + k * armor) : x)
      : Math.max((x * (w.c.pack.ruleset.armorFloor ?? 0)) / 100, x - armor * w.c.pack.ruleset.armorRatio);
    if (y <= 0 && x > 0) word = "BLOCKED";
    x = y;
  }
  const raw0 = Math.max(0, Math.floor(preMit));
  x = Math.max(0, Math.floor(x));
  if (stat(w, t, "immune:damage") > 0) (x = 0), (word = "IMMUNE");
  return { amount: x, word, crit: crit > 0, raw: raw0 };
}

/**
 * After mitigation, a block (Aegis) stops damage above its share outright; absorbs soak in the order they were first applied; the rest comes off HP.
 * `by` is the unit whose damage this is, for the statuses it ends; an HP floor holds a blow that would knock the unit out.
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
  // While it holds an HP floor, a blow that would knock it out leaves it at 1, and nothing falls. A floor that spends
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

/** The floor that holds a blow: one that never spends, else the oldest that does. */
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

/** What a piece of damage was, for the log: "physical" or "untyped". */
const dmgKind = (p: Part) => (p.type === "none" ? "untyped" : p.type);
function logDamage(w: W, by: CUnit | null, t: CUnit, src: string, part: string, r: Calc, tk: { soaked: number; blocked: boolean }, from?: string | null, kind?: string) {
  w.log?.({
    t: "dmg", vis: "player", at: w.f.now, by: by?.id ?? null, target: t.id, src, part, ...(from ? { from } : {}), ...(kind ? { kind } : {}),
    amount: tk.blocked ? 0 : r.amount, raw: r.raw, soaked: tk.soaked, word: tk.blocked ? "AEGIS" : r.word, crit: r.crit, hp: t.hp, shield: shield(w, t),
  });
}

/** How a hit is sized and aimed. `share`: percent of its own damage (default 100); `area`: its effect is aimed at two or more units; `moved`: a cover already took it. */
type HitOpts = { share?: number; area?: boolean; moved?: boolean };
const AREA = ["area"], NONE: string[] = [];

/**
 * A hit from an action or an extra strike, with its riders and attached statuses. Returns whether it landed (wasn't
 * evaded). Crits can depend on a condition; a cover takes a big hit for an ally; the hit's raw amount and type ride on its
 * events; an ability's changes add statuses and stacks.
 */
export function hit(w: W, ctx: Ctx, t0: CUnit, e: S.DamageEffectT, o: HitOpts = {}): boolean {
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
  // A big hit on an ally moves, once, to a unit that covers it, and resolves again against that unit (its own mitigation, block,
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
  // The hit's events carry "crit" when it crits, for reactions to crits (the Assassin's), and its raw amount and type.
  const evTags = crit ? [...tags, "crit"] : tags;
  const raw = results[0]?.raw ?? 0;
  fire(w, ev("hit_lands", a, t, { kind, tags: evTags, amount: dealt, raw, dtype: main.type }));
  fire(w, ev("hit_taken", t, a, { kind, tags: evTags, amount: dealt, raw, dtype: main.type }));
  damageEvents(w, a, t, dealt, lost, null);
  // The hit's statuses land after its events, so a status set off by being hit (Bleed) waits for the next hit.
  // An ability's changes add statuses after its own, and stacks to each.
  if (!t.ko && !w.f.result) {
    for (const ap of [...(e.apply ?? []), ...(ctx.mod?.apply ?? [])]) {
      applyStatus(w, a, t, def(w, ap.status), { stacks: aval(w, ap.stacks ?? 1, a, t, ctx) * stackMult(w, ctx.mod, ap.status), duration: ap.duration, chance: ap.chance, rng: a });
    }
  }
  return true;
}

/**
 * A hit's crit chance and multiplier. The attacker's crit rules that match the hit's tags and the unit hit
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
 * The first other living unit on the hit unit's side, in slot order, whose cover this hit exceeds: more than
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

/** Damage from a pulse, reaction or trigger: not a hit, so no hit events and no crit unless its status turns crits on. */
export function strike(w: W, ctx: Ctx, t: CUnit, e: S.DamageEffectT) {
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
  // A pulse empties or spends a status as nobody; a reaction as its actor. A knockout names `by`.
  const tk = take(w, t, r.amount, st.fixedBoost ? null : ctx.actor);
  // `from`: who applied the status, for reading a fight's damage by source (the log only).
  logDamage(w, by, t, d.id, st.fixedBoost ? "pulse" : "reaction", r, tk, st.src, dmgKind(p));
  if (t.hp <= 0) ko(w, t, by, null);
  if (!w.f.result) damageEvents(w, by, t, tk.blocked ? 0 : r.amount, tk.lost, d.id);
}

/**
 * Heals have no type and are never mitigated; they take healing boosts, Healing received, and crit from actions.
 * The healer is the actor, or for a pulse or trigger the unit that applied its status (a Regen another gave), when
 * known. A holder of `heals: own` takes only its own heals. An ability's changes heal more. The part past full
 * fires overhealed. Both events carry an action's kind.
 */
export function heal(w: W, ctx: Ctx, t: CUnit, raw: number) {
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
