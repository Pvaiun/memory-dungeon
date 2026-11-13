/**
 * Six weapon kinds' pieces: bow, rune sword, hammer, mace, staff and great weapon. Each kind's pieces carry its budget of
 * stat steps at every rarity (kit.ts budgetOf), and every weapon swings as its kind's plain weapon does unless its card says
 * otherwise. Statuses are at their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { GearT, NumT, StatusT } from "../../../src/schema.js";
import { SO_OFTEN, EV, NO_MARK, TO, against, atStart, count, countAt, critStep, give, hits, lift, marker, ofAmount, on, oneUse, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, swingNow, weaponHit, type Change, type Rarity, type Trade } from "./kit.js";

const S = shelf();

/** One weapon of a kind: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function weapon(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; trade?: Trade; weapon?: GearT["weapon"]; statuses?: StatusT[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "weapon", rarity, effect: o.effect, stats: o.stats, trade: o.trade, weapon: o.weapon, statuses: statuses.filter((s) => s.id === id(name)).map((s) => s.id) }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);
/** "Each ability its wearer casts": a cast that resolves, a repeat included. */
const CAST = EV.cast;

// ─── Bow ──

weapon("bow", "common", "War bow", { stats: [sp("crit_damage", "medium")], serves: "the Hunt (Crit damage)" });
weapon("bow", "common", "Short bow", { stats: [sp("attack_speed", "medium")], serves: "Thousand Cuts (Attack speed)" });

{
  const name = "Broadhead bow", effect = "Its wearer's crits add many Bleed to the foe they land on (from Attack).";
  weapon("bow", "uncommon", name, {
    effect, stats: [sp("crit_damage", "medium"), critStep(1)],
    statuses: [own_(name, effect, { reactions: [react(EV.crit, give("bleed", "other", own("many", "attack")))] })],
    serves: "Cuts 1 ●●, Hunt ● ◆ swing-status",
  });
}
{
  const name = "Opening shot", next = `${id(name)}_on`, effect = "When each fight starts, its wearer's first basic attack comes at once and always crits.";
  weapon("bow", "uncommon", name, {
    effect, stats: [sp("crit_damage", "medium"), st("attack", 1)],
    statuses: [
      own_(name, effect, { reactions: [atStart(swingNow(), give(next))] }),
      oneUse(next, "OPENING SHOT", "Its next basic attack always crits.", EV.swing, { crits: [{ tag: "basic", chance: 100 }] }),
    ],
    serves: "Hunt 1 ●●, Barrage ● ⚙ opening again (half)",
  });
}
{
  const name = "Frostbite bow", effect = "Its basic attacks add several Chill (from Attack).";
  weapon("bow", "uncommon", name, {
    effect, stats: [sp("crit_damage", "medium"), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("chill", "other", own("several", "attack")))] })],
    serves: "Snap 1 ●● ⚙ lead's colour (half) ◆ swing-status",
  });
}
{
  const name = "Huntsman's bow", effect = "While no foe is Marked, its basic attacks Mark their target. Its wearer's hits on a Marked foe deal 33% more.";
  weapon("bow", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), critStep(1), st("attack", 1)],
    statuses: [own_(name, effect, { boosts: hits(against(33, { has: "marked" })), reactions: [reactIf(EV.basic, NO_MARK, give("marked", "other"))] })],
    serves: "Hunt 2 ●●●",
  });
}
{
  // A count of basic attacks made (a dodged one included); the third looses the volley, read as it resolves, before it counts.
  const name = "Volley bow", n = `${id(name)}_count`;
  const effect = "Every third basic attack its wearer makes is a volley: it also looses an arrow at every other foe, each a hit of the basic attack's size, carrying what the swing carries. The volley's arrows aren't basic attacks: they aren't counted, and nothing looses them again.";
  weapon("bow", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), sp("attack_speed", "medium"), st("attack", 1)],
    statuses: [
      own_(name, effect, {
        strike: { to: { side: "foes", pick: "all", exclude: "targets" }, kind: "bonus", carry: true, when: countAt(n, 2), tag: "volley" },
        reactions: [react(EV.swing, give(n, "holder", 1))],
      }),
      count(n, "VOLLEY", "Every third basic attack is a volley.", 3),
    ],
    serves: "Cuts 2 ●●●, Hunt ●, Storm ●, Barrage ● ⚙ red rain (half), reaping (half) ◆ wide-hit",
  });
}
{
  const name = "Executioner's longbow";
  const effect = "Its basic attacks ignore Taunt, and deal more the less HP their target has: 25% more below 75% of its max HP, 50% more below 50%, 75% more below 25%, and 100% more below 10%.";
  weapon("bow", "legendary", name, {
    effect, stats: [sp("crit_damage", "high"), critStep(1), st("attack", 1)],
    statuses: [own_(name, effect, { seek: "basic", boosts: [{ tag: "basic", pct: { scale: [75, 50, 25, 10].map((hpBelow) => ({ ratio: 25, when: { hpBelow }, of: "target" as const })) } }] })],
    serves: "Hunt 3 ●●●",
  });
}

