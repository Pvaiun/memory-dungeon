/**
 * Six offhand kinds' pieces: kite shield, round shield, horn, totem, relic and lantern. Each carries the standard budget of
 * steps at its rarity, exactly (kit.ts piece). Statuses are at their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { StatusT } from "../../../src/schema.js";
import { FLAT_STACKS, HIT, SHOCK_STACKS, SPECIAL } from "../scale.js";
import { COUNTER, OVERHEAL } from "./shared.js";
import { EV, NO_MARK, SO_OFTEN, TO, atFirstStart, beatHalfway, atStart, give, marker, ofAmount, on, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, state, swingNow, used, whileHolding, type Change, type Rarity } from "./kit.js";

const S = shelf();

/** One offhand of a kind: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function offhand(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; statuses?: StatusT[]; also?: string[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "offhand", rarity, effect: o.effect, stats: o.stats, statuses: [...statuses.filter((s) => s.id === id(name)).map((s) => s.id), ...(o.also ?? [])] }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);
/** A status a piece lays on others: on the sheet, unremovable, refreshed. */
const given = (sid: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id: sid, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
/** A heal its holder gives an ally (itself included). */
const healGiven = (more: Parameters<typeof on>[1] = {}) => on("healed", { whose: "team", other: "holder", ...more });
// ─── Kite shield ──

offhand("kite_shield", "common", "Pavise", { stats: [st("defense", 1)], serves: "Landslide: Defense is its first stat." });
offhand("kite_shield", "common", "Blazoned kite", { stats: [st("aggro", 1)], serves: "the Toll: the draw is its first stat." });

{
  const name = "Emberguard", effect = "Foes that hit its holder gain a few Burn (from its holder's Defense).";
  offhand("kite_shield", "uncommon", name, {
    effect, stats: [st("defense", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("burn", "other", own("few", "defense")))] })],
    serves: "Bonfire 1 ●●, Toll ● ⚙ goad (half)",
  });
}
{
  const name = "Sheltering kite", effect = "When each fight starts, its holder and the other ally with the least Defense are Guarded.";
  offhand("kite_shield", "uncommon", name, {
    effect, stats: [st("defense", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("guard"), give("guard", { side: "others", pick: "lowest", by: { stat: "defense" } }))] })],
    serves: "Landslide ●, net ⚙ opening again (half), mirror (half)",
  });
}
{
  const name = "Bossed kite", effect = "Each hit of its holder's abilities deals extra damage equal to 17% of its Defense.";
  offhand("kite_shield", "uncommon", name, {
    effect, stats: [st("defense", 2)],
    statuses: [own_(name, effect, { adds: [{ on: "ability", amount: share(HIT.touch, "defense") }] })],
    serves: "Landslide 1 ●● ◆ heavy-blow",
  });
}
{
  // A Shield emptied by a foe's damage ends (cause stacks) naming that foe as its other.
  const name = "Rubble shield", effect = "When its holder's Shield breaks, the foe whose blow broke it is Stunned.";
  offhand("kite_shield", "rare", name, {
    effect, stats: [st("defense", 1), st("max_hp", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_ended", { status: "shield", cause: ["stacks"], other: "foe" }), give("stun", "other"))] })],
    serves: "Landslide 2 ●●, Toll ●●, Storm ● ⚙ held charge (half), detonation (half) ◆ held",
  });
}
{
  const name = "Mirror shield", effect = "Each foe that hits its holder is sent back 50% of the blow as it was struck: before Defense, Guard, an Aegis and Shields took theirs.";
  offhand("kite_shield", "rare", name, {
    effect, stats: [st("defense", 1), st("aggro", 1), sp("thorns", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, { op: "damage", type: "none", amount: { scale: [{ ratio: 0.5, event: "raw" }] }, to: "other" })] })],
    serves: "Toll 2 ●●●, Landslide 2 ●● ⚙ mirror (key)",
  });
}
{
  const name = "Monolith shield";
  const effect = "Its holder's abilities that deal damage take twice as long to come round, and their hits land twice as hard. What they apply is unchanged.";
  offhand("kite_shield", "rare", name, {
    effect, stats: [st("defense", 2), st("max_hp", 1)],
    statuses: [own_(name, effect, { mods: [{ of: { does: ["damage"] }, cooldown: 100, damage: 100 }] })],
    serves: "Landslide 2 ●●●, Hunt ● ⚙ shatter bell (half) ◆ heavy-blow",
  });
}
{
  const name = "Oathbound shield", effect = "When a hit would deal an ally more than 25% of its max HP, its holder takes the hit instead. A hit taken this way isn't passed on again.";
  offhand("kite_shield", "legendary", name, {
    effect, stats: [st("defense", 2), st("max_hp", 1), sp("thorns", "medium")],
    statuses: [own_(name, effect, { cover: { share: 25 } })],
    serves: "Toll 3 ●●●, Pact ●●, Barrage ●● ⚙ mirror (half)",
  });
}

