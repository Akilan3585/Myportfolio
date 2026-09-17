"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { architecture, type ArchNode } from "@/content/resume";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { Section } from "./section";

/**
 * Runtime topology of the systems I build: USER → FRONTEND → (AUTH) → API → DATABASE,
 * running inside a CLUSTER with OBSERVE tapped on. Hover or focus a node to inspect it.
 * On small screens the same nodes are listed vertically with tap-to-expand.
 */

const W = 720;
const H = 380;

type Pos = { x: number; y: number; w: number; h: number };
const POS: Record<string, Pos> = {
  user: { x: 24, y: 160, w: 110, h: 54 },
  frontend: { x: 196, y: 160, w: 130, h: 54 },
  auth: { x: 388, y: 62, w: 120, h: 54 },
  api: { x: 388, y: 160, w: 120, h: 54 },
  database: { x: 570, y: 160, w: 126, h: 54 },
  observe: { x: 388, y: 272, w: 120, h: 54 },
  cluster: { x: 176, y: 30, w: 540, h: 320 },
};

const WIRES: { id: string; d: string; delay: number; dur: number; tone?: string }[] = [
  { id: "a1", d: "M134 187 L196 187", delay: 0, dur: 1.1 },
  { id: "a2", d: "M326 187 L388 187", delay: 0.6, dur: 1.1 },
  { id: "a3", d: "M448 160 L448 116", delay: 1.2, dur: 0.8, tone: "var(--accent-2)" },
  { id: "a4", d: "M508 187 L570 187", delay: 1.7, dur: 1.1 },
  { id: "a5", d: "M448 214 L448 272", delay: 0.9, dur: 0.9, tone: "var(--amber)" },
];

function byId(id: string) {
  return architecture.find((n) => n.id === id)!;
}

