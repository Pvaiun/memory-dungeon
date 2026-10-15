/** Writes language-neutral JSON Schemas for content packs and party loadouts. */
import { mkdirSync, writeFileSync } from "node:fs";
import * as z from "zod";
import { ContentPack, Party } from "./schema.js";

mkdirSync("schema", { recursive: true });
for (const [name, s] of [["content-pack", ContentPack], ["party", Party]] as const) {
  const json = z.toJSONSchema(s, { target: "draft-2020-12" });
  writeFileSync(`schema/${name}.schema.json`, JSON.stringify(json, null, 2) + "\n");
  console.log(`schema/${name}.schema.json`);
}
