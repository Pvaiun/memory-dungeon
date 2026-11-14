/**
 * The wall read: what a wall does to a fight's cost. The build test's formation parties on their own act's set (as its By
 * tier table plays them, from rolled starts), split into walled and unwalled, and the damage swung at them followed down to
 * HP. It measures; it doesn't balance.
 *
 * - **Walled:** a party whose most-struck unit, in its own act's regular fights, is a class built to be struck (Knight,
 *   Bramble knight, Hoplite, Paladin, Valkyrie, Geomancer) and takes at least half of the hits.
 * - **The table:** by rung and tier, walled against unwalled: regular fights and elites as mean cost (a loss 1), bosses as win
 *   rate; and Landslide's and the Toll's routes on their own, the cheapest walls.
 * - **The layers** (`--layers`): for each party in its regular fights, as shares of its max HP a fight: what was swung at it,
 *   what it dodged, what Defense cut, what Shield soaked (and how much Shield it held at the fight's start), what reached HP,
 *   what it healed, and who took the hits. Every hit's amount before and after Defense and its Shield soak are in the log.
 *
 * Knobs as they stand: after a change, set them again (`npx tsx tools/build-calibrate.ts`, `npm run content`) before
 * reading it, or the change only moves the mean. BUILD_TEST_PACK reads a variant pack.
 *
 *   npx tsx tools/wall-read.ts [--seeds 6] [--layers] [--rungs 3]
 */
import { readFileSync } from "node:fs";
import { advanceOnce, loadContent } from "../src/engine/run.js";
import { combat, type Member as EM } from "../src/engine/combat/rules.js";
import type { Entry } from "../src/engine/log.js";
import { BUILD_PARTIES } from "./build-parties.js";
import { field, fightSeed, fightSet, play, startRun } from "./build-test.js";

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const c = loadContent(JSON.parse(readFileSync(process.env.BUILD_TEST_PACK ?? "content/core-set.pack.json", "utf8")));
const SEEDS = Number(opt("--seeds") ?? 6);
const RUNGS = (opt("--rungs") ?? "1,2,3").split(",").map(Number);
const STRUCK = new Set(["knight", "bramble_knight", "hoplite", "paladin", "valkyrie", "geomancer"]);
const sets = new Map([1, 2, 3].map((a) => [a, fightSet(c, a)]));

/** One regular fight's layers, as amounts; `by` is the raw hits each class took. */
type Layers = { swung: number; dodged: number; defense: number; soaked: number; start: number; hp: number; healed: number; max: number; by: Record<string, number> };

function layersOf(log: Entry[], ms: EM[]): Layers {
  const side = new Map<string, string>(), ref = new Map<string, string>(), hp = new Map<string, number>(), raw = new Map<string, { s: number; n: number }>();
  const meet = (u: { id: string; ref?: string; name: string; side: string; hp: number }) => { side.set(u.id, u.side); ref.set(u.id, u.ref ?? u.name); hp.set(u.id, u.hp); };
  for (const u of (log.find((e) => e.t === "fight_start")?.units ?? []) as Parameters<typeof meet>[0][]) meet(u);
  const onParty = (e: Entry) => e.t === "dmg" && side.get(String(e.target)) === "party";
  // A dodged hit is sized as its attacker's mean landed hit.
  for (const e of log) if (onParty(e) && e.part === "hit" && e.word !== "MISS") {
    const r = raw.get(String(e.by)) ?? { s: 0, n: 0 };
    r.s += Number(e.raw ?? e.amount); r.n++; raw.set(String(e.by), r);
  }
  const L: Layers = { swung: 0, dodged: 0, defense: 0, soaked: 0, start: 0, hp: 0, healed: 0, max: ms.reduce((s, m) => s + m.stats.max_hp, 0), by: {} };
  for (const e of log) {
    if (e.t === "join") meet(e.unit as Parameters<typeof meet>[0]);
    if (e.t === "status" && e.status === "shield" && side.get(String(e.unit)) === "party" && Number(e.at) < 1000) L.start += Number(e.added ?? 0);
    if (e.t === "heal" && side.get(String(e.target)) === "party") L.healed += Number(e.amount);
    if (!onParty(e)) continue;
    const t = String(e.target), before = hp.get(t) ?? 0, after = Number(e.hp);
    hp.set(t, after);
    if (e.word === "MISS") { const r = raw.get(String(e.by)); if (r?.n) { L.dodged += r.s / r.n; L.swung += r.s / r.n; } continue; }
    const amount = Number(e.amount) || 0, pre = Number(e.raw ?? amount);
    L.swung += pre; L.defense += pre - amount; L.soaked += Number(e.soaked) || 0; L.hp += Math.max(0, before - after);
    if (e.part === "hit") L.by[ref.get(t)!] = (L.by[ref.get(t)!] ?? 0) + pre;
  }
  return L;
}

