import Intro from "@/components/Intro";
import FrequencyNav from "@/components/FrequencyNav";
import CommandPalette from "@/components/CommandPalette";
import Hero from "@/components/Hero";
import CareerEvolution from "@/components/CareerEvolution";
import Network from "@/components/Network";
import Toolkit from "@/components/Toolkit";
import Builds from "@/components/Builds";
import Person from "@/components/Person";
import Contact from "@/components/Contact";
import EasterEgg from "@/components/EasterEgg";
import { availableCv, availablePhotos } from "@/lib/server";

export default function Page() {
  // checked at build time: links only appear if the files are really there
  const cv = availableCv();
  const photos = availablePhotos();

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-lime focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to the journey
      </a>
      <Intro />
      <FrequencyNav />
      <CommandPalette cv={cv} />
      <EasterEgg />
      <main>
        <Hero />
        <CareerEvolution />
        <Network />
        <Toolkit />
        <Builds />
        <Person photos={photos} />
        <Contact cv={cv} />
      </main>
    </>
  );
}
