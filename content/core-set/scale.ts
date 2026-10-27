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

/** A class's Crit n is 4n% (pacing pass: was 5n%; the party critted a sixth of its hits, for a fifth of its damage). */
export const crit = (n: number) => 4 * n;

// ─── Timing, in ticks ────────────────────────────────────────────────────────

/**
 * Pacing pass (steps/05-core-set/5b-pacing): every weapon kind swings on its own cooldown, so a party's basic attacks don't land on one
 * tick. They were three speeds (6, 10 and 16 ticks). A swing's size follows its cooldown (see SWING_REF), so every kind
 * deals about the same per tick.
 */
export const KIND_SPEED: Record<string, number> = {
  dagger: 5.3, fist: 5.7, wind_staff: 6.1, lightning_staff: 6.6, sword: 7.4, bow: 7.8, spear: 8.2,
  light_staff: 8.5, dark_staff: 8.7, ice_staff: 9.0, earth_staff: 9.4, fire_staff: 9.8, axe: 10.7,
};
/** A swing's size is (base + ratio × stat) × its cooldown ÷ this: per tick, the old medium swing's. */
export const SWING_REF = 10;
/** The documents' speed words, for enemies' touches and a kind's damage word: between the kinds' cooldowns, so they don't line up either. */
export const SPEED = { fast: 5.9, medium: 7.9, slow: 10.3 } as const;
/**
 * Regular fights last about 30 ticks and every action starts a fight on cooldown, so at long = 30 the Cleric's
 * Prayer never fired in one and a boss's signature blow came once in 38 ticks. Shorter words keep the ratios.
 */
/**
 * Pacing pass: abilities are moments in a fight, not its whole rhythm. At 6, 12 and 22 ticks, a unit with three abilities was
 * casting nearly all the time and its basic attack came a third of its actions; the party acted twice for each foe action.
 */
/**
 * Step 5c: 24, 32 and 42 (were 30, 48 and 70). With the slotted opening, a caster's second and third abilities came off in
 * a third of regular fights or fewer, and the Paladin and Hexer cast nothing in most: "those cooldowns are too long". At 24,
 * 38 and 56 the Assassin, Paladin and Hexer still sat out half their regular fights or more; at 24, 32 and 42, the Hexer
 * 30%, the Assassin 38%, the Paladin (an 8-tick Smite) 52%.
 */
/**
 * Step 5e (the balance sheet): long 36 (was 42, up to 48 with the jitter). Six abilities on the long word never fired: with
 * a third-slot head start of 6 ticks, a long ability's first cast came at tick 36 to 44, in regular fights of 31 ticks
 * (Pyre, Static charge, Stillness 0.01 to 0.04 casts a regular fight; Vanish and Garrote 0.18).
 */
export const COOLDOWN = { short: 24, medium: 32, long: 36 } as const;
/**
 * Foes keep the pacing pass's short cooldown. Step 5e: medium 40 and long 60 (were 48 and 70). In free play, at the documents'
 * numbers, a boss fight lasted 46 ticks and the signature moves (Crush, Quiet, Tempest, Death bell, Rally) came 0.5 to 0.9
 * times a fight against the enemies document's "two or three times".
 */
export const ENEMY_COOLDOWN = { short: 30, medium: 40, long: 60 } as const;
/**
 * An ability's cooldown: its word's, moved up to 15% either way by its id, so no two in a kit share one and few line up with
 * each other or with a swing. The director's ask: "you should probably never even have two that are the same".
 */
export function jitter(cooldown: number, id: string): number {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return Math.round(cooldown * (0.85 + 0.3 * ((h % 997) / 997)) * 10) / 10;
}
/**
 * The classes document's fallback for Stun: "a long-cooldown Stun with no timing condition may rarely catch a
 * wind-up. The fallback is a shorter Stun on a shorter cooldown." With Shield bash and Inferno both on long
 * cooldowns, the bash came five ticks before every Inferno wind-up, in every seed. Stuns run on this instead.
 */
