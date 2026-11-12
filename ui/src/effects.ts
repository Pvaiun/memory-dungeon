/**
 * The effects tables: which VFX strip every action, status and field event plays, art only. The strips are the
 * director's "VFX Spells" pack, named as it names them, with recoloured and turned copies (ui/tools/assets.py).
 * battle/effects.ts plays them; scene.ts draws them.
 */
import { abilityLook, pieceLook, weaponLook } from "./art.js";
import { baseGearId, c } from "./content.js";

/*
 * Every action, status and event picks its own effect from the VFX strips (ui/tools/assets.py packs them, named as the
 * pack names them, with recoloured and turned copies). An effect sits on a unit by an anchor and plays once; its size is
 * a whole number of times the art's, picked to suit the unit (scene.ts), so the pixels stay square. Nothing here changes
 * a fight: the same hit is the same hit whatever it looks like.
 */
/** Where an effect sits on a unit: its body's middle, standing on its feet, over its head, or flat on the ground under it. */
export type Anchor = "mid" | "feet" | "head" | "ground";
/**
 * One effect on a unit. `s` the strip; `at` its anchor (mid); `size` how big for the unit (1 the unit's height, the
 * default; more for a heavy blow); `x` a fixed scale in place of that; `d` a delay in ms; `fps` (14); `f` one still frame
 * (a prop) held `ms` long; `dx`, `dy` a drift over its life (a note rising, a drop falling); `ox`, `oy` an offset; `rev` art
 * that moves leftward (mirrored to follow a blow); `still` never mirrored (words, clocks).
 */
export type Fx = { s: string; at?: Anchor; size?: number; x?: number; d?: number; fps?: number; f?: number; ms?: number; dx?: number; dy?: number; ox?: number; oy?: number; rev?: boolean; still?: boolean };
/** A missile: a strip (or one still frame of a prop) flying from the actor's hand to the unit hit, before the hit's effects. */
export type Missile = { s: string; f?: number; x?: number; speed?: number; arc?: number };
/** How an action looks: what flies, what plays on each unit it reaches, and what plays on the actor as it acts. */
export type Look = { hit: Fx[]; missile?: Missile; self?: Fx[] };

const fx = (s: string, o: Omit<Fx, "s"> = {}): Fx => ({ s, ...o });
const look = (hit: Fx | Fx[], o: Omit<Look, "hit"> = {}): Look => ({ hit: Array.isArray(hit) ? hit : [hit], ...o });
/** Three notes rising over the head and swaying, one after another: a song. */
const notes = (d = 0): Fx[] => [0, 1, 2].map((f) => fx("music_note", { f, x: 1, at: "head", ms: 700, d: d + f * 140, ox: [-8, 7, 0][f], oy: 6, dy: -14, dx: [-3, 3, -2][f] }));
/** Blood drops falling from a wound. */
const drops = (n = 2, f = 0): Fx[] => Array.from({ length: n }, (_, i) => fx("drop", { f, x: 1, ms: 420, d: i * 120, ox: i % 2 ? 6 : -5, oy: -4, dy: 12 }));

