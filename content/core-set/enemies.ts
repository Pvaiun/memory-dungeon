/**
 * The 29 enemies, their adds and reskins (docs/core-set/enemies-encounters-and-dungeons.md),
 * with their abilities and passives. Stat lines are HP, MP, MP regen, Attack,
 * Magic, Armor, Crit, Aggro, as the document lists them.
 */
import type { AbilityT, EnemyT, StatusT, WeaponT } from "../../src/schema.js";
import { ENEMY_COOLDOWN, COST, ENEMY_HIT, ENEMY_SPEED_FACTOR, ENEMY_SWING, FLAT_STACKS, HIT, RANK_RESIST, RESIST, REVIVE, SPECIAL, SPEED, STATUS, WINDUP, BOSS_HP, crit, jitter, aggroOf, pts, type SwingWord } from "./scale.js";
import { T } from "./classes.js";
import { speedOf } from "./vocabulary.js";

type CD = keyof typeof ENEMY_COOLDOWN;
type WU = keyof typeof WINDUP;
const timing = (cd: CD, wu: WU) => ({ cooldown: ENEMY_COOLDOWN[cd], cast: WINDUP[wu], mp: COST[cd] });

/** A basic attack by kind and words: a flat swing from the word (see ENEMY_SWING); the kind sets how often. */
const swing = (speed: keyof typeof SPEED, word: SwingWord) => Math.round(ENEMY_SPEED_FACTOR[speed] * ENEMY_SWING[word]);
const basic = (kind: string, word: SwingWord = "normal", extra: Partial<WeaponT> = {}): WeaponT => ({ kind, amount: swing(speedOf(kind), word), ...extra });
/**
 * Step 5g (the director's: "very few enemies have multi-hits"): a basic attack of two bites, each this share of the one swing, so the pair
 * is a fifth bigger before Armor and about the same after it (Armor cuts small hits more); Thorns, Bleed on the attacker and Guard meet
 * it twice. The skirmishers' swing.
 */
const MULTI_SHARE = 0.6;
const flurry = (kind: string, word: SwingWord = "normal", extra: Partial<WeaponT> = {}): WeaponT => ({ kind, amount: Math.round(MULTI_SHARE * swing(speedOf(kind), word)), hits: 2, ...extra });
/** A basic attack with no kind of its own (a touch, a slam): type, subtype or element, and speed. */
const touch = (p: { subtype?: "slash" | "pierce" | "blunt"; element?: string }, speed: keyof typeof SPEED, word: SwingWord = "normal", extra: Partial<WeaponT> = {}): WeaponT => ({
  type: p.element ? "magical" : "physical", ...p, cooldown: SPEED[speed], amount: swing(speed, word), ...extra,
});

const line = (hp: number, mp: number, regen: number, atk: number, mag: number, armor: number, c: number, aggro: number) => ({
  max_hp: pts(hp), max_mp: pts(mp), mp_regen: pts(regen), attack: pts(atk), magic: pts(mag), armor: pts(armor), crit_chance: crit(c), aggro: aggroOf(aggro),
});
const res = (element: string, kind: keyof typeof RESIST) => ({ [`resist:${element}`]: RESIST[kind] });

const enemy = (id: string, name: string, text: string, rank: EnemyT["rank"], stats: Record<string, number>, weapon: WeaponT, o: { abilities?: string[]; statuses?: string[]; note?: string } = {}): EnemyT => ({
  // Step 5f (the director's): elites and bosses carry blanket resistance, as every foe carries Armor; a foe that names its own keeps it.
  id, name, text, rank, stats: { ...("resist" in stats ? {} : { resist: RANK_RESIST[rank] }), ...stats, ...(rank === "boss" ? { max_hp: Math.round(stats.max_hp * BOSS_HP) } : {}) }, weapon, ...(o.abilities ? { abilities: o.abilities } : {}), ...(o.statuses ? { statuses: o.statuses } : {}), ...(o.note ? { note: o.note } : {}),
});
const reskin = (of: EnemyT, id: string, name: string, text: string): EnemyT => ({ ...of, id, name, text, note: `A reskin of the ${of.name}: the same numbers.` });

const passive = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
const apply = (status: string, extra: object = {}) => ({ op: "apply", status, ...extra }) as const;

