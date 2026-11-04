/** The Hoplite's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit-1.ts. */
import type { ReactionT, StatusT } from "../../../src/schema.js";
import { from, KIND_SPEED, stacks, SWING_REF } from "../scale.js";
import { T } from "../classes.js";
import { abilityUpgrade, apply, cd, type Changes, helper, helpers, passiveUpgrade, phys, r6, removeBuff, tag, ups } from "./kit-1.js";

// ═══ Hoplite ═════════════════════════════════════════════════════════════════

{
  const phalanx = (boost: number) => ({ stats: [{ stat: "attack_speed", flat: -100 }], boosts: [{ tag: "basic", pct: boost }] });
  /** Opening thrust: the basic attack's timer made ready at the start, and +100% on the first swing, which adds to Phalanx's. */
  const opening: ReactionT = { on: { event: "fight_start" }, do: [{ op: "cooldown", which: "basic", set: "ready", to: "holder" }, apply("opening_thrust", { to: "holder" })] };
  helpers.push(helper("opening_thrust", "OPENING THRUST", "Its first basic attack deals more.", {
    boosts: [{ tag: "basic", pct: 100 }],
    reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [removeBuff("opening_thrust")] }, { on: { event: "hit_missed", kind: "basic" }, do: [removeBuff("opening_thrust")] }],
  }));
  /** Shieldbearer: a tenth of its Armor on each swing, sized by the held kind's interval as a swing is (a `weapon` test reads the kind), then Phalanx's boost. */
  const sized = (kind: string) => r6((0.1 * KIND_SPEED[kind]) / SWING_REF);
  const bearer: NonNullable<StatusT["riders"]> = [{ on: "basic", add: { type: "physical", amount: { scale: ["spear", "great_weapon"].map((kind) => ({ ratio: sized(kind), when: { weapon: [kind] }, of: "holder" as const, times: { stat: "armor", of: "holder" as const } })) } } }];
  ups.push(passiveUpgrade("hoplite", "phalanx", {
    power: "Its basic attacks deal a little more than double: × 2.4.",
    a: { name: "Opening thrust", text: "Basic attacks come half as often and deal double. The first of each fight comes at once and deals triple." },
    b: { name: "Shieldbearer", text: "Basic attacks come half as often and deal double. Armor adds to them half as much as Attack does." },
    p: { text: "Basic attacks half as often, for a little more than double damage.", ...phalanx(140) },
    va: { text: "Basic attacks half as often, for double damage; the first of each fight at once, for triple.", ...phalanx(100), reactions: [opening] },
    vb: { text: "Basic attacks half as often, for double damage, with Armor added.", ...phalanx(100), riders: bearer },
    ap: { text: "Basic attacks half as often, for a little more than double damage; the first of each fight at once, for more than triple.", ...phalanx(140), reactions: [opening] },
    bp: { text: "Basic attacks half as often, for a little more than double damage, with Armor added.", ...phalanx(140), riders: bearer },
  }));
  tag("phalanx", ["ambush", "landslide"], ["landslide"]);
}

{
  /**
   * Watch the anchor: Aegis on the ally with the most Aggro that holds none. DRAWN's phrase (a Taunting ally first) can't sit beside the Fizzle
   * rule in one target rule: `ifNone: any` drops the `lacks`, and the Aegis would fizzle on the anchor that already holds one.
   */
  const anchor: Changes = { target: { side: "allies", where: { lacks: "aegis" }, pick: "highest", by: { stat: "aggro" } } };
  const wall: Changes = { cooldown: cd("very_long", "aspis"), mp: 750, target: { side: "allies", where: { lacks: "aegis" }, pick: "all" } };
  ups.push(abilityUpgrade("hoplite", "aspis", {
    power: "Comes round sooner.",
    a: { name: "Watch the anchor", text: "Aegis on the ally with the most Aggro that holds none." },
    b: { name: "Shield wall", text: "Aegis on every ally." },
    p: { cooldown: cd("medium", "aspis") },
    va: anchor,
    vb: wall,
    ap: { ...anchor, cooldown: cd("medium", "aspis") },
    bp: { ...wall, cooldown: cd("long", "aspis") },
  }));
  tag("aspis", ["toll"], ["bonfire", "harvest"]);
}

{
  const line: Changes = { target: { side: "others", pick: "all" }, do: [apply("guard")] };
  const blade: Changes = { do: [apply("guard"), apply("guard", { to: { side: "others", pick: "highest", by: { stats: ["attack", "magic"] } } })] };
  ups.push(abilityUpgrade("hoplite", "paired_guard", {
    power: "Costs less MP.",
    a: { name: "Line of shields", text: "Guards both other allies. Not itself." },
    b: { name: "Guard the blade", text: "Guards itself and the other ally with the highest Attack or Magic." },
    p: { mp: 200 },
    va: line,
    vb: blade,
    ap: { ...line, mp: 200 },
    bp: { ...blade, mp: 200 },
  }));
  tag("paired_guard", ["harvest", "bonfire"], ["hunt", "ambush"]);
}

{
  const thrust = (ratio: number, extra: object = {}) => phys(from("attack", ratio), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }], ...extra });
  const skewer = (ratio: number): Changes => ({ do: [thrust(ratio), thrust(ratio, { to: { side: "foes", pick: "highest", by: "hp", exclude: "targets" } })] });
  const hunters = (ratio: number): Changes => ({ seek: true, target: T.lowestHpFoe, do: [thrust(ratio)] });
  ups.push(abilityUpgrade("hoplite", "spear_thrust", {
    power: "Deals two fifths more damage.",
    a: { name: "Skewer", text: "A thrust through a random foe and on into the foe with the most HP, each for three quarters, each adding a few Sunder." },
    b: { name: "Hunter's thrust", text: "A thrust past any guard at the foe with the lowest HP, adding a few Sunder." },
    p: { do: [thrust(1.54)] },
    va: skewer(0.8),
    vb: hunters(1.1),
    ap: skewer(1.12),
    bp: hunters(1.54),
  }));
  tag("spear_thrust", ["harvest"], ["hunt"]);
}
