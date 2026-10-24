/**
 * The menus, in a Game Boy frame: the field on top shows the party, a class
 * or an enemy; the panel below is a list of short rows. Each screen is a
 * function that returns its rows and what the field should show; `go` switches
 * screens.
 */
import { gearFor as gearThatFits } from "../../src/sim/parties.js";
import { c, changeCodes, classes, dungeons, enemies, fightName, formations, gearOf, kindOf, runName, setDisplayDiv, shortName, elementName } from "./content.js";
import { enemyDisplayName } from "./art.js";
import { button, clear, h, header, row, type Child } from "./dom.js";
import { abilitiesFor, classIds, gearFor, reset, save, setup } from "./state.js";
import { classSheet, enemySheet, memberFor, role, statGrid } from "./sheet.js";
import { faceEl, FIELD_H, FRAME_W, PALETTE_NAMES, setPalette } from "./pixel.js";
import { Showcase, type ShowSpec } from "./battle/scene.js";
import { startBattle, type BattleArgs } from "./battle/battle.js";

export type Screen = "home" | "fight" | "party" | "formation" | "gear" | "classes" | "bestiary" | "settings" | "battle";
type View = { rows: Child[]; show: ShowSpec };

let current: Screen = "home";
let currentArg: unknown;
let canvas: HTMLCanvasElement;
let panel: HTMLElement;
let showcase: Showcase | null = null;
let stopBattle: (() => void) | null = null;
let lastHome: Screen = "fight";

export function mount(app: HTMLElement) {
  canvas = h("canvas", { width: FRAME_W, height: FIELD_H });
  panel = h("div", { class: "panel" });
  app.append(h("div", { class: "frame" }, h("div", { class: "field" }, canvas), panel));
  go("home");
}

export function go(s: Screen, arg?: unknown, keepScroll = false) {
  const scroll = keepScroll && s === current ? panel.scrollTop : 0;
  stopBattle?.();
  stopBattle = null;
  showcase?.stop();
  showcase = null;
  current = s;
  currentArg = arg;
  clear(panel);
  panel.className = "panel";
  if (s === "battle") {
    panel.classList.add("fixed");
    stopBattle = startBattle(canvas, panel, arg as BattleArgs);
    return;
  }
  const screens: Record<Exclude<Screen, "battle">, (arg?: unknown) => View> = { home, fight, party, formation, gear, classes: classesScreen, bestiary, settings };
  const view = screens[s](arg);
  panel.append(...(view.rows.filter(Boolean) as Node[]));
  panel.scrollTop = scroll;
  showcase = new Showcase(canvas, view.show);
  showcase.start();
}
/** Re-renders the current screen after a change, keeping the scroll position. */
const refresh = () => go(current, currentArg, true);

const partyShow = (pick?: number): ShowSpec => ({ kind: "party", party: setup.party, formation: setup.formation, pick });
const seedRow = () => row(["SEED", h("span", { class: "r" }, String(setup.seed))], () => { setup.seed = Math.floor(Math.random() * 100000) + 1; save(); refresh(); }, { cursor: false });

// ─── Home ───
function home(): View {
  const items: [Screen, string][] = [["fight", "FIGHT"], ["party", "PARTY"], ["formation", "FORMATION"], ["gear", "GEAR"], ["classes", "CLASSES"], ["bestiary", "BESTIARY"], ["settings", "SETTINGS"]];
  return {
    show: partyShow(),
    rows: [
      h("div", { class: "line center", style: "justify-content:center" }, "MEMORY DUNGEON"),
      h("div", { class: "box list" }, ...items.map(([s, label]) => row([label], () => { lastHome = s; go(s); }, { cur: lastHome === s }))),
      h("div", { class: "line dim" }, h("span", { class: "trunc" }, setup.party.map(shortName).join(" ") || "NOBODY")),
    ],
  };
}

