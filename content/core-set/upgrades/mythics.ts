/**
 * The 16 mythics, one per class: no stat steps, each rewriting how its class plays. A piece's text is its effect only: the
 * interface shows its slot and its one class. Each adds its piece to kit.ts's mythics, its statuses to its statuses, and
 * its Serves line (the loot pass's tags) to its served.
 */
import type { NumT } from "../../../src/schema.js";
import { HIT, KIND_SPEED, KIT, STATUS, swingAt } from "../scale.js";
import { countAt, count, own, piece, pieceStatus, serves, share, stacksOf, swingStacks, weaponHit } from "../pieces/kit.js";
import { T } from "../classes.js";
import { apply, both, helper, kit, marker, mythics, ofHolder, removeMine, served, tidy } from "./kit.js";

/*
 * A mythic weapon belongs to a kind its class wears, for how it's shown (its icon, how it's held, its swing's look); its
 * own speed, swing and hands stand over the kind's.
 */
/** A mythic weapon's hit at its own speed: a full, even swing, sized by its interval as every kind's is (scale.ts swingAt). */
const ownHit = (cooldown: number, stat: string): NumT => swingAt(cooldown, "full", "even", stat);
const mythic = (m: Parameters<typeof piece>[0], line: string) => {
  const g = tidy(piece(m));
  mythics.push(g);
  served[g.id] = serves(line);
};

// ─── Knight to Bard ──────────────────────────────────────────────────────────

// Knight: Horn of the keep. A status doesn't know which ability applied it, so any Taunt the Knight loses while another ally casts comes back.
mythic({ name: "Horn of the keep", slot: "offhand", rarity: "mythic", kind: "horn", mythic: "knight", statuses: ["horn_of_the_keep"],
    text: "When hit: the other ally with the lowest MP% gains half the damage as MP. A Taunt that ends during an ally's wind-up comes back." }, "Barrage 3 ●●●, Toll ●● ⚙ mana as armour (half)");
helper(pieceStatus("horn_of_the_keep", "Horn of the keep", "When hit: the other ally with the lowest MP% gains half the damage as MP. A Taunt that ends during an ally's wind-up comes back.", {
    reactions: [
      { on: { event: "hit_taken" }, do: [{ op: "mp", amount: { scale: [{ ratio: 0.5, amount: true }] }, to: { side: "others", pick: "lowest", by: "mp_share" } }] },
      { on: { event: "status_ended", status: "taunt", cause: ["expired"] }, if: { side: "others", where: { casting: true } }, do: [apply("taunt", { to: "holder" })] },
    ],
  }));

// Cleric: Halo of the saint. Each heal its abilities give (what it restored and what went past full) lands again on every
// other ally below half, and each Regen it gives is copied to them; a copy is a reaction's heal or a copy, so nothing copies it.
{
  const below = { side: "allies" as const, where: { hpBelow: 50 }, pick: "all" as const, exclude: "owner" as const };
  const again = { op: "heal" as const, amount: { scale: [{ ratio: 1, amount: true as const }] }, final: true as const, to: below };
  mythic({ name: "Halo of the saint", slot: "amulet", rarity: "mythic", mythic: "cleric", statuses: ["halo_of_the_saint"],
      text: "Its abilities' heals and Regen also land on every other ally below half HP." }, "Pact 3 ●●● ⚙ brink (half)");
  helper(pieceStatus("halo_of_the_saint", "Halo of the saint", "Its abilities' heals and Regen also land on every other ally below half HP.", {
      reactions: [
        { on: { event: "healed", whose: "team", other: "holder", kind: "ability" }, do: [again] },
        { on: { event: "overhealed", whose: "team", other: "holder", kind: "ability" }, do: [again] },
        { on: { event: "status_gained", status: "regen", whose: "team", other: "holder", repeat: false }, do: [apply("regen", { to: below, copy: true })] },
      ],
    }));
}

