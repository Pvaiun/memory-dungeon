/** The Pyromancer's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { EffectT, NumT, ToT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { BURN_STACKS, from, HIT, stacks, WINDUP } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, hitOf, kit, passiveUp, phys } from "./kit.js";

// ─── Pyromancer ──────────────────────────────────────────────────────────────

/** Stoke: Burn from the Pyromancer's Attack, on the hottest foe (base), on every burning foe at half (Wildfire), or on its swings' targets (Kindling). */
const stoke = (to: ToT, mult: number): EffectT => apply("burn", { stacks: own("few", "attack", BURN_STACKS * mult), to });
passiveUp({
  id: "stoke", cls: "pyromancer",
  power: "+40% Burn.",
  a: { name: "Kindling", text: "Basic attacks, not casts, add Burn.", serves: "Bonfire 1 ●●● ⚙ lead's colour (half)" },
  b: { name: "Ember of haste", text: "Each cast Hastes the ally with the fastest basic attack, in place of Burn.", serves: "Cuts 2 ●●, Barrage ● ◆ speed, the feeders' tempo", plus: "Hastes the 2 with the fastest." },
  form: (v, k, plus) => ({
    reactions: [
      v === "a" ? { on: { event: "hit_lands", kind: "basic" }, do: [stoke("other", k)] }
        : v === "b" ? { on: { event: "action_resolve", kind: "ability" }, do: [apply("haste", { to: { side: "allies", pick: "lowest", by: "swing", ...(plus ? { count: 2 } : {}) } })] }
          : { on: { event: "action_resolve", kind: "ability" }, do: [stoke(T.mostFoe("burn"), k)] },
    ],
  }),
});

const fireboltBurn = (mult: number) => [{ status: "burn", stacks: stacks("several", "attack", BURN_STACKS * mult) }];
abilityUp({
  id: "firebolt", cls: "pyromancer",
  power: "+40% Burn.",
  shown: true,
  a: { name: "Slow burn", text: "A bolt at the foe with the most Burn, trading hit for Burn.", builds: ["bonfire"] },
  b: { name: "Searing light", text: "Waits for a foe to cast, then a bolt at the casting foe with the most Attack, Silencing it. No Burn.", serves: "Toll 2 ●●, Hunt ● ◆ stops a cast", plus: "+40% damage." },
  form: (v, k) =>
    v === "a" ? { do: [phys(from("attack", HIT.light / 2), { apply: fireboltBurn(1.5 * k) })] }
      // The disabler: a quick wind-up, so the bolt lands inside the foe's.
      : v === "b" ? { cast: WINDUP.quick, if: { side: "foes", where: { casting: true } }, target: { side: "foes", where: { casting: true }, pick: "highest", by: { stat: "attack" } }, do: [phys(hitOf("attack", "light", k), { apply: [{ status: "silence" }] })] }
        : { do: [phys(hitOf("attack", "light"), { apply: fireboltBurn(k) })] },
});

abilityUp({
  id: "fireball", cls: "pyromancer",
  power: "+40% damage.",
  shown: true,
  a: { name: "Conflagration", text: "Hits every foe, trading a long wind-up for far more Burn.", builds: ["bonfire", "storm"] },
  b: { name: "Smoke", text: "Hits every foe and Weakens them. No Burn.", serves: "Toll 2 ●●, Landslide ● ◆ foes do less" },
  form: (v, k) =>
    // The ritualist's cast: the long wind-up is the cost, which Cast speed pays down.
    v === "a" ? { cast: WINDUP.very_long, do: [phys(hitOf("attack", "touch", k), { apply: [{ status: "burn", stacks: stacks("several", "attack", BURN_STACKS) }] })] }
      : v === "b" ? { do: [phys(hitOf("attack", "touch", k), { apply: [{ status: "weaken" }] })] }
        : { do: [phys(hitOf("attack", "touch", k), { apply: [{ status: "burn", stacks: stacks("few", "attack", BURN_STACKS) }] })] },
});

/** Pyre: a heavy hit plus 200 a Burn stack on its target; Funeral pyre half of both on every foe, each by its own Burn. */
const PYRE_PER_STACK = 200;
/** High pyre: it waits for a deep fire, then cashes it: 500 a Burn stack, on the foe that holds the most. */
const HIGH_PYRE = { waits: 20, perStack: 500 };
const pyreHit = (share: number, k: number): NumT => ({ scale: [{ ratio: HIT.heavy * share * k, stat: "attack" }, { ratio: PYRE_PER_STACK * share * k, stacks: "burn", of: "target" }] });
abilityUp({
  id: "pyre", cls: "pyromancer",
  power: "+40% damage.",
  shown: true,
  a: { name: "Funeral pyre", text: "Burns down every foe, each harder for its Burn.", builds: ["storm"] },
  b: { name: "High pyre", text: "Waits for a foe with 20+ Burn, then burns down the foe with the most.", serves: "Bonfire 2 ●●●, Barrage ●" },
  form: (v, k) =>
    v === "a" ? { target: T.everyFoe, do: [phys(pyreHit(0.5, k))] }
      : v === "b" ? { if: { side: "foes", where: { stacks: { status: "burn", atLeast: HIGH_PYRE.waits } } }, target: T.mostFoe("burn"), do: [phys({ scale: [{ ratio: HIT.heavy * k, stat: "attack" }, { ratio: HIGH_PYRE.perStack * k, stacks: "burn", of: "target" }] })] }
        : { do: [phys(pyreHit(1, k))] },
});

