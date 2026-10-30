/** Prints PRIMITIVES.md: the closed sets of engine primitives, generated from the schema. */
import * as S from "./schema.js";

const out: string[] = [];
const h = (t: string) => out.push(`\n## ${t}\n`);
const table = (o: Record<string, string>, head = "Value") => {
  out.push(`| ${head} | Meaning |`, "| --- | --- |");
  for (const [k, v] of Object.entries(o)) out.push(`| \`${k}\` | ${v.replace(/\|/g, "\\|")} |`);
};
const fields = (o: { shape: Record<string, { description?: string }> }, skip: string[] = []) => {
  out.push("| Field | Meaning |", "| --- | --- |");
  for (const [k, v] of Object.entries(o.shape)) if (!skip.includes(k)) out.push(`| \`${k}\` | ${(v.description ?? "").replace(/\|/g, "\\|")} |`);
};

out.push(
  "# Engine primitives",
  "",
  `Generated from \`src/schema.ts\` (schema ${S.SCHEMA_VERSION}) by \`npm run docs\`. Do not edit by hand.`,
  "",
  "The engine runs the core set's combat system (`docs/core-set/rules-and-vocabulary.md`) on step 4's machinery (`steps/04-combat-concepts/design.md`), whose finer rules stand where the core set is silent. This is the closed set of building blocks it runs on. Each needs engine code, so adding one is a schema version bump plus an engine change. Stats, weapon kinds, armor types, offhand kinds, statuses, abilities and everything else are registries in the pack, and grow without touching the schema. The numbers in the content are first values, placeholders until the balance pass.",
);

h("How a fight runs");
out.push(
  [
    `Time is counted in sub-ticks, ${S.SUBTICKS} per tick. Each moment is the next sub-tick on which anything happens:`,
    "1. Units that are ready start their first available action: equipped abilities in slot order, then the basic attack.",
    "2. Everything due resolves one item at a time: the party batch, then the enemy batch; within a batch, pulses, then reactions, then actions, each in slot order, then in order of creation.",
    "3. Statuses whose last sub-tick this is end.",
    "",
    "A unit that becomes ready, or whose action becomes available, because of something resolved in steps 2 or 3 starts on the next sub-tick. Reactions resolve on the sub-tick after their event. A fight ends the moment either side is fully KO'd. Knocked-out party units join later fights knocked out, so a revive can raise them; summoned units join mid-fight with every action on cooldown.",
  ].join("\n"),
);

h("Gear slots");
table(S.SLOTS, "Slot");
out.push("", "A weapon belongs to a kind (a registry: speed, damage type and hands), a piece of armor to an armor type and an offhand to an offhand kind (registries of names). A class lists the weapon kinds, armor types and offhand kinds it can use. A two-handed weapon empties the offhand. A mythic piece fits one class, in any slot, and a unit wears one at most. Step 5i: every piece has its own fixed rarity (common, uncommon, rare, legendary, mythic: no affixes), and every formation its own (common, rare, legendary).");

