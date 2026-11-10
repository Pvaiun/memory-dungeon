/**
 * The step's scratch, not a tool: the measurement behind design.md's *Open problem*. It goes when the step closes.
 *
 * The design's 27 routes (and three with the wall swapped out, and the starters), each built by the calibration's rule
 * (`tools/rogue-parties.ts`: abilities known, gear and legendaries by act, in Neutral) at eight points of a run, against
 * the rogue's own fights at their knobs plus a shift. It prints, for the routes with a wall (a Knight, Bramble knight or
 * Paladin), with a heavy body and no wall (a Hoplite or Geomancer) and with neither: the share of fights won at each shift,
 * the shift at which a group stops winning three in four, and the share of wins with someone down.
 *
 *   npx tsx steps/builds/tankless.ts [--variant base] [--shifts 0,25,50,75,100,125,150,175,200] [--reps 3] [--seeds 3] [--workers 4]
 *
 * Variants, each a patch to the pack in memory:
 *   base        today's game
 *   bodies      no class under HP 3 and Defense 2
 *   kits        every act I party knows all three abilities
 *   flat        foes' picks ignore Aggro
 *   shed        a hurt unit draws less: half below 60% of its HP, a quarter below 30%
 *   healthiest  foes' swings go to the party member with the largest share of its HP left
 *   poolknob    one knob a pool (its fights' mean) in place of one a fight
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { fileURLToPath } from "node:url";
import { advanceOnce, loadContent, type Content } from "../../src/engine/run.js";
import type { Entry } from "../../src/engine/log.js";
import { combat } from "../../src/engine/combat/rules.js";
import { foesFor, knobFor, refFloors, rogue, startFight, type FightTier, type RogueRun } from "../../src/rogue.js";
import { buildRoster, LEVELS, type Roster } from "../../tools/rogue-parties.js";

const args = process.argv.slice(2);
const opt = (name: string, d: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : d; };
const VARIANT = opt("--variant", "base");
const SHIFTS = opt("--shifts", "0,25,50,75,100,125,150,175,200").split(",").map(Number);
const REPS = Number(opt("--reps", "3"));
const SEEDS = Number(opt("--seeds", "3"));
const WORKERS = Number(opt("--workers", String(Math.min(4, availableParallelism()))));
const PART = args.includes("--part") ? opt("--part", "0/1").split("/").map(Number) : null;

// ─── The trios ──────────────────────────────────────────────────────────────

type Tag = "wall" | "heavy" | "none";
const WALLS = ["knight", "bramble_knight", "paladin"], HEAVY = ["hoplite", "geomancer"];
const tagOf = (cs: string[]): Tag => (cs.some((x) => WALLS.includes(x)) ? "wall" : cs.some((x) => HEAVY.includes(x)) ? "heavy" : "none");
const T = (road: string, ...classes: string[]) => ({ id: `${road}:${classes.join("+")}`, road, classes, tag: tagOf(classes) });
/** design.md's routes, three a road; then the roads that lean on a wall with it swapped out (`swap-`), and the starters. */
const TRIOS = [
  T("landslide", "geomancer", "knight", "hoplite"), T("landslide", "geomancer", "paladin", "bard"), T("landslide", "knight", "hoplite", "bard"),
  T("cuts", "vampire", "assassin", "monk"), T("cuts", "bramble_knight", "assassin", "ranger"), T("cuts", "valkyrie", "ranger", "vampire"),
  T("bonfire", "knight", "pyromancer", "monk"), T("bonfire", "paladin", "hexer", "pyromancer"), T("bonfire", "paladin", "monk", "hexer"),
  T("snap", "frostweaver", "hexer", "ranger"), T("snap", "knight", "frostweaver", "monk"), T("snap", "hexer", "ranger", "geomancer"),
  T("storm", "hoplite", "stormcaller", "valkyrie"), T("storm", "knight", "stormcaller", "monk"), T("storm", "valkyrie", "hexer", "bard"),
  T("hunt", "paladin", "assassin", "stormcaller"), T("hunt", "hoplite", "valkyrie", "ranger"), T("hunt", "assassin", "ranger", "valkyrie"),
  T("toll", "bramble_knight", "cleric", "stormcaller"), T("toll", "knight", "hexer", "hoplite"), T("toll", "monk", "valkyrie", "bard"),
  T("barrage", "knight", "bard", "pyromancer"), T("barrage", "frostweaver", "bard", "stormcaller"), T("barrage", "cleric", "vampire", "geomancer"),
  T("pact", "vampire", "valkyrie", "cleric"), T("pact", "vampire", "bard", "hoplite"), T("pact", "assassin", "paladin", "monk"),
  T("swap-bonfire", "hexer", "pyromancer", "monk"), T("swap-storm", "valkyrie", "stormcaller", "monk"), T("swap-barrage", "cleric", "bard", "pyromancer"),
  T("starters", "knight", "cleric", "ranger"),
];
const ALL = [...new Set(TRIOS.flatMap((t) => t.classes))];

