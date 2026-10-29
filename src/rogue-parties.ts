/**
 * Step 5h (the director's): tuning on hand-built, representative parties instead of the simulated player's snapshots. A
 * rules-of-thumb player can't come near a human who builds well, so each fight is measured against rosters a careful
 * player could have at that point of a run.
 *
 * A roster is five classes (three fighting, two on the bench), a formation with a seat order, and the legendary pieces it
 * builds around, all picked by hand (below). What changes with the act and the fight's tier is the power level: how many
 * abilities each member knows and how many are upgraded, the rarity of its ordinary gear and how many of its legendaries it
 * has found (`LEVELS`). A fractional `known` means some members know one more: 1.4 is two of the five on their second ability. Ordinary gear is filled by a stated rule: each member is offered six pieces of the level's rarity
 * it can wear, and the gear scorer equips the best (a pick of three, twice); the legendaries go to the member each is for.
 *
 *   npx tsx src/rogue-parties.ts      writes steps/05-core-set/5h-roster/parties.md, every roster at every level
 */
import type { Content } from "./engine/run.js";
import { rngFor, shuffle } from "./engine/rng.js";
import { canEquip } from "./validate.js";
import { equip, itemGear, member, newItem, newRogue, recruit, registerGear, rogue, rollItem, rollKnown, seat, setFormation, upgraded, type RogueRun, type Slot } from "./rogue.js";
import { kitUp } from "./rogue-ai.js";
import type { RarityT } from "./schema.js";

export type Tier = "easy" | "normal" | "elite" | "boss";
export type Roster = {
  id: string;
  /** What the build is about, in a line. */
  note: string;
  /** Three fighting, in seat order for the formation, then two on the bench (the order is also who's preferred in). */
  classes: [string, string, string, string, string];
  formation: string;
  /** Legendary pieces, each for a member of the roster, in the order a run finds them. */
  legendaries: { piece: string; for: string }[];
};

/** Each class's ability order: what it learns first and slots first. */
export const ORDER: Record<string, string[]> = {
  knight: ["stand_fast", "shield_bash", "fortify"],
  cleric: ["cure", "renew", "raise"],
  ranger: ["barbed_arrow", "rending_arrow", "frost_arrow"],
  bramble_knight: ["thicket", "bramble_lash", "regrowth"],
  hoplite: ["paired_guard", "spear_thrust", "aspis"],
  paladin: ["absolve", "smite", "sanctuary"],
  valkyrie: ["gale_spear", "rally", "valhalla"],
  bard: ["war_ballad", "allegro", "thunder_chord"],
  hexer: ["enfeeble", "malison", "unmake"],
  monk: ["burning_fist", "flow", "pressure_point"],
  assassin: ["backstab", "vanish", "garrote"],
  vampire: ["blood_drain", "frenzy", "blood_gift"],
  pyromancer: ["firebolt", "fireball", "pyre"],
  frostweaver: ["frost_lance", "blizzard", "stillness"],
  stormcaller: ["chain_lightning", "thunderstorm", "static_charge"],
  geomancer: ["earthen_shell", "rockfall", "tremor"],
};

