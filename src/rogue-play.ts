/**
 * The rogue mode from the command line, for an AI playtester: what a player would see at each step of a run, and the
 * player's moves. The run is saved to a file between commands. Enemy stats stay hidden; a fight is told as a short
 * summary of what a player would have watched.
 *
 *   npx tsx src/rogue-play.ts new <leader> [--seed N] [--save file]      start a run (leaders: knight, cleric, ranger)
 *   npx tsx src/rogue-play.ts look                                       where the run stands, and what it's waiting on
 *   npx tsx src/rogue-play.ts pick <option>                              answer it (a room, an offer, "fight", ...)
 *   npx tsx src/rogue-play.ts map                                        the act's whole map
 *   npx tsx src/rogue-play.ts boss                                       the act's boss and what it does
 *   npx tsx src/rogue-play.ts party                                      the roster: stats, gear, abilities, the bag
 *   npx tsx src/rogue-play.ts class <id>                                 a class's sheet: passive, every ability
 *   npx tsx src/rogue-play.ts equip <class> <weapon|armor|amulet> <item|none>
 *   npx tsx src/rogue-play.ts formation <id>     seat <a,b,c>     order <class> <ability,...|none>   (abilities left out aren't brought)
 *   npx tsx src/rogue-play.ts use <potion|tonic|phoenix> [class]   swap <party member> <member at camp>
 *     (swap: at a campfire; any time between rooms for a fallen party member and someone standing at camp)
 *   npx tsx src/rogue-play.ts glossary                                   what each status shown in a fight does
 *
 * --save picks the file (default out/rogue-play/run.json); every command takes it.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { advance, loadContent, type Content } from "./engine/run.js";
import { combat } from "./engine/combat/rules.js";
import type { Entry } from "./engine/log.js";
import {
  actRoll, bagRoom, bench, bossFoes, canManage, choose, discard, dismiss, endFight, equip, eventView, formationRarity, itemGear, itemOf, maxOf, seatsOf, trainOptions, member, newRogue, options, reachable, registerGear, rogue,
  learnOptions, migrate, seat, sellPrice, upgradeOptions, whyNot, setFormation, setOrder, startFight, swap, trainPrice, unlearned, upgraded, useSupply, wearer, type Item, type Offer, type RogueRun, type Slot,
} from "./rogue.js";
import type { AbilityT, NumT } from "./schema.js";
import { summary } from "./play-summary.js";
import { combat as rules, type Member as EngineMember } from "./engine/combat/rules.js";
import { headStart } from "./engine/combat/stats.js";

const c = loadContent(JSON.parse(readFileSync("content/core-set.pack.json", "utf8")));
const argv = process.argv.slice(2);
const opt = (name: string) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
const SAVE = opt("--save") ?? "out/rogue-play/run.json";
const args = argv.filter((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--")));
const [cmd, ...rest] = args;

function load(): RogueRun {
  const run = migrate(JSON.parse(readFileSync(SAVE, "utf8")) as RogueRun);
  registerGear(c, run);
  return run;
}
function save(run: RogueRun) {
  mkdirSync(SAVE.split("/").slice(0, -1).join("/") || ".", { recursive: true });
  writeFileSync(SAVE, JSON.stringify(run));
}

// ─── Words ──────────────────────────────────────────────────────────────────

const ROMAN = ["", "I", "II", "III"];
/** What each stat does, in a player's words (a playtester found the glossary covered statuses only). */
const STAT_WORDS: [string, string][] = [
  ["max_hp, max_mp", "HP and MP. Gear that raises the max raises current HP or MP with it, and takes it away when it comes off: what's missing stays missing."],
  ["mp_regen", "MP regained over a fight."],
  ["attack, magic", "What physical and magical hits and heals scale from (ability sizes in party are worked out from them)."],
  ["armor", "Shrinks physical hits: small hits a lot, big hits little."],
  ["aggro", "How likely foes are to aim at this member, centred on 100: a foe's move without a target rule picks one of the party by draw, which comes from aggro through a curve (an ordinary member draws 100, nobody more than 300 or less than 33), when it starts. Taunt draws every such move to the taunter."],
  ["crit_chance, crit_damage", "How often a hit crits, and how much more a crit deals."],
  ["evasion, accuracy", "Evasion: a share of physical hits missed. Accuracy cancels a foe's evasion."],
  ["thorns", "Damage dealt back to whoever hits this member."],
  ["lifesteal", "A share of damage dealt comes back as HP."],
  ["siphon", "A share of damage dealt comes back as MP."],
  ["double_strike", "A chance for a basic attack to hit twice."],
  ["healing_received", "More or less from every heal."],
  ["resist:<element>", "Less damage of that element; past 100%, the damage heals it instead (\"absorbs\")."],
  ["weapon kinds", "A weapon kind sets which classes can use it and how its basic attack swings (how often, and physical or an element)."],
];
const pts = (n: number) => Math.round(n / 100) / 10;
const statWord = (stat: string, v: number) => {
  const pct = /crit|evasion|accuracy|double|lifesteal|siphon|resist/.test(stat);
  // HP and MP in the numbers the party shows (an AI playtester read "max_hp +0.5" as half a point); the rest on the documents' 1-5 scale.
  // Aggro is on its own scale, centred on 100: shown as it is.
  const real = stat === "max_hp" || stat === "max_mp" || stat === "aggro";
  return `${stat.replace("crit_multiplier", "crit_damage")} ${v > 0 ? "+" : ""}${pct ? `${v}%` : real ? v : pts(v)}`;
};
/** An ability's size for a unit's stats: each hit, a heal, a shield, the stacks it adds. */
const val = (n: NumT | undefined, st: Record<string, number>) => (n === undefined ? 1 : typeof n === "number" ? n : (n.base ?? 0) + n.scale.reduce((t, x) => t + (x.stat && x.of !== "target" ? x.ratio * (st[x.stat] ?? 0) : 0), 0));
function sizeOf(a: AbilityT, st: Record<string, number>, mult = 1): string {
  const out: string[] = [];
  const stacks = (id: string, n: NumT | undefined) => {
    const d = c.statuses.get(id)!;
    if (d.stacking !== "intensity") return d.name;
    const v = Math.round(val(n, st) * 10) / 10;
    // Past a status's cap, the cap (a playtester saw "+25.5 CHILL" on foes that hold 8).
    return typeof d.cap === "number" && v > d.cap ? `${d.cap} ${d.name} (the most it holds)` : `${v} ${d.name}`;
  };
  for (const e of a.do) {
    if (e.op === "damage") {
      const kind = e.element ?? (e.type === "physical" ? e.subtype ?? "physical" : "untyped");
      const v = Math.round(val(e.amount, st) * mult);
      out.push(`${v ? `about ${v} ` : ""}${kind}${e.hits && e.hits > 1 ? ` x${e.hits}` : ""}${(e.apply ?? []).map((x) => ` + ${x.status === "shield" ? `${Math.round(val(x.stacks, st))} shield` : stacks(x.status, x.stacks)}`).join("")}`);
    } else if (e.op === "heal") out.push(`heals about ${Math.round(val(e.amount, st))}`);
    else if (e.op === "apply" && e.status === "shield") out.push(`shield about ${Math.round(val(e.stacks, st))} (at most half its target's max HP)`);
    else if (e.op === "apply" && c.statuses.get(e.status)!.stacking === "intensity") out.push(stacks(e.status, e.stacks));
  }
  return out.join(" + ");
}
const codes = (stats: { stat: string; flat?: number }[] = []) => stats.map((s) => statWord(s.stat, s.flat ?? 0)).join(", ");
function gearWords(g: ReturnType<typeof itemGear> | undefined): string {
  if (!g) return "nothing";
  const kind = g.weapon?.kind ? `${g.weapon.kind}` : g.weight ? `${g.weight} armor` : "amulet";
  // A rogue legendary's rule is its status's text; its own text says the same in other words (the Hourglass read twice).
  const fx = [g.tier === "powerful" && !(g.statuses ?? []).some((id) => id.startsWith("lg_")) ? g.text : "", ...(g.statuses ?? []).map((id) => c.statuses.get(id)?.text)].filter(Boolean).join(" ");
  return `${g.name} (${kind}${g.stats?.length ? `; ${codes(g.stats)}` : ""}${fx ? `; ${fx}` : ""})`;
}
const itemWords = (it: Item) => `${it.uid}: ${it.rarity} ${gearWords(c.gear.get(it.uid) ?? itemGear(c, it))}`;
function offerWords(run: RogueRun, o: Offer): string {
  if (o.kind === "gear") {
    const g = c.gear.get(o.item.uid) ?? itemGear(c, o.item);
    const fits = run.roster.filter((m) => c.classes.get(m.cls)!.weapons.includes(g.weapon?.kind ?? "") || (g.slot === "armor" && ["light", "medium", "heavy"].indexOf(g.weight!) <= ["light", "medium", "heavy"].indexOf(c.classes.get(m.cls)!.armor)) || g.slot === "amulet").map((m) => m.cls);
    const aims = o.item.rarity === "legendary" ? rogue(c).aims?.[o.item.base] : undefined;
    return `gear: ${o.item.rarity} ${gearWords(g)}.${aims ? ` For: ${aims.join(", ")}.` : ""} Fits: ${fits.join(", ") || "nobody in the roster yet"}.`;
  }
  if (o.kind === "tome") return `tome: the ${c.classes.get(o.cls)!.name} learns ${c.abilities.get(o.ability)!.name} (${c.abilities.get(o.ability)!.text})`;
  if (o.kind === "recruit") return `recruit: the ${c.classes.get(o.cls)!.name} (${c.classes.get(o.cls)!.text.split(".")[0]}); joins knowing ${(o.known ?? []).map((a) => c.abilities.get(a)!.name).join(", ")}${o.item ? `, carrying ${itemWords(o.item)}` : ""}${run.party.length >= 3 ? "; waits at camp until you swap it in" : ""}`;
  if (o.kind === "formation") {
    const f = c.formations.get(o.id)!;
    return `formation (${formationRarity(c, o.id)}): ${f.name}: ${f.text}${f.positions.map((p, k) => ` Slot ${k + 1} ${p.name}: ${codes(p.stats) || "no change"}.`).join("")}`;
  }
  if (o.kind === "seat") return `a seat at camp: room for one more in the roster (now ${seatsOf(c, run)} at camp)`;
  const sp = rogue(c).config.supplies;
  return `supply: ${o.id} (${o.id === "potion" ? `one member regains ${sp.potion.hp}% of its HP` : o.id === "tonic" ? `one member regains ${sp.tonic.mp}% of its MP` : "a fallen member stands up with half its HP"})`;
}
function vit(run: RogueRun, cls: string): string {
  const m = member(run, cls);
  const hp = maxOf(c, run, cls, "max_hp"), mp = maxOf(c, run, cls, "max_mp");
  return m.ko ? `KNOCKED OUT (max HP ${hp})` : `HP ${Math.max(1, hp - m.missHp)}/${hp}, MP ${Math.max(0, mp - m.missMp)}/${mp}`;
}
const KIND_WORD: Record<string, string> = { fight: "fight", elite: "ELITE (hard fight; pays a legendary piece outright and a better pick)", event: "event (?)", campfire: "campfire", shop: "shop", treasure: "chest", boss: "BOSS" };

