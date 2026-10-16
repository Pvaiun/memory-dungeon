/**
 * The progression level: simulated players play week by week. Each week they
 * complete some of the board's quests, collect unlocks, adjust their party and
 * play runs: the next dungeon, or the challenges of dungeons already cleared.
 * Replays are challenges only, and each pays once, so there's no grinding.
 *
 * - The optimizer, who we tune for: does most of each board, and homes in on
 *   builds by trial and error. It sees what a player sees (wins, losses, how
 *   far it got), never hidden stats, and stops searching once something wins.
 * - The benchmark, beside it: the strongest party the harness finds with what
 *   the player owns, seeing everything, within a fixed budget.
 * - The casual player, as a check: a few quests and runs. It puts each new
 *   unit straight into its party, and after two losses in a row swaps one
 *   unit, preferring one it hasn't tried there yet. It never changes
 *   formation, gear or abilities, and picks perks at random.
 */
import { hash32, int, next, rngFor, shuffle, type Rng } from "../engine/rng.js";
import { randomPicker, type Content, type Picker, type Rules } from "../engine/run.js";
import type { LootTableT, Party } from "../schema.js";
import { build, ladder, patch } from "./content.js";
import { measure, paths, probe, type Probe } from "./measure.js";
import { all, classColour, everything, fits, label, make, partyKey, starter, tweaks, weighted, type Owned, type Tweak } from "./parties.js";
import { strictness, type Strictness } from "./combat.js";
import type { ProgressionStudy } from "./study.js";
import { average, compare, mean, rate, type Comparison, type Range } from "./sure.js";

export type Kind = "optimizer" | "casual";
export type Target = { key: string; dungeon: string; challenge?: string };

export type Week = {
  week: number;
  board: number;
  quests: number;
  unlocks: string[];
  /** Dungeons and challenges cleared this week, by key, and the party that cleared each dungeon. */
  cleared: string[];
  winners: Record<string, string>;
  /** Totals so far. */
  dungeons: number;
  challenges: number;
  owned: number;
  tries: number;
  /** The next dungeon at the week's end; null once the last is cleared. */
  next: string | null;
  /** Losses on each dungeon this week (not challenges), with the try that got furthest. */
  losses: Record<string, { n: number; best: { party: string; progress: number; lostIn: string; enemyLeft: number } }>;
  challengeLosses: number;
  /** Set in a stuck week: no new dungeon, and the last not yet cleared. */
  wall?: "quests" | "play";
  why?: "a party it owns can win" | "challenges left";
  /** How often perk picks change the result for the benchmark's best party at this wall (optimizer only). */
  perksChange?: number;
  /** Dungeons the benchmark has cleared with the same unlocks (optimizer only). */
  benchmark?: number;
};

export type Wall = { dungeon: string; from: number; weeks: number; kinds: ("quests" | "play")[]; brokeBy: "unlock" | "loot" | "play" | "both" | "still walled" };
export type PlayerLog = { kind: Kind; seed: number; weeks: Week[]; walls: Wall[]; mattersWeek: number | null };

export type KindSummary = {
  kind: Kind;
  byWeek: { week: number; dungeons: Range; challenges: Range; owned: Range; stuck: number; quests: number; play: number; benchmark?: Range }[];
  stuckWeeks: number;
  byQuests: number;
  byPlay: { total: number; ownsWinner: number; challengesLeft: number };
  walls: { count: number; weeks: Range; longest: number; brokeBy: Record<string, number>; sortedThenEnded: Record<string, number> };
  matters: { players: number; median: number | null };
  /** The first week the board had nothing left to offer: players it happened to, and the median week. */
  dry: { players: number; median: number | null };
  perksChange: number | null;
  /** Total dungeon-weeks per player, the comparison measure. */
  score: number[];
};

