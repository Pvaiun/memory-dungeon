/**
 * Seven offhand kinds' pieces: tome, orb, idol, vial, trophy, bell and cloak. Each carries the standard budget of steps at
 * its rarity, exactly (kit.ts piece). Statuses are at their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { StatusT } from "../../../src/schema.js";
import { FLAT_STACKS, HIT, STATUS } from "../scale.js";
import { CRESCENDO } from "./shared.js";
import { EV, TO, against, atFirstStart, atStart, beatHalfway, count, countAt, critStep, give, hits, lift, marker, ofAmount, on, onceBelow, oneUse, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, state, swingNow, swingStacks, used, type Change, type Rarity } from "./kit.js";

const S = shelf();

/** One offhand of a kind: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function offhand(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; statuses?: StatusT[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "offhand", rarity, effect: o.effect, stats: o.stats, statuses: statuses.filter((s) => s.id === id(name)).map((s) => s.id) }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);
/** A status a piece lays on others: on the sheet, unremovable, refreshed. */
const given = (sid: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id: sid, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
/** Its holder's own casts: an ordinary one or a paid second, not a free repeat. */
const OWN_CAST = on("action_resolve", { kind: "ability", repeat: false, counted: true });
const FOUR = ["burn", "chill", "shock", "bleed"];

// ─── Tome ──

offhand("tome", "common", "Scholar's codex", { stats: [st("attack", 1)], serves: "Cold Snap, and the Hexer's curses: Attack sets the stacks." });
offhand("tome", "common", "Hymnal", { stats: [sp("cooldown", "medium")], serves: "Barrage." });

{
  const name = "Snowbound folio", effect = "When each fight starts, every foe gains a few Chill (from its holder's Attack).";
  offhand("tome", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("chill", TO.everyFoe, own("few", "attack")))] })],
    serves: "Snap 1 ●● ⚙ opening again (half), every colour (half), firecracker (half)",
  });
}
{
  // A change's rule that finds nobody leaves the ability its own.
  const name = "Marginalia";
  const effect = "While a foe is in a wind-up, its holder's abilities that aim at one foe aim at the casting foe with the highest Attack instead. A Taunt still decides the pick for an ability without Seek.";
  offhand("tome", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { mods: [{ of: { single: true }, target: { side: "foes", where: { casting: true }, pick: "highest", by: { stats: ["attack"] } } }] })],
    serves: "stops a cast, Snap ●, Toll ●",
  });
}
{
  const name = "Curse-book", effect = "Its holder's abilities add several Bleed to each foe they hit (from its holder's Attack).";
  offhand("tome", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { mods: [{ apply: [{ status: "bleed", stacks: swingStacks("several") }] }] })],
    serves: "Cuts 1 ●● ⚙ red rain (half), every colour (half)",
  });
}
{
  const name = "Primer of frost", effect = "Each time its holder adds Chill to a foe, it adds a tenth more for each stack of Chill that foe already holds.";
  offhand("tome", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 2)],
    statuses: [own_(name, effect, { boosts: [{ tag: "chill", pct: { scale: [{ ratio: 10, stacks: "chill", of: "target" }] } }] })],
    serves: "Snap 2 ●●●",
  });
}
{
  // The third of its own casts is cast again, free (a free repeat isn't counted, so it's never cast again).
  const name = "Twice-told tome", n = `${id(name)}_count`;
  const effect = "Every third ability its holder casts in a fight is cast twice. The second cast comes at once and is free; it isn't counted, and it isn't cast again.";
  offhand("tome", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), sp("cast_speed", "medium"), st("max_mp", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(OWN_CAST, { side: "self", where: countAt(n, 2) }, { op: "recast" }), react(OWN_CAST, give(n, "holder", 1))] }),
      count(n, "TWICE-TOLD", "Every third ability it casts is cast twice.", 3),
    ],
    serves: "Barrage 2 ●●●, Snap ●●, Landslide ● ⚙ crescendo (half) ◆ free-cast",
  });
}
{
  const name = "Grimoire of plagues";
  const effect = "When each fight starts, two of Burn, Chill, Shock and Bleed are picked at random, and every foe gains a few stacks of each (from its holder's Attack).";
  offhand("tome", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "one", of: FOUR.map((status) => ({ status, stacks: own("few", "attack") })), count: 2, same: true, to: TO.everyFoe })] })],
    serves: "Bonfire ●●, Snap ●●, Storm ●●, Cuts ●● ⚙ every colour (key), opening again (half)",
  });
}
{
  const name = "Accompanist's score", free = `${id(name)}_free`;
  const effect = "Each time the other ally with the highest Attack pays for an ability, its holder's next ability is free. It holds one free cast at a time.";
  offhand("tome", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 1), st("max_mp", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("action_resolve", { kind: "ability", paid: true, whose: "ally" }), { unit: "owner", where: { top: { stats: ["attack"], others: true } } }, give(free))] }),
      oneUse(free, "ACCOMPANIED", "Its next ability is free.", on("action_resolve", { kind: "ability" }), { mods: [{ mp: -100 }] }),
    ],
    serves: "Barrage 2 ●● ⚙ crescendo (half) ◆ free-cast",
  });
}
{
  // Untyped damage of all its HP and Shield: not a hit. Every fall it causes checks again.
  const name = "Last page", effect = "When a foe falls, every foe below a tenth of its max HP falls too.";
  offhand("tome", "legendary", name, {
    effect, stats: [sp("cooldown", "high"), st("attack", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, {
      reactions: [react(EV.fall, { op: "damage", type: "none", amount: { scale: [{ ratio: 1, hp: "current", of: "target" }, { ratio: 1, stacks: "shield", of: "target" }] }, to: { side: "foes", where: { hpBelow: 10 }, pick: "all" } })],
    })],
    serves: "Hunt 3 ●●, Storm ● ⚙ reaping (half)",
  });
}
{
  // Only a cast that was paid for makes a free one, so a free cast makes none; any ally's next ability spends every copy.
  const name = "Annotated grimoire", free = `${id(name)}_free`, effect = "Each ability its holder pays for makes the next ability any ally casts free.";
  offhand("tome", "legendary", name, {
    effect, stats: [sp("cooldown", "high"), st("max_mp", 1), st("mp_regen", 1)],
    statuses: [
      own_(name, effect, { reactions: [react(on("action_resolve", { kind: "ability", paid: true }), give(free, TO.everyAlly))] }),
      marker(free, "Free cast", "Its next ability is free.", {
        mods: [{ mp: -100 }],
        reactions: [react(on("action_resolve", { kind: "ability" }), lift(free, TO.everyAlly, "marker"))],
      }),
    ],
    serves: "Barrage 3 ●●● ⚙ crescendo (half) ◆ free-cast",
  });
}
{
  const name = "Frozen tome", effect = "Each time a foe's Chill shatters, every ally's first-slotted ability comes half its wait closer.";
  offhand("tome", "legendary", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 2), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.shatter, { op: "cooldown", which: "first", set: { times: 50 }, to: TO.everyAlly })] })],
    serves: "Snap 3 ●●●, Landslide ●●, Barrage ●● ⚙ shatter bell (key)",
  });
}

