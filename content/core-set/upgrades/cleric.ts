/** The Cleric's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, EffectT, NumT, ReactionT } from "../../../src/schema.js";
import { from, WINDUP } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, DRAWN, helper, kit, ofHolder, passiveUp, removeMine } from "./kit.js";

{
  const on = apply("last_rites_on", { to: "holder" });
  const off = removeMine("last_rites_on");
  /** The base's pair, at a line: below it the cooldowns halve; healed back to it, they return. */
  const own = (line: number): ReactionT[] => [
    { on: { event: "hp_lost" }, do: [apply("last_rites_on", { to: { side: "self", where: { hpBelow: line } } })] },
    { on: { event: "healed" }, do: [removeMine("last_rites_on", "buff", { side: "self", where: { hpAtLeast: line } })] },
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
  helper(kit("rite_of_passage", "RITE OF PASSAGE", "Cooldowns halved.", { duration: 20, stats: [{ stat: "cooldown_reduction", flat: 100 }] }));
  passiveUp({
    id: "last_rites", cls: "cleric",
    power: "At 40% HP, not 30%.",
    a: { name: "Shared rites", text: "While any ally is below 30% HP: cooldowns halved.", serves: "Pact 2 ●●● ⚙ brink (half)" },
    b: { name: "Rite of passage", text: "Below 30% HP, and for 20 ticks after an ally falls: cooldowns halved.", builds: [] },
    form: (v, _k, plus) => {
      const line = plus ? 40 : 30;
      return { reactions: v === "a" ? shared(line) : v === "b" ? [...own(line), rite] : own(line) };
    },
  });
}

{
  const font: Partial<AbilityT> = { do: [{ op: "remove", label: "debuff" }, apply("regen"), apply("clarity")] };
  const anchor: Partial<AbilityT> = { target: DRAWN };
  abilityUp({
    id: "renew", cls: "cleric",
    power: "Costs less MP.", shown: true,
    a: { name: "Font", text: "Cleanses the lowest debuffed ally (else the lowest) and gives it Regen and Clarity.", builds: ["barrage"] },
    b: { name: "Anchor's blessing", text: "Cleanses the ally foes are drawn to and gives it Regen.", builds: ["toll"] },
    form: (v, _k, plus) => ({ ...(v === "a" ? font : v === "b" ? anchor : {}), ...(plus ? { mp: 450 } : {}) }),
  });
}

{
  const heal = (ratio: number): EffectT => ({ op: "heal", amount: from("attack", ratio) });
  /** Triage heals from the Cleric's own max HP, twice Cure's size at the line: the mender gives of its body. */
  const TRIAGE = 1.0;
  const triage = (k: number): Partial<AbilityT> => ({ if: { side: "allies", where: { hpBelow: 40 } }, do: [{ op: "heal", amount: from("max_hp", TRIAGE * k) }] });
  /** Battle prayer: the next basic attack carries the heal's amount again as damage, once (Refresh: a second Cure doesn't add a second). */
  const prayer = (id: string, ratio: number) =>
    kit(id, "BATTLE PRAYER", "Next basic attack deals extra damage.", {
      riders: [{ on: "basic", add: { type: "physical", amount: ofHolder(ratio, "attack") } }],
      reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [removeMine(id)] }],
    });
  helper(prayer("battle_prayer", 0.35));
  helper(prayer("battle_prayer_plus", 0.49));
  abilityUp({
    id: "cure", cls: "cleric",
    power: "+40% healing.", shown: true,
    a: { name: "Triage", text: "Heals the lowest ally; waits until one is below 40% HP.", builds: ["pact"] },
    b: { name: "Battle prayer", text: "Heals the lowest ally. Its next basic attack deals that much extra.", builds: ["pact", "landslide"] },
    form: (v, k, plus) =>
      v === "a" ? triage(k)
        : v === "b" ? { do: [heal(0.35 * k), apply(plus ? "battle_prayer_plus" : "battle_prayer", { to: "self" })] }
          : { do: [heal(0.35 * k)] },
  });
}

{
  const raiseHp = (ratio: number): NumT => ({ scale: [{ ratio, stat: "max_hp", of: "target" }] });
  /** Martyr's raise: the revive reads the Cleric's HP first, then the Cleric pays half its current HP (a price, not damage). No MP. */
  const martyr = (ratio: number): Partial<AbilityT> => ({
    mp: 0,
    do: [{ op: "revive", hp: { scale: [{ ratio, hp: "current", of: "self" }] } }, { op: "pay", hp: { scale: [{ ratio: 0.5, hp: "current", of: "self" }] }, to: "self" }],
  });
  /**
   * Ward of life: waits for either condition (`if: { any }`), a fallen ally or one below a third. Each part has its own target, and an
   * effect has no condition of its own, so when both hold it does both: it raises the fallen and shields the lowest ally below a third.
   * The Shield reads the Cleric's own max HP (everything scales from the user).
   */
  const ward = (raise: number, shield: number): Partial<AbilityT> => ({
    cast: WINDUP.normal,
    if: { any: [{ side: "allies", where: { ko: true } }, { side: "allies", where: { hpBelow: 33 } }] },
    target: "self",
    do: [
      { op: "revive", hp: raiseHp(raise), to: T.koAlly },
      apply("shield", { stacks: { scale: [{ ratio: shield, stat: "max_hp", of: "self" }] }, to: { side: "allies", where: { hpBelow: 33 }, pick: "lowest", by: "hp_share" } }),
    ],
  });
  abilityUp({
    id: "raise", cls: "cleric",
    power: "Raises at 70% HP, not 50%.",
    a: { name: "Martyr's raise", text: "Pays half its HP to raise a random fallen ally with that much.", builds: ["pact"], plus: "Raises with 40% more HP than it pays." },
    b: { name: "Ward of life", text: "Raises a fallen ally at 50% HP, and Shields the lowest ally below 33% HP.", builds: ["toll", "pact"] },
    form: (v, k) => (v === "a" ? martyr(0.5 * k) : v === "b" ? ward(0.5 * k, k / 3) : { do: [{ op: "revive", hp: raiseHp(0.5 * k) }] }),
  });
}