// ─── Passives ────────────────────────────────────────────────────────────────

export const enemyStatuses: StatusT[] = [
  // Step 5c: Bleed, not Poison (the director's: "this also works with the snakes").
  // Step 5g round 3: one stack a bite (was two): at 120 a stack, a 67-damage bite left a wound that cost 240 on every hit after, and three snakes killed two heroes.
  passive("venom", "Venom", "Its bites leave wounds that bleed.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("bleed", { stacks: FLAT_STACKS.one, to: "other" })] }] }),
  passive("fire_bite", "Fire bite", "Its bites burn.", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("burn", { stacks: FLAT_STACKS.one, to: "other" })] }] }),
  passive("split", "Split", "Below half HP it splits in two.", { reactions: [{ on: { event: "hp_lost" }, do: [{ op: "replace", enemy: "mini_slime", count: 2, to: { side: "self", where: { hpBelow: 50 } } }] }] }),
  passive("volatile", "Volatile", "Explodes when it dies.", {
    survivesKO: true,
    reactions: [{ on: { event: "ko" }, do: [{ op: "damage", type: "magical", element: "fire", amount: { scale: [{ ratio: ENEMY_HIT.volatile, stat: "magic", of: "holder" }] }, to: T.everyFoe }, apply("burn", { stacks: FLAT_STACKS.few, to: T.everyFoe })] }],
  }),
  passive("rime", "Rime", "Its touch chills.", { reactions: [{ on: { event: "hit_lands" }, do: [apply("chill", { stacks: FLAT_STACKS.one, to: "other" })] }] }),
  passive("ice_crust_passive", "Ice crust", "Every hit it takes thickens its ice.", { reactions: [{ on: { event: "hit_taken" }, do: [apply("ice_crust", { to: "holder" })] }] }),
  { id: "ice_crust", name: "CRUST", text: "Armor up for each stack; thaws when the hits stop.", label: "buff", show: "icon", stacking: "intensity", unremovable: true, duration: STATUS.ice_crust.duration, cap: STATUS.ice_crust.cap, stats: [{ stat: "armor", flat: STATUS.ice_crust.perStack }] },
  passive("frozen_core", "Frozen core", "Its Bulwark stands from the start, and nothing strips its buffs.", { reactions: [{ on: { event: "fight_start" }, do: [apply("bulwark", { stacks: STATUS.bulwark.stacks, to: "holder" })] }] }),
  passive("static", "Static", "Its zaps shock.", { reactions: [{ on: { event: "hit_lands" }, do: [apply("shock", { stacks: FLAT_STACKS.one, to: "other" })] }] }),
  passive("vengeance", "Vengeance", "Several Might when one of his Soldiers falls.", { reactions: [{ on: { event: "ko", whose: "ally" }, do: [apply("might", { stacks: FLAT_STACKS.several, to: "holder" })] }] }),
];

// ─── Abilities ───────────────────────────────────────────────────────────────

// Pacing pass: as for the classes, each ability's cooldown is moved by its id (scale.ts, jitter).
const a = (id: string, name: string, text: string, body: Partial<AbilityT> & { do: AbilityT["do"]; cooldown: number }): AbilityT => ({ id, name, text, ...body, cooldown: jitter(body.cooldown, id) });
const fromStat = (stat: string, ratio: number) => ({ scale: [{ ratio, stat }] });

