/**
 * An action's, pulse's or reaction's effects, one by one: their targets and numbers, and every op but damage and
 * healing (damage.ts): MP, cooldown changes, HP prices, strikes out of turn, riders laid on another unit, statuses shared,
 * passed and spent, the opening made to happen again, timed revives.
 */
import * as S from "../../../schema.js";
import { sub } from "../stats.js";
import { aval, batch, CARRIED_NONE, type Carried, type CUnit, def, feats, hpMoved, isIntensity, push, type Reading, SUBTICKS, sval, total, unit, type W } from "./state.js";
import { actDef, basicOf, cooldownOf, type HitKind, type Mods, recast, stackMult } from "./actions.js";
import { byRule, randomIndex } from "./targeting.js";
import { ko, replace, revive, summon } from "./units.js";
import { heal, hit, type HitOpts, strike } from "./damage.js";
import { applyStatus, endStatus, remove, spend } from "./statuses.js";
import { ev, fire, queueReaction, riderEffect, riderReaction } from "./events.js";

// ─── Effects ────────────────────────────────────────────────────────────────

/**
 * Who is acting and on whose behalf. An action: `kind` is set and its damage
 * effects are hits. A pulse, reaction or Intensity trigger: `st` is set, and
 * numbers come from the status instance's fixed part plus the holder's side.
 */
export type Ctx = {
  actor: CUnit;
  kind: HitKind | null;
  targets: CUnit[];
  id: string;
  /** The actor is KO'd and reacting to its own KO (Volatile). */
  dead: boolean;
  /** An action's units on the other side its hits have landed on so far, each once (`count: hit` reads it). */
  landed?: CUnit[];
  /** A recast's repeat. */
  repeat?: boolean;
  /** An ability's changes, as read when it resolved. */
  mod?: Mods | null;
  /** What the action paid, in MP and as an HP price (`cost` reads it). */
  paid?: { mp: number; hp: number };
  st: null | {
    d: S.StatusT;
    nums: number[];
    holder: CUnit;
    src: string | null;
    per: number;
    other: CUnit | null;
    /** Reactions: the unit the event is about (for status_capped, the holder of the status that just reached its cap). */
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
  // The unit that last hit the one the event is about, if it's still there (a fallen one is filtered below).
  else if (t === "assailant") out = [unit(w, st?.owner?.hitBy ?? null)];
  // A strike with Seek picks as an action's own rule would: past any Taunt, and a Mark takes its fallback to a random foe.
  else if (e.op === "strike" && e.seek) out = byRule(w, ctx.actor, t, { seek: true, main: true, mark: true, targets: [] });
  else out = byRule(w, ctx.actor, t, { seek: true, main: false, targets: ctx.targets, other: st?.other ?? null, owner: st?.owner ?? null });
  const wantKo = e.op === "revive";
  return out.filter((x): x is CUnit => !!x && (wantKo ? x.ko && !x.gone : !x.ko));
}

/** What a number in a reaction can read of its event, and in an action of what it paid. */
const reading = (ctx: Ctx): Reading => (ctx.st ? { targets: [], count: ctx.st.count, raw: ctx.st.raw, stopped: ctx.st.stopped } : ctx);

/** An effect's number, in its context, for one target. Pulses and triggers scale with the Intensity total. */
export function num(w: W, ctx: Ctx, owner: object, n: S.NumT, target: CUnit | null): number {
  const st = ctx.st;
  if (!st) return aval(w, n, ctx.actor, target, ctx);
  return sval(w, { d: st.d, nums: st.nums, holder: st.holder, actor: ctx.actor, amount: st.amount, read: reading(ctx) }, owner, n, target) * st.per;
}

export function run(w: W, ctx: Ctx, e: S.EffectT) {
  if (e.op === "summon") {
    if (!w.f.result && (!ctx.actor.ko || ctx.dead)) summon(w, ctx.actor, ctx.actor.side, e.enemy, e.count ?? 1, e.hp ?? 0);
    return;
  }
  if (e.op === "recast") return recast(w, ctx, e);
  const ts = targetsOf(w, ctx, e);
  // A damage effect aimed at two or more units at once makes `area` hits, and a status applied to several is `area` too.
  const area = ts.length >= 2;
  // One pick of statuses for every target.
  const samePick = e.op === "one" && e.same ? pickOf(w, ctx, e, null) : null;
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
        heal(w, ctx, t, num(w, ctx, e, e.amount, t), !!e.final);
        break;
      case "mp":
        mp(w, ctx, t, Math.trunc(num(w, ctx, e, e.amount, t)), !!e.final);
        break;
      case "apply":
        // An ability's changes can add stacks to its applications.
        applyStatus(w, ctx.actor, t, def(w, e.status), {
          stacks: num(w, ctx, e, e.stacks ?? 1, t) * stackMult(w, ctx.mod, e.status), duration: e.duration, chance: e.chance, rng: ctx.actor,
          area, copy: !!e.copy, passed: !!e.passed || !!ctx.st?.passed,
        });
        break;
      case "remove":
        remove(w, ctx.actor, t, e);
        break;
      case "revive": {
        // The reviver's own rule wins over the effect's ready and HP; `after` stands the unit up later.
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
        pay(w, t, num(w, ctx, e, e.hp, t), !!e.drain);
        break;
      case "strike":
        reactionStrike(w, ctx, t, e, area, ts.length);
        break;
      case "one":
        // One of these statuses (or several), picked at random on the actor's dice, or the one the target holds most of.
        for (const ap of samePick ?? pickOf(w, ctx, e, t)) {
          applyStatus(w, ctx.actor, t, def(w, ap.status), { stacks: num(w, ctx, ap, ap.stacks ?? 1, t) * stackMult(w, ctx.mod, ap.status), duration: ap.duration, chance: ap.chance, rng: ctx.actor, area });
        }
        break;
      case "spend":
        spend(w, t, e.status, e.share, e.count);
        break;
      case "pass":
        pass(w, ctx.actor, t, e);
        break;
      case "share":
        share(w, ctx, t);
        break;
      case "riders":
        layRiders(w, ctx, t, !!e.plain);
        break;
      case "restart":
        restart(w, ctx, t);
        break;
      case "fell":
        // Not damage: nothing stands in the way. The actor's kill, but no hit's.
        ko(w, t, ctx.actor, null);
        break;
    }
  }
}

