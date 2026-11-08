/**
 * The seven kinds whose swing grows with Attack (even or Attack-heavy, scale.ts KIND_WORDS): dagger, claws, sword, spear, axe, bow and
 * great weapon, 56 pieces. No balancing rules, statuses at their own length. Hooks are the engine's primitives (PRIMITIVES.md).
 * Each kind's pieces carry its budget of stat steps at every rarity (kit.ts budgetOf), leaning to the kind's profile: its signature
 * stat and its commons (steps/class-identity: Weapon kinds). A piece that steps along the trade says so on its card ("a heavy...").
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `builds` is designer data, never in the pack.
 */
import type { EffectT, GearT, NumT, ReactionT, StatusT, ToT, UnitCondT } from "../../../src/schema.js";
import { HIT, P, STACKS, type StackWord } from "../scale.js";
import { critStep, idOf, own, piece, pieceStatus, sp, st, weaponHit, type Build, type Builds, type BuildTag } from "./kit.js";

// ─── Small helpers ───────────────────────────────────────────────────────────

/** Stacks from the wearer's Attack on its weapon's own hit (an action: the swinging unit is `self`). */
const swingStacks = (word: StackWord): NumT => ({ scale: [{ ratio: STACKS[word] / P, stat: "attack", of: "self" }] });
const bothTags = (pct: NumT) => [{ tag: "physical", pct }];
/** "+pct% against a foe that passes `when`": a boost that reads the unit being hit. */
const against = (pct: number, when: UnitCondT): NumT => ({ scale: [{ ratio: pct, when, of: "target" }] });
const apply = (status: string, to: ToT, stacks?: NumT): EffectT => ({ op: "apply", status, ...(stacks !== undefined ? { stacks } : {}), to });
const removeBuff = (status: string): EffectT => ({ op: "remove", label: "buff", status, to: "holder" });
const onStart = (...effects: EffectT[]): ReactionT => ({ on: { event: "fight_start" }, do: effects });
/** A helper status: a buff a piece turns on and off itself (so not unremovable), shown on the unit sheet. */
const helper = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "sheet", stacking: "refresh", ...body }) as StatusT;
/** A kill the holder's own hit landed. */
const killBlow = { event: "ko" as const, whose: "foe" as const, other: "holder" as const };

/** A Builds line, as written ("Cuts 2 ●●●, Hunt 1, Toll ●"): a rung with no dots is worth ● there. */
const BUILD_NAMES: Record<string, Build> = {
  landslide: "landslide", cuts: "cuts", bonfire: "bonfire", snap: "snap", hunt: "hunt", harvest: "harvest",
  ambush: "ambush", overflow: "overflow", lockdown: "lockdown", toll: "toll", pact: "pact", phoenix: "phoenix",
};
function tags(line: string): BuildTag[] {
  return line.split(",").map((part) => {
    const m = part.trim().match(/^(\w+)\s*([123])?\s*(●*)$/);
    if (!m || !BUILD_NAMES[m[1].toLowerCase()]) throw new Error(`a Builds line the parser can't read: '${part}'`);
    const worth = (m[3].length || 1) as 1 | 2 | 3;
    return { build: BUILD_NAMES[m[1].toLowerCase()], ...(m[2] ? { rung: Number(m[2]) as 1 | 2 | 3 } : {}), worth };
  });
}

const gearList: GearT[] = [];
const statusList: StatusT[] = [];
const buildMap: Builds = {};
/** One piece: its gear, the statuses behind it, and its Builds line. */
function add(g: GearT, sts: StatusT[], line: string) {
  gearList.push(g);
  statusList.push(...sts);
  buildMap[g.id] = tags(line);
}

// ─── Dagger (Ranger, Assassin): fast, one hand; light, Attack-heavy, standard. Crit chance; Attack speed, Evasion, Crit damage, Attack ──

add(piece({ name: "Keen dirk", kind: "dagger", slot: "weapon", rarity: "common", text: "Crit chance +2.", stats: [critStep(2)] }), [], "Cuts 1, Hunt 1, Ambush 1");

add(piece({ name: "Parrying dagger", kind: "dagger", slot: "weapon", rarity: "common", text: "Evasion medium, Attack speed medium.", stats: [sp("evasion", "medium"), sp("attack_speed", "medium")] }), [], "Cuts 1, Toll ●");

{
  // Once the foe holds the mark, a reaction's `if` skips the whole reaction, so later hits make no empty Bleed application.
  // The mark is a marker: no Cleanse or Dispel lifts it.
  const id = idOf("Weeping kris"), mark = `${id}_mark`;
  add(
    piece({ name: "Weeping kris", kind: "dagger", slot: "weapon", rarity: "uncommon", text: "Crit chance +1. Its first hit on each foe adds a few Bleed (from Attack).", stats: [critStep(1)], statuses: [id] }),
    [
      pieceStatus(id, "Weeping kris", "Its first hit on each foe adds a few Bleed.", {
        reactions: [{ on: { event: "hit_lands" }, if: { unit: "other", where: { lacks: mark } }, do: [apply("bleed", "other", own("few", "attack")), apply(mark, "other")] }],
      }),
      { id: mark, name: "Wept", text: "The Weeping kris has opened its wound.", label: "marker", show: "sheet", stacking: "refresh", perSource: {} },
    ],
    "Cuts 1, Hunt 1, Ambush ●",
  );
}