// ─── Round shield ──

offhand("round_shield", "common", "Linden shield", { stats: [st("max_hp", 1)], serves: "the Toll and Landslide: HP is their first stat on this kind." });
offhand("round_shield", "common", "Bronze buckler", { stats: [st("defense", 1)], serves: "the Toll and Landslide: Defense, beside the other common's HP." });

{
  const name = "Comrade's targe", effect = "Every so often, the ally with the lowest share of max HP gains a Shield of 20% of its holder's max HP.";
  const b = beatHalfway(id(name), name, [give("shield", TO.lowestAlly, share(0.2, "max_hp"))]);
  offhand("round_shield", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: b.reactions }), ...b.statuses],
    serves: "Pact 1 ●●, Toll ●, Landslide ● ⚙ brink (half), detonation (half) ◆ lowest-ally",
  });
}
{
  const name = "Hunter's buckler", effect = "When its holder lands a killing blow, its holder is Hasted.";
  offhand("round_shield", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, give("haste"))] })],
    serves: "Hunt 1 ●●, Cuts ● ◆ kill-pays",
  });
}
{
  const name = "Spiked targe", on_ = `${id(name)}_on`, effect = "While its holder is Guarded, it has Thorns, high, on top of its own.";
  offhand("round_shield", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: whileHolding(on_, "guard") }), state(on_, "SPIKED", "Thorns, high, on top of its own.", { unremovable: true, stats: [{ stat: "thorns", flat: SPECIAL.thorns.high }] })],
    serves: "Toll 1 ●● ⚙ goad (half)",
  });
}
{
  // The wait runs from the last rebuild; a Shield broken inside it stays broken.
  const name = "Second skin", wait = `${id(name)}_wait`;
  const effect = "When its holder's Shield breaks, 50% of the most it held is rebuilt at once, as a new Shield. This can happen every so often. The rebuilt Shield can break and be rebuilt in its turn.";
  offhand("round_shield", "rare", name, {
    effect, stats: [st("max_hp", 2), st("attack", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("status_ended", { status: "shield", cause: ["stacks"] }), { side: "self", where: { lacks: wait } }, give("shield", "holder", ofAmount(0.5)), give(wait))] }),
      marker(wait, "Second skin (waiting)", "Its next rebuild comes once this wait is over.", { stacking: "fizzle", duration: SO_OFTEN }),
    ],
    serves: "Landslide ●●, Cuts ●●, Toll ● ⚙ detonation (key), riposte (half)",
  });
}
{
  const name = "Hoplon", effect = "While its holder holds a Shield or an Aegis, each foe that hits it is sent back whatever the Shield soaked and the Aegis blocked of the blow.";
  offhand("round_shield", "rare", name, {
    effect, stats: [st("max_hp", 2), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, { op: "damage", type: "none", amount: { scale: [{ ratio: 1, event: "stopped" }] }, to: "other" })] })],
    serves: "Toll 2 ●●●, Landslide 2 ●●● ⚙ mirror (key)",
  });
}
{
  // A `lower` test: the aura goes to allies with less Defense than the holder as the fight starts and on a revive; it ends with the holder.
  const name = "Tower shield", aura = `${id(name)}_aura`;
  const effect = "While its holder stands, allies with less Defense than it take 20% less damage. Its holder deals 20% less.";
  const lay = give(aura, { side: "others", where: { lower: { stat: "defense" } }, pick: "all" });
  offhand("round_shield", "rare", name, {
    effect, stats: [st("max_hp", 2), st("defense", 1)],
    statuses: [
      own_(name, effect, { boosts: [{ tag: "physical", pct: -20 }], reactions: [atStart(lay), react(on("revived"), lay), react(on("revived", { whose: "ally" }), lay)] }),
      given(aura, "TOWER", "Takes 20% less damage while the Tower shield's holder stands.", { perSource: { endsWithSource: true }, taken: [{ pct: -20 }] }),
    ],
    serves: "Barrage ●●, Bonfire ●●, Toll ●",
  });
}
{
  // The fallen ally by rule (a revive's rule asks for ko); the Shield follows on the revive it gave, once.
  const name = "Shield of the chosen", spent = `${id(name)}_used`, shielded = `${id(name)}_shielded`;
  const effect = "Once a fight, when another ally falls, its holder raises it at once with 10% of its max HP, behind a Shield of 33% of its holder's max HP.";
  offhand("round_shield", "legendary", name, {
    effect, stats: [st("max_hp", 2), st("aggro", 1), st("attack", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          reactIf(EV.allyFall, { side: "self", where: { lacks: spent } }, { op: "revive", hp: share(0.1, "max_hp", "target"), to: { side: "others", where: { ko: true }, pick: "random" } }, give(spent)),
          reactIf(on("revived", { whose: "ally", other: "holder" }), { side: "self", where: { has: spent, lacks: shielded } }, give("shield", "owner", share(1 / 3, "max_hp")), give(shielded)),
        ],
      }),
      used(spent, "SHIELD OF THE CHOSEN"),
      used(shielded, "Shield of the chosen (shielded)"),
    ],
    serves: "net",
  });
}
{
  // A per-source status on every other ally sends each Shield it would gain to the holder; what's sent isn't sent on.
  const name = "Lodestone shield", pull = `${id(name)}_pull`;
  const effect = "Every Shield another ally would gain goes to its holder instead. A Shield sent on this way isn't sent on again.";
  offhand("round_shield", "legendary", name, {
    effect, stats: [st("max_hp", 2), st("aggro", 1), st("defense", 1)],
    statuses: [
      own_(name, effect, { reactions: [atStart(give(pull, TO.otherAllies)), react(on("revived", { whose: "ally" }), give(pull, "owner"))] }),
      given(pull, "LODESTONE", "Every Shield it would gain goes to the Lodestone shield's holder.", { perSource: { endsWithSource: true }, divert: { what: "shield", to: "source" } }),
    ],
    serves: "exotic, Landslide ●● ⚙ detonation (half)",
  });
}

