/**
 * The rogue mode (steps/05-core-set/5d-rogue): the core set as a roguelite. A run is three acts on Slay the Spire's
 * structure: a map of branching paths through a themed region, a boss at its end, and the next region picked from two.
 * The party is a leader the player owns plus two drafted companions; it grows through gear (drawn from the core set's
 * pieces, with affixes and rarities), legendary pieces that bend a rule, abilities learned one at a time, formations,
 * and classes recruited along the way. HP, MP and knockouts carry from fight to fight; campfires and the shop are
 * the only relief, and each act begins restored.
 *
 * This file is the content: the regions and their encounters, the legendary pieces and the statuses behind them,
 * the affixes, the events and every number the run uses. src/rogue.ts is the rules that read it.
 */
import type { GearT, NumT, RogueConfigT, RogueNodeKindT, StatusT } from "../../src/schema.js";
import { FLAT_STACKS, P, RESIST, SPECIAL, STACKS, crit, stepFor } from "./scale.js";
import { T } from "./classes.js";
import { enc } from "./dungeons.js";
import fightKnobs from "./rogue-knobs.json" with { type: "json" };

type Change = { stat: string; flat: number };
const st = (stat: string, n: number): Change => ({ stat, flat: n * stepFor(stat) });
const sp = (stat: keyof typeof SPECIAL, level: "medium" | "high", key = stat === "crit_damage" ? "crit_multiplier" : stat): Change => ({ stat: key, flat: SPECIAL[stat][level] });
const critStep = (n: number): Change => ({ stat: "crit_chance", flat: crit(n) });

// ─── The run's numbers ───────────────────────────────────────────────────────

export const ROGUE_CONFIG: RogueConfigT = {
  /** Gold at the start, and the draft: the leader (an owned class), then this many picks of one from `offers` classes. */
  start: { gold: 60, offers: 3, picks: 2, healer: true, supplies: ["potion", "tonic"] }, // Step 5h round 6 (the director's): a potion and a tonic at the start, so the first fight can be recovered from.
  /**
   * Step 5h (the director's): what a class knows is rolled. A starting unit (the leader, the draft) knows one of its three
   * abilities at random; a recruit one, two or all three, the odds by act (`recruits.known`). Raise and Valhalla are rolled
   * like any other: a bad roll is a pick the player can decline. (Before: a fixed first ability per class, one more an act.)
   */
  /**
   * Party of three; two seats at camp at the start, up to four. Step 5h round 6 (the director's: choosing a seat over a reward
   * "never felt remotely appropriate"): a seat comes with each new act, three at camp in act II and four in act III (was a boon's
   * option or an event's).
   */
  party: 3,
  bench: 2,
  benchMax: 4,
  benchByAct: [2, 3, 4],
  /**
   * Recruits are offered one of two (the director's: one of three let every run gun for the same party). Known: by act, weights for
   * one, two, three. Step 5h round 6 (the director's: "recruits shouldn't be able to know all 3 abilities in act 1, no matter the
   * luck"): act I rolls one or two (was 5% three). The events that promise all three (the Veterans, the Rival Company) keep it, at
   * their word: rare, named moments.
   */
  recruits: { offers: 2, known: [[70, 30, 0], [35, 45, 20], [15, 45, 40]] },
  /** After each won fight, those who sat it out regain this share of max MP (flat, like a tonic; no gear touches it). */
  benchMp: 50,
  /** A fresh ability (a starting unit's, a recruit's, one just learned) starts with this share of its cooldown already run. */
  fresh: 50,
  /** The Muster: a pick of one of two recruits. The Drill ground: one of two formations, or two members trained. */
  muster: { offers: 2 },
  drill: { offers: 2, train: 2 },
  /** Formation rarities, provisional until step 5i sets them (and adds legendary ones); offers roll a rarity by act. */
  formationRarity: { neutral: "common", vanguard: "common", ambush: "common", scatter: "common", tortoise: "common", champion: "rare", blitz: "rare", escort: "rare", last_stand: "rare", caravan: "rare" },
  formationOdds: [{ common: 70, rare: 28, legendary: 2 }, { common: 45, rare: 45, legendary: 10 }, { common: 25, rare: 55, legendary: 20 }],
  /**
   * The map of an act: `floors` floors and the boss above them, `width` columns, `paths` paths walked up from the bottom
   * (Slay the Spire's generator). Fixed floors; then room odds for the rest, with elites and campfires kept off the first
   * floors, and no elite, campfire or shop straight after another of its kind.
   */
  map: {
    floors: 9, width: 5, paths: 5,
    fixed: { 1: "fight", 5: "treasure", 9: "campfire" } as Record<string, RogueNodeKindT>,
    odds: { fight: 40, event: 20, elite: 12, campfire: 11, shop: 7, muster: 5, drill: 5 } as Record<string, number>,
    lateFrom: 4,
    // Step 5h: two Musters and two Drill grounds an act, so routing toward a recruit or a formation is a choice.
    ensure: { shop: 2, elite: 2, muster: 2, drill: 2 },
  },
  /** Gold for a win: [min, max], plus `perAct` × (act − 1). */
  gold: { fight: [12, 20], elite: [50, 65], boss: [90, 110], perAct: 5 },
  /**
   * Spoils: after a fight, pick one of `count` (or none). Each is gear unless it rolls a tome (a member learns an
   * ability) or a recruit. An elite also pays a trophy, a legendary piece won outright (Slay the Spire's elite relic). Gear rolls its rarity from the table. `usable`: the share of gear rolled from what someone
   * in the roster can use; the rest is anything (the piece that wants a class you don't have yet).
   */
  spoils: {
    // Step 5h (the director's: enough loot to fill the seats and build; legendaries "by orders of magnitude"): a pick of three,
    // gear in 60% of fights and mixed with a tome or a formation in 40%; no supplies (every won fight already drops one); no
    // recruits (they have their own rooms). A full run should take about 28 pieces and 12 legendaries (design.md).
    // Round 6 (the director's: choices between kinds "too often"; "way more legendary gear than any other type"): mixed picks in 15%
    // of fights and elites (were 40% and 30%); an elite's pick 25% legendary (was 40%), and its trophy a pick of the legendary or a
    // formation (formations "came too late in most runs").
    fight: { count: 3, rarity: { common: 35, uncommon: 30, rare: 22, legendary: 13 }, tome: 0, recruit: 0, supply: 0, mixed: 15, mix: { tome: 60, formation: 40, recruit: 0 } },
    elite: { count: 3, trophy: true, trophyFormation: true, rarity: { common: 0, uncommon: 0, rare: 75, legendary: 25 }, tome: 0, recruit: 0, supply: 0, mixed: 15, mix: { tome: 30, formation: 40, recruit: 30 } },
    // A third of offered gear is for a class not in the roster, so a piece can make you want a class (was none: 0.05 a run).
    offRoster: 33,
  },
  /** The boss's boon: pick one of a legendary piece, a formation and a recruit. The next act starts restored, and everyone learns. */
  boon: { count: 3, seat: false }, // Step 5h round 6: seats come with each act (benchByAct), not from the boon.
  /** A chest: one piece, rare or better, and some gold; or a cage, a recruit with a piece suited to it. */
  // Round 6: a chest's piece legendary 30 times in 80 (was 45), rare the rest.
  treasure: { rarity: { common: 0, uncommon: 0, rare: 50, legendary: 30 }, gold: [15, 35], cage: 20 },
  /** The campfire: one pick of REST, FOCUS, RAISE or TRAIN (two members); those at camp get half a REST whatever the pick. */
  // Step 5h: the bench's MP comes after every fight now, so the camp's share is HP only; the reserves rule is gone (a wipe is
  // a wipe, now that the party can be changed before any fight); a stranger at the fire sometimes asks to join.
  campfire: { hp: 40, mp: 60, revive: 40, camp: 50, train: 2, stranger: 30 },
  // Snakes' packs never grow, and act I's regular fights hold two (round 29: the Viper Den and the Snake Pit ended 9% and
  // 7% of the act I runs meeting them, every other act I fight 2% or less, with their knobs already at the floor: the
  // regular fights' extra HP gives a snake more hits, and Bleed doesn't shrink with the knob).
  // Step 5h: with a bench to pick from before every fight, the fights softened for a fixed party of three come back as
  // puzzles: snake packs grow again, the Snake Pit and the Viper Den hold three and four snakes (as first built), and the
  // Fire Mine a new elite, the Bomb Nest: three Bomb Bugs (the enemies document: "three together wipe" a party not built for
  // them). Three cost a quarter of a counter-picked party's HP at the knob's floor, an elite's cost, so they're an elite and
  // the regular Bomb Room and the Powder Room keep two.
  neverGrow: [],
  /** A level-up can be taken as gold instead (one with a single thing left to learn or upgrade was no choice). */
  levelGold: 40,
  /** Prices, in gold. A piece sells for `sell` % of its price. Services are once a visit. */
  prices: { common: 45, uncommon: 70, rare: 110, legendary: 190, recruit: 120, formation: 100, learn: 60, upgrade: 80, trainStep: 30, supply: { potion: 35, tonic: 35, phoenix: 60 }, sell: 35 },
  // Step 5h round 6 (the director's): the shop always has all three supplies (was two of the three).
  shop: { gear: { common: 2, uncommon: 2, rare: 1, legendary: 1 }, legendaryByAct: [1, 2, 2], recruits: 1, formations: 1, supplies: 3 },
  /** Supplies, used between fights: the bag holds this many. */
  /**
   * Step 5g round 6 (the director's): a potion heals one member, a tonic refills one member's MP (the old tonic healed the whole party 30%, the
   * old ether gave it 50% MP), and every won fight hands the party one of each, free, up to a bag of five. Between-fight recovery is the
   * player's to spend, and mana is scarce enough that the tonics matter.
   */
  supplies: { potion: { hp: 30 }, tonic: { mp: 50 }, phoenix: { revive: 50 } }, // Round 8: the tonic half a pool (was 35%).
  // Round 9 (the director's): a won fight offers a choice of one, and the bag has a slot a kind (two potions, two tonics), so one economy can't crowd out the other.
  drops: ["potion", "tonic"],
  bag: { potion: 2, tonic: 2, phoenix: 2 },
  /**
   * The foes, in percent (the campaign's knob: HP +k %, damage +k/2.5 %): per act, the first floor's, the rise per floor, an
   * elite's on top, and the boss's. Each region adds its own (below). Set by the rogue tuning (npm run rogue).
   */
  knobs: [
    { mob: 0, step: 6, elite: 0, boss: 0 },
    { mob: 0, step: 6, elite: 0, boss: 0 },
    { mob: 0, step: 6, elite: 0, boss: 0 },
  ],
  /**
   * Regular fights are longer and softer than the knob alone makes them: their foes have this much more HP and deal this
   * much less damage, and the calibration sets each fight's knob on top, so a fight costs what it did and lasts longer
   * (at the knob alone they lasted 21 to 25 ticks, half the campaign's, and a third slotted ability fired in one fight in three).
   */
  // Step 5g round 3 (the feel reads: "fight length is ungoverned and tiers don't differ"; regular fights 15 to 116 ticks, elites shorter than
  // regular fights with 1.8 knockouts each): regular fights +50% HP and −25% damage (were +80 and −30), elites +30% and −20% (had no shape),
  // so an elite is a longer, less spiky fight at the same cost. Bosses keep the knob alone.
  shape: { fight: { hp: 40, power: -10 }, elite: { hp: 15, power: -10 } }, // Round 9 (the director's: "weak monsters basically just don't do anything ... 200 damage to a unit with 5,000 health"): less HP, full damage (were +50 / −25 and +15 / −15). // Round 5: elites +15 / −15 (were +30 / −20: four ghouls at 160,000 HP read as a wall).
  /** Heat: each level adds this to every knob (about 6 points of the simulated player's wins a level). Won runs open the next. */
  heat: { per: 4, max: 10 },
  /** Later floors' fights grow: from this floor, each pack of two or more may gain one more (to the cap of 8). */
  growFrom: 6,
};

