import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Capabilities } from "@/components/sections/capabilities";
import { DataPlatform } from "@/components/sections/data-platform";
import { Connect } from "@/components/sections/connect";
import { ParticleNetwork } from "@/components/effects/particle-network";
import { NoiseOverlay } from "@/components/effects/noise-overlay";

export default function Home() {
  return (
    <>
      <ParticleNetwork fixed />
      <NoiseOverlay />
      <Hero />
      <About />
      <Capabilities />
      <DataPlatform />
      <Connect />
    </>
  );
}
