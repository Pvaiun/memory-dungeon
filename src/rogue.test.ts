import { readFileSync } from "node:fs";
import { test } from "vitest";
import assert from "node:assert/strict";
import { loadContent, type Content } from "./engine/run.js";
import type { Member as EngineMember } from "./engine/combat/rules.js";
import { rngFor } from "./engine/rng.js";
import {
  autoFight, bench, choose, discard, dismiss, endFight, equip, eventView, finish, formationRarity, freshMeta, heals, improveOptions, itemGear, kindOf, leaderKnown, learn, makeMap, maxOf, member,
  newItem, newRogue, options, parseTraining, partyOf, priceOf, reachable, recruit, recruitKnown, rogue, rollItem, seatsOf, startFight, stockOf, swap, temperInto, train, trainingsFor,
  trainOptions, usable, whyNot, wearer, type RogueRun,
} from "./rogue.js";
import { aiPlayer, playRogue } from "./rogue-ai.js";
import { canEquip, checkParty } from "./validate.js";
import type { ContentPack, EventOpT, GearT } from "./schema.js";

const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));

/**
 * Step 5i: the rules that roll, wear, temper and train bring their own content, in a copy of the pack, so they hold whatever the
 * content shares have merged: a stock of fixed pieces in the spine's shape (each weapon kind 2 of each rarity, each armor type 3,
 * each offhand kind 2, amulets 6; stat pieces, a plain weapon's swing for the weapons), with `fx_heart` (a common +HP amulet) among
 * them; a mythic for every class; three formations to win, one of each rarity; and, until the content's own are in, upgrades (a
 * power step and two versions, as five forms) for the Knight's three abilities and its passive, and the Pyromancer's Firebolt.
 * `withoutLoot` is the pack with no stock at all (the retire share's case).
 */
const HEART = 1000;
const RARS = ["common", "uncommon", "rare", "legendary"] as const;
const UPGRADED: [string, string, "ability" | "passive"][] = [["fortify", "knight", "ability"], ["stand_fast", "knight", "ability"], ["shield_bash", "knight", "ability"], ["vanguard", "knight", "passive"], ["firebolt", "pyromancer", "ability"]];
function fixturePack(o: { drop?: (g: GearT) => boolean } = {}): ContentPack {
  const pack = structuredClone(raw) as ContentPack;
  pack.gear = pack.gear.filter((g) => g.source === "starter");
  const add = (g: Omit<GearT, "source" | "tier" | "text"> & { text?: string }) => {
    const powerful = g.rarity === "legendary" || g.rarity === "mythic";
    const piece: GearT = { text: "A piece.", ...g, source: powerful ? "unlock" : "drop", tier: powerful ? "powerful" : "ordinary" };
    if (!o.drop?.(piece)) pack.gear.push(piece);
  };
  for (const k of pack.weaponKinds) {
    const plain = pack.gear.find((g) => g.id === `plain_${k.id}`)!;
    RARS.forEach((rarity, r) => { for (const n of [1, 2]) add({ ...structuredClone(plain), id: `fx_${k.id}_${rarity}_${n}`, name: `${rarity} ${k.id} ${n}`, rarity, stats: [{ stat: "attack", flat: 500 * (r + 1) }] }); });
  }
  for (const t of pack.armorTypes) RARS.forEach((rarity, r) => { for (const n of [1, 2, 3]) add({ id: `fx_${t.id}_${rarity}_${n}`, name: `${rarity} ${t.id} ${n}`, slot: "armor", armor: t.id, rarity, stats: [{ stat: "armor", flat: 500 * (r + 1) }] }); });
  for (const k of pack.offhandKinds) RARS.forEach((rarity, r) => { for (const n of [1, 2]) add({ id: `fx_${k.id}_${rarity}_${n}`, name: `${rarity} ${k.id} ${n}`, slot: "offhand", offhand: k.id, rarity, stats: [{ stat: "armor", flat: 500 * (r + 1) }] }); });
  RARS.forEach((rarity, r) => { for (const n of [1, 2, 3, 4, 5]) add({ id: `fx_amulet_${rarity}_${n}`, name: `${rarity} amulet ${n}`, slot: "amulet", rarity, stats: [{ stat: "max_hp", flat: 500 * (r + 1) }] }); });
  add({ id: "fx_heart", name: "Heart", text: "More HP.", slot: "amulet", rarity: "common", stats: [{ stat: "max_hp", flat: HEART }] });
  for (const rarity of RARS.slice(1)) add({ id: `fx_amulet_${rarity}_6`, name: `${rarity} amulet 6`, slot: "amulet", rarity, stats: [{ stat: "max_hp", flat: 600 }] });
  for (const k of pack.classes) add({ id: `fx_myth_${k.id}`, name: `${k.name}'s mythic`, slot: "amulet", rarity: "mythic", mythic: k.id, stats: [{ stat: "max_hp", flat: 2000 }] });
  const neutral = pack.formations.find((f) => f.id === "neutral")!;
  for (const [id, rarity] of [["fx_wedge", "common"], ["fx_line", "rare"], ["fx_ring", "legendary"]] as const) pack.formations.push({ ...structuredClone(neutral), id, name: id, source: "unlock", rarity });
  // The content's own upgrades once they're in (the forms' ids are fixed either way); these until then.
  if (pack.upgrades?.length) return pack;
  pack.upgrades = UPGRADED.map(([id, cls, kind]) => ({ id, class: cls, kind, power: "More of the same.", a: { name: "Wide", text: "It reaches further." }, b: { name: "Deep", text: "It digs deeper." } }));
  for (const [id, , kind] of UPGRADED)
    for (const f of ["p", "a", "b", "ap", "bp"]) {
      if (kind === "ability") { const a = pack.abilities.find((x) => x.id === id)!; pack.abilities.push({ ...structuredClone(a), id: `${id}__${f}`, name: `${a.name} ${f}` }); }
      else { const s = pack.statuses.find((x) => x.id === id)!; pack.statuses.push({ ...structuredClone(s), id: `${id}__${f}`, name: `${s.name} ${f}` }); }
    }
  return pack;
}
const withLoot = (o: { drop?: (g: GearT) => boolean } = {}): Content => loadContent(fixturePack(o));
function withoutLoot(): Content {
  const pack = structuredClone(raw) as ContentPack;
  pack.gear = pack.gear.filter((g) => g.source === "starter");
  return loadContent(pack);
}
/** Wins the pending fight at no cost (the engine's party is built, the fight isn't played). */
function winFight(c: Content, run: RogueRun) {
  const er = startFight(c, run);
  er.outcome = "won";
  endFight(c, run, er);
}
const pastDraft = (c: Content, run: RogueRun) => { while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]); return run; };

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