// ─── Regions ─────────────────────────────────────────────────────────────────

export type RogueFight = { id: string; name: string; enemies: string[]; knob?: number };
export type RogueRegion = {
  id: string; name: string; text: string; act: number;
  /** The region's own adjustment to the act's knobs (the tuning sets these). */
  knob: { mob: number; elite: number; boss: number };
  easy: RogueFight[]; normal: RogueFight[]; elite: RogueFight[]; bosses: RogueFight[];
};

/**
 * A region's fights with their calibrated knobs (rogue-knobs.json, by region/tier/id, from npm run rogue:calibrate), and
 * the region's own knob for its regular fights and elites (region/<id>/mob, from npm run rogue:tune).
 */
const KNOBS = fightKnobs as Record<string, number>;
function withKnobs(r: RogueRegion): RogueRegion {
  const tag = (tier: string) => (x: RogueFight): RogueFight => (KNOBS[`${r.id}/${tier}/${x.id}`] !== undefined ? { ...x, knob: KNOBS[`${r.id}/${tier}/${x.id}`] } : x);
  const mob = KNOBS[`region/${r.id}/mob`];
  return { ...r, ...(mob !== undefined ? { knob: { ...r.knob, mob, elite: mob } } : {}), easy: r.easy.map(tag("easy")), normal: r.normal.map(tag("normal")), elite: r.elite.map(tag("elite")), bosses: r.bosses.map(tag("bosses")) };
}
const f = enc;
const REGIONS: RogueRegion[] = [
  {
    id: "old_road", name: "The Old Road", act: 1, knob: { mob: 0, elite: 0, boss: 0 },
    text: "Bandits, wolves and snakes on the road out of town, and ogres at the bridges.",
    easy: [f("toll_gate", "Toll Gate", [3, "bandit"]), f("wolves", "Wolves", [4, "wolf"]), f("snake_grass", "Snake Grass", [3, "snake"]), f("road_thugs", "Road Thugs", [2, "bandit"], [2, "wolf"])],
    normal: [
      f("wolf_pack", "Wolf Pack", [6, "wolf"]), f("snake_pit", "Snake Pit", [3, "snake"], [2, "bandit"]), f("bandit_camp", "Bandit Camp", [1, "shieldman"], [2, "archer"], [1, "bandit"]),
      f("night_wolves", "Night Wolves", [7, "wolf"]), f("archers_nest", "Archers' Nest", [1, "shieldman"], [3, "archer"]), f("viper_den", "Viper Den", [4, "snake"], [2, "bandit"]),
      f("bandit_horde", "Bandit Horde", [5, "bandit"]),
    ],
    elite: [f("ogre_bridge", "Ogre Bridge", [1, "ogre"], [2, "bandit"]), f("twin_ogres", "Twin Ogres", [2, "ogre"]), f("war_camp", "War Camp", [1, "shieldman"], [2, "archer"], [1, "ogre"])],
    bosses: [f("ogre_chief", "The Ogre Chief", [1, "ogre_chief"], [2, "bandit"]), f("packmaster", "The Packmaster", [1, "ogre_chief"], [4, "wolf"]), f("chiefs_return", "The Chief's Return", [1, "ogre_chief"], [1, "ogre"])],
  },
  {
    id: "crypt", name: "The Crypt", act: 2, knob: { mob: 0, elite: 0, boss: 0 },
    text: "Armored bones, bats you can't hit, ghosts magic can't touch, and Death with a bell.",
    easy: [f("bone_pile", "Bone Pile", [3, "skeleton"]), f("bat_roost", "Bat Roost", [4, "bat"]), f("wailing", "The Wailing", [2, "ghost"])],
    normal: [
      f("bone_yard", "Bone Yard", [4, "skeleton"]), f("dark_hall", "Dark Hall", [1, "skeleton"], [1, "ghost"], [2, "bat"]), f("curse_room", "Curse Room", [1, "witch"], [2, "skeleton"]),
      f("haunted_hall", "Haunted Hall", [2, "ghost"], [2, "skeleton"]), f("bone_wall", "Bone Wall", [5, "skeleton"]), f("dead_watch", "The Dead Watch", [2, "skeleton"], [1, "witch"], [1, "ghost"]),
    ],
    elite: [f("ghoul_pit", "Ghoul Pit", [4, "ghoul"]), f("lich_lair", "Lich Lair", [1, "lich"], [1, "mummy"]), f("grave_watch", "Grave Watch", [1, "bone_priest"], [2, "troll"])],
    bosses: [f("reaper", "The Reaper", [1, "reaper"], [2, "bat"]), f("reapers_court", "The Reaper's Court", [1, "reaper"], [2, "skeleton"])],
  },
  {
    id: "fire_mine", name: "The Fire Mine", act: 2, knob: { mob: 0, elite: 0, boss: 0 },
    text: "Everything here burns, and the lord of the furnace casts a fire that ends parties.",
    easy: [f("hounds", "Hounds", [4, "hellhound"]), f("fuse_room", "Fuse Room", [1, "bomb_bug"], [2, "hellhound"]), f("imp_and_hound", "Imp and Hounds", [1, "fire_imp"], [2, "hellhound"])],
    normal: [
      f("hound_pack", "Hound Pack", [5, "hellhound"]), f("bomb_room", "Bomb Room", [2, "bomb_bug"], [2, "hellhound"]), f("imp_kennel", "Imp Kennel", [1, "fire_imp"], [3, "hellhound"]),
      f("hound_run", "Hound Run", [6, "hellhound"]), f("slag_heap", "Slag Heap", [1, "lava_slime"], [2, "hellhound"]), f("miners", "The Miners", [3, "bandit"], [1, "bomb_bug"]),
    ],
    elite: [f("lava_flow", "Lava Flow", [2, "lava_slime"]), f("imp_court", "Imp Court", [2, "fire_imp"], [3, "hellhound"]), f("powder_room", "Powder Room", [2, "bomb_bug"], [1, "ogre"]), f("bomb_nest", "Bomb Nest", [3, "bomb_bug"])],
    bosses: [f("fire_giant", "The Fire Giant", [1, "fire_giant"]), f("giants_forge", "The Giant's Forge", [1, "fire_giant"], [2, "hellhound"]), f("giants_wrath", "The Giant's Wrath", [1, "fire_giant"], [2, "fire_imp"])],
  },
  {
    id: "ice_pass", name: "The Ice Pass", act: 2, knob: { mob: 0, elite: 0, boss: 0 },
    text: "Every fight asks what kind of hit you make, and a Titan of ice waits at the top.",
    easy: [f("snow_wolves", "Snow Wolves", [4, "snow_wolf"]), f("spirits", "Spirits", [2, "ice_spirit"]), f("cold_ghosts", "Cold Ghosts", [2, "ice_ghost"])],
    normal: [
      f("snow_pack", "Snow Pack", [6, "snow_wolf"]), f("ice_heart", "Ice Heart", [3, "ice_spirit"]), f("whiteout", "Whiteout", [2, "ice_ghost"], [1, "ice_spirit"]),
      f("ghost_lights", "Ghost Lights", [3, "ice_ghost"]), f("long_pack", "The Long Pack", [7, "snow_wolf"]), f("drift", "Drift", [2, "snow_wolf"], [2, "ice_spirit"]),
    ],
    elite: [f("golem_hall", "Golem Hall", [2, "ice_golem"]), f("golem_gate", "Golem Gate", [1, "ice_golem"], [2, "ice_spirit"]), f("frost_trolls", "Frost Trolls", [2, "troll"], [2, "ice_spirit"])],
    bosses: [f("ice_titan", "The Ice Titan", [1, "ice_titan"]), f("glacier_king", "The Glacier King", [1, "ice_titan"], [2, "snow_wolf"])],
  },
  {
    id: "storm_tower", name: "The Storm Tower", act: 3, knob: { mob: 0, elite: 0, boss: 0 },
    text: "Clouds of sparks, leeches that drink mana, and a queen behind a wall of drones.",
    easy: [f("sparks", "Sparks", [5, "wisp"]), f("leeches", "Leeches", [2, "leech"], [2, "wisp"]), f("drones", "Drones", [3, "drone"])],
    normal: [
      f("wisp_cloud", "Wisp Cloud", [8, "wisp"]), f("wisp_nest", "Wisp Nest", [4, "wisp"], [2, "leech"]), f("leech_den", "Leech Den", [4, "leech"]),
      f("drone_wall", "Drone Wall", [4, "drone"], [2, "wisp"]), f("storm_front", "Storm Front", [2, "drone"], [2, "leech"], [2, "wisp"]),
    ],
    elite: [f("honour_guard", "Honour Guard", [4, "soldier"]), f("sniper_ridge", "Sniper Ridge", [1, "shieldman"], [4, "archer"]), f("lich_pair", "Lich Pair", [1, "mummy"], [2, "lich"])],
    bosses: [f("storm_queen", "The Storm Queen", [1, "storm_queen"], [2, "drone"]), f("hive_queen", "The Hive Queen", [1, "storm_queen"], [4, "drone"])],
  },
  {
    id: "deep_crypt", name: "The Deep Crypt", act: 3, knob: { mob: 0, elite: 0, boss: 0 },
    text: "Beneath the Crypt, something takes every voice. Power that isn't an ability is the key.",
    easy: [f("crypt_guard", "Crypt Guard", [2, "skeleton"], [1, "ghost"]), f("whispers", "Whispers", [2, "wraith"]), f("diggers", "Diggers", [3, "ghoul"])],
    normal: [
      f("grave_watch", "Grave Watch", [1, "bone_priest"], [2, "troll"]), f("lich_lair", "Lich Lair", [1, "lich"], [1, "mummy"]), f("silent_hall", "Silent Hall", [2, "wraith"], [2, "skeleton"]),
      f("quiet_hall", "Quiet Hall", [2, "wraith"], [2, "ghost"]), f("coven", "Coven", [2, "witch"], [2, "wraith"]), f("ghoul_feast", "Ghoul Feast", [4, "ghoul"]),
    ],
    elite: [f("chapel_watch", "Chapel Watch", [2, "bone_priest"], [1, "troll"]), f("lich_court", "Lich Court", [1, "mummy"], [3, "lich"]), f("tomb_lords", "Tomb Lords", [2, "mummy"], [1, "witch"])],
    bosses: [f("silent_one", "The Silent One", [1, "silent_one"]), f("silent_court", "The Silent Court", [1, "silent_one"], [2, "bone_priest"])],
  },
  {
    id: "tower_top", name: "The Tower Top", act: 3, knob: { mob: 0, elite: 0, boss: 0 },
    text: "Above the storm: the queen's drones, the king's soldiers, and the king who rages when they fall.",
    easy: [f("top_sparks", "Sparks", [5, "wisp"]), f("guard_post", "Guard Post", [2, "soldier"]), f("top_drones", "Drones", [3, "drone"])],
    normal: [
      f("court_wisps", "Court Wisps", [6, "wisp"], [2, "leech"]), f("wisp_nest", "Wisp Nest", [4, "wisp"], [2, "leech"]), f("barracks", "Barracks", [3, "soldier"]),
      f("drone_wall", "Drone Wall", [4, "drone"], [2, "wisp"]), f("watch", "The Watch", [2, "soldier"], [2, "drone"]),
    ],
    elite: [f("queens_guard", "The Queen's Guard", [1, "storm_queen"], [2, "drone"]), f("honour_guard", "Honour Guard", [4, "soldier"]), f("leech_den", "Leech Den", [5, "leech"])],
    bosses: [f("storm_king", "The Storm King", [1, "storm_king"]), f("kings_guard", "The King's Guard", [1, "storm_king"], [2, "soldier"])],
  },
];

