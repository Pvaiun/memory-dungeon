/**
 * The rogue mode's screens. `rogue` shows whatever the run is waiting on: the leader and the draft, the map, the
 * spoils of a fight, a boss's boon, a chest, the shop, a campfire, an event, a level-up, the next region, the end.
 * `rparty`, `runit` and `rgear` manage the party any time outside a fight: gear, seats, who's in and who's at camp (step 5h).
 * Every choice goes to src/rogue.ts, is saved, and the screen redraws from the run.
 */
import {
  actRoll, bench, bossFoes, canManage, choose, discard, dismiss, eventView as eventOfRun, equip, formationRarity, itemGear, itemOf, leaderKnown, learnOptions, member, options, reachable,
  bagRoom, rogue, seat, seatsOf, sellPrice, setFormation, setOrder, swap, trainOptions, trainPrice, unlearned, upgraded, upgradeOptions, useSupply, wearer, type Item, type MapNode, type Offer, type RogueRun,
} from "../../src/rogue.js";
import { canEquip } from "../../src/validate.js";
import type { GearT, RogueNodeKindT } from "../../src/schema.js";
import { c, className, cls as classOf, disp, shortName } from "./content.js";
import { button, bar, h, header, toast, win, type Child } from "./dom.js";

/** The screen's one big action, and the smaller ones beside it, at the bottom-centre. */
const actions = (main: HTMLButtonElement | null, ...more: (HTMLButtonElement | null)[]) => {
  main?.classList.add("big");
  return h("div", { class: "actions" }, main, more.some(Boolean) ? h("div", { class: "btns even" }, ...more.map((b) => (b ? (b.classList.add("mid"), b) : null))) : null);
};
/** A choice as a big button: its word and, under it, what it does. */
const choice = (label: string, sub: string, onClick: () => void) => button(h("span", { class: "big-label" }, label, sub ? h("span", { class: "sub" }, sub) : null), onClick, "hi big");
import { abilityBlock, basicLine, canUse, classHead, classPassive, codeSpans, enemyStats, gearRow, hitsWith, role, section, sizeEl, specialLines, statGrid } from "./sheet.js";
import { abilityTag, sizeParts, sizeText } from "./describe.js";
import { campEl, foesOnStage, partyInLine, partyOnStage, stageEl, themeOf, type StageActor, type StageOpts } from "./battle/scene.js";
import { gearIcon, TAG_ICON, type Pose } from "./art.js";
import { weaponOf } from "../../src/engine/combat/fight.js";
import { actorEl, enemyThumb, faceEl, iconEl, iconOf, weaponIcon } from "./pixel.js";
import { enemyDisplayName } from "./art.js";
import type { Cell } from "./art.js";
import { current, endRun, fighter, lastRun, meta, nextSeed, saveRogue, setHeat, startRun, vitals } from "./rogue-state.js";
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

const ICON: Record<RogueNodeKindT, Cell> = { fight: [26, 7], elite: [10, 1], event: [10, 12], campfire: [13, 0], shop: [23, 11], treasure: [23, 15], boss: [18, 3], muster: [7, 5], drill: [23, 6] };
const KIND_NAME: Record<RogueNodeKindT, string> = { fight: "FIGHT", elite: "ELITE", event: "EVENT", campfire: "CAMPFIRE", shop: "SHOP", treasure: "CHEST", boss: "BOSS", muster: "MUSTER", drill: "DRILL GROUND" };
/** What a room pays or offers, in a line. */
const KIND_TEXT: Record<RogueNodeKindT, string> = {
  fight: "GOLD · SPOILS",
  elite: "MORE GOLD · PICK A LEGENDARY · PICK A FORMATION",
  event: "A CHOICE",
  campfire: "EVERYONE RECOVERS · THE FALLEN RISE · THEN REST OR TRAIN",
  shop: "GEAR · RECRUITS · TRAINING · SUPPLIES",
  treasure: "A RARE OR LEGENDARY PIECE, OR A CAGED RECRUIT · GOLD",
  boss: "THE ACT'S END · EVERYONE RESTORED AND LEARNS",
  muster: "PICK ONE OF TWO RECRUITS",
  drill: "PICK ONE OF TWO FORMATIONS, OR TRAIN TWO",
};
// Step 5g: a potion heals one member, a tonic refills one member's MP (the neediest; a choice of member is the next step).
const SUPPLY_ICON: Record<string, Cell> = { potion: [21, 7], tonic: [20, 7], phoenix: [21, 14] };
const SUPPLY_TEXT: Record<string, string> = { potion: "ONE MEMBER +30% HP", tonic: "ONE MEMBER +50% MP", phoenix: "A FALLEN MEMBER UP, 50% HP" };
const held = (run: RogueRun, id: string) => run.supplies.filter((x) => x === id).length;
const RARITY_CLASS: Record<string, string> = { common: "", uncommon: "good", rare: "buff", legendary: "gold" };
const ROMAN = ["", "I", "II", "III", "IV"];
const gold = (n: number) => h("span", { class: "gold" }, `${n}G`);

