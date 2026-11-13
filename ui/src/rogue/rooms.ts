/**
 * The rooms and what they offer: spoils, a boss's boon and a chest, a captive, the shop and its training, the campfire,
 * events, choices (learn, upgrade, temper), the Muster and the Drill ground, a level-up, the next region.
 */
import { actRoll, bagRoom, bossFoes, eventView as eventOfRun, formOf, improveOptions, type Item, itemOf, learnOptions, member, type Member, options, parseTraining, passiveOf, rogue, type RogueRun, seatsOf, sellPrice, type Trained, type Training, trainingId, trainOptions, trainPrice, upgradeOf, wearer } from "../../../src/rogue.js";
import { button, type Child, h, header, win } from "../dom.js";
import { c, disp, shortName } from "../content.js";
import { faceEl, iconEl } from "../pixel.js";
import { fighter } from "./state.js";
import { abilityBlock, classHead, section, sizeEl, tk } from "../sheet.js";
import { setup } from "../state.js";
import { abilityInfo, heldParts, sizeParts, sizeText, type Stats } from "../describe.js";
import type { AbilityT } from "../../../src/schema.js";
import { campEl, themeOf } from "../battle/scene.js";
import { actions, choice, go, gold, ICON, itemRow, junkRow, lootActors, offerBody, partyActors, partyStrip, pickOrSave, redraw, ROMAN, scene, standoff, trainWord } from "./parts.js";
import { foeLines } from "./run.js";

// ─── Spoils, the boss's boon, a chest ──────────────────────────────────────

