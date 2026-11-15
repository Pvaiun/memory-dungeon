/** The Hoplite's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, ReactionT, StatusT } from "../../../src/schema.js";
import { from, HIT, KIND_SPEED, KIT, stacks, SWING_REF } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, kit, passiveUp, phys, r6, removeMine } from "./kit.js";

{
  const phalanx = (boost: number) => ({ stats: [{ stat: "attack_speed", flat: -100 }], boosts: [{ tag: "basic", pct: boost }] });
  /** Opening thrust: the basic attack's timer made ready at the start, and +100% on the first swing, which adds to Phalanx's. */
  const opening: ReactionT = { on: { event: "fight_start" }, do: [{ op: "cooldown", which: "basic", set: "ready", to: "holder" }, apply("opening_thrust", { to: "holder" })] };
  helper(kit("opening_thrust", "OPENING THRUST", "First basic attack +100%.", {
    boosts: [{ tag: "basic", pct: 100 }],
    reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [removeMine("opening_thrust")] }, { on: { event: "hit_missed", kind: "basic" }, do: [removeMine("opening_thrust")] }],
  }));
  /** Shieldbearer: a tenth of its Defense on each swing, sized by the held kind's interval as a swing is (a `weapon` test reads the kind), then Phalanx's boost. */
  const sized = (kind: string) => r6((0.1 * KIND_SPEED[kind]) / SWING_REF);
  const bearer: NonNullable<StatusT["riders"]> = [{ on: "basic", add: { type: "physical", amount: { scale: ["spear", "great_weapon"].map((kind) => ({ ratio: sized(kind), when: { weapon: [kind] }, of: "holder" as const, times: { stat: "defense", of: "holder" as const } })) } } }];
  passiveUp({
    id: "phalanx", cls: "hoplite",
    power: "Basic attacks deal ×2.4, not ×2.",
    a: { name: "Opening thrust", text: "Basic attacks 50% as often, for ×2; the first each fight comes at once, for ×3.", serves: "Hunt 1 ●●●, Landslide ●●", plus: "Basic attacks ×2.4, the first ×3.4." },
    b: { name: "Shieldbearer", text: "Basic attacks 50% as often, for ×2; Defense adds to them 50% as much as Attack.", serves: "Landslide 1 ●●●" },
    form: (v, _k, plus) => ({ ...phalanx(plus ? 140 : 100), ...(v === "a" ? { reactions: [opening] } : v === "b" ? { riders: bearer } : {}) }),
  });
}

{
  /**
   * Watch the anchor: Aegis on the ally with the most Aggro that holds none. DRAWN's phrase (a Taunting ally first) can't sit beside the Fizzle
   * rule in one target rule: `ifNone: any` drops the `lacks`, and the Aegis would fizzle on the anchor that already holds one.
   */
  const anchor: Partial<AbilityT> = { target: { side: "allies", where: { lacks: "aegis" }, pick: "highest", by: { stat: "aggro" } } };
  /** Hold the gap: the bodyguard becomes the anchor: Aegis on itself, and a Taunt. */
  const gap: Partial<AbilityT> = { target: "self", do: [apply("aegis"), apply("taunt")] };
  abilityUp({
    id: "aspis", cls: "hoplite",
    power: "Shorter cooldown.", shown: true,
    a: { name: "Watch the anchor", text: "Aegis on the ally with the most Aggro that lacks one.", serves: "Toll 2 ●●● ⚙ mirror (half)" },
    b: { name: "Hold the gap", text: "Aegis on itself, and Taunts.", serves: "Toll 2 ●●●, Landslide ● ◆ draw, the anchor" },
    form: (v, _k, plus) =>
      v === "a" ? { ...anchor, ...(plus ? { cooldown: cd("medium", "aspis") } : {}) }
        : v === "b" ? { ...gap, ...(plus ? { cooldown: cd("medium", "aspis") } : {}) }
          : { cooldown: cd("medium", "aspis") },
  });
}

{
  /** Othismos: the shove from Defense on every foe, a few Sunder each (from Defense too); Breach one foe, the most Defense, for triple with several. */
  const shove = (ratio: number, word: "few" | "several", k: number) => phys(from("defense", ratio), { apply: [{ status: "sunder", stacks: stacks(word, "defense", k) }] });
  abilityUp({
    id: "othismos", cls: "hoplite",
    power: "+40% Sunder.", shown: true,
    a: { name: "Locked shields", text: "Shoves every foe, adding Sunder; Guards itself and the ally with the lowest HP%.", builds: ["toll", "storm"] },
    b: { name: "Breach", text: "Shoves only the foe with the most Defense, adding Sunder.", builds: ["landslide", "hunt"] },
    form: (v, k) =>
      v === "a" ? { do: [shove(HIT.light * KIT.othismos, "few", k), apply("guard", { to: "self" }), apply("guard", { to: T.lowestShareAlly })] }
        : v === "b" ? { target: { side: "foes", pick: "highest", by: { stat: "defense" } }, do: [shove(HIT.light * 3, "several", k)] }
          : { do: [shove(HIT.light * KIT.othismos, "few", k)] },
  });
}

{
  const thrust = (ratio: number, extra: object = {}) => phys(from("attack", ratio), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }], ...extra });
  const skewer = (ratio: number): Partial<AbilityT> => ({ do: [thrust(ratio), thrust(ratio, { to: { side: "foes", pick: "highest", by: "hp", exclude: "targets" } })] });
  /** Disarm: the bodyguard's own act. Weaken on the most dangerous foe, and no Sunder. */
  const disarm = (ratio: number): Partial<AbilityT> => ({ target: T.highestAMFoe, do: [phys(from("attack", ratio), { apply: [{ status: "weaken" }] })] });
  abilityUp({
    id: "spear_thrust", cls: "hoplite",
    power: "+40% damage.", shown: true,
    a: { name: "Skewer", text: "Pierces a random foe and the foe with the most HP, adding Sunder.", builds: ["storm"] },
    b: { name: "Disarm", text: "Thrusts at the foe with the most Attack and Weakens it. No Sunder.", builds: ["hunt"] },
    form: (v, k) => (v === "a" ? skewer(0.8 * k) : v === "b" ? disarm(1.1 * k) : { do: [thrust(1.1 * k)] }),
  });
}
