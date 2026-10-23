/** Writes fixtures/by-type/*.json: one worked example of each type, pulled from the worked example pack. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { ContentPack } from "./schema.js";

const pack: ContentPack = JSON.parse(readFileSync("fixtures/hollow.pack.json", "utf8"));
const pick = <T extends { id: string }>(arr: T[], ...ids: string[]) =>
  ids.map((id) => {
    const found = arr.find((x) => x.id === id);
    if (!found) throw new Error(`worked example has no '${id}'`);
    return found;
  });
const dungeon = pack.dungeons[0];

const files: Record<string, unknown> = {
  "design": pack.design,
  "ruleset": pack.ruleset,
  "stat": pick(pack.stats, "max_hp", "aggro", "evasion", "mp_regen"),
  "element": pack.elements,
  "weapon-kind": pack.weaponKinds,
  "status": pick(pack.statuses, "bleed", "barrier", "stun", "riposte", "pack_fury", "mp_regen"),
  "class": pick(pack.classes, "ranger", "duelist"),
  "ability": pick(pack.abilities, "shield_bash", "lunge", "mend", "howl"),
  "gear": pick(pack.gear, "wolfhide_cloak", "ullrs_yew", "gjallarhorn"),
  "formation": pick(pack.formations, "open_order", "hearth_guard", "hunting_party", "flash_flood"),
  "enemy": pick(pack.enemies, "grey_mother"),
  "perk-family": pick(pack.perkFamilies, "blood"),
  "perk": pick(pack.perks, "keen_eyes", "red_riposte", "haemorrhage"),
  "dungeon": dungeon,
  "challenge": dungeon.challenges,
  "party": JSON.parse(readFileSync("fixtures/party.json", "utf8")),
};
mkdirSync("fixtures/by-type", { recursive: true });
for (const [name, body] of Object.entries(files)) writeFileSync(`fixtures/by-type/${name}.json`, JSON.stringify(body, null, 2) + "\n");
console.log(Object.keys(files).length, "files in fixtures/by-type");
