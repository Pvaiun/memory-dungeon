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

/** Add an ability to the Warrior class and expect it to be clean, or to raise `code`. */
function card(ability: object, code?: string) {
  const p = clone(PACK) as any;
  p.abilities.push({ id: "card", class: "warrior", name: "Card", text: "-", cooldown: 10, ...ability });
  const { issues } = validatePack(p);
  const errors = codes(issues, "error");
  if (code) assert.ok(errors.includes(code), `expected '${code}', got ${JSON.stringify(errors)}`);
  else assert.deepEqual(errors, []);
}
const hit = (x: object) => ({ do: [{ op: "damage", amount: 10, ...x }] });
const scale = (stat: string) => ({ scale: [{ ratio: 1, stat }] });

test("the worked example is clean, apart from the plain weapons it never had", () => {
  const { issues } = validatePack(PACK);
  assert.deepEqual(codes(issues, "error"), []);
  assert.deepEqual([...new Set(codes(issues, "warning"))], ["gear.plain"]);
});

test("the example party is valid and eligible for the right challenges", () => {
  assert.deepEqual(checkParty(PACK, PARTY, { dungeon: DUNGEON }), []);
  assert.deepEqual(unmetConstraints(PACK, PARTY, DUNGEON, "with_duelist"), []);
  assert.deepEqual(unmetConstraints(PACK, PARTY, DUNGEON, "in_phalanx"), []);
  assert.deepEqual(unmetConstraints(PACK, PARTY, DUNGEON, "two_units"), ["party size 3"]);
});

test("teasers are derived from data", () => {
  const t = teaser(PACK, DUNGEON, "with_duelist", { classes: ["warrior", "ranger"], formations: ["open_order"] });
  assert.equal(t.teased, true);
  assert.deepEqual(t.needs, ["class duelist"]);
  assert.equal(teaser(PACK, DUNGEON, "with_duelist", { classes: ["ranger", "duelist"] }).teased, false);
  assert.equal(teaser(PACK, DUNGEON, "in_phalanx", { classes: ["warrior"], formations: ["open_order"] }).teased, true);
});

test("complete mode flags a pack too small to ship", () => {
  const { issues } = validatePack(PACK, { complete: true });
  assert.ok(codes(issues).includes("complete.classes"));
});

// ─── Shape and references ────────────────────────────────────────────────────

test("schema: unknown fields are rejected", () => expectIssue("schema", (p) => (find(p.abilities, "cleave").range = 2)));
test("schema: unknown effect ops are rejected", () => expectIssue("schema", (p) => (find(p.abilities, "mend").do[0].op = "resurrect")));
test("schema: step 1's rule language and vocabulary are gone", () => {
  expectIssue("schema", (p) => (find(p.abilities, "cleave").active = { action: "slash", cooldown: 2 }));
  expectIssue("schema", (p) => (find(p.abilities, "cleave").verbs = []));
  expectIssue("schema", (p) => (find(p.enemies, "grey_mother").keyholes = []));
});
test("schema: enemies have no placement", () => expectIssue("schema", (p) => (p.dungeons[0].stages[0].enemies[0] = { enemy: "ash_wolf", row: "front" })));
test("ids are unique within a collection", () => expectIssue("id.duplicate", (p) => p.perks.push(clone(p.perks[0]))));
test("references resolve", () => expectIssue("ref.missing", (p) => (find(p.abilities, "barbed_arrows").do[0].apply[0].status = "poison")));
test("schema: elements and physical subtypes are gone (step 5j)", () => {
  expectIssue("schema", (p) => (find(p.abilities, "radiance").do[0].element = "holy"));
  expectIssue("schema", (p) => (find(p.abilities, "cleave").do[0].subtype = "slash"));
  expectIssue("schema", (p) => (p.elements = [{ id: "holy", name: "Holy" }]));
});

// ─── The design's Part 2 ability cards ───────────────────────────────────────

