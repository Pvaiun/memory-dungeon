/**
 * The narrator: turns the engine's log into beats, the way Pokémon and Dragon
 * Quest tell a fight. A beat is one thing the player reads as a whole: an
 * action and what it did, a status ticking, a knockout. Each beat is a few
 * short lines of plain English ("PYRO CASTS FIREBOLT!", "BANDIT A TAKES 18 AND
 * BURNS (7).") and holds the clock while it's on screen. The battle screen
 * decides how long from the beat's weight.
 */
import type { CUnit } from "../../../src/engine/combat/fight.js";
import { weaponOf } from "../../../src/engine/combat/fight.js";
import { c, disp } from "../content.js";
import { abilityTag, weaponInfo } from "../describe.js";
import { ELEMENTS, enemyDisplayName } from "../art.js";
import type { Ev } from "./driver.js";

export type Tone = "act" | "hit" | "crit" | "heal" | "buff" | "debuff" | "bad" | "good" | "sys" | "quiet";
export type Line = { text: string; tone: Tone; tag?: string; events: Ev[] };
export type BeatKind = "intro" | "cast" | "act" | "tick" | "misc" | "end";
/** `weight` is reading time in units of one plain line; `actor` is who acts, for the field. */
export type Beat = { at: number; kind: BeatKind; lines: Line[]; actor?: string; weight: number };

export type Lookup = { unit: (id: string) => CUnit | undefined; name: (id: string) => string };

const MAX_LINES = 5;
const BITERS = new Set(["wolf", "snow_wolf", "snake", "bat", "hellhound", "leech"]);

export class Narrator {
  private open: Beat | null = null;
  private done: Beat[] = [];
  constructor(private L: Lookup) {}

  /** The beats finished so far, oldest first. */
  take(): Beat[] {
    const out = this.done;
    this.done = [];
    return out;
  }
  /** Closes the open beat; call when the engine has nothing more to say at this moment. */
  flush() {
    if (this.open && this.open.lines.length) this.done.push(this.open);
    this.open = null;
  }

  private start(kind: BeatKind, at: number, actor?: string): Beat {
    this.flush();
    return (this.open = { at, kind, lines: [], actor, weight: 0 });
  }
  /** Adds a line to the open beat if it's at the same moment, else to a new beat of `kind`. */
  private add(ev: Ev, line: Omit<Line, "events">, kind: BeatKind = "misc") {
    const at = (ev.at as number | undefined) ?? 0;
    let b = this.open;
    if (b && b.at === at && b.lines.length >= MAX_LINES) b = this.start(b.kind, at, b.actor);
    else if (!b || b.at !== at) b = this.start(kind, at);
    b.lines.push({ ...line, events: [ev] });
    b.weight += line.tone === "quiet" ? 0.4 : 1;
  }
  private n(id: unknown): string {
    return this.L.name(String(id));
  }
  private sname(id: string): string {
    return c.statuses.get(id)?.name ?? id;
  }
  /** What a unit's action is, for its icon: the ability's element or kind, or its weapon's. */
  tagOf(by: string, act: string): string {
    if (act !== "basic") {
      const ab = c.abilities.get(act);
      return ab ? abilityTag(ab) : "physical";
    }
    const u = this.L.unit(by);
    if (!u) return "physical";
    if (u.side === "enemy" && BITERS.has(u.ref)) return "bite";
    return weaponInfo(weaponOf(c, u.weapon), null).tag;
  }

