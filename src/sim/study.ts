/**
 * A study: a small data file that says what to run. The same study always
 * gives the same numbers.
 */
import { z } from "zod";
import { Party } from "../schema.js";

const PatchZ = z.strictObject({ path: z.string(), set: z.unknown().optional(), mul: z.number().optional(), add: z.number().optional() });

const base = {
  id: z.string().regex(/^[a-z0-9-]+$/),
  about: z.string().default(""),
  /** Held-out studies only run for the final check (`--final`), so tuning never sees them. */
  heldOut: z.boolean().default(false),
  content: z.strictObject({
    pack: z.string(),
    /** PLACEHOLDER for step 3: copies of the first dungeon, enemies scaled by each number. */
    ladder: z.array(z.number().positive()).optional(),
  }),
  /** Versions run side by side on the same seeds. The first is the baseline. */
  variants: z.array(z.strictObject({ name: z.string(), patch: z.array(PatchZ).default([]) })).default([{ name: "as is", patch: [] }]),
  /** What counts as "can win": a share of tries. A placeholder until step 14 sets targets. */
  bar: z.number().min(0).max(1).default(0.5),
  /** Expected ranges for headline numbers. A number outside its range is flagged in the digest. */
  expect: z.array(z.strictObject({ key: z.string(), between: z.tuple([z.number(), z.number()]) })).default([]),
};

export const CombatStudy = z.strictObject({
  level: z.literal("combat"),
  ...base,
  targets: z.strictObject({
    dungeons: z.union([z.literal("all"), z.array(z.string())]).default("all"),
    challenges: z.boolean().default(true),
    /** Single fights, as "dungeon/stage". */
    fights: z.array(z.string()).default([]),
  }),
  /** Every set of classes up to `max` (in the first formation that fits, or all of them), or a fixed list. */
  parties: z.union([z.strictObject({ max: z.number().int().positive().optional(), formations: z.enum(["first", "all"]).default("first") }), z.array(Party)]),
  seeds: z.number().int().min(20),
  /** How perks are picked: at random (each seed its own dice), or by a fixed priority list. */
  perks: z.union([z.literal("random"), z.strictObject({ list: z.array(z.string()) })]).default("random"),
  /** Seeds for the four perk numbers (every path), on each dungeon's best parties. 0 skips them. */
  perkSeeds: z.number().int().min(0).default(40),
  /** Seeds for checking which tweaks change results (formation, gear, abilities, order). 0 skips it. */
  effectSeeds: z.number().int().min(0).default(0),
});
export type CombatStudy = z.infer<typeof CombatStudy>;

export const ProgressionStudy = z.strictObject({
  level: z.literal("progression"),
  ...base,
  players: z.number().int().min(20),
  weeks: z.number().int().positive(),
  /** Quests on each week's board. Each shows an unlock the player doesn't own yet. */
  board: z.tuple([z.number().int(), z.number().int()]).default([4, 7]),
  /** Does most of each board, and homes in on builds by trial and error, with a budget of tries a week. */
  optimizer: z.strictObject({ quests: z.number().min(0).max(1).default(0.8), tries: z.number().int().positive().default(30) }).default({ quests: 0.8, tries: 30 }),
  /** Does a few quests and plays a few runs. Puts new units straight in, swaps one unit after two losses in a row, and picks perks at random. */
  casual: z.strictObject({ quests: z.tuple([z.number().int(), z.number().int()]).default([1, 3]), runs: z.tuple([z.number().int(), z.number().int()]).default([2, 4]) }).default({ quests: [1, 3], runs: [2, 4] }),
  /** Sees everything, within a fixed budget of runs per question, and stops at the first party that wins `stopAt` of its tries. */
  benchmark: z.strictObject({ seeds: z.number().int().positive().default(10), budget: z.number().int().positive().default(300), stopAt: z.number().default(0.9) }).default({ seeds: 10, budget: 300, stopAt: 0.9 }),
  /** A dungeon or challenge counts as winnable when a party wins at least this share of tries. A placeholder. */
  clearBar: z.number().min(0).max(1).default(0.1),
});
export type ProgressionStudy = z.infer<typeof ProgressionStudy>;

export const Study = z.discriminatedUnion("level", [CombatStudy, ProgressionStudy]);
export type Study = z.infer<typeof Study>;