// Ranger: Huntmaster's quiver. Its abilities that aim at one foe re-aimed past any guard at the lowest HP, marking what they
// hit; a marked foe's fall readies every ability the Ranger has.
mythic({ name: "Huntmaster's quiver", slot: "armor", rarity: "mythic", kind: "leather", mythic: "ranger", statuses: ["huntmasters_quiver"],
    text: "Abilities aimed at one foe ignore Taunt and go to the foe with the least HP. When a foe they hit falls, they're ready again." }, "Hunt 3 ●●● ⚙ reaping (half)");
helper(pieceStatus("huntmasters_quiver", "Huntmaster's quiver", "Abilities aimed at one foe ignore Taunt and go to the foe with the least HP. When a foe they hit falls, they're ready again.", {
      mods: [{ of: { single: true }, target: T.lowestHpFoe, seek: true, apply: [{ status: "huntmasters_quiver_mark" }] }],
    }));
helper(marker("huntmasters_quiver_mark", "QUARRY", "Its fall readies the hunter's abilities.", {
      perSource: {}, survivesKO: true,
      reactions: [{ on: { event: "ko" }, actor: "source", do: [{ op: "cooldown", which: "abilities", set: "ready", to: "source" }] }],
    }));

// Bramble knight: Heartwood mail. Its Thorns on every attacker of an ally; the base Briar's Bleed follows them from here (the passive forms hear this status's damage themselves).
mythic({ name: "Heartwood mail", slot: "armor", rarity: "mythic", kind: "mail", mythic: "bramble_knight", statuses: ["heartwood_mail"],
    text: "Its Thorns strike whoever hits an ally." }, "Toll 3 ●●●, Cuts ●● ⚙ red rain (half)");
helper(pieceStatus("heartwood_mail", "Heartwood mail", "Its Thorns strike whoever hits an ally.", {
    reactions: [
      { on: { event: "hit_taken", whose: "ally" }, do: [{ op: "damage", type: "none", amount: ofHolder(1, "thorns"), to: "other" }] },
      { on: { event: "damage_dealt", status: "heartwood_mail" }, if: { side: "self", where: { has: "briar" } }, do: [apply("bleed", { stacks: own("few", "defense"), to: "other" })] },
    ],
  }));

// Hoplite: The last wall. An Aegis it gave that's spent (`source: holder`; its end carries the blocked amount and the attacker) strikes back in full, and Aspis is ready.
mythic({ name: "The last wall", slot: "offhand", rarity: "mythic", kind: "round_shield", mythic: "hoplite", statuses: ["the_last_wall"],
    text: "When an Aegis it gave blocks a blow, the attacker takes the blocked damage and Aspis is ready." }, "Toll 3 ●●●, Landslide ●● ⚙ mirror (key)");
helper(pieceStatus("the_last_wall", "The last wall", "When an Aegis it gave blocks a blow, the attacker takes the blocked damage and Aspis is ready.", {
    reactions: [{ on: { event: "status_ended", status: "aegis", cause: ["spent"], whose: "any", source: "holder" }, do: [
      { op: "damage", type: "none", amount: { scale: [{ ratio: 1, amount: true }] }, to: "other" },
      { op: "cooldown", which: { ability: ["aspis"] }, set: "ready", to: "holder" },
    ] }],
  }));

// Paladin: Writ of judgement. Condemn (every form, by name) calls a blow of its own on the foe it Marked, as it resolves.
mythic({ name: "Writ of judgement", slot: "offhand", rarity: "mythic", kind: "relic", mythic: "paladin", statuses: ["writ_of_judgement"],
    text: "When Condemn Marks a foe, a blow falls on it, adding Burn." }, "Hunt 3 ●●●, Bonfire ●●, Landslide ●●");
helper(pieceStatus("writ_of_judgement", "Writ of judgement", "When Condemn Marks a foe, a blow falls on it, adding Burn.", {
    reactions: [{ on: { event: "action_resolve", kind: "ability", ability: ["condemn"] }, do: [{ op: "strike", amount: share(HIT.heavy, "attack"), apply: [{ status: "burn", stacks: swingStacks("several") }], to: "other" }] }],
  }));

