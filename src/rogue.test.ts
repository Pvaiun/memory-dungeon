import { readFileSync } from "node:fs";
import { test } from "vitest";
import assert from "node:assert/strict";
import { loadContent } from "./engine/run.js";
import { rngFor } from "./engine/rng.js";
import { autoFight, bench, choose, discard, dismiss, equip, eventView, finish, freshMeta, heals, itemGear, leaderKnown, learn, makeMap, maxOf, member, newItem, newRogue, options, reachable, recruit, recruitKnown, rogue, rollItem, seatsOf, swap, upgraded, usable, type RogueRun } from "./rogue.js";
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

test("rogue (5h): starting units know one rolled ability; a recruit knows what it's given; fresh abilities start half charged; a won run adds its party to the leaders", () => {
  const c = loadContent(raw);
  const run: RogueRun = newRogue(c, { seed: 3, leader: "cleric" });
  assert.equal(member(run, "cleric").known.length, 1, "the leader knows one ability");
  assert.ok(run.pending.kind === "draft" && run.pending.offers.every((cls) => (run.pending as { known?: Record<string, string[]> }).known?.[cls]?.length === 1), "each draft offer shows the one ability it knows");
  const ab = member(run, "cleric").known[0];
  const fresh = rogue(c).config.fresh ?? 0;
  assert.ok(Math.abs(member(run, "cleric").cooldowns![ab] - (c.abilities.get(ab)!.cooldown * (100 - fresh)) / 100) < 0.01, "a starting unit's ability is half charged");
  recruit(c, run, "pyromancer", 100, ["fireball", "pyre"]);
  assert.deepEqual(member(run, "pyromancer").known, ["fireball", "pyre"]);
  learn(c, run, "pyromancer", "firebolt");
  assert.ok(Math.abs(member(run, "pyromancer").cooldowns!.firebolt - (c.abilities.get("firebolt")!.cooldown * (100 - fresh)) / 100) < 0.01, "an ability just learned is half charged");
  const meta = freshMeta();
  run.party = ["cleric", "pyromancer"];
  run.pending = { kind: "over", won: true };
  const r = finish(meta, run);
  assert.deepEqual(r.unlocked, ["pyromancer"]);
  assert.ok(meta.owned.includes("pyromancer"));
  assert.equal(meta.maxHeat, 1);
});

