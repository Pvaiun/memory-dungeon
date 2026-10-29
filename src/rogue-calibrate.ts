/**
 * The rogue mode's calibration: every fight in every region's pools, measured against real parties and given its own
 * knob, so that an act's fights cost about what their tier should and its bosses kill about as often as they should.
 *
 * 1. Snapshots: the simulated player plays runs at the current numbers; the party before each fight is kept, by act
 *    and by the floors each pool is met on (easy: 1–2, normal: 3–8, elite: 4–8, boss: the boss).
 * 2. For each fight: its knob is bisected until a regular fight or an elite, against those parties with their HP made
 *    whole (their MP as it was), costs its target share of the party's HP (net of healing, a fallen member counting as all
 *    of theirs), and a boss, against parties as they arrived, wins its target share of fights. The same parties and dice at every knob, so the curve is smooth.
 * 3. The knobs go to content/core-set/rogue-knobs.json; `npm run content` puts them in the pack.
 *
 * Step 5h (the director's): by default the parties are the hand-built rosters of src/rogue-parties.ts at each act's and
 * tier's power level, not the simulated player's snapshots (`--snapshots` brings those back). Each roster fields a good
 * three of five for each fight (the trio a quarter down the ranking, `--pick`), chosen on other dice at the fight's knob, as a
 * player uses the bench against a preview;
 * the knob is set against those trios, then the trios are chosen again at the new knob and the knob refined.
 *
 *   npm run rogue:calibrate [-- --reps 3 --pick 0.25 --only crypt --tiers boss --fights a,b | --snapshots --runs 200 --per 48]
 *
 * Bundled by esbuild like the other tuners, so worker threads can load it.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { loadContent, type Content } from "./engine/run.js";
import { autoFight, foesFor, newRogue, rogue, type RogueRun } from "./rogue.js";
import { aiPlayer, hpShare } from "./rogue-ai.js";
import { LEVELS, PICK, ROSTERS, buildRoster, trios, type Roster } from "./rogue-parties.js";
import { choose } from "./rogue.js";
import type { RogueFightT } from "./schema.js";

/** What each tier should cost, by act: a regular fight or elite, in points of party HP %; a boss, the share of fights it wins. */
export const TARGETS = {
  // Step 5g round 9 (the director's: "weak monsters basically just don't do anything", and potions and tonics are the run's sustain now): a
  // regular fight costs a few points more than before (easy 10 / 11 / 12, normal 15 / 16 / 17, elite 22 / 23 / 24), at the shape's fuller damage.
  // Step 5h round 6 (the director's: act III "brain dead easy when I played it"; "I would boost it a little bit"): act III's targets a
  // step up (were 14, 20, 27 and 45), on top of its rosters carrying the reward plan's legendaries.
  easy: [12, 13, 16],
  normal: [18, 19, 23],
  elite: [25, 26, 30],
  /**
   * A boss's wins against parties as they arrive, in percent. Raised from 12, 20 and 25 at the director's word (Oct 26): a
   * first win should be an achievement, about 20% of the simulated player's runs at heat 0, with the extra on the bosses.
   */
  boss: [22, 35, 52],
};
type Tier = keyof typeof TARGETS;

type Snap = { run: RogueRun; act: number; floor: number; tier: string; roster?: Roster; ptier?: Tier; roster4?: boolean };

/**
 * Step 5h: the hand-built rosters, at every act's and tier's power level; each `reps` times (each copy on its own dice). Round 6:
 * a level of random starts (`random`) builds each copy with its own roll of abilities; `climb` puts act I's early level (a party a
 * few rooms in) in the regular fights' place.
 */
function partySnaps(c: Content, reps: number, climb = false): Snap[] {
  const out: Snap[] = [];
  for (const act of [1, 2, 3]) for (const ptier of ["easy", "normal", "elite", "boss"] as Tier[]) {
    const level = climb && act === 1 && ptier === "normal" ? "early" : ptier;
    const lv = level === "early" ? LEVELS[act].early! : LEVELS[act][ptier];
    for (const roster of ROSTERS) {
      const base = buildRoster(c, roster, act, level);
      for (let i = 0; i < reps; i++) out.push({ run: lv.random ? buildRoster(c, roster, act, level, i) : structuredClone(base), act, floor: ptier === "easy" ? 1 : 5, tier: ptier === "boss" ? "boss" : ptier === "elite" ? "elite" : "fight", roster, ptier, ...(level === "early" ? { roster4: true } : {}) });
    }
  }
  return out;
}

