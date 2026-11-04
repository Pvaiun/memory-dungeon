/** The Bramble knight's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit-1.ts. */
import type { EffectT, ReactionT } from "../../../src/schema.js";
import { own } from "../pieces/kit.js";
import { SPECIAL, STATUS } from "../scale.js";
import { T } from "../classes.js";
import { abilityUpgrade, apply, cd, type Changes, helper, helpers, marker, MORE, ofHolder, passiveUpgrade, phys, removeBuff, removeMarker, tag, ups } from "./kit-1.js";

// ═══ Bramble knight ══════════════════════════════════════════════════════════

{
  /**
   * Briar's Bleed on each blow its Thorns deal. Every form also hears Heartwood mail's strikes (the mythic's Thorns on the attackers of allies), which
   * Briar follows; the base Briar is classes.ts's, so the mythic itself bleeds for it (see Heartwood mail).
   */
  const bleedOn = (status: string, k: number, more: EffectT[] = []): ReactionT => ({ on: { event: "damage_dealt", status }, do: [apply("bleed", { stacks: own("few", "armor", k), to: "other" }), ...more] });
  const THORNS = ["thorns", "heartwood_mail"];
  const plain = (k: number) => THORNS.map((s) => bleedOn(s, k));
  /** Bloodroot: a debuff that knows its source; each action its holder takes heals the Bramble knight 1.5% of its max HP, until the Bleed ends. */
  const bloodroot = (k: number) => THORNS.map((s) => bleedOn(s, k, [apply("bloodroot", { to: "other" })]));
  helpers.push({
    id: "bloodroot", name: "BLOODROOT", text: "Each action it takes heals the one whose thorns rooted it.", label: "debuff", show: "icon", stacking: "refresh", perSource: { endsWithSource: true },
    reactions: [
      { on: { event: "action_resolve" }, actor: "source", do: [{ op: "heal", amount: { scale: [{ ratio: 0.015, stat: "max_hp", of: "source" }] }, to: "source" }] },
      { on: { event: "status_ended", status: "bleed" }, do: [{ op: "remove", label: "debuff", status: "bloodroot", to: "holder" }] },
    ],
  });
  /** Spreading thorns: each Thorns strike also strikes a random other foe for the full Thorns. It's the form's own damage, so it never chains, and Briar bleeds it too. */
  const spreading = (self: string, k: number): ReactionT[] => [
    ...THORNS.map((s) => bleedOn(s, k)),
    bleedOn(self, k),
    ...THORNS.map((s): ReactionT => ({ on: { event: "damage_dealt", status: s }, do: [{ op: "damage", type: "none", amount: ofHolder(1, "thorns"), to: { side: "foes", pick: "random", exclude: "other" } }] })),
  ];
  ups.push(passiveUpgrade("bramble_knight", "briar", {
    power: "Two fifths more Bleed.",
    a: { name: "Bloodroot", text: "Foes its Thorns wound start to bleed. While a foe bleeds, each action it takes heals the Bramble knight a little." },
    b: { name: "Spreading thorns", text: "When its Thorns strike, they strike a second, random foe too, and both start to bleed." },
    p: { text: "Foes its Thorns wound start to bleed, more.", reactions: plain(MORE) },
    va: { text: "Foes its Thorns wound bleed, and heal it a little with each action while they bleed.", reactions: bloodroot(1) },
    vb: { text: "Its Thorns strike a second, random foe too, and both bleed.", reactions: spreading("briar__b", 1) },
    ap: { text: "Foes its Thorns wound bleed more, and heal it a little with each action while they bleed.", reactions: bloodroot(MORE) },
    bp: { text: "Its Thorns strike a second, random foe too, and both bleed more.", reactions: spreading("briar__bp", MORE) },
  }));
  tag("briar", ["pact", "toll"], ["harvest"]);
}

