/** The Valkyrie's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, EffectT, ReactionT, StatusT } from "../../../src/schema.js";
import { T } from "../classes.js";
import { from, HIT, KIT, REVIVE, stacks } from "../scale.js";
import { abilityUp, apply, both, helper, kit, passiveUp, phys } from "./kit.js";

{
  /** The Shield from each hit landed: a share of the damage dealt, to the Valkyrie or (Shield-sister) to the ally lowest in HP share. */
  const shieldOn = (ratio: number, to: "holder" | typeof T.lowestShareAlly): ReactionT => ({ on: { event: "hit_lands" }, do: [apply("shield", { stacks: { scale: [{ ratio, amount: true }] }, to })] });
  passiveUp({
    id: "shieldmaiden", cls: "valkyrie",
    power: "A bigger share: two fifths more Shield from each hit.",
    a: { name: "Chooser of the slain", text: "No Shield. Its hits deal a fifth more to foes below half their HP.", builds: ["hunt", "harvest"], plus: "Its hits deal 28% more to such foes, not a fifth." },
    b: { name: "Shield-sister", text: "Each hit it lands gives the ally with the lowest share of HP a Shield of a share of the damage dealt, instead of itself.", builds: ["toll", "pact"] },
    // Chooser of the slain gives the Shield up: offence in place of defence, and the power step has nothing to grow.
    form: (v, k) =>
      v === "a" ? { reactions: [], boosts: both({ scale: [{ ratio: 20 * k, when: { hpBelow: 50 }, of: "target" }] }) as StatusT["boosts"] }
        : { reactions: [shieldOn(KIT.shieldmaiden * k, v === "b" ? T.lowestShareAlly : "holder")] },
  });
}

{
  const shock = { status: "shock", stacks: stacks("few", "attack", 0.5) };
  const spear = (ratio: number, extra: object = {}) => phys(from("attack", ratio), { apply: [shock], ...extra });
  /** Gale storm: one hit past any guard, then one each on two other random foes; fewer foes, fewer hits. */
  const storm = (ratio: number): Partial<AbilityT> => ({ do: [spear(ratio), spear(ratio, { to: { side: "foes", pick: "random", count: 2, exclude: "targets" } })] });
  const hunt = (ratio: number): Partial<AbilityT> => ({ target: T.lowestHpFoe, do: [spear(ratio, { hits: 3 })] });
  abilityUp({
    id: "gale_spear", cls: "valkyrie",
    power: "Deals two fifths more damage.",
    a: { name: "Gale storm", text: "Three quick hits on three different foes, the first past any guard, each adding a few Shock.", builds: ["harvest", "cuts"] },
    b: { name: "Spear of the hunt", text: "Three quick hits past any guard on the foe with the lowest HP, each adding a few Shock.", builds: ["hunt"] },
    form: (v, k) => (v === "a" ? storm(0.09 * k) : v === "b" ? hunt(0.09 * k) : { do: [spear(0.09 * k, { hits: 3 })] }),
  });
}

{
  const heal = (ratio: number): EffectT => ({ op: "heal", amount: from("attack", ratio) });
  const raise = (ratio: number): EffectT => ({ op: "revive", hp: { scale: [{ ratio, stat: "max_hp", of: "target" }] }, to: T.koAlly });
  /** Einherjar: the old passive, now a choice. The ability brings a listener whose rule readies every action of an ally it raises. */
  helper(kit("einherjar", "EINHERJAR", "Allies it raises come back with every action ready.", { show: "sheet", unremovable: true, revives: { ready: true } }));
  /** Over the fallen: she stands over the one she chose; the Taunt and Guard are the kit's one Aggro read. */
  const over = (k: number): Partial<AbilityT> => ({
    if: { any: [{ side: "allies", where: { hpBelow: 30 } }, { side: "allies", where: { ko: true } }] },
    do: [heal(2 * KIT.choosing * k), raise(REVIVE.tenth * k), apply("taunt", { to: "self" }), apply("guard", { to: "self" })],
  });
  abilityUp({
    id: "choosing", cls: "valkyrie",
    power: "Heals, or raises with, two fifths more.",
    a: { name: "Einherjar", text: "Heals the lowest ally, or raises a fallen one with a tenth of its HP. An ally it raises comes back with every action ready.", builds: ["phoenix", "ambush"] },
    b: { name: "Over the fallen", text: "Waits until an ally is below 30% of its HP or down. Heals it for double, or raises it; the Valkyrie Taunts and is Guarded, standing over the one she chose.", builds: ["toll", "phoenix"] },
    form: (v, k) =>
      v === "a" ? { statuses: ["einherjar"], do: [heal(KIT.choosing * k), raise(REVIVE.tenth * k)] }
        : v === "b" ? over(k)
          : { do: [heal(KIT.choosing * k), raise(REVIVE.tenth * k)] },
  });
}

{
  /** Skyfall: a heavy hit plus KIT.skyfallPerShock a Shock stack on its target; Thunderclap half of both on every shocked foe. */
  const fall = (share: number, k: number) => phys({ scale: [{ ratio: HIT.heavy * share * k, stat: "attack" }, { ratio: KIT.skyfallPerShock * share * k, stacks: "shock", of: "target" }] });
  /** Valkyrie's descent: past any guard at the lowest foe, double below a quarter of its HP, and no Shock bonus. `times` reads her Attack. */
  const descent = (k: number): Partial<AbilityT> => ({
    seek: true, target: T.lowestHpFoe,
    do: [phys({ scale: [{ ratio: HIT.heavy * k, stat: "attack" }, { ratio: HIT.heavy * k, when: { hpBelow: 25 }, of: "target", times: { stat: "attack", of: "self" } }] })],
  });
  abilityUp({
    id: "skyfall", cls: "valkyrie",
    power: "Deals two fifths more damage.",
    a: { name: "Thunderclap", text: "Skyfall on every foe that holds Shock, half as hard on each, rising with each one's Shock. Waits until a foe holds Shock.", builds: ["harvest"] },
    b: { name: "Valkyrie's descent", text: "Skyfall past any guard on the foe with the lowest HP, double below a quarter of its HP. No Shock bonus.", builds: ["hunt"] },
    form: (v, k) =>
      v === "a" ? { if: { side: "foes", where: { has: "shock" } }, target: { side: "foes", where: { has: "shock" }, pick: "all" }, do: [fall(0.5, k)] }
        : v === "b" ? descent(k)
          : { do: [fall(1, k)] },
  });
}
