/**
 * The core set's scale: first values for every word in the documents.
 *
 * The documents give a relative scale (stats from 1 to 5, cooldowns short to
 * long, "a few" stacks). This file turns each word into a number, in one place,
 * so tuning changes a constant here and regenerates the pack.
 *
 * Amount stats are stored at 1,000 per point of the scale (HP 2 is 2,000), as
 * docs/primer.md (Numbers) says. Stats counted in percent (Crit chance, Evasion,
 * Accuracy, Magic resist, Lifesteal, Siphon, Double strike) are stored in percent
 * points, since a percentage can't be ×1,000.
 */
import type { NumT } from "../../src/schema.js";

/** One point of the relative scale, for amount stats. */
export const P = 1000;
export const pts = (n: number) => n * P;

/** A Crit word as a crit chance, in percent. Gear and formations move it in crit(1) steps. */
export const CRIT_TABLE = [0, 3, 5, 9, 16, 20] as const;
export const crit = (n: number): number => {
  if (n >= CRIT_TABLE.length - 1) return CRIT_TABLE[CRIT_TABLE.length - 1] + 4 * (n - (CRIT_TABLE.length - 1));
  if (n <= 0) return 0;
  const i = Math.floor(n), f = n - i; // a formation's half steps sit between the table's points
  return Math.round((CRIT_TABLE[i] + f * (CRIT_TABLE[i + 1] - CRIT_TABLE[i])) * 10) / 10;
};

// ─── Timing, in ticks ────────────────────────────────────────────────────────

/**
 * Every weapon kind swings on its own cooldown, in ticks, so a party's basic attacks don't land on one tick. A swing's size
 * follows its cooldown (see SWING_REF), so every kind deals about the same per tick.
 */
export const KIND_SPEED: Record<string, number> = {
  dagger: 5.6, fist: 6.0, wand: 6.6, sword: 8.2, rune_sword: 8.5, bow: 8.8, rod: 9.1, spear: 9.4, mace: 11.0, staff: 11.6, great_weapon: 12.8,
};
/** A swing's size is (base + ratio × stat) × its cooldown ÷ this. */
export const SWING_REF = 16;
/** The documents' speed words, for enemies' touches and a kind's damage word: between the kinds' cooldowns, so they don't line up either. */
export const SPEED = { fast: 6.5, medium: 8.7, slow: 11.3 } as const;
/**
 * The party's ability cooldowns, in ticks; the very long word is the revives'. Each kit mixes the words by its class's tempo
 * (classes.ts): repeat applicators (stacks on foes, the Bard's Might, Cure's top-ups) sit on quick words, and a self-buff
 * with a duration sits on a word longer than the duration.
 */
export const COOLDOWN = { quick: 14, short: 22, medium: 30, long: 40, very_long: 56 } as const;
/** Foes' cooldowns, in ticks, so a boss's moves come two or three times a fight, as the enemies document asks. */
export const ENEMY_COOLDOWN = { short: 24, medium: 38, long: 55 } as const;
/**
 * An ability's cooldown: its word's, moved up to 15% either way by its id, so no two in a kit share one and few line up with
 * each other or with a swing.
 */
export function jitter(cooldown: number, id: string): number {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return Math.round(cooldown * (0.85 + 0.3 * ((h % 997) / 997)) * 10) / 10;
}
/**
 * The classes document's fallback for Stun: "a long-cooldown Stun with no timing condition may rarely catch a
 * wind-up. The fallback is a shorter Stun on a shorter cooldown." Stuns run on this word.
 */
