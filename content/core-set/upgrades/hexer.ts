/** The Hexer's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { own } from "../pieces/kit.js";
import { BURN_STACKS, stacks } from "../scale.js";
import { DEEPENED, T } from "../classes.js";
import type { EffectT, TargetRuleT } from "../../../src/schema.js";
import { abilityUp, apply, cd, COLD_HEX, helper, marker, passiveUp, phys } from "./kit.js";

// ─── Hexer ───────────────────────────────────────────────────────────────────

passiveUp({
  id: "cold_hex", cls: "hexer",
  power: "Its basic attacks add 40% more.",
  a: { name: "Hex of flames", text: "Its basic attacks add a few Burn, whatever weapon it carries; stacks scale from Attack.", builds: ["bonfire"] },
  b: { name: "Withering hex", text: "Its basic attacks Weaken their target in place of the Chill.", builds: ["toll", "lockdown"], plus: "" },
  form: (v, k) => ({
    reactions: [{
      on: { event: "hit_lands", kind: "basic" },
      do: [
        v === "a" ? apply("burn", { stacks: own("few", "attack", BURN_STACKS * k), to: "other" }) // Kindling's own size: the Pyromancer's stays the bigger.
          : v === "b" ? apply("weaken", { to: "other" }) // Weaken at its own length: a lock on the swing's target, nothing to grow.
            : apply("chill", { stacks: own("few", "attack", COLD_HEX * k), to: "other" }),
      ],
    }],
  }),
});

/** Malison deepens: one more stack of each affliction a foe holds (0 on a foe without it), and a few Bleed of its own. */
const deepen = (k: number, to?: TargetRuleT) => DEEPENED.map((st) => apply(st, { stacks: { scale: [{ ratio: k, when: { has: st }, of: "target" }] }, ...(to ? { to } : {}) }));
abilityUp({
  id: "malison", cls: "hexer",
  power: "40% more of every status it adds.",
  a: { name: "Plague", text: "Deepens every affliction each foe holds, and adds a few Burn, a few Shock and a few Bleed of its own to every foe; stacks scale from Attack.", builds: ["bonfire", "harvest", "cuts"] },
  b: { name: "Focused curse", text: "Deepens the afflictions of the foe with the highest Attack alone, three times over, and adds it a few Bleed, three times as many; stacks scale from Attack.", builds: ["lockdown", "hunt"] },
  form: (v, k) =>
    v === "b"
      ? { target: T.highestAMFoe, do: [...deepen(3 * k), apply("bleed", { stacks: stacks("few", "attack", 3 * k) })] } // No Seek: a Taunting foe catches it first.
      : {
        ...(v === "a" ? { mp: 650 } : {}), // A rung up, for the statuses of its own.
        do: [...deepen(k), apply("bleed", { stacks: stacks("few", "attack", k) }), ...(v === "a" ? [apply("burn", { stacks: stacks("few", "attack", k) }), apply("shock", { stacks: stacks("few", "attack", k) })] : [])],
      },
});

/** Mana burn: the share of the foe's MP it drains, which the Hexer gains (a marker on the foe pays its source, as a number read `of: target` can't reach the caster). */
const MANA_BURN = 0.2;
abilityUp({
  id: "unmake", cls: "hexer",
  power: "A shorter cooldown.",
  a: { name: "Silence all", text: "Silences every foe in a wind-up and strips their buffs. Waits until a foe is in a wind-up.", builds: ["lockdown"] },
  b: { name: "Mana burn", text: "Silences the casting foe with the highest Attack and strips its buffs, and drains a fifth of its MP, which the Hexer gains. Waits until a foe is in a wind-up.", builds: ["overflow", "lockdown"] },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("short", "unmake") } : {}),
    ...(v === "a" ? { target: { side: "foes", where: { casting: true }, pick: "all" } as TargetRuleT } : {}), // An all-pick: the Taunt and Hidden rules don't apply.
    ...(v === "b"
      ? { do: [{ op: "mp", amount: { scale: [{ ratio: -MANA_BURN, stat: "max_mp", of: "target" }] } } as EffectT, apply("mana_burn"), apply("silence"), { op: "remove", label: "buff" } as EffectT] }
      : {}),
  }),
});
helper(marker("mana_burn", "MANA BURN", "The Hexer that burned its mana gains a share of it.", {
  perSource: {}, duration: 1,
  reactions: [{ on: { event: "status_gained", status: "mana_burn" }, actor: "source", do: [{ op: "mp", amount: { scale: [{ ratio: MANA_BURN, stat: "max_mp", of: "holder" }] }, to: "source" }] }],
}));

abilityUp({
  id: "enfeeble", cls: "hexer",
  power: "40% more Sunder; if it adds none, it costs less MP.",
  a: { name: "Wither", text: "Weakens every foe.", builds: ["toll", "lockdown"], plus: "It costs less MP." },
  b: { name: "Expose", text: "Adds many Sunder to the foe with the lowest HP; stacks scale from Attack.", builds: ["hunt", "cuts"], plus: "40% more Sunder." },
  form: (v, k, plus) =>
    v === "a" ? { target: T.everyFoe, cooldown: cd("medium", "enfeeble"), mp: plus ? 450 : 650, do: [apply("weaken")] }
      : v === "b" ? { target: T.lowestHpFoe, do: [apply("sunder", { stacks: stacks("many", "attack", k) })] } // The lowest current HP, no Seek.
        : { do: [apply("weaken"), apply("sunder", { stacks: stacks("few", "attack", k) })] },
});
