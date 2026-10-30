/**
 * The moment a journey node is cleared: windows over the screen, one at a
 * time, each popping in with a few twinkling stars. CLEARED! with the party
 * cheering; one card per thing unlocked (a class with its face and figure, a
 * formation with its slots, the gear with its sprites and who can wear it),
 * then the next node, or the journey's end.
 * A tap goes on; the phone's back button or Escape skips to the last card,
 * and closes it there.
 */
import { ownedAt, rewardsOf } from "../../src/campaign.js";
import { canEquip } from "../../src/validate.js";
import { c, shortName } from "./content.js";
import { button, h, nav, win, type Child } from "./dom.js";
import { actorEl, faceEl } from "./pixel.js";
import { formationNote, gearRow, RARITY_TONE, role, seatCodes, seatNotes } from "./sheet.js";
import { gearFor, setup } from "./state.js";
import { nodes } from "./journey.js";
import { sfx } from "./battle/audio.js";
import { go } from "./screens.js";

type Card = { top: string; body: Child[]; where?: string; sound?: () => void; last?: boolean };

const KIND_WORD: Record<string, string> = { dungeon: "RUN", remix: "REMIX", trial: "TRIAL" };
/** Where the stars sit around the window, as % of the frame: x, y, delay (ms). */
const STARS: [number, number, number][] = [[8, 12, 0], [88, 9, 300], [18, 30, 650], [80, 26, 150], [6, 58, 500], [92, 52, 800], [14, 84, 250], [84, 88, 600], [50, 6, 450], [46, 93, 100], [70, 15, 700], [28, 90, 350]];

/** The cards for clearing node `i`, in order. */
function cards(i: number): Card[] {
  const ns = nodes();
  const n = ns[i];
  const r = rewardsOf(c, i);
  const have = ownedAt(c, i + 1);
  const out: Card[] = [];
  out.push({
    top: "CLEARED!",
    sound: sfx.win,
    body: [
      h("div", { class: "cele-art" }, ...setup.party.map((id) => actorEl(id, "victory", 1, gearFor(id).weapon))),
      h("div", { class: "cele-name" }, `${i + 1} ${n.name}`),
      h("div", { class: "text dim small wrap center" }, n.text),
    ],
  });
  for (const id of r.classes) {
    const k = c.classes.get(id);
    if (!k) continue;
    out.push({
      top: "NEW CLASS!",
      body: [
        h("div", { class: "cele-art" }, faceEl(id, 2), actorEl(id, "wait", 2, gearFor(id).weapon)),
        h("div", { class: "cele-name" }, k.name),
        h("div", { class: "text dim small wrap center" }, role(id)),
      ],
    });
  }
  for (const id of r.formations) {
    const f = c.formations.get(id);
    if (!f) continue;
    out.push({
      top: "NEW FORMATION!",
      body: [
        // Step 5i: in its rarity's colour, with what its seats' own statuses do.
        h("div", { class: `cele-name ${RARITY_TONE[f.rarity ?? "common"]}` }, f.name),
        h("div", { class: "text dim small wrap center" }, f.text, formationNote(f), seatNotes(f) ? ` ${seatNotes(f)}` : ""),
        h("div", { class: "cele-slots" }, ...f.positions.map((pos, j) => h("div", { class: "slotline" }, h("span", { class: "dim" }, `${j + 1} ${pos.name}`), h("span", { class: "codes" }, ...seatCodes(pos))))),
      ],
    });
  }
  // Gear, four pieces to a card: its sprite or icon, name and codes, and which of the classes owned can wear it.
  const gear = r.gear.map((id) => c.gear.get(id)).filter((g) => !!g);
  for (let k = 0; k < gear.length; k += 4) {
    const chunk = gear.slice(k, k + 4);
    out.push({
      top: gear.length > 4 ? `NEW GEAR! ${k / 4 + 1}/${Math.ceil(gear.length / 4)}` : "NEW GEAR!",
      body: [h("div", { class: "cele-gear" }, ...chunk.map((g) => {
        const who = have.classes.filter((cls) => { const def = c.classes.get(cls); return !!def && canEquip(def, g); });
        return h("div", null,
          gearRow(g, g.slot, null, undefined, false),
          h("div", { class: "line small wrap who dim" }, who.length === have.classes.length ? "ANY CLASS CAN USE IT" : who.length ? `FOR ${who.map(shortName).join(", ")}` : "NO CLASS YOU HAVE CAN USE IT YET"));
      }))],
    });
  }
  const next = ns[i + 1];
  out.push({
    top: next ? "A NEW PATH OPENS" : "THE JOURNEY IS COMPLETE",
    last: true,
    body: next
      ? [h("div", { class: "cele-name" }, `${i + 2} ${next.name}`), h("div", { class: "line center-line dim small" }, KIND_WORD[next.kind] ?? next.kind.toUpperCase()), h("div", { class: "text dim small wrap center" }, next.text)]
      : [],
  });
  return out;
}

/** Plays the celebration for clearing node `i` over the frame. */
export function celebrate(frame: HTMLElement, i: number) {
  if (!nodes()[i]) return;
  const list = cards(i);
  let at = -1;
  const stars = STARS.map(([x, y, d], k) => h("span", { class: `star${k % 2 ? " big" : ""}`, style: `left:${x}%;top:${y}%;animation-delay:${d}ms` }, k % 3 ? "★" : "+"));
  const overlay = h("div", { class: "overlay cele" }, ...stars);
  const close = () => {
    overlay.remove();
    window.removeEventListener("keydown", onKey, true);
    if (nav.overlay === skip) nav.overlay = null;
  };
  const show = (k: number) => {
    at = k;
    const card = list[k];
    overlay.querySelector(".win")?.remove();
    const foot = card.last
      ? h("div", { class: "btns even", style: "margin-top:.75rem" }, button("JOURNEY", () => { close(); go("journey"); }, "hi"))
      : h("div", { class: "line cele-foot" }, h("span", { class: "dim grow" }, `${k + 1}/${list.length}`), h("span", { class: "hi blink" }, "▼"));
    overlay.append(win("cele-card", h("div", { class: "cele-top" }, card.top), ...card.body, card.where ? h("div", { class: "cele-where" }, card.where) : null, foot));
    (card.sound ?? (card.last ? sfx.tap : sfx.heal))();
  };
  const step = () => { if (at < list.length - 1) show(at + 1); };
  /** Back or Escape: to the last card, or off it. */
  const skip = () => { if (at < list.length - 1) show(list.length - 1); else close(); };
  const onKey = (e: KeyboardEvent) => {
    if (!overlay.isConnected) return close();
    if (e.key === "Escape") skip();
    else if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); e.stopImmediatePropagation(); step(); }
  };
  overlay.addEventListener("click", (e) => { if (!(e.target as HTMLElement).closest("button")) step(); });
  window.addEventListener("keydown", onKey, true);
  frame.append(overlay);
  nav.overlay = skip;
  show(0);
}
