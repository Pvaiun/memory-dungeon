/** The Stormcaller's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { EffectT, ReactionT, StatusT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { AGGRO_STEP, HIT, SHOCK_STACKS, SPECIAL, stacks } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, hitOf, kit, marker, passiveUp, phys, POWER, removeMine } from "./kit.js";

// ─── Stormcaller ─────────────────────────────────────────────────────────────

const shockOn = (kind: "basic" | "extra", k: number): ReactionT => ({ on: { event: "hit_lands", kind }, do: [apply("shock", { stacks: own("few", "attack", SHOCK_STACKS * k), to: "other" })] });
passiveUp({
  id: "arc", cls: "stormcaller",
  power: "40% more Shock.",
  a: { name: "Forked arc", text: "Each of its basic attacks also hits two other random foes, and adds a few Shock to all three; stacks scale from Attack.", builds: ["harvest"] },
  b: { name: "Static grip", text: "Each of its basic attacks strikes its target twice, and adds a few Shock with each; stacks scale from Attack.", builds: ["cuts", "hunt"] },
  form: (v, k) => ({
    // A strike rule that picks several foes strikes each of them.
    strike: { to: v === "a" ? { side: "foes", pick: "random", count: 2, exclude: "targets" } : v === "b" ? "target" : T.secondFoe },
    reactions: [shockOn("basic", k), shockOn("extra", k)],
  }),
});

const chainShock = [{ status: "shock", stacks: stacks("few", "attack", SHOCK_STACKS) }];
abilityUp({
  id: "chain_lightning", cls: "stormcaller",
  power: "40% more damage on every strike.",
  a: { name: "Ball lightning", text: "Lightning strikes the foe with the lowest HP four times: once hard, adding a few Shock, then three smaller strikes. If it falls, the strikes left go to the next lowest; stacks scale from Attack.", builds: ["hunt"] },
  b: { name: "Recharge", text: "Deals damage that scales from Attack to a random foe, then to up to three other random foes, and adds a few Shock to each; stacks scale from Attack. The Stormcaller regains 120 MP for each foe it hits.", builds: ["overflow"] },
  form: (v, k) => {
    const first = phys(hitOf("attack", "light", k), { apply: chainShock });
    if (v === "a") {
      // Shock on the first strike only; each strike picks the lowest again (the first under the Taunt rule, the rest past it).
      const again = phys(hitOf("attack", "touch", k), { to: T.lowestHpFoe });
      return { target: T.lowestHpFoe, do: [first, again, again, again] };
    }
    const rest = phys(hitOf("attack", "touch", k), { apply: chainShock, to: T.threeOtherFoes });
    // 120 MP for each foe its hits landed on (`count: hit`), read after the hits.
    return { do: [first, rest, ...(v === "b" ? [{ op: "mp", amount: { scale: [{ ratio: 120, count: "hit" }] }, to: "self" } as EffectT] : [])] };
  },
});

const stormShock = [{ status: "shock", stacks: stacks("few", "attack", SHOCK_STACKS) }];
abilityUp({
  id: "thunderstorm", cls: "stormcaller",
  power: "40% more damage; if it deals none, its bolts deal 40% more.",
  a: { name: "Supercell", text: "Deals damage that scales from Attack to every foe, 12% more for each foe it hits, and adds a few Shock to each; stacks scale from Attack.", builds: ["harvest"], plus: "40% more damage." },
  b: { name: "Static field", text: "For 20 ticks, every foe that lands a hit on an ally takes a bolt of damage that scales from Attack. Deals no damage itself and adds no Shock.", builds: ["toll"], plus: "Its bolts deal 40% more." },
  form: (v, k, plus) =>
    // +12% of the hit for each of the action's targets (`count: targets`, uncapped).
    v === "a" ? { do: [phys({ scale: [{ ratio: HIT.touch * k, stat: "attack" }, { ratio: 0.12 * HIT.touch * k, count: "targets", times: { stat: "attack", of: "self" } }] }, { apply: stormShock })] }
      : v === "b" ? { target: T.everyAlly, do: [apply(plus ? "static_field_plus" : "static_field")] }
        : { do: [phys(hitOf("attack", "touch", k), { apply: stormShock })] },
});
/** Static field's bolt: a tenth of the Stormcaller's Attack (400 at Attack 4), read as it lands. */
const field = (id: string, k: number): StatusT => kit(id, "STATIC FIELD", "Every foe that lands a hit on it takes a bolt.", {
  perSource: {}, duration: 20,
  reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "physical", amount: { scale: [{ ratio: 0.1 * k, stat: "attack", of: "source" }] }, to: "other" }] }],
});
helper(field("static_field", 1));
helper(field("static_field_plus", POWER));

abilityUp({
  id: "static_charge", cls: "stormcaller",
  power: "A shorter cooldown.",
  a: { name: "Overcharge", text: "Applies Haste to itself. While that Haste lasts, its next three abilities cost no MP.", builds: ["overflow"] },
  b: { name: "Storm shield", text: "Raises its Thorns by 150 and its Aggro by 40 for 20 ticks. No Haste.", builds: ["toll", "harvest"] },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("medium", "static_charge") } : {}),
    ...(v === "a" ? { do: [apply("haste"), apply("overcharge")] } : {}),
    ...(v === "b" ? { do: [apply("storm_shield")] } : {}),
  }),
});
// The charges land a sub-tick after the cast resolves (a cue), so Static charge itself doesn't spend one; they end with the Haste.
helper(marker("overcharge", "OVERCHARGE", "Its next three abilities cost no MP.", {
  duration: 1,
  reactions: [{ on: { event: "status_gained", status: "overcharge" }, do: [apply("overcharge_charges", { stacks: 3, to: "holder" })] }],
}));
helper(kit("overcharge_charges", "OVERCHARGE", "Its next abilities cost no MP while its Haste lasts.", {
  stacking: "intensity", cap: 3, mods: [{ mp: -100 }],
  trigger: { on: { event: "action_resolve", kind: "ability" } }, drop: { count: 1 },
  reactions: [{ on: { event: "status_ended", status: "haste" }, do: [removeMine("overcharge_charges")] }],
}));
helper(kit("storm_shield", "STORM SHIELD", "Thorns and Aggro up.", { duration: 20, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }, { stat: "aggro", flat: 4 * AGGRO_STEP }] }));
