/**
 * Graphics: the frame's pixel scale, sprites in colour, weapons in hands, the
 * faces, the iconset's cells, the status icons, and text from the pixel font
 * drawn on a canvas.
 *
 * The frame is 270 logical pixels wide and each logical pixel is a whole
 * number of device pixels (`--u`), so nothing blurs: on a 1080-pixel-wide
 * phone one logical pixel is four device pixels. 1rem is 8 logical pixels,
 * one row of the 8px font.
 *
 * The director's packs are pixel art drawn at three image pixels per art
 * pixel (the iconset at two). `downscale` recovers the art's pixels by taking
 * the commonest colour of each block, aligned to the art's own grid, so
 * sprites keep their palettes instead of being averaged or dithered. The actor
 * sheets are shrunk that way once, by the asset tool; enemies at run time, so
 * crowded fights can shrink them further with the same filter and an outline.
 */
import { c } from "./content.js";
import { image, manifest, POSE, STATUS_STYLE, type Pose } from "./art.js";

export const FRAME_W = 270;
export const OUTLINE = "#14141e";

/** CSS px per logical px. */
export let px = 2;
export function fitScale(): number {
  const dpr = window.devicePixelRatio || 1;
  const byW = Math.floor((Math.min(window.innerWidth, 600) * dpr) / FRAME_W);
  const byH = Math.floor((window.innerHeight * dpr) / 400);
  const dev = Math.max(1, Math.min(byW, byH));
  px = dev / dpr;
  document.documentElement.style.setProperty("--u", `${px}px`);
  return px;
}

const luma = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;
const scratch = document.createElement("canvas");
const sctx = () => scratch.getContext("2d", { willReadFrequently: true })!;
const cv2d = (w: number, h: number) => {
  const cv = document.createElement("canvas");
  cv.width = Math.max(1, w);
  cv.height = Math.max(1, h);
  return cv;
};

// ─── Downscaling pixel art ───

export type DownOpts = {
  /** Share of a block that must be opaque for the pixel to show (default 0.5). */
  threshold?: number;
  /** Add a one-pixel dark outline outside the silhouette. */
  outline?: boolean;
  /** Find the art's grid instead of assuming it starts at the image's corner (default true for k > 1). */
  align?: boolean;
  /** Cut the transparent margins. */
  trim?: boolean;
};

/** Where the art's pixel grid starts: the offset (mod k) at which colours change most often. */
function gridOffset(d: Uint8ClampedArray, w: number, h: number, k: number): [number, number] {
  const cx = new Array<number>(k).fill(0), cy = new Array<number>(k).fill(0);
  const same = (i: number, j: number) => d[i] === d[j] && d[i + 1] === d[j + 1] && d[i + 2] === d[j + 2] && d[i + 3] === d[j + 3];
  for (let y = 0; y < h; y += 2) for (let x = 1; x < w; x++) { const i = (y * w + x) * 4; if (!same(i, i - 4)) cx[x % k]++; }
  for (let x = 0; x < w; x += 2) for (let y = 1; y < h; y++) { const i = (y * w + x) * 4; if (!same(i, i - w * 4)) cy[y % k]++; }
  const arg = (a: number[]) => a.indexOf(Math.max(...a));
  return [arg(cx), arg(cy)];
}

