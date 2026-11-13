/**
 * The fight's recap, opened from the summary at a fight's end: did the plan work? Each party member's damage dealt, taken
 * and healed as bars on one scale, with a tap opening what it did (each action's uses and output, an ability never used
 * among them, and the statuses it laid); then what each status did, the party's and the foes'. Every bar on the screen
 * has one width and one scale, so a Burn can be read against a unit's hits. The numbers are tally.ts's.
 */
import type { CUnit } from "../../../src/engine/combat/fight.js";
import { c, className, disp } from "../content.js";
import { statusStyle } from "../art.js";
import { h, type Child } from "../dom.js";
import { abilityIconOf, actionIconEl, canvasEl, gearIconEl, statusEl } from "../pixel.js";
import { portraitEl } from "../sheet.js";
import type { Side, Source, StatusTally, Tally, UnitTally } from "./tally.js";

export type RecapArgs = {
  tally: Tally;
  /** The party's units, in their seats' order. */
  party: CUnit[];
  /** An action's icon tag (Narrator.tagOf). */
  tagOf: (by: string, act: string) => string;
};

const EMPTY: UnitTally = { dealt: 0, taken: 0, healed: 0, down: null, by: new Map(), laid: new Map() };
type Row = { id: string; what: keyof StatusTally; n: number };

