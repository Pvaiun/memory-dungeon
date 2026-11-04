/** The Valkyrie's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, EffectT, ReactionT, StatusT, ToT } from "../../../src/schema.js";
import { T } from "../classes.js";
import { from, jitter, stacks } from "../scale.js";
import { abilityUp, apply, both, helper, kit, magic, marker, passiveUp } from "./kit.js";

{
  const READY = { revives: { ready: true } } as const;
  /** The power step: a Shield of 15% of the revived ally's max HP, on every revive the Valkyrie gives (`other: holder`). */
  const small: ReactionT = { on: { event: "revived", whose: "ally", other: "holder" }, do: [apply("shield", { stacks: { scale: [{ ratio: 0.15, stat: "max_hp", of: "target" }] }, to: "owner" })] };
  const chosen: ReactionT = { on: { event: "revived", whose: "ally", other: "holder" }, do: [apply("guard", { to: "owner" })] };
  /** Chooser of the slain: an aura on every ally while the Valkyrie stands (Per source, ends with it), given again when it or an ally stands up. */
  const aura = (to: ToT) => apply("chooser_of_the_slain", { to });
  const chooser: ReactionT[] = [
    { on: { event: "fight_start" }, do: [aura(T.everyAlly)] },
    { on: { event: "revived" }, do: [aura(T.everyAlly)] },
    { on: { event: "revived", whose: "ally" }, do: [aura("owner")] },
  ];
  helper(kit("chooser_of_the_slain", "CHOOSER", "Deals a fifth more to foes below half their HP.", {
    perSource: { endsWithSource: true }, boosts: both({ scale: [{ ratio: 20, when: { hpBelow: 50 }, of: "target" }] }) as StatusT["boosts"],
  }));
  passiveUp({
    id: "einherjar", cls: "valkyrie",
    power: "Allies it revives also come back with a small Shield.",
    a: { name: "Chosen", text: "Allies it revives come back with all their actions ready, and Guarded.", builds: ["phoenix"] },
    b: { name: "Chooser of the slain", text: "While it stands, every ally deals a fifth more to foes below half their HP. Allies it revives come back on cooldown, as anyone's do.", builds: ["hunt", "harvest"] },
    // Chooser of the slain gives up the ready revive.
    form: (v, _k, plus) =>
      v === "b" ? { revives: undefined, reactions: [...chooser, ...(plus ? [small] : [])] }
        : { ...READY, reactions: [...(v === "a" ? [chosen] : []), ...(plus ? [small] : [])] },
  });
}

{
  const shock = { status: "shock", stacks: stacks("few", "attack", 0.5) };
  const spear = (ratio: number, extra: object = {}) => magic(from("attack", ratio), { apply: [shock], ...extra });
  /** Gale storm: one hit past any guard, then one each on two other random foes; fewer foes, fewer hits. */
  const storm = (ratio: number): Partial<AbilityT> => ({ do: [spear(ratio), spear(ratio, { to: { side: "foes", pick: "random", count: 2, exclude: "targets" } })] });
  const hunt = (ratio: number): Partial<AbilityT> => ({ target: T.lowestHpFoe, do: [spear(ratio, { hits: 3 })] });
  abilityUp({
    id: "gale_spear", cls: "valkyrie",
    power: "Deals two fifths more damage.",
    a: { name: "Gale storm", text: "Three quick magical hits on three different foes, the first past any guard, each adding a few Shock.", builds: ["harvest", "cuts"] },
    b: { name: "Spear of the hunt", text: "Three quick magical hits past any guard on the foe with the lowest HP, each adding a few Shock.", builds: ["hunt"] },
    form: (v, k) => (v === "a" ? storm(0.09 * k) : v === "b" ? hunt(0.09 * k) : { do: [spear(0.09 * k, { hits: 3 })] }),
  });
}

{
  const heal = (ratio: number): EffectT => ({ op: "heal", amount: from("magic", ratio) });
  const hymn = (ratio: number): Partial<AbilityT> => ({ do: [heal(ratio), apply("haste")] });
  const stand = (ratio: number): Partial<AbilityT> => ({ if: { side: "allies", where: { hpBelow: 30 } }, do: [heal(ratio), apply("taunt", { to: "self" })] });
  abilityUp({
    id: "rally", cls: "valkyrie",
    power: "Heals two fifths more.",
    a: { name: "Battle hymn", text: "Heals the ally with the lowest share of HP, and Hastes it.", builds: ["cuts", "pact"] },
    b: { name: "Last stand", text: "Waits until an ally is below 30% of its max HP, then heals it for double, and the Valkyrie Taunts.", builds: ["phoenix", "pact"] },
    form: (v, k) => (v === "a" ? hymn(0.45 * k) : v === "b" ? stand(0.9 * k) : { do: [heal(0.45 * k)] }),
  });
}

{
  const raise = (ratio: number): EffectT => ({ op: "revive", hp: { scale: [{ ratio, stat: "max_hp", of: "target" }] } });
  /** Flight of the valkyries: every fallen ally, on a cooldown a quarter past very long (70 ticks, moved by Valhalla's id as every cooldown is). */
  const flight = (ratio: number): Partial<AbilityT> => ({ cooldown: jitter(70, "valhalla"), target: { side: "allies", where: { ko: true }, pick: "all" }, do: [raise(ratio)] });
  /** Dawn muster: the ability brings a listener that makes Valhalla ready at a fight's start while an ally is down. */
  const dawn = (ratio: number): Partial<AbilityT> => ({ statuses: ["dawn_muster"], do: [raise(ratio)] });
  helper(marker("dawn_muster", "DAWN MUSTER", "At a fight's start, if an ally is down, Valhalla is ready at once.", {
    unremovable: true,
    reactions: [{ on: { event: "fight_start" }, if: { side: "allies", where: { ko: true } }, do: [{ op: "cooldown", which: { ability: ["valhalla"] }, set: "ready", to: "holder" }] }],
  }));
  abilityUp({
    id: "valhalla", cls: "valkyrie",
    power: "The raised ally comes back with two fifths more HP.",
    a: { name: "Flight of the valkyries", text: "Revives every knocked-out ally with a tenth of its HP.", builds: ["phoenix"] },
    b: { name: "Dawn muster", text: "Revives a random knocked-out ally with a tenth of its HP. At a fight's start, if an ally is down from an earlier fight, it's ready at once, whatever its cooldown.", builds: ["ambush", "phoenix"] },
    form: (v, k) => (v === "a" ? flight(0.1 * k) : v === "b" ? dawn(0.1 * k) : { do: [raise(0.1 * k)] }),
  });
}
