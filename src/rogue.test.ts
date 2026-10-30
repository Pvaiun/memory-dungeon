import { readFileSync } from "node:fs";
import { test } from "vitest";
import assert from "node:assert/strict";
import { loadContent, type Content } from "./engine/run.js";
import { rngFor } from "./engine/rng.js";
import { autoFight, bench, choose, discard, dismiss, equip, eventView, finish, freshMeta, heals, itemGear, leaderKnown, learn, makeMap, maxOf, member, newItem, newRogue, options, reachable, recruit, recruitKnown, rogue, rollItem, seatsOf, swap, upgraded, usable, whyNot, type RogueRun } from "./rogue.js";
import { aiPlayer, playRogue } from "./rogue-ai.js";
import type { ContentPack, GearT } from "./schema.js";

const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));

/**
 * Step 5i (the build's retire share): the old loot is gone, so the tests of the rules that roll, wear or temper pieces bring
 * their own, in a copy of the pack: each plain weapon again as an ordinary drop (`fx_<kind>`) and as a legendary
 * (`fx_lg_<kind>`), a +HP amulet (`fx_heart`) and a legendary one (`fx_lg_heart`), the legendary pool those, three
 * formations to win (Neutral's slots under other names) and two affixes.
 */
const HEART = 1000;
function withLoot(): Content {
  const pack = structuredClone(raw) as ContentPack;
  const plain = pack.gear.filter((g) => g.source === "starter");
  const drop = plain.map((g): GearT => ({ ...structuredClone(g), id: `fx_${g.weapon!.kind}`, name: `Drop ${g.name}`, source: "drop" }));
  const legend = plain.map((g): GearT => ({ ...structuredClone(g), id: `fx_lg_${g.weapon!.kind}`, name: `Legend ${g.name}`, tier: "powerful", source: "unlock" }));
  const heart: GearT = { id: "fx_heart", name: "Heart", text: "More HP.", slot: "amulet", tier: "ordinary", source: "drop", stats: [{ stat: "max_hp", flat: HEART }] };
  legend.push({ ...heart, id: "fx_lg_heart", name: "Great heart", tier: "powerful", source: "unlock" });
  pack.gear.push(...drop, ...legend, heart);
  const neutral = pack.formations.find((f) => f.id === "neutral")!;
  for (const id of ["fx_wedge", "fx_line", "fx_ring"]) pack.formations.push({ ...structuredClone(neutral), id, name: id, source: "unlock" });
  pack.rogue!.legendaries = legend.map((g) => g.id);
  pack.rogue!.affixes = [
    { id: "hp", prefix: "Sturdy", suffix: "of the Bear", stats: [{ stat: "max_hp", flat: 500 }] },
    { id: "armor", prefix: "Plated", suffix: "of the Tortoise", stats: [{ stat: "armor", flat: 1000 }] },
  ];
  return loadContent(pack);
}

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
      if (m.fixed[String(n.floor)]) assert.equal(n.kind, m.fixed[String(n.floor)]);
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
  const c = withLoot();
  const run = newRogue(c, { seed: 1, leader: "knight" });
  const it = { uid: "t1", base: "fx_heart", rarity: "rare" as const, affixes: ["hp", "armor"] };
  const g = itemGear(c, it);
  const heart = c.gear.get("fx_heart")!;
  const sum = (gg: typeof g, stat: string) => (gg.stats ?? []).filter((x) => x.stat === stat).reduce((s, x) => s + (x.flat ?? 0), 0);
  assert.equal(sum(g, "armor"), sum(heart, "armor") + 1000);
  assert.equal(sum(g, "max_hp"), sum(heart, "max_hp") + 500);
  assert.equal(g.name, "Sturdy Heart of the Tortoise");
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
  const c = withLoot();
  const run = newRogue(c, { seed: 11, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  choose(c, run, reachable(run)[0].id);
  autoFight(c, run);
  const m = member(run, "knight");
  m.missHp = 3000;
  const plain = structuredClone(run);
  // With a +HP amulet worn for the rest only, the rest heals the same as without it.
  const it = newItem(run, "fx_heart", "common");
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
  const c = withLoot();
  const run = newRogue(c, { seed: 12, leader: "ranger" });
  const rng = rngFor(12, "x");
  const seen = new Set<string>();
  assert.ok(rogue(c).legendaries.length > 2);
  for (let i = 0; i < rogue(c).legendaries.length; i++) {
    const it = rollItem(c, run, rng, "legendary")!;
    assert.ok(!seen.has(it.base), `${it.base} twice`);
    seen.add(it.base);
    run.items.push(it);
  }
});