/** A run's item as a gear row, coloured by rarity, with who wears it. */
function itemRow(run: RogueRun, it: Item, onClick?: () => void, opts: { arrow?: boolean; stats?: Record<string, number> | null; right?: HTMLElement | null } = {}): HTMLElement {
  const g = c.gear.get(it.uid) ?? itemGear(c, it);
  const r = gearRow(g, g.slot, opts.stats ?? null, onClick, opts.arrow ?? false);
  const name = r.querySelector(".grow .line span");
  if (name) {
    name.className = RARITY_CLASS[it.rarity];
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
  // Step 5h round 6 (the director's): no FOR line on legendaries ("the signposting who the designer had in mind ... ruins the
  // discovery"); who in the roster it fits stays.
  const can = run.roster.filter((m) => canEquip(c.classes.get(m.cls)!, g)).map((m) => shortName(m.cls));
  if (can.length) return h("div", { class: "line small dim wrap" }, tag, `FITS ${can.join(", ")}`);
  const would = c.pack.classes.filter((k) => canEquip(k, g)).map((k) => shortName(k.id));
  return h("div", { class: "line small debuff wrap" }, tag, `NOBODY CAN USE IT YET · ${would.slice(0, 5).join(", ")}${would.length > 5 ? "…" : ""}`);
}
/** What an upgrade changes, in this member's numbers where it has some ("≈ 9 pierce + Silence → ≈ 13 pierce + Silence"). */
function upText(id: string, run?: RogueRun, cls?: string): string {
  const a = c.abilities.get(id)!, up = upgraded(c, id);
  if (up.cooldown !== a.cooldown) return `Every ${Math.round(up.cooldown)} ticks instead of ${Math.round(a.cooldown)}.`;
  const st = run && cls ? fighter(run, cls).stats : null;
  const was = st ? sizeText(sizeParts(a, st)) : "", now = st ? sizeText(sizeParts(up, st)) : "";
  return was && now && was !== now ? `${was} → ${now}` : "+40%";
}
/** An offer as a card's body. */
function offerBody(run: RogueRun, o: Offer): Child[] {
  // Round 6 (the director's: "an unknown reward, or even bundles"): a sealed piece shows only its slot; a bundle, its piece and its supply.
  if (o.kind === "gear" && o.sealed) {
    const g = c.gear.get(o.item.uid) ?? itemGear(c, o.item);
    return [h("div", { class: "line" }, iconEl(ICON.treasure), h("span", { class: "grow hi" }, `SEALED ${g.slot.toUpperCase()}`)), h("div", { class: "line small dim wrap" }, "RARE OR BETTER · SHOWN WHEN TAKEN")];
  }
  if (o.kind === "bundle") {
    const g = c.gear.get(o.item.uid) ?? itemGear(c, o.item);
    return [h("div", { class: "line hi" }, "A BUNDLE"), itemRow(run, o.item, undefined, { right: null }), fitsLine(run, g, o.item.rarity), h("div", { class: "line small" }, iconEl(SUPPLY_ICON[o.supply]), h("span", null, ` AND A ${o.supply.toUpperCase()}`), bagRoom(c, run, o.supply) ? null : h("span", { class: "dim" }, " (BAG FULL)"))];
  }
  if (o.kind === "gear") {
    const g = c.gear.get(o.item.uid) ?? itemGear(c, o.item);
    return [itemRow(run, o.item, undefined, { right: null }), fitsLine(run, g, o.item.rarity)];
  }
  if (o.kind === "tome") {
    return [h("div", { class: "line" }, faceEl(o.cls), h("span", { class: "grow hi" }, `TOME: ${shortName(o.cls)} LEARNS`)), abilityBlock(c.abilities.get(o.ability)!, null, false)];
  }
  if (o.kind === "recruit") {
    const k = classOf(o.cls);
    const known = o.known ?? [];
    // Step 5h: a recruit's rarity is what it knows (one, two or all three), shown as the gear's rarity colours.
    const rar = known.length >= 3 ? "legendary" : known.length === 2 ? "rare" : "common";
    // Round 6 (the director's: "can't inspect recruits on any screens"): a tap on the face opens the class with what this one knows.
    const face = h("span", { style: "cursor:pointer", onClick: (e?: Event) => { e?.stopPropagation(); go("rclass", { cls: o.cls, known }); } }, faceEl(o.cls));
    return [h("div", { class: "line" }, face, h("div", { class: "grow" }, h("div", { class: RARITY_CLASS[rar] || "hi" }, `RECRUIT: ${k.name.toUpperCase()}`), h("div", { class: "text dim small wrap" }, role(o.cls)))),
      h("div", { class: "line small wrap" }, h("span", { class: "dim" }, `KNOWS ${known.length}/3: `), known.map((a) => c.abilities.get(a)!.name.toUpperCase()).join(", ")),
      o.item ? itemRow(run, o.item, undefined, { right: h("span", { class: "dim small" }, "CARRIES") }) : null,
      run.party.length >= 3 ? h("div", { class: "line small dim" }, "JOINS AT CAMP") : null];
  }
  if (o.kind === "formation") {
    const f = c.formations.get(o.id)!;
    const rar = formationRarity(c, o.id);
    return [h("div", { class: "line" }, h("span", { class: RARITY_CLASS[rar] || "hi" }, `${rar === "legendary" ? "★" : ""}FORMATION: ${f.name.toUpperCase()}`), rar !== "common" ? h("span", { class: `small r ${RARITY_CLASS[rar]}` }, rar.toUpperCase()) : null), h("div", { class: "text dim small wrap" }, f.text), ...f.positions.map((p) => h("div", { class: "line small" }, h("span", { class: "dim" }, p.name.toUpperCase()), " ", ...codeSpans(p.stats)))];
  }
  if (o.kind === "seat") return [h("div", { class: "line" }, iconEl(ICON.campfire), h("span", { class: "grow hi" }, "A SEAT AT CAMP")), h("div", { class: "line dim small wrap" }, `ROOM FOR ONE MORE IN THE ROSTER · ${seatsOf(c, run)} → ${seatsOf(c, run) + 1} AT CAMP`)];
  return [h("div", { class: "line" }, iconEl(SUPPLY_ICON[o.id]), h("span", { class: "grow" }, o.id.toUpperCase())), h("div", { class: "line dim small" }, SUPPLY_TEXT[o.id])];
}

// ─── Scenes: each moment of the run drawn in its region ───

/** When each moment began (a screen redraws on every tap; its scene carries on rather than starting over). */
const since = new Map<string, number>();
const t0 = (key: string) => { if (!since.has(key)) since.set(key, performance.now()); return since.get(key)!; };
/** The run's party on a stage `h` tall, in a pose, with their weapons; the fallen lie down. */
function partyActors(run: RogueRun, h: number, pose: Pose = "wait", inLine?: { cx: number; gap?: number }): StageActor[] {
  const weapons = Object.fromEntries(run.party.map((cls) => [cls, member(run, cls).gear.weapon ?? undefined]));
  const p = { refs: run.party, weapons, formation: run.formation };
  return (inLine ? partyInLine(p, h, pose, inLine.cx, inLine.gap) : partyOnStage(p, h, pose)).map((a) => (a.kind === "hero" && member(run, a.ref).ko ? { ...a, pose: "dead" as Pose } : a));
}
/** A scene in the run's region (or `theme`), keyed so a redraw carries it on. */
function scene(run: RogueRun, key: string, o: Omit<StageOpts, "theme" | "t0"> & { theme?: string }): HTMLCanvasElement {
  return stageEl({ ...o, theme: o.theme ?? themeOf(run.region), t0: t0(`${key}:${run.act}:${run.floor}`) });
}
/**
 * The spoils on the ground beside the party: a sack of gold, then what's on offer, each as its own art (a weapon's
 * sprite, a piece's icon, a tome's ability, a supply); a recruit stands among them, facing the party.
 */
function lootActors(run: RogueRun, offers: Offer[], gold: boolean, h: number, x0: number, x1: number): StageActor[] {
  const cell = (k: readonly [number, number]) => iconOf(k[0], k[1]);
  const arts: (HTMLCanvasElement | string)[] = gold ? [cell(GOLD_SACK)] : [];
  for (const o of offers) {
    if (o.kind === "gear" && o.sealed) arts.push(cell(ICON.treasure));
    else if (o.kind === "gear" || o.kind === "bundle") {
      const g = c.gear.get(o.item.uid) ?? itemGear(c, o.item);
      arts.push((g.slot === "weapon" ? weaponIcon(g.id) : null) ?? cell(gearIcon(g)));
    } else if (o.kind === "tome") arts.push(cell(TAG_ICON[abilityTag(c.abilities.get(o.ability)!)] ?? TAG_ICON.physical));
    else if (o.kind === "recruit") arts.push(o.cls);
    else if (o.kind === "formation") arts.push(cell(FORMATION_ICON));
    else if (o.kind === "seat") arts.push(cell(ICON.campfire));
    else arts.push(cell(SUPPLY_ICON[o.id]));
  }
  const step = arts.length > 1 ? Math.min(28, (x1 - x0) / (arts.length - 1)) : 0;
  const left = (x0 + x1) / 2 - (step * (arts.length - 1)) / 2;
  return arts.map((a, i) => {
    const x = Math.round(left + i * step);
    return typeof a === "string" ? { kind: "hero", ref: a, x, y: h - 6, pose: "wait", mirror: true } : { kind: "loot", x, y: h - 4, art: a };
  });
}
const GOLD_SACK: Cell = [23, 11];
const FORMATION_ICON: Cell = [23, 6];

/** The party facing a fight's foes, as the battle will stand them. */
const standoff = (run: RogueRun, enemies: string[], key: string, theme?: string, h = 136) => scene(run, key, { theme, h, actors: [...partyActors(run, h), ...foesOnStage(enemies, h)] });

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
    h("div", { class: "line small" }, gold(run.gold), h("span", { class: "dim" }, ` · `, iconEl(SUPPLY_ICON.potion), `${held(run, "potion")}/${rogue(c).config.bag.potion} `, iconEl(SUPPLY_ICON.tonic), `${held(run, "tonic")}/${rogue(c).config.bag.tonic}`, held(run, "phoenix") ? h("span", null, " ", iconEl(SUPPLY_ICON.phoenix), `${held(run, "phoenix")}`) : null), camp.length ? h("span", { class: "dim r" }, `CAMP: ${camp.map(shortName).join(", ")}`) : null));
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
    case "drop": return dropView(run);
    case "spoils": case "boon": case "treasure": case "trophy": return rewardView(run);
    case "captive": return captiveView(run);
    case "shop": return shopView(run);
    case "campfire": return campView(run);
    case "event": return eventScreen(run);
    case "muster": case "drill": return roomView(run);
    case "train": return trainView(run);
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
  // Round 6 (the director's): the ability each leader would set out knowing, shown before the pick (the run's dice are kept).
  const seed = nextSeed();
  const knows = (id: string) => leaderKnown(c, seed, id);
  const last = lastRun();
  const heatRow = m.maxHeat > 0 ? h("div", { class: "line" }, h("span", { class: "dim" }, "HEAT"), button("◀", () => { setHeat(m.heat - 1); redraw(); }, "sm"), h("span", { class: "hi" }, String(m.heat)), button("▶", () => { setHeat(m.heat + 1); redraw(); }, "sm"), m.heat ? h("span", { class: "dim small r" }, `FOES +${m.heat * rogue(c).config.heat.per}%`) : null) : null;
  return [
    header("ROGUE", () => go("home"), h("span", { class: "dim" }, `${m.wins}/${m.runs} WON`)),
    last ? win("", h("div", { class: `line ${last.won ? "good" : "bad"}` }, last.won ? "LAST RUN: WON" : "LAST RUN: LOST"), last.unlocked.length ? h("div", { class: "line small hi wrap" }, `NEW LEADERS: ${last.unlocked.map(shortName).join(", ")}`) : null) : null,
    h("div", { class: "line hi" }, "CHOOSE YOUR LEADER"),
    win("roster", h("div", { class: "grid" }, ...owned.map((id) => h("div", { class: `cell${leaderPick === id ? " cur" : ""}`, onClick: () => { leaderPick = id; redraw(); } }, h("div", { class: "portrait" }, faceEl(id)), h("span", { class: "trunc", style: "max-width:100%" }, shortName(id)), h("span", { class: "trunc small dim", style: "max-width:100%" }, c.abilities.get(knows(id)[0])!.name.toUpperCase()))),
      ...(owned.length < c.pack.classes.length ? [h("div", { class: "cell static dim" }, h("div", { class: "portrait locked" }, "?"), h("span", null, `${c.pack.classes.length - owned.length} MORE`))] : []))),
    win("", classHead(leaderPick), section("STARTS WITH"), ...knows(leaderPick).map((a) => abilityBlock(c.abilities.get(a)!, classOf(leaderPick!).stats, setup.settings.designer))),
    heatRow,
    actions(button("SET OUT", () => { startRun(leaderPick!, m.heat); sfx.win(); redraw(); }, "hi"), button("CLASSES", () => go("classes"))),
  ];
}