add(
  piece({ name: "Misericorde", kind: "dagger", slot: "weapon", rarity: "uncommon", text: "Attack +1. Its basic attacks ignore Taunt.", stats: [st("attack", 1)], statuses: ["misericorde"] }),
  [pieceStatus("misericorde", "Misericorde", "Its basic attacks ignore Taunt.", { seek: "basic" })],
  "Hunt 1, Ambush 1, Lockdown ●",
);

add(
  piece({ name: "Notched knife", kind: "dagger", slot: "weapon", rarity: "rare", text: "Attack speed medium. Its basic attacks and extra strikes add a few Bleed (from Attack).", stats: [sp("attack_speed", "medium")], weapon: { apply: [{ status: "bleed", stacks: swingStacks("few") }] } }),
  [],
  "Cuts 2 ●●●, Hunt 2 ●●, Toll ●",
);

add(
  piece({ name: "Marking knife", kind: "dagger", slot: "weapon", rarity: "rare", text: "Attack +1. Its basic attacks Mark their target.", stats: [st("attack", 1)], weapon: { apply: [{ status: "marked" }] } }),
  [],
  "Hunt 2 ●●●, Cuts ●",
);

add(
  piece({ name: "Thousandth cut", kind: "dagger", slot: "weapon", rarity: "legendary", text: "Attack speed medium. Each hit it lands adds a Cut, kept for the rest of the fight, up to 25. Its hits deal 2% more for each Cut.", stats: [sp("attack_speed", "medium")], statuses: ["thousandth_cut"] }),
  [pieceStatus("thousandth_cut", "Thousandth cut", "Each hit it lands adds a Cut.", { reactions: [{ on: { event: "hit_lands" }, do: [apply("cuts", "self", 1)] }] })],
  "Cuts 3 ●●●, Snap ●●, Hunt ●",
);

add(
  piece({ name: "Quietus", kind: "dagger", slot: "weapon", rarity: "legendary", text: "Crit damage medium. Its hits on a foe that hasn't acted yet this fight always crit, and those crits add twice the usual bonus.", stats: [sp("crit_damage", "medium")], statuses: ["quietus"] }),
  // A crit rule on a foe that hasn't `acted`.
  [pieceStatus("quietus", "Quietus", "Its hits on a foe that hasn't acted yet always crit, for twice the usual bonus.", { crits: [{ when: { acted: false }, chance: 100, bonus: 100 }] })],
  "Ambush 3 ●●●, Hunt ●●",
);

// ─── Claws (Monk, Vampire, Stormcaller): fast, one hand; light, even, standard. Double strike; Attack speed, Lifesteal, Evasion ──

add(piece({ name: "Mantis claws", kind: "claws", slot: "weapon", rarity: "common", text: "Double strike medium, Evasion medium.", stats: [sp("double_strike", "medium"), sp("evasion", "medium")] }), [], "Cuts 1, Toll ●");

add(piece({ name: "Red talons", kind: "claws", slot: "weapon", rarity: "common", text: "Lifesteal medium, Attack speed medium.", stats: [sp("lifesteal", "medium"), sp("attack_speed", "medium")] }), [], "Pact 1, Cuts ●");

add(
  piece({ name: "Wildcat claws", kind: "claws", slot: "weapon", rarity: "uncommon", text: "Evasion medium. Hasted when each fight starts.", stats: [sp("evasion", "medium")], statuses: ["wildcat_claws"] }),
  [pieceStatus("wildcat_claws", "Wildcat claws", "Hasted when each fight starts.", { reactions: [onStart(apply("haste", "holder"))] })],
  "Cuts 1, Ambush 1, Bonfire ●, Snap ●",
);

add(
  piece({ name: "Brass knuckles", kind: "claws", slot: "weapon", rarity: "uncommon", text: "Double strike medium. Its extra strikes add a few Sunder (from Attack).", stats: [sp("double_strike", "medium")], statuses: ["brass_knuckles"] }),
  [pieceStatus("brass_knuckles", "Brass knuckles", "Its extra strikes add a few Sunder.", { reactions: [{ on: { event: "hit_lands", kind: "extra" }, do: [apply("sunder", "other", own("few", "attack"))] }] })],
  "Cuts 1, Hunt ●, Landslide ●",
);

