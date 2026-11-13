/** The rare formations. Each adds itself to kit.ts's lists. */
import type { StatusT, UnitCondT } from "../../../src/schema.js";
import { EV, FEW_TICKS, NO_MARK, SO_OFTEN, TAUNTS_ALL_FIGHT, TO, against, atStart, give, hits, ofAmount, on, react, reactIf, share } from "../pieces/kit.js";
import { OVERHEAL } from "../pieces/shared.js";
import { COOLDOWN, FLAT_STACKS } from "../scale.js";
import { CRITS_FAR_MORE, EVASION, FIFTH_FASTER, FIFTH_SOONER, LIFESTEAL, LIFESTEAL_HIGH, NOTHING, STRONGER_HEALS, THIRD_FASTER, THIRD_SOONER, THORNS, add, critSt, formation, held, st, thrice, twice } from "./kit.js";

// ─── Rare ────────────────────────────────────────────────────────────────────

{
  // The Smith's boosts read the unit that receives the heal or the Shield: the one in the Anvil's seat.
  const anvil = "When hit: the Hammer gains a Wrath.", smith = "Its heals and Shields on the Anvil are 33% bigger.";
  const onAnvil: UnitCondT = { has: "hammer_and_anvil_anvil" };
  add(
    formation("Hammer and anvil", "rare", "Every blow on the Anvil feeds the Hammer.", [
      { name: "Anvil", text: `Draws far more. ${anvil}`, stats: [st("aggro", 2)], statuses: ["hammer_and_anvil_anvil"] },
      { name: "Hammer", text: "Its next basic attack deals +20% per Wrath (up to 10), and spends them." },
      { name: "Smith", text: smith, statuses: ["hammer_and_anvil_smith"] },
    ]),
    [
      held("hammer_and_anvil_anvil", "Anvil", anvil, { reactions: [react(EV.struck, give("wrath", TO.seat("hammer"), 1))] }),
      held("hammer_and_anvil_smith", "Smith", smith, { boosts: [{ tag: "healing", pct: against(33, onAnvil) }, { tag: "shield", pct: against(33, onAnvil) }] }),
    ],
    "Landslide 2 ●●●, Toll 2 ●●● ⚙ reckoning (key)",
  );
}
{
  // Several, not many, in one application; 2% a hit, as Gleaner's leathers.
  const opener = `Crits add ${FLAT_STACKS.several} Bleed.`, blade = "Hits on a bleeding foe heal 2% of max HP.";
  add(
    formation("Bloodied ground", "rare", "One opens the wound; two drink from it.", [
      { name: "Opener", text: opener, statuses: ["bloodied_ground_opener"] },
      ...twice({ name: "Blade", text: blade, statuses: ["bloodied_ground_blade"] }),
    ]),
    [
      held("bloodied_ground_opener", "Opener", opener, { reactions: [react(EV.crit, give("bleed", "other", FLAT_STACKS.several))] }),
      held("bloodied_ground_blade", "Blade", blade, { reactions: [reactIf(EV.hit, { unit: "other", where: { has: "bleed" } }, { op: "heal", amount: share(0.02, "max_hp"), to: "holder" })] }),
    ],
    "Cuts 2 ●●●, Pact ●●",
  );
}
{
  const torch = "When a burning foe falls, its Burn passes to the foe with the most HP.";
  add(
    formation("Pyre line", "rare", "The fire outlives whatever it's burning.", [
      { name: "Keeper", text: `At fight start: Taunts and is Guarded. Foes that hit it gain ${FLAT_STACKS.few} Burn.`, statuses: ["pyre_line_keeper"] },
      { name: "Stoker", text: "Basic attacks 33% faster.", stats: [THIRD_FASTER] },
      { name: "Torch", text: torch, statuses: ["pyre_line_torch"] },
    ]),
    [
      held("pyre_line_keeper", "Keeper", `At fight start: Taunts and is Guarded. Foes that hit it gain ${FLAT_STACKS.few} Burn.`, { reactions: [atStart(give("taunt"), give("guard")), react(EV.struck, give("burn", "other", FLAT_STACKS.few))] }),
      held("pyre_line_torch", "Torch", torch, { reactions: [{ on: on("status_ended", { status: "burn", cause: ["ko"], whose: "foe" }), split: "fire", do: [give("burn", { side: "foes", pick: "highest", by: "hp" }, ofAmount())] }] }),
    ],
    "Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)",
  );
}
{
  const rime = "Its abilities add +50% Chill.", breaker = "Any shatter readies its first-slotted ability.";
  add(
    formation("Icefall", "rare", "Two lay frost; every shatter rings the third's spell.", [
      { name: "Rime", text: rime, statuses: ["icefall_rime"] },
      { name: "Sleet", text: "Basic attacks add a Chill.", statuses: ["icefall_sleet"] },
      { name: "Breaker", text: breaker, statuses: ["icefall_breaker"] },
    ]),
    [
      held("icefall_rime", "Rime", rime, { mods: [{ stacks: { pct: 50, statuses: ["chill"] } }] }),
      held("icefall_sleet", "Sleet", "Basic attacks add a Chill.", { reactions: [react(EV.basic, give("chill", "other", FLAT_STACKS.one))] }),
      held("icefall_breaker", "Breaker", breaker, { reactions: [react(EV.shatter, { op: "cooldown", which: "first", set: "ready", to: "holder" })] }),
    ],
    "Snap 2 ●●●, Landslide ●●, Barrage ●●, Bonfire ● ⚙ shatter bell (key)",
  );
}
{
  const thunder = "Each cast: its cooldown is 10% shorter per foe it hit.", squall = "Basic attacks also hit every other foe with Shock, for 33%.";
  add(
    formation("Storm front", "rare", "The wider the blow, the more it pays.", [
      { name: "Thunderhead", text: thunder, statuses: ["storm_front_thunderhead"] },
      { name: "Squall", text: squall, statuses: ["storm_front_squall"] },
      { name: "Rod", text: `Draws far more. Foes that hit it gain ${FLAT_STACKS.few} Shock.`, stats: [st("aggro", 2)], statuses: ["storm_front_rod"] },
    ]),
    [
      held("storm_front_thunderhead", "Thunderhead", thunder, { reactions: [react(EV.cast, { op: "cooldown", which: "event", set: { lessPct: { scale: [{ ratio: 10, count: "hit" }] } }, to: "holder" })] }),
      held("storm_front_squall", "Squall", squall, { strike: { to: { side: "foes", pick: "all", where: { has: "shock" }, exclude: "targets" }, share: 100 / 3, kind: "bonus" } }),
      held("storm_front_rod", "Rod", `Foes that hit it gain ${FLAT_STACKS.few} Shock.`, { reactions: [react(EV.struck, give("shock", "other", FLAT_STACKS.few))] }),
    ],
    "Storm 2 ●●●, Barrage ●●, Toll ●● ⚙ resonance (key), red rain (half), goad (half)",
  );
}
{
  const lead = "Hits Mark their target, if no foe is Marked.", mate = "Hits on a Marked foe deal +50%.";
  add(
    formation("The pack", "rare", "The pack takes them one at a time.", [
      { name: "Lead", text: lead, statuses: ["the_pack_lead"] },
      ...twice({ name: "Packmate", text: mate, statuses: ["the_pack_packmate"] }),
    ]),
    [
      held("the_pack_lead", "Lead", lead, { reactions: [reactIf(EV.hit, NO_MARK, give("marked", "other"))] }),
      held("the_pack_packmate", "Packmate", mate, { boosts: hits(against(50, { has: "marked" })) }),
    ],
    "Hunt 2 ●●● ⚙ judge's drum (half)",
  );
}
{
  // Each Collector lays what its swing carries on the foe that hit the Gate (two from one source add it once: the engine's).
  const collector = "A foe that hits the Gate gains the statuses this unit's basic attacks add every swing.";
  add(
    formation("Toll gate", "rare", "Whoever strikes the Gate pays the toll.", [
      { name: "Gate", text: "Draws far more. At fight start: Guarded.", stats: [st("aggro", 2)], statuses: ["toll_gate_gate"] },
      ...twice({ name: "Collector", text: collector, statuses: ["toll_gate_collector"] }),
    ]),
    [
      held("toll_gate_gate", "Gate", "At fight start: Guarded.", { reactions: [atStart(give("guard"))] }),
      held("toll_gate_collector", "Collector", collector, { reactions: [react(on("hit_taken", { whose: "team", seat: "gate" }), { op: "riders", plain: true, to: "other" })] }),
    ],
    "Toll 2 ●●●, Snap ●●, Storm ●●, Cuts ●●, Bonfire ● ⚙ frozen gate (key), goad (half), red rain (half)",
  );
}
{
  const soloist = "Abilities deal +50%. Each cast by another ally takes 33% off its cooldowns.";
  const well = "At fight start: Taunts. When the Soloist casts, gains a Shield of 10% of its max HP.";
  add(
    formation("The stage", "rare", "The others' casts bring the Soloist's spells round.", [
      { name: "Soloist", text: soloist, statuses: ["the_stage_soloist"] },
      { name: "Conductor", text: "Abilities come round 33% faster.", stats: [THIRD_SOONER] },
      { name: "Well", text: `Draws far more. ${well}`, stats: [st("aggro", 2)], statuses: ["the_stage_well"] },
    ]),
    [
      held("the_stage_soloist", "Soloist", soloist, { mods: [{ damage: 50 }], reactions: [react(on("action_resolve", { kind: "ability", whose: "ally" }), { op: "cooldown", which: "abilities", set: { times: 67 }, to: "holder" })] }),
      held("the_stage_well", "Well", well, { reactions: [atStart(give("taunt")), react(on("action_resolve", { kind: "ability", whose: "team", seat: "soloist" }), give("shield", "holder", share(0.1, "max_hp")))] }),
    ],
    "Barrage 2 ●●●, Toll ●",
  );
}
{
  // HP lost, not paid: a drawback (a drain fires no hp_paid), so no Shield soaks it and nothing reads it as a price.
  const bleeder = "Hits deal +50%. Loses 0.5% of max HP every tick, past any Shield.";
  const drinker = "Lifesteal past full becomes a Shield.", donor = "Its heals and Shields on the Bleeder are doubled.";
  const onBleeder: UnitCondT = { has: "blood_oath_bleeder" };
  add(
    formation("Blood oath", "rare", "One bleeds for power, one drinks, one mends.", [
      { name: "Bleeder", text: bleeder, statuses: ["blood_oath_bleeder"] },
      { name: "Drinker", text: `Lifesteal, high. ${drinker}`, stats: [LIFESTEAL_HIGH], statuses: ["blood_oath_drinker"] },
      { name: "Donor", text: donor, statuses: ["blood_oath_donor"] },
    ]),
    [
      held("blood_oath_bleeder", "Bleeder", bleeder, { pulse: { every: 1, do: [{ op: "pay", hp: share(0.005, "max_hp"), drain: true, to: "holder" }] }, boosts: hits(50) }),
      held("blood_oath_drinker", "Drinker", drinker, {
        reactions: [reactIf(on("overhealed", { status: "lifesteal" }), [{ unit: "owner", where: { lacks: OVERHEAL.own } }], give("shield", "holder", ofAmount(1)))],
      }),
      held("blood_oath_donor", "Donor", donor, { boosts: [{ tag: "healing", pct: against(100, onBleeder) }, { tag: "shield", pct: against(100, onBleeder) }] }),
    ],
    "Pact 2 ●●●, Landslide ● ⚙ brink (key), red stone (key)",
  );
}
{
  // Someone always stands in the light: Hidden's own rule (the engine's).
  const shadow = "At fight start and whenever a foe falls: Hidden.";
  add(
    formation("Decoy", "rare", "Two in the dark, one in the light.", [
      { name: "Light", text: "At fight start: Taunts and is Guarded.", statuses: ["decoy_light"] },
      ...twice({ name: "Shadow", text: shadow, statuses: ["decoy_shadow"] }),
    ]),
    [
      held("decoy_light", "Light", "At fight start: Taunts and is Guarded.", { reactions: [atStart(give("taunt"), give("guard"))] }),
      held("decoy_shadow", "Shadow", shadow, { reactions: [atStart(give("hidden")), react(EV.fall, give("hidden"))] }),
    ],
    "Toll ●●, Hunt ●●, Pact ● ⚙ two in the dark (key)",
  );
}
{
  const sentinel = "When an ally falls: Taunts and is Guarded.", chaplain = "Allies it revives come back Guarded, with a Shield of 25% of their max HP.";
  const watcher = "When an ally falls: gains a Shield of 25% of its max HP.";
  add(
    formation("Vigil", "rare", "Nobody falls alone.", [
      { name: "Sentinel", text: sentinel, statuses: ["vigil_sentinel"] },
      { name: "Chaplain", text: chaplain, statuses: ["vigil_chaplain"] },
      { name: "Watcher", text: watcher, statuses: ["vigil_watcher"] },
    ]),
    [
      held("vigil_sentinel", "Sentinel", sentinel, { reactions: [react(EV.allyFall, give("taunt"), give("guard"))] }),
      held("vigil_chaplain", "Chaplain", chaplain, { reactions: [react(on("revived", { whose: "ally", other: "holder" }), give("guard", "owner"), give("shield", "owner", share(0.25, "max_hp", "target")))] }),
      held("vigil_watcher", "Watcher", watcher, { reactions: [react(EV.allyFall, give("shield", "holder", share(0.25, "max_hp")))] }),
    ],
    "net",
  );
}
{
  /** The Wheel's parts, each the next seat's: Wall → Blade → Well → Wall. */
  const PARTS = {
    wall: { name: "WALL", text: "Draws more. Defense up.", stats: [st("aggro", 1), st("defense", 1)], next: "blade" },
    blade: { name: "BLADE", text: "Basic attacks 20% faster. Crits more.", stats: [FIFTH_FASTER, critSt(1)], next: "well" },
    well: { name: "WELL", text: "Regains MP in fights. Heals on it are stronger.", stats: [st("mp_regen", 1), STRONGER_HEALS], next: "wall" },
  } as const;
  /**
   * A part of the Wheel (it turns every so often, the first turn after half of that). Each seat starts the fight holding its
   * opening part; when a part runs out, its holder takes the next seat's part. On a revive its seat gives it its opening part again.
   */
  const part = (key: keyof typeof PARTS, opening: boolean): StatusT => {
    const p = PARTS[key];
    const sid = `the_wheel_${key}${opening ? "_opening" : ""}`;
    return {
      id: sid, name: p.name, text: p.text, label: "buff", show: "icon", stacking: "refresh", unremovable: true, duration: opening ? COOLDOWN.short / 2 : SO_OFTEN,
      stats: [...p.stats], reactions: [react(on("status_ended", { status: sid, cause: ["expired"] }), give(`the_wheel_${p.next}`))],
    } as StatusT;
  };
  add(
    formation("The wheel", "rare", "Every so often, each unit takes the next seat's part.", [
      { name: "Wall", text: PARTS.wall.text, statuses: ["the_wheel_wall_opening"] },
      { name: "Blade", text: PARTS.blade.text, statuses: ["the_wheel_blade_opening"] },
      { name: "Well", text: PARTS.well.text, statuses: ["the_wheel_well_opening"] },
    ]),
    [part("wall", true), part("blade", true), part("well", true), part("wall", false), part("blade", false), part("well", false)],
    "exotic",
  );
}
