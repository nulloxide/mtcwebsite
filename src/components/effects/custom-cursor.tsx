"use client";

import { useEffect, useRef, useState } from "react";
import { loadGsap } from "@/lib/gsap";

const DOT_SIZE = 8;
const RING_SIZE = 40;
const DOT_OFFSET = DOT_SIZE / 2;
const RING_OFFSET = RING_SIZE / 2;
const DOT_FOLLOW_DURATION = 0.1;
const RING_FOLLOW_DURATION = 0.4;
const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, textarea, label";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(mql.matches && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const gsap = await loadGsap();
      if (cancelled) return;

      const dotX = gsap.quickTo(dot, "x", { duration: DOT_FOLLOW_DURATION, ease: "power2.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: DOT_FOLLOW_DURATION, ease: "power2.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: RING_FOLLOW_DURATION, ease: "power2.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: RING_FOLLOW_DURATION, ease: "power2.out" });

      const onMove = (e: MouseEvent) => {
        dotX(e.clientX - DOT_OFFSET);
        dotY(e.clientY - DOT_OFFSET);
        ringX(e.clientX - RING_OFFSET);
        ringY(e.clientY - RING_OFFSET);
      };

      const onOverCapture = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest(INTERACTIVE_SELECTOR)) ring.classList.add("hovering");
      };
      const onOutCapture = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest(INTERACTIVE_SELECTOR)) ring.classList.remove("hovering");
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseover", onOverCapture, { passive: true });
      document.addEventListener("mouseout", onOutCapture, { passive: true });

      cleanup = () => {
        window.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseover", onOverCapture);
        document.removeEventListener("mouseout", onOutCapture);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
