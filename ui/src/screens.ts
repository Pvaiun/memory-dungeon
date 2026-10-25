/**
 * The menus. Each screen is its own layout: a header, windows, and lists that
 * scroll inside their own box (never the whole screen). `go` switches screens;
 * the battle screen is battle/battle.ts.
 */
import { gearFor as gearThatFits } from "../../src/sim/parties.js";
import { c, className, classes, cls as classOf, dungeons, enemies, fightName, formations, gearOf, kindOf, runName, setDisplayDiv, shortName } from "./content.js";
import { enemyDisplayName } from "./art.js";
import { button, h, header, nav, row, settleBack, win, type Child } from "./dom.js";
import { abilitiesFor, gearFor, reset, save, setup } from "./state.js";
import { abilityBlock, basicLine, classHead, codeSpans, enemySheet, gearRow, memberFor, passiveBlock, portraitEl, role, section, specialLines, statGrid } from "./sheet.js";
import { enemyEl, enemyThumb } from "./pixel.js";
import { weaponOf } from "../../src/engine/combat/fight.js";
import { Strip, STRIP_H } from "./battle/scene.js";
import { startBattle, type BattleArgs } from "./battle/battle.js";
import { music, setMusic, setSound, sfx } from "./battle/audio.js";

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
  if (s !== current || !keepScroll) sfx.tap();
  if (s === "party" && current !== "party") (pickSlot = null), (pickClass = null);
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
  const screens: Record<Exclude<Screen, "battle">, (arg?: unknown) => Child[]> = { home, fight, party, formation, unit, gear, classes: classesScreen, bestiary, enemy, settings };
  screenEl.append(...(screens[s](arg).filter(Boolean) as Node[]));
  settleBack();
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
    ["settings", "SETTINGS", "Theme, speed, sound, music"],
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
/**
 * One selection at a time, a slot or a class, and every move resets to neutral:
 * slot then class puts the class there; class then slot does the same; slot then slot swaps them;
 * the same slot or class twice clears a slot's selection or opens the class's sheet.
 */
