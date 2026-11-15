/**
 * Tuning on hand-built, representative parties instead of the simulated player's snapshots. A
 * rules-of-thumb player can't come near a human who builds well, so each fight is measured against rosters a careful
 * player could have at that point of a run.
 *
 * A roster is five classes (three fighting, two on the bench) and the build it plays (`docs/gear-design/builds.md`), picked by
 * hand (below). Its build gives it the rest, as a careful player builds toward one: that build's formation by the act (Neutral
 * at a run's start, then its common, rare and legendary one: `FORMS` in `tools/build-parties.ts`), each trio seated by the
 * formation's seats and what each class fits, its legendaries and its trainings (a version toward the build, where one serves
 * it, else the power step) by the loot's tags, as the build parties have them. What changes with the act and the fight's tier is
 * the power level: how many abilities each member knows and how many are upgraded, the formation's rarity, the rarity of its
 * ordinary gear and how many legendaries it has found (`LEVELS`). A fractional `known` means some members know one more: 1.4 is two of the five on their second ability. Ordinary gear is filled by a stated rule: each member is offered six pieces of the level's rarity
 * it can wear, and the gear scorer equips the best (a pick of three, twice); the legendaries go to the member each is for.
 *
 *   npx tsx tools/rogue-parties.ts      writes out/rogue-parties.md, every roster at every level
 */
import type { Content } from "../src/engine/run.js";
import { rngFor, shuffle } from "../src/engine/rng.js";
import { canEquip } from "../src/validate.js";
import { equip, itemGear, member, newItem, newRogue, recruit, registerGear, rogue, rollItem, rollKnown, seat, setFormation, SLOT_LIST, stockOf, upgradeOf, type RogueRun, type Slot } from "../src/rogue.js";
import { kitUp } from "../src/sim/rogue-ai.js";
import type { RarityT } from "../src/schema.js";
import { FORMS, seated, worth, type BuildId } from "./build-parties.js";

export type Tier = "easy" | "normal" | "elite" | "boss";
export type Roster = {
  id: string;
  /** What the build is about, in a line. */
  note: string;
  /** The build it plays: its formation by act, its legendaries and its versions follow from it. */
  build: BuildId;
  /** Three fighting, then two on the bench (the order is who's preferred in; the formation's seats say where each sits). */
  classes: [string, string, string, string, string];
  /** Legendary pieces picked by hand, each for a member, in the order a run finds them; the rest follow the build's tags. */
  legendaries: { piece: string; for: string }[];
};

/** Each class's ability order: what it learns first and slots first. */
export const ORDER: Record<string, string[]> = {
  knight: ["stand_fast", "shield_bash", "fortify"],
  cleric: ["cure", "renew", "raise"],
  ranger: ["barbed_arrow", "rending_arrow", "frost_arrow"],
  bramble_knight: ["thicket", "bramble_lash", "regrowth"],
  hoplite: ["othismos", "spear_thrust", "aspis"],
  paladin: ["condemn", "smite", "absolve"],
  valkyrie: ["gale_spear", "choosing", "skyfall"],
  bard: ["war_ballad", "allegro", "encore"],
  hexer: ["enfeeble", "malison", "unmake"],
  monk: ["burning_fist", "flow", "pressure_point"],
  assassin: ["backstab", "vanish", "garrote"],
  vampire: ["blood_drain", "frenzy", "blood_gift"],
  pyromancer: ["firebolt", "fireball", "pyre"],
  frostweaver: ["frost_lance", "blizzard", "stillness"],
  stormcaller: ["chain_lightning", "thunderstorm", "static_charge"],
  geomancer: ["earthen_shell", "rockfall", "tremor"],
};

