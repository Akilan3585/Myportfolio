"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { hueVar, stackLayers, type StackNode } from "@/content/resume";
import { Section } from "./section";

const ease = [0.2, 0.7, 0.2, 1] as const;

type Sel = { layer: number; node: number } | null;

/** [02] STACK: the technology map drawn as infrastructure layers with a detail readout. */
export function Stack() {
  const [hover, setHover] = useState<Sel>(null);
  const [pinned, setPinned] = useState<Sel>(null);
  const sel = hover ?? pinned;
  const current: { node: StackNode; layer: (typeof stackLayers)[number] } | null =
    sel ? { node: stackLayers[sel.layer].nodes[sel.node], layer: stackLayers[sel.layer] } : null;

  const toggle = (s: Sel) => setPinned((p) => (p && s && p.layer === s.layer && p.node === s.node ? null : s));

  return (
    <Section
      id="stack"
      index="02"
      eyebrow="Stack"
      title="My stack, drawn as infrastructure."
      lede="Seven layers from the interface down to source control. Hover or focus any node to see where I have actually used it."
      note={`${stackLayers.reduce((n, l) => n + l.nodes.length, 0)} nodes`}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ol className="relative">
            {stackLayers.map((layer, li) => {
              const hue = hueVar[layer.hue];
              const last = li === stackLayers.length - 1;
              return (
                <motion.li
                  key={layer.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, ease, delay: li * 0.07 }}
                  className="relative grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[150px_minmax(0,1fr)]"
                >
                  <div className="flex items-start gap-3 pt-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px]" style={{ background: hue }} aria-hidden />
                    <div>
                      <p className="meta">layer {String(li + 1).padStart(2, "0")}</p>
                      <h3 className="font-mono text-[13px] font-medium tracking-[0.06em] text-text uppercase">{layer.name}</h3>
                    </div>
                  </div>
                  <div className={`border-l border-line pb-6 pl-4 sm:pl-6 ${last ? "" : ""}`}>
                    <ul className="flex flex-wrap gap-2 pt-3" aria-label={`${layer.name} technologies`}>
                      {layer.nodes.map((node, ni) => {
                        const active = sel?.layer === li && sel?.node === ni;
                        const isPinned = pinned?.layer === li && pinned?.node === ni;
                        return (
                          <li key={node.name}>
                            <button
                              type="button"
                              data-cursor="INSPECT"
                              aria-pressed={isPinned}
                              onPointerEnter={() => setHover({ layer: li, node: ni })}
                              onPointerLeave={() => setHover(null)}
                              onFocus={() => setHover({ layer: li, node: ni })}
                              onBlur={() => setHover(null)}
                              onClick={() => toggle({ layer: li, node: ni })}
                              className="inline-flex items-center gap-2 border bg-bg px-2.5 py-1 font-mono text-[12.5px] transition-colors"
                              style={{
                                borderColor: active ? hue : "var(--line-strong)",
                                color: active ? hue : "var(--text)",
                                boxShadow: active ? `inset 0 0 0 1px color-mix(in oklab, ${hue} 40%, transparent)` : undefined,
                              }}
                            >
                              {node.logo ? <Image src={node.logo} alt="" width={16} height={16} className="h-4 w-4 object-contain" /> : null}
                              {node.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <div className="lg:col-span-4">
          <div className="panel ticks sticky top-20 min-h-[220px] p-5">
            <p className="meta flex items-center justify-between">
              <span>node detail</span>
              <span className="text-faint/80">{current ? (pinned && !hover ? "pinned" : "hover") : "idle"}</span>
            </p>
            <AnimatePresence mode="wait" initial={false}>
              {current ? (
                <motion.div
                  key={`${current.layer.id}-${current.node.name}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4"
                >
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase" style={{ color: hueVar[current.layer.hue] }}>
                    {current.layer.name}
                  </p>
                  <h4 className="mt-1 flex items-center gap-3 font-display text-2xl font-semibold tracking-tight">
                    {current.node.logo ? (
                      <Image src={current.node.logo} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
                    ) : null}
                    {current.node.name}
                  </h4>
                  <p className="meta mt-5">used for</p>
                  <ul className="mt-2 space-y-1.5 font-mono text-[13px] text-text">
                    {current.node.usedFor.map((u) => (
                      <li key={u} className="flex gap-2">
                        <span className="text-faint">→</span>
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
                  <p className="font-mono text-[13px] text-muted">Hover a node to inspect it. Click to pin.</p>
                  <p className="mt-6 font-mono text-[12px] leading-relaxed text-faint">
                    Every entry here maps to a project or the internship on the résumé. Nothing is listed that has not been used.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
