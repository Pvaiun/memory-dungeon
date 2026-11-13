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
  power: "+40% Shock.",
  a: { name: "Forked arc", text: "Basic attacks also hit two other random foes; all three gain a few Shock (from Attack).", builds: ["storm"] },
  b: { name: "Static grip", text: "Basic attacks strike their target twice, each adding a few Shock (from Attack).", builds: ["cuts", "hunt"] },
  form: (v, k) => ({
    // A strike rule that picks several foes strikes each of them.
    strike: { to: v === "a" ? { side: "foes", pick: "random", count: 2, exclude: "targets" } : v === "b" ? "target" : T.secondFoe },
    reactions: [shockOn("basic", k), shockOn("extra", k)],
  }),
});

const chainShock = [{ status: "shock", stacks: stacks("few", "attack", SHOCK_STACKS) }];
abilityUp({
  id: "chain_lightning", cls: "stormcaller",
  power: "+40% damage.",
  shown: true,
  a: { name: "Ball lightning", text: "Four strikes at the foe with the least HP, the first adding Shock. If it falls, the rest go to the next.", builds: ["hunt"] },
  b: { name: "Recharge", text: "Lightning at a random foe and up to three others, adding Shock. Regains MP for each foe hit: four repay the cast.", serves: "Barrage 2 ●●●, Storm ●● ⚙ resonance (half)" },
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
  if (suffix) helper(storm(`thunderstorm_storm${suffix}`, "Basic attacks add a few Shock.", { on: { event: "hit_lands", kind: "basic" }, do: [stormShock(k, "other")] }));
  helper(storm(`static_field${suffix}`, "Foes that hit it gain a few Shock.", { on: { event: "hit_taken" }, do: [stormShock(k, "other")] }));
  helper(storm(`storms_eye${suffix}`, "Basic attacks add triple Shock to the foe with the most Shock.", { on: { event: "hit_lands", kind: "basic" }, do: [stormShock(3 * k, T.mostFoe("shock"))] }));
}
abilityUp({
  id: "thunderstorm", cls: "stormcaller",
  power: "+40% Shock.",
  a: { name: "Static field", text: `For ${KIT.storm.duration} ticks, foes that hit an ally gain a few Shock (from the Stormcaller's Attack). None on the swings.`, serves: "Toll 2 ●●●, Storm 2 ●● ⚙ goad (half)" },
  b: { name: "Storm's eye", text: `For ${KIT.storm.duration} ticks, every ally's basic attacks send Shock to the foe with the most: a few, tripled (from the Stormcaller's Attack).`, builds: ["hunt", "cuts"] },
  form: (v, _k, plus) => ({ do: [apply(`${v === "a" ? "static_field" : v === "b" ? "storms_eye" : "thunderstorm_storm"}${plus ? "_plus" : ""}`)] }),
});

abilityUp({
  id: "static_charge", cls: "stormcaller",
  power: "Shorter cooldown.",
  shown: true,
  a: { name: "Overcharge", text: `Its basic attacks come faster for ${KIT.staticCharge.duration} ticks, and its next three abilities in that time cost no MP.`, serves: "Barrage 2 ●●● ⚙ crescendo (half)" },
  b: { name: "Storm shield", text: `Thorns up and +${4 * AGGRO_STEP} Aggro for 20 ticks. No speed.`, builds: ["toll", "storm"] },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("short", "static_charge") } : {}),
    ...(v === "a" ? { do: [apply("static_charge_on"), apply("overcharge")] } : {}),
    ...(v === "b" ? { do: [apply("storm_shield")] } : {}),
  }),
});
// The charges land a sub-tick after the cast resolves (a cue), so Static charge itself doesn't spend one; they end with the charge.
helper(marker("overcharge", "OVERCHARGE", "Next three abilities cost no MP.", {
  duration: 1,
  reactions: [{ on: { event: "status_gained", status: "overcharge" }, do: [apply("overcharge_charges", { stacks: 3, to: "holder" })] }],
}));
helper(kit("overcharge_charges", "OVERCHARGE", "Next abilities cost no MP while charged.", {
  stacking: "intensity", cap: 3, mods: [{ mp: -100 }],
  trigger: { on: { event: "action_resolve", kind: "ability" } }, drop: { count: 1 },
  reactions: [{ on: { event: "status_ended", status: "static_charge_on" }, do: [removeMine("overcharge_charges")] }],
}));
helper(kit("storm_shield", "STORM SHIELD", "Thorns and Aggro up.", { duration: 20, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }, { stat: "aggro", flat: 4 * AGGRO_STEP }] }));
