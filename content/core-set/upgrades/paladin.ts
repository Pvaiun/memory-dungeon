/** The Paladin's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit-1.ts. */
import type { EffectT, StatusT, TargetRuleT } from "../../../src/schema.js";
import { from, stacks } from "../scale.js";
import { T } from "../classes.js";
import { abilityUpgrade, apply, both, cd, type Changes, magic, passiveUpgrade, r6, tag, ups } from "./kit-1.js";

// ═══ Paladin ═════════════════════════════════════════════════════════════════

{
  const bonus = (ratio: number, when: object) => ({ boosts: both({ scale: [{ ratio, when, of: "target" }] }) as StatusT["boosts"] });
  ups.push(passiveUpgrade("paladin", "judgement", {
    power: "The bonus is +70%, not half again.",
    a: { name: "Inquisition", text: "Its hits deal half again as much to foes with a debuff." },
    b: { name: "Sentence", text: "Its hits deal half again as much to the foe with the highest Attack or Magic." },
    p: { text: "Hits deal 70% more to foes with a buff.", ...bonus(70, { buffs: true }) },
    va: { text: "Hits deal half again as much to foes with a debuff.", ...bonus(50, { debuffs: true }) },
    vb: { text: "Hits deal half again as much to the foe with the highest Attack or Magic.", ...bonus(50, { top: { stats: ["attack", "magic"] } }) },
    ap: { text: "Hits deal 70% more to foes with a debuff.", ...bonus(70, { debuffs: true }) },
    bp: { text: "Hits deal 70% more to the foe with the highest Attack or Magic.", ...bonus(70, { top: { stats: ["attack", "magic"] } }) },
  }));
  tag("judgement", ["lockdown", "bonfire", "toll"], ["hunt"]);
}

{
  const sanctum: Changes = { mp: 1500, do: [apply("ward"), apply("shield", { stacks: { scale: [{ ratio: 0.25, stat: "magic", of: "self" }] } })] };
  const consecration: Changes = { do: [apply("ward"), apply("burn", { stacks: stacks("few", "magic"), to: T.everyFoe })] };
  ups.push(abilityUpgrade("paladin", "sanctuary", {
    power: "Comes round sooner.",
    a: { name: "Sanctum", text: "Ward and a Shield from Magic on every ally." },
    b: { name: "Consecration", text: "Ward on every ally, and a few Burn on every foe." },
    p: { cooldown: cd("medium", "sanctuary") },
    va: sanctum,
    vb: consecration,
    ap: { ...sanctum, cooldown: cd("medium", "sanctuary") },
    bp: { ...consecration, cooldown: cd("medium", "sanctuary") },
  }));
  tag("sanctuary", ["phoenix", "harvest"], ["bonfire", "harvest"]);
}

{
  const heal = (ratio: number, to?: TargetRuleT): EffectT => ({ op: "heal", amount: from("magic", ratio), ...(to ? { to } : {}) });
  const absolve = (ratio: number): Changes => ({ do: [{ op: "remove", label: "debuff" }, heal(ratio), { op: "remove", label: "debuff", to: T.otherLowestShareAlly }, heal(ratio, T.otherLowestShareAlly)] });
  /** Penance: both other allies, cleansed and healed for twice as much; the Paladin pays a fifth of each heal in HP, so the price counts the allies healed. */
  const penance = (ratio: number): Changes => ({
    if: [{ side: "others", where: { hpBelow: 100 } }, { side: "self", where: { hpAtLeast: 35 } }],
    target: { side: "others", pick: "all" },
    do: [{ op: "remove", label: "debuff" }, heal(ratio), { op: "pay", hp: { scale: [{ ratio: r6(ratio / 5), count: "targets", times: { stat: "magic", of: "self" } }] }, to: "self" }],
  });
  const absolution = (ratio: number): Changes => ({
    cooldown: cd("very_long", "absolve"), if: { side: "allies", where: { ko: true } }, target: T.koAlly,
    do: [{ op: "revive", hp: { scale: [{ ratio, stat: "max_hp", of: "target" }] } }],
  });
  ups.push(abilityUpgrade("paladin", "absolve", {
    power: "Heals two fifths more (Absolution: raises with two fifths more HP).",
    a: { name: "Penance", text: "Cleanses and heals both other allies for twice as much, and pays a fifth of each heal in its own HP. Not itself." },
    b: { name: "Absolution", text: "Waits until an ally falls, then revives a random knocked-out ally with a fifth of its HP." },
    p: absolve(0.56),
    va: penance(0.8),
    vb: absolution(0.2),
    ap: penance(1.12),
    bp: absolution(0.28),
  }));
  tag("absolve", ["pact"], ["phoenix"]);
}

{
  const hammer = (ratio: number): Changes => ({ target: { ...T.highestAMFoe, where: { lacks: "stun" }, ifNone: "any" }, do: [magic(from("magic", ratio), { apply: [{ status: "stun" }] })] });
  const pyre = (ratio: number): Changes => ({
    if: { side: "foes", where: { has: "burn" } }, target: { side: "foes", where: { has: "burn" }, pick: "all" },
    do: [magic(from("magic", ratio), { apply: [{ status: "burn", stacks: stacks("few", "magic") }] })],
  });
  ups.push(abilityUpgrade("paladin", "smite", {
    power: "Deals two fifths more damage.",
    a: { name: "Hammer of dawn", text: "Magical damage to the foe with the highest Attack or Magic, which is Stunned. No Burn." },
    b: { name: "Pyre of judgement", text: "Magical damage to every burning foe, half as hard, adding a few Burn to each. Waits until a foe burns." },
    p: { do: [magic(from("magic", 0.7), { apply: [{ status: "burn", stacks: stacks("several", "magic") }] })] },
    va: hammer(0.5),
    vb: pyre(0.25),
    ap: hammer(0.7),
    bp: pyre(0.35),
  }));
  tag("smite", ["lockdown", "landslide"], ["bonfire", "harvest"]);
}
