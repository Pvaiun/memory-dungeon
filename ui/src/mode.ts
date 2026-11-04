/**
 * The mode the menus show: free play (everything in the content, the sandbox) or the rogue mode. Kept in localStorage
 * under its own key.
 */
export type Mode = "free" | "rogue";

const KEY = "memory-dungeon.mode.v1";
/** An older save kept the mode beside the retired journey's progress. */
const OLD_KEY = "memory-dungeon.journey.v1";

let m: Mode = load();
function load(): Mode {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(OLD_KEY);
    return raw && (JSON.parse(raw) as { mode?: string }).mode === "rogue" ? "rogue" : "free";
  } catch {
    return "free";
  }
}

export const mode = (): Mode => m;
export const onRogue = () => m === "rogue";
export function setMode(next: Mode) {
  m = next;
  try {
    localStorage.setItem(KEY, JSON.stringify({ mode: m }));
  } catch {
    /* private mode: nothing to do */
  }
}
