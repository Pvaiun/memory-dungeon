/**
 * Settings → FILTER: a colour filter over the whole screen, menus and fights alike, like an old handheld's. Each one is an SVG
 * filter laid on the root element: the picture's brightness, then mapped onto a ramp of colours (a few shades for the
 * handheld looks, a smooth ramp for the tints). "off" lays none.
 */

/** Each filter: its name in Settings, and the colours its brightness maps to, darkest first. `steps`: a few hard shades rather than a smooth ramp. */
type Look = { label: string; ramp?: string[]; steps?: boolean; invert?: boolean };

export const FILTERS = {
  off: { label: "OFF" },
  green: { label: "GREEN", ramp: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"], steps: true },
  grey: { label: "GREY", ramp: ["#000000", "#555555", "#aaaaaa", "#ffffff"], steps: true },
  sepia: { label: "SEPIA", ramp: ["#1e140a", "#704c2c", "#c8a678", "#f4e6c8"] },
  amber: { label: "AMBER", ramp: ["#100600", "#7a3a00", "#ff9a10", "#ffe2a0"] },
  red: { label: "RED", ramp: ["#000000", "#550000", "#aa0000", "#ff2020"], steps: true },
  blue: { label: "BLUE", ramp: ["#08102a", "#1c3c78", "#5c8cc8", "#d8ecff"] },
  onebit: { label: "1-BIT", ramp: ["#000000", "#ffffff"], steps: true },
  invert: { label: "INVERT", invert: true },
} satisfies Record<string, Look>;

export type Filter = keyof typeof FILTERS;
export const FILTER_NAMES = Object.keys(FILTERS) as Filter[];

const NS = "http://www.w3.org/2000/svg";
const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

/** The hidden SVG that holds every filter, made once. */
function defs() {
  if (document.getElementById("screen-filters")) return;
  const svg = document.createElementNS(NS, "svg");
  svg.id = "screen-filters";
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
  const all = document.createElementNS(NS, "defs");
  for (const [name, look] of Object.entries(FILTERS) as [Filter, Look][]) {
    if (!look.ramp) continue;
    const f = document.createElementNS(NS, "filter");
    f.id = `filter-${name}`;
    f.setAttribute("color-interpolation-filters", "sRGB");
    // The brightness, into every channel.
    const grey = document.createElementNS(NS, "feColorMatrix");
    grey.setAttribute("type", "matrix");
    const row = "0.299 0.587 0.114 0 0";
    grey.setAttribute("values", `${row} ${row} ${row} 0 0 0 1 0`);
    f.append(grey);
    // Then each channel along the ramp.
    const ramp = look.ramp.map(channels);
    const map = document.createElementNS(NS, "feComponentTransfer");
    ["R", "G", "B"].forEach((ch, i) => {
      const fn = document.createElementNS(NS, `feFunc${ch}`);
      fn.setAttribute("type", look.steps ? "discrete" : "table");
      fn.setAttribute("tableValues", ramp.map((c) => c[i].toFixed(3)).join(" "));
      map.append(fn);
    });
    f.append(map);
    all.append(f);
  }
  svg.append(all);
  document.body.append(svg);
}

/** Lays the filter over the whole screen. */
export function setFilter(name: Filter) {
  defs();
  const look: Look = FILTERS[name] ?? FILTERS.off;
  document.documentElement.style.filter = look.invert ? "invert(1)" : look.ramp ? `url(#filter-${name})` : "";
}