// ─── Rune sword ──

weapon("rune_sword", "common", "Runed saber", { stats: [st("mp_regen", 1)], serves: "Barrage (MP regen)" });
weapon("rune_sword", "common", "Barrow blade", { stats: [st("max_hp", 1)], serves: "Cold Snap, and the Toll's wardens (HP)" });

{
  const name = "Sleet blade", effect = "Its basic attacks add several Chill (from Attack).";
  weapon("rune_sword", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("chill", "other", own("several", "attack")))] })],
    serves: "Snap 1 ●●● ⚙ lead's colour (half) ◆ swing-status",
  });
}
{
  const name = "Sigil blade", effect = "When each fight starts, its wearer gains a Shield of 33% of its max MP.";
  weapon("rune_sword", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("shield", "holder", share(1 / 3, "max_mp")))] })],
    serves: "Barrage ●, Landslide ● ⚙ detonation (half), opening again (half)",
  });
}
{
  const name = "Wellblade", effect = "Each basic attack it lands restores 10% of its wearer's max MP.";
  weapon("rune_sword", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "mp", amount: share(0.1, "max_mp"), to: "holder" })] })],
    serves: "Barrage 1 ●●, Storm ● ◆ free-cast",
  });
}
{
  // The shattered foe's cold, halved, to the other foe that holds the most (by draw where none holds any); passed, so a chain dies down.
  const name = "Winter's chain", effect = "When a foe's Chill shatters, the other foe with the most Chill gains 50% of the Chill the shattered foe held.";
  weapon("rune_sword", "rare", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.shatter, give("chill", { side: "foes", pick: "highest", by: { stacks: "chill" }, exclude: "owner" }, ofAmount(0.5), { passed: true }))] })],
    serves: "Snap 2 ●●● ⚙ firecracker (key)",
  });
}
{
  const name = "Frostward blade", effect = "Foes that hit the ally with the highest Aggro gain several Chill (from its wearer's Attack).";
  weapon("rune_sword", "rare", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 2)],
    statuses: [own_(name, effect, { reactions: [reactIf(on("hit_taken", { whose: "team" }), { unit: "owner", where: { top: { stats: ["aggro"] } } }, give("chill", "other", own("several", "attack")))] })],
    serves: "Toll 2 ●●●, Snap 2 ●● ⚙ frozen gate (key)",
  });
}
{
  // The latest cast's half-cost is held as a tally beside the doubled swing; a second cast replaces both, and the swing spends them.
  const name = "Spellbinder", on_ = `${id(name)}_on`, mp = `${id(name)}_mp`;
  const effect = "After each ability its wearer casts, its next basic attack deals double, and when it lands its wearer regains 50% of the MP that ability cost it. A second cast before the swing takes the first's place; it doesn't add to it.";
  weapon("rune_sword", "rare", name, {
    effect, stats: [st("mp_regen", 1), sp("cooldown", "medium"), st("max_mp", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          react(CAST, lift(mp, "holder", "marker"), give(on_), give(mp, "holder", ofAmount(0.5))),
          reactIf(EV.basic, { side: "self", where: { has: on_ } }, { op: "mp", amount: stacksOf(mp), to: "holder" }),
          react(EV.swing, lift(on_), lift(mp, "holder", "marker")),
        ],
      }),
      { id: on_, name: "SPELLBOUND", text: "Its next basic attack deals double.", label: "buff", show: "icon", stacking: "fizzle", unremovable: true, boosts: [{ tag: "basic", pct: 100 }] },
      marker(mp, "Spellbound MP", "The MP its next basic attack gives back.", { stacking: "intensity" }),
    ],
    serves: "Barrage 2 ●●●, Storm ● ◆ free-cast",
  });
}
{
  const name = "Brimming blade", effect = "Each hit of an ability its wearer casts deals extra damage equal to the MP that cast cost it. A cast that cost no MP adds none.";
  weapon("rune_sword", "legendary", name, {
    effect, stats: [st("mp_regen", 2), st("max_mp", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { adds: [{ on: "ability", amount: { scale: [{ ratio: 1, cost: "mp" }] } }] })],
    serves: "Barrage 3 ●●●",
  });
}
{
  // Cascade is the party's count: each ally keeps its own copy, fed by every shatter.
  const name = "Glacier blade";
  const effect = "Its party counts Cascades (a Cascade for each shatter this fight, up to 10). Its wearer's abilities deal 20% more, and add 20% more Chill and Shock, for each Cascade.";
  weapon("rune_sword", "legendary", name, {
    effect, stats: [st("mp_regen", 1), sp("cooldown", "high"), st("max_hp", 1)],
    statuses: [own_(name, effect, {
      mods: [{ damage: 20, stacks: { pct: 20, statuses: ["chill", "shock"] }, times: { stacks: "cascade" } }],
      reactions: [react(EV.shatter, give("cascade", TO.everyAlly, 1))],
    })],
    serves: "Snap 3 ●●●, Storm ●",
  });
}

