import { test } from "vitest";
import assert from "node:assert/strict";
import { fingerprint, hash32, int, next, rngFor, shuffle, u32 } from "./rng.js";

test("the same seed and label give the same numbers", () => {
  const a = rngFor(42, "fight:den_mouth");
  const b = rngFor(42, "fight:den_mouth");
  for (let i = 0; i < 1000; i++) assert.equal(u32(a), u32(b));
});

test("pinned values: any change here means old seeds play differently", () => {
  const s = rngFor(1, "fight:den_mouth");
  assert.deepEqual([u32(s), u32(s), u32(s)], [GOLDEN[0], GOLDEN[1], GOLDEN[2]]);
  assert.equal(hash32("memory dungeon"), GOLDEN[3]);
  assert.equal(fingerprint("memory dungeon"), GOLDEN_FP);
});
const GOLDEN = [847683923, 445787573, 4246851434, 2028082603];
const GOLDEN_FP = "69f854cb292568d7";

test("slices are independent: different labels and seeds give different streams", () => {
  const first = (seed: number, label: string) => u32(rngFor(seed, label));
  const seen = new Set<number>();
  for (let seed = 0; seed < 50; seed++) for (const l of ["fight:a", "fight:b", "stage:pick_1", "loot"]) seen.add(first(seed, l));
  assert.equal(seen.size, 200);
});

test("next() stays in [0, 1) and is roughly uniform", () => {
  const s = rngFor(7, "uniform");
  const buckets = new Array(10).fill(0);
  for (let i = 0; i < 100_000; i++) {
    const x = next(s);
    assert.ok(x >= 0 && x < 1);
    buckets[Math.floor(x * 10)]++;
  }
  for (const b of buckets) assert.ok(b > 9_500 && b < 10_500, `bucket ${b}`);
});

test("int() covers its range and shuffle() keeps every element", () => {
  const s = rngFor(3, "ints");
  const seen = new Set<number>();
  for (let i = 0; i < 1000; i++) seen.add(int(s, 6));
  assert.deepEqual([...seen].sort(), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(shuffle(s, [1, 2, 3, 4, 5]).sort(), [1, 2, 3, 4, 5]);
});

test("generator state is plain data: a saved copy continues identically", () => {
  const s = rngFor(9, "save");
  for (let i = 0; i < 10; i++) u32(s);
  const copy = JSON.parse(JSON.stringify(s));
  for (let i = 0; i < 100; i++) assert.equal(u32(s), u32(copy));
});
