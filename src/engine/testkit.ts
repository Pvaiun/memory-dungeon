/**
 * Test helpers: the worked example, a spread of parties, and test-only rules
 * whose decisions change stats, so branches really differ. Not game logic.
 */
import { Party } from "../schema.js";
import { loadContent, type Content, type Rules } from "./run.js";
import { combat, type Member } from "./combat/rules.js";
import pack from "../../fixtures/hollow.pack.json" with { type: "json" };
import fixtureParty from "../../fixtures/party.json" with { type: "json" };

export const DUNGEON = "hollow_of_the_grey_mother";
export const content: Content = loadContent(pack);
export const PARTY: Party = Party.parse(fixtureParty);

/** Every party of 1 to 3 classes, in every formation, abilities and gear left simple. */
export function parties(c: Content = content): Party[] {
  const classes = c.pack.classes;
  const out: Party[] = [];
  for (let mask = 1; mask < 1 << classes.length; mask++) {
    const chosen = classes.filter((_, i) => mask & (1 << i));
    if (chosen.length > 3) continue;
    for (const f of c.pack.formations) {
      out.push({
        formation: f.id,
        units: chosen.map((s, i) => ({ class: s.id, position: f.positions[i].id, abilities: s.abilities.slice(0, 2), gear: {} })),
      });
    }
  }
  return out;
}

/**
 * Test-only rules. Each perk pick also adds 0 to 12 attack to the whole party
 * (by the perk's place in the pool). With `stance`, every fight also opens
 * with a decision before its first moment: "charge" gives the party +10 attack for that fight.
 */
export function boostRules(opts: { stance?: boolean } = {}): Rules {
  return {
    ...combat,
    id: opts.stance ? "test-stance" : "test-boost",
    beforeTurn: opts.stance
      ? (x, f) => (f.round === 0 && !(f as unknown as { begun: boolean }).begun ? { kind: "stance", at: `${f.stage}:open`, options: ["hold", "charge"] } : null)
      : undefined,
    apply(x, d, pick) {
      if (d.kind === "stance") {
        if (pick === "charge") for (const u of x.run.fight!.units as Member[]) if (u.side === "party") u.flat.attack = (u.flat.attack ?? 0) + 10;
        return;
      }
      combat.apply(x, d, pick);
      const bonus = (x.c.dungeons.get(x.run.record.dungeon)!.perkPool.indexOf(pick) % 4) * 4;
      for (const u of x.run.party as Member[]) u.flat.attack = (u.flat.attack ?? 0) + bonus;
    },
  };
}
