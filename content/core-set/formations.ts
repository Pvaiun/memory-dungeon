/**
 * The core set's formations: Neutral, the starter, and the 32 of step 5i (11 common, 12 rare, 9 legendary).
 *
 * Written from steps/05-core-set/5i-synergy/fill/formations.md, with fill-rulings.md winning where they differ (its third round,
 * the director's, over the first two). A seat is a position: its own stats, and the statuses it gives the unit sitting there.
 * A formation's own stats and statuses are its party effect, given to every unit in it. Statuses are universal: nothing here
 * applies one for less or more than its own length. Where the engine doesn't act on a field yet, it's written in the shape
 * build/engine-spec.md gives (X numbers in the comments), for wave 3 to check against the merged engine.
 *
 * Step 5i (the build's retire share): the nine old formations (Vanguard, Champion, Ambush, Tortoise, Scatter, Blitz, Caravan,
 * Last stand, Escort) and their four statuses went before this file was written.
 */
import type { ConditionT, EffectT, EventSpecT, FixedStatT, FormationT, NumT, ReactionT, StatusT, TargetRuleT, TestT, ToT, UnitCondT } from "../../src/schema.js";
import { idOf, pieceStatus, type Build, type BuildTag, type Builds } from "./pieces/kit.js";
import { marked } from "./pieces/shared.js";
import { AGGRO_STEP, FLAT_STACKS, SPECIAL, crit, stepFor } from "./scale.js";

// ─── The words, as numbers (fill/formations.md, "The words, as numbers") ──────

/** A seat's stat step: one and a quarter gear steps (step 5f round 4), as today's formations had it. */
export const FORMATION_STEP = 1.25;
type Change = { stat: string; flat: number };
/**
 * n seat steps of a stat (a negative n gives it up): Attack, Magic and Armor 1,250, HP 625, Aggro 13, MP regen 3,750 a step.
 * Halves round away from zero, so "draws less" is −13 as the fill's table has it (Math.round alone gave −12).
 */
const st = (stat: string, n: number): Change => {
  const v = n * FORMATION_STEP * stepFor(stat);
  return { stat, flat: Math.sign(v) * Math.round(Math.abs(v)) };
};
/** Crit chance in seat steps: "crits more" +3.5, "crits far more" +7. */
const critSt = (n: number): Change => ({ stat: "crit_chance", flat: crit(n * FORMATION_STEP) });
/** Special stats sit at their words, unscaled (as Scatter's Decoy did). */
const EVASION: Change = { stat: "evasion", flat: SPECIAL.evasion.medium };
const THORNS: Change = { stat: "thorns", flat: SPECIAL.thorns.medium };
const THORNS_HIGH: Change = { stat: "thorns", flat: SPECIAL.thorns.high };
const LIFESTEAL: Change = { stat: "lifesteal", flat: SPECIAL.lifesteal.medium };
const CRIT_DAMAGE: Change = { stat: "crit_multiplier", flat: SPECIAL.crit_damage.medium };
/** "Draws a little more": one gear step, under a seat step. */
const DRAWS_A_LITTLE: Change = { stat: "aggro", flat: AGGRO_STEP };
/** "Basic attacks a fifth faster": a seat may carry Attack speed, which gear doesn't. */
const FIFTH_FASTER: Change = { stat: "attack_speed", flat: 20 };
/** "Abilities come round a little faster": cooldowns ÷ 1.15. */
const LITTLE_SOONER: Change = { stat: "cooldown_reduction", flat: 15 };
/** "Heals on it are halved" and "heals on it are stronger". */
const HALF_HEALS: Change = { stat: "healing_received", flat: -50 };
const STRONGER_HEALS: Change = { stat: "healing_received", flat: 20 };
/** "Can't be Silenced". */
const NO_SILENCE: Change = { stat: "immune:status:silence", flat: 1 };

// ─── Writing helpers ─────────────────────────────────────────────────────────

const give = (status: string, to: ToT = "holder", stacks?: NumT): EffectT => ({ op: "apply", status, to, ...(stacks !== undefined ? { stacks } : {}) });
const on = (event: EventSpecT["event"], spec: Omit<EventSpecT, "event"> = {}): EventSpecT => ({ event, ...spec });
const react = (spec: EventSpecT, ...effects: EffectT[]): ReactionT => ({ on: spec, do: effects });
const atStart = (...effects: EffectT[]): ReactionT => react(on("fight_start"), ...effects);
/** A boost on all the holder's hits. */
const hits = (pct: NumT) => [{ tag: "physical", pct }, { tag: "magical", pct }];
/** Some of the holder's cooldowns this many ticks closer (X21). */
const closer = (which: "abilities" | "soonest", less: number): EffectT => ({ op: "cooldown", which, set: { less }, to: "holder" });
const OTHERS: TargetRuleT = { side: "others", pick: "all" };
/** "Taunts all fight": Taunt when each fight starts, again each time it ends while the unit stands, and again on a revive (Taunt keeps its own 20 ticks). */
const TAUNTS_ALL_FIGHT: ReactionT[] = [
  atStart(give("taunt")),
  react(on("status_ended", { status: "taunt", cause: ["expired", "removed"] }), give("taunt")),
  react(on("revived"), give("taunt")),
];

/** A seat's or a formation's own status: on the unit sheet, unremovable, as a piece's status is. */
const held = pieceStatus;
/** A one-use state: one stack, spent on the event (so a second before then adds nothing, and the next hit or action takes it, not the one after). */
const oneUse = (id: string, name: string, text: string, spentOn: EventSpecT, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "sheet", stacking: "intensity", cap: 1, trigger: { on: spentOn }, drop: "all", ...body }) as StatusT;
/** A timer: bookkeeping that only ends (X14's marker), for "after the first few ticks". */
const timer = (id: string, name: string, duration: number): StatusT => ({ id, name, label: "marker", show: "sheet", stacking: "refresh", duration });