export function Architecture() {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const sel = hover ?? pinned;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();
  const animate = inView && !reduced;
  const current: ArchNode | null = sel ? byId(sel) : null;
  const [openMobile, setOpenMobile] = useState<string | null>(null);

  const nodeProps = (id: string) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-pressed": pinned === id,
    "aria-label": `${byId(id).label}: ${byId(id).purpose} ${byId(id).tech}`,
    "data-cursor": "INSPECT",
    onPointerEnter: () => setHover(id),
    onPointerLeave: () => setHover(null),
    onFocus: () => setHover(id),
    onBlur: () => setHover(null),
    onClick: () => setPinned((p) => (p === id ? null : id)),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setPinned((p) => (p === id ? null : id));
      }
    },
    style: { cursor: "pointer", outline: "none" },
  });

  return (
    <Section
      id="architecture"
      index="02b"
      eyebrow="Architecture"
      title="How I think about a system."
      lede="The runtime shape behind every project on this page. It is a way of thinking, not a claim that each project ran on every box."
      note="inspect nodes"
    >
      <div ref={ref} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Diagram (md+) */}
        <div className="panel ticks hidden p-3 md:block lg:col-span-8">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label="System architecture diagram">
            <defs>
              <marker id="arrow2" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 z" fill="var(--line-strong)" />
              </marker>
            </defs>

            {/* Cluster frame */}
            <g {...nodeProps("cluster")}>
              <rect
                {...POS.cluster}
                rx={6}
                fill={sel === "cluster" ? "rgb(123 134 255 / 0.07)" : "rgb(123 134 255 / 0.03)"}
                stroke="var(--accent-2)"
                strokeOpacity={sel === "cluster" ? 1 : 0.5}
                strokeDasharray="4 4"
              />
              <text x={POS.cluster.x + 12} y={POS.cluster.y + 18} fontFamily="var(--font-geist-mono)" fontSize={10.5} fill="var(--accent-2)" letterSpacing={1.6}>
                CLUSTER · DOCKER + KUBERNETES · ARGOCD-SYNCED
              </text>
            </g>

            {/* Wires */}
            {WIRES.map((w) => (
              <path key={w.id} d={w.d} fill="none" stroke="var(--line-strong)" strokeWidth={1.2} markerEnd="url(#arrow2)" />
            ))}
            {animate
              ? WIRES.map((w) => (
                  <circle key={`${w.id}-p`} r={2.6} fill={w.tone ?? "var(--accent)"}>
                    <animateMotion dur={`${w.dur}s`} begin={`${w.delay}s`} repeatCount="indefinite" path={w.d} />
                  </circle>
                ))
              : null}

            {/* Nodes */}
            {architecture
              .filter((n) => n.id !== "cluster")
              .map((n, i) => {
                const p = POS[n.id];
                const active = sel === n.id;
                const tone = n.id === "auth" ? "var(--accent-2)" : n.id === "observe" ? "var(--amber)" : "var(--accent)";
                return (
                  <motion.g
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    {...nodeProps(n.id)}
                  >
                    <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={4} fill={active ? "var(--surface-2)" : "var(--bg)"} stroke={active ? tone : "var(--line-strong)"} />
                    <rect x={p.x} y={p.y} width={3} height={p.h} fill={tone} />
                    <text x={p.x + 14} y={p.y + 23} fontFamily="var(--font-geist-mono)" fontSize={12} fontWeight={600} fill="var(--text)" letterSpacing={1.4}>
                      {n.label}
                    </text>
                    <text x={p.x + 14} y={p.y + 41} fontFamily="var(--font-geist-mono)" fontSize={10} fill="var(--muted)">
                      {n.tech.split(" · ")[0]}
                    </text>
                  </motion.g>
                );
              })}
            <text x={W - 14} y={H - 8} textAnchor="end" fontFamily="var(--font-geist-mono)" fontSize={9.5} fill="var(--faint)" letterSpacing={1.2}>
              FIG. 02 · RUNTIME TOPOLOGY
            </text>
          </svg>
        </div>

        {/* Detail panel (md+) */}
        <div className="hidden md:block lg:col-span-4">
          <div className="panel ticks sticky top-20 min-h-[220px] p-5">
            <p className="meta flex items-center justify-between">
              <span>inspector</span>
              <span className="text-faint/80">{current ? (pinned && !hover ? "pinned" : "hover") : "idle"}</span>
            </p>
            <AnimatePresence mode="wait" initial={false}>
              {current ? (
                <motion.div key={current.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="mt-4">
                  <h3 className="font-mono text-lg font-semibold tracking-[0.08em]">{current.label}</h3>
                  <p className="meta mt-4">purpose</p>
                  <p className="mt-1 text-[14px] text-text">{current.purpose}</p>
                  <p className="meta mt-4">technology</p>
                  <p className="mt-1 font-mono text-[13px] text-text">{current.tech}</p>
                  <p className="meta mt-4">seen in</p>
                  <p className="mt-1 font-mono text-[13px] text-muted">{current.seenIn.join(" · ")}</p>
                </motion.div>
              ) : (
                <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 font-mono text-[13px] text-muted">
                  Hover a node to inspect it. Click to pin.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: vertical list */}
        <ol className="space-y-2 md:hidden">
          {architecture.map((n) => {
            const open = openMobile === n.id;
            return (
              <li key={n.id} className="panel">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenMobile((o) => (o === n.id ? null : n.id))}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="font-mono text-[13px] font-semibold tracking-[0.1em]">{n.label}</span>
                  <span className="meta">{open ? "close" : "inspect"}</span>
                </button>
                {open ? (
                  <div className="border-t border-line px-4 py-3 text-[13.5px]">
                    <p className="text-text">{n.purpose}</p>
                    <p className="mt-2 font-mono text-[12.5px] text-muted">{n.tech}</p>
                    <p className="mt-1 font-mono text-[12px] text-faint">{n.seenIn.join(" · ")}</p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
