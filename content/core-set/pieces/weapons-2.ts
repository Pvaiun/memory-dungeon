/**
 * Six weapon kinds' pieces, 53 in all: bow, rune sword, hammer, mace, staff and great weapon, 12 commons, 18 uncommons, 14
 * rares and 9 legendaries. Each piece carries its kind's budget of stat steps at its rarity (kit.ts budgetOf), chosen for the
 * piece and not for the build its effect serves, at most half on its kind's leaning, a step down at most; a common carries the
 * line assigned to it. Every weapon swings as its kind's plain weapon does unless its card or its swing trade says otherwise.
 * Statuses are at their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { GearT, NumT, StatusT } from "../../../src/schema.js";
import { STATUS } from "../scale.js";
import { SO_OFTEN, EV, NO_MARK, TO, against, count, countAt, critStep, give, hits, lift, marker, ofAmount, on, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, weaponHit, type Change, type Rarity, type Trade } from "./kit.js";

const S = shelf();

/** One weapon of a kind: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function weapon(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; trade?: Trade; weapon?: GearT["weapon"]; statuses?: StatusT[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "weapon", rarity, effect: o.effect, stats: o.stats, trade: o.trade, weapon: o.weapon, statuses: statuses.filter((s) => s.id === id(name)).map((s) => s.id) }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);
/** A stat a step down (a negative step): it buys one step more elsewhere on the piece, once (kit.ts downOf). */
const down = (c: Change): Change => ({ ...c, flat: -c.flat });
/** "Each ability its wearer casts": a cast that resolves, a repeat included. */
const CAST = EV.cast;
/** "Heals it gives": a heal that lands on any ally, itself included, from this unit; a Regen's pulses aren't heals. */
const GIVEN = { whose: "team" as const, other: "holder" as const, notTags: ["pulse"] };

// ─── Bow ──

weapon("bow", "common", "Bodkin bow", { stats: [sp("crit_damage", "medium")], serves: "the Hunt and Landslide (Crit damage)" });
weapon("bow", "common", "Iron-backed bow", { stats: [st("defense", 2), down(sp("cooldown", "medium"))], serves: "Landslide and the Toll (Defense)" });

{
  const name = "Whistling bow", effect = "On a crit: Weakens the target.";
  weapon("bow", "uncommon", name, {
    effect, stats: [critStep(1), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.crit, give("weaken", "other"))] })],
    serves: "Toll 1 ●●, foes do less ◆ Weaken",
  });
}
{
  // 30% less often: Attack speed −43 is a speed of 1 ÷ 1.43. It's the piece's shape (counting no step, as the Worldbreaker's
  // half as often), among its stats so the swing's shown speed is true.
  const name = "Patient bow", effect = "Basic attacks come 30% less often and always crit.";
  weapon("bow", "uncommon", name, {
    effect, stats: [{ stat: "attack_speed", flat: -43 }, st("defense", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { crits: [{ tag: "basic", chance: 100 }] })],
    serves: "Landslide 1 ●●, Hunt 1 ●● ◆ crits",
  });
}
{
  const name = "Frostbite bow", effect = "Basic attacks add Chill.";
  weapon("bow", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("chill", "other", own("several", "attack")))] })],
    serves: "Snap 1 ●● ⚙ lead's colour (half) ◆ Chill",
  });
}
{
  const name = "Huntsman's bow", effect = "Basic attacks Mark their target, if no foe is Marked. Hits on a Marked foe deal +33%.";
  weapon("bow", "rare", name, {
    effect, stats: [st("attack", 1), sp("accuracy", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { boosts: hits(against(33, { has: "marked" })), reactions: [reactIf(EV.basic, NO_MARK, give("marked", "other"))] })],
    serves: "Hunt 2 ●●● ◆ Mark",
  });
}
{
  // An ally's basic attack that lands (its own hit, not an extra strike or a bonus hit) takes a tick off the bow's next.
  const name = "Volley bow", effect = "When an ally's basic attack lands: next basic attack comes 1 tick sooner.";
  weapon("bow", "rare", name, {
    effect, stats: [critStep(1), sp("cooldown", "medium"), st("aggro", -1)],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { whose: "ally", kind: "basic" }), { op: "cooldown", which: "basic", set: { less: 1 }, to: "holder" })] })],
    serves: "conditional, Cuts 2 ●●●, Hunt ●● ◆ speed",
  });
}
{
  const name = "Executioner's longbow";
  const effect = "Basic attacks ignore Taunt and deal more as the target's HP falls: +25% below 75%, +50% below half, +75% below 25%, double below 10%.";
  weapon("bow", "legendary", name, {
    effect, stats: [sp("accuracy", "high"), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { seek: "basic", boosts: [{ tag: "basic", pct: { scale: [75, 50, 25, 10].map((hpBelow) => ({ ratio: 25, when: { hpBelow }, of: "target" as const })) } }] })],
    serves: "Hunt 3 ●●● ◆ executes",
  });
}