// ─── Orb ──

offhand("orb", "common", "Glass orb", { stats: [st("max_mp", 1)], serves: "Barrage." });
offhand("orb", "common", "Ember orb", { stats: [st("attack", 1)], serves: "Bonfire and Cold Snap." });

{
  const name = "Scrying orb", effect = "When each fight starts, its holder's ability nearest to ready is ready at once.";
  offhand("orb", "uncommon", name, {
    effect, stats: [st("max_mp", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "cooldown", which: "soonest", set: "ready", to: "holder" })] })],
    serves: "Barrage 1 ●, Hunt 1 ●, first move ⚙ opening again (half)",
  });
}
{
  const name = "Mana pearl", effect = "Each time a foe falls, its holder regains 15% of its max MP.";
  offhand("orb", "uncommon", name, {
    effect, stats: [st("max_mp", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.fall, { op: "mp", amount: share(0.15, "max_mp"), to: "holder" })] })],
    serves: "Barrage 1 ●●, Bonfire ● ⚙ resonance (half) ◆ kill-pays, free-cast",
  });
}
{
  const name = "Meltwater orb", effect = "When a foe's Chill shatters, its holder regains a quarter of its max MP.";
  offhand("orb", "rare", name, {
    effect, stats: [st("max_mp", 1), st("attack", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.shatter, { op: "mp", amount: share(0.25, "max_mp"), to: "holder" })] })],
    serves: "Snap 2 ●●●, Barrage 2 ●● ⚙ frozen gate (half), resonance (half) ◆ free-cast",
  });
}
{
  const name = "Smouldering orb";
  const effect = "When a burning foe falls, every other foe gains a third of the Burn it held. A fallen foe's fire moves once: if something else in the party moves it too, it's split evenly between them.";
  offhand("orb", "rare", name, {
    effect, stats: [st("max_mp", 1), st("attack", 1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [{ on: on("status_ended", { status: "burn", cause: ["ko"], whose: "foe" }), split: "fire", do: [give("burn", TO.otherFoes("owner"), ofAmount(1 / 3))] }] })],
    serves: "Bonfire 2 ●●●, Hunt ● ⚙ fuse (key)",
  });
}
{
  const name = "Orb of the deep", effect = "Damage that would reach its holder's HP comes out of its MP instead, point for point, while it has any. A Shield still takes the damage first.";
  offhand("orb", "rare", name, {
    effect, stats: [st("max_mp", 2), st("mp_regen", 1)],
    statuses: [own_(name, effect, { soak: "mp" })],
    serves: "Barrage 2 ●●●, Pact ● ⚙ mana as armour (key)",
  });
}
{
  const name = "Orb of the rising sun";
  const effect = "Each time its holder casts an ability, that ability gains a Crescendo as the cast finishes (that ability deals, heals and adds a fifth more for each Crescendo it holds, up to 10). Nothing makes its abilities cost more for the Crescendo they hold.";
  offhand("orb", "legendary", name, {
    effect, stats: [st("max_mp", 1), sp("cooldown", "high"), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { mods: [{ damage: 20, heal: 20, stacks: { pct: 20 }, times: CRESCENDO }] })],
    serves: "Barrage 3 ●●●, Bonfire ●● ⚙ crescendo (key)",
  });
}
{
  const name = "The deep well", effect = "While its holder holds Clarity, its abilities are free.";
  offhand("orb", "legendary", name, {
    effect, stats: [st("max_mp", 2), st("attack", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { mods: [{ mp: -100, if: { has: "clarity" } }] })],
    serves: "Barrage 3 ●●● ⚙ crescendo (half) ◆ free-cast",
  });
}

