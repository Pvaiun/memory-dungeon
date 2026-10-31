/**
 * A rogue run's record, for balancing: every choice with what was offered beside it, every free action (gear, seats,
 * formation, ability order, swaps, supplies), the full party state before every fight and how each fight ended. Kept on
 * the run (`run.record`) only when the interface starts one, so the simulations that drive src/rogue.ts record nothing.
 *
 * The run is seeded, so most of it could be played back; the record holds what can't be: the player's picks, in order,
 * and the state they were made in. Each wrapper here calls src/rogue.ts's own function and writes an entry when it did
 * something. The interface imports these in place of rogue.ts's.
 */
import { ENGINE_VERSION, advance, type Content, type Run } from "./engine/run.js";
import { combat, type Member as EngineMember } from "./engine/combat/rules.js";
import {
  ROGUE_VERSION, newRogue, registerGear, choose as chooseRaw, discard as discardRaw, dismiss as dismissRaw, endFight as endFightRaw, equip as equipRaw, eventView, member, options, reachable,
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
export function beginRecord(run: RogueRun, build?: string) {
  const rr = run as Recorded;
  if (rr.record) return;
  const fresh = run.pending.kind === "draft" && run.roster.length <= 1 && !run.visited.length;
  rr.record = [];
  rec(run, "start", { seed: run.seed, heat: run.heat, leader: run.leader, rogueVersion: ROGUE_VERSION, engineVersion: ENGINE_VERSION, build, midRun: !fresh, ...(fresh ? {} : { state: withoutRecord(run) }) });
}
/** The run picked up again from storage (the app reopened or reloaded), under this build. */
export function recordResume(run: RogueRun, build: string) {
  rec(run, "resume", { build, rogueVersion: ROGUE_VERSION, engineVersion: ENGINE_VERSION });
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

/** The record as a file's contents: the run's identity, the check's verdict, every entry, and the run as it ended. */
export function exportRecord(c: Content, run: RogueRun, build: string, check: RecordCheck = checkRecord(c, run)): string {
  const won = run.pending.kind === "over" && run.pending.won;
  return JSON.stringify({
    format: "memory-dungeon.rogue-run", formatVersion: 2, build, rogueVersion: ROGUE_VERSION, engineVersion: ENGINE_VERSION,
    seed: run.seed, heat: run.heat, leader: run.leader, won, act: run.act, floor: run.floor, stats: run.stats,
    check, record: (run as Recorded).record ?? [], final: withoutRecord(run),
  });
}

// ─── The check ─────────────────────────────────────────────────────────────

/**
 * Whether the record is the whole run, untouched: `good` when the record alone, played again from the run's seed under
 * this build, offers every choice it shows, starts and ends every fight as it shows, and arrives at exactly the run that
 * ended. A record with a step missing, a step changed, a state that moved without a step (a save lost before the browser
 * closed), or rules that changed while the run was played (a new build mid-run that mattered to it) drifts, and the check
 * names the first step where it did. `partial`: the record began mid-run (a run started before records existed, or storage
 * filled and the record was dropped), so only the part it holds is checked.
 */
export type RecordCheck = {
  verdict: "good" | "partial" | "bad" | "none";
  /** In a player's words, for the end screen. */
  text: string;
  /** The first step where the replay drifted, if it did. */
  problem?: { step: number; act: number; floor: number; what: string };
  steps: number; choices: number; fights: number; reloads: number;
  /** Every build the run was played under, in order (a reload under a new build adds one). */
  builds: string[];
};

/** Keys sorted, so two states compare by what they hold, not the order their fields were written in. */
function stable(x: unknown): string {
  return JSON.stringify(x, (_k, v: unknown) => (v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) : v));
}
/** The first place two plain values differ, as a path. */
function firstDiff(a: unknown, b: unknown, path = ""): string | null {
  if (stable(a) === stable(b)) return null;
  if (a && b && typeof a === "object" && typeof b === "object") {
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
    for (const k of keys) {
      const d = firstDiff((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], path ? `${path}.${k}` : k);
      if (d) return d;
    }
  }
  return path || "(the whole value)";
}

export function checkRecord(c: Content, run: RogueRun): RecordCheck {
  const record = (run as Recorded).record ?? [];
  const builds: string[] = [];
  const out: RecordCheck = { verdict: "good", text: "", steps: record.length, choices: 0, fights: 0, reloads: 0, builds };
  const start = record[0];
  if (!start || start.t !== "start") return { ...out, verdict: "none", text: "NO RECORD FOR THIS RUN" };
  if (typeof start.build === "string") builds.push(start.build);
  const partial = !!start.midRun;
  const r: RogueRun = partial ? clone(start.state as RogueRun) : newRogue(c, { seed: start.seed as number, leader: start.leader as string, heat: start.heat as number });
  let er: Run | null = null;
  let problem: RecordCheck["problem"];
  const fail = (e: RecordEntry, what: string) => { problem = { step: e.i, act: e.act, floor: e.floor, what }; };
  try {
    for (const e of record.slice(1)) {
      registerGear(c, r);
      const d = e as Record<string, any>;
      switch (e.t) {
        case "choice": {
          out.choices++;
          const now = options(c, r);
          const diff = firstDiff(now, d.offered) ?? firstDiff(clone(r.pending), d.pending);
          if (diff) { fail(e, `the ${d.kind} offered something else (${diff})`); break; }
          chooseRaw(c, r, d.pick);
          break;
        }
        case "equip": if (!equipRaw(c, r, d.cls, d.slot, d.uid)) fail(e, `equipping ${d.uid} on ${d.cls} wasn't possible`); break;
        case "formation": if (!setFormationRaw(c, r, d.id)) fail(e, `formation ${d.id} wasn't possible`); break;
        case "seat": if (!seatRaw(c, r, d.order)) fail(e, "the seat change wasn't possible"); break;
        case "order": if (!setOrderRaw(r, d.cls, d.order)) fail(e, `${d.cls}'s ability order wasn't possible`); break;
        case "swap": if (!swapRaw(c, r, d.out, d.into)) fail(e, "the swap wasn't possible"); break;
        case "dismiss": if (!dismissRaw(c, r, d.cls)) fail(e, `sending ${d.cls} home wasn't possible`); break;
        case "discard": if (!discardRaw(r, d.uid)) fail(e, `dropping ${d.uid} wasn't possible`); break;
        case "supply": if (!useSupplyRaw(c, r, d.id, d.target ?? undefined)) fail(e, `the ${d.id} couldn't be used`); else if (firstDiff(r.roster.map((m) => ({ cls: m.cls, missHp: m.missHp, missMp: m.missMp, ko: m.ko })), d.after)) fail(e, `the ${d.id} did something else`); break;
        case "fight": {
          if (d.replay) {
            // The same fight started again after a reload: nothing moved in between.
            out.reloads++;
            if (r.pending.kind !== "fight" || r.pending.node !== d.node || !er) fail(e, "a fight restarted that wasn't under way");
            break;
          }
          if (er) { fail(e, "a fight started while another had no end"); break; }
          out.fights++;
          er = startFightRaw(c, r);
          const fighters = (er.party as EngineMember[]).map((m) => ({ ref: m.ref, hp: m.hp, mp: m.mp, stats: m.stats, abilities: m.abilities, cooldowns: m.cooldowns ?? null }));
          const want = (d.fighters as Record<string, unknown>[]).map((m) => ({ ref: m.ref, hp: m.hp, mp: m.mp, stats: m.stats, abilities: m.abilities, cooldowns: m.cooldowns }));
          const diff = firstDiff(fighters, want);
          if (diff) fail(e, `the party entered ${d.name} differently (${diff})`);
          break;
        }
        case "result": {
          if (!er) { fail(e, "a fight ended that hadn't started"); break; }
          advance(c, combat, er);
          const party = (er.party as EngineMember[]).map((m) => ({ ref: m.ref, hp: m.hp, mp: m.mp }));
          const diff = er.outcome !== d.outcome ? "its outcome" : firstDiff(party, (d.party as Record<string, unknown>[]).map((m) => ({ ref: m.ref, hp: m.hp, mp: m.mp })));
          if (diff) { fail(e, `a fight ended differently (${diff})`); break; }
          endFightRaw(c, r, er);
          er = null;
          break;
        }
        case "abandon": r.pending = { kind: "over", won: false }; break;
        case "resume": if (typeof d.build === "string" && builds.at(-1) !== d.build) builds.push(d.build); break;
        default: fail(e, `an unknown step '${e.t}'`);
      }
      if (problem) break;
    }
    if (!problem) {
      const diff = firstDiff(withoutRecord(r), withoutRecord(run));
      if (diff) { const last = record[record.length - 1]; problem = { step: last.i + 1, act: run.act, floor: run.floor, what: `the run ended in a state the record doesn't lead to (${diff})` }; }
    }
  } catch (err) {
    problem ??= { step: -1, act: r.act, floor: r.floor, what: `the replay broke (${err instanceof Error ? err.message : String(err)})` };
  } finally {
    // The replay registered its own pieces; the run's own go back.
    registerGear(c, run);
  }
  if (problem) return { ...out, verdict: "bad", problem, text: `RECORD BROKEN AT ACT ${problem.act}, FLOOR ${problem.floor}: ${problem.what.toUpperCase()}` };
  if (partial) return { ...out, verdict: "partial", text: `RECORD PARTIAL: BEGINS AT ACT ${start.act}, FLOOR ${start.floor}` };
  return { ...out, text: `RECORD COMPLETE: ${out.choices} CHOICES, ${out.fights} FIGHTS REPLAYED AND MATCHED` };
}
