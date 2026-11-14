/** The Geomancer's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { from, HIT, SPECIAL, STATUS, WINDUP } from "../scale.js";
import type { ReactionT, TargetRuleT } from "../../../src/schema.js";
import { ROCKFALL, T } from "../classes.js";
import { abilityUp, apply, cd, helper, hitOf, kit, marker, passiveUp, phys, removeMine } from "./kit.js";

// ─── Geomancer ───────────────────────────────────────────────────────────────

helper(kit("bedrock_on_plus", "BEDROCK", "Crit chance doubled; Crit damage up.", {
  stacking: "fizzle", stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }, { stat: "crit_multiplier", flat: SPECIAL.crit_damage.medium }],
}));
// Bare rock: the passive turned outside its stone: Crit damage while it holds no Shield (given at the start, lifted as a Shield
// lands, given back as the last one ends); the power step's +25% on top.
helper(kit("bare_rock", "BARE ROCK", "Crit damage +50%.", { stacking: "fizzle", stats: [{ stat: "crit_multiplier", flat: 50 }] }));
helper(kit("bare_rock_plus", "BARE ROCK", "Crit damage +75%.", { stacking: "fizzle", stats: [{ stat: "crit_multiplier", flat: 75 }] }));
passiveUp({
  id: "bedrock", cls: "geomancer",
  power: "+25% Crit damage while its Shield holds.",
  a: { name: "Stunning crits", text: "While its Shield holds: Crit chance doubled, and crits Stun.", builds: [] },
  b: { name: "Bare rock", text: "While it holds no Shield: Crit damage +50%.", serves: "Hunt 2 ●●, Cuts ● ◆ crits", plus: "Crit damage +75%." },
  form: (v, _k, plus) => {
    const on = plus ? "bedrock_on_plus" : "bedrock_on";
    if (v === "b") {
      const bare = plus ? "bare_rock_plus" : "bare_rock";
      return {
        reactions: [
          { on: { event: "fight_start" }, if: { side: "self", where: { lacks: "shield" } }, do: [apply(bare, { to: "holder" })] },
          { on: { event: "status_gained", status: "shield" }, do: [removeMine(bare)] },
          { on: { event: "status_ended", status: "shield" }, do: [apply(bare, { to: "holder" })] },
        ],
      };
    }
    return {
      reactions: [
        { on: { event: "status_gained", status: "shield" }, do: [apply(on, { to: "holder" })] },
        { on: { event: "status_ended", status: "shield" }, do: [removeMine(on)] },
        ...(v === "a" ? [{ on: { event: "hit_lands", tags: ["crit"] }, if: { side: "self", where: { has: on } }, do: [apply("stun", { to: "other" })] } as ReactionT] : []),
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
  b: { name: "Rock shelter", text: "Drops a rock on a random foe; the ally with the lowest HP% gains a Shield of the damage dealt.", builds: ["landslide"] },
  form: (v, k) =>
    // Boulder takes the next cooldown word and 650 MP, so a double hit doesn't double the spell's output.
    v === "a" ? { cast: WINDUP.very_long, cooldown: cd(ROCKFALL.boulder, "rockfall"), mp: 650, target: { side: "foes", pick: "highest", by: "hp" }, do: [phys(from("defense", HIT[ROCKFALL.hit] * 2 * k))] }
      // A one-tick marker on the Geomancer hears the cast's own hit and shelters the ally with the lowest HP% for as much.
      : v === "b" ? { do: [apply("rock_shelter", { to: "self" }), phys(hitOf("defense", ROCKFALL.hit, k))] }
        : { do: [phys(hitOf("defense", ROCKFALL.hit, k))] },
});
helper(marker("rock_shelter", "ROCK SHELTER", "Its hit Shields the ally with the lowest HP% for as much.", {
  duration: 1,
  reactions: [{ on: { event: "hit_lands", kind: "ability" }, do: [apply("shield", { stacks: { scale: [{ ratio: 1, amount: true }] }, to: T.lowestShareAlly })] }],
}));

abilityUp({
  id: "tremor", cls: "geomancer",
  power: "+40% damage.",
  shown: true,
  a: { name: "Aftershock", text: "Hits a random foe and Stuns every foe.", serves: "Landslide ●●, Storm ●● ⚙ held charge (half)" },
  b: { name: "Groundswell", text: "No blow and no Stun: every ally's next basic attack comes at once.", serves: "Landslide 2 ●●, Cuts ● ◆ party tempo, the heavy swing", plus: "Costs less MP." },
  form: (v, k, plus) =>
    // Statuses are universal: the Stun at its own 8 ticks on every foe (Fizzle skips those already Stunned).
    v === "a" ? { do: [phys(hitOf("defense", "normal", k)), apply("stun", { to: T.everyFoe })] }
      : v === "b" ? { target: T.everyAlly, ...(plus ? { mp: 450 } : {}), do: [{ op: "cooldown", which: "basic", set: "ready" }] }
        : { do: [phys(hitOf("defense", "normal", k), { apply: [{ status: "stun" }] })] },
});