// ─── Fight: a run, or one of its fights ───
let lastRun = dungeons[0].id;
function fight(arg?: unknown): View {
  const runId = typeof arg === "string" ? arg : null;
  if (!setup.party.length) return { show: partyShow(), rows: [header("FIGHT", () => go("home")), h("div", { class: "box text" }, "Pick a party first.")] };
  if (!runId) {
    return {
      show: partyShow(),
      rows: [
        header("FIGHT", () => go("home")),
        h("div", { class: "box list" }, ...dungeons.map((d, i) => row([h("span", { class: "grow trunc" }, `${i + 1} ${runName(d)}`)], () => { lastRun = d.id; go("fight", d.id); }, { cur: lastRun === d.id }))),
        seedRow(),
      ],
    };
  }
  const d = c.dungeons.get(runId)!;
  const fights = d.stages.filter((s) => s.kind === "fight");
  return {
    show: partyShow(),
    rows: [
      header(runName(d), () => go("fight")),
      h("div", { class: "box list" },
        row([h("span", { class: "grow" }, "RUN ALL"), h("span", { class: "dim" }, `${fights.length}`)], () => go("battle", { dungeon: d.id }), { cur: true }),
        ...fights.map((s, i) => s.kind === "fight" ? row([h("span", { class: "grow trunc" }, `${i + 1} ${fightName(s)}`), h("span", { class: "dim" }, `${s.boss ? "★" : ""}${s.enemies.length}`)], () => go("battle", { dungeon: `${d.id}~${s.id}` })) : null),
      ),
      seedRow(),
    ],
  };
}

// ─── Party: pick up to 3 classes; the order is the formation slot order ───
function party(): View {
  const slots = [0, 1, 2].map((i) => {
    const id = setup.party[i];
    const move = (j: number) => { [setup.party[i], setup.party[j]] = [setup.party[j], setup.party[i]]; save(); refresh(); };
    return h("div", { class: "row static" },
      h("span", { class: "dim" }, `${i + 1}`),
      h("span", { class: "grow trunc" }, id ? shortName(id) : "---"),
      id ? h("span", { class: "btns", style: "gap:.25rem" },
        button("▲", () => { if (i > 0) move(i - 1); }, "sm"),
        button("▼", () => { if (i < setup.party.length - 1) move(i + 1); }, "sm"),
        button("×", () => { setup.party.splice(i, 1); save(); refresh(); }, "sm"),
      ) : null,
    );
  });
  const list = classes.map((k) => {
    const inParty = setup.party.includes(k.id);
    return row([faceEl(k.id), h("span", { class: "w8" }, shortName(k.id)), h("span", { class: "dim grow trunc" }, role(k.text))], () => {
      if (inParty) setup.party = setup.party.filter((x) => x !== k.id);
      else if (setup.party.length < 3) setup.party.push(k.id);
      else return;
      save();
      refresh();
    }, { cur: inParty, cursor: false });
  });
  return { show: partyShow(), rows: [header("PARTY", () => go("home")), h("div", { class: "box list" }, ...slots), h("div", { class: "box list" }, ...list)] };
}

// ─── Formation ───
function formation(): View {
  const f = c.formations.get(setup.formation)!;
  const info = h("div", { class: "box" },
    h("div", { class: "line" }, h("span", { class: "grow trunc" }, f.name)),
    h("div", { class: "text dim" }, f.text),
    ...f.positions.map((p, i) => h("div", { class: "line" }, h("span", { class: "dim" }, `${i + 1}`), h("span", { class: "grow trunc" }, p.name), h("span", { class: "trunc" }, changeCodes(p.stats) || "-"))),
    f.statuses?.length ? h("div", { class: "text dim" }, f.statuses.map((s) => c.statuses.get(s)!.text).join(" ")) : null,
  );
  const list = formations.map((fm) => row([h("span", { class: "grow trunc" }, fm.name)], () => { setup.formation = fm.id; save(); refresh(); }, { cur: fm.id === setup.formation }));
  return { show: partyShow(), rows: [header("FORMATION", () => go("home")), info, h("div", { class: "box list" }, ...list)] };
}

