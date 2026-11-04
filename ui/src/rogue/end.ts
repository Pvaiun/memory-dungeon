/** The run's end: its summary, its record (SAVE RUN), and a won run's moment. */
import { rogue, type RogueRun } from "../../../src/rogue.js";
import { button, type Child, h, header, toast, win } from "../dom.js";
import { c, cls as classOf, shortName } from "../content.js";
import { section } from "../sheet.js";
import { current, endRun, meta } from "./state.js";
import { checkRecord, exportRecord, type RecordCheck } from "../../../src/rogue/record.js";
import { BUILD } from "../update.js";
import { actorEl, faceEl } from "../pixel.js";
import { sfx } from "../battle/audio.js";
import { actions, frameEl, go, partyActors, redraw, ROMAN, scene } from "./parts.js";

// ─── The end ───────────────────────────────────────────────────────────────

export function overView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "over") return [];
  const won = p.won;
  return [
    header(won ? "VICTORY" : "THE RUN ENDS", null),
    scene(run, "over", { h: 112, night: !won, actors: partyActors(run, 112, won ? "victory" : "dead", { cx: 135 }) }),
    win("", h("div", { class: `line ${won ? "good" : "bad"}` }, won ? "ALL THREE ACTS CLEARED" : `FELL IN ACT ${ROMAN[run.act]}, FLOOR ${run.floor}`),
      h("div", { class: "line small dim wrap" }, `${run.stats.fights} FIGHTS · ${run.stats.elites} ELITES · ${run.stats.gold}G EARNED`),
      won ? h("div", { class: "line small hi wrap" }, `${run.party.map(shortName).join(", ")} CAN NOW LEAD A RUN`) : null),
    win("scroll", section("THE ROAD"), ...run.notes.map((n) => h("div", { class: "text small wrap" }, h("span", { class: "dim" }, `${ROMAN[n.act]}.${n.floor} `), n.text))),
    recordLine(run),
    actions(button("DONE", () => { const r = endRun(); go("rogue"); if (r.won) cheer(r.unlocked, r.heat); }, "hi"), button("SAVE RUN", () => saveRunFile(run))),
  ];
}
/** The record's check (a replay of the whole run from its record), once per finished run: it takes a moment, so it runs after the screen is drawn. */
let checked: { key: string; check: RecordCheck | null } | null = null;
const checkKey = (run: RogueRun) => `${run.seed}:${(run as { record?: unknown[] }).record?.length ?? 0}`;
function recordCheck(run: RogueRun): RecordCheck | null {
  const key = checkKey(run);
  if (checked?.key !== key) {
    checked = { key, check: null };
    setTimeout(() => { if (checked?.key !== key) return; checked.check = checkRecord(c, run); if (current() === run && run.pending.kind === "over") redraw(); }, 50);
  }
  return checked.check;
}
function recordLine(run: RogueRun) {
  const ch = recordCheck(run);
  const tone = !ch ? "dim" : ch.verdict === "good" ? "good" : ch.verdict === "partial" ? "hi" : "bad";
  return win("", h("div", { class: `line small wrap ${tone}` }, ch ? ch.text : "CHECKING THE RECORD…"),
    ch && ch.builds.length > 1 ? h("div", { class: "line small dim wrap" }, `PLAYED ACROSS ${ch.builds.length} BUILDS`) : null,
    ch && ch.reloads ? h("div", { class: "line small dim wrap" }, `${ch.reloads} FIGHT${ch.reloads > 1 ? "S" : ""} RESTARTED AFTER A RELOAD (COUNTED ONCE)`) : null);
}
/** The run's record (every choice, what was offered, the party before every fight) downloaded as a file, for balancing. */
function saveRunFile(run: RogueRun) {
  const blob = new Blob([exportRecord(c, run, BUILD, recordCheck(run) ?? undefined)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = h("a", { href: url, download: `rogue-run-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")}-${run.pending.kind === "over" && run.pending.won ? "won" : "lost"}.json` }) as HTMLAnchorElement;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  if (frameEl) toast(frameEl, "RUN SAVED");
}

/** A won run's moment: one card for the win, then one per class that can now lead, then the heat opened. A tap goes on. */
function cheer(unlocked: string[], heat: boolean) {
  if (!frameEl) return;
  const cards: Child[][] = [[h("div", { class: "cele-top" }, "VICTORY!")]];
  for (const id of unlocked) cards.push([h("div", { class: "cele-top" }, "NEW LEADER!"), h("div", { class: "cele-art" }, faceEl(id, 2), actorEl(id, "victory", 2)), h("div", { class: "cele-name" }, classOf(id).name)]);
  if (heat) cards.push([h("div", { class: "cele-top" }, "HEAT RISES"), h("div", { class: "cele-name" }, `HEAT ${meta().maxHeat}`), h("div", { class: "line center-line dim" }, `FOES +${meta().maxHeat * rogue(c).config.heat.per}%`)]);
  let at = 0;
  const overlay = h("div", { class: "overlay cele" });
  const show = () => {
    overlay.replaceChildren(win("cele-card", ...cards[at], h("div", { class: "line cele-foot" }, h("span", { class: "dim grow" }, `${at + 1}/${cards.length}`), h("span", { class: "hi blink" }, "▼"))));
    sfx.win();
  };
  overlay.addEventListener("click", () => { at++; if (at >= cards.length) overlay.remove(); else show(); });
  frameEl.append(overlay);
  show();
}
