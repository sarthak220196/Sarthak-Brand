/** Tiny window-event bus so the command palette can drive other sections. */
export type AppEvent = "palette:open" | "deck:play" | "egg:drop";

export function emit(name: AppEvent) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(name));
}

export function on(name: AppEvent, fn: () => void) {
  window.addEventListener(name, fn);
  return () => window.removeEventListener(name, fn);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  // move focus for keyboard and screen reader users
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
