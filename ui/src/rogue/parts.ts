/**
 * What every rogue screen shares: the navigation screens.ts hands over, small parts (item rows, an offer's body, the
 * party strip, a confirm), and the scenes: each moment of the run drawn in its region.
 */
import { bar, button, type Child, h, nav, toast, win } from "../dom.js";
import type { GearT, RogueNodeKindT } from "../../../src/schema.js";
import { type Cell, type Pose } from "../art.js";
import { bagRoom, bench, eventView, formationRarity, type Item, itemGear, member, type Offer, parseTraining, type Pending, rogue, type RogueRun, seatsOf, type Slot, wearer } from "../../../src/rogue.js";
import { c, cls as classOf, shortName } from "../content.js";
import { abilityBlock, gearRow, RARITY_TONE, role, seatLines, twoHanded } from "../sheet.js";
import { actionIcon16, canvasEl, faceEl, gearIconEl, gearIconOf, iconEl, iconOf, slotIconEl, weaponIcon } from "../pixel.js";
import { foeAt, foesOnStage, partyInLine, partyOnStage, type StageActor, stageEl, type StageOpts, themeOf, W } from "../battle/scene.js";
import { abilityTag } from "../describe.js";
import { fighter, saveRogue, vitals } from "./state.js";
import { canEquip } from "../../../src/validate.js";
import { choose } from "../../../src/rogue/record.js";
import { sfx } from "../battle/audio.js";

/** The screen's one big action, and the smaller ones beside it, at the bottom-centre. */
export const actions = (main: HTMLButtonElement | null, ...more: (HTMLButtonElement | null)[]) => {
  main?.classList.add("big");
  return h("div", { class: "actions" }, main, more.some(Boolean) ? h("div", { class: "btns even" }, ...more.map((b) => (b ? (b.classList.add("mid"), b) : null))) : null);
};
/** A choice as a big button: its word and, under it, what it does. */
export const choice = (label: string, sub: string, onClick: () => void) => button(h("span", { class: "big-label" }, label, sub ? h("span", { class: "sub" }, sub) : null), onClick, "hi big");

type Go = (s: string, arg?: unknown, keep?: boolean) => void;
export let go: Go = () => {};
export let frameEl: HTMLElement | null = null;
/** screens.ts hands over its navigation and frame. */
export function bindRogue(g: Go, frame: HTMLElement) {
  go = g;
  frameEl = frame;
}
export const redraw = () => go("rogue", undefined, true);

// ─── Small parts ───────────────────────────────────────────────────────────

export const ICON: Record<RogueNodeKindT, Cell> = { fight: [26, 7], elite: [10, 1], event: [10, 12], campfire: [13, 0], shop: [23, 11], treasure: [23, 15], boss: [18, 3], muster: [7, 5], drill: [23, 6] };
export const KIND_NAME: Record<RogueNodeKindT, string> = { fight: "FIGHT", elite: "ELITE", event: "EVENT", campfire: "CAMPFIRE", shop: "SHOP", treasure: "CHEST", boss: "BOSS", muster: "MUSTER", drill: "DRILL GROUND" };
/** What a room pays or offers, in a line. */
export const KIND_TEXT: Record<RogueNodeKindT, string> = {
  fight: "GOLD · SPOILS",
  elite: "MORE GOLD · PICK A LEGENDARY · PICK A FORMATION",
  event: "A CHOICE",
  campfire: "EVERYONE RECOVERS · THE FALLEN RISE · THEN REST OR TRAIN",
  shop: "GEAR · RECRUITS · TRAINING · SUPPLIES",
  treasure: "A RARE OR LEGENDARY PIECE, OR A CAGED RECRUIT · GOLD",
  boss: "THE ACT'S END · EVERYONE RESTORED AND LEARNS",
  muster: "PICK 1 OF 2 RECRUITS",
  drill: `PICK 1 OF 2 FORMATIONS, OR TRAIN ${rogue(c).config.drill?.train ?? 3}`,
};
// A potion heals one member, a tonic refills one member's MP.
export const SUPPLY_ICON: Record<string, Cell> = { potion: [21, 7], tonic: [20, 7], phoenix: [21, 14] };
export const SUPPLY_TEXT: Record<string, string> = { potion: "1 MEMBER +30% HP", tonic: "1 MEMBER +50% MP", phoenix: "A FALLEN MEMBER UP, 50% HP" };
export const held = (run: RogueRun, id: string) => run.supplies.filter((x) => x === id).length;
/** Mythic in crimson (offered in the boss's boons that open acts II and III). */
export const RARITY_CLASS = RARITY_TONE;
export const ROMAN = ["", "I", "II", "III", "IV"];
export const gold = (n: number) => h("span", { class: "gold" }, `${n}G`);

