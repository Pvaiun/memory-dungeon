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
  "The engine runs the core set's combat system (`docs/core-set/rules-and-vocabulary.md`) on step 4's machinery (`steps/04-combat-concepts/design.md`), whose finer rules stand where the core set is silent. This is the closed set of building blocks it runs on. Each needs engine code, so adding one is a schema version bump plus an engine change. Stats, weapon kinds, statuses, elements, abilities and everything else are registries in the pack, and grow without touching the schema. The numbers in the content are first values, placeholders until the balance pass.",
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

h("Gear slots and armor weights");
table(S.SLOTS, "Slot");
out.push("");
table(S.WEIGHTS, "Weight");
out.push("", "A weapon belongs to a kind (a registry: speed, damage type and element), and a class lists the kinds it can use and the heaviest armor it can wear.");

h("Effects (in actions, pulses, triggers and reactions)");
out.push("| Op | Fields | Meaning |", "| --- | --- | --- |");
for (const o of S.Effect.options) {
  const f = Object.keys(o.shape).filter((k) => k !== "op");
  out.push(`| \`${o.shape.op.value}\` | ${f.map((x) => `\`${x}\``).join(", ")} | ${o.description ?? ""} |`);
}
h("Effect targets (`to`)");
out.push("Or a targeting rule. Extra targets after an action's first ignore Taunt.", "");
table(S.TO, "To");

h("Damage types");
table(S.TYPES, "Type");
out.push("", `Physical subtypes: ${Object.keys(S.SUBTYPES).map((s) => `\`${s}\``).join(", ")}. Elements are a registry in the pack.`);

h("Numbers");
out.push("A number is a plain number, or `{ base, scale: [...] }`: base + Σ ratio × source (× times). A scale reads one of `stat`, `hp` (current or missing), `stacks` (a status's Intensity total), `amount` (a reaction's event amount) or `when` (1 if a condition holds), from:", "");
table(S.SCALE_OF, "Of");
out.push("");
fields(S.Scale);

h("Status fields");
fields(S.Status, ["id", "name", "text", "note"]);

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
out.push("", `\`by\` (for lowest and highest): \`hp\`, \`hp_share\`, \`buffs\`, \`debuffs\`, \`{ stat }\`, \`{ stats }\` (the highest of several) or \`{ stacks }\`.`);

h("Unit conditions (`where`, an ability's `if`, and a scale's `when`)");
fields(S.UnitCond);

h("Stats the engine reads");
out.push("| Stat | Kind | Meaning |", "| --- | --- | --- |");
for (const [k, [kind, text]] of Object.entries(S.ENGINE_STATS)) out.push(`| \`${k}\` | ${kind} | ${text} |`);
out.push("", "Every other stat (MP regen, Thorns, Lifesteal, Siphon, Double strike and the rest) is a registry entry that `brings` a status while it's above 0.");
h("Stat families");
table(S.STAT_FAMILIES, "Key");

console.log(out.join("\n"));
