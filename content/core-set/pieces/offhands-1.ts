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
/** A share as a card prints it: 0.17 is 17. */
const pct = (r: number) => Math.round(r * 100);
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
  const name = "Emberguard", effect = "Attackers gain a few Burn (from Defense).";
  offhand("kite_shield", "uncommon", name, {
    effect, stats: [st("defense", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("burn", "other", own("few", "defense")))] })],
    serves: "Bonfire 1 ●●, Toll ● ⚙ goad (half)",
  });
}
{
  const name = "Sheltering kite", effect = "At fight start: Guards itself and the other lowest-Defense ally.";
  offhand("kite_shield", "uncommon", name, {
    effect, stats: [st("defense", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("guard"), give("guard", { side: "others", pick: "lowest", by: { stat: "defense" } }))] })],
    serves: "Landslide ●, net ⚙ opening again (half), mirror (half)",
  });
}
{
  const name = "Bossed kite", effect = `Ability hits deal extra damage: ${pct(HIT.touch)}% of Defense.`;
  offhand("kite_shield", "uncommon", name, {
    effect, stats: [st("defense", 2)],
    statuses: [own_(name, effect, { adds: [{ on: "ability", amount: share(HIT.touch, "defense") }] })],
    serves: "Landslide 1 ●● ◆ heavy-blow",
  });
}
{
  // A Shield emptied by a foe's damage ends (cause stacks) naming that foe as its other.
  const name = "Rubble shield", effect = "When its Shield breaks: Stuns the breaker.";
  offhand("kite_shield", "rare", name, {
    effect, stats: [st("defense", 1), st("max_hp", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_ended", { status: "shield", cause: ["stacks"], other: "foe" }), give("stun", "other"))] })],
    serves: "Landslide 2 ●●, Toll ●●, Storm ● ⚙ held charge (half), detonation (half) ◆ held",
  });
}
{
  const name = "Mirror shield", effect = "When hit: sends back 50% of the blow, before anything blocked it.";
  offhand("kite_shield", "rare", name, {
    effect, stats: [st("defense", 1), st("aggro", 1), sp("thorns", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, { op: "damage", type: "none", amount: { scale: [{ ratio: 0.5, event: "raw" }] }, to: "other" })] })],
    serves: "Toll 2 ●●●, Landslide 2 ●● ⚙ mirror (key)",
  });
}
{
  const name = "Monolith shield";
  const effect = "Damaging abilities come round half as often and hit twice as hard.";
  offhand("kite_shield", "rare", name, {
    effect, stats: [st("defense", 2), st("max_hp", 1)],
    statuses: [own_(name, effect, { mods: [{ of: { does: ["damage"] }, cooldown: 100, damage: 100 }] })],
    serves: "Landslide 2 ●●●, Hunt ● ⚙ shatter bell (half) ◆ heavy-blow",
  });
}
{
  const name = "Oathbound shield", effect = "Any hit over 25% of an ally's max HP hits it instead.";
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
  const name = "Comrade's targe", effect = "Every so often: Shield on the lowest ally (20% of max HP).";
  const b = beatHalfway(id(name), name, [give("shield", TO.lowestAlly, share(0.2, "max_hp"))]);
  offhand("round_shield", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: b.reactions }), ...b.statuses],
    serves: "Pact 1 ●●, Toll ●, Landslide ● ⚙ brink (half), detonation (half) ◆ lowest-ally",
  });
}
{
  const name = "Hunter's buckler", effect = "On a kill: gains Haste.";
  offhand("round_shield", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, give("haste"))] })],
    serves: "Hunt 1 ●●, Cuts ● ◆ kill-pays",
  });
}
{
  const name = "Spiked targe", on_ = `${id(name)}_on`, effect = "While Guarded: Thorns up (high).";
  offhand("round_shield", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: whileHolding(on_, "guard") }), state(on_, "SPIKED", "Thorns up (high).", { unremovable: true, stats: [{ stat: "thorns", flat: SPECIAL.thorns.high }] })],
    serves: "Toll 1 ●● ⚙ goad (half)",
  });
}
{
  // The wait runs from the last rebuild; a Shield broken inside it stays broken.
  const name = "Second skin", wait = `${id(name)}_wait`;
  const effect = "When its Shield breaks: a new one at 50% of its peak, at most every so often.";
  offhand("round_shield", "rare", name, {
    effect, stats: [st("max_hp", 2), st("attack", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("status_ended", { status: "shield", cause: ["stacks"] }), { side: "self", where: { lacks: wait } }, give("shield", "holder", ofAmount(0.5)), give(wait))] }),
      marker(wait, "Second skin (waiting)", "Rebuild waiting.", { stacking: "fizzle", duration: SO_OFTEN }),
    ],
    serves: "Landslide ●●, Cuts ●●, Toll ● ⚙ detonation (key), riposte (half)",
  });
}
{
  const name = "Hoplon", effect = "When hit: sends back what its Shield soaked and its Aegis blocked.";
  offhand("round_shield", "rare", name, {
    effect, stats: [st("max_hp", 2), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, { op: "damage", type: "none", amount: { scale: [{ ratio: 1, event: "stopped" }] }, to: "other" })] })],
    serves: "Toll 2 ●●●, Landslide 2 ●●● ⚙ mirror (key)",
  });
}
{
  // A `lower` test: the aura goes to allies with less Defense than the holder as the fight starts and on a revive; it ends with the holder.
  const name = "Tower shield", aura = `${id(name)}_aura`;
  const effect = "While it stands, allies with less Defense take 20% less damage. It deals 20% less.";
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
  const effect = "Once a fight: raises a falling ally at 10% HP behind a Shield (33% of max HP).";
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
  const effect = "Every Shield another ally would gain goes to it instead.";
  offhand("round_shield", "legendary", name, {
    effect, stats: [st("max_hp", 2), st("aggro", 1), st("defense", 1)],
    statuses: [
      own_(name, effect, { reactions: [atStart(give(pull, TO.otherAllies)), react(on("revived", { whose: "ally" }), give(pull, "owner"))] }),
      given(pull, "LODESTONE", "Its Shields go to the Lodestone shield's holder.", { perSource: { endsWithSource: true }, divert: { what: "shield", to: "source" } }),
    ],
    serves: "exotic, Landslide ●● ⚙ detonation (half)",
  });
}

