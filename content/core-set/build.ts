/**
 * Builds the core set's content pack from the generator files beside it and
 * writes content/core-set.pack.json, after validating it.
 *
 *   npm run content
 *
 * Every number comes from scale.ts: change a constant there, rebuild, and the
 * studies read the new pack. The generated JSON is committed, so the engine,
 * the tests and the studies read plain data as they always have; a test fails
 * when the committed file no longer matches its sources.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { validatePack } from "../../src/validate.js";
import { buildPack, packText } from "./pack.js";

const raw = buildPack();
const result = validatePack(raw);
for (const i of result.issues) console.log(`  ${i.level === "error" ? "ERROR" : "warn "} [${i.code}] ${i.path}: ${i.message}`);
if (result.errors) {
  console.error(`✗ ${result.errors} errors; not written`);
  process.exit(1);
}
mkdirSync("content", { recursive: true });
writeFileSync("content/core-set.pack.json", packText(raw));
const p = result.pack!;
console.log(`✓ content/core-set.pack.json: ${p.classes.length} classes, ${p.abilities.length} abilities, ${p.statuses.length} statuses, ${p.gear.length} gear, ${p.formations.length} formations, ${p.enemies.length} enemies, ${p.dungeons.length} dungeons; ${result.warnings} warnings`);
