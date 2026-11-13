/** The Vampire's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { EffectT, ReactionT, StatusT } from "../../../src/schema.js";
import { T } from "../classes.js";
import { from, SPECIAL, stacks } from "../scale.js";
import { abilityUp, apply, cd, helper, kit, marker, passiveUp, phys, r6, removeMine } from "./kit.js";

// ─── Vampire ─────────────────────────────────────────────────────────────────

/** Bloodlust's doubling (classes.ts bloodlust_on), and the power step's two and a half times, as on-states that Bloodlust's reactions keep. */
const lustOn = (id: string, name: string, times: number, extra: Partial<StatusT> = {}): StatusT =>
  kit(id, name, times === 1 ? "Lifesteal doubled." : "Lifesteal 150% higher.", { stacking: "fizzle", stats: [{ stat: "lifesteal", flat: { scale: [{ ratio: times, stat: "lifesteal", of: "holder" }] } }], ...extra });
const feast: ReactionT = {
  // The other ally lowest in HP share gets as much as the Vampire drinks: Lifesteal's own shape (its `times`, read live).
  on: { event: "hit_lands" },
  do: [{ op: "heal", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "lifesteal", of: "holder" } }] }, to: T.otherLowestShareAlly }],
};
helper(lustOn("bloodlust_on_plus", "BLOODLUST", 1.5));
helper(lustOn("shared_feast_on", "SHARED FEAST", 1, { text: "Lifesteal doubled; each hit it lands heals the ally lowest in HP as much as it drank.", reactions: [feast] }));
helper(lustOn("shared_feast_on_plus", "SHARED FEAST", 1.5, { text: "Lifesteal 150% higher; each hit it lands heals the ally lowest in HP as much as it drank.", reactions: [feast] }));
// Undying thirst: for 5 ticks, an HP floor and Lifesteal tripled in place of the doubling (or of the power step's two and a
// half): read once as it lands, on top of the on-state Bloodlust has just given it (half again of 40, or a fifth of 50).
const UNDYING = 5;
const thirst = (id: string, ratio: number): StatusT =>
  kit(id, "UNDYING THIRST", "Can't fall below 1 HP; Lifesteal tripled.", { stacking: "fizzle", duration: UNDYING, floor: {}, stats: [{ stat: "lifesteal", flat: { scale: [{ ratio, stat: "lifesteal", of: "holder" }] } }] });
helper(thirst("undying_thirst", 0.5));
helper(thirst("undying_thirst_plus", 0.2));
// Once a fight, through a knockout too.
helper(marker("undying_thirst_spent", "UNDYING THIRST", "Spent this fight.", { stacking: "fizzle", survivesKO: true }));

passiveUp({
  id: "bloodlust", cls: "vampire",
  power: "Below 50% of its max HP, its Lifesteal is 150% higher, not doubled.",
  a: { name: "Shared feast", text: "While it's below 50% of its max HP, its Lifesteal is doubled, and each hit it lands heals the other ally with the lowest share of HP as much as it drank.", builds: ["pact"] },
  b: { name: "Undying thirst", text: "While it's below 50% of its max HP, its Lifesteal is doubled. Once a fight, when it falls below 10% of its max HP, for 5 ticks it can't fall below 1 HP and its Lifesteal is tripled.", builds: ["pact"] },
  form: (v, _k, plus) => {
    const on = v === "a" ? (plus ? "shared_feast_on_plus" : "shared_feast_on") : plus ? "bloodlust_on_plus" : "bloodlust_on";
    return {
      reactions: [
        { on: { event: "hp_lost" }, do: [apply(on, { to: { side: "self", where: { hpBelow: 50 } } })] },
        { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: on, to: { side: "self", where: { hpAtLeast: 50 } } } as EffectT] },
        ...(v === "b" ? [{
          on: { event: "hp_lost" }, if: { side: "self", where: { hpBelow: 10, lacks: "undying_thirst_spent" } },
          do: [apply(plus ? "undying_thirst_plus" : "undying_thirst", { to: "self" }), apply("undying_thirst_spent", { to: "self" })],
        } as ReactionT] : []),
      ],
    };
  },
});

