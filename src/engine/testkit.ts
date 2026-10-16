/**
 * Test helpers: the worked example, a spread of parties, and test-only rules
 * whose decisions change stats, so branches really differ. Not game logic.
 */
import { Party } from "../schema.js";
import { loadContent, type Content, type Rules } from "./run.js";
import { standin } from "./standin.js";
import pack from "../../fixtures/hollow.pack.json" with { type: "json" };
import fixtureParty from "../../fixtures/party.json" with { type: "json" };

export const DUNGEON = "hollow_of_the_grey_mother";
export const content: Content = loadContent(pack);
export const PARTY: Party = Party.parse(fixtureParty);

/** Every party of 1 to 3 specializations, in every formation, abilities and gear left simple. */
export function parties(c: Content = content): Party[] {
  const specs = c.pack.specializations;
  const out: Party[] = [];
  for (let mask = 1; mask < 1 << specs.length; mask++) {
    const chosen = specs.filter((_, i) => mask & (1 << i));
    if (chosen.length > 3) continue;
    for (const f of c.pack.formations) {
      out.push({
        formation: f.id,
        units: chosen.map((s, i) => ({ spec: s.id, position: f.positions[i].id, abilities: s.abilities.slice(0, 2), gear: {} })),
      });
    }
  }
  return out;
}

/**
 * Test-only rules. Each perk pick adds 0 to 3 attack to the whole party
 * (by the perk's place in the pool). With `stance`, every fight also opens
 * with a decision between turns: "charge" gives the party +4 attack for that fight.
 */
export function boostRules(opts: { stance?: boolean } = {}): Rules {
  return {
    ...standin,
    id: opts.stance ? "test-stance" : "test-boost",
    beforeTurn: opts.stance
      ? (x, f) => (f.round === 0 && f.queue.length === 0 ? { kind: "stance", at: `${f.stage}:open`, options: ["hold", "charge"] } : null)
      : undefined,
    apply(x, d, pick) {
      if (d.kind === "stance") {
        if (pick === "charge") for (const u of x.run.fight!.units) if (u.side === "party") u.stats.attack += 4;
        return;
      }
      standin.apply(x, d, pick);
      const bonus = x.c.dungeons.get(x.run.record.dungeon)!.perkPool.indexOf(pick) % 4;
      for (const u of x.run.party) u.stats.attack += bonus;
    },
  };
}
