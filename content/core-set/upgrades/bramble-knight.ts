/** The Bramble knight's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, EffectT, ReactionT, StatusT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { SPECIAL, STATUS } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, kit, marker, ofHolder, passiveUp, phys, POWER, removeMine } from "./kit.js";

{
  /**
   * Briar's Bleed on each blow its Thorns deal. Every form also hears Heart of the briar's strikes (the mythic's Thorns on every foe), which
   * Briar follows; the base Briar is classes.ts's, so the mythic itself bleeds for it (see Heart of the briar).
   */
  const bleedOn = (status: string, k: number, more: EffectT[] = []): ReactionT => ({ on: { event: "damage_dealt", status }, do: [apply("bleed", { stacks: own("few", "defense", k), to: "other" }), ...more] });
  const THORNS = ["thorns", "heart_of_the_briar"];
  const plain = (k: number) => THORNS.map((s) => bleedOn(s, k));
  /** Bloodroot: a debuff that knows its source; each action its holder takes heals the Bramble knight 1.5% of its max HP, until the Bleed ends. */
  const bloodroot = (k: number) => THORNS.map((s) => bleedOn(s, k, [apply("bloodroot", { to: "other" })]));
  helper({
    id: "bloodroot", name: "BLOODROOT", text: "Each action it takes heals whoever rooted it.", label: "debuff", show: "icon", stacking: "refresh", perSource: { endsWithSource: true },
    reactions: [
      { on: { event: "action_resolve" }, actor: "source", do: [{ op: "heal", amount: { scale: [{ ratio: 0.015, stat: "max_hp", of: "source" }] }, to: "source" }] },
      { on: { event: "status_ended", status: "bleed" }, do: [{ op: "remove", label: "debuff", status: "bloodroot", to: "holder" }] },
    ],
  } as StatusT);
  /** Scything briar: the passive outside being struck: its own hits add the Bleed, a rider, and its Thorns add none. */
  const scything = (k: number): ReactionT[] => [{ on: { event: "hit_lands" }, do: [apply("bleed", { stacks: own("few", "defense", k), to: "other" })] }];
  passiveUp({
    id: "briar", cls: "bramble_knight",
    power: "+40% Bleed.",
    a: { name: "Bloodroot", text: "Its Thorns add Bleed. While that Bleed lasts, the foe heals it 1.5% of max HP each time it acts.", builds: ["pact", "toll"] },
    b: { name: "Scything briar", text: "Its hits add Bleed in place of its Thorns.", serves: "Cuts 2 ●●, Hunt ● ◆ the stream, swing-status" },
    form: (v, k) => ({ reactions: v === "a" ? bloodroot(k) : v === "b" ? scything(k) : plain(k) }),
  });
}

{
  /**
   * Overgrowth: Taunt, then Taunt once more when it runs out (a marker spent by the second), and Thorns ×2 for both. The doubling reads the
   * Thorns when it lands, so the cast lifts any Overgrowth still held first: with the power step (37.7 ticks) it comes back before the last one
   * ends, and a doubling read on top of itself would grow with every cast.
   */
  const overgrowth: Partial<AbilityT> = { cooldown: cd("very_long", "thicket"), mp: 325, do: [apply("taunt"), removeMine("overgrowth", "buff", "self"), apply("overgrowth"), apply("overgrowth_again")] };
  helper(kit("overgrowth", "OVERGROWTH", "Thorns ×2.", { duration: 2 * STATUS.taunt.duration, stats: [{ stat: "thorns", flat: ofHolder(1, "thorns") }] }));
  helper(marker("overgrowth_again", "OVERGROWTH", "Taunts once more when its Taunt runs out.", {
    reactions: [{ on: { event: "status_ended", status: "taunt", cause: ["expired"] }, do: [apply("taunt", { to: "holder" }), removeMine("overgrowth_again", "marker")] }],
  }));
  const grove: Partial<AbilityT> = { cooldown: cd("long", "thicket"), mp: 325, target: T.everyAlly, do: [apply("guard")] };
  abilityUp({
    id: "thicket", cls: "bramble_knight",
    power: "Shorter cooldown.", shown: true,
    a: { name: "Overgrowth", text: "Taunts 2 times in a row, with Thorns ×2 throughout. No Guard.", serves: "Toll 2 ●●● ⚙ goad (half)" },
    b: { name: "Grove", text: "Guards every ally. No Taunt.", builds: ["landslide", "bonfire", "storm"] },
    form: (v, _k, plus) =>
      v === "a" ? { ...overgrowth, ...(plus ? { cooldown: cd("long", "thicket") } : {}) }
        : v === "b" ? { ...grove, ...(plus ? { cooldown: cd("medium", "thicket") } : {}) }
          : { cooldown: cd("short", "thicket") },
  });
}

