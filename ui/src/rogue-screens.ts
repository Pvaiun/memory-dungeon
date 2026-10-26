/**
 * The rogue mode's screens. `rogue` shows whatever the run is waiting on: the leader and the draft, the map, the
 * spoils of a fight, a boss's boon, a chest, the shop, a campfire, an event, a level-up, the next region, the end.
 * `rparty`, `runit` and `rgear` manage the party between rooms (gear any time; the party itself only at a campfire).
 * Every choice goes to src/rogue.ts, is saved, and the screen redraws from the run.
 */
import {
  bench, canManage, choose, eventOf, equip, itemGear, itemOf, joinKnown, learnOptions, member, options, reachable,
  rogue, seat, sellPrice, setFormation, setOrder, swap, unlearned, upgraded, upgradeOptions, useSupply, wearer, type Item, type MapNode, type Offer, type RogueRun,
} from "../../src/rogue.js";
import { canEquip } from "../../src/validate.js";
import type { GearT, RogueNodeKindT } from "../../src/schema.js";
import { c, className, cls as classOf, disp, kindOf, shortName } from "./content.js";
import { button, bar, h, header, toast, win, type Child } from "./dom.js";
import { abilityBlock, basicLine, classHead, codeSpans, gearRow, passiveBlock, role, section, specialLines, statGrid } from "./sheet.js";
import { weaponOf } from "../../src/engine/combat/fight.js";
import { actorEl, enemyThumb, faceEl, iconEl } from "./pixel.js";
import { enemyDisplayName } from "./art.js";
import type { Cell } from "./art.js";
import { current, endRun, fighter, lastRun, meta, saveRogue, setHeat, startRun, vitals } from "./rogue-state.js";
import { setup } from "./state.js";
import { sfx } from "./battle/audio.js";

type Go = (s: string, arg?: unknown, keep?: boolean) => void;
let go: Go = () => {};
let frameEl: HTMLElement | null = null;
/** screens.ts hands over its navigation and frame. */
export function bindRogue(g: Go, frame: HTMLElement) {
  go = g;
  frameEl = frame;
}
const redraw = () => go("rogue", undefined, true);

// ─── Small parts ───────────────────────────────────────────────────────────

const ICON: Record<RogueNodeKindT, Cell> = { fight: [26, 7], elite: [10, 1], event: [10, 12], campfire: [13, 0], shop: [23, 11], treasure: [23, 15], boss: [18, 3] };
const KIND_NAME: Record<RogueNodeKindT, string> = { fight: "FIGHT", elite: "ELITE", event: "EVENT", campfire: "CAMPFIRE", shop: "SHOP", treasure: "CHEST", boss: "BOSS" };
const KIND_TEXT: Record<RogueNodeKindT, string> = {
  fight: "A fight. Pays gold and a pick of spoils.",
  elite: "A hard fight. Pays more gold, a legendary piece outright, and a better pick.",
  event: "Something on the road: a choice, for better or worse.",
  campfire: "Rest, focus, raise the fallen or train, and change who's in the party.",
  shop: "Gear, recruits, a formation, training and supplies, for gold.",
  treasure: "A chest: a rare or legendary piece, and some gold.",
  boss: "The act's boss. Beat it to move on, restored, and everyone learns.",
};
const SUPPLY_ICON: Record<string, Cell> = { tonic: [21, 7], ether: [20, 7], phoenix: [21, 14] };
const SUPPLY_TEXT: Record<string, string> = { tonic: "Tonic: the party regains 30% of its HP.", ether: "Ether: the party regains 50% of its MP.", phoenix: "Phoenix feather: a fallen member stands up with half its HP." };
const RARITY_CLASS: Record<string, string> = { common: "", uncommon: "good", rare: "buff", legendary: "gold" };
const ROMAN = ["", "I", "II", "III", "IV"];
const gold = (n: number) => h("span", { class: "gold" }, `${n}G`);