test("rogue (5i): a piece is fixed: an item is its piece under its own id, at the piece's rarity, with no affixes; the stock leaves out the plain weapons and the mythics", () => {
  const c = withLoot();
  const run = newRogue(c, { seed: 1, leader: "knight" });
  for (const rar of RARS) {
    const it = rollItem(c, run, rngFor(1, rar), rar)!;
    assert.deepEqual(Object.keys(it).sort(), ["base", "rarity", "uid"]);
    const g = itemGear(c, it), base = c.gear.get(it.base)!;
    assert.equal(it.rarity, base.rarity);
    assert.equal(g.id, it.uid);
    assert.equal(g.name, base.name);
    assert.deepEqual(g.stats, base.stats);
  }
  assert.equal(stockOf(c).all.length, 240);
  assert.ok(!stockOf(c).all.some((g) => g.source === "starter" || g.mythic));
  assert.equal(stockOf(c).mythics.length, c.pack.classes.length);
});

test("rogue (5i): an offer picks a slot first (weapons and offhands 30%, armor 25%, amulets 15%), then a class, a kind it wears, the rarity, a piece", () => {
  const c = withLoot();
  const run = pastDraft(c, newRogue(c, { seed: 41, leader: "knight" }));
  const w = rogue(c).config.slots!;
  const total = w.weapon + w.armor + w.offhand + w.amulet;
  const n = 2000;
  const slots: Record<string, number> = {};
  let off = 0;
  const rng = rngFor(41, "offers");
  for (let i = 0; i < n; i++) {
    const it = rollItem(c, run, rng, "rare", false, true)!;
    slots[c.gear.get(it.base)!.slot] = (slots[c.gear.get(it.base)!.slot] ?? 0) + 1;
    assert.equal(it.rarity, "rare", "the full stock has every rarity in every kind");
    if (!usable(c, run, it.base)) off++;
  }
  for (const s of ["weapon", "armor", "offhand", "amulet"] as const) assert.ok(Math.abs(slots[s] / n - w[s] / total) < 0.04, `${s}: ${slots[s]} of ${n}`);
  // An open offer (spoils, chests) is for a class off the roster a third of the time (an amulet still fits the roster).
  assert.ok(off / n > 0.1 && off / n < 0.4, `${off} of ${n} off the roster`);
  // Otherwise for someone in the roster; an elite's aimed offer for someone in the party; a cage's for its recruit.
  for (let i = 0; i < 300; i++) {
    assert.ok(usable(c, run, rollItem(c, run, rng, "common")!.base));
    const p = rollItem(c, run, rng, "legendary", true)!;
    assert.ok(run.party.some((cls) => canEquip(c.classes.get(cls)!, c.gear.get(p.base)!)));
    const k = rollItem(c, run, rng, "uncommon", false, false, "monk")!;
    assert.ok(canEquip(c.classes.get("monk")!, c.gear.get(k.base)!));
  }
});