add(
  piece({ name: "Rime knuckles", kind: "claws", slot: "weapon", rarity: "rare", text: "Attack speed medium. Its basic attacks and extra strikes add a few Chill (from Attack).", stats: [sp("attack_speed", "medium")], weapon: { apply: [{ status: "chill", stacks: swingStacks("few") }] } }),
  [],
  "Snap 2 ●●●, Cuts ●, Lockdown ●",
);

{
  // Bloodlust's pattern: switched on by losing HP below half, off by healing to half or more.
  const id = "gorged_claws", on = `${id}_on`;
  add(
    piece({ name: "Gorged claws", kind: "claws", slot: "weapon", rarity: "rare", text: "Lifesteal medium. Below half HP, its basic attacks come a third faster.", stats: [sp("lifesteal", "medium")], statuses: [id] }),
    [
      pieceStatus(id, "Gorged claws", "Below half HP, its basic attacks come a third faster.", {
        reactions: [
          { on: { event: "hp_lost" }, do: [apply(on, { side: "self", where: { hpBelow: 50 } })] },
          { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: on, to: { side: "self", where: { hpAtLeast: 50 } } }] },
        ],
      }),
      { id: on, name: "GORGED", text: "Basic attacks a third faster.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "attack_speed", flat: 33 }] },
    ],
    "Pact 2 ●●●, Cuts ●●, Phoenix ●",
  );
}

add(
  piece({ name: "Flurry wraps", kind: "claws", slot: "weapon", rarity: "legendary", text: "Double strike medium. Its extra strikes can strike again: each one rolls Double strike for one more, at most two more after the first, and each is a fifth weaker than the strike before it.", stats: [sp("double_strike", "medium")], statuses: ["flurry_wraps"] }),
  // A chain: its strike rolls Double strike as the stat's own does, and takes the place of the plain Double strike's on
  // its holder, so a swing rolls Double strike once.
  [pieceStatus("flurry_wraps", "Flurry wraps", "Its extra strikes can strike again, up to twice, each a fifth weaker.", { strike: { scale: "double_strike", to: "target", chain: { times: 2, share: 80 } } })],
  "Cuts 3 ●●●, Snap ●●, Pact ●●",
);

add(
  piece({ name: "Still hand", kind: "claws", slot: "weapon", rarity: "legendary", text: "Evasion medium. Its hits on a Stunned or Silenced foe always crit and add several Sunder (from Attack). When it Stuns a foe, its ability with the longest cooldown left is ready at once.", stats: [sp("evasion", "medium")], statuses: ["still_hand"] }),
  [
    pieceStatus("still_hand", "Still hand", "Its hits on a Stunned or Silenced foe always crit and add several Sunder. When it Stuns a foe, its ability with the longest cooldown left is ready.", {
      crits: [{ when: { hasAny: ["stun", "silence"] }, chance: 100 }],
      reactions: [
        // A reaction's `if` adds the Sunder only to a held foe.
        { on: { event: "hit_lands" }, if: { unit: "other", where: { hasAny: ["stun", "silence"] } }, do: [apply("sunder", "other", own("several", "attack"))] },
        // A Stun the holder applied (a Chill shatter's Stun is its holder's own, so it doesn't count) readies the longest cooldown.
        { on: { event: "status_gained", status: "stun", whose: "foe", other: "holder" }, do: [{ op: "cooldown", which: "longest", set: "ready", to: "self" }] },
      ],
    }),
  ],
  "Lockdown 3 ●●●, Snap ●●",
);

// ─── Sword (Knight, Hexer, Valkyrie): medium, one hand; full, even, standard. Attack; HP, Defense, Crit chance, Aggro ──

add(piece({ name: "Arming sword", kind: "sword", slot: "weapon", rarity: "common", text: "Attack +2.", stats: [st("attack", 2)] }), [], "Ambush 1, Hunt 1");

add(piece({ name: "Gilded sword", kind: "sword", slot: "weapon", rarity: "common", text: "HP +1, Aggro +1.", stats: [st("max_hp", 1), st("aggro", 1)] }), [], "Toll 1, Landslide 1, Bonfire ●, Phoenix ●");

add(
  piece({ name: "Clarion blade", kind: "sword", slot: "weapon", rarity: "uncommon", text: "HP +1. Taunts when each fight starts.", stats: [st("max_hp", 1)], statuses: ["clarion_blade"] }),
  // Taunt at its own length (statuses are universal); Taunt ends Hidden when it lands.
  [pieceStatus("clarion_blade", "Clarion blade", "Taunts when each fight starts.", { reactions: [onStart(apply("taunt", "holder"))] })],
  "Toll 1, Bonfire 1, Landslide ●, Harvest ●",
);

