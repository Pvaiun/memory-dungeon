/**
 * The 16 mythics, one per class, each spiky: it takes one thing on its class's trunk (what every build of the class does) to an
 * extreme that changes how the fight plays, never only a bigger number and never a job the class doesn't do, with a cost only
 * where the cost is the identity (docs/gear-design/loot.md, Mythics). Each carries a rare's stat steps beside its effect
 * (scale.ts KIND_BUDGET), chosen for it, checked as any piece's are: a weapon its kind's, every other slot the standard. A
 * piece's text is its effect only: the interface shows its slot, its stats and its one class. Each adds its piece to kit.ts's
 * mythics, its statuses to its statuses, and its Serves line to its served.
 */
import type { EffectT, ReactionT, ToT } from "../../../src/schema.js";
import { KIND_SPEED, P } from "../scale.js";
import { EV, TO, atStart, critStep, give, lift, oneUse, on, own, piece, pieceStatus, react, reactIf, serves, sp, st, stacksOf, weaponHit, whileHolding } from "../pieces/kit.js";
import { AFFLICTIONS } from "../pieces/shared.js";
import { helper, kit, marker, mythics, served, tidy } from "./kit.js";

const mythic = (m: Parameters<typeof piece>[0], line: string) => {
  const g = tidy(piece(m));
  mythics.push(g);
  served[g.id] = serves(line);
};
/** The mythic's own status, on the sheet, saying what the card says. */
const own_ = (id: string, name: string, text: string, body: Parameters<typeof pieceStatus>[3]) => helper(pieceStatus(id, name, text, body));
const ready = (ability: string, to: ToT = "holder"): EffectT => ({ op: "cooldown", which: { ability: [ability] }, set: "ready", to }) as EffectT;

// ─── Knight to Bard ──────────────────────────────────────────────────────────

// Knight: its body, which Vanguard's Shield and Shield bash already read, doubled; it lives on its own stone, not on heals.
{
  const text = "Max HP doubled. Healing on it is halved.";
  mythic({ name: "Banner of the last keep", slot: "armor", rarity: "mythic", kind: "plate", mythic: "knight", statuses: ["banner_of_the_last_keep"],
    stats: [st("aggro", 1), st("defense", 1), sp("cooldown", "medium")], text }, "Toll 3 ●●, Landslide ●● ◆ draw, the wall");
  own_("banner_of_the_last_keep", "Banner of the last keep", text, { stats: [{ stat: "max_hp", pct: 100 }, { stat: "healing_received", flat: -50 }] });
}

// Cleric: Last rites (its state, whichever form trains it) put on at the start and put back whenever anything lifts it; a
// healing cap at 30% keeps it on the brink, so every form's own line reads it as below.
{
  const text = "Last rites holds all fight. It can't be healed above 30% HP.";
  mythic({ name: "The saint's last breath", slot: "amulet", rarity: "mythic", mythic: "cleric", statuses: ["the_saints_last_breath"],
    stats: [sp("cast_speed", "medium"), st("mp_regen", 1), st("max_mp", 1)], text }, "Pact 3 ●●● ◆ the brink, tempo");
  own_("the_saints_last_breath", "The saint's last breath", text, {
    healCap: 30,
    reactions: [atStart(give("last_rites_on")), react(on("status_ended", { status: "last_rites_on", cause: ["removed", "expired"] }), give("last_rites_on"))],
  });
}

