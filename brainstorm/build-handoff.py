import json, re, sys

# Builds the three step documents in brainstorm/handoff/:
#   python3 brainstorm/merge.py CARDS.json && python3 brainstorm/build-handoff.py CARDS.json
# Step 1 carries the brainstorm with the director's picks and notes, but no sources or counts.

cards = json.load(open(sys.argv[1]))
H = 'brainstorm/handoff/'
frame = open(H + 'frame.md').read().strip()

# Plain descriptions. The merge's own lines name where ideas came from, and the
# director's own ideas are folded in here without saying whose they are.
DESC = {
 "fire": "Big, all-out damage that ramps up; burns that scale with health.",
 "ice": "Consistent, reliable damage; the tempo element, which slows and weakens foes.",
 "lightning": "Sudden strikes that jump between foes or hit them all; shocks that hurt fast units each time they act.",
 "earth": "Heavy and grinding: low damage with occasional big, spiky hits; shields and poison.",
 "wind": "Light, quick, many-hit cuts; crits, evasion and speed.",
 "light": "Holy power that mostly supports: healing, regeneration, revival and shields; rarely resisted, rarely used to attack.",
 "dark": "Steady, middle-of-the-road damage, powerful but often resisted; draining and stranger effects.",
 "slow": "Acts slower. It can stack, can lower evasion, and at enough stacks can freeze the unit solid.",
 "bleed": "Damage over time with a physical feel: big but hard to keep stacked, or stacking with each hit, or worse when the holder is hit.",
 "buffs": "Plain ups and downs to stats: more Attack, less damage dealt, more Armor, more crit; auras that last while their giver stands.",
 "healer": "Heals the most hurt ally, lifts debuffs and revives; fragile, with a little burst damage.",
 "paladin": "A holy knight who fights, shields and heals a little; a sturdy healer whose power is physical.",
 "monk": "A martial artist: many quick hits, combos, dodges and counters; or a dodging tank that heals itself.",
 "ranger": "Consistent, sustained ranged damage; marks prey for the party; fragile.",
 "mage": "An elemental caster in a fragile shell: big hits, or damage that ramps up.",
 "rogue": "A quick, evasive blade, bursty rather than steady; its dodges turn into crits.",
 "bard": "Songs or dances that buff the whole party; a pure buffer.",
 "hexer": "Little damage, many stacking curses; a pure debuffer.",
 "regenhealer": "Healing over time, support and protection; fragile.",
 "heavy": "High damage but inaccurate; heavy hits that break or pierce armor.",
 "assassin": "A burst killer that finishes the wounded and ignores taunts.",
 "earthma": "A martial artist with uneven damage, plus support and debuffs.",
 "thornstank": "A thorns tank: whoever hits it gets hurt.",
}
EXTRA = [  # entries the brainstorm had folded into others
 dict(b="status", id="riposte", n="Riposte", ln="A stance: after dodging an attack, it strikes back.", as_={}),
]
DROP_ALIAS = {"counter": {"Riposte"}, "doom": {"Mark"}}

entries = [dict(b=c["b"], id=c["id"], n=c["n"], ln=DESC.get(c["id"], c["ln"]), as_=c["as"]) for c in cards] + EXTRA
names = {e["n"].lower() for e in entries}
for e in entries:
    assert not re.search(r"\b(version|versions|list|lists|model|director|Opus|GPT|Gemini|Grok|DeepSeek)\b", e["ln"]), e
    al = []
    for v in e["as_"].values():
        v = re.sub(r" \([A-C](, [A-C])*\)", "", v)
        for tok in re.split(r"; |, | / ", v):
            tok = tok.strip()
            if tok and tok[0].isupper() and tok.lower() not in names and tok not in al and tok not in DROP_ALIAS.get(e["id"], ()):
                al.append(tok)
    e["al"] = al
# An alias two entries share (different sources used the name for different ideas) only confuses.
from collections import Counter
shared = Counter(a for e in entries for a in e["al"])
def variant(a, name):  # "Shields" for Shield, "Combo Count" for Combo: not a different name
    a, name = a.lower(), name.lower()
    return name.split()[0] in a or a.split()[0] in name
for e in entries:
    e["al"] = [a for a in e["al"] if shared[a] == 1 and not variant(a, e["n"])]
    if e["id"] == "buffs": e["al"] = ["Might", "Weakened"]

# Preferences, not decisions: words that don't name an action.
REACTION = dict(keep='liked', maybe='unsure', cut='doubtful')
pk = json.load(open('brainstorm/picks.json'))
picks = {c['id']: c for c in pk['cards']}
out = ["### The director's general notes", ""] + ["> " + x.strip() + "\n>" for x in pk['general_notes'].split("\n\n")]
out[-1] = out[-1][:-2]
out.append("")
for b, title in [("class", "Classes"), ("status", "Statuses"), ("stat", "Special stats"), ("element", "Elements")]:
    es = sorted((e for e in entries if e["b"] == b), key=lambda e: e["n"].lower())
    out += [f"### {title}", ""]
    for e in es:
        p = picks.get(e["id"], {})
        out.append(f"- **{e['n']}.** {e['ln']}" + (f" Also called: {', '.join(e['al'])}." if e["al"] else "")
                   + (f" *Reaction:* {REACTION[p['pick']]}." if p.get("pick") else "") + (f" *Note:* \"{p['note']}\"" if p.get("note") else ""))
    out.append("")
lst = "\n".join(out).rstrip()

for n, name in [(1, "step-1-genre-check.md"), (2, "step-2-challenges.md"), (3, "step-3-core-set.md")]:
    t = open(H + f"step-{n}.tpl.md").read().replace("{{FRAME}}", frame).replace("{{LIST}}", lst)
    assert "{{" not in t
    open(H + name, "w").write(t.rstrip() + "\n")
