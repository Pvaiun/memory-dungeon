/**
 * The core set's scale: first values for every word in the documents.
 *
 * The documents give a relative scale (stats from 1 to 5, cooldowns short to
 * long, "a few" stacks). This file turns each word into a number, in one place,
 * so the tuning pass changes a constant here and regenerates the pack.
 *
 * Amount stats are stored at 1,000 per point of the scale (HP 2 is 2,000), as
 * docs/core-set/README.md asks. Stats counted in percent (Crit chance, Evasion,
 * Accuracy, resistances, Lifesteal, Siphon, Double strike) are stored in percent
 * points, since a percentage can't be ×1,000.
 */
import type { NumT } from "../../src/schema.js";

/** One point of the relative scale, for amount stats. */
export const P = 1000;
export const pts = (n: number) => n * P;

/** A class's Crit n is 5n%. */
export const crit = (n: number) => 5 * n;

// ─── Timing, in ticks ────────────────────────────────────────────────────────

/** Weapon kinds' speeds: the basic attack's base cooldown. */
export const SPEED = { fast: 6, medium: 10, slow: 16 } as const;
/**
 * Regular fights last about 30 ticks and every action starts a fight on cooldown, so at long = 30 the Cleric's
 * Prayer never fired in one and a boss's signature blow came once in 38 ticks. Shorter words keep the ratios.
 */
export const COOLDOWN = { short: 6, medium: 12, long: 22 } as const;
/**
 * The classes document's fallback for Stun: "a long-cooldown Stun with no timing condition may rarely catch a
 * wind-up. The fallback is a shorter Stun on a shorter cooldown." With Shield bash and Inferno both on long
 * cooldowns, the bash came five ticks before every Inferno wind-up, in every seed. Stuns run on this instead.
 */
export const STUN_COOLDOWN: keyof typeof COOLDOWN = "medium";
export const WINDUP = { quick: 0.5, normal: 1.5, long: 4, very_long: 8 } as const;
export const RULES = {
  basicRecovery: 0.25,
  abilityCast: WINDUP.normal,
  abilityRecovery: 2.5,
  /** Each physical hit loses this share of the target's Armor: Armor 5 takes 600 off, Armor 8 nearly blanks a sword. */
  armorRatio: 0.12,
  maxEnemies: 8,
  /**
   * An interrupted cast goes on cooldown, and one whose targets are gone costs its recovery (the core-set report's
   * decisions A and E, taken on the campaign branch): a Stun that lands in Inferno's wind-up buys a whole cooldown,
   * and two Ghouls reaching for one corpse don't loop.
   */
  lostCast: "cooldown" as const,
  /**
   * Copies of an enemy start 1.5 ticks apart (campaign pass). Starting together, three Ghosts hit one target on one beat
   * for 3,700 and twin Ogre Chiefs wound up every Crush in lockstep, for the whole fight.
   */
  stagger: 1.5,
  /**
   * Past 300 ticks, everyone deals 25% more damage, and 25% more again every 30 ticks (campaign pass). An AI playtester
   * met a Vampire and two Bone Priests healing each other to the 5,000-tick safety stop, and Ghouls raising each other
   * for 2,600 ticks: minutes of watching nothing. Boss fights end in 100 to 250.
   */
  enrage: { after: 300, every: 30, pct: 25 },
};

/** MP cost follows the cooldown unless an ability is costly, which doubles it. */
export const COST = { short: 150, medium: 300, long: 500 } as const;
export const costly = (cd: keyof typeof COST) => COST[cd] * 2;
/** MP regen: every `every` ticks, restore `share` × the MP regen stat (regen 3 gives 150). */
export const MP_REGEN = { every: 4, share: 0.05 };

// ─── Damage ──────────────────────────────────────────────────────────────────

/** A weapon's hit: speedFactor × (base + ratio × stat). Fast kinds hit for less, slow kinds for more. */
export const WEAPON = {
  base: { low: 100, medium: 200, high: 350 },
  ratio: { low: 0.15, medium: 0.3, high: 0.45 },
  speedFactor: { fast: 0.6, medium: 1, slow: 1.6 },
} as const;
export type Level = keyof typeof WEAPON.base;

/** An ability's hit, as a share of its scaling stat. */
export const HIT = { light: 0.2, normal: 0.35, heavy: 0.6 } as const;
export type HitWord = keyof typeof HIT;