/** Twelve rosters, every class fighting in at least one and most in two or three, each built around something. */
export const ROSTERS: Roster[] = [
  { id: "wall-fire", note: "A wall, a Burn caster and a healer; a Ranger and a Monk to rotate in.", classes: ["knight", "pyromancer", "cleric", "ranger", "monk"], formation: "vanguard", legendaries: [{ piece: "ember_sigil", for: "pyromancer" }, { piece: "herald_horn", for: "cleric" }, { piece: "cornerstone_axe", for: "knight" }] },
  { id: "chill-engine", note: "The director's build: Chill on the Monk's and Bard's basic attacks, paid off by the Frostweaver's Brittle.", classes: ["monk", "frostweaver", "bard", "hexer", "valkyrie"], formation: "scatter", legendaries: [{ piece: "rime_sigil", for: "monk" }, { piece: "frostfang", for: "bard" }, { piece: "frost_shard", for: "frostweaver" }] },
  { id: "thorns", note: "A thorns wall draws everything; the Assassin and Vampire cash in the Bleed.", classes: ["bramble_knight", "assassin", "vampire", "cleric", "hoplite"], formation: "vanguard", legendaries: [{ piece: "thornheart_plate", for: "bramble_knight" }, { piece: "wound_sigil", for: "assassin" }, { piece: "vampires_tooth", for: "vampire" }] },
  { id: "storm", note: "Shock on everything behind two spears.", classes: ["hoplite", "valkyrie", "stormcaller", "bard", "paladin"], formation: "escort", legendaries: [{ piece: "cinder_rod", for: "stormcaller" }, { piece: "brand_of_kings", for: "valkyrie" }, { piece: "static_coil", for: "hoplite" }] },
  { id: "bleed", note: "Bleed from three sources: the Ranger's arrows, the thorns, the Assassin's crits.", classes: ["bramble_knight", "assassin", "ranger", "monk", "cleric"], formation: "ambush", legendaries: [{ piece: "hunters_bow", for: "ranger" }, { piece: "needle", for: "assassin" }, { piece: "briar_coat", for: "ranger" }] },
  { id: "holy", note: "A shelter against magic, a healer and a Geomancer behind its stone.", classes: ["paladin", "geomancer", "cleric", "knight", "valkyrie"], formation: "vanguard", legendaries: [{ piece: "crown_of_judgement", for: "paladin" }, { piece: "stone_idol", for: "geomancer" }, { piece: "soul_jar", for: "cleric" }] },
  { id: "curse", note: "The Hexer burns and shocks every foe for the Pyromancer; a Knight holds the line.", classes: ["knight", "hexer", "pyromancer", "stormcaller", "bard"], formation: "vanguard", legendaries: [{ piece: "sanguine_staff", for: "hexer" }, { piece: "shatter_sigil", for: "knight" }, { piece: "silver_bell", for: "pyromancer" }] },
  { id: "blood", note: "Sustain by hitting: the Vampire and Monk drain, the Valkyrie brings back whoever falls.", classes: ["vampire", "monk", "valkyrie", "bard", "assassin"], formation: "last_stand", legendaries: [{ piece: "twin_soul_charm", for: "vampire" }, { piece: "mist_claws", for: "monk" }, { piece: "war_banner", for: "valkyrie" }] },
  { id: "earth-wall", note: "Armor everywhere: a Hoplite, a Geomancer whose rocks scale from Armor, a Ranger behind.", classes: ["hoplite", "geomancer", "ranger", "knight", "pyromancer"], formation: "vanguard", legendaries: [{ piece: "earthshaker", for: "geomancer" }, { piece: "spiked_bulwark", for: "hoplite" }, { piece: "glass_heart", for: "ranger" }] },
  { id: "tempo", note: "Haste and Might from the Bard on a Stormcaller, all in.", classes: ["knight", "bard", "stormcaller", "frostweaver", "cleric"], formation: "blitz", legendaries: [{ piece: "siren_shell", for: "bard" }, { piece: "hourglass", for: "stormcaller" }, { piece: "grave_lantern", for: "knight" }] },
  { id: "revive", note: "Two who bring back the fallen and an Assassin to carry.", classes: ["valkyrie", "cleric", "assassin", "paladin", "monk"], formation: "escort", legendaries: [{ piece: "templar_staff", for: "valkyrie" }, { piece: "shadow_cowl", for: "assassin" }, { piece: "soul_jar", for: "cleric" }] },
  { id: "frost-wall", note: "Two Chill sources behind a thorns wall.", classes: ["bramble_knight", "hexer", "frostweaver", "geomancer", "hoplite"], formation: "vanguard", legendaries: [{ piece: "glacier_staff", for: "frostweaver" }, { piece: "frozen_heart", for: "bramble_knight" }, { piece: "gravecaller", for: "hexer" }] },
];

/**
 * The power level by act and tier, under step 5h's reward plan (design.md): abilities known and upgraded per member, the
 * rarity of ordinary gear (none: plain weapon only) and how many of the roster's legendaries it has. HP and MP on arrival
 * are the calibration's assumptions: regular fights and elites are measured from full HP with MP as rotation leaves it
 * (about 70%), a boss with the party as it arrives (85% HP, 80% MP after a campfire).
 */
