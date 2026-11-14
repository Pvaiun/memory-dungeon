/** The Frostweaver's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { HIT, P, STACKS, stacks, STATUS } from "../scale.js";
import { own } from "../pieces/kit.js";
import type { EffectT, TargetRuleT } from "../../../src/schema.js";
import { T } from "../classes.js";
import { abilityUp, apply, BLIZZARD_CHILL, helper, hitOf, kit, LANCE_CHILL, marker, ofHolder, passiveUp, phys, POWER, STILLNESS_CHILL } from "./kit.js";

// ─── Frostweaver ─────────────────────────────────────────────────────────────

/** Rime shield: the Shield from the Frostweaver's max HP on each shatter: the wall's body, which Mail and the rune sword carry. */
const RIME = 0.3;
passiveUp({
  id: "shatterpoint", cls: "frostweaver",
  power: "+40% Sunder.",
  a: { name: "Rime shield", text: "On a shatter: the ally with the lowest HP% gains a Shield of 30% of the Frostweaver's max HP, instead of the Sunder.", serves: "Snap 2 ●●, Toll ●● ⚙ frozen gate (half), detonation (half), brink (half)", plus: "+40% Shield." },
  b: { name: "Rime edge", text: "Basic attacks add Sunder. No Sunder on a shatter.", serves: "Cuts 2 ●●, Landslide ● ◆ the ramp, swing-status" },
  form: (v, k) => v === "b" ? ({
    // Rime edge: the passive outside the shatter: Sunder on every swing, a rider, at the few word (the Monk's Iron palm's own).
    reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("sunder", { stacks: own("few", "attack", k), to: "other" })] }],
  }) : ({
    reactions: [{
      on: { event: "status_capped", status: "chill", whose: "foe" },
      do: v === "a" ? [apply("shield", { stacks: ofHolder(RIME * k, "max_hp"), to: T.lowestShareAlly })]
        : [
          apply("sunder", { stacks: own("several", "attack", k), to: "owner" }),
        ],
    }],
  }),
});

const lanceChill = (word: "few" | "several", mult: number) => [{ status: "chill", stacks: stacks(word, "attack", mult) }];
abilityUp({
  id: "frost_lance", cls: "frostweaver",
  power: "+40% Chill.",
  shown: true,
  a: { name: "Ice spear", text: "A lance at the foe with the most Attack, adding Chill. Ignores Taunt.", builds: [] },
  b: { name: "Icicles", text: "Lances at the 3 foes with the most Chill, each adding more.", builds: ["snap"] },
  form: (v, k) =>
    v === "a" ? { seek: true, target: T.highestAMFoe, do: [phys(hitOf("attack", "normal"), { apply: lanceChill("several", LANCE_CHILL * k) })] } // The Chill class doesn't Slow: Chill is its slow.
      : v === "b" ? { target: { side: "foes", pick: "highest", by: { stacks: "chill" }, count: 3 }, do: [phys(hitOf("attack", "light"), { apply: lanceChill("few", LANCE_CHILL * k) })] }
        : { do: [phys(hitOf("attack", "normal"), { apply: lanceChill("several", LANCE_CHILL * k) })] },
});

/** Frost armor: for the Guard's length, a foe that hits its holder gains a few Chill, half again the passive's count, from the Frostweaver's Attack. */
const frostArmor = (sid: string, k: number) => helper(kit(sid, "FROST ARMOR", "Foes that hit it gain Chill.", {
  duration: STATUS.guard.duration,
  reactions: [{ on: { event: "hit_taken" }, do: [apply("chill", { stacks: { scale: [{ ratio: (1.5 * STACKS.few * k) / P, stat: "attack", of: "source" }] }, to: "other" })] }],
}));
frostArmor("frost_armor", 1);
frostArmor("frost_armor_plus", POWER);

abilityUp({
  id: "blizzard", cls: "frostweaver",
  power: "+40% damage, or +40% Chill.",
  shown: true,
  a: { name: "Frost armor", text: "Guards every ally. While the Guard lasts, foes that hit them gain Chill. No damage.", serves: "Snap 2 ●●, Toll 2 ●●● ⚙ frozen gate (key)", plus: "+40% Chill." },
  b: { name: "Avalanche", text: "Hits every foe, each harder for its Chill. No Chill.", builds: ["snap", "storm"] },
  form: (v, k) =>
    v === "a" ? { do: [apply("guard", { to: T.everyAlly }), apply(k > 1 ? "frost_armor_plus" : "frost_armor", { to: T.everyAlly })] }
      : v === "b" ? { do: [phys({ scale: [{ ratio: HIT.touch * k, stat: "attack" }, { ratio: 150 * k, stacks: "chill", of: "target" }] })] }
        : { do: [phys(hitOf("attack", "light", k), { apply: [{ status: "chill", stacks: stacks("few", "attack", BLIZZARD_CHILL) }] })] },
});

abilityUp({
  id: "stillness", cls: "frostweaver",
  power: "Costs less MP.",
  shown: true,
  a: { name: "Deep calm", text: "Clarity on the ally with the lowest MP%; its own next ability costs nothing. No Chill.", serves: "Barrage 2 ●●● ⚙ crescendo (half), mana as armour (half)" },
  b: { name: "Frozen moment", text: "Waits for a foe to cast. Chill on every casting foe, and Clarity on the ally with the lowest MP%.", builds: ["snap"] },
  form: (v, _k, plus) => ({
    ...(plus ? { mp: 450 } : {}),
    ...(v === "a" ? { target: T.lowestMpAlly, do: [apply("clarity"), apply("deep_calm", { to: "self" })] } : {}),
    ...(v === "b" ? {
      if: { side: "foes", where: { casting: true } },
      target: { side: "foes", where: { casting: true }, pick: "all" } as TargetRuleT,
      do: [apply("chill", { stacks: stacks("few", "attack", STILLNESS_CHILL * 3) }), apply("clarity", { to: T.needsMpAlly })],
    } : {}),
  }),
});
// The free cast lands a sub-tick after Deep calm resolves (a cue), so the cast that gave it doesn't spend it.
helper(marker("deep_calm", "DEEP CALM", "Next ability costs nothing.", {
  duration: 1,
  reactions: [{ on: { event: "status_gained", status: "deep_calm" }, do: [apply("deep_calm_free", { stacks: 1, to: "holder" })] }],
}));
helper(kit("deep_calm_free", "DEEP CALM", "Next ability costs nothing.", {
  stacking: "intensity", cap: 1, mods: [{ mp: -100 }],
  trigger: { on: { event: "action_resolve", kind: "ability" } }, drop: "all",
}));
