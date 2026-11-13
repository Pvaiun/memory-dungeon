/** The rogue screen's dispatcher, and the run's way through an act: the leader, the draft, the map, a fight in waiting. */
import { button, type Child, h, header, win } from "../dom.js";
import { current, lastRun, meta, nextSeed, saveRogue, setHeat, startRun, vitals } from "./state.js";
import { bossFoes, canManage, leaderKnown, type MapNode, reachable, rogue, type RogueRun } from "../../../src/rogue.js";
import { c, className, cls as classOf, disp, shortName } from "../content.js";
import { enemyThumb, faceEl, iconEl } from "../pixel.js";
import { abilityBlock, classHead, classPassive, ENEMY_STATS, enemyStats, section, sizeEl, statGrid } from "../sheet.js";
import { plainWeapon } from "../../../src/sim/parties.js";
import { setup } from "../state.js";
import { sfx } from "../battle/audio.js";
import { useSupply } from "../../../src/rogue/record.js";
import { sizeParts } from "../describe.js";
import { enemyDisplayName } from "../art.js";
import { campView, captiveView, chooseView, eventScreen, levelView, regionView, rewardView, roomView, shopView, trainView } from "./rooms.js";
import { overView } from "./end.js";
import { actions, confirm, frameEl, go, held, ICON, KIND_NAME, KIND_TEXT, partyActors, partyStrip, pickOrSave, redraw, ROMAN, scene, standoff, SUPPLY_ICON, SUPPLY_TEXT } from "./parts.js";

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
  // The ability each leader would set out knowing, shown before the pick (the run's dice are kept).
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
    win("", classHead(leaderPick, undefined, plainWeapon(c, leaderPick)), section("STARTS WITH"), ...knows(leaderPick).map((a) => abilityBlock(c.abilities.get(a)!, classOf(leaderPick!).stats))),
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
  // Each offer joins knowing one ability, rolled when offered and shown here.
  const knows = (id: string) => p.known?.[id] ?? [];
  return [
    header(`COMPANION ${n}/${rogue(c).config.start.picks}`, () => go("home")),
    partyStrip(run, false),
    h("div", { class: "cards" }, ...p.offers.map((id) => h("div", { class: `win card${draftPick === id ? " cur" : ""}`, onClick: () => { draftPick = id; redraw(); } },
      h("div", { class: "portrait" }, faceEl(id)), h("div", { class: "name" }, shortName(id)), h("div", { class: "codes small" }, knows(id).map((a) => c.abilities.get(a)!.name).join(", "))))),
    win("scroll", classHead(draftPick, undefined, plainWeapon(c, draftPick)), section("PASSIVE"), ...classPassive(draftPick), section("STARTS WITH"), ...knows(draftPick).map((a) => abilityBlock(c.abilities.get(a)!, classOf(draftPick!).stats)),
      section("LEARNS LATER"), ...c.classes.get(draftPick)!.abilities.filter((a) => !knows(draftPick!).includes(a)).map((a) => abilityBlock(c.abilities.get(a)!, classOf(draftPick!).stats)),
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
/** The supplies carried, one button each (on the map, the party screen and a fight's preview, wherever swaps are). */
export function supplyRow(run: RogueRun, after: () => void = redraw): HTMLElement | null {
  if (!run.supplies.length || !canManage(run)) return null;
  return h("div", { class: "btns" }, ...run.supplies.map((id) => button(h("span", null, iconEl(SUPPLY_ICON[id]), id.toUpperCase()), () => useSupplyView(run, id, after), "sm")));
}
function useSupplyView(run: RogueRun, id: "potion" | "tonic" | "phoenix", after: () => void = redraw) {
  if (id === "phoenix") {
    const down = run.roster.filter((m) => m.ko);
    if (!down.length) return confirm("NOBODY IS DOWN", "", "OK", () => {});
    return confirm("PHOENIX FEATHER", `${className(down[0].cls).toUpperCase()} UP, 50% HP`, "USE", () => { useSupply(c, run, id, down[0].cls); saveRogue(); sfx.heal(); after(); });
  }
  // The player picks who drinks it.
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
/** After a won fight, one supply of the two. */
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
 * count, its HP, ATK and DEF (and any special stat, such as Evasion), and its abilities with
 * their sizes, so a boss's big move can be planned for (Slay the Spire shows intents).
 */
export function foeLines(enemies: string[], foes: { hp?: number; power?: number } = {}): Child[] {
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
      statGrid(st, null, false, ENEMY_STATS),
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

/** The home menu's line for the rogue mode. */
export function rogueMenuLine(): string {
  const run = current();
  if (!run) return `${meta().owned.length} leaders · ${meta().wins} won`;
  const reg = rogue(c).regions.find((r) => r.id === run.region);
  return `Act ${ROMAN[run.act]}, ${reg?.name ?? ""}`;
}
