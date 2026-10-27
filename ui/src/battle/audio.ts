/**
 * Sound: the director's retro effects pack and two tracks, as small mp3s in
 * public/audio/ (ui/README.md says which file plays for what). Effects and
 * music have their own switches (Settings). Browsers only start audio after a
 * tap, so music that couldn't start waits for the next tap. In the background (another app, the phone locked) the music
 * pauses, and picks up where it was on return.
 */
import { BUILD } from "../update.js";

const at = (name: string) => `${import.meta.env.BASE_URL}audio/${name}.mp3?v=${BUILD}`;

let sfxOn = true;
let musicOn = true;

export function setSound(on: boolean) {
  sfxOn = on;
}
export function setMusic(on: boolean) {
  musicOn = on;
  if (!on) music.stop();
  else if (wanted) music.play(wanted);
}

// ─── Effects: a few players per sound, so quick repeats overlap ───
const pools = new Map<string, HTMLAudioElement[]>();
function play(name: string, volume = 0.6) {
  if (!sfxOn) return;
  let pool = pools.get(name);
  if (!pool) pools.set(name, (pool = []));
  let a = pool.find((x) => x.paused || x.ended);
  if (!a) {
    if (pool.length >= 4) return;
    a = new Audio(at(name));
    a.preload = "auto";
    pool.push(a);
  }
  a.volume = volume;
  a.currentTime = 0;
  void a.play().catch(() => {});
}

export const sfx = {
  tap: () => play("tap", 0.4),
  hit: () => play("hit"),
  crit: () => play("crit", 0.8),
  miss: () => play("miss", 0.4),
  block: () => play("block", 0.5),
  magic: () => play("magic", 0.5),
  heal: () => play("heal", 0.5),
  cast: () => play("cast", 0.35),
  status: () => play("status", 0.35),
  down: () => play("down", 0.6),
  win: () => play("win", 0.7),
  lose: () => play("lose", 0.6),
};

// ─── Music: one looping track at a time ───
export type Track = "menu" | "battle";
let current: HTMLAudioElement | null = null;
let currentTrack: Track | null = null;
let wanted: Track | null = null;
let pending = false;

export const music = {
  play(track: Track) {
    wanted = track;
    if (!musicOn) return;
    if (currentTrack === track && current && !current.paused) return;
    music.stop();
    const a = new Audio(at(track));
    a.loop = true;
    a.volume = track === "battle" ? 0.45 : 0.4;
    current = a;
    currentTrack = track;
    if (document.hidden) return;
    a.play().then(() => { pending = false; }).catch(() => { pending = true; });
  },
  stop() {
    current?.pause();
    current = null;
    currentTrack = null;
  },
};

// A tap unlocks audio: start the music that was asked for before it was allowed.
const unlock = () => {
  if (pending && wanted && musicOn) {
    pending = false;
    currentTrack = null;
    music.play(wanted);
  }
};
window.addEventListener("pointerdown", unlock, true);
window.addEventListener("keydown", unlock, true);

document.addEventListener("visibilitychange", () => {
  if (!current) return;
  if (document.hidden) current.pause();
  else if (musicOn) current.play().then(() => { pending = false; }).catch(() => { pending = true; });
});
