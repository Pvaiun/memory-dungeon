/**
 * The designer's two save folders (runs and notes), picked in Settings, and writing a file into one. Folders need the
 * browser's folder picker (desktop Chrome and Edge); without it, or with no folder picked, a file is downloaded instead.
 * A folder's handle can't go in localStorage, so the two are kept in IndexedDB and read once at start-up: a save then
 * asks for write permission straight from the tap, as the browser requires.
 */
export type FolderKind = "runs" | "notes";

type Perm = "granted" | "denied" | "prompt";
type Dir = FileSystemDirectoryHandle & {
  queryPermission?: (o: { mode: "readwrite" }) => Promise<Perm>;
  requestPermission?: (o: { mode: "readwrite" }) => Promise<Perm>;
};
type Picker = (o?: { id?: string; mode?: "readwrite" }) => Promise<Dir>;

const DB = "memory-dungeon-folders";
const STORE = "folders";
const held: Partial<Record<FolderKind, Dir>> = {};

/** Whether this browser can write into a picked folder. */
export const foldersWork = () => typeof window !== "undefined" && "showDirectoryPicker" in window;

function db(): Promise<IDBDatabase> {
  return new Promise((ok, fail) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => ok(r.result);
    r.onerror = () => fail(r.error);
  });
}
async function put(kind: FolderKind, dir: Dir | null) {
  const d = await db();
  await new Promise<void>((ok, fail) => {
    const t = d.transaction(STORE, "readwrite");
    if (dir) t.objectStore(STORE).put(dir, kind); else t.objectStore(STORE).delete(kind);
    t.oncomplete = () => ok();
    t.onerror = () => fail(t.error);
  });
}

/** Reads the kept folders, once at start-up. */
export async function loadFolders() {
  if (!foldersWork()) return;
  try {
    const d = await db();
    for (const kind of ["runs", "notes"] as const) {
      const dir = await new Promise<Dir | undefined>((ok) => {
        const r = d.transaction(STORE).objectStore(STORE).get(kind);
        r.onsuccess = () => ok(r.result as Dir | undefined);
        r.onerror = () => ok(undefined);
      });
      if (dir) held[kind] = dir;
    }
  } catch { /* no folders kept: saves download */ }
}

/** The folder's name, for Settings, or null when none is picked. */
export const folderName = (kind: FolderKind) => held[kind]?.name ?? null;

/** Opens the browser's folder picker; true when a folder was picked and kept. */
export async function pickFolder(kind: FolderKind): Promise<boolean> {
  if (!foldersWork()) return false;
  try {
    const dir = await (window as unknown as { showDirectoryPicker: Picker }).showDirectoryPicker({ id: `md-${kind}`, mode: "readwrite" });
    held[kind] = dir;
    await put(kind, dir);
    return true;
  } catch { return false; }
}
export async function forgetFolder(kind: FolderKind) {
  delete held[kind];
  try { await put(kind, null); } catch { /* already gone */ }
}

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** The kind's folder with write permission, asked for if need be (from the tap that saves), or null: no folder, or refused. */
async function ready(kind: FolderKind): Promise<Dir | null> {
  const dir = held[kind];
  if (!dir) return null;
  try {
    const perm = (await dir.queryPermission?.({ mode: "readwrite" })) ?? "granted";
    if (perm === "granted" || (await dir.requestPermission?.({ mode: "readwrite" })) === "granted") return dir;
  } catch { /* refused */ }
  return null;
}
const exists = (dir: Dir, name: string) => dir.getFileHandle(name).then(() => true, () => false);

/**
 * Saves files that share one name, each into its kind's folder, or downloads it when there's no folder or the write
 * fails. If the name is taken in any of the folders, every file takes the same `-2` (and on), so a run and its note
 * always match. Returns the name used and where each file went: the folder's name, or null for a download.
 */
export async function saveFiles(base: string, files: { kind: FolderKind; ext: string; blob: Blob }[]): Promise<{ name: string; where: (string | null)[] }> {
  const dirs: (Dir | null)[] = [];
  for (const f of files) dirs.push(await ready(f.kind));
  let name = base;
  for (let n = 2; (await Promise.all(files.map((f, i) => (dirs[i] ? exists(dirs[i], `${name}${f.ext}`) : false)))).some(Boolean); n++) name = `${base}-${n}`;
  const where: (string | null)[] = [];
  for (const [i, f] of files.entries()) {
    const dir = dirs[i];
    if (dir) {
      try {
        const w = await (await dir.getFileHandle(`${name}${f.ext}`, { create: true })).createWritable();
        await w.write(f.blob);
        await w.close();
        where.push(dir.name);
        continue;
      } catch { /* fall back to a download */ }
    }
    download(`${name}${f.ext}`, f.blob);
    where.push(null);
  }
  return { name, where };
}
