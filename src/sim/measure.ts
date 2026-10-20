/**
 * Measuring runs. A probe wraps the battle system and watches each fight's HP,
 * without changing anything it does. It reads only what the run loop itself
 * reads from a fight (its units' side, HP and max HP), so step 4's combat
 * should plug in unchanged.
 */
import { advance, answer, copyRun, newRun, play, type Content, type Fight, type Picker, type Rules, type Run, type RunInput } from "../engine/run.js";
import type { Party } from "../schema.js";

export type FightResult = {
  stage: string;
  boss: boolean;
  won: boolean;
  rounds: number;
  /** Shares of HP, 0 to 1: the party's at the start and end, and the enemies' left at the end. */
  partyStart: number;
  partyEnd: number;
  enemyLeft: number;
  /** The party's lowest HP share during the fight. */
  low: number;
  /** How far behind the party fell: the most the enemies' HP share led the party's, both against where the fight started. */
  behind: number;
};

export type RunResult = {
  seed: number;
  won: boolean;
  fights: FightResult[];
  /** Fights won, plus the share of the lost fight's enemy HP removed. A win scores the dungeon's fight count. */
  progress: number;
  perks: string[];
  loot: string[];
};

function share(f: Fight, side: "party" | "enemy"): number {
  let hp = 0, max = 0;
  for (const u of f.units) if (u.side === side) (hp += u.hp), (max += u.stats.max_hp);
  return max ? hp / max : 0;
}

/** A battle system that also records each fight, keyed by the run that played it. */
export function probe(rules: Rules) {
  const seen = new WeakMap<Run, FightResult[]>();
  const counter = { runs: 0 };
  const watched: Rules = {
    ...rules,
    startFight(x, stage, rng) {
      const f = rules.startFight(x, stage, rng);
      const p = share(f, "party");
      const list = seen.get(x.run) ?? [];
      seen.set(x.run, list);
      list.push({ stage: f.stage, boss: f.boss, won: false, rounds: 0, partyStart: p, partyEnd: p, enemyLeft: 1, low: p, behind: 0 });
      return f;
    },
    takeTurn(x, f) {
      rules.takeTurn(x, f);
      const r = seen.get(x.run)?.at(-1);
      if (!r) return;
      const p = share(f, "party");
      r.low = Math.min(r.low, p);
      r.behind = Math.max(r.behind, share(f, "enemy") - (r.partyStart ? p / r.partyStart : 0));
    },
    endFight(x, f) {
      rules.endFight(x, f);
      const r = seen.get(x.run)?.at(-1);
      if (!r) return;
      Object.assign(r, { won: f.result === "won", rounds: f.round, partyEnd: share(f, "party"), enemyLeft: share(f, "enemy") });
    },
  };
  const result = (c: Content, run: Run): RunResult => {
    counter.runs++;
    const fights = seen.get(run) ?? [];
    const stages = c.dungeons.get(run.record.dungeon)!.stages;
    const total = stages.filter((s) => s.kind === "fight").length;
    const won = stages.slice(0, run.stage).filter((s) => s.kind === "fight").length;
    const last = fights.at(-1);
    const progress = run.outcome === "won" ? total : won + (last && !last.won ? 1 - last.enemyLeft : 0);
    return { seed: run.record.seed, won: run.outcome === "won", fights, progress, perks: [...run.perks], loot: [...run.loot] };
  };
  /** `counter.runs` counts every run measured, each perk path included. */
  return { rules: watched, result, counter };
}

export type Probe = ReturnType<typeof probe>;

/** Parties already checked, by dungeon. A study plays each party on many seeds, so it checks each one once. */
const known = new WeakMap<Content, WeakMap<Party, Set<string>>>();
function checkedIn(c: Content, p: Party): Set<string> {
  let parties = known.get(c);
  if (!parties) known.set(c, (parties = new WeakMap()));
  let dungeons = parties.get(p);
  if (!dungeons) parties.set(p, (dungeons = new Set()));
  return dungeons;
}

export function measure(c: Content, pr: Probe, input: RunInput, picker: Picker): RunResult {
  const done = checkedIn(c, input.party);
  // The first run checks the party, and throws if it can't play this dungeon.
  const run = play(c, pr.rules, input, picker, { checked: done.has(input.dungeon) });
  done.add(input.dungeon);
  return pr.result(c, run);
}

/**
 * Every combination of perk picks on one seed, like step 2's explorer, with
 * each path measured. Only the last fight's details are kept for a path that
 * branched after its earlier fights.
 */
export function paths(c: Content, pr: Probe, input: RunInput, max = 2000): RunResult[] {
  const out: RunResult[] = [];
  const go = (run: Run) => {
    advance(c, pr.rules, run);
    if (!run.pending) return void out.push(pr.result(c, run));
    for (const o of run.pending.options) if (out.length < max) go(answer(c, pr.rules, copyRun(run), o));
  };
  const done = checkedIn(c, input.party);
  const first = newRun(c, pr.rules, input, { checked: done.has(input.dungeon) });
  done.add(input.dungeon);
  go(first);
  return out;
}