/** A run's item as a gear row, coloured by rarity, with who wears it. */
function itemRow(run: RogueRun, it: Item, onClick?: () => void, opts: { arrow?: boolean; stats?: Record<string, number> | null; right?: HTMLElement | null } = {}): HTMLElement {
  const g = c.gear.get(it.uid) ?? itemGear(c, it);
  const r = gearRow(g, g.slot, opts.stats ?? null, onClick, opts.arrow ?? false);
  const name = r.querySelector(".grow .line span");
  if (name) {
    name.className = `trunc ${RARITY_CLASS[it.rarity]}`;
    name.textContent = `${it.rarity === "legendary" ? "★" : ""}${g.name.toUpperCase()}`;
  }
  // The art glows by rarity: a recolour in place of new art.
  if (it.rarity !== "common") r.querySelector(".art")?.classList.add(`glow-${it.rarity}`);
  const who = wearer(run, it.uid);
  const right = opts.right ?? (who ? h("span", { class: "tag" }, shortName(who)) : null);
  if (right) r.querySelector(".grow .line")?.append(right);
  return r;
}
/** Who in the roster could wear a piece, or a nudge toward who could. */
function fitsLine(run: RogueRun, g: GearT, rarity?: string): HTMLElement {
  const tag = rarity && rarity !== "common" ? h("span", { class: RARITY_CLASS[rarity] }, `${rarity.toUpperCase()} · `) : null;
  const can = run.roster.filter((m) => canEquip(c.classes.get(m.cls)!, g)).map((m) => shortName(m.cls));
  if (can.length) return h("div", { class: "line small dim wrap" }, tag, `FITS ${can.join(", ")}`);
  const would = c.pack.classes.filter((k) => canEquip(k, g)).map((k) => shortName(k.id));
  return h("div", { class: "line small debuff wrap" }, tag, `NOBODY CAN USE IT YET · ${would.slice(0, 5).join(", ")}${would.length > 5 ? "…" : ""}`);
}
/** What a legendary piece's statuses do, in words. */
function effectLines(g: GearT): Child[] {
  const out: Child[] = g.tier === "powerful" ? [h("div", { class: "text small wrap gold" }, g.text)] : [];
  return [...out, ...(g.statuses ?? []).map((id) => c.statuses.get(id)).filter(Boolean).map((s) => h("div", { class: "text small wrap gold" }, s!.text ?? s!.name))];
}
/** What an upgrade does to one ability, in numbers. */
function upText(id: string): string {
  const a = c.abilities.get(id)!, up = upgraded(c, id);
  return up.cooldown !== a.cooldown ? `Every ${Math.round(up.cooldown)} ticks instead of ${Math.round(a.cooldown)}.` : "40% more of what it deals, heals, shields or stacks.";
}
/** An offer as a card's body. */
function offerBody(run: RogueRun, o: Offer): Child[] {
  if (o.kind === "gear") {
    const g = c.gear.get(o.item.uid) ?? itemGear(c, o.item);
    return [itemRow(run, o.item, undefined, { right: null }), ...effectLines(g), fitsLine(run, g, o.item.rarity)];
  }
  if (o.kind === "tome") {
    return [h("div", { class: "line" }, faceEl(o.cls), h("span", { class: "grow hi" }, `TOME: ${shortName(o.cls)} LEARNS`)), abilityBlock(c.abilities.get(o.ability)!, null, false)];
  }
  if (o.kind === "recruit") {
    const k = classOf(o.cls);
    const known = rogueKnows(run, o.cls);
    return [h("div", { class: "line" }, faceEl(o.cls), h("div", { class: "grow" }, h("div", { class: "hi" }, `RECRUIT: ${k.name.toUpperCase()}`), h("div", { class: "text dim small wrap" }, role(k.text)))), h("div", { class: "line small dim wrap" }, `KNOWS ${known.map((a) => c.abilities.get(a)!.name.toUpperCase()).join(", ")}`), run.party.length >= 3 ? h("div", { class: "line small dim" }, "WAITS AT CAMP UNTIL A CAMPFIRE") : null];
  }
  if (o.kind === "formation") {
    const f = c.formations.get(o.id)!;
    return [h("div", { class: "line hi" }, `FORMATION: ${f.name.toUpperCase()}`), h("div", { class: "text dim small wrap" }, f.text), ...f.positions.map((p) => h("div", { class: "line small" }, h("span", { class: "dim" }, p.name.toUpperCase()), " ", ...codeSpans(p.stats)))];
  }
  return [h("div", { class: "line" }, iconEl(SUPPLY_ICON[o.id]), h("span", { class: "grow" }, o.id.toUpperCase())), h("div", { class: "text dim small wrap" }, SUPPLY_TEXT[o.id])];
}
/** What a recruit would know on joining now. */
const rogueKnows = (run: RogueRun, cls: string) => joinKnown(c, cls, run.act);

/** The party at a glance: faces, HP and MP bars, KO; tap for the party screen. */
function partyStrip(run: RogueRun, tap = true): HTMLElement {
  const cells = run.party.map((cls) => {
    const v = vitals(run, cls);
    return h("div", { class: "rcell", onClick: tap ? () => go("rparty") : undefined },
      h("div", { class: `face${v.ko ? " ko" : ""}` }, faceEl(cls)),
      h("div", { class: "small trunc" }, shortName(cls)),
      v.ko ? h("div", { class: "bad small" }, "KO") : bar(v.hp / v.maxHp, "hp", 0, true),
      v.maxMp ? bar(v.mp / v.maxMp, "mp", 0, true) : null,
    );
  });
  const camp = bench(run);
  return win("rstrip", h("div", { class: "rcells" }, ...cells),
    h("div", { class: "line small" }, gold(run.gold), h("span", { class: "dim" }, ` · ${run.supplies.length}/${rogue(c).config.bag} SUPPLIES`), camp.length ? h("span", { class: "dim r" }, `CAMP: ${camp.map(shortName).join(", ")}`) : null));
}

function pickOrSave(run: RogueRun, pick: string) {
  const before = run.notes.length;
  choose(c, run, pick);
  saveRogue();
  sfx.tap();
  redraw();
  // What the pick did, said once (an event's gain was silent to a playtester).
  const news = run.notes.slice(before).map((n) => n.text).filter((t) => !/^(Took|Bought|Act )/.test(t));
  if (news.length && frameEl) toast(frameEl, news.join(" "), 2600);
}

/** A question over the screen, with a yes and a cancel. */
function confirm(title: string, text: string, yes: string, onYes: () => void) {
  if (!frameEl) return onYes();
  const box = h("div", { class: "overlay dialog" }, win("",
    h("div", { class: "line hi" }, title),
    h("div", { class: "text dim small wrap" }, text),
    h("div", { class: "btns", style: "margin-top:.75rem" }, button(yes, () => { box.remove(); onYes(); }, "hi"), button("CANCEL", () => box.remove())),
  ));
  frameEl.append(box);
}

// ─── The dispatcher ────────────────────────────────────────────────────────

export function rogueScreen(): Child[] {
  const run = current();
  if (!run) return startView();
  switch (run.pending.kind) {
    case "draft": return draftView(run);
    case "map": return mapView(run);
    case "fight": return fightView(run);
    case "spoils": case "boon": case "treasure": return rewardView(run);
    case "shop": return shopView(run);
    case "campfire": return campView(run);
    case "event": return eventView(run);
    case "choose": return chooseView(run);
    case "levelup": return levelView(run);
    case "region": return regionView(run);
    case "over": return overView(run);
  }
}

// ─── No run: the leader ────────────────────────────────────────────────────

