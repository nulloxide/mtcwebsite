"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TextReveal } from "@/components/effects/text-reveal";

export function About() {
  return (
    <section id="about" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <div className="h-px w-16 bg-brand-blue/40" />
        </ScrollReveal>

        <TextReveal
          as="h2"
          className="mt-8 text-3xl font-light tracking-tight text-text-primary md:text-5xl lg:text-6xl"
        >
          Data is the Foundation, Not a Byproduct
        </TextReveal>

        <ScrollReveal delay={0.15}>
          <p className="mt-8 text-lg font-light leading-relaxed text-text-secondary md:text-xl">
            Monachil Technologies is the technology division of{" "}
            <a
              href="https://monachilpartners.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
            >
              Monachil Capital Partners LP
            </a>
            , an SEC-registered private credit manager focused on opportunistic,
            asset-backed investing. We build the proprietary systems that power
            the investment process — from deal sourcing and underwriting through
            daily portfolio monitoring and investor reporting.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <p className="mt-6 text-lg font-light leading-relaxed text-text-secondary md:text-xl">
            Investment, legal, operations, finance, and investor relations all
            work on the same platform — not a collection of siloed tools.
            The data team is embedded from day zero of every deal, and
            everything we ingest is independently verified against source.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.35}>
          <p className="mt-6 text-lg font-light leading-relaxed text-text-secondary md:text-xl">
            Small team, high trust, strong opinions on data quality. We write
            Python, SQL, and IaC; we verify what we ingest; we document what
            we ship.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