// Pacing pass: a boss's signature move (Crush, Inferno, Death bell, Tempest, its summons) is on a medium cooldown, not long, so
// a shorter boss fight still sees it two or three times. Its size is unchanged.
// Step 5f round 5 (the director's: "their abilities should need to be played against, and occur multiple times per fight"): the
// signature blows and spells on a short cooldown (22); the summons stay medium, or the room fills.
export const enemyAbilities: AbilityT[] = [
  a("shield_up", "Shield up", "Taunts.", { ...timing("short", "quick"), target: "self", do: [apply("taunt")] }),
  a("brace", "Brace", "Guards itself.", { ...timing("medium", "quick"), mp: 0, target: "self", do: [apply("guard")] }), // Step 5g: free, as the Skeleton and Golem carry no MP.
  // Step 5g (the director's: more foes with simple buffs, so Judgement, Unmake and Dispel have targets; and elites with a move of their own).
  a("take_aim", "Take aim", "Several Might on itself.", { ...timing("medium", "quick"), mp: 0, target: "self", do: [apply("might", { stacks: FLAT_STACKS.several })] }),
  a("dark_ward", "Dark ward", "Wards itself.", { ...timing("medium", "quick"), mp: 0, target: "self", do: [apply("ward")] }), // Free, so it never takes the Soulfire's MP.
  a("shield_slam", "Shield slam", "A blunt blow with the shield that Stuns.", { ...timing("medium", "normal"), target: { side: "foes", where: { lacks: "stun" }, ifNone: "any" }, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: fromStat("attack", 1.0), apply: [{ status: "stun" }] }] }),
  // Step 5g (the feel read): Flatten, Soulfire and Curse on the medium word (were long, 48 ticks): "foe moves promised and not cast" (Soulfire 0.33 casts an appearance, Flatten 0.68).
  a("flatten", "Flatten", "A heavy blow that Stuns.", { ...timing("medium", "long"), target: { side: "foes", where: { lacks: "stun" }, ifNone: "any" }, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: fromStat("attack", ENEMY_HIT.flatten), apply: [{ status: "stun" }] }] }),
  // Step 5f: Crush on a short cooldown (was medium): the Ogre Chief cast it 0.6 times a fight, its fight being the shortest.
  a("crush", "Crush", "A massive blow.", { ...timing("short", "very_long"), do: [{ op: "damage", type: "physical", subtype: "blunt", amount: fromStat("attack", ENEMY_HIT.crush) }] }),
  a("mend", "Mend", "Heals the most hurt ally.", { ...timing("short", "normal"), ...{ if: { side: "allies", where: { hpBelow: 100 } } }, target: T.lowestShareAlly, do: [{ op: "heal", amount: fromStat("magic", ENEMY_HIT.mend) }] }),
  a("curse", "Curse", "Weakens and Slows every foe.", { ...timing("medium", "long"), target: T.everyFoe, do: [apply("weaken"), apply("slow")] }),
  a("soulfire", "Soulfire", "A heavy Dark spell.", { ...timing("medium", "very_long"), do: [{ op: "damage", type: "magical", element: "dark", amount: fromStat("magic", ENEMY_HIT.soulfire) }] }),
  a("dig_up", "Raise", "Digs a fallen packmate back up.", { ...timing("medium", "long"), if: { side: "allies", where: { ko: true } }, target: T.koAlly, do: [{ op: "revive", hp: { scale: [{ ratio: REVIVE.ghoul, stat: "max_hp", of: "target" }] } }] }),
  a("death_bell", "Death bell", "Dooms a foe.", { ...timing("short", "long"), if: { side: "foes", where: { lacks: "doom" } }, target: { side: "foes", where: { lacks: "doom" } }, do: [apply("doom")] }),
  // Step 5g round 5 (the director's: bosses with behaviours of their own, the one-shot the Ogre Chief's alone).
  a("reap", "Reap", "Three scythe slashes at random foes.", { ...timing("medium", "normal"), target: { side: "foes", pick: "random" }, do: [1, 2, 3].map(() => ({ op: "damage" as const, type: "physical" as const, subtype: "slash" as const, amount: fromStat("attack", ENEMY_HIT.reap), to: { side: "foes" as const, pick: "random" as const } })) }),
  a("tolling", "Tolling", "Many Might and Haste on itself: its swings come faster and harder.", { ...timing("short", "quick"), mp: 0, target: "self", do: [apply("might", { stacks: FLAT_STACKS.many }), apply("haste")] }), // Round 6: many (was several): seven tollings moved its swing 8%; "a lock, not a threat".
  a("kindle", "Kindle", "Many Might and a Ward on itself; the Inferno follows.", { ...timing("medium", "quick"), mp: 0, target: "self", do: [apply("might", { stacks: FLAT_STACKS.many }), apply("ward")] }),
  a("mute", "Mute", "Silences the foe with the highest Attack or Magic.", { ...timing("medium", "normal"), if: { side: "foes", where: { lacks: "silence" } }, target: { ...T.highestAMFoe, where: { lacks: "silence" } }, do: [apply("silence")] }),
  // Step 5g round 4: medium (was short): at 22 the Silent One silenced the party 9 times a fight, 73% of the time, and the calibration gave it 218,000 HP to beat parties that could only swing; a 230-tick slog.
  a("quiet", "Quiet", "Silences every foe.", { ...timing("medium", "long"), target: T.everyFoe, do: [apply("silence")] }),
  a("cheer", "Cheer", "Might and Haste on its strongest ally.", { ...timing("medium", "normal"), target: T.highestAMAlly, do: [apply("might", { stacks: FLAT_STACKS.several }), apply("haste")] }),
  a("brand", "Brand", "Fire on a foe, with a few Burn.", { ...timing("short", "quick"), do: [{ op: "damage", type: "magical", element: "fire", amount: fromStat("magic", ENEMY_HIT.brand), apply: [{ status: "burn", stacks: FLAT_STACKS.few }] }] }),
  // Step 5g round 2: several Burn (was many: with Burn uncapped and slow to fade, 7 stacks were 2,900 more damage per unit on top of the blast).
  a("inferno", "Inferno", "A very long cast: huge Fire on every foe, with several Burn. It waits until the Giant has kindled.", { ...timing("short", "very_long"), if: { side: "self", where: { has: "might" } }, target: T.everyFoe, do: [{ op: "damage", type: "magical", element: "fire", amount: fromStat("magic", ENEMY_HIT.inferno), apply: [{ status: "burn", stacks: FLAT_STACKS.several }] }] }),
  a("hailstorm", "Hailstorm", "Ice on every foe, with a stack of Chill.", { ...timing("short", "normal"), target: T.everyFoe, do: [{ op: "damage", type: "magical", element: "ice", amount: fromStat("magic", ENEMY_HIT.hailstorm), apply: [{ status: "chill", stacks: FLAT_STACKS.one }] }] }),
  a("call_drones", "Call drones", "Summons two Drones.", { ...timing("medium", "long"), do: [{ op: "summon", enemy: "drone", count: 2 }] }),
  // Step 5g round 5 (the director's): three bolts at random foes (two may land on one), each with a stack of Shock, in place of one blast on everyone.
  a("tempest", "Tempest", "Three lightning bolts at random foes, each with a stack of Shock.", { ...timing("short", "long"), target: { side: "foes", pick: "random" }, do: [1, 2, 3].map(() => ({ op: "damage" as const, type: "magical" as const, element: "lightning", amount: fromStat("magic", ENEMY_HIT.tempest), apply: [{ status: "shock", stacks: FLAT_STACKS.one }], to: { side: "foes" as const, pick: "random" as const } })) }),
  a("rally_soldiers", "Rally", "Summons two Soldiers.", { ...timing("medium", "long"), do: [{ op: "summon", enemy: "soldier", count: 2 }] }),
];