export type ProgressionResults = {
  study: ProgressionStudy;
  content: { id: string; fingerprint: string };
  rules: string;
  dungeons: { id: string; name: string; strictness: Strictness }[];
  summaries: KindSummary[];
  optimizerVsCasual: Comparison;
  /** Player-weeks in which the optimizer had cleared more dungeons than its benchmark. Should be 0. */
  benchmarkBehind: number;
  bench: { questions: number; runs: number; budgetOut: number; maxRuns: number };
  runs: number;
  players: PlayerLog[];
};

// ─── The benchmark ──────────────────────────────────────────────────────────

type Eval = { party: Party; wins: number; n: number; progress: number };
export type BenchAnswer = { best: Eval | null; runs: number; budgetOut: boolean; clearable: boolean };

const ownedKey = (o: Owned) => `${[...o.specs].sort()}|${[...o.formations].sort()}|${Object.entries(o.gear).sort().map(([g, n]) => `${g}*${n}`)}`;

/**
 * The benchmark: searches colour by colour, tries a few tweaks of the best,
 * and stops at the first party that wins `stopAt` of its tries. Every party is
 * judged on the same seeds. Its budget counts every party it judges, so the
 * answer doesn't depend on what it already knows.
 */
export function benchmark(c: Content, pr: Probe, cfg: ProgressionStudy["benchmark"], clearBar: number) {
  const evals = new Map<string, Eval>();
  const answers = new Map<string, BenchAnswer>();
  const stats = { questions: 0, runs: 0, budgetOut: 0, maxRuns: 0 };
  const judge = (p: Party, t: Target): Eval => {
    const key = `${partyKey(p)}@${t.dungeon}`;
    let e = evals.get(key);
    if (!e) {
      let wins = 0, progress = 0;
      for (let i = 1; i <= cfg.seeds; i++) {
        const r = measure(c, pr, { dungeon: t.dungeon, party: p, seed: 900_000 + i, firstClear: true }, randomPicker(900_000 + i));
        wins += +r.won;
        progress += r.progress;
      }
      e = { party: p, wins, n: cfg.seeds, progress: progress / cfg.seeds };
      evals.set(key, e);
    }
    return e;
  };
  const better = (a: Eval, b: Eval | null) => !b || a.wins > b.wins || (a.wins === b.wins && a.progress > b.progress);
  function ask(owned: Owned, t: Target): BenchAnswer {
    const key = `${ownedKey(owned)}@${t.key}`;
    const known = answers.get(key);
    if (known) return known;
    const cap = c.dungeons.get(t.dungeon)!.partySize.max;
    const byColour = new Map<string, Party[]>();
    for (const p of all(c, owned, cap, "first").sort((a, b) => b.units.length - a.units.length)) {
      const q = owned.formations.map((f) => make(c, owned, p.units.map((u) => u.spec), f)).find((x) => fits(c, x, t.dungeon, t.challenge));
      if (q) byColour.set(classColour(c, q), [...(byColour.get(classColour(c, q)) ?? []), q]);
    }
    let best: Eval | null = null, runs = 0;
    const seen = new Set<string>();
    const done = () => !!best && best.wins >= cfg.stopAt * cfg.seeds;
    const tryOne = (p: Party) => {
      if (seen.has(partyKey(p)) || runs + cfg.seeds > cfg.budget || done()) return;
      seen.add(partyKey(p));
      runs += cfg.seeds;
      const e = judge(p, t);
      if (better(e, best)) best = e;
    };
    const colours = [...byColour.keys()].sort();
    for (const col of colours) tryOne(byColour.get(col)![0]);
    const tried = done() ? [] : colours.filter((col) => seen.has(partyKey(byColour.get(col)![0])));
    const ranked = tried.map((col) => ({ col, e: judge(byColour.get(col)![0], t) })).sort((a, b) => (better(a.e, b.e) ? -1 : 1));
    for (const { col } of ranked.slice(0, 2)) {
      let top: Eval | null = null;
      for (const p of byColour.get(col)!) {
        tryOne(p);
        const e = evals.get(`${partyKey(p)}@${t.dungeon}`);
        if (e && better(e, top)) top = e;
      }
      const around = top ? tweaks(c, owned, top.party, cap).filter((x) => x.kind !== "unit" && x.kind !== "add" && x.kind !== "drop") : [];
      for (const x of around) if (fits(c, x.party, t.dungeon, t.challenge)) tryOne(x.party);
    }
    const b = best as Eval | null;
    const out: BenchAnswer = { best: b, runs, budgetOut: !done() && runs + cfg.seeds > cfg.budget, clearable: !!b && b.wins > 0 && b.wins >= clearBar * b.n };
    stats.questions++;
    stats.runs += runs;
    stats.maxRuns = Math.max(stats.maxRuns, runs);
    if (out.budgetOut) stats.budgetOut++;
    answers.set(key, out);
    return out;
  }
  return { ask, judge, stats };
}

