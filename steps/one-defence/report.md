# One defence: report

## Intent

Physical against magical needs settling: players have no Magic resist, and there should be none on gear. The director's constraints: the tank must matter in every dungeon, players and enemies follow the same rules, and Attack against Magic shouldn't be only cosmetic. Their instruction: "make what you think is the best solution to this problem, and put it in the build", to be judged by playing this branch.

## Decisions for the director

1. **Keep it or not**, after playing.
2. **`docs/rules.md` still says the old rule** ("magical meets Magic resist ... and is never dodged"). It's the director's direction, so it's left untouched. If the change stays, that line becomes: "Every hit meets Armor and Evasion; a status's damage, and the few payoffs that cash one in, pierce."
3. **Five of the documents' 29 test trios stop behaving.** They taught physical against magical: Spellward (now Incorporeal), the magical Swarm, Elemental, Mana thief and Binder. They need new expectations or new fights.
4. **Gale spear lost a third of its damage.** It's three small hits, and Armor takes the biggest share off small hits. Other small multi-hit spells will show the same drop.
5. **The "magical torrent" route of Thousand Cuts** (`docs/gear-design/builds.md`) loses its reason: fast magic no longer slips past Armor.

## What's built

- **One rule for every hit.** A hit, a swing or a spell, meets Armor and Evasion, for the party and for foes. Physical and magical stay as a hit's theme (colour, sound, words) and as a tag gear can boost. The engine reads this from `ruleset.magical` (`armor` in the core set; the default `resist` keeps the old rule, which the test fixture uses).
- **No Magic resist anywhere.** Foes lose their rank's, and the stat stays in the engine unused.
- **Afflictions pierce,** as they already did: Burn, Shock, Chill's shatter, Bleed, Thorns. So Attack strikes and Magic afflicts, and the casters' answer to heavy Armor is what they apply.
- **The payoffs that cash a status in pierce too:** Pyre and its two forms, Avalanche and Resonance. That makes them the rare blow nothing stops, and the interface shows them as PIERCING.
- **Ward is the defence against what Armor never meets:** less damage from statuses and piercing blows (`STATUS.ward`). Sanctuary, the Ward gear and the foes' self-Wards (Dark ward, Kindle) keep their places with the new meaning.
- **Ghosts are Incorporeal:** every hit deals much less (`INCORPOREAL`), but statuses hurt them in full. They used to be a "bring physical" foe; now they're a "bring afflictions" one.
- **The rogue mode is recalibrated** (`rogue:calibrate`, then `rogue:tune`), because the change made every fight easier.

## What the numbers say

- **Before recalibrating, parties won about 12 points more often.** Enemy spells, about 40% of enemy attacks, now meet the party's Armor. The tank's share of damage mitigated rose from 41% to 58%.
- **After recalibrating, the simulated player wins 20–23% of rogue runs,** on the 20% target. Free play has no difficulty knob, so it stays easier.
- **Ghosts:** the party's damage on them from statuses rose from 37% to 55%. They live about 40% longer and hit about half as hard, since their own spells now meet Armor.
- **Bats** dodge twice as often (17% to 32%), because spells can now be dodged.
- **Pyre** deals 24% more a cast, and Gale spear 35% less. Firebolt, Fireball, Frost lance and Chain lightning lose 8–22% of their hit, though their statuses are untouched.
- Class win rates (against each other) move up to 6 points each way, with no class breaking. The Frostweaver stays the weakest, as it was.

## Worth looking at when playing

- A tank in the Storm Tower or the Fire Mine: does Armor now feel like it matters there?
- A Pyromancer's Pyre on an armoured boss.
- Ghosts in the Crypt with a physical party compared with a caster party.
- Paladin's Sanctuary against the Fire Giant's Burn.
