/**
 * Who an action picks (and the core set's Taunt and Hidden rules): draw from Aggro, Seek, focus, target rules, the
 * tests and conditions they read, and seats.
 */
import * as S from "../../../schema.js";
import { compile } from "../stats.js";
import { next } from "../../rng.js";
import { type CUnit, def, hidden, isIntensity, living, stat, SUBTICKS, taunting, total, type W } from "./state.js";
import { actDef, type ActDef, cooldownOf, type Target, weaponOf } from "./actions.js";
import { capOf } from "./statuses.js";

// ─── Targeting (and the core set's Taunt and Hidden rules) and conditions ───

/** Whether `x` passes a test. `ref` is the reading unit (for `lower`): the acting unit, a reaction's actor, a pulse's holder. */
export function passes(w: W, x: CUnit, c: S.UnitCondT, ref?: CUnit | null): boolean {
  if (c.ko !== undefined && x.ko !== c.ko) return false;
  // Has any of, a stat lower than the reader's, acted, the top of its side, wields a kind.
  if (c.hasAny !== undefined && !c.hasAny.some((id) => x.statuses.some((s) => s.id === id))) return false;
  if (c.lower !== undefined && !(ref && stat(w, x, c.lower.stat) < stat(w, ref, c.lower.stat))) return false;
  if (c.acted !== undefined && !!x.acted !== c.acted) return false;
  if (c.top !== undefined && !onTop(w, x, c.top.stats)) return false;
  if (c.weapon !== undefined && !c.weapon.includes(weaponOf(w.c, x.weapon).kind ?? "")) return false;
  if (c.hpBelow !== undefined && !(x.hp * 100 < c.hpBelow * x.stats.max_hp)) return false;
  if (c.hpAtLeast !== undefined && !(x.hp * 100 >= c.hpAtLeast * x.stats.max_hp)) return false;
  // MP as a share of max MP (Clarity waits for an ally who needs it). A unit with no MP pool is never "below".
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

/** No living unit on its side has more of the highest of these stats; ties pass. */
function onTop(w: W, x: CUnit, stats: readonly string[]): boolean {
  const best = (u: CUnit) => Math.max(...stats.map((k) => stat(w, u, k)));
  const v = best(x);
  return !w.f.units.some((u) => u.side === x.side && !u.ko && best(u) > v);
}

/**
 * The seat a seat field names, read from `reader`'s place: a position id as written, or `next` / `previous`, the
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
export const inSeat = (w: W, reader: CUnit, x: CUnit, seat: string) => {
  const id = seatId(w, reader, seat);
  return id !== null && x.seat === id;
};

const ids = (x: string | string[]) => (Array.isArray(x) ? x : [x]);
export const hasKind = (d: S.StatusT, kind: string, tag?: string) => compile(d).kinds.some(([k, t]) => k === kind && (tag === undefined || t === tag));

/** Holds this Intensity status at its cap (a Shield at its cap counts as already there for the Fizzle rule). */
function atCap(w: W, x: CUnit, id: string): boolean {
  const s = x.statuses.find((i) => i.id === id);
  if (!s) return false;
  const d = def(w, id);
  return isIntensity(d) && s.stacks >= capOf(w, d, s.nums, x);
}

/** The units a rule can see on a side: living ones, or, when the rule asks for `ko: true`, the knocked-out ones still in the fight. */
export function sideOf(w: W, u: CUnit, side: S.TargetRuleT["side"], ko = false): CUnit[] {
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

/** At least `atLeast` units on the side pass (default 1, or 0 when `atMost` is given), and no more than `atMost`, in its seat if it names one. */
export function holds(w: W, u: CUnit, c: S.ConditionT) {
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
  // The basic attack's interval now, its cooldown after Attack speed: highest is the slowest.
  if (by === "swing") {
    const i = x.acts.findIndex((a) => a.id === "basic");
    return i < 0 ? 0 : cooldownOf(w, x, actDef(w, x, i));
  }
  if ("stat" in by) return stat(w, x, by.stat);
  if ("stats" in by) return Math.max(...by.stats.map((k) => stat(w, x, k)));
  return total(x, by.stacks) / SUBTICKS;
}

/**
 * A unit's draw: how strongly it pulls a foe's pick, from its Aggro. A party unit's comes from ruleset.partyDraw when the
 * ruleset has one (doubling every so many points, held between a floor and a cap); otherwise, and for enemy units
 * always (the party's picks among its foes), from ruleset.draw's curve. Without either, Aggro itself.
 */
export function drawOf(r: Pick<S.ContentPack["ruleset"], "draw" | "partyDraw">, aggro: number, side: CUnit["side"] = "enemy"): number {
  const p = side === "party" ? r.partyDraw : undefined;
  if (p) {
    // centre × 2^n × (1 + f): whole doublings by halving or doubling (exact), then an even climb to the next. No powers (guard.test.ts).
    const n = (Math.min(p.cap, Math.max(p.floor, aggro)) - p.centre) / p.double;
    const whole = Math.floor(n);
    let base = p.centre;
    for (let i = 0; i < whole; i++) base *= 2;
    for (let i = 0; i > whole; i--) base /= 2;
    return base * (1 + (n - whole));
  }
  const c = r.draw;
  if (!c) return Math.max(0, aggro);
  const d = Math.abs(aggro - c.centre);
  return aggro >= c.centre ? (c.centre * (c.k + c.max * d)) / (c.k + d) : (c.centre * (c.k + d)) / (c.k + c.max * d);
}

function weightedPick(w: W, u: CUnit, pool: CUnit[], what: string): CUnit {
  const weights = pool.map((x) => drawOf(w.c.pack.ruleset, stat(w, x, "aggro"), x.side));
  const sum = weights.reduce((a, b) => a + b, 0);
  const r = next(u.rng) * sum;
  w.log?.({ t: "roll", vis: "hidden", at: w.f.now, by: u.id, what, roll: r, of: sum });
  let acc = 0;
  for (let i = 0; i < pool.length; i++) if ((acc += weights[i]) > r) return pool[i];
  return pool[pool.length - 1];
}

export function randomIndex(w: W, u: CUnit, n: number, what: string): number {
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
  /** Reactions: the event's other unit and the unit it's about, for `exclude`. */
  other?: CUnit | null;
  owner?: CUnit | null;
};

export function byRule(w: W, u: CUnit, r: S.TargetRuleT, o: PickOpts): CUnit[] {
  const ko = r.where?.ko === true;
  // Hidden units can't be picked by any rule but `all`, unless every foe is Hidden.
  let pool = r.side === "foes" && !ko && r.pick !== "all" ? visibleFoes(w, u) : sideOf(w, u, r.side, ko);
  if (r.exclude === "targets") pool = pool.filter((x) => !o.targets.includes(x));
  // Skip the event's other unit or owner; only the unit in a seat.
  else if (r.exclude === "other") pool = pool.filter((x) => x !== o.other);
  else if (r.exclude === "owner") pool = pool.filter((x) => x !== o.owner);
  if (r.seat !== undefined) pool = pool.filter((x) => inSeat(w, u, x, r.seat!));
  if (r.where) {
    const kept = pool.filter((x) => passes(w, x, r.where!, u));
    if (kept.length || r.ifNone !== "any") pool = kept;
    else if (ko) {
      // A rule for the fallen with nobody fallen: the living side instead, by the rule's other tests (Choosing: the fallen first, else the lowest).
      const { ko: _ko, ...rest } = r.where;
      const alive = r.side === "foes" && r.pick !== "all" ? visibleFoes(w, u) : sideOf(w, u, r.side, false);
      const keptAlive = Object.keys(rest).length ? alive.filter((x) => passes(w, x, rest, u)) : alive;
      pool = keptAlive.length ? keptAlive : alive;
    }
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

/** An action's targets as it resolves. `kind`: a basic attack picks in the order `basicPick` gives. */
export function choose(w: W, u: CUnit, t: Target, seek: boolean, kind?: ActDef["kind"]): CUnit[] {
  if (t === "self") return u.ko ? [] : [u];
  if (t === "ally") {
    const own = living(w, u.side);
    return own.length ? [randomPick(w, u, own, "target")] : [];
  }
  if (t === "foe") return kind === "basic" ? basicPick(w, u, seek) : defaultFoe(w, u, seek);
  return byRule(w, u, t, { seek, main: true, targets: [] });
}

/**
 * A basic attack picks, in order, by an aim the attacker holds that comes first; a foe holding a
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

/** A foe holding a focus status that can be picked, by draw among several; a Taunting foe still takes the pick unless the attack has Seek. */
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
