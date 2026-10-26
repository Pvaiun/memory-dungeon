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
  start: { gold: 60, offers: 3, picks: 2 },
  /**
   * Abilities a class knows on joining: one in act I, two in act II, three in act III. Each class's first is below: the one
   * that best stands for it on its own. The Vampire starts with Wither, not Blood drain: as leader with random companions it
   * won 37% of runs with Blood drain (the next best class 20%), 19% with Wither.
   */
  firstAbility: {
    knight: "protect", cleric: "cure", ranger: "barbed_arrow", bramble_knight: "thicket", hoplite: "aspis", paladin: "smite",
    valkyrie: "gale_spear", bard: "war_ballad", hexer: "enfeeble", monk: "burning_fist", assassin: "backstab", vampire: "wither",
    pyromancer: "firebolt", frostweaver: "frost_lance", stormcaller: "chain_lightning", geomancer: "earthen_shell",
  } as Record<string, string>,
  /** Party of three, and up to two more waiting at camp. */
  party: 3,
  bench: 2,
  /**
   * The map of an act: `floors` floors and the boss above them, `width` columns, `paths` paths walked up from the bottom
   * (Slay the Spire's generator). Fixed floors; then room odds for the rest, with elites and campfires kept off the first
   * floors, and no elite, campfire or shop straight after another of its kind.
   */
  map: {
    floors: 9, width: 5, paths: 5,
    fixed: { 1: "fight", 5: "treasure", 9: "campfire" } as Record<string, RogueNodeKindT>,
    odds: { fight: 46, event: 22, elite: 12, campfire: 12, shop: 8 } as Record<string, number>,
    lateFrom: 4,
  },
  /** Gold for a win: [min, max], plus `perAct` × (act − 1). */
  gold: { fight: [12, 20], elite: [30, 40], boss: [90, 110], perAct: 5 },
  /**
   * Spoils: after a fight, pick one of `count` (or none). Each is gear unless it rolls a tome (a member learns an
   * ability) or a recruit. An elite also pays a trophy, a legendary piece won outright (Slay the Spire's elite relic). Gear rolls its rarity from the table. `usable`: the share of gear rolled from what someone
   * in the roster can use; the rest is anything (the piece that wants a class you don't have yet).
   */
  spoils: {
    fight: { count: 3, rarity: { common: 55, uncommon: 33, rare: 12, legendary: 0 }, tome: 12, recruit: 6, supply: 8 },
    elite: { count: 3, trophy: true, rarity: { common: 0, uncommon: 50, rare: 50, legendary: 0 }, tome: 15, recruit: 10, supply: 0 },
    usable: 75,
  },
  /** The boss's boon: pick one of a legendary piece, a formation and a recruit. The next act starts restored, and everyone learns. */
  boon: { count: 3 },
  /** A chest: one piece, rare or better, and some gold. */
  treasure: { rarity: { common: 0, uncommon: 0, rare: 70, legendary: 30 }, gold: [15, 35] },
  /** The campfire: one pick of REST, FOCUS, RAISE or TRAIN; those at camp rest too. Swapping the party is free. */
  campfire: { hp: 40, mp: 60, revive: 40 },
  /** Prices, in gold. A piece sells for `sell` % of its price. Services are once a visit. */
  prices: { common: 45, uncommon: 70, rare: 110, legendary: 190, recruit: 120, formation: 100, learn: 60, upgrade: 80, supply: { tonic: 35, ether: 35, phoenix: 60 }, sell: 35 },
  shop: { gear: { common: 2, uncommon: 2, rare: 1, legendary: 1 }, recruits: 1, formations: 1, supplies: 2 },
  /** Supplies, used between fights: the bag holds this many. */
  supplies: { tonic: { hp: 30 }, ether: { mp: 50 }, phoenix: { revive: 50 } },
  bag: 3,
  /**
   * The foes, in percent (the campaign's knob: HP +k %, damage +k/2 %): per act, the first floor's, the rise per floor, an
   * elite's on top, and the boss's. Each region adds its own (below). Set by the rogue tuning (npm run rogue).
   */
  knobs: [
    { mob: 0, step: 6, elite: 0, boss: 0 },
    { mob: 0, step: 6, elite: 0, boss: 0 },
    { mob: 0, step: 6, elite: 0, boss: 0 },
  ],
  /** Heat: each level adds this to every knob. Won runs open the next level. */
  heat: { per: 15, max: 10 },
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