/**
 * An enemy's basic attack is set by its words alone (weak, normal, heavy, massive), per swing; its speed word
 * sets how often it swings, and its Attack and Magic feed only its abilities. A boss's standout Attack would
 * otherwise make its plain swing bigger than its signature blow. A weak swing gets through Armor 2 and is
 * blanked by Armor 5, as the Wolf's bites are meant to be.
 */
export const ENEMY_SWING = { weak: 500, normal: 700, heavy: 1100, massive: 1600 } as const;
/**
 * A fast swing lands for less (a Leech's bite isn't a Bandit's sword twice as often); a slow one for the same,
 * since the slow attackers carry the big blows in their abilities (Flatten, Crush). A slow factor of 1.4 pulled
 * run 1 from 55% to 35% for the starters in round 8.
 */
export const ENEMY_SPEED_FACTOR = { fast: 0.75, medium: 1, slow: 1 } as const;
export type SwingWord = keyof typeof ENEMY_SWING;

/** Enemy abilities' shares of Attack or Magic, chosen against party HP (2,000 to 5,000). */
export const ENEMY_HIT = {
  /** Flatten: a heavy blow that Stuns. Nearly kills a caster. */
  flatten: 0.4,
  /** Crush: knocks out any unguarded caster outright; a Guarded, Shielded Knight survives it. */
  crush: 0.5,
  /** Mend: the Bone Priest's heal, about a party's damage output: a mirror until the priest is stopped. */
  mend: 0.6,
  /** Soulfire: deletes a caster. */
  soulfire: 0.6,
  /** Brand: steady pressure. */
  brand: 0.05,
  /** Inferno: ends the run if it lands uninterrupted. */
  /** Campaign pass: 0.5 wiped every party it landed on; at 0.35 it nearly wipes, and an interrupt buys a whole cooldown. */
  inferno: 0.35,
  /** Hailstorm: a raidwide the Cleric can mend. */
  hailstorm: 0.08,
  /** Tempest: a raidwide the Cleric can absorb. */
  tempest: 0.06,
  /** Volatile: one blast behind Shields is fine; three together wipe. */
  volatile: 0.25,
} as const;

/**
 * Some amounts scale from a percent stat (Backstab from Crit chance, Needle too, Mist claws from Evasion).
 * Per point of the relative scale, Crit chance moves 5% and Evasion about 7%, so a percent of either is
 * worth this many units of an amount stat.
 */
export const PER_PERCENT: Record<string, number> = { crit_chance: 200, evasion: 150, accuracy: 150, double_strike: 150, lifesteal: 150, siphon: 200 };

/** `ratio × stat`, with percent stats converted so that a typical holder's value lands near an amount stat's. */
export const from = (stat: string, ratio: number, base = 0): NumT => ({ ...(base ? { base } : {}), scale: [{ ratio: ratio * (PER_PERCENT[stat] ?? 1), stat }] });

// ─── Stacks ──────────────────────────────────────────────────────────────────

/** Stacks an application adds, per point of the scaling stat: at stat 3 a few is about 2, several about 4, many about 7. */
export const STACKS = { few: 0.7, several: 1.3, many: 2.3 } as const;
export type StackWord = keyof typeof STACKS;
export const stacks = (word: StackWord, stat: string): NumT => ({ scale: [{ ratio: STACKS[word] / P, stat }] });
/** A flat stack count, for enemies that apply "a stack" or statuses that start with "many". */
export const FLAT_STACKS = { one: 1, few: 2, several: 4, many: 7 } as const;

// ─── Special stats, at a level ───────────────────────────────────────────────

export const SPECIAL = {
  evasion: { medium: 20, high: 35 },
  accuracy: { medium: 20, high: 35 },
  /** Added to the crit multiplier (base 150%). */
  crit_damage: { medium: 50, high: 100 },
  double_strike: { medium: 25, high: 40 },
  /** Untyped damage dealt back per hit taken. */
  thorns: { medium: 150, high: 300 },
  lifesteal: { medium: 15, high: 30 },
  siphon: { medium: 10, high: 20 },
} as const;
export type SpecialStat = keyof typeof SPECIAL;
export type SpecialLevel = "medium" | "high";

/** The engine stat a special stat word maps to. */
export const SPECIAL_KEY: Record<SpecialStat, string> = {
  evasion: "evasion", accuracy: "accuracy", crit_damage: "crit_multiplier", double_strike: "double_strike", thorns: "thorns", lifesteal: "lifesteal", siphon: "siphon",
};

