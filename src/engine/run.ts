/**
 * The run machinery: a run as plain data, moved forward one step at a time,
 * pausing whenever it needs a decision. None of it depends on the battle
 * system, which plugs in as `Rules` (step 4's combat, in combat/).
 */
import type { AbilityT, ClassDefT, ContentPack, DungeonT, EnemyT, FormationT, GearT, Party, PerkT, StatDefT, StatusT, WeaponKindT } from "../schema.js";
import { checkParty, validatePack } from "../validate.js";
import { fingerprint, int, rngFor, type Rng } from "./rng.js";
import type { Entry } from "./log.js";

/** Bump on any change that can change a run's outcome: old records stop replaying. */
export const ENGINE_VERSION = "0.10";

// ─── Content, loaded and checked once ───────────────────────────────────────

export type Content = {
  pack: ContentPack;
  fingerprint: string;
  dungeons: Map<string, DungeonT>;
  enemies: Map<string, EnemyT>;
  classes: Map<string, ClassDefT>;
  stats: Map<string, StatDefT>;
  weaponKinds: Map<string, WeaponKindT>;
  statuses: Map<string, StatusT>;
  abilities: Map<string, AbilityT>;
  gear: Map<string, GearT>;
  formations: Map<string, FormationT>;
  perks: Map<string, PerkT>;
};

export function loadContent(raw: unknown): Content {
  const { pack, issues } = validatePack(raw);
  const errors = issues.filter((i) => i.level === "error");
  if (!pack || errors.length) throw new Error(`invalid content: ${errors.map((e) => `${e.path}: ${e.message}`).join("; ")}`);
  const by = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));
  return {
    pack,
    fingerprint: fingerprint(JSON.stringify(pack)),
    dungeons: by(pack.dungeons),
    enemies: by(pack.enemies),
    classes: by(pack.classes),
    stats: by(pack.stats),
    weaponKinds: by(pack.weaponKinds),
    statuses: by(pack.statuses),
    abilities: by(pack.abilities),
    gear: by(pack.gear),
    formations: by(pack.formations),
    perks: by(pack.perks),
  };
}

// ─── Runs ───────────────────────────────────────────────────────────────────

export type Stage = DungeonT["stages"][number];
export type FightStage = Extract<Stage, { kind: "fight" }>;

export type RunInput = { dungeon: string; party: Party; seed: number; firstClear?: boolean };

/** A question the run is waiting on. `at` names the point in the run; options are ids. */
export type Decision = { kind: string; at: string; options: string[] };
export type Answer = { at: string; pick: string };

/** Everything needed to replay a run exactly. The server keeps this with each run's outcome and loot. */
export type RunRecord = {
  engine: string;
  rules: string;
  content: { id: string; fingerprint: string };
  dungeon: string;
  party: Party;
  seed: number;
  firstClear: boolean;
  decisions: Answer[];
};

export type Unit = { id: string; ref: string; name: string; side: "party" | "enemy"; stats: Record<string, number>; hp: number };

/** What the run loop reads from a fight. The battle system keeps the rest of its state alongside, as plain data. */
export type Fight = {
  stage: string;
  boss: boolean;
  units: Unit[];
  /** How far the fight has got: in combat-1, the current tick. */
  round: number;
  result: "won" | "lost" | null;
  /** A decision was just answered before this turn, so don't ask again. */
  decided: boolean;
};

export type Run = {
  record: RunRecord;
  /** Index of the stage being played. */
  stage: number;
  party: Unit[];
  perks: string[];
  fight: Fight | null;
  pending: Decision | null;
  outcome: "won" | "lost" | null;
  loot: string[];
  /** Fights started so far, so the explorer can count its cost. */
  fights: number;
  log: Entry[] | null;
};

/** What the rules see. `log` is absent when logging is off, so `x.log?.({...})` costs nothing. */
export type Ctx = { c: Content; run: Run; log?: (e: Entry) => void };

