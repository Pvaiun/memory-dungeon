/**
 * Is the campfire a choice? Plays each node's best builds (out/campaign/results.json) to the campfire, then branches the
 * run once per option on the same dice (REST, FOCUS, and REVIVE for each member down) and plays each branch out with the
 * simulations' choices. Counts, over every campfire reached: which options win, how often only one does (that option was
 * the choice that mattered), and how often the simulations' own pick lost where another would have won.
 *
 *   npx tsx src/campaign-campfire.ts [--nodes 1-20] [--seeds 8] [--only <class>] [--pack p] [--results r] [--set path=value]...
 *
 * --only keeps the builds with that class.
 */
import { readFileSync } from "node:fs";
import { campaign, simPick } from "./campaign.js";
import { combat } from "./engine/combat/rules.js";
import { advance, answer, copyRun, loadContent, newRun } from "./engine/run.js";
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

const kind = (o: string) => o.split(":")[0];
const add = (m: Map<string, number>, k: string, v = 1) => m.set(k, (m.get(k) ?? 0) + v);
const pct = (a: number, b: number) => `${Math.round((100 * a) / Math.max(1, b))}%`;
// Keyed by "down" (someone is down, so REVIVE is offered) or "up" (nobody is).
const visits = new Map<string, number>(), wins = new Map<string, number>(), only = new Map<string, number>();
const allWin = new Map<string, number>(), noneWin = new Map<string, number>(), regret = new Map<string, number>();
const picked = new Map<string, number>();
const byNode: string[] = [];

for (const i of which) {
  const node = cp.nodes[i];
  const cands = (results[node.id]?.cands ?? []).filter((p) => !opt("--only") || p.units.some((u) => u.class === opt("--only")));
  let nv = 0, nOnly = 0;
  for (const party of cands) for (const seed of seeds) {
    const run = newRun(c, combat, { dungeon: node.dungeon, party: current(c, party), seed, firstClear: true }, { checked: true });
    advance(c, combat, run);
    if (!run.pending || run.pending.kind !== "campfire") continue;
    const d = run.pending;
    const state = d.options.some((o) => o.startsWith("revive:")) ? "down" : "up";
    add(visits, state), nv++;
    const won = new Set<string>();
    for (const o of d.options) {
      const b = copyRun(run);
      answer(c, combat, b, o);
      advance(c, combat, b);
      while (b.pending) advance(c, combat, answer(c, combat, b, simPick(b.pending, b)));
      if (b.outcome === "won") won.add(kind(o));
    }
    const kinds = [...new Set(d.options.map(kind))];
    for (const k of won) add(wins, `${state}|${k}`);
    if (won.size === kinds.length) add(allWin, state);
    else if (!won.size) add(noneWin, state);
    else if (won.size === 1) add(only, `${state}|${[...won][0]}`), nOnly++;
    const mine = kind(simPick(d, run));
    add(picked, `${state}|${mine}`);
    if (won.size && !won.has(mine)) add(regret, state);
  }
  if (nv) byNode.push(`${i + 1} ${node.name}: ${nv} campfires, one option alone wins ${nOnly}`);
}

const out: string[] = [];
out.push(`# The campfire as a choice: ${[...visits.values()].reduce((a, b) => a + b, 0)} campfires reached, nodes ${which.map((i) => i + 1).join(",")}\n`);
out.push("| Party at the campfire | campfires | every option wins | none wins | REST wins | FOCUS wins | REVIVE wins | only REST | only FOCUS | only REVIVE | the sims' pick lost, another won |");
out.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
for (const st of ["up", "down"]) {
  const n = visits.get(st) ?? 0;
  if (!n) continue;
  const w = (k: string) => pct(wins.get(`${st}|${k}`) ?? 0, n), o = (k: string) => pct(only.get(`${st}|${k}`) ?? 0, n);
  out.push(`| ${st === "down" ? "someone down" : "all standing"} | ${n} | ${pct(allWin.get(st) ?? 0, n)} | ${pct(noneWin.get(st) ?? 0, n)} | ${w("rest")} | ${w("focus")} | ${st === "down" ? w("revive") : "–"} | ${o("rest")} | ${o("focus")} | ${st === "down" ? o("revive") : "–"} | ${pct(regret.get(st) ?? 0, n)} |`);
}
out.push(`\nThe simulations' picks: ${[...picked].map(([k, v]) => `${k.replace("|", ": ")} ${v}`).join(", ")}.`);
out.push(`\nBy node: ${byNode.join("; ")}.`);
console.log(out.join("\n"));