// Ranger: one foe watched until it falls. The watched foe holds the Ranger's marker (an aim picks it); each landed swing on it
// adds a Watch, and a swing that lands on another foe (the first, or the next after a fall) moves the marker and spends them.
{
  const text = "Basic attacks stay on one foe until it falls, each 10% harder than the last.";
  mythic({ name: "The long watch", slot: "armor", rarity: "mythic", kind: "leather", mythic: "ranger", statuses: ["the_long_watch"],
    stats: [sp("accuracy", "medium"), critStep(1), st("attack", 1)], text }, "Hunt 3 ●●● ◆ focus, the boss game");
  own_("the_long_watch", "The long watch", text, {
    aim: { rule: { side: "foes", where: { has: "the_long_watch_prey" } }, first: true },
    reactions: [
      reactIf(EV.basic, { unit: "other", where: { lacks: "the_long_watch_prey" } }, lift("the_long_watch_prey", TO.everyFoe, "marker"), { op: "spend", status: "the_long_watch_count", to: "holder" }, give("the_long_watch_prey", "other")),
      react(EV.basic, give("the_long_watch_count", "holder", 1)),
    ],
  });
  helper(marker("the_long_watch_prey", "WATCHED", "The Ranger's basic attacks stay on it.", { show: "icon", perSource: {} }));
  helper(kit("the_long_watch_count", "THE LONG WATCH", "Basic attacks deal +10% for each.", { stacking: "intensity", cap: 15, unremovable: true, boosts: [{ tag: "basic", pct: { scale: [{ ratio: 10, stacks: "the_long_watch_count", of: "holder" }] } }] }));
}

// Bramble knight: every hit it takes sends its Thorns into every foe, the attacker's own Thorns as ever; Briar's Bleed follows them.
{
  const text = "When hit, its Thorns strike every foe.";
  mythic({ name: "Heart of the briar", slot: "armor", rarity: "mythic", kind: "plate", mythic: "bramble_knight", statuses: ["heart_of_the_briar"],
    stats: [st("max_hp", 2), sp("thorns", "medium")], text }, "Toll 3 ●●●, Cuts ● ◆ the mirror, spread");
  own_("heart_of_the_briar", "Heart of the briar", text, {
    reactions: [
      react(EV.struck, { op: "damage", type: "none", amount: { scale: [{ ratio: 1, stat: "thorns", of: "holder" }] }, to: TO.otherFoes("other") }),
      reactIf(on("damage_dealt", { status: "heart_of_the_briar" }), { side: "self", where: { has: "briar" } }, give("bleed", "other", own("few", "defense"))),
    ],
  });
}

// Hoplite: the shove its rhythm, the swing waiting.
{
  const text = "Othismos comes round twice as often, with no wind-up. Basic attacks come half as often again.";
  mythic({ name: "The last shove", slot: "offhand", rarity: "mythic", kind: "round_shield", mythic: "hoplite", statuses: ["the_last_shove"],
    stats: [st("defense", 1), st("attack", 1), sp("cooldown", "medium")], text }, "Landslide 3 ●●, Toll ● ◆ spread, the heavy action");
  own_("the_last_shove", "The last shove", text, { mods: [{ of: { ability: ["othismos"] }, cooldown: -50, cast: 0 }], stats: [{ stat: "attack_speed", flat: -100 }] });
}

// Paladin: Judgement made absolute, on top of whatever form of it the Paladin trained: +150% where it reads a buff or a debuff
// (with its own +50%, triple), and −50% on a foe with neither.
{
  const text = "Hits deal triple damage to a foe with a buff or a debuff, and half to a foe with neither.";
  mythic({ name: "Scales of the judge", slot: "amulet", rarity: "mythic", mythic: "paladin", statuses: ["scales_of_the_judge"],
    stats: [st("attack", 1), sp("accuracy", "medium"), st("max_hp", 1)], text }, "Hunt 3 ●●, Bonfire ●, Storm ● ◆ the judge");
  own_("scales_of_the_judge", "Scales of the judge", text, {
    boosts: [{ tag: "physical", pct: { base: -50, scale: [{ ratio: 200, when: { debuffs: true }, of: "target" }, { ratio: 200, when: { buffs: true, debuffs: false }, of: "target" }] } }],
  });
}

// Valkyrie: a spear of its kind's own swing; each Gale spear readies Skyfall (its MP still asked).
{
  const text = "Each Gale spear readies Skyfall.";
  mythic({ name: "Valhalla's spear", slot: "weapon", rarity: "mythic", kind: "spear", mythic: "valkyrie", statuses: ["valhallas_spear"],
    stats: [sp("cooldown", "medium"), st("attack", 1), critStep(1)], text,
    weapon: { kind: "spear", type: "physical", hands: 1, cooldown: KIND_SPEED.spear, amount: weaponHit("spear") } }, "Storm 3 ●●● ◆ the storm spear");
  own_("valhallas_spear", "Valhalla's spear", text, { reactions: [react(on("action_resolve", { kind: "ability", ability: ["gale_spear"] }), ready("skyfall"))] });
}

