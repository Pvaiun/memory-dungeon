/** Prints PRIMITIVES.md: the closed sets of engine primitives, generated from the schema. */
import * as S from "./schema.js";

const out: string[] = [];
const h = (t: string) => out.push(`\n## ${t}\n`);
const table = (o: Record<string, string>, head = "Value") => {
  out.push(`| ${head} | Meaning |`, "| --- | --- |");
  for (const [k, v] of Object.entries(o)) out.push(`| \`${k}\` | ${v.replace(/\|/g, "\\|")} |`);
};
const unionKeys = (lazy: any): string[] => lazy._zod.def.getter().options.map((o: any) => (o.shape ? Object.keys(o.shape).join(", ") : "number"));
const ops = (u: any) => {
  out.push("| Op | Fields | Meaning |", "| --- | --- | --- |");
  for (const o of u.options) {
    const fields = Object.keys(o.shape).filter((k) => k !== "op");
    out.push(`| \`${o.shape.op.value}\` | ${fields.map((f) => `\`${f}\``).join(", ")} | ${o.description ?? ""} |`);
  }
};

out.push(
  "# Engine primitives",
  "",
  `Generated from \`src/schema.ts\` (schema ${S.SCHEMA_VERSION}) by \`npm run docs\`. Do not edit by hand.`,
  "",
  "These are the closed sets the rule language is built from. Each one needs engine code, so adding one is a schema version bump plus an engine change. Everything else (stats, statuses, damage types, behaviours, verbs, traits, slots) is a registry in the pack and can grow without touching the schema.",
);
h("Instant effects (actions, triggered rules, between fights)");
ops(S.InstantEffect);
h("Passive effects (passive rules; always act on `self`)");
ops(S.PassiveEffect);
h("How a unit takes its turn");
out.push(S.TURN.map((t) => `- ${t}`).join("\n"), "");
table(S.MODE_USE, "Mode `use`");
h("Events (triggers)");
out.push("The *actor* is the unit a trigger's `who` is matched against.", "");
table(S.EVENTS, "Event");
h("Trigger `who`");
table(S.WHO);
h("Subjects (`of`)");
table(S.SUBJECTS, "Subject");
h("Selector `from`");
table(S.SELECTOR_FROM, "From");
h("Selector `pick`");
table(S.PICKS, "Pick");
h("Flags");
table(S.FLAGS, "Flag");
h("Expression variables");
table(S.VARS, "Var");
h("Trigger `action.via`");
table(S.VIA);
h("Status `on`");
table(S.STATUS_ON);
h("Damage pipeline steps");
table(S.PIPELINE, "Step");
h("Condition forms");
out.push(unionKeys(S.Condition).map((k) => `- \`{ ${k} }\``).join("\n"));
h("Expression forms");
out.push(unionKeys(S.Expr).map((k) => `- \`${k === "number" ? "number" : `{ ${k} }`}\``).join("\n"));
console.log(out.join("\n"));
