"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TextReveal } from "@/components/effects/text-reveal";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { MovingBorder } from "@/components/effects/moving-border";
import { ArrowUpRight } from "lucide-react";

const CAREERS_URL = "https://monachilpartners.com/join-the-team";

const positions = [
  {
    title: "Python Software Engineer",
    location: "Canada",
    type: "Full-Time",
  },
  {
    title: "DevOps Platform Engineer",
    location: "Canada",
    type: "Full-Time",
  },
];

export function Careers() {
  return (
    <section id="careers" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <div className="h-px w-16 bg-brand-blue/40" />
        </ScrollReveal>
        <TextReveal
          as="h2"
          className="mt-8 text-3xl font-light tracking-tight text-text-primary md:text-5xl lg:text-6xl"
        >
          Build What Matters
        </TextReveal>
        <ScrollReveal delay={0.15}>
          <p className="mt-6 text-lg font-light leading-relaxed text-text-secondary">
            Join a team solving hard problems at the intersection of finance
            and technology. We&apos;re always looking for exceptional engineers.
          </p>
        </ScrollReveal>

        <div className="mt-12 space-y-4">
          {positions.map((pos, i) => (
            <ScrollReveal key={pos.title} delay={i * 0.1}>
              <a
                href={CAREERS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <MovingBorder
                  className="card-surface group"
                  duration={`${4 + i}s`}
                >
                  <div className="flex items-center justify-between p-6 md:p-8">
                    <div>
                      <h3 className="text-lg font-medium text-text-primary">
                        {pos.title}
                      </h3>
                      <p className="mt-1 text-sm font-light text-text-secondary">
                        {pos.location} &middot; {pos.type}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-brand-blue/30 group-hover:bg-brand-blue/10">
                      <ArrowUpRight className="h-4 w-4 text-text-secondary transition-colors group-hover:text-brand-blue" />
                    </div>
                  </div>
                </MovingBorder>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-12">
            <MagneticButton
              href={CAREERS_URL}
              className="border border-border bg-surface text-text-primary hover:border-brand-blue/30 hover:bg-surface-elevated"
            >
              View All Positions
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