test("cards: Shield Bash (physical, scales with Armor) is valid", () => card(hit({ type: "physical", amount: scale("armor") })));
test("cards: Fire Bolt (magical, scales with Magic) is valid: a fire theme lives in its name only", () => card(hit({ type: "magical", amount: scale("magic") })));
test("cards: Storm Ward (magical, scales with Armor) is valid: no stat is tied to a damage type", () => card(hit({ type: "magical", amount: scale("armor") })));
test("cards: Fire Slash (physical with an element) is invalid: there are no elements", () => card(hit({ type: "physical", element: "fire" }), "schema"));
test("cards: Strike (physical) and Bolt (magical) need nothing else: no subtype, no element", () => {
  card(hit({ type: "physical" }));
  card(hit({ type: "magical" }));
});
test("cards: no stat is tied to a damage type: Ember Strike (magical, from Attack) and a physical hit from Magic are valid", () => {
  card(hit({ type: "magical", amount: scale("attack") }));
  card(hit({ type: "physical", amount: scale("magic") }));
});
test("cards: a hit can scale from several stats: a Shield Bash from 0.7 × Armor + 0.3 × Attack", () =>
  card(hit({ type: "physical", amount: { scale: [{ ratio: 0.7, stat: "armor" }, { ratio: 0.3, stat: "attack" }] } })));
test("cards: a weapon states its own damage; nothing scales it by default", () => expectIssue("schema", (p) => delete find(p.gear, "ash_staff").weapon.amount));
test("cards: an action can't produce untyped damage: only pulses and reactions can", () => card(hit({ type: "none" }), "instance.untyped"));
test("cards: riders follow the same rules as hits", () => card(hit({ type: "physical", riders: [{ type: "none", amount: 5 }] }), "instance.untyped"));
test("cards: a weapon kind states its type and hands, and nothing else (step 5j)", () => {
  expectIssue("schema", (p) => delete find(p.weaponKinds, "holy_staff").hands);
  expectIssue("schema", (p) => (find(p.weaponKinds, "holy_staff").element = "holy"));
});

// ─── The core set's additions ────────────────────────────────────────────────