/** Shrinks a region of an image by a whole factor `k`, one art pixel per block, keeping its colours. */
export function downscale(src: CanvasImageSource, k: number, sx: number, sy: number, sw: number, sh: number, o: DownOpts = {}): HTMLCanvasElement {
  scratch.width = sw;
  scratch.height = sh;
  const g = sctx();
  g.clearRect(0, 0, sw, sh);
  g.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
  const d = g.getImageData(0, 0, sw, sh).data;
  let x0 = 0, y0 = 0;
  if (k > 1 && o.align !== false) {
    const [ox, oy] = gridOffset(d, sw, sh, k);
    x0 = ox ? ox - k : 0;
    y0 = oy ? oy - k : 0;
  }
  const w = Math.ceil((sw - x0) / k), h = Math.ceil((sh - y0) / k);
  const pad = o.outline ? 1 : 0;
  const out = cv2d(w + 2 * pad, h + 2 * pad);
  const og = out.getContext("2d")!;
  const id = og.createImageData(out.width, out.height);
  const thr = o.threshold ?? 0.5;
  const keys: number[] = [], counts: number[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      keys.length = 0;
      counts.length = 0;
      let cov = 0, n = 0;
      for (let yy = 0; yy < k; yy++) {
        const py = y0 + y * k + yy;
        if (py < 0 || py >= sh) continue;
        for (let xx = 0; xx < k; xx++) {
          const pxx = x0 + x * k + xx;
          if (pxx < 0 || pxx >= sw) continue;
          n++;
          const i = (py * sw + pxx) * 4;
          if (d[i + 3] < 128) continue;
          cov++;
          const key = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2];
          const at = keys.indexOf(key);
          if (at < 0) (keys.push(key), counts.push(1));
          else counts[at]++;
        }
      }
      if (!n || cov / n < thr) continue;
      let best = keys[0], bestN = counts[0], bestL = luma(best >> 16, (best >> 8) & 255, best & 255);
      for (let i = 1; i < keys.length; i++) {
        const l = luma(keys[i] >> 16, (keys[i] >> 8) & 255, keys[i] & 255);
        if (counts[i] > bestN || (counts[i] === bestN && l < bestL)) (best = keys[i]), (bestN = counts[i]), (bestL = l);
      }
      const j = ((y + pad) * out.width + (x + pad)) * 4;
      id.data[j] = best >> 16;
      id.data[j + 1] = (best >> 8) & 255;
      id.data[j + 2] = best & 255;
      id.data[j + 3] = 255;
    }
  }
  if (o.outline) {
    const W = out.width, H = out.height, a = (x: number, y: number) => (x >= 0 && y >= 0 && x < W && y < H ? id.data[(y * W + x) * 4 + 3] : 0);
    const edge: number[] = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!a(x, y) && (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1))) edge.push(y * W + x);
    for (const j of edge) (id.data[j * 4] = 0x14), (id.data[j * 4 + 1] = 0x14), (id.data[j * 4 + 2] = 0x1e), (id.data[j * 4 + 3] = 255);
  }
  og.putImageData(id, 0, 0);
  return o.trim ? trimCanvas(out) : out;
}

