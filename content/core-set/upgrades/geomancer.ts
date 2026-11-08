/** The Geomancer's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { from, HIT, SPECIAL, STATUS, WINDUP } from "../scale.js";
import type { ReactionT, TargetRuleT } from "../../../src/schema.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, hitOf, kit, marker, passiveUp, phys, removeMine } from "./kit.js";

// ─── Geomancer ───────────────────────────────────────────────────────────────

helper(kit("bedrock_on_plus", "BEDROCK", "Crit chance doubled, and Crit damage up.", {
  stacking: "fizzle", stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }, { stat: "crit_multiplier", flat: SPECIAL.crit_damage.medium }],
}));
// Faultline: the next hit always crits (a crit rule, so Gambler's coin too), at three times (the Geomancer's own crit is twice).
helper(kit("faultline", "FAULTLINE", "Its next hit crits for triple damage.", {
  stacking: "fizzle", stats: [{ stat: "crit_multiplier", flat: 100 }], crits: [{ chance: 100 }],
  reactions: [{ on: { event: "hit_lands" }, do: [removeMine("faultline")] }],
}));
passiveUp({
  id: "bedrock", cls: "geomancer",
  power: "While its Shield pool is above zero, its Crit damage rises by 25.",
  a: { name: "Stunning crits", text: "While its Shield pool is above zero, its crit chance is doubled and its crits Stun.", builds: ["lockdown"] },
  b: { name: "Faultline", text: "While its Shield pool is above zero, its crit chance is doubled. When its Shield breaks, its next hit crits for triple damage.", builds: ["landslide"] },
  form: (v, _k, plus) => {
    const on = plus ? "bedrock_on_plus" : "bedrock_on";
    return {
      reactions: [
        { on: { event: "status_gained", status: "shield" }, do: [apply(on, { to: "holder" })] },
        { on: { event: "status_ended", status: "shield" }, do: [removeMine(on)] },
        ...(v === "a" ? [{ on: { event: "hit_lands", tags: ["crit"] }, if: { side: "self", where: { has: on } }, do: [apply("stun", { to: "other" })] } as ReactionT] : []),
        ...(v === "b" ? [{ on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [apply("faultline", { to: "holder" })] } as ReactionT] : []),
      ],
    };
  },
});

abilityUp({
  id: "earthen_shell", cls: "geomancer",
  power: "A shorter cooldown.",
  a: { name: "Stone skin", text: "Applies a smaller Shield to every ally; the amount scales from Defense.", builds: ["landslide", "phoenix"] },
  b: { name: "Rampart", text: "Applies Shield and Guard to itself. While that Guard lasts, the first time its Shield breaks it's rebuilt at once. No Shield for an ally.", builds: ["landslide", "toll"] },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("short", "earthen_shell") } : {}),
    ...(v === "a" ? { target: { side: "allies", where: { belowCap: "shield" }, pick: "all" } as TargetRuleT, do: [apply("shield", { stacks: from("defense", 0.35) })] } : {}),
    ...(v === "b" ? { target: "self" as const, do: [apply("shield", { stacks: from("defense", 1.0) }), apply("guard"), apply("rampart")] } : {}),
  }),
});
// One use, for the Guard's length: the first time the Shield breaks, it's built again from Defense (Guard's included), the cap untouched.
helper(kit("rampart", "RAMPART", "The first time its Shield breaks, it's rebuilt at once.", {
  duration: STATUS.guard.duration,
  reactions: [{ on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [apply("shield", { stacks: { scale: [{ ratio: 1.0, stat: "defense", of: "holder" }] }, to: "holder" }), removeMine("rampart")] }],
}));

abilityUp({
  id: "rockfall", cls: "geomancer",
  power: "40% more damage.",
  a: { name: "Boulder", text: "Deals double damage that scales from Defense to the foe with the most HP, with a longer wind-up.", builds: ["landslide"] },
  b: { name: "Rock shelter", text: "Deals damage that scales from Defense to a random foe, and the ally with the lowest share of HP gains a Shield as large as the damage dealt.", builds: ["landslide", "phoenix"] },
  form: (v, k) =>
    // Boulder takes the medium cooldown and 650 MP, so a double hit doesn't double the spell's output.
    v === "a" ? { cast: WINDUP.very_long, cooldown: cd("medium", "rockfall"), mp: 650, target: { side: "foes", pick: "highest", by: "hp" }, do: [phys(from("defense", HIT.normal * 2 * k))] }
      // A one-tick marker on the Geomancer hears the cast's own hit and shelters the lowest ally for as much.
      : v === "b" ? { do: [apply("rock_shelter", { to: "self" }), phys(hitOf("defense", "normal", k))] }
        : { do: [phys(hitOf("defense", "normal", k))] },
});
helper(marker("rock_shelter", "ROCK SHELTER", "Its ability's hit shelters the lowest ally for as much.", {
  duration: 1,
  reactions: [{ on: { event: "hit_lands", kind: "ability" }, do: [apply("shield", { stacks: { scale: [{ ratio: 1, amount: true }] }, to: T.lowestShareAlly })] }],
}));

abilityUp({
  id: "tremor", cls: "geomancer",
  power: "40% more damage.",
  a: { name: "Aftershock", text: "Deals damage that scales from Defense to a random foe, and Stuns every foe.", builds: ["lockdown", "snap"] },
  b: { name: "Fissure", text: "Deals damage that scales from Defense to a Stunned foe, triple; with no foe Stunned, to a random foe. A shorter wind-up. No Stun.", builds: ["landslide", "snap"] },
  form: (v, k) =>
    // Statuses are universal: the Stun at its own 8 ticks on every foe (Fizzle skips those already Stunned).
    v === "a" ? { do: [phys(hitOf("defense", "normal", k)), apply("stun", { to: T.everyFoe })] }
      : v === "b" ? {
        cast: WINDUP.normal, target: { side: "foes", where: { has: "stun" }, ifNone: "any" },
        do: [phys({ scale: [{ ratio: HIT.normal * k, stat: "defense" }, { ratio: HIT.normal * 2 * k, when: { has: "stun" }, of: "target", times: { stat: "defense", of: "self" } }] })],
      }
        : { do: [phys(hitOf("defense", "normal", k), { apply: [{ status: "stun" }] })] },
});
