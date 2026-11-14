/** The common formations. Each adds itself to kit.ts's lists. */
import type { StatusT, UnitCondT } from "../../../src/schema.js";
import { EV, FEW_TICKS, NO_MARK, SO_OFTEN, TAUNTS_ALL_FIGHT, TO, against, atStart, give, hits, lift, marker, ofAmount, on, react, reactIf, share, swingNow } from "../pieces/kit.js";
import { OVERHEAL } from "../pieces/shared.js";
import { COOLDOWN, FLAT_STACKS } from "../scale.js";
import { CRITS_FAR_MORE, EVASION, FIFTH_FASTER, FIFTH_SOONER, LIFESTEAL, LIFESTEAL_HIGH, NOTHING, STRONGER_HEALS, THIRD_FASTER, THIRD_SOONER, THORNS, add, critSt, formation, held, st, thrice, twice } from "./kit.js";

// ─── Common ──────────────────────────────────────────────────────────────────

{
  // The Hammer: Millstone's shape on a seat (Attack speed −100 is half as often).
  const hammer = "Basic attacks come 50% as often, for ×2.25 damage.", loader = `Each cast gives the Hammer ${FLAT_STACKS.few} Might.`;
  add(
    formation("Heavy line", "common", "One loads, one takes the blows, one strikes.", [
      { name: "Hammer", text: hammer, stats: [{ stat: "attack_speed", flat: -100 }], statuses: ["heavy_line_hammer"] },
      { name: "Anvil", text: "Draws far more. Defense up.", stats: [st("aggro", 2), st("defense", 1)] },
      { name: "Loader", text: loader, statuses: ["heavy_line_loader"] },
    ]),
    [
      held("heavy_line_hammer", "Hammer", hammer, { boosts: [{ tag: "basic", pct: 125 }] }),
      held("heavy_line_loader", "Loader", loader, { reactions: [react(EV.cast, give("might", TO.seat("hammer"), FLAT_STACKS.few))] }),
    ],
    "Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half)",
  );
}
add(
  formation("Spur", "common", "One opens the wound; two pour into it.", [
    { name: "Opener", text: "Crits far more often.", stats: [CRITS_FAR_MORE] },
    ...twice({ name: "Blade", text: "Basic attacks 20% faster.", stats: [FIFTH_FASTER] }),
  ]),
  [],
  "Cuts 1 ●●●, Bonfire ●, Storm ●, Snap ●",
);
{
  const keeper = "At fight start: Taunts and is Guarded.", torch = "Each hit adds a Burn to every burning foe.";
  add(
    formation("Hearth", "common", "One holds, one stokes, one spreads the fire.", [
      { name: "Keeper", text: keeper, statuses: ["hearth_keeper"] },
      { name: "Stoker", text: "At fight start: Hasted. Basic attacks 20% faster.", stats: [FIFTH_FASTER], statuses: ["hearth_stoker"] },
      { name: "Torch", text: torch, statuses: ["hearth_torch"] },
    ]),
    [
      held("hearth_keeper", "Keeper", keeper, { reactions: [atStart(give("taunt"), give("guard"))] }),
      held("hearth_stoker", "Stoker", "At fight start: Hasted.", { reactions: [atStart(give("haste"))] }),
      // Every hit it lands (basic attacks, abilities, extra strikes); Thorns and statuses aren't hits.
      held("hearth_torch", "Torch", torch, { reactions: [react(EV.hit, give("burn", { side: "foes", where: { has: "burn" }, pick: "all" }, FLAT_STACKS.one))] }),
    ],
    "Bonfire 1 ●●●, Toll ●",
  );
}
{
  // Each Archer marks the foe it last hit (its own marker, moved with each hit); the other Archer's basic attacks aim at it.
  const archer = "Basic attacks go to the foe the other Archer last hit, and deal +20% to it.";
  const archerOf = (me: "a" | "b") => {
    const them = me === "a" ? "b" : "a", mine = `crossfire_mark_${me}`, theirs = `crossfire_mark_${them}`;
    return held(`crossfire_archer_${me}`, "Archer", archer, {
      aim: { rule: { side: "foes", where: { has: theirs } } },
      boosts: [{ tag: "basic", pct: against(20, { has: theirs }) }],
      reactions: [react(EV.hit, lift(mine, TO.everyFoe, "marker"), give(mine, "other"))],
    });
  };
  add(
    formation("Crossfire", "common", "Two shoot where the other just struck; one draws the eye.", [
      { name: "Archer", text: archer, statuses: ["crossfire_archer_a"] },
      { name: "Archer", text: archer, statuses: ["crossfire_archer_b"] },
      { name: "Spotter", text: "Draws far more.", stats: [st("aggro", 2)] },
    ]),
    [archerOf("a"), archerOf("b"), marker("crossfire_mark_a", "Crossfire", "The first Archer's last target."), marker("crossfire_mark_b", "Crossfire", "The second Archer's last target.")],
    "Hunt 1 ●●, Cuts ● ◆ focus",
  );
}
{
  const squall = `Basic attacks add ${FLAT_STACKS.few} Shock and also hit a 2nd random foe for 50%, Shock included.`;
  add(
    formation("Squall line", "common", "Two charge the field; one draws the eye.", [
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
  // The Point marks the foe it last hit (one marker, moved with each hit); the Flanks' basic attacks on it hit harder.
  const point = "Draws far more.", flank = "Basic attacks on the foe the Point last hit deal +30%.";
  add(
    formation("Wedge", "common", "One drives in; two follow where it struck.", [
      { name: "Point", text: point, stats: [st("aggro", 2)], statuses: ["wedge_point"] },
      ...twice({ name: "Flank", text: flank, statuses: ["wedge_flank"] }),
    ]),
    [
      held("wedge_point", "Point", "Marks the foe it last hit for the Flanks.", { reactions: [react(EV.hit, lift("wedge_mark", TO.everyFoe, "marker"), give("wedge_mark", "other"))] }),
      held("wedge_flank", "Flank", flank, { boosts: [{ tag: "basic", pct: against(30, { has: "wedge_mark" }) }] }),
      marker("wedge_mark", "Wedge", "The Point's last target."),
    ],
    "Toll 1 ●●, Hunt ● ◆ focus, draw",
  );
}
{
  // The Shepherd covers the ally with the lowest HP%: every hit on it, whatever its size, moves to the Shepherd.
  const shepherd = "Takes the hits meant for the ally with the lowest HP%. Defense up.";
  add(
    formation("The shepherd", "common", "One stands over whoever is hurt most.", [
      { name: "Shepherd", text: shepherd, stats: [st("defense", 1)], statuses: ["the_shepherd_shepherd"] },
      ...twice({ name: "Flock", text: "Attack up.", stats: [st("attack", 1)] }),
    ]),
    [held("the_shepherd_shepherd", "Shepherd", "Takes the hits meant for the ally with the lowest HP%.", { cover: { share: 0, lowest: true } })],
    "Pact 1 ●●, Toll ● ◆ the net, the keeper",
  );
}
{
  const conductor = "Each cast gives the Soloist 10% of its max MP.";
  add(
    formation("Wellspring", "common", "Two keep one caster casting.", [
      { name: "Soloist", text: "Abilities deal +50% and come round 33% faster. Draws far less.", stats: [THIRD_SOONER, st("aggro", -2)], statuses: ["wellspring_soloist"] },
      { name: "Conductor", text: conductor, statuses: ["wellspring_conductor"] },
      { name: "Well", text: "Draws more. When hit: the Soloist gains 1% of its max MP.", stats: [st("aggro", 1)], statuses: ["wellspring_well"] },
    ]),
    [
      held("wellspring_soloist", "Soloist", "Abilities deal +50%.", { mods: [{ damage: 50 }] }),
      held("wellspring_conductor", "Conductor", conductor, { reactions: [react(EV.cast, { op: "mp", amount: share(0.1, "max_mp", "target"), to: TO.seat("soloist") })] }),
      held("wellspring_well", "Well", "When hit: the Soloist gains 1% of its max MP.", { reactions: [react(EV.struck, { op: "mp", amount: share(0.01, "max_mp", "target"), to: TO.seat("soloist") })] }),
    ],
    "Barrage 1 ●●●, Toll ● ⚙ mana as armour (half)",
  );
}
{
  // Last in the order of healing past full: after the healed unit's own piece and the healer's. Held once by the side.
  // Half the overflow, not all: with all of it, the first rung's lifesteal and heals undid every regular fight and elite of act I.
  const party = "50% of healing past full goes to the ally with the lowest HP%.";
  add(
    formation("Shared cup", "common", "Nobody's healing is wasted.", [
      ...twice({ name: "Cup", text: "Heals on it are 20% bigger.", stats: [STRONGER_HEALS] }),
      { name: "Donor", text: "Heals it gives are 33% bigger.", statuses: ["shared_cup_donor"] },
    ], { text: party, statuses: ["shared_cup"] }),
    [
      held("shared_cup_donor", "Donor", "Heals it gives are 33% bigger.", { boosts: [{ tag: "healing", pct: 33 }] }),
      held("shared_cup", "Shared cup", party, {
        party: true,
        reactions: [reactIf(on("overhealed", { whose: "team" }), [{ unit: "owner", where: { lacks: OVERHEAL.own } }, { unit: "other", where: { lacks: OVERHEAL.given }, absent: true }],
          { op: "heal", amount: ofAmount(0.5), final: true, to: { side: "allies", where: { canHeal: true }, pick: "lowest", by: "hp_share" } })],
      }),
    ],
    "Pact 1 ●●●, Cuts ●● ⚙ brink (half)",
  );
}
add(
  formation("Shieldwall", "common", "One shield up front; two behind it.", [
    { name: "Wall", text: "Draws far more. Defense up 2 steps.", stats: [st("aggro", 2), st("defense", 2)] },
    ...twice({ name: "Behind", text: "Draws less.", stats: [st("aggro", -1)] }),
  ]),
  [],
  "Toll ●●, Bonfire ●●, Storm ●●, Landslide ●●, Hunt ●, Barrage ●● ⚙ mirror (half), frozen gate (half)",
);
{
  const follower = "Basic attacks add what the Lead's basic attacks add, sized by its own stats.";
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
  const party = "At fight start: each ally's ability nearest to ready is ready.";
  add(
    formation("First light", "common", "Up before dawn.", thrice({ name: "Riser", text: NOTHING }), { text: party, statuses: ["first_light"] }),
    [held("first_light", "First light", party, { reactions: [atStart({ op: "cooldown", which: "soonest", set: "ready", to: "holder" })] })],
    "first move, Hunt ●●, Barrage ●●, Landslide ●",
  );
}
{
  const party = "An ally that dodges: its next basic attack comes at once.";
  add(
    formation("Skirmish line", "common", "Three who'd rather not be hit.", thrice({ name: "Skirmisher", text: "Evasion up. Defense down.", stats: [EVASION, st("defense", -1)] }), { text: party, statuses: ["skirmish_line"] }),
    [held("skirmish_line", "Skirmish line", party, { reactions: [react(EV.dodge, swingNow())] })],
    "Toll ●●, Cuts ●● ⚙ riposte (half) ◆ the dancer",
  );
}
