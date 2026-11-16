/**
 * Runs saved with SAVE RUN, kept in the app (IndexedDB) until exported: each a run's record and its note under one name.
 * EXPORT (Settings) downloads them as two zips, the runs and the notes, and marks them exported; nothing is deleted but
 * by CLEAR EXPORTED. The names stay in memory (read once at start-up); a run's record is read only when exported.
 */
import { download } from "./folders.js";
import { zip } from "./zip.js";

export type Saved = { name: string; at: string; note: boolean; exported: boolean };
type Files = { run: string; note: string | null };

const DB = "memory-dungeon-saved-runs";
const META = "meta";
const FILES = "files";
let list: Saved[] = [];
let kept = false;

/** A file name's start: the local date and hour, so saved runs sort in the order they were played (`min` adds the minutes). */
export const stamp = (d: Date, min = false) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}h${min ? String(d.getMinutes()).padStart(2, "0") : ""}`;

function db(): Promise<IDBDatabase> {
  return new Promise((ok, fail) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { r.result.createObjectStore(META, { keyPath: "name" }); r.result.createObjectStore(FILES); };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => fail(r.error);
  });
}
async function tx(mode: IDBTransactionMode, work: (meta: IDBObjectStore, files: IDBObjectStore) => void) {
  const d = await db();
  await new Promise<void>((ok, fail) => {
    const t = d.transaction([META, FILES], mode);
    work(t.objectStore(META), t.objectStore(FILES));
    t.oncomplete = () => ok();
    t.onerror = () => fail(t.error);
    t.onabort = () => fail(t.error);
  });
}

/** Reads the saved runs' names, once at start-up. */
export async function loadSaved() {
  try {
    await tx("readonly", (meta) => { const r = meta.getAll(); r.onsuccess = () => { list = (r.result as Saved[]).sort((a, b) => a.at.localeCompare(b.at)); }; });
  } catch { list = []; }
  kept = await storageKept();
}

export const savedRuns = (): readonly Saved[] => list;
export const nameTaken = (name: string) => list.some((s) => s.name === name);

/** Keeps a run (and its note, if any) in the app, and asks the browser to keep the app's storage through a clean-up. */
export async function keepRun(name: string, at: Date, run: string, note: string | null) {
  const entry: Saved = { name, at: at.toISOString(), note: note !== null, exported: false };
  await tx("readwrite", (meta, files) => { meta.put(entry); files.put({ run, note } satisfies Files, name); });
  list = [...list.filter((s) => s.name !== name), entry];
  try { kept = (await navigator.storage?.persist?.()) ?? kept; } catch { /* asked; the browser decides */ }
}
/** Whether the browser has promised to keep the app's storage, as last asked. */
export const storageIsKept = () => kept;

/** Whether the browser has promised to keep the app's storage (an installed app usually is). */
async function storageKept(): Promise<boolean> {
  try { return (await navigator.storage?.persisted?.()) ?? false; } catch { return false; }
}

/**
 * Downloads the saved runs (all, or only those not yet exported) as two zips, `runs-<when>.zip` and `notes-<when>.zip`
 * (no notes zip when none has a note), and marks them exported. Returns how many runs went out.
 */
export async function exportSaved(all: boolean): Promise<number> {
  const out = list.filter((s) => all || !s.exported);
  if (!out.length) return 0;
  const got = new Map<string, Files>();
  await tx("readonly", (_, files) => { for (const s of out) { const r = files.get(s.name); r.onsuccess = () => got.set(s.name, r.result as Files); } });
  const runs: { name: string; text: string; at: Date }[] = [];
  const notes: { name: string; text: string; at: Date }[] = [];
  for (const s of out) {
    const f = got.get(s.name);
    if (!f) continue;
    runs.push({ name: `${s.name}.json`, text: f.run, at: new Date(s.at) });
    if (f.note !== null) notes.push({ name: `${s.name}.md`, text: f.note, at: new Date(s.at) });
  }
  const when = stamp(new Date(), true);
  download(`runs-${when}.zip`, await zip(runs));
  if (notes.length) download(`notes-${when}.zip`, await zip(notes));
  const marked = out.map((s) => ({ ...s, exported: true }));
  await tx("readwrite", (meta) => { for (const s of marked) meta.put(s); });
  list = list.map((s) => marked.find((m) => m.name === s.name) ?? s);
  return runs.length;
}

/** Deletes the runs already exported from the app. */
export async function clearExported(): Promise<number> {
  const gone = list.filter((s) => s.exported);
  await tx("readwrite", (meta, files) => { for (const s of gone) { meta.delete(s.name); files.delete(s.name); } });
  list = list.filter((s) => !s.exported);
  return gone.length;
}