// ─── Rune sword ──

weapon("rune_sword", "common", "Runed saber", { stats: [st("max_mp", 1)], serves: "Barrage (MP)" });
weapon("rune_sword", "common", "Honed runeblade", { stats: [critStep(2), down(sp("attack_speed", "medium"))], serves: "the Hunt and Landslide (Crit chance)" });

{
  // Read as the reaction resolves, a sub-tick after the hit: a wind-up the hit didn't end is still under way.
  const name = "Hindering blade", effect = "Basic attacks on a foe winding up Slow it.";
  weapon("rune_sword", "uncommon", name, {
    effect, stats: [st("defense", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.basic, { unit: "other", where: { casting: true } }, give("slow", "other"))] })],
    serves: "Snap 1 ●●, stops a cast ◆ the slow",
  });
}
{
  const name = "Sigil blade", effect = "Defense up by 10% of max MP.";
  weapon("rune_sword", "uncommon", name, {
    effect, stats: [st("max_mp", 1), st("attack", 1)],
    statuses: [own_(name, effect, { stats: [{ stat: "defense", flat: share(0.1, "max_mp"), live: true }] })],
    serves: "Landslide 1 ●●, Barrage 1 ●● ◆ Defense, mana as a stat",
  });
}
{
  const name = "Wellblade", effect = "Basic attacks restore 10% of max MP.";
  weapon("rune_sword", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), critStep(1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "mp", amount: share(0.1, "max_mp"), to: "holder" })] })],
    serves: "Barrage 1 ●● ◆ MP",
  });
}
{
  // The shattered foe's cold, halved, to the other foe that holds the most (by draw where none holds any); passed, so a chain dies down.
  const name = "Winter's chain", effect = "When a foe's Chill shatters, the other foe with the most Chill gains half of it.";
  weapon("rune_sword", "rare", name, {
    effect, stats: [st("mp_regen", 1), st("defense", 1), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.shatter, give("chill", { side: "foes", pick: "highest", by: { stacks: "chill" }, exclude: "owner" }, ofAmount(0.5), { passed: true }))] })],
    serves: "Snap 2 ●●● ◆ the firecracker string",
  });
}
{
  // A foe that strikes a Taunting ally carries the mark for a Taunt's length, renewed by each such blow, and loses it when a
  // Taunt on an ally ends. A Taunt is any status that makes its holder Taunting (a `forced` stat).
  const name = "Wardblade", mark = `${id(name)}_mark`;
  const effect = "While another ally Taunts: hits on foes that hit that ally deal +40%.";
  weapon("rune_sword", "rare", name, {
    effect, stats: [st("max_hp", 1), st("attack", 1), critStep(1)],
    statuses: [
      own_(name, effect, {
        boosts: hits(against(40, { has: mark })),
        reactions: [
          reactIf(on("hit_taken", { whose: "ally" }), { unit: "owner", where: { kind: { kind: "stat", tag: "forced" } } }, give(mark, "other")),
          react(on("status_ended", { status: "taunt", whose: "ally" }), lift(mark, TO.everyFoe, "marker")),
        ],
      }),
      marker(mark, "Struck the Taunter", "It hit an ally while that ally Taunted: the Wardblade's hits on it deal +40%.", { duration: STATUS.taunt.duration }),
    ],
    serves: "conditional, Toll 2 ●●● ◆ the free seat",
  });
}
{
  // The latest cast's half-cost is held as a tally beside the doubled swing; a second cast replaces both, and the swing spends them.
  const name = "Spellbinder", on_ = `${id(name)}_on`, mp = `${id(name)}_mp`;
  const effect = "After each cast: next basic attack deals double and, when it lands, refunds half that cast's MP.";
  weapon("rune_sword", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 1), sp("accuracy", "medium")],
    statuses: [
      own_(name, effect, {
        reactions: [
          react(CAST, lift(mp, "holder", "marker"), give(on_), give(mp, "holder", ofAmount(0.5))),
          reactIf(EV.basic, { side: "self", where: { has: on_ } }, { op: "mp", amount: stacksOf(mp), to: "holder" }),
          react(EV.swing, lift(on_), lift(mp, "holder", "marker")),
        ],
      }),
      // Removable, so its own swing lifts it (a remove skips an unremovable status even by name).
      { id: on_, name: "SPELLBOUND", text: "Next basic attack deals double.", label: "buff", show: "icon", stacking: "fizzle", boosts: [{ tag: "basic", pct: 100 }] },
      marker(mp, "Spellbound MP", "MP its next basic attack gives back.", { stacking: "intensity" }),
    ],
    serves: "conditional, Barrage 2 ●●● ◆ the spellblade",
  });
}
{
  const name = "Brimming blade", effect = "Ability hits deal extra damage equal to the cast's MP cost.";
  weapon("rune_sword", "legendary", name, {
    effect, stats: [st("max_mp", 1), sp("cast_speed", "medium"), st("defense", 1)],
    statuses: [own_(name, effect, { adds: [{ on: "ability", amount: { scale: [{ ratio: 1, cost: "mp" }] } }] })],
    serves: "conditional, Barrage 3 ●●● ◆ mana as damage",
  });
}
{
  // A plain beat from the fight's start: the first at 22 ticks. Ready still waits on MP and an ability's own conditions.
  const name = "Midnight blade", effect = `Every ${SO_OFTEN} ticks: its abilities are ready, but so are every foe's.`;
  weapon("rune_sword", "legendary", name, {
    effect, stats: [sp("evasion", "high"), sp("siphon", "medium")],
    statuses: [own_(name, effect, {
      pulse: { every: SO_OFTEN, do: [{ op: "cooldown", which: "abilities", set: "ready", to: "holder" }, { op: "cooldown", which: "abilities", set: "ready", to: TO.everyFoe }] },
    })],
    serves: "exotic",
  });
}

