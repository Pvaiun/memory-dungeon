/**
 * The rogue mode from the command line, for an AI playtester: what a player would see at each step of a run, and the
 * player's moves. The run is saved to a file between commands. Enemy stats stay hidden; a fight is told as a short
 * summary of what a player would have watched.
 *
 *   npx tsx src/rogue-play.ts new <leader> [--seed N] [--save file]      start a run (leaders: knight, cleric, ranger)
 *   npx tsx src/rogue-play.ts look                                       where the run stands, and what it's waiting on
 *   npx tsx src/rogue-play.ts pick <option>                              answer it (a room, an offer, "fight", ...)
 *   npx tsx src/rogue-play.ts map                                        the act's whole map
 *   npx tsx src/rogue-play.ts party                                      the roster: stats, gear, abilities, the bag
 *   npx tsx src/rogue-play.ts class <id>                                 a class's sheet: passive, every ability
 *   npx tsx src/rogue-play.ts equip <class> <weapon|armor|amulet> <item|none>
 *   npx tsx src/rogue-play.ts formation <id>     seat <a,b,c>     order <class> <ability,ability,...>
 *   npx tsx src/rogue-play.ts use <tonic|ether|phoenix> [class]   swap <party member> <member at camp>   (swap: campfire only)
 *   npx tsx src/rogue-play.ts glossary                                   what each status shown in a fight does
 *
 * --save picks the file (default out/rogue-play/run.json); every command takes it.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { advance, loadContent, type Content } from "./engine/run.js";
import { combat } from "./engine/combat/rules.js";
import type { Entry } from "./engine/log.js";
import {
  bench, canManage, choose, endFight, equip, eventOf, itemGear, itemOf, joinKnown, maxOf, member, newRogue, options, reachable, registerGear, rogue,
  seat, sellPrice, setFormation, setOrder, startFight, swap, unlearned, upgraded, useSupply, wearer, type Item, type Offer, type RogueRun, type Slot,
} from "./rogue.js";
import { summary } from "./play-summary.js";
import { combat as rules, type Member as EngineMember } from "./engine/combat/rules.js";

const c = loadContent(JSON.parse(readFileSync("content/core-set.pack.json", "utf8")));
const argv = process.argv.slice(2);
const opt = (name: string) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
const SAVE = opt("--save") ?? "out/rogue-play/run.json";
const args = argv.filter((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--")));
const [cmd, ...rest] = args;

function load(): RogueRun {
  const run = JSON.parse(readFileSync(SAVE, "utf8")) as RogueRun;
  registerGear(c, run);
  return run;
}
function save(run: RogueRun) {
  mkdirSync(SAVE.split("/").slice(0, -1).join("/") || ".", { recursive: true });
  writeFileSync(SAVE, JSON.stringify(run));
}

// ─── Words ──────────────────────────────────────────────────────────────────

const ROMAN = ["", "I", "II", "III"];
const pts = (n: number) => Math.round(n / 100) / 10;
const statWord = (stat: string, v: number) => {
  const pct = /crit|evasion|accuracy|double|lifesteal|siphon|resist/.test(stat);
  return `${stat.replace("crit_multiplier", "crit_damage")} ${v > 0 ? "+" : ""}${pct ? `${v}%` : pts(v)}`;
};
const codes = (stats: { stat: string; flat?: number }[] = []) => stats.map((s) => statWord(s.stat, s.flat ?? 0)).join(", ");
function gearWords(g: ReturnType<typeof itemGear> | undefined): string {
  if (!g) return "nothing";
  const kind = g.weapon?.kind ? `${g.weapon.kind}` : g.weight ? `${g.weight} armor` : "amulet";
  const fx = [g.tier === "powerful" ? g.text : "", ...(g.statuses ?? []).map((id) => c.statuses.get(id)?.text)].filter(Boolean).join(" ");
  return `${g.name} (${kind}${g.stats?.length ? `; ${codes(g.stats)}` : ""}${fx ? `; ${fx}` : ""})`;
}
const itemWords = (it: Item) => `${it.uid}: ${it.rarity} ${gearWords(c.gear.get(it.uid) ?? itemGear(c, it))}`;
function offerWords(run: RogueRun, o: Offer): string {
  if (o.kind === "gear") {
    const g = c.gear.get(o.item.uid) ?? itemGear(c, o.item);
    const fits = run.roster.filter((m) => c.classes.get(m.cls)!.weapons.includes(g.weapon?.kind ?? "") || (g.slot === "armor" && ["light", "medium", "heavy"].indexOf(g.weight!) <= ["light", "medium", "heavy"].indexOf(c.classes.get(m.cls)!.armor)) || g.slot === "amulet").map((m) => m.cls);
    return `gear: ${o.item.rarity} ${gearWords(g)}. Fits: ${fits.join(", ") || "nobody in the roster yet"}.`;
  }
  if (o.kind === "tome") return `tome: the ${c.classes.get(o.cls)!.name} learns ${c.abilities.get(o.ability)!.name} (${c.abilities.get(o.ability)!.text})`;
  if (o.kind === "recruit") return `recruit: the ${c.classes.get(o.cls)!.name} (${c.classes.get(o.cls)!.text.split(".")[0]}); joins knowing ${joinKnown(c, o.cls, run.act).map((a) => c.abilities.get(a)!.name).join(", ")}${run.party.length >= 3 ? "; waits at camp until a campfire" : ""}`;
  if (o.kind === "formation") {
    const f = c.formations.get(o.id)!;
    return `formation: ${f.name}: ${f.text}${f.positions.map((p, k) => ` Slot ${k + 1} ${p.name}: ${codes(p.stats) || "no change"}.`).join("")}`;
  }
  return `supply: ${o.id} (${o.id === "tonic" ? "the party regains 30% of its HP" : o.id === "ether" ? "the party regains 50% of its MP" : "a fallen member stands up with half its HP"})`;
}
function vit(run: RogueRun, cls: string): string {
  const m = member(run, cls);
  const hp = maxOf(c, run, cls, "max_hp"), mp = maxOf(c, run, cls, "max_mp");
  return m.ko ? `KNOCKED OUT (max HP ${hp})` : `HP ${hp - m.missHp}/${hp}, MP ${mp - m.missMp}/${mp}`;
}
const KIND_WORD: Record<string, string> = { fight: "fight", elite: "ELITE (hard fight; pays a legendary piece outright and a better pick)", event: "event (?)", campfire: "campfire", shop: "shop", treasure: "chest", boss: "BOSS" };

function header(run: RogueRun): string[] {
  const reg = rogue(c).regions.find((r) => r.id === run.region)!;
  return [
    `Act ${ROMAN[run.act]} of 3: ${reg.name}. ${reg.text} Boss at the top: ${run.boss.name}. ${run.floor > rogue(c).config.map.floors ? "At the boss." : `Floor ${run.floor} of ${rogue(c).config.map.floors}, the boss above.`}`,
    `Gold ${run.gold}. Supplies: ${run.supplies.join(", ") || "none"} (bag holds ${rogue(c).config.bag}). Formation: ${c.formations.get(run.formation)!.name}. Formations owned: ${run.formations.join(", ")}.`,
    `Party: ${run.party.map((cls) => `${cls} (${vit(run, cls)})`).join("; ")}.${bench(run).length ? ` At camp: ${bench(run).map((cls) => `${cls} (${vit(run, cls)})`).join("; ")}.` : ""}`,
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
        out.push(`  pick ${id}: ${k.name}. ${k.text} Starts with ${c.abilities.get(rogue(c).config.firstAbility[id])!.name}. (See: class ${id})`);
      }
      break;
    case "map": {
      out.push("MAP: choose the next room (pick <id>). Rooms you can reach, and where each leads:");
      for (const n of reachable(run)) out.push(`  pick ${n.id}: ${KIND_WORD[n.kind]} on floor ${n.floor}${n.next.length ? `, then ${n.next.map((id) => { const x = run.map.find((y) => y.id === id)!; return `${x.id} ${x.kind}`; }).join(" or ")}` : ""}`);
      out.push("  (map: the whole act)");
      break;
    }
    case "fight":
      out.push(`FIGHT: ${p.fight.name} (${p.tier}). Foes: ${counts(p.fight.enemies)}.`);
      for (const e of [...new Set(p.fight.enemies)]) out.push(`  ${bestiary(e)}`);
      out.push(p.begun ? "The fight has begun: pick fight to play it." : "You can still change gear, the formation, seats and ability order, and use supplies. Then: pick fight");
      break;
    case "spoils": case "boon": case "treasure": {
      const offers = p.kind === "treasure" ? [p.offer] : p.offers;
      out.push(p.kind === "boon" ? "BOSS BEATEN: pick a boon (the next act starts with everyone restored, and everyone learns an ability)." : p.kind === "treasure" ? `CHEST: ${p.gold} gold inside, and a piece.` : `SPOILS: ${p.gold} gold found. Pick one, or skip.`);
      if (p.kind === "spoils" && p.trophy) out.push(`  Trophy (already in your bag): ${itemWords(p.trophy)}`);
      offers.forEach((o, i) => out.push(`  pick ${p.kind === "treasure" ? "take" : `take:${i}`}: ${offerWords(run, o)}`));
      out.push(`  pick ${p.kind === "treasure" ? "leave" : "skip"}`);
      break;
    }
    case "shop": {
      out.push(`SHOP (you have ${run.gold} gold). Buy, train (once each a visit), sell from the bag, or leave.`);
      p.stock.forEach((s, i) => out.push(`  ${s.sold ? "(bought) " : `pick buy:${i} `}for ${s.price}g: ${offerWords(run, s.offer)}`));
      if (p.learn) for (const o of options(c, run).filter((x) => x.startsWith("learn:"))) out.push(`  pick ${o} for ${rogue(c).config.prices.learn}g: ${c.abilities.get(o.split(":")[2])!.name}: ${c.abilities.get(o.split(":")[2])!.text}`);
      if (p.upgrade) for (const o of options(c, run).filter((x) => x.startsWith("upgrade:"))) out.push(`  pick ${o} for ${rogue(c).config.prices.upgrade}g: ${upText(o.split(":")[2])}`);
      for (const it of run.items.filter((x) => !wearer(run, x.uid))) out.push(`  pick sell:${it.uid} for ${sellPrice(c, it)}g: ${itemWords(it)}`);
      out.push("  pick leave");
      break;
    }
    case "campfire": {
      const k = rogue(c).config.campfire;
      out.push(`CAMPFIRE: one pick. Whatever you pick, those waiting at camp get both REST and FOCUS. Swapping who's in the party is free here (swap <out> <in>).`);
      out.push(`  pick rest: the party regains ${k.hp}% of its HP.`, `  pick focus: the party regains ${k.mp}% of its MP.`);
      for (const o of options(c, run)) {
        if (o.startsWith("raise:")) out.push(`  pick ${o}: stands up with ${k.revive}% of its HP.`);
        else if (o.startsWith("learn:")) out.push(`  pick ${o}: ${c.abilities.get(o.split(":")[2])!.text}`);
        else if (o.startsWith("upgrade:")) out.push(`  pick ${o}: ${upText(o.split(":")[2])}`);
      }
      break;
    }
    case "event": {
      const ev = eventOf(c, p.id);
      out.push(`EVENT: ${ev.name}. ${ev.text}`);
      const opts = options(c, run);
      for (const o of ev.options) out.push(`  ${opts.includes(o.id) ? `pick ${o.id}` : `(not now) ${o.id}`}: ${o.label}${o.gold ? ` (${o.gold}g)` : ""}. ${o.text}`);
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
      for (const a of options(c, run)) out.push(`  pick ${a}: ${unlearned(c, m).includes(a) ? `learn ${c.abilities.get(a)!.name}: ${c.abilities.get(a)!.text}` : upText(a)}`);
      break;
    }
    case "region":
      out.push("THE ROAD FORKS: pick the next act's region.");
      for (const id of p.options) { const r = rogue(c).regions.find((x) => x.id === id)!; out.push(`  pick ${id}: ${r.name}. ${r.text} Its boss is one of: ${r.bosses.map((b) => b.name).join(", ")}.`); }
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
function bestiary(id: string): string {
  const en = c.enemies.get(id)!;
  const acts = (en.abilities ?? []).map((a) => `${c.abilities.get(a)!.name} (${c.abilities.get(a)!.text})`);
  const pas = (en.statuses ?? []).map((st) => `${c.statuses.get(st)!.name}: ${c.statuses.get(st)!.text ?? ""}`);
  const res = Object.entries(en.stats).filter(([k]) => k.startsWith("resist:")).map(([k, v]) => `${v > 100 ? "absorbs" : v > 0 ? "resists" : "weak to"} ${k.slice(7)}`);
  const kind = en.weapon?.element ?? (en.weapon?.kind ? c.weaponKinds.get(en.weapon.kind)?.element ?? "physical" : en.weapon?.type ?? "physical");
  return `${en.name}${en.rank !== "minion" ? ` (${en.rank})` : ""}: ${en.text} Attacks: ${kind}.${acts.length ? ` Abilities: ${acts.join("; ")}.` : ""}${pas.length ? ` ${pas.join(" ")}` : ""}${res.length ? ` ${res.join(", ")}.` : ""}`;
}
/** What an upgrade does to one ability, in numbers. */
function upText(id: string): string {
  const a = c.abilities.get(id)!, up = upgraded(c, id);
  return up.cooldown !== a.cooldown ? `${up.name}: every ${Math.round(up.cooldown)} ticks instead of ${Math.round(a.cooldown)}.` : `${up.name}: 40% more of what it deals, heals, shields or stacks.`;
}
const counts = (enemies: string[]) => {
  const m = new Map<string, number>();
  for (const e of enemies) m.set(e, (m.get(e) ?? 0) + 1);
  return [...m].map(([e, n]) => `${c.enemies.get(e)!.name}${n > 1 ? ` x${n}` : ""}`).join(", ");
};

