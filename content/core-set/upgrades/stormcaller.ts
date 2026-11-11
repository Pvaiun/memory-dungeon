/** The Stormcaller's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { EffectT, ReactionT, StatusT, ToT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { AGGRO_STEP, KIT, P, SHOCK_STACKS, SPECIAL, STACKS, stacks } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, hitOf, kit, marker, passiveUp, phys, POWER, removeMine } from "./kit.js";

// ─── Stormcaller ─────────────────────────────────────────────────────────────

const shockOn = (kind: "basic" | "extra", k: number): ReactionT => ({ on: { event: "hit_lands", kind }, do: [apply("shock", { stacks: own("few", "attack", SHOCK_STACKS * k), to: "other" })] });
passiveUp({
  id: "arc", cls: "stormcaller",
  power: "40% more Shock.",
  a: { name: "Forked arc", text: "Each of its basic attacks also hits two other random foes, and adds a few Shock to all three; stacks scale from Attack.", builds: ["storm"] },
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
  b: { name: "Recharge", text: "Deals damage that scales from Attack to a random foe, then to up to three other random foes, and adds a few Shock to each; stacks scale from Attack. The Stormcaller regains 120 MP for each foe it hits.", serves: "Barrage 2 ●●●, Storm ●● ⚙ resonance (half)" },
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

/**
 * The storm on the party's swings, in its forms: Shock on each ally's basic attacks from the Stormcaller's Attack (the status knows its
 * source); Static field, Shock on every foe that hits an ally; Storm's eye, the swings' Shock to the foe with the most Shock, three times as much.
 */
const stormShock = (k: number, to: ToT) => apply("shock", { stacks: { scale: [{ ratio: (STACKS.few * SHOCK_STACKS * k) / P, stat: "attack", of: "source" }] }, to });
const storm = (id: string, text: string, reaction: ReactionT): StatusT => kit(id, "THUNDERSTORM", text, { perSource: {}, duration: KIT.storm.duration, reactions: [reaction] });
for (const [suffix, k] of [["", 1], ["_plus", POWER]] as const) {
  // The base storm (thunderstorm_storm) is the kit's, in classes.ts; its power step is written here.
  if (suffix) helper(storm(`thunderstorm_storm${suffix}`, "Its basic attacks add a few Shock.", { on: { event: "hit_lands", kind: "basic" }, do: [stormShock(k, "other")] }));
  helper(storm(`static_field${suffix}`, "Every foe that lands a hit on it gains a few Shock.", { on: { event: "hit_taken" }, do: [stormShock(k, "other")] }));
  helper(storm(`storms_eye${suffix}`, "Its basic attacks add Shock to the foe with the most Shock, three times as much.", { on: { event: "hit_lands", kind: "basic" }, do: [stormShock(3 * k, T.mostFoe("shock"))] }));
}
abilityUp({
  id: "thunderstorm", cls: "stormcaller",
  power: "40% more Shock.",
  a: { name: "Static field", text: "For a while, every foe that lands a hit on an ally gains a few Shock; stacks scale from the Stormcaller's Attack. Nothing on the swings.", serves: "Toll 2 ●●●, Storm 2 ●● ⚙ goad (half)" },
  b: { name: "Storm's eye", text: "For a while, every ally's basic attacks add Shock to the foe with the most Shock, wherever they land, three times as much; stacks scale from the Stormcaller's Attack.", builds: ["hunt", "cuts"] },
  form: (v, _k, plus) => ({ do: [apply(`${v === "a" ? "static_field" : v === "b" ? "storms_eye" : "thunderstorm_storm"}${plus ? "_plus" : ""}`)] }),
});

abilityUp({
  id: "static_charge", cls: "stormcaller",
  power: "A shorter cooldown.",
  a: { name: "Overcharge", text: "Its basic attacks come faster for a while. While that lasts, its next three abilities cost no MP.", serves: "Barrage 2 ●●● ⚙ crescendo (half)" },
  b: { name: "Storm shield", text: "Raises its Thorns by 150 and its Aggro by 40 for 20 ticks. No speed.", builds: ["toll", "storm"] },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("medium", "static_charge") } : {}),
    ...(v === "a" ? { do: [apply("static_charge_on"), apply("overcharge")] } : {}),
    ...(v === "b" ? { do: [apply("storm_shield")] } : {}),
  }),
});
// The charges land a sub-tick after the cast resolves (a cue), so Static charge itself doesn't spend one; they end with the charge.
helper(marker("overcharge", "OVERCHARGE", "Its next three abilities cost no MP.", {
  duration: 1,
  reactions: [{ on: { event: "status_gained", status: "overcharge" }, do: [apply("overcharge_charges", { stacks: 3, to: "holder" })] }],
}));
helper(kit("overcharge_charges", "OVERCHARGE", "Its next abilities cost no MP while its charge lasts.", {
  stacking: "intensity", cap: 3, mods: [{ mp: -100 }],
  trigger: { on: { event: "action_resolve", kind: "ability" } }, drop: { count: 1 },
  reactions: [{ on: { event: "status_ended", status: "static_charge_on" }, do: [removeMine("overcharge_charges")] }],
}));
helper(kit("storm_shield", "STORM SHIELD", "Thorns and Aggro up.", { duration: 20, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }, { stat: "aggro", flat: 4 * AGGRO_STEP }] }));
