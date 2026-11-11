/**
 * Events and what listens to them: the event a moment raises, the filters that match it, and the reactions and
 * Intensity triggers it sets off; what a swing carries (riders), and riders borrowed from another unit.
 */
import * as S from "../../../schema.js";
import type { Content } from "../../run.js";
import { aval, batch, type Carried, type CUnit, def, feats, type Item, push, type SInst, SUBTICKS, unit, type W } from "./state.js";
import { basicOf, type HitKind } from "./actions.js";
import { byRule, holds, inSeat, passes } from "./targeting.js";
import { applyStatus, drop } from "./statuses.js";
import { type Ctx, run } from "./effects.js";

// ─── Events and reactions ───────────────────────────────────────────────────

/**
 * An event. `other` names who did it where it's known: the attacker or target of a hit, the healer, the reviver,
 * the applier of a status, the unit whose damage emptied or spent a status or whose effect removed it, the
 * unit whose damage knocked a unit out, and an action's first target.
 */
export type Ev = {
  e: S.EventSpecT["event"];
  owner: CUnit;
  other: CUnit | null;
  /** The event's tags: a hit's (kind and type, crit, area, wide, bare, its strike's own), the killing hit's on a ko, `pulse` on a heal, `area` on a status gained. */
  tags: string[];
  cause: string | null;
  /**
   * Hits and damage: what was dealt. Heals: what was restored. status_gained: the stacks it added, Intensity only.
   * status_ended: the stacks it held as it ended, but an absorb emptied (cause stacks) its peak, and a block (spent)
   * the damage it stopped. action_resolve: the MP it paid. ko: what a killing blow had left over. hp_low and hp_high: the line.
   */
  amount: number;
  /** The status that just ended, so its own reactions to its ending still run. */
  ending: SInst | null;
  /** Status events (for the `source` filter): who applied it, this application's applier, or the instance's source. */
  src: string | null;
  /** Hits: the hit carries what the swing carries, so the riders of its attacker's basic attacks answer it. */
  carry: boolean;
  /** Hits: the HP the unit hit had as the hit landed, in percent of its max. */
  was: number;
  /** Action events: what the action does (an ability filter's `does`). */
  does: ReadonlySet<string> | null;
  /** Status events: the status. Damage events and heals: the status whose pulse or reaction dealt it, if any. */
  status: string | null;
} & Omit<Carried, "ridersOnly" | "on" | "evt" | "about"> & { evt: number };

type EvX = Partial<Omit<Ev, "e" | "owner" | "other">>;
export const ev = (e: Ev["e"], owner: CUnit, other: CUnit | null, x: EvX = {}): Ev => ({
  e, owner, other, kind: x.kind ?? null, tags: x.tags ?? [], status: x.status ?? null, cause: x.cause ?? null, amount: x.amount ?? 0, ending: x.ending ?? null,
  src: x.src ?? null, raw: x.raw ?? 0, dtype: x.dtype ?? null, count: x.count ?? 0, ability: x.ability ?? null, repeat: x.repeat ?? 0,
  stopped: x.stopped ?? 0, bare: x.bare ?? false, passed: x.passed ?? false, price: x.price ?? 0, carry: x.carry ?? false, was: x.was ?? 0, does: x.does ?? null, evt: 0,
});

/** Who `x` is from the holder's side (for the `other` filter): any (there is one), the holder itself, an ally, a foe, its side. */
const related = (who: S.EventSpecT["whose"], x: CUnit | null, holder: CUnit) =>
  !!x && (who === "any" || (who === "holder" ? x === holder : who === "ally" ? x !== holder && x.side === holder.side : who === "team" ? x.side === holder.side : x.side !== holder.side));

