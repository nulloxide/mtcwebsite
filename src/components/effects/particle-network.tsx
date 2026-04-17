"use client";

import { useRef, useEffect, useCallback, useState } from "react";

const MAX_INITIAL_VELOCITY = 0.25;
const MIN_PARTICLE_RADIUS = 0.6;
const PARTICLE_RADIUS_RANGE = 1.2;
const MOBILE_BREAKPOINT = 768;
const VELOCITY_DAMPING = 0.985;
const MAX_SPEED = 1.2;
const DEFAULT_CONNECTION_MAX_OPACITY = 0.18;
const CONNECTION_LINE_WIDTH = 0.6;
const MOUSE_OFFSCREEN = -9999;
const DESKTOP_PARTICLE_COUNT = 70;
const MOBILE_PARTICLE_COUNT = 32;
const MOUSE_GLOW_RADIUS = 220;

interface ParticleNetworkProps {
  connectionDistance?: number;
  mouseRadius?: number;
  mouseForce?: number;
  /** Whether the canvas should be fixed to the viewport (for use as a global background) */
  fixed?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function ParticleNetwork({
  connectionDistance = 130,
  mouseRadius = 160,
  mouseForce = 0.04,
  fixed = false,
  className,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: MOUSE_OFFSCREEN, y: MOUSE_OFFSCREEN, active: false });
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!reduced);
  }, []);

  const initParticles = useCallback(
    (width: number, height: number, count: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * MAX_INITIAL_VELOCITY,
          vy: (Math.random() - 0.5) * MAX_INITIAL_VELOCITY,
          radius: Math.random() * PARTICLE_RADIUS_RANGE + MIN_PARTICLE_RADIUS,
        });
      }
      return particles;
    },
    []
  );

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const count = isMobile ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
    const connDist = isMobile ? connectionDistance * 0.85 : connectionDistance;
    const connDistSq = connDist * connDist;
    const mRadius = mouseRadius;
    const mRadiusSq = mRadius * mRadius;
    const mForce = mouseForce;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
    };

    resize();
    particlesRef.current = initParticles(sizeRef.current.w, sizeRef.current.h, count);

    const ro = new ResizeObserver(() => {
      const prev = sizeRef.current;
      resize();
      const { w, h } = sizeRef.current;
      if (prev.w === 0 || prev.h === 0) {
        particlesRef.current = initParticles(w, h, count);
        return;
      }
      const sx = w / prev.w;
      const sy = h / prev.h;
      for (const p of particlesRef.current) {
        p.x *= sx;
        p.y *= sy;
      }
    });
    ro.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      // Always fixed or positioned — use viewport coords minus canvas rect
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onPointerLeave = () => {
      mouseRef.current = { x: MOUSE_OFFSCREEN, y: MOUSE_OFFSCREEN, active: false };
    };

    // Listen at window level so the cursor is tracked even when canvas is pointer-events:none
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    const parseRgba = (str: string): [number, number, number, number] => {
      const m = str.match(/[\d.]+/g);
      if (!m || m.length < 3) return [255, 255, 255, 0.5];
      return [
        parseInt(m[0]),
        parseInt(m[1]),
        parseInt(m[2]),
        m.length >= 4 ? parseFloat(m[3]) : 1,
      ];
    };

    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      const particleStr = style.getPropertyValue("--particle-color").trim();
      const lineStr = style.getPropertyValue("--particle-line-color").trim();
      const accentStr = style.getPropertyValue("--accent").trim() || "#0080FF";
      const sizeScaleStr = style.getPropertyValue("--particle-size-scale").trim();
      const lineWidthStr = style.getPropertyValue("--particle-line-width").trim();
      const connStrStr = style
        .getPropertyValue("--particle-connection-strength")
        .trim();
      const sizeScale = parseFloat(sizeScaleStr) || 1;
      const lineWidth = parseFloat(lineWidthStr) || CONNECTION_LINE_WIDTH;
      const connStrength = parseFloat(connStrStr) || DEFAULT_CONNECTION_MAX_OPACITY;
      return {
        particle: particleStr || "rgba(255,255,255,0.5)",
        particleRgb: parseRgba(particleStr),
        lineRgb: parseRgba(lineStr),
        accent: accentStr,
        sizeScale,
        lineWidth,
        connStrength,
      };
    };

    let colors = getColors();

    const themeObserver = new MutationObserver(() => {
      colors = getColors();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Re-read colors on next paint and after a short delay to catch any late CSS application
    const raf1 = requestAnimationFrame(() => {
      colors = getColors();
    });
    const late = window.setTimeout(() => {
      colors = getColors();
    }, 300);

    const draw = () => {
      const { w, h } = sizeRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const [lr, lg, lb] = colors.lineRgb;
      const [pr, pg, pb] = colors.particleRgb;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdSq = mdx * mdx + mdy * mdy;
          if (mdSq < mRadiusSq && mdSq > 0) {
            const dist = Math.sqrt(mdSq);
            const force = ((mRadius - dist) / mRadius) * mForce;
            p.vx += (mdx / dist) * force;
            p.vy += (mdy / dist) * force;
          }
        }

        p.vx *= VELOCITY_DAMPING;
        p.vy *= VELOCITY_DAMPING;

        // Cap speed so interactions don't spiral out
        const speedSq = p.vx * p.vx + p.vy * p.vy;
        if (speedSq > MAX_SPEED * MAX_SPEED) {
          const s = MAX_SPEED / Math.sqrt(speedSq);
          p.vx *= s;
          p.vy *= s;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;

        // Fade in particle with mouse proximity
        let alpha = 1;
        if (mouse.active) {
          const gdx = p.x - mouse.x;
          const gdy = p.y - mouse.y;
          const gdSq = gdx * gdx + gdy * gdy;
          if (gdSq < MOUSE_GLOW_RADIUS * MOUSE_GLOW_RADIUS) {
            const t = 1 - Math.sqrt(gdSq) / MOUSE_GLOW_RADIUS;
            alpha = 1 + t * 1.4;
          }
        }

        ctx.fillStyle =
          alpha > 1
            ? `rgba(${pr},${pg},${pb},${Math.min(1, (colors.particleRgb[3] ?? 1) * alpha)})`
            : colors.particle;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * colors.sizeScale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.lineWidth = colors.lineWidth;
      const connMax = colors.connStrength;
      const connMaxBoosted = Math.min(1, connMax + 0.35);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < connDistSq) {
            let alpha = (1 - Math.sqrt(dSq) / connDist) * connMax;
            if (mouse.active) {
              const mx = (p.x + q.x) * 0.5 - mouse.x;
              const my = (p.y + q.y) * 0.5 - mouse.y;
              const mdSq = mx * mx + my * my;
              if (mdSq < MOUSE_GLOW_RADIUS * MOUSE_GLOW_RADIUS) {
                const t = 1 - Math.sqrt(mdSq) / MOUSE_GLOW_RADIUS;
                alpha = Math.min(connMaxBoosted, alpha + t * 0.35);
              }
            }
            ctx.strokeStyle = `rgba(${lr},${lg},${lb},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(raf1);
      window.clearTimeout(late);
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    };
  }, [enabled, connectionDistance, mouseRadius, mouseForce, initParticles]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={
        fixed
          ? `pointer-events-none fixed inset-0 z-0 h-full w-full ${className ?? ""}`
          : `pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`
      }
      aria-hidden="true"
    />
  );
}
