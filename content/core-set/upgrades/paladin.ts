/** The Paladin's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, EffectT, ReactionT, StatusT, TargetRuleT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { BURN_STACKS, from, stacks } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, both, cd, helper, kit, passiveUp, phys, r6 } from "./kit.js";

{
  /** The judge's bonus: half again (the power step +70%) on a foe with a debuff, or with a buff and no debuff, so one holding both isn't doubled. */
  const judged = (ratio: number): StatusT["boosts"] => both({ scale: [{ ratio, when: { debuffs: true }, of: "target" }, { ratio, when: { buffs: true, debuffs: false }, of: "target" }] }) as StatusT["boosts"];
  /** Zeal: its basic attacks add a few Burn to a judged foe (a reaction's `if` tests the foe hit for either). Two reactions, one each, so a foe with both gets one. */
  const zeal: ReactionT[] = [
    { on: { event: "hit_lands", kind: "basic" }, if: { unit: "other", where: { debuffs: true } }, do: [apply("burn", { stacks: own("few", "attack", BURN_STACKS), to: "other" })] },
    { on: { event: "hit_lands", kind: "basic" }, if: { unit: "other", where: { buffs: true, debuffs: false } }, do: [apply("burn", { stacks: own("few", "attack", BURN_STACKS), to: "other" })] },
  ];
  /** Verdict: its crit chance is tripled against a judged foe. Two rules, so a foe holding both a buff and a debuff is tripled once. */
  const verdict: StatusT["crits"] = [{ when: { debuffs: true }, times: 3 }, { when: { buffs: true, debuffs: false }, times: 3 }];
  passiveUp({
    id: "judgement", cls: "paladin",
    power: "+70%, not +50%.",
    a: { name: "Zeal", text: "Hits deal +50% to buffed or debuffed foes; basic attacks add Burn to them.", serves: "Bonfire 1 ●●●" },
    b: { name: "Verdict", text: "Hits deal +50% to buffed or debuffed foes, with ×3 Crit chance.", builds: ["hunt"] },
    form: (v, _k, plus) => ({
      boosts: judged(plus ? 70 : 50),
      ...(v === "a" ? { reactions: zeal } : {}),
      ...(v === "b" ? { crits: verdict } : {}),
    }),
  });
}

{
  const volley: EffectT = { op: "cooldown", which: "basic", set: "ready", to: T.everyAlly };
  const challenge: Partial<AbilityT> = { do: [apply("marked"), apply("taunt", { to: "self" })] };
  const swift: Partial<AbilityT> = { target: { side: "foes", pick: "lowest", by: "hp_share" } as TargetRuleT, do: [apply("marked"), volley, apply("swift_justice", { to: "self" })] };
  // Brought by the ability: a Mark the Paladin gave ending with its holder's fall readies Condemn (it still needs its MP).
  helper(kit("swift_justice", "SWIFT JUSTICE", "Condemn is ready again when its Marked foe falls.", {
    show: "sheet", unremovable: true,
    reactions: [{ on: { event: "status_ended", status: "marked", cause: ["ko"], whose: "foe", source: "holder" }, do: [{ op: "cooldown", which: { ability: ["condemn"] }, set: "ready", to: "self" }] }],
  }));
  abilityUp({
    id: "condemn", cls: "paladin",
    power: "Shorter cooldown.", shown: true,
    a: { name: "Challenge", text: "Marks the foe with the most Attack, and Taunts.", builds: ["toll", "landslide"] },
    b: { name: "Swift justice", text: "Marks the foe with the lowest HP%; every ally attacks at once. Ready again when its Marked foe falls.", serves: "Hunt 2 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key)" },
    form: (v, _k, plus) => ({ ...(v === "a" ? challenge : v === "b" ? swift : {}), ...(plus ? { cooldown: cd("short", "condemn") } : {}) }),
  });
}

{
  const heal = (ratio: number, to?: TargetRuleT): EffectT => ({ op: "heal", amount: from("attack", ratio), ...(to ? { to } : {}) });
  const absolve = (ratio: number): Partial<AbilityT> => ({ do: [{ op: "remove", label: "debuff" }, heal(ratio), { op: "remove", label: "debuff", to: T.otherLowestShareAlly }, heal(ratio, T.otherLowestShareAlly)] });
  /** Penance: both other allies, cleansed and healed for twice as much; the Paladin pays a fifth of each heal in HP, so the price counts the allies healed. */
  const penance = (ratio: number): Partial<AbilityT> => ({
    if: [{ side: "others", where: { hpBelow: 100 } }, { side: "self", where: { hpAtLeast: 35 } }],
    target: { side: "others", pick: "all" },
    // A tenth, not a fifth: the price is on the heal as cast, and under a cap on healing it cost three times what landed.
    do: [{ op: "remove", label: "debuff" }, heal(ratio), { op: "pay", hp: { scale: [{ ratio: r6(ratio / 10), count: "targets", times: { stat: "attack", of: "self" } }] }, to: "self" }],
  });
  const absolution = (ratio: number): Partial<AbilityT> => ({
    cooldown: cd("very_long", "absolve"), if: { side: "allies", where: { ko: true } }, target: T.koAlly,
    do: [{ op: "revive", hp: { scale: [{ ratio, stat: "max_hp", of: "target" }] } }],
  });
  abilityUp({
    id: "absolve", cls: "paladin",
    power: "+40% to heals and raises.", shown: true,
    a: { name: "Penance", text: "Cleanses and heals both other allies; pays 10% of each heal in HP.", builds: ["pact"] },
    b: { name: "Absolution", text: "Raises a random fallen ally at 20% HP.", builds: [], plus: "Raises at 28% HP, not 20%." },
    form: (v, k) => (v === "a" ? penance(0.8 * k) : v === "b" ? absolution(0.2 * k) : absolve(0.4 * k)),
  });
}

{
  /** Dawn's call: no blow; the judge turned support: every ally is Cleansed and gains Might (the power step: more Might). */
  const dawn = (k: number): Partial<AbilityT> => ({ target: T.everyAlly, do: [{ op: "remove", label: "debuff" }, apply("might", { stacks: stacks("few", "attack", k) })] });
  const pyre = (ratio: number): Partial<AbilityT> => ({
    if: { side: "foes", where: { has: "burn" } }, target: { side: "foes", where: { has: "burn" }, pick: "all" },
    do: [phys(from("attack", ratio), { apply: [{ status: "burn", stacks: stacks("few", "attack") }] })],
  });
  abilityUp({
    id: "smite", cls: "paladin",
    power: "+40% damage.", shown: true,
    a: { name: "Dawn's call", text: "No blow: Cleanses every ally and gives each Might.", serves: "Landslide 2 ●●, Barrage ● ◆ loading, the net" },
    b: { name: "Pyre of judgement", text: "Strikes every burning foe, adding Burn.", builds: ["bonfire", "storm"] },
    form: (v, k) =>
      v === "a" ? dawn(k)
        : v === "b" ? pyre(0.25 * k)
          : { do: [phys(from("attack", 0.5 * k), { apply: [{ status: "burn", stacks: stacks("several", "attack") }] })] },
  });
}
