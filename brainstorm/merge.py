import json, sys

# The merge behind board.html: every list's entries, placed on cards by meaning.
# python3 brainstorm/merge.py cards.json writes the board's card data.

# Per-list keys in the source data: y = yours; Opus runs g (A genre), s (B system), f (C fights);
# other models c (GPT), m (Gemini), k (Grok), d (DeepSeek).
# The output is per model: y, o (Opus, from g/s/f), c, m, k, d.
# st: lists that put it above their staples line. kit: lists that only had it inside a class.

E, S, T, C = "element", "status", "stat", "class"
cards = []

def card(b, id, n, ln, as_, yours=None, st="", needs=None, fit=None, note=None, kit=""):
    cards.append(dict(b=b, id=id, n=n, ln=ln, as_=as_, yours=yours, st=st, needs=needs or [], fit=fit, note=note, kit=kit))

def el(*a, **k): card(E, *a, **k)
def stt(*a, **k): card(S, *a, **k)
def sta(*a, **k): card(T, *a, **k)
def cls(id, n, ln, as_, needs, **k): card(C, id, n, ln, as_, needs=needs, **k)

# ---------- Elements ----------
el("fire", "Fire", "Big, hungry, all-out damage.", dict(y="Fire", g="Fire", s="Fire", f="Fire", c="Fire", m="Fire", k="Fire", d="Fire"),
   yours="Ramping damage; Burn, a DoT proportional to health.")
el("ice", "Ice", "Slow and steady; it stalls and grinds foes down.", dict(y="Ice", g="Ice", s="Frost", f="Frost", c="Ice", m="Ice", k="Ice / Frost", d="Ice"),
   yours="Consistent, reliable damage; the tempo debuff element: slows, weakens, etc.")
el("lightning", "Lightning", "Sudden strikes that jump between foes.", dict(y="Lightning", g="Lightning", s="Lightning", f="Storm", c="Lightning", m="Lightning", k="Lightning / Thunder", d="Lightning"),
   yours="AoE; Shock, which hurts fast units by damaging on action.")
el("earth", "Earth", "Heavy and grinding: stone and mountains.", dict(y="Earth", g="Earth", s="Earth", f="Stone", c="Earth", k="Earth / Stone", d="Earth"),
   yours="Low damage in general, with spiky high-damage, lower-accuracy hits; shields and poison.",
   fit="work", note="Magical damage can't miss under step 4's rules, so lower-accuracy Earth spells would need a change or another way to be spiky.")
el("wind", "Wind", "Light, quick cuts.", dict(y="Wind", g="Wind", s="Wind", c="Wind", k="Wind / Air", d="Wind"),
   yours="Multi-hit focus; crit, evasion and speed.")
el("light", "Light", "Holy fire; heals, shields and sears the dead.", dict(y="Holy", g="Light", s="Light", f="Light", c="Light", m="Holy", k="Holy / Light", d="Light"),
   yours="Strong spells on non-offensive classes: healing, regen and revive. Rarely resisted, but rarely used by offensive classes.")
el("dark", "Dark", "Curses, draining and the grave.", dict(y="Dark", g="Dark", s="Shadow", f="Shadow", c="Dark", m="Shadow", k="Dark / Shadow", d="Dark"),
   yours="Middle-of-the-road regular damage (dark magic as a basic attack); powerful but often resisted; esoteric effects.")
el("water", "Water", "Tides and drowning, a crushing weight.", dict(g="Water", c="Water"))
el("neutral", "Arcane", "Raw magic: almost nothing resists it, and nothing is weak to it.", dict(g="Aether", f="Arcane"))
el("nature", "Nature", "Regenerative or toxic.", dict(k="Nature / Poison"))
el("spirit", "Spirit", "Souls; the one thing that truly hurts ghosts.", dict(f="Spirit"))

# ---------- Statuses ----------
stt("poison", "Poison", "Steady damage on a timer; doses stack.", dict(y="Poison", g="Poison", s="Poison", f="Poison", c="Poison", m="Poison", k="Poison", d="Poison"),
    yours="Consistent DoT.", st="ygsfcmk", fit="ok")
