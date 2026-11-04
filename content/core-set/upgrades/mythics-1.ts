/** The mythics of the first eight classes (Knight to Bard): one per class, each rewriting how its class plays. Written with kit-1.ts. */
import type { GearT, StatusT } from "../../../src/schema.js";
import { type Builds, own, piece, pieceStatus, weaponHit } from "../pieces/kit.js";
import { T } from "../classes.js";
import { KIND_SPEED, stacks } from "../scale.js";
import { apply, marker, ofHolder, removeMarker } from "./kit-1.js";

// ═══ Mythics ═════════════════════════════════════════════════════════════════
// One per class, no stat steps. A piece's text is its effect only: the interface shows its slot and its one class.

export const mythicStatuses: StatusT[] = [];
export const mythicGear: GearT[] = [];
export const mythicBuilds: Builds = {};
function mythic(o: Omit<Parameters<typeof piece>[0], "rarity"> & { mythic: string }, own: StatusT[], tags: Builds[string]) {
  const g = piece({ ...o, rarity: "mythic" });
  mythicGear.push(g);
  mythicStatuses.push(...own);
  mythicBuilds[g.id] = tags;
}

// Knight: Horn of the keep. A status doesn't know which ability applied it, so any Taunt the Knight loses while another ally casts comes back.
mythic(
  { name: "Horn of the keep", slot: "offhand", kind: "horn", mythic: "knight", statuses: ["horn_of_the_keep"],
    text: "Every hit the Knight takes gives the other ally with the least MP a tenth of the hit's damage as MP. When the Knight's Taunt runs out while another ally is in a wind-up, it Taunts again." },
  [pieceStatus("horn_of_the_keep", "Horn of the keep", "Hits taken give an ally MP; a Taunt that runs out during an ally's wind-up comes back.", {
    reactions: [
      { on: { event: "hit_taken" }, do: [{ op: "mp", amount: { scale: [{ ratio: 0.1, amount: true }] }, to: { side: "others", pick: "lowest", by: "mp_share" } }] },
      { on: { event: "status_ended", status: "taunt", cause: ["expired"] }, if: { side: "others", where: { casting: true } }, do: [apply("taunt", { to: "holder" })] },
    ],
  })],
  [{ build: "overflow", rung: 3, worth: 3 }, { build: "toll", worth: 2 }],
);

// Cleric: Halo of the saint. A fallen unit can't hold a status, so the count is the Cleric's, filled by `overhealed` while an ally is down.
mythic(
  { name: "Halo of the saint", slot: "amulet", mythic: "cleric", statuses: ["halo_of_the_saint"],
    text: "While an ally is knocked out, the part of the Cleric's heals that would go past full is kept. When it reaches a quarter of the Cleric's max HP, a fallen ally stands with that much." },
  [
    pieceStatus("halo_of_the_saint", "Halo of the saint", "Keeps its overhealing while an ally is down, to raise it.", {
      reactions: [
        { on: { event: "overhealed", whose: "any", other: "holder" }, if: { side: "allies", where: { ko: true } }, do: [apply("halo_of_the_saint_kept", { stacks: { scale: [{ ratio: 1, amount: true }] }, to: "holder" })] },
        { on: { event: "status_capped", status: "halo_of_the_saint_kept" }, do: [
          { op: "revive", hp: { scale: [{ ratio: 1, stacks: "halo_of_the_saint_kept", of: "holder" }] }, to: T.koAlly },
          removeMarker("halo_of_the_saint_kept"),
        ] },
      ],
    }),
    marker("halo_of_the_saint_kept", "HALO", "Healing kept for a fallen ally.", { show: "icon", stacking: "intensity", cap: ofHolder(0.25, "max_hp") }),
  ],
  [{ build: "phoenix", rung: 3, worth: 3 }],
);

// Ranger: Huntmaster's quiver. Its abilities re-aimed past any guard at the lowest HP (an ability change on every ability the Ranger has), marking what they hit; a marked foe's fall halves the Ranger's cooldowns left.
mythic(
  { name: "Huntmaster's quiver", slot: "armor", kind: "leather", mythic: "ranger", statuses: ["huntmasters_quiver"],
    text: "All the Ranger's abilities aim past any guard at the foe with the lowest HP. When a foe one of them hit falls, the cooldowns left on its abilities are halved." },
  [
    pieceStatus("huntmasters_quiver", "Huntmaster's quiver", "Its abilities aim past any guard at the lowest foe; a kill on a foe they hit halves its cooldowns left.", {
      mods: [{ target: T.lowestHpFoe, seek: true, apply: [{ status: "huntmasters_quiver_mark" }] }],
    }),
    marker("huntmasters_quiver_mark", "QUARRY", "Hit by the Huntmaster's quiver: its fall halves the hunter's cooldowns left.", {
      perSource: {}, survivesKO: true,
      reactions: [{ on: { event: "ko" }, actor: "source", do: [{ op: "cooldown", which: "abilities", set: { times: 50 }, to: "source" }] }],
    }),
  ],
  [{ build: "hunt", rung: 3, worth: 3 }],
);