/** Twelve rosters, every class fighting in at least one and most in two or three, each built around one of the nine builds. */
export const ROSTERS: Roster[] = [
  { id: "wall-fire", build: "bonfire", note: "A wall, a Burn caster and a healer; a Ranger and a Monk to rotate in.", classes: ["knight", "pyromancer", "cleric", "ranger", "monk"], legendaries: [] },
  { id: "chill-engine", build: "snap", note: "The director's build: Chill on the Monk's basic attacks, paid off by the Frostweaver's shatter.", classes: ["monk", "frostweaver", "bard", "hexer", "valkyrie"], legendaries: [] },
  { id: "thorns", build: "toll", note: "A thorns wall draws everything; the Assassin and Vampire cash in the Bleed.", classes: ["bramble_knight", "assassin", "vampire", "cleric", "hoplite"], legendaries: [] },
  { id: "storm", build: "storm", note: "Shock on everything behind two spears.", classes: ["hoplite", "valkyrie", "stormcaller", "bard", "paladin"], legendaries: [] },
  { id: "bleed", build: "cuts", note: "Bleed from three sources: the Ranger's arrows, the thorns, the Assassin's crits.", classes: ["bramble_knight", "assassin", "ranger", "monk", "cleric"], legendaries: [] },
  { id: "holy", build: "landslide", note: "A shelter for the party, a healer and a Geomancer behind its stone.", classes: ["paladin", "geomancer", "cleric", "knight", "valkyrie"], legendaries: [] },
  { id: "curse", build: "bonfire", note: "The Hexer curses every foe beside the Pyromancer; a Knight holds the line.", classes: ["knight", "hexer", "pyromancer", "stormcaller", "bard"], legendaries: [] },
  { id: "blood", build: "pact", note: "Sustain by hitting: the Vampire and Monk drain, the Valkyrie brings back whoever falls.", classes: ["vampire", "monk", "valkyrie", "bard", "assassin"], legendaries: [] },
  { id: "earth-wall", build: "landslide", note: "Defense everywhere: a Hoplite, a Geomancer whose rocks scale from Defense, a Ranger behind.", classes: ["hoplite", "geomancer", "ranger", "knight", "pyromancer"], legendaries: [] },
  { id: "tempo", build: "barrage", note: "Haste and Might from the Bard on a Stormcaller, all in.", classes: ["knight", "bard", "stormcaller", "frostweaver", "cleric"], legendaries: [] },
  { id: "revive", build: "hunt", note: "Two who bring back the fallen and an Assassin to carry.", classes: ["valkyrie", "cleric", "assassin", "paladin", "monk"], legendaries: [] },
  { id: "frost-wall", build: "snap", note: "Two Chill sources behind a thorns wall.", classes: ["bramble_knight", "hexer", "frostweaver", "geomancer", "hoplite"], legendaries: [] },
];

/** A roster's formation at a level: Neutral, or its build's common, rare or legendary one (`Level.formation` 1 to 3). */
export const formationOf = (r: Roster, lv: Level): string => (lv.formation ? FORMS[r.build][lv.formation - 1] : "neutral");

/**
 * The power level by act and tier: abilities known and upgraded per member, the
 * rarity of ordinary gear (none: plain weapon only) and how many of the roster's legendaries it has. HP and MP on arrival
 * are the calibration's assumptions: regular fights and elites are measured from full HP with MP as rotation leaves it
 * (about 70%), a boss with the party as it arrives (85% HP, 80% MP after a campfire).
 */
