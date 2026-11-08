# Intent: class identity after Magic

The director, Nov 8, on the prototype that removed Magic and Magic resist (`steps/no-magic/`), and in the weapons conversation recorded in their findings document.

- **The problem.** With Magic gone, many classes turned out to be distinct only through the word Attack against the word Magic. Every class needs a unique identity, and its weapon, offhand and armor kinds, its base abilities and its upgrades all have to support it.
- **The stack.** A class's identity is its kit first (passive and abilities), its gear kinds next, its stat line last. The stat line is a template; gear can stretch a class far from it. "No caster as a common identity": every class uses basic attacks and abilities, so being magic is no longer anything.
- **This pass decides, in a final way:** each class's weapon kinds (the findings' allocation is the starting point and may change); each class's offhand kinds (kinds may be created or removed); the armor kinds, if anything needs changing; the stat lines, reallocated to the new identities; and any base abilities and upgrades that need to change. Base abilities change where they're too simple or one-note to carry an identity (the Hoplite's two shield abilities are the flagrant case). Upgrades are expected to change most: they're the strongest part of the build and the strongest commitment lever.
- **Standing direction that bears on it,** from the findings: a weapon kind suggests a direction to whoever holds it; all gear has stats and higher rarity is generally better; special stats are not reserved; everything scales from the user, never the target, revives excepted; upgrades keep their format (a power step and two versions), and scaling can be part of a version's identity; gear is balanced whatever the distribution; Accuracy is never a signature stat; every class has a one-hander; slots have no job, and the weapon method isn't pattern-matched onto armor and offhands.
- **The weapon rules are settled:** at most three classes a kind (the mace's four is the one exception), every wearer reads the kind's signature stat, two classes share at most one weapon kind, every class has a one-handed kind, a class may have up to three kinds. The twelve kinds and their stat profiles stand. Swing numbers, rarity growth, armor and offhands, and the caster classes' re-theming are open.
- **How to work:** design only, nothing committed while designing. Ask the director when unsure of a subjective fantasy or gameplay pitch, rather than guessing.

## The director's answers on the first draft (Nov 8)

- **A class has several identities,** by how it's built: "Classes are supposed to have multiple identities based on how you build them." The Hexer's two are the status torrent and the witch-hunter; neither feels viable yet, and the design must not pick one over the other.
- **The Paladin:** a tanky supporting damage dealer, with Shield plus Burn and Shield plus super-tank as two of its identities. Sanctuary as a Shield from its Attack is liked. Judgement should work on debuffed foes, not buffed ones: "very few enemies apply buffs to themselves."
- **The Hoplite is the game's ultimate bruiser,** not a tank: "a team helping, very tanky, big damage dealer, whose weakness is that they don't take aggro through their abilities." Paired guard goes; an offensive ability takes its place. No Interpose, no Taunt version. The Knight isn't an offensive class either: Shield bash is about the Stun.
- **Einherjar is the worst passive in the game,** from about thirty games played. Classes may have revives, and Phoenix may have value as a build, but "a class's identity should not be focused on getting the Phoenix build to work." The Valkyrie's passive changes to something that works every fight.

## The director's answers on the second draft (Nov 8)

- **The Valkyrie is "the offensive Shield Maiden fantasy":** "not a tank but a relatively fast, relatively survivable damage dealer." Keep Gale spear. Combine the heal and the revive into one ability ("maybe they're slightly less good at healing but they can also revive"). Redesign the rest of the kit.
- **The Hoplite "wants to be a slow, tanky, big-hit sort of team support."** Its new ability is an Area attack, with a defensive option among its versions.
- **The Paladin:** Zeal works. The other Judgement version shouldn't neuter the fantasy: another effect on hitting a debuffed foe, such as Shock, a heal, or crit chance tripled ("that one's pretty cool").
- **The Hexer:** both structural adds (Unmake on a cast or a buff; Culmination).

## The director's answers on the third draft (Nov 8)

- **The Valkyrie's kit as written** (Shieldmaiden, Gale spear, Choosing, Skyfall, with their versions, and the line with Cooldown medium and Aggro 2) reads as the offensive shieldmaiden. Approved.
- **Spear and sword** for the Valkyrie, in place of spear and mace. Approved; the findings' mace exception is gone.

## The director on the committed design (Nov 8)

- **The design is approved** ("very good work"), with one doubt: **the offhands.** A few offhand kinds are the only one their wearers have, and a kind's wearers don't want the same stats: "the monk and the cleric basically never want the same stats on a bell", so a bell reads as a Monk tool or a Cleric tool, never both. They ask for more options and "a similar rationalization to what we did with primary weapons" for offhand kinds. This supersedes the earlier note that the weapon method shouldn't reach offhands: what stays rejected is a job per slot; what's asked for is that every piece of a kind be relevant to every class that can wear it.

## The director's answers on the fourth draft (Nov 8)

- **The offhand kinds as tabled** (thirteen kinds, two a class, by the weapon rules). Approved.
- **Armor stays as the four weight classes.** No pass on armor.
- With these, **the design is approved at its gate.** The next stage is build and tune.

## The director's feedback from a parallel thread (Nov 8)

They ran the same exercise with another agent and list the calls they liked better there, as feedback rather than a task list: push back where warranted, keep the design coherent. Their direct calls: no class applies both Chill and Slow; the Frostweaver is tankier, "a chunky supporting ice wall, a disabler or a shatter killer, never a squishy pure lockdown", and the mages separate by kit, not stat line; the Frostweaver must shatter reliably by design; the Pyromancer is the long cast, Cast speed is its stat and Burn is stoked by its casts ("the current pyromancer design is one of the least functional classes"); the Hexer has three identities (Spellbreaker, Curser, elemental blade); the Paladin is the judge, "helper of the righteous, killer of the wicked"; upgrades carry most of the change. Designs they liked: the Hoplite's Othismos (a shove from Defense with Sunder on every foe); the Paladin's Condemn (a Mark and the party's volley); Malison that deepens what foes hold and adds Bleed; Encore in place of Thunder chord; Fireball, Blizzard and Thunderstorm as three different abilities; Thunderstorm as Shock on the party's swings.

## The director on the fifth draft (Nov 8)

- **Slow stays a player status.** Removing it across the board was the other agent's overreach on a narrower point: "it's weird for the class about chill to also do slow." Only the Frostweaver doesn't apply Slow.
- **Ride the lightning is too esoteric;** find another identity for Thunderstorm's second version among the Stormcaller's own. **Encore's MP-targeted version** is "just not an interesting fork" (it fires on an ally with no MP); refreshing an ally's cooldown is an idea; the basic-attack version is esoteric but worth trying. **Spellsteal is a bad idea:** bosses' unique buffs would need exceptions, and enemies almost never buff, so it would be dead most of the time.
- **The Frostweaver:** Rime shield needn't read Defense if its gear doesn't carry it. No ability may trigger a shatter: "the identity of the Frostweaver is the chill applier … chill itself already detonates", and bypassing that loop admits the mechanic doesn't work; shattering reliably is a matter of how many stacks. Keep Chill on Stillness: a Clarity ability alone isn't interesting, and the class needs the Chill. The ice wall direction stands.

## The director on the sixth draft (Nov 8)

- **Approved** ("amazing"). One thing left: weapon kinds vary only in swing speed and stats, so every kind converges on the same damage per tick and the same stat budget, and it reads flat. Their suspicion: vary the other parameters too, base damage against scaling, damage against stat budget, between kinds or within a kind. Design the levers and decide how to apply them; the sizing can follow.

## The director on the swings (Nov 8)

- **Attack stays a common stat on the Attack-heavy kinds.** Attack as the *signature* of an Attack-heavy swing would be the mistake; as a common it isn't always there, so the choice stands. The correction I asked for is withdrawn.
- **Confirmed:** a kind's words are its default, and a piece may step up or down the trade, so pieces of one kind don't all swing alike.
- **Every piece of loot, or the vast majority, carries stats at every rarity.**
- **The interface shows a weapon's damage per tick,** or the swing variation is unreadable to the player.

## Sequencing (Nov 8)

- **Build this pass now, on the current gear,** then redesign the builds, then the loot: one thing at a time, by the director's word. The current twelve builds aren't all working and will be redesigned on the new classes.
