import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { advance, loadContent } from "./engine/run.js";
import { combat } from "./engine/combat/rules.js";
import { member, newRogue, options, type RogueRun } from "./rogue.js";
import { beginRecord, checkRecord, choose, endFight, recordResume, setOrder, startFight, type RecordEntry } from "./rogue-record.js";

const c = loadContent(JSON.parse(readFileSync("content/core-set.pack.json", "utf8")));
type Recorded = RogueRun & { record: RecordEntry[] };

/** A run played to its end by always taking the first thing offered, with a reload in one fight and an ability order changed. */
function played(seed: number): Recorded {
  const run = newRogue(c, { seed, leader: "knight" }) as Recorded;
  beginRecord(run, "test");
  let n = 0, reloaded = false;
  while (run.pending.kind !== "over" && n++ < 3000) {
    if (run.pending.kind === "fight") {
      if (!reloaded) { startFight(c, run); recordResume(run, "test"); reloaded = true; }
      const er = startFight(c, run);
      advance(c, combat, er);
      endFight(c, run, er);
      continue;
    }
    if (run.pending.kind === "map" && member(run, run.leader).order.length > 1) setOrder(run, run.leader, [...member(run, run.leader).order].reverse());
    const o = options(c, run);
    choose(c, run, o.find((x) => x !== "skip" && x !== "leave") ?? o[0]);
  }
  return run;
}

describe("a run's record", () => {
  const run = played(5);
  const copy = (): Recorded => structuredClone(run);

  it("replays to the run that ended", () => {
    const check = checkRecord(c, run);
    expect(check.verdict, check.text).toBe("good");
    expect(check.fights).toBeGreaterThan(0);
    expect(check.reloads).toBe(1);
  });
  it("finds a step that went missing", () => {
    const r = copy();
    const i = r.record.findIndex((e) => e.t === "choice" && e.i > 3);
    r.record.splice(i, 1);
    expect(checkRecord(c, r).verdict).toBe("bad");
  });
  it("finds a pick that was changed", () => {
    const r = copy();
    const e = r.record.find((x) => x.t === "choice" && Array.isArray(x.offered) && (x.offered as string[]).length > 1 && x.pick !== (x.offered as string[]).at(-1))!;
    e.pick = (e.offered as string[]).at(-1);
    expect(checkRecord(c, r).verdict).toBe("bad");
  });
  it("finds a state that moved without a step", () => {
    const r = copy();
    r.gold += 50;
    expect(checkRecord(c, r).verdict).toBe("bad");
  });
  it("calls a record begun mid-run partial", () => {
    // A run whose record was lost (storage full) begins a new one from where it stands.
    const cut = copy();
    delete (cut as Partial<Recorded>).record;
    beginRecord(cut);
    expect(checkRecord(c, cut).verdict).toBe("partial");
  });
});

describe("a saved run loaded again", () => {
  it("keeps its supplies (a reload had turned every tonic into a potion)", async () => {
    const { migrate } = await import("./rogue.js");
    const run = newRogue(c, { seed: 3, leader: "knight" });
    run.supplies = ["potion", "tonic", "tonic"];
    expect(migrate(structuredClone(run)).supplies).toEqual(["potion", "tonic", "tonic"]);
  });
});
