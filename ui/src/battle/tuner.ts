/**
 * The FX SIZES screen (Settings, with DESIGNER on): a sample fight that never starts, where one look at a time plays
 * again and again on the units it's for. A party's skill plays on a plain foe and the boss together, a foe's on a party
 * member, a status on both sides, so each size shows on a small target and a big one.
 *
 * AUTO leaves the size to the field (it picks by the unit, scene.ts); 1×, 1.5×, 2× or 3× fixes it for all of the look's
 * effects. Choices are kept on this device and used in every fight at once (effects.ts). EXPORT downloads them, to be
 * committed as everyone's; RESET forgets this device's.
 */
import { c } from "../content.js";
import { dealsDamage } from "../describe.js";
import { button, h, toast, win } from "../dom.js";
import { exportFxSizes, fxCatalog, fxSize, fxSizeChanges, resetFxSizes, setFxSize, type FxEntry } from "../effects.js";
import { FX_SPEEDS, save, setup } from "../state.js";
import type { Driver, Ev } from "./driver.js";
import type { FieldFx } from "./effects.js";
import type { Scene } from "./scene.js";

/** The fight the screen stands in: a plain foe and a boss (two Bandits and the Ogre Chief). */
export const TUNER_FIGHT = "old_road~ogre_chief";
const SIZES = [0, 1, 1.5, 2, 3] as const;
/** The quiet between two plays of a look, in ms. */
const REST = 450;

export type TunerHooks = { scene: Scene; driver: Driver; fx: FieldFx; now: () => number; frame: HTMLElement };