export const STUN_COOLDOWN: keyof typeof COOLDOWN = "medium";
/** Step 5e: very long 6 (was 8). An 8-tick wind-up on top of a long cooldown put Pyre, Smite, Tremor and Raise past most fights' ends, and Crush past a boss's. */
export const WINDUP = { quick: 0.5, normal: 1.5, long: 4, very_long: 6 } as const;
export const RULES = {
  basicRecovery: 0.25,
  abilityCast: WINDUP.normal,
  /** Pacing pass: 1.5 (was 2.5). */
  abilityRecovery: 1.5,
  /**
   * Pacing pass: each action starts a fight a third to two thirds charged, by its own roll, so nothing lines up on the first ticks.
   * Step 5c (the director's): a party unit's abilities start charged by the order they're slotted in, so the order is preparation,
   * not dice: the first this many ticks, then the second, then the third. Basic attacks and foes still roll. At the director's
   * 25, 15 and 10, every short ability in a first slot (cooldowns 20 to 28) fired on the first tick, the whole party at once,
   * and 19% of minions died before acting (the pacing pass had it at 6%); at 20, 12 and 6, 11%.
   */
  /**
   * Step 5e: 16, 12 and 8 (were 20, 12 and 6). At 20 the first-slot abilities fired at ticks 2 to 6 and a third of the Wolves,
   * Wisps and Drones in free play died before acting; at 6 a third-slot ability on the long word came after most fights ended.
   */
  opening: { min: 0.3, max: 0.7, slots: [16, 12, 8] },
  /** Each physical hit loses this share of the target's Armor: Armor 5 takes 600 off, Armor 8 nearly blanks a sword. */
  armorRatio: 0.12,
  /**
   * Pacing pass: Armor can't take a hit below a quarter of its size. Plate on a Knight blanked every weak and normal swing
   * ("wolves hit it for 0 BLOCKED"), so minions couldn't touch the wall and the Knight was in half the top builds.
   */
  armorFloor: 25,
  /**
   * Step 5c (the director's): Armor by the Path of Exile formula, hit² ÷ (hit + k × Armor), in place of the flat cut and its floor.
   * Nearly linear against big hits, and it never blanks a small one, so stacking more Armor always helps. "k = 1 to start":
   * on this scale (Armor 5 is 5,000, a normal swing 700) k = 1 took 92% off a minion's swing into a plated, Guarded Knight
   * and made the party's walls the whole game; k = 0.25 takes about what the flat cut and its floor did (74%, was 75%).
   */
  armorK: 0.25,
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
   * The director's Aggro rule (Oct 26, 2026): foes pick in proportion to draw, which comes from Aggro through a curve. An
   * ordinary unit (Aggro 100) draws 100; none draws more than 3 times that or less than a third; +d and −d cancel. Picks
   * in proportion to Aggro itself let a unit reach a 1% chance of being picked too easily, which broke the balance.
   */
  draw: { centre: 100, k: 50, max: 3 },
  /**
   * Past 300 ticks, everyone deals 25% more damage, and 25% more again every 30 ticks (campaign pass). An AI playtester
   * met a Vampire and two Bone Priests healing each other to the 5,000-tick safety stop, and Ghouls raising each other
   * for 2,600 ticks: minutes of watching nothing. Boss fights end in 100 to 250.
   */
  enrage: { after: 300, every: 30, pct: 25 },
};

/**
 * Foes' MP cost by cooldown word (the party's abilities state their own; see classes.ts). Pacing pass: priced so a foe with 2
 * MP regen spends more than it regains when its abilities all fire.
 */
export const COST = { short: 400, medium: 650, long: 1000 } as const;
/**
 * MP regen: every `every` ticks, restore `share` × the MP regen stat (regen 3 gives 120). Step 5e: 0.04 (was 0.05). Over whole
 * campaign runs the party regained 110% of the MP it spent, and the casters spent 1% to 4% of their time short of MP (the
 * Geomancer 14%), against 5c's intent that casters are gated by it; the walls, at 96% to 98% MP, don't feel the step.
 */
export const MP_REGEN = { every: 4, share: 0.04 };

// ─── Damage ──────────────────────────────────────────────────────────────────

/** A weapon's hit: speedFactor × (base + ratio × stat). Fast kinds hit for less, slow kinds for more. */
export const WEAPON = {
  base: { low: 100, medium: 200, high: 350 },
  ratio: { low: 0.15, medium: 0.3, high: 0.45 },
  speedFactor: { fast: 0.6, medium: 1, slow: 1.6 },
} as const;
export type Level = keyof typeof WEAPON.base;