export const ROGUE_REGIONS: RogueRegion[] = REGIONS.map(withKnobs);

// ─── Legendary pieces: the statuses behind them ──────────────────────────────

const own = (word: keyof typeof STACKS, mult = 1) => ({ scale: [{ ratio: (mult * STACKS[word]) / P / 2, stat: "attack", of: "holder" as const }, { ratio: (mult * STACKS[word]) / P / 2, stat: "magic", of: "holder" as const }] });
const relic = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT => ({ id, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
const apply = (status: string, extra: object = {}) => ({ op: "apply", status, ...extra }) as const;
const both = (pct: NumT) => [{ tag: "physical", pct }, { tag: "magical", pct }];

/** Statuses that legendary pieces give. Stacks scale from the wearer's Attack and Magic together (half of each), so they suit anyone. */
export const rogueStatuses: StatusT[] = [
  // Legendary pass (tuning round 27): every rule measured locked on all run against an ordinary piece of its slot; the
  // ones worth less than an ordinary piece's stats grew (most by a stack word or two).
  relic("lg_ember", "Ember", "Basic attacks add several Burn.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("burn", { stacks: own("several", 1.5), to: "other" })] }] }),
  relic("lg_cleave", "Cleave", "Basic attacks also hit a second, random foe.", { strike: { to: T.secondFoe } }),
  relic("lg_rime", "Rime", "Basic attacks add several Chill.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("chill", { stacks: own("several"), to: "other" })] }] }),
  relic("lg_wounds", "Wounds", "Crits add many Bleed.", { reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [apply("bleed", { stacks: own("many"), to: "other" })] }] }),
  relic("lg_sunder", "Shatter", "Basic attacks add many Sunder.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("sunder", { stacks: own("many"), to: "other" })] }] }),
  relic("lg_song", "Song", "Basic attacks give a random ally some MP and a stack of Might.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "mp", amount: 300, to: { side: "allies", pick: "random" } }, apply("might", { stacks: 1, to: { side: "allies", pick: "random" } })] }] }),
  relic("lg_judge", "Verdict", "Hits deal 60% more damage to foes with a buff.", { boosts: both({ scale: [{ ratio: 60, when: { buffs: true }, of: "target" }] }) }),
  relic("lg_lantern", "Lantern", "When a foe falls, heals a sixth of its own max HP.", { reactions: [{ on: { event: "ko", whose: "foe" }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.16, stat: "max_hp", of: "holder" }] }, to: "self" }] }] }),
  relic("lg_soul", "Soul jar", "When a foe falls, every ally regains some MP and a little HP.", { reactions: [{ on: { event: "ko", whose: "foe" }, do: [{ op: "mp", amount: 500, to: T.everyAlly }, { op: "heal", amount: { scale: [{ ratio: 0.04, stat: "max_hp", of: "target" }] }, to: T.everyAlly }] }] }),
  relic("lg_banner", "Banner", "When the fight starts, every ally gains many Might.", { reactions: [{ on: { event: "fight_start" }, do: [apply("might", { stacks: FLAT_STACKS.many, to: T.everyAlly })] }] }),
  relic("lg_hourglass", "Hourglass", "Hasted for the first 40 ticks of each fight.", { reactions: [{ on: { event: "fight_start" }, do: [apply("haste", { to: "self", duration: 40 })] }] }),
  relic("lg_horn", "Horn", "When the fight starts, every ally gains Regen.", { reactions: [{ on: { event: "fight_start" }, do: [apply("regen", { to: T.everyAlly })] }] }),
  relic("lg_bell", "Bell", "Can't be Silenced or Stunned.", { stats: [{ stat: "immune:status:silence", flat: 1 }, { stat: "immune:status:stun", flat: 1 }] }),
  relic("lg_fury", "Fury", "Below half HP, deals 75% more damage; below a quarter, two and a half times.", { boosts: both({ scale: [{ ratio: 75, when: { hpBelow: 50 } }, { ratio: 75, when: { hpBelow: 25 } }] }) }),
  relic("lg_idol", "Stone idol", "The Geomancer's Bedrock, for anyone: crit chance doubled while its Shield holds. Starts each fight with a Shield of a fifth of its max HP.", {
    reactions: [
      { on: { event: "fight_start" }, do: [apply("shield", { stacks: { scale: [{ ratio: 0.2, stat: "max_hp", of: "holder" }] }, to: "self" })] },
      { on: { event: "status_gained", status: "shield" }, do: [apply("lg_idol_on", { to: "holder" })] },
      { on: { event: "status_ended", status: "shield" }, do: [{ op: "remove", label: "buff", status: "lg_idol_on", to: "holder" }] },
    ],
  }),
  { id: "lg_idol_on", name: "IDOL", text: "Crit chance doubled.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }] },
  relic("lg_brittle", "Shard", "Basic attacks add a Chill; hits deal 12% more damage for each Chill stack on the target.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("chill", { stacks: FLAT_STACKS.one, to: "other" })] }], boosts: both({ scale: [{ ratio: 12, stacks: "chill", of: "target" }] }) }),
  relic("lg_coil", "Coil", "When hit, Shocks the attacker with several stacks.", { reactions: [{ on: { event: "hit_taken" }, do: [apply("shock", { stacks: FLAT_STACKS.several, to: "other" })] }] }), // Step 5g round 6: several (was many): on a wall hit twenty times it dealt 25,574, 30% of a fight.
  relic("lg_frost", "Frozen heart", "When hit, Chills the attacker with a few stacks.", { reactions: [{ on: { event: "hit_taken" }, do: [apply("chill", { stacks: FLAT_STACKS.few, to: "other" })] }] }),
  relic("lg_briar", "Briar", "When hit, the attacker takes several Bleed.", { reactions: [{ on: { event: "hit_taken" }, do: [apply("bleed", { stacks: FLAT_STACKS.several, to: "other" })] }] }),
  relic("lg_spikes", "Spikes", "Thorns equal to a twelfth of its Armor.", { stats: [{ stat: "thorns", flat: { scale: [{ ratio: 0.08, stat: "armor", of: "holder" }] } }] }),
  relic("lg_shade", "Shade", "Hidden for the first 24 ticks of each fight, and deals 80% more damage while Hidden.", { reactions: [{ on: { event: "fight_start" }, do: [apply("hidden", { to: "self", duration: 24 })] }], boosts: both({ scale: [{ ratio: 80, when: { has: "hidden" } }] }) }),
  relic("lg_execute", "Executioner", "Hits deal double damage to foes below half their HP.", { boosts: both({ scale: [{ ratio: 100, when: { hpBelow: 50 }, of: "target" }] }) }),
  relic("lg_storm", "Storm edge", "Basic attacks also hit a second, random foe, and Shock both.", {
    strike: { to: T.secondFoe },
    reactions: [
      { on: { event: "hit_lands", kind: "basic" }, do: [apply("shock", { stacks: own("few", 1.5), to: "other" })] },
      { on: { event: "hit_lands", kind: "extra" }, do: [apply("shock", { stacks: own("few", 1.5), to: "other" })] },
    ],
  }),
  relic("lg_hunter", "Hunter", "Basic attacks add a few Bleed; hits deal 50% more damage to foes that bleed.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("bleed", { stacks: own("few"), to: "other" })] }], boosts: both({ scale: [{ ratio: 50, when: { has: "bleed" }, of: "target" }] }) }),
  relic("lg_grave", "Gravecaller", "When a foe falls, gains many Might.", { reactions: [{ on: { event: "ko", whose: "foe" }, do: [apply("might", { stacks: FLAT_STACKS.many, to: "self" })] }] }),
  relic("lg_cinder", "Cinder", "Basic attacks add a few Burn; hits deal 60% more damage to foes that burn.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("burn", { stacks: own("few", 1.5), to: "other" })] }], boosts: both({ scale: [{ ratio: 60, when: { has: "burn" }, of: "target" }] }) }),
];

// ─── Legendary pieces ────────────────────────────────────────────────────────

const legend = (id: string, name: string, text: string, slot: GearT["slot"], o: { statuses?: string[]; stats?: Change[]; weight?: GearT["weight"]; weapon?: GearT["weapon"] }): GearT => ({
  id, name, text, slot, tier: "powerful", source: "unlock", ...(o.weight ? { weight: o.weight } : {}), ...(o.weapon ? { weapon: o.weapon } : {}),
  ...(o.stats?.length ? { stats: o.stats } : {}), ...(o.statuses?.length ? { statuses: o.statuses } : {}),
});
/** A legendary weapon is its kind's plain one (the same swing), with what it bends on top. */
export type LegendWeapon = { id: string; name: string; text: string; kind: string; statuses: string[]; stats?: Change[] };

/** Legendary armor and amulets, new to the rogue mode. Weapons are below, built on their kind's plain weapon. */
export const rogueGear: GearT[] = [
  legend("ember_sigil", "Ember sigil", "Every basic attack sets a fire.", "amulet", { statuses: ["lg_ember"] }),
  legend("cleaving_charm", "Cleaving charm", "Every basic attack carries on into a second foe.", "amulet", { statuses: ["lg_cleave"] }),
  legend("rime_sigil", "Rime sigil", "Every basic attack leaves frost.", "amulet", { statuses: ["lg_rime"] }),
  legend("wound_sigil", "Wound sigil", "Every crit opens a wound.", "amulet", { statuses: ["lg_wounds"], stats: [critStep(2), st("max_hp", 1)] }),
  legend("shatter_sigil", "Shatter sigil", "Every basic attack sunders the foe.", "amulet", { statuses: ["lg_sunder"], stats: [st("attack", 1)] }),
  legend("siren_shell", "Siren shell", "Every basic attack sings an ally a little mana.", "amulet", { statuses: ["lg_song"], stats: [st("max_hp", 1)] }),
  legend("crown_of_judgement", "Crown of judgement", "Strikes hardest at whatever has been lifted up.", "amulet", { statuses: ["lg_judge"] }),
  legend("grave_lantern", "Grave lantern", "Each foe that falls gives back a little life.", "amulet", { statuses: ["lg_lantern"] }),
  legend("soul_jar", "Soul jar", "Each foe that falls fills the party's mana.", "amulet", { statuses: ["lg_soul"] }),
  legend("war_banner", "War banner", "The whole party starts each fight with Might.", "amulet", { statuses: ["lg_banner"] }),
  legend("hourglass", "Hourglass", "Its wearer starts each fight Hasted.", "amulet", { statuses: ["lg_hourglass"] }),
  legend("herald_horn", "Herald's horn", "The whole party starts each fight with Regen.", "amulet", { statuses: ["lg_horn"] }),
  legend("silver_bell", "Silver bell", "Nothing silences its wearer.", "amulet", { statuses: ["lg_bell"], stats: [st("mp_regen", 1), st("magic", 1)] }),
  legend("berserker_torc", "Berserker's torc", "Hits harder the closer its wearer is to falling.", "amulet", { statuses: ["lg_fury"] }),
  legend("stone_idol", "Stone idol", "Crits twice as often behind a Shield.", "amulet", { statuses: ["lg_idol"], stats: [critStep(1)] }),
  legend("frost_shard", "Frost shard", "Hits harder the colder the foe.", "amulet", { statuses: ["lg_brittle"], stats: [st("max_hp", 1)] }),
  legend("static_coil", "Static coil", "Whatever hits its wearer is shocked.", "amulet", { statuses: ["lg_coil"], stats: [st("max_hp", 1)] }),
  legend("frozen_heart", "Frozen heart", "Plate that chills whatever strikes it.", "armor", { weight: "heavy", statuses: ["lg_frost"], stats: [st("armor", 1)] }),
  legend("briar_coat", "Briar coat", "Whatever strikes it starts to bleed.", "armor", { weight: "medium", statuses: ["lg_briar"], stats: [st("max_hp", 1)] }),
  legend("spiked_bulwark", "Spiked bulwark", "The more plate, the more spikes.", "armor", { weight: "heavy", statuses: ["lg_spikes"], stats: [st("armor", 1)] }),
  legend("shadow_cowl", "Shadow cowl", "Its wearer starts each fight unseen.", "armor", { weight: "medium", statuses: ["lg_shade"], stats: [sp("evasion", "medium"), st("max_hp", 1)] }),
];

export const rogueWeapons: LegendWeapon[] = [
  { id: "headsman_axe", name: "Headsman's axe", text: "Finishes what's already falling.", kind: "axe", statuses: ["lg_execute"] },
  { id: "stormbrand", name: "Stormbrand", text: "A sword that arcs to a second foe and shocks both.", kind: "sword", statuses: ["lg_storm"] },
  { id: "frostfang", name: "Frostfang", text: "A dagger that chills every cut.", kind: "dagger", statuses: ["lg_rime"], stats: [st("attack", 1)] },
  { id: "hunters_bow", name: "Hunter's bow", text: "Hits a bleeding quarry far harder.", kind: "bow", statuses: ["lg_hunter"], stats: [st("attack", 1)] },
  { id: "gravecaller", name: "Gravecaller", text: "Each fall makes it stronger.", kind: "dark_staff", statuses: ["lg_grave"], stats: [st("magic", 1)] },
  { id: "cinder_rod", name: "Cinder rod", text: "Lightning that hits burning foes harder.", kind: "lightning_staff", statuses: ["lg_cinder"], stats: [st("magic", 1)] },
  { id: "brand_of_kings", name: "Brand of kings", text: "A spear that strikes hardest at whatever has been lifted up.", kind: "spear", statuses: ["lg_judge"] },
  { id: "earthshaker", name: "Earthshaker", text: "An earth staff that leaves what it strikes sundered.", kind: "earth_staff", statuses: ["lg_sunder"], stats: [st("magic", 1)] },
];

/** The legendary pool: the core set's powerful pieces and the rogue mode's own. */
export const LEGENDARY_BASES = [
  "heartwood_staff", "sanguine_staff", "cornerstone_axe", "needle", "mist_claws", "glacier_staff", "templar_staff",
  "thornheart_plate", "wraith_leathers", "archmages_robes", "twin_soul_charm", "vampires_tooth", "thirsting_jewel", "glass_heart",
];

/**
 * Who each legendary piece is for: the designer's reading of its rule against the classes that can wear it. An elite's
 * trophy comes from pieces aimed at the party (a playtester won Archmage's robes with no caster, and a dagger for a bow
 * Ranger), a recruit leans toward a class a piece in the bag is for, and a card says FOR.
 */
export const LEGENDARY_AIMS: Record<string, string[]> = {
  heartwood_staff: ["bramble_knight", "geomancer"], sanguine_staff: ["vampire", "hexer"], cornerstone_axe: ["knight", "geomancer"],
  needle: ["assassin", "ranger"], mist_claws: ["monk", "vampire"], glacier_staff: ["frostweaver", "hexer"], templar_staff: ["paladin", "valkyrie"],
  thornheart_plate: ["bramble_knight", "knight", "hoplite"], wraith_leathers: ["monk", "assassin", "ranger"],
  archmages_robes: ["pyromancer", "frostweaver", "stormcaller", "cleric", "hexer"], twin_soul_charm: ["vampire", "monk"],
  vampires_tooth: ["vampire", "monk", "assassin"], thirsting_jewel: ["paladin", "valkyrie", "geomancer", "bard"], glass_heart: ["assassin", "ranger", "geomancer"],
  ember_sigil: ["monk", "ranger", "pyromancer"], cleaving_charm: ["monk", "ranger", "assassin", "knight"], rime_sigil: ["frostweaver", "monk", "ranger"],
  wound_sigil: ["assassin", "ranger"], shatter_sigil: ["monk", "knight", "hoplite"], siren_shell: ["bard", "monk"], crown_of_judgement: ["paladin", "assassin"],
  grave_lantern: ["knight", "bramble_knight", "hoplite"], soul_jar: ["cleric", "pyromancer", "stormcaller", "geomancer"], war_banner: ["knight", "valkyrie", "bard"],
  hourglass: ["pyromancer", "stormcaller", "assassin"], herald_horn: ["cleric", "bard", "knight"], silver_bell: ["pyromancer", "stormcaller", "frostweaver"],
  berserker_torc: ["vampire", "monk"], stone_idol: ["geomancer", "knight"], frost_shard: ["frostweaver", "hexer"], static_coil: ["knight", "hoplite", "bramble_knight"],
  frozen_heart: ["knight", "hoplite", "bramble_knight"], briar_coat: ["valkyrie", "ranger", "monk"], spiked_bulwark: ["knight", "hoplite"],
  shadow_cowl: ["assassin", "ranger", "bard"], headsman_axe: ["knight", "geomancer"], stormbrand: ["knight", "valkyrie", "assassin"],
  frostfang: ["assassin", "ranger", "bard"], hunters_bow: ["ranger", "bard"], gravecaller: ["hexer", "vampire"], cinder_rod: ["pyromancer", "stormcaller"],
  brand_of_kings: ["valkyrie", "hoplite", "monk"], earthshaker: ["geomancer", "bramble_knight"],
};

// ─── Affixes: what makes a piece uncommon (one) or rare (two) ────────────────

export type RogueAffix = { id: string; prefix: string; suffix: string; stats: Change[] };
export const ROGUE_AFFIXES: RogueAffix[] = [
  { id: "hp", prefix: "Sturdy", suffix: "of the Bear", stats: [st("max_hp", 1)] },
  { id: "armor", prefix: "Plated", suffix: "of the Tortoise", stats: [st("armor", 1)] },
  { id: "attack", prefix: "Keen", suffix: "of the Wolf", stats: [st("attack", 1)] },
  { id: "magic", prefix: "Arcane", suffix: "of the Owl", stats: [st("magic", 1)] },
  { id: "regen", prefix: "Flowing", suffix: "of the Spring", stats: [st("mp_regen", 1)] },
  { id: "mp", prefix: "Deep", suffix: "of the Well", stats: [st("max_mp", 1)] },
  { id: "crit", prefix: "Lucky", suffix: "of the Fox", stats: [critStep(1)] },
  { id: "quiet", prefix: "Quiet", suffix: "of Shadows", stats: [st("aggro", -1)] },
  { id: "bold", prefix: "Bold", suffix: "of the Lion", stats: [st("aggro", 1), st("max_hp", 1)] },
  { id: "thorns", prefix: "Thorned", suffix: "of Thorns", stats: [sp("thorns", "medium")] },
  { id: "lifesteal", prefix: "Thirsty", suffix: "of the Leech", stats: [sp("lifesteal", "medium")] },
  { id: "evasion", prefix: "Nimble", suffix: "of the Cat", stats: [sp("evasion", "medium")] },
  { id: "accuracy", prefix: "True", suffix: "of the Hawk", stats: [sp("accuracy", "medium")] },
  { id: "double", prefix: "Twin", suffix: "of Echoes", stats: [sp("double_strike", "medium")] },
  { id: "critdmg", prefix: "Cruel", suffix: "of Ruin", stats: [sp("crit_damage", "medium")] },
  { id: "siphon", prefix: "Draining", suffix: "of the Moth", stats: [sp("siphon", "medium")] },
  { id: "fireproof", prefix: "Fireproof", suffix: "of Embers", stats: [{ stat: "resist:fire", flat: RESIST.gear }] },
  { id: "frostproof", prefix: "Frostproof", suffix: "of Winter", stats: [{ stat: "resist:ice", flat: RESIST.gear }] },
  { id: "stormproof", prefix: "Grounded", suffix: "of the Storm", stats: [{ stat: "resist:lightning", flat: RESIST.gear }] },
  { id: "darkproof", prefix: "Hallowed", suffix: "of Dusk", stats: [{ stat: "resist:dark", flat: RESIST.gear }] },
];

// ─── Events: the "?" rooms ───────────────────────────────────────────────────

/**
 * What an event's option does, in a few verbs. `chance` rolls on the run's dice. HP and MP are percent of each standing
 * member's max; `one` hits a random standing member instead of everyone.
 */
export type EventOp =
  | { op: "gold"; amount: number }
  | { op: "hp"; pct: number; one?: boolean }
  | { op: "mp"; pct: number }
  | { op: "gear"; rarity: "common" | "uncommon" | "rare" | "legendary" }
  | { op: "recruit"; hp?: number; known?: number; gear?: "common" | "uncommon" | "rare" | "legendary" }
  | { op: "learn" }
  | { op: "upgrade" }
  | { op: "temper" }
  | { op: "formation"; rarity?: "common" | "uncommon" | "rare" | "legendary" }
  | { op: "seat" }
  | { op: "train"; n: number }
  | { op: "muster"; n: number; known?: number }
  | { op: "trade" }
  | { op: "supply"; id: "potion" | "tonic" | "phoenix" }
  | { op: "fight"; tier: "normal" | "elite" }
  | { op: "camp" }
  | { op: "chance"; pct: number; then: EventOp[]; else: EventOp[] };
export type EventOption = { id: string; label: string; text: string; gold?: number; do: EventOp[] };
export type RogueEvent = { id: string; name: string; text: string; options: EventOption[]; variants?: { text?: string; options: EventOption[] }[] };

export const ROGUE_EVENTS: RogueEvent[] = [
  {
    id: "wounded_traveller", name: "A Wounded Traveller", text: "Someone lies hurt by the road, a weapon still in hand. They look like they can fight.",
    options: [
      { id: "take", label: "TAKE THEM IN", text: "They join you, hurt: a third of their HP.", do: [{ op: "recruit", hp: 33 }] },
      { id: "rob", label: "TAKE THEIR PURSE", text: "+40 gold.", do: [{ op: "gold", amount: 40 }] },
      { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
    ],
  },
  {
    id: "blood_shrine", name: "A Blood Shrine", text: "An altar, a bowl, and something glinting under the stone. The shrine wants blood.",
    options: [
      { id: "bleed", label: "OFFER BLOOD", text: "Everyone loses 20% of max HP. A rare piece.", do: [{ op: "hp", pct: -20 }, { op: "gear", rarity: "rare" }] },
      { id: "pray", label: "PRAY", text: "Everyone recovers 15% of max HP.", do: [{ op: "hp", pct: 15 }] },
      { id: "leave", label: "LEAVE", text: "Nothing happens.", do: [] },
    ],
  },
  {
    id: "gambler", name: "The Gambler", text: "A grinning stranger with a pair of bone dice. \"Double or nothing?\"",
    options: [
      { id: "bet", label: "BET 40 GOLD", text: "Half the time, win 100 back.", gold: 40, do: [{ op: "chance", pct: 50, then: [{ op: "gold", amount: 100 }], else: [] }] },
      { id: "leave", label: "WALK AWAY", text: "Nothing happens.", do: [] },
    ],
  },
  {
    id: "forge", name: "An Abandoned Forge", text: "The coals are still warm. A smith could make something better here.",
    options: [
      { id: "temper", label: "TEMPER A PIECE", text: "A piece of your choice gains a rarity: common to uncommon, uncommon to rare.", do: [{ op: "temper" }] },
      { id: "scrap", label: "SCRAP FOR GOLD", text: "+30 gold from the scrap heap.", do: [{ op: "gold", amount: 30 }] },
    ],
  },
  {
    id: "old_master", name: "The Old Master", text: "An old fighter sits by a fire. \"I could teach one of you something. It will hurt.\"",
    options: [
      { id: "learn", label: "LEARN THE HARD WAY", text: "One member learns an ability; everyone loses 10% of max HP.", do: [{ op: "learn" }, { op: "hp", pct: -10 }] },
      { id: "polish", label: "PAY 50 TO PRACTISE", text: "One member's ability gets better (+).", gold: 50, do: [{ op: "upgrade" }] },
      { id: "leave", label: "LEAVE HIM BE", text: "Nothing happens.", do: [] },
    ],
  },
  {
    id: "ambush", name: "Ambush!", text: "The road narrows between two rocks. Something is waiting up there.",
    options: [
      { id: "fight", label: "FIGHT", text: "A hard fight, with an elite's spoils.", do: [{ op: "fight", tier: "elite" }] },
      { id: "run", label: "RUN FOR IT", text: "Everyone loses 10% of max HP.", do: [{ op: "hp", pct: -10 }] },
    ],
  },
  {
    id: "spring", name: "A Clear Spring", text: "Cold water bubbles up through the stones. It tastes of mana.",
    options: [
      { id: "drink", label: "DRINK", text: "Everyone recovers 50% of max MP and 10% of max HP.", do: [{ op: "mp", pct: 50 }, { op: "hp", pct: 10 }] },
      { id: "bottle", label: "BOTTLE IT", text: "A tonic for later.", do: [{ op: "supply", id: "tonic" }] },
    ],
  },
  {
    id: "strange_chest", name: "A Strange Chest", text: "A chest in the middle of the road, unlocked. Too easy?",
    options: [
      { id: "open", label: "OPEN IT", text: "Two times in three, a legendary piece. Otherwise it bites: a hard fight.", do: [{ op: "chance", pct: 67, then: [{ op: "gear", rarity: "legendary" }], else: [{ op: "fight", tier: "elite" }] }] },
      { id: "leave", label: "LEAVE IT", text: "Nothing happens.", do: [] },
    ],
  },
  {
    id: "camp", name: "An Empty Camp", text: "Someone left in a hurry: the fire is still burning, the bedrolls still laid out.",
    options: [
      { id: "camp", label: "MAKE CAMP", text: "A campfire: rest, focus, raise or train.", do: [{ op: "camp" }] },
      { id: "search", label: "SEARCH THE PACKS", text: "A potion, a tonic or a phoenix feather, and 20 gold.", do: [{ op: "gold", amount: 20 }, { op: "chance", pct: 40, then: [{ op: "supply", id: "potion" }], else: [{ op: "chance", pct: 50, then: [{ op: "supply", id: "tonic" }], else: [{ op: "supply", id: "phoenix" }] }] }] },
    ],
    // Step 5h round 6: its version with a seat at camp is gone (seats come with each act).
  },
  {
    id: "pilgrims", name: "Pilgrims", text: "A band of pilgrims with a healer among them. \"For a donation…\"",
    options: [
      { id: "donate", label: "DONATE 40", text: "Everyone recovers 40% of max HP, and one fallen member rises at half HP (with nobody down, the healer gives you a phoenix feather).", gold: 40, do: [{ op: "hp", pct: 40 }, { op: "supply", id: "phoenix" }] },
      { id: "leave", label: "PASS BY", text: "Nothing happens.", do: [] },
    ],
  },
  // Step 5h: the Drill Yard and the Fallen Standard became the Drill ground (a room) and the Old Banner. Six events around the
  // roster, each rolling one of its versions on entering, so a known event can still surprise.
  {
    id: "deserter", name: "A Deserter", text: "A soldier slumps against a milestone, still in uniform. \"I'm done with them. Not with fighting.\"",
    options: [
      { id: "take", label: "TAKE THEM IN", text: "They join you at half HP, with an uncommon piece suited to them.", do: [{ op: "recruit", hp: 50, gear: "uncommon" }] },
      { id: "turn", label: "TURN THEM IN", text: "+50 gold.", do: [{ op: "gold", amount: 50 }] },
    ],
    variants: [
      { options: [
        { id: "take", label: "TAKE THEM IN", text: "They join you at half HP, with an uncommon piece suited to them.", do: [{ op: "recruit", hp: 50, gear: "uncommon" }] },
        { id: "turn", label: "TURN THEM IN", text: "+50 gold.", do: [{ op: "gold", amount: 50 }] },
      ] },
      { text: "An officer, by the look of the blade at their hip, bleeding from a wound they won't explain.", options: [
        { id: "take", label: "TAKE THEM IN", text: "They join you at a third of their HP, knowing two abilities, with a rare piece suited to them.", do: [{ op: "recruit", hp: 33, known: 2, gear: "rare" }] },
        { id: "blade", label: "TAKE THE BLADE", text: "A rare piece; they limp off.", do: [{ op: "gear", rarity: "rare" }] },
      ] },
    ],
  },
  {
    id: "mercenaries", name: "Mercenaries", text: "A company of sellswords around a crossroads fire. \"Coin first.\"",
    options: [
      { id: "hire", label: "HIRE ONE FOR 60", text: "Pick one of three recruits.", gold: 60, do: [{ op: "muster", n: 3 }] },
      { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
    ],
    variants: [
      { options: [
        { id: "hire", label: "HIRE ONE FOR 60", text: "Pick one of three recruits.", gold: 60, do: [{ op: "muster", n: 3 }] },
        { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
      ] },
      { text: "Veterans, scarred and expensive. \"We know our trade.\"", options: [
        { id: "hire", label: "HIRE ONE FOR 110", text: "Pick one of two recruits who know all three abilities.", gold: 110, do: [{ op: "muster", n: 2, known: 3 }] },
        { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  {
    id: "prisoner_cart", name: "A Prisoner Cart", text: "A cart with a cage on the back, two guards dozing beside it. The prisoner watches you.",
    options: [
      { id: "free", label: "FREE THE PRISONER", text: "They join you, and the guards wake: a fight.", do: [{ op: "recruit" }, { op: "fight", tier: "normal" }] },
      { id: "pass", label: "LET IT PASS", text: "Nothing happens.", do: [] },
    ],
    variants: [
      { options: [
        { id: "free", label: "FREE THE PRISONER", text: "They join you, and the guards wake: a fight.", do: [{ op: "recruit" }, { op: "fight", tier: "normal" }] },
        { id: "pass", label: "LET IT PASS", text: "Nothing happens.", do: [] },
      ] },
      { text: "A cart with a cage on the back, and an escort of hard-looking guards. The prisoner wears an old company's colours.", options: [
        { id: "free", label: "FREE THE PRISONER", text: "They join you knowing two abilities, and the escort attacks: a hard fight, with an elite's spoils.", do: [{ op: "recruit", known: 2 }, { op: "fight", tier: "elite" }] },
        { id: "pass", label: "LET IT PASS", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  {
    id: "rival_company", name: "A Rival Company", text: "Another party shares the road. Their captain eyes your newest recruit. \"A trade? One of yours for one of ours, sight unseen.\"",
    options: [
      { id: "trade", label: "TRADE", text: "Your newest member (never the leader) leaves; their gear stays in your bag. One of theirs joins, knowing all three abilities.", do: [{ op: "trade" }] },
      { id: "decline", label: "DECLINE", text: "Nothing happens.", do: [] },
    ],
    variants: [
      { options: [
        { id: "trade", label: "TRADE", text: "Your newest member (never the leader) leaves; their gear stays in your bag. One of theirs joins, knowing all three abilities.", do: [{ op: "trade" }] },
        { id: "decline", label: "DECLINE", text: "Nothing happens.", do: [] },
      ] },
      { text: "Another party shares the road, short of hands and long on coin. \"A trade, and we'll pay for it.\"", options: [
        { id: "trade", label: "TRADE FOR 60", text: "Your newest member (never the leader) leaves; their gear stays in your bag. One of theirs joins, knowing all three abilities, and +60 gold.", do: [{ op: "trade" }, { op: "gold", amount: 60 }] },
        { id: "decline", label: "DECLINE", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  {
    id: "old_banner", name: "An Old Banner", text: "A war banner, half-buried in the mud. Its company's drill is written on the back.",
    options: [
      { id: "take", label: "TAKE THE DRILL", text: "A rare formation.", do: [{ op: "formation", rarity: "rare" }] },
      { id: "sell", label: "SELL THE BANNER", text: "+45 gold.", do: [{ op: "gold", amount: 45 }] },
    ],
    variants: [
      { options: [
        { id: "take", label: "TAKE THE DRILL", text: "A rare formation.", do: [{ op: "formation", rarity: "rare" }] },
        { id: "sell", label: "SELL THE BANNER", text: "+45 gold.", do: [{ op: "gold", amount: 45 }] },
      ] },
      { text: "A torn pennant on a broken spear, a few lines of drill still legible.", options: [
        { id: "take", label: "TAKE THE DRILL", text: "A common formation and 20 gold from the spear's fittings.", do: [{ op: "formation", rarity: "common" }, { op: "gold", amount: 20 }] },
        { id: "sell", label: "SELL THE SPEAR", text: "+30 gold.", do: [{ op: "gold", amount: 30 }] },
      ] },
      { text: "A great standard, still upright, ringed by the bones of those who held it. The ground around it is cursed.", options: [
        { id: "take", label: "DIG IT OUT", text: "Everyone loses 15% of max HP. A formation of the highest rarity there is.", do: [{ op: "hp", pct: -15 }, { op: "formation", rarity: "legendary" }] },
        { id: "leave", label: "LEAVE IT", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  {
    id: "training_hall", name: "A Training Hall", text: "Practice dummies, a rack of blunted weapons, and a sergeant with a whistle.",
    options: [
      { id: "train", label: "TRAIN FOR 50", text: "Two members each learn an ability or make one better (+).", gold: 50, do: [{ op: "train", n: 2 }] },
      { id: "watch", label: "WATCH", text: "One member learns an ability.", do: [{ op: "learn" }] },
    ],
    variants: [
      { options: [
        { id: "train", label: "TRAIN FOR 50", text: "Two members each learn an ability or make one better (+).", gold: 50, do: [{ op: "train", n: 2 }] },
        { id: "watch", label: "WATCH", text: "One member learns an ability.", do: [{ op: "learn" }] },
      ] },
      { text: "The sergeant drills anyone who walks in, for free, and hard.", options: [
        { id: "train", label: "TAKE THE DRILL", text: "Two members each learn an ability or make one better (+); everyone loses 15% of max HP.", do: [{ op: "hp", pct: -15 }, { op: "train", n: 2 }] },
        { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
];
