/**
 * The rogue mode (steps/05-core-set/5d-rogue): the core set as a roguelite. A run is three acts on Slay the Spire's
 * structure: a map of branching paths through a themed region, a boss at its end, and the next region picked from two.
 * The party is a leader the player owns plus two drafted companions; it grows through gear, abilities learned one at a
 * time, formations, and classes recruited along the way. HP, MP and knockouts carry from fight to fight; campfires and
 * the shop are the only relief, and each act begins restored.
 *
 * This file is the content: the regions and their encounters, the events and every number the run uses. src/rogue.ts
 * is the rules that read it.
 *
 * Step 5i (the build's retire share): the rogue's own loot is gone: its 29 legendary pieces (21 armors and amulets, 8
 * weapons) and the 27 statuses behind them, the legendary pool and its aims, the 16 affixes, and the provisional formation
 * rarities. The pieces, formations and upgrades of steps/05-core-set/5i-synergy/fill/ take their place.
 */
import type { RogueConfigT, RogueNodeKindT } from "../../src/schema.js";
import { enc } from "./dungeons.js";
import fightKnobs from "./rogue-knobs.json" with { type: "json" };

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
  /**
   * The Muster: a pick of one of two recruits. The Drill ground: one of two formations, or members trained. Step 5i (the director's:
   * a fresh unit needs about ten trainings now, so every training opportunity gives three): three trained (was two).
   */
  muster: { offers: 2 },
  drill: { offers: 2, train: 3 },
  /** Step 5i: a lesson (a captive's or a stranger's) trains three members, each once (was one), as every training opportunity. */
  lesson: 3,
  /**
   * Step 5i (builds.md, "Gear"): an offered piece's slot comes first, weapons and offhands 30% each, armor 25%, amulets 15%; then a
   * class, as step 5h (the roster's, a third of spoils and chests for classes off it), a kind it wears there, the rarity, a piece.
   */
  slots: { weapon: 30, offhand: 30, armor: 25, amulet: 15 },
  /** Formation offers roll a rarity by act. */
  formationOdds: [{ common: 70, rare: 28, legendary: 2 }, { common: 45, rare: 45, legendary: 10 }, { common: 25, rare: 55, legendary: 20 }],
  /**
   * The map of an act: `floors` floors and the boss above them, `width` columns, `paths` paths walked up from the bottom
   * (Slay the Spire's generator). Fixed floors; then room odds for the rest, with elites and campfires kept off the first
   * floors, and no elite, campfire or shop straight after another of its kind.
   *
   * Step 5h round 6 (the director's: two fights before a boss, "the map is filled with sort of dead spots"; design-round-6.md):
   * 12 floors (were 9), the Muster and the Drill ground folded into other rewards, campfires guaranteed only before the boss
   * (about two more a map, on about a third of paths); a path has 4.9 regular fights and 0.9 elites (were 2.1 and 0.7).
   * `easyTo`: the easy pool's last floor (a start's fights, floors 1 to 3). `ref`: each pool's reference floor, where its fights'
   * own knobs hold; the act's climb (`knobs[].step`, and `early` below the reference) moves them from there.
   */
  map: {
    floors: 12, width: 5, paths: 5,
    fixed: { 1: "fight", 7: "treasure", 12: "campfire" } as Record<string, RogueNodeKindT>,
    odds: { fight: 50, event: 27, elite: 11, campfire: 6, shop: 4 } as Record<string, number>,
    lateFrom: 5,
    ensure: { shop: 2, elite: 2, campfire: 2 },
    // Round 6 (the director's: "75 or 80% of paths should pass one"): mid-act campfires added until 60% of the ways up pass one, which
    // lands at 79% of paths over many maps (a map's median 78%), since one campfire serves many ways up.
    campPaths: 60,
    easyTo: 3,
    ref: { easy: 1, normal: 7, elite: 8 },
  },
  /** Gold for a win: [min, max], plus `perAct` × (act − 1). Round 6: a regular fight 7–12 (was 12–20), with twice the fights. */
  gold: { fight: [7, 12], elite: [50, 65], boss: [90, 110], perAct: 5 },
  /**
   * Spoils: after a fight, pick one of `count` (or none). Each is gear unless it rolls a tome (a member learns an
   * ability) or a recruit. An elite also pays a trophy, a legendary piece won outright (Slay the Spire's elite relic). Gear rolls its rarity from the table. `usable`: the share of gear rolled from what someone
   * in the roster can use; the rest is anything (the piece that wants a class you don't have yet).
   */
  spoils: {
    // Step 5h (the director's: enough loot to fill the seats and build; legendaries "by orders of magnitude"): a pick of three,
    // gear in 60% of fights and mixed with a tome or a formation in 40%; no supplies (every won fight already drops one); no
    // recruits (they have their own rooms). A full run should take about 28 pieces and 12 legendaries (design.md).
    // Round 6 (the director's: choices between kinds "too often"): mixed picks in 15% of fights (were 40%).
    // Round 6, the 12-floor map: a regular fight's pieces 6% legendary (were 13%), so legendaries offered a run hold with twice the fights.
    // Round 6 (batch 3): a mixed pick can hold a sealed piece (rare or better, unseen) or a bundle (a common piece and a supply).
    // Step 5i (builds.md, "Gear": a third more gear for the fourth slot, about 37 pieces taken and 110 seen a run; the director: "It's
    // better to have too much than not enough"): 70% of regular fights pay a second pick of three pieces (`extra`).
    fight: { count: 3, rarity: { common: 35, uncommon: 32, rare: 27, legendary: 6 }, tome: 0, recruit: 0, supply: 0, mixed: 15, mix: { tome: 30, formation: 25, recruit: 0, sealed: 25, bundle: 20 }, extra: 70 },
    // Round 6 (the director's: "elites have a pick of a legendary and a pick of a formation"; formations "came too late in most runs"):
    // a pick of three legendaries, one aimed at the party, then a pick of two formations. Was a legendary won outright, then a pick
    // of three rares and legendaries.
    elite: { count: 3, aimed: 1, rarity: { common: 0, uncommon: 0, rare: 0, legendary: 100 }, tome: 0, recruit: 0, supply: 0, formations: 2 },
    // A third of offered gear is for a class not in the roster, so a piece can make you want a class (was none: 0.05 a run).
    offRoster: 33,
  },
  /**
   * The boss's boon: pick one of a legendary piece, a formation and a recruit. The next act starts restored, and everyone learns.
   * Step 5h round 6: seats come with each act (benchByAct), not from the boon. Step 5i (builds.md: mythics "offered in act II and
   * III boss boons"): the boons that open acts II and III (after act I's and act II's bosses; act III's ends the run) offer a mythic
   * in the legendary piece's place, for a roster member's class, the party first, while one is left that the run doesn't hold.
   */
  boon: { count: 3, seat: false, mythic: [2, 3] },
  /** A chest: one piece, rare or better, and some gold; or a cage, a recruit with a piece suited to it. */
  // Round 6: a chest's piece legendary 30 times in 80 (was 45), rare the rest.
  treasure: { rarity: { common: 0, uncommon: 0, rare: 50, legendary: 30 }, gold: [15, 35], cage: 20 },
  /** The campfire: one pick of REST, FOCUS, RAISE or TRAIN (two members); those at camp get half a REST whatever the pick. */
  // Step 5h: the bench's MP comes after every fight now, so the camp's share is HP only; the reserves rule is gone (a wipe is
  // a wipe, now that the party can be changed before any fight); a stranger at the fire sometimes asks to join.
  // Round 6 (the director's: four options, three of them sustain, RAISE often forced, so TRAIN never; design-round-6.md §3): on
  // arrival everyone, party and camp, recovers `auto` (HP and MP, the fallen rise); then one pick of two, REST (everyone `hp` and `mp`
  // again) or TRAIN (`train` members). The stranger can be taken in or turned away for a lesson, apart from the pick.
  // Then (the director's, on the first build: "decrease the free MP share right off the bat ... We weren't trying to give more free
  // MP. We were trying to give less of a terrible choice"): the free MP 10% (was 25%); REST still gives 25% of each.
  // Step 5i: TRAIN trains three members, each once: learning an ability, or an ability's or the passive's power step or version.
  campfire: { hp: 25, mp: 25, revive: 25, auto: { hp: 25, mp: 10, revive: 25 }, train: 3, stranger: 30 },
  // Round 6 (the director's: recruits too hard to get in act I; "the thematic tying of humans or people to recruits ... as long as
  // it's not every other fight"): after a won fight with people in it, sometimes a captive, free on top of the spoils: taken in (at
  // `hp`%), turned into a lesson, or let go. Never two fights running.
  captive: { chance: 20, hp: 50, people: ["bandit", "archer", "shieldman", "witch", "soldier"] },
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
  // Step 5i (a third more gear): 8 pieces in act I and 9 after (were 6 and 7): a common and a rare more.
  shop: { gear: { common: 3, uncommon: 2, rare: 2, legendary: 1 }, legendaryByAct: [1, 2, 2], recruits: 1, formations: 1, supplies: 3 },
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
  // Round 6: the climb stretched over 12 floors (6 a floor → 4.5), so an act's top floor is as hard as floor 9 was. `early`: the
  // climb below a pool's reference floor, act I's measured against a party a few rooms in (design-round-6.md §8).
  knobs: [
    // early: measured (npm run rogue:calibrate -- --climb): act I's regular fights against a party a few rooms in (four to pick
    // from, one random ability each, a piece each and a legendary) need their knobs a median 85 lower on floor 4 than at the
    // reference floor 7, against act I's middle as a run on the 12-floor map has it (two abilities, two legendaries). (First
    // measured at 25.7 against a weaker middle and a party with no gear: the director then won act I four times of four.)
    { mob: 0, step: 4.5, early: 28.3, elite: 0, boss: 0 },
    { mob: 0, step: 4.5, elite: 0, boss: 0 },
    { mob: 0, step: 4.5, elite: 0, boss: 0 },
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
  /** Later floors' fights grow: from this floor, each pack of two or more may gain one more (to the cap of 8). Round 6: floor 8 of 12 (was 6 of 9). */
  growFrom: 8,
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
  | { op: "recruit"; hp?: number; known?: number; gear?: "common" | "uncommon" | "rare" | "legendary"; healer?: boolean }
  | { op: "learn" }
  | { op: "upgrade" }
  | { op: "temper"; from?: ("common" | "uncommon" | "rare")[]; risk?: number }
  | { op: "revive"; pct: number }
  | { op: "formation"; rarity?: "common" | "uncommon" | "rare" | "legendary" }
  | { op: "seat" }
  | { op: "train"; n: number }
  | { op: "muster"; n: number; known?: number; gear?: "common" | "uncommon" | "rare" | "legendary" }
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
      { id: "lesson", label: "A LESSON", text: "Patched up, they show yours a few tricks before they go: three members each learn an ability or train one.", do: [{ op: "train", n: 3 }] },
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
      { id: "temper", label: "TEMPER A PIECE", text: "A common or uncommon piece of yours becomes one of the next rarity, of its kind.", do: [{ op: "temper" }] },
      { id: "scrap", label: "SCRAP FOR GOLD", text: "+30 gold from the scrap heap.", do: [{ op: "gold", amount: 30 }] },
    ],
  },
  {
    id: "old_master", name: "The Old Master", text: "An old fighter sits by a fire. \"I could teach one of you something. It will hurt.\"",
    options: [
      { id: "learn", label: "LEARN THE HARD WAY", text: "One member learns an ability; everyone loses 10% of max HP.", do: [{ op: "learn" }, { op: "hp", pct: -10 }] },
      { id: "polish", label: "PAY 50 TO PRACTISE", text: "One member trains an ability or its passive: a power step or a version.", gold: 50, do: [{ op: "upgrade" }] },
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
      { id: "lesson", label: "A LESSON", text: "They teach yours their drill and walk on: three members each learn an ability or train one.", do: [{ op: "train", n: 3 }] },
      { id: "turn", label: "TURN THEM IN", text: "+50 gold.", do: [{ op: "gold", amount: 50 }] },
    ],
    variants: [
      { options: [
        { id: "take", label: "TAKE THEM IN", text: "They join you at half HP, with an uncommon piece suited to them.", do: [{ op: "recruit", hp: 50, gear: "uncommon" }] },
        { id: "lesson", label: "A LESSON", text: "They teach yours their drill and walk on: three members each learn an ability or train one.", do: [{ op: "train", n: 3 }] },
        { id: "turn", label: "TURN THEM IN", text: "+50 gold.", do: [{ op: "gold", amount: 50 }] },
      ] },
      { text: "An officer, by the look of the blade at their hip, bleeding from a wound they won't explain.", options: [
        { id: "take", label: "TAKE THEM IN", text: "They join you at a third of their HP, knowing two abilities, with a rare piece suited to them.", do: [{ op: "recruit", hp: 33, known: 2, gear: "rare" }] },
        { id: "lesson", label: "A LESSON", text: "They teach yours an officer's drill and walk on: three members each learn an ability or train one.", do: [{ op: "train", n: 3 }] },
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
      { id: "train", label: "TRAIN FOR 50", text: "Three members each learn an ability or train one.", gold: 50, do: [{ op: "train", n: 3 }] },
      { id: "watch", label: "WATCH", text: "One member learns an ability.", do: [{ op: "learn" }] },
    ],
    variants: [
      { options: [
        { id: "train", label: "TRAIN FOR 50", text: "Three members each learn an ability or train one.", gold: 50, do: [{ op: "train", n: 3 }] },
        { id: "watch", label: "WATCH", text: "One member learns an ability.", do: [{ op: "learn" }] },
      ] },
      { text: "The sergeant drills anyone who walks in, for free, and hard.", options: [
        { id: "train", label: "TAKE THE DRILL", text: "Three members each learn an ability or train one; everyone loses 15% of max HP.", do: [{ op: "hp", pct: -15 }, { op: "train", n: 3 }] },
        { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  // Step 5h round 6 (the director's: events are "probably the coolest part of the game ... I wish there was more of these"; a path
  // meets about three an act on the 12-floor map): ten more, leaning on what they liked (a recruit carrying something, raising a
  // piece's rarity, risk against reward) and the shapes they named (an unknown reward, a bundle). design-round-6.md §6.
  {
    id: "master_smith", name: "The Master Smith", text: "A smith with a portable forge and a price for everything. \"Bring me anything. I'll make it better.\"",
    options: [
      { id: "temper", label: "TEMPER", text: "A common or uncommon piece of yours becomes one of the next rarity, of its kind.", gold: 40, do: [{ op: "temper" }] },
      { id: "reforge", label: "REFORGE", text: "A rare piece of yours is reforged into a legendary of its kind.", gold: 120, do: [{ op: "temper", from: ["rare"] }] },
      { id: "scrap", label: "SELL HIM SCRAP", text: "+40 gold.", do: [{ op: "gold", amount: 40 }] },
    ],
    variants: [
      { options: [
        { id: "temper", label: "TEMPER", text: "A common or uncommon piece of yours becomes one of the next rarity, of its kind.", gold: 40, do: [{ op: "temper" }] },
        { id: "reforge", label: "REFORGE", text: "A rare piece of yours is reforged into a legendary of its kind.", gold: 120, do: [{ op: "temper", from: ["rare"] }] },
        { id: "scrap", label: "SELL HIM SCRAP", text: "+40 gold.", do: [{ op: "gold", amount: 40 }] },
      ] },
      { text: "The smith is drunk, cheerful and working for free. \"Give it here. I'll make it sing.\"", options: [
        { id: "try", label: "LET HIM TRY", text: "A piece of yours becomes one of the next rarity, of its kind (a rare one a legendary). Half the time it cracks and is lost.", do: [{ op: "temper", from: ["common", "uncommon", "rare"], risk: 50 }] },
        { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  {
    id: "prisoner_convoy", name: "A Prisoner Convoy", text: "Three prisoners in chains on a cart, their confiscated gear in a sack beside the guards.",
    options: [
      { id: "free", label: "FREE ONE", text: "Pick one of three prisoners, each with a piece from the sack. The guards attack: a fight.", do: [{ op: "muster", n: 3, gear: "uncommon" }, { op: "fight", tier: "normal" }] },
      { id: "bribe", label: "BRIBE THE GUARDS", text: "Pick one of three prisoners, each with a piece from the sack. No fight.", gold: 60, do: [{ op: "muster", n: 3, gear: "uncommon" }] },
      { id: "ride", label: "RIDE ON", text: "Nothing happens.", do: [] },
    ],
    variants: [
      { options: [
        { id: "free", label: "FREE ONE", text: "Pick one of three prisoners, each with a piece from the sack. The guards attack: a fight.", do: [{ op: "muster", n: 3, gear: "uncommon" }, { op: "fight", tier: "normal" }] },
        { id: "bribe", label: "BRIBE THE GUARDS", text: "Pick one of three prisoners, each with a piece from the sack. No fight.", gold: 60, do: [{ op: "muster", n: 3, gear: "uncommon" }] },
        { id: "ride", label: "RIDE ON", text: "Nothing happens.", do: [] },
      ] },
      { text: "A convoy of hardened convicts under heavy guard. One wears an old company's colours.", options: [
        { id: "free", label: "FREE ONE", text: "Pick one of three, each knowing two abilities and carrying a rare piece. The escort attacks: a hard fight, with an elite's spoils.", do: [{ op: "muster", n: 3, known: 2, gear: "rare" }, { op: "fight", tier: "elite" }] },
        { id: "ride", label: "RIDE ON", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  {
    id: "old_soldier", name: "An Old Soldier", text: "A grey-haired soldier sharpening a blade by the road. \"Still got some fight in me. Or some sense, if you'd rather.\"",
    options: [
      { id: "take", label: "TAKE HIM IN", text: "He joins you, knowing two abilities.", do: [{ op: "recruit", known: 2 }] },
      { id: "lesson", label: "A LESSON", text: "Three members each learn an ability or train one; he stays by the road.", do: [{ op: "train", n: 3 }] },
    ],
    variants: [
      { options: [
        { id: "take", label: "TAKE HIM IN", text: "He joins you, knowing two abilities.", do: [{ op: "recruit", known: 2 }] },
        { id: "lesson", label: "A LESSON", text: "Three members each learn an ability or train one; he stays by the road.", do: [{ op: "train", n: 3 }] },
      ] },
      { text: "An old soldier with a limp, too slow to march with anyone, too proud to beg.", options: [
        { id: "take", label: "TAKE HIM IN", text: "He joins you at half HP, knowing two abilities, with an uncommon piece suited to him.", do: [{ op: "recruit", known: 2, hp: 50, gear: "uncommon" }] },
        { id: "lesson", label: "A LESSON", text: "Three members each learn an ability or train one.", do: [{ op: "train", n: 3 }] },
        { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  {
    id: "sealed_crates", name: "Three Sealed Crates", text: "Three crates, nailed shut and stamped with a merchant's mark. Room on your cart for one.",
    options: [
      { id: "open", label: "OPEN ONE", text: "A piece of unknown rarity: one crate holds a legendary, one a rare, one a common.", do: [{ op: "chance", pct: 33, then: [{ op: "gear", rarity: "legendary" }], else: [{ op: "chance", pct: 50, then: [{ op: "gear", rarity: "rare" }], else: [{ op: "gear", rarity: "common" }] }] }] },
      { id: "leave", label: "LEAVE THEM", text: "Nothing happens.", do: [] },
    ],
    variants: [
      { options: [
        { id: "open", label: "OPEN ONE", text: "A piece of unknown rarity: one crate holds a legendary, one a rare, one a common.", do: [{ op: "chance", pct: 33, then: [{ op: "gear", rarity: "legendary" }], else: [{ op: "chance", pct: 50, then: [{ op: "gear", rarity: "rare" }], else: [{ op: "gear", rarity: "common" }] }] }] },
        { id: "leave", label: "LEAVE THEM", text: "Nothing happens.", do: [] },
      ] },
      { text: "Three crates, nailed shut, and the merchant's boy, who'll pry open a second for a coin.", options: [
        { id: "open", label: "OPEN ONE", text: "A piece of unknown rarity: one crate holds a legendary, one a rare, one a common.", do: [{ op: "chance", pct: 33, then: [{ op: "gear", rarity: "legendary" }], else: [{ op: "chance", pct: 50, then: [{ op: "gear", rarity: "rare" }], else: [{ op: "gear", rarity: "common" }] }] }] },
        { id: "two", label: "OPEN TWO", text: "Two of the three crates, at random.", gold: 30, do: [{ op: "chance", pct: 33, then: [{ op: "gear", rarity: "rare" }, { op: "gear", rarity: "common" }], else: [{ op: "gear", rarity: "legendary" }, { op: "chance", pct: 50, then: [{ op: "gear", rarity: "rare" }], else: [{ op: "gear", rarity: "common" }] }] }] },
      ] },
    ],
  },
  {
    id: "quartermaster", name: "The Quartermaster's Wagon", text: "An army wagon, and a quartermaster happy to sell what the army won't miss.",
    options: [
      { id: "bundle", label: "BUY THE BUNDLE", text: "A formation and a tonic.", gold: 50, do: [{ op: "formation" }, { op: "supply", id: "tonic" }] },
      { id: "kit", label: "TAKE THE SPARE KIT", text: "A common piece and a potion.", do: [{ op: "gear", rarity: "common" }, { op: "supply", id: "potion" }] },
    ],
    variants: [
      { options: [
        { id: "bundle", label: "BUY THE BUNDLE", text: "A formation and a tonic.", gold: 50, do: [{ op: "formation" }, { op: "supply", id: "tonic" }] },
        { id: "kit", label: "TAKE THE SPARE KIT", text: "A common piece and a potion.", do: [{ op: "gear", rarity: "common" }, { op: "supply", id: "potion" }] },
      ] },
      { text: "An army wagon stuck to the axles in mud, its quartermaster red in the face.", options: [
        { id: "push", label: "PUSH IT FREE", text: "Everyone loses 10% of max HP. A formation and a potion, in thanks.", do: [{ op: "hp", pct: -10 }, { op: "formation" }, { op: "supply", id: "potion" }] },
        { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  {
    id: "field_hospital", name: "A Field Hospital", text: "Tents, cots, and a surgeon who has seen worse than you.",
    options: [
      { id: "pay", label: "PAY THE SURGEON", text: "Everyone recovers 40% of max HP, and the fallen rise at half HP.", gold: 50, do: [{ op: "hp", pct: 40 }, { op: "revive", pct: 50 }] },
      { id: "medic", label: "HIRE THE MEDIC", text: "One who heals or raises others joins you.", gold: 80, do: [{ op: "recruit", healer: true }] },
      { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
    ],
    variants: [
      { options: [
        { id: "pay", label: "PAY THE SURGEON", text: "Everyone recovers 40% of max HP, and the fallen rise at half HP.", gold: 50, do: [{ op: "hp", pct: 40 }, { op: "revive", pct: 50 }] },
        { id: "medic", label: "HIRE THE MEDIC", text: "One who heals or raises others joins you.", gold: 80, do: [{ op: "recruit", healer: true }] },
        { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
      ] },
      { text: "A hospital overrun with wounded. The surgeon looks up: \"You. Hands. Now.\"", options: [
        { id: "help", label: "HELP OUT", text: "Everyone loses 15% of max MP. A potion and a phoenix feather, from the stores.", do: [{ op: "mp", pct: -15 }, { op: "supply", id: "potion" }, { op: "supply", id: "phoenix" }] },
        { id: "leave", label: "WALK ON", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  {
    id: "war_table", name: "The War Table", text: "A deserted command tent, the maps still pinned to the table.",
    options: [
      { id: "study", label: "STUDY THE MAPS", text: "A rare formation; everyone loses 10% of max MP (a long night).", do: [{ op: "formation", rarity: "rare" }, { op: "mp", pct: -10 }] },
      { id: "sell", label: "SELL THE MAPS", text: "+50 gold.", do: [{ op: "gold", amount: 50 }] },
    ],
    variants: [
      { options: [
        { id: "study", label: "STUDY THE MAPS", text: "A rare formation; everyone loses 10% of max MP (a long night).", do: [{ op: "formation", rarity: "rare" }, { op: "mp", pct: -10 }] },
        { id: "sell", label: "SELL THE MAPS", text: "+50 gold.", do: [{ op: "gold", amount: 50 }] },
      ] },
      { text: "A command tent with one tired sentry dozing at the flap.", options: [
        { id: "study", label: "SLIP IN", text: "A formation. The sentry wakes and calls the guard: a fight.", do: [{ op: "formation" }, { op: "fight", tier: "normal" }] },
        { id: "leave", label: "BACK AWAY", text: "Nothing happens.", do: [] },
      ] },
    ],
  },
  {
    id: "duelling_ground", name: "A Duelling Ground", text: "A ring of stakes, a champion inside it, and a crowd that wants blood.",
    options: [
      { id: "challenge", label: "CHALLENGE THE CHAMPION", text: "A hard fight, with an elite's spoils: a legendary, then a formation.", do: [{ op: "fight", tier: "elite" }] },
      { id: "watch", label: "WATCH", text: "Three members each learn an ability or train one from the champion's form.", do: [{ op: "train", n: 3 }] },
    ],
    variants: [
      { options: [
        { id: "challenge", label: "CHALLENGE THE CHAMPION", text: "A hard fight, with an elite's spoils: a legendary, then a formation.", do: [{ op: "fight", tier: "elite" }] },
        { id: "watch", label: "WATCH", text: "Three members each learn an ability or train one from the champion's form.", do: [{ op: "train", n: 3 }] },
      ] },
      { text: "An empty ring. The last champion's gear hangs on a stake under a sign: TAKE IT IF YOU CAN LIFT IT.", options: [
        { id: "lift", label: "LIFT IT", text: "A legendary piece; everyone loses 20% of max HP.", do: [{ op: "hp", pct: -20 }, { op: "gear", rarity: "legendary" }] },
        { id: "crowd", label: "WORK THE CROWD", text: "+30 gold.", do: [{ op: "gold", amount: 30 }] },
      ] },
    ],
  },
  {
    id: "armoury", name: "The Abandoned Armoury", text: "Racks of old weapons behind a door hanging off its hinges. Something breathes further in.",
    options: [
      { id: "search", label: "SEARCH", text: "Two uncommon pieces.", do: [{ op: "gear", rarity: "uncommon" }, { op: "gear", rarity: "uncommon" }] },
      { id: "deeper", label: "SEARCH DEEPER", text: "Three rare pieces, and whatever breathes wakes: a hard fight, with an elite's spoils.", do: [{ op: "gear", rarity: "rare" }, { op: "gear", rarity: "rare" }, { op: "gear", rarity: "rare" }, { op: "fight", tier: "elite" }] },
    ],
    variants: [
      { options: [
        { id: "search", label: "SEARCH", text: "Two uncommon pieces.", do: [{ op: "gear", rarity: "uncommon" }, { op: "gear", rarity: "uncommon" }] },
        { id: "deeper", label: "SEARCH DEEPER", text: "Three rare pieces, and whatever breathes wakes: a hard fight, with an elite's spoils.", do: [{ op: "gear", rarity: "rare" }, { op: "gear", rarity: "rare" }, { op: "gear", rarity: "rare" }, { op: "fight", tier: "elite" }] },
      ] },
      { text: "The armoury's old caretaker is still here, and wants paying for what he's kept oiled all these years.", options: [
        { id: "buy", label: "BUY THE BEST", text: "A legendary piece.", gold: 90, do: [{ op: "gear", rarity: "legendary" }] },
        { id: "scraps", label: "SEARCH THE SCRAPS", text: "A common piece and 15 gold.", do: [{ op: "gear", rarity: "common" }, { op: "gold", amount: 15 }] },
      ] },
    ],
  },
  {
    id: "mana_spring", name: "A Mana Spring", text: "A pool that glows a faint blue. The water stings.",
    options: [
      { id: "bathe", label: "BATHE", text: "Everyone back to full MP; everyone loses 15% of max HP.", do: [{ op: "mp", pct: 100 }, { op: "hp", pct: -15 }] },
      { id: "flask", label: "FILL A FLASK", text: "A tonic and 20 gold's worth of glowing stones.", do: [{ op: "supply", id: "tonic" }, { op: "gold", amount: 20 }] },
    ],
    variants: [
      { options: [
        { id: "bathe", label: "BATHE", text: "Everyone back to full MP; everyone loses 15% of max HP.", do: [{ op: "mp", pct: 100 }, { op: "hp", pct: -15 }] },
        { id: "flask", label: "FILL A FLASK", text: "A tonic and 20 gold's worth of glowing stones.", do: [{ op: "supply", id: "tonic" }, { op: "gold", amount: 20 }] },
      ] },
      { text: "A spring gone sour, though a shimmer still clings to the stones around it.", options: [
        { id: "drink", label: "DRINK DEEP", text: "Everyone recovers 50% of max MP and loses 10% of max HP.", do: [{ op: "mp", pct: 50 }, { op: "hp", pct: -10 }] },
        { id: "flask", label: "FILL A FLASK", text: "A tonic.", do: [{ op: "supply", id: "tonic" }] },
      ] },
    ],
  },
];
