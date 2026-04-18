"use client";

import { useEffect, useRef } from "react";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { loadGsap } from "@/lib/gsap";

const heroStats = [
  { value: "15+", label: "Asset Classes in Production" },
  { value: "4+", label: "Countries" },
  { value: "1", label: "Unified Platform" },
];

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tl: { kill: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const gsap = await loadGsap();
      if (cancelled) return;

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl = timeline;

      timeline
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 }
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.2"
        )
        .fromTo(
          statsRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.1"
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
          We build the proprietary data platform — ingestion, verification,
          enrichment, and analytics — that Monachil Capital Partners runs on.
          Fifteen-plus asset classes, four countries, one unified system.
        </p>

        <div ref={ctaRef} className="mt-12 flex justify-center opacity-0">
          <MagneticButton
            className="bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-accent hover:shadow-accent/30"
            onClick={() => scrollTo("#capabilities")}
          >
            Explore Our Capabilities
          </MagneticButton>
        </div>

        <div
          ref={statsRef}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-6 opacity-0 sm:gap-10"
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-light text-text-primary sm:text-4xl md:text-5xl">
                {stat.value.replace(/\+$/, "")}
                {stat.value.endsWith("+") && (
                  <span className="text-brand-blue">+</span>
                )}
              </div>
              <div className="mt-2 text-[11px] font-light uppercase tracking-[0.15em] text-text-secondary sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
