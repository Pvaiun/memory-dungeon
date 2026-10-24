/**
 * The battle screen: the field on top, the party's rows, the foes, the message
 * box and the controls. The fight is told in beats (narrate.ts): each beat's
 * lines appear one after another and hold the clock while they're read, so
 * what happens on the field and what the box says are the same thing at the
 * same time. The speed buttons scale the hold; pause and STEP let the director
 * tap through a fight one beat at a time; >> plays the rest at once.
 */
import { SUBTICKS } from "../../../src/schema.js";
import type { CUnit } from "../../../src/engine/combat/fight.js";
import { weaponOf } from "../../../src/engine/combat/fight.js";
import { c, className, disp, elementName, fightName, runName } from "../content.js";
import { ELEMENT_COLOR, enemyDisplayName, enemyName, STATUS_STYLE, TAG_ICON, type Pose } from "../art.js";
import { bar, button, clear, h, win, type Child } from "../dom.js";
import { party as partyLoadout, setup } from "../state.js";
import { abilityTag, weaponInfo } from "../describe.js";
import { drawGlyph, faceEl, glyphEl, iconEl } from "../pixel.js";
import { classSheet, enemySheet } from "../sheet.js";
import { Driver, type Ev } from "./driver.js";
import { Narrator, type Beat, type Line, type Tone } from "./narrate.js";
import { Scene, shieldOf, shownStatuses, W, H } from "./scene.js";
import { setSound, sfx } from "./audio.js";
import { go } from "../screens.js";

export type BattleArgs = { dungeon: string; seed?: number };

/** Engine milliseconds per tick at 1×, and the reading times a beat holds for. */
const TICK_MS = 500;
const BEAT_BASE = 420, BEAT_LINE = 380, LINE_GAP = 240;
const SPEEDS = [1, 2, 4] as const;

type Hist = { tick: number; text: string; tone: Tone; tag?: string };