// ─── The draft ─────────────────────────────────────────────────────────────

let draftPick: string | null = null;
function draftView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "draft") return [];
  if (!draftPick || !p.offers.includes(draftPick)) draftPick = p.offers[0];
  const n = rogue(c).config.start.picks - p.left + 1;
  // Step 5h (the director's): each offer joins knowing one ability, rolled when offered and shown here.
  const knows = (id: string) => p.known?.[id] ?? [];
  return [
    header(`COMPANION ${n}/${rogue(c).config.start.picks}`, () => go("home")),
    partyStrip(run, false),
    h("div", { class: "cards" }, ...p.offers.map((id) => h("div", { class: `win card${draftPick === id ? " cur" : ""}`, onClick: () => { draftPick = id; redraw(); } },
      h("div", { class: "portrait" }, faceEl(id)), h("div", { class: "name" }, shortName(id)), h("div", { class: "codes small" }, knows(id).map((a) => c.abilities.get(a)!.name).join(", "))))),
    win("scroll", classHead(draftPick), section("PASSIVE"), ...classPassive(draftPick), section("STARTS WITH"), ...knows(draftPick).map((a) => abilityBlock(c.abilities.get(a)!, classOf(draftPick!).stats, setup.settings.designer)),
      section("LEARNS LATER"), ...c.classes.get(draftPick)!.abilities.filter((a) => !knows(draftPick!).includes(a)).map((a) => abilityBlock(c.abilities.get(a)!, classOf(draftPick!).stats, false)),
    ),
    actions(button(`TAKE ${shortName(draftPick)}`, () => pickOrSave(run, draftPick!), "hi")),
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
  const ROW = 5.5; // rem a floor: room for the rooms within reach, drawn bigger
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
    // A room within reach: one tap picks it (what it gives shows below), a second tap on it goes in.
    const enter = () => { mapPick = null; pickOrSave(run, n.id); };
    const el = h("div", { class: `rnode ${n.kind}${can ? " can" : ""}${been ? " been" : ""}${run.at === n.id ? " here" : ""}${mapPick === n.id ? " cur" : ""}`, style: `left:${p.x}%;top:${p.y}rem`, onClick: can ? () => { if (mapPick === n.id) return enter(); mapPick = n.id; redraw(); } : undefined },
      iconEl(ICON[n.kind], 2), mapPick === n.id ? h("span", { class: "rnode-tag" }, KIND_NAME[n.kind]) : null);
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
  return [
    header(`ACT ${ROMAN[run.act]} · ${reg.name.toUpperCase()}`, () => go("home"), h("span", { class: "dim" }, run.floor ? `F${run.floor}` : "START")),
    h("div", { class: "line small", onClick: () => go("rboss"), style: "cursor:pointer" }, iconEl(ICON.boss), h("span", { class: "dim" }, "BOSS "), h("span", { class: "gold trunc grow" }, run.boss.name.toUpperCase()), h("span", { class: "dim" }, "LOOK ▶")),
    partyStrip(run),
    scroller,
    picked ? win("", h("div", { class: "line" }, iconEl(ICON[picked.kind]), h("span", { class: "hi grow" }, KIND_NAME[picked.kind])), h("div", { class: "line dim small wrap" }, KIND_TEXT[picked.kind])) : null,
    supplyRow(run),
    actions(picked ? button(`ENTER ${KIND_NAME[picked.kind]}`, () => { const id = picked.id; mapPick = null; pickOrSave(run, id); }, "hi") : null, button("PARTY", () => go("rparty"))),
  ];
}
/** The supplies carried, one button each (step 5h round 6: on the map, the party screen and a fight's preview, wherever swaps are). */
function supplyRow(run: RogueRun, after: () => void = redraw): HTMLElement | null {
  if (!run.supplies.length || !canManage(run)) return null;
  return h("div", { class: "btns" }, ...run.supplies.map((id) => button(h("span", null, iconEl(SUPPLY_ICON[id]), id.toUpperCase()), () => useSupplyView(run, id, after), "sm")));
}
function useSupplyView(run: RogueRun, id: "potion" | "tonic" | "phoenix", after: () => void = redraw) {
  if (id === "phoenix") {
    const down = run.roster.filter((m) => m.ko);
    if (!down.length) return confirm("NOBODY IS DOWN", "", "OK", () => {});
    return confirm("PHOENIX FEATHER", `${className(down[0].cls).toUpperCase()} UP, 50% HP`, "USE", () => { useSupply(c, run, id, down[0].cls); saveRogue(); sfx.heal(); after(); });
  }
  // Round 9 (the director's): the player picks who drinks it ("the feature doesn't work without that").
  pickMember(run, id === "potion" ? "POTION: WHO DRINKS IT?" : "TONIC: WHO DRINKS IT?", id === "potion" ? "hp" : "mp", (cls) => { useSupply(c, run, id, cls); saveRogue(); sfx.heal(); after(); });
}
/** A standing party member to pick, with the bar the supply would fill; cancel closes it. */
function pickMember(run: RogueRun, title: string, which: "hp" | "mp", onPick: (cls: string) => void) {
  if (!frameEl) return;
  const rows = run.party.map((cls) => ({ cls, ...vitals(run, cls) })).filter((v) => !v.ko && (which === "hp" ? v.maxHp : v.maxMp) > 0).map((v) =>
    h("div", { class: "line", style: "cursor:pointer", onClick: () => { box.remove(); onPick(v.cls); } },
      faceEl(v.cls), h("span", { class: "grow" }, className(v.cls).toUpperCase()),
      h("span", { class: which === "hp" ? "" : "mp" }, which === "hp" ? `${disp(v.hp)}/${disp(v.maxHp)} HP` : `${disp(v.mp)}/${disp(v.maxMp)} MP`)));
  const box = h("div", { class: "overlay dialog" }, win("", h("div", { class: "line hi" }, title), ...rows, h("div", { class: "btns", style: "margin-top:.75rem" }, button("CANCEL", () => box.remove()))));
  frameEl.append(box);
}
/** Round 9 (the director's): after a won fight, one supply of the two, not one of each. */
function dropView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "drop") return [];
  const cards = p.options.map((id) => win("roffer", h("div", { class: "line" }, iconEl(SUPPLY_ICON[id]), h("span", { class: "grow hi" }, id.toUpperCase()), h("span", { class: "dim small" }, `${held(run, id)}/${rogue(c).config.bag[id]} HELD`)), h("div", { class: "line dim small" }, SUPPLY_TEXT[id]),
    h("div", { class: "btns" }, button("TAKE", () => pickOrSave(run, id), "hi sm"))));
  return [
    header("FOUND SUPPLIES", () => go("home"), h("span", { class: "dim" }, "PICK ONE")),
    scene(run, "drop", { h: 96, actors: partyActors(run, 96, "victory", { cx: 135 }) }),
    win("scroll flat", ...cards),
    actions(button("PARTY", () => go("rparty"))),
  ];
}