export function recapBody(a: RecapArgs): HTMLElement {
  const of = (u: CUnit) => a.tally.units.get(u.id) ?? EMPTY;
  const rows = (side: Side): Row[] =>
    [...a.tally.served[side]].flatMap(([id, s]) => (["dmg", "heal", "soak"] as const).filter((k) => disp(s[k]) > 0).map((what) => ({ id, what, n: s[what] })))
      .sort((x, y) => y.n - x.n);
  const yours = rows("party"), theirs = rows("enemy");
  // One scale for every bar: the largest number on the screen fills its bar.
  const top = Math.max(1, ...a.party.flatMap((u) => [of(u).dealt, of(u).taken, of(u).healed]), ...[...yours, ...theirs].map((r) => r.n));
  const meter = (n: number, color: string) => {
    const fill = h("i", { style: `width:${Math.min(100, (n / top) * 100)}%;background:${color}` });
    return h("div", { class: "bar rc" }, fill);
  };

  const body = h("div", { class: "recap" });
  body.append(h("div", { class: "section" }, "THE PARTY", h("span", { class: "r" }, "TAP FOR MORE")));
  for (const u of a.party) body.append(unitBlock(u, of(u)));

  body.append(h("div", { class: "section" }, "YOUR STATUSES"));
  if (!yours.length) body.append(h("div", { class: "line dim" }, "NONE"));
  for (const r of yours) body.append(statusRow(r));
  if (theirs.length) {
    body.append(h("div", { class: "section" }, "FOES' STATUSES"));
    for (const r of theirs) body.append(statusRow(r));
  }
  return body;

  function unitBlock(u: CUnit, t: UnitTally): HTMLElement {
    const fallen = t.down !== null || u.ko;
    const state = t.down !== null ? h("span", { class: "bad" }, `DOWN T${t.down}`) : u.ko ? h("span", { class: "bad" }, "KO") : h("span", { class: "dim" }, "HP ", h("span", { class: "ink" }, `${disp(u.hp)}`));
    const chev = h("span", { class: "hi" }, "▶");
    const line = (label: string, n: number, color: string, cls = "") =>
      h("div", { class: "rc-meter" }, h("span", { class: "lbl" }, label), meter(n, color), h("span", { class: `val ${n > 0 ? cls : "dim"}` }, `${disp(n)}`));
    const more = h("div", { class: "rc-more" });
    more.style.display = "none";
    const block = h("div", { class: `rc-unit${fallen ? " ko" : ""}` },
      h("div", { class: "portrait" }, portraitEl(u.ref)),
      h("div", { class: "rc-body" },
        h("div", { class: "line" }, chev, h("span", { class: "grow trunc" }, className(u.ref)), state),
        line("DEALT", t.dealt, "var(--phys)"),
        line("TAKEN", t.taken, "var(--bad)", "bad"),
        line("HEALED", t.healed, "var(--good)", "good"),
      ),
      more,
    );
    block.addEventListener("click", () => {
      const open = more.style.display === "none";
      if (open && !more.childElementCount) fillMore(more, u, t);
      more.style.display = open ? "" : "none";
      chev.textContent = open ? "▼" : "▶";
      block.classList.toggle("open", open);
    });
    return block;
  }

  /** What one unit did: its abilities in its order, then its basic attack, then whatever else of its kit did something. */
  function fillMore(el: HTMLElement, u: CUnit, t: UnitTally) {
    const acts = u.acts.map((x) => x.id);
    const rest = [...t.by.keys()].filter((id) => !acts.includes(id)).sort((x, y) => out(t.by.get(y)!) - out(t.by.get(x)!));
    for (const id of [...acts, ...rest]) {
      const s = t.by.get(id) ?? { uses: 0, dmg: 0, heal: 0 };
      const act = acts.includes(id);
      if (!act && !out(s)) continue;
      const never = act && s.uses === 0;
      const nums: Child[] = never ? [h("span", { class: "dim" }, "NOT USED")] : [
        disp(s.dmg) > 0 ? h("span", null, `${disp(s.dmg)}`) : null,
        disp(s.heal) > 0 ? h("span", { class: "good" }, `+${disp(s.heal)}`) : null,
      ];
      if (!never && !nums.some(Boolean)) nums.push(h("span", { class: "dim" }, "—"));
      el.append(h("div", { class: `rc-src${never ? " dimmed" : ""}` },
        h("span", { class: "ic" }, act ? actionIconEl(a.tagOf(u.id, id), id) : sourceIcon(id)),
        h("span", { class: "grow trunc" }, sourceName(id)),
        s.uses > 0 ? h("span", { class: "dim" }, `×${s.uses}`) : null,
        h("span", { class: "nums" }, ...nums),
      ));
    }
    const laid = [...t.laid].sort((x, y) => y[1] - x[1]);
    if (laid.length) {
      el.append(h("div", { class: "rc-laid" }, h("span", { class: "dim" }, "LAID"), ...laid.map(([id, n]) =>
        h("span", { class: "wcode" }, statusEl(id), `${c.statuses.get(id)?.absorb ? disp(n) : Math.max(1, Math.round(n))}`))));
    }
  }

  function statusRow(r: Row): HTMLElement {
    const color = statusStyle(r.id).color;
    const val = r.what === "heal" ? h("span", { class: "good" }, `+${disp(r.n)}`) : r.what === "soak" ? h("span", { class: "sh" }, `${disp(r.n)}`) : h("span", null, `${disp(r.n)}`);
    return h("div", { class: "rc-meter st" },
      h("span", { class: "lbl" }, statusEl(r.id), h("span", { class: "trunc" }, c.statuses.get(r.id)?.name ?? r.id)),
      meter(r.n, color),
      h("span", { class: "val" }, val),
    );
  }
}

const out = (s: Source) => s.dmg + s.heal;

/** A source's name: an action, a piece, or a status (a passive's, a version's or a piece's working goes by its own name). */
function sourceName(id: string): string {
  if (id === "basic") return "ATTACK";
  return (c.abilities.get(id)?.name ?? c.gear.get(id)?.name ?? c.statuses.get(id)?.name ?? id).toUpperCase();
}

/** A source's icon: a piece's own, an ability's or a passive's (a trained form's is its base's), else its status tile. */
function sourceIcon(id: string): HTMLElement {
  const g = c.gear.get(id);
  if (g) return gearIconEl(g);
  const ab = abilityIconOf(id);
  if (ab) return canvasEl(ab, 16 / ab.width, "icon");
  return statusEl(id);
}
