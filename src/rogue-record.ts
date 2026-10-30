/**
 * A rogue run's record, for balancing: every choice with what was offered beside it, every free action (gear, seats,
 * formation, ability order, swaps, supplies), the full party state before every fight and how each fight ended. Kept on
 * the run (`run.record`) only when the interface starts one, so the simulations that drive src/rogue.ts record nothing.
 *
 * The run is seeded, so most of it could be played back; the record holds what can't be: the player's picks, in order,
 * and the state they were made in. Each wrapper here calls src/rogue.ts's own function and writes an entry when it did
 * something. The interface imports these in place of rogue.ts's.
 */
import { ENGINE_VERSION, type Content, type Run } from "./engine/run.js";
import type { Member as EngineMember } from "./engine/combat/rules.js";
import {
  ROGUE_VERSION, choose as chooseRaw, discard as discardRaw, dismiss as dismissRaw, endFight as endFightRaw, equip as equipRaw, eventView, member, options, reachable,
  seat as seatRaw, setFormation as setFormationRaw, setOrder as setOrderRaw, startFight as startFightRaw, swap as swapRaw, useSupply as useSupplyRaw, type RogueRun, type Slot,
} from "./rogue.js";
import type { SupplyIdT } from "./schema.js";

export type RecordEntry = { i: number; t: string; act: number; floor: number; at: string | null; gold: number; [k: string]: unknown };
type Recorded = RogueRun & { record?: RecordEntry[] };

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const withoutRecord = (run: RogueRun) => { const { record: _, ...rest } = run as Recorded; return clone(rest); };

function rec(run: RogueRun, t: string, data: Record<string, unknown>) {
  const r = (run as Recorded).record;
  if (!r) return;
  r.push({ i: r.length, t, act: run.act, floor: run.floor, at: run.at, gold: run.gold, ...data });
}

/** Starts a run's record, if it has none: from the start, or (a run begun before recording existed) from where it is, with the whole run as it stands. */
export function beginRecord(run: RogueRun) {
  const rr = run as Recorded;
  if (rr.record) return;
  const fresh = run.pending.kind === "draft" && run.roster.length <= 1 && !run.visited.length;
  rr.record = [];
  rec(run, "start", { seed: run.seed, heat: run.heat, leader: run.leader, rogueVersion: ROGUE_VERSION, engineVersion: ENGINE_VERSION, midRun: !fresh, ...(fresh ? {} : { state: withoutRecord(run) }) });
}

/** The roster as it stands: each member with its worn pieces spelled out (not just their ids). */
function roster(run: RogueRun) {
  const item = (uid: string | undefined) => (uid ? run.items.find((x) => x.uid === uid) ?? { uid } : null);
  return run.roster.map((m) => ({ ...clone(m), worn: Object.fromEntries(Object.entries(m.gear).map(([slot, uid]) => [slot, item(uid)])) }));
}
function partyState(run: RogueRun) {
  return { party: [...run.party], formation: run.formation, formations: [...run.formations], seats: run.seats, roster: roster(run), bag: run.items.map((x) => ({ ...x })), supplies: [...run.supplies], gold: run.gold };
}

// ─── The decisions ─────────────────────────────────────────────────────────

export function choose(c: Content, run: RogueRun, pick: string) {
  const offered = options(c, run);
  const pending = clone(run.pending);
  const extra: Record<string, unknown> = {};
  if (run.pending.kind === "map") extra.nodes = reachable(run).map((n) => ({ ...n }));
  if (run.pending.kind === "event") extra.event = clone(eventView(c, run.pending));
  const notes = run.notes.length, gold = run.gold;
  chooseRaw(c, run, pick);
  rec(run, "choice", { kind: pending.kind, pending, offered, pick, ...extra, then: run.pending.kind, goldAfter: run.gold, goldChange: run.gold - gold, notes: run.notes.slice(notes).map((n) => n.text) });
}

// ─── Free actions (recorded when they did something) ──────────────────────

