import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Capabilities } from "@/components/sections/capabilities";
import { DataPlatform } from "@/components/sections/data-platform";
import { Stats } from "@/components/sections/stats";
import { Careers } from "@/components/sections/careers";
import { Contact } from "@/components/sections/contact";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { NoiseOverlay } from "@/components/effects/noise-overlay";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <NoiseOverlay />
      <Hero />
      <About />
      <Capabilities />
      <DataPlatform />
      <Stats />
      <Careers />
      <Contact />
    </>
  );
}
