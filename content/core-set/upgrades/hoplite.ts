/** The Hoplite's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit.ts. */
import type { AbilityT, ReactionT, StatusT } from "../../../src/schema.js";
import { from, KIND_SPEED, stacks, SWING_REF } from "../scale.js";
import { T } from "../classes.js";
import { abilityUp, apply, cd, helper, kit, passiveUp, phys, r6, removeMine } from "./kit.js";

{
  const phalanx = (boost: number) => ({ stats: [{ stat: "attack_speed", flat: -100 }], boosts: [{ tag: "basic", pct: boost }] });
  /** Opening thrust: the basic attack's timer made ready at the start, and +100% on the first swing, which adds to Phalanx's. */
  const opening: ReactionT = { on: { event: "fight_start" }, do: [{ op: "cooldown", which: "basic", set: "ready", to: "holder" }, apply("opening_thrust", { to: "holder" })] };
  helper(kit("opening_thrust", "OPENING THRUST", "Its first basic attack deals more.", {
    boosts: [{ tag: "basic", pct: 100 }],
    reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [removeMine("opening_thrust")] }, { on: { event: "hit_missed", kind: "basic" }, do: [removeMine("opening_thrust")] }],
  }));
  /** Shieldbearer: a tenth of its Defense on each swing, sized by the held kind's interval as a swing is (a `weapon` test reads the kind), then Phalanx's boost. */
  const sized = (kind: string) => r6((0.1 * KIND_SPEED[kind]) / SWING_REF);
  const bearer: NonNullable<StatusT["riders"]> = [{ on: "basic", add: { type: "physical", amount: { scale: ["spear", "great_weapon"].map((kind) => ({ ratio: sized(kind), when: { weapon: [kind] }, of: "holder" as const, times: { stat: "defense", of: "holder" as const } })) } } }];
  passiveUp({
    id: "phalanx", cls: "hoplite",
    power: "Its basic attacks deal a little more than double: × 2.4.",
    a: { name: "Opening thrust", text: "Basic attacks come half as often and deal double. The first of each fight comes at once and deals triple.", builds: ["ambush", "landslide"] },
    b: { name: "Shieldbearer", text: "Basic attacks come half as often and deal double. Defense adds to them half as much as Attack does.", builds: ["landslide"] },
    form: (v, _k, plus) => ({ ...phalanx(plus ? 140 : 100), ...(v === "a" ? { reactions: [opening] } : v === "b" ? { riders: bearer } : {}) }),
  });
}

{
  /**
   * Watch the anchor: Aegis on the ally with the most Aggro that holds none. DRAWN's phrase (a Taunting ally first) can't sit beside the Fizzle
   * rule in one target rule: `ifNone: any` drops the `lacks`, and the Aegis would fizzle on the anchor that already holds one.
   */
  const anchor: Partial<AbilityT> = { target: { side: "allies", where: { lacks: "aegis" }, pick: "highest", by: { stat: "aggro" } } };
  const wall: Partial<AbilityT> = { cooldown: cd("very_long", "aspis"), mp: 750, target: { side: "allies", where: { lacks: "aegis" }, pick: "all" } };
  abilityUp({
    id: "aspis", cls: "hoplite",
    power: "Comes round sooner.",
    a: { name: "Watch the anchor", text: "Aegis on the ally with the most Aggro that holds none.", builds: ["toll"] },
    b: { name: "Shield wall", text: "Aegis on every ally.", builds: ["bonfire", "harvest"] },
    form: (v, _k, plus) =>
      v === "a" ? { ...anchor, ...(plus ? { cooldown: cd("medium", "aspis") } : {}) }
        : v === "b" ? { ...wall, ...(plus ? { cooldown: cd("long", "aspis") } : {}) }
          : { cooldown: cd("medium", "aspis") },
  });
}

{
  const line: Partial<AbilityT> = { target: { side: "others", pick: "all" }, do: [apply("guard")] };
  const blade: Partial<AbilityT> = { do: [apply("guard"), apply("guard", { to: { side: "others", pick: "highest", by: { stats: ["attack"] } } })] };
  abilityUp({
    id: "paired_guard", cls: "hoplite",
    power: "Costs less MP.",
    a: { name: "Line of shields", text: "Guards both other allies. Not itself.", builds: ["harvest", "bonfire"] },
    b: { name: "Guard the blade", text: "Guards itself and the other ally with the highest Attack.", builds: ["hunt", "ambush"] },
    form: (v, _k, plus) => ({ ...(v === "a" ? line : v === "b" ? blade : {}), ...(plus ? { mp: 200 } : {}) }),
  });
}

{
  const thrust = (ratio: number, extra: object = {}) => phys(from("attack", ratio), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }], ...extra });
  const skewer = (ratio: number): Partial<AbilityT> => ({ do: [thrust(ratio), thrust(ratio, { to: { side: "foes", pick: "highest", by: "hp", exclude: "targets" } })] });
  const hunters = (ratio: number): Partial<AbilityT> => ({ seek: true, target: T.lowestHpFoe, do: [thrust(ratio)] });
  abilityUp({
    id: "spear_thrust", cls: "hoplite",
    power: "Deals two fifths more damage.",
    a: { name: "Skewer", text: "A thrust through a random foe and on into the foe with the most HP, each for three quarters, each adding a few Sunder.", builds: ["harvest"] },
    b: { name: "Hunter's thrust", text: "A thrust past any guard at the foe with the lowest HP, adding a few Sunder.", builds: ["hunt"] },
    form: (v, k) => (v === "a" ? skewer(0.8 * k) : v === "b" ? hunters(1.1 * k) : { do: [thrust(1.1 * k)] }),
  });
}