// ─── A fight in waiting ────────────────────────────────────────────────────

/**
 * A fight's foes as the preview shows them, with this fight's changes to HP and damage: each kind's likeness, name and
 * count, its HP, ATK, MAG and ARM, the elements it's weak to or resists, what it hits with, and its abilities with
 * their sizes, so a boss's big move can be planned for (Slay the Spire shows intents).
 */
function foeLines(enemies: string[], foes: { hp?: number; power?: number } = {}): Child[] {
  const kinds = [...new Set(enemies)];
  const n = (id: string) => enemies.filter((e) => e === id).length;
  const mult = 1 + (foes.power ?? 0) / 100;
  return kinds.map((id) => {
    const en = c.enemies.get(id)!;
    const st = enemyStats(en);
    st.max_hp = Math.round(st.max_hp * (1 + (foes.hp ?? 0) / 100));
    const acts = (en.abilities ?? []).map((a) => { const ab = c.abilities.get(a)!; return h("div", { class: "foe-act" }, h("div", { class: "text small wrap" }, h("span", { class: "hi" }, `${ab.name.toUpperCase()} `), h("span", { class: "dim" }, ab.text)), sizeEl(sizeParts(ab, st, mult))); });
    return h("div", { class: "foe" },
      h("div", { class: "line" }, h("span", { class: "foe-art" }, enemyThumb(id, 24)), h("span", { class: `grow trunc ${en.rank === "boss" ? "gold" : en.rank === "elite" ? "debuff" : ""}` }, `${enemyDisplayName(id).toUpperCase()}${n(id) > 1 ? ` ×${n(id)}` : ""}`)),
      statGrid(st, null, false, ["max_hp", "attack", "magic", "armor"]),
      h("div", { class: "line wrap small" }, h("span", { class: "dim" }, "HITS WITH"), ...hitsWith(en)),
      ...acts);
  });
}
/** The act's boss, from the map: known from the act's start, so the party can be built and swapped toward it. */
export function rbossScreen(): Child[] {
  const run = current();
  if (!run) return rogueScreen();
  return [
    header("BOSS", () => go("rogue")),
    standoff(run, run.boss.enemies, "boss"),
    win("scroll", h("div", { class: "line gold" }, run.boss.name.toUpperCase()), ...foeLines(run.boss.enemies, bossFoes(c, run))),
  ];
}

function fightView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "fight") return [];
  const foes = foeLines(p.fight.enemies, p.foes);
  return [
    header(p.tier === "boss" ? "BOSS" : p.tier === "elite" ? "ELITE" : "FIGHT", () => go("home")),
    standoff(run, p.fight.enemies, `fight:${p.fight.id}`),
    partyStrip(run),
    win("scroll", h("div", { class: "line hi" }, p.fight.name.toUpperCase()), ...foes),
    supplyRow(run),
    actions(button("FIGHT", () => go("battle", { rogue: true }), "hi"), p.begun ? null : button("PARTY", () => go("rparty"))),
  ];
}

// ─── Spoils, the boss's boon, a chest ──────────────────────────────────────

let rewardPick: number | null = null;
function rewardView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "spoils" && p.kind !== "boon" && p.kind !== "treasure" && p.kind !== "trophy") return [];
  const offers = p.kind === "treasure" ? [p.offer] : p.offers;
  const opts = options(c, run);
  const takeId = (i: number) => (p.kind === "treasure" ? "take" : `take:${i}`);
  if (rewardPick !== null && (rewardPick >= offers.length || !opts.includes(takeId(rewardPick)))) rewardPick = null;
  const title = p.kind === "boon" ? "THE BOSS FALLS" : p.kind === "treasure" ? "A CHEST" : p.kind === "trophy" ? "ELITE: A FORMATION" : p.tier === "elite" ? "ELITE: A LEGENDARY" : "SPOILS";
  const goldLine = p.kind === "spoils" ? h("div", { class: "line" }, gold(p.gold), h("span", { class: "dim" }, " FOUND")) : p.kind === "treasure" ? h("div", { class: "line" }, gold(p.gold), h("span", { class: "dim" }, " INSIDE")) : null;
  const trophy = p.kind === "spoils" && p.trophy ? win("", h("div", { class: "line gold" }, "TROPHY"), ...offerBody(run, { kind: "gear", item: p.trophy })) : null;
  const cards = offers.map((o, i) => {
    const ok = opts.includes(takeId(i));
    return win(`roffer${rewardPick === i ? " cur" : ""}${ok ? "" : " dimmed"}`, ...offerBody(run, o), ok ? null : h("div", { class: "line small bad" }, "CAN'T TAKE IT NOW"));
  });
  cards.forEach((el, i) => el.addEventListener("click", () => { rewardPick = i; redraw(); }));
  const skip = p.kind === "treasure" ? "leave" : "skip";
  // After a fight the party cheers beside what it won, laid on the ground; a chest opens in front of it.
  const sceneEl = p.kind === "treasure"
    ? scene(run, "chest", { h: 96, actors: [...partyActors(run, 96, "wait", { cx: 96 }), { kind: "chest", x: 196, y: 88, color: "gold" }], openAt: 500, sparkle: { x: 196, y: 74, strip: "diamond1" } })
    : scene(run, `spoils:${p.kind}`, { h: 96, actors: [...partyActors(run, 96, "victory", { cx: 72 }), ...lootActors(run, [...(p.kind === "spoils" && p.trophy ? [{ kind: "gear" as const, item: p.trophy }] : []), ...offers], p.kind === "spoils" && p.gold > 0, 96, 160, 248)], sparkle: { x: 204, y: 70, strip: "diamond1" } });
  return [
    header(title, () => go("home")),
    sceneEl,
    goldLine,
    // The choice is named where it's made, right over the cards.
    win("scroll flat", trophy, p.kind === "treasure" ? null : h("div", { class: "section" }, "PICK ONE"), ...cards),
    actions(
      p.kind === "treasure"
        ? button("TAKE", () => { if (opts.includes("take")) pickOrSave(run, "take"); }, "hi")
        : (() => { const b = button("TAKE", () => { if (rewardPick !== null) { const i = rewardPick; rewardPick = null; pickOrSave(run, takeId(i)); } }, "hi"); b.disabled = rewardPick === null; return b; })(),
      button(p.kind === "treasure" ? "LEAVE IT" : "SKIP", () => { rewardPick = null; pickOrSave(run, skip); }),
      button("PARTY", () => go("rparty"))),
  ];
}