export const STUN_COOLDOWN: keyof typeof COOLDOWN = "medium";
export const WINDUP = { quick: 1, normal: 3, long: 6, very_long: 8 } as const;
export const RULES = {
  basicRecovery: 0.25,
  abilityCast: WINDUP.normal,
  abilityRecovery: 2,
  /**
   * Each action starts a fight between min and max charged, by its own roll, so nothing lines up on the first ticks. A party
   * unit's abilities instead carry their cooldowns between fights, and `slots` takes a flat head start off that by the slot
   * an ability sits in, in ticks; with cooldowns carrying, none is needed.
   */
  opening: { min: 0.2, max: 0.6, slots: [0, 0, 0] },
  /** The flat cut: each physical hit loses this share of the target's Armor. */
  armorRatio: 0.12,
  /** The flat cut's floor: Armor can't take a hit below this percent of its size. */
  armorFloor: 25,
  /**
   * Armor by the Path of Exile formula, hit² ÷ (hit + k × Armor), in place of the flat cut and its floor. Nearly linear against
   * big hits, and it never blanks a small one, so stacking more Armor always helps.
   */
  armorK: 0.25,
  /**
   * One set of defences for every hit: a magical hit meets Armor and Evasion as a physical one does, and nothing carries
   * Magic resist. Magical is a theme and a tag gear can name. What pierces is a status's damage, and the few payoffs that strike with it.
   */
  magical: "armor" as const,
  maxEnemies: 8,
  /**
   * An interrupted cast goes on cooldown, and one whose targets are gone costs its recovery: an interrupt in Inferno's
   * wind-up buys a whole cooldown, and two Ghouls reaching for one corpse don't loop.
   */
  lostCast: "cooldown" as const,
  /**
   * Copies of an enemy start this many ticks apart. Starting together, they would hit one target on one beat and wind up
   * in lockstep, for the whole fight.
   */
  stagger: 1.5,
  /**
   * The party's picks among foes are in proportion to draw, which comes from Aggro through a curve. An ordinary unit
   * (Aggro 100) draws 100; none draws more than 3 times that or less than a third; +d and −d cancel.
   */
  draw: { centre: 100, k: 50, max: 3 },
  /**
   * Foes pick among the party by this, not the curve above. Players mostly build one unit to draw fire and rarely build to
   * avoid it, so that unit takes most picks on its own: every 25 Aggro doubles its draw (a far-more seat, +25, doubles it; a
   * gear step, +10, is about a third more). Beside two casters at 80, a Knight at 120 draws 60%, with a far-more seat and two
   * Aggro pieces 84%, with four 90%. Held between Aggro 25 and 200, an eighth and 16 times an ordinary unit.
   */
  partyDraw: { centre: 100, double: 25, floor: 25, cap: 200 },
  /**
   * Past `after` ticks, everyone deals `pct`% more damage, and as much more again every `every` ticks: a safety that closes
   * a fight where foes heal or raise each other before it's minutes of watching nothing.
   */
  enrage: { after: 200, every: 20, pct: 25 },
  /**
   * Bosses resist repeated control, the one exception to universal statuses. Each Stun, Silence or Slow that lands on a boss
   * adds a hidden stack; from 2 stacks the next lands for half its length (RESISTED), at 4 none lands (IMMUNE). A stack drains
   * 22 ticks after the last change: the first two controls land in full and the next two at half (Stun 4, Silence 8, Slow 12
   * ticks), and one control every 22 ticks or slower never builds past a stack. Weaken stays out: a boss Weakened all fight
   * still acts.
   */
  control: { ranks: ["boss" as const], statuses: ["stun", "silence", "slow"], resist: { at: 2, pct: 50 }, cap: 4, drain: 22 },
};

/**
 * Foes' MP cost by cooldown word (the party's abilities state their own; see classes.ts), priced so a foe with 2 MP regen
 * spends more than it regains when its abilities all fire.
 */
export const COST = { short: 300, medium: 500, long: 800 } as const;
/** MP regen: every `every` ticks, restore `share` × the MP regen stat. */
export const MP_REGEN = { every: 4, share: 0.007 };

// ─── Damage ──────────────────────────────────────────────────────────────────

/** A weapon's hit: speedFactor × (base + ratio × stat). Fast kinds hit for less, slow kinds for more. The base is about half of a swing at Attack 4. */
export const WEAPON = {
  base: { low: 350, medium: 700, high: 1200 },
  ratio: { low: 0.1, medium: 0.2, high: 0.3 },
  speedFactor: { fast: 0.6, medium: 1, slow: 1.6 },
} as const;
export type Level = keyof typeof WEAPON.base;

/** An ability's hit, as a share of its scaling stat. Touch is for abilities whose point is the status they apply. */
export const HIT = { touch: 0.17, light: 0.29, normal: 0.5, heavy: 0.85 } as const;
export type HitWord = keyof typeof HIT;

/**
 * An enemy's basic attack is set by its words alone (weak, normal, heavy, massive), per swing; its speed word
 * sets how often it swings, and its Attack and Magic feed only its abilities. A boss's standout Attack would
 * otherwise make its plain swing bigger than its signature blow.
 */
export const ENEMY_SWING = { weak: 500, normal: 700, heavy: 1100, massive: 1600 } as const;
/**
 * A fast swing lands for less (a Leech's bite isn't a Bandit's sword twice as often); a slow one for the same,
 * since the slow attackers carry the big blows in their abilities (Flatten, Crush).
 */
export const ENEMY_SPEED_FACTOR = { fast: 0.75, medium: 1, slow: 1 } as const;
export type SwingWord = keyof typeof ENEMY_SWING;

/**
 * A boss has this share of the HP its document line gives. At the full line a boss fight would run several regular fights
 * long and decide the run.
 */
