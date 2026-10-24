/**
 * The battle screen: the scene on a canvas, the party panel, the log and the
 * inspect panel, with the run's flow around it (encounter banner, victory and
 * defeat, continue and retry).
 */
import { SUBTICKS, type AbilityT } from "../../../src/schema.js";
import type { CUnit } from "../../../src/engine/combat/fight.js";
import { weaponOf } from "../../../src/engine/combat/fight.js";
import type { Member } from "../../../src/engine/combat/rules.js";
import { c, disp, elementName } from "../content.js";
import { ELEMENT_COLOR, enemyName, manifest, url, type Pose } from "../art.js";
import { button, clear, h } from "../dom.js";
import { party as partyLoadout, save, setup } from "../state.js";
import { abilityInfo, abilityTag, castWord, cooldownWord, statusText, weaponInfo } from "../describe.js";
import { abilityBlock, enemySheet, passiveBlock, statsTable, statusIcon, weaponBlock } from "../sheet.js";
import { Driver, type Ev } from "./driver.js";
import { Scene, colorFor, shieldOf, W, H } from "./scene.js";
import { setSound, sfx } from "./audio.js";
import { go } from "../screens.js";

export type BattleArgs = { dungeon: string; seed?: number };

type Queued = { ev: Ev; when: number };

export function startBattle(root: HTMLElement, args: BattleArgs) {
  const seed = args.seed ?? setup.seed;
  const maybe = c.dungeons.get(args.dungeon);
  if (!maybe) {
    root.append(h("div", { class: "panel warn" }, `No dungeon '${args.dungeon}'.`));
    return;
  }
  const dungeon = maybe;
  let driver: Driver;
  try {
    driver = new Driver({ dungeon: args.dungeon, party: partyLoadout(), seed, firstClear: true });
  } catch (e) {
    root.append(h("div", { class: "panel warn" }, `The party can't enter: ${(e as Error).message}`), button("Back", () => go("home")));
    return;
  }
  const theme = args.dungeon.split("~")[0];
  const single = args.dungeon.includes("~");

  // ─── DOM ───
  const canvas = h("canvas", { width: W, height: H });
  const field = h("div", { class: "field" }, canvas);
  const clock = h("span", { class: "clock" }, "t 0.0");
  const title = h("span", { style: "font-weight:700" });
  const speedBtns = h("span", { class: "speed row", style: "gap:4px" });
  const partyEl = h("div", { class: "party" });
  const logEl = h("div", { class: "log" });
  const inspectEl = h("div", { class: "inspect" });
  const top = h("div", { class: "top" },
    button("◀ Menu", () => { stop(); go("home"); }, "small"),
    title, clock, speedBtns,
    button("Skip fight", () => fastForward(), "small"),
    h("span", { class: "spacer", style: "flex:1" }),
    h("label", { class: "small" }, h("input", { type: "checkbox", checked: setup.settings.autoContinue, onChange: (e: Event) => { setup.settings.autoContinue = (e.target as HTMLInputElement).checked; save(); } }), " auto-continue"),
    h("label", { class: "small" }, h("input", { type: "checkbox", checked: setup.settings.designer, onChange: (e: Event) => { setup.settings.designer = (e.target as HTMLInputElement).checked; save(); scene.designer = setup.settings.designer; renderInspect(true); } }), " designer view"),
    h("label", { class: "small" }, h("input", { type: "checkbox", checked: setup.settings.sound, onChange: (e: Event) => { setup.settings.sound = (e.target as HTMLInputElement).checked; save(); setSound(setup.settings.sound); } }), " sound"),
  );
  const hud = h("div", { class: "hud" }, partyEl, logEl, inspectEl);
  const wrap = h("div", { class: "battle" }, top, field, hud);
  clear(root);
  root.append(wrap);
  setSound(setup.settings.sound);

  const scene = new Scene(canvas, driver, theme);
  scene.designer = setup.settings.designer;
  scene.showEnemyNumbers = setup.settings.showEnemyNumbers;

  // ─── Clock and speed ───
  let speed = 1;
  let paused = false;
  let vwall = 0;
  let lastFrame = performance.now();
  let raf = 0;
  let stopped = false;
  const queue: Queued[] = [];
  let introUntil = 0;
  let overlay: HTMLElement | null = null;

  const speeds: [string, number][] = [["⏸", 0], ["½×", 0.5], ["1×", 1], ["2×", 2], ["4×", 4]];
  const renderSpeed = () => {
    clear(speedBtns);
    for (const [label, s] of speeds) speedBtns.append(button(label, () => { if (s === 0) paused = !paused; else (speed = s), (paused = false); renderSpeed(); }, (s === 0 ? paused : !paused && speed === s) ? "active small" : "small"));
  };
  renderSpeed();

  // ─── Party cards ───
  type Card = { el: HTMLElement; hp: HTMLElement; hpTxt: HTMLElement; mp: HTMLElement; mpTxt: HTMLElement; state: HTMLElement; statuses: HTMLElement; statusKey: string; acts: { bar: HTMLElement; fill: HTMLElement; label: HTMLElement; right: HTMLElement }[] };
  const cards = new Map<string, Card>();
  function buildCards() {
    clear(partyEl);
    cards.clear();
    for (const u of driver.units().filter((x) => x.side === "party")) {
      const sheet = manifest.classes[u.ref];
      const face = h("div", { class: "portrait", style: `width:48px;height:48px;background-image:url(${url(sheet)});background-size:${1296 / 3}px ${864 / 3}px;background-position:${-144 / 3 * 3}px 0;transform:scaleX(-1)` });
      const hp = h("i", { style: "background:var(--hp)" }), hpTxt = h("span", { class: "label" });
      const mp = h("i", { style: "background:var(--mp)" }), mpTxt = h("span", { class: "label" });
      const state = h("span", { class: "state" });
      const statuses = h("div", { class: "statuses" });
      const acts = u.acts.map(() => ({ bar: h("div", { class: "bar cd" }), fill: h("i"), label: h("span", { class: "label" }), right: h("span", { class: "right" }) }));
      const actsEl = h("div", { class: "acts" }, ...acts.map((a, i) => {
        a.bar.append(a.fill, a.label);
        return h("div", { class: "act", title: u.acts[i].id === "basic" ? "Basic attack" : c.abilities.get(u.acts[i].id)?.text }, a.bar, a.right);
      }));
      const el = h("div", { class: "ucard", onClick: () => select(u.id) },
        h("div", { class: "head" }, h("div", { class: "row", style: "gap:6px;align-items:center" }, face, h("span", { class: "name" }, u.name)), state),
        h("div", { class: "bar", style: "height:14px" }, hp, hpTxt),
        h("div", { class: "bar", style: "height:10px" }, mp, mpTxt),
        statuses, actsEl,
      );
      partyEl.append(el);
      cards.set(u.id, { el, hp, hpTxt, mp, mpTxt, state, statuses, statusKey: "", acts });
    }
  }

  function updateCards() {
    const vt = driver.vt;
    for (const u of driver.units()) {
      const card = cards.get(u.id);
      if (!card) continue;
      const max = u.stats.max_hp;
      const hpf = Math.max(0, u.hp / max);
      card.hp.style.width = `${hpf * 100}%`;
      card.hp.style.background = hpf > 0.5 ? "var(--hp)" : hpf > 0.25 ? "#e8c23a" : "var(--hp-low)";
      const sh = shieldOf(u);
      card.hpTxt.textContent = `HP ${disp(u.hp)} / ${disp(max)}${sh ? `  +${disp(sh)} shield` : ""}`;
      card.mp.style.width = `${Math.max(0, u.mp / Math.max(1, u.stats.max_mp)) * 100}%`;
      card.mpTxt.textContent = `MP ${disp(u.mp)} / ${disp(u.stats.max_mp)}`;
      card.el.classList.toggle("ko", u.ko);
      card.el.classList.toggle("selected", scene.selected === u.id);
      const v = scene.units.get(u.id);
      const locked = u.statuses.find((s) => c.statuses.get(s.id)?.lockout?.covers === "all");
      const silenced = u.statuses.find((s) => c.statuses.get(s.id)?.lockout?.covers === "ability");
      card.state.textContent = u.ko ? "DOWN" : locked ? `${c.statuses.get(locked.id)!.name.toLowerCase()}` : v?.cast ? `casting ${v.cast.name}` : u.busy > vt ? "recovering" : silenced ? "silenced" : "ready";
      const key = u.statuses.map((s) => `${s.id}:${Math.floor(s.stacks / SUBTICKS)}:${s.end === -1 ? "" : Math.ceil((s.end - vt) / SUBTICKS)}`).join("|");
      if (key !== card.statusKey) {
        card.statusKey = key;
        clear(card.statuses);
        for (const s of u.statuses) {
          const d = c.statuses.get(s.id)!;
          if (d.show !== "icon") continue;
          const n = d.stacking === "intensity" ? (s.id === "shield" ? disp(Math.floor(s.stacks / SUBTICKS)) : Math.floor(s.stacks / SUBTICKS)) : null;
          const left = s.end === -1 ? null : Math.max(0, (s.end - vt) / SUBTICKS);
          const total = d.duration ?? 1;
          card.statuses.append(h("div", { class: "sicon", title: `${d.name}${n !== null ? ` ×${n}` : ""}${left !== null ? `, ${left.toFixed(1)}t left` : ""}: ${d.text ?? ""}` },
            h("img", { src: url(manifest.statuses[s.id] ?? "") }),
            n !== null ? h("span", { class: "n" }, String(n)) : null,
            left !== null ? h("span", { class: "t", style: `width:${Math.min(100, (left / total) * 100)}%` }) : null,
          ));
        }
      }
      u.acts.forEach((a, i) => {
        const ui = card.acts[i];
        const isBasic = a.id === "basic";
        const ab = isBasic ? null : c.abilities.get(a.id)!;
        const base = isBasic ? weaponInfo(weaponOf(c, u.weapon), null).cooldown * SUBTICKS : ab!.cooldown * SUBTICKS;
        const name = isBasic ? "Attack" : ab!.name;
        const casting = !!u.cast && u.cast.act === i;
        const lockedOut = locked || (silenced && !isBasic);
        const ready = a.ready <= vt;
        ui.bar.className = `bar ${casting ? "cast" : lockedOut ? "locked" : ready ? "ready" : "cd"}`;
        if (casting && v?.cast) {
          const p = Math.max(0, Math.min(1, (vt - v.cast.start) / Math.max(1, v.cast.end - v.cast.start)));
          ui.fill.style.width = `${p * 100}%`;
          ui.label.textContent = `${name}: winding up`;
          ui.right.textContent = `${Math.max(0, (v.cast.end - vt) / SUBTICKS).toFixed(1)}t`;
        } else if (ready) {
          ui.fill.style.width = "100%";
          const idle = !u.ko && !u.cast && u.busy <= vt;
          const noMp = ab && u.mp < (ab.mp ?? 0);
          ui.label.textContent = lockedOut ? `${name}: locked` : noMp ? `${name}: no MP` : idle ? `${name}: waiting` : `${name}: ready`;
          ui.right.textContent = ab ? `${disp(ab.mp ?? 0)} MP` : "";
        } else {
          const left = (a.ready - vt) / SUBTICKS;
          ui.fill.style.width = `${Math.max(0, Math.min(1, 1 - (a.ready - vt) / base)) * 100}%`;
          ui.label.textContent = `${name}`;
          ui.right.textContent = `${left.toFixed(1)}t`;
        }
      });
    }
  }

  // ─── Log ───
  let logLines = 0;
  function log(text: string, kind = "", at?: number) {
    const line = h("div", { class: `l ${kind}` }, at !== undefined ? h("span", { class: "t" }, `t${(at / SUBTICKS).toFixed(1).padStart(5)} `) : "", text);
    logEl.append(line);
    if (++logLines > 400) logEl.removeChild(logEl.firstChild!);
    logEl.scrollTop = logEl.scrollHeight;
  }
  const nameOf = (id: string | null | undefined): string => {
    if (!id) return "?";
    const u = driver.unit(id);
    return u ? (u.side === "party" ? u.name : enemyName(u.ref, u.name)) : id;
  };

  // ─── Events → visuals ───
  const lastStatusFx = new Map<string, number>();
  function show(ev: Ev) {
    const at = ev.at as number | undefined;
    switch (ev.t) {
      case "fight_start": {
        scene.sync();
        buildCards();
        const stage = dungeon.stages.find((s) => s.id === ev.stage);
        const name = stage?.kind === "fight" ? stage.name ?? stage.id : String(ev.stage);
        const foes = driver.units().filter((u) => u.side === "enemy");
        const counts = new Map<string, number>();
        for (const f of foes) counts.set(f.ref, (counts.get(f.ref) ?? 0) + 1);
        const sub = [...counts].map(([ref, n]) => `${n}× ${manifest.enemies[ref]?.name ?? c.enemies.get(ref)!.name}`).join(", ");
        title.textContent = `${dungeon.name.replace(/^Run \d+: /, "")} · ${single ? "" : `fight ${driver.fightNo} of ${driver.fightTotal}: `}${name}`;
        scene.showBanner(ev.boss ? `BOSS: ${name.replace(/^\d+\. /, "")}` : name.replace(/^\d+\. /, ""), sub, 1600, ev.boss ? "#ff6a6a" : "#ffd85a");
        log(`${ev.boss ? "Boss fight" : "Fight"}: ${name} — ${sub}`, "fight");
        introUntil = vwall + 1500;
        break;
      }
      case "cast": {
        const v = scene.units.get(ev.by as string);
        if (v) v.cast = { name: ev.name === "attack" ? "Attack" : String(ev.name), start: at!, end: ev.ends as number };
        if (v?.side === "party") scene.pose(v.id, "chant", 0);
        scene.glow(ev.by as string, "#ffd85a", (ev.ends as number) - at! > 0 ? Math.max(300, ((ev.ends as number) - at!) / SUBTICKS * setup.settings.tickMs / speed) : 300);
        sfx.cast();
        log(`${nameOf(ev.by as string)} begins ${ev.name === "attack" ? "an attack" : ev.name} (${(((ev.ends as number) - at!) / SUBTICKS).toFixed(1)}t wind-up)`, "l-act", at);
        break;
      }
      case "act": {
        const by = ev.by as string;
        const v = scene.units.get(by);
        if (v) v.cast = null;
        const targets = ev.targets as string[];
        const isBasic = ev.kind === "basic";
        const ab = isBasic ? null : c.abilities.get(ev.act as string);
        const tag = isBasic ? (driver.unit(by) ? weaponInfo(weaponOf(c, driver.unit(by)!.weapon), null).tag : "physical") : ab ? abilityTag(ab) : "physical";
        if (v?.side === "party") scene.pose(by, poseFor(isBasic, tag, ab), 520);
        scene.lunge(by);
        const u = driver.unit(by);
        const fxTag = isBasic && u && u.side === "enemy" && BITERS.has(u.ref) ? "bite" : isBasic && tag === "pierce" && u && c.gear.get(u.weapon)?.weapon?.kind === "bow" ? "arrow" : tag;
        for (const t of targets) scene.effectFor(t, fxTag);
        if (!isBasic && ab && (tag in ELEMENT_COLOR) && !["slash", "pierce", "blunt", "physical"].includes(tag)) sfx.magic();
        log(`${nameOf(by)} ${isBasic ? "attacks" : `uses ${ev.name} on`} ${targets.map(nameOf).join(", ")}`, "l-act", at);
        break;
      }
      case "fail":
        scene.number(ev.by as string, ev.why === "mp" ? "no MP" : "no target", "#aaa", 16, String(ev.name));
        log(`${nameOf(ev.by as string)}'s ${ev.name} fizzles (${ev.why === "mp" ? "not enough MP" : "no target"})`, "", at);
        break;
      case "dmg":
        showDamage(ev);
        break;
      case "heal": {
        const amount = ev.amount as number;
        const src = String(ev.src);
        const isStatus = c.statuses.has(src);
        const absorb = ev.word === "ABSORB";
        if (isStatus && amount <= 0) break;
        scene.number(ev.target as string, `+${disp(amount)}`, absorb ? "#9ad0ff" : "#7dff8a", isStatus ? 18 : 24, absorb ? "absorbed" : isStatus ? c.statuses.get(src)!.name.toLowerCase() : ev.crit ? "CRIT heal" : undefined, absorb ? "#9ad0ff" : undefined);
        if (!isStatus) {
          scene.effectFor(ev.target as string, "heal");
          sfx.heal();
        }
        log(`${nameOf(ev.target as string)} ${absorb ? "absorbs" : "heals"} ${disp(amount)}${isStatus ? ` from ${c.statuses.get(src)!.name}` : ` from ${nameOf(ev.by as string)}`}${ev.crit ? " (CRIT)" : ""} → ${disp(ev.hp as number)} HP`, "heal", at);
        break;
      }
      case "status": {
        const d = c.statuses.get(ev.status as string)!;
        if (d.show !== "icon") break;
        const unit = ev.unit as string;
        const total = ev.total as number | null;
        const n = total !== null ? (d.id === "shield" ? disp(Math.floor(total)) : Math.round(total)) : null;
        const color = d.label === "buff" ? "#a8e8ff" : "#d8a8ff";
        scene.number(unit, `+${d.name}${n !== null ? ` ${n}` : ""}`, color, 15);
        const key = `${unit}:${d.id}`;
        if (vwall - (lastStatusFx.get(key) ?? -9999) > 700) {
          lastStatusFx.set(key, vwall);
          scene.effectFor(unit, d.id === "shield" ? "shield" : d.label === "buff" ? "buff" : "debuff", 0.8);
          sfx.status();
        }
        log(`${nameOf(unit)} gains ${d.name}${n !== null ? ` (${n})` : ""}`, "status", at);
        break;
      }
      case "status_end": {
        const d = c.statuses.get(ev.status as string);
        if (d?.show === "icon") log(`${nameOf(ev.unit as string)}'s ${d.name} ends (${String(ev.cause).replace("stacks", "used up").replace("ko", "knocked out")})`, "status", at);
        break;
      }
      case "immune":
        scene.number(ev.unit as string, "IMMUNE", "#bbb", 18, String(ev.name));
        log(`${nameOf(ev.unit as string)} is immune to ${ev.name}`, "status", at);
        break;
      case "interrupt": {
        const v = scene.units.get(ev.unit as string);
        if (v) v.cast = null;
        scene.number(ev.unit as string, "INTERRUPTED", "#ff9a3a", 20, String(ev.name));
        log(`${nameOf(ev.unit as string)} is interrupted: ${ev.name} is lost`, "down", at);
        break;
      }
      case "down":
        scene.number(ev.unit as string, "DOWN", "#ff5a5a", 30);
        scene.down(ev.unit as string);
        sfx.down();
        log(`${nameOf(ev.unit as string)} is down.`, "down", at);
        break;
      case "revive":
        scene.revive(ev.unit as string);
        scene.number(ev.unit as string, "RAISED", "#7dff8a", 26, `${disp(ev.hp as number)} HP${ev.ready ? ", ready" : ""}`);
        scene.effectFor(ev.unit as string, "revive");
        sfx.heal();
        log(`${nameOf(ev.unit as string)} is raised by ${nameOf(ev.by as string)} (${disp(ev.hp as number)} HP${ev.ready ? ", every action ready" : ""})`, "heal", at);
        break;
      case "join": {
        const u = ev.unit as { id: string; name: string; ref: string };
        scene.sync();
        scene.effectFor(u.id, "summon");
        renderLegendOrInspect();
        log(`${enemyName(u.ref, u.name)} joins the fight`, "fight", at);
        break;
      }
      case "leave":
        scene.effectFor(ev.unit as string, "split");
        scene.leave(ev.unit as string);
        log(`${nameOf(ev.unit as string)} splits`, "fight", at);
        break;
      case "strike":
        log(`${nameOf(ev.by as string)} strikes again (${ev.name}) at ${nameOf(ev.target as string)}`, "l-act", at);
        scene.effectFor(ev.target as string, "slash", 0.7);
        break;
      case "stop":
        log(`The fight stops: ${ev.why}`, "down", at);
        break;
      case "fight_end":
        if (ev.result === "won") {
          scene.showBanner("VICTORY", "", 2500, "#7dff8a");
          sfx.win();
          for (const u of driver.units()) if (u.side === "party" && !u.ko) scene.pose(u.id, "victory", 2500);
        } else {
          scene.showBanner("DEFEATED", "", 2500, "#ff5a5a");
          sfx.lose();
        }
        log(`${ev.result === "won" ? "Won" : "Lost"} at tick ${ev.rounds}.`, "fight");
        break;
      case "run_end":
        log(`Run ${ev.outcome}.`, "fight");
        break;
      default:
        break;
    }
  }

  const BITERS = new Set(["wolf", "snow_wolf", "snake", "bat", "hellhound", "leech"]);
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
    const soaked = ev.soaked as number;
    const word = ev.word as string | null;
    const part = ev.part as string;
    const src = String(ev.src);
    const at = ev.at as number;
    const isStatus = part === "pulse" || part === "reaction";
    const tag = isStatus ? (c.statuses.get(src)?.element ?? "none") : src === "basic" ? (driver.unit(ev.by as string) ? weaponInfo(weaponOf(c, driver.unit(ev.by as string)!.weapon), null).tag : "physical") : c.abilities.has(src) ? abilityTag(c.abilities.get(src)!) : "physical";
    const color = isStatus ? (c.statuses.get(src)?.element ? colorFor(tag) : "#ffb3c6") : colorFor(tag);
    const t = nameOf(target);
    if (word === "MISS") {
      scene.number(target, "MISS", "#bbb", 22);
      sfx.miss();
      log(`${t} dodges ${nameOf(ev.by as string)}'s hit`, "dmg", at);
      return;
    }
    if (word === "AEGIS") {
      scene.number(target, "AEGIS!", "#ffd85a", 26, "blocked outright");
      sfx.block();
      log(`${t}'s Aegis blocks the hit`, "dmg", at);
      return;
    }
    if (word === "IMMUNE") {
      scene.number(target, "IMMUNE", "#bbb", 20);
      log(`${t} is immune`, "dmg", at);
      return;
    }
    if (word === "BLOCKED") {
      scene.number(target, "BLOCKED", "#bbb", 18, "armor");
      sfx.block();
      log(`${t}'s armor blocks the hit`, "dmg", at);
      return;
    }
    const crit = !!ev.crit;
    const size = isStatus ? 18 : crit ? 34 : word === "WEAK" ? 30 : 26;
    const subs: string[] = [];
    if (crit) subs.push("CRIT");
    if (word === "WEAK") subs.push("WEAK!");
    if (word === "RESIST") subs.push("resisted");
    if (isStatus) subs.push(c.statuses.get(src)?.name.toLowerCase() ?? src);
    else if (part === "rider") subs.push(elementName(tag));
    else if (tag in ELEMENT_COLOR && !["physical", "slash", "pierce", "blunt"].includes(tag)) subs.push(elementName(tag));
    if (soaked) subs.push(`${disp(soaked)} soaked`);
    scene.number(target, amount ? String(disp(amount)) : "0", crit ? "#ffe34d" : color, size, subs.join(" · ") || undefined, soaked ? "#9ad0ff" : word === "WEAK" ? "#ff8080" : word === "RESIST" ? "#aaa" : undefined);
    if (!isStatus || amount >= 100) scene.hit(target, crit ? "#ffe34d" : color);
    if (!isStatus) (crit ? sfx.crit : sfx.hit)();
    if (isStatus && (src === "burn" || src === "poison" || src === "shock")) scene.effectFor(target, src, 0.6);
    const hp = disp(ev.hp as number);
    log(`${t} takes ${crit ? "CRIT " : ""}${disp(amount)}${word ? ` ${word}` : ""}${isStatus ? ` from ${c.statuses.get(src)?.name ?? src}` : part === "extra" ? " (extra strike)" : ""}${soaked ? `, ${disp(soaked)} soaked` : ""} → ${hp} HP${(ev.shield as number) ? ` +${disp(ev.shield as number)}` : ""}`, "dmg", at);
  }

  // ─── Inspect panel ───
  let inspectAt = 0;
  function select(id: string | null) {
    scene.selected = id;
    renderInspect(true);
  }
  function renderLegendOrInspect() {
    renderInspect(true);
  }
  function renderInspect(force = false) {
    if (!force && vwall - inspectAt < 300) return;
    inspectAt = vwall;
    clear(inspectEl);
    const id = scene.selected;
    const u = id ? driver.unit(id) : undefined;
    if (!u) {
      inspectEl.append(
        h("h3", null, "Inspect"),
        h("div", { class: "muted" }, "Click a unit on the field or a party card."),
        h("div", { class: "legend", style: "margin-top:8px" },
          ...Object.entries({ physical: "physical", fire: "fire", ice: "ice", lightning: "lightning", wind: "wind", earth: "earth", light: "light", dark: "dark", none: "status tick", heal: "heal", shield: "shield soak" }).map(([k, n]) => h("span", null, h("i", { style: `background:${ELEMENT_COLOR[k]}` }), n)),
        ),
        h("div", { class: "muted small", style: "margin-top:8px" }, "Bars over a unit: health (green→red), a Shield above it (blue), statuses with their stacks and a yellow timer, and a wind-up bar while an action winds up. Numbers are at 100 per point of the documents' scale."),
      );
      return;
    }
    const vt = driver.vt;
    const isParty = u.side === "party";
    const name = isParty ? u.name : enemyName(u.ref, u.name);
    const designer = setup.settings.designer;
    inspectEl.append(h("h3", null, name, " ", h("span", { class: "muted small" }, isParty ? c.classes.get(u.ref)!.name === u.name ? "" : c.classes.get(u.ref)!.name : c.enemies.get(u.ref)!.rank), " ", button("✕", () => select(null), "small")));
    inspectEl.append(h("div", null, `HP ${disp(u.hp)}/${disp(u.stats.max_hp)}${shieldOf(u) ? ` · Shield ${disp(shieldOf(u))}` : ""}${isParty || designer ? ` · MP ${disp(u.mp)}/${disp(u.stats.max_mp)}` : ""}${u.ko ? " · DOWN" : ""}`));
    const sts = u.statuses.filter((s) => c.statuses.get(s.id)!.show !== "stat");
    if (sts.length) {
      inspectEl.append(h("h3", null, "Statuses"));
      for (const s of sts) {
        const d = c.statuses.get(s.id)!;
        const n = d.stacking === "intensity" ? (s.id === "shield" ? disp(Math.floor(s.stacks / SUBTICKS)) : Math.floor(s.stacks / SUBTICKS)) : null;
        const left = s.end === -1 ? "for the fight" : `${Math.max(0, (s.end - vt) / SUBTICKS).toFixed(1)}t left`;
        inspectEl.append(h("div", { class: "row", style: "gap:6px;align-items:center" }, statusIcon(s.id, true), h("b", null, d.name), n !== null ? h("span", null, `×${n}`) : null, h("span", { class: "muted" }, left), h("span", { class: `tag ${d.label}` }, d.label)));
        inspectEl.append(h("div", { class: "muted small", style: "margin-left:26px" }, statusText(d).slice(0, 2).join(" ")));
      }
    }
    inspectEl.append(h("h3", null, "Actions"));
    if (isParty || designer) {
      u.acts.forEach((a, i) => {
        const isBasic = a.id === "basic";
        const ab = isBasic ? null : c.abilities.get(a.id)!;
        const casting = u.cast?.act === i;
        const left = Math.max(0, (a.ready - vt) / SUBTICKS);
        const state = casting ? "winding up" : left > 0 ? `ready in ${left.toFixed(1)}t` : "ready";
        if (isBasic) {
          const w = weaponInfo(weaponOf(c, u.weapon), u.stats);
          inspectEl.append(h("div", { class: "ability" }, h("div", { class: "name" }, "Basic attack ", h("span", { class: "muted small" }, `${w.kind}: ${w.hit}, every ${w.cooldown}t${w.cast ? `, wind-up ${w.cast}t` : ""}`)), h("div", { class: "small", style: "color:var(--accent)" }, state)));
        } else {
          const info = abilityInfo(ab!, u.stats);
          inspectEl.append(h("div", { class: "ability" },
            h("div", { class: "name" }, info.name, " ", h("span", { class: "muted small" }, info.text)),
            h("div", { class: "timing" }, `CD ${info.cooldown}t (${cooldownWord(info.cooldown)}) · wind-up ${info.cast}t (${castWord(info.cast)}) · ${disp(info.mp)} MP${info.seek ? " · Seek" : ""}`),
            h("div", { class: "small" }, "→ ", info.target, info.waits ? h("span", { class: "muted" }, ` · ${info.waits}`) : null),
            ...info.effects.map((e) => h("div", { class: "small muted" }, e)),
            h("div", { class: "small", style: "color:var(--accent)" }, state),
          ));
        }
      });
    } else {
      const e = c.enemies.get(u.ref)!;
      inspectEl.append(h("div", { class: "muted small" }, e.text));
      for (const a of e.abilities ?? []) inspectEl.append(h("div", { class: "ability" }, h("div", { class: "name" }, c.abilities.get(a)!.name, " ", h("span", { class: "muted small" }, c.abilities.get(a)!.text))));
      for (const s of e.statuses ?? []) inspectEl.append(h("div", { class: "ability" }, h("div", { class: "name" }, statusIcon(s, true), " ", c.statuses.get(s)!.name, " ", h("span", { class: "muted small" }, c.statuses.get(s)!.text))));
    }
    if (isParty) {
      const p = passiveBlock(u.ref);
      if (p) inspectEl.append(h("h3", null, "Passive"), p);
      const m = u as unknown as Member;
      inspectEl.append(h("h3", null, "Gear"), h("div", { class: "small" }, Object.values(setup.gear[u.ref] ?? {}).length || m.weapon !== "unarmed" ? [m.weapon, ...Object.entries(setup.gear[u.ref] ?? {}).filter(([k]) => k !== "weapon").map(([, g]) => g)].map((g) => c.gear.get(g)?.name ?? g).join(", ") : "nothing"));
      inspectEl.append(h("h3", null, "Stats"), statsTable(u.stats, null));
    } else if (designer) {
      inspectEl.append(h("h3", null, "Stats (hidden from players)"), statsTable(u.stats, null));
      for (const s of c.enemies.get(u.ref)!.statuses ?? []) inspectEl.append(h("div", { class: "ability" }, h("div", { class: "name" }, statusIcon(s, true), " ", c.statuses.get(s)!.name, " ", h("span", { class: "muted small" }, c.statuses.get(s)!.text))));
    }
    void weaponBlock;
    void abilityBlock;
    void enemySheet;
  }

  // ─── Canvas input ───
  const toCanvas = (e: MouseEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
  };
  canvas.addEventListener("mousemove", (e) => {
    const [x, y] = toCanvas(e);
    scene.hover = scene.hitTest(x, y);
    canvas.style.cursor = scene.hover ? "pointer" : "crosshair";
  });
  canvas.addEventListener("click", (e) => {
    const [x, y] = toCanvas(e);
    select(scene.hitTest(x, y));
  });

  // ─── Flow ───
  function showOverlay(el: HTMLElement) {
    hideOverlay();
    overlay = h("div", { class: "overlay" }, el);
    field.append(overlay);
  }
  function hideOverlay() {
    overlay?.remove();
    overlay = null;
  }
  let ended = false;
  function endOfFight() {
    if (ended) return;
    ended = true;
    const f = driver.fight!;
    const partyUnits = driver.units().filter((u) => u.side === "party");
    const summary = h("div", { class: "small", style: "margin-top:6px" }, ...partyUnits.map((u) => h("div", null, `${u.name}: ${u.ko ? "down" : `${disp(u.hp)}/${disp(u.stats.max_hp)} HP, ${disp(u.mp)}/${disp(u.stats.max_mp)} MP`}`)));
    if (f.result === "won") {
      const last = single || driver.fightNo >= driver.fightTotal;
      const box = h("div", { class: "box" },
        h("h2", { style: "color:var(--good)" }, last ? (single ? "Fight won" : "Run cleared!") : "Victory"),
        h("div", { class: "muted" }, `Tick ${f.round}.${last ? "" : ` Fight ${driver.fightNo} of ${driver.fightTotal} done. HP and MP carry over; nothing heals between fights.`}`),
        summary,
        h("div", { class: "btns" },
          last ? null : button("Next fight ▶", () => nextFight(), "primary"),
          button("Replay this fight", () => restart(seed), ""),
          button("New seed", () => restart(Math.floor(Math.random() * 100000) + 1), ""),
          button("Menu", () => { stop(); go("home"); }, ""),
        ),
      );
      setTimeout(() => { if (!stopped && ended) showOverlay(box); }, 1200);
      if (!last && setup.settings.autoContinue) setTimeout(() => { if (!stopped && ended) nextFight(); }, 2200);
    } else {
      const box = h("div", { class: "box" },
        h("h2", { style: "color:var(--bad)" }, "Defeated"),
        h("div", { class: "muted" }, `Tick ${f.round}. ${single ? "" : `Lost at fight ${driver.fightNo} of ${driver.fightTotal}.`} Losing costs nothing: change the build and try again.`),
        summary,
        h("div", { class: "btns" },
          button("Retry (same seed)", () => restart(seed), "primary"),
          button("Retry (new seed)", () => restart(Math.floor(Math.random() * 100000) + 1), ""),
          button("Menu", () => { stop(); go("home"); }, ""),
        ),
      );
      setTimeout(() => { if (!stopped && ended) showOverlay(box); }, 1200);
    }
  }
  function nextFight() {
    hideOverlay();
    ended = false;
    queue.length = 0;
    scene.units.clear();
    scene.numbers = [];
    scene.fx = [];
    driver.continueRun();
    if (driver.phase === "run_won" || driver.phase === "run_lost") {
      showOverlay(h("div", { class: "box" }, h("h2", null, driver.phase === "run_won" ? "Run cleared!" : "Run lost"), h("div", { class: "btns" }, button("Menu", () => { stop(); go("home"); }, "primary"))));
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
    updateCards();
    endOfFight();
  }
  function stop() {
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown", onKey);
  }

  // ─── The loop ───
  function frame(now: number) {
    if (stopped) return;
    const dt = Math.min(100, now - lastFrame);
    lastFrame = now;
    if (!paused) {
      vwall += dt;
      // show queued events whose time has come
      while (queue.length && queue[0].when <= vwall) show(queue.shift()!.ev);
      // take new events from the driver and schedule them
      if (driver.pending.length) {
        const stagger = Math.max(12, 70 / speed);
        let when = Math.max(vwall, queue.length ? queue[queue.length - 1].when + stagger : vwall);
        for (const ev of driver.pending.splice(0)) {
          queue.push({ ev, when });
          when += ev.t === "act" || ev.t === "cast" ? stagger * 1.5 : stagger;
        }
      }
      if (driver.phase === "intro" && vwall >= introUntil && !queue.length) driver.startFighting();
      if (driver.phase === "fighting" && queue.length <= 2) {
        driver.advance((dt * speed * SUBTICKS) / setup.settings.tickMs);
      }
      if ((driver.phase === "won" || driver.phase === "lost") && !queue.length && !driver.pending.length) endOfFight();
    }
    scene.frame(vwall);
    updateCards();
    clock.textContent = `t ${driver.tick.toFixed(1)}`;
    if (scene.selected) renderInspect();
    raf = requestAnimationFrame(frame);
  }
  const onKey = (e: KeyboardEvent) => {
    if (stopped) { window.removeEventListener("keydown", onKey); return; }
    if ((e.target as HTMLElement)?.tagName === "INPUT") return;
    if (e.key === " ") { paused = !paused; renderSpeed(); e.preventDefault(); }
    else if (e.key === "1") { speed = 1; paused = false; renderSpeed(); }
    else if (e.key === "2") { speed = 2; paused = false; renderSpeed(); }
    else if (e.key === "3") { speed = 4; paused = false; renderSpeed(); }
    else if (e.key === "0") { speed = 0.5; paused = false; renderSpeed(); }
    else if (e.key === "s") fastForward();
    else if (e.key === "Escape") select(null);
  };
  window.addEventListener("keydown", onKey);
  renderInspect(true);
  if (driver.phase === "run_won" || driver.phase === "run_lost") {
    showOverlay(h("div", { class: "box" }, h("h2", null, "Nothing to fight"), h("div", { class: "btns" }, button("Menu", () => { stop(); go("home"); }))));
  }
  raf = requestAnimationFrame((t) => { lastFrame = t; frame(t); });
}
