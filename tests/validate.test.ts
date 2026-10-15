import { test } from "vitest";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkParty, teaser, unmetConstraints, validatePack, type Issue } from "../src/validate.js";
import type { ContentPack, Party } from "../src/schema.js";

const PACK: ContentPack = JSON.parse(readFileSync(new URL("../fixtures/hollow.pack.json", import.meta.url), "utf8"));
const PARTY: Party = JSON.parse(readFileSync(new URL("../fixtures/party.json", import.meta.url), "utf8"));
const DUNGEON = "hollow_of_the_grey_mother";

const clone = <T>(x: T): T => structuredClone(x);
const codes = (issues: Issue[], level?: Issue["level"]) => issues.filter((i) => !level || i.level === level).map((i) => i.code);
const find = (arr: any[], id: string): any => arr.find((x) => x.id === id);

/** Break one thing in a copy of the example and expect a specific issue code. */
function expectIssue(code: string, mutate: (p: any) => void, opts: { level?: Issue["level"]; complete?: boolean } = {}) {
  const p = clone(PACK) as any;
  mutate(p);
  const { issues } = validatePack(p, { complete: opts.complete });
  const level = opts.level ?? "error";
  assert.ok(
    codes(issues, level).includes(code),
    `expected ${level} '${code}', got:\n${issues.map((i) => `  ${i.level} ${i.code} ${i.path}: ${i.message}`).join("\n") || "  (nothing)"}`,
  );
}

test("the worked example is clean", () => {
  assert.deepEqual(validatePack(PACK).issues, []);
});

test("the example party is valid and eligible for the right challenges", () => {
  assert.deepEqual(checkParty(PACK, PARTY, { dungeon: DUNGEON }), []);
  assert.deepEqual(unmetConstraints(PACK, PARTY, DUNGEON, "two_rangers"), []);
  assert.deepEqual(unmetConstraints(PACK, PARTY, DUNGEON, "in_phalanx"), []);
  assert.deepEqual(unmetConstraints(PACK, PARTY, DUNGEON, "two_units"), ["party size 3"]);
});

test("teasers are derived from data", () => {
  const t = teaser(PACK, DUNGEON, "two_rangers", { specializations: ["warrior_vanguard", "ranger_archer"], formations: ["open_order"] });
  assert.equal(t.teased, true);
  assert.match(t.needs[0], /1 more ranger.*ranger_duelist/);
  assert.equal(teaser(PACK, DUNGEON, "two_rangers", { specializations: ["ranger_archer", "ranger_duelist"] }).teased, false);
  assert.equal(teaser(PACK, DUNGEON, "in_phalanx", { specializations: ["warrior_vanguard"], formations: ["open_order"] }).teased, true);
});

test("complete mode flags a pack too small to ship, and statuses spread too widely", () => {
  const { issues } = validatePack(PACK, { complete: true });
  assert.ok(codes(issues).includes("complete.classes"));
  assert.ok(codes(issues).includes("complete.specsPerClass"));
  assert.ok(!codes(issues).includes("complete.verbs"), "19 verbs is inside 15–20");
  const niche = issues.filter((i) => i.code === "complete.statusNiche").map((i) => i.message);
  assert.ok(niche.some((m) => m.includes("'bleed'")), "1 of 4 specs is above the 20% example limit");
  assert.ok(!niche.some((m) => m.includes("'lethality'")), "self statuses are never a niche concern");
});

// ─── Shape and references ────────────────────────────────────────────────────

test("schema: unknown fields are rejected", () => expectIssue("schema", (p) => (find(p.abilities, "cleave").cooldown = 2)));
test("schema: unknown effect ops are rejected", () => expectIssue("schema", (p) => (find(p.abilities, "second_wind").rules[0].do[0].op = "resurrect")));
test("schema: verb-based conditions no longer exist", () =>
  expectIssue("schema", (p) => (find(p.formations, "phalanx").positions[3].rules[0].if = { hasVerb: "reach" })));
test("schema: verb-based challenge constraints no longer exist", () =>
  expectIssue("schema", (p) => p.dungeons[0].challenges[0].constraints.push({ withoutVerb: "burst" })));
test("schema: a unit has no base flag", () => expectIssue("schema", (p) => (find(p.specializations, "ranger_archer").base = true)));
test("ids are unique within a collection", () => expectIssue("id.duplicate", (p) => p.perks.push(clone(p.perks[0]))));
test("references resolve", () => expectIssue("ref.missing", (p) => (find(p.abilities, "barbed_arrows").rules[0].do[0].status = "poison")));

