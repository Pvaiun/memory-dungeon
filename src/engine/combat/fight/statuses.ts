/**
 * Statuses: applying one (immunity, caps, control resistance), ending, interrupting and holding casts, removing,
 * moving and pulsing them.
 */
import * as S from "../../../schema.js";
import { compile, sub } from "../stats.js";
import { next } from "../../rng.js";
import { batch, boostOf, CARRIED_NONE, type CUnit, def, fixed, foeSide, isIntensity, type Item, perOf, push, refresh, type SInst, stat, SUBTICKS, sval, taunting, unit, type W } from "./state.js";
import { ev, fire } from "./events.js";
import { actDef, cooldownOf, covers } from "./actions.js";
import { hasKind, holds, randomIndex } from "./targeting.js";
import { type Ctx, run } from "./effects.js";

// ─── Statuses ───────────────────────────────────────────────────────────────

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
  // An Intensity application of no stacks does nothing, not even an IMMUNE (see below).
  if (isIntensity(d) && o.stacks <= 0) return;
  if (immune(w, to, d)) {
    w.log?.({ t: "immune", vis: "player", at: f.now, unit: to.id, status: d.id, name: d.name });
    return;
  }
  // A status that hides its holder doesn't land on a Taunting unit (no IMMUNE: it just doesn't land).
  if (forbids(d) && taunting(w, to)) return;
  // A boss's control resistance, the one exception to universal statuses: at its cap the control doesn't
  // land at all, and from `resist.at` stacks it lands for a share of its own length.
  const ctl = controlOf(w, to, d);
  if (ctl && (to.ctrl ?? 0) >= ctl.cap) {
    w.log?.({ t: "immune", vis: "player", at: f.now, unit: to.id, status: d.id, name: d.name, why: "control" });
    return;
  }
  const dur = o.duration ?? d.duration ?? "permanent";
  if (dur === 0) {
    // An instant lockout only interrupts, and leaves no status.
    if (d.lockout?.interrupt) interrupt(w, to, d.lockout.covers);
    return;
  }
  const resisted = !!ctl && dur !== "permanent" && (to.ctrl ?? 0) >= ctl.resist.at;
  const end = dur === "permanent" ? -1 : f.now + (resisted ? Math.floor((sub(dur) * ctl!.resist.pct) / 100) : sub(dur));
  const cp = compile(d);
  const nums = cp.nums.map(({ n, stat: isStat }) => fixed(w, n, by, to, isStat));
  // Only the stacks an application adds can scale: from the applier's stated scaling, and its boosts that name
  // the status or one of its tags. The applier's boosts never reach the status's own numbers, but they can read
  // the unit receiving the stacks.
  const add = isIntensity(d) ? Math.floor(o.stacks * (1 + boostOf(w, by, [d.id, ...(d.tags ?? [])], to) / 100) * SUBTICKS) : 0;
  const cur = to.statuses.find((s) => s.id === d.id && (!d.perSource || s.src === by.id));
  if (cur && d.stacking === "fizzle") return;
  // An Intensity status exists only at 1 stack or more, and an application that adds no stacks does nothing at
  // all: no log, no event, no fresh duration (Frostbite bow's Sunder, whose count is 0 below 8 Chill).
  if (isIntensity(d) && (add <= 0 || (!cur && Math.min(add, capOf(w, d, nums, to)) < SUBTICKS))) return;
  // Each applier keeps one copy of a `single` status: this one ends the copy it gave anywhere else.
  if (d.single) for (const o2 of f.units) if (o2 !== to) for (const s of o2.statuses.slice()) if (s.id === d.id && s.src === by.id) endStatus(w, o2, s, "removed", { other: by });
  if (to.ko || f.result) return;
  if (ctl) controlled(w, to, d, ctl, resisted, end);
  if (cur) {
    const before = cur.stacks;
    if (d.stacking === "refresh") {
      // The new application replaces the old: its duration, its numbers and its source.
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
  // A status with one applier at a time knows it; a shared Intensity total has no single source.
  const inst: SInst = { uid: f.seq++, id: d.id, src: d.perSource || !isIntensity(d) ? by.id : null, at: f.now, end, stacks: 0, nums };
  inst.stacks = isIntensity(d) ? Math.min(capOf(w, d, nums, to), add) : 0;
  to.statuses.push(inst);
  if (d.pulse) push(w, { k: "pulse", at: f.now + sub(d.pulse.every), b: pulseBatch(to, d), g: 0, slot: to.slot, seq: f.seq++, unit: to.id, uid: inst.uid });
  gained(w, to, d, inst, by, inst.stacks);
}

/** The status makes its holder unpickable (Hidden). */
export const forbids = (d: S.StatusT) => !!d.stats?.some((ch) => ch.stat === "forbidden");

/** The control-resistance rule that covers `d` landing on `u`, or null: an enemy of a listed rank, and a listed status. */
function controlOf(w: W, u: CUnit, d: S.StatusT): S.ControlT | null {
  const c = w.c.pack.ruleset.control;
  if (!c || u.side !== "enemy" || !c.statuses.includes(d.id)) return null;
  const rank = w.c.enemies.get(u.ref)?.rank;
  return rank && c.ranks.includes(rank) ? c : null;
}

/** A control landed on a resisting unit: RESISTED if it was shortened, then one more stack (to the cap). */
function controlled(w: W, u: CUnit, d: S.StatusT, c: S.ControlT, resisted: boolean, end: number) {
  if (resisted) w.log?.({ t: "resisted", vis: "player", at: w.f.now, unit: u.id, status: d.id, name: d.name, end });
  setControl(w, u, c, Math.min(c.cap, (u.ctrl ?? 0) + 1));
}

/** Control stacks change; a stack drains `drain` ticks after the last change, and every change restarts the wait. */
function setControl(w: W, u: CUnit, c: S.ControlT, n: number) {
  u.ctrl = n;
  w.log?.({ t: "control", vis: "hidden", at: w.f.now, unit: u.id, stacks: n });
  w.f.queue = w.f.queue.filter((it) => !(it.k === "drain" && it.unit === u.id));
  if (n > 0) push(w, { k: "drain", at: w.f.now + sub(c.drain), b: batch(u.side), g: 3, slot: u.slot, seq: w.f.seq++, unit: u.id });
}

export function drain(w: W, it: Extract<Item, { k: "drain" }>) {
  const u = unit(w, it.unit), c = w.c.pack.ruleset.control;
  if (u && c && u.ctrl) setControl(w, u, c, u.ctrl - 1);
}

/** An application landed. `added`: the stacks it added, in thousandths (Intensity only), which the event reports. */
function gained(w: W, to: CUnit, d: S.StatusT, s: SInst, by?: CUnit, added = 0) {
  if (d.absorb) s.peak = Math.max(s.peak ?? 0, s.stacks);
  w.log?.({
    t: "status", vis: d.show === "icon" ? "player" : "hidden", at: w.f.now, unit: to.id, status: d.id, name: d.name, ...(by ? { by: by.id } : {}),
    total: isIntensity(d) ? s.stacks / SUBTICKS : null, end: s.end,
  });
  if (d.stats) refresh(w, to);
  if (d.lockout?.interrupt) interrupt(w, to, d.lockout.covers);
  if (d.lockout?.pause && s.end !== -1) hold(w, to, d.lockout.covers, s.end - w.f.now);
  // Other is the applier, and an Intensity application says how many stacks it added.
  fire(w, ev("status_gained", to, by ?? null, { status: d.id, amount: added / SUBTICKS, src: by?.id ?? null }));
  // An Intensity status that stands at its cap after an application has capped (Chill shatters). Other: the applier.
  if (isIntensity(d) && compile(d).cap >= 0 && s.stacks >= capOf(w, d, s.nums, to) && to.statuses.includes(s)) fire(w, ev("status_capped", to, by ?? null, { status: d.id, src: by?.id ?? null }));
}

export const capOf = (w: W, d: S.StatusT, nums: number[], holder: CUnit) =>
  compile(d).cap < 0 ? Number.MAX_SAFE_INTEGER : Math.floor(sval(w, { d, nums, holder, actor: holder, amount: 0 }, d, d.cap!, null) * SUBTICKS);

/** A debuff's pulse resolves in the batch of the holder's foes; a buff's, or a marker's, in its own side's. */
const pulseBatch = (holder: CUnit, d: S.StatusT) => (d.label === "debuff" ? batch(foeSide(holder)) : batch(holder.side));

/**
 * Who ended a status, and what its ending reports. `other`: the unit whose damage emptied or spent it
 * (`take` passes it), or whose effect removed it. `amount`: the damage a block stopped (`take` passes it
 * for cause spent); otherwise the engine works it out: an absorb emptied (cause stacks) reports its peak, and every
 * other ending the stacks it held.
 */
export type Ending = { other?: CUnit | null; amount?: number };

export function endStatus(w: W, u: CUnit, s: SInst, cause: S.CauseT, by: Ending = {}) {
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
 * no cooldown; under ruleset.lostCast "cooldown" the action goes on cooldown.
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

/** Removes buffs or debuffs, newest first or at random, skipping unremovable ones and a dispel-immune unit's buffs. */
export function remove(w: W, by: CUnit, t: CUnit, e: Extract<S.EffectT, { op: "remove" }>) {
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
    // A moved status passes to the acting unit as it was.
    if (e.move) give(w, by, s);
  }
}

/**
 * A status taken from another unit lands on `to` as it was: its stacks, numbers, source and time left. Not on
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

/** On each trigger the total drops by a fraction (rounding down) or a count; the status ends below 1 stack. */
export function drop(w: W, u: CUnit, s: SInst, d: S.StatusT) {
  if (!d.drop) return;
  s.stacks = d.drop === "all" ? 0 : "fraction" in d.drop ? Math.floor(s.stacks * (1 - d.drop.fraction)) : Math.max(0, s.stacks - sub(d.drop.count));
  if (d.stats) refresh(w, u);
  if (s.stacks < SUBTICKS) endStatus(w, u, s, "stacks");
}

export function pulse(w: W, it: Extract<Item, { k: "pulse" }>) {
  const h = unit(w, it.unit)!;
  const s = h.statuses.find((x) => x.uid === it.uid);
  if (!s) return;
  const d = def(w, s.id);
  const every = sub(d.pulse!.every);
  // Reapplying changes the end time, not the rhythm, so the next pulse is always queued; it's skipped if the status has gone.
  push(w, { ...it, at: it.at + every, seq: w.f.seq++ });
  // A pulse whose conditions fail does nothing that beat, but an Intensity drop still happens.
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
