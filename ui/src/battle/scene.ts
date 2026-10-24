/**
 * The field: 180×160 logical pixels in four shades. The party stands on the
 * left facing right, the foes on the right facing left. Sprites are the
 * quantized packs; bars, numbers and words are drawn in the pixel font. Every
 * frame is snapped to the palette at the end, so fades and edges stay in four
 * shades.
 */
import { SUBTICKS } from "../../../src/schema.js";
import type { CUnit } from "../../../src/engine/combat/fight.js";
import { c } from "../content.js";
import { manifest, VFX_FOR, type Pose } from "../art.js";
import { actorCenterOffset, actorFrame, actorPix, canvasOf, drawText, enemyPix, palette, paletteName, snap, vfxPix, FRAME_W, FIELD_H } from "../pixel.js";
import type { Driver } from "./driver.js";

export const W = FRAME_W, H = FIELD_H;

export type UV = {
  id: string; side: "party" | "enemy"; ref: string; name: string;
  x: number; y: number; w: number; h: number;
  pose: Pose; poseUntil: number; lungeUntil: number; shakeUntil: number; flashUntil: number;
  alpha: number; gone: boolean;
  hpShown: number; shieldShown: number;
  cast: { name: string; start: number; end: number } | null;
  numberStack: number; numberAt: number;
};

type Num = { x: number; y: number; text: string; born: number; life: number; sub?: string; big?: boolean };
type Fx = { strip: string; x: number; y: number; size: number; born: number; fps: number; flip: boolean };

// ─── Layout ───

/** The two windows on the field, as the NES Final Fantasy battle screen has them (flipped): the party's on the left, the foes' on the right. */
type Box = { x: number; y: number; w: number; h: number };
export const PARTY_BOX: Box = { x: 4, y: 4, w: 56, h: 152 };
export const FOE_BOX: Box = { x: 64, y: 4, w: 112, h: 152 };
const LINE_X: Record<string, number> = { back: 18, middle: 30, front: 42 };
/** Where the party stands, by formation slot: feet positions. */
export function partySpots(formationId: string, count: number): { x: number; y: number }[] {
  const f = c.formations.get(formationId)!;
  return Array.from({ length: count }, (_, i) => {
    const pos = f.positions[i] ?? f.positions[0];
    return { x: LINE_X[pos.layout.line] ?? 24, y: 52 + pos.layout.column * 48 };
  });
}
const rowsFor = (n: number): number[] => (n <= 1 ? [98] : n === 2 ? [66, 130] : [48, 96, 144]);

/** A window's 2px border with pixel-rounded corners, like the panel's boxes. */
function drawWindow(ctx: CanvasRenderingContext2D, b: Box) {
  ctx.fillStyle = palette[0];
  ctx.fillRect(b.x + 2, b.y, b.w - 4, 2);
  ctx.fillRect(b.x + 2, b.y + b.h - 2, b.w - 4, 2);
  ctx.fillRect(b.x, b.y + 2, 2, b.h - 4);
  ctx.fillRect(b.x + b.w - 2, b.y + 2, 2, b.h - 4);
  for (const [cx, cy] of [[b.x + 1, b.y + 1], [b.x + b.w - 2, b.y + 1], [b.x + 1, b.y + b.h - 2], [b.x + b.w - 2, b.y + b.h - 2]]) ctx.fillRect(cx, cy, 1, 1);
}

// ─── Backdrops: a plain light field with a dithered ceiling or floor and a few specks per dungeon ───

