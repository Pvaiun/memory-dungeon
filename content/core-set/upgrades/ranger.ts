/** The Ranger's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, StatusT, TargetRuleT } from "../../../src/schema.js";
import { from, stacks } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, passiveUp, phys, r6 } from "./kit.js";

{
  const notTaunting: Partial<StatusT> = { boosts: [{ tag: "basic", pct: { scale: [{ ratio: 15, when: { lacks: "taunt" }, of: "target" }] } }] };
  const quarry: Partial<StatusT> = { aim: { rule: { side: "foes", pick: "lowest", by: "hp_share" } } };
  const overwatch: Partial<StatusT> = { aim: { rule: { side: "foes", where: { casting: true }, pick: "highest", by: { stats: ["attack", "magic"] } } } };
  passiveUp({
    id: "hunters_eye", cls: "ranger",
    power: "Its basic attacks also deal 15% more to foes that aren't Taunting.",
    a: { name: "Quarry", text: "Basic attacks ignore Taunt and go to the foe with the lowest share of its max HP.", builds: ["hunt"] },
    b: { name: "Overwatch", text: "Basic attacks ignore Taunt, and go to a foe in a wind-up when there is one.", builds: ["lockdown"] },
    form: (v, _k, plus) => ({ seek: "basic", ...(v === "a" ? quarry : v === "b" ? overwatch : {}), ...(plus ? notTaunting : {}) }),
  });
}

{
  const arrow = (word: "several" | "many", k: number) => phys(from("attack", 0.29), { apply: [{ status: "bleed", stacks: stacks(word, "attack", k) }] });
  const deep = (k: number): Partial<AbilityT> => ({ target: T.mostFoe("bleed"), do: [arrow("many", k)] });
  /** Scatter barbs: three different foes, a touch and a few Bleed each, as Chain lightning's two damage effects. */
  const scatter = (k: number): Partial<AbilityT> => {
    const barb = (to?: TargetRuleT) => phys(from("attack", 0.17), { apply: [{ status: "bleed", stacks: stacks("few", "attack", k) }], ...(to ? { to } : {}) });
    return { do: [barb(), barb({ side: "foes", pick: "random", count: 2, exclude: "targets" })] };
  };
  abilityUp({
    id: "barbed_arrow", cls: "ranger",
    power: "Adds two fifths more Bleed.",
    a: { name: "Deep barbs", text: "A barbed arrow at the foe with the most Bleed, adding many.", builds: ["hunt", "cuts"] },
    b: { name: "Scatter barbs", text: "Barbed arrows at three different foes, each a touch of damage and a few Bleed.", builds: ["harvest", "toll"] },
    form: (v, k) => (v === "a" ? deep(k) : v === "b" ? scatter(k) : { do: [arrow("several", k)] }),
  });
}

{
  const pinning = (ratio: number): Partial<AbilityT> => ({ target: T.highestAMFoe, do: [phys(from("attack", ratio), { apply: [{ status: "slow" }] })] });
  /** Hail: the arrow carries no Chill; one Chill (flat) lands on every foe. */
  const hail = (n: number): Partial<AbilityT> => ({ do: [phys(from("attack", 0.29)), apply("chill", { stacks: n, to: T.everyFoe })] });
  abilityUp({
    id: "frost_arrow", cls: "ranger",
    power: "Adds two fifths more Chill; if it adds none, it deals two fifths more damage.",
    a: { name: "Pinning arrow", text: "A quick arrow at the foe with the highest Attack or Magic, which is Slowed. No Chill.", builds: ["lockdown"], plus: "Deals two fifths more damage." },
    b: { name: "Hail", text: "A quick arrow at the foe with the most Chill, and one Chill on every foe.", builds: ["snap"], plus: "Adds two fifths more Chill." },
    form: (v, k) =>
      v === "a" ? pinning(0.29 * k)
        : v === "b" ? hail(k)
          : { do: [phys(from("attack", 0.29), { apply: [{ status: "chill", stacks: stacks("few", "attack", 0.5 * k) }] })] },
  });
}

{
  const breaker = (k: number): Partial<AbilityT> => ({ target: { side: "foes", pick: "highest", by: { stat: "armor" } }, do: [phys(from("attack", 0.5), { apply: [{ status: "sunder", stacks: stacks("several", "attack", k) }] })] });
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
    a: { name: "Armor breaker", text: "An arrow at the foe with the most Armor, adding several Sunder.", builds: ["cuts", "landslide"], plus: "Adds two fifths more Sunder." },
    b: { name: "Gutting arrow", text: "An arrow at the foe with the lowest HP. Half again as much below half its HP, double below a quarter. No Sunder.", builds: ["hunt"], plus: "Deals two fifths more damage." },
    form: (v, k) => (v === "a" ? breaker(k) : v === "b" ? gutting(k) : { do: [phys(from("attack", 0.5), { apply: [{ status: "sunder", stacks: stacks("few", "attack", k) }] })] }),
  });
}