export const BOSS_HP = 0.55;

/** Enemy abilities' shares of Attack or Magic, chosen against party HP (2,000 to 5,000). */
export const ENEMY_HIT = {
  /** Flatten: a heavy blow that Stuns. Nearly kills a caster. */
  flatten: 0.4,
  /** Crush: knocks out a caster outright; a full-HP wall with Guard stands, and a crit is what one-shots it. */
  crush: 0.4,
  /** Mend: the Bone Priest's heal, about a party's damage output: a mirror until the priest is stopped. */
  mend: 1.3,
  /** Soulfire: deletes a caster. */
  soulfire: 0.6,
  /** Brand: steady pressure. */
  brand: 0.11,
  /**
   * Inferno: a blast on the whole party, to be interrupted. Kept short of killing a caster outright: when it does, the
   * calibration cuts the Fire Giant's HP until it dies before the Inferno lands, a race and not a boss.
   */
  inferno: 0.15,
  /** Hailstorm: a raidwide the Cleric can mend. */
  hailstorm: 0.18,
  /** Tempest: three bolts at random party members, each this share of Magic. */
  tempest: 0.045,
  /** Reap: the Reaper's three scythe slashes at random party members, each this share of its Attack. */
  reap: 0.2,
  /** Volatile: one blast behind Shields is fine; three together wipe. */
  volatile: 0.15,
} as const;

/**
 * Some amounts scale from a percent stat (Backstab from Crit chance). A percent of each stat is worth this
 * many units of an amount stat, so a typical holder's value lands near what an amount stat would give.
 */
export const PER_PERCENT: Record<string, number> = { crit_chance: 200, evasion: 150, accuracy: 150, double_strike: 150, lifesteal: 150, siphon: 200 };

/** `ratio × stat`, with percent stats converted so that a typical holder's value lands near an amount stat's. */
export const from = (stat: string, ratio: number, base = 0): NumT => ({ ...(base ? { base } : {}), scale: [{ ratio: ratio * (PER_PERCENT[stat] ?? 1), stat }] });

// ─── Stacks ──────────────────────────────────────────────────────────────────

/** Stacks an application adds, per point of the scaling stat: at stat 3 a few is about 2, several about 4, many about 7. */
export const STACKS = { few: 0.7, several: 1.3, many: 2.3 } as const;
export type StackWord = keyof typeof STACKS;
/**
 * An ability's application adds this many times the word's stacks; a passive's on basic attacks, the word's. Applications stay
 * small against the ceiling that upkeep reaches, so no ramp is one cast.
 */
export const ABILITY_STACKS = 2;
export const stacks = (word: StackWord, stat: string, mult = 1): NumT => ({ scale: [{ ratio: (mult * ABILITY_STACKS * STACKS[word]) / P, stat }] });
/** The Pyromancer's Burn and the Stormcaller's Shock, on their abilities and passives, are this many times the word's. */
export const BURN_STACKS = 1;
export const SHOCK_STACKS = 1.5;
/** A flat stack count, for enemies that apply "a stack" or statuses that start with "many". */
export const FLAT_STACKS = { one: 1, few: 2, several: 4, many: 7 } as const;

// ─── Special stats, at a level ───────────────────────────────────────────────

export const SPECIAL = {
  evasion: { medium: 20, high: 35 },
  accuracy: { medium: 20, high: 35 },
  /** Added to the crit multiplier (base 150%). */
  crit_damage: { medium: 25, high: 50 },
  double_strike: { medium: 25, high: 40 },
  /** Untyped damage dealt back per hit taken. */
  thorns: { medium: 150, high: 300 },
  lifesteal: { medium: 10, high: 20 },
  siphon: { medium: 10, high: 20 },
} as const;
export type SpecialStat = keyof typeof SPECIAL;
export type SpecialLevel = "medium" | "high";

/** The engine stat a special stat word maps to. */
export const SPECIAL_KEY: Record<SpecialStat, string> = {
  evasion: "evasion", accuracy: "accuracy", crit_damage: "crit_multiplier", double_strike: "double_strike", thorns: "thorns", lifesteal: "lifesteal", siphon: "siphon",
};

// ─── Hit resist, in percent ──────────────────────────────────────────────────

/** Incorporeal (the ghosts): every hit, swing or spell, deals this much less; statuses and piercing payoffs hurt in full. */
export const INCORPOREAL = { hitTaken: -60 };

// ─── Gear steps ──────────────────────────────────────────────────────────────