// ─── Hammer ──

weapon("hammer", "common", "Spiked hammer", { stats: [sp("thorns", "medium")], serves: "the Toll (Thorns)" });
weapon("hammer", "common", "Votive hammer", { stats: [st("mp_regen", 2), down(critStep(1))], serves: "Barrage (MP regen)" });

{
  const name = "Warden's hammer", effect = "Basic attacks deal extra damage equal to 10% of Defense.";
  weapon("hammer", "uncommon", name, {
    effect, stats: [critStep(1)],
    statuses: [own_(name, effect, { adds: [{ on: "basic", amount: share(0.1, "defense") }] })],
    serves: "Landslide 1 ●● ◆ Defense as damage",
  });
}
{
  const name = "Mason's hammer", effect = "Basic attacks Guard the ally with the lowest HP%.";
  weapon("hammer", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("guard", TO.lowestAlly))] })],
    serves: "Landslide 1 ●●, Toll 1 ●● ◆ stone, keeper",
  });
}
{
  // The third landed basic attack Stuns before the count takes it; a Stun that can't land is lost, and the count starts again.
  const name = "Bellringer", n = `${id(name)}_count`, effect = "Every 3rd basic attack that lands Stuns its target.";
  weapon("hammer", "uncommon", name, {
    effect, trade: "light", stats: [st("max_hp", 1), sp("accuracy", "medium")],
    statuses: [
      own_(name, effect, { reactions: [reactIf(EV.basic, { side: "self", where: countAt(n, 2) }, give("stun", "other")), react(EV.basic, give(n, "holder", 1))] }),
      count(n, "BELL", "Every 3rd basic attack that lands Stuns.", 3),
    ],
    serves: "Landslide 1 ●●, Snap 1 ●● ⚙ held charge (half), emptied quiver (half) ◆ a held foe",
  });
}
{
  const name = "Grudgebearer", effect = "When hit: gains a Wrath (next basic attack +20% per Wrath, up to 10).";
  weapon("hammer", "rare", name, {
    effect, stats: [st("aggro", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("wrath", "holder", 1))] })],
    serves: "conditional, Toll 2 ●●●, Landslide 2 ●● ⚙ reckoning (key)",
  });
}
{
  const name = "Mountainfall", effect = "Basic attacks deal extra damage equal to 20% of max HP.";
  const hit = weaponHit("hammer") as Exclude<NumT, number>;
  weapon("hammer", "rare", name, {
    effect, stats: [st("defense", 1), sp("double_strike", "medium")],
    weapon: { kind: "hammer", amount: { ...hit, scale: [...hit.scale, { ratio: 0.2, stat: "max_hp", of: "self" }] } },
    serves: "Landslide 2 ●●● ◆ max HP as damage",
  });
}
{
  const name = "Cornerstone hammer", effect = "Basic attacks deal extra damage equal to half of all Shield the party holds.";
  weapon("hammer", "legendary", name, {
    effect, stats: [st("max_hp", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { adds: [{ on: "basic", amount: { scale: [{ ratio: 0.5, count: { side: "allies", stacks: "shield" } }] } }] })],
    serves: "conditional, Landslide 3 ●●● ◆ Shield",
  });
}