function header(run: RogueRun): string[] {
  const reg = rogue(c).regions.find((r) => r.id === run.region)!;
  return [
    `Act ${ROMAN[run.act]} of 3: ${reg.name}. ${reg.text} Boss at the top: ${run.boss.name}. ${run.floor > rogue(c).config.map.floors ? "At the boss." : run.floor === 0 ? `At the foot of the map: ${rogue(c).config.map.floors} floors, then the boss.` : `Floor ${run.floor} of ${rogue(c).config.map.floors}, the boss above.`}`,
    `Gold ${run.gold}. Supplies: ${run.supplies.join(", ") || "none"} (the bag holds ${rogue(c).config.bag.potion} potions, ${rogue(c).config.bag.tonic} tonics and ${rogue(c).config.bag.phoenix} phoenix feathers). Formation: ${c.formations.get(run.formation)!.name}. Formations owned: ${run.formations.join(", ")}.`,
    `Party: ${run.party.map((cls) => `${cls} (${vit(run, cls)})`).join("; ")}.${bench(run).length ? ` At camp: ${bench(run).map((cls) => `${cls} (${vit(run, cls)})`).join("; ")}.` : ""}`,
    `Roster: ${run.roster.length} of ${rogue(c).config.party + seatsOf(c, run)} (${seatsOf(c, run)} seats at camp). Swap anyone in or out any time outside a fight (swap <out> <in>); those at camp regain ${rogue(c).config.benchMp ?? 0}% of their MP after each won fight they sit out; nobody regains MP in a fight unless gear or a skill gives it.`,
    ...(run.pending.kind !== "over" && run.party.length < rogue(c).config.party && bench(run).some((x) => !member(run, x).ko) ? [`A seat is empty: someone standing at camp can fill it now (swap <at camp>).`] : []),
  ];
}