type Seat = { name: string; text?: string; stats?: Change[]; statuses?: string[] };
const lines = ["front", "middle", "back"] as const;
/**
 * A formation from its seats, in slot order. A seat's position id is its name's id; seats that share a name take _a, _b and _c in
 * order (the parties tool names seats by name, so it places members by slot order).
 */
function formation(name: string, rarity: NonNullable<FormationT["rarity"]>, text: string, seats: Seat[], party: { stats?: FixedStatT[]; statuses?: string[] } = {}): FormationT {
  const names = seats.map((s) => idOf(s.name));
  const positions = seats.map((s, i) => {
    const twin = names.filter((n) => n === names[i]).length > 1;
    const id = twin ? `${names[i]}_${"abc"[names.slice(0, i).filter((n) => n === names[i]).length]}` : names[i];
    return {
      id, name: s.name, ...(s.text ? { text: s.text } : {}), layout: { line: lines[i], column: i },
      ...(s.stats?.length ? { stats: s.stats } : {}), ...(s.statuses?.length ? { statuses: s.statuses } : {}),
    };
  });
  return {
    id: idOf(name), name, text, rarity, source: "unlock", positions,
    ...(party.stats?.length ? { stats: party.stats } : {}), ...(party.statuses?.length ? { statuses: party.statuses } : {}),
  };
}
const twice = (s: Seat): Seat[] => [s, s];
const thrice = (s: Seat): Seat[] => [s, s, s];

const BUILDS: Build[] = ["landslide", "cuts", "bonfire", "snap", "hunt", "harvest", "ambush", "overflow", "lockdown", "toll", "pact", "phoenix"];
/** An item's **Builds** line, as the fill writes it ("Toll 1 ●●, Harvest ●"): each build, its rung if named, and its worth in dots. */
function tags(line: string): BuildTag[] {
  if (!line) return [];
  return line.split(",").map((part) => {
    const m = /^(\w+)(?: ([123]))? (●{1,3})$/.exec(part.trim());
    const build = m?.[1].toLowerCase() as Build;
    if (!m || !BUILDS.includes(build)) throw new Error(`formations.ts: a Builds line I can't read: '${part.trim()}'`);
    return { build, ...(m[2] ? { rung: Number(m[2]) as 1 | 2 | 3 } : {}), worth: m[3].length as 1 | 2 | 3 };
  });
}

type Entry = { formation: FormationT; statuses: StatusT[]; builds: BuildTag[] };
const entry = (f: FormationT, statuses: StatusT[], builds: string): Entry => ({ formation: f, statuses, builds: tags(builds) });

// ─── Neutral: the starter ────────────────────────────────────────────────────

const neutral: FormationT = {
  id: "neutral", name: "Neutral", text: "Three slots that do nothing.", rarity: "common", source: "starter",
  positions: [
    { id: "a", name: "Left", layout: { line: "front", column: 0 } },
    { id: "b", name: "Centre", layout: { line: "middle", column: 1 } },
    { id: "c", name: "Right", layout: { line: "back", column: 2 } },
  ],
};

// ─── Common ──────────────────────────────────────────────────────────────────

const ALLY_DOWN: ConditionT = { side: "others", where: { ko: true } };
const NO_ALLY_DOWN: ConditionT = { side: "others", where: { ko: true }, atMost: 0 };

