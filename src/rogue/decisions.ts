/** The pending decision: what it offers, why an event's option is closed, and answering it (`choose`). */
import type { Content } from "../engine/run.js";
import type { EventOpT, RarityT, RogueEventT, SupplyIdT } from "../schema.js";
import { int, next, type Rng } from "../engine/rng.js";
import { canEquip } from "../validate.js";
import { bench, cfg, type Item, member, note, type Offer, type Pending, r, rogue, type RogueRun, type Slot, SLOT_LIST } from "./state.js";
import { beginAct, draftPending, reachable, recruit, rollKnown, seatsOf } from "./acts.js";
import { canRoll, canTake, heldLegendaries, kindOf, offerText, pieceRarity, piecesAt, priced, RARITIES, roomForRecruit, sellPrice, take, trained, trainPrice } from "./offers.js";
import { bag, itemOf, registerGear, supplyName, wearer } from "./fights.js";
import { learn, parseTraining, train, trainingId, trainingsFor, unlearned } from "./training.js";
import { doOps, enter, nextAct } from "./rooms.js";
import { gainGold, heal, holdCurrent, maxOf } from "./party.js";

// ─── Decisions ──────────────────────────────────────────────────────────────

/** The options of the pending decision, as ids. Free actions (gear, formation, seats, supplies, swaps) aren't among them. */
export function options(c: Content, run: RogueRun): string[] {
  const p = run.pending;
  switch (p.kind) {
    case "draft": return p.offers;
    case "map": return reachable(run).map((n) => n.id);
    case "fight": return [];
    case "drop": return p.options;
    case "spoils": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), "skip"];
    case "boon": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), "skip"];
    case "trophy": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), "skip"];
    case "captive": return [canTake(c, run, p.offer) ? "take" : "", trainOptions(c, run, []).length ? "lesson" : "", "leave"].filter(Boolean);
    case "muster": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), "skip"];
    case "drill": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), ...(trainOptions(c, run, []).length ? ["train"] : []), "skip"];
    case "train": return [...trainOptions(c, run, p.done), p.back && !p.done.length ? "back" : "done"];
    case "treasure": return [canTake(c, run, p.offer) ? "take" : "", "leave"].filter(Boolean);
    case "shop": {
      const out = p.stock.map((s, i) => (!s.sold && s.price <= run.gold && canTake(c, run, s.offer) ? `buy:${i}` : "")).filter(Boolean);
      if (p.learn && run.gold >= trainPrice(c, p, "learn")) out.push(...learnOptions(c, run).map((o) => `learn:${o}`));
      // A power step or a version, at the upgrade price.
      if (p.upgrade && run.gold >= trainPrice(c, p, "upgrade")) out.push(...improveOptions(c, run));
      out.push(...bag(run).map((it) => `sell:${it.uid}`));
      return [...out, "leave"];
    }
    case "campfire": {
      // Once its pick is made, the campfire waits for LEAVE: swaps stay open until then.
      // TRAIN teaches or upgrades members (the nested training screen); a stranger at the fire can be taken in
      // whatever the pick, and doesn't use it.
      const stranger = p.stranger ? [canTake(c, run, p.stranger) ? "recruit" : "", cfg(c).campfire.auto && trainOptions(c, run, []).length ? "lesson" : ""].filter(Boolean) : [];
      if (p.used) return [...stranger, "leave"];
      // With the free share on arrival, one pick of two: REST or TRAIN.
      if (cfg(c).campfire.auto) return ["rest", ...(trainOptions(c, run, []).length ? ["train"] : []), ...stranger];
      const out = ["rest", "focus"];
      for (const m of run.roster) if (m.ko) out.push(`raise:${m.cls}`);
      if (trainOptions(c, run, []).length) out.push("train");
      return [...out, ...stranger];
    }
    case "event": {
      const ok = eventView(c, p).options.filter((o) => (o.gold ?? 0) <= run.gold && o.do.every((op) => possible(c, run, op))).map((o) => o.id);
      // Nothing it offers can happen now: the party walks on.
      return ok.length ? ok : ["walk_on"];
    }
    case "choose":
      if (p.what === "learn") return learnOptions(c, run);
      if (p.what === "upgrade") return improveOptions(c, run);
      return temperable(c, run, p.from).map((it) => it.uid);
    case "levelup":
      // Learn one more, or train one known (a power step or a version): breadth or depth, a real choice even with one ability
      // left to learn. Or gold instead: a level-up late in a run can have one thing left, which is no choice.
      return [...trainingsFor(c, run, p.queue[0]).map(trainingId), ...(cfg(c).levelGold ? ["gold"] : [])];
    case "region": return p.options;
    case "over": return [];
  }
}
/** Why an event's option can't be picked now, in a player's words (empty when it can). */
export function whyNot(c: Content, run: RogueRun, opt: RogueEventT["options"][number]): string {
  if ((opt.gold ?? 0) > run.gold) return "not enough gold";
  const op = opt.do.find((x) => !possible(c, run, x));
  if (!op) return "";
  return op.op === "recruit" || op.op === "muster" ? "no room at camp" : op.op === "seat" ? "the camp is as big as it gets" : op.op === "train" ? "nothing left to train" : op.op === "trade" ? "nobody to trade" : op.op === "learn" ? "nothing left to learn" : op.op === "upgrade" ? "nothing left to train" : op.op === "temper" ? "no piece it can work on" : op.op === "formation" ? "every formation owned" : op.op === "gear" ? "nothing to find" : "can't happen now";
}
/**
 * Pieces a temper can take: of the rarities given (default common and uncommon), where a piece of the next rarity of its slot and
 * kind exists that its wearer can wear (a rare one becomes a legendary of its kind, the Master Smith's reforge).
 */
