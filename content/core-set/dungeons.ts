/**
 * The 27 encounters and 7 dungeons (docs/core-set/enemies-encounters-and-dungeons.md).
 * Dungeons are played in order, with no progression between them.
 */
import type { DungeonT } from "../../src/schema.js";
import { CAMPFIRE } from "./scale.js";

export type Fight = { id: string; name: string; enemies: string[] };
const times = (n: number, id: string) => Array<string>(n).fill(id);
export const enc = (id: string, name: string, ...groups: [number, string][]): Fight => ({ id, name, enemies: groups.flatMap(([n, e]) => times(n, e)) });

/** The encounters, by number in the document. */
export const encounters = {
  toll_gate: enc("toll_gate", "1. Toll Gate", [3, "bandit"]),
  wolf_pack: enc("wolf_pack", "2. Wolf Pack", [6, "wolf"]),
  snake_pit: enc("snake_pit", "3. Snake Pit", [3, "snake"], [2, "bandit"]),
  bandit_camp: enc("bandit_camp", "4. Bandit Camp", [1, "shieldman"], [2, "archer"], [1, "bandit"]),
  ogre_bridge: enc("ogre_bridge", "5. Ogre Bridge", [1, "ogre"], [2, "bandit"]),
  ogre_chief: enc("ogre_chief", "6. Ogre Chief", [1, "ogre_chief"], [2, "bandit"]),
  bone_yard: enc("bone_yard", "7. Bone Yard", [4, "skeleton"]),
  dark_hall: enc("dark_hall", "8. Dark Hall", [1, "skeleton"], [1, "ghost"], [2, "bat"]),
  curse_room: enc("curse_room", "9. Curse Room", [1, "witch"], [2, "skeleton"]),
  grave_watch: enc("grave_watch", "10. Grave Watch", [1, "bone_priest"], [2, "troll"]),
  ghoul_pit: enc("ghoul_pit", "11. Ghoul Pit", [4, "ghoul"]),
  lich_lair: enc("lich_lair", "12. Lich Lair", [1, "lich"], [1, "mummy"]),
  reaper: enc("reaper", "13. Reaper", [1, "reaper"], [2, "bat"]),
  hound_pack: enc("hound_pack", "14. Hound Pack", [5, "hellhound"]),
  lava_flow: enc("lava_flow", "15. Lava Flow", [2, "lava_slime"]),
  bomb_room: enc("bomb_room", "16. Bomb Room", [3, "bomb_bug"]),
  imp_kennel: enc("imp_kennel", "17. Imp Kennel", [1, "fire_imp"], [3, "hellhound"]),
  fire_giant: enc("fire_giant", "18. Fire Giant", [1, "fire_giant"]),
  golem_hall: enc("golem_hall", "19. Golem Hall", [2, "ice_golem"]),
  ice_heart: enc("ice_heart", "20. Ice Heart", [3, "ice_spirit"]),
  whiteout: enc("whiteout", "21. Whiteout", [2, "ice_ghost"], [1, "ice_spirit"]),
  ice_titan: enc("ice_titan", "22. Ice Titan", [1, "ice_titan"]),
  wisp_cloud: enc("wisp_cloud", "23. Wisp Cloud", [8, "wisp"]),
  wisp_nest: enc("wisp_nest", "24. Wisp Nest", [4, "wisp"], [2, "leech"]),
  leech_den: enc("leech_den", "25. Leech Den", [4, "leech"]),
  storm_queen: enc("storm_queen", "26. Storm Queen", [1, "storm_queen"], [2, "drone"]),
  silent_hall: enc("silent_hall", "27. Silent Hall", [2, "wraith"], [2, "skeleton"]),
  snow_wolf_pack: enc("wolf_pack", "2. Wolf Pack (Snow Wolves)", [6, "snow_wolf"]),
  silent_one: enc("silent_one", "Silent One", [1, "silent_one"]),
  storm_king: enc("storm_king", "Storm King", [1, "storm_king"]),
} satisfies Record<string, Fight>;

export const stage = (f: Fight, boss = false) => ({ kind: "fight" as const, id: f.id, name: f.name, enemies: f.enemies, ...(boss ? { boss: true } : {}) });
/**
 * One campfire a run, after half the regular fights (rounded up): REST, FOCUS or RAISE (the campaign, Oct 25–26, 2026). Step 5e
 * puts it in the spine runs too: the rules document says every run has one, and free play played these runs without it.
 */
export function withCampfire(stages: DungeonT["stages"]): DungeonT["stages"] {
  if (stages.some((s) => s.kind === "campfire")) return stages;
  const regular = stages.filter((s) => s.kind === "fight" && !s.boss).length;
  if (regular < 1) return stages;
  const at = Math.ceil(regular / 2);
  return [...stages.slice(0, at), { kind: "campfire", id: "campfire", hp: CAMPFIRE.hp, mp: CAMPFIRE.mp, revive: CAMPFIRE.revive }, ...stages.slice(at)];
}
const run = (id: string, name: string, text: string, fights: Fight[]): DungeonT => ({
  id, name, text, partySize: { max: 3 }, perkPool: [], challenges: [],
  stages: withCampfire(fights.map((f, i) => stage(f, i === fights.length - 1))),
});

const E = encounters;
export const dungeons: DungeonT[] = [
  run("old_road", "Run 1: Old Road", "A mixed gauntlet, gentle. Clearable by the ungeared starting trio.", [E.toll_gate, E.wolf_pack, E.snake_pit, E.bandit_camp, E.ogre_bridge, E.ogre_chief]),
  run("crypt", "Run 2: Crypt", "A mixed gauntlet among the dead.", [E.bone_yard, E.dark_hall, E.curse_room, E.ghoul_pit, E.reaper]),
  run("fire_mine", "Run 3: Fire Mine", "A long grind of Burn attrition.", [E.hound_pack, E.lava_flow, E.bomb_room, E.imp_kennel, E.fire_giant]),
  run("ice_pass", "Run 4: Ice Pass", "An echo: every fight asks what kind of hit you make.", [E.snow_wolf_pack, E.golem_hall, E.ice_heart, E.whiteout, E.ice_titan]),
  run("storm_tower", "Run 5: Storm Tower", "A long grind that drains mana.", [E.wisp_cloud, E.wisp_nest, E.leech_den, E.storm_queen]),
  run("deep_crypt", "Run 6: Deep Crypt", "A spike beneath the Crypt: a lock on power outside abilities.", [E.grave_watch, E.lich_lair, E.silent_hall, E.silent_one]),
  run("tower_top", "Run 7: Tower Top", "A spike above the Storm Tower: the Seek bench, an elite mid-run and a mana drain.", [E.wisp_nest, E.storm_queen, E.storm_king]),
];