add(
  piece({ name: "Vigilant blade", kind: "sword", slot: "weapon", rarity: "uncommon", text: "Defense +1. Its basic attacks on a foe in a wind-up deal half again as much.", stats: [st("defense", 1)], statuses: ["vigilant_blade"] }),
  [pieceStatus("vigilant_blade", "Vigilant blade", "Its basic attacks on a foe in a wind-up deal half again as much.", { boosts: [{ tag: "basic", pct: against(50, { casting: true }) }] })],
  "Lockdown 1, Toll ●",
);

add(
  piece({ name: "Sweeping blade", kind: "sword", slot: "weapon", rarity: "rare", text: "Attack +1. Its basic attacks also hit a second, random foe for half.", stats: [st("attack", 1)], statuses: ["sweeping_blade"] }),
  // An extra strike sized at half.
  [pieceStatus("sweeping_blade", "Sweeping blade", "Its basic attacks also hit a second, random foe for half.", { strike: { to: { side: "foes", pick: "random", exclude: "targets" }, share: 50 } })],
  "Harvest 2 ●●●, Cuts ●",
);

{
  // The basic attack made ready at the start, and a crit rule on basic hits until the first basic attack resolves.
  const first = "drawn_steel_first";
  add(
    piece({ name: "Drawn steel", kind: "sword", slot: "weapon", rarity: "rare", text: "Crit chance +1. Its first basic attack of each fight comes at once and always crits.", stats: [critStep(1)], statuses: ["drawn_steel"] }),
    [
      pieceStatus("drawn_steel", "Drawn steel", "Its first basic attack of each fight comes at once and always crits.", {
        reactions: [onStart({ op: "cooldown", which: "basic", set: "ready", to: "holder" }, apply(first, "holder"))],
      }),
      helper(first, "Drawn", "Its first basic attack always crits.", { crits: [{ tag: "basic", chance: 100 }], reactions: [{ on: { event: "action_resolve", kind: "basic" }, do: [removeBuff(first)] }] }),
    ],
    "Ambush 2 ●●●, Landslide ●",
  );
}

{
  const sweep = "oathkeeper_sweep";
  add(
    piece({ name: "Oathkeeper", kind: "sword", slot: "weapon", rarity: "legendary", text: "HP +1. While it Taunts, its basic attacks also hit every other foe.", stats: [st("max_hp", 1)], statuses: ["oathkeeper"] }),
    [
      pieceStatus("oathkeeper", "Oathkeeper", "While it Taunts, its basic attacks also hit every other foe.", {
        reactions: [
          { on: { event: "status_gained", status: "taunt" }, do: [apply(sweep, "holder")] },
          { on: { event: "status_ended", status: "taunt" }, do: [removeBuff(sweep)] },
        ],
      }),
      // A strike rule that picks several foes strikes each, at full swings.
      helper(sweep, "Oath", "Its basic attacks also hit every other foe.", { strike: { to: { side: "foes", pick: "all", exclude: "targets" } } }),
    ],
    "Toll 3 ●●●, Harvest 3 ●●●, Landslide ●",
  );
}

add(
  piece({ name: "Gravemark", kind: "sword", slot: "weapon", rarity: "legendary", text: "Attack +1. Its hits on a Marked foe deal half again as much. If no foe is Marked, its basic attacks Mark their target. When a Marked foe falls, the foe with the lowest HP is Marked.", stats: [st("attack", 1)], statuses: ["gravemark"] }),
  [
    pieceStatus("gravemark", "Gravemark", "Its hits on a Marked foe deal half again as much. If no foe is Marked, its basic attacks Mark. When a Marked foe falls, the weakest is Marked.", {
      boosts: bothTags(against(50, { has: "marked" })),
      reactions: [
        // A reaction's `if`: no foe is Marked.
        { on: { event: "hit_lands", kind: "basic" }, if: { side: "foes", where: { has: "marked" }, atMost: 0 }, do: [apply("marked", "other")] },
        { on: { event: "status_ended", status: "marked", cause: ["ko"], whose: "foe" }, do: [apply("marked", { side: "foes", pick: "lowest", by: "hp" })] },
      ],
    }),
  ],
  "Hunt 3 ●●●",
);

// ─── Spear (Hoplite, Valkyrie, Monk): medium, one hand; full, even, standard. Aggro; Defense, Attack, Crit chance, HP ──

add(piece({ name: "Ironwood spear", kind: "spear", slot: "weapon", rarity: "common", text: "Defense +1, Attack +1.", stats: [st("defense", 1), st("attack", 1)] }), [], "Toll 1, Bonfire 1, Landslide ●");

add(piece({ name: "Partisan", kind: "spear", slot: "weapon", rarity: "common", text: "Crit chance +1, Aggro +1.", stats: [critStep(1), st("aggro", 1)] }), [], "Hunt 1, Toll 1");