abilityUp({
  id: "blood_drain", cls: "vampire",
  power: "40% more damage.",
  a: { name: "Savage drain", text: "Three quick hits on a random foe, each 33% of the damage, scaling from max HP, each drinking; the foe is Weakened.", serves: "Cuts 1 ●●●, Pact ●●" },
  b: { name: "Drain the well", text: "Deals physical damage that scales from max HP to a random foe, and drains MP from it: 25% of the damage dealt, given to the ally with the least MP. No Weaken.", serves: "Barrage 1 ●●●" },
  form: (v, k) =>
    v === "a" ? { do: [phys(from("max_hp", r6((0.4 * k) / 3)), { hits: 3, apply: [{ status: "weaken" }] })] }
      // A one-tick marker on the Vampire hears the cast's own hit and drains as Siphon does.
      : v === "b" ? { do: [apply("drain_the_well", { to: "self" }), phys(from("max_hp", 0.4 * k))] }
        : { do: [phys(from("max_hp", 0.4 * k), { apply: [{ status: "weaken" }] })] },
});
helper(marker("drain_the_well", "DRAIN THE WELL", "Its ability's hit drains MP for the ally with the least.", {
  duration: 1,
  reactions: [{
    on: { event: "hit_lands", kind: "ability" },
    do: [
      { op: "mp", amount: { scale: [{ ratio: -0.25, amount: true }] }, to: "other" },
      { op: "mp", amount: { scale: [{ ratio: 0.25, amount: true }] }, to: { side: "allies", pick: "lowest", by: "mp_share" } },
    ],
  }],
}));

/** Blood gift's price: a fifth of its max HP, paid, not damage. */
const PRICE = 0.2;
const price: EffectT = { op: "pay", hp: from("max_hp", PRICE), to: "self" };
abilityUp({
  id: "blood_gift", cls: "vampire",
  power: "It gives 40% more than it pays.",
  a: { name: "Blood for mana", text: "Spends 20% of its max HP to give the other ally with the least MP as much MP, and gives it Clarity. Waits until another ally is under 50% of its max MP and the Vampire is at 35% of its max HP or more.", serves: "Barrage 2 ●●●, Pact ●● ⚙ mana as armour (half)" },
  b: { name: "Lifeblood", text: "Waits until an ally is knocked out. Spends 20% of its max HP to revive it with as much HP. Waits too until the Vampire is at 35% of its max HP or more.", builds: [] },
  form: (v, k) =>
    v === "a" ? {
      if: [{ side: "others", where: { mpBelow: 50 } }, { side: "self", where: { hpAtLeast: 35 } }],
      target: { side: "others", pick: "lowest", by: "mp_share" },
      do: [price, { op: "mp", amount: from("max_hp", PRICE * k) }, apply("clarity")],
    }
      : v === "b" ? {
        // The revives' word and price; every action on its full cooldown.
        cooldown: cd("very_long", "blood_gift"), mp: 650,
        if: [{ side: "allies", where: { ko: true } }, { side: "self", where: { hpAtLeast: 35 } }],
        target: T.koAlly,
        do: [price, { op: "revive", hp: { scale: [{ ratio: PRICE * k, stat: "max_hp", of: "self" }] } }],
      }
        : { do: [price, { op: "heal", amount: from("max_hp", PRICE * k) }, apply("clarity")] },
});

abilityUp({
  id: "frenzy", cls: "vampire",
  power: "40% more Might.",
  a: { name: "Feeding frenzy", text: "Adds several Might to itself; stacks scale from Attack. While it holds Might, its Lifesteal is 10 higher.", builds: ["pact"] },
  b: { name: "Bloodthirst", text: "Adds several Might to itself; stacks scale from Attack. While it holds Might, its basic attacks come 33% faster.", builds: ["cuts", "pact"] },
  form: (v, k) => ({ do: [apply("might", { stacks: stacks("several", "attack", k) }), ...(v === "a" ? [apply("feeding_frenzy", { to: "self" })] : v === "b" ? [apply("bloodthirst", { to: "self" })] : [])] }),
});
helper(kit("bloodthirst", "BLOODTHIRST", "Basic attacks 33% faster while it holds Might.", {
  stats: [{ stat: "attack_speed", flat: 33 }],
  reactions: [{ on: { event: "status_ended", status: "might" }, do: [removeMine("bloodthirst")] }],
}));
helper(kit("feeding_frenzy", "FEEDING FRENZY", "Lifesteal up while it holds Might.", {
  stats: [{ stat: "lifesteal", flat: SPECIAL.lifesteal.medium }],
  reactions: [{ on: { event: "status_ended", status: "might" }, do: [removeMine("feeding_frenzy")] }],
}));
