/** The Ranger's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit-1.ts. */
import type { StatusT, TargetRuleT } from "../../../src/schema.js";
import { from, stacks } from "../scale.js";
import { T } from "../classes.js";
import { abilityUpgrade, apply, type Changes, MORE, passiveUpgrade, phys, r6, tag, ups } from "./kit-1.js";

// ═══ Ranger ══════════════════════════════════════════════════════════════════

{
  const notTaunting: Partial<StatusT> = { boosts: [{ tag: "basic", pct: { scale: [{ ratio: 15, when: { lacks: "taunt" }, of: "target" }] } }] };
  const quarry: Partial<StatusT> = { aim: { rule: { side: "foes", pick: "lowest", by: "hp_share" } } };
  const overwatch: Partial<StatusT> = { aim: { rule: { side: "foes", where: { casting: true }, pick: "highest", by: { stats: ["attack", "magic"] } } } };
  ups.push(passiveUpgrade("ranger", "hunters_eye", {
    power: "Its basic attacks also deal 15% more to foes that aren't Taunting.",
    a: { name: "Quarry", text: "Basic attacks ignore Taunt and go to the foe with the lowest share of its max HP." },
    b: { name: "Overwatch", text: "Basic attacks ignore Taunt, and go to a foe in a wind-up when there is one." },
    p: { text: "Basic attacks ignore Taunt, and deal 15% more to foes that aren't Taunting.", seek: "basic", ...notTaunting },
    va: { text: "Basic attacks ignore Taunt and go to the foe lowest in HP share.", seek: "basic", ...quarry },
    vb: { text: "Basic attacks ignore Taunt and go to a foe in a wind-up when there is one.", seek: "basic", ...overwatch },
    ap: { text: "Basic attacks ignore Taunt, go to the foe lowest in HP share, and deal 15% more to foes that aren't Taunting.", seek: "basic", ...quarry, ...notTaunting },
    bp: { text: "Basic attacks ignore Taunt, go to a foe in a wind-up when there is one, and deal 15% more to foes that aren't Taunting.", seek: "basic", ...overwatch, ...notTaunting },
  }));
  tag("hunters_eye", ["hunt"], ["lockdown"]);
}

{
  const arrow = (word: "several" | "many", k: number) => phys(from("attack", 0.29), { apply: [{ status: "bleed", stacks: stacks(word, "attack", k) }] });
  const deep = (k: number): Changes => ({ target: T.mostFoe("bleed"), do: [arrow("many", k)] });
  /** Scatter barbs: three different foes, a touch and a few Bleed each, as Chain lightning's two damage effects. */
  const scatter = (k: number): Changes => {
    const barb = (to?: TargetRuleT) => phys(from("attack", 0.17), { apply: [{ status: "bleed", stacks: stacks("few", "attack", k) }], ...(to ? { to } : {}) });
    return { do: [barb(), barb({ side: "foes", pick: "random", count: 2, exclude: "targets" })] };
  };
  ups.push(abilityUpgrade("ranger", "barbed_arrow", {
    power: "Adds two fifths more Bleed.",
    a: { name: "Deep barbs", text: "A barbed arrow at the foe with the most Bleed, adding many." },
    b: { name: "Scatter barbs", text: "Barbed arrows at three different foes, each a touch of damage and a few Bleed." },
    p: { do: [arrow("several", MORE)] },
    va: deep(1),
    vb: scatter(1),
    ap: deep(MORE),
    bp: scatter(MORE),
  }));
  tag("barbed_arrow", ["hunt", "cuts"], ["harvest", "toll"]);
}

{
  const pinning = (ratio: number): Changes => ({ target: T.highestAMFoe, do: [phys(from("attack", ratio), { apply: [{ status: "slow" }] })] });
  /** Hail: the arrow carries no Chill; one Chill (flat) lands on every foe. */
  const hail = (n: number): Changes => ({ do: [phys(from("attack", 0.29)), apply("chill", { stacks: n, to: T.everyFoe })] });
  ups.push(abilityUpgrade("ranger", "frost_arrow", {
    power: "Adds two fifths more Chill (Pinning arrow: deals two fifths more damage).",
    a: { name: "Pinning arrow", text: "A quick arrow at the foe with the highest Attack or Magic, which is Slowed. No Chill." },
    b: { name: "Hail", text: "A quick arrow at the foe with the most Chill, and one Chill on every foe." },
    p: { do: [phys(from("attack", 0.29), { apply: [{ status: "chill", stacks: stacks("few", "attack", 0.5 * MORE) }] })] },
    va: pinning(0.29),
    vb: hail(1),
    ap: pinning(0.406),
    bp: { ...hail(MORE), text: "A quick arrow at the foe with the most Chill, and a little more than one Chill on every foe." },
  }));
  tag("frost_arrow", ["lockdown"], ["snap"]);
}

{
  const breaker = (k: number): Changes => ({ target: { side: "foes", pick: "highest", by: { stat: "armor" } }, do: [phys(from("attack", 0.5), { apply: [{ status: "sunder", stacks: stacks("several", "attack", k) }] })] });
  /** Gutting arrow: a normal hit, half again below half the target's HP, double below a quarter. `times` reads the Ranger's Attack. */
  const gutting = (k: number): Changes => ({
    target: T.lowestHpFoe,
    do: [phys({ scale: [
      { ratio: r6(0.5 * k), stat: "attack" },
      { ratio: r6(0.25 * k), when: { hpBelow: 50 }, of: "target", times: { stat: "attack", of: "self" } },
      { ratio: r6(0.25 * k), when: { hpBelow: 25 }, of: "target", times: { stat: "attack", of: "self" } },
    ] })],
  });
  ups.push(abilityUpgrade("ranger", "rending_arrow", {
    power: "Adds two fifths more Sunder (Gutting arrow: deals two fifths more damage).",
    a: { name: "Armor breaker", text: "An arrow at the foe with the most Armor, adding several Sunder." },
    b: { name: "Gutting arrow", text: "An arrow at the foe with the lowest HP. Half again as much below half its HP, double below a quarter. No Sunder." },
    p: { do: [phys(from("attack", 0.5), { apply: [{ status: "sunder", stacks: stacks("few", "attack", MORE) }] })] },
    va: breaker(1),
    vb: gutting(1),
    ap: breaker(MORE),
    bp: gutting(MORE),
  }));
  tag("rending_arrow", ["cuts", "landslide"], ["hunt"]);
}
