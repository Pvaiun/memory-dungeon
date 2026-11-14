/** The Hexer's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { own } from "../pieces/kit.js";
import { BURN_STACKS, HIT, stacks } from "../scale.js";
import { curse, T } from "../classes.js";
import type { EffectT, TargetRuleT } from "../../../src/schema.js";
import { abilityUp, apply, cd, COLD_HEX, helper, marker, passiveUp, phys } from "./kit.js";

// ─── Hexer ───────────────────────────────────────────────────────────────────

passiveUp({
  id: "cold_hex", cls: "hexer",
  power: "+40% stacks.",
  a: { name: "Hex of flames", text: "Basic attacks add Burn, not Chill.", serves: "Bonfire 1 ●●● ⚙ lead's colour (half)" },
  b: { name: "Withering hex", text: "Basic attacks Weaken their target instead of adding Chill.", builds: ["toll"], plus: "" },
  form: (v, k) => ({
    reactions: [{
      on: { event: "hit_lands", kind: "basic" },
      do: [
        v === "a" ? apply("burn", { stacks: own("few", "attack", BURN_STACKS * k), to: "other" }) // Kindling's own size: the Pyromancer's stays the bigger.
          : v === "b" ? apply("weaken", { to: "other" }) // Weaken at its own length: a lock on the swing's target, nothing to grow.
            : apply("chill", { stacks: own("few", "attack", COLD_HEX * k), to: "other" }),
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

abilityUp({
  id: "enfeeble", cls: "hexer",
  power: "+40% Sunder, or costs less MP.",
  shown: true,
  a: { name: "Wither", text: "Weakens every foe. No Sunder.", builds: ["toll"] },
  b: { name: "Expose", text: "Sunder on the foe with the least HP. No Weaken.", builds: ["hunt", "cuts"] },
  form: (v, k, plus) =>
    v === "a" ? { target: T.everyFoe, cooldown: cd("medium", "enfeeble"), mp: plus ? 450 : 650, do: [apply("weaken")] }
      : v === "b" ? { target: T.lowestHpFoe, do: [apply("sunder", { stacks: stacks("many", "attack", k) })] } // The lowest current HP, no Seek.
        : { do: [apply("weaken"), apply("sunder", { stacks: stacks("few", "attack", k) })] },
});
