/**
 * How fights play, from the logs: action economy, where damage and healing come from, how often things happen on
 * the same tick, what mobs and bosses do to a party, and how runs are lost. Plays each node's best builds
 * (out/campaign/results.json, or --best for the best one only) at the shipped knobs.
 *
 *   npx tsx src/campaign-audit.ts [--nodes 1-20] [--seeds 8] [--best] [--set path=value]...
 */
import { readFileSync } from "node:fs";
import { campaign, simPick } from "./campaign.js";
import { combat } from "./engine/combat/rules.js";
import type { Entry } from "./engine/log.js";
import { loadContent, play } from "./engine/run.js";
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
const results = JSON.parse(readFileSync(opt("--results") ?? "out/campaign/results.json", "utf8")) as Record<string, { cands: Party[]; best: { party: Party } }>;
const seeds = Array.from({ length: Number(opt("--seeds") ?? 8) }, (_, i) => 5001 + i);
const cp = campaign(c);
const which = (() => {
  const spec = opt("--nodes");
  if (!spec) return cp.nodes.map((_, i) => i);
  return spec.split(",").flatMap((p) => {
    const [a, b] = p.split("-").map(Number);
    return Array.from({ length: (b || a) - a + 1 }, (_, k) => a - 1 + k);
  });
})();

const T = 1000; // sub-ticks a tick
const add = (m: Map<string, number>, k: string, v = 1) => m.set(k, (m.get(k) ?? 0) + v);
const pct = (a: number, b: number) => `${Math.round((100 * a) / Math.max(1e-9, b))}%`;
const f1 = (x: number) => (Number.isFinite(x) ? x.toFixed(1) : "–");
const k = (x: number) => Math.round(x).toLocaleString("en");

type Kind = "mob" | "boss";
// Tallies, keyed by fight kind where it matters.
const fights = new Map<string, number>(), fightTicks = new Map<string, number>();
const acts = new Map<string, number>(); // "mob|party|basic"
const unitTicks = new Map<string, number>(); // "mob|party"
const classActs = new Map<string, number>(); // "knight|basic"
const dmg = new Map<string, number>(); // "mob|party|basic" damage dealt by that side from that source
const dmgBy = new Map<string, number>(); // "party|<src>" (all fights): damage by source id
const classUses = new Map<string, number>(); // "ranger|basic", "ranger|ability:venom_arrow", "ranger|status:poison": uses (swings, casts, applications)
const classDmg = new Map<string, number>(); // "ranger|basic", "ranger|ability:venom_arrow", "ranger|status:poison": by the class that dealt or applied it
const castsOf = new Map<string, number>(); // "party|<act id>"
const critDmg = new Map<string, number>(); // "party" / "enemy"
const hits = new Map<string, number>(), crits = new Map<string, number>();
const heal = new Map<string, number>();
const statusApps = new Map<string, number>(); // applications on the other side, by status
let sameTickActs = 0, partyActs = 0, bigTicks = 0, ticksWithActs = 0, chains = 0, partyAbilities = 0;
let dotApps = 0, dotWasted = 0;
const enemyLife = new Map<string, { n: number; ticks: number; acted0: number; dmg: number }>(); // by kind
const partyMaxHp = new Map<string, number>(), takenBy = new Map<string, number>(); // "mob|minion" etc.
const koCause = new Map<string, number>(); // "spike|basic" ...
const bigHit: number[] = []; // largest single hit on a party member per boss fight, as share of their max HP
const losses = new Map<string, number>();
const lossMp: number[] = [], lossTicks: number[] = [];
let runs = 0, won = 0, enraged = 0;

for (const i of which) {
  const node = cp.nodes[i];
  const r = results[node.id];
  if (!r) continue;
  const parties = args.includes("--best") ? [r.best.party] : r.cands;
  for (const party of parties) for (const seed of seeds) {
    const run = play(c, combat, { dungeon: node.dungeon, party: current(c, party), seed, firstClear: true }, simPick, { log: true });
    runs++;
    if (run.outcome === "won") won++;
    tally(run.log as Entry[], run.outcome === "won");
  }
}