// ─── Enemies ─────────────────────────────────────────────────────────────────

const wolf = enemy("wolf", "Wolf", "Hunts in packs.", "minion", line(2, 0, 0, 2, 0, 0, 2, 2), flurry("dagger", "weak")); // Step 5g: two bites a swing.
const bandit = enemy("bandit", "Bandit", "A common road thug.", "minion", line(4, 0, 0, 3, 0, 1, 2, 3), basic("sword"));
const archer = enemy("archer", "Archer", "Hits hard, falls fast.", "minion", line(2, 0, 0, 7, 0, 0, 4, 2), basic("bow", "heavy"), { abilities: ["take_aim"] }); // Step 5g: it takes aim (Might on itself).
const snake = enemy("snake", "Snake", "Its bite leaves a bleeding wound.", "minion", line(2, 0, 0, 2, 0, 0, 2, 1), basic("dagger", "weak"), { statuses: ["venom"] });
const shieldman = enemy("shieldman", "Shieldman", "Hides behind a big shield.", "elite", line(10, 3, 2, 2, 0, 5, 1, 4), basic("sword"), { abilities: ["shield_up", "shield_slam"] }); // Step 5g: a slam that Stuns in Brace's place (an elite that dealt 708 an appearance and wasted 36 ticks).
// Step 5g round 3: a massive swing (was heavy): on a 16-tick axe with a 6-tick wind-up the elite swung three times in 35 ticks for a minion's damage a tick.
const ogre = enemy("ogre", "Ogre", "Big, slow, and swings a tree.", "elite", line(16, 2, 1, 6, 0, 2, 2, 4), basic("axe", "massive", { cast: WINDUP.long }), { abilities: ["flatten"], note: "Its basic attack has a long wind-up: an exception to the no-wind-up default." });
const ogreChief = enemy("ogre_chief", "Ogre Chief", "The biggest ogre, with the biggest club.", "boss", line(60, 4, 2, 12, 0, 3, 2, 4), basic("axe", "heavy"), { abilities: ["crush"] });