// ─── Idol ──

offhand("idol", "common", "Night mask", { stats: [sp("siphon", "medium")], serves: "Barrage (the blood-well)." });
offhand("idol", "common", "Carved effigy", { stats: [st("max_hp", 1)], serves: "Blood Pact." });

{
  const name = "Fanged idol", mark = `${id(name)}_mark`, effect = "Its holder's first hit on each foe in a fight Rots that foe.";
  offhand("idol", "uncommon", name, {
    effect, stats: [sp("siphon", "medium"), sp("lifesteal", "medium")],
    statuses: [
      own_(name, effect, { reactions: [reactIf(EV.hit, { unit: "other", where: { lacks: mark } }, give("rot", "other"), give(mark, "other", undefined, { rider: false }))] }),
      marker(mark, "Fanged", "The Fanged idol has bitten it.", { perSource: {} }),
    ],
    serves: "foes do less, Pact ●",
  });
}
{
  const name = "Leech idol", effect = "MP its holder gains past its full pool goes to the ally with the least MP. MP sent on this way isn't sent on again.";
  offhand("idol", "uncommon", name, {
    effect, stats: [sp("siphon", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("mp_over"), { op: "mp", amount: ofAmount(1), to: TO.leastMpAlly })] })],
    serves: "Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast",
  });
}
{
  // The casting foe is marked, and the swing made ready aims at a marked foe past any Taunt; the swing lifts both.
  const name = "Hushing idol", mark = `${id(name)}_mark`, aim = `${id(name)}_on`;
  const effect = "When a foe starts a wind-up, its holder's next basic attack comes at once, at that foe, whatever Taunts.";
  offhand("idol", "rare", name, {
    effect, stats: [sp("siphon", "medium"), st("attack", 1), sp("lifesteal", "medium")],
    statuses: [
      own_(name, effect, {
        reactions: [
          reactIf(on("action_start", { whose: "foe", kind: "ability" }), { unit: "owner", where: { casting: true } }, give(mark, "owner"), give(aim), swingNow()),
          react(EV.swing, lift(mark, TO.everyFoe, "marker")),
        ],
      }),
      marker(mark, "Hushed", "The Hushing idol's holder swings at it next.", { perSource: {} }),
      oneUse(aim, "HUSH", "Its next basic attack goes at the foe winding up, past any Taunt.", EV.swing, { aim: { rule: { side: "foes", where: { has: mark } }, first: true }, seek: "basic" }),
    ],
    serves: "stops a cast, Toll ●●, Snap ●",
  });
}
{
  // One more of each of the four the foe holds as the hit lands.
  const name = "Festering idol", effect = "Each hit its holder lands adds one more stack of each of Burn, Chill, Shock and Bleed that its target already holds.";
  offhand("idol", "rare", name, {
    effect, stats: [sp("siphon", "medium"), st("attack", 2)],
    statuses: [own_(name, effect, { reactions: FOUR.map((s) => reactIf(EV.hit, { unit: "other", where: { has: s } }, give(s, "other", FLAT_STACKS.one))) })],
    serves: "Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts ●● ⚙ every colour (half)",
  });
}
{
  // A Weaken the holder applied (`other: holder` on the foe's status_gained).
  const name = "Idol of binding", effect = "Foes its holder Weakens are also Slowed, and its hits on a foe that's both deal double.";
  offhand("idol", "rare", name, {
    effect, stats: [sp("siphon", "medium"), st("attack", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, {
      reactions: [react(on("status_gained", { whose: "foe", status: "weaken", other: "holder" }), give("slow", "owner"))],
      boosts: hits(against(100, { has: ["weaken", "slow"] })),
    })],
    serves: "Toll ●●, foes do less",
  });
}
{
  // The newest buff a foe can lose, moved with its stacks and time left; the enemy-only Bulwark stays.
  const name = "Idol of the hungry dark";
  const effect = "Every so often, it takes one buff from a random foe with a buff and gives it to its holder, with its stacks and the time it has left. Never Bulwark.";
  const b = beatHalfway(id(name), name, [{ op: "remove", label: "buff", count: 1, move: true, except: ["bulwark"], to: { side: "foes", where: { buffs: true }, pick: "random" } }]);
  offhand("idol", "legendary", name, {
    effect, stats: [sp("siphon", "high"), st("max_hp", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: b.reactions }), ...b.statuses],
    serves: "exotic",
  });
}
{
  const name = "Idol of the deep";
  const effect = "Damage that would reach its holder's HP comes out of its MP instead, point for point, while it has any; a Shield still takes the damage first. MP it gains past its full pool becomes a Shield on it, point for point.";
  offhand("idol", "legendary", name, {
    effect, stats: [sp("siphon", "high"), st("max_mp", 2)],
    statuses: [own_(name, effect, { soak: "mp", reactions: [react(on("mp_over"), give("shield", "holder", ofAmount(1)))] })],
    serves: "Barrage 3 ●●, Pact ●● ⚙ mana as armour (key)",
  });
}
{
  const name = "Idol of the blood-well", effect = "Each time its holder pays HP, the ally with the least MP regains as much MP.";
  offhand("idol", "legendary", name, {
    effect, stats: [sp("siphon", "medium"), st("max_hp", 2), sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("hp_paid"), { op: "mp", amount: ofAmount(1), to: TO.leastMpAlly })] })],
    serves: "Barrage ●●●, Pact ●● ⚙ blood mage (half)",
  });
}