// ─── Players ────────────────────────────────────────────────────────────────

type Unlock = { kind: "specs" | "formations" | "gear"; id: string; name: string };

function unlockPool(c: Content): Unlock[] {
  const s = c.pack.starter;
  return [
    ...c.pack.specializations.filter((x) => !s.specializations.includes(x.id)).map((x) => ({ kind: "specs" as const, id: x.id, name: x.name })),
    ...c.pack.formations.filter((x) => !s.formations.includes(x.id)).map((x) => ({ kind: "formations" as const, id: x.id, name: x.name })),
    ...c.pack.gear.filter((x) => x.source === "unlock").map((x) => ({ kind: "gear" as const, id: x.id, name: x.name })),
  ];
}

const owns = (o: Owned, u: Unlock) => (u.kind === "gear" ? (o.gear[u.id] ?? 0) > 0 : o[u.kind].includes(u.id));
function give(o: Owned, u: Unlock) {
  if (u.kind === "gear") o.gear[u.id] = (o.gear[u.id] ?? 0) + 1;
  else o[u.kind].push(u.id);
}

function rollLoot(t: LootTableT, rng: Rng): string[] {
  const out = [...(t.guaranteed ?? [])];
  const table = t.table ?? [];
  for (let i = 0; i < (t.rolls ?? 0) && table.length; i++) out.push(weighted(rng, table, (e) => e.weight).gear);
  return out;
}

const TWEAK_WEIGHT: Record<Tweak["kind"], number> = { unit: 4, add: 4, drop: 1, formation: 2, gear: 1, abilities: 1, order: 1 };

type Tried = { party: Party; tries: number; wins: number; progress: number; lastEnemyLeft: number };

export type Versus = { name: string; optimizer: Comparison; casual: Comparison; stuck: [number, number]; byQuests: [number, number] };

/** Every version in the study, each against the first: the same players, boards and dice. */
export function runVersions(s: ProgressionStudy, raw: unknown, rules: Rules) {
  const all = s.variants.map((_, i) => runProgression(s, raw, rules, i));
  const [base] = all;
  const versus: Versus[] = all.slice(1).map((r, i) => ({
    name: s.variants[i + 1].name,
    optimizer: compare(r.summaries[0].score, base.summaries[0].score),
    casual: compare(r.summaries[1].score, base.summaries[1].score),
    stuck: [base.summaries[0].stuckWeeks, r.summaries[0].stuckWeeks],
    byQuests: [base.summaries[0].byQuests, r.summaries[0].byQuests],
  }));
  return { results: base, others: all.slice(1), versus };
}