h("Effects (in actions, pulses, triggers and reactions)");
out.push("| Op | Fields | Meaning |", "| --- | --- | --- |");
for (const o of S.Effect.options) {
  const f = Object.keys(o.shape).filter((k) => k !== "op");
  out.push(`| \`${o.shape.op.value}\` | ${f.map((x) => `\`${x}\``).join(", ")} | ${o.description ?? ""} |`);
}
out.push("");
h("Cooldown changes (the `cooldown` effect)");
table(S.COOLDOWN_WHICH, "Which");
out.push("");
table(S.COOLDOWN_SET, "Set");

h("Effect targets (`to`)");
out.push("Or a targeting rule. Extra targets after an action's first ignore Taunt.", "");
table(S.TO, "To");

h("Damage types");
table(S.TYPES, "Type");
out.push("", "There are no elements and no physical subtypes (step 5j): an element is a theme in a name, never a mechanic.");

h("Numbers");
out.push("A number is a plain number, or `{ base, scale: [...] }`: base + Σ ratio × source (× times). A scale reads one of `stat`, `hp` (current or missing), `stacks` (a status's Intensity total), `amount` (a reaction's event amount) or `when` (1 if a condition holds), from:", "");
table(S.SCALE_OF, "Of");
out.push("");
fields(S.Scale);
out.push("", "A scale's `count` (step 5i):", "");
table(S.COUNTS, "Count");

h("Status fields");
fields(S.Status, ["id", "name", "text", "note"]);

h("Status labels");
table(S.LABELS, "Label");

h("Reactions");
fields(S.Reaction);
out.push("", "A reaction's `if` is a condition (below), or a test of one of its event's units:", "");
fields(S.EventUnitTest);

h("Ability changes (a status's `mods`, step 5i)");
out.push("Each change reaches the holder's own abilities, read each time one is used: when it's checked, when it starts, when it pays, when it picks, when it hits.", "");
fields(S.AbilityMod);
out.push("", "Its `of`:", "");
fields(S.AbilityFilter);

h("Crits by condition (a status's `crits`, step 5i)");
fields(S.CritRule);

h("Effect kinds (for immunity, removal and conditions)");
table(S.KINDS, "Kind");

h("Tags (for boosts, damage-taken modifiers, lockouts, riders, Seek and event filters)");
table(S.TAGS, "Tag");

h("Events");
table(S.EVENTS, "Event");
out.push("");
fields(S.EventSpec, ["event"]);
h("Event `whose`");
table(S.WHOSE);
h("Status-ended causes");
table(S.CAUSES, "Cause");

h("Targeting rules");
out.push(
  "An action's `target` is `foe` (default targeting: a foe by Aggro, under the Hidden rule and, without Seek, the Taunt rule), `ally` (a random ally), `self`, or a rule: a side, an optional `where` filter, a pick and a count. The Taunt rule applies to an action's own rule too: without Seek, its first pick can only go to a Taunting foe, whatever the phrase asks for. Hidden foes can't be picked by any rule but `all`, unless every foe is Hidden.",
  "",
);
table(S.SIDES, "Side");
out.push("");
table(S.PICKS, "Pick");
out.push("");
fields(S.TargetRule, ["side", "pick"]);
out.push("", `\`by\` (for lowest and highest): \`hp\`, \`hp_share\`, \`mp_share\`, \`buffs\`, \`debuffs\`, \`swing\` (step 5i: the basic attack's interval now; highest is the slowest), \`{ stat }\`, \`{ stats }\` (the highest of several) or \`{ stacks }\`.`);
out.push("", "Basic attacks pick in this order (step 5i): an `aim` with `first` the attacker holds; a foe holding a `focus` status (Marked); its other `aim`; the default. Each step that finds nobody passes to the next.");

h("Conditions (an ability's `if`, a pulse's or reaction's `if`)");
fields(S.Condition, ["side", "where"]);

h("Unit conditions (`where`, an ability's `if`, and a scale's `when`)");
fields(S.UnitCond);

h("Stats the engine reads");
out.push("| Stat | Kind | Meaning |", "| --- | --- | --- |");
for (const [k, [kind, text]] of Object.entries(S.ENGINE_STATS)) out.push(`| \`${k}\` | ${kind} | ${text} |`);
out.push("", "Every other stat (MP regen, Thorns, Lifesteal, Siphon, Double strike and the rest) is a registry entry that `brings` a status while it's above 0.");
h("Stat families");
table(S.STAT_FAMILIES, "Key");

h("Control resistance (`ruleset.control`, step 5i)");
out.push(S.Control.description ?? "", "");
fields(S.Control);

h("Upgrades (`upgrades`, step 5i)");
out.push(S.Upgrade.description ?? "", "");
fields(S.Upgrade);
out.push("", "Its five forms, each content under the id `<id>__<form>`: an ability of the class for an ability's upgrade, a status for a passive's. A party unit equips a form in its ability's place, and names its passive's form in `passive`.", "");
table(S.UPGRADE_FORMS, "Form");

console.log(out.join("\n"));
