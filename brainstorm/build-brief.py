import json, re
# Builds core-set-brief.md: python3 brainstorm/merge.py CARDS.json && python3 brainstorm/build-brief.py CARDS.json
import sys
t = open('brainstorm/core-set-brief.template.md').read()
cards = json.load(open(sys.argv[1]))
pk = json.load(open('brainstorm/picks.json'))
picks = {c['id']: c for c in pk['cards']}
byid = {c['id']: c for c in cards}
NAME = dict(y='director', o='Opus', c='GPT', m='Gemini', k='Grok', d='DeepSeek')
AI = 'ocmkd'
REPL = [
 (", which step 4 deferred", ", which isn't built yet"),
 (", a deferred step 4 item", ", which isn't built yet"),
 ("Granting actions is a deferred step 4 item.", "Granting actions isn't built yet."),
 ("Revives are a deferred step 4 item.", "Revives aren't built yet."),
 ("Status resistance is a deferred step 4 item; your note there says cutting stacks may beat cutting duration.",
  "Status resistance isn't built yet; an earlier note of the director's says cutting stacks may beat cutting duration."),
 ("Step 4 left this open: a scale needs a second factor.", "Not built yet: it needs a second scaling factor."),
 ("under step 4's rules", "under the combat rules"),
 ("Builds today as a buff on the taunter. ", "As a buff on the taunter. "),
 ("your ", "the director's "), ("Your ", "The director's "),
]
def fix(s):
    if not s: return s
    for a, b in REPL: s = s.replace(a, b)
    assert 'step 4' not in s.lower(), s
    return s

# The director's own list, word for word (brainstorm/lists/yours.md).
VERBATIM = {
 "fire": "Fire (ramping damage, burn DoT proportional to health)",
 "ice": "ice (consistent but reliable damage, the tempo debuff element, slows, weakens etc.)",
 "lightning": "Lightning (AoE, shock which hurts fast units by damaging on action)",
 "earth": "Earth (low damage in general with spiky high damage lower accuracy hits, associated with shields and poison)",
 "wind": "wind (multi hit focus, associated with crit, evasion, and speed)",
 "light": "holy ( strong spells on non-offensive classes, healing, regen and revive, rarely resisted but not often used by offensive classes)",
 "dark": "Dark (middle of the road regular damage aka dark magic is my basic attack, powerful but often resisted, esoteric effects)",
 "heavy": "Brigand (high damage, low accuracy, medium survivability, shreds armor)",
 "soldier": "Soldier (middle of the road physical class, a little tanky and a little offensive)",
 "ranger": "Archer (consistent high sustained damage but squishy)",
 "rogue": "Rogue (evasive, high burst damage but weak sustained attack)",
 "duelist": "Duelist (attack speed and crit king, squishy and slightly evasive)",
 "mage": "Mage (fire and lightning, ramping damage in a squishy shell)",
 "earthma": "Earth martial artist (inconsistent dps with support and debuff potential)",
 "paladin": "Guardian (tanky healer with physical scaling)",
 "darkknight": "Dark knight (armor tank with magic damage)",
 "healer": "Cleric (squishy, heals/revives, pocket burst damage)",
 "regenhealer": "Priest (squishy, regen, support, pocket heals)",
 "thornstank": "Bramble knight (thorns tank)",
 "vampire": "Vampire (lifesteal off-tank)",
 "monk": "Monk (Dodge tank with heals)",
 "pegasus": "Pegasus warrior (resist tank with damage)",
 "assassin": "Assassin (taunt ignoring burst killer)",
 "bard": "Dancer (pure buffer)",
 "hexer": "Voodoo (pure debuff)",
 "slow": "Chilled (slow and decrease evasion)",
 "burn": "Burn (ramping damage over time)",
 "poison": "Poison (consistent dot)",
 "onaction": "Shock (damage on attack)",
 "shield": "Shields",
 "taunt": "Taunt",
 "bleed": "Bleed (big damage but hard to maintain stacks)",
 "stun": "Freeze (stun)",
 "regen": "HP Regen",
 "blind": "Blind",
 "vuln": "Mark for death",
 "haste": "Haste",
 "hidden": "Hidden",
 "counter": "Riposte (dodge and attack)",
 "berserk": "Rage (strength up tankyness down)",
 "silence": "Silence",
 "doublestrike": "Double hit",
 "buffs": "Various stat buffs",
 "thorns": "Thorns",
 "armorpen": "Armor penetrartion",
 "lifesteal": "Lifesteal",
 "evasion": "Evasion",
 "accuracy": "Accuracy",
 "elemdmg": "Elemental damage (per type)",
 "critdmg": "Crit damage",
 "attackspeed": "Attack speed",
}
FIT = dict(ok='builds today', exists='already in the engine', work='needs engine work')
def isMain(c, by):
    n = len(c['as']); return n == 1 or (len(by) >= 2 and len(by) * 2 >= n)
out = []
for b, title in [('class', 'Classes'), ('status', 'Statuses'), ('stat', 'Special stats'), ('element', 'Elements')]:
    cs = [c for c in cards if c['b'] == b]
    cs.sort(key=lambda c: (-sum(k in c['as'] for k in AI), -('y' in c['as']), -len(c['st']), c['n']))
    out += [f"### {title}", "", f"{len(cs)} entries, most-proposed first.", ""]
    for c in cs:
        p = picks[c['id']]
        n = sum(k in c['as'] for k in AI)
        src = (f"{n} of 5 models" + (" and the director" if 'y' in c['as'] else "")) if n else "the director only"
        parts = [f"- **{c['n']}.** {fix(c['ln'])}", f"*Sources:* {src}."]
        names = {}
        for k in 'yocmkd':
            if k in c['as']: names.setdefault(c['as'][k].replace("; ", " and "), []).append(NAME[k])
        if not (len(names) == 1 and c['n'] in names):
            parts.append("*Called:* " + "; ".join(f"{nm} ({', '.join(ks)})" for nm, ks in names.items()) + ".")
        st = [NAME[k] for k in c['st'] if k != 'y']
        if st: parts.append("*Staple for:* " + ", ".join(st) + ".")
        if 'y' in c['st']: parts.append("*In the director's core list.*")
        if c['id'] == 'reraise':
            parts.append("*Director's list:* not as its own entry, but in \"Cleric (squishy, heals/revives, pocket burst damage)\" and \"holy ( strong spells on non-offensive classes, healing, regen and revive, ...)\".")
        elif 'y' in c['as']:
            parts.append(f"*Director's list:* \"{VERBATIM[c['id']]}\"")
        if b == 'class':
            main = [byid[nid]['n'] for nid, by in c['needs'] if isMain(c, by)]
            if main: parts.append("*Most versions use:* " + ", ".join(main) + ".")
        if c['fit']:
            nt = fix(c['note'])
            parts.append(f"*Engine:* {FIT[c['fit']]}" + (f". {nt}" if nt else "."))
        elif c['note']: parts.append(f"*Merge note:* {fix(c['note'])}")
        parts.append(f"*Pick:* {p['pick'] or 'none'}." + (f" *Note:* \"{p['note']}\"" if p['note'] else ""))
        out.append(" ".join(parts))
    out.append("")
notes = "\n>\n".join("> " + x.strip() for x in pk['general_notes'].split("\n\n"))
t = t.replace("__NOTES__", notes).replace("__ENTRIES__", "\n".join(out).rstrip())
t = re.sub(r'\.\.(\s|$)', r'.\1', t)
open('brainstorm/core-set-brief.md', 'w').write(t.rstrip() + "\n")
