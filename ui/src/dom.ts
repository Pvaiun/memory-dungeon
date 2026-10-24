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
      else if (k === "html") el.innerHTML = String(v);
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

export const button = (label: string, onClick: () => void, cls = "") => h("button", { class: `btn ${cls}`, onClick }, label);