/** Which statuses a `one` applies: `count` different ones at random, or the one its target holds the most stacks of. */
function pickOf(w: W, ctx: Ctx, e: Extract<S.EffectT, { op: "one" }>, t: CUnit | null): S.ApplyT[] {
  if (e.pick === "most") {
    if (!t) return [];
    const held = e.of.map((ap) => total(t, ap.status));
    const best = Math.max(...held);
    if (best <= 0) return [];
    const tied = e.of.filter((_, i) => held[i] === best);
    return [tied.length > 1 ? tied[randomIndex(w, ctx.actor, tied.length, "one")] : tied[0]];
  }
  let pool = e.of.slice();
  const out: S.ApplyT[] = [];
  for (let n = e.count ?? 1; n > 0 && pool.length; n--) {
    const ap = pool[randomIndex(w, ctx.actor, pool.length, "one")];
    out.push(ap);
    pool = pool.filter((x) => x !== ap);
  }
  return out;
}

/**
 * MP restored or drained. What a unit would gain is first sent on by its `divert`, once; then mp_gained says what it gained
 * and mp_over what went past its pool. A `final` gain, one sent on, and one given in answer to mp_over are never sent on again.
 */
function mp(w: W, ctx: Ctx, t0: CUnit, v: number, final: boolean) {
  let t = t0, sent = final || ctx.st?.on === "mp_over";
  if (v > 0 && !sent && feats(w.c).divert) {
    const to = divertOf(w, t, "mp");
    if (to) (t = to), (sent = true);
  }
  const before = t.mp;
  t.mp = Math.min(t.stats.max_mp, Math.max(0, t.mp + v));
  // Log only: who gave it, from what, and whether a status's pulse (regen, Clarity) or an action or reaction.
  w.log?.({ t: "mp", vis: "hidden", at: w.f.now, target: t.id, amount: v, mp: t.mp, by: ctx.actor.id, src: ctx.id, part: ctx.st ? (ctx.st.fixedBoost ? "pulse" : "reaction") : "action" });
  if (v <= 0) return;
  const gained = t.mp - before;
  if (gained > 0) fire(w, ev("mp_gained", t, ctx.actor, { amount: gained }));
  if (v > gained && !sent) fire(w, ev("mp_over", t, ctx.actor, { amount: v - gained }));
}