function look(run: RogueRun): string {
  const out = header(run);
  const p = run.pending;
  out.push("");
  switch (p.kind) {
    case "draft":
      out.push(`DRAFT: pick a companion (${rogue(c).config.start.picks - p.left + 1} of ${rogue(c).config.start.picks}). Each joins knowing one ability and learns the rest along the way.`);
      for (const id of p.offers) {
        const k = c.classes.get(id)!;
        out.push(`  pick ${id}: ${k.name}. ${k.text} Starts with ${(p.known?.[id] ?? []).map((a) => c.abilities.get(a)!.name).join(", ")}. (See: class ${id})`);
      }
      break;
    case "map": {
      out.push("MAP: choose the next room (pick <id>). Rooms you can reach, and where each leads:");
      for (const n of reachable(run)) out.push(`  pick ${n.id}: ${KIND_WORD[n.kind]} on floor ${n.floor}${n.next.length ? `, then ${n.next.map((id) => { const x = run.map.find((y) => y.id === id)!; return `${x.id} ${x.kind}`; }).join(" or ")}` : ""}`);
      out.push("  (map: the whole act; boss: what waits at the top)");
      break;
    }
    case "fight":
      out.push(`FIGHT: ${p.fight.name} (${p.tier}). Foes: ${counts(p.fight.enemies)}.`);
      for (const e of [...new Set(p.fight.enemies)]) out.push(`  ${bestiary(e, p.foes.power ?? 0)}`);
      out.push(p.begun ? "The fight has begun: pick fight to play it." : "You can still change gear, the formation, seats and ability order, and use supplies. Then: pick fight");
      break;
    case "drop":
      out.push(`FOUND SUPPLIES: take one (pick potion or pick tonic). A potion gives one member ${rogue(c).config.supplies.potion.hp}% HP, a tonic gives one member ${rogue(c).config.supplies.tonic.mp}% MP; you hold ${run.supplies.filter((x) => x === "potion").length}/${rogue(c).config.bag.potion} potions and ${run.supplies.filter((x) => x === "tonic").length}/${rogue(c).config.bag.tonic} tonics.`);
      break;
    case "muster": case "drill": {
      out.push(p.kind === "muster" ? "MUSTER: pick a recruit, or none (a full roster can send someone home first: dismiss <cls>)." : "DRILL GROUND: pick a formation, or train two members instead, or none.");
      p.offers.forEach((o, i) => out.push(`  pick take:${i}: ${offerWords(run, o)}`));
      if (options(c, run).includes("train")) out.push("  pick train: two members each learn an ability or make one better.");
      out.push("  pick skip");
      break;
    }
    case "train": {
      out.push(`TRAINING (${p.left} more): each member once; learn an ability or make one better (+).`);
      for (const o of trainOptions(c, run, p.done)) {
        const [verb, cls, ab] = o.split(":");
        out.push(`  pick ${o}: ${verb === "learn" ? `the ${c.classes.get(cls)!.name} learns ${c.abilities.get(ab)!.name}: ${c.abilities.get(ab)!.text}` : upText(ab, run, cls)}`);
      }
      out.push("  pick done");
      break;
    }
    case "spoils": case "boon": case "treasure": {
      const offers = p.kind === "treasure" ? [p.offer] : p.offers;
      out.push(p.kind === "boon" ? "BOSS BEATEN: pick a boon (the next act starts with everyone restored, and everyone learns an ability)." : p.kind === "treasure" ? `CHEST: ${p.gold} gold inside, and a piece.` : `SPOILS: ${p.gold} gold found. Pick one, or skip.`);
      if (p.kind === "spoils" && p.trophy) out.push(`  Trophy (already in your bag): ${itemWords(p.trophy)}${rogue(c).aims?.[p.trophy.base] ? ` For: ${rogue(c).aims![p.trophy.base].join(", ")}.` : ""}`);
      offers.forEach((o, i) => out.push(`  pick ${p.kind === "treasure" ? "take" : `take:${i}`}: ${offerWords(run, o)}`));
      out.push(`  pick ${p.kind === "treasure" ? "leave" : "skip"}`);
      break;
    }
    case "shop": {
      const step = rogue(c).config.prices.trainStep;
      out.push(`SHOP (you have ${run.gold} gold). Buy, train${step ? ` (as often as you like: each training bought here makes the next ${step}g dearer)` : " (once each a visit)"}, sell from the bag, or leave.`);
      p.stock.forEach((s, i) => out.push(`  ${s.sold ? "(bought) " : s.offer.kind === "supply" && !bagRoom(c, run, s.offer.id) ? "(bag full) " : `pick buy:${i} `}for ${s.price}g: ${offerWords(run, s.offer)}`));
      // Training too dear right now stays listed, marked (unaffordable gear stays listed too).
      const lp = trainPrice(c, p, "learn"), up = trainPrice(c, p, "upgrade");
      if (p.learn) for (const o of learnOptions(c, run)) out.push(`  ${run.gold >= lp ? `pick learn:${o}` : "(not enough gold) learn:" + o} for ${lp}g: ${c.abilities.get(o.split(":")[1])!.name}: ${c.abilities.get(o.split(":")[1])!.text}`);
      if (p.upgrade) for (const o of upgradeOptions(run)) out.push(`  ${run.gold >= up ? `pick upgrade:${o}` : "(not enough gold) upgrade:" + o} for ${up}g: ${upText(o.split(":")[1], run, o.split(":")[0])}`);
      for (const it of run.items.filter((x) => !wearer(run, x.uid))) out.push(`  pick sell:${it.uid} for ${sellPrice(c, it)}g: ${itemWords(it)}`);
      out.push("  pick leave");
      break;
    }
    case "campfire": {
      const k = rogue(c).config.campfire;
      if (p.used) {
        out.push(`CAMPFIRE: the pick is made. Swap who's in the party now if you like (swap <out> <in>), then: pick leave`);
        break;
      }
      out.push(`CAMPFIRE: one pick. Whatever you pick, those who were standing at camp when you arrived get ${k.camp ?? 100}% of a REST (a fallen one needs a RAISE or a phoenix).`);
      if (p.stranger) out.push(`  A stranger at the fire asks to join (pick recruit; it doesn't use the pick): ${offerWords(run, p.stranger)}`);
      out.push(`  Before the boss: ${bossWords(run)}`);
      out.push(`  pick rest: the party regains ${k.hp}% of its max HP (the max each had as the last fight ended).`, `  pick focus: the party regains ${k.mp}% of its max MP (likewise).`);
      for (const o of options(c, run)) {
        if (o.startsWith("raise:")) out.push(`  pick ${o}: stands up with ${k.revive}% of its HP.`);
        else if (o === "train") out.push(`  pick train: ${k.train ?? 1} members each learn an ability or make one better (+).`);
      }
      break;
    }
    case "event": {
      const ev = eventView(c, p);
      out.push(`EVENT: ${ev.name}. ${ev.text}`);
      const opts = options(c, run);
      for (const o of ev.options) out.push(`  ${opts.includes(o.id) ? `pick ${o.id}` : `(not now: ${whyNot(c, run, o) || "can't happen now"}) ${o.id}`}: ${o.label}${o.gold ? ` (${o.gold}g)` : ""}. ${o.text}`);
      if (opts.includes("walk_on")) out.push("  pick walk_on: nothing here you can use now.");
      break;
    }
    case "choose":
      out.push(`CHOOSE (${p.what}):`);
      for (const o of options(c, run)) out.push(`  pick ${o}${p.what === "temper" ? `: ${itemWords(itemOf(run, o)!)}` : `: ${c.abilities.get(o.split(":")[1])!.text}`}`);
      break;
    case "levelup": {
      const m = member(run, p.queue[0]);
      out.push(`LEVEL UP: the ${c.classes.get(m.cls)!.name} learns a new ability, or makes a known one better (+):`);
      for (const a of options(c, run)) out.push(`  pick ${a}: ${a === "gold" ? `${rogue(c).config.levelGold} gold instead` : unlearned(c, m).includes(a) ? `learn ${c.abilities.get(a)!.name}: ${c.abilities.get(a)!.text}` : upText(a, run, m.cls)}`);
      break;
    }
    case "region":
      out.push("THE ROAD FORKS: pick the next act's region.");
      for (const id of p.options) {
        const r = rogue(c).regions.find((x) => x.id === id)!;
        const boss = actRoll(c, run, id, run.act + 1).boss;
        const power = bossFoes(c, run, { act: run.act + 1, region: id }).power ?? 0;
        out.push(`  pick ${id}: ${r.name}. ${r.text} Its boss: ${boss.name}: ${[...new Set(boss.enemies)].map((e) => bestiary(e, power)).join(" ")}`);
      }
      break;
    case "over":
      out.push(p.won ? "THE RUN IS WON." : `THE RUN IS OVER: lost in act ${ROMAN[run.act]}, floor ${run.floor}.`);
      out.push(...run.notes.map((n) => `  ${ROMAN[n.act]}.${n.floor} ${n.text}`));
      break;
  }
  if (canManage(run)) out.push("", "Between rooms you can change gear (equip), the formation, seats and ability order, and use supplies.");
  return out.join("\n");
}
/** An enemy as the bestiary describes it: what it does, its abilities, its resistances. Never its stats. */
/** Who a foe's move aims at, from the party's side. */
function atWords(ab: AbilityT): string {
  const t = ab.target;
  if (!t || t === "foe") return `one of the party, by aggro${ab.seek ? ", past Taunt" : " (Taunt draws it)"}`;
  if (t === "self") return "itself";
  if (t === "ally") return "one of its allies";
  const who = t.side === "foes" ? "party member" : t.side === "self" ? "itself" : "ally of its own";
  const cond = t.where && "lacks" in t.where ? ` without ${c.statuses.get(String(t.where.lacks))?.name ?? t.where.lacks}` : t.where && "has" in t.where ? ` with ${c.statuses.get(String(t.where.has))?.name ?? t.where.has}` : "";
  if (t.pick === "all") return t.side === "foes" ? `the whole party${cond}` : `all its side${cond}`;
  if (t.pick === "lowest" || t.pick === "highest") return `the ${who} with the ${t.pick} ${typeof t.by === "string" ? t.by.replace("hp_share", "share of HP").replace("hp", "HP") : "value"}${cond}`;
  return `a ${who}${cond}${t.side === "foes" ? ", by aggro" : ""}`;
}
function bestiary(id: string, power = 0): string {
  const en = c.enemies.get(id)!;
  // An ability's size from the foe's stats and this fight's knob, before Armor and resistances.
  const acts = (en.abilities ?? []).map((a) => { const ab = c.abilities.get(a)!; const sz = sizeOf(ab, en.stats as Record<string, number>, 1 + power / 100); return `${ab.name} (${ab.text} Aims at ${atWords(ab)}.${sz ? ` ${sz}${/about/.test(sz) ? ", before Armor, crits and statuses" : ""}.` : ""})`; });
  const pas = (en.statuses ?? []).map((st) => `${c.statuses.get(st)!.name}: ${c.statuses.get(st)!.text ?? ""}`);
  const res = Object.entries(en.stats).filter(([k]) => k.startsWith("resist:")).map(([k, v]) => `${v > 100 ? "absorbs" : v > 0 ? "resists" : "weak to"} ${k.slice(7)}`);
  const kind = en.weapon?.element ?? (en.weapon?.kind ? c.weaponKinds.get(en.weapon.kind)?.element ?? "physical" : en.weapon?.type ?? "physical");
  return `${en.name}${en.rank !== "minion" ? ` (${en.rank})` : ""}: ${en.text} Attacks: ${kind}.${acts.length ? ` Abilities: ${acts.join("; ")}.` : ""}${pas.length ? ` ${pas.join(" ")}` : ""}${res.length ? ` ${res.join(", ")}.` : ""}`;
}
/** What an upgrade does to one ability, in numbers. */
function upText(id: string, run?: RogueRun, cls?: string): string {
  const a = c.abilities.get(id)!, up = upgraded(c, id);
  if (up.cooldown !== a.cooldown) return `${up.name}: every ${Math.round(up.cooldown)} ticks instead of ${Math.round(a.cooldown)}.`;
  const st = run && cls ? statsOf(run, cls) : null;
  const was = st ? sizeOf(a, st) : "", now = st ? sizeOf(up, st) : "";
  return `${up.name}: 40% more of what it deals, heals, shields or stacks${was && now && was !== now ? ` (${was} becomes ${now})` : ""}.`;
}
const counts = (enemies: string[]) => {
  const m = new Map<string, number>();
  for (const e of enemies) m.set(e, (m.get(e) ?? 0) + 1);
  return [...m].map(([e, n]) => `${c.enemies.get(e)!.name}${n > 1 ? ` x${n}` : ""}`).join(", ");
};

