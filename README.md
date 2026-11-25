# Several Frequencies: the Sarthak Sighat site

Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Deploy to Vercel as-is. Set `NEXT_PUBLIC_SITE_URL` to your domain for correct SEO metadata.

## Update content

Everything lives in `data/site.ts`:

- `stages`: the five career chapters, companies, dates, achievements. Replace the `role` text with exact job titles if you prefer.
- `stages[...].ledger`: Unlimit's closed vs in-pipeline items. Move items from `pipeline` to `closed` only when signed.
- `regions`: markets on the network map (only regions named in your history).
- `dj`: history, setup, `mixesUrl`.
- `projects`: side projects and links.
- `places`: travel journal. Empty by design; add real entries with photos in `/public/photos`.
- `links`: email, LinkedIn, CV. Any `null` link shows "coming soon" instead of a dead link.

## Structure

```
app/            layout (SEO, fonts), page (section order), globals.css (tokens)
components/     one file per section + Intro, FrequencyNav, CommandPalette, EasterEgg
lib/audio.ts    Web Audio two-deck engine (all sounds synthesised, no samples)
lib/events.ts   tiny event bus used by the command palette
data/site.ts    all content
```

## Design system

Colours: paper #F1EDE2, bone #E6E0D1, charcoal #2B2B2E, black #000, lime #C8F135, cobalt #1E3FD8, mute #6B675D.
Type: Archivo (variable width 62–125, the "tuning" device) for display and UI; Newsreader for editorial body copy.
Motion: one orchestrated moment per section, reduced-motion respected everywhere.

## Interactions

- Intro: a radio dial sweeps stations and locks on. Once per session; Esc or "Skip intro".
- Nav: a frequency dial whose needle follows your scroll.
- Ctrl/⌘ + K: command palette (sections, start the mix, copy email, LinkedIn).
- Career: sticky illustration changes per chapter (Build, Grow, Lead, Sell, Connect).
- Network: filter markets by company; Unlimit lights the whole map.
- Comeback: scroll-driven waveform that flatlines and returns unevenly.
- Decks: two playable decks, shared BPM, per-deck filter, crossfader, live spectrum.
- Easter egg: type "drop" anywhere outside a text field.

## Before launch

- Add email, LinkedIn and CV in `data/site.ts`.
- Add an OG image at `app/opengraph-image.png` (1200×630).
- Add photos of yourself only where you want them; nothing is stock.
