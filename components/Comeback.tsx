"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const beats = [
  {
    title: "Life pressed pause.",
    body: "A serious shoulder injury. Surgery. Then a long rehabilitation that interrupted the rhythm of everything, work included.",
  },
  {
    title: "The quiet part.",
    body: "Stepping back. Recovering. Rebuilding strength one small, unglamorous session at a time. It was slow, and it wasn't a straight line.",
  },
  {
    title: "I found my way back to play.",
    body: "Back to work I care about. Back towards the decks. Patience turned out to be a skill too.",
  },
];

/** Amplitude of the waveform as the story scrolls: full, collapse, a slow uneven return. */
function amp(p: number) {
  if (p < 0.22) return 1;
  if (p < 0.38) return 1 - ((p - 0.22) / 0.16) * 0.97;
  if (p < 0.55) return 0.03;
  const r = (p - 0.55) / 0.4;
  const dip = r > 0.35 && r < 0.5 ? 0.18 : 0; // a setback in the middle of the return
  return Math.min(1, 0.03 + Math.pow(Math.max(0, r), 1.6) - dip);
}

export default function Comeback() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const [beat, setBeat] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    setBeat(v < 0.3 ? 0 : v < 0.6 ? 1 : 2);
  });

  useEffect(() => {
    if (reduce) return;
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== w * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const a = amp(progress.current);
      t += 0.035;
      const bars = Math.floor(w / 7);
      for (let i = 0; i < bars; i++) {
        const x = i * 7;
        const n =
          Math.abs(Math.sin(i * 0.21 + t) * 0.6 + Math.sin(i * 0.047 - t * 0.7) * 0.4) *
          (0.55 + 0.45 * Math.sin(i * 1.7));
        const bh = Math.max(2, n * a * h * 0.8);
        ctx.fillStyle = a > 0.6 ? "#C8F135" : a > 0.1 ? "#F1EDE2" : "#6B675D";
        ctx.fillRect(x, h / 2 - bh / 2, 4, bh);
      }
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduce]);

  if (reduce) {
    return (
      <section id="comeback" aria-labelledby="comeback-title" className="bg-ink px-5 py-24 text-paper md:px-10">
        <h2 id="comeback-title" className="sr-only">The comeback</h2>
        <div className="mx-auto max-w-3xl space-y-14">
          {beats.map((b) => (
            <div key={b.title}>
              <p className="display text-5xl" style={{ fontVariationSettings: '"wdth" 90' }}>{b.title}</p>
              <p className="serif mt-4 text-xl leading-relaxed text-paper/80">{b.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="comeback" aria-labelledby="comeback-title" ref={wrap} className="relative h-[300vh] bg-ink text-paper">
      <h2 id="comeback-title" className="sr-only">The comeback</h2>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-start overflow-hidden px-5 pt-[18vh] md:px-10">
        <canvas ref={canvas} aria-hidden className="absolute inset-x-0 bottom-[10%] h-[26vh] w-full" />
        <div className="relative mx-auto w-full max-w-grid">
          <div className="max-w-3xl">
            {beats.map((b, i) => (
              <div key={b.title} className={i === beat ? "block" : "hidden"} aria-hidden="true">
                <p className="display text-[clamp(2.6rem,7vw,6.5rem)]" style={{ fontVariationSettings: `"wdth" ${i === 1 ? 62 : 110}` }}>
                  {b.title}
                </p>
                <p className="serif mt-5 max-w-xl text-xl leading-relaxed text-paper/80">{b.body}</p>
              </div>
            ))}
            {/* Screen readers get the whole story at once */}
            <div className="sr-only">
              {beats.map((b) => (
                <p key={b.title}>{b.title} {b.body}</p>
              ))}
            </div>
          </div>
        </div>
        <ol className="absolute bottom-8 left-5 flex gap-2 md:left-10" aria-hidden>
          {beats.map((b, i) => (
            <li key={b.title} className={`h-1 w-10 ${i <= beat ? "bg-lime" : "bg-paper/20"}`} />
          ))}
        </ol>
      </div>
    </section>
  );
}
