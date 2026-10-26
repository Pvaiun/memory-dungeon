/**
 * What each legendary piece's rule is worth: whole runs with that piece (without affixes) handed over at the start and
 * kept on the party member it suits best all run, against the same seeds with nothing handed over. Counted only on the
 * seeds where someone in the final party wore it (a staff with no staff-user can't be judged). Prints, per piece, the
 * change in win rate on those seeds and how often it could be worn.
 *
 *   npm run rogue:legendaries -- [--runs 1000] [--only id,id]
 */
import { readFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { isMainThread } from "node:worker_threads";
import { loadContent } from "./engine/run.js";
import { rogue } from "./rogue.js";
import { many, Pool } from "./rogue-sim.js";

async function main() {
  const args = process.argv.slice(2);
  const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
  const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));
  const c = loadContent(raw);
  const runs = Number(opt("--runs") ?? 1000);
  const leaders = ["knight", "cleric", "ranger"];
  const ids = opt("--only")?.split(",") ?? rogue(c).legendaries;
  const pool = new Pool(raw, Number(opt("--workers") ?? availableParallelism()));
  const base = await many(pool, runs, { leaders });
  console.log(`${runs} runs a piece, the same seeds; nothing handed over: ${Math.round((100 * base.filter((r) => r.won).length) / runs)}% won.`);
  const rows: [string, number, number][] = [];
  const won0 = new Map(base.map((r) => [r.seed, r.won]));
  for (const id of ids) {
    const recs = await many(pool, runs, { leaders, gift: { [`piece:${id}`]: 1 }, dials: { lock: id } });
    const used = recs.filter((r) => r.worn.includes(id));
    const d = used.length ? (used.filter((r) => r.won).length - used.filter((r) => won0.get(r.seed)).length) / used.length : 0;
    rows.push([id, d, used.length / runs]);
    console.log(`${id.padEnd(18)} ${(d >= 0 ? "+" : "") + Math.round(d * 1000) / 10} points on the ${used.length} runs it was worn (${Math.round((100 * used.length) / runs)}%)`);
  }
  rows.sort((a, b) => b[1] - a[1]);
  console.log("\nBy value:", rows.map(([id, d]) => `${id} ${(d >= 0 ? "+" : "") + Math.round(d * 1000) / 10}`).join(", "));
  pool.close();
  process.exit(0);
}
if (isMainThread) void main();
