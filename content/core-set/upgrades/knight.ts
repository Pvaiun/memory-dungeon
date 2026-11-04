/** The Knight's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit-1.ts. */
import type { EffectT, ReactionT } from "../../../src/schema.js";
import { from, SPECIAL, STATUS } from "../scale.js";
import { abilityUpgrade, apply, cd, type Changes, helper, helpers, ofHolder, passiveUpgrade, phys, tag, ups } from "./kit-1.js";

// ═══ Knight ══════════════════════════════════════════════════════════════════

const vanguardShield = (ratio: number): EffectT => apply("shield", { stacks: ofHolder(ratio, "max_hp"), to: "holder" });
/** Stonewall: the other ally with the lowest Aggro starts behind a Shield of the Knight's size, up to half its own max HP (the Shield's own cap). */
const stonewallShield = (ratio: number): EffectT => apply("shield", { stacks: ofHolder(ratio, "max_hp"), to: { side: "others", pick: "lowest", by: { stat: "aggro" } } });
const grudge: ReactionT = { on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [apply("taunt", { to: "holder" }), apply("guard", { to: "holder" })] };
ups.push(passiveUpgrade("knight", "vanguard", {
  power: "A Shield two fifths bigger.",
  a: { name: "Stonewall", text: "Starts every fight behind a Shield from its max HP. The other ally with the lowest Aggro starts behind a Shield of the same size." },
  b: { name: "Grudge", text: "Starts every fight behind a Shield from its max HP. When its Shield breaks, it Taunts and is Guarded." },
  p: { text: "Starts every fight behind a bigger Shield from its max HP.", reactions: [{ on: { event: "fight_start" }, do: [vanguardShield(0.28)] }] },
  va: { text: "Starts every fight behind a Shield from its max HP; so does the other ally with the lowest Aggro.", reactions: [{ on: { event: "fight_start" }, do: [vanguardShield(0.2), stonewallShield(0.2)] }] },
  vb: { text: "Starts every fight behind a Shield from its max HP. When it breaks, it Taunts and is Guarded.", reactions: [{ on: { event: "fight_start" }, do: [vanguardShield(0.2)] }, grudge] },
  ap: { text: "Starts every fight behind a bigger Shield from its max HP; so does the other ally with the lowest Aggro.", reactions: [{ on: { event: "fight_start" }, do: [vanguardShield(0.28), stonewallShield(0.28)] }] },
  bp: { text: "Starts every fight behind a bigger Shield from its max HP. When it breaks, it Taunts and is Guarded.", reactions: [{ on: { event: "fight_start" }, do: [vanguardShield(0.28)] }, grudge] },
}));
tag("vanguard", ["landslide", "ambush"], ["toll", "lockdown"]);

{
  /** Stone guard: the other ally with the most Armor, Guarded and given a Shield of a quarter of the Knight's Armor, read when it lands. */
  const stoneGuard: Changes = { target: { side: "others", pick: "highest", by: { stat: "armor" } }, do: [apply("guard"), apply("shield", { stacks: { scale: [{ ratio: 0.25, stat: "armor", of: "self" }] } })] };
  /**
   * Cover: another ally in a wind-up; with nobody else casting, the other ally with the lowest share of HP. "The one with the most wind-up left"
   * has no `by` in the schema, so among two casters it's the one lower in HP: the rule's fallback does the rest.
   */
  const cover: Changes = { target: { side: "others", where: { casting: true }, ifNone: "any", pick: "lowest", by: "hp_share" } };
  ups.push(abilityUpgrade("knight", "fortify", {
    power: "Comes round sooner.",
    a: { name: "Stone guard", text: "Guards the other ally with the most Armor, and gives it a Shield from the Knight's Armor." },
    b: { name: "Cover", text: "Guards another ally in a wind-up. With nobody else casting, the other ally with the lowest share of HP." },
    p: { cooldown: cd("medium", "fortify") },
    va: stoneGuard,
    vb: cover,
    ap: { ...stoneGuard, cooldown: cd("medium", "fortify") },
    bp: { ...cover, cooldown: cd("medium", "fortify") },
  }));
  tag("fortify", ["landslide"], ["bonfire", "overflow", "lockdown"]);
}

{
  const rallyTheWell: Changes = { if: { side: "allies", where: { mpBelow: 50 } }, target: { side: "allies", where: { mpBelow: 50 }, pick: "all" }, do: [apply("clarity")] };
  const holdTheLine: Changes = { do: [apply("taunt"), apply("hold_the_line")] };
  helpers.push(helper("hold_the_line", "HOLD THE LINE", "Thorns up.", { duration: STATUS.taunt.duration, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }] }));
  ups.push(abilityUpgrade("knight", "stand_fast", {
    power: "Costs less MP.",
    a: { name: "Rally the well", text: "Gives Clarity to every ally under half its MP. Waits until one is. No Taunt." },
    b: { name: "Hold the line", text: "Taunts, and has Thorns for as long as the Taunt. No Clarity." },
    p: { mp: 125 },
    va: rallyTheWell,
    vb: holdTheLine,
    ap: { ...rallyTheWell, mp: 125 },
    bp: { ...holdTheLine, mp: 125 },
  }));
  tag("stand_fast", ["overflow"], ["toll"]);
}

{
  const bash = (ratio: number, extra: object = {}) => phys(from("max_hp", ratio), extra);
  const measured = (ratio: number): Changes => ({
    if: { side: "foes", where: { casting: true } },
    target: { side: "foes", where: { casting: true, lacks: "stun" }, ifNone: "any", pick: "highest", by: { stats: ["attack", "magic"] } },
    do: [bash(ratio, { apply: [{ status: "stun" }] })],
  });
  /** Crushing bash: from max HP and its Shield together, double; it reads the Shield and doesn't spend it. A random foe: no Stun to aim. */
  const crushing = (ratio: number): Changes => ({
    target: "foe", cooldown: cd("long", "shield_bash"),
    do: [phys({ scale: [{ ratio, stat: "max_hp" }, { ratio, stacks: "shield", of: "self" }] })],
  });
  ups.push(abilityUpgrade("knight", "shield_bash", {
    power: "Deals two fifths more damage.",
    a: { name: "Measured blow", text: "Waits for a foe to start a wind-up, then bashes the casting foe with the highest Attack or Magic, scaling from max HP, and Stuns it. The Stun holds the wind-up where it is." },
    b: { name: "Crushing bash", text: "Bashes a random foe for double, scaling from max HP and its current Shield together. No Stun. A longer cooldown." },
    p: { do: [bash(0.406, { apply: [{ status: "stun" }] })] },
    va: measured(0.29),
    vb: crushing(0.58),
    ap: measured(0.406),
    bp: crushing(0.812),
  }));
  tag("shield_bash", ["lockdown"], ["landslide"]);
}
