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
  "stat": pick(pack.stats, "hp", "aggro", "damage_dealt"),
  "damage-type": pick(pack.damageTypes, "physical"),
  "status": pick(pack.statuses, "bleed", "lethality", "guarding"),
  "verb": pick(pack.verbs, "counter", "evasion"),
  "trait": pick(pack.traits, "agile", "strikes_many_times"),
  "slot": pick(pack.slots, "ranger_weapon", "charm"),
  "action": pick(pack.actions, "shoot", "lunge"),
  "behaviour": pick(pack.behaviours, "standard", "finisher", "grey_mother"),
  "class": pick(pack.classes, "ranger"),
  "specialization": pick(pack.specializations, "ranger_archer", "ranger_duelist"),
  "ability": pick(pack.abilities, "riposte", "lunge", "mend"),
  "gear": pick(pack.gear, "wolfhide_cloak", "ullrs_yew", "gjallarhorn"),
  "formation": pick(pack.formations, "open_order", "hearth_guard", "hunting_party", "flash_flood"),
  "enemy": pick(pack.enemies, "grey_mother"),
  "perk-family": pick(pack.perkFamilies, "blood"),
  "perk": pick(pack.perks, "red_riposte", "haemorrhage"),
  "dungeon": dungeon,
  "challenge": dungeon.challenges,
  "party": JSON.parse(readFileSync("fixtures/party.json", "utf8")),
};
mkdirSync("fixtures/by-type", { recursive: true });
for (const [name, body] of Object.entries(files)) writeFileSync(`fixtures/by-type/${name}.json`, JSON.stringify(body, null, 2) + "\n");
console.log(Object.keys(files).length, "files in fixtures/by-type");
