/**
 * The Game Boy look: four shades, one pixel grid, and every sprite, icon and
 * letter quantized to those shades. The frame is 180 logical pixels wide and
 * each logical pixel is a whole number of device pixels, so nothing blurs.
 * `--u` (CSS px per logical px) and `--c0`..`--c3` (the shades) are set on
 * the root; the stylesheet sizes everything from them, with 1rem = 8 px.
 */
import { c } from "./content.js";
import { image, manifest, POSE, type Pose } from "./art.js";

export type Shades = [string, string, string, string];
/** Dark to light. */
export const PALETTES: Record<string, Shades> = {
  field: ["#181818", "#2b5a4c", "#92c96b", "#f0f6e4"],
  pocket: ["#2c3b34", "#4b6456", "#8da08d", "#b7c5ae"],
  peach: ["#181818", "#646c6e", "#c59e84", "#f9f9f9"],
};
export const PALETTE_NAMES = Object.keys(PALETTES);
export let paletteName = "field";
export let palette: Shades = PALETTES.field;
let lumas: number[] = [];
let rgb: [number, number, number][] = [];

export const FRAME_W = 180;
export const FIELD_H = 160;

const hex = (s: string): [number, number, number] => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const luma = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;

export function setPalette(name: string) {
  paletteName = PALETTES[name] ? name : "field";
  palette = PALETTES[paletteName];
  rgb = palette.map(hex);
  lumas = rgb.map(([r, g, b]) => luma(r, g, b));
  const root = document.documentElement.style;
  palette.forEach((col, i) => root.setProperty(`--c${i}`, col));
  document.querySelector("meta[name=theme-color]")?.setAttribute("content", palette[0]);
  rendered.clear();
  glyphs.clear();
}

/** CSS px per logical px. */
export let px = 2;
export function fitScale(): number {
  const dpr = window.devicePixelRatio || 1;
  const byW = Math.floor((Math.min(window.innerWidth, 480) * dpr) / FRAME_W);
  const byH = Math.floor((window.innerHeight * dpr) / 300);
  const dev = Math.max(1, Math.min(byW, byH));
  px = dev / dpr;
  document.documentElement.style.setProperty("--u", `${px}px`);
  return px;
}

// ─── Quantizing ───

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayer = (x: number, y: number) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;

/** A quantized image: shades 0–3 per pixel, 255 where transparent. */
export type Pix = { w: number; h: number; s: Uint8Array };
export type QuantOpts = { invert?: boolean; dither?: number; stretch?: boolean; outline?: boolean };
/** The sprites' defaults: a light dither keeps fills flat, and every sprite gets a dark outline. */
export const QUANT = { dither: 0.35, outline: true, gamma: 1 };
export function setQuant(q: Partial<typeof QUANT>) {
  Object.assign(QUANT, q);
  pixCache.clear();
  rendered.clear();
  faces.clear();
}

const scratch = document.createElement("canvas");
const scratchCtx = () => scratch.getContext("2d", { willReadFrequently: true })!;

/** Box-downscales a region of an image by a whole factor `k`, then maps its brightness to four shades with an ordered dither. */
export function quantize(src: CanvasImageSource, k: number, sx: number, sy: number, sw: number, sh: number, opts: QuantOpts = {}): Pix {
  const w = Math.max(1, Math.floor(sw / k)), h = Math.max(1, Math.floor(sh / k));
  scratch.width = sw;
  scratch.height = sh;
  const g = scratchCtx();
  g.clearRect(0, 0, sw, sh);
  g.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
  const d = g.getImageData(0, 0, sw, sh).data;
  const L = new Float32Array(w * h), A = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let l = 0, a = 0;
      for (let yy = 0; yy < k; yy++) {
        for (let xx = 0; xx < k; xx++) {
          const i = ((y * k + yy) * sw + (x * k + xx)) * 4;
          const al = d[i + 3] / 255;
          if (al > 0) {
            l += luma(d[i], d[i + 1], d[i + 2]) * al;
            a += al;
          }
        }
      }
      const j = y * w + x;
      A[j] = a / (k * k);
      L[j] = a > 0 ? l / a : 0;
    }
  }
  let lo = 0, hi = 255;
  if (opts.stretch !== false) {
    const vals: number[] = [];
    for (let j = 0; j < w * h; j++) if (A[j] >= 0.5) vals.push(L[j]);
    vals.sort((p, q) => p - q);
    if (vals.length > 8) {
      lo = vals[Math.floor(vals.length * 0.03)];
      hi = vals[Math.floor(vals.length * 0.97)];
      if (hi - lo < 60) {
        const mid = (hi + lo) / 2;
        lo = Math.max(0, mid - 30);
        hi = Math.min(255, mid + 30);
      }
    }
  }
  const s = new Uint8Array(w * h);
  const dither = opts.dither ?? QUANT.dither;
  const outline = opts.outline ?? QUANT.outline;
  const solid = (j: number) => A[j] >= 0.5;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const j = y * w + x;
      if (!solid(j)) {
        s[j] = 255;
        continue;
      }
      if (outline && !opts.invert && ((x > 0 && !solid(j - 1)) || (x < w - 1 && !solid(j + 1)) || (y > 0 && !solid(j - w)) || (y < h - 1 && !solid(j + w)))) {
        s[j] = 0;
        continue;
      }
      let v = Math.max(0, Math.min(1, (L[j] - lo) / Math.max(1, hi - lo)));
      if (opts.invert) v = 1 - v;
      else if (QUANT.gamma !== 1) v = Math.pow(v, QUANT.gamma);
      const q = Math.floor(v * 3 + 0.5 + (bayer(x, y) - 0.5) * dither);
      s[j] = Math.max(0, Math.min(3, q));
    }
  }
  return { w, h, s };
}

