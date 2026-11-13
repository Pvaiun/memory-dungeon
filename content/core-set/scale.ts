/**
 * The core set's scale: first values for every word in the documents.
 *
 * The documents give a relative scale (stats from 1 to 5, cooldowns short to
 * long, "a few" stacks). This file turns each word into a number, in one place,
 * so tuning changes a constant here and regenerates the pack.
 *
 * Amount stats are stored at 1,000 per point of the scale (HP 2 is 2,000), as
 * docs/primer.md (Numbers) says. Stats counted in percent (Crit chance, Evasion,
 * Accuracy, Lifesteal, Siphon, Double strike) are stored in percent
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
 * follows its cooldown (see SWING_REF), and its kind's words (KIND_WORDS) say how hard it hits per tick and how much of that
 * is its wearer's Attack. Fast is under 7.5 ticks, slow over 10.5 (vocabulary.ts speedOf).
 */
export const KIND_SPEED: Record<string, number> = {
  dagger: 5.6, fist: 6.0, wand: 6.6, sword: 8.2, bow: 8.8, axe: 9.0, spear: 9.4, rune_sword: 10.7, mace: 11.0, staff: 11.6, hammer: 11.9, great_weapon: 12.8,
};
/** A swing's size is its per-SWING_REF-ticks amount × its cooldown ÷ this. */
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
  /**
   * The recoveries, the moment after an action when the unit can start nothing else: a basic attack's a tenth of its weapon's
   * base cooldown, an ability's a tick. Short, so an action that comes ready just after another goes almost at once and the
   * battle screen's action pips don't sit full while nothing happens; the fight's pace is the cooldowns'.
   */
  basicRecovery: 0.1,
  abilityCast: WINDUP.normal,
  abilityRecovery: 1,
  /**
   * Each action starts a fight between min and max charged, by its own roll, so nothing lines up on the first ticks. A party
   * unit's abilities instead carry their cooldowns between fights, and `slots` takes a flat head start off that by the slot
   * an ability sits in, in ticks; with cooldowns carrying, none is needed.
   */
  opening: { min: 0.2, max: 0.6, slots: [0, 0, 0] },
  /** The flat cut: each hit loses this share of the target's Defense. */
  armorRatio: 0.12,
  /** The flat cut's floor: Defense can't take a hit below this percent of its size. */
  armorFloor: 25,
  /**
   * Defense by the Path of Exile formula, hit² ÷ (hit + k × Defense), in place of the flat cut and its floor. Nearly linear against
   * big hits, and it never blanks a small one, so stacking more Defense always helps.
   */
  armorK: 0.25,
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

/**
 * A kind's swing, in three words (docs/core-set/rules-and-vocabulary.md, Weapons). SWING.full is what a full swing deals per SWING_REF ticks
 * at the reference Attack; the swing word scales it (SWING_POWER), the scaling word says what share of it is the wearer's Attack at
 * that reference (SWING_SCALING: a base-heavy swing works for any wearer, an Attack-heavy one rewards stacking Attack), and the
 * budget word says how many stat steps the kind's pieces carry at each rarity (KIND_BUDGET). A kind pays for its swing in budget
 * or the other way round; a two-hander takes both sides, being worth a weapon and an offhand. Attack is never the signature of an
 * Attack-heavy kind. The words are a kind's default: a piece may step along the trade (a heavy piece swings harder for a step fewer).
 */
export const SWING = { full: 1500, refAttack: pts(4) } as const;
export const SWING_POWER = { light: 0.8, full: 1, heavy: 1.2 } as const;
export const SWING_SCALING = { base_heavy: 0.3, even: 0.5, attack_heavy: 0.7 } as const;
/** A piece's step along the trade: a heavy piece swings this much harder for a stat step fewer, a light piece this much lighter for one more. */
export const SWING_TRADE = 1.2;
/**
 * Stat steps a piece carries, by rarity: every piece has stats, and each rarity carries more than the last (the director's rule).
 * A mythic carries at least a legendary's (the director's word), beside the effect that rewrites its class.
 * A weapon kind's budget word moves the ladder a step down (lean, never below one) or up (rich); every other slot takes the standard.
 * A piece's step along the swing trade moves it once more (kit.ts).
 */
