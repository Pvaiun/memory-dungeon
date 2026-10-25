/**
 * The menus. Each screen is its own layout: a header, windows, and lists that
 * scroll inside their own box (never the whole screen). `go` switches screens;
 * the battle screen is battle/battle.ts.
 */
import { gearFor as gearThatFits } from "../../src/sim/parties.js";
import { foesText, meets, needText, rewardsOf, unmet } from "../../src/campaign.js";
import { c, className, classes, cls as classOf, dungeons, enemies, fightName, formations, gearOf, kindOf, runName, setDisplayDiv, shortName } from "./content.js";
import { enemyDisplayName } from "./art.js";
import { button, h, header, nav, row, settleBack, win, type Child } from "./dom.js";
import { abilitiesFor, gearFor, party as partyLoadout, reset, resetJourneyLoadout, save, setup, useMode } from "./state.js";
import {
  anyNewClass, anyNewFormation, anyNewGear, cleared, currentIndex, hasJourney, markSeen, newClass, newFormation, newGear, newGearFor, newNode, nodes, onJourney,
  ownsClass, ownsFormation, ownsGear, resetJourney, setCleared,
} from "./journey.js";
import { celebrate } from "./celebrate.js";
import { abilityBlock, basicLine, classHead, codeSpans, enemySheet, gearRow, memberFor, passiveBlock, portraitEl, role, section, specialLines, statGrid } from "./sheet.js";
import { enemyEl, enemyThumb } from "./pixel.js";
import { weaponOf } from "../../src/engine/combat/fight.js";
import { Strip, STRIP_H } from "./battle/scene.js";
import { startBattle, type BattleArgs } from "./battle/battle.js";
import { music, setMusic, setSound, sfx } from "./battle/audio.js";

export type Screen = "home" | "journey" | "node" | "fight" | "party" | "formation" | "unit" | "gear" | "classes" | "bestiary" | "enemy" | "settings" | "battle";

let current: Screen = "home";
let currentArg: unknown;
let frame: HTMLElement;
let screenEl: HTMLElement | null = null;
let strip: Strip | null = null;
let stopBattle: (() => void) | null = null;

export function setTheme(name: string) {
  document.documentElement.dataset.theme = name;
  document.querySelector("meta[name=theme-color]")?.setAttribute("content", name === "day" ? "#cfd8bf" : "#0c1020");
}

export function mount(app: HTMLElement) {
  frame = h("div", { class: "frame" });
  app.append(frame);
  go("home");
}

export function go(s: Screen, arg?: unknown, keepScroll = false) {
  const scrolls = keepScroll && screenEl ? [...screenEl.querySelectorAll(".scroll")].map((el) => el.scrollTop) : [];
  stopBattle?.();
  stopBattle = null;
  strip?.stop();
  strip = null;
  if (s !== current || !keepScroll) sfx.tap();
  if (s === "party" && current !== "party") (pickSlot = null), (pickClass = null);
  if (s === "party" && (current === "home" || current === "node")) partyFrom = [current, currentArg];
  if (s === "unit" && (current === "party" || current === "classes")) unitFrom = current;
  nav.back = null;
  nav.overlay = null;
  current = s;
  currentArg = arg;
  music.play(s === "battle" ? "battle" : "menu");
  frame.querySelectorAll(".overlay").forEach((o) => o.remove());
  screenEl?.remove();
  screenEl = h("div", { class: `screen ${s}${s === "battle" ? " tight" : ""}` });
  frame.append(screenEl);
  if (s === "battle") {
    stopBattle = startBattle(frame, screenEl, arg as BattleArgs);
    return;
  }
  const screens: Record<Exclude<Screen, "battle">, (arg?: unknown) => Child[]> = { home, journey, node, fight, party, formation, unit, gear, classes: classesScreen, bestiary, enemy, settings };
  screenEl.append(...(screens[s](arg).filter(Boolean) as Node[]));
  settleBack();
  [...screenEl.querySelectorAll(".scroll")].forEach((el, i) => { if (scrolls[i]) el.scrollTop = scrolls[i]; });
}
/** Re-renders the current screen after a change, keeping the lists' scroll. */
export const refresh = () => go(current, currentArg, true);