/** Where a unit's `divert` sends what it would gain (`what`: mp, or a status id): another living unit, or nobody. */
export function divertOf(w: W, t: CUnit, what: string): CUnit | null {
  for (const s of t.statuses) {
    const dv = def(w, s.id).divert;
    if (!dv || dv.what !== what) continue;
    const to = dv.to === "source" ? unit(w, s.src) : (byRule(w, t, dv.to, { seek: true, main: false, targets: [] })[0] ?? null);
    if (to && to !== t && !to.ko) return to;
  }
  return null;
}

/**
 * Changes the cooldown left on a unit's basic attack or abilities. `longest` and `soonest` pick among the
 * abilities still cooling down (ties: slot order), and in an ability's own effect never that ability on its caster; `first`
 * is the first-slotted ability, `slowest` the one with the longest whole cooldown; `event` is the action behind the
 * reaction's event; by id, each with its trained forms. A wind-up under way carries on, and ready still needs MP and
 * conditions. The basic attack's full cooldown is its swing.
 */
function cooldowns(w: W, ctx: Ctx, t: CUnit, e: Extract<S.EffectT, { op: "cooldown" }>) {
  const now = w.f.now;
  const left = (i: number) => Math.max(0, t.acts[i].ready - now);
  const all = t.acts.map((_, i) => i);
  const abilities = all.filter((i) => t.acts[i].id !== "basic");
  const full = (i: number) => cooldownOf(w, t, actDef(w, t, i));
  const which = e.which;
  let pick: number[];
  if (which === "basic") pick = all.filter((i) => t.acts[i].id === "basic");
  else if (which === "abilities") pick = abilities;
  else if (which === "longest" || which === "soonest") {
    let best = -1;
    for (const i of abilities) {
      if (ctx.kind === "ability" && t === ctx.actor && t.acts[i].id === ctx.id) continue;
      if (left(i) > 0 && (best < 0 || (which === "longest" ? left(i) > left(best) : left(i) < left(best)))) best = i;
    }
    pick = best < 0 ? [] : [best];
  } else if (which === "first") pick = abilities.slice(0, 1);
  else if (which === "slowest") {
    let best = -1;
    for (const i of abilities) if (best < 0 || full(i) > full(best)) best = i;
    pick = best < 0 ? [] : [best];
  } else if (which === "event") pick = all.filter((i) => !!ctx.st?.ability && t.acts[i].id === ctx.st.ability);
  else pick = abilities.filter((i) => which.ability.includes(t.acts[i].id) || which.ability.includes(S.formBase(t.acts[i].id)));
  const set = e.set;
  for (const i of pick) {
    const l = left(i);
    const rest = set === "ready" ? 0
      : set === "full" ? full(i)
      : "less" in set ? Math.max(0, l - sub(set.less))
      : "times" in set ? Math.floor((l * set.times) / 100)
      : "lessPct" in set ? Math.max(0, l - Math.floor((full(i) * num(w, ctx, e, set.lessPct, t)) / 100))
      : Math.min(l, Math.floor((full(i) * set.atMost) / 100));
    t.acts[i].ready = now + rest;
    w.log?.({ t: "cooldown", vis: "hidden", at: now, by: ctx.actor.id, unit: t.id, act: t.acts[i].id, left: rest });
  }
}

/**
 * HP as a price: lost at once, but not damage, so no Shield soaks it, no Defense cuts it and nothing reacts to it as damage.
 * Never below 1 HP. A price fires hp_paid; a `drain` (a loss that isn't a price) doesn't. Returns what was paid.
 */
export function pay(w: W, t: CUnit, amount: number, drain = false): number {
  const v = Math.min(Math.floor(amount), t.hp - 1);
  if (v <= 0 || t.ko) return 0;
  t.hp -= v;
  w.log?.({ t: "pay", vis: "player", at: w.f.now, unit: t.id, amount: v, hp: t.hp });
  if (!drain) fire(w, ev("hp_paid", t, null, { amount: v }));
  hpMoved(w, t);
  return v;
}

