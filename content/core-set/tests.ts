/**
 * The documents' own tests, as data: for each encounter, a trio that should beat
 * it and one that should fail for the challenge's own reason
 * (docs/core-set/enemies-encounters-and-dungeons.md, Encounters), and for each
 * run the trios that should clear it. `npm run smoke` plays them.
 */
export type EncounterTest = { dungeon: string; stage: string; poses: string; beats: string[]; fails?: string[] };

export const encounterTests: EncounterTest[] = [
  { dungeon: "old_road", stage: "toll_gate", poses: "none", beats: ["knight", "cleric", "ranger"] },
  { dungeon: "old_road", stage: "wolf_pack", poses: "Swarm", beats: ["knight", "cleric", "ranger"], fails: ["assassin", "vampire", "hexer"] },
  { dungeon: "old_road", stage: "snake_pit", poses: "Poisoner", beats: ["knight", "cleric", "ranger"], fails: ["ranger", "bard", "assassin"] },
  { dungeon: "old_road", stage: "bandit_camp", poses: "Shield wall", beats: ["knight", "cleric", "ranger"], fails: ["knight", "bard", "vampire"] },
  { dungeon: "old_road", stage: "ogre_bridge", poses: "Brute", beats: ["knight", "cleric", "ranger"], fails: ["assassin", "pyromancer", "hexer"] },
  { dungeon: "old_road", stage: "ogre_chief", poses: "Tank buster", beats: ["knight", "cleric", "ranger"], fails: ["ranger", "assassin", "stormcaller"] },
  { dungeon: "crypt", stage: "bone_yard", poses: "Armored shell", beats: ["ranger", "hexer", "geomancer"], fails: ["knight", "bard", "vampire"] },
  { dungeon: "crypt", stage: "dark_hall", poses: "Mixed defenses", beats: ["ranger", "cleric", "monk"], fails: ["knight", "bard", "vampire"] },
  { dungeon: "crypt", stage: "curse_room", poses: "Curser + Armored shell", beats: ["cleric", "bard", "ranger"], fails: ["knight", "hoplite", "geomancer"] },
  { dungeon: "deep_crypt", stage: "grave_watch", poses: "Healer and brutes", beats: ["hexer", "knight", "ranger"], fails: ["knight", "cleric", "bramble_knight"] },
  { dungeon: "crypt", stage: "ghoul_pit", poses: "Linked pack", beats: ["pyromancer", "stormcaller", "knight"], fails: ["assassin", "ranger", "cleric"] },
  { dungeon: "deep_crypt", stage: "lich_lair", poses: "Nuker behind a Shield wall", beats: ["assassin", "knight", "cleric"], fails: ["knight", "bard", "vampire"] },
  { dungeon: "crypt", stage: "reaper", poses: "Executioner", beats: ["cleric", "hoplite", "ranger"], fails: ["monk", "stormcaller", "bard"] },
  { dungeon: "fire_mine", stage: "hound_pack", poses: "Skirmisher + Burn", beats: ["frostweaver", "knight", "cleric"], fails: ["pyromancer", "vampire", "assassin"] },
  { dungeon: "fire_mine", stage: "lava_flow", poses: "Splitter", beats: ["geomancer", "hoplite", "cleric"], fails: ["bard", "monk", "hexer"] },
  { dungeon: "fire_mine", stage: "bomb_room", poses: "Bomb pack", beats: ["knight", "cleric", "geomancer"], fails: ["pyromancer", "stormcaller", "frostweaver"] },
  { dungeon: "fire_mine", stage: "imp_kennel", poses: "Buffer", beats: ["hexer", "knight", "frostweaver"], fails: ["cleric", "bramble_knight", "valkyrie"] },
  { dungeon: "fire_mine", stage: "fire_giant", poses: "Interrupt check", beats: ["frostweaver", "knight", "cleric"], fails: ["pyromancer", "ranger", "vampire"] },
  { dungeon: "ice_pass", stage: "golem_hall", poses: "Hardening hide", beats: ["geomancer", "hoplite", "cleric"], fails: ["monk", "bard", "vampire"] },
  { dungeon: "ice_pass", stage: "ice_heart", poses: "Elemental", beats: ["pyromancer", "knight", "cleric"], fails: ["frostweaver", "hexer", "valkyrie"] },
  { dungeon: "ice_pass", stage: "whiteout", poses: "Spellward + Elemental", beats: ["monk", "ranger", "knight"], fails: ["hexer", "frostweaver", "stormcaller"] },
  { dungeon: "ice_pass", stage: "ice_titan", poses: "Break shield + Raidwide", beats: ["ranger", "valkyrie", "cleric"], fails: ["knight", "geomancer", "pyromancer"] },
  { dungeon: "storm_tower", stage: "wisp_cloud", poses: "Swarm, magical", beats: ["stormcaller", "cleric", "bramble_knight"], fails: ["monk", "assassin", "valkyrie"] },
  { dungeon: "storm_tower", stage: "wisp_nest", poses: "Swarm + Mana thief", beats: ["bramble_knight", "knight", "ranger"], fails: ["pyromancer", "hexer", "cleric"] },
  { dungeon: "storm_tower", stage: "leech_den", poses: "Mana thief", beats: ["monk", "bramble_knight", "ranger"], fails: ["pyromancer", "hexer", "cleric"] },
  { dungeon: "storm_tower", stage: "storm_queen", poses: "Summoner", beats: ["stormcaller", "assassin", "cleric"], fails: ["knight", "hoplite", "vampire"] },
  { dungeon: "deep_crypt", stage: "silent_hall", poses: "Binder + Armored shell", beats: ["bard", "monk", "cleric"], fails: ["pyromancer", "frostweaver", "hexer"] },
  { dungeon: "deep_crypt", stage: "silent_one", poses: "Silence field", beats: ["bard", "monk", "cleric"], fails: ["frostweaver", "stormcaller", "paladin"] },
  { dungeon: "tower_top", stage: "storm_king", poses: "Avenger", beats: ["valkyrie", "assassin", "monk"], fails: ["pyromancer", "stormcaller", "frostweaver"] },
];

export type RunTest = { dungeon: string; clears: string[][] };

export const runTests: RunTest[] = [
  { dungeon: "old_road", clears: [["knight", "cleric", "ranger"]] },
  { dungeon: "crypt", clears: [["ranger", "cleric", "pyromancer"], ["hoplite", "cleric", "stormcaller"]] },
  { dungeon: "fire_mine", clears: [["frostweaver", "knight", "cleric"], ["hexer", "geomancer", "cleric"]] },
  { dungeon: "ice_pass", clears: [["ranger", "valkyrie", "cleric"], ["hoplite", "ranger", "cleric"]] },
  { dungeon: "storm_tower", clears: [["bramble_knight", "assassin", "frostweaver"]] },
  { dungeon: "deep_crypt", clears: [["bard", "monk", "cleric"]] },
  { dungeon: "tower_top", clears: [["valkyrie", "assassin", "monk"]] },
];