stt("regen", "Regen", "Heals a little on a timer.", dict(y="HP Regen", g="Regen", s="Regen", f="Regen", c="Regeneration", m="Regen", k="Regen", d="Regeneration"), st="gsfcmkd", fit="ok")
stt("haste", "Haste", "Acts faster: attacks, cooldowns or wind-ups.", dict(y="Haste", g="Haste", s="Haste", f="Haste", c="Haste", m="Haste", k="Haste", d="Haste"), st="gsfcmd", fit="ok")
stt("stun", "Stun", "Can't act, and loses what it was winding up.", dict(y="Freeze", g="Stun", s="Stun", f="Stun", c="Stun", m="Stun", k="Stun", d="Stun"),
    yours="Freeze (stun).", st="gsfcmk", fit="ok")
stt("shield", "Shield", "Soaks a pool of damage before HP.", dict(y="Shields", g="Barrier", s="Shield", f="Barrier", c="Barrier", m="Shield", k="Shield / Barrier; Shield Charges", d="Barrier"),
    st="ysfckd", fit="ok")
stt("silence", "Silence", "Can't use abilities, only basic attacks.", dict(y="Silence", g="Silence", s="Silence", f="Silence", c="Silenced", m="Silence", k="Silence", d="Silence"), st="gsf", fit="ok")
stt("slow", "Chill", "Acts slower; some versions stack, and one freezes at 5 stacks.", dict(y="Chilled", g="Slow", s="Chill", f="Chill", m="Chill", k="Slow; Freeze", d="Slow"),
    yours="Chilled: slow, and decrease evasion.", st="ygd", fit="ok")
stt("taunt", "Taunt", "Foes are forced to attack this unit.", dict(y="Taunt", g="Taunt", s="Taunt", f="Taunted", c="Taunted", m="taunts", k="Taunt", d="Taunt"), st="ysd", kit="m",
    fit="ok", note="Builds today as a buff on the taunter. Opus's fights run and GPT made it a debuff on each foe naming who it must hit; that needs targeting rules on the attacker, which step 4 deferred.")
stt("doom", "Doom", "A countdown that ends in one big hit, or a knockout, unless removed first.", dict(g="Doom", s="Doom", f="Fated", c="Doomed", m="Doom", k="Doom / Mark", d="Doom"), fit="ok")
stt("vuln", "Vulnerable", "Takes more damage: of every kind, or of one element.", dict(g="Hex", f="weaker to this element", c="Vulnerable", m="Vulnerability", k="Curse", d="Vulnerable"),
    fit="ok", kit="gf")
stt("burn", "Burn", "Damage over time that ramps up, or burns hot.", dict(y="Burn", c="Burn", m="burn", k="Burn", d="Burn"),
    yours="Ramping damage over time (your Fire: proportional to health).", st="yk", fit="ok", kit="m",
    note="Every model but Opus has Burn. GPT's also cuts healing; Grok's may lower Armor.")
stt("mark", "Marked", "Draws fire: the other side targets it more, takes more damage, or both.",
    dict(y="Mark for death", g="Marked", s="Hunted", f="Hunted", c="Marked", k="Mark Count", d="Mark"), fit="ok", kit="g")
stt("berserk", "Berserk", "Hits harder, at a cost: weaker defences, more damage taken, or no abilities.", dict(y="Rage", g="Berserk", s="Berserk", c="Enraged", k="Berserk", d="Enrage"),
    yours="Rage: strength up, tankiness down.", fit="ok")
stt("onaction", "Shock", "Takes damage each time it acts, so it hurts fast units most.", dict(y="Shock", g="Bleed", s="Bleed", f="Bleed", c="Bleeding"),
    yours="Shock: damage on attack.", st="y", fit="ok",
    note="Opus and GPT call this Bleed. Your Bleed is a different status (its own card).")
stt("bleed", "Bleed", "Physical-feeling damage over time. Versions differ: bursty, stacking per hit, or worse when hit.", dict(y="Bleed", k="Bleed", d="Bleed"),
    yours="Big damage but hard to maintain stacks.", st="y", fit="ok", note="Grok's stacks with each hit; DeepSeek's worsens when the holder is hit.")
stt("buffs", "Stat buffs and debuffs", "Plain ups and downs: Attack (Might), damage dealt (Weakened), Armor, crit, auras.",
    dict(y="Various stat buffs", g="Attack up/down", s="Attack up, Armor up", f="Attack, Armor, Evasion buffs", c="Might; Weakened", k="Presence"), st="c", fit="ok", kit="gsf")
