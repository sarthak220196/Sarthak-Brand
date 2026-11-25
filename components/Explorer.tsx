import { home, places } from "@/data/site";

export default function Explorer() {
  return (
    <section id="explorer" aria-labelledby="explorer-title" className="bg-bone">
      <div className="mx-auto max-w-grid px-5 py-24 md:px-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 id="explorer-title" className="display text-[clamp(2.6rem,7vw,6.5rem)] text-ink lg:col-span-7" style={{ fontVariationSettings: '"wdth" 66' }}>
            Field notes
          </h2>
          <p className="serif text-lg leading-relaxed lg:col-span-4 lg:col-start-9 lg:self-end">
            Travel, new places, good conversations. A journal that fills in as I go, starting from home.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="flex min-h-[260px] flex-col justify-between border-2 border-ink bg-lime p-6 md:row-span-2">
            <p className="text-sm">Home port</p>
            <div>
              <p className="display text-6xl" style={{ fontVariationSettings: '"wdth" 120' }}>{home.name}</p>
              <p className="tabular mt-2 text-sm">{home.lat.toFixed(2)}° N, {home.lon.toFixed(2)}° E</p>
            </div>
          </div>

          {places.map((p) => (
            <figure key={p.place + p.when} className="border-2 border-ink bg-paper">
              {p.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photo} alt={`${p.place}, ${p.when}`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              )}
              <figcaption className="p-5">
                <p className="text-xl font-bold">{p.place}</p>
                <p className="text-sm text-mute">{p.when}</p>
                <p className="serif mt-2">{p.story}</p>
              </figcaption>
            </figure>
          ))}

          {Array.from({ length: Math.max(0, 4 - places.length) }).map((_, i) => (
            <div key={i} className="grain flex min-h-[200px] items-end border-2 border-dashed border-char/40 p-5">
              <p className="text-sm text-mute">{i === 0 ? "Next entry: being written." : "Space for the next stop."}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