  push(ev: Ev) {
    const at = (ev.at as number | undefined) ?? 0;
    switch (ev.t) {
      case "fight_start": {
        const b = this.start("intro", at);
        b.lines.push({ text: this.introText(ev), tone: "sys", events: [ev] });
        b.weight = 1.6;
        this.flush();
        break;
      }
      case "cast": {
        const what = ev.act === "basic" ? "winds up a blow" : `readies ${String(ev.name)}`;
        const line: Omit<Line, "events"> = { text: `${this.n(ev.by)} ${what}…`, tone: "act", tag: this.tagOf(String(ev.by), String(ev.act)) };
        const b = this.open;
        if (b && b.kind === "cast" && b.at === at && b.lines.length < 3) {
          b.lines.push({ ...line, events: [ev] });
          b.weight += 0.6;
        } else {
          const nb = this.start("cast", at, String(ev.by));
          nb.lines.push({ ...line, events: [ev] });
          nb.weight = 0.6;
        }
        break;
      }
      case "act": {
        const b = this.start("act", at, String(ev.by));
        b.lines.push({ text: this.actText(ev), tone: "act", tag: this.tagOf(String(ev.by), String(ev.act)), events: [ev] });
        b.weight += 1;
        break;
      }
      case "fail":
        this.add(ev, { text: `${this.n(ev.by)}'s ${String(ev.name)} fizzles: ${ev.why === "mp" ? "no MP" : "no target"}.`, tone: "sys" });
        break;
      case "dmg":
        this.damage(ev);
        break;
      case "heal":
        this.heal(ev);
        break;
      case "status":
        this.status(ev);
        break;
      case "status_end":
        this.statusEnd(ev);
        break;
      case "immune":
        this.add(ev, { text: `${this.n(ev.unit)} is immune to ${String(ev.name)}.`, tone: "sys" });
        break;
      case "interrupt":
        this.add(ev, { text: `${this.n(ev.unit)}'s ${String(ev.name)} is interrupted!`, tone: "bad" });
        break;
      case "down": {
        const party = this.L.unit(String(ev.unit))?.side === "party";
        this.add(ev, { text: party ? `${this.n(ev.unit)} is knocked out!` : `${this.n(ev.unit)} is defeated!`, tone: party ? "bad" : "good" });
        break;
      }
      case "revive":
        this.add(ev, { text: `${this.n(ev.unit)} is back up with ${disp(ev.hp as number)} HP!`, tone: "good" });
        break;
      case "join": {
        const u = ev.unit as { id: string };
        this.add(ev, { text: `${article(this.n(u.id))} joins the fight!`, tone: "sys" });
        break;
      }
      case "leave":
        this.add(ev, { text: `${this.n(ev.unit)} splits in two!`, tone: "sys" });
        break;
      case "strike":
        this.add(ev, { text: ev.status === "arc" ? `The arc jumps to ${this.n(ev.target)}!` : `${this.n(ev.by)} strikes again!`, tone: "act" }, "act");
        break;
      case "stop":
        this.add(ev, { text: `The fight stops: ${String(ev.why)}.`, tone: "sys" });
        break;
      case "fight_end": {
        const b = this.start("end", at);
        const won = ev.result === "won";
        b.lines.push({ text: won ? "Victory!" : "The party is defeated…", tone: won ? "good" : "bad", events: [ev] });
        b.weight = 1.2;
        this.flush();
        break;
      }
      default:
        break;
    }
  }

  private actText(ev: Ev): string {
    const by = String(ev.by), name = this.n(by);
    if (ev.kind === "basic") return `${name} attacks!`;
    const ab = c.abilities.get(String(ev.act));
    const tag = ab ? abilityTag(ab) : "physical";
    const verb = ELEMENTS.includes(tag) ? "casts" : "uses";
    const targets = ev.targets as string[];
    const first = ab?.do[0];
    const on = targets.length === 1 && targets[0] !== by && first && first.op !== "damage" ? ` on ${this.n(targets[0])}` : "";
    return `${name} ${verb} ${ab?.name ?? String(ev.name)}${on}!`;
  }

  private damage(ev: Ev) {
    const t = this.n(ev.target), word = ev.word as string | null, part = ev.part as string, src = String(ev.src);
    const isStatus = part === "pulse" || part === "reaction";
    const kind: BeatKind = part === "pulse" ? "tick" : "act";
    if (word === "MISS") return this.add(ev, { text: `${t} dodges!`, tone: "hit" }, kind);
    if (word === "AEGIS") return this.add(ev, { text: `${t}'s Aegis blocks the blow!`, tone: "buff" }, kind);
    if (word === "IMMUNE") return this.add(ev, { text: `${t} is immune.`, tone: "sys" }, kind);
    if (word === "BLOCKED") return this.add(ev, { text: `${t} blocks it.`, tone: "hit" }, kind);
    const n = disp(ev.amount as number), s = disp((ev.soaked as number) || 0);
    if (isStatus && n + s <= 0) return;
    const crit = !!ev.crit;
    let text: string;
    if (isStatus) text = this.tickText(t, src, n + s);
    else if (n <= 0 && s > 0) text = `${t}'s Shield soaks ${s}.`;
    else {
      const soak = s > 0 ? ` Shield soaks ${s}.` : "";
      if (word === "RESIST") text = `${t} resists: takes ${n}.${soak}`;
      else text = `${crit ? "Critical! " : ""}${t} takes ${n}${crit ? "!" : "."}${word === "WEAK" ? " Weak!" : ""}${soak}`;
    }
    this.add(ev, { text, tone: crit ? "crit" : isStatus ? "debuff" : "hit" }, kind);
  }
  private tickText(t: string, src: string, n: number): string {
    switch (src) {
      case "poison": return `${t} takes ${n} from Poison.`;
      case "burn": return `${t} burns for ${n}.`;
      case "shock": return `${t} is shocked for ${n}.`;
      case "thorns": return `${t} takes ${n} from Thorns.`;
      case "doom": return `Doom strikes ${t} for ${n}!`;
      case "volatile": return `${t} takes ${n} from the blast!`;
      default: return `${t} takes ${n} from ${this.sname(src)}.`;
    }
  }