/** +1 on gear or a formation slot, for an amount stat; crit chance moves in crit() steps. */
export const STEP = P;
/**
 * A gear or formation step of max HP is half a point. At a whole point, a step would double a caster's HP and feed its Regen
 * and Shield cap too, making HP every class's best kit.
 */
export const HP_STEP = P / 2;
/** Aggro is centred on 100: a class's or enemy's word n is 70 + 10n, and a gear or formation step is 10. */
export const aggroOf = (n: number) => 70 + 10 * n;
export const AGGRO_STEP = 10;
/**
 * A step of MP regen on gear, a seat or an affix. With no class regen it's the only regen in fights, so a step is big: +1
 * restores about 7% of a 3,000 pool over a 40-tick fight, +2 about 14% (foes' regen comes from their own lines).
 */
export const MP_REGEN_STEP = 3 * P;
/** The step for a stat, in the data's units. */
export const stepFor = (stat: string) => (stat === "max_hp" ? HP_STEP : stat === "aggro" ? AGGRO_STEP : stat === "mp_regen" ? MP_REGEN_STEP : STEP);

// ─── Statuses: sizes and durations ───────────────────────────────────────────

export const STATUS = {
  /**
   * Bleed does nothing on its own and never runs out; each hit its holder takes deals this much per stack (untyped, past Armor
   * and resistance, not a hit), then the stacks drop by this share: an inverse Shock, that pays a party for keeping up the
   * pressure. Sized so it's about as big a share of its classes' damage as Burn and Shock are of theirs.
   */
  bleed: { perStack: 120, drop: 1 / 3 },
  /** A pulse of `share` × max HP every `every` ticks, for `duration` ticks. */
  regen: { every: 4, share: 0.08, duration: 24 },
  shield: { capShare: 0.5 },
  /** Might spends with action, not time: one stack each time the holder acts (vocabulary.ts). */
  might: { perStack: 6, cap: 15 },
  weaken: { pct: -30, duration: 20 },
  guard: { armor: pts(3), duration: 28 },
  /**
   * A Stun pauses a wind-up rather than cancelling it (Silence is the interrupt), and lasts long enough to take a foe out of
   * the fight for a moment.
   */
  stun: { duration: 8 },
  /** The Bard's Refrain: a share of the damage a basic attack deals, as a heal to a random ally and as MP to a random ally. */
  refrain: { share: 0.3 },
  slow: { speed: -40, duration: 24 },
  haste: { speed: 40, duration: 20 },
  taunt: { duration: 20 },
  /**
   * Each pulse Burn deals this much per stack, then a share of the stacks go, so Burn builds over a fight and lingers when the
   * burning stops. No cap: a Pyromancer's upkeep settles well above what one application adds, a ramp applications can't
   * reach alone.
   */
  burn: { every: 2, perStack: 55, drop: 0.15 },
  /**
   * Chill slows its holder a little for each stack and thaws a stack every `every` ticks, slowly enough to be stacked up over a
   * fight. At its cap it shatters: untyped damage for each stack, a Stun, and the Chill is spent. A lock that ends in a payoff.
   */
  chill: { cap: 12, perStack: -4, every: 14, shatter: 250 },
  /** The cap is a safety: uncapped, a slow foe gathers enough Shock to pay a fight's worth of damage for one action. */
  shock: { perStack: 80, drop: 0.5, cap: 40 },
  /** Ward: the defence against what Armor never meets. Less damage from statuses and piercing payoffs, by this percent. */
  ward: { untypedTaken: -40, duration: 30 },
  sunder: { perStack: 1.5, every: 4, cap: 20 }, // +1.5% damage taken a stack, +30% at the cap.
  silence: { duration: 16 },
  hidden: { duration: 10 },
  rot: { healing: -60, duration: 20 },
  /** Regen for mana: a pulse of `share` × max MP every `every` ticks, for `duration` ticks. */
  clarity: { every: 4, share: 0.06, duration: 16 },
  aegis: { share: 25 },
  /** Doom's blow is this share of the doomed unit's max HP: from full nobody dies to it; hurt, anyone does. */
  doom: { countdown: 10, share: 0.6 },
  bulwark: { stacks: 6, broken: 5, takenPct: 100 },
  ice_crust: { perStack: pts(1), duration: 6, cap: 6 },
} as const;

/**
 * The campfire in the middle of each run: REST gives back this % of max HP to everyone standing, FOCUS this % of max MP,
 * RAISE stands one fallen member of the player's choice up with this % of its max HP.
 */
export const CAMPFIRE = { hp: 40, mp: 60, revive: 40 } as const;

/** Shares of max HP a revive brings a unit back with. */
export const REVIVE = { half: 0.5, tenth: 0.1, ghoul: 0.3 } as const;