// ─── The stages: a power level (`LEVELS`) and the fights it meets ───────────

type Stage = { id: string; act: number; level: "easy" | "early" | "normal" | "elite" | "boss"; pool: "easy" | "normal" | "elite" | "bosses"; floor: number | "normal" | "elite" };
const STAGES: Stage[] = [
  { id: "start", act: 1, level: "easy", pool: "easy", floor: 2 },
  { id: "early", act: 1, level: "early", pool: "normal", floor: 5 },
  { id: "mid1", act: 1, level: "normal", pool: "normal", floor: "normal" },
  { id: "elite1", act: 1, level: "elite", pool: "elite", floor: "elite" },
  { id: "boss1", act: 1, level: "boss", pool: "bosses", floor: 13 },
  { id: "mid2", act: 2, level: "normal", pool: "normal", floor: "normal" },
  { id: "elite2", act: 2, level: "elite", pool: "elite", floor: "elite" },
  { id: "boss2", act: 2, level: "boss", pool: "bosses", floor: 13 },
];
const GROUPS: Record<string, string[]> = { "act I's fights and elites": ["start", "early", "mid1", "elite1"], "act I's boss": ["boss1"], "act II's fights and elites": ["mid2", "elite2"], "act II's bosses": ["boss2"] };

type Rec = { trio: string; road: string; tag: Tag; stage: string; fight: string; shift: number; won: boolean; fallen: number; hpLost: number; first: string | null };

// ─── A worker: its share of the trios, every stage and shift ────────────────

/** The pack with the variant's patch. */
function content(): Content {
  const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));
  if (VARIANT === "bodies") for (const k of raw.classes) { k.stats.max_hp = Math.max(k.stats.max_hp, 3000); k.stats.defense = Math.max(k.stats.defense, 2000); }
  if (VARIANT === "kits") for (const k of ["easy", "early", "normal", "elite", "boss"] as const) { const lv = LEVELS[1][k]!; lv.known = 3; lv.random = false; }
  if (VARIANT === "flat") raw.ruleset.partyDraw = { centre: 100, double: 100000, floor: 25, cap: 200 };
  if (VARIANT === "healthiest") {
    raw.statuses.push({ id: "x_healthiest", name: "x", text: "x", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, aim: { rule: { side: "foes", pick: "highest", by: "hp_share" } } });
    for (const e of raw.enemies) e.statuses = [...(e.statuses ?? []), "x_healthiest"];
  }
  if (VARIANT === "shed") {
    const hurt = (id: string) => ({ id, name: "x", text: "x", label: "buff", show: "sheet", stacking: "fizzle", unremovable: true, stats: [{ stat: "aggro", flat: -25 }] });
    raw.statuses.push(hurt("x_hurt1"), hurt("x_hurt2"), { id: "x_shed", name: "x", text: "x", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [
      { on: { event: "hp_lost" }, do: [{ op: "apply", status: "x_hurt1", to: { side: "self", where: { hpBelow: 60 } } }, { op: "apply", status: "x_hurt2", to: { side: "self", where: { hpBelow: 30 } } }] },
      { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: "x_hurt1", to: { side: "self", where: { hpAtLeast: 60 } } }, { op: "remove", label: "buff", status: "x_hurt2", to: { side: "self", where: { hpAtLeast: 30 } } }] },
    ] });
    for (const k of raw.classes) k.passive.statuses = [...k.passive.statuses, "x_shed"];
  }
  if (VARIANT === "poolknob") for (const reg of raw.rogue.regions) for (const pool of ["easy", "normal", "elite", "bosses"]) {
    const m = Math.round(reg[pool].reduce((t: number, f: { knob?: number }) => t + (f.knob ?? 0), 0) / reg[pool].length);
    for (const f of reg[pool]) f.knob = m;
  }
  return loadContent(raw);
}

