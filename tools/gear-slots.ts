/**
 * The gear slots' counts (docs/core-set/rules-and-vocabulary.md, Gear): who wears which kind of loot, and how much classes share.
 * The proposal is written below as data. It prints, for each slot, its kinds, classes per kind and kinds per class; for each
 * class, its kinds, the classes it shares any with, its closest neighbour's share of its kinds and its weapon pattern; how many
 * pairs of classes share 0, 1, 2 or more kinds; how many pairs of kinds from different slots can meet on one unit (a two-hander
 * never meets an offhand); the kinds two members of each build route can both wear; and the kinds every route of a build can wear.
 * Amulets fit everyone and are left out of the overlaps.
 *
 *   npx tsx tools/gear-slots.ts
 *
 * Edit the tables to try a change and recount. Nothing here touches the engine or the content.
 */

type Kind = { classes: string[]; cell?: string };

const WEAPONS: Record<string, Kind> = {
  dagger: { cell: "fast one-hand light attack-heavy", classes: ["ranger", "assassin"] },
  claws: { cell: "fast one-hand light even", classes: ["monk", "vampire", "stormcaller"] },
  wand: { cell: "fast one-hand light base-heavy", classes: ["bard", "hexer", "pyromancer"] },
  sword: { cell: "medium one-hand full even", classes: ["knight", "hexer", "valkyrie"] },
  spear: { cell: "medium one-hand full even", classes: ["hoplite", "valkyrie", "monk"] },
  axe: { cell: "medium one-hand heavy attack-heavy", classes: ["vampire", "assassin"] },
  bow: { cell: "medium two-hand heavy attack-heavy", classes: ["ranger", "bard"] },
  rune_sword: { cell: "slow one-hand full base-heavy", classes: ["frostweaver", "stormcaller"] },
  hammer: { cell: "slow one-hand heavy base-heavy", classes: ["knight", "bramble_knight", "geomancer"] },
  mace: { cell: "slow one-hand light base-heavy", classes: ["cleric", "paladin", "bramble_knight"] },
  staff: { cell: "slow two-hand light base-heavy", classes: ["cleric", "pyromancer", "frostweaver"] },
  great_weapon: { cell: "slow two-hand heavy even", classes: ["hoplite", "paladin", "geomancer"] },
};
const ARMOR: Record<string, Kind> = {
  plate: { classes: ["knight", "hoplite", "geomancer", "bramble_knight", "paladin"] },
  mail: { classes: ["paladin", "valkyrie", "vampire", "hexer", "bramble_knight", "frostweaver"] },
  leather: { classes: ["ranger", "monk", "assassin", "bard", "valkyrie", "stormcaller"] },
  robes: { classes: ["cleric", "pyromancer", "frostweaver", "stormcaller", "bard"] },
};
const OFFHANDS: Record<string, Kind> = {
  kite_shield: { classes: ["knight", "paladin", "geomancer"] },
  round_shield: { classes: ["hoplite", "bramble_knight", "valkyrie"] },
  horn: { classes: ["knight", "hoplite"] },
  totem: { classes: ["bramble_knight", "stormcaller"] },
  relic: { classes: ["cleric", "paladin"] },
  lantern: { classes: ["cleric", "pyromancer"] },
  tome: { classes: ["bard", "hexer", "frostweaver"] },
  orb: { classes: ["pyromancer", "frostweaver"] },
  idol: { classes: ["hexer", "vampire"] },
  vial: { classes: ["vampire", "assassin"] },
  trophy: { classes: ["ranger", "assassin", "geomancer"] },
  bell: { classes: ["bard", "monk", "stormcaller"] },
  cloak: { classes: ["valkyrie", "monk", "ranger"] },
};