// ─── Horn ──

offhand("horn", "common", "Ram's horn", { stats: [st("aggro", 1)], serves: "the Toll: the draw is its first stat." });
offhand("horn", "common", "Ivory horn", { stats: [st("mp_regen", 1)], serves: "Barrage: the well's mana." });

{
  const name = "Reveille";
  const effect = "When each fight starts, the ally with the highest Attack has its ability with the longest cooldown ready at once: its slowest ability, by its whole cooldown.";
  offhand("horn", "uncommon", name, {
    effect, stats: [st("aggro", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "cooldown", which: "slowest", set: "ready", to: { side: "allies", pick: "highest", by: { stats: ["attack"] } } })] })],
    serves: "Landslide 1 ●●, Barrage 1 ●●, Hunt ●, first move ⚙ opening again (half)",
  });
}
{
  const name = "Bull's horn", rung = `${id(name)}_used`, effect = "The first time in a fight that a foe falls, every ally is Hasted.";
  offhand("horn", "uncommon", name, {
    effect, stats: [st("aggro", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.fall, { side: "self", where: { lacks: rung } }, give("haste", TO.everyAlly), give(rung))] }), used(rung, "BULL'S HORN")],
    serves: "Hunt 1 ●●, Cuts ● ◆ kill-pays",
  });
}
{
  const name = "Watch horn", effect = "Whenever an ally drops below 50% of its max HP, its holder Taunts.";
  offhand("horn", "uncommon", name, {
    effect, stats: [st("aggro", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hp_low", { whose: "team", line: 50 }), give("taunt"))] })],
    serves: "Toll 1 ●●, Pact ● ⚙ goad (half), mirror (half), two in the dark (half) ◆ draw",
  });
}
{
  const name = "War horn", effect = "When each fight starts, the ally with the slowest basic attack gains many Might.";
  offhand("horn", "rare", name, {
    effect, stats: [st("aggro", 1), st("attack", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("might", TO.slowestAlly, FLAT_STACKS.many))] })],
    serves: "Landslide 2 ●●● ⚙ judge's drum (half), opening again (half) ◆ heavy-blow",
  });
}
{
  const name = "Hunting horn", effect = "When a Marked foe falls, every ally's next basic attack comes at once.";
  offhand("horn", "rare", name, {
    effect, stats: [st("aggro", 1), st("attack", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_ended", { status: "marked", cause: ["ko"], whose: "foe" }), swingNow(TO.everyAlly))] })],
    serves: "Hunt 2 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key) ◆ kill-pays",
  });
}
{
  // The holder's full cooldowns are the opening's drawback: never made to happen again.
  const name = "Horn of the charge";
  const effect = "When each fight starts, every ally is Hasted and its first action comes at once. Its holder starts every fight with every ability on cooldown.";
  offhand("horn", "legendary", name, {
    effect, stats: [st("aggro", 2), st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("haste", TO.everyAlly), swingNow(TO.everyAlly)), atFirstStart({ op: "cooldown", which: "abilities", set: "full", to: "holder" })] })],
    serves: "Hunt 3 ●●●, Cuts ●●, first move ⚙ opening again (half)",
  });
}

