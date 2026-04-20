"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { MovingBorder } from "@/components/effects/moving-border";
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

// Cumulative charge-off % vs months-on-book for three origination cohorts.
// 80x40 viewport: x 0..80 = 0..36 MOB, y 0..40 = 6%..0% (inverted).
// Matures 2022 > 2023 > 2024 cohort, as real vintages would.
const VINTAGE_XS = [0, 14, 28, 42, 56, 68, 80];
const vintagePath = (pct: number[]) =>
  pct.map((p, i) => `${i === 0 ? "M" : "L"}${VINTAGE_XS[i]} ${40 - (p / 6) * 40}`).join(" ");
const VINTAGES_MINI = [
  { label: "'22", color: "#60a5fa", d: vintagePath([0, 0.6, 1.4, 2.4, 3.2, 3.8, 4.2]) },
  { label: "'23", color: "#a78bfa", d: vintagePath([0, 0.5, 1.2, 2.0, 2.5, 2.6, 2.6]) },
  { label: "'24", color: "#2dd4bf", d: vintagePath([0, 0.3, 0.7, 1.1, 1.1, 1.1, 1.1]), dashed: true },
];

function AnalyticsVisuals() {
  return (
    <div
      className="analytics-visuals mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
      aria-hidden="true"
    >
      <div className="sm:col-span-2 overflow-hidden rounded-lg bg-background/50 p-3">
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
          <path d={`${SPARKLINE_PATH} L200 60 L0 60Z`} fill="url(#area-grad)" />
          <path d={SPARKLINE_PATH} fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" />
          <circle r="2.5" fill="var(--accent)" opacity="0">
            <animateMotion path={SPARKLINE_PATH} dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0.9;0" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg bg-background/50 p-3">
        <p className="mb-2 text-[10px] font-light uppercase tracking-widest text-text-secondary/50">
          Utilization
        </p>
        <svg viewBox="0 0 48 48" className="h-12 w-12">
          <circle cx="24" cy="24" r="18" fill="none" stroke="var(--border)" strokeWidth="3" />
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

      <div className="sm:col-span-2 overflow-hidden rounded-lg bg-background/50 p-3">
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

      <div className="overflow-hidden rounded-lg bg-background/50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-light uppercase tracking-widest text-text-secondary/50">
            Vintages
          </p>
          <span className="font-mono text-[8px] text-text-secondary/40">cum. loss %</span>
        </div>
        <svg viewBox="0 0 80 40" fill="none" className="w-full">
          {[2, 4].map((pct) => (
            <line
              key={pct}
              x1="0"
              x2="80"
              y1={40 - (pct / 6) * 40}
              y2={40 - (pct / 6) * 40}
              stroke="var(--border)"
              strokeWidth="0.3"
              strokeDasharray="1.5 2"
              opacity="0.6"
            />
          ))}
          {VINTAGES_MINI.map((v) => (
            <path
              key={v.label}
              d={v.d}
              fill="none"
              stroke={v.color}
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray={v.dashed ? "2 2" : undefined}
              opacity="0.9"
            />
          ))}
        </svg>
        <div className="mt-1 flex gap-2">
          {VINTAGES_MINI.map((v) => (
            <div key={v.label} className="flex items-center gap-1">
              <span className="h-0.5 w-2 rounded-full" style={{ backgroundColor: v.color }} />
              <span className="font-mono text-[8px] text-text-secondary/60">{v.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Quant visuals ──────────────────────────────────────────────────────────
// Three-panel row for the full-width Quant card.

// SHAP-style feature importance — which inputs actually drive the PD model.
// Ordered descending. Values are mean |SHAP| contributions normalized 0-1.
const FEATURE_IMPORTANCE = [
  { name: "dpd_30d",       value: 1.00 },
  { name: "utilization",   value: 0.78 },
  { name: "pay_velocity",  value: 0.61 },
  { name: "loan_age",      value: 0.44 },
  { name: "fico",          value: 0.31 },
  { name: "sector",        value: 0.18 },
];

function FeatureImportance() {
  return (
    <div className="overflow-hidden rounded-lg bg-background/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-light uppercase tracking-widest text-text-secondary/50">
          PD Model — Feature Importance
        </p>
        <span className="font-mono text-[9px] text-text-secondary/50">|SHAP|</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {FEATURE_IMPORTANCE.map((f, i) => (
          <div key={f.name} className="grid grid-cols-[70px_1fr_28px] items-center gap-2">
            <span className="font-mono text-[9px] text-text-secondary/70">{f.name}</span>
            <div className="h-2 overflow-hidden rounded-full bg-border/40">
              <div
                className="h-full rounded-full bg-brand-blue/80"
                style={{
                  width: "0%",
                  animation: `fi-grow 0.9s cubic-bezier(.22,1,.36,1) ${0.05 + i * 0.08}s forwards`,
                  ["--fi-target" as string]: `${(f.value * 100).toFixed(0)}%`,
                }}
              />
            </div>
            <span className="text-right font-mono text-[9px] text-text-secondary/60">
              {f.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Calibration diagram — predicted PD vs observed default rate across 10
// deciles. Perfect calibration tracks the y=x diagonal. Slight convexity
// below the line is typical of a well-calibrated production scorecard
// (Basel AIRB requires this to be monitored).
// SVG 200x60. x: 0..200 = predicted PD 0..20%, y: 0..60 = observed 20%..0%.
const CALIB_BINS: { x: number; y: number }[] = [
  { x: 0.01, y: 0.008 },
  { x: 0.03, y: 0.028 },
  { x: 0.05, y: 0.052 },
  { x: 0.07, y: 0.068 },
  { x: 0.09, y: 0.094 },
  { x: 0.11, y: 0.108 },
  { x: 0.13, y: 0.135 },
  { x: 0.15, y: 0.149 },
  { x: 0.17, y: 0.172 },
  { x: 0.19, y: 0.188 },
];
// Map to viewport: 20% max on each axis
const cx = (p: number) => (p / 0.2) * 200;
const cy = (p: number) => 60 - (p / 0.2) * 60;
const calibPath = CALIB_BINS
  .map((b, i) => `${i === 0 ? "M" : "L"}${cx(b.x)} ${cy(b.y)}`)
  .join(" ");

function CalibrationChart() {
  return (
    <div className="overflow-hidden rounded-lg bg-background/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-light uppercase tracking-widest text-text-secondary/50">
          PD Calibration
        </p>
        <span className="font-mono text-[9px] text-emerald-400/80">Brier 0.041</span>
      </div>
      <svg viewBox="0 0 200 60" fill="none" className="w-full">
        {/* Perfect calibration diagonal y=x */}
        <line
          x1="0" y1="60" x2="200" y2="0"
          stroke="var(--border)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          opacity="0.7"
        />
        {/* ±2pp tolerance band around the diagonal */}
        <path
          d="M0 60 L200 0 L200 6 L0 60 Z"
          fill="var(--brand-blue)"
          opacity="0.05"
        />
        <path
          d="M0 60 L0 54 L200 0 L200 0 Z"
          fill="var(--brand-blue)"
          opacity="0.05"
        />
        {/* Calibration curve */}
        <path
          d={calibPath}
          fill="none"
          stroke="var(--brand-blue)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Points */}
        {CALIB_BINS.map((b, i) => (
          <circle
            key={i}
            cx={cx(b.x)}
            cy={cy(b.y)}
            r="1.8"
            fill="var(--accent)"
            opacity="0.85"
          />
        ))}
      </svg>
      <div className="mt-1.5 flex items-center justify-between font-mono text-[8px] text-text-secondary/50">
        <span>0%</span>
        <span>predicted → observed PD</span>
        <span>20%</span>
      </div>
    </div>
  );
}

function FormulaTerminal() {
  return (
    <div className="overflow-hidden rounded-lg border border-border/40 bg-background/60">
      <div className="flex items-center gap-1.5 border-b border-border/40 px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-red-400/50" />
        <span className="h-2 w-2 rounded-full bg-amber-400/50" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/50" />
        <span className="ml-2 font-mono text-[9px] text-text-secondary/40">
          scorecard.py
        </span>
      </div>
      <pre className="overflow-hidden p-3 font-mono text-[10px] leading-relaxed text-text-secondary/70">
{`# Logistic scorecard — PD per loan
pd  = σ(β₀ + β·x)

# Basel expected loss
el  = pd × lgd × ead

# Portfolio-weighted 12-mo ECL
ecl = Σ wᵢ · pdᵢ · lgdᵢ · eadᵢ`}
      </pre>
    </div>
  );
}

function QuantVisuals() {
  return (
    <div
      className="mt-6 grid grid-cols-1 gap-4 lg:mt-0 lg:grid-cols-3"
      aria-hidden="true"
    >
      <FormulaTerminal />
      <FeatureImportance />
      <CalibrationChart />
    </div>
  );
}

const capabilities = [
  {
    icon: BarChart3,
    title: "Data & Analytics",
    description:
      "We independently re-derive DPD, borrowing base, and covenant calculations from raw source data and reconcile against servicer reports. Discrepancies surface in the dashboard, not in month-end. Daily, loan-level, auditable.",
    tags: ["Independent Verification", "Portfolio Analytics", "Reconciliation"],
    span: "md:col-span-2 md:row-span-2",
    visual: "analytics",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description:
      "Cloud-native pipelines running daily reconciliation across loan servicers, multiple banks (BAI2, ACH, wire), payment processors, and market feeds (SOFR, FX). Built for scale without proportional headcount growth.",
    tags: ["Azure", "CI/CD", "IaC"],
    span: "",
    visual: null,
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description:
      "Security and compliance engineering for an SEC-registered investment adviser. Identity, access, and data-protection controls hardened for the regulatory environment we operate in.",
    tags: ["SEC Registered", "IAM", "Data Protection"],
    span: "",
    visual: null,
  },
  {
    icon: Brain,
    title: "Quantitative Research & Engineering",
    description:
      "Credit scorecards for probability of default, feature attribution showing what's actually driving risk, and calibration monitoring so predicted PDs match realized defaults in production. The investment team sees what the model sees.",
    tags: ["Python", "Scorecards", "Expected Loss", "Calibration"],
    span: "md:col-span-3",
    visual: "quant",
  },
];

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-text-secondary">
      {label}
    </span>
  );
}

export function Capabilities() {
  return (
    <section id="capabilities" className="relative overflow-hidden py-40 md:py-56">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <p className="text-xs font-light uppercase tracking-[0.3em] text-brand-blue">
              Capabilities
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              Full-Stack Technology for Specialty Finance
            </h2>
          </ScrollReveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {capabilities.map((cap, i) => {
            const isQuant = cap.visual === "quant";
            return (
              <ScrollReveal
                key={cap.title}
                delay={Math.min(i * 0.08, 0.24)}
                className={cap.span}
              >
                <MovingBorder
                  containerClassName="h-full"
                  className="card-surface h-full p-8"
                  duration={`${5 + i * 0.7}s`}
                >
                  {isQuant ? (
                    // Side-by-side: copy left, 3-panel visuals right
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(260px,1fr)_2fr] lg:items-center">
                      <div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/8">
                          <cap.icon className="h-5 w-5 text-brand-blue" />
                        </div>
                        <h3 className="mt-5 text-xl font-medium text-text-primary">
                          {cap.title}
                        </h3>
                        <p className="mt-3 text-sm font-light leading-relaxed text-text-secondary">
                          {cap.description}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {cap.tags.map((tag) => (
                            <Tag key={tag} label={tag} />
                          ))}
                        </div>
                      </div>
                      <QuantVisuals />
                    </div>
                  ) : (
                    <>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/8">
                        <cap.icon className="h-5 w-5 text-brand-blue" />
                      </div>
                      <h3 className="mt-5 text-xl font-medium text-text-primary">
                        {cap.title}
                      </h3>
                      <p className="mt-3 text-sm font-light leading-relaxed text-text-secondary">
                        {cap.description}
                      </p>
                      {cap.visual === "analytics" && <AnalyticsVisuals />}
                      <div className="mt-6 flex flex-wrap gap-2">
                        {cap.tags.map((tag) => (
                          <Tag key={tag} label={tag} />
                        ))}
                      </div>
                    </>
                  )}
                </MovingBorder>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