type Back = { ceiling: number; ceilingShade: number; floor: number; specks: number; speckShade: number; rain?: boolean };
const BACK: Record<string, Back> = {
  old_road: { ceiling: 0, ceilingShade: 1, floor: 0, specks: 36, speckShade: 2 },
  crypt: { ceiling: 22, ceilingShade: 0, floor: 0, specks: 10, speckShade: 1 },
  fire_mine: { ceiling: 10, ceilingShade: 0, floor: 14, specks: 24, speckShade: 1 },
  ice_pass: { ceiling: 0, ceilingShade: 1, floor: 0, specks: 70, speckShade: 2 },
  storm_tower: { ceiling: 30, ceilingShade: 1, floor: 0, specks: 24, speckShade: 1, rain: true },
  deep_crypt: { ceiling: 40, ceilingShade: 0, floor: 10, specks: 8, speckShade: 0 },
  tower_top: { ceiling: 48, ceilingShade: 1, floor: 0, specks: 30, speckShade: 1, rain: true },
};
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const backdrops = new Map<string, HTMLCanvasElement>();
export function backdrop(theme: string): HTMLCanvasElement {
  const key = `${theme}|${paletteName}`;
  let cv = backdrops.get(key);
  if (cv) return cv;
  cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  const b = BACK[theme] ?? { ceiling: 0, ceilingShade: 1, floor: 0, specks: 20, speckShade: 2 };
  g.fillStyle = palette[3];
  g.fillRect(0, 0, W, H);
  const put = (x: number, y: number, s: number) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    g.fillStyle = palette[s];
    g.fillRect(x, y, 1, 1);
  };
  for (let y = 0; y < b.ceiling; y++) for (let x = 0; x < W; x++) if ((BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 < 1 - y / b.ceiling) put(x, y, b.ceilingShade);
  for (let y = 0; y < b.floor; y++) for (let x = 0; x < W; x++) if ((BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 < 1 - y / b.floor) put(x, H - 1 - y, b.ceilingShade);
  let seed = 0;
  for (const ch of theme) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < b.specks; i++) {
    const x = Math.floor(rnd() * W), y = b.ceiling + 16 + Math.floor(rnd() * (H - b.ceiling - b.floor - 18));
    const shape = Math.floor(rnd() * 3);
    put(x, y, b.speckShade);
    if (shape >= 1) put(x + 1, y, b.speckShade);
    if (shape === 2) put(x + 1, y - 1, b.speckShade);
  }
  if (b.rain) for (let i = 0; i < 40; i++) {
    const x = Math.floor(rnd() * W), y = Math.floor(rnd() * b.ceiling * 1.5);
    put(x, y, 2);
    put(x - 1, y + 1, 2);
  }
  backdrops.set(key, cv);
  return cv;
}

/** Draws a party member with its feet at (x, y), facing right. */
export function drawActor(ctx: CanvasRenderingContext2D, ref: string, pose: Pose, frame: number, x: number, y: number, invert = false, scale = 1) {
  const p = actorPix(ref);
  const [sx, sy, fw, fh] = actorFrame(p, pose, frame);
  ctx.save();
  // mirrored, so the figure's offset from its frame's centre flips sign
  ctx.translate(Math.round(x + actorCenterOffset(ref) * scale), Math.round(y + 2 * scale));
  ctx.scale(-1, 1);
  ctx.drawImage(canvasOf(p, invert), sx, sy, fw, fh, -Math.round((fw * scale) / 2), -fh * scale, fw * scale, fh * scale);
  ctx.restore();
}
export function drawEnemy(ctx: CanvasRenderingContext2D, ref: string, x: number, y: number, invert = false) {
  const p = enemyPix(ref);
  ctx.drawImage(canvasOf(p, invert), Math.round(x - p.w / 2), Math.round(y - p.h));
}

/** Height and width of a unit's sprite on the field. */
export function unitSize(side: "party" | "enemy", ref: string): [number, number] {
  if (side === "party") return [22, 30];
  const p = enemyPix(ref);
  return [p.w, p.h];
}

const WAIT_FRAMES = [0, 1, 2, 1];

// ─── The battle scene ───

export class Scene {
  ctx: CanvasRenderingContext2D;
  units = new Map<string, UV>();
  numbers: Num[] = [];
  fx: Fx[] = [];
  banner: { text: string; sub: string; until: number } | null = null;
  selected: string | null = null;
  wall = 0;

  constructor(public canvas: HTMLCanvasElement, public driver: Driver, public theme: string) {
    canvas.width = W;
    canvas.height = H;
    this.ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    this.ctx.imageSmoothingEnabled = false;
  }

