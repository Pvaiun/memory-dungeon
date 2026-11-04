/** The Cleric's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit-1.ts. */
import type { EffectT, NumT, ReactionT } from "../../../src/schema.js";
import { from, WINDUP } from "../scale.js";
import { T } from "../classes.js";
import { abilityUpgrade, apply, type Changes, DRAWN, helper, helpers, MORE, ofHolder, passiveUpgrade, removeBuff, tag, ups } from "./kit-1.js";

// ═══ Cleric ══════════════════════════════════════════════════════════════════

{
  const on = apply("last_rites_on", { to: "holder" });
  const off = removeBuff("last_rites_on");
  /** The base's pair, at a line: below it the cooldowns halve; healed back to it, they return. */
  const own = (line: number): ReactionT[] => [
    { on: { event: "hp_lost" }, do: [apply("last_rites_on", { to: { side: "self", where: { hpBelow: line } } })] },
    { on: { event: "healed" }, do: [removeBuff("last_rites_on", { side: "self", where: { hpAtLeast: line } })] },
  ];
  /** Shared rites: the same, read off the whole side, whenever anyone's HP moves, falls or returns. */
  const shared = (line: number): ReactionT[] => {
    const low = { side: "allies" as const, where: { hpBelow: line } };
    const none = { side: "allies" as const, where: { hpBelow: line }, atMost: 0 };
    return [
      { on: { event: "hp_lost" }, if: low, do: [on] },
      { on: { event: "hp_lost", whose: "ally" }, if: low, do: [on] },
      { on: { event: "revived" }, if: low, do: [on] },
      { on: { event: "revived", whose: "ally" }, if: low, do: [on] },
      { on: { event: "healed" }, if: none, do: [off] },
      { on: { event: "healed", whose: "ally" }, if: none, do: [off] },
      { on: { event: "ko", whose: "ally" }, if: none, do: [off] },
    ];
  };
  const rite: ReactionT = { on: { event: "ko", whose: "ally" }, do: [apply("rite_of_passage", { to: "holder" })] };
  helpers.push(helper("rite_of_passage", "RITE OF PASSAGE", "Cooldowns halved.", { duration: 20, stats: [{ stat: "cooldown_reduction", flat: 100 }] }));
  ups.push(passiveUpgrade("cleric", "last_rites", {
    power: "The line is at 40% of max HP, not 30%.",
    a: { name: "Shared rites", text: "While it or any ally is below 30% of max HP, its cooldowns are halved." },
    b: { name: "Rite of passage", text: "Below 30% of its max HP, its cooldowns are halved. When an ally falls, they're halved for 20 ticks too." },
    p: { text: "Cooldowns halved below 40% HP.", reactions: own(40) },
    va: { text: "Cooldowns halved while it or any ally is below 30% HP.", reactions: shared(30) },
    vb: { text: "Cooldowns halved below 30% HP, and for 20 ticks after an ally falls.", reactions: [...own(30), rite] },
    ap: { text: "Cooldowns halved while it or any ally is below 40% HP.", reactions: shared(40) },
    bp: { text: "Cooldowns halved below 40% HP, and for 20 ticks after an ally falls.", reactions: [...own(40), rite] },
  }));
  tag("last_rites", ["toll", "phoenix", "pact"], ["phoenix"]);
}

{
  const font: Changes = { do: [{ op: "remove", label: "debuff" }, apply("regen"), apply("clarity")] };
  const anchor: Changes = { target: DRAWN };
  ups.push(abilityUpgrade("cleric", "renew", {
    power: "Costs less MP.",
    a: { name: "Font", text: "Cleanses an ally with a debuff and gives it Regen and Clarity; with nobody debuffed, the ally with the lowest share of HP." },
    b: { name: "Anchor's blessing", text: "Cleanses the ally foes are most drawn to and gives it Regen." },
    p: { mp: 450 },
    va: font,
    vb: anchor,
    ap: { ...font, mp: 450 },
    bp: { ...anchor, mp: 450 },
  }));
  tag("renew", ["overflow"], ["toll"]);
}