/** A region's fight, with its calibrated knob (rogue-knobs.json, by region/tier/id) when it has one. */
const KNOBS = fightKnobs as Record<string, number>;
function withKnobs(r: RogueRegion): RogueRegion {
  const tag = (tier: string) => (x: RogueFight): RogueFight => (KNOBS[`${r.id}/${tier}/${x.id}`] !== undefined ? { ...x, knob: KNOBS[`${r.id}/${tier}/${x.id}`] } : x);
  return { ...r, easy: r.easy.map(tag("easy")), normal: r.normal.map(tag("normal")), elite: r.elite.map(tag("elite")), bosses: r.bosses.map(tag("bosses")) };
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
    elite: [f("lava_flow", "Lava Flow", [2, "lava_slime"]), f("imp_court", "Imp Court", [2, "fire_imp"], [3, "hellhound"]), f("powder_room", "Powder Room", [2, "bomb_bug"], [1, "ogre"])],
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
  relic("lg_ember", "Ember", "Basic attacks add a few Burn.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("burn", { stacks: own("few", 1.5), to: "other" })] }] }),
  relic("lg_cleave", "Cleave", "Basic attacks also hit a second, random foe.", { strike: { to: T.secondFoe } }),
  relic("lg_rime", "Rime", "Basic attacks add a few Chill.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("chill", { stacks: own("few"), to: "other" })] }] }),
  relic("lg_wounds", "Wounds", "Crits add several Bleed.", { reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [apply("bleed", { stacks: own("several"), to: "other" })] }] }),
  relic("lg_sunder", "Shatter", "Basic attacks add a few Sunder.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("sunder", { stacks: own("few"), to: "other" })] }] }),
  relic("lg_song", "Song", "Basic attacks give a random ally a little MP.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "mp", amount: 120, to: { side: "allies", pick: "random" } }] }] }),
  relic("lg_judge", "Verdict", "Hits deal 60% more damage to foes with a buff.", { boosts: both({ scale: [{ ratio: 60, when: { buffs: true }, of: "target" }] }) }),
  relic("lg_lantern", "Lantern", "When a foe falls, heals a tenth of its own max HP.", { reactions: [{ on: { event: "ko", whose: "foe" }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.1, stat: "max_hp", of: "holder" }] }, to: "self" }] }] }),
  relic("lg_soul", "Soul jar", "When a foe falls, every ally regains a little MP.", { reactions: [{ on: { event: "ko", whose: "foe" }, do: [{ op: "mp", amount: 200, to: T.everyAlly }] }] }),
  relic("lg_banner", "Banner", "When the fight starts, every ally gains several Might.", { reactions: [{ on: { event: "fight_start" }, do: [apply("might", { stacks: FLAT_STACKS.several, to: T.everyAlly })] }] }),
  relic("lg_hourglass", "Hourglass", "Starts each fight Hasted.", { reactions: [{ on: { event: "fight_start" }, do: [apply("haste", { to: "self" })] }] }),
  relic("lg_horn", "Horn", "When the fight starts, every ally gains Regen.", { reactions: [{ on: { event: "fight_start" }, do: [apply("regen", { to: T.everyAlly })] }] }),
  relic("lg_bell", "Bell", "Can't be Silenced.", { stats: [{ stat: "immune:status:silence", flat: 1 }] }),
  relic("lg_fury", "Fury", "Below half HP, deals 50% more damage; below a quarter, double.", { boosts: both({ scale: [{ ratio: 50, when: { hpBelow: 50 } }, { ratio: 50, when: { hpBelow: 25 } }] }) }),
  relic("lg_idol", "Stone idol", "Crit chance doubled while its Shield holds.", {
    reactions: [
      { on: { event: "status_gained", status: "shield" }, do: [apply("lg_idol_on", { to: "holder" })] },
      { on: { event: "status_ended", status: "shield" }, do: [{ op: "remove", label: "buff", status: "lg_idol_on", to: "holder" }] },
    ],
  }),
  { id: "lg_idol_on", name: "IDOL", text: "Crit chance doubled.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }] },
  relic("lg_brittle", "Shard", "Hits deal more damage for each Chill stack on the target.", { boosts: both({ scale: [{ ratio: 5, stacks: "chill", of: "target" }] }) }),
  relic("lg_coil", "Coil", "When hit, Shocks the attacker.", { reactions: [{ on: { event: "hit_taken" }, do: [apply("shock", { stacks: FLAT_STACKS.few, to: "other" })] }] }),
  relic("lg_frost", "Frozen heart", "When hit, Chills the attacker.", { reactions: [{ on: { event: "hit_taken" }, do: [apply("chill", { stacks: FLAT_STACKS.one, to: "other" })] }] }),
  relic("lg_briar", "Briar", "When hit, the attacker starts to bleed.", { reactions: [{ on: { event: "hit_taken" }, do: [apply("bleed", { stacks: FLAT_STACKS.few, to: "other" })] }] }),
  relic("lg_spikes", "Spikes", "Thorns equal to a twentieth of its Armor.", { stats: [{ stat: "thorns", flat: { scale: [{ ratio: 0.05, stat: "armor", of: "holder" }] } }] }),
  relic("lg_shade", "Shade", "Starts each fight Hidden.", { reactions: [{ on: { event: "fight_start" }, do: [apply("hidden", { to: "self" })] }] }),
  relic("lg_execute", "Executioner", "Hits deal double damage to foes below a third of their HP.", { boosts: both({ scale: [{ ratio: 100, when: { hpBelow: 34 }, of: "target" }] }) }),
  relic("lg_storm", "Storm edge", "Basic attacks also hit a second, random foe, and Shock both.", {
    strike: { to: T.secondFoe },
    reactions: [
      { on: { event: "hit_lands", kind: "basic" }, do: [apply("shock", { stacks: own("few", 1.5), to: "other" })] },
      { on: { event: "hit_lands", kind: "extra" }, do: [apply("shock", { stacks: own("few", 1.5), to: "other" })] },
    ],
  }),
  relic("lg_hunter", "Hunter", "Hits deal 50% more damage to foes that bleed.", { boosts: both({ scale: [{ ratio: 50, when: { has: "bleed" }, of: "target" }] }) }),
  relic("lg_grave", "Gravecaller", "When a foe falls, gains several Might.", { reactions: [{ on: { event: "ko", whose: "foe" }, do: [apply("might", { stacks: FLAT_STACKS.several, to: "self" })] }] }),
  relic("lg_cinder", "Cinder", "Hits deal 40% more damage to foes that burn.", { boosts: both({ scale: [{ ratio: 40, when: { has: "burn" }, of: "target" }] }) }),
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
  legend("wound_sigil", "Wound sigil", "Every crit opens a wound.", "amulet", { statuses: ["lg_wounds"], stats: [critStep(1)] }),
  legend("shatter_sigil", "Shatter sigil", "Every basic attack cracks armor.", "amulet", { statuses: ["lg_sunder"] }),
  legend("siren_shell", "Siren shell", "Every basic attack sings an ally a little mana.", "amulet", { statuses: ["lg_song"] }),
  legend("crown_of_judgement", "Crown of judgement", "Strikes hardest at whatever has been lifted up.", "amulet", { statuses: ["lg_judge"] }),
  legend("grave_lantern", "Grave lantern", "Each foe that falls gives back a little life.", "amulet", { statuses: ["lg_lantern"] }),
  legend("soul_jar", "Soul jar", "Each foe that falls fills the party's mana.", "amulet", { statuses: ["lg_soul"] }),
  legend("war_banner", "War banner", "The whole party starts each fight with Might.", "amulet", { statuses: ["lg_banner"] }),
  legend("hourglass", "Hourglass", "Its wearer starts each fight Hasted.", "amulet", { statuses: ["lg_hourglass"] }),
  legend("herald_horn", "Herald's horn", "The whole party starts each fight with Regen.", "amulet", { statuses: ["lg_horn"] }),
  legend("silver_bell", "Silver bell", "Nothing silences its wearer.", "amulet", { statuses: ["lg_bell"], stats: [st("mp_regen", 1)] }),
  legend("berserker_torc", "Berserker's torc", "Hits harder the closer its wearer is to falling.", "amulet", { statuses: ["lg_fury"] }),
  legend("stone_idol", "Stone idol", "Crits twice as often behind a Shield.", "amulet", { statuses: ["lg_idol"], stats: [critStep(1)] }),
  legend("frost_shard", "Frost shard", "Hits harder the colder the foe.", "amulet", { statuses: ["lg_brittle"] }),
  legend("static_coil", "Static coil", "Whatever hits its wearer is shocked.", "amulet", { statuses: ["lg_coil"] }),
  legend("frozen_heart", "Frozen heart", "Plate that chills whatever strikes it.", "armor", { weight: "heavy", statuses: ["lg_frost"], stats: [st("armor", 1)] }),
  legend("briar_coat", "Briar coat", "Whatever strikes it starts to bleed.", "armor", { weight: "medium", statuses: ["lg_briar"], stats: [st("max_hp", 1)] }),
  legend("spiked_bulwark", "Spiked bulwark", "The more plate, the more spikes.", "armor", { weight: "heavy", statuses: ["lg_spikes"], stats: [st("armor", 1)] }),
  legend("shadow_cowl", "Shadow cowl", "Its wearer starts each fight unseen.", "armor", { weight: "medium", statuses: ["lg_shade"], stats: [sp("evasion", "medium")] }),
];

