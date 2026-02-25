"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

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

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // gsap.quickTo creates a reusable tween — no allocation per mousemove
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

    const onEnter = () => ring.classList.add("hovering");
    const onLeave = () => ring.classList.remove("hovering");

    window.addEventListener("mousemove", onMove, { passive: true });

    const onOverCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        onEnter();
      }
    };
    const onOutCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE_SELECTOR)) {
        onLeave();
      }
    };

    document.addEventListener("mouseover", onOverCapture, { passive: true });
    document.addEventListener("mouseout", onOutCapture, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOverCapture);
      document.removeEventListener("mouseout", onOutCapture);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring hidden md:block" aria-hidden="true" />
    </>
  );
}