test("scales: a condition can be a source, and a live stat can multiply a term; an event amount says whose stat multiplies it", () => {
  card(hit({ type: "physical", amount: { scale: [{ ratio: 10, when: { buffs: true }, of: "target" }] } }));
  card(hit({ type: "physical", amount: { scale: [{ ratio: 1, stat: "attack", times: { stat: "crit_chance" } }] } }));
  const status = (x: object) => (p: any) => p.statuses.push({ id: "probe", name: "PROBE", label: "buff", show: "icon", stacking: "refresh", ...x });
  expectIssue("scale.times", status({ reactions: [{ on: { event: "hit_lands" }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "attack" } }] }, to: "self" }] }] }));
  const p = clone(PACK) as any;
  status({ reactions: [{ on: { event: "hit_lands" }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "attack", of: "holder" } }] }, to: "self" }] }] })(p);
  assert.deepEqual(codes(validatePack(p).issues, "error"), []);
});
test("targeting: ifNone needs a where; exclude belongs to extra targets, not an action's own rule; by can be the highest of several stats", () => {
  card({ target: { side: "foes", ifNone: "any" }, ...hit({ type: "physical" }) }, "target.ifNone");
  card({ target: { side: "foes", exclude: "targets" }, ...hit({ type: "physical" }) }, "target.exclude");
  card({ do: [{ op: "damage", type: "physical", amount: 1 }, { op: "damage", type: "physical", amount: 1, to: { side: "foes", exclude: "targets", count: 3 } }] });
  card({ target: { side: "foes", pick: "highest", by: { stats: ["attack", "magic"] } }, ...hit({ type: "physical" }) });
  card({ target: { side: "foes", pick: "highest", by: { stats: ["attack", "luck"] } }, ...hit({ type: "physical" }) }, "ref.missing");
});
test("revive: targets knocked-out units, through the ability's rule or its own", () => {
  card({ target: { side: "allies", where: { ko: true } }, do: [{ op: "revive", hp: 10 }] });
  card({ target: { side: "allies" }, do: [{ op: "revive", hp: 10 }] }, "revive.target");
  card({ do: [{ op: "revive", hp: 10, to: { side: "allies", where: { ko: true }, pick: "random" } }] });
});
test("conditions: atCap and belowCap name a capped Intensity status", () => {
  card({ target: { side: "allies", where: { belowCap: "barrier" } }, do: [{ op: "apply", status: "barrier", stacks: 5 }] });
  card({ target: { side: "allies", where: { belowCap: "stun" } }, do: [{ op: "apply", status: "barrier", stacks: 5 }] }, "cond.cap");
});
test("summon and replace name an enemy", () => {
  card({ do: [{ op: "summon", enemy: "ash_wolf", count: 2 }] });
  card({ do: [{ op: "summon", enemy: "nobody" }] }, "ref.missing");
});
test("statuses: seek covers basic, ability or all; a strike's rule and stat are checked; a bare pulse is a timer for a drop", () => {
  const status = (x: object) => (p: any) => p.statuses.push({ id: "probe", name: "PROBE", label: "buff", show: "sheet", stacking: "refresh", ...x });
  expectIssue("status.seek", status({ seek: "fire" }));
  expectIssue("ref.missing", status({ strike: { scale: "luck", to: "target" } }));
  expectIssue("status.pulse", status({ pulse: { every: 3 } }));
  const p = clone(PACK) as any;
  status({ seek: "basic" })(p);
  p.statuses.push({ id: "arc", name: "Arc", label: "buff", show: "sheet", stacking: "refresh", strike: { to: { side: "foes", pick: "random", exclude: "targets" } } });
  p.statuses.push({ id: "might", name: "MIGHT", label: "buff", show: "icon", stacking: "intensity", boosts: [{ tag: "physical", pct: 10 }], pulse: { every: 3 }, drop: { count: 1 } });
  assert.deepEqual(codes(validatePack(p).issues, "error"), []);
});
test("events: tags filter hit events only, and a damage event can name the status that dealt it", () => {
  const status = (x: object) => (p: any) => p.statuses.push({ id: "probe", name: "PROBE", label: "buff", show: "sheet", stacking: "refresh", ...x });
  expectIssue("event.tags", status({ reactions: [{ on: { event: "ko", tags: ["physical"] }, do: [{ op: "heal", amount: 1, to: "holder" }] }] }));
  const p = clone(PACK) as any;
  status({ reactions: [{ on: { event: "damage_dealt", status: "thorns" }, do: [{ op: "apply", status: "bleed", to: "other" }] }, { on: { event: "hit_taken", tags: ["physical", "magical"] }, do: [{ op: "heal", amount: 1, to: "holder" }] }] })(p);
  assert.deepEqual(codes(validatePack(p).issues, "error"), []);
});
test("weapons: a piece names a kind, or an enemy's weapon states type and cooldown itself", () => {
  expectIssue("gear.weapon", (p) => delete find(p.gear, "ash_staff").weapon.kind);
  expectIssue("weapon.kind", (p) => delete find(p.enemies, "ash_wolf").weapon.cooldown);
  expectIssue("ref.missing", (p) => (find(p.gear, "ash_staff").weapon.kind = "wand"));
});
test("stat families: immune:dispel is one", () => {
  const p = clone(PACK) as any;
  find(p.enemies, "grey_mother").stats["immune:dispel"] = 1;
  assert.deepEqual(codes(validatePack(p).issues, "error"), []);
});

// ─── Stats ───────────────────────────────────────────────────────────────────