export const rogueWeapons: LegendWeapon[] = [
  { id: "headsman_axe", name: "Headsman's axe", text: "Finishes what's already falling.", kind: "axe", statuses: ["lg_execute"] },
  { id: "stormbrand", name: "Stormbrand", text: "A sword that arcs to a second foe and shocks both.", kind: "sword", statuses: ["lg_storm"] },
  { id: "frostfang", name: "Frostfang", text: "A dagger that chills every cut.", kind: "dagger", statuses: ["lg_rime"], stats: [st("attack", 1)] },
  { id: "hunters_bow", name: "Hunter's bow", text: "Hits a bleeding quarry far harder.", kind: "bow", statuses: ["lg_hunter"] },
  { id: "gravecaller", name: "Gravecaller", text: "Each fall makes it stronger.", kind: "dark_staff", statuses: ["lg_grave"] },
  { id: "cinder_rod", name: "Cinder rod", text: "Lightning that hits burning foes harder.", kind: "lightning_staff", statuses: ["lg_cinder"], stats: [st("magic", 1)] },
  { id: "brand_of_kings", name: "Brand of kings", text: "A spear that strikes hardest at whatever has been lifted up.", kind: "spear", statuses: ["lg_judge"] },
  { id: "earthshaker", name: "Earthshaker", text: "An earth staff that cracks the armor of what it strikes.", kind: "earth_staff", statuses: ["lg_sunder"] },
];