/** Basic attacks by weapon kind: how each swing lands. */
const KIND_FX: Record<string, Look> = {
  dagger: look(fx("quick_slash")),
  fist: look([fx("star_hit"), fx("debris_hit", { d: 60 })]),
  sword: look(fx("slash")),
  rune_sword: look([fx("crescent_cut"), fx("frost_twinkle", { d: 120 })]),
  spear: look(fx("thrust")),
  axe: look(fx("swipe")),
  great_weapon: look([fx("club_swing"), fx("debris_hit", { d: 140 })]),
  hammer: look([fx("pound"), fx("debris_hit", { d: 160 })]),
  mace: look([fx("club_swing"), fx("star_hit", { d: 140 })]),
  bow: look(fx("pierce_flash"), { missile: { s: "arrow_fly" } }),
  wand: look(fx("ring_pop"), { missile: { s: "gleam", speed: 0.8 } }),
  staff: look(fx("ripple_burst"), { missile: { s: "gleam", speed: 0.8 } }),
};
/** A caster's weapon by its theme (art.ts's piece and foe looks): a small spell for a basic attack. */
const THEME_BASIC: Record<string, Look> = {
  fire: look(fx("flame", { at: "feet" }), { missile: { s: "fireball" } }),
  ice: look(fx("frost_burst"), { missile: { s: "ice_lance" } }),
  lightning: look(fx("static"), { missile: { s: "ball_lightning", speed: 0.8 } }),
  wind: look(fx("breeze")),
  earth: look([fx("debris_hit"), fx("dust_puff", { at: "feet", d: 80 })]),
  light: look(fx("gleam_gold"), { missile: { s: "gleam_gold" } }),
  dark: look(fx("void"), { missile: { s: "fireball_dark" } }),
  arcane: look(fx("ring_pop"), { missile: { s: "gleam", speed: 0.8 } }),
  song: look(fx("ring_pop"), { missile: { s: "music_note", f: 2, speed: 0.8 } }),
};
/** A foe's basic attack, where its weapon's kind or theme isn't the look it should have. */
const ENEMY_BASIC: Record<string, Look> = {
  wolf: look(fx("bite_plain")), snow_wolf: look(fx("bite")), hellhound: look(fx("chomp_fire")), snake: look(fx("bite_venom")),
  bat: look(fx("bite_blood", { size: 0.8 })), leech: look(fx("bite_blood")),
  bandit: look(fx("slash")), shieldman: look(fx("swipe")), skeleton: look(fx("quick_slash")), ghoul: look(fx("claw")),
  reaper: look(fx("crescent_cut_dark")), mummy: look(fx("club_swing")), silent_one: look(fx("slash_dark")),
  ogre: look([fx("club_swing"), fx("debris_hit", { d: 140 })]), ogre_chief: look([fx("club_swing", { size: 1.4 }), fx("debris_hit", { d: 140 })]),
  troll: look([fx("pound"), fx("dust_puff", { at: "feet", d: 160 })]),
  ice_golem: look([fx("pound"), fx("frost_burst", { d: 140 })]), ice_titan: look([fx("pound", { size: 1.4 }), fx("frost_burst", { d: 140 })]),
  ghost: look(fx("shadow_cloud")), ice_ghost: look(fx("diamond_dust")), wraith: look(fx("claw_dark")),
  bone_priest: look(fx("void"), { missile: { s: "bone", speed: 0.8 } }), witch: look(fx("curse")), lich: look(fx("void"), { missile: { s: "fireball_dark" } }),
  fire_imp: look(fx("flame", { at: "feet" }), { missile: { s: "fireball" } }), fire_giant: look(fx("blast")),
  lava_slime: look(fx("splash_lava")), mini_slime: look(fx("splash_slime")), bomb_bug: look(fx("blast", { size: 0.8 })),
  ice_spirit: look(fx("frost_burst"), { missile: { s: "ice_lance" } }), wisp: look(fx("static"), { missile: { s: "ball_lightning", speed: 0.8 } }),
  drone: look(fx("shock", { rev: true })), soldier: look(fx("spark_hit"), { missile: { s: "gunshot", speed: 1.6 } }),
  storm_queen: look(fx("lightning_bolt", { at: "feet" })), storm_king: look(fx("lightning_bolt", { at: "feet", size: 1.3 })),
  archer: look(fx("pierce_flash"), { missile: { s: "arrow_fly" } }),
};

