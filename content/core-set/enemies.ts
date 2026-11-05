/**
 * The 29 enemies, their adds and reskins (docs/core-set/enemies.md),
 * with their abilities and passives. Stat lines are HP, MP, MP regen, Attack,
 * Defense, Crit, Aggro, as the document lists them.
 */
import type { AbilityT, EnemyT, StatusT, WeaponT } from "../../src/schema.js";
import { ENEMY_COOLDOWN, COST, KIND_SPEED, RULES, ENEMY_HIT, ENEMY_SPEED_FACTOR, ENEMY_SWING, FLAT_STACKS, INCORPOREAL, REVIVE, SPECIAL, SPEED, STATUS, WINDUP, BOSS_HP, crit, jitter, aggroOf, pts, type SwingWord } from "./scale.js";
import { T } from "./classes.js";
import { speedOf } from "./vocabulary.js";

type CD = keyof typeof ENEMY_COOLDOWN;
type WU = keyof typeof WINDUP;
const timing = (cd: CD, wu: WU) => ({ cooldown: ENEMY_COOLDOWN[cd], cast: WINDUP[wu], mp: COST[cd] });

/** A basic attack by kind and words: a flat swing from the word (see ENEMY_SWING); the kind sets how often. */
const swing = (speed: keyof typeof SPEED, word: SwingWord) => Math.round(ENEMY_SPEED_FACTOR[speed] * ENEMY_SWING[word]);
const basic = (kind: string, word: SwingWord = "normal", extra: Partial<WeaponT> = {}): WeaponT => ({ kind, amount: swing(speedOf(kind), word), ...extra });
/**
 * A basic attack of two bites, each this share of the one swing, so the pair
 * is a fifth bigger before Defense and about the same after it (Defense cuts small hits more); Thorns, Bleed on the attacker and Guard meet
 * it twice. The skirmishers' swing.
 */
const MULTI_SHARE = 0.6;
const flurry = (kind: string, word: SwingWord = "normal", extra: Partial<WeaponT> = {}): WeaponT => ({ kind, amount: Math.round(MULTI_SHARE * swing(speedOf(kind), word)), hits: 2, ...extra });
/**
 * The casters' touches (the Bone Priest, Witch, Lich, Wraith and Fire Imp) and the Wisp's and Drone's sparks: a normal swing, since
 * a weak one into a wall's Defense is a sliver, and a caster's touch should still be worth stopping.
 */
const CASTER_TOUCH: SwingWord = "normal";
/** A basic attack with no kind of its own (a touch, a slam): its speed. */
const touch = (speed: keyof typeof SPEED, word: SwingWord = "normal", extra: Partial<WeaponT> = {}): WeaponT => ({
  type: "physical", cooldown: SPEED[speed], amount: swing(speed, word), ...extra,
});

const line = (hp: number, mp: number, regen: number, atk: number, def: number, c: number, aggro: number) => ({
  max_hp: pts(hp), max_mp: pts(mp), mp_regen: pts(regen), attack: pts(atk), defense: pts(def), crit_chance: crit(c), aggro: aggroOf(aggro),
});
/** Every enemy carries at least this much Defense, so small hits and big hits mean something against everyone; the floor is minimal. */
const ARMOR_FLOOR = { minion: pts(1), elite: pts(2), boss: pts(3) } as const;
const enemy = (id: string, name: string, text: string, rank: EnemyT["rank"], stats: Record<string, number>, weapon: WeaponT, o: { abilities?: string[]; statuses?: string[]; note?: string } = {}): EnemyT => ({
  // Every foe carries at least its rank's Defense.
  id, name, text, rank,
  stats: {
    ...stats,
    defense: Math.max(stats.defense ?? 0, ARMOR_FLOOR[rank]),
    ...(rank === "boss" ? { max_hp: Math.round(stats.max_hp * BOSS_HP) } : {}),
  },
  weapon, ...(o.abilities ? { abilities: o.abilities } : {}), ...(o.statuses ? { statuses: o.statuses } : {}), ...(o.note ? { note: o.note } : {}),
});
const reskin = (of: EnemyT, id: string, name: string, text: string): EnemyT => ({ ...of, id, name, text, note: `A reskin of the ${of.name}: the same numbers.` });

const passive = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
const apply = (status: string, extra: object = {}) => ({ op: "apply", status, ...extra }) as const;

// ─── Passives ────────────────────────────────────────────────────────────────