// ─── Context: references only where they mean something ─────────────────────

test("event_source only inside triggered rules", () =>
  expectIssue("ctx.from", (p) => (find(p.abilities, "cleave").rules[0].do[0].addEffects[0].target = { from: "event_source" })));
test("action_target only inside actions", () =>
  expectIssue("ctx.from", (p) => (find(p.abilities, "second_wind").rules[0].do[0].target = { from: "action_target" })));
test("the raw variable only in mitigation formulas", () =>
  expectIssue("ctx.var", (p) => (find(p.abilities, "second_wind").rules[0].do[0].amount = { var: "raw" })));
test("attacker/defender only in combat formulas", () =>
  expectIssue("ctx.subject", (p) => (find(p.abilities, "second_wind").rules[0].do[0].amount = { stat: "max_hp", of: "attacker" })));
test("hp_below needs a threshold", () => expectIssue("trigger.below", (p) => delete find(p.abilities, "second_wind").rules[0].when.below));
test("an action filter only on events an action causes", () =>
  expectIssue("trigger.action", (p) => (find(p.abilities, "second_wind").rules[0].when.action = { via: ["basic"] })));

// ─── Units, behaviour and actives ────────────────────────────────────────────

test("each specialization has 4 abilities", () => expectIssue("spec.abilityCount", (p) => find(p.specializations, "warrior_vanguard").abilities.pop()));
test("abilities don't cross classes", () =>
  expectIssue("spec.abilityClass", (p) => (find(p.specializations, "warrior_vanguard").abilities[3] = "riposte")));
test("abilities change behaviour, not stats", () =>
  expectIssue("ability.notBehaviour", (p) => (find(p.abilities, "quick_draw").rules[0].do = [{ op: "stat", stat: "speed", mode: "add", value: 5 }])));
test("an ability has rules or an active", () =>
  expectIssue("ability.empty", (p) => {
    delete find(p.abilities, "mend").active;
  }));
test("basic actions take their target from the behaviour", () =>
  expectIssue("action.basicTarget", (p) => (find(p.actions, "slash").target = { from: "enemies", pick: "weighted", count: 1 })));
test("actives carry their own target", () => expectIssue("action.target", (p) => delete find(p.actions, "volley").target));
test("an action isn't both basic and active", () =>
  expectIssue("action.dualUse", (p) => (find(p.abilities, "volley").active.action = "shoot")));
test("behaviour modes end in a fallback", () =>
  expectIssue("behaviour.fallback", (p) => (find(p.behaviours, "grey_mother").modes = [find(p.behaviours, "grey_mother").modes[0]])));
test("the ruleset's default modes end in a fallback", () =>
  expectIssue("behaviour.fallback", (p) => (p.ruleset.defaultModes = [{ when: { hpBelow: 0.5 }, use: "ability" }])));
test("unknown behaviours are caught", () => expectIssue("ref.missing", (p) => (find(p.specializations, "ranger_archer").behaviour = "archer_ai")));

// ─── Statuses: self-built state vs effects on others ─────────────────────────

test("a unit's own state is only applied to itself", () =>
  expectIssue("status.onSelf", (p) => (find(p.abilities, "lunge").rules[0].do[0].target = { from: "event_source" })));
test("a status for others is never applied to self", () =>
  expectIssue("status.onOthers", (p) => (find(p.abilities, "barbed_arrows").rules[0].do[0].target = { from: "self" })));
test("stat values that read stats are rejected (cycles)", () =>
  expectIssue("effect.statValue", (p) => (find(p.statuses, "lethality").rules[0].do[0].value = { mul: [0.01, { stat: "attack", of: "self" }] })));

// ─── Formations: bespoke slots, no rows ──────────────────────────────────────

test("formations always have 5 slots", () => expectIssue("formation.positions", (p) => find(p.formations, "phalanx").positions.pop()));
test("two slots aren't drawn in the same place", () =>
  expectIssue("formation.layout", (p) => (find(p.formations, "phalanx").positions[1].layout.column = 0)));
test("slots with effects tell the player what they do", () =>
  expectIssue("formation.slotText", (p) => delete find(p.formations, "hunting_party").positions[0].text, { level: "warning" }));
test("party-wide formation rules are checked", () =>
  expectIssue("ref.missing", (p) => (find(p.formations, "flash_flood").rules[0].do[1].stat = "dodge")));
