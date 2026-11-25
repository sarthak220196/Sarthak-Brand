"use client";

import { useState } from "react";
import { capabilities, home, regions } from "@/data/site";

const W = 1000;
const H = 500;
const px = (lon: number) => ((lon + 180) / 360) * W;
const py = (lat: number) => ((90 - lat) / 180) * H;

const filters = ["All", "Toddle", "Sprinto", "PortOne", "Glomo", "Unlimit"] as const;
type Filter = (typeof filters)[number];

/**
 * Where the work has reached, drawn as rails out of Mumbai.
 * Only regions named in the career history are plotted.
 */
export default function Network() {
  const [f, setF] = useState<Filter>("All");
  const hx = px(home.lon);
  const hy = py(home.lat);

  const lit = (companies: string[]) => f === "All" || f === "Unlimit" || companies.includes(f);

  return (
    <section id="network" aria-labelledby="network-title" className="bg-char text-paper">
      <div className="mx-auto max-w-grid px-5 py-20 md:px-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="network-title" className="display text-[clamp(2.4rem,6vw,5.5rem)]" style={{ fontVariationSettings: '"wdth" 80' }}>
              Where the money moves
            </h2>
            <p className="serif mt-5 max-w-md text-lg leading-relaxed text-paper/80">
              Every rail starts in Mumbai. Pick a company to see which markets that chapter reached.
            </p>
          </div>
          <div className="flex flex-wrap content-end gap-2 lg:col-span-7 lg:justify-end" role="group" aria-label="Filter by company">
            {filters.map((name) => (
              <button
                key={name}
                onClick={() => setF(name)}
                aria-pressed={f === name}
                className={`border px-3 py-1.5 text-sm ${
                  f === name ? "border-lime bg-lime text-ink" : "border-paper/40 hover:border-paper"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[680px]" role="img"
            aria-label={`Map of markets reached from Mumbai. Showing ${f === "All" ? "all chapters" : f}.`}>
            {/* graticule */}
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`v${i}`} x1={(i * W) / 12} x2={(i * W) / 12} y1={0} y2={H} stroke="#F1EDE2" strokeOpacity={0.08} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`h${i}`} y1={(i * H) / 6} y2={(i * H) / 6} x1={0} x2={W} stroke="#F1EDE2" strokeOpacity={i === 3 ? 0.18 : 0.08} />
            ))}

            {f === "Unlimit" && (
              <ellipse cx={W / 2} cy={H / 2} rx={W / 2 - 8} ry={H / 2 - 8} fill="none" stroke="#C8F135" strokeWidth={2} strokeDasharray="2 10" />
            )}

            {regions.map((r) => {
              const x = px(r.lon);
              const y = py(r.lat);
              const on = lit(r.companies);
              const dist = Math.hypot(x - hx, y - hy);
              const cx = (x + hx) / 2;
              const cy = (y + hy) / 2 - dist * 0.32;
              const d = `M${hx},${hy} Q${cx},${cy} ${x},${y}`;
              const labelLeft = r.id === "gift";
              return (
                <g key={r.id} opacity={on ? 1 : 0.18} style={{ transition: "opacity 300ms" }}>
                  <path d={d} fill="none" stroke="#F1EDE2" strokeOpacity={0.35} strokeWidth={1.5} />
                  {on && <path d={d} fill="none" stroke="#C8F135" strokeWidth={2.5} className="rail-pulse" />}
                  <circle cx={x} cy={y} r={7} fill="#1E3FD8" stroke="#F1EDE2" strokeWidth={2} />
                  <text
                    x={labelLeft ? x - 12 : x + 12}
                    y={labelLeft ? y - 8 : y + 5}
                    textAnchor={labelLeft ? "end" : "start"}
                    fill="#F1EDE2"
                    fontSize={16}
                    fontWeight={600}
                  >
                    {r.name}
                  </text>
                </g>
              );
            })}

            <circle cx={hx} cy={hy} r={13} fill="#C8F135" stroke="#000" strokeWidth={3} />
            <text x={hx + 10} y={hy + 32} fill="#C8F135" fontSize={17} fontWeight={800}>Mumbai</text>
          </svg>
        </div>

        <p className="mt-4 min-h-[3rem] text-sm text-paper/70" aria-live="polite">
          {f === "All" && "Regions named across Toddle, Sprinto, PortOne and Glomo. Rocketium's new regions aren't plotted because they weren't named."}
          {f === "Toddle" && "Outbound GTM designed across APAC, North America and LATAM."}
          {f === "Sprinto" && "$300K+ qualified pipeline across APAC and the USA."}
          {f === "PortOne" && "$500K+ qualified pipeline across SEA, the EU and the USA."}
          {f === "Glomo" && "Regulated, compliance-focused fintech, from GIFT City."}
          {f === "Unlimit" && "Cross-border payments with a primarily global focus, so the whole map is in play."}
        </p>

        <div className="mt-14 border-t border-paper/20 pt-8">
          <h3 className="text-sm text-paper/60">What I work with</h3>
          <ul className="mt-4 columns-1 gap-8 sm:columns-2 lg:columns-3">
            {capabilities.map((c) => (
              <li key={c} className="break-inside-avoid border-b border-paper/10 py-2.5 text-lg" style={{ fontVariationSettings: '"wdth" 108' }}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