/** `formation`: none (Neutral, a run's start), or the build's common (1), rare (2) or legendary (3) formation. */
export type Level = { known: number; plus: number; formation: 0 | 1 | 2 | 3; gear: RarityT | null; legendaries: number; hp: number; mp: number; roster?: number; random?: boolean; pieces?: number };
export const LEVELS: Record<number, Record<Tier, Level> & { early?: Level }> = {
  1: {
    // `roster`: members to pick from: a run starts with three and its recruits come from floor 2, so act I's first
    // floors have three, its middle four, its boss five.
    // `random`: act I's easy pool (floors 1 to 3) is set against a real start: each member knowing one ability rolled at random
    // (a fresh roll each play) and half charged.
    easy: { known: 1, plus: 0, formation: 0, gear: null, legendaries: 0, hp: 100, mp: 100, roster: 3, random: true },
    // A party a few rooms in, where the regular fights start (floor 4): four to pick from, one random ability each, a piece
    // each. Only for measuring act I's climb below the regular fights' reference floor (`npm run rogue:calibrate -- --climb`).
    // Rounded up like the rest (the simulated player's party wears 0.4 legendaries and 2.3 ordinary pieces on floors 4 to 6).
    early: { known: 1, plus: 0, formation: 0, gear: "common", pieces: 1, legendaries: 1, hp: 100, mp: 70, roster: 4, random: true },
    // Act I's levels from what a run holds, measured over 300 of the simulated player's runs (the party of three, each member's
    // abilities; legendaries worn; ordinary pieces): floors 7 to 11 2.0 abilities, 1.4 legendaries, 3.6 pieces; its elites 1.75,
    // 0.8, 3.1; its boss 2.3, 1.9, 4.0, five in the roster. Rounded up, since a human outplays it, and `pieces` caps the ordinary
    // gear each member wears.
    // From floor 4 a careful player has found a formation its build likes: the build's common one through act I.
    normal: { known: 2, plus: 0, formation: 1, gear: "common", pieces: 2, legendaries: 2, hp: 100, mp: 70, roster: 4 },
    elite: { known: 2, plus: 0, formation: 1, gear: "common", pieces: 2, legendaries: 2, hp: 100, mp: 70, roster: 4 },
    boss: { known: 2.4, plus: 0, formation: 1, gear: "uncommon", pieces: 2, legendaries: 3, hp: 85, mp: 80 },
  },
  // The same measure: act II's parties wear 2.3 / 2.9 / 3.2 legendaries (early, middle, boss) with 0.5 / 1.1 / 1.6 abilities
  // upgraded each.
  2: {
    // The build's rare formation through act II (its common one on the act's first floors).
    easy: { known: 3, plus: 0, formation: 1, gear: "uncommon", legendaries: 3, hp: 100, mp: 100 },
    normal: { known: 3, plus: 1, formation: 2, gear: "uncommon", legendaries: 3, hp: 100, mp: 70 },
    elite: { known: 3, plus: 1, formation: 2, gear: "rare", legendaries: 3, hp: 100, mp: 70 },
    boss: { known: 3, plus: 2, formation: 2, gear: "rare", legendaries: 4, hp: 85, mp: 80 },
  },
  // Act III's rosters carry what a run holds by then (about four legendaries taken an act, so about eight on arriving), six or
  // seven of them worn: the roster's own, then more by a stated rule (`extraLegendaries`).
  3: {
    // The build's legendary formation through act III (its rare one on the act's first floors).
    easy: { known: 3, plus: 1, formation: 2, gear: "rare", legendaries: 6, hp: 100, mp: 100 },
    normal: { known: 3, plus: 1, formation: 3, gear: "rare", legendaries: 6, hp: 100, mp: 70 },
    elite: { known: 3, plus: 2, formation: 3, gear: "rare", legendaries: 7, hp: 100, mp: 70 },
    boss: { known: 3, plus: 2, formation: 3, gear: "rare", legendaries: 7, hp: 85, mp: 80 },
  },
};

