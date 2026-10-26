/**
 * The campaign (steps/05-core-set/5a-campaign): the core set as a road to walk. The player starts with the
 * Knight, Cleric and Ranger in the Neutral formation and the first run. Each node is cleared once,
 * pays a fixed reward once and reveals the next: the seven runs of the enemies document, remixes
 * built from the same enemies, and trials that set needs on the party.
 *
 * Every number that makes a node harder or easier is its `foes` line (HP and damage, in percent),
 * set by the campaign tuning (npm run campaign). The rewards are fixed, so every node is designed,
 * and simulated, against exactly what the player owns when they reach it.
 */
import type { CampaignT, DungeonT, FoesT, NeedT } from "../../src/schema.js";
import { enc, encounters as E, stage, type Fight } from "./dungeons.js";
import { CAMPFIRE } from "./scale.js";
import knobs from "./campaign-knobs.json" with { type: "json" };

/**
 * A node's difficulty knob, k, found by the campaign tuning (npm run campaign -- --tune) and kept in campaign-knobs.json:
 * its foes have k% more HP and deal k/2 % more damage; a negative k takes k% off their HP and k/2 % off their damage.
 * A hard node is mostly a longer one, and an easy one a shorter one: when damage rose as fast as HP, every regular swing
 * two-shot a 2-HP caster; when it fell as fast (pacing pass), a boss eased to −55 lost its spikes as well as its length.
 */
export const knobFoes = (k: number): Pick<FoesT, "hp" | "power"> =>
  k > 0 ? { hp: Math.round(k), power: Math.round(k / 2) } : k < 0 ? { hp: Math.max(-80, Math.round(k)), power: Math.max(-80, Math.round(k / 2)) } : {};
/**
 * A node's two knobs (pacing pass): one for its regular fights, one for its boss. With one knob for both, the tuner set it
 * so the boss could be beaten, and the regular fights went soft ("the bandits at the start do 2 damage to you").
 * A plain number sets both.
 */
export type Knob = { mob: number; boss: number };
export const knobOf = (id: string): Knob => {
  const k = (knobs as Record<string, number | Knob>)[id] ?? 0;
  return typeof k === "number" ? { mob: k, boss: k } : k;
};
const withKnob = (n: Node, k: number): FoesT | undefined => {
  const f = { ...(n.foes ?? {}), ...knobFoes(k) };
  return Object.keys(f).length ? f : undefined;
};
const foesOf = (n: Node) => ({ foes: withKnob(n, knobOf(n.id).mob), bossFoes: withKnob(n, knobOf(n.id).boss) });

type Node = {
  id: string;
  name: string;
  kind: "dungeon" | "remix" | "trial";
  text: string;
  /** A spine run's id, or a new run's fights (the last is the boss). */
  run: string | { text: string; fights: Fight[] };
  needs?: NeedT[];
  foes?: FoesT;
  classes?: string[];
  formations?: string[];
  gear?: string[];
  note?: string;
};

