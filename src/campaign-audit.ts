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
import { advanceOnce, answer, loadContent, newRun, type Run } from "./engine/run.js";
import type { CFight } from "./engine/combat/fight.js";
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
const classUses = new Map<string, number>(); // "ranger|basic", "ranger|ability:barbed_arrow", "ranger|status:bleed": uses (swings, casts, applications)
const classDmg = new Map<string, number>(); // "ranger|basic", "ranger|ability:barbed_arrow", "ranger|status:bleed": by the class that dealt or applied it
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
const koClass = new Map<string, number>(), inFights = new Map<string, number>(); // knockouts and fights entered, by class
const bigHit: number[] = []; // largest single hit on a party member per boss fight, as share of their max HP
const losses = new Map<string, number>();
const lossMp: number[] = [], lossTicks: number[] = [];
let runs = 0, won = 0, enraged = 0;
// Step 5c: MP. Time each class spends with an ability off cooldown that it can't pay for ("starved"), and with nothing to
// cast for want of MP, by fight in the run; MP at each fight's start; casts by slot, and the first cast's tick, in regular fights.
const starved = new Map<string, number>(), alive = new Map<string, number>(); // "cleric|3" (fight 3 of the run)
const mpAt = new Map<string, number>(), mpN = new Map<string, number>(); // "cleric|3": MP share at the fight's start
const slotCasts = new Map<string, number>(), slotFirst = new Map<string, number[]>(), slotFights = new Map<string, number>(); // "cleric|0"
const noCast = new Map<string, number>(); // "cleric": regular fights in which it cast nothing
const campfire = new Map<string, number>(); // the sims' picks: "rest", "focus", "raise"

/** Plays a run a moment at a time, so MP starvation can be read off the fight's state between moments. */
function playWatched(dungeon: string, party: Party, seed: number): Run {
  const run = newRun(c, combat, { dungeon, party, seed, firstClear: true }, { log: true, checked: true });
  let fightNo = 0, last: CFight | null = null, prev = 0;
  let short = new Set<string>(); // party units short of MP for a ready ability, as of the last moment
  while (!run.outcome) {
    if (run.pending) {
      const pick = simPick(run.pending, run);
      add(campfire, pick.split(":")[0]);
      answer(c, combat, run, pick);
      continue;
    }
    const f = run.fight as CFight | null;
    if (f && f !== last) {
      last = f, prev = 0, fightNo++, short = new Set();
      for (const u of f.units) if (u.side === "party" && !u.ko) add(mpAt, `${u.ref}|${fightNo}`, u.stats.max_mp ? u.mp / u.stats.max_mp : 1), add(mpN, `${u.ref}|${fightNo}`);
    }
    if (f && f.begun && !f.result) {
      const t = f.now;
      // Credit the time since the last moment to the state the units were in during it.
      const dt = (t - prev) / T;
      const now = new Set<string>();
      for (const u of f.units) {
        if (u.side !== "party" || u.ko) continue;
        add(alive, `${u.ref}|${fightNo}`, dt);
        if (short.has(u.id)) add(starved, `${u.ref}|${fightNo}`, dt);
        if (u.acts.some((a) => a.id !== "basic" && a.ready <= t && u.mp < (c.abilities.get(a.id)?.mp ?? 0))) now.add(u.id);
      }
      short = now;
      prev = t;
    }
    advanceOnce(c, combat, run);
  }
  return run;
}

for (const i of which) {
  const node = cp.nodes[i];
  const r = results[node.id];
  if (!r) continue;
  const parties = args.includes("--best") ? [r.best.party] : r.cands;
  for (const party of parties) for (const seed of seeds) {
    const p = current(c, party);
    const run = playWatched(node.dungeon, p, seed);
    runs++;
    if (run.outcome === "won") won++;
    tally(run.log as Entry[], run.outcome === "won", p);
  }
}