// ─── Horn ──

offhand("horn", "common", "Ram's horn", { stats: [st("aggro", 1)], serves: "the Toll: the draw is its first stat." });
offhand("horn", "common", "Ivory horn", { stats: [st("mp_regen", 1)], serves: "Barrage: the well's mana." });

{
  const name = "Reveille";
  const effect = "At fight start: readies the slowest ability of the ally with the most Attack.";
  offhand("horn", "uncommon", name, {
    effect, stats: [st("aggro", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "cooldown", which: "slowest", set: "ready", to: { side: "allies", pick: "highest", by: { stats: ["attack"] } } })] })],
    serves: "Landslide 1 ●●, Barrage 1 ●●, Hunt ●, first move ⚙ opening again (half)",
  });
}
{
  const name = "Bull's horn", rung = `${id(name)}_used`, effect = "First foe to fall: Haste on every ally.";
  offhand("horn", "uncommon", name, {
    effect, stats: [st("aggro", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.fall, { side: "self", where: { lacks: rung } }, give("haste", TO.everyAlly), give(rung))] }), used(rung, "BULL'S HORN")],
    serves: "Hunt 1 ●●, Cuts ● ◆ kill-pays",
  });
}
{
  const name = "Watch horn", effect = "Taunts when an ally drops below half HP.";
  offhand("horn", "uncommon", name, {
    effect, stats: [st("aggro", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hp_low", { whose: "team", line: 50 }), give("taunt"))] })],
    serves: "Toll 1 ●●, Pact ● ⚙ goad (half), mirror (half), two in the dark (half) ◆ draw",
  });
}
{
  const name = "War horn", effect = "At fight start: many Might on the slowest-swinging ally.";
  offhand("horn", "rare", name, {
    effect, stats: [st("aggro", 1), st("attack", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("might", TO.slowestAlly, FLAT_STACKS.many))] })],
    serves: "Landslide 2 ●●● ⚙ judge's drum (half), opening again (half) ◆ heavy-blow",
  });
}
{
  const name = "Hunting horn", effect = "When a Marked foe falls: every ally attacks at once.";
  offhand("horn", "rare", name, {
    effect, stats: [st("aggro", 1), st("attack", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_ended", { status: "marked", cause: ["ko"], whose: "foe" }), swingNow(TO.everyAlly))] })],
    serves: "Hunt 2 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key) ◆ kill-pays",
  });
}
{
  // The holder's full cooldowns are the opening's drawback: never made to happen again.
  const name = "Horn of the charge";
  const effect = "At fight start: every ally gains Haste and attacks at once. Its own abilities start on cooldown.";
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
  const name = "Spinebark pole", thorns = `${id(name)}_thorns`, effect = "At fight start: the ally with the most Aggro gains Thorns.";
  offhand("totem", "uncommon", name, {
    effect, stats: [sp("thorns", "medium"), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give(thorns, TO.topAggroAlly))] }), given(thorns, "SPINEBARK", "Thorns up for the fight.", { survivesKO: true, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }] })],
    serves: "Toll 1 ●●, Landslide ● ⚙ goad (half), opening again (half)",
  });
}
{
  const name = "Stormglass totem", effect = "At fight start: a few Shock on every foe (from Attack).";
  offhand("totem", "uncommon", name, {
    effect, stats: [sp("thorns", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("shock", TO.everyFoe, own("few", "attack", SHOCK_STACKS)))] })],
    serves: "Storm 1 ●● ⚙ opening again (half), every colour (half)",
  });
}
{
  const name = "Bear fetish", effect = "Guards any ally that drops below half HP.";
  offhand("totem", "uncommon", name, {
    effect, stats: [sp("thorns", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hp_low", { whose: "team", line: 50 }), give("guard", "owner"))] })],
    serves: "Toll ●, Pact ●, net ⚙ brink (half), mirror (half) ◆ lowest-ally",
  });
}
{
  const name = "Nettle totem", effect = "Attackers gain a few Bleed (from Defense).";
  offhand("totem", "rare", name, {
    effect, stats: [sp("thorns", "medium"), st("defense", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("bleed", "other", own("few", "defense")))] })],
    serves: "Toll 2 ●●●, Cuts 2 ●●● ⚙ red rain (half)",
  });
}
{
  const name = "Spite totem", effect = `Each hit taken adds a Spite (up to ${COUNTER.spite.cap}). +${COUNTER.spite.thorns} Thorns per Spite.`;
  offhand("totem", "rare", name, {
    effect, stats: [sp("thorns", "medium"), st("aggro", 2)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("spite", "holder", 1))], stats: [{ stat: "thorns", flat: stacksOf("spite", COUNTER.spite.thorns), live: true }] })],
    serves: "Toll 2 ●●●",
  });
}
{
  const name = "Thunderhead totem", effect = "When hit: a Shock on every foe.";
  offhand("totem", "rare", name, {
    effect, stats: [sp("thorns", "medium"), st("aggro", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("shock", TO.everyFoe, FLAT_STACKS.one))] })],
    serves: "Storm 2 ●●●, Toll 2 ●● ⚙ goad (half), held charge (half)",
  });
}
{
  const name = "Goading totem", effect = "When it Taunts: every foe attacks at once.";
  offhand("totem", "rare", name, {
    effect, stats: [sp("thorns", "medium"), st("defense", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_gained", { status: "taunt" }), swingNow(TO.everyFoe))] })],
    serves: "Storm 2 ●●●, Toll 2 ●●● ⚙ goad (key)",
  });
}
{
  // An aura on every ally while the holder stands: the Shields each gives are a third larger. A broken Shield gives its holder Might.
  const name = "Earthmother totem", aura = `${id(name)}_aura`;
  const effect = "While it stands, allies' Shields are 33% bigger. A broken Shield gives its ally many Might.";
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
      given(aura, "EARTHMOTHER", "Shields it gives are 33% larger while the Earthmother totem's holder stands.", { perSource: { endsWithSource: true }, boosts: [{ tag: "shield", pct: 33 }] }),
    ],
    serves: "Landslide 3 ●●●, Pact ● ⚙ detonation (half)",
  });
}