/** A small gold NEW tag, on things the journey gave that haven't been looked at. */
export const newTag = () => h("span", { class: "new" }, "NEW");
/** "13 more to find": what the journey still holds, at the end of a list. */
const moreToFind = (n: number) => (n > 0 ? h("div", { class: "line dim small more" }, h("span", { class: "trunc" }, `${n} MORE TO FIND ON THE JOURNEY`)) : null);

/** A question over the screen, with a yes and a cancel. */
function ask(title: string, text: string, yes: string, onYes: () => void) {
  const close = () => { box.remove(); nav.overlay = null; };
  const box = h("div", { class: "overlay dialog" }, win("",
    h("div", { class: "line hi" }, title),
    h("div", { class: "text dim small wrap" }, text),
    h("div", { class: "btns", style: "margin-top:.75rem" }, button(yes, () => { close(); onYes(); }, "hi"), button("CANCEL", close)),
  ));
  frame.append(box);
  nav.overlay = close;
}

function stripEl(pick: number | null = null): HTMLCanvasElement {
  const cv = h("canvas", { class: "strip" });
  cv.style.height = `${STRIP_H / 8}rem`;
  strip = new Strip(cv, setup.party, setup.formation, Object.fromEntries(setup.party.map((id) => [id, gearFor(id).weapon])), pick).start();
  return cv;
}
const seedRow = () => h("div", { class: "line" }, h("span", { class: "dim" }, "SEED"), h("span", { class: "grow" }, String(setup.seed)), button("NEW SEED", () => { setup.seed = Math.floor(Math.random() * 100000) + 1; save(); refresh(); }, "sm"));

// ─── Home ───
function home(): Child[] {
  const cur = currentIndex();
  const owned = classes.filter((k) => ownsClass(k.id)).length;
  // In the journey the first item is the road, with the next node's name; free play keeps FIGHT. NEW marks what holds something unseen.
  const items: [Screen, string, string, boolean][] = [
    onJourney() ? ["journey", "JOURNEY", cur === null ? "Complete" : `${cur + 1}. ${nodes()[cur].name}`, cur !== null && newNode(nodes()[cur].id)] : ["fight", "FIGHT", "Runs, and single fights", false],
    ["party", "PARTY", "Who goes, and what they carry", anyNewClass() || anyNewFormation() || anyNewGear()],
    ["classes", "CLASSES", onJourney() ? `${owned} of ${classes.length} found` : `The ${classes.length} classes`, anyNewClass() || anyNewGear()],
    ["bestiary", "BESTIARY", "Every enemy", false],
    ["settings", "SETTINGS", "Theme, speed, sound, music", false],
  ];
  const f = c.formations.get(setup.formation)!;
  return [
    h("div", { class: "title-big" }, "MEMORY", h("br"), "DUNGEON"),
    stripEl(),
    h("div", { class: "menu-wrap" },
      win("list menu", ...items.map(([s, label, sub, isNew]) => h("div", { class: "row", onClick: () => go(s) }, h("span", { class: "cursor" }, "▶"), h("div", { class: "grow" }, h("div", { class: "line" }, label, isNew ? newTag() : null), h("div", { class: "text dim small trunc" }, sub))))),
      h("div", { class: "line dim small", style: "margin-top:.5rem" }, h("span", { class: "trunc grow" }, setup.party.map(shortName).join(" · ") || "NO PARTY"), h("span", null, `SEED ${setup.seed}`)),
      h("div", { class: "line dim small" }, h("span", { class: "trunc grow" }, f.name)),
    ),
  ];
}

// ─── Journey: the road, one node at a time ───
const KIND: Record<string, [string, string]> = { dungeon: ["RUN", "dim"], remix: ["REMIX", "buff"], trial: ["TRIAL", "debuff"] };
const kindTag = (kind: string) => h("span", { class: KIND[kind]?.[1] ?? "dim" }, KIND[kind]?.[0] ?? kind.toUpperCase());
/** A run's fights as rows: number, ★ for the boss, name, then its foes ("Shield Knight, Centaur Archer ×2"); tap one to play it alone. */
function fightRows(dungeonId: string, onFight: (stageId: string) => void): HTMLElement[] {
  const d = c.dungeons.get(dungeonId)!;
  const foesOf = (enemiesIn: string[]) => {
    const counts = new Map<string, number>();
    for (const e of enemiesIn) counts.set(e, (counts.get(e) ?? 0) + 1);
    return [...counts].map(([e, n]) => `${enemyDisplayName(e)}${n > 1 ? ` ×${n}` : ""}`).join(", ");
  };
  return d.stages.flatMap((s) => (s.kind === "fight" ? [s] : [])).map((s, i) => h("div", { class: "row", style: "min-height:3rem", onClick: () => onFight(s.id) },
    h("span", { class: "cursor" }, ""), h("div", { class: "grow trunc" }, h("div", { class: "line" }, h("span", { class: s.boss ? "gold" : "" }, `${i + 1} ${s.boss ? "★" : ""}${fightName(s)}`)), h("div", { class: "text dim small trunc" }, foesOf(s.enemies)))));
}

