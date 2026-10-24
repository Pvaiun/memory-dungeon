/**
 * Drives a run for the interface: steps the engine one moment at a time on a
 * virtual clock, and turns the log into visual events as they happen. The
 * engine is untouched; the driver reads its state and its log.
 */
import { advanceOnce, newRun, type Run, type RunInput } from "../../../src/engine/run.js";
import { combat } from "../../../src/engine/combat/rules.js";
import { nextTime, world, type CFight, type CUnit } from "../../../src/engine/combat/fight.js";
import { SUBTICKS } from "../../../src/schema.js";
import type { Entry } from "../../../src/engine/log.js";
import { c } from "../content.js";

export type Ev = Entry & { at?: number };

export type Phase = "intro" | "fighting" | "won" | "lost" | "run_won" | "run_lost";

export class Driver {
  run: Run;
  fight: CFight | null = null;
  /** Virtual time, in sub-ticks, that the display has reached. */
  vt = 0;
  phase: Phase = "intro";
  private logIndex = 0;
  /** Events the fight produced that the scene hasn't shown yet. */
  pending: Ev[] = [];
  /** Fight number and total, for the banner. */
  fightNo = 0;
  fightTotal: number;

  constructor(public input: RunInput) {
    this.run = newRun(c, combat, input, { log: true });
    this.logIndex = this.run.log!.length;
    this.fightTotal = c.dungeons.get(input.dungeon)!.stages.filter((s) => s.kind === "fight").length;
    this.begin();
  }

  /** Starts the next fight: runs the loop until a fight exists, then plays its first moment (setup). */
  begin() {
    while (!this.run.fight && !this.run.outcome && !this.run.pending) advanceOnce(c, combat, this.run);
    if (this.run.outcome) {
      this.phase = this.run.outcome === "won" ? "run_won" : "run_lost";
      this.drain();
      return;
    }
    this.fight = this.run.fight as CFight;
    this.fightNo++;
    this.vt = 0;
    this.phase = "intro";
    this.drain();
    // The first turn only sets the fight up (statuses from passives, gear and formation; every action on cooldown).
    advanceOnce(c, combat, this.run);
    this.drain();
  }

  startFighting() {
    if (this.phase === "intro") this.phase = "fighting";
  }

  /** Moves the clock forward by `dSub` sub-ticks, stepping the engine through every moment reached. */
  advance(dSub: number): void {
    const f = this.fight;
    if (!f || this.phase !== "fighting") return;
    const target = this.vt + dSub;
    const w = world(c, f);
    while (!f.result) {
      const t = nextTime(w);
      if (t > target) break;
      advanceOnce(c, combat, this.run);
      this.drain();
      if (this.pending.length) {
        // Hold the clock at this moment until the scene has shown what happened.
        this.vt = Math.max(this.vt, Math.min(target, f.now));
        return;
      }
    }
    this.vt = f.result ? f.now : target;
    if (f.result) this.phase = f.result === "won" ? "won" : "lost";
  }

  /** After a won fight: carry results into the run and start the next fight or end the run. */
  continueRun() {
    if (!this.fight?.result) return;
    advanceOnce(c, combat, this.run);
    this.drain();
    this.fight = null;
    this.begin();
  }

  private drain() {
    const log = this.run.log!;
    for (; this.logIndex < log.length; this.logIndex++) this.pending.push(log[this.logIndex] as Ev);
  }

  units(): CUnit[] {
    return this.fight?.units ?? [];
  }
  unit(id: string): CUnit | undefined {
    return this.fight?.units.find((u) => u.id === id);
  }
  get now(): number {
    return this.fight?.now ?? 0;
  }
  get tick(): number {
    return this.vt / SUBTICKS;
  }
}