  private heal(ev: Ev) {
    const t = this.n(ev.target), src = String(ev.src), n = disp(ev.amount as number);
    const isStatus = c.statuses.has(src);
    if (ev.word === "ABSORB") return this.add(ev, { text: `${t} absorbs it and heals ${n}!`, tone: "heal" }, "act");
    if (isStatus && n <= 0) return;
    let text: string;
    if (src === "regen") text = `${t} regenerates ${n}.`;
    else if (src === "lifesteal") text = `${t} drains ${n}.`;
    else if (src === "mercy") text = `Mercy heals ${t} for ${n}.`;
    else if (isStatus) text = `${t} recovers ${n} from ${this.sname(src)}.`;
    else text = `${ev.crit ? "Critical! " : ""}${t} recovers ${n}.`;
    this.add(ev, { text, tone: "heal" }, src === "regen" ? "tick" : "act");
  }

  private status(ev: Ev) {
    const d = c.statuses.get(String(ev.status));
    if (!d || d.show !== "icon") return;
    const unit = String(ev.unit), t = this.n(unit);
    const total = ev.total as number | null;
    const n = total === null ? null : d.id === "shield" ? disp(Math.floor(total)) : Math.round(total);
    const phrase = gainPhrase(d.id, n, d.name);
    const tone: Tone = d.label === "buff" ? "buff" : "debuff";
    // Folds into the target's hit in the same beat: "BANDIT A TAKES 18 AND BURNS (7)."
    const b = this.open;
    const last = b?.lines[b.lines.length - 1];
    if (b && last && b.at === ev.at && last.tone !== "act" && !last.text.includes(" and ") && last.text.length + phrase.length < 44 && last.events.some((e) => e.t === "dmg" && e.target === unit && e.word !== "MISS" && e.part !== "pulse")) {
      last.text = `${last.text.replace(/[.!]$/, "")} and ${phrase}${/!$/.test(phrase) ? "" : "."}`;
      last.events.push(ev);
      return;
    }
    this.add(ev, { text: `${t} ${phrase}${/!$/.test(phrase) ? "" : "."}`, tone });
  }

  private statusEnd(ev: Ev) {
    const d = c.statuses.get(String(ev.status));
    if (!d || d.show !== "icon") return;
    const cause = String(ev.cause);
    if (cause === "ko" || cause === "fight_end") return;
    const what = cause === "removed" ? (d.label === "buff" ? "is dispelled" : "is cleansed") : cause === "spent" ? "is spent" : cause === "stacks" ? (d.id === "shield" ? "breaks" : "fades") : "wears off";
    this.add(ev, { text: `${this.n(ev.unit)}'s ${this.sname(d.id)} ${what}.`, tone: "quiet" });
  }

  private introText(ev: Ev): string {
    const units = (ev.units as { id: string; side: string }[]).filter((u) => u.side === "enemy");
    const counts = new Map<string, number>();
    for (const u of units) {
      const ref = this.L.unit(u.id)?.ref ?? u.id;
      counts.set(ref, (counts.get(ref) ?? 0) + 1);
    }
    const parts = [...counts].map(([ref, n]) => {
      const nm = enemyDisplayName(ref);
      return c.enemies.get(ref)?.rank === "boss" ? `the ${nm}` : n === 1 ? article(nm) : `${n} ${plural(nm)}`;
    });
    const list = parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
    return `${list} draw${units.length === 1 ? "s" : ""} near!`;
  }
}

/** How gaining a status reads, after the unit's name; no final stop unless it's an exclamation. */
export function gainPhrase(id: string, n: number | null, name: string): string {
  const N = n !== null ? ` (${n})` : "";
  switch (id) {
    case "poison": return "is poisoned";
    case "regen": return "gains Regen";
    case "shield": return `is shielded${N}`;
    case "might": return `gains Might${N}`;
    case "weaken": return "is weakened";
    case "guard": return "is guarded";
    case "stun": return "is stunned!";
    case "slow": return "is slowed";
    case "haste": return "is hastened";
    case "taunt": return "taunts the foes!";
    case "burn": return `burns${N}`;
    case "chill": return `is chilled${N}`;
    case "shock": return `is shocked${N}`;
    case "ward": return "is warded";
    case "sunder": return `is sundered${N}`;
    case "silence": return "is silenced!";
    case "hidden": return "vanishes!";
    case "rot": return "rots";
    case "clarity": return "gains Clarity";
    case "aegis": return "gains Aegis";
    case "doom": return "is doomed!";
    case "bulwark": return `raises its Bulwark${N}`;
    case "bulwark_broken": return "is broken open!";
    case "ice_crust": return `thickens its ice${N}`;
    case "shadow_strike_on": return "strikes from the shadows";
    case "bloodlust_on": return "is in bloodlust!";
    case "bedrock_on": return "stands on bedrock";
    default: return `gains ${name}${N}`;
  }
}

export const article = (name: string) => `${/^[aeiou]/i.test(name) ? "An" : "A"} ${name}`;
export function plural(name: string): string {
  if (/wolf$/i.test(name)) return name.replace(/wolf$/i, "wolves");
  if (/(ch|sh|s|x|z)$/i.test(name)) return `${name}es`;
  if (/[^aeiou]y$/i.test(name)) return `${name.slice(0, -1)}ies`;
  return `${name}s`;
}
