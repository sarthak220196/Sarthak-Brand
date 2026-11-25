"use client";

import { motion } from "framer-motion";
import { Command } from "lucide-react";
import { useEffect, useState } from "react";
import { stations, type StationId, person } from "@/data/site";
import { emit, scrollToId } from "@/lib/events";

/**
 * Navigation as a radio dial. Each section is a station; the needle follows your scroll.
 */
export default function FrequencyNav() {
  const [active, setActive] = useState<StationId>("top");

  useEffect(() => {
    const els = stations
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActive(top.target.id as StationId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const idx = stations.findIndex((s) => s.id === active);
  const pct = (idx / (stations.length - 1)) * 100;
  const current = stations[idx] ?? stations[0];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-char/15 bg-paper/90 backdrop-blur-sm">
      <nav aria-label="Sections" className="mx-auto flex h-16 max-w-grid items-center gap-6 px-5 md:px-10">
        <button
          onClick={() => scrollToId("top")}
          className="shrink-0 text-left text-sm font-bold leading-tight"
          style={{ fontVariationSettings: '"wdth" 112' }}
        >
          {person.name}
        </button>

        {/* Dial (desktop) */}
        <div className="relative hidden flex-1 lg:block">
          <ol className="relative flex justify-between">
            {stations.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => scrollToId(s.id)}
                  aria-current={s.id === active ? "true" : undefined}
                  className={`group flex flex-col items-center px-1 text-[11px] transition-colors ${
                    s.id === active ? "text-ink" : "text-mute hover:text-ink"
                  }`}
                >
                  <span className="tabular">{s.freq}</span>
                  <span className={s.id === active ? "font-semibold" : ""}>{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="pointer-events-none absolute -bottom-[13px] left-0 right-0 h-px bg-char/20" />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -bottom-[16px] block h-[7px] w-[3px] bg-cobalt"
            animate={{ left: `calc(${pct}% - 1.5px)` }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
            style={{ left: 0 }}
          />
        </div>

        {/* Current station (mobile) */}
        <p className="flex-1 text-right text-sm text-mute lg:hidden" aria-live="polite">
          <span className="tabular">{current.freq}</span> {current.label}
        </p>

        <button
          onClick={() => emit("palette:open")}
          className="flex shrink-0 items-center gap-2 border border-char px-3 py-1.5 text-sm hover:bg-char hover:text-paper"
          aria-label="Open the menu (Ctrl or Command + K)"
        >
          <Command size={14} aria-hidden />
          <span>Menu</span>
        </button>
      </nav>
    </header>
  );
}