test("schema: there are no rows to test", () => expectIssue("schema", (p) => (find(p.gear, "wolfhide_cloak").stats[1].if = { inRow: ["back"] })));
test("schema: actions have no reach", () => expectIssue("schema", (p) => (find(p.actions, "slash").reach = "melee")));
test("schema: enemies have no placement", () => expectIssue("schema", (p) => (p.dungeons[0].stages[0].enemies[0] = { enemy: "ash_wolf", row: "front" })));
test("fights hold at most maxEnemies", () => expectIssue("fight.size", (p) => (p.dungeons[0].stages[0].enemies = Array(7).fill("ash_wolf"))));
test("targeting runs on a real stat", () => expectIssue("ref.missing", (p) => (p.ruleset.targeting.weightStat = "threat")));
test("the default behaviour must exist", () => expectIssue("ref.missing", (p) => (p.ruleset.defaultBehaviour = "fight_wisely")));

// ─── Gear ────────────────────────────────────────────────────────────────────

test("efficacy gear carries no rules or actives", () =>
  expectIssue("gear.simple", (p) => (find(p.gear, "bone_charm").rules = clone(find(p.gear, "yata_mirror").rules))));
test("efficacy gear conditions stay simple", () =>
  expectIssue("gear.simpleCondition", (p) => (find(p.gear, "wolfhide_cloak").stats[1].if = { all: [{ hpBelow: 0.5 }, { round: { is: "gte", n: 2 } }] })));
test("powerful and capstone gear come from unlocks", () => expectIssue("gear.source", (p) => (find(p.gear, "ullrs_yew").source = "loot")));
test("capstones may be restricted to classes", () => {
  const p = clone(PACK) as any;
  find(p.gear, "yata_mirror").class = ["ranger"];
  assert.equal(validatePack(p).errors, 0);
});
test("class slots take only that class's gear", () => expectIssue("gear.slotClass", (p) => delete find(p.gear, "hunters_shortbow").class));
test("loot tables drop only loot gear", () => expectIssue("loot.source", (p) => p.dungeons[0].loot.replay.table.push({ gear: "ullrs_yew", weight: 1 })));
test("challenges pay gear", () => expectIssue("loot.empty", (p) => (p.dungeons[0].challenges[0].loot = {})));

// ─── Runs ────────────────────────────────────────────────────────────────────

test("perk pools hold 10 to 15 perks", () => expectIssue("dungeon.perkPool", (p) => (p.dungeons[0].perkPool = p.dungeons[0].perkPool.slice(0, 9))));
test("runs have 3 to 4 perk picks", () =>
  expectIssue("dungeon.perkPicks", (p) => (p.dungeons[0].stages = p.dungeons[0].stages.filter((s: any) => s.id !== "pick_3"))));
test("perk picks happen between fights", () =>
  expectIssue("dungeon.stageOrder", (p) => {
    const st = p.dungeons[0].stages;
    [st[2], st[3]] = [st[3], st[2]];
  }));
test("a run ends in a boss", () => expectIssue("dungeon.boss", (p) => delete p.dungeons[0].stages.at(-1).boss));
test("a boss fight has a boss", () => expectIssue("fight.bossRank", (p) => (p.dungeons[0].stages.at(-1).enemies = ["ash_wolf"])));
test("dungeons cap party size at 1 to 5", () => expectIssue("dungeon.partySize", (p) => (p.dungeons[0].partySize.max = 6)));
test("perk picks offer 3 options", () => expectIssue("design.perkOptions", (p) => (p.ruleset.run.perkOffer.options = 4)));
test("patching an active needs an active", () =>
  expectIssue("perk.patchActive", (p) => find(p.perks, "serrated_heads").patches[0].rule === "barb" && delete find(p.perks, "serrated_heads").patches[0].rule));
test("challenges must be possible: two of a class needs two units of it", () =>
  expectIssue("challenge.impossible", (p) => (p.dungeons[0].challenges[0].constraints[0].classCount.min = 3)));
test("starter content is marked as starter", () => expectIssue("starter.source", (p) => (find(p.formations, "open_order").source = "unlock")));
test("every dungeon is in the progression", () => expectIssue("progression.missing", (p) => (p.progression.dungeonOrder = ["somewhere_else"])));

// ─── Vocabulary honesty: verbs, traits and keyholes ──────────────────────────

test("traits: each word has one verb profile", () => expectIssue("trait.profile", (p) => (find(p.traits, "festering").verbs = ["evasion"])));
test("traits: the word appears in the enemy's text", () => expectIssue("enemy.traitText", (p) => (find(p.enemies, "ash_wolf").text = "A lean grey wolf.")));
test("traits: a trait can't promise what the enemy doesn't do", () =>
  expectIssue("enemy.traitUnsupported", (p) => (find(p.enemies, "ash_wolf").stats.evasion = 0.05)));
