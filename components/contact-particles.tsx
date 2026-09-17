"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: 0 | 1 };

/** Particles that drift from the edges toward the centre and fade as they arrive. */
export function ContactParticles({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const COUNT = 90;
    const ps: P[] = [];

    function spawn(p?: P): P {
      const side = Math.random();
      let x: number;
      let y: number;
      if (side < 0.5) {
        x = Math.random() < 0.5 ? -10 : w + 10;
        y = Math.random() * h;
      } else {
        x = Math.random() * w;
        y = Math.random() < 0.5 ? -10 : h + 10;
      }
      const max = 380 + Math.random() * 300;
      const np: P = p ?? { x, y, vx: 0, vy: 0, life: 0, max, r: 0.8 + Math.random() * 1.4, c: Math.random() < 0.7 ? 0 : 1 };
      np.x = x;
      np.y = y;
      np.vx = 0;
      np.vy = 0;
      np.life = 0;
      np.max = max;
      return np;
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame() {
      if (!visible) return;
      ctx!.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      for (const p of ps) {
        const dx = cx - p.x;
        const dy = cy - p.y;
        const d = Math.hypot(dx, dy) + 0.001;
        // Attraction plus a gentle tangential swirl.
        p.vx += (dx / d) * 0.035 + (-dy / d) * 0.012;
        p.vy += (dy / d) * 0.035 + (dx / d) * 0.012;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        const arrive = Math.max(0, 1 - 90 / d);
        const alpha = Math.min(1, p.life / 40) * arrive * (1 - p.life / p.max);
        if (p.life > p.max || d < 60) {
          spawn(p);
          continue;
        }
        ctx!.fillStyle = p.c === 0 ? `rgb(124 140 255 / ${alpha})` : `rgb(79 227 193 / ${alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    for (let i = 0; i < COUNT; i++) {
      const p = spawn();
      // Pre-advance so the field is populated on first paint.
      p.x += (w / 2 - p.x) * Math.random() * 0.8;
      p.y += (h / 2 - p.y) * Math.random() * 0.8;
      p.life = Math.floor(Math.random() * 200);
      ps.push(p);
    }

    if (reduced) {
      // Static scatter.
      for (const p of ps) {
        ctx.fillStyle = p.c === 0 ? "rgb(124 140 255 / 0.4)" : "rgb(79 227 193 / 0.4)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([e]) => {
        const was = visible;
        visible = e.isIntersecting;
        if (visible && !was) raf = requestAnimationFrame(frame);
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
