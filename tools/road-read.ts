/**
 * The road read: what today's regular fights and elites cost each hand-built roster (tools/rogue-parties.ts) at the knobs a
 * run meets on each pool's reference floor. It measures; it doesn't tune. For each fight, each roster fields a good three
 * of five as the calibration does (the trio a quarter down the ranking, on other dice), then plays it on fixed seeds from
 * full HP (MP as the level sets it). It prints, by act and tier, each roster's mean cost (the share of the party's HP lost,
 * net of healing, a loss counting all of it), how many of its fights cost under 5% ("free"), how many it lost, the MP its wins spent (a share of
 * the party's max MP), and in its wins the lowest any member fell (a share of its max HP; a fall is 0): the danger a
 * fight shows, which healing hides from the cost.
 *
 *   npx tsx tools/road-read.ts [--acts 1,2,3] [--tiers normal,elite] [--seeds 3] [--pack path] [--without cleric]
 */
import { readFileSync } from "node:fs";
import { advance, loadContent, type Content } from "../src/engine/run.js";
import { combat } from "../src/engine/combat/rules.js";
import { autoFight, endFight, foesFor, rogue, startFight, type RogueRun } from "../src/rogue.js";
import { hpShare, mpShare } from "../src/sim/rogue-ai.js";
import { LEVELS, PICK, ROSTERS, buildRoster, trios, type Tier } from "./rogue-parties.js";
import type { RogueFightT } from "../src/schema.js";

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const c: Content = loadContent(JSON.parse(readFileSync(opt("--pack") ?? "content/core-set.pack.json", "utf8")));
const acts = (opt("--acts") ?? "1,2,3").split(",").map(Number);
const tiers = (opt("--tiers") ?? "normal,elite").split(",") as Tier[];
const seeds = Number(opt("--seeds") ?? 3);
/** `--without cleric`: that class never fights (its roster's trios leave it out), to price what it brings. */
const without = opt("--without");

/**
 * One fight against a party made whole (MP as it is), at knob k: the HP share it costs (1 when lost), the MP share it
 * spent, and (with `low`) the lowest any member fell during it, as a share of its max HP (0 when it fell).
 */
function trial(run0: RogueRun, fight: RogueFightT, k: number, tier: Tier, seed: number, low = false) {
  const run = structuredClone(run0);
  for (const m of run.roster) (m.missHp = 0), (m.ko = false);
  const mp0 = mpShare(c, run);
  const t = tier === "elite" ? "elite" : "fight";
  run.pending = { kind: "fight", node: "read", tier: t, fight: { ...fight, knob: undefined }, foes: foesFor(c, t, k), seed };
  let min = 1;
  if (low) {
    const er = startFight(c, run, { log: true });
    advance(c, combat, er);
    const log = er.log! as { t: string; [k: string]: any }[];
    let i = 0;
    while (log[i].t !== "fight_start") i++;
    const max = new Map<string, number>();
    for (const u of log[i].units) if (u.side === "party") max.set(u.id, u.max), (min = Math.min(min, u.hp / u.max));
    for (; i < log.length; i++) {
      const e = log[i];
      if ((e.t === "dmg" || e.t === "heal") && max.has(e.target) && typeof e.hp === "number") min = Math.min(min, e.hp / max.get(e.target)!);
      if (e.t === "down" && max.has(e.unit)) min = 0;
    }
    endFight(c, run, er);
  } else autoFight(c, run);
  const after = run.pending as RogueRun["pending"];
  const lost = after.kind === "over" && !after.won;
  return { cost: lost ? 1 : 1 - hpShare(c, run), lost, mp: lost ? 0 : mp0 - mpShare(c, run), low: lost ? 0 : min };
}

const offset = (region: string, tier: Tier) => {
  const reg = rogue(c).regions.find((g) => g.id === region)!;
  const kn = rogue(c).config.knobs[reg.act - 1];
  return tier === "elite" ? kn.elite + reg.knob.elite : kn.mob + reg.knob.mob;
};

for (const act of acts) for (const tier of tiers) {
  const per = new Map<string, { cost: number; free: number; lost: number; n: number; mp: number; won: number; low: number }>();
  const byFight: string[] = [];
  for (const reg of rogue(c).regions.filter((r) => r.act === act)) for (const fight of reg[tier as "normal" | "elite"]) {
    const k = (fight.knob ?? 0) + offset(reg.id, tier);
    let fc = 0, fn = 0;
    ROSTERS.forEach((ro, ri) => {
      const run = buildRoster(c, ro, act, tier);
      const ranked = trios(ro, LEVELS[act][tier].roster ?? 5, run.formation).filter((t) => !without || !t.includes(without)).map((trio) => {
        run.party = trio;
        return { trio, cost: trial(run, fight, k, tier, 1000 + ri * 7).cost };
      }).sort((a, b) => a.cost - b.cost);
      run.party = ranked[Math.round((ranked.length - 1) * PICK)].trio;
      const s = per.get(ro.id) ?? { cost: 0, free: 0, lost: 0, n: 0, mp: 0, won: 0, low: 0 };
      for (let i = 0; i < seeds; i++) {
        const x = trial(run, fight, k, tier, 7919 * (i + 1) + 13, true);
        s.cost += x.cost; s.n++; s.lost += x.lost ? 1 : 0; s.free += x.cost < 0.05 ? 1 : 0; if (!x.lost) (s.mp += x.mp), (s.low += x.low), s.won++;
        fc += x.cost; fn++;
      }
      per.set(ro.id, s);
    });
    byFight.push(`${reg.id}/${fight.id} ${Math.round((100 * fc) / fn)}%`);
  }
  const all = [...per.values()].reduce((t, s) => ({ cost: t.cost + s.cost, free: t.free + s.free, lost: t.lost + s.lost, n: t.n + s.n, mp: t.mp + s.mp, won: t.won + s.won, low: t.low + s.low }), { cost: 0, free: 0, lost: 0, n: 0, mp: 0, won: 0, low: 0 });
  const pc = (x: number, n: number) => `${Math.round((100 * x) / n)}%`.padStart(4);
  console.log(`\n── act ${act}, ${tier}: mean cost ${pc(all.cost, all.n)}, free ${pc(all.free, all.n)}, lost ${pc(all.lost, all.n)}, MP spent ${pc(all.mp, all.won)}, lowest member ${pc(all.low, all.won)} (${all.n} fights)`);
  for (const [id, s] of [...per].sort((a, b) => a[1].cost - b[1].cost)) console.log(`  ${id.padEnd(14)} cost ${pc(s.cost, s.n)}  free ${pc(s.free, s.n)}  lost ${pc(s.lost, s.n)}  MP spent ${pc(s.mp, s.won)}  lowest member ${pc(s.low, s.won)}`);
  console.log(`  by fight: ${byFight.join(", ")}`);
}