let leaderPick: string | null = null;
function startView(): Child[] {
  const m = meta();
  const owned = m.owned;
  if (!leaderPick || !owned.includes(leaderPick)) leaderPick = owned[0];
  const last = lastRun();
  const k = classOf(leaderPick);
  const heatRow = m.maxHeat > 0 ? h("div", { class: "line" }, h("span", { class: "dim" }, "HEAT"), button("◀", () => { setHeat(m.heat - 1); redraw(); }, "sm"), h("span", { class: "hi" }, String(m.heat)), button("▶", () => { setHeat(m.heat + 1); redraw(); }, "sm"), h("span", { class: "dim small r text" }, m.heat ? `Foes +${m.heat * rogue(c).config.heat.per}%` : "As designed")) : null;
  return [
    header("ROGUE", () => go("home"), h("span", { class: "dim" }, `${m.wins}/${m.runs} WON`)),
    last ? win("", h("div", { class: `line ${last.won ? "good" : "bad"}` }, last.won ? "LAST RUN: WON" : "LAST RUN: LOST"), last.unlocked.length ? h("div", { class: "line small hi wrap" }, `NEW LEADERS: ${last.unlocked.map(shortName).join(", ")}`) : null) : null,
    win("", h("div", { class: "line hi" }, "CHOOSE YOUR LEADER"), h("div", { class: "text dim small wrap" }, "Two companions join you on the road. Win a run and its party can lead the next.")),
    win("roster", h("div", { class: "grid" }, ...owned.map((id) => h("div", { class: `cell${leaderPick === id ? " cur" : ""}`, onClick: () => { leaderPick = id; redraw(); } }, h("div", { class: "portrait" }, faceEl(id)), h("span", { class: "trunc", style: "max-width:100%" }, shortName(id)))),
      ...(owned.length < c.pack.classes.length ? [h("div", { class: "cell static dim" }, h("div", { class: "portrait locked" }, "?"), h("span", null, `${c.pack.classes.length - owned.length} MORE`))] : []))),
    win("", classHead(leaderPick), h("div", { class: "line small dim wrap" }, `STARTS WITH ${c.abilities.get(rogue(c).config.firstAbility[leaderPick])!.name.toUpperCase()}`), h("div", { class: "text dim small wrap" }, k.text)),
    heatRow,
    h("div", { class: "btns even" }, button("SET OUT", () => { startRun(leaderPick!, m.heat); sfx.win(); redraw(); }, "hi"), button("CLASSES", () => go("classes"))),
  ];
}

// ─── The draft ─────────────────────────────────────────────────────────────

let draftPick: string | null = null;
function draftView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "draft") return [];
  if (!draftPick || !p.offers.includes(draftPick)) draftPick = p.offers[0];
  const n = rogue(c).config.start.picks - p.left + 1;
  return [
    header(`COMPANION ${n}/${rogue(c).config.start.picks}`, () => go("home")),
    partyStrip(run, false),
    h("div", { class: "cards" }, ...p.offers.map((id) => h("div", { class: `win card${draftPick === id ? " cur" : ""}`, onClick: () => { draftPick = id; redraw(); } },
      h("div", { class: "portrait" }, faceEl(id)), h("div", { class: "name" }, shortName(id)), h("div", { class: "codes small" }, c.abilities.get(rogue(c).config.firstAbility[id])!.name)))),
    win("scroll", classHead(draftPick), h("div", { class: "text dim small wrap" }, classOf(draftPick).text), section("STARTS WITH"), abilityBlock(c.abilities.get(rogue(c).config.firstAbility[draftPick])!, null, setup.settings.designer),
      section("LEARNS LATER"), ...c.classes.get(draftPick)!.abilities.filter((a) => a !== rogue(c).config.firstAbility[draftPick!]).map((a) => abilityBlock(c.abilities.get(a)!, null, false)),
      section("PASSIVE"), ...(classOf(draftPick).passive ? passiveBlock(classOf(draftPick).passive!.name, classOf(draftPick).passive!.text) : passiveBlock("Einherjar", "Allies it revives come back with every action ready."))),
    h("div", { class: "btns even" }, button(`TAKE ${shortName(draftPick)}`, () => pickOrSave(run, draftPick!), "hi")),
  ];
}

// ─── The map ───────────────────────────────────────────────────────────────

let mapPick: string | null = null;
function mapView(run: RogueRun): Child[] {
  const reg = rogue(c).regions.find((r) => r.id === run.region)!;
  const next = reachable(run);
  if (mapPick && !next.some((n) => n.id === mapPick)) mapPick = null;
  const floors = rogue(c).config.map.floors;
  const W = rogue(c).config.map.width;
  const ROW = 4.75; // rem a floor
  const height = (floors + 1) * ROW + 1;
  const pos = (n: MapNode) => ({ x: ((n.col + 0.5) / W) * 100, y: (floors + 1 - n.floor) * ROW + 0.5 + ROW / 2 });
  const lines: string[] = [];
  for (const n of run.map) for (const id of n.next) {
    const to = run.map.find((x) => x.id === id)!;
    const a = pos(n), b = pos(to);
    const walked = run.visited.includes(n.id) && run.visited.includes(id);
    lines.push(`<line x1="${a.x}%" y1="${a.y}rem" x2="${b.x}%" y2="${b.y}rem" class="${walked ? "walked" : ""}"/>`);
  }
  const svg = h("div", { class: "rmap-lines" });
  svg.innerHTML = `<svg width="100%" height="${height}rem">${lines.join("")}</svg>`;
  const nodes = run.map.map((n) => {
    const p = pos(n);
    const can = next.some((x) => x.id === n.id);
    const been = run.visited.includes(n.id);
    const el = h("div", { class: `rnode ${n.kind}${can ? " can" : ""}${been ? " been" : ""}${run.at === n.id ? " here" : ""}${mapPick === n.id ? " cur" : ""}`, style: `left:${p.x}%;top:${p.y}rem`, onClick: can ? () => { mapPick = n.id; redraw(); } : undefined }, iconEl(ICON[n.kind], 2));
    return el;
  });
  const box = h("div", { class: "rmap", style: `height:${height}rem` }, svg, ...nodes);
  const scroller = win("scroll rmap-win", box);
  // Open on where the party stands.
  requestAnimationFrame(() => {
    const at = run.map.find((n) => n.id === run.at);
    const y = at ? pos(at).y : (floors + 0.5) * ROW;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    scroller.scrollTop = y * rem - scroller.clientHeight * 0.6;
  });
  const picked = mapPick ? run.map.find((n) => n.id === mapPick)! : null;
  const supplies = run.supplies.map((id, i) => button(h("span", null, iconEl(SUPPLY_ICON[id]), id.toUpperCase()), () => useSupplyView(run, id), "sm"));
  return [
    header(`ACT ${ROMAN[run.act]} · ${reg.name.toUpperCase()}`, () => go("home"), h("span", { class: "dim" }, run.floor ? `F${run.floor}` : "START")),
    h("div", { class: "line small" }, iconEl(ICON.boss), h("span", { class: "dim" }, "BOSS "), h("span", { class: "gold trunc grow" }, run.boss.name.toUpperCase())),
    partyStrip(run),
    scroller,
    picked
      ? win("", h("div", { class: "line" }, iconEl(ICON[picked.kind]), h("span", { class: "hi grow" }, KIND_NAME[picked.kind]), button("ENTER", () => { const id = picked.id; mapPick = null; pickOrSave(run, id); }, "hi sm")), h("div", { class: "text dim small wrap" }, KIND_TEXT[picked.kind]))
      : win("", h("div", { class: "text dim small wrap" }, next.length ? "Tap a lit room to choose your way up." : "")),
    h("div", { class: "btns" }, button("PARTY", () => go("rparty")), ...supplies),
  ];
}
function useSupplyView(run: RogueRun, id: "tonic" | "ether" | "phoenix") {
  if (id === "phoenix") {
    const down = run.roster.filter((m) => m.ko);
    if (!down.length) return confirm("NOBODY IS DOWN", "A phoenix feather stands a fallen member up. Keep it for then.", "OK", () => {});
    return confirm("PHOENIX FEATHER", `${className(down[0].cls)} stands up with half its HP.`, "USE", () => { useSupply(c, run, id, down[0].cls); saveRogue(); sfx.heal(); redraw(); });
  }
  confirm(id === "tonic" ? "TONIC" : "ETHER", SUPPLY_TEXT[id], "USE", () => { useSupply(c, run, id); saveRogue(); sfx.heal(); redraw(); });
}