export const enemyStatuses: StatusT[] = [
  passive("venom", "Venom", "Its bites leave wounds that bleed.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("bleed", { stacks: FLAT_STACKS.one, to: "other" })] }] }),
  passive("fire_bite", "Fire bite", "Its bites burn.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("burn", { stacks: FLAT_STACKS.one, to: "other" })] }] }),
  passive("split", "Split", "Below half HP it splits in two.", { reactions: [{ on: { event: "hp_lost" }, do: [{ op: "replace", enemy: "mini_slime", count: 2, to: { side: "self", where: { hpBelow: 50 } } }] }] }),
  // The Ghost's challenge: hits print slivers, a status's own damage lands in full.
  passive("incorporeal", "Incorporeal", "Takes a quarter of every hit; its burns, bleeds and shocks hurt it in full.", { taken: [{ tag: "physical", pct: INCORPOREAL.hits }] }),
  passive("volatile", "Volatile", "Explodes when it dies.", {
    survivesKO: true,
    reactions: [{ on: { event: "ko" }, do: [{ op: "damage", type: "physical", amount: { scale: [{ ratio: ENEMY_HIT.volatile, stat: "attack", of: "holder" }] }, to: T.everyFoe }, apply("burn", { stacks: FLAT_STACKS.few, to: T.everyFoe })] }],
  }),
  passive("rime", "Rime", "Its touch chills.", { reactions: [{ on: { event: "hit_lands" }, do: [apply("chill", { stacks: FLAT_STACKS.one, to: "other" })] }] }),
  passive("ice_crust_passive", "Ice crust", "Every hit it takes thickens its ice.", { reactions: [{ on: { event: "hit_taken" }, do: [apply("ice_crust", { to: "holder" })] }] }),
  { id: "ice_crust", name: "CRUST", text: "Defense up for each stack; thaws when the hits stop.", label: "buff", show: "icon", stacking: "intensity", unremovable: true, duration: STATUS.ice_crust.duration, cap: STATUS.ice_crust.cap, stats: [{ stat: "defense", flat: STATUS.ice_crust.perStack }] },
  passive("frozen_core", "Frozen core", "Its Bulwark stands from the start, and nothing strips its buffs.", { reactions: [{ on: { event: "fight_start" }, do: [apply("bulwark", { stacks: STATUS.bulwark.stacks, to: "holder" })] }] }),
  passive("static", "Static", "Its zaps shock.", { reactions: [{ on: { event: "hit_lands" }, do: [apply("shock", { stacks: FLAT_STACKS.one, to: "other" })] }] }),
  passive("vengeance", "Vengeance", "Several Might when one of his Soldiers falls.", { reactions: [{ on: { event: "ko", whose: "ally" }, do: [apply("might", { stacks: FLAT_STACKS.several, to: "holder" })] }] }),
];

// ─── Abilities ───────────────────────────────────────────────────────────────

// As for the classes, each ability's cooldown is moved by its id (scale.ts, jitter).
const a = (id: string, name: string, text: string, body: Partial<AbilityT> & { do: AbilityT["do"]; cooldown: number }): AbilityT => ({ id, name, text, ...body, cooldown: jitter(body.cooldown, id) });
const fromStat = (stat: string, ratio: number) => ({ scale: [{ ratio, stat }] });

// A boss's signature blows and spells are on the short cooldown, so they come several times a fight and must be played against;
// its summons stay medium, or the room fills.
export const enemyAbilities: AbilityT[] = [
  a("shield_up", "Shield up", "Taunts.", { ...timing("short", "quick"), target: "self", do: [apply("taunt")] }),
  a("brace", "Brace", "Guards itself.", { ...timing("medium", "quick"), mp: 0, target: "self", do: [apply("guard")] }), // Free, as the Skeleton and Golem carry no MP.
  // Simple buffs on foes, so Judgement, Unmake and Dispel have targets.
  a("take_aim", "Take aim", "Several Might on itself.", { ...timing("medium", "quick"), mp: 0, target: "self", do: [apply("might", { stacks: FLAT_STACKS.several })] }),
  a("dark_ward", "Dark ward", "Wards itself.", { ...timing("medium", "quick"), mp: 0, target: "self", do: [apply("ward")] }), // Free, so it never takes the Soulfire's MP.
  a("shield_slam", "Shield slam", "A blow with the shield that Stuns.", { ...timing("medium", "normal"), target: { side: "foes", where: { lacks: "stun" }, ifNone: "any" }, do: [{ op: "damage", type: "physical", amount: fromStat("attack", 1.0), apply: [{ status: "stun" }] }] }),
  a("flatten", "Flatten", "A heavy blow that Stuns.", { ...timing("medium", "long"), target: { side: "foes", where: { lacks: "stun" }, ifNone: "any" }, do: [{ op: "damage", type: "physical", amount: fromStat("attack", ENEMY_HIT.flatten), apply: [{ status: "stun" }] }] }),
  a("crush", "Crush", "A massive blow.", { ...timing("short", "very_long"), do: [{ op: "damage", type: "physical", amount: fromStat("attack", ENEMY_HIT.crush) }] }),
  a("mend", "Mend", "Heals the most hurt ally.", { ...timing("short", "normal"), ...{ if: { side: "allies", where: { hpBelow: 100 } } }, target: T.lowestShareAlly, do: [{ op: "heal", amount: fromStat("attack", ENEMY_HIT.mend) }] }),
  a("curse", "Curse", "Weakens and Slows every foe.", { ...timing("medium", "long"), target: T.everyFoe, do: [apply("weaken"), apply("slow")] }),
  a("soulfire", "Soulfire", "A heavy spell.", { ...timing("medium", "very_long"), do: [{ op: "damage", type: "physical", amount: fromStat("attack", ENEMY_HIT.soulfire) }] }),
  // On the long word, so a pack of Ghouls can't keep raising each other.
  a("dig_up", "Raise", "Digs a fallen packmate back up.", { ...timing("long", "long"), if: { side: "allies", where: { ko: true } }, target: T.koAlly, do: [{ op: "revive", hp: { scale: [{ ratio: REVIVE.ghoul, stat: "max_hp", of: "target" }] } }] }),
  a("death_bell", "Death bell", "Dooms a foe.", { ...timing("short", "long"), if: { side: "foes", where: { lacks: "doom" } }, target: { side: "foes", where: { lacks: "doom" } }, do: [apply("doom")] }),
  // Bosses have behaviours of their own; the one-shot is the Ogre Chief's alone.
  a("reap", "Reap", "Three scythe slashes at random foes.", { ...timing("medium", "normal"), target: { side: "foes", pick: "random" }, do: [1, 2, 3].map(() => ({ op: "damage" as const, type: "physical" as const, amount: fromStat("attack", ENEMY_HIT.reap), to: { side: "foes" as const, pick: "random" as const } })) }),
  a("tolling", "Tolling", "Many Might and Haste on itself: its swings come faster and harder.", { ...timing("short", "quick"), mp: 0, target: "self", do: [apply("might", { stacks: FLAT_STACKS.many }), apply("haste")] }),
  a("kindle", "Kindle", "Several Might and a Ward on itself; the Inferno follows.", { ...timing("medium", "quick"), mp: 0, target: "self", do: [apply("might", { stacks: FLAT_STACKS.several }), apply("ward")] }),
  a("mute", "Mute", "Silences the foe with the highest Attack.", { ...timing("medium", "normal"), if: { side: "foes", where: { lacks: "silence" } }, target: { ...T.highestAMFoe, where: { lacks: "silence" } }, do: [apply("silence")] }),
  // On the medium word: a shorter one keeps the party silenced most of a fight.
  a("quiet", "Quiet", "Silences every foe.", { ...timing("medium", "long"), target: T.everyFoe, do: [apply("silence")] }),
  a("cheer", "Cheer", "Might and Haste on its strongest ally.", { ...timing("medium", "normal"), target: T.highestAMAlly, do: [apply("might", { stacks: FLAT_STACKS.several }), apply("haste")] }),
  a("brand", "Brand", "A fiery spell on a foe, with a few Burn.", { ...timing("short", "quick"), do: [{ op: "damage", type: "physical", amount: fromStat("attack", ENEMY_HIT.brand), apply: [{ status: "burn", stacks: FLAT_STACKS.few }] }] }),
  a("inferno", "Inferno", "A very long cast: a huge blast of fire on every foe, with several Burn. It waits until the Giant has kindled.", { ...timing("short", "very_long"), if: { side: "self", where: { has: "might" } }, target: T.everyFoe, do: [{ op: "damage", type: "physical", amount: fromStat("attack", ENEMY_HIT.inferno), apply: [{ status: "burn", stacks: FLAT_STACKS.several }] }] }),
  a("hailstorm", "Hailstorm", "Hail on every foe, with a stack of Chill.", { ...timing("short", "normal"), target: T.everyFoe, do: [{ op: "damage", type: "physical", amount: fromStat("attack", ENEMY_HIT.hailstorm), apply: [{ status: "chill", stacks: FLAT_STACKS.one }] }] }),
  a("call_drones", "Call drones", "Summons two Drones.", { ...timing("medium", "long"), do: [{ op: "summon", enemy: "drone", count: 2 }] }),
  // Each bolt picks its own foe, so two may land on one.
  a("tempest", "Tempest", "Three lightning bolts at random foes, each with a stack of Shock.", { ...timing("short", "long"), target: { side: "foes", pick: "random" }, do: [1, 2, 3].map(() => ({ op: "damage" as const, type: "physical" as const, amount: fromStat("attack", ENEMY_HIT.tempest), apply: [{ status: "shock", stacks: FLAT_STACKS.one }], to: { side: "foes" as const, pick: "random" as const } })) }),
  a("rally_soldiers", "Rally", "Summons two Soldiers.", { ...timing("medium", "long"), do: [{ op: "summon", enemy: "soldier", count: 2 }] }),
];

// ─── Enemies ─────────────────────────────────────────────────────────────────

const wolf = enemy("wolf", "Wolf", "Hunts in packs.", "minion", line(2, 0, 0, 2, 0, 2, 2), flurry("dagger", "weak"));
const bandit = enemy("bandit", "Bandit", "A common road thug.", "minion", line(4, 0, 0, 3, 1, 2, 3), basic("sword"));
const archer = enemy("archer", "Archer", "Hits hard, falls fast.", "minion", line(2, 0, 0, 7, 0, 4, 2), basic("bow", "heavy"), { abilities: ["take_aim"] });
const snake = enemy("snake", "Snake", "Its bite leaves a bleeding wound.", "minion", line(2, 0, 0, 2, 0, 2, 1), basic("dagger", "weak"), { statuses: ["venom"] });
const shieldman = enemy("shieldman", "Shieldman", "Hides behind a big shield.", "elite", line(10, 3, 2, 2, 5, 1, 4), basic("sword"), { abilities: ["shield_up", "shield_slam"] });
/**
 * The Ogre's (and the Troll's) slow swing: the great weapon's cooldown plus a long wind-up's ticks, with the recovery after it held
 * at the great weapon's, so Flatten waits no longer after a swing. No basic attack winds up: a wind-up reads as an ability, and
 * Silence and Unmake would react to a swing they can't stop.
 */
const OGRE_SWING = { cooldown: KIND_SPEED.great_weapon + WINDUP.long, recovery: RULES.basicRecovery * KIND_SPEED.great_weapon };
const ogre = enemy("ogre", "Ogre", "Big, slow, and swings a tree.", "elite", line(16, 2, 1, 6, 2, 2, 4), basic("great_weapon", "massive", OGRE_SWING), { abilities: ["flatten"], note: "Its basic attack comes slowly: the great weapon's cooldown plus a long wind-up's ticks." });
const ogreChief = enemy("ogre_chief", "Ogre Chief", "The biggest ogre, with the biggest club.", "boss", line(60, 4, 2, 12, 3, 2, 4), basic("great_weapon", "heavy"), { abilities: ["crush"] });

const skeleton = enemy("skeleton", "Skeleton", "Old bones in heavy armor.", "minion", line(3, 0, 0, 3, 8, 2, 3), basic("sword", "normal", { cooldown: SPEED.slow }), { abilities: ["brace"] });
const bat = enemy("bat", "Bat", "Fast, and hard to hit.", "minion", { ...line(2, 0, 0, 2, 0, 2, 2), evasion: SPECIAL.evasion.high }, basic("dagger", "weak"));
const ghost = enemy("ghost", "Ghost", "Blows pass right through it.", "minion", line(6, 0, 0, 3, 0, 2, 2), touch("medium"), { statuses: ["incorporeal"] });
const bonePriest = enemy("bone_priest", "Bone Priest", "Heals the other dead.", "minion", line(3, 6, 3, 7, 1, 2, 1), touch("medium", CASTER_TOUCH), { abilities: ["mend"] });
const witch = enemy("witch", "Witch", "Curses the whole party.", "minion", line(3, 5, 3, 4, 0, 2, 2), touch("medium", CASTER_TOUCH), { abilities: ["curse"] });
const lich = enemy("lich", "Lich", "A dead wizard with one big spell.", "minion", line(2, 6, 2, 7, 0, 2, 2), touch("medium", CASTER_TOUCH), { abilities: ["soulfire", "dark_ward"] });
const ghoul = enemy("ghoul", "Ghoul", "Ghouls dig each other back up.", "minion", line(8, 3, 2, 4, 1, 2, 3), basic("sword"), { abilities: ["dig_up"] });
const reaper = enemy("reaper", "Reaper", "Death, with a scythe and a bell.", "boss", line(85, 8, 3, 9, 4, 2, 4), basic("sword", "heavy"), { abilities: ["death_bell", "reap"] });
const wraith = enemy("wraith", "Wraith", "Steals voices.", "minion", line(4, 5, 3, 5, 0, 2, 2), touch("medium", CASTER_TOUCH), { abilities: ["mute"] });
const silentOne = enemy("silent_one", "Silent One", "Its silence falls on everyone.", "boss", line(90, 10, 3, 11, 5, 2, 4), basic("sword", "massive"), { abilities: ["quiet", "tolling"] }); // The silence is the lock, the sword the threat.

const hellhound = enemy("hellhound", "Hellhound", "A fire dog; its bite burns.", "minion", line(3, 0, 0, 3, 0, 2, 2), flurry("dagger", "weak"), { statuses: ["fire_bite"] });
const lavaSlime = enemy("lava_slime", "Lava Slime", "Cut it in half and you get two.", "elite", line(14, 0, 0, 4, 1, 2, 3), touch("slow"), { statuses: ["split"] });
const miniSlime = enemy("mini_slime", "Mini Slime", "Half a slime, still hungry.", "minion", line(7, 0, 0, 3, 1, 2, 3), touch("slow"));
const bombBug = enemy("bomb_bug", "Bomb Bug", "Explodes when it dies.", "minion", line(6, 0, 0, 5, 3, 2, 2), touch("medium"), { statuses: ["volatile"] });
const fireImp = enemy("fire_imp", "Fire Imp", "Cheers its friends on.", "minion", line(3, 5, 3, 3, 1, 2, 1), touch("medium", CASTER_TOUCH), { abilities: ["cheer"] });
const fireGiant = enemy("fire_giant", "Fire Giant", "Lord of the furnace.", "boss", line(95, 10, 3, 14, 5, 2, 4), basic("staff", "heavy"), { abilities: ["brand", "kindle", "inferno"] });

const iceSpirit = enemy("ice_spirit", "Ice Spirit", "Living ice: its touch chills.", "minion", line(5, 0, 0, 4, 1, 2, 2), touch("medium"), { statuses: ["rime"] });
const iceGolem = enemy("ice_golem", "Ice Golem", "Every hit thickens its ice.", "elite", line(14, 0, 0, 5, 2, 2, 3), basic("great_weapon", "heavy"), { abilities: ["brace"], statuses: ["ice_crust_passive"] });
const iceTitan = enemy("ice_titan", "Ice Titan", "A walking glacier.", "boss", { ...line(110, 6, 2, 14, 6, 2, 4), "immune:dispel": 1 }, basic("great_weapon", "massive"), { abilities: ["hailstorm"], statuses: ["frozen_core"] });

const wisp = enemy("wisp", "Wisp", "A tiny spark with a temper.", "minion", line(1, 0, 0, 2, 0, 2, 1), basic("wand", CASTER_TOUCH), { statuses: ["static"] });
const leech = enemy("leech", "Leech", "Drinks mana.", "minion", { ...line(3, 0, 0, 3, 1, 2, 2), siphon: SPECIAL.siphon.high }, basic("dagger"));
const stormQueen = enemy("storm_queen", "Storm Queen", "Queen of the storm drones.", "boss", line(85, 10, 4, 13, 3, 2, 4), touch("medium"), { abilities: ["call_drones", "tempest"] });
const drone = enemy("drone", "Drone", "The queen's drone: it buzzes in front of her.", "minion", line(2, 2, 2, 2, 0, 2, 3), basic("wand", CASTER_TOUCH), { abilities: ["shield_up"] });
const stormKing = enemy("storm_king", "Storm King", "The Storm Queen's mate. Hurt his soldiers and he gets angry.", "boss", line(100, 10, 4, 13, 4, 2, 4), touch("slow", "massive"), { abilities: ["rally_soldiers"], statuses: ["vengeance"] });
const soldier = enemy("soldier", "Soldier", "The king's soldier: it stands in front of him.", "minion", line(9, 2, 2, 2, 2, 2, 3), basic("wand", "weak"), { abilities: ["shield_up"] });

export const enemies: EnemyT[] = [
  wolf, bandit, archer, snake, shieldman, ogre, ogreChief,
  skeleton, bat, ghost, bonePriest, witch, lich, ghoul, reaper, wraith, silentOne,
  hellhound, lavaSlime, miniSlime, bombBug, fireImp, fireGiant,
  iceSpirit, iceGolem, iceTitan,
  wisp, leech, stormQueen, drone, stormKing, soldier,
  reskin(wolf, "snow_wolf", "Snow Wolf", "Hunts in packs, in the snow."),
  reskin(ogre, "troll", "Troll", "Big, slow, and swings a tree, under the ground."),
  reskin(shieldman, "mummy", "Mummy", "Hides behind a big, old shield."),
  reskin(ghost, "ice_ghost", "Ice Ghost", "Blows pass right through it, cold as it is."),
];