/** An ability's hit, as a share of its scaling stat. */
/** Pacing pass: each ability is rarer, so each hit is bigger (was 0.2, 0.35 and 0.6): a normal hit is about three swings. */
export const HIT = { light: 0.43, normal: 0.75, heavy: 1.25 } as const;
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

/**
 * Pacing pass: a boss has this share of the HP its document line gives. At the full line a boss fight ran 3.3 times a regular
 * one and decided most runs: "it's either a gimmick or a long attrition war". The re-tune puts the difference back into the
 * regular fights.
 */
export const BOSS_HP = 0.55;

/** Enemy abilities' shares of Attack or Magic, chosen against party HP (2,000 to 5,000). */
export const ENEMY_HIT = {
  /** Flatten: a heavy blow that Stuns. Nearly kills a caster. */
  flatten: 0.4,
  /** Crush: knocks out any unguarded caster outright; a Guarded, Shielded Knight survives it. */
  crush: 0.5,
  /** Mend: the Bone Priest's heal, about a party's damage output: a mirror until the priest is stopped. Pacing pass: 1.3 (was 0.6). */
  mend: 1.3,
  /** Soulfire: deletes a caster. */
  soulfire: 0.6,
  /** Brand: steady pressure. Pacing pass: 0.11 (was 0.05), as it comes a third as often. */
  brand: 0.11,
  /** Inferno: ends the run if it lands uninterrupted. */
  /** Campaign pass: 0.5 wiped every party it landed on; at 0.35 it nearly wipes, and an interrupt buys a whole cooldown. */
  inferno: 0.35,
  /** Hailstorm: a raidwide the Cleric can mend. Pacing pass: 0.18 (was 0.08), as it comes a third as often. */
  hailstorm: 0.18,
  /** Tempest: a raidwide the Cleric can absorb. Pacing pass: 0.13 (was 0.06). */
  tempest: 0.13,
  /** Volatile: one blast behind Shields is fine; three together wipe. Step 5e: 0.18 (was 0.25): the Bomb Bug dealt 4.8 times the median minion's damage per appearance. */
  volatile: 0.15, // round 3: still 3.4× the median minion at 0.18.
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
/** Pacing pass: an ability's application adds twice the word's stacks (abilities come a third as often); a passive's on basic attacks, the word's. */
export const ABILITY_STACKS = 2;
export const stacks = (word: StackWord, stat: string, mult = 1): NumT => ({ scale: [{ ratio: (mult * ABILITY_STACKS * STACKS[word]) / P, stat }] });
/**
 * Step 5c (the director's): the Pyromancer's Burn and the Stormcaller's Shock, on their abilities and passives, are this many
 * times the word's. At 2 the Pyromancer's Burn was 24% of its damage (was 14%), and the Pyromancer the weakest class still.
 */
export const BURN_STACKS = 2.5;
export const SHOCK_STACKS = 2;
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
  /** Step 5e: high 250 (was 300). The Bramble knight, a wall, dealt 0.9× an average unit's damage (Thorns a quarter of it) while taking 1.6×, and its parties won 10 to 16 points more than parties without it. */
  thorns: { medium: 150, high: 250 },
  /**
   * Step 5e: 10 and 20 (were 15 and 30). Lifesteal was 52% of all the healing on the party, nearly all of it the Vampire's (60% under
   * Bloodlust): it healed itself 4,350 a fight and its parties won 25 to 40 points more than parties without it, after Blood drain was cut.
   */
  lifesteal: { medium: 8, high: 15 }, // round 4: the Vampire was still +16 / +36 / +12 at 10 and 20, healing itself 3,000 a fight.
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
/** Aggro is centred on 100 (the director's rule): a class's or enemy's word n is 70 + 10n, and a gear or formation step is 10. */
export const aggroOf = (n: number) => 70 + 10 * n;
export const AGGRO_STEP = 10;
/** The step for a stat, in the data's units. */
export const stepFor = (stat: string) => (stat === "max_hp" ? HP_STEP : stat === "aggro" ? AGGRO_STEP : STEP);

// ─── Statuses: sizes and durations ───────────────────────────────────────────

export const STATUS = {
  /**
   * Step 5c (the director's): Bleed replaces Poison. It does nothing on its own and never runs out; each hit its holder takes
   * deals this much per stack (untyped, past Armor and resistance, not a hit), then the stacks drop by this share: an inverse
   * Shock, that pays a party for keeping up the pressure.
   */
  /**
   * At 60 and a half (Shock's numbers), Bleed was 7% of the Ranger's damage, 9% of the Bramble knight's and 6% of the
   * Assassin's; at 120 and a third, 16%, 20% and 13%, about where Burn and Shock sit in their classes.
   */
  bleed: { perStack: 120, drop: 1 / 3 },
  /** 8 pulses of 4%: a Prayer heals a third of everyone's max HP over 16 ticks. */
  /** Pacing pass: 12 pulses of 3% (was 8 of 4%): Renew and Regrowth come a third as often. */
  /**
   * Step 5e: 10 pulses of 2.5%, a quarter of max HP (was 12 of 3%, 36%). Caravan gives it to every ally at every fight's start,
   * and the same parties won 20 points more in Caravan than in Neutral: 36% of the whole party's HP a fight, for nothing, was
   * more than a Cleric heals. The Herald's horn (+9 points on the amulets) is the same Regen.
   */
  regen: { every: 2, share: 0.02, duration: 16 }, // round 3: 10 pulses of 2%, a fifth of max HP: Caravan was still +14.7 at a quarter. Round 4: 8 pulses, 16% (Caravan +13.7 at a fifth).
  shield: { capShare: 0.5 },
  /** Campaign pass: a cap of 25 stacks. Uncapped, a hidden Bard stacked 123 on itself and the Storm King reached 38. */
  might: { perStack: 8, every: 4, cap: 25 },
  /** Pacing pass: buffs and debuffs from abilities last about twice as long (their abilities come a third as often). */
  weaken: { pct: -30, duration: 20 },
  guard: { armor: pts(2), duration: 20 },
  /**
   * Follow-up redesign (the director's): a Stun pauses a wind-up rather than cancelling it (Silence is the interrupt), and
   * lasts long enough to take a foe out of the fight for a moment. It was 2 ticks.
   */
  stun: { duration: 5 },
  /** The Bard's Refrain: MP a basic attack gives a random ally. */
  refrain: { mp: 100 },
  slow: { speed: -40, duration: 20 },
  /** Pacing pass: 14 ticks, not 20. At 20 the Monk's own Flow (a 30-tick cooldown) kept it Hasted two thirds of every fight. */
  haste: { speed: 40, duration: 14 },
  taunt: { duration: 14 },
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
   * Step 5c (the director's: "Burn and Shock are really weak"): a cap of 40. With the Stormcaller's stacks doubled
   * (BURN_SHOCK) the cap of 25 held its Shock at 18% of its damage. At 80 a stack as well, the Stormcaller was in 57% of the
   * top builds (was 23%), so it stays at 60.
   */
  shock: { perStack: 70, drop: 0.5, cap: 40 }, // Step 5e: 70 (was 60). Shock was 17% to 21% of its appliers' damage, and the Bard's Thunder chord is a third of what the Bard does.
  ward: { resist: 30, duration: 24 },
  sunder: { perStack: -600, every: 4 },
  silence: { duration: 8 },
  /** Step 5e: 20 ticks (was 14). Vanish is on the long cooldown (36), so the Assassin was Hidden 14 ticks in 36 at best, and it died at tick 18 in 45 of 100 fights. */
  hidden: { duration: 20 },
  rot: { healing: -60, duration: 20 },
  clarity: { regenPct: 100, duration: 24 },
  aegis: { share: 25 },
  /** Kills anything at HP 3 or below; a Hoplite or Knight survives it. */
  doom: { countdown: 10, damage: 3500 },
  bulwark: { stacks: 6, broken: 5, takenPct: 100 },
  ice_crust: { perStack: pts(1), duration: 6, cap: 6 },
} as const;

/**
 * The campfire in the middle of each campaign run: REST gives back this % of max HP to everyone standing, FOCUS this % of max
 * MP, RAISE stands one fallen member of the player's choice up with this % of its max HP (step 5c, the director's).
 * FOCUS 60 (was 40): copied at the fire and played out each way, a party with casters found FOCUS the only winning pick in
 * about a quarter of the visits where the pick decided the run (a third with three casters); a party of walls, never.
 */
export const CAMPFIRE = { hp: 40, mp: 60, revive: 40 } as const;

/** Shares of max HP a revive brings a unit back with. */
export const REVIVE = { half: 0.5, tenth: 0.1, ghoul: 0.3 } as const;