test("keyholes: bosses have 2 to 4", () => expectIssue("enemy.keyholes", (p) => (find(p.enemies, "grey_mother").keyholes = find(p.enemies, "grey_mother").keyholes.slice(0, 1))));
test("keyholes: grounded in the enemy's own data", () =>
  expectIssue("keyhole.from", (p) => (find(p.enemies, "grey_mother").keyholes[0].from = "evasion")));
test("keyholes: a named mechanic must exist", () =>
  expectIssue("keyhole.mechanic", (p) => (find(p.enemies, "grey_mother").keyholes[2].mechanic = "bite")));
test("keyholes: a named mechanic must show the verb", () =>
  expectIssue("keyhole.from", (p) => (find(p.enemies, "grey_mother").keyholes[2].mechanic = "rend")));
test("keyholes: bosses need gimmicks, not just stats", () =>
  expectIssue("enemy.keyholeMechanics", (p) => find(p.enemies, "grey_mother").keyholes.forEach((k: any) => delete k.mechanic), { level: "warning" }));
test("keyholes: a verb can't both counter and be blunted", () =>
  expectIssue("keyhole.contradiction", (p) => find(p.enemies, "grey_mother").keyholes[0].strongAgainst.push("burst")));
test("verbs: a declared verb must show in the data", () =>
  expectIssue("verb.unsupported", (p) => find(p.abilities, "stand_guard").verbs.push("healing"), { level: "warning" }));
test("verbs: a verb shown in the data must be declared", () =>
  expectIssue("verb.undeclared", (p) => (find(p.abilities, "cleave").verbs = ["area"]), { level: "warning" }));
test("verbs: mechanics that map to no verb are reported", () =>
  expectIssue("verb.unmapped", (p) => {
    const pos = find(p.formations, "hunting_party").positions;
    pos.forEach((x: any) => x.id !== "sanctuary" && delete x.rules);
    find(p.formations, "hunting_party").verbs = [];
  }, { level: "warning" }));

// ─── Party loadouts ──────────────────────────────────────────────────────────

function expectParty(code: string, mutate: (p: any) => void, opts: Parameters<typeof checkParty>[2] = { dungeon: DUNGEON }) {
  const party = clone(PARTY) as any;
  mutate(party);
  const got = codes(checkParty(PACK, party, opts));
  assert.ok(got.includes(code), `expected '${code}', got ${JSON.stringify(got)}`);
}
test("party: each specialization is one unit", () => expectParty("party.uniqueSpec", (p) => (p.units[2].spec = "ranger_duelist")));
test("party: two units of the same class are fine", () => assert.deepEqual(checkParty(PACK, PARTY, { dungeon: DUNGEON }), []));
test("party: units equip exactly 2 abilities", () => expectParty("party.abilities", (p) => p.units[0].abilities.push("second_wind")));
test("party: abilities come from the unit's specialization", () => expectParty("party.abilityNotOwned", (p) => (p.units[0].abilities[1] = "riposte")));
test("party: gear goes in a matching slot", () => expectParty("party.gearSlot", (p) => (p.units[0].gear.armour = "bone_charm")));
test("party: class gear only on that class", () => expectParty("party.slot", (p) => (p.units[0].gear.ranger_weapon = "hunters_shortbow")));
test("party: dungeon caps party size", () =>
  expectParty("party.size", (p) => p.units.push({ spec: "cleric_mender", position: "right_striker", abilities: ["mend", "purify"], gear: {} })));
test("party: positions exist and are free", () => expectParty("party.position", (p) => (p.units[1].position = "shield_point")));
test("party: ownership is checked when given", () =>
  expectParty("party.notOwned", () => {}, { dungeon: DUNGEON, owned: { specializations: ["warrior_vanguard", "ranger_archer"], formations: ["phalanx"] } }));
test("party: copies of gear can be shared up to the count owned", () => {
  const party = clone(PARTY) as any;
  party.units[0].gear.charm = "bone_charm";
  party.units[2].gear.charm = "bone_charm";
  const owned = (n: number) => ({ gear: { notched_blade: 1, studded_jerkin: 1, hunters_shortbow: 1, yata_mirror: 1, ullrs_yew: 1, wolfhide_cloak: 1, bone_charm: n } });
  assert.deepEqual(codes(checkParty(PACK, party, { dungeon: DUNGEON, owned: owned(2) })), []);
  assert.deepEqual(codes(checkParty(PACK, party, { dungeon: DUNGEON, owned: owned(1) })), ["party.gearCount"]);
});