// ─── Resistances, in percent ─────────────────────────────────────────────────

export const RESIST = {
  /** A class or enemy that "resists" an element. */
  resists: 50,
  /** "Weak to". */
  weak: -50,
  /** The Ghost's "high against every element": most spells print slivers, nothing is immune. */
  high: 75,
  /** "Absorbs": past full, the excess heals. */
  absorbs: 150,
  /** A piece of gear that "resists" an element: short of full on its own. */
  gear: 30,
};

// ─── Gear steps ──────────────────────────────────────────────────────────────

/** +1 on gear or a formation slot, for an amount stat; crit chance moves in crit() steps. */
export const STEP = P;
/**
 * A gear or formation step of max HP is half a point (campaign pass). At a whole point, Heartstone doubled a caster's HP
 * and fed its Regen and Shield cap too, so HP everywhere was every class's best kit.
 */
export const HP_STEP = P / 2;
/** The step for a stat, in the data's units. */
export const stepFor = (stat: string) => (stat === "max_hp" ? HP_STEP : STEP);

// ─── Statuses: sizes and durations ───────────────────────────────────────────

export const STATUS = {
  /** 90 a tick-pair: Regen on a 2-HP unit (80) nearly outruns it, as the Snake Pit's story needs. */
  /** Campaign pass: 160 a pulse for 12 ticks, about a third of a caster's HP per application. At 90 it showed as 1. */
  poison: { every: 2, damage: 160, duration: 12 },
  /** 8 pulses of 4%: a Prayer heals a third of everyone's max HP over 16 ticks. */
  regen: { every: 2, share: 0.04, duration: 16 },
  shield: { capShare: 0.5 },
  /** Campaign pass: a cap of 25 stacks. Uncapped, a hidden Bard stacked 123 on itself and the Storm King reached 38. */
  might: { perStack: 8, every: 4, cap: 25 },
  weaken: { pct: -30, duration: 10 },
  guard: { armor: pts(2), duration: 10 },
  /**
   * Follow-up redesign (the director's): a Stun pauses a wind-up rather than cancelling it (Silence is the interrupt), and
   * lasts long enough to take a foe out of the fight for a moment. It was 2 ticks.
   */
  stun: { duration: 5 },
  /** The Bard's Refrain: MP a basic attack gives a random ally. */
  refrain: { mp: 100 },
  slow: { speed: -40, duration: 10 },
  haste: { speed: 40, duration: 10 },
  taunt: { duration: 8 },
  /**
   * Campaign pass: a tenth of the stacks go each pulse, not a quarter, so Burn builds over a fight (a Pyromancer
   * holds 15 to 25 on its target) and lingers when the burning stops. Each stack burns for 30 a pulse, so a stack's
   * whole Burn is 1.5 times what it was: slower Burn spends more of itself after its target is dead.
   */
  burn: { every: 2, perStack: 30, drop: 0.1 },
  chill: { cap: 8, perStack: -6, every: 3, drop: 1 / 3 },
  /**
   * Campaign pass: a cap of 25 stacks (uncapped, a slow boss gathered 50 to 100 and took 8,000 from one swing), and 60 a
   * stack, not 80 (the second AI playtester's Stormcaller carried the last nine nodes).
   */
  shock: { perStack: 60, drop: 0.5, cap: 25 },
  ward: { resist: 30, duration: 12 },
  sunder: { perStack: -600, every: 4 },
  silence: { duration: 6 },
  hidden: { duration: 8 },
  rot: { healing: -60, duration: 10 },
  clarity: { regenPct: 100, duration: 12 },
  aegis: { share: 25 },
  /** Kills anything at HP 3 or below; a Hoplite or Knight survives it. */
  doom: { countdown: 10, damage: 3500 },
  bulwark: { stacks: 6, broken: 5, takenPct: 100 },
  ice_crust: { perStack: pts(1), duration: 6, cap: 6 },
} as const;

/** The campfire before each campaign boss: REST gives back this % of max HP to everyone standing, FOCUS this % of max MP. */
export const CAMPFIRE = { hp: 40, mp: 40 } as const;

/** Shares of max HP a revive brings a unit back with. */
export const REVIVE = { half: 0.5, tenth: 0.1, ghoul: 0.3 } as const;
