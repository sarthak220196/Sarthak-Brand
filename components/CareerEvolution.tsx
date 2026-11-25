"use client";

import { useEffect, useRef, useState } from "react";
import { stages, type StageId, type Status } from "@/data/site";
import StageVisual, { caption } from "./StageVisual";

const statusLabel: Record<Status, string> = { closed: "Closed", pipeline: "In pipeline" };

export default function CareerEvolution() {
  const [active, setActive] = useState<StageId>("build");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.getAttribute("data-stage") as StageId);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const activeIdx = stages.findIndex((s) => s.id === active);

  return (
    <section id="work" aria-labelledby="work-title" className="border-t-2 border-ink bg-paper">
      <div className="mx-auto max-w-grid px-5 pb-10 pt-20 md:px-10">
        <h2 id="work-title" className="display text-[clamp(2.4rem,7vw,6.5rem)] text-ink" style={{ fontVariationSettings: '"wdth" 72' }}>
          {stages.map((s, i) => (
            <span key={s.id} className={i <= activeIdx ? "text-ink" : "text-char/25"} style={{ transition: "color 300ms" }}>
              {s.verb}.{" "}
            </span>
          ))}
        </h2>
        <p className="serif mt-6 max-w-xl text-lg leading-relaxed text-char/80">
          Five chapters, seven companies, one direction. I&apos;ve switched companies more than once. Each move added a capability the next chapter needed, and the dates are all here.
        </p>
      </div>

      <div className="mx-auto grid max-w-grid gap-10 px-5 pb-24 md:px-10 lg:grid-cols-12">
        {/* Sticky stage visual */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-24">
            <div className="aspect-square w-full border-2 border-ink bg-bone">
              <StageVisual stage={active} />
            </div>
            <p className="mt-3 text-sm text-mute">
              {stages[activeIdx].verb}: {caption[active]}
            </p>
            <ol className="mt-6 flex gap-1" aria-label="Progress through the five chapters">
              {stages.map((s, i) => (
                <li key={s.id} className={`h-1.5 flex-1 ${i <= activeIdx ? "bg-cobalt" : "bg-char/15"}`}>
                  <span className="sr-only">{s.verb}{i === activeIdx ? " (current)" : ""}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Chapters */}
        <div className="lg:col-span-7">
          {stages.map((s, i) => (
            <article
              key={s.id}
              data-stage={s.id}
              ref={(el) => {
                refs.current[s.id] = el;
              }}
              className="border-t border-char/25 py-14 first:border-t-0 first:pt-0"
              aria-labelledby={`stage-${s.id}`}
            >
              <div className="mb-6 aspect-[4/3] border-2 border-ink bg-bone lg:hidden">
                <StageVisual stage={s.id} />
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <h3 id={`stage-${s.id}`} className="display text-[clamp(3rem,8vw,6rem)] text-ink" style={{ fontVariationSettings: '"wdth" 118' }}>
                  {s.verb}
                </h3>
                <span className="tabular text-sm text-mute">
                  {i + 1} of {stages.length}
                </span>
              </div>
              <p className="mt-2 text-lg font-semibold">
                {s.chapter}, {s.years}
              </p>
              <p className="serif mt-3 max-w-prose text-xl leading-snug text-char">{s.lesson}</p>

              <div className="mt-8 space-y-10">
                {s.roles.map((r) => (
                  <div key={r.company} className="grid gap-x-8 gap-y-3 md:grid-cols-[13rem_1fr]">
                    <div>
                      <p className="text-xl font-bold leading-tight" style={{ fontVariationSettings: '"wdth" 105' }}>
                        {r.company}
                      </p>
                      <p className="tabular mt-1 text-sm text-mute">{r.dates}</p>
                    </div>
                    <div>
                      <p className="font-semibold">{r.role}</p>
                      {r.context && <p className="text-sm text-mute">{r.context}</p>}
                      {r.points.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {r.points.map((p) => (
                            <li key={p} className="flex gap-3 leading-snug">
                              <span aria-hidden className="mt-[0.55em] h-[3px] w-3 shrink-0 bg-cobalt" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                      {r.ledger && (
                        <table className="mt-4 w-full text-left text-[15px]">
                          <caption className="sr-only">Unlimit deal status</caption>
                          <thead>
                            <tr className="border-b-2 border-ink text-sm">
                              <th className="py-2 font-semibold">What</th>
                              <th className="py-2 text-right font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {r.ledger.map((l) => (
                              <tr key={l.text} className="border-b border-char/15">
                                <td className="py-2.5 pr-4">{l.text}</td>
                                <td className="py-2.5 text-right">
                                  <span
                                    className={`inline-block whitespace-nowrap px-2 py-0.5 text-sm font-semibold ${
                                      l.status === "closed" ? "bg-lime text-ink" : "border border-dashed border-char text-char"
                                    }`}
                                  >
                                    {statusLabel[l.status]}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      {r.note && <p className="serif mt-3 italic text-mute">{r.note}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-10 text-sm">
                <span className="text-mute">Carried into the next chapter: </span>
                <span className="font-semibold">{s.carriedForward}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
