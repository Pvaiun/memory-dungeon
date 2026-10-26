/**
 * How bosses fight in rogue runs, read from their logs: the simulated player plays whole runs, and each boss fight is
 * logged. Per boss: fights, wins, length, and per fight its abilities cast, the casts Silence cost it (interrupts) and
 * the stuns that held a wind-up. The question it answers: are bosses locked out of their big moves (AI playtests,
 * rounds 16 and 24)?
 *
 *   npx tsx src/rogue-bosses.ts [--runs 300] [--set path=json ...] [--dials k=v,...]
 */
import { readFileSync } from "node:fs";
import { advanceOnce, loadContent } from "./engine/run.js";
import { combat } from "./engine/combat/rules.js";
import type { Entry } from "./engine/log.js";
import { bossLeft, choose, endFight, newRogue, startFight } from "./rogue.js";
import { aiPlayer } from "./rogue-ai.js";
import { parseDials, parsePatches } from "./rogue-sim.js";
import { patch } from "./sim/content.js";

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const all = (k: string) => args.flatMap((a, i) => (a === k ? [args[i + 1]] : []));
const raw = patch(JSON.parse(readFileSync("content/core-set.pack.json", "utf8")), parsePatches(all("--set")));
const c = loadContent(raw);
const runs = Number(opt("--runs") ?? 300);
const leaders = ["knight", "cleric", "ranger"];

type B = { fights: number; won: number; ticks: number; casts: Map<string, number>; lost: Map<string, number>; held: number; locked: number };
const by = new Map<string, B>();
for (let seed = 1; seed <= runs; seed++) {
  const run = newRogue(c, { seed: 7000 + seed, leader: leaders[seed % 3], heat: 0 });
  const ai = aiPlayer(parseDials(opt("--dials")), 7000 + seed);
  for (let i = 0; i < 3000 && run.pending.kind !== "over"; i++) {
    ai.prepare(c, run);
    const p = run.pending;
    if (p.kind !== "fight") { choose(c, run, ai.decide(c, run)); continue; }
    const boss = p.tier === "boss";
    const er = startFight(c, run, { log: boss });
    let left: number | undefined;
    for (let k = 0; k < 1e6 && !er.outcome && !er.pending; k++) { if (er.fight?.result) left = bossLeft(c, er); advanceOnce(c, combat, er); }
    if (boss) read(p.fight.id, er.log ?? [], er.outcome === "won");
    endFight(c, run, er, left);
  }
}

function read(id: string, log: Entry[], won: boolean) {
  const b = by.get(id) ?? { fights: 0, won: 0, ticks: 0, casts: new Map(), lost: new Map(), held: 0, locked: 0 };
  by.set(id, b);
  b.fights++;
  if (won) b.won++;
  const start = log.find((e) => e.t === "fight_start");
  const bossIds = new Set(((start?.units ?? []) as { id: string; ref?: string; side: string }[]).filter((u) => u.side === "enemy" && c.enemies.get(String(u.ref ?? ""))?.rank === "boss").map((u) => u.id));
  // Without refs in the log, the first enemy is the boss (every rogue boss fight lists its boss first).
  if (!bossIds.size) { const first = ((start?.units ?? []) as { id: string; side: string }[]).find((u) => u.side === "enemy"); if (first) bossIds.add(first.id); }
  let casts = 0;
  for (const e of log) {
    if (e.t === "act" && bossIds.has(String(e.by)) && e.act !== "basic") (b.casts.set(String(e.name), (b.casts.get(String(e.name)) ?? 0) + 1), casts++);
    else if (e.t === "interrupt" && bossIds.has(String(e.unit))) b.lost.set(String(e.name), (b.lost.get(String(e.name)) ?? 0) + 1);
    else if (e.t === "hold" && bossIds.has(String(e.unit))) b.held++;
    else if (e.t === "fight_end") b.ticks += Number(e.rounds);
  }
  if (casts === 0) b.locked++;
}

const per = (n: number, b: B) => (n / b.fights).toFixed(2);
console.log(`${runs} runs. Per boss fight: abilities cast (and casts lost to Silence), stun holds, fights with no ability cast at all.`);
for (const [id, b] of [...by].sort((x, y) => y[1].fights - x[1].fights)) {
  const acts = [...b.casts].map(([n, v]) => `${n} ${per(v, b)}${b.lost.get(n) ? ` (lost ${per(b.lost.get(n)!, b)})` : ""}`).join(", ");
  const lostOnly = [...b.lost].filter(([n]) => !b.casts.has(n)).map(([n, v]) => `${n} 0 (lost ${per(v, b)})`).join(", ");
  console.log(`${id.padEnd(16)} ${String(b.fights).padStart(4)} fights, won ${Math.round((100 * b.won) / b.fights)}%, ${Math.round(b.ticks / b.fights)} ticks. ${[acts, lostOnly].filter(Boolean).join(", ")}. Holds ${per(b.held, b)}. No cast ${Math.round((100 * b.locked) / b.fights)}%.`);
}