/** The canvas cut to its opaque bounds. */
export function trimCanvas(cv: HTMLCanvasElement): HTMLCanvasElement {
  const g = cv.getContext("2d", { willReadFrequently: true })!;
  const d = g.getImageData(0, 0, cv.width, cv.height).data;
  let top = cv.height, left = cv.width, right = -1, bottom = -1;
  for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4 + 3] > 0) {
    if (y < top) top = y;
    if (y > bottom) bottom = y;
    if (x < left) left = x;
    if (x > right) right = x;
  }
  if (right < 0) return cv;
  const out = cv2d(right - left + 1, bottom - top + 1);
  out.getContext("2d")!.drawImage(cv, left, top, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

const variants = new WeakMap<HTMLCanvasElement, Map<string, HTMLCanvasElement>>();
function variant(cv: HTMLCanvasElement, key: string, make: (g: CanvasRenderingContext2D, out: HTMLCanvasElement) => void): HTMLCanvasElement {
  let m = variants.get(cv);
  if (!m) variants.set(cv, (m = new Map()));
  let v = m.get(key);
  if (v) return v;
  v = cv2d(cv.width, cv.height);
  const g = v.getContext("2d")!;
  g.drawImage(cv, 0, 0);
  make(g, v);
  m.set(key, v);
  return v;
}
/** The sprite as one flat colour: a hit flash. */
export const silhouette = (cv: HTMLCanvasElement, color = "#ffffff") => variant(cv, `s${color}`, (g, out) => { g.globalCompositeOperation = "source-in"; g.fillStyle = color; g.fillRect(0, 0, out.width, out.height); });
/** The sprite washed with a colour, keeping its shading. */
export const tinted = (cv: HTMLCanvasElement, color: string, alpha = 0.6) => variant(cv, `t${color}${alpha}`, (g, out) => { g.globalCompositeOperation = "source-atop"; g.globalAlpha = alpha; g.fillStyle = color; g.fillRect(0, 0, out.width, out.height); });
/** The sprite mirrored. */
export const flipped = (cv: HTMLCanvasElement) => variant(cv, "f", (g, out) => { g.clearRect(0, 0, out.width, out.height); g.translate(out.width, 0); g.scale(-1, 1); g.drawImage(cv, 0, 0); });

const sprites = new Map<string, HTMLCanvasElement>();
/** An asset file shrunk by `k`, cached. */
export function spriteOf(file: string, k: number, o: DownOpts = {}): HTMLCanvasElement {
  const key = `${file}|${k}|${o.threshold ?? ""}|${o.outline ? 1 : 0}|${o.trim ? 1 : 0}|${o.align === false ? 0 : 1}`;
  let cv = sprites.get(key);
  if (cv) return cv;
  const img = image(file);
  if (!img) cv = cv2d(1, 1);
  else if (k === 1 && !o.trim && !o.outline) {
    cv = cv2d(img.width, img.height);
    cv.getContext("2d")!.drawImage(img, 0, 0);
  } else cv = downscale(img, k, 0, 0, img.width, img.height, o);
  sprites.set(key, cv);
  return cv;
}

// ─── Actors: RPG Maker MV sideview sheets, 9×6 frames of 48×48 art pixels ───

export const FRAME = 48;
/** The sheets ship at their art size (ui/tools/assets.py shrinks them by 3), so they draw as they are. */
export const actorSheet = (cls: string) => spriteOf(manifest.classes[cls], 1);
/** Source rect of a pose's frame on the shrunk sheet. */
export function actorFrame(pose: Pose, frame: number): [number, number, number, number] {
  const m = POSE[pose];
  return [((m % 3) * 3 + (frame % 3)) * FRAME, Math.floor(m / 3) * FRAME, FRAME, FRAME];
}
type BBox = { top: number; bottom: number; left: number; right: number };
const bboxes = new Map<string, BBox>();
/** The figure's bounds in a pose's first frame, on the sheet (facing left): figures aren't centred in their frames, and some poses step. */
export function actorBBox(cls: string, pose: Pose = "wait"): BBox {
  const key = `${cls}|${pose}`;
  let b = bboxes.get(key);
  if (b) return b;
  const sheet = actorSheet(cls);
  const [fx, fy, fw, fh] = actorFrame(pose, 0);
  const d = sheet.getContext("2d", { willReadFrequently: true })!.getImageData(fx, fy, fw, fh).data;
  b = { top: fh, bottom: 0, left: fw, right: 0 };
  for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) if (d[(y * fw + x) * 4 + 3] > 0) {
    if (y < b.top) b.top = y;
    if (y > b.bottom) b.bottom = y;
    if (x < b.left) b.left = x;
    if (x > b.right) b.right = x;
  }
  if (b.right < b.left) b = { top: 8, bottom: 44, left: 12, right: 36 };
  bboxes.set(key, b);
  return b;
}
/** Where a pose's figure spans on the field, relative to the x a party member is drawn at (facing right): [left, right]. */
export function actorSpan(cls: string, pose: Pose): [number, number] {
  const w = actorBBox(cls), b = actorBBox(cls, pose);
  const mid = (w.left + w.right) / 2;
  return [mid - b.right - 1, mid - b.left];
}
/** How far right of its frame's centre the figure stands, in art pixels. */
export const actorCenterOffset = (cls: string) => (actorBBox(cls).left + actorBBox(cls).right) / 2 - FRAME / 2;
const faces = new Map<string, HTMLCanvasElement>();
export const FACE = 36;
/** The class's face from the face pack (36×36); without one, the head of its waiting pose at 16×16. */
export function faceOf(cls: string): HTMLCanvasElement {
  let f = faces.get(cls);
  if (f) return f;
  const img = manifest.faces[cls] ? image(manifest.faces[cls]) : undefined;
  if (img) {
    f = cv2d(img.width, img.height);
    f.getContext("2d")!.drawImage(img, 0, 0);
  } else {
    const sheet = actorSheet(cls);
    const b = actorBBox(cls);
    const [fx, fy] = actorFrame("wait", 0);
    const cx = Math.round((b.left + b.right) / 2);
    f = cv2d(16, 16);
    const g = f.getContext("2d")!;
    g.translate(16, 0);
    g.scale(-1, 1);
    g.drawImage(sheet, fx + Math.max(0, cx - 8), fy + Math.max(0, b.top - 1), 16, 16, 0, 0, 16, 16);
  }
  faces.set(cls, f);
  return f;
}
/** The weapon frame a pose shows: the attack poses run through the strip's three frames; the rest hold the weapon at rest (a bow close to the body). */
export function weaponFrame(pose: Pose, frame: number, bow = false): number | null {
  switch (pose) {
    case "swing": case "thrust": case "missile": case "skill": return frame % 3;
    case "wait": case "chant": case "guard": case "victory": case "spell": case "item": case "walk": return bow ? 1 : 2;
    default: return null;
  }
}
/** Draws a party member with its feet at (x, y), facing right, with its weapon's strip in its hand. */
export function drawActor(ctx: CanvasRenderingContext2D, cls: string, pose: Pose, frame: number, x: number, y: number, flash = false, scale = 1, weapon?: string) {
  const sheet = actorSheet(cls);
  const [sx, sy, fw, fh] = actorFrame(pose, frame);
  const src = flash ? silhouette(sheet) : sheet;
  ctx.save();
  ctx.translate(Math.round(x + actorCenterOffset(cls) * scale), Math.round(y + 2 * scale));
  ctx.scale(-1, 1);
  ctx.drawImage(src, sx, sy, fw, fh, -Math.round((fw * scale) / 2), -fh * scale, fw * scale, fh * scale);
  const wf = weapon ? weaponFrame(pose, frame, c.gear.get(weapon)?.weapon?.kind === "bow") : null;
  const strip = weapon && wf !== null && manifest.weapons[weapon] ? image(manifest.weapons[weapon]) : undefined;
  if (strip) {
    // The pack's anchor: the 48×32 frame's bottom centre sits 12 pixels in front of the feet. While winding up the
    // figure steps back, so the weapon goes with it (by how far the chant pose's figure sits from the waiting one).
    const w = flash ? silhouette(spriteOf(manifest.weapons[weapon!], 1)) : strip;
    const step = pose === "chant" ? Math.round(((actorBBox(cls, "chant").left + actorBBox(cls, "chant").right) - (actorBBox(cls).left + actorBBox(cls).right)) / 2) : 0;
    ctx.drawImage(w, wf! * 48, 0, 48, 32, Math.round((step - 36) * scale), -32 * scale, 48 * scale, 32 * scale);
  }
  ctx.restore();
}
/** The figure of a pose as a DOM element, facing right, with its weapon; `scale` multiplies whole pixels. */
export function actorEl(cls: string, pose: Pose = "wait", scale = 1, weapon?: string): HTMLCanvasElement {
  const b = actorBBox(cls);
  const w = weapon ? 56 : Math.min(FRAME, b.right - b.left + 9), h = Math.min(FRAME, b.bottom - b.top + 5);
  const cv = cv2d(w, h);
  const g = cv.getContext("2d")!;
  drawActor(g, cls, pose, 0, w / 2 - (weapon ? 6 : 0), h - 3, false, 1, weapon);
  return canvasEl(cv, scale);
}

