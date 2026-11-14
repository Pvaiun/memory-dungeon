/** The legendary formations. Each adds itself to kit.ts's lists. */
import type { StatusT, UnitCondT } from "../../../src/schema.js";
import { EV, FEW_TICKS, NO_MARK, SO_OFTEN, TAUNTS_ALL_FIGHT, TO, against, atStart, give, hits, lift, ofAmount, on, react, reactIf, share } from "../pieces/kit.js";
import { OVERHEAL } from "../pieces/shared.js";
import { COOLDOWN, FLAT_STACKS } from "../scale.js";
import { CRITS_FAR_MORE, EVASION, FIFTH_FASTER, FIFTH_SOONER, LIFESTEAL, LIFESTEAL_HIGH, NOTHING, STRONGER_HEALS, THIRD_FASTER, THIRD_SOONER, THORNS, add, critSt, formation, held, st, thrice, twice } from "./kit.js";

// ─── Legendary ───────────────────────────────────────────────────────────────

{
  // The Foothills' larger Shields: every ally's Shields on a Foothill are a third bigger, its own included.
  const peak = "While every ally holds a Shield, each hit lands 2 times.";
  const foothill = "At fight start: a Shield of 20% of its max HP. Shields on it are 33% bigger.";
  add(
    formation("The mountain", "legendary", "A peak that stands on the party's stone.", [
      { name: "Peak", text: peak, statuses: ["the_mountain_peak"] },
      ...twice({ name: "Foothill", text: foothill, statuses: ["the_mountain_foothill"] }),
    ], { statuses: ["the_mountain"] }),
    [
      held("the_mountain_peak", "Peak", peak, { reactions: [reactIf(on("hit_lands", { notTags: ["bare"] }), { side: "allies", where: { lacks: "shield" }, atMost: 0 }, { op: "strike", of: "dealt", to: "other" })] }),
      held("the_mountain_foothill", "Foothill", foothill, { reactions: [atStart(give("shield", "holder", share(0.2, "max_hp")))] }),
      held("the_mountain", "The mountain", "Its Shields on a Foothill are 33% bigger.", { boosts: [{ tag: "shield", pct: against(33, { has: "the_mountain_foothill" }) }] }),
    ],
    "Landslide 3 ●●● ⚙ detonation (half)",
  );
}
{
  // Each ally keeps its own copy of the party's count, fed by every ally's hits (one Edge an event).
  const party = "Every ally's hits add to one count of Edge (up to 25). Hits deal −20%, then +3% per Edge.";
  add(
    formation("The whetstone", "legendary", "Every hit the party lands sharpens the next.", thrice({ name: "Blade", text: NOTHING }), { text: party, statuses: ["the_whetstone"] }),
    [held("the_whetstone", "The whetstone", party, { reactions: [react(on("hit_lands", { whose: "team" }), give("edge", "holder", 1))], boosts: hits({ base: -20, scale: [{ ratio: 3, stacks: "edge", of: "holder" }] }) })],
    "Cuts 3 ●●●, Storm ●●",
  );
}
{
  // Each ally turns on its own clock, together: Surge for 22 ticks (Haste as it begins, hits +20%), then Ebb (Guard as it begins, 30% slower), and back.
  const party = `Every ${SO_OFTEN} ticks the party turns. Surge: every ally Hasted, hits +20%. Ebb: every ally Guarded, 30% slower.`;
  const slower = ["attack_speed", "cooldown_reduction", "cast_time_reduction"].map((stat) => ({ stat, flat: -30 }));
  const tide = (id: string, name: string, text: string, next: string, body: Partial<StatusT>): StatusT =>
    ({ id, name, text, label: "buff", show: "icon", stacking: "refresh", unremovable: true, duration: SO_OFTEN, ...body, reactions: [...(body.reactions ?? []), react(on("status_ended", { status: id, cause: ["expired"] }), give(next))] }) as StatusT;
  add(
    formation("Tidal", "legendary", "The party rises and falls together.", thrice({ name: "Wave", text: NOTHING }), { text: party, statuses: ["tidal"] }),
    [
      held("tidal", "Tidal", party, { reactions: [atStart(give("tidal_surge"))] }),
      tide("tidal_surge", "SURGE", "Hits +20%.", "tidal_ebb", { boosts: hits(20), reactions: [react(on("status_gained", { status: "tidal_surge" }), give("haste"))] }),
      tide("tidal_ebb", "EBB", "30% slower.", "tidal_surge", { stats: slower, reactions: [react(on("status_gained", { status: "tidal_ebb" }), give("guard"))] }),
    ],
    "Cuts 3 ●●, Landslide ●● ◆ tempo, the beat",
  );
}
{
  const party = "No ally makes a basic attack. Abilities come round 40% faster.";
  add(
    formation("The still hour", "legendary", "Nobody swings; every spell comes round.", thrice({ name: "Watcher", text: NOTHING }), { text: party, stats: [{ stat: "cooldown_reduction", flat: 40 }], statuses: ["the_still_hour"] }),
    [held("the_still_hour", "The still hour", "Makes no basic attack.", { lockout: { covers: "basic" }, mods: [{ mp: -40 }] })],
    "Barrage 3 ●●, Snap ● ◆ the spell's beat",
  );
}
{
  const party = "Every ally's basic attacks come 100% faster, for 45% of the damage.";
  add(
    formation("The hundred hands", "legendary", "A blur of small blows.", thrice({ name: "Hand", text: NOTHING }), { text: party, stats: [{ stat: "attack_speed", flat: 100 }], statuses: ["the_hundred_hands"] }),
    [held("the_hundred_hands", "The hundred hands", "Basic attacks deal 45% of the damage.", { boosts: [{ tag: "basic", pct: -55 }] })],
    "Cuts 3 ●●, Storm ●● ◆ quick strikes, extra strikes",
  );
}
{
  // The Rear can't be picked (its own state, not Hidden) while both Vanguards stand: lifted when one falls, given back when one stands up again beside the other.
  const vanguard = "Draws far more. Acts 25% faster.", rear = "Abilities come round 50% faster. Can't be picked while both Vanguards stand.";
  const fast = ["attack_speed", "cooldown_reduction", "cast_time_reduction"].map((stat) => ({ stat, flat: 25 }));
  const both = { side: "allies" as const, where: { has: "vanguard_and_rear_vanguard" }, atLeast: 2 };
  add(
    formation("Vanguard and rear", "legendary", "Two in front, quick and loud; one unseen behind them.", [
      ...twice({ name: "Vanguard", text: vanguard, stats: [st("aggro", 2), ...fast], statuses: ["vanguard_and_rear_vanguard"] }),
      { name: "Rear", text: rear, stats: [{ stat: "cooldown_reduction", flat: 50 }], statuses: ["vanguard_and_rear_rear"] },
    ]),
    [
      held("vanguard_and_rear_vanguard", "Vanguard", "Marks a Vanguard's seat, for the Rear.", { label: "marker" }),
      held("vanguard_and_rear_rear", "Rear", "Can't be picked while both Vanguards stand.", {
        reactions: [
          reactIf(on("fight_start"), both, give("vanguard_and_rear_unseen")),
          react(on("ko", { whose: "ally", seat: "vanguard_a" }), lift("vanguard_and_rear_unseen")),
          react(on("ko", { whose: "ally", seat: "vanguard_b" }), lift("vanguard_and_rear_unseen")),
          reactIf(on("revived", { whose: "ally" }), both, give("vanguard_and_rear_unseen")),
        ],
      }),
      { id: "vanguard_and_rear_unseen", name: "UNSEEN", text: "Can't be picked.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "forbidden", flat: 1 }] } as StatusT,
    ],
    "Barrage 3 ●●, Hunt ● ◆ draw, the soloist's safety",
  );
}
{
  // The Banner's own Attack and Defense, read live off its seat: gone while it's down.
  const banner = "Never acts.", bearer = "Gains the Banner's Attack and Defense.";
  const seatStat = (stat: string) => ({ stat, flat: { scale: [{ ratio: 1, stat, seat: "banner" }] }, live: true as const });
  add(
    formation("Bannerman", "legendary", "One carries the colours; the others fight under them.", [
      { name: "Banner", text: banner, statuses: ["bannerman_banner"] },
      ...twice({ name: "Bearer", text: bearer, statuses: ["bannerman_bearer"] }),
    ]),
    [
      held("bannerman_banner", "Banner", "Never acts.", { lockout: { covers: "all" } }),
      held("bannerman_bearer", "Bearer", bearer, { stats: [seatStat("attack"), seatStat("defense")] }),
    ],
    "exotic ◆ the trade",
  );
}
{
  // The Soloist's own mana is the brake. A cooldown cut short, not gone: with none, a cast every tick or two fed a Crescendo
  // to its cap in a few ticks, and Siphon on the swollen hits paid the mana back (fights over in 9 ticks).
  const soloist = "Its first-slotted ability's cooldown is 75% shorter.";
  const voice = "Draws more.";
  add(
    formation("The cathedral", "legendary", "Two give their mana; one never stops singing.", [
      { name: "Soloist", text: soloist, statuses: ["the_cathedral_soloist"] },
      ...twice({ name: "Voice", text: voice, stats: [st("aggro", 1)] }),
    ]),
    [
      held("the_cathedral_soloist", "Soloist", soloist, { mods: [{ of: { first: true }, cooldown: -75 }] }),
    ],
    "Barrage 3 ●●● ⚙ crescendo (half)",
  );
}
{
  // Lifesteal at the medium step: high, on every ally and every swing, besides casting free of MP, put it 20 points over Neutral.
  const party = "Every ally's abilities cost HP, not MP, and none casts below 10% HP. Every ally has Lifesteal.";
  add(
    formation("The covenant", "legendary", "Life is the party's one currency.", thrice({ name: "Sworn", text: NOTHING }), { text: party, stats: [LIFESTEAL], statuses: ["the_covenant"] }),
    [held("the_covenant", "The covenant", "Its abilities cost HP, not MP; it never casts below 10% HP.", { mods: [{ hp: { pct: 50, share: true, floor: 10, instead: true } }] })],
    "Pact 3 ●●●, Barrage ●● ⚙ blood mage (key), brink (half)",
  );
}
{
  // What one Twin gives itself, shared with the other (a copy, so it isn't shared back).
  const twin = "Statuses it gives itself, the other Twin gains too.";
  add(
    formation("Twins", "legendary", "Two are bound as one.", [
      ...twice({ name: "Twin", text: twin, statuses: ["twins_twin"] }),
      { name: "Odd one out", text: "Attack up 2 steps.", stats: [st("attack", 2)] },
    ]),
    [held("twins_twin", "Twin", twin, { reactions: [react(on("status_gained", { other: "holder", repeat: false }), { op: "share", to: { side: "others", where: { has: "twins_twin" }, pick: "all" } })] })],
    "exotic ⚙ borrowed gift (key), two in the dark (half)",
  );
}