// ─── Gear and ability order, per party member ───
let gearTab = 0;
type Slot = "weapon" | "armor" | "amulet";
const SLOT_LABEL: Record<Slot, string> = { weapon: "WPN", armor: "ARM", amulet: "AMU" };
function gear(arg?: unknown): View {
  if (!setup.party.length) return { show: partyShow(), rows: [header("GEAR", () => go("home")), h("div", { class: "box text" }, "Pick a party first.")] };
  gearTab = Math.min(gearTab, setup.party.length - 1);
  const id = setup.party[gearTab];
  const current = gearFor(id);
  const slot = (arg as { slot?: Slot } | undefined)?.slot;
  if (slot) {
    const fits = gearThatFits(c, id, slot);
    const chosen = current[slot];
    const pick = (gid: string | null) => {
      const g = { ...(setup.gear[id] ?? {}) };
      if (gid) g[slot] = gid;
      else delete g[slot];
      setup.gear[id] = g;
      save();
      go("gear");
    };
    return {
      show: { kind: "actor", ref: id },
      rows: [
        header(`${shortName(id)} ${slot}`, () => go("gear")),
        h("div", { class: "box list" },
          slot !== "weapon" ? row([h("span", { class: "grow" }, "NOTHING")], () => pick(null), { cur: !chosen }) : null,
          ...fits.map((gid) => {
            const g = gearOf(gid);
            return row([h("div", { class: "line" }, h("span", { class: "cursor" }, chosen === gid ? "▶" : ""), h("span", { class: "grow trunc" }, `${g.tier === "powerful" ? "★" : ""}${g.name}`)), h("div", { class: "line dim", style: "padding-left:1.5rem" }, h("span", { class: "trunc" }, gearCodes(gid) || "-"))], () => pick(gid), { cur: chosen === gid, cursor: false, cls: "two" });
          }),
        ),
      ],
    };
  }
  const tabs = h("div", { class: "tabs" }, ...setup.party.map((cid, i) => button(shortName(cid), () => { gearTab = i; refresh(); }, i === gearTab ? "on" : "")));
  const slots = (["weapon", "armor", "amulet"] as Slot[]).map((s) => {
    const g = current[s] ? gearOf(current[s]) : null;
    return row([h("span", { class: "dim" }, SLOT_LABEL[s]), h("span", { class: "grow trunc" }, g ? `${g.tier === "powerful" ? "★" : ""}${g.name}` : "---")], () => go("gear", { slot: s }), { cursor: false });
  });
  const member = memberFor(id);
  const order = abilitiesFor(id);
  const swap = (i: number, j: number) => { const o = [...order]; [o[i], o[j]] = [o[j], o[i]]; setup.abilities[id] = o; save(); refresh(); };
  const abilities = order.map((a, i) => h("div", { class: "row static" },
    h("span", { class: "dim" }, `${i + 1}`),
    h("span", { class: "grow trunc" }, c.abilities.get(a)!.name),
    h("span", { class: "btns", style: "gap:.25rem" }, button("▲", () => { if (i > 0) swap(i, i - 1); }, "sm"), button("▼", () => { if (i < order.length - 1) swap(i, i + 1); }, "sm")),
  ));
  return {
    show: { kind: "actor", ref: id },
    rows: [
      header("GEAR", () => go("home")),
      tabs,
      h("div", { class: "box list" }, ...slots),
      h("div", { class: "box" }, statGrid(member.stats, null, false)),
      h("div", { class: "box list" }, h("div", { class: "line dim" }, "ORDER"), ...abilities),
    ],
  };
}

/** What a piece of gear does, in codes: a weapon's damage kind and speed, then stat changes. */
export function gearCodes(gid: string): string {
  const g = gearOf(gid);
  const parts: string[] = [];
  if (g.weapon?.kind) {
    const k = kindOf(g.weapon.kind);
    parts.push(`${(k.type === "magical" ? elementName(k.element ?? "") : k.subtype ?? "").toUpperCase()}/${k.cooldown}`);
  }
  const s = changeCodes(g.stats);
  if (s) parts.push(s);
  return parts.join(" ");
}

