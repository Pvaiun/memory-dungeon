/** The Assassin's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { from, HIT, stacks, STATUS } from "../scale.js";
import type { EffectT, ReactionT, TargetRuleT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { BACKSTAB_HIT, T } from "../classes.js";
import { abilityUp, apply, baseAbility, both, helper, hitOf, kit, marker, passiveUp, phys, removeMine } from "./kit.js";

// ─── Assassin ────────────────────────────────────────────────────────────────

/** Rupture: the share of Bleed's per-hit damage a crit deals for each stack. */
const RUPTURE = 0.5;
passiveUp({
  id: "lacerate", cls: "assassin",
  power: "+40% Bleed.",
  a: { name: "Opening wound", text: "Its first hit on each foe always crits. Crits add Bleed.", builds: ["hunt"] },
  b: { name: "Rupture", text: "Crits deal extra damage for each Bleed on the foe, then add Bleed. The Bleed stays.", builds: ["hunt"] },
  form: (v, k) => ({
    // Opening wound: hits on a foe it hasn't yet landed a hit on always crit (a crit rule: chance after every stat change, so Gambler's coin too).
    ...(v === "a" ? { crits: [{ when: { lacks: "opening_wound" }, chance: 100 }] } : {}),
    reactions: [
      {
        on: { event: "hit_lands", tags: ["crit"] },
        do: [
          // Rupture: half of Bleed's own per-hit damage for each stack the foe holds after the crit's own hit; the Bleed stays (a status runs its own course).
          ...(v === "b" ? [{ op: "damage", type: "none", amount: { scale: [{ ratio: RUPTURE * STATUS.bleed.perStack, stacks: "bleed", of: "target" }] }, to: "other" } as EffectT] : []),
          apply("bleed", { stacks: own("several", "attack", k), to: "other" }),
        ],
      },
      ...(v === "a" ? [{ on: { event: "hit_lands" }, do: [apply("opening_wound", { to: "other" })] } as ReactionT] : []),
    ],
  }),
});
// On each foe the Assassin has landed a hit on, all fight; a summoned foe is a new foe.
helper(marker("opening_wound", "OPENING WOUND", "Already hit by the Assassin.", { stacking: "fizzle" }));

abilityUp({
  id: "vanish", cls: "assassin",
  power: "Shorter cooldown.",
  shown: true,
  a: { name: "Smoke screen", text: "Hides the lowest ally that isn't Taunting or Hidden. Waits for an ally below 80% HP.", serves: "Pact ●●, Toll ●● ⚙ two in the dark (key), brink (half)" },
  b: { name: "Shadow step", text: "Goes Hidden. When the Hidden runs out, its next hit deals triple damage.", builds: ["hunt"] },
  form: (v, _k, plus) => ({
    // A quarter off (22 → 16): one word down would hide it about 70% of a fight.
    ...(plus ? { cooldown: Math.round(baseAbility("vanish").cooldown * 0.75 * 10) / 10 } : {}),
    ...(v === "a" ? { if: { side: "allies", where: { hpBelow: 80 } }, target: { side: "allies", where: { lacks: ["taunt", "hidden"] }, pick: "lowest", by: "hp_share" } as TargetRuleT } : {}),
    ...(v === "b" ? { do: [apply("hidden"), apply("shadow_step")] } : {}),
  }),
});
helper(marker("shadow_step", "SHADOW STEP", "When Hidden runs out: next hit deals triple damage.", {
  reactions: [{ on: { event: "status_ended", status: "hidden", cause: ["expired"] }, do: [apply("shadow_step_strike", { to: "holder" }), removeMine("shadow_step", "marker")] }],
}));
helper(kit("shadow_step_strike", "SHADOW STEP", "Next hit deals triple damage.", {
  stacking: "fizzle", boosts: both(200),
  reactions: [{ on: { event: "hit_lands" }, do: [removeMine("shadow_step_strike")] }],
}));

abilityUp({
  id: "backstab", cls: "assassin",
  power: "+40% damage.",
  shown: true,
  a: { name: "Coup de grâce", text: "Stabs the foe with the least HP. Ignores Taunt. A kill with any of its abilities makes Backstab ready again.", serves: "Hunt 2 ●●● ⚙ reaping (key)" },
  b: { name: "From the shadows", text: "Waits until Hidden, then stabs the foe with the least HP. Ignores Taunt.", builds: ["hunt"] },
  form: (v, k) => ({
    ...(v === "a" ? { statuses: ["coup_de_grace"], note: "A kill the Assassin lands with any ability readies Backstab (Garrote's too): the ko event names the killer and the hit's kind, not which ability." } : {}),
    ...(v === "b" ? { if: { side: "self", where: { has: "hidden" } }, do: [phys(from("crit_chance", HIT[BACKSTAB_HIT] * 2 * k))] } : { do: [phys(hitOf("crit_chance", BACKSTAB_HIT, k))] }),
  }),
});
// Brought by the ability: a kill the Assassin lands with an ability makes Backstab ready. No limit but MP.
helper(kit("coup_de_grace", "COUP DE GRÂCE", "A kill with an ability makes Backstab ready.", {
  show: "sheet", unremovable: true,
  reactions: [{ on: { event: "ko", whose: "foe", other: "holder", kind: "ability" }, do: [{ op: "cooldown", which: { ability: ["backstab"] }, set: "ready", to: "self" }] }],
}));

/** Bleed them dry: the drinker's reach. Its Lifesteal is doubled for a while (read live off its own). */
const DRY = 20;
helper(kit("bleed_them_dry", "BLED DRY", "Lifesteal doubled.", { duration: DRY, stats: [{ stat: "lifesteal", flat: { scale: [{ ratio: 1, stat: "lifesteal", of: "holder" }] } }] }));
abilityUp({
  id: "garrote", cls: "assassin",
  power: "Costs less MP.",
  shown: true,
  a: { name: "Choke", text: "Waits for a foe to cast, then Silences the casting foe with the most Attack. Ignores Taunt.", builds: [] },
  b: { name: "Bleed them dry", text: "Strikes a random foe that isn't Taunting, adding Rot and Bleed; its own Lifesteal doubles for a while. No Silence.", builds: ["pact", "hunt"] },
  form: (v, _k, plus) => ({
    ...(plus ? { mp: 200 } : {}),
    ...(v === "a" ? { if: { side: "foes", where: { casting: true } }, target: T.castingFoe } : {}),
    // Unlike the base, it doesn't skip Silenced foes.
    ...(v === "b" ? { target: T.notTauntingFoe, do: [phys(hitOf("attack", "normal"), { apply: [{ status: "rot" }, { status: "bleed", stacks: stacks("many", "attack") }] }), apply("bleed_them_dry", { to: "self" })] } : {}),
  }),
});
