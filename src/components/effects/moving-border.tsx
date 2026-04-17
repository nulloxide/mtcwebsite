"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MovingBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  duration?: string;
  borderRadius?: string;
}

export function MovingBorder({
  children,
  className,
  containerClassName,
  duration = "4s",
  borderRadius = "1rem",
}: MovingBorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden p-px", containerClassName)}
      style={{
        borderRadius,
        animation:
          animate && visible ? `rotate-border ${duration} linear infinite` : "none",
        background: `conic-gradient(from var(--border-angle), transparent 30%, var(--brand-blue) 50%, transparent 70%)`,
      }}
    >
      <div
        className={cn("relative bg-surface", className)}
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        {children}
      </div>
    </div>
  );
}