// ─── Vial ──

offhand("vial", "common", "Red tincture", { stats: [sp("lifesteal", "medium")], serves: "Blood Pact." });
offhand("vial", "common", "Hemlock phial", { stats: [critStep(1)], serves: "Thousand Cuts and the Hunt." });

{
  const name = "Crimson dregs", effect = "Its holder's hits on a bleeding foe heal its holder for a fifth of their damage.";
  offhand("vial", "uncommon", name, {
    effect, stats: [sp("lifesteal", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.hit, { unit: "other", where: { has: "bleed" } }, { op: "heal", amount: ofAmount(0.2), to: "holder" })] })],
    serves: "Cuts 1 ●●, Pact 1 ●● ⚙ red stone (half)",
  });
}
{
  const name = "Lancet phial", effect = "When each fight starts, every foe gains a few Bleed (from its holder's Attack).";
  offhand("vial", "uncommon", name, {
    effect, stats: [sp("lifesteal", "medium"), critStep(1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("bleed", TO.everyFoe, own("few", "attack")))] })],
    serves: "Cuts 1 ●● ⚙ red rain (half), opening again (half), every colour (half)",
  });
}
{
  // The HP price is a share of the cost as it stands after the half: twice that is the full cost.
  const name = "Blood vial", effect = "Its holder's abilities cost half their MP, plus HP equal to their full cost. The price never takes it below 1 HP.";
  offhand("vial", "rare", name, {
    effect, stats: [sp("lifesteal", "medium"), st("max_hp", 2)],
    statuses: [own_(name, effect, { mods: [{ mp: -50, hp: { pct: 200 } }] })],
    serves: "Pact 2 ●●●, Barrage ● ⚙ brink (key), blood mage (half)",
  });
}
{
  // What the wound closes under its holder's hit is put back: d/(1−d) of what the foe holds, the same whichever reads first.
  const name = "Venom vial";
  const effect = "A foe's Bleed doesn't close under its holder's hits: the wound pays for the hit and stays as deep as it was. It still closes under everyone else's.";
  const back = STATUS.bleed.drop / (1 - STATUS.bleed.drop);
  offhand("vial", "rare", name, {
    effect, stats: [sp("lifesteal", "medium"), critStep(1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.hit, { unit: "other", where: { has: "bleed" } }, give("bleed", "other", stacksOf("bleed", back, "target"), { rider: false }))] })],
    serves: "Cuts 2 ●●●, Hunt ●",
  });
}
{
  // A cap at half as the fight truly starts, lifted at once: what's above half is lost, and isn't damage or a price.
  const name = "Ravening draught", cut = `${id(name)}_cut`, on_ = `${id(name)}_on`;
  const effect = "Its holder starts every fight at half its max HP, and its Lifesteal is doubled until it's healed to full. The HP it starts without isn't damage, and isn't a price paid.";
  offhand("vial", "rare", name, {
    effect, stats: [sp("lifesteal", "medium"), st("max_hp", 1), st("attack", 1)],
    statuses: [
      own_(name, effect, { reactions: [atFirstStart(give(cut), lift(cut, "holder", "marker"), give(on_)), reactIf(on("healed"), { side: "self", where: { hpAtLeast: 100 } }, lift(on_))] }),
      marker(cut, "Ravening", "Starts the fight at half its max HP.", { healCap: 50 }),
      state(on_, "RAVENING", "Its Lifesteal is doubled until it's healed to full.", { unremovable: true, stats: [{ stat: "lifesteal", flat: share(1, "lifesteal"), live: true }] }),
    ],
    serves: "Pact 2 ●●●, Cuts ● ⚙ brink (key)",
  });
}
{
  // Its own Lifesteal, healed and past full, given to every other ally as healing that goes no further.
  const name = "Heartsblood";
  const effect = "Whatever its holder's Lifesteal would heal it for, full or not, every other ally is healed for the same. Healing given this way isn't passed on again.";
  const pass = { op: "heal" as const, amount: ofAmount(1), final: true as const, to: TO.otherAllies };
  offhand("vial", "legendary", name, {
    effect, stats: [sp("lifesteal", "high"), st("max_hp", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("healed", { status: "lifesteal" }), pass), react(on("overhealed", { status: "lifesteal" }), pass)] })],
    serves: "Pact 3 ●●●, Cuts ●● ⚙ red stone (half)",
  });
}

