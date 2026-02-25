"use client";

import { useRef, useEffect, useState } from "react";

const REVEAL_OFFSET_Y = 30;
const REVEAL_OFFSET_X = 40;
const INTERSECTION_THRESHOLD = 0.1;
const INTERSECTION_ROOT_MARGIN = "0px 0px -15% 0px";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.7,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: INTERSECTION_THRESHOLD, rootMargin: INTERSECTION_ROOT_MARGIN }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const getTranslate = () => {
    if (direction === "up") return `translateY(${REVEAL_OFFSET_Y}px)`;
    if (direction === "left") return `translateX(${REVEAL_OFFSET_X}px)`;
    if (direction === "right") return `translateX(-${REVEAL_OFFSET_X}px)`;
    return "none";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : getTranslate(),
        transition: `opacity ${duration}s ease, transform ${duration}s ease`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
