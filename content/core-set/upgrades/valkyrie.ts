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
    power: "Shield +40%.",
    a: { name: "Chooser of the slain", text: "No Shield. Hits deal +20% to foes below half HP.", builds: ["hunt", "storm"], plus: "+28%, not +20%." },
    b: { name: "Shield-sister", text: `On a hit: Shields the lowest ally instead, for ${KIT.shieldmaiden * 100}% of the damage.`, builds: ["toll", "pact"] },
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
    power: "+40% damage.", shown: true,
    a: { name: "Gale storm", text: "Three hits on three different foes, each adding Shock. The first ignores Taunt.", builds: ["storm", "cuts"] },
    b: { name: "Spear of the hunt", text: "Three hits on the foe with the least HP, each adding Shock. Ignores Taunt.", builds: ["hunt"] },
    form: (v, k) => (v === "a" ? storm(0.09 * k) : v === "b" ? hunt(0.09 * k) : { do: [spear(0.09 * k, { hits: 3 })] }),
  });
}

{
  /** The one target's two outcomes: a revive lands only on the fallen, a heal only on the living (the base's shape). */
  /** Choosing's one outcome on its one target: the heal first (skipped on a fallen ally), then the raise (skipped on a living one). */
  const choose = (heal: number, raise: number): EffectT[] => [{ op: "heal", amount: from("attack", heal) }, { op: "revive", hp: { scale: [{ ratio: raise, stat: "max_hp", of: "target" }] } }];
  /** Einherjar: the old passive, now a choice. The ability brings a listener whose rule readies every action of an ally it raises. */
  helper(kit("einherjar", "EINHERJAR", "Allies it raises come back with every action ready.", { show: "sheet", unremovable: true, revives: { ready: true } }));
  /** Over the fallen: she stands over the one she chose; the Taunt and Guard are the kit's one Aggro read. */
  const over = (k: number): Partial<AbilityT> => ({
    if: { any: [{ side: "allies", where: { hpBelow: 30 } }, { side: "allies", where: { ko: true } }] },
    do: [...choose(2 * KIT.choosing * k, REVIVE.tenth * k), apply("taunt", { to: "self" }), apply("guard", { to: "self" })],
  });
  abilityUp({
    id: "choosing", cls: "valkyrie",
    power: "Heals or raises 40% more.",
    a: { name: "Einherjar", text: "Raises a fallen ally at 10% HP, every action ready; else heals the lowest ally.", builds: ["hunt"] },
    b: { name: "Over the fallen", text: "Raises a fallen ally or heals the lowest one below 30% HP, then Taunts and is Guarded.", serves: "Toll 2 ●●●, Pact ●● ⚙ riposte (half), brink (half)" },
    form: (v, k) =>
      v === "a" ? { statuses: ["einherjar"], do: choose(KIT.choosing * k, REVIVE.tenth * k) }
        : v === "b" ? over(k)
          : { do: choose(KIT.choosing * k, REVIVE.tenth * k) },
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
    power: "+40% damage.", shown: true,
    a: { name: "Thunderclap", text: "A blow from above on every foe that holds Shock. The Shock stays.", serves: "Storm 3 ●●● ⚙ held charge (key)" },
    b: { name: "Valkyrie's descent", text: "A blow on the foe with the least HP, double below a quarter HP. Ignores Taunt.", builds: ["hunt"] },
    form: (v, k) =>
      v === "a" ? { if: { side: "foes", where: { has: "shock" } }, target: { side: "foes", where: { has: "shock" }, pick: "all" }, do: [fall(0.5, k)] }
        : v === "b" ? descent(k)
          : { do: [fall(1, k)] },
  });
}