test("stats: '+20 Crit chance' is a valid flat change; '+20% Crit chance' isn't, since Crit chance is already in points", () => {
  const p = clone(PACK) as any;
  find(p.gear, "bone_charm").stats = [{ stat: "crit_chance", flat: 20 }];
  assert.equal(validatePack(p).errors, 0);
  expectIssue("stat.pct", (q) => (find(q.gear, "bone_charm").stats = [{ stat: "crit_chance", pct: 20 }]));
});
test("stats: family members such as immune:status:<status> take flat changes only", () => expectIssue("stat.pct", (p) => (find(p.gear, "bone_charm").stats = [{ stat: "immune:status:bleed", pct: 20 }])));
test("stats: Aggro's floor must be above 0, since weighted picks fail when every candidate is at 0", () => expectIssue("stat.aggroFloor", (p) => (find(p.stats, "aggro").floor = 0)));
test("stats: the engine's stats are in the registry, with the right kind", () => {
  expectIssue("stat.engine", (p) => (p.stats = p.stats.filter((s: any) => s.id !== "armor")));
  expectIssue("stat.engine", (p) => (find(p.stats, "evasion").kind = "amount"));
});
test("stats: a family member must name something real", () => {
  expectIssue("ref.missing", (p) => (find(p.enemies, "bog_wight").stats["immune:status:thunder"] = 10));
  expectIssue("stat.family", (p) => (find(p.enemies, "bog_wight").stats["resist:holy"] = 10));
  expectIssue("stat.family", (p) => (find(p.enemies, "grey_mother").stats["immune:kind:sleep"] = 1));
  expectIssue("stat.family", (p) => (find(p.enemies, "grey_mother").stats["immune:everything"] = 1));
});
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
test("statuses: a status with one applier at a time knows its source; a shared Intensity total doesn't", () => {
  const react = { reactions: [{ on: { event: "hit_taken" }, actor: "source", do: [{ op: "heal", amount: 1, to: "source" }] }] };
  const shared = { stacking: "intensity", ...react };
  expectIssue("status.source", status(shared));
  expectIssue("effect.to", status({ stacking: "intensity", reactions: [{ on: { event: "hit_taken" }, do: [{ op: "heal", amount: 1, to: "source" }] }] }));
  expectIssue("scale.of", status({ stacking: "intensity", pulse: { every: 2, do: [{ op: "heal", amount: { scale: [{ ratio: 1, stat: "magic", of: "source" }] } }] } }));
  for (const x of [react, { stacking: "fizzle", ...react }, { ...shared, perSource: { endsWithSource: true } }]) {
    const p = clone(PACK) as any;
    status(x)(p);
    assert.deepEqual(codes(validatePack(p).issues, "error"), []);
  }
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
test("status damage is untyped by convention, but a pulse can be typed, and any stat can scale it", () => {
  const p = clone(PACK) as any;
  find(p.statuses, "bleed").pulse.do[0] = { op: "damage", type: "physical", amount: { scale: [{ ratio: 0.3, stat: "attack", of: "source" }] } };
  find(p.statuses, "rot").pulse.do[0].amount = { scale: [{ ratio: 0.3, stat: "magic", of: "source" }] };
  assert.deepEqual(codes(validatePack(p).issues, "error"), []);
});
test("status damage: an application's stacks scale from whatever it states, Magic included", () => {
  const p = clone(PACK) as any;
  p.statuses.push({ id: "burn", name: "BURN", label: "debuff", show: "icon", stacking: "intensity", pulse: { every: 2, do: [{ op: "damage", type: "none", amount: 1 }] }, drop: { fraction: 0.5 } });
  find(p.abilities, "radiance").do.push({ op: "apply", status: "burn", stacks: { scale: [{ ratio: 0.3, stat: "magic" }] } });
  assert.deepEqual(codes(validatePack(p).issues, "error"), []);
});
test("status numbers can read stats; heals, shields and typed counterattacks scale as stated", () => {
  const p = clone(PACK) as any;
  find(p.statuses, "bleed").pulse.do[0].amount = { scale: [{ ratio: 0.5, stat: "armor", of: "source" }] };
  p.statuses.push({ id: "regen", name: "REGEN", label: "buff", show: "icon", stacking: "refresh", duration: 10, pulse: { every: 2, do: [{ op: "heal", amount: { scale: [{ ratio: 0.2, stat: "magic", of: "source" }] } }] } });
  find(p.abilities, "mend").do.push({ op: "apply", status: "regen" });
  assert.deepEqual(codes(validatePack(p).issues, "error"), [], "the worked example's Blessed Ward (shield stacks from Magic) and Riposte (a physical counter from Attack) stay valid too");
});
test("statuses: a tag nothing carries is reported", () => expectIssue("tag.unknown", status({ boosts: [{ tag: "thunder", pct: 10 }] }), { level: "warning" }));
test("targeting: picking the lowest or highest needs 'by'", () => expectIssue("target.by", (p) => delete find(p.abilities, "lunge").target.by));

// ─── Units ───────────────────────────────────────────────────────────────────

test("each class has the design's number of abilities", () => expectIssue("class.abilityCount", (p) => find(p.classes, "warrior").abilities.pop()));
test("abilities don't cross classes", () => expectIssue("class.abilityClass", (p) => (find(p.classes, "warrior").abilities[0] = "riposte")));
test("a class's weapon kinds exist", () => expectIssue("ref.missing", (p) => (find(p.classes, "warrior").weapons = ["club"])));

// ─── Formations ──────────────────────────────────────────────────────────────

test("formations always have the design's number of slots", () => expectIssue("formation.positions", (p) => find(p.formations, "phalanx").positions.pop()));
test("two slots aren't drawn in the same place", () =>
  expectIssue("formation.layout", (p) => (find(p.formations, "phalanx").positions[1].layout.column = 0)));
test("slots with effects tell the player what they do", () =>
  expectIssue("formation.slotText", (p) => delete find(p.formations, "hunting_party").positions[0].text, { level: "warning" }));
test("formation grants are checked", () => expectIssue("ref.missing", (p) => (find(p.formations, "flash_flood").stats[1].stat = "dodge")));
test("fights hold at most maxEnemies", () => expectIssue("fight.size", (p) => (p.dungeons[0].stages[0].enemies = Array(7).fill("ash_wolf"))));

// ─── Gear ────────────────────────────────────────────────────────────────────

test("gear: powerful pieces come from unlocks, ordinary ones from drops or the start", () => {
  expectIssue("gear.source", (p) => (find(p.gear, "ullrs_yew").source = "drop"));
  expectIssue("gear.source", (p) => (find(p.gear, "bone_charm").source = "unlock"));
});
test("gear: armor has an armor type and nothing else does; offhands have a kind; only weapons set a basic attack", () => {
  expectIssue("gear.armor", (p) => delete find(p.gear, "studded_jerkin").armor);
  expectIssue("gear.armor", (p) => (find(p.gear, "bone_charm").armor = "light"));
  expectIssue("ref.missing", (p) => (find(p.gear, "studded_jerkin").armor = "chainmail"));
  expectIssue("gear.offhand", (p) => p.gear.push({ id: "board", name: "Board", text: "-", slot: "offhand", tier: "ordinary", source: "drop" }));
  expectIssue("gear.offhand", (p) => (find(p.gear, "bone_charm").offhand = "buckler"));
  expectIssue("gear.weapon", (p) => (find(p.gear, "bone_charm").weapon = { kind: "sword", amount: 1 }));
});
test("classes: every class has a one-handed kind, so it can always hold an offhand; its armor types and offhand kinds exist", () => {
  expectIssue("class.oneHanded", (p) => (find(p.weaponKinds, "sword").hands = 2));
  expectIssue("ref.missing", (p) => (find(p.classes, "warrior").offhands = ["tower_shield"]));
  expectIssue("ref.missing", (p) => (find(p.classes, "warrior").armor = ["plate"]));
});
test("parties, step 5j: a class wears only its armor types; a two-handed weapon empties the offhand; a mythic fits its one class, one a unit", () => {
  const p = clone(PACK) as any;
  p.gear.push({ id: "buckler_a", name: "Buckler", text: "-", slot: "offhand", tier: "ordinary", source: "drop", offhand: "buckler" });
  p.gear.push({ id: "myth_a", name: "Myth", text: "-", slot: "amulet", tier: "powerful", source: "unlock", mythic: "warrior" });
  p.gear.push({ id: "myth_b", name: "Myth", text: "-", slot: "offhand", tier: "powerful", source: "unlock", mythic: "warrior" });
  assert.deepEqual(codes(validatePack(p).issues, "error"), []);
  const party = (gear: Record<string, string>, cls = "warrior") => ({ formation: PARTY.formation, units: [{ ...PARTY.units[0], class: cls, abilities: cls === "warrior" ? PARTY.units[0].abilities : find(p.classes, cls).abilities.slice(0, p.design.abilitiesEquipped), gear }] });
  assert.deepEqual(codes(checkParty(p, party({ weapon: "notched_blade", offhand: "buckler_a", amulet: "myth_a" }))), []);
  assert.deepEqual(codes(checkParty(p, party({ weapon: "notched_blade", armor: "studded_jerkin" }, "cleric"))), ["party.gearClass", "party.gearClass"]);
  find(p.weaponKinds, "sword").hands = 2;
  assert.deepEqual(codes(checkParty(p, party({ weapon: "notched_blade", offhand: "buckler_a" }))), ["party.twoHanded"]);
  find(p.weaponKinds, "sword").hands = 1;
  assert.deepEqual(codes(checkParty(p, party({ weapon: "notched_blade", amulet: "myth_a", offhand: "myth_b" }))), ["party.mythics"]);
  assert.deepEqual(codes(checkParty(p, party({ weapon: "ullrs_yew", amulet: "myth_a" }, "ranger"))), ["party.gearClass"]);
});
test("gear: a class without a plain weapon of its first kind is reported", () => expectIssue("gear.plain", () => {}, { level: "warning" }));
test("loot tables drop only drop gear", () => expectIssue("loot.source", (p) => p.dungeons[0].loot.replay.table.push({ gear: "ullrs_yew", weight: 1 })));
test("challenges pay gear", () => expectIssue("loot.empty", (p) => (p.dungeons[0].challenges[0].loot = {})));
test("a dungeon may pay nothing at all: the core set has no progression yet", () => {
  const p = clone(PACK) as any;
  delete p.dungeons[0].loot;
  p.dungeons[0].challenges = [];
  assert.deepEqual(codes(validatePack(p).issues, "error"), []);
});

// ─── Runs ────────────────────────────────────────────────────────────────────

test("perk pools hold the design's number of perks", () => expectIssue("dungeon.perkPool", (p) => (p.dungeons[0].perkPool = p.dungeons[0].perkPool.slice(0, 9))));
test("runs have the design's number of perk picks", () =>
  expectIssue("dungeon.perkPicks", (p) => (p.dungeons[0].stages = p.dungeons[0].stages.filter((s: any) => s.id !== "pick_3"))));
test("perk picks happen between fights", () =>
  expectIssue("dungeon.stageOrder", (p) => {
    const st = p.dungeons[0].stages;
    [st[2], st[3]] = [st[3], st[2]];
  }));
test("a run ends in a boss", () => expectIssue("dungeon.boss", (p) => delete p.dungeons[0].stages.at(-1).boss));
test("a boss fight has a boss", () => expectIssue("fight.bossRank", (p) => (p.dungeons[0].stages.at(-1).enemies = ["ash_wolf"])));
test("dungeons cap party size inside the design's range", () => expectIssue("dungeon.partySize", (p) => (p.dungeons[0].partySize.max = 6)));
test("perk picks offer the design's number of options", () => expectIssue("design.perkOptions", (p) => (p.ruleset.run.perkOffer.options = 4)));
test("a perk gives something", () => expectIssue("perk.empty", (p) => delete find(p.perks, "keen_eyes").stats));
test("challenges must be possible: a class can't be both required and excluded", () =>
  expectIssue("challenge.impossible", (p) => p.dungeons[0].challenges[0].constraints.push({ excludesClass: "duelist" })));
test("challenges must be possible: required classes fit in the party", () =>
  expectIssue("challenge.impossible", (p) => p.dungeons[0].challenges[0].constraints.push({ includesClass: "warrior" }, { partySize: { max: 1 } })));
test("starter content is marked as starter", () => expectIssue("starter.source", (p) => (find(p.formations, "open_order").source = "unlock")));
test("every dungeon is in the progression", () => expectIssue("progression.missing", (p) => (p.progression.dungeonOrder = ["somewhere_else"])));

// ─── Party loadouts ──────────────────────────────────────────────────────────

function expectParty(code: string, mutate: (p: any) => void, opts: Parameters<typeof checkParty>[2] = { dungeon: DUNGEON }) {
  const party = clone(PARTY) as any;
  mutate(party);
  const got = codes(checkParty(PACK, party, opts));
  assert.ok(got.includes(code), `expected '${code}', got ${JSON.stringify(got)}`);
}
test("party: each class is one unit", () => expectParty("party.uniqueClass", (p) => (p.units[2].class = "duelist")));
test("party: the example party is fine", () => assert.deepEqual(checkParty(PACK, PARTY, { dungeon: DUNGEON }), []));
test("party: units equip exactly the design's number of abilities", () => expectParty("party.abilities", (p) => p.units[0].abilities.push("second_wind")));
test("party: abilities come from the unit's class", () => expectParty("party.abilityNotOwned", (p) => (p.units[0].abilities[1] = "riposte")));
test("party: gear goes in a matching slot", () => expectParty("party.gearSlot", (p) => (p.units[0].gear.armor = "bone_charm")));
test("party: there are three slots", () => expectParty("party.slot", (p) => (p.units[0].gear.ring = "bone_charm")));
test("party: a weapon's kind must be one the class can use", () => expectParty("party.gearClass", (p) => (p.units[0].gear.weapon = "hunters_shortbow")));
test("party: armor no heavier than the class can wear", () => {
  const cleric = { formation: "open_order", units: [{ class: "cleric", position: "a", abilities: ["mend", "purify", "blessed_ward"], gear: { armor: "studded_jerkin" } }] };
  assert.deepEqual(codes(checkParty(PACK, cleric, { dungeon: DUNGEON })), ["party.gearClass"], "a light class in medium armor");
});
test("party: dungeon caps party size", () =>
  expectParty("party.size", (p) => p.units.push({ class: "cleric", position: "right_striker", abilities: ["mend", "purify", "blessed_ward"], gear: {} })));
test("party: positions exist and are free", () => expectParty("party.position", (p) => (p.units[1].position = "shield_point")));
test("party: ownership is checked when given", () =>
  expectParty("party.notOwned", () => {}, { dungeon: DUNGEON, owned: { classes: ["warrior", "ranger"], formations: ["phalanx"] } }));
test("party: copies of gear can be shared up to the count owned", () => {
  const party = clone(PARTY) as any;
  party.units[0].gear.amulet = "bone_charm";
  party.units[2].gear.amulet = "bone_charm";
  const owned = (n: number) => ({ gear: { notched_blade: 1, studded_jerkin: 1, fencers_rapier: 1, yata_mirror: 1, ullrs_yew: 1, wolfhide_cloak: 1, bone_charm: n } });
  assert.deepEqual(codes(checkParty(PACK, party, { dungeon: DUNGEON, owned: owned(2) })), []);
  assert.deepEqual(codes(checkParty(PACK, party, { dungeon: DUNGEON, owned: owned(1) })), ["party.gearCount"]);
});