add(
  piece({ name: "Ox-tongue spear", kind: "spear", slot: "weapon", rarity: "uncommon", text: "Crit chance +1. Its crits add a few Sunder (from Attack).", stats: [critStep(1)], statuses: ["ox_tongue_spear"] }),
  [pieceStatus("ox_tongue_spear", "Ox-tongue spear", "Its crits add a few Sunder.", { reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [apply("sunder", "other", own("few", "attack"))] }] })],
  "Hunt 1, Cuts ●, Landslide ●",
);

add(
  piece({ name: "Trophy spear", kind: "spear", slot: "weapon", rarity: "uncommon", text: "Attack +1. When it lands a killing blow, it's Guarded.", stats: [st("attack", 1)], statuses: ["trophy_spear"] }),
  // A kill the holder landed (`other: holder`).
  [pieceStatus("trophy_spear", "Trophy spear", "When it lands a killing blow, it's Guarded.", { reactions: [{ on: killBlow, do: [apply("guard", "holder")] }] })],
  "Hunt 1, Ambush ●, Harvest ●",
);

add(
  piece({ name: "Hunting spear", kind: "spear", slot: "weapon", rarity: "rare", text: "Attack +1. When it lands a killing blow, its ability with the longest cooldown left is ready at once.", stats: [st("attack", 1)], statuses: ["hunting_spear"] }),
  [pieceStatus("hunting_spear", "Hunting spear", "When it lands a killing blow, its ability with the longest cooldown left is ready.", { reactions: [{ on: killBlow, do: [{ op: "cooldown", which: "longest", set: "ready", to: "self" }] }] })],
  "Hunt 2 ●●●, Ambush ●●, Harvest ●",
);

add(
  piece({ name: "Glaive", kind: "spear", slot: "weapon", rarity: "rare", text: "Aggro +1. Its basic attacks also hit the foe with the most HP for half. If that foe is the target, they hit the foe with the next most.", stats: [st("aggro", 1)], statuses: ["glaive"] }),
  // An extra strike sized at half.
  [pieceStatus("glaive", "Glaive", "Its basic attacks also hit the foe with the most HP for half.", { strike: { to: { side: "foes", pick: "highest", by: "hp", exclude: "targets" }, share: 50 } })],
  "Harvest 2 ●●●, Landslide ●",
);

add(
  piece({ name: "Pike wall", kind: "spear", slot: "weapon", rarity: "legendary", text: "Defense +1. When a foe hits an ally with less Defense than the wearer, the wearer strikes that foe with its spear.", stats: [st("defense", 1)], statuses: ["pike_wall"] }),
  // A reaction's `if` with a `lower` test (the ally that took the hit has less Defense than the wearer), and a reaction that strikes. No limit.
  [pieceStatus("pike_wall", "Pike wall", "When a foe hits an ally with less Defense, it strikes that foe.", {
    reactions: [{ on: { event: "hit_taken", whose: "ally" }, if: { unit: "owner", where: { lower: { stat: "defense" } } }, do: [{ op: "strike", to: "other" }] }],
  })],
  "Toll 3 ●●●, Landslide ●●, Bonfire ●",
);

{
  const ready = "storm_pike_ready";
  add(
    piece({ name: "Storm pike", kind: "spear", slot: "weapon", rarity: "legendary", text: "Attack +1. Each hit it lands adds a Charge, up to 10. At 10, its next basic attack that lands also calls lightning on every foe (light damage, from Attack) and spends the Charges.", stats: [st("attack", 1)], statuses: ["storm_pike"] }),
    [
      pieceStatus("storm_pike", "Storm pike", "Each hit it lands adds a Charge. At 10, its next basic attack calls lightning on every foe.", {
        reactions: [
          { on: { event: "hit_lands" }, do: [apply("charge", "self", 1)] },
          // The reaction's `if` keeps a capped event that resolves after the Charges were spent from readying a second storm.
          { on: { event: "status_capped", status: "charge" }, if: { side: "self", where: { atCap: "charge" } }, do: [apply(ready, "holder")] },
        ],
      }),
      helper(ready, "Storm", "Its next basic attack that lands calls lightning on every foe.", {
        reactions: [{
          on: { event: "hit_lands", kind: "basic" },
          do: [
            { op: "damage", type: "physical", amount: { scale: [{ ratio: HIT.light, stat: "attack", of: "holder" }] }, to: { side: "foes", pick: "all" } },
            removeBuff("charge"),
            removeBuff(ready),
          ],
        }],
      }),
    ],
    "Harvest 3 ●●●, Cuts ●●",
  );
}

// ─── Axe (Vampire, Assassin): medium, one hand; heavy, Attack-heavy, lean. Lifesteal; Attack, Crit damage, HP ──
// The brute's blade: hits hardest of the one-handers and carries least. The great weapon's one-handed cousin.

add(piece({ name: "Hand axe", kind: "axe", slot: "weapon", rarity: "common", text: "Lifesteal medium.", stats: [sp("lifesteal", "medium")] }), [], "Pact 1, Hunt ●");

