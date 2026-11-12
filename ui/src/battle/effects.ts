/**
 * The field's effects, and when they play. src/effects.ts picks what each action, status and event looks like; this
 * plays it on the scene in step with the story.
 *
 * - An action's look plays on its targets as it acts when it deals no damage. A blow's plays on each unit as each hit
 *   lands, from that hit's own event, so a chain's next foe and a scythe's random sweeps get theirs.
 * - Field events wait their turn while a missile flies or a blow follows the last (a second hit, a chain's next foe).
 *   Each hit's number, its statuses and a knockout then show as the blow lands, in the story's order.
 * - A status, heal or revive that lands with an action's effect lets that effect speak for it, unless its own look is
 *   the point (Stun, Silence, Doom: statusFx's `always`).
 */
import { c } from "../content.js";
import { dealsDamage, isSpell } from "../describe.js";
import { abilityFx, basicFx, downFx, EVENT_FX, joinFx, leaveFx, reactionFx, statusFx, themeFx, tickFx, type Fx, type Look } from "../effects.js";
import type { Driver, Ev } from "./driver.js";
import type { Scene } from "./scene.js";

/** The gap before a blow that follows another, in ms at 1×. */
const FOLLOW = 130;
/** How long after an action's effect plays on a unit a status or heal landing there lets it speak for them, in ms. */
const RECENT = 300;
/** What skipping ahead (>>) still shows of the events that were waiting: what changes the field. */
const KEPT = new Set(["down", "leave", "join", "revive", "fight_start", "fight_end"]);

type Acting = {
  by: string; at: unknown; look: Look | null;
  /** The units it was aimed at, the blows shown so far on each, when each one's missile lands, and an extra strike's status. */
  aimed: Set<string>; hits: Map<string, number>; lands: Map<string, number>; strike: string | null;
};

export class FieldFx {
  private acting: Acting | null = null;
  private lastFx = new Map<string, number>();
  /** Events waiting for a blow to land. `landed`: its wait is known, show it at `at`; else at once when it's first in line. */
  private held: { at: number; ev: Ev; landed: boolean }[] = [];

  /** `now` is the battle's clock; `pace` how much faster than 1× waits pass (they shrink with the speed, as the beats' holds do); `show` puts an event on the field. */
  constructor(private scene: Scene, private driver: Driver, private now: () => number, private pace: () => number, private show: (ev: Ev) => void) {}

  /** Events are waiting for a blow to land. */
  get waiting(): boolean {
    return this.held.length > 0;
  }
  /** An event onto the field: shown now, or held back behind a blow that hasn't landed. */
  field(ev: Ev) {
    if (this.held.length) return void this.held.push({ at: 0, ev, landed: false });
    const wait = this.blowWait(ev);
    if (wait > 0) this.held.push({ at: this.now() + wait, ev, landed: true });
    else this.show(ev);
  }
  /** Shows what has waited long enough; call each frame the fight runs. */
  release() {
    while (this.held.length && this.held[0].at <= this.now()) {
      const x = this.held.shift()!;
      const wait = x.landed ? 0 : this.blowWait(x.ev);
      if (wait > 0) {
        this.held.unshift({ at: this.now() + wait, ev: x.ev, landed: true });
        break;
      }
      this.show(x.ev);
    }
  }
  /** Throws away what's waiting (>> and the fight's end), keeping what changes the field. */
  drop() {
    for (const x of this.held.splice(0)) if (KEPT.has(x.ev.t)) this.show(x.ev);
    this.acting = null;
  }

  // ─── What each event plays ───

