/** The Bard's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, NumT, ReactionT, TargetRuleT, ToT } from "../../../src/schema.js";
import { stacks, STATUS } from "../scale.js";
import { own } from "../pieces/kit.js";
import { abilityUp, apply, cd, passiveUp, phys, quarterOff, r6 } from "./kit.js";

{
  const share = (k: number): NumT => ({ scale: [{ ratio: r6(STATUS.refrain.share * k), amount: true }] });
  const RANDOM: TargetRuleT = { side: "allies", pick: "random" };
  const refrain = (heal: ToT, mp: ToT, k: number): ReactionT[] => [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "heal", amount: share(k), to: heal }, { op: "mp", amount: share(k), to: mp }] }];
  const harmony = (k: number) => refrain({ side: "allies", pick: "lowest", by: "hp_share" }, { side: "allies", pick: "lowest", by: "mp_share" }, k);
  const song = (k: number): ReactionT[] => [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("might", { stacks: own("few", "attack", k), to: RANDOM }), { op: "mp", amount: share(k), to: RANDOM }] }];
  passiveUp({
    id: "refrain", cls: "bard",
    power: "A bigger share: 42% of the damage dealt, not 30%, and two fifths more of any Might it gives.",
    a: { name: "Harmony", text: "Each basic attack that lands heals the ally with the lowest share of its HP and gives MP to the ally with the lowest share of its MP, each 30% of the damage dealt.", builds: ["overflow", "pact"],
      plus: "A bigger share: 42% of the damage dealt, not 30%." },
    b: { name: "Battle song", text: "Each basic attack that lands gives a random ally a few Might, and gives a random ally MP, 30% of the damage dealt.", builds: ["landslide", "cuts"],
      plus: "A bigger share: 42% of the damage dealt, not 30%, and two fifths more Might." },
    form: (v, k) => ({ reactions: v === "a" ? harmony(k) : v === "b" ? song(k) : refrain(RANDOM, RANDOM, k) }),
  });
}

{
  const might = (k: number) => apply("might", { stacks: stacks("few", "attack", k) });
  const lament = (k: number): Partial<AbilityT> => ({ if: { side: "allies", where: { hpBelow: 50 } }, target: { side: "allies", where: { hpBelow: 50 }, pick: "all" }, do: [might(k)] });
  const marching: Partial<AbilityT> = { do: [{ op: "cooldown", which: "basic", set: "ready" }] };
  abilityUp({
    id: "war_ballad", cls: "bard",
    power: "Two fifths more Might; if it gives none, it comes round sooner.",
    a: { name: "Lament", text: "Might to every ally below half its HP, twice as many. Waits until an ally is below half.", builds: ["pact", "phoenix"], plus: "Two fifths more Might." },
    b: { name: "Marching song", text: "Every ally's next basic attack comes at once. No Might.", builds: ["cuts", "ambush"], plus: "Comes round sooner." },
    form: (v, k, plus) =>
      v === "a" ? lament(2 * k)
        : v === "b" ? { ...marching, ...(plus ? { cooldown: quarterOff(cd("quick", "war_ballad")) } : {}) }
          : { do: [might(k)] },
  });
}

{
  const rubato: Partial<AbilityT> = { do: [apply("haste"), { op: "cooldown", which: "longest", set: { less: 4 } }] };
  /** Accelerando: Haste on the ally whose basic attack comes most often now (by `swing`, lowest first). */
  const accelerando: Partial<AbilityT> = { cooldown: cd("short", "allegro"), mp: 450, target: { side: "allies", pick: "lowest", by: "swing" } };
  abilityUp({
    id: "allegro", cls: "bard",
    power: "Comes round sooner.",
    a: { name: "Rubato", text: "Haste on every ally, and each ally's ability with the longest cooldown left comes 4 ticks closer.", builds: ["overflow", "lockdown"] },
    b: { name: "Accelerando", text: "Haste on the ally that attacks fastest.", builds: ["cuts"] },
    form: (v, _k, plus) =>
      v === "a" ? { ...rubato, ...(plus ? { cooldown: cd("medium", "allegro") } : {}) }
        : v === "b" ? { ...accelerando, ...(plus ? { cooldown: cd("quick", "allegro") } : {}) }
          : { cooldown: cd("medium", "allegro") },
  });
}

{
  /** Resonance: damage for each Shock a foe holds, read off the foe, on every foe that holds some. The Shock stays. */
  const resonance = (perStack: number): Partial<AbilityT> => ({
    if: { side: "foes", where: { has: "shock" } }, target: { side: "foes", where: { has: "shock" }, pick: "all" },
    do: [phys({ scale: [{ ratio: perStack, stacks: "shock", of: "target" }] })],
  });
  const lullaby: Partial<AbilityT> = { cooldown: cd("long", "thunder_chord"), do: [apply("slow")] };
  abilityUp({
    id: "thunder_chord", cls: "bard",
    power: "Two fifths more Shock; if it adds none, two fifths more damage, or if it deals none, it comes round sooner.",
    a: { name: "Resonance", text: "Damage to every foe for each Shock it holds. Adds no Shock. Waits until a foe holds Shock.", builds: ["harvest"], plus: "Two fifths more damage a stack." },
    b: { name: "Lullaby", text: "Slows every foe. No Shock.", builds: ["lockdown", "toll"], plus: "Comes round sooner." },
    form: (v, k, plus) =>
      v === "a" ? resonance(60 * k)
        : v === "b" ? { ...lullaby, ...(plus ? { cooldown: cd("medium", "thunder_chord") } : {}) }
          : { do: [apply("shock", { stacks: stacks("several", "attack", k) })] },
  });
}
