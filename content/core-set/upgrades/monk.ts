/** The Monk's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { ReactionT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { from, HIT, SPECIAL, stacks, STATUS } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, FIST_BURN, helper, hitOf, kit, marker, passiveUp, phys } from "./kit.js";

// ─── Monk ────────────────────────────────────────────────────────────────────

const sunderOn = (kind: "basic" | "extra" | "ability", k: number): ReactionT => ({ on: { event: "hit_lands", kind }, do: [apply("sunder", { stacks: own("few", "attack", k), to: "other" })] });
passiveUp({
  id: "iron_palm", cls: "monk",
  power: "40% more Sunder.",
  a: { name: "Hundred hands", text: "Every hit it lands adds a few Sunder: its basic attacks, Double strike's second strike, and its abilities' hits; stacks scale from Attack.", builds: ["cuts"] },
  b: { name: "Drinking palm", text: "Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack. Its hits on a Sundered foe heal it for 20% of the damage.", serves: "Pact ●●, Toll ●● ⚙ riposte (half)" },
  form: (v, k) => ({
    reactions: [
      // First, so its test reads the foe as the hit found it, before this hit's own Sunder lands.
      ...(v === "b" ? [{ on: { event: "hit_lands" }, if: { unit: "other", where: { has: "sunder" } }, do: [{ op: "heal", amount: { scale: [{ ratio: SPECIAL.lifesteal.high / 100, amount: true }] }, to: "self" }] } as ReactionT] : []),
      sunderOn("basic", k),
      sunderOn("extra", k),
      ...(v === "a" ? [sunderOn("ability", k)] : []),
    ],
  }),
});

// Flow state: two renewals a cast (each cast sets them back to two); while Hasted, each hit it lands counts, and the fifth renews the Haste.
const FLOW_RENEWALS = 2;
abilityUp({
  id: "flow", cls: "monk",
  power: "A shorter cooldown.",
  a: { name: "Flow state", text: "Applies Haste to itself. While that Haste lasts, every fifth hit it lands renews it, at most twice a cast.", builds: ["cuts"] },
  b: { name: "Stillness of mind", text: "Taunts, and raises its Evasion by 35 for as long as the Taunt. No Haste.", serves: "Toll 2 ●●● ⚙ riposte (half)" },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("short", "flow") } : {}),
    ...(v === "a" ? { do: [apply("haste"), apply("flow_state", { stacks: FLOW_RENEWALS })] } : {}),
    ...(v === "b" ? { do: [apply("taunt"), apply("stillness_of_mind")] } : {}),
  }),
});
helper(kit("flow_state", "FLOW STATE", "While Hasted, every fifth hit it lands renews its Haste.", {
  show: "sheet", stacking: "intensity", cap: FLOW_RENEWALS,
  reactions: [
    { on: { event: "hit_lands" }, if: { side: "self", where: { has: "haste" } }, do: [apply("flow_state_count", { stacks: 1, to: "self" })] },
    { on: { event: "status_capped", status: "flow_state_count" }, do: [apply("haste", { to: "holder" })] },
  ],
  trigger: { on: { event: "status_capped", status: "flow_state_count" } }, drop: { count: 1 },
}));
helper(kit("flow_state_count", "FLOW STATE", "Hits landed while Hasted; the fifth renews the Haste.", {
  stacking: "intensity", cap: 5, trigger: { on: { event: "status_capped", status: "flow_state_count" } }, drop: "all",
}));
// Statuses are universal: the Taunt at its own 20 ticks, and the Evasion beside it for as long.
helper(kit("stillness_of_mind", "STILLNESS OF MIND", "Evasion up.", { duration: STATUS.taunt.duration, stats: [{ stat: "evasion", flat: SPECIAL.evasion.high }] }));

abilityUp({
  id: "burning_fist", cls: "monk",
  power: "Its hits add 40% more of their status.",
  a: { name: "Frost fist", text: "Three quick hits on the foe with the most Chill; each deals damage that scales from Attack and adds a few Chill; stacks scale from Attack.", serves: "Snap 1 ●●●" },
  b: { name: "Fanned flames", text: "Five quick, light hits on the foe with the most Burn; each deals physical damage that scales from Attack and adds a little Burn; stacks scale from Attack.", builds: ["bonfire", "cuts"] },
  form: (v, k) =>
    v === "a" ? { target: T.mostFoe("chill"), do: [phys(from("attack", 0.11), { hits: 3, apply: [{ status: "chill", stacks: stacks("few", "attack", FIST_BURN * k) }] })] } // Burning fist's own share of the word.
      : v === "b" ? { do: [phys(from("attack", 0.07), { hits: 5, apply: [{ status: "burn", stacks: stacks("few", "attack", 0.4 * k) }] })] }
        : { do: [phys(from("attack", 0.11), { hits: 3, apply: [{ status: "burn", stacks: stacks("few", "attack", FIST_BURN * k) }] })] },
});

abilityUp({
  id: "pressure_point", cls: "monk",
  power: "40% more damage.",
  a: { name: "Lingering point", text: "Has Seek. Deals physical damage that scales from Attack to the foe with the highest Attack, and applies Stun. When that Stun ends, the foe is Slowed.", builds: [] },
  b: { name: "Vital strike", text: "Has Seek. Deals triple physical damage that scales from Attack to the foe with the lowest HP. No Stun.", builds: ["hunt"] },
  form: (v, k) =>
    v === "b" ? { target: T.lowestHpFoe, do: [phys(from("attack", HIT.normal * 3 * k))] }
      : { do: [phys(hitOf("attack", "normal", k), { apply: [{ status: "stun" }, ...(v === "a" ? [{ status: "lingering_point" }] : [])] })] },
});
// The Stun's own length; when it runs out, its holder is Slowed (if the Stun is lifted early, the Slow still comes when this ends).
helper(marker("lingering_point", "LINGERING POINT", "Slowed when this ends.", {
  duration: STATUS.stun.duration,
  reactions: [{ on: { event: "status_ended", status: "lingering_point", cause: ["expired"] }, do: [apply("slow", { to: "holder" })] }],
}));
