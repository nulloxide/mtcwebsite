"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TextReveal } from "@/components/effects/text-reveal";
import { MovingBorder } from "@/components/effects/moving-border";
import {
  Calculator,
  Briefcase,
  Building2,
  TrendingUp,
  FileBarChart,
} from "lucide-react";

const platformCards = [
  {
    icon: Briefcase,
    title: "Portfolio & Origination",
    description:
      "End-to-end deal pipeline management, credit underwriting support, and real-time portfolio monitoring across all strategies.",
  },
  {
    icon: TrendingUp,
    title: "Market & Valuation",
    description:
      "Integrated market data feeds, pricing models, and mark-to-market valuation engines purpose-built for illiquid credit instruments.",
  },
  {
    icon: Calculator,
    title: "Middle Office & Accounting",
    description:
      "Automated reconciliation, trade settlement, and accounting workflows that eliminate manual processes and reduce operational risk.",
  },
  {
    icon: Building2,
    title: "Fund Administration",
    description:
      "NAV calculations, investor allocations, capital call/distribution processing, and full audit trail for regulatory compliance.",
  },
  {
    icon: FileBarChart,
    title: "Investor Reports",
    description:
      "Automated generation of performance reports, risk analytics, and investor communications with full data lineage and auditability.",
  },
];

const flowNodes = [
  "Ingestion",
  "Bronze",
  "Silver",
  "Gold",
  "Consumption",
  "Audit",
];

// 6 nodes evenly at x: 80, 260, 440, 620, 800, 960
const NODE_POSITIONS = [80, 260, 440, 620, 800, 960];
const NODE_Y = 60;
const PARTICLES_PER_CONN = 3;
const PARTICLE_DUR = "2s";

function PipelineFlowDiagram() {
  const connections = NODE_POSITIONS.slice(0, -1).map((x, i) => ({
    id: `conn-${i}`,
    d: `M ${x} ${NODE_Y} L ${NODE_POSITIONS[i + 1]} ${NODE_Y}`,
  }));

  return (
    <div className="relative mx-auto max-w-5xl">
      <svg
        viewBox="0 0 1040 120"
        fill="none"
        className="w-full"
        aria-hidden="true"
      >
        <defs>
          {/* Reusable paths for animateMotion */}
          {connections.map((conn) => (
            <path key={conn.id} id={conn.id} d={conn.d} />
          ))}
        </defs>

        {/* Base connection lines (dim static) */}
        {connections.map((conn) => (
          <path
            key={`base-${conn.id}`}
            d={conn.d}
            stroke="var(--brand-blue)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.15"
          />
        ))}

        {/* Animated dashed flow overlay */}
        {connections.map((conn) => (
          <path
            key={`flow-${conn.id}`}
            d={conn.d}
            stroke="var(--brand-blue)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
            strokeDasharray="6 12"
            style={{ animation: "flow-dash 1.2s linear infinite" }}
          />
        ))}

        {/* Traveling particles per connection */}
        {connections.map((conn, connIdx) =>
          Array.from({ length: PARTICLES_PER_CONN }).map((_, pIdx) => (
            <circle
              key={`particle-${connIdx}-${pIdx}`}
              r="2"
              fill="var(--accent)"
              opacity="0"
            >
              <animateMotion
                dur={PARTICLE_DUR}
                begin={`${(pIdx * 2) / PARTICLES_PER_CONN + connIdx * 0.15}s`}
                repeatCount="indefinite"
              >
                <mpath href={`#${conn.id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                dur={PARTICLE_DUR}
                begin={`${(pIdx * 2) / PARTICLES_PER_CONN + connIdx * 0.15}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))
        )}

        {/* Nodes */}
        {NODE_POSITIONS.map((x, i) => (
          <g key={`node-${i}`}>
            {/* Outer pulse glow */}
            <circle
              cx={x}
              cy={NODE_Y}
              r="10"
              fill="none"
              stroke="var(--brand-blue)"
              strokeWidth="1"
              opacity="0.15"
              style={{
                animation: `node-pulse 3s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
            {/* Mid ring */}
            <circle
              cx={x}
              cy={NODE_Y}
              r="7"
              fill="var(--brand-blue)"
              opacity="0.12"
            />
            {/* Core dot */}
            <circle
              cx={x}
              cy={NODE_Y}
              r="4"
              fill="var(--brand-blue)"
            />
            {/* Bright center */}
            <circle
              cx={x}
              cy={NODE_Y}
              r="2"
              fill="var(--accent)"
              opacity="0.8"
            />
          </g>
        ))}
      </svg>

      {/* Desktop labels */}
      <div className="mt-3 hidden md:flex">
        {flowNodes.map((node, i) => (
          <div
            key={node}
            className="flex-1 text-center"
            style={{ maxWidth: i === flowNodes.length - 1 ? "60px" : undefined }}
          >
            <span className="text-[11px] font-light tracking-wide text-text-secondary">
              {node}
            </span>
          </div>
        ))}
      </div>

      {/* Mobile stacked labels */}
      <div className="mt-4 flex flex-col gap-2 md:hidden">
        {flowNodes.map((node, i) => (
          <div key={node} className="flex items-center gap-3">
            <div className="h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
            <span className="text-xs font-light text-text-secondary">
              {i + 1}. {node}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataPlatform() {
  return (
    <section id="platform" className="relative py-32 md:py-48">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/4 h-[600px] w-[800px] -translate-x-1/2"
          style={{
            background: "radial-gradient(ellipse at center, var(--brand-blue) 0%, transparent 70%)",
            opacity: 0.03,
            borderRadius: "50%",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <p className="text-xs font-light uppercase tracking-[0.3em] text-brand-blue">
              Our Platform
            </p>
          </ScrollReveal>
          <TextReveal
            as="h2"
            className="mt-4 text-3xl font-light tracking-tight text-text-primary md:text-5xl lg:text-6xl"
          >
            Medallion Architecture, Purpose-Built for Credit
          </TextReveal>
          <ScrollReveal delay={0.2}>
            <p className="mt-6 text-lg font-light leading-relaxed text-text-secondary">
              Raw servicer tapes, bank statements, and contract PDFs enter
              Bronze. Silver cleans, deduplicates, and validates. Gold holds
              the enriched layer — DPD, borrowing base, covenant checks, and
              cross-dataset joins — every number regenerable from source.
            </p>
          </ScrollReveal>
        </div>

        {/* Animated Data Flow Diagram */}
        <ScrollReveal>
          <div className="mt-20">
            <PipelineFlowDiagram />
          </div>
        </ScrollReveal>

        {/* Platform capability cards */}
        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-3">
          {platformCards.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.08}>
              <MovingBorder
                containerClassName="h-full"
                className="card-surface h-full p-8"
                duration={`${4 + i * 0.5}s`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/8">
                  <card.icon className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-text-primary">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-text-secondary">
                  {card.description}
                </p>
              </MovingBorder>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
