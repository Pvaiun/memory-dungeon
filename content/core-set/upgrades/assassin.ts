/** The Assassin's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit-2.ts. */
import { from, HIT, stacks, STATUS } from "../scale.js";
import type { EffectT, ReactionT, TargetRuleT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { T } from "../classes.js";
import { abilityUp, apply, baseAbility, both, helper, hitOf, kit, marker, passiveUp, phys, removeMine } from "./kit-2.js";

// ─── Assassin ────────────────────────────────────────────────────────────────

passiveUp({
  id: "lacerate", cls: "assassin",
  power: "Its crits add 40% more Bleed.",
  a: { name: "Opening wound", text: "Its first hit on each foe always crits. Each of its crits adds several Bleed to the foe; stacks scale from Attack.", builds: ["ambush"] },
  b: { name: "Rupture", text: "Each of its crits sets off the foe's Bleed once more, for each stack, and the Bleed closes; then it adds several Bleed; stacks scale from Attack.", builds: ["hunt"] },
  form: (v, k) => ({
    // Opening wound: hits on a foe it hasn't yet landed a hit on always crit (a crit rule: chance after every stat change, so Gambler's coin too).
    ...(v === "a" ? { crits: [{ when: { lacks: "opening_wound" }, chance: 100 }] } : {}),
    reactions: [
      {
        on: { event: "hit_lands", tags: ["crit"] },
        do: [
          // Rupture: Bleed's own per-hit damage for each stack left after the crit's own hit, then the Bleed closes, then Lacerate's Bleed.
          ...(v === "b" ? [
            { op: "damage", type: "none", amount: { scale: [{ ratio: STATUS.bleed.perStack, stacks: "bleed", of: "target" }] }, to: "other" } as EffectT,
            removeMine("bleed", "debuff", "other"),
          ] : []),
          apply("bleed", { stacks: own("several", "attack", k), to: "other" }),
        ],
      },
      ...(v === "a" ? [{ on: { event: "hit_lands" }, do: [apply("opening_wound", { to: "other" })] } as ReactionT] : []),
    ],
  }),
});
// On each foe the Assassin has landed a hit on, all fight; a summoned foe is a new foe.
helper(marker("opening_wound", "OPENING WOUND", "The Assassin's first hit on it has landed.", { stacking: "fizzle" }));

abilityUp({
  id: "vanish", cls: "assassin",
  power: "A shorter cooldown.",
  a: { name: "Smoke screen", text: "Hides the ally with the lowest share of HP that isn't Taunting. Waits until an ally is below 80% of its HP.", builds: ["phoenix", "toll"] },
  b: { name: "Shadow step", text: "Applies Hidden to itself. Waits until it isn't Hidden. Its first hit after that Hidden ends deals triple damage.", builds: ["ambush"] },
  form: (v, _k, plus) => ({
    // A quarter off (22 → 16): one word down would hide it about 70% of a fight.
    ...(plus ? { cooldown: Math.round(baseAbility("vanish").cooldown * 0.75 * 10) / 10 } : {}),
    ...(v === "a" ? { if: { side: "allies", where: { hpBelow: 80 } }, target: { side: "allies", where: { lacks: ["taunt", "hidden"] }, pick: "lowest", by: "hp_share" } as TargetRuleT } : {}),
    ...(v === "b" ? { do: [apply("hidden"), apply("shadow_step")] } : {}),
  }),
});
helper(marker("shadow_step", "SHADOW STEP", "When its Hidden runs out, its next hit deals triple damage.", {
  reactions: [{ on: { event: "status_ended", status: "hidden", cause: ["expired"] }, do: [apply("shadow_step_strike", { to: "holder" }), removeMine("shadow_step", "marker")] }],
}));
helper(kit("shadow_step_strike", "SHADOW STEP", "Its next hit deals triple damage.", {
  stacking: "fizzle", boosts: both(200),
  reactions: [{ on: { event: "hit_lands" }, do: [removeMine("shadow_step_strike")] }],
}));

abilityUp({
  id: "backstab", cls: "assassin",
  power: "40% more damage.",
  a: { name: "Coup de grâce", text: "Has Seek. Deals physical damage that scales from Crit chance to the foe with the lowest current HP. When it knocks that foe out, Backstab is ready again.", builds: ["hunt"] },
  b: { name: "From the shadows", text: "Has Seek. Waits until the Assassin is Hidden. Deals double physical damage that scales from Crit chance to the foe with the lowest current HP.", builds: ["ambush"] },
  form: (v, k) => ({
    ...(v === "a" ? { statuses: ["coup_de_grace"], note: "A kill the Assassin lands with any ability readies Backstab (Garrote's too): the ko event names the killer and the hit's kind, not which ability." } : {}),
    ...(v === "b" ? { if: { side: "self", where: { has: "hidden" } }, do: [phys(from("crit_chance", HIT.normal * 2 * k))] } : { do: [phys(hitOf("crit_chance", "normal", k))] }),
  }),
});
// Brought by the ability: a kill the Assassin lands with an ability makes Backstab ready. No limit but MP.
helper(kit("coup_de_grace", "COUP DE GRÂCE", "A kill with an ability makes Backstab ready again.", {
  show: "sheet", unremovable: true,
  reactions: [{ on: { event: "ko", whose: "foe", other: "holder", kind: "ability" }, do: [{ op: "cooldown", which: { ability: ["backstab"] }, set: "ready", to: "self" }] }],
}));

abilityUp({
  id: "garrote", cls: "assassin",
  power: "It costs less MP.",
  a: { name: "Choke", text: "Has Seek. Waits until a foe is in a wind-up. Deals physical damage that scales from Attack to the casting foe with the highest Attack or Magic, and applies Silence.", builds: ["lockdown"] },
  b: { name: "Garrote wire", text: "Has Seek. Deals physical damage that scales from Attack to a random foe that isn't Taunting, applies Rot, and adds many Bleed; stacks scale from Attack. No Silence.", builds: ["hunt"] },
  form: (v, _k, plus) => ({
    ...(plus ? { mp: 200 } : {}),
    ...(v === "a" ? { if: { side: "foes", where: { casting: true } }, target: T.castingFoe } : {}),
    // Unlike the base, it doesn't skip Silenced foes.
    ...(v === "b" ? { target: T.notTauntingFoe, do: [phys(hitOf("attack", "normal"), { apply: [{ status: "rot" }, { status: "bleed", stacks: stacks("many", "attack") }] })] } : {}),
  }),
});
