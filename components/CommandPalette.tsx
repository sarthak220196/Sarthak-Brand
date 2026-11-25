"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Copy, Play, Radio, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { links, stations } from "@/data/site";
import { emit, on, scrollToId } from "@/lib/events";

interface Item {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  run: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setSel(0);
    lastFocus.current?.focus();
  }, []);

  const items = useMemo<Item[]>(() => {
    const list: Item[] = stations.map((s) => ({
      id: s.id,
      label: `Go to ${s.label}`,
      hint: `${s.freq} MHz`,
      icon: <Radio size={16} aria-hidden />,
      run: () => scrollToId(s.id),
    }));
    list.push({
      id: "play",
      label: "Start the mix",
      hint: "Both decks",
      icon: <Play size={16} aria-hidden />,
      run: () => {
        scrollToId("decks");
        emit("deck:play");
      },
    });
    if (links.email) {
      const email = links.email;
      list.push({
        id: "email",
        label: "Copy email address",
        hint: email,
        icon: <Copy size={16} aria-hidden />,
        run: () => {
          void navigator.clipboard?.writeText(email);
          setToast("Email copied");
        },
      });
    }
    if (links.linkedin) {
      const url = links.linkedin;
      list.push({
        id: "linkedin",
        label: "Open LinkedIn",
        hint: "New tab",
        icon: <ArrowUpRight size={16} aria-hidden />,
        run: () => window.open(url, "_blank", "noopener"),
      });
    }
    return list;
  }, []);

  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(() => {
    const offOpen = on("palette:open", () => {
      lastFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
    });
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        lastFocus.current = document.activeElement as HTMLElement;
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      offOpen();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const choose = (item: Item | undefined) => {
    if (!item) return;
    close();
    window.setTimeout(item.run, 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    }
    if (e.key === "Enter") choose(filtered[sel]);
    if (e.key === "Tab") e.preventDefault(); // keep focus in the dialog; arrows move selection
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center bg-char/40 px-4 pt-[14vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="w-full max-w-lg border-2 border-ink bg-paper shadow-[8px_8px_0_0_#000]"
              initial={{ y: -12 }}
              animate={{ y: 0 }}
              exit={{ y: -12 }}
              onKeyDown={onKeyDown}
            >
              <div className="flex items-center gap-3 border-b border-char/20 px-4">
                <Search size={16} aria-hidden className="text-mute" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setSel(0);
                  }}
                  placeholder="Where to?"
                  className="h-14 w-full bg-transparent text-lg outline-none placeholder:text-mute"
                  aria-label="Search sections and actions"
                  aria-controls="palette-list"
                  aria-activedescendant={filtered[sel] ? `pal-${filtered[sel].id}` : undefined}
                />
                <kbd className="text-xs text-mute">Esc</kbd>
              </div>
              <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
                {filtered.length === 0 && <li className="px-4 py-3 text-mute">Nothing on that frequency. Try “work” or “decks”.</li>}
                {filtered.map((item, i) => (
                  <li
                    key={item.id}
                    id={`pal-${item.id}`}
                    role="option"
                    aria-selected={i === sel}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => choose(item)}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${
                      i === sel ? "bg-lime text-ink" : ""
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    <span className="text-xs tabular opacity-60">{item.hint}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div aria-live="polite" className="fixed bottom-6 left-1/2 z-[85] -translate-x-1/2">
        {toast && <p className="bg-ink px-4 py-2 text-sm text-paper">{toast}</p>}
      </div>
    </>
  );
}