// ─── Trophy ──

offhand("trophy", "common", "Wolf pelt", { stats: [sp("crit_damage", "medium")], serves: "the Hunt, and Landslide's crits." });
offhand("trophy", "common", "Geode", { stats: [st("defense", 1)], serves: "Landslide." });

{
  const name = "Hunter's skull", effect = "Each killing blow its holder lands gives it 3 Heat (it acts 5% faster in everything for each Heat, up to 10, for the rest of the fight).";
  offhand("trophy", "uncommon", name, {
    effect, stats: [sp("crit_damage", "medium"), critStep(1)],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, give("heat", "holder", 3))] })],
    serves: "Hunt 1 ●●, Cuts ● ◆ kill-pays",
  });
}
{
  const name = "Eagle feather", effect = "Its holder's crits Slow their target.";
  offhand("trophy", "uncommon", name, {
    effect, stats: [sp("crit_damage", "medium"), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.crit, give("slow", "other"))] })],
    serves: "foes do less, Hunt ●, Snap ●",
  });
}
{
  const name = "Vulture's skull", effect = "Its holder's hits on a Stunned foe crit 80% of the time, whatever its holder's Crit chance. Nothing raises that chance.";
  offhand("trophy", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), st("defense", 1), st("attack", 1)],
    statuses: [own_(name, effect, { crits: [{ when: { has: "stun" }, set: 80 }] })],
    serves: "Landslide 2 ●●●, Snap 2 ●●●, Hunt ●● ⚙ emptied quiver (half) ◆ held",
  });
}
{
  const name = "Ogre's tusk", effect = "Its holder's hits on the foe with the highest current HP deal half again as much.";
  offhand("trophy", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), st("defense", 1), critStep(1)],
    statuses: [own_(name, effect, { boosts: hits(against(50, { topHp: true })) })],
    serves: "Landslide 2 ●●●",
  });
}
{
  const name = "Dragon's tooth";
  const effect = "A third of the damage of each crit its holder lands lands a second time on the same foe, at once. The second landing takes no new roll to dodge or to crit, and nothing repeats it.";
  offhand("trophy", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), critStep(1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { tags: ["crit"], notTags: ["bare"] }), { op: "strike", of: "dealt", share: 100 / 3, to: "other" })] })],
    serves: "Landslide ●●, Hunt ●●, Cuts ●●",
  });
}
{
  const name = "The king's head", crowned = `${id(name)}_on`;
  const effect = "When its holder lands a killing blow, every ally's Crit chance is doubled for 20 ticks, up to 80%.";
  offhand("trophy", "legendary", name, {
    effect, stats: [sp("crit_damage", "high"), critStep(1), sp("accuracy", "medium")],
    statuses: [
      own_(name, effect, { reactions: [react(EV.kill, give(crowned, TO.everyAlly))] }),
      given(crowned, "CROWNED", "Crit chance doubled, up to 80%.", { show: "icon", unremovable: undefined, duration: 20, crits: [{ times: 2, cap: 80 }] }),
    ],
    serves: "Hunt 3 ●●●, Landslide ●● ⚙ emptied quiver (half) ◆ kill-pays",
  });
}