{
  /**
   * Overgrowth: Taunt, then Taunt once more when it runs out (a marker spent by the second), and Thorns doubled for both. The doubling reads the
   * Thorns when it lands, so the cast lifts any Overgrowth still held first: with the power step (37.7 ticks) it comes back before the last one
   * ends, and a doubling read on top of itself would grow with every cast.
   */
  const overgrowth: Changes = { cooldown: cd("very_long", "thicket"), mp: 325, do: [apply("taunt"), removeBuff("overgrowth", "self"), apply("overgrowth"), apply("overgrowth_again")] };
  helpers.push(
    helper("overgrowth", "OVERGROWTH", "Thorns doubled.", { duration: 2 * STATUS.taunt.duration, stats: [{ stat: "thorns", flat: ofHolder(1, "thorns") }] }),
    marker("overgrowth_again", "OVERGROWTH", "Taunts once more when its Taunt runs out.", {
      reactions: [{ on: { event: "status_ended", status: "taunt", cause: ["expired"] }, do: [apply("taunt", { to: "holder" }), removeMarker("overgrowth_again")] }],
    }),
  );
  const grove: Changes = { cooldown: cd("long", "thicket"), mp: 325, target: T.everyAlly, do: [apply("guard")] };
  ups.push(abilityUpgrade("bramble_knight", "thicket", {
    power: "Comes round sooner.",
    a: { name: "Overgrowth", text: "Taunts itself twice over, and doubles its Thorns while the Taunts last. No Guard." },
    b: { name: "Grove", text: "Guards every ally. No Taunt." },
    p: { cooldown: cd("short", "thicket") },
    va: overgrowth,
    vb: grove,
    ap: { ...overgrowth, cooldown: cd("long", "thicket") },
    bp: { ...grove, cooldown: cd("medium", "thicket") },
  }));
  tag("thicket", ["toll"], ["landslide", "bonfire", "harvest"]);
}

{
  const deepRoots: Changes = { target: "self", do: [apply("regen"), apply("deep_roots")] };
  helpers.push(helper("deep_roots", "DEEP ROOTS", "Thorns up.", { duration: STATUS.regen.duration, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }] }));
  /** Blossom: the whole Regen on every ally (statuses are universal, so not half as long), less often and dearer. */
  const blossom: Changes = { cooldown: cd("long", "regrowth"), mp: 500, target: T.everyAlly, do: [apply("regen")] };
  ups.push(abilityUpgrade("bramble_knight", "regrowth", {
    power: "Costs less MP.",
    a: { name: "Deep roots", text: "Regen on itself, and Thorns up while it heals." },
    b: { name: "Blossom", text: "Regen on every ally." },
    p: { mp: 200 },
    va: deepRoots,
    vb: blossom,
    ap: { ...deepRoots, mp: 200 },
    bp: { ...blossom, mp: 325 },
  }));
  tag("regrowth", ["toll"], ["pact", "harvest"]);
}

{
  const lash = (ratio: number) => phys({ scale: [{ ratio, stat: "thorns" }] });
  const vines = (ratio: number): Changes => ({ cooldown: cd("short", "bramble_lash"), mp: 325, target: T.everyFoe, do: [lash(ratio)] });
  /** Rebuke: waits for five hits taken since its last lash (a count the ability brings), then lashes for double and spends the count. */
  const rebuke = (ratio: number): Changes => ({
    if: { side: "self", where: { stacks: { status: "rebuke_count", atLeast: 5 } } },
    statuses: ["rebuke"],
    do: [lash(ratio), removeMarker("rebuke_count", "self")],
  });
  helpers.push(
    marker("rebuke", "REBUKE", "Counts the hits it takes.", { unremovable: true, reactions: [{ on: { event: "hit_taken" }, do: [apply("rebuke_count", { to: "holder" })] }] }),
    marker("rebuke_count", "REBUKE", "Hits taken since its last lash.", { show: "icon", stacking: "intensity" }),
  );
  ups.push(abilityUpgrade("bramble_knight", "bramble_lash", {
    power: "Deals two fifths more damage.",
    a: { name: "Whipping vines", text: "Lashes every foe with its thorns, for half." },
    b: { name: "Rebuke", text: "Waits until it's been hit five times since its last lash, then lashes a random foe for double." },
    p: { do: [lash(6.3)] },
    va: vines(2.25),
    vb: rebuke(9),
    ap: vines(3.15),
    bp: rebuke(12.6),
  }));
  tag("bramble_lash", ["harvest"], ["toll"]);
}