function tally(log: Entry[], wonRun: boolean) {
  const side = new Map<string, string>(), ref = new Map<string, string>(), max = new Map<string, number>(), rank = new Map<string, string>();
  const born = new Map<string, number>(), died = new Map<string, number>(), acted = new Map<string, number>(), dealtBy = new Map<string, number>();
  const mp = new Map<string, number>(), mpMax = new Map<string, number>();
  let kind: Kind = "mob", start = 0, lastPartyActAt = -1, tickActs = 0, lastTick = -1;
  const lastActKind = new Map<string, string>();
  const lastApplier = new Map<string, string>();
  const dots: { unit: string; at: number }[] = [];
  let biggest = 0;
  const flushTick = () => {
    if (lastTick < 0) return;
    ticksWithActs++;
    if (tickActs >= 3) bigTicks++;
  };
  for (const e of log) {
    if (e.t === "fight_start") {
      kind = e.boss ? "boss" : "mob";
      start = 0;
      add(fights, kind);
      biggest = 0;
      for (const u of e.units as { id: string; ref: string; side: string; hp: number; max: number }[]) {
        side.set(u.id, u.side), ref.set(u.id, u.ref), max.set(u.id, u.max), born.set(u.id, 0), acted.set(u.id, 0), dealtBy.set(u.id, 0);
        if (u.side === "enemy") rank.set(u.id, c.enemies.get(u.ref)?.rank ?? "minion");
        else add(partyMaxHp, kind, u.max);
      }
      lastTick = -1, tickActs = 0, lastPartyActAt = -1;
      dots.length = 0;
      continue;
    }
    const at = (e.at as number) ?? 0;
    if (e.t === "join") {
      const u = e.unit as { id: string; ref: string; side: string; max: number };
      side.set(u.id, u.side), ref.set(u.id, u.ref), max.set(u.id, u.max), born.set(u.id, at), acted.set(u.id, 0), dealtBy.set(u.id, 0);
      if (u.side === "enemy") rank.set(u.id, c.enemies.get(u.ref)?.rank ?? "minion");
    } else if (e.t === "act") {
      const by = String(e.by), s = side.get(by)!, a = e.act === "basic" ? "basic" : "ability";
      add(acts, `${kind}|${s}|${a}`);
      add(acted, by);
      if (s === "party") {
        add(classActs, `${ref.get(by)}|${a}`);
        add(classUses, `${ref.get(by)}|${e.act === "basic" ? "basic" : `ability:${e.act}`}`);
        add(castsOf, `party|${e.act}`);
        partyActs++;
        if (at === lastPartyActAt) sameTickActs += 2; // both acts of the pair (approximate for triples)
        lastPartyActAt = at;
        if (a === "ability") {
          partyAbilities++;
          if (lastActKind.get(by) === "ability") chains++;
        }
        lastActKind.set(by, a);
      } else add(castsOf, `enemy|${e.act}`);
      if (at !== lastTick) flushTick(), (lastTick = at), (tickActs = 0);
      tickActs++;
    } else if (e.t === "dmg") {
      const tgt = String(e.target), amt = e.amount as number;
      const by = e.by ? String(e.by) : null;
      const dealerSide = by ? side.get(by)! : side.get(tgt) === "enemy" ? "party" : "enemy";
      const src = e.part === "pulse" ? `status:${e.src}` : e.part === "reaction" ? `reaction:${e.src}` : e.src === "basic" ? "basic" : `ability:${e.src}`;
      const cat = src.split(":")[0];
      add(dmg, `${kind}|${dealerSide}|${cat}`, amt);
      add(dmgBy, `${dealerSide}|${src}`, amt);
      if (e.part === "hit" || e.part === "extra") {
        add(hits, dealerSide);
        if (e.crit) add(crits, dealerSide), add(critDmg, dealerSide, amt);
      }
      if (by) add(dealtBy, by, amt);
      // A shared status (Burn, Shock) has no single source in the engine: credit its last applier on this target.
      const owner = by ?? (e.from ? String(e.from) : lastApplier.get(`${tgt}|${e.src}`) ?? null);
      if (owner && side.get(owner) === "party" && side.get(tgt) === "enemy") add(classDmg, `${ref.get(owner)}|${src}`, amt);
      if (side.get(tgt) === "party") {
        const who = by ? rank.get(by) ?? "status" : "status";
        add(takenBy, `${kind}|${who}`, amt);
        const share = amt / (max.get(tgt) ?? 1);
        if (kind === "boss" && share > biggest) biggest = share;
      }
    } else if (e.t === "heal" && side.get(String(e.target)) === "party") {
      add(heal, String(e.src), e.amount as number);
    } else if (e.t === "status" && side.get(String(e.unit)) === "enemy") {
      if (e.by) {
        lastApplier.set(`${e.unit}|${e.status}`, String(e.by));
        if (side.get(String(e.by)) === "party") add(classUses, `${ref.get(String(e.by))}|status:${e.status}`);
      }
      add(statusApps, String(e.status));
      if (e.status === "poison" || e.status === "burn") dots.push({ unit: String(e.unit), at });
    } else if (e.t === "mp") {
      const id = String(e.target), now = e.mp as number, before = now - (e.amount as number);
      mpMax.set(id, Math.max(mpMax.get(id) ?? 0, now, before));
      mp.set(id, now);
    } else if (e.t === "down" || e.t === "leave") {
      const id = String(e.unit);
      if (!died.has(id)) died.set(id, at);
      if (side.get(id) === "enemy") {
        const key = `${kind}|${rank.get(id)}`;
        const l = enemyLife.get(key) ?? { n: 0, ticks: 0, acted0: 0, dmg: 0 };
        l.n++, (l.ticks += (at - (born.get(id) ?? 0)) / T), (l.dmg += dealtBy.get(id) ?? 0);
        if (!acted.get(id)) l.acted0++;
        enemyLife.set(key, l);
        for (const d of dots) if (d.unit === id) {
          dotApps++;
          if (at - d.at < 4 * T) dotWasted++;
        }
        for (let j = dots.length - 1; j >= 0; j--) if (dots[j].unit === id) dots.splice(j, 1);
      } else if (e.t === "down") {
        // The blow that knocked a member out: the last damage entry on it.
        const prev = [...log.slice(Math.max(0, log.indexOf(e) - 12), log.indexOf(e))].reverse().find((x) => x.t === "dmg" && x.target === id);
        if (prev) {
          const share = (prev.amount as number) / (max.get(id) ?? 1);
          const what = prev.part === "pulse" ? "status" : prev.src === "basic" ? "basic" : "ability";
          add(koCause, `${share >= 0.35 ? "spike" : "chip"}|${what}`);
        }
      }
    } else if (e.t === "enrage") enraged++;
    else if (e.t === "fight_end") {
      flushTick();
      lastTick = -1;
      const ticks = e.rounds as number;
      add(fightTicks, kind, ticks);
      for (const [id, s] of side) if (s && born.has(id)) add(unitTicks, `${kind}|${s}`, Math.max(0, (died.has(id) ? died.get(id)! / T : ticks) - (born.get(id) ?? 0) / T));
      if (kind === "boss") bigHit.push(biggest);
      if (e.result === "lost") {
        add(losses, kind);
        lossTicks.push(ticks);
        const shares = [...mp].filter(([id]) => side.get(id) === "party").map(([id, v]) => v / Math.max(1, mpMax.get(id) ?? 1));
        if (shares.length) lossMp.push(shares.reduce((a, b) => a + b, 0) / shares.length);
      }
      // A fresh map per fight for units; the next fight_start resets them.
      side.clear(), born.clear(), died.clear();
    }
  }
}

