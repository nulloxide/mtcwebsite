"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

const MAGNETIC_STRENGTH = 0.25;

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, className, href, onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * MAGNETIC_STRENGTH;
    const y = (e.clientY - rect.top - rect.height / 2) * MAGNETIC_STRENGTH;
    setTransform({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => setTransform({ x: 0, y: 0 }), []);

  const Tag = href ? "a" : "button";

  return (
    <Tag
      ref={ref as React.Ref<HTMLAnchorElement & HTMLButtonElement>}
      type={!href ? "button" : undefined}
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-500 ease-out will-change-transform",
        className
      )}
      style={{
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }}
    >
      {children}
    </Tag>
  );
}