// ─── Mace ──

weapon("mace", "common", "Morningstar", { stats: [critStep(1), sp("thorns", "medium")], serves: "the Toll and the Hunt (Crit chance and Thorns)" });
weapon("mace", "common", "Flanged mace", { stats: [st("attack", 2)], serves: "Landslide (Attack)" });

{
  const name = "Censer mace", effect = "Basic attacks add Burn.";
  weapon("mace", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("attack", 1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("burn", "other", own("many", "attack")))] })],
    serves: "Bonfire 1 ●●● ⚙ lead's colour (half) ◆ Burn",
  });
}
{
  const name = "Mender's mace", effect = `Every ${SO_OFTEN} ticks: heals the ally with the lowest HP% for 20% of the wearer's max HP.`;
  weapon("mace", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), st("aggro", -1), critStep(1)],
    statuses: [own_(name, effect, { pulse: { every: SO_OFTEN, do: [{ op: "heal", amount: share(0.2, "max_hp"), to: TO.lowestAlly }] } })],
    serves: "Pact 1 ●● ⚙ brink (half) ◆ the net",
  });
}
{
  // What lands, not what's cast: a heal that restores nothing gives no Guard.
  const name = "Penitent's mace", effect = "Each ally it heals is Guarded.";
  weapon("mace", "uncommon", name, {
    effect, stats: [sp("thorns", "medium"), st("aggro", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("healed", GIVEN), give("guard", "owner"))] })],
    serves: "Toll 1 ●●, Landslide 1 ●● ◆ keeper, stone",
  });
}
{
  // A tally on the healed ally, half the heal a point (what went past full too), added to its next hit and spent by it.
  const name = "Saint's mace", tally = `${id(name)}_blessing`;
  const effect = "Each heal it gives: the ally's next hit deals extra damage equal to half the heal, adding up.";
  weapon("mace", "rare", name, {
    effect, stats: [st("mp_regen", 1), sp("cooldown", "medium"), st("attack", 1), critStep(1)],
    statuses: [
      // What lands, not what's cast: healing past full (or past a cap on healing) gives nothing.
      own_(name, effect, { reactions: [react(on("healed", GIVEN), give(tally, "owner", ofAmount(0.5)))] }),
      { id: tally, name: "BLESSED", text: "Next hit deals extra damage: half the heals it was given.", label: "buff", show: "icon", stacking: "intensity", adds: [{ on: "physical", amount: 1 }], trigger: { on: EV.hit }, drop: "all" },
    ],
    serves: "conditional, Pact 2 ●●●, Landslide 2 ●● ◆ the healer's blow",
  });
}
{
  const name = "Anchorite's mace", effect = "Heals it gives the ally with the most Aggro are doubled.";
  weapon("mace", "rare", name, {
    effect, stats: [st("max_hp", 1), st("max_mp", 1), sp("cast_speed", "medium"), st("aggro", -1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "healing", pct: against(100, { top: { stats: ["aggro"] } }) }] })],
    serves: "conditional, Toll 2 ●●● ◆ keeper",
  });
}
{
  const name = "Martyr's mace";
  const effect = "Basic attacks deal +50% below 70% HP, double below half, ×2.5 below 33% and triple below 10%. Below 33%, they heal it for the damage dealt.";
  weapon("mace", "legendary", name, {
    effect, stats: [st("max_hp", 1), sp("thorns", "medium"), st("attack", 1), sp("attack_speed", "medium"), critStep(1), down(st("defense", 1))],
    statuses: [own_(name, effect, {
      boosts: [{ tag: "basic", pct: { scale: [70, 50, 33, 10].map((hpBelow) => ({ ratio: 50, when: { hpBelow }, of: "holder" as const })) } }],
      reactions: [reactIf(EV.basic, { side: "self", where: { hpBelow: 33 } }, { op: "heal", amount: ofAmount(1), to: "holder" })],
    })],
    serves: "Pact 3 ●●● ⚙ brink (half) ◆ below half",
  });
}
{
  // A plain beat from the fight's start: the first at 22 ticks. Each unit heals a tenth of its own max HP.
  const name = "Noonday mace", effect = `Every ${SO_OFTEN} ticks: every ally heals 10% of its max HP, but so does every foe.`;
  const tenth = share(0.1, "max_hp", "target");
  weapon("mace", "legendary", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1), sp("crit_damage", "high")],
    statuses: [own_(name, effect, { pulse: { every: SO_OFTEN, do: [{ op: "heal", amount: tenth, to: TO.everyAlly }, { op: "heal", amount: tenth, to: TO.everyFoe }] } })],
    serves: "exotic",
  });
}