/** builds.md's routes: three parties per build. */
const ROUTES: Record<string, string[][]> = {
  landslide: [["geomancer", "knight", "hoplite"], ["geomancer", "paladin", "cleric"], ["hoplite", "knight", "bard"]],
  cuts: [["monk", "assassin", "bard"], ["valkyrie", "ranger", "vampire"], ["stormcaller", "hexer", "pyromancer"]],
  bonfire: [["pyromancer", "hexer", "knight"], ["monk", "paladin", "bard"], ["pyromancer", "hoplite", "cleric"]],
  coldsnap: [["frostweaver", "hexer", "ranger"], ["frostweaver", "monk", "bard"], ["hexer", "monk", "geomancer"]],
  hunt: [["valkyrie", "ranger", "assassin"], ["monk", "assassin", "hoplite"], ["ranger", "stormcaller", "paladin"]],
  harvest: [["stormcaller", "bard", "bramble_knight"], ["pyromancer", "frostweaver", "paladin"], ["valkyrie", "knight", "hoplite"]],
  ambush: [["assassin", "geomancer", "ranger"], ["monk", "bard", "bramble_knight"], ["valkyrie", "assassin", "cleric"]],
  overflow: [["bard", "frostweaver", "hexer"], ["knight", "pyromancer", "cleric"], ["vampire", "stormcaller", "bard"]],
  lockdown: [["knight", "hexer", "monk"], ["assassin", "geomancer", "frostweaver"], ["hexer", "paladin", "cleric"]],
  toll: [["bramble_knight", "cleric", "stormcaller"], ["knight", "hexer", "hoplite"], ["monk", "bard", "assassin"]],
  blood: [["vampire", "cleric", "monk"], ["vampire", "bramble_knight", "valkyrie"], ["knight", "paladin", "monk"]],
  phoenix: [["valkyrie", "cleric", "assassin"], ["valkyrie", "vampire", "knight"], ["cleric", "paladin", "pyromancer"]],
};

const SLOTS: Record<string, Record<string, Kind>> = { weapon: WEAPONS, armor: ARMOR, offhand: OFFHANDS };
const CLASSES = [...new Set(Object.values(SLOTS).flatMap((s) => Object.values(s).flatMap((k) => k.classes)))].sort();
const kindsOf = new Map(CLASSES.map((c) => [c, new Set<string>()]));
for (const [slot, kinds] of Object.entries(SLOTS))
  for (const [id, k] of Object.entries(kinds)) for (const c of k.classes) kindsOf.get(c)!.add(`${slot}:${id}`);
const shared = (a: string, b: string) => [...kindsOf.get(a)!].filter((k) => kindsOf.get(b)!.has(k)).length;
const avg = (xs: number[]) => (xs.reduce((s, x) => s + x, 0) / xs.length).toFixed(2);

console.log(`${CLASSES.length} classes\n\nSlot     kinds  classes per kind   kinds per class   other wearers in a roster of five`);
for (const [slot, kinds] of Object.entries(SLOTS)) {
  const widths = Object.values(kinds).map((k) => k.classes.length);
  const per = CLASSES.map((c) => Object.values(kinds).filter((k) => k.classes.includes(c)).length);
  const missing = CLASSES.filter((_, i) => per[i] === 0);
  console.log(`${slot.padEnd(8)} ${String(widths.length).padStart(5)}  ${Math.min(...widths)}-${Math.max(...widths)} (avg ${avg(widths)})`.padEnd(37) +
    `${Math.min(...per)}-${Math.max(...per)} (avg ${avg(per)})`.padEnd(18) + avg(widths.map((w) => (4 * (w - 1)) / (CLASSES.length - 1))) +
    (missing.length ? `   none for: ${missing.join(", ")}` : ""));
}