// ─── A fight in waiting ────────────────────────────────────────────────────

function fightView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "fight") return [];
  const kinds = [...new Set(p.fight.enemies)];
  const n = (id: string) => p.fight.enemies.filter((e) => e === id).length;
  const foes = kinds.map((id) => {
    const en = c.enemies.get(id)!;
    const res = Object.entries(en.stats).filter(([k]) => k.startsWith("resist:")).map(([k, v]) => h("span", { class: k.slice(7) }, `${v > 100 ? "ABSORBS" : v > 0 ? "RESISTS" : "WEAK TO"} ${k.slice(7).toUpperCase()} `));
    // What it hits with: its attack's element (or physical), and its abilities' elements.
    const el = (x?: string) => x ?? "physical";
    const hits = new Set<string>([el(en.weapon?.element ?? (en.weapon?.kind ? c.weaponKinds.get(en.weapon.kind)?.element : undefined))]);
    for (const a of en.abilities ?? []) for (const d of c.abilities.get(a)!.do) if (d.op === "damage") hits.add(d.type === "magical" ? el(d.element) : "physical");
    res.unshift(h("span", { class: "dim" }, "HITS WITH "), ...[...hits].map((k) => h("span", { class: k }, `${k.toUpperCase()} `)));
    return h("div", { class: "line", style: "align-items:flex-start;min-height:3rem" }, h("span", { style: "width:3rem;display:inline-flex;justify-content:center" }, enemyThumb(id, 24)),
      h("div", { class: "grow" }, h("div", { class: en.rank === "boss" ? "gold" : en.rank === "elite" ? "debuff" : "" }, `${enemyDisplayName(id).toUpperCase()}${n(id) > 1 ? ` ×${n(id)}` : ""}`), h("div", { class: "text dim small wrap" }, en.text), res.length ? h("div", { class: "small" }, ...res) : null));
  });
  return [
    header(p.tier === "boss" ? "BOSS" : p.tier === "elite" ? "ELITE" : "FIGHT", () => go("home")),
    partyStrip(run),
    win("scroll", h("div", { class: "line hi" }, p.fight.name.toUpperCase()), ...foes),
    h("div", { class: "text dim small wrap" }, p.begun ? "The fight has begun: coming back plays it again from its start, the same way." : "Change gear, the formation and ability order now, or use a supply. Once the fight starts, the party is set."),
    h("div", { class: "btns even" }, button("FIGHT", () => go("battle", { rogue: true }), "hi"), p.begun ? null : button("PARTY", () => go("rparty"))),
  ];
}

// ─── Spoils, the boss's boon, a chest ──────────────────────────────────────

let rewardPick: number | null = null;
function rewardView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "spoils" && p.kind !== "boon" && p.kind !== "treasure") return [];
  const offers = p.kind === "treasure" ? [p.offer] : p.offers;
  const opts = options(c, run);
  const takeId = (i: number) => (p.kind === "treasure" ? "take" : `take:${i}`);
  if (rewardPick !== null && (rewardPick >= offers.length || !opts.includes(takeId(rewardPick)))) rewardPick = null;
  const title = p.kind === "boon" ? "THE BOSS FALLS" : p.kind === "treasure" ? "A CHEST" : p.tier === "elite" ? "ELITE SPOILS" : "SPOILS";
  const goldLine = p.kind === "spoils" ? h("div", { class: "line" }, gold(p.gold), h("span", { class: "dim" }, " FOUND")) : p.kind === "treasure" ? h("div", { class: "line" }, gold(p.gold), h("span", { class: "dim" }, " INSIDE")) : h("div", { class: "text dim small wrap" }, "Pick a boon. The next act starts with everyone restored, and everyone learns.");
  const trophy = p.kind === "spoils" && p.trophy ? win("", h("div", { class: "line gold" }, "TROPHY, ALREADY IN THE BAG"), ...offerBody(run, { kind: "gear", item: p.trophy })) : null;
  const cards = offers.map((o, i) => {
    const ok = opts.includes(takeId(i));
    return win(`roffer${rewardPick === i ? " cur" : ""}${ok ? "" : " dimmed"}`, ...offerBody(run, o), ok ? null : h("div", { class: "line small bad" }, "CAN'T TAKE IT NOW"));
  });
  cards.forEach((el, i) => el.addEventListener("click", () => { rewardPick = i; redraw(); }));
  const skip = p.kind === "treasure" ? "leave" : "skip";
  return [
    header(title, () => go("home"), p.kind === "treasure" ? null : h("span", { class: "dim" }, "PICK ONE")),
    goldLine,
    win("scroll flat", trophy, ...cards),
    h("div", { class: "btns even" },
      p.kind === "treasure"
        ? button("TAKE", () => { if (opts.includes("take")) pickOrSave(run, "take"); }, "hi")
        : button(rewardPick !== null ? "TAKE" : "PICK ONE", () => { if (rewardPick !== null) { const i = rewardPick; rewardPick = null; pickOrSave(run, takeId(i)); } }, rewardPick !== null ? "hi" : ""),
      button(p.kind === "treasure" ? "LEAVE IT" : "SKIP", () => { rewardPick = null; pickOrSave(run, skip); }),
      button("PARTY", () => go("rparty"))),
  ];
}

