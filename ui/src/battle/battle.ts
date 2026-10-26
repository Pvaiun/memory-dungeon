/**
 * The battle screen: the field on top, then the message window, the party's
 * rows, the foes, and the controls. The fight is told in beats (narrate.ts)
 * the way Dragon Quest and Pokémon tell one: the window shows one beat at a
 * time, its lines typed out one after another, and the engine's clock waits
 * while it's read. A tap on the window finishes the beat or moves to the
 * next; LOG opens the whole fight so far. Tapping a unit pauses the fight and
 * opens what's happening to it. The speed buttons scale the typing and the
 * hold; STEP plays one beat and pauses, skipping the dead time before it but
 * letting a wind-up fill at the speed set; >> plays the rest at once.
 */
import { SUBTICKS } from "../../../src/schema.js";
import type { CUnit } from "../../../src/engine/combat/fight.js";
import { weaponOf } from "../../../src/engine/combat/fight.js";
import { c, className, disp, elementName, fightName, runName, shortName } from "../content.js";
import { ELEMENT_COLOR, enemyDisplayName, enemyName, STATUS_STYLE, TAG_ICON, type Pose } from "../art.js";
import { bar, button, clear, h, nav, win, type Child } from "../dom.js";
import { party as partyLoadout, save, setup } from "../state.js";
import { abilityTag, statusText, weaponInfo } from "../describe.js";
import { drawDigits, iconEl, iconOf, OUTLINE, statusEl } from "../pixel.js";
import { classSheet, enemySheet, portraitEl } from "../sheet.js";
import { Driver, type Ev } from "./driver.js";
import { Narrator, type Beat, type Line, type Tone } from "./narrate.js";
import { Scene, shieldOf, themeOf, W, H } from "./scene.js";
import { setMusic, setSound, sfx } from "./audio.js";
import { go } from "../screens.js";
import { clear as clearNode, isCurrent, nodes, onJourney } from "../journey.js";
import { celebrate } from "../celebrate.js";

/** `node`: the journey node it was started from. Winning that node's whole run, while it's the one to clear, clears it; its single fights are practice. */
export type BattleArgs = { dungeon: string; seed?: number; node?: string };