/** Each ability's look, by its base id (a trained form plays its base's). */
const ABILITY_FX: Record<string, Look> = {
  // Knight
  shield_bash: look([fx("pound"), fx("star_hit", { d: 120 })]),
  // Cleric
  cure: look(fx("restore", { size: 1.6 })), renew: look([fx("regen_aura_green", { at: "feet", oy: 3, size: 1.6 }), fx("minor_heal_green", { d: 200 })]),
  raise: look([fx("holy_beam", { at: "feet" }), fx("angel_wings", { d: 260 })]),
  // Ranger
  barbed_arrow: look([fx("claw_blood"), ...drops(2)], { missile: { s: "arrow_fly_blood" } }),
  frost_arrow: look([fx("ice_shard", { size: 1.5 }), fx("frost_twinkle", { d: 120 })], { missile: { s: "arrow_fly_ice" } }),
  rending_arrow: look([fx("pierce_flash"), fx("debris_hit", { d: 80 })], { missile: { s: "arrow_fly" } }),
  // Bramble knight
  thicket: look(fx("thorns", { at: "feet" })), regrowth: look(fx("sprout", { at: "feet", size: 1.6 })), bramble_lash: look(fx("thorns", { at: "feet" })),
  // Hoplite
  aspis: look(fx("shockwave_gold", { size: 1.4 })), othismos: look([fx("shockwave"), fx("dust_kick", { at: "feet", d: 80 })]), spear_thrust: look([fx("thrust"), fx("debris_hit", { d: 120 })]),
  // Paladin
  condemn: look(fx("holy_cross")), absolve: look([fx("holy_cross"), fx("restore", { d: 160, size: 1.6 })]),
  smite: look([fx("holy_beam", { at: "feet", size: 1.7 }), fx("flame", { at: "feet", d: 240 })]),
  // Valkyrie
  gale_spear: look([fx("thrust_storm"), fx("static", { d: 80 })]),
  choosing: look([fx("angel_wings", { oy: -4 }), fx("restore", { d: 200, size: 1.6 })]),
  skyfall: look([fx("lightning_bolt", { at: "feet", size: 1.6 }), fx("shockwave", { d: 220 })]),
  // Bard
  war_ballad: look(notes()), allegro: look([...notes(), fx("gust", { d: 200, still: true })]), encore: look([...notes(), fx("gleam_gold", { d: 300 })]),
  // Hexer
  malison: look(fx("curse", { size: 1.4 })), unmake: look([fx("void", { size: 1.4 }), fx("shadow_cloud", { d: 200 })]), enfeeble: look(fx("shadow_cloud")),
  // Monk
  flow: look(fx("whirlwind", { at: "feet" })), burning_fist: look([fx("uppercut_fire"), fx("star_hit", { d: 60 })]), pressure_point: look([fx("pierce_flash", { x: 2 }), fx("spark_scatter", { d: 80 })]),
  // Assassin
  vanish: look(fx("smoke_puff", { size: 1.6 })), backstab: look([fx("quick_slash", { size: 1.4 }), ...drops(2)]), garrote: look(fx("quick_slash")),
  // Vampire
  blood_drain: look([fx("chomp_blood"), ...drops(3)]), blood_gift: look(fx("restore_blood"), { self: drops(3) }), frenzy: look([fx("uppercut_might"), fx("rage", { at: "head", d: 200, still: true })]),
  // Pyromancer
  firebolt: look(fx("blast", { size: 0.8 }), { missile: { s: "fireball" } }),
  fireball: look(fx("explosion"), { missile: { s: "fireball", x: 2, arc: 10 } }),
  pyre: look([fx("fire_pillar", { at: "feet", size: 1.8 }), fx("ember", { d: 300 })]),
  // Frostweaver
  frost_lance: look([fx("ice_shard", { size: 1.3 }), fx("frost_burst", { d: 160 })], { missile: { s: "ice_lance", x: 2 } }),
  blizzard: look([fx("diamond_dust", { size: 1.3 }), fx("frost_twinkle", { d: 200 })]),
  // Stormcaller
  chain_lightning: look([fx("lightning_bolt", { at: "feet", size: 1.6 }), fx("static", { d: 100 })]),
  thunderstorm: look(fx("ball_lightning")), static_charge: look(fx("static", { size: 1.3 })),
  // Geomancer
  earthen_shell: look(fx("crystal_earth")), rockfall: look([fx("rock_fall", { at: "feet", size: 1.8 }), fx("dust_puff", { at: "feet", d: 300 })]),
  tremor: look([fx("stone_spire", { at: "feet", size: 1.6 }), fx("dust_kick", { at: "feet", d: 200 })]),
  // the foes'
  shield_slam: look([fx("pound"), fx("star_hit", { d: 120 })]), flatten: look([fx("club_swing", { size: 1.4 }), fx("debris_hit", { d: 140 }), fx("dust_puff", { at: "feet", d: 160, x: 2 })]),
  crush: look([fx("club_swing", { size: 1.6 }), fx("blast", { d: 160 })]), mend: look(fx("restore_dark", { size: 1.6 })), curse: look(fx("curse", { size: 1.4 })),
  soulfire: look(fx("fire_pillar_dark", { at: "feet", size: 1.4 }), { missile: { s: "fireball_dark", x: 2 } }),
  dig_up: look([fx("dust_kick", { at: "feet", x: 2 }), fx("smoke_puff", { d: 120, size: 1.6 })]), death_bell: look([fx("shockwave_dark"), fx("death", { at: "head", d: 200, still: true })]),
  reap: look(fx("crescent_cut_dark", { size: 1.4 })), tolling: look([fx("shockwave_dark", { size: 1.4 }), fx("shockwave_dark", { d: 260 })]),
  kindle: look(fx("fire_pillar", { at: "feet", size: 1.4 })), take_aim: look(fx("target_lock", { fps: 6 })), cheer: look(fx("uppercut_might")),
  brand: look([fx("flame", { at: "feet", size: 1.3 }), fx("ember", { d: 160 })], { missile: { s: "fireball" } }),
  inferno: look([fx("explosion", { x: 2 }), fx("fire_pillar", { at: "feet", d: 200 })]),
  hailstorm: look([fx("ice_shard", { size: 1.4 }), fx("frost_burst", { d: 220 })]),
  tempest: look([fx("lightning_bolt", { at: "feet", size: 1.6 }), fx("static", { d: 120 })]),
  call_drones: look(fx("static")), rally_soldiers: look(fx("static")),
  mute: look(fx("void")), quiet: look(fx("shockwave_dark")),
};
/** An ability with no look of its own: its theme's or motion's (abilityLook), else a plain blow. */
const THEME_ABILITY: Record<string, Look> = {
  fire: look(fx("explosion"), { missile: { s: "fireball" } }), ice: look(fx("frost_burst", { size: 1.3 })), lightning: look(fx("lightning_bolt", { at: "feet" })),
  wind: look(fx("tornado", { at: "feet" })), earth: look(fx("rock_fall", { at: "feet" })), light: look(fx("holy_beam", { at: "feet" })), dark: look(fx("shadow_cloud")),
  arcane: look(fx("ripple_burst")), slash: look(fx("slash")), pierce: look(fx("thrust")), blunt: look(fx("pound")), physical: look(fx("debris_hit")),
};

