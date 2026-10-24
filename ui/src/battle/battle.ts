/**
 * The battle screen: the field on the canvas, and below it the party's rows,
 * the foes, a three-line message box (or the inspect box for a tapped unit)
 * and the speed controls, with the run's flow around it (banner, victory and
 * defeat, continue and retry). Everything is short: codes, bars and one number.
 */
import { SUBTICKS, type AbilityT } from "../../../src/schema.js";
import type { CUnit } from "../../../src/engine/combat/fight.js";
import { weaponOf } from "../../../src/engine/combat/fight.js";
import { c, disp, fightName, runName, shortName, statusCode } from "../content.js";
import { enemyDisplayName, enemyName, type Pose } from "../art.js";
import { button, clear, h, type Child } from "../dom.js";
import { party as partyLoadout, setup } from "../state.js";
import { abilityTag, weaponInfo } from "../describe.js";
import { faceEl } from "../pixel.js";
import { Driver, type Ev } from "./driver.js";
import { Scene, shieldOf, W, H } from "./scene.js";
import { setSound, sfx } from "./audio.js";
import { go } from "../screens.js";

export type BattleArgs = { dungeon: string; seed?: number };

type Queued = { ev: Ev; when: number };
const BITERS = new Set(["wolf", "snow_wolf", "snake", "bat", "hellhound", "leech"]);

