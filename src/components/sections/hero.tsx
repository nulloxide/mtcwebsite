"use client";

import { useEffect, useRef } from "react";
import { ParticleNetwork } from "@/components/effects/particle-network";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tl: { kill: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl = timeline;

      timeline
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" },
          { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 1.2 }
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 30, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.2"
        );
    })();

    return () => {
      cancelled = true;
      tl?.kill();
    };
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <ParticleNetwork />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <h1
          ref={headlineRef}
          className="text-5xl font-light leading-[1.05] tracking-tight text-text-primary opacity-0 sm:text-6xl md:text-7xl lg:text-8xl"
        >
          The Intelligence Layer for{" "}
          <span className="gradient-text-shimmer">Private Credit</span>
        </h1>

        <p
          ref={subRef}
          className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-text-secondary opacity-0 md:text-xl"
        >
          Monachil Technologies builds proprietary data infrastructure and
          analytics platforms that transform alternative asset data into
          institutional-grade decision support.
        </p>

        <div ref={ctaRef} className="mt-12 flex justify-center opacity-0">
          <MagneticButton
            className="bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-accent hover:shadow-accent/30"
            onClick={() => scrollTo("#platform")}
          >
            Explore the Platform
          </MagneticButton>
        </div>

        {/* Scroll indicator */}
        <div ref={scrollRef} className="mt-24 flex justify-center opacity-0">
          <button
            onClick={() => scrollTo("#about")}
            className="flex flex-col items-center gap-2 text-text-secondary/50 transition-colors hover:text-text-secondary"
            aria-label="Scroll down"
          >
            <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
            <ArrowDown className="h-3 w-3 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
