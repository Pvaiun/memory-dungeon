/**
 * The helpers every content file writes its items with, so the 322 pieces, 35 formations, 64 upgrades
 * and 16 mythics read alike. Numbers come from scale.ts's words; nothing here decides a value.
 */
import type { ConditionT, EffectT, EventSpecT, GearT, NumT, ReactionT, StatusT, TargetRuleT, TestT, ToT, UnitCondT, WeaponT } from "../../../src/schema.js";
import { COOLDOWN, HP_STEP, KIND_BUDGET, KIND_WORDS, MP_STEP_HP, P, PIECE_SPECIAL, SPECIAL, SPECIAL_KEY, STACKS, SWING_TRADE, crit, stepFor, swingOf, type KindWords, type SpecialLevel, type SpecialStat, type StackWord } from "../scale.js";

/** An item's id from its name: lower case, apostrophes dropped, every other run of non-letters and non-digits an underscore. */
export const idOf = (name: string): string =>
  name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

export type Change = { stat: string; flat: number };
/** A gear step: +1 or +2 on a stat (a negative n gives it up), in the data's units: a point 1,000, HP half a point, Aggro 10, MP regen as scale.ts sets it. */
export const st = (stat: string, n: number): Change => ({ stat, flat: n * stepFor(stat) });
/** A special stat at its word (Evasion, Accuracy, Crit damage, Double strike, Thorns, Lifesteal, Siphon). */
/** A piece's special stat at a level: the class lines' size (SPECIAL), or a piece's own where it has one (PIECE_SPECIAL). */
export const sp = (s: SpecialStat, level: SpecialLevel): Change => ({ stat: SPECIAL_KEY[s], flat: (PIECE_SPECIAL[s] ?? SPECIAL[s])[level] });
/** Crit chance in steps: +1 is 3 points, +2 is 5. */
export const critStep = (n: number): Change => ({ stat: "crit_chance", flat: crit(n) });

/**
 * A weapon's hit: its kind's swing by its words (scale.ts KIND_WORDS), the same rule as the plain weapons. A piece may step along
 * the trade (`trade`: a heavier swing for a step fewer, a lighter one for a step more, scale.ts SWING_TRADE), take a different
 * scaling, or swing from another stat in place of Attack (the Heartsplitter's max HP).
 */
export function weaponHit(kind: string, o: Partial<KindWords> & { trade?: Trade; stat?: string } = {}): NumT {
  const n = swingOf(kind, o, o.stat ?? "attack") as Exclude<NumT, number>;
  if (!o.trade) return n;
  const m = o.trade === "heavy" ? SWING_TRADE : 1 / SWING_TRADE;
  return { base: Math.round((n.base ?? 0) * m), scale: n.scale.map((t) => ({ ...t, ratio: Math.round(t.ratio * m * 1e6) / 1e6 })) };
}
export type Trade = "heavy" | "light";
/** The stat steps a kind's pieces carry at a rarity (scale.ts KIND_BUDGET), a step fewer for a heavy piece and one more for a light one. */
export const budgetOf = (kind: string, rarity: Rarity, trade?: Trade): number =>
  rarity === "mythic" ? 0 : Math.max(0, KIND_BUDGET[KIND_WORDS[kind].budget][rarity] + (trade === "heavy" ? -1 : trade === "light" ? 1 : 0));
/**
 * How many steps a piece's stats are: an amount stat's steps (HP's half points, Aggro's tens, MP regen's own), Crit chance's
 * table, a special stat at its medium word one and at its high word two. A stat that shapes a piece (the Worldbreaker's slow
 * swing, the Hummingbird charm's fast one: a special at any other value) or a price (the Phoenix ember's HP) counts none; Aggro
 * down counts, since the casters want it.
 */
export function stepsOf(stats: readonly Change[] = []): number {
  let n = 0;
  for (const c of stats) {
    if (c.stat === "crit_chance") n += c.flat >= crit(2) ? 2 : c.flat > 0 ? 1 : 0;
    else if (c.stat in SPECIAL_LEVELS) n += c.flat === SPECIAL_LEVELS[c.stat].high ? 2 : c.flat === SPECIAL_LEVELS[c.stat].medium ? 1 : 0;
    else if (c.stat === "aggro") n += Math.round(Math.abs(c.flat) / stepFor(c.stat)); // Aggro down is a step the casters want.
    else if (["max_hp", "max_mp", "mp_regen", "attack", "defense"].includes(c.stat) && c.flat > 0) n += Math.round(c.flat / stepFor(c.stat));
  }
  return n;
}
const SPECIAL_LEVELS: Record<string, { medium: number; high: number }> = Object.fromEntries((Object.keys(SPECIAL) as SpecialStat[]).map((s) => [SPECIAL_KEY[s], PIECE_SPECIAL[s] ?? SPECIAL[s]]));

