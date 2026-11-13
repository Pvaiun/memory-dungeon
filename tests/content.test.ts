import { test } from "vitest";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { buildPack, packText } from "../content/core-set/pack.js";
import { checkParty } from "../src/validate.js";
import type { ContentPack } from "../src/schema.js";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

// The game, the tests and the studies read the compiled pack, not content/core-set/: a source change without
// `npm run content` would leave them playing the old content.
test("content/core-set.pack.json matches its sources (run npm run content if this fails)", () => {
  const built = packText(buildPack());
  const committed = read("content/core-set.pack.json");
  if (built === committed) return;
  const a = built.split("\n"), b = committed.split("\n");
  const at = a.findIndex((line, i) => line !== b[i]);
  assert.fail(`the committed pack is stale; first difference at line ${at + 1}:\n  built:     ${a[at]?.trim()}\n  committed: ${b[at]?.trim()}`);
});

// The interface draws a weapon from its own strip (ui/tools/assets.py builds them from the director's weapon art):
// a weapon added to the core set without art, or art left behind by a renamed weapon, shows here.
test("every weapon in the pack has its strip in the interface's art, and no strip is left over", () => {
  const pack: ContentPack = JSON.parse(read("content/core-set.pack.json"));
  const strips: Record<string, string> = JSON.parse(read("ui/public/assets/manifest.json")).weapons;
  const weapons = pack.gear.filter((g) => g.slot === "weapon").map((g) => g.id).sort();
  assert.deepEqual(Object.keys(strips).sort(), weapons);
  assert.deepEqual(readdirSync(new URL("../ui/public/assets/weapons/", import.meta.url)).sort(), weapons.map((id) => `${id}.png`));
});

// The interface draws a status from its icon (ui/tools/skill_icons.py builds them from the director's picks), else a
// coloured square with the status's first letter: a status that shows, a foe's passive or a class's, added without
// an icon, shows here. Add it to STATUS_ICONS (or ICONS, for a class passive) and run the tool.
test("every status that shows, every foe passive and every class passive has its icon", () => {
  const pack: ContentPack = JSON.parse(read("content/core-set.pack.json"));
  const icons: Record<string, string> = JSON.parse(read("ui/public/assets/manifest.json")).statuses;
  const needed = new Set([
    ...pack.statuses.filter((s) => s.show === "icon" || s.show === "stat").map((s) => s.id),
    ...pack.enemies.flatMap((e) => e.statuses ?? []),
    ...pack.classes.flatMap((k) => k.passive?.statuses ?? []),
  ]);
  assert.deepEqual([...needed].filter((id) => !icons[id]).sort(), []);
});

test("the party files the command-line tools use are valid against the pack", () => {
  const pack: ContentPack = JSON.parse(read("content/core-set.pack.json"));
  for (const file of readdirSync(new URL("../content/parties/", import.meta.url))) {
    const errors = checkParty(pack, JSON.parse(read(`content/parties/${file}`))).filter((i) => i.level === "error");
    assert.deepEqual(errors.map((i) => `${i.path}: ${i.message}`), [], `content/parties/${file}`);
  }
});