export type Level = { known: number; plus: number; gear: RarityT | null; legendaries: number; hp: number; mp: number; roster?: number; random?: boolean };
export const LEVELS: Record<number, Record<Tier, Level> & { early?: Level }> = {
  1: {
    // `roster`: members to pick from (round 4): a run starts with three and its recruits come from floor 2, so act I's first
    // floors have three, its middle four, its boss five.
    // Round 6 (`random`): act I's easy pool (floors 1 to 3) is set against a real start: each member knowing one ability rolled at
    // random (a fresh roll each play) and half charged, not its best first ability 60% charged. Those paid two thirds of what a
    // random start paid (12 to 15% of HP against 17 to 22%).
    easy: { known: 1, plus: 0, gear: null, legendaries: 0, hp: 100, mp: 100, roster: 3, random: true },
    // Round 6: a party a few rooms in, where the regular fights start (floor 4): four to pick from, one random ability each, no
    // gear yet. Only for measuring act I's climb below the regular fights' reference floor (`npm run rogue:calibrate -- --climb`).
    early: { known: 1, plus: 0, gear: null, legendaries: 0, hp: 100, mp: 70, roster: 4, random: true },
    // Round 4: act I's middle as a careful player has it on floors 3 to 8 (the first elite on floor 4 or 5, its trophy often the
    // run's first legendary): most members still on their first ability, a few pieces of common gear.
    normal: { known: 1.4, plus: 0, gear: "common", legendaries: 0, hp: 100, mp: 70, roster: 4 },
    elite: { known: 1.6, plus: 0, gear: "common", legendaries: 0, hp: 100, mp: 70, roster: 4 },
    boss: { known: 2, plus: 0, gear: "uncommon", legendaries: 1, hp: 85, mp: 80 },
  },
  2: {
    easy: { known: 2, plus: 0, gear: "uncommon", legendaries: 1, hp: 100, mp: 100 },
    normal: { known: 3, plus: 0, gear: "uncommon", legendaries: 2, hp: 100, mp: 70 },
    elite: { known: 3, plus: 1, gear: "rare", legendaries: 2, hp: 100, mp: 70 },
    boss: { known: 3, plus: 1, gear: "rare", legendaries: 3, hp: 85, mp: 80 },
  },
  // Round 6 (the director's: act III "extremely easy ... almost no risk"): act III's rosters carry what the reward plan hands a run
  // by then (about four legendaries taken an act, so about eight on arriving), six or seven of them worn (were three: every
  // roster's hand-picked pieces). Their three, then more by a stated rule (`extraLegendaries`).
  3: {
    easy: { known: 3, plus: 1, gear: "rare", legendaries: 6, hp: 100, mp: 100 },
    normal: { known: 3, plus: 1, gear: "rare", legendaries: 6, hp: 100, mp: 70 },
    elite: { known: 3, plus: 2, gear: "rare", legendaries: 7, hp: 100, mp: 70 },
    boss: { known: 3, plus: 2, gear: "rare", legendaries: 7, hp: 85, mp: 80 },
  },
};

