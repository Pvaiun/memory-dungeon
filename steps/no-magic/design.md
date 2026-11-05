# Design: one kind of damage

What the prototype builds, in the scale's words. Numbers are in `content/core-set/scale.ts` by the names given.

## The rules

- **One kind of hit.** Every hit (basic attacks, abilities, extra strikes, reactions that strike) meets Evasion and Defense. A status's own damage (Burn, Bleed, Shock, Chill's shatter, Thorns, Doom) is untyped, never dodged and never reduced. The damage types left are a hit and a status's own damage; the hit tag `physical` now means "a hit".
- **The stats:** Attack is the one offensive stat, and every amount still states what it scales from (Attack, Defense, max HP, Crit chance, Thorns…). Defense is Armor renamed, with the same formula (`RULES.armorK`). Evasion as before. Magic and Magic resist are gone from the engine, the schema and the content.

## Classes

- **A class's Attack is the higher of its old Attack and Magic**, so every class keeps the stat its kit used. The Monk's line keeps its own Attack.
- **The Valkyrie** heals from Attack now, which is higher than the Magic its heal was sized for, so Rally's share is trimmed to keep the heal its size (`RALLY` in `classes.ts`).
- **The Paladin is "Shelter":** Sanctuary still Wards every ally; Ward is what changed (below). Its card no longer says magic.

## Weapons: striking and focus

- **The six striking kinds** (dagger, fist, sword, spear, bow, great weapon) swing as before: base and ratio at medium.
- **The five focus kinds** (rune sword, mace, wand, rod, staff) swing lighter, base and ratio at low (about half the swing), and **every piece of a focus kind carries +1 Attack** on top of its own stats (`FOCUS`). The card shows the total ("Attack +3." on the Morningstar, which gave Magic +2). So a blade hits harder, and a focus makes everything that scales from Attack bigger: abilities, heals, stacks.
- The choice matters for the classes that wear one of each (Hexer, Valkyrie, Geomancer, Bard, Bramble knight, Paladin: rune sword or mace).

## Gear

- **Every +Magic is now +Attack.** A piece that gave both (Inscribed hauberk, Runed saber) turns its second point into something else (HP, Crit chance), so no common gives +2 Attack by accident.
- **The armor types keep their leanings,** which already match the direction: plate gives Defense, HP and Thorns; mail a mix; leather Attack, Evasion and Crit; robes Attack and MP regen. No Attack was moved between armor types.
- **Silvered hauberk:** its first hit each fight deals half (it was the first magical hit).

## Ward

- **Ward: "Takes less damage from hits."** A cut to the hits its holder takes (`STATUS.ward`), never to a status's own damage, against Guard's Defense, which big hits punch through. Its users are unchanged: the Paladin's Sanctuary, the Sigil blade and Prior's mace, the Lich's Dark ward and the Fire Giant's Kindle.

## Enemies

- **No Magic resist anywhere.** Each foe's Attack is the higher of its old Attack and Magic, except the Reaper and the Silent One, whose Magic fed nothing and who keep their Attack. The Ice Titan's Hailstorm share is cut so it lands its old size from the Titan's higher Attack.
- **Their spells are hits now:** the Lich's Soulfire, the Fire Giant's Brand and Inferno, the Hailstorm, the Tempest, the Bomb Bug's blast and every caster's touch can be dodged and meet Defense.
- **The Ghost (and the Ice Ghost) is Incorporeal:** it takes a quarter of every hit, and a status's own damage in full (`INCORPOREAL`). The challenge Spellward becomes **Incorporeal**, answered by statuses (Burn, Bleed, Shock, a shatter, Thorns) and Sunder.
- **Challenges whose answer was "Magic"** (Armored shell, Dodger, Duelist, Hardening hide, Shield wall, Mixed defenses) lose it: the answers left are big hits, Crit damage, Sunder, Accuracy and statuses, as each one's list already says. Two states (not built) swaps between very high Defense and Incorporeal.

## Open questions this raises (for the report)

- Evasion now meets every hit, spells included: Dodgers (the Bat, a Thousand Cuts party) are harder for casters, who used to pass them.
- Defense now meets spells, and its formula cuts small hits hardest: multi-hit and area spells (Gale spear, Chain lightning's bounces, Fireball and Blizzard's touches) lose more than Magic resist took.
- The Ghost's answer moves from "physical damage" (any party) to "statuses" (most parties have some).
