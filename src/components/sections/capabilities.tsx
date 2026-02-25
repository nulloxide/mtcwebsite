"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TextReveal } from "@/components/effects/text-reveal";
import { TiltCard } from "@/components/effects/tilt-card";
import { BarChart3, Server, ShieldCheck, Brain } from "lucide-react";

const SPARKLINE_PATH =
  "M0 48 C20 45, 30 42, 45 38 C60 34, 70 36, 85 30 C100 24, 110 28, 125 22 C140 16, 155 18, 170 12 C180 8, 190 10, 200 6";

const DPD_BARS = [
  { x: 4, y: 2, h: 34, color: "#10B981", label: "Current" },
  { x: 32, y: 8, h: 28, color: "#34D399", label: "1-30" },
  { x: 60, y: 16, h: 20, color: "#FBBF24", label: "31-60" },
  { x: 88, y: 22, h: 14, color: "#F59E0B", label: "61-90" },
  { x: 116, y: 28, h: 8, color: "#EF4444", label: "90+" },
];

const VINTAGE_CURVES = [
  { d: "M0 35 C15 32, 30 24, 45 20 C55 17, 65 15, 80 12", opacity: 0.6, delay: 0 },
  { d: "M0 35 C15 30, 30 22, 45 18 C55 14, 65 10, 80 8", opacity: 0.4, delay: 0.3 },
  { d: "M0 35 C15 28, 30 20, 45 16 C55 12, 65 8, 80 5", opacity: 0.25, delay: 0.6 },
];

function AnalyticsVisuals() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-4" aria-hidden="true">
      {/* Portfolio Performance — area chart with traveling dot */}
      <div className="col-span-2 overflow-hidden rounded-lg bg-background/50 p-3">
        <p className="mb-2 text-[10px] font-light uppercase tracking-widest text-text-secondary/50">
          Portfolio Performance
        </p>
        <svg viewBox="0 0 200 60" fill="none" className="w-full">
          <defs>
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${SPARKLINE_PATH} L200 60 L0 60Z`}
            fill="url(#area-grad)"
          />
          <path
            d={SPARKLINE_PATH}
            fill="none"
            stroke="var(--brand-blue)"
            strokeWidth="1.5"
          />
          {/* Traveling glow dot */}
          <circle r="2.5" fill="var(--accent)" opacity="0">
            <animateMotion
              path={SPARKLINE_PATH}
              dur="3s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0;0.9;0.9;0" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Borrowing Base Utilization — animated ring */}
      <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg bg-background/50 p-3">
        <p className="mb-2 text-[10px] font-light uppercase tracking-widest text-text-secondary/50">
          Utilization
        </p>
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          <circle
            cx="24" cy="24" r="18"
            fill="none"
            stroke="var(--border)"
            strokeWidth="3"
          />
          <circle
            cx="24" cy="24" r="18"
            fill="none"
            stroke="var(--brand-blue)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="84.82 113.1"
            transform="rotate(-90 24 24)"
            style={{ animation: "pulse-ring 3s ease-in-out infinite" }}
          />
        </svg>
        <p className="mt-1 text-[10px] font-light text-text-secondary/50">70%</p>
      </div>

      {/* DPD Bucket Bars — staggered grow + breathe */}
      <div className="col-span-2 overflow-hidden rounded-lg bg-background/50 p-3">
        <p className="mb-2 text-[10px] font-light uppercase tracking-widest text-text-secondary/50">
          DPD Buckets
        </p>
        <svg viewBox="0 0 160 36" fill="none" className="w-full">
          {DPD_BARS.map((bar, i) => (
            <rect
              key={bar.label}
              x={bar.x}
              y={bar.y}
              width="20"
              height={bar.h}
              rx="3"
              fill={bar.color}
              opacity="0.6"
              style={{
                transformBox: "fill-box" as React.CSSProperties["transformBox"],
                transformOrigin: "center bottom",
                transform: "scaleY(0)",
                animation: `grow-bar 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.1 * i}s forwards, breathe-bar 3s ease-in-out ${1 + 0.1 * i}s infinite`,
              }}
            />
          ))}
        </svg>
        <div className="mt-1 flex justify-between px-1">
          {DPD_BARS.map((bar) => (
            <span key={bar.label} className="text-[9px] text-text-secondary/40">{bar.label}</span>
          ))}
        </div>
      </div>

      {/* Vintage Curves — shimmer animation */}
      <div className="overflow-hidden rounded-lg bg-background/50 p-3">
        <p className="mb-2 text-[10px] font-light uppercase tracking-widest text-text-secondary/50">
          Vintages
        </p>
        <svg viewBox="0 0 80 40" fill="none" className="w-full">
          {VINTAGE_CURVES.map((curve, i) => (
            <path
              key={i}
              d={curve.d}
              fill="none"
              stroke="var(--brand-blue)"
              strokeWidth="1"
              opacity={curve.opacity}
              style={{
                animation: `curve-shimmer 4s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

const capabilities = [
  {
    icon: BarChart3,
    title: "Data & Analytics",
    description:
      "Real-time portfolio monitoring, risk analysis, and performance attribution. We turn complex loan-level data into clear, actionable dashboards for investment decision-makers.",
    tags: ["Portfolio Analytics", "Risk Modeling", "Reporting"],
    span: "md:col-span-2 md:row-span-2",
    visual: true,
  },
  {
    icon: Server,
    title: "Infrastructure",
    description:
      "Cloud-native environments engineered for institutional-scale data workloads. Automated provisioning, high availability, and enterprise-grade reliability.",
    tags: ["Cloud", "CI/CD", "Automation"],
    span: "",
    visual: false,
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description:
      "Comprehensive governance, risk, and compliance frameworks protecting sensitive financial data at every layer.",
    tags: ["GRC", "Data Protection", "Compliance"],
    span: "",
    visual: false,
  },
  {
    icon: Brain,
    title: "Quantitative Research",
    description:
      "Machine learning models and statistical analysis powering credit assessment, pricing, and portfolio construction.",
    tags: ["ML/AI", "Python", "Research"],
    span: "md:col-span-2",
    visual: false,
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <p className="text-xs font-light uppercase tracking-[0.3em] text-brand-blue">
              Capabilities
            </p>
          </ScrollReveal>
          <TextReveal
            as="h2"
            className="mt-4 text-3xl font-light tracking-tight text-text-primary md:text-5xl lg:text-6xl"
          >
            Full-Stack Technology for Finance
          </TextReveal>
        </div>

        {/* Bento Grid */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <ScrollReveal key={cap.title} delay={i * 0.08} className={cap.span}>
              <TiltCard className="card-surface h-full">
                <div className="p-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/8">
                    <cap.icon className="h-5 w-5 text-brand-blue" />
                  </div>
                  <h3 className="mt-5 text-xl font-medium text-text-primary">
                    {cap.title}
                  </h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-text-secondary">
                    {cap.description}
                  </p>
                  {cap.visual && <AnalyticsVisuals />}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