/** An ability's own look, if it has one. */
export const abilityFx = (id: string): Look | undefined => ABILITY_FX[id.replace(/__\w+$/, "")];
/** A damaging ability with no look of its own: its theme's or its motion's. */
export const themeFx = (id: string): Look => THEME_ABILITY[abilityLook(id)] ?? THEME_ABILITY.physical;
/** A class's own theme, for the plain casters' weapons (a Frostweaver's plain staff casts ice, whatever strip it's drawn with). */
const CLASS_THEME: Record<string, string> = {
  pyromancer: "fire", frostweaver: "ice", stormcaller: "lightning", geomancer: "earth", hexer: "dark", cleric: "light", paladin: "light", bard: "song",
};
const PLAIN_CASTER = new Set(["plain_staff", "plain_wand", "plain_rune_sword", "plain_mace"]);
/**
 * What a basic attack looks like: a foe's own; else its weapon's theme (a caster's piece; a plain one its wielder's
 * class's, `cls`); else its weapon's kind.
 */
export function basicFx(ref: string, enemy?: string, cls?: string): Look {
  if (enemy && ENEMY_BASIC[enemy]) return ENEMY_BASIC[enemy];
  const own = cls && PLAIN_CASTER.has(baseGearId(ref)) ? CLASS_THEME[cls] : undefined;
  if (own && THEME_BASIC[own]) return THEME_BASIC[own];
  const theme = weaponLook(ref, enemy);
  if (THEME_BASIC[theme] && (enemy || ref === "unarmed" || pieceLook(ref))) return THEME_BASIC[theme];
  const kind = ref.startsWith("enemy:") ? c.enemies.get(ref.slice(6))?.weapon?.kind : ref === "unarmed" ? "fist" : c.gear.get(ref)?.weapon?.kind;
  return KIND_FX[kind ?? ""] ?? KIND_FX.fist;
}