// ─── A captive (round 6) ───────────────────────────────────────────────────

/** A captive freed from the fight: taken in (hurt), a lesson for one member, or let go; on top of the spoils. */
function captiveView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "captive") return [];
  const opts = options(c, run);
  const hp = rogue(c).config.captive?.hp ?? 100;
  return [
    header("A CAPTIVE", () => go("home")),
    scene(run, "captive", { h: 96, actors: [...partyActors(run, 96, "wait", { cx: 72 }), ...lootActors(run, [p.offer], false, 96, 190, 220)] }),
    win("scroll flat", h("div", { class: "line small dim wrap" }, "FREED FROM THE FIGHT"), win("roffer", ...offerBody(run, p.offer)),
      opts.includes("take") ? null : h("div", { class: "line small bad wrap" }, "ROSTER FULL: SEND SOMEONE HOME FIRST (PARTY)")),
    actions(
      (() => { const b = button(`TAKE THEM IN (${hp}% HP)`, () => pickOrSave(run, "take"), "hi"); b.disabled = !opts.includes("take"); return b; })(),
      opts.includes("lesson") ? button("A LESSON", () => { trainWho = null; pickOrSave(run, "lesson"); }) : null,
      button("LET THEM GO", () => pickOrSave(run, "leave")),
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
      const el = win(`roffer${s.sold ? " dimmed" : can ? "" : " dimmed"}`, ...offerBody(run, s.offer), h("div", { class: "line" }, s.sold ? h("span", { class: "dim" }, "BOUGHT") : gold(s.price), !s.sold && s.offer.kind === "supply" && !bagRoom(c, run, s.offer.id) ? h("span", { class: "dim small" }, " BAG FULL") : null, s.sold ? null : h("span", { class: "r" }, button("BUY", () => pickOrSave(run, `buy:${i}`), can ? "hi sm" : "sm"))));
      list.push(el);
    });
  } else if (shopTab === "train") {
    const lp = trainPrice(c, p, "learn"), up = trainPrice(c, p, "upgrade");
    const entries: TrainEntry[] = [
      ...(p.learn ? learnOptions(c, run).map((o) => { const [cl, ab] = o.split(":"); return { cls: cl, ab, up: false, label: `LEARN ${lp}G`, onClick: opts.includes(`learn:${o}`) ? () => pickOrSave(run, `learn:${o}`) : null }; }) : []),
      ...(p.upgrade ? upgradeOptions(run).map((o) => { const [cl, ab] = o.split(":"); return { cls: cl, ab, up: true, label: `+ ${up}G`, onClick: opts.includes(`upgrade:${o}`) ? () => pickOrSave(run, `upgrade:${o}`) : null }; }) : []),
    ];
    list.push(...trainPicker(run, entries));
  } else {
    const items = run.items.filter((it) => !wearer(run, it.uid));
    if (!items.length) list.push(h("div", { class: "line dim" }, "NOTHING IN THE BAG"));
    for (const it of items) list.push(itemRow(run, it, undefined, { right: button(`SELL ${sellPrice(c, it)}G`, () => pickOrSave(run, `sell:${it.uid}`), "sm") }));
  }
  return [
    header("SHOP", () => go("home")),
    // The shop: the party in at the door, the shopkeeper behind a counter of goods.
    scene(run, "shop", { theme: "shop", h: 144, actors: partyActors(run, 144, "wait", { cx: 66, gap: 36 }) }),
    tabs,
    win("scroll", ...list),
    actions(button("LEAVE", () => { shopTab = "buy"; pickOrSave(run, "leave"); }, "hi"), button("PARTY", () => go("rparty"))),
  ];
}
/** One thing training can do: a member learns an ability, or makes one better (+). */
type TrainEntry = { cls: string; ab: string; up: boolean; label: string; onClick: (() => void) | null };
/**
 * Step 5h (the director's: "a nested menu rather than a flat list"): training in two levels, the same everywhere it happens.
 * First the roster, each member with how many things it can learn or make better; then one member's abilities and passive,
 * each with what can be done to it. Step 5i gives every ability and passive two upgrades to pick between.
 */
let trainWho: string | null = null;
function trainPicker(run: RogueRun, entries: TrainEntry[]): Child[] {
  const who = [...new Set(entries.map((e) => e.cls))];
  if (trainWho && !who.includes(trainWho)) trainWho = null;
  if (!who.length) return [h("div", { class: "line dim" }, "NOTHING LEFT TO TRAIN")];
  if (!trainWho) return run.roster.filter((m) => who.includes(m.cls)).map((m) => {
    const es = entries.filter((e) => e.cls === m.cls);
    const learn = es.filter((e) => !e.up).length, up = es.filter((e) => e.up).length;
    return h("div", { class: "member wide", onClick: () => { trainWho = m.cls; redraw(); } }, faceEl(m.cls),
      h("div", { class: "stats" }, h("div", { class: "name" }, shortName(m.cls), h("span", { class: "dim small" }, run.party.includes(m.cls) ? " · PARTY" : " · CAMP")),
        h("div", { class: "small dim" }, [learn ? `${learn} TO LEARN` : "", up ? `${up} TO MAKE BETTER` : ""].filter(Boolean).join(" · "))),
      h("span", { class: "cursor" }, "▶"));
  });
  const m = member(run, trainWho);
  const k = c.classes.get(trainWho)!;
  const rows: Child[] = [h("div", { class: "line", style: "cursor:pointer", onClick: () => { trainWho = null; redraw(); } }, h("span", { class: "dim" }, "◀ "), faceEl(trainWho), h("span", { class: "hi grow" }, shortName(trainWho)))];
  for (const a of k.abilities) {
    const known = m.known.find((x) => x === a || x === `${a}_plus`);
    const es = entries.filter((e) => e.cls === trainWho && (e.ab === a || e.ab === known));
    if (!es.length) rows.push(h("div", { class: "ab dimmed" }, h("div", { class: "head" }, h("span", { class: "grow trunc" }, `${c.abilities.get(known ?? a)!.name.toUpperCase()}`), h("span", { class: "dim small" }, known?.endsWith("_plus") ? "DONE" : ""))));
    else rows.push(...es.map((e) => trainRow(run, e.cls, e.ab, e.label, e.onClick, e.up)));
  }
  rows.push(section("PASSIVE"), h("div", { class: "ab dimmed" }, h("div", { class: "head" }, h("span", { class: "grow trunc" }, (k.passive?.name ?? "Einherjar").toUpperCase()), h("span", { class: "dim small" }, "NO UPGRADES YET"))));
  return rows;
}
function trainRow(run: RogueRun, cls: string, ab: string, label: string, onClick: (() => void) | null, up = false): HTMLElement {
  const a = c.abilities.get(ab)!;
  return h("div", { class: "ab" },
    h("div", { class: "head" }, faceEl(cls), h("span", { class: "grow trunc" }, `${shortName(cls)}: ${a.name.toUpperCase()}${up ? "+" : ""}`), onClick ? button(label, onClick, "sm hi") : h("span", { class: "dim small" }, label)),
    h("div", { class: "body" }, up ? upText(ab, run, cls) : a.text, run.party.includes(cls) ? "" : " (at camp)"),
    up ? null : sizeEl(sizeParts(a, fighter(run, cls).stats)));
}

