/** The Knight's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, EffectT, ReactionT } from "../../../src/schema.js";
import { from, SPECIAL, stacks, STATUS } from "../scale.js";
import { abilityUp, apply, cd, helper, kit, ofHolder, passiveUp, phys } from "./kit.js";
import { VANGUARD_SHIELD } from "../classes.js";

const vanguardShield = (ratio: number): EffectT => apply("shield", { stacks: ofHolder(ratio, "max_hp"), to: "holder" });
/** Stonewall: the other ally with the lowest Aggro starts behind a Shield of the Knight's size, up to half its own max HP (the Shield's own cap). */
const stonewallShield = (ratio: number): EffectT => apply("shield", { stacks: ofHolder(ratio, "max_hp"), to: { side: "others", pick: "lowest", by: { stat: "aggro" } } });
const grudge: ReactionT = { on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [apply("taunt", { to: "holder" }), apply("guard", { to: "holder" })] };
passiveUp({
  id: "vanguard", cls: "knight",
  power: "A Shield 40% bigger.",
  a: { name: "Stonewall", text: "Starts every fight behind a Shield from its max HP. The other ally with the lowest Aggro starts behind a Shield of the same size.", builds: ["landslide", "hunt"] },
  b: { name: "Grudge", text: "Starts every fight behind a Shield from its max HP. When its Shield breaks, it Taunts and is Guarded.", builds: ["toll"] },
  form: (v, k) => ({
    reactions: [
      { on: { event: "fight_start" }, do: v === "a" ? [vanguardShield(VANGUARD_SHIELD * k), stonewallShield(VANGUARD_SHIELD * k)] : [vanguardShield(VANGUARD_SHIELD * k)] },
      ...(v === "b" ? [grudge] : []),
    ],
  }),
});

{
  /** Stone guard: the other ally with the most Defense, Guarded and given a Shield of a quarter of the Knight's Defense, read when it lands. */
  const stoneGuard: Partial<AbilityT> = { target: { side: "others", pick: "highest", by: { stat: "defense" } }, do: [apply("guard"), apply("shield", { stacks: { scale: [{ ratio: 0.25, stat: "defense", of: "self" }] } })] };
  /** Valor: Guards itself and gains several Might from Attack: the sword finally has something in the kit to feed. */
  const valor: Partial<AbilityT> = { target: "self", do: [apply("guard"), apply("might", { stacks: stacks("several", "attack") })] };
  abilityUp({
    id: "fortify", cls: "knight",
    power: "Comes round sooner.",
    a: { name: "Stone guard", text: "Guards the other ally with the most Defense, and gives it a Shield from the Knight's Defense.", builds: ["landslide"] },
    b: { name: "Valor", text: "Guards itself and gains several Might; stacks scale from Attack.", builds: ["landslide"] },
    form: (v, _k, plus) => ({ ...(v === "a" ? stoneGuard : v === "b" ? valor : {}), ...(plus ? { cooldown: cd("medium", "fortify") } : {}) }),
  });
}

{
  const rallyTheWell: Partial<AbilityT> = { if: { side: "allies", where: { mpBelow: 50 } }, target: { side: "allies", where: { mpBelow: 50 }, pick: "all" }, do: [apply("clarity")] };
  const holdTheLine: Partial<AbilityT> = { do: [apply("taunt"), apply("hold_the_line")] };
  helper(kit("hold_the_line", "HOLD THE LINE", "Thorns up.", { duration: STATUS.taunt.duration, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }] }));
  abilityUp({
    id: "stand_fast", cls: "knight",
    power: "Costs less MP.",
    a: { name: "Rally the well", text: "Gives Clarity to every ally under 50% of its max MP. Waits until one is. No Taunt.", serves: "Barrage 1 ●●● ⚙ mana as armour (half)" },
    b: { name: "Hold the line", text: "Taunts, and has Thorns for as long as the Taunt. No Clarity.", serves: "Toll 1 ●●● ⚙ goad (half)" },
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
    power: "Deals 40% more damage.",
    a: { name: "Measured blow", text: "Waits for a foe to start a wind-up, then bashes the casting foe with the highest Attack, scaling from max HP, and Stuns it. The Stun holds the wind-up where it is.", builds: [] },
    b: { name: "Crushing bash", text: "Bashes a random foe for double, scaling from max HP and its current Shield together. No Stun. A longer cooldown.", builds: ["landslide"] },
    form: (v, k) => (v === "a" ? measured(0.29 * k) : v === "b" ? crushing(0.58 * k) : { do: [bash(0.29 * k, stun)] }),
  });
}
