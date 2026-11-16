/** The run's end: a Destiny Shard's offer after a lost fight, the run's summary, its record and a note beside it (SAVE RUN), and a won run's moment. */
import { rogue, type RogueRun, unlockable } from "../../../src/rogue.js";
import { button, type Child, h, header, nav, toast, win } from "../dom.js";
import { c, cls as classOf, shortName } from "../content.js";
import { section } from "../sheet.js";
import { current, endRun, meta } from "./state.js";
import { checkRecord, exportRecord, type RecordCheck } from "../../../src/rogue/record.js";
import { BUILD } from "../update.js";
import { type FolderKind, saveFiles } from "../folders.js";
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
    actions(button("DONE", () => { const r = endRun(choice ? leadPick ?? undefined : undefined); leadPick = null; go("rogue"); if (r.won) cheer(r.unlocked, r.heat); }, "hi"), button("SAVE RUN", () => savePrompt(run))),
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
/** A file name's start: the local date and hour, so saved runs sort in the order they were played. */
const stamp = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}h`;
/** The player's name for the run, as a file name: no characters a file system refuses, spaces as dashes. */
const fileSafe = (s: string) => s.trim().replace(/[\\/:*?"<>|\u0000-\u001f]+/g, "").replace(/\s+/g, "-").replace(/^[.-]+|[.-]+$/g, "").slice(0, 60);

/** SAVE RUN's prompt: a name and a note, then the run's record and the note saved under one name (`saveRun`). */
function savePrompt(run: RogueRun) {
  if (!frameEl) return;
  const won = run.pending.kind === "over" && run.pending.won;
  const name = h("input", { class: "field", type: "text", maxlength: 60, placeholder: won ? "WON" : "LOST", autocomplete: "off" }) as HTMLInputElement;
  const note = h("textarea", { class: "field", rows: 6, placeholder: "HOW IT FELT, WHAT STOOD OUT" }) as HTMLTextAreaElement;
  const close = () => { box.remove(); nav.overlay = null; };
  const box = h("div", { class: "overlay dialog" }, win("",
    h("div", { class: "line hi" }, "SAVE RUN"),
    h("div", { class: "line small dim" }, "NAME"), name,
    h("div", { class: "line small dim" }, "NOTE"), note,
    h("div", { class: "btns", style: "margin-top:.75rem" }, button("SAVE", () => { close(); saveRun(run, name.value.trim() || (won ? "won" : "lost"), note.value.trim()); }, "hi"), button("CANCEL", close)),
  ));
  frameEl.append(box);
  nav.overlay = close;
  name.focus();
}

/** The note's file: what the run was, in a line, then the player's words. */
function noteText(run: RogueRun, name: string, at: Date, text: string) {
  const won = run.pending.kind === "over" && run.pending.won;
  const party = run.party.map((id) => classOf(id).name).join(", ");
  return `# ${name}\n\n${at.toLocaleString()} · ${won ? "won" : `lost in act ${run.act}, floor ${run.floor}`} · heat ${run.heat} · ${party} · build ${BUILD}\n\n${text}\n`;
}

/**
 * The run's record (every choice, what was offered, the party before every fight), for balancing, and the note beside it:
 * one name for both, the date and hour first, the record into the runs folder and the note into the notes folder picked
 * in Settings (designer view), or downloaded where there's no folder. An empty note saves no note.
 */
function saveRun(run: RogueRun, name: string, text: string) {
  const at = new Date();
  const base = `${stamp(at)}-${fileSafe(name) || "run"}`;
  const files: { kind: FolderKind; ext: string; blob: Blob }[] = [{ kind: "runs", ext: ".json", blob: new Blob([exportRecord(c, run, BUILD, recordCheck(run) ?? undefined)], { type: "application/json" }) }];
  if (text) files.push({ kind: "notes", ext: ".md", blob: new Blob([noteText(run, name, at, text)], { type: "text/markdown" }) });
  void saveFiles(base, files).then(({ name: used, where }) => {
    if (!frameEl) return;
    const to = where.every((w) => w === null) ? "DOWNLOADED" : where.every((w) => w !== null) ? "SAVED" : "SAVED (PART DOWNLOADED)";
    toast(frameEl, `${text ? "RUN AND NOTE" : "RUN"} ${to}: ${used.toUpperCase()}`, 2600);
  });
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