const common: Entry[] = [
  entry(
    formation("Shieldwall", "common", "One stands in front with its shield up; two stand behind it.", [
      { name: "Wall", text: "Draws far more. Armor up two steps.", stats: [st("aggro", 2), st("armor", 2)] },
      ...twice({ name: "Behind", text: "Draws less.", stats: [st("aggro", -1)] }),
    ]),
    [],
    "Toll 1 ●●, Landslide 1 ●●, Bonfire 1 ●●, Harvest ●, Phoenix ●",
  ),
  entry(
    formation("Heavy line", "common", "One strikes, one holds, one is free.", [
      { name: "Bruiser", text: "Attack up. Its crits hit harder. Draws less.", stats: [st("attack", 1), CRIT_DAMAGE, st("aggro", -1)] },
      { name: "Holder", text: "Draws more. HP up two steps.", stats: [st("aggro", 1), st("max_hp", 2)] },
      { name: "Free", text: "Nothing." },
    ]),
    [],
    "Landslide 1 ●●●, Snap ●●, Ambush ●",
  ),
  entry(
    formation("Skirmish line", "common", "Three light fighters who'd rather not be hit at all.", thrice({ name: "Skirmisher", text: "Dodges. Armor down.", stats: [EVASION, st("armor", -1)] })),
    [],
    "Cuts 1 ●●, Toll ●",
  ),
  entry(
    formation("Spur", "common", "One sets the pace; two strike fast and light.", [
      { name: "Pacer", text: "When each fight starts, the other two are Hasted.", statuses: ["spur_pacer"] },
      ...twice({ name: "Blade", text: "Basic attacks a fifth faster. HP down.", stats: [FIFTH_FASTER, st("max_hp", -1)] }),
    ]),
    [held("spur_pacer", "Pacer", "When each fight starts, the others are Hasted.", { reactions: [atStart(give("haste", OTHERS))] })],
    "Cuts 1 ●●●, Bonfire ●●, Ambush ●",
  ),
  entry(
    formation("Wellspring", "common", "One regains mana all through the fight; two spend less of theirs.", [
      { name: "Source", text: "Regains MP in fights. Magic down.", stats: [st("mp_regen", 2), st("magic", -1)] },
      ...twice({ name: "Spender", text: "Abilities cost a tenth less MP.", statuses: ["wellspring_spender"] }),
    ]),
    // X22: an MP cost change on every ability.
    [held("wellspring_spender", "Spender", "Abilities cost a tenth less MP.", { mods: [{ mp: -10 }] })],
    "Overflow 1 ●●●, Lockdown ●●, Bonfire ●",
  ),
  entry(
    formation("Long march", "common", "Pace yourselves: everyone starts each fight with Regen, and hits a little softer.", thrice({ name: "Marcher" }), { statuses: ["long_march"] }),
    // Regen at its own 24 ticks (statuses are universal); every hit 10% softer, all fight.
    [held("long_march", "Long march", "Starts each fight with Regen. Deals 10% less damage.", { reactions: [atStart(give("regen"))], boosts: hits(-10) })],
    "Pact 1 ●●, Toll ●, Phoenix ●",
  ),
  entry(
    formation("First light", "common", "Up before dawn: everyone's abilities start each fight closer to ready, in lighter kit.", thrice({ name: "Riser" }), {
      stats: [st("armor", -1)],
      statuses: ["first_light"],
    }),
    // X21: 5 ticks off each ability's cooldown, on top of what it carried from the last fight.
    [held("first_light", "First light", "Its abilities start each fight 5 ticks closer to ready.", { reactions: [atStart(closer("abilities", 5))] })],
    "Ambush 1 ●●●, Lockdown ●",
  ),
  entry(
    formation("Arrowhead", "common", "A sharp point and two keen flanks. The point catches the eye.", [
      { name: "Point", text: "Crits far more. Draws more.", stats: [critSt(2), st("aggro", 1)] },
      ...twice({ name: "Flank", text: "Crits more.", stats: [critSt(1)] }),
    ]),
    [],
    "Ambush 1 ●●, Hunt 1 ●●, Landslide ●",
  ),
  entry(
    formation("Ring of steel", "common", "One draws the field onto its spikes; two cut it down.", [
      { name: "Beacon", text: "Draws far more. Thorns.", stats: [st("aggro", 2), THORNS] },
      ...twice({ name: "Reaper", text: "Attack and Magic up.", stats: [st("attack", 1), st("magic", 1)] }),
    ]),
    [],
    "Harvest 1 ●●, Toll 1 ●●",
  ),
  entry(
    formation("Vigil", "common", "One stands where the blows fall. While anyone lies fallen, the two who keep watch hit harder.", [
      { name: "Martyr", text: "Draws more. HP down.", stats: [st("aggro", 1), st("max_hp", -1)] },
      ...twice({ name: "Mourner", text: "While an ally is down, Attack and Magic up two steps.", statuses: ["vigil_mourner"] }),
    ]),
    [
      // X3: tests on reactions. One who fell in an earlier fight counts, so the fight's start checks too.
      held("vigil_mourner", "Mourner", "While an ally is down, Attack and Magic up two steps.", {
        reactions: [
          { on: on("fight_start"), if: ALLY_DOWN, do: [give("vigil_mourning")] },
          { on: on("revived"), if: ALLY_DOWN, do: [give("vigil_mourning")] },
          react(on("ko", { whose: "ally" }), give("vigil_mourning")),
          { on: on("revived", { whose: "ally" }), if: NO_ALLY_DOWN, do: [{ op: "remove", label: "buff", status: "vigil_mourning", to: "holder" }] },
        ],
      }),
      { id: "vigil_mourning", name: "MOURNING", text: "Attack and Magic up while an ally is down.", label: "buff", show: "icon", stacking: "refresh", stats: [st("attack", 2), st("magic", 2)] },
    ],
    "Phoenix 1 ●●●, Toll ●",
  ),
  entry(
    formation("Watchtower", "common", "One keeps watch from the tower; two stand guard below it.", [
      { name: "Lookout", text: "Abilities come round a little faster.", stats: [LITTLE_SOONER] },
      ...twice({ name: "Sentry", text: "Armor up. Draws a little more.", stats: [st("armor", 1), DRAWS_A_LITTLE] }),
    ]),
    [],
    "Lockdown 1 ●●, Overflow ●",
  ),
];

// ─── Rare ────────────────────────────────────────────────────────────────────

/** The slow kinds: the Hammer seat's swing shape. */
const SLOW: UnitCondT = { weapon: ["great_weapon", "mace", "staff"] };
const CASTING_FOE: ConditionT = { side: "foes", where: { casting: true } };
/** The Mason gave it: the applier (X1, the event's other) holds the Mason's status, and the unit that gained it isn't the Mason (X3 tests). */
const MASON_GAVE: TestT[] = [
  { unit: "other", where: { has: "hammer_and_anvil_mason" } },
  { unit: "owner", where: { lacks: "hammer_and_anvil_mason" } },
];
/** The Wheel's parts, each the next seat's: Wall → Blade → Well → Wall. */
const PARTS = {
  wall: { name: "WALL", text: "Draws more. Armor up.", stats: [st("aggro", 1), st("armor", 1)], next: "blade" },
  blade: { name: "BLADE", text: "Basic attacks a fifth faster. Crits more.", stats: [FIFTH_FASTER, critSt(1)], next: "well" },
  well: { name: "WELL", text: "Regains MP in fights. Heals on it are stronger.", stats: [st("mp_regen", 1), STRONGER_HEALS], next: "wall" },
} as const;
/**
 * A part of the Wheel (G13: it turns every 22 ticks, first at tick 11). Statuses are universal, so the first turn is a part of its
 * own whose length is 11: each seat starts the fight holding its opening part; when a part runs out, its holder takes the next
 * seat's part for 22. A unit knocked out drops off the wheel; on a revive its seat gives it its opening part again.
 */