export const KIND_BUDGET = {
  lean: { common: 1, uncommon: 1, rare: 2, legendary: 3, mythic: 3 },
  standard: { common: 1, uncommon: 2, rare: 3, legendary: 4, mythic: 4 },
  rich: { common: 2, uncommon: 3, rare: 4, legendary: 5, mythic: 5 },
} as const;
export type SwingWordK = keyof typeof SWING_POWER;
export type ScalingWord = keyof typeof SWING_SCALING;
export type BudgetWord = keyof typeof KIND_BUDGET;
export type KindWords = { swing: SwingWordK; scaling: ScalingWord; budget: BudgetWord };
export const KIND_WORDS: Record<string, KindWords> = {
  dagger: { swing: "light", scaling: "attack_heavy", budget: "standard" },
  fist: { swing: "light", scaling: "even", budget: "standard" },
  wand: { swing: "light", scaling: "base_heavy", budget: "rich" },
  rune_sword: { swing: "full", scaling: "base_heavy", budget: "standard" },
  sword: { swing: "full", scaling: "even", budget: "standard" },
  spear: { swing: "full", scaling: "even", budget: "standard" },
  axe: { swing: "heavy", scaling: "attack_heavy", budget: "lean" },
  hammer: { swing: "heavy", scaling: "base_heavy", budget: "lean" },
  mace: { swing: "light", scaling: "base_heavy", budget: "rich" },
  bow: { swing: "heavy", scaling: "attack_heavy", budget: "standard" },
  great_weapon: { swing: "heavy", scaling: "even", budget: "rich" },
  staff: { swing: "light", scaling: "base_heavy", budget: "rich" },
};
/**
 * A swing at an interval: (base + ratio × stat) per hit, sized so a swing every `cooldown` ticks deals the words' amount per
 * SWING_REF ticks. The scaling stat is Attack unless a piece swaps it (the Heartsplitter's max HP); a percent stat is converted.
 */
export function swingAt(cooldown: number, swing: SwingWordK, scaling: ScalingWord, stat = "attack"): NumT {
  const f = cooldown / SWING_REF;
  const total = SWING.full * SWING_POWER[swing];
  const share = SWING_SCALING[scaling];
  return { base: Math.round(f * total * (1 - share)), scale: [{ ratio: r6((f * total * share * (PER_PERCENT[stat] ?? 1)) / SWING.refAttack), stat }] };
}
/** A kind's swing by its words, or with a piece's own words where it steps along the trade. */
export const swingOf = (kind: string, words: Partial<KindWords> = {}, stat = "attack"): NumT =>
  swingAt(KIND_SPEED[kind], words.swing ?? KIND_WORDS[kind].swing, words.scaling ?? KIND_WORDS[kind].scaling, stat);
/** A swing's damage per tick for a unit's stat, as the interface shows it. */
export const perTick = (amount: NumT, cooldown: number, stats: Record<string, number>): number =>
  (typeof amount === "number" ? amount : (amount.base ?? 0) + amount.scale.reduce((a, t) => a + (t.stat ? t.ratio * (stats[t.stat] ?? 0) : 0), 0)) / cooldown;
const r6 = (x: number) => Math.round(x * 1e6) / 1e6;

/** An ability's hit, as a share of its scaling stat. Touch is for abilities whose point is the status they apply. */
export const HIT = { touch: 0.17, light: 0.29, normal: 0.5, heavy: 0.85 } as const;
export type HitWord = keyof typeof HIT;

/**
 * An enemy's basic attack is set by its words alone (weak, normal, heavy, massive), per swing; its speed word
 * sets how often it swings, and its Attack feeds only its abilities. A boss's standout Attack would
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

/** Enemy abilities' shares of Attack, chosen against party HP (2,000 to 5,000). */
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
  brand: 0.14,
  /**
   * Inferno: a blast on the whole party, to be interrupted. Kept short of killing a caster outright: when it does, the
   * calibration cuts the Fire Giant's HP until it dies before the Inferno lands, a race and not a boss.
   */
  inferno: 0.15,
  /** Hailstorm: a raidwide the Cleric can mend, sized against the Titan's high Attack and the party's Defense. */
  hailstorm: 0.13,
  /** Tempest: three bolts at random party members, each this share of Attack: each one meets Defense, so none is a sliver. */
  tempest: 0.07,
  /** Reap: the Reaper's three scythe slashes at random party members, each this share of its Attack. */
  reap: 0.2,
  /** Volatile: one blast behind Shields is fine; three together wipe. */
  volatile: 0.2,
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
/**
 * The party's riders of a damage status, against the stack words: every application a status makes whose stacks are drawn
 * from a stat (a passive's, a piece's, a seat's or a mythic's "a few Chill (from Attack)" on a swing or a blow taken) adds
 * this share of what its word gives, on the party's side only (never a foe's). Abilities keep their own sizes, set by hand
 * against each status (Frost lance's Chill, a shatter in more than one cast). Applied when the pack is built (pack.ts); flat
 * counts and shares of a status passed on are left as written. The words are one scale for every status, and a stack is
 * worth very different amounts: a Burn or Bleed stack deals about three swings' worth over its life, and Chill caps at 12, so
 * a few Chill on every swing from three pieces shatters a foe each couple of hits. Statuses not named here add their words'.
 */
export const APPLIED: Record<string, number> = { chill: 0.2, burn: 0.25, bleed: 0.6 };
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
  /**
   * The three speed stats, stats like any other in a class line and on gear: Attack speed (basic attacks sooner), Cooldown
   * (abilities round sooner), Cast speed (shorter wind-ups). Haste is 40 in all three at once; a medium word is a lasting share of one.
   */
  attack_speed: { medium: 15, high: 30 },
  cooldown: { medium: 15, high: 30 },
  cast_speed: { medium: 15, high: 30 },
} as const;
export type SpecialStat = keyof typeof SPECIAL;
export type SpecialLevel = "medium" | "high";

