/** The Geomancer's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { from, HIT, SPECIAL, STATUS, WINDUP } from "../scale.js";
import type { ReactionT, TargetRuleT } from "../../../src/schema.js";
import { ROCKFALL, T } from "../classes.js";
import { abilityUp, apply, cd, helper, hitOf, kit, marker, passiveUp, phys, removeMine } from "./kit.js";

// ─── Geomancer ───────────────────────────────────────────────────────────────

helper(kit("bedrock_on_plus", "BEDROCK", "Crit chance doubled; Crit damage up.", {
  stacking: "fizzle", stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }, { stat: "crit_multiplier", flat: SPECIAL.crit_damage.medium }],
}));
// Faultline: the next hit always crits (a crit rule, so Gambler's coin too), at three times (the Geomancer's own crit is twice).
helper(kit("faultline", "FAULTLINE", "Next hit crits for triple damage.", {
  stacking: "fizzle", stats: [{ stat: "crit_multiplier", flat: 100 }], crits: [{ chance: 100 }],
  reactions: [{ on: { event: "hit_lands" }, do: [removeMine("faultline")] }],
}));
passiveUp({
  id: "bedrock", cls: "geomancer",
  power: "+25% Crit damage while its Shield holds.",
  a: { name: "Stunning crits", text: "While its Shield holds: Crit chance doubled, and crits Stun.", builds: [] },
  b: { name: "Faultline", text: "While its Shield holds: Crit chance doubled. When it breaks, its next hit crits for triple damage.", serves: "Landslide 2 ●●● ⚙ detonation (half)" },
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
  power: "Shorter cooldown.",
  shown: true,
  a: { name: "Stone skin", text: "Shields every ally.", builds: ["landslide"] },
  b: { name: "Rampart", text: "Shields and Guards itself; while Guarded, the Shield is rebuilt once when it breaks. No ally Shield.", serves: "Landslide 2 ●●● ⚙ detonation (key)" },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("short", "earthen_shell") } : {}),
    ...(v === "a" ? { target: { side: "allies", where: { belowCap: "shield" }, pick: "all" } as TargetRuleT, do: [apply("shield", { stacks: from("defense", 0.35) })] } : {}),
    ...(v === "b" ? { target: "self" as const, do: [apply("shield", { stacks: from("defense", 1.0) }), apply("guard"), apply("rampart")] } : {}),
  }),
});
// One use, for the Guard's length: the first time the Shield breaks, it's built again from Defense (Guard's included), the cap untouched.
helper(kit("rampart", "RAMPART", "Its Shield is rebuilt once when it breaks.", {
  duration: STATUS.guard.duration,
  reactions: [{ on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [apply("shield", { stacks: { scale: [{ ratio: 1.0, stat: "defense", of: "holder" }] }, to: "holder" }), removeMine("rampart")] }],
}));

abilityUp({
  id: "rockfall", cls: "geomancer",
  power: "+40% damage.",
  shown: true,
  a: { name: "Boulder", text: "Drops a boulder on the foe with the most HP.", builds: ["landslide"] },
  b: { name: "Rock shelter", text: "Drops a rock on a random foe; the lowest ally gains a Shield of the damage dealt.", builds: ["landslide"] },
  form: (v, k) =>
    // Boulder takes the next cooldown word and 650 MP, so a double hit doesn't double the spell's output.
    v === "a" ? { cast: WINDUP.very_long, cooldown: cd(ROCKFALL.boulder, "rockfall"), mp: 650, target: { side: "foes", pick: "highest", by: "hp" }, do: [phys(from("defense", HIT[ROCKFALL.hit] * 2 * k))] }
      // A one-tick marker on the Geomancer hears the cast's own hit and shelters the lowest ally for as much.
      : v === "b" ? { do: [apply("rock_shelter", { to: "self" }), phys(hitOf("defense", ROCKFALL.hit, k))] }
        : { do: [phys(hitOf("defense", ROCKFALL.hit, k))] },
});
helper(marker("rock_shelter", "ROCK SHELTER", "Its hit Shields the lowest ally for as much.", {
  duration: 1,
  reactions: [{ on: { event: "hit_lands", kind: "ability" }, do: [apply("shield", { stacks: { scale: [{ ratio: 1, amount: true }] }, to: T.lowestShareAlly })] }],
}));

abilityUp({
  id: "tremor", cls: "geomancer",
  power: "+40% damage.",
  shown: true,
  a: { name: "Aftershock", text: "Hits a random foe and Stuns every foe.", serves: "Landslide ●●, Storm ●● ⚙ held charge (half)" },
  b: { name: "Fissure", text: "Hits a Stunned foe for triple, else a random foe. No Stun.", builds: ["landslide", "snap"] },
  form: (v, k) =>
    // Statuses are universal: the Stun at its own 8 ticks on every foe (Fizzle skips those already Stunned).
    v === "a" ? { do: [phys(hitOf("defense", "normal", k)), apply("stun", { to: T.everyFoe })] }
      : v === "b" ? {
        cast: WINDUP.normal, target: { side: "foes", where: { has: "stun" }, ifNone: "any" },
        do: [phys({ scale: [{ ratio: HIT.normal * k, stat: "defense" }, { ratio: HIT.normal * 2 * k, when: { has: "stun" }, of: "target", times: { stat: "defense", of: "self" } }] })],
      }
        : { do: [phys(hitOf("defense", "normal", k), { apply: [{ status: "stun" }] })] },
});