// Valkyrie: Stormspear. A weapon of its own: a spear's speed and swing, one hand. Every fourth hit it lands (the blow's own
// aside) calls Skyfall's blow on the foe with the most Shock, past any Taunt; the fourth pays before the count takes it.
{
  const counted = { event: "hit_lands" as const, notTags: ["stormspear"] };
  mythic({ name: "Stormspear", slot: "weapon", rarity: "mythic", mythic: "valkyrie", statuses: ["stormspear"],
      text: "Every 4th hit calls a blow on the foe with the most Shock, ignoring Taunt.",
      weapon: { kind: "spear", type: "physical", hands: 1, cooldown: KIND_SPEED.spear, amount: weaponHit("spear") } }, "Storm 3 ●●●, Hunt ● ⚙ held charge (key)");
  helper(pieceStatus("stormspear", "Stormspear", "Every 4th hit calls a blow on the foe with the most Shock, ignoring Taunt.", {
    reactions: [
      { on: counted, if: { side: "self", where: countAt("stormspear_count", 3) }, do: [{
        op: "strike", tag: "stormspear", seek: true, to: { side: "foes", pick: "highest", by: { stacks: "shock" } },
        amount: { scale: [{ ratio: HIT.heavy, stat: "attack", of: "holder" }, { ratio: KIT.skyfallPerShock, stacks: "shock", of: "target" }] },
      }] },
      { on: counted, do: [apply("stormspear_count", { stacks: 1, to: "holder" })] },
    ],
  }));
  helper(count("stormspear_count", "STORMSPEAR", "Every 4th hit calls a blow from above.", 4));
}

// Bard: Metronome. A count of the party's hits (extra strikes and each hit of a multi-hit ability included); at 20 the three songs are ready (by name) and the count is spent.
mythic({ name: "Metronome", slot: "offhand", rarity: "mythic", kind: "bell", mythic: "bard", statuses: ["metronome"],
    text: "Counts the party's hits. At 20, War ballad, Allegro and Encore are ready, and the count restarts." }, "Cuts 3 ●●●, Barrage ●●, Storm ● ⚙ spell on the swing (key)");
helper(pieceStatus("metronome", "Metronome", "Counts the party's hits. At 20, War ballad, Allegro and Encore are ready, and the count restarts.", {
      reactions: [
        { on: { event: "hit_lands" }, do: [apply("metronome_count", { to: "holder" })] },
        { on: { event: "hit_lands", whose: "ally" }, do: [apply("metronome_count", { to: "holder" })] },
        { on: { event: "status_capped", status: "metronome_count" }, do: [{ op: "cooldown", which: { ability: ["war_ballad", "allegro", "encore"] }, set: "ready", to: "holder" }, removeMine("metronome_count", "marker")] },
      ],
    }));
helper(marker("metronome_count", "BEAT", "The party's hits, counted to 20.", { show: "icon", stacking: "intensity", cap: 20 }));

// ─── Hexer to Geomancer ──────────────────────────────────────────────────────

// Hexer: after each ability, three swings that hit every foe holding a debuff (an all-pick aim, each hit a basic attack's).
const WITCH_SWINGS = 3;
mythic({
  name: "The witch-blade", slot: "weapon", rarity: "mythic", mythic: "hexer",
  text: "After each ability, its next 3 basic attacks hit every foe with a debuff.",
  weapon: { kind: "sword", type: "physical", hands: 1, cooldown: 5.8, amount: ownHit(5.8, "attack") },
  statuses: ["the_witch_blade"],
}, "Snap 3 ●●●, Bonfire ●●, Storm ●● ⚙ every colour (half), red rain (half)");
helper(pieceStatus("the_witch_blade", "The witch-blade", "After each ability, its next 3 basic attacks hit every foe with a debuff.", {
  // Each cast sets the count back to three; it doesn't add.
  reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [apply("the_witch_blade_swings", { stacks: WITCH_SWINGS, to: "self" })] }],
}));
helper(kit("the_witch_blade_swings", "THE WITCH-BLADE", "Basic attacks hit every foe with a debuff.", {
  stacking: "intensity", cap: WITCH_SWINGS,
  aim: { rule: { side: "foes", where: { debuffs: true }, pick: "all" }, first: true },
  trigger: { on: { event: "action_resolve", kind: "basic" } }, drop: { count: 1 },
}));