/** Whether a status hears an event. `asBasic`: the event is a hit that carries what the swing carries, heard as a basic attack. */
export function matches(w: W, spec: S.EventSpecT, e: Ev, holder: CUnit, asBasic = false): boolean {
  if (spec.event !== e.e) return false;
  const whose = spec.whose ?? "holder";
  if (whose === "holder" && e.owner !== holder) return false;
  if (whose === "ally" && (e.owner === holder || e.owner.side !== holder.side)) return false;
  if (whose === "team" && e.owner.side !== holder.side) return false;
  if (whose === "foe" && e.owner.side === holder.side) return false;
  if (spec.kind && spec.kind !== (asBasic ? "basic" : e.kind)) return false;
  if (spec.tags && !spec.tags.some((t) => e.tags.includes(t))) return false;
  if (spec.notTags && spec.notTags.some((t) => e.tags.includes(t))) return false;
  if (spec.status && spec.status !== e.status) return false;
  if (spec.cause && !spec.cause.includes(e.cause as never)) return false;
  if (spec.other && !related(spec.other, e.other, holder)) return false;
  if (spec.source === "holder" && e.src !== holder.id) return false;
  if (spec.seat !== undefined && !inSeat(w, holder, e.owner, spec.seat)) return false;
  if (spec.amountAtLeast !== undefined && !(e.amount >= spec.amountAtLeast)) return false;
  if (spec.countAtLeast !== undefined && !(e.count >= spec.countAtLeast)) return false;
  if (spec.repeat !== undefined && e.repeat > 0 !== spec.repeat) return false;
  if (spec.line !== undefined && spec.line !== e.amount) return false;
  if (spec.ability && !(e.ability && (spec.ability.includes(e.ability) || spec.ability.includes(S.formBase(e.ability))))) return false;
  if (spec.does && !spec.does.some((x) => e.does?.has(x))) return false;
  if (spec.paid && !(e.amount > 0 || e.price > 0)) return false;
  if (spec.counted && e.repeat === 1) return false;
  if (spec.wasBelow !== undefined && !(e.was < spec.wasBelow)) return false;
  return true;
}

/**
 * A rider: a status a reaction to the holder's own hit_lands applies to the unit it hit. It's part of what a swing
 * carries: a hit that carries nothing skips it, a hit that only carries runs nothing else, and another unit can borrow it.
 */
export const riderEffect = (r: S.ReactionT, e: S.EffectT) =>
  r.on.event === "hit_lands" && (r.on.whose ?? "holder") === "holder" && (e.op === "apply" || e.op === "one") && e.to === "other" && !(e.op === "apply" && e.rider === false);
/** A reaction that answers the holder's basic attacks with at least one rider. `plain`: on every swing, with no test, tag or other filter. */
export function riderReaction(r: S.ReactionT, plain = false): boolean {
  const on = r.on;
  if (on.event !== "hit_lands" || (on.whose ?? "holder") !== "holder" || (on.kind && on.kind !== "basic") || !r.do.some((e) => riderEffect(r, e))) return false;
  return !plain || (!r.if && Object.keys(on).every((k) => k === "event" || k === "whose" || k === "kind"));
}

