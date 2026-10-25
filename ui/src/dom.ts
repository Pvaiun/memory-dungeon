/** Tiny DOM helpers: no framework, the interface is small. */
export type Child = Node | string | number | null | undefined | false | Child[];

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, unknown> | null = null, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") el.className = String(v);
      else if (k === "style") el.setAttribute("style", String(v));
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
      else if (k in el && !(v instanceof Object)) (el as unknown as Record<string, unknown>)[k] = v;
      else el.setAttribute(k, String(v));
    }
  }
  append(el, children);
  return el;
}

export function append(el: Node, children: Child[]) {
  for (const ch of children) {
    if (ch === null || ch === undefined || ch === false) continue;
    if (Array.isArray(ch)) append(el, ch);
    else if (ch instanceof Node) el.appendChild(ch);
    else el.appendChild(document.createTextNode(String(ch)));
  }
}

export const clear = (el: Element) => {
  while (el.firstChild) el.removeChild(el.firstChild);
};

export const button = (label: Child, onClick: (e: Event) => void, cls = "") => h("button", { class: cls || undefined, onClick }, label);

/** A menu row: a cursor column (▶ when current), the children, tappable. */
export const row = (children: Child[], onClick?: () => void, opts: { cur?: boolean; cursor?: boolean; cls?: string } = {}) =>
  h("div", { class: `row${opts.cur ? " cur" : ""}${onClick ? "" : " static"}${opts.cls ? ` ${opts.cls}` : ""}`, onClick },
    opts.cursor === false ? null : h("span", { class: "cursor" }, opts.cur ? "▶" : ""),
    ...children);

/** A screen header: ◀ and the title, tappable to go back; `right` sits at the end. */
/**
 * What the phone's back button does: close the open overlay if there is one, else the screen's own back
 * (its header's ◀, or a fight's leave prompt). Screens and overlays set these as they open; main.ts listens.
 */
export const nav: { back: (() => void) | null; overlay: (() => void) | null } = { back: null, overlay: null };

/** A screen header: ◀ and the title, tappable to go back (the phone's back button does the same); `right` sits at the end. */
export function header(title: Child, onBack: (() => void) | null, right?: Child) {
  nav.back = onBack;
  return h("div", { class: "hdr" }, onBack ? h("span", { class: "back", onClick: onBack }, "◀") : null, h("span", { class: "title", onClick: onBack ?? undefined }, title), right ? h("span", { class: "r" }, right) : null);
}

/** A window box. */
export const win = (cls: string, ...children: Child[]) => h("div", { class: `win${cls ? ` ${cls}` : ""}` }, ...children);

/** An HP bar: green, yellow below 50%, red below 25%; a light segment for a shield. */
export function bar(share: number, kind: "hp" | "mp" = "hp", shieldShare = 0, thin = false): HTMLElement {
  const fill = h("i");
  const s = Math.max(0, Math.min(1, share));
  fill.style.width = `${s * 100}%`;
  if (kind === "hp") fill.className = s <= 0.25 ? "low" : s <= 0.5 ? "mid" : "";
  const el = h("div", { class: `bar${kind === "mp" ? " mp" : ""}${thin ? " thin" : ""}` }, fill);
  if (shieldShare > 0) {
    const sh = h("i", { class: "sh" });
    sh.style.left = `${s * 100}%`;
    sh.style.width = `${Math.min(1 - s, shieldShare) * 100}%`;
    el.append(sh);
  }
  return el;
}

/** A short-lived note at the bottom of the frame. */
export function toast(frame: HTMLElement, text: string, ms = 1400) {
  const el = h("div", { class: "toast" }, text);
  frame.append(el);
  setTimeout(() => el.remove(), ms);
}