  sync() {
    for (const u of this.driver.units()) if (!this.units.has(u.id)) this.add(u);
    this.layout();
  }

  private add(u: CUnit) {
    const party = u.side === "party";
    const [w, h] = unitSize(u.side, u.ref);
    this.units.set(u.id, {
      id: u.id, side: u.side, ref: u.ref, name: u.name, x: 0, y: 0, w, h,
      pose: u.ko ? "dead" : "wait", poseUntil: 0, lungeUntil: 0, shakeUntil: 0, flashUntil: 0, alpha: u.ko && !party ? 0 : 1, gone: !!u.gone,
      hpShown: u.hp, shieldShown: 0, cast: null, numberStack: 0, numberAt: 0,
    });
  }

  layout() {
    const units = this.driver.units();
    const party = units.filter((u) => u.side === "party");
    const spots = partySpots(this.driver.input.party.formation, 3);
    for (const u of party) {
      const v = this.units.get(u.id)!;
      const s = spots[u.slot] ?? spots[0];
      v.x = s.x;
      v.y = s.y;
    }
    const foes = units.filter((u) => u.side === "enemy" && !u.gone);
    const boss = foes.find((u) => c.enemies.get(u.ref)?.rank === "boss");
    const rest = foes.filter((u) => u !== boss);
    if (boss) {
      const v = this.units.get(boss.id)!;
      v.x = 136;
      v.y = Math.round(Math.min(144, 88 + v.h / 2));
    }
    const cols = rest.length <= 3 ? 1 : rest.length <= 6 ? 2 : 3;
    const perCol = Math.ceil(rest.length / cols) || 1;
    const x0 = boss ? 84 : 152;
    const step = boss ? 24 : 36;
    for (let col = 0; col < cols; col++) {
      const group = rest.slice(col * perCol, (col + 1) * perCol);
      const rows = rowsFor(group.length);
      group.forEach((u, i) => {
        const v = this.units.get(u.id)!;
        v.x = x0 - col * step + (group.length > 1 ? (i % 2 ? -4 : 4) : 0);
        v.y = rows[i];
      });
    }
  }

  // ─── Reactions to events ───

  pose(id: string, pose: Pose, ms: number) {
    const v = this.units.get(id);
    if (!v || v.side !== "party") return;
    v.pose = pose;
    v.poseUntil = this.wall + ms;
  }
  lunge(id: string, ms = 220) {
    const v = this.units.get(id);
    if (v) v.lungeUntil = this.wall + ms;
  }
  hit(id: string) {
    const v = this.units.get(id);
    if (!v) return;
    v.shakeUntil = this.wall + 220;
    v.flashUntil = this.wall + 120;
    if (v.side === "party" && v.pose !== "dead") this.pose(id, "damage", 350);
  }
  down(id: string) {
    const v = this.units.get(id);
    if (!v) return;
    v.cast = null;
    if (v.side === "party") {
      v.pose = "dead";
      v.poseUntil = 0;
    }
  }
  revive(id: string) {
    const v = this.units.get(id);
    if (!v) return;
    v.alpha = 1;
    v.pose = "wait";
    v.poseUntil = 0;
  }
  leave(id: string) {
    const v = this.units.get(id);
    if (v) (v.gone = true), (v.alpha = 0);
  }

  number(id: string, text: string, sub?: string, big = false) {
    const v = this.units.get(id);
    if (!v) return;
    if (this.wall - v.numberAt < 600) v.numberStack++;
    else v.numberStack = 0;
    v.numberAt = this.wall;
    const side = v.numberStack ? (v.numberStack % 2 ? 1 : -1) * Math.min(2, Math.ceil(v.numberStack / 2)) * 14 : 0;
    const half = (Math.max(text.length, sub?.length ?? 0) * 8 * (big ? 2 : 1)) / 2;
    const x = Math.max(half + 1, Math.min(W - half - 1, v.x + side));
    const y = v.y - v.h - 10 - Math.floor(v.numberStack / 2) * 9;
    this.numbers.push({ x, y: Math.max(2, y), text, born: this.wall, life: 1100, sub, big });
  }

