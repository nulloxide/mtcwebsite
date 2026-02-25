"use client";

import { useRef, useEffect, useState } from "react";

const ANIMATION_DURATION_MS = 2000;
const INTERSECTION_THRESHOLD = 0.5;

interface AnimatedCounterProps {
  value: string;
  label: string;
  suffix?: string;
}

export function AnimatedCounter({ value, label, suffix = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");
  const hasAnimatedRef = useRef(false);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;

          const numericMatch = value.match(/^(\d+)/);
          if (!numericMatch) {
            setDisplay(value);
            return;
          }

          const target = parseInt(numericMatch[1], 10);
          const rest = value.slice(numericMatch[1].length);
          const startTime = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / ANIMATION_DURATION_MS, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(`${Math.round(eased * target)}${rest}`);
            if (progress < 1) {
              rafIdRef.current = requestAnimationFrame(tick);
            }
          };
          rafIdRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: INTERSECTION_THRESHOLD }
    );

    observer.observe(el);
    return () => {
      cancelAnimationFrame(rafIdRef.current);
      observer.disconnect();
    };
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-6xl font-light text-text-primary md:text-8xl">
        {display}
        <span className="text-brand-blue">{suffix}</span>
      </div>
      <div className="mt-3 text-sm font-light tracking-wide text-text-secondary">{label}</div>
    </div>
  );
}
