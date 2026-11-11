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
  const effect = "Its wearer's basic attacks add a few stacks (from Attack) to whichever of Burn, Chill, Shock or Bleed their target holds the most stacks of. If two are level, one of them at random. On a foe that holds none of the four, they add nothing.";
  amulet("uncommon", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "one", of: ["burn", "chill", "shock", "bleed"].map((status) => ({ status, stacks: own("few", "attack") })), pick: "most", to: "other" })] })],
    serves: "Bonfire 1 ●●, Snap 1 ●●, Storm 1 ●●, Cuts 1 ● ⚙ lead's colour (half) ◆ swing-status",
  });
}
{
  const name = "Challenger's token", effect = "Its wearer Taunts when each fight starts.";
  amulet("uncommon", name, {
    effect, stats: [st("defense", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("taunt"))] })],
    serves: "Toll 1 ●●, Bonfire ●, Storm ●, Hunt ● ⚙ opening again (half), goad (half), frozen gate (half), mirror (half), riposte (half), two in the dark (half) ◆ draw",
  });
}
{
  const name = "Carapace charm", effect = "Its wearer starts every fight behind a Shield of 15% of its max HP.";
  amulet("uncommon", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("shield", "holder", share(0.15, "max_hp")))] })],
    serves: "Landslide ●, net ⚙ opening again (half), detonation (half)",
  });
}
{
  const name = "Hare's foot", effect = "Its wearer starts every fight Hasted.";
  amulet("uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("haste"))] })],
    serves: "Cuts 1 ●●, Bonfire ●, Storm ●, Barrage ● ⚙ opening again (half), spell on the swing (half)",
  });
}
{
  // Half as often is its shape (Attack speed −100 counts no step).
  const name = "Millstone", effect = "Its wearer's basic attacks come half as often and deal two and a quarter times as much.";
  amulet("uncommon", name, {
    effect, stats: [st("attack", 1), st("defense", 1), { stat: "attack_speed", flat: -100 }],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: 125 }] })],
    serves: "Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half) ◆ heavy-blow",
  });
}
{
  // Twice as often is its shape (Attack speed +100 counts no step).
  const name = "Hummingbird charm", effect = "Its wearer's basic attacks come half again as often and deal two thirds as much.";
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
  const effect = "While its wearer is below half its MP, it gains Clarity every so often, the first at once.";
  const ready = { side: "self" as const, where: { mpBelow: 50, lacks: wait } };
  amulet("uncommon", name, {
    effect, stats: [st("max_mp", 1), st("aggro", -1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("fight_start"), ready, give("clarity"), give(wait))], pulse: { every: 1, if: ready, do: [give("clarity"), give(wait)] } }),
      marker(wait, "Clear-headed", "Its next Clarity comes once this wait is over.", { stacking: "fizzle", duration: SO_OFTEN }),
    ],
    serves: "Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast",
  });
}

// ─── Rare ──