/** The battle system: combat-1 (combat/rules.ts). */
export interface Rules {
  id: string;
  /** The party's units at the start of a run. */
  party(c: Content, input: RunInput): Unit[];
  startFight(x: Ctx, stage: FightStage, rng: Rng): Fight;
  /** Called before each turn. Return a decision to pause the fight for it. */
  beforeTurn?(x: Ctx, f: Fight): Decision | null;
  /** One turn: in combat-1, one moment (the next sub-tick on which anything happens). Sets `f.result` when the fight is over. */
  takeTurn(x: Ctx, f: Fight): void;
  /** After a fight: carry its results back into the run. */
  endFight(x: Ctx, f: Fight): void;
  /** A stage that isn't a fight. May return a decision to ask. */
  stage(x: Ctx, stage: Stage, rng: Rng): Decision | null;
  /** Apply an answer. Every decision kind the rules ask is handled here. */
  apply(x: Ctx, d: Decision, pick: string): void;
  /** Loot for a won run. */
  loot(x: Ctx, rng: Rng): string[];
}

const ctx = (c: Content, run: Run): Ctx => {
  const log = run.log;
  return { c, run, log: log ? (e) => log.push(e) : undefined };
};

/** `checked`: the caller has already checked this party against this dungeon, as bulk simulation does once per party. */
export type RunOpts = { log?: boolean; checked?: boolean };

export function newRun(c: Content, rules: Rules, input: RunInput, opts: RunOpts = {}): Run {
  if (!c.dungeons.has(input.dungeon)) throw new Error(`unknown dungeon '${input.dungeon}'`);
  const errors = opts.checked ? [] : checkParty(c.pack, input.party, { dungeon: input.dungeon }).filter((i) => i.level === "error");
  if (errors.length) throw new Error(`invalid party: ${errors.map((e) => `${e.path}: ${e.message}`).join("; ")}`);
  if (!Number.isSafeInteger(input.seed)) throw new Error(`seed must be a whole number, got ${input.seed}`);
  const record: RunRecord = {
    engine: ENGINE_VERSION,
    rules: rules.id,
    content: { id: c.pack.id, fingerprint: c.fingerprint },
    dungeon: input.dungeon,
    party: structuredClone(input.party),
    seed: input.seed,
    firstClear: input.firstClear ?? false,
    decisions: [],
  };
  const run: Run = {
    record,
    stage: 0,
    party: rules.party(c, input),
    perks: [],
    fight: null,
    pending: null,
    outcome: null,
    loot: [],
    fights: 0,
    log: opts.log ? [] : null,
  };
  const { decisions: _, ...header } = record;
  run.log?.push({ t: "run", vis: "hidden", ...header });
  return run;
}

/** Play until the run ends or needs a decision. Changes `run` in place and returns it. */
export function advance(c: Content, rules: Rules, run: Run): Run {
  while (!run.pending && !run.outcome) advanceOnce(c, rules, run);
  return run;
}

/**
 * One step of the run loop: ends a finished fight, plays one turn of the current fight, starts the next
 * stage, or ends the run. Interfaces that show a fight as it happens call this once per turn, with
 * `run.fight` between calls; `advance` is this in a loop.
 */
export function advanceOnce(c: Content, rules: Rules, run: Run): void {
  if (run.pending || run.outcome) return;
  const x = ctx(c, run);
  const { seed } = run.record;
  const stages = c.dungeons.get(run.record.dungeon)!.stages;
  const f = run.fight;
  if (f) {
    if (f.result) {
      rules.endFight(x, f);
      x.log?.({ t: "fight_end", vis: "player", stage: f.stage, result: f.result, rounds: f.round });
      run.fight = null;
      if (f.result === "won") run.stage++;
      else end(x, "lost");
    } else {
      if (!pause(x, f.decided ? null : rules.beforeTurn?.(x, f))) {
        f.decided = false;
        rules.takeTurn(x, f);
      }
    }
  } else if (run.stage >= stages.length) {
    const rng = slice(x, seed, "loot");
    run.loot = rules.loot(x, rng);
    x.log?.({ t: "loot", vis: "player", items: run.loot });
    end(x, "won");
  } else {
    const stage = stages[run.stage];
    if (stage.kind === "fight") {
      run.fight = rules.startFight(x, stage, slice(x, seed, `fight:${stage.id}`));
      run.fights++;
      x.log?.({
        t: "fight_start",
        vis: "player",
        stage: stage.id,
        boss: run.fight.boss,
        units: run.fight.units.map((u) => ({ id: u.id, ref: u.ref, name: u.name, side: u.side, hp: u.hp, max: u.stats.max_hp })),
      });
    } else {
      run.stage++;
      pause(x, rules.stage(x, stage, slice(x, seed, `stage:${stage.id}`)));
    }
  }
}