stt("hidden", "Hidden", "Can't be targeted, or is targeted less, for a while or until it acts.", dict(y="Hidden", g="untargetable", s="Veiled", f="Veiled", k="Stealth"), fit="ok", kit="g")
stt("sunder", "Sunder", "Armor lowered, stacking or for good.", dict(g="Sunder", f="Sundered", m="Fragile; Armor Shred", d="Sunder"), fit="ok",
    note="Your Brigand \"shreds armor\", so it needs something like this too.")
stt("guard", "Guard", "Takes less damage, or has more Armor, for a while.", dict(g="Guard", s="damage taken down", m="Protect", k="Fortify"), st="m", fit="ok", kit="gs")
stt("nextcrit", "Focus", "Its next hits are stronger, or crit chance builds until it's struck or misses.",
    dict(g="stacking crit buff", s="crit chance up", f="next hit crits", m="Precision Focus", k="Empower; Focus / Resolve", d="Focus"), fit="ok", kit="gsf")
stt("reraise", "Reraise", "Comes back from a knockout once, or survives one.", dict(y="revive", g="Reraise", f="rises once after falling", m="Unyielding Resolve", d="Reanimate"),
    yours="Your Cleric and Holy both revive.", fit="work", note="Revives are a deferred step 4 item.", kit="yf")
stt("antiheal", "Rot", "Heals do less, or partly hurt.", dict(g="Curse", s="Rot", f="Festering", m="reverses healing"), fit="ok", kit="m",
    note="GPT's Burn also cuts healing.")
stt("enchant", "Enchant", "Its attacks carry something extra: elemental damage, a new element, or a status.",
    dict(g="weapon-element buff", s="extra damage on attacks", f="rune buffs", c="extra elemental hit; Poison Coating", m="cycling elements", d="shift to weakness"), fit="ok", kit="gsfmd")
stt("purified", "Purified", "Can't gain debuffs for a while, or ignores the next few.", dict(s="debuff immunity", f="immune to debuffs", k="Cleanse-ready / Immunity"), fit="ok", kit="sf")
stt("blind", "Blind", "Its physical hits often miss.", dict(y="Blind", g="Blind", k="Blind"), fit="ok")
stt("blink", "Blink", "Each stack makes one hit miss outright.", dict(g="Blink", f="mirror images", k="Mirror Image"), fit="ok", kit="fk")
stt("stone", "Stone", "Can't act, but takes almost no damage.", dict(s="Stone", f="Petrified"), fit="ok")
stt("momentum", "Momentum", "Builds with each hit landed; a miss drops it.", dict(s="Momentum", m="Momentum"), fit="ok",
    note="The Combo special stat is the same idea as a stat.")
stt("root", "Root", "Can't dodge: Evasion set to zero.", dict(m="Root"), fit="ok")
stt("soullink", "Soul Link", "Part of the damage it takes is passed to a linked foe.", dict(m="Soul Link"), fit="ok")

# ---------- Special stats ----------
sta("lifesteal", "Lifesteal", "Heals for a share of the damage it deals.", dict(y="Lifesteal", g="Lifesteal", s="Lifesteal", f="Lifesteal", c="Lifesteal", m="Bloodthirst", k="Lifesteal", d="Lifesteal"),
    st="gsfckd", fit="work", note="Step 4 left this open: a scale needs a second factor. Gemini has it as a status.")
sta("evasion", "Evasion", "Chance to dodge a physical hit.", dict(y="Evasion", g="Evasion", s="Evasion", f="Evasion", c="Evasion", k="Dodge / Evasion", d="Evasion"), st="gsckd", fit="exists", kit="f")
sta("armorpen", "Armor penetration", "Ignores some of the target's Armor on each hit.", dict(y="Armor penetration", g="Penetration", s="Penetration", f="Armor Pierce", c="Armor Penetration", m="ignores Armor", d="Penetration"),
    st="gsfd", fit="work", kit="m", note="A small addition to hit resolution. Some versions also cut resistance.")
sta("accuracy", "Accuracy", "Cancels out the target's Evasion.", dict(y="Accuracy", g="Accuracy", s="Accuracy", f="Accuracy", c="Accuracy", k="Accuracy"), st="gsfck", fit="exists")
sta("critdmg", "Crit damage", "How much harder its crits hit.", dict(y="Crit damage", g="Crit Damage", s="Crit Damage", f="Crit Power", c="Critical Damage"), st="gsfc",
    fit="exists", note="Already in the engine as Crit multiplier.")
