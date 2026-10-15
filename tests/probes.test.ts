/**
 * Done-when evidence for step 1: rules that later steps say they will design,
 * written as data against the worked example. Each probe must validate with no
 * errors. Verb warnings are allowed and reported: tuning the verb list is step 5.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validatePack, type Issue } from "../src/validate.js";

const PACK = JSON.parse(readFileSync(new URL("../fixtures/hollow.pack.json", import.meta.url), "utf8"));
const clone = <T>(x: T): T => structuredClone(x);
const find = (arr: any[], id: string): any => arr.find((x) => x.id === id);
const self = { from: "self" };
const hpFrac = { div: [{ stat: "hp", of: "candidate" }, { stat: "max_hp", of: "candidate" }] };

type Probe = { step: string; rule: string; apply: (p: any) => void };

const probes: Probe[] = [
  {
    step: "4 Combat rules",
    rule: "Hit roll as accuracy × (1 − evasion) instead of accuracy − evasion",
    apply: (p) => (p.ruleset.formulas.hitChance = { mul: [{ stat: "accuracy", of: "attacker" }, { sub: [1, { stat: "evasion", of: "defender" }] }] }),
  },
  {
    step: "4 Combat rules",
    rule: "Percentage armour instead of subtractive",
    apply: (p) => (find(p.damageTypes, "physical").mitigation = { mul: [{ var: "raw" }, { div: [100, { add: [100, { stat: "defence", of: "defender" }] }] }] }),
  },
  {
    step: "4 Combat rules",
    rule: "Block before crit; party wins speed ties; cooldowns carry across fights",
    apply: (p) => {
      p.ruleset.damagePipeline = ["hit", "block", "crit", "mitigate", "floor"];
      p.ruleset.turnOrder.ties = "party_first";
      p.ruleset.run.cooldownsResetEachFight = false;
    },
  },
  {
    step: "7 Units",
    rule: "A derived stat (guard = half of defence + 5)",
    apply: (p) => p.stats.push({ id: "guard", name: "Guard", kind: "attribute", default: 0, formula: { add: [{ mul: [0.5, { stat: "defence", of: "self" }] }, 5] } }),
  },
  {
    step: "7 Units",
    rule: "A behaviour family whose basic action targets allies (a pure support), plus a support state machine",
    apply: (p) => {
      p.behaviours.push({
        id: "tend", note: "Basic action heals the most wounded ally. When nobody is hurt, it waits.",
        basicTarget: { from: "allies_and_self", where: { hpBelow: 1, of: "candidate" }, pick: "lowest", by: hpFrac, count: 1 },
      });
      p.actions.push({ id: "soothe", name: "Soothe", do: [{ op: "heal", amount: { mul: [0.5, { stat: "magic", of: "self" }] }, target: { from: "action_target" } }], verbs: ["healing"] });
      p.specializations.push({
        id: "cleric_hermit", class: "cleric", name: "Cleric: Hermit", text: "Never lifts a hand against anyone.", source: "unlock",
        basicAction: "soothe", behaviour: "tend", abilities: ["mend", "purify", "blessed_ward", "radiance"],
        verbs: ["healing", "cleanse", "armour", "magic_damage", "area"],
      });
    },
  },
  {
    step: "7 Units + 10 Runs",
    rule: "Lifesteal, thorns, and a run resource (focus) spent by an active and restored between fights",
    apply: (p) => {
      p.stats.push(
        { id: "max_focus", name: "Max focus", kind: "attribute", default: 0, min: 0 },
        { id: "focus", name: "Focus", kind: "resource", default: 0, min: 0, maxStat: "max_focus", persistence: "run" },
      );
      p.ruleset.run.betweenFights.push({ op: "adjust", stat: "focus", amount: 10, target: self });
      find(p.classes, "cleric").stats.max_focus = 60;
      p.actions.push({
        id: "great_heal", name: "Great Heal", target: { from: "allies_and_self", pick: "all" },
        do: [
          { op: "heal", amount: { mul: [0.3, { stat: "max_hp", of: "target" }] }, target: { from: "action_target" } },
          { op: "adjust", stat: "focus", amount: -30, target: self },
        ],
        verbs: ["healing"],
      });
      p.abilities.push(
        { id: "prayer", class: "cleric", name: "Prayer", text: "With 30 focus, heals the whole party.", verbs: ["healing"],
          active: { action: "great_heal", cooldown: 0, priority: 2, useWhen: { compare: [{ stat: "focus", of: "self" }, "gte", 30] } } },
        { id: "drain_touch", class: "cleric", name: "Drain Touch", text: "Heals for 30% of damage dealt.", verbs: ["healing"],
          rules: [{ id: "drain", kind: "triggered", when: { on: "attack_hit" }, do: [{ op: "heal", amount: { mul: [0.3, { var: "amount" }] }, target: self }] }] },
        { id: "thorns", class: "cleric", name: "Thorns", text: "Attackers take a quarter of the damage back.", verbs: ["counter"],
          rules: [{ id: "spike", kind: "triggered", when: { on: "damaged", action: { via: ["basic", "ability"] } },
            do: [{ op: "damage", type: "pure", amount: { mul: [0.25, { var: "amount" }] }, target: { from: "event_source" }, hit: { canMiss: false, canCrit: false, canBlock: false } }] }] },
      );
      p.specializations.push({
        id: "cleric_ascetic", class: "cleric", name: "Cleric: Ascetic", text: "Saves its strength for one great prayer.", source: "unlock",
        basicAction: "smite", abilities: ["mend", "prayer", "drain_touch", "thorns"],
        verbs: ["magic_damage", "healing", "counter"],
      });
    },
  },
  {
    step: "8 Formations",
    rule: "Three front, two back, no middle: a slot that acts first, a last-stand slot, and auto-defending rear slots",
    apply: (p) =>
      p.formations.push({
        id: "wedge", name: "Wedge", text: "One sharp point and two hard flanks.", source: "unlock", verbs: ["initiative", "burst", "armour"],
        positions: [
          { id: "tip", name: "Tip", text: "Always acts first.", layout: { line: "front", column: 1 }, rules: [{ id: "lead", kind: "passive", do: [{ op: "flag", flag: "acts_first" }] }] },
          { id: "l", name: "Left Edge", text: "Hits much harder below half health.", layout: { line: "front", column: 0 },
            rules: [{ id: "last_stand", kind: "passive", if: { hpBelow: 0.5 }, do: [{ op: "stat", stat: "damage_dealt", mode: "mul", value: 1.5 }] }] },
          { id: "r", name: "Right Edge", layout: { line: "front", column: 2 } },
          { id: "bl", name: "Rear Guard", text: "Guards after each turn.", layout: { line: "back", column: 0 },
            rules: [{ id: "guard", kind: "triggered", when: { on: "turn_end" }, do: [{ op: "apply_status", status: "guarding", target: self }] }] },
          { id: "br", name: "Rear Guard", text: "Guards after each turn.", layout: { line: "back", column: 2 },
            rules: [{ id: "guard", kind: "triggered", when: { on: "turn_end" }, do: [{ op: "apply_status", status: "guarding", target: self }] }] },
        ],
      }),
  },
  {
    step: "9 Gear",
    rule: "A higher-rank efficacy piece on the same curve, with a simple condition",
    apply: (p) => {
      p.gear.push({ id: "mail_shirt", name: "Mail Shirt", text: "Heavy, honest, loud.", slot: "armour", tier: "efficacy", source: "loot", rank: 4,
        stats: [{ stat: "max_hp", mode: "add", value: 30 }, { stat: "defence", mode: "add", value: 4, if: { hpAtLeast: 0.5 } }], verbs: ["armour"] });
      p.dungeons[0].loot.replay.table.push({ gear: "mail_shirt", weight: 1 });
    },
  },
  {
    step: "10 Runs",
    rule: "A perk that shortens an active's cooldown, and one limited to some units",
    apply: (p) => {
      p.perks.push(
        { id: "quick_hands", name: "Quick Hands", text: "Volley comes back sooner.", family: "hunt", rarity: "regular", verbs: ["physical_damage", "area"],
          requires: { hasAbility: "volley", of: "self" }, patches: [{ op: "patch_ability", ability: "volley", cooldownAdd: -1 }] },
        { id: "front_line", name: "Shield Brothers", text: "Your Warriors shrug off blows.", family: "iron", rarity: "regular", verbs: ["armour"],
          appliesTo: { isClass: ["warrior"] }, rules: [{ id: "wall", kind: "passive", do: [{ op: "stat", stat: "defence", mode: "add", value: 4 }] }] },
      );
      p.dungeons[0].perkPool.push("quick_hands", "front_line");
    },
  },
  {
    step: "11 Encounters",
    rule: "A boss that storms every third turn, stacks poison and switches state when hurt, plus a decoy that soaks basic attacks",
    apply: (p) => {
      p.statuses.push(
        { id: "poison", name: "POISON", text: "Loses health each turn. Stacks.", on: "others", stacking: "stack", maxStacks: 3, defaultTurns: 4,
          rules: [{ id: "tick", kind: "triggered", when: { on: "turn_start" },
            do: [{ op: "damage", type: "magic", amount: { mul: [3, { stacks: "poison", of: "self" }] }, target: self, hit: { canMiss: false, canCrit: false, canBlock: false } }] }] },
        { id: "unmasked", name: "UNMASKED", text: "Its true face shows.", on: "self", stacking: "refresh" },
      );
      p.actions.push(
        { id: "fang", name: "Fang",
          do: [{ op: "damage", type: "physical", amount: { stat: "attack", of: "self" }, target: { from: "action_target" } },
               { op: "apply_status", status: "poison", target: { from: "action_target" } }], verbs: ["physical_damage", "damage_over_time", "magic_damage"] },
        { id: "web_storm", name: "Web Storm", target: { from: "enemies", pick: "all" },
          do: [{ op: "damage", type: "magic", amount: { mul: [0.6, { stat: "magic", of: "self" }] }, target: { from: "action_target" } }], verbs: ["magic_damage", "area"] },
      );
      p.behaviours.push({
        id: "jorogumo", note: "Masked: storms when ready. Unmasked: hunts the weakest.",
        basicTarget: { from: "enemies", pick: "weighted", count: 1 },
        modes: [{ when: { hasStatus: "unmasked" }, use: "basic" }, { use: "ability" }, { use: "basic" }],
      });
      p.enemies.push({
        id: "jorogumo", name: "Jorogumo", text: "A spider that wears a woman's face until it is hurt.", rank: "boss", traits: [],
        stats: { max_hp: 300, attack: 13, magic: 12, defence: 4, resistance: 4, speed: 10 },
        basicAction: "fang", behaviour: "jorogumo",
        actives: [{ action: "web_storm", cooldown: 3, initialCooldown: 2 }],
        rules: [{ id: "unmask", kind: "triggered", when: { on: "hp_below", below: 0.5 }, limit: { times: 1, per: "fight" },
          do: [{ op: "apply_status", status: "unmasked", target: self }, { op: "buff", stat: "attack", mode: "mul", value: 1.5, target: self }] }],
        keyholes: [
          { id: "poison", from: "damage_over_time", mechanic: "fang", counteredBy: ["cleanse", "healing"], note: "Poison stacks on whoever she bites." },
          { id: "storm", from: "area", mechanic: "web_storm", counteredBy: ["healing", "armour"], note: "Web Storm hits everyone every third turn." },
        ],
        verbs: ["physical_damage", "damage_over_time", "magic_damage", "area"],
      });
      p.enemies.push({
        id: "silk_husk", name: "Silk Husk", text: "A wrapped body that twitches and draws the eye.", rank: "minion", traits: [],
        stats: { max_hp: 70, attack: 3, defence: 6, speed: 4, aggro: 4 }, basicAction: "bite",
        keyholes: [{ id: "decoy", from: "protect", counteredBy: ["area", "execute"], note: "Soaks basic attacks picked by aggro. Splash and finishers ignore it." }],
        verbs: ["physical_damage", "protect"],
      });
    },
  },
];

const fmt = (is: Issue[]) => is.map((i) => `    ${i.level} [${i.code}] ${i.path}: ${i.message}`).join("\n");

for (const pr of probes) {
  test(`probe (step ${pr.step}): ${pr.rule}`, () => {
    const p = clone(PACK);
    pr.apply(p);
    const { issues } = validatePack(p);
    const errors = issues.filter((i) => i.level === "error");
    assert.equal(errors.length, 0, `not expressible as valid data:\n${fmt(errors)}`);
    const nonVerb = issues.filter((i) => i.level === "warning" && !i.code.startsWith("verb."));
    assert.equal(nonVerb.length, 0, fmt(nonVerb));
    const verbWarnings = issues.filter((i) => i.code.startsWith("verb."));
    if (verbWarnings.length) console.log(`  [${pr.rule}] verb warnings for step 5:\n${fmt(verbWarnings)}`);
  });
}

test("all probes together", () => {
  const p = clone(PACK);
  probes.forEach((pr) => pr.apply(p));
  const { issues } = validatePack(p);
  assert.equal(issues.filter((i) => i.level === "error").length, 0, fmt(issues));
});