test("rogue (5i): with nothing at a rarity in a kind, the nearest rarity, down then up; no piece twice in a pick; no legendary twice in a run while others are left", () => {
  const noRares = withLoot({ drop: (g) => g.rarity === "rare" });
  const r1 = pastDraft(noRares, newRogue(noRares, { seed: 5, leader: "ranger" }));
  for (let i = 0; i < 60; i++) assert.equal(rollItem(noRares, r1, rngFor(i, "down"), "rare")!.rarity, "uncommon", "down first");
  const onlyLegends = withLoot({ drop: (g) => g.rarity !== "legendary" && g.rarity !== "mythic" });
  const r2 = pastDraft(onlyLegends, newRogue(onlyLegends, { seed: 5, leader: "ranger" }));
  for (let i = 0; i < 60; i++) assert.equal(rollItem(onlyLegends, r2, rngFor(i, "up"), "common")!.rarity, "legendary", "then up");
  // A pick never shows one piece twice.
  const c = withLoot();
  const run = newRogue(c, { seed: 12, leader: "ranger" });
  const rng = rngFor(12, "pick");
  for (let i = 0; i < 200; i++) {
    const a = rollItem(c, run, rng, "legendary", false, false, "ranger")!;
    const b = rollItem(c, run, rng, "legendary", false, false, "ranger", [a.base])!;
    assert.notEqual(a.base, b.base);
  }
  // The Ranger alone wears 15 legendaries: 30 legendary offers taken never repeat one (a kind run dry offers a rare).
  const seen = new Set<string>();
  for (let i = 0; i < 30; i++) {
    const it = rollItem(c, run, rng, "legendary")!;
    if (it.rarity === "legendary") (assert.ok(!seen.has(it.base), `${it.base} twice`), seen.add(it.base));
    run.items.push(it);
  }
  assert.ok(seen.size >= 12, `${seen.size} legendaries`);
  // Regular fights' spoils: no piece twice in a pick, first or second.
  for (let seed = 1; seed <= 20; seed++) {
    const r3 = pastDraft(c, newRogue(c, { seed, leader: "knight" }));
    choose(c, r3, reachable(r3)[0].id);
    winFight(c, r3);
    const chain: RogueRun["pending"][] = [];
    for (let q: RogueRun["pending"] | undefined = r3.pending; q; q = "then" in q ? (q.then as RogueRun["pending"] | undefined) : undefined) chain.push(q);
    for (const q of chain) {
      if (q.kind !== "spoils") continue;
      const bases: string[] = q.offers.flatMap((o) => (o.kind === "gear" || o.kind === "bundle" ? [o.item.base] : []));
      assert.equal(new Set(bases).size, bases.length);
    }
  }
});

test("rogue (5i): the boons that open acts II and III offer a mythic for a party member's class the run doesn't hold, priced as a legendary; none when every roster class's is held", () => {
  const c = withLoot();
  const boon = (run: RogueRun) => {
    run.pending = { kind: "fight", node: "boss", tier: "boss", fight: run.boss, foes: {}, seed: 1 };
    winFight(c, run);
    const pend = () => run.pending as RogueRun["pending"];
    if (pend().kind === "drop") choose(c, run, options(c, run)[0]);
    assert.equal(pend().kind, "boon");
    return pend() as Extract<RogueRun["pending"], { kind: "boon" }>;
  };
  for (const act of [1, 2]) {
    const run = pastDraft(c, newRogue(c, { seed: 60 + act, leader: "cleric" }));
    run.act = act;
    const p = boon(run);
    const m = p.offers.find((o) => o.kind === "gear" && o.item.rarity === "mythic");
    assert.ok(m && m.kind === "gear", `act ${act}'s boss's boon has a mythic`);
    assert.ok(run.party.includes(c.gear.get(m.item.base)!.mythic!), "for a party member's class");
    assert.equal(priceOf(c, m), rogue(c).config.prices.legendary);
    assert.equal(p.offers.length, rogue(c).config.boon.count);
    choose(c, run, `take:${p.offers.indexOf(m)}`);
    assert.ok(run.items.some((it) => it.uid === m.item.uid));
  }
  // Every roster class's mythic held: the boon's piece is a legendary.
  const run = pastDraft(c, newRogue(c, { seed: 70, leader: "cleric" }));
  for (const mm of run.roster) run.items.push(newItem(run, `fx_myth_${mm.cls}`, "mythic"));
  const p = boon(run);
  assert.ok(!p.offers.some((o) => o.kind === "gear" && o.item.rarity === "mythic"));
  assert.ok(p.offers.some((o) => o.kind === "gear" && o.item.rarity === "legendary"));
});

