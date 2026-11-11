/**
 * The core set's formations: Neutral, the starter, and 35 more (13 common, 12 rare, 10 legendary).
 *
 * A seat is a position: its own stats, and the statuses it gives the unit sitting there. A formation's own stats and statuses
 * are its party effect, given to every unit in it; one marked `party` is a rule the side holds once (the first standing ally
 * answers). Statuses are universal: nothing here applies one for less or more than its own length. Stacks from a seat are flat.
 *
 * `served` is designer data, never in the pack.
 */
import type { FixedStatT, FormationT, StatusT, UnitCondT } from "../../src/schema.js";
import { EV, FEW_TICKS, NO_MARK, SO_OFTEN, TAUNTS_ALL_FIGHT, TO, against, atStart, give, hits, idOf, ofAmount, on, pieceStatus, react, reactIf, serves, share, type Served } from "./pieces/kit.js";
import { OVERHEAL } from "./pieces/shared.js";
import { AGGRO_STEP, COOLDOWN, FLAT_STACKS, SPECIAL, crit, stepFor } from "./scale.js";

// ─── The words, as numbers ───────────────────────────────────────────────────

/** A seat's stat step: one and a quarter gear steps. */
export const FORMATION_STEP = 1.25;
type Change = { stat: string; flat: number };
/**
 * n seat steps of a stat (a negative n gives it up): Attack and Defense 1,250, HP 625, Aggro 13, MP regen 3,750 a step.
 * Halves round away from zero, so "draws less" is −13 (Math.round alone gives −12).
 */
const st = (stat: string, n: number): Change => {
  const v = n * FORMATION_STEP * stepFor(stat);
  return { stat, flat: Math.sign(v) * Math.round(Math.abs(v)) };
};
/** Crit chance in seat steps: "crits more" +3.5. */
const critSt = (n: number): Change => ({ stat: "crit_chance", flat: crit(n * FORMATION_STEP) });
/** "Crits far more often": the table's top word. */
const CRITS_FAR_MORE: Change = { stat: "crit_chance", flat: crit(5) };
/** Special stats sit at their words, unscaled. */
const EVASION: Change = { stat: "evasion", flat: SPECIAL.evasion.medium };
const THORNS: Change = { stat: "thorns", flat: SPECIAL.thorns.medium };
const LIFESTEAL: Change = { stat: "lifesteal", flat: SPECIAL.lifesteal.medium };
const LIFESTEAL_HIGH: Change = { stat: "lifesteal", flat: SPECIAL.lifesteal.high };
/** "Basic attacks a fifth faster" and "a third faster": a seat may carry Attack speed, which gear doesn't. */
const FIFTH_FASTER: Change = { stat: "attack_speed", flat: 20 };
const THIRD_FASTER: Change = { stat: "attack_speed", flat: 33 };
/** "Abilities come round a fifth faster" and "a third faster". */
const FIFTH_SOONER: Change = { stat: "cooldown_reduction", flat: 20 };
const THIRD_SOONER: Change = { stat: "cooldown_reduction", flat: 33 };
/** "Heals on it are stronger". */
const STRONGER_HEALS: Change = { stat: "healing_received", flat: 20 };
void AGGRO_STEP;

// ─── Writing helpers ─────────────────────────────────────────────────────────

/** A seat's or a formation's own status: on the unit sheet, unremovable, as a piece's status is. */
const held = pieceStatus;

type Seat = { name: string; text?: string; stats?: Change[]; statuses?: string[] };
const lines = ["front", "middle", "back"] as const;
/**
 * A formation from its seats, in slot order. A seat's position id is its name's id; seats that share a name take _a, _b and _c in
 * order (the parties tool names seats by name, so it places members by slot order).
 */
function formation(name: string, rarity: NonNullable<FormationT["rarity"]>, text: string, seats: Seat[], party: { text?: string; stats?: FixedStatT[]; statuses?: string[] } = {}): FormationT {
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
    id: idOf(name), name, text: party.text ? `${text} The party: ${party.text}` : text, rarity, source: "unlock", positions,
    ...(party.stats?.length ? { stats: party.stats } : {}), ...(party.statuses?.length ? { statuses: party.statuses } : {}),
  };
}
const twice = (s: Seat): Seat[] => [s, s];
const thrice = (s: Seat): Seat[] => [s, s, s];
const NOTHING = "Nothing of its own.";

const formations_: FormationT[] = [];
const effects_: StatusT[] = [];
const served_: Served = {};
/** One formation, the statuses behind its seats and party, and its Serves line. */
function add(f: FormationT, statuses: StatusT[], line: string) {
  if (formations_.some((x) => x.id === f.id)) throw new Error(`two formations named '${f.name}'`);
  formations_.push(f);
  effects_.push(...statuses);
  served_[f.id] = serves(line);
}

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

