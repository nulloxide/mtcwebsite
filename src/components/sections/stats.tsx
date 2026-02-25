"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { AnimatedCounter } from "@/components/effects/animated-counter";

const stats = [
  { value: "2021", label: "Year Founded" },
  { value: "24/7", label: "System Monitoring" },
  { value: "100", label: "Uptime SLA", suffix: "%" },
];

export function Stats() {
  return (
    <section className="relative py-32 md:py-48">
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
