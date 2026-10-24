/**
 * The menus. Each screen is its own layout: a header, windows, and lists that
 * scroll inside their own box (never the whole screen). `go` switches screens;
 * the battle screen is battle/battle.ts.
 */
import { gearFor as gearThatFits } from "../../src/sim/parties.js";
import { c, className, classes, cls as classOf, dungeons, enemies, fightName, formations, gearOf, kindOf, runName, setDisplayDiv, shortName } from "./content.js";
import { enemyDisplayName } from "./art.js";
import { button, h, header, row, toast, win, type Child } from "./dom.js";
import { abilitiesFor, gearFor, reset, save, setup } from "./state.js";
import { abilityBlock, basicLine, classHead, codeSpans, enemySheet, gearRow, memberFor, passiveBlock, role, section, specialLines, statGrid } from "./sheet.js";
import { enemyEl, enemyThumb, faceEl } from "./pixel.js";
import { weaponOf } from "../../src/engine/combat/fight.js";
import { Strip, STRIP_H } from "./battle/scene.js";
import { startBattle, type BattleArgs } from "./battle/battle.js";

export type Screen = "home" | "fight" | "party" | "formation" | "unit" | "gear" | "classes" | "bestiary" | "enemy" | "settings" | "battle";

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
  current = s;
  currentArg = arg;
  frame.querySelectorAll(".overlay").forEach((o) => o.remove());
  screenEl?.remove();
  screenEl = h("div", { class: `screen ${s}${s === "battle" ? " tight" : ""}` });
  frame.append(screenEl);
  if (s === "battle") {
    stopBattle = startBattle(frame, screenEl, arg as BattleArgs);
    return;
  }
  const screens: Record<Exclude<Screen, "battle">, (arg?: unknown) => Child[]> = { home, fight, party, formation, unit, gear, classes: classesScreen, bestiary, enemy, settings };
  screenEl.append(...(screens[s](arg).filter(Boolean) as Node[]));
  [...screenEl.querySelectorAll(".scroll")].forEach((el, i) => { if (scrolls[i]) el.scrollTop = scrolls[i]; });
}
/** Re-renders the current screen after a change, keeping the lists' scroll. */
const refresh = () => go(current, currentArg, true);

function stripEl(pick: number | null = null): HTMLCanvasElement {
  const cv = h("canvas", { class: "strip" });
  cv.style.height = `${STRIP_H / 8}rem`;
  strip = new Strip(cv, setup.party, setup.formation, Object.fromEntries(setup.party.map((id) => [id, gearFor(id).weapon])), pick).start();
  return cv;
}
const seedRow = () => h("div", { class: "line" }, h("span", { class: "dim" }, "SEED"), h("span", { class: "grow" }, String(setup.seed)), button("NEW SEED", () => { setup.seed = Math.floor(Math.random() * 100000) + 1; save(); refresh(); }, "sm"));