const out: string[] = [];
out.push(`# Audit: ${runs} runs (${pct(won, runs)} won), nodes ${which.map((i) => i + 1).join(",")}, ${args.includes("--best") ? "the best build" : "the best builds"} of each node\n`);
out.push("## 1. Action economy\n");
out.push("| Fights | count | mean ticks | party actions /unit/10 ticks | of which basic | enemy actions /unit/10 ticks | of which basic | party : enemy, per unit |");
out.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
for (const kd of ["mob", "boss"] as Kind[]) {
  const n = fights.get(kd) ?? 0;
  const pa = (acts.get(`${kd}|party|basic`) ?? 0) + (acts.get(`${kd}|party|ability`) ?? 0);
  const ea = (acts.get(`${kd}|enemy|basic`) ?? 0) + (acts.get(`${kd}|enemy|ability`) ?? 0);
  const pr = (10 * pa) / Math.max(1, unitTicks.get(`${kd}|party`) ?? 1), er = (10 * ea) / Math.max(1, unitTicks.get(`${kd}|enemy`) ?? 1);
  out.push(`| ${kd} | ${n} | ${f1((fightTicks.get(kd) ?? 0) / Math.max(1, n))} | ${f1(pr)} | ${pct(acts.get(`${kd}|party|basic`) ?? 0, pa)} | ${f1(er)} | ${pct(acts.get(`${kd}|enemy|basic`) ?? 0, ea)} | ${f1(pr / er)} : 1 |`);
}
out.push("\nShare of each class's actions that are basic attacks (all fights):\n");
const cls = [...new Set([...classActs.keys()].map((x) => x.split("|")[0]))].sort();
out.push(cls.map((x) => `${x} ${pct(classActs.get(`${x}|basic`) ?? 0, (classActs.get(`${x}|basic`) ?? 0) + (classActs.get(`${x}|ability`) ?? 0))}`).join(", "));

