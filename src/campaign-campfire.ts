/**
 * The campfire's three choices, weighed by playing each (step 5c): every run of each node's best builds that reaches the
 * campfire is copied at it and finished once per option (REST, FOCUS, each RAISE), on the same dice. A choice is useful
 * when it's the one that wins: the share of visits each option wins where the others don't is what this measures, with
 * how often the simulations' picker (simPick) chose a winning option.
 *
 *   npx tsx src/campaign-campfire.ts [--nodes 1-20] [--seeds 8] [--set path=value]...
 */
import { readFileSync } from "node:fs";
import { campaign, simPick } from "./campaign.js";
import { combat } from "./engine/combat/rules.js";
import { advance, answer, copyRun, loadContent, newRun, type Run } from "./engine/run.js";
import type { Party } from "./schema.js";
import { patch } from "./sim/content.js";
import { current } from "./sim/kits.js";

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const sets = args.flatMap((a, i) => (a === "--set" ? [args[i + 1]] : [])).map((x) => ({ path: x.slice(0, x.indexOf("=")), set: JSON.parse(x.slice(x.indexOf("=") + 1)) }));
const c = loadContent(patch(JSON.parse(readFileSync(opt("--pack") ?? "content/core-set.pack.json", "utf8")), sets));
const results = JSON.parse(readFileSync(opt("--results") ?? "out/campaign/results.json", "utf8")) as Record<string, { cands: Party[] }>;
const seeds = Array.from({ length: Number(opt("--seeds") ?? 8) }, (_, i) => 7001 + i);
const cp = campaign(c);
const which = (() => {
  const spec = opt("--nodes");
  if (!spec) return cp.nodes.map((_, i) => i);
  return spec.split(",").flatMap((p) => {
    const [a, b] = p.split("-").map(Number);
    return Array.from({ length: (b || a) - a + 1 }, (_, k) => a - 1 + k);
  });
})();

type M = { id: string; ref: string; hp: number; mp: number; stats: Record<string, number> };
const kind = (o: string) => o.split(":")[0];
const finish = (run: Run, pick: string) => {
  const r = copyRun(run);
  answer(c, combat, r, pick);
  advance(c, combat, r);
  while (r.pending) advance(c, combat, answer(c, combat, r, simPick(r.pending, r)));
  return { won: r.outcome === "won", stage: r.stage };
};

let visits = 0, withDown = 0;
const only = new Map<string, number>(); // visits this kind alone wins
const wins = new Map<string, number>(); // visits this kind wins (best raise for raise)
const offered = new Map<string, number>();
let allWin = 0, noneWin = 0, simRight = 0, simWins = 0, bestWins = 0;
const simChose = new Map<string, number>();
// What the party looked like when each kind alone won: mean HP share and MP share standing, and members down.
const shape = new Map<string, { n: number; hp: number; mp: number; down: number }>();
const perNode: string[] = [];

for (const i of which) {
  const node = cp.nodes[i];
  const r = results[node.id];
  if (!r) continue;
  let nv = 0;
  const nOnly = new Map<string, number>();
  for (const party of r.cands) for (const seed of seeds) {
    const run = newRun(c, combat, { dungeon: node.dungeon, party: current(c, party), seed, firstClear: true }, { checked: true });
    advance(c, combat, run);
    if (!run.pending || run.pending.kind !== "campfire") continue;
    visits++, nv++;
    const d = run.pending;
    const outs = new Map(d.options.map((o) => [o, finish(run, o)]));
    const byKind = new Map<string, boolean>();
    for (const [o, x] of outs) byKind.set(kind(o), (byKind.get(kind(o)) ?? false) || x.won);
    for (const k of byKind.keys()) add(offered, k);
    if (byKind.has("raise")) withDown++;
    for (const [k, w] of byKind) if (w) add(wins, k);
    const winners = [...byKind].filter(([, w]) => w).map(([k]) => k);
    if (winners.length === byKind.size) allWin++;
    if (!winners.length) noneWin++;
    const m = run.party as unknown as M[];
    const up = m.filter((x) => x.hp > 0);
    if (winners.length === 1) {
      add(only, winners[0]);
      add(nOnly, winners[0]);
      const s = shape.get(winners[0]) ?? { n: 0, hp: 0, mp: 0, down: 0 };
      s.n++;
      s.hp += up.reduce((a, x) => a + x.hp / x.stats.max_hp, 0) / Math.max(1, up.length);
      s.mp += up.reduce((a, x) => a + (x.stats.max_mp ? x.mp / x.stats.max_mp : 1), 0) / Math.max(1, up.length);
      s.down += m.length - up.length;
      shape.set(winners[0], s);
    }
    const sp = simPick(d, run);
    add(simChose, kind(sp));
    if (outs.get(sp)!.won) simWins++;
    if (winners.length) bestWins++;
    if (outs.get(sp)!.won || !winners.length) simRight++;
  }
  if (nv) perNode.push(`${i + 1} ${node.name}: ${nv} visits; alone wins: ${[...nOnly].map(([k, v]) => `${k} ${v}`).join(", ") || "none"}`);
}

function add(m: Map<string, number>, k: string, v = 1) {
  m.set(k, (m.get(k) ?? 0) + v);
}
const pct = (a: number, b: number) => `${Math.round((100 * a) / Math.max(1, b))}%`;
const out: string[] = [];
out.push(`# The campfire: ${visits} visits (${withDown} with someone down), nodes ${which.map((i) => i + 1).join(",")}\n`);
out.push(`Every option wins: ${pct(allWin, visits)}. None wins: ${pct(noneWin, visits)}. The rest is where the choice matters.\n`);
out.push("| Option | offered | wins when taken | the only winner |\n| --- | --- | --- | --- |");
for (const k of ["rest", "focus", "raise"]) out.push(`| ${k} | ${offered.get(k) ?? 0} | ${pct(wins.get(k) ?? 0, offered.get(k) ?? 0)} | ${only.get(k) ?? 0} (${pct(only.get(k) ?? 0, visits)} of visits) |`);
out.push(`\nWhen one option alone wins, the party standing at the fire (HP share, MP share, members down):`);
for (const [k, s] of shape) out.push(`- ${k}: ${pct(s.hp, s.n)} HP, ${pct(s.mp, s.n)} MP, ${(s.down / s.n).toFixed(2)} down (${s.n} visits)`);
out.push(`\nThe simulations' picker chose ${[...simChose].map(([k, v]) => `${k} ${v}`).join(", ")}: it won ${simWins} of the ${bestWins} visits some option wins, and picked a winning option (or nothing could win) in ${pct(simRight, visits)}.`);
out.push("\nBy node:");
out.push(...perNode.map((x) => `- ${x}`));
console.log(out.join("\n"));