export function runProgression(s: ProgressionStudy, raw: unknown, rules: Rules, variant = 0): ProgressionResults {
  const base = s.content.ladder ? ladder(raw, s.content.ladder) : raw;
  const c = build(patch(base, s.variants[variant].patch));
  const pr = probe(rules);
  const bench = benchmark(c, pr, s.benchmark, s.clearBar);
  const order = c.pack.progression.dungeonOrder;
  const pool = unlockPool(c);
  const loot = new Set(c.pack.gear.filter((g) => g.source === "loot").map((g) => g.id));
  // Checking a challenge's rules is slow, so each party and target is checked once.
  const fitted = new Map<string, boolean>();
  const fit = (p: Party, t: Target) => {
    const k = `${partyKey(p)}@${t.key}`;
    if (!fitted.has(k)) fitted.set(k, fits(c, p, t.dungeon, t.challenge));
    return fitted.get(k)!;
  };
  const perkMemo = new Map<string, number>();

  const available = (cleared: Set<string>): Target[] =>
    order.filter((d) => cleared.has(d)).flatMap((d) => c.dungeons.get(d)!.challenges.filter((ch) => !cleared.has(`${d}:${ch.id}`)).map((ch) => ({ key: `${d}:${ch.id}`, dungeon: d, challenge: ch.id })));
  const nextOf = (cleared: Set<string>) => order.find((d) => !cleared.has(d)) ?? null;
  const asTarget = (d: string): Target => ({ key: d, dungeon: d });

  function player(kind: Kind, seed: number, shadow: Owned[] | null): PlayerLog {
    const owned = starter(c);
    const cleared = new Set<string>();
    const memory = new Map<string, Map<string, Tried>>();
    const perkValue = new Map<string, { n: number; sum: number }>();
    let party = make(c, owned, owned.specs, owned.formations[0]);
    /** The casual player's losses in a row with its current party, and the units it has taken into each dungeon. */
    let streak = 0;
    const triedIn = new Map<string, Set<string>>();
    const weeks: Week[] = [];
    const walls: (Wall & { owned: Owned })[] = [];
    /** The party that cleared each dungeon, and what the player owned at that moment, before the clear's loot. */
    const clearedWith = new Map<string, { owned: Owned; party: Party }>();
    let mattersWeek: number | null = null;

    const optimizerPerks: Picker = (d) =>
      [...d.options].sort((a, b) => {
        const va = perkValue.get(a), vb = perkValue.get(b);
        return (va ? va.sum / va.n : 99) > (vb ? vb.sum / vb.n : 99) ? -1 : 1;
      })[0];

    function choose(t: Target, rng: Rng): Party {
      const cap = c.dungeons.get(t.dungeon)!.partySize.max;
      const ok = (p: Party) => fit(p, t);
      const mem = memory.get(t.key);
      if (!mem?.size) {
        const extra = [...owned.specs].reverse().filter((sp) => !party.units.some((u) => u.spec === sp));
        let p = make(c, owned, [...party.units.map((u) => u.spec), ...extra].slice(0, cap), party.formation, party);
        if (!ok(p)) p = tweaks(c, owned, p, cap).map((x) => x.party).find(ok) ?? shuffle(rng, all(c, owned, cap, "all").filter(ok))[0] ?? p;
        return p;
      }
      const best = [...mem.values()].sort((a, b) => b.wins - a.wins || b.progress / b.tries - a.progress / a.tries)[0];
      if (next(rng) < (best.lastEnemyLeft < 0.25 ? 0.5 : 0.2)) return best.party;
      const options = tweaks(c, owned, best.party, cap).filter((x) => ok(x.party) && !mem.has(partyKey(x.party)));
      return options.length ? weighted(rng, options, (x) => TWEAK_WEIGHT[x.kind]).party : best.party;
    }

    function attempt(t: Target, week: number, n: number, w: Week, rng: Rng): boolean {
      const p = kind === "optimizer" ? choose(t, rng) : party;
      const runSeed = hash32(`${seed}:${kind}:${week}:${n}`);
      const r = measure(c, pr, { dungeon: t.dungeon, party: p, seed: runSeed, firstClear: !t.challenge }, kind === "optimizer" ? optimizerPerks : randomPicker(runSeed));
      w.tries++;
      if (kind === "optimizer") {
        party = p;
        const mem = memory.get(t.key) ?? new Map<string, Tried>();
        memory.set(t.key, mem);
        const k = partyKey(p);
        const m = mem.get(k) ?? { party: p, tries: 0, wins: 0, progress: 0, lastEnemyLeft: 1 };
        mem.set(k, m);
        m.tries++;
        m.wins += +r.won;
        m.progress += r.progress;
        m.lastEnemyLeft = r.won ? 0 : r.fights.at(-1)!.enemyLeft;
        for (const pk of r.perks) {
          const v = perkValue.get(pk) ?? { n: 0, sum: 0 };
          perkValue.set(pk, { n: v.n + 1, sum: v.sum + r.progress });
        }
      }
      if (!t.challenge && !r.won) {
        const last = r.fights.at(-1)!;
        const l = (w.losses[t.dungeon] ??= { n: 0, best: { party: "", progress: -1, lostIn: "", enemyLeft: 1 } });
        l.n++;
        if (r.progress > l.best.progress) l.best = { party: label(c, p), progress: r.progress, lostIn: last.stage, enemyLeft: last.enemyLeft };
      }
      if (t.challenge && !r.won) w.challengeLosses++;
      if (!r.won) return false;
      if (!t.challenge) clearedWith.set(t.key, { owned: structuredClone(owned), party: p }), (w.winners[t.key] = label(c, p));
      cleared.add(t.key);
      w.cleared.push(t.key);
      const got = t.challenge ? rollLoot(c.dungeons.get(t.dungeon)!.challenges.find((ch) => ch.id === t.challenge)!.loot, rngFor(seed, `${kind}:loot:${t.key}`)) : r.loot;
      for (const g of got) owned.gear[g] = (owned.gear[g] ?? 0) + 1;
      return true;
    }

    for (let week = 1; week <= s.weeks; week++) {
      const w: Week = { week, board: 0, quests: 0, unlocks: [], cleared: [], winners: {}, dungeons: 0, challenges: 0, owned: 0, tries: 0, next: null, losses: {}, challengeLosses: 0 };
      // The board, then the quests this player does.
      const brng = rngFor(seed, `board:${week}`);
      const board = shuffle(brng, pool.filter((u) => !owns(owned, u))).slice(0, s.board[0] + int(brng, s.board[1] - s.board[0] + 1));
      const qrng = rngFor(seed, `${kind}:quests:${week}`);
      const done = kind === "optimizer" ? board.filter(() => next(qrng) < s.optimizer.quests) : board.slice(0, s.casual.quests[0] + int(qrng, s.casual.quests[1] - s.casual.quests[0] + 1));
      w.board = board.length;
      w.quests = done.length;
      for (const u of done) give(owned, u), w.unlocks.push(u.name);
      if (shadow) shadow.push(structuredClone(owned));
      // The casual player puts each new unit straight in: into a free place, or in place of a unit picked at random.
      const nd = nextOf(cleared);
      if (kind === "casual" && nd) {
        const cap = c.dungeons.get(nd)!.partySize.max;
        const prng = rngFor(seed, `casual:party:${week}`);
        for (const u of done.filter((x) => x.kind === "specs")) {
          const specs = party.units.map((x) => x.spec);
          if (specs.length < cap) specs.push(u.id);
          else specs[int(prng, specs.length)] = u.id;
          party = make(c, owned, specs, party.formation, party);
          streak = 0;
        }
      }
      // Runs.
      const rng = rngFor(seed, `${kind}:choose:${week}`);
      if (kind === "casual") {
        const n = s.casual.runs[0] + int(rng, s.casual.runs[1] - s.casual.runs[0] + 1);
        for (let i = 0; i < n; i++) {
          const d = nextOf(cleared);
          if (!d) break;
          const tried = triedIn.get(d) ?? new Set<string>();
          triedIn.set(d, tried);
          if (streak >= 2) {
            // Two losses in a row: swap one unit, preferring one it hasn't taken into this dungeon yet.
            const swaps = tweaks(c, owned, party, c.dungeons.get(d)!.partySize.max).filter((x) => x.kind === "unit" || x.kind === "add");
            const fresh = swaps.filter((x) => x.party.units.some((u) => !tried.has(u.spec)));
            const pick = shuffle(rng, fresh.length ? fresh : swaps)[0];
            if (pick) party = pick.party;
            streak = 0;
          }
          for (const u of party.units) tried.add(u.spec);
          streak = attempt(asTarget(d), week, i, w, rng) ? 0 : streak + 1;
        }
      } else {
        const budget = s.optimizer.tries;
        const quotaNext = Math.ceil(budget / 2), quotaChallenge = Math.max(1, Math.floor(budget / 8));
        const used = new Map<string, number>();
        const attemptable = (t: Target) => all(c, owned, c.dungeons.get(t.dungeon)!.partySize.max, "all").some((p) => fit(p, t));
        for (let i = 0; i < budget; i++) {
          const d = nextOf(cleared);
          const chs = available(cleared).filter(attemptable);
          const spent = (k: string) => used.get(k) ?? 0;
          const t =
            (d && spent(d) < quotaNext ? asTarget(d) : null) ??
            chs.find((x) => spent(x.key) < quotaChallenge) ??
            (d ? asTarget(d) : null) ??
            chs.sort((a, b) => spent(a.key) - spent(b.key))[0];
          if (!t) break;
          used.set(t.key, spent(t.key) + 1);
          attempt(t, week, i, w, rng);
        }
      }
      // Party choices start to matter in the first week the player owns more units than fit, and on a
      // dungeon it played, the best and worst full parties it could field differ by a lot: half the
      // tries won, or a whole fight of progress. "A lot" is a placeholder.
      if (mattersWeek === null) {
        for (const d of order.filter((d) => w.losses[d] || w.cleared.includes(d))) {
          const cap = c.dungeons.get(d)!.partySize.max;
          if (owned.specs.length <= cap) continue;
          const full = all(c, owned, cap, "first").filter((p) => p.units.length === cap).map((p) => bench.judge(p, asTarget(d)));
          const gap = (f: (e: { wins: number; n: number; progress: number }) => number) => Math.max(...full.map(f)) - Math.min(...full.map(f));
          if (gap((e) => e.wins / e.n) >= 0.5 || gap((e) => e.progress) >= 1) mattersWeek = week;
        }
      }
      // The week's totals, and if stuck, what walls it.
      w.next = nextOf(cleared);
      w.dungeons = order.filter((d) => cleared.has(d)).length;
      w.challenges = cleared.size - w.dungeons;
      w.owned = pool.filter((u) => owns(owned, u)).length;
      const newDungeon = w.cleared.some((k) => !k.includes(":"));
      if (w.next && !newDungeon) {
        const a = bench.ask(owned, asTarget(w.next));
        if (a.clearable) (w.wall = "play"), (w.why = "a party it owns can win");
        else if (available(cleared).some((t) => bench.ask(owned, t).clearable)) (w.wall = "play"), (w.why = "challenges left");
        else w.wall = "quests";
        if (kind === "optimizer" && a.best) {
          const k = `${partyKey(a.best.party)}@${w.next}`;
          if (!perkMemo.has(k)) perkMemo.set(k, perksChange(c, pr, a.best.party, asTarget(w.next)));
          w.perksChange = perkMemo.get(k);
        }
        const open = walls.at(-1);
        if (open && open.brokeBy === "still walled" && open.dungeon === w.next) open.weeks++, open.kinds.push(w.wall);
        else walls.push({ dungeon: w.next, from: week, weeks: 1, kinds: [w.wall], brokeBy: "still walled", owned: structuredClone(owned) });
      }
      for (const wall of walls) if (wall.brokeBy === "still walled" && cleared.has(wall.dungeon)) wall.brokeBy = brokeBy(wall.owned, clearedWith.get(wall.dungeon)!, asTarget(wall.dungeon));
      weeks.push(w);
    }
    return { kind, seed, weeks, walls: walls.map(({ owned: _, ...wall }) => wall), mattersWeek };
  }

  /**
   * What broke a wall. "play" if it already owned a party that wins, or won with nothing new (retries
   * and luck). Otherwise the new things the winning party used that made the wall winnable: the loot
   * gained during the wall, the unlocks, or only both together.
   */
  function brokeBy(before: Owned, at: { owned: Owned; party: Party }, t: Target): Wall["brokeBy"] {
    const { owned: after, party } = at;
    const used = party.units.flatMap((u) => Object.values(u.gear));
    const isNew = (g: string) => used.filter((x) => x === g).length > (before.gear[g] ?? 0);
    const usedLoot = used.some((g) => loot.has(g) && isNew(g));
    const usedUnlock = party.units.some((u) => !before.specs.includes(u.spec)) || !before.formations.includes(party.formation) || used.some((g) => !loot.has(g) && isNew(g));
    if (bench.ask(before, t).clearable || (!usedLoot && !usedUnlock)) return "play";
    const withLoot = structuredClone(before), withUnlocks = structuredClone(before);
    for (const [g, n] of Object.entries(after.gear)) {
      const add = n - (before.gear[g] ?? 0);
      if (add > 0) (loot.has(g) ? withLoot : withUnlocks).gear[g] = (before.gear[g] ?? 0) + add;
    }
    withUnlocks.specs = [...after.specs];
    withUnlocks.formations = [...after.formations];
    if (usedLoot && bench.ask(withLoot, t).clearable) return "loot";
    if (usedUnlock && bench.ask(withUnlocks, t).clearable) return "unlock";
    return usedLoot && usedUnlock && bench.ask(after, t).clearable ? "both" : "play";
  }

  /** The benchmark's own progress with the optimizer's unlocks, week by week: it clears whatever it can. */
  function shadowRun(seed: number, unlocksByWeek: Owned[]): number[] {
    const owned = starter(c);
    const cleared = new Set<string>();
    return unlocksByWeek.map((u) => {
      owned.specs = [...u.specs];
      owned.formations = [...u.formations];
      for (const [g, n] of Object.entries(u.gear)) if (!loot.has(g)) owned.gear[g] = n;
      for (let changed = true; changed; ) {
        changed = false;
        const d = nextOf(cleared);
        for (const t of [...(d ? [asTarget(d)] : []), ...available(cleared)]) {
          if (!bench.ask(owned, t).clearable) continue;
          cleared.add(t.key);
          const table = t.challenge ? c.dungeons.get(t.dungeon)!.challenges.find((ch) => ch.id === t.challenge)!.loot : c.dungeons.get(t.dungeon)!.loot.firstClear;
          for (const g of rollLoot(table, rngFor(seed, `bench:loot:${t.key}`))) owned.gear[g] = (owned.gear[g] ?? 0) + 1;
          changed = true;
        }
      }
      return order.filter((d) => cleared.has(d)).length;
    });
  }

  const players: PlayerLog[] = [];
  let behind = 0;
  for (let i = 1; i <= s.players; i++) {
    const unlocks: Owned[] = [];
    const opt = player("optimizer", i, unlocks);
    const b = shadowRun(i, unlocks);
    opt.weeks.forEach((w, j) => {
      w.benchmark = b[j];
      if (w.dungeons > b[j]) behind++;
    });
    players.push(opt, player("casual", i, null));
  }

  const summaries = (["optimizer", "casual"] as Kind[]).map((k) => summarize(k, players.filter((p) => p.kind === k), s.weeks));
  const dungeons = order.map((d) => {
    const cap = c.dungeons.get(d)!.partySize.max;
    const results = all(c, everything(c), cap, "first").map((p) => {
      const e = bench.judge(p, asTarget(d));
      return { colour: classColour(c, p), wins: rate(e.wins, e.n) };
    });
    return { id: d, name: c.dungeons.get(d)!.name, strictness: strictness(results, s.bar) };
  });
  return {
    study: s,
    content: { id: c.pack.id, fingerprint: c.fingerprint },
    rules: rules.id,
    dungeons,
    summaries,
    optimizerVsCasual: compare(summaries[0].score, summaries[1].score),
    benchmarkBehind: behind,
    bench: bench.stats,
    runs: pr.counter.runs,
    players,
  };
}

