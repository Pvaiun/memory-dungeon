/**
 * The same result on every device: the engine never uses the clock,
 * Math.random, or the maths functions that can differ between browsers
 * (Math.pow, exp, log, the trig functions and the rest). Basic arithmetic,
 * rounding and the whole-number operations are exact everywhere.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { explore } from "./explore.js";
import { play, randomPicker } from "./run.js";
import { combat } from "./combat/rules.js";
import { boostRules, content as c, DUNGEON, PARTY } from "./testkit.js";

const SAFE_MATH = new Set(["floor", "ceil", "round", "trunc", "min", "max", "abs", "sign", "imul", "clz32", "fround"]);
const dir = new URL("./", import.meta.url);
const sources = (readdirSync(dir, { recursive: true }) as string[]).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));

test("engine source uses no clock, no Math.random and no inexact maths", () => {
  assert.ok(sources.length >= 4 && sources.some((f) => f.startsWith("combat")), "the combat folder is scanned too");
  for (const file of sources) {
    const code = readFileSync(new URL(file, dir), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    for (const [, fn] of code.matchAll(/\bMath\.(\w+)/g)) assert.ok(SAFE_MATH.has(fn), `${file} uses Math.${fn}`);
    for (const bad of [/\bDate\b/, /\bperformance\b/, /\bcrypto\b/, /\*\*/, /\bsetTimeout\b/, /\bnew Intl\b/, /\.toLocale/]) {
      assert.doesNotMatch(code, bad, `${file} uses ${bad.source}`);
    }
  }
});

test("running and exploring touches none of them", () => {
  const banned = ["random", "pow", "exp", "expm1", "log", "log2", "log10", "log1p", "sqrt", "cbrt", "hypot",
    "sin", "cos", "tan", "asin", "acos", "atan", "atan2", "sinh", "cosh", "tanh", "asinh", "acosh", "atanh"] as const;
  const math = Math as unknown as Record<string, unknown>;
  const saved = banned.map((k) => [k, math[k]] as const);
  const RealDate = globalThis.Date;
  const realNow = performance.now;
  const trap = (name: string) => () => {
    throw new Error(`the engine called ${name}`);
  };
  try {
    for (const k of banned) math[k] = trap(`Math.${k}`);
    globalThis.Date = new Proxy(RealDate, { construct: trap("new Date"), apply: trap("Date()"), get: (t, p) => (p === "now" ? trap("Date.now") : Reflect.get(t, p)) });
    performance.now = trap("performance.now");
    for (let seed = 1; seed <= 50; seed++) play(c, combat, { dungeon: DUNGEON, party: PARTY, seed }, randomPicker(seed), { log: true });
    explore(c, boostRules({ stance: true }), { dungeon: DUNGEON, party: PARTY, seed: 1 });
  } finally {
    for (const [k, v] of saved) math[k] = v;
    globalThis.Date = RealDate;
    performance.now = realNow;
  }
});