test("rogue (5i): training: a power step and a version on an ability or the passive, each once, in either order; the fight gets the forms; a carried cooldown follows its ability", () => {
  const c = withLoot();
  const run = pastDraft(c, newRogue(c, { seed: 3, leader: "knight" }));
  const m = member(run, "knight");
  const ab = m.known[0];
  const ids = trainingsFor(c, run, "knight").map((t) => `${t.verb}:${t.cls}:${t.id}${t.version ? `:${t.version}` : ""}`);
  for (const id of [`power:knight:${ab}`, `version:knight:${ab}:a`, `version:knight:${ab}:b`, "power:knight:vanguard", "version:knight:vanguard:a"]) assert.ok(ids.includes(id), id);
  for (const a of c.classes.get("knight")!.abilities.filter((x) => x !== ab)) assert.ok(ids.includes(`learn:knight:${a}`) && !ids.includes(`power:knight:${a}`), "an ability not known is learned first");
  const unit = () => partyOf(c, run).units.find((u) => u.class === "knight")!;
  assert.equal(train(c, run, `version:knight:${ab}:b`), true);
  assert.equal(train(c, run, `version:knight:${ab}:a`), false, "one version");
  assert.ok(unit().abilities.includes(`${ab}__b`));
  assert.equal(train(c, run, `power:knight:${ab}`), true);
  assert.equal(train(c, run, `power:knight:${ab}`), false, "one power step");
  assert.ok(unit().abilities.includes(`${ab}__bp`));
  assert.equal(unit().passive, undefined);
  assert.equal(train(c, run, "power:knight:vanguard"), true);
  assert.equal(unit().passive, "vanguard__p");
  assert.equal(train(c, run, "version:knight:vanguard:a"), true);
  assert.equal(unit().passive, "vanguard__ap");
  assert.ok(m.known.includes(ab) && m.order.includes(ab), "known and order stay base ids");
  assert.ok(!trainingsFor(c, run, "knight").some((t) => t.id === ab || t.id === "vanguard"), "nothing left on either");
  assert.deepEqual(checkParty(c.pack, partyOf(c, run)).filter((i) => i.code === "party.abilityForm" || i.code === "party.passive" || i.code === "party.abilityNotOwned"), [], "the forms are the content's");
  // The cooldown it carries, kept by base id, goes into the fight under the form and comes back under the base id.
  choose(c, run, reachable(run)[0].id);
  m.cooldowns = { ...(m.cooldowns ?? {}), [ab]: 3 };
  const er = startFight(c, run);
  const em = (er.party as EngineMember[]).find((x) => x.ref === "knight")!;
  assert.equal(em.cooldowns?.[`${ab}__bp`], 3);
  er.outcome = "won";
  endFight(c, run, er);
  assert.ok(ab in (m.cooldowns ?? {}) && !Object.keys(m.cooldowns ?? {}).some((k) => k.includes("__")));
});