// ─── Enemies ───

/** The divisor an enemy sprite shrinks by: native (3), unless it's drawn as a small creature, the fight is crowded, or the sprite is too tall. */
export function enemyK(ref: string, crowd = 1): number {
  const art = manifest.enemies[ref];
  if (!art) return 3;
  const boss = c.enemies.get(ref)?.rank === "boss";
  let k = 3;
  if (!boss && art.scale <= 0.6) k = 5;
  else if (!boss && crowd > 6) k = 4;
  const cap = boss ? 100 : 72;
  while (art.h / k > cap && k < 12) k++;
  return k;
}
export const enemySprite = (ref: string, k = 3) => spriteOf(manifest.enemies[ref]?.file ?? "", k, { align: k === 3, outline: k !== 3, trim: true });
export function drawEnemy(ctx: CanvasRenderingContext2D, ref: string, k: number, x: number, y: number, flash = false) {
  const s = enemySprite(ref, k);
  ctx.drawImage(flash ? silhouette(s) : s, Math.round(x - s.width / 2), Math.round(y - s.height));
}
export const enemyEl = (ref: string, k = 3, scale = 1) => canvasEl(enemySprite(ref, k), scale);
/** A small likeness for lists: the sprite shrunk to fit `size`. */
export function enemyThumb(ref: string, size = 24): HTMLCanvasElement {
  const art = manifest.enemies[ref];
  const k = art ? Math.max(3, Math.ceil(Math.max(art.w, art.h) / size)) : 3;
  return canvasEl(spriteOf(art?.file ?? "", k, { align: k === 3, outline: true, trim: true }), 1, "thumb");
}