// ─── Totem ──

offhand("totem", "common", "Blackthorn stake", { stats: [sp("thorns", "medium")], serves: "the Toll: Thorns is its first stat." });
offhand("totem", "common", "Hawthorn fetish", { stats: [st("attack", 1)], serves: "the Storm: Attack sets its Shock." });

{
  const name = "Spinebark pole", thorns = `${id(name)}_thorns`, effect = "When each fight starts, the ally with the highest Aggro gains Thorns, medium, for the fight.";
  offhand("totem", "uncommon", name, {
    effect, stats: [sp("thorns", "medium"), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give(thorns, TO.topAggroAlly))] }), given(thorns, "SPINEBARK", "Thorns up for the fight.", { survivesKO: true, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }] })],
    serves: "Toll 1 ●●, Landslide ● ⚙ goad (half), opening again (half)",
  });
}
{
  const name = "Stormglass totem", effect = "When each fight starts, every foe gains a few Shock (from its holder's Attack).";
  offhand("totem", "uncommon", name, {
    effect, stats: [sp("thorns", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("shock", TO.everyFoe, own("few", "attack", SHOCK_STACKS)))] })],
    serves: "Storm 1 ●● ⚙ opening again (half), every colour (half)",
  });
}
{
  const name = "Bear fetish", effect = "Whenever an ally drops below 50% of its max HP, that ally is Guarded.";
  offhand("totem", "uncommon", name, {
    effect, stats: [sp("thorns", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hp_low", { whose: "team", line: 50 }), give("guard", "owner"))] })],
    serves: "Toll ●, Pact ●, net ⚙ brink (half), mirror (half) ◆ lowest-ally",
  });
}
{
  const name = "Nettle totem", effect = "Foes that hit its holder gain a few Bleed (from its holder's Defense).";
  offhand("totem", "rare", name, {
    effect, stats: [sp("thorns", "medium"), st("defense", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("bleed", "other", own("few", "defense")))] })],
    serves: "Toll 2 ●●●, Cuts 2 ●●● ⚙ red rain (half)",
  });
}
{
  const name = "Spite totem", effect = "Its holder gathers Spite (a Spite for each hit it takes, kept for the fight, up to 20). Each Spite adds 15 to its Thorns.";
  offhand("totem", "rare", name, {
    effect, stats: [sp("thorns", "medium"), st("aggro", 2)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("spite", "holder", 1))], stats: [{ stat: "thorns", flat: stacksOf("spite", COUNTER.spite.thorns), live: true }] })],
    serves: "Toll 2 ●●●",
  });
}
{
  const name = "Thunderhead totem", effect = "Each hit its holder takes adds a Shock to every foe.";
  offhand("totem", "rare", name, {
    effect, stats: [sp("thorns", "medium"), st("aggro", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("shock", TO.everyFoe, FLAT_STACKS.one))] })],
    serves: "Storm 2 ●●●, Toll 2 ●● ⚙ goad (half), held charge (half)",
  });
}
{
  const name = "Goading totem", effect = "Each time its holder Taunts, every foe's next basic attack comes at once.";
  offhand("totem", "rare", name, {
    effect, stats: [sp("thorns", "medium"), st("defense", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_gained", { status: "taunt" }), swingNow(TO.everyFoe))] })],
    serves: "Storm 2 ●●●, Toll 2 ●●● ⚙ goad (key)",
  });
}
{
  // An aura on every ally while the holder stands: the Shields each gives are a third larger. A broken Shield gives its holder Might.
  const name = "Earthmother totem", aura = `${id(name)}_aura`;
  const effect = "While its holder stands, every Shield an ally gains is 33% larger. When an ally's Shield breaks, that ally gains many Might.";
  const lay = give(aura, TO.everyAlly);
  offhand("totem", "legendary", name, {
    effect, stats: [sp("thorns", "high"), st("max_hp", 1), st("defense", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          atStart(lay), react(on("revived"), lay), react(on("revived", { whose: "ally" }), lay),
          react(on("status_ended", { status: "shield", cause: ["stacks"], whose: "team" }), give("might", "owner", FLAT_STACKS.many)),
        ],
      }),
      given(aura, "EARTHMOTHER", "The Shields it gives are 33% larger while the Earthmother totem's holder stands.", { perSource: { endsWithSource: true }, boosts: [{ tag: "shield", pct: 33 }] }),
    ],
    serves: "Landslide 3 ●●●, Pact ● ⚙ detonation (half)",
  });
}

