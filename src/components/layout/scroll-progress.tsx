"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const bar = barRef.current;
      if (!bar) return;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      const pct = dh > 0 ? (window.scrollY / dh) * 100 : 0;
      bar.style.width = pct + "%";
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] h-[2px] w-full"
    >
      <div
        ref={barRef}
        className="h-full bg-brand-blue transition-[width] duration-75 ease-out"
        style={{ width: "0%" }}
      />
    </div>
  );
}
