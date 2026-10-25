/**
 * Why builds win, from the logs: plays each node's best builds (out/campaign/results.json) under the shipped rules
 * and any variants, and counts what the totals hide.
 *
 *   npx tsx src/campaign-probe.ts [--nodes 1-20] [--seeds 16] [--only knight] [--variant "name:path=value;path=value"] ...
 *
 * A variant's "first=<ability>" moves that ability to the front of every member's order that has it (the playtesters
 * put the Knight's Shield bash first; the simulation's kits keep the documents' order). --only keeps the builds
 * with that class. "gear=<class>:<slot>:<gear>" puts that piece on that class in every build (Prayer beads on the
 * Knight, as the playtesters wore them), ignoring whether it's owned yet.
 *
 * Per variant: the same builds' wins, node by node (the knobs as shipped, so a variant's effect shows as wins).
 * For the shipped rules: the bosses' big moves (wind-ups of 4 ticks or more) started, interrupted and landed, and
 * what interrupted them; each class's abilities cast per 10 ticks and MP at each fight's start, by fight (a unit
 * doesn't start an ability it can't pay for, so running dry shows as fewer casts); and healing by source.
 */
import { readFileSync } from "node:fs";
import { campaign } from "./campaign.js";
import { combat } from "./engine/combat/rules.js";
import type { Entry } from "./engine/log.js";
import { firstOption, loadContent, play, type Content } from "./engine/run.js";
import type { Party } from "./schema.js";
import { patch } from "./sim/content.js";

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));
const results = JSON.parse(readFileSync("out/campaign/results.json", "utf8")) as Record<string, { n: number; cands: Party[] }>;
const seeds = Array.from({ length: Number(opt("--seeds") ?? 16) }, (_, i) => 3001 + i);
const variants: { name: string; c: Content; first?: string; gear?: string }[] = [{ name: "shipped", c: loadContent(raw) }];
for (let i = 0; i < args.length; i++) {
  if (args[i] !== "--variant") continue;
  const [name, spec] = [args[i + 1].slice(0, args[i + 1].indexOf(":")), args[i + 1].slice(args[i + 1].indexOf(":") + 1)];
  const parts = spec.split(";").map((x) => ({ path: x.slice(0, x.indexOf("=")), v: x.slice(x.indexOf("=") + 1) }));
  const sets = parts.filter((x) => x.path !== "first" && x.path !== "gear").map((x) => ({ path: x.path, set: JSON.parse(x.v) }));
  variants.push({ name, c: loadContent(patch(raw, sets)), first: parts.find((x) => x.path === "first")?.v, gear: parts.find((x) => x.path === "gear")?.v });
}
const c0 = variants[0].c;
const cp = campaign(c0);
const which = (() => {
  const spec = opt("--nodes");
  if (!spec) return cp.nodes.map((_, i) => i);
  return spec.split(",").flatMap((p) => {
    const [a, b] = p.split("-").map(Number);
    return Array.from({ length: (b || a) - a + 1 }, (_, k) => a - 1 + k);
  });
})();

const add = (m: Map<string, number>, k: string, v = 1) => m.set(k, (m.get(k) ?? 0) + v);
const BIG = 4000; // a wind-up of 4 ticks or more, in sub-ticks

// Per variant: big moves ("0|Inferno|started"), and what interrupted them ("0|knight: Shield bash"). The rest, shipped rules only.
const moves = new Map<string, number>();
const interrupters = new Map<string, number>();
const only = opt("--only");
const reorder = (p: Party, first?: string): Party =>
  first ? { ...p, units: p.units.map((u) => (u.abilities.includes(first) ? { ...u, abilities: [first, ...u.abilities.filter((a) => a !== first)] } : u)) } : p;
const regear = (p: Party, spec?: string): Party => {
  if (!spec) return p;
  const [cl, slot, g] = spec.split(":");
  return { ...p, units: p.units.map((u) => (u.class === cl ? { ...u, gear: { ...u.gear, [slot]: g } } : u)) };
};
const casts = new Map<string, number>(); // "cleric|3" -> abilities cast in fight 3
const ticks = new Map<string, number>(); // "cleric|3" -> ticks spent in fight 3
const fightsBy = new Map<string, number>(); // "cleric|3" -> fights entered
const mpStart = new Map<string, number>(); // "cleric|3" -> sum of MP share at fight start
const healBy = new Map<string, number>(); // "cleric|mercy"
const healRuns = new Map<string, number>(); // class -> runs it was in
let taken = 0, runs = 0;

