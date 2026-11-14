/** The legendary formations. Each adds itself to kit.ts's lists. */
import type { StatusT, UnitCondT } from "../../../src/schema.js";
import { EV, FEW_TICKS, NO_MARK, SO_OFTEN, TAUNTS_ALL_FIGHT, TO, against, atStart, give, hits, ofAmount, on, react, reactIf, share } from "../pieces/kit.js";
import { OVERHEAL } from "../pieces/shared.js";
import { COOLDOWN, FLAT_STACKS } from "../scale.js";
import { CRITS_FAR_MORE, EVASION, FIFTH_FASTER, FIFTH_SOONER, LIFESTEAL, LIFESTEAL_HIGH, NOTHING, STRONGER_HEALS, THIRD_FASTER, THIRD_SOONER, THORNS, add, critSt, formation, held, st, thrice, twice } from "./kit.js";

// ─── Legendary ───────────────────────────────────────────────────────────────

{
  // The Foothills' larger Shields: every ally's Shields on a Foothill are a third bigger, its own included.
  const peak = "While every ally holds a Shield, each hit lands twice.";
  const foothill = "At fight start: a Shield of 20% of its max HP. Shields on it are 33% bigger.";
  add(
    formation("The mountain", "legendary", "A peak that stands on the party's stone.", [
      { name: "Peak", text: peak, statuses: ["the_mountain_peak"] },
      ...twice({ name: "Foothill", text: foothill, statuses: ["the_mountain_foothill"] }),
    ], { statuses: ["the_mountain"] }),
    [
      held("the_mountain_peak", "Peak", peak, { reactions: [reactIf(on("hit_lands", { notTags: ["bare"] }), { side: "allies", where: { lacks: "shield" }, atMost: 0 }, { op: "strike", of: "dealt", to: "other" })] }),
      held("the_mountain_foothill", "Foothill", foothill, { reactions: [atStart(give("shield", "holder", share(0.2, "max_hp")))] }),
      held("the_mountain", "The mountain", "Its Shields on a Foothill are 33% bigger.", { boosts: [{ tag: "shield", pct: against(33, { has: "the_mountain_foothill" }) }] }),
    ],
    "Landslide 3 ●●● ⚙ detonation (half)",
  );
}
{
  // Each ally keeps its own copy of the party's count, fed by every ally's hits (one Edge an event).
  const party = "Every ally's hits add to one count of Edge (up to 25). Hits deal −20%, then +3% per Edge.";
  add(
    formation("The whetstone", "legendary", "Every hit the party lands sharpens the next.", thrice({ name: "Blade", text: NOTHING }), { text: party, statuses: ["the_whetstone"] }),
    [held("the_whetstone", "The whetstone", party, { reactions: [react(on("hit_lands", { whose: "team" }), give("edge", "holder", 1))], boosts: hits({ base: -20, scale: [{ ratio: 3, stacks: "edge", of: "holder" }] }) })],
    "Cuts 3 ●●●, Storm ●●",
  );
}
{
  const party = `While a foe burns, every ally gains a Heat every 4 ticks (5% faster each, up to 10). When an ally is Stunned or Silenced, the foe with the most Burn gains ${FLAT_STACKS.many} Burn.`;
  const stoke = (status: string) => react(on("status_gained", { status, whose: "team" }), give("burn", TO.mostFoe("burn"), FLAT_STACKS.many));
  add(
    formation("The forge", "legendary", "A kept fire quickens the party.", thrice({ name: "Forgehand", text: NOTHING }), { text: party, statuses: ["the_forge", "the_forge_bellows"] }),
    [
      held("the_forge", "The forge", "While a foe burns: a Heat every 4 ticks.", { pulse: { every: FEW_TICKS, if: { side: "foes", where: { has: "burn" } }, do: [give("heat", "holder", 1)] } }),
      held("the_forge_bellows", "The forge's bellows", `When an ally is Stunned or Silenced, the foe with the most Burn gains ${FLAT_STACKS.many} Burn.`, { party: true, reactions: [stoke("stun"), stoke("silence")] }),
    ],
    "Bonfire 3 ●●●",
  );
}
{
  // Held once by the side: the cold reads the Cascades before this shatter's, then every ally counts it. Passed, so a chain dies down.
  const party = "On a shatter: every other foe gains a Chill, +1 per 2 Cascades (one per shatter, up to 10).";
  add(
    formation("The long winter", "legendary", "Each shatter sends more cold down the line.", thrice({ name: "Winterer", text: NOTHING }), { text: party, statuses: ["the_long_winter"] }),
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
  const bolt = "Abilities deal +3% per Shock the foes hold.", party = `Every ally's basic attacks add ${FLAT_STACKS.few} Shock.`;
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
  const party = "A foe is always Marked: the one with the least HP. At fight start and when a Marked foe falls, every ally attacks at once.";
  const mark = give("marked", TO.lowestHpFoe), volley = { op: "cooldown" as const, which: "basic" as const, set: "ready" as const, to: TO.everyAlly };
  add(
    formation("Open season", "legendary", "Every kill calls the weapons down again.", thrice({ name: "Hunter", text: NOTHING }), { text: party, statuses: ["open_season"] }),
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
  const wall = "Taunts all fight. Gains a Spite each time it's hit (up to 20).";
  const reaper = "Hits deal +4% per Spite on the Wall.";
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
  const soloist = "Its first-slotted ability has no cooldown.";
  const voice = "MP it gains goes to the Soloist. When the Soloist casts: a Shield of 5% of its max HP.";
  add(
    formation("The cathedral", "legendary", "Two give their mana; one never stops singing.", [
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
  const party = "Every ally's abilities cost HP, not MP, and none casts below 10% HP. Every ally has Lifesteal.";
  add(
    formation("The covenant", "legendary", "Life is the party's one currency.", thrice({ name: "Sworn", text: NOTHING }), { text: party, stats: [LIFESTEAL], statuses: ["the_covenant"] }),
    [held("the_covenant", "The covenant", "Its abilities cost HP, not MP; it never casts below 10% HP.", { mods: [{ hp: { pct: 50, share: true, floor: 10, instead: true } }] })],
    "Pact 3 ●●●, Barrage ●● ⚙ blood mage (key), brink (half)",
  );
}
{
  // What one Twin gives itself, shared with the other (a copy, so it isn't shared back).
  const twin = "Statuses it gives itself, the other Twin gains too.";
  add(
    formation("Twins", "legendary", "Two are bound as one.", [
      ...twice({ name: "Twin", text: twin, statuses: ["twins_twin"] }),
      { name: "Odd one out", text: "Attack up two steps.", stats: [st("attack", 2)] },
    ]),
    [held("twins_twin", "Twin", twin, { reactions: [react(on("status_gained", { other: "holder", repeat: false }), { op: "share", to: { side: "others", where: { has: "twins_twin" }, pick: "all" } })] })],
    "exotic ⚙ borrowed gift (key), two in the dark (half)",
  );
}
