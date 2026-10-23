/**
 * Validate a content pack, and optionally a party loadout against it.
 *
 *   tsx src/cli.ts <pack.json> [--complete] [--party <party.json> [--dungeon <id>]] [--json]
 */
import { readFileSync } from "node:fs";
import { checkParty, unmetConstraints, validatePack, type Issue } from "./validate.js";
import { Party } from "./schema.js";

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const packPath = args.find((a, i) => !a.startsWith("--") && !["--party", "--dungeon"].includes(args[i - 1]));
if (!packPath) {
  console.error("usage: tsx src/cli.ts <pack.json> [--complete] [--party <party.json> [--dungeon <id>]] [--json]");
  process.exit(2);
}

const load = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const result = validatePack(load(packPath), { complete: flag("--complete") });
let issues: Issue[] = result.issues;

const partyPath = opt("--party");
const dungeon = opt("--dungeon");
const lines: string[] = [];
if (partyPath && result.pack) {
  const partyRaw = load(partyPath);
  const partyIssues = checkParty(result.pack, partyRaw, { dungeon });
  issues = [...issues, ...partyIssues.map((i) => ({ ...i, path: `party.${i.path}` }))];
  const parsed = Party.safeParse(partyRaw);
  if (dungeon && parsed.success) {
    const dn = result.pack.dungeons.find((d) => d.id === dungeon);
    for (const ch of dn?.challenges ?? []) {
      const unmet = unmetConstraints(result.pack, parsed.data, dungeon, ch.id);
      lines.push(`  challenge ${ch.id}: ${unmet.length ? `not eligible (${unmet.join("; ")})` : "eligible"}`);
    }
  }
}

if (flag("--json")) {
  console.log(JSON.stringify({ issues }, null, 2));
} else {
  const p = result.pack;
  if (p) {
    const n = (k: keyof typeof p) => (Array.isArray(p[k]) ? (p[k] as unknown[]).length : 0);
    const challenges = p.dungeons.reduce((s, d) => s + d.challenges.length, 0);
    console.log(`Pack ${p.id} (schema ${p.schemaVersion})`);
    console.log(
      `  ${n("classes")} classes, ${n("abilities")} abilities, ${n("gear")} gear, ` +
        `${n("formations")} formations, ${n("enemies")} enemies, ${n("perks")} perks, ${n("dungeons")} dungeons, ` +
        `${challenges} challenges, ${n("statuses")} statuses, ${n("weaponKinds")} weapon kinds, ${n("elements")} elements`,
    );
  }
  if (partyPath) console.log(`Party ${partyPath}${dungeon ? ` in ${dungeon}` : ""}`);
  lines.forEach((l) => console.log(l));
  for (const i of issues) console.log(`  ${i.level === "error" ? "ERROR" : "warn "} [${i.code}] ${i.path}: ${i.message}`);
  const errors = issues.filter((i) => i.level === "error").length;
  console.log(`${errors ? "✗" : "✓"} ${errors} errors, ${issues.length - errors} warnings`);
}
process.exit(issues.some((i) => i.level === "error") ? 1 : 0);