  /** A wind-up starts: a circle under a spellcaster's feet (a weapon skill's wind-up has none). */
  cast(unit: string, act: string) {
    const v = this.scene.units.get(unit);
    const ab = c.abilities.get(act);
    if (v && (!ab || isSpell(ab) || !dealsDamage(ab))) this.scene.play(unit, v.side === "party" ? EVENT_FX.cast : EVENT_FX.castFoe);
  }
  /**
   * An action: a basic attack's look is its weapon's or its own (a foe's); an ability's its own, else a damaging one its
   * theme's. Its missiles fly now; what it does plays on its targets now if it deals no damage, else as each hit lands.
   */
  act(ev: Ev) {
    const by = String(ev.by);
    const targets = ev.targets as string[];
    const ab = ev.kind === "basic" ? undefined : c.abilities.get(String(ev.act));
    const damage = ev.kind === "basic" || (!!ab && dealsDamage(ab));
    const look = ev.kind === "basic" ? this.basicLook(by) : abilityFx(String(ev.act)) ?? (damage ? themeFx(String(ev.act)) : null);
    const a: Acting = { by, at: ev.at, look, aimed: new Set(targets), hits: new Map(), lands: new Map(), strike: null };
    this.acting = a;
    if (!look) return;
    if (look.self) this.scene.play(by, look.self);
    if (damage && look.missile) for (const t of targets) a.lands.set(t, this.now() + this.scene.missile(by, t, look.missile, 0, this.pace()));
    if (!damage) for (const t of targets) this.played(t, look.hit, by);
  }
  /** An extra strike after a basic attack: its blow plays as it lands, Arc's as a bolt. */
  strike(ev: Ev) {
    if (this.ours(ev)) this.acting!.strike = String(ev.status);
  }
  /**
   * Damage shown: a miss or a block its own; a blow the acting unit's look (an extra strike's Arc a bolt), or for a hit
   * out of turn the dealer's swing; a status's tick or reaction its own.
   */
  damage(ev: Ev) {
    const target = String(ev.target), by = String(ev.by), part = String(ev.part), word = ev.word as string | null;
    const blow = part === "hit" || part === "extra";
    if (word === "MISS") return void (blow && this.played(target, EVENT_FX.miss));
    if (word === "AEGIS" || word === "BLOCKED") return void this.played(target, word === "AEGIS" ? EVENT_FX.aegis : EVENT_FX.block);
    if (word === "IMMUNE") return;
    if (blow) {
      const a = this.ours(ev) ? this.acting! : null;
      const look = a ? (part === "extra" && a.strike === "arc" ? EVENT_FX.arc : a.look?.hit) : this.basicLook(by)?.hit;
      if (look) this.played(target, look, by);
    } else if (part === "pulse") this.scene.play(target, tickFx(String(ev.src)), { mark: true });
    else if (part === "reaction") this.scene.play(target, reactionFx(String(ev.src)), { from: by });
  }
  /** A heal: a status's tick its own; any other its spell's (played as it acted), else a plain one. */
  heal(target: string, src: string) {
    if (c.statuses.has(src)) this.scene.play(target, tickFx(src), { mark: true });
    else if (!this.recent(target)) this.played(target, EVENT_FX.heal);
  }
  /** MP an action gave (a pulse's has its number only). */
  mp(target: string, part: unknown) {
    if (part !== "pulse" && !this.recent(target)) this.scene.play(target, EVENT_FX.mp);
  }
  /** A status landing: its look, unless an action's effect just played there and its look isn't the point. */
  status(unit: string, id: string) {
    const look = statusFx(c.statuses.get(id)?.absorb ? "shield" : id);
    const recent = this.recent(unit);
    if (look.always || !recent) this.scene.play(unit, look.fx, { delay: recent ? 160 : 0, mark: true });
  }
  revive(unit: string) {
    if (!this.recent(unit)) this.scene.play(unit, this.scene.units.get(unit)?.side === "party" ? EVENT_FX.revive : EVENT_FX.reviveFoe);
  }
  /** A foe knocked out (a party member just falls). */
  down(unit: string) {
    const u = this.driver.unit(unit);
    if (u && u.side === "enemy") this.scene.play(unit, downFx(u.ref));
  }
  join(unit: string, ref: string) {
    this.scene.play(unit, joinFx(this.driver.unit(unit)?.ref ?? ref));
  }
  leave(unit: string) {
    this.scene.play(unit, leaveFx(this.driver.unit(unit)?.ref ?? ""));
  }
  interrupt(unit: string) {
    this.scene.play(unit, EVENT_FX.interrupt);
  }

  // ─── Helpers ───

  /** Whether an event is the acting unit's, at its action's moment (a later hit out of turn by the same unit isn't). */
  private ours(ev: Ev): boolean {
    return !!this.acting && String(ev.by) === this.acting.by && ev.at === this.acting.at;
  }
  private recent(unit: string): boolean {
    return this.now() - (this.lastFx.get(unit) ?? -9999) < RECENT;
  }
  /** An action's own effect on a unit (a status or heal landing with it lets it speak for them). */
  private played(unit: string, effects: Fx[], from?: string) {
    this.scene.play(unit, effects, { from });
    this.lastFx.set(unit, this.now());
  }
  /** A unit's swing: a foe's own, a party member's weapon's (a plain caster's weapon its class's theme). */
  private basicLook(id: string): Look | null {
    const u = this.driver.unit(id);
    return u ? basicFx(u.weapon, u.side === "enemy" ? u.ref : undefined, u.side === "party" ? u.ref : undefined) : null;
  }
  /** How long a blow waits before it lands: its missile's flight, or the gap after the action's last blow. */
  private blowWait(ev: Ev): number {
    const a = this.acting;
    if (ev.t !== "dmg" || !a || !this.ours(ev) || (ev.part !== "hit" && ev.part !== "extra")) return 0;
    const t = String(ev.target);
    const n = a.hits.get(t) ?? 0;
    a.hits.set(t, n + 1);
    const lands = a.lands.get(t);
    if (lands !== undefined) {
      a.lands.delete(t);
      return Math.max(0, lands - this.now());
    }
    if (n === 0 && ev.part === "hit" && a.look?.missile) return this.scene.missile(a.by, t, a.look.missile, 0, this.pace());
    return n > 0 || !a.aimed.has(t) || ev.part === "extra" ? FOLLOW / this.pace() : 0;
  }
}