add(piece({ name: "Cleaver", kind: "axe", slot: "weapon", rarity: "common", text: "Attack +1.", stats: [st("attack", 1)] }), [], "Hunt 1, Ambush ●");

add(
  piece({ name: "Reaver's axe", kind: "axe", slot: "weapon", rarity: "uncommon", text: "Crit damage medium. When it lands a killing blow, it gains a few Might (from Attack).", stats: [sp("crit_damage", "medium")], statuses: ["reavers_axe"] }),
  [pieceStatus("reavers_axe", "Reaver's axe", "A killing blow gives it a few Might.", { reactions: [{ on: killBlow, do: [apply("might", "holder", own("few", "attack"))] }] })],
  "Hunt 1, Ambush 1",
);

add(
  piece({ name: "Hungry axe", kind: "axe", slot: "weapon", rarity: "uncommon", text: "Attack +1. Its hits on a foe below half its HP heal it for a tenth of the damage dealt.", stats: [st("attack", 1)], statuses: ["hungry_axe"] }),
  // A reaction's `if` tests the foe hit; the heal is the hit's amount.
  [pieceStatus("hungry_axe", "Hungry axe", "Its hits on a foe below half its HP heal it for a tenth of the damage.", { reactions: [{ on: { event: "hit_lands" }, if: { unit: "other", where: { hpBelow: 50 } }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.1, amount: true }] }, to: "self" }] }] })],
  "Pact 1, Hunt 1",
);

add(
  piece({ name: "Executioner's axe", kind: "axe", slot: "weapon", rarity: "rare", text: "Its hits on a foe below a quarter of its HP deal double.", statuses: ["executioners_axe"] }),
  [pieceStatus("executioners_axe", "Executioner's axe", "Its hits on a foe below a quarter of its HP deal double.", { boosts: bothTags(against(100, { hpBelow: 25 })) })],
  "Hunt 2 ●●●, Ambush ●",
);

add(
  piece({ name: "Thirsting axe", kind: "axe", slot: "weapon", rarity: "rare", text: "Each killing blow it lands heals it for a fifth of its max HP.", statuses: ["thirsting_axe"] }),
  [pieceStatus("thirsting_axe", "Thirsting axe", "A killing blow heals it for a fifth of its max HP.", { reactions: [{ on: killBlow, do: [{ op: "heal", amount: { scale: [{ ratio: 0.2, stat: "max_hp", of: "holder" }] }, to: "holder" }] }] })],
  "Pact 2 ●●●, Hunt ●●",
);

{
  // Its own Lifesteal, on top of any; what a heal would take past full becomes a Shield (the overhealed event's amount).
  add(
    piece({ name: "The Red Feast", kind: "axe", slot: "weapon", rarity: "legendary", text: "Its hits heal it for a fifth of the damage they deal, and whatever a heal would take past full becomes a Shield on it.", statuses: ["the_red_feast"] }),
    [pieceStatus("the_red_feast", "The Red Feast", "Its hits heal it for a fifth of their damage; healing past full becomes a Shield.", {
      reactions: [
        { on: { event: "hit_lands" }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.2, amount: true }] }, to: "self" }] },
        { on: { event: "overhealed" }, do: [apply("shield", "holder", { scale: [{ ratio: 1, amount: true }] })] },
      ],
    })],
    "Pact 3 ●●●, Cuts ●",
  );
}

add(
  piece({
    name: "Headsman's axe", kind: "axe", slot: "weapon", rarity: "legendary", text: "Its basic attacks come half as often and deal double. A killing blow it lands readies its next basic attack at once.",
    // Attack speed −100 is half as often; the boost doubles. The hunter's staircase: each kill, the next chop at once.
    stats: [{ stat: "attack_speed", flat: -100 }], statuses: ["headsmans_axe"],
  }),
  [pieceStatus("headsmans_axe", "Headsman's axe", "Its basic attacks deal double; a killing blow readies the next.", { boosts: [{ tag: "basic", pct: 100 }], reactions: [{ on: killBlow, do: [{ op: "cooldown", which: "basic", set: "ready", to: "holder" }] }] })],
  "Hunt 3 ●●●, Landslide ●●",
);

// ─── Bow (Ranger, Bard): medium, two hands; heavy, Attack-heavy, standard. Crit damage; Crit chance, Attack, Attack speed ──
// A two-hander at a one-hander's budget: the marksman's scaling swing, paid for in the offhand it gives up.

add(piece({ name: "Recurve bow", kind: "bow", slot: "weapon", rarity: "common", text: "Attack +1, Crit damage medium.", stats: [st("attack", 1), sp("crit_damage", "medium")] }), [], "Hunt 1, Ambush 1, Overflow ●");

add(piece({ name: "Yew bow", kind: "bow", slot: "weapon", rarity: "common", text: "Crit chance +1, Attack speed medium.", stats: [critStep(1), sp("attack_speed", "medium")] }), [], "Hunt 1, Cuts ●");

