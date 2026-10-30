/**
 * The menus. Each screen is its own layout: a header, windows, and lists that
 * scroll inside their own box (never the whole screen). `go` switches screens;
 * the battle screen is battle/battle.ts.
 */
import { gearFor as gearThatFits } from "../../src/sim/parties.js";
import { foesText, meets, needText, rewardsOf, unmet } from "../../src/campaign.js";
import { c, className, classes, cls as classOf, dungeons, enemies, fightName, formations, gearOf, NUMBER_SCALES, runName, setNumberScale, shortName } from "./content.js";
import { enemyDisplayName } from "./art.js";
import { button, h, header, nav, row, settleBack, win, type Child } from "./dom.js";
import { abilitiesFor, applyHeadStart, gearFor, HEAD_STARTS, HIT_PAUSES, party as partyLoadout, reset, resetJourneyLoadout, save, setup, useMode } from "./state.js";
import {
  anyNewClass, anyNewFormation, anyNewGear, cleared, currentIndex, hasJourney, markSeen, newClass, newFormation, newGear, newGearFor, newNode, nodes, onJourney,
  ownsClass, ownsFormation, ownsGear, resetJourney, setCleared, mode as playMode, onRogue,
} from "./journey.js";
import { celebrate } from "./celebrate.js";
import { anyNewEnemy, known, look, metCount, newEnemy } from "./bestiary.js";
import { abilityBlock, basicLine, canUse, classHead, classPassive, codeSpans, enemySheet, formationNote, gearRow, lockedRow, memberFor, portraitEl, RARITY_TONE, role, seatCodes, seatNotes, section, SLOTS, specialLines, statGrid, twoHanded, type GearSlot } from "./sheet.js";
import { enemyEl, enemyThumb } from "./pixel.js";
import { weaponOf } from "../../src/engine/combat/fight.js";
import { foesOnStage, partyOnStage, stageEl, Strip, STRIP_H, themeOf } from "./battle/scene.js";
import { startBattle, type BattleArgs } from "./battle/battle.js";
import { music, setMusic, setSound, sfx } from "./battle/audio.js";
import { bindRogue, rbossScreen, rclassScreen, rgearScreen, rogueMenuLine, rogueScreen, rpartyScreen, runitScreen } from "./rogue-screens.js";
import { abandonRun, current as rogueRun, resetRogue } from "./rogue-state.js";

export type Screen = "home" | "journey" | "node" | "fight" | "party" | "formation" | "unit" | "gear" | "classes" | "bestiary" | "enemy" | "settings" | "battle" | "rogue" | "rparty" | "runit" | "rgear" | "rboss" | "rclass";

let current: Screen = "home";
let currentArg: unknown;
/** The screen on show. */
export const screen = (): Screen => current;
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
  bindRogue((s, arg, keep) => go(s as Screen, arg, keep), frame);
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
  const screens: Record<Exclude<Screen, "battle">, (arg?: unknown) => Child[]> = {
    home, journey, node, fight, party, formation, unit, gear, classes: classesScreen, bestiary, enemy, settings,
    rogue: rogueScreen, rparty: rpartyScreen, runit: runitScreen, rgear: rgearScreen, rboss: rbossScreen, rclass: rclassScreen,
  };
  screenEl.append(...(screens[s](arg).filter(Boolean) as Node[]));
  settleBack();
  [...screenEl.querySelectorAll(".scroll")].forEach((el, i) => { if (scrolls[i]) el.scrollTop = scrolls[i]; });
}
/** Re-renders the current screen after a change, keeping the lists' scroll. */
export const refresh = () => go(current, currentArg, true);

/** A small gold NEW tag, on things the journey gave that haven't been looked at. */
export const newTag = () => h("span", { class: "new" }, "NEW");
/** "13 more to find": what the journey still holds, at the end of a list. */
const moreToFind = (n: number) => (n > 0 ? h("div", { class: "line dim small more" }, h("span", { class: "trunc" }, `${n} MORE TO FIND`)) : null);