/** The roster, the party first: who a piece's card lists first among those who can wear it. */
const rosterOrder = (run: RogueRun) => [...run.party, ...bench(run)];
/**
 * A run's item as a gear card (its rarity, kind and numbers, `gearRow`), with who wears it at the right. With `who` (the
 * default), the line of who can wear it, the roster first; never what it's for, which would spoil the discovery. With
 * `wears` (an offer), the roster's faces beside what they wear in its slot now, under everything (`wearsLine`). The
 * stacks it lays are shown for its wearer, else the first of the roster who can wear it.
 */
export function itemRow(run: RogueRun, it: Item, onClick?: () => void, opts: { arrow?: boolean; stats?: Record<string, number> | null; right?: HTMLElement | null; who?: boolean; brief?: boolean; wears?: boolean } = {}): HTMLElement {
  const g = c.gear.get(it.uid) ?? itemGear(c, it);
  const by = wearer(run, it.uid) ?? rosterOrder(run).find((cls) => canEquip(classOf(cls), g));
  const r = gearRow(g, g.slot, opts.stats ?? (by ? fighter(run, by).stats : null), onClick, opts.arrow ?? false, opts.who === false || opts.brief ? undefined : rosterOrder(run), opts.brief);
  const wears = opts.wears ? wearsLine(run, g) : null;
  if (wears) r.querySelector(".grow")?.append(wears);
  const w = wearer(run, it.uid);
  const right = "right" in opts ? opts.right : w ? h("span", { class: "tag" }, shortName(w)) : null;
  if (right) r.querySelector(".grow .line")?.append(right);
  return r;
}
/** A piece marked junk: greyed, one short card (its name and codes), with `right` beside the name. */
export function junkRow(run: RogueRun, it: Item, onClick?: () => void, right: HTMLElement | null = null): HTMLElement {
  const r = itemRow(run, it, onClick, { right, brief: true });
  r.classList.add("junk");
  return r;
}
/**
 * What everyone in the roster who could wear a piece wears in its slot now, in one line (the party first, then camp):
 * each one's face beside the piece's icon in its rarity's glow, the slot's faded icon for an empty one (as the party
 * screen shows it), or 2H for an offhand under a two-handed weapon. Nothing when nobody in the roster could wear it.
 */