// ─── Relic ──

offhand("relic", "common", "Shrine token", { stats: [st("mp_regen", 1)], serves: "Blood Pact, the Toll's keepers and Barrage's font: MP regen is every healer's first stat." });
offhand("relic", "common", "Litany beads", { stats: [sp("cast_speed", "medium")], serves: "Barrage: the font's casts land sooner." });

{
  const name = "Holy water", effect = "Each time one of its holder's abilities heals an ally, it also lifts one debuff from that ally.";
  offhand("relic", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(healGiven({ kind: "ability" }), { op: "remove", label: "debuff", count: 1, to: "owner" })] })],
    serves: "Toll ●, Pact ●, foes do less",
  });
}
{
  const name = "Charnel icon", effect = "Each time a foe falls, the ally with the lowest share of max HP is healed for 30% of its holder's Attack.";
  offhand("relic", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.fall, { op: "heal", amount: share(HIT.light, "attack"), to: TO.lowestAlly })] })],
    serves: "Pact 1 ●●, Hunt ● ⚙ brink (half) ◆ kill-pays, lowest-ally",
  });
}
{
  const name = "Font relic", effect = "Each time one of its holder's abilities heals an ally, it also gives that ally MP: 20% of that ally's max MP.";
  offhand("relic", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [react(healGiven({ kind: "ability", notTags: ["pulse"] }), { op: "mp", amount: share(0.2, "max_mp", "target"), to: "owner" })] })],
    serves: "Barrage 1 ●●, Pact ● ⚙ mana as armour (half) ◆ free-cast",
  });
}
{
  // Second in the order of healing past full: the healer's piece, where the healed unit's own doesn't take it.
  const name = "Phylactery", effect = "The part of its holder's heals, and of its Regen's pulses, that would go past full becomes a Shield on the healed ally.";
  offhand("relic", "rare", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(on("overhealed", { whose: "team", other: "holder" }), { unit: "owner", where: { lacks: OVERHEAL.own } }, give("shield", "owner", ofAmount(1)))] })],
    also: [OVERHEAL.given],
    serves: "Pact 2 ●●●, Landslide ●●, Toll ●● ⚙ red stone (key), detonation (half) ◆ shield-by-doing",
  });
}
{
  const name = "Accuser's relic", effect = "While no foe is Marked, each heal its holder gives Marks the foe that last hit the healed ally.";
  offhand("relic", "rare", name, {
    effect, stats: [st("mp_regen", 1), st("attack", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(healGiven({ notTags: ["pulse"] }), NO_MARK, give("marked", "assailant"))] })],
    serves: "Hunt 2 ●●●, Toll ●●",
  });
}
{
  const name = "Heart of the saint";
  const effect = "Its holder's abilities that heal cost HP in place of MP: 50% of the share of its max HP that they'd cost of its max MP. Their heals are twice as big. The price never takes it below 1 HP.";
  offhand("relic", "legendary", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 2), st("attack", 1)],
    statuses: [own_(name, effect, { mods: [{ of: { does: ["heal"] }, hp: { pct: 50, share: true, instead: true }, heal: 100 }] })],
    serves: "Pact 3 ●●● ⚙ brink (key)",
  });
}
{
  const name = "Bloodstone reliquary", effect = "Each time an ally pays HP, the ally with the lowest share of max HP, the payer aside, is healed for as much.";
  offhand("relic", "legendary", name, {
    effect, stats: [st("mp_regen", 2), st("max_hp", 2)],
    statuses: [own_(name, effect, { reactions: [react(on("hp_paid", { whose: "team" }), { op: "heal", amount: ofAmount(1), to: { side: "allies", pick: "lowest", by: "hp_share", exclude: "owner" } })] })],
    serves: "Pact 3 ●●● ⚙ brink (half), blood mage (half)",
  });
}

