/** The Pyromancer's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit-2.ts. */
import type { EffectT, NumT, ToT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { BURN_STACKS, from, HIT, stacks, WINDUP } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, hitOf, kit, magic, passiveUp } from "./kit-2.js";

// ─── Pyromancer ──────────────────────────────────────────────────────────────

const burnTo = (to: ToT, mult: number): EffectT => apply("burn", { stacks: own("few", "magic", BURN_STACKS * mult), to });
passiveUp({
  id: "kindling", cls: "pyromancer",
  power: "Its basic attacks add 40% more Burn.",
  a: { name: "Wildfire", text: "Its basic attacks add a few Burn to their target and to a random other foe; stacks scale from Magic.", builds: ["harvest"] },
  b: { name: "Searing", text: "Its basic attacks add Burn only to the foe with the most Burn, twice as many; stacks scale from Magic.", builds: ["bonfire"] },
  form: (v, k) => ({
    reactions: [{
      on: { event: "hit_lands", kind: "basic" },
      do: v === "a" ? [burnTo("other", k), burnTo({ side: "foes", pick: "random", exclude: "other" }, k)] // A random foe other than the one it hit.
        : v === "b" ? [burnTo(T.mostFoe("burn"), 2 * k)]
          : [burnTo("other", k)],
    }],
  }),
});

const fireboltBurn = (mult: number) => [{ status: "burn", stacks: stacks("several", "magic", BURN_STACKS * mult) }];
abilityUp({
  id: "firebolt", cls: "pyromancer",
  power: "40% more Burn.",
  a: { name: "Slow burn", text: "Deals half the magical damage, scaling from Magic, to the foe with the most Burn, and adds twice the Burn; stacks scale from Magic.", builds: ["bonfire"] },
  b: { name: "Flash bolt", text: "A quick bolt: deals magical damage that scales from Magic to the foe with the most Burn, and adds a few Burn; stacks scale from Magic.", builds: ["overflow", "cuts"] },
  form: (v, k) =>
    v === "a" ? { do: [magic(from("magic", HIT.light / 2), { apply: fireboltBurn(2 * k) })] }
      // Half the cost, off the ladder (as Blood drain's 125), and half the Burn; the hit is the base's.
      : v === "b" ? { cast: WINDUP.quick, mp: 225, do: [magic(hitOf("magic", "light"), { apply: fireboltBurn(0.5 * k) })] }
        : { do: [magic(hitOf("magic", "light"), { apply: fireboltBurn(k) })] },
});

abilityUp({
  id: "fireball", cls: "pyromancer",
  power: "40% more damage.",
  a: { name: "Conflagration", text: "Deals magical damage that scales from Magic to every foe, and adds many Burn to each; stacks scale from Magic. A longer cooldown.", builds: ["bonfire", "harvest"] },
  b: { name: "Flashfire", text: "A quick blast: deals magical damage that scales from Magic to every foe, smaller, and adds a little Burn to each; stacks scale from Magic.", builds: ["cuts", "overflow"] },
  form: (v, k) =>
    v === "a" ? { cooldown: cd("long", "fireball"), do: [magic(hitOf("magic", "touch", k), { apply: [{ status: "burn", stacks: stacks("many", "magic", BURN_STACKS) }] })] }
      : v === "b" ? { cooldown: cd("short", "fireball"), cast: WINDUP.quick, mp: 650, do: [magic(from("magic", 0.1 * k), { apply: [{ status: "burn", stacks: stacks("few", "magic", BURN_STACKS * 0.6) }] })] }
        : { do: [magic(hitOf("magic", "touch", k), { apply: [{ status: "burn", stacks: stacks("few", "magic", BURN_STACKS) }] })] },
});

/** Pyre: a heavy hit plus 200 a Burn stack on its target; Funeral pyre half of both on every foe, each by its own Burn. */
const PYRE_PER_STACK = 200;
const pyreHit = (share: number, k: number): NumT => ({ scale: [{ ratio: HIT.heavy * share * k, stat: "magic" }, { ratio: PYRE_PER_STACK * share * k, stacks: "burn", of: "target" }] });
abilityUp({
  id: "pyre", cls: "pyromancer",
  power: "40% more damage.",
  a: { name: "Funeral pyre", text: "Deals magical damage to every foe; the damage scales from Magic and rises by 100 with each Burn stack on that foe. The Burn stays.", builds: ["harvest"] },
  b: { name: "Pyre of the fallen", text: "Deals heavy magical damage to the foe with the most Burn; the damage scales from Magic and rises by 200 with each Burn stack on that foe. The Burn stays. Whenever a burning foe falls, Pyre comes 4 ticks closer.", builds: ["bonfire"] },
  form: (v, k) =>
    v === "a" ? { target: T.everyFoe, do: [magic(pyreHit(0.5, k))] }
      : { ...(v === "b" ? { statuses: ["pyre_of_the_fallen"] } : {}), do: [magic(pyreHit(1, k))] },
});
// Brought by the ability: a foe's Burn ending with its holder's knockout (status_ended, cause ko), whoever killed it, brings Pyre 4 ticks closer.
helper(kit("pyre_of_the_fallen", "PYRE OF THE FALLEN", "Whenever a burning foe falls, Pyre comes closer.", {
  show: "sheet", unremovable: true,
  reactions: [{ on: { event: "status_ended", status: "burn", cause: ["ko"], whose: "foe" }, do: [{ op: "cooldown", which: { ability: ["pyre"] }, set: { less: 4 }, to: "self" }] }],
}));