/** Stacks from the holder's stat, read when a piece's status fires (a passive's words: a few 0.7 a point, several 1.3, many 2.3). */
export const own = (word: StackWord, stat: string, mult = 1): NumT => ({ scale: [{ ratio: (mult * STACKS[word]) / P, stat, of: "holder" }] });

/** The nine builds (docs/gear-design/builds.md), by their short names. */
export const BUILDS = ["landslide", "cuts", "bonfire", "snap", "storm", "hunt", "toll", "barrage", "pact"] as const;
export type Build = (typeof BUILDS)[number];
/** What an item is worth to a build: the rung it serves (absent: worth something at any), and ●, ●● or ●●● as 1, 2, 3. Designer data, never shown. */
export type BuildTag = { build: Build; rung?: 1 | 2 | 3; worth: 1 | 2 | 3 };
/**
 * An item's designer tags, never shown and never in the pack: the builds it serves, the engines it's a part of (the key
 * part, or one of the others), the threads it carries, and what else it's for (a net, an exotic, a first move...).
 */
export type Tags = { builds: BuildTag[]; engines: { engine: string; key: boolean }[]; threads: string[]; other: string[] };
export type Builds = Record<string, BuildTag[]>;
export type Served = Record<string, Tags>;

const BUILD_WORDS: [RegExp, Build][] = [
  [/landslide/i, "landslide"], [/cuts/i, "cuts"], [/bonfire/i, "bonfire"], [/snap/i, "snap"], [/storm/i, "storm"], [/hunt/i, "hunt"], [/toll/i, "toll"], [/barrage/i, "barrage"], [/pact/i, "pact"],
];
/**
 * An item's **Serves** line, as the design writes it: "Cuts 1 ●●, Hunt ● ⚙ red rain (half), reaping (key) ◆ swing-status".
 * Before ⚙: the builds, each with its rung if named and its worth in dots (none: ●), and any other word (exotic, net, first
 * move). After ⚙: the engines, each the key part or a half. After ◆: the threads. A common's line is prose: every build it
 * names is tagged at ●.
 */
export function serves(line: string): Tags {
  const [head, threads = ""] = line.split("◆");
  const [builds, engines = ""] = head.split("⚙");
  const out: Tags = { builds: [], engines: [], threads: threads.split(",").map((x) => x.trim()).filter(Boolean), other: [] };
  for (const part of engines.split(",").map((x) => x.trim()).filter(Boolean)) {
    const m = /^(.+?)\s*\((key|half)\)$/.exec(part);
    if (!m) throw new Error(`a Serves line's engine I can't read: '${part}' in '${line}'`);
    out.engines.push({ engine: m[1].trim(), key: m[2] === "key" });
  }
  const add = (build: Build, rung: BuildTag["rung"], worth: BuildTag["worth"]) => {
    if (!out.builds.some((t) => t.build === build && t.rung === rung)) out.builds.push({ build, ...(rung ? { rung } : {}), worth });
  };
  for (const part of builds.split(",").map((x) => x.trim()).filter(Boolean)) {
    const m = /^(?:the\s+)?([A-Za-z ]+?)(?:\s+([123]))?(?:\s+(●{1,3}))?$/.exec(part);
    const build = m && BUILD_WORDS.find(([re]) => re.test(m[1]) && m[1].trim().split(/\s+/).length <= 2)?.[1];
    if (m && build) add(build, m[2] ? (Number(m[2]) as 1 | 2 | 3) : undefined, (m[3]?.length ?? 1) as 1 | 2 | 3);
    else if (/●|^\w+ [123]$/.test(part)) throw new Error(`a Serves line's build I can't read: '${part}' in '${line}'`);
    else {
      // Prose (a common's line), or another word: every build named in it is served at ●.
      const named = BUILD_WORDS.filter(([re]) => re.test(part));
      for (const [, b2] of named) add(b2, undefined, 1);
      if (!named.length) out.other.push(part.replace(/\.$/, ""));
    }
  }
  return out;
}

