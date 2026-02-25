"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

const GLARE_CENTER = { x: 50, y: 50, opacity: 0 };
const TILT_ORIGIN = 0.5;

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  perspective?: number;
  glareOpacity?: number;
  scale?: number;
}

export function TiltCard({
  children,
  className,
  tiltAmount = 10,
  perspective = 1000,
  glareOpacity = 0.15,
  scale = 1.02,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState(GLARE_CENTER);
  const [isHovering, setIsHovering] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (TILT_ORIGIN - y) * tiltAmount;
      const rotateY = (x - TILT_ORIGIN) * tiltAmount;
      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
      );
      setGlare({ x: x * 100, y: y * 100, opacity: glareOpacity });
    },
    [tiltAmount, perspective, glareOpacity, scale, reducedMotion]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("");
    setGlare(GLARE_CENTER);
    setIsHovering(false);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-surface transition-transform duration-300 ease-out",
        className
      )}
      style={{
        transform: transform || undefined,
        transformStyle: "preserve-3d",
        willChange: isHovering ? "transform" : "auto",
      }}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
        }}
      />
    </div>
  );
}