// Bramble knight: Heartwood mail. Its Thorns on every attacker of an ally; the base Briar's Bleed follows them from here (the passive forms hear this status's damage themselves).
mythic(
  { name: "Heartwood mail", slot: "armor", kind: "mail", mythic: "bramble_knight", statuses: ["heartwood_mail"],
    text: "Whenever a hit lands on any ally, the Bramble knight's Thorns strike the attacker too." },
  [pieceStatus("heartwood_mail", "Heartwood mail", "Its Thorns strike whoever hits an ally.", {
    reactions: [
      { on: { event: "hit_taken", whose: "ally" }, do: [{ op: "damage", type: "none", amount: ofHolder(1, "thorns"), to: "other" }] },
      { on: { event: "damage_dealt", status: "heartwood_mail" }, if: { side: "self", where: { has: "briar" } }, do: [apply("bleed", { stacks: own("few", "armor"), to: "other" })] },
    ],
  })],
  [{ build: "toll", rung: 3, worth: 3 }],
);

// Hoplite: The last wall. An Aegis it gave that's spent (`source: holder`; its end carries the blocked amount and the attacker) strikes back in full, and Aspis is ready.
mythic(
  { name: "The last wall", slot: "offhand", kind: "round_shield", mythic: "hoplite", statuses: ["the_last_wall"],
    text: "When an Aegis the Hoplite gave blocks a blow, the attacker takes the blocked damage, and Aspis is ready again at once." },
  [pieceStatus("the_last_wall", "The last wall", "A blow its Aegis blocks is struck back, and Aspis is ready.", {
    reactions: [{ on: { event: "status_ended", status: "aegis", cause: ["spent"], whose: "any", source: "holder" }, do: [
      { op: "damage", type: "none", amount: { scale: [{ ratio: 1, amount: true }] }, to: "other" },
      { op: "cooldown", which: { ability: ["aspis"] }, set: "ready", to: "holder" },
    ] }],
  })],
  [{ build: "toll", rung: 3, worth: 2 }, { build: "bonfire", rung: 3, worth: 2 }],
);

// Paladin: Chains of light. Smite (every form) Silences what it hits (an ability change by name); hits on a Stunned or Silenced foe heal the lowest ally for half.
mythic(
  { name: "Chains of light", slot: "offhand", kind: "lantern", mythic: "paladin", statuses: ["chains_of_light"],
    text: "Smite also Silences its target. The Paladin's hits on a Stunned or Silenced foe heal the ally with the lowest share of HP for half the damage dealt." },
  [pieceStatus("chains_of_light", "Chains of light", "Smite Silences; hits on a Stunned or Silenced foe heal the lowest ally.", {
    mods: [{ of: { ability: ["smite"] }, apply: [{ status: "silence" }] }],
    reactions: [{ on: { event: "hit_lands" }, if: { unit: "other", where: { hasAny: ["stun", "silence"] } }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.5, amount: true }] }, to: T.lowestShareAlly }] }],
  })],
  [{ build: "lockdown", rung: 3, worth: 3 }, { build: "pact", worth: 1 }],
);

// Valkyrie: Stormspear. A weapon of its own: the rune sword's speed, magical, one hand; damage at medium from Attack; a Gale spear hit's Shock; Seek on basic attacks.
mythic(
  { name: "Stormspear", slot: "weapon", mythic: "valkyrie", statuses: ["stormspear"],
    text: "A medium, magical, one-handed spear. Its basic attacks scale from Attack, ignore Taunt, and add a few Shock.",
    weapon: { type: "magical", hands: 1, cooldown: KIND_SPEED.rune_sword, amount: weaponHit("rune_sword", "medium", "medium", "attack"), apply: [{ status: "shock", stacks: stacks("few", "attack", 0.5) }] } },
  [pieceStatus("stormspear", "Stormspear", "Basic attacks ignore Taunt.", { seek: "basic" })],
  [{ build: "cuts", rung: 3, worth: 2 }, { build: "hunt", rung: 3, worth: 2 }],
);

// Bard: Metronome. A count of the party's hits (extra strikes and each hit of a multi-hit ability included); at 20 the three songs are ready (by name) and the count is spent.
mythic(
  { name: "Metronome", slot: "offhand", kind: "horn", mythic: "bard", statuses: ["metronome"],
    text: "Counts every hit the party lands. At 20, War ballad, Allegro and Thunder chord are ready at once, and the count starts again." },
  [
    pieceStatus("metronome", "Metronome", "Counts the party's hits; at 20, its songs are ready.", {
      reactions: [
        { on: { event: "hit_lands" }, do: [apply("metronome_count", { to: "holder" })] },
        { on: { event: "hit_lands", whose: "ally" }, do: [apply("metronome_count", { to: "holder" })] },
        { on: { event: "status_capped", status: "metronome_count" }, do: [{ op: "cooldown", which: { ability: ["war_ballad", "allegro", "thunder_chord"] }, set: "ready", to: "holder" }, removeMarker("metronome_count")] },
      ],
    }),
    marker("metronome_count", "BEAT", "The party's hits, counted to 20.", { show: "icon", stacking: "intensity", cap: 20 }),
  ],
  [{ build: "cuts", rung: 3, worth: 3 }],
);
