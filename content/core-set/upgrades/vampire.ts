/** The Vampire's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { EffectT, ReactionT, StatusT } from "../../../src/schema.js";
import { T } from "../classes.js";
import { from, SPECIAL, stacks } from "../scale.js";
import { abilityUp, apply, cd, helper, kit, marker, passiveUp, phys, r6, removeMine } from "./kit.js";

// ─── Vampire ─────────────────────────────────────────────────────────────────

/** Bloodlust's doubling (classes.ts bloodlust_on), and the power step's two and a half times, as on-states that Bloodlust's reactions keep. */
const lustOn = (id: string, name: string, times: number, extra: Partial<StatusT> = {}): StatusT =>
  kit(id, name, times === 1 ? "Lifesteal doubled." : "Lifesteal ×2.5.", { stacking: "fizzle", stats: [{ stat: "lifesteal", flat: { scale: [{ ratio: times, stat: "lifesteal", of: "holder" }] } }], ...extra });
const feast: ReactionT = {
  // The other ally lowest in HP share gets as much as the Vampire drinks: Lifesteal's own shape (its `times`, read live).
  on: { event: "hit_lands" },
  do: [{ op: "heal", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "lifesteal", of: "holder" } }] }, to: T.otherLowestShareAlly }],
};
helper(lustOn("bloodlust_on_plus", "BLOODLUST", 1.5));
helper(lustOn("shared_feast_on", "SHARED FEAST", 1, { text: "Lifesteal doubled; each hit heals the other ally with the lowest HP% as much as it drank.", reactions: [feast] }));
helper(lustOn("shared_feast_on_plus", "SHARED FEAST", 1.5, { text: "Lifesteal ×2.5; each hit heals the other ally with the lowest HP% as much as it drank.", reactions: [feast] }));
// Undying thirst: for 5 ticks, an HP floor and Lifesteal three times its own in place of the doubling (or of the power step's two and a
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
  power: "Lifesteal ×2.5 instead of doubled.",
  a: { name: "Shared feast", text: "Below half HP: Lifesteal doubled, and each hit heals the other ally with the lowest HP% as much as it drank.", builds: ["pact"] },
  b: { name: "Undying thirst", text: "Below half HP: Lifesteal doubled. Once a fight, below 10% HP: for 5 ticks it can't fall below 1 HP, and Lifesteal triples.", builds: ["pact"] },
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
  power: "+40% damage.",
  shown: true,
  a: { name: "Savage drain", text: "Three drains on a random foe, Weakening it.", serves: "Cuts 1 ●●●, Pact ●●" },
  b: { name: "Drain the well", text: "Drains a random foe; the ally with the lowest MP% gains MP: 25% of the damage. No Weaken.", serves: "Barrage 1 ●●●" },
  form: (v, k) =>
    v === "a" ? { do: [phys(from("max_hp", r6((0.4 * k) / 3)), { hits: 3, apply: [{ status: "weaken" }] })] }
      // A one-tick marker on the Vampire hears the cast's own hit and drains as Siphon does.
      : v === "b" ? { do: [apply("drain_the_well", { to: "self" }), phys(from("max_hp", 0.4 * k))] }
        : { do: [phys(from("max_hp", 0.4 * k), { apply: [{ status: "weaken" }] })] },
});
helper(marker("drain_the_well", "DRAIN THE WELL", "Its hit gives MP to the ally with the lowest MP%.", {
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
  power: "Gives 40% more than it pays.",
  shown: true,
  a: { name: "Blood for mana", text: "Pays 20% of its max HP to give the other ally with the lowest MP% as much MP, and Clarity. Waits for one under half MP.", serves: "Barrage 2 ●●●, Pact ●● ⚙ mana as armour (half)" },
  b: { name: "Lifeblood", text: "Pays 20% of its max HP to revive a fallen ally with as much HP.", builds: [], plus: "It revives with 40% more than it pays." },
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
  power: "+40% Might.",
  shown: true,
  a: { name: "Feeding frenzy", text: "Might on itself. While it holds Might: +10 Lifesteal.", builds: ["pact"] },
  b: { name: "Bloodthirst", text: "Might on itself. While it holds Might: basic attacks 33% faster.", builds: ["cuts", "pact"] },
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
