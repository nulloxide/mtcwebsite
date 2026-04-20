"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { MovingBorder } from "@/components/effects/moving-border";
import {
  Calculator,
  Briefcase,
  Building2,
  TrendingUp,
  FileBarChart,
  ShieldCheck,
  Database,
  Filter,
  Sparkles,
  BarChart2,
  FileCheck,
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
  {
    icon: ShieldCheck,
    title: "Data Quality & Observability",
    description:
      "Schema validation, row-level lineage, and alerts on drift or gaps. Every pipeline is instrumented; every number traces back to source.",
  },
];

// Medallion stages with metallic colors where they apply. Ingestion and
// Consumption/Audit stay brand-blue so the Bronze/Silver/Gold story pops.
const stages = [
  { label: "Ingestion",   icon: Database,  fill: "var(--brand-blue)", accent: "var(--accent)" },
  { label: "Bronze",      icon: Filter,    fill: "#CD7F32",           accent: "#E2A96D" },
  { label: "Silver",      icon: Sparkles,  fill: "#B0B4C0",           accent: "#D8DCE4" },
  { label: "Gold",        icon: BarChart2, fill: "#D4AF37",           accent: "#F1D271" },
  { label: "Consumption", icon: FileBarChart, fill: "var(--brand-blue)", accent: "var(--accent)" },
  { label: "Audit",       icon: FileCheck, fill: "var(--brand-blue)", accent: "var(--accent)" },
];

const NODE_POSITIONS = [80, 260, 440, 620, 800, 960];
const NODE_Y = 60;
const PARTICLES_PER_CONN = 2;
const PARTICLE_DUR = "4s";

function PipelineFlowDiagram() {
  const connections = NODE_POSITIONS.slice(0, -1).map((x, i) => ({
    id: `conn-${i}`,
    d: `M ${x} ${NODE_Y} L ${NODE_POSITIONS[i + 1]} ${NODE_Y}`,
  }));

  return (
    <div className="relative mx-auto max-w-5xl">
      <svg
        viewBox="0 0 1040 140"
        fill="none"
        className="hidden w-full md:block"
        aria-hidden="true"
      >
        <defs>
          {connections.map((conn) => (
            <path key={conn.id} id={conn.id} d={conn.d} />
          ))}
        </defs>

        {connections.map((conn) => (
          <path
            key={`base-${conn.id}`}
            d={conn.d}
            stroke="var(--brand-blue)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.18"
          />
        ))}

        {connections.map((conn) => (
          <path
            key={`flow-${conn.id}`}
            d={conn.d}
            stroke="var(--brand-blue)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.35"
            strokeDasharray="6 12"
            style={{ animation: "flow-dash 1.8s linear infinite" }}
          />
        ))}

        {connections.map((conn, connIdx) =>
          Array.from({ length: PARTICLES_PER_CONN }).map((_, pIdx) => (
            <circle
              key={`particle-${connIdx}-${pIdx}`}
              r="2"
              fill={stages[connIdx + 1]?.accent || "var(--accent)"}
              opacity="0"
            >
              <animateMotion
                dur={PARTICLE_DUR}
                begin={`${(pIdx * 2) / PARTICLES_PER_CONN + connIdx * 0.2}s`}
                repeatCount="indefinite"
              >
                <mpath href={`#${conn.id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.85;0.85;0"
                dur={PARTICLE_DUR}
                begin={`${(pIdx * 2) / PARTICLES_PER_CONN + connIdx * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))
        )}

        {NODE_POSITIONS.map((x, i) => {
          const stage = stages[i];
          return (
            <g key={`node-${i}`}>
              <circle
                cx={x}
                cy={NODE_Y}
                r="14"
                fill="none"
                stroke={stage.fill}
                strokeWidth="1"
                opacity="0.2"
                style={{
                  animation: `node-pulse 3s ease-in-out ${i * 0.5}s infinite`,
                }}
              />
              <circle cx={x} cy={NODE_Y} r="10" fill={stage.fill} opacity="0.18" />
              <circle cx={x} cy={NODE_Y} r="6" fill={stage.fill} />
              <circle cx={x} cy={NODE_Y} r="3" fill={stage.accent} opacity="0.9" />
            </g>
          );
        })}
      </svg>

      <div className="mt-4 hidden md:flex">
        {stages.map((stage) => (
          <div key={stage.label} className="flex flex-1 flex-col items-center gap-1.5">
            <stage.icon className="h-3.5 w-3.5" style={{ color: stage.fill, opacity: 0.7 }} />
            <span className="text-[11px] font-light tracking-wide text-text-secondary">
              {stage.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-col gap-3 md:hidden">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${stage.fill}14`, border: `1px solid ${stage.fill}40` }}
            >
              <stage.icon className="h-4 w-4" style={{ color: stage.fill }} />
            </div>
            <div>
              <span className="text-[10px] font-light uppercase tracking-widest text-text-secondary/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="ml-2 text-sm font-medium text-text-primary">{stage.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataPlatform() {
  return (
    <section id="platform" className="relative overflow-hidden py-32 md:py-48">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/4 h-[600px] w-[800px] -translate-x-1/2"
          style={{
            background: "radial-gradient(ellipse at center, var(--brand-blue) 0%, transparent 70%)",
            opacity: 0.07,
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
          <ScrollReveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              Medallion Architecture, Purpose-Built for Credit
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-6 text-lg font-light leading-relaxed text-text-secondary">
              Raw tapes, bank statements, and contracts flow Bronze →
              Silver → Gold. Every number is regenerable from source,
              every transformation auditable.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="mt-20">
            <PipelineFlowDiagram />
          </div>
        </ScrollReveal>

        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {platformCards.map((card, i) => (
            <ScrollReveal key={card.title} delay={Math.min(i * 0.08, 0.24)}>
              <MovingBorder
                containerClassName="h-full"
                className="card-surface h-full p-8"
                duration={`${5 + i * 0.5}s`}
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