{
  // A Shield emptied by a foe's damage ends (cause stacks) with its peak as the amount and that foe as its other unit.
  const name = "Shatterstone charm";
  const effect = "When a foe breaks its wearer's Shield, twice the most that Shield held is sent back to that foe. A Shield worn through by a status's damage sends nothing back.";
  amulet("rare", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_ended", { status: "shield", cause: ["stacks"], other: "foe" }), { op: "damage", type: "none", amount: ofAmount(2), to: "other" })] })],
    serves: "Landslide 2 ●●●, Cuts ●, Toll ●● ⚙ detonation (key)",
  });
}
{
  const name = "Bounty charm", effect = "When its wearer lands a killing blow, its ability with the longest cooldown left is ready at once. The ability that landed the blow counts.";
  amulet("rare", name, {
    effect, stats: [st("attack", 1), critStep(1), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, { op: "cooldown", which: "longest", set: "ready", to: "holder" })] })],
    serves: "Hunt 2 ●●●, Barrage ●● ⚙ reaping (key) ◆ kill-pays",
  });
}
{
  const name = "Echo charm", effect = "Its wearer's extra strikes carry what the swing carries.";
  amulet("rare", name, {
    effect, stats: [sp("double_strike", "medium"), st("attack", 1), sp("evasion", "medium")],
    statuses: [own_(name, effect, { echo: true })],
    serves: "Cuts 2 ●●, Bonfire ●, Snap ●, Storm ●",
  });
}
{
  const name = "Floe charm", effect = "When a foe's Chill shatters, its wearer's first-slotted ability is ready at once. If it's ready already, nothing happens.";
  amulet("rare", name, {
    effect, stats: [sp("cast_speed", "medium"), st("max_mp", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.shatter, { op: "cooldown", which: "first", set: "ready", to: "holder" })] })],
    serves: "Snap 2 ●●●, Landslide ●●, Barrage ●●, Bonfire ●● ⚙ shatter bell (key)",
  });
}
{
  const name = "Lightning-glass", effect = "Its wearer's abilities deal 4% more for each Shock on their target. The Shock stays.";
  amulet("rare", name, {
    effect, stats: [st("attack", 1), sp("cooldown", "medium"), st("max_mp", 1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "ability", pct: stacksOf("shock", 4, "target") }] })],
    serves: "Storm 2 ●●●, Landslide ●, Snap ● ⚙ held charge (key)",
  });
}
{
  // The cap takes what's above half as the status lands, and at the cap the unit reads as under it (the engine's).
  const name = "Halved heart";
  const effect = "Its wearer starts every fight at half its max HP: anything above half is lost as the fight starts, and it isn't a price paid. It can't be healed above half; healing past that counts as healing past full. At half it counts as below half its max HP. Its wearer's hits deal half again as much.";
  amulet("rare", name, {
    effect, stats: [sp("lifesteal", "medium"), st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { healCap: 50, boosts: hits(50) })],
    serves: "Pact 2 ●●●, Toll ● ⚙ brink (key)",
  });
}
{
  const name = "Crescendo charm";
  const effect = "Each time its wearer finishes casting an ability, that ability gains a Crescendo (that ability deals, heals and adds a fifth more for each Crescendo it holds, up to 10), kept for the fight. An ability costs two fifths more for each Crescendo it holds, in whatever it's paid in. A cast that costs nothing still gains one.";
  amulet("rare", name, {
    effect, stats: [st("max_mp", 1), st("mp_regen", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { mods: [{ damage: 20, heal: 20, stacks: { pct: 20 }, mp: 40, times: CRESCENDO }] })],
    serves: "Barrage 2 ●●● ⚙ crescendo (key)",
  });
}
{
  // The fallen foe's fire, held as a tally on the wearer (not Burn), laid on the first foe its next hit lands on.
  const name = "Ember heart", held = `${id(name)}_held`;
  const effect = "When a burning foe falls, all its Burn passes to the next foe its wearer hits. Until then the charm keeps it, shown as a number on its wearer: it isn't Burn on the wearer, and it doesn't burn down. A fallen foe's fire moves once: if something else in the party moves it too, it's split evenly between them.";
  amulet("rare", name, {
    effect, stats: [st("attack", 1), sp("attack_speed", "medium"), st("max_hp", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          { on: on("status_ended", { status: "burn", cause: ["ko"], whose: "foe" }), split: "fire", do: [give(held, "holder", ofAmount())] },
          reactIf(EV.hit, { side: "self", where: { has: held } }, give("burn", "other", stacksOf(held), { rider: false }), lift(held, "holder", "marker")),
        ],
      }),
      marker(held, "EMBER", "A fallen foe's fire, for the next foe it hits.", { show: "icon", stacking: "intensity" }),
    ],
    serves: "Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)",
  });
}
{
  const name = "Hunter's mark", effect = "While no foe is Marked, its wearer Marks the foe with the lowest current HP.";
  amulet("rare", name, {
    effect, stats: [critStep(1), sp("crit_damage", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, {
      reactions: [reactIf(on("fight_start"), NO_MARK, give("marked", TO.lowestHpFoe)), reactIf(on("status_ended", { status: "marked", whose: "foe" }), NO_MARK, give("marked", TO.lowestHpFoe))],
    })],
    serves: "Hunt 2 ●●● ⚙ judge's drum (half)",
  });
}
{
  const name = "Shroud charm", effect = "Whenever an ally drops below a third of its max HP, that ally is Hidden.";
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
  const effect = "Whenever its wearer adds Chill to one foe, every other foe gains as many stacks. What already adds Chill to every foe is unchanged. The Chill it adds isn't added again.";
  amulet("legendary", name, {
    effect, stats: [st("attack", 1), sp("attack_speed", "medium"), sp("cooldown", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, {
      reactions: [react(on("status_gained", { status: "chill", whose: "foe", other: "holder", notTags: ["area"], repeat: false }), give("chill", TO.otherFoes("owner"), ofAmount(), { copy: true }))],
    })],
    serves: "Snap 3 ●●● ⚙ firecracker (half)",
  });
}
{
  const name = "Second dawn", effect = "Each time a foe falls, the start-of-fight effects of every ally's gear and seat happen again, once for each fall.";
  amulet("legendary", name, {
    effect, stats: [st("attack", 1), critStep(1), st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.fall, { op: "restart", to: TO.everyAlly })] })],
    serves: "Hunt 3 ●●● ⚙ opening again (key)",
  });
}
{
  const name = "Downhill charm";
  const effect = "What its wearer's killing blows have left over is split evenly among the other foes, as a hit on each. It carries once: a share that fells a foe carries no further.";
  amulet("legendary", name, {
    effect, stats: [st("attack", 2), critStep(1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [{ on: on("ko", { whose: "foe", other: "holder", tags: ["physical"], notTags: ["bare"] }), split: "over", do: [{ op: "strike", of: "over", split: true, to: TO.everyFoe }] }] })],
    serves: "Landslide ●●, Hunt ●● ⚙ avalanche (key)",
  });
}
{
  const name = "Twin-knot";
  const effect = "Whenever its wearer gives itself a status, the other ally with the lowest share of max HP gains it too, with as many stacks. A state its wearer holds only while something is true of it (while it's below half its max HP, while it holds a Shield) isn't given, and isn't shared. What's shared isn't shared again.";
  amulet("legendary", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 1), st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_gained", { other: "holder", repeat: false }), { op: "share", to: TO.otherLowestAlly })] })],
    serves: "exotic ⚙ borrowed gift (key), brink (half), two in the dark (half)",
  });
}
{
  // Every debuff it holds rides its next hit that lands onto the foe hit; Doom stays.
  const name = "Scapegoat charm";
  const effect = "When its wearer is given a debuff, its next hit that lands gives that debuff, with all the stacks it holds then, to its target, and the wearer is rid of it. It lands on the foe as a fresh one, at its own length. Doom can't be passed on.";
  amulet("legendary", name, {
    effect, stats: [st("aggro", 1), sp("attack_speed", "medium"), st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, { op: "pass", label: "debuff", except: ["doom"], to: "other" })] })],
    serves: "exotic ⚙ carrier (half)",
  });
}
{
  const name = "Burning heart";
  const effect = "Every 10 ticks, its wearer sets itself alight: a few Burn on itself, a set number that reads no stat. While it holds any Burn, its wearer's hits deal half again as much.";
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
  const effect = "Once a fight, when its wearer falls, it stands up 4 ticks later with a third of its max HP, Hidden, and with every ability on its full cooldown. If no ally is standing when it falls, the fight is lost before it rises.";
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
  const name = "Ready stance", effect = "Its wearer's abilities start every fight at least half charged. Its cooldowns are a fifth longer.";
  amulet("legendary", name, {
    effect, stats: [st("attack", 1), critStep(1), st("max_mp", 1), sp("evasion", "medium"), { stat: "cooldown_reduction", flat: -16.7 }],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "cooldown", which: "abilities", set: { atMost: 50 }, to: "holder" })] })],
    serves: "first move, Hunt ●●, Barrage ●●",
  });
}
{
  // The chance set after every stat; hits −50%, and the crit multiplier doubled, so a crit lands at its usual size.
  const name = "Gambler's coin";
  const effect = "Its wearer's crit chance is about half. Its wearer's hits that don't crit deal half; its crits deal what a crit always does. Hits that always crit still do, and a chance another card sets on some hits wins over the coin's.";
  amulet("legendary", name, {
    effect, stats: [sp("crit_damage", "medium"), st("attack", 1), st("max_hp", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, { set: [{ stat: "crit_chance", value: 50 }], boosts: hits(-50), stats: [{ stat: "crit_multiplier", flat: share(1, "crit_multiplier") }] })],
    serves: "exotic ⚙ emptied quiver (half)",
  });
}
{
  const name = "Turncoat charm";
  const effect = "Its wearer's Attack and Defense are swapped, as they stand on its sheet with its gear and its seat counted. Statuses change them as usual after that: a Guard still raises its Defense.";
  amulet("legendary", name, {
    effect, stats: [st("max_hp", 2), critStep(1), sp("evasion", "medium")],
    statuses: [own_(name, effect, { swap: ["attack", "defense"] })],
    serves: "exotic",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