{
  // The Hammer: Millstone's shape on a seat (Attack speed −100 is half as often).
  const hammer = "Its basic attacks come half as often and deal two and a quarter times as much.", loader = "When each fight starts, the Hammer gains many Might.";
  add(
    formation("Heavy line", "common", "One strikes like a falling hill, one takes the blows, one loads the strike.", [
      { name: "Hammer", text: hammer, stats: [{ stat: "attack_speed", flat: -100 }], statuses: ["heavy_line_hammer"] },
      { name: "Anvil", text: "Draws far more. Defense up.", stats: [st("aggro", 2), st("defense", 1)] },
      { name: "Loader", text: loader, statuses: ["heavy_line_loader"] },
    ]),
    [
      held("heavy_line_hammer", "Hammer", hammer, { boosts: [{ tag: "basic", pct: 125 }] }),
      held("heavy_line_loader", "Loader", loader, { reactions: [atStart(give("might", TO.seat("hammer"), FLAT_STACKS.many))] }),
    ],
    "Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half)",
  );
}
add(
  formation("Spur", "common", "One opens the wound; two pour into it.", [
    { name: "Opener", text: "Crits far more often: +20% Crit chance.", stats: [CRITS_FAR_MORE] },
    ...twice({ name: "Blade", text: "Basic attacks a fifth faster.", stats: [FIFTH_FASTER] }),
  ]),
  [],
  "Cuts 1 ●●●, Bonfire ●, Storm ●, Snap ●",
);
{
  const keeper = "Taunts and is Guarded when each fight starts.", torch = "Each of its hits adds a Burn to every foe that's already burning.";
  add(
    formation("Hearth", "common", "One holds the door, one feeds the fire, one carries it to every burning foe.", [
      { name: "Keeper", text: keeper, statuses: ["hearth_keeper"] },
      { name: "Stoker", text: "Hasted when each fight starts. Basic attacks a fifth faster.", stats: [FIFTH_FASTER], statuses: ["hearth_stoker"] },
      { name: "Torch", text: torch, statuses: ["hearth_torch"] },
    ]),
    [
      held("hearth_keeper", "Keeper", keeper, { reactions: [atStart(give("taunt"), give("guard"))] }),
      held("hearth_stoker", "Stoker", "Hasted when each fight starts.", { reactions: [atStart(give("haste"))] }),
      // Every hit it lands (basic attacks, abilities, extra strikes); Thorns and statuses aren't hits.
      held("hearth_torch", "Torch", torch, { reactions: [react(EV.hit, give("burn", { side: "foes", where: { has: "burn" }, pick: "all" }, FLAT_STACKS.one))] }),
    ],
    "Bonfire 1 ●●●, Toll ●",
  );
}
{
  // The Breaker's aim: a Stunned foe, by draw among several, inside the Taunt rule and ahead of a Mark.
  const frost = "Basic attacks add a few Chill.", breaker = "While a foe is Stunned, its basic attacks go to that foe. Its hits on a Stunned foe deal double.";
  add(
    formation("Hoarfrost line", "common", "Two lay frost with every blow; the third breaks what freezes.", [
      ...twice({ name: "Frost", text: frost, statuses: ["hoarfrost_line_frost"] }),
      { name: "Breaker", text: breaker, statuses: ["hoarfrost_line_breaker"] },
    ]),
    [
      held("hoarfrost_line_frost", "Frost", frost, { reactions: [react(EV.basic, give("chill", "other", FLAT_STACKS.few))] }),
      held("hoarfrost_line_breaker", "Breaker", breaker, { aim: { rule: { side: "foes", where: { has: "stun" }, pick: "random" }, first: true }, boosts: hits(against(100, { has: "stun" })) }),
    ],
    "Snap 1 ●●●, Landslide ● ⚙ lead's colour (half)",
  );
}
{
  const squall = "Its basic attacks add a few Shock, and also hit a second, random foe for half as much, adding the same Shock to it. The second hit leaps no further.";
  add(
    formation("Squall line", "common", "Two charge the field; one stands where the foes look.", [
      ...twice({ name: "Squall", text: squall, statuses: ["squall_line_squall"] }),
      { name: "Rod", text: "Draws far more. Defense up.", stats: [st("aggro", 2), st("defense", 1)] },
    ]),
    [
      held("squall_line_squall", "Squall", squall, {
        reactions: [react(EV.basic, give("shock", "other", FLAT_STACKS.few))],
        strike: { to: { side: "foes", pick: "random", exclude: "targets" }, share: 50, kind: "bonus", apply: [{ status: "shock", stacks: FLAT_STACKS.few }] },
      }),
    ],
    "Storm 1 ●●●, Toll ●, Cuts ● ⚙ red rain (half), held charge (half)",
  );
}
{
  const marker_ = "While no foe is Marked, its basic attacks Mark their target.";
  add(
    formation("Hunting party", "common", "One picks the quarry, one runs it down past any guard, one holds the line.", [
      { name: "Marker", text: marker_, statuses: ["hunting_party_marker"] },
      { name: "Chaser", text: "Everything it does has Seek.", statuses: ["hunting_party_chaser"] },
      { name: "Warden", text: "Draws far more. Defense up.", stats: [st("aggro", 2), st("defense", 1)] },
    ]),
    [
      held("hunting_party_marker", "Marker", marker_, { reactions: [reactIf(EV.basic, NO_MARK, give("marked", "other"))] }),
      held("hunting_party_chaser", "Chaser", "Everything it does has Seek.", { seek: "all" }),
    ],
    "Hunt 1 ●●●",
  );
}
{
  // Reactions to a hit on the Anchor's seat: a heal sized from the Warden, damage sent back sized from the Barb.
  const warden = "Each hit the Anchor takes heals the Anchor for 3% of the Warden's max HP.", barb = "A foe that hits the Anchor has damage sent back at it: a twentieth of the Barb's Attack.";
  const onAnchor = on("hit_taken", { whose: "team", seat: "anchor" });
  add(
    formation("Thorn hedge", "common", "A thorned wall that draws the blows, and two who make every blow on it cost.", [
      { name: "Anchor", text: "Draws far more. Thorns.", stats: [st("aggro", 2), THORNS] },
      { name: "Warden", text: warden, statuses: ["thorn_hedge_warden"] },
      { name: "Barb", text: barb, statuses: ["thorn_hedge_barb"] },
    ]),
    [
      held("thorn_hedge_warden", "Warden", warden, { reactions: [react(onAnchor, { op: "heal", amount: share(0.03, "max_hp"), to: TO.seat("anchor") })] }),
      held("thorn_hedge_barb", "Barb", barb, { reactions: [react(onAnchor, { op: "damage", type: "none", amount: share(0.05, "attack"), to: "other" })] }),
    ],
    "Toll 1 ●●●, Pact ●",
  );
}
{
  const conductor = "Each ability it casts gives the Soloist MP: a tenth of the Soloist's max MP.";
  add(
    formation("Wellspring", "common", "Two keep one caster casting.", [
      { name: "Soloist", text: "Its abilities come round a fifth faster. Draws far less.", stats: [FIFTH_SOONER, st("aggro", -2)] },
      { name: "Conductor", text: conductor, statuses: ["wellspring_conductor"] },
      { name: "Well", text: "Draws more. Each hit it takes gives the Soloist MP: a twentieth of the Soloist's max MP.", stats: [st("aggro", 1)], statuses: ["wellspring_well"] },
    ]),
    [
      held("wellspring_conductor", "Conductor", conductor, { reactions: [react(EV.cast, { op: "mp", amount: share(0.1, "max_mp", "target"), to: TO.seat("soloist") })] }),
      held("wellspring_well", "Well", "Each hit it takes gives the Soloist MP.", { reactions: [react(EV.struck, { op: "mp", amount: share(0.05, "max_mp", "target"), to: TO.seat("soloist") })] }),
    ],
    "Barrage 1 ●●●, Toll ● ⚙ mana as armour (half)",
  );
}
{
  // Last in the order of healing past full: after the healed unit's own piece and the healer's. Held once by the side.
  const party = "Healing any ally receives past full goes to the ally with the lowest share of max HP that can be healed. Healing sent on this way isn't sent on again.";
  add(
    formation("Shared cup", "common", "Nobody's healing is wasted.", [
      ...twice({ name: "Drinker", text: "Lifesteal.", stats: [LIFESTEAL] }),
      { name: "Donor", text: "Its heals are a third bigger.", statuses: ["shared_cup_donor"] },
    ], { text: party, statuses: ["shared_cup"] }),
    [
      held("shared_cup_donor", "Donor", "Its heals are a third bigger.", { boosts: [{ tag: "healing", pct: 33 }] }),
      held("shared_cup", "Shared cup", party, {
        party: true,
        reactions: [reactIf(on("overhealed", { whose: "team" }), [{ unit: "owner", where: { lacks: OVERHEAL.own } }, { unit: "other", where: { lacks: OVERHEAL.given }, absent: true }],
          { op: "heal", amount: ofAmount(1), final: true, to: { side: "allies", where: { canHeal: true }, pick: "lowest", by: "hp_share" } })],
      }),
    ],
    "Pact 1 ●●●, Cuts ●● ⚙ brink (half)",
  );
}
add(
  formation("Shieldwall", "common", "One stands in front with its shield up; two stand behind it.", [
    { name: "Wall", text: "Draws far more. Defense up two steps.", stats: [st("aggro", 2), st("defense", 2)] },
    ...twice({ name: "Behind", text: "Draws less.", stats: [st("aggro", -1)] }),
  ]),
  [],
  "Toll ●●, Bonfire ●●, Storm ●●, Landslide ●●, Hunt ●, Barrage ●● ⚙ mirror (half), frozen gate (half)",
);
{
  const follower = "Its basic attacks add whatever statuses the Lead's basic attacks add to their target. They're added as its own would be: on the same condition, with stacks from the Follower's own stats, and never twice from one source. What it borrows isn't borrowed on by anyone else.";
  add(
    formation("The standard", "common", "Two follow the lead's colour.", [
      { name: "Lead", text: NOTHING },
      ...twice({ name: "Follower", text: follower, statuses: ["the_standard_follower"] }),
    ]),
    [held("the_standard_follower", "Follower", follower, { borrow: { from: TO.seat("lead") } })],
    "Bonfire 1 ●●●, Snap 1 ●●●, Storm 1 ●●●, Cuts 1 ●● ⚙ lead's colour (key)",
  );
}
{
  const party = "When each fight starts, every ally's ability nearest to ready is ready: the one with the least cooldown left, among those still cooling down.";
  add(
    formation("First light", "common", "Up before dawn.", thrice({ name: "Riser", text: NOTHING }), { text: party, statuses: ["first_light"] }),
    [held("first_light", "First light", party, { reactions: [atStart({ op: "cooldown", which: "soonest", set: "ready", to: "holder" })] })],
    "first move, Hunt ●●, Barrage ●●, Landslide ●",
  );
}
{
  const party = "Each time an ally dodges a hit, it gains a small Shield: a tenth of its max HP.";
  add(
    formation("Skirmish line", "common", "Three who'd rather not be hit at all.", thrice({ name: "Skirmisher", text: "Evasion up. Defense down.", stats: [EVASION, st("defense", -1)] }), { text: party, statuses: ["skirmish_line"] }),
    [held("skirmish_line", "Skirmish line", party, { reactions: [react(EV.dodge, give("shield", "holder", share(0.1, "max_hp")))] })],
    "Toll ●●, Cuts ●● ⚙ riposte (half)",
  );
}