// ─── Hammer ──

weapon("hammer", "common", "War hammer", { stats: [st("defense", 1)], serves: "Landslide (Defense)" });
weapon("hammer", "common", "Horseman's hammer", { stats: [st("max_hp", 1), st("aggro", 1)], trade: "light", serves: "the Toll (HP, Aggro)" });

{
  const name = "Warden's hammer", effect = "Its basic attacks deal extra damage equal to 10% of its wearer's Defense.";
  weapon("hammer", "uncommon", name, {
    effect, stats: [st("defense", 1)],
    statuses: [own_(name, effect, { adds: [{ on: "basic", amount: share(0.1, "defense") }] })],
    serves: "Landslide 1 ●●, Toll ● ◆ heavy-blow",
  });
}
{
  const name = "Mason's hammer", effect = "Each basic attack it lands gives its wearer a Shield of 50% of the damage dealt.";
  weapon("hammer", "uncommon", name, {
    effect, stats: [st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("shield", "holder", ofAmount(0.5)))] })],
    serves: "Landslide 1 ●●, Toll ● ⚙ detonation (half) ◆ shield-by-doing",
  });
}
{
  // The third landed basic attack Stuns before the count takes it; a Stun that can't land is lost, and the count starts again.
  const name = "Bellringer", n = `${id(name)}_count`, effect = "Every third basic attack it lands Stuns its target.";
  weapon("hammer", "uncommon", name, {
    effect, trade: "light", stats: [st("defense", 1), st("max_hp", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(EV.basic, { side: "self", where: countAt(n, 2) }, give("stun", "other")), react(EV.basic, give(n, "holder", 1))] }),
      count(n, "BELL", "Every third basic attack it lands Stuns.", 3),
    ],
    serves: "Landslide ●, Snap ●, Storm ● ⚙ held charge (half), emptied quiver (half) ◆ held",
  });
}
{
  const name = "Grudgebearer", effect = "Each hit its wearer takes gives it a Wrath (its next basic attack deals 20% more for each Wrath, up to 10, and spends them).";
  weapon("hammer", "rare", name, {
    effect, stats: [st("defense", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("wrath", "holder", 1))] })],
    serves: "Toll 2 ●●●, Landslide 2 ●●● ⚙ reckoning (key) ◆ heavy-blow",
  });
}
{
  const name = "Mountainfall", effect = "Its basic attacks deal extra damage equal to 20% of its wearer's max HP.";
  const hit = weaponHit("hammer") as Exclude<NumT, number>;
  weapon("hammer", "rare", name, {
    effect, stats: [st("defense", 1), st("max_hp", 1)],
    weapon: { kind: "hammer", amount: { ...hit, scale: [...hit.scale, { ratio: 0.2, stat: "max_hp", of: "self" }] } },
    serves: "Landslide 2 ●●●, Toll ●●, Pact ● ◆ heavy-blow",
  });
}
{
  const name = "Cornerstone hammer", effect = "Its basic attacks deal extra damage equal to 50% of all the Shield its party holds, its wearer's own included. The Shields stay.";
  weapon("hammer", "legendary", name, {
    effect, stats: [st("defense", 2), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { adds: [{ on: "basic", amount: { scale: [{ ratio: 0.5, count: { side: "allies", stacks: "shield" } }] } }] })],
    serves: "Landslide 3 ●●●, Pact ●",
  });
}