export function startBattle(canvas: HTMLCanvasElement, panel: HTMLElement, args: BattleArgs): () => void {
  const seed = args.seed ?? setup.seed;
  const dungeon = c.dungeons.get(args.dungeon);
  const fail = (msg: string) => {
    panel.append(h("div", { class: "box" }, h("div", { class: "text" }, msg), h("div", { class: "btns", style: "margin-top:.5rem" }, button("MENU", () => go("home")))));
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
  const partyEl = h("div", { class: "box list" });
  const foesEl = h("div", { class: "box foes" });
  const msgEl = h("div", { class: "box msg" });
  const inspectEl = h("div", { class: "box msg", style: "display:none" });
  const tick = h("span", { class: "tick" }, "T0");
  const speedBtns: HTMLButtonElement[] = [];
  const ctl = h("div", { class: "ctl" });
  panel.append(partyEl, foesEl, msgEl, inspectEl, ctl);
  setSound(setup.settings.sound);

  const scene = new Scene(canvas, driver, theme);

  // ─── Clock and speed ───
  let speed = 1;
  let paused = false;
  let vwall = 0;
  let lastFrame = performance.now();
  let raf = 0;
  let stopped = false;
  const queue: Queued[] = [];
  let introUntil = 0;

  const speeds: [string, number][] = [["||", 0], ["1", 1], ["2", 2], ["4", 4]];
  const renderSpeed = () => {
    for (const b of speedBtns) {
      const s = Number(b.dataset.speed);
      b.className = (s === 0 ? paused : !paused && speed === s) ? "on" : "";
    }
  };
  ctl.append(button("◀", () => { stop(); go("home"); }));
  for (const [label, s] of speeds) {
    const b = button(label, () => { if (s === 0) paused = !paused; else (speed = s), (paused = false); renderSpeed(); });
    b.dataset.speed = String(s);
    speedBtns.push(b);
    ctl.append(b);
  }
  ctl.append(button(">>", () => fastForward()), tick);
  renderSpeed();

  // ─── Party rows ───
  type Row = { el: HTMLElement; hp: HTMLElement; hpNum: HTMLElement; mp: HTMLElement; mpNum: HTMLElement; sts: HTMLElement; key: string };
  const rows = new Map<string, Row>();
  function buildRows() {
    clear(partyEl);
    rows.clear();
    for (const u of driver.units().filter((x) => x.side === "party")) {
      const hp = h("i"), mp = h("i");
      const hpNum = h("div", { class: "num" }), mpNum = h("div", { class: "num dim" }), sts = h("div", { class: "sts" });
      const el = h("div", { class: "member", onClick: () => select(scene.selected === u.id ? null : u.id) },
        faceEl(u.ref), h("div", { class: "name" }, shortName(u.ref)), h("div", { class: "bar" }, hp), hpNum,
        sts, h("div", { class: "bar mp thin" }, mp), mpNum,
      );
      partyEl.append(el);
      rows.set(u.id, { el, hp, hpNum, mp, mpNum, sts, key: "" });
    }
  }

  function updateRows() {
    const vt = driver.vt;
    for (const u of driver.units()) {
      const r = rows.get(u.id);
      if (!r) continue;
      const max = u.stats.max_hp;
      r.hp.style.width = `${Math.max(0, u.hp / max) * 100}%`;
      r.hpNum.textContent = u.ko ? "KO" : String(disp(u.hp));
      r.mp.style.width = `${Math.max(0, u.mp / Math.max(1, u.stats.max_mp)) * 100}%`;
      r.mpNum.textContent = String(disp(u.mp));
      r.el.classList.toggle("ko", u.ko);
      r.el.classList.toggle("sel", scene.selected === u.id);
      const sh = shieldOf(u);
      const key = `${u.ko}|${sh}|${u.statuses.map((s) => `${s.id}:${Math.floor(s.stacks / SUBTICKS)}`).join("|")}`;
      if (key !== r.key) {
        r.key = key;
        r.sts.textContent = u.ko ? "DOWN" : statusCodes(u, sh);
      }
    }
  }
  /** "SHD12 PSN2 STN": the icon statuses with their stacks, Shield first with its points. */
  function statusCodes(u: CUnit, shield = shieldOf(u)): string {
    const parts: string[] = [];
    if (shield) parts.push(`SHD${disp(shield)}`);
    for (const s of u.statuses) {
      const d = c.statuses.get(s.id)!;
      if (d.show !== "icon" || d.absorb) continue;
      parts.push(`${statusCode(s.id)}${d.stacking === "intensity" ? Math.floor(s.stacks / SUBTICKS) : ""}`);
    }
    return parts.join(" ");
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
    clear(foesEl);
    for (const [ref, g] of groups) {
      const label = `${g.boss ? "★" : ""}${enemyDisplayName(ref)}${g.total > 1 ? ` ×${g.alive}` : ""}`;
      foesEl.append(h("span", { class: g.alive ? "" : "dead", onClick: () => { if (g.first) select(scene.selected === g.first ? null : g.first); } }, label));
    }
  }

  // ─── Messages ───
  let lines = 0;
  let pend: { by: string; el: HTMLElement } | null = null;
  function log(text: string, kind = ""): HTMLElement {
    const line = h("div", { class: `l ${kind}` }, text);
    msgEl.append(line);
    if (++lines > 200) msgEl.removeChild(msgEl.firstChild!);
    msgEl.scrollTop = msgEl.scrollHeight;
    pend = null;
    return line;
  }
  const nameOf = (id: string | null | undefined): string => {
    if (!id) return "?";
    const u = driver.unit(id);
    return u ? (u.side === "party" ? shortName(u.ref) : enemyName(u.ref, u.name).toUpperCase()) : id;
  };
  const actName = (ev: Ev) => (ev.kind === "basic" || ev.name === "attack" ? "ATTACK" : String(ev.name).toUpperCase());
  const num = (n: number) => String(disp(n));

  // ─── Events → visuals ───
  const lastStatusFx = new Map<string, number>();
  function show(ev: Ev) {
    const at = ev.at as number | undefined;
    void at;
    switch (ev.t) {
      case "fight_start": {
        scene.sync();
        buildRows();
        foesKey = "";
        const stage = dungeon!.stages.find((s) => s.id === ev.stage);
        const name = fightName(stage?.kind === "fight" ? stage : { id: String(ev.stage) });
        const foes = driver.units().filter((u) => u.side === "enemy");
        const counts = new Map<string, number>();
        for (const f of foes) counts.set(f.ref, (counts.get(f.ref) ?? 0) + 1);
        const sub = [...counts].map(([ref, n]) => `${enemyDisplayName(ref)}${n > 1 ? ` ×${n}` : ""}`).join(" ").toUpperCase();
        scene.showBanner(name.toUpperCase(), sub, 1600);
        log(`${ev.boss ? "★ " : ""}${name}`, "fight");
        introUntil = vwall + 1500;
        break;
      }
      case "cast": {
        const v = scene.units.get(ev.by as string);
        if (v) v.cast = { name: actName(ev), start: at!, end: ev.ends as number };
        if (v?.side === "party") scene.pose(v.id, "chant", 0);
        sfx.cast();
        log(`${nameOf(ev.by as string)} ${actName(ev)}…`);
        break;
      }
      case "act": {
        const by = ev.by as string;
        const v = scene.units.get(by);
        if (v) v.cast = null;
        const targets = ev.targets as string[];
        const isBasic = ev.kind === "basic";
        const ab = isBasic ? null : c.abilities.get(ev.act as string);
        const u = driver.unit(by);
        const tag = isBasic ? (u ? weaponInfo(weaponOf(c, u.weapon), null).tag : "physical") : ab ? abilityTag(ab) : "physical";
        if (v?.side === "party") scene.pose(by, poseFor(isBasic, tag, ab), 520);
        scene.lunge(by);
        const fxTag = isBasic && u && u.side === "enemy" && BITERS.has(u.ref) ? "bite" : isBasic && tag === "pierce" && u && c.gear.get(u.weapon)?.weapon?.kind === "bow" ? "arrow" : tag;
        for (const t of targets) scene.effectFor(t, fxTag);
        if (!isBasic && ["fire", "ice", "lightning", "wind", "earth", "light", "dark"].includes(tag)) sfx.magic();
        if (isBasic && targets.length === 1) pend = { by, el: log(`${nameOf(by)}→${nameOf(targets[0])}`) };
        else {
          log(`${nameOf(by)} ${actName(ev)}`);
          if (targets.length === 1 && !isBasic && ab && ab.do.every((e) => e.op !== "damage" && e.op !== "heal")) pend = { by, el: log(`→${nameOf(targets[0])}`) };
        }
        break;
      }
      case "fail":
        scene.number(ev.by as string, ev.why === "mp" ? "NO MP" : "NO TARGET");
        log(`${nameOf(ev.by as string)} ${String(ev.name).toUpperCase()}: NO ${ev.why === "mp" ? "MP" : "TARGET"}`);
        break;
      case "dmg":
        showDamage(ev);
        break;
      case "heal": {
        const amount = ev.amount as number;
        const src = String(ev.src);
        const isStatus = c.statuses.has(src);
        const absorb = ev.word === "ABSORB";
        if (isStatus && disp(amount) <= 0) break;
        const target = ev.target as string;
        scene.number(target, `+${num(amount)}`, isStatus ? statusCode(src) : absorb ? "ABSORB" : ev.crit ? "CRIT" : undefined);
        if (!isStatus) {
          scene.effectFor(target, "heal");
          sfx.heal();
        }
        if (isStatus) log(`${nameOf(target)} +${num(amount)} ${statusCode(src)}`);
        else hitLine(ev.by as string, target, `+${num(amount)}${ev.crit ? "!" : ""}${absorb ? " ABSORB" : ""}`);
        break;
      }
      case "status": {
        const d = c.statuses.get(ev.status as string)!;
        if (d.show !== "icon") break;
        const unit = ev.unit as string;
        const total = ev.total as number | null;
        const n = total !== null ? (d.id === "shield" ? disp(Math.floor(total)) : Math.round(total)) : null;
        const code = `${statusCode(d.id)}${n !== null ? n : ""}`;
        scene.number(unit, `+${code}`);
        const key = `${unit}:${d.id}`;
        if (vwall - (lastStatusFx.get(key) ?? -9999) > 700) {
          lastStatusFx.set(key, vwall);
          scene.effectFor(unit, d.id === "shield" ? "shield" : d.label === "buff" ? "buff" : "debuff");
          sfx.status();
        }
        log(`${nameOf(unit)} +${code}`);
        break;
      }
      case "status_end": {
        const d = c.statuses.get(ev.status as string);
        if (d?.show === "icon" && setup.settings.designer) log(`${nameOf(ev.unit as string)} -${statusCode(d.id)}`);
        break;
      }
      case "immune":
        scene.number(ev.unit as string, "IMMUNE");
        log(`${nameOf(ev.unit as string)} IMMUNE`);
        break;
      case "interrupt": {
        const v = scene.units.get(ev.unit as string);
        if (v) v.cast = null;
        scene.number(ev.unit as string, "STOPPED");
        log(`${nameOf(ev.unit as string)} ${String(ev.name).toUpperCase()} STOPPED`);
        break;
      }
      case "down":
        scene.number(ev.unit as string, "DOWN", undefined, true);
        scene.down(ev.unit as string);
        sfx.down();
        log(`${nameOf(ev.unit as string)} DOWN`, "fight");
        break;
      case "revive":
        scene.revive(ev.unit as string);
        scene.number(ev.unit as string, "UP", `♥${num(ev.hp as number)}`);
        scene.effectFor(ev.unit as string, "revive");
        sfx.heal();
        log(`${nameOf(ev.unit as string)} UP ♥${num(ev.hp as number)}`, "fight");
        break;
      case "join": {
        const u = ev.unit as { id: string; name: string; ref: string };
        scene.sync();
        scene.effectFor(u.id, "summon");
        foesKey = "";
        log(`${enemyName(u.ref, u.name).toUpperCase()} JOINS`, "fight");
        break;
      }
      case "leave":
        scene.effectFor(ev.unit as string, "split");
        scene.leave(ev.unit as string);
        foesKey = "";
        log(`${nameOf(ev.unit as string)} SPLITS`, "fight");
        break;
      case "strike":
        scene.effectFor(ev.target as string, "slash");
        pend = { by: ev.by as string, el: log(`${nameOf(ev.by as string)}→${nameOf(ev.target as string)} AGAIN`) };
        break;
      case "stop":
        log(`STOP: ${String(ev.why).toUpperCase()}`, "fight");
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
        log(`${ev.result === "won" ? "VICTORY" : "DEFEAT"} T${ev.rounds}`, "fight");
        break;
      default:
        break;
    }
  }

  /** A hit's result: appended to the pending "A→B" line when it's the attacker's, else its own "→B n" line. */
  function hitLine(by: string | null | undefined, target: string, text: string) {
    if (pend && by && pend.by === by) {
      pend.el.textContent = `${pend.el.textContent} ${text}`;
      pend = null;
      msgEl.scrollTop = msgEl.scrollHeight;
    } else log(`→${nameOf(target)} ${text}`);
  }

  function poseFor(isBasic: boolean, tag: string, ab: AbilityT | null | undefined): Pose {
    if (isBasic) return tag === "pierce" ? "thrust" : tag === "slash" || tag === "blunt" ? "swing" : "spell";
    if (!ab) return "skill";
    const t = abilityTag(ab);
    if (["slash", "pierce", "blunt"].includes(t)) return "skill";
    if (["heal", "revive", "cleanse", "buff", "shield", "dispel", "debuff"].includes(t)) return "item";
    return "spell";
  }

  function showDamage(ev: Ev) {
    const target = ev.target as string;
    const amount = ev.amount as number;
    const soaked = (ev.soaked as number) || 0;
    const word = ev.word as string | null;
    const part = ev.part as string;
    const src = String(ev.src);
    const isStatus = part === "pulse" || part === "reaction";
    const by = ev.by as string | undefined;
    if (word === "MISS") {
      scene.number(target, "MISS");
      sfx.miss();
      hitLine(by, target, "MISS");
      return;
    }
    if (word === "AEGIS" || word === "IMMUNE" || word === "BLOCKED") {
      const w = word === "BLOCKED" ? "BLOCK" : word;
      scene.number(target, w);
      if (word !== "IMMUNE") sfx.block();
      hitLine(by, target, w);
      return;
    }
    const crit = !!ev.crit;
    const shown = disp(amount + soaked);
    if (isStatus && shown <= 0) return;
    const sub = isStatus ? statusCode(src) : word === "WEAK" ? "WEAK" : word === "RESIST" ? "RESIST" : soaked ? "SHIELD" : undefined;
    scene.number(target, `${shown}${crit ? "!" : ""}`, sub, crit);
    if (!isStatus || amount >= 100) scene.hit(target);
    if (!isStatus) (crit ? sfx.crit : sfx.hit)();
    if (isStatus && (src === "burn" || src === "poison" || src === "shock")) scene.effectFor(target, src);
    const text = `${shown}${crit ? "!" : ""}${word === "WEAK" ? " WEAK" : word === "RESIST" ? " RES" : ""}${soaked ? " SHD" : ""}`;
    if (isStatus) log(`${nameOf(target)} ${shown} ${statusCode(src)}`);
    else hitLine(by, target, text);
  }

  // ─── Inspect ───
  let inspectAt = 0;
  function select(id: string | null) {
    scene.selected = id;
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
    if (!force && vwall - inspectAt < 300) return;
    inspectAt = vwall;
    inspectEl.style.display = "";
    msgEl.style.display = "none";
    clear(inspectEl);
    const vt = driver.vt;
    const isParty = u.side === "party";
    const designer = setup.settings.designer;
    const sh = shieldOf(u);
    inspectEl.append(h("div", { class: "line" },
      h("span", { class: "grow trunc" }, nameOf(u.id)),
      h("span", null, u.ko ? "KO" : `♥${disp(u.hp)}`),
      isParty || designer ? h("span", { class: "dim" }, `MP${disp(u.mp)}`) : null,
      button("×", () => select(null), "sm"),
    ));
    const codes: string[] = [];
    if (sh) codes.push(`SHD${disp(sh)}`);
    for (const s of u.statuses) {
      const d = c.statuses.get(s.id)!;
      if (d.show === "stat" || d.absorb) continue;
      const n = d.stacking === "intensity" ? String(Math.floor(s.stacks / SUBTICKS)) : "";
      const left = s.end === -1 ? "" : `/${Math.max(0, Math.ceil((s.end - vt) / SUBTICKS))}T`;
      codes.push(`${statusCode(s.id)}${n}${left}`);
    }
    inspectEl.append(h("div", { class: "l dim" }, codes.join(" ") || "-"));
    if (isParty || designer) {
      const acts = u.acts.map((a, i) => {
        const name = a.id === "basic" ? "ATK" : c.abilities.get(a.id)!.name.toUpperCase();
        const casting = u.cast?.act === i;
        const left = Math.max(0, (a.ready - vt) / SUBTICKS);
        return `${name} ${casting ? "…" : left > 0 ? `${Math.ceil(left)}T` : "RDY"}`;
      });
      inspectEl.append(h("div", { class: "l wrap", style: "white-space:normal" }, acts.join(" · ")));
    } else {
      const e = c.enemies.get(u.ref)!;
      inspectEl.append(h("div", { class: "l wrap", style: "white-space:normal" }, (e.abilities ?? []).map((a) => c.abilities.get(a)!.name).join(" · ") || "-"));
    }
    if (designer && !isParty) inspectEl.append(h("div", { class: "l dim" }, `ATK${disp(u.stats.attack)} MAG${disp(u.stats.magic)} ARM${disp(u.stats.armor)}`));
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
      h("thead", null, h("tr", null, h("th", null, ""), h("th", null, "OUT"), h("th", null, "IN"), h("th", null, "♥"))),
      h("tbody", null, ...partyUnits.map((u) => {
        const t = tally.get(u.id) ?? { dealt: 0, taken: 0, healed: 0, acts: 0 };
        return h("tr", null, h("td", null, shortName(u.ref)), h("td", null, String(disp(t.dealt))), h("td", null, String(disp(t.taken))), h("td", null, u.ko ? "KO" : String(disp(u.hp))));
      })),
    );
    const title = won ? (last ? (single ? "VICTORY" : "RUN CLEARED") : "VICTORY") : "DEFEAT";
    const where = single ? "" : `${driver.fightNo}/${driver.fightTotal}`;
    const btns: Child[] = won
      ? [last ? null : button("NEXT", () => nextFight()), button("AGAIN", () => restart(seed)), button("NEW SEED", () => restart(Math.floor(Math.random() * 100000) + 1)), button("MENU", () => { stop(); go("home"); })]
      : [button("RETRY", () => restart(seed)), button("NEW SEED", () => restart(Math.floor(Math.random() * 100000) + 1)), button("MENU", () => { stop(); go("home"); })];
    const box = h("div", { class: "box" },
      h("div", { class: "line" }, h("span", { class: "grow" }, title), h("span", { class: "dim" }, `${where} T${f.round}`)),
      table,
      h("div", { class: "btns", style: "margin-top:.5rem" }, ...btns),
    );
    setTimeout(() => {
      if (stopped || !ended) return;
      for (const el of [partyEl, foesEl, msgEl, inspectEl, ctl]) el.style.display = "none";
      panel.append(box);
    }, 1200);
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
    panel.querySelectorAll(".box.sum, .panel > .box:last-child").forEach(() => {});
    const box = panel.lastElementChild;
    if (box && box !== ctl && box !== inspectEl) box.remove();
    for (const el of [partyEl, foesEl, msgEl, ctl]) el.style.display = "";
    ended = false;
    queue.length = 0;
    scene.units.clear();
    scene.numbers = [];
    scene.fx = [];
    select(null);
    driver.continueRun();
    if (driver.phase === "run_won" || driver.phase === "run_lost") {
      panel.append(h("div", { class: "box" }, h("div", { class: "line" }, driver.phase === "run_won" ? "RUN CLEARED" : "RUN LOST"), h("div", { class: "btns" }, button("MENU", () => { stop(); go("home"); }))));
    }
  }
  function restart(newSeed: number) {
    stop();
    go("battle", { dungeon: args.dungeon, seed: newSeed });
  }
  function fastForward() {
    if (!driver.fight || driver.fight.result) return;
    driver.startFighting();
    queue.length = 0;
    const f = driver.fight;
    let guard = 0;
    while (!f.result && guard++ < 100000) {
      driver.advance(1e9);
      for (const ev of driver.pending.splice(0)) if (ev.t !== "dmg" && ev.t !== "heal" && ev.t !== "status" && ev.t !== "status_end" && ev.t !== "cast") show(ev);
    }
    for (const ev of driver.pending.splice(0)) show(ev);
    scene.numbers = [];
    scene.fx = [];
    for (const v of scene.units.values()) v.cast = null;
    driver.advance(0);
    updateRows();
    endOfFight();
  }
  function stop() {
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown", onKey);
    canvas.removeEventListener("click", onTap);
  }

  // ─── The loop ───
  function frame(now: number) {
    if (stopped) return;
    const dt = Math.min(100, now - lastFrame);
    lastFrame = now;
    if (!paused) {
      vwall += dt;
      while (queue.length && queue[0].when <= vwall) show(queue.shift()!.ev);
      if (driver.pending.length) {
        const stagger = Math.max(12, 70 / speed);
        let when = Math.max(vwall, queue.length ? queue[queue.length - 1].when + stagger : vwall);
        for (const ev of driver.pending.splice(0)) {
          queue.push({ ev, when });
          when += ev.t === "act" || ev.t === "cast" ? stagger * 1.5 : stagger;
        }
      }
      if (driver.phase === "intro" && vwall >= introUntil && !queue.length) driver.startFighting();
      if (driver.phase === "fighting" && queue.length <= 2) driver.advance((dt * speed * SUBTICKS) / setup.settings.tickMs);
      if ((driver.phase === "won" || driver.phase === "lost") && !queue.length && !driver.pending.length) endOfFight();
    }
    scene.frame(vwall);
    updateRows();
    updateFoes();
    tick.textContent = `T${Math.floor(driver.tick)}`;
    if (scene.selected) renderInspect();
    raf = requestAnimationFrame(frame);
  }
  const onKey = (e: KeyboardEvent) => {
    if (stopped) return;
    if ((e.target as HTMLElement)?.tagName === "INPUT") return;
    if (e.key === " ") { paused = !paused; renderSpeed(); e.preventDefault(); }
    else if (e.key === "1") { speed = 1; paused = false; renderSpeed(); }
    else if (e.key === "2") { speed = 2; paused = false; renderSpeed(); }
    else if (e.key === "3") { speed = 4; paused = false; renderSpeed(); }
    else if (e.key === "s") fastForward();
    else if (e.key === "Escape") select(null);
  };
  window.addEventListener("keydown", onKey);
  if (driver.phase === "run_won" || driver.phase === "run_lost") {
    panel.append(h("div", { class: "box" }, h("div", { class: "line" }, "NOTHING TO FIGHT"), h("div", { class: "btns" }, button("MENU", () => { stop(); go("home"); }))));
  }
  if (!single) log(runName(dungeon).toUpperCase(), "fight");
  raf = requestAnimationFrame((t) => { lastFrame = t; frame(t); });
  return stop;
}