// Monk: Ember palms. Every hit it lands deals more for each Burn on the foe hit, added before boosts; the Burn stays.
mythic({
  name: "Ember palms", slot: "weapon", rarity: "mythic", mythic: "monk",
  text: "Hits deal extra damage for each Burn on the target.",
  weapon: { kind: "fist", type: "physical", hands: 1, cooldown: 6.0, amount: ownHit(6.0, "attack") },
  statuses: ["ember_palms"],
}, "Bonfire 3 ●●●, Cuts ●●");
helper(pieceStatus("ember_palms", "Ember palms", "Hits deal extra damage for each Burn on the target.", {
  adds: [{ on: "physical", amount: stacksOf("burn", 25, "target") }],
}));

// Assassin: a killing blow it lands hides it, at Hidden's own length if it isn't Hidden already, and doubles its next hit.
mythic({
  name: "Night's edge", slot: "armor", rarity: "mythic", mythic: "assassin",
  text: "On a kill: Hidden, and its next hit deals double.",
  statuses: ["nights_edge"],
}, "Hunt 3 ●●● ⚙ two in the dark (half)");
helper(pieceStatus("nights_edge", "Night's edge", "On a kill: Hidden, and its next hit deals double.", {
  reactions: [{ on: { event: "ko", whose: "foe", other: "holder" }, do: [apply("hidden", { to: { side: "self", where: { lacks: "hidden" } } }), apply("nights_edge_strike", { to: "self" })] }],
}));
helper(kit("nights_edge_strike", "NIGHT'S EDGE", "Next hit deals double.", {
  stacking: "fizzle", boosts: both(100),
  reactions: [{ on: { event: "hit_lands" }, do: [removeMine("nights_edge_strike")] }],
}));

// Vampire: The chalice. A per-source status on every other ally: their abilities' MP is paid in the Vampire's HP, half the
// share, while that leaves it above a tenth (the payer's floor); otherwise the ally pays its own MP.
{
  const lay = apply("the_chalice_cup", { to: { side: "others", pick: "all" } });
  mythic({
    name: "The chalice", slot: "offhand", rarity: "mythic", mythic: "vampire",
    text: "Other allies cast with its HP instead of their MP, while it stays above 10% HP.",
    statuses: ["the_chalice"],
  }, "Pact 3 ●●●, Barrage ●●● ⚙ blood mage (half), brink (key)");
  helper(pieceStatus("the_chalice", "The chalice", "Other allies cast with its HP instead of their MP, while it stays above 10% HP.", {
    reactions: [{ on: { event: "fight_start" }, do: [lay] }, { on: { event: "revived" }, do: [lay] }, { on: { event: "revived", whose: "ally" }, do: [apply("the_chalice_cup", { to: "owner" })] }],
  }));
  helper(kit("the_chalice_cup", "THE CHALICE", "Its abilities are paid in the Vampire's HP.", {
    show: "sheet", perSource: { endsWithSource: true }, unremovable: true,
    mods: [{ hp: { pct: 50, share: true, floor: 10, instead: true, payer: "source" } }],
  }));
}