/** Plays runs and keeps the party before each fight. */
function snapshots(c: Content, runs: number): Snap[] {
  const out: Snap[] = [];
  for (let seed = 1; seed <= runs; seed++) {
    const run = newRogue(c, { seed: 90000 + seed, leader: ["knight", "cleric", "ranger"][seed % 3] });
    const ai = aiPlayer({}, seed);
    for (let i = 0; i < 3000 && run.pending.kind !== "over"; i++) {
      ai.prepare(c, run);
      const p = run.pending;
      if (p.kind === "fight") {
        out.push({ run: structuredClone(run), act: run.act, floor: run.floor, tier: p.tier });
        autoFight(c, run);
      } else choose(c, run, ai.decide(c, run));
    }
  }
  return out;
}

/** The parties a pool is measured against: its act, its floors. */
function poolSnaps(snaps: Snap[], act: number, tier: Tier, per: number): Snap[] {
  if (snaps.some((s) => s.ptier)) return snaps.filter((s) => s.act === act && s.ptier === tier);
  const fit = snaps.filter((s) => s.act === act && (tier === "easy" ? s.floor <= 3 : tier === "normal" ? s.floor >= 4 && s.floor <= 12 : tier === "elite" ? s.floor >= 5 && s.floor <= 12 : s.tier === "boss"));
  // Spread the sample over the whole list, so every kind of run is in it.
  const step = Math.max(1, fit.length / per);
  return Array.from({ length: Math.min(per, fit.length) }, (_, i) => fit[Math.floor(i * step)]);
}

/** One fight against one party made whole, at a knob: the HP share it costs (1 when lost), and whether it was lost. */
function trial(c: Content, s: Snap, fight: RogueFightT, k: number, tier: Tier, i: number): { cost: number; lost: boolean } {
  const run = structuredClone(s.run);
  // A regular fight or an elite meets the party whole but with its mana as it is (MP is the casters' attrition); a boss
  // meets it exactly as it arrived.
  if (tier !== "boss") for (const m of run.roster) (m.missHp = 0), (m.ko = false);
  const t = tier === "boss" ? "boss" : tier === "elite" ? "elite" : "fight";
  run.pending = { kind: "fight", node: "calibrate", tier: t, fight: { ...fight, knob: undefined }, foes: foesFor(c, t, k), seed: 7919 * (i + 1) + 13 };
  autoFight(c, run);
  const after = run.pending as RogueRun["pending"];
  const lost = after.kind === "over" && !after.won;
  return { cost: lost ? 1 : 1 - hpShare(c, run), lost };
}

type Task = { region: string; act: number; tier: Tier; fight: RogueFightT; pick: number };
type Result = { key: string; knob: number; cost: number; lost: number };

/**
 * Step 5h: each roster fields a good three of five (PICK) for this fight at knob `k`, tried on other dice (two fights a trio),
 * seated in the roster's preference order.
 */
/** Each roster's three for a fight, tried on two throws of other dice: the one PICK of the way down the ranking (src/rogue-parties.ts). */
function pickTrios(c: Content, snaps: Snap[], fight: RogueFightT, k: number, tier: Tier, pick: number) {
  snaps.forEach((s, i) => {
    if (!s.roster) return;
    const ranked = trios(s.roster, (s.roster4 ? 4 : s.ptier && LEVELS[s.act][s.ptier].roster) || 5).map((trio) => {
      s.run.party = trio;
      return { trio, cost: [0, 1].reduce((t, j) => t + trial(c, s, fight, k, tier, 1000 + i * 7 + j).cost, 0) };
    }).sort((a, b) => a.cost - b.cost);
    s.run.party = ranked[Math.round((ranked.length - 1) * pick)].trio;
  });
}

function calibrate(c: Content, snaps: Snap[], t: Task): Result {
  const target = TARGETS[t.tier][t.act - 1];
  const rosters = snaps.some((s) => s.roster);
  if (rosters) pickTrios(c, snaps, t.fight, t.fight.knob ?? 0, t.tier, t.pick);
  const measure = (k: number) => {
    let cost = 0, lost = 0;
    snaps.forEach((s, i) => { const x = trial(c, s, t.fight, k, t.tier, i); cost += x.cost; lost += x.lost ? 1 : 0; });
    return { cost: (100 * cost) / snaps.length, lost: (100 * lost) / snaps.length };
  };
  const score = (m: { cost: number; lost: number }) => (t.tier === "boss" ? m.lost : m.cost);
  const bisect = (lo: number, hi: number, start: { k: number; m: { cost: number; lost: number } }) => {
    let best = start;
    for (let i = 0; i < 8; i++) {
      const k = Math.round((lo + hi) / 2);
      const m = measure(k);
      if (Math.abs(score(m) - target) < Math.abs(score(best.m) - target)) best = { k, m };
      if (score(m) < target) lo = k;
      else hi = k;
      if (hi - lo <= 4) break;
    }
    return best;
  };
  let best = bisect(-85, 400, { k: 0, m: measure(0) });
  // With rosters, the trios are chosen again at the new knob (a fight much harder or softer can call for other members).
  if (rosters) {
    pickTrios(c, snaps, t.fight, best.k, t.tier, t.pick);
    best = bisect(best.k - 40, best.k + 40, { k: best.k, m: measure(best.k) });
  }
  return { key: `${t.region}/${t.tier === "boss" ? "bosses" : t.tier}/${t.fight.id}`, knob: best.k, cost: Math.round(best.m.cost), lost: Math.round(best.m.lost) };
}