/**
 * Reactions only: a hit out of turn, by the actor or by the unit `by` picks, at one target. Sized `share` % of the striker's
 * basic attack (`of: weapon`, in the shape its basic attacks have), of the raw amount of the hit that set the reaction off,
 * resolved afresh (`of: hit`), of what that hit dealt, landed again as it is (`of: dealt`: a second landing, at once or
 * `after` some ticks), of what a killing blow had left over (`of: over`), or of an `amount` of its own. A second landing and a
 * left-over are bare. It fires hit events and never brings extra strikes. A fallen striker strikes nothing.
 */
function reactionStrike(w: W, ctx: Ctx, t: CUnit, e: Extract<S.EffectT, { op: "strike" }>, area: boolean, among: number) {
  const st = ctx.st;
  if (!st) return;
  const a = e.by ? (byRule(w, ctx.actor, e.by, { seek: true, main: false, targets: [] })[0] ?? null) : ctx.actor;
  if (!a || a.ko) return;
  const kind: HitKind = e.kind ?? "bonus";
  const share = (e.share ?? 100) / (e.split ? Math.max(1, among) : 1);
  const hctx: Ctx = { actor: a, kind, targets: [t], id: ctx.id, st: null, dead: false, landed: [] };
  const o: HitOpts = { share, area, tags: e.tag ? [e.tag] : [], carry: !!e.carry };
  if (e.amount !== undefined) {
    // A hit of its own size: the amount and its statuses' stacks are read here, in the reaction, and land as plain numbers.
    const apply = e.apply?.map((ap) => ({ ...ap, stacks: num(w, ctx, ap, ap.stacks ?? 1, t) }));
    hit(w, hctx, t, { op: "damage", type: "physical", amount: num(w, ctx, e, e.amount, t), apply }, o);
    return;
  }
  const of = e.of ?? "weapon";
  if (of === "weapon") {
    // The weapon's attached statuses ride an extra strike, and a bonus strike that carries.
    const wp = basicOf(w, a).effects[0] as S.DamageEffectT;
    hit(w, hctx, t, kind === "extra" || e.carry ? wp : { ...wp, apply: undefined }, { ...o, shape: true });
  } else if (of === "hit") {
    if (st.raw && st.dtype && st.dtype !== "none") hit(w, hctx, t, { op: "damage", type: st.dtype, amount: st.raw }, o);
  } else if (of === "dealt") {
    const amount = Math.floor((st.amount * share) / 100);
    if (amount <= 0) return;
    if (e.after) push(w, { k: "hit", at: w.f.now + sub(e.after), b: batch(a.side), g: 1, slot: a.slot, seq: w.f.seq++, unit: a.id, target: t.id, amount, src: ctx.id, tag: e.tag ?? null });
    else again(w, a, t, amount, ctx.id, e.tag ?? null);
  } else if (st.amount > 0) hit(w, hctx, t, { op: "damage", type: "physical", amount: st.amount }, { ...o, plain: true, bare: true, carry: false });
}

/** A second landing: the same damage again on the same unit, with no dodge, crit, boost or Defense; a bare bonus hit. */
export function again(w: W, a: CUnit, t: CUnit, amount: number, src: string, tag: string | null) {
  if (a.ko || t.ko || w.f.result) return;
  hit(w, { actor: a, kind: "bonus", targets: [t], id: src, st: null, dead: false, landed: [] }, t, { op: "damage", type: "physical", amount }, { fixed: amount, bare: true, tags: tag ? [tag] : [] });
}

/** Every status of a label the actor holds passes to the target as a fresh application, with the stacks the actor held; the actor is rid of it. */
function pass(w: W, a: CUnit, t: CUnit, e: Extract<S.EffectT, { op: "pass" }>) {
  for (const s of a.statuses.slice()) {
    const d = def(w, s.id);
    if (d.label !== e.label || d.unremovable || e.except?.includes(d.id) || !a.statuses.includes(s)) continue;
    const stacks = isIntensity(d) ? s.stacks / SUBTICKS : 1;
    endStatus(w, a, s, "removed", { other: a });
    applyStatus(w, a, t, d, { stacks, rng: a });
  }
}

