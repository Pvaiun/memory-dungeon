/**
 * Events and what listens to them: the event a moment raises, the filters that match it, and the reactions and
 * Intensity triggers it sets off.
 */
import * as S from "../../../schema.js";
import type { Content } from "../../run.js";
import { batch, type Carried, type CUnit, def, type Item, push, type SInst, SUBTICKS, unit, type W } from "./state.js";
import type { HitKind } from "./actions.js";
import { holds, inSeat, passes } from "./targeting.js";
import { drop } from "./statuses.js";
import { type Ctx, run } from "./effects.js";

// ─── Events and reactions ───────────────────────────────────────────────────

/**
 * An event. `other` names who did it where it's known: the attacker or target of a hit, the healer, the reviver,
 * the applier of a status, the unit whose damage emptied or spent a status or whose effect removed it, and the
 * unit whose damage knocked a unit out.
 */
export type Ev = {
  e: S.EventSpecT["event"];
  owner: CUnit;
  other: CUnit | null;
  /** Action and hit events; ko, healed and overhealed: the kind of the hit or action behind it. */
  kind: HitKind | null;
  /** Hit events: the hit's tags (kind and type, crit, area). */
  tags: string[];
  /** Status events: the status. Damage events: the status whose pulse or reaction dealt it, if any. */
  status: string | null;
  cause: string | null;
  /**
   * Hits and damage: what was dealt. Heals: what was restored. status_gained: the stacks it added, Intensity only.
   * status_ended: the stacks it held as it ended, but an absorb emptied (cause stacks) its peak, and a block (spent)
   * the damage it stopped. action_resolve: the MP it paid.
   */
  amount: number;
  /** The status that just ended, so its own reactions to its ending still run. */
  ending: SInst | null;
  /** Status events (for the `source` filter): who applied it, this application's applier, or the instance's source. */
  src: string | null;
} & Carried;

type EvX = Partial<Omit<Ev, "e" | "owner" | "other">>;
export const ev = (e: Ev["e"], owner: CUnit, other: CUnit | null, x: EvX = {}): Ev => ({
  e, owner, other, kind: x.kind ?? null, tags: x.tags ?? [], status: x.status ?? null, cause: x.cause ?? null, amount: x.amount ?? 0, ending: x.ending ?? null,
  src: x.src ?? null, raw: x.raw ?? 0, dtype: x.dtype ?? null, count: x.count ?? 0, ability: x.ability ?? null, repeat: x.repeat ?? false,
});

/** Who `x` is from the holder's side (for the `other` filter): any (there is one), the holder itself, an ally, a foe. */
const related = (who: S.EventSpecT["whose"], x: CUnit | null, holder: CUnit) =>
  !!x && (who === "any" || (who === "holder" ? x === holder : who === "ally" ? x !== holder && x.side === holder.side : x.side !== holder.side));

/**
 * Whether a status hears an event. `d` is the listening status, for echo: an extra strike the holder made is
 * heard as a basic attack by its own statuses, but not by one that names kind extra for the same event or gives strikes.
 */
export function matches(w: W, spec: S.EventSpecT, e: Ev, holder: CUnit, d?: S.StatusT): boolean {
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
 * The kind a status hears an event as. An echoing holder's own extra strikes are basic attacks to it, with two
 * exceptions. A status gives strikes itself through `strike` or a reaction that strikes: one that strikes on a
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

export function fire(w: W, e: Ev) {
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

/** An Intensity event trigger: its effects use the total from this moment and resolve next sub-tick; the drop is immediate. */
function trigger(w: W, h: CUnit, s: SInst, d: S.StatusT, e: Ev) {
  if (d.trigger!.do?.length && !h.ko) queueReaction(w, h, h, s, d, -1, s.stacks / SUBTICKS, e, false);
  fire(w, ev("status_triggered", h, null, { status: d.id, src: s.src }));
  if (h.statuses.includes(s)) drop(w, h, s, d);
}

/** A reaction resolves on the sub-tick after its event, in the acting unit's batch. */
function queueReaction(w: W, actor: CUnit, holder: CUnit, s: SInst, d: S.StatusT, which: number, per: number, e: Ev, dead: boolean) {
  push(w, {
    k: "react", at: w.f.now + 1, b: batch(actor.side), g: 1, slot: actor.slot, seq: w.f.seq++, unit: actor.id,
    holder: holder.id, status: d.id, which, nums: s.nums.slice(), src: s.src, per,
    other: e.other?.id ?? null, owner: e.owner.id, amount: e.amount, dead,
    raw: e.raw, dtype: e.dtype, count: e.count, ability: e.ability, repeat: e.repeat,
  });
}

export function react(w: W, it: Extract<Item, { k: "react" }>) {
  const actor = unit(w, it.unit);
  if (!actor || (actor.ko && !it.dead)) return;
  const d = def(w, it.status);
  const r = it.which < 0 ? null : d.reactions![it.which];
  const effects = r ? r.do : d.trigger!.do!;
  const st: NonNullable<Ctx["st"]> = {
    d, nums: it.nums, holder: unit(w, it.holder)!, src: it.src, per: it.per, other: unit(w, it.other), owner: unit(w, it.owner), amount: it.amount, fixedBoost: it.which < 0,
    raw: it.raw, dtype: it.dtype, count: it.count, ability: it.ability, repeat: it.repeat,
  };
  // A reaction's tests are read as it resolves, not when its event fired; one that fails does nothing.
  if (r?.if && ![r.if].flat().every((t) => passesTest(w, actor, t, st))) return;
  const ctx: Ctx = { actor, kind: null, targets: [], id: d.id, dead: it.dead, st };
  for (const e of effects) {
    run(w, ctx, e);
    if (w.f.result || (actor.ko && !it.dead)) return;
  }
}

/** One of a reaction's tests: a side's state read from the actor's side, or the event's other unit or owner passing a test. */
function passesTest(w: W, actor: CUnit, t: S.TestT, st: NonNullable<Ctx["st"]>): boolean {
  if ("unit" in t) {
    const x = t.unit === "other" ? st.other : st.owner;
    return !!x && passes(w, x, t.where, actor);
  }
  return holds(w, actor, t);
}