add(
  piece({ name: "Snaring bow", kind: "bow", slot: "weapon", rarity: "uncommon", text: "Attack +1. Each time it looses a basic attack while a foe is winding up, that foe is Slowed (the one with the highest Attack, if several are).", stats: [st("attack", 1)], statuses: ["snaring_bow"] }),
  // No ifNone: with nobody winding up, nobody is picked.
  [pieceStatus("snaring_bow", "Snaring bow", "Each basic attack Slows a foe that's winding up.", {
    reactions: [{ on: { event: "action_resolve", kind: "basic" }, do: [apply("slow", { side: "foes", where: { casting: true }, pick: "highest", by: { stats: ["attack"] } })] }],
  })],
  "Lockdown 1, Toll ●, Hunt ●",
);

add(
  piece({ name: "Broadhead bow", kind: "bow", slot: "weapon", rarity: "uncommon", text: "Crit chance +1. Its crits add a few Bleed (from Attack).", stats: [critStep(1)], statuses: ["broadhead_bow"] }),
  [pieceStatus("broadhead_bow", "Broadhead bow", "Its crits add a few Bleed.", { reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [apply("bleed", "other", own("few", "attack"))] }] })],
  "Cuts 1, Hunt 1, Toll ●",
);

add(
  piece({ name: "Huntsman's bow", kind: "bow", slot: "weapon", rarity: "rare", text: "Attack +1. Its basic attacks Mark their target. Its hits on a Marked foe deal a third more.", stats: [st("attack", 1)], statuses: ["huntsmans_bow"], weapon: { apply: [{ status: "marked" }] } }),
  [pieceStatus("huntsmans_bow", "Huntsman's bow", "Its hits on a Marked foe deal a third more.", { boosts: bothTags(against(33, { has: "marked" })) })],
  "Hunt 2 ●●●, Ambush ●",
);

add(
  piece({
    name: "Frostbite bow", kind: "bow", slot: "weapon", rarity: "rare", text: "Crit damage medium. Its basic attacks add a few Chill (from Attack). On a foe with 8 or more Chill, they add a few Sunder too.", stats: [sp("crit_damage", "medium")],
    // The Sunder reads the foe's Chill after this swing's Chill: 0 stacks below 8.
    weapon: { apply: [
      { status: "chill", stacks: swingStacks("few") },
      { status: "sunder", stacks: { scale: [{ ratio: STACKS.few / P, when: { stacks: { status: "chill", atLeast: 8 } }, of: "target", times: { stat: "attack", of: "self" } }] } },
    ] },
  }),
  [],
  "Snap 2 ●●●, Lockdown ●",
);

{
  // Volleys on basic attacks 1, 6, 11...: the first at the start, then a hidden count of basic attacks readies the next at 5.
  const volley = "volley_bow_volley", count = "volley_bow_count";
  add(
    piece({ name: "Volley bow", kind: "bow", slot: "weapon", rarity: "legendary", text: "Attack speed medium. Its first basic attack of each fight, and every fifth after it, is a volley: it also looses a full arrow at every other foe.", stats: [sp("attack_speed", "medium")], statuses: ["volley_bow"] }),
    [
      pieceStatus("volley_bow", "Volley bow", "Its first basic attack of each fight, and every fifth after it, is a volley.", {
        reactions: [onStart(apply(volley, "holder")), { on: { event: "action_resolve", kind: "basic" }, do: [apply(count, "holder", 1)] }],
      }),
      // A strike rule that picks several foes strikes each, at full arrows.
      helper(volley, "Volley", "Its next basic attack also looses a full arrow at every other foe.", {
        strike: { to: { side: "foes", pick: "all", exclude: "targets" } },
        reactions: [{ on: { event: "action_resolve", kind: "basic" }, do: [removeBuff(volley)] }],
      }),
      {
        id: count, name: "Volley count", text: "Basic attacks since the last volley.", label: "buff", show: "sheet", stacking: "intensity", unremovable: true, cap: 5,
        trigger: { on: { event: "status_capped", status: count }, do: [apply(volley, "holder")] }, drop: "all",
      },
    ],
    "Ambush 3 ●●●, Harvest 2 ●●, Cuts ●",
  );
}

add(
  piece({ name: "Executioner's longbow", kind: "bow", slot: "weapon", rarity: "legendary", text: "Crit damage medium. Its basic attacks ignore Taunt, and deal more the less HP their target has: +25% below three quarters, +50% below half, +75% below a quarter, double below a tenth.", stats: [sp("crit_damage", "medium")], statuses: ["executioners_longbow"] }),
  [pieceStatus("executioners_longbow", "Executioner's longbow", "Its basic attacks ignore Taunt, and deal more the less HP their target has, up to double below a tenth.", {
    seek: "basic",
    boosts: [{ tag: "basic", pct: { scale: [75, 50, 25, 10].map((hpBelow) => ({ ratio: 25, when: { hpBelow }, of: "target" as const })) } }],
  })],
  "Hunt 3 ●●●, Harvest ●●",
);

