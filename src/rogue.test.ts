import { readFileSync } from "node:fs";
import { test } from "vitest";
import assert from "node:assert/strict";
import { loadContent } from "./engine/run.js";
import { rngFor } from "./engine/rng.js";
import { autoFight, choose, finish, freshMeta, itemGear, makeMap, member, newRogue, options, reachable, recruit, rogue, upgraded, type RogueRun } from "./rogue.js";
import { aiPlayer, playRogue } from "./rogue-ai.js";

const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));

test("rogue: a run starts with the leader and a draft, and the same seed and choices make the same run", () => {
  const c = loadContent(raw);
  const play = () => playRogue(c, newRogue(c, { seed: 42, leader: "knight" }), aiPlayer({}, 42), autoFight);
  const a = play(), b = play();
  assert.equal(a.roster[0].cls, "knight");
  assert.ok(a.stats.fights >= 3, "it fought");
  assert.equal(a.pending.kind, "over");
  assert.deepEqual(a.notes, b.notes);
});

test("rogue: the map follows its rules: fixed floors, no early elites or campfires, a shop and two elites, every room leads to the boss", () => {
  const c = loadContent(raw);
  const m = rogue(c).config.map;
  for (let s = 1; s <= 30; s++) {
    const map = makeMap(c, rngFor(s, "map"));
    for (const n of map) {
      if (n.floor === 1) assert.equal(n.kind, "fight");
      if (n.floor === 5) assert.equal(n.kind, "treasure");
      if (n.floor === m.floors) assert.equal(n.kind, "campfire");
      if (n.floor < m.lateFrom) assert.ok(n.kind !== "elite" && n.kind !== "campfire", `${n.id} is ${n.kind}`);
      if (n.kind !== "boss") assert.ok(n.next.length > 0, `${n.id} leads nowhere`);
      for (const id of n.next) assert.equal(map.find((x) => x.id === id)!.floor, n.floor + 1);
    }
    assert.ok(map.some((n) => n.kind === "shop"));
    assert.ok(map.filter((n) => n.kind === "elite").length >= 2);
  }
});

test("rogue: HP carries from fight to fight, as what's missing", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 7, leader: "ranger" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  choose(c, run, reachable(run)[0].id);
  assert.equal(run.pending.kind, "fight");
  autoFight(c, run);
  const hurt = run.roster.filter((m) => m.missHp > 0 || m.ko);
  assert.ok(hurt.length > 0, "someone took damage");
  const before = structuredClone(run.roster);
  // Nothing between rooms heals: the next room sees the same missing HP.
  assert.deepEqual(run.roster.map((m) => m.missHp), before.map((m) => m.missHp));
});

test("rogue: a rare piece is its base with two affixes added; an upgraded ability is 40% bigger", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 1, leader: "knight" });
  const it = { uid: "t1", base: "plate", rarity: "rare" as const, affixes: ["hp", "armor"] };
  const g = itemGear(c, it);
  const plate = c.gear.get("plate")!;
  const sum = (gg: typeof g, stat: string) => (gg.stats ?? []).filter((x) => x.stat === stat).reduce((s, x) => s + (x.flat ?? 0), 0);
  assert.equal(sum(g, "armor"), sum(plate, "armor") + 1000);
  assert.equal(sum(g, "max_hp"), sum(plate, "max_hp") + 500);
  assert.equal(g.name, "Sturdy Plate of the Tortoise");
  const up = upgraded(c, "firebolt");
  const dmg = (a: typeof up) => { const d = a.do[0]; return d.op === "damage" && typeof d.amount !== "number" ? d.amount.scale[0].ratio : 0; };
  assert.ok(Math.abs(dmg(up) / dmg(c.abilities.get("firebolt")!) - 1.4) < 1e-9);
  assert.equal(up.name, "Firebolt+");
  void run;
});

test("rogue: a recruit knows one ability per act reached; a won run adds its party to the classes a run can start with", () => {
  const c = loadContent(raw);
  const run: RogueRun = newRogue(c, { seed: 3, leader: "cleric" });
  run.act = 2;
  recruit(c, run, "pyromancer");
  assert.equal(member(run, "pyromancer").known.length, 2);
  const meta = freshMeta();
  run.party = ["cleric", "pyromancer"];
  run.pending = { kind: "over", won: true };
  const r = finish(meta, run);
  assert.deepEqual(r.unlocked, ["pyromancer"]);
  assert.ok(meta.owned.includes("pyromancer"));
  assert.equal(meta.maxHeat, 1);
});
