/** The mythics of the other eight classes (Hexer to Geomancer): one per class, each rewriting how its class plays. Written with kit-2.ts. */
import type { NumT, ReactionT } from "../../../src/schema.js";
import { STATUS, SWING_REF, WEAPON } from "../scale.js";
import { type Build, type BuildTag, piece, pieceStatus } from "../pieces/kit.js";
import { T } from "../classes.js";
import { apply, both, builds, helper, kit, mythics, removeMine, tidy } from "./kit-2.js";

// ─── Mythics ─────────────────────────────────────────────────────────────────

/** A mythic weapon's hit at its own speed: a plain weapon's medium base and ratio, sized by its interval as every kind's is (kit.ts weaponHit). */
const ownHit = (cooldown: number, stat: string): NumT => {
  const f = cooldown / SWING_REF;
  return { base: Math.round(f * WEAPON.base.medium), scale: [{ ratio: f * WEAPON.ratio.medium, stat }] };
};
const mythic = (m: Parameters<typeof piece>[0], pulls: BuildTag[]) => {
  const g = tidy(piece(m));
  mythics.push(g);
  builds[g.id] = pulls;
};
const pull = (build: Build, worth: BuildTag["worth"], rung?: 3): BuildTag => ({ build, worth, ...(rung ? { rung } : {}) });

// Hexer: after each ability, three swings that hit every foe holding a debuff (an all-pick aim, each hit a basic attack's).
const WITCH_SWINGS = 3;
mythic({
  name: "The witch-blade", slot: "weapon", rarity: "mythic", mythic: "hexer",
  text: "After each ability the Hexer casts, its next three basic attacks hit every foe that holds a debuff.",
  weapon: { type: "magical", hands: 1, cooldown: 5.8, amount: ownHit(5.8, "magic") },
  statuses: ["the_witch_blade"],
}, [pull("snap", 3, 3), pull("harvest", 2)]);
helper(pieceStatus("the_witch_blade", "The witch-blade", "After each ability it casts, its next three basic attacks hit every foe that holds a debuff.", {
  // Each cast sets the count back to three; it doesn't add.
  reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [apply("the_witch_blade_swings", { stacks: WITCH_SWINGS, to: "self" })] }],
}));
helper(kit("the_witch_blade_swings", "THE WITCH-BLADE", "Its basic attacks hit every foe that holds a debuff.", {
  stacking: "intensity", cap: WITCH_SWINGS,
  aim: { rule: { side: "foes", where: { debuffs: true }, pick: "all" }, first: true },
  trigger: { on: { event: "action_resolve", kind: "basic" } }, drop: { count: 1 },
}));

// Monk: a Burn on every hit; every 5 ticks a Heat for each burning foe, up to three (three pulses, each with an `if`: at one, two and three).
const EMBER_EVERY = 5;
const emberHeat = (atLeast: number) => ({ every: EMBER_EVERY, if: { side: "foes" as const, where: { has: "burn" }, ...(atLeast > 1 ? { atLeast } : {}) }, do: [apply("heat", { stacks: 1, to: "holder" })] });
mythic({
  name: "Ember palms", slot: "weapon", rarity: "mythic", mythic: "monk",
  text: "Every hit the Monk lands adds a Burn. Every 5 ticks, it gains a Heat for each burning foe, up to three at a time.",
  weapon: { type: "physical", hands: 1, cooldown: 6.0, amount: ownHit(6.0, "attack") },
  statuses: ["ember_palms", "ember_palms_two", "ember_palms_three"],
}, [pull("bonfire", 3, 3), pull("cuts", 2)]);
helper(pieceStatus("ember_palms", "Ember palms", "Every hit it lands adds a Burn. Every 5 ticks, a Heat for each burning foe, up to three.", {
  reactions: [{ on: { event: "hit_lands" }, do: [apply("burn", { stacks: 1, to: "other" })] }],
  pulse: emberHeat(1),
}));
helper(pieceStatus("ember_palms_two", "Ember palms", "A second Heat while two foes burn.", { pulse: emberHeat(2) }));
helper(pieceStatus("ember_palms_three", "Ember palms", "A third Heat while three foes burn.", { pulse: emberHeat(3) }));

// Assassin: a killing blow it lands hides it, at Hidden's own length if it isn't Hidden already, and doubles its next hit.
mythic({
  name: "Night's edge", slot: "armor", rarity: "mythic", mythic: "assassin",
  text: "When the Assassin lands a killing blow, it's Hidden for a moment, and its next hit deals double damage.",
  statuses: ["nights_edge"],
}, [pull("hunt", 3, 3), pull("ambush", 2)]);
helper(pieceStatus("nights_edge", "Night's edge", "When it lands a killing blow, it's Hidden, and its next hit deals double damage.", {
  reactions: [{ on: { event: "ko", whose: "foe", other: "holder" }, do: [apply("hidden", { to: { side: "self", where: { lacks: "hidden" } } }), apply("nights_edge_strike", { to: "self" })] }],
}));
helper(kit("nights_edge_strike", "NIGHT'S EDGE", "Its next hit deals double damage.", {
  stacking: "fizzle", boosts: both(100),
  reactions: [{ on: { event: "hit_lands" }, do: [removeMine("nights_edge_strike")] }],
}));