/** A roster member as it would fight: its stats with gear, and its seat's if it's in the party. */
function fighterOf(run: RogueRun, cls: string): EngineMember {
  const f = c.formations.get(run.formation)!;
  const m = member(run, cls);
  const seatNo = run.party.indexOf(cls);
  return (rules.party(c, { dungeon: "rogue_fight", party: seatNo >= 0 ? { formation: run.formation, units: run.party.map((x, i) => ({ class: x, position: f.positions[i].id, abilities: [...member(run, x).order], gear: Object.fromEntries(Object.entries(member(run, x).gear)) as Record<string, string> })) } : { formation: "neutral", units: [{ class: cls, position: "a", abilities: [...m.order], gear: Object.fromEntries(Object.entries(m.gear)) as Record<string, string> }] }, seed: 1 }) as EngineMember[]).find((x) => x.ref === cls)!;
}
const statsOf = (run: RogueRun, cls: string) => fighterOf(run, cls).stats as Record<string, number>;
/** The act's boss and what it does, so the last campfire's swap can answer it. */
const bossWords = (run: RogueRun) => `${run.boss.name}: ${[...new Set(run.boss.enemies)].map((e) => bestiary(e, bossFoes(c, run).power ?? 0)).join(" ")}`;
/** Max HP and MP that a change of gear, seat or formation moved (current HP and MP stay, capped at the new max). */
function moved(before: Map<string, string>, run: RogueRun): string {
  const lines = run.roster.filter((m) => before.get(m.cls) !== vit(run, m.cls)).map((m) => `  ${m.cls}: ${before.get(m.cls)} -> ${vit(run, m.cls)}`);
  return lines.length ? `\nmax HP and MP changed; current HP and MP stay as they were (capped at the new max):\n${lines.join("\n")}` : "";
}
const vits = (run: RogueRun) => new Map(run.roster.map((m) => [m.cls, vit(run, m.cls)]));

