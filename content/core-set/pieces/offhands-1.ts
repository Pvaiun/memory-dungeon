/**
 * Six offhand kinds' pieces: kite shield, round shield, horn, totem, relic and lantern (55 pieces). Each carries the standard
 * budget of steps at its rarity, exactly (kit.ts piece), a step down on one stat buying one more elsewhere. Statuses are at
 * their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { StatusT } from "../../../src/schema.js";
import { FLAT_STACKS, HIT, P, PIECE_SPECIAL, SPECIAL, SPECIAL_KEY, STEP, crit, type SpecialStat } from "../scale.js";
import { OVERHEAL } from "./shared.js";
import { EV, NO_MARK, SO_OFTEN, TO, against, atFirstStart, beatHalfway, atStart, critStep, give, lift, marker, ofAmount, on, onceBelow, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, swingNow, used, whileIt, type Change, type Rarity } from "./kit.js";

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
/** A special stat a step down: its medium word given up, for a step more elsewhere. */
const down = (s: SpecialStat): Change => ({ stat: SPECIAL_KEY[s], flat: -(PIECE_SPECIAL[s] ?? SPECIAL[s]).medium });
/** Crit chance a step down. */
const critDown: Change = { stat: "crit_chance", flat: -crit(1) };
/** The two shield kinds, for the pieces that count shields in the party. */
const SHIELDS = ["kite_shield", "round_shield"];

// ─── Kite shield ──

offhand("kite_shield", "common", "Bladed kite", { stats: [st("attack", 2), down("cooldown")], serves: "Landslide: Attack, at the cost of slower abilities." });
offhand("kite_shield", "common", "Chaplain's kite", { stats: [sp("cooldown", "medium"), st("mp_regen", 1), critDown], serves: "Barrage: abilities round sooner and mana, for fewer crits." });

{
  // Status damage carries its status's id as a tag: the afflictions, a shatter, Doom's blow and Thorns (a debt come due lands past damage-taken changes).
  const name = "Salted kite", effect = "Takes −50% damage from statuses.";
  const from = ["burn", "chill", "shock", "bleed", "doom", "thorns"];
  offhand("kite_shield", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { taken: from.map((tag) => ({ tag, pct: -50 })) })],
    serves: "general",
  });
}
{
  const name = "Sheltering kite", effect = "At fight start: Guards itself and the other ally with the least Defense.";
  offhand("kite_shield", "uncommon", name, {
    effect, stats: [st("defense", 1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [atStart(give("guard"), give("guard", { side: "others", pick: "lowest", by: { stat: "defense" } }))] })],
    serves: "Landslide 1 ●●, net ◆ stone",
  });
}
{
  const name = "Bossed kite", effect = `Ability hits deal extra damage: ${pct(HIT.touch)}% of Defense.`;
  offhand("kite_shield", "uncommon", name, {
    effect, stats: [st("attack", 1), critStep(1)],
    statuses: [own_(name, effect, { adds: [{ on: "ability", amount: share(HIT.touch, "defense") }] })],
    serves: "Landslide 1 ●● ◆ Defense as damage",
  });
}
{
  // Gear doesn't change in a fight, so the shields are counted as it starts and on a revive; the Defense ends with the holder.
  const name = "Pavise of the line", aura = `${id(name)}_aura`;
  const effect = "While every ally holds a shield (kite or round): every ally has +1 Defense.";
  const everyShield = { side: "allies" as const, where: { offhandNot: SHIELDS }, atMost: 0 };
  const lay = give(aura, TO.everyAlly);
  offhand("kite_shield", "rare", name, {
    effect, stats: [st("max_hp", 1), sp("accuracy", "medium"), sp("cooldown", "medium")],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("fight_start"), everyShield, lay), reactIf(on("revived"), everyShield, lay), reactIf(on("revived", { whose: "ally" }), everyShield, lay)] }),
      given(aura, "PAVISE", "+1 Defense while the Pavise of the line's holder stands.", { perSource: { endsWithSource: true }, stats: [{ stat: "defense", flat: STEP }] }),
    ],
    serves: "conditional, Landslide 2 ●●, Toll ●● ⚙ shield party (key) ◆ stone, keeper",
  });
}
{
  const name = "Mirror shield", effect = "When hit: sends back 50% of the blow, before anything blocked it.";
  offhand("kite_shield", "rare", name, {
    effect, stats: [st("defense", 1), sp("evasion", "medium"), sp("siphon", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, { op: "damage", type: "none", amount: { scale: [{ ratio: 0.5, event: "raw" }] }, to: "other" })] })],
    serves: "conditional, Toll 2 ●●●, Landslide 2 ●● ⚙ mirror (key) ◆ retaliation",
  });
}
{
  // Conditional through its stats: Thorns pays only on a unit that's struck, Crit damage only on one that crits.
  const name = "Monolith shield";
  const effect = "Damaging abilities come round 50% as often and deal ×2.";
  offhand("kite_shield", "rare", name, {
    effect, stats: [sp("thorns", "medium"), sp("crit_damage", "medium"), st("max_mp", 1)],
    statuses: [own_(name, effect, { mods: [{ of: { does: ["damage"] }, cooldown: 100, damage: 100 }] })],
    serves: "conditional, Landslide 2 ●●●, Hunt ● ◆ heavy action",
  });
}
{
  const name = "Oathbound shield", effect = "Any hit over 25% of an ally's max HP hits it instead.";
  offhand("kite_shield", "legendary", name, {
    effect, stats: [st("aggro", 1), sp("cooldown", "high")],
    statuses: [own_(name, effect, { cover: { share: 25 } })],
    serves: "conditional, Toll 3 ●●●, Pact ●●, Barrage ●● ◆ draw, nets",
  });
}