/** A roster at an act's and tier's power level, as a run: all five in the roster, the first three in the party. */
export function buildRoster(c: Content, r: Roster, act: number, tier: Tier | "early", rep = 0): RogueRun {
  const lv = tier === "early" ? LEVELS[act].early! : LEVELS[act][tier];
  // A seed of its own per roster and level, so their items' ids never collide (the feel tool once printed another roster's gear).
  const run = newRogue(c, { seed: 100 + ROSTERS.findIndex((x) => x.id === r.id) * 20 + act * 5 + ["easy", "normal", "elite", "boss", "early"].indexOf(tier), leader: r.classes[0] });
  run.act = act;
  run.roster = [];
  run.party = [];
  run.items = [];
  run.seats = 2;
  run.pending = { kind: "map" };
  r.classes.forEach((cls, i) => {
    const known = lv.random ? rollKnown(c, rngFor(rep * 101 + i, `start:${r.id}:${cls}:${tier}`), cls, Math.floor(lv.known)) : ORDER[cls].slice(0, Math.floor(lv.known) + (i < Math.round((lv.known % 1) * r.classes.length) ? 1 : 0));
    recruit(c, run, cls, 100, known);
    const m = member(run, cls);
    for (const a of known.slice(0, lv.plus)) {
      const up = upgraded(c, a).id;
      m.known = m.known.map((x) => (x === a ? up : x));
      m.order = m.order.map((x) => (x === a ? up : x));
    }
    // Cooldowns as a run carries them between fights (step 5g), measured over the rosters' third to sixth fights in a row: 0.38
    // of a cooldown left on average whatever its length, and a revive ready 88% of the time, since it waits for a knockout most
    // fights never bring. (Every ability uncharged, as before, kept Raise and Valhalla from being ready when anyone fell, and
    // understated every roster's opening: the bosses' knobs had been set too soft.)
    m.cooldowns = Object.fromEntries(m.known.map((a) => { const d = c.abilities.get(a)!; return [a, d.do.some((op) => op.op === "revive") ? 0 : Math.round(d.cooldown * 40) / 100]; }));
    // A real start's abilities are fresh: half charged (round 6).
    if (lv.random) m.cooldowns = Object.fromEntries(m.known.map((a) => [a, Math.round(c.abilities.get(a)!.cooldown * (100 - (rogue(c).config.fresh ?? 0))) / 100]));
  });
  run.party = r.classes.slice(0, 3);
  run.formations = [...new Set(["neutral", r.formation])];
  setFormation(c, run, r.formation);
  seat(c, run, r.classes.slice(0, 3));
  // Ordinary gear: six pieces of the level's rarity each member can wear, the best of them worn.
  const rng = rngFor(1000 + act * 10 + ["easy", "normal", "elite", "boss", "early"].indexOf(tier), `parties:${r.id}`);
  if (lv.gear) for (const cls of r.classes) for (let i = 0; i < 6; i++) run.items.push(rollItem(c, run, rng, lv.gear, false, false, cls));
  // A legendary piece carries two affixes, as one found in a run does.
  const affixes = rogue(c).affixes.map((a) => a.id);
  const legend = [...r.legendaries, ...extraLegendaries(c, r, lv.legendaries - r.legendaries.length)].slice(0, lv.legendaries).map((l, i) => ({ ...l, item: newItem(run, l.piece, "legendary", [affixes[(i * 7 + act * 3) % affixes.length], affixes[(i * 7 + act * 3 + 5) % affixes.length]]) }));
  for (const l of legend) run.items.push(l.item);
  registerGear(c, run);
  kitUp(c, run);
  for (const l of legend) {
    const g = c.gear.get(l.item.uid) ?? itemGear(c, l.item);
    equip(c, run, l.for, g.slot as Slot, l.item.uid);
  }
  // Only what's worn stays: the rest of the offers weren't taken.
  const worn = new Set(run.roster.flatMap((m) => Object.values(m.gear)));
  run.items = run.items.filter((it) => worn.has(it.uid));
  // Arrival: HP and MP by the level's assumption.
  for (const m of run.roster) {
    const st = statsFor(c, run, m.cls);
    m.missHp = Math.floor((st.max_hp * (100 - lv.hp)) / 100);
    m.missMp = Math.floor((st.max_mp * (100 - lv.mp)) / 100);
    m.lastMax = { hp: st.max_hp, mp: st.max_mp };
  }
  return run;
}
/**
 * Round 6: legendaries past a roster's hand-picked three, by a stated rule: the fighting three in turn (then the bench), each a
 * piece aimed at it (`aims`) that it can wear, in a slot no legendary of its own fills yet, not already held; first in the pool's
 * order, shuffled by the roster's own dice.
 */
function extraLegendaries(c: Content, r: Roster, n: number): { piece: string; for: string }[] {
  const out: { piece: string; for: string }[] = [];
  if (n <= 0) return out;
  const pool = shuffle(rngFor(7, `extra:${r.id}`), [...rogue(c).legendaries]);
  const held = [...r.legendaries];
  const slotOf = (id: string) => c.gear.get(id)?.slot ?? rogue(c).gear.find((g) => g.id === id)?.slot;
  const order = [0, 1, 2, 0, 1, 2, 3, 4, 0, 1, 2].map((i) => r.classes[i]);
  for (const cls of order) {
    if (out.length >= n) break;
    const k = c.classes.get(cls)!;
    const taken = new Set(held.filter((l) => l.for === cls).map((l) => slotOf(l.piece)));
    const piece = pool.find((id) => rogue(c).aims?.[id]?.includes(cls) && !held.some((l) => l.piece === id) && !taken.has(slotOf(id)) && canEquip(k, c.gear.get(id) ?? rogue(c).gear.find((g) => g.id === id)!));
    if (!piece) continue;
    held.push({ piece, for: cls });
    out.push({ piece, for: cls });
  }
  return out;
}
/** A member's max HP and MP as worn. */
function statsFor(c: Content, run: RogueRun, cls: string): { max_hp: number; max_mp: number } {
  return { max_hp: maxHp(c, run, cls), max_mp: maxMp(c, run, cls) };
}
import { maxOf } from "./rogue.js";
const maxHp = (c: Content, run: RogueRun, cls: string) => maxOf(c, run, cls, "max_hp");
const maxMp = (c: Content, run: RogueRun, cls: string) => maxOf(c, run, cls, "max_mp");