export type Rarity = "common" | "uncommon" | "rare" | "legendary" | "mythic";
const SPECIAL_NAME: Record<string, string> = { evasion: "Evasion", accuracy: "Accuracy", crit_multiplier: "Crit damage", double_strike: "Double strike", thorns: "Thorns", lifesteal: "Lifesteal", siphon: "Siphon", attack_speed: "Attack speed", cooldown_reduction: "Cooldown", cast_time_reduction: "Cast speed" };
/** The card of a piece that is only its stats (a common): the interface shows the stats, so the card says only that there's nothing more. */
export const PLAIN_CARD = "Nothing beyond its stats.";

type PieceOpts = {
  name: string;
  /** The card's effect, as the player reads it: what the piece does beyond its stats, or nothing for a common. */
  effect?: string;
  /** The whole card, in place of the trade and `effect` (a mythic's). */
  text?: string;
  slot: GearT["slot"];
  rarity: Rarity;
  /** A weapon's kind, an armor's type or an offhand's kind. A mythic weapon may leave it out and state its own speed, type and hands. */
  kind?: string;
  stats?: Change[];
  /** The piece's statuses, given at every fight's start (piece statuses: buffs on the sheet, unremovable). */
  statuses?: string[];
  /** Weapons: the hit (default: its kind's swing by its words), and anything else the weapon states (riders, apply, a mythic's own cooldown). */
  weapon?: Partial<WeaponT>;
  /** Weapons: a step along the trade. heavy: a harder swing for a stat step fewer; light: a lighter swing for one more. The swing's values show it. */
  trade?: Trade;
  /** A mythic: the one class it fits. */
  mythic?: string;
  note?: string;
};
/** One piece of gear, fixed: its rarity is its own (no affixes at any rarity). */
export function piece(o: PieceOpts): GearT {
  // The card is the effect. The stats and the swing (its trade included) are the interface's, shown as values beside the name, never words on the card.
  const text = o.text ?? (o.effect || PLAIN_CARD);
  const g: GearT = {
    id: idOf(o.name), name: o.name, text, slot: o.slot,
    // The validator's tiers: an ordinary piece drops, a powerful one (legendary, mythic) is an unlock. Neither changes play in the rogue.
    ...(o.rarity === "legendary" || o.rarity === "mythic" ? { tier: "powerful" as const, source: "unlock" as const } : { tier: "ordinary" as const, source: "drop" as const }),
    ...(o.slot === "armor" && o.kind ? { armor: o.kind } : {}),
    ...(o.slot === "offhand" && o.kind ? { offhand: o.kind } : {}),
    ...(o.stats?.length ? { stats: o.stats } : {}),
    ...(o.statuses?.length ? { statuses: o.statuses } : {}),
    ...(o.mythic ? { mythic: o.mythic } : {}),
    ...(o.note ? { note: o.note } : {}),
  };
  if (o.slot === "weapon") {
    const kind = o.weapon?.kind ?? o.kind;
    g.weapon = { ...(kind ? { kind } : {}), amount: kind ? weaponHit(kind, { trade: o.trade }) : 0, ...o.weapon } as WeaponT;
    // Every piece carries its kind's steps at its rarity (the director's rule: stats at every rarity, and the kind's budget says how many).
    if (kind && o.rarity !== "mythic" && stepsOf(o.stats) !== budgetOf(kind, o.rarity, o.trade)) {
      throw new Error(`${o.name}: a ${o.rarity} ${kind} carries ${budgetOf(kind, o.rarity, o.trade)} stat steps, not ${stepsOf(o.stats)}`);
    }
  } else if (o.rarity !== "mythic") {
    // An offhand, armor or amulet has no swing to trade against: the standard budget, exact for an offhand's kind and a common or
    // uncommon of any slot; a rare or legendary armor or amulet carries at least its step beside the effect that is its shape.
    const want = KIND_BUDGET.standard[o.rarity], have = stepsOf(o.stats);
    const exact = o.slot === "offhand" || o.rarity === "common" || o.rarity === "uncommon";
    if (exact ? have !== want : have < want) throw new Error(`${o.name}: a ${o.rarity} ${o.slot} carries ${exact ? "" : "at least "}${want} stat steps, not ${have}`);
  }
  // A special stat on gear is medium, or high on a legendary (the loot's rule).
  if (o.rarity !== "legendary" && o.rarity !== "mythic") {
    const high = o.stats?.find((c) => c.stat in SPECIAL_LEVELS && c.flat === SPECIAL_LEVELS[c.stat].high);
    if (high) throw new Error(`${o.name}: a ${o.rarity} with ${SPECIAL_NAME[high.stat]} high; high is a legendary's`);
  }
  // A max MP step brings HP beside it (scale.ts MP_STEP_HP), over the budget the checks above counted.
  const mp = o.rarity === "mythic" ? 0 : (o.stats ?? []).filter((c) => c.stat === "max_mp" && (c.flat ?? 0) > 0).reduce((n, c) => n + Math.round((c.flat ?? 0) / stepFor("max_mp")), 0);
  if (mp && g.stats) {
    const add = mp * MP_STEP_HP * HP_STEP, hp = g.stats.find((c) => c.stat === "max_hp");
    g.stats = hp ? g.stats.map((c) => (c === hp ? { ...c, flat: (c.flat ?? 0) + add } : c)) : [...g.stats, { stat: "max_hp", flat: add }];
  }
  (g as GearT & { rarity?: Rarity }).rarity = o.rarity;
  return g;
}