// ─── Round shield ──

offhand("round_shield", "common", "Weighted shield", { stats: [st("attack", 2), down("attack_speed")], serves: "Landslide: Attack, in a slower swing." });
offhand("round_shield", "common", "Burnished buckler", { stats: [sp("cast_speed", "medium"), sp("crit_damage", "medium"), down("cooldown")], serves: "Barrage and the Hunt: casts land sooner and crits land harder; abilities come slower." });

{
  const name = "Comrade's targe", effect = `Every ${SO_OFTEN} ticks (the first at ${SO_OFTEN / 2}): Shield on the ally with the lowest HP% (20% of max HP).`;
  const b = beatHalfway(id(name), name, [give("shield", TO.lowestAlly, share(0.2, "max_hp"))]);
  offhand("round_shield", "uncommon", name, {
    effect, stats: [st("max_hp", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: b.reactions }), ...b.statuses],
    serves: "Pact 1 ●●, Toll ●, Landslide ●, net ⚙ brink (half), detonation (half) ◆ nets",
  });
}
{
  const name = "Steadfast buckler", effect = "Hits on it can't crit.";
  offhand("round_shield", "uncommon", name, {
    effect, stats: [st("defense", 1), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { critsTaken: "never" })],
    serves: "general",
  });
}
{
  const name = "Spiked targe", effect = "While Guarded: basic attacks deal +30%.";
  offhand("round_shield", "uncommon", name, {
    effect, stats: [st("attack", 1), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: whileIt(30, { has: "guard" }) }] })],
    serves: "Landslide 1 ●● ◆ stone into the blow",
  });
}
{
  // The wait runs from the last rebuild; a Shield broken inside it stays broken.
  const name = "Second skin", wait = `${id(name)}_wait`;
  const effect = `When its Shield breaks: a new one at 50% of its peak, at most once every ${SO_OFTEN} ticks.`;
  offhand("round_shield", "rare", name, {
    effect, stats: [st("defense", 1), sp("lifesteal", "medium"), sp("cast_speed", "medium")],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("status_ended", { status: "shield", cause: ["stacks"] }), { side: "self", where: { lacks: wait } }, give("shield", "holder", ofAmount(0.5)), give(wait))] }),
      marker(wait, "Second skin (waiting)", "Rebuild waiting.", { stacking: "fizzle", duration: SO_OFTEN }),
    ],
    serves: "conditional, Landslide 2 ●●, Cuts ●●, Toll ● ⚙ detonation (key), riposte (half) ◆ stone",
  });
}
{
  const name = "Hoplon", effect = "While it holds Aegis: basic attacks deal ×2.";
  offhand("round_shield", "rare", name, {
    effect, stats: [st("max_hp", 1), sp("double_strike", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: whileIt(100, { has: "aegis" }) }] })],
    serves: "conditional, Landslide 2 ●●●, Toll 2 ●● ⚙ mirror (half) ◆ heavy action",
  });
}
{
  // A `lower` test: the aura goes to allies with less Defense than the holder as the fight starts and on a revive; it ends with the holder.
  const name = "Tower shield", aura = `${id(name)}_aura`;
  const effect = "While it stands, allies with less Defense take 20% less damage. It deals 20% less.";
  const lay = give(aura, { side: "others", where: { lower: { stat: "defense" } }, pick: "all" });
  offhand("round_shield", "rare", name, {
    effect, stats: [st("max_hp", 2), st("mp_regen", 1), sp("siphon", "medium"), down("attack_speed")],
    statuses: [
      own_(name, effect, { boosts: [{ tag: "physical", pct: -20 }], reactions: [atStart(lay), react(on("revived"), lay), react(on("revived", { whose: "ally" }), lay)] }),
      given(aura, "TOWER", "Takes 20% less damage while the Tower shield's holder stands.", { perSource: { endsWithSource: true }, taken: [{ pct: -20 }] }),
    ],
    serves: "conditional, Toll 2 ●●, Barrage ●●, Bonfire ● ◆ keeper",
  });
}
{
  // The fallen ally by rule (a revive's rule asks for ko); the Shield follows on the revive it gave, once.
  const name = "Shield of the chosen", spent = `${id(name)}_used`, shielded = `${id(name)}_shielded`;
  const effect = "Once a fight: raises a falling ally at 10% HP behind a Shield (33% of max HP).";
  offhand("round_shield", "legendary", name, {
    effect, stats: [st("max_mp", 1), sp("evasion", "high")],
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
    serves: "exotic ◆ nets",
  });
}
{
  // A cover by tag: an Area hit that would strike another ally resolves again against the holder, once for each ally.
  const name = "Lodestone shield", effect = "Area hits on the party land on it alone, once for each ally they'd have struck.";
  offhand("round_shield", "legendary", name, {
    effect, stats: [st("defense", 1), sp("siphon", "high")],
    statuses: [own_(name, effect, { cover: { share: 0, tag: "area" } })],
    serves: "exotic ◆ draw",
  });
}