// ─── Lantern ──

offhand("lantern", "common", "Bullseye lantern", { stats: [sp("cast_speed", "medium")], serves: "Bonfire: the feeders' casts land sooner." });
offhand("lantern", "common", "Hooded lantern", { stats: [st("max_mp", 1)], serves: "Barrage: MP is its first stat." });

{
  const name = "Pitch lantern", effect = "When each fight starts, every foe gains several Burn (from its holder's Attack).";
  offhand("lantern", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("burn", TO.everyFoe, own("several", "attack")))] })],
    serves: "Bonfire 1 ●● ⚙ opening again (half), every colour (half), reaping (half)",
  });
}
{
  const name = "Dazzling lantern", effect = "When each fight starts, the two foes with the highest Attack are Weakened.";
  offhand("lantern", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("weaken", { side: "foes", pick: "highest", by: { stats: ["attack"] }, count: 2 }))] })],
    serves: "foes do less, Toll ● ⚙ opening again (half), goad (half)",
  });
}
{
  // A fallen foe's fire moves once: every piece and seat that moves it shares it.
  const name = "Wick";
  const effect = "When a burning foe falls, all its Burn passes to the foe with the most Burn. A fallen foe's fire moves once: if something else in the party moves it too, it's split evenly between them.";
  offhand("lantern", "rare", name, {
    effect, stats: [sp("cast_speed", "medium"), st("attack", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [{ on: on("status_ended", { status: "burn", cause: ["ko"], whose: "foe" }), split: "fire", do: [give("burn", TO.mostFoe("burn"), ofAmount())] }] })],
    serves: "Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)",
  });
}
{
  const name = "Shuttered lantern", effect = "While its holder is winding up an ability, it takes 50% less damage.";
  offhand("lantern", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), st("max_mp", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { taken: [{ pct: { scale: [{ ratio: -50, when: { casting: true }, of: "holder" }] } }] })],
    serves: "Barrage 2 ●●, Bonfire ●●, Pact ●",
  });
}
{
  const name = "Everflame lantern", effect = "Every 3 ticks, the foe with the most Burn gains Burn: 10% of what it holds.";
  offhand("lantern", "legendary", name, {
    effect, stats: [sp("cast_speed", "high"), st("attack", 2)],
    statuses: [own_(name, effect, { pulse: { every: 3, if: { side: "foes", where: { has: "burn" } }, do: [give("burn", TO.mostFoe("burn"), stacksOf("burn", 0.1, "target"))] } })],
    serves: "Bonfire 3 ●●●",
  });
}
{
  const name = "Lamp of vigil", effect = "After each won fight, one fallen ally stands up with 25% of its max HP, if its holder is standing.";
  offhand("lantern", "legendary", name, {
    effect, stats: [sp("cast_speed", "high"), st("max_hp", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(on("fight_won"), { side: "self", where: { ko: false } }, { op: "revive", hp: share(0.25, "max_hp", "target"), to: { side: "allies", where: { ko: true }, pick: "random" } })] })],
    serves: "net",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
