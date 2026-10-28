/**
 * Step 5h: the MP economy, checked on the hand-built rosters (src/rogue-parties.ts) rather than whole simulated runs.
 *
 * - Endurance: each roster's three fight its region's regular fights one after another from full MP, with HP made whole
 *   each fight and nothing else restored, until each member is under a third of its MP. How many fights each class lasts
 *   is the director's target: two or three for every class, casters and walls close together.
 * - The road: each roster plays an act's fights in order (two easy, a regular, an elite, two regular, a campfire, a
 *   regular, an elite, a campfire, the boss) at the act's power level, with stated rules:
 *     rotation: before each fight, those under a third of their MP (or knocked out) sit out, and the first three of the
 *       roster's preference order who can fight do;
 *     supplies (with tonics): after each won fight, a tonic if anyone is under 40% MP, else a potion (two of each at most);
 *       before each fight, a tonic to the preferred member under half its MP, potions to fighters under half their HP;
 *     campfire: REST if the party is under 70% HP, else FOCUS.
 *   It reports how often the bench is used, how often a fighter goes in under a third of its MP, and the losses.
 *
 *   npx tsx src/rogue-acts.ts [--acts 1,2,3] [--rosters id,id] [--set path=value ...]
 */
import { readFileSync } from "node:fs";
import { loadContent, type Content } from "./engine/run.js";
import { int, rngFor } from "./engine/rng.js";
import { autoFight, foesFor, knobFor, maxOf, member, rogue, useSupply, type FightTier, type RogueRun } from "./rogue.js";
import { ROSTERS, buildRoster, type Roster } from "./rogue-parties.js";
import { patch, type Patch } from "./sim/content.js";

const args = process.argv.slice(2);
const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const all = (name: string) => args.flatMap((a, i) => (a === name ? [args[i + 1]] : []));
const parsePatches = (xs: string[]): Patch[] => xs.map((x) => { const [path, v] = x.split("="); return { path, set: JSON.parse(v) }; });

const mpOf = (c: Content, run: RogueRun, cls: string) => { const mx = maxOf(c, run, cls, "max_mp"); return mx > 0 ? 1 - member(run, cls).missMp / mx : 1; };
const hpOf = (c: Content, run: RogueRun, cls: string) => { const m = member(run, cls); return m.ko ? 0 : 1 - m.missHp / maxOf(c, run, cls, "max_hp"); };

/** One fight of a tier on a floor, from the region's pool by the dice, at its knob. True if won. */
function fight(c: Content, run: RogueRun, tier: "easy" | "normal" | "elite" | "boss", floor: number, seed: number): boolean {
  const reg = rogue(c).regions.find((r) => r.id === run.region)!;
  const pool = tier === "boss" ? reg.bosses : reg[tier];
  const f = pool[int(rngFor(seed, "acts:fight"), pool.length)];
  const t: FightTier = tier === "boss" ? "boss" : tier === "elite" ? "elite" : "fight";
  run.floor = floor;
  run.pending = { kind: "fight", node: `acts${floor}`, tier: t, fight: f, foes: foesFor(c, t, knobFor(c, run, t, floor, f)), seed };
  autoFight(c, run);
  const p = run.pending as RogueRun["pending"];
  return !(p.kind === "over" && !p.won);
}

/** Endurance: fights each member of the three lasts from full MP before it's under a third (8 at most). */
function endurance(c: Content, r: Roster, act: number, region: string): Record<string, number> {
  const run = buildRoster(c, r, act, "normal");
  run.region = region;
  for (const m of run.roster) (m.missHp = 0), (m.missMp = 0), (m.ko = false);
  const out: Record<string, number> = {};
  for (let i = 1; i <= 8 && Object.keys(out).length < 3; i++) {
    for (const cls of run.party) (member(run, cls).missHp = 0), (member(run, cls).ko = false);
    fight(c, run, "normal", 5, 4000 + i * 31 + act);
    for (const cls of run.party) if (out[cls] === undefined && mpOf(c, run, cls) < 1 / 3) out[cls] = i;
  }
  for (const cls of run.party) out[cls] ??= 9;
  return out;
}

type RoadRec = { fights: number; benched: number; dryIn: number; lost: number; tonics: number; mpIn: number[] };
const ROAD: (["easy" | "normal" | "elite" | "boss", number] | "camp")[] = [["easy", 1], ["easy", 2], ["normal", 3], ["elite", 4], ["normal", 5], ["normal", 6], "camp", ["normal", 7], ["elite", 8], "camp", ["boss", 10]];

