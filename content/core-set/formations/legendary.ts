/** The legendary formations. Each adds itself to kit.ts's lists. */
import type { StatusT, UnitCondT } from "../../../src/schema.js";
import { EV, FEW_TICKS, NO_MARK, SO_OFTEN, TAUNTS_ALL_FIGHT, TO, against, atStart, give, hits, ofAmount, on, react, reactIf, share } from "../pieces/kit.js";
import { OVERHEAL } from "../pieces/shared.js";
import { COOLDOWN, FLAT_STACKS } from "../scale.js";
import { CRITS_FAR_MORE, EVASION, FIFTH_FASTER, FIFTH_SOONER, LIFESTEAL, LIFESTEAL_HIGH, NOTHING, STRONGER_HEALS, THIRD_FASTER, THIRD_SOONER, THORNS, add, critSt, formation, held, st, thrice, twice } from "./kit.js";

// ─── Legendary ───────────────────────────────────────────────────────────────

{
  // The Foothills' larger Shields: every ally's Shields on a Foothill are a third bigger, its own included.
  const peak = "While every ally holds a Shield, itself included, each blow it lands, swing or ability, lands a second time: the same damage again on the same foe, at once. Nothing repeats the second landing.";
  const foothill = "Starts each fight behind a Shield: 20% of its max HP. Every Shield it gains, that one included, is 33% bigger.";
  add(
    formation("The mountain", "legendary", "While the whole party's stone holds, the Peak's blows land twice.", [
      { name: "Peak", text: peak, statuses: ["the_mountain_peak"] },
      ...twice({ name: "Foothill", text: foothill, statuses: ["the_mountain_foothill"] }),
    ], { statuses: ["the_mountain"] }),
    [
      held("the_mountain_peak", "Peak", peak, { reactions: [reactIf(on("hit_lands", { notTags: ["bare"] }), { side: "allies", where: { lacks: "shield" }, atMost: 0 }, { op: "strike", of: "dealt", to: "other" })] }),
      held("the_mountain_foothill", "Foothill", "Starts each fight behind a Shield: 20% of its max HP.", { reactions: [atStart(give("shield", "holder", share(0.2, "max_hp")))] }),
      held("the_mountain", "The mountain", "Its Shields on a Foothill are 33% bigger.", { boosts: [{ tag: "shield", pct: against(33, { has: "the_mountain_foothill" }) }] }),
    ],
    "Landslide 3 ●●● ⚙ detonation (half)",
  );
}
{
  // Each ally keeps its own copy of the party's count, fed by every ally's hits (one Cut an event).
  const party = "The party keeps one count of Cuts (a Cut for each hit it lands, kept for the fight, up to 25), and every ally's hits add to it. Every ally's hits start 20% softer, and deal 3% more for each Cut.";
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
  const party = "When a foe's Chill shatters, every other foe gains a Chill, and one more for every two Cascades the party held before it (a Cascade for each shatter this fight, up to 10).";
  add(
    formation("The long winter", "legendary", "Every shatter sends its cold down the line, and each sends more than the last.", thrice({ name: "Winterer", text: NOTHING }), { text: party, statuses: ["the_long_winter"] }),
    [held("the_long_winter", "The long winter", party, {
      party: true,
      reactions: [
        react(EV.shatter, give("chill", TO.otherFoes("owner"), { base: FLAT_STACKS.one, scale: [{ ratio: FLAT_STACKS.one / 2, stacks: "cascade", of: "holder" }] }, { passed: true })),
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
  const voice = "All MP it would regain in a fight goes to the Soloist instead, and isn't sent on again. Each cast the Soloist finishes gives this seat a Shield: 5% of its max HP.";
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
  // Lifesteal at the medium step: high, on every ally and every swing, besides casting free of MP, put it 20 points over Neutral.
  const party = "Every ally's abilities cost HP in place of MP: 50% of the share of its max HP that they'd cost of its max MP. No ally casts one that would leave it below 10% of its max HP. Every ally has Lifesteal.";
  add(
    formation("The covenant", "legendary", "Life is the party's one currency.", thrice({ name: "Sworn", text: NOTHING }), { text: party, stats: [LIFESTEAL], statuses: ["the_covenant"] }),
    [held("the_covenant", "The covenant", "Its abilities cost HP in place of MP: 50% of the share, never below 10%.", { mods: [{ hp: { pct: 50, share: true, floor: 10, instead: true } }] })],
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