// ─── The campfire ──────────────────────────────────────────────────────────

/**
 * The campfire: one pick of REST, FOCUS, RAISE or TRAIN (two members, in the nested training screen). Step 5h: swaps live on
 * the party screen any time outside a fight, so the camp's SWAP tab is gone; a stranger at the fire can be taken in whatever
 * the pick.
 */
function campView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "campfire") return [];
  const k = rogue(c).config.campfire;
  const opts = options(c, run);
  const body: Child[] = [];
  // Round 6 (the director's): the share everyone got on arriving, then one pick of two, REST or TRAIN.
  if (k.auto) body.push(h("div", { class: "line small good wrap" }, `EVERYONE +${k.auto.hp}% HP AND +${k.auto.mp}% MP · THE FALLEN UP AT ${k.auto.revive}%`));
  if (p.used) body.push(h("div", { class: "line hi" }, "PICK MADE"));
  else if (k.auto) body.push(h("div", { class: "actions" },
    choice("REST", `EVERYONE +${k.hp}% HP AND MP MORE`, () => pickOrSave(run, "rest")),
    opts.includes("train") ? choice("TRAIN", `${k.train ?? 1} MEMBERS LEARN OR GET BETTER`, () => { trainWho = null; pickOrSave(run, "train"); }) : null));
  else body.push(h("div", { class: "actions" },
    choice("REST", `+${k.hp}% HP`, () => pickOrSave(run, "rest")),
    choice("FOCUS", `+${k.mp}% MP`, () => pickOrSave(run, "focus")),
    ...opts.filter((x) => x.startsWith("raise:")).map((o) => choice(`RAISE ${shortName(o.slice(6))}`, `${k.revive}% HP`, () => pickOrSave(run, o))),
    opts.includes("train") ? choice("TRAIN", `${k.train ?? 1} MEMBERS LEARN OR GET BETTER`, () => { trainWho = null; pickOrSave(run, "train"); }) : null));
  // The stranger: taken in, or (round 6) turned away for a lesson; neither uses the pick.
  const stranger = p.stranger ? win("roffer", h("div", { class: "line hi" }, "A STRANGER AT THE FIRE"), ...offerBody(run, p.stranger),
    h("div", { class: "btns" }, button("TAKE THEM IN", () => pickOrSave(run, "recruit"), opts.includes("recruit") ? "hi sm" : "sm"), opts.includes("lesson") ? button("A LESSON", () => { trainWho = null; pickOrSave(run, "lesson"); }, "sm") : null),
    opts.includes("recruit") ? null : h("div", { class: "line dim small" }, "ROSTER FULL: SEND SOMEONE HOME (PARTY)")) : null;
  // The camp at night, as the battle draws it between fights: the party at the fire, the fallen lying beside it.
  return [
    header("CAMPFIRE", () => go("home")),
    campEl(themeOf(run.region), run.party.map((cls) => ({ ref: cls, ko: member(run, cls).ko }))),
    partyStrip(run),
    win("scroll", ...body, stranger),
    actions(p.used ? button("LEAVE", () => pickOrSave(run, "leave"), "hi") : null, button("PARTY", () => go("rparty"))),
  ];
}
function row2(label: string, text: string, onClick: () => void): HTMLElement {
  return h("div", { class: "row", onClick, style: "min-height:3rem" }, h("span", { class: "cursor" }, "▶"), h("div", { class: "grow" }, h("div", { class: "hi" }, label), text ? h("div", { class: "text dim small wrap" }, text) : null));
}

// ─── Events ────────────────────────────────────────────────────────────────

function eventScreen(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "event") return [];
  // Step 5h: the version of the event met this time.
  const ev = eventOfRun(c, p);
  const opts = options(c, run);
  return [
    header(ev.name.toUpperCase(), () => go("home")),
    scene(run, `event:${p.id}`, { h: 96, actors: partyActors(run, 96, "walk", { cx: 135 }) }),
    partyStrip(run),
    win("", h("div", { class: "line" }, iconEl(ICON.event, 2)), h("div", { class: "text wrap" }, ev.text)),
    win("scroll list", ...(opts.includes("walk_on") ? [h("div", { class: "row", style: "min-height:3rem", onClick: () => pickOrSave(run, "walk_on") }, h("span", { class: "cursor" }, "▶"), h("div", { class: "grow" }, h("div", { class: "hi" }, "WALK ON")))] : []), ...ev.options.map((o) => {
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
  const title = p.what === "learn" ? "WHO LEARNS?" : p.what === "upgrade" ? "WHICH ABILITY?" : p.risk ? "WHICH PIECE? IT MAY CRACK" : p.from?.length === 1 && p.from[0] === "rare" ? "REFORGE WHICH?" : "TEMPER WHICH?";
  const rows: Child[] = p.what === "temper"
    ? opts.map((uid) => itemRow(run, itemOf(run, uid)!, () => pickOrSave(run, uid), { arrow: true }))
    : trainPicker(run, opts.map((o) => { const [cl, ab] = o.split(":"); return { cls: cl, ab, up: p.what === "upgrade", label: p.what === "learn" ? "LEARN" : "+", onClick: () => { trainWho = null; pickOrSave(run, o); } }; }));
  return [header(title, () => go("home")), win("scroll", ...rows)];
}

// ─── The Muster and the Drill ground (step 5h) ─────────────────────────────

let roomPick: number | null = null;
function roomView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "muster" && p.kind !== "drill") return [];
  const opts = options(c, run);
  if (roomPick !== null && (roomPick >= p.offers.length || !opts.includes(`take:${roomPick}`))) roomPick = null;
  const full = p.kind === "muster" && !opts.some((o) => o.startsWith("take:"));
  const cards = p.offers.map((o, i) => {
    const ok = opts.includes(`take:${i}`);
    const el = win(`roffer${roomPick === i ? " cur" : ""}${ok ? "" : " dimmed"}`, ...offerBody(run, o));
    el.addEventListener("click", () => { roomPick = i; redraw(); });
    return el;
  });
  const take = button(p.kind === "muster" ? "RECRUIT" : "TAKE", () => { if (roomPick !== null) { const i = roomPick; roomPick = null; pickOrSave(run, `take:${i}`); } }, "hi");
  take.disabled = roomPick === null;
  return [
    header(p.kind === "muster" ? "MUSTER" : "DRILL GROUND", () => go("home"), h("span", { class: "dim" }, p.kind === "muster" ? `ROSTER ${run.roster.length}/${rogue(c).config.party + seatsOf(c, run)}` : `${run.formations.length} OWNED`)),
    scene(run, `room:${p.kind}`, { h: 96, actors: [...partyActors(run, 96, "wait", { cx: 72 }), ...lootActors(run, p.offers, false, 96, 160, 248)] }),
    full ? h("div", { class: "line small bad wrap" }, "ROSTER FULL: SEND SOMEONE AT CAMP HOME FIRST (PARTY)") : null,
    win("scroll flat", h("div", { class: "section" }, "PICK ONE"), ...cards),
    actions(take, opts.includes("train") ? button("TRAIN TWO", () => { roomPick = null; trainWho = null; pickOrSave(run, "train"); }) : null, button("SKIP", () => { roomPick = null; pickOrSave(run, "skip"); }), button("PARTY", () => go("rparty"))),
  ];
}
/** Training: `left` more members each learn an ability or make one better, in the nested screen; DONE stops early. */
function trainView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "train") return [];
  const entries: TrainEntry[] = trainOptions(c, run, p.done).map((o) => { const [verb, cl, ab] = o.split(":"); return { cls: cl, ab, up: verb === "upgrade", label: verb === "upgrade" ? "+" : "LEARN", onClick: () => { trainWho = null; pickOrSave(run, o); } }; });
  return [
    header(p.why === "captive" || p.why === "stranger" ? "A LESSON" : "TRAINING", () => go("home"), h("span", { class: "dim" }, `${p.left} TO GO`)),
    win("scroll", ...trainPicker(run, entries)),
    // Round 6 (the director's: "you try to see what the available upgrades are and get locked in"): BACK to the room, its pick
    // unspent, until someone is trained.
    actions(options(c, run).includes("back") ? button("BACK", () => { trainWho = null; pickOrSave(run, "back"); }, "hi") : button("DONE", () => { trainWho = null; pickOrSave(run, "done"); }, "hi")),
  ];
}