function partyWords(run: RogueRun): string {
  const out: string[] = [];
  const f = c.formations.get(run.formation)!;
  for (const m of run.roster) {
    const k = c.classes.get(m.cls)!;
    const seatNo = run.party.indexOf(m.cls);
    const s = fighterOf(run, m.cls).stats;
    out.push(`${m.cls} (${k.name})${seatNo >= 0 ? `, slot ${seatNo + 1} ${f.positions[seatNo].name}` : ", at camp"}: ${vit(run, m.cls)}. Attack ${pts(s.attack)}, Magic ${pts(s.magic)}, Armor ${pts(s.armor)}, Crit ${s.crit_chance}%, Aggro ${Math.round(s.aggro)}, MP regen ${pts(s.mp_regen)}.`);
    for (const slot of ["weapon", "armor", "amulet"] as Slot[]) out.push(`  ${slot}: ${m.gear[slot] ? itemWords(itemOf(run, m.gear[slot]!)!) : "nothing"}`);
    const left = m.known.filter((a) => !m.order.includes(a));
    out.push(`  abilities, in slot order: ${m.order.map((a, i) => `${a} (${c.abilities.get(a)!.name}, MP ${c.abilities.get(a)!.mp ?? 0}, every ${Math.round(c.abilities.get(a)!.cooldown)} ticks, first ready about t${Math.max(0, Math.round(c.abilities.get(a)!.cooldown - headStart(c.pack.ruleset.opening, c.abilities.get(a)!.cooldown, i)))}${sizeOf(c.abilities.get(a)!, s) ? `; ${sizeOf(c.abilities.get(a)!, s)}` : ""})`).join("; ") || "none"}${left.length ? `. Left out of fights: ${left.join(", ")}` : ""}${unlearned(c, m).length ? `. Not learned yet: ${unlearned(c, m).join(", ")}` : ""}.`);
    out.push(`  can use: ${k.weapons.join(", ")}; ${k.armor} armor or lighter.`);
  }
  out.push("", "Formations owned:", ...run.formations.map((id) => { const fm = c.formations.get(id)!; return `  ${id}${id === run.formation ? " (in use)" : ""}: ${fm.text}${fm.positions.map((p, k) => ` Slot ${k + 1} ${p.name}: ${codes(p.stats) || "no change"}.`).join("")}`; }));
  const bagItems = run.items.filter((it) => !wearer(run, it.uid));
  out.push("", `Bag: ${bagItems.length ? "" : "empty"}`, ...bagItems.map((it) => `  ${itemWords(it)}`));
  return out.join("\n");
}