  effect(id: string, strip: string, flip = false) {
    const v = this.units.get(id);
    if (!v || !manifest.vfx[strip]) return;
    this.fx.push({ strip, x: v.x, y: v.y - v.h / 2, size: v.h >= 56 ? 64 : 32, born: this.wall, fps: 14, flip });
  }
  effectFor(id: string, tag: string) {
    const strip = VFX_FOR[tag];
    if (strip) this.effect(id, strip, this.units.get(id)?.side === "party");
  }

  // ─── Drawing ───

  frame(wall: number) {
    this.wall = wall;
    const ctx = this.ctx;
    const units = this.driver.units();
    ctx.fillStyle = palette[2];
    ctx.fillRect(0, 0, W, H);
    const back = backdrop(this.theme);
    for (const b of [PARTY_BOX, FOE_BOX]) {
      ctx.drawImage(back, b.x, b.y, b.w, b.h, b.x, b.y, b.w, b.h);
      drawWindow(ctx, b);
    }
    const order = [...this.units.values()].filter((v) => !v.gone).sort((a, b) => a.y - b.y);
    // each side's sprites stay inside its window, as on the old battle screens
    for (const side of ["party", "enemy"] as const) {
      const b = side === "party" ? PARTY_BOX : FOE_BOX;
      ctx.save();
      ctx.beginPath();
      ctx.rect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
      ctx.clip();
      for (const v of order) {
        if (v.side !== side) continue;
        const u = units.find((x) => x.id === v.id);
        if (!u) continue;
        this.updateVisual(v, u);
        this.drawUnit(v, u);
      }
      ctx.restore();
    }
    for (const v of order) {
      const u = units.find((x) => x.id === v.id);
      if (u) this.drawOverlay(v, u);
    }
    this.drawFx();
    this.drawNumbers();
    this.drawBanner();
    snap(ctx, W, H);
  }

  private updateVisual(v: UV, u: CUnit) {
    const dt = 1 / 60;
    v.hpShown += (u.hp - v.hpShown) * Math.min(1, dt * 10);
    if (Math.abs(u.hp - v.hpShown) < 1) v.hpShown = u.hp;
    const sh = shieldOf(u);
    v.shieldShown += (sh - v.shieldShown) * Math.min(1, dt * 10);
    if (v.poseUntil && this.wall > v.poseUntil) {
      v.poseUntil = 0;
      v.pose = u.ko ? "dead" : v.cast ? "chant" : "wait";
    }
    if (!u.ko && v.pose === "dead") v.pose = "wait";
    const sub = u.statuses.map((s) => s.id);
    const stunned = sub.includes("stun") || sub.includes("bulwark_broken");
    if (!u.ko && v.pose === "wait" && stunned) v.pose = "abnormal";
    if (!u.ko && v.pose === "abnormal" && !stunned) v.pose = "wait";
    if (!u.ko && v.pose === "wait" && u.cast) v.pose = "chant";
    if (!u.ko && v.pose === "chant" && !u.cast) v.pose = "wait";
    if (u.ko && v.side === "enemy" && v.alpha > 0) v.alpha = Math.max(0, v.alpha - dt * 2.5);
    if (!u.ko && v.alpha < 1) v.alpha = Math.min(1, v.alpha + dt * 3);
  }

  private drawUnit(v: UV, u: CUnit) {
    const ctx = this.ctx;
    if (v.alpha <= 0) return;
    const shaking = this.wall < v.shakeUntil ? Math.round(Math.sin(this.wall / 18) * 2) : 0;
    const lungeT = v.lungeUntil > this.wall ? 1 - (v.lungeUntil - this.wall) / 220 : 0;
    const lunge = lungeT ? Math.round(Math.sin(lungeT * Math.PI) * 6) * (v.side === "party" ? 1 : -1) : 0;
    const x = v.x + shaking + lunge;
    const hidden = u.statuses.some((s) => s.id === "hidden");
    const flash = this.wall < v.flashUntil;
    ctx.save();
    ctx.globalAlpha = v.alpha * (hidden ? 0.5 : 1);
    if (v.side === "party") {
      const f = v.pose === "dead" ? 2 : v.pose === "wait" || v.pose === "chant" || v.pose === "abnormal" ? WAIT_FRAMES[Math.floor(this.wall / 300) % 4] : Math.min(2, Math.floor((this.wall - (v.poseUntil - 400)) / 130));
      drawActor(ctx, v.ref, v.pose, Math.max(0, f), x, v.y, flash);
    } else {
      const bob = u.ko ? 0 : Math.round(Math.sin(this.wall / 500 + v.x)) ;
      drawEnemy(ctx, v.ref, x, v.y + bob, flash);
    }
    ctx.restore();
  }