export function temperable(c: Content, run: RogueRun, from: readonly RarityT[] = ["common", "uncommon"]): Item[] {
  registerGear(c, run);
  return run.items.filter((it) => from.includes(it.rarity) && !!temperInto(c, run, it, null));
}
/**
 * The piece a temper makes of an item: one of the next rarity in the same slot and kind, that its wearer (or, in the bag,
 * someone in the roster who can wear this one) can wear; a legendary the run holds only when no other is left. Null when there's
 * none (a legendary or a mythic has no next rarity). Without dice, the first.
 */
export function temperInto(c: Content, run: RogueRun, it: Item, rng: Rng | null): string | null {
  const up = RARITIES[RARITIES.indexOf(priced(it.rarity)) + 1];
  const g = c.gear.get(it.base);
  const kind = g && kindOf(g);
  if (!up || it.rarity === "mythic" || !g || !kind) return null;
  const who = wearer(run, it.uid);
  const users = (who ? [who] : run.roster.map((m) => m.cls).filter((cls) => canEquip(c.classes.get(cls)!, g))).map((cls) => c.classes.get(cls)!);
  const fits = piecesAt(c, g.slot as Slot, kind, up).filter((id) => users.some((k) => canEquip(k, c.gear.get(id)!)));
  const held = heldLegendaries(run);
  const fresh = fits.filter((id) => !held.has(id));
  const pool = fresh.length ? fresh : fits;
  if (!pool.length) return null;
  return rng ? pool[int(rng, pool.length)] : pool[0];
}
/** Can an event's verb happen now? A recruit needs room at camp, learning something to learn, tempering a piece to temper. */
function possible(c: Content, run: RogueRun, op: EventOpT): boolean {
  if (op.op === "recruit" || op.op === "muster") return roomForRecruit(c, run);
  if (op.op === "seat") return seatsOf(c, run) < (cfg(c).benchMax ?? cfg(c).bench);
  if (op.op === "train") return trainOptions(c, run, []).length > 0;
  if (op.op === "trade") return run.roster.some((m) => m.cls !== run.leader);
  if (op.op === "learn") return learnOptions(c, run).length > 0;
  if (op.op === "upgrade") return improveOptions(c, run).length > 0;
  if (op.op === "temper") return temperable(c, run, op.from).length > 0;
  // A find needs a piece in the stock.
  if (op.op === "gear") return canRoll(c, op.rarity);
  if (op.op === "revive") return true;
  if (op.op === "formation") return c.pack.formations.some((f) => !run.formations.includes(f.id));
  return true;
}
/** `cls:ability` for every ability someone in the roster can learn. */
export const learnOptions = (c: Content, run: RogueRun) => run.roster.flatMap((m) => unlearned(c, m).map((a) => `${m.cls}:${a}`));
/** Every power step and version someone in the roster can take, as training ids (`power:…`, `version:…:a`). */
export const improveOptions = (c: Content, run: RogueRun) => run.roster.flatMap((m) => trainingsFor(c, run, m.cls).filter((t) => t.verb !== "learn").map(trainingId));
export const eventOf = (c: Content, id: string): RogueEventT => rogue(c).events.find((e) => e.id === id)!;
/** An event as it's met: its version's text and options, else its own. */
export function eventView(c: Content, p: { id: string; v?: number }): { name: string; text: string; options: RogueEventT["options"] } {
  const ev = eventOf(c, p.id);
  const v = p.v !== undefined ? ev.variants?.[p.v] : undefined;
  return { name: ev.name, text: v?.text ?? ev.text, options: v?.options ?? ev.options };
}
/**
 * What a training opportunity can do, for every member not yet trained in it (the nested screen groups them by member, then
 * ability), as training ids: `learn:cls:ability`, `power:cls:id`, `version:cls:id:a` or `:b` (`parseTraining`).
 */