sta("thorns", "Thorns", "Whoever hits it takes damage back.", dict(y="Thorns", g="Thorns", s="Thorns", f="Spikes", c="Thorns", k="Thorns", d="Thorns"), st="sd", fit="ok",
    note="Some lists have it as a status, which the stat can bring.")
sta("execute", "Execute", "More damage against low-HP targets.", dict(g="Execute", f="Executioner", c="Finisher", m="executes", k="Execution Threshold", d="Execute"), st="d", kit="m",
    fit="work", note="An ability can already scale from the target's missing HP; as a stat on every hit it needs a new building block.")
sta("counter", "Counter", "Chance to strike back when hit.", dict(y="Riposte", g="Counter", s="Counter", f="Counter", c="Counter Chance", k="Counter"), st="f", kit="k",
    yours="Riposte (a status): dodge and attack.", fit="ok", note="Builds as reaction damage, which can't crit or trigger on-hit effects.")
sta("potency", "Potency", "Its statuses land better: more stacks, more often, or for longer.", dict(s="Potency", f="extra stacks", c="Status Chance; Debuff Duration", m="Curse Resonance"),
    st="c", fit="ok", kit="f", note="More stacks builds today. More often, or for longer, would be small additions.")
sta("tenacity", "Tenacity", "Debuffs on it wear off faster, or fail to land.", dict(g="Tenacity", s="Tenacity", f="Tenacity", c="Status Resistance"), st="gsf",
    fit="work", note="Status resistance is a deferred step 4 item; your note there says cutting stacks may beat cutting duration.")
sta("doublestrike", "Double strike", "Chance a basic attack hits again.", dict(y="Double hit", g="Double Strike", f="Double Strike", d="Multistrike"), st="d",
    yours="Double hit (a status).", fit="work", note="The engine has no chance of an extra hit; a reaction can fake it, but not as a real hit.")
sta("combo", "Combo", "Builds with consecutive hits; empowers the next hits or ability.", dict(m="Combo Count; Momentum Velocity", k="Combo / Chi", d="Combo"), st="m", fit="ok",
    note="The same idea as the Momentum status.")
sta("echo", "Echo", "Chance an ability goes off a second time.", dict(g="Echo", s="Echo", k="Echo", d="Echo"), fit="work", note="Granting actions is a deferred step 4 item.")
sta("overflow", "Overflow", "Healing past full HP becomes a shield.", dict(s="Overflow", g="overheal to Barrier", m="Vitality Shield", k="excess healing to temporary HP", d="Overheal"),
    fit="work", note="A small addition: heal events don't report the overheal yet.", kit="gk")
sta("castspeed", "Cast speed", "Shorter wind-ups on abilities.", dict(g="Cast Speed", s="Quickcast", f="Quickcast", c="Cast Speed"),
    fit="exists", note="Already in the engine as Cast Time Reduction.")
sta("mana", "Mana leech", "Restores MP from damage dealt or from acting.", dict(c="Mana Leech", m="Mana Flow"), st="m", fit="ok")
sta("rage", "Rage", "A meter that fills from taking (or dealing) damage and fuels power.", dict(m="Rage; Blood Debt", k="Blood; Stacks of Rage"), st="m", fit="ok")
sta("soul", "Soul", "Charges gained when units are knocked out, spent on big effects.", dict(m="Soul Spark", k="Soul / Essence"), fit="ok")
sta("heat", "Heat", "Builds as it attacks; vents a burst, or overheats into a self-debuff.", dict(m="Heat Buildup", k="Overheat"), fit="ok")
sta("companion", "Companion", "A pet or bond that adds extra attacks.", dict(k="Bond", d="Companion"), fit="work",
    note="Extra strikes on the holder's attacks build today; a real pet or turret that's its own unit needs a new building block.")
sta("splash", "Splash", "Part of each hit also lands on another foe.", dict(g="Splash", f="Splash"), fit="ok", note="Builds as reaction damage.")
sta("interrupt", "Stagger", "Chance a hit cancels the target's wind-up.", dict(s="Stagger", f="Interrupt", m="interrupts casts"), fit="ok", kit="m")
sta("stealth", "Stealth", "Starts the fight untargetable.", dict(g="Stealth", s="Stealth"), fit="ok")
sta("block", "Block", "Chance to shrink a physical hit by a large share.", dict(f="Block", k="Block Chance"), st="fk", fit="work", note="Damage reduction by chance needs a new building block.")
sta("cover", "Cover", "Takes hits, or part of the damage, aimed at a hurt ally.", dict(f="Cover", k="Cover", d="redirects damage"), fit="work", kit="kd",
    note="Redirecting a hit needs a new building block.")