function partyWords(run: RogueRun): string {
  const out: string[] = [];
  const f = c.formations.get(run.formation)!;
  for (const m of run.roster) {
    const k = c.classes.get(m.cls)!;
    const seatNo = run.party.indexOf(m.cls);
    const fm = (rules.party(c, { dungeon: "rogue_fight", party: seatNo >= 0 ? { formation: run.formation, units: run.party.map((cls, i) => ({ class: cls, position: f.positions[i].id, abilities: [...member(run, cls).order], gear: Object.fromEntries(Object.entries(member(run, cls).gear)) as Record<string, string> })) } : { formation: "neutral", units: [{ class: m.cls, position: "a", abilities: [...m.order], gear: Object.fromEntries(Object.entries(m.gear)) as Record<string, string> }] }, seed: 1 }) as EngineMember[]).find((x) => x.ref === m.cls)!;
    const s = fm.stats;
    out.push(`${m.cls} (${k.name})${seatNo >= 0 ? `, slot ${seatNo + 1} ${f.positions[seatNo].name}` : ", at camp"}: ${vit(run, m.cls)}. Attack ${pts(s.attack)}, Magic ${pts(s.magic)}, Armor ${pts(s.armor)}, Crit ${s.crit_chance}%, Aggro ${pts(s.aggro)}, MP regen ${pts(s.mp_regen)}.`);
    for (const slot of ["weapon", "armor", "amulet"] as Slot[]) out.push(`  ${slot}: ${m.gear[slot] ? itemWords(itemOf(run, m.gear[slot]!)!) : "nothing"}`);
    const head = c.pack.ruleset.opening?.slots ?? [];
    out.push(`  abilities, in slot order: ${m.order.map((a, i) => `${a} (${c.abilities.get(a)!.name}, MP ${c.abilities.get(a)!.mp ?? 0}, every ${Math.round(c.abilities.get(a)!.cooldown)} ticks, first ready about t${Math.max(0, Math.round(c.abilities.get(a)!.cooldown - (head[i] ?? 0)))})`).join("; ")}${unlearned(c, m).length ? `. Not learned yet: ${unlearned(c, m).join(", ")}` : ""}.`);
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
    `Stats: HP ${pts(st.max_hp)}, MP ${pts(st.max_mp ?? 0)}, Attack ${pts(st.attack ?? 0)}, Magic ${pts(st.magic ?? 0)}, Armor ${pts(st.armor ?? 0)}, Crit ${st.crit_chance ?? 0}%, Aggro ${pts(st.aggro ?? 0)}.`,
    `Weapons: ${k.weapons.join(", ")}. Heaviest armor: ${k.armor}. Passive: ${k.passive?.name ?? "Einherjar"}: ${k.passive?.text ?? "allies it revives come back with every action ready"}.`,
    ...k.abilities.map((a) => { const ab = c.abilities.get(a)!; return `  ${a}${a === rogue(c).config.firstAbility[id] ? " (known on joining)" : ""}: ${ab.name}, MP ${ab.mp ?? 0}, every ${Math.round(ab.cooldown)} ticks: ${ab.text}`; }),
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
  endFight(c, run, er);
  const before = run.notes.length;
  const told = summary((er.log as Entry[]).filter((e) => e.vis === "player" || e.t === "mp"), (src) => c.abilities.get(src)?.name ?? c.statuses.get(src)?.name.toLowerCase() ?? (src === "basic" ? "attack" : src));
  return `${told}${run.notes.length > before ? `\n${run.notes.slice(before).map((n) => `  ${n.text}`).join("\n")}` : ""}`;
}

try { main(); } catch (e) { console.log(`Error: ${(e as Error).message}`); process.exitCode = 1; }
function main() {
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
    case "glossary": out = c.pack.statuses.filter((s) => s.show === "icon").map((s) => `${s.name}: ${s.text ?? ""}`).join("\n"); break;
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
      const ok = equip(c, run, rest[0], rest[1] as Slot, rest[2] === "none" ? null : rest[2]);
      out = ok ? `Done.\n${partyWords(run)}` : "That doesn't fit (class, slot or weight), or a weapon can't be left empty.";
      break;
    }
    case "formation": out = canManage(run) && setFormation(c, run, rest[0]) ? `Formation: ${rest[0]}.` : "Not owned, or not now."; break;
    case "seat": out = canManage(run) && seat(c, run, rest[0].split(",")) ? `Seats: ${run.party.join(", ")}.` : "Name the same party members, in the new order."; break;
    case "order": out = canManage(run) && setOrder(run, rest[0], rest[1].split(",")) ? `Order: ${rest[1]}.` : "Name every known ability once (use ids from party)."; break;
    case "use": out = useSupply(c, run, rest[0] as "tonic", rest[1]) ? `Used the ${rest[0]}.\n${header(run).join("\n")}` : "Can't use that now."; break;
    case "swap": out = swap(c, run, rest[0], rest[1] ?? null) ? `Party: ${run.party.join(", ")}. At camp: ${bench(run).join(", ") || "nobody"}.` : "Only at a campfire: a party member and someone at camp."; break;
    default: throw new Error("commands: new, look, pick, map, party, class, equip, formation, seat, order, use, swap, glossary");
  }
  save(run);
  console.log(out);
}
}