/** A piece's status: a buff on the unit sheet, unremovable, refreshed by its piece. */
export const pieceStatus = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;

// ─── Writing an item's statuses: the words every share uses ──────────────────

/** A state a piece switches on and off: a buff with an icon, Fizzle unless it says otherwise. */
export const state = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "icon", stacking: "fizzle", ...body }) as StatusT;
/** Bookkeeping: neither buff nor debuff, lifted only by name, on the unit sheet. */
export const marker = (id: string, name: string, text: string, body: Partial<StatusT> = {}): StatusT =>
  ({ id, name, text, label: "marker", show: "sheet", stacking: "refresh", ...body }) as StatusT;
/** A once-a-fight marker, kept through a knockout so a revive doesn't give the piece back. */
export const used = (id: string, name: string): StatusT => marker(id, name, "Spent for this fight.", { stacking: "fizzle", survivesKO: true });
/**
 * A one-use state: one stack, spent the moment `spentOn` happens (the drop is immediate, so nothing that answers the same
 * event a sub-tick later still sees it): a free cast, a doubled swing.
 */
export const oneUse = (id: string, name: string, text: string, spentOn: EventSpecT, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "icon", stacking: "intensity", cap: 1, trigger: { on: spentOn }, drop: "all", ...body }) as StatusT;
/**
 * A count to `every`, shown as a number on the unit and kept for the fight: it empties itself as it reaches `every`. Add one
 * with `give(id, "holder", 1)`; what the count's last step does reads `countAt(id, every - 1)` before that step is added
 * (list that reaction before the one that adds), so the n-th event itself is the one that pays.
 */
export const count = (id: string, name: string, text: string, every: number): StatusT =>
  ({ id, name, text, label: "buff", show: "icon", stacking: "intensity", unremovable: true, cap: every, trigger: { on: { event: "status_capped", status: id } }, drop: "all" }) as StatusT;
/** "The count stands at n or more", as a unit test (a reaction's `if` on `self`, a strike's `when`, an ability change's `if`). */
export const countAt = (status: string, atLeast: number): UnitCondT => ({ stacks: { status, atLeast } });

export const give = (status: string, to: ToT = "holder", stacks?: NumT, more: Partial<Extract<EffectT, { op: "apply" }>> = {}): EffectT =>
  ({ op: "apply", status, to, ...(stacks !== undefined ? { stacks } : {}), ...more }) as EffectT;
/** Lifts a status by name: a buff unless told (a marker, a debuff). */
export const lift = (status: string, to: ToT = "holder", label: "buff" | "debuff" | "marker" = "buff"): EffectT => ({ op: "remove", label, status, to });
export const on = (event: EventSpecT["event"], spec: Omit<EventSpecT, "event"> = {}): EventSpecT => ({ event, ...spec });
export const react = (spec: EventSpecT, ...effects: EffectT[]): ReactionT => ({ on: spec, do: effects });
/** A reaction with tests: every one must hold as it resolves. */
export const reactIf = (spec: EventSpecT, tests: TestT | TestT[], ...effects: EffectT[]): ReactionT => ({ on: spec, if: tests, do: effects });
/** "When each fight starts": what an Overture coat or a Second dawn makes happen again. */
export const atStart = (...effects: EffectT[]): ReactionT => react(on("fight_start"), ...effects);
/** At the fight's true start only: a price or a drawback, which never happens again. */
export const atFirstStart = (...effects: EffectT[]): ReactionT => react(on("fight_start", { repeat: false }), ...effects);