export const trainOptions = (c: Content, run: RogueRun, done: string[]) =>
  run.roster.filter((m) => !done.includes(m.cls)).flatMap((m) => trainingsFor(c, run, m.cls).map(trainingId));

/** Answers the pending decision. Throws on an option that isn't one. */
export function choose(c: Content, run: RogueRun, pick: string) {
  const opts = options(c, run);
  if (!opts.includes(pick)) throw new Error(`'${pick}' isn't an option at ${run.pending.kind}: ${opts.join(", ")}`);
  const p = run.pending;
  const tally = pickKind(run, pick);
  run.stats.picks[tally] = (run.stats.picks[tally] ?? 0) + 1;
  switch (p.kind) {
    case "draft": {
      recruit(c, run, pick, 100, p.known?.[pick] ?? rollKnown(c, r(run, `draft-known:${pick}`), pick, 1));
      note(run, `${c.classes.get(pick)!.name} joins.`);
      run.pending = p.left > 1 ? draftPending(c, run, cfg(c).start.picks - p.left + 2, p.left - 1) : { kind: "map" };
      return;
    }
    case "map": return enter(c, run, pick);
    case "drop": {
      run.supplies.push(pick as SupplyIdT);
      note(run, `Took ${supplyName(pick as SupplyIdT)}.`);
      run.pending = p.then;
      return;
    }
    case "spoils":
    case "boon": {
      if (p.kind === "spoils") gainGold(run, p.gold);
      if (pick !== "skip") {
        const o = p.offers[Number(pick.split(":")[1])];
        take(c, run, o);
        note(run, `Took ${offerText(c, run, o)}.`);
      }
      if (p.kind === "boon") return nextAct(c, run);
      run.pending = p.then ?? { kind: "map" };
      return;
    }
    case "captive": {
      const o = p.offer as Extract<Offer, { kind: "recruit" }>;
      if (pick === "take") (recruit(c, run, o.cls, cfg(c).captive?.hp ?? 100, o.known), note(run, `A captive ${c.classes.get(o.cls)!.name} joins.`));
      else if (pick === "lesson") return void (run.pending = { kind: "train", left: cfg(c).lesson ?? 3, done: [], then: p.then, why: "captive", back: p });
      run.pending = p.then;
      return;
    }
    case "trophy": {
      if (pick !== "skip") {
        const o = p.offers[Number(pick.split(":")[1])];
        take(c, run, o);
        note(run, `Took ${offerText(c, run, o)}.`);
      }
      run.pending = p.then;
      return;
    }
    case "muster": {
      if (pick !== "skip") {
        const o = p.offers[Number(pick.split(":")[1])];
        take(c, run, o);
        note(run, `${offerText(c, run, o)} joins.`);
      }
      run.pending = p.then ?? { kind: "map" };
      return;
    }
    case "drill": {
      if (pick === "train") return void (run.pending = { kind: "train", left: cfg(c).drill?.train ?? 3, done: [], then: { kind: "map" }, why: "drill", back: p });
      if (pick !== "skip") {
        const o = p.offers[Number(pick.split(":")[1])];
        take(c, run, o);
        note(run, `Took ${offerText(c, run, o)}.`);
      }
      run.pending = { kind: "map" };
      return;
    }
    case "train": {
      if (pick === "back") return void (run.pending = p.back!);
      // A campfire's pick is spent with the first member trained, not on opening the screen; a stranger's lesson spends the stranger.
      if (pick !== "done" && !p.done.length && p.then.kind === "campfire") {
        if (p.why === "stranger") (delete p.then.stranger, note(run, "The stranger teaches, and moves on."));
        else if (!p.then.used) (note(run, "Trained."), campUsed(c, run, p.then));
      }
      delete p.back;
      if (pick !== "done") {
        const t = parseTraining(pick)!;
        train(c, run, t);
        p.done.push(t.cls);
        p.left--;
      }
      if (pick === "done" || p.left <= 0 || !trainOptions(c, run, p.done).length) run.pending = p.then;
      return;
    }
    case "treasure": {
      gainGold(run, p.gold);
      if (pick === "take") (take(c, run, p.offer), note(run, `Found ${offerText(c, run, p.offer)}.`));
      run.pending = { kind: "map" };
      return;
    }
    case "shop": {
      if (pick === "leave") return void (run.pending = { kind: "map" });
      const [verb, ...rest] = pick.split(":");
      const arg = rest.join(":");
      if (verb === "buy") {
        const s = p.stock[Number(arg)];
        if (!take(c, run, s.offer)) return;
        s.sold = true;
        spend(run, s.price);
        note(run, `Bought ${offerText(c, run, s.offer)} for ${s.price}.`);
      } else if (verb === "sell") {
        const it = itemOf(run, arg)!;
        const price = sellPrice(c, it);
        run.items = run.items.filter((x) => x.uid !== arg);
        gainGold(run, price);
        note(run, `Sold ${c.gear.get(arg)?.name ?? it.base} for ${price}.`);
      } else if (verb === "learn") {
        const [cls, ab] = arg.split(":");
        const price = trainPrice(c, p, "learn");
        if (!learn(c, run, cls, ab)) return;
        spend(run, price);
        trained(c, p, "learn");
      } else if (verb === "power" || verb === "version") {
        // A power step or a version, at the upgrade price.
        const price = trainPrice(c, p, "upgrade");
        if (!train(c, run, pick)) return;
        spend(run, price);
        trained(c, p, "upgrade");
      }
      return;
    }
    case "campfire": {
      const k = cfg(c).campfire;
      const party = run.party.map((cls) => member(run, cls));
      const [verb, ...rest] = pick.split(":");
      if (verb === "leave") return void (run.pending = { kind: "map" });
      if (verb === "recruit") {
        // The stranger at the fire: taken in, and the campfire's own pick still waits.
        if (p.stranger) (take(c, run, p.stranger), note(run, `${offerText(c, run, p.stranger)} joins at the fire.`));
        delete p.stranger;
        return;
      }
      // The stranger turned away for a lesson (one member), apart from the campfire's pick.
      if (verb === "lesson") return void (run.pending = { kind: "train", left: cfg(c).lesson ?? 3, done: [], then: p, why: "stranger", back: p });
      if (verb === "rest" && k.auto) {
        heal(c, run, run.roster.filter((m) => !m.ko), k.hp, k.mp);
        note(run, "Rested.");
        p.used = true;
        return;
      }
      if (verb === "train") return void (run.pending = { kind: "train", left: k.train ?? 1, done: [], then: p, why: "campfire", back: p });
      if (verb === "rest") (heal(c, run, party, k.hp, 0), note(run, "Rested."));
      else if (verb === "focus") (heal(c, run, party, 0, k.mp), note(run, "Focused."));
      else if (verb === "raise") {
        const m = member(run, rest[0]);
        m.ko = false;
        m.missHp = Math.floor((maxOf(c, run, m.cls, "max_hp") * (100 - k.revive)) / 100);
        note(run, `Raised the ${c.classes.get(m.cls)!.name}.`);
      }
      campUsed(c, run, p, verb === "raise" ? rest[0] : undefined);
      return;
    }
    case "event": {
      const ev = eventView(c, p);
      const o = ev.options.find((x) => x.id === pick);
      if (!o) return void ((run.pending = { kind: "map" }), note(run, `${ev.name}: walked on.`));
      if (o.gold) spend(run, o.gold);
      note(run, `${ev.name}: ${o.label.toLowerCase()}.`);
      run.pending = { kind: "map" };
      doOps(c, run, o.do, r(run, `event:${run.act}:${run.at}:${pick}`));
      return;
    }
    case "choose": {
      if (p.what === "learn") learn(c, run, ...(pick.split(":") as [string, string]));
      else if (p.what === "upgrade") train(c, run, pick);
      else {
        const it = itemOf(run, pick)!;
        const rng = r(run, `temper:${pick}`);
        // A risky temper (the drunk smith) can crack the piece instead.
        if (p.risk && next(rng) * 100 < p.risk) {
          for (const m of run.roster) for (const s of SLOT_LIST) if (m.gear[s] === it.uid) delete m.gear[s];
          run.items = run.items.filter((x) => x.uid !== it.uid);
          note(run, `The ${c.gear.get(it.uid)?.name ?? "piece"} cracked in the forge and is lost.`);
        } else {
          // The piece becomes a piece of the next rarity of its slot and kind, one its wearer can wear (a rare one a
          // legendary: the reforge). It stays where it is; its wearer keeps the HP and MP it has.
          const was = c.gear.get(it.base)!.name;
          const into = temperInto(c, run, it, rng)!;
          const who = wearer(run, it.uid);
          holdCurrent(c, run, who ? [who] : [], () => ((it.base = into), (it.rarity = pieceRarity(c, into)), registerGear(c, run), true));
          note(run, `${it.rarity === "legendary" ? "Reforged" : "Tempered"}: ${was} into ${c.gear.get(it.uid)!.name}.`);
        }
      }
      run.pending = { kind: "map" };
      return;
    }
    case "levelup": {
      const cls = p.queue[0];
      const m = member(run, cls);
      if (pick === "gold") (gainGold(run, cfg(c).levelGold ?? 0), note(run, `${c.classes.get(cls)!.name} takes ${cfg(c).levelGold} gold instead.`));
      else train(c, run, pick);
      const queue = p.queue.slice(1).filter((x) => run.roster.some((mm) => mm.cls === x));
      run.pending = queue.length ? { kind: "levelup", queue } : { kind: "map" };
      return;
    }
    case "region": {
      run.act++;
      beginAct(c, run, pick, true);
      const queue = run.roster.map((m) => m.cls).filter((cls) => trainingsFor(c, run, cls).length);
      run.pending = queue.length ? { kind: "levelup", queue } : { kind: "map" };
      return;
    }
    default:
      throw new Error(`nothing to choose at ${p.kind}`);
  }
}
/**
 * A campfire's pick is spent. Those standing at camp rest (a share of REST) whatever the party picks: those who were at camp when
 * the campfire was reached, not a member stepped back just for it, nor one raised here just now. HP only (the bench's MP comes
 * back after every fight it sits out).
 */