export function wearsLine(run: RogueRun, g: GearT): HTMLElement | null {
  const slot = g.slot as Slot;
  const mine = rosterOrder(run).filter((cls) => canEquip(classOf(cls), g));
  if (!mine.length) return null;
  return h("div", { class: "line wrap wears" }, ...mine.map((cls) => {
    const m = member(run, cls);
    const now = m.gear[slot] ? c.gear.get(m.gear[slot]!) : undefined;
    const glow = now?.rarity && now.rarity !== "common" ? ` glow-${now.rarity}` : "";
    const what = slot === "offhand" && twoHanded(m.gear) ? h("span", { class: "slot dim small" }, "2H")
      : now ? h("span", { class: `slot art${glow}` }, (now.slot === "weapon" ? smallWeapon(now.id) : null) ?? gearIconEl(now))
      : h("span", { class: "slot" }, slotIconEl(slot));
    return h("span", { class: "wear-of" }, faceEl(cls, 0.75), what);
  }));
}
/** A weapon's icon made to sit beside a face: at most 3.5 by 2.5 rem, never enlarged. */
function smallWeapon(id: string): HTMLCanvasElement | null {
  const cv = weaponIcon(id);
  return cv ? canvasEl(cv, Math.min(1, 28 / cv.width, 20 / cv.height), "weapon") : null;
}
/** A training's button: LEARN an ability, TRAIN a power step or a version. */
export const trainWord = (opt: string) => (parseTraining(opt)?.verb === "learn" ? "LEARN" : "TRAIN");
/** An offer as a card's body; a piece ends with what the roster who could wear it wear in its slot now. */
export function offerBody(run: RogueRun, o: Offer): Child[] {
  // A sealed piece shows only its slot; a bundle, its piece and its supply.
  if (o.kind === "gear" && o.sealed) {
    const g = c.gear.get(o.item.uid) ?? itemGear(c, o.item);
    return [h("div", { class: "line" }, iconEl(ICON.treasure), h("span", { class: "grow hi" }, `SEALED ${g.slot.toUpperCase()}`)), h("div", { class: "line small dim wrap" }, "RARE OR BETTER · SHOWN WHEN TAKEN")];
  }
  if (o.kind === "bundle") {
    return [h("div", { class: "line hi" }, "A BUNDLE"), itemRow(run, o.item, undefined, { right: null, wears: true }), h("div", { class: "line small" }, iconEl(SUPPLY_ICON[o.supply]), h("span", null, ` AND A ${o.supply.toUpperCase()}`), bagRoom(c, run, o.supply) ? null : h("span", { class: "dim" }, " (BAG FULL)"))];
  }
  if (o.kind === "gear") return [itemRow(run, o.item, undefined, { right: null, wears: true })];
  if (o.kind === "tome") {
    return [h("div", { class: "line" }, faceEl(o.cls), h("span", { class: "grow hi" }, `TOME: ${shortName(o.cls)} LEARNS`)), abilityBlock(c.abilities.get(o.ability)!, null)];
  }
  if (o.kind === "recruit") {
    const k = classOf(o.cls);
    const known = o.known ?? [];
    // A recruit's rarity is what it knows (one, two or all three), shown as the gear's rarity colours.
    const rar = known.length >= 3 ? "legendary" : known.length === 2 ? "rare" : "common";
    // A tap on the face opens the class with what this one knows.
    const face = h("span", { style: "cursor:pointer", onClick: (e?: Event) => { e?.stopPropagation(); go("rclass", { cls: o.cls, known }); } }, faceEl(o.cls));
    return [h("div", { class: "line" }, face, h("div", { class: "grow" }, h("div", { class: RARITY_CLASS[rar] ?? "hi" }, `RECRUIT: ${k.name.toUpperCase()}`), h("div", { class: "text dim small wrap" }, role(o.cls)))),
      h("div", { class: "line small wrap" }, h("span", { class: "dim" }, `KNOWS ${known.length}/3: `), known.map((a) => c.abilities.get(a)!.name.toUpperCase()).join(", ")),
      o.item ? itemRow(run, o.item, undefined, { right: h("span", { class: "dim small" }, "CARRIES"), who: false }) : null,
      run.party.length >= 3 ? h("div", { class: "line small dim" }, "JOINS AT CAMP") : null];
  }
  if (o.kind === "formation") {
    // A formation's rarity in the gear's colours (common, rare, legendary), and what each seat does.
    const f = c.formations.get(o.id)!;
    const rar = formationRarity(c, o.id);
    return [h("div", { class: "line wrap" }, h("span", { class: RARITY_CLASS[rar] ?? "hi" }, `${rar === "legendary" ? "★" : ""}FORMATION: ${f.name.toUpperCase()}`), rar !== "common" ? h("span", { class: `small r ${RARITY_CLASS[rar]}` }, rar.toUpperCase()) : null), h("div", { class: "text dim small wrap" }, f.text), ...seatLines(f)];
  }
  if (o.kind === "seat") return [h("div", { class: "line" }, iconEl(ICON.campfire), h("span", { class: "grow hi" }, "A SEAT AT CAMP")), h("div", { class: "line dim small wrap" }, `ROOM FOR 1 MORE IN THE ROSTER · ${seatsOf(c, run)} → ${seatsOf(c, run) + 1} AT CAMP`)];
  return [h("div", { class: "line" }, iconEl(SUPPLY_ICON[o.id]), h("span", { class: "grow" }, o.id.toUpperCase())), h("div", { class: "line dim small" }, SUPPLY_TEXT[o.id])];
}

// ─── Scenes: each moment of the run drawn in its region ───

/** When each moment began (a screen redraws on every tap; its scene carries on rather than starting over). */
const since = new Map<string, number>();
const t0 = (key: string) => { if (!since.has(key)) since.set(key, performance.now()); return since.get(key)!; };
/** The run's party on a stage `h` tall, in a pose, with their weapons; the fallen lie down. */
export function partyActors(run: RogueRun, h: number, pose: Pose = "wait", inLine?: { cx: number; gap?: number }): StageActor[] {
  const weapons = Object.fromEntries(run.party.map((cls) => [cls, member(run, cls).gear.weapon ?? undefined]));
  const p = { refs: run.party, weapons, formation: run.formation };
  return (inLine ? partyInLine(p, h, pose, inLine.cx, inLine.gap) : partyOnStage(p, h, pose)).map((a) => (a.kind === "hero" && member(run, a.ref).ko ? { ...a, pose: "dead" as Pose } : a));
}
/** A scene in the run's region (or `theme`), keyed so a redraw carries it on. */
export function scene(run: RogueRun, key: string, o: Omit<StageOpts, "theme" | "t0"> & { theme?: string }): HTMLCanvasElement {
  return stageEl({ ...o, theme: o.theme ?? themeOf(run.region), t0: t0(`${key}:${run.act}:${run.floor}`) });
}
/**
 * The spoils on the ground beside the party: a sack of gold, then what's on offer, each as its own art (a weapon's
 * sprite, a piece's icon, a tome's ability, a supply); a recruit stands among them, facing the party.
 */