out.push("\n## 2. Where damage comes from\n");
out.push("| Fights | side | basic | abilities | statuses | reactions |\n| --- | --- | --- | --- | --- | --- |");
for (const kd of ["mob", "boss"] as Kind[]) for (const s of ["party", "enemy"]) {
  const g = (cat: string) => dmg.get(`${kd}|${s}|${cat}`) ?? 0;
  const tot = g("basic") + g("ability") + g("status") + g("reaction");
  out.push(`| ${kd} | ${s} | ${pct(g("basic"), tot)} | ${pct(g("ability"), tot)} | ${pct(g("status"), tot)} | ${pct(g("reaction"), tot)} |`);
}
out.push(`\nCrits: the party crits ${pct(crits.get("party") ?? 0, hits.get("party") ?? 0)} of its hits, for ${pct(critDmg.get("party") ?? 0, [...dmg].filter(([x]) => x.includes("|party|")).reduce((a, [, v]) => a + v, 0))} of its damage; foes crit ${pct(crits.get("enemy") ?? 0, hits.get("enemy") ?? 0)} of theirs.`);
out.push("\nThe party's damage by source, with the mean per use (a cast, a swing, or a status's application):\n");
const partyTotal = [...dmgBy].filter(([x]) => x.startsWith("party|")).reduce((a, [, v]) => a + v, 0);
for (const [key, v] of [...dmgBy].filter(([x]) => x.startsWith("party|")).sort((a, b) => b[1] - a[1]).slice(0, 40)) {
  const src = key.slice(6);
  const [cat, id] = src.includes(":") ? src.split(":") : [src, "basic"];
  const uses = cat === "status" ? statusApps.get(id) ?? 0 : castsOf.get(`party|${id}`) ?? 0;
  out.push(`  ${src.padEnd(28)} ${pct(v, partyTotal).padStart(4)}   per use ${uses ? k(v / uses) : "–"}${cat === "status" ? ` (${uses} applications)` : ` (${uses} uses)`}`);
}
out.push(`\nDoT applications (Poison, Burn) on a foe that died within 4 ticks: ${pct(dotWasted, dotApps)} of ${dotApps}.`);
out.push("\nEach class's damage by source (statuses counted for whoever applied them), with ×: one use against one of its swings:\n");
for (const cl of [...new Set([...classDmg.keys()].map((x) => x.split("|")[0]))].sort()) {
  const rows = [...classDmg].filter(([x]) => x.startsWith(cl + "|"));
  const tot = rows.reduce((a, [, v]) => a + v, 0);
  // Per use, against the class's own swing: how many basic attacks one cast (or one status application) is worth.
  const swing = (classDmg.get(`${cl}|basic`) ?? 0) / Math.max(1, classUses.get(`${cl}|basic`) ?? 1);
  const per = (x: string, v: number) => {
    const n = classUses.get(x);
    return n && swing ? ` ×${(v / n / swing).toFixed(1)}` : "";
  };
  out.push(`- ${cl} (a swing ${k(swing)}): ${rows.sort((a, b) => b[1] - a[1]).map(([x, v]) => `${x.split("|")[1].replace(/^(ability|status|reaction):/, "")}${x.includes("|status:") ? " (status)" : ""} ${pct(v, tot)}${x.endsWith("|basic") ? "" : per(x, v)}`).join(", ")}`);
}
out.push("\nHealing on the party by source:");
const ht = [...heal.values()].reduce((a, b) => a + b, 0);
out.push("  " + [...heal].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([s, v]) => `${s} ${pct(v, ht)}`).join(", "));

