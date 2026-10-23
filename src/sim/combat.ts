/**
 * The combat level: many parties against many dungeons, challenges or single
 * fights, many seeds each, with logs off. Every party plays the same seeds.
 */
import { randomPicker, type Content, type Picker, type Rules } from "../engine/run.js";
import type { Party } from "../schema.js";
import { build, ladder, patch } from "./content.js";
import { measure, paths, probe, type Probe, type RunResult } from "./measure.js";
import { all, classColour, everything, fits, label, make, partyKey, short, type Colour, type Owned } from "./parties.js";
import type { CombatStudy } from "./study.js";
import { average, compare, mean, quantile, rate, type Comparison, type Range } from "./sure.js";

export type Target = { key: string; dungeon: string; challenge?: string; name: string };

export type PartyResult = {
  key: string;
  label: string;
  colour: string;
  size: number;
  wins: Range;
  progress: Range;
  /** The unluckiest and luckiest tenth of seeds, in fights. */
  p10: number;
  p90: number;
  /** Tries to a first win, on average: 1 / win rate. */
  tries: number;
  /** Of the losses: how many were in each fight, and the median enemy HP share left. */
  lostIn: Record<string, number>;
  enemyLeft: number;
  /** Median rounds per fight, for fights played. */
  rounds: Record<string, number>;
};

export type Strictness = { colours: number; winning: string[]; tweaks: number; tweaksWinning: number };
export type PerkNumbers = { party: string; seeds: number; hindsight: number; knowable: number; random: number; worst: number };
export type Effect = { factor: string; comparison: Comparison };
export type TargetResult = { target: Target; parties: PartyResult[]; strictness: Strictness; perks: PerkNumbers[]; classes: Effect[]; sizes: Effect[]; pairs: { pair: string; extra: number; standsOut: boolean }[] };
export type VariantResult = { name: string; targets: TargetResult[]; tweaks: Effect[]; versus?: { target: string; wins: Comparison; progress: Comparison }[] };
export type CombatResults = { study: CombatStudy; content: { id: string; fingerprint: string }; rules: string; runs: number; variants: VariantResult[] };

/** Runs kept in memory for picking fights to read: one per party, target and seed. */
export type Kept = { target: Target; party: Party; result: RunResult }[];

export function targets(c: Content, s: CombatStudy): Target[] {
  const ids = s.targets.dungeons === "all" ? c.pack.progression.dungeonOrder : s.targets.dungeons;
  const out: Target[] = [];
  for (const id of ids) {
    const d = c.dungeons.get(id);
    if (!d) throw new Error(`no dungeon '${id}'`);
    out.push({ key: id, dungeon: id, name: d.name });
    if (s.targets.challenges) for (const ch of d.challenges) out.push({ key: `${id}:${ch.id}`, dungeon: id, challenge: ch.id, name: `${d.name}: ${ch.text}` });
  }
  for (const f of s.targets.fights) out.push({ key: f.replace("/", "~"), dungeon: f.replace("/", "~"), name: f });
  return out;
}

/** The parties a target allows: each set of classes once, in the first owned formation that fits. */
function partiesFor(c: Content, s: CombatStudy, t: Target): Party[] {
  if (Array.isArray(s.parties)) return s.parties.filter((p) => fits(c, p, t.dungeon, t.challenge));
  if ("trios" in s.parties) {
    const formation = s.parties.formation ?? c.pack.starter.formations[0];
    return s.parties.trios.map((classes) => make(c, everything(c), classes, formation)).filter((p) => fits(c, p, t.dungeon, t.challenge));
  }
  const cap = Math.min(s.parties.max ?? 99, c.dungeons.get(t.dungeon)!.partySize.max);
  const owned = everything(c);
  if (s.parties.formations === "all") return all(c, owned, cap, "all").filter((p) => fits(c, p, t.dungeon, t.challenge));
  const out: Party[] = [];
  for (const p of all(c, owned, cap, "first")) {
    const f = owned.formations.map((id) => make(c, owned, p.units.map((u) => u.class), id)).find((q) => fits(c, q, t.dungeon, t.challenge));
    if (f) out.push(f);
  }
  return out;
}

