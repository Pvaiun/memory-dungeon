/**
 * An action's, pulse's or reaction's effects, one by one: their targets and numbers, and every op but damage and
 * healing (damage.ts): cooldown changes, HP prices, reaction strikes, timed revives.
 */
import * as S from "../../../schema.js";
import { sub } from "../stats.js";
import { aval, batch, type Carried, type CUnit, def, feats, push, sval, unit, type W } from "./state.js";
import { actDef, cooldownOf, type HitKind, type Mods, recast, stackMult } from "./actions.js";
import { byRule, randomIndex } from "./targeting.js";
import { replace, revive, summon } from "./units.js";
import { heal, hit, strike } from "./damage.js";
import { applyStatus, remove } from "./statuses.js";

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
  else out = byRule(w, ctx.actor, t, { seek: true, main: false, targets: ctx.targets, other: st?.other ?? null, owner: st?.owner ?? null });
  const wantKo = e.op === "revive";
  return out.filter((x): x is CUnit => !!x && (wantKo ? x.ko && !x.gone : !x.ko));
}

/** An effect's number, in its context, for one target. Pulses and triggers scale with the Intensity total. */
export function num(w: W, ctx: Ctx, owner: object, n: S.NumT, target: CUnit): number {
  const st = ctx.st;
  if (!st) return aval(w, n, ctx.actor, target, ctx);
  return sval(w, { d: st.d, nums: st.nums, holder: st.holder, actor: ctx.actor, amount: st.amount }, owner, n, target) * st.per;
}

export function run(w: W, ctx: Ctx, e: S.EffectT) {
  if (e.op === "summon") {
    if (!w.f.result && (!ctx.actor.ko || ctx.dead)) summon(w, ctx.actor, ctx.actor.side, e.enemy, e.count ?? 1);
    return;
  }
  if (e.op === "recast") return recast(w, ctx);
  const ts = targetsOf(w, ctx, e);
  // A damage effect aimed at two or more units at once makes `area` hits.
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
        // Log only: who gave it, from what, and whether a status's pulse (regen, Clarity) or an action or reaction.
        w.log?.({ t: "mp", vis: "hidden", at: w.f.now, target: t.id, amount: v, mp: t.mp, by: ctx.actor.id, src: ctx.id, part: ctx.st ? (ctx.st.fixedBoost ? "pulse" : "reaction") : "action" });
        break;
      }
      case "apply":
        // An ability's changes can add stacks to its applications.
        applyStatus(w, ctx.actor, t, def(w, e.status), { stacks: num(w, ctx, e, e.stacks ?? 1, t) * stackMult(w, ctx.mod, e.status), duration: e.duration, chance: e.chance, rng: ctx.actor });
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
        pay(w, t, num(w, ctx, e, e.hp, t));
        break;
      case "strike":
        reactionStrike(w, ctx, t, e, area);
        break;
      case "one": {
        // One of these statuses, picked at random on the actor's dice, for each target.
        const ap = e.of[randomIndex(w, ctx.actor, e.of.length, "one")];
        applyStatus(w, ctx.actor, t, def(w, ap.status), { stacks: num(w, ctx, ap, ap.stacks ?? 1, t) * stackMult(w, ctx.mod, ap.status), duration: ap.duration, chance: ap.chance, rng: ctx.actor });
        break;
      }
    }
  }
}

/**
 * Changes the cooldown left on a unit's basic attack or abilities. `longest` and `soonest` pick among the
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

/** HP as a price: lost at once, but not damage, so no Shield soaks it, no Armor cuts it and nothing reacts. Never below 1 HP. */
export function pay(w: W, t: CUnit, amount: number) {
  const v = Math.min(Math.floor(amount), t.hp - 1);
  if (v <= 0 || t.ko) return;
  t.hp -= v;
  w.log?.({ t: "pay", vis: "player", at: w.f.now, unit: t.id, amount: v, hp: t.hp });
}

/**
 * Reactions only: a hit of kind extra by the actor, sized `share` % of its basic attack's damage against the
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