// ─── Main ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const KNOBS = "content/core-set/rogue-knobs.json";

async function main() {
  const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));
  const c = loadContent(raw);
  const t0 = Date.now();
  // Round 6, `--climb`: act I's regular fights calibrated against a party a few rooms in (the early level) and compared with their
  // knobs, to set act I's climb below the reference floor (`knobs[0].early`). Nothing is written.
  const climb = args.includes("--climb");
  const snaps = args.includes("--snapshots") ? snapshots(c, Number(opt("--runs") ?? 200)) : partySnaps(c, Number(opt("--reps") ?? 3), climb);
  const per = Number(opt("--per") ?? 48);
  console.log(`${snaps.length} snapshots (${((Date.now() - t0) / 1000).toFixed(0)} s); by act ${[1, 2, 3].map((a) => snaps.filter((s) => s.act === a).length).join("/")}`);
  const only = opt("--only");
  const tasks: Task[] = [];
  for (const reg of rogue(c).regions) {
    if (only && !only.split(",").includes(reg.id)) continue;
    const tiers = (opt("--tiers") ?? "easy,normal,elite,boss").split(",") as Tier[];
    const fights = opt("--fights")?.split(",");
    for (const tier of tiers)
      for (const fight of reg[tier === "boss" ? "bosses" : tier]) if (!fights || fights.includes(fight.id)) tasks.push({ region: reg.id, act: reg.act, tier, fight, pick: Number(opt("--pick") ?? PICK) });
  }
  const n = Number(opt("--workers") ?? availableParallelism());
  const results: Result[] = [];
  const workers = Array.from({ length: n }, () => new Worker(new URL(import.meta.url), { workerData: { raw } }));
  let next = 0;
  await Promise.all(workers.map((w) => new Promise<void>((done) => {
    const feed = () => {
      if (next >= tasks.length) return void (w.terminate(), done());
      const t = tasks[next++];
      w.postMessage({ task: t, snaps: poolSnaps(snaps, t.act, t.tier, per).map((s) => ({ ...s, run: s.run })) });
    };
    w.on("message", (r: Result) => { results.push(r); console.log(`${r.key.padEnd(36)} knob ${String(r.knob).padStart(4)}  cost ${r.cost}%  lost ${r.lost}%`); feed(); });
    w.on("error", (e) => { throw e; });
    feed();
  })));
  const knobs = JSON.parse(readFileSync(KNOBS, "utf8")) as Record<string, number>;
  if (climb) {
    const ref = rogue(c).config.map.ref?.normal ?? 5, first = (rogue(c).config.map.easyTo ?? 2) + 1;
    const d = results.filter((r) => r.key.includes("/normal/") && !Number.isNaN(r.cost)).map((r) => r.knob - (knobs[r.key] ?? 0)).sort((a, b) => a - b);
    const med = d[Math.floor(d.length / 2)];
    console.log(`climb: act I's regular fights against a party a few rooms in need their knobs ${d.join(", ")} (median ${med}); knobs[0].early = ${(-med / (ref - first)).toFixed(1)} a floor (floor ${first} is ${ref - first} below the reference). Nothing written.`);
    return;
  }
  // A pool no sampled run reached (act 3 on a hard build) keeps its knob rather than taking 0.
  const unmeasured = results.filter((r) => Number.isNaN(r.cost));
  if (unmeasured.length) console.log(`${unmeasured.length} fights had no parties to measure against and keep their knobs: ${unmeasured.map((r) => r.key).join(", ")}`);
  for (const r of results) if (!Number.isNaN(r.cost)) knobs[r.key] = r.knob;
  writeFileSync(KNOBS, JSON.stringify(Object.fromEntries(Object.entries(knobs).sort()), null, 1) + "\n");
  console.log(`${results.length} fights calibrated in ${((Date.now() - t0) / 1000).toFixed(0)} s; written to ${KNOBS}. Run npm run content.`);
}

if (isMainThread) void main();
else {
  const c = loadContent((workerData as { raw: unknown }).raw);
  parentPort!.on("message", (m: { task: Task; snaps: Snap[] }) => parentPort!.postMessage(calibrate(c, m.snaps, m.task)));
}
