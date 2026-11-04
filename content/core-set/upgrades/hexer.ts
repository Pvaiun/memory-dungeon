/** The Hexer's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { own } from "../pieces/kit.js";
import { BURN_STACKS, HIT, stacks } from "../scale.js";
import { T } from "../classes.js";
import type { EffectT, TargetRuleT } from "../../../src/schema.js";
import { abilityUp, apply, cd, COLD_HEX, helper, magic, marker, passiveUp } from "./kit.js";

// ─── Hexer ───────────────────────────────────────────────────────────────────

passiveUp({
  id: "cold_hex", cls: "hexer",
  power: "Its basic attacks add 40% more.",
  a: { name: "Hex of flames", text: "Its basic attacks add a few Burn, whatever weapon it carries; stacks scale from Magic.", builds: ["bonfire"] },
  b: { name: "Deep cold", text: "Its basic attacks add Chill only to the foe with the most Chill, twice as many; stacks scale from Magic.", builds: ["snap"] },
  form: (v, k) => ({
    reactions: [{
      on: { event: "hit_lands", kind: "basic" },
      do: [
        v === "a" ? apply("burn", { stacks: own("few", "magic", BURN_STACKS * k), to: "other" }) // Kindling's own size: the Pyromancer's stays the bigger.
          : v === "b" ? apply("chill", { stacks: own("few", "magic", COLD_HEX * 2 * k), to: T.mostFoe("chill") }) // Wherever the swing landed; with none chilled, a random foe.
            : apply("chill", { stacks: own("few", "magic", COLD_HEX * k), to: "other" }),
      ],
    }],
  }),
});

abilityUp({
  id: "malison", cls: "hexer",
  power: "40% more of every status it adds.",
  a: { name: "Plague", text: "Adds a few Burn, a few Shock and a few Bleed to every foe; stacks scale from Magic.", builds: ["cuts", "harvest", "toll"] },
  b: { name: "Focused curse", text: "Adds Burn and Shock to the foe with the highest Attack or Magic, three times as many; stacks scale from Magic.", builds: ["bonfire", "lockdown"] },
  form: (v, k) =>
    v === "b"
      ? { target: T.highestAMFoe, do: [apply("burn", { stacks: stacks("few", "magic", 3 * k) }), apply("shock", { stacks: stacks("few", "magic", 3 * k) })] } // No Seek: a Taunting foe catches it first.
      : {
        ...(v === "a" ? { mp: 650 } : {}), // A rung up, for the third status.
        do: [apply("burn", { stacks: stacks("few", "magic", k) }), apply("shock", { stacks: stacks("few", "magic", k) }), ...(v === "a" ? [apply("bleed", { stacks: stacks("few", "magic", k) })] : [])],
      },
});

abilityUp({
  id: "unmake", cls: "hexer",
  power: "A shorter cooldown.",
  a: { name: "Silence all", text: "Silences every foe in a wind-up and strips their buffs. Waits until a foe is in a wind-up.", builds: ["lockdown"] },
  b: {
    name: "Broken spell", builds: ["overflow"],
    text: "Silences the casting foe with the highest Attack or Magic and strips its buffs. For each buff stripped, that foe takes light magical damage that scales from Magic, and the Hexer regains 200 MP. Waits until a foe is in a wind-up.",
  },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("short", "unmake") } : {}),
    ...(v === "a" ? { target: { side: "foes", where: { casting: true }, pick: "all" } as TargetRuleT } : {}), // An all-pick: the Taunt and Hidden rules don't apply.
    ...(v === "b"
      ? {
        do: [
          // Read before the strip: a light hit for each buff the target holds, and a marker holding the count, which pays the Hexer.
          magic({ scale: [{ ratio: HIT.light, count: "buffs", of: "target", times: { stat: "magic", of: "self" } }] }),
          apply("broken_spell", { stacks: { scale: [{ ratio: 1, count: "buffs", of: "target" }] } }),
          apply("silence"),
          { op: "remove", label: "buff" } as EffectT,
        ],
        note: "In an action, a number read `of: target` reads the unit the effect lands on, so an `mp` effect to the Hexer can't count the foe's buffs. The count rides a one-tick marker on the foe (broken_spell), whose reaction pays its source 200 MP a stack.",
      }
      : {}),
  }),
});
helper(marker("broken_spell", "BROKEN SPELL", "The Hexer that broke its spell regains MP for each buff it stripped.", {
  stacking: "intensity", perSource: {}, duration: 1,
  reactions: [{ on: { event: "status_gained", status: "broken_spell" }, actor: "source", do: [{ op: "mp", amount: { scale: [{ ratio: 200, stacks: "broken_spell", of: "holder" }] }, to: "source" }] }],
}));

abilityUp({
  id: "enfeeble", cls: "hexer",
  power: "40% more Sunder; if it adds none, it costs less MP.",
  a: { name: "Wither", text: "Weakens every foe.", builds: ["toll", "lockdown"], plus: "It costs less MP." },
  b: { name: "Expose", text: "Adds many Sunder to the foe with the lowest HP; stacks scale from Magic.", builds: ["hunt", "cuts"], plus: "40% more Sunder." },
  form: (v, k, plus) =>
    v === "a" ? { target: T.everyFoe, cooldown: cd("medium", "enfeeble"), mp: plus ? 450 : 650, do: [apply("weaken")] }
      : v === "b" ? { target: T.lowestHpFoe, do: [apply("sunder", { stacks: stacks("many", "magic", k) })] } // The lowest current HP, no Seek.
        : { do: [apply("weaken"), apply("sunder", { stacks: stacks("few", "magic", k) })] },
});