/** A roster at an act's and tier's power level, as a run: all five in the roster, the first three in the party. */
export function buildRoster(c: Content, r: Roster, act: number, tier: Tier | "early", rep = 0): RogueRun {
  const lv = tier === "early" ? LEVELS[act].early! : LEVELS[act][tier];
  // A seed of its own per roster and level, so their items' ids never collide.
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
    // An ability "upgraded" is one training on it, where the content has its upgrade: the version worth more to the build,
    // where one serves it (the loot's tags), else the power step.
    for (const a of known.slice(0, lv.plus)) {
      if (!upgradeOf(c, a)) continue;
      const va = worth(`${a}__a`, r.build), vb = worth(`${a}__b`, r.build);
      m.trained = { ...(m.trained ?? {}), [a]: va || vb ? { version: va >= vb ? "a" : "b" } : { power: true } };
    }
    // Cooldowns as a run carries them between fights, measured over the rosters' third to sixth fights in a row: 0.38 of a
    // cooldown left on average whatever its length, and a revive ready 88% of the time, since it waits for a knockout most
    // fights never bring.
    m.cooldowns = Object.fromEntries(m.known.map((a) => { const d = c.abilities.get(a)!; return [a, d.do.some((op) => op.op === "revive") ? 0 : Math.round(d.cooldown * 40) / 100]; }));
    // A real start's abilities are fresh: half charged.
    if (lv.random) m.cooldowns = Object.fromEntries(m.known.map((a) => [a, Math.round(c.abilities.get(a)!.cooldown * (100 - (rogue(c).config.fresh ?? 0))) / 100]));
  });
  const form = formationOf(r, lv);
  run.party = r.classes.slice(0, 3);
  run.formations = [...new Set(["neutral", form])];
  setFormation(c, run, form);
  seat(c, run, seated(form, r.classes.slice(0, 3)));
  // Ordinary gear: six pieces of the level's rarity each member can wear, the best of them worn.
  const rng = rngFor(1000 + act * 10 + ["easy", "normal", "elite", "boss", "early"].indexOf(tier), `parties:${r.id}`);
  if (lv.gear) for (const cls of r.classes) for (let i = 0; i < 6; i++) { const it = rollItem(c, run, rng, lv.gear, false, false, cls); if (it) run.items.push(it); }
  // A legendary piece is fixed (no affixes).
  const legend = [...r.legendaries, ...extraLegendaries(c, r, lv.legendaries - r.legendaries.length)].slice(0, lv.legendaries).map((l) => ({ ...l, item: newItem(run, l.piece, "legendary") }));
  for (const l of legend) run.items.push(l.item);
  registerGear(c, run);
  kitUp(c, run);
  for (const l of legend) {
    const g = c.gear.get(l.item.uid) ?? itemGear(c, l.item);
    equip(c, run, l.for, g.slot as Slot, l.item.uid);
  }
  // At most `pieces` ordinary pieces a member (an amulet goes first, then armor; the weapon stays).
  if (lv.pieces !== undefined) for (const m of run.roster) {
    const ordinary = (s: Slot) => { const uid = m.gear[s]; const it = uid ? run.items.find((x) => x.uid === uid) : undefined; return !!it && it.rarity !== "legendary" && !it.base.startsWith("plain_"); };
    for (const s of ["amulet", "offhand", "armor"] as Slot[]) if (SLOT_LIST.filter(ordinary).length > lv.pieces && ordinary(s)) delete m.gear[s];
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
 * Legendaries past a roster's hand-picked ones, by a stated rule: the fighting three in turn (then the bench), each a piece it
 * can wear, in a slot no legendary of its own fills yet, not already held; the one worth most to the roster's build by the
 * loot's tags first, then in the stock's order, shuffled by the roster's own dice.
 */
function extraLegendaries(c: Content, r: Roster, n: number): { piece: string; for: string }[] {
  const out: { piece: string; for: string }[] = [];
  if (n <= 0) return out;
  const pool = shuffle(rngFor(7, `extra:${r.id}`), stockOf(c).all.filter((g) => g.rarity === "legendary").map((g) => g.id)).sort((x, y) => worth(y, r.build) - worth(x, r.build));
  const held = [...r.legendaries];
  const slotOf = (id: string) => c.gear.get(id)?.slot;
  const order = [0, 1, 2, 0, 1, 2, 3, 4, 0, 1, 2].map((i) => r.classes[i]);
  for (const cls of order) {
    if (out.length >= n) break;
    const k = c.classes.get(cls)!;
    const taken = new Set(held.filter((l) => l.for === cls).map((l) => slotOf(l.piece)));
    const piece = pool.find((id) => !held.some((l) => l.piece === id) && !taken.has(slotOf(id)) && canEquip(k, c.gear.get(id)!));
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
import { maxOf } from "../src/rogue.js";
const maxHp = (c: Content, run: RogueRun, cls: string) => maxOf(c, run, cls, "max_hp");
const maxMp = (c: Content, run: RogueRun, cls: string) => maxOf(c, run, cls, "max_mp");

/**
 * How a roster picks its three for a fight: the trios ranked by what they pay on two throws of other dice, and the one
 * PICK of the way down fielded: the 3rd of ten, the 2nd of four, the only one of one. A good pick from the preview, not the perfect
 * one: the best of ten, played out on the fight itself, is a pick no player can make.
 */
export const PICK = 0.25;

/** The trios a roster can field from its first `n` members, in seat order: each seated by the formation's seats and what each class fits. */
export function trios(r: Roster, n = 5, formation = "neutral"): string[][] {
  const out: string[][] = [];
  const cs = r.classes.slice(0, n);
  for (let a = 0; a < cs.length; a++) for (let b = a + 1; b < cs.length; b++) for (let d = b + 1; d < cs.length; d++) out.push(seated(formation, [cs[a], cs[b], cs[d]]));
  return out;
}

// ─── The roster sheet, for the director ────────────────────────────────────

function sheet(c: Content): string {
  const name = (id: string) => c.classes.get(id)?.name ?? id;
  const out: string[] = [
    "# The hand-built rosters",
    "",
    "Generated by `npx tsx tools/rogue-parties.ts` from `tools/rogue-parties.ts`. Every fight's difficulty is set against these rosters, not against the simulated player's parties: a rules-of-thumb player can't come near a human. Twelve rosters of five, three fighting and two on the bench, each built around something. For each fight the calibrator lets each roster field a good three of five for that fight, the way a player uses the bench against a preview: the trios ranked by what they pay on other dice, and the one a quarter of the way down fielded (the 3rd of ten, the 2nd of four), not the best, which no player could pick. Every ability starts a fight as a run carries it: about 60% charged, a revive ready.",
    "",
    "What's picked by hand: each roster's classes, the build it plays, and each class's ability order. What follows from the build: its formation by act (Neutral at a run's start, then the build's common, rare and legendary one), each trio seated by the formation's seats, its legendaries (the ones worth most to the build by the loot's tags) and its trainings (a version toward the build where one serves it, else the power step). What follows a stated rule: ordinary gear (each member is offered six pieces of the level's rarity it can wear, and the best are worn: a pick of three, twice) and the power level by act and tier.",
    "",
    "## Power level by act and tier",
    "",
    "| Act | Tier | Abilities known | Upgraded | Formation | Ordinary gear | Legendaries found | Arrives at HP / MP |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const act of [1, 2, 3]) for (const t of ["easy", "normal", "elite", "boss"] as Tier[]) {
    const lv = LEVELS[act][t];
    out.push(`| ${act} | ${t} | ${lv.known}${lv.random ? " (rolled at random, half charged)" : ""} | ${lv.plus} | ${["Neutral", "common", "rare", "legendary"][lv.formation]} | ${lv.gear ?? "plain weapon"} | ${lv.legendaries} | ${lv.hp}% / ${lv.mp}% |`);
  }
  out.push("", "## The rosters", "");
  for (const r of ROSTERS) {
    const run = buildRoster(c, r, 2, "boss");
    out.push(`### ${r.id} (${r.build}): ${r.note}`, "", `Fighting: ${r.classes.slice(0, 3).map(name).join(", ")}; bench: ${r.classes.slice(3).map(name).join(", ")}. Formations by act: ${FORMS[r.build].map((f) => c.formations.get(f)!.name).join(", ")}.`, "");
    out.push(`At act II's boss, in ${c.formations.get(run.formation)!.name}:`, "");
    for (const m of run.roster) {
      const gear = (["weapon", "armor", "amulet"] as Slot[]).map((s) => { const uid = m.gear[s]; if (!uid) return `${s}: nothing`; const it = run.items.find((x) => x.uid === uid)!; return `${(c.gear.get(uid) ?? itemGear(c, it)).name} (${it.rarity})`; }).join("; ");
      out.push(`- ${name(m.cls)}${run.party.includes(m.cls) ? "" : " (bench)"}: ${m.order.map((a) => c.abilities.get(a)!.name).join(", ")}. ${gear}.`);
    }
    out.push("");
  }
  return out.join("\n");
}

if (/rogue-parties\.(ts|mjs)$/.test(process.argv[1] ?? "")) void (async () => {
  const { mkdirSync, readFileSync, writeFileSync } = await import("node:fs");
  const { loadContent } = await import("../src/engine/run.js");
  const c = loadContent(JSON.parse(readFileSync("content/core-set.pack.json", "utf8")));
  mkdirSync("out", { recursive: true });
  writeFileSync("out/rogue-parties.md", sheet(c) + "\n");
  console.log("wrote out/rogue-parties.md");
})();