sta("elemdmg", "Elemental damage", "More damage of one element, a line per element.", dict(y="Elemental damage", m="Shadow Depth"),
    yours="Elemental damage (per type).", fit="work", note="Today a status carries this as a boost; as a stat it adds a line per element, like resistances.")
sta("healpower", "Healing power", "Its heals are stronger.", dict(c="Healing Power"), fit="work", note="Today a status carries this as a healing boost; as a stat it's a small addition.")
sta("detonate", "Detonate", "Pops statuses on a foe for burst damage.", dict(m="detonates stacks", d="Detonate"), fit="ok", kit="m")
sta("attackspeed", "Attack speed", "Faster basic attacks.", dict(y="Attack speed"), fit="exists", note="Already a stat every unit has.")
sta("threat", "Threat", "How likely foes are to target it.", dict(k="Threat / Aggro"), st="k", fit="exists", note="Already a stat every unit has (Aggro).")
sta("purity", "Purity", "Takes less magic damage, until elements wear it down.", dict(m="Purity"), st="m", fit="ok")
sta("weight", "Weight", "Heavier gear adds blunt damage.", dict(m="Weight"), st="m", fit="work", note="Gear has no weight today.")
sta("manaburn", "Mana burn", "Its hits drain the target's MP.", dict(g="Mana Burn"), fit="ok")
sta("charge", "Charge", "Fills over time; empties into one big action a fight.", dict(k="Charge"), fit="ok")
sta("resonance", "Resonance", "Its next spell of the same element hits harder.", dict(k="Resonance"), fit="ok")
sta("decay", "Decay", "Statuses on its target run out faster.", dict(k="Decay"), fit="work", note="Nothing changes a running status's duration today.")
sta("copy", "Copy", "Copies a status from a foe or ally.", dict(d="Copy"), fit="work")
sta("foresight", "Foresight", "Warns of the next heavy hit and gives a short defensive window.", dict(d="Foresight"), fit="ok")
sta("headstart", "Head start", "Its cooldowns start the fight partway done.", dict(f="Head Start"), fit="work", note="A small addition: every action starts on full cooldown today.")
sta("overkill", "Overkill", "Damage past a knockout spills onto another foe.", dict(s="Overkill"), fit="work", note="A small addition: no event reports overkill yet.")
sta("spite", "Spite", "When knocked out, damages every foe.", dict(s="Spite"), fit="ok")
sta("poise", "Poise", "Chance to keep a wind-up when something would cancel it.", dict(g="Poise"), fit="work", note="Immunity is all-or-nothing today; a chance needs a new building block.")

# ---------- Classes ----------
cls("healer", "Cleric", "Heals the most hurt ally and lifts debuffs.", dict(y="Cleric", g="White Mage", s="Cleric", f="Cleric", c="Cleric", m="Cleric", k="Cleric / Healer", d="Cleric"),
    ["regen", "shield", "overflow", "reraise", "healpower"], yours="Squishy, heals and revives, pocket burst damage.", st="gsfcmkd")
cls("paladin", "Paladin", "A holy knight who fights, shields and heals a little.", dict(y="Guardian", g="Paladin", s="Paladin", f="Paladin", c="Paladin", m="Paladin", k="Paladin", d="Paladin"),
    ["shield", "enchant", "cover", "tenacity", "healpower"], yours="Guardian: tanky healer with physical scaling.", st="gsfcmkd",
    note="Gemini's shares Armor with \"adjacent slots\", which is positional.")
cls("monk", "Monk", "A martial artist: many quick hits, combos, dodges and counters.", dict(y="Monk", g="Monk", s="Monk", f="Monk", c="Monk", m="Monk", k="Monk", d="Monk"),
    ["evasion", "counter", "doublestrike", "combo", "stun", "interrupt"], yours="Dodge tank with heals.", st="gsfckd")
cls("ranger", "Ranger", "Steady ranged damage that marks prey for the party.", dict(y="Archer", g="Ranger", s="Ranger", f="Ranger", c="Archer", m="Ranger", k="Archer / Ranger", d="Ranger"),
    ["mark", "accuracy", "critdmg", "doublestrike", "armorpen"], yours="Archer: consistent high sustained damage, but squishy.", st="gsfckd")
