/**
 * The amulets. A common or uncommon carries the standard budget of steps exactly; a rare or legendary at least its step
 * beside the effect that is its shape (kit.ts piece). Statuses are at their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { StatusT } from "../../../src/schema.js";
import { FLAT_STACKS } from "../scale.js";
import { CRESCENDO } from "./shared.js";
import { EV, NO_MARK, SO_OFTEN, TO, atStart, critStep, give, hits, lift, marker, ofAmount, on, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, used, whileIt, type Change, type Rarity } from "./kit.js";

const S = shelf();

/** One amulet: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function amulet(rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; statuses?: StatusT[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, slot: "amulet", rarity, effect: o.effect, stats: o.stats, statuses: statuses.filter((s) => s.id === id(name)).map((s) => s.id) }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);

amulet("common", "Bezoar", { stats: [st("max_hp", 1)], serves: "the Toll, Blood Pact: max HP is the anchor's body and the price Blood Pact pays in." });
amulet("common", "Ironstone", { stats: [st("defense", 1)], serves: "Landslide, the Toll: Defense is the stone's damage stat and the wall's cover." });
amulet("common", "Flint", { stats: [st("attack", 1)], serves: "Bonfire, Cold Snap, the Storm: their stacks are read off Attack." });
amulet("common", "Cat's eye", { stats: [critStep(1)], serves: "the Hunt: crits on a few chosen hits." });
amulet("common", "Dewstone", { stats: [st("mp_regen", 1)], serves: "Barrage: mana in fights." });
amulet("common", "Quicksilver", { stats: [sp("evasion", "medium")], serves: "Thousand Cuts, and the Toll's dancer." });
amulet("common", "Carnelian", { stats: [sp("lifesteal", "medium")], serves: "Blood Pact: the drinker's sign, for any class." });
amulet("common", "Caltrop", { stats: [sp("thorns", "medium")], serves: "the Toll: being struck strikes back." });
amulet("common", "Skipping stone", { stats: [sp("double_strike", "medium")], serves: "Thousand Cuts: more hits, however they come." });
amulet("common", "Tidestone", { stats: [sp("cooldown", "medium")], serves: "Barrage, and Bonfire's feeders: abilities round sooner." });

// ─── Uncommon ──

{
  const name = "Tinder charm";
  const effect = "Basic attacks add whichever of Burn, Chill, Shock or Bleed the target holds most.";
  amulet("uncommon", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "one", of: ["burn", "chill", "shock", "bleed"].map((status) => ({ status, stacks: own("few", "attack") })), pick: "most", to: "other" })] })],
    serves: "Bonfire 1 ●●, Snap 1 ●●, Storm 1 ●●, Cuts 1 ● ⚙ lead's colour (half) ◆ swing-status",
  });
}
{
  const name = "Challenger's token", effect = "At fight start: Taunts.";
  amulet("uncommon", name, {
    effect, stats: [st("defense", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("taunt"))] })],
    serves: "Toll 1 ●●, Bonfire ●, Storm ●, Hunt ● ⚙ opening again (half), goad (half), frozen gate (half), mirror (half), riposte (half), two in the dark (half) ◆ draw",
  });
}
{
  const name = "Carapace charm", effect = "At fight start: a Shield of 15% of max HP.";
  amulet("uncommon", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("shield", "holder", share(0.15, "max_hp")))] })],
    serves: "Landslide ●, net ⚙ opening again (half), detonation (half)",
  });
}
{
  const name = "Hare's foot", effect = "At fight start: Hasted.";
  amulet("uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("haste"))] })],
    serves: "Cuts 1 ●●, Bonfire ●, Storm ●, Barrage ● ⚙ opening again (half), spell on the swing (half)",
  });
}
{
  // Half as often is its shape (Attack speed −100 counts no step).
  const name = "Millstone", effect = "Basic attacks come half as often and deal ×2.25 damage.";
  amulet("uncommon", name, {
    effect, stats: [st("attack", 1), st("defense", 1), { stat: "attack_speed", flat: -100 }],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: 125 }] })],
    serves: "Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half) ◆ heavy-blow",
  });
}
{
  // Twice as often is its shape (Attack speed +100 counts no step).
  const name = "Hummingbird charm", effect = "Basic attacks come 50% more often and deal 33% less.";
  amulet("uncommon", name, {
    // Even for the swing, but every rider and every Bleed a hit pays comes half again as often (at twice, they doubled).
    effect, stats: [sp("double_strike", "medium"), sp("evasion", "medium"), { stat: "attack_speed", flat: 50 }],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: -33 }] })],
    serves: "Cuts 1 ●●●, Bonfire ●, Snap ●, Storm ● ⚙ spell on the swing (half)",
  });
}
{
  // A look every tick: under half its MP, and no Clarity from the charm for a short while, it gains one and the wait begins.
  const name = "Clear-headed charm", wait = `${id(name)}_wait`;
  const effect = `Below half MP: Clarity every ${SO_OFTEN} ticks, starting at once.`;
  const ready = { side: "self" as const, where: { mpBelow: 50, lacks: wait } };
  amulet("uncommon", name, {
    effect, stats: [st("max_mp", 1), st("aggro", -1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("fight_start"), ready, give("clarity"), give(wait))], pulse: { every: 1, if: ready, do: [give("clarity"), give(wait)] } }),
      marker(wait, "Clear-headed", "Next Clarity when this ends.", { stacking: "fizzle", duration: SO_OFTEN }),
    ],
    serves: "Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast",
  });
}

// ─── Rare ──

{
  // A Shield emptied by a foe's damage ends (cause stacks) with its peak as the amount and that foe as its other unit.
  const name = "Shatterstone charm";
  const effect = "When a foe breaks its Shield: sends back double the most it held.";
  amulet("rare", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_ended", { status: "shield", cause: ["stacks"], other: "foe" }), { op: "damage", type: "none", amount: ofAmount(2), to: "other" })] })],
    serves: "Landslide 2 ●●●, Cuts ●, Toll ●● ⚙ detonation (key)",
  });
}
{
  const name = "Bounty charm", effect = "On a kill: its ability with the most cooldown left is ready, the killing one included.";
  amulet("rare", name, {
    effect, stats: [st("attack", 1), critStep(1), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, { op: "cooldown", which: "longest", set: "ready", to: "holder" })] })],
    serves: "Hunt 2 ●●●, Barrage ●● ⚙ reaping (key) ◆ kill-pays",
  });
}
{
  const name = "Echo charm", effect = "Extra strikes carry the swing's effects.";
  amulet("rare", name, {
    effect, stats: [sp("double_strike", "medium"), st("attack", 1), sp("evasion", "medium")],
    statuses: [own_(name, effect, { echo: true })],
    serves: "Cuts 2 ●●, Bonfire ●, Snap ●, Storm ●",
  });
}
{
  // Half the wait, not ready at once: with a shatter every few ticks, at once it fired its first ability on every shatter.
  const name = "Floe charm", effect = "On a shatter: halves its first-slotted ability's wait.";
  amulet("rare", name, {
    effect, stats: [sp("cast_speed", "medium"), st("max_mp", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.shatter, { op: "cooldown", which: "first", set: { times: 50 }, to: "holder" })] })],
    serves: "Snap 2 ●●●, Landslide ●●, Barrage ●●, Bonfire ●● ⚙ shatter bell (key)",
  });
}
{
  const name = "Lightning-glass", effect = "Abilities deal +4% per Shock on the target.";
  amulet("rare", name, {
    effect, stats: [st("attack", 1), sp("cooldown", "medium"), st("max_mp", 1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "ability", pct: stacksOf("shock", 4, "target") }] })],
    serves: "Storm 2 ●●●, Landslide ●, Snap ● ⚙ held charge (key)",
  });
}
{
  // The cap takes what's above half as the status lands, and at the cap the unit reads as under it (the engine's).
  const name = "Halved heart";
  const effect = "Starts each fight at half HP and can't be healed above it. Counts as below half. Hits deal +50%.";
  amulet("rare", name, {
    effect, stats: [sp("lifesteal", "medium"), st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { healCap: 50, boosts: hits(50) })],
    serves: "Pact 2 ●●●, Toll ● ⚙ brink (key)",
  });
}
{
  const name = "Crescendo charm";
  const effect = "Each cast gives that ability a Crescendo: +20% damage, healing and stacks, and +40% cost, per Crescendo (up to 10).";
  amulet("rare", name, {
    effect, stats: [st("max_mp", 1), st("mp_regen", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { mods: [{ damage: 20, heal: 20, stacks: { pct: 20 }, mp: 40, times: CRESCENDO }] })],
    serves: "Barrage 2 ●●● ⚙ crescendo (key)",
  });
}
{
  // The fallen foe's fire, held as a tally on the wearer (not Burn), laid on the first foe its next hit lands on.
  const name = "Ember heart", held = `${id(name)}_held`;
  const effect = "When a burning foe falls: keeps all its Burn for the next foe it hits.";
  amulet("rare", name, {
    effect, stats: [st("attack", 1), sp("attack_speed", "medium"), st("max_hp", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          { on: on("status_ended", { status: "burn", cause: ["ko"], whose: "foe" }), split: "fire", do: [give(held, "holder", ofAmount())] },
          reactIf(EV.hit, { side: "self", where: { has: held } }, give("burn", "other", stacksOf(held), { rider: false }), lift(held, "holder", "marker")),
        ],
      }),
      marker(held, "EMBER", "Burn for the next foe it hits.", { show: "icon", stacking: "intensity" }),
    ],
    serves: "Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)",
  });
}
{
  const name = "Hunter's mark", effect = "While no foe is Marked: Marks the foe with the least HP.";
  amulet("rare", name, {
    effect, stats: [critStep(1), sp("crit_damage", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, {
      reactions: [reactIf(on("fight_start"), NO_MARK, give("marked", TO.lowestHpFoe)), reactIf(on("status_ended", { status: "marked", whose: "foe" }), NO_MARK, give("marked", TO.lowestHpFoe))],
    })],
    serves: "Hunt 2 ●●● ⚙ judge's drum (half)",
  });
}
{
  const name = "Shroud charm", effect = "An ally that drops below 33% HP is Hidden.";
  amulet("rare", name, {
    effect, stats: [sp("evasion", "medium"), st("aggro", -1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hp_low", { whose: "team", line: 33 }), give("hidden", "owner"))] })],
    serves: "Pact ●●, net ⚙ two in the dark (key), brink (half)",
  });
}

// ─── Legendary ──

{
  // Chill its wearer lays on one foe (not an area's), copied to every other foe; a copy is never copied again.
  const name = "Heart of winter";
  const effect = "When it adds Chill to one foe, every other foe gains as much.";
  amulet("legendary", name, {
    effect, stats: [st("attack", 1), sp("attack_speed", "medium"), sp("cooldown", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, {
      reactions: [react(on("status_gained", { status: "chill", whose: "foe", other: "holder", notTags: ["area"], repeat: false }), give("chill", TO.otherFoes("owner"), ofAmount(), { copy: true }))],
    })],
    serves: "Snap 3 ●●● ⚙ firecracker (half)",
  });
}
{
  const name = "Second dawn", effect = "When a foe falls: every ally's gear and seat start-of-fight effects happen again.";
  amulet("legendary", name, {
    effect, stats: [st("attack", 1), critStep(1), st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.fall, { op: "restart", to: TO.everyAlly })] })],
    serves: "Hunt 3 ●●● ⚙ opening again (key)",
  });
}
{
  const name = "Downhill charm";
  const effect = "On a kill: the blow's leftover damage splits evenly among the other foes.";
  amulet("legendary", name, {
    effect, stats: [st("attack", 2), critStep(1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [{ on: on("ko", { whose: "foe", other: "holder", tags: ["physical"], notTags: ["bare"] }), split: "over", do: [{ op: "strike", of: "over", split: true, to: TO.everyFoe }] }] })],
    serves: "Landslide ●●, Hunt ●● ⚙ avalanche (key)",
  });
}
{
  const name = "Twin-knot";
  const effect = "When it gives itself a status, the other ally with the lowest HP% gains it too.";
  amulet("legendary", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 1), st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_gained", { other: "holder", repeat: false }), { op: "share", to: TO.otherLowestAlly })] })],
    serves: "exotic ⚙ borrowed gift (key), brink (half), two in the dark (half)",
  });
}
{
  // Every debuff it holds rides its next hit that lands onto the foe hit; Doom stays.
  const name = "Scapegoat charm";
  const effect = "Each hit it lands moves its debuffs, all stacks, onto the target. Never Doom.";
  amulet("legendary", name, {
    effect, stats: [st("aggro", 1), sp("attack_speed", "medium"), st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, { op: "pass", label: "debuff", except: ["doom"], to: "other" })] })],
    serves: "exotic ⚙ carrier (half)",
  });
}
{
  const name = "Burning heart";
  const effect = `Every 10 ticks: ${FLAT_STACKS.few} Burn on itself. While it burns: hits deal +50%.`;
  amulet("legendary", name, {
    effect, stats: [sp("lifesteal", "high"), st("max_hp", 1), st("attack", 1)],
    statuses: [own_(name, effect, { pulse: { every: 10, do: [give("burn", "holder", FLAT_STACKS.few)] }, boosts: hits(whileIt(50, { has: "burn" })) })],
    serves: "exotic, Pact ●, Bonfire ● ⚙ carrier (half)",
  });
}
{
  // A fallen unit can't gain a status, so its fall schedules its own return unless the marker is there; the marker is set
  // when it stands again by its own hand. As every revive, it comes back with its actions on full cooldown.
  const name = "Phoenix ember", done = `${id(name)}_used`;
  const effect = "Once a fight: rises 4 ticks after falling, at 33% HP and Hidden.";
  amulet("legendary", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1), sp("evasion", "medium"), st("mp_regen", 1)],
    statuses: [
      own_(name, effect, {
        survivesKO: true,
        reactions: [
          react(on("ko"), { op: "revive", hp: share(1 / 3, "max_hp", "target"), after: 4, to: { side: "self", where: { ko: true, lacks: done } } }),
          react(on("revived", { other: "holder" }), give(done), give("hidden")),
        ],
      }),
      used(done, "PHOENIX EMBER"),
    ],
    serves: "net",
  });
}
{
  // Cooldown −16.7 is its shape (cooldowns ×1.2, a fifth longer), counting no step.
  const name = "Ready stance", effect = "Abilities start each fight at least half charged. Cooldowns 20% longer.";
  amulet("legendary", name, {
    effect, stats: [st("attack", 1), critStep(1), st("max_mp", 1), sp("evasion", "medium"), { stat: "cooldown_reduction", flat: -16.7 }],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "cooldown", which: "abilities", set: { atMost: 50 }, to: "holder" })] })],
    serves: "first move, Hunt ●●, Barrage ●●",
  });
}
{
  // The chance set after every stat; hits −50%, and the crit multiplier doubled, so a crit lands at its usual size.
  const name = "Gambler's coin";
  const effect = "Crit chance is 50%. Hits that don't crit deal half.";
  amulet("legendary", name, {
    effect, stats: [sp("crit_damage", "medium"), st("attack", 1), st("max_hp", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, { set: [{ stat: "crit_chance", value: 50 }], boosts: hits(-50), stats: [{ stat: "crit_multiplier", flat: share(1, "crit_multiplier") }] })],
    serves: "exotic ⚙ emptied quiver (half)",
  });
}
{
  const name = "Turncoat charm";
  const effect = "Attack and Defense swap, gear and seat counted. Statuses apply after.";
  amulet("legendary", name, {
    effect, stats: [st("max_hp", 2), critStep(1), sp("evasion", "medium")],
    statuses: [own_(name, effect, { swap: ["attack", "defense"] })],
    serves: "exotic",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
