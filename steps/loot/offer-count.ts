/**
 * The loot pass's offer count: how many pieces and formations a run is offered in each act, by rarity and by who the offer is
 * rolled for, counted over runs of the simulated player at the content as it stands. Scratch, like the rest of this folder.
 *
 *   npx tsx steps/loot/offer-count.ts [--runs 40]
 *
 * Its output is pasted into `web-check.ts` (`RUN`), which works out from it how often a run is offered a road's first step or
 * an engine's keystone. Only acts a run played through are counted, so a run that dies mid-act doesn't thin the averages. The
 * simulated player's path and roster differ from a person's: read the result as a run's rough shape.
 */
import { readFileSync } from "node:fs";
import { loadContent } from "../../src/engine/run.js";
import { autoFight, choose, newRogue, type RogueRun } from "../../src/rogue.js";
import { aiPlayer } from "../../src/sim/rogue-ai.js";

const runsArg = process.argv.indexOf("--runs");
const RUNS = runsArg > 0 ? Number(process.argv[runsArg + 1]) : 40;
const c = loadContent(JSON.parse(readFileSync("content/core-set.pack.json", "utf8")));
type Pool = "open" | "party" | "roster";
type Tally = { gear: Record<string, number>; formations: Record<string, number>; roster: number; rosterN: number; fights: number; elites: number; shops: number; chests: number };
const blank = (): Tally => ({ gear: {}, formations: {}, roster: 0, rosterN: 0, fights: 0, elites: 0, shops: 0, chests: 0 });
const total = [blank(), blank(), blank()];
const done = [0, 0, 0];
const add = (o: Record<string, number>, k: string, n = 1) => (o[k] = (o[k] ?? 0) + n);
const formationRarity = (id: string) => c.formations.get(id)?.rarity ?? "common";

for (let seed = 1; seed <= RUNS; seed++) {
  const run: RogueRun = newRogue(c, { seed, leader: ["knight", "cleric", "ranger"][seed % 3], heat: 0 });
  const ai = aiPlayer({}, seed);
  const mine = [blank(), blank(), blank()];
  const seen = new Set<string>();
  for (let i = 0; i < 3000 && run.pending.kind !== "over"; i++) {
    ai.prepare(c, run);
    const p = run.pending, t = mine[run.act - 1];
    const gear = (item: { base: string; rarity: string }, pool: Pool) => add(t.gear, `${item.rarity}|${pool}`);
    if (p.kind === "fight") {
      if (p.tier === "fight") t.fights++;
      if (p.tier === "elite") t.elites++;
      t.roster += run.roster.length; t.rosterN++;
      autoFight(c, run);
      continue;
    }
    // Each set of offers is counted once, when it's first in front of the player.
    const sig = (offers: { kind: string }[]) => offers.map((o) => (o.kind === "gear" || o.kind === "bundle" ? (o as unknown as { item: { uid: string } }).item.uid : o.kind === "formation" ? (o as unknown as { id: string }).id : o.kind)).join(",");
    if (p.kind === "spoils" || p.kind === "boon" || p.kind === "trophy" || p.kind === "drill") {
      const key = `${run.act}:${run.floor}:${p.kind}:${sig(p.offers)}`;
      if (!seen.has(key)) {
        seen.add(key);
        p.offers.forEach((o, k) => {
          if (o.kind === "gear" || o.kind === "bundle") gear(o.item, p.kind === "boon" ? "roster" : p.kind === "spoils" && p.tier === "elite" && k === 0 ? "party" : "open");
          if (o.kind === "formation") add(t.formations, formationRarity(o.id));
        });
      }
    } else if (p.kind === "shop") {
      const key = `${run.act}:${run.floor}:shop`;
      if (!seen.has(key)) {
        seen.add(key); t.shops++;
        for (const s of p.stock) { if (s.offer.kind === "gear") gear(s.offer.item, "roster"); if (s.offer.kind === "formation") add(t.formations, formationRarity(s.offer.id)); }
      }
    } else if (p.kind === "treasure") {
      const key = `${run.act}:${run.floor}:treasure`;
      if (!seen.has(key)) { seen.add(key); t.chests++; if (p.offer.kind === "gear") gear(p.offer.item, "open"); }
    }
    const actBefore = run.act;
    choose(c, run, ai.decide(c, run));
    if (run.act !== actBefore) seen.clear();
  }
  const won = run.pending.kind === "over" && run.pending.won;
  for (let a = 0; a < 3; a++) {
    if (!(run.act > a + 1 || won)) continue; // this act wasn't played through
    done[a]++;
    for (const k of ["gear", "formations"] as const) for (const [key, n] of Object.entries(mine[a][k])) add(total[a][k], key, n);
    for (const k of ["roster", "rosterN", "fights", "elites", "shops", "chests"] as const) total[a][k] += mine[a][k];
  }
}
const per = (n: number, a: number) => Math.round((n / done[a]) * 100) / 100;
const out = total.map((t, a) => ({
  act: a + 1, runsThrough: done[a], fights: per(t.fights, a), elites: per(t.elites, a), shops: per(t.shops, a), chests: per(t.chests, a), roster: Math.round((t.roster / Math.max(1, t.rosterN)) * 10) / 10,
  gear: Object.fromEntries(Object.entries(t.gear).sort().map(([k, n]) => [k, per(n, a)])),
  pieces: per(Object.values(t.gear).reduce((x, y) => x + y, 0), a),
  formations: Object.fromEntries(Object.entries(t.formations).sort().map(([k, n]) => [k, per(n, a)])),
}));
console.log(JSON.stringify(out, null, 1));