type Row = { id: string; build: string; rung: number; walled: boolean; struck: string; share: number; normal: number; elite: number; boss: number; layers: Layers };
const rows: Row[] = [];
for (const p of BUILD_PARTIES.filter((x) => x.version === "formation" && RUNGS.includes(x.rung))) {
  const party = field(c, p);
  const acc = { normal: [] as number[], elite: [] as number[], bosses: [] as number[] };
  const sum: Layers = { swung: 0, dodged: 0, defense: 0, soaked: 0, start: 0, hp: 0, healed: 0, max: 0, by: {} };
  let n = 0;
  for (const f of sets.get(p.rung)!) for (let i = 0; i < SEEDS; i++) {
    const seed = fightSeed(f.key, i);
    if (f.pool !== "normal") { const r = play(c, party, f, seed, false); acc[f.pool as "elite" | "bosses"].push(f.pool === "bosses" ? (r.won ? 1 : 0) : r.cost); continue; }
    // A regular fight is played with its log, for the layers; its cost as the build test counts it.
    const r = play(c, party, f, seed, false);
    acc.normal.push(r.cost);
    const er = startRun(c, party, f, seed, true);
    while (!er.outcome) advanceOnce(c, combat, er);
    const L = layersOf(er.log as Entry[], er.party as EM[]);
    for (const k of ["swung", "dodged", "defense", "soaked", "start", "hp", "healed"] as const) sum[k] += L[k] / L.max;
    for (const [k, v] of Object.entries(L.by)) sum.by[k] = (sum.by[k] ?? 0) + v;
    n++;
  }
  for (const k of ["swung", "dodged", "defense", "soaked", "start", "hp", "healed"] as const) sum[k] /= n;
  const total = Object.values(sum.by).reduce((s, x) => s + x, 0);
  const [struck, hits] = Object.entries(sum.by).sort((a, b) => b[1] - a[1])[0] ?? ["-", 0];
  const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / Math.max(1, xs.length);
  rows.push({ id: p.id, build: p.build, rung: p.rung, struck, share: hits / Math.max(1, total), walled: STRUCK.has(struck) && hits / Math.max(1, total) >= 0.5, normal: mean(acc.normal), elite: mean(acc.elite), boss: mean(acc.bosses), layers: sum });
}

const pc = (x: number) => (Number.isFinite(x) ? String(Math.round(100 * x)) : "-");
const avg = (rs: Row[], k: "normal" | "elite" | "boss") => rs.reduce((s, r) => s + r[k], 0) / Math.max(1, rs.length);
const L: string[] = ["Walled / unwalled: regular fights and elites as mean cost (a loss 1), bosses as win rate. Landslide and the Toll's routes on their own.", "", "| Rung | Walled | Regular | Elite | Boss | Landslide and the Toll: regular, elite, boss |", "| --- | --- | --- | --- | --- | --- |"];
for (const rung of RUNGS) {
  const R = rows.filter((r) => r.rung === rung), W = R.filter((r) => r.walled), U = R.filter((r) => !r.walled), LT = R.filter((r) => r.build === "landslide" || r.build === "toll");
  L.push(`| ${rung} | ${W.length} of ${R.length} | ${pc(avg(W, "normal"))} / ${pc(avg(U, "normal"))} | ${pc(avg(W, "elite"))} / ${pc(avg(U, "elite"))} | ${pc(avg(W, "boss"))} / ${pc(avg(U, "boss"))} | ${pc(avg(LT, "normal"))}, ${pc(avg(LT, "elite"))}, ${pc(avg(LT, "boss"))} |`);
}
if (args.includes("--layers")) {
  L.push("", "Regular fights, shares of the party's max HP a fight: swung at it, dodged, cut by Defense, soaked by Shield (Shield held at the start), reached HP, healed; the most-struck class and its share of the hits; cost.", "");
  for (const r of rows) {
    const x = r.layers;
    L.push(`${r.walled ? "W" : " "} ${r.id.padEnd(42)} swung ${pc(x.swung).padStart(3)} dodged ${pc(x.dodged).padStart(2)} Defense ${pc(x.defense).padStart(3)} Shield ${pc(x.soaked).padStart(2)} (start ${pc(x.start).padStart(2)}) HP ${pc(x.hp).padStart(2)} healed ${pc(x.healed).padStart(3)} | ${r.struck} ${pc(r.share)} | cost ${pc(r.normal)}`);
  }
}
console.log(L.join("\n"));
