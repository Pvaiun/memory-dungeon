/** The Hexer's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { own } from "../pieces/kit.js";
import { BURN_STACKS, HIT, stacks } from "../scale.js";
import { curse, T } from "../classes.js";
import type { EffectT, TargetRuleT } from "../../../src/schema.js";
import { abilityUp, apply, cd, COLD_HEX, helper, marker, passiveUp, phys } from "./kit.js";

// ─── Hexer ───────────────────────────────────────────────────────────────────

passiveUp({
  id: "cold_hex", cls: "hexer",
  power: "Its basic attacks add 40% more.",
  a: { name: "Hex of flames", text: "Its basic attacks add a few Burn, whatever weapon it carries; stacks scale from Attack.", serves: "Bonfire 1 ●●● ⚙ lead's colour (half)" },
  b: { name: "Withering hex", text: "Its basic attacks Weaken their target in place of the Chill.", builds: ["toll"], plus: "" },
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

/** Malison curses: a hit, a fifth more for each different affliction its foe holds, then the statuses of its own, after the hit. */
const cursed = (ratio: number) => phys(curse(ratio));
abilityUp({
  id: "malison", cls: "hexer",
  power: "40% more damage, and 40% more of every status it adds.",
  a: { name: "Plague", text: "Curses every foe for 60% of Malison's damage, scaling from Attack, 20% more for each different affliction the foe holds (Burn, Chill, Shock, Bleed, Sunder), then a few Burn, a few Shock and a few Bleed; stacks scale from Attack.", serves: "Bonfire ●●, Storm ●●, Cuts ●● ⚙ every colour (key), red rain (half)" },
  b: { name: "Focused curse", text: "Curses the foe with the highest Attack alone: three times Malison's damage, scaling from Attack, 20% more for each different affliction it holds (Burn, Chill, Shock, Bleed, Sunder), then three times the Bleed; stacks scale from Attack.", serves: "Hunt ●● ⚙ every colour (half)" },
  form: (v, k) =>
    v === "b"
      ? { target: T.highestAMFoe, do: [cursed(3 * HIT.light * k), apply("bleed", { stacks: stacks("few", "attack", 3 * k) })] } // No Seek: a Taunting foe catches it first.
      : {
        ...(v === "a" ? { mp: 650 } : {}), // A rung up, for the statuses of its own.
        do: [cursed((v === "a" ? HIT.touch : HIT.light) * k), ...(v === "a" ? [apply("burn", { stacks: stacks("few", "attack", k) }), apply("shock", { stacks: stacks("few", "attack", k) })] : []), apply("bleed", { stacks: stacks("few", "attack", k) })],
      },
});

/** Mana burn: the share of the foe's MP it drains, which the Hexer gains (a marker on the foe pays its source, as a number read `of: target` can't reach the caster). */
const MANA_BURN = 0.2;
abilityUp({
  id: "unmake", cls: "hexer",
  power: "A shorter cooldown.",
  a: { name: "Silence all", text: "Silences every foe in a wind-up and strips their buffs. Waits until a foe is in a wind-up.", builds: [] },
  b: { name: "Mana burn", text: "Silences the casting foe with the highest Attack and strips its buffs, and drains 20% of its MP, which the Hexer gains. Waits until a foe is in a wind-up.", builds: ["barrage"] },
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
  a: { name: "Wither", text: "Weakens every foe.", builds: ["toll"], plus: "It costs less MP." },
  b: { name: "Expose", text: "Adds many Sunder to the foe with the lowest HP; stacks scale from Attack.", builds: ["hunt", "cuts"], plus: "40% more Sunder." },
  form: (v, k, plus) =>
    v === "a" ? { target: T.everyFoe, cooldown: cd("medium", "enfeeble"), mp: plus ? 450 : 650, do: [apply("weaken")] }
      : v === "b" ? { target: T.lowestHpFoe, do: [apply("sunder", { stacks: stacks("many", "attack", k) })] } // The lowest current HP, no Seek.
        : { do: [apply("weaken"), apply("sunder", { stacks: stacks("few", "attack", k) })] },
});