function work(part: number, parts: number): Rec[] {
  const c = content();
  const ref = refFloors(c);
  const recs: Rec[] = [];
  TRIOS.forEach((trio, ti) => {
    if (ti % parts !== part) return;
    const bench = ALL.filter((x) => !trio.classes.includes(x)).slice(0, 2);
    for (const st of STAGES) for (let rep = 0; rep < REPS; rep++) {
      // Each build of a trio rolls its own gear and legendaries (and, at a real start, its own abilities).
      const roster: Roster = { id: `${trio.id}#${rep}`, note: "", classes: [...trio.classes, ...bench] as Roster["classes"], formation: "neutral", legendaries: [] };
      const run0 = buildRoster(c, roster, st.act, st.level, rep);
      const tier: FightTier = st.pool === "bosses" ? "boss" : st.pool === "elite" ? "elite" : "fight";
      const floor = typeof st.floor === "number" ? st.floor : ref[st.floor];
      for (const reg of rogue(c).regions.filter((r) => r.act === st.act)) for (const fight of reg[st.pool]) {
        const knob = knobFor(c, { act: st.act, region: reg.id, heat: 0 } as unknown as RogueRun, tier, floor, fight);
        for (const shift of SHIFTS) for (let s = 0; s < SEEDS; s++) {
          const run = structuredClone(run0);
          run.pending = { kind: "fight", node: "x", tier, fight: { ...fight, knob: undefined }, foes: foesFor(c, tier, knob + shift), seed: 7919 * (rep * 31 + s + 1) + 13 };
          const er = startFight(c, run, { log: true });
          const start = (er.party as { ref: string; hp: number; stats: { max_hp: number } }[]).map((m) => ({ ref: m.ref, hp: m.hp }));
          for (let i = 0; !er.outcome; i++) { advanceOnce(c, combat, er); if (i > 5e6) throw new Error("a fight never ended"); }
          const log = er.log as Entry[];
          const ids = ((log.find((e) => e.t === "fight_start")?.units ?? []) as { id: string; side: string }[]).filter((u) => u.side === "party").map((u) => u.id);
          const down = log.find((e) => e.t === "down" && ids.includes(String(e.unit)));
          const ms = er.party as { hp: number; stats: { max_hp: number } }[];
          const max = ms.reduce((t, m) => t + m.stats.max_hp, 0);
          recs.push({
            trio: trio.id, road: trio.road, tag: trio.tag, stage: st.id, fight: fight.id, shift, won: er.outcome === "won", fallen: ms.filter((m) => m.hp <= 0).length,
            hpLost: (start.reduce((t, m) => t + m.hp, 0) - ms.reduce((t, m) => t + Math.max(0, m.hp), 0)) / max, first: down ? start[ids.indexOf(String(down.unit))].ref : null,
          });
        }
      }
    }
  });
  return recs;
}

// ─── The read ───────────────────────────────────────────────────────────────

function read(recs: Rec[]) {
  const routes = recs.filter((r) => !r.road.startsWith("swap") && r.road !== "starters");
  const pct = (x: number) => String(Math.round(100 * x)).padStart(4);
  console.log(`variant ${VARIANT}: ${recs.length} fights; shifts ${SHIFTS.join(" ")}`);
  for (const [g, stages] of Object.entries(GROUPS)) {
    console.log(`\n${g}`);
    for (const tag of ["wall", "heavy", "none"] as Tag[]) {
      // Each stage of a group weighs the same.
      const at = (shift: number, f: (rs: Rec[]) => number) => stages.reduce((t, st) => t + f(routes.filter((r) => r.stage === st && r.tag === tag && r.shift === shift)), 0) / stages.length;
      const win = SHIFTS.map((sh) => at(sh, (rs) => rs.filter((r) => r.won).length / Math.max(1, rs.length)));
      const fall = SHIFTS.map((sh) => at(sh, (rs) => rs.filter((r) => r.won && r.fallen > 0).length / Math.max(1, rs.filter((r) => r.won).length)));
      let breaks = win[win.length - 1] >= 0.75 ? `past +${SHIFTS[SHIFTS.length - 1]}` : `under +${SHIFTS[0]}`;
      for (let i = 0; i + 1 < SHIFTS.length; i++) if (win[i] >= 0.75 && win[i + 1] < 0.75) breaks = `+${Math.round(SHIFTS[i] + ((win[i] - 0.75) / (win[i] - win[i + 1])) * (SHIFTS[i + 1] - SHIFTS[i]))}`;
      console.log(`  ${tag.padEnd(6)} won % ${win.map(pct).join("")}   three in four until ${breaks.padStart(9)}   wins with someone down % ${fall.map(pct).join("")}`);
    }
  }
}

if (PART) process.stdout.write(JSON.stringify(work(PART[0], PART[1])));
else {
  const file = fileURLToPath(import.meta.url);
  const parts = Array.from({ length: WORKERS }, (_, i) => new Promise<Rec[]>((resolve, reject) => {
    const child = spawn("npx", ["tsx", file, ...args, "--part", `${i}/${WORKERS}`], { stdio: ["ignore", "pipe", "inherit"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (code) => (code === 0 ? resolve(JSON.parse(out)) : reject(new Error(`a worker failed (${code})`))));
  }));
  void Promise.all(parts).then((all) => read(all.flat()));
}
