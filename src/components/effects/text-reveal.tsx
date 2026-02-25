"use client";

import { useRef, useEffect } from "react";

const REVEAL_Y_OFFSET = 40;
const INITIAL_ROTATE_X = -60;
const INITIAL_BLUR_PX = 4;
const ANIMATION_DURATION = 0.7;

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  splitBy?: "words" | "lines";
  direction?: "up" | "down";
  stagger?: number;
}

export function TextReveal({
  children,
  className,
  as: Tag = "h2",
  delay = 0,
  splitBy = "words",
  direction = "up",
  stagger = 0.03,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctx: { revert: () => void } | null = null;
    let split: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { SplitText } = await import("gsap/SplitText");

      gsap.registerPlugin(ScrollTrigger, SplitText);

      if (cancelled) return;

      const s = new SplitText(el, { type: splitBy });
      split = s;

      const targets = splitBy === "words" ? s.words : s.lines;
      if (!targets || targets.length === 0) return;

      const yFrom = direction === "up" ? REVEAL_Y_OFFSET : -REVEAL_Y_OFFSET;

      const gsapCtx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: yFrom, rotateX: INITIAL_ROTATE_X, filter: `blur(${INITIAL_BLUR_PX}px)` },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            stagger,
            duration: ANIMATION_DURATION,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
      }, el);

      if (cancelled) {
        gsapCtx.revert();
        s.revert();
        return;
      }
      ctx = gsapCtx;
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
      if (split) split.revert();
    };
  }, [delay, splitBy, direction, stagger]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{ perspective: "800px" }}
    >
      {children}
    </Tag>
  );
}