// ─── Staff ──

weapon("staff", "common", "Beacon staff", { stats: [st("aggro", 1), sp("cooldown", "medium")], serves: "the Toll and Barrage (Aggro and Cooldown)" });
weapon("staff", "common", "Ringed staff", { stats: [st("aggro", 2)], serves: "the Toll (Aggro)" });

{
  const name = "Shepherd's staff", effect = "Each cast gives the ally with the lowest MP% half its MP cost.";
  weapon("staff", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), st("aggro", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("action_resolve", { kind: "ability", paid: true }), { op: "mp", amount: ofAmount(0.5), to: TO.leastMpAlly })] })],
    serves: "Barrage 1 ●● ⚙ mana as armour (half) ◆ MP",
  });
}
{
  // The spar is a bonus hit on the ally, a twentieth of the swing, which sets off what a hit sets off on it (its Thorns
  // included); the Might comes whether the spar lands or is dodged, and isn't part of what the swing carries. The spar's hits
  // carry the piece's id as their tag.
  // The spar is a tap, not a hit: damage of no type, so nothing the ally does when hit (Thorns, a riposte) answers its partner.
  const name = "Sparring staff";
  const effect = "Basic attacks also tap the other ally with the most max HP for 5% of the damage, and give it Might.";
  const sparred = { side: "others", pick: "highest", by: { stat: "max_hp" } } as const;
  weapon("staff", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("attack", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, {
      reactions: [react(EV.basic, { op: "damage", type: "none", amount: ofAmount(0.05), to: sparred }, give("might", sparred, own("few", "attack"), { rider: false }))],
    })],
    serves: "Landslide 1 ●●, a door for the Monk ◆ loading",
  });
}
{
  const name = "Vesper staff", effect = "Each cast heals the ally with the lowest HP% for 10% of Attack.";
  weapon("staff", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), st("aggro", -1), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [react(CAST, { op: "heal", amount: share(0.1, "attack"), to: TO.lowestAlly })] })],
    serves: "Pact 1 ●● ⚙ brink (half) ◆ life passed",
  });
}
{
  const name = "Ritual staff", effect = "Abilities wind up 50% longer, deal +50% and add +50% stacks.";
  weapon("staff", "rare", name, {
    effect, stats: [sp("cast_speed", "medium"), st("attack", 2), st("defense", 1)],
    statuses: [own_(name, effect, { mods: [{ wind: 50, damage: 50, stacks: { pct: 50 } }] })],
    serves: "Barrage 2 ●●● ◆ Cast speed, every cast's stacks",
  });
}
{
  // A count to two of its own casts (a repeat isn't one): at one, the next cast has no wind-up, and that cast empties the count.
  const name = "Evensong staff", n = `${id(name)}_count`;
  const effect = "Every second ability it casts has no wind-up.";
  weapon("staff", "rare", name, {
    effect, stats: [st("max_mp", 1), st("mp_regen", 1), critStep(1), st("attack", 1)],
    statuses: [
      own_(name, effect, { mods: [{ cast: 0, if: countAt(n, 1) }], reactions: [react(on("action_resolve", { kind: "ability", repeat: false }), give(n, "holder", 1))] }),
      count(n, "EVENSONG", "At 1: next ability has no wind-up.", 2),
    ],
    serves: "Barrage 2 ●●● ◆ Cast speed",
  });
}
{
  // Conditional through its stats: Crit damage high, on casters who crit little until the party lifts their Crit chance.
  const name = "Staff of echoes";
  const effect = "Abilities are cast twice, the second at once and aimed anew. Each cast pays its MP.";
  weapon("staff", "legendary", name, {
    effect, stats: [sp("crit_damage", "high"), sp("cast_speed", "medium"), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("action_resolve", { kind: "ability", repeat: false }), { op: "recast", paid: true })] })],
    serves: "conditional, Barrage 3 ●●● ◆ the cast twice",
  });
}