let rewardPick: number | null = null;
export function rewardView(run: RogueRun): Child[] {
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
    ? scene(run, "chest", { h: 96, actors: [...partyActors(run, 96, "wait", { cx: 96 }), { kind: "chest", x: 196, y: 88, color: "gold" }], openAt: 500, sparkle: { x: 196, y: 74, strip: "gleam_gold" } })
    : scene(run, `spoils:${p.kind}`, { h: 96, actors: [...partyActors(run, 96, "victory", { cx: 72 }), ...lootActors(run, [...(p.kind === "spoils" && p.trophy ? [{ kind: "gear" as const, item: p.trophy }] : []), ...offers], p.kind === "spoils" && p.gold > 0, 96, 160, 248)], sparkle: { x: 204, y: 70, strip: "gleam_gold" } });
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

// ─── A captive ──────────────────────────────────────────────────────────────

/** A captive freed from the fight: taken in (hurt), a lesson for one member, or let go; on top of the spoils. */
export function captiveView(run: RogueRun): Child[] {
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
export function shopView(run: RogueRun): Child[] {
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
      ...(p.learn ? learnOptions(c, run).map((o) => ({ opt: `learn:${o}`, label: `LEARN ${lp}G`, onClick: opts.includes(`learn:${o}`) ? () => pickOrSave(run, `learn:${o}`) : null })) : []),
      ...(p.upgrade ? improveOptions(c, run).map((o) => ({ opt: o, label: `${trainWord(o)} ${up}G`, onClick: opts.includes(o) ? () => pickOrSave(run, o) : null })) : []),
    ];
    list.push(...trainPicker(run, entries));
  } else {
    // Junk first, under its own heading, with a button that sells it all; then the rest of the bag.
    const items = run.items.filter((it) => !wearer(run, it.uid));
    const junked = items.filter((it) => it.junk), kept = items.filter((it) => !it.junk);
    const sell = (it: Item) => button(`SELL ${sellPrice(c, it)}G`, () => pickOrSave(run, `sell:${it.uid}`), "sm");
    if (!items.length) list.push(h("div", { class: "line dim" }, "NOTHING IN THE BAG"));
    if (junked.length) {
      const all = junked.reduce((n, it) => n + sellPrice(c, it), 0);
      list.push(section("JUNK", `${junked.length} PIECE${junked.length === 1 ? "" : "S"}`), h("div", { class: "btns" }, button(`SELL ALL JUNK ${all}G`, () => pickOrSave(run, "sell-junk"), "hi sm")));
      for (const it of junked) list.push(junkRow(run, it, undefined, sell(it)));
      if (kept.length) list.push(section("THE BAG"));
    }
    for (const it of kept) list.push(itemRow(run, it, undefined, { right: sell(it) }));
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
/**
 * One thing training can do (learn an ability, or a power step or a version), as its option's id, with its button's
 * label; `onClick` null shows the label without a button (the shop, short of gold).
 */
type TrainEntry = { opt: string; label: string; onClick: (() => void) | null };
/**
 * Training in two levels, the same everywhere it happens
 * (the campfire's TRAIN, events, lessons, the drill, the shop). First the roster, each member with how many things it can
 * learn or train; then that member's training (`trainMember`). A level-up has one member and opens on it.
 */
let trainWho: string | null = null;
function trainPicker(run: RogueRun, entries: TrainEntry[]): Child[] {
  const es = entries.map((e) => ({ ...e, t: parseTraining(e.opt) })).filter((e): e is TrainEntry & { t: Training } => !!e.t);
  const who = [...new Set(es.map((e) => e.t.cls))];
  if (trainWho && !who.includes(trainWho)) trainWho = null;
  if (!who.length) return [h("div", { class: "line dim" }, "NOTHING LEFT TO TRAIN")];
  if (!trainWho) return run.roster.filter((m) => who.includes(m.cls)).map((m) => {
    const mine = es.filter((e) => e.t.cls === m.cls);
    const learn = mine.filter((e) => e.t.verb === "learn").length, up = mine.length - learn;
    return h("div", { class: "member wide", onClick: () => { trainWho = m.cls; redraw(); } }, faceEl(m.cls),
      h("div", { class: "stats" }, h("div", { class: "name" }, shortName(m.cls), h("span", { class: "dim small" }, run.party.includes(m.cls) ? " · PARTY" : " · CAMP")),
        h("div", { class: "small dim" }, [learn ? `${learn} TO LEARN` : "", up ? `${up} TO TRAIN` : ""].filter(Boolean).join(" · "))),
      h("span", { class: "cursor" }, "▶"));
  });
  return [
    h("div", { class: "line", style: "cursor:pointer", onClick: () => { trainWho = null; redraw(); } }, h("span", { class: "dim" }, "◀ "), faceEl(trainWho), h("span", { class: "hi grow" }, shortName(trainWho))),
    ...trainMember(run, trainWho, entries),
  ];
}
/**
 * One member's training. Each of its class's abilities in order, then its passive, under its name as it plays now
 * (a version's name; "+" once it has the power step), with everything that can be done to it as a card: LEARN for an
 * ability not known yet (the ability's own card); the power step (+) and versions A and B, each with the upgrade's own card
 * and, for an ability, the numbers it changes for this member. What this opportunity offers has its button; what's taken
 * says TAKEN; the rest is dimmed (the other version once one is taken, the upgrades of an ability not learned yet).
 */
function trainMember(run: RogueRun, cls: string, entries: TrainEntry[]): Child[] {
  const m = member(run, cls);
  const k = c.classes.get(cls)!;
  const stats = fighter(run, cls).stats;
  const by = new Map(entries.map((e) => [e.opt, e]));
  const out: Child[] = [];
  for (const a of k.abilities) {
    const known = m.known.includes(a);
    const now = c.abilities.get(formOf(m, a)) ?? c.abilities.get(a)!;
    out.push(section(now.name.toUpperCase(), known ? null : "NOT LEARNED"));
    if (!known) {
      const e = by.get(trainingId({ verb: "learn", cls, id: a }));
      const el = abilityBlock(c.abilities.get(a)!, stats);
      el.querySelector(".head")?.append(trainButton(e, false) ?? "");
      if (!e) el.classList.add("dimmed");
      out.push(el);
    }
    if (upgradeOf(c, a)) out.push(...upgradeCards(m, a, known ? stats : null, by));
  }
  const pid = passiveOf(c, cls);
  const pform = pid ? formOf(m, pid) : undefined;
  const pname = (pid && pform !== pid ? c.statuses.get(pform!)?.name : undefined) ?? k.passive?.name ?? (pid ? c.statuses.get(pid)?.name : undefined) ?? "";
  out.push(section(pname.toUpperCase(), "PASSIVE"));
  if (pid) out.push(...upgradeCards(m, pid, stats, by));
  return out;
}
/** A training card's right end: its button, its price while it can't be bought, or TAKEN. */
const trainButton = (e: TrainEntry | undefined, taken: boolean): HTMLElement | null =>
  taken ? h("span", { class: "hi small" }, "TAKEN") : e ? (e.onClick ? button(e.label, e.onClick, "sm hi") : h("span", { class: "dim small" }, e.label)) : null;
/**
 * The power step and the two versions of an ability or a passive, as cards: a chip (+, A, B), the name of the form it leads
 * to, the upgrade's own text, and with `stats` (an ability the member knows, or the passive) what it changes in this
 * member's numbers.
 */
function upgradeCards(m: Member, id: string, stats: Stats | null, by: Map<string, TrainEntry>): HTMLElement[] {
  const u = upgradeOf(c, id)!;
  const was: Trained = m.trained?.[id] ?? {};
  const ability = u.kind === "ability";
  const nameOf = (form: string) => (ability ? c.abilities.get(form)?.name : c.statuses.get(form)?.name) ?? form;
  const after = (t: Trained) => formOf({ ...m, trained: { ...(m.trained ?? {}), [id]: t } }, id);
  const now = formOf(m, id);
  const cards: { chip: string; t: Training; text: string; taken: boolean; form: string }[] = [
    { chip: "+", t: { verb: "power", cls: m.cls, id }, text: u.power, taken: !!was.power, form: after({ ...was, power: true }) },
    { chip: "A", t: { verb: "version", cls: m.cls, id, version: "a" }, text: u.a.text, taken: was.version === "a", form: after({ ...was, version: "a" }) },
    { chip: "B", t: { verb: "version", cls: m.cls, id, version: "b" }, text: u.b.text, taken: was.version === "b", form: after({ ...was, version: "b" }) },
  ];
  return cards.map(({ chip, t, text, taken, form }) => {
    const e = by.get(trainingId(t));
    // An ability's form shows what changes in its numbers; a passive's, the stacks it lays for this member.
    const nums = !e || !stats || taken || form === now ? [] : ability ? changeLines(c.abilities.get(now)!, c.abilities.get(form)!, stats) : [passiveSize(form, stats)];
    // An ability not learned yet shows what it can become by name only; its cards open once it's known.
    return h("div", { class: `ab${!e && !taken ? " dimmed" : ""}` },
      h("div", { class: "head" }, h("span", { class: `chip${taken ? " on" : ""}` }, chip), h("span", { class: `grow trunc${e ? " hi" : ""}` }, nameOf(form).toUpperCase()), trainButton(e, taken)),
      ability && !m.known.includes(id) ? null : h("div", { class: "body" }, text), ...nums);
  });
}
/** A passive form's stacks for this member, as "→ 5 CHILL (ATK)". */
function passiveSize(form: string, stats: Stats): HTMLElement | null {
  const el = sizeEl(heldParts([form], stats));
  el?.prepend(h("span", { class: "dim" }, "→ "));
  return el;
}
/** What an ability's form changes for this member: MP, cooldown and wind-up as "CD 28→21" (green better), then its new size. */
function changeLines(was: AbilityT, now: AbilityT, stats: Stats): Child[] {
  const a = abilityInfo(was, stats), b = abilityInfo(now, stats);
  const cmp = (label: string, x: number, y: number, show: (n: number) => string) =>
    show(x) !== show(y) ? h("span", { class: `nowrap ${y < x ? "good" : "bad"}` }, `${label} ${show(x)}→${show(y)}`) : null;
  const cost = [cmp("MP", a.mp ?? 0, b.mp ?? 0, (n) => String(disp(n))), cmp("CD", a.cooldown, b.cooldown, tk), cmp("CAST", a.cast, b.cast, tk)].filter(Boolean);
  const out: Child[] = cost.length ? [h("div", { class: "size changes" }, ...cost)] : [];
  const sizeWas = sizeText(sizeParts(was, stats)), sizeNow = sizeText(sizeParts(now, stats));
  if (sizeNow && sizeNow !== sizeWas) {
    const el = sizeEl(sizeParts(now, stats));
    el?.prepend(h("span", { class: "dim" }, "→ "));
    out.push(el);
  }
  return out;
}

// ─── The campfire ──────────────────────────────────────────────────────────

/**
 * The campfire: one pick of REST, FOCUS, RAISE or TRAIN (three members, in the nested training screen). Swaps are on the
 * party screen, not here; a stranger at the fire can be taken in whatever the pick.
 */
export function campView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "campfire") return [];
  const k = rogue(c).config.campfire;
  const opts = options(c, run);
  const body: Child[] = [];
  // The share everyone got on arriving, then one pick of two, REST or TRAIN.
  if (k.auto) body.push(h("div", { class: "line small good wrap" }, `EVERYONE +${k.auto.hp}% HP AND +${k.auto.mp}% MP · THE FALLEN UP AT ${k.auto.revive}%`));
  if (p.used) body.push(h("div", { class: "line hi" }, "PICK MADE"));
  else if (k.auto) body.push(h("div", { class: "actions" },
    choice("REST", `EVERYONE +${k.hp}% HP AND MP MORE`, () => pickOrSave(run, "rest")),
    opts.includes("train") ? choice("TRAIN", `${k.train ?? 1} MEMBERS LEARN OR TRAIN`, () => { trainWho = null; pickOrSave(run, "train"); }) : null));
  else body.push(h("div", { class: "actions" },
    choice("REST", `+${k.hp}% HP`, () => pickOrSave(run, "rest")),
    choice("FOCUS", `+${k.mp}% MP`, () => pickOrSave(run, "focus")),
    ...opts.filter((x) => x.startsWith("raise:")).map((o) => choice(`RAISE ${shortName(o.slice(6))}`, `${k.revive}% HP`, () => pickOrSave(run, o))),
    opts.includes("train") ? choice("TRAIN", `${k.train ?? 1} MEMBERS LEARN OR TRAIN`, () => { trainWho = null; pickOrSave(run, "train"); }) : null));
  // The stranger: taken in, or turned away for a lesson; neither uses the pick.
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

export function eventScreen(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "event") return [];
  // The version of the event met this time.
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

export function chooseView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "choose") return [];
  const opts = options(c, run);
  const title = p.what === "learn" ? "WHO LEARNS?" : p.what === "upgrade" ? "WHO TRAINS?" :p.risk ? "WHICH PIECE? IT MAY CRACK" : p.from?.length === 1 && p.from[0] === "rare" ? "REFORGE WHICH?" : "TEMPER WHICH?";
  const rows: Child[] = p.what === "temper"
    ? opts.map((uid) => itemRow(run, itemOf(run, uid)!, () => pickOrSave(run, uid), { arrow: true }))
    : trainPicker(run, opts.map((o) => { const opt = p.what === "learn" ? `learn:${o}` : o; return { opt, label: trainWord(opt), onClick: () => { trainWho = null; pickOrSave(run, o); } }; }));
  return [header(title, () => go("home")), win("scroll", ...rows)];
}

