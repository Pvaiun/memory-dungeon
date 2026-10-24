/**
 * The core set's smoke check: plays the documents' own tests (content/core-set/tests.ts)
 * and prints one table. For each encounter, the trio that should beat it and the one that
 * should fail it, each over a few seeds, as a single fresh fight; then each run with the
 * trios that should clear it. Small on purpose: it's for correctness and the ballpark,
 * not balance.
 *
 *   npm run smoke [-- --seeds N] [--runs-only] [--encounters-only] [--only <stage or dungeon>] [--kit best]
 *
 * --kit best dresses every unit in a generic best kit instead of the starting kit: for each slot, the piece
 * whose stats score highest for the class (its main damage stat first, then HP, Armor and the rest), with the
 * weapon's own hit counted. A ceiling to set beside the starting kit's floor, not a build anyone would choose.
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { encounterTests, runTests } from "../content/core-set/tests.js";
import { combat } from "./engine/combat/rules.js";
import { firstOption, play as playRun } from "./engine/run.js";
import { playerView, printLog } from "./engine/log.js";
import { build } from "./sim/content.js";
import { measure, probe } from "./sim/measure.js";
import { everything, gearFor, make } from "./sim/parties.js";
import type { NumT, Party } from "./schema.js";
import { quantile } from "./sim/sure.js";

const args = process.argv.slice(2);
// --log <stage>: print one fight's player log (the encounter's "beats" trio, or --trio a,b,c) and stop.
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const seeds = Number(opt("--seeds") ?? 20);
const only = opt("--only");
const raw = JSON.parse(readFileSync(opt("--pack") ?? "content/core-set.pack.json", "utf8"));
const fights = encounterTests.map((t) => `${t.dungeon}/${t.stage}`);
const c = build(raw, [...new Set(fights)]);
const pr = probe(combat);
const owned = everything(c);
const formation = opt("--formation") ?? c.pack.starter.formations[0];
const kit = opt("--kit") ?? "starting";

/** A generic best kit: per slot, the piece whose stats score highest for the class, each stat counted in gear steps. */
const STEP_OF: Record<string, number> = { crit_chance: 5, evasion: 20, accuracy: 20, double_strike: 25, lifesteal: 15, siphon: 10, crit_multiplier: 50, thorns: 150 };
const stepOf = (stat: string) => STEP_OF[stat] ?? (stat.startsWith("resist:") ? 30 : 1000);
const at = (n: NumT | undefined, base: Record<string, number>) => (typeof n === "number" ? n : n ? (n.base ?? 0) + n.scale.reduce((a, t) => a + t.ratio * (t.stat ? base[t.stat] ?? 0 : 0), 0) : 0);
function dress(party: Party): Party {
  if (kit !== "best") return party;
  for (const u of party.units) {
    const cls = c.classes.get(u.class)!;
    const base: Record<string, number> = cls.stats;
    const main = (base.magic ?? 0) > (base.attack ?? 0) ? "magic" : "attack";
    const weight = (stat: string) => (stat === main ? 3 : stat === "max_hp" ? 2 : stat === "armor" ? 1.5 : stat.startsWith("resist:") ? 0.2 : 1);
    const score = (id: string) => {
      const g = c.pack.gear.find((x) => x.id === id)!;
      let n = 0;
      for (const s of g.stats ?? []) n += (weight(s.stat) * (s.flat ?? 0)) / stepOf(s.stat);
      if (g.weapon) n += (3 * at(g.weapon.amount, base)) / 1000;
      return n;
    };
    for (const slot of ["weapon", "armor", "amulet"]) {
      const best = gearFor(c, u.class, slot).sort((a, b) => score(b) - score(a))[0];
      if (best) u.gear[slot] = best;
    }
  }
  return party;
}

if (opt("--log")) {
  const stage = opt("--log")!;
  const t = encounterTests.find((x) => x.stage === stage) ?? encounterTests.find((x) => x.dungeon === stage);
  const dungeon = t && t.stage === stage ? `${t.dungeon}~${t.stage}` : stage;
  const trio = opt("--trio")?.split(",") ?? t!.beats;
  const party = dress(make(c, owned, trio, formation));
  const run = playRun(c, combat, { dungeon, party, seed: Number(opt("--seed") ?? 1), firstClear: true }, firstOption, { log: true });
  const text = printLog(playerView(run.log!), { hidden: false });
  mkdirSync("out/smoke", { recursive: true });
  writeFileSync(`out/smoke/${stage}.txt`, text + "\n");
  console.log(text);
  process.exit(0);
}

