# The fresh read: the engines

One reader who hadn't seen the design, reading each engine's parts together from the fill's own numbers. For each of the twenty-eight: do the two sides meet at the size the spine's link names (*Sized so*), in a fight of 20 to 60 ticks? Then any card that would keep a player from finding it, and any chain with a weak brake that isn't already listed. Nothing here judges strength.

**The count: 25 meet, 3 don't, and none I couldn't tell.**
- **Nine of the 25 meet only in one kind of fight or with one more part,** and each entry says which: the detonation, the opening again and two in the dark (a pack, not a lone foe); the held charge (a lone foe or a boss, not a pack); the mirror (the wall's own number is small only under an Aegis or a Shield); the judge's drum's horn (a Mark that's kept up); the avalanche (a Hoplite, or a boost); the spell on the swing (one source of speed); the shatter bell (which ability rings).
- **The three that don't:** the riposte (the class that dodges builds no cover by hitting, and the class that builds cover by hitting doesn't dodge); the blood mage (at a common's Lifesteal a wide spell loses life on four foes); the crescendo (at an ordinary pace the price is one cast's worth in a fight).
- **One new loop,** a listed pair tipped over its line (Everflame lantern and Bellows wraps, with more speed on the Monk), and three notes on listed ones, after the engines. **The director's sample** is last: twenty-five items.

**What the sums assume,** unless an entry says otherwise: each class's own stat line with no gear but the piece in question (`classes.ts`); the scale's words as numbers (`scale.ts`); a regular fight of about 40 ticks and a boss fight of 60 to 90; foes at their document lines with no knob (a wolf has 2,000 HP, a bandit 4,000, an elite 10,000 to 16,000, a boss 33,000 and up; their plain swings are 500 to 1,600 before Defense). I worked every sum by hand. The one thing I ran was a line that printed each ability's cooldown in ticks from `scale.ts`'s own formula; it wrote nothing.

## The engines, in the spine's order

### The foes do it to themselves