// Bard: the three songs cast as one (an ability change that waits for all three and casts the others with the first).
{
  const text = "War ballad, Allegro and Encore are cast together, as one, whenever the slowest of them is ready.";
  mythic({ name: "The grand chord", slot: "offhand", rarity: "mythic", kind: "bell", mythic: "bard", statuses: ["the_grand_chord"],
    stats: [st("max_mp", 1), sp("cooldown", "medium"), st("defense", 1)], text }, "Barrage 3 ●●, Landslide ●, Cuts ● ◆ party tempo");
  own_("the_grand_chord", "The grand chord", text, { mods: [{ of: { ability: ["war_ballad", "allegro", "encore"] }, together: true }] });
}

// ─── Hexer to Geomancer ──────────────────────────────────────────────────────

// Hexer: breadth as the curse's clock. A foe's first stack of an affliction readies Malison; a marker on the foe, one an
// affliction, lifted as the affliction ends, keeps it to the first.
{
  const text = "Malison is ready whenever a foe gains an affliction it didn't hold.";
  const seen = (a: string) => `the_witchs_cauldron_${a}`;
  const reactions: ReactionT[] = AFFLICTIONS.flatMap((a) => [
    reactIf(on("status_gained", { status: a, whose: "foe" }), { unit: "owner", where: { lacks: seen(a) } }, ready("malison"), give(seen(a), "owner")),
    react(on("status_ended", { status: a, whose: "foe" }), lift(seen(a), "owner", "marker")),
  ]);
  mythic({ name: "The witch's cauldron", slot: "offhand", rarity: "mythic", kind: "tome", mythic: "hexer", statuses: ["the_witchs_cauldron"],
    stats: [st("mp_regen", 1), st("max_mp", 1), sp("siphon", "medium")], text }, "Barrage 3 ●●, Bonfire ●, Snap ●, Storm ●, Cuts ● ◆ every colour");
  own_("the_witchs_cauldron", "The witch's cauldron", text, { reactions });
  for (const a of AFFLICTIONS) helper(marker(seen(a), "Cauldron", "Already counted for the witch's cauldron.", { perSource: {} }));
}

// Monk: the blur, certain: one more strike after every basic attack, beside any Double strike.
{
  const text = "Every basic attack strikes twice.";
  mythic({ name: "Thousand-palm wraps", slot: "weapon", rarity: "mythic", kind: "fist", mythic: "monk", statuses: ["thousand_palm_wraps"],
    stats: [sp("attack_speed", "medium"), st("attack", 1), sp("lifesteal", "medium")], text,
    weapon: { kind: "fist", type: "physical", hands: 1, cooldown: KIND_SPEED.fist, amount: weaponHit("fist") } }, "Cuts 3 ●●● ◆ extra strikes");
  own_("thousand_palm_wraps", "Thousand-palm wraps", text, { strike: { to: "target" } });
}

// Assassin: the glass dagger, perfect until touched; each fight it starts untouched.
{
  const text = "Until it's first hit in a fight, every hit it lands crits.";
  mythic({ name: "The unseen blade", slot: "armor", rarity: "mythic", kind: "leather", mythic: "assassin", statuses: ["the_unseen_blade"],
    stats: [sp("evasion", "medium"), sp("crit_damage", "medium"), st("attack", 1)], text }, "Hunt 3 ●●●, Cuts ● ◆ crits, first strike");
  own_("the_unseen_blade", "The unseen blade", text, { reactions: [atStart(give("the_unseen_blade_on")), react(EV.struck, lift("the_unseen_blade_on"))] });
  helper(kit("the_unseen_blade_on", "UNSEEN", "Every hit it lands crits.", { stacking: "fizzle", crits: [{ chance: 100 }] }));
}