/** A status landing on a unit. */
const STATUS_FX: Record<string, Fx[]> = {
  bleed: [fx("claw_blood"), ...drops(1)], burn: [fx("flame", { at: "feet" })], chill: [fx("frost_twinkle")], shock: [fx("static")],
  rot: [fx("poison_rot")], sunder: [fx("debris_hit")], weaken: [fx("sadness", { at: "head", still: true })], slow: [fx("slow", { at: "head", still: true })],
  stun: [fx("star_hit", { at: "head" }), fx("confuse", { at: "head", d: 100, still: true, fps: 10 })],
  silence: [fx("silence", { at: "head", still: true, fps: 10 })], marked: [fx("target_lock", { fps: 5, still: true })],
  doom: [fx("doom_timer", { at: "head", still: true, fps: 10, size: 0.8 })], taunt: [fx("rage", { at: "head", still: true, fps: 8 })],
  hidden: [fx("smoke_puff", { size: 1.6 })], might: [fx("uppercut_might", { at: "feet" })], haste: [fx("gust", { still: true })],
  guard: [fx("crystal_steel")], shield: [fx("crystal_shield")], aegis: [fx("shockwave_gold", { size: 1.4 })], regen: [fx("regen_aura_green", { at: "feet", oy: 3, size: 1.6 })],
  clarity: [fx("radiance_mp", { at: "feet" })], bulwark: [fx("crystal_steel", { size: 1.3 })], bulwark_broken: [fx("debris_hit", { size: 1.6 }), fx("ring_pop", { d: 100 })],
  ice_crust: [fx("frost_burst")], encore: notes(), thunderstorm_storm: [fx("ball_lightning")], static_charge_on: [fx("static")],
  bloodlust_on: [fx("uppercut_might", { at: "feet" }), ...drops(2)], bedrock_on: [fx("crystal_earth")], last_rites_on: [fx("candle", { f: 0, ms: 700, at: "head" })],
  // the counters
  cuts: [fx("quick_slash", { size: 0.7 })], heat: [fx("ember")], spite: [fx("rage", { at: "head", still: true })], wrath: [fx("gleam_gold")],
  crescendo: notes(), cascade: [fx("droplet")],
};
/** Statuses that say what they are by their look alone (control, marks, hiding): they play even right after a hit's own effect. */
const STATUS_ALWAYS = new Set(["stun", "silence", "doom", "marked", "taunt", "hidden", "bulwark_broken", "slow"]);
/** A status with no look of its own: by a word in its id, else a buff's or a debuff's. */
const STATUS_THEMES: [RegExp, Fx[]][] = [
  [/frost|ice|rime|winter|hoarfrost|cold/, [fx("frost_twinkle")]], [/storm|static|thunder|bolt|squall|charge|spear/, [fx("static")]],
  [/ember|fire|forge|pyre|stoke|heat|hearth|cinder|crown_of_embers/, [fx("flame", { at: "feet" })]],
  [/blood|sanguine|feast|thirst|red_feast|gorged|bleed/, drops(2)], [/bell|song|score|matins|evensong|cathedral|refrain|cadenza|stage|tome/, notes()],
  [/bedrock|mountain|rampart|faultline|stone|palisade|portcullis|bastion|urchin/, [fx("crystal_earth")]],
  [/prayer|saint|rite|chosen|oath|covenant|blessing|light/, [fx("holy_cross")]], [/root|growth|thorn|briar|hedge/, [fx("sprout", { at: "feet" })]],
  [/shadow|hidden|night|witch|hushing/, [fx("smoke_wisp")]], [/calm|stillness|clear|mind|deep/, [fx("bubble")]],
];
const BUFF_FX: Fx[] = [fx("uppercut", { at: "feet" })];
const DEBUFF_FX: Fx[] = [fx("void")];
/** What plays as a status lands, and whether it plays even on a unit a hit's effect has just played on. */
export function statusFx(id: string): { fx: Fx[]; always: boolean } {
  const own = STATUS_FX[id] ?? STATUS_THEMES.find(([re]) => re.test(id))?.[1];
  const label = c.statuses.get(id)?.label;
  return { fx: own ?? (label === "debuff" ? DEBUFF_FX : BUFF_FX), always: STATUS_ALWAYS.has(id) };
}
/** A status's tick (its pulse) on its holder: small, so a fight full of Burn stays readable. */
const TICK_FX: Record<string, Fx[]> = {
  burn: [fx("ember", { x: 2 })], bleed: drops(2), shock: [fx("spark_hit")], rot: [fx("poison_rot", { x: 1 })], regen: [fx("minor_heal_green")],
  chill: [fx("frost_twinkle", { x: 1 })], doom: [fx("doom_timer", { at: "head", still: true, fps: 20, size: 0.8 })],
};
export const tickFx = (id: string): Fx[] => TICK_FX[id] ?? [];
/** A status's own blow out of turn (a reaction's damage: thorns, an explosion as a bomb dies). */
const REACTION_FX: Record<string, Fx[]> = {
  thorns: [fx("thorns", { at: "feet", size: 0.7 })], volatile: [fx("explosion")], briar: [fx("thorns", { at: "feet", size: 0.7 })],
};
export const reactionFx = (id: string): Fx[] => REACTION_FX[id] ?? [fx("spark_scatter")];