test("rogue (5i): every training opportunity gives three, each to a different member: the campfire's TRAIN, the drill, the training events and lessons; a new act's level-up stays one each", () => {
  const c = withLoot();
  const run = pastDraft(c, newRogue(c, { seed: 8, leader: "knight" }));
  recruit(c, run, c.pack.classes.map((k) => k.id).find((id) => !run.roster.some((m) => m.cls === id))!);
  const pend = () => run.pending as RogueRun["pending"];
  run.pending = { kind: "campfire" };
  choose(c, run, "train");
  assert.equal((pend() as { left: number }).left, 3);
  let picks = 0;
  while (pend().kind === "train") {
    const o = options(c, run).find((x) => x !== "done" && x !== "back");
    if (!o) break;
    const cls = parseTraining(o)!.cls;
    choose(c, run, o);
    picks++;
    if (pend().kind === "train") assert.ok(!options(c, run).some((x) => parseTraining(x)?.cls === cls), "each member once");
  }
  assert.equal(picks, 3);
  assert.equal(pend().kind, "campfire");
  // The events' training: three each.
  const trains = (ops: readonly EventOpT[]): number[] => ops.flatMap((op) => (op.op === "train" ? [op.n] : op.op === "chance" ? [...trains(op.then), ...trains(op.else)] : []));
  const ns = rogue(c).events.flatMap((e) => [...e.options, ...(e.variants ?? []).flatMap((v) => v.options)]).flatMap((o) => trains(o.do));
  assert.ok(ns.length >= 8 && ns.every((n) => n === 3), `${ns}`);
  // Lessons (a captive's, a stranger's) and the drill ground: three.
  const recruitOffer = { kind: "recruit" as const, cls: c.pack.classes.map((k) => k.id).find((id) => !run.roster.some((m) => m.cls === id))!, known: [] as string[] };
  recruitOffer.known = [c.classes.get(recruitOffer.cls)!.abilities[0]];
  for (const p of [{ kind: "captive", offer: recruitOffer, then: { kind: "map" } }, { kind: "campfire", stranger: recruitOffer }, { kind: "drill", offers: [] }] as RogueRun["pending"][]) {
    run.pending = p;
    choose(c, run, p.kind === "drill" ? "train" : "lesson");
    assert.equal(pend().kind, "train");
    assert.equal((pend() as { left: number }).left, 3, p.kind);
  }
  // A new act: each member one training (learn, a power step or a version) or gold.
  run.pending = { kind: "region", options: [rogue(c).regions.find((x) => x.act === 2)!.id] };
  choose(c, run, options(c, run)[0]);
  assert.equal(pend().kind, "levelup");
  const opts = options(c, run);
  assert.ok(opts.filter((o) => o !== "gold").every((o) => parseTraining(o)?.cls === (pend() as { queue: string[] }).queue[0]));
  assert.ok(opts.some((o) => parseTraining(o)?.verb !== "learn" && o !== "gold"), "a power step or a version among them");
  // The shop's paid training: learning, and a power step or a version at the upgrade price.
  run.pending = { kind: "shop", stock: [], learn: true, upgrade: true };
  run.gold = 1000;
  const up = options(c, run).find((o) => o.startsWith("power:") || o.startsWith("version:"))!;
  assert.ok(improveOptions(c, run).includes(up));
  choose(c, run, up);
  assert.equal(run.gold, 1000 - rogue(c).config.prices.upgrade);
});

test("rogue (5i): tempering makes a piece one of the next rarity of its slot and kind that its wearer can wear; a rare is reforged into a legendary; a legendary can't be", () => {
  const c = withLoot();
  const run = pastDraft(c, newRogue(c, { seed: 9, leader: "knight" }));
  const it = newItem(run, "fx_plate_common_1", "common");
  run.items.push(it);
  equip(c, run, "knight", "armor", it.uid);
  run.pending = { kind: "choose", what: "temper", why: "test" };
  assert.ok(options(c, run).includes(it.uid));
  choose(c, run, it.uid);
  assert.equal(it.rarity, "uncommon");
  assert.equal(kindOf(c.gear.get(it.base)!), "plate");
  assert.equal(wearer(run, it.uid), "knight", "it stays worn");
  assert.equal(c.gear.get(it.uid)!.name, c.gear.get(it.base)!.name);
  // The plain weapon tempers too, into an uncommon of its kind.
  const plain = member(run, "knight").gear.weapon!;
  const pk = kindOf(c.gear.get(plain)!);
  run.pending = { kind: "choose", what: "temper", why: "test" };
  choose(c, run, plain);
  assert.equal(run.items.find((x) => x.uid === plain)!.rarity, "uncommon");
  assert.equal(kindOf(c.gear.get(plain)!), pk);
  // The Master Smith's reforge: a rare into a legendary of its kind.
  const sw = newItem(run, "fx_sword_rare_1", "rare");
  run.items.push(sw);
  run.pending = { kind: "choose", what: "temper", why: "test", from: ["rare"] };
  choose(c, run, sw.uid);
  assert.equal(sw.rarity, "legendary");
  assert.equal(c.gear.get(sw.base)!.weapon?.kind, "sword");
  assert.equal(temperInto(c, run, sw, null), null, "a legendary has no next rarity");
});