// ─── The Muster and the Drill ground ───────────────────────────────────────

let roomPick: number | null = null;
export function roomView(run: RogueRun): Child[] {
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
    actions(take, opts.includes("train") ? button(`TRAIN ${rogue(c).config.drill?.train ?? 3}`, () => { roomPick = null; trainWho = null; pickOrSave(run, "train"); }) : null, button("SKIP", () => { roomPick = null; pickOrSave(run, "skip"); }), button("PARTY", () => go("rparty"))),
  ];
}
/** Training: `left` more members each learn an ability or make one better, in the nested screen; DONE stops early. */
export function trainView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "train") return [];
  const entries: TrainEntry[] = trainOptions(c, run, p.done).map((o) => ({ opt: o, label: trainWord(o), onClick: () => { trainWho = null; pickOrSave(run, o); } }));
  return [
    header(p.why === "captive" || p.why === "stranger" ? "A LESSON" : "TRAINING", () => go("home"), h("span", { class: "dim" }, `${p.left} TO GO`)),
    win("scroll", ...trainPicker(run, entries)),
    // BACK to the room, its pick unspent, until someone is trained, so looking at the upgrades doesn't lock the player in.
    actions(options(c, run).includes("back") ? button("BACK", () => { trainWho = null; pickOrSave(run, "back"); }, "hi") : button("DONE", () => { trainWho = null; pickOrSave(run, "done"); }, "hi")),
  ];
}