/** Engine milliseconds per tick at 1×; the typing speed and the time a beat stays once typed. */
const TICK_MS = 500;
const CHAR_MS = 26, BEAT_BASE = 520, BEAT_LINE = 300;
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
  const theme = themeOf(args.dungeon);
  const single = args.dungeon.includes("~");
  const nodeAt = args.node ? nodes().findIndex((n) => n.id === args.node) : -1;
  /** Does winning this run clear a node? Only the whole run of the node to clear next, in the journey. */
  const pays = nodeAt >= 0 && !single && onJourney() && isCurrent(args.node!);
  let clearedNow = false, celebrated = false;
  const cheer = () => { celebrated = true; celebrate(frame, nodeAt); };
  /** Records the clear as soon as the engine has the last fight won, before the story catches up, so a reload can't lose it. */
  const checkClear = () => {
    if (pays && !clearedNow && driver.phase === "won" && driver.fightNo >= driver.fightTotal) clearedNow = clearNode(nodeAt);
  };
  /** Out of the fight: back to the node it came from, or home. */
  const exit = () => {
    stop();
    if (clearedNow && !celebrated) (go("journey"), cheer());
    else if (args.node) go("node", args.node);
    else go("home");
  };
  const exitLabel = args.node ? "JOURNEY" : "MENU";

  // ─── DOM ───
  const canvas = h("canvas", { class: "field", width: W, height: H });
  canvas.style.height = `${H / 8}rem`;
  const linesEl = h("div", { class: "lines" });
  const cursorEl = h("span", { class: "cursor-dq" }, "▼");
  const msgEl = win("msg", linesEl, cursorEl);
  const partyEl = win("party list");
  const foesList = h("div", { class: "foelist" });
  const tick = h("span", { class: "tick" }, "T", h("b", null, "0"));
  const foesEl = win("foes", foesList, tick);
  const ctl = h("div", { class: "ctl" });
  screen.append(canvas, msgEl, partyEl, foesEl, ctl);
  setSound(setup.settings.sound);
  setMusic(setup.settings.music);

  const scene = new Scene(canvas, driver, theme);
  scene.partyBars = setup.settings.partyBars;
  // For scripted checks: window.__scene is the field, window.__driver the engine's side.
  Object.assign(window, { __scene: scene, __driver: driver });
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
  /** The beat on screen: `shown` lines are complete, `typed` chars of the next are out, `typedAt` is when the typing ended. */
  type Playing = { beat: Beat; shown: number; typed: number; charAt: number; lineEls: HTMLElement[]; typedAt: number | null; hold: number };
  let playing: Playing | null = null;
  const history: Hist[] = [];

  // STEP is a mode, remembered across fights like the speed: on, the fight waits after every beat for a tap
  // (STEP, the message window, Enter). ▶ leaves it; II only pauses.
  const setStep = (on: boolean) => { if (setup.settings.step !== on) { setup.settings.step = on; save(); } };
  const pauseBtn = button("II", () => { if (paused) { paused = false; stepping = false; setStep(false); } else paused = true; renderCtl(); });
  const stepBtn = button("STEP", () => { paused = true; stepping = true; setStep(true); renderCtl(); });
  const speedBtns = SPEEDS.map((s) => button(`${s}×`, () => { speed = s; setup.settings.speed = s; save(); renderCtl(); }));
  const renderCtl = () => {
    pauseBtn.textContent = paused ? "▶" : "II";
    pauseBtn.className = paused && !setup.settings.step ? "on" : "";
    stepBtn.className = setup.settings.step ? "on" : "";
    speedBtns.forEach((b, i) => (b.className = SPEEDS[i] === speed ? "on" : ""));
  };
  /** In step mode a fight starts waiting: its first beat plays, then it waits for a tap. */
  const enterStepMode = () => { if (setup.settings.step) { paused = true; stepping = true; } };
  enterStepMode();
  ctl.append(button("◀", () => confirmLeave()), pauseBtn, stepBtn, ...speedBtns, button(">>", () => fastForward()), button("LOG", () => openLog()));
  renderCtl();

  const castingNow = () => driver.units().some((u) => !u.ko && u.cast !== null);
  /** Pulls what the engine logged into beats. */
  function pull(flush = true) {
    for (const ev of driver.pending.splice(0)) narrator.push(ev);
    if (flush) narrator.flush();
    queue.push(...narrator.take());
  }
  const charMs = () => (speed >= 4 ? 0 : CHAR_MS / speed);
  const holdFor = (b: Beat) => (BEAT_BASE + BEAT_LINE * b.weight) / speed;
  function startBeat(b: Beat) {
    clear(linesEl);
    playing = { beat: b, shown: 0, typed: 0, charAt: vwall, lineEls: [], typedAt: null, hold: holdFor(b) };
    if (b.kind === "intro") introUntil = vwall + Math.max(1800, playing.hold + 800);
    cursorEl.style.visibility = "hidden";
  }
  /** Starts a line: its element, and its events on the field. */
  function openLine(p: Playing) {
    const line = p.beat.lines[p.shown];
    const el = lineEl(line, false);
    p.lineEls.push(el);
    linesEl.append(el);
    p.typed = 0;
    p.charAt = Math.max(p.charAt, vwall);
    history.push({ tick: Math.floor(p.beat.at / SUBTICKS), text: line.text, tone: line.tone, tag: line.tag });
    if (history.length > 600) history.shift();
    for (const ev of line.events) show(ev);
  }
  function lineEl(line: Line, full: boolean): HTMLElement {
    return h("div", { class: `l ${line.tone}` }, line.tag && TAG_ICON[line.tag] ? iconEl(TAG_ICON[line.tag]) : null, h("span", { class: "t" }, full ? line.text : ""));
  }
  /** Types the beat out: a line's characters appear at the typing speed, then the next line starts. */
  function stepBeat() {
    if (!playing) return;
    const p = playing;
    const lines = p.beat.lines;
    const cm = charMs();
    while (p.shown < lines.length) {
      if (p.lineEls.length <= p.shown) openLine(p);
      const text = lines[p.shown].text;
      const want = cm === 0 ? text.length : Math.min(text.length, Math.floor((vwall - p.charAt) / cm));
      if (want > p.typed) {
        p.typed = want;
        (p.lineEls[p.shown].lastChild as HTMLElement).textContent = text.slice(0, want);
      }
      if (p.typed < text.length) return;
      p.shown++;
      if (p.shown < lines.length) {
        // A short breath between lines.
        p.charAt = vwall + (cm === 0 ? 0 : 90 / speed);
        if (cm !== 0) return;
      }
    }
    if (p.typedAt === null) p.typedAt = vwall;
    cursorEl.style.visibility = Math.floor(vwall / 400) % 2 ? "hidden" : "visible";
    if (vwall - p.typedAt >= p.hold) finishBeat();
  }
  function finishBeat() {
    if (!playing) return;
    playing = null;
    cursorEl.style.visibility = "hidden";
    if (stepping) {
      stepping = false;
      paused = true;
      renderCtl();
    }
  }
  /** A tap on the window: finish the typing, or move on to the next beat. */
  function advance() {
    if (playing) {
      const p = playing;
      if (p.shown < p.beat.lines.length) {
        while (p.shown < p.beat.lines.length) {
          if (p.lineEls.length <= p.shown) openLine(p);
          (p.lineEls[p.shown].lastChild as HTMLElement).textContent = p.beat.lines[p.shown].text;
          p.shown++;
        }
        p.typedAt = vwall;
        return;
      }
      finishBeat();
      if (paused) { stepping = true; renderCtl(); }
      return;
    }
    if (paused) { stepping = true; renderCtl(); }
  }
  msgEl.addEventListener("click", () => advance());

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
        const tag = narrator.tagOf(by, String(ev.act));
        const unit = driver.unit(by);
        const bow = !!unit && c.gear.get(unit.weapon)?.weapon?.kind === "bow";
        if (v?.side === "party") scene.pose(by, poseFor(isBasic, tag, bow), 520);
        scene.lunge(by);
        const fxTag = isBasic && tag === "pierce" && bow ? "arrow" : tag;
        for (const t of targets) scene.effectFor(t, fxTag, targets.length <= 2);
        if (!isBasic && ELEMENT_COLOR[tag]) sfx.magic();
        break;
      }
      case "fail":
        scene.number(String(ev.by), ev.why === "mp" ? "NO MP" : "NO TARGET", { color: "#8e99b8" });
        break;
      case "dmg":
        if (typeof ev.hp === "number") scene.told(String(ev.target), ev.hp);
        showDamage(ev);
        break;
      case "heal": {
        if (typeof ev.hp === "number") scene.told(String(ev.target), ev.hp);
        const amount = ev.amount as number;
        const src = String(ev.src);
        const isStatus = c.statuses.has(src);
        if (isStatus && disp(amount) <= 0) break;
        const target = String(ev.target);
        scene.number(target, `+${disp(amount)}`, { color: "#7ee07e", big: !isStatus, icon: src === "regen" ? "regen" : undefined, sub: ev.word === "ABSORB" ? "ABSORB" : ev.crit ? "CRITICAL" : undefined });
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
        scene.number(unit, d.name.toUpperCase(), { color: style.color, icon: d.id });
        scene.statusPop(unit, d.id);
        const key = `${unit}:${d.id}`;
        if (vwall - (lastStatusFx.get(key) ?? -9999) > 700) {
          lastStatusFx.set(key, vwall);
          scene.effectFor(unit, d.id === "shield" ? "shield" : d.label === "buff" ? "buff" : "debuff");
          sfx.status();
        }
        break;
      }
      case "status_end": {
        const d = c.statuses.get(String(ev.status));
        if (d?.show === "icon" && ev.cause !== "ko" && ev.cause !== "fight_end") scene.statusFade(String(ev.unit), d.id);
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
        if (typeof ev.hp === "number") scene.told(String(ev.unit), ev.hp);
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

  function poseFor(isBasic: boolean, tag: string, bow: boolean): Pose {
    if (bow && (tag === "pierce" || tag === "arrow")) return "missile";
    if (isBasic) return tag === "pierce" || tag === "arrow" ? "thrust" : tag === "slash" || tag === "blunt" || tag === "bite" ? "swing" : "spell";
    if (["slash", "pierce", "blunt"].includes(tag)) return "skill";
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
    scene.number(target, `${shown}${crit ? "!" : ""}`, { color, big: !isStatus, sub, subColor: crit ? "#ffd54a" : word === "WEAK" ? "#ff7b6b" : word === "RESIST" ? "#8e99b8" : "#a8e8ff", icon: isStatus && c.statuses.has(src) ? src : undefined });
    if (!isStatus || amount >= 100) scene.hit(target);
    if (!isStatus) (crit ? sfx.crit : sfx.hit)();
    else sfx.status();
    if (isStatus && (src === "burn" || src === "bleed" || src === "shock")) scene.effectFor(target, src);
  }

  // ─── Party rows: portrait | name, short HP and MP bars | the actions' cooldowns, big ───
  // Statuses show on the field under each unit, so the rows give their room to the cooldowns: the basic attack small
  // on the left (it comes round fast), a gap, then each ability at twice its icon's size, always in the same place.
  type Row = { el: HTMLElement; hp: HTMLElement; hpNum: HTMLElement; mp: HTMLElement; mpNum: HTMLElement; cds: HTMLCanvasElement; bars: string; cdKey: string };
  const BIG = 32, SMALL = 16, GAP = 6, CD_H = BIG + 4;
  const rows = new Map<string, Row>();
  const rowName = (ref: string) => (className(ref).length <= 9 ? className(ref) : shortName(ref));
  /** Where each action's pip sits: the basic attack first, then the abilities in order. */
  function pipLayout(u: CUnit): { i: number; x: number; size: number }[] {
    const basic = u.acts.findIndex((a) => a.id === "basic");
    const out: { i: number; x: number; size: number }[] = [];
    let x = 2;
    if (basic >= 0) {
      out.push({ i: basic, x, size: SMALL });
      x += SMALL + 2 + GAP;
    }
    u.acts.forEach((a, i) => {
      if (i === basic) return;
      out.push({ i, x, size: BIG });
      x += BIG + 2;
    });
    return out;
  }
  function buildRows() {
    clear(partyEl);
    rows.clear();
    for (const u of driver.units().filter((x) => x.side === "party")) {
      const hp = bar(1, "hp"), mp = bar(1, "mp", 0, true);
      const hpNum = h("span", { class: "num" }), mpNum = h("span", { class: "num mp" });
      const lay = pipLayout(u);
      const w = lay.length ? lay[lay.length - 1].x + lay[lay.length - 1].size + 2 : 2;
      const cds = h("canvas", { class: "px cds", width: w, height: CD_H });
      cds.style.width = `${w / 8}rem`;
      cds.style.height = `${CD_H / 8}rem`;
      const el = h("div", { class: "member", onClick: () => openInspect(u.id) },
        h("div", { class: "portrait" }, portraitEl(u.ref)),
        h("div", { class: "stats" },
          h("div", { class: "name trunc" }, rowName(u.ref)),
          h("div", { class: "line2" }, h("span", { class: "lbl" }, "HP"), hp, hpNum),
          h("div", { class: "line2" }, h("span", { class: "lbl mp" }, "MP"), mp, mpNum),
        ),
        h("div", { class: "side" }, cds),
      );
      partyEl.append(el);
      rows.set(u.id, { el, hp, hpNum, mp, mpNum, cds, bars: "", cdKey: "" });
    }
  }
  function updateRows() {
    for (const u of driver.units()) {
      const r = rows.get(u.id);
      if (!r) continue;
      const max = u.stats.max_hp;
      const sh = shieldOf(u);
      const v = scene.units.get(u.id);
      const hpNow = v ? v.hpTold : u.hp, ko = v ? v.downTold : u.ko;
      const barsKey = `${hpNow}|${u.mp}|${sh}|${ko}`;
      if (barsKey !== r.bars) {
        r.bars = barsKey;
        const share = Math.max(0, hpNow / max);
        const fill = r.hp.firstElementChild as HTMLElement;
        fill.style.width = `${share * 100}%`;
        fill.className = share <= 0.25 ? "low" : share <= 0.5 ? "mid" : "";
        let shEl = r.hp.querySelector("i.sh") as HTMLElement | null;
        if (sh > 0) {
          if (!shEl) r.hp.append((shEl = h("i", { class: "sh" })));
          shEl.style.left = `${share * 100}%`;
          shEl.style.width = `${Math.min(1 - share, sh / max) * 100}%`;
        } else shEl?.remove();
        r.hpNum.textContent = ko ? "KO" : `${disp(hpNow)}`;
        (r.mp.firstElementChild as HTMLElement).style.width = `${Math.max(0, u.mp / Math.max(1, u.stats.max_mp)) * 100}%`;
        r.mpNum.textContent = `${disp(u.mp)}`;
        r.el.classList.toggle("ko", ko);
      }
      drawCooldowns(r, u);
    }
  }
  /** A colour from the theme (night or day), so outlines show on either. */
  const themeColor = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#ffd54a";
  /** The unit's actions as pips: the action's icon, shaded from the top by the cooldown left with the ticks to go in the corner, outlined in gold when ready, blinking while it winds up. */
  function drawCooldowns(r: Row, u: CUnit) {
    const vt = driver.vt;
    const blink = Math.floor(vwall / 300) % 2;
    const parts = pipLayout(u).map((p) => {
      const a = u.acts[p.i];
      const total = a.id === "basic" ? weaponOf(c, u.weapon).cooldown ?? 1 : c.abilities.get(a.id)?.cooldown ?? 1;
      const left = Math.max(0, (a.ready - vt) / SUBTICKS);
      const share = Math.min(1, left / Math.max(1, total));
      return { ...p, tag: narrator.tagOf(u.id, a.id), share: Math.round(share * 32) / 32, left: Math.ceil(left), ready: left <= 0 && !u.cast, casting: u.cast?.act === p.i };
    });
    const ko = scene.units.get(u.id)?.downTold ?? u.ko;
    const key = ko ? "ko" : parts.map((p) => `${p.tag}:${p.share}:${p.left}:${p.ready ? 1 : 0}:${p.casting ? blink : "-"}`).join("|");
    if (key === r.cdKey) return;
    r.cdKey = key;
    const g = r.cds.getContext("2d")!;
    g.imageSmoothingEnabled = false;
    g.clearRect(0, 0, r.cds.width, r.cds.height);
    if (ko) return;
    for (const p of parts) {
      const big = p.size === BIG;
      const y = big ? 2 : Math.round((CD_H - SMALL) / 2);
      const cell = TAG_ICON[p.tag] ?? TAG_ICON.physical;
      g.drawImage(iconOf(cell[0], cell[1]), p.x, y, p.size, p.size);
      if (p.share > 0 && !p.casting) {
        g.fillStyle = "rgba(10, 12, 24, 0.72)";
        g.fillRect(p.x, y, p.size, Math.round(p.size * p.share));
      }
      if (big && p.share > 0 && !p.casting && p.left > 0) {
        // Ticks to go, in the corner, at twice the digits' size.
        const t = String(Math.min(99, p.left));
        drawDigits(g, t, p.x + p.size - (t.length * 4 - 1) * 2 - 2, y + p.size - 12, "#ffffff", OUTLINE, 2);
      }
      if (p.ready || (p.casting && blink)) {
        g.strokeStyle = p.casting ? themeColor("--ink") : themeColor("--hi");
        g.lineWidth = big ? 2 : 1;
        const o = big ? 1 : 0.5;
        g.strokeRect(p.x - o, y - o, p.size + 2 * o, p.size + 2 * o);
      }
    }
  }

  // ─── Foes ───
  let foesKey = "";
  function updateFoes() {
    const foes = driver.units().filter((u) => u.side === "enemy" && !u.gone);
    const groups = new Map<string, { alive: number; total: number; first: string | null; boss: boolean }>();
    for (const u of foes) {
      const g = groups.get(u.ref) ?? { alive: 0, total: 0, first: null, boss: c.enemies.get(u.ref)?.rank === "boss" };
      g.total++;
      if (!u.ko) {
        g.alive++;
        g.first ??= u.id;
      }
      groups.set(u.ref, g);
    }
    const key = [...groups].map(([r, g]) => `${r}:${g.alive}/${g.total}`).join("|");
    if (key === foesKey) return;
    foesKey = key;
    clear(foesList);
    for (const [ref, g] of groups) {
      const label = `${g.boss ? "★" : ""}${enemyDisplayName(ref)}${g.total > 1 ? ` ×${g.alive}` : ""}`;
      foesList.append(h("span", { class: g.alive ? "" : "dead", onClick: () => { if (g.first) openInspect(g.first); } }, label));
    }
    if (!groups.size) foesList.append(h("span", { class: "dim" }, "NO FOES"));
  }

  // ─── Overlays: a unit's state, the log, a sheet ───
  let overlay: HTMLElement | null = null;
  let overlayDone: (() => void) | null = null;
  /** Removes the overlay; `done` also runs what its closing should (resuming the clock). */
  function closeOverlay(done = false) {
    overlay?.remove();
    overlay = null;
    nav.overlay = null;
    const d = overlayDone;
    overlayDone = null;
    if (done) d?.();
  }
  function openOverlay(title: Child, body: Child, onClose?: () => void, right?: Child): HTMLElement {
    closeOverlay();
    const box = win("scroll", body);
    overlayDone = onClose ?? null;
    overlay = h("div", { class: "overlay" }, h("div", { class: "hdr" }, h("span", { class: "title" }, title), right, button("×", () => closeOverlay(true), "sm")), box);
    frame.append(overlay);
    nav.overlay = () => closeOverlay(true);
    return box;
  }
  /** Pauses while an overlay is read; `done` restores the state before it. */
  function holdClock(): () => void {
    const wasPaused = paused, wasStepping = stepping;
    paused = true;
    stepping = false;
    renderCtl();
    return () => { paused = wasPaused; stepping = wasStepping; renderCtl(); };
  }
  function openInspect(id: string) {
    const u = driver.unit(id);
    if (!u) return;
    const resume = holdClock();
    const vt = driver.vt;
    const isParty = u.side === "party";
    const designer = setup.settings.designer;
    const sh = shieldOf(u);
    const body = h("div", { class: "inspect" });
    body.append(h("div", { class: "line" },
      h("span", { class: "grow" }, u.ko ? h("span", { class: "bad" }, "KNOCKED OUT") : h("span", null, "HP ", h("b", { class: shieldOf(u) ? "sh" : "" }, `${disp(u.hp)}`), h("span", { class: "dim" }, `/${disp(u.stats.max_hp)}`))),
      sh ? h("span", { class: "buff" }, `SHIELD ${disp(sh)}`) : null,
      isParty || designer ? h("span", { class: "mp" }, `MP ${disp(u.mp)}`) : null,
    ));
    body.append(h("div", { class: "section" }, "STATUSES"));
    let any = false;
    for (const s of u.statuses) {
      const d = c.statuses.get(s.id)!;
      if (d.show !== "icon") continue;
      any = true;
      const n = d.stacking === "intensity" ? (d.absorb ? disp(Math.floor(s.stacks / SUBTICKS)) : Math.floor(s.stacks / SUBTICKS)) : null;
      const left = s.end === -1 ? "FOR THE FIGHT" : `${Math.max(0, Math.ceil((s.end - vt) / SUBTICKS))}T LEFT`;
      body.append(h("div", { class: "st" },
        statusEl(s.id, n),
        h("div", { class: "grow" },
          h("div", { class: "line" }, h("span", { class: `grow trunc ${d.label === "buff" ? "buff" : "debuff"}` }, d.name.toUpperCase(), n !== null ? h("span", { class: "dim" }, d.absorb ? ` ${n} PTS` : ` ×${n}`) : null), h("span", { class: "dim" }, left)),
          h("div", { class: "text dim small wrap" }, d.text ?? statusText(d).slice(1).join(" ")),
        ),
      ));
    }
    if (!any) body.append(h("div", { class: "line dim" }, "NONE"));
    body.append(h("div", { class: "section" }, "ACTIONS"));
    if (isParty || designer) {
      u.acts.forEach((a, i) => {
        const name = a.id === "basic" ? "ATTACK" : c.abilities.get(a.id)!.name;
        const casting = u.cast?.act === i;
        const left = Math.max(0, (a.ready - vt) / SUBTICKS);
        const tag = narrator.tagOf(u.id, a.id);
        body.append(h("div", { class: "line" }, TAG_ICON[tag] ? iconEl(TAG_ICON[tag]) : null, h("span", { class: "grow trunc" }, name.toUpperCase()), h("span", { class: `${casting ? "hi" : left > 0 ? "dim" : "good"}` }, casting ? "CASTING…" : left > 0 ? `IN ${Math.ceil(left)}T` : "READY")));
      });
    } else {
      const e = c.enemies.get(u.ref)!;
      for (const aid of e.abilities ?? []) {
        const a = c.abilities.get(aid)!;
        const casting = u.cast !== null && u.acts[u.cast.act]?.id === aid;
        body.append(h("div", { class: "line" }, TAG_ICON[abilityTag(a)] ? iconEl(TAG_ICON[abilityTag(a)]) : null, h("span", { class: "grow trunc" }, a.name.toUpperCase()), h("span", { class: `${casting ? "hi" : "dim"}` }, casting ? "CASTING…" : "")));
      }
      const w = weaponInfo(e.weapon ?? c.pack.ruleset.unarmed, null);
      body.append(h("div", { class: "line" }, TAG_ICON[w.tag] ? iconEl(TAG_ICON[w.tag]) : null, h("span", { class: "grow trunc" }, "ATTACK"), h("span", { class: "dim" }, `${(w.type === "magical" ? elementName(w.element ?? "") : w.subtype ?? "").toUpperCase()} /${w.cooldown}T`)));
    }
    if (designer && !isParty) body.append(h("div", { class: "line dim" }, `ATK${disp(u.stats.attack)} MAG${disp(u.stats.magic)} ARM${disp(u.stats.armor)}`));
    body.append(h("div", { class: "btns", style: "margin-top:.5rem" }, button("FULL SHEET", () => openSheet(u, resume), "sm"), button("CLOSE", () => closeOverlay(true), "sm")));
    openOverlay(nameOf(u.id), body, resume, u.side === "party" ? portraitEl(u.ref) : null);
  }
  function openLog() {
    const resume = holdClock();
    const body = h("div", { class: "log" });
    let lastTick = -1;
    for (const l of history) {
      body.append(h("div", { class: `l ${l.tone}` }, h("span", { class: "t" }, l.tick !== lastTick ? `T${l.tick}` : ""), l.tag && TAG_ICON[l.tag] ? iconEl(TAG_ICON[l.tag]) : null, h("span", null, l.text)));
      lastTick = l.tick;
    }
    if (!history.length) body.append(h("div", { class: "l dim" }, "NOTHING YET"));
    const box = openOverlay("LOG", body, resume);
    box.scrollTop = box.scrollHeight;
  }
  function openSheet(u: CUnit, resume: () => void) {
    const body = u.side === "party" ? classSheet(u.ref, setup.settings.designer) : enemySheet(c.enemies.get(u.ref)!, setup.settings.designer);
    openOverlay(nameOf(u.id), h("div", null, ...body), resume);
  }

  /** Leaving mid-fight loses it: ask first. */
  function confirmLeave() {
    if (!driver.fight || driver.fight.result) return exit();
    const resume = holdClock();
    openOverlay("LEAVE THE FIGHT?", h("div", null,
      h("div", { class: "text dim wrap small" }, "The fight and the run are lost. The same seed plays the same fight again from the menu."),
      h("div", { class: "btns", style: "margin-top:.75rem" }, button("LEAVE", () => exit(), "hi"), button("STAY", () => closeOverlay(true))),
    ), resume);
  }

  // ─── Field input ───
  canvas.addEventListener("click", onTap);
  function onTap(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
    const hit = scene.hitTest(x, y);
    if (hit) openInspect(hit);
  }

  // ─── Flow ───
  let ended = false;
  type Tally = { dealt: number; taken: number; healed: number; acts: number };
  function endOfFight() {
    if (ended) return;
    ended = true;
    checkClear();
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
    const newSeed = () => restart(Math.floor(Math.random() * 100000) + 1);
    // A node just cleared leads to the journey; a replay or practice says it paid nothing.
    const btns: Child[] = clearedNow
      ? [button("JOURNEY", () => { stop(); go("journey"); if (!celebrated) cheer(); }, "hi")]
      : won
        ? [last ? null : button("NEXT", () => nextFight(), "hi"), button("AGAIN", () => restart(seed)), button("NEW SEED", newSeed), button(exitLabel, exit)]
        : [button("RETRY", () => restart(seed), "hi"), button("NEW SEED", newSeed), button(exitLabel, exit)];
    const note = clearedNow ? h("div", { class: "line hi" }, "JOURNEY: CLEARED!")
      : args.node && won && last ? h("div", { class: "line dim small" }, single ? "PRACTICE: PAYS NOTHING" : "REPLAY: PAYS NOTHING") : null;
    const box = win("summary",
      h("div", { class: "line" }, h("span", { class: `grow ${won ? "good" : "bad"}` }, title), h("span", { class: "dim" }, `${where} T${f.round}`)),
      table,
      note,
      h("div", { class: "btns", style: "margin-top:.5rem" }, ...btns, button("LOG", () => openLog())),
    );
    setTimeout(() => {
      if (stopped || !ended) return;
      for (const el of [msgEl, ctl]) el.style.display = "none";
      screen.append(box);
    }, 900);
    if (won && !last && setup.settings.autoContinue) setTimeout(() => { if (!stopped && ended) nextFight(); }, 2200);
    if (clearedNow) setTimeout(() => { if (!stopped && !celebrated) cheer(); }, 1700);
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
    clear(linesEl);
    scene.units.clear();
    scene.clearTransient();
    closeOverlay();
    enterStepMode();
    renderCtl();
    driver.continueRun();
    pull();
    if (driver.phase === "campfire") return showCampfire();
    if (driver.phase === "run_won" || driver.phase === "run_lost") {
      screen.append(win("", h("div", { class: "line" }, driver.phase === "run_won" ? "RUN CLEARED" : "RUN LOST"), h("div", { class: "btns" }, button(exitLabel, exit))));
    }
  }
  /** The campfire halfway through the run: the party as it stands, and one pick: HP back, MP back, or one fallen member back. */
  function showCampfire() {
    const cf = driver.campfire();
    if (!cf) return;
    for (const el of [msgEl, ctl]) el.style.display = "none";
    const party = driver.run.party as unknown as { id: string; ref: string; hp: number; mp: number; stats: Record<string, number> }[];
    const box = win("summary",
      h("div", { class: "line" }, h("span", { class: "grow hi" }, "CAMPFIRE"), h("span", { class: "dim" }, `${driver.fightNo}/${driver.fightTotal} DONE`)),
      h("div", { class: "line dim small" }, cf.raise.length ? "Rest, focus, or raise one of the fallen. One pick." : "Rest, or focus. One pick."),
      h("table", { class: "sum" },
        h("thead", null, h("tr", null, h("th", null, ""), h("th", null, "HP"), h("th", null, "MP"))),
        h("tbody", null, ...party.map((m) => h("tr", null,
          h("td", null, className(m.ref)),
          h("td", { class: m.hp <= 0 ? "bad" : "" }, m.hp <= 0 ? "KO" : `${disp(m.hp)}/${disp(m.stats.max_hp)}`),
          h("td", null, `${disp(m.mp)}/${disp(m.stats.max_mp)}`),
        ))),
      ),
      h("div", { class: "btns", style: "margin-top:.5rem" },
        button(`REST +${cf.hp}% HP`, () => pick("rest"), "hi"),
        button(`FOCUS +${cf.mp}% MP`, () => pick("focus"), "hi"),
        ...cf.raise.map((id) => button(`RAISE ${className(party.find((m) => m.id === id)!.ref).toUpperCase()} ${cf.revive}% HP`, () => pick(`raise:${id}`), "hi")),
      ),
    );
    screen.append(box);
    function pick(choice: string) {
      box.remove();
      for (const el of [msgEl, ctl]) el.style.display = "";
      driver.choose(choice);
      pull();
      renderCtl();
      if (driver.phase === "run_won" || driver.phase === "run_lost") {
        screen.append(win("", h("div", { class: "line" }, driver.phase === "run_won" ? "RUN CLEARED" : "RUN LOST"), h("div", { class: "btns" }, button(exitLabel, exit))));
      }
    }
  }
  function restart(newSeed: number) {
    stop();
    go("battle", { ...args, seed: newSeed });
  }
  /** Plays the rest of the fight at once: the log gets every line, the window the last beat. */
  function fastForward() {
    if (!driver.fight || driver.fight.result) return;
    driver.startFighting();
    if (playing) advance();
    playing = null;
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
    scene.catchUp();
    driver.advance(0);
    updateRows();
    endOfFight();
  }
  /** Shows queued beats without pacing or effects, keeping only what changes the field. */
  function drainQuiet() {
    for (const b of queue.splice(0)) {
      clear(linesEl);
      for (const line of b.lines) {
        linesEl.append(lineEl(line, true));
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
          // STEP skips dead time only: with nobody winding up, jump to the next moment; a wind-up plays at the speed set, so it can be watched filling.
          let guard = 0;
          while (stepping && !queue.length && driver.phase === "fighting" && !castingNow() && guard++ < 400) {
            driver.advance(SUBTICKS / 4);
            pull();
          }
          if (queue.length) startBeat(queue.shift()!);
        }
      }
      checkClear();
      if ((driver.phase === "won" || driver.phase === "lost") && !playing && !queue.length && !driver.pending.length) endOfFight();
    } else if (playing && playing.typedAt !== null) cursorEl.style.visibility = Math.floor(now / 400) % 2 ? "hidden" : "visible";
    scene.frame(vwall);
    updateRows();
    updateFoes();
    (tick.lastChild as HTMLElement).textContent = String(Math.floor(driver.tick));
    raf = requestAnimationFrame(frameStep);
  }
  const onKey = (e: KeyboardEvent) => {
    if (stopped) return;
    if ((e.target as HTMLElement)?.tagName === "INPUT") return;
    if (e.key === " ") { paused = !paused; stepping = false; renderCtl(); e.preventDefault(); }
    else if (e.key === "n" || e.key === "." || e.key === "Enter") { advance(); }
    else if (e.key === "1") { speed = 1; renderCtl(); }
    else if (e.key === "2") { speed = 2; renderCtl(); }
    else if (e.key === "3" || e.key === "4") { speed = 4; renderCtl(); }
    else if (e.key === "s") fastForward();
    else if (e.key === "l") openLog();
    else if (e.key === "Escape") { if (overlay) closeOverlay(true); }
  };
  window.addEventListener("keydown", onKey);
  if (driver.phase === "run_won" || driver.phase === "run_lost") {
    screen.append(win("", h("div", { class: "line" }, "NOTHING TO FIGHT"), h("div", { class: "btns" }, button(exitLabel, exit))));
  }
  // The phone's back button: closes an overlay (nav.overlay), else asks before leaving the fight.
  nav.back = () => confirmLeave();
  // The first beats: the run's name, then the fight's opening.
  if (!single) history.push({ tick: 0, text: runName(dungeon), tone: "sys" });
  pull();
  raf = requestAnimationFrame((t) => { lastFrame = t; frameStep(t); });
  return stop;
}
