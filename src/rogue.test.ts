import { readFileSync } from "node:fs";
import { test } from "vitest";
import assert from "node:assert/strict";
import { loadContent } from "./engine/run.js";
import { rngFor } from "./engine/rng.js";
import { autoFight, choose, equip, finish, freshMeta, heals, itemGear, makeMap, maxOf, member, newItem, newRogue, options, reachable, recruit, rogue, rollItem, swap, upgraded, type RogueRun } from "./rogue.js";
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

test("rogue: a fallen member trades places with one standing at camp between rooms; a standing one only at a campfire", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 9, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  recruit(c, run, "monk");
  const [a, b] = run.party;
  assert.ok(!run.party.includes("monk"), "a recruit waits at camp");
  assert.equal(swap(c, run, a, "monk"), false, "a standing member stays in the party away from a campfire");
  member(run, b).ko = true;
  assert.equal(swap(c, run, b, "monk"), true);
  assert.ok(run.party.includes("monk") && !run.party.includes(b));
  member(run, b).ko = false;
  member(run, "monk").ko = true;
  member(run, b).ko = true;
  assert.equal(swap(c, run, "monk", b), false, "nobody fallen comes in");
});

test("rogue: a shop's training can be bought again in a visit, each time dearer by the step", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 9, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  run.gold = 1000;
  run.pending = { kind: "shop", stock: [], learn: true, upgrade: true };
  const k = rogue(c).config.prices;
  const learnt = () => options(c, run).filter((o) => o.startsWith("learn:"));
  choose(c, run, learnt()[0]);
  assert.equal(run.gold, 1000 - k.learn);
  choose(c, run, learnt()[0]);
  assert.equal(run.gold, 1000 - k.learn - (k.learn + k.trainStep!));
  choose(c, run, options(c, run).find((o) => o.startsWith("upgrade:"))!);
  assert.equal(run.gold, 1000 - k.learn - (k.learn + k.trainStep!) - (k.upgrade + 2 * k.trainStep!));
});

test("rogue: a heal by share counts from the max the last fight ended with, so a +HP piece put on just to rest heals nothing extra", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 11, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  choose(c, run, reachable(run)[0].id);
  autoFight(c, run);
  const m = member(run, "knight");
  m.missHp = 3000;
  const plain = structuredClone(run);
  // With a +HP amulet worn for the rest only, the rest heals the same as without it.
  const it = newItem(run, "heartstone", "common");
  run.items.push(it);
  equip(c, run, "knight", "amulet", it.uid);
  run.pending = { kind: "campfire" };
  plain.pending = { kind: "campfire" };
  choose(c, run, "rest");
  choose(c, plain, "rest");
  // Current HP after the rest is the same with the amulet worn for it as without.
  const cur = (r: RogueRun) => maxOf(c, r, "knight", "max_hp") - member(r, "knight").missHp;
  assert.equal(cur(run), cur(plain));
});

test("rogue: no legendary piece twice in a run while others are left", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 12, leader: "ranger" });
  const rng = rngFor(12, "x");
  const seen = new Set<string>();
  for (let i = 0; i < rogue(c).legendaries.length; i++) {
    const it = rollItem(c, run, rng, "legendary");
    assert.ok(!seen.has(it.base), `${it.base} twice`);
    seen.add(it.base);
    run.items.push(it);
  }
});

test("rogue: a campfire's pick leaves swaps open until LEAVE; those at camp get a share of REST, one raised there doesn't", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 13, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  const [x, y] = c.pack.classes.map((k) => k.id).filter((id) => !run.party.includes(id));
  recruit(c, run, x); recruit(c, run, y);
  const [a] = run.party;
  member(run, x).missHp = 2000;
  member(run, y).ko = true;
  run.pending = { kind: "campfire" };
  choose(c, run, `raise:${y}`);
  assert.deepEqual(options(c, run), ["leave"]);
  assert.equal(swap(c, run, a, y), true, "a swap after the pick");
  const share = (rogue(c).config.campfire.hp * (rogue(c).config.campfire.camp ?? 100)) / 100;
  const max = c.classes.get(x)!.stats.max_hp;
  assert.ok(member(run, x).missHp >= 2000 - Math.ceil((max * share) / 100) - 1 && member(run, x).missHp < 2000, "the camp's share");
  const raised = member(run, y).missHp;
  assert.ok(raised > 0, "the raised member didn't also get the camp's rest");
  choose(c, run, "leave");
  assert.equal(run.pending.kind, "map");
});

test("rogue: a lost regular fight with someone standing at camp passes the road to them; a lost boss, or nobody at camp, ends the run", () => {
  const c = loadContent(raw);
  for (const [reserve, boss] of [[true, false], [false, false], [true, true]]) {
    const run = newRogue(c, { seed: 14, leader: "knight" });
    while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
    const spare = c.pack.classes.map((k) => k.id).find((id) => !run.party.includes(id))!;
    if (reserve) recruit(c, run, spare);
    choose(c, run, reachable(run)[0].id);
    // A fight the party can't win: everyone at 1 HP.
    const p = run.pending as Extract<RogueRun["pending"], { kind: "fight" }>;
    if (boss) (p.fight = { ...run.boss }), (p.tier = "boss");
    for (const cls of run.party) member(run, cls).missHp = 99999;
    autoFight(c, run);
    if (reserve && !boss) {
      assert.deepEqual(run.party, [spare]);
      assert.equal(run.pending.kind, "map", "a regular fight is passed");
    } else assert.equal(run.pending.kind, "over");
  }
});

test("rogue: gear changes max HP, not current HP: a +HP piece doesn't heal, and taking it off caps HP at the new max", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 16, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  run.pending = { kind: "map" };
  const m = member(run, "knight");
  const max0 = c.classes.get("knight")!.stats.max_hp;
  m.missHp = 1000;
  const it = newItem(run, "heartstone", "common");
  run.items.push(it);
  equip(c, run, "knight", "amulet", it.uid);
  const v = () => { const g = c.gear.get(it.uid) ?? itemGear(c, it); void g; return run.roster.find((x) => x.cls === "knight")!; };
  // Current stays max0 - 1000 with a bigger max.
  assert.ok(v().missHp > 1000, "the new max is above current, so more is missing");
  equip(c, run, "knight", "amulet", null);
  assert.equal(member(run, "knight").missHp, 1000, "back to where it was");
  void max0;
});

test("rogue: one standing at camp fills an empty seat between rooms; while the party has no healer, each draft offers one", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 15, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  const spare = c.pack.classes.map((k) => k.id).find((id) => !run.party.includes(id))!;
  recruit(c, run, spare);
  run.party = run.party.slice(0, 2);
  run.pending = { kind: "map" };
  assert.equal(swap(c, run, spare, null), true);
  assert.equal(run.party.length, 3);
  for (let seed = 1; seed <= 40; seed++) {
    const r2 = newRogue(c, { seed, leader: "knight" });
    if (r2.pending.kind === "draft") assert.ok(r2.pending.offers.some((id) => heals(c, id)), `seed ${seed}: no healer offered`);
  }
});