const pickerFor = (s: CombatStudy, seed: number): Picker => {
  if (s.perks === "random") return randomPicker(seed);
  const list = s.perks.list;
  return (d) => d.options.find((o) => list.includes(o)) ?? [...d.options].sort((a, b) => list.indexOf(a) - list.indexOf(b))[0];
};

/**
 * A study is split into jobs, each run on its own: a target in a variant, or
 * one tweak on one target. Jobs can run in any order, or on separate threads,
 * and `assemble` puts them together into the same numbers.
 */
export type Job = { variant: number; target: string; tweak?: string };
export type Piece = {
  runs: number;
  target?: { result: TargetResult; avg: [string, number[]][]; kept: Kept };
  /** A tweak's progress per seed: each party's own, and each changed copy's. */
  tweak?: { base: number[]; changed: number[][] }[];
};
type Opts = { colour?: Colour; keep?: boolean };

/** The study's content, one per variant. */
export function contents(s: CombatStudy, raw: unknown): Content[] {
  const base = s.content.ladder ? ladder(raw, s.content.ladder) : raw;
  return s.variants.map((v) => build(patch(base, v.patch), s.targets.fights));
}

export function jobs(s: CombatStudy, cs: Content[]): Job[] {
  const out: Job[] = cs.flatMap((c, variant) => targets(c, s).map((t) => ({ variant, target: t.key })));
  if (s.effectSeeds) for (const tweak of Object.keys(TWEAKS)) for (const t of targets(cs[0], s)) if (!t.challenge) out.push({ variant: 0, target: t.key, tweak });
  return out;
}

export function runJob(s: CombatStudy, cs: Content[], rules: Rules, job: Job, opts: Opts = {}): Piece {
  const c = cs[job.variant];
  const pr = probe(rules);
  const t = targets(c, s).find((x) => x.key === job.target)!;
  if (job.tweak) {
    const tweak = tweakRuns(c, pr, s, t, job.tweak);
    return { runs: pr.counter.runs, tweak };
  }
  const seeds = Array.from({ length: s.seeds }, (_, i) => i + 1);
  const kept: Kept = [];
  const ps = partiesFor(c, s, t);
  const runs = ps.map((p) =>
    seeds.map((seed) => {
      const r = measure(c, pr, { dungeon: t.dungeon, party: p, seed, firstClear: true }, pickerFor(s, seed));
      if (opts.keep && job.variant === 0) kept.push({ target: t, party: p, result: r });
      return r;
    }),
  );
  const avg: [string, number[]][] = [
    [t.key, seeds.map((_, i) => mean(runs.map((rs) => rs[i].progress)))],
    [`${t.key}#wins`, seeds.map((_, i) => mean(runs.map((rs) => +rs[i].won)))],
  ];
  const parties = ps.map((p, i) => summarize(c, p, runs[i], opts.colour ?? classColour));
  const result: TargetResult = {
    target: t,
    parties,
    strictness: strictness(parties, s.bar),
    perks: t.challenge || !s.perkSeeds || job.variant !== 0 ? [] : perkNumbers(c, pr, t, ps, parties, s.perkSeeds),
    classes: t.challenge ? [] : classEffects(c, ps, runs),
    sizes: t.challenge ? [] : sizeEffects(ps, runs),
    pairs: t.challenge ? [] : pairs(c, ps, runs),
  };
  return { runs: pr.counter.runs, target: { result, avg, kept } };
}