const NODES: Node[] = [
  // ─── Act I: the Old Road ──────────────────────────────────────────────────
  {
    id: "old_road", name: "The Old Road", kind: "dungeon", run: "old_road",
    text: "Bandits, wolves and snakes on the road out of town, and an ogre chief at the bridge.",
    formations: ["vanguard"], gear: ["plate", "robes", "brigandine"],
  },
  {
    id: "road_at_night", name: "The Road at Night", kind: "remix",
    text: "The same road after dark: more wolves, more arrows, and the chief has brought his brother.",
    run: {
      text: "The Old Road after dark.",
      fights: [
        enc("night_wolves", "Night Wolves", [7, "wolf"]),
        enc("snake_grass", "Snake Grass", [3, "snake"], [2, "wolf"]),
        enc("archers_nest", "Archers' Nest", [1, "shieldman"], [3, "archer"]),
        enc("twin_bridge", "The Twin Bridge", [2, "ogre"]),
        enc("chiefs_return", "The Chief's Return", [1, "ogre_chief"], [1, "ogre"]),
      ],
    },
    classes: ["pyromancer"], gear: ["brand_staff", "veil", "heartstone", "warbow"],
  },
  {
    id: "wildfire", name: "Wildfire", kind: "trial",
    text: "The hills are crawling. Burn them out.",
    needs: [{ includes: ["pyromancer"] }],
    run: {
      text: "Hill country, thick with packs.",
      fights: [
        enc("howling", "The Howling", [8, "wolf"]),
        enc("viper_den", "Viper Den", [4, "snake"], [2, "bandit"]),
        enc("bandit_horde", "Bandit Horde", [6, "bandit"]),
        enc("packmaster", "The Packmaster", [1, "ogre_chief"], [5, "wolf"]),
      ],
    },
    classes: ["hoplite"], gear: ["oathblade", "prayer_beads"],
  },

  // ─── Act II: the Crypt ────────────────────────────────────────────────────
  {
    id: "crypt", name: "The Crypt", kind: "dungeon", run: "crypt",
    text: "Armored bones, bats you can't hit, ghosts magic can't touch, and Death with a bell.",
    classes: ["monk"], gear: ["sunstaff", "bastion_plate", "fang"],
  },
  {
    id: "ossuary", name: "The Ossuary", kind: "trial",
    text: "Bone piled on bone. Break it.",
    needs: [{ includes: ["monk"] }],
    run: {
      text: "The Crypt's bone store.",
      fights: [
        enc("bone_wall", "Bone Wall", [5, "skeleton"]),
        // Two Ghosts and two Skeletons: magic can't touch the one, steel can't touch the other, and the Monk's fists break the
        // armor. Three Ghosts were a wall for the Monk the node asks for (its Burning fist is Fire, which they resist).
        enc("haunted_hall", "Haunted Hall", [2, "ghost"], [2, "skeleton"]),
        enc("dead_watch", "The Dead Watch", [2, "skeleton"], [1, "witch"], [1, "ghost"]),
        enc("reapers_court", "The Reaper's Court", [1, "reaper"], [2, "skeleton"]),
      ],
    },
    formations: ["escort"], gear: ["paired_cestus", "scout_leathers", "shadowsilk", "mana_jewel"],
  },
  {
    id: "ogre_brothers", name: "The Ogre Brothers", kind: "trial",
    text: "Two chiefs, two clubs. Two walls to stand in front of them.",
    needs: [{ includes: ["knight", "hoplite"] }, { formation: "escort" }],
    run: {
      text: "Ogre country.",
      fights: [
        enc("ogre_road", "Ogre Road", [1, "ogre"], [3, "bandit"]),
        enc("twin_ogres", "Twin Ogres", [2, "ogre"]),
        enc("war_camp", "War Camp", [1, "shieldman"], [2, "archer"], [1, "ogre"]),
        enc("ogre_brothers", "The Ogre Brothers", [2, "ogre_chief"]),
      ],
    },
    classes: ["hexer"], gear: ["rime_staff", "hawks_eye", "vestments"],
  },

  // ─── Act III: the Fire Mine ───────────────────────────────────────────────
  {
    id: "fire_mine", name: "The Fire Mine", kind: "dungeon", run: "fire_mine",
    text: "Everything here burns, and the lord of the furnace casts a fire that ends parties.",
    classes: ["frostweaver"], gear: ["hoarfrost_staff", "ashen_plate", "mountain_charm"],
  },
  {
    id: "deep_freeze", name: "Deep Freeze", kind: "trial",
    text: "Put the mine's fires out, one by one.",
    needs: [{ includes: ["frostweaver"] }],
    run: {
      text: "The Fire Mine's lower halls.",
      fights: [
        enc("hound_run", "Hound Run", [6, "hellhound"]),
        enc("slime_pit", "Slime Pit", [3, "lava_slime"]),
        enc("imp_court", "Imp Court", [2, "fire_imp"], [3, "hellhound"]),
        enc("giants_forge", "The Giant's Forge", [1, "fire_giant"], [2, "hellhound"]),
      ],
    },
    classes: ["geomancer"], formations: ["blitz"], gear: ["granite_staff", "lucky_coin", "tower_mail", "glacier_staff"],
  },
  {
    id: "iron_wall", name: "Iron Wall", kind: "trial",
    text: "Only plate goes through the foundry.",
    needs: [{ armor: "heavy" }],
    run: {
      text: "The foundry under the mine.",
      fights: [
        enc("slag_heap", "Slag Heap", [2, "lava_slime"], [2, "hellhound"]),
        enc("powder_room", "Powder Room", [3, "bomb_bug"], [1, "ogre"]),
        enc("smelters", "The Smelters", [2, "troll"], [2, "archer"]),
        enc("iron_gate", "The Iron Gate", [1, "ogre_chief"], [2, "bomb_bug"]),
      ],
    },
    classes: ["valkyrie"], gear: ["skyspear", "chapel_staff", "rune_axe", "cornerstone_axe"],
  },

  // ─── Act IV: the Ice Pass ─────────────────────────────────────────────────
  {
    id: "ice_pass", name: "The Ice Pass", kind: "dungeon", run: "ice_pass",
    text: "Every fight asks what kind of hit you make. The Titan hides behind a shield of ice and armor like a glacier.",
    formations: ["scatter"], gear: ["pike", "sentinel_spear", "tiger_claws", "feather_charm", "longbow"],
  },
  {
    id: "valhalla", name: "Valhalla", kind: "trial",
    text: "Fall, and rise ready.",
    needs: [{ includes: ["valkyrie"] }],
    run: {
      text: "The frozen lake above the pass.",
      fights: [
        enc("snow_pack", "Snow Pack", [7, "snow_wolf"]),
        enc("golem_gate", "Golem Gate", [1, "ice_golem"], [2, "ice_spirit"]),
        enc("ghost_lights", "Ghost Lights", [3, "ice_ghost"]),
        enc("glacier_king", "The Glacier King", [1, "ice_titan"], [2, "snow_wolf"]),
      ],
    },
    classes: ["stormcaller"], formations: ["ambush"], gear: ["storm_rod", "plain_wind_staff", "quiet_cloak", "wraith_leathers"],
  },
  {
    id: "wild_hunt", name: "The Wild Hunt", kind: "trial",
    text: "Everything that runs in packs, running faster. Don't stand still for it.",
    needs: [{ includes: ["stormcaller"] }, { formation: "scatter" }],
    foes: { statuses: ["haste"], text: "Every foe starts each fight Hasted." },
    run: {
      text: "Old hunting grounds, at a gallop.",
      fights: [
        enc("hunt_wolves", "The Pack", [8, "wolf"]),
        enc("hunt_ghouls", "The Hungry Dead", [4, "ghoul"]),
        enc("hunt_hounds", "Hellhounds", [6, "hellhound"]),
        enc("huntmaster", "The Huntmaster", [1, "ogre_chief"], [4, "wolf"]),
      ],
    },
    classes: ["bramble_knight"], gear: ["rootstaff", "thorn_mail", "thorn_charm"],
  },

  // ─── Act V: the Storm Tower ───────────────────────────────────────────────
  {
    id: "storm_tower", name: "The Storm Tower", kind: "dungeon", run: "storm_tower",
    text: "Clouds of sparks, leeches that drink mana, and a queen behind a wall of drones.",
    classes: ["assassin"], formations: ["tortoise"], gear: ["bodkin", "stiletto", "trackers_jerkin", "thornheart_plate"],
  },
  {
    id: "knives_out", name: "Knives Out", kind: "trial",
    text: "The weak ones hide behind the strong. Find them.",
    needs: [{ includes: ["assassin"] }],
    run: {
      text: "The tower's guard rooms.",
      fights: [
        enc("sniper_ridge", "Sniper Ridge", [1, "shieldman"], [4, "archer"]),
        enc("lich_pair", "Lich Pair", [1, "mummy"], [2, "lich"]),
        enc("drone_wall", "Drone Wall", [4, "drone"], [2, "wisp"]),
        enc("hive_queen", "The Hive Queen", [1, "storm_queen"], [4, "drone"]),
      ],
    },
    formations: ["caravan"], gear: ["duellists_sword", "zephyr_staff", "tailwind_staff", "mana_leech", "glass_heart"],
  },
  {
    id: "long_road", name: "The Long Road", kind: "trial",
    text: "Seven fights and one campfire. Pace yourselves.",
    needs: [{ formation: "caravan" }],
    run: {
      text: "Every road so far, end to end.",
      fights: [
        { ...E.toll_gate, name: "Toll Gate" },
        { ...E.bone_yard, name: "Bone Yard" },
        { ...E.hound_pack, name: "Hound Pack" },
        { ...E.golem_hall, name: "Golem Hall" },
        { ...E.wisp_cloud, name: "Wisp Cloud" },
        { ...E.ghoul_pit, name: "Ghoul Pit" },
        { ...E.reaper, name: "Reaper" },
      ],
    },
    classes: ["bard"], gear: ["minstrels_bow", "twinned_charm", "warhorn", "twin_soul_charm"],
  },

  // ─── Act VI: the Deep Crypt ───────────────────────────────────────────────
  {
    id: "deep_crypt", name: "The Deep Crypt", kind: "dungeon", run: "deep_crypt",
    text: "Beneath the Crypt, something takes every voice. Power that isn't an ability is the key.",
    classes: ["vampire"], formations: ["last_stand"], gear: ["bloodied_claws", "bloodstone", "duskhide", "plain_dark_staff", "nightstaff"],
  },
  {
    id: "blood_moon", name: "Blood Moon", kind: "trial",
    text: "The dead mend each other, and the chapel takes every voice. Drink deep, and keep singing. Pick your third.",
    needs: [{ includes: ["vampire", "bard"] }],
    run: {
      text: "The Deep Crypt's chapel.",
      fights: [
        enc("chapel_watch", "Chapel Watch", [2, "bone_priest"], [1, "troll"]),
        enc("ghoul_feast", "Ghoul Feast", [4, "ghoul"]),
        enc("quiet_hall", "Quiet Hall", [2, "wraith"], [2, "ghost"]),
        enc("silent_court", "The Silent Court", [1, "silent_one"], [2, "bone_priest"]),
      ],
    },
    classes: ["paladin"], formations: ["champion"], gear: ["crusader_sword", "wardens_blade", "sun_charm", "moon_charm", "vampires_tooth", "sanguine_staff"],
  },
  {
    id: "judgement", name: "Judgement", kind: "trial",
    text: "Spells, curses and cheering imps. Shelter the party, silence the casters, strike what's lifted up. Pick your third.",
    needs: [{ includes: ["paladin", "hexer"] }],
    run: {
      text: "The lich court.",
      fights: [
        enc("lich_court", "Lich Court", [1, "mummy"], [3, "lich"]),
        enc("imp_rally", "Imp Rally", [2, "fire_imp"], [2, "ogre"]),
        enc("coven", "Coven", [2, "witch"], [2, "wraith"]),
        enc("giants_wrath", "The Giant's Wrath", [1, "fire_giant"], [2, "fire_imp"]),
      ],
    },
    gear: ["dawn_staff", "scale_coat", "serrated_charm", "templar_staff", "needle"],
  },

  // ─── Act VII: the Tower Top ───────────────────────────────────────────────
  {
    id: "tower_top", name: "The Tower Top", kind: "dungeon", run: "tower_top",
    text: "The queen again, at the top of the tower, and the king who rages when his soldiers fall. Strike past them.",
    gear: ["ember_staff", "grounding_rod", "leech_staff", "splitter", "plain_axe", "mist_claws", "heartwood_staff", "archmages_robes", "thirsting_jewel"],
  },
  {
    id: "royal_court", name: "The Royal Court", kind: "remix",
    text: "The king and the queen, together.",
    run: {
      text: "The throne room above the storm.",
      fights: [
        enc("court_wisps", "Court Wisps", [6, "wisp"], [2, "leech"]),
        enc("honour_guard", "Honour Guard", [4, "soldier"]),
        enc("royal_couple", "The Royal Couple", [1, "storm_king"], [1, "storm_queen"]),
      ],
    },
  },
];