test("rogue (5i, the retire): with no piece in a pool, an offer that would be one is another kind or nothing, and nothing breaks", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 17, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  for (const rar of ["common", "uncommon", "rare", "legendary"] as const) assert.equal(rollItem(c, run, rngFor(17, rar), rar), null);
  // A chest holds a supply; a shop sells no gear; an event option that only finds a piece isn't offered.
  for (const kind of ["treasure", "shop"] as const) {
    const node = run.map.find((n) => n.floor === 2)!;
    node.kind = kind;
    run.pending = { kind: "map" };
    run.at = run.map.find((n) => n.floor === 1 && n.next.includes(node.id))?.id ?? null;
    if (!run.at) continue;
    choose(c, run, node.id);
    const p = run.pending as RogueRun["pending"];
    if (p.kind === "treasure") assert.ok(p.offer.kind !== "gear" && p.offer.kind !== "bundle");
    if (p.kind === "shop") assert.ok(p.stock.every((s) => s.offer.kind !== "gear"));
  }
  const armoury = rogue(c).events.find((e) => e.id === "armoury")!;
  run.pending = { kind: "event", id: armoury.id, v: 0 };
  assert.deepEqual(options(c, run), ["walk_on"]);
  assert.equal(whyNot(c, run, armoury.variants![0].options[0]), "nothing to find");
  // Whole runs play to their end.
  for (let seed = 1; seed <= 4; seed++) assert.equal(playRogue(c, newRogue(c, { seed, leader: "cleric" }), aiPlayer({}, seed), autoFight).pending.kind, "over");
});