/** The share of seeds on which picking different perks changes win or loss. */
function perksChange(c: Content, pr: Probe, p: Party, t: Target, seeds = 5): number {
  let changed = 0;
  for (let i = 1; i <= seeds; i++) {
    const outcomes = new Set(paths(c, pr, { dungeon: t.dungeon, party: p, seed: 800_000 + i, firstClear: true }).map((r) => r.won));
    if (outcomes.size > 1) changed++;
  }
  return changed / seeds;
}

function summarize(kind: Kind, ps: PlayerLog[], weeks: number): KindSummary {
  const byWeek = Array.from({ length: weeks }, (_, j) => {
    const ws = ps.map((p) => p.weeks[j]);
    const share = (f: (w: Week) => boolean) => ws.filter(f).length / ws.length;
    return {
      week: j + 1,
      dungeons: average(ws.map((w) => w.dungeons)),
      challenges: average(ws.map((w) => w.challenges)),
      owned: average(ws.map((w) => w.owned)),
      stuck: share((w) => !!w.wall),
      quests: share((w) => w.wall === "quests"),
      play: share((w) => w.wall === "play"),
      benchmark: kind === "optimizer" ? average(ws.map((w) => w.benchmark ?? 0)) : undefined,
    };
  });
  const all = ps.flatMap((p) => p.weeks);
  const walls = ps.flatMap((p) => p.walls);
  const brokeBy: Record<string, number> = {};
  for (const w of walls) brokeBy[w.brokeBy] = (brokeBy[w.brokeBy] ?? 0) + 1;
  // How each wall was sorted while it stood, against what ended it: does the sort predict the outcome?
  const sortedThenEnded: Record<string, number> = {};
  for (const p of ps)
    for (const w of p.walls) {
      const how = [...new Set(p.weeks.slice(w.from - 1, w.from - 1 + w.weeks).map((x) => x.why ?? `walled by ${x.wall}`))].sort().join(" + ");
      const k = `${how} → ${w.brokeBy}`;
      sortedThenEnded[k] = (sortedThenEnded[k] ?? 0) + 1;
    }
  const median = (xs: (number | undefined | null)[]) => {
    const ok = xs.filter((x): x is number => typeof x === "number").sort((a, b) => a - b);
    return { players: ok.length, median: ok.length ? ok[Math.floor(ok.length / 2)] : null };
  };
  const matters = ps.map((p) => p.mattersWeek).filter((x): x is number => x !== null).sort((a, b) => a - b);
  const perks = all.filter((w) => w.perksChange !== undefined).map((w) => w.perksChange!);
  return {
    kind,
    byWeek,
    stuckWeeks: all.filter((w) => w.wall).length,
    byQuests: all.filter((w) => w.wall === "quests").length,
    byPlay: {
      total: all.filter((w) => w.wall === "play").length,
      ownsWinner: all.filter((w) => w.why === "a party it owns can win").length,
      challengesLeft: all.filter((w) => w.why === "challenges left").length,
    },
    walls: { count: walls.length, weeks: average(walls.map((w) => w.weeks)), longest: Math.max(0, ...walls.map((w) => w.weeks)), brokeBy, sortedThenEnded },
    matters: { players: matters.length, median: matters.length ? matters[Math.floor(matters.length / 2)] : null },
    dry: median(ps.map((p) => p.weeks.find((w) => w.board === 0)?.week)),
    perksChange: perks.length ? mean(perks) : null,
    score: ps.map((p) => p.weeks.reduce((s, w) => s + w.dungeons, 0)),
  };
}