// ─── Level up ──────────────────────────────────────────────────────────────

function levelView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "levelup") return [];
  const cls = p.queue[0];
  const m = member(run, cls);
  const opts = options(c, run);
  const learn = opts.filter((a) => unlearned(c, m).includes(a));
  const up = opts.filter((a) => !learn.includes(a) && a !== "gold");
  return [
    header("LEVEL UP", () => go("home"), h("span", { class: "dim" }, `${p.queue.length} TO GO`)),
    scene(run, `level:${cls}`, { h: 80, actors: [{ kind: "hero", ref: cls, x: 135, y: 74, pose: "victory", weapon: m.gear.weapon ?? undefined }], sparkle: { x: 135, y: 50, strip: "status1" } }),
    win("", classHead(cls)),
    win("scroll",
      learn.length ? section("LEARN") : null,
      ...learn.map((a) => h("div", { onClick: () => pickOrSave(run, a), style: "cursor:pointer" }, abilityBlock(c.abilities.get(a)!, fighter(run, cls).stats, setup.settings.designer))),
      up.length ? section("MAKE BETTER (+)") : null,
      ...up.map((a) => h("div", { onClick: () => pickOrSave(run, a), style: "cursor:pointer" }, trainRow(run, cls, a, "+", null, true))),
      opts.includes("gold") ? section("OR") : null,
      opts.includes("gold") ? row2(`${rogue(c).config.levelGold} GOLD`, "", () => pickOrSave(run, "gold")) : null),
  ];
}

// ─── The next region ───────────────────────────────────────────────────────

function regionView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "region") return [];
  // Round 6: a seat at camp comes with the new act.
  const by = rogue(c).config.benchByAct;
  const seats = by?.[Math.min(run.act + 1, by.length) - 1] ?? 0;
  return [
    header(`ACT ${ROMAN[run.act + 1]}`, () => go("home")),
    seats > seatsOf(c, run) ? h("div", { class: "line small hi wrap" }, iconEl(ICON.campfire), ` ROOM FOR ONE MORE AT CAMP: ${seats} SEATS`) : null,
    win("scroll flat", ...p.options.map((id) => {
      const r = rogue(c).regions.find((x) => x.id === id)!;
      // The boss this way is already set by the act's dice: shown with its moves, so the fork is a choice with its eyes open.
      const boss = actRoll(c, run, id, run.act + 1).boss;
      return [standoff(run, boss.enemies, `fork:${id}`, id, 112), win("roffer", h("div", { class: "line hi" }, r.name.toUpperCase()), h("div", { class: "text dim small wrap" }, r.text), h("div", { class: "line small" }, iconEl(ICON.boss), h("span", { class: "gold" }, `BOSS: ${boss.name.toUpperCase()}`)), ...foeLines(boss.enemies, bossFoes(c, run, { act: run.act + 1, region: id })), actions(button("GO THIS WAY", () => pickOrSave(run, id), "hi")))];
    })),
  ];
}

// ─── The end ───────────────────────────────────────────────────────────────