const pixCache = new Map<string, Pix>();
/** An asset file quantized at divisor `k`, cached. */
export function pixOf(file: string, k: number, opts: QuantOpts = {}): Pix {
  const key = `${file}|${k}|${opts.invert ? 1 : 0}|${opts.stretch === false ? 0 : 1}`;
  let p = pixCache.get(key);
  if (!p) {
    const img = image(file);
    if (!img) return { w: 1, h: 1, s: new Uint8Array([255]) };
    p = quantize(img, k, 0, 0, img.width, img.height, opts);
    pixCache.set(key, p);
  }
  return p;
}

const rendered = new Map<Pix, HTMLCanvasElement[]>();
/** A Pix drawn in the current palette (cached until the palette changes); `invert` swaps dark and light. */
export function canvasOf(p: Pix, invert = false): HTMLCanvasElement {
  let pair = rendered.get(p);
  if (!pair) rendered.set(p, (pair = []));
  const i = invert ? 1 : 0;
  if (pair[i]) return pair[i];
  const cv = document.createElement("canvas");
  cv.width = p.w;
  cv.height = p.h;
  const g = cv.getContext("2d")!;
  const id = g.createImageData(p.w, p.h);
  for (let j = 0; j < p.w * p.h; j++) {
    const sh = p.s[j];
    if (sh === 255) continue;
    const [r, gg, b] = rgb[invert ? 3 - sh : sh];
    id.data[j * 4] = r;
    id.data[j * 4 + 1] = gg;
    id.data[j * 4 + 2] = b;
    id.data[j * 4 + 3] = 255;
  }
  g.putImageData(id, 0, 0);
  pair[i] = cv;
  return cv;
}

/** Snaps every pixel of a canvas to the palette, dithering between neighbouring shades: fades and text edges stay in four shades. */
export function snap(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const id = ctx.getImageData(0, 0, w, h);
  const d = id.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const l = luma(d[i], d[i + 1], d[i + 2]);
      let q = 3;
      for (let k = 0; k < 3; k++) {
        if (l < lumas[k + 1]) {
          const t = (l - lumas[k]) / (lumas[k + 1] - lumas[k]);
          q = t > bayer(x, y) ? k + 1 : k;
          break;
        }
      }
      const [r, g, b] = rgb[q];
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(id, 0, 0);
}

// ─── Sprites ───

/** Actor sheets shrink by 3: a 144px frame becomes 48px, a figure about 22×30. */
export const ACTOR_K = 3;
export const actorPix = (cls: string, k = ACTOR_K): Pix => pixOf(manifest.classes[cls], k);
/** Source rect of a pose's frame on the quantized sheet. */
export function actorFrame(p: Pix, pose: Pose, frame: number): [number, number, number, number] {
  const fw = p.w / 9, fh = p.h / 6;
  const m = POSE[pose];
  return [((m % 3) * 3 + (frame % 3)) * fw, Math.floor(m / 3) * fh, fw, fh];
}

/** The divisor an enemy sprite shrinks by: its manifest scale against the actors' 3, capped by height. */
export function enemyK(ref: string): number {
  const art = manifest.enemies[ref];
  if (!art) return 3;
  const cap = c.enemies.get(ref)?.rank === "boss" ? 72 : 56;
  let k = Math.max(2, Math.round(3 / (art.scale || 1)));
  while (art.h / k > cap) k++;
  return k;
}
export const enemyPix = (ref: string): Pix => pixOf(manifest.enemies[ref]?.file ?? "", enemyK(ref));
/** VFX strips shrink by 2 and invert, so bright flashes read dark on the light field. */
export const vfxPix = (strip: string): Pix => pixOf(manifest.vfx[strip]?.file ?? "", 2, { invert: true, stretch: false, dither: 0.5 });
export const statusPix = (id: string): Pix => pixOf(manifest.statuses[id] ?? "", 1, { dither: 0.3 });