/** Answer the pending decision. Call `advance` afterwards to carry on. */
export function answer(c: Content, rules: Rules, run: Run, pick: string): Run {
  const d = run.pending;
  if (!d) throw new Error("no decision is pending");
  if (!d.options.includes(pick)) throw new Error(`'${pick}' isn't an option at ${d.at}: ${d.options.join(", ")}`);
  const x = ctx(c, run);
  run.pending = null;
  run.record.decisions.push({ at: d.at, pick });
  x.log?.({ t: "pick", vis: "player", kind: d.kind, at: d.at, pick });
  rules.apply(x, d, pick);
  if (run.fight) run.fight.decided = true;
  return run;
}

function slice(x: Ctx, seed: number, label: string): Rng {
  const rng = rngFor(seed, label);
  x.log?.({ t: "dice", vis: "hidden", label, state: rng.slice() });
  return rng;
}

/** Wait for an answer. A decision with no options is skipped. */
function pause(x: Ctx, d: Decision | null | undefined): boolean {
  if (!d || !d.options.length) return false;
  x.run.pending = d;
  x.log?.({ t: "offer", vis: "player", kind: d.kind, at: d.at, options: d.options });
  return true;
}

function end(x: Ctx, outcome: "won" | "lost") {
  x.run.outcome = outcome;
  x.log?.({ t: "run_end", vis: "player", outcome, loot: x.run.loot });
}

// ─── Driving a run ──────────────────────────────────────────────────────────

/** Whoever answers decisions: a player, a simulation's picker, or a replay. */
export type Picker = (d: Decision, run: Run) => string;

export const firstOption: Picker = (d) => d.options[0];

/** Picks uniformly at random, from its own dice, so it never touches the run's. */
export function randomPicker(seed: number): Picker {
  const rng = rngFor(seed, "picker");
  return (d) => d.options[int(rng, d.options.length)];
}

export function play(c: Content, rules: Rules, input: RunInput, picker: Picker, opts: RunOpts = {}): Run {
  const run = advance(c, rules, newRun(c, rules, input, opts));
  while (run.pending) advance(c, rules, answer(c, rules, run, picker(run.pending, run)));
  return run;
}

/** Rebuild a run from its record. Only holds for the same engine, rules and content. */
export function replay(c: Content, rules: Rules, record: RunRecord, opts: { log?: boolean } = {}): Run {
  const want = `${record.engine}/${record.rules}/${record.content.id}#${record.content.fingerprint}`;
  const have = `${ENGINE_VERSION}/${rules.id}/${c.pack.id}#${c.fingerprint}`;
  if (want !== have) throw new Error(`can't replay: the record is for ${want}, this is ${have}`);
  let i = 0;
  const run = play(c, rules, record, (d) => {
    const a = record.decisions[i++];
    if (!a || a.at !== d.at) throw new Error(`replay diverged at ${d.at}: the record has ${a ? a.at : "no more decisions"}`);
    return a.pick;
  }, opts);
  if (i !== record.decisions.length) throw new Error(`replay ended with ${record.decisions.length - i} decisions unused`);
  return run;
}

/** A run is plain data: saving is JSON, and a copy is a branch. */
export const saveRun = (run: Run): string => JSON.stringify(run);
export const loadRun = (s: string): Run => JSON.parse(s);
export const copyRun = (run: Run): Run => structuredClone(run);
