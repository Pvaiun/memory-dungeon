/** The Hexer's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { own } from "../pieces/kit.js";
import { BURN_STACKS, HIT, SHOCK_STACKS, stacks } from "../scale.js";
import { curse, T } from "../classes.js";
import type { EffectT, TargetRuleT } from "../../../src/schema.js";
import { abilityUp, apply, cd, COLD_HEX, helper, marker, passiveUp, phys, POWER } from "./kit.js";

// ─── Hexer ───────────────────────────────────────────────────────────────────

/**
 * Withering hex's Shock on every swing, on the few word at the Stormcaller's own multiple (SHOCK_STACKS, as Arc): the foe the
 * Hexer keeps striking keeps a charge that softens its hits (`STATUS.shock.hits` a stack) and stings it each time it acts.
 */
export const WITHERING_SHOCK = SHOCK_STACKS;
passiveUp({
  id: "cold_hex", cls: "hexer",
  power: "+40% stacks.",
  a: { name: "Hex of flames", text: "Basic attacks add Chill and Burn.", serves: "Bonfire 1 ●●● ⚙ lead's colour (half)" },
  b: { name: "Withering hex", text: "Basic attacks add Chill and Shock.", builds: ["storm", "snap"] },
  form: (v, k) => ({
    reactions: [{
      on: { event: "hit_lands", kind: "basic" },
      do: [
        apply("chill", { stacks: own("few", "attack", COLD_HEX * k), to: "other" }),
        ...(v === "a" ? [apply("burn", { stacks: own("few", "attack", BURN_STACKS * k), to: "other" })] // Kindling's own size: the Pyromancer's stays the bigger.
          : v === "b" ? [apply("shock", { stacks: own("few", "attack", WITHERING_SHOCK * k), to: "other" })] : []),
      ],
    }],
  }),
});

/** Malison curses: a hit, a fifth more for each different affliction its foe holds, then the statuses of its own, after the hit. */
const cursed = (ratio: number) => phys(curse(ratio));
abilityUp({
  id: "malison", cls: "hexer",
  power: "+40% damage and stacks.",
  shown: true,
  a: { name: "Plague", text: "Curses every foe, adding Burn, Shock and Bleed. +20% damage for each of Burn, Chill, Shock, Bleed and Sunder a foe holds.", serves: "Bonfire ●●, Storm ●●, Cuts ●● ⚙ every colour (key), red rain (half)" },
  b: { name: "Focused curse", text: "Curses only the foe with the most Attack, adding Bleed. +20% damage for each of Burn, Chill, Shock, Bleed and Sunder it holds.", serves: "Hunt ●● ⚙ every colour (half)" },
  form: (v, k) =>
    v === "b"
      ? { target: T.highestAMFoe, do: [cursed(3 * HIT.light * k), apply("bleed", { stacks: stacks("few", "attack", 3 * k) })] } // No Seek: a Taunting foe catches it first.
      : {
        ...(v === "a" ? { mp: 650 } : {}), // A rung up, for the statuses of its own.
        do: [cursed((v === "a" ? HIT.touch : HIT.light) * k), ...(v === "a" ? [apply("burn", { stacks: stacks("few", "attack", k) }), apply("shock", { stacks: stacks("few", "attack", k) })] : []), apply("bleed", { stacks: stacks("few", "attack", k) })],
      },
});

/** Rebind: the curse-breaker: waits for an ally to be Stunned or Silenced, lifts both from it, and Hastes it. */
const BOUND = ["stun", "silence"];
const rebind = { if: { side: "allies" as const, where: { hasAny: BOUND } }, target: { side: "allies", where: { hasAny: BOUND } } as TargetRuleT, do: [...BOUND.map((status) => ({ op: "remove", label: "debuff", status }) as EffectT), apply("haste")] };
abilityUp({
  id: "unmake", cls: "hexer",
  power: "Shorter cooldown.",
  shown: true,
  a: { name: "Silence all", text: "Waits for a foe to cast, then Silences every casting foe and strips their buffs.", builds: [] },
  b: { name: "Rebind", text: "Waits for an ally to be Stunned or Silenced, then frees it and Hastes it.", serves: "Toll 2 ●●, Barrage ● ◆ the net" },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("short", "unmake") } : {}),
    ...(v === "a" ? { target: { side: "foes", where: { casting: true }, pick: "all" } as TargetRuleT } : {}), // An all-pick: the Taunt and Hidden rules don't apply.
    ...(v === "b" ? rebind : {}),
  }),
});

/**
 * Enfeeble's power step: a cooldown this share of its own and a rung cheaper, still longer than Weaken lasts (so the Weaken
 * still lapses between casts; the short word, under Weaken's length here, would let it never lapse).
 */
const ENFEEBLE_PLUS = 0.85;
/**
 * Shackle's Shock on every foe, on the several word of an ability: Shock halves each time its holder acts, so one cast's charge is
 * spent within a foe's few next actions; at the few word it was a token (about 4 stacks when the foes swung, a 4% cut).
 */
export const SHACKLE_SHOCK = { word: "several" as const, mult: 1 };
abilityUp({
  id: "enfeeble", cls: "hexer",
  power: "Shorter cooldown, and costs less MP.",
  shown: true,
  a: { name: "Wither", text: "Weakens every foe, and adds Sunder to every foe.", builds: ["toll", "cuts"] },
  b: { name: "Shackle", text: "Weakens every foe, and adds Shock to every foe.", builds: ["toll", "storm"] },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: Math.round(cd("medium", "enfeeble") * ENFEEBLE_PLUS * 10) / 10, mp: 450 } : {}),
    // Wither's Sunder is the old power step's size: the few word, two fifths more.
    do: [apply("weaken"), ...(v === "a" ? [apply("sunder", { stacks: stacks("few", "attack", POWER) })] : v === "b" ? [apply("shock", { stacks: stacks(SHACKLE_SHOCK.word, "attack", SHACKLE_SHOCK.mult) })] : [])],
  }),
});
