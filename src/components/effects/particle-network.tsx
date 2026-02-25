"use client";

import { useRef, useEffect, useCallback } from "react";

const MAX_INITIAL_VELOCITY = 0.3;
const MIN_PARTICLE_RADIUS = 0.5;
const PARTICLE_RADIUS_RANGE = 1.2;
const MOBILE_BREAKPOINT = 768;
const VELOCITY_DAMPING = 0.99;
const CONNECTION_MAX_OPACITY = 0.12;
const CONNECTION_LINE_WIDTH = 0.5;
const MOUSE_OFFSCREEN = -9999;
const DESKTOP_PARTICLE_COUNT = 50;
const MOBILE_PARTICLE_COUNT = 25;

interface ParticleNetworkProps {
  connectionDistance?: number;
  mouseRadius?: number;
  mouseForce?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function ParticleNetwork({
  connectionDistance = 120,
  mouseRadius = 100,
  mouseForce = 0.015,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: MOUSE_OFFSCREEN, y: MOUSE_OFFSCREEN });
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const reducedMotionRef = useRef(false);

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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const count = isMobile ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
    const connDist = connectionDistance;
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
      resize();
      particlesRef.current = initParticles(
        sizeRef.current.w,
        sizeRef.current.h,
        count
      );
    });
    ro.observe(canvas);

    // Cache mouse position from canvas rect — avoid getBoundingClientRect on every move
    let canvasLeft = 0;
    let canvasTop = 0;
    const updateCanvasPos = () => {
      const rect = canvas.getBoundingClientRect();
      canvasLeft = rect.left;
      canvasTop = rect.top;
    };
    updateCanvasPos();
    // Update cached position on scroll/resize, not on every mousemove
    window.addEventListener("scroll", updateCanvasPos, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX - canvasLeft, y: e.clientY - canvasTop };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: MOUSE_OFFSCREEN, y: MOUSE_OFFSCREEN };
    };

    canvas.addEventListener("mousemove", onMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Pre-compute colors as rgba arrays, not strings parsed per-frame
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
      return {
        particle: particleStr,
        lineRgb: parseRgba(lineStr),
      };
    };

    let colors = getColors();

    const observer = new MutationObserver(() => {
      colors = getColors();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const draw = () => {
      const { w, h } = sizeRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const [lr, lg, lb] = colors.lineRgb;

      ctx.clearRect(0, 0, w, h);

      // Batch all particle dots first, then lines — fewer state changes
      ctx.fillStyle = colors.particle;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reducedMotionRef.current) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdSq = mdx * mdx + mdy * mdy;
          if (mdSq < mRadiusSq && mdSq > 0) {
            const dist = Math.sqrt(mdSq);
            const force = ((mRadius - dist) / mRadius) * mForce;
            p.vx += (mdx / dist) * force;
            p.vy += (mdy / dist) * force;
          }

          p.vx *= VELOCITY_DAMPING;
          p.vy *= VELOCITY_DAMPING;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw all connection lines with batched lineWidth
      ctx.lineWidth = CONNECTION_LINE_WIDTH;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < connDistSq) {
            const alpha = (1 - Math.sqrt(dSq) / connDist) * CONNECTION_MAX_OPACITY;
            ctx.strokeStyle = `rgba(${lr},${lg},${lb},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      if (!reducedMotionRef.current) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
    if (reducedMotionRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", updateCanvasPos);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [connectionDistance, mouseRadius, mouseForce, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
