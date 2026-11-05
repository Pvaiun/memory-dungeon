/** The Paladin's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, EffectT, StatusT, TargetRuleT } from "../../../src/schema.js";
import { from, stacks } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, both, cd, passiveUp, phys, r6 } from "./kit.js";

{
  const bonus = (ratio: number, when: object) => ({ boosts: both({ scale: [{ ratio, when, of: "target" }] }) as StatusT["boosts"] });
  passiveUp({
    id: "judgement", cls: "paladin",
    power: "The bonus is +70%, not half again.",
    a: { name: "Inquisition", text: "Its hits deal half again as much to foes with a debuff.", builds: ["lockdown", "bonfire", "toll"] },
    b: { name: "Sentence", text: "Its hits deal half again as much to the foe with the highest Attack.", builds: ["hunt"] },
    form: (v, _k, plus) => bonus(plus ? 70 : 50, v === "a" ? { debuffs: true } : v === "b" ? { top: { stats: ["attack"] } } : { buffs: true }),
  });
}

{
  const sanctum: Partial<AbilityT> = { mp: 1500, do: [apply("ward"), apply("shield", { stacks: { scale: [{ ratio: 0.25, stat: "attack", of: "self" }] } })] };
  const consecration: Partial<AbilityT> = { do: [apply("ward"), apply("burn", { stacks: stacks("few", "attack"), to: T.everyFoe })] };
  abilityUp({
    id: "sanctuary", cls: "paladin",
    power: "Comes round sooner.",
    a: { name: "Sanctum", text: "Ward and a Shield from Attack on every ally.", builds: ["phoenix", "harvest"] },
    b: { name: "Consecration", text: "Ward on every ally, and a few Burn on every foe.", builds: ["bonfire", "harvest"] },
    form: (v, _k, plus) => ({ ...(v === "a" ? sanctum : v === "b" ? consecration : {}), ...(plus ? { cooldown: cd("medium", "sanctuary") } : {}) }),
  });
}

{
  const heal = (ratio: number, to?: TargetRuleT): EffectT => ({ op: "heal", amount: from("attack", ratio), ...(to ? { to } : {}) });
  const absolve = (ratio: number): Partial<AbilityT> => ({ do: [{ op: "remove", label: "debuff" }, heal(ratio), { op: "remove", label: "debuff", to: T.otherLowestShareAlly }, heal(ratio, T.otherLowestShareAlly)] });
  /** Penance: both other allies, cleansed and healed for twice as much; the Paladin pays a fifth of each heal in HP, so the price counts the allies healed. */
  const penance = (ratio: number): Partial<AbilityT> => ({
    if: [{ side: "others", where: { hpBelow: 100 } }, { side: "self", where: { hpAtLeast: 35 } }],
    target: { side: "others", pick: "all" },
    do: [{ op: "remove", label: "debuff" }, heal(ratio), { op: "pay", hp: { scale: [{ ratio: r6(ratio / 5), count: "targets", times: { stat: "attack", of: "self" } }] }, to: "self" }],
  });
  const absolution = (ratio: number): Partial<AbilityT> => ({
    cooldown: cd("very_long", "absolve"), if: { side: "allies", where: { ko: true } }, target: T.koAlly,
    do: [{ op: "revive", hp: { scale: [{ ratio, stat: "max_hp", of: "target" }] } }],
  });
  abilityUp({
    id: "absolve", cls: "paladin",
    power: "Heals two fifths more; if it raises, the raised ally comes back with two fifths more HP.",
    a: { name: "Penance", text: "Cleanses and heals both other allies for twice as much, and pays a fifth of each heal in its own HP. Not itself.", builds: ["pact"], plus: "Heals two fifths more." },
    b: { name: "Absolution", text: "Waits until an ally falls, then revives a random knocked-out ally with a fifth of its HP.", builds: ["phoenix"], plus: "Raises with two fifths more HP." },
    form: (v, k) => (v === "a" ? penance(0.8 * k) : v === "b" ? absolution(0.2 * k) : absolve(0.4 * k)),
  });
}

{
  const hammer = (ratio: number): Partial<AbilityT> => ({ target: { ...T.highestAMFoe, where: { lacks: "stun" }, ifNone: "any" }, do: [phys(from("attack", ratio), { apply: [{ status: "stun" }] })] });
  const pyre = (ratio: number): Partial<AbilityT> => ({
    if: { side: "foes", where: { has: "burn" } }, target: { side: "foes", where: { has: "burn" }, pick: "all" },
    do: [phys(from("attack", ratio), { apply: [{ status: "burn", stacks: stacks("few", "attack") }] })],
  });
  abilityUp({
    id: "smite", cls: "paladin",
    power: "Deals two fifths more damage.",
    a: { name: "Hammer of dawn", text: "Damage to the foe with the highest Attack, which is Stunned. No Burn.", builds: ["lockdown", "landslide"] },
    b: { name: "Pyre of judgement", text: "Damage to every burning foe, half as hard, adding a few Burn to each. Waits until a foe burns.", builds: ["bonfire", "harvest"] },
    form: (v, k) =>
      v === "a" ? hammer(0.5 * k)
        : v === "b" ? pyre(0.25 * k)
          : { do: [phys(from("attack", 0.5 * k), { apply: [{ status: "burn", stacks: stacks("several", "attack") }] })] },
  });
}