const skeleton = enemy("skeleton", "Skeleton", "Old bones in heavy armor.", "minion", line(3, 0, 0, 3, 0, 8, 2, 3), basic("sword", "normal", { cooldown: SPEED.slow }), { abilities: ["brace"] }); // Step 5g: it braces (Guard on itself).
const bat = enemy("bat", "Bat", "Fast, and hard to hit.", "minion", { ...line(2, 0, 0, 2, 0, 0, 2, 2), evasion: SPECIAL.evasion.high }, basic("dagger", "weak"));
const ghost = enemy("ghost", "Ghost", "Magic passes right through it.", "minion", { ...line(6, 0, 0, 0, 3, 0, 2, 2), resist: RESIST.high }, touch({ element: "dark" }, "medium"));
const bonePriest = enemy("bone_priest", "Bone Priest", "Heals the other dead.", "minion", line(3, 6, 3, 0, 7, 1, 2, 1), touch({ element: "dark" }, "medium", "weak"), { abilities: ["mend"] });
const witch = enemy("witch", "Witch", "Curses the whole party.", "minion", line(3, 5, 3, 0, 4, 0, 2, 2), touch({ element: "dark" }, "medium", "weak"), { abilities: ["curse"] });
const lich = enemy("lich", "Lich", "A dead wizard with one big spell.", "minion", line(2, 6, 2, 0, 7, 0, 2, 2), touch({ element: "dark" }, "medium", "weak"), { abilities: ["soulfire", "dark_ward"] }); // Step 5g: it wards itself.
const ghoul = enemy("ghoul", "Ghoul", "Ghouls dig each other back up.", "minion", line(8, 3, 2, 4, 0, 1, 2, 3), basic("sword"), { abilities: ["dig_up"] });
const reaper = enemy("reaper", "Reaper", "Death, with a scythe and a bell.", "boss", line(85, 8, 3, 9, 12, 4, 2, 4), basic("sword", "heavy"), { abilities: ["death_bell", "reap"] });
const wraith = enemy("wraith", "Wraith", "Steals voices.", "minion", line(4, 5, 3, 0, 5, 0, 2, 2), touch({ element: "dark" }, "medium", "weak"), { abilities: ["mute"] });
const silentOne = enemy("silent_one", "Silent One", "Its silence falls on everyone.", "boss", line(90, 10, 3, 11, 12, 5, 2, 4), basic("sword", "massive"), { abilities: ["quiet", "tolling"] }); // Round 6: a massive swing (was heavy): the silence is the lock, the sword must be the threat.

const hellhound = enemy("hellhound", "Hellhound", "A fire dog; its bite burns.", "minion", { ...line(3, 0, 0, 3, 0, 0, 2, 2), ...res("fire", "resists"), ...res("ice", "weak") }, flurry("dagger", "weak"), { statuses: ["fire_bite"] }); // Step 5g: two bites a swing, each burning.
const lavaSlime = enemy("lava_slime", "Lava Slime", "Cut it in half and you get two.", "elite", { ...line(14, 0, 0, 4, 0, 1, 2, 3), ...res("fire", "resists"), ...res("ice", "weak") }, touch({ subtype: "blunt" }, "slow"), { statuses: ["split"] });
const miniSlime = enemy("mini_slime", "Mini Slime", "Half a slime, still hungry.", "minion", { ...line(7, 0, 0, 3, 0, 1, 2, 3), ...res("fire", "resists"), ...res("ice", "weak") }, touch({ subtype: "blunt" }, "slow"));
const bombBug = enemy("bomb_bug", "Bomb Bug", "Explodes when it dies.", "minion", { ...line(6, 0, 0, 2, 5, 3, 2, 2), ...res("fire", "resists") }, touch({ subtype: "blunt" }, "medium"), { statuses: ["volatile"] });
const fireImp = enemy("fire_imp", "Fire Imp", "Cheers its friends on.", "minion", line(3, 5, 3, 0, 3, 1, 2, 1), touch({ element: "fire" }, "medium", "weak"), { abilities: ["cheer"] });
const fireGiant = enemy("fire_giant", "Fire Giant", "Lord of the furnace.", "boss", { ...line(95, 10, 3, 0, 14, 5, 2, 4), ...res("fire", "absorbs"), ...res("ice", "weak") }, basic("fire_staff", "heavy"), { abilities: ["brand", "kindle", "inferno"] });

