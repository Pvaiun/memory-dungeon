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

/** Add an ability to the Vanguard's class and expect it to be clean, or to raise `code`. */
function card(ability: object, code?: string) {
  const p = clone(PACK) as any;
  p.abilities.push({ id: "card", class: "warrior", name: "Card", text: "-", cooldown: 10, verbs: [], ...ability });
  const { issues } = validatePack(p);
  const errors = codes(issues, "error");
  if (code) assert.ok(errors.includes(code), `expected '${code}', got ${JSON.stringify(errors)}`);
  else assert.deepEqual(errors, []);
}
const hit = (x: object) => ({ do: [{ op: "damage", amount: 10, ...x }] });
const scale = (stat: string) => ({ scale: [{ ratio: 1, stat }] });

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

test("complete mode flags a pack too small to ship", () => {
  const { issues } = validatePack(PACK, { complete: true });
  assert.ok(codes(issues).includes("complete.classes"));
  assert.ok(codes(issues).includes("complete.specsPerClass"));
  assert.ok(!codes(issues).includes("complete.verbs"), "17 verbs is inside 15–20");
});

// ─── Shape and references ────────────────────────────────────────────────────

test("schema: unknown fields are rejected", () => expectIssue("schema", (p) => (find(p.abilities, "cleave").range = 2)));
test("schema: unknown effect ops are rejected", () => expectIssue("schema", (p) => (find(p.abilities, "mend").do[0].op = "resurrect")));
test("schema: step 1's rule language is gone", () => expectIssue("schema", (p) => (find(p.abilities, "cleave").active = { action: "slash", cooldown: 2 })));
test("schema: enemies have no placement", () => expectIssue("schema", (p) => (p.dungeons[0].stages[0].enemies[0] = { enemy: "ash_wolf", row: "front" })));
test("ids are unique within a collection", () => expectIssue("id.duplicate", (p) => p.perks.push(clone(p.perks[0]))));
test("references resolve", () => expectIssue("ref.missing", (p) => (find(p.abilities, "barbed_arrows").do[0].apply[0].status = "poison")));
test("elements must exist", () => expectIssue("ref.missing", (p) => (find(p.abilities, "radiance").do[0].element = "thunder")));

// ─── The design's Part 2 ability cards ───────────────────────────────────────

test("cards: Shield Bash (physical, blunt, scales with Armor) is valid", () => card(hit({ type: "physical", subtype: "blunt", amount: scale("armor") })));
test("cards: Fire Bolt (magical, fire, scales with Magic) is valid", () => card(hit({ type: "magical", element: "fire", amount: scale("magic") })));
test("cards: Storm Ward (magical, scales with Armor) is valid: only Attack and Magic are type-locked", () => card(hit({ type: "magical", element: "holy", amount: scale("armor") })));
test("cards: Fire Slash (physical with an element) is invalid: physical instances have no element", () =>
  card(hit({ type: "physical", subtype: "slash", element: "fire" }), "instance.physical"));
test("cards: Strike (physical with no subtype) is invalid: every physical instance has a subtype", () => card(hit({ type: "physical" }), "instance.physical"));
test("cards: Ember Strike (magical, scales with Attack) is invalid: Attack scales only physical instances", () =>
  card(hit({ type: "magical", element: "fire", amount: scale("attack") }), "instance.scaling"));
test("cards: a physical hit scaling from Magic is invalid: Magic scales only magical instances", () =>
  card(hit({ type: "physical", subtype: "slash", amount: scale("magic") }), "instance.scaling"));
test("cards: Bolt (magical with no element) is invalid: every magical instance has an element", () => card(hit({ type: "magical" }), "instance.magical"));
test("cards: an action can't produce untyped damage: only pulses and reactions can", () => card(hit({ type: "none" }), "instance.untyped"));
test("cards: riders follow the same rules as hits", () =>
  card(hit({ type: "physical", subtype: "slash", riders: [{ type: "physical", element: "fire", amount: 5 }] }), "instance.physical"));
test("cards: a weapon follows them too", () => expectIssue("instance.magical", (p) => delete find(p.gear, "ash_staff").weapon.element));

// ─── Stats ───────────────────────────────────────────────────────────────────