const part = (key: keyof typeof PARTS, opening: boolean): StatusT => {
  const p = PARTS[key];
  const id = `the_wheel_${key}${opening ? "_opening" : ""}`;
  return {
    id, name: p.name, text: p.text, label: "buff", show: "icon", stacking: "refresh", unremovable: true, duration: opening ? 11 : 22,
    stats: [...p.stats], reactions: [react(on("status_ended", { status: id, cause: ["expired"] }), give(`the_wheel_${p.next}`))],
  };
};

const rare: Entry[] = [
  entry(
    formation("Hammer and anvil", "rare", "One takes the blows, one strikes like a falling hill, one builds stone around the striker.", [
      { name: "Anvil", text: "Draws more. Guarded when each fight starts.", stats: [st("aggro", 1)], statuses: ["hammer_and_anvil_anvil"] },
      { name: "Hammer", text: "With a slow weapon: basic attacks come half as often and deal triple. Otherwise: Attack up.", statuses: ["hammer_and_anvil_hammer"] },
      // The spec's simpler shape (engine-spec.md section 4), in place of the fill's "go to the Hammer first".
      { name: "Mason", text: "When it gives another ally a Shield or a Guard, the Hammer gains the same.", statuses: ["hammer_and_anvil_mason"] },
    ]),
    [
      held("hammer_and_anvil_anvil", "Anvil", "Guarded when each fight starts.", { reactions: [atStart(give("guard"))] }),
      held("hammer_and_anvil_hammer", "Hammer", "With a great weapon, mace or staff: basic attacks half as often, for triple damage. Otherwise: Attack up. Gains the Shields and Guards the Mason gives another ally.", {
        // X7: the weapon read once at application. Attack speed −100 is "half as often" in the engine; +200% is triple.
        stats: [
          { stat: "attack_speed", flat: { scale: [{ ratio: -100, when: SLOW, of: "holder" }] } },
          { stat: "attack", flat: { base: st("attack", 1).flat, scale: [{ ratio: -st("attack", 1).flat, when: SLOW, of: "holder" }] } },
        ],
        boosts: [{ tag: "basic", pct: { scale: [{ ratio: 200, when: SLOW, of: "holder" }] } }],
        // The Mason's line, heard by the Hammer: an ally other than the Hammer gains a Guard or a Shield whose applier (X1) holds
        // the Mason's status, and isn't the Mason itself (X3 tests). A Shield copies the stacks it added (X1's amount). On the
        // Hammer, not the Mason, so the copy never sets itself off again, whichever filters the engine reads.
        reactions: [
          { on: on("status_gained", { whose: "ally", status: "guard" }), if: MASON_GAVE, do: [give("guard")] },
          { on: on("status_gained", { whose: "ally", status: "shield" }), if: MASON_GAVE, do: [give("shield", "holder", { scale: [{ ratio: 1, amount: true }] })] },
        ],
      }),
      // A marker: the Hammer reads who holds it. Its effect lives on the Hammer's status.
      { id: "hammer_and_anvil_mason", name: "Mason", text: "When it gives another ally a Shield or a Guard, the Hammer gains the same.", label: "marker", show: "sheet", stacking: "refresh" },
    ],
    "Landslide 2 ●●●, Snap ●●, Lockdown ●",
  ),
  entry(
    formation("Hunting party", "rare", "One picks the quarry, one runs it down past any guard, one holds the line.", [
      { name: "Marker", text: "Its basic attacks Mark their target.", statuses: ["hunting_party_marker"] },
      { name: "Chaser", text: "Everything it does has Seek.", statuses: ["hunting_party_chaser"] },
      { name: "Warden", text: "Taunts when each fight starts.", statuses: ["hunting_party_warden"] },
    ]),
    [
      // G2 and X11: Marked is shared; each swing moves the Marker's one Mark to the foe it hits.
      held("hunting_party_marker", "Marker", "Its basic attacks Mark their target.", { reactions: [react(on("hit_lands", { kind: "basic" }), give(marked.id, "other"))] }),
      held("hunting_party_chaser", "Chaser", "Everything it does has Seek.", { seek: "all" }),
      held("hunting_party_warden", "Warden", "Taunts when each fight starts.", { reactions: [atStart(give("taunt"))] }),
    ],
    "Hunt 2 ●●●, Lockdown ●",
  ),
  entry(
    formation("Hearth", "rare", "One holds the door, one feeds the fire, one carries it to every burning foe.", [
      { name: "Keeper", text: "Taunts and is Guarded when each fight starts.", statuses: ["hearth_keeper"] },
      { name: "Stoker", text: "Hasted when each fight starts. Basic attacks a fifth faster.", stats: [FIFTH_FASTER], statuses: ["hearth_stoker"] },
      { name: "Torch", text: "Each of its hits adds a Burn to every foe that's already burning.", statuses: ["hearth_torch"] },
    ]),
    [
      held("hearth_keeper", "Keeper", "Taunts and is Guarded when each fight starts.", { reactions: [atStart(give("taunt"), give("guard"))] }),
      held("hearth_stoker", "Stoker", "Hasted when each fight starts.", { reactions: [atStart(give("haste"))] }),
      // Every hit it lands (basic attacks, abilities, extra strikes); Thorns and statuses aren't hits.
      held("hearth_torch", "Torch", "Each of its hits adds a Burn to every foe that's already burning.", {
        reactions: [react(on("hit_lands"), give("burn", { side: "foes", where: { has: "burn" }, pick: "all" }, 1))],
      }),
    ],
    "Bonfire 2 ●●●, Harvest ●",
  ),
  entry(
    formation("Hoarfrost line", "rare", "Two lay frost with every blow; the third waits to break what freezes.", [
      ...twice({ name: "Frost", text: "Basic attacks add a Chill.", statuses: ["hoarfrost_line_frost"] }),
      { name: "Breaker", text: "When any foe's Chill shatters, its next hit deals triple.", statuses: ["hoarfrost_line_breaker"] },
    ]),
    [
      held("hoarfrost_line_frost", "Frost", "Basic attacks add a Chill.", { reactions: [react(on("hit_lands", { kind: "basic" }), give("chill", "other", 1))] }),
      held("hoarfrost_line_breaker", "Breaker", "When any foe's Chill shatters, its next hit deals triple.", {
        reactions: [react(on("status_capped", { whose: "foe", status: "chill" }), give("hoarfrost_line_primed"))],
      }),
      // +200% until its next hit lands, then spent: the first hit of its next action, not the rest of it. A second shatter adds nothing.
      oneUse("hoarfrost_line_primed", "BREAKER", "Its next hit deals triple.", on("hit_lands"), { boosts: hits(200) }),
    ],
    "Snap 2 ●●●, Lockdown ●",
  ),
  entry(
    formation("Reaping line", "rare", "One holds the whole field on itself; two reap through it.", [
      { name: "Beacon", text: "Taunts all fight. Thorns. Heals on it are halved.", stats: [THORNS, HALF_HEALS], statuses: ["reaping_line_beacon"] },
      ...twice({ name: "Scythe", text: "Its basic attacks hit every foe, for a fifth each.", statuses: ["reaping_line_scythe"] }),
    ]),
    [
      held("reaping_line_beacon", "Beacon", "Taunts all fight.", { reactions: TAUNTS_ALL_FIGHT }),
      // X12: every foe, ahead of a Mark, each a basic attack's hit with its riders and statuses; a fifth of its damage each.
      held("reaping_line_scythe", "Scythe", "Its basic attacks hit every foe, for a fifth each.", {
        aim: { rule: { side: "foes", pick: "all" }, first: true },
        boosts: [{ tag: "basic", pct: -80 }],
      }),
    ],
    "Harvest 2 ●●●, Toll ●●",
  ),
  entry(
    formation("Relay", "rare", "Each cast passes something down the line: mana to the second seat, and a quicker next ability to the third.", [
      { name: "Well", text: "Each ability it casts gives the second seat a third of its cost in MP.", statuses: ["relay_well"] },
      { name: "Spender", text: "When the Well casts, this seat's next ability comes 4 ticks closer.", statuses: ["relay_second"] },
      { name: "Spender", text: "When the second seat casts, this seat's next ability comes 4 ticks closer.", statuses: ["relay_third"] },
    ]),
    [
      // X29: action_resolve carries the MP paid; X13: the second seat by its position id.
      held("relay_well", "Well", "Each ability it casts gives the second seat a third of its cost in MP.", {
        reactions: [react(on("action_resolve", { kind: "ability" }), { op: "mp", amount: { scale: [{ ratio: 1 / 3, amount: true }] }, to: { side: "others", seat: "spender_a" } })],
      }),
      // "Its next ability" is the one with the least cooldown left (X21 soonest).
      held("relay_second", "Spender", "When the Well casts, its next ability comes 4 ticks closer.", {
        reactions: [react(on("action_resolve", { whose: "ally", kind: "ability", seat: "well" }), closer("soonest", 4))],
      }),
      held("relay_third", "Spender", "When the second seat casts, its next ability comes 4 ticks closer.", {
        reactions: [react(on("action_resolve", { whose: "ally", kind: "ability", seat: "spender_a" }), closer("soonest", 4))],
      }),
    ],
    "Overflow 2 ●●●",
  ),
  entry(
    formation("Gaol", "rare", "One waits for the moment to lock, one keeps the foes' eyes, one comes round faster every time a foe is held.", [
      { name: "Watcher", text: "Its abilities that Stun or Silence wait for a foe's wind-up, and aim at it.", statuses: ["gaol_watcher"] },
      { name: "Gaoler", text: "Draws far more.", stats: [st("aggro", 2)] },
      { name: "Turnkey", text: "Whenever any foe is Stunned or Silenced, its abilities come 3 ticks closer.", statuses: ["gaol_turnkey"] },
    ]),
    [
      // X24: a wait and a target on the abilities that Stun or Silence: the casting foe with the highest Attack or Magic, under the
      // Taunt rule unless the ability has Seek.
      held("gaol_watcher", "Watcher", "Its abilities that Stun or Silence wait for a foe's wind-up, and aim at it.", {
        mods: [{ of: { does: ["stun", "silence"] }, wait: CASTING_FOE, target: { ...CASTING_FOE, pick: "highest", by: { stats: ["attack", "magic"] } } }],
      }),
      // Every lock counts, a shatter's Stun and its own included. Stun and Silence fizzle on a foe that holds them, so it's bounded.
      held("gaol_turnkey", "Turnkey", "Whenever any foe is Stunned or Silenced, its abilities come 3 ticks closer.", {
        reactions: ["stun", "silence"].map((s) => react(on("status_gained", { whose: "foe", status: s }), closer("abilities", 3))),
      }),
    ],
    "Lockdown 2 ●●●, Overflow ●",
  ),
  entry(
    formation("Thorn hedge", "rare", "A thorned wall that draws the blows, and two who make every attacker pay.", [
      { name: "Anchor", text: "Draws far more. Thorns, high.", stats: [st("aggro", 2), THORNS_HIGH] },
      ...twice({ name: "Thorns", text: "A foe that hits the Anchor is Weakened.", statuses: ["thorn_hedge_thorns"] }),
    ]),
    // X13: hits taken by the unit in the Anchor seat. Weaken at its own 20 ticks; each hit gives it again.
    [held("thorn_hedge_thorns", "Thorns", "A foe that hits the Anchor is Weakened.", { reactions: [react(on("hit_taken", { whose: "ally", seat: "anchor" }), give("weaken", "other"))] })],
    "Toll 2 ●●●, Landslide ●",
  ),
  entry(
    formation("Blood oath", "rare", "One bleeds for power, one drinks it back, one pours life into the bleeder.", [
      { name: "Bleeder", text: "Loses a little HP every tick. Its hits deal half again as much.", statuses: ["blood_oath_bleeder"] },
      { name: "Drinker", text: "Lifesteal.", stats: [LIFESTEAL] },
      { name: "Donor", text: "Its heals on the Bleeder are doubled.", statuses: ["blood_oath_donor"] },
    ]),
    [
      // X23 (G12): HP paid, not damage: no Shield soaks it, nothing reacts to it, never below 1 HP. 0.5% of max HP a tick.
      held("blood_oath_bleeder", "Bleeder", "Pays 0.5% of its max HP every tick, never below 1. Its hits deal half again as much.", {
        pulse: { every: 1, do: [{ op: "pay", hp: { scale: [{ ratio: 0.005, stat: "max_hp", of: "holder" }] }, to: "holder" }] },
        boosts: hits(50),
      }),
      // A healing boost that reads the healed unit: doubled on the Bleeder. A Regen it applies stays an ordinary Regen.
      held("blood_oath_donor", "Donor", "Its heals on the Bleeder are doubled.", {
        boosts: [{ tag: "healing", pct: { scale: [{ ratio: 100, when: { has: "blood_oath_bleeder" }, of: "target" }] } }],
      }),
    ],
    "Pact 2 ●●●",
  ),
  entry(
    formation("Pyre of heroes", "rare", "One is meant to fall, one to bring it back, one to stand through it.", [
      { name: "Martyr", text: "Draws far more. When it falls, every ally gains several Might and Haste.", stats: [st("aggro", 2)], statuses: ["pyre_of_heroes_martyr"] },
      { name: "Reviver", text: "Draws far less. Can't be Silenced.", stats: [st("aggro", -2), NO_SILENCE] },
      { name: "Survivor", text: "Guarded whenever an ally falls.", statuses: ["pyre_of_heroes_survivor"] },
    ]),
    [
      held("pyre_of_heroes_martyr", "Martyr", "When it falls, every ally gains several Might and Haste.", {
        survivesKO: true,
        reactions: [react(on("ko"), give("might", OTHERS, FLAT_STACKS.several), give("haste", OTHERS))],
      }),
      held("pyre_of_heroes_survivor", "Survivor", "Guarded whenever an ally falls.", { reactions: [react(on("ko", { whose: "ally" }), give("guard"))] }),
    ],
    "Phoenix 2 ●●●",
  ),
  entry(
    formation("Knives drawn", "rare", "The first blow lands twice as hard, the second comes quickly, and the third holds what's left.", [
      { name: "Opener", text: "Its first action each fight deals double.", statuses: ["knives_drawn_opener"] },
      { name: "Second", text: "Hasted when each fight starts.", statuses: ["knives_drawn_second"] },
      { name: "Rear guard", text: "Starts each fight behind a Shield. After the first few ticks, draws more.", statuses: ["knives_drawn_rear_guard"] },
    ]),
    [
      held("knives_drawn_opener", "Opener", "Its first action each fight deals double.", { reactions: [atStart(give("knives_drawn_opening"))] }),
      oneUse("knives_drawn_opening", "OPENER", "Its first action deals double.", on("action_resolve"), { boosts: hits(100) }),
      held("knives_drawn_second", "Second", "Hasted when each fight starts.", { reactions: [atStart(give("haste"))] }),
      // A Shield of 15% of max HP at the start (between Escort's 12% and Vanguard's 20%); Aggro +13 from tick 6, for the rest of the fight.
      held("knives_drawn_rear_guard", "Rear guard", "Starts each fight behind a Shield. From tick 6, draws more.", {
        reactions: [
          atStart(give("shield", "holder", { scale: [{ ratio: 0.15, stat: "max_hp", of: "holder" }] }), give("knives_drawn_rear_guard_wait")),
          react(on("status_ended", { status: "knives_drawn_rear_guard_wait", cause: ["expired"] }), give("knives_drawn_rear_guard_draw")),
        ],
      }),
      timer("knives_drawn_rear_guard_wait", "Rear guard's first few ticks", 6),
      held("knives_drawn_rear_guard_draw", "Rear guard", "Draws more.", { stats: [st("aggro", 1)] }),
    ],
    "Ambush 2 ●●●, Hunt ●",
  ),
  entry(
    formation("The wheel", "rare", "Every so often the wheel turns, and each unit takes the next seat's part.", [
      { name: "Wall", text: "Draws more. Armor up.", statuses: ["the_wheel_wall_opening"] },
      { name: "Blade", text: "Basic attacks a fifth faster. Crits more.", statuses: ["the_wheel_blade_opening"] },
      { name: "Well", text: "Regains MP in fights. Heals on it are stronger.", statuses: ["the_wheel_well_opening"] },
    ]),
    [part("wall", true), part("blade", true), part("well", true), part("wall", false), part("blade", false), part("well", false)],
    // Exotic: no build.
    "",
  ),
];