// ─── Horn ──

offhand("horn", "common", "Shrill horn", { stats: [critStep(2), st("attack", -1)], serves: "the Hunt: crits, for a little Attack." });
offhand("horn", "common", "Drinking horn", { stats: [sp("attack_speed", "medium"), sp("siphon", "medium"), critDown], serves: "Barrage and Thousand Cuts: mana drunk from quick swings, for fewer crits." });

{
  const name = "Reveille";
  const effect = "At fight start: readies the slowest ability of the ally with the most Attack.";
  offhand("horn", "uncommon", name, {
    effect, stats: [st("max_hp", 1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "cooldown", which: "slowest", set: "ready", to: { side: "allies", pick: "highest", by: { stats: ["attack"] } } })] })],
    serves: "Landslide 1 ●●, Barrage 1 ●●, Hunt ●, first move ◆ first move",
  });
}
{
  const name = "Bull's horn", effect = `Every ${SO_OFTEN} ticks: the ally with the slowest basic attack attacks at once.`;
  offhand("horn", "uncommon", name, {
    effect, stats: [st("defense", 1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { pulse: { every: SO_OFTEN, do: [swingNow(TO.slowestAlly)] } })],
    serves: "Landslide 1 ●● ◆ heavy action",
  });
}
{
  const name = "Watch horn", effect = "Taunts when an ally drops below 50% HP.";
  offhand("horn", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("hp_low", { whose: "team", line: 50 }), give("taunt"))] })],
    serves: "Toll 1 ●●, Pact ●, net ⚙ goad (half), two in the dark (half) ◆ draw",
  });
}
{
  const name = "War horn", effect = `At fight start: ${FLAT_STACKS.many} Might on the ally with the slowest basic attack.`;
  offhand("horn", "rare", name, {
    effect, stats: [st("attack", 1), sp("double_strike", "medium"), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [atStart(give("might", TO.slowestAlly, FLAT_STACKS.many))] })],
    serves: "Landslide 2 ●●● ◆ loading",
  });
}
{
  const name = "Hunting horn", effect = "When a Marked foe falls: every ally attacks at once.";
  offhand("horn", "rare", name, {
    effect, stats: [st("max_hp", 1), sp("attack_speed", "medium"), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("status_ended", { status: "marked", cause: ["ko"], whose: "foe" }), swingNow(TO.everyAlly))] })],
    serves: "Hunt 2 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key) ◆ kills",
  });
}
{
  // The hit's unit was below half as it landed (wasBelow); the attacker's picks go to the holder for Fixated's length, under a Taunt.
  const name = "Alarum", effect = "When a foe hits another ally below 50% HP: Fixates that foe.";
  offhand("horn", "rare", name, {
    effect, stats: [st("attack", 1), sp("evasion", "medium"), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hit_taken", { whose: "ally", other: "foe", wasBelow: 50 }), give("fixated", "other"))] })],
    serves: "Toll 2 ●●, Pact ● ◆ draw, nets",
  });
}
{
  // The holder's full cooldowns are the opening's drawback: never made to happen again. Conditional through its stats: Thorns pays only on a unit that's struck.
  const name = "Horn of the charge";
  const effect = "At fight start: every ally gains Haste and attacks at once. Its own abilities start on cooldown.";
  offhand("horn", "legendary", name, {
    effect, stats: [st("max_hp", 1), sp("thorns", "high")],
    statuses: [own_(name, effect, { reactions: [atStart(give("haste", TO.everyAlly), swingNow(TO.everyAlly)), atFirstStart({ op: "cooldown", which: "abilities", set: "full", to: "holder" })] })],
    serves: "conditional, Hunt 3 ●●●, Cuts ●●, first move ◆ first strike",
  });
}

// ─── Totem ──

offhand("totem", "common", "Ironwood post", { stats: [st("defense", 2), critDown], serves: "Landslide and the Toll: Defense, for fewer crits." });
offhand("totem", "common", "Twin-fang fetish", { stats: [sp("double_strike", "medium"), sp("lifesteal", "medium"), down("cooldown")], serves: "Thousand Cuts and Blood Pact: second strikes that drink, for slower abilities." });

{
  const name = "Pin-fetish", effect = "Hits on a Weakened foe deal +30%.";
  offhand("totem", "uncommon", name, {
    effect, stats: [critStep(1), st("max_mp", 1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "physical", pct: against(30, { has: "weaken" }) }] })],
    serves: "Toll 1 ●● ◆ Weaken",
  });
}
{
  const name = "Stormglass totem", effect = "Each ability it casts takes 1 tick off the wait left on every ally's basic attack.";
  offhand("totem", "uncommon", name, {
    effect, stats: [st("defense", 1), sp("siphon", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.cast, { op: "cooldown", which: "basic", set: { less: 1 }, to: TO.everyAlly })] })],
    serves: "Storm 1 ●●, Bonfire ● ◆ quick strikes, feeders",
  });
}
{
  const name = "Bear fetish", effect = "Guards any ally that drops below 50% HP.";
  offhand("totem", "uncommon", name, {
    effect, stats: [st("attack", 1), sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("hp_low", { whose: "team", line: 50 }), give("guard", "owner"))] })],
    serves: "Toll ●, Pact ●, net ⚙ brink (half) ◆ keeper",
  });
}
{
  const name = "Nettle totem", effect = "Attackers gain Bleed.";
  offhand("totem", "rare", name, {
    effect, stats: [st("max_hp", 1), critStep(1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("bleed", "other", own("few", "defense")))] })],
    serves: "conditional, Toll 2 ●●●, Cuts 2 ●● ⚙ red rain (half) ◆ carried away",
  });
}
{
  // A trade, not damage or healing: each is left at the other's share of its own max HP.
  const name = "Effigy of exchange", spent = `${id(name)}_used`;
  const effect = "Once a fight, when it drops below 33% HP: trades HP% with the foe with the most HP.";
  offhand("totem", "rare", name, {
    effect, stats: [st("max_hp", -1), st("attack", 1), sp("evasion", "medium"), sp("cooldown", "medium"), critStep(1)],
    statuses: [own_(name, effect, { reactions: [onceBelow(33, spent, { op: "trade", to: { side: "foes", pick: "highest", by: "hp" } })] }), used(spent, "EFFIGY OF EXCHANGE")],
    serves: "exotic",
  });
}
{
  // Read once, as the piece's status lands: a weapon doesn't change in a fight.
  const name = "Thunderhead totem", effect = "While it wields a hammer: basic attacks come 25% faster.";
  offhand("totem", "rare", name, {
    effect, stats: [st("defense", 1), sp("crit_damage", "medium"), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { stats: [{ stat: "attack_speed", flat: whileIt(25, { weapon: ["hammer"] }) }] })],
    serves: "conditional, Landslide 2 ●●, Storm 2 ●● ◆ quick strikes",
  });
}
{
  const name = "Goading totem", effect = "When it Taunts: every foe attacks at once.";
  offhand("totem", "rare", name, {
    effect, stats: [st("max_hp", 1), sp("double_strike", "medium"), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("status_gained", { status: "taunt" }), swingNow(TO.everyFoe))] })],
    serves: "conditional, Storm 2 ●●●, Toll 2 ●●● ⚙ goad (key) ◆ draw",
  });
}
{
  // An aura on every ally while the holder stands: the Shields each gives are a third larger. A broken Shield gives its holder Might.
  const name = "Earthmother totem", aura = `${id(name)}_aura`;
  const effect = `While it stands, allies' Shields are 33% bigger. A broken Shield gives its ally ${FLAT_STACKS.many} Might.`;
  const lay = give(aura, TO.everyAlly);
  offhand("totem", "legendary", name, {
    effect, stats: [st("max_hp", 1), st("mp_regen", 2)],
    statuses: [
      own_(name, effect, {
        reactions: [
          atStart(lay), react(on("revived"), lay), react(on("revived", { whose: "ally" }), lay),
          react(on("status_ended", { status: "shield", cause: ["stacks"], whose: "team" }), give("might", "owner", FLAT_STACKS.many)),
        ],
      }),
      given(aura, "EARTHMOTHER", "Shields it gives are 33% larger while the Earthmother totem's holder stands.", { perSource: { endsWithSource: true }, boosts: [{ tag: "shield", pct: 33 }] }),
    ],
    serves: "conditional, Landslide 3 ●●●, Pact ● ⚙ detonation (half) ◆ stone",
  });
}

