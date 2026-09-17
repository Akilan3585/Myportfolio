"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Pod labels come straight from the stack on the résumé. */
const POD_LABELS = [
  "react",
  "node",
  "express",
  "mongodb",
  "nextjs",
  "postgres",
  "prometheus",
  "grafana",
  "argocd",
  "gitlab-ci",
  "docker",
  "linux",
];

type N = { x: number; y: number; z: number; kind: "cp" | "worker" | "pod"; label?: string; heat: number };
type Edge = [number, number];
type Pulse = { edge: number; t: number; speed: number; stage: 0 | 1 };

/**
 * A rotating Kubernetes-style cluster: a control plane on top, a ring of worker
 * nodes, and an outer ring of pods. Deploy pulses travel control plane → worker →
 * pod and light the pod up when they land. Reacts to pointer position, pauses
 * off-screen, and renders a single static frame under reduced motion.
 */
export function HeroGraphic({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const WORKERS = 3;
    const PODS = POD_LABELS.length;
    const nodes: N[] = [{ x: 0, y: 0.62, z: 0, kind: "cp", label: "control plane", heat: 0 }];
    for (let i = 0; i < WORKERS; i++) {
      const a = (i / WORKERS) * Math.PI * 2;
      nodes.push({ x: Math.cos(a) * 0.5, y: 0.05, z: Math.sin(a) * 0.5, kind: "worker", label: `worker-${i + 1}`, heat: 0 });
    }
    for (let j = 0; j < PODS; j++) {
      const a = (j / PODS) * Math.PI * 2 + Math.PI / PODS;
      const wobble = j % 2 === 0 ? -0.5 : -0.42;
      nodes.push({ x: Math.cos(a) * 0.98, y: wobble, z: Math.sin(a) * 0.98, kind: "pod", label: POD_LABELS[j], heat: 0 });
    }

    const edges: Edge[] = [];
    for (let i = 0; i < WORKERS; i++) edges.push([0, 1 + i]);
    const perWorker = PODS / WORKERS;
    for (let j = 0; j < PODS; j++) {
      // Pods sit between two workers; attach each to the nearest one by angle.
      const w = Math.round((j + 0.5) / perWorker) % WORKERS;
      edges.push([1 + w, 1 + WORKERS + j]);
    }

    const pulses: Pulse[] = Array.from({ length: 6 }, (_, k) => ({
      edge: k % WORKERS,
      t: (k * 0.31) % 1,
      speed: 0.008 + (k % 3) * 0.002,
      stage: 0,
    }));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let visible = true;
    let rotY = 0.6;
    let rotX = 0.42;
    let targetRotX = 0.42;
    let yOffset = 0;
    let targetYOffset = 0;
    let lastT = performance.now();

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#3ec8b8";
    const accent2 = styles.getPropertyValue("--accent-2").trim() || "#ffb454";
    const text = styles.getPropertyValue("--text").trim() || "#e9edf5";
    const mono = styles.getPropertyValue("--font-geist-mono").trim() || "ui-monospace";

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(x: number, y: number, z: number, ry: number, rx: number) {
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const R = Math.min(width, height) * 0.37;
      const f = 3.4;
      const scale = f / (f + z2);
      return { x: width / 2 + x1 * R * scale, y: height / 2 - y2 * R * scale, s: scale, z: z2 };
    }

    function hexagon(cx: number, cy: number, r: number) {
      ctx!.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      }
      ctx!.closePath();
    }

    function ring(y: number, radius: number, ry: number, rx: number, alpha: number) {
      ctx!.beginPath();
      const steps = 72;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const p = project(Math.cos(a) * radius, y, Math.sin(a) * radius, ry, rx);
        if (i === 0) ctx!.moveTo(p.x, p.y);
        else ctx!.lineTo(p.x, p.y);
      }
      ctx!.strokeStyle = `rgb(233 237 245 / ${alpha})`;
      ctx!.lineWidth = 1;
      ctx!.setLineDash([2, 6]);
      ctx!.stroke();
      ctx!.setLineDash([]);
    }

    function label(txt: string, x: number, y: number, s: number, alpha: number, tone: string) {
      ctx!.font = `500 ${9.5 + s * 2}px ${mono}, ui-monospace, monospace`;
      const w = ctx!.measureText(txt).width;
      // Keep the label inside the canvas: flip to the left near the right edge.
      let px = x + 9;
      if (px + w + 6 > width) px = x - w - 9;
      if (px < 6) px = 6;
      const py = Math.max(14, y - 9);
      ctx!.fillStyle = `rgb(6 8 15 / ${0.8 * alpha})`;
      ctx!.strokeStyle = `color-mix(in srgb, ${tone} ${Math.round(40 * alpha)}%, transparent)`;
      ctx!.beginPath();
      ctx!.roundRect(px - 5, py - 10, w + 10, 15, 4);
      ctx!.fill();
      ctx!.stroke();
      ctx!.fillStyle = `rgb(233 237 245 / ${alpha})`;
      ctx!.fillText(txt, px, py + 1);
    }

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(48, now - lastT) / 16.67;
      lastT = now;

      if (!reduced) {
        rotY += 0.0028 * dt + yOffset * 0.0009;
        rotX += (targetRotX - rotX) * 0.05;
        yOffset += (targetYOffset - yOffset) * 0.05;
      }

      const scroll = window.scrollY;
      const parallax = Math.min(scroll * 0.12, 160);
      const fade = Math.max(0, 1 - scroll / 900);

      ctx!.clearRect(0, 0, width, height);
      ctx!.save();
      ctx!.translate(0, parallax * 0.5);
      ctx!.globalAlpha = fade;

      // Orbit guides
      ring(0.05, 0.5, rotY, rotX, 0.12);
      ring(-0.46, 0.98, rotY, rotX, 0.1);

      const P = nodes.map((n) => project(n.x, n.y, n.z, rotY, rotX));

      // Edges
      for (let e = 0; e < edges.length; e++) {
        const [a, b] = edges[e];
        const pa = P[a];
        const pb = P[b];
        const depth = (pa.s + pb.s) / 2;
        const hot = Math.max(nodes[a].heat, nodes[b].heat);
        ctx!.strokeStyle = `rgb(62 200 184 / ${0.08 + depth * 0.18 + hot * 0.4})`;
        ctx!.lineWidth = 1 + hot * 0.6;
        ctx!.beginPath();
        ctx!.moveTo(pa.x, pa.y);
        ctx!.lineTo(pb.x, pb.y);
        ctx!.stroke();
      }

      // Pulses (deploy rollouts): control plane → worker → pod
      if (!reduced) {
        for (const p of pulses) {
          p.t += p.speed * dt;
          if (p.t > 1) {
            p.t = 0;
            const [, end] = edges[p.edge];
            if (p.stage === 0) {
              // Continue to a pod under this worker.
              const next = edges.map((ed, i) => ({ ed, i })).filter(({ ed, i }) => i >= WORKERS && ed[0] === end);
              const pick = next[Math.floor(Math.random() * next.length)];
              if (pick) {
                p.edge = pick.i;
                p.stage = 1;
              }
            } else {
              nodes[end].heat = 1;
              p.edge = Math.floor(Math.random() * WORKERS);
              p.stage = 0;
            }
          }
          const [a, b] = edges[p.edge];
          const from = P[a];
          const to = P[b];
          const x = from.x + (to.x - from.x) * p.t;
          const y = from.y + (to.y - from.y) * p.t;
          const s = from.s + (to.s - from.s) * p.t;
          ctx!.fillStyle = accent2;
          ctx!.shadowColor = accent2;
          ctx!.shadowBlur = 12 * s;
          ctx!.beginPath();
          ctx!.arc(x, y, 1.9 * s + 0.6, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.shadowBlur = 0;
        }
      }

      // Nodes, back to front
      const order = P.map((p, i) => ({ p, i })).sort((a, b) => a.p.z - b.p.z);
      for (const { p, i } of order) {
        const n = nodes[i];
        n.heat = Math.max(0, n.heat - 0.02 * dt);
        const depthAlpha = Math.max(0.3, Math.min(1, (p.s - 0.7) * 2.4));

        if (n.kind === "pod") {
          const r = 4.5 + p.s * 3;
          hexagon(p.x, p.y, r);
          ctx!.fillStyle = `rgb(6 8 15 / 0.9)`;
          ctx!.fill();
          ctx!.strokeStyle = `color-mix(in srgb, ${accent} ${Math.round(55 + n.heat * 45)}%, transparent)`;
          ctx!.lineWidth = 1.2;
          ctx!.stroke();
          hexagon(p.x, p.y, r * 0.45);
          ctx!.fillStyle = n.heat > 0 ? `color-mix(in srgb, ${accent2} ${Math.round(n.heat * 100)}%, ${accent})` : accent;
          ctx!.globalAlpha = fade * (0.55 + n.heat * 0.45);
          ctx!.fill();
          ctx!.globalAlpha = fade;
          if (p.s > 0.9 && n.label) label(n.label, p.x, p.y, p.s, depthAlpha, accent);
        } else if (n.kind === "worker") {
          const r = 8 + p.s * 4;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgb(6 8 15 / 0.95)`;
          ctx!.fill();
          ctx!.strokeStyle = `rgb(233 237 245 / ${0.35 + p.s * 0.3})`;
          ctx!.lineWidth = 1.2;
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r * 0.35, 0, Math.PI * 2);
          ctx!.fillStyle = text;
          ctx!.fill();
          if (n.label) label(n.label, p.x, p.y, p.s, depthAlpha, text);
        } else {
          const r = 16 + p.s * 6;
          const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.2);
          grad.addColorStop(0, `rgb(62 200 184 / 0.5)`);
          grad.addColorStop(1, `rgb(62 200 184 / 0)`);
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r * 2.2, 0, Math.PI * 2);
          ctx!.fill();
          hexagon(p.x, p.y, r);
          ctx!.fillStyle = `rgb(6 8 15 / 0.95)`;
          ctx!.fill();
          ctx!.strokeStyle = accent;
          ctx!.lineWidth = 1.6;
          ctx!.stroke();
          hexagon(p.x, p.y, r * 0.5);
          ctx!.fillStyle = accent;
          ctx!.fill();
          if (n.label) label(n.label, p.x + 6, p.y - 8, p.s, 1, accent);
        }
      }

      ctx!.restore();

      if (!reduced && visible) raf = requestAnimationFrame(frame);
    }

    function onPointer(e: PointerEvent) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetRotX = 0.42 + ny * 0.4;
      targetYOffset = nx * 1.4;
    }
    function onVisibility() {
      running = !document.hidden;
      if (running && visible && !reduced) {
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) frame(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible && !reduced) {
          lastT = performance.now();
          raf = requestAnimationFrame(frame);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    resize();
    raf = requestAnimationFrame(frame);
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label="Animated Kubernetes cluster: a control plane connected to worker nodes and pods labelled with the technologies Akilan works with"
    />
  );
}