/**
 * How a roster picks its three for a fight (round 5): the trios ranked by what they pay on two throws of other dice, and the one
 * PICK of the way down fielded: the 3rd of ten, the 2nd of four, the only one of one. A good pick from the preview, not the perfect
 * one: the best of ten, played out on the fight itself, is a pick no player can make. In act II's regular fights it paid 15% of HP
 * where the 3rd paid 26%, the roster's own first three 31% and the median trio 43%.
 */
export const PICK = 0.25;

/** The trios a roster can field from its first `n` members, in seat order: its formation's seats filled by the roster's preference order. */
export function trios(r: Roster, n = 5): string[][] {
  const out: string[][] = [];
  const cs = r.classes.slice(0, n);
  for (let a = 0; a < cs.length; a++) for (let b = a + 1; b < cs.length; b++) for (let d = b + 1; d < cs.length; d++) out.push([cs[a], cs[b], cs[d]]);
  return out;
}

// ─── The roster sheet, for the director ────────────────────────────────────

function sheet(c: Content): string {
  const name = (id: string) => c.classes.get(id)?.name ?? id;
  const out: string[] = [
    "# Step 5h: the hand-built rosters",
    "",
    "Generated by `npx tsx src/rogue-parties.ts` from `src/rogue-parties.ts`. Every fight's difficulty is set against these rosters, not against the simulated player's parties (the director's call: a rules-of-thumb player can't come near a human). Twelve rosters of five, three fighting and two on the bench, each built around something. For each fight the calibrator lets each roster field a good three of five for that fight, the way a player uses the bench against a preview: the trios ranked by what they pay on other dice, and the one a quarter of the way down fielded (the 3rd of ten, the 2nd of four), not the best, which no player could pick. Every ability starts a fight as a run carries it: about 60% charged, a revive ready.",
    "",
    "What's picked by hand: the classes, the formation and seats, each class's ability order, and three legendary pieces. What follows a stated rule: ordinary gear (each member is offered six pieces of the level's rarity it can wear, and the best are worn: a pick of three, twice), the power level by act and tier, and (round 6) act III's further legendaries, as many as the reward plan hands a run by then: the fighting three in turn, each a piece aimed at it in a slot no legendary of its own fills yet.",
    "",
    "## Power level by act and tier",
    "",
    "| Act | Tier | Abilities known | Upgraded | Ordinary gear | Legendaries found | Arrives at HP / MP |",
    "| --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const act of [1, 2, 3]) for (const t of ["easy", "normal", "elite", "boss"] as Tier[]) {
    const lv = LEVELS[act][t];
    out.push(`| ${act} | ${t} | ${lv.known}${lv.random ? " (rolled at random, half charged)" : ""} | ${lv.plus} | ${lv.gear ?? "plain weapon"} | ${lv.legendaries} | ${lv.hp}% / ${lv.mp}% |`);
  }
  out.push("", "## The rosters", "");
  for (const r of ROSTERS) {
    out.push(`### ${r.id}: ${r.note}`, "", `Fighting: ${r.classes.slice(0, 3).map(name).join(", ")} (${c.formations.get(r.formation)!.name}); bench: ${r.classes.slice(3).map(name).join(", ")}. Legendaries, in the order found: ${r.legendaries.map((l) => `${c.gear.get(l.piece)?.name ?? (rogue(c).gear.find((g) => g.id === l.piece)?.name ?? l.piece)} (${name(l.for)})`).join(", ")}.`, "");
    const run = buildRoster(c, r, 2, "boss");
    out.push("At act II's boss:", "");
    for (const m of run.roster) {
      const gear = (["weapon", "armor", "amulet"] as Slot[]).map((s) => { const uid = m.gear[s]; if (!uid) return `${s}: nothing`; const it = run.items.find((x) => x.uid === uid)!; return `${(c.gear.get(uid) ?? itemGear(c, it)).name} (${it.rarity})`; }).join("; ");
      out.push(`- ${name(m.cls)}${run.party.includes(m.cls) ? "" : " (bench)"}: ${m.order.map((a) => c.abilities.get(a)!.name).join(", ")}. ${gear}.`);
    }
    out.push("");
  }
  return out.join("\n");
}

if (/rogue-parties\.(ts|mjs)$/.test(process.argv[1] ?? "")) void (async () => {
  const { readFileSync, writeFileSync } = await import("node:fs");
  const { loadContent } = await import("./engine/run.js");
  const c = loadContent(JSON.parse(readFileSync("content/core-set.pack.json", "utf8")));
  writeFileSync("steps/05-core-set/5h-roster/parties.md", sheet(c) + "\n");
  console.log("wrote steps/05-core-set/5h-roster/parties.md");
})();