function classWords(id: string): string {
  const k = c.classes.get(id);
  if (!k) throw new Error(`no class '${id}'`);
  const st = k.stats;
  return [
    `${k.name}: ${k.text}`,
    `Stats: HP ${st.max_hp}, MP ${st.max_mp ?? 0}, Attack ${pts(st.attack ?? 0)}, Magic ${pts(st.magic ?? 0)}, Armor ${pts(st.armor ?? 0)}, Crit ${st.crit_chance ?? 0}%, Aggro ${Math.round(st.aggro ?? 0)}.`,
    `Weapons: ${k.weapons.join(", ")}. Heaviest armor: ${k.armor}. Passive: ${k.passive?.name ?? "Einherjar"}: ${(k.passive?.text ?? "allies it revives come back with every action ready").replace(/\.$/, "")}.`,
    ...k.abilities.map((a) => { const ab = c.abilities.get(a)!; return `  ${a}: ${ab.name}, MP ${ab.mp ?? 0}, every ${Math.round(ab.cooldown)} ticks: ${ab.text}`; }),
  ].join("\n");
}

function mapWords(run: RogueRun): string {
  const out = [`Act ${ROMAN[run.act]} map, top (boss) to bottom (floor 1). [x] visited, (*) reachable now.`];
  for (let fl = rogue(c).config.map.floors + 1; fl >= 1; fl--) {
    const row = run.map.filter((n) => n.floor === fl).sort((a, b) => a.col - b.col);
    out.push(`Floor ${fl}: ${row.map((n) => `${n.id} ${n.kind}${run.visited.includes(n.id) ? " [x]" : ""}${reachable(run).some((x) => x.id === n.id) ? " (*)" : ""}${n.next.length ? ` -> ${n.next.join("/")}` : ""}`).join(" | ")}`);
  }
  return out.join("\n");
}

