/**
 * The exchange rate between a stat step and a swing step, class by class (docs/core-set/rules-and-vocabulary.md, Weapons): what
 * "a step fewer" buys in swing. For each class, its plain weapon alone against the same weapon carrying one stat step (Attack,
 * HP, Defense, and its first kind's signature stat where that's a special stat), and against the same weapon swinging a step
 * harder (scale.ts SWING_TRADE) or a tenth harder, on the balance sheet's probe fights (free play's runs and the rogue's bosses
 * at their knobs), the same kitted companions and seeds for every probe. Prints, per class and probe, the win points against
 * the bare weapon and the change in the class's damage dealt and damage taken a tick alive.
 *
 *   npx tsx tools/swing-rate.ts [--trios 3] [--classes knight,hoplite] [--seeds 1]
 */
import { readFileSync } from "node:fs";
import { loadContent } from "../src/engine/run.js";
import { KIND_WORDS, SWING_TRADE, swingOf } from "../content/core-set/scale.js";
import { critStep, sp, st } from "../content/core-set/pieces/kit.js";
import type { GearT, Party } from "../src/schema.js";
import { makeBuild, slotted } from "../src/sim/kits.js";
import { fightSets, get, partySpread, type Tally } from "./balance/plays.js";
import { runJob } from "./balance/tally.js";

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const TRIOS = Number(opt("--trios") ?? 3);
const SEEDS = Array.from({ length: Number(opt("--seeds") ?? 1) }, (_, i) => 31 + i);

/** The signature stat of each kind, as a gear step (an amount stat's step, Crit chance's, or a special stat at medium). */
const SIGNATURE: Record<string, () => GearT["stats"]> = {
  dagger: () => [critStep(1)], fist: () => [sp("double_strike", "medium")], wand: () => [sp("cooldown", "medium")], sword: () => [st("attack", 1)],
  spear: () => [st("aggro", 1)], axe: () => [sp("lifesteal", "medium")], bow: () => [sp("crit_damage", "medium")], rune_sword: () => [st("mp_regen", 1)],
  hammer: () => [st("defense", 1)], mace: () => [st("max_hp", 1)], staff: () => [sp("cast_speed", "medium")], great_weapon: () => [st("attack", 1)],
};

const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8")) as { gear: GearT[]; classes: { id: string; weapons: string[] }[] };
/** The probes, as synthetic weapons of each kind added to the pack: the plain swing with a step, or a harder swing. */
const probes: { id: string; label: string; kind: string }[] = [];
const scaled = (kind: string, m: number) => { const n = swingOf(kind) as Exclude<ReturnType<typeof swingOf>, number>; return { base: Math.round((n.base ?? 0) * m), scale: n.scale.map((t) => ({ ...t, ratio: t.ratio * m })) }; };
for (const kind of Object.keys(KIND_WORDS)) {
  const plain = raw.gear.find((g) => g.slot === "weapon" && g.source === "starter" && g.weapon?.kind === kind)!;
  const add = (suffix: string, label: string, g: Partial<GearT>) => {
    const id = `probe_${kind}_${suffix}`;
    raw.gear.push({ ...plain, id, name: `${plain.name} (${label})`, source: "drop", ...g });
    probes.push({ id, label, kind });
  };
  add("attack", "Attack +1", { stats: [st("attack", 1)] });
  add("hp", "HP +1", { stats: [st("max_hp", 1)] });
  add("defense", "Defense +1", { stats: [st("defense", 1)] });
  const sig = SIGNATURE[kind]();
  if (!["attack", "max_hp", "defense"].includes(sig![0].stat)) add("signature", `signature (${sig![0].stat})`, { stats: sig });
  add("swing", `swing ×${SWING_TRADE}`, { weapon: { ...plain.weapon!, amount: scaled(kind, SWING_TRADE) } });
  add("tenth", "swing ×1.1", { weapon: { ...plain.weapon!, amount: scaled(kind, 1.1) } });
}
const c = loadContent(raw);
const fights = fightSets(c, ["rogue", "free"]).filter((f) => f.probe);
const { trios } = partySpread(c, 48);
const classes = (opt("--classes")?.split(",") ?? c.pack.classes.map((k) => k.id));
const neutral = c.formations.get("neutral")!;

type Row = { win: number; dmg: number; taken: number; runs: number };
function measure(cls: string, weapon: string): Row {
  const t: Tally = {};
  const mine = trios.filter((x) => x.includes(cls)).slice(0, TRIOS);
  for (const trio of mine) {
    const kit = makeBuild(c, trio, "neutral", "plain");
    if (!kit) continue;
    const units = trio.map((k, j) => (k !== cls ? { ...kit.units.find((u) => u.class === k)!, position: neutral.positions[j].id } : { class: k, position: neutral.positions[j].id, abilities: slotted(c, k, "doc"), gear: { weapon } }));
    const party: Party = { formation: "neutral", units };
    for (const f of fights) { const o = runJob(c, { set: "probe", dungeon: f.dungeon, party, kind: "probe", seeds: SEEDS }); for (const k in o) t[k] = (t[k] ?? 0) + o[k]; }
  }
  const fightsN = get(t, `cls|${cls}|fights|mob`) + get(t, `cls|${cls}|fights|boss`);
  return { win: get(t, "won") / Math.max(1, get(t, "runs")), dmg: get(t, `cls|${cls}|dmg`) / Math.max(1, fightsN), taken: get(t, `cls|${cls}|taken`) / Math.max(1, get(t, `cls|${cls}|alive`)), runs: get(t, "runs") };
}

const pct = (x: number) => `${x >= 0 ? "+" : ""}${(100 * x).toFixed(1)}`;
console.log(`Each class's plain weapon alone (its companions kitted, in Neutral) on ${fights.length} probe fights × ${TRIOS} trios × ${SEEDS.length} seed(s); each probe against it: win points, the class's damage dealt a fight, its damage taken a tick alive.\n`);
for (const cls of classes) {
  const k = c.classes.get(cls)!;
  const kind = k.weapons[0];
  const plain = c.pack.gear.find((g) => g.slot === "weapon" && g.source === "starter" && g.weapon?.kind === kind)!.id;
  const base = measure(cls, plain);
  console.log(`${k.name} (${kind}, ${KIND_WORDS[kind].swing} ${KIND_WORDS[kind].scaling} ${KIND_WORDS[kind].budget}): plain wins ${(100 * base.win).toFixed(0)}% of ${base.runs}`);
  for (const p of probes.filter((x) => x.kind === kind)) {
    const r = measure(cls, p.id);
    console.log(`  ${p.label.padEnd(26)} win ${pct(r.win - base.win).padStart(6)} pts   dmg ${pct(r.dmg / Math.max(1, base.dmg) - 1).padStart(6)}%   taken ${pct(r.taken / Math.max(1, base.taken) - 1).padStart(6)}%`);
  }
}
