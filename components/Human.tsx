"use client";

import { ArrowUpRight, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { links, person } from "@/data/site";
import { emit, scrollToId } from "@/lib/events";

export default function Human() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!links.email) return;
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${links.email}`;
    }
  };

  return (
    <section id="hello" aria-labelledby="hello-title" className="bg-ink text-paper">
      <div className="mx-auto max-w-grid px-5 pb-10 pt-24 md:px-10">
        <h2 id="hello-title" className="sr-only">About me and contact</h2>
        <p className="display text-[clamp(2.2rem,6.5vw,6rem)]">
          {person.closing.map((line, i) => (
            <span key={line} className="block" style={{ fontVariationSettings: `"wdth" ${[62, 125, 90, 110][i]}`, color: i === 2 ? "var(--lime)" : undefined }}>
              {line}
            </span>
          ))}
        </p>

        <div className="mt-20 grid gap-12 border-t border-paper/20 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-3xl font-bold" style={{ fontVariationSettings: '"wdth" 110' }}>Let&apos;s talk.</p>
            <p className="serif mt-3 max-w-md text-lg text-paper/80">
              Payments partnerships, a role, a collaboration, a gig, or an interesting conversation. All welcome.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {links.email ? (
                <>
                  <a href={`mailto:${links.email}`} className="flex items-center gap-2 bg-lime px-5 py-3 font-semibold text-ink hover:bg-paper">
                    <Mail size={18} aria-hidden /> Email me
                  </a>
                  <button onClick={copy} className="flex items-center gap-2 border-2 border-paper px-5 py-3 font-semibold hover:bg-paper hover:text-ink">
                    <Copy size={18} aria-hidden /> {copied ? "Copied" : "Copy address"}
                  </button>
                </>
              ) : (
                <p className="border-2 border-dashed border-paper/40 px-5 py-3 text-paper/60">Email address coming soon</p>
              )}
              {links.linkedin ? (
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border-2 border-paper px-5 py-3 font-semibold hover:bg-paper hover:text-ink">
                  LinkedIn <ArrowUpRight size={18} aria-hidden />
                </a>
              ) : (
                <p className="border-2 border-dashed border-paper/40 px-5 py-3 text-paper/60">LinkedIn link coming soon</p>
              )}
              {links.cv && (
                <a href={links.cv} className="flex items-center gap-2 border-2 border-paper px-5 py-3 font-semibold hover:bg-paper hover:text-ink">
                  Download CV
                </a>
              )}
            </div>
          </div>

          <nav aria-label="Explore" className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm text-paper/60">Or keep exploring</p>
            <ul className="mt-3 text-xl">
              {[
                ["The career story", "work"],
                ["The side projects", "builds"],
              ].map(([label, id]) => (
                <li key={id} className="border-b border-paper/15">
                  <button onClick={() => scrollToId(id)} className="w-full py-3 text-left hover:text-lime">{label}</button>
                </li>
              ))}
              <li className="border-b border-paper/15">
                <button
                  onClick={() => {
                    scrollToId("decks");
                    emit("deck:play");
                  }}
                  className="w-full py-3 text-left hover:text-lime"
                >
                  Start the mix
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <footer className="mt-24 flex flex-wrap items-end justify-between gap-4 text-sm text-paper/50">
          <p className="display text-paper" style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontVariationSettings: '"wdth" 62' }}>
            Still loading. Please don&apos;t refresh.
          </p>
          <p>
            © {new Date().getFullYear()} {person.name}. Press <kbd className="text-paper">Ctrl</kbd> or <kbd className="text-paper">⌘</kbd> + <kbd className="text-paper">K</kbd> to navigate.
          </p>
        </footer>
      </div>
    </section>
  );
}
