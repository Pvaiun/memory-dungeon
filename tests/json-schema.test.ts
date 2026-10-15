import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Ajv2020 } from "ajv/dist/2020.js";

const read = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });

test("exported JSON Schema accepts the worked example and party", () => {
  const pack = ajv.compile(read("../schema/content-pack.schema.json"));
  assert.ok(pack(read("../fixtures/hollow.pack.json")), JSON.stringify(pack.errors?.slice(0, 3)));
  const party = ajv.compile(read("../schema/party.schema.json"));
  assert.ok(party(read("../fixtures/party.json")), JSON.stringify(party.errors?.slice(0, 3)));
});

test("exported JSON Schema rejects an unknown effect op", () => {
  const pack = ajv.compile(read("../schema/content-pack.schema.json"));
  const bad = read("../fixtures/hollow.pack.json");
  bad.abilities[0].rules[0].do[0].op = "resurrect";
  assert.equal(pack(bad), false);
});