test("rogue (5i): a formation's rarity is its own", () => {
  const c = withLoot();
  assert.equal(formationRarity(c, "neutral"), "common");
  assert.equal(formationRarity(c, "fx_line"), "rare");
  assert.equal(formationRarity(c, "fx_ring"), "legendary");
  // An event's legendary formation is one of the legendary formations.
  const ev = rogue(c).events.flatMap((e) => (e.variants ?? []).map((v, i) => ({ e, v: i, o: v.options.find((o) => o.do.some((op) => op.op === "formation" && op.rarity === "legendary")) }))).find((x) => x.o)!;
  const run = pastDraft(c, newRogue(c, { seed: 4, leader: "knight" }));
  run.at = run.map.find((n) => n.floor === 4)!.id;
  run.pending = { kind: "event", id: ev.e.id, v: ev.v };
  choose(c, run, ev.o!.id);
  assert.equal(formationRarity(c, run.formations.at(-1)!), "legendary");
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
  const c = withLoot();
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
  choose(c, run, options(c, run).find((o) => o.startsWith("power:") || o.startsWith("version:"))!);
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

test("rogue (5i, the retire): with no stock, an offer that would be a piece is another kind or nothing, and nothing breaks", () => {
  const c = withoutLoot();
  const run = newRogue(c, { seed: 17, leader: "knight" });
  while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
  for (const rar of RARS) assert.equal(rollItem(c, run, rngFor(17, rar), rar), null);
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

test("rogue (5i): whole runs play to their end on the fixture's stock, trainings and mythics included", () => {
  const c = withLoot();
  for (let seed = 1; seed <= 4; seed++) {
    const run = playRogue(c, newRogue(c, { seed, leader: ["knight", "cleric", "ranger", "knight"][seed - 1] }), aiPlayer({}, seed), autoFight);
    assert.equal(run.pending.kind, "over");
    assert.ok(run.items.some((it) => it.rarity !== "common"), "it took pieces");
  }
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
  m.missHp = 1000;
  const it = newItem(run, "fx_heart", "common");
  run.items.push(it);
  equip(c, run, "knight", "amulet", it.uid);
  // Current stays max0 - 1000 with a bigger max.
  assert.ok(member(run, "knight").missHp > 1000, "the new max is above current, so more is missing");
  equip(c, run, "knight", "amulet", null);
  assert.equal(member(run, "knight").missHp, 1000, "back to where it was");
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
  choose(c, run, options(c, run).find((o) => parseTraining(o) !== null)!);
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
    for (let i = 0; i < 8 && run.pending.kind !== "map" && run.pending.kind !== "over"; i++) {
      const q = run.pending;
      if (q.kind === "captive") {
        captives++;
        const o = q.offer as { cls: string };
        if (seed % 2) { choose(c, run, "take"); rows++; assert.ok(member(run, o.cls).missHp > 0, "joins hurt"); }
        else if (options(c, run).includes("lesson")) { choose(c, run, "lesson"); lessons++; assert.equal(run.pending.kind, "train"); choose(c, run, options(c, run)[0]); }
        else choose(c, run, "leave");
      } else choose(c, run, options(c, run).includes("skip") ? "skip" : options(c, run).includes("done") ? "done" : options(c, run)[0]);
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
  // Step 5i: with the fixture's stock every option can be picked; with no stock at all, the options that need none play too.
  for (const [c, least] of [[withLoot(), 60], [withoutLoot(), 30]] as const) {
    const ai = aiPlayer({}, 3);
    let played = 0;
    for (const ev of rogue(c).events) {
      const versions = ev.variants?.length ? ev.variants.map((_, v) => v) : [undefined];
      for (const v of versions) for (const opt of eventView(c, { id: ev.id, v }).options) {
        const run = newRogue(c, { seed: 50 + played, leader: "cleric" });
        while (run.pending.kind === "draft") choose(c, run, options(c, run)[0]);
        run.gold = 500;
        run.items.push(newItem(run, "plain_mace", "common"));
        if (c.gear.has("fx_heart")) run.items.push(newItem(run, "fx_heart", "common"), newItem(run, "fx_amulet_rare_1", "rare"));
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

test("rogue (5i): the training opportunities' options are training ids, and every one of them can be taken", () => {
  const c = withLoot();
  const run = pastDraft(c, newRogue(c, { seed: 23, leader: "knight" }));
  for (const o of trainOptions(c, run, [])) {
    const t = parseTraining(o)!;
    assert.ok(t, o);
    const copy = structuredClone(run);
    assert.equal(train(c, copy, o), true, o);
  }
});