cls("mage", "Mage", "Elemental caster: big hits, fragile.", dict(y="Mage", g="Black Mage", s="Mage", f="Mage", c="Mage", m="Mage", k="Mage"),
    ["burn", "onaction", "vuln", "castspeed", "mana"], yours="Fire and lightning, ramping damage in a squishy shell.", st="gsfcmk",
    note="Burn and Shock come from your Fire and Lightning.")
cls("rogue", "Rogue", "A quick, evasive blade whose dodges turn into crits.", dict(y="Rogue", g="Thief", s="Thief", f="Rogue", c="Thief", m="Rogue", k="Rogue"),
    ["evasion", "nextcrit", "poison", "hidden", "critdmg"], yours="Evasive, high burst damage but weak sustained attack.", st="gsfcmk")
cls("bard", "Bard", "Songs or dances that buff the whole party.", dict(y="Dancer", g="Bard", s="Bard", f="Bard", c="Bard", k="Bard", d="Shaman; Bard"),
    ["haste", "buffs", "regen", "silence", "echo"], yours="Dancer: pure buffer.", st="gsfcd")
cls("berserker", "Berserker", "Stronger the nearer it gets to death.", dict(g="Berserker", s="Berserker", f="Berserker", c="Berserker", m="Berserker", k="Berserker", d="Berserker"),
    ["berserk", "lifesteal", "rage", "buffs"], st="gsfck")
cls("knight", "Knight", "An armored wall that draws attacks: taunts, guards, shields.", dict(g="Knight", s="Knight", f="Knight", c="Knight", m="Warrior", d="Vanguard"),
    ["taunt", "guard", "shield", "thorns", "stun", "block"], st="gsfcmd")
cls("darkcaster", "Necromancer", "Shadow magic: drains, curses, doom; feeds on knockouts.", dict(g="Necromancer", s="Necromancer", f="Warlock", c="Necromancer", m="Necromancer", k="Necromancer", d="Warlock; Necromancer"),
    ["lifesteal", "antiheal", "doom", "soul", "companion"], st="d", note="Grok's raises minions, which needs summons.")
cls("alchemist", "Alchemist", "Flasks: poisons and debuffs for foes, potions for allies.", dict(g="Alchemist", s="Alchemist", f="Alchemist", c="Alchemist", m="Alchemist", k="Alchemist", d="Alchemist"),
    ["poison", "regen", "sunder", "slow", "vuln", "potency", "detonate"])
cls("timemage", "Time mage", "Speeds allies, slows and stops foes.", dict(g="Time Mage", f="Chronomancer", c="Time Mage", m="Chronosorcerer", k="Time Mage", d="Chronomancer"),
    ["haste", "slow", "stun", "headstart"])
cls("hexer", "Voodoo", "Little damage, many stacking curses.", dict(y="Voodoo", g="Hexer", c="Witch", m="Witchdoctor", k="Sorcerer"),
    ["vuln", "sunder", "antiheal", "doom", "potency"], yours="Pure debuff.", st="k")
cls("spellblade", "Spellblade", "Puts an element on weapons: its own, or an ally's.", dict(g="Spellblade", s="Spellblade", f="Runesmith", c="Spellblade", m="Shaman", d="Runekeeper"),
    ["enchant", "vuln", "castspeed"])
cls("regenhealer", "Priest", "Healing over time and protection; most lists make it a druid.", dict(y="Priest", g="Druid", s="Druid", c="Druid", k="Druid"),
    ["regen", "buffs", "thorns"], yours="Squishy, regen, support, pocket heals.", st="s")
cls("heavy", "Brigand", "Heavy hits that break or pierce armor.", dict(y="Brigand", g="Fighter", f="Warrior", c="Lancer", d="Sentinel"),
    ["sunder", "armorpen", "critdmg", "splash"], yours="High damage, low accuracy, medium survivability, shreds armor.", st="gf")
cls("assassin", "Assassin", "A burst killer that finishes the wounded.", dict(y="Assassin", c="Assassin; Executioner", m="Assassin", k="Assassin"),
    ["execute", "hidden", "nextcrit", "critdmg"], yours="Taunt-ignoring burst killer.", note="Ignoring taunts builds today: an action can ignore targeting overrides.")