/** The events the cards name. */
export const EV = {
  /** A hit its holder lands, of any kind. */
  hit: on("hit_lands"),
  /** A basic attack its holder lands. */
  basic: on("hit_lands", { kind: "basic" }),
  /** An extra strike (Double strike's) its holder lands. */
  extra: on("hit_lands", { kind: "extra" }),
  /** A crit its holder lands. */
  crit: on("hit_lands", { tags: ["crit"] }),
  /** A hit its holder takes. */
  struck: on("hit_taken"),
  /** A hit its holder dodges. */
  dodge: on("hit_evaded"),
  /** A killing blow its holder lands: a hit that fells a foe (never Thorns, damage sent back or a status's own). */
  kill: on("ko", { whose: "foe", other: "holder", tags: ["physical"] }),
  /** A foe falls, whatever felled it. */
  fall: on("ko", { whose: "foe" }),
  /** An ally falls (not the holder). */
  allyFall: on("ko", { whose: "ally" }),
  /** A foe's Chill shatters. */
  shatter: on("status_capped", { status: "chill", whose: "foe" }),
  /** Its holder finishes casting an ability (a repeat included). */
  cast: on("action_resolve", { kind: "ability" }),
  /** Its holder makes a basic attack (landed or dodged). */
  swing: on("action_resolve", { kind: "basic" }),
} as const;

/** Boosts on every hit the holder lands. */
export const hits = (pct: NumT) => [{ tag: "physical", pct }];
/** "+pct% against a unit that passes `when`": a boost that reads the unit being hit. */
export const against = (pct: number, when: UnitCondT): NumT => ({ scale: [{ ratio: pct, when, of: "target" }] });
/** "+pct% while its holder passes `when`". */
export const whileIt = (pct: number, when: UnitCondT): NumT => ({ scale: [{ ratio: pct, when, of: "holder" }] });
/** A share of a stat, read off the holder (or the effect's target, or the status's source) when the effect lands. */
export const share = (ratio: number, stat: string, of: "holder" | "target" | "source" = "holder"): NumT => ({ scale: [{ ratio, stat, of }] });
/** A share of the event's amount (the damage a hit dealt, the HP a heal restored, the stacks a status held). */
export const ofAmount = (ratio = 1): NumT => ({ scale: [{ ratio, amount: true }] });
/** Stacks of a status read off a unit: the holder's own, or the effect's target's. */
export const stacksOf = (status: string, ratio = 1, of: "holder" | "target" = "holder"): NumT => ({ scale: [{ ratio, stacks: status, of }] });
/** Stacks from the wearer's stat on its weapon's own hit or a strike's `apply` (an action: the swinging unit is `self`). */
export const swingStacks = (word: StackWord, stat = "attack", mult = 1): NumT => ({ scale: [{ ratio: (mult * STACKS[word]) / P, stat, of: "self" }] });

/** The target phrases the cards use. */
export const TO = {
  self: (where?: UnitCondT): TargetRuleT => ({ side: "self", ...(where ? { where } : {}) }),
  everyFoe: { side: "foes", pick: "all" } as TargetRuleT,
  everyAlly: { side: "allies", pick: "all" } as TargetRuleT,
  otherAllies: { side: "others", pick: "all" } as TargetRuleT,
  /** Every other foe, in a reaction: all but the event's other unit (the foe hit) or its owner (the foe that fell or shattered). */
  otherFoes: (but: "other" | "owner"): TargetRuleT => ({ side: "foes", pick: "all", exclude: but }),
  lowestAlly: { side: "allies", pick: "lowest", by: "hp_share" } as TargetRuleT,
  otherLowestAlly: { side: "others", pick: "lowest", by: "hp_share" } as TargetRuleT,
  /** "The ally with the least MP": the lowest share of max MP, the holder included. */
  leastMpAlly: { side: "allies", pick: "lowest", by: "mp_share" } as TargetRuleT,
  /** "The other ally with the highest Attack." */
  otherTopAttack: { side: "others", pick: "highest", by: { stats: ["attack"] } } as TargetRuleT,
  /** "The ally with the highest Aggro", as it stands with gear and seat (a Taunt isn't Aggro). */
  topAggroAlly: { side: "allies", pick: "highest", by: { stat: "aggro" } } as TargetRuleT,
  /** "The (other) ally with the slowest basic attack." */
  slowestAlly: { side: "allies", pick: "highest", by: "swing" } as TargetRuleT,
  otherSlowestAlly: { side: "others", pick: "highest", by: "swing" } as TargetRuleT,
  lowestHpFoe: { side: "foes", pick: "lowest", by: "hp" } as TargetRuleT,
  /** "The foe with the most <status>": with none holding it, a random foe. */
  mostFoe: (status: string): TargetRuleT => ({ side: "foes", pick: "highest", by: { stacks: status } }),
  /** A foe by draw: what a piece sends on (a status, a left-over), which a Mark and a Taunt don't steer. */
  foeByDraw: { side: "foes", pick: "aggro" } as TargetRuleT,
  /** The unit in a seat of the party's formation. */
  seat: (id: string): TargetRuleT => ({ side: "allies", seat: id }),
};
/** "No foe is Marked", as a reaction's test: the test every piece and seat that Marks carries, so the party holds one such Mark. */
export const NO_MARK: ConditionT = { side: "foes", where: { has: "marked" }, atMost: 0 };
/** "Every so often": the short cooldown word. */
export const SO_OFTEN = COOLDOWN.short;
/** "Every few ticks". */
export const FEW_TICKS = 4;