export function equip(c: Content, run: RogueRun, cls: string, slot: Slot, uid: string | null): boolean {
  const before = member(run, cls)?.gear[slot] ?? null;
  const ok = equipRaw(c, run, cls, slot, uid);
  if (ok && before !== uid) rec(run, "equip", { cls, slot, uid, item: uid ? run.items.find((x) => x.uid === uid) ?? null : null, was: before });
  return ok;
}
export function setFormation(c: Content, run: RogueRun, id: string): boolean {
  const was = run.formation;
  const ok = setFormationRaw(c, run, id);
  if (ok && was !== id) rec(run, "formation", { id, was });
  return ok;
}
export function seat(c: Content, run: RogueRun, order: string[]): boolean {
  const was = [...run.party];
  const ok = seatRaw(c, run, order);
  if (ok && was.join() !== order.join()) rec(run, "seat", { order: [...order], was });
  return ok;
}
export function setOrder(run: RogueRun, cls: string, order: string[]): boolean {
  const was = [...(member(run, cls)?.order ?? [])];
  const ok = setOrderRaw(run, cls, order);
  if (ok && was.join() !== order.join()) rec(run, "order", { cls, order: [...order], was });
  return ok;
}
export function swap(c: Content, run: RogueRun, out: string, into: string | null): boolean {
  const was = [...run.party];
  const ok = swapRaw(c, run, out, into);
  if (ok) rec(run, "swap", { out, into, party: [...run.party], was });
  return ok;
}
export function dismiss(c: Content, run: RogueRun, cls: string): boolean {
  const ok = dismissRaw(c, run, cls);
  if (ok) rec(run, "dismiss", { cls });
  return ok;
}
export function discard(run: RogueRun, uid: string): boolean {
  const item = run.items.find((x) => x.uid === uid);
  const ok = discardRaw(run, uid);
  if (ok) rec(run, "discard", { uid, item: item ?? null });
  return ok;
}
export function useSupply(c: Content, run: RogueRun, id: SupplyIdT, target?: string): boolean {
  const vitals = () => run.roster.map((m) => ({ cls: m.cls, missHp: m.missHp, missMp: m.missMp, ko: m.ko }));
  const before = vitals();
  const ok = useSupplyRaw(c, run, id, target);
  if (ok) rec(run, "supply", { id, target: target ?? null, before, after: vitals() });
  return ok;
}

// ─── Fights ────────────────────────────────────────────────────────────────

/** Starts the pending fight, recording the party exactly as it enters (stats with gear and seats, HP, MP, cooldowns) and the run around it. */
export function startFight(c: Content, run: RogueRun, opts: { log?: boolean } = {}): Run {
  const p = run.pending;
  const spec = p.kind === "fight" ? { node: p.node, tier: p.tier, fight: p.fight.id, name: p.fight.name, enemies: [...p.fight.enemies], knob: p.fight.knob, foes: clone(p.foes), seed: p.seed } : null;
  // A reload in a fight replays it from its start: the same fight again, marked so it isn't counted twice.
  const r = (run as Recorded).record;
  const last = r && [...r].reverse().find((e) => e.t === "fight" || e.t === "result");
  const replay = !!(p.kind === "fight" && p.begun && last?.t === "fight" && last.node === p.node);
  const er = startFightRaw(c, run, opts);
  const fighters = (er.party as EngineMember[]).map((m) => ({ ref: m.ref, name: m.name, seat: m.seat, slot: m.slot, hp: m.hp, mp: m.mp, stats: { ...m.stats }, weapon: m.weapon, abilities: [...m.abilities], cooldowns: m.cooldowns ? { ...m.cooldowns } : null, start: [...m.start] }));
  rec(run, "fight", { ...spec, replay, fighters, state: partyState(run) });
  return er;
}
/** Ends the fight, recording how it ended and the party as it came out. */
export function endFight(c: Content, run: RogueRun, er: Run) {
  const node = run.pending.kind === "fight" ? run.pending.node : null;
  const party = (er.party as EngineMember[]).map((m) => ({ ref: m.ref, hp: m.hp, maxHp: m.stats.max_hp, mp: m.mp, maxMp: m.stats.max_mp, ko: m.hp <= 0 }));
  endFightRaw(c, run, er);
  rec(run, "result", { node, outcome: er.outcome, ticks: er.fight?.round ?? null, party, then: run.pending.kind });
}

/** Ends the record: a run given up. */
export function recordAbandon(run: RogueRun) {
  rec(run, "abandon", {});
}

/** The record as a file's contents: the run's identity, every entry, and the run as it ended. */
export function exportRecord(run: RogueRun, build: string): string {
  const won = run.pending.kind === "over" && run.pending.won;
  return JSON.stringify({
    format: "memory-dungeon.rogue-run", formatVersion: 1, build, rogueVersion: ROGUE_VERSION, engineVersion: ENGINE_VERSION,
    seed: run.seed, heat: run.heat, leader: run.leader, won, act: run.act, floor: run.floor, stats: run.stats,
    record: (run as Recorded).record ?? [], final: withoutRecord(run),
  });
}
