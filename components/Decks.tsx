"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { dj } from "@/data/site";
import { MixEngine, type DeckId } from "@/lib/audio";
import { on } from "@/lib/events";

const deckInfo: Record<DeckId, { name: string; sub: string }> = {
  a: { name: "Deck A", sub: "Dhol-style groove, Bhupali melody" },
  b: { name: "Deck B", sub: "Four-on-the-floor, pentatonic bass" },
};

export default function Decks() {
  const engine = useRef<MixEngine | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState<Record<DeckId, boolean>>({ a: false, b: false });
  const [bpm, setBpm] = useState(100);
  const [xf, setXf] = useState(50);
  const [filters, setFilters] = useState<Record<DeckId, number>>({ a: 0, b: 0 });
  const [error, setError] = useState<string | null>(null);

  const getEngine = useCallback(() => {
    if (!engine.current) {
      try {
        engine.current = new MixEngine();
        engine.current.bpm = bpm;
      } catch {
        setError("This browser can't play Web Audio. Try a recent Chrome, Safari or Firefox.");
        return null;
      }
    }
    return engine.current;
  }, [bpm]);

  const toggle = useCallback(
    (id: DeckId, force?: boolean) => {
      const e = getEngine();
      if (!e) return;
      const next = force ?? !e.isPlaying(id);
      e.setDeck(id, next);
      setPlaying((p) => ({ ...p, [id]: next }));
    },
    [getEngine],
  );

  // palette command: start both decks
  useEffect(
    () =>
      on("deck:play", () => {
        toggle("a", true);
        toggle("b", true);
      }),
    [toggle],
  );

  useEffect(() => () => engine.current?.dispose(), []);

  // stop audio when the visitor leaves the section far behind
  useEffect(() => {
    const el = document.getElementById("decks");
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && engine.current) {
          (["a", "b"] as DeckId[]).forEach((id) => engine.current?.setDeck(id, false));
          setPlaying({ a: false, b: false });
        }
      },
      { rootMargin: "50% 0px 50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // spectrum
  const anyPlaying = playing.a || playing.b;
  useEffect(() => {
    const c = canvas.current;
    const e = engine.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const data = new Uint8Array(e ? e.analyser.frequencyBinCount : 128);
    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== w * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (e && anyPlaying) e.analyser.getByteFrequencyData(data);
      else data.fill(0);
      const n = 64;
      const bw = w / n;
      for (let i = 0; i < n; i++) {
        const v = data[i] / 255;
        const bh = Math.max(2, v * h);
        ctx.fillStyle = i < n * (xf / 100) ? "#1E3FD8" : "#C8F135";
        ctx.fillRect(i * bw + 1, h - bh, bw - 2, bh);
      }
      if (anyPlaying) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [anyPlaying, xf]);

  const setBpmAll = (v: number) => {
    setBpm(v);
    if (engine.current) engine.current.bpm = v;
  };
  const setXfAll = (v: number) => {
    setXf(v);
    getEngine()?.setCrossfade(v / 100);
  };
  const setFilter = (id: DeckId, v: number) => {
    setFilters((f) => ({ ...f, [id]: v }));
    getEngine()?.setFilter(id, v / 100);
  };

  return (
    <section id="decks" aria-labelledby="decks-title" className="bg-paper">
      <div className="mx-auto max-w-grid px-5 py-24 md:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="decks-title" className="display text-[clamp(2.6rem,7vw,6.5rem)] text-ink" style={{ fontVariationSettings: '"wdth" 70' }}>
              Things that shouldn&apos;t work together, but do.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="serif text-lg leading-relaxed">
              Music is the other half of the story. My thing is {dj.focus}: two worlds that, in theory, shouldn&apos;t share a beat. Try it below. Both decks are in the same key, so any blend works.
            </p>
          </div>
        </div>

        {/* The mixer */}
        <div className="on-dark mt-14 border-2 border-ink bg-char p-5 text-paper md:p-8">
          <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr]">
            {(["a", "b"] as DeckId[]).map((id, k) => (
              <div key={id} className={k === 1 ? "md:order-3" : ""}>
                <div className="flex items-center gap-5">
                  <div className={`relative h-24 w-24 shrink-0 rounded-full border-4 ${id === "a" ? "border-cobalt" : "border-lime"} bg-ink`}>
                    <div className={`absolute inset-2 rounded-full border border-paper/20 ${playing[id] ? "platter-spin" : ""}`}>
                      <span className="absolute left-1/2 top-1 h-4 w-[3px] -translate-x-1/2 bg-paper" />
                    </div>
                    <span className="absolute inset-[38%] rounded-full bg-paper/80" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-bold">{deckInfo[id].name}</p>
                    <p className="text-sm text-paper/60">{deckInfo[id].sub}</p>
                    <button
                      onClick={() => toggle(id)}
                      aria-pressed={playing[id]}
                      className={`mt-3 flex items-center gap-2 border-2 px-4 py-1.5 font-semibold ${
                        playing[id] ? "border-lime bg-lime text-ink" : "border-paper hover:bg-paper hover:text-ink"
                      }`}
                    >
                      {playing[id] ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
                      {playing[id] ? `Stop ${deckInfo[id].name}` : `Play ${deckInfo[id].name}`}
                    </button>
                  </div>
                </div>
                <label className="mt-6 block text-sm text-paper/70">
                  Filter{" "}
                  <span className="tabular text-paper">
                    {filters[id] === 0 ? "open" : filters[id] < 0 ? `low-pass ${-filters[id]}` : `high-pass ${filters[id]}`}
                  </span>
                  <input
                    type="range"
                    className="fader mt-1"
                    min={-100}
                    max={100}
                    value={filters[id]}
                    onChange={(e) => setFilter(id, Number(e.target.value))}
                    onDoubleClick={() => setFilter(id, 0)}
                  />
                </label>
              </div>
            ))}

            <div className="flex flex-col items-center justify-center gap-2 md:order-2 md:px-6">
              <p className="text-sm text-paper/60">BPM</p>
              <p className="display tabular text-6xl text-lime" style={{ fontVariationSettings: '"wdth" 62' }} aria-live="polite">
                {bpm}
              </p>
              <label className="w-40 text-center text-sm text-paper/70">
                <span className="sr-only">Tempo</span>
                <input type="range" className="fader" min={84} max={128} value={bpm} onChange={(e) => setBpmAll(Number(e.target.value))} />
              </label>
            </div>
          </div>

          <canvas ref={canvas} aria-hidden className="mt-8 h-24 w-full" />

          <label className="mt-4 block">
            <span className="flex justify-between text-sm text-paper/70">
              <span>Deck A</span>
              <span>Crossfader</span>
              <span>Deck B</span>
            </span>
            <input type="range" className="fader" min={0} max={100} value={xf} onChange={(e) => setXfAll(Number(e.target.value))} />
          </label>
          {error && <p className="mt-4 text-lime" role="alert">{error}</p>}
          <p className="mt-4 text-xs text-paper/50">Every sound here is synthesised live in your browser. No commercial tracks, no samples.</p>
        </div>

        {/* The DJ, briefly */}
        <div className="mt-16 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <h3 className="text-sm text-mute">The story so far</h3>
            <ol className="mt-4">
              {dj.history.map((h, i) => (
                <li key={h} className="flex gap-4 border-b border-char/15 py-3 text-lg">
                  <span className="tabular w-6 shrink-0 text-mute">{i + 1}</span>
                  {h}
                </li>
              ))}
            </ol>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <h3 className="text-sm text-mute">Setup</h3>
            <ul className="mt-4">
              {dj.setup.map((s) => (
                <li key={s} className="border-b border-char/15 py-3 text-lg font-semibold">{s}</li>
              ))}
            </ul>
            <p className="mt-6">
              {dj.mixesUrl ? (
                <a href={dj.mixesUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-cobalt decoration-2 underline-offset-4">
                  Listen to my mixes
                </a>
              ) : (
                <span className="text-mute">New mixes are in the works. Links land here when they&apos;re ready.</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