// ─── Legendary ───────────────────────────────────────────────────────────────

const LOCKED: UnitCondT = { hasAny: ["stun", "silence"] };
const PEAK_DOWN: ConditionT = { side: "others", seat: "peak", where: { ko: true } };

const legendary: Entry[] = [
  entry(
    formation("The pack", "legendary", "Everyone's basic attacks follow the Lead's last target. When it falls, the Lead's abilities come closer.", [
      { name: "Lead", text: "Its hits Mark their target. When the foe it Marked falls, its abilities come 5 ticks closer.", statuses: ["the_pack_lead"] },
      ...twice({ name: "Packmate" }),
    ]),
    [
      // Only its basic attacks' and single-target abilities' hits Mark (X2 notTags: no area hits, no extra strikes). G2: its one
      // Mark moves with each, so the party's basic attacks follow its last target. A Marked foe that falls with the Lead's Mark
      // (X2 source) brings its abilities 5 ticks closer.
      held("the_pack_lead", "Lead", "Its hits Mark their target. When the foe it Marked falls, its abilities come 5 ticks closer.", {
        reactions: [
          react(on("hit_lands", { notTags: ["area", "extra"] }), give(marked.id, "other")),
          react(on("status_ended", { whose: "foe", status: marked.id, cause: ["ko"], source: "holder" }), closer("abilities", 5)),
        ],
      }),
    ],
    "Hunt 3 ●●●, Lockdown ●",
  ),
  entry(
    formation("The forge", "legendary", "The longer the fight, the hotter everyone burns; but the forge is slow to light.", thrice({ name: "Forgehand" }), { statuses: ["the_forge"] }),
    // G3's Heat, one every 2 ticks (+36% by tick 24, the cap at tick 30); Slow at its own 24 ticks when each fight starts.
    // Step 5i, step 5, the build's one correction: every 2 ticks (the fill's 4). At 4 the self-Slow outweighed the Heat in every fight the
    // build test played (Bonfire's far end won 86% in Neutral, 68% in The forge: −17 points), and Heat never reaches Burn.
    [held("the_forge", "The forge", "Gains a Heat every 2 ticks. Slowed when each fight starts.", { pulse: { every: 2, do: [give("heat", "holder", 1)] }, reactions: [atStart(give("slow"))] })],
    "Bonfire 3 ●●●, Landslide ●●, Pact ●",
  ),
  entry(
    formation("The ambuscade", "legendary", "Everyone's first action comes at once and lands twice as hard. After that, everyone hits a sixth softer.", thrice({ name: "Lurker" }), {
      statuses: ["the_ambuscade"],
    }),
    [
      // X21: the basic attack ready at the start. The first action doubles; from tick 6 every hit is a sixth softer (−17%).
      held("the_ambuscade", "The ambuscade", "Its basic attack is ready when each fight starts, and its first action deals double. From tick 6, it deals a sixth less.", {
        reactions: [
          atStart({ op: "cooldown", which: "basic", set: "ready", to: "holder" }, give("the_ambuscade_opening"), give("the_ambuscade_wait")),
          react(on("status_ended", { status: "the_ambuscade_wait", cause: ["expired"] }), give("the_ambuscade_tail")),
        ],
      }),
      // A first action after tick 6 still deals double, uncut: +117% against the tail's −17%.
      oneUse("the_ambuscade_opening", "AMBUSCADE", "Its first action deals double.", on("action_resolve"), {
        boosts: hits({ base: 100, scale: [{ ratio: 17, when: { has: "the_ambuscade_tail" }, of: "holder" }] }),
      }),
      timer("the_ambuscade_wait", "The ambuscade's first few ticks", 6),
      { id: "the_ambuscade_tail", name: "SPENT", text: "Deals a sixth less damage.", label: "debuff", show: "sheet", stacking: "refresh", unremovable: true, boosts: hits(-17) },
    ],
    "Ambush 3 ●●●, Cuts ●",
  ),
  entry(
    formation(
      "The choir",
      "legendary",
      "Each ability a voice casts makes the next voice's next ability free. Nobody regains MP from MP regen.",
      ["First voice", "Second voice", "Third voice"].map((name) => ({ name, text: "When the voice before casts an ability, this voice's next ability is free." })),
      // The give-up: MP regen −100% on everyone. Clarity, Refrain, Siphon, tonics and the bench still give MP.
      { stats: [{ stat: "mp_regen", pct: -100 }], statuses: ["the_choir"] },
    ),
    [
      // X13: the next seat by slot order (a ring: the first follows the third), skipping empty seats. X22: the Cue makes the
      // next ability free and is spent when one resolves; a second Cue before then adds nothing.
      held("the_choir", "The choir", "Each ability it casts makes the next voice's next ability free.", {
        reactions: [react(on("action_resolve", { kind: "ability" }), give("the_choir_cue", { side: "others", seat: "next" }))],
      }),
      oneUse("the_choir_cue", "CUE", "Its next ability is free.", on("action_resolve", { kind: "ability" }), { mods: [{ mp: -100 }] }),
    ],
    "Overflow 3 ●●●, Lockdown ●●",
  ),
  entry(
    formation("The undying", "legendary", "One gives itself so the others live: when it falls they're made whole, and it stands again before the next fight.", [
      {
        name: "Martyr",
        text: "Draws far more. Can't be healed by others. When it falls, the others heal to full; it stands again after the fight with half its HP.",
        stats: [st("aggro", 2)],
        statuses: ["the_undying_martyr"],
      },
      ...twice({ name: "Spared" }),
    ]),
    [
      // X33: only its own heals land. Each fall heals the others to full (again after every revive). X36: down when a fight is won,
      // it stands with half its max HP, every ability on full cooldown (G10). The status survives the KO, so the unit that fell in
      // this seat is the one that stands; one moved into the seat while down never held it.
      held("the_undying_martyr", "Martyr", "Can't be healed by others. When it falls, the others heal to full. Down when a fight is won, it stands with half its HP.", {
        heals: "own",
        survivesKO: true,
        reactions: [
          react(on("ko"), { op: "heal", amount: { scale: [{ ratio: 1, hp: "missing", of: "target" }] }, to: OTHERS }),
          react(on("fight_won"), { op: "revive", hp: { scale: [{ ratio: 0.5, stat: "max_hp", of: "target" }] }, to: { side: "self", where: { ko: true } } }),
        ],
      }),
    ],
    "Phoenix 3 ●●●, Pact ●●",
  ),
  entry(
    formation("The hurricane", "legendary", "Every hit the party lands winds the storm. At 30, everyone is Hasted, and it winds again.", thrice({ name: "Squall" }), {
      statuses: ["the_hurricane"],
    }),
    [
      // Each ally keeps a copy of the count; every party hit adds one to each (its own, and its allies'). The copies stay in step
      // but for a revived ally's, which starts afresh. A single count shown once is the interface's (NEW 6).
      held("the_hurricane", "The hurricane", "Every hit the party lands winds the storm. At 30, Hasted, and it winds again.", {
        reactions: [react(on("hit_lands"), give("the_hurricane_count", "holder", 1)), react(on("hit_lands", { whose: "ally" }), give("the_hurricane_count", "holder", 1))],
      }),
      {
        id: "the_hurricane_count", name: "HURRICANE", text: "The party's hits, winding the storm. At 30: Haste, and it winds again.",
        label: "buff", show: "icon", stacking: "intensity", unremovable: true, cap: 30,
        trigger: { on: on("status_capped", { status: "the_hurricane_count" }), do: [give("haste")] }, drop: "all",
      },
    ],
    "Cuts 3 ●●●, Snap ●●",
  ),
  entry(
    formation("The mountain", "legendary", "One stands like a mountain. While it stands, the two below strike a third harder; while it's down, they take double.", [
      { name: "Peak", text: "Taunts all fight. Armor and HP up two steps.", stats: [st("armor", 2), st("max_hp", 2)], statuses: ["the_mountain_peak"] },
      ...twice({ name: "Foothill", text: "While the Peak stands, deals a third more. While it's down, takes double.", statuses: ["the_mountain_foothill"] }),
    ]),
    [
      // The fill's hooks: the Peak gives the two below an aura that ends with it (Per source), exposes them when it falls, and
      // lifts that and gives the aura again when it stands. Its status survives the KO so it can answer both.
      held("the_mountain_peak", "Peak", "Taunts all fight. While it stands, the others deal a third more; while it's down, they take double.", {
        survivesKO: true,
        reactions: [
          ...TAUNTS_ALL_FIGHT,
          atStart(give("the_mountain_strength", OTHERS)),
          react(on("ko"), give("the_mountain_exposed", OTHERS)),
          react(on("revived"), { op: "remove", label: "marker", status: "the_mountain_exposed", to: OTHERS }, give("the_mountain_strength", OTHERS)),
          // An ally raised while it stands takes the aura again (its own ended with its fall).
          react(on("revived", { whose: "ally" }), give("the_mountain_strength", "owner")),
        ],
      }),
      // A fight that starts with the Peak already down, or a return while it's down (X3 and X13: a test on the unit in the Peak's seat).
      held("the_mountain_foothill", "Foothill", "While the Peak stands, deals a third more. While it's down, takes double.", {
        reactions: [
          { on: on("fight_start"), if: PEAK_DOWN, do: [give("the_mountain_exposed")] },
          { on: on("revived"), if: PEAK_DOWN, do: [give("the_mountain_exposed")] },
        ],
      }),
      { id: "the_mountain_strength", name: "MOUNTAIN", text: "Deals a third more while the Peak stands.", label: "buff", show: "icon", stacking: "refresh", perSource: { endsWithSource: true }, boosts: hits(33) },
      // A marker, so only the Peak's return lifts it: a Cleanse doesn't, while the Peak is down.
      { id: "the_mountain_exposed", name: "EXPOSED", text: "Takes double damage while the Peak is down.", label: "marker", show: "icon", stacking: "refresh", taken: [{ pct: 100 }] },
    ],
    "Landslide 3 ●●●, Toll 3 ●●",
  ),
  entry(
    formation("The storm front", "legendary", "Every single-target hit the party lands also strikes the healthiest other foe, for a quarter.", thrice({ name: "Thunderhead" }), {
      statuses: ["the_storm_front"],
    }),
    [
      // X28 and X29: a quarter of the raw hit, in its damage type, at the foe with the most HP but the one it hit (X10). The strike
      // is an extra strike, so it never chains (notTags extra), and carries nothing of the first hit's.
      held("the_storm_front", "The storm front", "Each single-target hit it lands also strikes the healthiest other foe, for a quarter.", {
        reactions: [react(on("hit_lands", { notTags: ["area", "extra"] }), { op: "strike", share: 25, of: "hit", to: { side: "foes", pick: "highest", by: "hp", exclude: "other" } })],
      }),
    ],
    "Harvest 3 ●●●, Cuts ●",
  ),
  entry(
    formation("The vise", "legendary", "When a foe is Stunned or Silenced, everyone's basic attacks turn on it and hit 40% harder.", [{ name: "Jaw" }, { name: "Screw" }, { name: "Jaw" }], {
      statuses: ["the_vise"],
    }),
    [
      // X12 and X4: basic attacks go to a Stunned or Silenced foe (at random among several, under the Taunt rule, ahead of a Mark).
      held("the_vise", "The vise", "Its basic attacks go to a Stunned or Silenced foe, and deal 40% more to one.", {
        aim: { rule: { side: "foes", where: LOCKED, pick: "random" }, first: true },
        boosts: [{ tag: "basic", pct: { scale: [{ ratio: 40, when: LOCKED, of: "target" }] } }],
      }),
    ],
    "Lockdown 3 ●●●, Snap ●●",
  ),
];

// ─── The exports ─────────────────────────────────────────────────────────────

const entries = [...common, ...rare, ...legendary];

export const formations: FormationT[] = [neutral, ...entries.map((e) => e.formation)];

/** Every status behind a seat or a formation's effect. */
export const effects: StatusT[] = entries.flatMap((e) => e.statuses);

/** Designer data, never in the pack: which builds and rungs each formation serves, from the fill's **Builds** lines. */
export const builds: Builds = Object.fromEntries(entries.map((e) => [e.formation.id, e.builds]));
