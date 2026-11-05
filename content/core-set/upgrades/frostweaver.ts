/** The Frostweaver's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import { HIT, stacks, STATUS } from "../scale.js";
import { own } from "../pieces/kit.js";
import type { EffectT, TargetRuleT } from "../../../src/schema.js";
import { T } from "../classes.js";
import { abilityUp, apply, BLIZZARD_CHILL, helper, hitOf, kit, LANCE_CHILL, magic, marker, pierce, passiveUp, STILLNESS_CHILL } from "./kit.js";

// ─── Frostweaver ─────────────────────────────────────────────────────────────

/** Splinters: a third of a shatter's damage at the cap (12 × 250). */
const SPLINTERS = (STATUS.chill.shatter * STATUS.chill.cap) / 3;
passiveUp({
  id: "shatterpoint", cls: "frostweaver",
  power: "A shatter adds 40% more Sunder.",
  a: { name: "Brittle", text: "When a foe's Chill shatters, that foe takes several Sunder and is Silenced; stacks scale from Magic.", builds: ["lockdown"] },
  b: { name: "Splinters", text: "When a foe's Chill shatters, that foe takes several Sunder, and every other foe takes a third of the shatter's damage; stacks scale from Magic.", builds: ["harvest", "snap"] },
  form: (v, k) => ({
    reactions: [{
      on: { event: "status_capped", status: "chill", whose: "foe" },
      do: [
        apply("sunder", { stacks: own("several", "magic", k), to: "owner" }),
        ...(v === "a" ? [apply("silence", { to: "owner" })] : []),
        ...(v === "b" ? [{ op: "damage", type: "none", amount: SPLINTERS, to: { side: "foes", pick: "all", exclude: "owner" } } as EffectT] : []),
      ],
    }],
  }),
});

const lanceChill = (word: "few" | "several", mult: number) => [{ status: "chill", stacks: stacks(word, "magic", mult) }];
abilityUp({
  id: "frost_lance", cls: "frostweaver",
  power: "40% more Chill.",
  a: { name: "Ice spear", text: "Deals magical damage that scales from Magic to the foe with the highest Attack or Magic, adds several Chill and Slows it; stacks scale from Magic.", builds: ["lockdown"] },
  b: { name: "Icicles", text: "Three lances at the three foes with the most Chill: each deals smaller magical damage that scales from Magic and adds a few Chill; stacks scale from Magic.", builds: ["snap"] },
  form: (v, k) =>
    v === "a" ? { target: T.highestAMFoe, do: [magic(hitOf("magic", "light"), { apply: [...lanceChill("several", LANCE_CHILL * k), { status: "slow" }] })] } // No Seek.
      : v === "b" ? { target: { side: "foes", pick: "highest", by: { stacks: "chill" }, count: 3 }, do: [magic(hitOf("magic", "touch"), { apply: lanceChill("few", LANCE_CHILL * k) })] }
        : { do: [magic(hitOf("magic", "light"), { apply: lanceChill("several", LANCE_CHILL * k) })] },
});

abilityUp({
  id: "blizzard", cls: "frostweaver",
  power: "40% more damage; if it deals none, 40% more Chill.",
  a: { name: "Whiteout", text: "Adds a few Chill to every foe, twice as many as Blizzard's; stacks scale from Magic. Deals no damage.", builds: ["snap", "lockdown"], plus: "40% more Chill." },
  b: { name: "Avalanche", text: "Deals piercing damage that scales from Magic to every foe, rising by 150 with each Chill stack on that foe. Adds no Chill.", builds: ["snap", "harvest"], plus: "40% more damage." },
  form: (v, k) =>
    v === "a" ? { do: [apply("chill", { stacks: stacks("few", "magic", BLIZZARD_CHILL * 2 * k) })] }
      : v === "b" ? { do: [pierce({ scale: [{ ratio: HIT.touch * k, stat: "magic" }, { ratio: 150 * k, stacks: "chill", of: "target" }] })] }
        : { do: [magic(hitOf("magic", "touch", k), { apply: [{ status: "chill", stacks: stacks("few", "magic", BLIZZARD_CHILL) }] })] },
});

abilityUp({
  id: "stillness", cls: "frostweaver",
  power: "It costs less MP.",
  a: { name: "Deep calm", text: "Applies Clarity to the ally with the least MP, and the Frostweaver's next ability costs nothing. No Chill.", builds: ["overflow"] },
  b: { name: "Frozen moment", text: "Waits until a foe is in a wind-up. Applies Clarity as before, and adds Chill only to foes in a wind-up, three times as many; stacks scale from Magic.", builds: ["lockdown", "snap"] },
  form: (v, _k, plus) => ({
    ...(plus ? { mp: 450 } : {}),
    ...(v === "a" ? { target: T.lowestMpAlly, do: [apply("clarity"), apply("deep_calm", { to: "self" })] } : {}),
    ...(v === "b" ? {
      if: { side: "foes", where: { casting: true } },
      target: { side: "foes", where: { casting: true }, pick: "all" } as TargetRuleT,
      do: [apply("chill", { stacks: stacks("few", "magic", STILLNESS_CHILL * 3) }), apply("clarity", { to: T.needsMpAlly })],
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