console.log("\nClass            kinds  shares with  closest neighbour         weapon pattern");
for (const c of CLASSES) {
  const others = CLASSES.filter((o) => o !== c);
  const near = others.map((o) => ({ o, n: shared(c, o) })).sort((x, y) => y.n - x.n)[0];
  const pattern = Object.values(WEAPONS).filter((k) => k.classes.includes(c)).map((k) => k.cell).sort().join(" + ");
  const share = near.n / kindsOf.get(c)!.size;
  console.log(`${c.padEnd(16)} ${String(kindsOf.get(c)!.size).padStart(5)}  ${String(others.filter((o) => shared(c, o) > 0).length).padStart(11)}  ` +
    `${`${near.o} ${Math.round(share * 100)}%`.padEnd(24)}${share > 0.5 ? "!" : " "} ${pattern}`);
}

// The weapon and offhand rules (steps/class-identity): two or three wearers a kind, two kinds a class, one in hand, no pair sharing two kinds of a slot.
for (const [slot, kinds] of [["weapon", WEAPONS], ["offhand", OFFHANDS]] as const) {
  const bad: string[] = [];
  for (const [id, k] of Object.entries(kinds)) if (k.classes.length < 2 || k.classes.length > 3) bad.push(`${id} has ${k.classes.length} wearers`);
  for (const c of CLASSES) {
    const n = Object.values(kinds).filter((k) => k.classes.includes(c)).length;
    if (n !== 2) bad.push(`${c} has ${n} ${slot} kinds`);
    if (slot === "weapon" && !Object.values(kinds).some((k) => k.classes.includes(c) && k.cell?.includes("one-hand"))) bad.push(`${c} has no one-handed kind`);
  }
  for (let i = 0; i < CLASSES.length; i++) for (let j = i + 1; j < CLASSES.length; j++) {
    const both = Object.entries(kinds).filter(([, k]) => k.classes.includes(CLASSES[i]) && k.classes.includes(CLASSES[j])).map(([id]) => id);
    if (both.length > 1) bad.push(`${CLASSES[i]} and ${CLASSES[j]} share ${slot} kinds ${both.join(" and ")}`);
  }
  console.log(`\nThe ${slot} rules: ${bad.length ? bad.join("; ") : "hold"}`);
}

const pairs = CLASSES.flatMap((a, i) => CLASSES.slice(i + 1).map((b) => shared(a, b)));
const hist: Record<number, number> = {};
for (const n of pairs) hist[n] = (hist[n] ?? 0) + 1;
console.log(`\nPairs of classes by kinds shared: ${Object.entries(hist).map(([n, k]) => `${n}: ${k}`).join(", ")} (of ${pairs.length})`);

let meet = 0, total = 0;
const slotIds = Object.keys(SLOTS);
for (let i = 0; i < slotIds.length; i++)
  for (let j = i + 1; j < slotIds.length; j++)
    for (const [a, ka] of Object.entries(SLOTS[slotIds[i]]))
      for (const [b, kb] of Object.entries(SLOTS[slotIds[j]])) {
        total++;
        const twoHand = (slotIds[i] === "weapon" && slotIds[j] === "offhand" && ka.cell?.includes("two-hand"));
        if (!twoHand && ka.classes.some((c) => kb.classes.includes(c))) meet++;
      }
console.log(`Pairs of kinds from different slots that can meet on one unit: ${meet} of ${total} (${Math.round((100 * meet) / total)}%)`);

console.log("\nBuild         kinds two members can both wear, per route      kinds every route can wear");
for (const [build, routes] of Object.entries(ROUTES)) {
  const perRoute = routes.map((r) => {
    const count = new Map<string, number>();
    for (const c of r) for (const k of kindsOf.get(c)!) count.set(k, (count.get(k) ?? 0) + 1);
    return [...count.values()].filter((n) => n >= 2).length;
  });
  const every = routes.map((r) => new Set(r.flatMap((c) => [...kindsOf.get(c)!]))).reduce((a, b) => new Set([...a].filter((k) => b.has(k))));
  console.log(`${build.padEnd(13)} ${perRoute.join(", ").padEnd(48)} ${[...every].map((k) => k.split(":")[1]).join(", ") || "none"}`);
}
