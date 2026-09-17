"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { Pipeline } from "./pipeline";

/**
 * Hero visual: the delivery path as an animated SVG schematic.
 * commit → CI build + scan → image → ArgoCD → cluster (web / api / db) → users,
 * with an observability tap on the cluster. Packets travel along the wires.
 * On small screens it degrades to the vertical Pipeline list.
 */

type Box = { id: string; x: number; y: number; w: number; h: number; label: string; sub: string };

const W = 600;
const H = 400;

const BOXES: Box[] = [
  { id: "commit", x: 16, y: 40, w: 128, h: 56, label: "COMMIT", sub: "git push" },
  { id: "ci", x: 204, y: 40, w: 150, h: 56, label: "CI", sub: "build · test · scan" },
  { id: "image", x: 414, y: 40, w: 170, h: 56, label: "IMAGE", sub: "docker build" },
  { id: "argocd", x: 414, y: 158, w: 170, h: 56, label: "ARGOCD", sub: "gitops sync" },
  { id: "observe", x: 16, y: 318, w: 150, h: 56, label: "OBSERVE", sub: "prometheus · grafana" },
  { id: "users", x: 414, y: 318, w: 170, h: 56, label: "USERS", sub: "https" },
];

const CLUSTER = { x: 16, y: 140, w: 338, h: 148 };
const PODS = [
  { id: "web", x: 34, y: 200, label: "web" },
  { id: "api", x: 138, y: 200, label: "api" },
  { id: "db", x: 242, y: 200, label: "db" },
];
const POD_W = 98;
const POD_H = 44;

// Wires as SVG path strings; packets follow them with animateMotion.
const WIRES: { id: string; d: string; delay: number; dur: number }[] = [
  { id: "w1", d: `M144 68 L204 68`, delay: 0, dur: 1.2 },
  { id: "w2", d: `M354 68 L414 68`, delay: 0.5, dur: 1.2 },
  { id: "w3", d: `M499 96 L499 158`, delay: 1.0, dur: 1.1 },
  { id: "w4", d: `M414 186 L354 186`, delay: 1.6, dur: 1.0 },
  { id: "w5", d: `M499 214 L499 318`, delay: 2.2, dur: 1.3 },
  { id: "w6", d: `M414 346 L354 346 L354 288`, delay: 0.8, dur: 1.6 },
  { id: "w7", d: `M126 288 L126 318`, delay: 1.4, dur: 0.9 },
  { id: "pod1", d: `M132 222 L138 222`, delay: 2.0, dur: 0.7 },
  { id: "pod2", d: `M236 222 L242 222`, delay: 2.5, dur: 0.7 },
];

const STEPS = [
  { label: "Commit", detail: "git push to the repository" },
  { label: "CI build + scan", detail: "Build, test and security scan" },
  { label: "Docker image", detail: "Containerised service" },
  { label: "ArgoCD sync", detail: "GitOps applies the declared state" },
  { label: "Cluster", detail: "web · api · db on Kubernetes (AWS)" },
  { label: "Observe", detail: "Prometheus and Grafana" },
];

function BoxNode({ b }: { b: Box }) {
  return (
    <g>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} fill="var(--surface)" stroke="var(--line-strong)" />
      <rect x={b.x} y={b.y} width={3} height={b.h} fill="var(--accent)" />
      <text x={b.x + 14} y={b.y + 24} fontFamily="var(--font-geist-mono)" fontSize={12} fontWeight={600} fill="var(--text)" letterSpacing={1.4}>
        {b.label}
      </text>
      <text x={b.x + 14} y={b.y + 42} fontFamily="var(--font-geist-mono)" fontSize={10.5} fill="var(--muted)">
        {b.sub}
      </text>
    </g>
  );
}

export function DeliveryDiagram({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();
  const animate = inView && !reduced;

  return (
    <div ref={ref} className={className}>
      <div className="hidden md:block">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Delivery pipeline: commit, CI build and scan, Docker image, ArgoCD sync, Kubernetes cluster with web, api and db pods, users, and observability"
        >
          <defs>
            <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0 L8 4 L0 8 z" fill="var(--line-strong)" />
            </marker>
          </defs>

          {/* Cluster frame */}
          <rect x={CLUSTER.x} y={CLUSTER.y} width={CLUSTER.w} height={CLUSTER.h} rx={6} fill="rgb(123 134 255 / 0.04)" stroke="var(--accent-2)" strokeOpacity={0.55} strokeDasharray="4 4" />
          <text x={CLUSTER.x + 12} y={CLUSTER.y + 18} fontFamily="var(--font-geist-mono)" fontSize={10.5} fill="var(--accent-2)" letterSpacing={1.6}>
            CLUSTER · KUBERNETES ON AWS
          </text>
          <text x={CLUSTER.x + CLUSTER.w - 12} y={CLUSTER.y + 18} textAnchor="end" fontFamily="var(--font-geist-mono)" fontSize={10} fill="var(--faint)">
            ns: default
          </text>

          {/* Pods */}
          {PODS.map((p, i) => (
            <g key={p.id}>
              <rect x={p.x} y={p.y} width={POD_W} height={POD_H} rx={4} fill="var(--bg)" stroke="var(--line-strong)" />
              <circle cx={p.x + 14} cy={p.y + 22} r={3.5} fill="var(--green)" className={animate ? "dot-live" : ""} style={{ animationDelay: `${i * 0.6}s` }} />
              <text x={p.x + 26} y={p.y + 19} fontFamily="var(--font-geist-mono)" fontSize={11.5} fill="var(--text)">
                {p.label}
              </text>
              <text x={p.x + 26} y={p.y + 33} fontFamily="var(--font-geist-mono)" fontSize={9} fill="var(--faint)">
                pod · running
              </text>
            </g>
          ))}

          {/* Wires */}
          {WIRES.map((w) => (
            <path key={w.id} id={w.id} d={w.d} fill="none" stroke="var(--line-strong)" strokeWidth={1.2} markerEnd={w.id.startsWith("pod") ? undefined : "url(#arrow)"} />
          ))}

          {/* Packets */}
          {animate
            ? WIRES.map((w) => (
                <circle key={`${w.id}-pk`} r={2.6} fill={w.id === "w6" ? "var(--amber)" : "var(--accent)"}>
                  <animateMotion dur={`${w.dur}s`} begin={`${w.delay}s`} repeatCount="indefinite" path={w.d} />
                </circle>
              ))
            : null}

          {/* Boxes */}
          {BOXES.map((b) => (
            <BoxNode key={b.id} b={b} />
          ))}

          {/* Small legend */}
          <text x={W - 16} y={H - 8} textAnchor="end" fontFamily="var(--font-geist-mono)" fontSize={9.5} fill="var(--faint)" letterSpacing={1.2}>
            FIG. 01 · DELIVERY PATH
          </text>
        </svg>
      </div>
      <div className="md:hidden">
        <Pipeline steps={STEPS} hue="var(--accent)" compact />
      </div>
    </div>
  );
}