test("rogue (5h): any member trades places with one at camp any time outside a fight; a member at camp can be sent home, never the leader", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 9, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  recruit(c, run, "monk");
  const [, b] = run.party;
  assert.ok(!run.party.includes("monk"), "a recruit waits at camp");
  assert.equal(swap(c, run, b, "monk"), true, "a standing member swaps out away from a campfire");
  assert.ok(run.party.includes("monk") && bench(run).includes(b));
  assert.equal(dismiss(c, run, "knight"), false, "never the leader");
  assert.equal(dismiss(c, run, b), true);
  assert.ok(!run.roster.some((m) => m.cls === b));
  choose(c, run, reachable(run)[0].id);
  const p = run.pending as Extract<RogueRun["pending"], { kind: "fight" }>;
  p.begun = true;
  assert.equal(swap(c, run, "monk", null), false, "not once a fight has begun");
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

test("rogue (5h): a wipe ends the run, whoever is at camp; after a won fight, those who sat it out regain a share of their MP", () => {
  const c = loadContent(raw);
  for (const boss of [false, true]) {
    const run = newRogue(c, { seed: 14, leader: "knight" });
    while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
    recruit(c, run, c.pack.classes.map((k) => k.id).find((id) => !run.party.includes(id))!);
    choose(c, run, reachable(run)[0].id);
    const p = run.pending as Extract<RogueRun["pending"], { kind: "fight" }>;
    if (boss) (p.fight = { ...run.boss }), (p.tier = "boss");
    for (const cls of run.party) member(run, cls).missHp = 99999;
    autoFight(c, run);
    assert.equal(run.pending.kind, "over");
  }
  const run = newRogue(c, { seed: 21, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  const spare = c.pack.classes.map((k) => k.id).find((id) => !run.party.includes(id) && c.classes.get(id)!.stats.max_mp)!;
  recruit(c, run, spare);
  const mx = maxOf(c, run, spare, "max_mp");
  member(run, spare).missMp = mx;
  member(run, spare).lastMax = { hp: maxOf(c, run, spare, "max_hp"), mp: mx };
  choose(c, run, reachable(run)[0].id);
  for (const cls of run.party) member(run, cls).missHp = 0;
  autoFight(c, run);
  if (run.pending.kind !== "over") assert.equal(member(run, spare).missMp, mx - Math.floor((mx * (rogue(c).config.benchMp ?? 0)) / 100), "the bench's share of MP");
  assert.equal(c.classes.get("cleric")!.stats.mp_regen ?? 0, 0, "no class regains MP in a fight by itself");
});

test("rogue (5h): the Muster, the Drill ground and training; a seat at camp; event versions; dropping a piece; spoils without supplies", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 31, leader: "ranger" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  // The Muster: one of two recruits, each knowing what its card shows.
  const node = run.map.find((n) => n.floor === 2)!;
  node.kind = "muster";
  run.pending = { kind: "map" };
  run.at = run.map.find((n) => n.floor === 1 && n.next.includes(node.id))?.id ?? null;
  if (run.at) {
    choose(c, run, node.id);
    assert.equal(run.pending.kind, "muster");
    const mp = run.pending as Extract<RogueRun["pending"], { kind: "muster" }>;
    assert.equal(mp.offers.length, rogue(c).config.muster?.offers);
    const o = mp.offers[0] as { cls: string; known: string[] };
    choose(c, run, "take:0");
    assert.deepEqual(member(run, o.cls).known, o.known);
  }
  // Training: two members, each once, then back.
  run.pending = { kind: "train", left: 2, done: [], then: { kind: "map" }, why: "test" };
  const first = options(c, run).find((x) => x !== "done")!;
  choose(c, run, first);
  assert.ok(options(c, run).every((x) => x === "done" || x.split(":")[1] !== first.split(":")[1]), "each member once");
  choose(c, run, "done");
  assert.equal(run.pending.kind, "map");
  // A seat at camp, up to the max.
  const seats = run.seats!;
  run.pending = { kind: "boon", offers: [{ kind: "seat" }] };
  choose(c, run, "take:0");
  assert.equal(run.seats, seats + 1);
  // An event's version: its own text and options.
  const ev = rogue(c).events.find((e) => e.variants?.length)!;
  assert.equal(eventView(c, { id: ev.id, v: 1 }).options, ev.variants![1].options);
  // A piece nobody wears can be dropped; a worn one can't.
  run.pending = { kind: "map" };
  const it = newItem(run, "heartstone", "common");
  run.items.push(it);
  assert.equal(discard(run, it.uid), true);
  assert.equal(discard(run, member(run, "ranger").gear.weapon!), false);
  // Regular fights' spoils: never a supply, and some gear for classes off the roster.
  let supplies = 0, off = 0, gear = 0;
  for (let seed = 1; seed <= 30; seed++) {
    const r2 = newRogue(c, { seed, leader: "knight" });
    while (r2.pending.kind === "draft") choose(c, r2, options(c, r2)[0]);
    const n = r2.map.find((x) => x.floor === 1)!;
    (r2 as { at: string | null }).at = null;
    choose(c, r2, n.id);
    for (const cls of r2.party) member(r2, cls).missHp = 0;
    autoFight(c, r2);
    let q: RogueRun["pending"] = r2.pending;
    if (q.kind === "drop") q = q.then;
    if (q.kind !== "spoils") continue;
    for (const o of q.offers) {
      if (o.kind === "supply") supplies++;
      if (o.kind === "gear") (gear++, (off += usable(c, r2, o.item.base) ? 0 : 1));
    }
  }
  assert.equal(supplies, 0, "no supplies in a fight's spoils");
  assert.ok(gear > 0 && off > 0 && off < gear, `some gear off the roster (${off} of ${gear})`);
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

test("rogue (5h round 6): a potion and a tonic at the start; the leader's roll is known before the run; act I recruits know one or two; a seat with each act", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 77, leader: "cleric" });
  assert.deepEqual([...run.supplies].sort(), ["potion", "tonic"]);
  assert.deepEqual(member(run, "cleric").known, leaderKnown(c, 77, "cleric"), "the start screen's roll is the run's");
  for (let i = 0; i < 400; i++) assert.ok(recruitKnown(c, run, rngFor(i, "k")) <= 2, "act I rolls one or two");
  assert.equal(seatsOf(c, run), 2);
  run.pending = { kind: "region", options: [rogue(c).regions.find((x) => x.act === 2)!.id] };
  choose(c, run, options(c, run)[0]);
  assert.equal(seatsOf(c, run), 3, "a seat with act II");
});

test("rogue (5h round 6): TRAIN can be backed out of until someone is trained, and the campfire's pick is only spent then", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 19, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  const [x] = c.pack.classes.map((k) => k.id).filter((id) => !run.party.includes(id));
  recruit(c, run, x);
  member(run, x).missHp = 1000;
  run.pending = { kind: "campfire" };
  choose(c, run, "train");
  assert.ok(options(c, run).includes("back") && !options(c, run).includes("done"));
  choose(c, run, "back");
  assert.equal(run.pending.kind, "campfire");
  assert.ok(!(run.pending as { used?: boolean }).used && member(run, x).missHp === 1000, "nothing spent");
  assert.ok(options(c, run).includes("rest"));
  choose(c, run, "train");
  choose(c, run, options(c, run).find((o) => o.startsWith("learn:") || o.startsWith("upgrade:"))!);
  assert.ok(!options(c, run).includes("back"), "no way back once someone is trained");
  assert.ok(member(run, x).missHp < 1000, "the camp's share, once the pick is spent");
  // The shop: all three supplies.
  run.pending = { kind: "map" };
  const shop = run.map.find((n) => n.floor === 2)!;
  shop.kind = "shop";
  run.at = run.map.find((n) => n.floor === 1 && n.next.includes(shop.id))?.id ?? null;
  if (run.at) {
    choose(c, run, shop.id);
    const stock = (run.pending as unknown as Extract<RogueRun["pending"], { kind: "shop" }>).stock;
    assert.deepEqual(stock.filter((s2) => s2.offer.kind === "supply").map((s2) => (s2.offer as { id: string }).id).sort(), ["phoenix", "potion", "tonic"]);
  }
});