/** The statuses that listen to each event, through their reactions or their Intensity trigger, by event. */
const listening = new WeakMap<Content, Map<string, Set<string>>>();
export function listeners(w: W, event: string): Set<string> | undefined {
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

/** Of the units on a side that hold a `party` status, only the first standing in slot order answers. */
function speaksFor(w: W, h: CUnit, d: S.StatusT): boolean {
  if (!d.party) return true;
  const first = w.f.units.filter((u) => u.side === h.side && !u.ko && u.statuses.some((s) => s.id === d.id)).sort((a, b) => a.slot - b.slot)[0];
  return !first || first === h;
}

type Answer = { actor: CUnit; holder: CUnit; s: SInst; d: S.StatusT; k: number; dead: boolean; ridersOnly: boolean };

export function fire(w: W, e: Ev) {
  if (w.f.result) return;
  if (w.depth > 64) {
    w.log?.({ t: "stop", vis: "hidden", at: w.f.now, why: `event chain too deep at ${e.e}` });
    return;
  }
  // Most events have no status anywhere in the content listening to them.
  const ids = listeners(w, e.e);
  if (!ids) return;
  if (!e.evt) e.evt = ++w.f.seq;
  w.depth++;
  const answers: Answer[] = [];
  // A hit that carries what the swing carries, without being a basic attack: its attacker's basic riders answer it.
  const carried = e.e === "hit_lands" && e.carry && e.kind !== "basic";
  for (const h of w.f.units.slice()) {
    const own = e.ending && h === e.owner;
    if (!own && !h.statuses.some((s) => ids.has(s.id))) continue;
    const list = own ? [...h.statuses, e.ending!] : h.statuses.slice();
    for (const s of list) {
      if (!ids.has(s.id)) continue;
      const d = def(w, s.id);
      if (!speaksFor(w, h, d)) continue;
      if (d.trigger && s !== e.ending && h.statuses.includes(s) && matches(w, d.trigger.on, e, h)) trigger(w, h, s, d, e);
      d.reactions?.forEach((r, k) => {
        let ridersOnly = false;
        if (!matches(w, r.on, e, h)) {
          // Heard as a basic attack, for its riders alone; not by a status that answers this kind of hit itself.
          if (!carried || h !== e.owner || !riderReaction(r) || !matches(w, r.on, e, h, true)) return;
          if (d.reactions!.some((x) => x.on.event === e.e && x.on.kind === e.kind)) return;
          ridersOnly = true;
        }
        const actor = unit(w, r.actor === "source" ? s.src : h.id);
        if (!actor) return;
        // A unit's own statuses that survive its KO can react to it (Volatile); otherwise KO'd units don't act.
        const dead = actor.ko && e.e === "ko" && actor === e.owner && actor === h;
        if (!actor.ko || dead) answers.push({ actor, holder: h, s, d, k, dead, ridersOnly });
      });
      if (w.f.result) break;
    }
    if (w.f.result) break;
  }
  // Riders borrowed: the attacker's basic attacks (and its hits that carry) also carry another unit's.
  if (e.e === "hit_lands" && (e.kind === "basic" || e.carry) && feats(w.c).borrow && !w.f.result) borrowed(w, e, answers);
  // Reactions that share a `split` word share the event's amount evenly.
  const sharing: Record<string, number> = {};
  for (const a of answers) {
    const sp = a.d.reactions![a.k].split;
    if (sp) sharing[sp] = (sharing[sp] ?? 0) + 1;
  }
  for (const a of answers) {
    const sp = a.d.reactions![a.k].split;
    queueReaction(w, a.actor, a.holder, a.s, a.d, a.k, 1, sp && sharing[sp] > 1 ? { ...e, amount: e.amount / sharing[sp] } : e, a.dead, a.ridersOnly);
  }
  w.depth--;
}

/**
 * A unit with `borrow` lands a basic attack: the riders of the unit it borrows from answer too, as its own would: on the
 * same conditions, with stacks read off the borrower, and never twice from a status both hold from one source. The lender's
 * weapon lends its attached statuses the same way. What's borrowed isn't borrowed on: only the lender's own statuses count.
 */
function borrowed(w: W, e: Ev, answers: Answer[]) {
  const b = e.owner, t = e.other;
  for (const bs of b.statuses) {
    const rule = def(w, bs.id).borrow;
    if (!rule) continue;
    const lender = byRule(w, b, rule.from, { seek: true, main: false, targets: [] })[0];
    if (!lender || lender === b || lender.ko) continue;
    for (const s of lender.statuses) {
      const d = def(w, s.id);
      if (!d.reactions || b.statuses.some((x) => x.id === s.id && x.src === s.src)) continue;
      d.reactions.forEach((r, k) => {
        if (riderReaction(r) && matches(w, r.on, e, b, e.kind !== "basic")) answers.push({ actor: b, holder: b, s, d, k, dead: false, ridersOnly: true });
      });
    }
    const wp = basicOf(w, lender).effects[0] as S.DamageEffectT;
    if (t && !t.ko && lender.weapon !== b.weapon) for (const ap of wp.apply ?? []) applyStatus(w, b, t, def(w, ap.status), { stacks: aval(w, ap.stacks ?? 1, b, t), duration: ap.duration, chance: ap.chance, rng: b });
  }
}

/** An Intensity event trigger: its effects use the total from this moment and resolve next sub-tick; the drop is immediate. */
function trigger(w: W, h: CUnit, s: SInst, d: S.StatusT, e: Ev) {
  if (d.trigger!.do?.length && !h.ko) queueReaction(w, h, h, s, d, -1, s.stacks / SUBTICKS, e, false);
  fire(w, ev("status_triggered", h, null, { status: d.id, src: s.src }));
  if (h.statuses.includes(s)) drop(w, h, s, d);
}

/** A reaction resolves on the sub-tick after its event, in the acting unit's batch. */
export function queueReaction(w: W, actor: CUnit, holder: CUnit, s: SInst, d: S.StatusT, which: number, per: number, e: Ev, dead: boolean, ridersOnly = false) {
  push(w, {
    k: "react", at: w.f.now + 1, b: batch(actor.side), g: 1, slot: actor.slot, seq: w.f.seq++, unit: actor.id,
    holder: holder.id, status: d.id, which, nums: s.nums.slice(), src: s.src, per,
    other: e.other?.id ?? null, owner: e.owner.id, amount: e.amount, dead,
    ...carriedOf(e, ridersOnly),
  });
}

/** What a reaction keeps of its event. */
export const carriedOf = (e: Ev, ridersOnly = false): Carried => ({
  raw: e.raw, dtype: e.dtype, count: e.count, ability: e.ability, repeat: e.repeat, on: e.e, evt: e.evt, kind: e.kind, about: e.status,
  stopped: e.stopped, bare: e.bare, ridersOnly, passed: e.passed, price: e.price,
});

export function react(w: W, it: Extract<Item, { k: "react" }>) {
  const actor = unit(w, it.unit);
  if (!actor || (actor.ko && !it.dead)) return;
  const d = def(w, it.status);
  const r = it.which < 0 ? null : d.reactions![it.which];
  const effects = r ? r.do : d.trigger!.do!;
  const st: NonNullable<Ctx["st"]> = {
    d, nums: it.nums, holder: unit(w, it.holder)!, src: it.src, per: it.per, other: unit(w, it.other), owner: unit(w, it.owner), amount: it.amount, fixedBoost: it.which < 0,
    raw: it.raw, dtype: it.dtype, count: it.count, ability: it.ability, repeat: it.repeat, on: it.on, evt: it.evt, kind: it.kind, about: it.about,
    stopped: it.stopped, bare: it.bare, ridersOnly: it.ridersOnly, passed: it.passed, price: it.price,
  };
  // A reaction's tests are read as it resolves, not when its event fired; one that fails does nothing.
  if (r?.if && ![r.if].flat().every((t) => passesTest(w, actor, t, st))) return;
  const ctx: Ctx = { actor, kind: null, targets: [], id: d.id, dead: it.dead, st };
  const was = w.evt;
  w.evt = it.evt;
  for (const e of effects) {
    // A bare hit carries no riders; a hit that only carries, or lends its riders, runs nothing else.
    const rider = !!r && riderEffect(r, e);
    if ((it.bare && rider) || (it.ridersOnly && !rider)) continue;
    run(w, ctx, e);
    if (w.f.result || (actor.ko && !it.dead)) break;
  }
  w.evt = was;
}

/** One of a reaction's tests: a side's state read from the actor's side, or the event's other unit or owner passing a test. */
function passesTest(w: W, actor: CUnit, t: S.TestT, st: NonNullable<Ctx["st"]>): boolean {
  if ("unit" in t) {
    const x = t.unit === "other" ? st.other : st.owner;
    return !!x && passes(w, x, t.where, actor);
  }
  return holds(w, actor, t);
}