export function tuner(o: TunerHooks): { panel: HTMLElement; tick: () => void; replay: () => void } {
  const all = fxCatalog();
  const groups = [...new Set(all.map((e) => e.group))];
  let group = 0, at = 0, idle: number | null = null, n = 0;
  const inGroup = () => all.filter((e) => e.group === groups[group]);
  const entry = (): FxEntry => inGroup()[at];

  // ─── Playing a look ───
  const units = () => o.driver.units().filter((u) => !u.ko && !u.gone);
  const party = () => units().filter((u) => u.side === "party");
  const foes = () => units().filter((u) => u.side === "enemy");
  const boss = () => foes().find((u) => c.enemies.get(u.ref)?.rank === "boss") ?? foes()[0];
  const plain = () => foes().find((u) => u !== boss()) ?? boss();
  const mid = () => party()[1] ?? party()[0];
  /** An action as a fight tells it: the act, then each hit of `hits` on its targets and one on each of `more`. */
  function act(by: string, targets: string[], o2: { act: string; kind: "basic" | "ability"; look?: unknown; damage: boolean; hits?: number; more?: string[] }) {
    const at = --n;
    o.fx.field({ t: "act", vis: "player", at, by, act: o2.act, kind: o2.kind, targets, name: o2.act, ...(o2.look ? { fxLook: o2.look } : {}) });
    if (!o2.damage) return;
    const hit = (t: string): Ev => ({ t: "dmg", vis: "player", at, by, target: t, part: "hit", amount: 9000, soaked: 0, word: null, src: o2.act });
    for (const t of targets) for (let i = 0; i < (o2.hits ?? 1); i++) o.fx.field(hit(t));
    for (const t of o2.more ?? []) o.fx.field(hit(t));
  }
  function play() {
    const e = entry();
    if (!e || !party().length || !foes().length) return;
    // A clean field each time: what the last play left (its effects, numbers, waiting hits) goes.
    o.fx.drop();
    o.scene.clearTransient();
    const s = e.sample;
    if (s.kind === "ability") {
      const ab = c.abilities.get(s.id)!;
      const ours = !!ab.class;
      const caster = ours ? (party().find((u) => u.ref === ab.class) ?? party()[0]) : boss();
      const theirs = ours ? [plain(), boss()] : party();
      const kin = ours ? party() : foes();
      const tg = ab.target;
      const every = typeof tg === "object" && "pick" in tg && tg.pick === "all";
      const side = typeof tg === "object" && "side" in tg ? tg.side : "foes";
      const targets = tg === "self" ? [caster] : side === "foes" ? (ours ? theirs : every ? theirs : [mid()]) : every ? kin : [ours ? mid() : plain()];
      const damage = dealsDamage(ab);
      const blows = ab.do.filter((x) => x.op === "damage");
      const first = blows[0] as { hits?: number } | undefined;
      const more = blows.length > 1 ? theirs.filter((u) => !targets.includes(u)).slice(0, blows.length - 1) : [];
      act(caster.id, targets.map((u) => u.id), { act: s.id, kind: "ability", damage, hits: first?.hits ?? 1, more: more.map((u) => u.id) });
    } else if (s.kind === "basic") {
      if (s.from === "party") act(party()[0].id, [plain().id, boss().id], { act: "basic", kind: "basic", look: s.look, damage: true });
      else act(plain().id, [mid().id], { act: "basic", kind: "basic", look: s.look, damage: true });
    } else if (s.kind === "status") {
      for (const u of [mid(), boss()]) o.fx.previewStatus(u.id, s.id);
    } else {
      const on = s.on === "party" ? [mid()] : s.on === "foe" ? [plain(), boss()] : [mid(), boss()];
      for (const u of on) o.fx.previewFx(u.id, s.fx, e.key, s.mark);
    }
  }
  /** Each frame: once the field is quiet for a moment, the look plays again. */
  function tick() {
    if (o.scene.fx.length || o.fx.waiting) return void (idle = null);
    if (idle === null) idle = o.now();
    else if (o.now() - idle >= REST / setup.settings.fxSpeed) (idle = null), play();
  }

  // ─── The panel ───
  const panel = win("tuner");
  function render() {
    const e = entry();
    const chosen = fxSize(e.key) ?? 0;
    const list = inGroup();
    panel.replaceChildren(
      h("div", { class: "btns" }, button("◀", () => { group = (group + groups.length - 1) % groups.length; at = 0; render(); play(); }),
        h("span", { class: "grow center" }, groups[group]), button("▶", () => { group = (group + 1) % groups.length; at = 0; render(); play(); })),
      h("div", { class: "btns" }, button("◀", () => { at = (at + list.length - 1) % list.length; render(); play(); }),
        h("span", { class: "grow center wrap hi" }, e.label, h("span", { class: "dim" }, ` ${at + 1}/${list.length}`)),
        button("▶", () => { at = (at + 1) % list.length; render(); play(); })),
      h("div", { class: "btns even" }, ...SIZES.map((k) => button(k ? `${k}×` : "AUTO", () => { setFxSize(e.key, k); render(); play(); }, k === chosen ? "on" : ""))),
      h("div", { class: "btns even" },
        button(`FX SPEED ${Math.round(setup.settings.fxSpeed * 100)}%`, () => {
          const s = setup.settings;
          s.fxSpeed = FX_SPEEDS[(FX_SPEEDS.indexOf(s.fxSpeed as (typeof FX_SPEEDS)[number]) + 1) % FX_SPEEDS.length];
          o.scene.fxSpeed = s.fxSpeed;
          save();
          render();
        }),
        button("REPLAY", play)),
      h("div", { class: "btns even" },
        button(`EXPORT${fxSizeChanges() ? ` (${fxSizeChanges()})` : ""}`, () => download()),
        button("RESET", () => { resetFxSizes(); render(); play(); toast(o.frame, "BACK TO THE DEFAULTS"); })),
    );
  }
  function download() {
    const blob = new Blob([exportFxSizes()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = h("a", { href: url, download: "fx-sizes.json" }) as HTMLAnchorElement;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    toast(o.frame, "SIZES SAVED");
  }
  render();
  return { panel, tick, replay: play };
}
