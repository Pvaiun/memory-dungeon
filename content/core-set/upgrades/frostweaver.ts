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
  power: "A shatter adds 40% more Sunder.",
  a: { name: "Rime shield", text: "When a foe's Chill shatters, the ally with the lowest share of max HP gains a Shield from the Frostweaver's max HP, in place of the Sunder.", serves: "Snap 2 ●●, Toll ●● ⚙ frozen gate (half), detonation (half), brink (half)", plus: "A Shield two fifths bigger." },
  b: { name: "Splinters", text: "When a foe's Chill shatters, that foe takes several Sunder (stacks scale from Attack), and every other foe gains a third of the Chill it held.", serves: "Snap 2 ●●● ⚙ firecracker (key)" },
  form: (v, k) => ({
    reactions: [{
      on: { event: "status_capped", status: "chill", whose: "foe" },
      do: v === "a" ? [apply("shield", { stacks: ofHolder(RIME * k, "max_hp"), to: T.lowestShareAlly })]
        : [
          apply("sunder", { stacks: own("several", "attack", k), to: "owner" }),
          // Splinters: a third of the cold the foe held, passed on, so a chain of shatters dies down.
          ...(v === "b" ? [apply("chill", { stacks: { scale: [{ ratio: 1 / 3, amount: true }] }, to: { side: "foes", pick: "all", exclude: "owner" }, passed: true }) as EffectT] : []),
        ],
    }],
  }),
});

const lanceChill = (word: "few" | "several", mult: number) => [{ status: "chill", stacks: stacks(word, "attack", mult) }];
abilityUp({
  id: "frost_lance", cls: "frostweaver",
  power: "40% more Chill.",
  a: { name: "Ice spear", text: "Has Seek. Deals damage that scales from Attack to the foe with the highest Attack, adding several Chill; stacks scale from Attack.", builds: [] },
  b: { name: "Icicles", text: "Three lances at the three foes with the most Chill: each deals smaller damage that scales from Attack and adds a few Chill; stacks scale from Attack.", builds: ["snap"] },
  form: (v, k) =>
    v === "a" ? { seek: true, target: T.highestAMFoe, do: [phys(hitOf("attack", "normal"), { apply: lanceChill("several", LANCE_CHILL * k) })] } // The Chill class doesn't Slow: Chill is its slow.
      : v === "b" ? { target: { side: "foes", pick: "highest", by: { stacks: "chill" }, count: 3 }, do: [phys(hitOf("attack", "light"), { apply: lanceChill("few", LANCE_CHILL * k) })] }
        : { do: [phys(hitOf("attack", "normal"), { apply: lanceChill("several", LANCE_CHILL * k) })] },
});

/** Frost armor: for the Guard's length, a foe that hits its holder gains a few Chill, half again the passive's count, from the Frostweaver's Attack. */
const frostArmor = (sid: string, k: number) => helper(kit(sid, "FROST ARMOR", "A foe that hits it gains a few Chill.", {
  duration: STATUS.guard.duration,
  reactions: [{ on: { event: "hit_taken" }, do: [apply("chill", { stacks: { scale: [{ ratio: (1.5 * STACKS.few * k) / P, stat: "attack", of: "source" }] }, to: "other" })] }],
}));
frostArmor("frost_armor", 1);
frostArmor("frost_armor_plus", POWER);

abilityUp({
  id: "blizzard", cls: "frostweaver",
  power: "40% more damage; if it deals none, 40% more Chill.",
  a: { name: "Frost armor", text: "Guards every ally. For as long as that Guard, a foe that hits a Guarded ally gains a few Chill; stacks scale from the Frostweaver's Attack. Deals no damage.", serves: "Snap 2 ●●, Toll 2 ●●● ⚙ frozen gate (key)", plus: "40% more Chill." },
  b: { name: "Avalanche", text: "Deals damage that scales from Attack to every foe, rising by 150 with each Chill stack on that foe. Adds no Chill.", builds: ["snap", "storm"], plus: "40% more damage." },
  form: (v, k) =>
    v === "a" ? { do: [apply("guard", { to: T.everyAlly }), apply(k > 1 ? "frost_armor_plus" : "frost_armor", { to: T.everyAlly })] }
      : v === "b" ? { do: [phys({ scale: [{ ratio: HIT.touch * k, stat: "attack" }, { ratio: 150 * k, stacks: "chill", of: "target" }] })] }
        : { do: [phys(hitOf("attack", "light", k), { apply: [{ status: "chill", stacks: stacks("few", "attack", BLIZZARD_CHILL) }] })] },
});

abilityUp({
  id: "stillness", cls: "frostweaver",
  power: "It costs less MP.",
  a: { name: "Deep calm", text: "Applies Clarity to the ally with the least MP, and the Frostweaver's next ability costs nothing. No Chill.", serves: "Barrage 2 ●●● ⚙ crescendo (half), mana as armour (half)" },
  b: { name: "Frozen moment", text: "Waits until a foe is in a wind-up. Applies Clarity as before, and adds Chill only to foes in a wind-up, three times as many; stacks scale from Attack.", builds: ["snap"] },
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
helper(marker("deep_calm", "DEEP CALM", "Its next ability costs nothing.", {
  duration: 1,
  reactions: [{ on: { event: "status_gained", status: "deep_calm" }, do: [apply("deep_calm_free", { stacks: 1, to: "holder" })] }],
}));
helper(kit("deep_calm_free", "DEEP CALM", "Its next ability costs nothing.", {
  stacking: "intensity", cap: 1, mods: [{ mp: -100 }],
  trigger: { on: { event: "action_resolve", kind: "ability" } }, drop: "all",
}));
