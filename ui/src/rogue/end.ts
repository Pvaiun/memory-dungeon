/** The run's end: a Destiny Shard's offer after a lost fight, the run's summary, its record (SAVE RUN), and a won run's moment. */
import { rogue, type RogueRun, unlockable } from "../../../src/rogue.js";
import { button, type Child, h, header, toast, win } from "../dom.js";
import { c, cls as classOf, shortName } from "../content.js";
import { section } from "../sheet.js";
import { current, endRun, meta } from "./state.js";
import { checkRecord, exportRecord, type RecordCheck } from "../../../src/rogue/record.js";
import { BUILD } from "../update.js";
import { actorEl, faceEl, shardEl } from "../pixel.js";
import { sfx } from "../battle/audio.js";
import { actions, confirm, frameEl, go, partyActors, pickOrSave, redraw, ROMAN, scene } from "./parts.js";

// ─── A Destiny Shard ───────────────────────────────────────────────────────

/** A lost fight with a shard held: go back to the moment before the fight, at its preview, or end the run. */
export function fateView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "fate") return [];
  const n = run.shards ?? 0;
  return [
    header("THE PARTY FALLS", null),
    scene(run, "fate", { h: 112, night: true, actors: partyActors(run, 112, "dead", { cx: 135 }) }),
    win("", h("div", { class: "line bad wrap" }, `FELL TO ${p.fight.toUpperCase()}`),
      h("div", { class: "line gold" }, `${n} `, shardEl()),
      h("div", { class: "text small dim wrap" }, "A SHARD GLIMMERS, YEARNING TO TEMPT FATE.")),
    actions(button("USE A SHARD", () => { pickOrSave(run, "shard"); sfx.win(); if (frameEl) toast(frameEl, "UNWINDING FATE'S THREADS", 2000); }, "hi"),
      button("END THE RUN", () => confirm("END THE RUN?", `YOUR ${n} DESTINY SHARD${n === 1 ? "" : "S"} GO UNUSED.`, "END", () => pickOrSave(run, "end")))),
  ];
}

// ─── The end ───────────────────────────────────────────────────────────────

/** A won run's new leader: one of the party's three the player doesn't own yet, picked on the victory screen. */
let leadPick: string | null = null;
function leadChoice(run: RogueRun): Child {
  const open = unlockable(meta(), run);
  if (!open.length) return null;
  if (!leadPick || !open.includes(leadPick)) leadPick = open[0];
  return win("roster", h("div", { class: "line hi" }, "CHOOSE A NEW LEADER"),
    h("div", { class: "grid" }, ...run.party.map((id) => open.includes(id)
      ? h("div", { class: `cell${leadPick === id ? " cur" : ""}`, onClick: () => { leadPick = id; redraw(); } }, h("div", { class: "portrait" }, faceEl(id)), h("span", { class: "trunc", style: "max-width:100%" }, shortName(id)))
      : h("div", { class: "cell static dim" }, h("div", { class: "portrait" }, faceEl(id)), h("span", { class: "trunc", style: "max-width:100%" }, shortName(id)), h("span", { class: "small" }, "OWNED")))));
}

export function overView(run: RogueRun): Child[] {
  const p = run.pending;
  if (p.kind !== "over") return [];
  const won = p.won;
  const choice = won ? leadChoice(run) : null;
  return [
    header(won ? "VICTORY" : "THE RUN ENDS", null),
    scene(run, "over", { h: 112, night: !won, actors: partyActors(run, 112, won ? "victory" : "dead", { cx: 135 }) }),
    win("", h("div", { class: `line ${won ? "good" : "bad"}` }, won ? "ALL 3 ACTS CLEARED" : `FELL IN ACT ${ROMAN[run.act]}, FLOOR ${run.floor}`),
      h("div", { class: "line small dim wrap" }, `${run.stats.fights} FIGHTS · ${run.stats.elites} ELITES · ${run.stats.gold}G EARNED`),
      won && !choice ? h("div", { class: "line small dim wrap" }, "THE WHOLE PARTY CAN ALREADY LEAD A RUN") : null),
    choice,
    win("scroll", section("THE ROAD"), ...run.notes.map((n) => h("div", { class: "text small wrap" }, h("span", { class: "dim" }, `${ROMAN[n.act]}.${n.floor} `), n.text))),
    recordLine(run),
    actions(button("DONE", () => { const r = endRun(choice ? leadPick ?? undefined : undefined); leadPick = null; go("rogue"); if (r.won) cheer(r.unlocked, r.heat); }, "hi"), button("SAVE RUN", () => saveRunFile(run))),
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

/** A won run's moment: one card for the win, then the class picked to lead, then the heat opened. A tap goes on. */
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