// ─── Rare ────────────────────────────────────────────────────────────────────

{
  // The Smith's boosts read the unit that receives the heal or the Shield: the one in the Anvil's seat.
  const anvil = "Draws far more. Each hit it takes adds a Wrath to the Hammer.", smith = "Its heals and Shields on the Anvil are a third bigger.";
  const onAnvil: UnitCondT = { has: "hammer_and_anvil_anvil" };
  add(
    formation("Hammer and anvil", "rare", "Every blow the Anvil takes is saved for the Hammer.", [
      { name: "Anvil", text: anvil, stats: [st("aggro", 2)], statuses: ["hammer_and_anvil_anvil"] },
      { name: "Hammer", text: "Holds the Wrath (its next basic attack deals a fifth more for each Wrath, up to 10, and spends them)." },
      { name: "Smith", text: smith, statuses: ["hammer_and_anvil_smith"] },
    ]),
    [
      held("hammer_and_anvil_anvil", "Anvil", "Each hit it takes adds a Wrath to the Hammer.", { reactions: [react(EV.struck, give("wrath", TO.seat("hammer"), 1))] }),
      held("hammer_and_anvil_smith", "Smith", smith, { boosts: [{ tag: "healing", pct: against(33, onAnvil) }, { tag: "shield", pct: against(33, onAnvil) }] }),
    ],
    "Landslide 2 ●●●, Toll 2 ●●● ⚙ reckoning (key)",
  );
}
{
  const opener = "Its crits add many Bleed.", blade = "Each hit it lands on a bleeding foe heals the Blade for 3% of its max HP.";
  add(
    formation("Bloodied ground", "rare", "One opens them up; two drink from the wound.", [
      { name: "Opener", text: opener, statuses: ["bloodied_ground_opener"] },
      ...twice({ name: "Blade", text: blade, statuses: ["bloodied_ground_blade"] }),
    ]),
    [
      held("bloodied_ground_opener", "Opener", opener, { reactions: [react(EV.crit, give("bleed", "other", FLAT_STACKS.many))] }),
      held("bloodied_ground_blade", "Blade", blade, { reactions: [reactIf(EV.hit, { unit: "other", where: { has: "bleed" } }, { op: "heal", amount: share(0.03, "max_hp"), to: "holder" })] }),
    ],
    "Cuts 2 ●●●, Pact ●●",
  );
}
{
  const torch = "When a burning foe falls, all its Burn passes to the foe with the highest current HP. A fallen foe's fire moves once: if something else in the party moves it too, it's split evenly between them.";
  add(
    formation("Pyre line", "rare", "The fire outlives whatever it's burning.", [
      { name: "Keeper", text: "Taunts and is Guarded when each fight starts. Foes that hit it gain a few Burn.", statuses: ["pyre_line_keeper"] },
      { name: "Stoker", text: "Basic attacks a third faster.", stats: [THIRD_FASTER] },
      { name: "Torch", text: torch, statuses: ["pyre_line_torch"] },
    ]),
    [
      held("pyre_line_keeper", "Keeper", "Taunts and is Guarded when each fight starts. Foes that hit it gain a few Burn.", { reactions: [atStart(give("taunt"), give("guard")), react(EV.struck, give("burn", "other", FLAT_STACKS.few))] }),
      held("pyre_line_torch", "Torch", torch, { reactions: [{ on: on("status_ended", { status: "burn", cause: ["ko"], whose: "foe" }), split: "fire", do: [give("burn", { side: "foes", pick: "highest", by: "hp" }, ofAmount())] }] }),
    ],
    "Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)",
  );
}
{
  const rime = "Whatever Chill its abilities add, they add half again as much.", breaker = "When a foe's Chill shatters, its first-slotted ability is ready.";
  add(
    formation("Icefall", "rare", "Two lay frost, each its own way, and every shatter rings the third's great spell.", [
      { name: "Rime", text: rime, statuses: ["icefall_rime"] },
      { name: "Sleet", text: "Its basic attacks add a few Chill.", statuses: ["icefall_sleet"] },
      { name: "Breaker", text: breaker, statuses: ["icefall_breaker"] },
    ]),
    [
      held("icefall_rime", "Rime", rime, { mods: [{ stacks: { pct: 50, statuses: ["chill"] } }] }),
      held("icefall_sleet", "Sleet", "Its basic attacks add a few Chill.", { reactions: [react(EV.basic, give("chill", "other", FLAT_STACKS.few))] }),
      held("icefall_breaker", "Breaker", breaker, { reactions: [react(EV.shatter, { op: "cooldown", which: "first", set: "ready", to: "holder" })] }),
    ],
    "Snap 2 ●●●, Landslide ●●, Barrage ●●, Bonfire ● ⚙ shatter bell (key)",
  );
}
{
  const thunder = "Each ability it casts comes round a tenth sooner for each foe it hit.", squall = "Its basic attacks also hit every other foe that holds Shock, for a third as much. Those hits strike nothing further.";
  add(
    formation("Storm front", "rare", "The more foes one action touches, the more it pays.", [
      { name: "Thunderhead", text: thunder, statuses: ["storm_front_thunderhead"] },
      { name: "Squall", text: squall, statuses: ["storm_front_squall"] },
      { name: "Rod", text: "Draws far more. Foes that hit it gain a few Shock.", stats: [st("aggro", 2)], statuses: ["storm_front_rod"] },
    ]),
    [
      held("storm_front_thunderhead", "Thunderhead", thunder, { reactions: [react(EV.cast, { op: "cooldown", which: "event", set: { lessPct: { scale: [{ ratio: 10, count: "hit" }] } }, to: "holder" })] }),
      held("storm_front_squall", "Squall", squall, { strike: { to: { side: "foes", pick: "all", where: { has: "shock" }, exclude: "targets" }, share: 100 / 3, kind: "bonus" } }),
      held("storm_front_rod", "Rod", "Foes that hit it gain a few Shock.", { reactions: [react(EV.struck, give("shock", "other", FLAT_STACKS.few))] }),
    ],
    "Storm 2 ●●●, Barrage ●●, Toll ●● ⚙ resonance (key), red rain (half), goad (half)",
  );
}
{
  const lead = "While no foe is Marked, its hits Mark their target. A hit on several foes Marks the first it lands on.", mate = "Its hits on a Marked foe deal half again as much.";
  add(
    formation("The pack", "rare", "The pack takes them one at a time.", [
      { name: "Lead", text: lead, statuses: ["the_pack_lead"] },
      ...twice({ name: "Packmate", text: mate, statuses: ["the_pack_packmate"] }),
    ]),
    [
      held("the_pack_lead", "Lead", lead, { reactions: [reactIf(EV.hit, NO_MARK, give("marked", "other"))] }),
      held("the_pack_packmate", "Packmate", mate, { boosts: hits(against(50, { has: "marked" })) }),
    ],
    "Hunt 2 ●●● ⚙ judge's drum (half)",
  );
}
{
  // Each Collector lays what its swing carries on the foe that hit the Gate (two from one source add it once: the engine's).
  const collector = "A foe that hits the Gate gains whatever statuses this seat's basic attacks add to their target with every swing, in the stacks one swing adds. One that waits for a crit, a first hit or a count doesn't pass, and neither does one its swing borrows from another unit. Where both Collectors would add a status from one source, it's added once. What's added this way is never carried or spread again.";
  add(
    formation("Toll gate", "rare", "Whatever strikes the gate pays the other two's toll.", [
      { name: "Gate", text: "Draws far more. Guarded when each fight starts.", stats: [st("aggro", 2)], statuses: ["toll_gate_gate"] },
      ...twice({ name: "Collector", text: collector, statuses: ["toll_gate_collector"] }),
    ]),
    [
      held("toll_gate_gate", "Gate", "Guarded when each fight starts.", { reactions: [atStart(give("guard"))] }),
      held("toll_gate_collector", "Collector", collector, { reactions: [react(on("hit_taken", { whose: "team", seat: "gate" }), { op: "riders", plain: true, to: "other" })] }),
    ],
    "Toll 2 ●●●, Snap ●●, Storm ●●, Cuts ●●, Bonfire ● ⚙ frozen gate (key), goad (half), red rain (half)",
  );
}
{
  const soloist = "Each ability another ally casts takes a fifth off the cooldowns it has left.";
  const well = "Draws far more. Whenever the Soloist finishes a cast, the Well gains a Shield: a tenth of the Well's max HP.";
  add(
    formation("The stage", "rare", "Everything the other two cast brings the Soloist's spells round.", [
      { name: "Soloist", text: soloist, statuses: ["the_stage_soloist"] },
      { name: "Conductor", text: "Its abilities come round a third faster.", stats: [THIRD_SOONER] },
      { name: "Well", text: well, stats: [st("aggro", 2)], statuses: ["the_stage_well"] },
    ]),
    [
      held("the_stage_soloist", "Soloist", soloist, { reactions: [react(on("action_resolve", { kind: "ability", whose: "ally" }), { op: "cooldown", which: "abilities", set: { times: 80 }, to: "holder" })] }),
      held("the_stage_well", "Well", "Whenever the Soloist finishes a cast, the Well gains a Shield.", { reactions: [react(on("action_resolve", { kind: "ability", whose: "team", seat: "soloist" }), give("shield", "holder", share(0.1, "max_hp")))] }),
    ],
    "Barrage 2 ●●●, Toll ●",
  );
}
{
  // HP lost, not paid: a drawback (a drain fires no hp_paid), so no Shield soaks it and nothing reads it as a price.
  const bleeder = "Loses a little HP every tick: half a hundredth of its max HP, never below 1 HP. It isn't damage, so no Shield soaks it. Its hits deal half again as much.";
  const drinker = "Lifesteal, high. What its Lifesteal would heal past full becomes a Shield on it.", donor = "Its heals and Shields on the Bleeder are doubled.";
  const onBleeder: UnitCondT = { has: "blood_oath_bleeder" };
  add(
    formation("Blood oath", "rare", "One bleeds for power, one drinks, one pours life into the bleeder.", [
      { name: "Bleeder", text: bleeder, statuses: ["blood_oath_bleeder"] },
      { name: "Drinker", text: drinker, stats: [LIFESTEAL_HIGH], statuses: ["blood_oath_drinker"] },
      { name: "Donor", text: donor, statuses: ["blood_oath_donor"] },
    ]),
    [
      held("blood_oath_bleeder", "Bleeder", bleeder, { pulse: { every: 1, do: [{ op: "pay", hp: share(0.005, "max_hp"), drain: true, to: "holder" }] }, boosts: hits(50) }),
      held("blood_oath_drinker", "Drinker", "What its Lifesteal would heal past full becomes a Shield on it.", {
        reactions: [reactIf(on("overhealed", { status: "lifesteal" }), [{ unit: "owner", where: { lacks: OVERHEAL.own } }], give("shield", "holder", ofAmount(1)))],
      }),
      held("blood_oath_donor", "Donor", donor, { boosts: [{ tag: "healing", pct: against(100, onBleeder) }, { tag: "shield", pct: against(100, onBleeder) }] }),
    ],
    "Pact 2 ●●●, Landslide ● ⚙ brink (key), red stone (key)",
  );
}
{
  // Someone always stands in the light: Hidden's own rule (the engine's).
  const shadow = "Hidden when each fight starts, and again each time a foe falls. Someone always stands in the light: Hidden never lands where it would leave the foes no ally to pick, and if the Light falls while both Shadows are hidden, the later Shadow steps out.";
  add(
    formation("Decoy", "rare", "Two lurk in the dark; one stands in the light.", [
      { name: "Light", text: "Taunts and is Guarded when each fight starts.", statuses: ["decoy_light"] },
      ...twice({ name: "Shadow", text: shadow, statuses: ["decoy_shadow"] }),
    ]),
    [
      held("decoy_light", "Light", "Taunts and is Guarded when each fight starts.", { reactions: [atStart(give("taunt"), give("guard"))] }),
      held("decoy_shadow", "Shadow", "Hidden when each fight starts, and again each time a foe falls.", { reactions: [atStart(give("hidden")), react(EV.fall, give("hidden"))] }),
    ],
    "Toll ●●, Hunt ●●, Pact ● ⚙ two in the dark (key)",
  );
}
{
  const sentinel = "When an ally falls, it Taunts and is Guarded.", chaplain = "An ally it revives comes back Guarded, behind a Shield of a quarter of that ally's max HP.";
  const watcher = "When an ally falls, it gains a Shield: a quarter of its max HP.";
  add(
    formation("Vigil", "rare", "Nobody falls alone.", [
      { name: "Sentinel", text: sentinel, statuses: ["vigil_sentinel"] },
      { name: "Chaplain", text: chaplain, statuses: ["vigil_chaplain"] },
      { name: "Watcher", text: watcher, statuses: ["vigil_watcher"] },
    ]),
    [
      held("vigil_sentinel", "Sentinel", sentinel, { reactions: [react(EV.allyFall, give("taunt"), give("guard"))] }),
      held("vigil_chaplain", "Chaplain", chaplain, { reactions: [react(on("revived", { whose: "ally", other: "holder" }), give("guard", "owner"), give("shield", "owner", share(0.25, "max_hp", "target")))] }),
      held("vigil_watcher", "Watcher", watcher, { reactions: [react(EV.allyFall, give("shield", "holder", share(0.25, "max_hp")))] }),
    ],
    "net",
  );
}
{
  /** The Wheel's parts, each the next seat's: Wall → Blade → Well → Wall. */
  const PARTS = {
    wall: { name: "WALL", text: "Draws more. Defense up.", stats: [st("aggro", 1), st("defense", 1)], next: "blade" },
    blade: { name: "BLADE", text: "Basic attacks a fifth faster. Crits more.", stats: [FIFTH_FASTER, critSt(1)], next: "well" },
    well: { name: "WELL", text: "Regains MP in fights. Heals on it are stronger.", stats: [st("mp_regen", 1), STRONGER_HEALS], next: "wall" },
  } as const;
  /**
   * A part of the Wheel (it turns every so often, the first turn after half of that). Each seat starts the fight holding its
   * opening part; when a part runs out, its holder takes the next seat's part. On a revive its seat gives it its opening part again.
   */
  const part = (key: keyof typeof PARTS, opening: boolean): StatusT => {
    const p = PARTS[key];
    const sid = `the_wheel_${key}${opening ? "_opening" : ""}`;
    return {
      id: sid, name: p.name, text: p.text, label: "buff", show: "icon", stacking: "refresh", unremovable: true, duration: opening ? COOLDOWN.short / 2 : SO_OFTEN,
      stats: [...p.stats], reactions: [react(on("status_ended", { status: sid, cause: ["expired"] }), give(`the_wheel_${p.next}`))],
    } as StatusT;
  };
  add(
    formation("The wheel", "rare", "Every so often the wheel turns, and each unit takes the next seat's part.", [
      { name: "Wall", text: PARTS.wall.text, statuses: ["the_wheel_wall_opening"] },
      { name: "Blade", text: PARTS.blade.text, statuses: ["the_wheel_blade_opening"] },
      { name: "Well", text: PARTS.well.text, statuses: ["the_wheel_well_opening"] },
    ]),
    [part("wall", true), part("blade", true), part("well", true), part("wall", false), part("blade", false), part("well", false)],
    "exotic",
  );
}