/** The road: an act's fights in order with the stated rotation, supply and campfire rules. */
function road(c: Content, r: Roster, act: number, region: string, tonics: boolean): RoadRec {
  const run = buildRoster(c, r, act, "normal");
  run.region = region;
  for (const m of run.roster) (m.missHp = 0), (m.missMp = 0), (m.ko = false);
  run.supplies = [];
  const rec: RoadRec = { fights: 0, benched: 0, dryIn: 0, lost: 0, tonics: 0, mpIn: [] };
  const k = rogue(c).config;
  let step = 0;
  for (const s of ROAD) {
    step++;
    if (s === "camp") {
      const party = run.party.map((cls) => member(run, cls));
      const hp = run.party.reduce((t, cls) => t + hpOf(c, run, cls), 0) / run.party.length;
      for (const m of party) if (!m.ko) {
        if (hp < 0.7) m.missHp = Math.max(0, m.missHp - Math.floor((maxOf(c, run, m.cls, "max_hp") * k.campfire.hp) / 100));
        else m.missMp = Math.max(0, m.missMp - Math.floor((maxOf(c, run, m.cls, "max_mp") * k.campfire.mp) / 100));
      }
      continue;
    }
    // Supplies before the fight.
    if (tonics) {
      const low = r.classes.filter((cls) => !member(run, cls).ko && maxOf(c, run, cls, "max_mp") > 0 && mpOf(c, run, cls) < 0.5);
      if (low.length && run.supplies.includes("tonic")) {
        // useSupply gives to a party member: put the preferred one in the party for the drink.
        const who = low[0];
        const was = [...run.party];
        if (!run.party.includes(who)) run.party = [who, ...run.party.slice(0, 2)];
        if (useSupply(c, run, "tonic", who)) rec.tonics++;
        run.party = was;
      }
    }
    // Rotation.
    const can = r.classes.filter((cls) => !member(run, cls).ko && mpOf(c, run, cls) >= 1 / 3);
    const rest = r.classes.filter((cls) => !member(run, cls).ko && !can.includes(cls)).sort((a, b) => mpOf(c, run, b) - mpOf(c, run, a));
    const party = [...can, ...rest].slice(0, 3);
    if (!party.length) break;
    run.party = party;
    if (tonics) for (const cls of run.party) if (hpOf(c, run, cls) < 0.5 && run.supplies.includes("potion")) useSupply(c, run, "potion", cls);
    rec.fights++;
    if (run.party.some((cls) => !r.classes.slice(0, 3).includes(cls))) rec.benched++;
    for (const cls of run.party) { const v = mpOf(c, run, cls); rec.mpIn.push(v); if (v < 1 / 3) rec.dryIn++; }
    const won = fight(c, run, s[0], s[1], 7000 + act * 100 + step * 13 + r.id.length);
    if (!won) {
      rec.lost++;
      for (const m of run.roster) (m.missHp = 0), (m.ko = false);
      continue;
    }
    if (tonics) {
      const anyLow = r.classes.some((cls) => maxOf(c, run, cls, "max_mp") > 0 && mpOf(c, run, cls) < 0.4);
      const kind = anyLow ? "tonic" : "potion";
      if (run.supplies.filter((x) => x === kind).length < k.bag[kind]) run.supplies.push(kind);
    }
  }
  return rec;
}

function main() {
  let raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));
  raw = patch(raw, parsePatches(all("--set")));
  const c = loadContent(raw);
  const acts = (opt("--acts") ?? "1,2,3").split(",").map(Number);
  const rosters = opt("--rosters") ? ROSTERS.filter((r) => opt("--rosters")!.split(",").includes(r.id)) : ROSTERS;
  const regionsOf = (act: number) => rogue(c).regions.filter((r) => r.act === act).map((r) => r.id);
  // Endurance by class.
  const end = new Map<string, number[]>();
  for (const act of acts) for (const r of rosters) for (const g of regionsOf(act)) for (const [cls, n] of Object.entries(endurance(c, r, act, g))) end.set(cls, [...(end.get(cls) ?? []), n]);
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
  console.log("ENDURANCE: fights from full MP before under a third (no rotation, no tonics, HP made whole each fight; 9 = lasted all 8)");
  const med = (xs: number[]) => { const ys = [...xs].sort((a, b) => a - b); return ys.length % 2 ? ys[(ys.length - 1) / 2] : (ys[ys.length / 2 - 1] + ys[ys.length / 2]) / 2; };
  for (const [cls, xs] of [...end].sort((a, b) => med(a[1]) - med(b[1]) || avg(a[1]) - avg(b[1]))) console.log(`  ${cls.padEnd(15)} median ${med(xs).toFixed(1)}, mean ${avg(xs).toFixed(1)}  (${xs.length} runs; min ${Math.min(...xs)}, max ${Math.max(...xs)})`);
  for (const tonics of [false, true]) {
    console.log(`\nTHE ROAD ${tonics ? "WITH" : "WITHOUT"} TONICS, by act: fights; a bench member fighting (share of fights); fighters going in under a third of MP (share of fighter-fights); fighters' MP going in; losses; tonics drunk`);
    for (const act of acts) {
      const recs: RoadRec[] = [];
      for (const r of rosters) for (const g of regionsOf(act)) recs.push(road(c, r, act, g, tonics));
      const fights = recs.reduce((t, x) => t + x.fights, 0);
      const mp = recs.flatMap((x) => x.mpIn);
      console.log(`  act ${act}: ${fights} fights; bench in ${((100 * recs.reduce((t, x) => t + x.benched, 0)) / fights).toFixed(0)}%; going in dry ${((100 * recs.reduce((t, x) => t + x.dryIn, 0)) / mp.length).toFixed(0)}%; MP going in ${(100 * avg(mp)).toFixed(0)}%; losses ${recs.reduce((t, x) => t + x.lost, 0)} of ${fights}; tonics ${recs.reduce((t, x) => t + x.tonics, 0)}`);
    }
  }
}
main();