type Row = { label: string; trio: string[]; wins: number; ticks: number; left: number };
function play(dungeon: string, trio: string[]): Row {
  const party = dress(make(c, owned, trio, formation));
  const rs = Array.from({ length: seeds }, (_, i) => measure(c, pr, { dungeon, party, seed: i + 1, firstClear: true }, firstOption));
  const wins = rs.filter((r) => r.won).length;
  const last = rs.map((r) => r.fights.at(-1)!);
  return { label: dungeon, trio, wins, ticks: quantile(last.map((f) => f.rounds), 0.5), left: quantile(rs.filter((r) => !r.won).map((r) => r.fights.at(-1)!.enemyLeft), 0.5) };
}
const pct = (n: number) => `${Math.round((100 * n) / seeds)}%`;
const names = (trio: string[]) => trio.map((id) => c.classes.get(id)!.name).join(", ");

const out: string[] = [];
const say = (s: string) => (console.log(s), out.push(s));

if (!args.includes("--runs-only")) {
  say(`## Encounters, ${seeds} seeds each, fresh fights, ${c.formations.get(formation)!.name} formation, ${kit} kit\n`);
  say("| Encounter | Poses | Beats | wins | ticks | Fails | wins | ticks | Verdict |");
  say("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  let ok = 0, n = 0;
  for (const t of encounterTests) {
    if (only && t.stage !== only && t.dungeon !== only) continue;
    const key = `${t.dungeon}~${t.stage}`;
    const b = play(key, t.beats);
    const f = t.fails ? play(key, t.fails) : null;
    const good = b.wins >= seeds * 0.6 && (!f || f.wins <= b.wins - seeds * 0.3);
    n++;
    if (good) ok++;
    say(`| ${c.dungeons.get(key)!.name} | ${t.poses} | ${names(t.beats)} | ${pct(b.wins)} | ${b.ticks} | ${f ? names(t.fails!) : "–"} | ${f ? pct(f.wins) : "–"} | ${f ? f.ticks : "–"} | ${good ? "ok" : b.wins < seeds * 0.6 ? "BEATS LOSES" : "FAILS WINS"} |`);
  }
  say(`\n${ok} of ${n} encounters behave as the document says (beats trio wins 60%+, fails trio at least 30 points behind).\n`);
}

if (!args.includes("--encounters-only")) {
  say(`## Runs, ${seeds} seeds each, ${kit} kit\n`);
  say("| Run | Clears it | wins | median fights won of total | boss ticks | lost in | party HP into the boss |");
  say("| --- | --- | --- | --- | --- | --- | --- |");
  for (const t of runTests) {
    if (only && t.dungeon !== only) continue;
    for (const trio of t.clears) {
      const party = dress(make(c, owned, trio, formation));
      const rs = Array.from({ length: seeds }, (_, i) => measure(c, pr, { dungeon: t.dungeon, party, seed: i + 1, firstClear: true }, firstOption));
      const wins = rs.filter((r) => r.won).length;
      const total = rs[0].fights.length ? c.dungeons.get(t.dungeon)!.stages.filter((s) => s.kind === "fight").length : 0;
      const won = quantile(rs.map((r) => r.fights.filter((f) => f.won).length), 0.5);
      const boss = rs.filter((r) => r.fights.at(-1)!.boss).map((r) => r.fights.at(-1)!.rounds);
      const lostIn: Record<string, number> = {};
      for (const r of rs) if (!r.won) lostIn[r.fights.at(-1)!.stage] = (lostIn[r.fights.at(-1)!.stage] ?? 0) + 1;
      const into = rs.filter((r) => r.fights.at(-1)!.boss).map((r) => r.fights.at(-1)!.partyStart);
      say(`| ${c.dungeons.get(t.dungeon)!.name} | ${names(trio)} | ${pct(wins)} | ${won} of ${total} | ${boss.length ? quantile(boss, 0.5) : "–"} | ${Object.entries(lostIn).map(([k, v]) => `${k} ${v}`).join(", ") || "–"} | ${into.length ? `${Math.round(100 * quantile(into, 0.5))}%` : "–"} |`);
    }
  }
}
say(`\n${pr.counter.runs.toLocaleString("en")} runs.`);
mkdirSync("out/smoke", { recursive: true });
writeFileSync(kit === "best" ? "out/smoke/smoke-best-kit.md" : "out/smoke/smoke.md", out.join("\n") + "\n");
if (kit === "best") {
  const seen = new Map<string, string>();
  for (const t of [...encounterTests.flatMap((t) => [t.beats, t.fails ?? []]), ...runTests.flatMap((t) => t.clears)])
    for (const u of dress(make(c, owned, t, formation)).units) seen.set(u.class, Object.values(u.gear).map((g) => c.pack.gear.find((x) => x.id === g)!.name).join(", "));
  console.log("\nThe best kit, by class:");
  for (const [cls, g] of [...seen].sort()) console.log(`  ${c.classes.get(cls)!.name}: ${g}`);
}
