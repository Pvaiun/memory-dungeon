/**
 * The rhythm read (steps/05-core-set/5i-synergy, builds.md): does a party play the fight its build says it does? Each trio, with
 * plain weapons, every ability known, no gear, the Neutral formation and cooldowns 60% charged (as a run carries them), plays a
 * few rogue fights at their calibrated knob plus an offset (ungeared parties lose at the real knob). For each trio and fight:
 * the share of the party's damage in each quarter of the fight, the share dealt by its biggest tenth of hits (lumpiness), when
 * the first foe dies and how spread out the kills are (as shares of the fight), the share of the damage it takes in each
 * quarter, its lowest HP, and where its damage comes from (basic attacks, abilities, each status, Thorns, the shatter).
 *
 *   npx tsx src/rhythm-read.ts [--seeds 20] [--off -50] [--trio landslide,toll]
 *
 * Step 4 swaps the trios for the builds' hand-built parties.
 */
import { readFileSync } from "node:fs";
import { advance, loadContent } from "./engine/run.js";
import { combat } from "./engine/combat/rules.js";
import type { Entry } from "./engine/log.js";
import { foesFor, member, newRogue, recruit, rogue, startFight, type FightTier, type RogueRun } from "./rogue.js";

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const SEEDS = Number(opt("--seeds") ?? 20);
const OFF = Number(opt("--off") ?? -50);
const c = loadContent(JSON.parse(readFileSync("content/core-set.pack.json", "utf8")));
const R = rogue(c);

/** Each build's nearest party with today's classes (builds.md, its first route or closest). */
const TRIOS: Record<string, string[]> = {
  landslide: ["knight", "geomancer", "hoplite"],
  bonfire: ["knight", "pyromancer", "hexer"],
  coldsnap: ["ranger", "frostweaver", "hexer"],
  lockdown: ["knight", "hexer", "monk"],
  hunt: ["valkyrie", "ranger", "assassin"],
  harvest: ["bramble_knight", "stormcaller", "bard"],
  cuts: ["monk", "assassin", "bard"],
  toll: ["bramble_knight", "cleric", "stormcaller"],
  ambush: ["assassin", "geomancer", "ranger"],
  phoenix: ["valkyrie", "cleric", "assassin"],
  blood: ["vampire", "cleric", "monk"],
  overflow: ["bard", "hexer", "frostweaver"],
};
const ONLY = opt("--trio")?.split(",") ?? Object.keys(TRIOS);

/** A swarm, a mixed group with a Taunting front, an armored pack, a pack that raises its dead, and two bosses. */
const FIGHTS: [region: string, fight: string, pool: "normal" | "elite" | "bosses"][] = [
  ["old_road", "wolf_pack", "normal"],
  ["old_road", "bandit_camp", "normal"],
  ["crypt", "bone_yard", "normal"],
  ["crypt", "ghoul_pit", "elite"],
  ["old_road", "ogre_chief", "bosses"],
  ["fire_mine", "fire_giant", "bosses"],
];

function setup(trio: string[], seed: number): RogueRun {
  const run = newRogue(c, { seed, leader: trio[0] });
  run.roster = []; run.party = [];
  for (const cls of trio) recruit(c, run, cls);
  for (const cls of trio) {
    const m = member(run, cls);
    m.known = [...c.classes.get(cls)!.abilities];
    m.order = [...m.known];
    m.cooldowns = Object.fromEntries(m.known.map((id) => [id, 0.4 * (c.abilities.get(id)?.cooldown ?? 0)]));
  }
  return run;
}

/** Where a piece of damage on a foe came from. */
function source(e: Entry): string {
  const src = String(e.src);
  if (e.part === "hit") return c.abilities.has(src) ? "ability" : "basic";
  if (src === "chill") return "shatter";
  return src;
}