// ─── Relic ──

offhand("relic", "common", "Saint's tongue", { stats: [sp("cast_speed", "medium")], serves: "Barrage: casts land sooner." });
offhand("relic", "common", "All-seeing eye", { stats: [sp("accuracy", "medium"), st("aggro", 1), critDown], serves: "the Toll and the Hunt: Accuracy and the draw, for fewer crits." });

{
  const name = "Holy water", effect = "Ability heals also lift a debuff.";
  offhand("relic", "uncommon", name, {
    effect, stats: [st("defense", 1), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [react(healGiven({ kind: "ability" }), { op: "remove", label: "debuff", count: 1, to: "owner" })] })],
    serves: "general, Toll ●, Pact ●",
  });
}
{
  // Any heal it gives but a Regen's pulse: its abilities', its pieces', and its Lifesteal on itself.
  const name = "Charnel icon", effect = "Heals it gives, Lifesteal included, also Haste the healed ally.";
  offhand("relic", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), critStep(1)],
    statuses: [own_(name, effect, { reactions: [react(healGiven({ notTags: ["pulse"] }), give("haste", "owner"))] })],
    serves: "Cuts 1 ●●, Pact ● ◆ speed, life passed",
  });
}
{
  const name = "Font relic", effect = "Ability heals also restore 20% of the target's max MP.";
  offhand("relic", "uncommon", name, {
    effect, stats: [st("max_hp", 1), sp("double_strike", "medium")],
    statuses: [own_(name, effect, { reactions: [react(healGiven({ kind: "ability", notTags: ["pulse"] }), { op: "mp", amount: share(0.2, "max_mp", "target"), to: "owner" })] })],
    serves: "Barrage 1 ●●, Pact ● ◆ MP",
  });
}
{
  // Second in the order of healing past full: the healer's piece, where the healed unit's own doesn't take it. The store counts
  // in points of HP (an amount is 1,000 a point) and is given whole, as a heal that can't go past full in its turn.
  const name = "Phylactery", store = `${id(name)}_store`;
  const effect = "Its healing past full, Regen included, is kept, and given to the next ally who drops below 50% HP.";
  offhand("relic", "rare", name, {
    effect, stats: [st("defense", 1), sp("siphon", "medium"), st("max_mp", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          reactIf(on("overhealed", { whose: "team", other: "holder" }), { unit: "owner", where: { lacks: OVERHEAL.own } }, give(store, "holder", ofAmount(1 / P))),
          reactIf(on("hp_low", { whose: "team", line: 50 }), { side: "self", where: { has: store } }, { op: "heal", amount: stacksOf(store, P), final: true, to: "owner" }, lift(store, "holder", "marker")),
        ],
      }),
      { id: store, name: "PHYLACTERY", text: "Healing kept for the next ally who drops below 50% HP.", label: "marker", show: "icon", stacking: "intensity" },
    ],
    also: [OVERHEAL.given],
    serves: "exotic ◆ nets",
  });
}
{
  const name = "Accuser's relic", effect = "Its heals Mark the healed ally's last attacker.";
  offhand("relic", "rare", name, {
    effect, stats: [st("attack", 1), sp("accuracy", "medium"), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [reactIf(healGiven({ notTags: ["pulse"] }), NO_MARK, give("marked", "assailant"))] })],
    serves: "conditional, Hunt 2 ●●●, Toll ●● ◆ focus",
  });
}
{
  const name = "Heart of the saint";
  const effect = "Healing abilities cost HP instead of MP, and heal ×2.";
  offhand("relic", "legendary", name, {
    effect, stats: [st("defense", 1), sp("crit_damage", "high")],
    statuses: [own_(name, effect, { mods: [{ of: { does: ["heal"] }, hp: { pct: 50, share: true, instead: true }, heal: 100 }] })],
    serves: "Pact 3 ●●● ⚙ brink (key) ◆ price",
  });
}
{
  const name = "Bloodstone reliquary", effect = "When an ally pays HP, the other ally with the lowest HP% heals as much.";
  offhand("relic", "legendary", name, {
    effect, stats: [st("max_mp", 1), sp("attack_speed", "high")],
    statuses: [own_(name, effect, { reactions: [react(on("hp_paid", { whose: "team" }), { op: "heal", amount: ofAmount(1), to: { side: "allies", pick: "lowest", by: "hp_share", exclude: "owner" } })] })],
    serves: "conditional, Pact 3 ●●● ⚙ brink (half), blood mage (half) ◆ price, life passed",
  });
}