// Vampire: each ally's fall heals it to full and adds a debt; each killing blow it lands while in debt raises a fallen ally (on cooldown).
mythic({
  name: "Thrall's chalice", slot: "offhand", rarity: "mythic", mythic: "vampire",
  text: "When an ally falls, the Vampire heals to full. The next time the Vampire lands a killing blow, a fallen ally rises with a quarter of its max HP.",
  statuses: ["thralls_chalice"],
}, [pull("phoenix", 3, 3), pull("pact", 2)]);
helper(pieceStatus("thralls_chalice", "Thrall's chalice", "When an ally falls, it heals to full, and the next killing blow it lands raises a fallen ally.", {
  reactions: [{
    on: { event: "ko", whose: "ally" },
    do: [{ op: "heal", amount: { scale: [{ ratio: 1, stat: "max_hp", of: "holder" }] }, to: "holder" }, apply("thralls_chalice_debt", { stacks: 1, to: "holder" })],
  }],
}));
const killBlow = { event: "ko" as const, whose: "foe" as const, other: "holder" as const };
helper(kit("thralls_chalice_debt", "THRALL'S CHALICE", "The next killing blow it lands raises a fallen ally.", {
  stacking: "intensity", unremovable: true,
  // The rise is a reaction (one a kill, at a quarter, never scaled by the debt); the trigger spends one debt on the same kill.
  reactions: [{ on: killBlow, do: [{ op: "revive", hp: { scale: [{ ratio: 0.25, stat: "max_hp", of: "target" }] }, to: T.koAlly }] }],
  trigger: { on: killBlow }, drop: { count: 1 },
}));

// Pyromancer: an aura on every ally that ends with the Pyromancer's knockout, given again when it or an ally is revived.
mythic({
  name: "Crown of embers", slot: "amulet", rarity: "mythic", mythic: "pyromancer",
  text: "While the Pyromancer stands, every ally's hits add a Burn.",
  statuses: ["crown_of_embers"],
}, [pull("bonfire", 3, 3)]);
helper(pieceStatus("crown_of_embers", "Crown of embers", "While it stands, every ally's hits add a Burn.", {
  reactions: [
    { on: { event: "fight_start" }, do: [apply("crown_of_embers_aura", { to: T.everyAlly })] },
    { on: { event: "revived" }, do: [apply("crown_of_embers_aura", { to: T.everyAlly })] },
    { on: { event: "revived", whose: "ally" }, do: [apply("crown_of_embers_aura", { to: "owner" })] },
  ],
}));
helper(kit("crown_of_embers_aura", "CROWN OF EMBERS", "Its hits add a Burn while the Pyromancer stands.", {
  perSource: { endsWithSource: true }, unremovable: true,
  reactions: [{ on: { event: "hit_lands" }, do: [apply("burn", { stacks: 1, to: "other" })] }],
}));

// Frostweaver: after a shatter spends a foe's Chill, half the cap goes back on (it listens for the end, cause removed, not the cap).
mythic({
  name: "Glacier's heart", slot: "armor", rarity: "mythic", mythic: "frostweaver",
  text: "Whenever a foe's Chill shatters, the Frostweaver puts half of it back: 6 Chill on that foe.",
  statuses: ["glaciers_heart"],
}, [pull("snap", 3, 3)]);
helper(pieceStatus("glaciers_heart", "Glacier's heart", "Whenever a foe's Chill shatters, 6 Chill go back on that foe.", {
  reactions: [{ on: { event: "status_ended", status: "chill", cause: ["removed"], whose: "foe" }, do: [apply("chill", { stacks: STATUS.chill.cap / 2, to: "owner" })] }],
}));

// Stormcaller: each basic attack's and ability's hit strikes one more random foe for half its raw damage (a reaction that strikes); the jump, an extra
// hit, doesn't jump again. A foe dying with Shock gives every other foe half of it (status_ended, cause ko, its amount).
mythic({
  name: "Eye of the tempest", slot: "weapon", rarity: "mythic", mythic: "stormcaller",
  text: "Every hit the Stormcaller lands jumps to one more random foe for half its damage. When a foe falls holding Shock, every other foe gains half of it.",
  weapon: { type: "magical", hands: 1, cooldown: 6.6, amount: ownHit(6.6, "magic") },
  statuses: ["eye_of_the_tempest"],
  note: "Only basic attacks' and abilities' hits jump. A jump is an extra hit, and a reaction to extra hits would hear its own jumps and loop, so Arc's and Double strike's extra strikes don't jump either.",
}, [pull("harvest", 3, 3)]);
const jump = (kind: "basic" | "ability"): ReactionT => ({ on: { event: "hit_lands", kind }, do: [{ op: "strike", share: 50, of: "hit", to: { side: "foes", pick: "random", exclude: "other" } }] });
helper(pieceStatus("eye_of_the_tempest", "Eye of the tempest", "Every hit it lands jumps to one more foe for half; a foe that falls with Shock gives every other foe half of it.", {
  reactions: [
    jump("basic"),
    jump("ability"),
    { on: { event: "status_ended", status: "shock", cause: ["ko"], whose: "foe" }, do: [apply("shock", { stacks: { scale: [{ ratio: 0.5, amount: true }] }, to: { side: "foes", pick: "all", exclude: "owner" } })] },
  ],
}));

// Geomancer: each crit it lands rebuilds its Shield by the damage dealt, up to the Shield's own cap.
mythic({
  name: "Mountain's crown", slot: "amulet", rarity: "mythic", mythic: "geomancer",
  text: "Each crit the Geomancer lands rebuilds its own Shield by the damage the crit dealt.",
  statuses: ["mountains_crown"],
}, [pull("landslide", 3, 3)]);
helper(pieceStatus("mountains_crown", "Mountain's crown", "Each crit it lands rebuilds its Shield by the damage dealt.", {
  reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [apply("shield", { stacks: { scale: [{ ratio: 1, amount: true }] }, to: "self" })] }],
}));