// ─── VFX: 64-pixel frames in strips ───
export const vfxSprite = (strip: string, k: number) => spriteOf(manifest.vfx[strip]?.file ?? "", k, { align: false, threshold: 0.3 });

// ─── The iconset: 16×16 art pixels per 32×32 cell, 16 columns ───
const icons = new Map<string, HTMLCanvasElement>();
export function iconOf(row: number, col: number, tint?: string): HTMLCanvasElement {
  const key = `${row},${col}`;
  let cv = icons.get(key);
  if (!cv) {
    const img = image(manifest.iconset);
    cv = img ? downscale(img, 2, col * 32, row * 32, 32, 32, { align: false }) : cv2d(16, 16);
    icons.set(key, cv);
  }
  return tint ? tinted(cv, tint, 0.55) : cv;
}
export const iconEl = (cell: readonly [number, number], scale = 1, tint?: string) => canvasEl(iconOf(cell[0], cell[1], tint), scale, "icon");

// ─── Status icons: the pack's 16×16, recoloured per status by the asset tool ───
export const STATUS_ICON = 16;
const statusIcons = new Map<string, HTMLCanvasElement>();
export function statusIconOf(id: string): HTMLCanvasElement {
  let cv = statusIcons.get(id);
  if (cv) return cv;
  const img = manifest.statuses[id] ? image(manifest.statuses[id]) : undefined;
  cv = cv2d(STATUS_ICON, STATUS_ICON);
  const g = cv.getContext("2d")!;
  if (img) g.drawImage(img, 0, 0);
  else {
    // No icon in the pack: a coloured tile with the status's first letter.
    g.fillStyle = (STATUS_STYLE[id] ?? STATUS_STYLE.generic).color;
    g.fillRect(1, 1, 14, 14);
    drawText(g, (c.statuses.get(id)?.name ?? id).slice(0, 1).toUpperCase(), 4, 4, OUTLINE);
  }
  statusIcons.set(id, cv);
  return cv;
}
/** 3×5 digits for stack counts. */
const DIGITS = ["###|#.#|#.#|#.#|###", ".#.|##.|.#.|.#.|###", "###|..#|###|#..|###", "###|..#|###|..#|###", "#.#|#.#|###|..#|..#", "###|#..|###|..#|###", "###|#..|###|#.#|###", "###|..#|..#|..#|..#", "###|#.#|###|#.#|###", "###|#.#|###|..#|###"].map((s) => s.split("|"));
export function drawDigits(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, color = "#ffffff", back: string | null = OUTLINE, scale = 1) {
  const w = (s.length * 4 - 1) * scale;
  if (back) {
    ctx.fillStyle = back;
    ctx.fillRect(x - scale, y - scale, w + 2 * scale, 7 * scale);
  }
  ctx.fillStyle = color;
  let cx = x;
  for (const ch of s) {
    const bm = DIGITS[Number(ch)];
    if (bm) for (let yy = 0; yy < 5; yy++) for (let xx = 0; xx < 3; xx++) if (bm[yy][xx] === "#") ctx.fillRect(cx + xx * scale, y + yy * scale, scale, scale);
    cx += 4 * scale;
  }
}
/** A status icon with its stack count in the bottom-right corner (over 99 shows as 99). */
export function drawStatus(ctx: CanvasRenderingContext2D, id: string, x: number, y: number, count?: number | null) {
  ctx.drawImage(statusIconOf(id), x, y);
  if (count !== undefined && count !== null && count > 1) {
    const s = String(Math.min(99, Math.floor(count)));
    const w = s.length * 4 - 1;
    drawDigits(ctx, s, x + STATUS_ICON + 1 - w, y + STATUS_ICON - 5, "#ffffff", OUTLINE);
  }
}
/** The icon as a DOM element, with its count. */
export function statusEl(id: string, count?: number | null, scale = 1): HTMLCanvasElement {
  const cv = cv2d(STATUS_ICON + 2, STATUS_ICON + 2);
  drawStatus(cv.getContext("2d")!, id, 0, 0, count);
  return canvasEl(cv, scale, "sticon");
}