  private drawOverlay(v: UV, u: CUnit) {
    const ctx = this.ctx;
    if (v.alpha <= 0 || (u.ko && v.side === "enemy")) return;
    const top = v.y - v.h;
    const x = Math.round(v.x);
    if (v.side === "enemy") {
      // HP under the feet, a Shield line above the bar
      const max = u.stats.max_hp;
      const hp = Math.max(0, Math.min(1, v.hpShown / max));
      const bw = v.w >= 48 ? 24 : 16;
      const bx = x - bw / 2, by = v.y + 2;
      ctx.fillStyle = palette[0];
      ctx.fillRect(bx - 2, by - 1, bw + 4, 6);
      ctx.fillStyle = palette[3];
      ctx.fillRect(bx - 1, by, bw + 2, 4);
      ctx.fillStyle = palette[0];
      ctx.fillRect(bx, by + 1, Math.round(bw * hp), 2);
      const sh = Math.min(1, v.shieldShown / max);
      if (sh > 0.01) {
        ctx.fillStyle = palette[1];
        ctx.fillRect(bx, by - 2, Math.max(1, Math.round(bw * sh)), 1);
      }
    }
    if (v.cast && !u.ko) {
      const p = Math.max(0, Math.min(1, (this.driver.vt - v.cast.start) / Math.max(1, v.cast.end - v.cast.start)));
      ctx.fillStyle = palette[0];
      ctx.fillRect(x - 9, top - 6, 18, 4);
      ctx.fillStyle = palette[3];
      ctx.fillRect(x - 8, top - 5, 16, 2);
      ctx.fillStyle = palette[1];
      ctx.fillRect(x - 8, top - 5, Math.round(16 * p), 2);
    }
    if (this.selected === v.id) drawText(ctx, "▼", x, top - 16 + Math.round(Math.sin(this.wall / 150)), 0, 3, "center");
  }

  private drawFx() {
    const ctx = this.ctx;
    const keep: Fx[] = [];
    for (const f of this.fx) {
      const def = manifest.vfx[f.strip];
      const frame = Math.floor(((this.wall - f.born) / 1000) * f.fps);
      if (!def || frame >= def.frames) continue;
      keep.push(f);
      const p = vfxPix(f.strip);
      const fw = p.w / def.frames;
      ctx.save();
      ctx.translate(Math.round(f.x), Math.round(f.y));
      if (f.flip) ctx.scale(-1, 1);
      ctx.drawImage(canvasOf(p), frame * fw, 0, fw, p.h, -f.size / 2, -f.size / 2, f.size, f.size);
      ctx.restore();
    }
    this.fx = keep;
  }

  private drawNumbers() {
    const ctx = this.ctx;
    const keep: Num[] = [];
    for (const n of this.numbers) {
      const t = (this.wall - n.born) / n.life;
      if (t >= 1) continue;
      keep.push(n);
      const rise = t < 0.2 ? -t * 40 : -8 - (t - 0.2) * 6;
      if (t > 0.75 && Math.floor(this.wall / 60) % 2) continue;
      const y = Math.max(1, n.y + rise);
      drawText(ctx, n.text, n.x, y, 0, 3, "center", n.big ? 2 : 1);
      if (n.sub) drawText(ctx, n.sub, n.x, y + (n.big ? 17 : 9), 1, 3, "center");
    }
    this.numbers = keep;
  }

