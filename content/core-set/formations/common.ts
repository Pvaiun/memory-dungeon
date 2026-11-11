/** The common formations. Each adds itself to kit.ts's lists. */
import type { StatusT, UnitCondT } from "../../../src/schema.js";
import { EV, FEW_TICKS, NO_MARK, SO_OFTEN, TAUNTS_ALL_FIGHT, TO, against, atStart, give, hits, ofAmount, on, react, reactIf, share } from "../pieces/kit.js";
import { OVERHEAL } from "../pieces/shared.js";
import { COOLDOWN, FLAT_STACKS } from "../scale.js";
import { CRITS_FAR_MORE, EVASION, FIFTH_FASTER, FIFTH_SOONER, LIFESTEAL, LIFESTEAL_HIGH, NOTHING, STRONGER_HEALS, THIRD_FASTER, THIRD_SOONER, THORNS, add, critSt, formation, held, st, thrice, twice } from "./kit.js";

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
  // A Chill a swing, not a few: two Frost seats at a few each, beside the riders, filled the counter in a couple of swings.
  const frost = "Basic attacks add a Chill.", breaker = "While a foe is Stunned, its basic attacks go to that foe. Its hits on a Stunned foe deal double.";
  add(
    formation("Hoarfrost line", "common", "Two lay frost with every blow; the third breaks what freezes.", [
      ...twice({ name: "Frost", text: frost, statuses: ["hoarfrost_line_frost"] }),
      { name: "Breaker", text: breaker, statuses: ["hoarfrost_line_breaker"] },
    ]),
    [
      held("hoarfrost_line_frost", "Frost", frost, { reactions: [react(EV.basic, give("chill", "other", FLAT_STACKS.one))] }),
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
      { name: "Well", text: "Draws more, and Taunts when each fight starts. Each hit it takes gives the Soloist MP: a hundredth of the Soloist's max MP.", stats: [st("aggro", 1)], statuses: ["wellspring_well"] },
    ]),
    [
      held("wellspring_conductor", "Conductor", conductor, { reactions: [react(EV.cast, { op: "mp", amount: share(0.1, "max_mp", "target"), to: TO.seat("soloist") })] }),
      held("wellspring_well", "Well", "Taunts when each fight starts. Each hit it takes gives the Soloist MP.", { reactions: [atStart(give("taunt")), react(EV.struck, { op: "mp", amount: share(0.01, "max_mp", "target"), to: TO.seat("soloist") })] }),
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