// ─── Legendary ───────────────────────────────────────────────────────────────

{
  // The Foothills' larger Shields: every ally's Shields on a Foothill are a third bigger, its own included.
  const peak = "While every ally holds a Shield, itself included, each blow it lands, swing or ability, lands a second time: the same damage again on the same foe, at once. Nothing repeats the second landing.";
  const foothill = "Starts each fight behind a Shield: a fifth of its max HP. Every Shield it gains, that one included, is a third bigger.";
  add(
    formation("The mountain", "legendary", "While the whole party's stone holds, the Peak's blows land twice.", [
      { name: "Peak", text: peak, statuses: ["the_mountain_peak"] },
      ...twice({ name: "Foothill", text: foothill, statuses: ["the_mountain_foothill"] }),
    ], { statuses: ["the_mountain"] }),
    [
      held("the_mountain_peak", "Peak", peak, { reactions: [reactIf(on("hit_lands", { notTags: ["bare"] }), { side: "allies", where: { lacks: "shield" }, atMost: 0 }, { op: "strike", of: "dealt", to: "other" })] }),
      held("the_mountain_foothill", "Foothill", "Starts each fight behind a Shield: a fifth of its max HP.", { reactions: [atStart(give("shield", "holder", share(0.2, "max_hp")))] }),
      held("the_mountain", "The mountain", "Its Shields on a Foothill are a third bigger.", { boosts: [{ tag: "shield", pct: against(33, { has: "the_mountain_foothill" }) }] }),
    ],
    "Landslide 3 ●●● ⚙ detonation (half)",
  );
}
{
  // Each ally keeps its own copy of the party's count, fed by every ally's hits (one Cut an event).
  const party = "The party keeps one count of Cuts (a Cut for each hit it lands, kept for the fight, up to 25), and every ally's hits add to it. Every ally's hits start a fifth softer, and deal 3% more for each Cut.";
  add(
    formation("The whetstone", "legendary", "Every hit the party lands sharpens the next.", thrice({ name: "Blade", text: NOTHING }), { text: party, statuses: ["the_whetstone"] }),
    [held("the_whetstone", "The whetstone", party, { reactions: [react(on("hit_lands", { whose: "team" }), give("cuts", "holder", 1))], boosts: hits({ base: -20, scale: [{ ratio: 3, stacks: "cuts", of: "holder" }] }) })],
    "Cuts 3 ●●●, Storm ●●",
  );
}
{
  const party = "While any foe burns, every ally gains a Heat every 4 ticks (each acts 5% faster in everything for each Heat, up to 10, for the rest of the fight). Whenever an ally is Stunned or Silenced, the foe with the most Burn gains many Burn.";
  const stoke = (status: string) => react(on("status_gained", { status, whose: "team" }), give("burn", TO.mostFoe("burn"), FLAT_STACKS.many));
  add(
    formation("The forge", "legendary", "The longer the fire is kept, the faster the party feeds it.", thrice({ name: "Forgehand", text: NOTHING }), { text: party, statuses: ["the_forge", "the_forge_bellows"] }),
    [
      held("the_forge", "The forge", "While any foe burns, a Heat every 4 ticks.", { pulse: { every: FEW_TICKS, if: { side: "foes", where: { has: "burn" } }, do: [give("heat", "holder", 1)] } }),
      held("the_forge_bellows", "The forge's bellows", "Whenever an ally is Stunned or Silenced, the foe with the most Burn gains many Burn.", { party: true, reactions: [stoke("stun"), stoke("silence")] }),
    ],
    "Bonfire 3 ●●●",
  );
}
{
  // Held once by the side: the cold reads the Cascades before this shatter's, then every ally counts it. Passed, so a chain dies down.
  const party = "When a foe's Chill shatters, every other foe gains a few Chill, and a few more for each Cascade the party held before it (a Cascade for each shatter this fight, up to 10).";
  add(
    formation("The long winter", "legendary", "Every shatter sends its cold down the line, and each sends more than the last.", thrice({ name: "Winterer", text: NOTHING }), { text: party, statuses: ["the_long_winter"] }),
    [held("the_long_winter", "The long winter", party, {
      party: true,
      reactions: [
        react(EV.shatter, give("chill", TO.otherFoes("owner"), { base: FLAT_STACKS.few, scale: [{ ratio: FLAT_STACKS.few, stacks: "cascade", of: "holder" }] }, { passed: true })),
        react(EV.shatter, give("cascade", TO.everyAlly, 1)),
      ],
    })],
    "Snap 3 ●●● ⚙ firecracker (key)",
  );
}
{
  const bolt = "Its abilities deal 3% more for each Shock the foes hold. The Shock stays.", party = "Every ally's basic attacks add a few Shock, for the whole fight.";
  add(
    formation("Eye of the storm", "legendary", "The storm doesn't lift.", [
      { name: "Bolt", text: bolt, statuses: ["eye_of_the_storm_bolt"] },
      ...twice({ name: "Squall", text: NOTHING }),
    ], { text: party, statuses: ["eye_of_the_storm"] }),
    [
      held("eye_of_the_storm_bolt", "Bolt", bolt, { boosts: [{ tag: "ability", pct: { scale: [{ ratio: 3, count: { side: "foes", stacks: "shock" } }] } }] }),
      held("eye_of_the_storm", "Eye of the storm", party, { reactions: [react(EV.basic, give("shock", "other", FLAT_STACKS.few))] }),
    ],
    "Storm 3 ●●● ⚙ held charge (key), lead's colour (half)",
  );
}
{
  // Held once by the side: the Mark stands on the lowest foe, and the volley is called at the start and at each Marked foe's fall.
  const party = "While no foe is Marked, the foe with the lowest current HP is Marked. When each fight starts, and whenever a Marked foe falls, every ally's next basic attack comes at once. A swing already called gains nothing from a second call.";
  const mark = give("marked", TO.lowestHpFoe), volley = { op: "cooldown" as const, which: "basic" as const, set: "ready" as const, to: TO.everyAlly };
  add(
    formation("Open season", "legendary", "Every kill calls the party's weapons down again.", thrice({ name: "Hunter", text: NOTHING }), { text: party, statuses: ["open_season"] }),
    [held("open_season", "Open season", party, {
      party: true,
      reactions: [
        react(on("status_ended", { status: "marked", cause: ["ko"], whose: "foe" }), volley),
        reactIf(on("fight_start"), NO_MARK, mark),
        reactIf(on("status_ended", { status: "marked", whose: "foe" }), NO_MARK, mark),
        atStart(volley),
      ],
    })],
    "Hunt 3 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key)",
  );
}
{
  const wall = "Taunts all fight: its Taunt is laid again each time it runs out. Holds Spite (a Spite for each hit it takes, kept for the fight, up to 20).";
  const reaper = "Its hits deal 4% more for each Spite the Wall holds.";
  add(
    formation("The palisade", "legendary", "One is struck, two profit, more with every blow.", [
      { name: "Wall", text: wall, statuses: ["the_palisade_wall"] },
      ...twice({ name: "Reaper", text: reaper, statuses: ["the_palisade_reaper"] }),
    ]),
    [
      held("the_palisade_wall", "Wall", wall, { reactions: [...TAUNTS_ALL_FIGHT, react(EV.struck, give("spite", "holder", 1))] }),
      held("the_palisade_reaper", "Reaper", reaper, { boosts: hits({ scale: [{ ratio: 4, stacks: "spite", seat: "wall" }] }) }),
    ],
    "Toll 3 ●●●, Landslide ●",
  );
}
{
  const soloist = "Its first-slotted ability has no cooldown: it's cast again whenever there's the MP for it. Its wind-up, its cost and whatever it waits for stay.";
  const voice = "All MP it would regain in a fight goes to the Soloist instead, and isn't sent on again. Each cast the Soloist finishes gives this seat a Shield: a twentieth of its max HP.";
  add(
    formation("The cathedral", "legendary", "Two voices give all their mana to one, and it never stops singing.", [
      { name: "Soloist", text: soloist, statuses: ["the_cathedral_soloist"] },
      ...twice({ name: "Voice", text: voice, statuses: ["the_cathedral_voice"] }),
    ]),
    [
      held("the_cathedral_soloist", "Soloist", soloist, { mods: [{ of: { first: true }, cooldown: -100 }] }),
      held("the_cathedral_voice", "Voice", voice, {
        divert: { what: "mp", to: TO.seat("soloist") },
        reactions: [react(on("action_resolve", { kind: "ability", whose: "team", seat: "soloist" }), give("shield", "holder", share(0.05, "max_hp")))],
      }),
    ],
    "Barrage 3 ●●● ⚙ mana as armour (half), crescendo (half)",
  );
}
{
  const party = "Every ally's abilities cost HP in place of MP: half the share of its max HP that they'd cost of its max MP. No ally casts one that would leave it below a tenth of its max HP. Every ally has Lifesteal, high.";
  add(
    formation("The covenant", "legendary", "Life is the party's one currency.", thrice({ name: "Sworn", text: NOTHING }), { text: party, stats: [LIFESTEAL_HIGH], statuses: ["the_covenant"] }),
    [held("the_covenant", "The covenant", "Its abilities cost HP in place of MP: half the share, never below a tenth.", { mods: [{ hp: { pct: 50, share: true, floor: 10, instead: true } }] })],
    "Pact 3 ●●●, Barrage ●● ⚙ blood mage (key), brink (half)",
  );
}
{
  // What one Twin gives itself, shared with the other (a copy, so it isn't shared back).
  const twin = "Whatever status it gives itself, the other Twin gains too, in the same stacks: a status laid on it at a moment (a Taunt, a Haste, a Shield, a counter a card gives), not a state it holds while something is true of it. A status passed on this way isn't passed on again.";
  add(
    formation("Twins", "legendary", "Two are bound; what one gives itself, the other has too.", [
      ...twice({ name: "Twin", text: twin, statuses: ["twins_twin"] }),
      { name: "Odd one out", text: "Attack up two steps.", stats: [st("attack", 2)] },
    ]),
    [held("twins_twin", "Twin", twin, { reactions: [react(on("status_gained", { other: "holder", repeat: false }), { op: "share", to: { side: "others", where: { has: "twins_twin" }, pick: "all" } })] })],
    "exotic ⚙ borrowed gift (key), two in the dark (half)",
  );
}

// ─── The exports ─────────────────────────────────────────────────────────────

export const formations: FormationT[] = [neutral, ...formations_];

/** Every status behind a seat or a formation's effect. */
export const effects: StatusT[] = effects_;

/** Designer data, never in the pack: what each formation serves, from its Serves line. */
export const served: Served = served_;