const pct = (x: number, n: number) => Math.round((100 * x) / Math.max(1, n));
const lines: string[] = [];
for (const key of ONLY) {
  const trio = TRIOS[key];
  for (const [reg, fid, pool] of FIGHTS) {
    const fight = R.regions.find((x) => x.id === reg)![pool].find((f) => f.id === fid)!;
    const tier: FightTier = pool === "bosses" ? "boss" : pool === "elite" ? "elite" : "fight";
    let won = 0, ticks = 0, top10 = 0, low = 0, first = 0, spread = 0, multi = 0;
    const q = [0, 0, 0, 0], danger = [0, 0, 0, 0], src: Record<string, number> = {};
    for (let i = 0; i < SEEDS; i++) {
      const seed = 5000 + i;
      const run = setup(trio, seed);
      run.pending = { kind: "fight", node: "read", tier, fight, foes: foesFor(c, tier, (fight.knob ?? 0) + OFF), seed };
      const er = startFight(c, run, { log: true });
      advance(c, combat, er);
      const log = er.log as Entry[];
      const side = new Map<string, string>(), max = new Map<string, number>(), hp = new Map<string, number>();
      const meet = (u: { id: string; side: string; max: number; hp: number }) => { side.set(u.id, u.side); max.set(u.id, u.max); hp.set(u.id, u.hp); };
      for (const u of (log.find((e) => e.t === "fight_start")?.units ?? []) as { id: string; side: string; max: number; hp: number }[]) meet(u);
      const party = [...side].filter(([, s]) => s === "party").map(([id]) => id);
      const T = Math.max(1, Number(log.find((e) => e.t === "fight_end")?.rounds ?? 0));
      const quarter = (at: number) => Math.min(3, Math.floor((at / T) * 4));
      const dealt: { at: number; amt: number; src: string }[] = [], kills: number[] = [], taken = [0, 0, 0, 0];
      let lowest = 1;
      for (const e of log) {
        if (e.t === "join") meet(e.unit as { id: string; side: string; max: number; hp: number });
        if (e.t !== "dmg") continue;
        const at = Number(e.at) / 1000, tgt = String(e.target), before = hp.get(tgt) ?? 0, after = Number(e.hp);
        hp.set(tgt, after);
        const real = Math.max(0, Math.min(Number(e.amount) || 0, before));
        if (side.get(tgt) === "enemy") {
          dealt.push({ at, amt: real, src: source(e) });
          if (before > 0 && after <= 0) kills.push(at);
        } else {
          taken[quarter(at)] += real;
          lowest = Math.min(lowest, party.reduce((s, id) => s + Math.max(0, hp.get(id) ?? 0), 0) / party.reduce((s, id) => s + (max.get(id) ?? 0), 0));
        }
      }
      const total = dealt.reduce((s, d) => s + d.amt, 0) || 1;
      if (er.outcome === "won") won++;
      ticks += T;
      for (const d of dealt) { q[quarter(d.at)] += d.amt / total; src[d.src] = (src[d.src] ?? 0) + d.amt / total; }
      const sizes = dealt.map((d) => d.amt).filter((x) => x > 0).sort((a, b) => b - a);
      top10 += sizes.slice(0, Math.max(1, Math.ceil(sizes.length / 10))).reduce((s, x) => s + x, 0) / total;
      if (kills.length >= 2) { multi++; first += kills[0] / T; spread += (kills[kills.length - 1] - kills[0]) / T; }
      const tt = taken.reduce((s, x) => s + x, 0) || 1;
      taken.forEach((x, j) => (danger[j] += x / tt));
      low += lowest;
    }
    const from = Object.entries(src).filter(([, v]) => v / SEEDS >= 0.04).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${pct(v, SEEDS)}`).join(", ");
    lines.push(
      `${key.padEnd(9)} ${fid.padEnd(12)} won ${String(pct(won, SEEDS)).padStart(3)}% ${(ticks / SEEDS).toFixed(0).padStart(4)}t` +
        ` | damage by quarter ${q.map((x) => pct(x, SEEDS)).join("/")} | top tenth ${pct(top10, SEEDS)}%` +
        ` | first kill ${multi ? pct(first, multi) : "-"}%, spread ${multi ? pct(spread, multi) : "-"}%` +
        ` | taken by quarter ${danger.map((x) => pct(x, SEEDS)).join("/")}, low ${pct(low, SEEDS)}% | ${from}`,
    );
  }
  lines.push("");
}
console.log(lines.join("\n"));