/**
 * A reaction to status_gained: the target gains the same status in the same stacks, as a copy (its status_gained is a
 * repeat). Only a status laid at a moment is shared: one with an icon that has a duration, stacks or a block; never a marker,
 * and never a state its holder keeps while something is true of it.
 */
function share(w: W, ctx: Ctx, t: CUnit) {
  const st = ctx.st;
  if (!st?.about || st.on !== "status_gained") return;
  const d = def(w, st.about);
  if (d.label === "marker" || d.show !== "icon" || !(d.duration !== undefined || isIntensity(d) || d.block)) return;
  if (isIntensity(d) && st.amount <= 0) return;
  applyStatus(w, ctx.actor, t, d, { stacks: isIntensity(d) ? st.amount : 1, rng: ctx.actor, copy: true });
}

/** True the first time `key` is asked for the event now being answered; with no event, always. */
export function firstFor(w: W, key: string): boolean {
  const evt = w.evt ?? 0;
  if (!evt) return true;
  const once = (w.f.once ??= {});
  if (once[key] === evt) return false;
  once[key] = evt;
  return true;
}

/**
 * The target gains what the actor's basic attacks carry: its weapon's attached statuses, and the riders of its statuses'
 * reactions to its basic attacks, in the stacks one swing adds. `plain`: only those every swing adds. Two units answering
 * one event add a status from one source once.
 */
function layRiders(w: W, ctx: Ctx, t: CUnit, plain: boolean) {
  const a = ctx.actor;
  const wp = basicOf(w, a).effects[0] as S.DamageEffectT;
  for (const ap of wp.apply ?? []) {
    if (firstFor(w, `riders:${t.id}:weapon:${a.weapon}:${ap.status}`)) applyStatus(w, a, t, def(w, ap.status), { stacks: aval(w, ap.stacks ?? 1, a, t), duration: ap.duration, chance: ap.chance, rng: a });
  }
  for (const s of a.statuses.slice()) {
    const d = def(w, s.id);
    d.reactions?.forEach((r, k) => {
      if (!riderReaction(r, plain) || t.ko) return;
      const rctx: Ctx = { actor: a, kind: null, targets: [], id: d.id, dead: false, st: { d, nums: s.nums, holder: a, src: s.src, per: 1, other: t, owner: a, amount: 0, fixedBoost: false, ...CARRIED_NONE } };
      r.do.forEach((x, j) => {
        if (riderEffect(r, x) && firstFor(w, `riders:${t.id}:${d.id}:${s.src ?? ""}:${k}:${j}`)) run(w, rctx, x);
      });
    });
  }
}

/**
 * The start-of-fight effects of the target's gear and seat happen again: each of those statuses' reactions to its own
 * fight_start, as a repeat, which a reaction for the first start alone (`repeat: false`: a price, a drawback) doesn't hear.
 * One event restarts a unit once, whatever calls for it.
 */
function restart(w: W, ctx: Ctx, t: CUnit) {
  if (!t.opening?.length || !firstFor(w, `restart:${t.id}`)) return;
  const e = ev("fight_start", t, null, { repeat: 1 });
  for (const s of t.statuses.slice()) {
    if (!t.opening.includes(s.id)) continue;
    const d = def(w, s.id);
    d.reactions?.forEach((r, k) => {
      if (r.on.event === "fight_start" && (r.on.whose ?? "holder") === "holder" && r.on.repeat !== false) queueReaction(w, t, t, s, d, k, 1, e, false);
    });
  }
  w.log?.({ t: "restart", vis: "hidden", at: w.f.now, by: ctx.actor.id, unit: t.id });
}

/** The reviver's rule over every revive it makes: `ready` false wins over true; the newest rule's HP. */
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

/** A revive on a timer. The unit stands `after` ticks from now, if it's still down and the fight goes on; the reviver needn't stand. */
function later(w: W, by: CUnit, t: CUnit, hp: number, ready: boolean, after: number) {
  const at = w.f.now + sub(after);
  push(w, { k: "revive", at, b: batch(t.side), g: 1, slot: t.slot, seq: w.f.seq++, unit: t.id, by: by.id, hp: Math.floor(hp), ready });
  w.log?.({ t: "revive_later", vis: "hidden", at: w.f.now, by: by.id, unit: t.id, stands: at });
}