test("stats: '+20 Crit chance' is a valid flat change; '+20% Crit chance' isn't, since Crit chance is already in points", () => {
  const p = clone(PACK) as any;
  find(p.gear, "bone_charm").stats = [{ stat: "crit_chance", flat: 20 }];
  assert.equal(validatePack(p).errors, 0);
  expectIssue("stat.pct", (q) => (find(q.gear, "bone_charm").stats = [{ stat: "crit_chance", pct: 20 }]));
});
test("stats: family members such as resist:<element> take flat changes only", () => expectIssue("stat.pct", (p) => (find(p.gear, "bone_charm").stats = [{ stat: "resist:fire", pct: 20 }])));
test("stats: Aggro's floor must be above 0, since weighted picks fail when every candidate is at 0", () => expectIssue("stat.aggroFloor", (p) => (find(p.stats, "aggro").floor = 0)));
test("stats: the engine's stats are in the registry, with the right kind", () => {
  expectIssue("stat.engine", (p) => (p.stats = p.stats.filter((s: any) => s.id !== "armor")));
  expectIssue("stat.engine", (p) => (find(p.stats, "evasion").kind = "amount"));
});
test("stats: a family member must name something real", () => {
  expectIssue("ref.missing", (p) => (find(p.enemies, "bog_wight").stats["resist:thunder"] = 10));
  expectIssue("stat.family", (p) => (find(p.enemies, "grey_mother").stats["immune:kind:sleep"] = 1));
  expectIssue("stat.family", (p) => (find(p.enemies, "grey_mother").stats["immune:everything"] = 1));
});
test("stats: an element can't take a name that's already a tag", () => expectIssue("element.reserved", (p) => p.elements.push({ id: "blunt", name: "Blunt" })));
test("timings count whole sub-ticks, so at most 3 decimals", () => expectIssue("timing.precision", (p) => (find(p.abilities, "cleave").cooldown = 12.0005)));

// ─── Statuses ────────────────────────────────────────────────────────────────

const status = (x: object) => (p: any) => p.statuses.push({ id: "probe", name: "PROBE", label: "buff", show: "icon", stacking: "refresh", ...x });

test("statuses: absorbs, caps, triggers and drops belong to Intensity statuses", () => {
  expectIssue("status.intensity", status({ absorb: true }));
  expectIssue("status.intensity", status({ drop: "all", trigger: { on: { event: "hit_taken" } } }));
});
test("statuses: an Intensity drop needs a trigger, and an Intensity status has one trigger", () => {
  expectIssue("status.drop", status({ stacking: "intensity", drop: "all", stats: [{ stat: "armor", flat: 1 }] }));
  expectIssue("status.trigger", status({ stacking: "intensity", drop: "all", pulse: { every: 2, do: [{ op: "heal", amount: 1 }] }, trigger: { on: { event: "hit_taken" } } }));
});
test("statuses: only Per source statuses know their source", () => {
  expectIssue("status.source", status({ reactions: [{ on: { event: "hit_taken" }, actor: "source", do: [{ op: "heal", amount: 1, to: "source" }] }] }));
  expectIssue("effect.to", status({ reactions: [{ on: { event: "hit_taken" }, do: [{ op: "heal", amount: 1, to: "source" }] }] }));
  const p = clone(PACK) as any;
  status({ perSource: { endsWithSource: true }, reactions: [{ on: { event: "hit_taken" }, actor: "source", do: [{ op: "heal", amount: 1, to: "source" }] }] })(p);
  assert.equal(codes(validatePack(p).issues, "error").length, 0);
});
test("statuses: a reaction's effects state their target", () => expectIssue("reaction.to", status({ reactions: [{ on: { event: "hit_taken" }, do: [{ op: "heal", amount: 1 }] }] })));
test("statuses: 'target' belongs to actions, and holder, source and other to statuses", () => {
  expectIssue("effect.to", status({ pulse: { every: 2, do: [{ op: "heal", amount: 1, to: "target" }] } }));
  expectIssue("effect.to", (p) => (find(p.abilities, "mend").do[0].to = "holder"));
  expectIssue("effect.to", status({ pulse: { every: 2, do: [{ op: "heal", amount: 1, to: "other" }] } }));
});
test("statuses: inside a status, a stat scale says whose stat it reads: source or holder", () => {
  expectIssue("scale.of", status({ pulse: { every: 2, do: [{ op: "heal", amount: { scale: [{ ratio: 1, stat: "magic" }] } }] } }));
  expectIssue("scale.of", (p) => (find(p.abilities, "mend").do[0].amount = { scale: [{ ratio: 1, stat: "magic", of: "holder" }] }));
});
test("statuses: only a reaction has an event amount to scale from", () =>
  expectIssue("scale.amount", status({ pulse: { every: 2, do: [{ op: "heal", amount: { scale: [{ ratio: 1, amount: true }] } }] } })));