let pickSlot: number | null = null;
let pickClass: string | null = null;
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
  const fi = formations.findIndex((x) => x.id === setup.formation);
  const setFormation = (i: number) => { setup.formation = formations[(i + formations.length) % formations.length].id; save(); refresh(); };
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
    header("PARTY", () => go("home"), `${setup.party.length}/3`),
    win("",
      h("div", { class: "line" }, button("◀", () => setFormation(fi - 1), "sm"), h("span", { class: "grow center hi", onClick: () => go("formation") }, f.name), button("▶", () => setFormation(fi + 1), "sm")),
      h("div", { class: "text dim small wrap" }, f.text, f.statuses?.length ? ` ${f.statuses.map((s) => c.statuses.get(s)!.text).join(" ")}` : ""),
    ),
    h("div", { class: "cards" }, ...cards),
    h("div", { class: "btns" },
      sheetBtn,
      removeBtn,
      h("span", { class: "dim small text", style: "margin-left:auto;text-align:right;line-height:1.25rem" }, hint),
    ),
    win("scroll roster", h("div", { class: "grid" }, ...classes.map((k) => {
      const inP = setup.party.includes(k.id);
      return h("div", { class: `cell${inP ? " in" : ""}${pickClass === k.id ? " cur" : ""}`, onClick: () => tapClass(k.id) }, h("div", { class: "portrait" }, portraitEl(k.id)), h("span", { class: "trunc", style: "max-width:100%" }, shortName(k.id)));
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
/** The screen a sheet was opened from, for its back: the party screen or the class list. */
let unitFrom: Screen = "classes";
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
  const back = () => { orderPick = null; go(unitFrom); };
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
      slot !== "weapon" ? h("div", { class: `gear-row${!current ? " equipped" : ""}`, onClick: () => choose(null) }, h("span", { class: "art" }, ""), h("div", { class: "grow" }, h("div", { class: "line" }, h("span", { class: "dim grow" }, "NOTHING"), !current ? h("span", { class: "tag" }, "EQUIPPED") : null))) : null,
      ...fits.map((gid) => {
        const r = gearRow(gearOf(gid), slot, member.stats, () => choose(gid), false);
        if (gid === current) {
          r.classList.add("equipped");
          r.querySelector(".grow .line")?.append(h("span", { class: "tag" }, "EQUIPPED"));
        }
        return r;
      }),
    ),
    h("div", { class: "text dim small wrap" }, slot === "weapon" ? "A weapon sets the basic attack: its kind, speed and element. ★ is a powerful piece." : "The numbers are on the stat sheet's scale. ★ is a powerful piece."),
  ];
}

// ─── Classes and the bestiary: lists, then sheets ───
function classesScreen(): Child[] {
  return [
    header("CLASSES", () => go("home")),
    win("list scroll", ...classes.map((k) => row([h("div", { class: "portrait" }, portraitEl(k.id)), h("div", { class: "grow trunc" }, h("div", { class: "line" }, k.name), h("div", { class: "text dim small trunc" }, role(k.text)))], () => { orderPick = null; go("unit", k.id); }, { cursor: false, cur: setup.party.includes(k.id), cls: "tall" }))),
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
  const toggle = (label: string, key: "sound" | "music" | "designer" | "autoContinue" | "partyBars") => row([h("span", { class: "grow" }, label), h("span", { class: s[key] ? "good" : "dim" }, s[key] ? "ON" : "OFF")], () => { s[key] = !s[key]; if (key === "sound") setSound(s.sound); if (key === "music") setMusic(s.music); save(); refresh(); }, { cursor: false });
  return [
    header("SETTINGS", () => go("home")),
    win("list",
      row([h("span", { class: "grow" }, "THEME"), h("span", null, s.theme.toUpperCase())], () => { s.theme = s.theme === "night" ? "day" : "night"; setTheme(s.theme); save(); refresh(); }, { cursor: false }),
      row([h("span", { class: "grow" }, "SPEED"), h("span", null, `${s.speed}×`)], () => { s.speed = s.speed === 1 ? 2 : s.speed === 2 ? 4 : 1; save(); refresh(); }, { cursor: false }),
      toggle("SOUND", "sound"),
      toggle("MUSIC", "music"),
      toggle("AUTO NEXT", "autoContinue"),
      toggle("PARTY HP ON FIELD", "partyBars"),
      toggle("DESIGNER", "designer"),
      row([h("span", { class: "grow" }, "NUMBERS"), h("span", null, s.bigNumbers ? "BIG" : "SMALL")], () => { s.bigNumbers = !s.bigNumbers; setDisplayDiv(s.bigNumbers ? 10 : 100); save(); refresh(); }, { cursor: false }),
      row([h("span", { class: "grow" }, "PORTRAITS"), h("span", null, s.portraits.toUpperCase())], () => { s.portraits = s.portraits === "faces" ? "sprites" : s.portraits === "sprites" ? "mixed" : "faces"; save(); refresh(); }, { cursor: false }),
      row([h("span", { class: "grow bad" }, "RESET ALL")], () => { reset(); setTheme(setup.settings.theme); setDisplayDiv(100); go("home"); }, { cursor: false }),
    ),
    h("div", { class: "text dim small wrap" }, "Speed is how fast a fight is told: each message holds the clock while it's on screen. In a fight, II pauses, STEP plays one message at a time, >> skips to the end. Designer view shows hidden enemy stats and worked-out numbers. Small numbers are 10 per point of the design's 1–5 scale; big are 100. Portraits: faces everywhere, sprites everywhere, or mixed, with sprites in the party's slots and faces in the lists and rows. Party HP on field adds thin HP bars under the party in a fight, like the foes'."),
  ];
}