{
  const heal = (ratio: number): EffectT => ({ op: "heal", amount: from("magic", ratio) });
  const triage = (ratio: number): Changes => ({ if: { side: "allies", where: { hpBelow: 40 } }, do: [heal(ratio)] });
  /** Battle prayer: the next basic attack carries the heal's amount again as magical damage, once (Refresh: a second Cure doesn't add a second). */
  const prayer = (id: string, ratio: number) =>
    helper(id, "BATTLE PRAYER", "Its next basic attack deals extra magical damage.", {
      riders: [{ on: "basic", add: { type: "magical", amount: ofHolder(ratio, "magic") } }],
      reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [removeBuff(id)] }],
    });
  helpers.push(prayer("battle_prayer", 0.35), prayer("battle_prayer_plus", 0.49));
  ups.push(abilityUpgrade("cleric", "cure", {
    power: "Heals two fifths more.",
    a: { name: "Triage", text: "Waits until an ally is below 40% of its max HP, then heals it for twice as much." },
    b: { name: "Battle prayer", text: "Heals the ally with the lowest share of HP. Its next basic attack deals the same amount again as extra magical damage." },
    p: { do: [heal(0.49)] },
    va: triage(0.7),
    vb: { do: [heal(0.35), apply("battle_prayer", { to: "self" })] },
    ap: triage(0.98),
    bp: { do: [heal(0.49), apply("battle_prayer_plus", { to: "self" })] },
  }));
  tag("cure", ["pact", "phoenix"], ["pact", "landslide"]);
}

{
  const raiseHp = (ratio: number): NumT => ({ scale: [{ ratio, stat: "max_hp", of: "target" }] });
  /** Martyr's raise: the revive reads the Cleric's HP first, then the Cleric pays half its current HP (a price, not damage). No MP. */
  const martyr = (ratio: number): Changes => ({
    mp: 0,
    do: [{ op: "revive", hp: { scale: [{ ratio, hp: "current", of: "self" }] } }, { op: "pay", hp: { scale: [{ ratio: 0.5, hp: "current", of: "self" }] }, to: "self" }],
  });
  /**
   * Ward of life: waits for either condition (`if: { any }`), a fallen ally or one below a third. Each part has its own target, and an
   * effect has no condition of its own, so when both hold it does both: it raises the fallen and shields the lowest ally below a third.
   */
  const ward = (raise: number, shield: number): Changes => ({
    cast: WINDUP.normal,
    if: { any: [{ side: "allies", where: { ko: true } }, { side: "allies", where: { hpBelow: 33 } }] },
    target: "self",
    do: [
      { op: "revive", hp: raiseHp(raise), to: T.koAlly },
      apply("shield", { stacks: { scale: [{ ratio: shield, stat: "max_hp", of: "target" }] }, to: { side: "allies", where: { hpBelow: 33 }, pick: "lowest", by: "hp_share" } }),
    ],
  });
  ups.push(abilityUpgrade("cleric", "raise", {
    power: "The raised ally comes back with two fifths more HP.",
    a: { name: "Martyr's raise", text: "Pays half its current HP to revive a random knocked-out ally with that much. Costs no MP." },
    b: { name: "Ward of life", text: "Waits until an ally is knocked out or below a third of its max HP. Revives a random knocked-out ally with half its HP, and gives the lowest ally below a third a Shield of a third of its max HP." },
    p: { do: [{ op: "revive", hp: raiseHp(0.7) }] },
    va: martyr(0.5),
    vb: ward(0.5, 1 / 3),
    ap: { ...martyr(0.7), text: "Pays half its current HP to revive a random knocked-out ally with two fifths more than that. Costs no MP." },
    bp: ward(0.7, (1 / 3) * MORE),
  }));
  tag("raise", ["pact", "phoenix"], ["toll", "pact"]);
}