/** The field's other moments. */
export const EVENT_FX = {
  /** A heal with no look of its own (lifesteal, a reaction). */
  heal: [fx("restore", { size: 1.6 })] as Fx[],
  mp: [fx("restore_mp", { size: 0.7 })] as Fx[],
  revive: [fx("healing_circle", { at: "ground" }), fx("angel_wings", { d: 160 })] as Fx[],
  /** A foe brought back by its own kind (the Ghoul's Raise). */
  reviveFoe: [fx("healing_circle_dark", { at: "ground" }), fx("smoke_puff", { d: 160 })] as Fx[],
  summon: [fx("cloud_puff", { x: 2 })] as Fx[],
  miss: [fx("dust_kick", { at: "feet", x: 2 })] as Fx[],
  aegis: [fx("shockwave_gold", { size: 1.4 })] as Fx[],
  block: [fx("gleam", { x: 2 })] as Fx[],
  /** A foe knocked out: a puff as it fades. */
  down: [fx("smoke_puff", { size: 1.6 })] as Fx[],
  /** A wind-up starting: a circle under the caster's feet (dark under a foe). */
  cast: [fx("healing_circle_cast", { at: "ground" })] as Fx[],
  castFoe: [fx("healing_circle_dark", { at: "ground" })] as Fx[],
  /** A wind-up stopped. */
  interrupt: [fx("spark_scatter", { x: 2 })] as Fx[],
  /** An extra strike's Arc. */
  arc: [fx("shock", { rev: true })] as Fx[],
};
/** Who arrives, and how: a summoned or split foe's own puff. */
const JOIN_FX: Record<string, Fx[]> = {
  drone: [fx("ball_lightning", { x: 2 })], soldier: [fx("lightning_bolt", { at: "feet" })], mini_slime: [fx("splash_slime")],
};
export const joinFx = (ref: string): Fx[] => JOIN_FX[ref] ?? EVENT_FX.summon;
/** Who leaves, and how (a slime splitting). */
const LEAVE_FX: Record<string, Fx[]> = { lava_slime: [fx("splash_lava", { size: 1.4 })] };
export const leaveFx = (ref: string): Fx[] => LEAVE_FX[ref] ?? [fx("smoke_puff")];
/** A foe's knockout, where it isn't the plain puff. */
const DOWN_FX: Record<string, Fx[]> = { bomb_bug: [fx("explosion")], lava_slime: [fx("splash_lava")], mini_slime: [fx("splash_slime")], ghost: [fx("shadow_cloud")], ice_ghost: [fx("diamond_dust")], wisp: [fx("ball_lightning")] };
export const downFx = (ref: string): Fx[] => DOWN_FX[ref] ?? EVENT_FX.down;