function tally(log: Entry[], wonRun: boolean, party: Party) {
  const slotOf = (cls: string, act: string) => party.units.find((u) => u.class === cls)?.abilities.indexOf(act) ?? -1;
  const firstBy = new Map<string, number>(), castBy = new Map<string, number>(); // per fight: unit id -> first cast tick, casts
  const startedDown = new Set<string>(); // party members knocked out before the fight began: not counted for casting
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
      startedDown.clear();
      for (const u of e.units as { id: string; ref: string; side: string; hp: number; max: number }[]) {
        if (u.hp <= 0) startedDown.add(u.id);
        side.set(u.id, u.side), ref.set(u.id, u.ref), max.set(u.id, u.max), born.set(u.id, 0), acted.set(u.id, 0), dealtBy.set(u.id, 0);
        if (u.side === "enemy") rank.set(u.id, c.enemies.get(u.ref)?.rank ?? "minion");
        else add(partyMaxHp, kind, u.max), add(inFights, u.ref);
      }
      lastTick = -1, tickActs = 0, lastPartyActAt = -1;
      dots.length = 0;
      firstBy.clear(), castBy.clear();
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
          if (kind === "mob") {
            const sl = slotOf(ref.get(by)!, String(e.act));
            add(slotCasts, `${ref.get(by)}|${sl}`);
            if (!firstBy.has(`${by}|${sl}`)) firstBy.set(`${by}|${sl}`, at / T);
            add(castBy, by);
          }
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
      if (e.status === "burn") dots.push({ unit: String(e.unit), at });
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
        add(koClass, ref.get(id) ?? "?");
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
      if (kind === "mob") for (const [id, s] of side) {
        if (s !== "party" || !born.has(id) || startedDown.has(id)) continue;
        const cl = ref.get(id)!;
        if (!castBy.get(id)) add(noCast, cl);
        for (let sl = 0; sl < 3; sl++) {
          add(slotFights, `${cl}|${sl}`);
          const ft = firstBy.get(`${id}|${sl}`);
          if (ft !== undefined) slotFirst.set(`${cl}|${sl}`, [...(slotFirst.get(`${cl}|${sl}`) ?? []), ft]);
        }
      }
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
out.push(`\nBurn applications on a foe that died within 4 ticks: ${pct(dotWasted, dotApps)} of ${dotApps}.`);
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
out.push(`\nKnockouts per 100 fights a class is in: ${[...inFights].map(([cl, n]) => [cl, (100 * (koClass.get(cl) ?? 0)) / n] as const).sort((a, b) => b[1] - a[1]).map(([cl, v]) => `${cl} ${f1(v)}`).join(", ")}.`);
out.push(`\nKnockouts by the blow that did it (spike: 35% of max HP or more): ${[...koCause].sort((a, b) => b[1] - a[1]).map(([x, v]) => `${x.replace("|", " ")} ${v}`).join(", ")}.`);
out.push(`\nLosses: ${[...losses].map(([x, v]) => `${v} in ${x} fights`).join(", ") || "none"}; mean length ${f1(lossTicks.reduce((a, b) => a + b, 0) / Math.max(1, lossTicks.length))} ticks; the party's mean MP share at the loss ${pct(lossMp.reduce((a, b) => a + b, 0) / Math.max(1, lossMp.length), 1)}; fights that reached the enrage: ${enraged}.`);
out.push("\n## 5. MP and casting\n");
out.push("Time with an ability ready but not enough MP for it (starved), and MP at the fight's start, by fight in the run (regular and boss alike):\n");
const fightNos = [...new Set([...alive.keys()].map((x) => Number(x.split("|")[1])))].sort((a, b) => a - b);
out.push(`| Class | ${fightNos.map((n) => `fight ${n}`).join(" | ")} | all |\n| --- | ${fightNos.map(() => "---").join(" | ")} | --- |`);
const mpClasses = [...new Set([...alive.keys()].map((x) => x.split("|")[0]))].sort();
for (const cl of mpClasses) {
  let sa = 0, ss = 0;
  const cells = fightNos.map((n) => {
    const a = alive.get(`${cl}|${n}`) ?? 0, st = starved.get(`${cl}|${n}`) ?? 0;
    sa += a, ss += st;
    const m = mpN.get(`${cl}|${n}`) ? (mpAt.get(`${cl}|${n}`) ?? 0) / mpN.get(`${cl}|${n}`)! : NaN;
    return a ? `${pct(st, a)} / ${Number.isFinite(m) ? pct(m, 1) : "–"}` : "";
  });
  out.push(`| ${cl} | ${cells.join(" | ")} | ${pct(ss, sa)} |`);
}
out.push(`\nThe campfire, as the simulations picked: ${[...campfire].map(([k, v]) => `${k} ${v}`).join(", ") || "never reached"}.`);
out.push("\nRegular fights a member starts standing: casts per fight by slot, the median first cast's tick (of fights with one), and fights with no cast at all:\n");
out.push("| Class | slot 1 | slot 2 | slot 3 | no cast |\n| --- | --- | --- | --- | --- |");
for (const cl of [...new Set([...slotFights.keys()].map((x) => x.split("|")[0]))].sort()) {
  const n = slotFights.get(`${cl}|0`) ?? 1;
  const cell = (sl: number) => {
    const f = (slotFirst.get(`${cl}|${sl}`) ?? []).sort((a, b) => a - b);
    return `${f1((slotCasts.get(`${cl}|${sl}`) ?? 0) / n)} (t${f.length ? Math.round(f[Math.floor(f.length / 2)]) : "–"})`;
  };
  out.push(`| ${cl} | ${cell(0)} | ${cell(1)} | ${cell(2)} | ${pct(noCast.get(cl) ?? 0, n)} |`);
}
console.log(out.join("\n"));