// ─── Backdrops: a 270×224 scene per dungeon, composed from the tilesets by the asset tool ───
export const backdropImage = (theme: string): HTMLImageElement | undefined => (manifest.backdrops[theme] ? image(manifest.backdrops[theme]) : undefined);

// ─── DOM wrappers ───

/** A canvas as a DOM element on the pixel grid; `scale` multiplies whole pixels. */
export function canvasEl(cv: HTMLCanvasElement, scale = 1, cls = ""): HTMLCanvasElement {
  const el = cv2d(cv.width, cv.height);
  el.className = `px${cls ? ` ${cls}` : ""}`;
  el.style.width = `${(cv.width * scale) / 8}rem`;
  el.style.height = `${(cv.height * scale) / 8}rem`;
  el.getContext("2d")!.drawImage(cv, 0, 0);
  return el;
}
export const faceEl = (cls: string, scale = 1) => canvasEl(faceOf(cls), scale, "face");
/** The weapon strip's held frame as a DOM element, for gear lists. */
export function weaponEl(gearId: string, scale = 1): HTMLCanvasElement | null {
  const file = manifest.weapons[gearId];
  if (!file) return null;
  const strip = spriteOf(file, 1);
  const cv = cv2d(32, 32);
  cv.getContext("2d")!.drawImage(strip, 96, 0, 48, 32, -8, 0, 48, 32);
  return canvasEl(trimCanvas(cv), scale, "weapon");
}

// ─── Text on a canvas, from the pixel font ───

export const FONT = "'Press Start 2P'";
const CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~♥▲▼★☆→←↑↓▶◀×•…";
let bitmaps: Map<string, Uint8Array> | null = null;
const letters = new Map<string, HTMLCanvasElement>();

/** Rasterizes the font once at 8px into 8×8 bitmaps; call after the font has loaded. */
export function buildFont() {
  bitmaps = new Map();
  const cv = cv2d(24, 24);
  const g = cv.getContext("2d", { willReadFrequently: true })!;
  const draw = (ch: string) => {
    g.clearRect(0, 0, 24, 24);
    g.font = `8px ${FONT}`;
    g.textBaseline = "alphabetic";
    g.fillStyle = "#000";
    g.fillText(ch, 8, 16);
    return g.getImageData(0, 0, 24, 24).data;
  };
  const probe = draw("H");
  let top = 24;
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) if (probe[(y * 24 + x) * 4 + 3] > 127 && y < top) top = y;
  if (top === 24) top = 9;
  for (const ch of CHARS) {
    const d = draw(ch);
    const bm = new Uint8Array(64);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bm[y * 8 + x] = d[((top + y) * 24 + 8 + x) * 4 + 3] > 127 ? 1 : 0;
    bitmaps.set(ch, bm);
  }
}
function letter(ch: string, color: string): HTMLCanvasElement | null {
  const bm = bitmaps?.get(ch) ?? bitmaps?.get("?");
  if (!bm) return null;
  const key = `${ch}${color}`;
  let cv = letters.get(key);
  if (cv) return cv;
  cv = cv2d(8, 8);
  const g = cv.getContext("2d")!;
  g.fillStyle = color;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (bm[y * 8 + x]) g.fillRect(x, y, 1, 1);
  letters.set(key, cv);
  return cv;
}
export type Align = "left" | "center" | "right";
/** Draws text with its top-left at (x, y); `outline` adds a one-pixel edge in that colour. */
export function drawText(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, color = "#f2f0e4", outline: string | null = null, align: Align = "left", scale = 1) {
  const w = s.length * 8 * scale;
  const x0 = Math.round(align === "center" ? x - w / 2 : align === "right" ? x - w : x);
  y = Math.round(y);
  const put = (col: string, dx: number, dy: number) => {
    let cx = x0;
    for (const ch of s) {
      const gl = letter(ch, col);
      if (gl) ctx.drawImage(gl, cx + dx, y + dy, 8 * scale, 8 * scale);
      cx += 8 * scale;
    }
  };
  if (outline !== null) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) put(outline, dx, dy);
  put(color, 0, 0);
}