// ─── Level up ──────────────────────────────────────────────────────────────

export function levelView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "levelup") return [];
  const cls = p.queue[0];
  const m = member(run, cls);
  const opts = options(c, run);
  // The options are trainings (learn, a power step, a version) for this one member, in the training screen, or gold.
  const entries: TrainEntry[] = opts.filter((o) => o !== "gold").map((o) => ({ opt: o, label: trainWord(o), onClick: () => pickOrSave(run, o) }));
  return [
    header("LEVEL UP", () => go("home"), h("span", { class: "dim" }, `${p.queue.length} TO GO`)),
    scene(run, `level:${cls}`, { h: 80, actors: [{ kind: "hero", ref: cls, x: 135, y: 74, pose: "victory", weapon: m.gear.weapon ?? undefined }], sparkle: { x: 135, y: 50, strip: "restore" } }),
    win("", classHead(cls, undefined, m.gear.weapon)),
    win("scroll",
      ...trainMember(run, cls, entries),
      opts.includes("gold") ? section("OR") : null,
      opts.includes("gold") ? row2(`${rogue(c).config.levelGold} GOLD`, "", () => pickOrSave(run, "gold")) : null),
  ];
}

// ─── The next region ───────────────────────────────────────────────────────

export function regionView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "region") return [];
  // A seat at camp comes with the new act.
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
