"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { person } from "@/data/site";
import { scrollToId } from "@/lib/events";

/**
 * The one orchestrated moment: three lines arrive condensed and stretch to full width,
 * like a signal being tuned in.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const marks = ["bg-cobalt", "bg-lime", "bg-char"];

  return (
    <section id="top" className="relative mx-auto flex min-h-[100svh] max-w-grid flex-col justify-end px-5 pb-10 pt-28 md:px-10">
      <div className="grid gap-10 lg:grid-cols-12">
        <p className="serif text-lg leading-relaxed text-char/80 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-start">
          {person.intro}
        </p>
      </div>

      <h1 className="mt-14 lg:mt-20" aria-label={person.taglines.join(" ")}>
        {person.taglines.map((line, i) => (
          <span key={line} className="flex items-center gap-4 overflow-hidden md:gap-6">
            <motion.span
              aria-hidden
              className={`hidden h-[0.42em] shrink-0 md:block ${marks[i]}`}
              style={{ fontSize: "clamp(2.4rem, 6.6vw, 8rem)" }}
              initial={reduce ? false : { width: 0 }}
              animate={{ width: "0.9em" }}
              transition={{ delay: 0.5 + i * 0.18, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            />
            <motion.span
              aria-hidden
              className="display block text-ink"
              style={{ fontSize: "clamp(2.4rem, 6.6vw, 8rem)" }}
              initial={reduce ? false : { fontVariationSettings: '"wdth" 62', opacity: 0 }}
              animate={{ fontVariationSettings: '"wdth" 118', opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.18, duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-char/20 pt-5 text-sm">
        <p>
          <span className="text-mute">Based in </span>
          {person.base}
          <span className="text-mute">. Now: </span>
          {person.now}.
        </p>
        <button onClick={() => scrollToId("work")} className="flex items-center gap-2 font-semibold hover:text-cobalt">
          Start with the career story <ArrowDown size={16} aria-hidden />
        </button>
      </div>
    </section>
  );
}