// ─── Home ───
function home(): Child[] {
  const items: [Screen, string, string][] = [
    ["fight", "FIGHT", "Runs, and single fights"],
    ["party", "PARTY", "Who goes, and what they carry"],
    ["classes", "CLASSES", "The 16 classes"],
    ["bestiary", "BESTIARY", "Every enemy"],
    ["settings", "SETTINGS", "Theme, speed, sound"],
  ];
  const f = c.formations.get(setup.formation)!;
  return [
    h("div", { class: "title-big" }, "MEMORY", h("br"), "DUNGEON"),
    stripEl(),
    h("div", { class: "menu-wrap" },
      win("list menu", ...items.map(([s, label, sub]) => h("div", { class: "row", onClick: () => go(s) }, h("span", { class: "cursor" }, "▶"), h("div", { class: "grow" }, h("div", { class: "line" }, label), h("div", { class: "text dim small trunc" }, sub))))),
      h("div", { class: "line dim small", style: "margin-top:.5rem" }, h("span", { class: "trunc grow" }, setup.party.map(shortName).join(" · ") || "NO PARTY"), h("span", null, `SEED ${setup.seed}`)),
      h("div", { class: "line dim small" }, h("span", { class: "trunc grow" }, f.name)),
    ),
  ];
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
  const foesOf = (enemiesIn: string[]) => {
    const counts = new Map<string, number>();
    for (const e of enemiesIn) counts.set(e, (counts.get(e) ?? 0) + 1);
    return [...counts].map(([e, n]) => `${enemyDisplayName(e)}${n > 1 ? ` ×${n}` : ""}`).join(", ");
  };
  return [
    header(runName(d), () => go("fight")),
    win("list scroll",
      row([h("span", { class: "grow" }, "RUN ALL"), h("span", { class: "dim" }, `${fights.length} FIGHTS`)], () => go("battle", { dungeon: d.id }), { cur: true }),
      ...fights.map((s, i) => s.kind === "fight" ? h("div", { class: "row", style: "min-height:3rem", onClick: () => go("battle", { dungeon: `${d.id}~${s.id}` }) },
        h("span", { class: "cursor" }, ""), h("div", { class: "grow trunc" }, h("div", { class: "line" }, h("span", { class: s.boss ? "gold" : "" }, `${i + 1} ${s.boss ? "★" : ""}${fightName(s)}`)), h("div", { class: "text dim small trunc" }, foesOf(s.enemies)))) : null),
    ),
    seedRow(),
  ];
}

// ─── Party: formation, the three slots, the roster ───
/** The selected slot, or none: tap a slot to select it, another to swap, the same again for its sheet. */
let pick: number | null = null;
function party(): Child[] {
  if (pick !== null && pick > 2) pick = null;
  const f = c.formations.get(setup.formation)!;
  const swap = (i: number, j: number) => { [setup.party[i], setup.party[j]] = [setup.party[j], setup.party[i]]; };
  const tapSlot = (i: number) => {
    if (pick === null) pick = i;
    else if (pick === i) {
      if (setup.party[i]) return go("unit", setup.party[i]);
      pick = null;
    } else {
      if (setup.party[pick] && setup.party[i]) swap(pick, i);
      else if (setup.party[pick] && !setup.party[i]) {
        const [m] = setup.party.splice(pick, 1);
        setup.party.push(m);
        i = setup.party.length - 1;
      }
      pick = i;
      save();
    }
    refresh();
  };
  const tapClass = (id: string) => {
    const j = setup.party.indexOf(id);
    if (pick === null) {
      if (j >= 0) pick = j;
      else if (setup.party.length < 3) {
        setup.party.push(id);
        pick = setup.party.length - 1;
        save();
      } else return toast(frame, "TAP A SLOT FIRST");
    } else if (j >= 0) {
      if (j === pick) return go("unit", id);
      if (pick < setup.party.length) swap(j, pick);
      else pick = j;
      save();
    } else {
      if (pick < setup.party.length) setup.party[pick] = id;
      else {
        setup.party.push(id);
        pick = setup.party.length - 1;
      }
      save();
    }
    refresh();
  };
  const fi = formations.findIndex((x) => x.id === setup.formation);
  const setFormation = (i: number) => { setup.formation = formations[(i + formations.length) % formations.length].id; save(); refresh(); };
  const cards = [0, 1, 2].map((i) => {
    const id = setup.party[i];
    const pos = f.positions[i];
    const codes = codeSpans(pos.stats);
    return h("div", { class: `win card${i === pick ? " cur" : ""}`, onClick: () => tapSlot(i) },
      h("div", { class: "slot" }, `${i + 1} ${pos.name}`),
      id ? faceEl(id) : h("div", { class: "empty" }, "EMPTY"),
      h("div", { class: "name" }, id ? shortName(id) : "---"),
      h("div", { class: "codes" }, ...(codes.length ? codes : [h("span", { class: "dim" }, "no change")])),
    );
  });
  const picked = pick === null ? undefined : setup.party[pick];
  const sheetBtn = button("SHEET", () => { if (picked) go("unit", picked); }, "sm");
  const removeBtn = button("REMOVE", () => { if (pick !== null && pick < setup.party.length) { setup.party.splice(pick, 1); pick = null; save(); refresh(); } }, "sm");
  sheetBtn.disabled = !picked;
  removeBtn.disabled = !picked;
  return [
    header("PARTY", () => go("home"), `${setup.party.length}/3`),
    win("",
      h("div", { class: "line" }, button("◀", () => setFormation(fi - 1), "sm"), h("span", { class: "grow center hi", onClick: () => go("formation") }, f.name), button("▶", () => setFormation(fi + 1), "sm")),
      h("div", { class: "text dim small wrap" }, f.text, f.statuses?.length ? ` ${f.statuses.map((s) => c.statuses.get(s)!.text).join(" ")}` : ""),
    ),
    h("div", { class: "cards" }, ...cards),
    h("div", { class: "btns" },
      sheetBtn,
      removeBtn,
      h("span", { class: "dim small text", style: "margin-left:auto;text-align:right;line-height:1.25rem" }, pick === null ? "Tap a slot, then a class. Tap two slots to swap." : picked ? "Tap a class to put it here, a slot to swap, or the slot again for its sheet." : "Tap a class to put it here."),
    ),
    win("scroll roster", h("div", { class: "grid" }, ...classes.map((k) => {
      const inParty = setup.party.includes(k.id);
      return h("div", { class: `cell${inParty ? " in" : ""}${picked === k.id ? " cur" : ""}`, onClick: () => tapClass(k.id) }, faceEl(k.id), h("span", { class: "trunc", style: "max-width:100%" }, shortName(k.id)));
    }))),
  ];
}