function journey(): Child[] {
  if (!onJourney()) return home();
  const ns = nodes();
  const done = cleared();
  let curRow: HTMLElement | null = null;
  const list = win("list scroll", ...ns.map((n, i) => {
    // Locked nodes show only their number: the road's length, not what's on it.
    if (i > done) return h("div", { class: "row static dim" }, h("span", { class: "cursor" }, ""), h("span", { class: "grow" }, `${i + 1} ???`));
    const cur = i === done;
    const el = h("div", { class: `row${cur ? " cur" : " done"}`, style: "min-height:3rem", onClick: () => go("node", n.id) },
      h("span", { class: `cursor${cur ? "" : " good"}` }, cur ? "▶" : "√"),
      h("div", { class: "grow trunc" },
        h("div", { class: "line" }, h("span", { class: "trunc" }, `${i + 1} ${n.name}`), newNode(n.id) ? newTag() : null, h("span", { class: "r" }, kindTag(n.kind))),
        h("div", { class: "text dim small trunc" }, n.text)),
    );
    if (cur) curRow = el;
    return el;
  }));
  // Open on the current node.
  requestAnimationFrame(() => { if (curRow && list.isConnected) list.scrollTop += curRow.getBoundingClientRect().top - list.getBoundingClientRect().top - list.clientHeight / 3; });
  return [
    header("JOURNEY", () => go("home"), done >= ns.length ? "COMPLETE" : `${done}/${ns.length}`),
    list,
    h("div", { class: "text dim small wrap" }, "Clear a run (win every fight) to get its reward and open the next. Cleared runs can be replayed; replays pay nothing."),
  ];
}