// ─── Great weapon ──

weapon("great_weapon", "common", "Clarion glaive", { stats: [st("aggro", 1), sp("cast_speed", "medium")], serves: "the Toll and Landslide (Aggro and Cast speed)" });
weapon("great_weapon", "common", "Guardsman's halberd", { stats: [st("defense", 2)], serves: "Landslide (Defense)" });

{
  // Its basic attacks don't set off Might's spend; its abilities, and every other unit's actions, still do.
  const name = "Roaring greataxe", effect = "Basic attacks don't spend Might.";
  weapon("great_weapon", "uncommon", name, {
    effect, stats: [st("attack", 1), st("defense", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { spare: { status: "might", kind: "basic" } })],
    serves: "Landslide 1 ●● ◆ loading",
  });
}
{
  const name = "Giantsbane", effect = "Basic attacks deal +50% to a foe above half HP.";
  weapon("great_weapon", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1), critStep(1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: against(50, { hpAtLeast: 50 }) }] })],
    serves: "Landslide 1 ●● ◆ aim",
  });
}
{
  // A bonus hit of the swing's size on each other foe below a quarter of its HP as the swing ends; it carries nothing.
  const name = "Harvest scythe", effect = "Basic attacks also hit every other foe below 25% HP.";
  weapon("great_weapon", "uncommon", name, {
    effect, stats: [sp("lifesteal", "medium"), sp("attack_speed", "medium"), st("defense", 1)],
    statuses: [own_(name, effect, { strike: { to: { side: "foes", pick: "all", where: { hpBelow: 25 }, exclude: "targets" }, kind: "bonus" } })],
    serves: "Hunt 1 ●● ◆ executes",
  });
}
{
  const name = "Icebreaker", effect = "Hits on a Stunned foe deal double.";
  weapon("great_weapon", "rare", name, {
    effect, stats: [st("attack", 1), sp("crit_damage", "medium"), st("defense", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { boosts: hits(against(100, { has: "stun" })) })],
    serves: "Landslide 2 ●●●, Snap 2 ●● ◆ a held foe",
  });
}
{
  // The left-over runs on with every kill it makes (no `bare` filter); beside another carrier of the same blow, it's split.
  const name = "Overrun", effect = "Damage left over from a kill carries into another foe, and on with each kill.";
  weapon("great_weapon", "rare", name, {
    effect, trade: "heavy", stats: [st("attack", 1), critStep(1), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { reactions: [{ on: EV.kill, split: "over", do: [{ op: "strike", of: "over", to: TO.foeByDraw }] }] })],
    serves: "Landslide 2 ●●●, Hunt ●● ⚙ avalanche (key)",
  });
}
{
  // Each foe that acts carries a mark until the maul's wearer next makes a basic attack: that swing's hits read the mark, and
  // the swing's own resolve (a sub-tick later) lifts every mark. Conditional through its stats: Thorns and Aggro pay on an anchor.
  const name = "Thunderhead maul", acted = `${id(name)}_acted`;
  const effect = "Hits on a foe that has acted since the wearer's last basic attack deal +40%.";
  weapon("great_weapon", "rare", name, {
    effect, stats: [st("aggro", 1), sp("thorns", "medium"), st("defense", 1), st("mp_regen", 1)],
    statuses: [
      own_(name, effect, {
        boosts: hits(against(40, { has: acted })),
        reactions: [react(on("action_resolve", { whose: "foe" }), give(acted, "owner")), react(EV.swing, lift(acted, TO.everyFoe, "marker"))],
      }),
      marker(acted, "Acted", "It has acted since the Thunderhead maul's last swing: the maul's hits on it deal +40%."),
    ],
    serves: "conditional, Storm 2 ●●● ◆ the foes' clock",
  });
}
{
  // Half as often is its shape (Attack speed −100 counts no step), among its stats so the swing's shown speed is true.
  const name = "Worldbreaker", effect = "Basic attacks come half as often, deal triple and Stun their target.";
  weapon("great_weapon", "legendary", name, {
    effect, stats: [{ stat: "attack_speed", flat: -100 }, sp("crit_damage", "high"), st("defense", 1), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: 200 }], reactions: [react(EV.basic, give("stun", "other"))] })],
    serves: "Landslide 3 ●●● ⚙ held charge (half) ◆ the heavy action",
  });
}
{
  const name = "Twinfall";
  // Half again, not double: the second landing is half the first (the held-back lever: half again where the condition holds all fight).
  const effect = "Every hit lands again a tick later, for half the damage.";
  weapon("great_weapon", "legendary", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1), sp("evasion", "medium"), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { notTags: ["bare"] }), { op: "strike", of: "dealt", share: 50, after: 1, to: "other" })] })],
    serves: "Landslide 3 ●●●, Hunt ●● ◆ the heavy action",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