{
  const deepRoots: Partial<AbilityT> = { target: "self", do: [apply("regen"), apply("deep_roots")] };
  helper(kit("deep_roots", "DEEP ROOTS", "Thorns up.", { duration: STATUS.regen.duration, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }] }));
  /** Blossom: the whole Regen on every ally (statuses are universal, so not half as long), less often and dearer. */
  const blossom: Partial<AbilityT> = { cooldown: cd("long", "regrowth"), mp: 500, target: T.everyAlly, do: [apply("regen")] };
  abilityUp({
    id: "regrowth", cls: "bramble_knight",
    power: "Costs less MP.", shown: true,
    a: { name: "Deep roots", text: "Regen on itself, and Thorns up while it lasts.", builds: ["toll"] },
    b: { name: "Blossom", text: "Regen on every ally.", builds: ["pact", "storm"] },
    form: (v, _k, plus) =>
      v === "a" ? { ...deepRoots, ...(plus ? { mp: 200 } : {}) }
        : v === "b" ? { ...blossom, ...(plus ? { mp: 325 } : {}) }
          : { mp: 200 },
  });
}

{
  const lash = (ratio: number) => phys({ scale: [{ ratio, stat: "thorns" }] });
  const vines = (ratio: number): Partial<AbilityT> => ({ cooldown: cd("short", "bramble_lash"), mp: 325, target: T.everyFoe, do: [lash(ratio)] });
  /**
   * Thornshield: no lash; another unit made the anchor: the other ally with the lowest HP% gains Thorns equal to the Bramble
   * knight's own (read as it lands, from its source) for Taunt's length; the power step gives two fifths more.
   */
  const thornshield: Partial<AbilityT> = { target: { side: "others", pick: "lowest", by: "hp_share" }, do: [apply("thornshield")] };
  const thornshieldPlus: Partial<AbilityT> = { target: { side: "others", pick: "lowest", by: "hp_share" }, do: [apply("thornshield_plus")] };
  for (const [id, k] of [["thornshield", 1], ["thornshield_plus", POWER]] as const) {
    helper(kit(id, "THORNSHIELD", "Thorns up, by the Bramble knight's own.", { duration: STATUS.taunt.duration, stats: [{ stat: "thorns", flat: { scale: [{ ratio: k, stat: "thorns", of: "source" }] } }] }));
  }
  abilityUp({
    id: "bramble_lash", cls: "bramble_knight",
    power: "+40% damage.", shown: true,
    a: { name: "Whipping vines", text: "Lashes every foe with its Thorns.", serves: "Toll 2 ●●, Cuts ●● ⚙ red rain (half)" },
    b: { name: "Thornshield", text: "No lash: the other ally with the lowest HP% gains Thorns equal to its own.", serves: "Toll 2 ●●●, Pact ● ◆ the anchor, the mirror", plus: "Thorns 40% above its own." },
    form: (v, k, plus) => (v === "a" ? vines(2.25 * k) : v === "b" ? (plus ? thornshieldPlus : thornshield) : { do: [lash(4.5 * k)] }),
  });
}