// ─── Formation: the ten to choose from ───
function formation(): Child[] {
  return [
    header("FORMATION", () => go("party")),
    win("list scroll", ...formations.map((fm) => {
      const cur = fm.id === setup.formation;
      return h("div", { class: `row${cur ? " cur" : ""}`, style: "min-height:3rem", onClick: () => { setup.formation = fm.id; save(); go("party"); } },
        h("span", { class: "cursor" }, cur ? "▶" : ""),
        h("div", { class: "grow trunc" }, h("div", { class: "line" }, fm.name), h("div", { class: "text dim small trunc" }, fm.text)));
    })),
  ];
}

// ─── Unit: a class's sheet, with its gear and ability order to change ───
let orderPick: number | null = null;
function unit(arg?: unknown): Child[] {
  const id = String(arg);
  if (!c.classes.has(id)) return home();
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
  const back = () => { orderPick = null; go(slot >= 0 ? "party" : "classes"); };
  const where = slot >= 0 ? h("span", { class: "hi small" }, `IN SLOT ${slot + 1}`) : setup.party.length < 3 ? button("ADD TO PARTY", () => { setup.party.push(id); pick = setup.party.length - 1; save(); go("party"); }, "sm hi") : h("span", { class: "dim small" }, "PARTY FULL");
  return [
    header(k.name, back, slot >= 0 ? button("REMOVE", () => { setup.party.splice(slot, 1); save(); go("party"); }, "sm") : null),
    win("", classHead(id, h("div", { class: "line", style: "min-height:1.75rem" }, where))),
    win("", statGrid(member.stats, k.stats, designer), sp.length ? h("div", { class: "text up small wrap", style: "margin-top:.25rem" }, ...sp.flatMap((s, i) => (i ? [" · ", s] : [s]))) : null),
    win("scroll",
      h("div", { class: "text dim wrap small" }, k.text),
      section("PASSIVE"),
      ...(k.passive ? passiveBlock(k.passive.name, k.passive.text, k.passive.statuses?.[0]) : passiveBlock("Einherjar", "", null)),
      section("GEAR", "tap to change"),
      ...(["weapon", "armor", "amulet"] as const).map((s) => gearRow(g[s] ? gearOf(g[s]) : null, s, member.stats, () => go("gear", { cls: id, slot: s }))),
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
  const fits = gearThatFits(c, id, slot);
  const choose = (gid: string | null) => {
    const g = { ...(setup.gear[id] ?? {}) };
    if (gid) g[slot] = gid;
    else delete g[slot];
    setup.gear[id] = g;
    save();
    go("unit", id);
  };
  return [
    header(`${className(id)} · ${slot}`, () => go("unit", id)),
    win("list scroll",
      slot !== "weapon" ? h("div", { class: `gear-row${!current ? " cur" : ""}`, onClick: () => choose(null) }, h("span", { class: "cursor" }, !current ? "▶" : ""), h("span", { class: "dim" }, "NOTHING")) : null,
      ...fits.map((gid) => {
        const r = gearRow(gearOf(gid), slot, member.stats, () => choose(gid), false);
        if (gid === current) r.classList.add("cur");
        r.prepend(h("span", { class: "cursor" }, gid === current ? "▶" : ""));
        return r;
      }),
    ),
    h("div", { class: "text dim small wrap" }, slot === "weapon" ? "A weapon sets the basic attack: its kind, speed and element. ★ is a powerful piece." : "Steps are +1 or +2 on the design's 1–5 scale; the numbers show 10 per point."),
  ];
}

// ─── Classes and the bestiary: lists, then sheets ───
function classesScreen(): Child[] {
  return [
    header("CLASSES", () => go("home")),
    win("list scroll", ...classes.map((k) => row([faceEl(k.id), h("div", { class: "grow trunc" }, h("div", { class: "line" }, k.name), h("div", { class: "text dim small trunc" }, role(k.text)))], () => { orderPick = null; go("unit", k.id); }, { cursor: false, cur: setup.party.includes(k.id), cls: "tall" }))),
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

// ─── Settings ───
function settings(): Child[] {
  const s = setup.settings;
  const toggle = (label: string, key: "sound" | "designer" | "autoContinue") => row([h("span", { class: "grow" }, label), h("span", { class: s[key] ? "good" : "dim" }, s[key] ? "ON" : "OFF")], () => { s[key] = !s[key]; save(); refresh(); }, { cursor: false });
  return [
    header("SETTINGS", () => go("home")),
    win("list",
      row([h("span", { class: "grow" }, "THEME"), h("span", null, s.theme.toUpperCase())], () => { s.theme = s.theme === "night" ? "day" : "night"; setTheme(s.theme); save(); refresh(); }, { cursor: false }),
      row([h("span", { class: "grow" }, "SPEED"), h("span", null, `${s.speed}×`)], () => { s.speed = s.speed === 1 ? 2 : s.speed === 2 ? 4 : 1; save(); refresh(); }, { cursor: false }),
      toggle("SOUND", "sound"),
      toggle("AUTO NEXT", "autoContinue"),
      toggle("DESIGNER", "designer"),
      row([h("span", { class: "grow" }, "NUMBERS"), h("span", null, s.bigNumbers ? "BIG" : "SMALL")], () => { s.bigNumbers = !s.bigNumbers; setDisplayDiv(s.bigNumbers ? 10 : 100); save(); refresh(); }, { cursor: false }),
      row([h("span", { class: "grow bad" }, "RESET ALL")], () => { reset(); setTheme(setup.settings.theme); setDisplayDiv(100); go("home"); }, { cursor: false }),
    ),
    h("div", { class: "text dim small wrap" }, "Speed is how fast a fight is told: each message holds the clock while it's on screen. In a fight, II pauses, STEP plays one message at a time, >> skips to the end. Designer view shows hidden enemy stats and worked-out numbers. Small numbers are 10 per point of the design's 1–5 scale; big are 100."),
  ];
}