/** A question over the screen, with a yes and a cancel. */
function ask(title: string, text: string, yes: string, onYes: () => void) {
  const close = () => { box.remove(); nav.overlay = null; };
  const box = h("div", { class: "overlay dialog" }, win("",
    h("div", { class: "line hi" }, title),
    text ? h("div", { class: "text dim small wrap" }, text) : null,
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
/** Designer view only: the seed every fight plays while it's locked (Settings → SEED). Players never see a seed. */
const seedRow = () => (setup.settings.designer && setup.settings.seedLock
  ? h("div", { class: "line dim small" }, h("span", null, "SEED"), h("span", { class: "grow" }, String(setup.seed)), button("NEW", () => { setup.seed = Math.floor(Math.random() * 1e9) + 1; save(); refresh(); }, "sm"))
  : null);
/** The screen's one big action, and the smaller ones beside it, where a thumb finds them: the bottom-centre, full width. */
export const actions = (main: HTMLButtonElement, ...more: (HTMLButtonElement | null)[]) => {
  main.classList.add("big");
  return h("div", { class: "actions" }, main, more.some(Boolean) ? h("div", { class: "btns even" }, ...more.map((b) => (b ? (b.classList.add("mid"), b) : null))) : null);
};

/** A run's page opens on its ground: the party facing the run's boss (or its first fight's foes), as the battle will stand them. */
function runScene(dungeonId: string, h = 128): HTMLCanvasElement {
  const d = c.dungeons.get(dungeonId)!;
  const fights = d.stages.flatMap((st) => (st.kind === "fight" ? [st] : []));
  const fight = fights.find((st) => st.boss) ?? fights[0];
  const party = partyOnStage({ refs: setup.party, weapons: Object.fromEntries(setup.party.map((id) => [id, gearFor(id).weapon])), formation: setup.formation }, h);
  return stageEl({ theme: themeOf(dungeonId), h, actors: [...party, ...foesOnStage(fight?.enemies ?? [], h)] });
}

// ─── Home ───
function home(): Child[] {
  const cur = currentIndex();
  const owned = classes.filter((k) => ownsClass(k.id)).length;
  // In the journey the first item is the road, with the next node's name; free play keeps FIGHT. NEW marks what holds something unseen.
  type Item = [Screen, string, string, boolean];
  const head: Item[] = onRogue()
    ? [["rogue", "ROGUE", rogueMenuLine(), false], ...(rogueRun() ? [["rparty", "PARTY", "", false] as Item] : [])]
    : [
      onJourney() ? ["journey", "JOURNEY", cur === null ? "Complete" : `${cur + 1}. ${nodes()[cur].name}`, cur !== null && newNode(nodes()[cur].id)] : ["fight", "FIGHT", "", false],
      ["party", "PARTY", "", anyNewClass() || anyNewFormation() || anyNewGear()],
    ];
  const items: Item[] = [
    ...head,
    ["classes", "CLASSES", onJourney() ? `${owned} of ${classes.length}` : "", anyNewClass() || anyNewGear()],
    ["bestiary", "BESTIARY", playMode() === "free" ? "" : `${metCount()} of ${enemies.length}`, anyNewEnemy()],
    ["settings", "SETTINGS", "", false],
  ];
  return [
    h("div", { class: "title-big" }, "MEMORY", h("br"), "DUNGEON"),
    stripEl(),
    h("div", { class: "menu-wrap" },
      win("list menu", ...items.map(([s, label, sub, isNew]) => h("div", { class: "row", onClick: () => go(s) }, h("span", { class: "cursor" }, "▶"), h("div", { class: "grow" }, h("div", { class: "line" }, label, isNew ? newTag() : null), sub ? h("div", { class: "text dim small trunc" }, sub) : null)))),
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
    h("span", { class: "cursor" }, ""), h("div", { class: "grow trunc" }, h("div", { class: "line" }, h("span", { class: s.boss ? "gold" : "" }, `${i + 1} ${s.boss ? "★" : ""}${fightName(s)}`)), h("div", { class: "text dim small wrap" }, foesOf(s.enemies)))));
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
        h("div", { class: "text dim small wrap" }, n.text)),
    );
    if (cur) curRow = el;
    return el;
  }));
  // Open on the current node.
  requestAnimationFrame(() => { if (curRow && list.isConnected) list.scrollTop += curRow.getBoundingClientRect().top - list.getBoundingClientRect().top - list.clientHeight / 3; });
  return [
    header("JOURNEY", () => go("home"), done >= ns.length ? "COMPLETE" : `${done}/${ns.length}`),
    list,
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
  const start = button(done ? "REPLAY" : "START", () => go("battle", { dungeon: d.id, node: n.id }), "hi");
  start.disabled = missing.length > 0 || !p.units.length;
  const f = c.formations.get(setup.formation)!;
  return [
    header(`${i + 1} ${n.name}`, () => go("journey"), kindTag(n.kind)),
    runScene(d.id),
    win("scroll",
      done ? h("div", { class: "line good" }, "√ CLEARED") : null,
      h("div", { class: "text wrap small" }, n.text),
      foes ? h("div", { class: "text wrap small debuff", style: "margin-top:.25rem" }, foes) : null,
      n.needs.length ? section("NEEDS") : null,
      ...n.needs.map((nd) => {
        const ok = meets(c, nd, p);
        return h("div", { class: `line wrap ${ok ? "good" : "bad"}` }, h("span", null, ok ? "√" : "×"), h("span", { class: "text grow" }, needText(c, nd)));
      }),
      section("FIGHTS", "PRACTICE"),
      ...fightRows(d.id, (sid) => go("battle", { dungeon: `${d.id}~${sid}`, node: n.id })),
      section(done ? "IT GAVE" : "REWARD"),
      done ? rewardList(r) : h("div", { class: "line hi wrap" }, teaser(i)),
    ),
    h("div", { class: "line dim small" }, h("span", { class: "trunc grow" }, `${p.units.map((u) => shortName(u.class)).join(" · ") || "NO PARTY"}`), h("span", { class: "trunc" }, f.name.toUpperCase())),
    seedRow(),
    actions(start, button("PARTY", () => go("party"))),
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
  if (!setup.party.length) return [header("FIGHT", () => go("home")), h("div", { class: "grow" }), actions(button("PARTY", () => go("party"), "hi"))];
  if (!runId) {
    return [
      header("FIGHT", () => go("home")),
      win("list scroll", ...dungeons.map((d, i) => {
        const n = d.stages.filter((s) => s.kind === "fight").length;
        return h("div", { class: `row${lastRun === d.id ? " cur" : ""}`, style: "min-height:3rem", onClick: () => { lastRun = d.id; go("fight", d.id); } },
          h("span", { class: "cursor" }, lastRun === d.id ? "▶" : ""), h("div", { class: "grow trunc" }, h("div", { class: "line" }, `${i + 1} ${runName(d)}`), h("div", { class: "text dim small wrap" }, d.text)), h("span", { class: "dim" }, `${n}F`));
      })),
      seedRow(),
    ];
  }
  const d = c.dungeons.get(runId)!;
  const fights = d.stages.filter((s) => s.kind === "fight");
  return [
    header(runName(d), () => go("fight"), `${fights.length} FIGHTS`),
    runScene(d.id),
    win("list scroll", ...fightRows(d.id, (sid) => go("battle", { dungeon: `${d.id}~${sid}` }))),
    seedRow(),
    actions(button("RUN ALL", () => go("battle", { dungeon: d.id }), "hi"), button("PARTY", () => go("party"))),
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
    // Step 5i: a seat whose statuses say what it does has no "no change".
    const codes = seatCodes(pos);
    // Something picked: the slots it can go to pulse.
    const target = pickClass !== null || (pickSlot !== null && pickSlot !== i);
    return h("div", { class: `win card${i === pickSlot ? " cur" : ""}${target ? " target" : ""}`, onClick: () => tapSlot(i) },
      h("div", { class: "slot" }, `${i + 1} ${pos.name}`),
      id ? h("div", { class: "portrait" }, portraitEl(id, "slot")) : h("div", { class: "empty" }, "EMPTY"),
      h("div", { class: "name" }, id ? shortName(id) : "---"),
      h("div", { class: "codes" }, ...codes),
    );
  });
  const picked = pickSlot !== null ? setup.party[pickSlot] : pickClass ?? undefined;
  const inParty = picked !== undefined && setup.party.includes(picked);
  const sheetBtn = button("SHEET", () => { if (picked) { const id = picked; pickSlot = pickClass = null; go("unit", id); } }, "sm");
  const removeBtn = button("REMOVE", () => { if (picked && inParty) { setup.party.splice(setup.party.indexOf(picked), 1); done(); } }, "sm");
  sheetBtn.disabled = !picked;
  removeBtn.disabled = !inParty;
  return [
    header("PARTY", () => go(...partyFrom), `${setup.party.length}/3`),
    win("",
      // Step 5i: the formation's name in its rarity's colour (the gear's), and what its seats' own statuses do.
      h("div", { class: "line" }, prev, h("span", { class: `grow center ${RARITY_TONE[f.rarity ?? "common"] || "hi"}`, onClick: () => go("formation") }, f.name), anyNewFormation() ? newTag() : null, next),
      h("div", { class: "text dim small wrap" }, f.text, formationNote(f), seatNotes(f) ? ` ${seatNotes(f)}` : ""),
    ),
    h("div", { class: "cards" }, ...cards),
    h("div", { class: "btns even" }, sheetBtn, removeBtn),
    win("scroll roster", h("div", { class: "grid" }, ...roster.map((k) => {
      const inP = setup.party.includes(k.id);
      return h("div", { class: `cell${inP ? " in" : ""}${pickClass === k.id ? " cur" : ""}${pickSlot !== null ? " target" : ""}`, onClick: () => tapClass(k.id) },
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
        // Step 5i: each formation's rarity, in the gear's colours.
        h("div", { class: "grow trunc" }, h("div", { class: "line" }, h("span", { class: `grow trunc ${RARITY_TONE[fm.rarity ?? "common"]}` }, `${fm.rarity === "legendary" ? "★" : ""}${fm.name}`), fm.rarity && fm.rarity !== "common" ? h("span", { class: `small ${RARITY_TONE[fm.rarity]}` }, fm.rarity.toUpperCase()) : null, newFormation(fm.id) ? newTag() : null), h("div", { class: "text dim small wrap" }, fm.text)));
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
  // NEW on a slot when new gear fits it; opening the sheet sees the class and what it wears. Step 5j: four slots, the
  // offhand locked under a two-handed weapon.
  const gearRows = SLOTS.map((s) => {
    if (s === "offhand" && twoHanded(g)) return lockedRow(s);
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
      section("PASSIVE"),
      ...classPassive(id),
      section("GEAR"),
      ...gearRows,
      canUse(id),
      section("ABILITIES", orderPick === null ? null : h("span", { class: "hi" }, "SWAP WITH?")),
      ...order.map((a, i) => abilityBlock(c.abilities.get(a)!, member.stats, designer, { n: i + 1, onN: () => onN(i), cur: orderPick === i, target: orderPick !== null && orderPick !== i })),
      basicLine(weaponOf(c, member.weapon), member.stats, { ref: member.weapon }),
    ),
  ];
}

// ─── Gear: what fits a class in a slot ───
function gear(arg?: unknown): Child[] {
  const { cls: id, slot } = (arg as { cls: string; slot: GearSlot }) ?? {};
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
    // Step 5j: a two-handed weapon empties the offhand.
    if (slot === "weapon" && twoHanded(g)) delete g.offhand;
    setup.gear[id] = g;
    save();
    leave();
  };
  return [
    header(`${className(id)} · ${slot}`, leave),
    win("list scroll",
      slot !== "weapon" ? h("div", { class: `gear-row${!current ? " equipped" : ""}`, onClick: () => choose(null) }, h("span", { class: "art" }, ""), h("div", { class: "grow" }, h("div", { class: "line" }, h("span", { class: "dim grow" }, "NOTHING"), !current ? h("span", { class: "tag" }, "EQUIPPED") : null))) : null,
      ...fits.map((gid) => {
        // Step 5i: who can wear it, the party first.
        const r = gearRow(gearOf(gid), slot, member.stats, () => choose(gid), false, setup.party);
        if (newGear(gid)) r.querySelector(".grow .line")?.append(newTag());
        if (gid === current) {
          r.classList.add("equipped");
          r.querySelector(".grow .line")?.append(h("span", { class: "tag" }, "EQUIPPED"));
        }
        return r;
      }),
      moreToFind(all.length - fits.length),
    ),
  ];
}

// ─── Classes and the bestiary: lists, then sheets ───
function classesScreen(): Child[] {
  const list = classes.filter((k) => ownsClass(k.id));
  return [
    header("CLASSES", () => go("home"), onJourney() ? `${list.length}/${classes.length}` : null),
    win("list scroll",
      ...list.map((k) => row([h("div", { class: "portrait" }, portraitEl(k.id)), h("div", { class: "grow trunc" }, h("div", { class: "line" }, k.name, newClass(k.id) || newGearFor(k.id) ? newTag() : null), h("div", { class: "text dim small" }, role(k.id)))], () => { orderPick = null; go("unit", k.id); }, { cursor: false, cur: setup.party.includes(k.id), cls: "tall" })),
      moreToFind(classes.length - list.length),
    ),
  ];
}
const rankClass = (rank: string) => (rank === "boss" ? "gold" : rank === "elite" ? "debuff" : "");
/** The bestiary: each enemy's likeness, name and rank; its page has the rest. */
function bestiary(): Child[] {
  return [
    header("BESTIARY", () => go("home"), playMode() === "free" ? `${enemies.length}` : `${metCount()}/${enemies.length}`),
    win("list scroll", ...enemies.map((e) => {
      // Not met yet: its shape and ???, a Pokédex's way.
      if (!known(e.id)) return row([h("span", { style: "width:3rem;display:inline-flex;justify-content:center" }, enemyThumb(e.id, 24, true)), h("span", { class: "grow dim" }, "???")], undefined, { cursor: false, cls: "beast" });
      // Its likeness and name only: what it's made of is on its page.
      return row([
        h("span", { style: "width:3rem;display:inline-flex;justify-content:center" }, enemyThumb(e.id, 24)),
        h("div", { class: "grow trunc" }, h("div", { class: "line" }, h("span", { class: `trunc ${rankClass(e.rank)}` }, `${e.rank === "boss" ? "★" : ""}${enemyDisplayName(e.id)}`), newEnemy(e.id) ? newTag() : null)),
      ], () => go("enemy", e.id), { cursor: false, cls: "beast" });
    })),
  ];
}
function enemy(arg?: unknown): Child[] {
  const id = String(arg);
  const e = c.enemies.get(id);
  if (!e || !known(id)) return bestiary();
  look(id);
  const where = [...new Set(dungeons.flatMap((d) => d.stages.flatMap((s) => (s.kind === "fight" && s.enemies.includes(e.id) ? [runName(d)] : []))))];
  return [
    header(enemyDisplayName(e.id), () => go("bestiary"), h("span", { class: rankClass(e.rank) || "dim" }, e.rank === "boss" ? "★BOSS" : e.rank)),
    win("scroll",
      h("div", { class: "beast-art" }, enemyEl(e.id, 3, 1)),
      ...enemySheet(e, setup.settings.designer),
      section("FOUND IN"),
      h("div", { class: "text dim wrap small" }, where.length ? where.join(", ") : "Summoned"),
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
  const toggle = (label: string, key: "sound" | "music" | "designer" | "autoContinue" | "partyBars" | "seedLock") => row([h("span", { class: "grow" }, label), h("span", { class: s[key] ? "good" : "dim" }, s[key] ? "ON" : "OFF")], () => { s[key] = !s[key]; if (key === "sound") setSound(s.sound); if (key === "music") setMusic(s.music); save(); refresh(); }, { cursor: false });
  const cycle = <T,>(label: string, list: readonly T[], at: T, show: (v: T) => string, set: (v: T) => void) =>
    row([h("span", { class: "grow" }, label), h("span", null, show(at))], () => { set(list[(list.indexOf(at) + 1) % list.length]); save(); refresh(); }, { cursor: false });
  return [
    header("SETTINGS", () => go("home")),
    win("list scroll",
      row([h("span", { class: "grow" }, "MODE"), h("span", { class: playMode() === "free" ? "" : "hi" }, playMode() === "journey" ? "JOURNEY" : playMode() === "rogue" ? "ROGUE" : "FREE PLAY")], () => { const m = playMode(); useMode(m === "journey" ? "free" : m === "free" ? "rogue" : hasJourney ? "journey" : "free"); refresh(); }, { cursor: false }),
      row([h("span", { class: "grow" }, "THEME"), h("span", null, s.theme.toUpperCase())], () => { s.theme = s.theme === "night" ? "day" : "night"; setTheme(s.theme); save(); refresh(); }, { cursor: false }),
      cycle("SPEED", [1, 2, 4], s.speed, (v) => `${v}×`, (v) => (s.speed = v)),
      cycle("HIT PAUSE", HIT_PAUSES, s.hitPause as (typeof HIT_PAUSES)[number], (v) => `${Math.round(v * 100)}%`, (v) => (s.hitPause = v)),
      toggle("SOUND", "sound"),
      toggle("MUSIC", "music"),
      toggle("AUTO NEXT", "autoContinue"),
      toggle("PARTY HP ON FIELD", "partyBars"),
      cycle("NUMBERS", NUMBER_SCALES, s.numbers as (typeof NUMBER_SCALES)[number], (v) => `${v}×`, (v) => { s.numbers = v; setNumberScale(v); }),
      cycle("PORTRAITS", ["faces", "sprites", "mixed"] as const, s.portraits, (v) => v.toUpperCase(), (v) => (s.portraits = v)),
      ...([0, 1, 2] as const).map((i) => cycle(`HEAD START ${["1ST", "2ND", "3RD"][i]} SLOT`, HEAD_STARTS, s.headStart[i] as (typeof HEAD_STARTS)[number], (v) => `${v} TICKS`, (v) => { s.headStart[i] = v; applyHeadStart(s.headStart); })),
      toggle("DESIGNER", "designer"),
      s.designer ? toggle("SEED LOCK", "seedLock") : null,
      s.designer && s.seedLock ? seedRow() : null,
      onJourney() && s.designer ? row([h("span", { class: "grow" }, "CLEAR NEXT"), h("span", { class: "dim" }, "DESIGNER")], () => clearNext(), { cursor: false }) : null,
      hasJourney ? row([h("span", { class: "grow" }, "RESET JOURNEY")], () => ask("RESET THE JOURNEY?", "", "RESET", () => { resetJourney(); resetJourneyLoadout(); go("home"); }), { cursor: false }) : null,
      onRogue() && rogueRun() ? row([h("span", { class: "grow" }, "GIVE UP THE RUN")], () => ask("GIVE UP THE RUN?", "", "GIVE UP", () => { abandonRun(); go("home"); }), { cursor: false }) : null,
      onRogue() ? row([h("span", { class: "grow" }, "RESET ROGUE")], () => ask("RESET THE ROGUE MODE?", "", "RESET", () => { resetRogue(); go("home"); }), { cursor: false }) : null,
      row([h("span", { class: "grow bad" }, "RESET ALL")], () => ask("RESET ALL?", "", "RESET", () => { reset(); setTheme(setup.settings.theme); setNumberScale(setup.settings.numbers); go("home"); }), { cursor: false }),
    ),
  ];
}