cls("vampire", "Vampire", "An off-tank that lives on lifesteal.", dict(y="Vampire", m="Vampire", k="Vampire", d="Blood Knight"),
    ["lifesteal", "overflow", "reraise", "bleed"], yours="Lifesteal off-tank.")
cls("templar", "Templar", "Anti-debuff: cleanses, resists, and keeps debuffs off the party.", dict(s="Shrine Maiden", f="Miko", c="Templar", m="Templar", d="Templar"),
    ["purified", "tenacity", "shield"])
cls("plaguedoctor", "Plague doctor", "Spreads poison and sickness; it jumps when its holder falls.", dict(g="Plague Doctor", s="Plague Doctor", c="Plague Doctor", m="Plague Doctor", d="Plaguebringer"),
    ["poison", "antiheal", "onaction", "potency"])
cls("oracle", "Oracle", "Foresight: marks or dooms foes, shields or blinks allies before the blow.", dict(g="Oracle", s="Oracle", f="Oracle", c="Oracle", d="Oracle"),
    ["doom", "mark", "shield", "blink", "foresight"])
cls("fencer", "Fencer", "Duels one foe; parries and counters.", dict(s="Duelist", c="Duelist", m="Duelist"), ["taunt", "counter", "evasion", "momentum"],
    note="Every list calls it Duelist. A one-foe challenge needs targeting rules on the attacker, a deferred step 4 item. Your Duelist is a different idea (its own card).")
cls("hoplite", "Hoplite", "A shield-bearer who makes the whole party sturdier.", dict(s="Hoplite", f="Hoplite", m="Knight-Captain", k="Knight"),
    ["buffs", "shield", "counter", "cover", "block"], st="k")
cls("spellbreaker", "Spellbreaker", "Strips foes' buffs and shields, and silences casters.", dict(f="Spellbreaker", m="Inquisitor", d="Spellbreaker"), ["silence", "interrupt"])
cls("soldier", "Soldier", "An all-round front-liner: a little tanky, a little offensive.", dict(y="Soldier", c="Warrior", k="Warrior"), ["guard", "buffs"],
    yours="Middle-of-the-road physical class: a little tanky and a little offensive.", st="ck")
cls("samurai", "Samurai", "Long wind-ups that land huge, crit-heavy cuts.", dict(g="Samurai", s="Samurai", f="Ronin", k="Samurai"), ["critdmg", "nextcrit", "counter"])
cls("beastmaster", "Beastmaster", "Fights beside a pet that adds its own strikes.", dict(c="Beastmaster", k="Summoner", d="Beastmaster"), ["companion", "mark"],
    note="Grok's is a full summoner, which needs summons.")
cls("bloodmage", "Blood mage", "Pays its own HP for power; losing HP restores MP.", dict(g="Blood Mage", m="Blood Mage", k="Warlock"), ["lifesteal", "rage", "mana"],
    note="Opus's fights-run Warlock has the same passive.")
cls("duelist", "Duelist", "Attack speed and crits, squishy and slightly evasive.", dict(y="Duelist", d="Duelist"),
    ["critdmg", "evasion", "combo", "bleed"], yours="Attack speed and crit king, squishy and slightly evasive.", st="d")
cls("pyromancer", "Pyromancer", "A fire specialist: stacking, spreading burns.", dict(m="Pyromancer", d="Pyromancer"), ["burn", "vuln", "heat"], st="d")
cls("valkyrie", "Valkyrie", "Revives allies, and grows stronger as units fall.", dict(g="Valkyrie", s="Valkyrie", f="Valkyrie"), ["reraise", "haste", "buffs", "execute", "overkill"])
cls("onmyoji", "Onmyoji", "Talismans that silence and seal; wards for allies.", dict(g="Onmyoji", s="Onmyoji", f="Onmyoji"), ["silence", "slow", "shield", "buffs"])
cls("illusionist", "Illusionist", "Mirror images and decoys that make hits miss.", dict(f="Illusionist", k="Illusionist"), ["blink", "hidden", "mark"])
cls("frost", "Frostweaver", "Frost that piles up until foes freeze.", dict(s="Yuki-onna", m="Frostweaver"), ["slow", "stun", "potency"])
cls("reaper", "Reaper", "Harvests knockouts into power and big hits.", dict(c="Reaper", k="Reaper"), ["soul", "doom", "berserk", "lifesteal", "execute"])
cls("gunslinger", "Gunslinger", "Rapid-fire shots that shred armor, with reloads or overheating.", dict(m="Gunslinger", k="Gunslinger"), ["heat", "sunder", "haste"])
cls("thornstank", "Bramble knight", "A tank that punishes whoever hits it.", dict(y="Bramble knight", f="Gladiator"), ["thorns", "counter", "buffs"], yours="Thorns tank.")
cls("ninja", "Ninja", "Starts hidden, throws poison, hard to pin down.", dict(g="Ninja", s="Ninja"), ["hidden", "poison", "blink", "stealth", "evasion"])
cls("dragoon", "Dragoon", "Leaps out of reach and lands one huge hit.", dict(g="Dragoon", f="Dragoon"), ["hidden", "interrupt", "armorpen"])
cls("detonator", "Trapper", "Sets timed statuses on foes, then detonates them.", dict(d="Engineer; Trapper"), ["detonate", "burn", "vuln", "mark", "stun"], st="d")
cls("earthma", "Earth martial artist", "Uneven damage, with support and debuffs.", dict(y="Earth martial artist"), ["shield", "poison"],
    yours="Inconsistent DPS with support and debuff potential.", note="Shield and Poison come from your Earth.")