const faces = new Map<string, Pix>();
const bboxes = new Map<string, { top: number; left: number; right: number; fw: number; fh: number }>();
/** The figure's bounds in the class's waiting-pose frame, at full resolution: figures aren't centred in their frames. */
function actorBBox(cls: string) {
  let b = bboxes.get(cls);
  if (b) return b;
  const sheet = image(manifest.classes[cls]);
  if (!sheet) return { top: 0, left: 0, right: 143, fw: 144, fh: 144 };
  const fw = sheet.width / 9, fh = sheet.height / 6;
  scratch.width = fw;
  scratch.height = fh;
  const g = scratchCtx();
  g.clearRect(0, 0, fw, fh);
  g.drawImage(sheet, 3 * fw, 0, fw, fh, 0, 0, fw, fh);
  const d = g.getImageData(0, 0, fw, fh).data;
  let top = fh, left = fw, right = 0;
  for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) if (d[(y * fw + x) * 4 + 3] > 0) {
    if (y < top) top = y;
    if (x < left) left = x;
    if (x > right) right = x;
  }
  b = { top, left, right, fw, fh };
  bboxes.set(cls, b);
  return b;
}
/** How far right of the frame's centre the figure stands, in quantized pixels: subtract it to centre the figure. */
export function actorCenterOffset(cls: string, k = ACTOR_K): number {
  const b = actorBBox(cls);
  return ((b.left + b.right) / 2 - b.fw / 2) / k;
}
/** A 16×16 face: the head of the class's waiting pose. */
export function facePix(cls: string): Pix {
  let f = faces.get(cls);
  if (f) return f;
  const sheet = image(manifest.classes[cls]);
  if (!sheet) return { w: 16, h: 16, s: new Uint8Array(256).fill(255) };
  const b = actorBBox(cls);
  const cx = Math.round((b.left + b.right) / 2);
  f = quantize(sheet, 3, 3 * b.fw + Math.max(0, cx - 24), Math.max(0, b.top - 2), 48, 48);
  faces.set(cls, f);
  return f;
}

/** A DOM canvas showing a region of a Pix at the pixel grid; `scale` multiplies whole pixels. */
export function spriteEl(p: Pix, rect?: [number, number, number, number], opts: { flip?: boolean; scale?: number; cls?: string } = {}): HTMLCanvasElement {
  const [x, y, w, h] = rect ?? [0, 0, p.w, p.h];
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  cv.className = `px${opts.flip ? " flip" : ""}${opts.cls ? ` ${opts.cls}` : ""}`;
  const s = opts.scale ?? 1;
  cv.style.width = `${(w * s) / 8}rem`;
  cv.style.height = `${(h * s) / 8}rem`;
  const g = cv.getContext("2d")!;
  g.imageSmoothingEnabled = false;
  g.drawImage(canvasOf(p), x, y, w, h, 0, 0, w, h);
  return cv;
}
export const faceEl = (cls: string) => spriteEl(facePix(cls), undefined, { flip: true, cls: "face" });
export function actorEl(cls: string, pose: Pose = "wait", scale = 1): HTMLCanvasElement {
  const p = actorPix(cls);
  return spriteEl(p, actorFrame(p, pose, 0), { flip: true, scale });
}
export const enemyEl = (ref: string, scale = 1) => spriteEl(enemyPix(ref), undefined, { scale });

// ─── Text on a canvas, from the pixel font ───

export const FONT = "'Press Start 2P'";
const CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~♥▲▼★☆→←↑↓▶◀×•…";
let bitmaps: Map<string, Uint8Array> | null = null;
const glyphs = new Map<string, HTMLCanvasElement>();

/** Rasterizes the font once at 8px into 8×8 bitmaps; call after the font has loaded. */
export function buildFont() {
  bitmaps = new Map();
  const cv = document.createElement("canvas");
  cv.width = 24;
  cv.height = 24;
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

function glyph(ch: string, shade: number): HTMLCanvasElement | null {
  const bm = bitmaps?.get(ch) ?? bitmaps?.get("?");
  if (!bm) return null;
  const key = `${ch}${shade}`;
  let cv = glyphs.get(key);
  if (cv) return cv;
  cv = document.createElement("canvas");
  cv.width = 8;
  cv.height = 8;
  const g = cv.getContext("2d")!;
  g.fillStyle = palette[shade];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (bm[y * 8 + x]) g.fillRect(x, y, 1, 1);
  glyphs.set(key, cv);
  return cv;
}

export type Align = "left" | "center" | "right";
/** Draws text with its top-left at (x, y); `outline` adds a one-pixel edge in that shade. */
export function drawText(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, shade = 0, outline: number | null = null, align: Align = "left", scale = 1) {
  const w = s.length * 8 * scale;
  let x0 = Math.round(align === "center" ? x - w / 2 : align === "right" ? x - w : x);
  y = Math.round(y);
  const put = (sh: number, dx: number, dy: number) => {
    let cx = x0;
    for (const ch of s) {
      const gl = glyph(ch, sh);
      if (gl) ctx.drawImage(gl, cx + dx, y + dy, 8 * scale, 8 * scale);
      cx += 8 * scale;
    }
  };
  if (outline !== null) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) put(outline, dx, dy);
  put(shade, 0, 0);
  void x0;
}