export function lootActors(run: RogueRun, offers: Offer[], gold: boolean, h: number, x0: number, x1: number): StageActor[] {
  const cell = (k: readonly [number, number]) => iconOf(k[0], k[1]);
  const arts: (HTMLCanvasElement | string)[] = gold ? [cell(GOLD_SACK)] : [];
  for (const o of offers) {
    if (o.kind === "gear" && o.sealed) arts.push(cell(ICON.treasure));
    else if (o.kind === "gear" || o.kind === "bundle") {
      const g = c.gear.get(o.item.uid) ?? itemGear(c, o.item);
      arts.push((g.slot === "weapon" ? weaponIcon(g.id) : null) ?? gearIconOf(g));
    } else if (o.kind === "tome") arts.push(actionIcon16(abilityTag(c.abilities.get(o.ability)!), o.ability));
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
/** The party facing a fight's foes; with `onFoe`, tapping a foe on the field opens it (its sheet). */
export function standoff(run: RogueRun, enemies: string[], key: string, o: { theme?: string; h?: number; onFoe?: (ref: string) => void } = {}): HTMLCanvasElement {
  const ht = o.h ?? 136;
  const actors = [...partyActors(run, ht), ...foesOnStage(enemies, ht)];
  const cv = scene(run, key, { theme: o.theme, h: ht, actors });
  const onFoe = o.onFoe;
  if (onFoe) {
    cv.classList.add("tap");
    cv.addEventListener("click", (e) => {
      const r = cv.getBoundingClientRect();
      const ref = foeAt(actors, ((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * ht);
      if (ref) onFoe(ref);
    });
  }
  return cv;
}

/** The party at a glance: faces, HP and MP bars, KO; tap for the party screen. */
export function partyStrip(run: RogueRun, tap = true): HTMLElement {
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

/** An event's verbs whose result can't be seen when it's picked: a gamble, and a piece, a recruit or a formation rolled. */
const ROLLED = new Set(["chance", "gear", "recruit", "formation", "trade"]);
/** Whether a pick's result was hidden when it was made: an event option that rolls, a sealed piece, a tempering. */
function hidden(was: Pending, pick: string): boolean {
  if (was.kind === "event") return !!eventView(c, was).options.find((o) => o.id === pick)?.do.some((op) => ROLLED.has(op.op));
  if (was.kind === "spoils" || was.kind === "boon") { const o = was.offers[Number(pick.split(":")[1])]; return o?.kind === "gear" && !!o.sealed; }
  return was.kind === "choose" && was.what === "temper";
}
/**
 * Answers the run's decision, saves it and redraws. Only a result the player couldn't see when they picked (`hidden`) is
 * told, and it holds the screen it was chosen on until they've read it and go on. A pick that keeps its screen (a sale, a
 * rest, a training) confirms itself in a toast; any other already said what it does before it was picked.
 */
export function pickOrSave(run: RogueRun, pick: string) {
  const was = run.pending, unseen = hidden(was, pick), before = run.notes.length;
  const bases = new Map(run.items.map((it) => [it.uid, it.base]));
  choose(c, run, pick);
  saveRogue();
  sfx.tap();
  const news = run.notes.slice(before).map((n) => n.text).filter((t) => !/^(Took|Bought|Act )/.test(t));
  if (unseen && news.length && frameEl) return outcome(run, news, run.items.filter((it) => bases.get(it.uid) !== it.base && c.gear.get(it.base)?.source !== "starter"));
  redraw();
  if (news.length && frameEl && run.pending === was) toast(frameEl, news.join(" "), 2600);
}
/** A hidden result, over the screen it was picked on: each line of news and the card of each piece it brought or changed (not a recruit's plain weapon); ONWARD goes on. */
function outcome(run: RogueRun, news: string[], pieces: Item[]) {
  const onward = () => { box.remove(); nav.overlay = null; redraw(); };
  const box = h("div", { class: "overlay dialog" }, win("outcome",
    ...news.map((t) => h("div", { class: "line wrap hi" }, t)),
    ...pieces.map((it) => itemRow(run, it, undefined, { who: false })),
    actions(button("ONWARD", onward, "hi"))));
  frameEl!.append(box);
  nav.overlay = onward;
}

/** A question over the screen, with a yes and a cancel. */
export function confirm(title: string, text: string, yes: string, onYes: () => void) {
  if (!frameEl) return onYes();
  const box = h("div", { class: "overlay dialog" }, win("",
    h("div", { class: "line hi" }, title),
    h("div", { class: "text dim small wrap" }, text),
    h("div", { class: "btns", style: "margin-top:.75rem" }, button(yes, () => { box.remove(); onYes(); }, "hi"), button("CANCEL", () => box.remove())),
  ));
  frameEl.append(box);
}