cls("darkknight", "Dark knight", "An armor tank that deals magic damage.", dict(y="Dark knight"), [], yours="Armor tank with magic damage.")
cls("pegasus", "Pegasus warrior", "A resistance tank that also deals damage.", dict(y="Pegasus warrior"), [], yours="Resist tank with damage.")
cls("martyr", "Martyr", "Spends its own HP to heal; its fall heals and shields the party.", dict(f="Martyr"), ["shield"])
cls("gorgon", "Gorgon", "Turns the strongest foe to stone, which hurts when it cracks.", dict(s="Gorgon"), ["stone", "potency"])
cls("einherjar", "Einherjar", "Fights hard and dies loudly; its war cry outlives it.", dict(s="Einherjar"), ["buffs", "spite"])
cls("dancer", "Dancer", "An evasive dancer who debuffs foes and charms one.", dict(g="Dancer"), ["buffs", "evasion"],
    note="Charm needs targeting rules on the attacker, a deferred step 4 item. Your Dancer is a different idea, merged into Bard.")
cls("geomancer", "Geomancer", "Lingering elemental fields that power up later spells.", dict(k="Geomancer"), ["resonance"])
cls("engineer", "Engineer", "Deploys turrets and gadgets that attack or shield.", dict(k="Engineer"), ["companion"], note="Turrets that are their own units need summons.")
cls("artillerist", "Artillerist", "Huge, slow blunt blasts; heavier gear hits harder.", dict(m="Artillerist"), ["weight", "sunder"])
cls("mimic", "Mimic", "Copies statuses from foes and allies.", dict(d="Mimic"), ["copy", "vuln"])

# ---------- Fold Opus's three runs into one model ----------
RUN = {"g": "A", "s": "B", "f": "C"}
out = []
for c in cards:
    a = c.pop("as_")
    runs = [r for r in "gsf" if r in a]
    model = {k: a[k] for k in "ycmkd" if k in a}
    if runs:
        names = {}
        for r in runs:
            names.setdefault(a[r], []).append(RUN[r])
        if len(names) == 1 and len(runs) == 3:
            model["o"] = next(iter(names))
        else:
            model["o"] = ", ".join(f"{n} ({', '.join(rs)})" for n, rs in names.items())
    st = [k for k in "yocmkd" if (k in c["st"] if k != "o" else any(r in c["st"] for r in "gsf"))]
    kit = [k for k in "yocmkd" if (k in c["kit"] if k != "o" else runs and all(r in c["kit"] for r in runs))]
    out.append(dict(b=c["b"], id=c["id"], n=c["n"], ln=c["ln"], **{"as": model}, yours=c["yours"], st=st, kit=kit,
                    needs=c["needs"], fit=c["fit"], note=c["note"]))

ids = [c["id"] for c in out]
assert len(set(ids)) == len(ids), "duplicate ids"
byid = {c["id"]: c for c in out}
for c in out:
    for n in c["needs"]:
        assert n in byid and byid[n]["b"] in (S, T), (c["id"], n)
    for k in c["st"] + c["kit"]:
        assert k in c["as"], (c["id"], k)
from collections import Counter
print(Counter(c["b"] for c in out))
json.dump(out, open(sys.argv[1], "w"), ensure_ascii=False, separators=(",", ":"))