test("statuses: hits, riders and attached statuses belong to an action's hits", () =>
  expectIssue("effect.hitOnly", status({ pulse: { every: 2, do: [{ op: "damage", type: "none", amount: 1, hits: 2 }] } })));
test("statuses: stacks are only for Intensity statuses, and a 0-tick application only for an interrupting lockout", () => {
  expectIssue("apply.stacks", (p) => (find(p.abilities, "barbed_arrows").do[0].apply[0].stacks = 3));
  expectIssue("apply.instant", (p) => (find(p.abilities, "barbed_arrows").do[0].apply[0].duration = 0));
});
test("statuses: event filters fit their events", () => {
  expectIssue("event.kind", status({ reactions: [{ on: { event: "status_gained", kind: "basic" }, do: [{ op: "heal", amount: 1, to: "holder" }] }] }));
  expectIssue("event.cause", status({ reactions: [{ on: { event: "hit_taken", cause: ["expired"] }, do: [{ op: "heal", amount: 1, to: "holder" }] }] }));
});
test("statuses: a tag nothing carries is reported", () => expectIssue("tag.unknown", status({ boosts: [{ tag: "thunder", pct: 10 }] }), { level: "warning" }));
test("targeting: picking the lowest or highest needs 'by'", () => expectIssue("target.by", (p) => delete find(p.abilities, "lunge").target.by));

// ─── Units ───────────────────────────────────────────────────────────────────

test("each specialization has 4 abilities", () => expectIssue("spec.abilityCount", (p) => find(p.specializations, "warrior_vanguard").abilities.pop()));
test("abilities don't cross classes", () => expectIssue("spec.abilityClass", (p) => (find(p.specializations, "warrior_vanguard").abilities[0] = "riposte")));

// ─── Formations ──────────────────────────────────────────────────────────────

test("formations always have 5 slots", () => expectIssue("formation.positions", (p) => find(p.formations, "phalanx").positions.pop()));
test("two slots aren't drawn in the same place", () =>
  expectIssue("formation.layout", (p) => (find(p.formations, "phalanx").positions[1].layout.column = 0)));
test("slots with effects tell the player what they do", () =>
  expectIssue("formation.slotText", (p) => delete find(p.formations, "hunting_party").positions[0].text, { level: "warning" }));
test("formation grants are checked", () => expectIssue("ref.missing", (p) => (find(p.formations, "flash_flood").stats[1].stat = "dodge")));
test("fights hold at most maxEnemies", () => expectIssue("fight.size", (p) => (p.dungeons[0].stages[0].enemies = Array(7).fill("ash_wolf"))));

// ─── Gear ────────────────────────────────────────────────────────────────────

test("efficacy gear changes numbers only: no statuses", () => expectIssue("gear.simple", (p) => (find(p.gear, "bone_charm").statuses = ["horn_call"])));
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
test("a perk gives something", () => expectIssue("perk.empty", (p) => delete find(p.perks, "keen_eyes").stats));
test("challenges must be possible: two of a class needs two units of it", () =>
  expectIssue("challenge.impossible", (p) => (p.dungeons[0].challenges[0].constraints[0].classCount.min = 3)));
test("starter content is marked as starter", () => expectIssue("starter.source", (p) => (find(p.formations, "open_order").source = "unlock")));
test("every dungeon is in the progression", () => expectIssue("progression.missing", (p) => (p.progression.dungeonOrder = ["somewhere_else"])));

// ─── Traits and keyholes ─────────────────────────────────────────────────────

test("traits: each word has one verb profile", () => expectIssue("trait.profile", (p) => (find(p.traits, "festering").verbs = ["evasion"])));
test("traits: the word appears in the enemy's text", () => expectIssue("enemy.traitText", (p) => (find(p.enemies, "ash_wolf").text = "A lean grey wolf.")));
test("keyholes: bosses have 2 to 4", () => expectIssue("enemy.keyholes", (p) => (find(p.enemies, "grey_mother").keyholes = find(p.enemies, "grey_mother").keyholes.slice(0, 1))));
test("keyholes: grounded in one of the enemy's own verbs", () => expectIssue("keyhole.from", (p) => (find(p.enemies, "grey_mother").keyholes[0].from = "evasion")));
test("keyholes: a verb can't both counter and be blunted", () =>
  expectIssue("keyhole.contradiction", (p) => find(p.enemies, "grey_mother").keyholes[0].strongAgainst.push("burst")));

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