// ─── Mace ──

weapon("mace", "common", "Morningstar", { stats: [st("max_hp", 1), st("defense", 1)], serves: "the Toll (HP, Defense)" });
weapon("mace", "common", "Friar's mace", { stats: [st("max_hp", 1), st("mp_regen", 1)], serves: "Blood Pact, and Barrage's font (HP, MP regen)" });

{
  const name = "Censer mace", effect = "Its basic attacks add many Burn (from Attack).";
  weapon("mace", "uncommon", name, {
    effect, stats: [st("max_hp", 2), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("burn", "other", own("many", "attack")))] })],
    serves: "Bonfire 1 ●●●, Toll ● ⚙ lead's colour (half) ◆ swing-status",
  });
}
{
  const name = "Mender's mace", effect = "Every so often, the ally with the lowest share of max HP is healed for 20% of its wearer's max HP.";
  weapon("mace", "uncommon", name, {
    effect, stats: [st("max_hp", 2), st("mp_regen", 1)],
    statuses: [own_(name, effect, { pulse: { every: SO_OFTEN, do: [{ op: "heal", amount: share(0.2, "max_hp"), to: TO.lowestAlly }] } })],
    serves: "Pact 1 ●●, Toll 1 ●● ⚙ brink (half) ◆ lowest-ally",
  });
}
{
  const name = "Penitent's mace", effect = "Each hit its wearer takes heals the ally with the lowest share of max HP for 2% of its wearer's max HP.";
  weapon("mace", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1), sp("thorns", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, { op: "heal", amount: share(0.02, "max_hp"), to: TO.lowestAlly })] })],
    serves: "Toll 1 ●●, Pact ●",
  });
}
{
  // A tally on the healed ally, half the heal a point (what went past full too), added to its next hit and spent by it.
  const name = "Saint's mace", tally = `${id(name)}_blessing`;
  const effect = "Each time its wearer heals an ally, that ally's next hit deals extra damage equal to 50% of the heal. Heals that come before that hit add up.";
  const given = { whose: "team" as const, other: "holder" as const, notTags: ["pulse"] };
  weapon("mace", "rare", name, {
    effect, stats: [st("max_hp", 1), st("mp_regen", 2), sp("cooldown", "medium")],
    statuses: [
      // What lands, not what's cast: healing past full (or past a cap on healing) gives nothing.
      own_(name, effect, { reactions: [react(on("healed", given), give(tally, "owner", ofAmount(0.5)))] }),
      { id: tally, name: "BLESSED", text: "Its next hit deals extra damage: 50% of the heals it was given.", label: "buff", show: "icon", stacking: "intensity", adds: [{ on: "physical", amount: 1 }], trigger: { on: EV.hit }, drop: "all" },
    ],
    serves: "Pact 2 ●●●, Landslide ●●",
  });
}
{
  const name = "Anchorite's mace", effect = "Its wearer's heals on the ally with the highest Aggro are doubled.";
  weapon("mace", "rare", name, {
    effect, stats: [st("max_hp", 2), st("defense", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "healing", pct: against(100, { top: { stats: ["aggro"] } }) }] })],
    serves: "Toll 2 ●●●, Pact ●●",
  });
}
{
  const name = "Martyr's mace";
  const effect = "Its basic attacks deal more the lower its wearer's HP: 50% more below 70% of its max HP, 100% more below 50%, 150% more below 33%, and 200% more below 10%. Below 33% of its max HP, each one that lands also heals its wearer for the damage dealt.";
  weapon("mace", "legendary", name, {
    effect, stats: [st("max_hp", 2), st("defense", 1), st("mp_regen", 2)],
    statuses: [own_(name, effect, {
      boosts: [{ tag: "basic", pct: { scale: [70, 50, 33, 10].map((hpBelow) => ({ ratio: 50, when: { hpBelow }, of: "holder" as const })) } }],
      reactions: [reactIf(EV.basic, { side: "self", where: { hpBelow: 33 } }, { op: "heal", amount: ofAmount(1), to: "holder" })],
    })],
    serves: "Pact 3 ●●● ⚙ brink (half)",
  });
}
{
  const name = "Noonday mace";
  const effect = "Each basic attack it lands on a burning foe gives every ally a Heat (each acts 5% faster in everything for each Heat, up to 10, for the rest of the fight).";
  weapon("mace", "legendary", name, {
    effect, stats: [st("max_hp", 2), st("defense", 2), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.basic, { unit: "other", where: { has: "burn" } }, give("heat", TO.everyAlly, 1, { rider: false }))] })],
    serves: "Bonfire 3 ●●●, Toll ●",
  });
}