const table: string[] = [];
table.push(`| Node | builds × seeds | ${variants.map((v) => v.name).join(" | ")} |`, `| --- | --- | ${variants.map(() => "---").join(" | ")} |`);
const totals = variants.map(() => ({ w: 0, n: 0 }));
for (const i of which) {
  const node = cp.nodes[i];
  const cands = (results[node.id]?.cands ?? []).filter((p) => !only || p.units.some((u) => u.class === only));
  if (!cands.length) continue;
  const row: string[] = [];
  variants.forEach((v, vi) => {
    let w = 0, n = 0;
    for (const party of cands) for (const seed of seeds) {
      const run = play(v.c, combat, { dungeon: node.dungeon, party: regear(reorder(party, v.first), v.gear), seed, firstClear: true }, firstOption, { log: true });
      n++;
      if (run.outcome === "won") w++;
      tally(run.log as Entry[], vi);
    }
    totals[vi].w += w, totals[vi].n += n;
    row.push(`${Math.round((100 * w) / Math.max(1, n))}%`);
  });
  table.push(`| ${i + 1} ${node.name} | ${cands.length} × ${seeds.length} | ${row.join(" | ")} |`);
}
table.push(`| all | | ${totals.map((t) => `${Math.round((100 * t.w) / Math.max(1, t.n))}%`).join(" | ")} |`);
console.log("Wins of each node's best builds (the same builds and seeds under each variant):\n");
console.log(table.join("\n"));

console.log("\nFoes' big moves (wind-up of 4 ticks or more): started, interrupted, landed (landed share), per variant:\n");
console.log(`| Move | ${variants.map((v) => v.name).join(" | ")} |\n| --- | ${variants.map(() => "---").join(" | ")} |`);
const names = [...new Set([...moves.keys()].map((k) => k.split("|")[1]))].sort((a, b) => (moves.get(`0|${b}|started`) ?? 0) - (moves.get(`0|${a}|started`) ?? 0));
for (const nm of names) {
  const cells = variants.map((_, vi) => {
    const s = moves.get(`${vi}|${nm}|started`) ?? 0, x = moves.get(`${vi}|${nm}|interrupted`) ?? 0, l = moves.get(`${vi}|${nm}|landed`) ?? 0;
    return `${s} / ${x} / ${l} (${Math.round((100 * l) / Math.max(1, s))}%)`;
  });
  console.log(`| ${nm} | ${cells.join(" | ")} |`);
}
variants.forEach((v, vi) => {
  const xs = [...interrupters].filter(([k]) => k.startsWith(`${vi}|`)).sort((a, b) => b[1] - a[1]);
  console.log(`\nWhat interrupted them, ${v.name}: ${xs.map(([k, n]) => `${k.slice(k.indexOf("|") + 1)} ${n}`).join(", ") || "nothing"}`);
});

console.log("\nMP, shipped rules: abilities cast per 10 ticks, and MP at the fight's start as a share of max, by fight in the run:\n");
const classes = [...new Set([...fightsBy.keys()].map((k) => k.split("|")[0]))].sort();
const maxFight = Math.max(...[...fightsBy.keys()].map((k) => Number(k.split("|")[1])));
console.log(`| Class | ${Array.from({ length: maxFight }, (_, k) => `fight ${k + 1}`).join(" | ")} |\n| --- | ${Array.from({ length: maxFight }, () => "---").join(" | ")} |`);
for (const cl of classes) {
  const cells = Array.from({ length: maxFight }, (_, k) => {
    const n = fightsBy.get(`${cl}|${k + 1}`) ?? 0;
    if (!n) return "";
    const per10 = (10 * (casts.get(`${cl}|${k + 1}`) ?? 0)) / Math.max(1, ticks.get(`${cl}|${k + 1}`) ?? 0);
    return `${per10.toFixed(1)} / ${Math.round((100 * (mpStart.get(`${cl}|${k + 1}`) ?? 0)) / n)}%`;
  });
  console.log(`| ${cl} | ${cells.join(" | ")} |`);
}