// ─── The shop ──────────────────────────────────────────────────────────────

let shopTab: "buy" | "train" | "sell" = "buy";
function shopView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "shop") return [];
  const opts = options(c, run);
  const tabs = h("div", { class: "btns" }, ...(["buy", "train", "sell"] as const).map((t) => button(t.toUpperCase(), () => { shopTab = t; redraw(); }, shopTab === t ? "on sm" : "sm")), h("span", { class: "r" }, gold(run.gold)));
  const list: Child[] = [];
  if (shopTab === "buy") {
    p.stock.forEach((s, i) => {
      const can = opts.includes(`buy:${i}`);
      const el = win(`roffer${s.sold ? " dimmed" : can ? "" : " dimmed"}`, ...offerBody(run, s.offer), h("div", { class: "line" }, s.sold ? h("span", { class: "dim" }, "BOUGHT") : gold(s.price), s.sold ? null : h("span", { class: "r" }, button("BUY", () => pickOrSave(run, `buy:${i}`), can ? "hi sm" : "sm"))));
      list.push(el);
    });
  } else if (shopTab === "train") {
    const k = rogue(c).config.prices;
    list.push(h("div", { class: "text dim small wrap" }, `Learn an ability for ${k.learn}G, or make one better (+) for ${k.upgrade}G. Once each a visit.`));
    if (p.learn) for (const o of learnOptions(c, run)) { const [cl, ab] = o.split(":"); list.push(trainRow(run, cl, ab, `LEARN ${k.learn}G`, opts.includes(`learn:${o}`) ? () => pickOrSave(run, `learn:${o}`) : null)); }
    else list.push(h("div", { class: "line dim" }, "LEARNED HERE ALREADY"));
    if (p.upgrade) for (const o of upgradeOptions(run)) { const [cl, ab] = o.split(":"); list.push(trainRow(run, cl, ab, `+ ${k.upgrade}G`, opts.includes(`upgrade:${o}`) ? () => pickOrSave(run, `upgrade:${o}`) : null, true)); }
    else list.push(h("div", { class: "line dim" }, "UPGRADED HERE ALREADY"));
  } else {
    const items = run.items.filter((it) => !wearer(run, it.uid));
    if (!items.length) list.push(h("div", { class: "line dim" }, "NOTHING IN THE BAG"));
    for (const it of items) list.push(itemRow(run, it, undefined, { right: button(`SELL ${sellPrice(c, it)}G`, () => pickOrSave(run, `sell:${it.uid}`), "sm") }));
  }
  return [
    header("SHOP", () => go("home")),
    tabs,
    win("scroll", ...list),
    h("div", { class: "btns even" }, button("LEAVE", () => { shopTab = "buy"; pickOrSave(run, "leave"); }, "hi"), button("PARTY", () => go("rparty"))),
  ];
}
function trainRow(run: RogueRun, cls: string, ab: string, label: string, onClick: (() => void) | null, up = false): HTMLElement {
  const a = c.abilities.get(ab)!;
  return h("div", { class: "ab" },
    h("div", { class: "head" }, faceEl(cls), h("span", { class: "grow trunc" }, `${shortName(cls)}: ${a.name.toUpperCase()}${up ? "+" : ""}`), onClick ? button(label, onClick, "sm hi") : h("span", { class: "dim small" }, label)),
    h("div", { class: "body" }, up ? upText(ab) : a.text, run.party.includes(cls) ? "" : " (at camp)"));
}

// ─── The campfire ──────────────────────────────────────────────────────────