// ─── Bell ──

offhand("bell", "common", "Prayer bell", { stats: [sp("attack_speed", "medium")], serves: "Thousand Cuts and the Storm." });
offhand("bell", "common", "Cantor's bell", { stats: [st("mp_regen", 1)], serves: "Barrage." });

{
  // The fourth landed basic attack rings before the count takes it; the ring's hits are bonus hits, which the count never hears.
  const name = "Ringing bell", n = `${id(name)}_count`;
  const effect = "Every fourth basic attack its holder lands rings: a light hit on every foe (from its holder's Attack), carrying what the swing carries. The ring's hits aren't counted, and nothing repeats them.";
  offhand("bell", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), st("attack", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          reactIf(EV.basic, { side: "self", where: countAt(n, 3) }, { op: "strike", amount: share(HIT.light, "attack"), carry: true, tag: "ring", to: TO.everyFoe }),
          react(EV.basic, give(n, "holder", 1)),
        ],
      }),
      count(n, "RING", "Every fourth basic attack it lands rings.", 4),
    ],
    serves: "Storm 1 ●●, Cuts 1 ●● ⚙ red rain (half), reaping (half) ◆ wide-hit",
  });
}
{
  const name = "Pacer's bell", effect = "Each time its holder casts an ability, it's Hasted.";
  offhand("bell", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.cast, give("haste"))] })],
    serves: "Cuts 1 ●●, Storm ●, Barrage ●",
  });
}
{
  const name = "Bell of the hour", n = `${id(name)}_count`;
  const effect = "Every fifth basic attack its holder lands casts its first-slotted ability at once, whatever its cooldown, with no wind-up. Its cooldown stays where it was, and its MP is paid.";
  offhand("bell", "rare", name, {
    effect, stats: [sp("attack_speed", "medium"), st("mp_regen", 2)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(EV.basic, { side: "self", where: countAt(n, 4) }, { op: "recast", which: "first", paid: true }), react(EV.basic, give(n, "holder", 1))] }),
      count(n, "HOUR", "Every fifth basic attack it lands casts its first-slotted ability.", 5),
    ],
    serves: "Cuts 2 ●●●, Barrage 2 ●●● ⚙ spell on the swing (key)",
  });
}
{
  // Each beat rings once: with no ally Silenced it lifts a debuff from the ally with the most; with one Silenced, that Silence.
  // The order of the two answers keeps it to one: the first can't make a Silence, and the second waits on one.
  const name = "Warding bell", ring = `${id(name)}_ring`;
  const effect = "Every so often, it lifts one debuff from the ally holding the most debuffs. A Silence comes first: while any ally is Silenced, it lifts that.";
  const b = beatHalfway(id(name), name, [give(ring)]);
  const silenced = { side: "allies" as const, where: { has: "silence" } };
  offhand("bell", "rare", name, {
    effect, stats: [sp("attack_speed", "medium"), st("mp_regen", 1), sp("evasion", "medium")],
    statuses: [
      own_(name, effect, {
        reactions: [
          ...b.reactions,
          reactIf(on("status_gained", { status: ring }), { ...silenced, atMost: 0 }, { op: "remove", label: "debuff", count: 1, to: { side: "allies", where: { debuffs: true }, pick: "highest", by: "debuffs" } }),
          reactIf(on("status_gained", { status: ring }), silenced, { op: "remove", label: "debuff", status: "silence", to: { side: "allies", where: { has: "silence" }, pick: "random" } }),
        ],
      }),
      ...b.statuses,
      marker(ring, "Warding bell (ring)", "Its beat."),
    ],
    serves: "Barrage ●●, Toll ●",
  });
}
{
  const name = "Tireless bell", effect = "Its holder's basic attacks never wait on its abilities: it keeps swinging through their wind-ups and their recoveries.";
  offhand("bell", "legendary", name, {
    effect, stats: [sp("attack_speed", "high"), sp("double_strike", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { tireless: true })],
    serves: "exotic, Storm ●●, Cuts ●●, Barrage ●●",
  });
}

