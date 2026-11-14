/** The Bard's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, NumT, ReactionT, TargetRuleT, ToT } from "../../../src/schema.js";
import { stacks, STATUS } from "../scale.js";
import { own } from "../pieces/kit.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, kit, passiveUp, r6 } from "./kit.js";

{
  const share = (k: number): NumT => ({ scale: [{ ratio: r6(STATUS.refrain.share * k), amount: true }] });
  const RANDOM: TargetRuleT = { side: "allies", pick: "random" };
  const refrain = (heal: ToT, mp: ToT, k: number): ReactionT[] => [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "heal", amount: share(k), to: heal }, { op: "mp", amount: share(k), to: mp }] }];
  const harmony = (k: number) => refrain({ side: "allies", pick: "lowest", by: "hp_share" }, { side: "allies", pick: "lowest", by: "mp_share" }, k);
  const song = (k: number): ReactionT[] => [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("might", { stacks: own("few", "attack", k), to: RANDOM }), { op: "mp", amount: share(k), to: RANDOM }] }];
  passiveUp({
    id: "refrain", cls: "bard",
    power: "42% of the damage, not 30%; +40% to any Might.",
    a: { name: "Harmony", text: "Basic attacks heal the ally with the lowest HP% and give MP to the ally with the lowest MP%, each 30% of the damage.", builds: ["barrage", "pact"],
      plus: "42% of the damage, not 30%." },
    b: { name: "Battle song", text: "Basic attacks give a random ally Might, and a random ally MP (30% of the damage).", builds: ["landslide", "cuts"] },
    form: (v, k) => ({ reactions: v === "a" ? harmony(k) : v === "b" ? song(k) : refrain(RANDOM, RANDOM, k) }),
  });
}

{
  const might = (k: number) => apply("might", { stacks: stacks("few", "attack", k) });
  const lament = (k: number): Partial<AbilityT> => ({ if: { side: "allies", where: { hpBelow: 50 } }, target: { side: "allies", where: { hpBelow: 50 }, pick: "all" }, do: [might(k)] });
  /** Rousing chorus: all its Might, three times as many, on the one whose basic attack comes slowest (by `swing`, the highest), spent slowest. */
  const chorus = (k: number): Partial<AbilityT> => ({ do: [apply("might", { stacks: stacks("few", "attack", 3 * k), to: { side: "allies", pick: "highest", by: "swing" } })] });
  abilityUp({
    id: "war_ballad", cls: "bard",
    power: "+40% Might.", shown: true,
    a: { name: "Lament", text: "Might to every ally below 50% HP.", serves: "Pact 2 ●●● ⚙ brink (half)" },
    b: { name: "Rousing chorus", text: "All its Might to the ally with the slowest basic attack.", serves: "Landslide 2 ●●●, Hunt ●" },
    form: (v, k) => (v === "a" ? lament(2 * k) : v === "b" ? chorus(k) : { do: [might(k)] }),
  });
}

{
  /** Rubato: Haste, and each ally's ability nearest to ready made ready (an ability's own `soonest` never picks itself on its caster). */
  const rubato: Partial<AbilityT> = { do: [apply("haste"), { op: "cooldown", which: "soonest", set: "ready" }] };
  /** Dirge: tempo taken from the foes: Slow on every foe in place of Haste on the party. */
  const dirge: Partial<AbilityT> = { target: T.everyFoe, do: [apply("slow")] };
  abilityUp({
    id: "allegro", cls: "bard",
    // Cheaper too: sooner at the base's 650, the Bard spent its mana on Haste and War ballad went quiet (the party dealt 7% less).
    power: "Shorter cooldown; costs less MP.", shown: true,
    a: { name: "Rubato", text: "Haste on every ally, and readies each ally's ability nearest to ready.", serves: "Barrage 2 ●●●, Landslide ●" },
    b: { name: "Dirge", text: "Slows every foe. No Haste.", serves: "Toll 2 ●●, Snap ● ◆ foes do less, the slow" },
    form: (v, _k, plus) =>
      v === "a" ? { ...rubato, ...(plus ? { cooldown: cd("medium", "allegro") } : {}) }
        : v === "b" ? { ...dirge, ...(plus ? { cooldown: cd("medium", "allegro"), mp: 450 } : {}) }
          : { cooldown: cd("medium", "allegro"), mp: 450 },
  });
}

{
  /** Reprise: in place of the repeat, the ally's ability with the longest cooldown left is ready at once. */
  const reprise: Partial<AbilityT> = { do: [{ op: "cooldown", which: "longest", set: "ready" }] };
  /**
   * Cadenza: the Bard's own next 3 basic attacks come at once: three Refrains in a breath. The first is readied as the count
   * lands; each swing spends a count (the trigger, which runs first) and readies the next while any is left (the reaction's `if`).
   */
  const CADENZA = 3;
  // Its own swings: none of Encore's wait for another ally standing.
  const cadenza: Partial<AbilityT> = { target: "self", if: undefined, do: [apply("cadenza", { stacks: CADENZA })] };
  helper(kit("cadenza", "CADENZA", `Its next ${CADENZA} basic attacks come at once.`, {
    stacking: "intensity", cap: CADENZA,
    trigger: { on: { event: "action_resolve", kind: "basic" } }, drop: { count: 1 },
    reactions: [
      { on: { event: "status_gained", status: "cadenza" }, do: [{ op: "cooldown", which: "basic", set: "ready", to: "holder" }] },
      { on: { event: "action_resolve", kind: "basic" }, if: { side: "self", where: { stacks: { status: "cadenza", atLeast: 1 } } }, do: [{ op: "cooldown", which: "basic", set: "ready", to: "holder" }] },
    ],
  }));
  abilityUp({
    id: "encore", cls: "bard",
    power: "Shorter cooldown.", shown: true,
    a: { name: "Reprise", text: "Readies the ability with the most cooldown left on the other ally with the most Attack.", serves: "Barrage 2 ●●●, Landslide 2 ●●" },
    b: { name: "Cadenza", text: "Its own next 3 basic attacks come at once.", builds: ["cuts", "landslide"] },
    form: (v, _k, plus) => ({ ...(v === "a" ? reprise : v === "b" ? cadenza : {}), ...(plus ? { cooldown: cd("short", "encore") } : {}) }),
  });
}