let campTab: "rest" | "train" | "party" = "rest";
let swapPick: string | null = null;
function campView(run: RogueRun): Child[] {
  const k = rogue(c).config.campfire;
  const opts = options(c, run);
  const tabs = h("div", { class: "btns" }, ...(["rest", "train", "party"] as const).map((t) => button(t === "rest" ? "REST" : t === "train" ? "TRAIN" : "SWAP", () => { campTab = t; swapPick = null; redraw(); }, campTab === t ? "on sm" : "sm")));
  const body: Child[] = [];
  if (campTab === "rest") {
    body.push(row2("REST", `The party regains ${k.hp}% of its HP.`, () => pickOrSave(run, "rest")));
    body.push(row2("FOCUS", `The party regains ${k.mp}% of its MP.`, () => pickOrSave(run, "focus")));
    for (const o of opts.filter((x) => x.startsWith("raise:"))) body.push(row2(`RAISE ${shortName(o.slice(6))}`, `Stands up with ${k.revive}% of its HP.`, () => pickOrSave(run, o)));
    body.push(h("div", { class: "text dim small wrap" }, "One pick, then the road. Whatever you pick, those waiting at camp get both REST and FOCUS."));
  } else if (campTab === "train") {
    body.push(h("div", { class: "text dim small wrap" }, "Train instead of resting: one member learns an ability, or makes one better (+)."));
    for (const o of learnOptions(c, run)) { const [cl, ab] = o.split(":"); body.push(trainRow(run, cl, ab, "LEARN", () => pickOrSave(run, `learn:${o}`))); }
    for (const o of upgradeOptions(run)) { const [cl, ab] = o.split(":"); body.push(trainRow(run, cl, ab, "+", () => pickOrSave(run, `upgrade:${o}`), true)); }
  } else {
    const camp = bench(run);
    body.push(h("div", { class: "text dim small wrap" }, camp.length ? "Tap one of the party, then one at camp, to trade places. This doesn't use up the campfire." : "Nobody waits at camp. Recruits wait here when the party is full."));
    for (const cls of [...run.party, ...camp]) {
      const v = vitals(run, cls);
      const inParty = run.party.includes(cls);
      body.push(h("div", { class: `member${swapPick === cls ? " cur" : ""}`, onClick: () => {
        if (swapPick === null) swapPick = cls;
        else if (swapPick === cls) swapPick = null;
        else {
          const a = run.party.includes(swapPick) ? swapPick : cls, b = run.party.includes(swapPick) ? cls : swapPick;
          if (run.party.includes(a) && !run.party.includes(b)) swap(c, run, a, b);
          else if (run.party.includes(a) && run.party.includes(b)) { const o = [...run.party]; const i = o.indexOf(a), j = o.indexOf(b); [o[i], o[j]] = [o[j], o[i]]; seat(c, run, o); }
          swapPick = null;
          saveRogue();
        }
        redraw();
      } },
        faceEl(cls),
        h("div", { class: "stats" }, h("div", { class: "name" }, shortName(cls), h("span", { class: "dim small" }, inParty ? " · PARTY" : " · CAMP")), v.ko ? h("div", { class: "bad" }, "KO") : bar(v.hp / v.maxHp), v.maxMp ? bar(v.mp / v.maxMp, "mp") : null),
        h("div", { class: "small dim" }, `${disp(v.hp)}/${disp(v.maxHp)}`)));
    }
  }
  return [
    header("CAMPFIRE", () => go("home")),
    partyStrip(run),
    tabs,
    win("scroll", ...body),
  ];
}
function row2(label: string, text: string, onClick: () => void): HTMLElement {
  return h("div", { class: "row", onClick, style: "min-height:3rem" }, h("span", { class: "cursor" }, "▶"), h("div", { class: "grow" }, h("div", { class: "hi" }, label), h("div", { class: "text dim small wrap" }, text)));
}

// ─── Events ────────────────────────────────────────────────────────────────

function eventView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "event") return [];
  const ev = eventOf(c, p.id);
  const opts = options(c, run);
  return [
    header(ev.name.toUpperCase(), () => go("home")),
    partyStrip(run),
    win("", h("div", { class: "line" }, iconEl(ICON.event, 2)), h("div", { class: "text wrap" }, ev.text)),
    win("scroll list", ...(opts.includes("walk_on") ? [h("div", { class: "row", style: "min-height:3rem", onClick: () => pickOrSave(run, "walk_on") }, h("span", { class: "cursor" }, "▶"), h("div", { class: "grow" }, h("div", { class: "hi" }, "WALK ON"), h("div", { class: "text dim small wrap" }, "Nothing here you can use now.")))] : []), ...ev.options.map((o) => {
      const ok = opts.includes(o.id);
      return h("div", { class: `row${ok ? "" : " static dimmed"}`, style: "min-height:3rem", onClick: ok ? () => pickOrSave(run, o.id) : undefined },
        h("span", { class: "cursor" }, ok ? "▶" : ""), h("div", { class: "grow" }, h("div", { class: ok ? "hi" : "dim" }, o.label, o.gold ? h("span", { class: "gold" }, ` (${o.gold}G)`) : null), h("div", { class: "text dim small wrap" }, o.text)));
    })),
  ];
}

// ─── Choices: learn, upgrade, temper ───────────────────────────────────────

function chooseView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "choose") return [];
  const opts = options(c, run);
  const title = p.what === "learn" ? "WHO LEARNS?" : p.what === "upgrade" ? "WHICH ABILITY?" : "TEMPER WHICH?";
  const rows: Child[] = p.what === "temper"
    ? opts.map((uid) => itemRow(run, itemOf(run, uid)!, () => pickOrSave(run, uid), { arrow: true }))
    : opts.map((o) => { const [cl, ab] = o.split(":"); return trainRow(run, cl, ab, p.what === "learn" ? "LEARN" : "+", () => pickOrSave(run, o), p.what === "upgrade"); });
  return [header(title, () => go("home")), win("scroll", ...rows)];
}

// ─── Level up ──────────────────────────────────────────────────────────────

function levelView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "levelup") return [];
  const cls = p.queue[0];
  const m = member(run, cls);
  const opts = options(c, run);
  const learn = opts.filter((a) => unlearned(c, m).includes(a));
  const up = opts.filter((a) => !learn.includes(a));
  return [
    header("LEVEL UP", () => go("home"), h("span", { class: "dim" }, `${p.queue.length} TO GO`)),
    win("", classHead(cls), h("div", { class: "line hi wrap" }, `${shortName(cls)} LEARNS ONE, OR MAKES ONE BETTER`)),
    win("scroll",
      learn.length ? section("LEARN") : null,
      ...learn.map((a) => h("div", { onClick: () => pickOrSave(run, a), style: "cursor:pointer" }, abilityBlock(c.abilities.get(a)!, fighter(run, cls).stats, setup.settings.designer))),
      up.length ? section("MAKE BETTER (+)") : null,
      ...up.map((a) => h("div", { onClick: () => pickOrSave(run, a), style: "cursor:pointer" }, trainRow(run, cls, a, "+", null, true)))),
    h("div", { class: "text dim small wrap" }, "Tap one."),
  ];
}

// ─── The next region ───────────────────────────────────────────────────────

function regionView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "region") return [];
  return [
    header(`ACT ${ROMAN[run.act + 1]}`, () => go("home")),
    win("", h("div", { class: "text wrap" }, "The road forks. Each way has its own foes, and its own boss at the end.")),
    ...p.options.map((id) => {
      const r = rogue(c).regions.find((x) => x.id === id)!;
      return win("roffer", h("div", { class: "line hi" }, r.name.toUpperCase()), h("div", { class: "text dim small wrap" }, r.text), h("div", { class: "line small" }, iconEl(ICON.boss), h("span", { class: "gold" }, `BOSS: ${r.bosses.map((b) => b.name.replace(/^The /, "")).join(" OR ").toUpperCase()}`)), h("div", { class: "btns" }, button("GO THIS WAY", () => pickOrSave(run, id), "hi sm")));
    }),
  ];
}