// ─── Commands ───────────────────────────────────────────────────────────────

function fightNow(run: RogueRun): string {
  const er = startFight(c, run, { log: true });
  advance(c, combat, er);
  const before = run.notes.length;
  endFight(c, run, er);
  // Each fight is its own engine run, so the summary always says "Fight 1": it says the floor instead.
  const told = summary((er.log as Entry[]).filter((e) => e.vis === "player" || e.t === "mp"), (src) => c.abilities.get(src)?.name ?? c.statuses.get(src)?.name.toLowerCase() ?? (src === "basic" ? "attack" : src)).replace(/^\nFight 1/, `\nAct ${ROMAN[run.act]}, floor ${run.floor}`);
  return `${told}${run.notes.length > before ? `\n${run.notes.slice(before).map((n) => `  ${n.text}`).join("\n")}` : ""}`;
}

const USAGE = [
  "new <knight|cleric|ranger> --seed N --save file     start a run",
  "look                      where the run stands, and what it's waiting on",
  "pick <option>             answer it (a room, an offer, fight, ...)",
  "map | boss | party | glossary | class <id>",
  "equip <class> <weapon|armor|amulet> <item id|none>",
  "formation <id>",
  "seat <a,b,c>              the party's seat order, commas, no spaces",
  "order <class> <ability,ability,...|none>   slot order; abilities left out aren't brought to fights",
  "use <potion|tonic|phoenix> [class]   (a potion or tonic goes to the member named, else the neediest)",
  "swap <party member> <member at camp>   any time outside a fight",
  "swap <member at camp>     fills an empty seat; swap <party member> steps it back",
  "dismiss <class at camp>   sends it home for good (never the leader), to make room for a recruit",
  "drop <item id>            drops a piece nobody wears from the bag",
  "Every command takes --save <file>.",
].join("\n");
function main() {
if (!cmd || cmd === "help") return void console.log(USAGE);
if (cmd === "new") {
  const leader = rest[0];
  if (!["knight", "cleric", "ranger"].includes(leader)) throw new Error("leaders: knight, cleric, ranger");
  const run = newRogue(c, { seed: Number(opt("--seed") ?? Math.floor(Math.random() * 1e6)), leader });
  save(run);
  console.log(look(run));
} else {
  const run = load();
  let out = "";
  switch (cmd) {
    case "look": out = look(run); break;
    case "map": out = mapWords(run); break;
    case "party": out = partyWords(run); break;
    case "class": out = classWords(rest[0]); break;
    case "glossary": out = ["STATUSES (icons in a fight):", ...c.pack.statuses.filter((s) => s.show === "icon").map((s) => `  ${s.name}: ${s.text ?? ""}`), "", "STATS (on classes, gear, affixes and seats):", ...STAT_WORDS.map(([k, v]) => `  ${k}: ${v}`)].join("\n"); break;
    case "pick": {
      if (run.pending.kind === "fight") {
        if (rest[0] !== "fight") throw new Error("a fight is waiting: pick fight");
        out = fightNow(run);
        out += `\n\n${look(run)}`;
      } else {
        const before = run.notes.length;
        choose(c, run, rest[0]);
        const news = run.notes.slice(before).map((n) => `  ${n.text}`);
        out = `${news.length ? `${news.join("\n")}\n\n` : ""}${look(run)}`;
      }
      break;
    }
    case "equip": {
      if (!canManage(run)) throw new Error("not now");
      const before = vits(run);
      const ok = equip(c, run, rest[0], rest[1] as Slot, rest[2] === "none" ? null : rest[2]);
      out = ok ? `Done.${moved(before, run)}\n${partyWords(run)}` : "That doesn't fit (class, slot or weight), or a weapon can't be left empty. Syntax: equip <class> <weapon|armor|amulet> <item id|none>.";
      break;
    }
    case "formation": { const before = vits(run); out = canManage(run) && setFormation(c, run, rest[0]) ? `Formation: ${rest[0]}.${moved(before, run)}` : "Not owned, or not now."; break; }
    case "seat": { const before = vits(run); out = canManage(run) && rest[0] && seat(c, run, rest[0].split(",")) ? `Seats: ${run.party.join(", ")}.${moved(before, run)}` : "Name the same party members, in the new order, with commas: seat <a,b,c>."; break; }
    case "order": {
      // Base ids find their upgrades (sanctuary finds sanctuary_plus); "none" brings no ability at all. Names separated by
      // spaces were read as one list and left the rest out silently (a playtester): commas only.
      if (rest.length > 2) { out = "Use commas, no spaces: order <class> <ability,ability,...> (or none)."; break; }
      const m = member(run, rest[0]);
      const ids = !m || rest[1] === "none" ? [] : (rest[1] ?? "").split(",").filter(Boolean).map((a) => (m.known.includes(a) ? a : m.known.includes(`${a}_plus`) ? `${a}_plus` : a));
      out = canManage(run) && setOrder(run, rest[0], ids) ? `Order: ${ids.join(", ") || "none"}.${m && m.known.some((a) => !ids.includes(a)) ? ` Left out of fights: ${m.known.filter((a) => !ids.includes(a)).join(", ")}.` : ""}` : "Name known abilities once each, in slot order (ids from party); any left out aren't brought to fights.";
      break;
    }
    case "use": out = useSupply(c, run, rest[0] as "potion", rest[1]) ? `Used the ${rest[0]}.\n${header(run).join("\n")}` : "Can't use that now."; break;
    case "swap": out = swap(c, run, rest[0], rest[1] ?? null) ? `Party: ${run.party.join(", ")}. At camp: ${bench(run).join(", ") || "nobody"}.` : "Any time outside a fight: swap <party member> <member at camp>, swap <party member> (steps back), or swap <member at camp> (into an empty seat)."; break;
    case "dismiss": out = dismiss(c, run, rest[0]) ? `The ${rest[0]} goes home. Roster: ${run.roster.map((m) => m.cls).join(", ")}.` : "Only someone at camp, never the leader, outside a fight: dismiss <class>."; break;
    case "drop": out = discard(run, rest[0]) ? `Dropped ${rest[0]}.` : "Only a piece nobody wears, outside a fight: drop <item id>."; break;
    case "boss": out = bossWords(run); break;
    default: throw new Error(`unknown command '${cmd}'. Commands:\n${USAGE}`);
  }
  save(run);
  console.log(out);
}
}

try { main(); } catch (e) { console.log(`Error: ${(e as Error).message}`); process.exitCode = 1; }
