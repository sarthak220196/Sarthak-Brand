"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { projects } from "@/data/site";

// Clearly labelled sample data for the timeline demo. Not real location history.
const SAMPLE = [
  { time: "08:10", place: "Home", x: 40, y: 120 },
  { time: "09:05", place: "Coffee", x: 120, y: 70 },
  { time: "10:00", place: "Office", x: 220, y: 90 },
  { time: "13:30", place: "Lunch", x: 290, y: 40 },
  { time: "19:45", place: "Gig", x: 380, y: 110 },
  { time: "23:50", place: "Home", x: 460, y: 60 },
];

function TimelineDemo() {
  const [i, setI] = useState(2);
  const pts = SAMPLE.slice(0, i + 1);
  const d = pts.map((p, k) => `${k ? "L" : "M"}${p.x},${p.y}`).join(" ");
  return (
    <div className="border-2 border-ink bg-bone p-4">
      <svg viewBox="0 0 500 160" className="w-full" role="img" aria-label={`Sample day, ${SAMPLE[i].time} at ${SAMPLE[i].place}`}>
        <path d={SAMPLE.map((p, k) => `${k ? "L" : "M"}${p.x},${p.y}`).join(" ")} fill="none" stroke="#2B2B2E" strokeOpacity={0.2} strokeWidth={2} strokeDasharray="4 6" />
        <path d={d} fill="none" stroke="#1E3FD8" strokeWidth={4} />
        {pts.map((p, k) => (
          <circle key={k} cx={p.x} cy={p.y} r={k === i ? 9 : 5} fill={k === i ? "#C8F135" : "#1E3FD8"} stroke="#000" strokeWidth={2} />
        ))}
      </svg>
      <label className="mt-2 block text-sm">
        <span className="flex justify-between">
          <span>Scrub a sample day</span>
          <span className="tabular font-semibold">{SAMPLE[i].time}, {SAMPLE[i].place}</span>
        </span>
        <input type="range" className="fader" min={0} max={SAMPLE.length - 1} value={i} onChange={(e) => setI(Number(e.target.value))} />
      </label>
      <p className="text-xs text-mute">Sample data for illustration only.</p>
    </div>
  );
}

export default function Builds() {
  return (
    <section id="builds" aria-labelledby="builds-title" className="border-t-2 border-ink bg-paper">
      <div className="mx-auto max-w-grid px-5 py-24 md:px-10">
        <h2 id="builds-title" className="display text-[clamp(2.6rem,7vw,6.5rem)] text-ink" style={{ fontVariationSettings: '"wdth" 118' }}>
          Things I&apos;m building on the side
        </h2>
        <p className="serif mt-5 max-w-xl text-lg leading-relaxed">
          Experiments and concepts, not finished companies. I build to understand how things work, and because it&apos;s fun.
        </p>

        <div className="mt-14 divide-y-2 divide-ink border-y-2 border-ink">
          {projects.map((p, idx) => (
            <article key={p.name} className="grid gap-8 py-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className={`inline-block px-2 py-0.5 text-sm font-semibold ${p.kind === "Experiment" ? "bg-cobalt text-paper" : "border border-dashed border-char"}`}>
                  {p.kind}
                </span>
                <h3 className="mt-3 text-3xl font-bold leading-tight" style={{ fontVariationSettings: '"wdth" 100' }}>{p.name}</h3>
                <p className="serif mt-3 text-lg leading-relaxed">{p.summary}</p>
                <p className="mt-4 text-sm text-mute">Built with {p.stack.join(", ")}</p>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 font-semibold underline decoration-cobalt decoration-2 underline-offset-4">
                    See the project <ArrowUpRight size={16} aria-hidden />
                  </a>
                )}
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                {idx === 0 ? (
                  <TimelineDemo />
                ) : (
                  <div className="flex h-full min-h-[200px] flex-col justify-between border-2 border-ink bg-char p-6 text-paper">
                    <p className="text-sm text-paper/60">The questions I was testing</p>
                    <ul className="mt-4 space-y-2 text-xl" style={{ fontVariationSettings: '"wdth" 90' }}>
                      <li>Who is this for?</li>
                      <li>What job does it do on a Tuesday?</li>
                      <li>How would it actually get sold?</li>
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