/** The legendary pool: the core set's powerful pieces and the rogue mode's own. */
export const LEGENDARY_BASES = [
  "heartwood_staff", "sanguine_staff", "cornerstone_axe", "needle", "mist_claws", "glacier_staff", "templar_staff",
  "thornheart_plate", "wraith_leathers", "archmages_robes", "twin_soul_charm", "vampires_tooth", "thirsting_jewel", "glass_heart",
];

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
  | { op: "recruit"; hp?: number }
  | { op: "learn" }
  | { op: "upgrade" }
  | { op: "temper" }
  | { op: "formation" }
  | { op: "supply"; id: "tonic" | "ether" | "phoenix" }
  | { op: "fight"; tier: "normal" | "elite" }
  | { op: "camp" }
  | { op: "chance"; pct: number; then: EventOp[]; else: EventOp[] };
export type EventOption = { id: string; label: string; text: string; gold?: number; do: EventOp[] };
export type RogueEvent = { id: string; name: string; text: string; options: EventOption[] };

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
      { id: "bet", label: "BET 40 GOLD", text: "Half the time, win 80 back.", gold: 40, do: [{ op: "chance", pct: 50, then: [{ op: "gold", amount: 80 }], else: [] }] },
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
      { id: "bottle", label: "BOTTLE IT", text: "An ether for later.", do: [{ op: "supply", id: "ether" }] },
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
    options: [{ id: "camp", label: "MAKE CAMP", text: "A campfire: rest, focus, raise or train, and change the party.", do: [{ op: "camp" }] }],
  },
  {
    id: "pilgrims", name: "Pilgrims", text: "A band of pilgrims with a healer among them. \"For a donation…\"",
    options: [
      { id: "donate", label: "DONATE 40", text: "Everyone recovers 40% of max HP, and the fallen rise.", gold: 40, do: [{ op: "hp", pct: 40 }, { op: "supply", id: "phoenix" }] },
      { id: "leave", label: "PASS BY", text: "Nothing happens.", do: [] },
    ],
  },
  {
    id: "drill_yard", name: "A Drill Yard", text: "Veterans spar in an old courtyard. One of them could be talked into joining.",
    options: [
      { id: "hire", label: "HIRE ONE FOR 70", text: "A recruit joins you.", gold: 70, do: [{ op: "recruit" }] },
      { id: "drill", label: "DRILL", text: "One member learns an ability.", do: [{ op: "learn" }] },
    ],
  },
  {
    id: "standard", name: "A Fallen Standard", text: "A war banner, half-buried in the mud. Its company's drill is written on the back.",
    options: [
      { id: "take", label: "TAKE THE DRILL", text: "A new formation.", do: [{ op: "formation" }] },
      { id: "sell", label: "SELL THE BANNER", text: "+45 gold.", do: [{ op: "gold", amount: 45 }] },
    ],
  },
];