/**
 * A state held while its holder is below a line of its max HP (or at the line and over): given and lifted by the HP line's
 * own events, which fire whatever moved the HP, a price included, and as a fight starts or the unit stands up.
 */
export function whileHp(stateId: string, line: number, below: boolean): ReactionT[] {
  return [react(on(below ? "hp_low" : "hp_high", { line }), give(stateId)), react(on(below ? "hp_high" : "hp_low", { line }), lift(stateId))];
}
/** A state held while its holder holds a status (a Shield, a Guard, a Taunt): given as the status lands, lifted as it ends. */
export function whileHolding(stateId: string, status: string): ReactionT[] {
  return [react(on("status_gained", { status }), give(stateId)), react(on("status_ended", { status }), lift(stateId))];
}
/** "The first time each fight its holder drops below a line": the effects, once, with the marker that keeps it to once. */
export const onceBelow = (line: number, usedId: string, ...effects: EffectT[]): ReactionT =>
  reactIf(on("hp_low", { line }), { side: "self", where: { lacks: usedId } }, ...effects, give(usedId));
/** "Taunts all fight": Taunt as each fight starts, again each time it ends while the unit stands, and again on a revive. */
export const TAUNTS_ALL_FIGHT: ReactionT[] = [
  atStart(give("taunt")),
  react(on("status_ended", { status: "taunt", cause: ["expired", "removed"] }), give("taunt")),
  react(on("revived"), give("taunt")),
];
/** "Its next basic attack comes at once": the basic attack's timer made ready (a second call before the swing adds nothing). */
export const swingNow = (to: ToT = "holder"): EffectT => ({ op: "cooldown", which: "basic", set: "ready", to });

/**
 * "Every so often", with the first beat halfway to it: a wait as the fight starts (and on a revive), then a beat on its own
 * marker every `SO_OFTEN`. The piece's status takes the reactions; the share adds the two markers.
 */
export function beatHalfway(pid: string, name: string, effects: EffectT[]): { reactions: ReactionT[]; statuses: StatusT[] } {
  const wait = `${pid}_wait`, pulse = `${pid}_beat`;
  return {
    reactions: [atStart(give(wait)), react(on("revived"), give(wait)), react(on("status_ended", { status: wait, cause: ["expired"] }), ...effects, give(pulse))],
    statuses: [
      marker(wait, `${name} (waiting)`, "Its first beat comes when this runs out.", { duration: SO_OFTEN / 2 }),
      marker(pulse, `${name} (beating)`, "Its beat, every so often.", { pulse: { every: SO_OFTEN, do: effects } }),
    ],
  };
}

// ─── A share: one content file's pieces ──────────────────────────────────────

/**
 * What a content file gathers: `gear` joins the pack's gear and the rogue's stock, `statuses` the pack's statuses, and
 * `served` is designer data, never in the pack. `add` takes one piece, the statuses behind it, and its Serves line.
 */
export function shelf() {
  const gear: GearT[] = [], statuses: StatusT[] = [], served: Served = {};
  return {
    gear, statuses, served,
    add(g: GearT, sts: StatusT[], line: string) {
      if (gear.some((x) => x.id === g.id)) throw new Error(`two pieces named '${g.name}'`);
      gear.push(g);
      statuses.push(...sts);
      served[g.id] = serves(line);
    },
  };
}