// ─── Great weapon (Hoplite, Paladin, Geomancer): slow, two hands; heavy, even, rich. Attack; HP, Crit damage, Lifesteal, Aggro ──
// Worth a weapon and an offhand: the heaviest swing and the stats. Greataxes, mauls, pikes and scythes; the axe and hammer are its one-handed cousins.

add(piece({ name: "Bardiche", kind: "great_weapon", slot: "weapon", rarity: "common", text: "A heavy bardiche. Attack +1, Crit damage medium.", trade: "heavy", stats: [st("attack", 1), sp("crit_damage", "medium")] }), [], "Landslide 1, Ambush ●");

add(piece({ name: "Poleaxe", kind: "great_weapon", slot: "weapon", rarity: "common", text: "HP +2, Attack +1.", stats: [st("max_hp", 2), st("attack", 1)] }), [], "Pact 1, Landslide 1, Toll ●");

add(
  piece({ name: "Roaring greataxe", kind: "great_weapon", slot: "weapon", rarity: "uncommon", text: "Attack +1, Crit damage medium. Starts each fight with a few Might (from Attack).", stats: [st("attack", 1), sp("crit_damage", "medium")], statuses: ["roaring_greataxe"] }),
  [pieceStatus("roaring_greataxe", "Roaring greataxe", "Starts each fight with a few Might.", { reactions: [onStart(apply("might", "holder", own("few", "attack")))] })],
  "Landslide 1, Ambush 1",
);

add(
  piece({ name: "Ironbound maul", kind: "great_weapon", slot: "weapon", rarity: "uncommon", text: "Attack +1, HP +1. Starts each fight behind a Shield of a fifth of its Attack.", stats: [st("attack", 1), st("max_hp", 1)], statuses: ["ironbound_maul"] }),
  [pieceStatus("ironbound_maul", "Ironbound maul", "Starts each fight behind a Shield of a fifth of its Attack.", { reactions: [onStart(apply("shield", "holder", { scale: [{ ratio: 0.2, stat: "attack", of: "holder" }] }))] })],
  "Landslide 1, Ambush ●, Toll ●",
);

add(
  piece({ name: "Icebreaker", kind: "great_weapon", slot: "weapon", rarity: "rare", text: "Attack +1, HP +1. Its hits on a Stunned foe deal double.", stats: [st("attack", 1), st("max_hp", 1)], statuses: ["icebreaker"] }),
  [pieceStatus("icebreaker", "Icebreaker", "Its hits on a Stunned foe deal double.", { boosts: bothTags(against(100, { has: "stun" })) })],
  "Lockdown 2 ●●●, Snap 2 ●●●, Landslide ●●",
);

add(
  piece({ name: "Heartsplitter", kind: "great_weapon", slot: "weapon", rarity: "rare", text: "HP +2. Its basic attacks scale from max HP in place of Attack.", stats: [st("max_hp", 2)], weapon: { amount: weaponHit("great_weapon", { scaling: "attack_heavy", stat: "max_hp" }) } }),
  [],
  "Pact 2 ●●●, Landslide 2 ●●",
);

{
  const hit = weaponHit("great_weapon") as Exclude<NumT, number>;
  add(
    piece({
      name: "Cornerstone maul", kind: "great_weapon", slot: "weapon", rarity: "legendary", text: "HP +1, Attack +1. Its basic attacks deal extra damage equal to half its Shield. Swinging never spends the Shield.", stats: [st("max_hp", 1), st("attack", 1)],
      // Reading the Shield's stacks doesn't spend them.
      weapon: { amount: { ...hit, scale: [...hit.scale, { ratio: 0.5, stacks: "shield", of: "self" }] } },
    }),
    [],
    "Landslide 3 ●●●, Ambush ●",
  );
}

add(
  piece({
    name: "Worldbreaker", kind: "great_weapon", slot: "weapon", rarity: "legendary", text: "Attack +1, Aggro +1. Its basic attacks come half as often, deal triple, and Stun their target.",
    // Attack speed −100 is half as often. Its shape and Stun hold whatever else the unit holds.
    stats: [st("attack", 1), st("aggro", 1), { stat: "attack_speed", flat: -100 }], statuses: ["worldbreaker"], weapon: { apply: [{ status: "stun" }] },
  }),
  [pieceStatus("worldbreaker", "Worldbreaker", "Its basic attacks deal triple.", { boosts: [{ tag: "basic", pct: 200 }] })],
  "Landslide 3 ●●●, Lockdown 3 ●●",
);

export const gear: GearT[] = gearList;
export const statuses: StatusT[] = statusList;
export const builds: Builds = buildMap;