// ─── Classes: a list, then a sheet ───
function classesScreen(arg?: unknown): View {
  if (typeof arg === "string" && c.classes.has(arg)) {
    const k = c.classes.get(arg)!;
    return {
      show: { kind: "actor", ref: arg },
      rows: [header(k.name, () => go("classes"), role(k.text)), h("div", { class: "box" }, ...classSheet(arg, setup.settings.designer))],
    };
  }
  return {
    show: partyShow(),
    rows: [
      header("CLASSES", () => go("home")),
      h("div", { class: "box list" }, ...classes.map((k) => row([faceEl(k.id), h("span", { class: "w8" }, shortName(k.id)), h("span", { class: "dim grow trunc" }, role(k.text))], () => go("classes", k.id), { cursor: false, cur: setup.party.includes(k.id) }))),
    ],
  };
}

// ─── Bestiary ───
function bestiary(arg?: unknown): View {
  if (typeof arg === "string" && c.enemies.has(arg)) {
    const e = c.enemies.get(arg)!;
    const where = dungeons.flatMap((d) => d.stages.map((s, i) => (s.kind === "fight" && s.enemies.includes(e.id) ? `${runName(d)} ${i + 1}` : "")).filter(Boolean));
    return {
      show: { kind: "enemy", ref: arg },
      rows: [
        header(enemyDisplayName(e.id), () => go("bestiary"), e.rank),
        h("div", { class: "box" },
          e.name !== enemyDisplayName(e.id) ? h("div", { class: "line dim" }, h("span", { class: "trunc" }, `AKA ${e.name}`)) : null,
          ...enemySheet(e, setup.settings.designer),
          h("div", { class: "text dim wrap", style: "margin-top:.5rem" }, where.length ? `In: ${where.join(", ")}.` : "Summoned only."),
        ),
      ],
    };
  }
  return {
    show: partyShow(),
    rows: [
      header("BESTIARY", () => go("home")),
      h("div", { class: "box list" }, ...enemies.map((e) => row([h("span", { class: "grow trunc" }, enemyDisplayName(e.id)), h("span", { class: "dim" }, e.rank === "boss" ? "★BOSS" : e.rank)], () => go("bestiary", e.id), { cursor: false }))),
    ],
  };
}

// ─── Settings ───
const TICKS = [250, 500, 750, 1000];
function settings(): View {
  const s = setup.settings;
  const toggle = (label: string, key: "sound" | "designer" | "autoContinue") => row([h("span", { class: "grow" }, label), h("span", null, s[key] ? "ON" : "OFF")], () => { s[key] = !s[key]; save(); refresh(); }, { cursor: false });
  return {
    show: partyShow(),
    rows: [
      header("SETTINGS", () => go("home")),
      h("div", { class: "box list" },
        row([h("span", { class: "grow" }, "PALETTE"), h("span", null, s.palette)], () => { s.palette = PALETTE_NAMES[(PALETTE_NAMES.indexOf(s.palette) + 1) % PALETTE_NAMES.length]; setPalette(s.palette); save(); refresh(); }, { cursor: false }),
        row([h("span", { class: "grow" }, "TICK"), h("span", null, `${s.tickMs}MS`)], () => { s.tickMs = TICKS[(TICKS.indexOf(s.tickMs) + 1) % TICKS.length] ?? 500; save(); refresh(); }, { cursor: false }),
        toggle("SOUND", "sound"),
        toggle("AUTO NEXT", "autoContinue"),
        toggle("DESIGNER", "designer"),
        row([h("span", { class: "grow" }, "NUMBERS"), h("span", null, s.bigNumbers ? "BIG" : "SMALL")], () => { s.bigNumbers = !s.bigNumbers; setDisplayDiv(s.bigNumbers ? 10 : 100); save(); refresh(); }, { cursor: false }),
        row([h("span", { class: "grow" }, "RESET ALL")], () => { reset(); setPalette(setup.settings.palette); setDisplayDiv(100); go("home"); }, { cursor: false }),
      ),
      h("div", { class: "text dim" }, "Designer view shows hidden enemy stats and worked-out numbers. Small numbers are 10 per point of the design's 1–5 scale; big are 100."),
    ],
  };
}

export const classList = classIds;