// Vampire: the drinker swells: what its healing would bring past full raises its max HP by as much, and its HP with it.
{
  const text = "Healing past full raises its max HP by as much, for the fight.";
  mythic({ name: "The crimson crown", slot: "amulet", rarity: "mythic", mythic: "vampire", statuses: ["the_crimson_crown"],
    stats: [st("max_hp", 2), st("attack", 1)], text }, "Pact 3 ●●● ◆ the drinker");
  own_("the_crimson_crown", "The crimson crown", text, { reactions: [react(on("overhealed"), give("the_crimson_crown_blood", "holder", { scale: [{ ratio: 1 / P, amount: true }] }))] });
  helper(kit("the_crimson_crown_blood", "CRIMSON CROWN", "Max HP up by its stacks.", { stacking: "intensity", unremovable: true, stats: [{ stat: "max_hp", flat: P }] }));
}

// Pyromancer: Pyre doubles the fire it lands on (stacks read off the foe hit, after the hit).
{
  const text = "Pyre adds as much Burn as its target holds.";
  mythic({ name: "The pyre-heart", slot: "amulet", rarity: "mythic", mythic: "pyromancer", statuses: ["the_pyre_heart"],
    stats: [sp("cast_speed", "medium"), st("attack", 1), st("max_hp", 1)], text }, "Bonfire 3 ●●● ◆ the long cast");
  own_("the_pyre_heart", "The pyre-heart", text, { mods: [{ of: { ability: ["pyre"] }, apply: [{ status: "burn", stacks: stacksOf("burn", 1, "target") }] }] });
}

// Frostweaver: a shatter, anyone's, readies Frost lance and makes its next cast free; Chill to rebuild between is the brake.
{
  const text = "Each shatter readies Frost lance, and its next cast is free.";
  mythic({ name: "Heart of the deep winter", slot: "armor", rarity: "mythic", kind: "robes", mythic: "frostweaver", statuses: ["heart_of_the_deep_winter"],
    stats: [st("max_mp", 1), st("defense", 1), sp("cooldown", "medium")], text }, "Snap 3 ●●● ◆ the shatter's beat");
  own_("heart_of_the_deep_winter", "Heart of the deep winter", text, { reactions: [react(EV.shatter, ready("frost_lance"), give("heart_of_the_deep_winter_free"))] });
  helper(oneUse("heart_of_the_deep_winter_free", "DEEP WINTER", "Next Frost lance is free.", on("action_resolve", { kind: "ability", ability: ["frost_lance"] }), { mods: [{ of: { ability: ["frost_lance"] }, mp: -100 }] }));
}

// Stormcaller: the storm doesn't lift. Each of Thunderstorm's forms' storms that it gave, ending on its time, is given again.
{
  const text = "Thunderstorm lasts until the fight ends.";
  const storms = ["thunderstorm_storm", "static_field", "storms_eye"].flatMap((s) => [s, `${s}_plus`]);
  mythic({ name: "Eye of the gale", slot: "weapon", rarity: "mythic", kind: "fist", mythic: "stormcaller", statuses: ["eye_of_the_gale"],
    stats: [sp("attack_speed", "medium"), sp("double_strike", "medium"), st("max_mp", 1)], text,
    weapon: { kind: "fist", type: "physical", hands: 1, cooldown: KIND_SPEED.fist, amount: weaponHit("fist") } }, "Storm 3 ●●● ◆ the party's storm");
  own_("eye_of_the_gale", "Eye of the gale", text, { reactions: storms.map((s) => react(on("status_ended", { status: s, whose: "team", source: "holder", cause: ["expired"] }), give(s, "owner"))) });
}

// Geomancer: behind stone, certain.
{
  const text = "While its Shield holds, every hit it lands crits.";
  mythic({ name: "Bedrock heart", slot: "amulet", rarity: "mythic", mythic: "geomancer", statuses: ["bedrock_heart"],
    stats: [st("defense", 1), sp("crit_damage", "medium"), st("max_hp", 1)], text }, "Landslide 3 ●●● ◆ crits behind stone");
  own_("bedrock_heart", "Bedrock heart", text, { reactions: whileHolding("bedrock_heart_on", "shield") });
  helper(kit("bedrock_heart_on", "BEDROCK HEART", "Every hit it lands crits.", { stacking: "fizzle", crits: [{ chance: 100 }] }));
}