  private drawBanner() {
    if (!this.banner || this.wall > this.banner.until) return;
    const ctx = this.ctx;
    const big = this.banner.text.length <= 10;
    const tw = this.banner.text.length * 8 * (big ? 2 : 1);
    const bw = Math.max(tw, this.banner.sub.length * 8) + 16;
    const bh = (big ? 20 : 12) + (this.banner.sub ? 12 : 0) + 8;
    const bx = Math.round(W / 2 - bw / 2), by = Math.round(H / 2 - bh / 2) - 8;
    ctx.fillStyle = palette[0];
    ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
    ctx.fillStyle = palette[3];
    ctx.fillRect(bx, by, bw, bh);
    drawText(ctx, this.banner.text, W / 2, by + 4, 0, null, "center", big ? 2 : 1);
    if (this.banner.sub) drawText(ctx, this.banner.sub, W / 2, by + (big ? 24 : 16), 1, null, "center");
  }

  showBanner(text: string, sub = "", ms = 1500) {
    this.banner = { text, sub, until: this.wall + ms };
  }

  /** The unit under a point on the field, nearest first. */
  hitTest(px: number, py: number): string | null {
    let best: string | null = null, bestD = Infinity;
    for (const v of this.units.values()) {
      if (v.gone || v.alpha <= 0) continue;
      const top = v.y - v.h;
      if (px >= v.x - v.w / 2 - 4 && px <= v.x + v.w / 2 + 4 && py >= top - 8 && py <= v.y + 6) {
        const d = Math.abs(px - v.x) + Math.abs(py - (v.y - v.h / 2));
        if (d < bestD) (best = v.id), (bestD = d);
      }
    }
    return best;
  }
}

export function shieldOf(u: CUnit): number {
  let s = 0;
  for (const st of u.statuses) if (c.statuses.get(st.id)?.absorb) s += Math.floor(st.stacks / SUBTICKS);
  return s;
}

// ─── The showcase: what the field shows behind the menus ───

export type ShowSpec =
  | { kind: "party"; party: string[]; formation: string; pick?: number }
  | { kind: "actor"; ref: string; pose?: Pose }
  | { kind: "enemy"; ref: string }
  | { kind: "none" };

export class Showcase {
  private timer = 0;
  private tick = 0;
  ctx: CanvasRenderingContext2D;
  constructor(public canvas: HTMLCanvasElement, public spec: ShowSpec) {
    canvas.width = W;
    canvas.height = H;
    this.ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    this.ctx.imageSmoothingEnabled = false;
  }
  start() {
    this.draw();
    this.timer = window.setInterval(() => {
      this.tick++;
      this.draw();
    }, 320);
  }
  stop() {
    clearInterval(this.timer);
  }
  draw() {
    const ctx = this.ctx;
    const s = this.spec;
    ctx.drawImage(backdrop("old_road"), 0, 0);
    const f = WAIT_FRAMES[this.tick % 4];
    if (s.kind === "party") {
      const spots = partySpots(s.formation, 3);
      const dx = W / 2 - LINE_X.middle;
      s.party.forEach((ref, i) => {
        const sp = spots[i];
        drawActor(ctx, ref, "wait", f, sp.x + dx, sp.y, false);
        if (s.pick === i) drawText(ctx, "▼", sp.x + dx, sp.y - 46, 0, 3, "center");
      });
      if (!s.party.length) drawText(ctx, "NOBODY", W / 2, H / 2 - 4, 1, null, "center");
    } else if (s.kind === "actor") {
      drawActor(ctx, s.ref, s.pose ?? "wait", f, W / 2, H - 20, false, 2);
    } else if (s.kind === "enemy") {
      const p = enemyPix(s.ref);
      const sc = p.h <= 40 ? 2 : 1;
      ctx.drawImage(canvasOf(p), Math.round(W / 2 - (p.w * sc) / 2), Math.round(H - 24 - p.h * sc + (this.tick % 2)), p.w * sc, p.h * sc);
    }
    snap(ctx, W, H);
  }
}
