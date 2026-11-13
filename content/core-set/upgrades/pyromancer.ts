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
  power: "Each cast stokes 40% more Burn.",
  a: { name: "Kindling", text: "Its basic attacks add a few Burn to their target, in place of its casts; stacks scale from Attack.", serves: "Bonfire 1 ●●● ⚙ lead's colour (half)" },
  b: { name: "Wildfire", text: "Each ability it casts adds a few Burn to every burning foe, 50% as much to each; stacks scale from Attack.", builds: ["storm"] },
  form: (v, k) => ({
    reactions: [
      v === "a" ? { on: { event: "hit_lands", kind: "basic" }, do: [stoke("other", k)] }
        : v === "b" ? { on: { event: "action_resolve", kind: "ability" }, do: [stoke({ side: "foes", where: { has: "burn" }, pick: "all" }, 0.5 * k)] }
          : { on: { event: "action_resolve", kind: "ability" }, do: [stoke(T.mostFoe("burn"), k)] },
    ],
  }),
});

const fireboltBurn = (mult: number) => [{ status: "burn", stacks: stacks("several", "attack", BURN_STACKS * mult) }];
abilityUp({
  id: "firebolt", cls: "pyromancer",
  power: "40% more Burn.",
  a: { name: "Slow burn", text: "Deals 50% of the damage, scaling from Attack, to the foe with the most Burn, and adds twice the Burn; stacks scale from Attack.", builds: ["bonfire"] },
  b: { name: "Flash bolt", text: "A quick bolt: deals damage that scales from Attack to the foe with the most Burn, and adds a few Burn; stacks scale from Attack.", builds: ["barrage", "cuts"] },
  form: (v, k) =>
    v === "a" ? { do: [phys(from("attack", HIT.light / 2), { apply: fireboltBurn(2 * k) })] }
      // Half the cost, off the ladder (as Blood drain's 125), and half the Burn; the hit is the base's.
      : v === "b" ? { cast: WINDUP.quick, mp: 225, do: [phys(hitOf("attack", "light"), { apply: fireboltBurn(0.5 * k) })] }
        : { do: [phys(hitOf("attack", "light"), { apply: fireboltBurn(k) })] },
});

abilityUp({
  id: "fireball", cls: "pyromancer",
  power: "40% more damage.",
  a: { name: "Conflagration", text: "A very long wind-up: deals damage that scales from Attack to every foe, and adds many Burn to each; stacks scale from Attack.", builds: ["bonfire", "storm"] },
  b: { name: "Flashfire", text: "A quick blast: deals damage that scales from Attack to every foe, smaller, and adds a little Burn to each; stacks scale from Attack.", builds: ["cuts", "barrage"] },
  form: (v, k) =>
    // The ritualist's cast: the long wind-up is the cost, which Cast speed pays down.
    v === "a" ? { cast: WINDUP.very_long, do: [phys(hitOf("attack", "touch", k), { apply: [{ status: "burn", stacks: stacks("many", "attack", BURN_STACKS) }] })] }
      : v === "b" ? { cooldown: cd("short", "fireball"), cast: WINDUP.quick, mp: 650, do: [phys(from("attack", 0.1 * k), { apply: [{ status: "burn", stacks: stacks("few", "attack", BURN_STACKS * 0.6) }] })] }
        : { do: [phys(hitOf("attack", "touch", k), { apply: [{ status: "burn", stacks: stacks("few", "attack", BURN_STACKS) }] })] },
});

/** Pyre: a heavy hit plus 200 a Burn stack on its target; Funeral pyre half of both on every foe, each by its own Burn. */
const PYRE_PER_STACK = 200;
/** High pyre: it waits for a deep fire, then cashes it: 500 a Burn stack, on the foe that holds the most. */
const HIGH_PYRE = { waits: 20, perStack: 500 };
const pyreHit = (share: number, k: number): NumT => ({ scale: [{ ratio: HIT.heavy * share * k, stat: "attack" }, { ratio: PYRE_PER_STACK * share * k, stacks: "burn", of: "target" }] });
abilityUp({
  id: "pyre", cls: "pyromancer",
  power: "40% more damage.",
  a: { name: "Funeral pyre", text: "Deals damage to every foe; the damage scales from Attack and rises by 100 with each Burn stack on that foe. The Burn stays.", builds: ["storm"] },
  b: { name: "High pyre", text: "Waits until a foe holds 20 Burn or more. Deals heavy damage that scales from Attack to the foe with the most Burn, rising by 500 with each Burn stack on that foe as it lands. The Burn stays.", serves: "Bonfire 2 ●●●, Barrage ●" },
  form: (v, k) =>
    v === "a" ? { target: T.everyFoe, do: [phys(pyreHit(0.5, k))] }
      : v === "b" ? { if: { side: "foes", where: { stacks: { status: "burn", atLeast: HIGH_PYRE.waits } } }, target: T.mostFoe("burn"), do: [phys({ scale: [{ ratio: HIT.heavy * k, stat: "attack" }, { ratio: HIGH_PYRE.perStack * k, stacks: "burn", of: "target" }] })] }
        : { do: [phys(pyreHit(1, k))] },
});