function overView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "over") return [];
  const won = p.won;
  return [
    header(won ? "VICTORY" : "THE RUN ENDS", null),
    scene(run, "over", { h: 112, night: !won, actors: partyActors(run, 112, won ? "victory" : "dead", { cx: 135 }) }),
    win("", h("div", { class: `line ${won ? "good" : "bad"}` }, won ? "ALL THREE ACTS CLEARED" : `FELL IN ACT ${ROMAN[run.act]}, FLOOR ${run.floor}`),
      h("div", { class: "line small dim wrap" }, `${run.stats.fights} FIGHTS · ${run.stats.elites} ELITES · ${run.stats.gold}G EARNED`),
      won ? h("div", { class: "line small hi wrap" }, `${run.party.map(shortName).join(", ")} CAN NOW LEAD A RUN`) : null),
    win("scroll", section("THE ROAD"), ...run.notes.map((n) => h("div", { class: "text small wrap" }, h("span", { class: "dim" }, `${ROMAN[n.act]}.${n.floor} `), n.text))),
    actions(button("DONE", () => { const r = endRun(); go("rogue"); if (r.won) cheer(r.unlocked, r.heat); }, "hi")),
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
    return h("div", { class: `win card${seatPick === i ? " cur" : ""}${manage && seatPick !== null && seatPick !== i ? " target" : ""}`, onClick: () => {
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
  // Step 5h: any time outside a fight. A party card picked, then someone at camp: they trade places.
  const picked = seatPick !== null ? run.party[seatPick] : null;
  const into = (cls: string) => { if (!picked) return; swap(c, run, picked, cls); seatPick = null; saveRogue(); go("rparty", undefined, true); };
  return [
    header("PARTY", () => { seatPick = null; go("rogue"); }, `ACT ${ROMAN[run.act]}`),
    win("", h("div", { class: "line" }, prev, h("span", { class: "grow center hi" }, f.name), nxt), h("div", { class: "text dim small wrap" }, f.text, f.statuses?.length ? ` ${f.statuses.map((s) => c.statuses.get(s)!.text).join(" ")}` : "")),
    h("div", { class: "cards" }, ...cards),
    supplyRow(run, () => go("rparty", undefined, true)),
    win("scroll",
      section("AT CAMP", `${camp.length}/${seatsOf(c, run)} SEATS`),
      camp.length ? null : h("div", { class: "line dim small" }, "NOBODY AT CAMP"),
      ...camp.map((cls) => {
        const v = vitals(run, cls);
        const stand = !manage ? null
          : picked ? button(`IN FOR ${shortName(picked)}`, (e?: Event) => { e?.stopPropagation(); into(cls); }, "sm hi")
          : run.party.length < rogue(c).config.party ? button("TAKE A SEAT", (e?: Event) => { e?.stopPropagation(); swap(c, run, cls, null); saveRogue(); go("rparty", undefined, true); }, "sm hi")
          : null;
        // MP reads first: it's what the bench is for.
        return h("div", { class: `member${picked ? " target" : ""}`, onClick: () => (picked ? into(cls) : go("runit", cls)) }, faceEl(cls),
          h("div", { class: "stats" }, h("div", { class: "name" }, shortName(cls)), v.maxMp ? bar(v.mp / v.maxMp, "mp") : null, v.ko ? h("div", { class: "bad" }, "KO") : bar(v.hp / v.maxHp)),
          stand ?? h("div", { class: "small dim" }, v.maxMp ? h("span", { class: "mp" }, `${disp(v.mp)}/${disp(v.maxMp)}`) : `${disp(v.hp)}/${disp(v.maxHp)}`));
      }),
      section("BAG", `${run.items.filter((it) => !wearer(run, it.uid)).length} PIECES`),
      ...run.items.filter((it) => !wearer(run, it.uid)).map((it) => itemRow(run, it, undefined, { right: manage ? button("DROP", (e?: Event) => { e?.stopPropagation(); confirm("DROP IT?", (c.gear.get(it.uid) ?? itemGear(c, it)).name.toUpperCase(), "DROP", () => { discard(run, it.uid); saveRogue(); go("rparty", undefined, true); }); }, "sm") : null })),
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
    else if (orderPick === i) { setOrder(run, cls, m.order.filter((_, j) => j !== i)); orderPick = null; saveRogue(); }
    else { const o = [...m.order]; [o[orderPick], o[i]] = [o[i], o[orderPick]]; setOrder(run, cls, o); orderPick = null; saveRogue(); }
    go("runit", cls, true);
  };
  // Known but left out of fights (a number tapped twice): tapped, it comes back in the last slot.
  const out = m.known.filter((a) => !m.order.includes(a));
  const bringBack = (a: string) => { if (!manage) return; setOrder(run, cls, [...m.order, a]); orderPick = null; saveRogue(); go("runit", cls, true); };
  const v = vitals(run, cls);
  // Step 5h: any time outside a fight, a party member can step back to camp, and one at camp can be sent home (never the leader).
  const inParty = run.party.includes(cls);
  const move = !manage ? null
    : inParty ? (run.party.length > 1 ? button("TO CAMP", () => { swap(c, run, cls, null); saveRogue(); go("rparty"); }, "sm") : null)
    : cls !== run.leader ? button("SEND HOME", () => confirm(`SEND ${shortName(cls)} HOME?`, "FOR GOOD. ITS GEAR STAYS IN THE BAG.", "SEND HOME", () => { dismiss(c, run, cls); saveRogue(); go("rparty"); }), "sm") : null;
  return [
    header(k.name, () => { orderPick = null; go("rparty"); }, inParty ? h("span", { class: "hi small" }, `SLOT ${run.party.indexOf(cls) + 1}`) : h("span", { class: "dim small" }, "AT CAMP")),
    move ? h("div", { class: "btns" }, move) : null,
    win("", classHead(cls, h("div", { class: "line small" }, v.ko ? h("span", { class: "bad" }, "KO") : h("span", null, `HP ${disp(v.hp)}/${disp(v.maxHp)}`), h("span", { class: "mp" }, `  MP ${disp(v.mp)}/${disp(v.maxMp)}`)))),
    win("", statGrid(fm.stats, k.stats, setup.settings.designer), sp.length ? h("div", { class: "text up small wrap", style: "margin-top:.25rem" }, ...sp.flatMap((s, i) => (i ? [" · ", s] : [s]))) : null),
    win("scroll",
      section("PASSIVE"),
      ...classPassive(cls),
      section("GEAR"),
      ...(["weapon", "armor", "amulet"] as const).map((s) => {
        const uid = m.gear[s];
        const it = uid ? itemOf(run, uid) : undefined;
        const open = manage ? () => go("rgear", { cls, slot: s }) : undefined;
        if (!it) return gearRow(null, s, fm.stats, open);
        return itemRow(run, it, open, { arrow: !!open, stats: fm.stats, right: h("span", { class: `small ${RARITY_CLASS[it.rarity]}` }, it.rarity === "common" ? "" : it.rarity.toUpperCase()) });
      }),
      canUse(cls),
      section("ABILITIES", manage && orderPick !== null ? h("span", { class: "hi" }, "SWAP · SAME: LEAVE OUT") : null),
      ...m.order.map((a, i) => abilityBlock(c.abilities.get(a)!, fm.stats, setup.settings.designer, { n: i + 1, onN: () => onN(i), cur: orderPick === i, target: orderPick !== null })),
      basicLine(weaponOf(c, fm.weapon), fm.stats),
      out.length ? section("LEFT OUT") : null,
      ...out.map((a) => { const el = abilityBlock(c.abilities.get(a)!, fm.stats, setup.settings.designer); el.classList.add("dimmed"); el.addEventListener("click", () => bringBack(a)); return el; }),
      locked.length ? section("NOT LEARNED YET") : null,
      ...locked.map((a) => { const el = abilityBlock(c.abilities.get(a)!, fm.stats, false); el.classList.add("dimmed"); return el; }),
    ),
  ];
}

/** A recruit on offer, as a sheet (round 6): its class, its passive, what it would join knowing, and what it could learn later. */
export function rclassScreen(arg?: unknown): Child[] {
  const { cls, known } = (arg as { cls: string; known: string[] }) ?? { cls: "", known: [] };
  if (!c.classes.has(cls)) return rogueScreen();
  const k = classOf(cls);
  const later = c.classes.get(cls)!.abilities.filter((a) => !known.includes(a));
  return [
    header(k.name, () => go("rogue")),
    win("scroll", classHead(cls), section("PASSIVE"), ...classPassive(cls), section("KNOWS"), ...known.map((a) => abilityBlock(c.abilities.get(a)!, k.stats, setup.settings.designer)),
      later.length ? section("LEARNS LATER") : null, ...later.map((a) => { const el = abilityBlock(c.abilities.get(a)!, k.stats, false); el.classList.add("dimmed"); return el; })),
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
  // Round 6 (the director's: "you keep accidentally equipping the gear that's on someone else"): what it wears now, then the
  // bag's pieces, then pieces someone else wears, dimmed under their face; taking one of those asks first.
  const worn = (it: Item) => { const w = wearer(run, it.uid); return w && w !== cls ? w : null; };
  const row = (it: Item) => {
    const w = worn(it);
    const r = itemRow(run, it, () => (w ? confirm(`TAKE IT FROM ${shortName(w)}?`, `${(c.gear.get(it.uid) ?? itemGear(c, it)).name.toUpperCase()} COMES OFF THE ${shortName(w)}.`, "TAKE IT", () => pick(it.uid)) : pick(it.uid)), { stats: fm.stats, right: w ? h("span", { class: "tag" }, faceEl(w), ` ${shortName(w)}`) : null });
    if (it.uid === cur) r.classList.add("equipped");
    if (w) r.classList.add("dimmed");
    return r;
  };
  const mine = fits.filter((it) => it.uid === cur), free = fits.filter((it) => !wearer(run, it.uid)), others = fits.filter((it) => worn(it));
  return [
    header(`${shortName(cls)} · ${slot.toUpperCase()}`, () => go("runit", cls)),
    win("list scroll",
      slot !== "weapon" ? h("div", { class: `gear-row${!cur ? " equipped" : ""}`, onClick: () => pick(null) }, h("span", { class: "art" }, ""), h("div", { class: "grow" }, h("div", { class: "line" }, h("span", { class: "dim grow" }, "NOTHING")))) : null,
      ...mine.map(row),
      free.length ? section("IN THE BAG") : null,
      ...free.map(row),
      others.length ? section("WORN BY OTHERS") : null,
      ...others.map(row),
    ),
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
  const cards: Child[][] = [[h("div", { class: "cele-top" }, "VICTORY!")]];
  for (const id of unlocked) cards.push([h("div", { class: "cele-top" }, "NEW LEADER!"), h("div", { class: "cele-art" }, faceEl(id, 2), actorEl(id, "victory", 2)), h("div", { class: "cele-name" }, classOf(id).name)]);
  if (heat) cards.push([h("div", { class: "cele-top" }, "HEAT RISES"), h("div", { class: "cele-name" }, `HEAT ${meta().maxHeat}`), h("div", { class: "line center-line dim" }, `FOES +${meta().maxHeat * rogue(c).config.heat.per}%`)]);
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