/** The engine stat a special stat word maps to. */
export const SPECIAL_KEY: Record<SpecialStat, string> = {
  evasion: "evasion", accuracy: "accuracy", crit_damage: "crit_multiplier", double_strike: "double_strike", thorns: "thorns", lifesteal: "lifesteal", siphon: "siphon",
  attack_speed: "attack_speed", cooldown: "cooldown_reduction", cast_speed: "cast_time_reduction",
};
/**
 * A piece's own step of a special stat where it differs from the class lines' (SPECIAL). Evasion: its worth grows as
 * 1 / (1 − Evasion), so pieces stacked on a class that has it climbed to the cap (a Monk at 75, an Assassin at 60, every hit
 * on them one in three or four), and two pieces' 20 each were worth far more than their budget counted.
 */
export const PIECE_SPECIAL: Partial<Record<keyof typeof SPECIAL, { medium: number; high: number }>> = { evasion: { medium: 12, high: 20 } };

// ─── The kits' own words ─────────────────────────────────────────────────────

/** Sizes the base kits name beyond the shared words (classes.ts); the versions' own sit beside them in upgrades/. */
export const KIT = {
  /** Shieldmaiden: the share of each hit's damage the Valkyrie gains as a Shield. */
  shieldmaiden: 0.25,
  /** Choosing's heal, as a share of Attack: under the Cleric's Cure, since it also raises. */
  choosing: 0.28,
  /** Skyfall: damage per Shock stack on its target, on top of a heavy hit. */
  skyfallPerShock: 150,
  /** Hunter's eye: crit steps added to the Ranger's basic attacks. */
  hunterCrit: 2,
  /** Thunderstorm: how long the party's swings carry the storm's Shock. */
  storm: { duration: 20 },
  /** Static charge: Attack speed for a while (Haste is 40 in all three speeds; this is one of them, higher). */
  staticCharge: { speed: 50, duration: 20 },
} as const;

// ─── Hits taken, in percent ──────────────────────────────────────────────────

/**
 * The Ghost's Incorporeal: every hit it takes is cut by this share, and a status's own damage isn't. Hits print halves;
 * Burn, Bleed, Shock, a shatter and Thorns are the way through. Much more and a Ghost outlasts everything else in its fight.
 */
export const INCORPOREAL = { hits: -50 };

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
/**
 * A piece's max MP step brings an HP step beside it, over its budget: MP is worth little in a fight beside the other stats (a
 * fight from a part-full bar seldom spends the pool), so a mana piece's MP comes free, and for a class that doesn't spend MP the
 * piece is as good as its neighbours. Barrage, whose pieces carry most of the MP, had left its members the frailest in the set.
 */
export const MP_STEP_HP = 1;
/** The step for a stat, in the data's units. */
export const stepFor = (stat: string) => (stat === "max_hp" ? HP_STEP : stat === "aggro" ? AGGRO_STEP : stat === "mp_regen" ? MP_REGEN_STEP : STEP);

// ─── Statuses: sizes and durations ───────────────────────────────────────────

export const STATUS = {
  /**
   * Bleed does nothing on its own and never runs out; each hit its holder takes deals this much per stack (untyped, past Defense,
   * not a hit), then the stacks drop by this share: an inverse Shock, that pays a party for keeping up the
   * pressure. Sized so it's about as big a share of its classes' damage as Burn and Shock are of theirs.
   */
  bleed: { perStack: 120, drop: 1 / 3 },
  /** A pulse of `share` × max HP every `every` ticks, for `duration` ticks. */
  regen: { every: 4, share: 0.08, duration: 24 },
  shield: { capShare: 0.5 },
  /** Might spends with action, not time: one stack each time the holder acts (vocabulary.ts). */
  might: { perStack: 6, cap: 15 },
  weaken: { pct: -30, duration: 20 },
  guard: { defense: pts(3), duration: 28 },
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
   * `chain`: a chain of shatters dies down. Chill that a shatter passes on to a foe that has shattered in the last `window`
   * ticks is cut to `pct` % for each time it has, in fractions of a stack (a rule of Chill's own, on no card).
   */
  chill: { cap: 12, perStack: -4, every: 14, shatter: 250, chain: { pct: 50, window: 10 } },
  /** The cap is a safety: uncapped, a slow foe gathers enough Shock to pay a fight's worth of damage for one action. */
  shock: { perStack: 80, drop: 0.5, cap: 40 },
  sunder: { perStack: 1.5, every: 4, cap: 20 }, // +1.5% damage taken a stack, +30% at the cap.
  /** Marked: the party's basic attacks go to its holder while it lasts (the Paladin's Condemn, the Hunt's pieces). */
  marked: { duration: 14 },
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