const iceSpirit = enemy("ice_spirit", "Ice Spirit", "Living ice: ice heals it, fire melts it.", "minion", { ...line(5, 0, 0, 0, 4, 1, 2, 2), ...res("ice", "absorbs"), ...res("fire", "weak") }, touch({ element: "ice" }, "medium"), { statuses: ["rime"] });
const iceGolem = enemy("ice_golem", "Ice Golem", "Every hit thickens its ice.", "elite", { ...line(14, 0, 0, 5, 0, 2, 2, 3), ...res("ice", "resists") }, basic("axe", "heavy"), { abilities: ["brace"], statuses: ["ice_crust_passive"] }); // Step 5g: it braces too.
const iceTitan = enemy("ice_titan", "Ice Titan", "A walking glacier.", "boss", { ...line(110, 6, 2, 14, 8, 6, 2, 4), ...res("ice", "resists"), "immune:dispel": 1 }, basic("axe", "massive"), { abilities: ["hailstorm"], statuses: ["frozen_core"] });

const wisp = enemy("wisp", "Wisp", "A tiny spark with a temper.", "minion", line(1, 0, 0, 0, 2, 0, 2, 1), basic("lightning_staff", "weak"), { statuses: ["static"] });
const leech = enemy("leech", "Leech", "Drinks mana.", "minion", { ...line(3, 0, 0, 3, 0, 1, 2, 2), siphon: SPECIAL.siphon.high }, basic("dagger"));
const stormQueen = enemy("storm_queen", "Storm Queen", "Queen of the storm drones.", "boss", line(85, 10, 4, 0, 13, 3, 2, 4), touch({ element: "lightning" }, "medium"), { abilities: ["call_drones", "tempest"] });
const drone = enemy("drone", "Drone", "The queen's drone: it buzzes in front of her.", "minion", line(2, 2, 2, 0, 2, 0, 2, 3), basic("lightning_staff", "weak"), { abilities: ["shield_up"] });
const stormKing = enemy("storm_king", "Storm King", "The Storm Queen's mate. Hurt his soldiers and he gets angry.", "boss", line(100, 10, 4, 0, 13, 4, 2, 4), touch({ element: "lightning" }, "slow", "massive"), { abilities: ["rally_soldiers"], statuses: ["vengeance"] });
const soldier = enemy("soldier", "Soldier", "The king's soldier: it stands in front of him.", "minion", line(9, 2, 2, 0, 2, 2, 2, 3), basic("lightning_staff", "weak"), { abilities: ["shield_up"] });

export const enemies: EnemyT[] = [
  wolf, bandit, archer, snake, shieldman, ogre, ogreChief,
  skeleton, bat, ghost, bonePriest, witch, lich, ghoul, reaper, wraith, silentOne,
  hellhound, lavaSlime, miniSlime, bombBug, fireImp, fireGiant,
  iceSpirit, iceGolem, iceTitan,
  wisp, leech, stormQueen, drone, stormKing, soldier,
  reskin(wolf, "snow_wolf", "Snow Wolf", "Hunts in packs, in the snow."),
  reskin(ogre, "troll", "Troll", "Big, slow, and swings a tree, under the ground."),
  reskin(shieldman, "mummy", "Mummy", "Hides behind a big, old shield."),
  reskin(ghost, "ice_ghost", "Ice Ghost", "Magic passes right through it, cold as it is."),
];
