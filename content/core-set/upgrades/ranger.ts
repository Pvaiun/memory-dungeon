/** The Ranger's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, StatusT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { crit, from, KIT, stacks } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, hitOf, kit, passiveUp, phys, POWER, r6 } from "./kit.js";

{
  const crits = (n: number): Partial<StatusT> => ({ crits: [{ tag: "basic", chance: crit(n) }] });
  const quarry: Partial<StatusT> = { aim: { rule: { side: "foes", pick: "lowest", by: "hp_share" } } };
  /** Quick draw: each crit readies its next basic attack at once; the swing's recovery still passes between two. */
  const quickDraw: Partial<StatusT> = { reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [{ op: "cooldown", which: "basic", set: "ready", to: "holder" }] }] };
  passiveUp({
    id: "hunters_eye", cls: "ranger",
    power: "Its basic attacks crit more often still: three steps, not two.",
    a: { name: "Quarry", text: "Basic attacks ignore Taunt, crit more often, and go to the foe with the lowest share of max HP.", serves: "Hunt 1 ●●●" },
    b: { name: "Quick draw", text: "Basic attacks ignore Taunt and crit more often. Each crit makes its next basic attack come at once.", serves: "Cuts 2 ●●●, Hunt ●● ⚙ emptied quiver (key)" },
    form: (v, _k, plus) => ({ seek: "basic", ...crits(plus ? KIT.hunterCrit + 1 : KIT.hunterCrit), ...(v === "a" ? quarry : v === "b" ? quickDraw : {}) }),
  });
}

{
  const arrow = (word: "several" | "many", k: number) => phys(from("attack", 0.29), { apply: [{ status: "bleed", stacks: stacks(word, "attack", k) }] });
  const deep = (k: number): Partial<AbilityT> => ({ target: T.mostFoe("bleed"), do: [arrow("many", k)] });
  /** Barbed volley: a light arrow at every foe, each adding a few Bleed, at a rung up (the step Whipping vines took going wide). */
  const volley = (k: number): Partial<AbilityT> => ({ target: T.everyFoe, cooldown: cd("short", "barbed_arrow"), mp: 325, do: [phys(hitOf("attack", "light"), { apply: [{ status: "bleed", stacks: stacks("few", "attack", k) }] })] });
  abilityUp({
    id: "barbed_arrow", cls: "ranger",
    power: "Adds 40% more Bleed.",
    a: { name: "Deep barbs", text: "A barbed arrow at the foe with the most Bleed, adding many.", builds: ["hunt", "cuts"] },
    b: { name: "Barbed volley", text: "An arrow at every foe: each deals light damage that scales from Attack and adds a few Bleed; stacks scale from Attack.", serves: "Cuts 2 ●●●, Hunt ● ⚙ red rain (half), emptied quiver (half)" },
    form: (v, k) => (v === "a" ? deep(k) : v === "b" ? volley(k) : { do: [arrow("several", k)] }),
  });
}

{
  const pinning = (ratio: number): Partial<AbilityT> => ({ target: T.highestAMFoe, do: [phys(from("attack", ratio), { apply: [{ status: "slow" }] })] });
  /** Hail: the arrow carries no Chill; a few Chill (half the word, as Frost arrow's own) lands on every foe. */
  const hail = (k: number): Partial<AbilityT> => ({ do: [phys(from("attack", 0.29)), apply("chill", { stacks: stacks("few", "attack", 0.5 * k), to: T.everyFoe })] });
  abilityUp({
    id: "frost_arrow", cls: "ranger",
    power: "Adds 40% more Chill; if it adds none, it deals 40% more damage.",
    a: { name: "Pinning arrow", text: "A quick arrow at the foe with the highest Attack, which is Slowed. No Chill.", builds: [], plus: "Deals 40% more damage." },
    b: { name: "Hail", text: "A quick arrow at the foe with the most Chill, and a few Chill on every foe; stacks scale from Attack.", serves: "Snap 1 ●●● ⚙ firecracker (half)", plus: "Adds 40% more Chill." },
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
    power: "Adds 40% more Sunder; if it adds none, it deals 40% more damage.",
    a: { name: "Armor breaker", text: "An arrow at the foe with the most Defense, adding several Sunder.", builds: ["cuts", "landslide"], plus: "Adds 40% more Sunder." },
    b: { name: "Gutting arrow", text: "An arrow at the foe with the lowest HP. 50% more below 50% of its HP, double below 25%. No Sunder.", builds: ["hunt"], plus: "Deals 40% more damage." },
    form: (v, k) => (v === "a" ? breaker(k) : v === "b" ? gutting(k) : { do: [phys(from("attack", 0.5), { apply: [{ status: "sunder", stacks: stacks("few", "attack", k) }] })] }),
  });
}
