/**
 * The combat level: many parties against many dungeons, challenges or single
 * fights, many seeds each, with logs off. Every party plays the same seeds.
 */
import { randomPicker, type Content, type Picker, type Rules } from "../engine/run.js";
import type { Party } from "../schema.js";
import { build, ladder, patch } from "./content.js";
import { measure, paths, probe, type Probe, type RunResult } from "./measure.js";
import { all, classColour, everything, fits, label, make, partyKey, short, type Colour } from "./parties.js";
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

/** The parties a target allows: each set of specializations once, in the first owned formation that fits. */
function partiesFor(c: Content, s: CombatStudy, t: Target): Party[] {
  if (Array.isArray(s.parties)) return s.parties.filter((p) => fits(c, p, t.dungeon, t.challenge));
  const cap = Math.min(s.parties.max ?? 99, c.dungeons.get(t.dungeon)!.partySize.max);
  const owned = everything(c);
  if (s.parties.formations === "all") return all(c, owned, cap, "all").filter((p) => fits(c, p, t.dungeon, t.challenge));
  const out: Party[] = [];
  for (const p of all(c, owned, cap, "first")) {
    const f = owned.formations.map((id) => make(c, owned, p.units.map((u) => u.spec), id)).find((q) => fits(c, q, t.dungeon, t.challenge));
    if (f) out.push(f);
  }
  return out;
}

const pickerFor = (s: CombatStudy, seed: number): Picker => {
  if (s.perks === "random") return randomPicker(seed);
  const list = s.perks.list;
  return (d) => d.options.find((o) => list.includes(o)) ?? [...d.options].sort((a, b) => list.indexOf(a) - list.indexOf(b))[0];
};

export function runCombat(s: CombatStudy, raw: unknown, rules: Rules, opts: { colour?: Colour; keep?: boolean } = {}) {
  const colour = opts.colour ?? classColour;
  const seeds = Array.from({ length: s.seeds }, (_, i) => i + 1);
  const results: CombatResults = { study: s, content: { id: "", fingerprint: "" }, rules: rules.id, runs: 0, variants: [] };
  const kept: Kept = [];
  const byVariant: Map<string, number[]>[] = [];
  const base = s.content.ladder ? ladder(raw, s.content.ladder) : raw;
  for (const v of s.variants) {
    const c = build(patch(base, v.patch), s.targets.fights);
    if (!results.content.id) results.content = { id: c.pack.id, fingerprint: c.fingerprint };
    const pr = probe(rules);
    const out: VariantResult = { name: v.name, targets: [], tweaks: [] };
    const avg = new Map<string, number[]>();
    for (const t of targets(c, s)) {
      const ps = partiesFor(c, s, t);
      const runs = ps.map((p) =>
        seeds.map((seed) => {
          const r = measure(c, pr, { dungeon: t.dungeon, party: p, seed, firstClear: true }, pickerFor(s, seed));
          if (opts.keep && v === s.variants[0]) kept.push({ target: t, party: p, result: r });
          return r;
        }),
      );
      avg.set(t.key, seeds.map((_, i) => mean(runs.map((rs) => rs[i].progress))));
      avg.set(`${t.key}#wins`, seeds.map((_, i) => mean(runs.map((rs) => +rs[i].won))));
      const parties = ps.map((p, i) => summarize(c, p, runs[i], colour));
      out.targets.push({
        target: t,
        parties,
        strictness: strictness(parties, s.bar),
        perks: t.challenge || !s.perkSeeds || v !== s.variants[0] ? [] : perkNumbers(c, pr, t, ps, parties, s.perkSeeds),
        classes: t.challenge ? [] : classEffects(c, ps, runs),
        sizes: t.challenge ? [] : sizeEffects(ps, runs),
        pairs: t.challenge ? [] : pairs(c, ps, runs),
      });
    }
    if (s.effectSeeds && v === s.variants[0]) out.tweaks = tweakEffects(c, pr, s, targets(c, s).filter((t) => !t.challenge));
    byVariant.push(avg);
    results.variants.push(out);
    results.runs += pr.counter.runs;
  }
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
  const classOf = (p: Party) => new Set(p.units.map((u) => c.specs.get(u.spec)!.class));
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
  const prog = new Map(ps.map((p, j) => [p.units.map((u) => u.spec).sort().join("+"), mean(runs[j].map((r) => r.progress))]));
  const get = (specs: string[]) => (specs.length ? prog.get([...specs].sort().join("+")) : 0);
  const specs = [...new Set(ps.flatMap((p) => p.units.map((u) => u.spec)))];
  const out: { pair: string; extra: number; standsOut: boolean }[] = [];
  for (let i = 0; i < specs.length; i++)
    for (let j = i + 1; j < specs.length; j++) {
      const extras: number[] = [];
      for (const rest of [[], ...specs.filter((s) => s !== specs[i] && s !== specs[j]).map((s) => [s])]) {
        const ab = get([...rest, specs[i], specs[j]]), a = get([...rest, specs[i]]), b = get([...rest, specs[j]]), n = get(rest);
        if ([ab, a, b, n].every((x) => x !== undefined)) extras.push(ab! - a! - b! + n!);
      }
      if (extras.length) out.push({ pair: `${short(c, specs[i])} + ${short(c, specs[j])}`, extra: mean(extras), standsOut: false });
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
function tweakEffects(c: Content, pr: Probe, s: CombatStudy, ts: Target[]): Effect[] {
  const owned = everything(c);
  const seeds = Array.from({ length: s.effectSeeds }, (_, i) => i + 1);
  const changes: Record<string, (p: Party) => Party[]> = {
    formation: (p) => owned.formations.filter((f) => f !== p.formation).map((f) => make(c, owned, p.units.map((u) => u.spec), f, p)),
    gear: (p) => [{ ...p, units: p.units.map((u) => ({ ...u, gear: {} })) }],
    abilities: (p) => [{ ...p, units: p.units.map((u) => ({ ...u, abilities: c.specs.get(u.spec)!.abilities.slice(2, 4) })) }],
    "unit order": (p) => (p.units.length > 1 ? [make(c, owned, p.units.map((u) => u.spec).reverse(), p.formation, p)] : []),
  };
  return Object.entries(changes).map(([factor, change]) => {
    const a = seeds.map(() => 0), b = seeds.map(() => 0);
    let n = 0;
    for (const t of ts) {
      for (const p of partiesFor(c, s, t)) {
        const qs = change(p).filter((q) => fits(c, q, t.dungeon));
        if (!qs.length) continue;
        const base = seeds.map((seed) => measure(c, pr, { dungeon: t.dungeon, party: p, seed, firstClear: true }, pickerFor(s, seed)).progress);
        for (const q of qs) {
          n++;
          seeds.forEach((seed, i) => {
            a[i] += measure(c, pr, { dungeon: t.dungeon, party: q, seed, firstClear: true }, pickerFor(s, seed)).progress;
            b[i] += base[i];
          });
        }
      }
    }
    return { factor, comparison: compare(a.map((x) => x / (n || 1)), b.map((x) => x / (n || 1))) };
  });
}