// ─── Staff ──

weapon("staff", "common", "Rowan staff", { stats: [sp("cast_speed", "medium"), sp("cooldown", "medium")], serves: "Barrage (Cast speed, Cooldown)" });
weapon("staff", "common", "Willow staff", { stats: [sp("cast_speed", "medium"), st("mp_regen", 1)], serves: "the healers, and Barrage's well (Cast speed, MP regen)" });

{
  const name = "Shepherd's staff", effect = "Each ability its wearer casts gives the ally with the least MP 50% of the MP that ability cost it.";
  weapon("staff", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), sp("cooldown", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("action_resolve", { kind: "ability", paid: true }), { op: "mp", amount: ofAmount(0.5), to: TO.leastMpAlly })] })],
    serves: "Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast",
  });
}
{
  const name = "Canopy staff", effect = "When each fight starts, its wearer and the other ally with the least max HP each gain a Shield of 17% of its wearer's Attack.";
  weapon("staff", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), st("mp_regen", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("shield", "holder", share(1 / 6, "attack")), give("shield", { side: "others", pick: "lowest", by: { stat: "max_hp" } }, share(1 / 6, "attack")))] })],
    serves: "net, Barrage ●, Landslide ● ⚙ opening again (half), detonation (half)",
  });
}
{
  const name = "Vesper staff", effect = "Each ability its wearer casts heals the ally with the lowest share of max HP for 10% of its wearer's Attack.";
  weapon("staff", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), st("attack", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(CAST, { op: "heal", amount: share(0.1, "attack"), to: TO.lowestAlly })] })],
    serves: "Pact 1 ●●, Toll ● ⚙ brink (half) ◆ lowest-ally",
  });
}
{
  const name = "Ritual staff", effect = "Its wearer's abilities wind up 50% longer, deal 50% more and add 50% more stacks.";
  weapon("staff", "rare", name, {
    effect, stats: [sp("cast_speed", "medium"), st("attack", 2), st("max_mp", 1)],
    statuses: [own_(name, effect, { mods: [{ wind: 50, damage: 50, stacks: { pct: 50 } }] })],
    serves: "Bonfire 2 ●●●, Snap 2 ●●, Landslide ●, Barrage ●",
  });
}
{
  // A count to two of its own casts (a repeat isn't one): at one, the next cast has no wind-up, and that cast empties the count.
  const name = "Evensong staff", n = `${id(name)}_count`;
  const effect = "Each ability its wearer casts makes the next one cast at once, with no wind-up. An ability cast that way doesn't do the same for the one after it.";
  weapon("staff", "rare", name, {
    effect, stats: [sp("cast_speed", "medium"), sp("cooldown", "medium"), st("max_mp", 1), st("mp_regen", 1)],
    statuses: [
      own_(name, effect, { mods: [{ cast: 0, if: countAt(n, 1) }], reactions: [react(on("action_resolve", { kind: "ability", repeat: false }), give(n, "holder", 1))] }),
      count(n, "EVENSONG", "At one, its next ability has no wind-up.", 2),
    ],
    serves: "Barrage 2 ●●●, Bonfire ●●, Snap ●●, Pact ●",
  });
}
{
  const name = "Staff of echoes";
  const effect = "Every ability its wearer casts is cast twice: the second follows at once with no wind-up, and is paid for as a cast of its own. If it can't be paid for, there's no second. The second picks its target anew, by the ability's own words. It's never cast again, by this or by anything else.";
  weapon("staff", "legendary", name, {
    effect, stats: [sp("cast_speed", "high"), st("max_mp", 2), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("action_resolve", { kind: "ability", repeat: false }), { op: "recast", paid: true })] })],
    serves: "Barrage 3 ●●●, Bonfire ●●, Snap ●●",
  });
}