// ─── Lantern ──

offhand("lantern", "common", "Revolving lantern", { stats: [sp("cooldown", "medium")], serves: "Barrage, and Bonfire's feeders: abilities round sooner." });
offhand("lantern", "common", "Hooded lantern", { stats: [sp("evasion", "medium"), st("mp_regen", 1), critDown], serves: "Barrage: mana behind a dodge, for fewer crits." });

{
  const name = "Seeker's lantern", effect = "Abilities deal +30% to the foe with the most debuffs.";
  offhand("lantern", "uncommon", name, {
    effect, stats: [st("attack", 1), sp("accuracy", "medium"), critStep(1), st("defense", -1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "ability", pct: against(30, { mostDebuffs: true }) }] })],
    serves: "Bonfire 1 ●●, Snap 1 ●● ◆ pile",
  });
}
{
  const name = "Dazzling lantern", effect = "At fight start: Weakens the 2 foes with the most Attack.";
  offhand("lantern", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [atStart(give("weaken", { side: "foes", pick: "highest", by: { stats: ["attack"] }, count: 2 }))] })],
    serves: "Toll ●, foes do less ⚙ goad (half) ◆ Weaken",
  });
}
{
  // A fallen foe's fire moves once: every piece and seat that moves it shares it.
  const name = "Wick";
  const effect = "When a burning foe falls: its Burn passes to the foe with the most Burn.";
  offhand("lantern", "rare", name, {
    effect, stats: [st("attack", 1), st("mp_regen", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [{ on: on("status_ended", { status: "burn", cause: ["ko"], whose: "foe" }), split: "fire", do: [give("burn", TO.mostFoe("burn"), ofAmount())] }] })],
    serves: "Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)",
  });
}
{
  const name = "Shuttered lantern", effect = "Takes −50% damage while winding up.";
  offhand("lantern", "rare", name, {
    effect, stats: [st("max_mp", 1), st("defense", 1), st("aggro", -1)],
    statuses: [own_(name, effect, { taken: [{ pct: { scale: [{ ratio: -50, when: { casting: true }, of: "holder" }] } }] })],
    serves: "conditional, Barrage 2 ●●, Bonfire ●●, Pact ● ◆ wind-ups",
  });
}
{
  // Every stacking status a player reads as one: the afflictions, Might, the foes' Ice crust and Bulwark, and the shared counters.
  // Not a Shield or a debt (their stacks are points of HP), nor a piece's own count to a beat.
  const name = "Everflame lantern", effect = `Every ${SO_OFTEN} ticks: every stacking status on every unit, foe or ally, gains a stack.`;
  const rising = ["burn", "chill", "shock", "bleed", "sunder", "might", "ice_crust", "bulwark", "edge", "heat", "spite", "wrath"];
  const each = rising.flatMap((s) => (["foes", "allies"] as const).map((side) => give(s, { side, pick: "all", where: { has: s } }, FLAT_STACKS.one)));
  offhand("lantern", "legendary", name, {
    effect, stats: [st("mp_regen", 1), sp("double_strike", "high")],
    statuses: [own_(name, effect, { pulse: { every: SO_OFTEN, do: each } })],
    serves: "exotic",
  });
}
{
  const name = "Lamp of vigil", effect = "After a won fight, if standing: raises a fallen ally at 25% HP.";
  offhand("lantern", "legendary", name, {
    effect, stats: [st("max_hp", 1), sp("accuracy", "high")],
    statuses: [own_(name, effect, { reactions: [reactIf(on("fight_won"), { side: "self", where: { ko: false } }, { op: "revive", hp: share(0.25, "max_hp", "target"), to: { side: "allies", where: { ko: true }, pick: "random" } })] })],
    serves: "exotic ◆ nets",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