export function startBattle(frame: HTMLElement, screen: HTMLElement, args: BattleArgs): () => void {
  const seed = args.seed ?? setup.seed;
  const dungeon = c.dungeons.get(args.dungeon);
  const fail = (msg: string) => {
    screen.append(win("", h("div", { class: "text wrap" }, msg), h("div", { class: "btns", style: "margin-top:.5rem" }, button("MENU", () => go("home")))));
    return () => {};
  };
  if (!dungeon) return fail(`No dungeon '${args.dungeon}'.`);
  let driver: Driver;
  try {
    driver = new Driver({ dungeon: args.dungeon, party: partyLoadout(), seed, firstClear: true });
  } catch (e) {
    return fail(`The party can't enter: ${(e as Error).message}`);
  }
  const theme = args.dungeon.split("~")[0];
  const single = args.dungeon.includes("~");

  // ─── DOM ───
  const canvas = h("canvas", { class: "field", width: W, height: H });
  canvas.style.height = `${H / 8}rem`;
  const partyEl = win("party list");
  const foesEl = win("foes");
  const linesEl = h("div", { class: "lines" });
  const msgEl = win("msg", linesEl);
  const inspectEl = win("inspect", "");
  inspectEl.style.display = "none";
  const tick = h("span", { class: "tick" }, "T", h("b", null, "0"));
  const ctl = h("div", { class: "ctl" });
  screen.append(canvas, partyEl, foesEl, msgEl, inspectEl, ctl);
  setSound(setup.settings.sound);

  const scene = new Scene(canvas, driver, theme);
  const nameOf = (id: string): string => {
    const u = driver.unit(id);
    return u ? (u.side === "party" ? className(u.ref) : enemyName(u.ref, u.name)) : id;
  };
  const narrator = new Narrator({ unit: (id) => driver.unit(id), name: nameOf });

  // ─── Clock, speed and beats ───
  let speed: number = SPEEDS.includes(setup.settings.speed as 1 | 2 | 4) ? setup.settings.speed : 1;
  let paused = false;
  let stepping = false;
  let vwall = 0;
  let lastFrame = performance.now();
  let raf = 0;
  let stopped = false;
  let introUntil = 0;
  const queue: Beat[] = [];
  type Playing = { beat: Beat; start: number; shown: number; hold: number };
  let playing: Playing | null = null;
  const history: Hist[] = [];

  const pauseBtn = button("II", () => { paused = !paused; stepping = false; renderCtl(); });
  const stepBtn = button("STEP", () => { paused = true; stepping = true; renderCtl(); });
  const speedBtns = SPEEDS.map((s) => button(`${s}×`, () => { speed = s; setup.settings.speed = s; renderCtl(); }));
  const renderCtl = () => {
    pauseBtn.textContent = paused ? "▶" : "II";
    pauseBtn.className = paused ? "on" : "";
    speedBtns.forEach((b, i) => (b.className = SPEEDS[i] === speed ? "on" : ""));
  };
  ctl.append(button("◀", () => { stop(); go("home"); }), pauseBtn, stepBtn, ...speedBtns, button(">>", () => fastForward()), tick);
  renderCtl();

  /** Pulls what the engine logged into beats. */
  function pull(flush = true) {
    for (const ev of driver.pending.splice(0)) narrator.push(ev);
    if (flush) narrator.flush();
    queue.push(...narrator.take());
  }
  function holdFor(b: Beat) {
    return (BEAT_BASE + BEAT_LINE * b.weight + LINE_GAP * (b.lines.length - 1)) / speed;
  }
  function startBeat(b: Beat) {
    for (const el of linesEl.children) el.classList.add("old");
    playing = { beat: b, start: vwall, shown: 0, hold: holdFor(b) };
    if (b.kind === "intro") introUntil = vwall + Math.max(1800, playing.hold);
  }
  function stepBeat() {
    if (!playing) return;
    const p = playing;
    const elapsed = vwall - p.start;
    while (p.shown < p.beat.lines.length && elapsed >= (p.shown * LINE_GAP) / speed) {
      showLine(p.beat.lines[p.shown], p.beat);
      p.shown++;
    }
    if (p.shown >= p.beat.lines.length && elapsed >= p.hold) {
      playing = null;
      if (stepping) {
        stepping = false;
        paused = true;
        renderCtl();
      }
    }
  }

  // ─── Messages ───
  function showLine(line: Line, beat: Beat) {
    const el = h("div", { class: `l ${line.tone}` }, line.tag && TAG_ICON[line.tag] ? iconEl(TAG_ICON[line.tag]) : null, h("span", null, line.text));
    linesEl.append(el);
    while (linesEl.children.length > 12) linesEl.firstChild!.remove();
    history.push({ tick: Math.floor(beat.at / SUBTICKS), text: line.text, tone: line.tone, tag: line.tag });
    if (history.length > 600) history.shift();
    for (const ev of line.events) show(ev);
  }
  msgEl.addEventListener("click", () => openLog());

  // ─── Events → visuals ───
  const lastStatusFx = new Map<string, number>();
  const elementOf = (ev: Ev): string | null => {
    const src = String(ev.src);
    if (src === "basic") {
      const u = driver.unit(String(ev.by));
      return u ? weaponInfo(weaponOf(c, u.weapon), null).element ?? null : null;
    }
    const ab = c.abilities.get(src);
    if (!ab) return null;
    const tag = abilityTag(ab);
    return ELEMENT_COLOR[tag] ? tag : null;
  };
  function show(ev: Ev) {
    const at = ev.at as number | undefined;
    switch (ev.t) {
      case "fight_start": {
        scene.sync();
        buildRows();
        foesKey = "";
        const stage = dungeon!.stages.find((s) => s.id === ev.stage);
        const name = fightName(stage?.kind === "fight" ? stage : { id: String(ev.stage) });
        const where = single ? "" : `${driver.fightNo}/${driver.fightTotal}`;
        scene.showBanner(name.toUpperCase(), where, 1800);
        break;
      }
      case "cast": {
        const v = scene.units.get(String(ev.by));
        if (v) v.cast = { name: String(ev.name), start: at!, end: ev.ends as number };
        if (v?.side === "party") scene.pose(v.id, "chant", 0);
        sfx.cast();
        break;
      }
      case "act": {
        const by = String(ev.by);
        const v = scene.units.get(by);
        if (v) v.cast = null;
        const targets = ev.targets as string[];
        const isBasic = ev.kind === "basic";
        const ab = isBasic ? null : c.abilities.get(String(ev.act));
        const tag = narrator.tagOf(by, String(ev.act));
        if (v?.side === "party") scene.pose(by, poseFor(isBasic, tag), 520);
        scene.lunge(by);
        const fxTag = isBasic && tag === "pierce" && driver.unit(by) && c.gear.get(driver.unit(by)!.weapon)?.weapon?.kind === "bow" ? "arrow" : tag;
        for (const t of targets) scene.effectFor(t, fxTag, targets.length <= 2);
        if (!isBasic && ELEMENT_COLOR[tag]) sfx.magic();
        void ab;
        break;
      }
      case "fail":
        scene.number(String(ev.by), ev.why === "mp" ? "NO MP" : "NO TARGET", { color: "#8e99b8" });
        break;
      case "dmg":
        showDamage(ev);
        break;
      case "heal": {
        const amount = ev.amount as number;
        const src = String(ev.src);
        const isStatus = c.statuses.has(src);
        if (isStatus && disp(amount) <= 0) break;
        const target = String(ev.target);
        scene.number(target, `+${disp(amount)}`, { color: "#7ee07e", big: !isStatus, glyph: src === "regen" ? "regen" : undefined, sub: ev.word === "ABSORB" ? "ABSORB" : ev.crit ? "CRITICAL" : undefined });
        if (!isStatus) {
          scene.effectFor(target, "heal");
          sfx.heal();
        }
        break;
      }
      case "status": {
        const d = c.statuses.get(String(ev.status))!;
        if (d.show !== "icon") break;
        const unit = String(ev.unit);
        const style = STATUS_STYLE[d.id] ?? STATUS_STYLE.generic;
        scene.number(unit, d.name, { color: style.color, glyph: d.id });
        const key = `${unit}:${d.id}`;
        if (vwall - (lastStatusFx.get(key) ?? -9999) > 700) {
          lastStatusFx.set(key, vwall);
          scene.effectFor(unit, d.id === "shield" ? "shield" : d.label === "buff" ? "buff" : "debuff");
          sfx.status();
        }
        break;
      }
      case "immune":
        scene.number(String(ev.unit), "IMMUNE", { color: "#8e99b8" });
        break;
      case "interrupt": {
        const v = scene.units.get(String(ev.unit));
        if (v) v.cast = null;
        scene.number(String(ev.unit), "STOPPED", { color: "#ff7b6b" });
        break;
      }
      case "down": {
        const u = driver.unit(String(ev.unit));
        if (u?.side === "party") scene.number(u.id, "DOWN", { color: "#ff7b6b", big: true });
        scene.down(String(ev.unit));
        sfx.down();
        break;
      }
      case "revive":
        scene.revive(String(ev.unit));
        scene.number(String(ev.unit), `+${disp(ev.hp as number)}`, { color: "#7ee07e", sub: "UP" });
        scene.effectFor(String(ev.unit), "revive", true);
        sfx.heal();
        break;
      case "join": {
        const u = ev.unit as { id: string };
        scene.sync();
        scene.effectFor(u.id, "summon");
        foesKey = "";
        break;
      }
      case "leave":
        scene.effectFor(String(ev.unit), "split");
        scene.leave(String(ev.unit));
        foesKey = "";
        break;
      case "strike":
        scene.effectFor(String(ev.target), ev.status === "arc" ? "lightning" : "slash");
        break;
      case "fight_end":
        if (ev.result === "won") {
          scene.showBanner("VICTORY", "", 2500);
          sfx.win();
          for (const u of driver.units()) if (u.side === "party" && !u.ko) scene.pose(u.id, "victory", 2500);
        } else {
          scene.showBanner("DEFEAT", "", 2500);
          sfx.lose();
        }
        break;
      default:
        break;
    }
  }

  function poseFor(isBasic: boolean, tag: string): Pose {
    if (isBasic) return tag === "pierce" || tag === "arrow" ? "thrust" : tag === "slash" || tag === "blunt" || tag === "bite" ? "swing" : "spell";
    if (["slash", "pierce", "blunt"].includes(tag)) return "skill";
    if (["heal", "revive", "cleanse", "buff", "shield", "dispel", "debuff"].includes(tag)) return "item";
    return "spell";
  }

  function showDamage(ev: Ev) {
    const target = String(ev.target);
    const amount = ev.amount as number;
    const soaked = (ev.soaked as number) || 0;
    const word = ev.word as string | null;
    const part = ev.part as string;
    const src = String(ev.src);
    const isStatus = part === "pulse" || part === "reaction";
    if (word === "MISS") {
      scene.number(target, "MISS", { color: "#c8d0e8" });
      sfx.miss();
      return;
    }
    if (word === "AEGIS" || word === "IMMUNE" || word === "BLOCKED") {
      scene.number(target, word === "BLOCKED" ? "BLOCK" : word, { color: word === "AEGIS" ? "#ffd54a" : "#c8d0e8" });
      if (word !== "IMMUNE") sfx.block();
      return;
    }
    const crit = !!ev.crit;
    const shown = disp(amount + soaked);
    if (isStatus && shown <= 0) return;
    const el = isStatus ? null : elementOf(ev);
    const style = isStatus ? STATUS_STYLE[src] : null;
    const color = crit ? "#ffd54a" : style ? style.color : el ? ELEMENT_COLOR[el] : "#ffffff";
    const sub = crit ? "CRITICAL" : word === "WEAK" ? "WEAK!" : word === "RESIST" ? "RESIST" : soaked && amount ? "SHIELD" : soaked ? "SOAKED" : undefined;
    scene.number(target, `${shown}${crit ? "!" : ""}`, { color, big: !isStatus, sub, subColor: crit ? "#ffd54a" : word === "WEAK" ? "#ff7b6b" : word === "RESIST" ? "#8e99b8" : "#a8e8ff", glyph: isStatus && STATUS_STYLE[src] ? src : undefined });
    if (!isStatus || amount >= 100) scene.hit(target);
    if (!isStatus) (crit ? sfx.crit : sfx.hit)();
    else sfx.status();
    if (isStatus && (src === "burn" || src === "poison" || src === "shock")) scene.effectFor(target, src);
  }

  // ─── Party rows ───
  type Row = { el: HTMLElement; hp: HTMLElement; hpNum: HTMLElement; mp: HTMLElement; mpNum: HTMLElement; glyphs: HTMLCanvasElement; key: string; bars: string };
  const rows = new Map<string, Row>();
  function buildRows() {
    clear(partyEl);
    rows.clear();
    for (const u of driver.units().filter((x) => x.side === "party")) {
      const hp = bar(1, "hp"), mp = bar(1, "mp", 0, true);
      const hpNum = h("div", { class: "num" }), mpNum = h("div", { class: "num mp" });
      const glyphs = h("canvas", { class: "px glyphs", width: 90, height: 10 });
      glyphs.style.width = "11.25rem";
      glyphs.style.height = "1.25rem";
      const el = h("div", { class: "member", onClick: () => select(scene.selected === u.id ? null : u.id) },
        faceEl(u.ref), h("div", { class: "name" }, className(u.ref)), hp, hpNum,
        glyphs, mp, mpNum,
      );
      partyEl.append(el);
      rows.set(u.id, { el, hp, hpNum, mp, mpNum, glyphs, key: "", bars: "" });
    }
  }
  function updateRows() {
    for (const u of driver.units()) {
      const r = rows.get(u.id);
      if (!r) continue;
      const max = u.stats.max_hp;
      const sh = shieldOf(u);
      const barsKey = `${u.hp}|${u.mp}|${sh}|${u.ko}`;
      if (barsKey !== r.bars) {
        r.bars = barsKey;
        const share = Math.max(0, u.hp / max);
        const fill = r.hp.firstElementChild as HTMLElement;
        fill.style.width = `${share * 100}%`;
        fill.className = share <= 0.25 ? "low" : share <= 0.5 ? "mid" : "";
        let shEl = r.hp.querySelector("i.sh") as HTMLElement | null;
        if (sh > 0) {
          if (!shEl) r.hp.append((shEl = h("i", { class: "sh" })));
          shEl.style.left = `${share * 100}%`;
          shEl.style.width = `${Math.min(1 - share, sh / max) * 100}%`;
        } else shEl?.remove();
        r.hpNum.textContent = u.ko ? "KO" : String(disp(u.hp));
        (r.mp.firstElementChild as HTMLElement).style.width = `${Math.max(0, u.mp / Math.max(1, u.stats.max_mp)) * 100}%`;
        r.mpNum.textContent = String(disp(u.mp));
        r.el.classList.toggle("ko", u.ko);
      }
      r.el.classList.toggle("sel", scene.selected === u.id);
      const sts = u.ko ? [] : shownStatuses(u);
      const key = sts.map((s) => `${s.id}:${s.count}`).join("|");
      if (key !== r.key) {
        r.key = key;
        const g = r.glyphs.getContext("2d")!;
        g.clearRect(0, 0, 90, 10);
        sts.slice(0, 9).forEach((s, i) => drawGlyph(g, s.id, i * 10, 0, s.count));
      }
    }
  }

  // ─── Foes ───
  let foesKey = "";
  function updateFoes() {
    const foes = driver.units().filter((u) => u.side === "enemy" && !u.gone);
    const groups = new Map<string, { alive: number; total: number; first: string | null; ids: string[]; boss: boolean }>();
    for (const u of foes) {
      const g = groups.get(u.ref) ?? { alive: 0, total: 0, first: null, ids: [], boss: c.enemies.get(u.ref)?.rank === "boss" };
      g.total++;
      g.ids.push(u.id);
      if (!u.ko) {
        g.alive++;
        g.first ??= u.id;
      }
      groups.set(u.ref, g);
    }
    const key = [...groups].map(([r, g]) => `${r}:${g.alive}/${g.total}`).join("|") + `|${scene.selected}`;
    if (key === foesKey) return;
    foesKey = key;
    clear(foesEl);
    for (const [ref, g] of groups) {
      const label = `${g.boss ? "★" : ""}${enemyDisplayName(ref)}${g.total > 1 ? ` ×${g.alive}` : ""}`;
      const sel = scene.selected !== null && g.ids.includes(scene.selected);
      foesEl.append(h("span", { class: `${g.alive ? "" : "dead"}${sel ? " sel" : ""}`, onClick: () => { if (g.first) select(scene.selected === g.first ? null : g.first); } }, label));
    }
    if (!groups.size) foesEl.append(h("span", { class: "dim" }, "NO FOES"));
  }

  // ─── Inspect ───
  let inspectAt = 0;
  let inspectKey = "";
  function select(id: string | null) {
    scene.selected = id;
    foesKey = "";
    inspectKey = "";
    renderInspect(true);
  }
  function renderInspect(force = false) {
    const id = scene.selected;
    const u = id ? driver.unit(id) : undefined;
    if (!u) {
      inspectEl.style.display = "none";
      msgEl.style.display = "";
      return;
    }
    if (!force && vwall - inspectAt < 250) return;
    inspectAt = vwall;
    const vt = driver.vt;
    const isParty = u.side === "party";
    const designer = setup.settings.designer;
    const sh = shieldOf(u);
    const key = `${u.id}|${u.hp}|${u.mp}|${u.ko}|${sh}|${u.statuses.map((s) => `${s.id}:${s.stacks}:${s.end}`).join(",")}|${u.acts.map((a) => a.ready).join(",")}|${u.cast?.act}|${Math.floor(vt / SUBTICKS)}`;
    if (key === inspectKey) return;
    inspectKey = key;
    inspectEl.style.display = "";
    msgEl.style.display = "none";
    clear(inspectEl);
    inspectEl.append(h("div", { class: "line" },
      h("span", { class: "grow trunc" }, nameOf(u.id)),
      h("span", null, u.ko ? "KO" : `♥${disp(u.hp)}/${disp(u.stats.max_hp)}`),
      isParty || designer ? h("span", { class: "buff" }, `MP${disp(u.mp)}`) : null,
      button("×", () => select(null), "sm"),
    ));
    const sts = h("div", { class: "sts" });
    for (const s of u.statuses) {
      const d = c.statuses.get(s.id)!;
      if (d.show !== "icon") continue;
      const n = d.stacking === "intensity" ? (d.absorb ? disp(Math.floor(s.stacks / SUBTICKS)) : Math.floor(s.stacks / SUBTICKS)) : null;
      const left = s.end === -1 ? "" : `${Math.max(0, Math.ceil((s.end - vt) / SUBTICKS))}T`;
      sts.append(h("div", { class: "st" }, glyphEl(s.id, null, 2), h("span", { class: d.label === "buff" ? "buff" : "debuff" }, d.name), n !== null ? h("span", null, d.absorb ? `${n} PTS` : `×${n}`) : null, h("span", { class: "t" }, left)));
    }
    if (!sts.children.length) sts.append(h("div", { class: "st dim" }, "NO STATUSES"));
    inspectEl.append(sts);
    const acts = h("div", { class: "acts" });
    if (isParty || designer) {
      u.acts.forEach((a, i) => {
        const name = a.id === "basic" ? "ATTACK" : c.abilities.get(a.id)!.name;
        const casting = u.cast?.act === i;
        const left = Math.max(0, (a.ready - vt) / SUBTICKS);
        const tag = narrator.tagOf(u.id, a.id);
        acts.append(h("div", { class: "st" }, TAG_ICON[tag] ? iconEl(TAG_ICON[tag]) : null, h("span", { class: "trunc" }, name), h("span", { class: `t ${casting ? "hi" : left > 0 ? "" : "good"}` }, casting ? "CASTING…" : left > 0 ? `${Math.ceil(left)}T` : "READY")));
      });
    } else {
      const e = c.enemies.get(u.ref)!;
      for (const aid of e.abilities ?? []) {
        const a = c.abilities.get(aid)!;
        const casting = u.cast !== null && u.acts[u.cast.act]?.id === aid;
        acts.append(h("div", { class: "st" }, TAG_ICON[abilityTag(a)] ? iconEl(TAG_ICON[abilityTag(a)]) : null, h("span", { class: "trunc" }, a.name), h("span", { class: `t ${casting ? "hi" : ""}` }, casting ? "CASTING…" : "")));
      }
      const w = weaponInfo(e.weapon ?? c.pack.ruleset.unarmed, null);
      acts.append(h("div", { class: "st" }, TAG_ICON[w.tag] ? iconEl(TAG_ICON[w.tag]) : null, h("span", { class: "trunc" }, "ATTACK"), h("span", { class: `t ${u.cast === null && u.acts.some((a) => a.id === "basic" && a.ready <= vt) ? "good" : ""}` }, `${(w.type === "magical" ? elementName(w.element ?? "") : w.subtype ?? "").toUpperCase()} /${w.cooldown}T`)));
    }
    inspectEl.append(acts);
    if (designer && !isParty) inspectEl.append(h("div", { class: "line dim" }, `ATK${disp(u.stats.attack)} MAG${disp(u.stats.magic)} ARM${disp(u.stats.armor)}`));
    inspectEl.append(h("div", { class: "btns", style: "margin-top:.25rem" }, button("SHEET", () => openSheet(u), "sm"), button("LOG", () => openLog(), "sm")));
  }

  // ─── Overlays: the log, a sheet ───
  let overlay: HTMLElement | null = null;
  function closeOverlay() {
    overlay?.remove();
    overlay = null;
  }
  function openOverlay(title: string, body: Child, onClose?: () => void): HTMLElement {
    closeOverlay();
    const box = win("scroll", body);
    overlay = h("div", { class: "overlay" }, h("div", { class: "hdr" }, h("span", { class: "title" }, title), button("×", () => { closeOverlay(); onClose?.(); }, "sm")), box);
    frame.append(overlay);
    return box;
  }
  function openLog() {
    const body = h("div", { class: "log" });
    let lastTick = -1;
    for (const l of history) {
      body.append(h("div", { class: `l ${l.tone}` }, h("span", { class: "t" }, l.tick !== lastTick ? `T${l.tick}` : ""), l.tag && TAG_ICON[l.tag] ? iconEl(TAG_ICON[l.tag]) : null, h("span", null, l.text)));
      lastTick = l.tick;
    }
    if (!history.length) body.append(h("div", { class: "l dim" }, "NOTHING YET"));
    const box = openOverlay("LOG", body);
    box.scrollTop = box.scrollHeight;
  }
  function openSheet(u: CUnit) {
    const wasPaused = paused;
    paused = true;
    renderCtl();
    const body = u.side === "party" ? classSheet(u.ref, setup.settings.designer) : enemySheet(c.enemies.get(u.ref)!, setup.settings.designer);
    openOverlay(nameOf(u.id), h("div", null, ...body), () => { paused = wasPaused; renderCtl(); });
  }

  // ─── Field input ───
  canvas.addEventListener("click", onTap);
  function onTap(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
    const hit = scene.hitTest(x, y);
    select(hit && hit === scene.selected ? null : hit);
  }

  // ─── Flow ───
  let ended = false;
  type Tally = { dealt: number; taken: number; healed: number; acts: number };
  function endOfFight() {
    if (ended) return;
    ended = true;
    const f = driver.fight!;
    const partyUnits = driver.units().filter((u) => u.side === "party");
    const tally = fightTally();
    const won = f.result === "won";
    const last = single || driver.fightNo >= driver.fightTotal;
    const table = h("table", { class: "sum" },
      h("thead", null, h("tr", null, h("th", null, ""), h("th", null, "DEALT"), h("th", null, "TAKEN"), h("th", null, "HP"))),
      h("tbody", null, ...partyUnits.map((u) => {
        const t = tally.get(u.id) ?? { dealt: 0, taken: 0, healed: 0, acts: 0 };
        return h("tr", null, h("td", null, className(u.ref)), h("td", null, String(disp(t.dealt))), h("td", null, String(disp(t.taken))), h("td", { class: u.ko ? "bad" : "" }, u.ko ? "KO" : String(disp(u.hp))));
      })),
    );
    const title = won ? (last ? (single ? "VICTORY" : "RUN CLEARED") : "VICTORY") : "DEFEAT";
    const where = single ? "" : `${driver.fightNo}/${driver.fightTotal}`;
    const btns: Child[] = won
      ? [last ? null : button("NEXT", () => nextFight(), "hi"), button("AGAIN", () => restart(seed)), button("NEW SEED", () => restart(Math.floor(Math.random() * 100000) + 1)), button("MENU", () => { stop(); go("home"); })]
      : [button("RETRY", () => restart(seed), "hi"), button("NEW SEED", () => restart(Math.floor(Math.random() * 100000) + 1)), button("MENU", () => { stop(); go("home"); })];
    const box = win("summary",
      h("div", { class: "line" }, h("span", { class: `grow ${won ? "good" : "bad"}` }, title), h("span", { class: "dim" }, `${where} T${f.round}`)),
      table,
      h("div", { class: "btns", style: "margin-top:.5rem" }, ...btns, button("LOG", () => openLog())),
    );
    setTimeout(() => {
      if (stopped || !ended) return;
      for (const el of [msgEl, inspectEl, ctl]) el.style.display = "none";
      screen.append(box);
    }, 900);
    if (won && !last && setup.settings.autoContinue) setTimeout(() => { if (!stopped && ended) nextFight(); }, 2200);
  }
  /** Damage dealt and taken, healing done and actions resolved, per unit, from this fight's log. */
  function fightTally(): Map<string, Tally> {
    const log = driver.run.log!;
    let start = log.length - 1;
    while (start > 0 && log[start].t !== "fight_start") start--;
    const m = new Map<string, Tally>();
    const get = (id: string) => { let t = m.get(id); if (!t) m.set(id, (t = { dealt: 0, taken: 0, healed: 0, acts: 0 })); return t; };
    for (let i = start; i < log.length; i++) {
      const e = log[i];
      if (e.t === "dmg") {
        const amount = ((e.amount as number) || 0) + ((e.soaked as number) || 0);
        if (e.by) get(e.by as string).dealt += amount;
        get(e.target as string).taken += amount;
      } else if (e.t === "heal") {
        if (e.by) get(e.by as string).healed += (e.amount as number) || 0;
      } else if (e.t === "act") get(e.by as string).acts++;
    }
    return m;
  }
  function nextFight() {
    screen.querySelector(".summary")?.remove();
    for (const el of [msgEl, ctl]) el.style.display = "";
    ended = false;
    queue.length = 0;
    playing = null;
    scene.units.clear();
    scene.clearTransient();
    select(null);
    driver.continueRun();
    pull();
    if (driver.phase === "run_won" || driver.phase === "run_lost") {
      screen.append(win("", h("div", { class: "line" }, driver.phase === "run_won" ? "RUN CLEARED" : "RUN LOST"), h("div", { class: "btns" }, button("MENU", () => { stop(); go("home"); }))));
    }
  }
  function restart(newSeed: number) {
    stop();
    go("battle", { dungeon: args.dungeon, seed: newSeed });
  }
  /** Plays the rest of the fight at once: the log gets every line, the box the last few. */
  function fastForward() {
    if (!driver.fight || driver.fight.result) return;
    driver.startFighting();
    if (playing) {
      for (let i = playing.shown; i < playing.beat.lines.length; i++) showLine(playing.beat.lines[i], playing.beat);
      playing = null;
    }
    const f = driver.fight;
    let guard = 0;
    while (!f.result && guard++ < 100000) {
      driver.advance(1e9);
      pull();
      drainQuiet();
    }
    pull();
    drainQuiet();
    scene.clearTransient();
    scene.sync();
    driver.advance(0);
    updateRows();
    endOfFight();
  }
  /** Shows queued beats without pacing or effects, keeping only what changes the field. */
  function drainQuiet() {
    for (const b of queue.splice(0)) {
      for (const el of linesEl.children) el.classList.add("old");
      for (const line of b.lines) {
        const el = h("div", { class: `l ${line.tone} old` }, line.tag && TAG_ICON[line.tag] ? iconEl(TAG_ICON[line.tag]) : null, h("span", null, line.text));
        linesEl.append(el);
        while (linesEl.children.length > 12) linesEl.firstChild!.remove();
        history.push({ tick: Math.floor(b.at / SUBTICKS), text: line.text, tone: line.tone, tag: line.tag });
        for (const ev of line.events) if (ev.t === "down" || ev.t === "leave" || ev.t === "join" || ev.t === "revive" || ev.t === "fight_start" || ev.t === "fight_end") show(ev);
      }
    }
    scene.clearTransient();
  }
  function stop() {
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown", onKey);
    canvas.removeEventListener("click", onTap);
    closeOverlay();
  }

  // ─── The loop ───
  function frameStep(now: number) {
    if (stopped) return;
    const dt = Math.min(100, now - lastFrame);
    lastFrame = now;
    const running = !paused || stepping;
    if (running) {
      vwall += dt;
      if (playing) stepBeat();
      if (!playing && (!paused || stepping)) {
        if (queue.length) startBeat(queue.shift()!);
        else if (driver.phase === "intro") {
          if (vwall >= introUntil) driver.startFighting();
        } else if (driver.phase === "fighting") {
          driver.advance((dt * speed * SUBTICKS) / TICK_MS);
          pull();
          let guard = 0;
          while (stepping && !queue.length && driver.phase === "fighting" && guard++ < 400) {
            driver.advance(SUBTICKS / 4);
            pull();
          }
          if (queue.length) startBeat(queue.shift()!);
        }
      }
      if ((driver.phase === "won" || driver.phase === "lost") && !playing && !queue.length && !driver.pending.length) endOfFight();
    }
    scene.frame(vwall);
    updateRows();
    updateFoes();
    (tick.lastChild as HTMLElement).textContent = String(Math.floor(driver.tick));
    if (scene.selected) renderInspect();
    raf = requestAnimationFrame(frameStep);
  }
  const onKey = (e: KeyboardEvent) => {
    if (stopped) return;
    if ((e.target as HTMLElement)?.tagName === "INPUT") return;
    if (e.key === " ") { paused = !paused; stepping = false; renderCtl(); e.preventDefault(); }
    else if (e.key === "n" || e.key === ".") { paused = true; stepping = true; renderCtl(); }
    else if (e.key === "1") { speed = 1; renderCtl(); }
    else if (e.key === "2") { speed = 2; renderCtl(); }
    else if (e.key === "3" || e.key === "4") { speed = 4; renderCtl(); }
    else if (e.key === "s") fastForward();
    else if (e.key === "l") openLog();
    else if (e.key === "Escape") { if (overlay) closeOverlay(); else select(null); }
  };
  window.addEventListener("keydown", onKey);
  if (driver.phase === "run_won" || driver.phase === "run_lost") {
    screen.append(win("", h("div", { class: "line" }, "NOTHING TO FIGHT"), h("div", { class: "btns" }, button("MENU", () => { stop(); go("home"); }))));
  }
  // The first beats: the run's name, then the fight's opening.
  if (!single) history.push({ tick: 0, text: runName(dungeon), tone: "sys" });
  pull();
  raf = requestAnimationFrame((t) => { lastFrame = t; frameStep(t); });
  return stop;
}