/** Puts finished jobs together. `pieces[i]` is the result of `js[i]`. */
export function assemble(s: CombatStudy, cs: Content[], rules: Rules, js: Job[], pieces: Piece[], opts: Opts = {}) {
  const results: CombatResults = { study: s, content: { id: cs[0].pack.id, fingerprint: cs[0].fingerprint }, rules: rules.id, runs: 0, variants: [] };
  const kept: Kept = [];
  const byVariant = s.variants.map(() => new Map<string, number[]>());
  for (const v of s.variants) results.variants.push({ name: v.name, targets: [], tweaks: [] });
  js.forEach((job, i) => {
    const piece = pieces[i];
    results.runs += piece.runs;
    if (!piece.target) return;
    results.variants[job.variant].targets.push(piece.target.result);
    for (const [k, xs] of piece.target.avg) byVariant[job.variant].set(k, xs);
    if (opts.keep && job.variant === 0) kept.push(...piece.target.kept);
  });
  if (s.effectSeeds) results.variants[0].tweaks = tweakEffects(s, js, pieces);
  // Each variant against the baseline, paired by seed: the same parties on the same seeds.
  for (let i = 1; i < results.variants.length; i++) {
    results.variants[i].versus = results.variants[0].targets.map(({ target: t }) => ({
      target: t.key,
      wins: compare(byVariant[i].get(`${t.key}#wins`)!, byVariant[0].get(`${t.key}#wins`)!),
      progress: compare(byVariant[i].get(t.key)!, byVariant[0].get(t.key)!),
    }));
  }
  return { results, kept };
}

/** The whole study on one thread. The study command can also share the jobs out between threads. */
export function runCombat(s: CombatStudy, raw: unknown, rules: Rules, opts: Opts = {}) {
  const cs = contents(s, raw);
  const js = jobs(s, cs);
  return assemble(s, cs, rules, js, js.map((job) => runJob(s, cs, rules, job, opts)), opts);
}

function summarize(c: Content, p: Party, runs: RunResult[], colour: Colour): PartyResult {
  const won = runs.filter((r) => r.won).length;
  const prog = runs.map((r) => r.progress);
  const lost = runs.filter((r) => !r.won);
  const lostIn: Record<string, number> = {};
  for (const r of lost) lostIn[r.fights.at(-1)!.stage] = (lostIn[r.fights.at(-1)!.stage] ?? 0) + 1;
  const rounds: Record<string, number> = {};
  for (const stage of new Set(runs.flatMap((r) => r.fights.map((f) => f.stage)))) rounds[stage] = quantile(runs.flatMap((r) => r.fights.filter((f) => f.stage === stage).map((f) => f.rounds)), 0.5);
  return {
    key: partyKey(p),
    label: label(c, p),
    colour: colour(c, p),
    size: p.units.length,
    wins: rate(won, runs.length),
    progress: average(prog),
    p10: quantile(prog, 0.1),
    p90: quantile(prog, 0.9),
    tries: won ? runs.length / won : Infinity,
    lostIn,
    enemyLeft: quantile(lost.map((r) => r.fights.at(-1)!.enemyLeft), 0.5),
    rounds,
  };
}

/** How many colours can win at all, and inside them, how many tweaks do. */
export function strictness(ps: readonly { colour: string; wins: { value: number } }[], bar: number): Strictness {
  const colours = [...new Set(ps.map((p) => p.colour))];
  const winning = colours.filter((col) => ps.some((p) => p.colour === col && p.wins.value >= bar));
  const inside = ps.filter((p) => winning.includes(p.colour));
  return { colours: colours.length, winning, tweaks: inside.length, tweaksWinning: inside.filter((p) => p.wins.value >= bar).length };
}

/**
 * Step 2's four numbers, on the best parties: the best picks with hindsight
 * (the best path on each seed), the best a player could know (a priority list
 * learned on the first half of the seeds, played on the second), random picks
 * (the average path) and the worst. Measured on the second half of the seeds.
 */
