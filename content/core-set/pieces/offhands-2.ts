/**
 * Seven offhand kinds' pieces: tome, orb, idol, vial, trophy, bell and cloak. Each carries the standard budget of steps at
 * its rarity, exactly (kit.ts piece). Statuses are at their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { StatusT } from "../../../src/schema.js";
import { FLAT_STACKS, HIT, STATUS } from "../scale.js";
import { COUNTER, CRESCENDO } from "./shared.js";
import { EV, TO, against, atFirstStart, atStart, beatHalfway, count, countAt, critStep, give, hits, lift, marker, ofAmount, on, onceBelow, oneUse, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, state, swingNow, swingStacks, used, type Change, type Rarity } from "./kit.js";

const S = shelf();

/** One offhand of a kind: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function offhand(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; statuses?: StatusT[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "offhand", rarity, effect: o.effect, stats: o.stats, statuses: statuses.filter((s) => s.id === id(name)).map((s) => s.id) }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** A share as a card prints it: 0.17 is 17. */
const pct = (r: number) => Math.round(r * 100);
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
  const name = "Snowbound folio", effect = "At fight start: a few Chill on every foe (from Attack).";
  offhand("tome", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("chill", TO.everyFoe, own("few", "attack")))] })],
    serves: "Snap 1 ●● ⚙ opening again (half), every colour (half), firecracker (half)",
  });
}
{
  // A change's rule that finds nobody leaves the ability its own.
  const name = "Marginalia";
  const effect = "Single-target abilities aim at a foe winding up instead, unless a Taunt pulls them.";
  offhand("tome", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { mods: [{ of: { single: true }, target: { side: "foes", where: { casting: true }, pick: "highest", by: { stats: ["attack"] } } }] })],
    serves: "stops a cast, Snap ●, Toll ●",
  });
}
{
  const name = "Curse-book", effect = "Abilities add several Bleed to every foe hit (from Attack).";
  offhand("tome", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { mods: [{ apply: [{ status: "bleed", stacks: swingStacks("several") }] }] })],
    serves: "Cuts 1 ●● ⚙ red rain (half), every colour (half)",
  });
}
{
  const name = "Primer of frost", effect = "Chill it adds is +10% per Chill the foe already holds.";
  offhand("tome", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 2)],
    statuses: [own_(name, effect, { boosts: [{ tag: "chill", pct: { scale: [{ ratio: 10, stacks: "chill", of: "target" }] } }] })],
    serves: "Snap 2 ●●●",
  });
}
{
  // The third of its own casts is cast again, free (a free repeat isn't counted, so it's never cast again).
  const name = "Twice-told tome", n = `${id(name)}_count`;
  const effect = "Every second ability it casts is cast again at once, free.";
  offhand("tome", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), sp("cast_speed", "medium"), st("max_mp", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(OWN_CAST, { side: "self", where: countAt(n, 1) }, { op: "recast" }), react(OWN_CAST, give(n, "holder", 1))] }),
      count(n, "TWICE-TOLD", "Every second ability is cast twice.", 2),
    ],
    serves: "Barrage 2 ●●●, Snap ●●, Landslide ● ⚙ crescendo (half) ◆ free-cast",
  });
}
{
  const name = "Grimoire of plagues";
  const effect = "At fight start: a few of two random statuses of Burn, Chill, Shock and Bleed on every foe (from Attack).";
  offhand("tome", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "one", of: FOUR.map((status) => ({ status, stacks: own("few", "attack") })), count: 2, same: true, to: TO.everyFoe })] })],
    serves: "Bonfire ●●, Snap ●●, Storm ●●, Cuts ●● ⚙ every colour (key), opening again (half)",
  });
}
{
  const name = "Accompanist's score", free = `${id(name)}_free`;
  const effect = "Next ability free whenever the other ally with the most Attack pays for one.";
  offhand("tome", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), st("attack", 1), st("max_mp", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("action_resolve", { kind: "ability", paid: true, whose: "ally" }), { unit: "owner", where: { top: { stats: ["attack"], others: true } } }, give(free))] }),
      oneUse(free, "ACCOMPANIED", "Next ability free.", on("action_resolve", { kind: "ability" }), { mods: [{ mp: -100 }] }),
    ],
    serves: "Barrage 2 ●● ⚙ crescendo (half) ◆ free-cast",
  });
}
{
  // Untyped damage of all its HP and Shield: not a hit. Every fall it causes checks again.
  const name = "Last page", effect = "When a foe falls, foes below 10% HP fall too.";
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
  const name = "Annotated grimoire", free = `${id(name)}_free`, effect = "Each ability it pays for makes the next one any ally casts free.";
  offhand("tome", "legendary", name, {
    effect, stats: [sp("cooldown", "high"), st("max_mp", 1), st("mp_regen", 1)],
    statuses: [
      own_(name, effect, { reactions: [react(on("action_resolve", { kind: "ability", paid: true }), give(free, TO.everyAlly))] }),
      marker(free, "Free cast", "Next ability free.", {
        mods: [{ mp: -100 }],
        reactions: [react(on("action_resolve", { kind: "ability" }), lift(free, TO.everyAlly, "marker"))],
      }),
    ],
    serves: "Barrage 3 ●●● ⚙ crescendo (half) ◆ free-cast",
  });
}
{
  const name = "Frozen tome", effect = "Each shatter halves the wait on every ally's first-slotted ability.";
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
  const name = "Scrying orb", effect = "At fight start: its nearest-ready ability is ready.";
  offhand("orb", "uncommon", name, {
    effect, stats: [st("max_mp", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "cooldown", which: "soonest", set: "ready", to: "holder" })] })],
    serves: "Barrage 1 ●, Hunt 1 ●, first move ⚙ opening again (half)",
  });
}
{
  const name = "Mana pearl", effect = "When a foe falls: regains 15% of max MP.";
  offhand("orb", "uncommon", name, {
    effect, stats: [st("max_mp", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.fall, { op: "mp", amount: share(0.15, "max_mp"), to: "holder" })] })],
    serves: "Barrage 1 ●●, Bonfire ● ⚙ resonance (half) ◆ kill-pays, free-cast",
  });
}
{
  const name = "Meltwater orb", effect = "Each shatter: regains 10% of max MP.";
  offhand("orb", "rare", name, {
    effect, stats: [st("max_mp", 1), st("attack", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.shatter, { op: "mp", amount: share(0.1, "max_mp"), to: "holder" })] })],
    serves: "Snap 2 ●●●, Barrage 2 ●● ⚙ frozen gate (half), resonance (half) ◆ free-cast",
  });
}
{
  const name = "Smouldering orb";
  const effect = "When a burning foe falls: every other foe gains 33% of its Burn.";
  offhand("orb", "rare", name, {
    effect, stats: [st("max_mp", 1), st("attack", 1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [{ on: on("status_ended", { status: "burn", cause: ["ko"], whose: "foe" }), split: "fire", do: [give("burn", TO.otherFoes("owner"), ofAmount(1 / 3))] }] })],
    serves: "Bonfire 2 ●●●, Hunt ● ⚙ fuse (key)",
  });
}
{
  const name = "Orb of the deep", effect = "Damage that would reach its HP hits its MP instead.";
  offhand("orb", "rare", name, {
    effect, stats: [st("max_mp", 2), st("mp_regen", 1)],
    statuses: [own_(name, effect, { soak: "mp" })],
    serves: "Barrage 2 ●●●, Pact ● ⚙ mana as armour (key)",
  });
}
{
  const name = "Orb of the rising sun";
  const effect = `Each cast gives that ability a Crescendo (+${COUNTER.crescendo.pct}% damage, healing and stacks each, up to ${CRESCENDO.cap}).`;
  offhand("orb", "legendary", name, {
    effect, stats: [st("max_mp", 1), sp("cooldown", "high"), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { mods: [{ damage: 20, heal: 20, stacks: { pct: 20 }, times: CRESCENDO }] })],
    serves: "Barrage 3 ●●●, Bonfire ●● ⚙ crescendo (key)",
  });
}
{
  const name = "The deep well", effect = "Abilities are free while it has Clarity.";
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
  const name = "Fanged idol", mark = `${id(name)}_mark`, effect = "First hit on each foe Rots it.";
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
  const name = "Leech idol", effect = "MP it gains past full goes to the ally with the least MP.";
  offhand("idol", "uncommon", name, {
    effect, stats: [sp("siphon", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("mp_over"), { op: "mp", amount: ofAmount(1), to: TO.leastMpAlly })] })],
    serves: "Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast",
  });
}
{
  // The casting foe is marked, and the swing made ready aims at a marked foe past any Taunt; the swing lifts both.
  const name = "Hushing idol", mark = `${id(name)}_mark`, aim = `${id(name)}_on`;
  const effect = "When a foe winds up: attacks it at once, ignoring Taunt.";
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
      oneUse(aim, "HUSH", "Next basic attack goes at the foe winding up, ignoring Taunt.", EV.swing, { aim: { rule: { side: "foes", where: { has: mark } }, first: true }, seek: "basic" }),
    ],
    serves: "stops a cast, Toll ●●, Snap ●",
  });
}
{
  // One more of each of the four the foe holds as the hit lands.
  const name = "Festering idol", effect = "Hits add 1 more of each Burn, Chill, Shock and Bleed the foe holds.";
  offhand("idol", "rare", name, {
    effect, stats: [sp("siphon", "medium"), st("attack", 2)],
    statuses: [own_(name, effect, { reactions: FOUR.map((s) => reactIf(EV.hit, { unit: "other", where: { has: s } }, give(s, "other", FLAT_STACKS.one))) })],
    serves: "Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts ●● ⚙ every colour (half)",
  });
}
{
  // A Weaken the holder applied (`other: holder` on the foe's status_gained).
  const name = "Idol of binding", effect = "Foes it Weakens are Slowed too. Hits on them deal double.";
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
  const effect = "Every so often: steals a buff from a random foe, never Bulwark.";
  const b = beatHalfway(id(name), name, [{ op: "remove", label: "buff", count: 1, move: true, except: ["bulwark"], to: { side: "foes", where: { buffs: true }, pick: "random" } }]);
  offhand("idol", "legendary", name, {
    effect, stats: [sp("siphon", "high"), st("max_hp", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: b.reactions }), ...b.statuses],
    serves: "exotic",
  });
}
{
  const name = "Idol of the deep";
  const effect = "Damage that would reach its HP hits its MP instead. MP gained past full becomes a Shield.";
  offhand("idol", "legendary", name, {
    effect, stats: [sp("siphon", "high"), st("max_mp", 2)],
    statuses: [own_(name, effect, { soak: "mp", reactions: [react(on("mp_over"), give("shield", "holder", ofAmount(1)))] })],
    serves: "Barrage 3 ●●, Pact ●● ⚙ mana as armour (key)",
  });
}
{
  const name = "Idol of the blood-well", effect = "When it pays HP: the ally with the least MP gains as much.";
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
  const name = "Crimson dregs", effect = "Hits on bleeding foes heal 20% of the damage.";
  offhand("vial", "uncommon", name, {
    effect, stats: [sp("lifesteal", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.hit, { unit: "other", where: { has: "bleed" } }, { op: "heal", amount: ofAmount(0.2), to: "holder" })] })],
    serves: "Cuts 1 ●●, Pact 1 ●● ⚙ red stone (half)",
  });
}
{
  const name = "Lancet phial", effect = "At fight start: a few Bleed on every foe (from Attack).";
  offhand("vial", "uncommon", name, {
    effect, stats: [sp("lifesteal", "medium"), critStep(1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("bleed", TO.everyFoe, own("few", "attack")))] })],
    serves: "Cuts 1 ●● ⚙ red rain (half), opening again (half), every colour (half)",
  });
}
{
  // The HP price is a share of the cost as it stands after the half: twice that is the full cost.
  const name = "Blood vial", effect = "Abilities cost half their MP, plus HP equal to their full cost.";
  offhand("vial", "rare", name, {
    effect, stats: [sp("lifesteal", "medium"), st("max_hp", 2)],
    statuses: [own_(name, effect, { mods: [{ mp: -50, hp: { pct: 200 } }] })],
    serves: "Pact 2 ●●●, Barrage ● ⚙ brink (key), blood mage (half)",
  });
}
{
  // What the wound closes under its holder's hit is put back: d/(1−d) of what the foe holds, the same whichever reads first.
  const name = "Venom vial";
  // Each hit's third closes, then a fifth of what's left goes back on: 2/3 × 6/5 = 4/5 stays, so the wound closes a fifth. Fresh
  // Bleed the hit itself lays is in what's left, so the share back stays well under a half (at a half the wound grows without end).
  const effect = `Its hits close a foe's Bleed by 20%, not the usual ${pct(STATUS.bleed.drop)}%.`;
  const back = 0.2;
  offhand("vial", "rare", name, {
    effect, stats: [sp("lifesteal", "medium"), critStep(1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.hit, { unit: "other", where: { has: "bleed" } }, give("bleed", "other", stacksOf("bleed", back, "target"), { rider: false }))] })],
    serves: "Cuts 2 ●●●, Hunt ●",
  });
}
{
  // A cap at half as the fight truly starts, lifted at once: what's above half is lost, and isn't damage or a price.
  const name = "Ravening draught", cut = `${id(name)}_cut`, on_ = `${id(name)}_on`;
  const effect = "Starts every fight down at half HP. Lifesteal doubled until healed to full.";
  offhand("vial", "rare", name, {
    effect, stats: [sp("lifesteal", "medium"), st("max_hp", 1), st("attack", 1)],
    statuses: [
      own_(name, effect, { reactions: [atFirstStart(give(cut), lift(cut, "holder", "marker"), give(on_)), reactIf(on("healed"), { side: "self", where: { hpAtLeast: 100 } }, lift(on_))] }),
      marker(cut, "Ravening", "Starts at half HP.", { healCap: 50 }),
      state(on_, "RAVENING", "Lifesteal doubled until healed to full.", { unremovable: true, stats: [{ stat: "lifesteal", flat: share(1, "lifesteal"), live: true }] }),
    ],
    serves: "Pact 2 ●●●, Cuts ● ⚙ brink (key)",
  });
}
{
  // Half its own Lifesteal, healed and past full, given to every other ally as healing that goes no further. At the same amount,
  // one drinker kept a whole party full.
  const name = "Heartsblood";
  const effect = "Its Lifesteal also heals every other ally for half, even past full.";
  const pass = { op: "heal" as const, amount: ofAmount(0.5), final: true as const, to: TO.otherAllies };
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
  const name = "Hunter's skull", effect = `On a kill: gains 3 Heat (${COUNTER.heat.speed}% faster each, up to ${COUNTER.heat.cap}).`;
  offhand("trophy", "uncommon", name, {
    effect, stats: [sp("crit_damage", "medium"), critStep(1)],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, give("heat", "holder", 3))] })],
    serves: "Hunt 1 ●●, Cuts ● ◆ kill-pays",
  });
}
{
  const name = "Eagle feather", effect = "Crits Slow their target.";
  offhand("trophy", "uncommon", name, {
    effect, stats: [sp("crit_damage", "medium"), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.crit, give("slow", "other"))] })],
    serves: "foes do less, Hunt ●, Snap ●",
  });
}
{
  const name = "Vulture's skull", effect = "Hits on Stunned foes have exactly 80% Crit chance.";
  offhand("trophy", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), st("defense", 1), st("attack", 1)],
    statuses: [own_(name, effect, { crits: [{ when: { has: "stun" }, set: 80 }] })],
    serves: "Landslide 2 ●●●, Snap 2 ●●●, Hunt ●● ⚙ emptied quiver (half) ◆ held",
  });
}
{
  const name = "Ogre's tusk", effect = "+50% damage to the foe with the most HP.";
  offhand("trophy", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), st("defense", 1), critStep(1)],
    statuses: [own_(name, effect, { boosts: hits(against(50, { topHp: true })) })],
    serves: "Landslide 2 ●●●",
  });
}
{
  const name = "Dragon's tooth";
  const effect = "Each crit lands again for 33% of its damage.";
  offhand("trophy", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), critStep(1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { tags: ["crit"], notTags: ["bare"] }), { op: "strike", of: "dealt", share: 100 / 3, to: "other" })] })],
    serves: "Landslide ●●, Hunt ●●, Cuts ●●",
  });
}
{
  const name = "The king's head", crowned = `${id(name)}_on`;
  const effect = "On a kill: every ally's Crit chance doubles for 20 ticks (up to 80%).";
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
  const effect = `Every 4th basic attack landed also hits every foe (${pct(HIT.light)}% of Attack), effects included.`;
  offhand("bell", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), st("attack", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          reactIf(EV.basic, { side: "self", where: countAt(n, 3) }, { op: "strike", amount: share(HIT.light, "attack"), carry: true, tag: "ring", to: TO.everyFoe }),
          react(EV.basic, give(n, "holder", 1)),
        ],
      }),
      count(n, "RING", "Every 4th basic attack rings.", 4),
    ],
    serves: "Storm 1 ●●, Cuts 1 ●● ⚙ red rain (half), reaping (half) ◆ wide-hit",
  });
}
{
  const name = "Pacer's bell", effect = "After each ability: gains Haste.";
  offhand("bell", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.cast, give("haste"))] })],
    serves: "Cuts 1 ●●, Storm ●, Barrage ●",
  });
}
{
  const name = "Bell of the hour", n = `${id(name)}_count`;
  const effect = "Every 4th landed basic attack casts its first-slotted ability, cooldown or not; it pays the MP.";
  offhand("bell", "rare", name, {
    effect, stats: [sp("attack_speed", "medium"), st("mp_regen", 2)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(EV.basic, { side: "self", where: countAt(n, 3) }, { op: "recast", which: "first", paid: true }), react(EV.basic, give(n, "holder", 1))] }),
      count(n, "HOUR", "Every 4th basic attack casts its first-slotted ability.", 4),
    ],
    serves: "Cuts 2 ●●●, Barrage 2 ●●● ⚙ spell on the swing (key)",
  });
}
{
  // Each beat rings once: with no ally Silenced it lifts a debuff from the ally with the most; with one Silenced, that Silence.
  // The order of the two answers keeps it to one: the first can't make a Silence, and the second waits on one.
  const name = "Warding bell", ring = `${id(name)}_ring`;
  const effect = "Every so often: lifts a debuff from the most-debuffed ally, Silence first.";
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
  const name = "Tireless bell", effect = "Keeps swinging through its abilities' wind-ups and recoveries.";
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
  const name = "Hooded cloak", effect = `On a dodge: gains a Shield (${pct(HIT.touch)}% of Attack).`;
  offhand("cloak", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, give("shield", "holder", share(HIT.touch, "attack")))] })],
    serves: "Toll 1 ●●, Cuts ● ⚙ riposte (half), detonation (half) ◆ shield-by-doing",
  });
}
{
  const name = "Feathered cloak", done = `${id(name)}_used`, effect = "Once a fight, below half HP: goes Hidden.";
  offhand("cloak", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), critStep(1)],
    statuses: [own_(name, effect, { reactions: [onceBelow(50, done, give("hidden"))] }), used(done, "FEATHERED CLOAK")],
    serves: "net, Hunt ● ⚙ two in the dark (half)",
  });
}
{
  const name = "Matador's cape", effect = "On a dodge: Taunts.";
  offhand("cloak", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, give("taunt"))] })],
    serves: "Toll 1 ●●, Cuts ● ⚙ riposte (half) ◆ draw",
  });
}
{
  const name = "Dancer's cloak", effect = "On a dodge: its nearest-ready ability is ready.";
  offhand("cloak", "rare", name, {
    effect, stats: [sp("evasion", "medium"), st("defense", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, { op: "cooldown", which: "soonest", set: "ready", to: "holder" })] })],
    serves: "Toll 2 ●●, Cuts 2 ●●, Barrage ●",
  });
}
{
  // The swing made ready carries a state whose basic hits land a second time (bare, so nothing repeats them); the swing spends it.
  const name = "Tempest cloak", on_ = `${id(name)}_on`;
  const effect = "On a dodge: next basic attack comes at once and lands twice.";
  offhand("cloak", "rare", name, {
    effect, stats: [sp("evasion", "medium"), sp("attack_speed", "medium"), st("attack", 1)],
    statuses: [
      own_(name, effect, { reactions: [react(EV.dodge, swingNow(), give(on_))] }),
      oneUse(on_, "TEMPEST", "Next basic attack lands twice.", EV.swing, { reactions: [react(on("hit_lands", { kind: "basic", notTags: ["bare"] }), { op: "strike", of: "dealt", to: "other" })] }),
    ],
    serves: "Toll 2 ●●●, Cuts 2 ●●● ⚙ riposte (key)",
  });
}
{
  const name = "Shadow cloak", effect = "Hidden at fight start and whenever a foe falls.";
  offhand("cloak", "rare", name, {
    effect, stats: [sp("evasion", "medium"), critStep(1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("hidden")), react(EV.fall, give("hidden"))] })],
    serves: "exotic, Hunt ●● ⚙ two in the dark (key) ◆ kill-pays",
  });
}
{
  // An HP floor from the fight's true start, spent on the first blow it holds; the holder goes Hidden as it's spent.
  const name = "Swan's grace", floor = `${id(name)}_floor`, effect = "Once a fight: survives a knockout at 1 HP, Hidden.";
  offhand("cloak", "legendary", name, {
    effect, stats: [sp("evasion", "high"), st("attack", 1), critStep(1)],
    statuses: [
      own_(name, effect, { reactions: [atFirstStart(give(floor)), react(on("status_ended", { status: floor, cause: ["spent"] }), give("hidden"))] }),
      state(floor, "SWAN'S GRACE", "Next knockout leaves it at 1 HP.", { show: "sheet", unremovable: true, floor: { spend: true } }),
    ],
    serves: "net ⚙ two in the dark (half)",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
