/** The Ranger's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, StatusT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { crit, from, KIT, stacks } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, helper, kit, passiveUp, phys, POWER, r6 } from "./kit.js";

{
  const crits = (n: number): Partial<StatusT> => ({ crits: [{ tag: "basic", chance: crit(n) }] });
  const quarry: Partial<StatusT> = { aim: { rule: { side: "foes", pick: "lowest", by: "hp_share" } } };
  /** Quick draw: each crit readies its next basic attack at once; the swing's recovery still passes between two. */
  const quickDraw: Partial<StatusT> = { reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [{ op: "cooldown", which: "basic", set: "ready", to: "holder" }] }] };
  passiveUp({
    id: "hunters_eye", cls: "ranger",
    power: "Its basic attacks crit more often still: three steps, not two.",
    a: { name: "Quarry", text: "Basic attacks ignore Taunt, crit more often, and go to the foe with the lowest share of its max HP.", builds: ["hunt"] },
    b: { name: "Quick draw", text: "Basic attacks ignore Taunt and crit more often. Each crit makes its next basic attack come at once.", builds: ["cuts", "hunt"] },
    form: (v, _k, plus) => ({ seek: "basic", ...crits(plus ? KIT.hunterCrit + 1 : KIT.hunterCrit), ...(v === "a" ? quarry : v === "b" ? quickDraw : {}) }),
  });
}

{
  const arrow = (word: "several" | "many", k: number) => phys(from("attack", 0.29), { apply: [{ status: "bleed", stacks: stacks(word, "attack", k) }] });
  const deep = (k: number): Partial<AbilityT> => ({ target: T.mostFoe("bleed"), do: [arrow("many", k)] });
  /** Barbed quiver: no arrow; for a while its basic attacks add a few Bleed (from Attack). The skirmisher's version. */
  const QUIVER = 20;
  helper(kit("barbed_quiver", "BARBED QUIVER", "Its basic attacks add a few Bleed.", { duration: QUIVER, reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("bleed", { stacks: own("few", "attack"), to: "other" })] }] }));
  helper(kit("barbed_quiver_plus", "BARBED QUIVER", "Its basic attacks add a few Bleed.", { duration: QUIVER, reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("bleed", { stacks: own("few", "attack", POWER), to: "other" })] }] }));
  abilityUp({
    id: "barbed_arrow", cls: "ranger",
    power: "Adds two fifths more Bleed.",
    a: { name: "Deep barbs", text: "A barbed arrow at the foe with the most Bleed, adding many.", builds: ["hunt", "cuts"] },
    b: { name: "Barbed quiver", text: "No arrow: for a while, its basic attacks add a few Bleed.", builds: ["cuts", "toll"] },
    form: (v, k, plus) => (v === "a" ? deep(k) : v === "b" ? { target: "self", do: [apply(plus ? "barbed_quiver_plus" : "barbed_quiver")] } : { do: [arrow("several", k)] }),
  });
}

{
  const pinning = (ratio: number): Partial<AbilityT> => ({ target: T.highestAMFoe, do: [phys(from("attack", ratio), { apply: [{ status: "slow" }] })] });
  /** Hail: the arrow carries no Chill; one Chill (flat) lands on every foe. */
  const hail = (n: number): Partial<AbilityT> => ({ do: [phys(from("attack", 0.29)), apply("chill", { stacks: n, to: T.everyFoe })] });
  abilityUp({
    id: "frost_arrow", cls: "ranger",
    power: "Adds two fifths more Chill; if it adds none, it deals two fifths more damage.",
    a: { name: "Pinning arrow", text: "A quick arrow at the foe with the highest Attack, which is Slowed. No Chill.", builds: ["lockdown"], plus: "Deals two fifths more damage." },
    b: { name: "Hail", text: "A quick arrow at the foe with the most Chill, and one Chill on every foe.", builds: ["snap"], plus: "Adds two fifths more Chill." },
    form: (v, k) =>
      v === "a" ? pinning(0.29 * k)
        : v === "b" ? hail(k)
          : { do: [phys(from("attack", 0.29), { apply: [{ status: "chill", stacks: stacks("few", "attack", 0.5 * k) }] })] },
  });
}

{
  const breaker = (k: number): Partial<AbilityT> => ({ target: { side: "foes", pick: "highest", by: { stat: "defense" } }, do: [phys(from("attack", 0.5), { apply: [{ status: "sunder", stacks: stacks("several", "attack", k) }] })] });
  /** Gutting arrow: a normal hit, half again below half the target's HP, double below a quarter. `times` reads the Ranger's Attack. */
  const gutting = (k: number): Partial<AbilityT> => ({
    target: T.lowestHpFoe,
    do: [phys({ scale: [
      { ratio: r6(0.5 * k), stat: "attack" },
      { ratio: r6(0.25 * k), when: { hpBelow: 50 }, of: "target", times: { stat: "attack", of: "self" } },
      { ratio: r6(0.25 * k), when: { hpBelow: 25 }, of: "target", times: { stat: "attack", of: "self" } },
    ] })],
  });
  abilityUp({
    id: "rending_arrow", cls: "ranger",
    power: "Adds two fifths more Sunder; if it adds none, it deals two fifths more damage.",
    a: { name: "Armor breaker", text: "An arrow at the foe with the most Defense, adding several Sunder.", builds: ["cuts", "landslide"], plus: "Adds two fifths more Sunder." },
    b: { name: "Gutting arrow", text: "An arrow at the foe with the lowest HP. Half again as much below half its HP, double below a quarter. No Sunder.", builds: ["hunt"], plus: "Deals two fifths more damage." },
    form: (v, k) => (v === "a" ? breaker(k) : v === "b" ? gutting(k) : { do: [phys(from("attack", 0.5), { apply: [{ status: "sunder", stacks: stacks("few", "attack", k) }] })] }),
  });
}