// ─── Relic ──

offhand("relic", "common", "Shrine token", { stats: [st("mp_regen", 1)], serves: "Blood Pact, the Toll's keepers and Barrage's font: MP regen is every healer's first stat." });
offhand("relic", "common", "Litany beads", { stats: [sp("cast_speed", "medium")], serves: "Barrage: the font's casts land sooner." });

{
  const name = "Holy water", effect = "Ability heals also lift a debuff.";
  offhand("relic", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(healGiven({ kind: "ability" }), { op: "remove", label: "debuff", count: 1, to: "owner" })] })],
    serves: "Toll ●, Pact ●, foes do less",
  });
}
{
  const name = "Charnel icon", effect = `When a foe falls: heals the lowest ally (${pct(HIT.light)}% of Attack).`;
  offhand("relic", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.fall, { op: "heal", amount: share(HIT.light, "attack"), to: TO.lowestAlly })] })],
    serves: "Pact 1 ●●, Hunt ● ⚙ brink (half) ◆ kill-pays, lowest-ally",
  });
}
{
  const name = "Font relic", effect = "Ability heals also restore 20% of the target's max MP.";
  offhand("relic", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [react(healGiven({ kind: "ability", notTags: ["pulse"] }), { op: "mp", amount: share(0.2, "max_mp", "target"), to: "owner" })] })],
    serves: "Barrage 1 ●●, Pact ● ⚙ mana as armour (half) ◆ free-cast",
  });
}
{
  // Second in the order of healing past full: the healer's piece, where the healed unit's own doesn't take it.
  const name = "Phylactery", effect = "Its healing past full, Regen included, becomes a Shield.";
  offhand("relic", "rare", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(on("overhealed", { whose: "team", other: "holder" }), { unit: "owner", where: { lacks: OVERHEAL.own } }, give("shield", "owner", ofAmount(1)))] })],
    also: [OVERHEAL.given],
    serves: "Pact 2 ●●●, Landslide ●●, Toll ●● ⚙ red stone (key), detonation (half) ◆ shield-by-doing",
  });
}
{
  const name = "Accuser's relic", effect = "Its heals Mark the healed ally's last attacker.";
  offhand("relic", "rare", name, {
    effect, stats: [st("mp_regen", 1), st("attack", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(healGiven({ notTags: ["pulse"] }), NO_MARK, give("marked", "assailant"))] })],
    serves: "Hunt 2 ●●●, Toll ●●",
  });
}
{
  const name = "Heart of the saint";
  const effect = "Healing abilities cost HP instead of MP, and heal twice as much.";
  offhand("relic", "legendary", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 2), st("attack", 1)],
    statuses: [own_(name, effect, { mods: [{ of: { does: ["heal"] }, hp: { pct: 50, share: true, instead: true }, heal: 100 }] })],
    serves: "Pact 3 ●●● ⚙ brink (key)",
  });
}
{
  const name = "Bloodstone reliquary", effect = "When an ally pays HP, the lowest other ally heals as much.";
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
  const name = "Pitch lantern", effect = "At fight start: several Burn on every foe (from Attack).";
  offhand("lantern", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("burn", TO.everyFoe, own("several", "attack")))] })],
    serves: "Bonfire 1 ●● ⚙ opening again (half), every colour (half), reaping (half)",
  });
}
{
  const name = "Dazzling lantern", effect = "At fight start: Weakens the two foes with the most Attack.";
  offhand("lantern", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("weaken", { side: "foes", pick: "highest", by: { stats: ["attack"] }, count: 2 }))] })],
    serves: "foes do less, Toll ● ⚙ opening again (half), goad (half)",
  });
}
{
  // A fallen foe's fire moves once: every piece and seat that moves it shares it.
  const name = "Wick";
  const effect = "When a burning foe falls: its Burn passes to the foe with the most Burn.";
  offhand("lantern", "rare", name, {
    effect, stats: [sp("cast_speed", "medium"), st("attack", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [{ on: on("status_ended", { status: "burn", cause: ["ko"], whose: "foe" }), split: "fire", do: [give("burn", TO.mostFoe("burn"), ofAmount())] }] })],
    serves: "Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)",
  });
}
{
  const name = "Shuttered lantern", effect = "Takes half damage while winding up.";
  offhand("lantern", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), st("max_mp", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { taken: [{ pct: { scale: [{ ratio: -50, when: { casting: true }, of: "holder" }] } }] })],
    serves: "Barrage 2 ●●, Bonfire ●●, Pact ●",
  });
}
{
  const name = "Everflame lantern", effect = "Every 3 ticks: +10% Burn on the foe with the most.";
  offhand("lantern", "legendary", name, {
    effect, stats: [sp("cast_speed", "high"), st("attack", 2)],
    statuses: [own_(name, effect, { pulse: { every: 3, if: { side: "foes", where: { has: "burn" } }, do: [give("burn", TO.mostFoe("burn"), stacksOf("burn", 0.1, "target"))] } })],
    serves: "Bonfire 3 ●●●",
  });
}
{
  const name = "Lamp of vigil", effect = "After a won fight, if standing: raises a fallen ally at 25% HP.";
  offhand("lantern", "legendary", name, {
    effect, stats: [sp("cast_speed", "high"), st("max_hp", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(on("fight_won"), { side: "self", where: { ko: false } }, { op: "revive", hp: share(0.25, "max_hp", "target"), to: { side: "allies", where: { ko: true }, pick: "random" } })] })],
    serves: "net",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
