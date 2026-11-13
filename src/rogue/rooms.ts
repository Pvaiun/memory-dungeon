/** Entering a room, arriving at a campfire, choosing the next region, and an event option's effects, in order. */
import type { Content } from "../engine/run.js";
import { int, next, type Rng, shuffle } from "../engine/rng.js";
import type { EventOpT } from "../schema.js";
import { bench, between, cfg, type FightTier, member, note, type Offer, type Pending, r, rogue, type RogueRun } from "./state.js";
import { easyTo, fightSpec, supplyName } from "./fights.js";
import { offerText, rollFormation, rollFormations, rollItem, rollRarity, rollRecruit, rollRecruits, roomForRecruit, shopStock, SUPPLIES, take } from "./offers.js";
import { gainGold, heal, maxOf } from "./party.js";
import { heals, recruit } from "./acts.js";
import { improveOptions, learnOptions, temperable, trainOptions } from "./decisions.js";

// ─── Rooms: entering one, a campfire, an event's effects ────────────────────

/** After a boss's boon: the next act's region, from two (or the only one). */
export function nextAct(c: Content, run: RogueRun) {
  const regs = rogue(c).regions.filter((x) => x.act === run.act + 1).map((x) => x.id);
  const opts = shuffle(r(run, `regions:${run.act + 1}`), regs).slice(0, 2);
  run.pending = { kind: "region", options: opts };
}

/** Enters a room. */
export function enter(c: Content, run: RogueRun, id: string) {
  const node = run.map.find((n) => n.id === id)!;
  run.at = id;
  run.visited.push(id);
  run.floor = node.floor;
  switch (node.kind) {
    case "fight":
    case "elite":
    case "boss":
      run.pending = { kind: "fight", ...fightSpec(c, run, node, node.kind) };
      return;
    case "campfire": return arriveCamp(c, run, id);
    case "muster":
      run.pending = { kind: "muster", offers: rollRecruits(c, run, r(run, `muster:${run.act}:${id}`), cfg(c).muster?.offers ?? 2) };
      return;
    case "drill":
      run.pending = { kind: "drill", offers: rollFormations(c, run, r(run, `drill:${run.act}:${id}`), cfg(c).drill?.offers ?? 2) };
      return;
    case "shop":
      run.stats.shops++;
      run.pending = { kind: "shop", stock: shopStock(c, run, id), learn: true, upgrade: true };
      return;
    case "treasure": {
      const rng = r(run, `chest:${run.act}:${id}`);
      const t = cfg(c).treasure;
      // Sometimes a cage: a recruit with a piece suited to it.
      let offer: Offer | null = null;
      if (next(rng) * 100 < (t.cage ?? 0)) {
        const o = rollRecruit(c, run, rng);
        if (o?.kind === "recruit") { const item = rollItem(c, run, rng, "uncommon", false, false, o.cls); offer = { ...o, ...(item ? { item } : {}) }; }
      }
      if (!offer) {
        // With no piece to find, the chest holds a supply.
        const item = rollItem(c, run, rng, rollRarity(rng, t.rarity), false, true);
        offer = item ? { kind: "gear", item } : { kind: "supply", id: SUPPLIES[int(rng, SUPPLIES.length)] };
      }
      run.pending = { kind: "treasure", offer, gold: between(rng, t.gold) };
      return;
    }
    case "event": {
      run.stats.events++;
      const all = rogue(c).events;
      const fresh = all.filter((e) => !run.seen.includes(e.id));
      const pool = fresh.length ? fresh : all;
      const rng = r(run, `event:${run.act}:${id}`);
      const ev = pool[int(rng, pool.length)];
      run.seen.push(ev.id);
      // An event with versions rolls one, so a known event can still surprise.
      run.pending = { kind: "event", id: ev.id, ...(ev.variants?.length ? { v: int(rng, ev.variants.length) } : {}) };
      return;
    }
  }
}

/**
 * A campfire reached. Everyone, party and camp, recovers the free share on arrival (`campfire.auto`), the fallen rising first;
 * then the pick waits. Sometimes a stranger at the fire asks to join (one recruit, take it or not; it doesn't use the pick).
 */