function perkNumbers(c: Content, pr: Probe, t: Target, ps: Party[], results: PartyResult[], n: number): PerkNumbers[] {
  const top = ps.map((p, i) => ({ p, r: results[i] })).sort((a, b) => b.r.progress.value - a.r.progress.value).slice(0, 3);
  const score = (r: RunResult) => r.progress + (r.won ? 1 : 0);
  return top.map(({ p, r }) => {
    const learn = new Map<string, number[]>();
    const test = { hindsight: [] as number[], random: [] as number[], worst: [] as number[], knowable: [] as number[] };
    const half = Math.floor(n / 2);
    for (let seed = 1; seed <= n; seed++) {
      const all = paths(c, pr, { dungeon: t.dungeon, party: p, seed, firstClear: true });
      const scores = all.map(score);
      if (seed <= half) {
        const m = mean(scores);
        all.forEach((path, i) => path.perks.forEach((k) => learn.set(k, learn.get(k) ?? []).get(k)!.push(scores[i] - m)));
        continue;
      }
      test.hindsight.push(Math.max(...scores));
      test.worst.push(Math.min(...scores));
      test.random.push(mean(scores));
    }
    const rank = [...learn].sort((a, b) => mean(b[1]) - mean(a[1])).map(([k]) => k);
    const byRank: Picker = (d) => [...d.options].sort((a, b) => (rank.indexOf(a) + 1 || 999) - (rank.indexOf(b) + 1 || 999))[0];
    for (let seed = half + 1; seed <= n; seed++) test.knowable.push(score(measure(c, pr, { dungeon: t.dungeon, party: p, seed, firstClear: true }, byRank)));
    return { party: r.label, seeds: n - half, hindsight: mean(test.hindsight), knowable: mean(test.knowable), random: mean(test.random), worst: mean(test.worst) };
  });
}

/** Per seed, the average over a group of parties. */
const seedMeans = (runs: RunResult[][], idx: number[]) => runs[0].map((_, i) => mean(idx.map((j) => runs[j][i].progress)));

/** Each class: parties with it against parties of the same size without it, on the same seeds. */
function classEffects(c: Content, ps: Party[], runs: RunResult[][]): Effect[] {
  const classOf = (p: Party) => new Set(p.units.map((u) => u.class));
  return c.pack.classes.map(({ id }) => {
    const a: number[] = [], b: number[] = [];
    for (const size of new Set(ps.map((p) => p.units.length))) {
      const w = ps.flatMap((p, j) => (p.units.length === size && classOf(p).has(id) ? [j] : []));
      const wo = ps.flatMap((p, j) => (p.units.length === size && !classOf(p).has(id) ? [j] : []));
      if (!w.length || !wo.length) continue;
      seedMeans(runs, w).forEach((x, i) => (a[i] = (a[i] ?? 0) + x));
      seedMeans(runs, wo).forEach((x, i) => (b[i] = (b[i] ?? 0) + x));
    }
    return a.length ? [{ factor: `has a ${id}`, comparison: compare(a, b) }] : [];
  }).flat();
}

/** Each extra unit: parties of size k against size k - 1. */
function sizeEffects(ps: Party[], runs: RunResult[][]): Effect[] {
  const sizes = [...new Set(ps.map((p) => p.units.length))].sort();
  const of = (k: number) => ps.flatMap((p, j) => (p.units.length === k ? [j] : []));
  return sizes.slice(1).map((k) => ({ factor: `${k} units, not ${k - 1}`, comparison: compare(seedMeans(runs, of(k)), seedMeans(runs, of(k - 1))) }));
}

/**
 * A cheap check for synergies: for each pair, how much more the two do
 * together than apart (AB − A − B + neither), averaged over the parties they
 * can join. A pair that stands far above the rest is flagged.
 */