**1. The shield detonation: meets, in a pack.**
- *The sum.* A Knight in Rubble plate starts behind Vanguard's Shield of 1,100, and its break sends 1,100 to every foe: about two of the Knight's own sword swings, on each of them, past Defense. That's a blow on its own. With Carapace charm (about 900 more) and a Geomancer's Earthen shell beside it (which fills the Knight's Shield to its cap, 3,000), a regular fight sees two breaks, about 2,100 and then 3,000 to each foe. Against four foes that's about 20,000, against roughly 10,000 from the party's swings over 40 ticks.
- *Where it's short.* Against one boss the same two breaks are about 5,100 over a fight in which the swings deal three times that. Shatterstone charm doubles it on the one foe, which is still under the swings. So "out-damages its swings" is true against a pack and not against a lone foe.
- *Cards.* Nothing stops it. Three of Plate's five wearers make no Shield of their own, so Rubble plate needs one from elsewhere on them (round 3 notes the same of Urchin plate), and Mountain's crown keeps the Geomancer's stone from breaking at all, as its own share says.
- *Loops.* None beyond those listed (Second skin, Rampart, Rubble shield's small Shields).

**2. The frozen gate: meets.**
- *The sum.* A Knight in Hoarfrost plate lays about 4 Chill on a foe for each blow it lands, against a cap of 12, so a foe bursts on its third blow: a wolf, which bites twice a swing, on its second swing; a bandit at about tick 25 to 30 once the cold has slowed it. A boss that puts two blows in three on the wall bursts once by the middle of its fight and perhaps a second time. The burst is 3,000 and a Stun, which is a wolf's whole bar. Rime shield answers each one with about 900 of Shield, and Meltwater orb with a quarter of a pool.
- *The other homes.* Frostward blade from a Frostweaver is 4 a blow: the third or fourth blow, since one stack thaws on the way. Toll gate behind a Hexer is about 3.6: the fourth. Frost armor is the thinnest, about 3 a blow for one Guard's 28 ticks: a wolf bursts inside it, a bandit lands three blows in that time and needs a second cast or the Frostweaver's own Stillness to get there.
- *Assumed.* The wall takes about two blows in three from its Aggro alone (Knight, one Aggro step), and all of them under a Taunt.
- *Cards and loops.* Nothing stops it; nothing new.

**3. The mirror: meets on what's sent back; the wall's own number is small only under an Aegis or a Shield.**
- *The sum.* The Ogre Chief's Crush is 4,800 as struck, with no knob. Mirror shield sends 2,400 of it back, which is bigger than anything the party swings and about 7% of the Chief's bar, two or three times a fight; his plain swings send 550 each. Under an Aegis, Hoplon and The last wall send back all that was blocked, about 3,800. So what's sent back is seen against a boss's heaviest blow.
- *Where the picture differs.* The link's wall "took a small number or none". Defense takes little off a blow that size: a Knight with the shield takes about 3,800 of the 4,800, and about 3,400 while Guarded. Only an Aegis (BLOCKED) or a Shield big enough makes the wall's number small. So Mirror shield on a Guarded anchor, which `builds.md` calls enough to see it, shows the Chief's number and a wall that still took most of the blow. The whole picture needs the Hoplite's Aegis on the anchor (Watch the anchor) or stone.
- *Couldn't tell.* Whether a boss's wound-up blow picks its target when the wind-up starts or when it lands. That decides whether a Taunt that lapses mid wind-up loses the blow, and so how often the mirror is the one struck.
- *Cards.* Hoplon is blank without a Shield or an Aegis on its own holder, and only the Valkyrie makes one for herself; her Shield is a few hundred, so what it sends back is small and often. Its share says so.
- *Loops.* None new: what's sent back isn't a hit, and nothing answers it.

**4. The goad: meets, where the anchor wears its toll.**
- *The sum.* A Bramble knight holding Goading totem, Guarded by its own Thicket: a called bandit swing costs the knight about 200 and the bandit 450 in Thorns, with Briar's Bleed on top. A wolf's two bites cost the knight about 50 and the wolf 900, nearly half its bar. So a call against four bandits costs the pack about 1,800 and the anchor about 800.
- *Under a storm.* A foe holding 8 Shock pays 640 for a called swing that takes about 290 from a Knight. It pays from about 4 Shock up.
- *How often.* The totem calls once a Taunt: once or twice a regular fight on Thicket's cooldown, two or three times under Challenger's plate. Each is every foe swinging at once, so it's seen. Provoking blade calls one foe a swing, and on a Knight with nothing that answers a blow it only costs the party: with Emberguard beside it, each called blow costs a boss about 1,000 of fire for about 500 on the Knight.
- *Cards.* Nothing stops it. The spine's own doubts stand (a Stormcaller's totem needs a Taunt from its amulet; the blade's called blow lands on whoever the foe picks, not on its wearer).
- *Loops.* None beyond those listed. Duelist's leathers beside Provoking blade on a Valkyrie doesn't loop: its answer is a strike with her weapon, not a basic attack, so it calls nothing.

**5. The held charge: meets on a lone foe or a boss; in a pack one Stun isn't long enough.**
- *The readers.* All of them at least double at Shock's cap of 40: Skyfall and Thunderclap about two and three quarters times, Thunderhead maul triple, Lightning-glass two and a half, the Bolt seat a little over double, Stormbrand a sword swing again, Stormspear four times. They double at about 13 (Stormspear), 20 (the maul), 23 (Skyfall) and 25 (the glass).
- *The charge.* A Stormcaller under its own Thunderstorm with two allies swinging lays about 2 Shock a tick on a lone foe. So a Stun's 8 ticks add about 15, and a foe that came in with a few ends near 20 to 25: the blow about doubles. A boss that swings every 13 ticks climbs to the cap between its moves. In a pack of four the same storm is spread, the held foe gains about 5 in a Stun, and the readers land for a quarter to a half more, not double.
- *Assumed.* The party's swings pick at random. A Mark on the held foe makes the pack case the lone-foe case.
- *Cards.* Stormbrand's card gives no size ("extra damage for each Shock the foes hold"), where the maul and the glass print theirs.
- *Loops.* None new.

**6. The reckoning: meets.**
- *The sum.* Hammer and anvil with a Bramble knight in front and a Hoplite's great weapon behind: the Hoplite swings once in about 26 ticks for 3,240. Four wolves land more than twenty bites on the Anvil in that time and four bandits about ten, so the count is full at 10 and the swing is triple: about 9,700, far the biggest number in the fight. Grudgebearer on a Knight triples a 1,140 hammer swing against wolves and adds four fifths against bandits.
- *Where it's short.* A lone boss lands two or three blows between swings, for two to three fifths more. Against a pack the count's ceiling binds long before the swing comes, as its share says, and most of a 9,700 blow on a 2,000 wolf is wasted unless the avalanche carries it.
- *Cards and loops.* Nothing stops it; nothing new.

### Kills turn them over

**7. The reaping: meets.**
- *The sum.* Coup de grâce lands for about 1,800 after a minion's Defense, twice that on the Assassin's one crit in five, and a full pool pays for four. So it kills any foe sunk under about 1,800. A wolf's whole bar is 2,000, so any wide hit at all sinks a pack of wolves far enough; a bandit has to lose a little over half. Pitch lantern on a Pyromancer does that alone: its fire takes about 2,500 off every foe over the first 25 ticks. Squall lance takes about 1,000 off every other foe twice a regular fight, Oathkeeper about 400 a swing while its Knight Taunts, Volley bow about 800 on every third arrow.
- *Assumed.* A full pool. MP carries, so the cliff is four foes long at most and often shorter, as its share says.
- *Huntmaster's quiver.* Three arrows at the lowest foe come to about 3,700 after Defense, close to a bandit's bar, and all three are ready again when it falls: about three rounds from a full pool. It's a staircase on its own.
- *Cards and loops.* Nothing stops it; nothing new.

**8. The judge's drum: meets where a Mark is still up when its foe falls.**
- *The sum.* There's no size to meet: a call is a whole swing. Swift justice Marks the foe with the lowest share of HP and calls three weapons onto it. Beside a Hoplite's great weapon that's about 6,000 at once, more than a bandit's bar, so the foe falls under the Mark, Condemn is ready, and the next call follows: five in a row from a Paladin's full pool. Pack leader's coat needs no Mark, and calls on its wearer's own kills.
- *Where it's thin.* Hunting horn waits for a foe that falls while Marked, and a Mark lasts 14 ticks. Under base Condemn alone (the foe with the highest Attack, once every 30 ticks) that will be rare. It fires on nearly every kill only where the Mark is kept on the lowest foe: Hunter's mark, Swift justice, The pack, Open season. Its share says the same, and Marked's length is already with the director.
- *A stale note.* The amulets share still lists Hunter's mark with Writ of judgement as a loop. Writ's card closes it: a Mark from gear doesn't call the blow.
- *Loops.* None new.

**9. The opening, again: meets in a pack; it does nothing against a lone foe.**
- *The sum.* Each effect comes back at its first size. An Assassin in Overture coat with Lancet phial and Hare's foot: each of its kills puts about 3 Bleed back on every foe (about 400 on the next hit each takes, about 1,000 over the next four) and renews its Haste. A Ranger's Opening shot is its next arrow at once as a crit, about 1,700. Under Second dawn a Pyromancer's Pitch lantern puts about 8 Burn back on every foe at every fall, which is about 2,500 on each over the next 25 ticks. Effects that add stacks or pool are worth seeing twice; ones that refresh (Haste, Taunt, Guard) are only renewed.
- *Assumed.* A pack of four, with the coat's wearer landing two or three of the kills. A Bard in the coat rarely lands one.
- *Cards.* The coat reaches few start-of-fight pieces: by the shares' own counts, two of the eight in the walls' and keepers' offhands, the phial, a tome on a Bard, an opening bow or dagger, the amulets and a seat. Everything else happens again only under Second dawn. A player may also not guess that Opening shot or a seat counts as a "start-of-fight effect": the phrase is defined in the spine, not on a card.
- *Loops.* None beyond those listed. A boss that summons, or Ghouls that dig each other up, hand the party an opening for each fall; the brake is the foe's own cooldown.

**10. The fuse: meets.**
- *The sum.* A Pyromancer's bolts hold the hottest foe at about 15 to 25 Burn, and its Fireball leaves the others at 2 to 7. When the hottest falls, Wick moves all of its fire to the next hottest, so 70% to 90% of what that foe now holds is fire that jumped. Smouldering orb's third is 5 to 8 on each other foe, half or more of what each holds. A wolf under 13 Burn or more falls in three pulses, still holding most of it, so the fire does fall with its foe.
- *Assumed.* A pack, and a feeder that aims at the most Burn, which the Pyromancer's and the Monk's abilities do.
- *Cards and loops.* Nothing stops it. It's a kill chain by design, and Burn's own drain and the foes running out are its brakes.

**11. The avalanche: meets on a Hoplite's doubled swing; a boost is what makes it "two or three more".**
- *The sum.* A Hoplite with Overrun swings for about 4,750, about 4,500 after a wolf's Defense. On a full wolf (2,000) that leaves 2,500, which fells a second wolf and scratches a third. With War horn's Might, a crit or a few Wrath, the same swing runs through three or four. Against bandits (4,000) one swing leaves about 500 and carries nowhere.
- *The other two.* Overkill axe needs a blow far bigger than what's left on its foe: Coup de grâce on a foe with 600 left carries about 1,200 to the next lowest. Downhill charm splits a left-over evenly: the Hoplite's 2,500 is about 640 on each of three other foes after Defense. Both are one more number, as the link asks.
- *Where it's short.* On a Paladin or a Geomancer without a crit, Overrun's swing is about 2,000: a full wolf, and nothing left to carry.
- *Cards.* Overrun's carry goes "by draw", where `builds.md` has it run furthest aimed at the weakest; round 2 ruled it.
- *Loops.* None beyond those listed.

### The party's swings and hits turn them over

**12. The spell on the swing: meets with one source of speed; mana stops it early.**
- *The sum.* Bell of the hour on a fist weapon rings every 26 to 30 ticks: once in a regular fight, twice in a long one. Under Haste it's every 21, and under Hummingbird charm every 15: two or three times a fight, which is the link's "several". A Monk's pool pays for two Stuns or three Burning fists, a Stormcaller's for three Chain lightnings, so mana stops it within a fight or two.
- *Baton* takes a fifth off the wait left with each swing: a medium cooldown comes round in about 20 ticks in place of 30, and in about 16 with Hummingbird charm. That's one more cast a fight. It's the smallest thing to see of the three homes, on a legendary: play never saw a cooldown come a few ticks closer.
- *Metronome* fills at 20 hits, every 30 to 40 ticks in a plain party and every 15 in a fast one; one round of the three songs is most of a Bard's pool.
- *Cards.* Round 3 fixed the bell's sentence.
- *Loops.* None new. Wellblade beside the bell (listed) is where mana stops being the brake: five swings restore more than the spell costs.

**13. The red rain: meets, for the weak wide hits it's meant for.**
- *The sum.* Barbed volley or Plague leaves 5 or 6 Bleed on every foe, which pays about 670 to the next hit each takes. A Blizzard's own hit is about 340 a foe after Defense, Chain lightning's chain about 500, Whipping vines about 490, Arc's second hit about 290. So the wound out-pays all of those. It doesn't out-pay the heavier wide hits (Othismos, Malison itself, Ringing bell's ring, Squall lance's flash, each about 950 or more), as two shares say.
- *From the kits alone.* Briar leaves about 2 Bleed for each blow a foe lands on the Bramble knight, so a foe that has struck the wall twice pays about 500: level with the lighter wide hits, not clearly over them. Lancet phial's 3 pays about 400, once.
- *Cards and loops.* Nothing stops it; nothing new.

**14. The riposte: doesn't meet from the keystone alone; the picture arrives by another piece.**
- *The link.* A dodger who draws answers often enough to bank cover for the blow that lands, and the answering swing builds cover "the way its striker already does".
- *The sum, on a Valkyrie.* She builds a Shield by hitting, about 200 for each spear strike. A bandit's blow takes about 340 from her. She has no Evasion of her own, so in Duelist's leathers she dodges one blow in five and banks about 50 for each blow that lands. With a cloak as well (two in five) it's about 130. The answers equal the blows only near three dodges in five, which is the leathers, a cloak and Skirmish line together; or at two in five with Tempest cloak as the cloak, since its swing lands twice.
- *The sum, on a Monk.* It dodges more than half of what's aimed at it in the leathers, and nearly everything under Stillness of mind. But its answering strike banks nothing: Drinking palm heals about 70 a strike and builds no Shield, and nothing a Monk wears turns a hit into cover.
- *So the two sides sit on different classes.* The one that dodges builds no cover by hitting, and the one that builds cover by hitting doesn't dodge. `builds.md`'s "enough to see it: the dodge's piece on a Valkyrie" shows a miss and a strike one blow in five.
- *What does make the picture.* Hooded cloak, an uncommon: a Shield of a sixth of Attack on every dodge, about 670 to 830, bigger than the blow it's banked against. Beside any of the three keystones, on either class, the player sees the miss, the strike and the bar grow. The cover comes from the dodge, not from the strike. It can't sit under Tempest cloak, which is the same slot.
- *Parrying spear* moves the strike to an ally, so nothing is banked on the dodger at all, as its share says.
- *The draw* is thin too: the leathers' one Aggro step puts a Valkyrie level with an ordinary unit, and Matador's cape, which would make a dodger Taunt, is the same slot as Tempest cloak and Hooded cloak.
- *Loops.* None new.

**15. Every colour: meets as sized; a row of five is rare without help.**
- *The sum.* The size is on the card: a fifth for each different affliction, so five double the curse, about 1,160 to 2,320 before Defense on every foe.
- *How long the row is.* On a lone boss a Hexer keeps two kinds up alone (its own Chill, Enfeeble's Sunder), and a third, the last curse's Bleed, only until the party's next few hits close it. The Wildmagic wand adds one kind in five each swing, and a few Burn, Shock or Bleed lasts about 10 to 16 ticks, so a curse every 25 ticks finds three or four kinds: about two thirds more. All five together is perhaps one curse in ten. Festering idol changes that: each kind stays once it lands, and the row is full for the back half of a boss fight. Beside any fire and any storm in the party, four or five is the usual row.
- *In a pack* the wand's stacks are scattered and each foe holds one or two kinds. Grimoire of plagues gives every foe two, but its Burn is gone in about ten ticks, so the first curse has to be ready early, and cooldowns carry.
- *Cards and loops.* Nothing stops it; nothing new.

**16. The lead's colour: meets, several times over.**
- *The sum.* Behind a Hexer, each Follower's swing adds the Hexer's Chill off its own Attack, about 3.6. Three weapons lay about 1.5 Chill a tick, where the Hexer alone lays about half a stack a tick. On a lone foe that's a shatter about every 8 ticks against one every 22 to 24: four or five shatters in a regular fight in place of one. In a pack of four each foe reaches the cap at about tick 30, which one unit never does. With fire on the Lead's swing, three weapons hold about 17 Burn on a lone foe where one holds about 6.
- *Past the size.* A slow kind's rider is sized to a slow swing (Censer mace's 9 Burn every 11 ticks, the frost pieces' 5 Chill), and a Follower lays it whole at a dagger's pace. Two shares flag it for the balance pass.
- *Cards.* Round 3 reworded The standard. Mimic wand is blank beside a high-Attack ally whose swing carries nothing, as its share says.
- *Loops.* None: what's borrowed isn't borrowed on.

**17. The emptied quiver: meets.**
- *The sum.* A burst runs one arrow more for each crit, so at a chance of four in five it averages five arrows, and at three in four, four. Bloodscent knife takes a Ranger's swing to about 71% to 80% on a bleeding foe: three and a half to five arrows. Ambush knife and Vulture's skull are four in five: five arrows. The king's head doubles a Ranger to about 42% to 60%: about two. Gambler's coin: two. Round 1 ruled five where the link asks three or four.
- *On a wound.* Barbed volley's 5 or 6 Bleed pays about 670, 450, 300, 200 and 130 to five arrows running, so every arrow of the burst is paid.
- *Assumed.* The arrows pick at random, so the knife's burst needs the bleeding foe to be the one picked: Barbed volley makes every foe bleed, and a Mark aims it.
- *Loops.* None beyond the engine's own, and its brake holds wherever a card sets the chance. Plain Crit chance from stats is already with the director.

### Casts and mana turn them over

**18. The blood mage: doesn't meet at the Lifesteal the link names.**
- *The link.* A cast loses life on one foe and gains it on three, and "a common on the amulet is enough".
- *The sum, in Flagellant's vestments.* A Stormcaller's Chain lightning costs about 300 HP (15% of its bar, with the robe's own MP steps). After a minion's Defense it deals about 950 to its first foe and about 500 to each of three more. At the amulet common's tenth of Lifesteal it drinks back about 195 from three foes and 245 from four: it loses life on every cast. A Pyromancer's Fireball costs about 345 and drinks back about 65 a foe: even at five or six.
- *At a fifth of Lifesteal* the size is met: the chain gains from three foes (390 against 300) and the Fireball from three (about 130 a foe). A fifth is two Lifesteal sources, or Blood oath's Drinker seat.
- *Under The covenant* Lifesteal is already a fifth, but the price is bigger, since nothing adds to the pool: a Fireball is 526 and breaks even on four, and a chain is 565 and drinks back about 490 from four, so it never pays for itself without a Lifesteal step on the caster's own gear. The formations share has these as even on three; it counted the damage before Defense.
- *A Frostweaver's Blizzard* never pays, in either: about 70 back a foe against 700 to 1,300.
- *Already known.* The armor share reached the same sum, and the lead has taken the price's size to the director. It's in the sample.
- *Loops.* One more member of a listed family: under The covenant with Bloodstone reliquary in the party, every price one unit pays is healed onto another, so the party's casts cost it nothing in sum. Cooldowns and wind-ups still hold everything, so it's a size.

**19. The resonance: meets.**
- *The sum.* A tenth of the cooldown for each foe hit: twice as fast at five foes, two and a half times at six, three and a third at seven. A Pyromancer's Fireball against six comes round in about 12 ticks in place of 31, and its pool pays for three of them, so mana stops it inside one fight. A Frostweaver's pool pays for two Blizzards.
- *On the Stormcaller,* the class the engine names, the chain reaches four foes at most, so it's about one and two thirds times as fast, and with Recharge mana no longer stops it (listed).
- *Cards and loops.* Nothing stops it; nothing new.

**20. The crescendo: doesn't meet at an ordinary pace, except on a pool that was already short; it meets where something else repeats the spell.**
- *The link.* The price empties a pool within a fight unless the free casts skip it.
- *The sum.* A stack is a fifth more of what the spell does and a fifth more of its cost, and it lands when a cast finishes. A quick spell is cast about four times in a regular fight, so the count reaches three. A Pyromancer's four Firebolts cost 450, 540, 630 and 720: 2,340 where plain they cost 1,800, from a pool of 4,800 with the charm's own step. So the price adds about a quarter to that one spell and about a tenth of a pool to the fight. A spell on a medium cooldown is cast twice, and pays a fifth more once.
- *Where the pool was already short* it does empty: a Stormcaller's four Chain lightnings cost 3,380 with the charm, its whole pool, where plain they cost 2,600. That's the pool's size more than the price: the price is one cast's worth either way.
- *What the player sees at that pace:* the fourth Firebolt lands three fifths harder, which is seen. The mana bar "emptying faster each time" is seen on the Stormcaller (a fifth of the bar, then a quarter, then a third) and not on the Pyromancer. A free cast that skips the price saves a fifth to three fifths of one cast.
- *Where it meets.* The cathedral's Soloist casts one spell every five ticks: six Firebolts cost 4,050 and empty a Pyromancer's pool in about 30 ticks, where plain it lasts ten casts. A resonance in a full pack, or a boss fight of 90 ticks, gets about halfway there.
- *Orb of the rising sun* has no price at all, as the spine says: with it the engine is the growth alone.
- *Loops.* None new.

**21. Mana as armour: meets.**
- *The sum.* A bandit's blow takes about 520 from a Pyromancer, and with Orb of the deep it comes out of a pool of 5,800 in front of a bar of 2,000. One Clarity gives it about 1,400 over 16 ticks, in four notes of about 350: nearly three blows. Shepherd's staff gives 225 to 500 a cast, Font relic about 1,160 a heal, Wellspring's Conductor about 580 a cast, Blood for mana 800 at once. Each is half a blow to two blows, so each is seen as a blow not taken.
- *The small notes.* The Bard's Refrain (100 to 190, to a random ally) and Tithe wand (90 to 150) are a fifth to a third of a bandit's blow, or about one wolf's bite. `builds.md`'s "every note of the Bard's that reaches it is a heal" is true against bites and thin against blows.
- *Not in the link, and worth knowing.* The orb alone nearly quadruples what its holder can take, before anyone gives it anything, and every blow it takes is mana the run doesn't get back.
- *Cards and loops.* Nothing stops it; nothing new. Clear-headed charm on the orb's holder is a Clarity every 22 ticks for as long as blows hold its MP under half, about what one bandit deals to it.

### A shatter turns them over

**22. The shatter bell: meets as sized; which ability rings isn't what `builds.md` names for two of its four classes.**
- *The sum.* The size is the card's: the slowest ability, whole, at each shatter. With one Frostweaver the first shatter comes at about tick 30 on the foe it lances, so the bell rings once in a regular fight and twice in a long one. It rings on a beat only where the party's cold is deeper (the frozen gate, the lead's colour, Hail).
- *Which ability.* The fill rules "slowest" as the longest whole cooldown, in ticks. From `classes.ts`, with each ability's own small shift, that's Pyre for the Pyromancer and Tremor for the Geomancer, which are blows worth ringing. For the Paladin it's Condemn, not Smite: all three of its abilities are the medium word, and the small shift each cooldown gets puts Condemn two ticks over Smite. For the Hoplite it's Aspis, an Aegis, not the shove. `builds.md` names Smite and the shove.
- *The rest.* For nine more classes the slowest is a buff, a heal or a revive: Fortify, Raise (which waits for a fall), Regrowth, Choosing, Allegro, Flow, Frenzy, Static charge, and the Hexer's Unmake (which waits for a cast). Floe charm fits every class, and for ten of the sixteen a shatter rings nothing a player would call a great spell.
- *Where it does ring the blow.* Monolith shield, which the spine tags as this engine's common half, doubles a damaging ability's cooldown, and that makes Smite the Paladin's slowest: the two together are the engine as written, on a Knight, a Paladin or a Geomancer. The Hoplite can't hold it.
- *Cards.* The card says "slowest, by its whole cooldown", and the sheet shows ticks, so a player can work out which. They can't steer it except by a version, or a power step that shortens a cooldown.
- *Loops.* None beyond those listed.

**23. The firecracker string: meets, where the field has a second source of cold.**
- *The sum.* Winter's chain sends 6 to the coldest other foe: to the cap from 6 or more, and to 6 to 9 from a warm one. Splinters sends 4 to every other foe: to the cap from 8. Frostwalker's furs sends about 3: from 9. Glacier's heart puts 6 back, so a lone foe's second shatter takes half the cold of its first.
- *The other side.* A Frostweaver's own Blizzard and Stillness leave a field at about 4, each once a regular fight. So with the Frostweaver alone the cold sent on doesn't burst a neighbour: it takes it to 8 to 10, and the next lance finishes it, a few ticks later in place of thirty. With Hail (about 3 on every foe every 15 ticks) or a rider, the field is at 8 by the middle of a fight and the burst runs.
- *The long winter* stops matching the link late in a fight, by design: from the sixth shatter it sends a cap's worth to warm foes too.
- *Loops.* None beyond those listed. All of them rest on the chain's damping, which no card states.

### Who gets picked, and who's healed, turns them over

**24. The brink: meets with a Shield-giver; with a Guard alone it's close.**
- *The sum.* A Vampire under Halved heart sits at 2,250 of 4,500 and is the lowest by share from the first tick. Beside a Geomancer and a Cleric it takes about two picks in five; four bandits put about 2,600 on it over 40 ticks. One Earthen shell covers 2,250 of that and a second comes round in the fight; Comrade's targe adds about 900 every 22 ticks. So the cover outlasts what reaches it. With only a Knight's Fortify, the Guard takes about a third off for most of the fight, and the unit ends near 350.
- *Under Blood oath* the Bleeder is lowest at once and the Donor's doubled Cure is worth a hundred ticks of the drain, as its share says.
- *How low.* The cap holds a unit at half, which wakes everything written for "below half" and nothing written for 30%. A price or a drain goes lower, as the versions share says.
- *Cards.* A heal on the capped unit is wasted unless a red stone piece is there to take it. The card says healing past half "counts as healing past full", which tells a player who has met Red stone mail and nobody else.
- *Loops.* None beyond those listed (Aegis mail and Shroud charm on a unit that pays, which is in the sample).

**25. Two in the dark: meets in a pack; against a lone boss it covers a sixth to two fifths.**
- *The sum.* Hidden lasts 10 ticks. Shadow cloak and Decoy's Shadows lay it at the start and at each fall. With four foes falling across a 40-tick fight, that's nearly all of it. Against a boss there are no falls: 10 ticks of 60 to 90. Smoke screen covers about two ticks in five of any fight, on the lowest ally. Shroud charm lays it at each crossing of a third, so only a unit that pays and is healed back gets it often.
- *Cards and loops.* Nothing stops it; nothing new. The rule that someone stays in the light is on Decoy's card and on no piece's.

**26. The red stone: meets.**
- *The sum.* A full Vampire in Red stone mail turns about 110 of each fist swing and about 420 of each Blood drain into Shield: roughly 50 a tick while it isn't being hit, a bar the player watches fill toward its cap over a fight. Phylactery turns a Cleric's Regen on a full ally into nearly half that ally's bar in Shield over 24 ticks.
- *With the brink.* Under Halved heart every drink is past full from the first tick, and the Vampire's doubled Lifesteal rebuilds a whole Shield about every 15 ticks.
- *Cards and loops.* Nothing stops it; nothing new.

### Exotics

**27. The borrowed gift: meets.**
- *The sum.* The copy is the same size, on both cards. What it copies is worth seeing for most kits: an Assassin's Vanish every 25 ticks, a Vampire's 10 Might, a Knight's Vanguard (1,000 of Shield, which is a caster's whole cap), and every Shield the Valkyrie's hits give her.
- *Cards.* Twin-knot's second sentence is the hardest in its share, as the share says.
- *Loops.* None beyond those listed.

**28. The carrier: meets.**
- *The sum.* A Monk in Carrier's coat lands about one hit every two ticks. Under Burning heart it always holds Burn, so each hit adds one: about 6 Burn held on a lone foe, some 170 damage a tick, which is about what the Monk's own blows deal. Carrying Chill, the same hits bring a lone foe to a shatter in about 26 ticks.
- *Its price.* Burning heart costs its wearer about 40 HP a tick, half a Monk's bar in a regular fight, and its own Lifesteal gives back most of that only while the Monk is hitting.
- *Cards and loops.* Nothing stops it; nothing new. Scapegoat charm is the same slot as Burning heart, so the two that work against each other never meet on one unit through the amulet.

## New loops

One, and it's a listed pair tipped over its line.

- **Everflame lantern with Bellows wraps, once the Monk is faster.** Two shares list this pair as holding "by a narrow sum". The lantern adds a tenth of the hottest foe's Burn every 3 ticks, the wraps a twentieth with each hit, and Burn loses 15% every 2 ticks. By my sum the line is about eight hits in eight ticks on one foe: under it the fire still drains, over it the fire grows with nobody feeding it.
  - *Where the listed Monk stands.* Hasted, with Hummingbird charm and its second strikes, it lands about six from swings and two more from Burning fist while its mana lasts. That's at the line, not under it.
  - *What takes it over.* Speeds add (`src/engine/combat/stats.ts`). The forge gives every ally ten Heat after 40 burning ticks, half again as fast in everything: about seven from swings and three from fists. Tireless bell: about eight from swings, ten with fists. The two together: about nine from swings alone. The forge is Bonfire's own legendary formation, so the party that holds the lantern and the wraps is the one that sits in it.
  - *What happens.* Past the line the fire climbs by 1% to 3% a pulse by itself. At the line nothing the party feeds it is lost, so a fed fire that would settle near 24 stacks keeps climbing all fight. Burn has no cap.
  - *Brake.* Where the extra hits are Burning fist's, the Monk's mana: its pool pays for three casts, about 20 ticks. Where the swings alone are over the line (the forge and the bell together), only the fight ending. It needs one foe taking all the Monk's hits, so a lone boss, and Heat takes 40 ticks to fill.

Three notes on loops already listed:
- **Hunter's mark with Writ of judgement** is still listed in the amulets share. Writ's card closed it in round 1: a Mark from gear doesn't call the blow.
- **Floe charm with Meltwater orb on a Frostweaver** is listed as ringing Blizzard. By the ruling on "slowest", a Frostweaver's slowest ability is Stillness (33 ticks against Blizzard's 26). Stillness lays Chill on every foe too, so the loop stands, at Stillness's cost. Under Deep calm, which lays no Chill, there's no loop.
- **The covenant with Bloodstone reliquary** belongs with the casts whose price is gone: every price one unit pays is healed onto another, so the party's casts cost it nothing in sum. Cooldowns and wind-ups still hold.

## The director's sample

Twenty-five items: every slot and rarity, a formation at each rarity, three versions, a mythic that changed and one that was kept, and the two kit changes. Eighteen are here as doubts, six as the fill at its best, and one to show a plain common. The four the rulings send here are marked. Each says what the item is and who wears it, what it does, and what there is to judge.

### The two kit changes

**1. Marked.** *A doubt.* Marked is a status on a foe, in the game's vocabulary, laid by the Paladin's Condemn and by the Hunt's pieces. Its line now reads: "The party's basic attacks, and its abilities aimed at a random foe, go to it." Today only basic attacks follow it. It lasts 14 ticks, and gear never adds a second Mark to a party that has one.
- *To judge.* It's the Hunt's steering wheel, and it's short: by the spine's own count, under half the time a Marked foe takes to fall. Hunting horn and Swift justice both wait for a foe to fall while still Marked, so they fire often only where something keeps the Mark up. An ability with an aim of its own ignores the Mark once that aim finds a foe: a fight's first Firebolt follows the Mark, and the ones after follow the fire. Huntmaster's quiver gives every arrow an aim of its own, so the Ranger's mythic takes its arrows off the Mark.

**2. Malison.** *A doubt about its size; its engine meets.* The Hexer's curse on every foe. Its card: "Curses every foe: light damage that scales from Attack, a fifth more for each different affliction the foe holds (Burn, Chill, Shock, Bleed, Sunder), then a few Bleed; stacks scale from Attack." Today it adds a stack to each affliction a foe already holds and deals nothing.
- *What it comes to.* About 950 on a clean foe after a minion's Defense and about 2,100 on a foe that holds all five, on every foe, about every 25 ticks, for 450 MP.
- *To judge.* Its share chose a light hit over the scale's smallest, so that the Hexer's own number is seen: it's more a cast than a Fireball's own hit, for under half the mana. And the row: by my sum a curse on a boss usually finds three or four kinds, not five, unless Festering idol or a fire and a storm are in the party; in a pack each foe holds one or two.

### Mythics

**3. Huntmaster's quiver.** *A doubt. Sent here by round 1.* The Ranger's mythic, worn as armor; kept, at a new size. Its card: "The Ranger's abilities that aim at one foe aim past any guard at the foe with the lowest current HP. When a foe one of its abilities hit falls, the Ranger's abilities are ready again." Today the fall halves the cooldowns left, which saved three to five ticks an arrow and was never seen.
- *What it comes to.* A round of the three arrows is about 3,700 after Defense, close to a bandit's whole bar, takes about ten ticks and costs 725 MP. A full pool pays for about three rounds. With the Barbed volley version, every foe on the field has been hit, so any fall by anyone's hand readies everything.
- *To judge.* It's the right kind of reward, a whole action for a kill, and it may be too much of it. Mana is its only brake.

**4. Writ of judgement.** *A doubt. Sent here by round 1.* The Paladin's mythic, an offhand; new, in place of Chains of light. Its card: "Whenever the Paladin's Condemn Marks a foe, a heavy blow falls on that foe at once: heavy damage that scales from Attack, adding several Burn; stacks scale from Attack. A Mark from its gear or its seat doesn't call it."
- *What it comes to.* About 4,900 after a minion's Defense, since the Mark turns the Paladin's own Judgement on, with about ten Burn behind it. It has no cooldown and no cost of its own: one blow a Condemn, so about once a regular fight.
- *To judge.* Alone it's a second Smite on Condemn's clock, which its share thinks may be small for a mythic. Beside Swift justice (item 5) each kill under the Mark readies the next Condemn, so it's up to five such blows and five volleys running, at 650 MP each.

### Versions

**5. Swift justice** (the Paladin's Condemn, version B; changed). *One of the best.* Its card: "Marks the foe with the lowest share of max HP, and every ally's next basic attack comes at once. When a foe falls holding the Paladin's Mark, Condemn is ready again."
- *Why it's here.* It's the judge's drum in one version, and the sum closes: beside a Hoplite the call is about 6,000 at once on the weakest foe, the foe falls under the Mark, and the drum beats again, five times from a full pool. A player sees a foe fall, the Mark jump and three weapons land together.
- *To judge.* The spine keeps it apart from Hunting horn, which calls the same swings by another road; with both, a fall calls the party's weapons twice.

**6. High pyre** (the Pyromancer's Pyre, version B; changed). *One of the best, and the item reader's pick.* Its card: "Waits until a foe holds 20 Burn or more. Deals heavy damage that scales from Attack to the foe with the most Burn, rising by 500 with each Burn stack on that foe as it lands. The Burn stays."
- *Why it's here.* It changes when a spell fires, by a number the player reads on the foe. On thirty Burn it lands for about 19,000 before Defense, where Pyre lands for about 10,000. A lone Pyromancer's lands on about twelve, because the fire loses nearly half its stacks in the eight ticks of the wind-up; a party that keeps feeding lands it on thirty.
- *To judge.* Whether 20 is the count. One Firebolt leaves the fire at about 16, so it opens on the second.

**7. Frost fist** (the Monk's Burning fist, version A; kept, at a new size). *A doubt.* Its card: "Three quick hits on the foe with the most Chill; each deals damage that scales from Attack and adds a few Chill; stacks scale from Attack."
- *What it comes to.* About 10 Chill a cast against a cap of 12, on a quick cooldown, for 200 MP: the second cast bursts the foe. With its power step it's about 14, a shatter and a Stun with every cast.
- *To judge.* It's Cold Snap's first step from a kit, sized to be seen. At that size a lone foe that isn't a boss is Stunned for more than half of every cooldown, which is the lock round 2 took off Rimed blade. The Monk's pool pays for three.

### Weapons

**8. Bardiche** (great weapon, common; Hoplite, Paladin, Geomancer). *Here to show a common.* Its card: "A heavier swing." Its stats: Attack +1, on a swing a fifth harder, where the kind's other common carries two steps and a plain swing.
- *To judge.* Commons carry stats and no effect. This is one of two in the fill whose card has words, because it trades a step for a harder swing. It asks a player to weigh a swing against a stat on the plainest kind of piece.

**9. Censer mace** (mace, uncommon; Cleric, Paladin, Bramble knight). *A doubt.* Its card: "Its basic attacks add many Burn (from Attack)." Its stats: HP +2, Defense +1.
- *What it comes to.* About 9 Burn a swing on a Paladin, 7 on a Cleric, 5 on a Bramble knight, every 11 ticks. On one foe a Paladin's mace alone keeps about 10 Burn up, which deals about three times what the swing itself does, at no mana: two thirds of a Pyromancer's Firebolt with every swing.
- *To judge.* It's the spine's bend at its biggest: a status on a swing as an uncommon's effect, sized to be seen. Behind The standard or a Mimic wand a faster weapon lays the same nine at twice the pace.

**10. Provoking blade** (sword, rare; Knight, Hexer, Valkyrie). *A doubt, and the spine's own.* Its card: "When one of its basic attacks lands, the foe it hit makes its own next basic attack at once, at whoever that foe would have picked." Its stats: Attack +1, Aggro +1, Defense +1.
- *What it comes to.* Every swing buys a foe a free blow. It pays only where a foe's blow costs the foe: a Knight with Emberguard turns each called blow into about 1,000 of fire on a boss for about 500 taken. It sets a slow boss swinging at the sword's pace.
- *To judge.* Whether a player ever picks a sword that makes foes swing. Nothing on the card hints that it can pay, and the blow lands on whoever the foe picks, not on the wearer.

**11. Sarissa** (spear, legendary; Hoplite, Valkyrie, Monk). *One of the best, and the item reader's pick.* Its card: "Each of its basic attacks also hits every foe that has hit its wearer since its last basic attack, each for the swing's full damage." Its stats: Aggro +2, Defense +1, HP +1.
- *Why it's here.* One sentence and a picture. On a Hoplite each doubled swing, about 2,000, lands on every foe that touched it in the 19 ticks since the last. Its steps are the draw and the body it needs.

### Armor

**12. Flagellant's vestments** (robes, rare; Cleric, Bard, Pyromancer, Frostweaver, Stormcaller). *A doubt. Sent here by round 1, for the sums of "the same share".* Its card: "Its wearer's abilities cost HP in place of MP: the same share of its max HP as they'd cost of its max MP. It won't cast one that would leave it below a tenth of its max HP." Its stats: MP +2, Aggro −1.
- *The sums.* In the robe a Pyromancer's Fireball costs about 345 HP (17% of its bar), a Firebolt 155 and a Pyre 517. A Stormcaller's Chain lightning costs about 300, a Frostweaver's Blizzard about 700, a Cleric's Cure about 215.
- *To judge.* Two things. The price is a share, so a bigger pool makes every spell cheaper in life: mana gear is what makes its wearer bleed less, which a player may find backwards. And the engine it's the keystone of doesn't close at a common's Lifesteal: the cast loses life on four foes (engine 18).

**13. Duelist's leathers** (leather, rare; Ranger, Valkyrie, Bard, Monk, Assassin, Stormcaller). *A doubt.* Its card: "Each time its wearer dodges a hit, it strikes the attacker with its weapon." Its stats: Evasion medium, Aggro +1, Attack +1.
- *To judge.* It's the riposte's keystone, and in play it was worn by units that drew nothing. Its steps now carry a little draw and a dodge of one blow in five. The engine asks the answering strike to bank cover for the blow that lands, and by my sum it doesn't on either class it's meant for (engine 14): a Valkyrie banks about 50 for each 340 she takes, and a Monk's strike banks nothing. The uncommon Hooded cloak, a Shield on every dodge, is what makes the picture.

**14. Aegis mail** (mail, legendary; Bramble knight, Paladin, Valkyrie, Hexer, Vampire, Frostweaver). *A doubt. Sent here by round 2, set off by a price.* Its card: "Whenever an ally drops below a third of its max HP, that ally gains Aegis." Its stats: HP +2, Defense +1, Lifesteal medium.
- *What it comes to.* An Aegis blocks the next damage bigger than a quarter of its holder's bar. Round 1 ruled that paying HP across the line counts as dropping below it, so a caster in Flagellant's vestments sets it off by casting. It fires again each time that ally is back at a third and crosses again, so beside a healer it's an Aegis every cast or two. HP carries, so a payer that ends a fight low starts the next one behind an Aegis.
- *To judge.* `builds.md` already fears a unit that can't fall. By my sum it isn't quite that: on a Pyromancer the Aegis stops a bandit's blow, barely, and anything heavier, and a wolf's bite or a status passes; on a Vampire, with twice the bar, it stops only the heaviest swings and a boss's great blows.

### Offhands

**15. Matador's cape** (cloak, uncommon; Valkyrie, Monk, Ranger). *One of the best, and the item reader's pick.* Its card: "Each time its holder dodges a hit, it Taunts." Its stats: Evasion medium, Defense +1.
- *Why it's here.* A first step that's seen the first time it fires and gives a class a job it didn't have: a Monk in it dodges more than half of what's aimed at it, so after its first dodge it holds the foes for the rest of the fight. It's also one end of a listed loop with Goading totem, braked by a round with no dodge.

**16. Orb of the deep** (orb, rare; Pyromancer, Frostweaver). *One of the best, and the item reader's pick.* Its card: "Damage that would reach its holder's HP comes out of its MP instead, point for point, while it has any. A Shield still takes the damage first." Its stats: MP +2, MP regen +1.
- *Why it's here.* Nothing to explain, and it turns one stat into another's job. A Pyromancer holding it has 5,800 MP in front of 2,000 HP, and every Clarity is nearly three blows not taken.
- *To judge.* MP doesn't come back between fights by itself, so every blow it takes is a spell the run doesn't cast. That's the design's cliff; the director may want to see it once.

**17. Everflame lantern** (lantern, legendary; Cleric, Pyromancer). *A doubt.* Its card: "Every 3 ticks, the foe with the most Burn gains Burn: a tenth of what it holds." Its stats: Cast speed high, Attack +2.
- *What it comes to.* A fed fire stands about three fifths higher, and a fire nobody feeds for a Stun's length keeps two thirds of itself.
- *To judge.* Its beat decides everything, and its share picked the middle. With Bellows wraps on a fast Monk the fire all but stops draining, and with The forge's Heat or Tireless bell on top it grows by itself, with no cap (*New loops*).

### Amulets

**18. Carnelian** (amulet, common; everyone). *A doubt about the link it carries.* Nothing beyond its stat: Lifesteal medium, a tenth of each hit's damage.
- *To judge.* The spine makes it Blood Pact's sign for any class, and the blood mage's link says a common on the amulet is enough. It isn't: at a tenth a blood mage's wide spell loses life on four foes. Either the common is the sign and not the engine's half, or the price is too big for it.

**19. Tinder charm** (amulet, uncommon; everyone). *A doubt, and the spine's own.* Its card: "Its wearer's basic attacks add a few stacks (from Attack) to whichever of Burn, Chill, Shock or Bleed their target holds the most stacks of. If two are level, one of them at random. On a foe that holds none of the four, they add nothing." Its stats: Attack +1, HP +1.
- *To judge.* It makes any unit a second feeder for whatever the party has started, in any colour, which is what a status road's first step needs and may be what makes four roads feel like one. It's the hardest uncommon to read, and it's blank in a party that lays no status.

**20. Floe charm** (amulet, rare; everyone). *A doubt.* Its card: "When a foe's Chill shatters, its wearer's ability with the longest cooldown is ready at once: its slowest ability, by its whole cooldown. If that one is ready already, nothing happens." Its stats: Cast speed medium, MP +1, HP +1.
- *To judge.* Which ability that is. For a Pyromancer it's Pyre and for a Geomancer Tremor, which is the engine. For a Paladin it's Condemn and not Smite, by two ticks; for a Hoplite it's the Aegis and not the shove; for nine more classes it's a buff, a heal or a revive (engine 22). It fits every class and rings a blow for six of the sixteen. With one Frostweaver it rings once in a regular fight.

**21. Heart of winter** (amulet, legendary; everyone). *A doubt.* Its card: "Whenever its wearer adds Chill to one foe, every other foe gains as many stacks. What already adds Chill to every foe is unchanged. The Chill it adds isn't added again." Its stats: Attack +1, Attack speed medium, Cooldown medium, HP +1.
- *What it comes to.* One source of cold becomes the whole field's. Worn by a Knight in Hoarfrost plate, every blow any foe lands on him puts about 4 Chill on every foe: three blows from anyone and the whole pack bursts at once, for 3,000 each and a Stun. A pack of bandits is dead from its own first six blows.
- *To judge.* Two shares say it may be Cold Snap's far end in one piece. Nothing in it loops: the foes' own blows are its clock.

### Formations

**22. The standard** (formation, common). *A doubt about its card and its size; the engine it carries is one of the best.* Its card: "Two follow the lead's colour. **Lead:** Nothing of its own. **Follower** (two seats): Its basic attacks add whatever statuses the Lead's basic attacks add to their target. They're added as its own would be: on the same condition, with stacks from the Follower's own stats, and never twice from one source. What it borrows isn't borrowed on by anyone else."
- *What it comes to.* Behind a Hexer, three weapons bring a lone foe to a shatter about every 8 ticks where the Hexer alone takes 22. Behind a Censer mace, both Followers lay nine Burn a swing at their own pace.
- *To judge.* It's a road's first step in any colour, as a common, and it's still the longest common card in the fill after round 3 reworded it. It's blank behind a Lead whose swing carries nothing. And it meets its link several times over.

**23. Hammer and anvil** (formation, rare). *One of the best.* Its card: "Every blow the Anvil takes is saved for the Hammer. **Anvil:** Draws far more. Each hit it takes adds a Wrath to the Hammer. **Hammer:** Holds the Wrath (its next basic attack deals a fifth more for each Wrath, up to 10, and spends them). **Smith:** Its heals and Shields on the Anvil are a third bigger."
- *Why it's here.* Three seats about one thing, which is what `builds.md` asks of a formation, and a counter the player watches climb. A swarm fills the count between two of a Hoplite's swings, and the swing lands for about 9,700.
- *To judge.* The count's ceiling binds early against a pack, and against a lone boss the swing gains two or three fifths.

**24. The covenant** (formation, legendary). *A doubt. Sent here by round 1, for the sums of "the same share".* Its card: "Life is the party's one currency. **Sworn** (all three seats): Nothing of its own. **The party:** Every ally's abilities cost HP in place of MP: the same share of its max HP as they'd cost of its max MP. No ally casts one that would leave it below a tenth of its max HP. Every ally has Lifesteal, high."
- *The sums.* A cast is 7% to 43% of its caster's bar. A Knight's Fortify is a third of its bar (about 1,600 HP), a Monk's Pressure point and a Valkyrie's Choosing 43%, a Cleric's Cure a fifth, a Pyromancer's Fireball 26% and its Pyre 39%, a Frostweaver's Blizzard 43%. A Vampire's Blood drain is 7%, and it drinks back more than it pays. Most units can pay for two or three casts a fight.
- *To judge.* The price falls hardest on the units whose skills are cheapest in mana, because their pools are small: a Knight's Guard costs it more life than a Pyromancer's biggest spell costs the Pyromancer. After Defense a Fireball breaks even on four foes and a Chain lightning never quite does (engine 18). The Vampire's mythic, The chalice, uses the same share against the Vampire's bar: a Monk's Flow costs the Vampire about 1,070 HP and a Pyromancer's Firebolt about 470.

**25. The cathedral** (formation, legendary). *A doubt, and the spine's boldest line.* Its card: "Two voices give all their mana to one, and it never stops singing. **Soloist:** Its first-slotted ability has no cooldown: it's cast again whenever there's the MP for it. Its wind-up, its cost and whatever it waits for stay. **Voice** (two seats): All MP it would regain in a fight goes to the Soloist instead, and isn't sent on again. Each cast the Soloist finishes gives this seat a Shield: a twentieth of its max HP."
- *What it comes to.* A Firebolt every five ticks empties a Pyromancer's pool in about forty, and in about thirty with Crescendo charm. The pool carries, and the Voices can't refill theirs.
- *To judge.* Whether it reads as a formation that spends a run's mana in one fight. A self-buff or a Taunt slotted first is cast until the pool is gone. And everything that removes the price (The deep well under Clarity, the vestments with Lifesteal, The chalice) leaves only the wind-up as a brake, which the spine lists.