// ─── The end ───────────────────────────────────────────────────────────────

function overView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "over") return [];
  const won = p.won;
  return [
    header(won ? "VICTORY" : "THE RUN ENDS", null),
    win("", h("div", { class: "line center" }, ...run.party.map((id) => actorEl(id, won ? "victory" : "dead", 1, member(run, id).gear.weapon ?? undefined))),
      h("div", { class: `line ${won ? "good" : "bad"}` }, won ? "ALL THREE ACTS CLEARED" : `FELL IN ACT ${ROMAN[run.act]}, FLOOR ${run.floor}`),
      h("div", { class: "line small dim wrap" }, `${run.stats.fights} FIGHTS · ${run.stats.elites} ELITES · ${run.stats.gold}G EARNED`),
      won ? h("div", { class: "line small hi wrap" }, `${run.party.map(shortName).join(", ")} CAN NOW LEAD A RUN`) : null),
    win("scroll", section("THE ROAD"), ...run.notes.map((n) => h("div", { class: "text small wrap" }, h("span", { class: "dim" }, `${ROMAN[n.act]}.${n.floor} `), n.text))),
    h("div", { class: "btns even" }, button("DONE", () => { const r = endRun(); go("rogue"); if (r.won) cheer(r.unlocked, r.heat); }, "hi")),
  ];
}

// ─── Managing the party ────────────────────────────────────────────────────

let seatPick: number | null = null;
export function rpartyScreen(): Child[] {
  const run = current();
  if (!run) return rogueScreen();
  const manage = canManage(run);
  const f = c.formations.get(run.formation)!;
  const fi = run.formations.indexOf(run.formation);
  const setF = (i: number) => { setFormation(c, run, run.formations[(i + run.formations.length) % run.formations.length]); saveRogue(); go("rparty", undefined, true); };
  const prev = button("◀", () => setF(fi - 1), "sm"), nxt = button("▶", () => setF(fi + 1), "sm");
  prev.disabled = nxt.disabled = run.formations.length < 2 || !manage;
  const cards = run.party.map((cls, i) => {
    const pos = f.positions[i];
    const v = vitals(run, cls);
    return h("div", { class: `win card${seatPick === i ? " cur" : ""}`, onClick: () => {
      if (!manage) return go("runit", cls);
      if (seatPick === null) seatPick = i;
      else if (seatPick === i) { seatPick = null; return go("runit", cls); }
      else { const o = [...run.party]; [o[seatPick], o[i]] = [o[i], o[seatPick]]; seat(c, run, o); seatPick = null; saveRogue(); }
      go("rparty", undefined, true);
    } },
      h("div", { class: "slot" }, `${i + 1} ${pos.name}`),
      h("div", { class: "portrait" }, faceEl(cls)),
      h("div", { class: "name" }, shortName(cls)),
      v.ko ? h("div", { class: "bad" }, "KO") : bar(v.hp / v.maxHp),
      v.maxMp ? bar(v.mp / v.maxMp, "mp") : null,
      h("div", { class: "codes" }, ...(codeSpans(pos.stats).length ? codeSpans(pos.stats) : [h("span", { class: "dim" }, "no change")])),
    );
  });
  const camp = bench(run);
  return [
    header("PARTY", () => { seatPick = null; go("rogue"); }, `ACT ${ROMAN[run.act]}`),
    win("", h("div", { class: "line" }, prev, h("span", { class: "grow center hi" }, f.name), nxt), h("div", { class: "text dim small wrap" }, f.text, f.statuses?.length ? ` ${f.statuses.map((s) => c.statuses.get(s)!.text).join(" ")}` : "")),
    h("div", { class: "cards" }, ...cards),
    h("div", { class: "text dim small wrap" }, manage ? "Tap two slots to trade seats; a slot twice for its sheet. Gear changes any time; who's in the party, only at a campfire." : "In a fight: look, don't touch."),
    win("scroll",
      camp.length ? section("AT CAMP", "swap at a campfire") : null,
      ...camp.map((cls) => { const v = vitals(run, cls); return h("div", { class: "member", onClick: () => go("runit", cls) }, faceEl(cls), h("div", { class: "stats" }, h("div", { class: "name" }, shortName(cls)), v.ko ? h("div", { class: "bad" }, "KO") : bar(v.hp / v.maxHp)), h("div", { class: "small dim" }, `${disp(v.hp)}/${disp(v.maxHp)}`)); }),
      section("BAG", `${run.items.filter((it) => !wearer(run, it.uid)).length} PIECES`),
      ...run.items.filter((it) => !wearer(run, it.uid)).map((it) => itemRow(run, it)),
    ),
  ];
}