const runs: Record<string, true> = { old_road: true, crypt: true, fire_mine: true, ice_pass: true, storm_tower: true, deep_crypt: true, tower_top: true };

/** The campaign's own runs: a node's remixed fights, or a spine run with the node's foes. */
export const campaignDungeons: DungeonT[] = [];
/** A spine run that a node changes (foes) is copied under the node's id; otherwise the node plays it as is. */
/**
 * One campfire a run, in the middle, as the director asked: after half the regular fights (rounded up), the player picks
 * HP back (REST) or MP back (FOCUS) for everyone standing. It sat before the boss for a round; in the middle it splits the
 * run's attrition in two, so each regular fight can hit harder.
 */
function withCampfire(stages: DungeonT["stages"]): DungeonT["stages"] {
  const regular = stages.filter((s) => s.kind === "fight" && !s.boss).length;
  if (regular < 1) return stages;
  const at = Math.ceil(regular / 2);
  return [...stages.slice(0, at), { kind: "campfire", id: "campfire", hp: CAMPFIRE.hp, mp: CAMPFIRE.mp, revive: CAMPFIRE.revive }, ...stages.slice(at)];
}

export function campaignWith(spine: DungeonT[]): CampaignT {
  campaignDungeons.length = 0;
  const nodes = NODES.map((n) => {
    let dungeon: string;
    const { foes, bossFoes } = foesOf(n);
    dungeon = `cmp_${n.id}`;
    if (typeof n.run === "string") {
      if (!runs[n.run]) throw new Error(`campaign: no spine run '${n.run}'`);
      const base = structuredClone(spine.find((d) => d.id === n.run)!);
      campaignDungeons.push({ ...base, id: dungeon, name: n.name, ...(foes ? { foes } : {}), ...(bossFoes ? { bossFoes } : {}), stages: withCampfire(base.stages) });
    } else {
      const fights = n.run.fights;
      campaignDungeons.push({
        id: dungeon, name: n.name, text: n.run.text, partySize: { max: 3 }, perkPool: [], challenges: [],
        ...(foes ? { foes } : {}),
        ...(bossFoes ? { bossFoes } : {}),
        stages: withCampfire(fights.map((f, i) => stage(f, i === fights.length - 1))),
      });
    }
    return {
      id: n.id, name: n.name, kind: n.kind, dungeon, text: n.text, needs: n.needs ?? [],
      rewards: { classes: n.classes ?? [], formations: n.formations ?? [], gear: n.gear ?? [] },
      ...(n.note ? { note: n.note } : {}),
    };
  });
  return { start: { classes: ["knight", "cleric", "ranger"], formations: ["neutral"], gear: [] }, nodes };
}
