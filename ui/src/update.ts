/**
 * Keeping a phone on the newest build without clearing the browser (which wipes the save). GitHub Pages lets a browser
 * keep the page for ten minutes, and an installed app can sit in memory far longer. So each build carries its id and
 * the site carries version.json; the app reads it past every cache when it starts and each time it comes back to the
 * front, and on a newer build reloads under ?v=<build>, a URL no cache holds. Never in the middle of a fight.
 */
declare const __BUILD__: string;
export const BUILD: string = __BUILD__;

const TRIED = "memory-dungeon.reloaded";

export async function checkForUpdate(canReload: () => boolean): Promise<void> {
  if (import.meta.env.DEV) return;
  try {
    const r = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) return;
    const { build } = (await r.json()) as { build?: string };
    if (!build || build === BUILD || !canReload()) return;
    // Once per build: if the reload still brings the old page (a cache in the way), don't loop.
    if (sessionStorage.getItem(TRIED) === build) return;
    sessionStorage.setItem(TRIED, build);
    const u = new URL(location.href);
    u.searchParams.set("v", build);
    location.replace(u.toString());
  } catch {
    /* offline, or storage blocked: carry on with this build */
  }
}