export function arriveCamp(c: Content, run: RogueRun, key: string) {
  run.stats.campfires++;
  const k = cfg(c).campfire;
  if (k.auto) {
    const raised = run.roster.filter((m) => m.ko);
    for (const m of raised) (m.ko = false), (m.missHp = Math.floor((maxOf(c, run, m.cls, "max_hp") * (100 - k.auto.revive)) / 100));
    heal(c, run, run.roster.filter((m) => !raised.includes(m)), k.auto.hp, 0);
    heal(c, run, run.roster, 0, k.auto.mp);
    if (raised.length) note(run, `${raised.map((m) => c.classes.get(m.cls)!.name).join(", ")} back on their feet.`);
  }
  const rng = r(run, `stranger:${run.act}:${key}`);
  const stranger = next(rng) * 100 < (k.stranger ?? 0) ? rollRecruit(c, run, rng) : null;
  run.pending = { kind: "campfire", resting: bench(run), ...(stranger ? { stranger } : {}) };
}
const signed = (n: number) => `${n > 0 ? "+" : ""}${n}`;
/** An event option's effects, in order. A fight, a camp or a choice ends the list there and waits on it. */
export function doOps(c: Content, run: RogueRun, ops: readonly EventOpT[], rng: Rng) {
  const party = () => run.party.map((cls) => member(run, cls));
  // What happens at once happens first; a choice, a camp or a fight comes last and waits (a cost listed after a choice
  // would otherwise never be paid).
  const waits = (op: EventOpT) => ["learn", "upgrade", "temper", "camp", "fight", "train", "muster"].includes(op.op);
  ops = [...ops.filter((op) => !waits(op)), ...ops.filter(waits)];
  for (const op of ops) {
    switch (op.op) {
      case "gold": gainGold(run, op.amount); note(run, `${op.amount > 0 ? "+" : ""}${op.amount} gold.`); break;
      case "hp": {
        const who = op.one ? [party().filter((m) => !m.ko)[0]].filter(Boolean) : party();
        if (op.pct >= 0) heal(c, run, who, op.pct, 0);
        else for (const m of who) if (!m.ko) m.missHp = Math.min(maxOf(c, run, m.cls, "max_hp") - 1, m.missHp + Math.floor((maxOf(c, run, m.cls, "max_hp") * -op.pct) / 100));
        if (who.length) note(run, `${op.one ? `The ${c.classes.get(who[0].cls)!.name}` : "Everyone"} ${signed(op.pct)}% HP.`);
        break;
      }
      case "mp":
        if (op.pct >= 0) heal(c, run, party(), 0, op.pct);
        else for (const m of party()) m.missMp = Math.min(maxOf(c, run, m.cls, "max_mp"), m.missMp + Math.floor((maxOf(c, run, m.cls, "max_mp") * -op.pct) / 100));
        note(run, `Everyone ${signed(op.pct)}% MP.`);
        break;
      case "revive":
        for (const m of run.roster.filter((x) => x.ko)) (m.ko = false), (m.missHp = Math.floor((maxOf(c, run, m.cls, "max_hp") * (100 - op.pct)) / 100)), note(run, `The ${c.classes.get(m.cls)!.name} is back on their feet.`);
        break;
      case "gear": {
        // Nothing, with no piece to find (an option that only finds one isn't offered then).
        const item = rollItem(c, run, rng, op.rarity);
        if (!item) break;
        const o: Offer = { kind: "gear", item };
        take(c, run, o);
        note(run, `Gained ${offerText(c, run, o)}.`);
        break;
      }
      case "recruit": {
        const o = op.healer ? rollRecruit(c, run, rng, run.roster.length ? c.pack.classes.map((k) => k.id).filter((id) => !heals(c, id)) : [], 1, op.known) : rollRecruit(c, run, rng, [], 1, op.known);
        if (o?.kind === "recruit") {
          const item = (op.gear ? rollItem(c, run, rng, op.gear, false, false, o.cls) : null) ?? undefined;
          recruit(c, run, o.cls, op.hp ?? 100, o.known, item);
          note(run, `${c.classes.get(o.cls)!.name} joins.`);
        }
        break;
      }
      case "formation": { const o = rollFormation(c, run, rng, [], op.rarity); if (o) (take(c, run, o), note(run, `Gained ${offerText(c, run, o)}.`)); break; }
      case "seat": if (take(c, run, { kind: "seat" })) note(run, "Room for one more at camp."); break;
      case "trade": {
        // The newest member who isn't the leader leaves (its gear stays in the bag); a stranger joins knowing all three.
        const out = [...run.roster].reverse().find((m) => m.cls !== run.leader);
        if (!out) break;
        const seat = run.party.indexOf(out.cls);
        out.gear = {};
        run.roster = run.roster.filter((m) => m !== out);
        if (seat >= 0) run.party.splice(seat, 1);
        const o = rollRecruit(c, run, rng, [out.cls], 3, 3);
        note(run, `The ${c.classes.get(out.cls)!.name} leaves with the rival company.`);
        if (o?.kind === "recruit") (recruit(c, run, o.cls, 100, o.known), note(run, `${c.classes.get(o.cls)!.name} joins.`));
        break;
      }
      case "train": if (trainOptions(c, run, []).length) return void (run.pending = { kind: "train", left: op.n, done: [], then: { kind: "map" }, why: "event" }); break;
      case "muster": {
        if (!roomForRecruit(c, run)) break;
        // Each may carry a piece suited to it; a fight listed after the pick follows it (the Prisoner Convoy's guards).
        const offers = rollRecruits(c, run, rng, op.n, 1, op.known).map((o): Offer => {
          const item = op.gear && o.kind === "recruit" ? rollItem(c, run, rng, op.gear, false, false, o.cls) : null;
          return item ? { ...(o as Extract<Offer, { kind: "recruit" }>), item } : o;
        });
        const fight = ops.slice(ops.indexOf(op) + 1).find((x) => x.op === "fight");
        const node = run.map.find((n) => n.id === run.at);
        const then: Pending | undefined = fight?.op === "fight" && node ? { kind: "fight", ...fightSpec(c, run, { ...node, floor: Math.max(node.floor, easyTo(c) + 1) }, fight.tier === "elite" ? "elite" : "fight") } : undefined;
        return void (run.pending = { kind: "muster", offers, ...(then ? { then } : {}) });
      }
      case "supply": {
        if (op.id === "phoenix" && run.roster.some((m) => m.ko)) {
          const m = run.roster.find((x) => x.ko)!;
          m.ko = false;
          m.missHp = Math.floor(maxOf(c, run, m.cls, "max_hp") / 2);
          note(run, `A phoenix feather: the ${c.classes.get(m.cls)!.name} is back on their feet.`);
        } else note(run, take(c, run, { kind: "supply", id: op.id }) ? `Found ${supplyName(op.id)}.` : `Found ${supplyName(op.id)}, but the bag is full.`);
        break;
      }
      case "learn": if (learnOptions(c, run).length) return void (run.pending = { kind: "choose", what: "learn", why: "event" }); break;
      case "upgrade": if (improveOptions(c, run).length) return void (run.pending = { kind: "choose", what: "upgrade", why: "event" }); break;
      case "temper": if (temperable(c, run, op.from).length) return void (run.pending = { kind: "choose", what: "temper", why: "event", ...(op.from ? { from: op.from } : {}), ...(op.risk ? { risk: op.risk } : {}) }); break;
      case "camp": return arriveCamp(c, run, `event:${run.at}`);
      case "fight": {
        const node = run.map.find((n) => n.id === run.at)!;
        const tier: FightTier = op.tier === "elite" ? "elite" : "fight";
        return void (run.pending = { kind: "fight", ...fightSpec(c, run, { ...node, floor: Math.max(node.floor, easyTo(c) + 1) }, tier) });
      }
      case "chance": {
        // A gamble says how it went.
        const hit = next(rng) * 100 < op.pct;
        note(run, hit ? "Luck was with you." : "Luck was against you.");
        return doOps(c, run, hit ? op.then : op.else, rng);
      }
    }
  }
}