/** What a node pays, as a teaser: "NEW CLASS · NEW FORMATION · 3 GEAR". */
function teaser(i: number): string {
  const r = rewardsOf(c, i);
  const parts = [
    r.classes.length ? (r.classes.length > 1 ? `${r.classes.length} NEW CLASSES` : "NEW CLASS") : "",
    r.formations.length ? (r.formations.length > 1 ? `${r.formations.length} NEW FORMATIONS` : "NEW FORMATION") : "",
    r.gear.length ? `${r.gear.length} GEAR` : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "NOTHING";
}

function node(arg?: unknown): Child[] {
  const ns = nodes();
  const i = ns.findIndex((n) => n.id === arg);
  if (!onJourney() || i < 0 || i > cleared()) return journey();
  const n = ns[i];
  const d = c.dungeons.get(n.dungeon);
  if (!d) return [header(n.name, () => go("journey")), win("text", `No run '${n.dungeon}' in the content.`)];
  markSeen("nodes", n.id);
  const done = i < cleared();
  const p = partyLoadout();
  const missing = unmet(c, n, p);
  const foes = foesText(d);
  const r = rewardsOf(c, i);
  const start = button("START", () => go("battle", { dungeon: d.id, node: n.id }), "hi");
  start.disabled = missing.length > 0;
  const f = c.formations.get(setup.formation)!;
  return [
    header(`${i + 1} ${n.name}`, () => go("journey"), kindTag(n.kind)),
    win("scroll",
      done ? h("div", { class: "line good" }, "√ CLEARED", h("span", { class: "dim r small" }, "REPLAYS PAY NOTHING")) : null,
      h("div", { class: "text wrap small" }, n.text),
      foes ? h("div", { class: "text wrap small debuff", style: "margin-top:.25rem" }, foes) : null,
      n.needs.length ? section("NEEDS", "from the party") : null,
      ...n.needs.map((nd) => {
        const ok = meets(c, nd, p);
        return h("div", { class: `line wrap ${ok ? "good" : "bad"}` }, h("span", null, ok ? "√" : "×"), h("span", { class: "text grow" }, needText(c, nd)));
      }),
      section("FIGHTS", "tap one to practise"),
      ...fightRows(d.id, (sid) => go("battle", { dungeon: `${d.id}~${sid}`, node: n.id })),
      section(done ? "IT GAVE" : "REWARD"),
      done ? rewardList(r) : h("div", { class: "line hi wrap" }, teaser(i)),
      h("div", { class: "text dim small wrap" }, done || !(r.classes.length + r.formations.length + r.gear.length) ? "Practice fights and replays pay nothing." : "Paid once, the first time the whole run is won. Practice fights pay nothing."),
    ),
    h("div", { class: "line dim small" }, h("span", { class: "trunc grow" }, `${p.units.map((u) => shortName(u.class)).join(" · ") || "NO PARTY"}`), h("span", { class: "trunc" }, f.name.toUpperCase())),
    missing.length ? h("div", { class: "text bad small wrap" }, `To start: ${missing.join("; ")}.`) : null,
    h("div", { class: "btns even" }, start, button("PARTY", () => go("party"))),
    seedRow(),
  ];
}
/** What a cleared node gave: classes, formations and gear, by name. */
function rewardList(r: ReturnType<typeof rewardsOf>): Child[] {
  const out: Child[] = [];
  for (const k of r.classes) out.push(h("div", { class: "line" }, h("span", { class: "dim" }, "CLASS"), h("span", { class: "trunc" }, className(k))));
  for (const fm of r.formations) out.push(h("div", { class: "line" }, h("span", { class: "dim" }, "FORMATION"), h("span", { class: "trunc" }, c.formations.get(fm)?.name ?? fm)));
  for (const g of r.gear) if (c.gear.has(g)) out.push(gearRow(gearOf(g), gearOf(g).slot, null, undefined, false));
  return out.length ? out : [h("div", { class: "line dim" }, "NOTHING")];
}

// ─── Fight: a run, or one of its fights ───
let lastRun = dungeons[0].id;
function fight(arg?: unknown): Child[] {
  const runId = typeof arg === "string" ? arg : null;
  if (!setup.party.length) return [header("FIGHT", () => go("home")), win("text", "Pick a party first."), h("div", { class: "btns" }, button("PARTY", () => go("party")))];
  if (!runId) {
    return [
      header("FIGHT", () => go("home")),
      win("list scroll", ...dungeons.map((d, i) => {
        const n = d.stages.filter((s) => s.kind === "fight").length;
        return h("div", { class: `row${lastRun === d.id ? " cur" : ""}`, style: "min-height:3rem", onClick: () => { lastRun = d.id; go("fight", d.id); } },
          h("span", { class: "cursor" }, lastRun === d.id ? "▶" : ""), h("div", { class: "grow trunc" }, h("div", { class: "line" }, `${i + 1} ${runName(d)}`), h("div", { class: "text dim small trunc" }, d.text)), h("span", { class: "dim" }, `${n}F`));
      })),
      seedRow(),
    ];
  }
  const d = c.dungeons.get(runId)!;
  const fights = d.stages.filter((s) => s.kind === "fight");
  return [
    header(runName(d), () => go("fight")),
    win("list scroll",
      row([h("span", { class: "grow" }, "RUN ALL"), h("span", { class: "dim" }, `${fights.length} FIGHTS`)], () => go("battle", { dungeon: d.id }), { cur: true }),
      ...fightRows(d.id, (sid) => go("battle", { dungeon: `${d.id}~${sid}` })),
    ),
    seedRow(),
  ];
}

// ─── Party: formation, the three slots, the roster ───
/**
 * One selection at a time, a slot or a class, and every move resets to neutral:
 * slot then class puts the class there; class then slot does the same; slot then slot swaps them;
 * the same slot or class twice clears a slot's selection or opens the class's sheet.
 */
let pickSlot: number | null = null;
let pickClass: string | null = null;
/** Where the party screen's back goes: home, or the journey node it was opened from. */
let partyFrom: [Screen, unknown] = ["home", undefined];
function party(): Child[] {
  const f = c.formations.get(setup.formation)!;
  const done = () => { pickSlot = null; pickClass = null; save(); refresh(); };
  /** Puts a class in a slot: swaps with whoever holds it if the class is already in the party; an empty slot takes it at the end. */
  const place = (id: string, slot: number) => {
    const j = setup.party.indexOf(id);
    if (j >= 0) {
      if (slot < setup.party.length) [setup.party[j], setup.party[slot]] = [setup.party[slot], setup.party[j]];
      else setup.party.push(...setup.party.splice(j, 1));
    } else if (slot < setup.party.length) setup.party[slot] = id;
    else if (setup.party.length < 3) setup.party.push(id);
  };
  const tapSlot = (i: number) => {
    if (pickClass !== null) return place(pickClass, i), done();
    if (pickSlot === null) return (pickSlot = i), refresh();
    if (pickSlot === i) return (pickSlot = null), refresh();
    const a = setup.party[pickSlot], b = setup.party[i];
    if (a && b) [setup.party[pickSlot], setup.party[i]] = [b, a];
    else if (a || b) place((a ?? b)!, a ? i : pickSlot);
    done();
  };
  const tapClass = (id: string) => {
    if (pickSlot !== null) return place(id, pickSlot), done();
    if (pickClass === id) return (pickClass = null), go("unit", id);
    pickClass = id;
    refresh();
  };
  // Only what's owned: the journey's classes and formations, or all of them in free play.
  const fms = formations.filter((x) => ownsFormation(x.id));
  const fi = fms.findIndex((x) => x.id === setup.formation);
  const setFormation = (i: number) => { setup.formation = fms[(i + fms.length) % fms.length].id; markSeen("formations", setup.formation); save(); refresh(); };
  const prev = button("◀", () => setFormation(fi - 1), "sm"), next = button("▶", () => setFormation(fi + 1), "sm");
  prev.disabled = next.disabled = fms.length < 2;
  const roster = classes.filter((k) => ownsClass(k.id));
  const cards = [0, 1, 2].map((i) => {
    const id = setup.party[i];
    const pos = f.positions[i];
    const codes = codeSpans(pos.stats);
    return h("div", { class: `win card${i === pickSlot ? " cur" : ""}`, onClick: () => tapSlot(i) },
      h("div", { class: "slot" }, `${i + 1} ${pos.name}`),
      id ? h("div", { class: "portrait" }, portraitEl(id, "slot")) : h("div", { class: "empty" }, "EMPTY"),
      h("div", { class: "name" }, id ? shortName(id) : "---"),
      h("div", { class: "codes" }, ...(codes.length ? codes : [h("span", { class: "dim" }, "no change")])),
    );
  });
  const picked = pickSlot !== null ? setup.party[pickSlot] : pickClass ?? undefined;
  const inParty = picked !== undefined && setup.party.includes(picked);
  const sheetBtn = button("SHEET", () => { if (picked) { const id = picked; pickSlot = pickClass = null; go("unit", id); } }, "sm");
  const removeBtn = button("REMOVE", () => { if (picked && inParty) { setup.party.splice(setup.party.indexOf(picked), 1); done(); } }, "sm");
  sheetBtn.disabled = !picked;
  removeBtn.disabled = !inParty;
  const hint = pickSlot !== null
    ? "Tap a class to put it here, another slot to swap, or this slot again to deselect."
    : pickClass !== null
      ? "Tap a slot to put it there, or this class again for its sheet."
      : "Tap a slot then a class, or a class then a slot. Tap a class twice for its sheet.";
  return [
    header("PARTY", () => go(...partyFrom), `${setup.party.length}/3`),
    win("",
      h("div", { class: "line" }, prev, h("span", { class: "grow center hi", onClick: () => go("formation") }, f.name), anyNewFormation() ? newTag() : null, next),
      h("div", { class: "text dim small wrap" }, f.text, f.statuses?.length ? ` ${f.statuses.map((s) => c.statuses.get(s)!.text).join(" ")}` : ""),
    ),
    h("div", { class: "cards" }, ...cards),
    h("div", { class: "btns" },
      sheetBtn,
      removeBtn,
      h("span", { class: "dim small text", style: "margin-left:auto;text-align:right;line-height:1.25rem" }, hint),
    ),
    win("scroll roster", h("div", { class: "grid" }, ...roster.map((k) => {
      const inP = setup.party.includes(k.id);
      return h("div", { class: `cell${inP ? " in" : ""}${pickClass === k.id ? " cur" : ""}`, onClick: () => tapClass(k.id) },
        h("div", { class: "portrait" }, portraitEl(k.id)), h("span", { class: "trunc", style: "max-width:100%" }, shortName(k.id)), newClass(k.id) || newGearFor(k.id) ? newTag() : null);
    }), roster.length < classes.length ? h("div", { class: "cell static dim" }, h("div", { class: "portrait locked" }, "?"), h("span", null, `${classes.length - roster.length} MORE`)) : null)),
  ];
}

// ─── Formation: the ten to choose from (the owned ones, in the journey) ───
function formation(): Child[] {
  const fms = formations.filter((fm) => ownsFormation(fm.id));
  const out = [
    header("FORMATION", () => go("party")),
    win("list scroll", ...fms.map((fm) => {
      const cur = fm.id === setup.formation;
      return h("div", { class: `row${cur ? " cur" : ""}`, style: "min-height:3rem", onClick: () => { setup.formation = fm.id; save(); go("party"); } },
        h("span", { class: "cursor" }, cur ? "▶" : ""),
        h("div", { class: "grow trunc" }, h("div", { class: "line" }, fm.name, newFormation(fm.id) ? newTag() : null), h("div", { class: "text dim small trunc" }, fm.text)));
    }), moreToFind(formations.length - fms.length)),
  ];
  // Opening the list shows them all: their NEW tags go after this look.
  markSeen("formations", fms.map((fm) => fm.id));
  return out;
}

// ─── Unit: a class's sheet, with its gear and ability order to change ───
let orderPick: number | null = null;
/** The screen a sheet was opened from, for its back: the party screen or the class list. */
let unitFrom: Screen = "classes";
function unit(arg?: unknown): Child[] {
  const id = String(arg);
  if (!c.classes.has(id) || !ownsClass(id)) return home();
  const k = classOf(id);
  const member = memberFor(id);
  const slot = setup.party.indexOf(id);
  const designer = setup.settings.designer;
  const order = abilitiesFor(id);
  const g = gearFor(id);
  const onN = (i: number) => {
    if (orderPick === null) orderPick = i;
    else {
      const o = [...order];
      [o[orderPick], o[i]] = [o[i], o[orderPick]];
      setup.abilities[id] = o;
      orderPick = null;
      save();
    }
    refresh();
  };
  const sp = specialLines(member.stats);
  const back = () => { orderPick = null; go(unitFrom); };
  // NEW on a slot when new gear fits it; opening the sheet sees the class and what it wears.
  const gearRows = (["weapon", "armor", "amulet"] as const).map((s) => {
    const r = gearRow(g[s] ? gearOf(g[s]) : null, s, member.stats, () => go("gear", { cls: id, slot: s }));
    if (newGearFor(id, s)) r.lastElementChild?.before(newTag());
    return r;
  });
  markSeen("classes", id);
  markSeen("gear", Object.values(g));
  const where = slot >= 0 ? h("span", { class: "hi small" }, `IN SLOT ${slot + 1}`) : setup.party.length < 3 ? button("ADD TO PARTY", () => { setup.party.push(id); save(); go("party"); }, "sm hi") : h("span", { class: "dim small" }, "PARTY FULL");
  return [
    header(k.name, back, slot >= 0 ? button("REMOVE", () => { setup.party.splice(slot, 1); save(); go("party"); }, "sm") : null),
    win("", classHead(id, h("div", { class: "line", style: "min-height:1.75rem" }, where))),
    win("", statGrid(member.stats, k.stats, designer), sp.length ? h("div", { class: "text up small wrap", style: "margin-top:.25rem" }, ...sp.flatMap((s, i) => (i ? [" · ", s] : [s]))) : null),
    win("scroll",
      h("div", { class: "text dim wrap small" }, k.text),
      section("PASSIVE"),
      ...(k.passive ? passiveBlock(k.passive.name, k.passive.text, k.passive.statuses?.[0]) : passiveBlock("Einherjar", "", null)),
      section("GEAR", "tap to change"),
      ...gearRows,
      h("div", { class: "line small dim wrap" }, `CAN USE ${k.weapons.map((w) => kindOf(w).name).join(", ").toUpperCase()} · ${k.armor.toUpperCase()} ARMOR`),
      section("ABILITIES", orderPick === null ? "tap two numbers to swap" : "now tap the other"),
      ...order.map((a, i) => abilityBlock(c.abilities.get(a)!, member.stats, designer, { n: i + 1, onN: () => onN(i), cur: orderPick === i })),
      basicLine(weaponOf(c, member.weapon), member.stats, designer),
    ),
  ];
}

// ─── Gear: what fits a class in a slot ───
function gear(arg?: unknown): Child[] {
  const { cls: id, slot } = (arg as { cls: string; slot: "weapon" | "armor" | "amulet" }) ?? {};
  if (!c.classes.has(id)) return home();
  const member = memberFor(id);
  const current = gearFor(id)[slot];
  const all = gearThatFits(c, id, slot);
  const fits = all.filter(ownsGear);
  // Leaving the picker sees everything it showed.
  const leave = () => { markSeen("gear", fits); go("unit", id); };
  const choose = (gid: string | null) => {
    const g = { ...(setup.gear[id] ?? {}) };
    if (gid) g[slot] = gid;
    else delete g[slot];
    setup.gear[id] = g;
    save();
    leave();
  };
  return [
    header(`${className(id)} · ${slot}`, leave),
    win("list scroll",
      slot !== "weapon" ? h("div", { class: `gear-row${!current ? " equipped" : ""}`, onClick: () => choose(null) }, h("span", { class: "art" }, ""), h("div", { class: "grow" }, h("div", { class: "line" }, h("span", { class: "dim grow" }, "NOTHING"), !current ? h("span", { class: "tag" }, "EQUIPPED") : null))) : null,
      ...fits.map((gid) => {
        const r = gearRow(gearOf(gid), slot, member.stats, () => choose(gid), false);
        if (newGear(gid)) r.querySelector(".grow .line")?.append(newTag());
        if (gid === current) {
          r.classList.add("equipped");
          r.querySelector(".grow .line")?.append(h("span", { class: "tag" }, "EQUIPPED"));
        }
        return r;
      }),
      moreToFind(all.length - fits.length),
    ),
    h("div", { class: "text dim small wrap" }, slot === "weapon" ? "A weapon sets the basic attack: its kind, speed and element. ★ is a powerful piece." : "The numbers are on the stat sheet's scale. ★ is a powerful piece."),
  ];
}

// ─── Classes and the bestiary: lists, then sheets ───
function classesScreen(): Child[] {
  const list = classes.filter((k) => ownsClass(k.id));
  return [
    header("CLASSES", () => go("home"), onJourney() ? `${list.length}/${classes.length}` : null),
    win("list scroll",
      ...list.map((k) => row([h("div", { class: "portrait" }, portraitEl(k.id)), h("div", { class: "grow trunc" }, h("div", { class: "line" }, k.name, newClass(k.id) || newGearFor(k.id) ? newTag() : null), h("div", { class: "text dim small trunc" }, role(k.text)))], () => { orderPick = null; go("unit", k.id); }, { cursor: false, cur: setup.party.includes(k.id), cls: "tall" })),
      moreToFind(classes.length - list.length),
    ),
  ];
}
const rankClass = (rank: string) => (rank === "boss" ? "gold" : rank === "elite" ? "debuff" : "dim");
function bestiary(): Child[] {
  return [
    header("BESTIARY", () => go("home")),
    win("list scroll", ...enemies.map((e) => row([h("span", { style: "width:3rem;display:inline-flex;justify-content:center", class: "px-wrap" }, enemyThumb(e.id, 24)), h("span", { class: "grow trunc" }, enemyDisplayName(e.id)), h("span", { class: rankClass(e.rank) }, e.rank === "boss" ? "★BOSS" : e.rank)], () => go("enemy", e.id), { cursor: false }))),
  ];
}
function enemy(arg?: unknown): Child[] {
  const id = String(arg);
  const e = c.enemies.get(id);
  if (!e) return bestiary();
  const where = dungeons.flatMap((d) => d.stages.map((s, i) => (s.kind === "fight" && s.enemies.includes(e.id) ? `${runName(d)} ${i + 1}` : "")).filter(Boolean));
  const sprite = enemyEl(e.id, 3, 1);
  return [
    header(enemyDisplayName(e.id), () => go("bestiary"), h("span", { class: rankClass(e.rank) }, e.rank === "boss" ? "★BOSS" : e.rank)),
    win("scroll",
      h("div", { class: "center", style: "display:flex;justify-content:center;padding:.5rem 0" }, sprite),
      e.name !== enemyDisplayName(e.id) ? h("div", { class: "line dim" }, h("span", { class: "trunc" }, `AKA ${e.name} IN THE DOCUMENTS`)) : null,
      ...enemySheet(e, setup.settings.designer),
      h("div", { class: "text dim wrap small", style: "margin-top:.5rem" }, where.length ? `Found in: ${where.join(", ")}.` : "Summoned only."),
    ),
  ];
}

/** The designer's shortcut: the current node counts as cleared, without playing it, and its celebration plays. */
function clearNext() {
  const i = currentIndex();
  if (i === null) return;
  setCleared(i + 1);
  go("journey");
  celebrate(frame, i);
}

// ─── Settings ───
function settings(): Child[] {
  const s = setup.settings;
  const toggle = (label: string, key: "sound" | "music" | "designer" | "autoContinue" | "partyBars") => row([h("span", { class: "grow" }, label), h("span", { class: s[key] ? "good" : "dim" }, s[key] ? "ON" : "OFF")], () => { s[key] = !s[key]; if (key === "sound") setSound(s.sound); if (key === "music") setMusic(s.music); save(); refresh(); }, { cursor: false });
  return [
    header("SETTINGS", () => go("home")),
    win("list",
      hasJourney ? row([h("span", { class: "grow" }, "MODE"), h("span", { class: onJourney() ? "hi" : "" }, onJourney() ? "JOURNEY" : "FREE PLAY")], () => { useMode(onJourney() ? "free" : "journey"); refresh(); }, { cursor: false }) : null,
      row([h("span", { class: "grow" }, "THEME"), h("span", null, s.theme.toUpperCase())], () => { s.theme = s.theme === "night" ? "day" : "night"; setTheme(s.theme); save(); refresh(); }, { cursor: false }),
      row([h("span", { class: "grow" }, "SPEED"), h("span", null, `${s.speed}×`)], () => { s.speed = s.speed === 1 ? 2 : s.speed === 2 ? 4 : 1; save(); refresh(); }, { cursor: false }),
      toggle("SOUND", "sound"),
      toggle("MUSIC", "music"),
      toggle("AUTO NEXT", "autoContinue"),
      toggle("PARTY HP ON FIELD", "partyBars"),
      toggle("DESIGNER", "designer"),
      row([h("span", { class: "grow" }, "NUMBERS"), h("span", null, s.bigNumbers ? "BIG" : "SMALL")], () => { s.bigNumbers = !s.bigNumbers; setDisplayDiv(s.bigNumbers ? 10 : 100); save(); refresh(); }, { cursor: false }),
      row([h("span", { class: "grow" }, "PORTRAITS"), h("span", null, s.portraits.toUpperCase())], () => { s.portraits = s.portraits === "faces" ? "sprites" : s.portraits === "sprites" ? "mixed" : "faces"; save(); refresh(); }, { cursor: false }),
      hasJourney ? row([h("span", { class: "grow" }, "RESET JOURNEY")], () => ask("RESET THE JOURNEY?", "Back to the first run, with the starting three and nothing found. Free play's party is kept.", "RESET", () => { resetJourney(); resetJourneyLoadout(); go("home"); }), { cursor: false }) : null,
      onJourney() && s.designer ? row([h("span", { class: "grow" }, "CLEAR NEXT"), h("span", { class: "dim" }, "DESIGNER")], () => clearNext(), { cursor: false }) : null,
      row([h("span", { class: "grow bad" }, "RESET ALL")], () => ask("RESET ALL?", "Settings, both parties and the journey go back to the start.", "RESET", () => { reset(); setTheme(setup.settings.theme); setDisplayDiv(100); go("home"); }), { cursor: false }),
    ),
    h("div", { class: "text dim small wrap" }, hasJourney ? "Mode: the journey starts with three classes and gives more, with formations and gear, as its runs are cleared; free play has everything and pays nothing. Each keeps its own party. " : "", "Speed is how fast a fight is told: each message holds the clock while it's on screen. In a fight, II pauses, STEP plays one message at a time, >> skips to the end. Designer view shows hidden enemy stats and worked-out numbers. Small numbers are 10 per point of the design's 1–5 scale; big are 100. Portraits: faces everywhere, sprites everywhere, or mixed, with sprites in the party's slots and faces in the lists and rows. Party HP on field adds thin HP bars under the party in a fight, like the foes'."),
  ];
}