console.log(`\nHealing by source, shipped rules (per run the class was in; the party took ${Math.round(taken / Math.max(1, runs)).toLocaleString("en")} damage a run on average):\n`);
const heals = [...healBy].sort((a, b) => b[1] - a[1]);
for (const [k, v] of heals.slice(0, 30)) {
  const [cl, src] = k.split("|");
  console.log(`  ${cl.padEnd(15)} ${src.padEnd(18)} ${Math.round(v / Math.max(1, healRuns.get(cl) ?? runs)).toLocaleString("en").padStart(8)}`);
}

function tally(log: Entry[], vi: number) {
  if (vi === 0) runs++;
  const cls = new Map<string, string>(); // unit id -> class id (party) or enemy ref
  const side = new Map<string, string>();
  const max = new Map<string, number>(); // max MP, read from the first spend or gain
  const mp = new Map<string, number>();
  const inRun = new Set<string>();
  let fight = 0;
  let lastParty: { at: number; name: string } | null = null;
  const big = new Set<string>(); // casts in progress that are big: unit id
  for (const e of log) {
    if (e.t === "fight_start") {
      fight++;
      for (const u of e.units as { id: string; ref: string; side: string }[]) {
        cls.set(u.id, u.ref), side.set(u.id, u.side);
        if (u.side === "party" && vi === 0) {
          inRun.add(u.ref);
          add(fightsBy, `${u.ref}|${fight}`);
          const m = max.get(u.id);
          add(mpStart, `${u.ref}|${fight}`, m ? (mp.get(u.id) ?? m) / m : 1);
        }
      }
      big.clear();
      continue;
    }
    if (e.t === "fight_end") {
      if (vi === 0) for (const [id, s] of side) if (s === "party" && cls.has(id)) add(ticks, `${cls.get(id)}|${fight}`, e.rounds as number);
      continue;
    }
    if (e.t === "join") {
      const u = e.unit as { id: string; ref: string; side: string };
      cls.set(u.id, u.ref), side.set(u.id, u.side);
    } else if (e.t === "mp") {
      const id = String(e.target), now = e.mp as number, before = now - (e.amount as number);
      if (!max.has(id)) max.set(id, Math.max(now, before));
      max.set(id, Math.max(max.get(id)!, now));
      mp.set(id, now);
    } else if (e.t === "cast" && side.get(String(e.by)) === "enemy" && (e.ends as number) - (e.at as number) >= BIG) {
      add(moves, `${vi}|${e.name}|started`);
      big.add(String(e.by));
    } else if (e.t === "act") {
      const by = String(e.by);
      if (side.get(by) === "party" && e.act !== "basic") {
        lastParty = { at: e.at as number, name: `${cls.get(by)}: ${e.name}` };
        if (vi === 0) add(casts, `${cls.get(by)}|${fight}`);
      }
      if (big.has(by)) (big.delete(by), add(moves, `${vi}|${e.name}|landed`));
    } else if (e.t === "interrupt" && big.has(String(e.unit))) {
      big.delete(String(e.unit));
      add(moves, `${vi}|${e.name}|interrupted`);
      add(interrupters, `${vi}|${lastParty && lastParty.at === e.at ? lastParty.name : "other (a status, a reaction)"}`);
    } else if (e.t === "fail" && big.has(String(e.by))) big.delete(String(e.by));
    // A pulse (Regen) is credited to its holder in the log, so it's listed by status, not by who applied it.
    else if (vi > 0) continue;
    else if (e.t === "heal" && side.get(String(e.target)) === "party" && e.by && side.get(String(e.by)) === "party") add(healBy, `${c0.statuses.get(String(e.src))?.pulse ? "(a pulse)" : cls.get(String(e.by))}|${e.src}`, e.amount as number);
    else if (e.t === "dmg" && side.get(String(e.target)) === "party") taken += e.amount as number;
  }
  if (vi === 0) for (const cl of inRun) add(healRuns, cl);
}