// ─── Cloak ──

offhand("cloak", "common", "Traveller's cloak", { stats: [sp("evasion", "medium")], serves: "the Toll's dancer, Thousand Cuts and the Hunt: Evasion is the cloak's first stat on all three." });
offhand("cloak", "common", "Swallowtail cloak", { stats: [sp("attack_speed", "medium")], serves: "Thousand Cuts." });

{
  const name = "Hooded cloak", effect = "Each time its holder dodges a hit, it gains a Shield of a sixth of its Attack.";
  offhand("cloak", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, give("shield", "holder", share(HIT.touch, "attack")))] })],
    serves: "Toll 1 ●●, Cuts ● ⚙ riposte (half), detonation (half) ◆ shield-by-doing",
  });
}
{
  const name = "Feathered cloak", done = `${id(name)}_used`, effect = "The first time each fight its holder drops below half its max HP, it's Hidden.";
  offhand("cloak", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), critStep(1)],
    statuses: [own_(name, effect, { reactions: [onceBelow(50, done, give("hidden"))] }), used(done, "FEATHERED CLOAK")],
    serves: "net, Hunt ● ⚙ two in the dark (half)",
  });
}
{
  const name = "Matador's cape", effect = "Each time its holder dodges a hit, it Taunts.";
  offhand("cloak", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, give("taunt"))] })],
    serves: "Toll 1 ●●, Cuts ● ⚙ riposte (half) ◆ draw",
  });
}
{
  const name = "Dancer's cloak", effect = "Each time its holder dodges a hit, its ability nearest to ready is ready at once.";
  offhand("cloak", "rare", name, {
    effect, stats: [sp("evasion", "medium"), st("defense", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, { op: "cooldown", which: "soonest", set: "ready", to: "holder" })] })],
    serves: "Toll 2 ●●, Cuts 2 ●●, Barrage ●",
  });
}
{
  // The swing made ready carries a state whose basic hits land a second time (bare, so nothing repeats them); the swing spends it.
  const name = "Tempest cloak", on_ = `${id(name)}_on`;
  const effect = "Each time its holder dodges a hit, its next basic attack comes at once and lands twice. The second landing is the same damage again on the same foe, and nothing repeats it.";
  offhand("cloak", "rare", name, {
    effect, stats: [sp("evasion", "medium"), sp("attack_speed", "medium"), st("attack", 1)],
    statuses: [
      own_(name, effect, { reactions: [react(EV.dodge, swingNow(), give(on_))] }),
      oneUse(on_, "TEMPEST", "Its next basic attack lands twice.", EV.swing, { reactions: [react(on("hit_lands", { kind: "basic", notTags: ["bare"] }), { op: "strike", of: "dealt", to: "other" })] }),
    ],
    serves: "Toll 2 ●●●, Cuts 2 ●●● ⚙ riposte (key)",
  });
}
{
  const name = "Shadow cloak", effect = "Its holder is Hidden when each fight starts, and again each time a foe falls.";
  offhand("cloak", "rare", name, {
    effect, stats: [sp("evasion", "medium"), critStep(1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("hidden")), react(EV.fall, give("hidden"))] })],
    serves: "exotic, Hunt ●● ⚙ two in the dark (key) ◆ kill-pays",
  });
}
{
  // An HP floor from the fight's true start, spent on the first blow it holds; the holder goes Hidden as it's spent.
  const name = "Swan's grace", floor = `${id(name)}_floor`, effect = "Once a fight, damage that would knock its holder out leaves it at 1 HP and Hidden.";
  offhand("cloak", "legendary", name, {
    effect, stats: [sp("evasion", "high"), st("attack", 1), critStep(1)],
    statuses: [
      own_(name, effect, { reactions: [atFirstStart(give(floor)), react(on("status_ended", { status: floor, cause: ["spent"] }), give("hidden"))] }),
      state(floor, "SWAN'S GRACE", "The next blow that would knock it out leaves it at 1 HP.", { show: "sheet", unremovable: true, floor: { spend: true } }),
    ],
    serves: "net ⚙ two in the dark (half)",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