function campUsed(c: Content, run: RogueRun, p: Extract<Pending, { kind: "campfire" }>, raised?: string) {
  const k = cfg(c).campfire;
  // With the free share on arrival there's no camp share on top.
  if (k.auto) return void (p.used = true);
  const camp = bench(run).map((cls) => member(run, cls));
  heal(c, run, camp.filter((m) => (p.resting ?? camp.map((x) => x.cls)).includes(m.cls) && m.cls !== raised), Math.round((k.hp * (k.camp ?? 100)) / 100), 0);
  p.used = true;
}
/** A pick as a counter's name: the decision and what kind of thing was picked ("map:elite", "spoils:gear", "shop:buy:recruit"). */
function pickKind(run: RogueRun, pick: string): string {
  const p = run.pending;
  const [verb, arg] = pick.split(":");
  switch (p.kind) {
    case "map": return `map:${run.map.find((n) => n.id === pick)?.kind}`;
    case "captive": return `captive:${pick}`;
    case "spoils": case "boon": case "muster": case "drill": case "trophy": return pick === "skip" || pick === "train" ? `${p.kind}:${pick}` : `${p.kind}:${p.offers[Number(arg)].kind}`;
    case "train": return `train:${verb}`;
    case "shop": return verb === "buy" ? `shop:buy:${p.stock[Number(arg)].offer.kind}` : `shop:${verb}`;
    case "choose": return `choose:${p.what}`;
    case "levelup": return "levelup";
    case "draft": return "draft";
    case "region": return `region:${pick}`;
    case "drop": return `drop:${pick}`;
    case "event": return `event:${p.id}:${pick}`;
    default: return `${p.kind}:${verb}`;
  }
}
function spend(run: RogueRun, n: number) {
  run.gold -= n;
  run.stats.spent += n;
}