// ─── Great weapon ──

weapon("great_weapon", "common", "Bardiche", { stats: [st("attack", 1)], trade: "heavy", serves: "Landslide (Attack, in the heaviest swing)" });
weapon("great_weapon", "common", "Halberd", { stats: [st("attack", 1), st("max_hp", 1)], serves: "Landslide, and Blood Pact (Attack, HP)" });

{
  const name = "Roaring greataxe", effect = "Its wearer starts each fight with many Might (from Attack).";
  weapon("great_weapon", "uncommon", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [atStart(give("might", "holder", own("many", "attack")))] })],
    serves: "Landslide 1 ●●, Hunt 1 ●● ⚙ opening again (half), judge's drum (half) ◆ heavy-blow",
  });
}
{
  const name = "Giantsbane", effect = "Its basic attacks deal 50% more to a foe above 50% of its max HP.";
  weapon("great_weapon", "uncommon", name, {
    effect, stats: [st("attack", 1), st("max_hp", 2)],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: against(50, { hpAtLeast: 50 }) }] })],
    serves: "Landslide 1 ●●, Hunt ●● ◆ heavy-blow",
  });
}
{
  const name = "Harvest scythe", effect = "When its wearer lands a killing blow, its next basic attack comes at once.";
  weapon("great_weapon", "uncommon", name, {
    effect, stats: [st("attack", 2), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, swingNow())] })],
    serves: "Hunt 1 ●●, Landslide ● ◆ kill-pays, heavy-blow",
  });
}
{
  const name = "Icebreaker", effect = "Its wearer's hits on a Stunned foe deal double.";
  weapon("great_weapon", "rare", name, {
    effect, stats: [st("attack", 2), st("max_hp", 1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { boosts: hits(against(100, { has: "stun" })) })],
    serves: "Snap 2 ●●●, Landslide 2 ●● ◆ held",
  });
}
{
  // The left-over runs on with every kill it makes (no `bare` filter); beside another carrier of the same blow, it's split.
  const name = "Overrun", effect = "What its wearer's killing blows have left over carries into another foe, picked by draw, and on again each time it kills.";
  weapon("great_weapon", "rare", name, {
    effect, trade: "heavy", stats: [st("attack", 2), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [{ on: EV.kill, split: "over", do: [{ op: "strike", of: "over", to: TO.foeByDraw }] }] })],
    serves: "Landslide 2 ●●●, Hunt ●● ⚙ avalanche (key) ◆ heavy-blow",
  });
}
{
  const name = "Thunderhead maul", effect = "Its basic attacks deal 5% more for each Shock on their target. The Shock stays.";
  weapon("great_weapon", "rare", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1), sp("crit_damage", "medium"), st("aggro", 1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: stacksOf("shock", 5, "target") }] })],
    serves: "Storm 2 ●●●, Landslide ●●, Snap ● ⚙ held charge (key) ◆ heavy-blow",
  });
}
{
  // Half as often is its shape (Attack speed −100 counts no step).
  const name = "Worldbreaker", effect = "Its basic attacks come 50% less often, deal triple, and Stun their target.";
  weapon("great_weapon", "legendary", name, {
    effect, stats: [{ stat: "attack_speed", flat: -100 }, st("attack", 2), sp("crit_damage", "high"), st("max_hp", 1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: 200 }], reactions: [react(EV.basic, give("stun", "other"))] })],
    serves: "Landslide 3 ●●●, Snap ●● ⚙ held charge (half) ◆ heavy-blow",
  });
}
{
  const name = "Twinfall";
  // Half again, not double: the second landing is half the first (the held-back lever: half again where the condition holds all fight).
  const effect = "Each hit its wearer lands, a basic attack's or an ability's, lands a second time a tick later: 50% of the damage again, on the same foe. The second carries none of the first's statuses, and nothing repeats it.";
  weapon("great_weapon", "legendary", name, {
    effect, stats: [st("attack", 2), st("max_hp", 2), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { notTags: ["bare"] }), { op: "strike", of: "dealt", share: 50, after: 1, to: "other" })] })],
    serves: "Landslide 3 ●●●, Hunt ●●, Cuts ● ◆ heavy-blow",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
