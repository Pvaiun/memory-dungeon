/** The Bramble knight's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, EffectT, ReactionT, StatusT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { SPECIAL, STATUS } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, kit, marker, ofHolder, passiveUp, phys, removeMine } from "./kit.js";

{
  /**
   * Briar's Bleed on each blow its Thorns deal. Every form also hears Heartwood mail's strikes (the mythic's Thorns on the attackers of allies), which
   * Briar follows; the base Briar is classes.ts's, so the mythic itself bleeds for it (see Heartwood mail).
   */
  const bleedOn = (status: string, k: number, more: EffectT[] = []): ReactionT => ({ on: { event: "damage_dealt", status }, do: [apply("bleed", { stacks: own("few", "defense", k), to: "other" }), ...more] });
  const THORNS = ["thorns", "heartwood_mail"];
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
  /** Spreading thorns: each Thorns strike also strikes a random other foe for the full Thorns. It's the form's own damage, so it never chains, and Briar bleeds it too. */
  const spreading = (self: string, k: number): ReactionT[] => [
    ...THORNS.map((s) => bleedOn(s, k)),
    bleedOn(self, k),
    ...THORNS.map((s): ReactionT => ({ on: { event: "damage_dealt", status: s }, do: [{ op: "damage", type: "none", amount: ofHolder(1, "thorns"), to: { side: "foes", pick: "random", exclude: "other" } }] })),
  ];
  passiveUp({
    id: "briar", cls: "bramble_knight",
    power: "+40% Bleed.",
    a: { name: "Bloodroot", text: "Its Thorns add Bleed. While that Bleed lasts, the foe heals it 1.5% of max HP each time it acts.", builds: ["pact", "toll"] },
    b: { name: "Spreading thorns", text: "Its Thorns also strike a second random foe; both gain Bleed.", builds: ["storm"] },
    form: (v, k, plus) => ({ reactions: v === "a" ? bloodroot(k) : v === "b" ? spreading(plus ? "briar__bp" : "briar__b", k) : plain(k) }),
  });
}

{
  /**
   * Overgrowth: Taunt, then Taunt once more when it runs out (a marker spent by the second), and Thorns doubled for both. The doubling reads the
   * Thorns when it lands, so the cast lifts any Overgrowth still held first: with the power step (37.7 ticks) it comes back before the last one
   * ends, and a doubling read on top of itself would grow with every cast.
   */
  const overgrowth: Partial<AbilityT> = { cooldown: cd("very_long", "thicket"), mp: 325, do: [apply("taunt"), removeMine("overgrowth", "buff", "self"), apply("overgrowth"), apply("overgrowth_again")] };
  helper(kit("overgrowth", "OVERGROWTH", "Thorns doubled.", { duration: 2 * STATUS.taunt.duration, stats: [{ stat: "thorns", flat: ofHolder(1, "thorns") }] }));
  helper(marker("overgrowth_again", "OVERGROWTH", "Taunts once more when its Taunt runs out.", {
    reactions: [{ on: { event: "status_ended", status: "taunt", cause: ["expired"] }, do: [apply("taunt", { to: "holder" }), removeMine("overgrowth_again", "marker")] }],
  }));
  const grove: Partial<AbilityT> = { cooldown: cd("long", "thicket"), mp: 325, target: T.everyAlly, do: [apply("guard")] };
  abilityUp({
    id: "thicket", cls: "bramble_knight",
    power: "Shorter cooldown.", shown: true,
    a: { name: "Overgrowth", text: "Taunts twice in a row, with Thorns doubled throughout. No Guard.", serves: "Toll 2 ●●● ⚙ goad (half)" },
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
  /** Rebuke: waits for five hits taken since its last lash (a count the ability brings), then lashes for double and spends the count. */
  const rebuke = (ratio: number): Partial<AbilityT> => ({
    if: { side: "self", where: { stacks: { status: "rebuke_count", atLeast: 5 } } },
    statuses: ["rebuke"],
    do: [lash(ratio), removeMine("rebuke_count", "marker", "self")],
  });
  helper(marker("rebuke", "REBUKE", "Counts the hits it takes.", { unremovable: true, reactions: [{ on: { event: "hit_taken" }, do: [apply("rebuke_count", { to: "holder" })] }] }));
  helper(marker("rebuke_count", "REBUKE", "Hits taken since its last lash.", { show: "icon", stacking: "intensity" }));
  abilityUp({
    id: "bramble_lash", cls: "bramble_knight",
    power: "+40% damage.", shown: true,
    a: { name: "Whipping vines", text: "Lashes every foe with its Thorns.", serves: "Toll 2 ●●, Cuts ●● ⚙ red rain (half)" },
    b: { name: "Rebuke", text: "After 5 hits taken since its last lash, lashes a random foe.", builds: ["toll"] },
    form: (v, k) => (v === "a" ? vines(2.25 * k) : v === "b" ? rebuke(9 * k) : { do: [lash(4.5 * k)] }),
  });
}
