/** The Knight's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, EffectT, ReactionT } from "../../../src/schema.js";
import { from, SPECIAL, STATUS } from "../scale.js";
import { abilityUp, apply, cd, helper, kit, ofHolder, passiveUp, phys } from "./kit.js";

const vanguardShield = (ratio: number): EffectT => apply("shield", { stacks: ofHolder(ratio, "max_hp"), to: "holder" });
/** Stonewall: the other ally with the lowest Aggro starts behind a Shield of the Knight's size, up to half its own max HP (the Shield's own cap). */
const stonewallShield = (ratio: number): EffectT => apply("shield", { stacks: ofHolder(ratio, "max_hp"), to: { side: "others", pick: "lowest", by: { stat: "aggro" } } });
const grudge: ReactionT = { on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [apply("taunt", { to: "holder" }), apply("guard", { to: "holder" })] };
passiveUp({
  id: "vanguard", cls: "knight",
  power: "A Shield two fifths bigger.",
  a: { name: "Stonewall", text: "Starts every fight behind a Shield from its max HP. The other ally with the lowest Aggro starts behind a Shield of the same size.", builds: ["landslide", "ambush"] },
  b: { name: "Grudge", text: "Starts every fight behind a Shield from its max HP. When its Shield breaks, it Taunts and is Guarded.", builds: ["toll", "lockdown"] },
  form: (v, k) => ({
    reactions: [
      { on: { event: "fight_start" }, do: v === "a" ? [vanguardShield(0.2 * k), stonewallShield(0.2 * k)] : [vanguardShield(0.2 * k)] },
      ...(v === "b" ? [grudge] : []),
    ],
  }),
});

{
  /** Stone guard: the other ally with the most Defense, Guarded and given a Shield of a quarter of the Knight's Defense, read when it lands. */
  const stoneGuard: Partial<AbilityT> = { target: { side: "others", pick: "highest", by: { stat: "defense" } }, do: [apply("guard"), apply("shield", { stacks: { scale: [{ ratio: 0.25, stat: "defense", of: "self" }] } })] };
  /**
   * Cover: another ally in a wind-up; with nobody else casting, the other ally with the lowest share of HP. "The one with the most wind-up left"
   * has no `by` in the schema, so among two casters it's the one lower in HP: the rule's fallback does the rest.
   */
  const cover: Partial<AbilityT> = { target: { side: "others", where: { casting: true }, ifNone: "any", pick: "lowest", by: "hp_share" } };
  abilityUp({
    id: "fortify", cls: "knight",
    power: "Comes round sooner.",
    a: { name: "Stone guard", text: "Guards the other ally with the most Defense, and gives it a Shield from the Knight's Defense.", builds: ["landslide"] },
    b: { name: "Cover", text: "Guards another ally in a wind-up. With nobody else casting, the other ally with the lowest share of HP.", builds: ["bonfire", "overflow", "lockdown"] },
    form: (v, _k, plus) => ({ ...(v === "a" ? stoneGuard : v === "b" ? cover : {}), ...(plus ? { cooldown: cd("medium", "fortify") } : {}) }),
  });
}

{
  const rallyTheWell: Partial<AbilityT> = { if: { side: "allies", where: { mpBelow: 50 } }, target: { side: "allies", where: { mpBelow: 50 }, pick: "all" }, do: [apply("clarity")] };
  const holdTheLine: Partial<AbilityT> = { do: [apply("taunt"), apply("hold_the_line")] };
  helper(kit("hold_the_line", "HOLD THE LINE", "Thorns up.", { duration: STATUS.taunt.duration, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }] }));
  abilityUp({
    id: "stand_fast", cls: "knight",
    power: "Costs less MP.",
    a: { name: "Rally the well", text: "Gives Clarity to every ally under half its MP. Waits until one is. No Taunt.", builds: ["overflow"] },
    b: { name: "Hold the line", text: "Taunts, and has Thorns for as long as the Taunt. No Clarity.", builds: ["toll"] },
    form: (v, _k, plus) => ({ ...(v === "a" ? rallyTheWell : v === "b" ? holdTheLine : {}), ...(plus ? { mp: 125 } : {}) }),
  });
}

{
  const bash = (ratio: number, extra: object = {}) => phys(from("max_hp", ratio), extra);
  const stun = { apply: [{ status: "stun" }] };
  const measured = (ratio: number): Partial<AbilityT> => ({
    if: { side: "foes", where: { casting: true } },
    target: { side: "foes", where: { casting: true, lacks: "stun" }, ifNone: "any", pick: "highest", by: { stats: ["attack"] } },
    do: [bash(ratio, stun)],
  });
  /** Crushing bash: from max HP and its Shield together, double; it reads the Shield and doesn't spend it. A random foe: no Stun to aim. */
  const crushing = (ratio: number): Partial<AbilityT> => ({
    target: "foe", cooldown: cd("long", "shield_bash"),
    do: [phys({ scale: [{ ratio, stat: "max_hp" }, { ratio, stacks: "shield", of: "self" }] })],
  });
  abilityUp({
    id: "shield_bash", cls: "knight",
    power: "Deals two fifths more damage.",
    a: { name: "Measured blow", text: "Waits for a foe to start a wind-up, then bashes the casting foe with the highest Attack, scaling from max HP, and Stuns it. The Stun holds the wind-up where it is.", builds: ["lockdown"] },
    b: { name: "Crushing bash", text: "Bashes a random foe for double, scaling from max HP and its current Shield together. No Stun. A longer cooldown.", builds: ["landslide"] },
    form: (v, k) => (v === "a" ? measured(0.29 * k) : v === "b" ? crushing(0.58 * k) : { do: [bash(0.29 * k, stun)] }),
  });
}