out.push("\n## 3. Pacing\n");
out.push(`- Party actions that share their tick with another party action: ${pct(sameTickActs, partyActs)}.`);
out.push(`- Ticks with any action that have 3 or more: ${pct(bigTicks, ticksWithActs)}.`);
out.push(`- Party abilities cast straight after another ability by the same unit (no basic attack between): ${pct(chains, partyAbilities)}.`);

out.push("\n## 4. Mobs and bosses\n");
out.push("| Fights | enemy rank | killed | mean life (ticks) | killed before acting | damage dealt each |\n| --- | --- | --- | --- | --- | --- |");
for (const [key, l] of [...enemyLife].sort()) {
  const [kd, rk] = key.split("|");
  out.push(`| ${kd} | ${rk} | ${l.n} | ${f1(l.ticks / l.n)} | ${pct(l.acted0, l.n)} | ${k(l.dmg / l.n)} |`);
}
out.push("\nDamage the party takes per fight, as a share of its total max HP, by who dealt it:\n");
for (const kd of ["mob", "boss"] as Kind[]) {
  const n = fights.get(kd) ?? 1, hp = (partyMaxHp.get(kd) ?? 1) / n;
  const parts = [...takenBy].filter(([x]) => x.startsWith(kd + "|")).map(([x, v]) => `${x.split("|")[1]} ${pct(v / n, hp)}`);
  out.push(`- ${kd} fights: ${parts.join(", ")}`);
}
bigHit.sort((a, b) => a - b);
const q = (p: number) => (bigHit.length ? bigHit[Math.floor(p * (bigHit.length - 1))] : 0);
out.push(`\nBoss fights, the biggest single hit on a party member, as a share of their max HP: median ${pct(q(0.5), 1)}, top tenth ${pct(q(0.9), 1)}.`);
out.push(`\nKnockouts by the blow that did it (spike: 35% of max HP or more): ${[...koCause].sort((a, b) => b[1] - a[1]).map(([x, v]) => `${x.replace("|", " ")} ${v}`).join(", ")}.`);
out.push(`\nLosses: ${[...losses].map(([x, v]) => `${v} in ${x} fights`).join(", ") || "none"}; mean length ${f1(lossTicks.reduce((a, b) => a + b, 0) / Math.max(1, lossTicks.length))} ticks; the party's mean MP share at the loss ${pct(lossMp.reduce((a, b) => a + b, 0) / Math.max(1, lossMp.length), 1)}; fights that reached the enrage: ${enraged}.`);
console.log(out.join("\n"));