let orderPick: number | null = null;
export function runitScreen(arg?: unknown): Child[] {
  const run = current();
  const cls = String(arg);
  if (!run || !run.roster.some((m) => m.cls === cls)) return rpartyScreen();
  const m = member(run, cls);
  const k = classOf(cls);
  const fm = fighter(run, cls);
  const manage = canManage(run);
  const sp = specialLines(fm.stats);
  const locked = c.classes.get(cls)!.abilities.filter((a) => !m.known.some((x) => x === a || x === `${a}_plus`));
  const onN = (i: number) => {
    if (!manage) return;
    if (orderPick === null) orderPick = i;
    else { const o = [...m.order]; [o[orderPick], o[i]] = [o[i], o[orderPick]]; setOrder(run, cls, o); orderPick = null; saveRogue(); }
    go("runit", cls, true);
  };
  const v = vitals(run, cls);
  return [
    header(k.name, () => { orderPick = null; go("rparty"); }, run.party.includes(cls) ? h("span", { class: "hi small" }, `SLOT ${run.party.indexOf(cls) + 1}`) : h("span", { class: "dim small" }, "AT CAMP")),
    win("", classHead(cls, h("div", { class: "line small" }, v.ko ? h("span", { class: "bad" }, "KO") : h("span", null, `HP ${disp(v.hp)}/${disp(v.maxHp)}`), h("span", { class: "mp" }, `  MP ${disp(v.mp)}/${disp(v.maxMp)}`)))),
    win("", statGrid(fm.stats, k.stats, setup.settings.designer), sp.length ? h("div", { class: "text up small wrap", style: "margin-top:.25rem" }, ...sp.flatMap((s, i) => (i ? [" · ", s] : [s]))) : null),
    win("scroll",
      section("GEAR", manage ? "tap to change" : null),
      ...(["weapon", "armor", "amulet"] as const).map((s) => {
        const uid = m.gear[s];
        const it = uid ? itemOf(run, uid) : undefined;
        const open = manage ? () => go("rgear", { cls, slot: s }) : undefined;
        if (!it) return gearRow(null, s, fm.stats, open);
        const r = itemRow(run, it, open, { arrow: !!open, stats: fm.stats, right: h("span", { class: `small ${RARITY_CLASS[it.rarity]}` }, it.rarity === "common" ? "" : it.rarity.toUpperCase()) });
        const g = c.gear.get(uid!)!;
        return g.statuses?.length ? h("div", null, r, ...effectLines(g)) : r;
      }),
      h("div", { class: "line small dim wrap" }, `CAN USE ${k.weapons.map((w) => kindOf(w).name).join(", ").toUpperCase()} · ${k.armor.toUpperCase()} ARMOR`),
      section("PASSIVE"),
      ...(k.passive ? passiveBlock(k.passive.name, k.passive.text) : passiveBlock("Einherjar", "Allies it revives come back with every action ready.")),
      section("ABILITIES", manage && m.order.length > 1 ? (orderPick === null ? "tap two numbers to swap" : "now tap the other") : null),
      ...m.order.map((a, i) => abilityBlock(c.abilities.get(a)!, fm.stats, setup.settings.designer, { n: i + 1, onN: () => onN(i), cur: orderPick === i })),
      basicLine(weaponOf(c, fm.weapon), fm.stats, setup.settings.designer),
      locked.length ? section("NOT LEARNED YET", "campfires, tomes, the shop") : null,
      ...locked.map((a) => { const el = abilityBlock(c.abilities.get(a)!, fm.stats, false); el.classList.add("dimmed"); return el; }),
    ),
  ];
}

export function rgearScreen(arg?: unknown): Child[] {
  const run = current();
  const { cls, slot } = (arg as { cls: string; slot: "weapon" | "armor" | "amulet" }) ?? {};
  if (!run || !run.roster.some((m) => m.cls === cls)) return rpartyScreen();
  const k = c.classes.get(cls)!;
  const fm = fighter(run, cls);
  const cur = member(run, cls).gear[slot];
  const fits = run.items.filter((it) => { const g = c.gear.get(it.uid) ?? itemGear(c, it); return g.slot === slot && canEquip(k, g); });
  const pick = (uid: string | null) => { equip(c, run, cls, slot, uid); saveRogue(); go("runit", cls); };
  const rarityOrder = { legendary: 0, rare: 1, uncommon: 2, common: 3 };
  fits.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
  return [
    header(`${shortName(cls)} · ${slot.toUpperCase()}`, () => go("runit", cls)),
    win("list scroll",
      slot !== "weapon" ? h("div", { class: `gear-row${!cur ? " equipped" : ""}`, onClick: () => pick(null) }, h("span", { class: "art" }, ""), h("div", { class: "grow" }, h("div", { class: "line" }, h("span", { class: "dim grow" }, "NOTHING")))) : null,
      ...fits.map((it) => {
        const r = itemRow(run, it, () => pick(it.uid), { stats: fm.stats });
        if (it.uid === cur) r.classList.add("equipped");
        const g = c.gear.get(it.uid)!;
        return g.statuses?.length ? h("div", null, r, ...effectLines(g)) : r;
      }),
    ),
    h("div", { class: "text dim small wrap" }, "Pieces another member wears trade places with this one's. Colours: green uncommon, blue rare, gold ★ legendary."),
  ];
}

/** The home menu's line for the rogue mode. */
export function rogueMenuLine(): string {
  const run = current();
  if (!run) return `${meta().owned.length} leaders · ${meta().wins} won`;
  const reg = rogue(c).regions.find((r) => r.id === run.region);
  return `Act ${ROMAN[run.act]}, ${reg?.name ?? ""}`;
}

/** A won run's moment: one card for the win, then one per class that can now lead, then the heat opened. A tap goes on. */
function cheer(unlocked: string[], heat: boolean) {
  if (!frameEl) return;
  const cards: Child[][] = [[h("div", { class: "cele-top" }, "VICTORY!"), h("div", { class: "text dim small wrap center" }, "All three acts cleared.")]];
  for (const id of unlocked) cards.push([h("div", { class: "cele-top" }, "NEW LEADER!"), h("div", { class: "cele-art" }, faceEl(id, 2), actorEl(id, "victory", 2)), h("div", { class: "cele-name" }, classOf(id).name), h("div", { class: "text dim small wrap center" }, "Can now lead a run.")]);
  if (heat) cards.push([h("div", { class: "cele-top" }, "HEAT RISES"), h("div", { class: "text dim small wrap center" }, `Heat ${meta().maxHeat} is open: every foe ${meta().maxHeat * rogue(c).config.heat.per}% tougher. Pick it on the leader screen.`)]);
  let at = 0;
  const overlay = h("div", { class: "overlay cele" });
  const show = () => {
    overlay.replaceChildren(win("cele-card", ...cards[at], h("div", { class: "line cele-foot" }, h("span", { class: "dim grow" }, `${at + 1}/${cards.length}`), h("span", { class: "hi blink" }, "▼"))));
    sfx.win();
  };
  overlay.addEventListener("click", () => { at++; if (at >= cards.length) overlay.remove(); else show(); });
  frameEl.append(overlay);
  show();
}