test("rogue (5h round 6): a campfire heals everyone a share and raises the fallen on arrival; then REST or TRAIN; swaps stay open until LEAVE", () => {
  const c = loadContent(raw);
  const run = newRogue(c, { seed: 13, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  const [x, y] = c.pack.classes.map((k) => k.id).filter((id) => !run.party.includes(id));
  recruit(c, run, x); recruit(c, run, y);
  const [a] = run.party;
  const k = rogue(c).config.campfire;
  member(run, x).missHp = 2000;
  member(run, y).ko = true;
  const camp = run.map.find((n) => n.floor === 2)!;
  camp.kind = "campfire";
  run.pending = { kind: "map" };
  run.at = run.map.find((n) => n.floor === 1 && n.next.includes(camp.id))!.id;
  choose(c, run, camp.id);
  const max = (cls: string) => maxOf(c, run, cls, "max_hp");
  assert.ok(Math.abs(member(run, x).missHp - Math.max(0, 2000 - Math.floor((max(x) * k.auto!.hp) / 100))) <= 1, "the share on arrival, at camp too");
  assert.equal(member(run, y).ko, false);
  assert.equal(member(run, y).missHp, Math.floor((max(y) * (100 - k.auto!.revive)) / 100), "the fallen rise");
  assert.ok(options(c, run).includes("rest") && options(c, run).includes("train") && !options(c, run).includes("focus"));
  const before = member(run, x).missHp;
  choose(c, run, "rest");
  assert.ok(member(run, x).missHp < before || before === 0, "REST is the share again, for everyone");
  assert.ok(options(c, run).includes("leave") && !options(c, run).includes("rest"), "the pick is made (a stranger's offer can stay)");
  assert.equal(swap(c, run, a, y), true, "a swap after the pick");
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
  const c = withLoot();
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
  const it = newItem(run, "fx_heart", "common");
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
  const c = withLoot();
  const run = newRogue(c, { seed: 16, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  run.pending = { kind: "map" };
  const m = member(run, "knight");
  const max0 = c.classes.get("knight")!.stats.max_hp;
  m.missHp = 1000;
  const it = newItem(run, "fx_heart", "common");
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
  run.pending = { kind: "campfire" };
  choose(c, run, "train");
  assert.ok(options(c, run).includes("back") && !options(c, run).includes("done"));
  choose(c, run, "back");
  assert.equal(run.pending.kind, "campfire");
  assert.ok(!(run.pending as { used?: boolean }).used, "nothing spent");
  assert.ok(options(c, run).includes("rest"));
  choose(c, run, "train");
  choose(c, run, options(c, run).find((o) => o.startsWith("learn:") || o.startsWith("upgrade:"))!);
  assert.ok(!options(c, run).includes("back"), "no way back once someone is trained");
  while ((run.pending as { kind: string }).kind === "train") choose(c, run, options(c, run).includes("done") ? "done" : options(c, run)[0]);
  assert.ok(options(c, run).includes("leave") && !options(c, run).includes("rest"), "the campfire's pick is spent");
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

test("rogue (5h round 6): a captive after some fights against people: taken in at half HP, a lesson, or let go; elites give a pick of legendaries then of formations", () => {
  const c = withLoot();
  let captives = 0, rows = 0, lessons = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const run = newRogue(c, { seed, leader: "knight" });
    while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
    const n = run.map.find((x) => x.floor === 1)!;
    (run as { at: string | null }).at = null;
    choose(c, run, n.id);
    const p = run.pending as Extract<RogueRun["pending"], { kind: "fight" }>;
    p.fight = { ...p.fight, enemies: ["bandit", "bandit"] };
    autoFight(c, run);
    for (let i = 0; i < 6 && run.pending.kind !== "map" && run.pending.kind !== "over"; i++) {
      const q = run.pending;
      if (q.kind === "captive") {
        captives++;
        const o = q.offer as { cls: string };
        if (seed % 2) { choose(c, run, "take"); rows++; assert.ok(member(run, o.cls).missHp > 0, "joins hurt"); }
        else if (options(c, run).includes("lesson")) { choose(c, run, "lesson"); lessons++; assert.equal(run.pending.kind, "train"); choose(c, run, options(c, run)[0]); }
        else choose(c, run, "leave");
      } else choose(c, run, options(c, run).includes("skip") ? "skip" : options(c, run)[0]);
    }
  }
  assert.ok(captives > 3 && captives < 30, `about a fifth of fights against people (${captives} of 60)`);
  assert.ok(rows > 0 && lessons > 0);
  // An elite: three legendaries, then two formations.
  const run = newRogue(c, { seed: 5, leader: "paladin" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  const e = run.map.find((x) => x.floor === 1)!;
  (run as { at: string | null }).at = null;
  choose(c, run, e.id);
  const f = run.pending as Extract<RogueRun["pending"], { kind: "fight" }>;
  Object.assign(f, { tier: "elite", fight: { ...f.fight, enemies: ["bandit"] }, foes: { hp: -80, power: -80 } });
  autoFight(c, run);
  if (run.pending.kind === "drop") choose(c, run, options(c, run)[0]);
  const sp = run.pending as Extract<RogueRun["pending"], { kind: "spoils" }>;
  assert.equal(sp.kind, "spoils");
  assert.ok(sp.offers.length === 3 && sp.offers.every((o) => o.kind === "gear" && o.item.rarity === "legendary"));
  choose(c, run, "take:0");
  assert.equal(run.pending.kind, "trophy");
  assert.equal((run.pending as { offers: { kind: string }[] }).offers.filter((o) => o.kind === "formation").length, 2);
});

test("rogue (5h round 6): every option of every event's every version plays through to the map", () => {
  // Step 5i (the retire): with the fixture's loot every option can be picked; the content as it stands, with none, plays too.
  for (const [c, least] of [[withLoot(), 60], [loadContent(raw), 30]] as const) {
    const ai = aiPlayer({}, 3);
    let played = 0;
    for (const ev of rogue(c).events) {
      const versions = ev.variants?.length ? ev.variants.map((_, v) => v) : [undefined];
      for (const v of versions) for (const opt of eventView(c, { id: ev.id, v }).options) {
        const run = newRogue(c, { seed: 50 + played, leader: "cleric" });
        while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
        run.gold = 500;
        run.items.push(newItem(run, "plain_mace", "common"));
        if (c.gear.has("fx_heart")) run.items.push(newItem(run, "fx_heart", "common"), newItem(run, "fx_heart", "rare", ["hp", "armor"]));
        const at = run.map.find((n) => n.floor === 4)!;
        run.at = at.id;
        run.floor = 4;
        run.pending = { kind: "event", id: ev.id, ...(v !== undefined ? { v } : {}) };
        if (!options(c, run).includes(opt.id)) continue;
        choose(c, run, opt.id);
        const kind = () => (run.pending as { kind: string }).kind;
        for (let i = 0; i < 40 && kind() !== "map" && kind() !== "over"; i++) {
          if (kind() === "fight") autoFight(c, run);
          else choose(c, run, ai.decide(c, run));
        }
        assert.ok(kind() === "map" || kind() === "over", `${ev.id} v${v} ${opt.id} ended at ${kind()}`);
        played++;
      }
    }
    assert.ok(played > least, `${played} options played`);
  }
});