// Pyromancer: an aura on every ally that ends with the Pyromancer's knockout, given again when it or an ally is revived.
mythic({
  name: "Crown of embers", slot: "amulet", rarity: "mythic", mythic: "pyromancer",
  text: "While it stands, every ally's hits add a Burn.",
  statuses: ["crown_of_embers"],
}, "Bonfire 3 ●●● ⚙ lead's colour (half)");
helper(pieceStatus("crown_of_embers", "Crown of embers", "While it stands, every ally's hits add a Burn.", {
  reactions: [
    { on: { event: "fight_start" }, do: [apply("crown_of_embers_aura", { to: T.everyAlly })] },
    { on: { event: "revived" }, do: [apply("crown_of_embers_aura", { to: T.everyAlly })] },
    { on: { event: "revived", whose: "ally" }, do: [apply("crown_of_embers_aura", { to: "owner" })] },
  ],
}));
helper(kit("crown_of_embers_aura", "CROWN OF EMBERS", "Hits add a Burn while the Pyromancer stands.", {
  perSource: { endsWithSource: true }, unremovable: true,
  reactions: [{ on: { event: "hit_lands" }, do: [apply("burn", { stacks: 1, to: "other" })] }],
}));

// Frostweaver: after a shatter spends a foe's Chill, a quarter of the cap goes back on (it listens for the end, cause removed, not
// the cap). At half, with a cascade, every shatter left a foe halfway to the next.
mythic({
  name: "Glacier's heart", slot: "armor", rarity: "mythic", mythic: "frostweaver",
  text: `When a foe's Chill shatters, ${STATUS.chill.cap / 4} Chill go back on it.`,
  statuses: ["glaciers_heart"],
}, "Snap 3 ●●● ⚙ firecracker (key)");
helper(pieceStatus("glaciers_heart", "Glacier's heart", `When a foe's Chill shatters, ${STATUS.chill.cap / 4} Chill go back on it.`, {
  reactions: [{ on: { event: "status_ended", status: "chill", cause: ["removed"], whose: "foe" }, do: [apply("chill", { stacks: STATUS.chill.cap / 4, to: "owner" })] }],
}));

// Stormcaller: every hit it lands strikes one more random foe for half its raw damage; the jump is tagged, so it doesn't jump
// again. A foe dying with Shock gives every other foe half of it (status_ended, cause ko, its amount).
mythic({
  name: "Eye of the tempest", slot: "weapon", rarity: "mythic", mythic: "stormcaller",
  text: "Every hit also jumps to a random foe for half. When a foe falls holding Shock, every other foe gains half of it.",
  weapon: { kind: "rune_sword", type: "physical", hands: 1, cooldown: 6.6, amount: ownHit(6.6, "attack") },
  statuses: ["eye_of_the_tempest"],
}, "Storm 3 ●●●");
helper(pieceStatus("eye_of_the_tempest", "Eye of the tempest", "Every hit also jumps to a random foe for half. When a foe falls holding Shock, every other foe gains half of it.", {
  reactions: [
    { on: { event: "hit_lands", notTags: ["jump"] }, do: [{ op: "strike", share: 50, of: "hit", tag: "jump", to: { side: "foes", pick: "random", exclude: "other" } }] },
    { on: { event: "status_ended", status: "shock", cause: ["ko"], whose: "foe" }, do: [apply("shock", { stacks: { scale: [{ ratio: 0.5, amount: true }] }, to: { side: "foes", pick: "all", exclude: "owner" } })] },
  ],
}));

// Geomancer: each crit it lands rebuilds its Shield by the damage dealt, up to the Shield's own cap.
mythic({
  name: "Mountain's crown", slot: "amulet", rarity: "mythic", mythic: "geomancer",
  text: "Each crit rebuilds its Shield by the damage dealt.",
  statuses: ["mountains_crown"],
}, "Landslide 3 ●●● ⚙ detonation (half)");
helper(pieceStatus("mountains_crown", "Mountain's crown", "Each crit rebuilds its Shield by the damage dealt.", {
  reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [apply("shield", { stacks: { scale: [{ ratio: 1, amount: true }] }, to: "self" })] }],
}));