function pairs(c: Content, ps: Party[], runs: RunResult[][]) {
  const prog = new Map(ps.map((p, j) => [p.units.map((u) => u.class).sort().join("+"), mean(runs[j].map((r) => r.progress))]));
  const get = (classes: string[]) => (classes.length ? prog.get([...classes].sort().join("+")) : 0);
  const classes = [...new Set(ps.flatMap((p) => p.units.map((u) => u.class)))];
  const out: { pair: string; extra: number; standsOut: boolean }[] = [];
  for (let i = 0; i < classes.length; i++)
    for (let j = i + 1; j < classes.length; j++) {
      const extras: number[] = [];
      for (const rest of [[], ...classes.filter((s) => s !== classes[i] && s !== classes[j]).map((s) => [s])]) {
        const ab = get([...rest, classes[i], classes[j]]), a = get([...rest, classes[i]]), b = get([...rest, classes[j]]), n = get(rest);
        if ([ab, a, b, n].every((x) => x !== undefined)) extras.push(ab! - a! - b! + n!);
      }
      if (extras.length) out.push({ pair: `${short(c, classes[i])} + ${short(c, classes[j])}`, extra: mean(extras), standsOut: false });
    }
  const mid = quantile(out.map((p) => p.extra), 0.5);
  const spread = quantile(out.map((p) => Math.abs(p.extra - mid)), 0.5) || 0.1;
  for (const p of out) p.standsOut = p.extra > mid + 4 * spread && p.extra > mid + 0.5;
  return out.sort((a, b) => b.extra - a.extra);
}

/**
 * Which tweaks change results: each party against itself with one thing
 * changed, on the same seeds. A tweak to something that does nothing comes out
 * identical; unit order changes slot order, which decides ties within a sub-tick.
 */
function tweakEffects(s: CombatStudy, js: Job[], pieces: Piece[]): Effect[] {
  return Object.keys(TWEAKS).map((factor) => {
    const a = Array<number>(s.effectSeeds).fill(0), b = Array<number>(s.effectSeeds).fill(0);
    let n = 0;
    js.forEach((job, i) => {
      if (job.tweak !== factor) return;
      for (const { base, changed } of pieces[i].tweak!) {
        for (const q of changed) {
          n++;
          q.forEach((x, k) => {
            a[k] += x;
            b[k] += base[k];
          });
        }
      }
    });
    return { factor, comparison: compare(a.map((x) => x / (n || 1)), b.map((x) => x / (n || 1))) };
  });
}

/** The tweaks, each as the changed copies of a party. */
const TWEAKS: Record<string, (c: Content, owned: Owned, p: Party) => Party[]> = {
  formation: (c, owned, p) => owned.formations.filter((f) => f !== p.formation).map((f) => make(c, owned, p.units.map((u) => u.class), f, p)),
  gear: (_c, _owned, p) => [{ ...p, units: p.units.map((u) => ({ ...u, gear: {} })) }],
  abilities: (c, _owned, p) => [{ ...p, units: p.units.map((u) => ({ ...u, abilities: c.classes.get(u.class)!.abilities.slice(-c.pack.design.abilitiesEquipped) })) }],
  "unit order": (c, owned, p) => (p.units.length > 1 ? [make(c, owned, p.units.map((u) => u.class).reverse(), p.formation, p)] : []),
};

/** One tweak on one target: each party's progress per seed, and each changed copy's. */
function tweakRuns(c: Content, pr: Probe, s: CombatStudy, t: Target, tweak: string): NonNullable<Piece["tweak"]> {
  const owned = everything(c);
  const seeds = Array.from({ length: s.effectSeeds }, (_, i) => i + 1);
  const progress = (p: Party) => seeds.map((seed) => measure(c, pr, { dungeon: t.dungeon, party: p, seed, firstClear: true }, pickerFor(s, seed)).progress);
  return partiesFor(c, s, t).flatMap((p) => {
    const qs = TWEAKS[tweak](c, owned, p).filter((q) => fits(c, q, t.dungeon));
    return qs.length ? [{ base: progress(p), changed: qs.map(progress) }] : [];
  });
}
