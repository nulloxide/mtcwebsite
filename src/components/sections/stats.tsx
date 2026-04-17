"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { AnimatedCounter } from "@/components/effects/animated-counter";

const stats = [
  { value: "15", label: "Asset Classes in Production", suffix: "+" },
  { value: "4", label: "Countries", suffix: "+" },
  { value: "1", label: "Unified Platform" },
];

export function Stats() {
  return (
    <section className="relative overflow-hidden py-32 md:py-48">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <AnimatedCounter
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
